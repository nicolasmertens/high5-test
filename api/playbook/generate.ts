import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getPaymentByEmail } from "../lib/payment-storage.js";
import {
  createPlaybookRequest,
  getPlaybookStatus,
  updatePlaybookStatus,
  storePlaybookContent,
} from "../lib/playbook-storage.js";
import type { PlaybookRequest } from "../lib/playbook-storage.js";
import { generatePlaybook, type PlaybookGenerationInput } from "../lib/claude.js";
import { postHogTrack } from "../lib/send.js";

export const config = {
  maxDuration: 60,
};

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, profileHash, personalityType, topStrengths, discStyle, enneagramWing,
            personalityLabel, discPrimary, discTraits, enneagramPrimary, strengthScores } =
      req.body || {};

    if (!email || !profileHash || !personalityType || !topStrengths || !discStyle || !enneagramWing) {
      return res
        .status(400)
        .json({ error: "Missing required fields: email, profileHash, personalityType, topStrengths, discStyle, enneagramWing" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const payment = await getPaymentByEmail(normalizedEmail);
    if (!payment) {
      return res
        .status(403)
        .json({ error: "No purchase found for this email. Purchase the AI Playbook first." });
    }

    const validTiers = ["ai_playbook", "full_profile"];
    if (!validTiers.includes(payment.tier)) {
      return res
        .status(403)
        .json({ error: `Purchase tier "${payment.tier}" does not include AI Playbook. Required tier: ai_playbook or full_profile.` });
    }

    const existingStatus = await getPlaybookStatus(normalizedEmail);
    if (existingStatus) {
      if (existingStatus.status === "generating") {
        return res.status(409).json({
          error: "Playbook generation already in progress",
          status: existingStatus.status,
        });
      }
      if (existingStatus.status === "completed") {
        return res.status(409).json({
          error: "Playbook already generated",
          status: existingStatus.status,
        });
      }
    }

    const playbookRequest: PlaybookRequest = {
      email: normalizedEmail,
      profileHash,
      personalityType,
      topStrengths,
      discStyle,
      enneagramWing,
      createdAt: Date.now(),
    };

    await createPlaybookRequest(playbookRequest);

    await postHogTrack("playbook_generation_started", {
      distinct_id: normalizedEmail,
      profile_hash: profileHash,
      personality_type: personalityType,
      payment_tier: payment.tier,
    });

    await updatePlaybookStatus(normalizedEmail, { status: "generating" });

    const generationInput: PlaybookGenerationInput = {
      personalityType,
      personalityLabel: personalityLabel || "",
      personalityDescription: "",
      discStyle,
      discPrimary: discPrimary || discStyle.charAt(0),
      discTraits: discTraits || [],
      enneagramWing,
      enneagramPrimary: enneagramPrimary || parseInt(enneagramWing.split("w")[0], 10),
      topStrengths,
      strengthScores: strengthScores || {},
    };

    const startTime = Date.now();

    try {
      const content = await generatePlaybook(generationInput);
      const generationTimeMs = Date.now() - startTime;

      await storePlaybookContent(normalizedEmail, content);
      await updatePlaybookStatus(normalizedEmail, {
        status: "completed",
        completedAt: Date.now(),
        generationTimeMs,
      });

      await postHogTrack("playbook_generated", {
        distinct_id: normalizedEmail,
        personality_type: personalityType,
        generation_time_ms: generationTimeMs,
        payment_tier: payment.tier,
        model: "claude-3-5-haiku",
      });

      return res.status(200).json({
        message: "Playbook generated successfully",
        status: "completed",
        generationTimeMs,
      });
    } catch (genErr: unknown) {
      const errorMsg = genErr instanceof Error ? genErr.message : "Generation failed";
      await updatePlaybookStatus(normalizedEmail, {
        status: "failed",
        error: errorMsg,
      });

      await postHogTrack("playbook_generation_failed", {
        distinct_id: normalizedEmail,
        error: errorMsg,
        personality_type: personalityType,
      });

      console.error("Playbook generation error:", genErr);
      return res.status(500).json({
        error: "Playbook generation failed. Please try again later.",
        status: "failed",
      });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Playbook generation request failed";
    console.error("Playbook generate error:", err);
    return res
      .status(500)
      .json({ error: message });
  }
}
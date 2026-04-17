import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getPaymentByEmail } from "../lib/payment-storage.js";
import {
  createPlaybookRequest,
  getPlaybookStatus,
} from "../lib/playbook-storage.js";
import type { PlaybookRequest } from "../lib/playbook-storage.js";
import { postHogTrack } from "../lib/send.js";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, profileHash, personalityType, topStrengths, discStyle, enneagramWing } =
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
    if (existingStatus && existingStatus.status === "generating") {
      return res.status(409).json({
        error: "Playbook generation already in progress",
        status: existingStatus.status,
      });
    }
    if (existingStatus && existingStatus.status === "completed") {
      return res.status(409).json({
        error: "Playbook already generated",
        status: existingStatus.status,
      });
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

    await postHogTrack("playbook_generation_requested", {
      distinct_id: normalizedEmail,
      profile_hash: profileHash,
      personality_type: personalityType,
      payment_tier: payment.tier,
    });

    return res.status(202).json({
      message: "Playbook generation requested. Check status at /api/playbook/status?email=<email>",
      status: "pending",
    });
  } catch (err: any) {
    console.error("Playbook generate error:", err);
    return res
      .status(500)
      .json({ error: err.message || "Playbook generation request failed" });
  }
}
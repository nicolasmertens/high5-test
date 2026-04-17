import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createNurtureSubscriber, getNurtureSubscriberByEmail, updateNurtureSubscriber, scheduleNurtureEmail } from "./lib/nurture-subscribers.js";
import { getSubscriberByEmail } from "./lib/subscribers.js";
import { NURTURE_SCHEDULES } from "./lib/nurture-types.js";
import { postHogTrack } from "./lib/send.js";

export const config = {
  maxDuration: 60,
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, firstName, frameworkName, frameworkType, oneSentenceTraitSummary } = req.body || {};

  if (!email) {
    return res.status(400).json({ error: "Missing required field: email" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();

    const existingNurture = await getNurtureSubscriberByEmail(normalizedEmail);
    if (existingNurture) {
      if (existingNurture.suppressed) {
        return res.status(200).json({
          message: "Nurture subscriber exists and is suppressed (purchased or unsubscribed)",
          subscriberId: existingNurture.id,
        });
      }
      return res.status(200).json({
        message: "Already enrolled in nurture sequence",
        subscriberId: existingNurture.id,
      });
    }

    const welcomeSub = await getSubscriberByEmail(normalizedEmail);
    if (welcomeSub && welcomeSub.purchasedAt) {
      return res.status(200).json({
        message: "User has already purchased — not enrolling in nurture",
        subscriberId: null,
      });
    }

    const subFirstName = firstName || welcomeSub?.firstName || normalizedEmail.split("@")[0].split(/[._-]/)[0];
    const subFirstCapitalized = subFirstName.charAt(0).toUpperCase() + subFirstName.slice(1).toLowerCase();
    const subFrameworkName = frameworkName || welcomeSub?.frameworkName || "Strengths";
    const subFrameworkType = frameworkType || welcomeSub?.frameworkType || "Achiever";
    const subSummary = oneSentenceTraitSummary || welcomeSub?.oneSentenceTraitSummary || "You have unique strengths that set you apart";

    const subscriber = await createNurtureSubscriber({
      email: normalizedEmail,
      firstName: subFirstCapitalized,
      frameworkName: subFrameworkName,
      frameworkType: subFrameworkType,
      oneSentenceTraitSummary: subSummary,
    });

    const firstEmailAt = Date.now() + NURTURE_SCHEDULES[0] * 60 * 1000;
    subscriber.nextEmailAt = firstEmailAt;
    await updateNurtureSubscriber(subscriber);
    await scheduleNurtureEmail(subscriber.id, firstEmailAt);

    await postHogTrack("nurture_enrolled", {
      distinct_id: normalizedEmail,
      framework: subFrameworkName,
      framework_type: subFrameworkType,
    });

    return res.status(200).json({
      message: "Enrolled in nurture sequence",
      subscriberId: subscriber.id,
    });
  } catch (err: unknown) {
    console.error("Nurture enroll error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    if (message.includes("invalid_grant") || message.includes("GCS credentials incomplete") || message.includes("GCS_BUCKET_NAME")) {
      return res.status(503).json({ error: "Service temporarily unavailable" });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
}
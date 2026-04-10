import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createSubscriber, getSubscriberByEmail, updateSubscriber } from "./lib/subscribers";
import { sendWelcomeEmail } from "./lib/send";
import { EMAIL_SCHEDULES } from "./lib/types";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, firstName, frameworkName, frameworkType, oneSentenceTraitSummary } = req.body || {};

  if (!email || !firstName || !frameworkName || !frameworkType || !oneSentenceTraitSummary) {
    return res.status(400).json({
      error: "Missing required fields: email, firstName, frameworkName, frameworkType, oneSentenceTraitSummary",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  try {
    const existing = await getSubscriberByEmail(email);
    if (existing) {
      if (existing.suppressed) {
        return res.status(200).json({
          message: "Subscriber exists and is suppressed (purchased or unsubscribed)",
          subscriberId: existing.id,
        });
      }
      if (existing.emailsSent.length > 0) {
        return res.status(200).json({
          message: "Subscriber already exists",
          subscriberId: existing.id,
        });
      }
    }

    const subscriber = existing || await createSubscriber({
      email,
      firstName,
      frameworkName,
      frameworkType,
      oneSentenceTraitSummary,
    });

    const result = await sendWelcomeEmail(subscriber, 1);
    if (!result.success) {
      console.error("Failed to send welcome email:", result.error);
      return res.status(500).json({ error: "Failed to send welcome email", details: result.error });
    }

    subscriber.emailsSent.push(1);
    subscriber.nextEmailNumber = 2;
    subscriber.nextEmailAt = Date.now() + EMAIL_SCHEDULES[1] * 60 * 1000;

    await updateSubscriber(subscriber);

    return res.status(200).json({
      message: "Subscribed and welcome email sent",
      subscriberId: subscriber.id,
    });
  } catch (err: unknown) {
    console.error("Subscribe error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    if (message.includes("UPSTASH_REDIS")) {
      return res.status(503).json({ error: "Service temporarily unavailable. Please try again." });
    }
    return res.status(500).json({ error: message });
  }
}
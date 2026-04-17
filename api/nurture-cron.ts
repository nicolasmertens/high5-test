import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getNurtureSubscriber, updateNurtureSubscriber, getScheduledNurtureSubscribers, scheduleNurtureEmail } from "./lib/nurture-subscribers.js";
import { sendNurtureEmail, postHogTrack } from "./lib/send.js";
import { NURTURE_SCHEDULES } from "./lib/nurture-types.js";

export const config = {
  maxDuration: 60,
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const cronSecret = process.env.NURTURE_CRON_SECRET;
  const authHeader = req.headers["authorization"];
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const now = Date.now();
    const scheduled = await getScheduledNurtureSubscribers(now);

    const results: Array<{ subscriberId: string; emailNumber: number; success: boolean; error?: string }> = [];

    for (const { subscriberId } of scheduled) {
      const subscriber = await getNurtureSubscriber(subscriberId);
      if (!subscriber || subscriber.suppressed) {
        continue;
      }

      const emailNumber = subscriber.nextEmailNumber;
      if (emailNumber < 1 || emailNumber > 3) {
        continue;
      }

      if (subscriber.emailsSent.includes(emailNumber)) {
        continue;
      }

      const result = await sendNurtureEmail(subscriber, emailNumber);

      if (result.success) {
        subscriber.emailsSent.push(emailNumber);
        subscriber.nextEmailNumber = emailNumber + 1;

        if (emailNumber < 3) {
          const delayMs = (NURTURE_SCHEDULES[emailNumber] - NURTURE_SCHEDULES[emailNumber - 1]) * 60 * 1000;
          subscriber.nextEmailAt = Date.now() + delayMs;
          await scheduleNurtureEmail(subscriber.id, subscriber.nextEmailAt);
        } else {
          subscriber.nextEmailAt = 0;
        }

        await updateNurtureSubscriber(subscriber);

        await postHogTrack("nurture_email_sent", {
          distinct_id: subscriber.email,
          email_number: emailNumber,
          framework: subscriber.frameworkName,
          framework_type: subscriber.frameworkType,
        });
      }

      results.push({
        subscriberId,
        emailNumber,
        success: result.success,
        error: result.error,
      });
    }

    return res.status(200).json({
      processed: results.length,
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    console.error("Nurture cron error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    if (message.includes("invalid_grant") || message.includes("GCS credentials incomplete") || message.includes("GCS_BUCKET_NAME")) {
      return res.status(503).json({ error: "Service temporarily unavailable" });
    }
    return res.status(500).json({ error: message });
  }
}
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getSubscriber, updateSubscriber, getScheduledSubscribers } from "./lib/subscribers";
import { sendWelcomeEmail, postHogTrack } from "./lib/send";
import { EMAIL_SCHEDULES } from "./lib/types";

export const config = {
  maxDuration: 60,
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const cronSecret = process.env.WELCOME_CRON_SECRET;
  const authHeader = req.headers["authorization"];
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const now = Date.now();
    const scheduled = await getScheduledSubscribers(now);

    const results: Array<{ subscriberId: string; emailNumber: number; success: boolean; error?: string }> = [];

    for (const { subscriberId } of scheduled) {
      const subscriber = await getSubscriber(subscriberId);
      if (!subscriber || subscriber.suppressed) {
        continue;
      }

      const emailNumber = subscriber.nextEmailNumber;
      if (emailNumber < 2 || emailNumber > 5) {
        continue;
      }

      if (subscriber.emailsSent.includes(emailNumber)) {
        continue;
      }

      const result = await sendWelcomeEmail(subscriber, emailNumber);

      if (result.success) {
        subscriber.emailsSent.push(emailNumber);
        subscriber.nextEmailNumber = emailNumber + 1;

        if (emailNumber < 5) {
          const delayMs = (EMAIL_SCHEDULES[emailNumber] - EMAIL_SCHEDULES[emailNumber - 1]) * 60 * 1000;
          subscriber.nextEmailAt = Date.now() + delayMs;
        } else {
          subscriber.nextEmailAt = 0;
        }

        await updateSubscriber(subscriber);

        await postHogTrack("welcome_email_sent", {
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
    console.error("Welcome cron error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return res.status(500).json({ error: message });
  }
}
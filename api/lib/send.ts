import { Resend } from "resend";
import type { WelcomeEmailData, Subscriber } from "./types";
import { WELCOME_SEQUENCE, FROM_EMAIL, REPLY_TO, EMAIL_SCHEDULES } from "./types";
import { htmlEmails } from "./email-html";
import { plainTextEmails } from "./email-text";

const UTM_PARAMS = {
  utm_source: "email",
  utm_medium: "welcome_sequence",
} as const;

function buildUpgradeUrl(emailNumber: number): string {
  const params = new URLSearchParams({
    ...UTM_PARAMS,
    utm_campaign: `welcome_email_${emailNumber}`,
    utm_content: "cta_upgrade",
  });
  return `https://1test.me/?${params.toString()}#upgrade`;
}

function buildInviteUrl(emailNumber: number): string {
  const params = new URLSearchParams({
    ...UTM_PARAMS,
    utm_campaign: `welcome_email_${emailNumber}`,
    utm_content: "cta_invite",
  });
  return `https://1test.me/?${params.toString()}#invite`;
}

function buildUnsubscribeLink(subscriberId: string): string {
  return `https://1test.me/api/unsubscribe?sid=${subscriberId}`;
}

const SUBJECTS: Record<number, string> = {
  1: "Your personality results are ready",
  2: "You're more than just a {type}",
  3: "People who understand their personality outperform their peers",
  4: "What happens when 4 personality types walk into a meeting",
  5: "You started something — finish it",
};

function getSubject(emailNumber: number, data: WelcomeEmailData): string {
  return SUBJECTS[emailNumber]
    .replace("{type}", data.frameworkType);
}

function buildEmailData(subscriber: Subscriber, emailNumber: number): WelcomeEmailData {
  return {
    firstName: subscriber.firstName,
    frameworkName: subscriber.frameworkName,
    frameworkType: subscriber.frameworkType,
    oneSentenceTraitSummary: subscriber.oneSentenceTraitSummary,
    upgradeUrl: buildUpgradeUrl(emailNumber),
    inviteUrl: emailNumber === 4 ? buildInviteUrl(emailNumber) : undefined,
    unsubscribeLink: buildUnsubscribeLink(subscriber.id),
  };
}

let resendClient: Resend | null = null;

function getResend(): Resend {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) throw new Error("RESEND_API_KEY must be set");
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

export async function sendWelcomeEmail(
  subscriber: Subscriber,
  emailNumber: number
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  if (emailNumber < 1 || emailNumber > 5) {
    return { success: false, error: `Invalid email number: ${emailNumber}` };
  }

  if (subscriber.suppressed) {
    return { success: false, error: "Subscriber is suppressed" };
  }

  if (subscriber.emailsSent.includes(emailNumber)) {
    return { success: false, error: `Email ${emailNumber} already sent` };
  }

  const data = buildEmailData(subscriber, emailNumber);
  const htmlContent = htmlEmails[emailNumber](data);
  const plainTextContent = plainTextEmails[emailNumber](data);
  const subject = getSubject(emailNumber, data);

  try {
    const result = await getResend().emails.send({
      from: FROM_EMAIL,
      to: subscriber.email,
      subject,
      html: htmlContent,
      text: plainTextContent,
      replyTo: REPLY_TO,
      headers: {
        "List-Unsubscribe": `<${data.unsubscribeLink}>`,
      },
    });

    if (result.error) {
      console.error(`Failed to send email ${emailNumber} to ${subscriber.email}:`, result.error);
      return { success: false, error: result.error.message };
    }

    return { success: true, messageId: result.data?.id };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`Error sending email ${emailNumber} to ${subscriber.email}:`, message);
    return { success: false, error: message };
  }
}

export async function postHogTrack(event: string, properties: Record<string, unknown>): Promise<void> {
  const posthogKey = process.env.POSTHOG_API_KEY;
  if (!posthogKey) return;

  try {
    await fetch("https://us.posthog.com/capture/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: posthogKey,
        event,
        properties: {
          ...properties,
          $lib: "1test-backend",
          distinct_id: properties.distinct_id || "server",
        },
      }),
    });
  } catch (err) {
    console.error("PostHog tracking error:", err);
  }
}

export function getNextEmailDelay(emailNumber: number): number {
  if (emailNumber <= 0 || emailNumber > 5) return 0;
  return EMAIL_SCHEDULES[emailNumber - 1] * 60 * 1000;
}
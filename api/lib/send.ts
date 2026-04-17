import { Resend } from "resend";
import type { WelcomeEmailData, Subscriber } from "./types.js";
import type { NurtureEmailData, NurtureSubscriber } from "./nurture-types.js";
import { WELCOME_SEQUENCE, FROM_EMAIL, REPLY_TO, EMAIL_SCHEDULES } from "./types.js";
import { htmlEmails } from "./email-html.js";
import { plainTextEmails } from "./email-text.js";
import { nurtureHtmlEmails } from "./nurture-email-html.js";
import { nurturePlainTextEmails } from "./nurture-email-text.js";

const WELCOME_UTM_PARAMS = {
  utm_source: "email",
  utm_medium: "welcome_sequence",
} as const;

const NURTURE_UTM_PARAMS = {
  utm_source: "email",
  utm_medium: "nurture_sequence",
} as const;

function buildUpgradeUrl(emailNumber: number): string {
  const params = new URLSearchParams({
    ...WELCOME_UTM_PARAMS,
    utm_campaign: `welcome_email_${emailNumber}`,
    utm_content: "cta_upgrade",
  });
  return `https://1test.me/?${params.toString()}#upgrade`;
}

function buildInviteUrl(emailNumber: number): string {
  const params = new URLSearchParams({
    ...WELCOME_UTM_PARAMS,
    utm_campaign: `welcome_email_${emailNumber}`,
    utm_content: "cta_invite",
  });
  return `https://1test.me/?${params.toString()}#invite`;
}

function buildNurtureUpgradeUrl(emailNumber: number): string {
  const params = new URLSearchParams({
    ...NURTURE_UTM_PARAMS,
    utm_campaign: `nurture_email_${emailNumber}`,
    utm_content: "cta_upgrade",
  });
  return `https://1test.me/?${params.toString()}#upgrade`;
}

function buildNurtureFaqUrl(emailNumber: number): string {
  const params = new URLSearchParams({
    ...NURTURE_UTM_PARAMS,
    utm_campaign: `nurture_email_${emailNumber}`,
    utm_content: "link_faq",
  });
  return `https://1test.me/?${params.toString()}#faq`;
}

function buildUnsubscribeLink(subscriberId: string): string {
  return `https://1test.me/api/unsubscribe?sid=${subscriberId}`;
}

function buildNurtureUnsubscribeLink(subscriberId: string): string {
  return `https://1test.me/api/unsubscribe?type=nurture&sid=${subscriberId}`;
}

const WELCOME_SUBJECTS: Record<number, string> = {
  1: "Your personality results are ready",
  2: "You're more than just a {type}",
  3: "People who understand their personality outperform their peers",
  4: "What happens when 4 personality types walk into a meeting",
  5: "You started something — finish it",
};

function getSubject(emailNumber: number, data: WelcomeEmailData): string {
  return WELCOME_SUBJECTS[emailNumber]
    .replace("{type}", data.frameworkType);
}

const NURTURE_SUBJECTS: Record<number, string> = {
  1: "Curious about your full {type} profile?",
  2: "What {type} profiles look like when you go deeper",
  3: "Your results are still here — and a few questions answered",
};

function getNurtureSubject(emailNumber: number, data: NurtureEmailData): string {
  return NURTURE_SUBJECTS[emailNumber]
    .replace(/{type}/g, data.frameworkType);
}

function buildNurtureEmailData(subscriber: NurtureSubscriber, emailNumber: number): NurtureEmailData {
  return {
    firstName: subscriber.firstName,
    frameworkName: subscriber.frameworkName,
    frameworkType: subscriber.frameworkType,
    oneSentenceTraitSummary: subscriber.oneSentenceTraitSummary,
    upgradeUrl: buildNurtureUpgradeUrl(emailNumber),
    faqUrl: buildNurtureFaqUrl(emailNumber),
    unsubscribeLink: buildNurtureUnsubscribeLink(subscriber.id),
  };
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

export async function sendNurtureEmail(
  subscriber: NurtureSubscriber,
  emailNumber: number
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  if (emailNumber < 1 || emailNumber > 3) {
    return { success: false, error: `Invalid nurture email number: ${emailNumber}` };
  }

  if (subscriber.suppressed) {
    return { success: false, error: "Nurture subscriber is suppressed" };
  }

  if (subscriber.emailsSent.includes(emailNumber)) {
    return { success: false, error: `Nurture email ${emailNumber} already sent` };
  }

  const data = buildNurtureEmailData(subscriber, emailNumber);
  const htmlContent = nurtureHtmlEmails[emailNumber](data);
  const plainTextContent = nurturePlainTextEmails[emailNumber](data);
  const subject = getNurtureSubject(emailNumber, data);

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
      console.error(`Failed to send nurture email ${emailNumber} to ${subscriber.email}:`, result.error);
      return { success: false, error: result.error.message };
    }

    return { success: true, messageId: result.data?.id };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`Error sending nurture email ${emailNumber} to ${subscriber.email}:`, message);
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

export async function sendInviteEmail(data: {
  inviterName: string;
  inviteeEmail: string;
  referralCode: string;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const referralUrl = `https://1test.me/?ref=${data.referralCode}&utm_source=email&utm_medium=invite&utm_campaign=invite_email`;

  const htmlContent = `<!DOCTYPE html>
<html>
<head><meta name="viewport" content="width=device-width,initial-scale=1"><title>1Test</title></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f9fafb;color:#111827;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;">
    <tr>
      <td style="background:#111827;padding:24px 32px;color:#ffffff;font-size:20px;font-weight:bold;letter-spacing:-0.01em;">1Test</td>
    </tr>
    <tr>
      <td style="padding:32px;font-size:16px;line-height:1.6;">
        <p>${data.inviterName} just completed their free personality assessment on 1Test — and they'd like to compare profiles with you.</p>
        <p>Take the free assessment (about 10 minutes) and you'll both get a personalized relationship report showing:</p>
        <ul style="padding-left:20px;">
          <li>How you communicate with each other</li>
          <li>Where your strengths overlap and complement</li>
          <li>How to avoid friction and work better together</li>
        </ul>
        <p>Your results stay private until you choose to share them.</p>
        <div style="text-align:center;">
          <a href="${referralUrl}" style="display:inline-block;background-color:#111827;color:#ffffff;padding:14px 32px;border-radius:6px;font-size:16px;font-weight:bold;text-decoration:none;margin:16px 0;">Take the Free Assessment →</a>
        </div>
        <p>— 1Test<br><span style="color:#6b7280;font-size:13px;">One Test. Four Frameworks.</span></p>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const plainTextContent = `${data.inviterName} wants to see how you work together

${data.inviterName} just completed their free personality assessment on 1Test — and they'd like to compare profiles with you.

Take the free assessment (about 10 minutes) and you'll both get a personalized relationship report showing:
- How you communicate with each other
- Where your strengths overlap and complement
- How to avoid friction and work better together

Your results stay private until you choose to share them.

Take the Free Assessment:
${referralUrl}

— 1Test
One Test. Four Frameworks.`;

  try {
    const result = await getResend().emails.send({
      from: FROM_EMAIL,
      to: data.inviteeEmail,
      subject: `${data.inviterName} wants to see how you work together`,
      html: htmlContent,
      text: plainTextContent,
      replyTo: REPLY_TO,
    });

    if (result.error) {
      console.error(`Failed to send invite email to ${data.inviteeEmail}:`, result.error);
      return { success: false, error: result.error.message };
    }

    return { success: true, messageId: result.data?.id };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`Error sending invite email to ${data.inviteeEmail}:`, message);
    return { success: false, error: message };
  }
}

export async function sendReportReadyEmail(data: {
  inviterName: string;
  inviterEmail: string;
  inviteeName: string;
  reportId: string;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const reportUrl = `https://1test.me/relationship/${data.reportId}?utm_source=email&utm_medium=notification&utm_campaign=report_ready`;

  const htmlContent = `<!DOCTYPE html>
<html>
<head><meta name="viewport" content="width=device-width,initial-scale=1"><title>1Test</title></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f9fafb;color:#111827;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;">
    <tr>
      <td style="background:#111827;padding:24px 32px;color:#ffffff;font-size:20px;font-weight:bold;letter-spacing:-0.01em;">1Test</td>
    </tr>
    <tr>
      <td style="padding:32px;font-size:16px;line-height:1.6;">
        <p>Hi ${data.inviterName},</p>
        <p><strong>${data.inviteeName}</strong> completed their personality assessment. Your relationship report is ready!</p>
        <div style="text-align:center;">
          <a href="${reportUrl}" style="display:inline-block;background-color:#111827;color:#ffffff;padding:14px 32px;border-radius:6px;font-size:16px;font-weight:bold;text-decoration:none;margin:16px 0;">View Your Relationship Report →</a>
        </div>
        <p>— 1Test<br><span style="color:#6b7280;font-size:13px;">One Test. Four Frameworks.</span></p>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const plainTextContent = `Hi ${data.inviterName},

${data.inviteeName} completed their personality assessment. Your relationship report is ready!

View Your Relationship Report:
${reportUrl}

— 1Test
One Test. Four Frameworks.`;

  try {
    const result = await getResend().emails.send({
      from: FROM_EMAIL,
      to: data.inviterEmail,
      subject: `Your relationship report with ${data.inviteeName} is ready`,
      html: htmlContent,
      text: plainTextContent,
      replyTo: REPLY_TO,
    });

    if (result.error) {
      console.error(`Failed to send report ready email to ${data.inviterEmail}:`, result.error);
      return { success: false, error: result.error.message };
    }

    return { success: true, messageId: result.data?.id };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`Error sending report ready email to ${data.inviterEmail}:`, message);
    return { success: false, error: message };
  }
}
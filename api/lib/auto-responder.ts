import { Resend } from "resend";
import { FROM_EMAIL, REPLY_TO } from "./types.js";
import type { EmailCategory } from "./inbound-types.js";

const SITE_URL = "https://1test.me";
const PRIVACY_URL = `${SITE_URL}/privacy`;

function extractFirstName(from: string): string {
  const localPart = from.split("@")[0];
  if (!localPart) return "there";
  const parts = localPart.replace(/[._+-]/g, " ").split(" ");
  const first = parts[0];
  if (!first) return "there";
  return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function footerHtml(unsubscribeLink: string, gdprExtra = false): string {
  const gdprNote = gdprExtra
    ? ` This does not affect your right to submit data requests under GDPR — you may contact us at any time at privacy@1test.me.`
    : "";
  return `
    <tr>
      <td style="padding:24px 32px;font-size:13px;line-height:1.5;color:#6b7280;border-top:1px solid #e5e7eb;">
        <hr style="border-color:#e5e7eb;margin:0 0 16px 0;">
        You received this email from 1Test. If you no longer want to receive these emails, <a href="${unsubscribeLink}" style="color:#374151;">unsubscribe</a>.${gdprExtra ? esc(gdprNote) : ""}
      </td>
    </tr>`;
}

function footerText(unsubscribeLink: string, gdprExtra = false): string {
  const gdprNote = gdprExtra
    ? "\nThis does not affect your right to submit data requests under GDPR — you may contact us at any time at privacy@1test.me."
    : "";
  return `\n---\n\nYou received this email from 1Test. If you no longer want to receive these emails, ${unsubscribeLink}.${gdprExtra ? gdprNote : ""}`;
}

function layoutHtml(preview: string, bodyContent: string, footerContent: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta name="viewport" content="width=device-width,initial-scale=1"><title>1Test</title></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f9fafb;color:#111827;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;">
    <tr>
      <td style="background:#111827;padding:24px 32px;color:#ffffff;font-size:20px;font-weight:bold;letter-spacing:-0.01em;">1Test</td>
    </tr>
    <tr>
      <td style="padding:32px;font-size:16px;line-height:1.6;">
        <!--[if !mso]><!--><div style="display:none;font-size:1px;color:#f9fafb;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${preview}</div><!--<![endif]-->
        ${bodyContent}
      </td>
    </tr>
    ${footerContent}
  </table>
</body>
</html>`;
}

interface AutoTemplate {
  subject: string;
  preview: string;
  htmlBody: (firstName: string, unsubscribeLink: string) => string;
  textBody: (firstName: string, unsubscribeLink: string) => string;
  isGdpr: boolean;
}

const TEMPLATES: Record<string, AutoTemplate> = {
  test_results: {
    subject: "Your 1Test results are ready",
    preview: "Your personality assessment results are available — here's how to access them.",
    isGdpr: false,
    htmlBody: (firstName, unsubLink) => `<p>Hi ${esc(firstName)},</p>
      <p>Thanks for reaching out! Your personality assessment results are available at <a href="${SITE_URL}" style="color:#111827;font-weight:bold;">1test.me</a>.</p>
      <p>If you completed the free test, you can view your top 5 Strengths and a teaser of your 16 Personalities, DISC, and Enneagram profiles on your results page.</p>
      <p>Want the full picture? The Full Profile gives you:</p>
      <ul style="padding-left:20px;line-height:2;">
        <li>All 20 Strengths ranked, not just the top 5</li>
        <li>Detailed breakdowns across all four frameworks</li>
        <li>Career alignment and growth areas specific to your profile</li>
        <li>PDF export and shareable card</li>
      </ul>
      <p>You can upgrade anytime from your results page.</p>
      <p>Let us know if you need anything else!</p>
      <p>1Test</p>`,
    textBody: (firstName, unsubLink) => `Hi ${firstName},

Thanks for reaching out! Your personality assessment results are available at 1test.me.

If you completed the free test, you can view your top 5 Strengths and a teaser of your 16 Personalities, DISC, and Enneagram profiles on your results page.

Want the full picture? The Full Profile gives you:

- All 20 Strengths ranked, not just the top 5
- Detailed breakdowns across all four frameworks
- Career alignment and growth areas specific to your profile
- PDF export and shareable card

You can upgrade anytime from your results page.

Let us know if you need anything else!

1Test${footerText(unsubLink)}`,
  },

  pricing: {
    subject: "1Test pricing and plans",
    preview: "Here's a clear breakdown of what's free and what's included in each upgrade.",
    isGdpr: false,
    htmlBody: (firstName, _unsubLink) => `<p>Hi ${esc(firstName)},</p>
      <p>Thanks for asking about our pricing! Here's a clear breakdown:</p>
      <ul style="padding-left:20px;line-height:2;">
        <li><strong>Free:</strong> Top 5 Strengths + teaser of your 16 Personalities, DISC, and Enneagram profiles</li>
        <li><strong>Full Profile ($9-15):</strong> All 20 Strengths ranked + detailed profiles across all four frameworks + career alignment + growth areas + PDF export + shareable card</li>
        <li><strong>AI Playbook ($19):</strong> Everything in the Full Profile + personalized career paths, growth plans, book recommendations, and communication guides — generated from your unique profile</li>
      </ul>
      <p>No subscriptions. No recurring charges. One payment, yours forever.</p>
      <p>Start with the free test at <a href="${SITE_URL}" style="color:#111827;font-weight:bold;">1test.me</a> and upgrade anytime.</p>
      <p>1Test</p>`,
    textBody: (firstName, unsubLink) => `Hi ${firstName},

Thanks for asking about our pricing! Here's a clear breakdown:

FREE:
- Top 5 Strengths + teaser of your 16 Personalities, DISC, and Enneagram profiles

FULL PROFILE ($9-15, one-time payment):
- All 20 Strengths ranked + detailed profiles across all four frameworks (16 Personalities, DISC, Enneagram, Strengths)
- Career alignment insights
- Growth areas specific to your profile
- PDF export and shareable card

AI PLAYBOOK ($19, one-time payment):
- Everything in the Full Profile
- Personalized career paths generated from your unique profile
- Growth plans and book recommendations
- Communication guides tailored to how you work with others

No subscriptions. No recurring charges. One payment, yours forever.

Start with the free test at ${SITE_URL} and upgrade anytime.

1Test${footerText(unsubLink)}`,
  },

  account: {
    subject: "We've received your message — 1Test",
    preview: "Our team is reviewing your request. We'll follow up soon.",
    isGdpr: false,
    htmlBody: (firstName, _unsubLink) => `<p>Hi ${esc(firstName)},</p>
      <p>We've received your message and our team is looking into it.</p>
      <p>We typically respond within 24-48 hours. In the meantime, here are a few things that might help:</p>
      <ul style="padding-left:20px;line-height:2;">
        <li>Access your results directly at <a href="${SITE_URL}" style="color:#111827;font-weight:bold;">1test.me</a></li>
        <li>Try clearing your browser cache and reloading the page</li>
        <li>Make sure you're using the same browser where you completed the test — your results are stored locally</li>
      </ul>
      <p>If your issue is urgent or you have additional details to share, just reply to this email.</p>
      <p>We'll get back to you as soon as we can.</p>
      <p>1Test</p>`,
    textBody: (firstName, unsubLink) => `Hi ${firstName},

We've received your message and our team is looking into it.

We typically respond within 24-48 hours. In the meantime, here are a few things that might help:

- Access your results directly at ${SITE_URL}
- Try clearing your browser cache and reloading the page
- Make sure you're using the same browser where you completed the test — your results are stored locally

If your issue is urgent or you have additional details to share, just reply to this email.

We'll get back to you as soon as we can.

1Test${footerText(unsubLink)}`,
  },

  gdpr: {
    subject: "Your data request — 1Test",
    preview: "We've received your data-related request and are processing it per GDPR requirements.",
    isGdpr: true,
    htmlBody: (firstName, _unsubLink) => `<p>Hi ${esc(firstName)},</p>
      <p>We've received your data-related request.</p>
      <p>Under the General Data Protection Regulation (GDPR), we are required to:</p>
      <ul style="padding-left:20px;line-height:2;">
        <li>Acknowledge your request within 72 hours (this email serves as that acknowledgment)</li>
        <li>Complete your request within 30 days</li>
      </ul>
      <p>Our team is reviewing your request and will follow up with next steps.</p>
      <p><strong>What happens next:</strong></p>
      <ol style="padding-left:20px;line-height:2;">
        <li>We verify your identity using the email address associated with your request</li>
        <li>We process your request (deletion, export, or correction) within the GDPR-mandated timeframe</li>
        <li>You receive a confirmation when the process is complete</li>
      </ol>
      <p><strong>Your rights under GDPR:</strong></p>
      <ul style="padding-left:20px;line-height:2;">
        <li>Right to access your personal data (Art. 15)</li>
        <li>Right to rectification (Art. 16)</li>
        <li>Right to erasure (Art. 17)</li>
        <li>Right to data portability (Art. 20)</li>
      </ul>
      <p>You can view our full Privacy Policy at <a href="${PRIVACY_URL}" style="color:#111827;font-weight:bold;">1test.me/privacy</a>.</p>
      <p>If you have additional questions about your data, reply to this email and reference your original request.</p>
      <p>1Test (Data Privacy Team)</p>`,
    textBody: (firstName, unsubLink) => `Hi ${firstName},

We've received your data-related request.

Under GDPR, we are required to:
- Acknowledge your request within 72 hours (this email serves as that acknowledgment)
- Complete your request within 30 days

What happens next:
1. We verify your identity using the email address associated with your request
2. We process your request (deletion, export, or correction) within the GDPR-mandated timeframe
3. You receive a confirmation when the process is complete

Your rights under GDPR:
- Right to access your personal data (Art. 15)
- Right to rectification (Art. 16)
- Right to erasure (Art. 17)
- Right to data portability (Art. 20)

You can view our full Privacy Policy at ${PRIVACY_URL}.

If you have additional questions about your data, reply to this email and reference your original request.

1Test (Data Privacy Team)${footerText(unsubLink, true)}`,
  },

  refund_acknowledgment: {
    subject: "Your refund request — 1Test",
    preview: "We've received your refund request and are reviewing it.",
    isGdpr: false,
    htmlBody: (firstName, _unsubLink) => `<p>Hi ${esc(firstName)},</p>
      <p>We've received your refund request and our team is reviewing it.</p>
      <p>We understand that sometimes things don't work out as expected, and we want to handle this fairly.</p>
      <p><strong>Here's what happens next:</strong></p>
      <ol style="padding-left:20px;line-height:2;">
        <li>Our team reviews your request</li>
        <li>We follow up within 24-48 hours with next steps</li>
        <li>You receive a direct response — no automated runaround</li>
      </ol>
      <p>We appreciate your patience while we look into this.</p>
      <p>1Test</p>`,
    textBody: (firstName, unsubLink) => `Hi ${firstName},

We've received your refund request and our team is reviewing it.

We understand that sometimes things don't work out as expected, and we want to handle this fairly.

Here's what happens next:
1. Our team reviews your request
2. We follow up within 24-48 hours with next steps
3. You receive a direct response — no automated runaround

We appreciate your patience while we look into this.

1Test${footerText(unsubLink)}`,
  },
};

const CATEGORY_TO_TEMPLATE: Partial<Record<EmailCategory, string>> = {
  general_support: "test_results",
  pricing: "pricing",
  account_technical: "account",
  gdpr_data: "gdpr",
  refund: "refund_acknowledgment",
};

export function selectTemplateForCategory(category: EmailCategory): string | null {
  return CATEGORY_TO_TEMPLATE[category] ?? null;
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

export async function sendAutoResponse(
  email: { from: string; subject: string; text: string; category: EmailCategory },
): Promise<{ success: boolean; templateUsed: string | null; error?: string }> {
  const templateKey = selectTemplateForCategory(email.category);
  if (!templateKey) {
    return { success: false, templateUsed: null };
  }

  const template = TEMPLATES[templateKey];
  if (!template) {
    return { success: false, templateUsed: null };
  }

  const firstName = extractFirstName(email.from);
  const unsubLink = `mailto:hello@1test.me?subject=Unsubscribe`;

  const htmlContent = layoutHtml(
    template.preview,
    template.htmlBody(firstName, unsubLink),
    footerHtml(unsubLink, template.isGdpr),
  );
  const textContent = template.textBody(firstName, unsubLink);

  try {
    const result = await getResend().emails.send({
      from: FROM_EMAIL,
      to: email.from,
      subject: template.subject,
      html: htmlContent,
      text: textContent,
      replyTo: REPLY_TO,
      headers: {
        "List-Unsubscribe": `<${unsubLink}>`,
      },
    });

    if (result.error) {
      console.error(`Auto-response failed for ${email.from}:`, result.error);
      return { success: false, templateUsed: templateKey, error: result.error.message };
    }

    return { success: true, templateUsed: templateKey };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`Auto-response error for ${email.from}:`, message);
    return { success: false, templateUsed: templateKey, error: message };
  }
}
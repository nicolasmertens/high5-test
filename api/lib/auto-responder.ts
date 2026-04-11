import { Resend } from "resend";
import { FROM_EMAIL, REPLY_TO } from "./types";
import type { InboundEmail } from "./inbound-types";

const SITE_URL = "https://1test.me";
const SUPPORT_EMAIL = REPLY_TO;

function layout(preview: string, bodyContent: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta name="viewport" content="width=device-width,initial-scale=1"><title>1Test</title></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f9fafb;color:#111827;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;">
    <tr>
      <td style="background:#111827;padding:24px 32px;color:#ffffff;font-size:20px;font-weight:bold;letter-spacing:-0.01em;">1Test</td>
    </tr>
    <tr>
      <td style="padding:32px;line-height:1.6;font-size:15px;">
        ${bodyContent}
      </td>
    </tr>
    <tr>
      <td style="padding:24px 32px;font-size:13px;line-height:1.5;color:#6b7280;border-top:1px solid #e5e7eb;">
        <hr style="border-color:#e5e7eb;margin:0 0 16px 0;">
        This is an automated response from 1Test. If you need further help, reply to this email.
      </td>
    </tr>
  </table>
</body>
</html>`;
}

const TEMPLATES: Record<string, {
  subject: string;
  html: string;
  text: string;
}> = {
  test_results: {
    subject: "Your 1Test results are ready",
    html: layout(
      "Your results",
      `<p>Hi there,</p>
      <p>Thanks for reaching out! Your personality assessment results are available at <a href="${SITE_URL}" style="color:#111827;font-weight:bold;">1test.me</a>.</p>
      <p>If you completed the free test, you can view your top strengths and a teaser of your 16 Personalities, DISC, and Enneagram profiles right on your results page.</p>
      <p>For a deeper dive, check out the Full Profile upgrade which gives you all 20 strengths ranked, plus detailed breakdowns across all four frameworks.</p>
      <p>Let us know if you need anything else!</p>`
    ),
    text: `Hi there,

Thanks for reaching out! Your personality assessment results are available at ${SITE_URL}.

If you completed the free test, you can view your top strengths and a teaser of your 16 Personalities, DISC, and Enneagram profiles right on your results page.

For a deeper dive, check out the Full Profile upgrade which gives you all 20 strengths ranked, plus detailed breakdowns across all four frameworks.

Let us know if you need anything else!

— 1Test Support`,
  },
  pricing: {
    subject: "1Test pricing and plans",
    html: layout(
      "Pricing info",
      `<p>Hi there,</p>
      <p>Thanks for asking about our pricing! Here's a quick overview:</p>
      <ul style="padding-left:20px;line-height:2;">
        <li><strong>Free:</strong> Top 5 strengths + teaser of your 16 Personalities, DISC, and Enneagram profiles</li>
        <li><strong>Full Profile ($9-15):</strong> All 20 strengths ranked + detailed profiles across all four frameworks + PDF export + shareable card</li>
        <li><strong>AI Playbook ($19):</strong> Personalized career paths, growth plans, book recommendations, and communication guides — generated from your unique profile</li>
      </ul>
      <p>You can start with the free test at <a href="${SITE_URL}" style="color:#111827;font-weight:bold;">1test.me</a> and upgrade anytime.</p>`
    ),
    text: `Hi there,

Thanks for asking about our pricing! Here's a quick overview:

- Free: Top 5 strengths + teaser of your 16 Personalities, DISC, and Enneagram profiles
- Full Profile ($9-15): All 20 strengths ranked + detailed profiles across all four frameworks + PDF export + shareable card
- AI Playbook ($19): Personalized career paths, growth plans, book recommendations, and communication guides

You can start with the free test at ${SITE_URL} and upgrade anytime.

— 1Test Support`,
  },
  account: {
    subject: "Your 1Test account",
    html: layout(
      "Account help",
      `<p>Hi there,</p>
      <p>We've received your message and our team will look into it. We typically respond within 24-48 hours.</p>
      <p>In the meantime, you can:</p>
      <ul style="padding-left:20px;line-height:2;">
        <li>Access your results at <a href="${SITE_URL}" style="color:#111827;font-weight:bold;">1test.me</a></li>
        <li>Check your email for any previous communications from us</li>
      </ul>
      <p>We'll get back to you as soon as possible.</p>`
    ),
    text: `Hi there,

We've received your message and our team will look into it. We typically respond within 24-48 hours.

In the meantime, you can:
- Access your results at ${SITE_URL}
- Check your email for any previous communications from us

We'll get back to you as soon as possible.

— 1Test Support`,
  },
  gdpr: {
    subject: "Your data request — 1Test",
    html: layout(
      "Data request",
      `<p>Hi there,</p>
      <p>We've received your data-related request. Under GDPR, we are required to acknowledge your request within 72 hours and complete it within 30 days. We take data privacy seriously.</p>
      <p>Our team will review your request and follow up with next steps.</p>
      <p>If you'd like to delete your data immediately, you can do so from your results page at <a href="${SITE_URL}" style="color:#111827;font-weight:bold;">1test.me</a>.</p>`
    ),
    text: `Hi there,

We've received your data-related request. Under GDPR, we are required to acknowledge your request within 72 hours and complete it within 30 days. We take data privacy seriously.

Our team will review your request and follow up with next steps.

If you'd like to delete your data immediately, you can do so from your results page at ${SITE_URL}.

— 1Test Support`,
  },
  general: {
    subject: "Thanks for contacting 1Test",
    html: layout(
      "Thanks for reaching out",
      `<p>Hi there,</p>
      <p>Thanks for reaching out to 1Test! We've received your message and will get back to you as soon as possible.</p>
      <p>In the meantime, feel free to explore your personality results at <a href="${SITE_URL}" style="color:#111827;font-weight:bold;">1test.me</a>.</p>`
    ),
    text: `Hi there,

Thanks for reaching out to 1Test! We've received your message and will get back to you as soon as possible.

In the meantime, feel free to explore your personality results at ${SITE_URL}.

— 1Test Support`,
  },
};

const SUBJECT_KEYWORDS: Record<string, string[]> = {
  test_results: ["results", "result", "score", "scores", "assessment", "test", "report", "profile"],
  pricing: ["price", "pricing", "cost", "how much", "plan", "plans", "upgrade", "subscription", "tier"],
  account: ["account", "login", "password", "sign in", "sign up", "access", "can't", "broken", "error", "not working"],
  gdpr: ["gdpr", "data", "delete", "privacy", "personal data", "right to", "forget"],
};

export function selectTemplate(subject: string, text: string): string {
  const combined = `${subject} ${text || ""}`.toLowerCase();

  let bestMatch = "general";
  let bestScore = 0;

  for (const [template, keywords] of Object.entries(SUBJECT_KEYWORDS)) {
    const score = keywords.filter((kw) => combined.includes(kw)).length;
    if (score > bestScore) {
      bestScore = score;
      bestMatch = template;
    }
  }

  return bestMatch;
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
  email: InboundEmail,
): Promise<{ success: boolean; templateUsed: string | null; error?: string }> {
  if (email.category !== "general_support") {
    return { success: false, templateUsed: null };
  }

  const templateKey = selectTemplate(email.subject, email.text);
  const template = TEMPLATES[templateKey];
  if (!template) {
    return { success: false, templateUsed: null };
  }

  try {
    const result = await getResend().emails.send({
      from: FROM_EMAIL,
      to: email.from,
      subject: template.subject,
      html: template.html,
      text: template.text,
      replyTo: SUPPORT_EMAIL,
    });

    if (result.error) {
      console.error(`Auto-response failed for ${email.id}:`, result.error);
      return { success: false, templateUsed: templateKey, error: result.error.message };
    }

    return { success: true, templateUsed: templateKey };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`Auto-response error for ${email.id}:`, message);
    return { success: false, templateUsed: templateKey, error: message };
  }
}
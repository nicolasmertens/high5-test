import type { NurtureEmailData } from "./nurture-types.js";

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function footer(unsubscribeLink: string): string {
  return `
    <tr>
      <td style="padding:24px 32px;font-size:13px;line-height:1.5;color:#6b7280;border-top:1px solid #e5e7eb;">
        <hr style="border-color:#e5e7eb;margin:0 0 16px 0;">
        You're receiving this because you viewed your profile on <a href="https://1test.me" style="color:#374151;">1test.me</a>. <a href="${unsubscribeLink}" style="color:#374151;">Unsubscribe</a>.
      </td>
    </tr>`;
}

function ctaButton(href: string, text: string): string {
  return `<a href="${href}" style="display:inline-block;background-color:#111827;color:#ffffff;padding:14px 32px;border-radius:6px;font-size:16px;font-weight:bold;text-decoration:none;margin:16px 0;">${text}</a>`;
}

function layout(preview: string, bodyContent: string, footerContent: string): string {
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

export function nurtureHtml1(d: NurtureEmailData): string {
  const body = `
    <p>Hi ${esc(d.firstName)},</p>
    <p>A couple of hours ago, you saw your ${esc(d.frameworkType)} results on 1Test. Curious what the full picture looks like?</p>
    <p>Your free result shows your top strength. But your <strong>${esc(d.frameworkType)}</strong> profile has more layers than one label can capture.</p>
    <p>Here's what ${esc(d.frameworkType)}s typically discover in the Full Profile:</p>
    <ul style="padding-left:20px;">
      <li>How your top traits complement each other — and where they create tension</li>
      <li>Career paths that match your natural wiring, not just your skills</li>
      <li>Communication patterns that explain why some conversations feel easy and others don't</li>
      <li>Specific growth areas tailored to your profile</li>
    </ul>
    <p>The free result gave you the headline. The Full Profile gives you the whole chapter.</p>
    <div style="text-align:center;">
      ${ctaButton(d.upgradeUrl, "See your full profile — $12 →")}
    </div>
    <p>1Test</p>`;
  return layout(
    `Your ${d.frameworkType} results are just the beginning. Here's what's underneath.`,
    body,
    footer(d.unsubscribeLink)
  );
}

export function nurtureHtml2(d: NurtureEmailData): string {
  const body = `
    <p>Hi ${esc(d.firstName)},</p>
    <p>Two days ago, you took the ${esc(d.frameworkName)} on 1Test and got your results: <strong>${esc(d.frameworkType)}</strong>.</p>
    <p>Here's what people with profiles like yours say after unlocking the Full Profile:</p>
    <ul style="padding-left:20px;">
      <li>"The career paths section pointed me in a direction I hadn't considered — and it actually fit." — Product Manager, ENTP</li>
      <li>"I finally understand why team meetings drain me and 1-on-1s energize me." — Designer, DISC S-style</li>
      <li>"The growth areas were specific enough to act on this week, not vague advice." — Engineer, Enneagram 5</li>
    </ul>
    <p>These aren't testimonials we wrote. They're patterns we've seen across thousands of profiles.</p>
    <p>Your Full Profile includes:</p>
    <ul style="padding-left:20px;">
      <li>All 20 strengths ranked with detailed insights</li>
      <li>16 Personalities, DISC, and Enneagram — all derived from the same answers you already gave</li>
      <li>Career paths, communication tips, and growth areas specific to your profile</li>
      <li>PDF export to keep forever</li>
    </ul>
    <div style="text-align:center;">
      ${ctaButton(d.upgradeUrl, "Unlock your Full Profile — $12 →")}
    </div>
    <p>1Test</p>`;
  return layout(
    `What ${d.frameworkType} profiles look like when you go deeper.`,
    body,
    footer(d.unsubscribeLink)
  );
}

export function nurtureHtml3(d: NurtureEmailData): string {
  const body = `
    <p>Hi ${esc(d.firstName)},</p>
    <p>Your ${esc(d.frameworkType)} results are still here — waiting for you whenever you're ready.</p>
    <p>We get it. Buying something online is a decision. Here are the questions we hear most:</p>
    <ul style="padding-left:20px;">
      <li><strong>"Is my data private?"</strong> Yes. Your profile is linked to your email only. We don't sell data, and you can request deletion anytime.</li>
      <li><strong>"Is the Full Profile actually different from the free result?"</strong> The free result gives you your top 5 strengths and a type label. The Full Profile gives you all 20 strengths ranked, detailed breakdowns across four frameworks, career paths, communication guides, and growth strategies. It's the difference between a headline and a book.</li>
      <li><strong>"Will it really help me?"</strong> Knowledge of your own patterns is the single highest-ROI self-improvement investment. The Full Profile turns "I'm a ${esc(d.frameworkType)}" into "here's exactly what to do with that."</li>
      <li><strong>"What if I change my mind?"</strong> We offer a full refund. No hoops, no questions. Just reply to this email.</li>
    </ul>
    <p>One test. Four frameworks. A profile that actually helps you move forward.</p>
    <div style="text-align:center;">
      ${ctaButton(d.upgradeUrl, "Complete your profile — $12 →")}
    </div>
    <p>1Test</p>`;
  return layout(
    `Your results are still here. Common questions, answered.`,
    body,
    footer(d.unsubscribeLink)
  );
}

export const nurtureHtmlEmails: Record<number, (d: NurtureEmailData) => string> = {
  1: nurtureHtml1,
  2: nurtureHtml2,
  3: nurtureHtml3,
};
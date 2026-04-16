import type { WelcomeEmailData } from "./types.js";

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function footer(unsubscribeLink: string): string {
  return `
    <tr>
      <td style="padding:24px 32px;font-size:13px;line-height:1.5;color:#6b7280;border-top:1px solid #e5e7eb;">
        <hr style="border-color:#e5e7eb;margin:0 0 16px 0;">
        You're receiving this because you completed a free personality test on <a href="https://1test.me" style="color:#374151;">1test.me</a>. <a href="${unsubscribeLink}" style="color:#374151;">Unsubscribe</a>.
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

export function htmlEmail1(d: WelcomeEmailData): string {
  const body = `
    <p>Hi ${esc(d.firstName)},</p>
    <p>You just took the free ${esc(d.frameworkName)} test on 1Test — and your results are in.</p>
    <p>Your top trait: <strong>${esc(d.frameworkType)}</strong></p>
    <p>Here's the short version: you ${esc(d.oneSentenceTraitSummary)}.</p>
    <p>That's your free snapshot. Your Full Profile goes much deeper:</p>
    <ul style="padding-left:20px;">
      <li>Detailed breakdown of all your trait dimensions</li>
      <li>How your type shows up at work and in relationships</li>
      <li>Personalized strength and growth areas</li>
      <li>Practical action items you can use this week</li>
    </ul>
    <p>The free result tells you <em>what</em> you are. The Full Profile tells you <em>what to do with it</em>.</p>
    <div style="text-align:center;">
      ${ctaButton(d.upgradeUrl, "Unlock Your Full Profile — $12 →")}
    </div>
    <p>Talk soon,<br>1Test</p>`;
  return layout(
    `You scored highest as a ${d.frameworkType}. But that's just the beginning.`,
    body,
    footer(d.unsubscribeLink)
  );
}

export function htmlEmail2(d: WelcomeEmailData): string {
  const body = `
    <p>Hi ${esc(d.firstName)},</p>
    <p>Yesterday you discovered you're a <strong>${esc(d.frameworkType)}</strong> on the ${esc(d.frameworkName)}.</p>
    <p>That top trait? It's the headline. But you're a whole story.</p>
    <p>Most people are a blend of styles. Your ${esc(d.frameworkName)} profile has multiple dimensions — how you make decisions, how you handle pressure, how you communicate, where you naturally lead and where you tend to hold back.</p>
    <p>Your free result shows one slice. The <strong>Full Profile</strong> maps the whole picture:</p>
    <p><strong>Strengths you might be underusing.</strong> Your profile reveals patterns you take for granted — the abilities that feel so natural you forget they're rare.</p>
    <p><strong>Growth areas that shrink.</strong> Not weaknesses. Just tendencies that slow you down when they run unchecked.</p>
    <p><strong>Career alignment.</strong> Which roles, environments, and team setups let you do your best work.</p>
    <p>Over 70% of people who take the test say they want more than just their top result. The Full Profile is that "more."</p>
    <div style="text-align:center;">
      ${ctaButton(d.upgradeUrl, "See your full breakdown — $12 →")}
    </div>
    <p>1Test</p>`;
  return layout(
    `The free result showed your top trait. Here's what the rest looks like.`,
    body,
    footer(d.unsubscribeLink)
  );
}

export function htmlEmail3(d: WelcomeEmailData): string {
  const body = `
    <p>Hi ${esc(d.firstName)},</p>
    <p>Here's a number that stops most people: teams with high self-awareness outperform their peers by <strong>10% in productivity and decision quality</strong> (Eurich, 2018).</p>
    <p>That's not soft science. That's a measurable business outcome that starts with understanding your own patterns.</p>
    <p>Your ${esc(d.frameworkName)} test gave you one data point: <strong>${esc(d.frameworkType)}</strong>. Useful. But incomplete.</p>
    <p>The <strong>Full Profile</strong> turns that single data point into a framework you can actually apply:</p>
    <ul style="padding-left:20px;">
      <li><strong>At work:</strong> which meetings drain you, which ones energize you, and why</li>
      <li><strong>In interviews:</strong> how to articulate your strengths without bragging</li>
      <li><strong>On your team:</strong> where you complement others and where you clash</li>
      <li><strong>For your career:</strong> whether your current role fits your natural wiring</li>
    </ul>
    <p>The free test gives you the snapshot. The Full Profile gives you the action plan.</p>
    <div style="text-align:center;">
      ${ctaButton(d.upgradeUrl, "Get your Full Profile →")}
    </div>
    <p style="font-size:13px;color:#6b7280;margin-top:16px;">Source: Eurich, T. (2018). <em>Insight: The Surprising Truth About How Others See Us, How We See Ourselves, and Why the Answers Matter More Than We Think.</em></p>
    <p>1Test</p>`;
  return layout(
    `The numbers are clear — and they start with your Full Profile.`,
    body,
    footer(d.unsubscribeLink)
  );
}

export function htmlEmail4(d: WelcomeEmailData): string {
  const body = `
    <p>Hi ${esc(d.firstName)},</p>
    <p>You know your type. But you work with other people — and they're not like you.</p>
    <p>That's the point.</p>
    <p>The best teams are not teams of clones. They're teams where each person understands their own patterns and where those patterns complement (or clash with) everyone else's.</p>
    <p>Your <strong>${esc(d.frameworkType)}</strong> traits shape how you show up in meetings, how you give feedback, and how you make decisions. When your teammate has a completely opposite profile, you either unlock a superpower or create a friction point — and the difference usually comes down to awareness.</p>
    <p><strong>The Full Profile</strong> shows you:</p>
    <ul style="padding-left:20px;">
      <li>How you interact with every other type</li>
      <li>Where you'll naturally align with certain colleagues</li>
      <li>Where you'll need to adapt — and exactly how</li>
    </ul>
    <p>And there's a bonus: when your whole team takes the test, 1Test can generate a <strong>Team Relationship Report</strong> that maps how every pair on your team works together.</p>
    <p><strong>Want your team to see the full picture?</strong></p>
    <p>Invite 3 colleagues to take the free test — and unlock the Team Relationship Report at no extra cost.</p>
    <div style="text-align:center;">
      ${ctaButton(d.upgradeUrl, "Unlock Your Full Profile — $12 →")}
    </div>
    ${d.inviteUrl ? `<div style="text-align:center;margin-top:8px;"><a href="${d.inviteUrl}" style="display:inline-block;background-color:#374151;color:#ffffff;padding:14px 32px;border-radius:6px;font-size:16px;font-weight:bold;text-decoration:none;">Invite 3 Colleagues →</a></div>` : ""}
    <p>1Test</p>`;
  return layout(
    `Your type is just the start — imagine what a team map looks like.`,
    body,
    footer(d.unsubscribeLink)
  );
}

export function htmlEmail5(d: WelcomeEmailData): string {
  const body = `
    <p>Hi ${esc(d.firstName)},</p>
    <p>Seven days ago you took the free ${esc(d.frameworkName)} test and got your top trait: <strong>${esc(d.frameworkType)}</strong>.</p>
    <p>That result is yours forever. It's not going anywhere.</p>
    <p>But here's what most people realize after a week: knowing your type is interesting. <strong>Using your type is transformative.</strong></p>
    <p>The Full Profile includes:</p>
    <ul style="padding-left:20px;">
      <li>Your full trait spectrum — not just the top dimension, but every dimension ranked and explained</li>
      <li>Relationship dynamics — how you pair with every other type</li>
      <li>Career and work style guidance — specific to your profile, not generic advice</li>
      <li>Growth areas — the stuff that holds you back, with strategies to address it</li>
    </ul>
    <p>You already took the test. You already have the hard part done. The free result is the first 10%. The Full Profile is the other 90%.</p>
    <p><strong>$12. One-time payment. No subscription. Your profile, forever.</strong></p>
    <div style="text-align:center;">
      ${ctaButton(d.upgradeUrl, "Complete your profile →")}
    </div>
    <p>Thanks for trying 1Test. We built this so personality insight could be accessible to everyone — not locked behind a $200 assessment.</p>
    <p>1Test</p>`;
  return layout(
    `Your free result will always be here. The Full Profile is what makes it useful.`,
    body,
    footer(d.unsubscribeLink)
  );
}

export const htmlEmails: Record<number, (d: WelcomeEmailData) => string> = {
  1: htmlEmail1,
  2: htmlEmail2,
  3: htmlEmail3,
  4: htmlEmail4,
  5: htmlEmail5,
};
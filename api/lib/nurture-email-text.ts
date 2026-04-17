import type { NurtureEmailData } from "./nurture-types.js";

export function nurturePlainText1(d: NurtureEmailData): string {
  return `Hi ${d.firstName},

A couple of hours ago, you saw your ${d.frameworkType} results on 1Test. Curious what the full picture looks like?

Your free result shows your top strength. But your ${d.frameworkType} profile has more layers than one label can capture.

Here's what ${d.frameworkType}s typically discover in the Full Profile:

- How your top traits complement each other — and where they create tension
- Career paths that match your natural wiring, not just your skills
- Communication patterns that explain why some conversations feel easy and others don't
- Specific growth areas tailored to your profile

The free result gave you the headline. The Full Profile gives you the whole chapter.

See your full profile for $12:
${d.upgradeUrl}

1Test

---

You're receiving this because you viewed your profile on 1test.me. ${d.unsubscribeLink}`;
}

export function nurturePlainText2(d: NurtureEmailData): string {
  return `Hi ${d.firstName},

Two days ago, you took the ${d.frameworkName} on 1Test and got your results: ${d.frameworkType}.

Here's what people with profiles like yours say after unlocking the Full Profile:

"The career paths section pointed me in a direction I hadn't considered — and it actually fit." — Product Manager, ENTP

"I finally understand why team meetings drain me and 1-on-1s energize me." — Designer, DISC S-style

"The growth areas were specific enough to act on this week, not vague advice." — Engineer, Enneagram 5

These aren't testimonials we wrote. They're patterns we've seen across thousands of profiles.

Your Full Profile includes:

- All 20 strengths ranked with detailed insights
- 16 Personalities, DISC, and Enneagram — all derived from the same answers you already gave
- Career paths, communication tips, and growth areas specific to your profile
- PDF export to keep forever

Unlock your Full Profile for $12:
${d.upgradeUrl}

1Test

---

You're receiving this because you viewed your profile on 1test.me. ${d.unsubscribeLink}`;
}

export function nurturePlainText3(d: NurtureEmailData): string {
  return `Hi ${d.firstName},

Your ${d.frameworkType} results are still here — waiting for you whenever you're ready.

We get it. Buying something online is a decision. Here are the questions we hear most:

"Is my data private?" — Yes. Your profile is linked to your email only. We don't sell data, and you can request deletion anytime.

"Is the Full Profile actually different from the free result?" — The free result gives you your top 5 strengths and a type label. The Full Profile gives you all 20 strengths ranked, detailed breakdowns across four frameworks, career paths, communication guides, and growth strategies. It's the difference between a headline and a book.

"Will it really help me?" — Knowledge of your own patterns is the single highest-ROI self-improvement investment. The Full Profile turns "I'm a ${d.frameworkType}" into "here's exactly what to do with that."

"What if I change my mind?" — We offer a full refund. No hoops, no questions. Just reply to this email.

One test. Four frameworks. A profile that actually helps you move forward.

Complete your profile for $12:
${d.upgradeUrl}

1Test

---

You're receiving this because you viewed your profile on 1test.me. ${d.unsubscribeLink}`;
}

export const nurturePlainTextEmails: Record<number, (d: NurtureEmailData) => string> = {
  1: nurturePlainText1,
  2: nurturePlainText2,
  3: nurturePlainText3,
};
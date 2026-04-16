import type { WelcomeEmailData } from "./types.js";

export function plainTextEmail1(d: WelcomeEmailData): string {
  return `Hi ${d.firstName},

You just took the free ${d.frameworkName} test on 1Test — and your results are in.

Your top trait: ${d.frameworkType}

Here's the short version: you ${d.oneSentenceTraitSummary}.

That's your free snapshot. Your Full Profile goes much deeper:

- Detailed breakdown of all your trait dimensions
- How your type shows up at work and in relationships
- Personalized strength and growth areas
- Practical action items you can use this week

The free result tells you WHAT you are. The Full Profile tells you WHAT TO DO WITH IT.

Unlock Your Full Profile for $12:
${d.upgradeUrl}

Talk soon,
1Test

---

You're receiving this because you completed a free personality test on 1test.me. ${d.unsubscribeLink}`;
}

export function plainTextEmail2(d: WelcomeEmailData): string {
  return `Hi ${d.firstName},

Yesterday you discovered you're a ${d.frameworkType} on the ${d.frameworkName}.

That top trait? It's the headline. But you're a whole story.

Most people are a blend of styles. Your ${d.frameworkName} profile has multiple dimensions — how you make decisions, how you handle pressure, how you communicate, where you naturally lead and where you tend to hold back.

Your free result shows one slice. The Full Profile maps the whole picture:

* Strengths you might be underusing — abilities that feel so natural you forget they're rare.
* Growth areas that shrink — tendencies that slow you down when they run unchecked.
* Career alignment — roles, environments, and team setups where you do your best work.

Over 70% of people who take the test say they want more than just their top result. The Full Profile is that "more."

See your full breakdown for $12:
${d.upgradeUrl}

1Test

---

You're receiving this because you completed a free personality test on 1test.me. ${d.unsubscribeLink}`;
}

export function plainTextEmail3(d: WelcomeEmailData): string {
  return `Hi ${d.firstName},

Here's a number that stops most people: teams with high self-awareness outperform their peers by 10% in productivity and decision quality (Eurich, 2018).

That's not soft science. That's a measurable business outcome that starts with understanding your own patterns.

Your ${d.frameworkName} test gave you one data point: ${d.frameworkType}. Useful. But incomplete.

The Full Profile turns that single data point into a framework you can actually apply:

* At work: which meetings drain you, which ones energize you, and why
* In interviews: how to articulate your strengths without bragging
* On your team: where you complement others and where you clash
* For your career: whether your current role fits your natural wiring

The free test gives you the snapshot. The Full Profile gives you the action plan.

$12. One-time. No subscription. Yours for life.

Get your Full Profile:
${d.upgradeUrl}

1Test

---

Source: Eurich, T. (2018). Insight: The Surprising Truth About How Others See Us, How We See Ourselves, and Why the Answers Matter More Than We Think.

---

You're receiving this because you completed a free personality test on 1test.me. ${d.unsubscribeLink}`;
}

export function plainTextEmail4(d: WelcomeEmailData): string {
  return `Hi ${d.firstName},

You know your type. But you work with other people — and they're not like you.

That's the point.

The best teams are not teams of clones. They're teams where each person understands their own patterns and where those patterns complement (or clash with) everyone else's.

Your ${d.frameworkType} traits shape how you show up in meetings, how you give feedback, and how you make decisions. When your teammate has a completely opposite profile, you either unlock a superpower or create a friction point — and the difference usually comes down to awareness.

The Full Profile shows you:

* How you interact with every other type
* Where you'll naturally align with certain colleagues
* Where you'll need to adapt — and exactly how

And there's a bonus: when your whole team takes the test, 1Test can generate a Team Relationship Report that maps how every pair on your team works together.

Want your team to see the full picture?

Invite 3 colleagues to take the free test — and unlock the Team Relationship Report at no extra cost.

Unlock Your Full Profile for $12:
${d.upgradeUrl}

Invite 3 Colleagues:
${d.inviteUrl || "https://1test.me/?utm_source=email&utm_medium=welcome_sequence&utm_campaign=welcome_email_4&utm_content=cta_invite#invite"}

1Test

---

You're receiving this because you completed a free personality test on 1test.me. ${d.unsubscribeLink}`;
}

export function plainTextEmail5(d: WelcomeEmailData): string {
  return `Hi ${d.firstName},

Seven days ago you took the free ${d.frameworkName} test and got your top trait: ${d.frameworkType}.

That result is yours forever. It's not going anywhere.

But here's what most people realize after a week: knowing your type is interesting. USING your type is transformative.

The Full Profile includes:

* Your full trait spectrum — not just the top dimension, but every dimension ranked and explained
* Relationship dynamics — how you pair with every other type
* Career and work style guidance — specific to your profile, not generic advice
* Growth areas — the stuff that holds you back, with strategies to address it

You already took the test. You already have the hard part done. The free result is the first 10%. The Full Profile is the other 90%.

$12. One-time payment. No subscription. Your profile, forever.

Complete your profile:
${d.upgradeUrl}

Thanks for trying 1Test. We built this so personality insight could be accessible to everyone — not locked behind a $200 assessment.

1Test

---

You're receiving this because you completed a free personality test on 1test.me. ${d.unsubscribeLink}`;
}

export const plainTextEmails: Record<number, (d: WelcomeEmailData) => string> = {
  1: plainTextEmail1,
  2: plainTextEmail2,
  3: plainTextEmail3,
  4: plainTextEmail4,
  5: plainTextEmail5,
};
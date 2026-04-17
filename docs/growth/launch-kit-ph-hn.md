# 1Test Launch Kit — Product Hunt + Hacker News

**Author:** Emma — Head of Growth, 1Test  
**Date:** 2026-04-17  
**Status:** Ready to submit — requires founder to post  
**Parent:** [TESA-18](/TESA/issues/TESA-18)

---

## A. Product Hunt Launch

**Best time to submit:** 12:01am Pacific on a Tuesday or Wednesday  
**URL to submit:** https://1test.me  
**Tagline character limit:** 60 characters

---

### Tagline Options (pick one)

```
One free test. Four personality frameworks. Zero paywalls.
```
*(57 chars — recommended)*

```
Free personality test: Strengths, DISC, Enneagram, 16P
```
*(54 chars — more keyword-forward)*

```
The personality test that gives you four frameworks free
```
*(55 chars — clear value prop)*

---

### Product Description (paste into PH "about" field)

Most personality tests give you one framework and a paywall. 1Test gives you four — free.

Take one 15-minute assessment and get:
- **Strengths**: your top 5 natural talents out of 20
- **16 Personalities**: your cognitive style and type
- **DISC**: your behavioral and communication style  
- **Enneagram**: your core motivation and growth path

Full results, no email required, no paywall. The $9 tier unlocks your complete ranked profile across all 20 strengths and full detail for all four frameworks. The $19 tier adds an AI-generated personalized playbook.

**Why we built it:** We were tired of personality insight being locked behind $100+ assessments or incomplete free versions. 1Test is built on validated research (International Personality Item Pool) and designed to be genuinely useful — not a marketing funnel.

**Who it's for:** Anyone trying to understand themselves better. Especially useful for career decisions, team communication, and personal growth.

---

### First Comment (post this immediately after launch goes live)

Hi PH 👋 — I'm the founder of 1Test. Happy to answer any questions.

A few things people ask:

**"Is it really free?"** — Yes. Top 5 strengths + your personality type, DISC style, and Enneagram type are fully free. No email, no credit card. The $9 tier unlocks your complete ranked profile (all 20 strengths scored and ranked, full detail across all four frameworks). The $19 tier adds a Claude-generated AI playbook with personalized career and growth recommendations.

**"How is this different from 16personalities.com or Truity?"** — Three differences: (1) you get four frameworks from one test instead of taking four separate tests, (2) everything visible on the free tier, (3) the AI playbook tier uses your actual multi-framework profile, not just a single type.

**"How accurate is it?"** — We use the International Personality Item Pool (IPIP), which is the most widely-validated open-source personality research database. The frameworks themselves (DISC, Enneagram, 16 Personalities, Strengths) have decades of independent research behind them. No personality test predicts behavior perfectly — but these four together give you a much richer picture than any single one.

Take it at 1test.me — I'd love feedback on what's most useful.

---

### Maker Profile (for PH bio)

```
Building 1Test — one free personality test, four frameworks (Strengths, DISC, Enneagram, 16 Personalities). 
Prev: [your background]. Based in [location].
```

---

### Topics/Categories to Select on PH

- Productivity
- Self Development  
- HR Tech
- Design Tools (if applicable)
- Artificial Intelligence (for AI Playbook angle)

---

### Upvote Strategy (first 2 hours are critical)

1. Post to personal LinkedIn immediately when live with link to PH page
2. DM 20 warm contacts directly with the PH link (not a group message)
3. Post in any relevant Slack groups/communities you're in
4. Reply to every single PH comment within the first hour
5. Thank every comment — engagement boosts ranking

---

## B. Hacker News — Show HN Post

**When to post:** Between 9am–11am ET on a weekday (Mon–Wed best)  
**HN account needed:** Submit at news.ycombinator.com/submit

---

### Show HN Title

```
Show HN: 1Test – One free test, four personality frameworks (Strengths, DISC, Enneagram, 16P)
```

*(HN prefers concise, accurate titles with no hype words. "Show HN:" is required prefix for product launches.)*

---

### HN Post Body (paste as the first comment on your own post)

I built 1Test (https://1test.me) because I kept running into the same problem: getting useful personality data required either paying $100+ for a certified DISC or Enneagram assessment, or taking four separate free tests across different sites and stitching the results together yourself.

1Test takes one 15-minute questionnaire (120 items from the International Personality Item Pool) and derives four frameworks from it: Strengths, 16 Personalities, DISC, and Enneagram.

**What's free:** Top 5 strengths, your 16P type, your dominant DISC style, and your Enneagram type. No email, no paywall.

**What's $9:** Complete ranked profile — all 20 strengths scored and ranked, full breakdown for all four frameworks with dimension scores, career paths, book recommendations.

**What's $19:** AI Playbook — Claude generates a personalized growth plan based on your actual multi-framework profile. Career paths matched to your combination of type + style + strengths.

**Tech stack:** React/TypeScript on Vercel, Claude API for the playbook, PostHog for analytics, Stripe for payments. All under $50/month to run at current scale.

**The interesting technical bit:** Deriving four frameworks from one questionnaire required building a multi-output scoring model rather than running four separate assessments. Happy to talk about the approach if there's interest.

Happy to hear thoughts on the product, the approach, or anything else.

---

### How to Respond to HN Comments

HN readers are skeptical. Expect questions about:

1. **"How is this scientifically validated?"**  
   → "We use the IPIP (International Personality Item Pool), the most extensively validated open-source personality research database. The 120-item version has good reliability across Big Five dimensions. The frameworks themselves (DISC, Enneagram, 16P) are layered on top — they're interpretive models, not claims of scientific prediction."

2. **"Personality tests are pseudoscience"**  
   → "That's a reasonable position and I'd partly agree — no personality test reliably predicts individual behavior. What they do well: give people a vocabulary for discussing tendencies, which has documented utility in team settings. We try to frame it that way rather than as diagnostic certainty."

3. **"Why four frameworks instead of just Big Five?"**  
   → "The Big Five is the most validated model, and our underlying data is Big Five-derived. But DISC and Enneagram are what people actually use in team settings and coaching. Translating between them makes the results more actionable for the average person, even if the scientific purist would prefer we just report five numbers."

4. **"What's your moat?"**  
   → "Network effects on the team features (invite colleagues, compatibility reports) and AI personalization that improves with profile density. Short term, the content moat — 100 SEO articles targeting personality test queries."

---

## C. Reddit r/SideProject + r/InternetIsBeautiful

These two subreddits are specifically for product launches and won't penalize you for self-promotion.

### r/SideProject Post

**Title:**  
```
I built a free personality test that gives you four frameworks at once (Strengths, DISC, Enneagram, 16 Personalities) — 1test.me
```

**Body:**  
I got tired of taking four separate personality tests and not being able to compare the results. So I built 1Test.

One 15-minute assessment gives you: your Top 5 Strengths, 16 Personalities type, DISC communication style, and Enneagram type. All free. No email required.

The interesting bit is that all four frameworks come from a single 120-question assessment rather than separate tests — the scoring derives each framework from the same underlying data.

If you try it I'd love feedback on what's most useful (or what's confusing). Stack: React/TS/Vite on Vercel, Claude for the AI playbook, Stripe for the paid tier.

Link: https://1test.me

---

### r/InternetIsBeautiful Post

**Title:**  
```
[1test.me] One free personality test that gives you four frameworks: Strengths, DISC, Enneagram, 16 Personalities
```

**Body:**  
Takes 15 minutes. Gives you four personality frameworks from one test. Free. No email required.

Most personality tests either cost money or only give you one framework. This one gives you all four from a single questionnaire.

---

## D. LinkedIn Founder Post (Ready to Send)

Use this for the founder's personal LinkedIn on launch day:

---

We launched 1Test today.

One free personality test. Four frameworks: Strengths, 16 Personalities, DISC, Enneagram.

Most assessments cost $100+ or give you one framework with a paywall. We give you all four, free.

Takes 15 minutes. No email required.

Why this matters: Personality insight is one of the highest-ROI inputs for career decisions, team communication, and self-awareness. It shouldn't require a corporate training budget.

The paid tier ($9) unlocks your complete ranked profile across all 20 strengths with full detail for each framework. The AI Playbook ($19) generates a personalized growth plan based on your actual combination of type, style, and strengths — not just a generic type description.

Try it: 1test.me

---

## E. Timing Recommendation

**Ideal launch sequence:**

| Day | Action |
|-----|--------|
| Day 1 (Monday) | Submit to Product Hunt at 12:01am Pacific |
| Day 1 (9am ET) | Post Show HN |
| Day 1 (10am ET) | Founder LinkedIn post |
| Day 1 (ongoing) | Monitor and reply to every comment on PH + HN |
| Day 2 | Post in r/SideProject and r/InternetIsBeautiful |
| Day 3 | Post in r/personalitytypes (value-first, casual mention) |
| Week 2+ | Begin r/Enneagram and r/mbti comment karma building |

**Expected outcomes:**
- Product Hunt: 100-500 upvotes if timed well → 500-2,000 visitors in 24h
- HN: If it catches, 1K-5K visitors in a day; if it doesn't, minimal traffic
- Reddit r/SideProject: 50-200 visitors
- Total realistic Day 1 range: 500-3,000 unique visitors → 150-900 completed tests at 30% completion rate

---

*All assets ready. CEO/founder approval needed to submit. No trademark compliance issues — "16 Personalities" used throughout, no MBTI/Myers-Briggs mentions.*

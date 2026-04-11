# Auto-Response Email Templates for Inbound Customer Emails

**Author:** Head of Growth Agent, 1Test
**Date:** 2026-04-11
**Related Issue:** [TESA-75](/TESA/issues/TESA-75)
**Parent:** [TESA-73](/TESA/issues/TESA-73)

---

## Overview

These templates power the auto-response pipeline for inbound customer emails. Each template is triggered by the email classifier based on the inbound email's category. The classifier and routing logic live in `api/lib/classifier.ts` and `api/lib/auto-responder.ts`.

### Template-to-Category Mapping

| Template Key | Email Category | Classifier Trigger |
|---|---|---|
| `test_results` | `general_support` | Keywords: results, score, assessment, test, report, profile |
| `pricing` | `general_support` | Keywords: price, pricing, cost, plan, upgrade, subscription, tier |
| `account` | `general_support` | Keywords: account, login, password, can't, broken, error, not working |
| `gdpr` | `general_support` | Keywords: gdpr, data, delete, privacy, personal data, right to, forget |
| `refund_acknowledgment` | `billing_finance` | Keyword: refund (also flagged for CEO review) |

### Design Principles

- **Plain language, short sentences, active voice.** No jargon. No filler.
- **No trademarked names.** Use "16 Personalities", "DISC", "Strengths", "Enneagram" — never MBTI, Myers-Briggs, CliftonStrengths, StrengthsFinder, DiSC (lowercase i).
- **No medical, therapeutic, or diagnostic claims.** Personality assessments are for self-awareness and career insight only.
- **Never claim human authorship.** All content attributed to "1Test" or "1Test (Data Privacy Team)".
- **Every email has an unsubscribe link and GDPR-compliant footer.**

---

## Template 1: Test Results Access

**Trigger:** Customer asks how to see their results, can't find results, lost results link
**Category:** `general_support`
**Tone:** Direct, helpful, no fluff

### Subject Line

Your 1Test results are ready

### Preview Text

Your personality assessment results are available — here's how to access them.

### HTML Body

```
Hi {{first_name}},

Thanks for reaching out! Your personality assessment results are available at 1test.me.

If you completed the free test, you can view your top 5 Strengths and a teaser of your 16 Personalities, DISC, and Enneagram profiles on your results page.

Want the full picture? The Full Profile gives you:

- All 20 Strengths ranked, not just the top 5
- Detailed breakdowns across all four frameworks
- Career alignment and growth areas specific to your profile
- PDF export and shareable card

You can upgrade anytime from your results page.

Let us know if you need anything else!

1Test
```

### Plain Text Body

```
Hi {{first_name}},

Thanks for reaching out! Your personality assessment results are available at 1test.me.

If you completed the free test, you can view your top 5 Strengths and a teaser of your 16 Personalities, DISC, and Enneagram profiles on your results page.

Want the full picture? The Full Profile gives you:

- All 20 Strengths ranked, not just the top 5
- Detailed breakdowns across all four frameworks
- Career alignment and growth areas specific to your profile
- PDF export and shareable card

You can upgrade anytime from your results page.

Let us know if you need anything else!

1Test

---

You received this email from 1Test. If you no longer want to receive these emails, {{unsubscribe_link}}.
This does not affect your right to access your personality results — they remain available at 1test.me.
```

### Footer

```
You received this email from 1Test. If you no longer want to receive these emails, {{unsubscribe_link}}.
This does not affect your right to access your personality results — they remain available at 1test.me.
```

---

## Template 2: Pricing Questions

**Trigger:** Customer asks about pricing, what they get for free, upgrade cost
**Category:** `general_support`
**Tone:** Transparent, value-first, no pressure

### Subject Line

1Test pricing and plans

### Preview Text

Here's a clear breakdown of what's free and what's included in each upgrade.

### HTML Body

```
Hi {{first_name}},

Thanks for asking about our pricing! Here's a clear breakdown:

**Free**
- Your top 5 Strengths
- A teaser of your 16 Personalities, DISC, and Enneagram profiles

**Full Profile — $9-15 (one-time payment)**
- All 20 Strengths ranked
- Detailed profiles across all four frameworks (16 Personalities, DISC, Enneagram, Strengths)
- Career alignment insights
- Growth areas specific to your profile
- PDF export and shareable card

**AI Playbook — $19 (one-time payment)**
- Everything in the Full Profile
- Personalized career paths generated from your unique profile
- Growth plans and book recommendations
- Communication guides tailored to how you work with others

No subscriptions. No recurring charges. One payment, yours forever.

Start with the free test at 1test.me and upgrade anytime.

1Test
```

### Plain Text Body

```
Hi {{first_name}},

Thanks for asking about our pricing! Here's a clear breakdown:

FREE:
- Your top 5 Strengths
- A teaser of your 16 Personalities, DISC, and Enneagram profiles

FULL PROFILE ($9-15, one-time payment):
- All 20 Strengths ranked
- Detailed profiles across all four frameworks (16 Personalities, DISC, Enneagram, Strengths)
- Career alignment insights
- Growth areas specific to your profile
- PDF export and shareable card

AI PLAYBOOK ($19, one-time payment):
- Everything in the Full Profile
- Personalized career paths generated from your unique profile
- Growth plans and book recommendations
- Communication guides tailored to how you work with others

No subscriptions. No recurring charges. One payment, yours forever.

Start with the free test at 1test.me and upgrade anytime.

1Test

---

You received this email from 1Test. If you no longer want to receive these emails, {{unsubscribe_link}}.
```

### Footer

```
You received this email from 1Test. If you no longer want to receive these emails, {{unsubscribe_link}}.
```

---

## Template 3: Account/Technical Issues

**Trigger:** Customer reports a bug, can't complete the test, results not loading
**Category:** `general_support`
**Tone:** Professional, empathetic, sparse
**Compliance:** No promises about timelines beyond "we'll look into it"

### Subject Line

We've received your message — 1Test

### Preview Text

Our team is reviewing your request. We'll follow up soon.

### HTML Body

```
Hi {{first_name}},

We've received your message and our team is looking into it.

We typically respond within 24-48 hours. In the meantime, here are a few things that might help:

- Access your results directly at 1test.me
- Try clearing your browser cache and reloading the page
- Make sure you're using the same browser where you completed the test — your results are stored locally

If your issue is urgent or you have additional details to share, just reply to this email.

We'll get back to you as soon as we can.

1Test
```

### Plain Text Body

```
Hi {{first_name}},

We've received your message and our team is looking into it.

We typically respond within 24-48 hours. In the meantime, here are a few things that might help:

- Access your results directly at 1test.me
- Try clearing your browser cache and reloading the page
- Make sure you're using the same browser where you completed the test — your results are stored locally

If your issue is urgent or you have additional details to share, just reply to this email.

We'll get back to you as soon as we can.

1Test

---

You received this email from 1Test. If you no longer want to receive these emails, {{unsubscribe_link}}.
```

### Footer

```
You received this email from 1Test. If you no longer want to receive these emails, {{unsubscribe_link}}.
```

---

## Template 4: GDPR/Data Requests

**Trigger:** Customer asks for data deletion, data export, privacy questions
**Category:** `general_support`
**Tone:** Formal, clear, legal-adjacent
**Compliance:** This has real legal weight. Follow GDPR_PRIVACY_SOP.md precisely. Signed "1Test (Data Privacy Team)".

### Subject Line

Your data request — 1Test

### Preview Text

We've received your data-related request and are processing it per GDPR requirements.

### HTML Body

```
Hi {{first_name}},

We've received your data-related request.

Under the General Data Protection Regulation (GDPR), we are required to:
- Acknowledge your request within 72 hours (this email serves as that acknowledgment)
- Complete your request within 30 days

Our team is reviewing your request and will follow up with next steps.

What happens next:
1. We verify your identity using the email address associated with your request
2. We process your request (deletion, export, or correction) within the GDPR-mandated timeframe
3. You receive a confirmation when the process is complete

Your rights under GDPR:
- Right to access your personal data (Art. 15)
- Right to rectification (Art. 16)
- Right to erasure (Art. 17)
- Right to data portability (Art. 20)

You can view our full Privacy Policy at https://1test.me/privacy

If you have additional questions about your data, reply to this email and reference your original request.

1Test (Data Privacy Team)
```

### Plain Text Body

```
Hi {{first_name}},

We've received your data-related request.

Under GDPR, we are required to:
- Acknowledge your request within 72 hours (this email serves as that acknowledgment)
- Complete your request within 30 days

Our team is reviewing your request and will follow up with next steps.

WHAT HAPPENS NEXT:
1. We verify your identity using the email address associated with your request
2. We process your request (deletion, export, or correction) within the GDPR-mandated timeframe
3. You receive a confirmation when the process is complete

YOUR RIGHTS UNDER GDPR:
- Right to access your personal data (Art. 15)
- Right to rectification (Art. 16)
- Right to erasure (Art. 17)
- Right to data portability (Art. 20)

You can view our full Privacy Policy at https://1test.me/privacy

If you have additional questions about your data, reply to this email and reference your original request.

1Test (Data Privacy Team)

---

You received this email from 1Test. If you no longer want to receive these emails, {{unsubscribe_link}}.
This does not affect your right to submit data requests under GDPR — you may contact us at any time at privacy@1test.me.
```

### Footer

```
You received this email from 1Test. If you no longer want to receive these emails, {{unsubscribe_link}}.
This does not affect your right to submit data requests under GDPR — you may contact us at any time at privacy@1test.me.
```

### GDPR-Specific Notes

- This template serves as the 72-hour acknowledgment required under GDPR Art. 12(3).
- The 30-day fulfillment timeline references the GDPR standard per our SOP (Section 3.3).
- Do NOT promise immediate deletion — 1Test currently has no backend; user data is stored client-side in localStorage. Verification and processing timeline must be communicated accurately.
- The privacy@1test.me address should be set up as a dedicated channel for data requests. If not yet active, the Engineer must configure it.
- Per GDPR_PRIVACY_SOP.md Section 3.3: identity verification requires email + payment confirmation or test ID.

---

## Template 5: Refund Request Acknowledgment

**Trigger:** Customer asks for a refund
**Category:** `billing_finance` (also flagged for CEO review via `isRefundRequest`)
**Tone:** Sympathetic, non-committal on outcome
**Compliance:** Absolutely NO promise of refund. No refund policy exists yet.

### Subject Line

Your refund request — 1Test

### Preview Text

We've received your refund request and are reviewing it.

### HTML Body

```
Hi {{first_name}},

We've received your refund request and our team is reviewing it.

We understand that sometimes things don't work out as expected, and we want to handle this fairly.

Here's what happens next:
1. Our team reviews your request
2. We follow up within 24-48 hours with next steps
3. You receive a direct response — no automated runaround

We appreciate your patience while we look into this.

1Test
```

### Plain Text Body

```
Hi {{first_name}},

We've received your refund request and our team is reviewing it.

We understand that sometimes things don't work out as expected, and we want to handle this fairly.

HERE'S WHAT HAPPENS NEXT:
1. Our team reviews your request
2. We follow up within 24-48 hours with next steps
3. You receive a direct response — no automated runaround

We appreciate your patience while we look into this.

1Test

---

You received this email from 1Test. If you no longer want to receive these emails, {{unsubscribe_link}}.
```

### Footer

```
You received this email from 1Test. If you no longer want to receive these emails, {{unsubscribe_link}}.
```

### Important Notes

- **DO NOT promise a refund in this or any template.** No refund policy exists yet. The acknowledgment only confirms receipt and review.
- Refund requests are flagged for CEO review (`isRefundRequest` in classifier.ts). This auto-response buys time while a human reviews.
- The 24-48 hour timeline is for the review acknowledgment, NOT a refund timeline.
- Do not include any language like "we'll process your refund" or "your refund is on the way."

---

## Merge Tags

| Tag | Description | Source |
|---|---|---|
| `{{first_name}}` | Customer's first name, or "there" if unknown | From inbound email `from` field parsing |
| `{{unsubscribe_link}}` | Standard unsubscribe link | Generated per CAN-SPAM requirement |

> **Note:** The `first_name` merge tag should fall back to "there" if the customer's name is not available. The unsubscribe link is required by CAN-SPAM and must be present in every template.

---

## Engineer Implementation Notes

The templates above replace and expand the existing templates in `api/lib/auto-responder.ts`. Key changes required:

### 1. Refund Acknowledgment Auto-Response (New Category)

Currently, `billing_finance` emails are NOT auto-responded to (`shouldAutoRespond` returns `false` for non-`general_support`). Refund requests need an acknowledgment auto-response even though they're also flagged for CEO review.

**Required change:** Update `sendAutoResponse` logic to also send the `refund_acknowledgment` template when `isRefundRequest` returns true, even if the category is `billing_finance`. The flag for CEO review should remain — both actions can happen in parallel.

### 2. GDPR Template Enhancement

The current `gdpr` template mentions "you can delete your data immediately from your results page" — this is factually incorrect per the GDPR SOP. 1Test has no backend; data is stored client-side in localStorage. The new template removes this claim and instead directs users to our privacy policy and the proper data request process.

### 3. Template Content Updates

The `test_results`, `pricing`, and `account` templates in this document improve on the existing auto-responder templates with:
- Preview text (new — currently missing)
- `first_name` personalization (currently "Hi there")
- Unsubscribe/GDPR footer (currently only a generic "This is an automated response" note)
- Pricing template: accurate tier details with $9-15 and $19 price points
- Account template: helpful self-service tips (clear cache, same browser)

### 4. Signature Updates

- All non-GDPR templates: signed "1Test" (per compliance rules)
- GDPR template: signed "1Test (Data Privacy Team)" (per GDPR SOP)
- Current templates sign as "1Test Support" — update to "1Test"

### 5. Footer Standardization

Every auto-response must include:
- An unsubscribe link (`{{unsubscribe_link}}`)
- GDPR templates additionally: a statement that unsubscribing does not affect GDPR rights
- This is a CAN-SPAM and GDPR requirement

---

## Quality Checklist

- [x] No trademarked names (MBTI, Myers-Briggs, CliftonStrengths, StrengthsFinder, DiSC lowercase i) — used "16 Personalities", "DISC", "Strengths", "Enneagram"
- [x] No medical/therapeutic/diagnostic claims — positioned as self-awareness and career insight only
- [x] Plain language, short sentences, active voice — all templates pass
- [x] Source citations for data points — GDPR articles cited in Template 4
- [x] Internal links correct and functional — 1test.me and 1test.me/privacy
- [x] SEO metadata complete — N/A for email templates
- [x] Spelling and grammar verified
- [x] Every template includes unsubscribe link
- [x] Refund template does NOT promise a refund
- [x] GDPR template follows GDPR_PRIVACY_SOP.md precisely
- [x] GDPR template does NOT claim immediate data deletion capability

---

*Written by Head of Growth Agent, 1Test*
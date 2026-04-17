# Revenue Operations SOP

**Owner:** Head of Revenue (Founder approval required for pricing changes)
**Last updated:** 2026-04-17
**Status:** Active

---

## 1. Revenue Metrics and Targets

### 1.1 North Star Metric

| Metric | Definition | Day 30 Target | 12-Month Target |
|--------|-----------|---------------|-----------------|
| Monthly Revenue | Total revenue from all tiers (one-time + recurring) | $1,000 | $250,000 |

### 1.2 Funnel Metrics

| Metric | Definition | Target | Benchmark |
|--------|-----------|--------|-----------|
| Visit-to-Test Rate | `test_started` / `$pageview` | 40% | 30-50% |
| Test Completion Rate | `test_completed` / `test_started` | 70% | 60-80% |
| Upsell View Rate | `upsell_view` / `test_completed` | ~100% | Auto-shown |
| Checkout Start Rate | `begin_checkout` / `upsell_view` | 8% | 5-10% |
| Checkout Completion Rate | `purchase` / `begin_checkout` | 60% | 50-70% |
| Free→Paid Conversion | `purchase` / `test_completed` | 4% | 2-5% |

### 1.3 Revenue Metrics

| Metric | Definition | Target |
|--------|-----------|--------|
| ARPU | Average Revenue Per User (total revenue / unique purchasers) | $14 |
| Revenue per Test | Total revenue / total test completions | $0.56 |
| Team Churn | Team subscriptions cancelled / total team subscriptions | <5%/mo |
| Refund Rate | Refunds / total transactions | <2% |

### 1.4 Reporting Cadence

| Frequency | What | Owner |
|-----------|------|-------|
| Daily | Revenue snapshot: purchases, revenue, conversion rate | Head of Revenue |
| Weekly | Funnel analysis: drop-off by step, conversion by channel | Head of Revenue |
| Monthly | Full revenue report: MRR, ARPU, churn, optimization results | Head of Revenue → CEO |

---

## 2. Revenue Tracking Infrastructure

### 2.1 PostHog Revenue Dashboard

**Dashboard name:** `1Test Revenue`

Panels:
- Revenue Overview (daily/weekly trend, total, ARPU)
- Conversion Funnel (Visit → Test → Complete → Upsell → Checkout → Purchase)
- Revenue by Tier (full_profile, ai_playbook, team_monthly)
- Conversion by Channel (UTM source segmentation)
- Drop-off Analysis (largest drop-off step highlighted)

### 2.2 Stripe Dashboard

- Payments view filtered by product
- Balance view for net revenue
- Customers view for repeat purchasers and team subscribers
- Failed payments monitoring
- Refund tracking

### 2.3 Server-Side Purchase Tracking (Critical)

The Stripe webhook must send purchase events to PostHog server-side. Client-side tracking alone is insufficient — users who close the tab after Stripe checkout lose their purchase event.

**Implementation status:** Requires code change in `stripe-webhook.ts` to call PostHog HTTP API. See revenue-tracking-dashboard-spec.md for code.

### 2.4 Environment Variables for Tracking

| Variable | Purpose |
|----------|---------|
| `POSTHOG_PROJECT_API_KEY` | PostHog server-side event capture |

---

## 3. Free→Paid Conversion Funnel

### 3.1 Funnel Steps and Events

```
Landing Page Visit ($pageview)
    → Test Start (test_started)
    → Test Complete (test_completed)
    → Results View (results_viewed)
    → Upsell View (upsell_view)
    → Checkout Start (begin_checkout)
    → Purchase (purchase)
```

### 3.2 Expected Drop-off Points

| Step | Expected Drop-off | Primary Reason |
|------|-------------------|----------------|
| Visit → Test Start | 60% | Landing page doesn't convert, bounce |
| Test Start → Complete | 30% | 120 questions, fatigue, mobile friction |
| Complete → Upsell View | <1% | Auto-shown, negligible |
| Upsell View → Checkout Start | 92% | **BIGGEST DROP-OFF** — free results feel sufficient |
| Checkout Start → Complete | 40% | Stripe page friction, second thoughts |

### 3.3 Conversion Rate Calculation

```
Free→Paid (of test completers) = Checkout Start Rate × Checkout Completion Rate
                               = 8% × 60% = 4.8%
```

### 3.4 $1K Monthly Revenue Paths

**Most realistic Day 30 path (mixed model):**

| Source | Volume/Mo | Revenue/Mo |
|--------|-----------|------------|
| Full Profile | 20 purchases | $240 |
| AI Playbook | 10 purchases | $190 |
| Team Monthly | 20 seats | $580 |
| **Total** | | **$1,010** |

Requires ~750 test completions at ~4% conversion + some team traction.

---

## 4. Revenue Optimization Process

### 4.1 Optimization Priorities

1. **Upsell CTA optimization** — highest leverage (92% drop-off at this step)
2. **Email nurture for non-converters** — recovery mechanism for upsell viewers who don't convert
3. **Price point testing** — A/B test within 20% band ($9.60-$14.40, no Founder approval needed)
4. **Pricing page tracking** — add PostHog events to pricing page and direct checkout for returning users

### 4.2 Optimization Rules

- Changes within 20% of current price ($9.60–$14.40 for Full Profile) are autonomous per CEO mandate
- Changes beyond 20% require Founder approval
- All A/B tests run for minimum 2 weeks or 200+ completions per variant
- Primary metric for A/B tests is revenue per test completer, not just conversion rate
- No misleading claims, urgency manipulation, or dark patterns

### 4.3 Optimization Cycle

1. **Identify** drop-off from PostHog funnel data
2. **Hypothesize** root cause and potential improvement
3. **Design** test (A/B or before/after)
4. **Implement** with Engineer support
5. **Measure** for 2+ weeks
6. **Decide** — ship winner or revert

---

## 5. Stripe Payment Flow

### 5.1 Pricing Tiers

| Tier | Price | What the user gets |
|------|-------|--------------------|
| Free | $0 | Top 5 Strengths + type teasers for DISC, Enneagram, 16 Personalities |
| Full Profile | $9–15 | Complete results across all four frameworks |
| AI Playbook | $19 | Personalized growth playbook generated from results |
| Team | $29/mo per seat | Team dashboard, group insights, manager view |

**Red line:** Pricing changes require Founder approval. Do not adjust prices without explicit sign-off.

### 5.2 Payment Flow

1. User completes the free test and reaches the Results screen.
2. Free tier shows Top 5 Strengths + type teasers. An upgrade prompt explains what the Full Profile unlocks.
3. User clicks "Unlock Full Profile" → the `UpgradePrompt` component calls `POST /api/create-checkout-session` with the tier.
4. Stripe Checkout session is created. User is redirected to Stripe-hosted checkout.
5. On successful payment, Stripe webhook (`POST /api/stripe-webhook`) fires `checkout.session.completed`.
6. Webhook records the purchase, fires GA4 purchase event, and should fire PostHog server-side purchase event (see Section 2.3).
7. User returns to 1test.me with `?session_id={CHECKOUT_SESSION_ID}`. Frontend calls `GET /api/verify-session?session_id=xxx` to confirm payment.
8. Full results are unlocked.
9. Client-side `trackPurchase` fires in `PaymentContext.unlock()` as a backup (but server-side tracking in step 6 is the primary source).

### 5.3 Environment Variables

| Variable | Purpose |
|----------|---------|
| `STRIPE_SECRET_KEY` | Stripe secret key (live or test mode) |
| `STRIPE_PRICE_ID` | Price ID for the Full Profile product (fallback) |
| `STRIPE_PRICE_ID_FULL_PROFILE` | Price ID for Full Profile ($12) |
| `STRIPE_PRICE_ID_AI_PLAYBOOK` | Price ID for AI Playbook ($19) |
| `STRIPE_PRICE_ID_TEAM_MONTHLY` | Price ID for Team Monthly ($29/mo) |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret |
| `STRIPE_PUBLISHABLE_KEY` | Public key (used client-side) |
| `POSTHOG_PROJECT_API_KEY` | PostHog server-side event capture |

### 5.4 Webhook Configuration

- Stripe webhook endpoint: `https://1test.me/api/stripe-webhook`
- Events to listen for: `checkout.session.completed`
- **Known gap:** Webhook currently sends purchase event to GA4 but NOT to PostHog. This must be fixed (see Section 2.3).

---

## 6. PDF Generation Process

### 6.1 Overview

Full Profile PDFs are generated client-side using `html-to-image` (already integrated for share cards). The user's results are rendered into a styled container and exported as PNG or PDF.

### 6.2 Process

1. User unlocks Full Profile results.
2. A "Download PDF" button appears on the results page.
3. The results container is rendered with print-friendly styles.
4. `html-to-image` captures the container as an image.
5. For PDF output, the image is wrapped in a PDF using browser `window.print()` or a future server-side PDF library.
6. The PDF is delivered directly to the browser (no server storage of user data).

### 6.3 Quality Checks

- Verify all four frameworks render correctly in the PDF.
- Check that trademarked names are absent (use "16 Personalities", "DISC", "Strengths", "Enneagram").
- Verify PDF renders correctly on mobile Safari and Chrome.

---

## 7. AI Playbook Generation

### 7.1 Overview

The AI Playbook is a personalized growth guide generated from the user's test results using the Claude API. The user sees a preview and can purchase the full playbook.

### 7.2 Process

1. User completes Full Profile and sees an upsell for the AI Playbook.
2. On purchase confirmation, the backend sends the user's results to the Claude API with a carefully designed prompt.
3. The prompt includes:
   - User's Strengths profile (top 5 + descriptions)
   - User's DISC type
   - User's Enneagram type
   - User's 16 Personalities type
   - Instructions to produce actionable, strengths-based career and growth advice
4. Claude generates the playbook text.
5. Quality check: verify no medical/therapeutic claims, no trademarked names.
6. Deliver to user via in-app display and/or PDF download.

### 7.3 Quality Bar

- No medical, therapeutic, or diagnostic claims
- No trademarked names
- Actionable (at least 3 concrete recommendations per framework)
- Personalized (references the user's specific results, not generic advice)

### 7.4 Red Lines

- Do not store user data without GDPR-compliant infrastructure in place (see GDPR/Privacy SOP).
- AI-generated content must be reviewed for red-line compliance before first launch.

---

## 8. Affiliate Link Management

### 8.1 Overview

1Test may include affiliate links in blog content and result pages (e.g., Amazon Associates for book recommendations, course platforms for learning resources).

### 8.2 Process

1. **Selection** — Affiliate programs must be relevant to the user's personality/growth context. Priority: books, courses, and tools directly related to Strengths, DISC, Enneagram, or career development.
2. **Tracking** — All affiliate links use UTM parameters: `?utm_source=1test&utm_medium=affiliate&utm_content={framework}_{placement}`.
3. **Disclosure** — All pages containing affiliate links include a clear affiliate disclosure statement.
4. **Review** — Affiliate links are reviewed quarterly for relevance and performance. Underperforming links are removed.

### 8.3 Red Lines

- Never recommend products that make medical or therapeutic claims.
- Never use trademarked names in affiliate link text or descriptions.
- All affiliate relationships require CEO approval before first placement.

---

## 9. Refund Handling

### 9.1 Policy

Refund handling requires a Founder-approved refund policy. Until that policy is in place:

1. Refund requests are handled manually by the Founder/CEO.
2. Process Stripe refunds via the Stripe Dashboard.
3. Record refund reason and amount in a tracking spreadsheet.

### 9.2 Future State

Once a refund policy is approved:
- Automated refund processing for eligible requests within the policy window.
- Clear refund policy displayed on the website.
- Refund metrics tracked as part of revenue operations KPIs.

---

*This SOP is documentation only. Code changes and pricing adjustments require separate tasks with appropriate approvals. Companion documents: revenue-tracking-dashboard-spec.md, conversion-funnel-analysis.md, revenue-optimization-recommendations.md*
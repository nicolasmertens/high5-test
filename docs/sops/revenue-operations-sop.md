# Revenue Operations SOP

**Owner:** CEO (Founder approval required for pricing changes)
**Last updated:** 2026-04-10
**Status:** Active

---

## 1. Stripe Payment Flow

### 1.1 Pricing Tiers

| Tier | Price | What the user gets |
|------|-------|--------------------|
| Free | $0 | Top 5 Strengths + type teasers for DISC, Enneagram, 16 Personalities |
| Full Profile | $9–15 | Complete results across all four frameworks |
| AI Playbook | $19 | Personalized growth playbook generated from results |
| Team | $29/mo per seat | Team dashboard, group insights, manager view |

**Red line:** Pricing changes require Founder approval. Do not adjust prices without explicit sign-off.

### 1.2 Payment Flow

1. User completes the free test and reaches the Results screen.
2. Free tier shows Top 5 Strengths + type teasers. An upgrade prompt explains what the Full Profile unlocks.
3. User clicks "Unlock Full Profile" → the `UpgradePrompt` component calls `POST /api/create-checkout-session` with the Stripe price ID.
4. Stripe Checkout session is created. User is redirected to Stripe-hosted checkout.
5. On successful payment, Stripe webhook (`POST /api/stripe-webhook`) fires `checkout.session.completed`.
6. Webhook records the purchase and fires GA4 purchase event (or PostHog equivalent).
7. User returns to 1test.me with `?session_id={CHECKOUT_SESSION_ID}`. Frontend calls `GET /api/verify-session?session_id=xxx` to confirm payment.
8. Full results are unlocked.

### 1.3 Environment Variables

| Variable | Purpose |
|----------|---------|
| `STRIPE_SECRET_KEY` | Stripe secret key (live or test mode) |
| `STRIPE_PRICE_ID` | Price ID for the Full Profile product |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret |
| `STRIPE_PUBLISHABLE_KEY` | Public key (used client-side via `@stripe/stripe-js`) |

### 1.4 Webhook Configuration

- Stripe webhook endpoint: `https://1test.me/api/stripe-webhook`
- Events to listen for: `checkout.session.completed`

---

## 2. PDF Generation Process

### 2.1 Overview

Full Profile PDFs are generated client-side using `html-to-image` (already integrated for share cards). The user's results are rendered into a styled container and exported as PNG or PDF.

### 2.2 Process

1. User unlocks Full Profile results.
2. A "Download PDF" button appears on the results page.
3. The results container is rendered with print-friendly styles.
4. `html-to-image` captures the container as an image.
5. For PDF output, the image is wrapped in a PDF using browser `window.print()` or a future server-side PDF library.
6. The PDF is delivered directly to the browser (no server storage of user data).

### 2.3 Quality Checks

- Verify all four frameworks render correctly in the PDF.
- Check that trademarked names are absent (use "16 Personalities", "DISC", "Strengths", "Enneagram").
- Verify PDF renders correctly on mobile Safari and Chrome.

---

## 3. AI Playbook Generation

### 3.1 Overview

The AI Playbook is a personalized growth guide generated from the user's test results using the Claude API. The user sees a preview and can purchase the full playbook.

### 3.2 Process

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

### 3.3 Quality Bar

- No medical, therapeutic, or diagnostic claims
- No trademarked names
- Actionable (at least 3 concrete recommendations per framework)
- Personalized (references the user's specific results, not generic advice)

### 3.4 Red Lines

- Do not store user data without GDPR-compliant infrastructure in place (see GDPR/Privacy SOP).
- AI-generated content must be reviewed for red-line compliance before first launch.

---

## 4. Affiliate Link Management

### 4.1 Overview

1Test may include affiliate links in blog content and result pages (e.g., Amazon Associates for book recommendations, course platforms for learning resources).

### 4.2 Process

1. **Selection** — Affiliate programs must be relevant to the user's personality/growth context. Priority: books, courses, and tools directly related to Strengths, DISC, Enneagram, or career development.
2. **Tracking** — All affiliate links use UTM parameters: `?utm_source=1test&utm_medium=affiliate&utm_content={framework}_{placement}`.
3. **Disclosure** — All pages containing affiliate links include a clear affiliate disclosure statement.
4. **Review** — Affiliate links are reviewed quarterly for relevance and performance. Underperforming links are removed.

### 4.3 Red Lines

- Never recommend products that make medical or therapeutic claims.
- Never use trademarked names in affiliate link text or descriptions.
- All affiliate relationships require CEO approval before first placement.

---

## 5. Refund Handling

### 5.1 Policy

Refund handling requires a Founder-approved refund policy. Until that policy is in place:

1. Refund requests are handled manually by the Founder/CEO.
2. Process Stripe refunds via the Stripe Dashboard.
3. Record refund reason and amount in a tracking spreadsheet.

### 5.2 Future State

Once a refund policy is approved:
- Automated refund processing for eligible requests within the policy window.
- Clear refund policy displayed on the website.
- Refund metrics tracked as part of revenue operations KPIs.

---

*This SOP is documentation only. Code changes and pricing adjustments require separate tasks with appropriate approvals.*
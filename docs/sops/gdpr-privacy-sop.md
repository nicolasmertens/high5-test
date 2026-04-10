# GDPR/Privacy SOP

**Owner:** CEO (Founder approval required for legal documents and data infrastructure changes)
**Last updated:** 2026-04-10
**Status:** Active

---

## 1. Data Collection Inventory

### 1.1 Current State

1Test currently has **no backend**. The product is a static frontend (Vite/React) deployed on Vercel with serverless API routes for Stripe. The following is an inventory of data touchpoints in the current product, plus specifications for future backend infrastructure.

### 1.2 Data Categories

| Category | Data Points | Legal Basis | Storage | Purpose |
|----------|-------------|--------------|---------|---------|
| Test responses | Question answers (1–5 Likert scale, ~120 items) | Consent (Legitimate Interest for anonymized scoring) | Client-side only (localStorage) | Personality assessment scoring |
| Derived results | Strengths top 5, DISC type, Enneagram type, 16 Personalities type | Consent | Client-side only (localStorage) | Display results to user |
| Payment data | Email, Stripe session ID | Contract performance | Stripe (not stored in 1test backend) | Process payment |
| Analytics | Page views, events, conversion events | Consent (cookie banner) | Third-party (PostHog / GA4) | Product improvement |

### 1.3 Red Line

**VISION.md mandate:** NEVER store user data without GDPR-compliant infrastructure in place. This means:
- No server-side database of user responses or results until the infrastructure in this SOP is built.
- No email collection without explicit opt-in and a data processing agreement.
- No third-party tracking without cookie consent.

---

## 2. Consent Management

### 2.1 Consent Flow (Frontend Specification)

When a user first visits 1test.me:

1. **Cookie consent banner** appears before any non-essential cookies fire.
2. Banner options:
   - "Accept all" — enables analytics and marketing cookies
   - "Reject all" — only essential cookies (none currently required)
   - "Customize" — granular toggles for analytics and marketing
3. Consent choice is stored in `localStorage` under `consent_preferences`.
4. On subsequent visits, the banner does not reappear unless preferences expire (12-month renewal).

### 2.2 Consent Schema

```typescript
interface ConsentPreferences {
  version: 1;
  timestamp: string; // ISO 8601
  analytics: boolean;
  marketing: boolean;
  essential: true; // always true, non-optional
}
```

### 2.3 Consent Withdrawal

- Users can reopen the consent banner at any time via a "Privacy Settings" footer link.
- Changing consent immediately toggles tracking — no page reload needed.
- Withdrawing analytics consent stops event tracking to PostHog/GA4.
- Withdrawing marketing consent suppresses any future email signup prompts.

### 2.4 Technical Implementation

- Cookie consent component: React component rendered in App root.
- Analytics initialization gated on `consent_preferences.analytics === true`.
- Preference changes emit a `consentChanged` event that analytics listeners subscribe to.

---

## 3. Data Deletion Process

### 3.1 Current State

Since 1Test has no backend, there is no server-side user data to delete. User data currently exists only in:
- `localStorage` on the user's device (test responses, results)
- Third-party analytics tools (PostHog/GA4) — covered by their respective DPAs
- Stripe (payment data) — covered by Stripe's DPA

### 3.2 Future Backend Specification

When a backend is built, the following API endpoints must exist:

```
DELETE /api/user/data          — Delete all user data (right to erasure, GDPR Art. 17)
GET  /api/user/data            — Export all user data (right to access, GDPR Art. 15)
POST /api/user/consent         — Record/update consent preferences
```

### 3.3 Deletion Workflow (Future)

1. User submits a deletion request via the "Privacy Settings" page or by emailing privacy@1test.me.
2. System verifies identity (email + payment confirmation or test ID).
3. Within 30 days:
   - All user responses and results are deleted from the database.
   - Analytics events associated with the user ID are anonymized.
   - Stripe customer record retention follows Stripe's data retention policy (user can request deletion directly from Stripe).
4. User receives confirmation email that deletion is complete.

### 3.4 Data Retention Policy

| Data Type | Retention Period | After Expiry |
|-----------|-----------------|--------------|
| Test responses | Until user requests deletion | Deleted |
| Derived results | Until user requests deletion | Deleted |
| Payment records | 7 years (tax compliance) | Archived, then deleted |
| Analytics events | 26 months (PostHog default) | Automatically deleted |
| Consent records | Duration required by GDPR (typically 7 years) | Archived |

---

## 4. Privacy Policy Maintenance

### 4.1 Current Policy

The live site includes a Privacy Policy page at `/privacy` and Terms of Service at `/terms`. These were deployed with the Stripe integration.

### 4.2 Maintenance Process

1. **Trigger for update:** Any change to data collection, third-party tools, or legal requirements.
2. **Review cadence:** Quarterly, or whenever a new data practice is introduced.
3. **Review process:**
   - Engineer identifies data practice changes.
   - CEO reviews and updates the privacy policy text.
   - Founder approves the final text (legal document approval required per VISION.md).
   - Engineer deploys the updated policy.
4. **Version tracking:** Each update increments a version number and date at the top of the privacy policy page.
5. **Notification:** Material changes to the privacy policy trigger a re-consent flow (cookie banner reappears).

### 4.3 Red Lines

- Privacy policy and Terms of Service require **Founder approval** before publication.
- Never state data practices that are not actually implemented.
- Never claim compliance with regulations that have not been verified.

---

## 5. Cookie Consent Implementation

### 5.1 Technical Specification

**Component:** `<CookieConsentBanner />`

**Behavior:**
- Rendered at app root level.
- On first visit: shows banner with Accept All / Reject All / Customize buttons.
- Saves preferences to `localStorage` as `consent_preferences` (see §2.2).
- On preference save: dispatches `consentChanged` event on `window`.
- Does not reappear for 12 months after consent is given.
- "Privacy Settings" link in footer reopens the banner.

**Analytics gating:**
- PostHog/GA4 initialization is deferred until `consent_preferences.analytics === true`.
- If consent is later withdrawn, analytics tracking is stopped immediately and the PostHog opt-out API is called.

### 5.2 Cookie Categories

| Category | Cookies | Duration | Purpose |
|----------|---------|----------|---------|
| Essential | None (1Test does not use essential cookies beyond session) | — | — |
| Analytics | PostHog (`ph_*`), GA4 (`_ga`, `_ga_*`) | 13 months | Product improvement |
| Marketing | None currently | — | — |

### 5.3 Implementation Checklist

- [ ] Build `<CookieConsentBanner />` React component
- [ ] Add `consent_preferences` localStorage schema
- [ ] Gate PostHog initialization on consent
- [ ] Gate GA4 initialization on consent (if still used alongside PostHog)
- [ ] Add "Privacy Settings" link to footer
- [ ] Add `window.dispatchEvent('consentChanged')` on preference save
- [ ] Test: verify no analytics cookies set before consent
- [ ] Test: verify analytics fire after "Accept all"
- [ ] Test: verify analytics stop after "Reject all"

---

*This SOP specifies what needs to be built. Actual implementation requires separate engineering tasks. GDPR infrastructure must be in place BEFORE any user data is stored server-side.*
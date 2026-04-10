# Viral Loop Spec: Invite-3-Colleagues Relationship Report

**Issue:** TESA-52  
**Author:** Head of Growth Agent, 1Test  
**Date:** 2026-04-10  
**Status:** Spec — ready for CEO review and Engineer implementation

---

## 1. Overview

The invite-3-colleagues mechanic is 1Test's primary viral growth loop. When a user completes the assessment, they are prompted to invite up to 3 colleagues (or friends) for free. When an invitee completes the test, both the inviter and invitee receive a personalized relationship report comparing their profiles. This report is compelling enough to share, and each new user who completes the test can invite 3 more people — creating a compounding viral loop.

**Why this works:**
- The free test already delivers value (top 5 strengths). The relationship report is a natural, high-value next step — not a gimmick.
- Both parties benefit from the same action (take the test). No one is asked to pay or create an account just to see the comparison.
- The "3 free invites" mechanic mirrors the product's "4 frameworks from one test" philosophy: one action, multiple outputs.
- Relationship reports are inherently shareable — teams screenshot and share their compatibility results.

---

## 2. Current State (What Exists)

| Component | Status |
|-----------|--------|
| ShareButtons component | Live — Twitter, Facebook, LinkedIn, WhatsApp, Copy Link |
| ShareCard component | Live — branded image download with results |
| Analytics (share events) | Live — GA4 + dataLayer tracking |
| Invite form in ActionBranches.tsx | Placeholder — email input + "Send Invite" button, both `disabled` |
| "First 3 invites are free" copy | Present in placeholder text |
| Relationship report generation | Not implemented |
| Referral/invite backend | Not implemented |
| User accounts | Not implemented (localStorage only) |
| Email service for invites | Not implemented |

---

## 3. User Flow

### 3.1 Inviter Flow

```
RESULTS PAGE (free or paid)
  └─► "See How You Work With Others" card
       ├─► Up to 3 email invites (free)
       ├─► Or: copy shareable link with referral code
       └─► "First 3 are free — each person who completes
            the test unlocks a relationship report for both of you"
```

**Specific steps:**

1. User completes the assessment and sees their results page.
2. On the results page (both free and paid), the "See How You Work With Others" section is visible and interactive.
3. User enters up to 3 email addresses in invite fields.
4. Each invitee receives an email: "[Inviter Name] wants to see how you work together — take the free 1Test assessment."
5. Alternatively, the user can copy a personal referral link and share it via any channel (Slack, text, etc.).
6. When an invitee completes the test, the inviter gets a notification (email or in-app banner): "Your relationship report with [Invitee] is ready."
7. The inviter can view the relationship report on a dedicated `/relationship/[id]` page.

### 3.2 Invitee Flow

```
EMAIL or REFERRAL LINK
  └─► Landing page (with inviter context: "[Name] invited you")
       └─► Assessment (same 120 questions)
            └─► Results page (invitee sees their own results)
                 └─► "See How You Work With Others" card
                      └─► (Loop restarts — invitee becomes inviter)
```

**Specific steps:**

1. Invitee clicks the email link or referral link.
2. They land on 1test.me with a query parameter like `?ref=CODE` that identifies the inviter.
3. A banner shows: "[Inviter Name] invited you to see how you work together. Take the free assessment."
4. The invitee takes the same 120-question assessment.
5. Upon completion, the invitee sees their own results (same free/paid split as any user).
6. The invitee also sees: "Your relationship report with [Inviter Name] is ready — view it now."
7. Both the inviter and invitee now have access to the relationship report.
8. The invitee can also invite 3 more people (viral loop).

### 3.3 Relationship Report Flow

```
/relationship/[id] PAGE
  ├─► Side-by-side profile comparison
  ├─► Communication compatibility section
  ├─► Strengths overlap & complement section
  ├─► Working together tips
  ├─► Potential friction points
  └─► Share relationship report card (image download + social share)
```

---

## 4. Product Specifications

### 4.1 Invite Mechanics

**Free invites:**
- Every user (free or paid) gets 3 free invites.
- No account creation required to send invites. We store a session-based referral code in localStorage alongside existing test results.
- After 3 free invites, additional invites require a Full Profile purchase ($12). This is an upsell window.
- Paid users get unlimited invites as part of their profile access.

**Invite delivery:**
- **Email:** Primary channel. Each invite sends a personalized email from 1Test (no impersonation — clearly from 1Test).
- **Referral link:** Secondary channel. User gets a `https://1test.me/?ref=CODE` link they can copy and share.
- **Social share:** Existing ShareButtons are updated to include the user's referral code in the share URL.

**Email content:**
```
Subject: [Inviter First Name] wants to see how you work together

Body:
[Inviter Name] just completed their personality assessment on 1Test 
and discovered their top strengths. They think you'd find it 
interesting — and they'd love to see how your profiles compare.

Take the free assessment (about 10 minutes) and you'll both get a 
personalized relationship report showing how you communicate, 
collaborate, and complement each other.

[Take the Free Assessment →]

Your results stay private until you choose to share them.
```

**Referral code format:**
- Short, URL-safe, 8 characters. Example: `https://1test.me/?ref=a3xK7mN2`
- Generated client-side from a hash of the session/storage ID + timestamp.
- Mapped to a inviter profile hash in the backend. The referral code resolves to the inviter's stored profile.

### 4.2 Relationship Report Content

The relationship report is generated by comparing two users' assessment results across all four frameworks. It is **deterministic** — no LLM or AI generation required (though an AI-powered version is a future tier opportunity).

**Sections:**

#### 4.2.1 Hero: Side-by-Side Profile

```
┌─────────────────────────────────────────────────┐
│  [Person A]            vs.         [Person B]    │
│  ENTP · D style                  ISFJ · S style  │
│  Enneagram 3w4                   Enneagram 9w1   │
│  Top: Strategist                 Top: Supporter   │
│                                     │
│          [Compatibility Score: 72%]              │
└─────────────────────────────────────────────────┘
```

- Compatibility score is calculated from framework overlap (see Section 5).
- Top 3 strengths for each person shown side-by-side.

#### 4.2.2 Communication Compatibility (DISC-Based)

Based on both users' DISC profiles, show:
- **How A communicates with B:** "As a D style, you prefer direct, fast communication. B is an S style who values patience and stability. Slow down, give context, ask for their input."
- **How B communicates with A:** Mirror perspective. "As an S style, you prefer thoughtful, step-by-step communication. A is a D style who wants bottom-line results. Lead with conclusions, then provide details."
- **Best meeting format:** "You two work best in structured 1:1s with a shared agenda."
- **Communication tips:** 3 bullet-point practical advice items.

This maps directly to the existing DISC derivation logic already in the codebase (`deriveDISC`).

#### 4.2.3 Strengths Overlap & Complement

- **Shared strengths:** Where both users scored high on the same strength. "You both excel at [Strength X] — this is a natural collaboration zone."
- **Complementary strengths:** Where A's top strength maps to B's bottom strength (or vice versa). "Your [Strength Y] fills a gap for [Person B]. They can lean on you for this."
- **Potential friction:** Where A and B have opposing work styles. "You're energized by [X]; they're drained by it. Here's how to navigate that."

The existing strength data model (20 strengths, each with `energized`/`drained` descriptions) already provides everything needed for this section.

#### 4.2.4 16 Personalities Interaction

- Brief interaction dynamic based on the two types.
- "ENTP + ISFJ: The Innovator and the Protector. You bring ideas; they bring follow-through. The gap is between speed — you want to move fast, they want to be thorough."
- Use a lookup table of 16×16 type pairings (256 combinations). Each pairing gets a 1-2 sentence dynamic description + 1 tip.

#### 4.2.5 Enneagram Connection

- How both Enneagram types interact in stress and growth.
- "Type 3 + Type 9: The Achiever and the Peacemaker. Under stress, 3 pushes harder while 9 withdraws. At your best, 3 provides direction and 9 provides stability."
- Use a lookup table of 9×9 type pairings (81 combinations). Each gets a brief dynamic.

#### 4.2.6 Action Card

A shareable image card (extends the existing `ShareCard` component pattern):

```
┌──────────────────────────────────┐
│  [A] & [B]                       │
│  Relationship Report              │
│  Compatibility: 72%              │
│  "Innovator + Protector"          │
│  Top overlap: Strategic Thinking │
│  1Test.me                        │
└──────────────────────────────────┘
```

### 4.3 Pricing & Access Tiers

| Action | Free User | Paid User |
|--------|-----------|-----------|
| Send invites | 3 free | Unlimited |
| View own relationship reports | Yes (for each completed invite) | Yes |
| Share relationship report card | Yes (with watermark) | Yes (no watermark) |
| Download relationship report PDF | No | Yes |
| Access relationship report comparison details: communication, strengths, personality, Enneagram | Yes (first 3 invites free) | Yes |

**Key growth decision:** The relationship report should be FREE for the first 3 invites (in both directions). This maximizes the viral coefficient. Payment gates unlimited invites and PDF exports, not the core experience.

---

## 5. Technical Specifications

### 5.1 Data Model

**Referral/Invite object:**
```typescript
interface Invite {
  id: string;                // UUID
  inviterProfileHash: string; // Hash of inviter's stored results
  inviteeEmail: string;       // Invitee email
  inviteeProfileHash?: string; // Populated after invitee completes test
  referralCode: string;       // 8-char code, e.g. "a3xK7mN2"
  status: "pending" | "completed" | "expired";
  createdAt: string;          // ISO timestamp
  completedAt?: string;       // ISO timestamp
  expiresAt: string;           // ISO timestamp (7 days from creation)
}
```

**Relationship Report object:**
```typescript
interface RelationshipReport {
  id: string;
  profileA: ProfileHash;      // Inviter
  profileB: ProfileHash;       // Invitee
  compatibilityScore: number;  // 0-100
  discCompatibility: DISCCompatibilityDetail;
  strengthsOverlap: StrengthsOverlapDetail;
  personalityInteraction: PersonalityPairDetail;
  enneagramConnection: EnneagramPairDetail;
  createdAt: string;
}
```

### 5.2 Compatibility Scoring Algorithm

The compatibility score (0-100) is a weighted average of three components:

```
compatibilityScore = (
  discWeight * discScore +
  strengthsWeight * strengthsScore +
  personalityWeight * personalityScore
) / (discWeight + strengthsWeight + personalityWeight)
```

**Weights:** DISC 40%, Strengths 30%, 16 Personalities 30%

**DISC compatibility (0-100):**
- Compare primary DISC types (D, I, S, C)
- Use a fixed 4×4 compatibility matrix:

```
      D    I    S    C
D   70   55   40   60
I   55   75   65   45
S   40   65   80   70
C   60   45   70   65
```

- Same type = moderate compatibility (you understand each other, but may lack complement)
- Complementary types (D-S, I-C) = high compatibility due to natural balance
- Clashing types (D-S low, I-C low) = lower score, but with actionable friction points

**Strengths overlap (0-100):**
- Calculate Jaccard similarity of both users' top 5 strengths (0-33% weight)
- Calculate complement score: how many of A's bottom 5 appear in B's top 5 (0-33% weight)
- Calculate friction score: how many of A's top 5 overlap with B's bottom 5 (inverted — 0-33% weight)
- Combined: `(similarity * 0.33 + complement * 0.33 + (1 - friction) * 0.33) * 100`

**16 Personalities compatibility (0-100):**
- Use the 16×16 pairing matrix (to be authored by Head of Growth, stored as a JSON lookup)
- Each pairing maps to a compatibility score and a dynamic description
- Dimension-by-dimension comparison: for each of the 4 dimensions (E-I, N-S, T-F, J-P), same polarity = moderate, complementary = high

**Enneagram connection (qualitative, not scored):**
- Not included in the numeric compatibility score
- Displayed as a narrative section based on the 9×9 pairing matrix
- Each pairing has a brief dynamic description (2-3 sentences)

### 5.3 API Endpoints Needed

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/api/invite` | Create an invite (email + referral code generation) |
| `GET` | `/api/invite?ref=CODE` | Look up invite by referral code (for invitee landing) |
| `GET` | `/api/invites?profile=HASH` | List all invites sent by a profile |
| `POST` | `/api/relationship` | Generate relationship report when both profiles exist |
| `GET` | `/api/relationship/[id]` | Fetch a relationship report by ID |
| `GET` | `/api/relationships?profile=HASH` | List all relationship reports for a profile |

### 5.4 Frontend Components Needed

| Component | Purpose |
|-----------|---------|
| `InviteSection.tsx` | Replaces the disabled placeholder in ActionBranches.tsx. Email inputs, invite counter (X/3 free), send button, referral link copy. |
| `RelationshipReport.tsx` | Full relationship report page at `/relationship/[id]`. Side-by-side comparison, communication tips, strengths overlap, share card. |
| `RelationshipCard.tsx` | Shareable image card for relationship reports (extends ShareCard pattern). |
| `InviteBanner.tsx` | Banner shown to invitees: "[Name] invited you to see how you work together." |
| `InviteNotification.tsx` | In-app notification: "Your relationship report with [Name] is ready." |
| Update `ShareButtons.tsx` | Add referral code to share URLs when available |
| Update `ResultsScreen.tsx` | Show invite section for both free and paid users. Show relationship report notification link when available. |

### 5.5 Email Service

- Use a serverless email function (Vercel function, similar to existing `/api/create-checkout-session.ts`).
- Recommended provider: **Resend** (simple API, good deliverability, free tier covers early volume) or **SendGrid** (established, generous free tier).
- Requires Founder approval before adding a new third-party service (per TOOLS.md red line: "DO NOT add new third-party services without Founder approval").

### 5.6 Profile Storage & Privacy

**Critical privacy constraint:** Personality data is sensitive (per VISION.md guiding principle #4). The invite system must:

1. **Never expose full profiles to invitees.** The invitee only sees the relationship report, not the inviter's raw scores.
2. **Store profile hashes, not raw data, in invite links.** The referral code maps to a server-side profile hash, not to the full assessment data.
3. **Require explicit consent.** Before sending an invite, the inviter must see: "Your colleague will know you invited them and will see a compatibility report. Your detailed scores stay private."
4. **GDPR compliance.** Both inviter and invitee can request data deletion at any time. Invite links expire after 7 days.
5. **No account creation required.** Both free and paid users can send invites. We store enough data in localStorage + a server-side hash to make this work without accounts.

**Profile storage approach (for Engineer):**
- When a user completes the assessment, generate a `profileHash` from their results.
- Store the compressed/serialised results keyed by `profileHash` in a server-side data store (Vercel KV or similar).
- The referral code maps to the inviter's `profileHash`.
- When the invitee completes the test, their `profileHash` is also stored, and the relationship report can be generated from `profileA` + `profileB`.

### 5.7 Analytics Events

New PostHog/GA4 events to track the viral loop:

| Event | Properties | Purpose |
|-------|-----------|---------|
| `invite_sent` | `channel` (email/link), `invite_count` (1/2/3), `is_paid` | Track invite funnel |
| `invite_viewed` | `referral_code`, `inviter_profile_hash` | Track invitee arrival |
| `invite_completed` | `referral_code`, `time_to_complete`, `invitee_profile_hash` | Track loop completion |
| `relationship_report_generated` | `report_id`, `compatibility_score` | Track report creation |
| `relationship_report_viewed` | `report_id`, `viewer_role` (inviter/invitee) | Track report engagement |
| `relationship_report_shared` | `report_id`, `share_channel` | Track viral amplification |
| `invite_upsell_shown` | `invites_used`, `is_paid` | Track upsell conversion |
| `invite_upsell_clicked` | `invites_used`, `is_paid` | Track upsell CTR |

### 5.8 SEO Considerations

The relationship report page should NOT be publicly crawlable (it contains personal data). However, we should:

1. Add structured data (JSON-LD) to the invite landing page that describes 1Test generically.
2. The invite flow creates new landing page visits from referral links — each visit is tracked with UTM parameters: `utm_source=invite&utm_medium=referral&utm_campaign=relationship_report`.
3. Add a canonical `<meta name="robots" content="noindex">` on `/relationship/[id]` pages to keep them out of search index.
4. Add Schema.org `FAQPage` structured data to the invite landing section about relationship reports.

---

## 6. Implementation Phases

### Phase 1: MVP (Week 1-2, prerequisite: backend accounts/storage)

**Dependencies:** Backend infrastructure (user sessions/profile storage) must exist first. This is listed as "Now (Week 1-2)" in VISION.md.

1. Profile hash generation and server-side storage.
2. Referral code generation (client-side, stored in localStorage).
3. `InviteSection.tsx` replaces the disabled placeholder in ActionBranches.tsx.
4. Email invite sending (via Vercel serverless function + email API).
5. Referral link copy functionality.
6. Invitee landing page with inviter context banner.
7. Relationship report generation (server-side, deterministic from two profile hashes).
8. `/relationship/[id]` page with full report UI.
9. Analytics events for the entire flow.

### Phase 2: Optimization (Week 3-4)

1. Relationship report share card (image download for social).
2. "Your relationship report is ready" email notification to inviter.
3. A/B test: show invite section on free results page vs. only on paid results page.
4. A/B test: invite copy variants ("See how you work together" vs. "Compare your personality" vs. "Your team compatibility report").
5. Referral link integration with existing ShareButtons (add `ref=CODE` to all share URLs).
6. Unlimited invites for paid users.

### Phase 3: Growth Acceleration (Month 2-3)

1. Relationship report SEO-optimized landing page (public, generic — "Free relationship report for teams").
2. Email drip to pending invitees (day 3 reminder, day 7 final — paired with expiry).
3. Team dashboard features (multiple relationships at once).
4. LinkedIn "Add to Profile" integration.
5. AI-powered relationship narrative (upgrade prompt for paid tier).

---

## 7. Content Specifications

### 7.1 Email Templates

**Invite email (sent to invitee):**

```
Subject: [Inviter Name] wants to see how you work together

---

Hi [Invitee First Name or "there"],

[Inviter Name] just completed their free personality assessment on 
1Test — and they'd like to compare profiles with you.

Take the free assessment (about 10 minutes) and you'll both get a 
personalized relationship report showing:
• How you communicate with each other
• Where your strengths overlap and complement
• How to avoid friction and work better together

Your results stay private until you choose to share them.

[Take the Free Assessment →]

— 1Test
One Test. Four Frameworks.
```

**Notification email (sent to inviter when invitee completes):**

```
Subject: Your relationship report with [Invitee Name] is ready

---

[Inviter Name],

[Invitee Name] completed their personality assessment. Your 
relationship report is ready!

[View Your Relationship Report →]

— 1Test
```

### 7.2 In-App Copy

**Invite section heading:**
> **See How You Work With Others**
> Invite up to 3 colleagues for free. Each person who completes the assessment unlocks a relationship report for both of you.

**Invite form:**
- Input placeholder: "colleague@company.com"
- Button: "Send Invite"
- Counter: "1 of 3 free invites used" (updates as invites are sent)
- Link copy: "Or copy your invite link:"
- Consent text: "Your colleague will know you invited them. Your detailed results stay private."

**Invitee landing banner:**
> **[Inviter Name] invited you**
> They completed the 1Test assessment and want to see how you work together. Take the free assessment to unlock your shared relationship report.

**Relationship report ready notification:**
> **Your report is ready!**
> [Invitee Name] completed their assessment. See how you work together.

**Upsell (after 3 invites used):**
> **Want more invites?** Upgrade to the Full Profile for unlimited relationship reports — plus your detailed 20-strength profile, personality breakdown, and more.

### 7.3 16×16 Personality Interaction Pairs

These will be authored as a separate JSON data file (`src/data/personality-pairs.json`) containing:
- 256 entries (16×16)
- Each entry: `{pair: "ENTP-ISFJ", label: "The Debater & The Defender", dynamic: "Brief description", tip: "One actionable tip"}`
- The Head of Growth will author these in a follow-up content task.

### 7.4 9×9 Enneagram Connection Pairs

Similar JSON data file (`src/data/enneagram-pairs.json`):
- 81 entries (9×9, including same-type pairings)
- Each entry: `{pair: "3-9", label: "The Achiever & The Peacemaker", dynamic: "Brief description", atBest: "Description", underStress: "Description"}`

---

## 8. Success Metrics

| Metric | Target (30 days post-launch) | Measurement |
|--------|-------|-------------|
| Invites sent per user | 1.5 average | Median invites per completed assessment |
| Invite-to-completion rate | 25% | Invitees who complete the assessment / invites sent |
| Viral coefficient (K-factor) | > 0.3 | New users acquired through invites / total users |
| Relationship reports generated | 500+ | Total reports generated |
| Upsell conversion from invite limit | 5% | Users who upgrade after 3 free invites |
| Share rate for relationship reports | 15% | Reports shared / reports viewed |

These are conservative targets for the first 30 days. The goal above all is to validate that the invite mechanic drives word-of-mouth growth, not just viral vanity metrics.

---

## 9. Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Low invite-to-completion rate (people ignore emails) | A/B test email subject lines. Add WhatsApp/Slack share as secondary channel. Send one reminder email at day 3. |
| Privacy concerns about sharing personality data | Explicit consent checkbox. Clear "your detailed results stay private" messaging. Only the relationship report is shared, not raw scores. |
| Abuse / spam invites | 3 free invite limit. Rate limiting on `/api/invite`. Email validation. Expire invites after 7 days. |
| Users completing test without account storage (localStorage) | Phase 1 uses localStorage + server-side profile hash. Phase 2 migrates to proper accounts. |
| Social desirability bias in compatibility scores | Present compatibility as "working style fit" not "how good a match you are." Emphasize collaboration tips over judgment. |
| Cold start problem (no existing relationships to show reports) | The first relationship report is generated instantly when an invitee completes the test. No pre-existing data needed. |

---

## 10. Open Questions (for CEO/Founder)

1. **Email service provider:** Resend vs. SendGrid vs. other. Requires Founder approval (per red lines on third-party services). **Recommendation:** Resend — simpler API, generous free tier, good deliverability.
2. **Data storage:** Where to store profile hashes and invite data during the MVP phase? **Options:** Vercel KV (simple, low cost), Supabase (more features, requires setup). **Recommendation:** Vercel KV for MVP, migrate to Supabase when accounts launch.
3. **Free vs. paid access:** Should the 3 free invites give full relationship reports, or should deep comparison (personality pair, Enneagram pair) be paid? **Recommendation:** Full reports for free for 3 invites. Maximize the viral loop. Upsell is on unlimited invites + PDF exports.
4. **Email frequency:** How many reminder emails before we stop? **Recommendation:** 1 reminder at 72 hours, 1 final notice at 6 days (before 7-day expiry). No more after that.
5. **Invite access for free users:** The current ActionBranches section is only shown to paid users (`isPaid` renders ActionBranches). Should the invite section be shown to free users too? **Recommendation:** Yes. The invite section should appear on the free results page (before the paywall) to maximize the viral loop. This is a critical growth decision.

---

## 11. Engineer Task Breakdown

When the CEO approves this spec, the following subtasks should be created for the Engineer:

1. **TESA-52-E1:** Create profile hash generation and server-side storage (Vercel KV or Supabase)
2. **TESA-52-E2:** Create `/api/invite` endpoint (CRUD for invites)
3. **TESA-52-E3:** Create `/api/relationship` endpoint (generate + fetch reports)
4. **TESA-52-E4:** Implement referral code generation (client-side + localStorage)
5. **TESA-52-E5:** Build `InviteSection.tsx` component (replaces disabled placeholder)
6. **TESA-52-E6:** Build `RelationshipReport.tsx` page at `/relationship/[id]`
7. **TESA-52-E7:** Build `RelationshipCard.tsx` share card (extends ShareCard pattern)
8. **TESA-52-E8:** Build `InviteBanner.tsx` for invitee landing context
9. **TESA-52-E9:** Implement compatibility scoring algorithm (DISC matrix + strengths overlap + personality pairs)
10. **TESA-52-E10:** Set up email sending (Resend or SendGrid API + Vercel function)
11. **TESA-52-E11:** Add PostHog/GA4 analytics events for invite flow
12. **TESA-52-E12:** Update `ResultsScreen.tsx` to show invite section for free users
13. **TESA-52-E13:** Update `ShareButtons.tsx` to include referral code in share URLs
14. **TESA-52-E14:** Add email templates (invite + notification)
15. **TESA-52-E15:** Add privacy consent flow to invite process

---

*This spec was written by the Head of Growth Agent, 1Test. It is ready for CEO review and prioritization.*
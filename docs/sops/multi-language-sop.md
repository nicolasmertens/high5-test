# Multi-Language SOP

**Owner:** CEO (Founder approval required for first-time language launches)
**Last updated:** 2026-04-10
**Status:** Active

---

## 1. Translation Workflow

### 1.1 Overview

All personality test content must preserve psychological meaning across languages. Machine translation is used for initial drafts, followed by professional psychometric review before any language goes live.

### 1.2 Process

1. **AI Translation (Draft)** — Use a translation LLM (Claude or equivalent) to produce an initial translation of the question bank and UI strings.
2. **Psychometric Review** — A professional translator with psychology/psychometrics background reviews and edits the AI translation. Focus areas:
   - Question meaning preservation (does the translated question measure the same psychological construct?)
   - Cultural adaptation (idioms, work context, social norms)
   - Response scale equivalence (Likert anchors must convey equal intervals)
3. **Red-Line Compliance Check** — Verify the translated content against VISION.md red lines:
   - No trademarked names (MBTI, Myers-Briggs, CliftonStrengths, StrengthsFinder, DiSC with lowercase i). Use "16 Personalities", "DISC", "Strengths", "Enneagram".
   - No medical, therapeutic, or diagnostic claims.
4. **Final Sign-Off** — Founder approves the first launch of any new language. Subsequent content updates for that language need CEO approval only.

### 1.3 Quality Bar

| Criterion | Threshold |
|-----------|-----------|
| Construct fidelity | Reviewer confirms each question measures the same construct as the English original |
| Cultural appropriateness | No culturally offensive or ambiguous items |
| Response scale equivalence | Translated anchors maintain equal-interval perception |
| Red-line compliance | Zero trademarked names or medical claims |

A language must pass all four criteria before launch.

---

## 2. Hreflang Implementation

### 2.1 URL Structure

Each language version lives on a subdirectory path:

```
/en/  (default, current 1test.me)
/de/  (German)
/fr/  (French)
/es/  (Spanish)
/pt/  (Portuguese)
/ja/  (Japanese)
/ko/  (Korean)
/nl/  (Dutch)
/it/  (Italian)
/tr/  (Turkish)
```

### 2.2 Technical Requirements

- Every page includes `<link rel="alternate" hreflang="xx" href="https://1test.me/xx/path" />` tags for all live languages plus `hreflang="x-default"` pointing to the English version.
- The `<html>` tag includes `lang="xx"`.
- Each language version has its own `sitemap-xx.xml`, plus a main `sitemap.xml` that indexes all language sitemaps.
- Use SEO prerendering (same as current `/free-*-test` pages) for each language's landing pages.

---

## 3. Language Launch Checklist

Use this checklist for every new language launch:

- [ ] Question bank translated and reviewed (see §1)
- [ ] UI strings translated (buttons, labels, result descriptions, error messages)
- [ ] SEO landing pages translated (`/xx/free-disc-test`, etc.)
- [ ] Blog content for Tier 1 languages translated and reviewed
- [ ] Hreflang tags added to all existing pages for the new language
- [ ] New `sitemap-xx.xml` generated and linked from main sitemap
- [ ] Privacy Policy and Terms of Service translated (requires Founder approval)
- [ ] Payment flow strings translated (Stripe Checkout locale matches)
- [ ] Vercel route rewrites configured for `/xx/*` paths
- [ ] Smoke test: complete the full test in the new language, reach results, attempt payment
- [ ] Founder approval obtained (first launch only)

---

## 4. Language Priority Tiers

Per VISION.md:

**Tier 1** (launch first):
- German (de)
- French (fr)
- Spanish (es)
- Portuguese (pt)

**Tier 2** (launch after Tier 1 is stable):
- Japanese (ja)
- Korean (ko)
- Dutch (nl)
- Italian (it)
- Turkish (tr)

Each Tier 1 language must be live, reviewed, and stable before any Tier 2 language work begins.

---

*This SOP is documentation only. Code changes require separate implementation tasks.*
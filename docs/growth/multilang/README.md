# Multi-Language SEO Landing Page Copy

**Author:** Emma — Head of Growth, 1Test
**Date:** 2026-04-17
**Status:** All four Tier 1 languages complete — ready for Leo to implement

## Files in this folder

| File | Language | Status |
|------|----------|--------|
| `de-landing-pages.md` | German (DE) | Ready |
| `fr-landing-pages.md` | French (FR) | Ready |
| `es-landing-pages.md` | Spanish (ES) | Ready |
| `pt-landing-pages.md` | Portuguese (PT-BR + PT-PT notes) | Ready |

## Pages covered per language

Each file contains copy for 5 pages:
- `/xx/` — Homepage (H1, hero, value props, CTA, social proof)
- `/xx/free-disc-test`
- `/xx/free-personality-test`
- `/xx/free-enneagram-test`
- `/xx/free-strengths-test`

Each page has: `<title>`, `<meta description>`, H1, intro paragraph, body sections, CTA, FAQ where relevant.

## Implementation notes for Leo

1. **URL structure:** `/de/`, `/fr/`, `/es/`, `/pt/` subdirectory paths (per multi-language SOP)
2. **hreflang:** Add `<link rel="alternate" hreflang="xx">` tags to all pages once each language goes live
3. **lang attribute:** Set `<html lang="de">` / `<html lang="fr">` / `<html lang="es">` / `<html lang="pt-BR">` per page
4. **Sitemaps:** Generate `sitemap-de.xml`, `sitemap-fr.xml`, `sitemap-es.xml`, `sitemap-pt.xml` and link from main sitemap
5. **Founder approval required** for first launch of each language (per SOP §1.2)

## Trademark compliance (all four files)

- No "MBTI" or "Myers-Briggs" anywhere
- No "DiSC" (lowercase i) — always "DISC"
- No "CliftonStrengths" or "StrengthsFinder"
- No medical, therapeutic, or diagnostic claims

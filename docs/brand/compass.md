# Compass — 1Test brand system

Single source of truth for the 1Test visual identity. If a component disagrees with this doc, the component is wrong.

## Tagline

**One Test. Four Frameworks. Know Yourself.**

Used in hero, OG image, email signatures, and meta. Always Title Case.

## Palette

### Canvas (warm cream neutrals)

| Token            | Hex       | Use                                          |
| ---------------- | --------- | -------------------------------------------- |
| `--canvas`       | `#fdfbf6` | Default page background                      |
| `--canvas-warm`  | `#fef9f0` | Hero gradient top, subtle section accent     |
| `--surface`      | `#ffffff` | Cards, detail boxes, pricing tiles           |
| `--hairline`     | `#f0e6d0` | Default borders, dividers                    |
| `--hairline-strong` | `#ece1c8` | Stronger dividers (OG image, hover states)  |

### Ink (dark warm text)

| Token         | Hex       | Use                              |
| ------------- | --------- | -------------------------------- |
| `--ink`       | `#1c1106` | Headings, strong text, numbers   |
| `--ink-soft`  | `#78624a` | Body copy                        |
| `--ink-muted` | `#a08e70` | Captions, labels, metadata       |

### Brand (amber)

| Token            | Hex       | Use                                |
| ---------------- | --------- | ---------------------------------- |
| `--brand`        | `#d97706` | Primary CTA, theme-color meta      |
| `--brand-hover`  | `#b45309` | CTA hover, active links, accents   |

### Frameworks (four colors, one per framework — DO NOT swap)

| Framework   | Token               | Hex       | Icon intent |
| ----------- | ------------------- | --------- | ----------- |
| Strengths   | `--fw-strengths`    | `#f59e0b` | amber       |
| Personality | `--fw-personality`  | `#8b5cf6` | violet      |
| DISC        | `--fw-disc`         | `#ef4444` | coral       |
| Enneagram   | `--fw-enneagram`    | `#10b981` | emerald     |

## Logo — Four-Dot Mark

2x2 grid of circles, one per framework, in this order:

```
● ●   amber   violet
● ●   coral   emerald
```

Implementation in `src/components/LogoIcon.tsx`. Favicon at `public/favicon.svg` mirrors the same mark. Never use the purple lightning bolt — that was legacy Deep Space, which is retired.

## Type

- **Display** (headings, numbers, button text): `Plus Jakarta Sans` 800
- **Body** (paragraphs, labels, navigation): `Inter` 400/500/600
- Loaded from Google Fonts in `index.html`
- CSS vars: `--font-display`, `--font-body`

## Buttons

Primary (`.btn-start`): amber `--brand` background, white text, 12px radius, subtle shadow, hovers to `--brand-hover`.
Secondary (`.btn-start-secondary`): `--surface` background, `--ink` text, `--hairline-strong` border.

## Email signatures

Built by `email-signatures/build-signatures.mjs`. Four-dot logo (2x2 of 14px circles), amber accent line at top, Plus Jakarta Sans display, Inter-compatible body font. Tagline at bottom in `--ink-muted`.

## Legacy tokens (aliases — do not write new code against these)

These exist to avoid breaking references; new code should use the semantic tokens above:

- `--accent` → `var(--brand)` (note: previously mapped to strengths amber; this is the fix for the Leo regression)
- `--accent-dark` → `var(--brand-hover)`
- `--text` → `var(--ink-soft)`
- `--text-h` → `var(--ink)`
- `--bg` → `var(--canvas)`
- `--border` → `var(--hairline)`
- `--doing` / `--thinking` / `--feeling` / `--motivating` → framework tokens

## Retired

- Deep Space (dark navy `#1a1a2e` + purple `#7c3aed`) — gone
- `Outfit` font — replaced with Plus Jakarta Sans + Inter
- Purple lightning bolt (`⚡`, `M13 2L4.5 13.5...`) — replaced with four-dot mark
- Trust-bar emojis (✅🔒🎓) — replaced with middot-separated plain text
- Old DISC/Enneagram palette (`#e53e3e`, `#7c3aed` for enneagram, `#6366f1` for personality) — swapped to Compass framework colors

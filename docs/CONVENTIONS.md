# Codebase Conventions — Quick Reference

Read this before making changes. It documents what the codebase actually does today, not an aspirational target — some of it is inconsistent on purpose (see Color Palette).

## Tech stack

- Next.js 16.2.9 (App Router, Turbopack) — see the root [AGENTS.md](../AGENTS.md) note: this version has breaking changes vs. training data, check `node_modules/next/dist/docs/` before relying on memory.
- React 19.2.4, TypeScript, Tailwind CSS 4.
- No test runner and no CI config exist. Don't assume a `test` script — there isn't one.

## Directory map

```
app/
  components/    Reusable UI (PascalCase.tsx). Mostly "use client".
  hooks/         e.g. useInView.ts — scroll-triggered reveal detection.
  lib/           Domain logic, not UI:
    engine.ts           quiz answers -> recommendation scoring
    questions.ts         quiz question data
    optimizeContent.ts   per-topic content (used by /optimize/[slug])
    theme.ts              accentFor() hash-based accent picker + accent objects
    types.ts              shared TypeScript types
  optimize/[slug]/  dynamic per-topic pages, content driven by optimizeContent.ts
  <route>/page.tsx  static pages (about, faq, privacy, terms) colocate their own content inline
  globals.css       CSS custom properties + base styles
```

Flow: `Quiz.tsx` collects answers -> `lib/engine.ts` scores them -> `Results.tsx` renders the output.

## Color palette (as-is — not fully consolidated)

Canonical values live in `app/globals.css` as CSS variables, but most components reference raw hex directly in inline `style={{}}` rather than the variables or `theme.ts`. Changing a color today means grepping for the hex string across files — there is no single source of truth yet.

| Name | Hex | Defined in globals.css? | Typical use |
|---|---|---|---|
| Background (cream) | `#F5F3EC` | yes (`--background`) | page background |
| Surface | `#FFFFFF` | yes (`--surface`) | cards |
| Foreground | `#14130F` | yes (`--foreground`) | body text |
| Foreground muted | `#6B6558` | yes (`--foreground-muted`) | secondary text |
| Ink | `#111111` | yes (`--ink`) | headings, buttons |
| Blue (light) | `#CFE0F7` | yes (`--blue`) | accent background |
| Blue (deep) | `#4A6FA5` | yes (`--blue-deep`) | accent text — **only safe on white/cream backgrounds**, fails WCAG AA on `#CFE0F7` |
| Blue (deep, on-blue-bg) | `#2F5580` | **no** | contrast-safe alternative for text directly on `#CFE0F7` — introduced 2026-07-14, not yet in globals.css |
| Yellow | `#F4E14F` | yes (`--yellow`) | accent background |
| Yellow (deep) | `#8A6F0E` | yes (`--yellow-deep`) | accent text on yellow bg |
| Border | `rgba(17,17,17,0.08)` | yes (`--border`) | card/nav borders |
| Text on colored tiles | `#3A362E` | no | body text on featured (colored) cards |
| Muted footer/meta text | `#8A8172` | no | column headings, timestamps |
| Disabled button bg | `#DCD8CB` | no | disabled CTA state |

**Rule of thumb:** if you introduce `#4A6FA5` as text on a `#CFE0F7` background, use `#2F5580` instead — that pairing fails contrast (verified ~3.8:1 vs. the 4.5:1 AA minimum).

## Component patterns

- `PageCard.tsx` exports `Card` and `SectionHeading` — reused across About/FAQ/Privacy/Terms/optimize pages. Use these instead of ad hoc card markup on content pages.
- Scroll-reveal pattern: `.fade-in-up` class (CSS, `globals.css`) + `useInView` hook, wrapped in a local `FadeInSection` helper. **This helper is currently duplicated** independently in `HowItWorks.tsx` and `WhatYouCanOptimize.tsx` rather than shared — known, not yet consolidated.
- `.fade-in-up` respects `prefers-reduced-motion` and has a `<noscript>` fallback in `layout.tsx` so content isn't hidden without JS — preserve both if you touch this pattern.
- Headings use `fontFamily: "var(--font-heading)"` with `fontWeight: 700` or `800` via inline style, not a Tailwind font-weight class.

## Accessibility conventions

- Decorative emoji/icons get `aria-hidden="true"` (see `PageCard.tsx` `SectionHeading`, `Hero.tsx`, etc.) — the emoji is visual flavor, the adjacent text carries the meaning.
- Toggle-style selections (e.g. `Quiz.tsx` options) use `aria-pressed`, not native radio/checkbox inputs.
- Interactive elements get `focus-visible:ring-2` in their Tailwind classes.

## Naming conventions

- Components: PascalCase filenames (`Hero.tsx`), one default export per file.
- Lib/hooks: camelCase filenames (`useInView.ts`, `optimizeContent.ts`).
- Internal navigation should use `next/link`'s `Link`, not `<a>` — plain `<a>` causes full page reloads. Same-page hash anchors (e.g. `#newsletter`) are fine as plain `<a>` since no navigation occurs.

## External dependencies / known fragility

- Hero and content images are hotlinked from `images.unsplash.com` (see `next.config.ts` `remotePatterns`), not self-hosted. This is a known fragility, not an oversight — self-hosting would be the more robust fix if revisited.
- `next.config.ts` sets custom `images.deviceSizes` (added 2026-07-14) to avoid over-fetching oversized responsive images — don't remove without checking the srcset math against actual display width.

## Dev workflow

- `npm run dev` runs on port 3000 by default. `.claude/launch.json` wires this up for the browser preview tool.
- Check whether a dev server is already running on port 3000 before starting a new one — don't assume one you start is the only one, and don't kill an existing one without checking who owns it.

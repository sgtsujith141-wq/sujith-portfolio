# Design system

Theme: **Cyber Premium / Living Digital Architecture.** One graph behind everything;
restraint everywhere else. Source of truth for tokens is `app/globals.css`.

## Colour

| Token | Value | Use |
|---|---|---|
| `--color-void` | `#06070a` | Scrollbar track, deepest layer |
| `--color-base` | `#090b0f` | Page background |
| `--color-surface` | `#0e1116` | Panels (galleries, models, tables) — always opaque so the canvas never bleeds through content |
| `--color-raise` / `--color-elevate` | `#131720` / `#191e29` | Reserved steps for hover and nested surfaces |
| `--color-ink` | `#e8ecf2` | Primary text (≈ 15.6:1 on base) |
| `--color-muted` | `#a3adbf` | Body copy (≈ 8.5:1) |
| `--color-faint` | `#7d8799` | Labels and captions (≈ 5.1:1) |
| `--color-ghost` | `#464e5c` | Decorative only, never body text |
| `--color-line` / `-soft` / `-strong` | `#1c212b` / `#151a22` / `#2a3140` | Hairlines |
| `--color-accent` | `#4f7cff` | Electric blue: active states, project nodes, primary progress |
| `--color-signal` | `#3fd2f0` | Muted cyan: highlights, lit edges, packets, concept nodes |
| `--color-violet` | `#8b7cf6` | Depth: evidence nodes, Aether Health world, Grover-weakened class |
| `--color-warn` | `#f0b429` | Caveat labels ("Illustrative", "Seeded demo data", trade-offs) |
| `--color-ok` | `#4ade80` | CI success only |

Text colours were chosen so every combination used on `--color-base` and
`--color-surface` clears WCAG AA 4.5:1 for body sizes.

## Typography

| Role | Family | Settings |
|---|---|---|
| Display | **Archivo** (variable) | `wdth 108`, weight 500, tracking −0.025em, line-height 0.95. Used for the name, section titles, project titles and large figures. |
| Body | **Geist** | 15–18px, line-height 1.6–1.7, `ss01 cv01 cv11`. |
| Labels | **Geist Mono** | 10–11px uppercase, tracking 0.16–0.2em. Section indices, coordinates, verification dates, chips. |

All three fonts are SIL Open Font License and self-hosted through `next/font`
(no runtime request to Google). Attribution is printed in the footer.

Scale (fluid): name `clamp(3.6rem, 14.5vw, 11.5rem)`; section title
`clamp(2.2rem, 5.2vw, 4.4rem)`; project title `clamp(2.4rem, 6vw, 5rem)`;
Connect headline `clamp(2.6rem, 8.4vw, 7.6rem)`.

## Spacing and layout

- Container: `max-w-6xl` (72rem), gutters 24px on phones and 48px from `lg`.
- Sections: `py-28` on phones, `py-40` from `lg`; hero and Connect are viewport-height.
- Case study grid: 12 columns from `lg` — reading column 7, visual column 5 with a sticky top of 64px.
- Card grids use a 1px `--color-line-soft` gap on opaque `--color-base` cells; this is the "thin technical lines" motif.

## Lines, surfaces and glow

- Hairlines: 1px borders, or `.hairline` (0.5px inset shadow) on panels so they survive fractional device pixel ratios.
- Glow is permitted only on active nodes: a 1px ring plus a soft radial gradient at ≤ 22% alpha. Never on text.
- No glassmorphism beyond the two translucent bars (project tabs, mobile bar) that need to sit over scrolling content; blur is 6–12px.

## Motion

| Element | Behaviour |
|---|---|
| Opening | CSS-driven `[data-enter]` timeline: ignite 200ms → name letters from 700ms (55ms stagger) → statement 1300ms → actions 1800ms → navigation 1900ms → scroll cue 2300ms. Never blocks scrolling; replays every load; no storage. |
| Reveal | `Reveal` — 18px rise + fade over 0.9s with `[0.16, 1, 0.3, 1]`, once per element. |
| Pinned scene | One only: the Selected Work intro (`+=110%`, scrub 0.6). |
| Magnetic | ≤ 6px, fine pointers only. |
| Underlines | Background-size transition, 420ms. |
| Reduced motion | Global: durations to 0.001ms; the canvas draws a static frame per state change; the opening renders finished. |

## Background (canvas)

Node colours by kind: root ink, project accent, concept signal, tech muted,
evidence violet. Node radius `1.3 + weight × 2.1`. Edge alpha `base × (0.1 + heat × 0.32)`.
Label font `500 10px Geist Mono`. Labels only for nodes whose label alpha > 0.04,
never within 230px of the right edge on desktop (the rail), and never on
narrow screens inside a case study.

## Components

`Action` (primary / secondary / ghost) · `SectionHeader` · `StatusPill` (accent /
signal / warn / ok / muted) · `Reveal` · `SplitText` · `Magnetic` · `Gallery` ·
`SignalsModel` · `CryptoVisual` · `EvolutionTimeline` · `AetherShowcase` /
`AetherFacts` · `ArchitectureExplorer` · `DeepDive` · `NavRail` · `MobileNav`.

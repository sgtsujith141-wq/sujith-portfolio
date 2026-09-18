# Architecture

Next.js 16 (App Router) · React 19 · TypeScript 5.9 (strict, `noUncheckedIndexedAccess`) ·
Tailwind CSS 4 · Motion for React 13 · GSAP 3.15 + ScrollTrigger · Canvas 2D.
Single static page, no backend, no runtime data fetching.

```
app/                       route, layout, metadata, social image, sitemap, robots
content/                   every fact on the site — typed, with sources
  profile.ts               identity, contact, resume switch, metadata
  navigation.ts            the six sections; feeds rail, mobile nav, scroll-spy, engine
  projects/*.ts            four case studies (problem, solution, steps, architecture,
                           evidence, verification log, decisions, limitations, screenshots)
  evidence.ts              dated snapshots and the CI matrix
  graph.ts                 the semantic graph the background renders
  about.ts · exploration.ts
components/
  canvas/                  LivingSystem provider + engine/ (formations, engine)
  scenes/                  hero, work, evidence, about, exploration, connect
  projects/                case-study frame and the per-project visuals
  layout/                  nav rail, mobile nav, skip link, footer
  ui/ · animations/        primitives
hooks/ · lib/              media queries, reduced motion, active section, gsap registration
public/projects/<slug>/    real screenshots copied from the repositories
```

## Data flow

`content/` → server components render all copy statically. Client components are
limited to what needs the browser: the canvas provider, the hero choreography, the
Work scene (pin), galleries and models with local state, the navigation.

## The Living System

```
scroll ──► LivingSystem provider ──► engine.setSection(id, progress)
                 │                    engine.setStage(rect of [data-stage])
Work scene ──────┼──► engine.setFocus(slug)      (article under the viewport midline)
 (pin) ──────────┼──► engine.setPhase(p)         (ScrollTrigger progress, 0–1)
pointer ─────────┴──► engine.setPointer(x, y)
```

`formations.ts` is pure: `(viewport, input) → targets`. Each section has a
formation; Work has two (reorganisation while pinned; a focused world while a case
study is read). The engine springs every node toward its target, so any transition
is reversible by scrolling back. The focused world is placed inside a DOM-measured
"system window" at the top of the case study's sticky column when one exists, and
in the empty right column otherwise (the MVP case study).

Cost controls: DPR ≤ 2 (1.5 on touch); ambient count from viewport area, halved
on touch; squared-distance early-out on lattice links; loop paused when hidden;
one static frame per state change under `prefers-reduced-motion`; the engine is
imported on idle after hydration and the page renders without it.

## Scroll storytelling

- Hero: Motion `useScroll` parallax (translate + fade) on the content block.
- Selected Work: the only pinned scene. GSAP pins the header for `+=110%`, scrubs
  the four world cards in, and reports progress to the engine.
- Everything else: `Reveal` (whileInView) and per-component whileInView draws (SVG
  path lengths, bars). Native scrolling throughout; anchors, back navigation and
  keyboard work because navigation is plain `<a href="#id">`.

## Accessibility

Semantic landmarks (`main`, two `nav`, `footer`), one `h1`, headings in order,
skip link, visible focus rings (`:focus-visible` 2px signal), every image has alt
text, every icon button has a name, the mobile menu is a dialog with focus
management and Escape, the architecture explorer's components are real buttons
with `aria-describedby`, galleries expose keyboard navigation and live position,
and all decorative canvas content is `aria-hidden`.

## Build and quality gates

`npm run check` = ESLint (next/core-web-vitals + typescript, react-hooks rules
including refs and set-state-in-effect) → `tsc --noEmit` → `next build`.

# Architecture

Next.js 16 (App Router) · React 19 · TypeScript 5.9 (strict, `noUncheckedIndexedAccess`) ·
Tailwind CSS 4 · Motion for React 13 · GSAP 3.15 + ScrollTrigger · Canvas 2D.
Static, no backend, no runtime data fetching. Thirteen prerendered routes:
the home page, `/work`, a page per project, and the metadata routes.

```
app/
  layout.tsx               mounts the canvas ABOVE the router, so the field is
                           continuous across routes; skip link, footer, metadata
  page.tsx                 home — seven sections about Sujith
  work/page.tsx            the work index plus engineering evidence
  work/[slug]/page.tsx     one case study per project (generateStaticParams)
content/                   every fact on the site — typed, with sources
  profile.ts               identity, contact, resume switch, metadata
  identity.ts              domains, skills, principles — the personal model
  homelab.ts               the lab: services, topology, honesty constraints
  navigation.ts            the seven home sections; feeds rail, mobile nav,
                           scroll-spy and the background engine
  projects/*.ts            five case studies, home lab included
  evidence.ts              dated snapshots and the CI matrix
  graph.ts                 the semantic graph the background renders, derived
                           from identity.ts, homelab.ts and the projects
  exploration.ts
components/
  canvas/                  LivingSystem provider + engine/ (formations, engine)
  home/                    the seven home sections + the personal network
  homelab/                 the interactive topology (shared: home page + case study)
  work/                    work header, index, case-study view, evidence
  projects/                case-study frame and the per-project visuals
  layout/                  nav rail, mobile nav, skip link, footer
  ui/ · animations/        primitives
hooks/ · lib/              media queries, reduced motion, active section, gsap
public/projects/<slug>/    real screenshots copied from the repositories
```

## Identity model

Three ideas are kept apart on purpose, because conflating them is how a portfolio
ends up presenting a test runner as a personality trait:

| Concept | Lives in | Appears |
|---|---|---|
| Domains — what he explores | `content/identity.ts` | hero rail, personal network, background |
| Skills — what he has used, with a level | `content/identity.ts` | About |
| Project stack — what a repository imports | `content/projects/*.ts` | that case study only |

## Data flow

`content/` → server components render all copy statically. Client components are
limited to what needs the browser: the canvas provider, the hero choreography, the
Work scene (pin), galleries and models with local state, the navigation.

## The Living System

```
scroll ──────────► LivingSystem provider ──► engine.setSection(name, progress)
route ───────────┤                           engine.setStage(measured rect)
personal network ┼──► engine.setDomain(id)   (the signature selection)
case study ──────┼──► engine.setFocus(slug)
pinned scene ────┼──► engine.setPhase(p)
pointer ─────────┴──► engine.setPointer(x, y)

                 └──► engine.readLight() ──► the composited light layer
```

On `/work*` the provider holds the `work-route` formation and derives progress from
document scroll; on the home page it measures the seven sections and reports whichever
holds the viewport midline. Because the provider lives in the root layout, navigating
between the two changes the formation without restarting the field.

**The light field is not canvas pixels.** Filling the viewport with radial gradients
cost roughly ten million pixel writes per frame. It is now one composited DOM layer
moved by transform and tinted from a CSS custom property that the engine publishes, so
the main thread paints nothing for it.

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

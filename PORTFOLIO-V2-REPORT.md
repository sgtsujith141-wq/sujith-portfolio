# Portfolio v2 — creative redirection

**Date:** 2026-09-19 · **Branch:** `feat/immersive-portfolio-v2` ·
**Repository:** https://github.com/sgtsujith141-wq/sujith-portfolio

The site used to say "here are my projects." It now says "come explore my world."
Nothing was rebuilt from scratch: every case study, screenshot, verification log,
architecture diagram and engineering-evidence figure carried over, and the Git
history is intact.

## 1. What changed

### Information architecture

The home page is about Sujith. Projects became a layer you enter.

| Before | After |
|---|---|
| One page: 01 Introduction, 02 Selected Work, 03 Engineering Evidence, 04 About, 05 Current Exploration, 06 Connect | **Home** (`/`): 01 Introduction · 02 Who I Am · 03 Technical World · 04 Home Lab · 05 Exploring · 06 Work (teaser) · 07 Connect |
| Four case studies stacked on the home page, dominating it | **Work** (`/work`): an index of all five, plus engineering evidence and the architecture explorer |
| No per-project page | **Case study** (`/work/<slug>`): one project, full depth, prev/next |
| Four projects | **Five** — the home lab joins them |
| Canvas mounted in the page | Canvas mounted in the **root layout**, so it never resets when you move between home and Work |

Thirteen routes are prerendered, including a static page per project.

### Identity

The headline was about a repository's subject. It is now about him:

> Exploring networks, securing systems, building things that **matter**.

`content/identity.ts` separates three things the old site conflated:

- **Domains** — the seven things he genuinely explores: networking, cybersecurity,
  computer systems, Linux, servers and self-hosting, AI used carefully, and building
  useful software.
- **Skills** — what he has actually worked with, each with an honest level
  ("Hands on, daily", "Practical, still building depth", "Fundamentals").
- **Project stacks** — the frameworks a particular repository imports. These live in
  `content/projects/*.ts` and appear only inside that case study.

Vitest, Vite and Capacitor are gone from his personal skills. A note under the skills
grid says explicitly where they do belong. Cryptography is presented as the subject of
a project he built, never as his personal passion.

### The home lab

Added as first-class content (`content/homelab.ts`), as a home-page section, and as
project 01 in Work. Seven pieces: the home network, a Tailscale mesh, Debian 12,
CasaOS, Jellyfin, file storage and a Minecraft server — each with what it is, why it
is there, what he configured, what running it taught him, and which domains it
demonstrates.

**Honesty constraints, enforced in the content layer.** No uptime, no hardware
specifications, no bandwidth, no CPU or memory figures, no addresses, no hostnames, no
firewall rules, and no claim that any of it is secure. The diagram carries a permanent
"Illustrative — no live metrics" label. The limitations list says plainly that there is
one node, no monitoring, no alerting and no backup strategy worth the name yet.

## 2. New interactions

| Interaction | What it does |
|---|---|
| **The personal network** (signature) | Sujith at the centre, seven domains in orbit. Choosing one opens what it means to him, the real evidence behind it, and links straight through to the home-lab services and case studies it connects to. The page-wide field selects the same domain. |
| **Home lab topology** | Every node is a button. Hovering explains it, selecting opens what he configured and what it taught him, and the surrounding stack settles: the path from the edge down to the selection brightens, everything else recedes. |
| **Pinned assembly** | The site's one pinned scene. The diagram holds for a short scroll while the stack assembles layer by layer, narrating each as it arrives, then releases and becomes fully interactive. |
| **Work index** | Five full-width rows. Pointing at one lights its module in the field and cross-fades a real screenshot into the panel beside it. The home lab has none, so it shows its stack rather than a staged image. |
| **Architecture explorer** | Carried over and now reachable from every case study. Components are keyboard-focusable buttons; amber dots mark gaps the README itself documents. |
| **Tilt** | A 3° perspective shift with a sheen tracking the pointer, on the work teaser cards. Fine pointers only. |
| **Case-study navigation** | Prev/next across the five, plus a persistent project switcher in the Work header. |

Every one of these is keyboard-operable. The personal network is a tablist with roving
tabindex, arrow keys, Home and End. The topology's arrow keys walk up and down the
stack and sideways between siblings. Both panels state in words everything the picture
encodes.

## 3. Background implementation

One `<canvas>` in the root layout, plus one composited DOM layer for light.

**The graph is the content.** `content/graph.ts` builds 43 nodes and 62 edges from the
same data the page renders: Sujith, his seven domains, five projects, seven home-lab
services, the technologies each project actually uses, and the evidence behind them.
Edges are real relationships, derived — a domain links to a project only if that domain
lists it.

**A formation per section**, all pure functions of `(viewport, section, progress,
focus, domain, stage)`:

| Section | Formation |
|---|---|
| Introduction | Domains in a wide orbit around him; projects further out and dimmer |
| Who I Am | The same nodes reorganised into a structured spine |
| Technical World | Him at the centre, domains in a ring; the selected domain draws its subgraph in |
| Home Lab | The field becomes the lab's topology and edges reroute into orthogonal pathways |
| Exploring | Loose groups drifting |
| Work | Domains recede, project modules rise |
| Connect | Everything converges to one point |
| `/work` | Five project worlds in a slow ring; a case study pulls its own constellation into a measured window |

Because each is a function of scroll progress, every transition reverses exactly when
you scroll back. Nothing resets between sections.

**Depth, signals, pulses.** Every node carries a `z` from 0.15 to 1 that scales its
parallax offset, its radius and how far it sinks into the haze. Signals flow along lit
edges with four-dot fading trails. Wavefront pulses travel outward from the root through
breadth-first graph depth, lighting each ring as they pass — fired on section change,
on domain selection, and on a slow timer.

**Honesty.** The signals are a visual metaphor. The footer says so: "The background is
a visualisation of this content, not live system activity."

**Cost control.** Device pixel ratio capped at 2 (1.5 on touch); ambient node count
from viewport area, halved on touch and again on a low-power device; squared-distance
early-out on lattice links; the loop stops when the tab is hidden; the engine loads on
idle after hydration and the site works without it; reduced motion draws a single static
frame per state change.

## 4. Animation implementation

Reusable primitives in `components/animations/`:

- **Reveal** — rise and fade on enter; can render as `<li>` so lists stay valid.
- **MaskLine** — a line rising from behind a mask. The in-view trigger lives on the
  mask and drives the child through variants, because an IntersectionObserver accounts
  for ancestor clipping and a child parked below its own mask would never trigger itself.
- **Wipe** — a clip-path uncover.
- **Parallax / Recede** — scroll-linked drift and depth.
- **DrawPath** — SVG paths that draw on enter.
- **Magnetic** — capped at 6px.
- **Tilt** — capped at 3°.

Plus: the CSS-driven opening choreography, GSAP ScrollTrigger for the one pinned scene,
`edge-traffic` dashes walking SVG edges, and the canvas camera.

Scrolling is never hijacked. The single pin lasts 90% of a viewport, is desktop-only,
and is skipped entirely under reduced motion.

## 5. Before and after structure

```
BEFORE                              AFTER
/                                   /                     home, about Sujith
  01 Introduction                     01 Introduction
  02 Selected Work  ← 4 case studies  02 Who I Am
  03 Engineering Evidence             03 Technical World  ← signature network
  04 About                            04 Home Lab         ← new, pinned assembly
  05 Current Exploration              05 Exploring
  06 Connect                          06 Work             ← teaser, 3 of 5
                                      07 Connect
                                    /work                 index of 5 + evidence
                                    /work/home-lab        ← new case study
                                    /work/cryptodrishti
                                    /work/surakshascore
                                    /work/surakshascore-mvp
                                    /work/aether-health
```

## 6. Test results

All against the production build.

**Build gates:** ESLint clean, `tsc --noEmit` clean (strict, `noUncheckedIndexedAccess`),
`next build` clean, 13 routes prerendered.

**Every route at desktop and mobile** (`/`, `/work`, and all five case studies), each
scrolled top to bottom:

| Check | Result |
|---|---|
| Console errors and warnings | none, on any route, at either width |
| Horizontal overflow | none — 14 route/width combinations |
| Links | 16 unique destinations, all resolve; anchors, internal routes, GitHub, LinkedIn, resume |
| Images | none broken, all have alt text |
| Landmarks | `main` and `footer` on every route; exactly one `h1` |
| Heading order | no skipped levels on any route |
| Buttons and links without an accessible name | zero |

**Keyboard:** the personal network's arrow keys move selection and update the panel;
the topology's arrow keys walk the stack; the mobile menu is a focus-managed dialog
that Escape closes and restores scroll.

**Reduced motion:** the entrance renders finished, no pin spacer is created, the
headline is at full opacity immediately, and the lab stack starts complete.

**Performance**, measured with Playwright at 2x device pixel ratio on desktop and a
3x-DPR phone profile under 4x CPU throttling:

| Metric | Desktop | 4x-throttled phone |
|---|---|---|
| First Contentful Paint | 208 ms | 512 ms |
| Largest Contentful Paint | 2.7 s | 3.0 s |
| Cumulative Layout Shift | 0 | 0 |
| Frame rate — hero | 60–61 fps | 51–54 fps |
| Frame rate — technical world | 60 fps | 51 fps |
| Frame rate — home lab | 60–61 fps | 39–40 fps |
| Transfer, first view | JS 295 KB · fonts 140 KB · CSS 10 KB · total 451 KB | same |

Three performance defects were found and fixed during this pass, all in the commit
"Restore 60fps": a `getComputedStyle` call per frame that forced a synchronous style
recalc and held desktop at 14 fps; a full-viewport light field drawn into the canvas;
and a blur, then a scale, on the hero's scroll animation that forced it to re-rasterise
every frame.

## 7. Accessibility findings

Passes every check above. Contrast is unchanged from v1: `ink` ≈ 15.6:1, `muted` ≈
8.5:1, `faint` ≈ 5.1:1 on the base. Focus rings are 2px cyan on every interactive
element. The canvas and the light layer are `aria-hidden`; everything they show is also
in the DOM.

Two things worth naming:

- The topology's SVG edges are visual only. Which node connects to which is stated in
  the detail panel, which is the accessible equivalent.
- Below the desktop breakpoint the spatial diagram is replaced by a vertical chain with
  the same buttons, state and panel, because the labels were unreadable at phone scale.

## 8. Git commits

On `feat/immersive-portfolio-v2`, no history rewritten, no force-push:

1. `d91307d` Rebuild the portfolio around Sujith, with Work as its own layer
2. `c860465` Add the cinematic layer: a pinned assembly scene, depth and mobile scaling
3. `90e9397` Restore 60fps, fix heading order and dead anchors
4. Documentation, screenshots and this report

The first commit is large because the restructure is atomic: the home page, the Work
routes, the section registry and the background formations all reference each other, and
splitting them would produce commits that do not build. Every commit after it builds and
passes the gates on its own.

## 9. Deployment status

See the end of this file — filled in only after the deployment was observed to succeed.

## 10. Remaining limitations

- The home lab's facts are stated by its operator, not measured. That is the honest
  ceiling: verifying them would mean reaching into a private network, which the site
  deliberately does not describe.
- Largest Contentful Paint sits around 2.7 s because the headline is the largest element
  and finishes painting at the end of its entrance. Reduced-motion visitors paint
  immediately. Shortening it is a one-line change to the delays in
  `components/home/hero.tsx`.
- The 4x-throttled phone profile drops to about 39 fps in the home-lab section, where the
  pinned scene, the SVG topology and the canvas run together. Real phones are not
  throttled 4x, but this is the heaviest moment on the site.
- The architecture explorer still needs horizontal scrolling below 720px.
- There is no automated test suite for the site itself. Verification is the Playwright
  scripts described above, kept outside the repository.
- Both the desktop diagram and the mobile chain of the topology exist in the DOM at once,
  with the inactive one display-hidden. It is out of the accessibility tree, but it is
  duplicated markup.

## 11. What I still need from you

- **Home lab details.** If you want hardware, capacity or service counts stated, tell me
  the figures. I will not estimate them.
- **Site URL** — set `NEXT_PUBLIC_SITE_URL` if you attach a custom domain.
- **Phone** — hidden by default; set `NEXT_PUBLIC_CONTACT_PHONE` to show it.
- **Phantom HQ** — still excluded until its status and scope are verified.
- **`lowtide`** — a fifth public repository that was not in either brief, so it is not
  on the site. Say the word and it becomes project 06.

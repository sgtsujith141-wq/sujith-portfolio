# Portfolio 3.0 — cinematic redesign

**Date:** 2026-09-21 · **Branch:** `feat/portfolio-cinematic-redesign` ·
**Not deployed.** Pull request open for review.

The audit that preceded this is `DESIGN-AUDIT.md`, written before any code changed and
based on measuring the running build at three viewport sizes. Screenshots of the old
design are in `docs/audit/`, of the new one in `docs/v3/`.

---

## 1. Where this branch is cut from

The brief said to branch from production `main`. At the time I started, three of the files
it listed for audit — `content/personal.ts`, `lib/motion.ts` and
`components/intro/intro-sequence.tsx` — did not exist on `main`. They were only on
`fix/personal-portfolio-experience`, the then-open PR #2, along with the recovered startup
animation. Branching from `main` would have deleted the animation the brief calls
non-negotiable, so I cut this branch from that PR instead and flagged it.

**That has resolved itself.** PR #2 was merged into `main` while this work was in
progress. The commit this branch is based on (`c73e251`) is now an ancestor of `main`, the
only commit `main` carries that this branch does not is the merge commit itself, and the
merge back is clean. Nothing needs rebasing.

(One naming note stands: the brief names `content/projects.ts`. The real path is the
directory `content/projects/`, one file per project.)

## 2. The startup animation is untouched

Verified, not assumed. Three consecutive refreshes:

```
refresh 1: intro=pending overlay=true
refresh 2: intro=pending overlay=true
refresh 3: intro=pending overlay=true
startup errors: none
```

The pulse, cipher glyphs, scan sweep, glitch beat, corner brackets, skip control, the
choreography and its timings, and the morph onto the hero heading are all as they were.
Frames captured in `docs/v3/01-startup-pulse.jpg` through `04-startup-handoff.jpg`.

The only change is that the hero it morphs into was recomposed (below), so the name has a
better-composed place to land.

---

## 3. What the audit found, and what happened to it

| Finding | Evidence then | Now |
|---|---|---|
| Work page was half a metrics wall | evidence block 2135px of a 4285px document | No evidence block on the landing page. Document is 3419px. It moved inside the case studies |
| No hierarchy between projects | six identical rows | Two featured projects with full compositions; four in a considered list |
| Preview showed blank states | rapid hover gave the idle state 3× then a stale project | **0 near-blank frames** across 12 rapid samples; minimum panel opacity 0.48, i.e. always mid-crossfade, never empty |
| Hover required to learn anything | idle panel said "Point at a project" | Every row states what the project is. The preview is decoration, not the information |
| Homepage was one layout six times | every section: eyebrow, heading, lede, card grid | Each section composed differently — see §5 |
| Background was a diagram | five monospace labels across the hero | **Zero labels on the canvas.** It draws structure and light only |
| Motion was monotonous | everything entered with the same 18px rise | Page-level parallax, masked display lines, image drift inside fixed frames, crossfades, staggered phone lifts |

---

## 4. The background

Two layers now, and the split is the point: **atmosphere in the DOM, structure on the
canvas.**

- **Atmosphere** — three large soft pools of light on their own slow orbits, a pointer
  light that trails rather than snaps, and a fine grain to stop the gradients banding on
  8-bit panels. All composited; only transform changes.
- **Currents** — long slow bezier paths at far depth with light travelling along them.
  This is the layer the audit found missing between the nodes and the background.
- **Depth** — parallax now spreads 64px across the z range rather than 34, and radius and
  alpha spread further with it, so the layers read as distance.
- **No labels.** The page does the naming.

### The performance problem I caused and then fixed

The first version of the atmosphere dropped the site to 24fps. I isolated layers rather
than guessing:

| Configuration | Frame rate |
|---|---|
| everything on | 24 fps |
| grain off | 34 fps |
| pools off | **60 fps** |
| whole atmosphere off | 60 fps |
| canvas off | 27 fps ← the canvas was never the problem |

Two causes: the pools were ~1800px gradient layers being `scale()`d every frame, which
re-rasterises them; and the grain's `mix-blend-mode` forced the whole stacking context to
recomposite whenever they moved. Pools are now smaller, translate-only and contained; the
grain uses plain opacity. **Back to 60fps with everything running.**

I also found that an earlier edit of mine had deleted the light layer's CSS entirely — its
element had been sitting in the DOM with nothing to draw. Fixed here.

---

## 5. The homepage

Same six scenes, composed differently:

- **Arrival** — one left-aligned column. The audit found the old action block wrapping
  into two ragged rows aligned with nothing, and the interests rail orphaning its last
  item; actions are now one inline row and the interests sit on the floor of the screen,
  drifting slower than the column above them.
- **Who I am** — opens on a large lead line, then body copy, then the AI-assisted
  disclosure. Skills are a specification list, not three bordered cards.
- **The things I enjoy** — a menu of seven at display size. Pointing at one brings up its
  sentence and lights that part of the field. Keyboard-operable; verified.
- **My world** — the operating systems as one shelf of names at display size rather than
  seven identical cards, then the animated server with its four services.
- **Highlights and current work** — Phantom HQ as a composed panel with a drifting band of
  light behind it; the highlights as dated entries across a rule.
- **Selected work** — three previews, then out to `/work`.
- **Contact** — each contact as a large line of type with its handle opposite, over the
  field folding to a point. The audit measured this section at 0.25 text density; it is
  now composed rather than sparse.

---

## 6. The Work page

**Featured work** — CryptoDrishti and SurakshaScore, each a full composition, and
deliberately not the same one twice. CryptoDrishti is a desktop console, so its screenshot
runs wide beneath the text and drifts inside a fixed frame. SurakshaScore is a phone app,
so three screens stand beside the text on their own parallax offsets.

**Other work & experiments** — Home Lab, Aether Health, SurakshaScore MVP (marked as the
earlier version of SurakshaScore, not an unrelated product) and Phantom HQ (ongoing, no
link, because the repository is private).

**The preview, rebuilt against the three causes the audit found:**

1. `AnimatePresence mode="wait"` serialised exit before enter, so moving faster than the
   exit showed the idle state through the gap. Every panel is now mounted at once and only
   opacity animates, with `initial={false}` — Motion re-targets a running animation rather
   than restarting it, so interruption is free and there is no exit queue.
2. `onMouseLeave` reset to `null`, adding a third state to churn through. Leaving keeps the
   last project. The panel is never empty; it opens on the first.
3. Nothing was preloaded. Mounting them all means every image is fetched up front.

**Case studies** now share one order on all six: Overview → Screenshots → What it does →
Technical details → Status → Source. Verified route by route. Every verified figure, the
verification log with its dates and methods, the architecture explorer, the decisions and
the limitations all survive — they moved to where someone reading about one project would
look for them.

---

## 7. Test results

Production build. Eight routes at 1440×900 and 390×844, each scrolled end to end.

| Check | Result |
|---|---|
| Console errors and warnings | **none**, any route, either width |
| Horizontal overflow | **none** — 16 route/width combinations |
| Links | 16 destinations, all resolve |
| Images | none broken, all have alt text |
| Headings | one `h1` per route, no skipped levels |
| Controls without an accessible name | zero |
| Startup on refresh | replays on all three; no errors |
| Rapid hover, 3 passes at 40ms | **0 near-blank frames**, min opacity 0.48 |
| 4 back-and-forth page transitions | list intact, canvas alive, no errors |
| Title clipping, 5 widths (390–1920) | none |
| Keyboard | interests menu, server spokes, topology, mobile dialog |
| Reduced motion | startup skipped, hero at full opacity, no pin |
| Typecheck · lint · build | clean; 14 routes prerendered |

**Scroll smoothness**, measured as frame intervals during a scripted scroll of the whole
page:

| | Median | 95th percentile | Worst |
|---|---|---|---|
| Slow scroll | 18.0 ms | 22.0 ms | 37.1 ms |
| Fast scroll | 18.3 ms | 24.2 ms | 24.2 ms |

**Web vitals and frame rate** at 2× DPR desktop and a 3×-DPR phone under 4× CPU throttling:

| Metric | Desktop | Throttled phone |
|---|---|---|
| First Contentful Paint | 116 ms | 240 ms |
| Cumulative Layout Shift | 0.006 | 0.013 |
| Frame rate — hero | 56–60 fps | 60 fps |
| Frame rate — machines | 61 fps | 60 fps |
| Transfer, first view | JS 249 KB · fonts 140 KB · CSS 11 KB · total 419 KB | same |

---

## 8. Screenshots

`docs/v3/` — startup sequence (4 frames), homepage hero, about, machines, home lab, now,
work teaser, contact, work landing (intro, both featured, other work), a project page and
its screenshots section, four mobile views, and reduced motion. `docs/audit/` holds the
before.

---

## 9. Commits

On `feat/portfolio-cinematic-redesign`, no history rewritten, no force-push:

1. `e97e369` — Audit the current design before redesigning it
2. `45aef3a` — Replace the background diagram with an atmosphere, and recompose the hero
3. `4e761fe` — Rebuild the Work page with two levels and a preview that does not break
4. `c528233` — Give every case study one consistent order
5. `bcf5067` — Recompose the homepage sections as editorial, not card grids
6. *(this commit)* — Fix the clipped featured title, screenshots and this report

---

## 10. Deployment

**Not deployed to production, by instruction.** The branch is pushed and a pull request is
open. On this repository a push to `main` deploys to production through the Vercel GitHub
integration, so merging is what would publish it. Vercel builds a preview for the pull
request; its URL sits behind deployment protection and returns a login page to an
unauthenticated client, so I can report the build status but cannot browse it. Everything
above was measured against a local production build of the identical commit.

---

## 11. Remaining limitations

- **Largest paint on the homepage is ~4.4 s**, unchanged, because the name is the largest
  element and is not painted until the startup sequence hands off at ~3.5 s. That is the
  cost of the animation you asked to keep. Reduced-motion visitors paint immediately. The
  timings are five numbers at the top of `components/intro/intro-sequence.tsx`.
- **The page is hidden while the sequence runs** — `#site` is at opacity 0 for those
  seconds. That is how the original behaved.
- **The worst slow-scroll frame is 37 ms**, one hitch where several reveals fire at once.
  Median is 18 ms. I have not chased it further because it is not visible.
- **Three of the four "other work" previews have no screenshot** — the home lab, the MVP
  and Phantom HQ have none that exist, and staging one is not an option. Those panels are
  composed from what is true about each instead.
- **The terminal-style labels in the startup sequence** (SECURE SESSION, IDENTITY
  VERIFIED, ACCESS GRANTED) are still there. They are original to the animation you asked
  to preserve, and they sit awkwardly against "no fake terminal" in this brief. I left
  them rather than change the animation. Say the word and I will soften them without
  touching the choreography.
- **I have not seen the site on your hardware.** Everything here is Chromium via
  Playwright on this machine, including the throttled-phone profile, which is an emulation
  and not a phone.

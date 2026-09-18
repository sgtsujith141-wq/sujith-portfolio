# Final report — Sujith C, The Living Portfolio

**Date:** 2026-09-19 · **Repository:** https://github.com/sgtsujith141-wq/sujith-portfolio ·
**Production:** https://sujith-portfolio-two.vercel.app

## 1. What was built

A single-page interactive engineering portfolio in which one semantic graph — Sujith,
the four repositories, their technologies, concepts and evidence — lives behind the
whole site on a single canvas and reorganises as the visitor scrolls. Six sections:

| # | Section | What it contains |
|---|---|---|
| 01 | Introduction | The opening choreography: the system ignites, the name resolves letter by letter, statement, actions (Explore work, GitHub, LinkedIn, Resume), scroll cue, real graph counts in the corner |
| 02 | Selected Work | One pinned scene where four project worlds surface, then four case studies with their own visual personalities |
| 03 | Engineering Evidence | Eight dated, method-labelled snapshots; the CI matrix as configured in each repository; an explorable architecture per project |
| 04 | About | Five short first-person blocks, education card, two hackathon facts, an "actually used" list |
| 05 | Current Exploration | Five threads, each marked active or planned |
| 06 | Connect | "Let's build something useful." with GitHub, LinkedIn, email and resume |

Stack: Next.js 16.3 · React 19.3 · TypeScript 5.9 · Tailwind CSS 4.3 · Motion for React 13 ·
GSAP 3.15 + ScrollTrigger · Canvas 2D. No backend, no runtime data fetching, no analytics.
Lenis was not added: native scrolling plus scrubbed ScrollTrigger and Motion in-view
reveals achieved the feel without taking scroll control away from the visitor.

## 2. Major design decisions

- **The hero is the opening.** No overlay, no loading screen. A pre-paint gate script hides
  the hero's elements, releases them on its own 260ms timer (so the entrance starts even
  before hydration on a slow device), and CSS delays stagger them in. It replays on every
  page load, consults no storage, never blocks scrolling, and renders finished under
  `prefers-reduced-motion`.
- **One canvas, formations per section.** Layout is a pure function of viewport, section,
  progress, focused project and a DOM-measured "system window"; the engine only springs
  nodes toward targets. Every transition is reversible by scrolling back.
- **The focused project's world fills a measured window.** Each case study's sticky visual
  column starts with an empty 176px area. The provider measures that rectangle every scroll
  frame and the engine places the project node and its satellites exactly inside it, so the
  graph is part of the case study instead of noise behind it. Case studies without a side
  column (the MVP) put their world in the empty right column.
- **Content is typed and sourced.** `content/` holds every fact; each project carries a
  verification log (claim, source, date, method) that is rendered in its deep dive.
- **Restraint.** Panels are opaque; labelled nodes are kept out of the hero's text boxes,
  230px clear of the navigation rail, and off narrow screens inside case studies. Glow is
  reserved for lit nodes. No custom cursor, no particles, no terminal.
- **Typography.** Archivo (variable, width axis set to 108) for display, Geist for body,
  Geist Mono for labels — all SIL OFL, self-hosted through `next/font`.

## 3. Interactive features

- Living System background with pointer proximity, depth parallax and signals along lit edges.
- Vertical navigation rail with active-section label, progress line and coordinates; mobile top bar with a focus-managed dialog.
- Pinned Selected Work intro whose progress drives the graph's reorganisation.
- Case-study tabs that follow the article under the viewport midline and drive the background focus.
- CryptoDrishti: an SVG scan-shape diagram that draws on scroll (labelled *illustrative*), the real 52-entry registry composition bar, the documented paramiko figures, and a nine-image keyboard-navigable gallery.
- SurakshaScore: an interactive scoring model built from the repository's evidence tiers, category weights and critical-finding ceiling; six real screens over demo data.
- SurakshaScore MVP: a four-stage evolution timeline and the README's comparison table.
- Aether Health: a parallax product showcase marked *seeded demo data* and a "what is actually there" panel.
- Architecture explorer: components as keyboard-focusable buttons with descriptions, connected-edge highlighting and pinning.
- Magnetic actions (≤ 6px, fine pointers), animated underlines, reveal choreography, expandable decisions and deep dives.

## 4. Real project data used

All from the four public repositories at the commits below, read on 2026-09-18 from local
clones confirmed equal to `origin/main`. Full mapping in `CONTENT-SOURCES.md`.

| Repository | Commit | Used |
|---|---|---|
| cryptodrishti | 90f4da3 | README case study, 6 sensors, 52-algorithm registry, 226 tests, CI matrix, paramiko scan figures, 9 screenshots |
| surakshascore | 34c70cc | README, 17 rules, 53 findings, weights and 79 ceiling from `scoringConfig.ts`, evidence tiers, isolation test, 107 tests, 6 screenshots |
| surakshascore-mvp | cc132f1 | README, `cryptoVault.ts` (PBKDF2 100k + AES-GCM), `hibp.ts`, `AIAnalyzer.ts` stub, lint/typecheck status |
| aether-health | 65533a3 | README, 22 routes, 34 screen components, the two AI routes, build status, 4 screenshots |

Not claimed anywhere: an internship, certifications, Phantom HQ, AI features of Aether
Health (not exercised), encryption in SurakshaScore or Aether Health, medical accuracy,
live metrics of any kind.

## 5. Tests performed

**Repository verification (2026-09-18):** CryptoDrishti `pytest` → 226 passed in 1.51s;
SurakshaScore `vitest run` → 21 files, 107 passed in 2.50s; rule/finding/route/screen
counts by grep and directory listing; latest CI conclusions for all four repositories read
through the GitHub API → success.

**Build gates:** `eslint .` clean (next/core-web-vitals + typescript, React hooks rules),
`tsc --noEmit` clean (strict, `noUncheckedIndexedAccess`), `next build` clean, 7 static routes.

**Browser QA (Playwright, Chromium 1243)** at 1440×900, 834×1112 (touch), 390×844 (touch) and
1440×900 with reduced motion, against the local production build and again against the
live production URL:

| Check | Result |
|---|---|
| Console errors / warnings / page errors | none, in every profile, local and production |
| Horizontal overflow | none at any width |
| Links | 19 unique hrefs: all anchors resolve, resume and internal routes 200, GitHub and LinkedIn reachable |
| Images | no broken images, every image has alt text |
| Semantics | one `h1`, `main`, two `nav`, `footer`, `lang="en"`, skip link first in tab order |
| Keyboard | rail, tabs, gallery (←/→/Home/End), scoring model radios, explorer buttons (focus shows description, Enter pins), details toggles, hash links and browser back |
| Mobile menu | dialog opens with focus on Close, body scroll locked, Escape closes and restores, in-dialog links navigate and close |
| Reduced motion | hero rendered at full opacity immediately, no pin spacer, all world cards visible, canvas static |
| Production | title, security headers, resume, screenshots, sitemap, robots, social image and styled 404 all verified on the alias |

Captures are in `docs/screenshots/`.

## 6. Performance findings

Measured with Playwright on the local production build (desktop 1440×900 at DPR 2; phone
390×844 at DPR 3 with 4× CPU throttling):

| Metric | Desktop | Throttled phone |
|---|---|---|
| First Contentful Paint | 92 ms | 232 ms |
| Largest Contentful Paint | ≈ 2.0 s (last letter of the name) | ≈ 2.7 s (statement paragraph) |
| Cumulative Layout Shift | 0.0009 | 0 |
| Long tasks during load | 0 | 4 (313 ms total, hydration) |
| Animation frame rate, hero and case study | 61 fps, worst frame 19 ms | 61 fps, worst frame 19 ms |
| Transfer on first view | JS 277 KB · fonts 140 KB · CSS 9 KB · images 38 KB · total 464 KB | total 443 KB |

LCP is gated by the entrance choreography by design: the name is the largest element and
it finishes painting at the end of its reveal. Reduced-motion visitors get an immediate
paint. Shortening the reveal further is a one-line change to the delays in
`components/scenes/hero.tsx`. Canvas cost: node count scales with viewport area and halves
on touch, DPR is capped, the loop pauses when the tab is hidden, and the engine is imported
on idle after hydration.

## 7. Accessibility findings

Passes the checks above. Contrast: `ink` ≈ 15.6:1, `muted` ≈ 8.5:1, `faint` ≈ 5.1:1 on the
base; `ghost` is decorative only. Focus rings are 2px cyan on every interactive element.
The canvas is `aria-hidden`; every fact it shows is also in the DOM. Known limitation: the
architecture diagram's SVG edges are visual only — connections are read out in text in the
description panel, which is the accessible equivalent.

## 8. Deployment status

- Branch `main` at `3172498` (plus this report's commit) pushed to
  `sgtsujith141-wq/sujith-portfolio`; remote head verified equal to local after every push.
- The repository's Vercel GitHub integration built commit `3172498` and reported
  **Production · success**. The alias https://sujith-portfolio-two.vercel.app now serves the
  new build (verified by title, headers, assets and a full browser QA pass).
- The Vercel CLI token cached on this machine is expired, so no CLI deploy was run; none was
  needed. To use the CLI again: `npx vercel login`.

## 9. Git history

Seven milestone commits on top of the three pre-existing ones, no history rewritten, no
force-push, every push verified against the remote:

1. Rebuild foundation for the Living System portfolio
2. Add the design system, typography and navigation shell
3. Add the Living System background engine
4. Add scroll choreography: opening sequence, reveals and the pinned Work scene
5. Add the project showcases, engineering evidence and remaining scenes
6. Refine responsiveness, accessibility and the background's relationship to content
7. Add documentation, QA captures and a pre-hydration entrance gate

Work happened on `living-system` and was fast-forwarded into `main`, so the branch and
`main` contain identical commits.

## 10. Remaining limitations

- The LCP figures above sit at the edge of the "good" threshold because of the entrance.
- The four repositories' figures are snapshots; when they change, re-run the method noted
  beside each figure and update `content/`.
- Hovering a case study's visual column highlights that project's cluster, but there is no
  per-technology hover from the stack chips to individual graph nodes.
- The architecture explorer's diagram needs horizontal scrolling below 720px wide.
- No automated test suite for the site itself; QA is the Playwright scripts described above
  (kept outside the repository).

## 11. Content still needed from you

- **Site URL**: set `NEXT_PUBLIC_SITE_URL` in Vercel if you attach a custom domain.
- **Phone**: hidden by default; set `NEXT_PUBLIC_CONTACT_PHONE` if you want it public.
- **Hackathon dates** and any placement at Avinya 2.0, if you want them shown.
- **Phantom HQ**: excluded until its status and scope are verified.
- **`lowtide`**: a fifth public repository exists but was not in the brief, so it is not on the site.
- **SurakshaScore MVP screenshots**: none exist because the app needs Supabase to render; the
  site says so rather than staging one.

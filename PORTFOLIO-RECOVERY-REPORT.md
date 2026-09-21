# Portfolio recovery

**Date:** 2026-09-21 · **Branch:** `fix/personal-portfolio-experience` ·
**Repository:** https://github.com/sgtsujith141-wq/sujith-portfolio

I got the assignment wrong. I turned a personal portfolio into a technical exhibition,
deleted a startup animation you liked, and invented a technical learning plan you never
gave me. This is what I changed back.

## 1. The startup animation — recovered, not reconstructed

**Recovered from commit `227ec66`**, the last commit before my own rebuild removed it.

| File | Added | Deleted by | Restored from |
|---|---|---|---|
| `components/intro/intro-sequence.tsx` | `ef5b311` | `6f8bb89` (my rebuild) | `227ec66` |
| `components/ui/decrypt-text.tsx` | `ef5b311` | `6f8bb89` (my rebuild) | `227ec66` |

The intro state-machine CSS was recovered from the same commit's `app/globals.css`.

**What came back unchanged:** the pulse at centre, the scan sweep, the SECURE SESSION
and IDENTITY VERIFIED labels, the corner brackets, your name resolving letter by letter
out of cipher glyphs in the original monospace face, the single glitch beat as it locks,
the disciplines line, ACCESS GRANTED, the skip control, and the original timings — 600 /
1300 / 2300 / 3000 / 3500ms with a 430ms cross-fade. The handoff is still a morph rather
than a fade: the name performs a measured FLIP onto the page's own heading while the
shared canvas expands outward beneath it.

**Four adaptations were unavoidable, and none of them touch the animation:**

1. The content directory was renamed from `data/` to `content/` during the rebuild.
2. `useWorld` became `useLivingSystem`. `setIntroScene` is reimplemented against the
   current engine as two formations, `boot` and `emerge`, which reproduce the original
   behaviour: the field collapsed at centre, then condensing out of it as a golden-angle
   spiral, then released outward on handoff.
3. The current `tsconfig.json` enables `noUncheckedIndexedAccess`, which the original
   predates, so two index reads are now guarded.
4. React 19's hooks lint rules flagged a ref written during render and a `setState` in an
   effect body. The first moved into an effect; the second was removed by deriving the
   settled state from the output instead of holding it separately.

**One thing is different, and it is deliberate:** the hero now leads with **SUJITH C**
rather than the headline, because the sequence needs a heading to land on. The headline
sits underneath as the supporting line. Without this there was no morph target and the
animation had nowhere to go.

**Two defects found while verifying it:**

- The sequence mounts before the background engine module finishes loading, so its first
  scene was being dropped and the name revealed over an already-expanded network. The
  provider now holds the scene and applies it when the engine arrives.
- The pre-paint gate now arms the opening on the home route only, so `/work` pages are
  not left waiting for a sequence that never runs there.

**Verified:** it plays, the name resolves, the morph lands with no flash, it replays on
every reload (checked twice in a row, no storage is consulted), and `prefers-reduced-motion`
skips it entirely with the hero at full opacity. Frames are in `docs/recovery/startup-*.jpg`.

## 2. Personal content corrected

| Was | Now |
|---|---|
| "Smart India Hackathon — **Winner**, internal college round" | "My team was shortlisted during BMSIT's internal selection process." |
| Skills listed TypeScript, React, Vitest, Capacitor, GitHub Actions, "writing tests", "technical documentation" | Basic C, C++, Python, SQL, HTML; basic UI/UX and Figma; Photoshop, CorelDRAW, Office; general familiarity with computers and servers |
| Networking "enough to run a private network properly", "still working through the theory", "static local leases", "routing fundamentals" | Removed. Networking appears as an interest, not a proficiency claim |
| Cryptography implied as a defining interest | It is the subject of one project. Your interests are networking, cybersecurity, computer systems, operating systems, servers and self-hosting, experimenting, and AI |
| No mention of how you build | One sentence in About: you work out the idea, decide what it should do, try implementations, and use AI coding tools heavily to get there |

All personal content is now in **one editable file, `content/personal.ts`**, with the rule
written at the top of it: nothing goes in that you have not said, or that is not visible in
a repository you own.

## 3. Fabricated content removed

Deleted outright, not rewritten into different invented paragraphs:

- The four exploration entries: "Networking, properly", "Making the lab less fragile",
  "Security fundamentals", "AI inside bounded products".
- Everything they contained: subnetting, DNS resolution, WireGuard internals, routing,
  missing backup strategies, missing monitoring, service recovery, trust boundaries,
  vulnerability classes, and consolidating Aether Health's backends as your learning plan.
- An "isolated VM lab / CTF" plan you never mentioned.
- A four-point engineering-philosophy section I attributed to you.
- The invented weaknesses in your home lab ("no monitoring", "no backup strategy worth the
  name yet") that I had presented as your own assessment.

The file `content/exploration.ts` no longer exists.

## 4. Added, because they are real

**Operating systems.** Windows, Linux, macOS, ReviOS, Nexus Lite, Ghost Spectre, and
ReviOS over Ghost Spectre — framed as curiosity and getting more frames out of Minecraft.
No benchmarks, no percentages, no claim that you developed any of them.

**Home lab, compact.** One section with an animated server: the machine breathes, four
links animate down to remote access, storage, media and the game server, and pointing at
one explains it in a line. No uptime, no metrics, no addresses. The full breakdown stays
in the case study at `/work/home-lab`.

**Phantom HQ.** On the home page as "Currently building", and as a case study. Status is
read from the project's own `PHASE_MANIFEST.json`, which that project treats as
authoritative over its README: **21 of 24 build phases complete; end-to-end testing, a
clean-machine rebuild and v1.0 outstanding.** Dated 2026-09-21. The repository is private,
so there is no link and none was invented — the page says so.

**Smart India Hackathon** sits in a small "Along the way" block, not as the site's identity.

## 5. Homepage redesigned

```
BEFORE (7 sections)              AFTER (6 sections)
01 Introduction                  01 Introduction    startup animation → the name
02 Who I Am                      02 About           who you are, what you enjoy, what
03 Technical World  ← diagram                       you've worked with
04 Home Lab         ← diagram    03 Machines        operating systems + the server
05 Exploring        ← invented   04 Now             Phantom HQ + what's happened
06 Work                          05 Work            a preview of three
07 Connect                       06 Connect
```

The elaborate "personal network" tablist is gone — it was a research diagram. What you
enjoy is now a menu: pointing at one brings up a sentence and lights that part of the
field behind the page.

## 6. Motion — what was actually wrong

I audited it rather than lengthening durations.

| Defect | Cause | Fix |
|---|---|---|
| Everything felt clicky | Most transitions specified a duration but **no easing curve**, so they used Tailwind's default symmetric ease-in-out | One curve set in `lib/motion.ts`, exposed to CSS as `.t-fast` / `.t-base` / `.t-slow`. A hover and a Motion tween can no longer disagree |
| Janky hovers | **12 uses of `transition-all`**, which animates layout properties too | All replaced with explicit property lists. None remain |
| The rail stuttered | Its label animated `max-width` and its progress bar animated `height` — both layout properties | Both now use transform and opacity only |
| Two animation libraries | GSAP was still installed and imported after its one pinned scene was removed | **GSAP and `@gsap/react` uninstalled.** Motion for React is the only one left. Bundle dropped 295 KB → 251 KB |
| Page shifted during the intro | The scan sweep animated `top` — a layout property — every frame | Moved onto a transform. **Layout shift fell from 0.051 to 0.006** |
| Background snapped between sections | Camera and palette eased at the same rate as the nodes | Camera eases more slowly than the field, so a change settles instead of cutting |
| Idle field looked parked | A single drift frequency the eye could follow | Two frequencies, softer spring, longer wander |

## 7. Background

Still one continuous canvas, mounted above the router so it never resets — including
between `/` and `/work`. Depth-scaled parallax, signals flowing along lit edges, a light
field that follows the pointer as one composited layer.

The change you asked for: **it is no longer a technical diagram in every section.** The
Machines section is marked *quiet* — the field holds depth and atmosphere there, and
pointer proximity may light a node but never prints a label over the illustration. The
labelled topology survives only where it belongs, in the home-lab case study.

## 8. Test results

Production build, eight routes, at 1440×900 and 390×844, each scrolled end to end.

| Check | Result |
|---|---|
| Console errors and warnings | **none**, on any route, at either width |
| Horizontal overflow | **none** — 16 route/width combinations |
| Links | 17 destinations, **all resolve** |
| Images | none broken, all have alt text |
| Headings | exactly one `h1` per route, **no skipped levels** |
| Buttons and links without an accessible name | **zero** |
| Startup animation | plays, replays on every reload, morph lands with no flash |
| Reduced motion | skips the sequence; hero at full opacity; no pin |
| Keyboard | interests menu, home-lab server spokes, topology arrow keys, mobile dialog |
| Typecheck · lint · build | clean; 14 routes prerendered |

**Performance** at 2× device pixel ratio desktop and a 3×-DPR phone under 4× CPU throttling:

| Metric | Desktop | Throttled phone |
|---|---|---|
| First Contentful Paint | 76–132 ms | 272–280 ms |
| Cumulative Layout Shift | 0.006 | 0.013 |
| Frame rate — hero | **61 fps** | **61 fps** |
| Frame rate — machines | **61 fps** | **61 fps** |
| Transfer, first view | JS 251 KB · fonts 140 KB · CSS 10 KB · total 408 KB | same |

## 9. Screenshots

In `docs/recovery/`: four frames of the startup sequence, every home section, the work
index, the Phantom HQ and home-lab case studies, four mobile views, and reduced motion.

## 10. Commits

On `fix/personal-portfolio-experience`, no history rewritten, no force-push:

1. `d168baf` — Restore the original startup animation
2. `c9e5de8` — Remove the fabricated content and rebuild the homepage around Sujith
3. *(this commit)* — Layout-shift fix, screenshots and this report

**One correction about the commits:** commit `c9e5de8` also contains the motion-system
rewrite and the GSAP removal. I staged everything together before writing its message, so
the message describes only the content work. Rather than rewrite history to tidy that, I
am recording it here — the motion changes are in `c9e5de8`, not in a commit of their own.

## 11. Deployment

**Not deployed.** You said not to overwrite the live production site without your
approval, and on this repository a push to `main` deploys to production automatically via
the Vercel GitHub integration. The branch is pushed and a pull request is open; merging it
is what would deploy. The production site is still showing the previous version.

## 12. Remaining limitations — stated, not hidden

- **Largest Contentful Paint is about 4.4 s on the home page.** The largest element is your
  name, and it is not painted until the startup sequence hands off at roughly 3.5 s. This is
  the direct cost of the animation you asked to have back, and I did not shorten it
  unilaterally. If you want it quicker, the timings are five numbers at the top of
  `components/intro/intro-sequence.tsx` (`MARKS` and `HANDOFF_AT`). Reduced-motion visitors
  paint immediately.
- **The page is hidden while the sequence runs** — `#site` is at opacity 0 for those ~3.5 s.
  That is how the original behaved. It is technically a gate on access; you liked it, so I
  restored it rather than changing it.
- **A residual layout shift of 0.006** comes from the intro's centre stack growing as the
  disciplines line and ACCESS GRANTED appear. Removing it would mean reserving space and
  altering the original composition, so I left it. It is effectively zero.
- **Phantom HQ cannot be independently verified** because the repository is private. The
  status shown is what its own manifest says, with the date I read it.
- **I have not seen your home lab.** Every fact about it is what you told me. Nothing is
  measured, and the diagram says it is illustrative.
- **The SECURE SESSION / IDENTITY VERIFIED / ACCESS GRANTED labels** in the startup
  sequence are part of the original animation you asked me to restore. They do read as
  "terminal" language, which elsewhere you have told me to avoid. I kept them because
  faithfulness to the original was the instruction; say the word and I will soften them
  without touching the choreography.
- **The `securemailscope` and `lowtide` repositories are not on the site.** The first is
  private; the second is public but has never been in a brief. Either can be added.

## 13. What I still need from you

- Whether to keep or soften the terminal-style labels in the startup sequence.
- Whether the startup sequence should be shortened, given the paint cost above.
- Approval to merge, which is what deploys to production.
- Anything about the home lab or Phantom HQ you want stated that I have left out — I will
  not fill those gaps myself.

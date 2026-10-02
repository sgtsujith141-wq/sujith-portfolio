# Design audit — before the 3.0 redesign

Conducted 2026-09-21 against the running production build at 1920×1080, 1440×900 and
390×844, with DOM measurement rather than impressions alone. Screenshots in
`docs/audit/`.

**Branch note.** The brief says to branch from production `main`. Three of the files it
asks me to audit — `content/personal.ts`, `lib/motion.ts` and
`components/intro/intro-sequence.tsx` — do not exist on `main`. They are only on
`fix/personal-portfolio-experience`, the open and unmerged PR #2, which is also where the
recovered startup animation lives. Branching from `main` would delete the animation the
brief calls non-negotiable, so this branch is cut from that PR instead. If PR #2 is merged
first, this rebases onto `main` cleanly.

Also: the brief names `content/projects.ts`. The actual path is the directory
`content/projects/`, one file per project.

---

## 1. The Work page is the worst of it

Measured on the landing page at 1440×900:

| Region | Height | Share of page |
|---|---|---|
| Whole document | 4285 px | — |
| Project list (all six rows) | 1218 px | 28% |
| **Engineering-evidence block** | **2135 px** | **50%** |

Half the Work landing page is a wall of testing metrics — exactly what the brief says to
remove. The six projects get less than a third of it.

**No hierarchy.** All six rows are identical in weight. CryptoDrishti and SurakshaScore,
the two real pieces of work, sit at the same visual level as an archived prototype and a
machine in a bedroom. SurakshaScore MVP reads as an unrelated product rather than the
earlier version of the thing above it.

**The preview interaction is broken, and I reproduced it.** Hovering five rows in quick
succession, sampling the panel after each:

```
row 1 → "LIVING SYSTEM · PROJECT MODULES"   ← idle state, not the project
row 2 → "LIVING SYSTEM · PROJECT MODULES"   ← idle state
row 3 → "LIVING SYSTEM · PROJECT MODULES"   ← idle state
row 4 → "SURAKSHASCORE"
row 5 → "SURAKSHASCORE"                     ← stale, one behind
pointer leaves → "SURAKSHASCORE"            ← never cleared
```

Three causes, all in `components/work/work-index.tsx`:

1. `AnimatePresence mode="wait"` serialises exit-then-enter. Moving faster than the exit
   duration queues the transitions, so the idle state shows through between them.
2. `onMouseLeave` sets the active project to `null`, adding a third state to churn
   through on every pass between two rows.
3. Nothing is preloaded, so the first hover on a project waits on its screenshot.

**Hover is required to learn anything.** The idle panel says "Point at a project to bring
its module forward." A touch user never sees it at all.

---

## 2. The homepage is a stack of card grids

Composition measured per section (character count ÷ pixel height, and how many images,
SVGs or canvases each contains):

| Section | Height (laptop) | Visuals | Note |
|---|---|---|---|
| introduction | 1.0 vh | 3 | Fine, but see below |
| about | **1.9 vh** | **0** | Tallest section on the page and entirely text |
| machines | 1.6 vh | 2 | The only section with real artwork |
| now | 1.2 vh | **0** | Text only |
| work | 1.2 vh | 4 | |
| connect | 0.9 vh | 4 | Density 0.32 — mostly empty |

Every section is the same shape: an eyebrow, a display heading, a lede, then a grid of
bordered cards. About has three skill cards; Machines has seven OS cards; Now has two
highlight cards; Connect has four contact cards. That repetition is what makes the site
feel conventional. It is one layout wearing six hats.

**The hero specifically.** The name and headline are strong. Around them: the four
call-to-action buttons wrap into two ragged rows in a right-aligned block that does not
line up with anything on the left; the interests rail wraps so "AI & BUILDING APPS" is
orphaned onto its own line; and there is a large dead band between the statement and that
rail.

---

## 3. The background is a diagram, not an atmosphere

In the hero, the canvas prints **AI & BUILDING APPS**, **NETWORKING**, **COMPUTER
SYSTEMS**, **SERVERS & SELF-HOSTING** and **OPERATING SYSTEMS** across the composition in
monospace. The same happens in About. The brief asks for "a beautiful atmospheric
environment rather than a visible technical diagram behind everything", and this is
precisely the latter — it is labelling itself.

Other weaknesses:

- Depth comes from one mechanism only: parallax scaled by a per-node `z`. There are no
  genuinely separate layers, no flowing pathways, and nothing between the nodes and the
  viewer.
- The light field is a single radial gradient following the pointer. It never changes
  shape, only position and tint.
- Formations can jump: when a section hands the engine a measured `stage` rectangle, the
  targets change in one step rather than interpolating from the previous composition.
- `mood` shifts the palette only between blue and cyan. Sections do not feel
  atmospherically different from one another.

---

## 4. Motion is consistent but monotonous

The previous pass fixed the mechanics: one curve set in `lib/motion.ts`, no
`transition-all`, no layout-animating properties, one animation library. Measured 61 fps
at 2× DPR and 0.006 layout shift, and that holds.

What is missing is *choreography*. Almost everything on the site enters with the same
gesture — `Reveal`, an 18px rise and a fade. There are no page transitions between `/` and
`/work`, no continuity when returning from a case study, and no moment that is composed
rather than simply revealed. More animation is not the answer; different kinds are.

---

## 5. What is working and must survive

- **The startup sequence.** Name reveal, cipher glyphs, scan sweep, pulse, glitch beat,
  corner brackets, skip control, and the morph onto the hero heading. Untouched.
- The type system: Archivo display, Geist body, Geist Mono labels.
- The palette's bones: near-black graphite, electric blue, cyan signal, violet depth.
- The Machines section's server illustration — the one genuinely composed visual.
- The Connect section's convergence, where the field folds to a point.
- All verified project content, screenshots, and the corrected personal copy.

---

## 6. What the redesign has to do

1. **Work:** two featured projects with real presence, four secondary ones below, and the
   evidence moved inside the case studies where it belongs.
2. **Preview:** persistent, crossfading, preloaded, never blank, and usable without a
   pointer.
3. **Homepage:** replace the repeated card grid with editorial compositions that differ
   from section to section.
4. **Background:** atmosphere first. Remove the labels, add real layers, flowing
   pathways and lighting that moves.
5. **Motion:** add kinds of movement, not quantity — page transitions, image transitions,
   and section changes that feel composed.

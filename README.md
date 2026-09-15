# Sujith C — portfolio

A dark, technical personal site: Next.js (App Router) + TypeScript + Tailwind v4,
Framer Motion for choreography, a page-wide animated node field that evolves as you
scroll, an interactive infrastructure topology, and a ⌘K command palette.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint     # eslint
npm run typecheck
```

---

## Where the content lives

Everything editable is in `data/`. No layout code needs to change to update the site.

| File | What it holds |
| --- | --- |
| `data/profile.ts` | Name, education, the opening statement, the About paragraphs, **email, phone**, resume switch, SEO metadata |
| `data/projects.ts` | The four software case files and the starred Systems Lab entry |
| `data/systems-lab.ts` | The Systems Lab copy and the topology nodes/edges |
| `data/capabilities.ts` | The three capability groups |
| `data/cyber.ts` | Cybersecurity tracks, and the writeup/lab archive |
| `data/hackathons.ts` | Events entered |
| `data/social.ts` | GitHub, LinkedIn, email, phone, resume links |
| `data/navigation.ts` | Section registry — feeds the nav, scroll-spy and command palette at once |

### Information architecture

`ABOUT → PROJECTS → CYBERSECURITY → HACKATHONS → CONTACT`

Systems Lab is **not** a section. It is the starred record inside Projects, and
opening its case file loads the interactive topology. Capabilities sits between
Cybersecurity and Hackathons without a navigation index — it is supporting
evidence, not a chapter.

### Deepening a project case file

`data/projects.ts` holds the four real repositories, with names, descriptions,
languages and topics taken from GitHub. The narrative fields — `problem`,
`implementation`, `architecture`, `learnings` — are empty on purpose. The case
file renders only the blocks that have content, so an unwritten section is simply
absent; fill any of them in and it appears. Until then the case file closes with a
"full writeup pending" line that points at the repository.

Adding `links.live` to a project makes a DEMO button appear next to SOURCE.

### Adding a CTF writeup, lab note, experiment or tool

Push an entry into the `log` array in **`data/cyber.ts`**. While the array is
empty the archive block does not render at all — no heading, no empty state. The
first real entry brings the whole block into existence.

### Adding a hackathon

Append to the array in **`data/hackathons.ts`**, newest first.

### Adding a topology node

Append to `topology` in **`data/systems-lab.ts`** with a `row`, an `x` between 0
and 1, and a `parent`. Edges are derived from `parent`, so the diagram and the
mobile chain both update with no diagram code to touch.

---

## Placeholders still to fill

1. **Site URL** — `NEXT_PUBLIC_SITE_URL`, used for metadata and the social card.
3. Optional: hackathon `date` values in `data/hackathons.ts`.
4. Optional: project narrative fields in `data/projects.ts`.

Email and phone are configured in `data/profile.ts` under `contact`.

---

## The world

`components/world/` holds one canvas that runs behind the entire page — the opening
sequence and every section render into the same field, which is what makes the intro
appear to open into the site rather than end.

| File | Role |
| --- | --- |
| `scenes.ts` | Declarative scene table: where each node should sit, and how the field should look. All coordinates normalised, so a resize costs nothing. |
| `world-engine.ts` | Imperative canvas engine. Springs nodes toward their targets and cross-fades render parameters, so a scene change is a morph rather than a cut. Never causes a React render. |
| `world.tsx` | Mounts the canvas and picks the scene from three inputs, in priority order: the intro, an explicit override, then whichever section is being read. |

Scenes by section: `calm` for About, `projects` clusters for Projects, `topology`
(the real home-lab tree) whenever Systems Lab is hovered or open, `cyber` — finer
grain, packets, a scanning band — for Cybersecurity, `timeline` for Hackathons, and
`dissolve` for Contact.

To add a scene: add an entry to `SCENES` with a `layout()` and its parameters, then
map a section to it in `SECTION_SCENE` in `world.tsx`. Nothing else changes.

### Performance

- One canvas, one rAF loop. Node count scales with viewport area and drops to 45% on
  coarse pointers; DPR is capped at 2 (1.5 on touch).
- The engine is a dynamic `import()`, so it is not in the initial bundle and never
  competes with first paint.
- `pointermove` is coalesced to one update per frame; `scroll` is rAF-throttled.
- The loop stops entirely when the tab is hidden, and `dt` is clamped so a
  backgrounded tab does not fling the springs on return.
- Links use squared distance with an early-out; no canvas shadows or blurs.
- Measured 60fps through a full-page scroll at 1440×900, 1280×800 and 390×844.

## Notes on behaviour

- **Opening sequence** runs ~3.5s and replays on **every** page load. No storage is
  consulted. It cannot retrigger from scrolling or nav clicks, because the site is a
  single page and the component never remounts. Escape, Enter, Space or the skip
  control end it early; `prefers-reduced-motion` never sees it, decided by a
  blocking script in `app/layout.tsx` before first paint.
- **The handoff is a morph.** `data-intro` runs `pending → morphing → settling →
  done`. The shared node field expands outward, and the sequence's centred name is
  measured against the page's `<h1>` (`data-morph-target`) and flown onto it before
  the two cross-fade, so the name is never on screen twice.
- **Command palette** — ⌘K / Ctrl+K. The panel and `cmdk` are code-split and
  prefetched on idle, so they are not in the initial bundle.
- **Reduced motion** is honoured throughout. The opening never plays, the world
  draws a single frozen frame of the `calm` formation instead of running its loop,
  the topology traffic stops, and a global `MotionConfig reducedMotion="user"` drops
  transform and layout animation while still letting content appear.
- **Resume links are gated at the data layer.** The PDF lives at
  `public/Sujith_C_Resume.pdf` and is served from `/Sujith_C_Resume.pdf`.
  `profile.resume.available` is the single switch; when it is false the button is
  not rendered anywhere, so the site cannot produce a 404 for it.

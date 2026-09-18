# Sujith C — The Living Portfolio

An interactive engineering portfolio built as a living digital system: one
graph of projects, technologies, concepts and evidence sits behind the whole
site on a single canvas, reorganising as the visitor scrolls, and each project
pulls its own cluster forward while it is being read.

Production: <https://sujith-portfolio-two.vercel.app>

```bash
npm install
npm run dev        # http://localhost:3000
npm run check      # lint → typecheck → production build
npm run build && npm start
```

Node 20.9+ · no environment variables required (see `.env.example` for the optional ones).

## Where things live

| Path | What |
|---|---|
| `content/` | Every fact on the site — profile, sections, the four case studies, evidence snapshots, the semantic graph. Components never hold facts. |
| `components/canvas/` | The Living System: provider, formations and the canvas engine. |
| `components/scenes/` | The six sections. |
| `components/projects/` | Case-study frame and per-project visuals. |
| `public/projects/<slug>/` | Real screenshots copied from the repositories. |

## Editing content

- **A fact changed in a repository** → edit the matching file in `content/projects/`
  and update the `verification` entry's `date` and `method`. `content/evidence.ts`
  holds the dated snapshots the Evidence section prints; change the value only
  after re-running the method.
- **Contact or resume** → `content/profile.ts` or the environment variables in
  `.env.example`. Setting `NEXT_PUBLIC_RESUME_URL=off` hides every Resume button.
- **A new section** → add it to `content/navigation.ts`; the rail, mobile menu,
  scroll-spy, background engine and sitemap read from that list. Give it a
  formation in `components/canvas/engine/formations.ts`.
- **A new node in the background** → `content/graph.ts`.

## Documents

`DESIGN-SYSTEM.md` · `ARCHITECTURE.md` · `CONTENT-SOURCES.md` · `DEPLOYMENT.md` ·
`FINAL-REPORT.md` · `docs/CREATIVE-DIRECTION.md`

## Credits

Archivo, Geist and Geist Mono (SIL Open Font License) via `next/font`. Icons by
Lucide (ISC). Built with Next.js, React, Tailwind CSS, Motion for React and GSAP.

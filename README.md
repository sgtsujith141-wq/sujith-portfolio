# Sujith C — The Living Portfolio

An interactive portfolio built as a living digital system. The home page is about
Sujith — what he explores, the Debian server he runs at home, and how those connect.
The projects are a separate layer at `/work`. One graph of domains, services,
projects and evidence sits behind the whole site on a single canvas that never
resets, reorganising as you scroll.

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
| `content/` | Every fact on the site — profile, identity, home lab, the five case studies, evidence snapshots, the semantic graph. Components never hold facts. |
| `components/canvas/` | The Living System: provider, formations and the canvas engine. |
| `components/home/` | The seven home sections, including the personal network. |
| `components/homelab/` | The interactive topology, shared by the home page and its case study. |
| `components/work/` | The Work layer: header, index, case-study view, evidence. |
| `components/projects/` | Case-study frame and per-project visuals. |
| `public/projects/<slug>/` | Real screenshots copied from the repositories. |

## Routes

| Route | What |
|---|---|
| `/` | Home — introduction, who I am, technical world, home lab, exploring, work teaser, connect |
| `/work` | All five projects, engineering evidence, architecture explorer |
| `/work/<slug>` | One case study in full |

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
- **The home lab** → `content/homelab.ts`. Adding a service is one object; the
  topology, the case study's architecture diagram and the background all derive
  from it. Do not add metrics: nothing there is measured.
- **What I explore** → `content/identity.ts`. Domains drive the hero rail, the
  personal network and the background graph. Keep library names out of `skills`.
- **A new node in the background** → it is derived from the content above.

## Documents

`DESIGN-SYSTEM.md` · `ARCHITECTURE.md` · `CONTENT-SOURCES.md` · `DEPLOYMENT.md` ·
`PORTFOLIO-V2-REPORT.md` (the current redirection) · `FINAL-REPORT.md` (v1) ·
`docs/CREATIVE-DIRECTION.md` · screenshots in `docs/v2/`

## Credits

Archivo, Geist and Geist Mono (SIL Open Font License) via `next/font`. Icons by
Lucide (ISC). Built with Next.js, React, Tailwind CSS, Motion for React and GSAP.

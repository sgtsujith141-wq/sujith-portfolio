# Sujith C — portfolio

Second-year Computer Science & Engineering student at BMS Institute of
Technology & Management, Bengaluru, looking for cybersecurity internships.
Monochrome, dark, every project explained in plain language.

Production: <https://sujith-portfolio-two.vercel.app>

```bash
npm install
npm run dev        # http://localhost:3000
npm run check      # lint → typecheck → production build
```

Node 20.9+. No environment variables.

## Where things live

| Path | What |
|---|---|
| `content/site.ts` | Every fact on the site, typed. Components hold no facts. Sources: `CONTENT-SOURCES.md`. |
| `app/page.tsx` | Home: hero, about, projects (pinned, sideways), skills, hackathons, contact. |
| `app/projects/layout.tsx` | The projects explorer, shared by `/projects` and `/projects/[slug]`. |
| `components/background.tsx` | The cipher-field canvas. |
| `components/boot.tsx` | Startup animation: CRT power-on and SSH session. |
| `components/runtime.tsx` | Eased scrolling, cursor, magnetic buttons, route wipe, focus after navigation. |
| `components/reveal.tsx` | Scroll-entry primitives: reveal, decrypt, type-out. |
| `components/projects/` | Explorer and the interactive panels. |
| `public/projects/<slug>/` | Real screenshots copied from each repository. |
| `docs/final/` | Screenshots of this build at 1440 and 390 px. |

The design reference this build matches is `portfolio-final.html`, approved by
Sujith. `ARCHITECTURE.md` explains how the pieces fit; `DESIGN-SYSTEM.md` lists
the tokens and motion rules.

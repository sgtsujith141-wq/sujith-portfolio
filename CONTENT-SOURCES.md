# Content sources

Every claim on the site maps to one of the sources below. Dates are the day the
check was made. Nothing on the site is a live counter.

## Identity and contact

| Fact | Source |
|---|---|
| Name, role, statement | Brief supplied by Sujith |
| GitHub `sgtsujith141-wq`, LinkedIn `sujith-c-3637ba388` | Brief; both URLs fetched successfully on 2026-09-18 |
| Email `sgt.sujith.141@gmail.com` | Supplied by Sujith in an earlier session; matches the public email on the GitHub profile (`gh api user`, 2026-09-18) |
| Phone | Deliberately **not** shown. Configurable via `NEXT_PUBLIC_CONTACT_PHONE`. |
| Education: BMSIT, CSE, 2nd year, CGPA 8.2/10 | Supplied by Sujith; CGPA as stated on the resume at `public/Sujith_C_Resume.pdf` |
| Hackathons: SIH internal round winner at BMSIT; Avinya 2.0 participant | Supplied by Sujith. No dates, team sizes or placements beyond these are shown. |
| Home server (Debian 12, CasaOS, Jellyfin, Tailscale, Minecraft) | Supplied by Sujith |
| Skills lists | Supplied by Sujith and the GitHub profile README (`sgtsujith141-wq/sgtsujith141-wq`) |
| "Currently exploring" themes | GitHub profile README plus the open items in each repository's README |

Deliberately excluded: any internship or employer, certifications, Phantom HQ
(status unverified), a fifth public repository (`lowtide`) that was not in the brief.

## Repositories (all read at these commits on 2026-09-18)

| Repository | Commit | Local clone used |
|---|---|---|
| cryptodrishti | `90f4da3` | `/Volumes/Volume/Projects/Crypto-Dhrishti` |
| surakshascore | `34c70cc` | `/Volumes/Volume/Projects/Digi-Safe` |
| surakshascore-mvp | `cc132f1` | `/Volumes/Volume/Projects/Personal-Digital-hygiene-app-main` |
| aether-health | `65533a3` | `/Volumes/Volume/Projects/velora2.0-main` |

Each local clone was fetched and confirmed equal to `origin/main`. No repository was modified.

### CryptoDrishti

- Problem, solution, sensors, classification split, Mosca model, decisions, limitations: README.
- **226 tests pass**: `pytest -p no:cacheprovider` run locally, 2026-09-18 → `226 passed, 2 warnings in 1.51s`. Per-suite counts from the README (sum = 226).
- **52-algorithm registry**: `len()` of the registry dict in `app/knowledge/algorithms.py`, 2026-09-18.
- **Six sensors**: `app/scanners/` contains `source.py deps.py binary.py certs.py configs.py network.py`.
- **CI**: `.github/workflows/ci.yml` read (3.11/3.12/3.13 matrix + CBOM conformance smoke job); latest run for `90f4da3` = success via GitHub API.
- **paramiko scan figures** (70 files, 12 assets, 8 vulnerable, 66.7%, 1.3s): README and the 2026-09-17 report. Labelled as documented, not re-run.
- Screenshots: nine files in `Report/assets/screenshots/`, copied unmodified.
- "Presented at the SIH 2026 internal round": `Report/docs/08-outcome.md`.

### SurakshaScore

- **107 tests across 21 files**: `npx vitest run` locally, 2026-09-18 → `Test Files 21 passed, Tests 107 passed`.
- **17 rules**: unique `id:` values across `src/core/rules/*Rules.ts`. **53 findings**: unique `id:` values in `src/lib/findings/registry.ts`.
- **Weights** 0.35/0.20/0.20/0.10/0.10/0.05 and **ceiling 79**: `src/core/config/scoringConfig.ts`.
- **Evidence tiers and weight factors**: README table.
- **13 screens**, **5 collectors**: directory listings.
- **Isolation test**: `tests/core/isolation.test.ts` forbidden-import list read.
- CI: latest run for `34c70cc` = success.
- Screenshots: six files in `docs/images/`, real UI over demo data (README states this).

### SurakshaScore MVP

- Vault PBKDF2-SHA256 100,000 iterations + AES-GCM: `src/lib/cryptoVault.ts` lines 25–46.
- HIBP 5-character prefix: `src/lib/hibp.ts` line 10–14.
- AI analyser stub returning `INSUFFICIENT_EVIDENCE`: `src/engine/AIAnalyzer.ts`.
- Typecheck/build pass, 206 lint errors, no tests, no screenshots (Supabase required): README and the 2026-09-17 report; CI for `cc132f1` = success.
- Comparison table: README "What changed in the rewrite".

### Aether Health

- **22 routes**: `<Route` elements in `client/src/App.tsx`. **34 screen components**: `.tsx` files under `client/src/screens/`.
- AI routes `/chat` and `/medical-report`: grep of `server/src`.
- Client typecheck 0 errors / 2,782-module build, server typecheck and build pass, guest mode without console errors: 2026-09-17 report; CI for `65533a3` = success.
- "Nothing is encrypted", placeholder avatars, remaining Unsplash scenery, not a medical device: README.
- AI features **not exercised** (need a Gemini key) — stated on the site.
- Screenshots: four files in `docs/images/` (guest mode, seeded demo data).

## Assets

- Screenshots: copied from the repositories above; the repositories are Sujith's own work.
- Fonts: Archivo, Geist, Geist Mono under SIL OFL via `next/font/google`.
- Icons: Lucide (ISC).
- No stock photography, no third-party imagery.

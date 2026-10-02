# Content sources

Every fact on the site comes from `content/site.ts`, and every line there comes
from one of two places:

- **README**: the project's repository README on GitHub (`main` branch),
  re-checked 2 Oct 2026. Local clones of CryptoDrishti and SecureMailScope
  were checked too.
- **Sujith**: Sujith's own answers, given with the approved design brief and
  `portfolio-final.html`.

## Identity, hero, about

| Fact | Source |
|---|---|
| Name, Sujith C | Sujith |
| Second year, third semester, Computer Science & Engineering | Sujith |
| BMS Institute of Technology & Management, Bengaluru | Sujith |
| Open to cybersecurity internships, Bengaluru or remote | Sujith |
| Working mainly in cybersecurity, AI and systems | profile README (sgtsujith141-wq/sgtsujith141-wq) |
| About paragraphs (small practical tools, run, documented honestly; security and everyday usability; risk surfaced clearly) | profile README, near-verbatim |
| Currently exploring (four items) | profile README, "Currently Exploring" |
| Skills: C, C++, Python, HTML (basics) | Sujith; the profile README lists the same languages |
| Skills: Linux (Debian), Git & GitHub, Tailscale, CasaOS | Sujith |
| Skills: Photoshop, CorelDRAW, Microsoft Office | Sujith; the profile README lists the same |
| Email, LinkedIn, GitHub | Sujith; the profile README lists the same LinkedIn and GitHub |
| Resume at `/Sujith_C_Resume.pdf` | existing file in `public/` |
| No phone number anywhere | Sujith (none is shown or stored) |

## Hackathons

| Fact | Source |
|---|---|
| Avinya 2.0, national level, team of 4, built Aether Health | Sujith |
| SIH 2026 college internal round, shortlisted, top 50 of 200 teams, team of 6 | Sujith |
| CryptoDrishti for SIH26164 | Sujith; CryptoDrishti README |
| SecureMailScope for SIH26159 | Sujith; SecureMailScope README |
| SurakshaScore built for SIH 2026 | Sujith |
| Both problem statements from NTRO | CryptoDrishti README ("SIH26164, National Technical Research Organisation"); SecureMailScope README ("Organisation: National Technical Research Organisation") |

## Projects

### CryptoDrishti (README)

- Team Zero-Day and SIH26164: README header.
- Seven scanners (source, dependencies, binaries, certificates, configuration,
  container images, live TLS): "What it discovers".
- Grouping, so 800 hits become one item with 800 locations; Mosca's
  inequality; NIST replacement; CycloneDX CBOM; offline console: "What I built".
- "Same algorithm, three answers" (`signing.py:15` ML-DSA-65,
  `transport.py:16` X25519MLKEM768, `nginx.conf:5` unresolved): README table.
- Mosca range 2030 / 2034 / 2044: `app/config.py` (`QDAY_EARLIEST`,
  `QDAY_LIKELY`, `QDAY_LATEST`). The README says these defaults live in config.
- Design decisions and trade-offs: "Engineering decisions and trade-offs".
- CI on Python 3.11, 3.12, 3.13 and schema-checked CBOM: "Continuous integration".
- Stack tags: "Tech stack".
- Limitations (Python-only deep analysis, ELF only, no KMS/HSM, not reviewed by
  a cryptographer): "Limitations, briefly" and "Known limitations".
- Demo video `youtu.be/ozoNwGR3Iq8`: README submission table.
- Screenshots: `submission/screenshots/04-inventory.png`, `01-assessment.png`,
  `03-migration-plan.png`.

### SurakshaScore (README)

- Five collectors, provenance tiers, rules engine, cap at 79, template
  explanations: "What I built" and "Architecture".
- Tier weights 1.00 / 0.90 / 0.75 / 0.60: README tier table.
- The example score of 94 is **made up** for the demo, and labelled so on screen.
- k-anonymity breach check (five-character hash prefix): "Engineering decisions".
- CI on Node 20 and 22; test that fails if the engine imports platform code: "Testing".
- Limitations (demo data on web, Android not wired, vault unencrypted demo,
  heuristic link checker): "Known limitations".
- Screenshots: `docs/images/01-posture.png`, `03-issues.png`, `04-improve.png`
  (the README notes these are the real UI over demo data).

### SecureMailScope (README)

- SIH26159, NTRO, Team Zero-Day: README header and credits.
- PCAP/PCAPNG by content, TCP reconstruction, SMTP/IMAP/POP3 and STARTTLS, TLS
  analysis, RFC 5280, versioned rules, JSON/HTML/PDF, local dashboard: "Overview"
  and the capability table.
- Seven demo captures with TLS version, findings and score, and the
  `100 × (37 − 15) / 37 = 59.5` arithmetic: README demo table and worked example.
- OBSERVED / INFERRED / UNKNOWN / NOT_AVAILABLE; weakest score, never an
  average; passive and local, loopback only; TShark cross-check: README.
- Limitations (TLS 1.3 certificate unreadable, no revocation, ML `NOT_VALIDATED`
  on synthetic data, memory-bound, not benchmarked on minimum hardware): "Known
  limitations" and "Performance".
- Screenshots: `submission/assets/screenshots-final/02-overview.png`,
  `03-findings.png`, `05-session.png`.
- Wording changed from the reference: "including to an AI model" was dropped,
  because the README does not say it.

### Aether Health (README, plus Sujith)

- Avinya 2.0, team of 4: Sujith (not in the README).
- Features, server-side Gemini key, two backends, no database, no OCR, leftover
  folder that does not build, CI type-checks and builds with no tests, not a
  medical device, UI says nothing is encrypted: README.
- Wording aligned to the README: "nutrition" (not "food") and "outbreak
  information" (not "local health alerts").
- Architecture diagram: README architecture section.
- Screenshots: `docs/images/home.png`, `health.png`, `reports.png`
  (placeholder demo data, per the README).

### Home lab (Sujith)

Debian 12, CasaOS, an old CPU, Jellyfin, file storage, a Minecraft server for
friends and family, Tailscale for private access, single machine with no backup
plan. No hardware details and no photos, at Sujith's request.

### SurakshaScore MVP (README)

Archived first prototype; guided checkup, playbooks, vault with PBKDF2-SHA256
and AES-GCM via Web Crypto, k-anonymity breach check; replaced by SurakshaScore.
Tags React, Vite and Supabase come from its "Tech stack".

## Still pending (optional, nothing blocks the site)

- Sujith to confirm the home lab services list (Jellyfin, file storage,
  Minecraft) is still accurate.
- Sujith's personal role in each team project (CryptoDrishti, SurakshaScore,
  SecureMailScope, Aether Health), if he wants it stated.

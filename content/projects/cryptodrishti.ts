import type { Project } from "@/lib/types";

/* Sources: github.com/sgtsujith141-wq/cryptodrishti README at commit
 * 90f4da3; the 2026-09-17 engineering report; the test suite re-run
 * locally on 2026-09-18 (226 passed). See CONTENT-SOURCES.md. */

const shots = "/projects/cryptodrishti";

export const cryptodrishti: Project = {
  slug: "cryptodrishti",
  index: "02",
  name: "CryptoDrishti",
  tagline: "Cryptographic discovery and quantum-risk analysis.",
  category: "Security tooling",
  status: "active",
  statusNote: "Built for Smart India Hackathon 2026, problem statement SIH26164 (NTRO). Presented at the internal round.",
  repo: "https://github.com/sgtsujith141-wq/cryptodrishti",
  stack: ["Python 3.11+", "FastAPI", "cryptography", "SQLite", "Vanilla JS", "pytest"],
  concepts: ["cryptography", "quantum-risk", "cbom", "static-analysis", "pqc"],
  accent: "cyan",
  visual: "crypto",

  problem: [
    "Post-quantum migration is mandated before anyone is ready for it. NIST has published the replacement algorithms and set deprecation milestones in IR 8547, but an organisation cannot migrate what it cannot enumerate.",
    "Cryptography is scattered across application source, transitive dependencies, compiled binaries, certificate stores, deployment configuration and live TLS endpoints. Under harvest-now-decrypt-later, data with a long confidentiality requirement is already exposed — the clock started when the traffic was recorded.",
  ],

  solution: [
    "A single-operator tool that finds every cryptographic artefact in a codebase and its infrastructure, scores each one for quantum exposure, recommends a NIST replacement for the deployment profile, and emits a CycloneDX 1.6 CBOM.",
    "It runs fully air-gapped: no outbound requests, no CDN assets, no telemetry. The only exception is the network sensor, which connects to exactly the endpoints you name.",
  ],

  howItWorks: [
    {
      title: "Six independent sensors",
      detail:
        "source (Python AST plus curated rule packs for Java, C/C++, Go, JS/TS, C#, Ruby and PHP), dependency manifests, ELF binaries, X.509 certificates, server configuration, and a live TLS probe. They read what is present rather than trusting a manifest.",
    },
    {
      title: "Normalise into assets",
      detail:
        "Raw hits merge into distinct cryptographic assets, so one algorithm seen 800 times is one migration item with 800 call sites. Evidence in tests/ is weighted 0.40×, vendored code 0.75×, so a fixture never outranks production.",
    },
    {
      title: "Score with Mosca's inequality",
      detail:
        "X + Y > Z: data lifetime plus migration time against years to a cryptographically relevant quantum computer. Z is not asserted. It is a triangular distribution over (earliest, likely, latest), reported as a probability alongside exposure at the median.",
    },
    {
      title: "Recommend and export",
      detail:
        "A recommender picks a concrete NIST target per deployment profile and quantifies the size penalty that breaks fixed-width protocol fields. Everything is exported as CycloneDX 1.6 with a structural validator, and rendered in an offline web console.",
    },
  ],

  architecture: {
    groups: [
      { id: "input", label: "Input" },
      { id: "sensors", label: "Six sensors · app/scanners/" },
      { id: "engine", label: "Analysis engine · app/engine/" },
      { id: "knowledge", label: "Knowledge" },
      { id: "output", label: "Output" },
    ],
    nodes: [
      { id: "target", label: "Target", detail: "Directory, binaries, certificates or a named endpoint.", group: "input" },
      { id: "source", label: "source", detail: "Python AST analysis resolves parameters such as key_size=1024. Nine other languages use regex rule packs, so their evidence is weaker.", group: "sensors" },
      { id: "deps", label: "dependency", detail: "Package manifests mapped to library crypto capability and PQC support. Capability, not proof of use.", group: "sensors" },
      { id: "binary", label: "binary", detail: "ELF symbol tables, cryptographic constants, version banners. Mach-O and PE fall back to raw strings.", group: "sensors" },
      { id: "certs", label: "certificate", detail: "X.509, PEM and DER, including private key material and PQC certificates. Parsed, not guessed.", group: "sensors" },
      { id: "config", label: "config", detail: "nginx, Apache, sshd, OpenSSL and Java security policy, as actually deployed.", group: "sensors" },
      { id: "network", label: "network", detail: "Live TLS probing including hybrid PQC group negotiation. Ground truth for what is negotiated with this client.", group: "sensors" },
      { id: "normalize", label: "normalize.py", detail: "Merges hits into distinct assets and weights by production, test and vendored paths. Does not merge across sensors, so corroboration survives.", group: "engine" },
      { id: "risk", label: "risk.py", detail: "Mosca X + Y > Z with a Q-Day distribution. Every score is a transparent product of named factors, each surfaced in the UI.", group: "engine" },
      { id: "recommend", label: "recommend.py", detail: "NIST target per deployment profile, plus the size delta. Never recommends a vulnerable algorithm as a replacement — pinned by tests.", group: "engine" },
      { id: "registry", label: "algorithms.py", detail: "The 52-algorithm registry. Every finding resolves to an entry here, which decides how it is classified, scored and remediated. The most heavily tested module.", group: "knowledge" },
      { id: "console", label: "Web console", detail: "Vanilla JavaScript with no build step, no framework and no CDN, because the target environment is air-gapped.", group: "output" },
      { id: "cbom", label: "cbom.py", detail: "CycloneDX 1.6 emitter and validator. The validator states plainly that it is a structural check, not full JSON-Schema validation.", group: "output" },
      { id: "report", label: "report.py", detail: "Migration programme grouped by replacement algorithm, because that is how a migration is staffed.", group: "output" },
      { id: "db", label: "SQLite", detail: "Local scan history. Single operator, no authentication, no migrations.", group: "output" },
    ],
    edges: [
      { from: "target", to: "source" },
      { from: "target", to: "deps" },
      { from: "target", to: "binary" },
      { from: "target", to: "certs" },
      { from: "target", to: "config" },
      { from: "target", to: "network" },
      { from: "source", to: "normalize" },
      { from: "deps", to: "normalize" },
      { from: "binary", to: "normalize" },
      { from: "certs", to: "normalize" },
      { from: "config", to: "normalize" },
      { from: "network", to: "normalize" },
      { from: "normalize", to: "risk" },
      { from: "risk", to: "recommend" },
      { from: "registry", to: "risk", label: "classifies" },
      { from: "registry", to: "recommend", label: "selects target" },
      { from: "recommend", to: "console" },
      { from: "recommend", to: "cbom" },
      { from: "recommend", to: "report" },
      { from: "recommend", to: "db" },
      { from: "db", to: "console" },
    ],
  },

  evidence: [
    { label: "Tests passing", value: "226", note: "7 suites, ~1.5s locally" },
    { label: "Algorithm registry", value: "52", note: "20 Shor-broken · 12 Grover-weakened · 18 quantum-safe · 1 hybrid · 1 unresolved" },
    { label: "CI matrix", value: "3.11 · 3.12 · 3.13", note: "plus a CBOM conformance smoke job" },
    { label: "Output standard", value: "CycloneDX 1.6", note: "structural validation in CI" },
  ],

  verification: [
    {
      claim: "226 tests pass",
      source: "tests/ at commit 90f4da3",
      date: "2026-09-18",
      method: "pytest run locally: 226 passed, 2 warnings in 1.51s",
    },
    {
      claim: "52 algorithms in the registry",
      source: "app/knowledge/algorithms.py",
      date: "2026-09-18",
      method: "Registry dictionary length read in Python",
    },
    {
      claim: "CI green on Python 3.11, 3.12 and 3.13, plus CBOM conformance",
      source: "GitHub Actions run for commit 90f4da3",
      date: "2026-09-18",
      method: "Latest workflow run conclusion read through the GitHub API",
    },
    {
      claim: "Real scan of paramiko @ 142f593: 70 files, 12 distinct assets, 8 quantum-vulnerable (66.7%) in 1.3s",
      source: "README and the 2026-09-17 engineering report",
      date: "2026-09-17",
      method: "CLI scan run by the report author; numbers change as paramiko changes",
    },
  ],

  decisions: [
    {
      title: "Q-Day is a distribution, not a date",
      body: "Every commercial tool in this space picks a year and scores against it. That is the easiest thing for a cryptographer to dismiss, because nobody knows. Z is modelled as a triangular distribution and reported as P(exposed) alongside the median.",
      tradeoff: "A probability is harder to put on a dashboard tile than “2030”, and it makes the tool look less certain than its competitors.",
    },
    {
      title: "The score is arithmetic, not a model",
      body: "A transparent product of named factors instead of anything fitted. A reviewer who can audit the arithmetic will trust the output.",
      tradeoff: "Less accurate than a model trained on real migration outcomes — but no such labelled dataset exists.",
    },
    {
      title: "Unresolved is a first-class class, ranked above quantum-safe",
      body: "When the scanner cannot statically resolve an algorithm it says so, and the recommender returns “manual review required”. Filing “we could not identify this” as good news is how scanners lose trust.",
      tradeoff: "The inventory shows more items needing a human than a tool that guesses.",
    },
    {
      title: "Zero front-end dependencies",
      body: "The console is vanilla JavaScript with no build step, framework or CDN. A tool aimed at an air-gapped environment cannot need npm at install time.",
      tradeoff: "app/web/app.js is 1,200 hand-written lines, and some of it would be shorter in React.",
    },
    {
      title: "Structural validation, honestly labelled",
      body: "Bundling the CycloneDX JSON schema would mean a network fetch or a vendored schema and a validation dependency, both of which conflict with running air-gapped. validate() does a thorough structural check and says exactly what it did and did not verify.",
      tradeoff: "Not full JSON-Schema conformance.",
    },
  ],

  limitations: [
    "Language coverage is uneven: full AST analysis is Python only; nine other languages use regex rule packs, so a Java finding is weaker evidence than a Python one.",
    "Binary analysis is ELF-only. Mach-O and PE binaries fall back to raw string scanning.",
    "RSA is modelled as key transport, not signing, so an RSA signature call site is recommended a KEM rather than ML-DSA. Pinned by a test so it cannot change silently.",
    "Dependency findings prove capability, not use.",
    "No authentication, no multi-user support, not packaged for distribution.",
    "Not independently audited. Classifications follow NIST IR 8547 and CycloneDX 1.6 as read by the author.",
  ],

  screenshots: [
    { src: `${shots}/console-dark.png`, alt: "CryptoDrishti web console in the dark theme showing a completed scan", width: 1600, height: 940, caption: "Console — completed scan of a real repository" },
    { src: `${shots}/assessment.png`, alt: "Assessment view showing estate composition and Mosca's inequality as arithmetic", width: 1600, height: 760, caption: "Assessment — Mosca's inequality shown as arithmetic, not a verdict" },
    { src: `${shots}/inventory.png`, alt: "Inventory table ranking every cryptographic asset with class, evidence and replacement", width: 1600, height: 600, caption: "Inventory — every asset ranked with evidence location and call-site count" },
    { src: `${shots}/remediation.png`, alt: "Remediation programme grouped by replacement algorithm", width: 1600, height: 540, caption: "Remediation — grouped by replacement algorithm, how a migration is staffed" },
    { src: `${shots}/exposure.png`, alt: "Exposure window controls for the Q-Day distribution", width: 1600, height: 700, caption: "Exposure model — drag the three Q-Day years and re-rank the estate" },
    { src: `${shots}/output.png`, alt: "CycloneDX 1.6 CBOM JSON output", width: 1600, height: 470, caption: "CBOM output — CycloneDX 1.6 with cryptoProperties and evidence" },
    { src: `${shots}/console-light.png`, alt: "CryptoDrishti web console in the light theme", width: 1600, height: 940, caption: "Console — light theme" },
    { src: `${shots}/picker.png`, alt: "Folder picker dialog for selecting a scan target", width: 900, height: 620, caption: "Folder picker" },
    { src: `${shots}/progress.png`, alt: "Live scan progress bar", width: 1100, height: 200, caption: "Live scan progress" },
  ],
};

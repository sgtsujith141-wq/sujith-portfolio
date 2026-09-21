import type { Project } from "@/lib/types";

/* Sources: github.com/sgtsujith141-wq/surakshascore-mvp README at commit
 * cc132f1; src/lib/cryptoVault.ts, src/lib/hibp.ts and
 * src/engine/AIAnalyzer.ts read on 2026-09-18; the 2026-09-17 report. */

/** The evolution story, stage by stage. Only repository-backed claims. */
export const evolution = [
  {
    id: "concept",
    label: "Early concept",
    title: "A guided security checkup",
    detail: "A staged scan across device, app, network and account signals, with each finding linked to a step-by-step remediation playbook rather than just a name. A habits questionnaire for what a scan cannot observe.",
    repo: "surakshascore-mvp",
  },
  {
    id: "prototype",
    label: "Prototype",
    title: "Four delivery targets, one codebase",
    detail: "Web, an Electron shell that adds a local TCP port scan, a Manifest V3 Chrome extension for link scanning, and Android through Capacitor. Supabase provided auth and Postgres without writing a backend. A client-side vault encrypts entries with PBKDF2-SHA256 at 100,000 iterations and AES-GCM through the Web Crypto API.",
    repo: "surakshascore-mvp",
  },
  {
    id: "lessons",
    label: "Lessons learned",
    title: "What the prototype could not show",
    detail: "Risk logic lived in per-domain analysers, so no single place defined how the overall number was produced — it could not be shown as a derivation or unit-tested as a whole. Supabase sat on the critical path: without credentials the app renders a configuration screen and nothing else. The AI analyser was a stub. There were no tests.",
    repo: "surakshascore-mvp",
  },
  {
    id: "rebuilt",
    label: "Rebuilt system",
    title: "SurakshaScore",
    detail: "A clean-room rebuild, not a fork. One pure scoring function with a published breakdown, a provenance tier on every data point, typed templates instead of a model, no backend at all, and 107 tests. The checkup, playbooks and k-anonymity breach check survived as product ideas.",
    repo: "surakshascore",
  },
] as const;

/** Side-by-side, straight from the MVP README. */
export const comparison = [
  { aspect: "Scoring", mvp: "Risk analysers per category", rebuilt: "Pure, deterministic scoring function with a published breakdown" },
  { aspect: "Data honesty", mvp: "Mixed", rebuilt: "Every data point carries a provenance tier" },
  { aspect: "Tests", mvp: "None", rebuilt: "107 unit tests" },
  { aspect: "Backend", mvp: "Supabase required", rebuilt: "No backend" },
  { aspect: "Vault", mvp: "Client-side encrypted (PBKDF2 + AES-GCM)", rebuilt: "Demo only, labelled unencrypted" },
] as const;

export const surakshascoreMvp: Project = {
  slug: "surakshascore-mvp",
  index: "05",
  name: "SurakshaScore MVP",
  tagline: "The prototype SurakshaScore grew out of, kept public as a record of where the idea started.",
  category: "Security & privacy — the predecessor",
  status: "archived",
  statusNote: "Feature work has stopped. Typecheck and production build pass; 206 pre-existing lint errors are recorded, not hidden.",
  repo: "https://github.com/sgtsujith141-wq/surakshascore-mvp",
  stack: ["React 18", "TypeScript", "Vite", "Supabase", "Capacitor", "Electron", "Web Crypto API"],
  concepts: ["cybersecurity", "privacy", "web-crypto", "k-anonymity"],
  accent: "slate",
  visual: "evolution",

  problem: [
    "The first attempt at a personal digital safety toolkit: prove that a guided checkup, remediation playbooks, a client-side encrypted vault and a breach check that never transmits the password could work in one app.",
  ],
  solution: [
    "It proved the product ideas. It also exposed the structural problems that drove the rewrite: scoring spread across analysers, a network dependency on the critical path of a security app, and no tests.",
  ],
  howItWorks: [
    { title: "Checkup and playbooks", detail: "Staged scan producing scored findings grouped by severity; each links to a remediation playbook." },
    { title: "Client-side vault", detail: "Master password stretched with PBKDF2-SHA256 at 100,000 iterations over a per-vault salt; entries encrypted with AES-GCM. Only ciphertext reaches Supabase." },
    { title: "Breach check", detail: "SHA-1 locally, first five hex characters to the Have I Been Pwned range endpoint, suffix matched in the browser." },
    { title: "A stub where the AI was going to be", detail: "AIAnalyzer returns a deterministic interpretation of rule-engine flags and reports INSUFFICIENT_EVIDENCE when given nothing. No model is connected." },
  ],

  evidence: [
    { label: "Typecheck · build", value: "Pass", note: "gating checks in CI" },
    { label: "Lint", value: "206 errors", note: "pre-existing, recorded, informational job" },
    { label: "Tests", value: "None", note: "the rewrite has 107" },
  ],

  verification: [
    { claim: "Vault uses PBKDF2-SHA256 at 100,000 iterations and AES-GCM via Web Crypto", source: "src/lib/cryptoVault.ts", date: "2026-09-18", method: "Read from source" },
    { claim: "Breach check sends only a 5-character SHA-1 prefix", source: "src/lib/hibp.ts", date: "2026-09-18", method: "Read from source" },
    { claim: "AI analyser is a stub returning INSUFFICIENT_EVIDENCE", source: "src/engine/AIAnalyzer.ts", date: "2026-09-18", method: "Read from source" },
    { claim: "Typecheck and build pass; lint reports 206 errors", source: "2026-09-17 engineering report and CI for commit cc132f1", date: "2026-09-18", method: "Report figures; latest CI run conclusion read through the GitHub API" },
  ],

  decisions: [
    {
      title: "Supabase for auth and persistence",
      body: "Working authentication, a Postgres schema and row-level security without writing a backend — the right call for proving a product idea quickly.",
      tradeoff: "It put a network dependency on the critical path of a security app. Without credentials there is no offline or local-only mode. The successor has no backend at all.",
    },
    {
      title: "Client-side encryption rather than server-side",
      body: "Compromising the database yields ciphertext only.",
      tradeoff: "A forgotten master password is unrecoverable by design, and there is no sharing or sync.",
    },
  ],

  limitations: [
    "Supabase credentials are required to render anything past the configuration screen, which is why there are no screenshots here rather than staged ones.",
    "Android native signals are partial: the network group returns UNSUPPORTED.",
    "GmailService requires an OAuth token no flow obtains, so the email-scanning path is unreachable.",
    "The port scanner works only in the Electron build.",
    "No test suite; 206 ESLint errors recorded and not fixed because effort belongs in the successor.",
  ],

  screenshots: [],
};

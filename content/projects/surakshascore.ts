import type { Project } from "@/lib/types";

/* Sources: github.com/sgtsujith141-wq/surakshascore README at commit
 * 34c70cc; src/core/config/scoringConfig.ts; the 2026-09-17 engineering
 * report; the test suite re-run locally on 2026-09-18 (107 passed). */

const shots = "/projects/surakshascore";

/** Evidence tiers and their weight factors, from the README and core types. */
export const evidenceTiers = [
  { tier: 1, name: "Hardware attested", how: "Secure enclave / KeyStore", weight: 1.0 },
  { tier: 2, name: "OS API verified", how: "Trusted operating-system API", weight: 0.9 },
  { tier: 3, name: "Heuristic", how: "Manifest inspection, static analysis, network probe", weight: 0.75 },
  { tier: 4, name: "Self-reported", how: "User questionnaire", weight: 0.6 },
] as const;

/** Category weights from src/core/config/scoringConfig.ts (sum to 1.0). */
export const scoringCategories = [
  { id: "account_security", label: "Account security", weight: 0.35, rules: ["No 2FA on primary account", "No password manager", "Password reuse"] },
  { id: "device_safety", label: "Device safety", weight: 0.2, rules: ["No screen lock", "Root / jailbreak", "Storage unencrypted", "Developer mode active", "Unknown sources enabled"] },
  { id: "phishing_fraud", label: "Phishing & fraud", weight: 0.2, rules: ["OTP sharing", "Unverified links", "Urgent-request compliance"] },
  { id: "privacy", label: "Privacy", weight: 0.1, rules: ["Excessive app permissions", "Public identity sharing"] },
  { id: "backup_recovery", label: "Backup & recovery", weight: 0.1, rules: ["No secure backup", "No recovery info"] },
  { id: "update_hygiene", label: "Update hygiene", weight: 0.05, rules: ["OS outdated", "Auto-updates disabled"] },
] as const;

export const criticalCeiling = 79;

export const surakshascore: Project = {
  slug: "surakshascore",
  index: "04",
  name: "SurakshaScore",
  tagline: "A personal digital hygiene scanner that turns device, account and privacy posture into one explainable security score.",
  category: "Security & privacy application",
  status: "active",
  statusNote: "Clean-room rebuild of the earlier MVP. Web demo runs standalone; Android build via Capacitor.",
  repo: "https://github.com/sgtsujith141-wq/surakshascore",
  stack: ["React 18", "TypeScript (strict)", "Vite 5", "Tailwind CSS 3", "Capacitor 7", "Vitest"],
  concepts: ["cybersecurity", "privacy", "security-posture", "explainable-scoring", "k-anonymity"],
  accent: "blue",
  visual: "signals",

  problem: [
    "Consumer security apps present a single score with no derivation, mix verified facts with guesses, and quietly default a field to “pass” when the platform will not tell them the answer.",
    "If an app cannot read your OS patch level — and on the web it genuinely cannot — it has three options: omit the category, guess, or ask you. Two of those produce a number that looks authoritative and is not.",
  ],

  solution: [
    "A scanner built around one rule: every displayed data point carries its provenance, and unavailable is a first-class outcome.",
    "Five collectors gather signals. Each signal is tagged with an evidence tier that carries a weight into the score. A rule engine evaluates 17 rules against them, a pure scoring function turns findings into a 0–100 score with a published breakdown, and explanations come from typed templates — no runtime LLM calls, so the app cannot invent a security claim.",
  ],

  howItWorks: [
    {
      title: "Signals carry their provenance",
      detail: "Signal<T> holds a value, an evidence tier and a status. A self-reported “yes, I have 2FA” is worth 0.60 of an OS-verified one. Both are shown, labelled and counted; neither is silently discarded or promoted.",
    },
    {
      title: "Seventeen rules, six categories",
      detail: "The rule engine evaluates rules against the signals and produces findings from a registry of 53 typed finding definitions. Category weights sum to exactly 1.0.",
    },
    {
      title: "A pure scoring function",
      detail: "Each category starts at 100 and takes severity-weighted deductions. Same signals in, same score out, always. An invariant caps the overall score at 79 while any critical finding is open.",
    },
    {
      title: "Completeness, stated",
      detail: "The completeness engine reports how much of the score rests on verified evidence, rather than presenting a partial score as a whole one.",
    },
  ],

  architecture: {
    groups: [
      { id: "platform", label: "Platform layer · src/lib/" },
      { id: "core", label: "Core engine · src/core/ — zero platform imports" },
      { id: "tools", label: "Security tools · src/lib/tools/" },
      { id: "ui", label: "React UI · src/screens/" },
    ],
    nodes: [
      { id: "device", label: "deviceCollector", detail: "Patch date, screen lock, developer options, unknown sources, storage encryption. Exposes a nativeBridge interface that Android still has to implement.", group: "platform", caveat: "Native bridge not yet wired" },
      { id: "apps", label: "appsCollector", detail: "Installed apps and permissions.", group: "platform" },
      { id: "network", label: "networkCollector", detail: "Connection type and network posture.", group: "platform" },
      { id: "account", label: "accountCollector", detail: "2FA, password manager and reuse signals.", group: "platform" },
      { id: "habits", label: "habitsCollector", detail: "Questionnaire for the behavioural side a scan cannot observe.", group: "platform" },
      { id: "capability", label: "capabilityDetector", detail: "Declares what this platform can actually answer, so unavailable is rendered rather than guessed.", group: "platform" },
      { id: "signal", label: "Signal<T>", detail: "Value + evidence tier + status. The tier cannot be dropped by the type system.", group: "core" },
      { id: "rules", label: "ruleEngine", detail: "17 rules across 6 categories.", group: "core" },
      { id: "registry", label: "findings registry", detail: "53 typed finding definitions.", group: "core" },
      { id: "scoring", label: "scoringEngine", detail: "Pure function. Weighted categories, severity penalties, critical-finding invariants.", group: "core" },
      { id: "completeness", label: "completenessEngine", detail: "How much of the score is real.", group: "core" },
      { id: "explain", label: "explanationEngine", detail: "Deterministic templates. No LLM.", group: "core" },
      { id: "hibp", label: "passwordLeakChecker", detail: "Have I Been Pwned range API with k-anonymity: SHA-1 locally, 5-character prefix sent, suffix matched client-side. Falls back to an offline list.", group: "tools" },
      { id: "breach", label: "breachMonitor", detail: "Breach monitoring surface.", group: "tools" },
      { id: "links", label: "linkScanner", detail: "Heuristic: typosquatting, punycode, raw-IP URLs. No reputation feed.", group: "tools" },
      { id: "screens", label: "13 screens", detail: "Every value shows its provenance badge. Web build reads from a demo signal provider and says so.", group: "ui" },
    ],
    edges: [
      { from: "device", to: "signal" },
      { from: "apps", to: "signal" },
      { from: "network", to: "signal" },
      { from: "account", to: "signal" },
      { from: "habits", to: "signal" },
      { from: "capability", to: "device", label: "declares limits" },
      { from: "capability", to: "completeness", label: "declares limits" },
      { from: "signal", to: "rules" },
      { from: "rules", to: "registry" },
      { from: "registry", to: "scoring" },
      { from: "scoring", to: "screens" },
      { from: "signal", to: "completeness" },
      { from: "completeness", to: "screens" },
      { from: "registry", to: "explain" },
      { from: "explain", to: "screens" },
      { from: "hibp", to: "screens" },
      { from: "breach", to: "screens" },
      { from: "links", to: "screens" },
    ],
  },

  evidence: [
    { label: "Tests passing", value: "107", note: "21 files, ~2.5s" },
    { label: "Rules · findings", value: "17 · 53", note: "6 categories, weights sum to 1.0" },
    { label: "CI matrix", value: "Node 20 · 22", note: "typecheck, tests, production build" },
    { label: "Critical ceiling", value: "79", note: "score cap while a critical finding is open" },
  ],

  verification: [
    { claim: "107 tests across 21 files pass", source: "tests/ at commit 34c70cc", date: "2026-09-18", method: "vitest run locally: 21 files, 107 tests passed in 2.50s" },
    { claim: "17 rules and 53 finding definitions", source: "src/core/rules/ and src/lib/findings/registry.ts", date: "2026-09-18", method: "Unique rule and finding ids counted with grep" },
    { claim: "Category weights 0.35 / 0.20 / 0.20 / 0.10 / 0.10 / 0.05 and the 79 ceiling", source: "src/core/config/scoringConfig.ts", date: "2026-09-18", method: "Read from the config file" },
    { claim: "Core isolation is enforced by a test", source: "tests/core/isolation.test.ts", date: "2026-09-18", method: "Test walks src/core and fails on React, Capacitor, lucide, Supabase, window, document, localStorage or navigator" },
    { claim: "CI green on Node 20 and 22", source: "GitHub Actions run for commit 34c70cc", date: "2026-09-18", method: "Latest workflow run conclusion read through the GitHub API" },
  ],

  decisions: [
    {
      title: "Provenance is a type, not a label",
      body: "Signal<T> carries its EvidenceTier through the whole pipeline, so a self-reported value cannot be displayed as verified — the type system does not allow the tier to be dropped.",
      tradeoff: "Every collector is more verbose than one that just returns a boolean.",
    },
    {
      title: "The core engine is platform-agnostic, and a test enforces it",
      body: "isolation.test.ts walks every file in src/core/ and fails if any imports React, Capacitor, lucide-react or Supabase, or touches window, document, localStorage or navigator. Architecture rules that are only written down get violated; this one breaks the build.",
      tradeoff: "None worth the name. It is also what lets 107 tests run in about two seconds without a DOM.",
    },
    {
      title: "Explanations come from typed templates, not an LLM",
      body: "A language model generating security advice at runtime can produce a confident, wrong, unbounded claim — and it cannot be unit-tested. Templates can.",
      tradeoff: "The copy is less fluent, and every new finding type needs a written template.",
    },
    {
      title: "Unavailable is a rendered state, not a default",
      body: "When the platform cannot answer, the UI says so and the completeness engine reduces the confidence of the whole score.",
      tradeoff: "The app looks less capable on the web than a competitor willing to guess.",
    },
    {
      title: "k-anonymity for the leak check, or no leak check",
      body: "Sending a password, or even its full hash, to a third party to ask whether it is safe is self-defeating. The 5-character prefix reveals membership of a bucket of hundreds of hashes and nothing more.",
      tradeoff: "A larger response to filter client-side.",
    },
  ],

  limitations: [
    "The browser scan runs on a mock signal provider: in the web build, signals come from selectable demo profiles, not from your machine. The pipeline, rules and scoring over those signals are real; the inputs are simulated. The screenshots here are the real UI over demo data.",
    "The Android collectors are not fully wired to native plugins, so Tier 1 and Tier 2 paths are currently exercised only by tests.",
    "The vault is a UI demonstration and says so: entries are in React state, not encrypted, not persisted, cleared on reload. The only crypto.subtle call in the codebase is the SHA-1 digest for the k-anonymity check.",
    "The link scanner is heuristic and will miss novel phishing.",
    "No persistence, no accounts, no sync. Not independently audited.",
  ],

  screenshots: [
    { src: `${shots}/01-posture.png`, alt: "SurakshaScore posture screen showing the overall score and category breakdown", width: 522, height: 1120, caption: "Posture — the score with its published breakdown" },
    { src: `${shots}/02-scan.png`, alt: "Staged scan screen with live per-vector progress", width: 522, height: 1120, caption: "Staged scan across six categories" },
    { src: `${shots}/03-issues.png`, alt: "Issues screen listing findings by severity with provenance badges", width: 522, height: 1120, caption: "Issues — findings with provenance badges" },
    { src: `${shots}/04-improve.png`, alt: "Improve screen with remediation steps", width: 522, height: 1120, caption: "Improve — remediation per finding" },
    { src: `${shots}/06-tools.png`, alt: "Security tools screen with the k-anonymity leak check and link scanner", width: 522, height: 1120, caption: "Tools — k-anonymity leak check, link scanner" },
    { src: `${shots}/05-you.png`, alt: "Profile screen", width: 522, height: 1120, caption: "Profile" },
  ],
};

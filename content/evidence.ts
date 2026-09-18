import type { EvidenceSnapshot } from "@/lib/types";

/* ══════════════════════════════════════════════════════════════════════
 *  ENGINEERING EVIDENCE — verified snapshots, never live counters.
 *
 *  Each item states what was checked, how, and on which day. The
 *  section renders the date beside every number. When a figure ages,
 *  re-run the method and update `verifiedOn`; do not edit the value
 *  without doing so.
 * ══════════════════════════════════════════════════════════════════════ */

export const VERIFIED_ON = "2026-09-18";
export const REPORT_DATE = "2026-09-17";

export const snapshots: EvidenceSnapshot[] = [
  {
    id: "cd-tests",
    project: "cryptodrishti",
    label: "Tests passing",
    value: "226",
    detail: "Seven suites: knowledge 38, risk 30, recommend 77, normalize 28, cbom 17, scan end-to-end 21, api 15.",
    verifiedOn: VERIFIED_ON,
    method: "pytest run locally at commit 90f4da3 — 226 passed in 1.51s",
  },
  {
    id: "cd-ci",
    project: "cryptodrishti",
    label: "CI",
    value: "Green",
    detail: "Python 3.11, 3.12 and 3.13, then a smoke job that scans the repository, emits a CBOM and fails if it does not conform to CycloneDX 1.6.",
    verifiedOn: VERIFIED_ON,
    method: "Latest GitHub Actions run for 90f4da3 read through the API: success",
  },
  {
    id: "cd-cbom",
    project: "cryptodrishti",
    label: "CBOM validation",
    value: "CycloneDX 1.6",
    detail: "CLI scan of app/ produced a CBOM that passed structural validation; the CI smoke job was checked against a deliberately corrupted document and failed correctly.",
    verifiedOn: REPORT_DATE,
    method: "2026-09-17 engineering report",
  },
  {
    id: "ss-tests",
    project: "surakshascore",
    label: "Tests passing",
    value: "107",
    detail: "21 files: scoring engine and invariants, 19 rule tests, rule engine, completeness, explanations, core isolation, all five collectors, tools, pipeline, registry and demo profiles.",
    verifiedOn: VERIFIED_ON,
    method: "vitest run locally at commit 34c70cc — 107 passed in 2.50s",
  },
  {
    id: "ss-isolation",
    project: "surakshascore",
    label: "Architecture rule enforced by a test",
    value: "src/core",
    detail: "The isolation test walks every file in the core engine and fails the build if any imports React, Capacitor, lucide-react or Supabase, or touches window, document, localStorage or navigator.",
    verifiedOn: VERIFIED_ON,
    method: "tests/core/isolation.test.ts read from source",
  },
  {
    id: "ss-ci",
    project: "surakshascore",
    label: "CI",
    value: "Green",
    detail: "Typecheck, tests and a production build on Node 20 and 22.",
    verifiedOn: VERIFIED_ON,
    method: "Latest GitHub Actions run for 34c70cc read through the API: success",
  },
  {
    id: "mvp-status",
    project: "surakshascore-mvp",
    label: "Typecheck · build",
    value: "Pass",
    detail: "Lint reports 206 pre-existing errors in a separate informational job that is expected to fail; the rules were not relaxed to produce a green badge.",
    verifiedOn: VERIFIED_ON,
    method: "Latest GitHub Actions run for cc132f1 read through the API: success; figures from the 2026-09-17 report",
  },
  {
    id: "ah-build",
    project: "aether-health",
    label: "Client · server build",
    value: "Pass",
    detail: "Client typecheck 0 errors and a 2,782-module build; server typecheck 0 errors. No CI job calls Gemini, so CI verifies compilation only.",
    verifiedOn: VERIFIED_ON,
    method: "Latest GitHub Actions run for 65533a3 read through the API: success; figures from the 2026-09-17 report",
  },
];

/** What CI actually runs, per repository, read from each .github/workflows/ci.yml. */
export const ciMatrix = [
  { project: "cryptodrishti", commit: "90f4da3", jobs: ["pytest on Python 3.11", "pytest on Python 3.12", "pytest on Python 3.13", "CLI scan + CycloneDX 1.6 conformance"], conclusion: "success" },
  { project: "surakshascore", commit: "34c70cc", jobs: ["typecheck · test · build on Node 20", "typecheck · test · build on Node 22"], conclusion: "success" },
  { project: "surakshascore-mvp", commit: "cc132f1", jobs: ["typecheck · build", "lint (informational, 206 known errors)"], conclusion: "success" },
  { project: "aether-health", commit: "65533a3", jobs: ["client typecheck · build on Node 20", "server typecheck · build on Node 20"], conclusion: "success" },
] as const;

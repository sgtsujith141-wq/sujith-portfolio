/* ══════════════════════════════════════════════════════════════════════
 *  CONTENT TYPES
 *
 *  Every piece of copy on the site is typed here and lives under
 *  content/. Components never hold facts. A field that carries a claim
 *  about a repository also carries where that claim came from, so the
 *  Engineering Evidence section can print its source and date.
 * ══════════════════════════════════════════════════════════════════════ */

export type SectionId =
  | "introduction"
  | "work"
  | "evidence"
  | "about"
  | "exploration"
  | "connect";

export interface NavSection {
  id: SectionId;
  /** Two-digit index rendered beside the label: "01". */
  index: string;
  label: string;
  /** Very short form for the mobile bar. */
  short: string;
}

export type ProjectSlug =
  | "cryptodrishti"
  | "surakshascore"
  | "surakshascore-mvp"
  | "aether-health";

export interface Screenshot {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption: string;
}

/** A fact with provenance. `date` is the day it was checked. */
export interface Verification {
  claim: string;
  source: string;
  date: string;
  method: string;
}

export interface Metric {
  label: string;
  value: string;
  note?: string;
}

export interface Step {
  title: string;
  detail: string;
}

export interface Decision {
  title: string;
  body: string;
  tradeoff: string;
}

export interface ArchGroup {
  id: string;
  label: string;
}

export interface ArchNode {
  id: string;
  label: string;
  detail: string;
  group: string;
  /** Marks a component the repository itself documents as a known gap. */
  caveat?: string;
}

export interface ArchEdge {
  from: string;
  to: string;
  label?: string;
}

export interface Architecture {
  groups: ArchGroup[];
  nodes: ArchNode[];
  edges: ArchEdge[];
}

export type ProjectStatus = "active" | "prototype" | "archived";

export interface Project {
  slug: ProjectSlug;
  index: string;
  name: string;
  tagline: string;
  category: string;
  status: ProjectStatus;
  statusNote: string;
  repo: string;
  /** Short list for the header. */
  stack: string[];
  /** Concept ids in content/graph.ts that this project lights up. */
  concepts: string[];
  problem: string[];
  solution: string[];
  howItWorks: Step[];
  architecture?: Architecture;
  evidence: Metric[];
  verification: Verification[];
  decisions: Decision[];
  limitations: string[];
  screenshots: Screenshot[];
  /** Colour family used for this project's world. */
  accent: "blue" | "cyan" | "violet" | "slate";
}

export interface EvidenceSnapshot {
  id: string;
  project: ProjectSlug;
  label: string;
  value: string;
  detail: string;
  verifiedOn: string;
  method: string;
}

export interface AboutBlock {
  id: string;
  title: string;
  body: string[];
}

export interface ExplorationTheme {
  id: string;
  title: string;
  status: "active" | "planned";
  detail: string;
  threads: string[];
}

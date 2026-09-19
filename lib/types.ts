/* ══════════════════════════════════════════════════════════════════════
 *  CONTENT TYPES
 *
 *  Every piece of copy on the site is typed here and lives under
 *  content/. Components never hold facts. A field that carries a claim
 *  about a repository also carries where that claim came from, so the
 *  Engineering Evidence section can print its source and date.
 * ══════════════════════════════════════════════════════════════════════ */

/** Home-page sections. Work now lives on its own route. */
export type SectionId =
  | "introduction"
  | "about"
  | "network"
  | "homelab"
  | "exploring"
  | "work"
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
  | "home-lab"
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

export type ProjectStatus = "active" | "running" | "prototype" | "archived";

export interface Project {
  slug: ProjectSlug;
  index: string;
  name: string;
  tagline: string;
  category: string;
  status: ProjectStatus;
  statusNote: string;
  /** Absent for work that has no public repository, such as the home lab. */
  repo?: string;
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
  accent: "blue" | "cyan" | "violet" | "slate" | "green";
  /** Optional custom visual rendered in the case study, by key. */
  visual?: "crypto" | "signals" | "evolution" | "aether" | "topology";
}

/* ── Personal identity ─────────────────────────────────────────────── */

/** One domain in the personal network: a thing Sujith actually explores. */
export interface Domain {
  id: DomainId;
  label: string;
  /** One line, shown on the node when focused. */
  summary: string;
  /** What this means to him, in his own register. */
  body: string;
  /** Concrete, verifiable places this shows up. */
  evidence: string[];
  /** Project slugs this domain genuinely connects to. */
  projects: ProjectSlug[];
  /** Home-lab service ids this domain genuinely connects to. */
  services: string[];
  accent: "blue" | "cyan" | "violet" | "green" | "slate";
}

export type DomainId =
  | "networking"
  | "cybersecurity"
  | "systems"
  | "linux"
  | "infrastructure"
  | "ai"
  | "software";

/** A skill with an honest level. No percentages, no bars. */
export interface SkillGroup {
  id: string;
  title: string;
  level: string;
  note: string;
  items: string[];
}

/* ── Home lab ──────────────────────────────────────────────────────── */

export type ServiceKind = "edge" | "overlay" | "host" | "platform" | "service";

export interface LabService {
  id: string;
  label: string;
  tag: string;
  kind: ServiceKind;
  /** Layer index, 0 at the top of the topology. */
  layer: number;
  /** Horizontal position inside the layer, 0–1. */
  x: number;
  /** Parent id; edges are derived from this. */
  parent?: string;
  what: string;
  purpose: string;
  /** What he actually did, in his own words. */
  configured: string[];
  /** What running it taught him. */
  learned: string;
  /** Domains this service demonstrates. */
  domains: DomainId[];
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

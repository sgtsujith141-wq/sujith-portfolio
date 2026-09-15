/* Shared content types. Every data/*.ts file is typed against these, so the
 * editor catches a malformed entry before the page ever renders it. */

export type ProjectStatus = "shipped" | "active" | "prototype" | "archived" | "planned";

export interface ProjectImage {
  /** Path under /public, e.g. "/projects/case-001/overview.png" */
  src: string;
  alt: string;
  /** Optional caption shown under the frame inside the case file. */
  caption?: string;
}

export interface ArchitectureNode {
  label: string;
  detail: string;
}

export interface Project {
  /** URL-safe key. Also used for deep links (#case-001 style anchors). */
  slug: string;
  /** Rendered as CASE-001. Keep it two-to-three digits. */
  caseId: string;
  name: string;
  category: string;
  /** One line. Shown in the index row. Keep under ~90 characters. */
  summary: string;
  stack: string[];
  status: ProjectStatus;
  year?: string;
  links: {
    github?: string;
    live?: string;
  };
  images: ProjectImage[];
  /** Long-form case file body. Each field renders as its own dossier block. */
  overview: string;
  problem: string;
  implementation: string;
  architecture: ArchitectureNode[];
  technologies: string[];
  learnings: string[];
  /** Marks the starred entry (Systems Lab). Only one should be true. */
  starred?: boolean;
  /** Renders a bespoke case-file body instead of the standard dossier —
   *  currently only the Systems Lab topology. */
  dossier?: "systems-lab";
  /** Set false while details are still placeholder text. */
  complete: boolean;
}

export interface TopologyNode {
  id: string;
  label: string;
  /** Short mono tag under the label inside the diagram. */
  tag: string;
  /** Layout row in the topology, 0 = top. */
  row: number;
  /** Horizontal position 0..1 within its row. */
  x: number;
  parent?: string;
  kind: "edge" | "overlay" | "host" | "platform" | "service";
  what: string;
  configured: string[];
  purpose: string;
  learned: string;
}

export interface CapabilityGroup {
  id: string;
  title: string;
  /** Honest qualifier: "Fundamentals", "Hands on", "Working knowledge". */
  level: string;
  note: string;
  items: string[];
}

export interface ExplorationTrack {
  id: string;
  title: string;
  status: "active" | "queued";
  detail: string;
  focus: string[];
}

/** Future CTF writeups / lab notes / experiments / tools drop in here. */
export type LogKind = "writeup" | "lab" | "experiment" | "tool" | "note";

export interface LogEntry {
  id: string;
  kind: LogKind;
  title: string;
  date: string;
  summary: string;
  href?: string;
  tags?: string[];
}

export interface Hackathon {
  id: string;
  name: string;
  scale: string;
  date?: string;
  location?: string;
  role?: string;
  detail: string;
  /** Only facts. No placements, awards or judging results. */
  facts: string[];
}

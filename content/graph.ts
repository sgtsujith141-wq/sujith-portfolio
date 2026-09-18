import type { ProjectSlug, SectionId } from "@/lib/types";

/* ══════════════════════════════════════════════════════════════════════
 *  THE LIVING SYSTEM GRAPH
 *
 *  The background is not decoration: its labelled nodes are the actual
 *  entities of the work — Sujith, the four repositories, the technologies
 *  they use, the concepts they connect to and the evidence behind them.
 *  Edges are real relationships read from the repositories. Nothing here
 *  simulates live activity; the signals that travel along edges are a
 *  visual metaphor and are labelled as such in the documentation.
 * ══════════════════════════════════════════════════════════════════════ */

export type GraphKind = "root" | "project" | "tech" | "concept" | "evidence";

export interface GraphNode {
  id: string;
  label: string;
  kind: GraphKind;
  /** Which project cluster this node belongs to; "core" for shared. */
  cluster: ProjectSlug | "core";
  /** Relative visual weight 0.4–1. Drives radius and label priority. */
  weight: number;
}

export interface GraphEdge {
  from: string;
  to: string;
}

const N = (
  id: string,
  label: string,
  kind: GraphKind,
  cluster: GraphNode["cluster"],
  weight = 0.6,
): GraphNode => ({ id, label, kind, cluster, weight });

export const graphNodes: GraphNode[] = [
  N("sujith", "SUJITH C", "root", "core", 1),

  // Projects
  N("cryptodrishti", "CryptoDrishti", "project", "cryptodrishti", 0.95),
  N("surakshascore", "SurakshaScore", "project", "surakshascore", 0.95),
  N("surakshascore-mvp", "SurakshaScore MVP", "project", "surakshascore-mvp", 0.7),
  N("aether-health", "Aether Health", "project", "aether-health", 0.85),

  // Concepts
  N("cryptography", "Cryptography", "concept", "cryptodrishti", 0.7),
  N("quantum-risk", "Quantum risk", "concept", "cryptodrishti", 0.7),
  N("cbom", "CBOM validation", "concept", "cryptodrishti", 0.65),
  N("static-analysis", "Static analysis", "concept", "cryptodrishti", 0.55),
  N("pqc", "Post-quantum", "concept", "cryptodrishti", 0.6),
  N("cybersecurity", "Cybersecurity", "concept", "core", 0.8),
  N("privacy", "Privacy", "concept", "surakshascore", 0.65),
  N("security-posture", "Security posture", "concept", "surakshascore", 0.65),
  N("explainable-scoring", "Explainable scoring", "concept", "surakshascore", 0.7),
  N("k-anonymity", "k-anonymity", "concept", "surakshascore", 0.55),
  N("web-crypto", "Web Crypto", "concept", "surakshascore-mvp", 0.5),
  N("ai", "AI", "concept", "core", 0.8),
  N("health", "Health", "concept", "aether-health", 0.55),
  N("product", "Product", "concept", "aether-health", 0.5),
  N("systems", "Systems", "concept", "core", 0.7),

  // Technologies
  N("python", "Python", "tech", "cryptodrishti", 0.6),
  N("fastapi", "FastAPI", "tech", "cryptodrishti", 0.5),
  N("sqlite", "SQLite", "tech", "cryptodrishti", 0.4),
  N("cyclonedx", "CycloneDX 1.6", "tech", "cryptodrishti", 0.55),
  N("typescript", "TypeScript", "tech", "core", 0.65),
  N("react", "React", "tech", "core", 0.6),
  N("vite", "Vite", "tech", "surakshascore", 0.45),
  N("capacitor", "Capacitor", "tech", "surakshascore", 0.45),
  N("vitest", "Vitest", "tech", "surakshascore", 0.45),
  N("supabase", "Supabase", "tech", "surakshascore-mvp", 0.45),
  N("electron", "Electron", "tech", "surakshascore-mvp", 0.4),
  N("express", "Express", "tech", "aether-health", 0.5),
  N("gemini", "Gemini API", "tech", "aether-health", 0.5),
  N("zustand", "Zustand", "tech", "aether-health", 0.4),
  N("debian", "Debian 12", "tech", "core", 0.5),
  N("tailscale", "Tailscale", "tech", "core", 0.45),

  // Evidence
  N("ev-226", "226 tests", "evidence", "cryptodrishti", 0.6),
  N("ev-ci-py", "CI 3.11–3.13", "evidence", "cryptodrishti", 0.5),
  N("ev-107", "107 tests", "evidence", "surakshascore", 0.6),
  N("ev-isolation", "Isolation test", "evidence", "surakshascore", 0.5),
  N("ev-build", "Client + server build", "evidence", "aether-health", 0.45),
  N("ev-typecheck", "Typecheck pass", "evidence", "surakshascore-mvp", 0.4),
];

const E = (from: string, to: string): GraphEdge => ({ from, to });

export const graphEdges: GraphEdge[] = [
  // Sujith → projects and shared concepts
  E("sujith", "cryptodrishti"),
  E("sujith", "surakshascore"),
  E("sujith", "aether-health"),
  E("sujith", "surakshascore-mvp"),
  E("sujith", "cybersecurity"),
  E("sujith", "ai"),
  E("sujith", "systems"),

  // CryptoDrishti
  E("cryptodrishti", "cryptography"),
  E("cryptodrishti", "quantum-risk"),
  E("cryptodrishti", "cbom"),
  E("cryptodrishti", "static-analysis"),
  E("cryptodrishti", "pqc"),
  E("cryptodrishti", "python"),
  E("cryptodrishti", "fastapi"),
  E("cryptodrishti", "sqlite"),
  E("cryptodrishti", "cyclonedx"),
  E("cryptodrishti", "ev-226"),
  E("cryptodrishti", "ev-ci-py"),
  E("cbom", "cyclonedx"),
  E("quantum-risk", "pqc"),
  E("cryptography", "cybersecurity"),

  // SurakshaScore
  E("surakshascore", "cybersecurity"),
  E("surakshascore", "privacy"),
  E("surakshascore", "security-posture"),
  E("surakshascore", "explainable-scoring"),
  E("surakshascore", "k-anonymity"),
  E("surakshascore", "typescript"),
  E("surakshascore", "react"),
  E("surakshascore", "vite"),
  E("surakshascore", "capacitor"),
  E("surakshascore", "vitest"),
  E("surakshascore", "ev-107"),
  E("surakshascore", "ev-isolation"),

  // MVP → SurakshaScore lineage
  E("surakshascore-mvp", "surakshascore"),
  E("surakshascore-mvp", "web-crypto"),
  E("surakshascore-mvp", "supabase"),
  E("surakshascore-mvp", "electron"),
  E("surakshascore-mvp", "k-anonymity"),
  E("surakshascore-mvp", "typescript"),
  E("surakshascore-mvp", "ev-typecheck"),

  // Aether Health
  E("aether-health", "ai"),
  E("aether-health", "health"),
  E("aether-health", "product"),
  E("aether-health", "react"),
  E("aether-health", "typescript"),
  E("aether-health", "express"),
  E("aether-health", "gemini"),
  E("aether-health", "zustand"),
  E("aether-health", "ev-build"),

  // Systems
  E("systems", "debian"),
  E("debian", "tailscale"),
];

/** Which cluster each section brings forward. */
export const sectionFocus: Record<SectionId, GraphNode["cluster"] | null> = {
  introduction: null,
  work: null,
  evidence: null,
  about: "core",
  exploration: null,
  connect: null,
};

export const graphNodeById = Object.fromEntries(graphNodes.map((n) => [n.id, n])) as Record<
  string,
  GraphNode
>;

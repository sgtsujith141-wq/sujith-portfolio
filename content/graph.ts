import { interests } from "./personal";
import { services } from "./homelab";
import type { ProjectSlug } from "@/lib/types";

/* ══════════════════════════════════════════════════════════════════════
 *  THE LIVING SYSTEM GRAPH
 *
 *  The background is not decoration: its nodes are the actual entities of
 *  Sujith's technical world — himself, the domains he explores, the
 *  services running in his home lab, his projects, and the evidence
 *  behind them. Edges are real relationships, derived from the same
 *  content the page renders.
 *
 *  Two grouping axes let a formation organise the field either way:
 *    `domain`  — which interest this node belongs to
 *    `project` — which repository (or the lab) this node belongs to
 *
 *  Signals travelling along edges are a visual metaphor. Nothing here
 *  simulates live activity, and the documentation says so.
 * ══════════════════════════════════════════════════════════════════════ */

export type GraphKind = "root" | "domain" | "service" | "project" | "tech" | "evidence";

export interface GraphNode {
  id: string;
  label: string;
  kind: GraphKind;
  domain: string | null;
  project: ProjectSlug | null;
  /** Relative visual weight 0.35–1. Drives radius and label priority. */
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
  domain: string | null,
  project: ProjectSlug | null,
  weight = 0.55,
): GraphNode => ({ id, label, kind, domain, project, weight });

/* ── Nodes ─────────────────────────────────────────────────────────── */

const rootNode: GraphNode = N("sujith", "SUJITH C", "root", null, null, 1);

/** The seven things he enjoys, straight from content/personal.ts. */
const domainNodes: GraphNode[] = interests.map((d) =>
  N(d.id, d.label, "domain", d.id, null, 0.88),
);

/** Every home-lab service, prefixed so ids never collide with a domain. */
const serviceNodes: GraphNode[] = services.map((s) =>
  N(
    `svc-${s.id}`,
    s.label,
    "service",
    s.domains[0] ?? "servers",
    "home-lab",
    s.kind === "host" || s.kind === "platform" ? 0.72 : 0.6,
  ),
);

const projectNodes: GraphNode[] = [
  N("p-phantom-hq", "Phantom HQ", "project", "ai", "phantom-hq", 0.9),
  N("p-home-lab", "Home Lab", "project", "servers", "home-lab", 0.92),
  N("p-cryptodrishti", "CryptoDrishti", "project", "cybersecurity", "cryptodrishti", 0.92),
  N("p-surakshascore", "SurakshaScore", "project", "cybersecurity", "surakshascore", 0.92),
  N("p-surakshascore-mvp", "SurakshaScore MVP", "project", "cybersecurity", "surakshascore-mvp", 0.68),
  N("p-aether-health", "Aether Health", "project", "ai", "aether-health", 0.82),
];

/** Technologies, attached to the project that actually uses them. */
const techNodes: GraphNode[] = [
  N("t-wireguard", "WireGuard", "tech", "networking", "home-lab", 0.5),
  N("t-nat", "Addressing", "tech", "networking", "home-lab", 0.45),
  N("t-terminal", "Terminal", "tech", "operating-systems", "home-lab", 0.45),
  N("t-permissions", "Permissions", "tech", "operating-systems", "home-lab", 0.42),
  N("t-containers", "Containers", "tech", "servers", "home-lab", 0.45),
  N("t-python", "Python", "tech", "ai", "cryptodrishti", 0.55),
  N("t-fastapi", "FastAPI", "tech", "ai", "cryptodrishti", 0.42),
  N("t-cyclonedx", "CycloneDX 1.6", "tech", "cybersecurity", "cryptodrishti", 0.48),
  N("t-typescript", "TypeScript", "tech", "ai", "surakshascore", 0.52),
  N("t-react", "React", "tech", "ai", "surakshascore", 0.45),
  N("t-kanon", "k-anonymity", "tech", "cybersecurity", "surakshascore", 0.45),
  N("t-webcrypto", "Web Crypto", "tech", "cybersecurity", "surakshascore-mvp", 0.42),
  N("t-express", "Express", "tech", "ai", "aether-health", 0.42),
  N("t-gemini", "Gemini API", "tech", "ai", "aether-health", 0.45),
];

const evidenceNodes: GraphNode[] = [
  N("e-226", "226 tests", "evidence", "cybersecurity", "cryptodrishti", 0.55),
  N("e-ci-py", "CI 3.11–3.13", "evidence", "cybersecurity", "cryptodrishti", 0.45),
  N("e-107", "107 tests", "evidence", "cybersecurity", "surakshascore", 0.55),
  N("e-isolation", "Isolation test", "evidence", "cybersecurity", "surakshascore", 0.45),
  N("e-build", "Client + server build", "evidence", "ai", "aether-health", 0.42),
  N("e-typecheck", "Typecheck pass", "evidence", "cybersecurity", "surakshascore-mvp", 0.4),
  N("e-uptime", "4 services, 1 node", "evidence", "servers", "home-lab", 0.45),
];

export const graphNodes: GraphNode[] = [
  rootNode,
  ...domainNodes,
  ...projectNodes,
  ...serviceNodes,
  ...techNodes,
  ...evidenceNodes,
];

/* ── Edges ─────────────────────────────────────────────────────────── */

const E = (from: string, to: string): GraphEdge => ({ from, to });

const edges: GraphEdge[] = [
  // Sujith sits at the centre of the things he enjoys.
  ...interests.map((d) => E("sujith", d.id)),

  // An interest reaches whatever carries its tag. Derived, so nothing
  // here can claim a connection the content does not already state.
  ...graphNodes
    .filter((n) => n.domain && n.kind !== "domain" && n.kind !== "root")
    .map((n) => E(n.domain as string, n.id)),

  // The lab's own topology, parent by parent.
  ...services.filter((s) => s.parent).map((s) => E(`svc-${s.parent}`, `svc-${s.id}`)),
  E("p-home-lab", "svc-debian"),

  // Technologies and evidence hang off their project.
  ...techNodes.filter((t) => t.project).map((t) => E(`p-${t.project}`, t.id)),
  ...evidenceNodes.filter((n) => n.project).map((n) => E(`p-${n.project}`, n.id)),

  // The rebuild lineage.
  E("p-surakshascore-mvp", "p-surakshascore"),

  // A few cross-links that keep the field woven.
  E("networking", "cybersecurity"),
  E("operating-systems", "systems"),
  E("servers", "operating-systems"),
  E("tinkering", "systems"),
  E("ai", "tinkering"),
];

/** Deduplicated, and with any edge pointing at a missing node dropped. */
export const graphEdges: GraphEdge[] = (() => {
  const ids = new Set(graphNodes.map((n) => n.id));
  const seen = new Set<string>();
  const out: GraphEdge[] = [];
  for (const e of edges) {
    if (!ids.has(e.from) || !ids.has(e.to) || e.from === e.to) continue;
    const key = e.from < e.to ? `${e.from}|${e.to}` : `${e.to}|${e.from}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(e);
  }
  return out;
})();

export const graphNodeById = Object.fromEntries(graphNodes.map((n) => [n.id, n])) as Record<
  string,
  GraphNode
>;

/** Node ids belonging to one interest, including what it connects to. */
export function domainSubgraph(id: string): Set<string> {
  const out = new Set<string>([id]);
  for (const e of graphEdges) {
    if (e.from === id) out.add(e.to);
    if (e.to === id) out.add(e.from);
  }
  out.delete("sujith");
  return out;
}

export const domainIds: string[] = interests.map((d) => d.id);

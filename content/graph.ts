import { domains } from "./identity";
import { services } from "./homelab";
import type { DomainId, ProjectSlug } from "@/lib/types";

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
  domain: DomainId | null;
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
  domain: DomainId | null,
  project: ProjectSlug | null,
  weight = 0.55,
): GraphNode => ({ id, label, kind, domain, project, weight });

/* ── Nodes ─────────────────────────────────────────────────────────── */

const rootNode: GraphNode = N("sujith", "SUJITH C", "root", null, null, 1);

/** The seven domains, straight from the identity model. */
const domainNodes: GraphNode[] = domains.map((d) =>
  N(d.id, d.label, "domain", d.id, null, 0.88),
);

/** Every home-lab service, prefixed so ids never collide with a domain. */
const serviceNodes: GraphNode[] = services.map((s) =>
  N(
    `svc-${s.id}`,
    s.label,
    "service",
    s.domains[0] ?? "infrastructure",
    "home-lab",
    s.kind === "host" || s.kind === "platform" ? 0.72 : 0.6,
  ),
);

const projectNodes: GraphNode[] = [
  N("p-home-lab", "Home Lab", "project", "infrastructure", "home-lab", 0.92),
  N("p-cryptodrishti", "CryptoDrishti", "project", "software", "cryptodrishti", 0.92),
  N("p-surakshascore", "SurakshaScore", "project", "cybersecurity", "surakshascore", 0.92),
  N("p-surakshascore-mvp", "SurakshaScore MVP", "project", "cybersecurity", "surakshascore-mvp", 0.68),
  N("p-aether-health", "Aether Health", "project", "ai", "aether-health", 0.82),
];

/** Technologies, attached to the project that actually uses them. */
const techNodes: GraphNode[] = [
  N("t-wireguard", "WireGuard", "tech", "networking", "home-lab", 0.5),
  N("t-nat", "NAT & addressing", "tech", "networking", "home-lab", 0.45),
  N("t-terminal", "Terminal", "tech", "linux", "home-lab", 0.45),
  N("t-permissions", "Permissions", "tech", "linux", "home-lab", 0.42),
  N("t-containers", "Containers", "tech", "infrastructure", "home-lab", 0.45),
  N("t-python", "Python", "tech", "software", "cryptodrishti", 0.55),
  N("t-fastapi", "FastAPI", "tech", "software", "cryptodrishti", 0.42),
  N("t-cyclonedx", "CycloneDX 1.6", "tech", "software", "cryptodrishti", 0.48),
  N("t-typescript", "TypeScript", "tech", "software", "surakshascore", 0.52),
  N("t-react", "React", "tech", "software", "surakshascore", 0.45),
  N("t-kanon", "k-anonymity", "tech", "cybersecurity", "surakshascore", 0.45),
  N("t-webcrypto", "Web Crypto", "tech", "cybersecurity", "surakshascore-mvp", 0.42),
  N("t-express", "Express", "tech", "software", "aether-health", 0.42),
  N("t-gemini", "Gemini API", "tech", "ai", "aether-health", 0.45),
];

const evidenceNodes: GraphNode[] = [
  N("e-226", "226 tests", "evidence", "software", "cryptodrishti", 0.55),
  N("e-ci-py", "CI 3.11–3.13", "evidence", "software", "cryptodrishti", 0.45),
  N("e-107", "107 tests", "evidence", "software", "surakshascore", 0.55),
  N("e-isolation", "Isolation test", "evidence", "software", "surakshascore", 0.45),
  N("e-build", "Client + server build", "evidence", "software", "aether-health", 0.42),
  N("e-typecheck", "Typecheck pass", "evidence", "software", "surakshascore-mvp", 0.4),
  N("e-uptime", "4 services, 1 node", "evidence", "infrastructure", "home-lab", 0.45),
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
  // Sujith sits at the centre of his own domains.
  ...domains.map((d) => E("sujith", d.id)),

  // Each domain reaches the projects and services it genuinely touches.
  ...domains.flatMap((d) => d.projects.map((slug) => E(d.id, `p-${slug}`))),
  ...domains.flatMap((d) => d.services.map((svc) => E(d.id, `svc-${svc}`))),

  // The lab's own topology, parent by parent.
  ...services.filter((s) => s.parent).map((s) => E(`svc-${s.parent}`, `svc-${s.id}`)),
  E("p-home-lab", "svc-debian"),

  // Technologies and evidence hang off their project.
  ...techNodes.filter((t) => t.project).map((t) => E(`p-${t.project}`, t.id)),
  ...evidenceNodes.filter((n) => n.project).map((n) => E(`p-${n.project}`, n.id)),

  // The rebuild lineage.
  E("p-surakshascore-mvp", "p-surakshascore"),

  // A few cross-links that are true and make the field feel woven.
  E("networking", "cybersecurity"),
  E("linux", "systems"),
  E("infrastructure", "linux"),
  E("software", "cybersecurity"),
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

/** Node ids belonging to one domain, including what it connects to. */
export function domainSubgraph(id: DomainId): Set<string> {
  const out = new Set<string>([id]);
  for (const e of graphEdges) {
    if (e.from === id) out.add(e.to);
    if (e.to === id) out.add(e.from);
  }
  out.delete("sujith");
  return out;
}

export const domainIds: DomainId[] = domains.map((d) => d.id);

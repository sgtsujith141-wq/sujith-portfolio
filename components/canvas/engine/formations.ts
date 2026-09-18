import { graphNodes, graphEdges, type GraphNode } from "@/content/graph";
import type { ProjectSlug, SectionId } from "@/lib/types";
import { seeded } from "@/lib/utils";

/* ══════════════════════════════════════════════════════════════════════
 *  FORMATIONS
 *
 *  Pure layout functions. Given the viewport, the active section, the
 *  section progress and the focused project, return a target for every
 *  node: position (px), alpha, label alpha and whether it is "lit".
 *  The engine springs nodes toward these targets; it never lays out.
 * ══════════════════════════════════════════════════════════════════════ */

export interface Target {
  x: number;
  y: number;
  a: number;
  la: number;
  lit: number;
}

export interface Viewport {
  w: number;
  h: number;
  /** True below the desktop breakpoint: text spans the full width. */
  narrow: boolean;
}

export interface Camera {
  zoom: number;
  x: number;
  y: number;
}

/** A DOM-measured rectangle (viewport px) that a focused cluster should occupy. */
export interface Stage {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface FormationInput {
  section: SectionId;
  progress: number;
  focus: ProjectSlug | null;
  hover: string | null;
  stage: Stage | null;
  /** Progress of the pinned Selected Work introduction, 0–1. */
  phase: number;
}

type Box = { x0: number; y0: number; x1: number; y1: number };

const inside = (x: number, y: number, r: Box) => x >= r.x0 && x <= r.x1 && y >= r.y0 && y <= r.y1;

/** Move a point out of a union of rectangles, to the nearest free exit
 *  (top, bottom or right of whichever box contains it). Two passes cover
 *  the stacked boxes used by the hero. */
function keepOut(x: number, y: number, boxes: Box[], margin: number) {
  let px = x;
  let py = y;
  for (let pass = 0; pass < 3; pass++) {
    const box = boxes.find((b) => inside(px, py, b));
    if (!box) return { x: px, y: py };
    const exits = [
      { x: px, y: box.y0 - margin, d: py - box.y0 },
      { x: px, y: box.y1 + margin, d: box.y1 - py },
      { x: box.x1 + margin, y: py, d: box.x1 - px },
    ]
      .map((e) => ({ ...e, free: !boxes.some((b) => inside(e.x, e.y, b)) }))
      .sort((a, b) => Number(b.free) - Number(a.free) || a.d - b.d);
    const pick = exits[0]!;
    px = pick.x;
    py = pick.y;
  }
  return { x: px, y: py };
}

export const CLUSTERS: Array<ProjectSlug | "core"> = [
  "cryptodrishti",
  "surakshascore",
  "surakshascore-mvp",
  "aether-health",
  "core",
];

/** Breadth-first depth from the root, used to stage the opening. */
export const nodeDepth: Record<string, number> = (() => {
  const depth: Record<string, number> = { sujith: 0 };
  const adj = new Map<string, string[]>();
  for (const e of graphEdges) {
    adj.set(e.from, [...(adj.get(e.from) ?? []), e.to]);
    adj.set(e.to, [...(adj.get(e.to) ?? []), e.from]);
  }
  const queue = ["sujith"];
  while (queue.length) {
    const id = queue.shift()!;
    for (const next of adj.get(id) ?? []) {
      if (depth[next] === undefined) {
        depth[next] = depth[id]! + 1;
        queue.push(next);
      }
    }
  }
  for (const n of graphNodes) if (depth[n.id] === undefined) depth[n.id] = 3;
  return depth;
})();

const byCluster = (cluster: GraphNode["cluster"]) =>
  graphNodes.filter((n) => n.cluster === cluster && n.kind !== "root");

const TAU = Math.PI * 2;

/* ── helpers ────────────────────────────────────────────────────────── */

function ring(
  out: Record<string, Target>,
  nodes: GraphNode[],
  cx: number,
  cy: number,
  r: number,
  a: number,
  la: number,
  lit: number,
  phase = 0,
  squash = 1,
) {
  const n = nodes.length || 1;
  nodes.forEach((node, i) => {
    const t = phase + (i / n) * TAU;
    const rr = r * (0.82 + seeded(i * 7 + node.weight * 100) * 0.36);
    out[node.id] = {
      x: cx + Math.cos(t) * rr,
      y: cy + Math.sin(t) * rr * squash,
      a,
      la,
      lit,
    };
  });
}

/** Position for one project cluster: project node at centre, satellites around it. */
function cluster(
  out: Record<string, Target>,
  slug: ProjectSlug,
  cx: number,
  cy: number,
  r: number,
  a: number,
  la: number,
  lit: number,
  phase = 0,
) {
  out[slug] = { x: cx, y: cy, a: Math.min(1, a + 0.2), la: la > 0 ? Math.min(1, la + 0.3) : 0, lit };
  const satellites = byCluster(slug).filter((n) => n.id !== slug);
  ring(out, satellites, cx, cy, r, a, la, lit, phase, 0.8);
}

/* ── formations ─────────────────────────────────────────────────────── */

function introduction(v: Viewport, p: number): { t: Record<string, Target>; cam: Camera } {
  const t: Record<string, Target> = {};
  const cx = v.w / 2;
  const cy = v.h * 0.5;
  const R = Math.min(v.w, v.h) * (v.narrow ? 0.46 : 0.4);
  t.sujith = { x: cx, y: cy, a: 0.55, la: 0, lit: 0.2 };

  const projectsRing = graphNodes.filter((n) => n.kind === "project");
  ring(t, projectsRing, cx, cy, R * 0.92, 0.8, v.narrow ? 0 : 0.85, 0.35, -Math.PI / 2 + 0.35, 0.78);

  const coreConcepts = byCluster("core").filter((n) => n.kind === "concept");
  ring(t, coreConcepts, cx, cy, R * 1.4, 0.55, v.narrow ? 0 : 0.5, 0.15, 1.2, 0.72);

  const rest = graphNodes.filter((n) => !t[n.id]);
  rest.forEach((n, i) => {
    const ang = seeded(i * 3 + 11) * TAU;
    const rr = R * (1.05 + seeded(i * 5 + 3) * 0.75);
    t[n.id] = {
      x: cx + Math.cos(ang) * rr * (v.w / v.h > 1 ? 1.25 : 0.9),
      y: cy + Math.sin(ang) * rr * 0.72,
      a: 0.28,
      la: 0,
      lit: 0,
    };
  });

  // The name row and the statement/actions row are keep-out boxes for
  // labelled nodes. The hero camera drifts the field up by as much as
  // 8% of the viewport while the section is read, so the boxes reach
  // that much further down than the text itself.
  if (!v.narrow) {
    const boxes: Box[] = [
      { x0: v.w * 0.05, y0: v.h * 0.26, x1: v.w * 0.76, y1: v.h * 0.56 },
      { x0: v.w * 0.05, y0: v.h * 0.56, x1: v.w * 0.56, y1: v.h * 0.82 },
    ];
    for (const id of Object.keys(t)) {
      const target = t[id]!;
      if (target.la <= 0 && target.lit <= 0.1) continue;
      const moved = keepOut(target.x, target.y, boxes, 36);
      target.x = moved.x;
      target.y = moved.y;
    }
  }

  return { t, cam: { zoom: 1 + p * 0.06, x: 0, y: -p * v.h * 0.08 } };
}

function work(
  v: Viewport,
  phase: number,
  focus: ProjectSlug | null,
  stage: Stage | null,
): { t: Record<string, Target>; cam: Camera } {
  const p = Math.max(0, Math.min(1, phase));
  const t: Record<string, Target> = {};
  const order: ProjectSlug[] = ["cryptodrishti", "surakshascore", "surakshascore-mvp", "aether-health"];
  const R = Math.min(v.w, v.h) * (v.narrow ? 0.17 : 0.14);

  // Root recedes to the top edge while the projects are read.
  t.sujith = { x: v.w * 0.5, y: v.h * 0.06, a: 0.35, la: 0, lit: 0 };
  byCluster("core").forEach((n, i) => {
    t[n.id] = {
      x: v.w * (0.1 + seeded(i * 9 + 2) * 0.8),
      y: v.h * (0.02 + seeded(i * 4 + 7) * 0.12),
      a: 0.22,
      la: 0,
      lit: 0,
    };
  });

  if (!focus) {
    // Reorganisation: clusters travel from a condensed origin into four
    // worlds. On wide screens the worlds surface in the empty right region
    // beside the pinned header; on narrow screens they stay faint and small.
    const origin = v.narrow ? { x: v.w * 0.5, y: v.h * 0.12 } : { x: v.w * 0.78, y: v.h * 0.3 };
    order.forEach((slug, i) => {
      const spreadX = v.narrow ? v.w * (i % 2 === 0 ? 0.25 : 0.75) : v.w * (i % 2 === 0 ? 0.69 : 0.84);
      const spreadY = v.narrow ? v.h * (i < 2 ? 0.08 : 0.2) : v.h * (i < 2 ? 0.13 : 0.47);
      const cx = origin.x + (spreadX - origin.x) * p;
      const cy = origin.y + (spreadY - origin.y) * p;
      // Compact worlds: only the project itself is named here; the
      // satellites get their labels inside the case study.
      const r = v.narrow ? R * 0.5 : Math.min(v.w, v.h) * 0.06 * (0.4 + p * 0.6);
      cluster(t, slug, cx, cy, r, v.narrow ? 0.35 : 0.4 + p * 0.45, 0, 0.3 + p * 0.4, i * 0.9);
      if (!v.narrow) t[slug] = { ...t[slug]!, la: p > 0.5 ? Math.min(1, (p - 0.5) * 2.4) : 0 };
    });
    return { t, cam: { zoom: 1.03 - p * 0.03, x: 0, y: 0 } };
  }

  // One project is being read. If the case study offers a measured window
  // in its visual column, the world fills exactly that; otherwise it takes
  // the empty column beside the text.
  let fx = v.narrow ? v.w * 0.5 : v.w * 0.74;
  let fy = v.narrow ? v.h * 0.1 : v.h * 0.5;
  let rx = R * 1.5;
  let ry = R * 1.2;
  if (stage && !v.narrow) {
    fx = stage.x;
    fy = stage.y;
    rx = stage.w * 0.4;
    ry = Math.max(28, stage.h * 0.36);
  }
  t[focus] = { x: fx, y: fy, a: 1, la: v.narrow ? 0 : 1, lit: 1 };
  const satellites = byCluster(focus).filter((n) => n.id !== focus);
  const n = satellites.length || 1;
  satellites.forEach((node, i) => {
    const ang = 0.6 + (i / n) * TAU;
    const wob = 0.82 + seeded(i * 7 + node.weight * 100) * 0.3;
    t[node.id] = {
      x: fx + Math.cos(ang) * rx * wob,
      y: fy + Math.sin(ang) * ry * wob,
      a: v.narrow ? 0.4 : 0.95,
      la: v.narrow ? 0 : 1,
      lit: v.narrow ? 0.4 : 1,
    };
  });

  const others = order.filter((s) => s !== focus);
  others.forEach((slug, i) => {
    const cx = v.narrow ? v.w * (0.15 + i * 0.35) : v.w * (0.1 + i * 0.12);
    const cy = v.narrow ? v.h * 0.92 : v.h * (0.86 + (i % 2) * 0.07);
    cluster(t, slug, cx, cy, R * 0.5, 0.18, 0, 0, i);
  });

  return { t, cam: { zoom: 1, x: 0, y: 0 } };
}

function evidence(v: Viewport, p: number): { t: Record<string, Target>; cam: Camera } {
  const t: Record<string, Target> = {};
  // The section header sits top-left and the cards are opaque, so the
  // lattice lives in the region beside the header.
  const region = v.narrow
    ? { x0: v.w * 0.04, x1: v.w * 0.96, y0: v.h * 0.02, y1: v.h * 0.16 }
    : { x0: v.w * 0.6, x1: v.w * 0.84, y0: v.h * 0.08, y1: v.h * 0.5 };
  const cols = v.narrow ? 11 : 6;
  const rows = Math.ceil(graphNodes.length / cols);
  const gx = (region.x1 - region.x0) / (cols - 1);
  const gy = (region.y1 - region.y0) / Math.max(1, rows - 1);
  const top = region.y0;

  // Order by cluster so each project occupies a band of the lattice.
  const ordered = [...graphNodes].sort(
    (a, b) => CLUSTERS.indexOf(a.cluster) - CLUSTERS.indexOf(b.cluster),
  );
  ordered.forEach((n, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const isEvidence = n.kind === "evidence";
    t[n.id] = {
      x: region.x0 + gx * col,
      y: top + gy * row,
      a: isEvidence ? 0.9 : 0.42,
      la: v.narrow ? 0 : isEvidence ? 0.9 : 0,
      lit: isEvidence ? 0.9 : 0,
    };
  });
  return { t, cam: { zoom: 1, x: 0, y: (0.5 - p) * v.h * 0.04 } };
}

function about(v: Viewport): { t: Record<string, Target>; cam: Camera } {
  const t: Record<string, Target> = {};
  const cx = v.narrow ? v.w * 0.5 : v.w * 0.72;
  const cy = v.narrow ? v.h * 0.18 : v.h * 0.5;
  const R = Math.min(v.w, v.h) * 0.22;
  t.sujith = { x: cx, y: cy, a: 0.9, la: 0, lit: 0.6 };
  ring(t, byCluster("core"), cx, cy, R, 0.85, v.narrow ? 0.4 : 0.9, 0.55, 0.2, 0.85);
  graphNodes
    .filter((n) => !t[n.id])
    .forEach((n, i) => {
      t[n.id] = {
        x: v.w * (0.04 + seeded(i * 13 + 5) * 0.92),
        y: v.h * (0.04 + seeded(i * 17 + 9) * 0.92),
        a: 0.2,
        la: 0,
        lit: 0,
      };
    });
  return { t, cam: { zoom: 0.98, x: 0, y: 0 } };
}

function exploration(v: Viewport, p: number): { t: Record<string, Target>; cam: Camera } {
  const t: Record<string, Target> = {};
  const groups: Array<[GraphNode["cluster"], number, number]> = [
    ["cryptodrishti", 0.2, 0.3],
    ["surakshascore", 0.5, 0.68],
    ["aether-health", 0.8, 0.32],
    ["core", 0.65, 0.78],
    ["surakshascore-mvp", 0.32, 0.8],
  ];
  const R = Math.min(v.w, v.h) * 0.12;
  t.sujith = { x: v.w * 0.5, y: v.h * 0.45, a: 0.4, la: 0, lit: 0.1 };
  groups.forEach(([c, fx, fy], gi) => {
    const drift = Math.sin(p * Math.PI * 2 + gi) * v.w * 0.02;
    ring(t, byCluster(c), v.w * fx + drift, v.h * fy, R, 0.5, 0, 0.15, gi * 1.3, 0.8);
    if (c !== "core") t[c] = { ...t[c]!, la: v.narrow ? 0 : 0.45, a: 0.7 };
  });
  return { t, cam: { zoom: 1, x: 0, y: 0 } };
}

function connect(v: Viewport, p: number): { t: Record<string, Target>; cam: Camera } {
  const t: Record<string, Target> = {};
  const cx = v.narrow ? v.w * 0.5 : v.w * 0.74;
  const cy = v.narrow ? v.h * 0.12 : v.h * 0.56;
  const spread = (1 - p) * Math.min(v.w, v.h) * 0.3;
  t.sujith = { x: cx, y: cy, a: 1, la: 0, lit: 0.9 };
  graphNodes
    .filter((n) => n.kind !== "root")
    .forEach((n, i) => {
      const ang = seeded(i * 19 + 1) * TAU;
      const rr = spread * (0.35 + seeded(i * 23 + 4) * 0.9) + 8 * (1 - p);
      t[n.id] = {
        x: cx + Math.cos(ang) * rr * 1.3,
        y: cy + Math.sin(ang) * rr * 0.8,
        a: Math.max(0.05, 0.6 * (1 - p * 0.8)),
        la: 0,
        lit: 0.1 * (1 - p),
      };
    });
  return { t, cam: { zoom: 1 + p * 0.06, x: 0, y: 0 } };
}

export function formation(v: Viewport, input: FormationInput): { t: Record<string, Target>; cam: Camera } {
  const p = Math.max(0, Math.min(1, input.progress));
  switch (input.section) {
    case "introduction":
      return introduction(v, p);
    case "work":
      return work(v, input.phase, input.focus, input.stage);
    case "evidence":
      return evidence(v, p);
    case "about":
      return about(v);
    case "exploration":
      return exploration(v, p);
    case "connect":
      return connect(v, p);
  }
}

/** Ambient lattice: unlabelled nodes that give the labelled graph a field. */
export function ambientTargets(
  v: Viewport,
  count: number,
  section: SectionId,
  progress: number,
): Array<{ x: number; y: number; a: number }> {
  const out: Array<{ x: number; y: number; a: number }> = [];
  const cols = Math.max(4, Math.round(Math.sqrt(count * (v.w / v.h))));
  const rows = Math.max(3, Math.ceil(count / cols));
  const converge = section === "connect" ? progress : 0;
  const lattice = section === "evidence" ? 1 : 0;
  for (let i = 0; i < count; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const jx = (seeded(i * 31 + 7) - 0.5) * (v.w / cols) * (1.3 - lattice * 1.1);
    const jy = (seeded(i * 37 + 3) - 0.5) * (v.h / rows) * (1.3 - lattice * 1.1);
    let x = ((col + 0.5) / cols) * v.w + jx;
    let y = ((row + 0.5) / rows) * v.h + jy;
    if (converge > 0) {
      const cx = v.narrow ? v.w * 0.5 : v.w * 0.74;
      const cy = v.narrow ? v.h * 0.12 : v.h * 0.56;
      x = x + (cx - x) * converge * 0.9;
      y = y + (cy - y) * converge * 0.9;
    }
    out.push({ x, y, a: section === "connect" ? 0.35 * (1 - converge) : 0.35 });
  }
  return out;
}

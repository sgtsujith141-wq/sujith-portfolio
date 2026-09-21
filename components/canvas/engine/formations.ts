import { graphNodes, graphEdges, domainSubgraph, type GraphNode } from "@/content/graph";
import { services } from "@/content/homelab";
import type { DomainId, ProjectSlug, SectionId } from "@/lib/types";
import { seeded } from "@/lib/utils";

/* ══════════════════════════════════════════════════════════════════════
 *  FORMATIONS
 *
 *  Pure layout. Given the viewport and what the visitor is doing, return
 *  a target for every node: position, alpha, label alpha, how lit it is,
 *  and its depth. The engine springs nodes toward these; it never lays
 *  out. Because every formation is a function of section progress, any
 *  transition reverses exactly when the visitor scrolls back.
 *
 *  Formation per section, matching the page:
 *    introduction  an abstract interconnected field
 *    about         the same nodes, organised into a structured system
 *    network       Sujith at the centre, his domains in orbit — the
 *                  signature section, driven by the selected domain
 *    homelab       the field becomes the lab's infrastructure topology
 *    exploring     loose threads, drifting
 *    work          project modules emerge, everything else recedes
 *    connect       the whole system converges to one point
 *    work-route    the /work page's own standing formation
 * ══════════════════════════════════════════════════════════════════════ */

export type FormationName = SectionId | "work-route" | "boot" | "emerge";

export interface Target {
  x: number;
  y: number;
  /** Node alpha. */
  a: number;
  /** Label alpha. */
  la: number;
  /** 0–1 highlight energy. */
  lit: number;
  /** Depth 0.15 (far) – 1 (near). Drives parallax, size and haze. */
  z: number;
}

export interface Viewport {
  w: number;
  h: number;
  /** True below the desktop breakpoint. */
  narrow: boolean;
}

export interface Camera {
  zoom: number;
  x: number;
  y: number;
  /** Extra rotation, radians. Used sparingly for perspective shifts. */
  tilt: number;
}

/** A DOM-measured rectangle (viewport px) a formation should respect. */
export interface Stage {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface FormationInput {
  name: FormationName;
  /** Progress through the section, 0–1. */
  progress: number;
  /** Progress of a pinned scene, when one is driving. */
  phase: number;
  focus: ProjectSlug | null;
  domain: DomainId | null;
  hover: string | null;
  stage: Stage | null;
}

export interface FormationResult {
  t: Record<string, Target>;
  cam: Camera;
  /** Palette weight: 0 neutral-cool, 1 warm-accent. Engine lerps colours. */
  mood: number;
  /** How many signals per second the engine should be spawning. */
  flow: number;
  /** 0 = straight edges, 1 = orthogonal routed edges. */
  routed: number;
}

const TAU = Math.PI * 2;
type Box = { x0: number; y0: number; x1: number; y1: number };

const byKind = (kind: GraphNode["kind"]) => graphNodes.filter((n) => n.kind === kind);
const domainNodes = byKind("domain");
const projectNodes = byKind("project");

const inside = (x: number, y: number, r: Box) => x >= r.x0 && x <= r.x1 && y >= r.y0 && y <= r.y1;

/** Move a point out of a union of rectangles, to the nearest free exit. */
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
      { x: box.x0 - margin, y: py, d: px - box.x0 },
    ]
      .map((e) => ({ ...e, free: !boxes.some((b) => inside(e.x, e.y, b)) }))
      .sort((a, b) => Number(b.free) - Number(a.free) || a.d - b.d);
    const pick = exits[0]!;
    px = pick.x;
    py = pick.y;
  }
  return { x: px, y: py };
}

/** Scatter everything not already placed into the far depth. */
function scatterRest(
  t: Record<string, Target>,
  v: Viewport,
  alpha = 0.22,
  seedOffset = 0,
) {
  graphNodes.forEach((n, i) => {
    if (t[n.id]) return;
    const s1 = seeded(i * 7.3 + 11 + seedOffset);
    const s2 = seeded(i * 4.1 + 29 + seedOffset);
    t[n.id] = {
      x: v.w * (-0.05 + s1 * 1.1),
      y: v.h * (-0.05 + s2 * 1.1),
      a: alpha * (0.6 + s1 * 0.6),
      la: 0,
      lit: 0,
      z: 0.16 + s2 * 0.3,
    };
  });
}

function ring(
  t: Record<string, Target>,
  nodes: GraphNode[],
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  opts: { a: number; la: number; lit: number; z: number; phase?: number; jitter?: number },
) {
  const n = nodes.length || 1;
  nodes.forEach((node, i) => {
    const ang = (opts.phase ?? 0) + (i / n) * TAU;
    const j = opts.jitter ?? 0;
    const wob = 1 + (seeded(i * 9.7 + 3) - 0.5) * j;
    t[node.id] = {
      x: cx + Math.cos(ang) * rx * wob,
      y: cy + Math.sin(ang) * ry * wob,
      a: opts.a,
      la: opts.la,
      lit: opts.lit,
      z: opts.z,
    };
  });
}

/* ── The opening sequence ──────────────────────────────────────────────
 *
 *  Restored from the original intro: the field starts collapsed at the
 *  centre behind the name, then condenses out of it as a golden-angle
 *  spiral. When the sequence releases the field, the normal section
 *  formation takes over and the same nodes are thrown outward to fill
 *  the viewport — which is what makes the handoff read as one system
 *  expanding rather than one screen replacing another.
 * ------------------------------------------------------------------- */

/** Golden angle — an even spread with no clumping. */
const GOLDEN = 2.399963229728653;

function boot(v: Viewport): FormationResult {
  const t: Record<string, Target> = {};
  const cx = v.w / 2;
  const cy = v.h / 2;
  for (const n of graphNodes) {
    t[n.id] = { x: cx, y: cy, a: 0, la: 0, lit: 0, z: 0.5 };
  }
  return { t, cam: { zoom: 1, x: 0, y: 0, tilt: 0 }, mood: 0.1, flow: 0, routed: 0 };
}

function emerge(v: Viewport): FormationResult {
  const t: Record<string, Target> = {};
  const cx = v.w / 2;
  const cy = v.h / 2;
  const aspect = v.w / Math.max(1, v.h);
  const n = graphNodes.length;
  graphNodes.forEach((node, i) => {
    const ang = i * GOLDEN;
    const r = (0.04 + (i / n) * 0.16 + seeded(i * 3.1 + 5) * 0.02) * Math.min(v.w, v.h) * 2;
    t[node.id] = {
      x: cx + Math.cos(ang) * r,
      y: cy + (Math.sin(ang) * r) / aspect,
      a: 0.72,
      la: 0,
      lit: 0.12,
      z: 0.45 + seeded(i * 7.7 + 2) * 0.4,
    };
  });
  return { t, cam: { zoom: 1, x: 0, y: 0, tilt: 0 }, mood: 0.2, flow: 0.4, routed: 0 };
}

/* ── 01 Introduction ───────────────────────────────────────────────── */

function introduction(v: Viewport, p: number): FormationResult {
  const t: Record<string, Target> = {};
  const cx = v.w * 0.5;
  const cy = v.h * 0.5;
  const R = Math.min(v.w, v.h) * (v.narrow ? 0.44 : 0.4);

  t.sujith = { x: cx, y: cy, a: 0.5, la: 0, lit: 0.25, z: 0.85 };

  // Domains form the first readable ring — this is who he is, so they
  // are the first thing the field spells out.
  ring(t, domainNodes, cx, cy, R * 1.12, R * 0.82, {
    a: 0.78,
    la: v.narrow ? 0 : 0.7,
    lit: 0.3,
    z: 0.9,
    phase: -Math.PI / 2 + 0.3,
    jitter: 0.22,
  });

  // Projects sit further out and dimmer: present, not the subject.
  ring(t, projectNodes, cx, cy, R * 1.62, R * 1.12, {
    a: 0.42,
    la: 0,
    lit: 0.1,
    z: 0.5,
    phase: 0.7,
    jitter: 0.3,
  });

  scatterRest(t, v, 0.26);

  if (!v.narrow) {
    // The headline, the name plate and statement, the action cluster on
    // the right, and the interests rail. Labelled nodes stay out of all
    // four; the camera pushes in by up to 7%, so they are drawn generously.
    const boxes: Box[] = [
      { x0: v.w * 0.04, y0: v.h * 0.16, x1: v.w * 0.88, y1: v.h * 0.55 },
      { x0: v.w * 0.04, y0: v.h * 0.55, x1: v.w * 0.55, y1: v.h * 0.75 },
      { x0: v.w * 0.6, y0: v.h * 0.53, x1: v.w * 0.94, y1: v.h * 0.74 },
      { x0: v.w * 0.04, y0: v.h * 0.75, x1: v.w * 0.94, y1: v.h * 0.87 },
    ];
    for (const id of Object.keys(t)) {
      const target = t[id]!;
      if (target.la <= 0 && target.lit <= 0.12) continue;
      const moved = keepOut(target.x, target.y, boxes, 40);
      target.x = moved.x;
      target.y = moved.y;
    }
  }

  return {
    t,
    cam: { zoom: 1 + p * 0.07, x: 0, y: -p * v.h * 0.06, tilt: 0 },
    mood: 0.15,
    flow: 0.5,
    routed: 0,
  };
}

/* ── 02 About ──────────────────────────────────────────────────────── */

function about(v: Viewport, p: number): FormationResult {
  const t: Record<string, Target> = {};
  // Structured: a spine with the domains ranked beside it, rather than
  // an orbit. The same nodes, organised.
  const cx = v.narrow ? v.w * 0.5 : v.w * 0.78;
  const top = v.h * (v.narrow ? 0.06 : 0.16);
  const gap = v.h * (v.narrow ? 0.03 : 0.1);

  t.sujith = { x: cx, y: top - gap * 0.9, a: 0.95, la: 0, lit: 0.7, z: 1 };

  domainNodes.forEach((n, i) => {
    const lane = i % 2 === 0 ? -1 : 1;
    t[n.id] = {
      x: cx + lane * v.w * (v.narrow ? 0.18 : 0.07),
      y: top + i * gap,
      a: 0.8,
      la: v.narrow ? 0 : 0.6,
      lit: 0.32,
      z: 0.78 + (i % 3) * 0.07,
    };
  });

  projectNodes.forEach((n, i) => {
    t[n.id] = {
      x: cx + (i % 2 === 0 ? -1 : 1) * v.w * 0.17,
      y: top + i * gap * 1.15 + gap * 0.5,
      a: 0.3,
      la: 0,
      lit: 0,
      z: 0.4,
    };
  });

  scatterRest(t, v, 0.18);
  return {
    t,
    cam: { zoom: 1.02, x: 0, y: (0.5 - p) * v.h * 0.05, tilt: 0 },
    mood: 0.3,
    flow: 0.7,
    routed: 0,
  };
}

/* ── 03 Technical world — the signature formation ──────────────────── */

function network(v: Viewport, p: number, domain: DomainId | null, stage: Stage | null): FormationResult {
  const t: Record<string, Target> = {};
  const cx = stage ? stage.x : v.narrow ? v.w * 0.5 : v.w * 0.72;
  const cy = stage ? stage.y : v.h * 0.5;
  const rx = stage ? stage.w * 0.36 : Math.min(v.w, v.h) * 0.26;
  const ry = stage ? stage.h * 0.36 : Math.min(v.w, v.h) * 0.26;

  t.sujith = { x: cx, y: cy, a: 1, la: 0, lit: 0.9, z: 1 };

  const selected = domain ? domainSubgraph(domain) : null;

  domainNodes.forEach((n, i) => {
    const ang = -Math.PI / 2 + (i / domainNodes.length) * TAU;
    const isSel = domain === n.id;
    const dim = domain && !isSel;
    t[n.id] = {
      x: cx + Math.cos(ang) * rx * (isSel ? 0.62 : 1),
      y: cy + Math.sin(ang) * ry * (isSel ? 0.62 : 1),
      a: dim ? 0.3 : 1,
      la: 0,
      lit: isSel ? 1 : dim ? 0 : 0.45,
      z: dim ? 0.55 : 1,
    };
  });

  // Everything the selected domain actually touches is drawn in around
  // it; everything else falls back into the haze.
  const satellites = graphNodes.filter((n) => n.kind !== "domain" && n.kind !== "root");
  const related = satellites.filter((n) => selected?.has(n.id));
  const others = satellites.filter((n) => !selected?.has(n.id));

  if (selected && related.length) {
    const sel = t[domain!]!;
    ring(t, related, sel.x, sel.y, rx * 0.66, ry * 0.66, {
      a: 0.95,
      la: v.narrow ? 0 : 0.95,
      lit: 0.75,
      z: 0.95,
      phase: 0.4,
      jitter: 0.3,
    });
  }

  others.forEach((n, i) => {
    const ang = seeded(i * 5.7 + 2) * TAU;
    const rr = (1.5 + seeded(i * 3.3 + 8) * 1.1) * Math.max(rx, ry);
    t[n.id] = {
      x: cx + Math.cos(ang) * rr,
      y: cy + Math.sin(ang) * rr * 0.7,
      a: domain ? 0.12 : 0.3,
      la: 0,
      lit: 0,
      z: 0.22 + seeded(i * 2.1 + 5) * 0.2,
    };
  });

  return {
    t,
    cam: { zoom: domain ? 1.06 : 1, x: 0, y: 0, tilt: 0 },
    mood: 0.55,
    flow: domain ? 2.4 : 1.2,
    routed: 0,
  };
}

/* ── 04 Home lab — the field becomes infrastructure ────────────────── */

function homelab(v: Viewport, p: number, stage: Stage | null): FormationResult {
  const t: Record<string, Target> = {};
  const maxLayer = Math.max(...services.map((s) => s.layer));

  // Occupy the measured diagram area when the page offers one, so the
  // canvas topology sits exactly behind the interactive one.
  const box = stage
    ? { x0: stage.x - stage.w / 2, y0: stage.y - stage.h / 2, w: stage.w, h: stage.h }
    : {
        // The band beside the section heading, clear of the rail.
        x0: v.narrow ? v.w * 0.1 : v.w * 0.58,
        y0: v.h * (v.narrow ? 0.04 : 0.1),
        w: v.narrow ? v.w * 0.8 : v.w * 0.26,
        h: v.h * (v.narrow ? 0.24 : 0.52),
      };

  services.forEach((s) => {
    const layerT = maxLayer === 0 ? 0 : s.layer / maxLayer;
    t[`svc-${s.id}`] = {
      x: box.x0 + box.w * s.x,
      // Ease the layers apart so the top of the stack has room.
      y: box.y0 + box.h * (0.06 + layerT * 0.88),
      // Restrained on purpose: a structural hint beside the copy, never
      // a second diagram competing with the interactive one below.
      a: 0.62,
      la: v.narrow ? 0 : 0.55,
      lit: 0.18 + (s.kind === "host" || s.kind === "platform" ? 0.1 : 0),
      z: 0.9,
    };
  });

  // The lab project node anchors the stack from above.
  t["p-home-lab"] = {
    x: box.x0 + box.w * 0.5,
    y: box.y0 - box.h * 0.08,
    a: 0.5,
    la: 0,
    lit: 0.25,
    z: 0.85,
  };

  // Domains all but vanish here — their long edges would otherwise rake
  // across the reading column on the way to the services.
  domainNodes.forEach((n, i) => {
    t[n.id] = {
      x: v.narrow ? v.w * (0.12 + i * 0.13) : v.w * 0.5,
      y: v.narrow ? v.h * 0.96 : v.h * (0.04 + i * 0.03),
      a: 0.07,
      la: 0,
      lit: 0,
      z: 0.2,
    };
  });

  scatterRest(t, v, 0.08, 40);
  return {
    t,
    cam: { zoom: 1, x: 0, y: (0.5 - p) * v.h * 0.03, tilt: 0 },
    mood: 0.7,
    flow: 2.2,
    routed: 1,
  };
}

/* ── 05 Exploring ──────────────────────────────────────────────────── */

function exploring(v: Viewport, p: number): FormationResult {
  const t: Record<string, Target> = {};
  const groups: Array<[DomainId, number, number]> = [
    ["networking", 0.74, 0.16],
    ["cybersecurity", 0.86, 0.42],
    ["ai", 0.7, 0.66],
    ["infrastructure", 0.88, 0.86],
  ];
  const R = Math.min(v.w, v.h) * 0.09;

  t.sujith = { x: v.w * 0.8, y: v.h * 0.5, a: 0.3, la: 0, lit: 0.1, z: 0.5 };

  groups.forEach(([id, fx, fy], gi) => {
    const drift = Math.sin(p * TAU + gi * 1.3) * v.w * 0.014;
    const cx = v.narrow ? v.w * (0.2 + gi * 0.2) : v.w * fx + drift;
    const cy = v.narrow ? v.h * 0.06 : v.h * fy;
    t[id] = { x: cx, y: cy, a: 0.85, la: 0, lit: 0.5, z: 0.9 };
    const related = graphNodes.filter((n) => n.domain === id && n.kind !== "domain").slice(0, 5);
    ring(t, related, cx, cy, R, R * 0.8, {
      a: 0.5,
      la: 0,
      lit: 0.2,
      z: 0.6,
      phase: gi * 1.1,
      jitter: 0.35,
    });
  });

  scatterRest(t, v, 0.14, 90);
  return {
    t,
    cam: { zoom: 0.99, x: 0, y: 0, tilt: 0 },
    mood: 0.4,
    flow: 1,
    routed: 0,
  };
}

/* ── 06 Work teaser — project modules emerge ───────────────────────── */

function work(v: Viewport, p: number, stage: Stage | null): FormationResult {
  const t: Record<string, Target> = {};
  const cx = stage ? stage.x : v.narrow ? v.w * 0.5 : v.w * 0.74;
  const cy = stage ? stage.y : v.h * 0.5;
  const spread = stage ? stage.w * 0.42 : Math.min(v.w, v.h) * 0.3;

  // Infrastructure recedes: domains drop back and dim as the projects rise.
  domainNodes.forEach((n, i) => {
    const ang = seeded(i * 6.1 + 1) * TAU;
    t[n.id] = {
      x: cx + Math.cos(ang) * spread * 2,
      y: cy + Math.sin(ang) * spread * 1.4,
      a: 0.16 * (1 - p * 0.5),
      la: 0,
      lit: 0,
      z: 0.2,
    };
  });
  t.sujith = { x: cx, y: cy - spread * 1.3, a: 0.3, la: 0, lit: 0.15, z: 0.5 };

  projectNodes.forEach((n, i) => {
    const ang = -Math.PI / 2 + (i / projectNodes.length) * TAU;
    const rise = 0.55 + p * 0.45;
    t[n.id] = {
      x: cx + Math.cos(ang) * spread * rise,
      y: cy + Math.sin(ang) * spread * 0.78 * rise,
      a: 0.55 + p * 0.45,
      la: v.narrow ? 0 : p > 0.35 ? Math.min(1, (p - 0.35) * 2.2) : 0,
      lit: 0.4 + p * 0.5,
      z: 0.9,
    };
    // Each project's own satellites trail behind it.
    const sats = graphNodes.filter((s) => s.project === n.project && s.kind !== "project");
    ring(t, sats, t[n.id]!.x, t[n.id]!.y, spread * 0.26, spread * 0.2, {
      a: 0.3 + p * 0.3,
      la: 0,
      lit: 0.2,
      z: 0.55,
      phase: i * 1.4,
      jitter: 0.35,
    });
  });

  scatterRest(t, v, 0.1, 150);
  return {
    t,
    cam: { zoom: 1 + p * 0.03, x: 0, y: 0, tilt: 0 },
    mood: 0.5,
    flow: 1.8,
    routed: 0,
  };
}

/* ── 07 Connect — convergence ──────────────────────────────────────── */

function connect(v: Viewport, p: number): FormationResult {
  const t: Record<string, Target> = {};
  const cx = v.narrow ? v.w * 0.5 : v.w * 0.74;
  const cy = v.narrow ? v.h * 0.14 : v.h * 0.54;
  const spread = (1 - p) * Math.min(v.w, v.h) * 0.34;

  t.sujith = { x: cx, y: cy, a: 1, la: 0, lit: 0.95, z: 1 };
  graphNodes
    .filter((n) => n.kind !== "root")
    .forEach((n, i) => {
      const ang = seeded(i * 19.3 + 1) * TAU;
      const rr = spread * (0.3 + seeded(i * 23.7 + 4) * 0.95) + 10 * (1 - p);
      t[n.id] = {
        x: cx + Math.cos(ang) * rr * 1.25,
        y: cy + Math.sin(ang) * rr * 0.78,
        a: Math.max(0.05, 0.62 * (1 - p * 0.78)),
        la: 0,
        lit: 0.12 * (1 - p),
        z: 0.35 + (1 - p) * 0.4,
      };
    });

  return {
    t,
    cam: { zoom: 1 + p * 0.08, x: 0, y: 0, tilt: 0 },
    mood: 0.2,
    flow: 2.2 * (1 - p * 0.7),
    routed: 0,
  };
}

/* ── /work route ───────────────────────────────────────────────────── */

function workRoute(v: Viewport, p: number, focus: ProjectSlug | null, stage: Stage | null): FormationResult {
  const t: Record<string, Target> = {};

  if (focus && stage) {
    // A case study is open: its own constellation fills the measured window.
    const id = `p-${focus}`;
    t[id] = { x: stage.x, y: stage.y, a: 1, la: v.narrow ? 0 : 1, lit: 1, z: 1 };
    const sats = graphNodes.filter((n) => n.project === focus && n.kind !== "project");
    ring(t, sats, stage.x, stage.y, stage.w * 0.38, Math.max(30, stage.h * 0.36), {
      a: 0.95,
      la: v.narrow ? 0 : 0.95,
      lit: 0.8,
      z: 0.95,
      phase: 0.5,
      jitter: 0.26,
    });
    projectNodes
      .filter((n) => n.id !== id)
      .forEach((n, i) => {
        t[n.id] = {
          x: v.w * (v.narrow ? 0.12 + i * 0.2 : 0.08 + i * 0.09),
          y: v.narrow ? v.h * 0.96 : v.h * (0.88 + (i % 2) * 0.06),
          a: 0.2,
          la: 0,
          lit: 0,
          z: 0.3,
        };
      });
    scatterRest(t, v, 0.08, 200);
    return { t, cam: { zoom: 1, x: 0, y: 0, tilt: 0 }, mood: 0.5, flow: 2, routed: 0 };
  }

  // The index: five project worlds held in a slow ring. Their labels are
  // deliberately off — the list beside them already names every project,
  // and a second set of names over the reading column is noise. Pointing
  // at a row lights that module and its label comes up with the energy.
  const cx = v.w * (v.narrow ? 0.5 : 0.62);
  const cy = v.h * 0.5;
  const rx = Math.min(v.w, v.h) * (v.narrow ? 0.4 : 0.36);
  t.sujith = { x: cx, y: cy, a: 0.3, la: 0, lit: 0.18, z: 0.6 };
  projectNodes.forEach((n, i) => {
    const ang = -Math.PI / 2 + (i / projectNodes.length) * TAU + p * 0.25;
    t[n.id] = {
      x: cx + Math.cos(ang) * rx * 1.25,
      y: cy + Math.sin(ang) * rx * 0.8,
      a: 0.7,
      la: 0,
      lit: 0.35,
      z: 0.95,
    };
    const sats = graphNodes.filter((s) => s.project === n.project && s.kind !== "project");
    ring(t, sats, t[n.id]!.x, t[n.id]!.y, rx * 0.2, rx * 0.16, {
      a: 0.35,
      la: 0,
      lit: 0.15,
      z: 0.5,
      phase: i * 1.2,
      jitter: 0.3,
    });
  });
  scatterRest(t, v, 0.12, 250);
  return { t, cam: { zoom: 1, x: 0, y: 0, tilt: 0 }, mood: 0.45, flow: 1.6, routed: 0 };
}

/* ── entry point ───────────────────────────────────────────────────── */

export function formation(v: Viewport, input: FormationInput): FormationResult {
  const p = Math.max(0, Math.min(1, input.progress));
  switch (input.name) {
    case "boot":
      return boot(v);
    case "emerge":
      return emerge(v);
    case "introduction":
      return introduction(v, p);
    case "about":
      return about(v, p);
    case "network":
      return network(v, p, input.domain, input.stage);
    case "homelab":
      return homelab(v, p, input.stage);
    case "exploring":
      return exploring(v, p);
    case "work":
      return work(v, Math.max(p, input.phase), input.stage);
    case "connect":
      return connect(v, p);
    case "work-route":
      return workRoute(v, p, input.focus, input.stage);
  }
}

/** Ambient lattice: unlabelled points that give the graph a field to sit in. */
export function ambientTargets(
  v: Viewport,
  count: number,
  name: FormationName,
  progress: number,
): Array<{ x: number; y: number; a: number; z: number }> {
  const out: Array<{ x: number; y: number; a: number; z: number }> = [];
  const cols = Math.max(4, Math.round(Math.sqrt(count * (v.w / v.h))));
  const rows = Math.max(3, Math.ceil(count / cols));
  if (name === "boot" || name === "emerge") {
    const cx = v.w / 2;
    const cy = v.h / 2;
    const spread = name === "emerge" ? Math.min(v.w, v.h) * 0.22 : 0;
    for (let i = 0; i < count; i++) {
      const ang = i * GOLDEN;
      const r = spread * (0.2 + (i / count) * 0.9);
      out.push({
        x: cx + Math.cos(ang) * r,
        y: cy + Math.sin(ang) * r * 0.7,
        a: name === "emerge" ? 0.3 : 0,
        z: 0.12 + seeded(i * 11.9 + 4) * 0.42,
      });
    }
    return out;
  }

  const converge = name === "connect" ? progress : 0;
  // The lab formation snaps the ambient field onto a rack-like grid.
  const lattice = name === "homelab" ? 1 : name === "about" ? 0.55 : 0;

  for (let i = 0; i < count; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const jx = (seeded(i * 31.7 + 7) - 0.5) * (v.w / cols) * (1.35 - lattice * 1.2);
    const jy = (seeded(i * 37.1 + 3) - 0.5) * (v.h / rows) * (1.35 - lattice * 1.2);
    let x = ((col + 0.5) / cols) * v.w + jx;
    let y = ((row + 0.5) / rows) * v.h + jy;
    if (converge > 0) {
      const cx = v.narrow ? v.w * 0.5 : v.w * 0.74;
      const cy = v.narrow ? v.h * 0.14 : v.h * 0.54;
      x += (cx - x) * converge * 0.92;
      y += (cy - y) * converge * 0.92;
    }
    out.push({
      x,
      y,
      a: (name === "connect" ? 0.38 * (1 - converge) : 0.38) * (0.6 + seeded(i * 13.3) * 0.7),
      z: 0.12 + seeded(i * 11.9 + 4) * 0.42,
    });
  }
  return out;
}

/** Breadth-first depth from the root — used to stage the opening and pulses. */
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

export const maxDepth = Math.max(...Object.values(nodeDepth));

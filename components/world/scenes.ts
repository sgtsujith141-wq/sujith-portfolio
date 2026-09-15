/* ══════════════════════════════════════════════════════════════════════
 *  SCENES
 *
 *  One node field runs for the entire page. A scene does not create or
 *  destroy nodes — it only says where each node should be and how the
 *  field should look. The engine springs every node toward its new target
 *  and cross-fades the render parameters, so moving between scenes reads
 *  as the same system rearranging rather than one diagram replacing
 *  another.
 *
 *  All coordinates are normalised (0..1, x right, y down) so a resize
 *  costs nothing.
 * ══════════════════════════════════════════════════════════════════════ */

export type SceneName =
  | "boot"
  | "emerge"
  | "expand"
  | "calm"
  | "projects"
  | "topology"
  | "cyber"
  | "timeline"
  | "dissolve";

export interface SceneParams {
  /** Link cutoff as a fraction of min(width, height). */
  linkDist: number;
  linkAlpha: number;
  nodeAlpha: number;
  /** Idle wander amplitude, normalised. */
  drift: number;
  /** Per-frame packet spawn probability. */
  packets: number;
  /** Horizontal scan band (cybersecurity only). */
  scan: number;
  /** Spring stiffness toward the target. Higher = snappier morph. */
  stiffness: number;
  /** 0 = distance links, 1 = the explicit topology tree. */
  tree: number;
}

export interface Scene extends SceneParams {
  name: SceneName;
  layout(i: number, n: number, rnd: number, rnd2: number, aspect: number): Point;
}

export interface Point {
  x: number;
  y: number;
  /** Per-node alpha multiplier, for nodes a scene wants to push back. */
  a?: number;
}

/** Golden-angle spiral — gives an even spread without clumping. */
const GOLDEN = 2.399963229728653;

/* The home-lab tree, in the same reading order as data/systems-lab.ts.
 * Only the first seven nodes take these anchors; the rest fall back. */
export const TOPOLOGY_ANCHORS: Point[] = [
  { x: 0.5, y: 0.1 }, // internet
  { x: 0.5, y: 0.29 }, // tailscale
  { x: 0.5, y: 0.48 }, // debian
  { x: 0.5, y: 0.67 }, // casaos
  { x: 0.22, y: 0.88 }, // jellyfin
  { x: 0.5, y: 0.88 }, // storage
  { x: 0.78, y: 0.88 }, // minecraft
];

/** Parent → child, by index into TOPOLOGY_ANCHORS. */
export const TOPOLOGY_EDGES: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [3, 5],
  [3, 6],
];

/** Scatter that deliberately thins out the middle band, where the page's
 *  text column sits. Readability first; the field lives in the margins. */
function scatter(rnd: number, rnd2: number): Point {
  const x = rnd;
  const centred = rnd2 - 0.5;
  // Push away from the vertical centre without creating a hard gap.
  const y = 0.5 + Math.sign(centred || 1) * (0.1 + Math.abs(centred) * 0.8);
  return { x, y: Math.min(1.05, Math.max(-0.05, y)) };
}

const base: SceneParams = {
  linkDist: 0.17,
  linkAlpha: 0.055,
  nodeAlpha: 0.5,
  drift: 0.0016,
  packets: 0,
  scan: 0,
  stiffness: 0.045,
  tree: 0,
};

export const SCENES: Record<SceneName, Scene> = {
  /* 0.0–0.6s — everything collapsed to a single point. */
  boot: {
    ...base,
    name: "boot",
    linkAlpha: 0,
    nodeAlpha: 0,
    stiffness: 0.12,
    layout: () => ({ x: 0.5, y: 0.5, a: 0 }),
  },

  /* 2.3–3.0s — the field condenses out of the centre behind the name. */
  emerge: {
    ...base,
    name: "emerge",
    linkDist: 0.14,
    linkAlpha: 0.09,
    nodeAlpha: 0.75,
    stiffness: 0.055,
    layout: (i, n, rnd, _r2, aspect) => {
      const a = i * GOLDEN;
      const r = 0.04 + (i / n) * 0.16 + rnd * 0.02;
      return { x: 0.5 + Math.cos(a) * r, y: 0.5 + (Math.sin(a) * r) / aspect };
    },
  },

  /* The handoff. Same nodes, thrown outward to fill the viewport — this is
   * what makes the intro appear to open into the page rather than end. */
  expand: {
    ...base,
    name: "expand",
    linkAlpha: 0.075,
    nodeAlpha: 0.62,
    stiffness: 0.03,
    layout: (_i, _n, rnd, rnd2) => scatter(rnd, rnd2),
  },

  /* About, capabilities — the field settles and gets out of the way. */
  calm: {
    ...base,
    name: "calm",
    linkDist: 0.2,
    linkAlpha: 0.042,
    nodeAlpha: 0.38,
    drift: 0.0011,
    stiffness: 0.035,
    layout: (_i, _n, rnd, rnd2) => scatter(rnd, rnd2),
  },

  /* Projects — the field reorganises into one cluster per record. Focus is
   * applied by the engine, which lights the cluster being hovered. */
  projects: {
    ...base,
    name: "projects",
    linkDist: 0.12,
    linkAlpha: 0.055,
    nodeAlpha: 0.4,
    stiffness: 0.05,
    layout: (i, n, rnd, rnd2, aspect) => {
      const clusters = 5;
      const c = i % clusters;
      // Anchors run down the page, offset left/right alternately so the
      // column of case files stays clear.
      const ax = c % 2 === 0 ? 0.1 : 0.9;
      const ay = 0.12 + (c / (clusters - 1)) * 0.76;
      const a = i * GOLDEN;
      const r = 0.02 + rnd * 0.055;
      return {
        x: ax + Math.cos(a) * r,
        y: ay + (Math.sin(a) * r) / aspect + (rnd2 - 0.5) * 0.03,
      };
    },
  },

  /* Systems Lab — the field becomes the actual home-lab tree.
   * Deliberately faint: this is a background hint that the case file is
   * about to show properly, not a diagram competing with the copy. */
  topology: {
    ...base,
    name: "topology",
    linkAlpha: 0.05,
    nodeAlpha: 0.5,
    stiffness: 0.06,
    tree: 1,
    layout: (i, n, rnd, rnd2, aspect) => {
      if (i < TOPOLOGY_ANCHORS.length) {
        // Mapped into a region rather than the full viewport, biased right
        // so it sits beside the reading column instead of through it.
        const wide = aspect > 1.2;
        const x0 = wide ? 0.42 : 0.1;
        const x1 = wide ? 0.92 : 0.9;
        const p = TOPOLOGY_ANCHORS[i];
        return {
          x: x0 + p.x * (x1 - x0),
          y: 0.14 + p.y * 0.72,
          a: wide ? 1 : 0.7,
        };
      }
      // Everything else drifts to the periphery and dims, so the tree is
      // legible without the rest of the field disappearing outright.
      const a = i * GOLDEN;
      const r = 0.42 + rnd * 0.2;
      return {
        x: 0.5 + Math.cos(a) * r,
        y: 0.5 + (Math.sin(a) * r) / aspect + (rnd2 - 0.5) * 0.08,
        a: 0.18,
      };
    },
  },

  /* Cybersecurity — finer grain, traffic, and a slow scanning band. */
  cyber: {
    ...base,
    name: "cyber",
    linkDist: 0.13,
    linkAlpha: 0.07,
    nodeAlpha: 0.55,
    drift: 0.0022,
    packets: 0.05,
    scan: 1,
    stiffness: 0.04,
    layout: (i, n, rnd, rnd2) => {
      const cols = Math.max(4, Math.round(Math.sqrt(n * 1.7)));
      const rows = Math.ceil(n / cols);
      const cx = (i % cols) / (cols - 1 || 1);
      const cy = Math.floor(i / cols) / (rows - 1 || 1);
      return {
        x: 0.04 + cx * 0.92 + (rnd - 0.5) * 0.05,
        y: 0.04 + cy * 0.92 + (rnd2 - 0.5) * 0.05,
      };
    },
  },

  /* Hackathons — the field collapses into a single vertical spine. */
  timeline: {
    ...base,
    name: "timeline",
    linkDist: 0.1,
    linkAlpha: 0.08,
    nodeAlpha: 0.42,
    drift: 0.0009,
    stiffness: 0.05,
    layout: (i, n, rnd, rnd2) => ({
      x: 0.085 + (rnd2 - 0.5) * 0.045,
      y: 0.03 + (i / (n - 1 || 1)) * 0.94 + (rnd - 0.5) * 0.01,
    }),
  },

  /* Contact — the system opens out and fades, closing the journey. */
  dissolve: {
    ...base,
    name: "dissolve",
    linkDist: 0.24,
    linkAlpha: 0.03,
    nodeAlpha: 0.22,
    drift: 0.0008,
    stiffness: 0.022,
    layout: (i, _n, rnd, rnd2, aspect) => {
      const a = i * GOLDEN;
      const r = 0.45 + rnd * 0.35;
      return {
        x: 0.5 + Math.cos(a) * r,
        y: 0.5 + (Math.sin(a) * r) / aspect + (rnd2 - 0.5) * 0.1,
      };
    },
  },
};

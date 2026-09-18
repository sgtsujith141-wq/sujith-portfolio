import { graphNodes, graphEdges, graphNodeById, type GraphKind } from "@/content/graph";
import type { ProjectSlug, SectionId } from "@/lib/types";
import { lerp, seeded } from "@/lib/utils";
import {
  ambientTargets,
  formation,
  nodeDepth,
  type Camera,
  type Stage,
  type Target,
  type Viewport,
} from "./formations";

/* ══════════════════════════════════════════════════════════════════════
 *  LIVING SYSTEM ENGINE
 *
 *  One canvas for the whole page. Imperative on purpose: React pushes
 *  state in through the setters; nothing re-renders per frame.
 *
 *  Cost control
 *   · DPR capped at 2 (1.5 on coarse pointers)
 *   · ambient count scales with viewport area and halves on touch
 *   · ambient links use squared distance with an early-out
 *   · rAF stops when the tab is hidden or the canvas is off-screen
 *   · reduced motion draws one frame per state change, no loop
 *   · labels are drawn only for nodes whose label alpha > 0.04
 * ══════════════════════════════════════════════════════════════════════ */

interface SimNode {
  id: string;
  kind: GraphKind;
  weight: number;
  depth: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  tx: number;
  ty: number;
  a: number;
  ta: number;
  la: number;
  tla: number;
  lit: number;
  tlit: number;
  /** Pointer energy, eased. */
  e: number;
  /** Parallax depth 0.25–1. */
  z: number;
  phase: number;
  label: string;
}

interface Ambient {
  x: number;
  y: number;
  vx: number;
  vy: number;
  tx: number;
  ty: number;
  a: number;
  ta: number;
  z: number;
  phase: number;
}

interface Packet {
  from: number;
  to: number;
  t: number;
  speed: number;
}

const COLOR = {
  ink: "232,236,242",
  muted: "163,173,191",
  faint: "125,135,153",
  accent: "79,124,255",
  signal: "63,210,240",
  violet: "139,124,246",
};

function kindColor(kind: GraphKind) {
  switch (kind) {
    case "root":
      return COLOR.ink;
    case "project":
      return COLOR.accent;
    case "concept":
      return COLOR.signal;
    case "evidence":
      return COLOR.violet;
    default:
      return COLOR.muted;
  }
}

export interface EngineOptions {
  reduced: boolean;
  coarse: boolean;
}

export class LivingSystemEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private opts: EngineOptions;

  private w = 1;
  private h = 1;
  private dpr = 1;
  private narrow = false;

  private nodes: SimNode[] = [];
  private index = new Map<string, number>();
  private edges: Array<[number, number]> = [];
  private ambient: Ambient[] = [];
  private packets: Packet[] = [];

  private cam: Camera = { zoom: 1, x: 0, y: 0 };
  private camTarget: Camera = { zoom: 1, x: 0, y: 0 };

  private section: SectionId = "introduction";
  private progress = 0;
  private focus: ProjectSlug | null = null;
  private hover: string | null = null;
  private stage: Stage | null = null;
  private phase = 1;

  private pointer = { x: 0, y: 0, on: false };
  private pointerEase = { x: 0, y: 0 };

  /** Opening: 0 = dark, 1 = fully emerged. Eases after ignite(). */
  private ignition = 0;
  private ignited = false;
  private ignitionStart = 0;

  private raf = 0;
  private running = false;
  private visible = true;
  private last = 0;
  private time = 0;
  private dirty = true;

  constructor(canvas: HTMLCanvasElement, opts: EngineOptions) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) throw new Error("2d context unavailable");
    this.ctx = ctx;
    this.opts = opts;

    this.build();
    this.resize();
    if (opts.reduced) {
      // Reduced motion: the field exists, fully emerged, and only moves
      // when a section changes — and then it snaps.
      this.ignition = 1;
      this.ignited = true;
      this.snap();
      this.draw();
    } else {
      this.start();
    }
  }

  /* ── public API ─────────────────────────────────────────────────── */

  ignite() {
    if (this.ignited) return;
    this.ignited = true;
    this.ignitionStart = performance.now();
  }

  setSection(section: SectionId, progress: number) {
    const changed = section !== this.section;
    this.section = section;
    this.progress = progress;
    this.retarget();
    if (changed && this.opts.reduced) {
      this.snap();
      this.draw();
    }
  }

  setFocus(slug: ProjectSlug | null) {
    if (slug === this.focus) return;
    this.focus = slug;
    this.retarget();
    if (this.opts.reduced) {
      this.snap();
      this.draw();
    }
  }

  setHover(id: string | null) {
    this.hover = id;
    this.dirty = true;
  }

  /** Progress of the pinned Selected Work introduction. */
  setPhase(value: number) {
    const next = Math.max(0, Math.min(1, value));
    if (Math.abs(next - this.phase) < 0.004) return;
    this.phase = next;
    if (this.section === "work" && !this.focus) this.retarget();
  }

  /** Viewport rectangle the focused cluster should occupy; null releases it. */
  setStage(stage: Stage | null) {
    const same =
      (stage === null && this.stage === null) ||
      (stage !== null &&
        this.stage !== null &&
        Math.abs(stage.x - this.stage.x) < 1 &&
        Math.abs(stage.y - this.stage.y) < 1 &&
        Math.abs(stage.w - this.stage.w) < 1 &&
        Math.abs(stage.h - this.stage.h) < 1);
    if (same) return;
    this.stage = stage;
    this.retarget();
    if (this.opts.reduced) {
      this.snap();
      this.draw();
    }
  }

  setPointer(x: number, y: number, on: boolean) {
    if (this.opts.coarse) return;
    this.pointer = { x, y, on };
  }

  setVisible(v: boolean) {
    this.visible = v;
    if (v) this.start();
    else this.stop();
  }

  resize = () => {
    const rect = this.canvas.getBoundingClientRect();
    this.w = Math.max(1, rect.width);
    this.h = Math.max(1, rect.height);
    this.narrow = this.w < 1024;
    this.dpr = Math.min(window.devicePixelRatio || 1, this.opts.coarse ? 1.5 : 2);
    this.canvas.width = Math.round(this.w * this.dpr);
    this.canvas.height = Math.round(this.h * this.dpr);

    const want = this.ambientCount();
    if (this.ambient.length !== want) this.buildAmbient(want);
    this.retarget();
    if (this.opts.reduced) {
      this.snap();
      this.draw();
    }
  };

  destroy() {
    this.stop();
  }

  /* ── construction ──────────────────────────────────────────────── */

  private build() {
    this.nodes = graphNodes.map((n, i) => ({
      id: n.id,
      kind: n.kind,
      weight: n.weight,
      depth: nodeDepth[n.id] ?? 3,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      tx: 0,
      ty: 0,
      a: 0,
      ta: 0,
      la: 0,
      tla: 0,
      lit: 0,
      tlit: 0,
      e: 0,
      z: 0.35 + seeded(i * 3 + 1) * 0.65,
      phase: seeded(i * 5 + 2) * Math.PI * 2,
      label: n.label,
    }));
    this.index = new Map(this.nodes.map((n, i) => [n.id, i]));
    this.edges = [];
    for (const e of graphEdges) {
      const a = this.index.get(e.from);
      const b = this.index.get(e.to);
      if (a !== undefined && b !== undefined) this.edges.push([a, b]);
    }
  }

  private ambientCount() {
    const area = this.w * this.h;
    const n = Math.round(Math.min(90, Math.max(24, area / 26000)));
    return this.opts.coarse ? Math.round(n * 0.5) : n;
  }

  private buildAmbient(n: number) {
    this.ambient = Array.from({ length: n }, (_, i) => ({
      x: this.w / 2,
      y: this.h / 2,
      vx: 0,
      vy: 0,
      tx: this.w / 2,
      ty: this.h / 2,
      a: 0,
      ta: 0,
      z: 0.2 + seeded(i * 11 + 4) * 0.5,
      phase: seeded(i * 13 + 6) * Math.PI * 2,
    }));
  }

  private viewport(): Viewport {
    return { w: this.w, h: this.h, narrow: this.narrow };
  }

  private retarget() {
    const { t, cam } = formation(this.viewport(), {
      section: this.section,
      progress: this.progress,
      focus: this.focus,
      hover: this.hover,
      stage: this.stage,
      phase: this.phase,
    });
    // Labelled nodes never run under the navigation rail or off the edges.
    const minX = 20;
    const maxX = this.narrow ? this.w - 20 : this.w - 230;
    for (const n of this.nodes) {
      const target: Target | undefined = t[n.id];
      if (!target) continue;
      n.tx = target.la > 0.05 ? Math.min(maxX, Math.max(minX, target.x)) : target.x;
      n.ty = Math.min(this.h - 12, Math.max(12, target.y));
      n.ta = target.a;
      n.tla = target.la;
      n.tlit = target.lit;
    }
    const amb = ambientTargets(this.viewport(), this.ambient.length, this.section, this.progress);
    this.ambient.forEach((a, i) => {
      const target = amb[i];
      if (!target) return;
      a.tx = target.x;
      a.ty = target.y;
      a.ta = target.a;
    });
    this.camTarget = cam;
    this.dirty = true;
  }

  private snap() {
    for (const n of this.nodes) {
      n.x = n.tx;
      n.y = n.ty;
      n.vx = n.vy = 0;
      n.a = n.ta;
      n.la = n.tla;
      n.lit = n.tlit;
    }
    for (const a of this.ambient) {
      a.x = a.tx;
      a.y = a.ty;
      a.vx = a.vy = 0;
      a.a = a.ta;
    }
    this.cam = { ...this.camTarget };
  }

  /* ── loop ──────────────────────────────────────────────────────── */

  private start = () => {
    if (this.running || this.opts.reduced || !this.visible) return;
    this.running = true;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.loop);
  };

  private stop = () => {
    this.running = false;
    cancelAnimationFrame(this.raf);
  };

  private loop = (now: number) => {
    const dt = Math.min(2.5, (now - this.last) / 16.667) || 1;
    this.last = now;
    this.time += dt;
    this.step(dt, now);
    this.draw();
    this.raf = requestAnimationFrame(this.loop);
  };

  private step(dt: number, now: number) {
    // Ignition: 0 → 1 over 1.9s after ignite(). Before it, the field is dark.
    if (this.ignited && this.ignition < 1) {
      const t = Math.min(1, (now - this.ignitionStart) / 1900);
      this.ignition = 1 - Math.pow(1 - t, 3);
    }

    const k = Math.min(1, 0.05 * dt);
    this.cam.zoom = lerp(this.cam.zoom, this.camTarget.zoom, k);
    this.cam.x = lerp(this.cam.x, this.camTarget.x, k);
    this.cam.y = lerp(this.cam.y, this.camTarget.y, k);

    const pe = Math.min(1, 0.08 * dt);
    const px = this.pointer.on ? (this.pointer.x / this.w - 0.5) : 0;
    const py = this.pointer.on ? (this.pointer.y / this.h - 0.5) : 0;
    this.pointerEase.x = lerp(this.pointerEase.x, px, pe);
    this.pointerEase.y = lerp(this.pointerEase.y, py, pe);

    const stiff = 0.028;
    const damp = Math.pow(0.84, dt);
    const drift = Math.min(this.w, this.h) * 0.006;
    const cursorR = 170;

    for (const n of this.nodes) {
      // Staged emergence: deeper nodes appear later.
      const gate = Math.max(0, Math.min(1, (this.ignition - n.depth * 0.18) / 0.4));
      const cx = this.w / 2;
      const cy = this.h / 2;
      const gx = lerp(cx, n.tx, gate);
      const gy = lerp(cy, n.ty, gate);

      const wob = this.time * 0.007 + n.phase;
      const dx = gx + Math.cos(wob) * drift - n.x;
      const dy = gy + Math.sin(wob * 0.8) * drift - n.y;
      n.vx = (n.vx + dx * stiff * dt) * damp;
      n.vy = (n.vy + dy * stiff * dt) * damp;
      n.x += n.vx * dt;
      n.y += n.vy * dt;

      let energy = 0;
      if (this.pointer.on) {
        const ddx = n.x - this.pointer.x;
        const ddy = n.y - this.pointer.y;
        const d = Math.hypot(ddx, ddy);
        if (d < cursorR) energy = 1 - d / cursorR;
      }
      if (this.hover === n.id) energy = 1;
      n.e += (energy - n.e) * Math.min(1, 0.12 * dt);

      const ease = Math.min(1, 0.06 * dt);
      n.a += (n.ta * gate - n.a) * ease;
      n.la += (n.tla * gate - n.la) * ease;
      n.lit += (n.tlit - n.lit) * ease;
    }

    const aGate = Math.max(0, Math.min(1, (this.ignition - 0.45) / 0.55));
    for (const a of this.ambient) {
      const wob = this.time * 0.005 + a.phase;
      const gx = lerp(this.w / 2, a.tx, aGate);
      const gy = lerp(this.h / 2, a.ty, aGate);
      const dx = gx + Math.cos(wob) * drift * 2 - a.x;
      const dy = gy + Math.sin(wob * 0.9) * drift * 2 - a.y;
      a.vx = (a.vx + dx * 0.02 * dt) * damp;
      a.vy = (a.vy + dy * 0.02 * dt) * damp;
      a.x += a.vx * dt;
      a.y += a.vy * dt;
      a.a += (a.ta * aGate - a.a) * Math.min(1, 0.05 * dt);
    }

    // Signals: short-lived dots travelling along lit edges. Decorative.
    for (let i = this.packets.length - 1; i >= 0; i--) {
      const p = this.packets[i]!;
      p.t += p.speed * dt;
      if (p.t >= 1) this.packets.splice(i, 1);
    }
    if (this.ignition > 0.9 && this.packets.length < 5 && Math.random() < 0.02 * dt) {
      this.spawnPacket();
    }
  }

  private spawnPacket() {
    const lit = this.edges.filter(([a, b]) => {
      const na = this.nodes[a]!;
      const nb = this.nodes[b]!;
      return Math.min(na.a, nb.a) > 0.3;
    });
    if (!lit.length) return;
    const [from, to] = lit[(Math.random() * lit.length) | 0]!;
    const flip = Math.random() < 0.5;
    this.packets.push({ from: flip ? to : from, to: flip ? from : to, t: 0, speed: 0.008 + Math.random() * 0.006 });
  }

  /* ── render ─────────────────────────────────────────────────────── */

  private draw() {
    const ctx = this.ctx;
    const z = this.cam.zoom;
    const px = this.pointerEase.x;
    const py = this.pointerEase.y;

    ctx.setTransform(
      this.dpr * z,
      0,
      0,
      this.dpr * z,
      (-(z - 1) * this.w * 0.5 + this.cam.x - px * 10) * this.dpr,
      (-(z - 1) * this.h * 0.5 + this.cam.y - py * 10) * this.dpr,
    );
    ctx.clearRect(-this.w, -this.h, this.w * 3, this.h * 3);

    const par = (depth: number) => ({ dx: -px * depth * 22, dy: -py * depth * 22 });

    /* Ambient lattice links. */
    const linkDist = Math.min(this.w, this.h) * (this.section === "evidence" ? 0.14 : 0.11);
    const linkDist2 = linkDist * linkDist;
    ctx.lineWidth = 1;
    for (let i = 0; i < this.ambient.length; i++) {
      const a = this.ambient[i]!;
      if (a.a < 0.03) continue;
      const pa = par(a.z);
      for (let j = i + 1; j < this.ambient.length; j++) {
        const b = this.ambient[j]!;
        if (b.a < 0.03) continue;
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 > linkDist2) continue;
        const falloff = 1 - Math.sqrt(d2) / linkDist;
        const alpha = 0.07 * falloff * Math.min(a.a, b.a);
        if (alpha < 0.004) continue;
        const pb = par(b.z);
        ctx.strokeStyle = `rgba(${COLOR.muted},${alpha})`;
        ctx.beginPath();
        ctx.moveTo(a.x + pa.dx, a.y + pa.dy);
        ctx.lineTo(b.x + pb.dx, b.y + pb.dy);
        ctx.stroke();
      }
    }

    /* Ambient nodes. */
    for (const a of this.ambient) {
      if (a.a < 0.02) continue;
      const p = par(a.z);
      ctx.fillStyle = `rgba(${COLOR.muted},${a.a * 0.55})`;
      ctx.beginPath();
      ctx.arc(a.x + p.dx, a.y + p.dy, 1.1, 0, Math.PI * 2);
      ctx.fill();
    }

    /* Graph edges. */
    const ortho = this.section === "evidence";
    for (const [ai, bi] of this.edges) {
      const a = this.nodes[ai]!;
      const b = this.nodes[bi]!;
      const base = Math.min(a.a, b.a);
      if (base < 0.03) continue;
      const heat = Math.max(a.lit, b.lit, a.e, b.e);
      const alpha = base * (0.1 + heat * 0.32);
      const pa = par(a.z);
      const pb = par(b.z);
      ctx.strokeStyle = heat > 0.2 ? `rgba(${COLOR.signal},${alpha})` : `rgba(${COLOR.muted},${alpha})`;
      ctx.beginPath();
      const ax = a.x + pa.dx;
      const ay = a.y + pa.dy;
      const bx = b.x + pb.dx;
      const by = b.y + pb.dy;
      if (ortho) {
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, ay);
        ctx.lineTo(bx, by);
      } else {
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
      }
      ctx.stroke();
    }

    /* Packets. */
    for (const p of this.packets) {
      const a = this.nodes[p.from]!;
      const b = this.nodes[p.to]!;
      const fade = Math.sin(p.t * Math.PI) * Math.min(a.a, b.a);
      if (fade < 0.02) continue;
      const pa = par(a.z);
      const pb = par(b.z);
      ctx.fillStyle = `rgba(${COLOR.signal},${0.9 * fade})`;
      ctx.beginPath();
      ctx.arc(
        lerp(a.x + pa.dx, b.x + pb.dx, p.t),
        lerp(a.y + pa.dy, b.y + pb.dy, p.t),
        1.6,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }

    /* Graph nodes and labels. */
    ctx.font = `500 10px ${getComputedStyle(this.canvas).getPropertyValue("--font-mono") || "ui-monospace, monospace"}`;
    ctx.textBaseline = "middle";
    for (const n of this.nodes) {
      if (n.a < 0.02) continue;
      const p = par(n.z);
      const x = n.x + p.dx;
      const y = n.y + p.dy;
      const heat = Math.max(n.lit, n.e);
      const r = 1.3 + n.weight * 2.1 + heat * 1.4;
      const color = kindColor(n.kind);
      const alpha = n.a * (0.5 + heat * 0.5);

      if (heat > 0.25) {
        const g = ctx.createRadialGradient(x, y, 0, x, y, r * 6);
        g.addColorStop(0, `rgba(${color},${0.22 * (heat - 0.25) * n.a})`);
        g.addColorStop(1, `rgba(${color},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, r * 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = `rgba(${color},${0.35 * heat * n.a})`;
        ctx.beginPath();
        ctx.arc(x, y, r + 4 + heat * 3, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.fillStyle = `rgba(${color},${alpha})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();

      const la = Math.max(n.la, n.e * 0.9) * n.a;
      if (la > 0.04) {
        const text = n.kind === "project" || n.kind === "root" ? n.label.toUpperCase() : n.label;
        ctx.fillStyle = `rgba(${n.kind === "root" ? COLOR.ink : heat > 0.3 ? COLOR.ink : COLOR.faint},${Math.min(0.9, la)})`;
        ctx.fillText(text, x + r + 7, y + 0.5);
      }
    }

    // Opening pulse before the field emerges.
    if (this.ignition < 0.35) {
      const t = (this.time * 0.02) % 1;
      const a = (1 - this.ignition / 0.35) * 0.5;
      ctx.strokeStyle = `rgba(${COLOR.accent},${(1 - t) * a})`;
      ctx.beginPath();
      ctx.arc(this.w / 2, this.h / 2, 6 + t * 40, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = `rgba(${COLOR.accent},${a * 1.6})`;
      ctx.beginPath();
      ctx.arc(this.w / 2, this.h / 2, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
    this.dirty = false;
  }
}

export { graphNodeById };

import { graphNodes, graphEdges, type GraphKind } from "@/content/graph";
import type { DomainId, ProjectSlug } from "@/lib/types";
import { lerp, seeded } from "@/lib/utils";
import {
  ambientTargets,
  formation,
  maxDepth,
  nodeDepth,
  type Camera,
  type FormationName,
  type Stage,
  type Target,
  type Viewport,
} from "./formations";

/* ══════════════════════════════════════════════════════════════════════
 *  LIVING SYSTEM ENGINE
 *
 *  One canvas for the whole site. Imperative on purpose: React pushes
 *  state in through the setters and nothing re-renders per frame.
 *
 *  What it draws, back to front:
 *    1. a light field — two soft radial lights, one following the
 *       pointer, one drifting on its own, tinted by the section
 *    2. an ambient lattice at far depth, linked by proximity
 *    3. graph edges, straight or orthogonally routed per formation
 *    4. signals flowing along edges, each with a fading trail
 *    5. nodes, sized and hazed by depth, with rings when lit
 *    6. pulses — occasional wavefronts that travel outward from the
 *       root through the graph, lighting each ring as they pass
 *
 *  Depth is real: every node carries a z (0.15 far – 1 near) that scales
 *  its parallax offset, its radius and how much it fades into the haze.
 *
 *  Cost control: DPR capped at 2 (1.5 coarse); ambient count from
 *  viewport area, halved on touch and again on a low-power device;
 *  squared-distance early-out on lattice links; the loop stops when the
 *  tab is hidden; reduced motion draws one static frame per state change.
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
  z: number;
  tz: number;
  /** Pointer energy, eased. */
  e: number;
  /** Pulse energy, decays on its own. */
  pulse: number;
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

interface Signal {
  edge: number;
  /** 0–1 along the edge; direction is baked into from/to. */
  t: number;
  speed: number;
  reverse: boolean;
  hue: number;
}

interface Pulse {
  /** Wavefront position in BFS depth units. */
  front: number;
  life: number;
}

const RGB = {
  ink: [232, 236, 242],
  muted: [163, 173, 191],
  faint: [125, 135, 153],
  accent: [79, 124, 255],
  signal: [63, 210, 240],
  violet: [139, 124, 246],
  teal: [64, 196, 190],
} as const;

type Rgb = readonly [number, number, number] | number[];
const rgba = (c: Rgb, a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const mix = (a: Rgb, b: Rgb, t: number): number[] => [
  Math.round(lerp(a[0]!, b[0]!, t)),
  Math.round(lerp(a[1]!, b[1]!, t)),
  Math.round(lerp(a[2]!, b[2]!, t)),
];

function kindColor(kind: GraphKind): Rgb {
  switch (kind) {
    case "root":
      return RGB.ink;
    case "domain":
      return RGB.signal;
    case "project":
      return RGB.accent;
    case "service":
      return RGB.teal;
    case "evidence":
      return RGB.violet;
    default:
      return RGB.muted;
  }
}

export interface EngineOptions {
  reduced: boolean;
  coarse: boolean;
  /** Few cores or little memory: halve the field again and drop the lights. */
  lowPower: boolean;
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
  private signals: Signal[] = [];
  private pulses: Pulse[] = [];

  private cam: Camera = { zoom: 1, x: 0, y: 0, tilt: 0 };
  private camTarget: Camera = { zoom: 1, x: 0, y: 0, tilt: 0 };

  private section: FormationName = "introduction";
  /** While the opening sequence runs it owns the field outright. */
  private intro: FormationName | null = null;
  private progress = 0;
  private phase = 1;
  private focus: ProjectSlug | null = null;
  private domain: DomainId | null = null;
  private hover: string | null = null;
  private stage: Stage | null = null;

  private mood = 0.15;
  private moodTarget = 0.15;
  private flow = 0.5;
  private flowTarget = 0.5;
  private routed = 0;
  private routedTarget = 0;

  private pointer = { x: 0, y: 0, on: false };
  private pointerEase = { x: 0, y: 0 };
  /** Light position in pixels, eased — trails the pointer. */
  private light = { x: 0, y: 0 };

  private ignition = 0;
  private ignited = false;
  private ignitionStart = 0;

  /** Cached once per resize: reading it per frame forces a style recalc,
   *  which on a page with pinned and sticky elements costs more than the
   *  entire rest of the frame. */
  private labelFont = "500 10px ui-monospace, monospace";

  private raf = 0;
  private running = false;
  private visible = true;
  private last = 0;
  private time = 0;
  private nextPulse = 900;
  private signalAccum = 0;

  constructor(canvas: HTMLCanvasElement, opts: EngineOptions) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) throw new Error("2d context unavailable");
    this.ctx = ctx;
    this.opts = opts;

    this.build();
    this.resize();
    if (opts.reduced) {
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

  /** Driven only by the opening sequence. null releases the field back
   *  to whatever section the visitor is looking at. */
  setIntroScene(scene: FormationName | null) {
    if (scene === this.intro) return;
    this.intro = scene;
    // The opening owns the gate too: the field is "on" from the first
    // beat, it is simply collapsed at the centre until emerge.
    if (scene) this.ignite();
    this.retarget();
    if (this.opts.reduced) {
      this.snap();
      this.draw();
    }
  }

  setSection(name: FormationName, progress: number) {
    const changed = name !== this.section;
    this.section = name;
    this.progress = progress;
    this.retarget();
    if (changed && !this.intro) {
      // A section change is a large-scale event: send a wave through it.
      if (!this.opts.reduced) this.pulses.push({ front: -0.4, life: 1 });
      if (this.opts.reduced) {
        this.snap();
        this.draw();
      }
    }
  }

  setPhase(value: number) {
    const next = Math.max(0, Math.min(1, value));
    if (Math.abs(next - this.phase) < 0.004) return;
    this.phase = next;
    if (this.section === "work") this.retarget();
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

  /** The signature section's selected domain. */
  setDomain(id: DomainId | null) {
    if (id === this.domain) return;
    this.domain = id;
    this.retarget();
    if (!this.opts.reduced && id) this.pulses.push({ front: 0, life: 1 });
    if (this.opts.reduced) {
      this.snap();
      this.draw();
    }
  }

  setHover(id: string | null) {
    this.hover = id;
  }

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
    if (!this.light.x) {
      this.light = { x: this.w * 0.5, y: this.h * 0.4 };
    }

    const mono = getComputedStyle(this.canvas).getPropertyValue("--font-geist-mono").trim();
    this.labelFont = `500 10px ${mono || "ui-monospace, monospace"}`;

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
      z: 0.5,
      tz: 0.5,
      e: 0,
      pulse: 0,
      phase: seeded(i * 5.3 + 2) * Math.PI * 2,
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
    let n = Math.round(Math.min(96, Math.max(26, area / 24000)));
    if (this.opts.coarse) n = Math.round(n * 0.5);
    if (this.opts.lowPower) n = Math.round(n * 0.6);
    return n;
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
      z: 0.12 + seeded(i * 11.9 + 4) * 0.42,
      phase: seeded(i * 13.1 + 6) * Math.PI * 2,
    }));
  }

  private viewport(): Viewport {
    return { w: this.w, h: this.h, narrow: this.narrow };
  }

  private retarget() {
    const { t, cam, mood, flow, routed } = formation(this.viewport(), {
      name: this.intro ?? this.section,
      progress: this.progress,
      phase: this.phase,
      focus: this.focus,
      domain: this.domain,
      hover: this.hover,
      stage: this.stage,
    });

    // Labelled nodes never run under the rail or off the edges.
    const minX = 22;
    const maxX = this.narrow ? this.w - 22 : this.w - 232;
    for (const n of this.nodes) {
      const target: Target | undefined = t[n.id];
      if (!target) continue;
      n.tx = target.la > 0.05 ? Math.min(maxX, Math.max(minX, target.x)) : target.x;
      n.ty = Math.min(this.h - 14, Math.max(14, target.y));
      n.ta = target.a;
      n.tla = target.la;
      n.tlit = target.lit;
      n.tz = target.z;
    }

    const amb = ambientTargets(this.viewport(), this.ambient.length, this.section, this.progress);
    this.ambient.forEach((a, i) => {
      const target = amb[i];
      if (!target) return;
      a.tx = target.x;
      a.ty = target.y;
      a.ta = target.a;
      a.z = target.z;
    });

    this.camTarget = cam;
    this.moodTarget = mood;
    this.flowTarget = this.opts.lowPower ? flow * 0.4 : flow;
    this.routedTarget = routed;
  }

  private snap() {
    for (const n of this.nodes) {
      n.x = n.tx;
      n.y = n.ty;
      n.vx = n.vy = 0;
      n.a = n.ta;
      n.la = n.tla;
      n.lit = n.tlit;
      n.z = n.tz;
    }
    for (const a of this.ambient) {
      a.x = a.tx;
      a.y = a.ty;
      a.vx = a.vy = 0;
      a.a = a.ta;
    }
    this.cam = { ...this.camTarget };
    this.mood = this.moodTarget;
    this.routed = this.routedTarget;
    this.signals = [];
    this.pulses = [];
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
    if (this.ignited && this.ignition < 1) {
      const t = Math.min(1, (now - this.ignitionStart) / 2000);
      this.ignition = 1 - Math.pow(1 - t, 3);
      if (this.ignition > 0.55 && !this.pulses.length) this.pulses.push({ front: -0.2, life: 1 });
    }

    const k = Math.min(1, 0.05 * dt);
    this.cam.zoom = lerp(this.cam.zoom, this.camTarget.zoom, k);
    this.cam.x = lerp(this.cam.x, this.camTarget.x, k);
    this.cam.y = lerp(this.cam.y, this.camTarget.y, k);
    this.cam.tilt = lerp(this.cam.tilt, this.camTarget.tilt, k);
    this.mood = lerp(this.mood, this.moodTarget, k * 0.8);
    this.flow = lerp(this.flow, this.flowTarget, k);
    this.routed = lerp(this.routed, this.routedTarget, k * 0.7);

    // Pointer parallax, and a light that trails behind the cursor.
    const pe = Math.min(1, 0.075 * dt);
    const px = this.pointer.on ? this.pointer.x / this.w - 0.5 : 0;
    const py = this.pointer.on ? this.pointer.y / this.h - 0.5 : 0;
    this.pointerEase.x = lerp(this.pointerEase.x, px, pe);
    this.pointerEase.y = lerp(this.pointerEase.y, py, pe);
    const lx = this.pointer.on ? this.pointer.x : this.w * 0.5;
    const ly = this.pointer.on ? this.pointer.y : this.h * 0.42;
    this.light.x = lerp(this.light.x, lx, Math.min(1, 0.045 * dt));
    this.light.y = lerp(this.light.y, ly, Math.min(1, 0.045 * dt));

    const stiff = 0.03;
    const damp = Math.pow(0.845, dt);
    const drift = Math.min(this.w, this.h) * 0.006;
    const cursorR = 190;

    for (const n of this.nodes) {
      // Staged emergence: rings of the graph light up in turn.
      const gate = Math.max(0, Math.min(1, (this.ignition - n.depth * 0.16) / 0.42));
      const gx = lerp(this.w / 2, n.tx, gate);
      const gy = lerp(this.h / 2, n.ty, gate);

      const wob = this.time * 0.0075 + n.phase;
      const dx = gx + Math.cos(wob) * drift - n.x;
      const dy = gy + Math.sin(wob * 0.82) * drift - n.y;
      n.vx = (n.vx + dx * stiff * dt) * damp;
      n.vy = (n.vy + dy * stiff * dt) * damp;
      n.x += n.vx * dt;
      n.y += n.vy * dt;

      let energy = 0;
      if (this.pointer.on) {
        const ddx = n.x - this.pointer.x;
        const ddy = n.y - this.pointer.y;
        const d = Math.hypot(ddx, ddy);
        if (d < cursorR) energy = (1 - d / cursorR) * n.z;
      }
      if (this.hover === n.id) energy = 1;
      n.e += (energy - n.e) * Math.min(1, 0.12 * dt);
      n.pulse *= Math.pow(0.955, dt);

      const ease = Math.min(1, 0.062 * dt);
      n.a += (n.ta * gate - n.a) * ease;
      n.la += (n.tla * gate - n.la) * ease;
      n.lit += (n.tlit - n.lit) * ease;
      n.z += (n.tz - n.z) * ease;
    }

    const aGate = Math.max(0, Math.min(1, (this.ignition - 0.4) / 0.6));
    for (const a of this.ambient) {
      const wob = this.time * 0.0052 + a.phase;
      const gx = lerp(this.w / 2, a.tx, aGate);
      const gy = lerp(this.h / 2, a.ty, aGate);
      const dx = gx + Math.cos(wob) * drift * 2.2 - a.x;
      const dy = gy + Math.sin(wob * 0.9) * drift * 2.2 - a.y;
      a.vx = (a.vx + dx * 0.021 * dt) * damp;
      a.vy = (a.vy + dy * 0.021 * dt) * damp;
      a.x += a.vx * dt;
      a.y += a.vy * dt;
      a.a += (a.ta * aGate - a.a) * Math.min(1, 0.05 * dt);
    }

    this.stepSignals(dt);
    this.stepPulses(dt);
  }

  /** Signals flow continuously along whichever edges are currently lit. */
  private stepSignals(dt: number) {
    for (let i = this.signals.length - 1; i >= 0; i--) {
      const s = this.signals[i]!;
      s.t += s.speed * dt;
      if (s.t >= 1) this.signals.splice(i, 1);
    }
    if (this.ignition < 0.85) return;

    const cap = this.opts.lowPower ? 6 : this.opts.coarse ? 8 : 16;
    this.signalAccum += this.flow * dt * 0.018;
    while (this.signalAccum >= 1 && this.signals.length < cap) {
      this.signalAccum -= 1;
      this.spawnSignal();
    }
    if (this.signalAccum > 3) this.signalAccum = 3;
  }

  private spawnSignal() {
    // Pick among edges whose ends are actually visible, so signals always
    // travel along something the visitor can see.
    let best = -1;
    let bestScore = 0;
    for (let k = 0; k < 10; k++) {
      const i = (Math.random() * this.edges.length) | 0;
      const e = this.edges[i];
      if (!e) continue;
      const a = this.nodes[e[0]]!;
      const b = this.nodes[e[1]]!;
      const score = Math.min(a.a, b.a) * (0.4 + Math.max(a.lit, b.lit));
      if (score > bestScore) {
        bestScore = score;
        best = i;
      }
    }
    if (best < 0 || bestScore < 0.12) return;
    this.signals.push({
      edge: best,
      t: 0,
      speed: 0.009 + Math.random() * 0.008,
      reverse: Math.random() < 0.45,
      hue: Math.random(),
    });
  }

  /** A pulse is a wavefront in BFS-depth space travelling out from Sujith. */
  private stepPulses(dt: number) {
    this.nextPulse -= dt;
    if (this.nextPulse <= 0 && this.ignition > 0.9) {
      this.nextPulse = 780 + Math.random() * 640;
      this.pulses.push({ front: -0.3, life: 1 });
    }
    if (!this.pulses.length) return;

    for (let i = this.pulses.length - 1; i >= 0; i--) {
      const p = this.pulses[i]!;
      p.front += dt * 0.022;
      if (p.front > maxDepth + 1.2) {
        this.pulses.splice(i, 1);
        continue;
      }
      for (const n of this.nodes) {
        if (n.a < 0.05) continue;
        const d = Math.abs(n.depth - p.front);
        if (d < 0.55) n.pulse = Math.max(n.pulse, (1 - d / 0.55) * p.life);
      }
    }
  }

  /* ── render ────────────────────────────────────────────────────── */

  /** The section palette: cool blue at rest, cyan when the field is busy. */
  private tint(): number[] {
    return mix(RGB.accent, RGB.signal, Math.min(1, this.mood));
  }

  /** Where the light should be and what colour, for the composited layer. */
  readLight() {
    const t = this.tint();
    return {
      x: this.light.x,
      y: this.light.y,
      rgb: `${t[0]},${t[1]},${t[2]}`,
      intensity: (0.06 + this.mood * 0.05) * this.ignition,
    };
  }

  private draw() {
    const ctx = this.ctx;
    const z = this.cam.zoom;
    const px = this.pointerEase.x;
    const py = this.pointerEase.y;

    // Kept so labels can be culled in screen space further down.
    const ox = -(z - 1) * this.w * 0.5 + this.cam.x - px * 12;
    const oy = -(z - 1) * this.h * 0.5 + this.cam.y - py * 12;
    ctx.setTransform(this.dpr * z, 0, 0, this.dpr * z, ox * this.dpr, oy * this.dpr);
    ctx.clearRect(-this.w, -this.h, this.w * 3, this.h * 3);

    const tint = this.tint();
    const par = (depth: number) => ({ dx: -px * depth * 34, dy: -py * depth * 34 });

    /* 1 — the light field is no longer drawn here. It is a composited
     * DOM layer in the provider, driven by CSS custom properties this
     * engine publishes below, so it costs the canvas nothing. */

    /* 2 — ambient lattice. */
    const linkDist = Math.min(this.w, this.h) * (this.routed > 0.5 ? 0.13 : 0.105);
    const linkDist2 = linkDist * linkDist;
    ctx.lineWidth = 1;
    for (let i = 0; i < this.ambient.length; i++) {
      const a = this.ambient[i]!;
      if (a.a < 0.03) continue;
      const pa = par(a.z);
      for (let j = i + 1; j < this.ambient.length; j++) {
        const b = this.ambient[j]!;
        if (b.a < 0.03) continue;
        const ddx = a.x - b.x;
        const ddy = a.y - b.y;
        const d2 = ddx * ddx + ddy * ddy;
        if (d2 > linkDist2) continue;
        const falloff = 1 - Math.sqrt(d2) / linkDist;
        const depth = (a.z + b.z) * 0.5;
        const alpha = 0.075 * falloff * Math.min(a.a, b.a) * (0.5 + depth);
        if (alpha < 0.004) continue;
        const pb = par(b.z);
        ctx.strokeStyle = rgba(RGB.muted, alpha);
        ctx.beginPath();
        ctx.moveTo(a.x + pa.dx, a.y + pa.dy);
        ctx.lineTo(b.x + pb.dx, b.y + pb.dy);
        ctx.stroke();
      }
    }
    for (const a of this.ambient) {
      if (a.a < 0.02) continue;
      const p = par(a.z);
      ctx.fillStyle = rgba(RGB.muted, a.a * 0.5 * (0.35 + a.z));
      ctx.beginPath();
      ctx.arc(a.x + p.dx, a.y + p.dy, 0.7 + a.z * 1.1, 0, Math.PI * 2);
      ctx.fill();
    }

    /* 3 — graph edges. `routed` morphs them into orthogonal pathways,
     * which is what turns the field into an infrastructure topology. */
    const routed = this.routed;
    for (const [ai, bi] of this.edges) {
      const a = this.nodes[ai]!;
      const b = this.nodes[bi]!;
      const base = Math.min(a.a, b.a);
      if (base < 0.03) continue;
      const heat = Math.max(a.lit, b.lit, a.e, b.e, a.pulse, b.pulse);
      const depth = (a.z + b.z) * 0.5;
      const alpha = base * (0.08 + heat * 0.34) * (0.45 + depth * 0.55);
      if (alpha < 0.004) continue;
      const pa = par(a.z);
      const pb = par(b.z);
      const ax = a.x + pa.dx;
      const ay = a.y + pa.dy;
      const bx = b.x + pb.dx;
      const by = b.y + pb.dy;
      ctx.strokeStyle = heat > 0.2 ? rgba(tint, alpha) : rgba(RGB.muted, alpha);
      ctx.lineWidth = heat > 0.55 ? 1.4 : 1;
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      if (routed > 0.02) {
        // Blend between a straight line and an elbow so the change reads
        // as the network re-routing itself rather than snapping.
        const midY = ay + (by - ay) * 0.5;
        const ex = lerp(bx, ax, 1 - routed);
        ctx.lineTo(lerp(bx, ex, routed), lerp(by, midY, routed));
        ctx.lineTo(lerp(bx, bx, routed), lerp(by, midY, routed));
      }
      ctx.lineTo(bx, by);
      ctx.stroke();
    }

    /* 4 — signals, each with a short fading trail. */
    for (const s of this.signals) {
      const e = this.edges[s.edge];
      if (!e) continue;
      const a = this.nodes[s.reverse ? e[1] : e[0]]!;
      const b = this.nodes[s.reverse ? e[0] : e[1]]!;
      const vis = Math.min(a.a, b.a);
      if (vis < 0.04) continue;
      const pa = par(a.z);
      const pb = par(b.z);
      const ax = a.x + pa.dx;
      const ay = a.y + pa.dy;
      const bx = b.x + pb.dx;
      const by = b.y + pb.dy;
      const colour = s.hue > 0.7 ? RGB.violet : tint;
      for (let k = 0; k < 4; k++) {
        const tt = s.t - k * 0.035;
        if (tt < 0) break;
        const fade = Math.sin(Math.min(1, tt) * Math.PI) * vis * (1 - k * 0.24);
        if (fade < 0.03) continue;
        ctx.fillStyle = rgba(colour, 0.85 * fade);
        ctx.beginPath();
        ctx.arc(lerp(ax, bx, tt), lerp(ay, by, tt), 1.8 - k * 0.35, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    /* 5 — nodes. Radius and haze scale with depth. */
    ctx.font = this.labelFont;
    ctx.textBaseline = "middle";
    for (const n of this.nodes) {
      if (n.a < 0.02) continue;
      const p = par(n.z);
      const x = n.x + p.dx;
      const y = n.y + p.dy;
      const heat = Math.max(n.lit, n.e, n.pulse);
      const r = (0.9 + n.weight * 2.2 + heat * 1.5) * (0.55 + n.z * 0.55);
      const colour = kindColor(n.kind);
      const hot = mix(colour, tint, Math.min(0.6, heat));
      // Far nodes sink into the background rather than just shrinking.
      const alpha = n.a * (0.38 + heat * 0.62) * (0.45 + n.z * 0.55);

      if (heat > 0.22) {
        const g = ctx.createRadialGradient(x, y, 0, x, y, r * 7);
        g.addColorStop(0, rgba(hot, 0.24 * (heat - 0.22) * n.a));
        g.addColorStop(1, rgba(hot, 0));
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, r * 7, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = rgba(hot, 0.34 * heat * n.a);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(x, y, r + 4.5 + heat * 4, 0, Math.PI * 2);
        ctx.stroke();
      }
      if (n.pulse > 0.08) {
        ctx.strokeStyle = rgba(tint, 0.3 * n.pulse * n.a);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(x, y, r + 6 + (1 - n.pulse) * 26, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.fillStyle = rgba(hot, alpha);
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();

      const la = Math.max(n.la, n.e * 0.85) * n.a;
      // Cull in screen space: the camera zoom and pan mean a node inside
      // the viewport can still render a label off the edge, or under the
      // navigation rail on the right.
      const sx = x * z + ox;
      const sy = y * z + oy;
      const labelFits =
        sx > 14 && sx < this.w - (this.narrow ? 90 : 240) && sy > 16 && sy < this.h - 14;
      if (la > 0.04 && labelFits) {
        const text =
          n.kind === "project" || n.kind === "root" || n.kind === "domain"
            ? n.label.toUpperCase()
            : n.label;
        const shade = heat > 0.3 ? RGB.ink : RGB.faint;
        ctx.fillStyle = rgba(shade, Math.min(0.92, la));
        ctx.fillText(text, x + r + 8, y + 0.5);
      }
    }

    /* 6 — the opening pulse, before the field exists. */
    if (this.ignition < 0.32) {
      const t = (this.time * 0.018) % 1;
      const a = (1 - this.ignition / 0.32) * 0.55;
      ctx.strokeStyle = rgba(tint, (1 - t) * a);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(this.w / 2, this.h / 2, 6 + t * 46, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = rgba(tint, a * 1.5);
      ctx.beginPath();
      ctx.arc(this.w / 2, this.h / 2, 2.6, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

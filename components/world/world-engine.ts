import { SCENES, TOPOLOGY_EDGES, type SceneName, type SceneParams } from "./scenes";

/* ══════════════════════════════════════════════════════════════════════
 *  WORLD ENGINE
 *
 *  One canvas, one node field, for the whole page. Imperative on purpose:
 *  React never re-renders per frame, it only pushes state in through the
 *  setters below.
 *
 *  Cost control:
 *   • node count scales with viewport area and halves on coarse pointers
 *   • DPR capped (2 desktop / 1.5 touch)
 *   • links use squared distance and a spatial early-out
 *   • rAF stops entirely when the tab is hidden
 *   • reduced motion draws one frame and never starts the loop
 * ══════════════════════════════════════════════════════════════════════ */

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  tx: number;
  ty: number;
  /** Per-node alpha multiplier set by the scene. */
  ta: number;
  a: number;
  r: number;
  /** Highlight energy, eased. */
  e: number;
  /** Stable per-node randoms so layouts are deterministic. */
  r1: number;
  r2: number;
  /** Phase offset for idle drift. */
  p: number;
  /** Cluster index, used by the projects scene for focus. */
  cluster: number;
}

interface Packet {
  a: number;
  b: number;
  t: number;
  speed: number;
}

const ACCENT = "69,212,238";
const NEUTRAL = "165,182,200";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export class WorldEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private w = 0;
  private h = 0;
  private dpr = 1;
  private nodes: Node[] = [];
  private packets: Packet[] = [];

  private raf = 0;
  private running = false;
  private visible = true;
  private reduced = false;
  private coarse = false;

  private scene: SceneName = "boot";
  private params: SceneParams = { ...SCENES.boot };
  private targetParams: SceneParams = { ...SCENES.boot };

  /** 0..1 down the document — drives the subtle depth push. */
  private progress = 0;
  private depth = 0;

  /** Cluster index to highlight (projects scene), or -1. */
  private focus = -1;
  private focusEase = 0;

  private pointer = { x: -9999, y: -9999, on: false };
  private scanY = 0;
  private time = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) throw new Error("2d context unavailable");
    this.ctx = ctx;

    this.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.coarse = window.matchMedia("(pointer: coarse)").matches;

    this.resize();
    this.applyScene(this.reduced ? "calm" : "boot", true);
    // Reduced motion gets one frozen frame of the same field rather than a
    // blank canvas — the visual language is kept, the motion is not.
    if (this.reduced) this.snap();
    this.draw(0);
    if (!this.reduced) this.start();
  }

  /* ── public API ───────────────────────────────────────────────────── */

  setScene(name: SceneName) {
    if (this.reduced || name === this.scene) return;
    this.applyScene(name, false);
  }

  /** -1 clears. Lights one cluster in the projects scene. */
  setFocus(index: number) {
    this.focus = index;
  }

  setProgress(p: number) {
    this.progress = p;
  }

  resize = () => {
    const rect = this.canvas.getBoundingClientRect();
    this.w = Math.max(1, rect.width);
    this.h = Math.max(1, rect.height);
    this.dpr = Math.min(window.devicePixelRatio || 1, this.coarse ? 1.5 : 2);
    this.canvas.width = Math.round(this.w * this.dpr);
    this.canvas.height = Math.round(this.h * this.dpr);

    const want = this.nodeCount();
    if (this.nodes.length !== want) this.build(want);
    else this.retarget();

    if (this.reduced) {
      this.snap();
      this.draw(0);
    }
  };

  destroy() {
    this.stop();
  }

  start = () => {
    if (this.running || this.reduced || !this.visible) return;
    this.running = true;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.loop);
  };

  stop = () => {
    this.running = false;
    cancelAnimationFrame(this.raf);
  };

  setVisible(v: boolean) {
    this.visible = v;
    if (v) this.start();
    else this.stop();
  }

  setPointer(x: number, y: number, on: boolean) {
    if (this.coarse) return;
    this.pointer.x = x;
    this.pointer.y = y;
    this.pointer.on = on;
  }

  /* ── internals ────────────────────────────────────────────────────── */

  private nodeCount() {
    const area = this.w * this.h;
    const n = Math.round(Math.min(72, Math.max(20, area / 21000)));
    return this.coarse ? Math.round(n * 0.45) : n;
  }

  private build(n: number) {
    this.nodes = Array.from({ length: n }, (_, i) => {
      const r1 = rand(i * 2 + 1);
      const r2 = rand(i * 2 + 2);
      return {
        x: this.w / 2,
        y: this.h / 2,
        vx: 0,
        vy: 0,
        tx: this.w / 2,
        ty: this.h / 2,
        ta: 1,
        a: 0,
        r: r1 < 0.16 ? 1.9 : 1.05,
        e: 0,
        r1,
        r2,
        p: r2 * Math.PI * 2,
        cluster: i % 5,
      };
    });
    this.packets = [];
    this.retarget();
  }

  /** Place every node on its target immediately, with no spring. */
  private snap() {
    for (const nd of this.nodes) {
      nd.x = nd.tx;
      nd.y = nd.ty;
      nd.vx = 0;
      nd.vy = 0;
      nd.a = nd.ta;
    }
  }

  private applyScene(name: SceneName, immediate: boolean) {
    this.scene = name;
    this.targetParams = { ...SCENES[name] };
    if (immediate) this.params = { ...SCENES[name] };
    this.retarget();
  }

  private retarget() {
    const s = SCENES[this.scene];
    const aspect = this.w / Math.max(1, this.h);
    const n = this.nodes.length;
    for (let i = 0; i < n; i++) {
      const node = this.nodes[i];
      const p = s.layout(i, n, node.r1, node.r2, aspect);
      node.tx = p.x * this.w;
      node.ty = p.y * this.h;
      node.ta = p.a ?? 1;
    }
  }

  private last = 0;

  private loop = (now: number) => {
    // Clamp dt so a backgrounded tab does not fling the springs on return.
    const dt = Math.min(2.5, (now - this.last) / 16.667) || 1;
    this.last = now;
    this.time += dt;
    this.step(dt);
    this.draw(dt);
    this.raf = requestAnimationFrame(this.loop);
  };

  private step(dt: number) {
    // Ease render parameters toward the incoming scene — this is what makes
    // a scene change read as a dissolve rather than a cut.
    const k = Math.min(1, 0.055 * dt);
    const p = this.params;
    const t = this.targetParams;
    p.linkDist = lerp(p.linkDist, t.linkDist, k);
    p.linkAlpha = lerp(p.linkAlpha, t.linkAlpha, k);
    p.nodeAlpha = lerp(p.nodeAlpha, t.nodeAlpha, k);
    p.drift = lerp(p.drift, t.drift, k);
    p.packets = lerp(p.packets, t.packets, k);
    p.scan = lerp(p.scan, t.scan, k);
    p.stiffness = lerp(p.stiffness, t.stiffness, k);
    p.tree = lerp(p.tree, t.tree, k);

    this.depth = lerp(this.depth, this.progress, Math.min(1, 0.06 * dt));
    this.focusEase = lerp(this.focusEase, this.focus >= 0 ? 1 : 0, Math.min(1, 0.09 * dt));

    const stiff = p.stiffness;
    const damp = Math.pow(0.86, dt);
    const driftPx = p.drift * Math.min(this.w, this.h);
    const cursorR = 170;

    for (let i = 0; i < this.nodes.length; i++) {
      const nd = this.nodes[i];

      // Idle wander keeps the field alive without a physics simulation.
      const wob = this.time * 0.006 + nd.p;
      const dx = nd.tx + Math.cos(wob) * driftPx * 40 - nd.x;
      const dy = nd.ty + Math.sin(wob * 0.83) * driftPx * 40 - nd.y;

      nd.vx = (nd.vx + dx * stiff * dt) * damp;
      nd.vy = (nd.vy + dy * stiff * dt) * damp;
      nd.x += nd.vx * dt;
      nd.y += nd.vy * dt;

      // Highlight: pointer proximity, plus cluster focus in the projects scene.
      let energy = 0;
      if (this.pointer.on) {
        const px = nd.x - this.pointer.x;
        const py = nd.y - this.pointer.y;
        const d = Math.hypot(px, py);
        if (d < cursorR) energy = 1 - d / cursorR;
      }
      if (this.focus >= 0 && nd.cluster === this.focus) {
        // Deliberately short of full energy: a cluster lighting up should
        // register peripherally, not pull the eye off the copy.
        energy = Math.max(energy, this.focusEase * 0.55);
      }
      nd.e += (energy - nd.e) * Math.min(1, 0.1 * dt);

      const targetA = nd.ta;
      nd.a += (targetA - nd.a) * Math.min(1, 0.06 * dt);
    }

    // Packets
    for (let i = this.packets.length - 1; i >= 0; i--) {
      const pk = this.packets[i];
      pk.t += pk.speed * dt;
      if (pk.t >= 1) this.packets.splice(i, 1);
    }
    if (p.packets > 0.004 && this.packets.length < 6 && Math.random() < p.packets * dt) {
      this.spawnPacket(p.linkDist * Math.min(this.w, this.h));
    }

    if (p.scan > 0.02) {
      this.scanY = (this.scanY + dt * 1.6) % (this.h + 240);
    }
  }

  private spawnPacket(dist: number) {
    const n = this.nodes.length;
    if (n < 2) return;
    const a = (Math.random() * n) | 0;
    for (let k = 0; k < 6; k++) {
      const b = (Math.random() * n) | 0;
      if (b === a) continue;
      const dx = this.nodes[a].x - this.nodes[b].x;
      const dy = this.nodes[a].y - this.nodes[b].y;
      if (dx * dx + dy * dy < dist * dist) {
        this.packets.push({ a, b, t: 0, speed: 0.006 + Math.random() * 0.006 });
        return;
      }
    }
  }

  private draw(dt: number) {
    const ctx = this.ctx;
    const p = this.params;

    // Depth: a small push-in as the page advances. One transform, no cost.
    const s = 1 + this.depth * 0.07;
    ctx.setTransform(
      this.dpr * s,
      0,
      0,
      this.dpr * s,
      (-(s - 1) * this.w * 0.5) * this.dpr,
      (-(s - 1) * this.h * 0.5) * this.dpr,
    );
    ctx.clearRect(0, 0, this.w, this.h);

    const dist = p.linkDist * Math.min(this.w, this.h);
    const dist2 = dist * dist;
    const distanceWeight = 1 - p.tree;

    /* Links — distance-based. */
    if (p.linkAlpha > 0.002 && distanceWeight > 0.01) {
      ctx.lineWidth = 1;
      for (let i = 0; i < this.nodes.length; i++) {
        const a = this.nodes[i];
        if (a.a < 0.05) continue;
        for (let j = i + 1; j < this.nodes.length; j++) {
          const b = this.nodes[j];
          if (b.a < 0.05) continue;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > dist2) continue;
          const falloff = 1 - Math.sqrt(d2) / dist;
          const heat = Math.max(a.e, b.e);
          const alpha =
            (p.linkAlpha * falloff + heat * 0.22 * falloff) *
            distanceWeight *
            a.a *
            b.a;
          if (alpha < 0.003) continue;
          ctx.strokeStyle = `rgba(${heat > 0.06 ? ACCENT : NEUTRAL},${alpha})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    /* Links — the explicit home-lab tree, cross-faded in. */
    if (p.tree > 0.01) {
      ctx.lineWidth = 1;
      for (const [ai, bi] of TOPOLOGY_EDGES) {
        const a = this.nodes[ai];
        const b = this.nodes[bi];
        if (!a || !b) continue;
        const alpha = 0.16 * p.tree;
        ctx.strokeStyle = `rgba(${ACCENT},${alpha})`;
        ctx.beginPath();
        // Orthogonal elbow, matching the diagram in the case file.
        if (Math.abs(a.x - b.x) < 2) {
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
        } else {
          const mid = a.y + (b.y - a.y) * 0.45;
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(a.x, mid);
          ctx.lineTo(b.x, mid);
          ctx.lineTo(b.x, b.y);
        }
        ctx.stroke();
      }
    }

    /* Scan band. */
    if (p.scan > 0.02) {
      const y = this.scanY - 120;
      const g = ctx.createLinearGradient(0, y, 0, y + 200);
      g.addColorStop(0, `rgba(${ACCENT},0)`);
      g.addColorStop(0.5, `rgba(${ACCENT},${0.035 * p.scan})`);
      g.addColorStop(1, `rgba(${ACCENT},0)`);
      ctx.fillStyle = g;
      ctx.fillRect(0, y, this.w, 200);
    }

    /* Nodes. */
    for (const nd of this.nodes) {
      const alpha = (p.nodeAlpha * 0.45 + nd.e * 0.7) * nd.a;
      if (alpha < 0.004) continue;
      ctx.fillStyle = `rgba(${nd.e > 0.05 ? ACCENT : NEUTRAL},${alpha})`;
      ctx.beginPath();
      ctx.arc(nd.x, nd.y, nd.r + nd.e * 1.1, 0, Math.PI * 2);
      ctx.fill();

      if (nd.e > 0.45) {
        ctx.strokeStyle = `rgba(${ACCENT},${(nd.e - 0.45) * 0.3 * nd.a})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(nd.x, nd.y, 7 + nd.e * 6, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    /* Packets. */
    if (this.packets.length && dt > 0) {
      for (const pk of this.packets) {
        const a = this.nodes[pk.a];
        const b = this.nodes[pk.b];
        if (!a || !b) continue;
        const fade = Math.sin(pk.t * Math.PI);
        ctx.fillStyle = `rgba(120,232,250,${0.8 * fade})`;
        ctx.beginPath();
        ctx.arc(a.x + (b.x - a.x) * pk.t, a.y + (b.y - a.y) * pk.t, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

/** Deterministic hash-based random, so a node's layout seed never changes. */
function rand(seed: number) {
  const x = Math.sin(seed * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { field } from "@/lib/field";
import { clamp, rand } from "@/lib/utils";

/* ══════════════════════════════════════════════════════════════════════
 *  The cipher field. A grid of faint hexadecimal characters, drawn once
 *  to an offscreen canvas; each frame only the active cells are redrawn.
 *  On top: flicker, sparse rain columns, a scan line every 8–13 s, small
 *  glitch blocks, a cursor that decrypts the cells around it, and a ring
 *  sent out by every click. Scrolling speeds the rain up a little.
 *
 *  It must survive a zero-size first frame (an iframe, a collapsed
 *  preview): drawing is skipped while width or height is 0, the viewport
 *  is re-checked every frame, and no exception can stop the loop.
 * ══════════════════════════════════════════════════════════════════════ */

const CH = "0123456789ABCDEF";

export function Background() {
  const ref = useRef<HTMLCanvasElement>(null);
  const pathname = usePathname();
  const onHome = pathname === "/";

  /* canvas opacity: 0.88 at the top of home, easing to 0.38; 0.36 elsewhere */
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    let tick = false;
    const set = () => {
      tick = false;
      cv.style.opacity = onHome ? (0.88 - 0.5 * clamp(window.scrollY / window.innerHeight, 0, 1)).toFixed(3) : "0.36";
    };
    const on = () => {
      if (!tick) {
        tick = true;
        requestAnimationFrame(set);
      }
    };
    set();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, [onHome]);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const cx = cv.getContext("2d");
    const base = document.createElement("canvas");
    const bx = base.getContext("2d");
    if (!cx || !bx) return;

    const RM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0, H = 0, DPR = 1, cell = 16, cols = 0, rows = 0, n = 0;
    let chars = new Uint8Array(0), ba = new Float32Array(0), ht = new Float32Array(0), rt = new Float32Array(0);
    let mx = -9999, my = -9999, lastFlick = 0, prevT = 0, lastSY = 0, boost = 0;
    let nextScan = 2500, nextGlitch = 1200;
    let scan: { t: number } | null = null;
    const pulses: { x: number; y: number; t: number }[] = [];
    type Drop = { c: number; y: number; sp: number; row: number };
    const drops: Drop[] = [];
    let raf = 0;
    let alive = true;

    const font = () => `500 ${Math.round(cell * 0.62)}px ${getComputedStyle(document.body).getPropertyValue("--font-jb") || "ui-monospace"}, ui-monospace, monospace`;
    let fontStr = "";
    const r16 = () => (Math.random() * 16) | 0;
    const paint = (ctx: CanvasRenderingContext2D, i: number, a: number) => {
      ctx.fillStyle = `rgba(236,236,232,${a.toFixed(3)})`;
      ctx.fillText(CH[chars[i]!]!, (i % cols) * cell + cell / 2, ((i / cols) | 0) * cell + cell / 2);
    };
    const drawBase = () => {
      bx.setTransform(DPR, 0, 0, DPR, 0, 0);
      bx.clearRect(0, 0, W, H);
      bx.font = fontStr;
      bx.textAlign = "center";
      bx.textBaseline = "middle";
      for (let i = 0; i < n; i++) if (ba[i]! > 0) paint(bx, i, ba[i]!);
    };
    const newDrop = (d: Drop, top: boolean) => {
      d.c = (Math.random() * cols) | 0;
      d.y = top ? -rand(0, rows * 0.5) : rand(-rows * 0.5, rows);
      d.sp = rand(0.07, 0.3);
      d.row = -1;
    };
    const size = () => {
      DPR = Math.min(2, window.devicePixelRatio || 1);
      W = window.innerWidth;
      H = window.innerHeight;
      cell = W < 760 ? 18 : 16;
      if (W < 1 || H < 1) {
        n = 0;
        return;
      }
      fontStr = font();
      cols = Math.ceil(W / cell);
      rows = Math.ceil(H / cell);
      n = cols * rows;
      for (const c of [cv, base]) {
        c.width = W * DPR;
        c.height = H * DPR;
      }
      chars = new Uint8Array(n);
      ba = new Float32Array(n);
      ht = new Float32Array(n);
      rt = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        chars[i] = r16();
        ba[i] = Math.random() < 0.56 ? 0 : rand(0.016, 0.042);
      }
      drops.length = 0;
      const nd = Math.round(cols * (W < 760 ? 0.045 : 0.06));
      for (let k = 0; k < nd; k++) {
        const d = { c: 0, y: 0, sp: 0, row: -1 };
        newDrop(d, false);
        drops.push(d);
      }
      drawBase();
    };

    const frame = (now: number) => {
      const dtr = Math.min(400, now - (prevT || now - 16));
      prevT = now;
      const s = Math.min(3, dtr / 16.67);
      const sy = window.scrollY;
      boost += (Math.min(6, Math.abs(sy - lastSY) * 0.08) - boost) * 0.15;
      lastSY = sy;
      if (now - lastFlick > 90) {
        lastFlick = now;
        const cnt = Math.round((W < 760 ? 7 : 14) * (1 + boost * 0.6));
        for (let k = 0; k < cnt; k++) {
          const i = (Math.random() * n) | 0;
          chars[i] = r16();
          bx.clearRect((i % cols) * cell, ((i / cols) | 0) * cell, cell, cell);
          if (ba[i]! > 0) paint(bx, i, ba[i]!);
        }
      }
      const dh = Math.pow(0.87, dtr / 16.67), dr = Math.pow(0.935, dtr / 16.67);
      for (let i = 0; i < n; i++) {
        ht[i] = ht[i]! * dh;
        rt[i] = rt[i]! * dr;
      }
      /* rain */
      for (const d of drops) {
        d.y += d.sp * s * (1 + boost * 0.7);
        const row = Math.floor(d.y);
        if (row !== d.row && row >= 0 && row < rows) {
          d.row = row;
          const i = row * cols + d.c;
          chars[i] = r16();
          rt[i] = 1;
        }
        if (d.y > rows + 4) newDrop(d, true);
      }
      /* scan line */
      if (!scan && now > nextScan) scan = { t: now };
      if (scan) {
        const a = (now - scan.t) / 1900;
        if (a >= 1) {
          scan = null;
          nextScan = now + rand(8000, 13000);
        } else {
          const r = Math.floor(a * rows);
          if (r >= 0 && r < rows)
            for (let c = 0; c < cols; c++) {
              const i = r * cols + c;
              if (ht[i]! < 0.22) {
                ht[i] = 0.22;
                if (Math.random() < 0.3) chars[i] = r16();
              }
            }
        }
      }
      /* glitch blocks */
      if (now > nextGlitch) {
        nextGlitch = now + rand(2200, 4500);
        const w = rand(3, 9) | 0, h = rand(1, 2.5) | 0;
        const c0 = (Math.random() * Math.max(1, cols - w)) | 0, r0 = (Math.random() * Math.max(1, rows - h)) | 0;
        for (let r = r0; r < r0 + h; r++)
          for (let c = c0; c < c0 + w; c++) {
            const i = r * cols + c;
            chars[i] = r16();
            if (ht[i]! < 0.3) ht[i] = 0.3;
          }
      }
      /* cursor */
      if (mx > -999) {
        const R = 120;
        const c0 = Math.max(0, ((mx - R) / cell) | 0), c1 = Math.min(cols - 1, ((mx + R) / cell) | 0);
        const r0 = Math.max(0, ((my - R) / cell) | 0), r1 = Math.min(rows - 1, ((my + R) / cell) | 0);
        for (let r = r0; r <= r1; r++)
          for (let c = c0; c <= c1; c++) {
            const i = r * cols + c;
            const d = Math.hypot(c * cell + cell / 2 - mx, r * cell + cell / 2 - my);
            if (d < R) {
              const f = Math.pow(1 - d / R, 2);
              if (f > ht[i]!) ht[i] = f;
              if (Math.random() < f * 0.15) chars[i] = r16();
            }
          }
      }
      /* pulses */
      const maxR = Math.hypot(W, H);
      for (let q = pulses.length - 1; q >= 0; q--) {
        const p = pulses[q]!, a = (now - p.t) / 1500;
        if (a >= 1) {
          pulses.splice(q, 1);
          continue;
        }
        const r = Math.max(0, a) * maxR * 0.7, fd = 1 - a, band = 16;
        const c0 = Math.max(0, ((p.x - r - band) / cell) | 0), c1 = Math.min(cols - 1, ((p.x + r + band) / cell) | 0);
        const r0 = Math.max(0, ((p.y - r - band) / cell) | 0), r1 = Math.min(rows - 1, ((p.y + r + band) / cell) | 0);
        for (let rr = r0; rr <= r1; rr++)
          for (let c = c0; c <= c1; c++) {
            const i = rr * cols + c;
            const d = Math.abs(Math.hypot(c * cell + cell / 2 - p.x, rr * cell + cell / 2 - p.y) - r);
            if (d < band) {
              const w = (1 - d / band) * fd * 0.75;
              if (w > ht[i]!) {
                ht[i] = w;
                chars[i] = r16();
              }
            }
          }
      }
      /* draw: the cached base, then only the active cells */
      cx.setTransform(1, 0, 0, 1, 0, 0);
      cx.clearRect(0, 0, cv.width, cv.height);
      cx.drawImage(base, 0, 0);
      cx.setTransform(DPR, 0, 0, DPR, 0, 0);
      cx.font = fontStr;
      cx.textAlign = "center";
      cx.textBaseline = "middle";
      for (let i = 0; i < n; i++) {
        const v = Math.max(ht[i]! * 0.5, rt[i]! * 0.36);
        if (v < 0.025) continue;
        cx.fillStyle = "#0b0b0c";
        cx.fillRect((i % cols) * cell, ((i / cols) | 0) * cell, cell, cell);
        paint(cx, i, rt[i]! > 0.92 ? 0.6 : Math.min(0.6, ba[i]! + 0.04 + v));
      }
    };

    const frameSafe = (now: number) => {
      if (!alive) return;
      try {
        /* Recover from a zero-size start as soon as the viewport has a size,
           even if no resize event ever reaches this frame. */
        if (n === 0 && window.innerWidth > 0 && window.innerHeight > 0) size();
        if (W > 0 && H > 0 && n > 0) frame(now);
      } catch (err) {
        console.warn("field", err);
      }
      if (!RM) raf = requestAnimationFrame(frameSafe);
    };

    let rt0: ReturnType<typeof setTimeout> | undefined;
    const onResize = () => {
      clearTimeout(rt0);
      rt0 = setTimeout(() => {
        try {
          size();
          if (RM && n > 0) frame(performance.now());
        } catch (err) {
          console.warn("field", err);
        }
      }, 150);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "mouse") {
        mx = e.clientX;
        my = e.clientY;
      }
    };
    const onLeave = () => {
      mx = my = -9999;
    };
    const onDown = (e: PointerEvent) => {
      if ((e.target as Element | null)?.closest?.("input,textarea,#boot")) return;
      pulses.push({ x: e.clientX, y: e.clientY, t: performance.now() });
    };

    /* Start once the main thread is idle, so building the grid never
       competes with hydration or the intro's first frames. */
    const start = () => {
    if (!alive) return;
    try {
      size();
    } catch (err) {
      console.warn("field", err);
    }
    window.addEventListener("resize", onResize);
    if (RM) {
      if (n > 0) frame(performance.now());
    } else {
      raf = requestAnimationFrame(frameSafe);
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("mouseleave", onLeave);
      window.addEventListener("pointerdown", onDown, { passive: true });
      field.register((x, y) => pulses.push({ x: x ?? W / 2, y: y ?? H / 2, t: performance.now() }));
    }
    /* The base layer is drawn with the web font once it has loaded. */
    document.fonts?.ready.then(() => {
      if (!alive || n === 0) return;
      fontStr = font();
      drawBase();
    });
    };
    const ric = "requestIdleCallback" in window;
    const idle = ric ? window.requestIdleCallback(start, { timeout: 1200 }) : window.setTimeout(start, 200);

    return () => {
      alive = false;
      if (ric) window.cancelIdleCallback(idle);
      else clearTimeout(idle);
      cancelAnimationFrame(raf);
      clearTimeout(rt0);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      field.register(() => {});
    };
  }, []);

  return (
    <>
      <canvas id="bg" ref={ref} aria-hidden="true" />
      <div className="veil" aria-hidden="true" />
    </>
  );
}

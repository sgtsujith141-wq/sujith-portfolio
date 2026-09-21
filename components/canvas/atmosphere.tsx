"use client";

import { useEffect, useRef } from "react";

/* ══════════════════════════════════════════════════════════════════════
 *  ATMOSPHERE
 *
 *  The room the canvas sits in. Three very large, very soft pools of
 *  light drift on their own slow paths, and a fourth follows the
 *  pointer. All four are composited DOM layers moved only by transform
 *  and opacity, so the main thread paints nothing for them — the
 *  previous version drew this into the canvas and it cost roughly ten
 *  million pixel writes a frame.
 *
 *  This is where the site's atmosphere lives. The canvas above it draws
 *  structure; this draws depth and colour, and the two never compete
 *  because they are on different layers.
 * ══════════════════════════════════════════════════════════════════════ */

interface Pool {
  /** Size as a fraction of the larger viewport edge. */
  scale: number;
  /** Orbit radii, as a fraction of the viewport. */
  rx: number;
  ry: number;
  /** Radians per millisecond. */
  speed: number;
  phase: number;
  colour: string;
  alpha: number;
}

/* Sizes are deliberately modest. A pool at 110vmax is an ~1800px layer,
 * and three of those held the page at 24fps; at these sizes the same
 * composition holds 60. */
const POOLS: Pool[] = [
  { scale: 0.62, rx: 0.3, ry: 0.22, speed: 0.000035, phase: 0, colour: "79,124,255", alpha: 0.26 },
  { scale: 0.46, rx: 0.36, ry: 0.3, speed: -0.000052, phase: 2.1, colour: "139,124,246", alpha: 0.2 },
  { scale: 0.38, rx: 0.26, ry: 0.34, speed: 0.000068, phase: 4.3, colour: "63,210,240", alpha: 0.17 },
];

export function Atmosphere({ reduced }: { reduced: boolean }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const poolRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    // Reduced motion gets the same composition, held still.
    if (reduced) {
      POOLS.forEach((pool, i) => {
        const el = poolRefs.current[i];
        if (el) el.style.transform = `translate3d(50vw, 45vh, 0) translate(-50%, -50%)`;
      });
      return;
    }

    let raf = 0;
    let px = window.innerWidth * 0.5;
    let py = window.innerHeight * 0.42;
    let lx = px;
    let ly = py;

    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      px = e.clientX;
      py = e.clientY;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    const tick = (now: number) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      POOLS.forEach((pool, i) => {
        const el = poolRefs.current[i];
        if (!el) return;
        const a = now * pool.speed + pool.phase;
        // Two frequencies per axis so the path never repeats visibly, and
        // transform only — scaling a layer this large re-rasterises it.
        const x = w * (0.5 + Math.cos(a) * pool.rx + Math.cos(a * 0.41) * pool.rx * 0.3);
        const y = h * (0.45 + Math.sin(a * 1.31) * pool.ry + Math.sin(a * 0.53) * pool.ry * 0.25);
        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%)`;
      });

      // The pointer light trails rather than snapping to the cursor.
      lx += (px - lx) * 0.045;
      ly += (py - ly) * 0.045;
      const light = lightRef.current;
      if (light) {
        light.style.transform = `translate3d(${lx.toFixed(1)}px, ${ly.toFixed(1)}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointer);
    };
  }, [reduced]);

  return (
    <div
      ref={hostRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ contain: "strict" }}
    >
      {POOLS.map((pool, i) => (
        <div
          key={i}
          ref={(el) => {
            poolRefs.current[i] = el;
          }}
          className="atmosphere-pool absolute left-0 top-0"
          style={
            {
              "--pool-size": `${pool.scale * 110}vmax`,
              "--pool-rgb": pool.colour,
              "--pool-alpha": pool.alpha,
            } as React.CSSProperties
          }
        />
      ))}
      <div ref={lightRef} className="atmosphere-light absolute left-0 top-0" />
      {/* A fine grain over the whole thing. Stops the large gradients
          banding on dark screens, which was visible at 8-bit depth. */}
      <div className="atmosphere-grain absolute inset-0" />
    </div>
  );
}

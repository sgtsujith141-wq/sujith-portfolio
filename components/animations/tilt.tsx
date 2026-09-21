"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "motion/react";
import { useFinePointer } from "@/hooks/use-media";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";
import { SPRING } from "@/lib/motion";

/* ══════════════════════════════════════════════════════════════════════
 *  TILT
 *
 *  A restrained perspective shift: the surface turns up to 3° toward the
 *  pointer and a soft sheen tracks across it. Deliberately far short of
 *  the usual card-tilt effect — the intent is that the panel reads as a
 *  physical surface catching light, not as a toy.
 *
 *  Fine pointers only, and reduced motion gets a plain static surface.
 * ══════════════════════════════════════════════════════════════════════ */

const MAX = 3;

export function Tilt({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const enabled = fine && !reduced;

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const active = useMotionValue(0);

  const spring = SPRING.pointer;
  const rx = useSpring(useTransform(py, [0, 1], [MAX, -MAX]), spring);
  const ry = useSpring(useTransform(px, [0, 1], [-MAX, MAX]), spring);
  const sheenX = useTransform(px, (v) => `${v * 100}%`);
  const sheenY = useTransform(py, (v) => `${v * 100}%`);
  const sheenOpacity = useSpring(active, SPRING.panel);
  const sheen = useMotionTemplate`radial-gradient(45% 55% at ${sheenX} ${sheenY}, rgba(124,156,255,0.13), transparent 70%)`;

  return (
    <motion.div
      ref={ref}
      className={cn("relative", className)}
      style={enabled ? { transformPerspective: 900, rotateX: rx, rotateY: ry } : undefined}
      onPointerMove={(e) => {
        if (!enabled || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width);
        py.set((e.clientY - r.top) / r.height);
        active.set(1);
      }}
      onPointerLeave={() => {
        px.set(0.5);
        py.set(0.5);
        active.set(0);
      }}
    >
      {children}
      {enabled ? (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: sheen, opacity: sheenOpacity }}
        />
      ) : null}
    </motion.div>
  );
}

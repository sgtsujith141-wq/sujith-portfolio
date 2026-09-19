"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

/** Scroll-linked vertical drift. `depth` is in pixels of total travel;
 *  negative moves against the scroll, which reads as "further away". */
export function Parallax({
  children,
  depth = 60,
  className,
}: {
  children: ReactNode;
  depth?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [depth / 2, -depth / 2]);
  return (
    <div ref={ref} className={cn(className)}>
      <motion.div style={reduced ? undefined : { y }}>{children}</motion.div>
    </div>
  );
}

/** A section that recedes as it leaves: scale and fade tied to scroll.
 *  Gives consecutive sections a sense of depth rather than a hard cut. */
export function Recede({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  return (
    <div ref={ref} className={cn(className)}>
      <motion.div style={reduced ? undefined : { scale, opacity, transformOrigin: "50% 0%" }}>
        {children}
      </motion.div>
    </div>
  );
}

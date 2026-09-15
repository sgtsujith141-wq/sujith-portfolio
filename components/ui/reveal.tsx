"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

/* A masked reveal: the content rides up from behind a clipped edge rather
 * than fading in. Used for headings and dense text blocks so the page
 * assembles itself instead of blinking into place. */

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** distance in px the content travels */
  y?: number;
  once?: boolean;
}

export function Reveal({ children, className, delay = 0, y = 18, once = true }: RevealProps) {
  const reduced = usePrefersReducedMotion();

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <div className={cn("overflow-hidden", className)}>
      <motion.div
        initial={{ y, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once, margin: "-8% 0px -8% 0px" }}
        transition={{ duration: 0.72, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/** Stagger container for lists. Children use `staggerItem`. */
export const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.06 } },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};

export function StaggerList({
  children,
  className,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  once?: boolean;
}) {
  const reduced = usePrefersReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      variants={staggerParent}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-6% 0px" }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div className={className} variants={staggerItem}>
      {children}
    </motion.div>
  );
}

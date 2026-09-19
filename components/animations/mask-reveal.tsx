"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

/* ══════════════════════════════════════════════════════════════════════
 *  MASK REVEAL
 *
 *  A line that rises out from behind a mask: the wrapper clips, the
 *  child travels.
 *
 *  The in-view trigger lives on the WRAPPER, not the child, and drives
 *  the child through variants. This matters: an IntersectionObserver
 *  accounts for clipping by an ancestor with overflow:hidden, so a child
 *  parked below its own mask has an intersection ratio of zero and would
 *  never trigger itself. Observing the mask breaks that deadlock.
 * ══════════════════════════════════════════════════════════════════════ */

const variants = {
  hidden: { y: "108%", opacity: 0 },
  shown: { y: "0%", opacity: 1 },
};

export function MaskLine({
  children,
  delay = 0,
  duration = 1,
  className,
  inView = true,
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  inView?: boolean;
}) {
  return (
    <motion.span
      className={cn("block overflow-hidden", className)}
      initial="hidden"
      {...(inView
        ? { whileInView: "shown", viewport: { once: true, amount: 0.4 } }
        : { animate: "shown" })}
    >
      <motion.span
        className="block"
        variants={variants}
        transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.span>
    </motion.span>
  );
}

/** A wipe that uncovers its content left-to-right. For images and panels. */
export function Wipe({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={cn("relative", className)}
      initial={{ clipPath: "inset(0 100% 0 0)" }}
      whileInView={{ clipPath: "inset(0 0% 0 0)" }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1.1, delay, ease: [0.76, 0, 0.24, 1] }}
    >
      {children}
    </motion.div>
  );
}

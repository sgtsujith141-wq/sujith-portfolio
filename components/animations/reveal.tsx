"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { DUR, EASE_OUT, VIEWPORT } from "@/lib/motion";

interface Props {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
  amount?: number;
  /** Render as a list item so <ol>/<ul> keep valid children. */
  as?: "div" | "li";
}

/** Enters when scrolled into view: a short rise and fade. Respects reduced motion via MotionConfig. */
export function Reveal({
  children,
  delay = 0,
  y = 18,
  className,
  once = true,
  amount = 0.25,
  as = "div",
}: Props) {
  const Tag = as === "li" ? motion.li : motion.div;
  return (
    <Tag
      className={cn(className)}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ ...VIEWPORT, once, amount }}
      transition={{ duration: DUR.slow, delay, ease: EASE_OUT }}
    >
      {children}
    </Tag>
  );
}

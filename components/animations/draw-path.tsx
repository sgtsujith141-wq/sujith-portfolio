"use client";

import { motion } from "motion/react";

/** An SVG path that draws itself when scrolled into view. */
export function DrawPath({
  d,
  stroke = "#2a3140",
  width = 1,
  delay = 0,
  duration = 1.4,
  className,
  dash,
}: {
  d: string;
  stroke?: string;
  width?: number;
  delay?: number;
  duration?: number;
  className?: string;
  dash?: string;
}) {
  return (
    <motion.path
      d={d}
      fill="none"
      stroke={stroke}
      strokeWidth={width}
      strokeDasharray={dash}
      className={className}
      initial={{ pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
    />
  );
}

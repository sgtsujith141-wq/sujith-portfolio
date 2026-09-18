"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface Props {
  text: string;
  className?: string;
  /** Seconds before the first word. */
  delay?: number;
  stagger?: number;
  as?: "p" | "span" | "h1" | "h2";
  inView?: boolean;
}

/** Word-by-word reveal with a masked rise. Screen readers get the plain string. */
export function SplitText({ text, className, delay = 0, stagger = 0.045, as = "p", inView = true }: Props) {
  const words = text.split(" ");
  const Tag = motion[as];
  const animate = { opacity: 1, y: 0 };
  return (
    <Tag className={cn("inline", className)} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom" aria-hidden>
          <motion.span
            className="inline-block"
            initial={{ opacity: 0, y: "60%" }}
            {...(inView ? { whileInView: animate, viewport: { once: true, amount: 0.6 } } : { animate })}
            transition={{ duration: 0.7, delay: delay + i * stagger, ease: [0.16, 1, 0.3, 1] }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 ? <span className="inline-block">&nbsp;</span> : null}
        </span>
      ))}
    </Tag>
  );
}

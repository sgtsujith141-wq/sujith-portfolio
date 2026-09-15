"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

/* Characters resolve out of a technical glyph set rather than the usual
 * alphanumeric noise — it reads as a cipher, not as a slot machine.
 * Each character gets its own lock time, so the string settles left to
 * right with a little jitter instead of snapping all at once. */
const GLYPHS = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&$/\\<>[]{}=+*-_|:";

interface DecryptTextProps {
  text: string;
  className?: string;
  /** ms before the first character starts resolving */
  delay?: number;
  /** ms between each character locking in */
  stagger?: number;
  /** how long a character churns before it can lock */
  churn?: number;
  /** "mount" runs once on mount, "view" waits for the element to scroll in */
  trigger?: "mount" | "view";
  as?: "span" | "div" | "h1" | "h2" | "p";
  onDone?: () => void;
}

export function DecryptText({
  text,
  className,
  delay = 0,
  stagger = 34,
  churn = 320,
  trigger = "mount",
  as: Tag = "span",
  onDone,
}: DecryptTextProps) {
  const reduced = usePrefersReducedMotion();
  const [output, setOutput] = useState(text);
  const [settled, setSettled] = useState(false);
  const [armed, setArmed] = useState(trigger === "mount");
  const ref = useRef<HTMLElement>(null);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  // Viewport trigger — one-shot, disconnects immediately after firing.
  useEffect(() => {
    if (trigger !== "view" || armed) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setArmed(true);
          io.disconnect();
        }
      },
      { rootMargin: "-12% 0px -12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [trigger, armed]);

  useEffect(() => {
    if (!armed) return;
    if (reduced) {
      setOutput(text);
      setSettled(true);
      doneRef.current?.();
      return;
    }
    setSettled(false);

    const chars = Array.from(text);
    // Spaces and separators never scramble — they hold the word shape steady.
    const isStatic = (c: string) => c === " " || c === " ";
    const lockAt = chars.map((_, i) => delay + churn + i * stagger);
    const total = lockAt[lockAt.length - 1] ?? delay;

    let raf = 0;
    let last = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = now - start;
      // ~28fps is plenty for a scramble and keeps the main thread quiet.
      if (now - last > 35) {
        last = now;
        setOutput(
          chars
            .map((c, i) => {
              if (isStatic(c)) return c;
              if (t >= lockAt[i]) return c;
              if (t < delay) return " ";
              return GLYPHS[(Math.random() * GLYPHS.length) | 0];
            })
            .join(""),
        );
      }
      if (t < total + 40) {
        raf = requestAnimationFrame(tick);
      } else {
        setOutput(text);
        setSettled(true);
        doneRef.current?.();
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [armed, text, delay, stagger, churn, reduced]);

  // Before the animation is armed (a viewport-triggered heading that has not
  // been reached yet) and after it settles, render the string plainly. Only
  // the churning state needs the three-span overlay, which keeps the text out
  // of the document twice over for everything else.
  if (settled || !armed) {
    return (
      <Tag ref={ref as React.Ref<never>} className={cn("inline-block", className)}>
        {text}
      </Tag>
    );
  }

  return (
    <Tag ref={ref as React.Ref<never>} className={cn("relative inline-block", className)}>
      {/* Holds the final box so a proportional font does not jitter while
          the glyphs churn. The scrambling copy floats on top of it. */}
      <span aria-hidden="true" className="invisible whitespace-pre-wrap">
        {text}
      </span>
      <span className="sr-only">{text}</span>
      <span
        aria-hidden="true"
        className="absolute inset-0 whitespace-pre-wrap"
      >
        {output}
      </span>
    </Tag>
  );
}

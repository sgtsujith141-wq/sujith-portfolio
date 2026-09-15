"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

/* A small targeting reticle that trails the pointer and opens up over
 * anything interactive. The native cursor is deliberately kept — this sits
 * behind it as instrumentation, so nothing about pointing or clicking
 * changes. Fine pointers only, and never under reduced motion. */

export function Reticle() {
  const reduced = usePrefersReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [hot, setHot] = useState(false);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 900, damping: 45, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 900, damping: 45, mass: 0.35 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    setEnabled(fine && !reduced);
  }, [reduced]);

  useEffect(() => {
    if (!enabled) return;

    const INTERACTIVE = "a,button,[role='button'],input,summary,label,[data-reticle]";

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      if (!visible) setVisible(true);
      const target = e.target as Element | null;
      setHot(Boolean(target?.closest?.(INTERACTIVE)));
    };
    const onLeave = () => setVisible(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled, visible, x, y]);

  if (!enabled) return null;

  const size = hot ? 34 : 18;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[130] mix-blend-screen"
      style={{ x: sx, y: sy }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="relative -translate-x-1/2 -translate-y-1/2"
        initial={false}
        animate={{ width: size, height: size }}
        transition={{ type: "spring", stiffness: 420, damping: 30 }}
      >
        {(
          [
            "left-0 top-0 border-l border-t",
            "right-0 top-0 border-r border-t",
            "bottom-0 left-0 border-b border-l",
            "bottom-0 right-0 border-b border-r",
          ] as const
        ).map((pos) => (
          <span
            key={pos}
            className={`absolute h-[5px] w-[5px] transition-colors duration-300 ${pos} ${
              hot ? "border-accent/90" : "border-ink/25"
            }`}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}

"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { MaskLine } from "@/components/animations/mask-reveal";
import { Reveal } from "@/components/animations/reveal";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/* The cinematic entrance into the Work layer. The title holds the
 * screen, then lifts away as the first project arrives — so arriving
 * here feels like entering somewhere rather than loading a list. */
export function WorkIntro({ count }: { count: number }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 110]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, reduced ? 1 : 0]);

  return (
    <section
      ref={ref}
      aria-labelledby="work-title"
      className="flex min-h-[78dvh] flex-col justify-center px-6 py-24 lg:px-12"
    >
      <motion.div style={{ y, opacity }} className="mx-auto w-full max-w-6xl">
        <p
          data-enter
          style={{ "--enter-delay": "120ms" } as React.CSSProperties}
          className="label flex items-center gap-3"
        >
          <span className="text-accent">Work</span>
          <span aria-hidden className="h-px w-6 bg-line-strong" />
          <span>{count} projects</span>
        </p>
        <h1
          id="work-title"
          className="display mt-8 max-w-4xl text-[clamp(2.8rem,9vw,7.5rem)] leading-[0.95] text-ink"
        >
          <MaskLine inView={false} delay={0.26}>
            Things I&rsquo;ve
          </MaskLine>
          <MaskLine inView={false} delay={0.36}>
            built.
          </MaskLine>
        </h1>
        <Reveal delay={0.44}>
          <p className="mt-9 max-w-xl text-lg leading-relaxed text-muted">
            Two I&rsquo;d point at first, and four more that are either experiments, earlier
            versions, or still being built.
          </p>
        </Reveal>
      </motion.div>
    </section>
  );
}

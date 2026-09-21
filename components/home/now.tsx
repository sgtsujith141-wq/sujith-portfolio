"use client";

import { useRef } from "react";
import { building, highlights } from "@/content/personal";
import { Reveal } from "@/components/animations/reveal";
import { MaskLine } from "@/components/animations/mask-reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { motion, useScroll, useTransform } from "motion/react";

/* ══════════════════════════════════════════════════════════════════════
 *  04 · NOW
 *
 *  What he is building, and the short list of things that have actually
 *  happened. Phantom HQ's repository is private, so there is no link —
 *  and none is invented. Its status is read from the project's own
 *  manifest and dated, rather than described from memory.
 * ══════════════════════════════════════════════════════════════════════ */

export function Now() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const drift = useTransform(scrollYProgress, [0, 1], [reduced ? 0 : 26, reduced ? 0 : -26]);

  return (
    <section id="now" aria-labelledby="now-title" className="relative px-6 py-28 lg:px-12 lg:py-40">
      <div className="mx-auto max-w-6xl">
        <SectionHeader index="04" label="Now" title={<span id="now-title">What I&rsquo;m building.</span>} />

        {/* Phantom HQ */}
        <div ref={ref} className="mt-14">
          <Reveal>
            <article className="hairline relative overflow-hidden bg-surface p-7 lg:p-12">
              {/* A slow band of light drifting behind the card. */}
              <motion.span
                aria-hidden
                style={{ y: drift }}
                className="pointer-events-none absolute -right-24 -top-24 h-[28rem] w-[28rem] rounded-full"
              >
                <span className="block h-full w-full rounded-full bg-[radial-gradient(closest-side,rgba(139,124,246,0.16),transparent_70%)]" />
              </motion.span>

              <div className="relative grid gap-10 lg:grid-cols-12 lg:gap-12">
                <div className="lg:col-span-7">
                  <p className="label flex items-center gap-3">
                    <span className="relative flex h-2 w-2 items-center justify-center">
                      <span className="absolute inset-0 rounded-full bg-violet/40 animate-pulse-dot" />
                      <span className="h-1 w-1 rounded-full bg-violet" />
                    </span>
                    <span>{building.kicker}</span>
                  </p>
                  <h3 className="display mt-6 text-[clamp(2.2rem,6vw,4rem)] leading-none text-ink">
                    <MaskLine>{building.name}</MaskLine>
                  </h3>
                  <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">{building.summary}</p>
                  <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-faint">{building.body}</p>
                </div>

                <div className="lg:col-span-5 lg:pt-14">
                  <dl className="space-y-5">
                    <div>
                      <dt className="label-xs text-ghost">Status</dt>
                      <dd className="mt-2 text-[15px] text-ink">{building.status.label}</dd>
                      <dd className="mt-2 text-sm leading-relaxed text-muted">
                        {building.status.detail}
                      </dd>
                    </div>
                    <div>
                      <dt className="label-xs text-ghost">Source</dt>
                      <dd className="mt-2 text-sm leading-relaxed text-muted">{building.note}</dd>
                    </div>
                  </dl>
                  <p className="mono mt-6 text-[10px] tracking-[0.14em] text-ghost">
                    CHECKED {building.status.checked}
                  </p>
                </div>
              </div>
            </article>
          </Reveal>
        </div>

        {/* Highlights */}
        <div className="mt-20">
          <Reveal>
            <h3 className="label">Along the way</h3>
          </Reveal>
          <ul className="mt-6 divide-y divide-line-soft border-y border-line-soft">
            {highlights.map((h, i) => (
              <Reveal as="li" key={h.id} delay={i * 0.06}>
                <div className="grid gap-2 py-6 sm:grid-cols-12 sm:gap-6">
                  <div className="sm:col-span-5">
                    <h4 className="display text-xl text-ink">{h.title}</h4>
                    <p className="label-xs mt-2 text-ghost">{h.where}</p>
                  </div>
                  <p className="text-[15px] leading-relaxed text-muted sm:col-span-7">{h.detail}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

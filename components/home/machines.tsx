"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { osStory, homelab } from "@/content/personal";
import { homelab as lab } from "@/content/homelab";
import { ServerGlow } from "@/components/homelab/server-glow";
import { useLivingSystem } from "@/components/canvas/living-system";
import { Reveal } from "@/components/animations/reveal";
import { MaskLine } from "@/components/animations/mask-reveal";
import { Parallax } from "@/components/animations/parallax";
import { SectionHeader } from "@/components/ui/section-header";

/* ══════════════════════════════════════════════════════════════════════
 *  03 · MACHINES
 *
 *  The two things that are really one thing: the operating systems he
 *  has tried, and the server those experiments turned into. Kept
 *  compact and personal on purpose — the full home-lab breakdown is a
 *  case study at /work/home-lab, not the home page's job.
 * ══════════════════════════════════════════════════════════════════════ */

export function Machines() {
  const stageRef = useRef<HTMLDivElement>(null);
  const { setStage } = useLivingSystem();

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setStage(entry?.isIntersecting ? el : null),
      { rootMargin: "-25% 0px -25% 0px", threshold: 0 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      setStage(null);
    };
  }, [setStage]);

  return (
    <section
      id="machines"
      aria-labelledby="machines-title"
      className="relative px-6 py-28 lg:px-12 lg:py-40"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          index="03"
          label="Machines"
          title={
            <span id="machines-title">
              <MaskLine>{osStory.lead}</MaskLine>
            </span>
          }
          lede={osStory.body}
        />

        {/* What he has run. A shelf of names, nothing measured. */}
        <ul className="mt-14 flex flex-wrap items-baseline gap-x-8 gap-y-4 border-y border-line-soft py-8 lg:gap-x-12">
          {osStory.systems.map((s, i) => (
            <Reveal as="li" key={s.name} delay={(i % 4) * 0.05} className="group">
              <span className="display text-[clamp(1.3rem,3.4vw,2.4rem)] leading-none text-muted t-base group-hover:text-ink">
                {s.name}
              </span>
              <span className="mono ml-2.5 align-super text-[9.5px] tracking-[0.14em] text-ghost">
                {s.kind === "os" ? "OS" : s.kind === "mod" ? "BUILD" : "STACKED"}
              </span>
            </Reveal>
          ))}
        </ul>

        {/* The server those experiments turned into. */}
        <div className="mt-24 grid gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <Reveal>
              <h3 className="label">And then a whole server</h3>
            </Reveal>
            <Reveal delay={0.06}>
              <p className="display mt-5 text-[clamp(1.5rem,3.4vw,2.2rem)] leading-tight text-ink">
                {homelab.lead}
              </p>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted">{homelab.body}</p>
            </Reveal>
            <Reveal delay={0.18}>
              <Link
                href="/work/home-lab"
                className="group mt-8 inline-flex items-center gap-2.5 border border-line-strong px-5 py-3 text-sm text-ink t-base hover:border-accent-soft hover:text-accent-soft"
              >
                The whole setup
                <ArrowUpRight
                  className="h-4 w-4 t-base group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
            </Reveal>
            <Reveal delay={0.24}>
              <p className="mt-6 max-w-md border-l border-line-strong pl-4 text-xs leading-relaxed text-ghost">
                {lab.scope}
              </p>
            </Reveal>
          </div>

          <Parallax depth={40} className="lg:col-span-7">
            <div ref={stageRef}>
              <Reveal amount={0.15}>
                <ServerGlow />
              </Reveal>
            </div>
          </Parallax>
        </div>
      </div>
    </section>
  );
}

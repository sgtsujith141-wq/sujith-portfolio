"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { projects, featuredSlugs, projectBySlug, statusMeta } from "@/content/projects";
import { useLivingSystem } from "@/components/canvas/living-system";
import { Reveal } from "@/components/animations/reveal";
import { MaskLine } from "@/components/animations/mask-reveal";
import { Magnetic } from "@/components/animations/magnetic";
import { Tilt } from "@/components/animations/tilt";
import { SectionHeader } from "@/components/ui/section-header";
import { StatusPill } from "@/components/ui/status-pill";

/* ══════════════════════════════════════════════════════════════════════
 *  06 · WORK — a teaser, not the main event.
 *
 *  Three projects previewed here; the other two and every case study
 *  live at /work. Scrolling into this section is the cue for the
 *  background: the domains recede and project modules rise in their
 *  place, so following the link feels like entering the layer the field
 *  has already started showing.
 * ══════════════════════════════════════════════════════════════════════ */

export function WorkTeaser() {
  const stageRef = useRef<HTMLDivElement>(null);
  const { setStage, setHover } = useLivingSystem();
  const featured = featuredSlugs.map((s) => projectBySlug[s]).filter(Boolean);

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
      id="work"
      aria-labelledby="work-title"
      className="relative px-6 py-28 lg:px-12 lg:py-40"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionHeader
              index="06"
              label="Work"
              title={<span id="work-title">Five things I built and kept running.</span>}
              lede="Each one is written from the repository — or, in the lab's case, from the machine: what it solves, how it works, what was verified and by what method, and what it does not yet do."
            />
          </div>
          {/* The window the background fills with the project constellation. */}
          <div ref={stageRef} aria-hidden className="relative hidden lg:col-span-5 lg:block">
            <span className="label-xs absolute right-0 top-2 text-ghost">
              Living system · project modules
            </span>
          </div>
        </div>

        <ul className="mt-14 grid gap-px bg-line-soft lg:grid-cols-3">
          {featured.map((p, i) => (
            <Reveal as="li" key={p.slug} delay={i * 0.07} className="h-full bg-base">
              <Tilt className="h-full">
              <div
                className="h-full"
                onMouseEnter={() => setHover(`p-${p.slug}`)}
                onMouseLeave={() => setHover(null)}
              >
                <Link
                  href={`/work/${p.slug}`}
                  className="group flex h-full flex-col p-6 transition-colors hover:bg-surface lg:p-7"
                >
                  <div className="flex items-center justify-between">
                    <span className="mono text-[11px] tracking-[0.2em] text-faint">{p.index}</span>
                    <ArrowUpRight
                      className="h-4 w-4 text-ghost transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-soft"
                      aria-hidden
                    />
                  </div>
                  <h3 className="display mt-8 text-2xl text-ink lg:text-[1.7rem]">
                    <MaskLine>{p.name}</MaskLine>
                  </h3>
                  <p className="mt-2 text-sm text-faint">{p.category}</p>
                  <p className="mt-5 flex-1 text-[14px] leading-relaxed text-muted">{p.tagline}</p>
                  <div className="mt-6 flex items-center justify-between gap-3">
                    <StatusPill tone={statusMeta[p.status].tone}>
                      {statusMeta[p.status].label}
                    </StatusPill>
                    <span
                      aria-hidden
                      className="h-px flex-1 origin-right scale-x-0 bg-accent/60 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:origin-left group-hover:scale-x-100"
                    />
                  </div>
                </Link>
              </div>
              </Tilt>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={0.1}>
          <div className="mt-px flex flex-col items-start justify-between gap-6 bg-base py-10 sm:flex-row sm:items-center">
            <p className="max-w-md text-sm leading-relaxed text-muted">
              The other {projects.length - featured.length}, every case study, the engineering
              evidence and the architecture explorer are in the Work section.
            </p>
            <Magnetic>
              <Link
                href="/work"
                className="group inline-flex items-center gap-4 border border-ink bg-ink px-7 py-4 text-sm font-medium text-base transition-colors hover:bg-white"
              >
                Enter the work
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden
                />
              </Link>
            </Magnetic>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

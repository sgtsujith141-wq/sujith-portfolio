"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { statusMeta } from "@/content/projects";
import type { Project } from "@/lib/types";
import { useLivingSystem } from "@/components/canvas/living-system";
import { Reveal } from "@/components/animations/reveal";
import { StatusPill } from "@/components/ui/status-pill";
import { DeepDive } from "./deep-dive";
import { cn } from "@/lib/utils";

/* ══════════════════════════════════════════════════════════════════════
 *  CASE STUDY FRAME
 *
 *  One layout, four personalities: the frame supplies the reading
 *  column — problem, solution, how it works, evidence, decisions,
 *  limitations, deep dive — and each project supplies its own visual for
 *  the side column. Entering a case study focuses its cluster in the
 *  background; leaving releases it.
 * ══════════════════════════════════════════════════════════════════════ */

interface Props {
  project: Project;
  visual?: ReactNode;
  /** Rendered full-width beneath the columns (used by the evolution timeline). */
  wide?: ReactNode;
  onEnter: (slug: Project["slug"] | null) => void;
}

export function CaseStudy({ project, visual, wide, onEnter }: Props) {
  const ref = useRef<HTMLElement>(null);
  const { setFocus, setHover } = useLivingSystem();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) {
          setFocus(project.slug);
          onEnter(project.slug);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [project.slug, setFocus, onEnter]);

  const status = statusMeta[project.status];

  return (
    <article
      id={`project-${project.slug}`}
      ref={ref}
      aria-labelledby={`project-${project.slug}-title`}
      className="scroll-mt-24 border-t border-line-soft py-20 lg:py-28"
    >
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
        {/* Reading column */}
        <div className="lg:col-span-7">
          <Reveal>
            <p className="label flex flex-wrap items-center gap-3">
              <span className="text-accent">Project {project.index}</span>
              <span aria-hidden className="h-px w-6 bg-line-strong" />
              <span>{project.category}</span>
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <h3 id={`project-${project.slug}-title`} className="display mt-6 text-[clamp(2.4rem,6vw,5rem)] text-ink">
              {project.name}
            </h3>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{project.tagline}</p>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <StatusPill tone={status.tone}>{status.label}</StatusPill>
              <a
                href={project.repo}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 border border-line-strong px-3.5 py-2 text-sm text-ink transition-colors hover:border-accent-soft hover:text-accent-soft"
              >
                <span className="mono text-[11px]">{project.repo.replace("https://github.com/", "")}</span>
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
              </a>
            </div>
            <p className="mt-4 text-sm text-faint">{project.statusNote}</p>
          </Reveal>

          <Reveal delay={0.22}>
            <ul className="mt-6 flex flex-wrap gap-1.5" aria-label="Stack">
              {project.stack.map((s) => (
                <li key={s} className="mono border border-line px-2.5 py-1.5 text-[11px] text-muted">
                  {s}
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Visual on narrow screens sits right after the header. */}
          {visual ? <div className="mt-10 lg:hidden">{visual}</div> : null}

          <Block title="Problem">
            {project.problem.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </Block>
          <Block title="Solution">
            {project.solution.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </Block>

          <Block title="How it works" wide>
            <ol className="grid gap-px bg-line-soft sm:grid-cols-2">
              {project.howItWorks.map((s, i) => (
                <li key={s.title} className="bg-base p-5">
                  <p className="mono text-[10px] tracking-[0.2em] text-ghost">{String(i + 1).padStart(2, "0")}</p>
                  <h4 className="mt-2 text-[15px] text-ink">{s.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{s.detail}</p>
                </li>
              ))}
            </ol>
          </Block>

          <Block title="Verified evidence" wide>
            <dl className="grid grid-cols-2 gap-px bg-line-soft sm:grid-cols-4">
              {project.evidence.map((m) => (
                <div key={m.label} className="bg-base p-4">
                  <dd className="display text-[1.6rem] leading-none text-ink">{m.value}</dd>
                  <dt className="mt-2 text-xs text-muted">{m.label}</dt>
                  {m.note ? <p className="mt-1.5 text-[11px] leading-snug text-faint">{m.note}</p> : null}
                </div>
              ))}
            </dl>
          </Block>

          <Block title="Technical decisions" wide>
            <ul className="divide-y divide-line-soft border-y border-line-soft">
              {project.decisions.map((d) => (
                <li key={d.title}>
                  <details className="group">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-4 [&::-webkit-details-marker]:hidden">
                      <span className="text-[15px] text-ink">{d.title}</span>
                      <span aria-hidden className="mono mt-1 text-[11px] text-faint transition-transform group-open:rotate-45">+</span>
                    </summary>
                    <div className="pb-5 text-sm leading-relaxed text-muted">
                      <p>{d.body}</p>
                      <p className="mt-3">
                        <span className="label-xs mr-2 text-warn">Trade-off</span>
                        {d.tradeoff}
                      </p>
                    </div>
                  </details>
                </li>
              ))}
            </ul>
          </Block>

          <Block title="Known limitations" wide>
            <ul className="space-y-2.5 text-sm leading-relaxed text-muted">
              {project.limitations.map((l) => (
                <li key={l} className="flex gap-3">
                  <span aria-hidden className="mt-2.5 h-px w-3 shrink-0 bg-line-strong" />
                  <span>{l}</span>
                </li>
              ))}
            </ul>
          </Block>

          <div className="mt-10">
            <DeepDive project={project} />
          </div>
        </div>

        {/* Visual column */}
        {visual ? (
          <div className="hidden lg:col-span-5 lg:block">
            <div
              className="sticky top-16"
              onMouseEnter={() => setHover(project.slug)}
              onMouseLeave={() => setHover(null)}
            >
              <Reveal delay={0.2}>{visual}</Reveal>
            </div>
          </div>
        ) : null}
      </div>

      {wide ? <div className="mt-14">{wide}</div> : null}
    </article>
  );
}

function Block({ title, children, wide }: { title: string; children: ReactNode; wide?: boolean }) {
  return (
    <Reveal className="mt-12">
      <h4 className="label">{title}</h4>
      <div className={cn("mt-4", wide ? "" : "max-w-2xl space-y-4 text-[15px] leading-relaxed text-muted")}>{children}</div>
    </Reveal>
  );
}

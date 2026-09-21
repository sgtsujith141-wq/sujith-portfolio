"use client";

import { useRef, type ReactNode } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/types";
import { projects, statusMeta } from "@/content/projects";
import { Reveal } from "@/components/animations/reveal";
import { MaskLine } from "@/components/animations/mask-reveal";
import { Magnetic } from "@/components/animations/magnetic";
import { StatusPill } from "@/components/ui/status-pill";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { formatDate } from "@/lib/utils";

/* ══════════════════════════════════════════════════════════════════════
 *  CASE STUDY
 *
 *  One order for every project, so moving between them is predictable:
 *
 *    Overview → Screenshots → What it does → Technical details
 *             → Status → Source
 *
 *  Everything verified survives from the previous version — the
 *  evidence figures, the verification log with its dates and methods,
 *  the architecture explorer, the decisions and the limitations. What
 *  changed is where they sit: the evidence that used to fill half the
 *  Work landing page is now inside Technical details and Status, which
 *  is where someone reading about one project would look for it.
 * ══════════════════════════════════════════════════════════════════════ */

function Section({
  title,
  children,
  wide,
}: {
  title: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <section className="border-t border-line-soft py-14 lg:py-20">
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-3">
          <Reveal>
            <h2 className="label lg:sticky lg:top-24">{title}</h2>
          </Reveal>
        </div>
        <div className={wide ? "lg:col-span-9" : "lg:col-span-8"}>{children}</div>
      </div>
    </section>
  );
}

interface Props {
  project: Project;
  /** The project's own visual, rendered inside Screenshots. */
  visual?: ReactNode;
  /** An explanatory diagram, rendered inside What it does. */
  explainer?: ReactNode;
  /** The architecture explorer, rendered inside Technical details. */
  architecture?: ReactNode;
}

export function CaseStudy({ project, visual, explainer, architecture }: Props) {
  const reduced = useReducedMotion();
  const headRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: headRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 80]);
  const opacity = useTransform(scrollYProgress, [0, 0.9], [1, reduced ? 1 : 0.15]);

  const i = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(i + 1) % projects.length]!;
  const prev = projects[(i - 1 + projects.length) % projects.length]!;
  const status = statusMeta[project.status];

  return (
    <div className="mx-auto max-w-6xl px-6 lg:px-12">
      {/* ── Overview ─────────────────────────────────────────────── */}
      <div ref={headRef} className="py-16 lg:py-24">
        <motion.div style={{ y, opacity }}>
          <Reveal>
            <p className="label flex items-center gap-3">
              <span className="text-accent">{project.index}</span>
              <span aria-hidden className="h-px w-6 bg-line-strong" />
              <span>{project.category}</span>
            </p>
          </Reveal>
          <h1 className="display mt-7 text-[clamp(2.6rem,8vw,6.5rem)] leading-[0.95] text-ink">
            <MaskLine inView={false} delay={0.16}>
              {project.name}
            </MaskLine>
          </h1>
          <Reveal delay={0.24}>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink/85 lg:text-xl">
              {project.tagline}
            </p>
          </Reveal>
          <Reveal delay={0.32}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <StatusPill tone={status.tone}>{status.label}</StatusPill>
              <ul className="flex flex-wrap gap-1.5">
                {project.stack.map((t) => (
                  <li key={t} className="mono border border-line px-2.5 py-1.5 text-[11px] text-muted">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </motion.div>
      </div>

      <Section title="Overview">
        <div className="max-w-2xl space-y-5 text-[16px] leading-relaxed text-muted">
          {[...project.problem, ...project.solution].map((p, k) => (
            <Reveal key={k} delay={k * 0.05}>
              <p>{p}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── Screenshots ──────────────────────────────────────────── */}
      {visual ? (
        <Section title={project.screenshots.length ? "Screenshots" : "A closer look"} wide>
          <Reveal amount={0.1}>{visual}</Reveal>
        </Section>
      ) : null}

      {/* ── What it does ─────────────────────────────────────────── */}
      <Section title="What it does" wide>
        <ol className="grid gap-px bg-line-soft sm:grid-cols-2">
          {project.howItWorks.map((s, k) => (
            <Reveal as="li" key={s.title} delay={(k % 2) * 0.06} className="bg-base p-6">
              <p className="mono text-[10px] tracking-[0.2em] text-ghost">
                {String(k + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-3 text-[15px] text-ink">{s.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted">{s.detail}</p>
            </Reveal>
          ))}
        </ol>
        {explainer ? (
          <Reveal className="mt-10" amount={0.1}>
            {explainer}
          </Reveal>
        ) : null}
      </Section>

      {/* ── Technical details ────────────────────────────────────── */}
      <Section title="Technical details" wide>
        <Reveal>
          <dl className="grid grid-cols-2 gap-px bg-line-soft sm:grid-cols-4">
            {project.evidence.map((m) => (
              <div key={m.label} className="bg-base p-5">
                <dd className="display text-[1.7rem] leading-none text-ink">{m.value}</dd>
                <dt className="mt-2.5 text-xs text-muted">{m.label}</dt>
                {m.note ? <p className="mt-1.5 text-[11px] leading-snug text-faint">{m.note}</p> : null}
              </div>
            ))}
          </dl>
        </Reveal>

        {architecture ? (
          <Reveal className="mt-10" amount={0.1}>
            {architecture}
          </Reveal>
        ) : null}

        <Reveal className="mt-12">
          <h3 className="label">Decisions and trade-offs</h3>
          <ul className="mt-4 divide-y divide-line-soft border-y border-line-soft">
            {project.decisions.map((d) => (
              <li key={d.title}>
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-4 [&::-webkit-details-marker]:hidden">
                    <span className="text-[15px] text-ink">{d.title}</span>
                    <span
                      aria-hidden
                      className="mono mt-1 text-[11px] text-faint t-base group-open:rotate-45"
                    >
                      +
                    </span>
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
        </Reveal>
      </Section>

      {/* ── Status ───────────────────────────────────────────────── */}
      <Section title="Status" wide>
        <Reveal>
          <p className="max-w-2xl text-[16px] leading-relaxed text-ink/85">{project.statusNote}</p>
        </Reveal>

        <Reveal className="mt-10">
          <h3 className="label">What it does not do</h3>
          <ul className="mt-4 max-w-2xl space-y-3 text-sm leading-relaxed text-muted">
            {project.limitations.map((l) => (
              <li key={l} className="flex gap-3">
                <span aria-hidden className="mt-2.5 h-px w-3 shrink-0 bg-line-strong" />
                <span>{l}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="mt-10">
          <details className="group hairline bg-surface">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 [&::-webkit-details-marker]:hidden">
              <span className="flex flex-wrap items-center gap-3">
                <span className="label text-ink">How each figure was checked</span>
                <span className="text-xs text-faint">{project.verification.length} claims</span>
              </span>
              <span aria-hidden className="mono text-[11px] text-faint t-base group-open:rotate-45">
                +
              </span>
            </summary>
            <div className="overflow-x-auto border-t border-line-soft">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-line-soft">
                    <th scope="col" className="label-xs px-5 py-3 font-normal text-faint">Claim</th>
                    <th scope="col" className="label-xs px-5 py-3 font-normal text-faint">Source</th>
                    <th scope="col" className="label-xs px-5 py-3 font-normal text-faint">Checked</th>
                    <th scope="col" className="label-xs px-5 py-3 font-normal text-faint">Method</th>
                  </tr>
                </thead>
                <tbody>
                  {project.verification.map((v) => (
                    <tr key={v.claim} className="border-b border-line-soft align-top last:border-0">
                      <td className="px-5 py-3 text-ink">{v.claim}</td>
                      <td className="mono px-5 py-3 text-xs text-muted">{v.source}</td>
                      <td className="mono whitespace-nowrap px-5 py-3 text-xs text-faint">
                        {formatDate(v.date)}
                      </td>
                      <td className="px-5 py-3 text-xs text-muted">{v.method}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </Reveal>
      </Section>

      {/* ── Source ───────────────────────────────────────────────── */}
      <Section title="Source">
        <Reveal>
          {project.repo ? (
            <Magnetic>
              <a
                href={project.repo}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-3 border border-line-strong px-5 py-3.5 text-sm text-ink t-base hover:border-accent-soft hover:text-accent-soft"
              >
                <span className="mono text-[13px]">
                  {project.repo.replace("https://github.com/", "")}
                </span>
                <ArrowUpRight
                  className="h-4 w-4 t-base group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </a>
            </Magnetic>
          ) : (
            <p className="max-w-md text-sm leading-relaxed text-muted">
              {project.slug === "home-lab"
                ? "There is no repository for this one — it is a machine in my house."
                : "The repository is private, so there is nothing to link to yet."}
            </p>
          )}
        </Reveal>
      </Section>

      {/* ── Keep going ───────────────────────────────────────────── */}
      <nav
        aria-label="More work"
        className="grid gap-px border-t border-line-soft bg-line-soft sm:grid-cols-2"
      >
        <Link
          href={`/work/${prev.slug}`}
          className="group flex items-center gap-4 bg-base p-7 t-base hover:bg-surface"
        >
          <ArrowLeft className="h-4 w-4 shrink-0 text-faint t-base group-hover:-translate-x-1" aria-hidden />
          <span>
            <span className="label">Previous</span>
            <span className="display mt-2 block text-xl text-ink">{prev.name}</span>
          </span>
        </Link>
        <Link
          href={`/work/${next.slug}`}
          className="group flex items-center justify-end gap-4 bg-base p-7 text-right t-base hover:bg-surface"
        >
          <span>
            <span className="label">Next</span>
            <span className="display mt-2 block text-xl text-ink">{next.name}</span>
          </span>
          <ArrowRight className="h-4 w-4 shrink-0 text-faint t-base group-hover:translate-x-1" aria-hidden />
        </Link>
      </nav>
    </div>
  );
}

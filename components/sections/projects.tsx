"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Github, Star } from "lucide-react";
import type { Project } from "@/lib/types";
import { projects, starredProject, statusMeta } from "@/data/projects";
import { SectionHeader } from "@/components/ui/section-header";
import { StatusDot } from "@/components/ui/status-dot";
import { CaseFile } from "@/components/projects/case-file";
import { useWorld } from "@/components/world/world";

/* The index reads like a register of case files: identifier, name,
 * description, stack and status all present on the row itself — nothing
 * important is hidden behind a hover. Source links sit above the row's
 * click target so they stay independently reachable by keyboard.
 *
 * Systems Lab is the starred record here rather than a separate section;
 * opening it loads the interactive topology inside its case file. */

export function Projects() {
  const [open, setOpen] = useState<Project | null>(null);
  const world = useWorld();

  // Cluster 0 is the starred record; the four software records follow.
  const focus = (index: number) => ({
    onMouseEnter: () => world.setFocus(index),
    onMouseLeave: () => world.setFocus(-1),
    onFocus: () => world.setFocus(index),
    onBlur: () => world.setFocus(-1),
  });

  // Releasing the override is handled by the case file while it is open.
  const topology = {
    onMouseEnter: () => world.setOverride("topology"),
    onMouseLeave: () => world.setOverride(null),
    onFocus: () => world.setOverride("topology"),
    onBlur: () => world.setOverride(null),
  };

  return (
    <section id="projects" className="relative scroll-mt-20 py-24 sm:py-32 lg:py-40">
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <SectionHeader
          index="02"
          title="Projects"
          meta={`${projects.length + 1} RECORDS`}
          lead="Security tooling, applied software, and the infrastructure I run at home. Open a record for the full case file; the source for every software project is on GitHub."
        />

        <div className="mt-14">
          <StarredRow onOpen={() => setOpen(starredProject)} hover={topology} />

          <div className="mt-4 border-t border-line">
            {projects.map((p, i) => (
              <ProjectRow
                key={p.slug}
                project={p}
                order={i}
                onOpen={() => setOpen(p)}
                hover={focus(i + 1)}
              />
            ))}
          </div>
        </div>
      </div>

      <CaseFile project={open} onClose={() => setOpen(null)} />
    </section>
  );
}

type HoverProps = {
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onFocus: () => void;
  onBlur: () => void;
};

function StarredRow({ onOpen, hover }: { onOpen: () => void; hover: HoverProps }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      {...hover}
      className="group relative overflow-hidden border border-line bg-surface/40 transition-colors duration-500 hover:border-accent/35 hover:bg-accent/[0.035]"
    >
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 w-px bg-accent/60 transition-[width] duration-500 group-hover:w-[2px]"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(70% 140% at 0% 50%, rgba(69,212,238,0.07), transparent 60%)",
        }}
      />

      <div className="relative flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-stretch lg:gap-10 lg:p-10">
        <div className="flex items-center gap-3 lg:w-36 lg:shrink-0 lg:flex-col lg:items-start lg:gap-4 lg:self-stretch lg:border-r lg:border-line lg:pr-10">
          <span className="flex items-center gap-1.5 border border-accent/30 bg-accent/[0.06] px-2 py-1">
            <Star className="h-2.5 w-2.5 fill-accent text-accent" strokeWidth={0} />
            <span className="label-sm text-accent">STARRED</span>
          </span>
          <span className="mono text-[10px] tracking-[0.2em] text-ghost">
            CASE-{starredProject.caseId}
          </span>
          <span className="label-sm hidden text-ghost/60 lg:block">
            {starredProject.year?.toUpperCase()}
          </span>
        </div>

        <div className="flex-1">
          <h3 className="text-[clamp(1.5rem,3.6vw,2.25rem)] font-medium leading-tight tracking-[-0.035em] text-ink transition-colors group-hover:text-accent">
            {/* The click target spans the whole card via the pseudo-element. */}
            <button
              type="button"
              onClick={onOpen}
              className="text-left after:absolute after:inset-0 after:content-['']"
              aria-label={`Open case file 000 — ${starredProject.name}`}
            >
              {starredProject.name}
            </button>
          </h3>
          <p className="label-sm mt-2.5 text-accent/75">
            {starredProject.category.toUpperCase()}
          </p>
          <p className="mt-4 max-w-[54ch] text-pretty text-[14.5px] leading-relaxed text-muted">
            {starredProject.summary}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-1.5">
            {starredProject.stack.map((s) => (
              <span
                key={s}
                className="mono border border-line px-2 py-1 text-[10px] tracking-wider text-faint"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 lg:flex-col lg:items-end lg:gap-6">
          <span className="flex items-center gap-2">
            <StatusDot tone="accent" live />
            <span className="label-sm text-muted">RUNNING</span>
          </span>
          <span className="flex items-center gap-2 text-faint transition-colors group-hover:text-accent">
            <span className="label-sm">OPEN TOPOLOGY</span>
            <ArrowRight
              className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1"
              strokeWidth={1.6}
            />
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function ProjectRow({
  project,
  order,
  onOpen,
  hover,
}: {
  project: Project;
  order: number;
  onOpen: () => void;
  hover: HoverProps;
}) {
  const status = statusMeta[project.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.6, delay: order * 0.06, ease: [0.16, 1, 0.3, 1] }}
      {...hover}
      className="group relative border-b border-line"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-accent/[0.05] to-transparent transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
      />
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 w-px origin-top scale-y-0 bg-accent transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100"
      />

      <div className="relative flex flex-col gap-5 py-7 transition-[padding] duration-500 group-hover:pl-5 sm:flex-row sm:items-start sm:gap-7">
        <span className="mono w-[62px] shrink-0 text-[10px] tracking-[0.16em] text-ghost transition-colors group-hover:text-accent sm:mt-[9px]">
          CASE-{project.caseId}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1.5">
            <h3 className="text-[clamp(1.15rem,2.6vw,1.65rem)] font-medium tracking-[-0.03em] text-ink transition-colors duration-300 group-hover:text-accent">
              <button
                type="button"
                onClick={onOpen}
                className="text-left after:absolute after:inset-0 after:content-['']"
                aria-label={`Open case file ${project.caseId} — ${project.name}`}
              >
                {project.name}
              </button>
            </h3>
            <span className="label-sm text-ghost">{project.category.toUpperCase()}</span>
          </div>

          <p className="mt-2.5 max-w-[66ch] text-pretty text-[14px] leading-relaxed text-muted">
            {project.summary}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-1.5">
            {project.stack.map((s) => (
              <span
                key={s}
                className="mono border border-line px-2 py-1 text-[10px] tracking-wider text-ghost transition-colors duration-500 group-hover:border-ghost"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-x-5 gap-y-3 sm:mt-[5px] sm:flex-col sm:items-end sm:gap-3">
          <span className="flex items-center gap-2">
            <StatusDot tone={status.tone} live={project.status === "active"} />
            <span className="label-sm text-ghost">{status.label.toUpperCase()}</span>
          </span>

          <div className="flex items-center gap-3">
            {project.links.github ? (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="relative z-10 flex items-center gap-1.5 border border-line px-2.5 py-1.5 text-faint transition-colors hover:border-accent/40 hover:text-accent"
                aria-label={`${project.name} source on GitHub`}
              >
                <Github className="h-3 w-3" strokeWidth={1.7} />
                <span className="label-sm">SOURCE</span>
              </a>
            ) : null}

            {project.links.live ? (
              <a
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="relative z-10 flex items-center gap-1.5 border border-line px-2.5 py-1.5 text-faint transition-colors hover:border-accent/40 hover:text-accent"
                aria-label={`${project.name} live demo`}
              >
                <ArrowUpRight className="h-3 w-3" strokeWidth={1.7} />
                <span className="label-sm">DEMO</span>
              </a>
            ) : null}

            <span className="flex items-center gap-1.5 text-ghost transition-colors duration-500 group-hover:text-accent">
              <span className="label-sm">OPEN</span>
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-0.5"
                strokeWidth={1.5}
              />
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

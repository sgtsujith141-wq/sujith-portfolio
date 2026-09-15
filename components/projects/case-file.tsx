"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X, Github, ExternalLink, AlertTriangle, Star } from "lucide-react";
import type { Project } from "@/lib/types";
import { statusMeta } from "@/data/projects";
import { StatusDot } from "@/components/ui/status-dot";
import { SystemsLabDossier } from "@/components/systems/systems-lab-dossier";
import { useWorld } from "@/components/world/world";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

/* ------------------------------------------------------------------ *
 *  CASE FILE
 *  A dossier panel rather than a modal card: fixed header rail, numbered
 *  field blocks, and an honest "incomplete" state that names the missing
 *  fields instead of printing placeholder prose six times over.
 * ------------------------------------------------------------------ */

export function CaseFile({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const reduced = usePrefersReducedMotion();
  const world = useWorld();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const isTopology = project?.dossier === "systems-lab";

  /* Hold the background field in the home-lab tree for as long as the
   * dossier is open, so the diagram inside the panel reads as a close-up
   * of the same system rather than an unrelated graphic. */
  useEffect(() => {
    if (!isTopology) return;
    world.setOverride("topology");
    return () => world.setOverride(null);
  }, [isTopology, world]);

  useEffect(() => {
    if (!project) return;

    const prevOverflow = document.body.style.overflow;
    const prevFocus = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    // Focus the close control so Escape and Tab both start somewhere sane.
    window.setTimeout(() => closeRef.current?.focus(), 60);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const root = panelRef.current;
      if (!root) return;
      const focusables = root.querySelectorAll<HTMLElement>(
        'a[href],button:not([disabled]),input,[tabindex]:not([tabindex="-1"])',
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      prevFocus?.focus?.();
    };
  }, [project, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {project ? (
        <motion.div
          className="fixed inset-0 z-[110] flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div
            className={cn(
              "absolute inset-0",
              isTopology ? "bg-void/55 backdrop-blur-[1px]" : "bg-void/80 backdrop-blur-[2px]",
            )}
            onClick={onClose}
            aria-hidden
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={`Case file ${project.caseId} — ${project.name}`}
            initial={reduced ? { opacity: 0 } : { x: "100%" }}
            animate={reduced ? { opacity: 1 } : { x: 0 }}
            exit={reduced ? { opacity: 0 } : { x: "100%" }}
            transition={{ duration: 0.52, ease: [0.76, 0, 0.24, 1] }}
            className="relative flex h-full w-full flex-col border-l border-line bg-base shadow-[-30px_0_80px_-30px_rgba(0,0,0,0.95)] sm:max-w-[min(860px,94vw)]"
          >
            {/* One scan pass on open — the dossier being read in. */}
            {!reduced ? (
              <motion.span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 z-20 h-px"
                initial={{ top: 0, opacity: 0.9 }}
                animate={{ top: "100%", opacity: 0 }}
                transition={{ duration: 0.9, delay: 0.24, ease: "easeOut" }}
                style={{
                  background:
                    "linear-gradient(90deg,transparent,rgba(69,212,238,0.7),transparent)",
                }}
              />
            ) : null}

            <Header project={project} onClose={onClose} closeRef={closeRef} />

            <div className="flex-1 overflow-y-auto overscroll-contain">
              <div className="px-5 py-10 sm:px-10 lg:px-14">
                {project.dossier === "systems-lab" ? (
                  <SystemsLabDossier />
                ) : project.complete ? (
                  <CompleteBody project={project} />
                ) : (
                  <IncompleteBody project={project} />
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}

function Header({
  project,
  onClose,
  closeRef,
}: {
  project: Project;
  onClose: () => void;
  closeRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const status = statusMeta[project.status];
  return (
    <div className="shrink-0 border-b border-line bg-surface/70 backdrop-blur-xl">
      <div className="flex items-center justify-between px-5 py-3 sm:px-10 lg:px-14">
        <div className="flex min-w-0 items-center gap-3">
          {project.starred ? (
            <span className="flex shrink-0 items-center gap-1.5 border border-accent/30 bg-accent/[0.06] px-1.5 py-1">
              <Star className="h-2.5 w-2.5 fill-accent text-accent" strokeWidth={0} />
              <span className="label-sm text-accent">STARRED</span>
            </span>
          ) : null}
          <span className="mono shrink-0 text-[10px] tracking-[0.2em] text-accent">
            CASE-{project.caseId}
          </span>
          <span className="hidden h-3 w-px shrink-0 bg-line sm:block" />
          <span className="label-sm hidden truncate text-ghost sm:block">
            {project.category.toUpperCase()}
          </span>
        </div>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="group flex items-center gap-2 border border-line px-2.5 py-1.5 text-faint transition-colors hover:border-accent/40 hover:text-accent"
          aria-label="Close case file"
        >
          <span className="label-sm hidden sm:inline">CLOSE</span>
          <X className="h-3 w-3" strokeWidth={1.8} />
        </button>
      </div>

      <div className="px-5 pb-6 sm:px-10 lg:px-14">
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="text-[clamp(1.75rem,4.6vw,2.75rem)] font-medium leading-tight tracking-[-0.035em] text-ink"
        >
          {project.name}
        </motion.h3>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.26 }}
          className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2.5"
        >
          <span className="flex items-center gap-2">
            <StatusDot tone={status.tone} live={project.status === "active"} />
            <span className="label-sm text-muted">{status.label.toUpperCase()}</span>
          </span>
          {project.year ? (
            <span className="label-sm text-ghost tnum">{project.year}</span>
          ) : null}
          {project.links.github ? (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-faint transition-colors hover:text-accent"
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
              className="flex items-center gap-1.5 text-faint transition-colors hover:text-accent"
            >
              <ExternalLink className="h-3 w-3" strokeWidth={1.7} />
              <span className="label-sm">LIVE</span>
            </a>
          ) : null}
        </motion.div>
      </div>
    </div>
  );
}

function Field({
  index,
  title,
  children,
}: {
  index: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="border-t border-line-soft py-8 first:border-t-0 first:pt-0"
    >
      <div className="mb-4 flex items-center gap-3">
        <span className="label-sm tnum text-accent/70">{index}</span>
        <span className="label-sm text-faint">{title}</span>
        <span className="h-px flex-1 bg-line-soft" />
      </div>
      {children}
    </motion.section>
  );
}

function CompleteBody({ project }: { project: Project }) {
  return (
    <div>
      {project.overview ? (
        <Field index="01" title="OVERVIEW">
          <p className="text-pretty text-[15px] leading-[1.8] text-muted">{project.overview}</p>
        </Field>
      ) : null}

      {project.problem ? (
        <Field index="02" title="PROBLEM">
          <p className="text-pretty text-[15px] leading-[1.8] text-muted">{project.problem}</p>
        </Field>
      ) : null}

      {project.implementation ? (
        <Field index="03" title="IMPLEMENTATION">
          <p className="text-pretty text-[15px] leading-[1.8] text-muted">
            {project.implementation}
          </p>
        </Field>
      ) : null}

      {project.architecture.length ? (
        <Field index="04" title="ARCHITECTURE">
          <ol className="space-y-0">
            {project.architecture.map((node, i) => (
              <li
                key={node.label}
                className="group relative flex gap-4 border-l border-line py-4 pl-6 first:pt-0"
              >
                <span className="absolute -left-[3px] top-5 h-1.5 w-1.5 rounded-full bg-ghost transition-colors group-hover:bg-accent" />
                <span className="label-sm tnum shrink-0 pt-1 text-ghost">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <div className="mono text-[12px] tracking-wider text-ink">{node.label}</div>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-muted">{node.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </Field>
      ) : null}

      {project.technologies.length ? (
        <Field index="05" title="TECHNOLOGIES">
          {/* Chips rather than a grid: the list length is arbitrary, and a
              hairline grid would leave tinted holes on a short last row. */}
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.map((t) => (
              <span
                key={t}
                className="mono border border-line px-2.5 py-1.5 text-[11px] tracking-wider text-muted"
              >
                {t}
              </span>
            ))}
          </div>
        </Field>
      ) : null}

      {project.learnings.length ? (
        <Field index="06" title="LEARNINGS">
          <ul className="space-y-3.5">
            {project.learnings.map((l) => (
              <li key={l} className="flex gap-3.5">
                <span className="mt-2 h-px w-3 shrink-0 bg-accent/50" />
                <span className="text-[14.5px] leading-relaxed text-muted">{l}</span>
              </li>
            ))}
          </ul>
        </Field>
      ) : null}

      {!project.problem &&
      !project.implementation &&
      !project.architecture.length &&
      !project.learnings.length ? (
        <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-line-soft pt-6">
          <span className="label-sm text-ghost">FULL WRITEUP PENDING</span>
          {project.links.github ? (
            <>
              <span className="h-2.5 w-px bg-line" />
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="label-sm text-faint underline decoration-line underline-offset-4 transition-colors hover:text-accent"
              >
                READ THE SOURCE ON GITHUB
              </a>
            </>
          ) : null}
        </div>
      ) : null}

      {project.images.length ? (
        <Field index="07" title="CAPTURES">
          <div className="space-y-6">
            {project.images.map((img) => (
              <figure key={img.src} className="border border-line bg-surface">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  decoding="async"
                  className="w-full"
                />
                {img.caption ? (
                  <figcaption className="label border-t border-line px-3 py-2.5 text-ghost">
                    {img.caption}
                  </figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        </Field>
      ) : null}
    </div>
  );
}

const REQUIRED_FIELDS: { key: keyof Project; label: string }[] = [
  { key: "overview", label: "OVERVIEW" },
  { key: "problem", label: "PROBLEM" },
  { key: "implementation", label: "IMPLEMENTATION" },
  { key: "architecture", label: "ARCHITECTURE" },
  { key: "technologies", label: "TECHNOLOGIES" },
  { key: "learnings", label: "LEARNINGS" },
  { key: "images", label: "CAPTURES" },
];

/* Shown while `complete: false`. It states plainly that the record is not
 * written yet — no invented detail, and it doubles as the author's checklist. */
function IncompleteBody({ project }: { project: Project }) {
  const missing = REQUIRED_FIELDS.filter(({ key }) => {
    const v = project[key];
    return Array.isArray(v) ? v.length === 0 : !v || String(v).startsWith("Details pending");
  });

  return (
    <div>
      <div className="flex items-start gap-3.5 border border-warn/25 bg-warn/[0.04] px-4 py-4">
        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warn" strokeWidth={1.7} />
        <div>
          <div className="label-sm text-warn">RECORD INCOMPLETE</div>
          <p className="mt-2 text-[14px] leading-relaxed text-muted">
            This case file is reserved but not yet written up. Nothing has been filled in on
            purpose — the details will be added once the project is ready to be described
            accurately.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <div className="mb-4 flex items-center gap-3">
          <span className="label-sm text-faint">PENDING FIELDS</span>
          <span className="h-px flex-1 bg-line-soft" />
          <span className="label-sm tnum text-ghost">
            {missing.length} / {REQUIRED_FIELDS.length}
          </span>
        </div>
        <div className="grid grid-cols-1 gap-px bg-line sm:grid-cols-2">
          {REQUIRED_FIELDS.map((f) => {
            const pending = missing.some((m) => m.key === f.key);
            return (
              <div
                key={f.key as string}
                className="flex items-center gap-2.5 bg-base px-3.5 py-3"
              >
                <StatusDot tone={pending ? "muted" : "signal"} />
                <span
                  className={cn(
                    "label-sm",
                    pending ? "text-ghost" : "text-muted",
                  )}
                >
                  {f.label}
                </span>
                <span className="label-sm ml-auto text-ghost/60">
                  {pending ? "AWAITING" : "OK"}
                </span>
              </div>
            );
          })}
          {/* Keeps the hairline grid square when the field count is odd. */}
          {REQUIRED_FIELDS.length % 2 === 1 ? (
            <div className="hidden bg-base sm:block" aria-hidden />
          ) : null}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/types";
import { statusMeta } from "@/content/projects";
import { Reveal } from "@/components/animations/reveal";
import { StatusPill } from "@/components/ui/status-pill";
import { DUR, EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

/* ══════════════════════════════════════════════════════════════════════
 *  OTHER WORK & EXPERIMENTS
 *
 *  The preview here replaces one the audit found broken. Reproduced
 *  behaviour of the old version, hovering five rows quickly:
 *
 *    row 1 → idle state   row 2 → idle state   row 3 → idle state
 *    row 4 → correct      row 5 → one behind   leaving → never cleared
 *
 *  Three causes, all fixed here:
 *
 *  1. `AnimatePresence mode="wait"` serialised exit before enter, so
 *     moving faster than the exit duration showed the idle state through
 *     the gap. Every panel is now mounted at once and only its opacity
 *     is animated, with `initial={false}` — Motion re-targets a running
 *     animation instead of restarting it, so interruption is free and
 *     there is no exit queue to fall through.
 *  2. `onMouseLeave` reset the selection to null, adding a third state
 *     to churn through on every pass between two rows. Leaving now keeps
 *     the last project. The panel is never empty — it opens on the first.
 *  3. Nothing was preloaded. Because all panels are mounted, every image
 *     is fetched up front and a first hover never waits.
 *
 *  And the reason it exists at all is secondary: each row already states
 *  what the project is. Nobody has to hover to learn anything, which is
 *  what makes the touch and keyboard experience the same experience.
 * ══════════════════════════════════════════════════════════════════════ */

export function OtherWork({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState(0);

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
      <div className="lg:col-span-7">
        <ol className="border-t border-line-soft">
          {projects.map((p, i) => {
            const on = i === active;
            return (
              <Reveal as="li" key={p.slug} delay={i * 0.05} className="border-b border-line-soft">
                <Link
                  href={`/work/${p.slug}`}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className="group block py-6 lg:py-7"
                >
                  <div className="flex items-baseline gap-5 lg:gap-6">
                    <span
                      aria-hidden
                      className={cn(
                        "mt-3 h-1.5 w-1.5 shrink-0 rounded-full t-base",
                        on ? "bg-accent" : "bg-line-strong",
                      )}
                    />
                    <div className="min-w-0 flex-1">
                      <h3
                        className={cn(
                          "display text-[clamp(1.4rem,3vw,2.1rem)] leading-tight t-base",
                          on ? "text-ink" : "text-muted group-hover:text-ink",
                        )}
                      >
                        {p.name}
                      </h3>
                      {/* Always visible. Nothing here depends on a pointer. */}
                      <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-faint">
                        {p.tagline}
                      </p>
                      <div className="mt-3.5 flex flex-wrap items-center gap-3">
                        <StatusPill tone={statusMeta[p.status].tone}>
                          {statusMeta[p.status].label}
                        </StatusPill>
                        {p.slug === "surakshascore-mvp" ? (
                          <span className="mono text-[10.5px] tracking-[0.1em] text-ghost">
                            THE EARLIER VERSION OF SURAKSHASCORE
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <ArrowUpRight
                      className={cn(
                        "mt-1 h-4 w-4 shrink-0 t-base",
                        on ? "text-accent-soft" : "text-ghost",
                        "group-hover:-translate-y-0.5 group-hover:translate-x-0.5",
                      )}
                      aria-hidden
                    />
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </ol>
      </div>

      {/* Persistent preview. Every panel is mounted; only opacity moves. */}
      <div aria-hidden className="hidden lg:col-span-5 lg:block">
        <div className="sticky top-24">
          <div className="relative aspect-[4/5] overflow-hidden border border-line bg-surface">
            {projects.map((p, i) => {
              const shot = p.screenshots[0];
              const on = i === active;
              return (
                <motion.div
                  key={p.slug}
                  initial={false}
                  animate={{ opacity: on ? 1 : 0, scale: on ? 1 : 1.025 }}
                  transition={{ duration: DUR.fast * 1.3, ease: EASE_OUT }}
                  className="absolute inset-0"
                >
                  {shot ? (
                    <Image
                      src={shot.src}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 34vw, 0px"
                      className={cn(
                        "object-top",
                        shot.height > shot.width ? "object-contain p-8" : "object-cover",
                      )}
                    />
                  ) : (
                    // No screenshot exists for this one, and staging a
                    // fake is not an option — so the panel is composed
                    // from what is true about it instead.
                    <div className="flex h-full flex-col justify-between p-7">
                      <div>
                        <p className="display text-[2rem] leading-none text-ink/90">{p.name}</p>
                        <p className="mt-4 max-w-[28ch] text-sm leading-relaxed text-faint">
                          {p.statusNote}
                        </p>
                      </div>
                      <ul className="flex flex-wrap gap-1.5">
                        {p.stack.slice(0, 6).map((t) => (
                          <li
                            key={t}
                            className="mono border border-line px-2 py-1 text-[10.5px] text-faint"
                          >
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-ghost">
            {projects[active]?.screenshots[0]?.caption ??
              (projects[active]?.repo
                ? "No screenshot for this one yet."
                : "This one is a machine, not a repository.")}
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { projects, statusMeta } from "@/content/projects";
import { useLivingSystem } from "@/components/canvas/living-system";
import { Reveal } from "@/components/animations/reveal";
import { MaskLine } from "@/components/animations/mask-reveal";
import { StatusPill } from "@/components/ui/status-pill";
import { useDesktop } from "@/hooks/use-media";
import { cn } from "@/lib/utils";
import { DUR, EASE_OUT } from "@/lib/motion";

/* ══════════════════════════════════════════════════════════════════════
 *  THE WORK INDEX
 *
 *  Five projects as full-width rows rather than cards. Pointing at one
 *  lights its module in the page-wide field and cross-fades a real
 *  screenshot into the panel beside the list; the home lab has no
 *  screenshot, so it shows its stack instead of a staged image.
 * ══════════════════════════════════════════════════════════════════════ */

export function WorkIndex() {
  const [active, setActive] = useState<string | null>(null);
  const { setHover, setStage } = useLivingSystem();
  const stageRef = useRef<HTMLDivElement>(null);
  const desktop = useDesktop();

  useEffect(() => {
    setStage(stageRef.current);
    return () => setStage(null);
  }, [setStage]);

  const current = projects.find((p) => p.slug === active);
  const shot = current?.screenshots[0];

  return (
    <div className="mx-auto max-w-6xl px-6 lg:px-12">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <ol className="border-t border-line-soft">
            {projects.map((p, i) => (
              <Reveal
                as="li"
                key={p.slug}
                delay={i * 0.05}
                className="border-b border-line-soft"
              >
                <div
                  onMouseEnter={() => {
                    setActive(p.slug);
                    setHover(`p-${p.slug}`);
                  }}
                  onMouseLeave={() => {
                    setActive(null);
                    setHover(null);
                  }}
                >
                  <Link
                    href={`/work/${p.slug}`}
                    onFocus={() => setActive(p.slug)}
                    onBlur={() => setActive(null)}
                    className="group block py-7 t-base lg:py-8"
                  >
                    <div className="flex items-baseline gap-4 lg:gap-6">
                      <span className="mono shrink-0 text-[11px] tracking-[0.2em] text-ghost">
                        {p.index}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h2 className="display text-[clamp(1.7rem,4.2vw,2.9rem)] leading-none text-muted t-base group-hover:text-ink">
                          <MaskLine>{p.name}</MaskLine>
                        </h2>
                        <p className="mt-3 max-w-xl text-sm leading-relaxed text-faint t-base group-hover:text-muted">
                          {p.tagline}
                        </p>
                        <div className="mt-4 flex flex-wrap items-center gap-3">
                          <StatusPill tone={statusMeta[p.status].tone}>
                            {statusMeta[p.status].label}
                          </StatusPill>
                          <span className="mono text-[10.5px] tracking-[0.12em] text-ghost">
                            {p.category.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <ArrowUpRight
                        className="mt-1 h-5 w-5 shrink-0 text-ghost t-base group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-soft"
                        aria-hidden
                      />
                    </div>
                  </Link>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>

        {/* Preview panel — the window the field fills when nothing is hovered. */}
        <div className="hidden lg:col-span-5 lg:block">
          <div ref={stageRef} className="sticky top-24 h-[30rem]">
            <AnimatePresence mode="wait">
              {current && desktop ? (
                <motion.div
                  key={current.slug}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: DUR.base, ease: EASE_OUT }}
                  className="hairline h-full overflow-hidden bg-surface"
                >
                  <div className="flex items-center justify-between border-b border-line-soft px-4 py-3">
                    <span className="label">{current.name}</span>
                    <span className="mono text-[10px] tracking-[0.16em] text-ghost">
                      {shot ? "REAL SCREENSHOT" : "NO SCREENSHOT"}
                    </span>
                  </div>
                  {shot ? (
                    <div
                      className={cn(
                        "flex items-center justify-center overflow-hidden p-4",
                        shot.height > shot.width ? "h-[calc(100%-6.5rem)]" : "",
                      )}
                    >
                      <Image
                        src={shot.src}
                        alt={shot.alt}
                        width={shot.width}
                        height={shot.height}
                        sizes="(min-width: 1024px) 34vw, 90vw"
                        className={cn(
                          "border border-line",
                          shot.height > shot.width ? "h-full w-auto rounded-[14px]" : "w-full",
                        )}
                      />
                    </div>
                  ) : (
                    <div className="p-5">
                      <p className="text-sm leading-relaxed text-muted">{current.statusNote}</p>
                      <ul className="mt-5 flex flex-wrap gap-1.5">
                        {current.stack.map((s) => (
                          <li
                            key={s}
                            className="mono border border-line px-2 py-1 text-[10.5px] text-faint"
                          >
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <p className="border-t border-line-soft px-4 py-3 text-xs text-faint">
                    {shot?.caption ?? "This one is a machine, not a repository."}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="flex h-full flex-col justify-end"
                >
                  <span className="label-xs text-ghost">Living system · project modules</span>
                  <p className="mt-3 max-w-xs text-sm leading-relaxed text-faint">
                    Point at a project to bring its module forward.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { hackathons } from "@/data/hackathons";
import { SectionHeader } from "@/components/ui/section-header";
import { StatusDot } from "@/components/ui/status-dot";
import { cn } from "@/lib/utils";

/* Attendance only. The layout is built so a single entry does not look
 * lonely and a future list of six still reads as a register. */

export function Hackathons() {
  return (
    <section id="hackathons" className="relative scroll-mt-20 py-24 sm:py-32 lg:py-40">
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <SectionHeader
          index="04"
          title="Hackathons"
          meta={`${hackathons.length} ${hackathons.length === 1 ? "EVENT" : "EVENTS"}`}
          lead="Events entered, listed plainly. Nothing is claimed beyond what actually happened."
        />

        <div className="mt-14 border-t border-line">
          {hackathons.map((h, i) => {
            const won = h.role?.toLowerCase() === "winner";
            return (
            <motion.article
              key={h.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.65, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              className="group relative grid grid-cols-1 gap-6 border-b border-line py-9 lg:grid-cols-[72px_minmax(0,1fr)_auto] lg:gap-10"
            >
              <span
                aria-hidden
                className={cn(
                  "absolute inset-y-0 left-0 w-px origin-top scale-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100",
                  won ? "bg-signal/60" : "bg-accent/60",
                )}
              />

              <span className="label-sm tnum text-ghost lg:pt-3">
                {String(i + 1).padStart(2, "0")}
              </span>

              <div>
                <h3 className="text-[clamp(1.35rem,3vw,1.9rem)] font-medium tracking-[-0.03em] text-ink transition-colors group-hover:text-accent">
                  {h.name}
                </h3>

                <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-2">
                  <span className={cn("label-sm", won ? "text-signal/80" : "text-accent/75")}>
                    {h.scale.toUpperCase()}
                  </span>
                  {h.location ? (
                    <>
                      <span className="h-2.5 w-px bg-line" />
                      <span className="label-sm text-ghost">{h.location.toUpperCase()}</span>
                    </>
                  ) : null}
                  {h.date ? (
                    <>
                      <span className="h-2.5 w-px bg-line" />
                      <span className="label-sm tnum text-ghost">{h.date}</span>
                    </>
                  ) : null}
                </div>

                <p className="mt-5 max-w-[62ch] text-pretty text-[14.5px] leading-[1.8] text-muted">
                  {h.detail}
                </p>

                <div className="mt-6 flex flex-wrap gap-1.5">
                  {h.facts.map((f) => (
                    <span
                      key={f}
                      className={cn(
                        "mono border px-2 py-1 text-[10px] tracking-wider transition-colors duration-500",
                        won
                          ? "border-signal/25 text-signal/70"
                          : "border-line text-ghost group-hover:border-ghost",
                      )}
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              {h.role ? (
                <span
                  className={cn(
                    "flex items-center gap-2 lg:self-start lg:pt-3",
                    won && "border border-signal/30 bg-signal/[0.05] px-2.5 py-1.5 lg:mt-1",
                  )}
                >
                  <StatusDot tone={won ? "signal" : "muted"} live={won} />
                  <span className={cn("label-sm", won ? "text-signal" : "text-faint")}>
                    {h.role.toUpperCase()}
                  </span>
                </span>
              ) : null}
            </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

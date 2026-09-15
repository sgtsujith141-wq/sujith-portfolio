"use client";

import { capabilities } from "@/data/capabilities";
import { Rule } from "@/components/ui/section-header";
import { Reveal, StaggerList, StaggerItem } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

/* Capabilities carries no navigation index — it is supporting evidence for
 * the sections around it, not a chapter of its own. A group with a long
 * list earns a double column and splits its own items, which keeps the row
 * heights comparable without hard-coding anything per group. */

export function Capabilities() {
  return (
    <section id="capabilities" className="relative scroll-mt-20 pb-24 sm:pb-32 lg:pb-40">
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <Rule label="CAPABILITIES" className="mb-8" />

        <Reveal>
          <h2 className="max-w-[46ch] text-[clamp(1.4rem,3vw,2rem)] font-medium leading-tight tracking-[-0.03em] text-ink">
            Grouped by how well I actually know them.
          </h2>
          <p className="mt-4 max-w-[58ch] text-[14.5px] leading-relaxed text-faint">
            No scores, no bars. The qualifier on each group is the honest part.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-px border border-line bg-line lg:grid-cols-12">
          {capabilities.map((group) => {
            const wide = group.items.length > 7;
            return (
              <div
                key={group.id}
                className={cn(
                  "bg-base p-6 sm:p-7",
                  wide ? "lg:col-span-6" : "lg:col-span-3",
                )}
              >
                <span className="label-sm block text-accent/75">
                  {group.level.toUpperCase()}
                </span>
                <h3 className="mt-3.5 text-[19px] font-medium tracking-[-0.025em] text-ink">
                  {group.title}
                </h3>
                <p className="mt-3 text-[13px] leading-relaxed text-faint">{group.note}</p>

                <StaggerList
                  className={cn("mt-7", wide && "sm:columns-2 sm:gap-x-10")}
                >
                  {group.items.map((item, i) => (
                    <StaggerItem key={item}>
                      <div className="group flex break-inside-avoid items-center gap-3.5 border-t border-line-soft py-2.5 transition-colors hover:border-accent/25">
                        <span className="label-sm tnum w-5 shrink-0 text-ghost/70 transition-colors group-hover:text-accent">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-[14.5px] text-muted transition-colors group-hover:text-ink">
                          {item}
                        </span>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerList>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

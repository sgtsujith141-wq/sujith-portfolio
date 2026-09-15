"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";
import { DecryptText } from "./decrypt-text";

/* Every section opens the same way: a hairline rail carrying the section
 * index and a right-aligned meta readout, then the title, then one line of
 * lead copy. Consistency here is what makes the site read as one system. */

interface SectionHeaderProps {
  index: string;
  title: string;
  /** Mono readout on the right of the rail, e.g. "05 ENTRIES". */
  meta?: string;
  /** Small supporting line above the title, e.g. "Currently exploring". */
  kicker?: string;
  lead?: ReactNode;
  className?: string;
}

export function SectionHeader({
  index,
  title,
  meta,
  kicker,
  lead,
  className,
}: SectionHeaderProps) {
  return (
    <header className={cn("relative", className)}>
      <div className="flex items-center gap-4 border-t border-line pt-3">
        <span className="label-sm text-accent">{index}</span>
        <span className="h-px flex-1 bg-gradient-to-r from-line via-line to-transparent" />
        {meta ? <span className="label-sm text-faint tnum">{meta}</span> : null}
      </div>

      {kicker ? (
        <Reveal className="mt-6" y={12}>
          <span className="label-sm text-accent/75">{kicker.toUpperCase()}</span>
        </Reveal>
      ) : null}

      <Reveal className={kicker ? "mt-4" : "mt-7"} y={22}>
        <h2 className="text-[clamp(2rem,5.2vw,3.5rem)] font-medium leading-[0.95] tracking-[-0.035em] text-ink">
          <DecryptText text={title} trigger="view" stagger={22} churn={260} />
        </h2>
      </Reveal>

      {lead ? (
        <Reveal className="mt-5 max-w-[58ch]" delay={0.08}>
          <p className="text-pretty text-[15px] leading-relaxed text-muted">{lead}</p>
        </Reveal>
      ) : null}
    </header>
  );
}

/** Thin labelled divider used inside sections. */
export function Rule({ label, className }: { label?: string; className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {label ? <span className="label text-ghost">{label}</span> : null}
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}

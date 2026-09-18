import type { ReactNode } from "react";
import { Reveal } from "@/components/animations/reveal";
import { cn } from "@/lib/utils";

interface Props {
  index: string;
  label: string;
  title: ReactNode;
  lede?: ReactNode;
  className?: string;
  align?: "left" | "center";
}

/** Eyebrow ("02 / Selected Work"), display heading and an optional lede. */
export function SectionHeader({ index, label, title, lede, className, align = "left" }: Props) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      <Reveal>
        <p className="label flex items-center gap-3">
          <span className="text-accent">{index}</span>
          <span aria-hidden className="h-px w-6 bg-line-strong" />
          <span>{label}</span>
        </p>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="display mt-6 text-[clamp(2.2rem,5.2vw,4.4rem)] text-ink">{title}</h2>
      </Reveal>
      {lede ? (
        <Reveal delay={0.16}>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">{lede}</p>
        </Reveal>
      ) : null}
    </div>
  );
}

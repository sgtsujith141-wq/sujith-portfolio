"use client";

import { useCallback, useId, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Screenshot } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Props {
  shots: Screenshot[];
  frame: "desktop" | "phone";
  label?: string;
  projectName: string;
}

/** Real screenshots only. Keyboard: ← → move, Home/End jump. */
export function Gallery({ shots, frame, label = "Real screenshots", projectName }: Props) {
  const [i, setI] = useState(0);
  const id = useId();
  const shot = shots[i]!;
  const go = useCallback((n: number) => setI((cur) => (cur + n + shots.length) % shots.length), [shots.length]);

  return (
    <figure
      className="hairline bg-surface"
      aria-roledescription="carousel"
      aria-label={`${projectName} screenshots`}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1);
        else if (e.key === "ArrowLeft") go(-1);
        else if (e.key === "Home") setI(0);
        else if (e.key === "End") setI(shots.length - 1);
      }}
    >
      <div className="flex items-center justify-between border-b border-line-soft px-4 py-3">
        <span className="label">{label}</span>
        <span className="mono text-[10px] tracking-[0.16em] text-ghost" aria-live="polite">
          {String(i + 1).padStart(2, "0")} / {String(shots.length).padStart(2, "0")}
        </span>
      </div>

      <div className={cn("relative p-4", frame === "phone" && "flex justify-center")}>
        <div
          className={cn(
            "relative overflow-hidden border border-line bg-void",
            frame === "phone" ? "w-[min(100%,224px)] rounded-[22px] border-line-strong p-1.5" : "w-full",
          )}
          style={frame === "desktop" ? { aspectRatio: `${shot.width} / ${shot.height}` } : undefined}
        >
          <Image
            key={shot.src}
            src={shot.src}
            alt={shot.alt}
            width={shot.width}
            height={shot.height}
            sizes={frame === "phone" ? "224px" : "(min-width: 1024px) 40vw, 92vw"}
            className={cn("h-auto w-full", frame === "phone" && "rounded-[16px]")}
            priority={false}
          />
        </div>
      </div>

      <figcaption id={`${id}-cap`} className="flex items-start justify-between gap-4 border-t border-line-soft px-4 py-3">
        <span className="text-xs leading-relaxed text-muted">{shot.caption}</span>
        <span className="flex shrink-0 items-center gap-1">
          <button type="button" onClick={() => go(-1)} aria-label="Previous screenshot" className="border border-line p-1.5 text-faint hover:border-line-strong hover:text-ink">
            <ChevronLeft className="h-3.5 w-3.5" aria-hidden />
          </button>
          <button type="button" onClick={() => go(1)} aria-label="Next screenshot" className="border border-line p-1.5 text-faint hover:border-line-strong hover:text-ink">
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
          </button>
        </span>
      </figcaption>

      <ol className="flex gap-1.5 overflow-x-auto border-t border-line-soft px-4 py-3" aria-label="Choose screenshot">
        {shots.map((s, k) => (
          <li key={s.src}>
            <button
              type="button"
              onClick={() => setI(k)}
              aria-label={`Show screenshot ${k + 1}: ${s.caption}`}
              aria-current={k === i ? "true" : undefined}
              className={cn(
                "block h-1.5 t-base",
                k === i ? "w-8 bg-accent" : "w-4 bg-line-strong hover:bg-muted",
              )}
            />
          </li>
        ))}
      </ol>
    </figure>
  );
}

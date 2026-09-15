import { cn } from "@/lib/utils";

type Tone = "accent" | "signal" | "muted" | "warn" | "violet";

const toneClass: Record<Tone, string> = {
  accent: "bg-accent",
  signal: "bg-signal",
  muted: "bg-ghost",
  warn: "bg-warn",
  violet: "bg-violet",
};

const haloClass: Record<Tone, string> = {
  accent: "bg-accent/25",
  signal: "bg-signal/25",
  muted: "bg-ghost/25",
  warn: "bg-warn/25",
  violet: "bg-violet/25",
};

/** A 4px status dot with an optional breathing halo. Live states pulse,
 *  dormant states sit still — the motion itself carries the meaning. */
export function StatusDot({
  tone = "muted",
  live = false,
  className,
}: {
  tone?: Tone;
  live?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("relative inline-flex h-1.5 w-1.5 shrink-0", className)}>
      {live ? (
        <span
          className={cn(
            "absolute inset-0 -m-1 rounded-full animate-pulse-dot",
            haloClass[tone],
          )}
        />
      ) : null}
      <span className={cn("relative h-1.5 w-1.5 rounded-full", toneClass[tone])} />
    </span>
  );
}

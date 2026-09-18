import { cn } from "@/lib/utils";

type Tone = "accent" | "warn" | "muted" | "ok" | "signal";

const tones: Record<Tone, string> = {
  accent: "border-accent/40 text-accent-soft",
  signal: "border-signal/40 text-signal",
  warn: "border-warn/40 text-warn",
  ok: "border-ok/40 text-ok",
  muted: "border-line-strong text-muted",
};

export function StatusPill({ tone = "muted", children, className }: { tone?: Tone; children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("label-xs inline-flex items-center gap-2 border px-2.5 py-1.5", tones[tone], className)}>
      <span className={cn("h-1 w-1 rounded-full bg-current")} aria-hidden />
      {children}
    </span>
  );
}

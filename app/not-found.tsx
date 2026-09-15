import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <span className="mono text-[11px] tracking-[0.22em] text-accent">ERROR 404</span>
      <h1 className="text-[clamp(2rem,6vw,3.5rem)] font-medium tracking-[-0.04em] text-ink">
        No such record
      </h1>
      <p className="max-w-[46ch] text-[15px] leading-relaxed text-muted">
        That route is not part of this system. The index is still where it was.
      </p>
      <Link
        href="/"
        className="mono border border-line px-4 py-3 text-[12px] uppercase tracking-[0.08em] text-muted transition-colors hover:border-accent/50 hover:text-accent"
      >
        Return to index
      </Link>
    </main>
  );
}

import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <p className="label">Node not found</p>
      <h1 className="display mt-4 text-[clamp(2.5rem,8vw,5rem)] text-ink">404</h1>
      <p className="mt-4 max-w-md text-muted">
        This address is not part of the system. The portfolio is a single page.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-3 border border-line-strong px-5 py-3 text-sm text-ink transition-colors hover:border-accent hover:text-accent-soft"
      >
        Return to the system
      </Link>
    </main>
  );
}

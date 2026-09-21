"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { projects } from "@/content/projects";
import { cn } from "@/lib/utils";

/* Persistent navigation for the Work layer: back to the world, and a
 * switcher across the five projects. Plain links, so browser back,
 * keyboard and deep links behave natively. */
export function WorkHeader() {
  const pathname = usePathname();
  return (
    <header
      data-enter="nav"
      style={{ "--enter-delay": "120ms" } as React.CSSProperties}
      className="fixed inset-x-0 top-0 z-[100] border-b border-line-soft bg-base/80 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 lg:px-12">
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2.5 text-muted t-base hover:text-ink"
        >
          <ArrowLeft
            className="h-3.5 w-3.5 t-base group-hover:-translate-x-0.5"
            aria-hidden
          />
          <span className="mono text-[11px] tracking-[0.18em]">SUJITH C</span>
        </Link>
        <span aria-hidden className="hidden h-4 w-px bg-line-strong sm:block" />
        <nav aria-label="Projects" className="min-w-0 flex-1">
          <ol className="flex gap-1 overflow-x-auto">
            <li className="shrink-0">
              <Link
                href="/work"
                aria-current={pathname === "/work" ? "page" : undefined}
                className={cn(
                  "block px-3 py-1.5 text-[13px] t-base",
                  pathname === "/work" ? "text-ink" : "text-faint hover:text-ink",
                )}
              >
                All
              </Link>
            </li>
            {projects.map((p) => {
              const active = pathname === `/work/${p.slug}`;
              return (
                <li key={p.slug} className="shrink-0">
                  <Link
                    href={`/work/${p.slug}`}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 text-[13px] t-base",
                      active ? "text-ink" : "text-faint hover:text-ink",
                    )}
                  >
                    <span className="mono text-[10px] tracking-[0.18em]">{p.index}</span>
                    <span className="whitespace-nowrap">{p.name}</span>
                    <span
                      aria-hidden
                      className={cn(
                        "h-px t-slow",
                        active ? "w-4 bg-accent" : "w-0 bg-line-strong",
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </header>
  );
}

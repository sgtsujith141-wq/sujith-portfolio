"use client";

import { useEffect, useState } from "react";
import { sections } from "@/content/navigation";
import { profile } from "@/content/personal";
import { useActiveSection } from "@/hooks/use-active-section";
import { cn } from "@/lib/utils";

/* ══════════════════════════════════════════════════════════════════════
 *  NAV RAIL — desktop.
 *
 *  A vertical rail on the right edge: six indices, the active one
 *  extended into its label, a progress line that fills as the page is
 *  read, and small system coordinates (section index · percent) at the
 *  bottom. Plain anchor links, so keyboard, back navigation and deep
 *  links all behave natively.
 * ══════════════════════════════════════════════════════════════════════ */

export function NavRail() {
  const active = useActiveSection();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const activeIndex = sections.findIndex((s) => s.id === active);

  return (
    <>
      {/* Wordmark, top-left. */}
      <a
        href="#introduction"
        data-enter="nav"
        style={{ "--enter-delay": "1600ms" } as React.CSSProperties}
        className="fixed left-6 top-6 z-[100] hidden items-center gap-3 lg:flex"
        aria-label={`${profile.name} — back to top`}
      >
        <span className="relative flex h-2.5 w-2.5 items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-accent/30 animate-pulse-dot" />
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        </span>
        <span className="mono text-[11px] tracking-[0.2em] text-muted">SUJITH C</span>
      </a>

      <nav
        aria-label="Sections"
        data-enter="nav"
        style={{ "--enter-delay": "1650ms" } as React.CSSProperties}
        className="fixed right-6 top-1/2 z-[100] hidden -translate-y-1/2 lg:block"
      >
        <ol className="relative flex flex-col items-end gap-4">
          {/* Progress line. */}
          <span aria-hidden className="absolute -right-3 top-0 h-full w-px bg-line">
            <span
              className="absolute left-0 top-0 h-full w-px origin-top bg-accent"
              style={{
                transform: `scaleY(${progress})`,
                transition: "transform 240ms var(--ease-soft)",
              }}
            />
          </span>
          {sections.map((s, i) => {
            const isActive = s.id === active;
            const passed = i < activeIndex;
            return (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  aria-current={isActive ? "location" : undefined}
                  className={cn(
                    "group relative flex items-center gap-3 py-1 pr-1 t-base",
                    isActive ? "text-ink" : passed ? "text-muted hover:text-ink" : "text-faint hover:text-ink",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "mono t-width pointer-events-none absolute right-full mr-3 translate-x-1 whitespace-nowrap text-[11px] tracking-[0.14em] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100",
                      isActive && "translate-x-0 opacity-100",
                    )}
                  >
                    {s.label.toUpperCase()}
                  </span>
                  <span className="mono text-[11px] tabular-nums tracking-[0.2em]">{s.index}</span>
                  <span
                    aria-hidden
                    className={cn(
                      "h-px t-slow",
                      isActive ? "w-6 bg-accent" : "w-3 bg-line-strong group-hover:w-5 group-hover:bg-muted",
                    )}
                  />
                </a>
              </li>
            );
          })}
        </ol>

        {/* System coordinates. */}
        <p className="mono mt-8 text-right text-[10px] tabular-nums tracking-[0.2em] text-ghost" aria-live="off">
          <span className="text-faint">{sections[activeIndex]?.index ?? "01"}</span>
          <span className="mx-1.5">/</span>
          <span>{String(Math.round(progress * 100)).padStart(3, "0")}</span>
        </p>
      </nav>
    </>
  );
}

"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { X, Menu } from "lucide-react";
import { sections } from "@/content/navigation";
import { profile } from "@/content/profile";
import { useActiveSection } from "@/hooks/use-active-section";
import { cn } from "@/lib/utils";

/* Compact navigation below the desktop breakpoint: a slim top bar with
 * the wordmark, the current section, and a Menu button that opens a
 * full-screen sheet. The sheet is a dialog: focus moves into it, Escape
 * closes it, and the page behind is inert. */
export function MobileNav() {
  const active = useActiveSection();
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const current = sections.find((s) => s.id === active);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <div
        data-enter="nav"
        style={{ "--enter-delay": "1600ms" } as React.CSSProperties}
        className="fixed inset-x-0 top-0 z-[100] flex items-center justify-between border-b border-line-soft bg-base/80 px-4 py-3 backdrop-blur-md"
      >
        <a href="#introduction" className="flex items-center gap-2.5" aria-label={`${profile.name} — back to top`}>
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          <span className="mono text-[11px] tracking-[0.2em] text-muted">SUJITH C</span>
        </a>
        <div className="flex items-center gap-4">
          <span className="mono text-[10px] tracking-[0.18em] text-faint" aria-live="polite">
            {current?.index} / {current?.short.toUpperCase()}
          </span>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={open}
            className="flex items-center gap-2 border border-line-strong px-3 py-1.5 text-xs text-ink"
          >
            <Menu className="h-3.5 w-3.5" aria-hidden />
            Menu
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[150] flex flex-col bg-base/95 px-6 pb-8 pt-4 backdrop-blur-md"
          >
            <div className="flex items-center justify-between">
              <span id={titleId} className="label">
                Sections
              </span>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 border border-line-strong px-3 py-1.5 text-xs text-ink"
              >
                <X className="h-3.5 w-3.5" aria-hidden />
                Close
              </button>
            </div>
            <ol className="mt-10 flex flex-col gap-1">
              {sections.map((s, i) => (
                <motion.li
                  key={s.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.04, duration: 0.4 }}
                >
                  <a
                    href={`#${s.id}`}
                    onClick={() => setOpen(false)}
                    aria-current={s.id === active ? "location" : undefined}
                    className={cn(
                      "flex items-baseline gap-4 border-b border-line-soft py-4",
                      s.id === active ? "text-ink" : "text-muted",
                    )}
                  >
                    <span className="mono text-[11px] tracking-[0.2em] text-faint">{s.index}</span>
                    <span className="display text-2xl">{s.label}</span>
                  </a>
                </motion.li>
              ))}
            </ol>
            <div className="mt-auto flex flex-wrap gap-x-6 gap-y-3">
              <a href={profile.links.github} target="_blank" rel="noreferrer" className="link-line text-sm text-muted">
                GitHub
              </a>
              <a href={profile.links.linkedin} target="_blank" rel="noreferrer" className="link-line text-sm text-muted">
                LinkedIn
              </a>
              <Link href="/work" className="link-line text-sm text-muted">
                Work
              </Link>
              {profile.resume.available ? (
                <a href={profile.resume.href} target="_blank" rel="noreferrer" className="link-line text-sm text-muted">
                  Resume
                </a>
              ) : null}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

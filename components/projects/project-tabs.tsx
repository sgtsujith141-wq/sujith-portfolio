"use client";

import { projects } from "@/content/projects";
import type { ProjectSlug } from "@/lib/types";
import { cn } from "@/lib/utils";

/* Sticky project navigation. Anchor links, so it works without JS; the
 * active state follows the case study currently being read. */
export function ProjectTabs({ active }: { active: ProjectSlug | null }) {
  return (
    <nav
      aria-label="Projects"
      className="sticky top-[53px] z-[60] -mx-6 border-y border-line-soft bg-base/85 px-6 backdrop-blur-md lg:top-0 lg:mx-0 lg:px-0"
    >
      <ol className="mx-auto flex max-w-6xl gap-1 overflow-x-auto py-2">
        {projects.map((p) => {
          const isActive = p.slug === active;
          return (
            <li key={p.slug} className="shrink-0">
              <a
                href={`#project-${p.slug}`}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm t-base",
                  isActive ? "text-ink" : "text-faint hover:text-ink",
                )}
              >
                <span className="mono text-[10px] tracking-[0.2em]">{p.index}</span>
                <span>{p.name}</span>
                <span
                  aria-hidden
                  className={cn("h-px t-slow", isActive ? "w-5 bg-accent" : "w-0 bg-line-strong")}
                />
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

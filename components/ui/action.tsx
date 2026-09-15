"use client";

import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

/* One button language for the whole site: square corners, hairline border,
 * a corner tick that lights on hover, and an accent wash instead of a fill.
 * Buttons and links share it so an anchor never looks like a second system. */

const base =
  "group relative inline-flex select-none items-center gap-2.5 px-4 py-3 text-[12px] font-medium tracking-[0.08em] uppercase transition-[color,background-color,border-color] duration-300 focus-visible:outline-1 focus-visible:outline-offset-2";

const variants = {
  primary:
    "border border-accent/40 bg-accent/[0.07] text-accent hover:bg-accent/[0.13] hover:border-accent/70",
  ghost:
    "border border-line text-muted hover:border-ghost hover:text-ink hover:bg-raise/50",
} as const;

interface Props {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: keyof typeof variants;
  external?: boolean;
  className?: string;
  download?: boolean;
  ariaLabel?: string;
}

export function Action({
  children,
  href,
  onClick,
  variant = "ghost",
  external,
  className,
  ariaLabel,
}: Props) {
  const content = (
    <>
      <span className="relative z-10 mono">{children}</span>
      {external ? (
        <ArrowUpRight
          className="relative z-10 h-3 w-3 transition-transform duration-300 group-hover:-translate-y-px group-hover:translate-x-px"
          strokeWidth={1.8}
        />
      ) : null}
      {/* corner ticks */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 h-1.5 w-1.5 border-l border-t border-current opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 h-1.5 w-1.5 border-b border-r border-current opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
    </>
  );

  const cls = cn(base, variants[variant], className);

  if (href) {
    return (
      <a
        href={href}
        aria-label={ariaLabel}
        className={cls}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {content}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} aria-label={ariaLabel} className={cls}>
      {content}
    </button>
  );
}

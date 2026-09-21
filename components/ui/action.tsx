"use client";

import type { ReactNode } from "react";
import { ArrowUpRight, ArrowDown, FileText } from "lucide-react";
import { Magnetic } from "@/components/animations/magnetic";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";

interface ActionProps {
  href: string;
  children: ReactNode;
  variant?: Variant;
  external?: boolean;
  icon?: "arrow" | "down" | "file" | "none";
  className?: string;
  ariaLabel?: string;
}

const styles: Record<Variant, string> = {
  primary:
    "bg-ink text-base hover:bg-white border border-ink",
  secondary:
    "border border-line-strong text-ink hover:border-accent-soft hover:text-accent-soft bg-base/40",
  ghost: "text-muted hover:text-ink",
};

/** Every call to action on the site. Magnetic on fine pointers, capped at 6px. */
export function Action({
  href,
  children,
  variant = "secondary",
  external,
  icon = "arrow",
  className,
  ariaLabel,
}: ActionProps) {
  const Icon = icon === "arrow" ? ArrowUpRight : icon === "down" ? ArrowDown : icon === "file" ? FileText : null;
  return (
    <Magnetic>
      <a
        href={href}
        aria-label={ariaLabel}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        className={cn(
          "group inline-flex items-center gap-2.5 px-5 py-3 text-sm font-medium t-base",
          styles[variant],
          className,
        )}
      >
        <span>{children}</span>
        {Icon ? (
          <Icon
            aria-hidden
            className={cn(
              "h-4 w-4 t-base",
              icon === "arrow" && "group-hover:-translate-y-0.5 group-hover:translate-x-0.5",
              icon === "down" && "group-hover:translate-y-0.5",
            )}
          />
        ) : null}
      </a>
    </Magnetic>
  );
}

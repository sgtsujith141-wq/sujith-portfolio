"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { profile } from "@/data/profile";
import { useCommandPalette } from "@/components/palette/command-palette";
import { isMac, scrollToSection } from "@/lib/utils";

export function Footer() {
  const { setOpen } = useCommandPalette();
  const [meta, setMeta] = useState("CTRL");
  const year = new Date().getFullYear();

  useEffect(() => setMeta(isMac() ? "⌘" : "CTRL"), []);

  return (
    <footer className="border-t border-line bg-void">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 px-5 py-8 sm:px-8 lg:flex-row lg:items-center lg:px-12">
        <div className="flex items-center gap-3">
          <span className="flex h-5 w-5 items-center justify-center border border-line">
            <span className="mono text-[9px] tracking-tight text-faint">SC</span>
          </span>
          <span className="label-sm text-faint">{profile.displayName}</span>
        </div>

        <span className="label-sm text-ghost/70 lg:ml-6">
          © {year} {profile.name.toUpperCase()} · {profile.disciplines.join(" · ")}
        </span>

        <div className="flex items-center gap-5 lg:ml-auto">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="label-sm text-ghost transition-colors hover:text-accent"
          >
            {meta}K
          </button>
          <button
            type="button"
            onClick={() => scrollToSection("index")}
            className="group flex items-center gap-2 text-ghost transition-colors hover:text-accent"
            aria-label="Back to top"
          >
            <span className="label-sm">TOP</span>
            <ArrowUp
              className="h-3 w-3 transition-transform duration-300 group-hover:-translate-y-0.5"
              strokeWidth={1.7}
            />
          </button>
        </div>
      </div>
    </footer>
  );
}

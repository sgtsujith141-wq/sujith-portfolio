"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Command } from "cmdk";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  CornerDownLeft,
  FolderGit2,
  Github,
  Linkedin,
  Mail,
  Phone,
  FileText,
  Radar,
  RotateCcw,
  Terminal,
  User,
  Trophy,
  Copy,
  Check,
} from "lucide-react";
import { profile } from "@/data/profile";
import { githubProfile, linkedinProfile } from "@/data/social";
import { cn, scrollToSection } from "@/lib/utils";
import { useCommandPalette } from "./command-palette";

type Action = {
  id: string;
  label: string;
  hint: string;
  keywords: string;
  icon: typeof Terminal;
  run: () => void;
  external?: boolean;
};

export function PalettePanel() {
  const { open, setOpen } = useCommandPalette();
  const [copied, setCopied] = useState(false);
  const restoreRef = useRef<HTMLElement | null>(null);

  // Remember what had focus so Escape returns the user where they were.
  useEffect(() => {
    if (open) {
      restoreRef.current = document.activeElement as HTMLElement;
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
        restoreRef.current?.focus?.();
      };
    }
  }, [open]);

  const go = useCallback(
    (id: string) => () => {
      setOpen(false);
      // Wait for the exit transition so the scroll lands on a settled layout.
      window.setTimeout(() => scrollToSection(id), 90);
    },
    [setOpen],
  );

  const openUrl = useCallback(
    (href: string) => () => {
      setOpen(false);
      window.open(href, "_blank", "noopener,noreferrer");
    },
    [setOpen],
  );

  const groups: { heading: string; items: Action[] }[] = useMemo(
    () => [
      {
        heading: "Navigate",
        items: [
          { id: "about", label: "About", hint: "01", keywords: "bio who education bmsit", icon: User, run: go("about") },
          { id: "projects", label: "Projects", hint: "02", keywords: "case files work systems lab homelab topology surakshascore cryptodrishti aether", icon: FolderGit2, run: go("projects") },
          { id: "cybersecurity", label: "Cybersecurity", hint: "03", keywords: "cyber security exploring learning", icon: Radar, run: go("cybersecurity") },
          { id: "hackathons", label: "Hackathons", hint: "04", keywords: "avinya smart india sih events", icon: Trophy, run: go("hackathons") },
          { id: "contact", label: "Contact", hint: "05", keywords: "email phone reach message", icon: Mail, run: go("contact") },
        ],
      },
      {
        heading: "Links",
        items: [
          { id: "github", label: "GitHub", hint: "sgtsujith141-wq", keywords: "code repo source", icon: Github, run: openUrl(githubProfile), external: true },
          { id: "linkedin", label: "LinkedIn", hint: "profile", keywords: "network professional", icon: Linkedin, run: openUrl(linkedinProfile), external: true },
          // Resume appears only when a real PDF is wired up.
          ...(profile.resume.available
            ? [
                {
                  id: "resume",
                  label: "Resume",
                  hint: "pdf",
                  keywords: "cv download",
                  icon: FileText,
                  run: openUrl(profile.resume.href),
                  external: true,
                } satisfies Action,
              ]
            : []),
        ],
      },
      {
        heading: "Actions",
        items: [
          {
            id: "copy-email",
            label: copied ? "Email copied" : "Copy email address",
            hint: profile.contact.email,
            keywords: "clipboard mail contact",
            icon: copied ? Check : Copy,
            run: () => {
              navigator.clipboard?.writeText(profile.contact.email).then(() => {
                setCopied(true);
                window.setTimeout(() => setCopied(false), 1600);
              });
            },
          },
          {
            id: "call",
            label: "Call",
            hint: profile.contact.phone,
            keywords: "phone dial number mobile",
            icon: Phone,
            run: () => {
              window.location.href = profile.contact.phoneHref;
            },
          },
          {
            id: "replay-intro",
            label: "Replay opening sequence",
            hint: "reload",
            keywords: "intro animation boot again",
            icon: RotateCcw,
            run: () => window.location.reload(),
          },
        ],
      },
    ],
    [go, openUrl, copied],
  );

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[14vh] sm:pt-[18vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
        >
          <div
            className="absolute inset-0 bg-void/80 backdrop-blur-[3px]"
            onClick={() => setOpen(false)}
            aria-hidden
          />

          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.99 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[560px] overflow-hidden rounded-[3px] border border-line bg-surface shadow-[0_24px_80px_-20px_rgba(0,0,0,0.9)]"
          >
            {/* Instrument header strip. */}
            <div className="flex items-center justify-between border-b border-line-soft bg-raise/60 px-3 py-2">
              <div className="flex items-center gap-2">
                <Terminal className="h-3 w-3 text-accent" strokeWidth={1.6} />
                <span className="label-sm text-faint">COMMAND</span>
              </div>
              <kbd className="mono rounded-[2px] border border-line px-1.5 py-0.5 text-[9px] tracking-widest text-ghost">
                ESC
              </kbd>
            </div>

            <Command label="Command palette" loop>
              <div className="flex items-center gap-2.5 border-b border-line-soft px-3.5">
                <span className="mono select-none text-[13px] text-accent">›</span>
                <Command.Input
                  autoFocus
                  placeholder="Search sections, links and actions…"
                  className="h-12 w-full bg-transparent text-[14px] text-ink outline-none placeholder:text-ghost"
                />
              </div>

              <Command.List className="max-h-[min(62vh,440px)] overflow-y-auto overscroll-contain px-1.5 pb-2">
                <Command.Empty className="px-3 py-8 text-center">
                  <span className="label text-ghost">NO MATCH</span>
                </Command.Empty>

                {groups.map((group) => (
                  <Command.Group key={group.heading} heading={group.heading}>
                    {group.items.map((item) => (
                      <Command.Item
                        key={item.id}
                        value={`${item.label} ${item.keywords}`}
                        onSelect={item.run}
                        className={cn(
                          "group flex cursor-pointer items-center gap-3 rounded-[2px] px-2.5 py-2 text-[13.5px] text-muted",
                          "data-[selected=true]:bg-accent/[0.07] data-[selected=true]:text-ink",
                          "data-[selected=true]:shadow-[inset_2px_0_0_0_var(--color-accent)]",
                        )}
                      >
                        <item.icon
                          className="h-3.5 w-3.5 shrink-0 text-faint group-data-[selected=true]:text-accent"
                          strokeWidth={1.6}
                        />
                        <span className="flex-1 truncate">{item.label}</span>
                        <span className="mono hidden truncate text-[10px] tracking-wider text-ghost sm:inline">
                          {item.hint}
                        </span>
                        {item.external ? (
                          <ArrowUpRight className="h-3 w-3 shrink-0 text-ghost group-data-[selected=true]:text-accent" strokeWidth={1.6} />
                        ) : (
                          <CornerDownLeft
                            className="h-3 w-3 shrink-0 text-transparent group-data-[selected=true]:text-accent"
                            strokeWidth={1.6}
                          />
                        )}
                      </Command.Item>
                    ))}
                  </Command.Group>
                ))}
              </Command.List>
            </Command>

            {/* Footer legend. */}
            <div className="flex items-center gap-4 border-t border-line-soft bg-raise/40 px-3 py-2">
              <Legend keys={["↑", "↓"]} action="navigate" />
              <Legend keys={["↵"]} action="select" />
              <span className="ml-auto label-sm text-ghost/70">SUJITH C</span>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function Legend({ keys, action }: { keys: string[]; action: string }) {
  return (
    <span className="flex items-center gap-1.5">
      {keys.map((k) => (
        <kbd
          key={k}
          className="mono flex h-4 min-w-4 items-center justify-center rounded-[2px] border border-line px-1 text-[9px] text-faint"
        >
          {k}
        </kbd>
      ))}
      <span className="label-sm text-ghost/80">{action}</span>
    </span>
  );
}

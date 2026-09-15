"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { DecryptText } from "@/components/ui/decrypt-text";
import { Action } from "@/components/ui/action";
import { StatusDot } from "@/components/ui/status-dot";
import { profile } from "@/data/profile";
import { githubProfile } from "@/data/social";
import { scrollToSection } from "@/lib/utils";

/* The opening interface. Not a hero — it is the console you land on:
 * identity, discipline, one honest sentence, three ways in. */

export function Opening() {
  /* Unconditional on purpose: MotionConfig applies the reduced-motion
   * policy globally. Swapping these props out after mount used to leave
   * elements frozen at their initial opacity. */
  const fade = (delay: number) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <section
      id="index"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden pt-24 pb-20"
      aria-label="Introduction"
    >
      <div className="grid-field pointer-events-none absolute inset-0 opacity-35 mask-fade-b sm:opacity-[0.55]" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(120% 70% at 18% 0%, rgba(69,212,238,0.055), transparent 58%), radial-gradient(90% 60% at 82% 100%, rgba(139,124,246,0.035), transparent 60%)",
        }}
      />

      {/* Left instrument rail — desktop only. */}
      <div
        className="pointer-events-none absolute left-5 top-1/2 hidden -translate-y-1/2 xl:block"
        aria-hidden
      >
        <div className="flex flex-col items-center gap-4">
          <span className="h-16 w-px bg-gradient-to-b from-transparent to-line" />
          <span
            className="label-sm text-ghost"
            style={{ writingMode: "vertical-rl" }}
          >
            {profile.location} · CSE
          </span>
          <span className="h-16 w-px bg-gradient-to-t from-transparent to-line" />
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <motion.div {...fade(0.05)} className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <span className="flex items-center gap-2">
            <StatusDot tone="accent" live />
            <span className="label-sm text-accent">OPEN TO OPPORTUNITIES</span>
          </span>
          <span className="hidden h-3 w-px bg-line sm:block" />
          <span className="label-sm text-faint">{profile.role.toUpperCase()}</span>
        </motion.div>

        {/* data-morph-target: the opening sequence measures this box and
            flies its own centred name onto it before the two cross-fade. */}
        <motion.h1
          data-morph-target
          {...fade(0.12)}
          className="mt-7 w-fit text-[clamp(3rem,13.5vw,10.5rem)] font-medium leading-[0.86] tracking-[-0.055em] text-ink"
        >
          <DecryptText text={profile.displayName} stagger={44} churn={200} delay={120} />
        </motion.h1>

        <motion.div
          {...fade(0.2)}
          className="mt-8 flex flex-wrap items-center gap-x-3.5 gap-y-2 border-t border-line pt-5"
        >
          {profile.disciplines.map((d, i) => (
            <span key={d} className="flex items-center gap-3.5">
              {i > 0 ? <span className="text-accent/40" aria-hidden>•</span> : null}
              <span className="label-sm text-muted">{d}</span>
            </span>
          ))}
        </motion.div>

        <motion.p
          {...fade(0.28)}
          className="mt-8 max-w-[62ch] text-pretty text-[15.5px] leading-[1.75] text-muted sm:text-[16.5px]"
        >
          {profile.statement}
        </motion.p>

        <motion.div {...fade(0.36)} className="mt-11 flex flex-wrap items-center gap-3">
          <Action variant="primary" onClick={() => scrollToSection("projects")}>
            Explore Projects
          </Action>
          <Action href={githubProfile} external>
            GitHub
          </Action>
          {/* Rendered only when a real PDF exists — never a link that 404s. */}
          {profile.resume.available ? (
            <Action href={profile.resume.href} external>
              Resume
            </Action>
          ) : null}
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.button
        type="button"
        onClick={() => scrollToSection("projects")}
        {...fade(0.6)}
        className="group absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-ghost transition-colors hover:text-accent md:flex"
        aria-label="Scroll to projects"
      >
        <span className="label-sm">SCROLL</span>
        <ChevronDown className="h-3 w-3 animate-pulse-dot" strokeWidth={1.6} />
      </motion.button>
    </section>
  );
}

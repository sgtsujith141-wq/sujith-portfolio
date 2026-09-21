"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { profile } from "@/content/profile";
import { Action } from "@/components/ui/action";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/* ══════════════════════════════════════════════════════════════════════
 *  01 · INTRODUCTION
 *
 *  The name is the hero, as it originally was. The opening sequence in
 *  components/intro/intro-sequence.tsx resolves SUJITH C out of cipher
 *  glyphs at the centre of the screen, then flies it onto the <h1>
 *  below — which is marked data-morph-target and stays invisible until
 *  the travelling name has arrived on its box. The two cross-fade, so
 *  there is no flash and nothing jumps.
 *
 *  Everything else here waits for that landing and then follows in a
 *  short stagger, keyed to the intro state rather than a separate timer
 *  so the two can never drift apart.
 * ══════════════════════════════════════════════════════════════════════ */

export function Hero() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, reduced ? 1 : 0]);

  const delay = (ms: number) => ({ "--enter-delay": `${ms}ms` }) as React.CSSProperties;

  return (
    <section
      id="introduction"
      ref={ref}
      aria-labelledby="hero-title"
      className="relative flex min-h-dvh flex-col justify-center px-6 pb-28 pt-28 lg:px-12 lg:pt-24"
    >
      {/* Translate and opacity only — a blur or a scale here would force
          the whole hero to re-rasterise on every scroll frame. */}
      <motion.div style={{ y, opacity }} className="mx-auto w-full max-w-6xl">
        <p data-enter style={delay(120)} className="label flex items-center gap-3">
          <span className="text-accent">01</span>
          <span aria-hidden className="h-px w-6 bg-line-strong" />
          <span>Introduction</span>
        </p>

        {/* The morph target. The opening sequence measures this box. */}
        <h1
          id="hero-title"
          data-morph-target
          className="mono mt-7 whitespace-nowrap text-[clamp(2.6rem,11vw,7.5rem)] font-medium leading-none tracking-[0.04em] text-ink"
        >
          {profile.displayName}
        </h1>

        <p
          data-enter
          style={delay(180)}
          className="display mt-8 max-w-3xl text-[clamp(1.35rem,3.4vw,2.6rem)] leading-[1.15] text-muted"
        >
          Exploring networks, securing systems, and building things that{" "}
          <span className="text-ink">matter</span>.
        </p>

        <div className="mt-11 grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <p
              data-enter
              style={delay(300)}
              className="mono flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] tracking-[0.18em] text-faint"
            >
              <span>{profile.role.toUpperCase()}</span>
              <span aria-hidden className="h-px w-4 bg-line-strong" />
              <span>{profile.education.short.toUpperCase()}</span>
              <span aria-hidden className="h-px w-4 bg-line-strong" />
              <span>{profile.location.toUpperCase()}</span>
            </p>
            <p
              data-enter
              style={delay(380)}
              className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
            >
              {profile.statement}
            </p>
          </div>

          <div className="flex flex-wrap items-start gap-3 lg:col-span-5 lg:justify-end">
            <span data-enter style={delay(520)}>
              <Action href="#about" variant="primary" icon="down">
                About me
              </Action>
            </span>
            <span data-enter style={delay(580)}>
              <Link
                href="/work"
                className="group inline-flex items-center gap-2.5 border border-line-strong bg-base/40 px-5 py-3 text-sm font-medium text-ink transition-[color,border-color] duration-300 hover:border-accent-soft hover:text-accent-soft"
              >
                See my work
                <span
                  aria-hidden
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                >
                  →
                </span>
              </Link>
            </span>
            <span data-enter style={delay(640)}>
              <Action href={profile.links.github} external>
                GitHub
              </Action>
            </span>
            {profile.resume.available ? (
              <span data-enter style={delay(700)}>
                <Action href={profile.resume.href} external icon="file" ariaLabel="Open resume (PDF)">
                  Resume
                </Action>
              </span>
            ) : null}
          </div>
        </div>

        <ul
          data-enter
          style={delay(820)}
          className="mt-14 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-line-soft pt-6"
          aria-label="What I enjoy"
        >
          {profile.interests.map((t, i) => (
            <li key={t} className="flex items-center gap-5">
              {i > 0 ? <span aria-hidden className="h-1 w-1 rounded-full bg-ghost" /> : null}
              <span className="mono text-[11px] tracking-[0.16em] text-faint">{t.toUpperCase()}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      <a
        href="#about"
        data-enter
        style={delay(900)}
        className="group absolute bottom-8 left-6 flex items-center gap-4 lg:left-12"
        aria-label="Scroll to About"
      >
        <span className="relative block h-12 w-px overflow-hidden bg-line">
          <span className="absolute inset-x-0 top-0 h-1/2 bg-accent animate-scroll-cue" />
        </span>
        <span className="label transition-colors group-hover:text-ink">Scroll</span>
      </a>
    </section>
  );
}

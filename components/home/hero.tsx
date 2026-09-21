"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { profile, tagline, about, interests } from "@/content/personal";
import { Magnetic } from "@/components/animations/magnetic";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/* ══════════════════════════════════════════════════════════════════════
 *  SCENE 1 · ARRIVAL
 *
 *  The opening sequence in components/intro/intro-sequence.tsx resolves
 *  SUJITH C out of cipher glyphs at the centre of the screen and flies
 *  it onto the <h1> below, which is marked data-morph-target and stays
 *  invisible until the travelling name has landed on its box.
 *
 *  The composition is a single left-aligned column rather than the old
 *  two-column split: the audit found the right-hand action block wrapped
 *  into two ragged rows and lined up with nothing. Everything now hangs
 *  off one edge, with the actions inline under the statement and the
 *  interests set as one quiet line along the bottom.
 * ══════════════════════════════════════════════════════════════════════ */

export function Hero() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // Translate and opacity only — a blur or a scale here re-rasterises the
  // whole hero on every scroll frame.
  const y = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 130]);
  const opacity = useTransform(scrollYProgress, [0, 0.72], [1, reduced ? 1 : 0]);
  const railY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 60]);

  const delay = (ms: number) => ({ "--enter-delay": `${ms}ms` }) as React.CSSProperties;

  return (
    <section
      id="introduction"
      ref={ref}
      aria-labelledby="hero-title"
      className="relative flex min-h-dvh flex-col justify-center px-6 pb-24 pt-28 lg:px-12"
    >
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
          className="mono mt-8 whitespace-nowrap text-[clamp(2.7rem,11.5vw,8rem)] font-medium leading-[0.92] tracking-[0.03em] text-ink"
        >
          {profile.displayName}
        </h1>

        <p
          data-enter
          style={delay(180)}
          className="display mt-9 max-w-[22ch] text-[clamp(1.45rem,3.6vw,2.9rem)] leading-[1.12] text-muted sm:max-w-[30ch]"
        >
          {tagline.replace(/ matter\.$/, " ")}
          <span className="text-ink">matter</span>.
        </p>

        <p
          data-enter
          style={delay(300)}
          className="mono mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] tracking-[0.18em] text-faint"
        >
          <span>{profile.role.toUpperCase()}</span>
          <span aria-hidden className="h-px w-5 bg-line-strong" />
          <span>{profile.education.short.toUpperCase()}</span>
          <span aria-hidden className="h-px w-5 bg-line-strong" />
          <span>{profile.location.toUpperCase()}</span>
        </p>

        <p
          data-enter
          style={delay(370)}
          className="mt-6 max-w-[46ch] text-base leading-relaxed text-muted sm:text-lg"
        >
          {about[1]}
        </p>

        {/* One inline row, so nothing wraps into a ragged block. */}
        <div data-enter style={delay(520)} className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <Magnetic>
            <Link
              href="/work"
              className="group inline-flex items-center gap-3 bg-ink px-6 py-3.5 text-sm font-medium text-base t-base hover:bg-white"
            >
              See my work
              <ArrowUpRight
                className="h-4 w-4 t-base group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
          </Magnetic>
          <a href="#about" className="link-line text-sm text-muted t-base hover:text-ink">
            More about me
          </a>
          <a
            href={profile.links.github}
            target="_blank"
            rel="noreferrer"
            className="link-line text-sm text-muted t-base hover:text-ink"
          >
            GitHub
          </a>
          {profile.resume.available ? (
            <a
              href={profile.resume.href}
              target="_blank"
              rel="noreferrer"
              className="link-line text-sm text-muted t-base hover:text-ink"
            >
              Resume
            </a>
          ) : null}
        </div>
      </motion.div>

      {/* The interests sit on the floor of the screen, drifting a little
          slower than the column above as you scroll. */}
      <motion.div
        style={{ y: railY, opacity }}
        className="pointer-events-none absolute inset-x-0 bottom-0 px-6 pb-8 lg:px-12"
      >
        <div className="mx-auto flex max-w-6xl items-end justify-between gap-8">
          <a
            href="#about"
            data-enter
            style={delay(820)}
            className="group pointer-events-auto flex items-center gap-3 text-faint t-base hover:text-ink"
            aria-label="Scroll to About"
          >
            <span className="relative block h-10 w-px overflow-hidden bg-line">
              <span className="absolute inset-x-0 top-0 h-1/2 bg-accent animate-scroll-cue" />
            </span>
            <ArrowDown className="h-3.5 w-3.5" aria-hidden />
          </a>
          <ul
            data-enter
            style={delay(880)}
            className="mono hidden max-w-[58ch] flex-wrap justify-end gap-x-4 gap-y-1.5 text-right text-[10.5px] tracking-[0.16em] text-ghost md:flex"
            aria-label="What I enjoy"
          >
            {interests.map((t) => (
              <li key={t.id}>{t.label.toUpperCase()}</li>
            ))}
          </ul>
        </div>
      </motion.div>
    </section>
  );
}

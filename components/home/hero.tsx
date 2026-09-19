"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { profile } from "@/content/profile";
import { headline } from "@/content/identity";
import { useLivingSystem } from "@/components/canvas/living-system";
import { Action } from "@/components/ui/action";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/* ══════════════════════════════════════════════════════════════════════
 *  01 · INTRODUCTION
 *
 *  The opening is about Sujith, not about a repository. The headline is
 *  three lines that rise out from behind a mask, one after another, over
 *  a field that is igniting at the same time.
 *
 *  Choreography, from the moment the page is interactive:
 *    0ms     a single pulse at centre — the system initialising
 *    200ms   ignite(): the network emerges, ring by ring
 *    420ms   line 1 rises
 *    560ms   line 2
 *    700ms   line 3
 *    1100ms  name plate and statement
 *    1450ms  actions
 *    1600ms  navigation
 *    1850ms  the interests rail and the scroll cue
 *
 *  Nothing blocks. Scrolling is available throughout, no storage is
 *  consulted, and a real page load always replays it. Reduced motion
 *  renders the finished state, decided before first paint in layout.tsx.
 * ══════════════════════════════════════════════════════════════════════ */

export function Hero() {
  const { ignite } = useLivingSystem();
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 140]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, reduced ? 1 : 0]);

  useEffect(() => {
    const t = window.setTimeout(ignite, 200);
    return () => clearTimeout(t);
  }, [ignite]);

  const delay = (ms: number) => ({ "--enter-delay": `${ms}ms` }) as React.CSSProperties;

  return (
    <section
      id="introduction"
      ref={ref}
      aria-labelledby="hero-title"
      className="relative flex min-h-dvh flex-col justify-center px-6 pb-28 pt-28 lg:px-12 lg:pt-24"
    >
      {/* Translate and opacity only. A scale or blur here would force the
          whole hero to re-rasterise on every scroll frame. */}
      <motion.div style={{ y, opacity }} className="mx-auto w-full max-w-6xl">
        <p data-enter="rise" style={delay(300)} className="label flex items-center gap-3">
          <span className="text-accent">01</span>
          <span aria-hidden className="h-px w-6 bg-line-strong" />
          <span>Introduction</span>
        </p>

        {/* The headline: three masked lines, staged. */}
        <h1
          id="hero-title"
          className="display mt-8 text-[clamp(2.3rem,6.6vw,5.4rem)] leading-[1.02] text-ink"
          aria-label={headline.plain}
        >
          {headline.lines.map((line, i) => (
            <span key={line} aria-hidden className="block overflow-hidden pb-[0.08em]">
              <span
                data-enter="line"
                style={delay(420 + i * 140)}
                className="block"
              >
                {i === 2 ? (
                  <>
                    building things that{" "}
                    <em className="not-italic text-accent-soft">matter</em>.
                  </>
                ) : (
                  line
                )}
              </span>
            </span>
          ))}
        </h1>

        <div className="mt-10 grid gap-8 lg:mt-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <p
              data-enter="rise"
              style={delay(1100)}
              className="mono flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] tracking-[0.18em] text-faint"
            >
              <span className="text-ink">SUJITH C</span>
              <span aria-hidden className="h-px w-4 bg-line-strong" />
              <span>{profile.role.toUpperCase()}</span>
              <span aria-hidden className="h-px w-4 bg-line-strong" />
              <span>{profile.location.toUpperCase()}</span>
            </p>
            <p
              data-enter="rise"
              style={delay(1200)}
              className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
            >
              {profile.statement}
            </p>
          </div>

          <div className="flex flex-wrap items-start gap-3 lg:col-span-5 lg:justify-end">
            <span data-enter="rise" style={delay(1450)}>
              <Action href="#about" variant="primary" icon="down">
                Explore my world
              </Action>
            </span>
            <span data-enter="rise" style={delay(1510)}>
              <Link
                href="/work"
                className="group inline-flex items-center gap-2.5 border border-line-strong bg-base/40 px-5 py-3 text-sm font-medium text-ink transition-colors duration-300 hover:border-accent-soft hover:text-accent-soft"
              >
                See the work
                <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">
                  →
                </span>
              </Link>
            </span>
            <span data-enter="rise" style={delay(1570)}>
              <Action href={profile.links.github} external>
                GitHub
              </Action>
            </span>
            {profile.resume.available ? (
              <span data-enter="rise" style={delay(1630)}>
                <Action href={profile.resume.href} external icon="file" ariaLabel="Open resume (PDF)">
                  Resume
                </Action>
              </span>
            ) : null}
          </div>
        </div>

        {/* What he actually explores — the identity rail. */}
        <ul
          data-enter="rise"
          style={delay(1850)}
          className="mt-14 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-line-soft pt-6"
          aria-label="What I explore"
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
        style={delay(1900)}
        className="group absolute bottom-8 left-6 flex items-center gap-4 lg:left-12"
        aria-label="Scroll to About"
      >
        <span className="relative block h-12 w-px overflow-hidden bg-line">
          <span className="absolute inset-x-0 top-0 h-1/2 bg-accent animate-scroll-cue" />
        </span>
        <span className="label transition-colors group-hover:text-ink">
          Scroll — the system follows you
        </span>
      </a>
    </section>
  );
}

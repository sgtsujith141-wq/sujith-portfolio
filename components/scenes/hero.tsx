"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { profile } from "@/content/profile";
import { graphEdges, graphNodes } from "@/content/graph";
import { projects } from "@/content/projects";
import { useLivingSystem } from "@/components/canvas/living-system";
import { Action } from "@/components/ui/action";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/* ══════════════════════════════════════════════════════════════════════
 *  01 · INTRODUCTION — the opening is the hero.
 *
 *  Choreography (from the moment the page is interactive):
 *    0ms     the canvas shows a single pulse — the system initialising
 *    200ms   ignite(): nodes emerge from the centre, depth by depth
 *    700ms   the name resolves, letter by letter
 *    1300ms  the supporting statement
 *    1800ms  actions
 *    1900ms  navigation rail / mobile bar
 *    2300ms  scroll cue
 *
 *  Nothing blocks. Scrolling is available throughout, no storage is read,
 *  and every real page load replays it. prefers-reduced-motion renders
 *  the finished state (decided before first paint in app/layout.tsx).
 * ══════════════════════════════════════════════════════════════════════ */

const letters = profile.displayName.split("");

export function Hero() {
  const { ignite } = useLivingSystem();
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, reduced ? 1 : 0]);

  useEffect(() => {
    const root = document.documentElement;
    if (root.getAttribute("data-intro") !== "pending") {
      ignite();
      return;
    }
    const t1 = window.setTimeout(ignite, 200);
    const t2 = window.setTimeout(() => root.setAttribute("data-intro", "done"), 260);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [ignite]);

  const delay = (ms: number) => ({ "--enter-delay": `${ms}ms` }) as React.CSSProperties;

  return (
    <section
      id="introduction"
      ref={ref}
      aria-labelledby="hero-title"
      className="relative flex min-h-dvh flex-col justify-center px-6 pb-24 pt-28 lg:px-12 lg:pt-24"
    >
      {/* Corner coordinates — real counts from content/graph.ts. */}
      <p
        data-enter
        style={delay(2100)}
        className="label absolute right-6 top-6 hidden text-right lg:right-24 lg:block"
      >
        Living system graph
        <br />
        <span className="text-ghost">
          {graphNodes.length} nodes · {graphEdges.length} edges · {projects.length} projects
        </span>
      </p>

      <motion.div style={{ y, opacity }} className="mx-auto w-full max-w-6xl">
        <p data-enter="rise" style={delay(500)} className="label flex items-center gap-3">
          <span className="text-accent">01</span>
          <span aria-hidden className="h-px w-6 bg-line-strong" />
          <span>Introduction</span>
        </p>

        <h1
          id="hero-title"
          className="display mt-8 text-[clamp(3.4rem,13.5vw,11.5rem)] text-ink"
          aria-label={profile.name}
        >
          {letters.map((ch, i) => (
            <span
              key={i}
              aria-hidden
              data-enter="rise"
              style={delay(700 + i * 55)}
              className="inline-block"
            >
              {ch === " " ? " " : ch}
            </span>
          ))}
        </h1>

        <div className="mt-10 grid gap-8 lg:mt-12 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <p data-enter="rise" style={delay(1300)} className="text-lg text-ink sm:text-xl">
              {profile.role}
            </p>
            <p
              data-enter="rise"
              style={delay(1420)}
              className="mt-3 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
            >
              {profile.statement}
            </p>
          </div>
          <div className="flex flex-wrap items-start gap-3 lg:col-span-5 lg:justify-end">
            <span data-enter="rise" style={delay(1800)}>
              <Action href="#work" variant="primary" icon="down">
                Explore work
              </Action>
            </span>
            <span data-enter="rise" style={delay(1880)}>
              <Action href={profile.links.github} external>
                GitHub
              </Action>
            </span>
            <span data-enter="rise" style={delay(1960)}>
              <Action href={profile.links.linkedin} external>
                LinkedIn
              </Action>
            </span>
            {profile.resume.available ? (
              <span data-enter="rise" style={delay(2040)}>
                <Action href={profile.resume.href} external icon="file" ariaLabel="Open resume (PDF)">
                  Resume
                </Action>
              </span>
            ) : null}
          </div>
        </div>
      </motion.div>

      {/* Scroll cue. */}
      <a
        href="#work"
        data-enter
        style={delay(2300)}
        className="group absolute bottom-8 left-6 flex items-center gap-4 lg:left-12"
        aria-label="Scroll to Selected Work"
      >
        <span className="relative block h-12 w-px overflow-hidden bg-line">
          <span className="absolute inset-x-0 top-0 h-1/2 bg-accent animate-scroll-cue" />
        </span>
        <span className="label transition-colors group-hover:text-ink">Scroll — the system reorganises</span>
      </a>
    </section>
  );
}

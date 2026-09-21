"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { about, interests, skills, skillsNote } from "@/content/personal";
import { useLivingSystem } from "@/components/canvas/living-system";
import { Reveal } from "@/components/animations/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { cn } from "@/lib/utils";
import { DUR, EASE_OUT } from "@/lib/motion";

const ACCENT: Record<string, string> = {
  blue: "#4f7cff",
  cyan: "#3fd2f0",
  violet: "#8b7cf6",
  green: "#40c4be",
  slate: "#a3adbf",
};

/* ══════════════════════════════════════════════════════════════════════
 *  02 · ABOUT
 *
 *  Three short paragraphs, then the things he enjoys, then what he has
 *  actually worked with. The interests are a menu rather than a diagram:
 *  pointing at one brings its note up and lights the matching part of
 *  the field behind the page. Nothing here claims a level of depth.
 * ══════════════════════════════════════════════════════════════════════ */

export function About() {
  const [active, setActive] = useState(0);
  const { setDomain, setStage } = useLivingSystem();
  const stageRef = useRef<HTMLDivElement>(null);
  const current = interests[active]!;

  useEffect(() => {
    setStage(stageRef.current);
    return () => setStage(null);
  }, [setStage]);

  useEffect(() => {
    setDomain(current.id);
    return () => setDomain(null);
  }, [current.id, setDomain]);

  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="relative px-6 py-28 lg:px-12 lg:py-40"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeader index="02" label="About" title={<span id="about-title">A bit about me.</span>} />

        <div className="mt-12 max-w-2xl space-y-6">
          {about.map((p, i) => (
            <Reveal key={i} delay={i * 0.07}>
              <p
                className={
                  i === 0
                    ? "display text-[clamp(1.35rem,2.8vw,1.95rem)] leading-snug text-ink"
                    : "text-[17px] leading-relaxed text-muted"
                }
              >
                {p}
              </p>
            </Reveal>
          ))}
        </div>

        {/* What I enjoy */}
        <div className="mt-24 grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <Reveal>
              <h3 className="label">What I enjoy</h3>
            </Reveal>
            <ul className="mt-6" role="list">
              {interests.map((it, i) => (
                <Reveal as="li" key={it.id} delay={i * 0.04}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    aria-pressed={i === active}
                    className="group flex w-full items-baseline gap-4 border-b border-line-soft py-3.5 text-left"
                  >
                    <span
                      aria-hidden
                      className="h-1.5 w-1.5 shrink-0 rounded-full t-slow"
                      style={{ background: i === active ? ACCENT[it.accent] : "#2a3140" }}
                    />
                    <span
                      className={cn(
                        "display text-[clamp(1.4rem,3.2vw,2.1rem)] leading-none t-slow",
                        i === active ? "text-ink" : "text-faint group-hover:text-muted",
                      )}
                    >
                      {it.label}
                    </span>
                  </button>
                </Reveal>
              ))}
            </ul>
          </div>

          {/* The note for whichever is active, plus the window the field fills. */}
          <div className="lg:col-span-5 lg:pt-12">
            <AnimatePresence mode="wait">
              <motion.p
                key={current.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: DUR.base, ease: EASE_OUT }}
                aria-live="polite"
                className="max-w-sm text-[15px] leading-relaxed text-muted"
              >
                {current.note}
              </motion.p>
            </AnimatePresence>
            <div ref={stageRef} aria-hidden className="mt-10 hidden h-48 lg:block" />
          </div>
        </div>

        {/* What I've worked with — a specification, not three cards. */}
        <div className="mt-24 grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-3">
            <Reveal>
              <h3 className="label lg:sticky lg:top-28">What I&rsquo;ve worked with</h3>
            </Reveal>
          </div>
          <div className="lg:col-span-9">
            <dl className="divide-y divide-line-soft border-y border-line-soft">
              {skills.map((g, i) => (
                <Reveal key={g.id} delay={i * 0.06}>
                  <div className="grid gap-2 py-5 sm:grid-cols-12 sm:gap-6">
                    <dt className="display text-lg text-ink sm:col-span-4">{g.title}</dt>
                    <dd className="sm:col-span-8">
                      <ul className="flex flex-wrap gap-x-5 gap-y-1.5">
                        {g.items.map((item) => (
                          <li key={item} className="text-[15px] leading-relaxed text-muted">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                </Reveal>
              ))}
            </dl>
            <Reveal delay={0.12}>
              <p className="mt-6 max-w-2xl text-xs leading-relaxed text-ghost">{skillsNote}</p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

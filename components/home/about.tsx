"use client";

import { useEffect, useRef, useState } from "react";
import { about, interests, skills, skillsNote } from "@/content/personal";
import { useLivingSystem } from "@/components/canvas/living-system";
import { Reveal } from "@/components/animations/reveal";
import { MaskLine } from "@/components/animations/mask-reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { cn } from "@/lib/utils";

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

        <div className="mt-12 max-w-2xl">
          {about.map((p, i) => (
            <Reveal key={i} delay={i * 0.07}>
              <p className="mb-5 text-[17px] leading-relaxed text-muted last:mb-0">{p}</p>
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
          <div className="lg:col-span-5">
            <div ref={stageRef} aria-hidden className="hidden h-40 lg:block" />
            <p
              aria-live="polite"
              className="max-w-sm text-[15px] leading-relaxed text-muted t-base lg:mt-6"
            >
              {current.note}
            </p>
          </div>
        </div>

        {/* What I've worked with */}
        <div className="mt-24">
          <Reveal>
            <h3 className="label">What I&rsquo;ve worked with</h3>
          </Reveal>
          <ul className="mt-6 grid gap-px bg-line-soft md:grid-cols-3">
            {skills.map((g, i) => (
              <Reveal as="li" key={g.id} delay={i * 0.06} className="bg-base p-6 lg:p-7">
                <h4 className="display text-lg text-ink">
                  <MaskLine>{g.title}</MaskLine>
                </h4>
                <ul className="mt-4 space-y-2">
                  {g.items.map((item) => (
                    <li key={item} className="text-sm leading-relaxed text-muted">
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </ul>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-2xl text-xs leading-relaxed text-ghost">{skillsNote}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/types";
import { Reveal } from "@/components/animations/reveal";
import { MaskLine } from "@/components/animations/mask-reveal";
import { Magnetic } from "@/components/animations/magnetic";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

/* ══════════════════════════════════════════════════════════════════════
 *  FEATURED WORK
 *
 *  Two projects, each given a full composition rather than a row in a
 *  list. Everything a visitor needs — what it is, what it looks like,
 *  where to go — is on screen without hovering anything.
 *
 *  The two use different layouts on purpose: CryptoDrishti is a desktop
 *  console, so its screenshot runs wide beneath the text; SurakshaScore
 *  is a phone app, so its screens stand beside the text. They should not
 *  look like the same template twice.
 * ══════════════════════════════════════════════════════════════════════ */

export function FeaturedWide({ project, index }: { project: Project; index: string }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // The image drifts against the scroll inside its frame, so the frame
  // stays put and the picture moves within it.
  const imgY = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["-6%", "6%"]);
  const shot = project.screenshots[0];

  return (
    <article ref={ref} className="relative">
      <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
        <div className="min-w-0 lg:col-span-7">
          <Reveal>
            <p className="label flex items-center gap-3">
              <span className="text-accent">{index}</span>
              <span aria-hidden className="h-px w-6 bg-line-strong" />
              <span>{project.category}</span>
            </p>
          </Reveal>
          <h3 className="display mt-6 text-[clamp(2.4rem,6.2vw,5rem)] leading-[0.95] text-ink">
            <MaskLine>{project.name}</MaskLine>
          </h3>
        </div>
        <div className="lg:col-span-5">
          <Reveal delay={0.1}>
            <p className="max-w-md text-[17px] leading-snug text-ink/85 lg:text-lg">
              {project.tagline}
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-6">
              <Magnetic>
                <Link
                  href={`/work/${project.slug}`}
                  className="group inline-flex items-center gap-3 border border-line-strong px-5 py-3 text-sm text-ink t-base hover:border-accent-soft hover:text-accent-soft"
                >
                  Explore {project.name}
                  <ArrowUpRight
                    className="h-4 w-4 t-base group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </Link>
              </Magnetic>
            </div>
          </Reveal>
        </div>
      </div>

      {shot ? (
        <Reveal delay={0.12} amount={0.1}>
          <Link
            href={`/work/${project.slug}`}
            aria-label={`Explore ${project.name}`}
            className="group mt-10 block overflow-hidden border border-line bg-void"
          >
            <div className="relative aspect-[16/8] overflow-hidden sm:aspect-[16/7]">
              <motion.div style={{ y: imgY }} className="absolute inset-x-0 -top-[6%] h-[112%]">
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  fill
                  sizes="(min-width: 1024px) 72rem, 100vw"
                  className="object-cover object-top t-slow group-hover:scale-[1.015]"
                  priority
                />
              </motion.div>
              {/* A soft wash at the foot of the image so the frame's edge
                  does not cut the screenshot off flat. */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-base/80 to-transparent"
              />
            </div>
          </Link>
        </Reveal>
      ) : null}
    </article>
  );
}

export function FeaturedPhones({ project, index }: { project: Project; index: string }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const lift = [
    useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [40, -40]),
    useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [10, -10]),
    useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [60, -60]),
  ];
  const shots = project.screenshots.slice(0, 3);

  return (
    <article ref={ref} className="relative">
      <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-14">
        {/* Phones lead on wide screens — the audit asked for the two
            featured projects not to look like the same template. */}
        <div className="order-2 lg:order-1 lg:col-span-7">
          <ul className="flex items-center justify-center gap-4 sm:gap-6">
            {shots.map((s, i) => (
              <motion.li
                key={s.src}
                style={{ y: lift[i] }}
                className={cn("w-1/3 max-w-[200px]", i === 1 && "z-[1]")}
              >
                <Link
                  href={`/work/${project.slug}`}
                  aria-label={`Explore ${project.name}`}
                  className="group block overflow-hidden rounded-[20px] border border-line-strong bg-void p-1.5 t-slow hover:border-accent/40"
                >
                  <Image
                    src={s.src}
                    alt={s.alt}
                    width={s.width}
                    height={s.height}
                    sizes="(min-width: 1024px) 18vw, 30vw"
                    className="h-auto w-full rounded-[15px]"
                  />
                </Link>
              </motion.li>
            ))}
          </ul>
        </div>

        <div className="order-1 min-w-0 lg:order-2 lg:col-span-5">
          <Reveal>
            <p className="label flex items-center gap-3">
              <span className="text-accent">{index}</span>
              <span aria-hidden className="h-px w-6 bg-line-strong" />
              <span>{project.category}</span>
            </p>
          </Reveal>
          <h3 className="display mt-6 text-[clamp(2rem,4.2vw,3.3rem)] leading-[0.98] text-ink">
            <MaskLine>{project.name}</MaskLine>
          </h3>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-md text-[17px] leading-snug text-ink/85 lg:text-lg">
              {project.tagline}
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-7">
              <Magnetic>
                <Link
                  href={`/work/${project.slug}`}
                  className="group inline-flex items-center gap-3 border border-line-strong px-5 py-3 text-sm text-ink t-base hover:border-accent-soft hover:text-accent-soft"
                >
                  Explore {project.name}
                  <ArrowUpRight
                    className="h-4 w-4 t-base group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </Link>
              </Magnetic>
            </div>
          </Reveal>
        </div>
      </div>
    </article>
  );
}

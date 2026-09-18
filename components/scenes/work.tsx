"use client";

import { useCallback, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { projects, cryptodrishti, surakshascore, surakshascoreMvp, aetherHealth } from "@/content/projects";
import type { ProjectSlug } from "@/lib/types";
import { useLivingSystem } from "@/components/canvas/living-system";
import { SectionHeader } from "@/components/ui/section-header";
import { CaseStudy } from "@/components/projects/case-study";
import { ProjectTabs } from "@/components/projects/project-tabs";
import { Gallery } from "@/components/projects/gallery";
import { CryptoVisual } from "@/components/projects/crypto-visual";
import { SignalsModel } from "@/components/projects/signals-model";
import { EvolutionTimeline } from "@/components/projects/evolution-timeline";
import { AetherShowcase } from "@/components/projects/aether-showcase";

/* ══════════════════════════════════════════════════════════════════════
 *  02 · SELECTED WORK
 *
 *  Opens with the one pinned scene on the site: the header holds for a
 *  short scroll while the four project worlds surface one by one and the
 *  background graph reorganises from a single mass into four clusters.
 *  Then the case studies scroll normally. Scrolling is never hijacked:
 *  the pin releases as soon as its short distance is covered.
 * ══════════════════════════════════════════════════════════════════════ */

export function Work() {
  const scope = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<ProjectSlug | null>(null);
  const { setFocus } = useLivingSystem();
  const onEnter = useCallback((slug: ProjectSlug | null) => setActive(slug), []);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const worlds = gsap.utils.toArray<HTMLElement>("[data-world]");
      if (reduced) {
        gsap.set(worlds, { opacity: 1, y: 0 });
        return;
      }
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: "[data-work-intro]",
            start: "top top+=24",
            end: "+=110%",
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            onLeave: () => setFocus(null),
          },
        });
        tl.fromTo(
          worlds,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, stagger: 0.18, duration: 0.6, ease: "power3.out" },
        ).to({}, { duration: 0.35 });
      });
      mm.add("(max-width: 1023px)", () => {
        worlds.forEach((el, i) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              delay: i * 0.05,
              scrollTrigger: { trigger: el, start: "top 88%", once: true },
            },
          );
        });
      });
      // The pinned block changes the layout; recalculate everything below it.
      ScrollTrigger.refresh();
    },
    { scope },
  );

  return (
    <section id="work" aria-labelledby="work-title" className="relative px-6 lg:px-12" ref={scope}>
      <div className="mx-auto max-w-6xl">
        {/* Pinned introduction */}
        <div data-work-intro className="flex min-h-[calc(100dvh-24px)] flex-col justify-center py-24 lg:py-0">
          <SectionHeader
            index="02"
            label="Selected work"
            title={<span id="work-title">Four systems, presented as they are.</span>}
            lede="Each case study is written from the repository: what it solves, how it works, what was verified and by what method, and what it does not yet do."
          />
          <ol className="mt-14 grid gap-px bg-line-soft sm:grid-cols-2 lg:grid-cols-4">
            {projects.map((p) => (
              <li key={p.slug} data-world className="bg-base p-5 will-change-transform">
                <a href={`#project-${p.slug}`} className="group block">
                  <p className="label flex items-center justify-between">
                    <span>{p.index}</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-line-strong transition-colors group-hover:bg-accent" aria-hidden />
                  </p>
                  <p className="display mt-6 text-2xl text-ink">{p.name}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{p.category}</p>
                  <p className="mono mt-5 text-[10px] tracking-[0.14em] text-ghost transition-colors group-hover:text-faint">
                    OPEN CASE STUDY →
                  </p>
                </a>
              </li>
            ))}
          </ol>
        </div>

        <ProjectTabs active={active} />

        <CaseStudy
          project={cryptodrishti}
          onEnter={onEnter}
          visual={
            <div className="space-y-4">
              <CryptoVisual />
              <Gallery shots={cryptodrishti.screenshots} frame="desktop" projectName={cryptodrishti.name} />
            </div>
          }
        />

        <CaseStudy
          project={surakshascore}
          onEnter={onEnter}
          visual={
            <div className="space-y-4">
              <SignalsModel />
              <Gallery
                shots={surakshascore.screenshots}
                frame="phone"
                label="Real UI over demo data"
                projectName={surakshascore.name}
              />
            </div>
          }
        />

        <CaseStudy project={surakshascoreMvp} onEnter={onEnter} wide={<EvolutionTimeline />} />

        <CaseStudy
          project={aetherHealth}
          onEnter={onEnter}
          visual={<AetherShowcase shots={aetherHealth.screenshots} />}
        />
      </div>
    </section>
  );
}

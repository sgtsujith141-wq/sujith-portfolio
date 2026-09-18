"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
import { AetherShowcase, AetherFacts } from "@/components/projects/aether-showcase";

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
  const { setFocus, setStage, setPhase } = useLivingSystem();
  // GSAP's context must not be rebuilt when the engine becomes ready, so
  // the phase callback is read through a ref inside the timeline.
  const phaseRef = useRef(setPhase);
  useEffect(() => {
    phaseRef.current = setPhase;
  }, [setPhase]);
  const registry = useRef(new Map<ProjectSlug, { article: HTMLElement; stage: HTMLElement | null }>());
  const activeRef = useRef<ProjectSlug | null>(null);

  const register = useCallback((slug: ProjectSlug, article: HTMLElement | null, stage: HTMLElement | null) => {
    if (article) registry.current.set(slug, { article, stage });
    else registry.current.delete(slug);
  }, []);

  /* Which case study is being read is derived from scroll position, not
   * from observer events, so it is always correct after jumps, anchor
   * navigation and the pinned intro. The article containing the viewport
   * midline wins; none means the intro or the space between sections. */
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const mid = window.innerHeight * 0.5;
      let found: ProjectSlug | null = null;
      for (const [slug, { article }] of registry.current) {
        const r = article.getBoundingClientRect();
        if (r.top <= mid && r.bottom >= mid) {
          found = slug;
          break;
        }
      }
      if (found !== activeRef.current) {
        activeRef.current = found;
        setActive(found);
        setFocus(found);
        setStage(found ? (registry.current.get(found)?.stage ?? null) : null);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      setFocus(null);
      setStage(null);
    };
  }, [setFocus, setStage]);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const worlds = gsap.utils.toArray<HTMLElement>("[data-world]");
      if (reduced) {
        gsap.set(worlds, { opacity: 1, y: 0 });
        phaseRef.current(1);
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
            // The background reorganises in step with the pin.
            onUpdate: (self) => phaseRef.current(self.progress),
          },
        });
        tl.fromTo(
          worlds,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, stagger: 0.18, duration: 0.6, ease: "power3.out" },
        ).to({}, { duration: 0.35 });
      });
      mm.add("(max-width: 1023px)", () => {
        phaseRef.current(1);
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
      // The pinned block changes the layout; recalculate everything below
      // it now and again once web fonts have settled the text metrics.
      ScrollTrigger.refresh();
      document.fonts?.ready.then(() => ScrollTrigger.refresh());
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
          register={register}
          explainer={<CryptoVisual />}
          visual={<Gallery shots={cryptodrishti.screenshots} frame="desktop" projectName={cryptodrishti.name} />}
        />

        <CaseStudy
          project={surakshascore}
          register={register}
          explainer={<SignalsModel />}
          visual={
            <Gallery
              shots={surakshascore.screenshots}
              frame="phone"
              label="Real UI over demo data"
              projectName={surakshascore.name}
            />
          }
        />

        <CaseStudy project={surakshascoreMvp} register={register} wide={<EvolutionTimeline />} />

        <CaseStudy
          project={aetherHealth}
          register={register}
          visual={<AetherFacts />}
          wide={<AetherShowcase shots={aetherHealth.screenshots} />}
        />
      </div>
    </section>
  );
}

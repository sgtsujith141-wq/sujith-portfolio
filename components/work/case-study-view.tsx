"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Project } from "@/lib/types";
import { projects } from "@/content/projects";
import { CaseStudy } from "@/components/projects/case-study";
import { Gallery } from "@/components/projects/gallery";
import { CryptoVisual } from "@/components/projects/crypto-visual";
import { SignalsModel } from "@/components/projects/signals-model";
import { EvolutionTimeline } from "@/components/projects/evolution-timeline";
import { AetherShowcase, AetherFacts } from "@/components/projects/aether-showcase";
import { LabTopology } from "@/components/homelab/topology";
import { useLivingSystem } from "@/components/canvas/living-system";

/* One case study on its own route. Chooses that project's visual, holds
 * the background on its constellation, and offers the next project. */
export function CaseStudyView({ project }: { project: Project }) {
  const { setFocus, setStage } = useLivingSystem();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFocus(project.slug);
    const stage = rootRef.current?.querySelector<HTMLElement>("[data-stage]") ?? null;
    setStage(stage);
    return () => {
      setFocus(null);
      setStage(null);
    };
  }, [project.slug, setFocus, setStage]);

  const i = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(i + 1) % projects.length]!;
  const prev = projects[(i - 1 + projects.length) % projects.length]!;

  let visual: React.ReactNode = null;
  let explainer: React.ReactNode = null;
  let wide: React.ReactNode = null;

  switch (project.visual) {
    case "crypto":
      explainer = <CryptoVisual />;
      visual = <Gallery shots={project.screenshots} frame="desktop" projectName={project.name} />;
      break;
    case "signals":
      explainer = <SignalsModel />;
      visual = (
        <Gallery
          shots={project.screenshots}
          frame="phone"
          label="Real UI over demo data"
          projectName={project.name}
        />
      );
      break;
    case "evolution":
      wide = <EvolutionTimeline />;
      break;
    case "aether":
      visual = <AetherFacts />;
      wide = <AetherShowcase shots={project.screenshots} />;
      break;
    case "topology":
      wide = <LabTopology />;
      break;
  }

  return (
    <div ref={rootRef} className="mx-auto max-w-6xl px-6 lg:px-12">
      <CaseStudy
        project={project}
        headingLevel="h1"
        visual={visual}
        explainer={explainer}
        wide={wide}
      />

      <nav aria-label="More work" className="grid gap-px border-t border-line-soft bg-line-soft sm:grid-cols-2">
        <Link
          href={`/work/${prev.slug}`}
          className="group flex items-center gap-4 bg-base p-7 t-base hover:bg-surface"
        >
          <ArrowLeft
            className="h-4 w-4 shrink-0 text-faint t-base group-hover:-translate-x-1"
            aria-hidden
          />
          <span>
            <span className="label">Previous</span>
            <span className="display mt-2 block text-xl text-ink">{prev.name}</span>
          </span>
        </Link>
        <Link
          href={`/work/${next.slug}`}
          className="group flex items-center justify-end gap-4 bg-base p-7 text-right t-base hover:bg-surface"
        >
          <span>
            <span className="label">Next</span>
            <span className="display mt-2 block text-xl text-ink">{next.name}</span>
          </span>
          <ArrowRight
            className="h-4 w-4 shrink-0 text-faint t-base group-hover:translate-x-1"
            aria-hidden
          />
        </Link>
      </nav>
    </div>
  );
}

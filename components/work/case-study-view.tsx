"use client";

import { useEffect, useRef } from "react";
import type { Project } from "@/lib/types";
import { CaseStudy } from "./case-study";
import { ArchitectureExplorer } from "@/components/projects/architecture-explorer";
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

  let visual: React.ReactNode = null;
  let explainer: React.ReactNode = null;

  switch (project.visual) {
    case "crypto":
      visual = <Gallery shots={project.screenshots} frame="desktop" projectName={project.name} />;
      explainer = <CryptoVisual />;
      break;
    case "signals":
      visual = (
        <Gallery
          shots={project.screenshots}
          frame="phone"
          label="Real UI over demo data"
          projectName={project.name}
        />
      );
      explainer = <SignalsModel />;
      break;
    case "evolution":
      visual = <EvolutionTimeline />;
      break;
    case "aether":
      visual = <AetherShowcase shots={project.screenshots} />;
      explainer = <AetherFacts />;
      break;
    case "topology":
      visual = <LabTopology />;
      break;
  }

  return (
    <div ref={rootRef}>
      <CaseStudy
        project={project}
        visual={visual}
        explainer={explainer}
        architecture={project.architecture ? <ArchitectureExplorer only={project.slug} /> : null}
      />
    </div>
  );
}

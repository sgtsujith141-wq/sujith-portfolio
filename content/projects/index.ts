import type { Project, ProjectSlug } from "@/lib/types";
import { homeLab } from "./home-lab";
import { cryptodrishti } from "./cryptodrishti";
import { surakshascore } from "./surakshascore";
import { surakshascoreMvp } from "./surakshascore-mvp";
import { aetherHealth } from "./aether-health";

/** Presentation order. The home lab leads because it is the work Sujith
 *  actually lives in; the MVP sits after SurakshaScore because it is told
 *  as that project's origin story. */
export const projects: Project[] = [
  homeLab,
  cryptodrishti,
  surakshascore,
  surakshascoreMvp,
  aetherHealth,
];

/** The three shown on the home page's teaser, in this order. */
export const featuredSlugs = ["home-lab", "cryptodrishti", "surakshascore"] as const;

export const projectBySlug = Object.fromEntries(projects.map((p) => [p.slug, p])) as Record<
  ProjectSlug,
  Project
>;

export const statusMeta: Record<
  Project["status"],
  { label: string; tone: "accent" | "warn" | "muted" | "ok" }
> = {
  active: { label: "Active", tone: "accent" },
  running: { label: "Running at home", tone: "ok" },
  prototype: { label: "Prototype", tone: "warn" },
  archived: { label: "Archived prototype", tone: "muted" },
};

export { homeLab, cryptodrishti, surakshascore, surakshascoreMvp, aetherHealth };

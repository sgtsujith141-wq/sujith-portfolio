import type { Project, ProjectSlug } from "@/lib/types";
import { cryptodrishti } from "./cryptodrishti";
import { surakshascore } from "./surakshascore";
import { surakshascoreMvp } from "./surakshascore-mvp";
import { aetherHealth } from "./aether-health";

/** Presentation order. The MVP sits after SurakshaScore because it is
 *  told as that project's origin story. */
export const projects: Project[] = [cryptodrishti, surakshascore, surakshascoreMvp, aetherHealth];

export const projectBySlug = Object.fromEntries(projects.map((p) => [p.slug, p])) as Record<
  ProjectSlug,
  Project
>;

export const statusMeta: Record<Project["status"], { label: string; tone: "accent" | "warn" | "muted" }> = {
  active: { label: "Active", tone: "accent" },
  prototype: { label: "Prototype", tone: "warn" },
  archived: { label: "Archived prototype", tone: "muted" },
};

export { cryptodrishti, surakshascore, surakshascoreMvp, aetherHealth };

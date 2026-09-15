import type { Project } from "@/lib/types";

/* ══════════════════════════════════════════════════════════════════════
 *  PROJECTS
 *
 *  These four records are the real public repositories on
 *  github.com/sgtsujith141-wq. Names, one-line descriptions, languages and
 *  topics were taken from the repositories themselves — nothing here is
 *  invented.
 *
 *  The narrative fields (problem / implementation / architecture /
 *  learnings) are intentionally EMPTY. The case file renders only the
 *  blocks that have content, so an unwritten section is simply absent
 *  rather than filled with placeholder prose. Add them whenever you are
 *  ready; no component needs to change.
 *
 *  `links.live` is omitted everywhere because none of the repositories
 *  currently publishes a homepage. Add one and a LIVE button appears.
 * ══════════════════════════════════════════════════════════════════════ */

const GH = "https://github.com/sgtsujith141-wq";

export const projects: Project[] = [
  {
    slug: "surakshascore",
    caseId: "001",
    name: "SurakshaScore",
    category: "Security & Privacy",
    summary:
      "Turns device, account and privacy signals into an explainable security score.",
    stack: ["TypeScript", "React", "Vite", "Capacitor"],
    status: "active",
    links: { github: `${GH}/surakshascore` },
    images: [],
    overview:
      "A personal digital safety and cyber-hygiene app that turns device, account and privacy signals into an explainable security score.",
    problem: "",
    implementation: "",
    architecture: [],
    technologies: [
      "TypeScript",
      "React",
      "Vite",
      "Capacitor",
      "HTML",
      "CSS",
      "JavaScript",
      "Java",
    ],
    learnings: [],
    complete: true,
  },
  {
    slug: "cryptodrishti",
    caseId: "002",
    name: "CryptoDrishti",
    category: "Security Tooling",
    summary:
      "Scans codebases for cryptographic usage and emits a CycloneDX 1.6 CBOM.",
    stack: ["Python", "FastAPI", "JavaScript"],
    status: "active",
    links: { github: `${GH}/cryptodrishti` },
    images: [],
    overview:
      "A cryptographic discovery and quantum-risk analysis tool that scans codebases and emits a CycloneDX 1.6 CBOM.",
    problem: "",
    implementation: "",
    architecture: [],
    technologies: [
      "Python",
      "FastAPI",
      "JavaScript",
      "HTML",
      "CSS",
      "Shell",
      "SBOM / CycloneDX",
      "Post-quantum cryptography",
    ],
    learnings: [],
    complete: true,
  },
  {
    slug: "aether-health",
    caseId: "003",
    name: "Aether Health",
    category: "Health & AI",
    summary:
      "Health logging, medication tracking and medical report analysis, AI-assisted.",
    stack: ["TypeScript", "React", "Express", "Vite"],
    status: "prototype",
    links: { github: `${GH}/aether-health` },
    images: [],
    overview:
      "An AI-assisted personal health companion prototype for health logging, medication tracking and medical report analysis.",
    problem: "",
    implementation: "",
    architecture: [],
    technologies: ["TypeScript", "React", "Express", "Vite", "JavaScript", "CSS", "HTML"],
    learnings: [],
    complete: true,
  },
  {
    slug: "surakshascore-mvp",
    caseId: "004",
    name: "SurakshaScore MVP",
    category: "Security & Privacy",
    summary: "The earlier MVP build of the SurakshaScore cyber-hygiene toolkit.",
    stack: ["TypeScript", "React", "Electron", "Capacitor"],
    status: "prototype",
    links: { github: `${GH}/surakshascore-mvp` },
    images: [],
    overview:
      "An early MVP of SurakshaScore — a personal digital safety and cyber hygiene toolkit. Superseded by the current build, kept as the record of where it started.",
    problem: "",
    implementation: "",
    architecture: [],
    technologies: [
      "TypeScript",
      "React",
      "Electron",
      "Capacitor",
      "Kotlin",
      "PL/pgSQL",
      "JavaScript",
      "Java",
    ],
    learnings: [],
    complete: true,
  },
];

/** ★ The starred entry. Opens a case file carrying the live topology.
 *  Its content lives in data/systems-lab.ts. */
export const starredProject: Project = {
  slug: "systems-lab",
  caseId: "000",
  name: "Systems Lab",
  category: "Home Infrastructure / Self-Hosting",
  summary:
    "A Debian 12 home server running media, file storage and a game server, reachable anywhere over Tailscale.",
  stack: ["Debian 12", "CasaOS", "Tailscale", "Jellyfin"],
  status: "active",
  year: "Ongoing",
  links: {},
  images: [],
  overview: "",
  problem: "",
  implementation: "",
  architecture: [],
  technologies: [],
  learnings: [],
  starred: true,
  dossier: "systems-lab",
  complete: true,
};

export const allProjects: Project[] = [starredProject, ...projects];

export const projectBySlug = (slug: string) =>
  allProjects.find((p) => p.slug === slug);

export const statusMeta: Record<
  Project["status"],
  { label: string; tone: "accent" | "signal" | "muted" | "warn" }
> = {
  shipped: { label: "Shipped", tone: "signal" },
  active: { label: "Active", tone: "accent" },
  prototype: { label: "Prototype", tone: "warn" },
  archived: { label: "Archived", tone: "muted" },
  planned: { label: "Planned", tone: "muted" },
};

/* ══════════════════════════════════════════════════════════════════════
 *  PERSONAL — the single editable file for everything about Sujith.
 *
 *  THE RULE FOR THIS FILE: nothing goes in here that Sujith has not said
 *  about himself, or that is not visible in a repository he owns. A
 *  library that appears in one of his projects is not a personal skill.
 *  A subject one of his projects deals with is not a personal interest.
 *  If a fact is missing, leave it out — do not fill the gap.
 *
 *  An earlier version of this site invented a whole technical learning
 *  roadmap for him. That is the failure mode this file exists to prevent.
 * ══════════════════════════════════════════════════════════════════════ */

import type { ProjectSlug } from "@/lib/types";

/* Hosts and CI frequently define variables as *blank* rather than unset,
 * and `??` only falls back on undefined. Treat blank as absent. */
const env = (value: string | undefined): string | undefined => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

const RESUME_FILENAME = "Sujith_C_Resume.pdf";
const resumeEnv = env(process.env.NEXT_PUBLIC_RESUME_URL);

/* ── Who ───────────────────────────────────────────────────────────── */

export const profile = {
  name: "Sujith C",
  /** Rendered letter by letter in the opening sequence. */
  displayName: "SUJITH C",
  /** Shown under the name in the opening sequence. */
  disciplines: ["NETWORKING", "CYBERSECURITY", "SYSTEMS"],
  role: "Computer Science & Engineering Student",
  location: "Bengaluru, India",

  education: {
    institution: "BMS Institute of Technology and Management",
    short: "BMSIT",
    location: "Bengaluru",
    programme: "Computer Science & Engineering",
  },

  links: {
    github: "https://github.com/sgtsujith141-wq",
    githubHandle: "sgtsujith141-wq",
    linkedin: "https://www.linkedin.com/in/sujith-c-3637ba388/",
    linkedinHandle: "sujith-c-3637ba388",
  },

  contact: {
    email: env(process.env.NEXT_PUBLIC_CONTACT_EMAIL) ?? "sgt.sujith.141@gmail.com",
    /** Not shown unless supplied through the environment. */
    phone: env(process.env.NEXT_PUBLIC_CONTACT_PHONE),
  },

  resume: {
    href: resumeEnv && resumeEnv !== "off" ? resumeEnv : `/${RESUME_FILENAME}`,
    filename: RESUME_FILENAME,
    /** "off" hides every Resume affordance without touching components. */
    available: resumeEnv !== "off",
  },

  meta: {
    title: "Sujith C — Computer Science Student",
    description:
      "Computer Science & Engineering student at BMSIT, Bengaluru. Networking, cybersecurity, operating systems and a home server — plus the applications I build.",
    url: env(process.env.NEXT_PUBLIC_SITE_URL) ?? "https://sujith-portfolio-two.vercel.app",
  },
} as const;

/** One line under the name. */
export const tagline = "Exploring networks, securing systems, and building things that matter.";

/* ── About ─────────────────────────────────────────────────────────── */

export const about = [
  "I'm a Computer Science & Engineering student at BMS Institute of Technology in Bengaluru.",
  "Most of what I know came from curiosity rather than coursework — installing operating systems to see what changed, setting up a server at home, and building things until they actually ran.",
  "I build my applications with AI coding tools. I work out the idea, decide what it should do, try implementations and keep going until it holds together — and I use AI heavily to get there.",
] as const;

/* ── What I enjoy ──────────────────────────────────────────────────── */

export interface Interest {
  id: string;
  label: string;
  /** One honest sentence. No claims of depth. */
  note: string;
  accent: "blue" | "cyan" | "violet" | "green" | "slate";
}

export const interests: Interest[] = [
  {
    id: "networking",
    label: "Networking",
    note: "How machines actually reach each other. It's the thing I keep coming back to.",
    accent: "cyan",
  },
  {
    id: "cybersecurity",
    label: "Cybersecurity",
    note: "The direction I'm most interested in, and what most of my projects circle around.",
    accent: "blue",
  },
  {
    id: "systems",
    label: "Computer systems",
    note: "What's happening underneath — how a machine boots, and what changes when you change it.",
    accent: "violet",
  },
  {
    id: "operating-systems",
    label: "Operating systems",
    note: "Installing them, breaking them, trying the next one. See below.",
    accent: "green",
  },
  {
    id: "servers",
    label: "Servers & self-hosting",
    note: "Running my own services at home instead of renting them.",
    accent: "cyan",
  },
  {
    id: "tinkering",
    label: "Experimenting",
    note: "Taking hardware and software apart to find out how far they bend.",
    accent: "slate",
  },
  {
    id: "ai",
    label: "AI & building apps",
    note: "Using AI to build real applications, and figuring out where it fits in a product.",
    accent: "violet",
  },
];

/* ── Skills ────────────────────────────────────────────────────────────
 *  As Sujith describes them, at the level he describes them. These are
 *  deliberately modest. Do not promote anything here because a framework
 *  appears in one of his repositories.
 * ------------------------------------------------------------------- */

export interface SkillGroup {
  id: string;
  title: string;
  items: string[];
}

export const skills: SkillGroup[] = [
  {
    id: "programming",
    title: "Programming",
    items: ["C — basics", "C++ — basics", "Python — basics", "SQL — basics", "HTML"],
  },
  {
    id: "design",
    title: "Design & documents",
    items: ["UI/UX — basics", "Figma — basics", "Photoshop", "CorelDRAW", "Microsoft Office"],
  },
  {
    id: "computers",
    title: "Computers & systems",
    items: [
      "Installing and customising operating systems",
      "General familiarity with servers",
      "Setting up and running a home lab",
    ],
  },
];

/** Printed once, under the skills, so a reader knows where to find the rest. */
export const skillsNote =
  "The frameworks and libraries in my projects are listed with each project, not here. I build those applications with AI coding tools.";

/* ── Operating systems ─────────────────────────────────────────────── */

export const osStory = {
  lead: "I've always enjoyed pulling computers apart.",
  body: "Different operating systems, stripped-down Windows builds, one layered on top of another — mostly to see what changed, and partly to squeeze more frames out of Minecraft.",
  /** Just what he has actually run. No versions, no benchmarks. */
  systems: [
    { name: "Windows", kind: "os" },
    { name: "Linux", kind: "os" },
    { name: "macOS", kind: "os" },
    { name: "ReviOS", kind: "mod" },
    { name: "Nexus Lite", kind: "mod" },
    { name: "Ghost Spectre", kind: "mod" },
    { name: "ReviOS over Ghost Spectre", kind: "stack" },
  ],
} as const;

/* ── The home lab, in personal terms ───────────────────────────────────
 *  The services, what was configured and what it taught him all live in
 *  content/homelab.ts and are shown in the case study. This is only how
 *  he talks about it.
 * ------------------------------------------------------------------- */

export const homelab = {
  lead: "A Debian box in my house that runs the things we actually use.",
  body: "Media, files and a Minecraft server for my friends and family, reachable from anywhere over a private network. Setting it up is how I learned most of what I know about Linux and networking — usually by breaking it first.",
} as const;

/* ── Highlights ────────────────────────────────────────────────────────
 *  Only what happened. No placements, rankings or advancement that has
 *  not been confirmed.
 * ------------------------------------------------------------------- */

export interface Highlight {
  id: string;
  title: string;
  where: string;
  detail: string;
}

export const highlights: Highlight[] = [
  {
    id: "sih",
    title: "Smart India Hackathon",
    where: "BMSIT internal selection",
    detail: "My team was shortlisted during BMSIT's internal selection process.",
  },
  {
    id: "avinya",
    title: "Avinya 2.0",
    where: "National level hackathon",
    detail: "Took part — building to a fixed deadline rather than at coursework pace.",
  },
];

/* ── Currently building ────────────────────────────────────────────────
 *  Phantom HQ. The repository is PRIVATE, so there is no public link and
 *  none may be invented. Status comes from the project's own
 *  PHASE_MANIFEST.json, which it treats as authoritative.
 * ------------------------------------------------------------------- */

export const building = {
  name: "Phantom HQ",
  kicker: "Currently building",
  summary:
    "A local-first AI workspace: a persistent assistant, agents that do the work, and a dashboard to watch it from.",
  body: "It's the biggest thing I'm working on and it isn't finished. The plan is that I give it something to do, it works out how, and I approve anything that matters before it happens.",
  /** Checked against PHASE_MANIFEST.json on 2026-09-21. */
  status: {
    label: "In progress",
    detail: "21 of 24 build phases marked complete in the project's own manifest. What's left is end-to-end testing, a clean-machine rebuild, and v1.0.",
    checked: "2026-09-21",
  },
  /** Private repository — deliberately no link. */
  repo: null as string | null,
  note: "The repository is private, so there's nothing to link to yet.",
} as const;

/* ── Selected work on the home page ────────────────────────────────── */

/** The three previewed on the home page. Everything lives at /work. */
export const featured: ProjectSlug[] = ["home-lab", "cryptodrishti", "surakshascore"];

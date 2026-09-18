import type { AboutBlock } from "@/lib/types";

/* ══════════════════════════════════════════════════════════════════════
 *  ABOUT — short, first-person, grounded.
 *
 *  Every sentence here maps to something verifiable: a repository, the
 *  resume, or a fact Sujith supplied directly. No personality claims.
 * ══════════════════════════════════════════════════════════════════════ */

export const aboutBlocks: AboutBlock[] = [
  {
    id: "build",
    title: "What I build",
    body: [
      "Small, practical tools that I take far enough to actually run, and then document honestly — what works, what doesn't yet, and what I would change.",
      "Most of it sits between security and everyday usability: a scanner that shows you where the cryptography in a codebase is, a hygiene score that explains every number behind it, a health companion prototype.",
    ],
  },
  {
    id: "interests",
    title: "What interests me",
    body: [
      "Cybersecurity is the direction I am heading. Post-quantum migration, explainable security scoring and the boring fundamentals underneath — permissions, packets, trust boundaries.",
      "AI interests me as a component inside a bounded product, not as the product. In SurakshaScore the explanations deliberately come from typed templates rather than a model, because a model can invent a security claim and a template cannot.",
    ],
  },
  {
    id: "approach",
    title: "How I approach engineering",
    body: [
      "State exactly what was verified and by what method. When a platform cannot answer a question, render it as unavailable rather than defaulting to a pass.",
      "Prefer a rule that a test enforces over a rule that a document describes. The core engine in SurakshaScore has a test that fails the build if it imports React, Capacitor or a browser global.",
      "Keep known limitations in the README, at the top, in plain words. A tool that overstates its coverage is worse than one that verifies less.",
    ],
  },
  {
    id: "learning",
    title: "What I'm learning",
    body: [
      "Linux and networking by running a Debian 12 machine at home — CasaOS on top, Jellyfin, network file storage and a Minecraft server for friends, reachable over Tailscale instead of open ports.",
      "How systems fail. Reading logs, mounting storage that survives a reboot, and what a Java heap setting does to a machine that other people depend on.",
    ],
  },
  {
    id: "why",
    title: "Why these projects exist",
    body: [
      "CryptoDrishti was built for Smart India Hackathon 2026, problem statement SIH26164 from the National Technical Research Organisation. SurakshaScore started as a hackathon-era prototype and was rebuilt from scratch when the prototype's scoring could not be shown as a derivation.",
      "Aether Health was assembled under hackathon time pressure from two earlier codebases. Its README says so, and so does this site.",
    ],
  },
];

export const facts = {
  programming: ["Python", "C", "C++", "TypeScript", "HTML"],
  systems: ["Debian 12", "CasaOS", "Tailscale", "Jellyfin", "Linux networking"],
  tooling: ["Git & GitHub Actions", "pytest", "Vitest", "Vite", "Capacitor"],
  design: ["Photoshop", "CorelDRAW"],
};

/** Only what actually happened. No placements, dates or team sizes beyond these. */
export const hackathons = [
  {
    id: "sih-internal",
    name: "Smart India Hackathon",
    scope: "Internal college round, BMSIT",
    result: "Winner",
    detail:
      "Won the internal selection round that BMSIT runs to choose the teams it puts forward.",
  },
  {
    id: "avinya-2",
    name: "Avinya 2.0",
    scope: "National level hackathon",
    result: "Participant",
    detail: "Took part. Building under a fixed deadline rather than at coursework pace.",
  },
];

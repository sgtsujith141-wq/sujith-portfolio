import type { ExplorationTheme } from "@/lib/types";

/* ══════════════════════════════════════════════════════════════════════
 *  CURRENT EXPLORATION — direction of study, never claims of expertise.
 *
 *  "active" means there is a repository or a running machine behind it.
 *  "planned" means exactly that, and is on the record so it cannot be
 *  quietly promoted to finished later.
 * ══════════════════════════════════════════════════════════════════════ */

export const explorationThemes: ExplorationTheme[] = [
  {
    id: "networking",
    title: "Networking, properly",
    status: "active",
    detail:
      "Working through the theory behind the network I already run: subnetting, how DNS resolution actually proceeds, and what WireGuard is doing underneath Tailscale. The lab is the test bench — if I get it wrong, something at home stops.",
    threads: ["Subnetting", "DNS resolution", "WireGuard internals", "Routing"],
  },
  {
    id: "infrastructure",
    title: "Making the lab less fragile",
    status: "active",
    detail:
      "The honest gap in my setup is that there is no backup strategy and no monitoring — I find out a service died when someone tells me. Fixing those two things, in that order, is the current project.",
    threads: ["Backups", "Monitoring", "Service recovery"],
  },
  {
    id: "security-fundamentals",
    title: "Security fundamentals",
    status: "active",
    detail:
      "The groundwork rather than the tooling: authentication, permissions and trust boundaries, and how they are supposed to work before studying how they fail. Carried into the apps as a rule that a platform which cannot answer renders as unavailable.",
    threads: ["Access control", "Trust boundaries", "Common vulnerability classes"],
  },
  {
    id: "applied-ai",
    title: "AI inside bounded products",
    status: "active",
    detail:
      "Where a model belongs in a small application and where it does not. Aether Health's open work is consolidating its two backends and adding a test suite; the interesting question is which parts should never be left to a model at all.",
    threads: ["Server-side model calls", "Deterministic fallbacks", "Bounded scope"],
  },
  {
    id: "labs",
    title: "Security labs and CTF",
    status: "planned",
    detail:
      "An isolated lab against deliberately vulnerable targets, and beginner CTF categories with written reasoning — including the attempts that go nowhere. Not started yet; listed so the direction is on record rather than implied.",
    threads: ["Isolated VM lab", "Entry-level categories", "Writeup discipline"],
  },
];

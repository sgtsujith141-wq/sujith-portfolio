import type { ExplorationTheme } from "@/lib/types";

/* ══════════════════════════════════════════════════════════════════════
 *  CURRENT EXPLORATION — direction of study, never claims of expertise.
 *
 *  "active" means there is a repository or a running machine behind it.
 *  "planned" means exactly that. Nothing here is a finished product.
 * ══════════════════════════════════════════════════════════════════════ */

export const explorationThemes: ExplorationTheme[] = [
  {
    id: "pqc",
    title: "Post-quantum cryptography",
    status: "active",
    detail:
      "How to inventory the cryptography that actually exists in a codebase, and how to model an unknown Q-Day honestly. CryptoDrishti's open items: real parsers for the nine regex-covered languages, Mach-O and PE symbol tables, and splitting RSA into signing and key-transport entries.",
    threads: ["NIST IR 8547 milestones", "CycloneDX CBOM", "Mosca's inequality"],
  },
  {
    id: "explainable-security",
    title: "Explainable security scoring",
    status: "active",
    detail:
      "Making a security score something a reviewer can audit rather than a number to trust. Next for SurakshaScore: the Android native bridge, so Tier 1 and Tier 2 signals are real on a device instead of only in tests.",
    threads: ["Provenance as a type", "Unavailable, not guessed", "Pure scoring functions"],
  },
  {
    id: "applied-ai",
    title: "AI inside bounded products",
    status: "active",
    detail:
      "Where a language model belongs in a small application and where it does not. Aether Health routes model calls through a server and extracts text before sending it; the open work is consolidating its two backends and adding a test suite.",
    threads: ["Server-side model calls", "Text before upload", "Deterministic fallbacks"],
  },
  {
    id: "systems",
    title: "Linux, networking and systems",
    status: "active",
    detail:
      "A Debian 12 home server is the lab: services under CasaOS, storage that survives a reboot, remote access over Tailscale with nothing forwarded to the public internet.",
    threads: ["Debian 12", "Tailscale / WireGuard", "Storage and permissions"],
  },
  {
    id: "labs",
    title: "Security labs and CTF",
    status: "planned",
    detail:
      "An isolated lab against deliberately vulnerable targets, and beginner CTF categories with written reasoning — including attempts that go nowhere. Not started yet; listed so the direction is on record.",
    threads: ["Isolated VM lab", "Entry-level categories", "Writeup discipline"],
  },
];

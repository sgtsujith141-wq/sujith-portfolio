import type { ExplorationTrack, LogEntry } from "@/lib/types";

/* ------------------------------------------------------------------ *
 *  CYBERSECURITY
 *
 *  `tracks` = the direction of study. Statements of intent and effort,
 *  never claims of expertise.
 *
 *  `log` = writeups, labs, experiments, tools and notes. It is EMPTY, and
 *  the section renders nothing at all for it — no heading, no empty state.
 *  Push an entry here and the archive appears on its own:
 *
 *    { id: "htb-01", kind: "writeup", title: "…", date: "2026-02",
 *      summary: "…", href: "/writeups/htb-01", tags: ["web", "linux"] }
 *
 *  kind ∈ "writeup" | "lab" | "experiment" | "tool" | "note"
 * ------------------------------------------------------------------ */

export const tracks: ExplorationTrack[] = [
  {
    id: "security-fundamentals",
    title: "Cybersecurity fundamentals",
    status: "active",
    detail:
      "Working through the groundwork rather than the tooling — how authentication, permissions and trust boundaries are supposed to work before studying how they fail.",
    focus: ["Threat basics", "Access control", "Common vulnerability classes"],
  },
  {
    id: "networking",
    title: "Networking",
    status: "active",
    detail:
      "Following packets properly: addressing, routing, the layer model, and what my own home network is actually doing when a device talks to the server.",
    focus: ["TCP/IP", "Subnetting", "DNS", "VPN / WireGuard"],
  },
  {
    id: "linux",
    title: "Linux",
    status: "active",
    detail:
      "Daily driving the terminal on a live Debian server. Permissions, services, storage, logs — mostly learned by breaking something that other people were using.",
    focus: ["Filesystem & permissions", "Services", "Shell", "Package management"],
  },
  {
    id: "systems",
    title: "Systems",
    status: "active",
    detail:
      "How an operating system boots, schedules and manages memory, and what changes between a bare install and a machine doing real work.",
    focus: ["OS internals", "Boot & partitioning", "Processes & memory"],
  },
  {
    id: "security-labs",
    title: "Security labs",
    status: "queued",
    detail:
      "Setting up an isolated lab environment to practise against deliberately vulnerable targets, where nothing I touch belongs to anyone else.",
    focus: ["Isolated VM lab", "Vulnerable-by-design targets", "Methodology"],
  },
  {
    id: "ctf",
    title: "CTF",
    status: "queued",
    detail:
      "Not started yet. The plan is beginner categories first, with a written record of the reasoning — including the attempts that went nowhere.",
    focus: ["Entry-level categories", "Writeup discipline"],
  },
];

/** Empty. The archive block does not render at all until this has entries. */
export const log: LogEntry[] = [];

export const logKindMeta: Record<LogEntry["kind"], string> = {
  writeup: "Writeup",
  lab: "Lab",
  experiment: "Experiment",
  tool: "Tool",
  note: "Note",
};

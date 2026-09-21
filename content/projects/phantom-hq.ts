import type { Project } from "@/lib/types";

/* ══════════════════════════════════════════════════════════════════════
 *  PHANTOM HQ
 *
 *  Ongoing, and not finished. The repository is PRIVATE, so `repo` is
 *  absent and every affordance that would link to one hides itself — no
 *  public link may be invented for it.
 *
 *  The status below is read from the project's own PHASE_MANIFEST.json,
 *  which that project treats as authoritative over its README. Checked
 *  on 2026-09-21: phases 00–21 COMPLETE, 22–24 NOT_STARTED.
 *
 *  Nothing here claims the system is autonomous, production-ready or
 *  commercially available, because none of that is verified.
 * ══════════════════════════════════════════════════════════════════════ */

export const phantomHq: Project = {
  slug: "phantom-hq",
  index: "06",
  name: "Phantom HQ",
  tagline:
    "A local-first AI workspace I'm building: a persistent assistant, agents that do the work, and a dashboard to watch it from.",
  category: "Ongoing personal project",
  status: "building",
  statusNote:
    "In progress. 21 of 24 build phases are marked complete in the project's own manifest; end-to-end testing, a clean-machine rebuild and v1.0 are not done. The repository is private.",
  stack: ["TypeScript", "Monorepo", "Local-first", "SQLite"],
  concepts: ["ai", "systems", "tinkering"],
  accent: "violet",

  problem: [
    "I wanted an assistant that runs on my own machine rather than someone else's, keeps its context between sessions, and can actually carry work out instead of only describing it.",
  ],
  solution: [
    "The shape is: I give it something to do, a persistent assistant works out how, agents carry it out, and anything that matters comes back to me for approval before it happens.",
    "It's built in numbered phases against a frozen specification, with a manifest that records exactly which phases are done. That file is the source of truth for the status shown here — not my memory of it.",
  ],
  howItWorks: [
    {
      title: "Local-first",
      detail: "It runs on my own machine. That is the constraint the rest of the design follows from.",
    },
    {
      title: "A persistent assistant",
      detail: "Something that keeps context between sessions rather than starting from nothing each time.",
    },
    {
      title: "Agents and a dashboard",
      detail: "Workers that carry tasks out, and somewhere to watch what they are doing.",
    },
    {
      title: "Approval before anything that matters",
      detail: "The design puts me in front of important actions rather than behind them.",
    },
  ],

  evidence: [
    { label: "Build phases complete", value: "21 / 24", note: "from the project's own manifest" },
    { label: "Remaining", value: "3", note: "end-to-end test, clean rebuild, v1.0" },
    { label: "Repository", value: "Private", note: "nothing public to link to yet" },
  ],

  verification: [
    {
      claim: "21 of 24 build phases marked complete; 22–24 not started",
      source: "PHASE_MANIFEST.json in the project repository",
      date: "2026-09-21",
      method: "Read from the manifest the project treats as authoritative over its README",
    },
    {
      claim: "The repository is private",
      source: "GitHub repository listing for sgtsujith141-wq",
      date: "2026-09-21",
      method: "Visibility read through the GitHub API",
    },
  ],

  decisions: [
    {
      title: "Local-first, not a hosted service",
      body: "It runs on my machine. That rules out a lot of easy options and is the point — I wanted something that keeps working without depending on somebody else's server.",
      tradeoff: "Everything is harder, and there is no easy way to show it to anyone.",
    },
    {
      title: "Build it in numbered phases against a frozen spec",
      body: "Each phase has to be specified, implemented, tested and recorded before the next one starts, and a manifest tracks exactly where the build stands.",
      tradeoff: "It is slower than building whatever seems interesting next, and the manifest is only useful if I keep it honest.",
    },
  ],

  limitations: [
    "Not finished. Three phases remain, including the end-to-end system test — so the whole thing has not been exercised together yet.",
    "Not production-ready, not commercially available, and no claim is made that it runs autonomously.",
    "The repository is private, so none of this is independently checkable right now.",
    "Like my other applications, this is built with AI coding tools.",
  ],

  screenshots: [],
};

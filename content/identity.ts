import type { Domain, SkillGroup } from "@/lib/types";

/* ══════════════════════════════════════════════════════════════════════
 *  IDENTITY — who Sujith is, not what his repositories import.
 *
 *  Three ideas are kept strictly apart, because conflating them is how a
 *  portfolio ends up claiming a test runner as a personality trait:
 *
 *    DOMAINS  — what he genuinely enjoys exploring. The personal network
 *               in section 03 is built from these.
 *    SKILLS   — what he has actually worked with, with an honest level.
 *    STACK    — frameworks and libraries used in a particular repository.
 *               Those live in content/projects/*.ts and nowhere else.
 *
 *  Every `evidence` line below points at something that exists: a service
 *  running in the home lab, or a repository on GitHub.
 * ══════════════════════════════════════════════════════════════════════ */

export const headline = {
  /** Set as three lines so the hero can choreograph them separately. */
  lines: ["Exploring networks,", "securing systems,", "building things that matter."],
  plain: "Exploring networks, securing systems, and building things that matter.",
};

export const domains: Domain[] = [
  {
    id: "networking",
    label: "Networking",
    summary: "How packets actually get from one machine to another.",
    body: "The part I keep coming back to. Running my own server forced me to learn addressing, NAT and routing properly, because nothing works until you understand what the router is doing. Remote access is a WireGuard mesh rather than a forwarded port, which is a networking decision before it is a security one.",
    evidence: [
      "Tailscale mesh connecting my laptop and phone to the server, peer to peer",
      "Fixed local address for the server so services stop moving between reboots",
      "Nothing forwarded to the public internet — the network is closed by choice",
    ],
    projects: ["home-lab"],
    services: ["internet", "tailscale"],
    accent: "cyan",
  },
  {
    id: "cybersecurity",
    label: "Cybersecurity",
    summary: "The direction I am heading, starting from the fundamentals.",
    body: "I am early in this and say so. Right now it means the groundwork — permissions, trust boundaries, what a claim of security actually rests on — rather than a list of tools. The security work I have shipped is about being honest with users: showing where a number came from and refusing to assert protection that is not implemented.",
    evidence: [
      "SurakshaScore scores device and account posture and shows the derivation",
      "Its predecessor's vault encrypts client-side with PBKDF2 and AES-GCM",
      "Breach checks use k-anonymity, so no password or full hash leaves the browser",
    ],
    projects: ["surakshascore", "surakshascore-mvp", "cryptodrishti"],
    services: ["tailscale", "internet"],
    accent: "blue",
  },
  {
    id: "systems",
    label: "Computer systems",
    summary: "What happens between pressing power and a usable machine.",
    body: "Installing operating systems, partitioning disks and setting up dual and multiboot taught me more than any tutorial. I would rather understand the layer underneath than collect tool names — how a machine boots, how it schedules work, and what changes between a bare install and one doing real work.",
    evidence: [
      "Debian installed from scratch on the server, partitioned and mounted by hand",
      "Dual and multiboot setups on my own machines",
      "Storage mounts that survive a reboot, because the first ones did not",
    ],
    projects: ["home-lab"],
    services: ["debian", "storage"],
    accent: "violet",
  },
  {
    id: "linux",
    label: "Linux",
    summary: "A headless Debian box I have to keep running.",
    body: "No desktop environment, so everything happens in the terminal. Permissions and ownership, services that need to start and stay started, logs when something refuses to, package management. Most of what stuck came from breaking something other people were using and having to fix it.",
    evidence: [
      "Debian 12 (Bookworm) running headless as the home server",
      "Daily terminal work: filesystem, permissions, services, logs",
      "No desktop environment installed — nothing runs that I did not ask for",
    ],
    projects: ["home-lab"],
    services: ["debian"],
    accent: "green",
  },
  {
    id: "infrastructure",
    label: "Servers & self-hosting",
    summary: "Services other people depend on, in my house.",
    body: "The difference between a project and infrastructure is that somebody notices when infrastructure stops. Media, file storage and a game server run on one machine under CasaOS, and the people using them are my family and friends. That changes how carefully you think about restarts.",
    evidence: [
      "CasaOS managing the containerised services on top of Debian",
      "Jellyfin streaming a local library to browsers, phones and a TV",
      "A Minecraft server with real players who notice immediately when it is down",
    ],
    projects: ["home-lab"],
    services: ["casaos", "jellyfin", "storage", "minecraft"],
    accent: "cyan",
  },
  {
    id: "ai",
    label: "AI, used carefully",
    summary: "A component inside a bounded product, not the product.",
    body: "I am interested in where a model belongs and, just as much, where it does not. In one project the report analysis goes through a model on the server with text extracted first. In another, the security explanations deliberately come from typed templates, because a model can invent a claim and a template cannot.",
    evidence: [
      "Aether Health routes model calls through a server so the key never reaches the browser",
      "Report text is extracted server-side before anything is sent",
      "SurakshaScore generates every explanation from typed templates — no runtime model",
    ],
    projects: ["aether-health", "surakshascore"],
    services: [],
    accent: "violet",
  },
  {
    id: "software",
    label: "Building useful software",
    summary: "Small tools taken far enough to actually run.",
    body: "I like finishing things to the point where someone else could use them, then writing down honestly what works and what does not yet. That means tests that pin real behaviour, continuous integration that would catch me, and a limitations section at the top of the README rather than buried.",
    evidence: [
      "226 tests in CryptoDrishti and 107 in SurakshaScore, green in CI",
      "Every repository states its known limitations in plain words",
      "Security claims the code did not implement were removed rather than softened",
    ],
    projects: ["cryptodrishti", "surakshascore", "aether-health", "surakshascore-mvp"],
    services: [],
    accent: "slate",
  },
];

export const domainById = Object.fromEntries(domains.map((d) => [d.id, d])) as Record<
  Domain["id"],
  Domain
>;

/* ── Skills ────────────────────────────────────────────────────────── */

export const skills: SkillGroup[] = [
  {
    id: "systems-linux",
    title: "Linux & systems",
    level: "Hands on, daily",
    note: "Learned by running a server that other people use, and fixing it when it stopped.",
    items: [
      "Debian 12",
      "Terminal-only administration",
      "Permissions & ownership",
      "Services & logs",
      "Storage & mounts",
      "OS installation",
      "Dual / multiboot",
    ],
  },
  {
    id: "networking",
    title: "Networking",
    level: "Practical, still building depth",
    note: "Enough to run a private network properly; still working through the theory.",
    items: [
      "Addressing & NAT",
      "Static local leases",
      "Tailscale / WireGuard mesh",
      "Remote access without port forwarding",
      "DNS basics",
      "TCP/IP fundamentals",
    ],
  },
  {
    id: "programming",
    title: "Programming",
    level: "Fundamentals",
    note: "Comfortable with the basics and coursework-level work. Depth is the current project.",
    items: ["Python", "C", "C++", "TypeScript", "HTML"],
  },
  {
    id: "tooling",
    title: "Engineering practice",
    level: "Working knowledge",
    note: "Used across the repositories rather than studied on their own.",
    items: ["Git & GitHub", "GitHub Actions", "Writing tests", "Technical documentation"],
  },
  {
    id: "creative",
    title: "Design & documents",
    level: "Working knowledge",
    note: "Used for real deliverables — reports, decks and diagrams.",
    items: ["Photoshop", "CorelDRAW", "Word", "Excel", "PowerPoint"],
  },
];

/** Shown once, under the skills grid, so the distinction is explicit. */
export const stackNote =
  "Frameworks and libraries — FastAPI, React, Vite, Vitest, Capacitor, Express and the rest — belong to the repositories that use them. They are listed inside each case study, not here.";

/* ── Who I am ──────────────────────────────────────────────────────── */

export const intro = [
  "I am a second-year Computer Science & Engineering student at BMSIT in Bengaluru.",
  "Most of what I know outside coursework came from breaking something on my own machine and then having to fix it. That started with installing operating systems, turned into a Debian server running in my house, and ended up as the thing I spend most of my time on.",
];

export const principles = [
  {
    id: "underneath",
    title: "Understand the layer underneath",
    body: "I would rather know why a service failed to start than know the command that restarts it. Tool names are easy to collect and easy to forget.",
  },
  {
    id: "honest",
    title: "Say exactly what was verified",
    body: "Every number on this site carries the date and method behind it. In my apps, a platform that cannot answer a question renders as unavailable rather than quietly passing.",
  },
  {
    id: "enforced",
    title: "Prefer a rule a test enforces",
    body: "An architecture rule written in a document gets violated. SurakshaScore's core engine has a test that fails the build if it imports React or touches a browser global.",
  },
  {
    id: "finish",
    title: "Finish it enough to run",
    body: "A demo that only works on my machine has not taught me much. The bar is that someone else can clone it, run it, and read honestly about what it does not do.",
  },
];

/** Only what actually happened. */
export const hackathons = [
  {
    id: "sih-internal",
    name: "Smart India Hackathon",
    scope: "Internal college round, BMSIT",
    result: "Winner",
    detail: "Won the internal selection round that BMSIT runs to choose the teams it puts forward.",
  },
  {
    id: "avinya-2",
    name: "Avinya 2.0",
    scope: "National level hackathon",
    result: "Participant",
    detail: "Took part. Building under a fixed deadline rather than at coursework pace.",
  },
];

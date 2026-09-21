import type { Project } from "@/lib/types";
import { homelab, services } from "@/content/homelab";

/* The home lab as a case study. It has no repository — it is a machine —
 * so `repo` is absent and every affordance that would link to one hides
 * itself. Facts were supplied by Sujith; nothing is measured or simulated. */

export const homeLab: Project = {
  slug: "home-lab",
  index: "02",
  name: "Home Lab",
  tagline: homelab.summary,
  category: "Infrastructure & self-hosting",
  status: "running",
  statusNote:
    "Running at home. One node, four services, used daily by my family and friends.",
  stack: ["Debian 12", "CasaOS", "Jellyfin", "Tailscale", "WireGuard", "Linux CLI"],
  concepts: ["networking", "linux", "infrastructure", "systems"],
  accent: "green",
  visual: "topology",

  problem: [
    "I wanted to learn Linux, networking and how services actually run, and reading about them was not working. Nothing sticks until something breaks and you are the only person who can fix it.",
    "There was also a practical side: media, files and a game server for the people in my house, without a subscription and without handing any of it to a cloud provider.",
  ],
  solution: [
    "A single Debian 12 machine, installed and partitioned by hand, running headless with no desktop environment. CasaOS sits on top and manages the containerised services.",
    "Remote access is a Tailscale mesh rather than a forwarded port, so my laptop and phone reach the server directly over WireGuard and nothing on it is published to the public internet.",
  ],
  howItWorks: services.slice(0, 5).map((s) => ({
    title: `${s.label} — ${s.tag.toLowerCase()}`,
    detail: s.what,
  })),

  architecture: {
    groups: [
      { id: "edge", label: "Edge" },
      { id: "overlay", label: "Private network" },
      { id: "host", label: "Host" },
      { id: "platform", label: "Service layer" },
      { id: "service", label: "Services" },
    ],
    nodes: services.map((s) => ({
      id: s.id,
      label: s.label,
      detail: s.what,
      group: s.kind,
      ...(s.id === "internet" ? { caveat: "Closed by choice — no ports forwarded" } : {}),
    })),
    edges: services.filter((s) => s.parent).map((s) => ({ from: s.parent as string, to: s.id })),
  },

  evidence: [
    { label: "Host", value: "Debian 12", note: "Bookworm, headless, installed from scratch" },
    { label: "Services", value: "4", note: "media, file storage, game server, remote access" },
    { label: "Nodes", value: "1", note: "single machine — not a cluster" },
    { label: "Ports forwarded", value: "0", note: "remote access is a WireGuard mesh" },
  ],

  verification: [
    {
      claim: "Debian 12 host running CasaOS, Jellyfin, file storage and a Minecraft server",
      source: "Configuration described by Sujith",
      date: "2026-09-19",
      method: "Stated by the operator of the machine; not measured remotely",
    },
    {
      claim: "Remote access is a Tailscale (WireGuard) mesh with no ports forwarded",
      source: "Configuration described by Sujith",
      date: "2026-09-19",
      method: "Stated by the operator; the topology diagram is labelled illustrative",
    },
  ],

  decisions: [
    {
      title: "A mesh VPN instead of a forwarded port",
      body: "Reaching the server from outside the house could have been one port-forward rule. Tailscale authenticates devices into a private WireGuard network and they talk peer to peer, so nothing is exposed publicly and no dynamic-DNS hostname is needed.",
      tradeoff:
        "Every device that needs access has to be enrolled first, so nothing can be shared with someone by sending them a link.",
    },
    {
      title: "Debian, headless, over a desktop distribution",
      body: "Stable, small, and it does not run anything I did not ask for. Working without a desktop environment forced me into the terminal for everything, which was the point.",
      tradeoff: "Every task is slower at first, and there is no graphical fallback when something breaks.",
    },
    {
      title: "CasaOS as a service layer, with the OS still underneath",
      body: "It gives one place to deploy services and map storage rather than wiring each one up by hand. I treat it as convenience, not as the system.",
      tradeoff:
        "It abstracts away detail I would otherwise have learned, and when something genuinely breaks the fix is on the Debian side anyway.",
    },
    {
      title: "Real users, on purpose",
      body: "Media and the game server are used by my family and friends. That is what turns a lab into infrastructure: a restart at the wrong moment is somebody else's evening.",
      tradeoff: "I cannot experiment freely on the live box, which is a genuine constraint.",
    },
  ],

  limitations: [
    "A single node. No clustering, no orchestration, no failover, and no uptime guarantee — if the machine is off, everything is off.",
    "No monitoring or alerting. I find out something has stopped when someone tells me.",
    "No backup strategy worth the name yet. This is the next thing to fix.",
    "The topology diagram is illustrative: the services and their relationships are real, the layout is drawn for clarity and is not measured from the network.",
    "Hardware specifications, addresses, hostnames and network configuration are deliberately not published.",
    "Nothing here has been security-audited. The network is closed to the public internet, which is a design choice, not a guarantee.",
  ],

  screenshots: [],
};

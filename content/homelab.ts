import type { LabService } from "@/lib/types";

/* ══════════════════════════════════════════════════════════════════════
 *  HOME LAB
 *
 *  A single Debian machine at home. Every fact here was supplied by
 *  Sujith directly: the operating system, the service layer, the four
 *  services and the remote-access method. Nothing is measured from the
 *  machine and nothing is simulated.
 *
 *  Deliberately absent, because inventing them would be a lie about
 *  someone's actual infrastructure: hardware specifications, uptime,
 *  bandwidth, CPU or memory figures, IP addresses, hostnames, firewall
 *  rules, and any claim that the setup is secure.
 *
 *  The topology is laid out by `layer` (0 at the top) and `x` (0–1 across
 *  that layer). Edges are derived from `parent`, so adding a service is
 *  one object — no diagram code to touch.
 * ══════════════════════════════════════════════════════════════════════ */

export const homelab = {
  title: "Home Lab",
  kicker: "One machine, four services, people who notice when it stops",
  summary:
    "A Debian 12 box in my house that serves media, files and a Minecraft server to my family and friends, reachable from anywhere over a private Tailscale network with nothing forwarded to the public internet.",
  intro:
    "This started as a spare machine and an operating system install. It turned into the thing that taught me most of what I know about Linux, networking and keeping a service running when nobody else is going to fix it.",
  /** Rendered verbatim so the scope is never oversold. */
  scope:
    "Scope: a single-node home setup, not a datacenter. No clustering, no orchestration, no high availability, and no uptime guarantee. The value is that every layer of it was done by hand.",
  /** Shown on the topology itself. */
  diagramNote:
    "Illustrative topology — the services and their relationships are real; the layout is drawn for clarity, not measured from the network.",
  facts: [
    { label: "HOST", value: "Debian 12 (Bookworm)" },
    { label: "SERVICE LAYER", value: "CasaOS" },
    { label: "REMOTE ACCESS", value: "Tailscale (WireGuard)" },
    { label: "NODES", value: "1" },
    { label: "PORTS FORWARDED", value: "None" },
  ],
} as const;

export const services: LabService[] = [
  {
    id: "internet",
    label: "Home network",
    tag: "WAN / LAN",
    kind: "edge",
    layer: 0,
    x: 0.5,
    what: "The home router and the public connection sitting in front of everything else.",
    purpose:
      "Carries traffic in and out of the house. Deliberately closed — nothing on the server is published directly to the public internet.",
    configured: [
      "Worked out how the router hands out addresses on the local network",
      "Gave the server a fixed local address so it stops moving between reboots",
      "Chose not to forward any ports to the internet",
    ],
    learned:
      "The difference between a private address range and a public one, what NAT is actually doing, and why leaving ports open on a home connection is a bad default.",
    domains: ["networking", "cybersecurity"],
  },
  {
    id: "tailscale",
    label: "Tailscale",
    tag: "MESH VPN",
    kind: "overlay",
    layer: 1,
    x: 0.5,
    parent: "internet",
    what: "A WireGuard-based private network that connects my devices straight to the server, without opening anything to the internet.",
    purpose:
      "Remote access. It is the reason I can reach Jellyfin or my files from outside the house with no port forwarding and no public hostname.",
    configured: [
      "Installed the Tailscale client on the server and on my laptop and phone",
      "Authenticated those machines into one private network",
      "Reach services over their Tailscale addresses instead of local IPs",
    ],
    learned:
      "That a VPN does not have to mean a central gateway — devices can talk peer to peer. It was also the first time remote access made sense to me as a networking problem rather than a setting to switch on.",
    domains: ["networking", "cybersecurity"],
  },
  {
    id: "debian",
    label: "Debian 12",
    tag: "HOST OS",
    kind: "host",
    layer: 2,
    x: 0.5,
    parent: "tailscale",
    what: "The base operating system. A headless Debian 12 install that everything else runs on top of.",
    purpose:
      "The foundation. Chosen over a desktop distribution because it is stable, small and does not run anything I did not ask for.",
    configured: [
      "Installed Debian from scratch and partitioned the disks",
      "Set up the user account, sudo access and remote access to the machine",
      "Work entirely from the terminal — no desktop environment",
      "Handle updates, storage mounts and services when something stops working",
    ],
    learned:
      "Real terminal work rather than tutorial commands: the filesystem layout, permissions and ownership, how services get started and kept running, reading logs when something refuses to start, and mounting storage so it survives a reboot.",
    domains: ["operating-systems", "systems"],
  },
  {
    id: "casaos",
    label: "CasaOS",
    tag: "SERVICE LAYER",
    kind: "platform",
    layer: 3,
    x: 0.5,
    parent: "debian",
    what: "A lightweight self-hosting dashboard on top of Debian that manages the containerised services.",
    purpose:
      "Gives the server one place to manage services and storage instead of wiring each one up by hand every time.",
    configured: [
      "Installed CasaOS on the Debian host",
      "Deployed and configured the services running under it",
      "Mapped host storage into the services that need it",
    ],
    learned:
      "How a service layer sits above the OS, what it is actually abstracting away, and where that abstraction stops — when something breaks, the fix is still on the Debian side.",
    domains: ["servers", "systems"],
  },
  {
    id: "jellyfin",
    label: "Jellyfin",
    tag: "MEDIA",
    kind: "service",
    layer: 4,
    x: 0.16,
    parent: "casaos",
    what: "A self-hosted media server streaming a local library to browsers, phones and a TV.",
    purpose:
      "The reason the server exists for everyone else in the house. Media stays local and nothing depends on a subscription.",
    configured: [
      "Set up the libraries and pointed them at the storage mounts",
      "Created accounts for the people who use it",
      "Worked through playback and transcoding behaviour on the hardware available",
    ],
    learned:
      "That streaming is a resource problem, not a magic one — transcoding is CPU work, and a library that plays fine on one device may need re-encoding for another.",
    domains: ["servers"],
  },
  {
    id: "storage",
    label: "File storage",
    tag: "STORAGE",
    kind: "service",
    layer: 4,
    x: 0.5,
    parent: "casaos",
    what: "Network file storage — shared folders on the server that other machines can mount and use.",
    purpose: "One place for files that is not a laptop disk and not a cloud drive.",
    configured: [
      "Partitioned and mounted the drives on the Debian host",
      "Set up shared folders and the permissions around them",
      "Reach them from other machines on the local network and over Tailscale",
    ],
    learned:
      "Linux mounting and permissions in a way that finally stuck, plus the practical difference between a share being reachable and a share being writable.",
    domains: ["servers", "systems"],
  },
  {
    id: "minecraft",
    label: "Minecraft server",
    tag: "GAME SERVER",
    kind: "service",
    layer: 4,
    x: 0.84,
    parent: "casaos",
    what: "A Minecraft server hosted on the same machine for friends to join.",
    purpose:
      "The most demanding thing on the box, and the one with actual users who notice immediately when it is down.",
    configured: [
      "Set up the server and its configuration files",
      "Allocated memory and kept it running as a background service",
      "Handled connectivity so players could reach it",
    ],
    learned:
      "Resource limits are real — a Java process with the wrong heap settings will take the whole machine with it. Also that “it works on my machine” means nothing once someone else has to connect.",
    domains: ["servers", "networking"],
  },
];

/** Derived once at module scope so the diagram never recomputes per render. */
export const serviceEdges = services
  .filter((s) => s.parent)
  .map((s) => ({ from: s.parent as string, to: s.id }));

export const serviceById = Object.fromEntries(services.map((s) => [s.id, s])) as Record<
  string,
  LabService
>;

export const serviceLayers = Math.max(...services.map((s) => s.layer)) + 1;

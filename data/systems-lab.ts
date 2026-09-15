import type { TopologyNode } from "@/lib/types";

/* ------------------------------------------------------------------ *
 *  SYSTEMS LAB — the starred project.
 *
 *  Topology layout is data-driven: `row` is the vertical band (0 = top)
 *  and `x` is the horizontal position inside that band (0 = left,
 *  1 = right). Edges are derived from `parent`, so adding a service is
 *  a matter of appending one object below — no diagram code to touch.
 *
 *  Keep the copy honest. This is a home server, described as a home
 *  server. No enterprise vocabulary.
 * ------------------------------------------------------------------ */

export const systemsLab = {
  title: "Systems Lab",
  caseId: "000",
  kicker: "Starred Project",
  summary:
    "A Debian 12 machine at home that serves media, files and a Minecraft server to a handful of people, reachable from anywhere over a private Tailscale network.",
  intro:
    "This started as a spare machine and an operating system install. It turned into the thing that taught me most of what I know about Linux, networking and keeping a service running when nobody else is going to fix it.",
  /** Honest scope statement — displayed verbatim so the project is not oversold. */
  scope:
    "Scope note: this is a single-node home setup, not a datacenter. No clustering, no orchestration, no high availability. The value was in doing every layer of it by hand.",
  facts: [
    { label: "HOST", value: "Debian 12 (Bookworm)" },
    { label: "PLATFORM", value: "CasaOS" },
    { label: "ACCESS", value: "Tailscale (WireGuard)" },
    { label: "NODES", value: "1" },
    { label: "STATE", value: "Running" },
  ],
} as const;

export const topology: TopologyNode[] = [
  {
    id: "internet",
    label: "Internet",
    tag: "WAN",
    row: 0,
    x: 0.5,
    kind: "edge",
    what: "The home router and the public connection sitting in front of everything else.",
    configured: [
      "Worked out how the router hands out addresses on the local network",
      "Gave the server a fixed local address so it stops moving between reboots",
      "Chose not to forward any ports to the internet",
    ],
    purpose:
      "Carries traffic in and out of the house. Deliberately closed — nothing on the server is published directly to the public internet.",
    learned:
      "The difference between a private address range and a public one, what NAT is actually doing, and why leaving ports open on a home connection is a bad default.",
  },
  {
    id: "tailscale",
    label: "Tailscale",
    tag: "MESH VPN",
    row: 1,
    x: 0.5,
    parent: "internet",
    kind: "overlay",
    what: "A WireGuard-based private network that connects my devices to the server directly, without opening anything to the internet.",
    configured: [
      "Installed the Tailscale client on the server and on my laptop and phone",
      "Authenticated the machines into one private network",
      "Use the Tailscale addresses to reach services instead of the local IPs",
    ],
    purpose:
      "Remote access. It is the reason I can reach Jellyfin or files from outside the house without port forwarding or a public hostname.",
    learned:
      "That a VPN does not have to mean a central gateway — devices can talk peer to peer. It was also the first time remote access made sense to me as a networking problem rather than a setting to switch on.",
  },
  {
    id: "debian",
    label: "Debian 12",
    tag: "HOST OS",
    row: 2,
    x: 0.5,
    parent: "tailscale",
    kind: "host",
    what: "The base operating system. A headless Debian 12 install that everything else runs on top of.",
    configured: [
      "Installed Debian from scratch and partitioned the disks",
      "Set up the user account, sudo access and remote access to the machine",
      "Learned to work entirely from the terminal — no desktop environment",
      "Handle updates, storage mounts and services when something stops working",
    ],
    purpose:
      "The foundation. Chosen over a desktop distribution because it is stable, small and does not run anything I did not ask for.",
    learned:
      "Real terminal work rather than tutorial commands: the filesystem layout, permissions and ownership, how services get started and kept running, reading logs when something refuses to start, and mounting storage so it survives a reboot.",
  },
  {
    id: "casaos",
    label: "CasaOS",
    tag: "SERVICE LAYER",
    row: 3,
    x: 0.5,
    parent: "debian",
    kind: "platform",
    what: "A lightweight self-hosting dashboard that sits on top of Debian and manages the containerised services.",
    configured: [
      "Installed CasaOS on the Debian host",
      "Deployed and configured the services running under it",
      "Mapped host storage into the services that need it",
    ],
    purpose:
      "Gives the server a single place to manage services and storage instead of wiring each one up by hand every time.",
    learned:
      "How a service layer sits above the OS, what it is actually abstracting away, and where that abstraction stops — when something breaks, the fix is still on the Debian side.",
  },
  {
    id: "jellyfin",
    label: "Jellyfin",
    tag: "MEDIA",
    row: 4,
    x: 0.14,
    parent: "casaos",
    kind: "service",
    what: "A self-hosted media server that streams a local library to browsers, phones and a TV.",
    configured: [
      "Set up the libraries and pointed them at the storage mounts",
      "Created user accounts for the people who use it",
      "Worked through playback and transcoding behaviour on the hardware available",
    ],
    purpose:
      "The reason the server exists for everyone else in the house. Media stays local and nothing depends on a subscription.",
    learned:
      "That streaming is a resource problem, not a magic one — transcoding is CPU work, and a library that plays fine on one device may need re-encoding for another.",
  },
  {
    id: "storage",
    label: "Storage",
    tag: "FILES",
    row: 4,
    x: 0.5,
    parent: "casaos",
    kind: "service",
    what: "Network file storage — shared folders on the server that other machines on the network can mount and use.",
    configured: [
      "Partitioned and mounted the drives on the Debian host",
      "Set up shared folders and the permissions around them",
      "Access them from other machines over the local network and over Tailscale",
    ],
    purpose:
      "One place for files that is not a laptop disk and not a cloud drive.",
    learned:
      "Linux mounting and permissions in a way that finally stuck, plus the practical difference between a share being reachable and a share being writable.",
  },
  {
    id: "minecraft",
    label: "Minecraft",
    tag: "GAME SERVER",
    row: 4,
    x: 0.86,
    parent: "casaos",
    kind: "service",
    what: "A Minecraft server hosted on the same machine for friends to join.",
    configured: [
      "Set up the server and its configuration files",
      "Allocated memory and kept it running as a background service",
      "Handled connectivity so players could reach it",
    ],
    purpose:
      "The most demanding thing on the box, and the one with actual users who notice immediately when it is down.",
    learned:
      "Resource limits are real — a Java process with the wrong heap settings will take the whole machine with it. Also that 'it works on my machine' means nothing once someone else has to connect.",
  },
];

/** Derived once at module scope so the diagram does not recompute per render. */
export const topologyEdges = topology
  .filter((n) => n.parent)
  .map((n) => ({ from: n.parent as string, to: n.id }));

export const topologyById = Object.fromEntries(
  topology.map((n) => [n.id, n]),
) as Record<string, TopologyNode>;

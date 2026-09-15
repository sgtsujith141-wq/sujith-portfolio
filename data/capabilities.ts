import type { CapabilityGroup } from "@/lib/types";

/* ------------------------------------------------------------------ *
 *  CAPABILITIES — grouped by honest proficiency, never scored.
 *  No percentages, no bars, no star ratings. The `level` string is the
 *  qualifier that keeps each group truthful.
 * ------------------------------------------------------------------ */

export const capabilities: CapabilityGroup[] = [
  {
    id: "programming",
    title: "Programming",
    level: "Fundamentals",
    note: "Comfortable with the basics and coursework-level work. Still building depth.",
    items: ["Python", "C", "C++", "HTML"],
  },
  {
    id: "systems",
    title: "Systems & Networking",
    level: "Hands on",
    note: "Learned by running an actual server and fixing it when it stopped working.",
    items: [
      "Debian",
      "Self-hosting",
      "Home servers",
      "CasaOS",
      "Jellyfin",
      "Tailscale",
      "Minecraft server hosting",
      "OS installation",
      "Dual boot / multiboot",
      "Networking fundamentals",
      "Terminal basics",
    ],
  },
  {
    id: "creative",
    title: "Creative & Productivity",
    level: "Working knowledge",
    note: "Design and document tooling used regularly for real deliverables.",
    items: ["Photoshop", "CorelDRAW", "Word", "Excel", "PowerPoint"],
  },
];

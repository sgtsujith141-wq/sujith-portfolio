import type { NavSection, SectionId } from "@/lib/types";

/* ══════════════════════════════════════════════════════════════════════
 *  SECTION REGISTRY — the home page only.
 *
 *  The rail, the mobile menu, the scroll-spy and the background engine
 *  all read from this one list. Projects are no longer a home section:
 *  they have their own route at /work, previewed here by a teaser.
 * ══════════════════════════════════════════════════════════════════════ */

export const sections: NavSection[] = [
  { id: "introduction", index: "01", label: "Introduction", short: "Intro" },
  { id: "about", index: "02", label: "About", short: "About" },
  { id: "machines", index: "03", label: "Machines", short: "Machines" },
  { id: "now", index: "04", label: "Now", short: "Now" },
  { id: "work", index: "05", label: "Work", short: "Work" },
  { id: "connect", index: "06", label: "Connect", short: "Connect" },
];

export const sectionIds: SectionId[] = sections.map((s) => s.id);

export const sectionById = Object.fromEntries(sections.map((s) => [s.id, s])) as Record<
  SectionId,
  NavSection
>;

/** Sections used by the Work route's own scroll-spy and background states. */
export const workSectionIds = ["work-index"] as const;

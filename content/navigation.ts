import type { NavSection, SectionId } from "@/lib/types";

/* Section registry. The rail, the mobile bar, the scroll-spy, the
 * background engine and the sitemap all read from this one list. */
export const sections: NavSection[] = [
  { id: "introduction", index: "01", label: "Introduction", short: "Intro" },
  { id: "work", index: "02", label: "Selected Work", short: "Work" },
  { id: "evidence", index: "03", label: "Engineering Evidence", short: "Evidence" },
  { id: "about", index: "04", label: "About", short: "About" },
  { id: "exploration", index: "05", label: "Current Exploration", short: "Now" },
  { id: "connect", index: "06", label: "Connect", short: "Connect" },
];

export const sectionIds: SectionId[] = sections.map((s) => s.id);

export const sectionById = Object.fromEntries(sections.map((s) => [s.id, s])) as Record<
  SectionId,
  NavSection
>;

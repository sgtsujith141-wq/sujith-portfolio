/* Section registry. The nav, the scroll-spy and the command palette all
 * read from this one list, so a new section is added in exactly one place.
 *
 * Systems Lab is deliberately absent: it is a starred project inside
 * Projects, not a top-level section. */

export interface NavItem {
  id: string;
  label: string;
  /** Two-digit index rendered beside the label. */
  index: string;
}

export const navItems: NavItem[] = [
  { id: "about", label: "About", index: "01" },
  { id: "projects", label: "Projects", index: "02" },
  { id: "cybersecurity", label: "Cybersecurity", index: "03" },
  { id: "hackathons", label: "Hackathons", index: "04" },
  { id: "contact", label: "Contact", index: "05" },
];

/** Every scroll-spy target, including the opening interface. */
export const spySections = ["index", ...navItems.map((n) => n.id)];

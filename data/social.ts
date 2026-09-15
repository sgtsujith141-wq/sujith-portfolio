import type { LucideIcon } from "lucide-react";
import { Github, Linkedin, Mail, Phone, FileText } from "lucide-react";
import { profile } from "./profile";

export interface SocialLink {
  id: string;
  label: string;
  /** Mono sub-label shown in lists and the command palette. */
  handle: string;
  href: string;
  icon: LucideIcon;
  external: boolean;
}

/* Resume is appended only when a real PDF is wired up, so no affordance on
 * the site can ever point at a missing file. */
export const socials: SocialLink[] = [
  {
    id: "github",
    label: "GitHub",
    handle: "sgtsujith141-wq",
    href: "https://github.com/sgtsujith141-wq",
    icon: Github,
    external: true,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    handle: "sujith-c-3637ba388",
    href: "https://www.linkedin.com/in/sujith-c-3637ba388/",
    icon: Linkedin,
    external: true,
  },
  {
    id: "email",
    label: "Email",
    handle: profile.contact.email,
    href: `mailto:${profile.contact.email}`,
    icon: Mail,
    external: false,
  },
  {
    id: "phone",
    label: "Phone",
    handle: profile.contact.phone,
    href: profile.contact.phoneHref,
    icon: Phone,
    external: false,
  },
  ...(profile.resume.available
    ? [
        {
          id: "resume",
          label: "Resume",
          handle: profile.resume.filename,
          href: profile.resume.href,
          icon: FileText,
          external: true,
        } satisfies SocialLink,
      ]
    : []),
];

/** Always present, even when the resume is not — used for direct links. */
export const githubProfile = "https://github.com/sgtsujith141-wq";
export const linkedinProfile = "https://www.linkedin.com/in/sujith-c-3637ba388/";

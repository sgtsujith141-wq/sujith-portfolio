/* ══════════════════════════════════════════════════════════════════════
 *  PROFILE — identity, contact and document links.
 *
 *  Every contact detail on the site resolves from this file. Facts here
 *  were supplied by Sujith directly (resume, earlier sessions) or read
 *  from the public GitHub profile. Nothing is inferred.
 * ══════════════════════════════════════════════════════════════════════ */

/* Hosts and CI frequently define variables as *blank* rather than unset,
 * and `??` only falls back on undefined. Treat blank as absent. */
const env = (value: string | undefined): string | undefined => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

const RESUME_FILENAME = "Sujith_C_Resume.pdf";
const resumeEnv = env(process.env.NEXT_PUBLIC_RESUME_URL);

export const profile = {
  name: "Sujith C",
  displayName: "SUJITH C",
  role: "Computer Science & Engineering Student",
  /** One grounded line. The hero renders `headline` from content/identity.ts. */
  statement:
    "Second-year CSE student in Bengaluru. I run a Debian server at home, take systems apart to see how they work, and build software I can hand to someone else.",
  location: "Bengaluru, India",

  education: {
    institution: "BMS Institute of Technology and Management",
    short: "BMSIT",
    location: "Bengaluru",
    programme: "Computer Science & Engineering",
    year: "2nd year",
    /** As stated on the resume. */
    cgpa: "8.2",
    cgpaScale: "10",
  },

  /** Rendered letter by letter in the opening sequence. */
  disciplines: ["NETWORKING", "CYBERSECURITY", "SYSTEMS"],

  /** Short labels for the hero rail. The full model is content/identity.ts. */
  interests: [
    "Networking",
    "Cybersecurity",
    "Computer systems",
    "Linux",
    "Servers & self-hosting",
    "AI & useful software",
  ],

  links: {
    github: "https://github.com/sgtsujith141-wq",
    githubHandle: "sgtsujith141-wq",
    linkedin: "https://www.linkedin.com/in/sujith-c-3637ba388/",
    linkedinHandle: "sujith-c-3637ba388",
  },

  contact: {
    email: env(process.env.NEXT_PUBLIC_CONTACT_EMAIL) ?? "sgt.sujith.141@gmail.com",
    /** Not shown unless supplied through the environment. */
    phone: env(process.env.NEXT_PUBLIC_CONTACT_PHONE),
  },

  resume: {
    href: resumeEnv && resumeEnv !== "off" ? resumeEnv : `/${RESUME_FILENAME}`,
    filename: RESUME_FILENAME,
    /** "off" hides every Resume affordance without touching components. */
    available: resumeEnv !== "off",
  },

  meta: {
    title: "Sujith C — Networks, Systems & Self-Hosting",
    description:
      "Computer Science & Engineering student exploring networking, cybersecurity, Linux and infrastructure. A Debian home lab, security tooling and useful software, with verified engineering evidence.",
    url: env(process.env.NEXT_PUBLIC_SITE_URL) ?? "https://sujith-portfolio-two.vercel.app",
  },
} as const;

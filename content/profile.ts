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
  statement:
    "Building at the intersection of cybersecurity, AI and software systems.",
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

  interests: [
    "Cybersecurity",
    "Artificial intelligence",
    "Software engineering",
    "Systems engineering",
    "Building useful software",
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
    title: "Sujith C — Cybersecurity, AI & Software Systems",
    description:
      "Computer Science & Engineering student building at the intersection of cybersecurity, AI and software systems. CryptoDrishti, SurakshaScore and Aether Health, with verified engineering evidence.",
    url: env(process.env.NEXT_PUBLIC_SITE_URL) ?? "https://sujith-portfolio-two.vercel.app",
  },
} as const;

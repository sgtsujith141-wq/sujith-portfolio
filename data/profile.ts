/* ------------------------------------------------------------------ *
 *  PROFILE — identity, education, contact and document links.
 *  Every contact detail on the site resolves from this file. Nothing is
 *  hard-coded into a component.
 * ------------------------------------------------------------------ */

/* Environment variables are frequently *defined but blank* on hosts and CI
 * (Vercel project settings, GitHub Actions, Docker `--env`). `??` only falls
 * back on undefined, so a blank value would sail through and, in the case of
 * the site URL, crash `new URL()` during the build. Treat blank as absent. */
const env = (value: string | undefined): string | undefined => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

/** The real PDF lives at public/Sujith_C_Resume.pdf, so it is served from
 *  /Sujith_C_Resume.pdf. Set this back to false if the file is ever removed
 *  and every Resume affordance hides itself rather than 404ing. */
const RESUME_PDF_PRESENT = true;

const RESUME_FILENAME = "Sujith_C_Resume.pdf";

const RESUME_URL = env(process.env.NEXT_PUBLIC_RESUME_URL) ?? `/${RESUME_FILENAME}`;

export const profile = {
  name: "Sujith C",
  /** Rendered letter-by-letter in the intro and the opening interface. */
  displayName: "SUJITH C",
  disciplines: ["CYBERSECURITY", "SYSTEMS", "SOFTWARE"],
  role: "Computer Science & Engineering student",
  location: "Bengaluru, India",

  /** One grounded sentence. Opening interface. */
  statement:
    "I am a second-year computer science engineering student at BMSIT, working through cybersecurity, systems and networking the practical way — running my own Debian server, taking operating systems apart, and building software that is actually useful.",

  education: {
    institution: "BMS Institute of Technology and Management",
    short: "BMSIT",
    location: "Bengaluru",
    programme: "Computer Science & Engineering",
    year: "2nd Year",
    status: "In progress",
    /** As stated on the resume. Leave blank and the card omits the figure. */
    cgpa: "8.2",
    cgpaScale: "10",
  },

  /** About section. Short, plain, first-person. */
  about: [
    "I am a second-year CSE student at BMSIT in Bengaluru. Most of what I know outside coursework came from breaking something on my own machine and then having to fix it.",
    "That started with installing operating systems, moved into dual boot and multiboot setups, and ended up as a Debian 12 box in my house that runs media, file storage and a Minecraft server, reachable from anywhere over Tailscale.",
    "Cybersecurity is the direction I am heading, and it is where most of what I build now points. Right now that means fundamentals — how networks actually move packets, how Linux permissions and services work, how systems fail. I would rather understand the layer underneath than collect tool names.",
  ],

  /** Small honest detail. Used once, as a footnote. */
  detail: {
    label: "TYPING",
    value: "126",
    unit: "WPM",
  },

  contact: {
    email: env(process.env.NEXT_PUBLIC_CONTACT_EMAIL) ?? "sgt.sujith.141@gmail.com",
    /** Display form. `phoneHref` is the dialable form. */
    phone: "+91 70221 34144",
    phoneHref: "tel:+917022134144",
  },

  resume: {
    href: RESUME_URL,
    filename: RESUME_FILENAME,
    /** When false, every Resume button and palette action is hidden. */
    available: RESUME_PDF_PRESENT || Boolean(env(process.env.NEXT_PUBLIC_RESUME_URL)),
  },

  meta: {
    title: "Sujith C — Cybersecurity, Systems, Software",
    description:
      "Second-year CSE student at BMSIT focused on cybersecurity, systems and networking. Self-hosted Debian infrastructure, security tooling, and useful software.",
    url: env(process.env.NEXT_PUBLIC_SITE_URL) ?? "https://sujithc.dev",
  },
} as const;

/** Convenience alias — several components only need the address. */
export const contactEmail = profile.contact.email;

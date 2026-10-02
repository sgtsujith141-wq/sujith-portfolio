/* ══════════════════════════════════════════════════════════════════════
 *  Every fact on the site lives in this file. Components hold no facts.
 *
 *  Sources: each repository README (re-checked 2 Oct 2026) and Sujith's
 *  own answers. CONTENT-SOURCES.md maps every line back to its source.
 * ══════════════════════════════════════════════════════════════════════ */

const GH = "https://github.com/sgtsujith141-wq/";

export const site = {
  name: "Sujith C",
  url: "https://sujith-portfolio-two.vercel.app",
  resume: "/Sujith_C_Resume.pdf",
  resumeFile: "Sujith_C_Resume.pdf",
  title: "Sujith C — Computer Science student, cybersecurity",
  description:
    "Second-year Computer Science & Engineering student at BMS Institute of Technology & Management, Bengaluru. Security projects, each explained. Looking for cybersecurity internships.",
  checked: "Project details checked against the repositories, 2 Oct 2026.",
} as const;

export const hero = {
  status: "Open to cybersecurity internships",
  /** Rendered with "Computer Science & Engineering" emphasised. */
  whoBefore: "Second-year ",
  whoStrong: "Computer Science & Engineering",
  whoAfter:
    " student at BMS Institute of Technology & Management, Bengaluru, working mainly in cybersecurity, AI and systems.",
  hintPointer: "Move across the page to decrypt the background. Click to send a pulse.",
  hintTouch: "Tap anywhere to send a pulse through the background.",
} as const;

export const about = {
  paragraphs: [
    "I'm a computer science and engineering student working mainly in cybersecurity, AI and systems. I like building small, practical tools and taking them far enough to actually run, then documenting honestly what works and what doesn't yet.",
    "Most of what I build sits between security and everyday usability: tools that surface a real risk clearly, instead of producing a number nobody can explain.",
  ],
  education: [
    { k: "College", v: "BMS Institute of Technology & Management, Bengaluru" },
    { k: "Programme", v: "Computer Science & Engineering" },
    { k: "Year", v: "Second year, third semester" },
  ],
  exploring: [
    "Post-quantum cryptography, and how to inventory crypto assets in real codebases",
    "Making security scoring explainable rather than opaque",
    "Practical uses of AI in small, self-contained applications",
    "Linux systems and networking fundamentals",
  ],
} as const;

export type SkillColumn = { h: string; note?: string; items: { name: string; note?: string }[] };

export const skillsIntro =
  "What I know today, rated honestly. I'm still at the basics with each language and learning more with every project.";

export const skills: SkillColumn[] = [
  { h: "Languages", note: "basics", items: [{ name: "C" }, { name: "C++" }, { name: "Python" }, { name: "HTML" }] },
  {
    h: "Systems & tools",
    items: [
      { name: "Linux (Debian)", note: "home server" },
      { name: "Git & GitHub" },
      { name: "Tailscale", note: "private networking" },
      { name: "CasaOS", note: "server management" },
    ],
  },
  { h: "Design & productivity", items: [{ name: "Photoshop" }, { name: "CorelDRAW" }, { name: "Microsoft Office" }] },
];

export const events = [
  {
    name: "Avinya 2.0",
    chip: "National level",
    meta: "Team of 4",
    text: "Built Aether Health, an AI-assisted personal health companion prototype.",
  },
  {
    name: "Smart India Hackathon 2026",
    chip: "College round · shortlisted",
    meta: "Team of 6 · Top 50 of 200 teams",
    text: "Shortlisted in the internal round at my college, placing in the top 50 of 200 teams. Built CryptoDrishti (problem statement SIH26164), SurakshaScore and SecureMailScope (problem statement SIH26159) for it. Both problem statements came from the National Technical Research Organisation.",
  },
] as const;

export const contact = {
  lead: "I'm looking for a cybersecurity internship, in Bengaluru or remote. Email is the fastest way to reach me.",
  email: "sgt.sujith.141@gmail.com",
  linkedin: { href: "https://www.linkedin.com/in/sujith-c-3637ba388/", label: "sujith-c-3637ba388" },
  github: { href: "https://github.com/sgtsujith141-wq", label: "sgtsujith141-wq" },
} as const;

/* ───────────────────────────── projects ───────────────────────────── */

export type Visual = "finds" | "mosca" | "model" | "mailcap" | "arch";

export type Shot = { src: string; w: number; h: number; caption: string };

export type Project = {
  slug: string;
  name: string;
  status: { label: string; live: boolean };
  ctx: string;
  /** One line, used in the explorer list. */
  one: string;
  /** Short paragraph on the home card. */
  card: string;
  what: string;
  why: string;
  how: string[];
  visuals: Visual[];
  decisions: { t: string; d: string; tr: string }[];
  checked?: string;
  tags: string[];
  limits: string[];
  links: { label: string; href: string }[];
  shots: Shot[];
};

export const projectsIntro =
  "Every project, explained: what it is, why I built it, how it works, the decisions behind it, and what it doesn't do yet.";
export const workIntro = "What each one is, in a few lines. Open a card, or read every project explained in full.";

export const projects: Project[] = [
  {
    slug: "cryptodrishti",
    name: "CryptoDrishti",
    status: { label: "Working prototype", live: true },
    ctx: "Smart India Hackathon 2026 · Problem statement SIH26164 (NTRO) · Team Zero-Day",
    one: "Finds the cryptography an organisation uses and flags what a quantum computer would break.",
    card: "Scans code, dependencies, binaries, certificates, configuration, containers and live servers for cryptography, rates how exposed each item is to future quantum attacks, and names a post-quantum replacement.",
    what: "A tool that builds an inventory of every cryptographic algorithm an organisation uses, works out which ones a future quantum computer would break and how urgently, and recommends the standard post-quantum replacement for each one.",
    why: "In 2024 NIST published the first post-quantum cryptography standards. But an organisation cannot replace cryptography it cannot find, and it is spread across source code, libraries, compiled programs, certificates, configuration files and live servers. Data stolen today can be stored and decrypted later, once quantum computers exist, so for long-lived secrets the risk has already started.",
    how: [
      "Seven separate scanners look at source code, dependencies, compiled binaries, certificates, configuration files, container images and live TLS endpoints.",
      "Every hit is grouped into one asset, so the same algorithm found in 800 places becomes one item to fix, with 800 locations attached.",
      "Each asset gets a risk score based on Mosca's inequality: how long the data must stay secret, plus how long migration takes, against when a quantum computer might arrive.",
      "For each asset it recommends a specific NIST post-quantum replacement suited to how the algorithm is used.",
      "The results are exported as a CycloneDX CBOM (a standard cryptography bill of materials) and shown in a web console that works offline.",
    ],
    visuals: ["finds", "mosca"],
    decisions: [
      {
        t: "Quantum arrival is a range, not a date",
        d: "Nobody knows the year a quantum computer will break RSA, so the tool models it as a range of years and reports a probability instead of pretending to know.",
        tr: "Trade-off: a probability is harder to read at a glance than a single date.",
      },
      {
        t: "Every score can be checked by hand",
        d: "The risk score is simple multiplication of named factors, each shown beside its input, so a reviewer can follow exactly where a number came from.",
        tr: "Trade-off: it is less tuned than a trained model, but no real-world training data exists for this.",
      },
      {
        t: '"Unknown" is an allowed answer',
        d: "If the evidence does not show what an algorithm is used for, the tool says so and does not recommend a replacement it cannot justify.",
        tr: "Trade-off: some findings need a person to classify them.",
      },
      {
        t: "The console needs no internet",
        d: "The web console uses no frameworks and no downloads, because this kind of tool is often run on isolated, air-gapped networks.",
        tr: "Trade-off: more code to write by hand.",
      },
    ],
    checked:
      "A pytest suite runs in CI on Python 3.11, 3.12 and 3.13, and every exported CBOM is checked against the official CycloneDX schema.",
    tags: ["Python", "FastAPI", "SQLite", "pytest", "CycloneDX", "GitHub Actions"],
    limits: [
      "Deep code analysis works for Python only; other languages use simpler pattern rules.",
      "Only Linux (ELF) binaries can be analysed.",
      "Does not connect to cloud key stores or hardware security modules.",
      "Has not been independently reviewed by a cryptographer.",
    ],
    links: [
      { label: "Source code", href: GH + "cryptodrishti" },
      { label: "Demo video", href: "https://youtu.be/ozoNwGR3Iq8" },
    ],
    shots: [
      { src: "/projects/cryptodrishti/04-inventory.png", w: 3360, h: 3520, caption: "Inventory: every cryptographic asset found in the demo scan." },
      { src: "/projects/cryptodrishti/01-assessment.png", w: 3360, h: 2100, caption: "Assessment of the demo estate." },
      { src: "/projects/cryptodrishti/03-migration-plan.png", w: 3360, h: 2100, caption: "Migration plan." },
    ],
  },
  {
    slug: "surakshascore",
    name: "SurakshaScore",
    status: { label: "Working prototype", live: true },
    ctx: "Smart India Hackathon 2026 · Web app and Android app",
    one: "A personal security checkup that explains every point of its score.",
    card: "Checks your device, accounts and privacy settings and turns them into one score out of 100. Every point comes with a reason, and anything it cannot verify is shown as unverified instead of guessed.",
    what: "A personal digital-safety scanner. It looks at your device, apps, network, accounts and habits, and produces one score from 0 to 100, with a plain explanation of why each point was gained or lost and what to do about it.",
    why: 'Most consumer security apps show a score with no explanation, mix checked facts with guesses, and quietly mark something as "fine" when they simply could not check it. The user has no way to tell which parts are real.',
    how: [
      "Five collectors gather signals about the device, installed apps, network, accounts and habits.",
      'Each signal is labelled with how trustworthy it is, from checked by the hardware down to "the user told us", and less trustworthy signals count for less.',
      'A rules engine turns the signals into findings, such as "no screen lock" or "password found in a known breach".',
      "A scoring function turns the findings into a score out of 100, with a breakdown by category. An open critical problem caps the score at 79, so a serious issue can never hide behind a good average.",
      "Each finding is explained using written templates, not an AI model, so the advice is always predictable and testable.",
    ],
    visuals: ["model"],
    decisions: [
      {
        t: "Every signal carries its source",
        d: "The trust level travels with each signal all the way to the screen, so something the user self-reported can never be shown as if it had been verified.",
        tr: "Trade-off: more code for each check.",
      },
      {
        t: "No AI writing security advice",
        d: "An AI model can give confident, wrong advice, and it cannot be tested reliably. Written templates can.",
        tr: "Trade-off: the wording is plainer, and every finding needs its own template.",
      },
      {
        t: "Password checks never send the password",
        d: "The breach check hashes the password on the device and sends only the first five characters of the hash to Have I Been Pwned (k-anonymity).",
        tr: "Trade-off: the phone has to filter a larger response itself.",
      },
    ],
    checked:
      "Tests run in CI on Node 20 and 22, and one test fails the build if the scoring engine ever imports interface or platform code.",
    tags: ["TypeScript", "React", "Vite", "Tailwind", "Capacitor", "Vitest"],
    limits: [
      "The web version runs on demo data, not your real device.",
      "The Android connection to real device settings is not wired up yet.",
      "The password vault screen is a demo: it is not encrypted or saved.",
      "The suspicious-link checker uses simple rules, not a live reputation service.",
    ],
    links: [
      { label: "Source code", href: GH + "surakshascore" },
      { label: "First prototype", href: GH + "surakshascore-mvp" },
    ],
    shots: [
      { src: "/projects/surakshascore/01-posture.png", w: 522, h: 1120, caption: "Posture: the score and its breakdown." },
      { src: "/projects/surakshascore/03-issues.png", w: 522, h: 1120, caption: "Issues, each with its reason." },
      { src: "/projects/surakshascore/04-improve.png", w: 522, h: 1120, caption: "What to fix next." },
    ],
  },
  {
    slug: "securemailscope",
    name: "SecureMailScope",
    status: { label: "Working prototype", live: true },
    ctx: "Smart India Hackathon 2026 · Problem statement SIH26159 (NTRO) · Team Zero-Day",
    one: "Reads captured email traffic and reports how well it was really protected.",
    card: "Reads a packet capture of email traffic and reports how it was actually protected: TLS versions, cipher suites, forward secrecy, STARTTLS upgrades and certificates. Fully offline and passive.",
    what: "A local, passive analysis tool. It reads a PCAP or PCAPNG packet capture and reports what the bytes actually show about how email travelled: which sessions existed, which mail protocol was spoken, whether and where the session became encrypted, what was negotiated, what the certificate said, which security rules failed, and what to do about it.",
    why: "Email still carries official and enterprise communication, but most organisations cannot say which TLS versions their mail servers actually negotiated, which sessions had no forward secrecy, or whether a STARTTLS upgrade was offered and then refused. The evidence already sits in the packet captures security teams collect. Active scanners cannot answer the question either: they show what a server does for a scanner today, not what it did for real clients, and an investigator is often not allowed to touch the host at all.",
    how: [
      "Reads PCAP and PCAPNG captures, recognising the format from the file contents rather than its extension, under hard resource limits.",
      "Rebuilds every TCP session, handling reordering, retransmissions and gaps, and flags bytes that two segments disagree about instead of silently picking one.",
      "Follows the real SMTP, IMAP and POP3 conversations, including the exact packet where a STARTTLS upgrade turns plaintext into encrypted traffic, or where it was refused.",
      "Analyses the TLS handshake (negotiated version, cipher suite, key exchange and forward secrecy) and verifies certificates against RFC 5280.",
      "Applies a versioned set of security rules with standards citations, gives an explainable score for each capture and suggests specific fixes. Results come out as JSON, HTML or PDF, and in a local dashboard.",
    ],
    visuals: ["mailcap"],
    decisions: [
      {
        t: "Every value says how it was obtained",
        d: "Each observation is labelled OBSERVED, INFERRED, UNKNOWN or NOT_AVAILABLE, so a guess based on the port number can never look like a parsed conversation.",
        tr: "Trade-off: reports are longer and more cautious.",
      },
      {
        t: "A number that was not measured does not appear",
        d: "If a rule cannot be evaluated from the capture, it is left out of both sides of the score instead of being counted as a pass or a fail. Across several captures the headline is the weakest score, never an average.",
        tr: "Trade-off: there is no single tidy overall number.",
      },
      {
        t: "Completely passive and local",
        d: "The engine never opens a network connection, contacts a host from the capture, looks up a domain or sends capture contents anywhere. The app only listens on 127.0.0.1.",
        tr: "Trade-off: it cannot check whether a certificate was revoked, because that needs a network request.",
      },
      {
        t: "An independent cross-check",
        d: "TShark (the engine behind Wireshark) dissects the same captures separately, so a bug in the project's own parser cannot validate itself.",
        tr: "Trade-off: TShark becomes an extra test dependency.",
      },
    ],
    checked:
      "A pytest suite runs with lint and type checks, alongside frontend unit tests, browser end-to-end tests and dependency audits, and TShark cross-checks the packet parsing independently.",
    tags: ["Python", "Scapy", "Pydantic", "cryptography", "FastAPI", "SQLite", "React", "TypeScript"],
    limits: [
      "TLS 1.3 encrypts the certificate, so no passive tool can read it. It is reported as not available.",
      "Certificate revocation is never checked, because that would need a network request.",
      "The machine-learning risk classifier is marked not validated: it has only been measured on synthetic data.",
      "Very large captures need a lot of memory, and it has not been tested on the minimum target hardware.",
    ],
    links: [{ label: "Source code", href: GH + "securemailscope" }],
    shots: [
      { src: "/projects/securemailscope/03-findings.png", w: 1920, h: 1189, caption: "Findings workspace: each finding with its impact, standards and packets." },
      { src: "/projects/securemailscope/02-overview.png", w: 1920, h: 3333, caption: "Investigation dashboard overview." },
      { src: "/projects/securemailscope/05-session.png", w: 1920, h: 3315, caption: "A single reconstructed session." },
    ],
  },
  {
    slug: "aether-health",
    name: "Aether Health",
    status: { label: "Prototype", live: false },
    ctx: "Avinya 2.0 (national level) · Team of 4",
    one: "An AI-assisted personal health companion prototype.",
    card: "Health logging, medication tracking and medical report summaries, with an AI companion chat. Built as a team of four at Avinya 2.0. A prototype, not a medical device.",
    what: "A health companion app prototype that lets a person log their health, track medication, upload medical reports for an AI summary, and talk to an AI companion.",
    why: "The hackathon brief was a companion that could log data, track medication and make sense of medical reports, built quickly as a team.",
    how: [
      "Dashboards for vitals, symptoms, nutrition, workouts, sleep and mental wellness.",
      "Medication schedules with reminders and tracking of missed doses.",
      "Report upload: the server pulls the text out of a report and asks Gemini for a structured summary.",
      "An AI companion chat that remembers recent conversation.",
      "Screens for appointments, connected devices and outbreak information.",
    ],
    visuals: ["arch"],
    decisions: [
      {
        t: "The AI key stays on the server",
        d: "All AI requests go through the server, so the Gemini API key is never shipped to the browser, where anyone could read it.",
        tr: "Trade-off: the AI features need the server running.",
      },
      {
        t: "Two backends were kept, not merged",
        d: "The project was assembled from two earlier codebases. Merging them properly inside the hackathon window risked breaking both, so the split is documented instead.",
        tr: "Trade-off: two servers to run and a confusing first setup.",
      },
      {
        t: "No database",
        d: "Data is kept in the browser and in simple files on the demo server, which removed a lot of setup problems during the event.",
        tr: "Trade-off: data does not survive a redeploy, and real health data could never be stored this way.",
      },
    ],
    checked: "CI type-checks and builds both the client and the server. There are no automated tests yet.",
    tags: ["TypeScript", "React", "Vite", "Express", "Gemini API"],
    limits: [
      "Not a medical device. Nothing it outputs is a diagnosis.",
      "No database and no encryption, and the app says so on screen.",
      "One leftover folder from the original codebases does not build.",
      "Scanned, image-only reports cannot be read because there is no OCR.",
    ],
    links: [{ label: "Source code", href: GH + "aether-health" }],
    shots: [
      { src: "/projects/aether-health/home.png", w: 470, h: 1120, caption: "Home, with placeholder demo data." },
      { src: "/projects/aether-health/health.png", w: 470, h: 1120, caption: "Health logging." },
      { src: "/projects/aether-health/reports.png", w: 470, h: 1120, caption: "Reports." },
    ],
  },
  {
    slug: "home-lab",
    name: "Home lab",
    status: { label: "Running", live: true },
    ctx: "Personal infrastructure",
    one: "A Debian server at home, built on an old CPU.",
    card: "Runs media, file storage and a Minecraft server for friends and family. I reach it privately over Tailscale instead of exposing it to the open internet.",
    what: "A home server built from an old CPU, running Debian 12 and managed through CasaOS. Friends and family use it for media, files and a Minecraft server.",
    why: "I wanted to learn Linux and networking by running something real that other people depend on, instead of a throwaway virtual machine.",
    how: [
      "Debian 12 installed on an old CPU, with CasaOS on top to manage apps.",
      "Jellyfin serves the media library, alongside shared file storage.",
      "A Minecraft server for friends and family.",
      "Tailscale creates a private network, so I can reach the server from anywhere without opening it to the internet.",
    ],
    visuals: [],
    decisions: [],
    tags: ["Debian 12", "CasaOS", "Tailscale", "Jellyfin"],
    limits: ["A single machine with no backup plan yet."],
    links: [],
    shots: [],
  },
  {
    slug: "surakshascore-mvp",
    name: "SurakshaScore MVP",
    status: { label: "Archived", live: false },
    ctx: "First prototype, kept for the record",
    one: "The first prototype of SurakshaScore.",
    card: "The earlier version that proved the idea: a guided checkup, fix-it guides, an encrypted vault and a breach check. SurakshaScore replaced its engine.",
    what: "The first prototype of SurakshaScore, kept public as a record of where the idea started.",
    why: "It proved the product ideas quickly. SurakshaScore was then rebuilt from scratch with a proper engine underneath.",
    how: [
      "A guided security checkup.",
      "Step-by-step guides to fix each problem.",
      "An encrypted vault using PBKDF2-SHA256 and AES-GCM through the browser's Web Crypto API.",
      "A k-anonymity password breach check.",
    ],
    visuals: [],
    decisions: [],
    tags: ["TypeScript", "React", "Vite", "Supabase"],
    limits: [],
    links: [{ label: "Source code", href: GH + "surakshascore-mvp" }],
    shots: [],
  },
];

export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug);

/* ─────────────────────── data behind the interactives ─────────────────────── */

/** CryptoDrishti README, "Same algorithm, three answers". */
export const finds = [
  {
    f: "svc-payments/signing.py:15",
    p: "signature",
    m: "ML-DSA-65",
    why: "RSA-PSS padding at a call site shows the code really uses RSA to sign. A signature algorithm gets a post-quantum signature replacement.",
  },
  {
    f: "svc-gateway/transport.py:16",
    p: "key exchange",
    m: "X25519MLKEM768",
    why: "RSA-OAEP padding shows RSA is being used to wrap a key. That needs a key-exchange replacement, not a signature one.",
  },
  {
    f: "legacy/nginx.conf:5",
    p: "unknown",
    m: null,
    why: "A config file only allows RSA, but nothing shows what it is used for. The tool refuses to guess and asks for that to be resolved first.",
  },
] as const;

/** CryptoDrishti defaults (app/config.py): Q-Day earliest 2030, likely 2034, latest 2044. */
export const mosca = { fromYear: 2026, earliest: 2030, likely: 2034, latest: 2044 } as const;

/** SurakshaScore README: provenance tiers and their weights. */
export const tiers = [
  { n: "Tier 1", label: "Hardware attested", w: 1.0 },
  { n: "Tier 2", label: "OS API verified", w: 0.9 },
  { n: "Tier 3", label: "Heuristic", w: 0.75 },
  { n: "Tier 4", label: "Self-reported", w: 0.6 },
] as const;
export const criticalCap = 79;
/** Made up for the demo, and labelled as such on screen. */
export const exampleScore = 94;

/** SecureMailScope README: the seven demo captures. */
export const mailcaps = [
  { name: "01-secure-baseline", tls: "TLS 1.2", findings: 0, score: 100, text: "A sound configuration: no rule fails. The clean control matters as much as the weak cases, because a tool that only ever reports problems is not measuring anything." },
  { name: "02-weak-legacy-tls", tls: "TLS 1.0", findings: 4, score: 59, text: "Legacy TLS and a key exchange without forward secrecy: someone who records the traffic now and gets the server key later can decrypt it. Score: 100 × (37 − 15) / 37 = 59.5, rounded to 59. Two rules could not be evaluated, so they are left out of both sides." },
  { name: "03-broken-cipher", tls: "TLS 1.2", findings: 2, score: 70, text: "A current TLS version, but two rules fail in the broken-cipher case." },
  { name: "04-starttls-upgrade", tls: "TLS 1.2", findings: 0, score: 100, text: "The session started in plaintext and upgraded to TLS with STARTTLS, and the tool marks the exact packet where that happened." },
  { name: "05-starttls-refused", tls: "plaintext", findings: 1, score: 86, text: 'STARTTLS was requested and refused, so the session stayed in plaintext. It is reported as refused, not as "no TLS offered".' },
  { name: "06-tls12-certificate", tls: "TLS 1.2", findings: 0, score: 100, text: "A TLS 1.2 session where the certificate can be read and is verified." },
  { name: "07-tls13-encrypted-certificate", tls: "TLS 1.3", findings: 0, score: 100, text: "TLS 1.3 encrypts the certificate, so it is reported as not available instead of being left blank or guessed." },
] as const;

export const nav = [
  { key: "about", label: "About", href: "/#about" },
  { key: "projects", label: "Projects", href: "/projects" },
  { key: "skills", label: "Skills", href: "/#skills" },
  { key: "events", label: "Events", href: "/#events" },
  { key: "contact", label: "Contact", href: "/#contact" },
] as const;

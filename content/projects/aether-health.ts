import type { Project } from "@/lib/types";

/* Sources: github.com/sgtsujith141-wq/aether-health README at commit
 * 65533a3; client/src/App.tsx and client/src/screens counted on
 * 2026-09-18; server/src routes read on 2026-09-18; the 2026-09-17 report.
 * AI features were NOT exercised by the report and are not claimed here. */

const shots = "/projects/aether-health";

export const aetherHealth: Project = {
  slug: "aether-health",
  index: "04",
  name: "Aether Health",
  tagline: "An AI-assisted personal health companion prototype.",
  category: "Health & AI prototype",
  status: "prototype",
  statusNote: "Assembled for a hackathon from two earlier codebases. Not a medical device. Guest mode renders the whole UI with no backend.",
  repo: "https://github.com/sgtsujith141-wq/aether-health",
  stack: ["React 19", "Vite 6", "TypeScript", "Tailwind CSS 4", "Zustand", "Express", "Gemini API"],
  concepts: ["ai", "health", "product"],
  accent: "violet",
  visual: "aether",

  problem: [
    "A single place to log health data, track medications and appointments, keep records, and ask questions of a health-context assistant — built quickly enough to demonstrate the product direction.",
  ],
  solution: [
    "A React single-page app with 22 routes and 34 screen components: vitals, symptoms, nutrition, workouts, sleep and mental-wellness tracking with separate male, female and pregnancy flows; medications with reminders; a records and insurance vault; appointments.",
    "A small Express and TypeScript service holds the Gemini key and exposes two routes: chat with recent history per user, and medical-report analysis that extracts text server-side before sending it to the model.",
  ],
  howItWorks: [
    { title: "Client renders without a backend", detail: "A default guest profile ships with fixed placeholder vitals, so the interface can be demonstrated and screenshotted without a server or an API key. Every value in the screenshots is seeded demo data." },
    { title: "AI calls go through the server", detail: "/api/ai/chat and /api/ai/medical-report on port 3001. The client never sees the key; .env.example warns that anything VITE_-prefixed is compiled into the bundle." },
    { title: "Text before upload", detail: "pdf-parse extracts text from a report server-side and the extracted text is what goes to the model, so raw files are not shipped wholesale to a third party. Image-only PDFs yield nothing — there is no OCR." },
    { title: "Two backends, documented", detail: "A second Express (JavaScript) demo API on port 5000 handles auth, medications, recovery and analytics with JSON-file storage. Merging them during the build window would have risked breaking both, so the split is documented instead." },
  ],

  architecture: {
    groups: [
      { id: "client", label: "client/ — React 19 + Vite 6" },
      { id: "server", label: "server/ — Express + TypeScript · :3001" },
      { id: "backend", label: "backend/ — Express JavaScript · :5000" },
      { id: "external", label: "External" },
    ],
    nodes: [
      { id: "ui", label: "22 routes · 34 screens", detail: "Vitals, meds, reports, appointments; male, female and pregnancy flows.", group: "client" },
      { id: "state", label: "Zustand + localStorage", detail: "The only persistence. Nothing survives a redeploy.", group: "client" },
      { id: "api", label: "lib/api.ts", detail: "AI calls through the Vite dev proxy; health-data calls to an absolute URL on :5000. Both read VITE_API_URL — leave it unset locally.", group: "client", caveat: "Routing trap documented in the README" },
      { id: "ai-routes", label: "/api/ai/chat · /api/ai/medical-report", detail: "The two AI routes.", group: "server" },
      { id: "ai-service", label: "ai.service · medicalReportAnalysis.service", detail: "pdf-parse and Multer; text extracted before it reaches the model.", group: "server" },
      { id: "auth", label: "JWT auth", detail: "bcrypt, JSON-file user records. Demo-grade.", group: "backend", caveat: "Demo-grade authentication" },
      { id: "rest", label: "medications · recovery · analytics", detail: "REST routes over local JSON files.", group: "backend" },
      { id: "gemini", label: "Google Gemini", detail: "Requires GEMINI_API_KEY. No CI job calls it; AI features were not exercised in the verification report.", group: "external", caveat: "Not verified" },
      { id: "orphan", label: "mediscan-ai/", detail: "Leftover fragment of a removed Next.js app. A single file whose import does not resolve.", group: "external", caveat: "Does not build" },
    ],
    edges: [
      { from: "ui", to: "state" },
      { from: "ui", to: "api" },
      { from: "api", to: "ai-routes", label: "Vite dev proxy" },
      { from: "api", to: "auth", label: "absolute URL :5000" },
      { from: "ai-routes", to: "ai-service" },
      { from: "ai-service", to: "gemini" },
      { from: "auth", to: "rest" },
    ],
  },

  evidence: [
    { label: "Client typecheck", value: "0 errors", note: "build: 2,782 modules" },
    { label: "Server typecheck · build", value: "Pass", note: "CI on Node 20" },
    { label: "Routes · screens", value: "22 · 34", note: "counted in client/src" },
    { label: "Tests", value: "None", note: "stated in the README" },
  ],

  verification: [
    { claim: "22 routes and 34 screen components", source: "client/src/App.tsx and client/src/screens/", date: "2026-09-18", method: "Route elements and .tsx files counted" },
    { claim: "Two AI routes: /chat and /medical-report", source: "server/src", date: "2026-09-18", method: "Router definitions read with grep" },
    { claim: "Client and server typecheck and build pass; guest mode renders with no console errors", source: "2026-09-17 engineering report and CI for commit 65533a3", date: "2026-09-18", method: "Report figures; latest CI run conclusion read through the GitHub API" },
    { claim: "Nothing is encrypted and the UI says so; clinician and user imagery is generated locally as SVG initials", source: "README and client/src/lib/placeholderAvatar.ts", date: "2026-09-18", method: "README section and file presence checked" },
  ],

  decisions: [
    {
      title: "AI calls are routed through the server, not the browser",
      body: "server/ holds the Gemini key and exposes /api/ai/*; the client never sees it.",
      tradeoff: "The AI features cannot work in a purely static deployment.",
    },
    {
      title: "Guest mode renders the whole UI with no backend",
      body: "The interface can be demonstrated without standing up either server or paying for an API key.",
      tradeoff: "Seeded demo data looks like real data, which is why the screenshots are labelled and the vitals on them mean nothing.",
    },
    {
      title: "No database, deliberately",
      body: "For a prototype that had to run anywhere, removing the database removed an entire class of setup failure.",
      tradeoff: "Nothing survives a redeploy, there is no sync, and it is a hard blocker on this ever holding real health information.",
    },
    {
      title: "Honest labels over implied security",
      body: "The interface previously claimed AES-256-GCM, biometric validation and end-to-end encryption. None of it was implemented. Those strings now read “Demo — Not Secured”, “Storage: This browser only” and “Encryption: Not implemented”, and the privacy modal discloses that AI input goes to a third-party model.",
      tradeoff: "The labels are now honest; the storage is not more secure than before.",
    },
  ],

  limitations: [
    "Not a medical device. Nothing here is a diagnosis; the report analysis and chat features are informational and not validated on medical data.",
    "No database and demo-grade authentication. Do not put real personal health information into it.",
    "Two backends overlap and are not unified; mediscan-ai/ does not build; the root db:push and db:seed scripts are broken leftovers.",
    "Nothing is encrypted. The UI now states this rather than claiming otherwise.",
    "Scenery imagery on workout and relaxation screens still hotlinks Unsplash. Fictional clinicians and users are locally generated initials, not photographs.",
    "AI features need a valid Gemini key and were not exercised in the verification report.",
  ],

  screenshots: [
    { src: `${shots}/home.png`, alt: "Aether Health home screen in guest mode with seeded demo vitals", width: 470, height: 1120, caption: "Home — guest mode, seeded demo data" },
    { src: `${shots}/health.png`, alt: "Health tracking screen with demo values", width: 470, height: 1120, caption: "Health — logging and dashboards" },
    { src: `${shots}/reports.png`, alt: "Records screen for uploaded medical reports", width: 470, height: 1120, caption: "Records — report upload and summaries" },
    { src: `${shots}/vault.png`, alt: "Health Vault screen stating that storage is browser-only and not encrypted", width: 470, height: 1120, caption: "Vault — states plainly that nothing is encrypted" },
  ],
};

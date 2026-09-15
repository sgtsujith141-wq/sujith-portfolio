import type { Hackathon } from "@/lib/types";

/* ------------------------------------------------------------------ *
 *  HACKATHONS
 *
 *  Only what actually happened. No placements, awards, rankings, team
 *  sizes, project names or dates unless they are known — the layout reads
 *  fine without any of them.
 *
 *  Add a new event by appending an object. Newest first.
 * ------------------------------------------------------------------ */

export const hackathons: Hackathon[] = [
  {
    id: "sih-internal",
    name: "Smart India Hackathon",
    scale: "Internal College Round — BMSIT",
    date: "",
    location: "BMS Institute of Technology and Management, Bengaluru",
    role: "Winner",
    detail:
      "Won the internal college round of the Smart India Hackathon at BMSIT, the selection stage that colleges run to choose the teams they put forward.",
    facts: ["Won", "Internal round", "BMSIT"],
  },
  {
    id: "avinya-2",
    name: "Avinya 2.0",
    scale: "National Level Hackathon",
    date: "",
    location: "",
    role: "Participant",
    detail:
      "Took part in Avinya 2.0, a national level hackathon — a fixed deadline and the experience of building something under real time pressure rather than at coursework pace.",
    facts: ["Attended", "National level"],
  },
];

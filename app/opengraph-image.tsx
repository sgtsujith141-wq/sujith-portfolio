import { ImageResponse } from "next/og";
import { profile, tagline } from "@/content/personal";

export const alt = `${profile.name} — ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* Drawn with the same graph motif as the site: a root node with its four
 * project nodes. System fonts only, so the route stays dependency-free. */
export default function OpenGraphImage() {
  const nodes = [
    { x: 880, y: 200, c: "#3fd2f0" },
    { x: 1040, y: 330, c: "#4f7cff" },
    { x: 900, y: 470, c: "#8b7cf6" },
    { x: 760, y: 340, c: "#7d8799" },
  ];
  const root = { x: 900, y: 330 };
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#090b0f",
          color: "#e8ecf2",
          fontFamily: "Helvetica, Arial, sans-serif",
          position: "relative",
        }}
      >
        <svg width="1200" height="630" style={{ position: "absolute", inset: 0 }}>
          {nodes.map((n, i) => (
            <line key={i} x1={root.x} y1={root.y} x2={n.x} y2={n.y} stroke="#2a3140" strokeWidth="2" />
          ))}
          {nodes.map((n, i) => (
            <circle key={`c${i}`} cx={n.x} cy={n.y} r="9" fill={n.c} />
          ))}
          <circle cx={root.x} cy={root.y} r="16" fill="#4f7cff" />
          <circle cx={root.x} cy={root.y} r="30" stroke="#4f7cff" strokeOpacity="0.4" strokeWidth="2" fill="none" />
        </svg>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "72px 80px" }}>
          <div style={{ fontSize: 22, letterSpacing: 6, color: "#7d8799", textTransform: "uppercase" }}>
            Portfolio
          </div>
          <div style={{ fontSize: 118, fontWeight: 600, letterSpacing: -4, marginTop: 12, lineHeight: 1 }}>
            {profile.displayName}
          </div>
          <div style={{ fontSize: 30, color: "#a3adbf", marginTop: 26, maxWidth: 760 }}>
            {`${profile.role}, BMSIT. ${tagline}`}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}

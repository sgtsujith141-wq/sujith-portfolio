import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${profile.name} — ${profile.disciplines.join(" · ")}`;

/* Static social card, generated once at build time. Kept to flat shapes and
 * system-metric text so it needs no font fetch. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#08090c",
          padding: 72,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 40,
            border: "1px solid #262c36",
            display: "flex",
          }}
        />
        <div style={{ position: "absolute", left: 40, top: 40, width: 28, height: 2, background: "#45d4ee", display: "flex" }} />
        <div style={{ position: "absolute", left: 40, top: 40, width: 2, height: 28, background: "#45d4ee", display: "flex" }} />
        <div style={{ position: "absolute", right: 40, bottom: 40, width: 28, height: 2, background: "#45d4ee", display: "flex" }} />
        <div style={{ position: "absolute", right: 40, bottom: 40, width: 2, height: 28, background: "#45d4ee", display: "flex" }} />

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 8, height: 8, borderRadius: 8, background: "#45d4ee", display: "flex" }} />
          <div style={{ color: "#5b616e", fontSize: 22, letterSpacing: 6, display: "flex" }}>
            SECURE SESSION
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              color: "#e9ebef",
              fontSize: 132,
              letterSpacing: -4,
              lineHeight: 1,
              display: "flex",
            }}
          >
            {profile.displayName}
          </div>
          <div
            style={{
              marginTop: 34,
              color: "#939aa6",
              fontSize: 26,
              letterSpacing: 5,
              display: "flex",
            }}
          >
            {profile.disciplines.join("   •   ")}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", color: "#5b616e", fontSize: 20, letterSpacing: 3 }}>
          <div style={{ display: "flex" }}>CSE STUDENT · {profile.location.toUpperCase()}</div>
          <div style={{ display: "flex", color: "#45d4ee" }}>ACCESS GRANTED</div>
        </div>
      </div>
    ),
    size,
  );
}

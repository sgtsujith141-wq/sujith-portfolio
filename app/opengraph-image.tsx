import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = "Sujith C — Computer Science student, cybersecurity";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* Same monochrome system as the site: a faint hex grid, the name, one line. */
async function font(family: string, weight: number, text: string) {
  try {
    const css = await (await fetch(`https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&text=${encodeURIComponent(text)}`)).text();
    const url = css.match(/src: url\((.+?)\) format/)?.[1];
    if (!url) return null;
    return await (await fetch(url)).arrayBuffer();
  } catch {
    return null;
  }
}

export default async function OpenGraphImage() {
  const line = "CSE student · BMS Institute of Technology & Management · cybersecurity, AI and systems";
  const status = "Open to cybersecurity internships";
  const doto = await font("Doto", 900, "SUJITH C");
  const mono = await font("JetBrains+Mono", 500, line + status + site.url + "_");
  const hex = "0123456789ABCDEF";
  let seed = 7;
  const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
  const cells: { x: number; y: number; c: string; o: number }[] = [];
  for (let y = 0; y < 630; y += 30)
    for (let x = 0; x < 1200; x += 30) if (rnd() > 0.56) cells.push({ x, y, c: hex[(rnd() * 16) | 0] ?? "0", o: 0.05 + rnd() * 0.08 });
  const fonts = [
    ...(doto ? [{ name: "Doto", data: doto, weight: 900 as const }] : []),
    ...(mono ? [{ name: "JB", data: mono, weight: 500 as const }] : []),
  ];
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#0b0b0c", color: "#ecece8", position: "relative", fontFamily: mono ? "JB" : "monospace" }}>
        {cells.map((c, i) => (
          <div key={i} style={{ position: "absolute", left: c.x + 9, top: c.y + 4, fontSize: 16, color: `rgba(236,236,232,${c.o.toFixed(3)})` }}>
            {c.c}
          </div>
        ))}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "72px 80px", width: "100%", background: "linear-gradient(90deg, rgba(11,11,12,.95), rgba(11,11,12,.6))" }}>
          <div style={{ display: "flex", alignItems: "center", fontSize: 24, color: "#9b9b96" }}>
            <div style={{ width: 12, height: 12, background: "#ffffff", marginRight: 16 }} />
            {status}
          </div>
          <div style={{ fontSize: 170, fontFamily: doto ? "Doto" : "monospace", fontWeight: 900, lineHeight: 1, marginTop: 24, color: "#ffffff" }}>SUJITH C</div>
          <div style={{ fontSize: 26, color: "#cfcfca", marginTop: 34, maxWidth: 1000 }}>{line}</div>
          <div style={{ display: "flex", marginTop: 40, paddingTop: 22, borderTop: "1px solid #36363b", fontSize: 22, color: "#82827d" }}>{site.url.replace("https://", "")}</div>
        </div>
      </div>
    ),
    { ...size, fonts: fonts.length ? fonts : undefined },
  );
}

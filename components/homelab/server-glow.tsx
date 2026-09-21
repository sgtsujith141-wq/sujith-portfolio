"use client";

import { useId, useState } from "react";
import { homelab, serviceById } from "@/content/homelab";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

/* ══════════════════════════════════════════════════════════════════════
 *  THE SERVER
 *
 *  A compact, atmospheric version of the home lab for the home page: one
 *  machine breathing quietly in the middle, four services hanging off it,
 *  and traffic drifting down the links. Pointing at a service tells you
 *  what it is in one line.
 *
 *  The full stack — every layer, what was configured, what it taught him
 *  — lives in the case study at /work/home-lab. This is the personal
 *  version, not the infrastructure presentation.
 *
 *  No metrics of any kind, live or otherwise: nothing here is measured.
 * ══════════════════════════════════════════════════════════════════════ */

const W = 520;
const H = 300;
const CX = W / 2;
const CY = 128;

/** The four things it actually does, in the order they read best. */
const SPOKES = [
  { id: "tailscale", label: "Remote access", x: 60, y: 252, colour: "#3fd2f0" },
  { id: "storage", label: "Storage", x: 212, y: 268, colour: "#40c4be" },
  { id: "jellyfin", label: "Media", x: 340, y: 268, colour: "#8b7cf6" },
  { id: "minecraft", label: "Game server", x: 470, y: 252, colour: "#4f7cff" },
] as const;

export function ServerGlow() {
  const [active, setActive] = useState<string | null>(null);
  const reduced = useReducedMotion();
  const id = useId();
  const current = active ? serviceById[active] : undefined;

  return (
    <figure>
      <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="presentation">
        <defs>
          <radialGradient id={`${id}-halo`}>
            <stop offset="0%" stopColor="#4f7cff" stopOpacity="0.4" />
            <stop offset="55%" stopColor="#4f7cff" stopOpacity="0.09" />
            <stop offset="100%" stopColor="#4f7cff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* The machine's glow. Breathes slowly; still under reduced motion. */}
        <circle
          cx={CX}
          cy={CY}
          r="118"
          fill={`url(#${id}-halo)`}
          className={reduced ? undefined : "server-breathe"}
        />

        {/* Links down to the services */}
        {SPOKES.map((s, i) => {
          const on = active === s.id;
          const d = `M${CX},${CY + 34} C${CX},${CY + 92} ${s.x},${s.y - 76} ${s.x},${s.y - 20}`;
          return (
            <g key={s.id}>
              <path
                d={d}
                fill="none"
                stroke={on ? s.colour : "#232936"}
                strokeWidth={on ? 1.6 : 1}
                className="t-slow"
              />
              {!reduced ? (
                <path
                  d={d}
                  fill="none"
                  stroke={s.colour}
                  strokeWidth="1.8"
                  strokeOpacity={on ? 0.95 : 0.5}
                  className="edge-traffic"
                  style={{ animationDelay: `${i * 1.15}s`, animationDuration: "5.5s" }}
                />
              ) : null}
            </g>
          );
        })}

        {/* The machine */}
        <g>
          <rect
            x={CX - 74}
            y={CY - 34}
            width="148"
            height="68"
            rx="7"
            fill="#0e1116"
            stroke="#2a3140"
          />
          {/* drive bays */}
          {[0, 1, 2].map((i) => (
            <rect
              key={i}
              x={CX - 62}
              y={CY - 22 + i * 15}
              width="92"
              height="9"
              rx="2"
              fill="#131720"
              stroke="#1c212b"
            />
          ))}
          {/* status lamp */}
          <circle
            cx={CX + 52}
            cy={CY - 14}
            r="3"
            fill="#40c4be"
            className={reduced ? undefined : "animate-pulse-dot"}
          />
          <text
            x={CX}
            y={CY + 54}
            textAnchor="middle"
            fill="#a3adbf"
            style={{ font: "500 10px var(--font-geist-mono), monospace", letterSpacing: "0.16em" }}
          >
            DEBIAN 12 · CASAOS
          </text>
        </g>

        {/* Service nodes */}
        {SPOKES.map((s) => {
          const on = active === s.id;
          return (
            <g key={`n-${s.id}`}>
              {on ? <circle cx={s.x} cy={s.y - 20} r="13" fill={s.colour} fillOpacity="0.14" /> : null}
              <circle
                cx={s.x}
                cy={s.y - 20}
                r={on ? 5.5 : 4}
                fill={on ? s.colour : "#464e5c"}
                className="t-slow"
              />
            </g>
          );
        })}
      </svg>

      {/* Real buttons over the service nodes */}
      <div className="absolute inset-0">
        {SPOKES.map((s) => (
          <button
            key={s.id}
            type="button"
            aria-pressed={active === s.id}
            onMouseEnter={() => setActive(s.id)}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(s.id)}
            onBlur={() => setActive(null)}
            onClick={() => setActive((c) => (c === s.id ? null : s.id))}
            className={cn(
              "mono absolute -translate-x-1/2 whitespace-nowrap rounded-full border px-2.5 py-1.5 text-[10.5px] leading-none tracking-[0.08em] t-base",
              active === s.id
                ? "border-transparent bg-elevate text-ink"
                : "border-line-soft bg-base/70 text-faint hover:border-line-strong hover:text-ink",
            )}
            style={{ left: `${(s.x / W) * 100}%`, top: `${(s.y / H) * 100}%` }}
          >
            {s.label}
          </button>
        ))}
      </div>
      </div>

      <figcaption
        aria-live="polite"
        className="mt-5 min-h-[2.75rem] text-sm leading-relaxed text-muted"
      >
        {current ? current.what : homelab.diagramNote}
      </figcaption>
    </figure>
  );
}

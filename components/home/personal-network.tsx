"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, CornerDownRight } from "lucide-react";
import { domains } from "@/content/identity";
import { serviceById } from "@/content/homelab";
import { projectBySlug } from "@/content/projects";
import { useLivingSystem } from "@/components/canvas/living-system";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { DomainId } from "@/lib/types";
import { cn } from "@/lib/utils";

/* ══════════════════════════════════════════════════════════════════════
 *  THE PERSONAL NETWORK — the signature interaction.
 *
 *  Sujith at the centre, the seven things he actually explores in orbit.
 *  Selecting one is a navigational act, not a decoration: the panel
 *  beside it names the real evidence, and links straight through to the
 *  home-lab services and the case studies that domain connects to. The
 *  page-wide canvas behind it selects the same domain, so the background
 *  and the diagram are showing one thing.
 *
 *  Accessibility: this is a tablist. Every domain is a real button with
 *  roving tabindex, arrow keys move between them, Home/End jump, and the
 *  panel is the tabpanel. Everything the diagram encodes — which domains
 *  relate to each other, what a domain connects to — is also written in
 *  the panel, so nothing is available only by looking at the picture.
 * ══════════════════════════════════════════════════════════════════════ */

const SIZE = 460;
const C = SIZE / 2;
const R = 158;

/** Chords between domains that genuinely inform each other. */
const CHORDS: Array<[DomainId, DomainId]> = [
  ["networking", "cybersecurity"],
  ["linux", "systems"],
  ["infrastructure", "linux"],
  ["software", "cybersecurity"],
  ["infrastructure", "networking"],
];

const ACCENT: Record<string, string> = {
  blue: "#4f7cff",
  cyan: "#3fd2f0",
  violet: "#8b7cf6",
  green: "#40c4be",
  slate: "#a3adbf",
};

function position(i: number, total: number) {
  const angle = -Math.PI / 2 + (i / total) * Math.PI * 2;
  return { x: C + Math.cos(angle) * R, y: C + Math.sin(angle) * R, angle };
}

export function PersonalNetwork() {
  const [selected, setSelected] = useState<DomainId>("networking");
  const { setDomain, setStage } = useLivingSystem();
  const reduced = useReducedMotion();
  const figureRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef(new Map<DomainId, HTMLButtonElement>());
  const baseId = useId();

  const active = domains.find((d) => d.id === selected)!;

  /* Hand the canvas this diagram's rectangle and the selected domain, so
   * the background holds the same formation in the same place. */
  useEffect(() => {
    setStage(figureRef.current);
    return () => setStage(null);
  }, [setStage]);

  useEffect(() => {
    setDomain(selected);
    return () => setDomain(null);
  }, [selected, setDomain]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const i = domains.findIndex((d) => d.id === selected);
      let next = -1;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % domains.length;
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (i - 1 + domains.length) % domains.length;
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = domains.length - 1;
      if (next < 0) return;
      e.preventDefault();
      const id = domains[next]!.id;
      setSelected(id);
      tabRefs.current.get(id)?.focus();
    },
    [selected],
  );

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
      {/* The diagram */}
      <div className="lg:col-span-6">
        <div ref={figureRef} className="relative mx-auto w-full max-w-[460px]">
          <svg
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            className="h-auto w-full overflow-visible"
            role="presentation"
          >
            <defs>
              <radialGradient id={`${baseId}-core`}>
                <stop offset="0%" stopColor="#e8ecf2" stopOpacity="0.95" />
                <stop offset="60%" stopColor="#4f7cff" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#4f7cff" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Orbit guide */}
            <circle cx={C} cy={C} r={R} fill="none" stroke="#1c212b" strokeWidth="1" />
            <circle cx={C} cy={C} r={R * 0.62} fill="none" stroke="#151a22" strokeWidth="1" />

            {/* Chords between related domains */}
            {CHORDS.map(([a, b]) => {
              const ia = domains.findIndex((d) => d.id === a);
              const ib = domains.findIndex((d) => d.id === b);
              if (ia < 0 || ib < 0) return null;
              const pa = position(ia, domains.length);
              const pb = position(ib, domains.length);
              const on = selected === a || selected === b;
              return (
                <path
                  key={`${a}-${b}`}
                  d={`M${pa.x},${pa.y} Q${C},${C} ${pb.x},${pb.y}`}
                  fill="none"
                  stroke={on ? ACCENT.cyan : "#1c212b"}
                  strokeOpacity={on ? 0.7 : 1}
                  strokeWidth={on ? 1.4 : 1}
                  className="transition-all duration-500"
                />
              );
            })}

            {/* Spokes */}
            {domains.map((d, i) => {
              const p = position(i, domains.length);
              const on = d.id === selected;
              return (
                <g key={`spoke-${d.id}`}>
                  <line
                    x1={C}
                    y1={C}
                    x2={p.x}
                    y2={p.y}
                    stroke={on ? ACCENT[d.accent] : "#1c212b"}
                    strokeWidth={on ? 1.6 : 1}
                    className="transition-all duration-500"
                  />
                  {on && !reduced ? (
                    <line
                      x1={C}
                      y1={C}
                      x2={p.x}
                      y2={p.y}
                      stroke={ACCENT[d.accent]}
                      strokeWidth="2"
                      className="edge-traffic"
                    />
                  ) : null}
                </g>
              );
            })}

            {/* Core */}
            <circle cx={C} cy={C} r="46" fill={`url(#${baseId}-core)`} />
            <circle cx={C} cy={C} r="7" fill="#e8ecf2" />
            <text
              x={C}
              y={C + 26}
              textAnchor="middle"
              fill="#7d8799"
              style={{ font: "500 10px var(--font-geist-mono), monospace", letterSpacing: "0.18em" }}
            >
              SUJITH C
            </text>

            {/* Domain markers. The buttons themselves sit on top in HTML. */}
            {domains.map((d, i) => {
              const p = position(i, domains.length);
              const on = d.id === selected;
              return (
                <g key={`node-${d.id}`} className="transition-all duration-500">
                  {on ? (
                    <circle cx={p.x} cy={p.y} r="18" fill={ACCENT[d.accent]} fillOpacity="0.14" />
                  ) : null}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={on ? 6.5 : 4}
                    fill={on ? ACCENT[d.accent] : "#464e5c"}
                    className="transition-all duration-500"
                  />
                </g>
              );
            })}
          </svg>

          {/* Real buttons, positioned over the markers. */}
          <div
            role="tablist"
            aria-label="What I explore"
            aria-orientation="horizontal"
            onKeyDown={onKeyDown}
            className="absolute inset-0"
          >
            {domains.map((d, i) => {
              const p = position(i, domains.length);
              const on = d.id === selected;
              // Push the label outward from the centre so it never covers a spoke.
              const ox = Math.cos(p.angle) * 30;
              const oy = Math.sin(p.angle) * 26;
              return (
                <button
                  key={d.id}
                  ref={(el) => {
                    if (el) tabRefs.current.set(d.id, el);
                    else tabRefs.current.delete(d.id);
                  }}
                  role="tab"
                  type="button"
                  id={`${baseId}-tab-${d.id}`}
                  aria-selected={on}
                  aria-controls={`${baseId}-panel`}
                  tabIndex={on ? 0 : -1}
                  onClick={() => setSelected(d.id)}
                  onMouseEnter={() => setSelected(d.id)}
                  className={cn(
                    "absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border px-2.5 py-1.5 text-[11px] leading-none transition-all duration-300",
                    on
                      ? "border-transparent bg-elevate text-ink shadow-[0_0_20px_-6px_rgba(79,124,255,0.8)]"
                      : "border-line-soft bg-base/70 text-faint hover:border-line-strong hover:text-ink",
                  )}
                  style={{
                    left: `${((p.x + ox) / SIZE) * 100}%`,
                    top: `${((p.y + oy) / SIZE) * 100}%`,
                  }}
                >
                  <span className="mono tracking-[0.08em]">{d.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* The panel — everything the diagram encodes, in words */}
      <div
        role="tabpanel"
        id={`${baseId}-panel`}
        aria-labelledby={`${baseId}-tab-${active.id}`}
        tabIndex={0}
        className="hairline bg-surface p-6 lg:col-span-6 lg:p-8"
      >
        <div className="flex items-center gap-3">
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: ACCENT[active.accent] }}
            aria-hidden
          />
          <span className="label">{active.label}</span>
        </div>
        <p className="display mt-5 text-2xl text-ink lg:text-[1.75rem]">{active.summary}</p>
        <p className="mt-5 text-[15px] leading-relaxed text-muted">{active.body}</p>

        <h4 className="label mt-8">Where this actually shows up</h4>
        <ul className="mt-4 space-y-2.5">
          {active.evidence.map((e) => (
            <li key={e} className="flex gap-3 text-sm leading-relaxed text-muted">
              <CornerDownRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-faint" aria-hidden />
              <span>{e}</span>
            </li>
          ))}
        </ul>

        {active.services.length ? (
          <>
            <h4 className="label mt-8">In the home lab</h4>
            <ul className="mt-3 flex flex-wrap gap-2">
              {active.services.map((id) => {
                const s = serviceById[id];
                if (!s) return null;
                return (
                  <li key={id}>
                    <a
                      href={`#homelab`}
                      className="mono inline-flex items-center gap-2 border border-line px-2.5 py-1.5 text-[11px] text-muted transition-colors hover:border-accent/50 hover:text-ink"
                    >
                      {s.label}
                      <span className="text-ghost">{s.tag}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </>
        ) : null}

        {active.projects.length ? (
          <>
            <h4 className="label mt-8">In my work</h4>
            <ul className="mt-3 flex flex-wrap gap-2">
              {active.projects.map((slug) => {
                const p = projectBySlug[slug];
                if (!p) return null;
                return (
                  <li key={slug}>
                    <Link
                      href={`/work/${slug}`}
                      className="group inline-flex items-center gap-2 border border-line px-3 py-1.5 text-[13px] text-ink transition-colors hover:border-accent/50 hover:text-accent-soft"
                    >
                      {p.name}
                      <ArrowUpRight
                        className="h-3 w-3 text-faint transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-soft"
                        aria-hidden
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </>
        ) : null}
      </div>
    </div>
  );
}

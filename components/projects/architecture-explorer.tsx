"use client";

import { useId, useMemo, useState } from "react";
import { projects } from "@/content/projects";
import type { Architecture, ProjectSlug } from "@/lib/types";
import { cn } from "@/lib/utils";

/* ══════════════════════════════════════════════════════════════════════
 *  ARCHITECTURE EXPLORER
 *
 *  Renders a project's documented architecture (content/projects/*) as
 *  an SVG: groups become columns, components become boxes, edges become
 *  curves. Hovering or focusing a component shows its description and
 *  lights its connections. Every box is a real <button>, so the diagram
 *  is fully keyboard-navigable and each description is readable without
 *  a pointer.
 * ══════════════════════════════════════════════════════════════════════ */

const BOX_W = 180;
const BOX_H = 40;
const COL_GAP = 96;
const ROW_GAP = 18;
const PAD = 24;

interface Laid {
  id: string;
  x: number;
  y: number;
  label: string;
  detail: string;
  caveat?: string;
  group: string;
}

function layout(arch: Architecture) {
  const cols = arch.groups.map((g) => arch.nodes.filter((n) => n.group === g.id));
  const rows = Math.max(...cols.map((c) => c.length));
  const width = PAD * 2 + arch.groups.length * BOX_W + (arch.groups.length - 1) * COL_GAP;
  const height = PAD * 2 + 28 + rows * BOX_H + (rows - 1) * ROW_GAP;
  const nodes: Laid[] = [];
  cols.forEach((col, ci) => {
    const colH = col.length * BOX_H + (col.length - 1) * ROW_GAP;
    const top = PAD + 28 + (height - PAD * 2 - 28 - colH) / 2;
    col.forEach((n, ri) => {
      nodes.push({
        id: n.id,
        x: PAD + ci * (BOX_W + COL_GAP),
        y: top + ri * (BOX_H + ROW_GAP),
        label: n.label,
        detail: n.detail,
        caveat: n.caveat,
        group: n.group,
      });
    });
  });
  return { nodes, width, height, byId: Object.fromEntries(nodes.map((n) => [n.id, n])) as Record<string, Laid> };
}

const withArchitecture = projects.filter((p) => p.architecture);

export function ArchitectureExplorer() {
  const [slug, setSlug] = useState<ProjectSlug>(withArchitecture[0]!.slug);
  const [active, setActive] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const project = projects.find((p) => p.slug === slug)!;
  const arch = project.architecture!;
  const laid = useMemo(() => layout(arch), [arch]);
  const descId = useId();

  const current = pinned ?? active;
  const currentNode = current ? laid.byId[current] : undefined;
  const connected = new Set<string>();
  if (current) {
    for (const e of arch.edges) {
      if (e.from === current) connected.add(e.to);
      if (e.to === current) connected.add(e.from);
    }
  }

  return (
    <div className="hairline bg-surface">
      <div className="flex flex-wrap items-center gap-2 border-b border-line-soft p-3" role="tablist" aria-label="Project architecture">
        {withArchitecture.map((p) => (
          <button
            key={p.slug}
            role="tab"
            type="button"
            aria-selected={p.slug === slug}
            onClick={() => {
              setSlug(p.slug);
              setActive(null);
              setPinned(null);
            }}
            className={cn(
              "mono border px-3 py-1.5 text-[11px] tracking-[0.12em] t-base",
              p.slug === slug ? "border-accent/50 text-ink" : "border-line text-faint hover:border-line-strong hover:text-ink",
            )}
          >
            {p.name.toUpperCase()}
          </button>
        ))}
        <span className="ml-auto hidden text-xs text-ghost sm:block">Hover, tab or tap a component</span>
      </div>

      <div className="grid lg:grid-cols-12">
        <div className="overflow-x-auto lg:col-span-8">
          <svg
            viewBox={`0 0 ${laid.width} ${laid.height}`}
            className="h-auto w-full min-w-[720px]"
            role="group"
            aria-label={`${project.name} architecture diagram`}
          >
            <defs>
              <marker id={`${descId}-arrow`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M0,0 L8,4 L0,8 z" fill="#464e5c" />
              </marker>
            </defs>

            {/* Group headings. */}
            {arch.groups.map((g, i) => (
              <text
                key={g.id}
                x={PAD + i * (BOX_W + COL_GAP)}
                y={PAD + 10}
                className="fill-[#7d8799]"
                style={{ font: "500 10px var(--font-geist-mono), ui-monospace, monospace", letterSpacing: "0.14em" }}
              >
                {g.label.toUpperCase()}
              </text>
            ))}

            {/* Edges. */}
            {arch.edges.map((e, i) => {
              const a = laid.byId[e.from];
              const b = laid.byId[e.to];
              if (!a || !b) return null;
              const x1 = a.x + BOX_W;
              const y1 = a.y + BOX_H / 2;
              const x2 = b.x;
              const y2 = b.y + BOX_H / 2;
              const backwards = x2 < x1;
              const d = backwards
                ? `M${a.x},${y1} C${a.x - 40},${y1} ${x2 + BOX_W + 40},${y2} ${x2 + BOX_W},${y2}`
                : `M${x1},${y1} C${x1 + COL_GAP / 2},${y1} ${x2 - COL_GAP / 2},${y2} ${x2},${y2}`;
              const hot = current && (e.from === current || e.to === current);
              const dim = current && !hot;
              return (
                <g key={i}>
                  <path
                    d={d}
                    fill="none"
                    stroke={hot ? "#3fd2f0" : "#2a3140"}
                    strokeOpacity={dim ? 0.35 : 1}
                    strokeWidth={hot ? 1.5 : 1}
                    markerEnd={`url(#${descId}-arrow)`}
                  />
                  {!dim ? <path d={d} fill="none" stroke="#3fd2f0" strokeWidth="1.5" className="edge-traffic" style={{ animationDelay: `${i * 0.37}s` }} /> : null}
                  {e.label ? (
                    <text
                      x={(x1 + x2) / 2}
                      y={(y1 + y2) / 2 - 6}
                      textAnchor="middle"
                      className="fill-[#7d8799]"
                      style={{ font: "500 9px var(--font-geist-mono), ui-monospace, monospace", letterSpacing: "0.1em" }}
                    >
                      {e.label}
                    </text>
                  ) : null}
                </g>
              );
            })}

            {/* Nodes. */}
            {laid.nodes.map((n) => {
              const isActive = n.id === current;
              const isConnected = connected.has(n.id);
              const dim = current && !isActive && !isConnected;
              return (
                <foreignObject key={n.id} x={n.x} y={n.y} width={BOX_W} height={BOX_H}>
                  <button
                    type="button"
                    aria-describedby={descId}
                    aria-pressed={pinned === n.id}
                    onMouseEnter={() => setActive(n.id)}
                    onMouseLeave={() => setActive(null)}
                    onFocus={() => setActive(n.id)}
                    onBlur={() => setActive(null)}
                    onClick={() => setPinned((p) => (p === n.id ? null : n.id))}
                    className={cn(
                      "flex h-full w-full items-center justify-between border bg-base px-3 text-left t-base",
                      isActive
                        ? "border-signal text-ink ring-accent"
                        : isConnected
                          ? "border-accent/50 text-ink"
                          : "border-line text-muted hover:border-line-strong hover:text-ink",
                      dim && "opacity-40",
                    )}
                  >
                    <span className="mono truncate text-[11px]">{n.label}</span>
                    {n.caveat ? <span aria-label="documented caveat" className="ml-2 h-1.5 w-1.5 shrink-0 rounded-full bg-warn" /> : null}
                  </button>
                </foreignObject>
              );
            })}
          </svg>
        </div>

        <div id={descId} aria-live="polite" className="border-t border-line-soft p-5 lg:col-span-4 lg:border-l lg:border-t-0">
          {currentNode ? (
            <>
              <p className="label">{arch.groups.find((g) => g.id === currentNode.group)?.label}</p>
              <p className="mono mt-3 text-sm text-ink">{currentNode.label}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">{currentNode.detail}</p>
              {currentNode.caveat ? (
                <p className="mt-4 flex items-start gap-2 text-xs text-warn">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-warn" aria-hidden />
                  {currentNode.caveat}
                </p>
              ) : null}
              {connected.size ? (
                <p className="mt-4 text-xs text-faint">
                  Connected to {Array.from(connected).map((id) => laid.byId[id]?.label).filter(Boolean).join(", ")}
                </p>
              ) : null}
            </>
          ) : (
            <>
              <p className="label">{project.name}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {arch.nodes.length} components across {arch.groups.length} layers, as documented in the repository README.
                Amber dots mark components the README itself lists as a known gap.
              </p>
              <a href={project.repo} target="_blank" rel="noreferrer" className="link-line mt-4 inline-block text-sm text-ink">
                Read the source →
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

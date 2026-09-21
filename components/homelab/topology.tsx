"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { CornerDownRight } from "lucide-react";
import { homelab, services, serviceEdges } from "@/content/homelab";
import { interests } from "@/content/personal";
import { useLivingSystem } from "@/components/canvas/living-system";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

/* ══════════════════════════════════════════════════════════════════════
 *  HOME LAB TOPOLOGY
 *
 *  An interactive map of the machine: the home network at the top, a
 *  private Tailscale mesh under it, Debian, CasaOS, and the three
 *  services people actually use. Hovering or focusing a node explains
 *  what it is; selecting one opens what was configured and what running
 *  it taught him, and the surrounding network settles around it —
 *  everything on the path to the selected node brightens, everything
 *  else recedes.
 *
 *  Honesty constraints, enforced by the content layer: the services and
 *  their relationships are real, and the diagram says in its own header
 *  that the layout is illustrative. There are no metrics here, live or
 *  otherwise — no uptime, no CPU, no bandwidth — because none of that
 *  was measured, and a number that is invented is worse than no number.
 *
 *  Every node is a real button: tab to move, arrow keys to walk the
 *  stack, Enter or Space to open. The detail panel is the accessible
 *  equivalent of the picture.
 * ══════════════════════════════════════════════════════════════════════ */

const W = 620;
const H = 380;
const PAD_X = 78;
const PAD_Y = 36;
const NODE_W = 146;
const NODE_H = 42;

const KIND_COLOR: Record<string, string> = {
  edge: "#7d8799",
  overlay: "#3fd2f0",
  host: "#4f7cff",
  platform: "#8b7cf6",
  service: "#40c4be",
};

interface Placed {
  id: string;
  x: number;
  y: number;
}

export function LabTopology({
  compact = false,
  reveal = 1,
}: {
  compact?: boolean;
  /** 0–1. Below 1 the stack is still assembling, layer by layer. */
  reveal?: number;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const reduced = useReducedMotion();
  const { setHover } = useLivingSystem();
  const baseId = useId();
  const nodeRefs = useRef(new Map<string, HTMLButtonElement>());

  const maxLayer = useMemo(() => Math.max(...services.map((s) => s.layer)), []);
  /** How far down the stack the assembly has reached. */
  const front = reveal >= 1 ? maxLayer + 1 : reveal * (maxLayer + 1);
  const shown = (layer: number) => front >= layer + 0.55;
  const assembling = reveal < 1;

  const placed = useMemo<Record<string, Placed>>(() => {
    const out: Record<string, Placed> = {};
    for (const s of services) {
      out[s.id] = {
        id: s.id,
        x: PAD_X + (W - PAD_X * 2) * s.x,
        y: PAD_Y + ((H - PAD_Y * 2) * s.layer) / maxLayer,
      };
    }
    return out;
  }, [maxLayer]);

  /** Every id on the path from the edge down to `id`, plus its children. */
  const related = useMemo(() => {
    const focusId = selected ?? hovered;
    if (!focusId) return null;
    const set = new Set<string>([focusId]);
    let cur = services.find((s) => s.id === focusId)?.parent;
    while (cur) {
      set.add(cur);
      cur = services.find((s) => s.id === cur)?.parent;
    }
    for (const s of services) if (s.parent === focusId) set.add(s.id);
    return set;
  }, [selected, hovered]);

  const active = selected ? services.find((s) => s.id === selected) : undefined;
  const peek = hovered ? services.find((s) => s.id === hovered) : undefined;

  useEffect(() => {
    // Light the matching node in the page-wide field too.
    setHover(selected ? `svc-${selected}` : hovered ? `svc-${hovered}` : null);
    return () => setHover(null);
  }, [selected, hovered, setHover]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent, id: string) => {
      const s = services.find((x) => x.id === id);
      if (!s) return;
      let target: string | undefined;
      if (e.key === "ArrowUp") target = s.parent;
      else if (e.key === "ArrowDown") target = services.find((x) => x.parent === id)?.id;
      else if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        const siblings = services.filter((x) => x.layer === s.layer).sort((a, b) => a.x - b.x);
        const i = siblings.findIndex((x) => x.id === id);
        const next = e.key === "ArrowRight" ? i + 1 : i - 1;
        target = siblings[(next + siblings.length) % siblings.length]?.id;
      }
      if (!target) return;
      e.preventDefault();
      nodeRefs.current.get(target)?.focus();
      setHovered(target);
    },
    [],
  );

  return (
    <div className="hairline bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line-soft px-4 py-3">
        <span className="label">Home lab topology</span>
        <span className="label-xs border border-warn/40 px-2 py-1 text-warn">
          Illustrative — no live metrics
        </span>
      </div>

      <div className={cn("grid", compact ? "" : "xl:grid-cols-12")}>
        <div className={cn("relative hidden lg:block", compact ? "" : "xl:col-span-7")}>
          <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="presentation">
            {/* Layer rules, so the stack reads as layers */}
            {Array.from({ length: maxLayer + 1 }, (_, l) => {
              const y = PAD_Y + ((H - PAD_Y * 2) * l) / maxLayer;
              return (
                <line
                  key={l}
                  x1={16}
                  y1={y}
                  x2={W - 16}
                  y2={y}
                  stroke="#151a22"
                  strokeWidth="1"
                  strokeDasharray="2 6"
                />
              );
            })}

            {/* Edges, drawn as orthogonal routes */}
            {serviceEdges.map((e, i) => {
              const a = placed[e.from];
              const b = placed[e.to];
              if (!a || !b) return null;
              const midY = a.y + (b.y - a.y) * 0.5;
              const d = `M${a.x},${a.y + NODE_H / 2} L${a.x},${midY} L${b.x},${midY} L${b.x},${b.y - NODE_H / 2}`;
              const on = related ? related.has(e.from) && related.has(e.to) : false;
              const dim = related && !on;
              const aSvc = services.find((s) => s.id === e.from);
              const bSvc = services.find((s) => s.id === e.to);
              const ready = shown(aSvc?.layer ?? 0) && shown(bSvc?.layer ?? 0);
              if (!ready) return null;
              return (
                <g key={`${e.from}-${e.to}`}>
                  <path
                    d={d}
                    fill="none"
                    stroke={on ? "#3fd2f0" : "#2a3140"}
                    strokeOpacity={dim ? 0.3 : 1}
                    strokeWidth={on ? 1.5 : 1}
                    className="t-slow"
                  />
                  {!reduced && !dim ? (
                    <path
                      d={d}
                      fill="none"
                      stroke="#3fd2f0"
                      strokeWidth="2"
                      className="edge-traffic"
                      style={{ animationDelay: `${i * 0.55}s` }}
                    />
                  ) : null}
                </g>
              );
            })}
          </svg>

          {/* Nodes as real buttons over the diagram */}
          <div className="absolute inset-0">
            {services.map((s) => {
              const p = placed[s.id]!;
              const on = selected === s.id || hovered === s.id;
              const dim = related ? !related.has(s.id) : false;
              // The stack settles around whatever is open: related nodes
              // drift a little toward the focus, the rest step back.
              const shift = dim ? 6 : on ? -4 : 0;
              const arrived = shown(s.layer);
              return (
                <button
                  key={s.id}
                  ref={(el) => {
                    if (el) nodeRefs.current.set(s.id, el);
                    else nodeRefs.current.delete(s.id);
                  }}
                  type="button"
                  aria-expanded={selected === s.id}
                  aria-controls={`${baseId}-detail`}
                  onMouseEnter={() => setHovered(s.id)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(s.id)}
                  onBlur={() => setHovered(null)}
                  onKeyDown={(e) => onKeyDown(e, s.id)}
                  onClick={() => setSelected((c) => (c === s.id ? null : s.id))}
                  className={cn(
                    "absolute flex -translate-x-1/2 -translate-y-1/2 flex-col justify-center border bg-base px-3 text-left t-slow",
                    on
                      ? "border-signal text-ink shadow-[0_0_26px_-8px_rgba(63,210,240,0.9)]"
                      : "border-line text-muted hover:border-line-strong hover:text-ink",
                    dim && "opacity-45",
                  )}
                  style={{
                    left: `${(p.x / W) * 100}%`,
                    top: `${(p.y / H) * 100}%`,
                    width: `${(NODE_W / W) * 100}%`,
                    height: `${(NODE_H / H) * 100}%`,
                    transform: `translate(-50%, calc(-50% + ${arrived ? shift : 14}px))`,
                    opacity: arrived ? undefined : 0,
                    pointerEvents: arrived ? undefined : "none",
                  }}
                  tabIndex={arrived ? undefined : -1}
                  aria-hidden={arrived ? undefined : true}
                >
                  <span className="mono truncate text-[11.5px] leading-tight">{s.label}</span>
                  <span
                    className="mono truncate text-[9px] leading-tight tracking-[0.14em]"
                    style={{ color: KIND_COLOR[s.kind] }}
                  >
                    {s.tag}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Below the desktop breakpoint the spatial diagram is unreadable,
            so the same stack is rendered as a vertical chain. Same buttons,
            same state, same detail panel — only the geometry changes. */}
        <ol className="lg:hidden">
          {services.map((s, i) => {
            const on = selected === s.id || hovered === s.id;
            const dim = related ? !related.has(s.id) : false;
            const arrived = shown(s.layer);
            const last = i === services.length - 1;
            return (
              <li key={s.id} className={cn("relative pl-10 pr-4", !arrived && "hidden")}>
                {/* connector */}
                <span
                  aria-hidden
                  className={cn(
                    "absolute left-[22px] top-0 w-px",
                    last ? "h-1/2" : "h-full",
                    on ? "bg-signal/60" : "bg-line",
                  )}
                />
                <span
                  aria-hidden
                  className={cn(
                    "absolute left-[18px] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full border t-base",
                    on ? "border-signal bg-signal" : "border-line-strong bg-base",
                  )}
                />
                <button
                  type="button"
                  aria-expanded={selected === s.id}
                  aria-controls={`${baseId}-detail`}
                  onClick={() => setSelected((c) => (c === s.id ? null : s.id))}
                  className={cn(
                    "flex w-full items-baseline justify-between gap-3 border-b border-line-soft py-3.5 text-left transition-opacity",
                    dim && "opacity-50",
                  )}
                  style={{ paddingLeft: `${s.layer * 8}px` }}
                >
                  <span className={cn("text-[15px]", on ? "text-ink" : "text-muted")}>{s.label}</span>
                  <span
                    className="mono shrink-0 text-[9px] tracking-[0.14em]"
                    style={{ color: KIND_COLOR[s.kind] }}
                  >
                    {s.tag}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        {/* Detail panel */}
        <div
          id={`${baseId}-detail`}
          aria-live="polite"
          className={cn(
            "border-t border-line-soft p-5",
            compact ? "" : "xl:col-span-5 xl:border-l xl:border-t-0",
          )}
        >
          {assembling ? (
            <>
              <span className="label">Assembling the stack</span>
              <ol className="mt-4 space-y-2">
                {Array.from({ length: maxLayer + 1 }, (_, l) => {
                  const first = services.find((s) => s.layer === l);
                  const done = shown(l);
                  return (
                    <li
                      key={l}
                      className={cn(
                        "flex items-center gap-3 text-sm t-base",
                        done ? "text-ink" : "text-ghost",
                      )}
                    >
                      <span
                        className={cn(
                          "h-1.5 w-1.5 shrink-0 rounded-full t-base",
                          done ? "bg-signal" : "bg-line-strong",
                        )}
                        aria-hidden
                      />
                      {l === maxLayer
                        ? "The services people actually use"
                        : (first?.what.split(".")[0] ?? first?.label)}
                    </li>
                  );
                })}
              </ol>
              <p className="mt-5 text-xs leading-relaxed text-ghost">
                Keep scrolling — the stack finishes assembling, then every node becomes selectable.
              </p>
            </>
          ) : active ? (
            <>
              <div className="flex items-center justify-between gap-3">
                <span className="label" style={{ color: KIND_COLOR[active.kind] }}>
                  {active.tag}
                </span>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="mono text-[10px] tracking-[0.16em] text-faint hover:text-ink"
                >
                  CLOSE
                </button>
              </div>
              <p className="display mt-3 text-xl text-ink">{active.label}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">{active.what}</p>

              <h3 className="label mt-6">Why it is there</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{active.purpose}</p>

              <h3 className="label mt-6">What I set up</h3>
              <ul className="mt-2 space-y-2">
                {active.configured.map((c) => (
                  <li key={c} className="flex gap-2.5 text-sm leading-relaxed text-muted">
                    <CornerDownRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-faint" aria-hidden />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>

              <h3 className="label mt-6">What it taught me</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{active.learned}</p>

              <ul className="mt-6 flex flex-wrap gap-2">
                {active.domains.map((d) => (
                  <li
                    key={d}
                    className="mono border border-line px-2.5 py-1.5 text-[10px] tracking-[0.1em] text-faint"
                  >
                    {interests.find((i) => i.id === d)?.label ?? d}
                  </li>
                ))}
              </ul>
            </>
          ) : peek ? (
            <>
              <span className="label" style={{ color: KIND_COLOR[peek.kind] }}>
                {peek.tag}
              </span>
              <p className="display mt-3 text-xl text-ink">{peek.label}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">{peek.what}</p>
              <p className="mt-5 text-xs text-ghost">Select it to read what I set up and what it taught me.</p>
            </>
          ) : (
            <>
              <span className="label">The stack</span>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {services.length} pieces, from the home network at the top down to the three services
                people actually use. Hover, tab or tap any of them; arrow keys walk up and down the stack.
              </p>
              <p className="mt-4 text-xs leading-relaxed text-ghost">{homelab.diagramNote}</p>
              <dl className="mt-6 grid grid-cols-2 gap-px bg-line-soft">
                {homelab.facts.map((f) => (
                  <div key={f.label} className="bg-surface p-3">
                    <dt className="label-xs text-ghost">{f.label}</dt>
                    <dd className="mono mt-1.5 text-[12px] text-ink">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

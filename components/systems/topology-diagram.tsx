"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { topology, topologyEdges, topologyById } from "@/data/systems-lab";
import type { TopologyNode } from "@/lib/types";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ *
 *  TOPOLOGY
 *
 *  Edges are SVG (orthogonal elbows, like a real network diagram); nodes
 *  are real HTML buttons positioned over it in percentages. That split
 *  keeps the diagram crisp at any size while the nodes stay focusable,
 *  hoverable and readable to a screen reader.
 *
 *  Selecting a node highlights its whole path back to the internet edge,
 *  which is the thing the diagram is actually there to teach.
 * ------------------------------------------------------------------ */

const VB = { w: 640, h: 580 };
const ROW_Y = [56, 168, 280, 392, 512];

/* What each band of the diagram represents, read top to bottom. */
const LAYERS = ["EDGE", "OVERLAY", "HOST", "PLATFORM", "SERVICES"];
const NODE_W = 150;
const NODE_H = 54;
const PAD = 60;

const cx = (x: number) => PAD + x * (VB.w - PAD * 2);
const cy = (row: number) => ROW_Y[row] ?? 0;

/** Orthogonal elbow from parent bottom to child top. */
function edgePath(from: TopologyNode, to: TopologyNode) {
  const x1 = cx(from.x);
  const y1 = cy(from.row) + NODE_H / 2;
  const x2 = cx(to.x);
  const y2 = cy(to.row) - NODE_H / 2;
  if (Math.abs(x1 - x2) < 0.5) return `M ${x1} ${y1} L ${x2} ${y2}`;
  const mid = y1 + (y2 - y1) * 0.5;
  return `M ${x1} ${y1} L ${x1} ${mid} L ${x2} ${mid} L ${x2} ${y2}`;
}

/** Walk parents so the selected branch can be lit end to end. */
function chainOf(id: string | null): Set<string> {
  const out = new Set<string>();
  let cur = id ? topologyById[id] : undefined;
  while (cur) {
    out.add(cur.id);
    cur = cur.parent ? topologyById[cur.parent] : undefined;
  }
  return out;
}

export function TopologyDiagram({
  activeId,
  onSelect,
}: {
  activeId: string | null;
  onSelect: (id: string) => void;
}) {
  const [hover, setHover] = useState<string | null>(null);
  const focus = hover ?? activeId;
  const chain = useMemo(() => chainOf(focus), [focus]);

  return (
    <div className="flex items-stretch gap-3 sm:gap-5">
      {/* Layer rail — names the band each row sits in and stops the upper
          half of the diagram from reading as empty space. */}
      <div className="relative w-[70px] shrink-0 sm:w-[86px]" aria-hidden>
        {ROW_Y.map((y, i) => (
          <div
            key={LAYERS[i]}
            className="absolute right-0 flex -translate-y-1/2 items-center gap-2"
            style={{ top: `${(y / VB.h) * 100}%` }}
          >
            <span
              className={cn(
                "label-sm whitespace-nowrap transition-colors duration-500",
                topology.some((n) => n.row === i && chain.has(n.id))
                  ? "text-accent/70"
                  : "text-ghost/70",
              )}
            >
              {LAYERS[i]}
            </span>
            <span className="h-px w-2 bg-line" />
          </div>
        ))}
      </div>

      <div className="relative flex-1" style={{ aspectRatio: `${VB.w} / ${VB.h}` }}>
      <svg
        viewBox={`0 0 ${VB.w} ${VB.h}`}
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <defs>
          <linearGradient id="edge-live" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#45d4ee" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#45d4ee" stopOpacity="0.35" />
          </linearGradient>
        </defs>

        {topologyEdges.map(({ from, to }) => {
          const a = topologyById[from];
          const b = topologyById[to];
          if (!a || !b) return null;
          const d = edgePath(a, b);
          const lit = chain.has(from) && chain.has(to);
          return (
            <g key={`${from}-${to}`}>
              <path
                d={d}
                fill="none"
                stroke={lit ? "url(#edge-live)" : "#2a3038"}
                strokeWidth={lit ? 1.6 : 1}
                vectorEffect="non-scaling-stroke"
                className="transition-[stroke,stroke-width] duration-500"
              />
              {/* Traffic pulse — a short dash walking the path. */}
              <path
                d={d}
                fill="none"
                stroke="#78e8fa"
                strokeWidth={1.6}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                className="topology-traffic"
                style={{ animationDelay: `${(to.charCodeAt(0) % 7) * 0.55}s` }}
                opacity={lit ? 0.95 : 0.3}
              />
            </g>
          );
        })}
      </svg>

      {topology.map((node, i) => {
        const lit = chain.has(node.id);
        const selected = activeId === node.id;
        return (
          <motion.button
            key={node.id}
            type="button"
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.5, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
            onMouseEnter={() => setHover(node.id)}
            onMouseLeave={() => setHover(null)}
            onFocus={() => setHover(node.id)}
            onBlur={() => setHover(null)}
            onClick={() => onSelect(node.id)}
            aria-pressed={selected}
            aria-label={`${node.label} — ${node.tag}`}
            className={cn(
              "absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-1 border px-2 text-center transition-[border-color,background-color,box-shadow] duration-400",
              selected
                ? "border-accent/70 bg-accent/[0.1] shadow-[0_0_24px_-6px_rgba(69,212,238,0.55)]"
                : lit
                  ? "border-accent/35 bg-accent/[0.05]"
                  : "border-line bg-surface hover:border-ghost",
            )}
            style={{
              left: `${(cx(node.x) / VB.w) * 100}%`,
              top: `${(cy(node.row) / VB.h) * 100}%`,
              width: `${(NODE_W / VB.w) * 100}%`,
              height: `${(NODE_H / VB.h) * 100}%`,
            }}
          >
            <span
              className={cn(
                "text-[13px] font-medium leading-none tracking-[-0.01em] transition-colors duration-300",
                selected || lit ? "text-accent" : "text-ink",
              )}
            >
              {node.label}
            </span>
            <span className="label-sm text-ghost">{node.tag}</span>

            {selected ? (
              <>
                <span aria-hidden className="absolute -left-px -top-px h-1.5 w-1.5 border-l border-t border-accent" />
                <span aria-hidden className="absolute -bottom-px -right-px h-1.5 w-1.5 border-b border-r border-accent" />
              </>
            ) : null}
          </motion.button>
        );
      })}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Info } from "lucide-react";
import { systemsLab, topology, topologyById } from "@/data/systems-lab";
import type { TopologyNode } from "@/lib/types";
import { Rule } from "@/components/ui/section-header";
import { StatusDot } from "@/components/ui/status-dot";
import { TopologyDiagram } from "@/components/systems/topology-diagram";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ *
 *  SYSTEMS LAB — the starred project's case-file body.
 *
 *  This used to be a top-level section. It now lives inside the project
 *  dossier, so the layout stacks (diagram above node detail) rather than
 *  sitting side by side, and touch still gets the vertical chain.
 * ------------------------------------------------------------------ */

export function SystemsLabDossier() {
  const [activeId, setActiveId] = useState<string>("debian");
  // MobileChain can clear the selection; the diagram panel always needs a node.
  const active = topologyById[activeId] ?? topology[2];

  return (
    <div>
      <p className="max-w-[68ch] text-pretty text-[15px] leading-[1.8] text-muted">
        {systemsLab.intro}
      </p>

      <dl className="mt-8 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-3">
        {systemsLab.facts.map((f) => (
          <div key={f.label} className="bg-base px-4 py-4">
            <dt className="label-sm text-ghost">{f.label}</dt>
            <dd className="mono mt-2 text-[12px] tracking-wide text-ink">{f.value}</dd>
          </div>
        ))}
        {/* Keeps the hairline grid whole when the fact count is not a
            multiple of the column count. */}
        <div className="bg-base" aria-hidden />
      </dl>

      {/* ── Pointer: interactive diagram, detail stacked beneath ───── */}
      <div className="mt-12 hidden lg:block">
        <Rule label="TOPOLOGY" className="mb-7" />
        <div className="max-w-[700px]">
          <TopologyDiagram activeId={activeId} onSelect={setActiveId} />
        </div>
        <p className="label mt-5 flex items-center gap-2 text-ghost">
          <Info className="h-3 w-3" strokeWidth={1.6} />
          HOVER TO TRACE A PATH · CLICK TO INSPECT A NODE
        </p>

        <div className="mt-10">
          <Rule label="NODE DETAIL" className="mb-6" />
          <NodeDetail node={active} />
        </div>
      </div>

      {/* ── Touch: vertical chain, expand in place ─────────────────── */}
      <div className="mt-10 lg:hidden">
        <Rule label="TOPOLOGY" className="mb-6" />
        <MobileChain activeId={activeId} onSelect={setActiveId} />
      </div>

      <p className="mt-12 max-w-[70ch] border-l-2 border-line py-1 pl-4 text-[13.5px] leading-relaxed text-faint">
        {systemsLab.scope}
      </p>
    </div>
  );
}

function NodeDetail({ node }: { node: TopologyNode }) {
  return (
    <AnimatePresence mode="wait">
      <motion.article
        key={node.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
        className="border border-line bg-surface/40"
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <StatusDot tone="accent" live />
            <span className="mono text-[12px] tracking-wide text-ink">{node.label}</span>
          </div>
          <span className="label-sm text-accent/70">{node.tag}</span>
        </div>

        <div className="grid grid-cols-1 divide-y divide-line-soft sm:grid-cols-2 sm:divide-y-0">
          <div className="divide-y divide-line-soft sm:border-r sm:border-line-soft">
            <DetailBlock title="WHAT IT IS">
              <p>{node.what}</p>
            </DetailBlock>
            <DetailBlock title="PURPOSE">
              <p>{node.purpose}</p>
            </DetailBlock>
            <DetailBlock title="WHAT I LEARNED">
              <p>{node.learned}</p>
            </DetailBlock>
          </div>
          <div className="border-t border-line-soft sm:border-t-0">
            <DetailBlock title="WHAT I CONFIGURED">
              <ul className="space-y-2.5">
                {node.configured.map((c) => (
                  <li key={c} className="flex gap-3">
                    <span className="mt-[9px] h-px w-2.5 shrink-0 bg-accent/50" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </DetailBlock>
          </div>
        </div>
      </motion.article>
    </AnimatePresence>
  );
}

function DetailBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="px-5 py-5">
      <div className="label-sm mb-2.5 text-ghost">{title}</div>
      <div className="text-pretty text-[14px] leading-[1.75] text-muted">{children}</div>
    </div>
  );
}

function MobileChain({
  activeId,
  onSelect,
}: {
  activeId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <ul className="relative">
      {topology.map((node, i) => {
        const open = activeId === node.id;
        const isLeaf = node.row === 4;
        const isFirstLeaf = isLeaf && topology.findIndex((n) => n.row === 4) === i;
        return (
          <li key={node.id} className="relative">
            {isFirstLeaf ? (
              <div className="py-3 pl-[13px]">
                <span className="label-sm text-ghost">BRANCHES TO</span>
              </div>
            ) : null}

            <div className="relative pl-8">
              <span
                aria-hidden
                className={cn(
                  "absolute left-[5px] top-0 w-px",
                  i === topology.length - 1 ? "h-6" : "h-full",
                  open ? "bg-accent/40" : "bg-line",
                )}
              />
              <span
                aria-hidden
                className={cn(
                  "absolute left-0 top-[22px] h-[11px] w-[11px] rounded-full border-2 transition-colors",
                  open ? "border-accent bg-accent/25" : "border-line bg-base",
                )}
              />
              {isLeaf ? (
                <span aria-hidden className="absolute left-[5px] top-[27px] h-px w-3 bg-line" />
              ) : null}

              <button
                type="button"
                onClick={() => onSelect(open ? "" : node.id)}
                aria-expanded={open}
                className={cn(
                  "flex w-full items-center gap-3 border-b py-4 text-left transition-colors",
                  open ? "border-accent/25" : "border-line-soft",
                )}
              >
                <span className="flex-1">
                  <span
                    className={cn(
                      "block text-[15px] font-medium tracking-[-0.01em]",
                      open ? "text-accent" : "text-ink",
                    )}
                  >
                    {node.label}
                  </span>
                  <span className="label-sm mt-1.5 block text-ghost">{node.tag}</span>
                </span>
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 shrink-0 transition-transform duration-300",
                    open ? "rotate-180 text-accent" : "text-ghost",
                  )}
                  strokeWidth={1.6}
                />
              </button>

              <AnimatePresence initial={false}>
                {open ? (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="max-w-[70ch] space-y-5 border-b border-line-soft py-5 text-[14px] leading-[1.75] text-muted">
                      <Block title="WHAT IT IS">{node.what}</Block>
                      <Block title="WHAT I CONFIGURED">
                        <ul className="space-y-2">
                          {node.configured.map((c) => (
                            <li key={c} className="flex gap-2.5">
                              <span className="mt-[9px] h-px w-2 shrink-0 bg-accent/50" />
                              <span>{c}</span>
                            </li>
                          ))}
                        </ul>
                      </Block>
                      <Block title="PURPOSE">{node.purpose}</Block>
                      <Block title="WHAT I LEARNED">{node.learned}</Block>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="label-sm mb-2 text-ghost">{title}</div>
      <div>{children}</div>
    </div>
  );
}

"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import type { Screenshot } from "@/lib/types";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { aetherHealth } from "@/content/projects/aether-health";

/** Compact product facts for the sticky column: what is real, stated plainly. */
export function AetherFacts() {
  return (
    <div className="hairline bg-surface">
      <div className="flex items-center justify-between border-b border-line-soft px-4 py-3">
        <span className="label">What is actually there</span>
        <span className="label-xs border border-warn/40 px-2 py-1 text-warn">Not a medical device</span>
      </div>
      <dl className="grid grid-cols-2 gap-px bg-line-soft">
        {aetherHealth.evidence.map((m) => (
          <div key={m.label} className="bg-surface p-4">
            <dd className="display text-[1.5rem] leading-none text-ink">{m.value}</dd>
            <dt className="mt-2 text-xs text-muted">{m.label}</dt>
            {m.note ? <p className="mt-1 text-[11px] text-faint">{m.note}</p> : null}
          </div>
        ))}
      </dl>
      <ul className="space-y-2 border-t border-line-soft px-4 py-4 text-xs leading-relaxed text-muted">
        <li>Two backends: an Express + TypeScript AI service on :3001 and an Express JavaScript demo API on :5000.</li>
        <li>Nothing is encrypted, and the vault screen says so. No database; state lives in Zustand and localStorage.</li>
        <li>AI routes need a Gemini key and were not exercised in the verification report.</li>
      </ul>
    </div>
  );
}

/* Four phone frames with a gentle layered parallax. Every frame carries
 * the same caveat the repository README does: seeded demo data. */
export function AetherShowcase({ shots }: { shots: Screenshot[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y0 = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -40]);
  const y1 = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 30]);
  const ys = [y0, y1, y0, y1];

  return (
    <div ref={ref}>
      <div className="flex items-center justify-between px-1 pb-3">
        <span className="label">Real screens · guest mode</span>
        <span className="label-xs border border-warn/40 px-2 py-1 text-warn">Seeded demo data</span>
      </div>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
        {shots.map((s, i) => (
          <motion.li key={s.src} style={{ y: ys[i] }} className={i % 2 === 1 ? "mt-6" : ""}>
            <figure>
              <div className="overflow-hidden rounded-[20px] border border-line-strong bg-void p-1">
                <Image
                  src={s.src}
                  alt={s.alt}
                  width={s.width}
                  height={s.height}
                  sizes="(min-width: 1280px) 12vw, (min-width: 640px) 22vw, 45vw"
                  className="h-auto w-full rounded-[15px]"
                />
              </div>
              <figcaption className="mt-2 text-[11px] leading-snug text-faint">{s.caption}</figcaption>
            </figure>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

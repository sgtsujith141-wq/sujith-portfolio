"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import type { Screenshot } from "@/lib/types";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

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

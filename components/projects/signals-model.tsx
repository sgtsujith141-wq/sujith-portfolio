"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { criticalCeiling, evidenceTiers, scoringCategories } from "@/content/projects/surakshascore";
import { cn } from "@/lib/utils";

/* ══════════════════════════════════════════════════════════════════════
 *  SURAKSHASCORE SIGNAL MODEL
 *
 *  Interactive presentation of how signals contribute to the score, built
 *  from the weights in src/core/config/scoringConfig.ts and the evidence
 *  tiers in the README. It shows the model, not a fake scan: there are no
 *  invented user results anywhere in this component.
 * ══════════════════════════════════════════════════════════════════════ */

export function SignalsModel() {
  const [tier, setTier] = useState(0);
  const [cat, setCat] = useState(0);
  const t = evidenceTiers[tier]!;
  const c = scoringCategories[cat]!;

  return (
    <div className="hairline bg-surface">
      <div className="border-b border-line-soft px-5 py-3">
        <span className="label">The scoring model — from the repository config</span>
      </div>

      <div className="grid gap-px bg-line-soft sm:grid-cols-2">
        {/* Evidence tiers */}
        <div className="bg-base p-5">
          <p className="text-xs text-faint">Evidence tier → weight factor</p>
          <ul className="mt-4 space-y-1.5" role="radiogroup" aria-label="Evidence tier">
            {evidenceTiers.map((et, i) => (
              <li key={et.tier}>
                <button
                  type="button"
                  role="radio"
                  aria-checked={i === tier}
                  onClick={() => setTier(i)}
                  className={cn(
                    "flex w-full items-center gap-3 border px-3 py-2.5 text-left t-base",
                    i === tier ? "border-accent/50 bg-surface text-ink" : "border-line text-muted hover:border-line-strong hover:text-ink",
                  )}
                >
                  <span className="mono w-6 text-[11px] text-faint">T{et.tier}</span>
                  <span className="flex-1 text-sm">{et.name}</span>
                  <span className="relative h-1 w-16 overflow-hidden bg-line">
                    <motion.span
                      className="absolute inset-y-0 left-0 bg-signal"
                      initial={false}
                      animate={{ width: `${et.weight * 100}%` }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </span>
                  <span className="mono w-10 text-right text-[11px] tabular-nums">{et.weight.toFixed(2)}</span>
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs leading-relaxed text-muted" aria-live="polite">
            <span className="text-ink">{t.name}</span> · {t.how}. A signal at this tier counts for{" "}
            <span className="mono text-ink">{t.weight.toFixed(2)}×</span> of a hardware-attested one. It is shown,
            labelled and counted — never silently discarded or promoted.
          </p>
        </div>

        {/* Categories */}
        <div className="bg-base p-5">
          <p className="text-xs text-faint">Category weights (sum to 1.00) → rules</p>
          <ul className="mt-4 space-y-1.5" role="radiogroup" aria-label="Scoring category">
            {scoringCategories.map((sc, i) => (
              <li key={sc.id}>
                <button
                  type="button"
                  role="radio"
                  aria-checked={i === cat}
                  onClick={() => setCat(i)}
                  className={cn(
                    "flex w-full items-center gap-3 border px-3 py-2.5 text-left t-base",
                    i === cat ? "border-accent/50 bg-surface text-ink" : "border-line text-muted hover:border-line-strong hover:text-ink",
                  )}
                >
                  <span className="flex-1 text-sm">{sc.label}</span>
                  <span className="relative h-1 w-20 overflow-hidden bg-line">
                    <motion.span
                      className="absolute inset-y-0 left-0 bg-accent"
                      initial={false}
                      animate={{ width: `${(sc.weight / 0.35) * 100}%` }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </span>
                  <span className="mono w-10 text-right text-[11px] tabular-nums">{sc.weight.toFixed(2)}</span>
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-4 text-xs leading-relaxed text-muted" aria-live="polite">
            <span className="text-ink">{c.label}</span> starts at 100 and takes severity-weighted deductions from{" "}
            {c.rules.length} rules:
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {c.rules.map((r) => (
                <li key={r} className="mono border border-line px-2 py-1 text-[10px] text-faint">
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line-soft px-5 py-4">
        <span className="label">Invariant</span>
        <p className="text-sm text-muted">
          While any critical finding is open the overall score cannot exceed{" "}
          <span className="mono text-ink">{criticalCeiling}</span>. A screen that says 94/100 with a critical issue
          open is exactly what this project exists to avoid.
        </p>
      </div>
    </div>
  );
}

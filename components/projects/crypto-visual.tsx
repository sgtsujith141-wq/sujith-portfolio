"use client";

import { motion } from "motion/react";
import { formatDate } from "@/lib/utils";

/* ══════════════════════════════════════════════════════════════════════
 *  CRYPTODRISHTI — asset network (illustrative) + documented figures.
 *
 *  The diagram shows the SHAPE of a scan: six sensors feeding assets that
 *  are classified three ways. It is labelled illustrative because it is
 *  not the output of a scan. The numbers beneath it are the documented
 *  ones, with their source and date.
 * ══════════════════════════════════════════════════════════════════════ */

const SENSORS = ["source", "dependency", "binary", "certificate", "config", "network"];

type Cls = "broken" | "weakened" | "safe" | "unresolved";
const ASSETS: Array<{ label: string; cls: Cls }> = [
  { label: "RSA-2048", cls: "broken" },
  { label: "ECDSA P-256", cls: "broken" },
  { label: "X25519", cls: "broken" },
  { label: "AES-128", cls: "weakened" },
  { label: "SHA-1", cls: "weakened" },
  { label: "AES-256", cls: "safe" },
  { label: "ML-KEM-768", cls: "safe" },
  { label: "?", cls: "unresolved" },
];

const CLS_COLOR: Record<Cls, string> = {
  broken: "#f0b429",
  weakened: "#8b7cf6",
  safe: "#3fd2f0",
  unresolved: "#a3adbf",
};

/** Registry composition — real counts from app/knowledge/algorithms.py. */
const REGISTRY = [
  { label: "Shor-broken", n: 20, color: CLS_COLOR.broken },
  { label: "Grover-weakened", n: 12, color: CLS_COLOR.weakened },
  { label: "Quantum-safe", n: 18, color: CLS_COLOR.safe },
  { label: "Hybrid", n: 1, color: "#4f7cff" },
  { label: "Unresolved", n: 1, color: CLS_COLOR.unresolved },
];
const TOTAL = REGISTRY.reduce((s, r) => s + r.n, 0);

const W = 520;
const H = 300;

export function CryptoVisual() {
  const target = { x: 60, y: H / 2 };
  const sensorX = 190;
  const assetX = 350;
  const normX = 470;

  const sensorPts = SENSORS.map((s, i) => ({ s, x: sensorX, y: 40 + i * ((H - 80) / (SENSORS.length - 1)) }));
  const assetPts = ASSETS.map((a, i) => ({ ...a, x: assetX, y: 30 + i * ((H - 60) / (ASSETS.length - 1)) }));

  const draw = (d: number) => ({
    initial: { pathLength: 0, opacity: 0 },
    whileInView: { pathLength: 1, opacity: 1 },
    viewport: { once: true, amount: 0.4 },
    transition: { duration: 1.1, delay: d, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <div className="hairline bg-surface/60">
      <div className="flex items-center justify-between border-b border-line-soft px-4 py-3">
        <span className="label">How a scan takes shape</span>
        <span className="label-xs border border-warn/40 px-2 py-1 text-warn">Illustrative — not a scan result</span>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Illustration: a target feeds six sensors, whose hits normalise into distinct assets classified as Shor-broken, Grover-weakened, quantum-safe or unresolved">
        {/* Target → sensors */}
        {sensorPts.map((p, i) => (
          <motion.line key={p.s} x1={target.x} y1={target.y} x2={p.x} y2={p.y} stroke="#2a3140" strokeWidth="1" {...draw(i * 0.05)} />
        ))}
        {/* Sensors → assets (sparse, deterministic) */}
        {assetPts.map((a, i) =>
          sensorPts
            .filter((_, si) => (si + i) % 3 === 0)
            .map((s) => (
              <motion.line key={`${s.s}-${a.label}`} x1={s.x} y1={s.y} x2={a.x} y2={a.y} stroke="#2a3140" strokeWidth="1" {...draw(0.3 + i * 0.04)} />
            )),
        )}
        {/* Assets → normalise/score */}
        {assetPts.map((a, i) => (
          <motion.line key={`n-${a.label}`} x1={a.x} y1={a.y} x2={normX} y2={H / 2} stroke={CLS_COLOR[a.cls]} strokeOpacity="0.5" strokeWidth="1" {...draw(0.6 + i * 0.04)} />
        ))}

        <circle cx={target.x} cy={target.y} r="7" fill="#4f7cff" />
        <text x={target.x} y={target.y + 24} textAnchor="middle" fill="#7d8799" style={{ font: "500 9px var(--font-geist-mono), monospace", letterSpacing: "0.12em" }}>
          TARGET
        </text>

        {sensorPts.map((p) => (
          <g key={p.s}>
            <circle cx={p.x} cy={p.y} r="3.5" fill="#a3adbf" />
            <text x={p.x - 8} y={p.y + 3.5} textAnchor="end" fill="#7d8799" style={{ font: "500 9px var(--font-geist-mono), monospace" }}>
              {p.s}
            </text>
          </g>
        ))}

        {assetPts.map((a) => (
          <g key={a.label}>
            <circle cx={a.x} cy={a.y} r="4" fill={CLS_COLOR[a.cls]} />
            <text x={a.x + 9} y={a.y + 3.5} fill="#a3adbf" style={{ font: "500 9px var(--font-geist-mono), monospace" }}>
              {a.label}
            </text>
          </g>
        ))}

        <circle cx={normX} cy={H / 2} r="9" fill="none" stroke="#3fd2f0" strokeWidth="1.5" />
        <circle cx={normX} cy={H / 2} r="3" fill="#3fd2f0" />
        <text x={normX} y={H / 2 + 26} textAnchor="middle" fill="#7d8799" style={{ font: "500 9px var(--font-geist-mono), monospace", letterSpacing: "0.12em" }}>
          SCORE · CBOM
        </text>
      </svg>

      {/* Registry composition — real. */}
      <div className="border-t border-line-soft px-4 py-4">
        <div className="flex items-baseline justify-between">
          <span className="text-xs text-faint">Algorithm registry composition</span>
          <span className="mono text-[10px] text-ghost">{TOTAL} ENTRIES · app/knowledge/algorithms.py</span>
        </div>
        <div className="mt-3 flex h-2 w-full overflow-hidden bg-line" role="img" aria-label={REGISTRY.map((r) => `${r.label} ${r.n}`).join(", ")}>
          {REGISTRY.map((r) => (
            <motion.span
              key={r.label}
              style={{ background: r.color }}
              initial={{ width: 0 }}
              whileInView={{ width: `${(r.n / TOTAL) * 100}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            />
          ))}
        </div>
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
          {REGISTRY.map((r) => (
            <li key={r.label} className="flex items-center gap-2 text-[11px] text-muted">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: r.color }} aria-hidden />
              {r.label} <span className="mono text-faint">{r.n}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Documented scan — real, sourced. */}
      <div className="border-t border-line-soft px-4 py-4">
        <div className="flex items-baseline justify-between">
          <span className="text-xs text-faint">Documented scan of paramiko @ 142f593</span>
          <span className="mono text-[10px] text-ghost">README · REPORT {formatDate("2026-09-17").toUpperCase()}</span>
        </div>
        <dl className="mt-3 grid grid-cols-4 gap-2">
          {[
            ["70", "files"],
            ["12", "distinct assets"],
            ["8", "quantum-vulnerable"],
            ["1.3s", "scan time"],
          ].map(([v, k]) => (
            <div key={k}>
              <dd className="display text-2xl text-ink">{v}</dd>
              <dt className="mt-1 text-[11px] text-faint">{k}</dt>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-[11px] leading-relaxed text-ghost">
          66.7% vulnerable. Production ECDSA ranked critical; a private key in a test fixture ranked below it.
          Numbers change as paramiko changes.
        </p>
      </div>
    </div>
  );
}

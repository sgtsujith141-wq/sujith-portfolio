"use client";

import { useEffect, useRef, useState } from "react";
import { criticalCap, exampleScore, finds, mailcaps, mosca, tiers, type Visual } from "@/content/site";
import { clamp } from "@/lib/utils";
import { useMedia } from "@/lib/use-media";

/* The interactive panels inside a project explanation. Every number they
 * show comes from content/site.ts; the one made-up value (the example
 * score) is labelled as such on screen. */

/** Counts a displayed number toward a target, like the reference. */
function useTween(target: number, rate: number) {
  const rm = useMedia("(prefers-reduced-motion: reduce)");
  const [shown, setShown] = useState(target);
  const cur = useRef(target);
  useEffect(() => {
    if (rm) {
      cur.current = target;
      return;
    }
    let raf = 0;
    const f = () => {
      const d = target - cur.current;
      cur.current += Math.sign(d) * Math.max(1, Math.abs(d) * rate);
      if (Math.abs(target - cur.current) < 1) cur.current = target;
      setShown(Math.round(cur.current));
      if (cur.current !== target) raf = requestAnimationFrame(f);
    };
    raf = requestAnimationFrame(f);
    return () => cancelAnimationFrame(raf);
  }, [target, rate, rm]);
  return rm ? target : shown;
}

function Finds() {
  const [sel, setSel] = useState(0);
  return (
    <>
      <h4>Same algorithm (RSA) found in three places. Each gets a different answer. Select one.</h4>
      <div className="finds">
        {finds.map((f, i) => (
          <button className="find" type="button" aria-pressed={sel === i} key={f.f} onClick={() => setSel(i)}>
            <span className="f">{f.f}</span>
            <span className="p">{f.p}</span>
            <span className={f.m ? "m" : "m none"}>{f.m ?? "needs a person to decide"}</span>
          </button>
        ))}
      </div>
      <p className="explain" aria-live="polite">
        {finds[sel]?.why}
      </p>
      <p className="caption">Examples taken from the demo scan in the project README.</p>
    </>
  );
}

function Mosca() {
  const a = mosca.earliest - mosca.fromYear, c = mosca.likely - mosca.fromYear, b = mosca.latest - mosca.fromYear;
  const cdf = (t: number) => (t <= a ? 0 : t <= c ? ((t - a) * (t - a)) / ((b - a) * (c - a)) : t < b ? 1 - ((b - t) * (b - t)) / ((b - a) * (b - c)) : 1);
  const xs = (y: number) => 20 + (y / 30) * 560;
  const [X, setX] = useState(10);
  const [Y, setY] = useState(5);
  const t = X + Y;
  const pct = useTween(Math.round(cdf(t) * 100), 0.25);
  const px = xs(clamp(t, 0, 30));
  const tri = `M${xs(a)} 140 L${xs(c)} 30 L${xs(b)} 140 Z`;
  return (
    <>
      <h4>
        Mosca&apos;s inequality: data is at risk if the years it must stay secret plus the years migration takes are longer than the years until a quantum computer exists.
      </h4>
      <div className="mctl">
        <label>
          Years the data must stay secret<output>{X}y</output>
          <input type="range" min={1} max={30} value={X} onChange={(e) => setX(+e.target.value)} aria-valuetext={`${X} years`} />
        </label>
        <label>
          Years the migration will take<output>{Y}y</output>
          <input type="range" min={1} max={15} value={Y} onChange={(e) => setY(+e.target.value)} aria-valuetext={`${Y} years`} />
        </label>
      </div>
      <svg className="mdist" viewBox="0 0 600 170" role="img" aria-label={`Range of years until a quantum computer, with your total of ${t} years marked`}>
        <defs>
          <clipPath id="mclip">
            <rect x="0" y="0" width={px} height="170" />
          </clipPath>
        </defs>
        <path d={tri} fill="rgba(255,255,255,.04)" stroke="rgba(255,255,255,.35)" />
        <path d={tri} fill="rgba(255,255,255,.42)" clipPath="url(#mclip)" />
        <line x1="20" y1="140" x2="580" y2="140" stroke="#36363b" />
        {[0, 5, 10, 15, 20, 25, 30].map((y) => (
          <text key={y} x={xs(y)} y="158" textAnchor="middle">
            {y}y
          </text>
        ))}
        <line x1={px} y1="20" x2={px} y2="140" stroke="#ffffff" strokeWidth="1.5" />
        <text x={clamp(px, 40, 560)} y="14" textAnchor="middle" style={{ fill: "#ffffff" }}>
          total {t}y
        </text>
      </svg>
      <div className="mres">
        <b aria-live="polite">{pct}%</b>
        <span>chance a quantum computer arrives before your data is safe, in this scenario</span>
      </div>
      <p className="caption">
        The shaded shape is the assumed range for when a quantum computer arrives: earliest {mosca.earliest}, most likely {mosca.likely}, latest {mosca.latest} (the
        project&apos;s defaults), counted from {mosca.fromYear}. A scenario, not a forecast.
      </p>
    </>
  );
}

function Model() {
  const [tier, setTier] = useState(1);
  const [crit, setCrit] = useState(false);
  const score = useTween(crit ? criticalCap : exampleScore, 0.14);
  const t = tiers[tier] ?? tiers[1];
  return (
    <>
      <div className="model">
        <div>
          <h4>A signal counts for as much as it can be trusted</h4>
          <div className="tiers" role="group" aria-label="Trust level">
            {tiers.map((x, i) => (
              <button type="button" aria-pressed={tier === i} key={x.n} onClick={() => setTier(i)}>
                <span className="n">{x.n}</span>
                <span>{x.label}</span>
                <span className="w">×{x.w.toFixed(2)}</span>
              </button>
            ))}
          </div>
          <p className="caption" aria-live="polite">
            &quot;Screen lock is on&quot;, if {t.label.toLowerCase()}, counts {Math.round(t.w * 100)}% as much as a hardware-checked signal.
          </p>
          <div className="meter" aria-hidden="true">
            <i style={{ width: `${t.w * 100}%` }} />
          </div>
        </div>
        <div>
          <h4>A critical problem caps the score</h4>
          <div className="score">
            <b>{score}</b>
            <span>
              {crit ? (
                <>
                  capped at {criticalCap}
                  <br />
                  until the critical problem is fixed
                </>
              ) : (
                <>
                  example score
                  <br />
                  no critical problem
                </>
              )}
            </span>
          </div>
          <button className="swt" type="button" role="switch" aria-checked={crit} onClick={() => setCrit((v) => !v)}>
            <i />
            <span>Add a critical problem</span>
          </button>
        </div>
      </div>
      <p className="caption">Weights and the cap of {criticalCap} are the project&apos;s real rules. The example score is made up for the demo.</p>
    </>
  );
}

function Mailcap() {
  const [sel, setSel] = useState(1);
  return (
    <>
      <h4>The project&apos;s demo captures. Select one to see what the engine reported.</h4>
      <div className="finds">
        {mailcaps.map((c, i) => (
          <button className="find" type="button" aria-pressed={sel === i} key={c.name} onClick={() => setSel(i)}>
            <span className="f">{c.name}.pcap</span>
            <span className="p">{c.tls}</span>
            <span className={c.findings ? "m" : "m none"}>
              {c.findings ? `${c.findings} finding${c.findings > 1 ? "s" : ""} · score ${c.score}` : `no findings · score ${c.score}`}
            </span>
          </button>
        ))}
      </div>
      <p className="explain" aria-live="polite">
        {mailcaps[sel]?.text}
      </p>
      <p className="caption">Measured results on synthetic captures, as published in the project README.</p>
    </>
  );
}

function Arch() {
  return (
    <>
      <h4>How the parts connect, including the messy bits</h4>
      <div className="archwrap" data-lenis-prevent tabIndex={0} role="region" aria-label="Architecture diagram, scrollable">
        <svg className="arch" viewBox="0 0 640 250" role="img" aria-label="A React client talks to an AI server, which calls Gemini, and to a demo backend that saves JSON files. A leftover folder does not build.">
          <rect className="box" x="10" y="85" width="170" height="80" />
          <text className="t" x="25" y="112">client</text>
          <text x="25" y="132">React + Vite</text>
          <text x="25" y="150">data kept in browser</text>
          <rect className="box" x="235" y="14" width="200" height="72" />
          <text className="t" x="250" y="42">AI server</text>
          <text x="250" y="62">Express + TypeScript</text>
          <rect className="box" x="235" y="164" width="200" height="72" />
          <text className="t" x="250" y="192">demo backend</text>
          <text x="250" y="212">Express, demo login</text>
          <rect className="box" x="490" y="22" width="140" height="56" />
          <text className="t" x="505" y="48">Gemini</text>
          <text x="505" y="66">holds the API key</text>
          <rect className="box" x="490" y="172" width="140" height="56" />
          <text className="t" x="505" y="198">JSON files</text>
          <text x="505" y="216">no database</text>
          <rect className="box" x="235" y="102" width="200" height="46" style={{ strokeDasharray: "3 4" }} />
          <text x="250" y="130">leftover folder (no build)</text>
          <path className="flow" d="M180 110 L207 110 L207 50 L235 50" />
          <path className="flow" d="M180 140 L207 140 L207 200 L235 200" />
          <path className="flow" d="M435 50 H490" />
          <path className="flow" d="M435 200 H490" />
        </svg>
      </div>
      <p className="caption">Drawn from the architecture section of the project README.</p>
    </>
  );
}

const MAP: Record<Visual, () => React.JSX.Element> = { finds: Finds, mosca: Mosca, model: Model, mailcap: Mailcap, arch: Arch };

export function VisualPanel({ v }: { v: Visual }) {
  const C = MAP[v];
  return (
    <div className="panel">
      <C />
    </div>
  );
}

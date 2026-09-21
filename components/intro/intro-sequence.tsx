"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DecryptText } from "@/components/ui/decrypt-text";
import { useLivingSystem } from "@/components/canvas/living-system";
import { profile } from "@/content/personal";
import { cn } from "@/lib/utils";

/* ══════════════════════════════════════════════════════════════════════
 *  OPENING SEQUENCE — 3.5s, on every page load.
 *
 *  0.00–0.60  dark screen, a single pulse at centre
 *  0.60–1.30  scan sweep + SECURE SESSION / IDENTITY VERIFIED
 *  1.30–2.30  SUJITH C resolves out of cipher glyphs, one glitch beat
 *  2.30–3.00  CYBERSECURITY • SYSTEMS • SOFTWARE, node field condenses in
 *  3.00–3.50  ACCESS GRANTED
 *  3.50       handoff
 *
 *  The handoff is a morph, not a fade. The node field is the SAME canvas
 *  the rest of the page uses, so it expands outward instead of being
 *  replaced; and the name travels from the centre of the screen to the
 *  exact box of the page's own <h1> before the two cross-fade. Nothing is
 *  swapped out from under the viewer.
 *
 *  No storage is consulted — a real reload always replays it. Internal
 *  navigation never remounts this component, so scrolling and nav clicks
 *  do not retrigger it. Escape, Enter, Space or the skip control end it
 *  early; prefers-reduced-motion never sees it at all, decided by the
 *  blocking script in app/layout.tsx before first paint.
 * ══════════════════════════════════════════════════════════════════════ */

const PHASES = { PULSE: 0, SCAN: 1, NAME: 2, DISCIPLINE: 3, GRANTED: 4 } as const;

const MARKS: [number, number][] = [
  [600, PHASES.SCAN],
  [1300, PHASES.NAME],
  [2300, PHASES.DISCIPLINE],
  [3000, PHASES.GRANTED],
];

const HANDOFF_AT = 3500;
/** Where the name stops travelling and the page's own heading takes over. */
const CROSSFADE_AT = 430;
const UNMOUNT_AT = 700;

interface Morph {
  x: number;
  y: number;
  scale: number;
}

export function IntroSequence() {
  const world = useLivingSystem();
  // Rendered during SSR so the first painted frame is already the sequence.
  const [mounted, setMounted] = useState(true);
  const [running, setRunning] = useState(true);
  const [phase, setPhase] = useState<number>(PHASES.PULSE);
  const [glitch, setGlitch] = useState(false);
  const [morph, setMorph] = useState<Morph | null>(null);
  const [handedOff, setHandedOff] = useState(false);
  const timers = useRef<number[]>([]);
  const nameRef = useRef<HTMLDivElement>(null);

  const worldRef = useRef(world);
  useEffect(() => {
    worldRef.current = world;
  }, [world]);

  /** Measure the page's own heading and return the transform that lands
   *  this name exactly on it. Left edge and vertical centre are matched;
   *  the cross-fade absorbs the difference between mono and sans. */
  const measureMorph = useCallback((): Morph | null => {
    const from = nameRef.current?.getBoundingClientRect();
    const target = document
      .querySelector<HTMLElement>("[data-morph-target]")
      ?.getBoundingClientRect();
    if (!from || !target || !from.width || !target.height) return null;
    return {
      x: target.left - from.left,
      y: target.top + target.height / 2 - (from.top + from.height / 2),
      scale: target.height / from.height,
    };
  }, []);

  const finish = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    document.body.style.removeProperty("overflow");

    // Release the field to the page: it springs outward from the intro
    // cluster into the ambient layout, on the same canvas.
    worldRef.current.setIntroScene(null);

    document.documentElement.setAttribute("data-intro", "morphing");
    setMorph(measureMorph());

    timers.current.push(
      window.setTimeout(() => {
        document.documentElement.setAttribute("data-intro", "settling");
        setHandedOff(true);
      }, CROSSFADE_AT),
    );
    timers.current.push(
      window.setTimeout(() => {
        document.documentElement.setAttribute("data-intro", "done");
        setRunning(false);
        setMounted(false);
      }, UNMOUNT_AT),
    );
  }, [measureMorph]);

  useEffect(() => {
    if (document.documentElement.getAttribute("data-intro") !== "pending") {
      // One-shot read of an attribute set before first paint, ending in a
      // single terminal state that unmounts this component. There is no
      // cascade for the rule to prevent, and the value cannot be known
      // during render.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRunning(false);
      setMounted(false);
      return;
    }

    document.body.style.overflow = "hidden";
    // Start at the top: a mid-page restore would fight the opening shot.
    window.scrollTo(0, 0);
    worldRef.current.setIntroScene("boot");

    const push = (ms: number, fn: () => void) => {
      timers.current.push(window.setTimeout(fn, ms));
    };

    MARKS.forEach(([ms, next]) => push(ms, () => setPhase(next)));
    push(2300, () => worldRef.current.setIntroScene("emerge"));
    // One glitch beat, landing as the name locks in.
    push(2040, () => setGlitch(true));
    push(2190, () => setGlitch(false));
    push(HANDOFF_AT, finish);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        finish();
      }
    };
    window.addEventListener("keydown", onKey);

    const snapshot = timers.current;
    return () => {
      window.removeEventListener("keydown", onKey);
      snapshot.forEach(clearTimeout);
      document.body.style.removeProperty("overflow");
    };
  }, [finish]);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {running ? (
        // No backdrop element: the body itself is darkened while the
        // sequence runs, which keeps the shared canvas visible underneath.
        <motion.div
          key="intro"
          className="intro-root pointer-events-none fixed inset-0 z-[120]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          role="presentation"
        >
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ opacity: morph ? 1 : 1 }}
          >
            <Brackets fade={Boolean(morph)} />

            {/* Scan sweep. */}
            <AnimatePresence>
              {phase >= PHASES.SCAN && phase < PHASES.GRANTED ? (
                <motion.div
                  key="scan"
                  className="pointer-events-none absolute inset-x-0 h-px"
                  initial={{ top: "-2%", opacity: 0 }}
                  animate={{ top: "102%", opacity: [0, 1, 1, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5, ease: "linear", times: [0, 0.1, 0.85, 1] }}
                  style={{
                    background:
                      "linear-gradient(90deg,transparent,rgba(69,212,238,0.55) 22%,rgba(69,212,238,0.9) 50%,rgba(69,212,238,0.55) 78%,transparent)",
                    boxShadow: "0 0 18px rgba(69,212,238,0.4)",
                  }}
                />
              ) : null}
            </AnimatePresence>

            {/* System labels, top-left rail. */}
            <motion.div
              className="absolute left-6 top-6 space-y-1.5 sm:left-10 sm:top-10"
              animate={{ opacity: morph ? 0 : 1 }}
              transition={{ duration: 0.22 }}
            >
              <SysLabel show={phase >= PHASES.SCAN} delay={0.05}>
                SECURE SESSION
              </SysLabel>
              <SysLabel show={phase >= PHASES.SCAN} delay={0.32} tone="accent">
                IDENTITY VERIFIED
              </SysLabel>
            </motion.div>

            {/* Centre stack. */}
            <div className="relative flex w-full max-w-4xl flex-col items-center px-6 text-center">
              {/* Pulse — the first thing on screen. */}
              <AnimatePresence>
                {phase < PHASES.NAME ? (
                  <motion.div
                    key="pulse"
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                    initial={{ opacity: 0, scale: 0.4 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 2.6 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <span className="relative block h-[3px] w-[3px] rounded-full bg-accent">
                      <motion.span
                        className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/40"
                        initial={{ scale: 0.2, opacity: 0.9 }}
                        animate={{ scale: [0.2, 1.5], opacity: [0.9, 0] }}
                        transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
                      />
                      <span
                        className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full"
                        style={{
                          background:
                            "radial-gradient(circle,rgba(69,212,238,0.4),transparent 70%)",
                        }}
                      />
                    </span>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              {/* Name — travels to the page heading on handoff. */}
              <AnimatePresence>
                {phase >= PHASES.NAME ? (
                  <motion.div
                    key="name"
                    ref={nameRef}
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: handedOff ? 0 : 1,
                      x: morph?.x ?? 0,
                      y: morph?.y ?? 0,
                      scale: morph?.scale ?? 1,
                    }}
                    transition={{
                      opacity: { duration: handedOff ? 0.2 : 0.25 },
                      default: { duration: 0.56, ease: [0.65, 0, 0.2, 1] },
                    }}
                    style={{ transformOrigin: "left center" }}
                    className={cn("relative", glitch && "intro-glitch")}
                    data-text={profile.displayName}
                  >
                    <DecryptText
                      text={profile.displayName}
                      as="div"
                      stagger={52}
                      churn={280}
                      className="mono whitespace-nowrap text-[clamp(2.1rem,9vw,4.75rem)] font-medium leading-none tracking-[0.06em] text-ink"
                    />
                  </motion.div>
                ) : null}
              </AnimatePresence>

              {/* Disciplines. */}
              <AnimatePresence>
                {phase >= PHASES.DISCIPLINE ? (
                  <motion.div
                    key="disc"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: morph ? 0 : 1, y: 0 }}
                    transition={{ duration: morph ? 0.2 : 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-6 flex items-center gap-2.5"
                  >
                    {profile.disciplines.map((d: string, i: number) => (
                      <span key={d} className="flex items-center gap-2.5">
                        {i > 0 ? <span className="text-accent/50">•</span> : null}
                        <span className="label-sm text-muted">{d}</span>
                      </span>
                    ))}
                  </motion.div>
                ) : null}
              </AnimatePresence>

              {/* Access granted. */}
              <AnimatePresence>
                {phase >= PHASES.GRANTED ? (
                  <motion.div
                    key="granted"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: morph ? 0 : 1, y: 0, scale: morph ? 0.96 : 1 }}
                    transition={{ duration: morph ? 0.22 : 0.38, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-10 flex items-center gap-2.5 border border-accent/25 bg-accent/[0.06] px-3.5 py-2"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_rgba(69,212,238,0.9)]" />
                    <span className="label-sm text-accent">ACCESS GRANTED</span>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            {/* Skip. */}
            <motion.button
              type="button"
              onClick={finish}
              animate={{ opacity: morph ? 0 : 1 }}
              transition={{ duration: 0.2 }}
              className="group pointer-events-auto absolute bottom-6 right-6 flex items-center gap-2.5 px-2 py-1.5 text-faint t-base hover:text-ink sm:bottom-10 sm:right-10"
            >
              <span className="label-sm">SKIP</span>
              <kbd className="mono rounded-[2px] border border-line px-1.5 py-0.5 text-[9px] tracking-widest text-ghost t-base group-hover:border-accent/40 group-hover:text-accent">
                ESC
              </kbd>
            </motion.button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function SysLabel({
  children,
  show,
  delay = 0,
  tone = "muted",
}: {
  children: string;
  show: boolean;
  delay?: number;
  tone?: "muted" | "accent";
}) {
  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, delay, ease: "easeOut" }}
          className="flex items-center gap-2"
        >
          <span className={cn("h-px w-3", tone === "accent" ? "bg-accent" : "bg-ghost")} />
          <span className={cn("label-sm", tone === "accent" ? "text-accent" : "text-faint")}>
            {children}
          </span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function Brackets({ fade }: { fade: boolean }) {
  const corner = "absolute h-4 w-4 border-accent/25";
  return (
    <motion.div
      aria-hidden
      animate={{ opacity: fade ? 0 : 1, scale: fade ? 1.04 : 1 }}
      transition={{ duration: 0.3, ease: [0.65, 0, 0.2, 1] }}
      className="pointer-events-none absolute inset-4 sm:inset-8"
    >
      <span className={cn(corner, "left-0 top-0 border-l border-t")} />
      <span className={cn(corner, "right-0 top-0 border-r border-t")} />
      <span className={cn(corner, "bottom-0 left-0 border-b border-l")} />
      <span className={cn(corner, "bottom-0 right-0 border-b border-r")} />
    </motion.div>
  );
}

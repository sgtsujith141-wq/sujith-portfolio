/* ══════════════════════════════════════════════════════════════════════
 *  THE MOTION SYSTEM
 *
 *  One place that decides how this site moves. Every curve, duration and
 *  spring comes from here, and the matching CSS utilities in globals.css
 *  (.t-fast / .t-base / .t-slow) use the same curves, so a DOM hover and
 *  a Motion animation never disagree.
 *
 *  The rule behind the numbers: everything that arrives uses `out` — a
 *  fast start that settles long and softly, which is what reads as
 *  expensive rather than clicky. Nothing uses a linear or symmetric
 *  ease-in-out for an entrance.
 * ══════════════════════════════════════════════════════════════════════ */

/** Primary curve. Quick off the mark, long tail. Use for anything entering. */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
/** Symmetric. Use only when something moves from A to B and back. */
export const EASE_IN_OUT = [0.76, 0, 0.24, 1] as const;
/** Gentler out-curve for small state changes: hovers, toggles, swaps. */
export const EASE_SOFT = [0.33, 1, 0.68, 1] as const;

export const DUR = {
  /** Immediate feedback — a button acknowledging a pointer. */
  fast: 0.22,
  /** The default for state changes. */
  base: 0.42,
  /** Entrances and reveals. */
  slow: 0.9,
  /** Display type rising from behind a mask. */
  reveal: 1.05,
} as const;

/** Springs, for things that should feel physical rather than timed. */
export const SPRING = {
  /** Pointer-following: magnetic buttons, tilt. Settles with no wobble. */
  pointer: { stiffness: 220, damping: 26, mass: 0.5 },
  /** Larger surfaces easing into place. */
  panel: { stiffness: 140, damping: 24, mass: 0.7 },
} as const;

/** Standard entrance, shared by every reveal on the site. */
export const enter = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: DUR.slow, ease: EASE_OUT },
} as const;

/** Viewport trigger used everywhere, so nothing pops in at a different point. */
export const VIEWPORT = { once: true, amount: 0.25, margin: "0px 0px -8% 0px" } as const;

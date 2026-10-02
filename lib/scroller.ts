import { clamp } from "./utils";

/* ══════════════════════════════════════════════════════════════════════
 *  Eased scrolling. Mouse wheels and the keyboard (arrows, Page Up/Down,
 *  Space, Home, End) glide with inertia instead of stepping: a frame-rate
 *  independent lerp of 0.075 per 60 fps frame. Touch keeps its native
 *  momentum. Horizontal wheel gestures, pinch-zoom and inner scrollable
 *  areas ([data-lenis-prevent]) are left alone. Disabled entirely under
 *  prefers-reduced-motion, where every call falls back to native jumps.
 * ══════════════════════════════════════════════════════════════════════ */

const EASE = 0.075;
let enabled = false;
let target = 0;
let cur = 0;
let running = false;
let stopped = false;
let last = 0;

const maxY = () => Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

function loop(now: number) {
  const dt = Math.min(64, now - (last || now - 16.67));
  last = now;
  cur += (target - cur) * (1 - Math.pow(1 - EASE, dt / 16.67));
  if (Math.abs(target - cur) < 0.35) {
    cur = target;
    running = false;
  }
  window.scrollTo(0, cur);
  if (running) requestAnimationFrame(loop);
  else last = 0;
}

function kick() {
  if (!running) {
    running = true;
    cur = window.scrollY;
    last = 0;
    requestAnimationFrame(loop);
  }
}

function nudge(d: number) {
  if (!running) target = window.scrollY;
  target = clamp(target + d, 0, maxY());
  kick();
}

function onWheel(e: WheelEvent) {
  if (e.ctrlKey) return;
  if (stopped) {
    e.preventDefault();
    return;
  }
  if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
  const inner = (e.target as Element | null)?.closest?.("[data-lenis-prevent]") as HTMLElement | null;
  if (inner && inner.scrollHeight > inner.clientHeight + 1) return;
  e.preventDefault();
  let d = e.deltaY;
  if (e.deltaMode === 1) d *= 16;
  else if (e.deltaMode === 2) d *= window.innerHeight;
  nudge(d);
}

function onKey(e: KeyboardEvent) {
  if (stopped || e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
  const t = e.target as Element | null;
  if (t?.closest?.("input,textarea,select,button,[contenteditable],[role=switch]")) return;
  const vh = window.innerHeight;
  let d: number | null = null;
  if (e.key === "ArrowDown") d = 90;
  else if (e.key === "ArrowUp") d = -90;
  else if (e.key === "PageDown" || (e.key === " " && !e.shiftKey)) d = vh * 0.85;
  else if (e.key === "PageUp" || (e.key === " " && e.shiftKey)) d = -vh * 0.85;
  else if (e.key === "Home") d = -1e7;
  else if (e.key === "End") d = 1e7;
  if (d === null) return;
  e.preventDefault();
  nudge(d);
}

function onScroll() {
  if (!running) target = cur = window.scrollY;
}

export const scroller = {
  init() {
    if (enabled || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};
    enabled = true;
    target = cur = window.scrollY;
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      enabled = false;
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
    };
  },
  /** Scroll to a y position or an element (with an offset). */
  to(y: number | Element, o: { offset?: number; immediate?: boolean } = {}) {
    let ty = typeof y === "number" ? y : y.getBoundingClientRect().top + window.scrollY + (o.offset ?? 0);
    ty = clamp(ty, 0, maxY());
    if (!enabled || o.immediate) {
      running = false;
      target = cur = ty;
      window.scrollTo({ top: ty, behavior: "instant" as ScrollBehavior });
      return;
    }
    target = ty;
    kick();
  },
  stop() {
    stopped = true;
    running = false;
  },
  start() {
    stopped = false;
    target = cur = window.scrollY;
  },
};

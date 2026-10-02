import { clamp, reducedMotion } from "./utils";

export const GLYPHS = "0123456789ABCDEF#$%&/\\<>=+*";

/** Frame for a decrypt at progress p (0..1): settled letters left to right, glyphs elsewhere. */
export function scrambleFrame(text: string, p: number) {
  let out = "";
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    out += c === " " || p * 1.15 > i / text.length + 0.15 ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0];
  }
  return out;
}

/** Runs a decrypt on a plain DOM node React does not render text into. */
export function decryptEl(el: HTMLElement, text: string, dur = 900, delay = 0) {
  el.setAttribute("aria-label", text);
  if (reducedMotion()) {
    el.textContent = text;
    return () => {};
  }
  const t0 = performance.now() + delay;
  let raf = 0;
  const tick = (now: number) => {
    const p = clamp((now - t0) / dur, 0, 1);
    el.textContent = scrambleFrame(text, p);
    if (p < 1) raf = requestAnimationFrame(tick);
    else el.textContent = text;
  };
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}

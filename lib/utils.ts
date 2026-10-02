export const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
export const rand = (a: number, b: number) => a + Math.random() * (b - a);
export const pad2 = (n: number) => String(n).padStart(2, "0");
export const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/** Client-only checks. Both are false on the server. */
export const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
export const finePointer = () => typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Scroll to a section id, honouring the fixed nav height and reduced motion. */
export function scrollToSection(id: string) {
  if (typeof document === "undefined") return;
  const el = document.getElementById(id);
  if (!el) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const top = el.getBoundingClientRect().top + window.scrollY - 72;
  window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
  // Keep the keyboard in sync with the viewport.
  el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
}

export const isMac = () =>
  typeof navigator !== "undefined" && /Mac|iPhone|iPad/i.test(navigator.platform || navigator.userAgent);

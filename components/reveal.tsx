"use client";

import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from "react";
import { clamp, reducedMotion } from "@/lib/utils";
import { scrambleFrame } from "@/lib/decrypt";

/* Scroll-entry primitives. Their hidden starting states are CSS scoped
 * under html.js, and the reduced-motion media query shows everything, so
 * nothing here ever has to run for the content to be readable. */

/** Calls onEnter once when the element is visible enough. Never under reduced motion. */
function useOnce(ref: React.RefObject<Element | null>, onEnter: () => void, threshold = 0.12, rootMargin = "0px 0px -6% 0px") {
  const cb = useRef(onEnter);
  useEffect(() => {
    cb.current = onEnter;
  });
  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion() || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          cb.current();
          io.disconnect();
        }
      },
      { threshold, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold, rootMargin]);
}

/**
 * Adds a class when the element scrolls into view.
 *  kind "rv"   fade and rise          kind "clip"  left-to-right wipe
 *  kind "stag" children stagger in    kind "sec"   section divider draws across
 */
export function Reveal({
  as: Tag = "div",
  kind = "rv",
  delay = 0,
  className,
  style,
  children,
  ...rest
}: {
  as?: ElementType;
  kind?: "rv" | "clip" | "stag" | "sec";
  delay?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
} & Record<string, unknown>) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setIn] = useState(false);
  useOnce(ref, () => setIn(true), kind === "sec" ? 0.05 : 0.12);
  useEffect(() => {
    if (kind !== "stag" || !ref.current) return;
    Array.from(ref.current.children).forEach((c, i) => (c as HTMLElement).style.setProperty("--k", String(i)));
  }, [kind]);
  const base = kind;
  const on = kind === "sec" ? "seen" : "in";
  return (
    <Tag
      ref={ref}
      className={[className, base, inView ? on : ""].filter(Boolean).join(" ")}
      style={delay ? { ...style, transitionDelay: `${delay}ms` } : style}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Heading text that decrypts from glyphs, read out as plain text through aria-label. */
export function Decrypt({
  as: Tag = "h2",
  text,
  className,
  dur = 900,
  delay = 0,
  onMount = false,
  id,
  tabIndex,
}: {
  as?: ElementType;
  text: string;
  className?: string;
  dur?: number;
  delay?: number;
  /** Run on mount instead of waiting to be scrolled into view. */
  onMount?: boolean;
  id?: string;
  tabIndex?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(text);
  const raf = useRef(0);
  const run = useRef(() => {});
  useEffect(() => {
    run.current = () => {
      cancelAnimationFrame(raf.current);
      const t0 = performance.now() + delay;
      const tick = (now: number) => {
        const p = clamp((now - t0) / dur, 0, 1);
        setShown(p >= 1 ? text : scrambleFrame(text, p));
        if (p < 1) raf.current = requestAnimationFrame(tick);
      };
      raf.current = requestAnimationFrame(tick);
    };
  });
  useOnce(ref, () => !onMount && run.current(), 0.6, "0px");
  useEffect(() => {
    if (onMount && !reducedMotion()) run.current();
    const r = raf;
    return () => cancelAnimationFrame(r.current);
  }, [onMount, text]);
  return (
    <Tag ref={ref} className={className} id={id} tabIndex={tabIndex} aria-label={text}>
      <span aria-hidden="true">{shown}</span>
    </Tag>
  );
}

/** Types its text out with a block cursor when it scrolls into view. */
export function TypeOut({ text, as: Tag = "span", className }: { text: string; as?: ElementType; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  /* -1: not started. The text is present (for no-JS and screen readers)
     but hidden by CSS under html.js until typing begins. */
  const [n, setN] = useState(-1);
  useOnce(
    ref,
    () => {
      let i = 0;
      setN(0);
      const iv = setInterval(() => {
        i++;
        setN(i);
        if (i >= text.length) clearInterval(iv);
      }, 16);
    },
    0.6,
    "0px",
  );
  const state = n < 0 ? "tw-wait" : n < text.length ? "tw" : "";
  /* aria-label is not allowed on generic elements, so the full text is
     kept for screen readers and the typing copy is hidden from them. */
  return (
    <Tag ref={ref} className={[className, state].filter(Boolean).join(" ")}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{n < 0 ? text : text.slice(0, n)}</span>
    </Tag>
  );
}

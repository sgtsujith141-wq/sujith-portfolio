"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { MotionConfig } from "framer-motion";
import type { SceneName } from "./scenes";
import type { WorldEngine } from "./world-engine";

/* ══════════════════════════════════════════════════════════════════════
 *  WORLD PROVIDER
 *
 *  Mounts the single page-wide canvas and decides which scene it should be
 *  in. Three inputs, in priority order:
 *
 *    1. intro     — the opening sequence drives the field directly
 *    2. override  — a component asks for a scene (hovering Systems Lab)
 *    3. scroll    — whichever section is currently being read
 *
 *  The engine itself is imperative, so none of this causes a re-render.
 * ══════════════════════════════════════════════════════════════════════ */

const SECTION_SCENE: Record<string, SceneName> = {
  index: "expand",
  about: "calm",
  projects: "projects",
  cybersecurity: "cyber",
  capabilities: "calm",
  hackathons: "timeline",
  contact: "dissolve",
};

interface WorldApi {
  /** Highlight one projects cluster; -1 clears. */
  setFocus: (index: number) => void;
  /** Ask for a scene regardless of scroll position; null releases. */
  setOverride: (scene: SceneName | null) => void;
  /** Used only by the opening sequence. */
  setIntroScene: (scene: SceneName | null) => void;
  ready: boolean;
}

const Ctx = createContext<WorldApi | null>(null);

export function useWorld() {
  // Safe to call from anywhere; a null world simply means "no canvas yet".
  return (
    useContext(Ctx) ?? {
      setFocus: () => {},
      setOverride: () => {},
      setIntroScene: () => {},
      ready: false,
    }
  );
}

export function WorldProvider({ children }: { children: ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<WorldEngine | null>(null);
  const [ready, setReady] = useState(false);

  const intro = useRef<SceneName | null>(null);
  const override = useRef<SceneName | null>(null);
  const scroll = useRef<SceneName>("expand");

  const resolve = useCallback(() => {
    const e = engineRef.current;
    if (!e) return;
    e.setScene(intro.current ?? override.current ?? scroll.current);
  }, []);

  /* ── engine lifecycle ─────────────────────────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cancelled = false;
    let cleanup: (() => void) | undefined;

    // The engine is loaded on idle so it never competes with first paint.
    import("./world-engine").then(({ WorldEngine }) => {
      if (cancelled || !canvasRef.current) return;
      const engine = new WorldEngine(canvasRef.current);
      engineRef.current = engine;
      setReady(true);
      resolve();

      const onResize = () => engine.resize();
      const onVisibility = () => engine.setVisible(!document.hidden);

      let pointerRaf = 0;
      let px = 0;
      let py = 0;
      const onPointerMove = (ev: PointerEvent) => {
        if (ev.pointerType !== "mouse") return;
        px = ev.clientX;
        py = ev.clientY;
        // Coalesce to one update per frame — pointermove can fire far more.
        if (pointerRaf) return;
        pointerRaf = requestAnimationFrame(() => {
          pointerRaf = 0;
          engine.setPointer(px, py, true);
        });
      };
      const onPointerLeave = () => engine.setPointer(-9999, -9999, false);

      let scrollRaf = 0;
      const onScroll = () => {
        if (scrollRaf) return;
        scrollRaf = requestAnimationFrame(() => {
          scrollRaf = 0;
          const max = document.documentElement.scrollHeight - window.innerHeight;
          engine.setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
        });
      };
      onScroll();

      window.addEventListener("resize", onResize, { passive: true });
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.addEventListener("pointerleave", onPointerLeave);
      document.addEventListener("visibilitychange", onVisibility);

      cleanup = () => {
        cancelAnimationFrame(pointerRaf);
        cancelAnimationFrame(scrollRaf);
        window.removeEventListener("resize", onResize);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("pointermove", onPointerMove);
        document.removeEventListener("pointerleave", onPointerLeave);
        document.removeEventListener("visibilitychange", onVisibility);
        engine.destroy();
        engineRef.current = null;
      };
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [resolve]);

  /* ── scroll → scene ───────────────────────────────────────────────── */
  useEffect(() => {
    if (!ready) return;
    const ids = Object.keys(SECTION_SCENE);
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const id = visible[0]?.target.id;
        if (!id) return;
        const next = SECTION_SCENE[id];
        if (next && next !== scroll.current) {
          scroll.current = next;
          resolve();
        }
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 },
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ready, resolve]);

  const api = useMemo<WorldApi>(
    () => ({
      ready,
      setFocus: (index: number) => engineRef.current?.setFocus(index),
      setOverride: (scene: SceneName | null) => {
        override.current = scene;
        resolve();
      },
      setIntroScene: (scene: SceneName | null) => {
        intro.current = scene;
        resolve();
      },
    }),
    [ready, resolve],
  );

  return (
    <Ctx.Provider value={api}>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      />
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </Ctx.Provider>
  );
}

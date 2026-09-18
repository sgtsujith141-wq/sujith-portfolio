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
import { MotionConfig } from "motion/react";
import { sectionIds } from "@/content/navigation";
import type { ProjectSlug, SectionId } from "@/lib/types";
import type { LivingSystemEngine } from "./engine/engine";

/* ══════════════════════════════════════════════════════════════════════
 *  LIVING SYSTEM PROVIDER
 *
 *  Mounts the single page-wide canvas and feeds the engine three inputs:
 *    · which section is being read and how far through it (scroll)
 *    · which project is focused (the case-study tabs and scroll)
 *    · which graph node is hovered in the UI (technology chips)
 *
 *  The engine is imperative; none of this re-renders per frame. If the
 *  engine fails to construct (no 2d context), the site simply has a
 *  plain background — nothing else depends on it.
 * ══════════════════════════════════════════════════════════════════════ */

interface LivingSystemApi {
  ready: boolean;
  ignite: () => void;
  setFocus: (slug: ProjectSlug | null) => void;
  setHover: (id: string | null) => void;
  /** Element whose viewport rectangle the focused cluster should fill; null releases. */
  setStage: (el: HTMLElement | null) => void;
  /** Progress of the pinned Selected Work introduction, 0–1. */
  setPhase: (value: number) => void;
}

const Ctx = createContext<LivingSystemApi | null>(null);

export function useLivingSystem(): LivingSystemApi {
  return (
    useContext(Ctx) ?? {
      ready: false,
      ignite: () => {},
      setFocus: () => {},
      setHover: () => {},
      setStage: () => {},
      setPhase: () => {},
    }
  );
}

export function LivingSystem({ children }: { children: ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<LivingSystemEngine | null>(null);
  const [ready, setReady] = useState(false);
  const pendingIgnite = useRef(false);
  const stageEl = useRef<HTMLElement | null>(null);
  const requestUpdate = useRef<() => void>(() => {});

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cancelled = false;
    let cleanup: (() => void) | undefined;

    // Loaded on idle so the engine never competes with first paint.
    import("./engine/engine")
      .then(({ LivingSystemEngine }) => {
        if (cancelled || !canvasRef.current) return;
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const coarse = window.matchMedia("(pointer: coarse)").matches;
        let engine: LivingSystemEngine;
        try {
          engine = new LivingSystemEngine(canvasRef.current, { reduced, coarse });
        } catch {
          return;
        }
        engineRef.current = engine;
        setReady(true);
        if (pendingIgnite.current || reduced) engine.ignite();

        /* Section + progress from scroll. Rects are cached and refreshed on
         * resize and whenever the document height changes. */
        let rects: Array<{ id: SectionId; top: number; height: number }> = [];
        const measure = () => {
          const y = window.scrollY;
          rects = sectionIds
            .map((id) => {
              const el = document.getElementById(id);
              if (!el) return null;
              const r = el.getBoundingClientRect();
              return { id, top: r.top + y, height: Math.max(1, r.height) };
            })
            .filter((r): r is { id: SectionId; top: number; height: number } => Boolean(r));
        };

        let scrollRaf = 0;
        const update = () => {
          scrollRaf = 0;
          if (!rects.length) measure();
          const mid = window.scrollY + window.innerHeight * 0.5;
          let current = rects[0];
          for (const r of rects) if (mid >= r.top) current = r;
          if (!current) return;
          const progress = Math.max(0, Math.min(1, (mid - current.top) / current.height));
          engine.setSection(current.id, progress);
          const el = stageEl.current;
          if (el) {
            const r = el.getBoundingClientRect();
            engine.setStage(
              r.width > 0 && r.height > 0
                ? { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height }
                : null,
            );
          } else {
            engine.setStage(null);
          }
        };
        const onScroll = () => {
          if (!scrollRaf) scrollRaf = requestAnimationFrame(update);
        };
        requestUpdate.current = onScroll;

        const ro = new ResizeObserver(() => {
          measure();
          engine.resize();
          onScroll();
        });
        ro.observe(document.body);

        let pointerRaf = 0;
        let px = 0;
        let py = 0;
        const onPointerMove = (ev: PointerEvent) => {
          if (ev.pointerType !== "mouse") return;
          px = ev.clientX;
          py = ev.clientY;
          if (pointerRaf) return;
          pointerRaf = requestAnimationFrame(() => {
            pointerRaf = 0;
            engine.setPointer(px, py, true);
          });
        };
        const onPointerLeave = () => engine.setPointer(0, 0, false);
        const onVisibility = () => engine.setVisible(!document.hidden);

        measure();
        update();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("pointermove", onPointerMove, { passive: true });
        document.addEventListener("pointerleave", onPointerLeave);
        document.addEventListener("visibilitychange", onVisibility);

        cleanup = () => {
          requestUpdate.current = () => {};
          cancelAnimationFrame(scrollRaf);
          cancelAnimationFrame(pointerRaf);
          ro.disconnect();
          window.removeEventListener("scroll", onScroll);
          window.removeEventListener("pointermove", onPointerMove);
          document.removeEventListener("pointerleave", onPointerLeave);
          document.removeEventListener("visibilitychange", onVisibility);
          engine.destroy();
          engineRef.current = null;
        };
      })
      .catch(() => {
        /* The page works without the background. */
      });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  const ignite = useCallback(() => {
    if (engineRef.current) engineRef.current.ignite();
    else pendingIgnite.current = true;
  }, []);

  const api = useMemo<LivingSystemApi>(
    () => ({
      ready,
      ignite,
      setFocus: (slug) => {
        engineRef.current?.setFocus(slug);
        requestUpdate.current();
      },
      setHover: (id) => engineRef.current?.setHover(id),
      setStage: (el) => {
        stageEl.current = el;
        requestUpdate.current();
      },
      setPhase: (value) => engineRef.current?.setPhase(value),
    }),
    [ready, ignite],
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

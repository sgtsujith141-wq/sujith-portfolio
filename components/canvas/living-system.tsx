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
import { usePathname } from "next/navigation";
import { MotionConfig } from "motion/react";
import { sectionIds } from "@/content/navigation";
import type { DomainId, ProjectSlug, SectionId } from "@/lib/types";
import type { FormationName } from "./engine/formations";
import type { LivingSystemEngine } from "./engine/engine";

/* ══════════════════════════════════════════════════════════════════════
 *  LIVING SYSTEM PROVIDER
 *
 *  Mounts the single page-wide canvas — in the root layout, so it is the
 *  same canvas on every route and navigating between the home page and
 *  /work never resets the field. It feeds the engine:
 *
 *    · which formation to hold and how far through it (scroll + route)
 *    · which project is focused (case studies)
 *    · which domain is selected (the signature network)
 *    · a DOM-measured stage rectangle the formation should fill
 *    · the pointer
 *
 *  The engine is imperative, so none of this re-renders React. If it
 *  cannot construct, the site simply has a plain background.
 * ══════════════════════════════════════════════════════════════════════ */

interface LivingSystemApi {
  ready: boolean;
  ignite: () => void;
  setFocus: (slug: ProjectSlug | null) => void;
  setDomain: (id: DomainId | null) => void;
  setHover: (id: string | null) => void;
  /** Element whose rectangle the active formation should fill; null releases. */
  setStage: (el: HTMLElement | null) => void;
  setPhase: (value: number) => void;
}

const noop = () => {};
const fallback: LivingSystemApi = {
  ready: false,
  ignite: noop,
  setFocus: noop,
  setDomain: noop,
  setHover: noop,
  setStage: noop,
  setPhase: noop,
};

const Ctx = createContext<LivingSystemApi | null>(null);

export function useLivingSystem(): LivingSystemApi {
  return useContext(Ctx) ?? fallback;
}

/** Cheap low-power heuristic: few cores, or a coarse pointer with little memory. */
function detectLowPower() {
  if (typeof navigator === "undefined") return false;
  const cores = navigator.hardwareConcurrency ?? 8;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  return cores <= 4 || memory <= 4;
}

export function LivingSystem({ children }: { children: ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<LivingSystemEngine | null>(null);
  const [ready, setReady] = useState(false);
  const pendingIgnite = useRef(false);
  const stageEl = useRef<HTMLElement | null>(null);
  const requestUpdate = useRef<() => void>(noop);
  const pathname = usePathname();
  const routeRef = useRef(pathname);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cancelled = false;
    let cleanup: (() => void) | undefined;
    let igniteTimer = 0;

    import("./engine/engine")
      .then(({ LivingSystemEngine }) => {
        if (cancelled || !canvasRef.current) return;
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const coarse = window.matchMedia("(pointer: coarse)").matches;
        let engine: LivingSystemEngine;
        try {
          engine = new LivingSystemEngine(canvasRef.current, {
            reduced,
            coarse,
            lowPower: detectLowPower(),
          });
        } catch {
          return;
        }
        engineRef.current = engine;
        setReady(true);
        if (pendingIgnite.current || reduced) engine.ignite();
        // Every route needs the field alive, not just the home page whose
        // hero owns the opening choreography. ignite() is idempotent, so
        // whichever fires first wins and the other is a no-op.
        igniteTimer = window.setTimeout(() => engine.ignite(), 240);

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
          const onWork = routeRef.current?.startsWith("/work") ?? false;

          if (onWork || !rects.length) {
            if (onWork) {
              const max = document.documentElement.scrollHeight - window.innerHeight;
              engine.setSection("work-route", max > 0 ? Math.min(1, window.scrollY / max) : 0);
            } else {
              measure();
            }
          }

          if (!onWork) {
            if (!rects.length) measure();
            const mid = window.scrollY + window.innerHeight * 0.5;
            let current = rects[0];
            for (const r of rects) if (mid >= r.top) current = r;
            if (current) {
              const progress = Math.max(0, Math.min(1, (mid - current.top) / current.height));
              engine.setSection(current.id as FormationName, progress);
            }
          }

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
          requestUpdate.current = noop;
          clearTimeout(igniteTimer);
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
        /* The site works without the background. */
      });

    return () => {
      cancelled = true;
      clearTimeout(igniteTimer);
      cleanup?.();
    };
  }, []);

  /* A route change re-measures: the new page has different sections, and
   * anything the old one staged is gone. */
  useEffect(() => {
    routeRef.current = pathname;
    stageEl.current = null;
    engineRef.current?.setFocus(null);
    engineRef.current?.setDomain(null);
    const id = window.setTimeout(() => requestUpdate.current(), 60);
    return () => clearTimeout(id);
  }, [pathname]);

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
      setDomain: (id) => {
        engineRef.current?.setDomain(id);
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

"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { projectBySlug } from "@/content/site";
import { decryptEl } from "@/lib/decrypt";
import { field } from "@/lib/field";
import { scroller } from "@/lib/scroller";
import { clamp, finePointer, reducedMotion, sleep } from "@/lib/utils";

/* ══════════════════════════════════════════════════════════════════════
 *  Site-wide behaviour that is not tied to one section:
 *  · the eased scroller,
 *  · the scroll progress line,
 *  · the square cursor ring (difference blend) and magnetic buttons,
 *  · internal links: in-page anchors glide with the scroller, switching
 *    projects stays inside the explorer, and moving between the home
 *    page and the projects page runs the seven-panel wipe,
 *  · focus moves to the page heading after every route change.
 * ══════════════════════════════════════════════════════════════════════ */

const isProjects = (p: string) => p === "/projects" || p.startsWith("/projects/");

function labelFor(path: string) {
  if (path === "/") return "Sujith C";
  const slug = path.split("/")[2];
  return (slug && projectBySlug(slug)?.name) || "Projects";
}

/** Offset used when gliding to a section; the pinned Projects section starts flush. */
const offsetFor = (id: string) => (id === "work" ? 0 : -76);

function focusHeading(hash: string) {
  let el: HTMLElement | null = null;
  if (hash.length > 1) el = document.getElementById(hash.slice(1))?.querySelector<HTMLElement>("h1,h2") ?? null;
  if (!el) el = document.querySelector<HTMLElement>("main h1");
  if (!el) return;
  if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
  try {
    el.focus({ preventScroll: true });
  } catch {}
}

export function Runtime() {
  const router = useRouter();
  const pathname = usePathname();
  const pathRef = useRef(pathname);
  const waiters = useRef<(() => void)[]>([]);
  const wipeRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const progRef = useRef<HTMLDivElement>(null);

  /* resolve anyone waiting for a navigation to land */
  useEffect(() => {
    pathRef.current = pathname;
    const w = waiters.current.splice(0);
    w.forEach((f) => f());
  }, [pathname]);

  useEffect(() => {
    const html = document.documentElement;
    const RM = reducedMotion();
    const FINE = finePointer();
    const stopScroller = scroller.init();
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    router.prefetch("/");
    router.prefetch("/projects");

    /* ── scroll progress line ── */
    let tick = false;
    const prog = () => {
      tick = false;
      const max = Math.max(1, html.scrollHeight - window.innerHeight);
      if (progRef.current) progRef.current.style.transform = `scaleX(${clamp(window.scrollY / max, 0, 1)})`;
    };
    const onScroll = () => {
      if (!tick) {
        tick = true;
        requestAnimationFrame(prog);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    /* ── cursor ring + magnetic buttons ── */
    let cmx = -200, cmy = -200, rx = -200, ry = -200, raf = 0, lastMove = 0;
    const ring = ringRef.current!, dot = dotRef.current!, ringLab = ring.querySelector("b")!;
    const cursorOn = FINE && !RM;
    if (cursorOn) {
      ring.style.display = "block";
      dot.style.display = "block";
    }
    const onMove = (e: PointerEvent) => {
      cmx = e.clientX;
      cmy = e.clientY;
      lastMove = performance.now();
      if (!cursorOn) return;
      const t = e.target as Element | null;
      const act = t?.closest?.("a,button,input,[data-cursor]");
      const lab = t?.closest?.("[data-cursor]") as HTMLElement | null;
      ring.classList.toggle("act", !!act);
      if (lab) {
        ringLab.textContent = lab.dataset.cursor ?? "";
        ring.classList.add("lab");
      } else ring.classList.remove("lab");
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    type Mag = HTMLElement & { _m?: [number, number] };
    const loop = (now: number) => {
      if (cursorOn) {
        rx += (cmx - rx) * 0.22;
        ry += (cmy - ry) * 0.22;
        ring.style.transform = `translate(${rx}px,${ry}px)`;
        dot.style.transform = `translate(${cmx}px,${cmy}px)`;
        /* Magnetic pull, only while the pointer is moving or settling. */
        if (now - lastMove < 1200) {
          document.querySelectorAll<Mag>(".mag").forEach((b) => {
            const r = b.getBoundingClientRect();
            if (r.bottom < -50 || r.top > window.innerHeight + 50) return;
            const dx = cmx - (r.left + r.width / 2), dy = cmy - (r.top + r.height / 2), d = Math.hypot(dx, dy), R = 100;
            const tx = d < R ? dx * 0.2 : 0, ty = d < R ? dy * 0.28 : 0;
            const cur = b._m || (b._m = [0, 0]);
            cur[0] += (tx - cur[0]) * 0.18;
            cur[1] += (ty - cur[1]) * 0.18;
            b.style.transform = Math.abs(cur[0]) < 0.05 && Math.abs(cur[1]) < 0.05 ? "" : `translate(${cur[0].toFixed(2)}px,${cur[1].toFixed(2)}px)`;
          });
        }
      }
      raf = requestAnimationFrame(loop);
    };
    if (cursorOn) raf = requestAnimationFrame(loop);

    /* ── route transition ── */
    let transitioning = false;
    const waitForPath = (path: string) =>
      pathRef.current === path
        ? Promise.resolve()
        : Promise.race([new Promise<void>((r) => waiters.current.push(r)), sleep(4000)]);

    async function wipeRun(label: string, mid: () => Promise<void>) {
      const wipe = wipeRef.current!;
      const cols = Array.from(wipe.querySelectorAll<HTMLElement>(".cols i"));
      const lab = wipe.querySelector<HTMLElement>(".lab")!;
      if (RM) {
        await mid();
        return;
      }
      wipe.classList.add("on");
      lab.textContent = label;
      const ease = "cubic-bezier(.7,0,.2,1)";
      await Promise.all(cols.map((c, i) => c.animate([{ transform: "scaleY(0)" }, { transform: "scaleY(1)" }], { duration: 440, delay: i * 45, easing: ease, fill: "forwards" }).finished));
      lab.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 260, fill: "forwards" });
      decryptEl(lab, label, 420);
      await Promise.all([mid(), sleep(500)]);
      field.pulse();
      lab.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, fill: "forwards" });
      cols.forEach((c) => (c.style.transformOrigin = "top"));
      await Promise.all(cols.map((c, i) => c.animate([{ transform: "scaleY(1)" }, { transform: "scaleY(0)" }], { duration: 500, delay: i * 45, easing: ease, fill: "forwards" }).finished));
      cols.forEach((c) => {
        c.getAnimations().forEach((a) => a.cancel());
        c.style.transformOrigin = "bottom";
      });
      lab.getAnimations().forEach((a) => a.cancel());
      lab.style.opacity = "0";
      wipe.classList.remove("on");
    }

    function glideTo(hash: string) {
      const id = decodeURIComponent(hash.slice(1));
      const el = document.getElementById(id);
      if (el) scroller.to(el, { offset: offsetFor(id) });
    }

    async function navigate(url: URL) {
      const here = pathRef.current;
      const path = url.pathname;
      document.dispatchEvent(new Event("sujith:navigate"));
      /* same page: glide */
      if (path === here) {
        if (url.hash.length > 1) {
          history.pushState(null, "", url.pathname + url.hash);
          glideTo(url.hash);
        } else {
          history.pushState(null, "", url.pathname);
          scroller.to(0);
        }
        return;
      }
      /* project to project: the explorer animates its own panel */
      if (isProjects(path) && isProjects(here)) {
        router.push(path, { scroll: false });
        return;
      }
      if (transitioning) return;
      transitioning = true;
      try {
        await wipeRun(labelFor(path), async () => {
          router.push(path + url.hash, { scroll: false });
          await waitForPath(path);
          /* let the new page paint before measuring it */
          await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
          const id = url.hash.slice(1);
          const target = id ? document.getElementById(decodeURIComponent(id)) : null;
          if (target) scroller.to(target, { offset: offsetFor(id), immediate: true });
          else scroller.to(0, { immediate: true });
          window.dispatchEvent(new Event("resize"));
          focusHeading(url.hash);
        });
      } finally {
        transitioning = false;
      }
    }

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank" || a.hasAttribute("download") || a.classList.contains("skip")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      /* static files (the resume) open normally */
      if (/\.[a-z0-9]+$/i.test(url.pathname)) return;
      e.preventDefault();
      navigate(url);
    };
    document.addEventListener("click", onClick, true);

    /* browser back / forward between routes: no wipe, just land correctly */
    const onPop = () => {
      requestAnimationFrame(() => {
        if (location.hash.length > 1) glideTo(location.hash);
      });
    };
    window.addEventListener("popstate", onPop);

    return () => {
      stopScroller();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPop);
    };
  }, [router]);

  return (
    <>
      <div className="progress" ref={progRef} aria-hidden="true" />
      <div className="cur ring" ref={ringRef} aria-hidden="true">
        <i>
          <b />
        </i>
      </div>
      <div className="cur dot" ref={dotRef} aria-hidden="true">
        <i />
      </div>
      <div className="wipe" ref={wipeRef} aria-hidden="true">
        <div className="cols">
          {Array.from({ length: 7 }, (_, i) => (
            <i key={i} />
          ))}
        </div>
        <div className="lab" />
      </div>
    </>
  );
}

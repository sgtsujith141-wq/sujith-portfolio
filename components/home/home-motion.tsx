"use client";

import { useEffect } from "react";
import { scroller } from "@/lib/scroller";
import { clamp, easeOut, finePointer, pad2, reducedMotion } from "@/lib/utils";

/* ══════════════════════════════════════════════════════════════════════
 *  Scroll-linked effects on the home page, in one rAF-throttled pass:
 *  · hero: the name's letters drift apart and fade as you leave,
 *  · projects: vertical scroll drives the pinned horizontal track
 *    (the section is exactly as tall as the sideways travel),
 *  · hackathons: the timeline line draws down, events light up,
 *  · contact: LET'S TALK scales in.
 *  Plus the card tilt and keyboard focus scrolling a card into view.
 * ══════════════════════════════════════════════════════════════════════ */
export function HomeMotion() {
  useEffect(() => {
    const RM = reducedMotion();
    const FINE = finePointer();
    const html = document.documentElement;
    const $ = (s: string) => document.querySelector<HTMLElement>(s);
    const nameEl = $("#name")!, letters = Array.from(document.querySelectorAll<HTMLElement>("#name .ch"));
    const fades = ["#hWho", "#hCtas", "#hHint", "#hStatus"].map($).filter(Boolean) as HTMLElement[];
    const work = $("#work")!, track = $("#wTrack")!, bar = $("#wBar")!, idx = $("#wIdx")!;
    const cards = Array.from(track.querySelectorAll<HTMLElement>(".wcard"));
    const tl = $("#tl")!, tlFill = $("#tlFill")!, tlItems = Array.from(tl.querySelectorAll<HTMLElement>("li"));
    const talk = $("#talk")!, contact = $("#contact")!;
    let wDist = 0;

    const sizeWork = () => {
      wDist = Math.max(0, track.scrollWidth - window.innerWidth);
      work.style.height = `${window.innerHeight + wDist}px`;
    };

    const update = () => {
      const vh = window.innerHeight, y = window.scrollY;
      const k = RM ? 0 : clamp(y / (vh * 0.9), 0, 1), c = (letters.length - 1) / 2;
      letters.forEach((l, i) => {
        l.style.transform = k > 0 ? `translate3d(${((i - c) * k * 26).toFixed(1)}px,${(-k * k * 30).toFixed(1)}px,0)` : "";
      });
      nameEl.style.opacity = String(1 - k * 0.95);
      if (!html.classList.contains("booting")) fades.forEach((el) => (el.style.opacity = String(1 - k * 1.2)));

      const r = work.getBoundingClientRect(), p = clamp(-r.top / (wDist || 1), 0, 1);
      track.style.transform = `translate3d(${-p * wDist}px,0,0)`;
      bar.style.width = `${p * 100}%`;
      idx.textContent = pad2(Math.round(p * (cards.length - 1)) + 1);

      const tr = tl.getBoundingClientRect(), tp = clamp((vh * 0.62 - tr.top) / Math.max(1, tr.height), 0, 1);
      tlFill.style.height = `${(tp * (tr.height - 16)).toFixed(1)}px`;
      tlItems.forEach((li) => li.classList.toggle("on", RM || tp * tr.height >= li.offsetTop - 4));

      const cr = contact.getBoundingClientRect(), cp = RM ? 1 : easeOut(clamp((vh - cr.top) / (vh * 0.85), 0, 1));
      talk.style.transform = `scale(${(0.55 + 0.45 * cp).toFixed(4)})`;
      talk.style.opacity = (0.15 + 0.85 * cp).toFixed(3);
    };

    let tick = false;
    const onScroll = () => {
      if (!tick) {
        tick = true;
        requestAnimationFrame(() => {
          tick = false;
          update();
        });
      }
    };
    const onResize = () => {
      sizeWork();
      update();
    };
    sizeWork();
    update();
    document.fonts?.ready.then(onResize);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    /* card tilt toward the cursor */
    const offs: (() => void)[] = [];
    cards.forEach((cd, i) => {
      const move = (e: PointerEvent) => {
        if (!FINE || RM) return;
        const b = cd.getBoundingClientRect(), px = (e.clientX - b.left) / b.width - 0.5, py = (e.clientY - b.top) / b.height - 0.5;
        cd.style.transform = `perspective(900px) rotateX(${(-py * 7).toFixed(2)}deg) rotateY(${(px * 9).toFixed(2)}deg) translateY(-8px)`;
      };
      const leave = () => (cd.style.transform = "");
      /* keyboard focus scrolls the card into view inside the pinned track */
      const focus = () => {
        const top = work.getBoundingClientRect().top + window.scrollY;
        scroller.to(top + wDist * (i / Math.max(1, cards.length - 1)), { immediate: true });
      };
      cd.addEventListener("pointermove", move);
      cd.addEventListener("pointerleave", leave);
      cd.addEventListener("focus", focus);
      offs.push(() => {
        cd.removeEventListener("pointermove", move);
        cd.removeEventListener("pointerleave", leave);
        cd.removeEventListener("focus", focus);
      });
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      offs.forEach((f) => f());
    };
  }, []);
  return null;
}

"use client";

import { useEffect, useRef } from "react";
import { field } from "@/lib/field";
import { scroller } from "@/lib/scroller";
import { clamp, reducedMotion, sleep } from "@/lib/utils";

/* ══════════════════════════════════════════════════════════════════════
 *  Startup animation: CRT power-on + SSH session. Plays on every load.
 *  1. Standby: a glowing power dot pulses while it connects to sujith.c,
 *     with a counter to 100.
 *  2. Power on: the dot snaps into a bright line, the line opens to the
 *     full screen, and the white flash flickers down into a dark CRT with
 *     scanlines and a vignette.
 *  3. An SSH login plays on the screen.
 *  4. The scanlines fade and the terminal shrinks into the SUJITH C_ logo
 *     in the top bar while the hero appears.
 *  Progress only starts once the tab is visible. Skip (button or Esc)
 *  jumps straight to step 4. Skipped entirely under reduced motion: the
 *  inline gate in the layout never adds .booting in that case.
 * ══════════════════════════════════════════════════════════════════════ */

declare global {
  interface Window {
    __bootStarted?: boolean;
  }
}

export const REPLAY_EVENT = "sujith:replay-intro";

const whenVisible = () =>
  document.visibilityState === "visible"
    ? Promise.resolve()
    : new Promise<void>((r) => {
        const h = () => {
          if (document.visibilityState === "visible") {
            document.removeEventListener("visibilitychange", h);
            r();
          }
        };
        document.addEventListener("visibilitychange", h);
      });

const fontsReady = (ms: number) => Promise.race([document.fonts ? document.fonts.ready.then(() => {}) : Promise.resolve(), sleep(ms)]);

function heroReveal() {
  if (reducedMotion()) return;
  const ease = "cubic-bezier(.2,.8,.2,1)";
  document.querySelectorAll<HTMLElement>("#name .ch").forEach((l, i) =>
    l.animate([{ opacity: 0, transform: "translateY(35%)" }, { opacity: 1, transform: "none" }], { duration: 800, delay: 120 + i * 55, easing: ease, fill: "backwards" }),
  );
  (
    [
      ["#hStatus", 260],
      ["#hWho", 420],
      ["#hCtas", 540],
      ["#hHint", 700],
    ] as const
  ).forEach(([s, d]) =>
    document.querySelector(s)?.animate([{ opacity: 0, transform: "translateY(14px)" }, { opacity: 1, transform: "none" }], { duration: 800, delay: d, easing: ease, fill: "backwards" }),
  );
  document.getElementById("bar")?.animate([{ opacity: 0, transform: "translateY(-10px)" }, { opacity: 1, transform: "none" }], { duration: 800, delay: 400, fill: "backwards", easing: ease });
}

export function Boot() {
  const root = useRef<HTMLDivElement>(null);
  const busy = useRef(false);

  useEffect(() => {
    const html = document.documentElement;
    const $ = <T extends HTMLElement>(s: string) => root.current!.querySelector(s) as T;
    let cancelled = false;

    async function run(replay: boolean) {
      const bootEl = root.current;
      if (!bootEl) return;
      if (reducedMotion()) {
        html.classList.remove("booting");
        return;
      }
      if (busy.current) return;
      busy.current = true;
      window.__bootStarted = true;
      const cover = $<HTMLDivElement>(".bt-cover"), term = $<HTMLDivElement>(".bt-term"), tb = $<HTMLPreElement>(".bt-tb");
      const dot = $<HTMLElement>(".bt-dot"), cap = $<HTMLDivElement>(".bt-cap"), stat = $<HTMLElement>(".bt-cap b"), sub = $<HTMLElement>(".bt-cap span");
      const beam = $<HTMLDivElement>(".bt-beam"), full = $<HTMLDivElement>(".bt-full"), lines = $<HTMLDivElement>(".bt-lines"), vig = $<HTMLDivElement>(".bt-vig");
      const corner = $<HTMLDivElement>(".bt-corner"), pct = $<HTMLElement>(".bt-pct"), skipBtn = $<HTMLButtonElement>(".bskip");

      const reset = (el: HTMLElement) => {
        el.getAnimations().forEach((a) => a.cancel());
        el.style.transform = "";
        el.style.opacity = "";
      };
      [cover, term, dot, cap, beam, full, lines, vig, corner].forEach(reset);
      term.style.opacity = "0";
      term.classList.remove("glow");
      beam.style.opacity = "0";
      full.style.opacity = "0";
      tb.innerHTML = "";
      stat.textContent = "STANDBY";
      sub.textContent = "connecting to sujith.c";
      pct.textContent = "000";
      skipBtn.style.display = "";
      html.classList.add("booting");
      scroller.stop();
      const hash = replay ? "" : location.hash;
      window.scrollTo(0, 0);

      let skip = false;
      skipBtn.onclick = () => {
        skip = true;
      };
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") skip = true;
      };
      window.addEventListener("keydown", onKey);
      const wait = (ms: number) => (skip ? Promise.resolve() : sleep(ms));
      if (replay) skipBtn.focus({ preventScroll: true });

      await whenVisible();
      await fontsReady(700);

      /* 1. standby */
      const pulse = dot.animate([{ opacity: 0.25 }, { opacity: 1 }, { opacity: 0.25 }], { duration: 800, iterations: Infinity });
      let E = 0;
      let last = performance.now();
      await new Promise<void>((res) => {
        const f = (now: number) => {
          const dt = clamp(now - last, 0, 50);
          last = now;
          E = skip ? 1400 : E + dt;
          const e = clamp(E / 1400, 0, 1);
          pct.textContent = String(Math.round(e * 100)).padStart(3, "0");
          sub.textContent = "connecting to sujith.c" + ".".repeat(1 + (Math.floor(e * 7) % 3));
          if (E < 1400) requestAnimationFrame(f);
          else res();
        };
        requestAnimationFrame(f);
      });
      pulse.cancel();

      /* the full session; on skip it is rendered at once */
      const B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
      const fp = "SHA256:" + Array.from({ length: 43 }, () => B64[(Math.random() * 64) | 0]).join("");
      type Line = ["cmd", string] | ["out", string, number] | ["ask", string, string];
      const SESSION: Line[] = [
        ["cmd", "ssh visitor@sujith.c"],
        ["out", "The authenticity of host 'sujith.c' can't be established.", 50],
        ["out", "ED25519 key fingerprint is " + fp + ".", 50],
        ["ask", "Are you sure you want to continue connecting (yes/no)? ", "yes"],
        ["out", "Warning: Permanently added 'sujith.c' to the list of known hosts.", 140],
        ["out", "<b>Welcome to sujith.c</b>", 240],
        ["cmd", "cat about.txt"],
        ["out", "Sujith C · CSE student · cybersecurity, AI and systems", 650],
      ];
      let out = "";
      const render = (caret = true) => {
        tb.innerHTML = out + (caret ? '<span class="bt-caret"></span>' : "");
      };
      const renderAll = () => {
        out = "";
        for (const s of SESSION) {
          if (s[0] === "cmd") out += "<b>$ </b>" + s[1] + "\n";
          else if (s[0] === "ask") out += s[1] + s[2] + "\n";
          else out += s[1] + "\n";
        }
        render(false);
      };

      if (!skip) {
        /* 2. power on */
        stat.textContent = "POWER ON";
        await wait(200);
        [cap, corner].forEach((el) => el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, fill: "forwards" }));
        await dot.animate([{ transform: "scale(1)", opacity: 1 }, { transform: "scale(2.2)", opacity: 1 }, { transform: "scale(.6)", opacity: 0 }], { duration: 200, easing: "ease-in", fill: "forwards" }).finished;
        beam.style.opacity = "1";
        await beam.animate([{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], { duration: 240, easing: "cubic-bezier(.7,0,.2,1)", fill: "forwards" }).finished;
        full.style.opacity = "1";
        await full.animate([{ transform: "scaleY(.002)" }, { transform: "scaleY(1)" }], { duration: 260, easing: "cubic-bezier(.2,.8,.2,1)", fill: "forwards" }).finished;
        beam.style.opacity = "0";
        term.style.opacity = "1";
        term.classList.add("glow");
        lines.animate([{ opacity: 0 }, { opacity: 0.55 }, { opacity: 0.3 }], { duration: 700, fill: "forwards" });
        vig.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 500, fill: "forwards" });
        term.animate(
          [
            { transform: "translate(-50%,-50%) scaleY(.96)", filter: "brightness(2)" },
            { transform: "translate(-50%,-50%) scaleY(1)", filter: "brightness(1)" },
          ],
          { duration: 500, easing: "cubic-bezier(.2,.8,.2,1)" },
        );
        await full.animate(
          [{ opacity: 1 }, { opacity: 0.5, offset: 0.2 }, { opacity: 0.8, offset: 0.3 }, { opacity: 0.15, offset: 0.55 }, { opacity: 0.3, offset: 0.65 }, { opacity: 0 }],
          { duration: 600, easing: "linear", fill: "forwards" },
        ).finished;

        /* 3. ssh session */
        render();
        await wait(250);
        for (const s of SESSION) {
          if (skip || cancelled) break;
          if (s[0] === "cmd") {
            out += "<b>$ </b>";
            for (let i = 0; i < s[1].length && !skip; i++) {
              out += s[1][i];
              render();
              await wait(24);
            }
            out += "\n";
            render();
            await wait(150);
          } else if (s[0] === "ask") {
            out += s[1];
            render();
            await wait(220);
            for (const ch of s[2]) {
              out += ch;
              render();
              await wait(55);
            }
            out += "\n";
            render();
            await wait(110);
          } else {
            out += s[1] + "\n";
            render();
            await wait(s[2]);
          }
        }
      } else {
        [cap, corner, dot].forEach((el) => el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
        term.style.opacity = "1";
      }
      renderAll();
      skipBtn.style.display = "none";
      const sp = skip ? 0.6 : 1;

      /* 4. shrink into the logo */
      lines.animate([{ opacity: getComputedStyle(lines).opacity }, { opacity: 0 }], { duration: 400 * sp, fill: "forwards" });
      vig.animate([{ opacity: getComputedStyle(vig).opacity }, { opacity: 0 }], { duration: 500 * sp, fill: "forwards" });
      const logo = document.querySelector("#bar .id");
      const lg = logo ? logo.getBoundingClientRect() : new DOMRect(20, 14, 100, 24);
      const tr = term.getBoundingClientRect();
      const sc = lg.width / tr.width;
      const dx = lg.left + lg.width / 2 - (tr.left + tr.width / 2);
      const dy = lg.top + lg.height / 2 - (tr.top + tr.height / 2);
      field.pulse(window.innerWidth / 2, window.innerHeight / 2);
      setTimeout(() => {
        html.classList.remove("booting");
        heroReveal();
      }, 200 * sp);
      cover.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 800 * sp, delay: 200 * sp, fill: "forwards" });
      await term.animate(
        [
          { transform: "translate(-50%,-50%) scale(1)", opacity: 1 },
          { transform: `translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px)) scale(${sc})`, opacity: 0 },
        ],
        { duration: 900 * sp, easing: "cubic-bezier(.7,0,.2,1)", fill: "forwards" },
      ).finished;
      await sleep(120);
      html.classList.remove("booting");
      window.removeEventListener("keydown", onKey);
      scroller.start();
      busy.current = false;
      window.dispatchEvent(new Event("scroll"));
      /* A deep link such as /#work lands on its section once the intro ends. */
      if (hash.length > 1) {
        const target = document.getElementById(decodeURIComponent(hash.slice(1)));
        if (target) scroller.to(target, { offset: hash === "#work" ? 0 : -76, immediate: true });
      }
    }

    const fail = (err: unknown) => {
      console.warn("boot", err);
      html.classList.remove("booting");
      scroller.start();
      busy.current = false;
    };
    run(false).catch(fail);
    const onReplay = () => {
      if (!busy.current) run(true).catch(fail);
    };
    window.addEventListener(REPLAY_EVENT, onReplay);
    return () => {
      cancelled = true;
      window.removeEventListener(REPLAY_EVENT, onReplay);
    };
  }, []);

  return (
    <div id="boot" ref={root} role="status" aria-label="Loading">
      <div className="bt-cover" />
      <div className="bt-term" aria-hidden="true">
        <div className="bt-th">
          <i />
          <i />
          <i />
          <span>visitor@sujith.c — ssh</span>
        </div>
        <pre className="bt-tb" />
      </div>
      <i className="bt-dot" aria-hidden="true" />
      <div className="bt-cap">
        <b>STANDBY</b>
        <span>connecting to sujith.c</span>
      </div>
      <div className="bt-beam" aria-hidden="true" />
      <div className="bt-full" aria-hidden="true" />
      <div className="bt-lines" aria-hidden="true" />
      <div className="bt-vig" aria-hidden="true" />
      <div className="bt-corner" aria-hidden="true">
        <span>sujith c / portfolio</span>
        <span className="bt-pct">000</span>
      </div>
      <button className="bskip" type="button">
        Skip intro
      </button>
    </div>
  );
}

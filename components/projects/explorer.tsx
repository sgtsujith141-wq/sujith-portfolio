"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { projects, type Project } from "@/content/site";
import { scroller } from "@/lib/scroller";
import { pad2, reducedMotion } from "@/lib/utils";
import { Decrypt } from "@/components/reveal";
import { VisualPanel } from "./visuals";

/* ══════════════════════════════════════════════════════════════════════
 *  The projects explorer: a sticky list on the left (a sticky, sideways
 *  scrolling tab bar on mobile) and the selected project's explanation
 *  on the right. The URL is the selection, so every explanation is
 *  linkable. Switching projects never wipes the page: the explanation
 *  fades out, swaps, and its sections, steps and tags stagger back in.
 * ══════════════════════════════════════════════════════════════════════ */

const EASE = "cubic-bezier(.2,.8,.2,1)";

const slugFromPath = (p: string) => {
  const s = p.split("/")[2];
  return s && projects.some((x) => x.slug === s) ? s : projects[0]!.slug;
};

function Accordion({ items, pid }: { items: Project["decisions"]; pid: string }) {
  const [open, setOpen] = useState<number[]>([0]);
  return (
    <div>
      {items.map((d, n) => {
        const isOpen = open.includes(n);
        const id = `${pid}-acc${n}`;
        return (
          <div className={isOpen ? "acc open" : "acc"} key={d.t}>
            <h4>
              <button
                className="acch"
                type="button"
                aria-expanded={isOpen}
                aria-controls={id}
                onClick={() => setOpen((o) => (isOpen ? o.filter((x) => x !== n) : [...o, n]))}
              >
                <span>{d.t}</span>
                <i aria-hidden="true" />
              </button>
            </h4>
            <div className="accp" id={id} inert={!isOpen}>
              <div>
                <p>{d.d}</p>
                <p className="tr">{d.tr}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Panel({ p, i }: { p: Project; i: number }) {
  const prev = projects[(i - 1 + projects.length) % projects.length]!;
  const next = projects[(i + 1) % projects.length]!;
  let k = 0;
  const sec = (t: string, children: React.ReactNode) => (
    <section className="xs" aria-label={t} key={t}>
      <h3>
        <span aria-hidden="true">{pad2(++k)}</span>
        {t}
      </h3>
      {children}
    </section>
  );
  const phone = (p.shots[0]?.w ?? 0) > 0 && p.shots[0]!.w < 1000;
  return (
    <>
      <header className="xh">
        <p className="ctx">{p.ctx}</p>
        <Decrypt as="h2" text={p.name} id="xTitle" dur={700} onMount tabIndex={-1} />
        <p className="one">{p.what}</p>
        <div className="act">
          <span className={p.status.live ? "chip" : "chip off"}>{p.status.label}</span>
          {p.links.map((l, n) => (
            <a className={n === 0 ? "btn solid mag" : "btn mag"} href={l.href} target="_blank" rel="noopener" data-cursor="Open" key={l.href}>
              {l.label} <span className="ar" aria-hidden="true">↗</span>
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ))}
        </div>
      </header>
      {sec("What problem it solves", <>
        <p className="prose">{p.why}</p>
      </>)}
      {sec("How it works", <>
        <ol className="steps">
          {p.how.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </>)}
      {p.visuals.length > 0 && (
        sec("Try it", <>
          {p.visuals.map((v) => (
            <VisualPanel v={v} key={v} />
          ))}
        </>)
      )}
      {p.decisions.length > 0 && (
        sec("Design decisions", <>
          <Accordion items={p.decisions} pid={p.slug} />
        </>)
      )}
      {p.checked && (
        sec("How it is checked", <>
          <p className="prose">{p.checked}</p>
        </>)
      )}
      {p.tags.length > 0 && (
        sec("Built with", <>
          <ul className="tags">
            {p.tags.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </>)
      )}
      {p.limits.length > 0 && (
        sec("Limitations", <>
          <ul className="limits">
            {p.limits.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </>)
      )}
      {p.shots.length > 0 && (
        sec("Screenshots", <>
          <div className={phone ? "shots" : "shots wide"}>
            {p.shots.map((s) => (
              <figure key={s.src}>
                <a href={s.src} target="_blank" rel="noopener" data-cursor="Open" aria-label={`Open full size: ${s.caption}`}>
                  <Image src={s.src} width={s.w} height={s.h} alt={`${p.name}: ${s.caption}`} sizes={phone ? "(max-width: 900px) 90vw, 260px" : "(max-width: 900px) 92vw, 760px"} />
                </a>
                <figcaption>
                  <b>Real capture</b> from the repository · {s.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </>)
      )}
      <nav className="xnav" aria-label="More projects">
        <a href={`/projects/${prev.slug}`} data-cursor="Prev">
          <small>← Previous</small>
          <b>{prev.name}</b>
        </a>
        <a className="next" href={`/projects/${next.slug}`} data-cursor="Next">
          <small>Next →</small>
          <b>{next.name}</b>
        </a>
      </nav>
    </>
  );
}

export function Explorer() {
  const pathname = usePathname();
  const slug = slugFromPath(pathname);
  const [shown, setShown] = useState(slug);
  const panelRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const first = useRef(true);
  const swapping = useRef(false);

  /* the list staggers in when the page opens */
  useEffect(() => {
    if (reducedMotion()) return;
    listRef.current?.querySelectorAll("li").forEach((li, k) =>
      li.animate([{ opacity: 0, transform: "translateX(-14px)" }, { opacity: 1, transform: "none" }], { duration: 500, delay: 200 + k * 70, easing: EASE, fill: "backwards" }),
    );
  }, []);

  /* keep the active tab visible on the mobile tab bar */
  useEffect(() => {
    const ol = listRef.current;
    const act = ol?.querySelector<HTMLElement>("[aria-current=page]");
    if (ol && act && window.innerWidth <= 900) ol.scrollTo({ left: act.offsetLeft - 20, behavior: reducedMotion() ? "auto" : "smooth" });
  }, [slug]);

  /* fade out, then swap */
  useEffect(() => {
    if (slug === shown) return;
    const panel = panelRef.current;
    if (!panel || reducedMotion()) {
      setShown(slug);
      return;
    }
    swapping.current = true;
    const out = panel.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateY(10px)" }], { duration: 180, easing: "ease-in", fill: "forwards" });
    out.finished.then(() => setShown(slug)).catch(() => setShown(slug));
  }, [slug, shown]);

  /* after a swap: fade back in, stagger the parts, bring the top into view */
  useLayoutEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const panel = panelRef.current;
    if (!panel) return;
    const top = document.getElementById("explorer")!.getBoundingClientRect().top;
    if (top < 0) scroller.to(top + window.scrollY - (window.innerWidth <= 900 ? 70 : 90));
    document.getElementById("xTitle")?.focus({ preventScroll: true });
    if (reducedMotion() || !swapping.current) return;
    swapping.current = false;
    panel.getAnimations().forEach((a) => a.cancel());
    panel.animate([{ opacity: 0, transform: "translateY(14px)" }, { opacity: 1, transform: "none" }], { duration: 480, easing: EASE });
    panel.querySelectorAll(".xs").forEach((s, k) =>
      s.animate([{ opacity: 0, transform: "translateY(18px)" }, { opacity: 1, transform: "none" }], { duration: 620, delay: 160 + k * 90, easing: EASE, fill: "backwards" }),
    );
    panel.querySelectorAll(".steps li").forEach((li, k) =>
      li.animate([{ opacity: 0, transform: "translateX(-10px)" }, { opacity: 1, transform: "none" }], { duration: 500, delay: 350 + k * 90, easing: EASE, fill: "backwards" }),
    );
    panel.querySelectorAll(".tags li").forEach((li, k) =>
      li.animate([{ opacity: 0, transform: "scale(.85)" }, { opacity: 1, transform: "none" }], { duration: 400, delay: 500 + k * 50, easing: EASE, fill: "backwards" }),
    );
  }, [shown]);

  const idx = Math.max(0, projects.findIndex((p) => p.slug === shown));

  return (
    <div className="xgrid" id="explorer">
      <nav className="xlist" aria-label="Choose a project" data-lenis-prevent>
        <ol ref={listRef}>
          {projects.map((p, i) => (
            <li key={p.slug}>
              <a className="xi" href={`/projects/${p.slug}`} aria-current={p.slug === slug ? "page" : undefined}>
                <span className="n" aria-hidden="true">
                  {pad2(i + 1)}
                </span>
                <span>
                  <b>{p.name}</b>
                  <small>{p.one}</small>
                </span>
              </a>
            </li>
          ))}
        </ol>
        <p className="xnote">Select a project to read its explanation.</p>
      </nav>
      <article className="xpanel" ref={panelRef} aria-labelledby="xTitle">
        <Panel p={projects[idx]!} i={idx} key={shown} />
      </article>
    </div>
  );
}

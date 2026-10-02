"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { nav, site } from "@/content/site";

/* Top bar. On the home page the active link follows the section in view;
 * on the projects page "Projects" is active and a Back button returns to
 * the Projects section of the home page, not its top. */
export function Header() {
  const pathname = usePathname();
  const onProjects = pathname.startsWith("/projects");
  const [spied, setActive] = useState<string>("");
  const active = onProjects ? "projects" : spied;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (onProjects) return;
    let tick = false;
    const spy = () => {
      tick = false;
      let cur = "";
      document.querySelectorAll<HTMLElement>("main section[data-nk]").forEach((s) => {
        if (s.getBoundingClientRect().top < window.innerHeight * 0.5) cur = s.dataset.nk ?? "";
      });
      setActive(cur);
    };
    const on = () => {
      if (!tick) {
        tick = true;
        requestAnimationFrame(spy);
      }
    };
    requestAnimationFrame(spy);
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, [onProjects]);

  useEffect(() => {
    const close = () => setOpen(false);
    document.addEventListener("sujith:navigate", close);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("sujith:navigate", close);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <header className="bar" id="bar">
        <a className="id" href="/" aria-label="Sujith C, home">
          SUJITH C<span>_</span>
        </a>
        <nav aria-label="Primary">
          <ul>
            {nav.map((n) => (
              <li key={n.key}>
                <a href={n.href} className={active === n.key ? "on" : undefined} aria-current={n.key === "projects" && onProjects ? "page" : undefined}>
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="right">
          {onProjects && (
            <a className="btn mag" href="/#work" data-cursor="Back">
              ← Back
            </a>
          )}
          <a className="btn solid mag" href={site.resume} target="_blank" rel="noopener">
            Resume
          </a>
          <button className="menubtn" type="button" aria-expanded={open} aria-controls="menu" onClick={() => setOpen((o) => !o)}>
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </header>
      <div className={open ? "menu open" : "menu"} id="menu" aria-hidden={!open} inert={!open}>
        <a href="/" onClick={() => setOpen(false)}>
          Home
        </a>
        {nav.map((n) => (
          <a key={n.key} href={n.href} onClick={() => setOpen(false)}>
            {n.label}
          </a>
        ))}
      </div>
    </>
  );
}

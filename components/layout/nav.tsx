"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navItems, spySections } from "@/data/navigation";
import { useActiveSection } from "@/lib/use-active-section";
import { useCommandPalette } from "@/components/palette/command-palette";
import { cn, scrollToSection, isMac } from "@/lib/utils";

export function Nav() {
  const active = useActiveSection(spySections);
  const { setOpen } = useCommandPalette();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [meta, setMeta] = useState("CTRL");

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 220, damping: 40, mass: 0.4 });

  useEffect(() => setMeta(isMac() ? "⌘" : "CTRL"), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menu]);

  const jump = (id: string) => {
    setMenu(false);
    window.setTimeout(() => scrollToSection(id), 60);
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
          scrolled
            ? "border-b border-line bg-base/80 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-6 px-5 sm:px-8 lg:px-12">
          {/* Mark */}
          <button
            type="button"
            onClick={() => jump("index")}
            className="group flex items-center gap-2.5"
            aria-label="Back to top"
          >
            <span className="relative flex h-5 w-5 items-center justify-center border border-line transition-colors group-hover:border-accent/50">
              <span className="mono text-[9px] font-medium tracking-tight text-muted transition-colors group-hover:text-accent">
                SC
              </span>
              <span className="absolute -right-px -top-px h-1 w-1 bg-accent opacity-0 transition-opacity group-hover:opacity-100" />
            </span>
            <span className="label-sm hidden text-faint transition-colors group-hover:text-ink sm:inline">
              SUJITH C
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="ml-auto hidden items-center gap-0.5 lg:flex" aria-label="Sections">
            {navItems.map((item) => {
              const on = active === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => jump(item.id)}
                  aria-current={on ? "true" : undefined}
                  className={cn(
                    "relative flex items-center gap-1.5 px-3 py-2 transition-colors duration-300",
                    on ? "text-ink" : "text-faint hover:text-muted",
                  )}
                >
                  <span className={cn("label-sm tnum transition-colors", on ? "text-accent" : "text-ghost")}>
                    {item.index}
                  </span>
                  <span className="label-sm">{item.label}</span>
                  {on ? (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-x-2 -bottom-px h-px bg-accent"
                      transition={{ type: "spring", stiffness: 380, damping: 34 }}
                    />
                  ) : null}
                </button>
              );
            })}
          </nav>

          {/* Palette trigger */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="group ml-auto flex items-center gap-2 border border-line px-2.5 py-1.5 transition-colors hover:border-accent/40 hover:bg-accent/[0.04] lg:ml-4"
            aria-label="Open command palette"
          >
            <span className="label-sm hidden text-faint transition-colors group-hover:text-ink sm:inline">
              COMMAND
            </span>
            <kbd className="mono text-[9px] tracking-widest text-ghost transition-colors group-hover:text-accent">
              {meta}K
            </kbd>
          </button>

          {/* Mobile trigger */}
          <button
            type="button"
            onClick={() => setMenu(true)}
            className="flex h-8 w-8 items-center justify-center border border-line text-muted transition-colors hover:text-ink lg:hidden"
            aria-label="Open menu"
            aria-expanded={menu}
          >
            <Menu className="h-3.5 w-3.5" strokeWidth={1.6} />
          </button>
        </div>

        {/* Read progress */}
        <motion.div
          className="absolute inset-x-0 bottom-0 h-px origin-left bg-gradient-to-r from-accent/70 to-accent"
          style={{ scaleX: progress }}
          aria-hidden
        />
      </header>

      {/* Mobile sheet — a real full-screen index, not a squeezed desktop nav. */}
      <AnimatePresence>
        {menu ? (
          <motion.div
            className="fixed inset-0 z-[90] flex flex-col bg-base lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <div className="flex h-14 items-center justify-between border-b border-line px-5 sm:px-8">
              <span className="label-sm text-faint">INDEX</span>
              <button
                type="button"
                onClick={() => setMenu(false)}
                className="flex h-8 w-8 items-center justify-center border border-line text-muted"
                aria-label="Close menu"
              >
                <X className="h-3.5 w-3.5" strokeWidth={1.6} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-5 py-6 sm:px-8" aria-label="Sections">
              {navItems.map((item, i) => (
                <motion.button
                  key={item.id}
                  type="button"
                  onClick={() => jump(item.id)}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 + i * 0.045, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="group flex w-full items-baseline gap-4 border-b border-line-soft py-5 text-left"
                >
                  <span className="label-sm tnum text-ghost group-active:text-accent">{item.index}</span>
                  <span
                    className={cn(
                      "text-[26px] font-medium tracking-[-0.03em]",
                      active === item.id ? "text-accent" : "text-ink",
                    )}
                  >
                    {item.label}
                  </span>
                </motion.button>
              ))}
            </nav>

            <div className="border-t border-line px-5 py-4 sm:px-8">
              <button
                type="button"
                onClick={() => {
                  setMenu(false);
                  window.setTimeout(() => setOpen(true), 180);
                }}
                className="label-sm w-full border border-line py-3 text-muted"
              >
                OPEN COMMAND PALETTE
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

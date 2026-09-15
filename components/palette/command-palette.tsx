"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import dynamic from "next/dynamic";

/* The panel (and cmdk with it) is code-split: nothing about the palette is
 * downloaded until the first ⌘K or click on the trigger. */
const PalettePanel = dynamic(
  () => import("./palette-panel").then((m) => m.PalettePanel),
  { ssr: false },
);

interface PaletteCtx {
  open: boolean;
  setOpen: (v: boolean) => void;
  toggle: () => void;
}

const Ctx = createContext<PaletteCtx | null>(null);

export function useCommandPalette() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCommandPalette must be used inside CommandPaletteProvider");
  return ctx;
}

export function CommandPaletteProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  // Once opened, keep the panel mounted so reopening is instant.
  const [everOpened, setEverOpened] = useState(false);
  const toggle = useCallback(() => setOpen((v) => !v), []);

  useEffect(() => {
    if (open) setEverOpened(true);
  }, [open]);

  const value = useMemo(() => ({ open, setOpen, toggle }), [open, toggle]);

  // Warm the chunk while the browser is idle so the first ⌘K is instant.
  useEffect(() => {
    const warm = () => void import("./palette-panel");
    const w = window as typeof window & {
      requestIdleCallback?: (cb: () => void) => number;
    };
    if (w.requestIdleCallback) {
      w.requestIdleCallback(warm);
      return;
    }
    const t = window.setTimeout(warm, 1800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <Ctx.Provider value={value}>
      {children}
      {everOpened ? <PalettePanel /> : null}
    </Ctx.Provider>
  );
}

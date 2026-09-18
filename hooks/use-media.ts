"use client";

import { useSyncExternalStore } from "react";

/** Subscribe to a media query. `fallback` is used during SSR. */
export function useMedia(query: string, fallback = false) {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => fallback,
  );
}

export const useFinePointer = () => useMedia("(pointer: fine)", true);
export const useDesktop = () => useMedia("(min-width: 1024px)", true);

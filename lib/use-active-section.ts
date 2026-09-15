"use client";

import { useEffect, useState } from "react";

/* Scroll-spy. A single IntersectionObserver over every section, picking the
 * entry whose top edge is closest to the reading line (~38% down the
 * viewport). Cheaper and steadier than measuring on scroll. */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0] ?? "");

  useEffect(() => {
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-38% 0px -58% 0px", threshold: 0 },
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);

  return active;
}

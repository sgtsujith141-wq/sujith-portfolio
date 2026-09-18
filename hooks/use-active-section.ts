"use client";

import { useEffect, useState } from "react";
import { sectionIds } from "@/content/navigation";
import type { SectionId } from "@/lib/types";

/** Which section currently occupies the reading band of the viewport. */
export function useActiveSection(): SectionId {
  const [active, setActive] = useState<SectionId>("introduction");

  useEffect(() => {
    const els = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const id = visible[0]?.target.id as SectionId | undefined;
        if (id) setActive(id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return active;
}

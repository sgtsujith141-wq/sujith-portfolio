"use client";

import { site } from "@/content/site";
import { sleep } from "@/lib/utils";
import { REPLAY_EVENT } from "./boot";

export function Footer() {
  /* Like the reference: go home first (through the normal wipe), then replay. */
  const replay = async () => {
    if (document.documentElement.classList.contains("booting")) return;
    if (location.pathname !== "/") {
      document.querySelector<HTMLAnchorElement>("#bar .id")?.click();
      for (let i = 0; i < 80 && (location.pathname !== "/" || document.querySelector(".wipe.on")); i++) await sleep(60);
    }
    window.scrollTo(0, 0);
    await sleep(80);
    window.dispatchEvent(new Event(REPLAY_EVENT));
  };
  return (
    <footer>
      <div className="wrap">
        <span>© 2026 {site.name}</span>
        <button className="replay" type="button" onClick={replay}>
          Replay intro
        </button>
        <span>{site.checked}</span>
      </div>
    </footer>
  );
}

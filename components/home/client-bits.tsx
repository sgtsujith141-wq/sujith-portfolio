"use client";

import { useState } from "react";
import { contact, hero } from "@/content/site";
import { useMedia } from "@/lib/use-media";

export function HeroHint() {
  const coarse = useMedia("(pointer: coarse)");
  return (
    <p className="hint hfade" id="hHint">
      {coarse ? hero.hintTouch : hero.hintPointer}
    </p>
  );
}

export function CopyEmail() {
  const idle = "Click to copy the address";
  const [msg, setMsg] = useState(idle);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      setMsg(`Copied: ${contact.email}`);
    } catch {
      setMsg(`Select it instead: ${contact.email}`);
    }
    setTimeout(() => setMsg(idle), 2600);
  };
  return (
    <button type="button" onClick={copy} data-cursor="Copy">
      <small>Copy email</small>
      <span aria-live="polite">{msg}</span>
    </button>
  );
}

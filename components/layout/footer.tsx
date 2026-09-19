import Link from "next/link";
import { profile } from "@/content/profile";
import { VERIFIED_ON } from "@/content/evidence";
import { formatDate } from "@/lib/utils";

export function Footer() {
  return (
    <footer className="relative z-[1] border-t border-line-soft px-6 py-10 lg:px-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mono text-[11px] tracking-[0.2em] text-muted">SUJITH C</p>
          <p className="mt-3 max-w-md text-xs leading-relaxed text-faint">
            © {new Date().getFullYear()}. Figures on this site are verified snapshots, last checked{" "}
            {formatDate(VERIFIED_ON)}. The background is a visualisation of this content, not live
            system activity.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
          <Link href="/" className="link-line text-muted hover:text-ink">
            Home
          </Link>
          <Link href="/work" className="link-line text-muted hover:text-ink">
            Work
          </Link>
          <a
            href={profile.links.github}
            target="_blank"
            rel="noreferrer"
            className="link-line text-muted hover:text-ink"
          >
            GitHub
          </a>
          <a
            href={profile.links.linkedin}
            target="_blank"
            rel="noreferrer"
            className="link-line text-muted hover:text-ink"
          >
            LinkedIn
          </a>
        </div>
      </div>
      <p className="mono mx-auto mt-8 max-w-6xl text-[10px] tracking-[0.14em] text-ghost">
        ARCHIVO · GEIST · GEIST MONO (SIL OFL) · NEXT.JS · CANVAS
      </p>
    </footer>
  );
}

import { profile } from "@/content/profile";
import { VERIFIED_ON } from "@/content/evidence";
import { formatDate } from "@/lib/utils";

export function Footer() {
  return (
    <footer className="relative z-[1] border-t border-line-soft px-6 py-8 lg:px-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {profile.name}. Metrics are verified snapshots, last checked{" "}
          {formatDate(VERIFIED_ON)}.
        </p>
        <p className="mono text-[10px] tracking-[0.14em]">
          ARCHIVO · GEIST · GEIST MONO (SIL OFL) · NEXT.JS · CANVAS
        </p>
      </div>
    </footer>
  );
}

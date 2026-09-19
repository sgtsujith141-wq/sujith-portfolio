import Link from "next/link";
import type { Project } from "@/lib/types";
import { formatDate } from "@/lib/utils";

/** Expandable engineering deep dive: the verification log for every claim in the case study. */
export function DeepDive({ project }: { project: Project }) {
  return (
    <details className="group hairline bg-surface">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 [&::-webkit-details-marker]:hidden">
        <span className="flex items-center gap-3">
          <span className="label text-ink">Engineering deep dive</span>
          <span className="text-xs text-faint">verification log · {project.verification.length} claims</span>
        </span>
        <span aria-hidden className="mono text-[11px] text-faint transition-transform group-open:rotate-45">+</span>
      </summary>
      <div className="overflow-x-auto border-t border-line-soft">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-line-soft">
              <th scope="col" className="label-xs px-5 py-3 font-normal text-faint">Claim</th>
              <th scope="col" className="label-xs px-5 py-3 font-normal text-faint">Source</th>
              <th scope="col" className="label-xs px-5 py-3 font-normal text-faint">Checked</th>
              <th scope="col" className="label-xs px-5 py-3 font-normal text-faint">Method</th>
            </tr>
          </thead>
          <tbody>
            {project.verification.map((v) => (
              <tr key={v.claim} className="border-b border-line-soft align-top last:border-0">
                <td className="px-5 py-3 text-ink">{v.claim}</td>
                <td className="mono px-5 py-3 text-xs text-muted">{v.source}</td>
                <td className="mono whitespace-nowrap px-5 py-3 text-xs text-faint">{formatDate(v.date)}</td>
                <td className="px-5 py-3 text-xs text-muted">{v.method}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="border-t border-line-soft px-5 py-3 text-xs text-faint">
        The component graph for this project is explorable in{" "}
        <Link href="/work#evidence" className="link-line text-ink">
          Engineering Evidence
        </Link>.
      </p>
    </details>
  );
}

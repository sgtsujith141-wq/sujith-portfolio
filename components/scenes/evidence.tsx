import { ciMatrix, snapshots, REPORT_DATE, VERIFIED_ON } from "@/content/evidence";
import { projectBySlug } from "@/content/projects";
import { ArchitectureExplorer } from "@/components/projects/architecture-explorer";
import { Reveal } from "@/components/animations/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { formatDate } from "@/lib/utils";

/* 03 · ENGINEERING EVIDENCE — verified snapshots with dates and methods,
 * the CI matrix as it exists in each repository, and an explorable
 * architecture for each project. No live counters. */
export function Evidence() {
  return (
    <section id="evidence" aria-labelledby="evidence-title" className="content-auto relative px-6 py-28 lg:px-12 lg:py-40">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          index="03"
          label="Engineering evidence"
          title={<span id="evidence-title">Verified, dated, reproducible.</span>}
          lede={
            <>
              Every figure below is a snapshot, not a live counter. Test suites were re-run locally on{" "}
              {formatDate(VERIFIED_ON)}; CI conclusions were read through the GitHub API the same day; the
              remaining figures come from the {formatDate(REPORT_DATE)} engineering report.
            </>
          }
        />

        <ul className="mt-16 grid gap-px bg-line-soft sm:grid-cols-2 lg:grid-cols-4">
          {snapshots.map((s, i) => {
            const project = projectBySlug[s.project];
            return (
              <Reveal key={s.id} delay={(i % 4) * 0.05}>
                <li className="flex h-full flex-col bg-base p-6">
                  <p className="label">{project.name}</p>
                  <p className="display mt-5 text-[2.4rem] leading-none text-ink">{s.value}</p>
                  <p className="mt-2 text-sm text-muted">{s.label}</p>
                  <p className="mt-4 text-xs leading-relaxed text-faint">{s.detail}</p>
                  <p className="mono mt-auto pt-5 text-[10px] leading-relaxed tracking-[0.08em] text-ghost">
                    VERIFIED {formatDate(s.verifiedOn).toUpperCase()}
                    <br />
                    {s.method}
                  </p>
                </li>
              </Reveal>
            );
          })}
        </ul>

        <Reveal className="mt-16">
          <h3 className="label">Continuous integration, as configured in each repository</h3>
          <div className="mt-5 overflow-x-auto hairline bg-surface/60">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-line-soft">
                  <th scope="col" className="label-xs px-5 py-4 font-normal text-faint">Repository</th>
                  <th scope="col" className="label-xs px-5 py-4 font-normal text-faint">Commit</th>
                  <th scope="col" className="label-xs px-5 py-4 font-normal text-faint">Jobs</th>
                  <th scope="col" className="label-xs px-5 py-4 font-normal text-faint">Latest run</th>
                </tr>
              </thead>
              <tbody>
                {ciMatrix.map((row) => (
                  <tr key={row.project} className="border-b border-line-soft last:border-0">
                    <td className="px-5 py-4 align-top">
                      <a href={projectBySlug[row.project].repo} target="_blank" rel="noreferrer" className="link-line text-ink">
                        {row.project}
                      </a>
                    </td>
                    <td className="mono px-5 py-4 align-top text-faint">{row.commit}</td>
                    <td className="px-5 py-4 align-top text-muted">
                      <ul className="space-y-1">
                        {row.jobs.map((j) => (
                          <li key={j}>{j}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-5 py-4 align-top">
                      <span className="inline-flex items-center gap-2 text-ok">
                        <span className="h-1.5 w-1.5 rounded-full bg-ok" aria-hidden />
                        {row.conclusion}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        <Reveal className="mt-16">
          <h3 className="label">Explore an architecture</h3>
          <p className="mt-3 max-w-2xl text-sm text-muted">
            Each diagram is the one documented in the repository README, rendered from the same typed
            content as the case studies. Select a component to read what it does and see what it connects to.
          </p>
          <div className="mt-6">
            <ArchitectureExplorer />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

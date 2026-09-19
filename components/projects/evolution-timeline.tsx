import { comparison, evolution } from "@/content/projects/surakshascore-mvp";
import { Reveal } from "@/components/animations/reveal";
import { cn } from "@/lib/utils";

const GH = "https://github.com/sgtsujith141-wq";

/* MVP → SurakshaScore, told as an engineering evolution. Every stage is a
 * repository-backed claim. */
export function EvolutionTimeline() {
  return (
    <div>
      <ol className="relative grid gap-px bg-line-soft lg:grid-cols-4">
        {evolution.map((stage, i) => (
          <Reveal
            as="li"
            key={stage.id}
            delay={i * 0.08}
            className={cn("relative h-full bg-base p-6", i === evolution.length - 1 && "bg-surface")}
          >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "h-2 w-2 rounded-full",
                    i === evolution.length - 1 ? "bg-accent ring-4 ring-accent/20" : "bg-line-strong",
                  )}
                  aria-hidden
                />
                <span className="label">{stage.label}</span>
              </div>
              {i < evolution.length - 1 ? (
                <span aria-hidden className="absolute right-0 top-[31px] hidden h-px w-6 translate-x-full bg-line-strong lg:block" />
              ) : null}
              <h4 className="display mt-5 text-xl text-ink">{stage.title}</h4>
              <p className="mt-3 text-sm leading-relaxed text-muted">{stage.detail}</p>
              <a
                href={`${GH}/${stage.repo}`}
                target="_blank"
                rel="noreferrer"
                className="link-line mono mt-5 inline-block text-[11px] text-faint hover:text-ink"
              >
                {stage.repo} →
              </a>
          </Reveal>
        ))}
      </ol>

      <Reveal className="mt-px overflow-x-auto hairline bg-surface">
        <table className="w-full min-w-[560px] text-left text-sm">
          <caption className="label px-5 pb-2 pt-4 text-left">What changed in the rewrite — from the MVP README</caption>
          <thead>
            <tr className="border-b border-line-soft">
              <th scope="col" className="label-xs px-5 py-3 font-normal text-faint">Aspect</th>
              <th scope="col" className="label-xs px-5 py-3 font-normal text-faint">surakshascore-mvp</th>
              <th scope="col" className="label-xs px-5 py-3 font-normal text-faint">surakshascore</th>
            </tr>
          </thead>
          <tbody>
            {comparison.map((row) => (
              <tr key={row.aspect} className="border-b border-line-soft last:border-0">
                <th scope="row" className="px-5 py-3 font-normal text-ink">{row.aspect}</th>
                <td className="px-5 py-3 text-muted">{row.mvp}</td>
                <td className="px-5 py-3 text-ink">{row.rebuilt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>
    </div>
  );
}

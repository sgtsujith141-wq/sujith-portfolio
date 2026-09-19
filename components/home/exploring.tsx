import { explorationThemes } from "@/content/exploration";
import { Reveal } from "@/components/animations/reveal";
import { MaskLine } from "@/components/animations/mask-reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { StatusPill } from "@/components/ui/status-pill";

/* 05 · EXPLORING — open threads, not finished products. */
export function Exploring() {
  return (
    <section
      id="exploring"
      aria-labelledby="exploring-title"
      className="content-auto relative px-6 py-28 lg:px-12 lg:py-40"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          index="05"
          label="Exploring"
          title={<span id="exploring-title">Open threads.</span>}
          lede="Where the work is heading. “Active” has a repository or a running machine behind it; “Planned” is on the record so it cannot be quietly promoted later."
        />

        <ol className="mt-14 border-t border-line-soft">
          {explorationThemes.map((t, i) => (
            <Reveal
              as="li"
              key={t.id}
              delay={i * 0.04}
              className="group grid gap-4 border-b border-line-soft py-8 transition-colors hover:bg-surface/40 lg:grid-cols-12 lg:gap-8 lg:py-10"
            >
                <div className="flex items-start gap-5 lg:col-span-4">
                  <span className="mono mt-1.5 text-[11px] tracking-[0.2em] text-ghost">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="display text-2xl text-ink">
                      <MaskLine>{t.title}</MaskLine>
                    </h3>
                    <div className="mt-3">
                      <StatusPill tone={t.status === "active" ? "signal" : "muted"}>
                        {t.status === "active" ? "Active" : "Planned"}
                      </StatusPill>
                    </div>
                  </div>
                </div>
                <p className="text-[15px] leading-relaxed text-muted lg:col-span-5">{t.detail}</p>
                <ul className="flex flex-wrap gap-2 lg:col-span-3 lg:justify-end lg:self-start">
                  {t.threads.map((th) => (
                    <li
                      key={th}
                      className="mono border border-line px-2.5 py-1.5 text-[11px] text-faint transition-colors group-hover:border-line-strong"
                    >
                      {th}
                    </li>
                  ))}
                </ul>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

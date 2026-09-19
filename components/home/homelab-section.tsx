import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { homelab } from "@/content/homelab";
import { LabTopology } from "@/components/homelab/topology";
import { Reveal } from "@/components/animations/reveal";
import { MaskLine } from "@/components/animations/mask-reveal";
import { SectionHeader } from "@/components/ui/section-header";

/* ══════════════════════════════════════════════════════════════════════
 *  04 · HOME LAB
 *
 *  The scroll into this section is the site's biggest transformation:
 *  the abstract field behind the page becomes the lab's own topology,
 *  edges reroute into orthogonal pathways and signals start flowing
 *  down the stack. The interactive diagram sits inside the measured
 *  window so the two read as one system at two levels of detail.
 * ══════════════════════════════════════════════════════════════════════ */

export function HomeLabSection() {
  /* No stage here: the diagram below is full-width and opaque, so the
   * canvas holds its own copy of the topology in the band beside the
   * heading rather than hiding behind the card. */
  return (
    <section
      id="homelab"
      aria-labelledby="homelab-title"
      className="relative px-6 py-28 lg:px-12 lg:py-40"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          index="04"
          label="Home lab"
          title={
            <span id="homelab-title">
              <MaskLine>One machine.</MaskLine>
              <MaskLine delay={0.1}>Four services.</MaskLine>
              <MaskLine delay={0.2}>People who notice when it stops.</MaskLine>
            </span>
          }
          lede={homelab.summary}
        />

        {/* The diagram leads and takes the full width — it needs the room,
            and it is the point of the section. */}
        <div className="mt-14">
          <Reveal amount={0.08}>
            <LabTopology />
          </Reveal>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="text-[15px] leading-relaxed text-muted">{homelab.intro}</p>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mt-5 border-l border-line-strong pl-4 text-sm leading-relaxed text-faint">
                {homelab.scope}
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-4">
            <Reveal delay={0.12}>
              <dl className="grid gap-px bg-line-soft">
                {homelab.facts.map((f) => (
                  <div
                    key={f.label}
                    className="flex items-baseline justify-between gap-4 bg-base px-4 py-3"
                  >
                    <dt className="label-xs text-ghost">{f.label}</dt>
                    <dd className="mono text-[12px] text-ink">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          <div className="lg:col-span-3">
            <Reveal delay={0.18}>
              <Link
                href="/work/home-lab"
                className="group inline-flex items-center gap-2.5 border border-line-strong px-5 py-3 text-sm text-ink transition-colors hover:border-accent-soft hover:text-accent-soft"
              >
                Full case study
                <ArrowUpRight
                  className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
              <p className="mt-4 text-xs leading-relaxed text-ghost">
                Architecture, engineering decisions and the limitations I have not fixed yet.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

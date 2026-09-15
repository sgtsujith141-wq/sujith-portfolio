"use client";

import { GraduationCap } from "lucide-react";
import { profile } from "@/data/profile";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";
import { StatusDot } from "@/components/ui/status-dot";

/* About, kept short: three paragraphs, the education record, and an
 * identity card. Capabilities used to live here and now has its own block
 * further down the page, so this section stays quick to read. */

export function About() {
  const ed = profile.education;

  return (
    <section
      id="about"
      className="relative scroll-mt-20 border-y border-line bg-surface/30 py-24 sm:py-32 lg:py-40"
    >
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <SectionHeader index="01" title="About" meta="PROFILE" />

        <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-20">
          <div>
            <div className="space-y-6">
              {profile.about.map((para, i) => (
                <Reveal key={i} delay={i * 0.05}>
                  <p className="max-w-[64ch] text-pretty text-[16px] leading-[1.85] text-muted">
                    {para}
                  </p>
                </Reveal>
              ))}
            </div>

            {/* Education */}
            <Reveal className="mt-12" delay={0.1}>
              <div className="group relative max-w-[64ch] border border-line bg-base p-6 transition-colors duration-500 hover:border-ghost sm:p-7">
                <span
                  aria-hidden
                  className="absolute left-0 top-0 h-px w-0 bg-accent transition-[width] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full"
                />
                <div className="flex items-center gap-2.5">
                  <GraduationCap className="h-3.5 w-3.5 text-accent" strokeWidth={1.6} />
                  <span className="label-sm text-accent/75">EDUCATION</span>
                  <span className="ml-auto flex items-center gap-2">
                    <StatusDot tone="accent" live />
                    <span className="label-sm text-muted">{ed.year.toUpperCase()}</span>
                  </span>
                </div>

                <h3 className="mt-5 text-[19px] font-medium leading-snug tracking-[-0.025em] text-ink">
                  {ed.institution}
                </h3>
                <p className="mono mt-2 text-[11px] tracking-wider text-ghost">
                  {ed.short.toUpperCase()} · {ed.location.toUpperCase()}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-3 border-t border-line-soft pt-5">
                  <span className="text-[14.5px] text-muted">{ed.programme}</span>
                  <span className="hidden h-2.5 w-px bg-line sm:block" />
                  <span className="label-sm text-faint">{ed.status.toUpperCase()}</span>

                  {ed.cgpa ? (
                    <span className="ml-auto flex items-baseline gap-1.5">
                      <span className="label-sm text-ghost">CGPA</span>
                      <span className="mono text-[16px] leading-none text-accent tnum">
                        {ed.cgpa}
                      </span>
                      <span className="mono text-[11px] text-faint tnum">
                        / {ed.cgpaScale}
                      </span>
                    </span>
                  ) : null}
                </div>
              </div>
            </Reveal>
          </div>

          {/* Identity card */}
          <Reveal className="lg:sticky lg:top-24 lg:self-start" delay={0.1}>
            <div className="border border-line bg-base">
              <div className="flex items-center justify-between border-b border-line px-4 py-3">
                <span className="label-sm text-ghost">IDENTITY</span>
                <span className="flex items-center gap-2">
                  <StatusDot tone="signal" live />
                  <span className="label-sm text-signal/90">ACTIVE</span>
                </span>
              </div>
              <dl className="divide-y divide-line-soft">
                <Row k="NAME" v={profile.name} />
                <Row k="ROLE" v={`${ed.programme} student`} />
                <Row k="YEAR" v={`${ed.year} · ${ed.short}`} />
                <Row k="FOCUS" v="Cybersecurity · Systems" />
                <Row k="LOCATION" v={profile.location} />
              </dl>
              <div className="flex items-baseline gap-2 border-t border-line px-4 py-4">
                <span className="label-sm text-ghost">{profile.detail.label}</span>
                <span className="mono ml-auto text-[18px] leading-none text-accent tnum">
                  {profile.detail.value}
                </span>
                <span className="label-sm text-faint">{profile.detail.unit}</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline gap-4 px-4 py-3.5">
      <dt className="label-sm w-20 shrink-0 text-ghost">{k}</dt>
      <dd className="text-[13.5px] leading-snug text-muted">{v}</dd>
    </div>
  );
}

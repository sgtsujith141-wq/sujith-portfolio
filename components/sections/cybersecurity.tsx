"use client";

import { ArrowUpRight } from "lucide-react";
import { tracks, log, logKindMeta } from "@/data/cyber";
import { projects } from "@/data/projects";
import { SectionHeader, Rule } from "@/components/ui/section-header";
import { StatusDot } from "@/components/ui/status-dot";
import { StaggerList, StaggerItem } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

/* CYBERSECURITY — the main interest, stated as direction rather than
 * credentials. The archive below renders only when `log` has entries;
 * there is no empty state, because an empty archive is not worth a
 * heading. */

const securityProjects = projects.filter((p) =>
  p.category.toLowerCase().includes("security"),
);

export function Cybersecurity() {
  const active = tracks.filter((t) => t.status === "active").length;

  return (
    <section id="cybersecurity" className="relative scroll-mt-20 py-24 sm:py-32 lg:py-40">
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <SectionHeader
          index="03"
          title="Cybersecurity"
          meta={`${active} ACTIVE · ${tracks.length - active} QUEUED`}
          kicker="Currently exploring"
          lead="This is the direction I am heading and where most of what I build now points. I am learning it, not practising it professionally — the fundamentals first, the tooling later."
        />

        {securityProjects.length ? (
          <p className="mt-7 max-w-[62ch] text-[14px] leading-relaxed text-faint">
            It already shows up in the work:{" "}
            {securityProjects.map((p, i) => (
              <span key={p.slug}>
                {i > 0 ? (i === securityProjects.length - 1 ? " and " : ", ") : ""}
                <span className="text-muted">{p.name}</span>
              </span>
            ))}{" "}
            {securityProjects.length === 1 ? "is" : "are"} in the projects above.
          </p>
        ) : null}

        <StaggerList className="mt-14 grid grid-cols-1 gap-px border border-line bg-line md:grid-cols-2">
          {tracks.map((track) => (
            <StaggerItem key={track.id} className="bg-base">
              <article className="group relative h-full p-6 transition-colors duration-500 hover:bg-raise/40 sm:p-7">
                <span
                  aria-hidden
                  className="absolute left-0 top-0 h-px w-0 bg-accent transition-[width] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full"
                />

                <div className="flex items-center gap-2.5">
                  <StatusDot
                    tone={track.status === "active" ? "accent" : "muted"}
                    live={track.status === "active"}
                  />
                  <span
                    className={cn(
                      "label-sm",
                      track.status === "active" ? "text-accent" : "text-ghost",
                    )}
                  >
                    {track.status === "active" ? "IN PROGRESS" : "QUEUED"}
                  </span>
                </div>

                <h3 className="mt-5 text-[20px] font-medium tracking-[-0.025em] text-ink">
                  {track.title}
                </h3>

                <p className="mt-3 text-pretty text-[14px] leading-[1.75] text-muted">
                  {track.detail}
                </p>

                <div className="mt-6 flex flex-wrap gap-1.5">
                  {track.focus.map((f) => (
                    <span
                      key={f}
                      className="mono border border-line px-2 py-1 text-[10px] tracking-wider text-faint transition-colors duration-500 group-hover:border-ghost"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </article>
            </StaggerItem>
          ))}
        </StaggerList>

        {/* Writeups, labs, experiments, tools and notes. Renders only when
            data/cyber.ts has real entries — never as an empty shell. */}
        {log.length > 0 ? (
          <div className="mt-20">
            <Rule label="WRITEUPS & LABS" className="mb-7" />
            <StaggerList className="border-t border-line">
              {log.map((entry) => {
                const Row = entry.href ? "a" : "div";
                return (
                  <StaggerItem key={entry.id}>
                    <Row
                      {...(entry.href
                        ? { href: entry.href, target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="group flex items-center gap-5 border-b border-line py-5 transition-colors hover:bg-raise/40"
                    >
                      <span className="label-sm w-20 shrink-0 text-accent/70">
                        {logKindMeta[entry.kind].toUpperCase()}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[15px] text-ink transition-colors group-hover:text-accent">
                          {entry.title}
                        </span>
                        <span className="mt-1 block truncate text-[13px] text-faint">
                          {entry.summary}
                        </span>
                      </span>
                      <span className="label-sm hidden shrink-0 text-ghost tnum sm:block">
                        {entry.date}
                      </span>
                      {entry.href ? (
                        <ArrowUpRight
                          className="h-3.5 w-3.5 shrink-0 text-ghost transition-colors group-hover:text-accent"
                          strokeWidth={1.6}
                        />
                      ) : null}
                    </Row>
                  </StaggerItem>
                );
              })}
            </StaggerList>
          </div>
        ) : null}
      </div>
    </section>
  );
}

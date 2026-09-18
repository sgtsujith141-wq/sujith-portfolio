import { aboutBlocks, facts, hackathons } from "@/content/about";
import { profile } from "@/content/profile";
import { Reveal } from "@/components/animations/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { StatusPill } from "@/components/ui/status-pill";

/* 04 · ABOUT — five short blocks in an offset grid, an education card
 * with the figures from the resume, the two hackathon facts, and a
 * plain list of what is actually used. */
export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="content-auto relative px-6 py-28 lg:px-12 lg:py-40">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          index="04"
          label="About"
          title={<span id="about-title">An engineering student, explaining his work.</span>}
          lede="Short, because the repositories say more than a biography would."
        />

        <div className="mt-16 grid gap-px bg-line-soft lg:grid-cols-12">
          {aboutBlocks.map((b, i) => (
            <Reveal
              key={b.id}
              delay={i * 0.05}
              className={
                i === 0 || i === 2
                  ? "bg-base p-7 lg:col-span-7 lg:p-10"
                  : i === 4
                    ? "bg-base p-7 lg:col-span-12 lg:p-10"
                    : "bg-base p-7 lg:col-span-5 lg:p-10"
              }
            >
              <p className="label">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="display mt-4 text-2xl text-ink lg:text-3xl">{b.title}</h3>
              <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-muted lg:max-w-2xl">
                {b.body.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-px grid gap-px bg-line-soft lg:grid-cols-12">
          <Reveal className="bg-base p-7 lg:col-span-4 lg:p-10">
            <p className="label">Education</p>
            <p className="mt-4 text-lg text-ink">{profile.education.institution}</p>
            <p className="mt-1 text-sm text-muted">
              {profile.education.programme} · {profile.education.year} · {profile.education.location}
            </p>
            <p className="mono mt-6 text-sm text-faint">
              CGPA <span className="text-ink">{profile.education.cgpa}</span> / {profile.education.cgpaScale}
              <span className="ml-3 text-ghost">as stated on the resume</span>
            </p>
          </Reveal>

          <Reveal delay={0.05} className="bg-base p-7 lg:col-span-4 lg:p-10">
            <p className="label">Hackathons</p>
            <ul className="mt-4 space-y-5">
              {hackathons.map((h) => (
                <li key={h.id}>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-ink">{h.name}</span>
                    <StatusPill tone={h.result === "Winner" ? "accent" : "muted"}>{h.result}</StatusPill>
                  </div>
                  <p className="mt-1 text-sm text-faint">{h.scope}</p>
                  <p className="mt-1.5 text-sm text-muted">{h.detail}</p>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1} className="bg-base p-7 lg:col-span-4 lg:p-10">
            <p className="label">Actually used</p>
            <dl className="mt-4 space-y-4 text-sm">
              {(
                [
                  ["Programming", facts.programming],
                  ["Systems", facts.systems],
                  ["Tooling", facts.tooling],
                  ["Design", facts.design],
                ] as const
              ).map(([k, v]) => (
                <div key={k}>
                  <dt className="label-xs text-ghost">{k}</dt>
                  <dd className="mt-1.5 text-muted">{v.join(" · ")}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-xs text-ghost">
              Fundamentals in most of these. No certifications, no professional experience claimed.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

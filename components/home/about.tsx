import { GraduationCap, Trophy } from "lucide-react";
import { intro, principles, skills, stackNote, hackathons } from "@/content/identity";
import { profile } from "@/content/profile";
import { Reveal } from "@/components/animations/reveal";
import { MaskLine } from "@/components/animations/mask-reveal";
import { Parallax } from "@/components/animations/parallax";
import { SectionHeader } from "@/components/ui/section-header";
import { StatusPill } from "@/components/ui/status-pill";

/* 02 · WHO I AM — the person, then how he works, then what he has
 * actually used. Skills are grouped by honest level, and the note under
 * them keeps project libraries out of his personal identity. */
export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="content-auto relative px-6 py-28 lg:px-12 lg:py-40"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          index="02"
          label="Who I am"
          title={<span id="about-title">A student who runs his own infrastructure.</span>}
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            {intro.map((p, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <p className="mb-5 max-w-2xl text-[17px] leading-relaxed text-muted last:mb-0">{p}</p>
              </Reveal>
            ))}
          </div>

          <Parallax depth={40} className="lg:col-span-5">
            <div className="grid gap-px bg-line-soft">
              <Reveal className="bg-base p-6">
                <div className="flex items-center gap-3">
                  <GraduationCap className="h-4 w-4 text-faint" aria-hidden />
                  <span className="label">Education</span>
                </div>
                <p className="mt-4 text-[15px] text-ink">{profile.education.institution}</p>
                <p className="mt-1 text-sm text-muted">
                  {profile.education.programme} · {profile.education.year} ·{" "}
                  {profile.education.location}
                </p>
                <p className="mono mt-4 text-xs text-faint">
                  CGPA <span className="text-ink">{profile.education.cgpa}</span> /{" "}
                  {profile.education.cgpaScale}
                  <span className="ml-2 text-ghost">as stated on the resume</span>
                </p>
              </Reveal>
              <Reveal delay={0.08} className="bg-base p-6">
                <div className="flex items-center gap-3">
                  <Trophy className="h-4 w-4 text-faint" aria-hidden />
                  <span className="label">Hackathons</span>
                </div>
                <ul className="mt-4 space-y-4">
                  {hackathons.map((h) => (
                    <li key={h.id}>
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="text-[15px] text-ink">{h.name}</span>
                        <StatusPill tone={h.result === "Winner" ? "accent" : "muted"}>
                          {h.result}
                        </StatusPill>
                      </div>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted">{h.detail}</p>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </Parallax>
        </div>

        {/* How I approach engineering */}
        <div className="mt-20">
          <Reveal>
            <h3 className="label">How I approach it</h3>
          </Reveal>
          <ol className="mt-6 grid gap-px bg-line-soft sm:grid-cols-2">
            {principles.map((p, i) => (
              <Reveal as="li" key={p.id} delay={(i % 2) * 0.06} className="h-full bg-base p-6 lg:p-8">
                  <span className="mono text-[10px] tracking-[0.2em] text-ghost">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h4 className="display mt-4 text-xl text-ink">
                    <MaskLine>{p.title}</MaskLine>
                  </h4>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted">{p.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>

        {/* Skills — honest levels, and libraries kept out of it */}
        <div className="mt-20">
          <Reveal>
            <h3 className="label">What I have actually worked with</h3>
          </Reveal>
          <ul className="mt-6 grid gap-px bg-line-soft md:grid-cols-2 lg:grid-cols-3">
            {skills.map((g, i) => (
              <Reveal
                as="li"
                key={g.id}
                delay={(i % 3) * 0.05}
                className="flex h-full flex-col bg-base p-6"
              >
                  <div className="flex items-baseline justify-between gap-3">
                    <h4 className="text-[15px] text-ink">{g.title}</h4>
                    <span className="mono shrink-0 text-[10px] tracking-[0.12em] text-accent-soft">
                      {g.level}
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-faint">{g.note}</p>
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {g.items.map((it) => (
                      <li
                        key={it}
                        className="mono border border-line px-2 py-1 text-[10.5px] text-muted"
                      >
                        {it}
                      </li>
                    ))}
                  </ul>
              </Reveal>
            ))}
          </ul>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-3xl text-xs leading-relaxed text-ghost">{stackNote}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import { projects } from "@/content/projects";
import { WorkHeader } from "@/components/work/work-header";
import { WorkIndex } from "@/components/work/work-index";
import { Evidence } from "@/components/work/evidence";
import { Reveal } from "@/components/animations/reveal";
import { MaskLine } from "@/components/animations/mask-reveal";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Five projects: a Debian home lab, a cryptographic discovery tool, a digital hygiene scanner and its prototype, and an AI-assisted health companion — each with verified engineering evidence.",
};

export default function WorkPage() {
  return (
    <>
      <WorkHeader />
      <main id="main" className="relative z-[1] pt-14">
        <section
          aria-labelledby="work-index-title"
          className="flex min-h-[70dvh] flex-col justify-center px-6 py-24 lg:px-12"
        >
          <div className="mx-auto w-full max-w-6xl">
            <p data-enter="rise" style={{ "--enter-delay": "200ms" } as React.CSSProperties} className="label flex items-center gap-3">
              <span className="text-accent">Work</span>
              <span aria-hidden className="h-px w-6 bg-line-strong" />
              <span>{projects.length} projects</span>
            </p>
            <h1
              id="work-index-title"
              className="display mt-8 max-w-4xl text-[clamp(2.6rem,8vw,6.4rem)] leading-[1] text-ink"
            >
              <MaskLine inView={false} delay={0.32}>
                Built, verified,
              </MaskLine>
              <MaskLine inView={false} delay={0.44}>
                still running.
              </MaskLine>
            </h1>
            <Reveal delay={0.5}>
              <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted">
                One of these is a machine in my house rather than a repository. The other four are
                public on GitHub. Every figure below carries the date and the method by which it was
                checked.
              </p>
            </Reveal>
          </div>
        </section>

        <WorkIndex />

        <div className="mt-24 border-t border-line-soft">
          <Evidence />
        </div>
      </main>
    </>
  );
}

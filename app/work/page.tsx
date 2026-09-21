import type { Metadata } from "next";
import { projectBySlug } from "@/content/projects";
import { WorkHeader } from "@/components/work/work-header";
import { WorkIntro } from "@/components/work/work-intro";
import { FeaturedWide, FeaturedPhones } from "@/components/work/featured-project";
import { OtherWork } from "@/components/work/other-work";
import { Reveal } from "@/components/animations/reveal";

export const metadata: Metadata = {
  title: "Work",
  description:
    "CryptoDrishti and SurakshaScore, plus a Debian home lab, an AI health prototype, an earlier SurakshaScore build and an ongoing local-first AI project.",
};

/* Two levels, deliberately. The two featured projects get a full
 * composition each; everything else is a considered list. The
 * engineering evidence that used to fill half this page now lives
 * inside the case study it belongs to. */
export default function WorkPage() {
  const featured = [projectBySlug["cryptodrishti"], projectBySlug["surakshascore"]];
  const other = [
    projectBySlug["home-lab"],
    projectBySlug["aether-health"],
    projectBySlug["surakshascore-mvp"],
    projectBySlug["phantom-hq"],
  ];

  return (
    <>
      <WorkHeader />
      <main id="main" className="relative z-[1] pt-14">
        <WorkIntro count={featured.length + other.length} />

        <section aria-labelledby="featured-title" className="px-6 lg:px-12">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <h2 id="featured-title" className="label border-b border-line-soft pb-4">
                Featured work
              </h2>
            </Reveal>
            <div className="mt-16 space-y-28 lg:mt-20 lg:space-y-40">
              <FeaturedWide project={featured[0]!} index="01" />
              <FeaturedPhones project={featured[1]!} index="02" />
            </div>
          </div>
        </section>

        <section aria-labelledby="other-title" className="mt-32 px-6 lg:mt-44 lg:px-12">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <h2 id="other-title" className="label border-b border-line-soft pb-4">
                Other work &amp; experiments
              </h2>
            </Reveal>
            <div className="mt-14">
              <OtherWork projects={other.filter(Boolean)} />
            </div>
          </div>
        </section>

        <div className="h-32 lg:h-44" />
      </main>
    </>
  );
}

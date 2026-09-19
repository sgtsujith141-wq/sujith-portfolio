import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects, projectBySlug } from "@/content/projects";
import type { ProjectSlug } from "@/lib/types";
import { WorkHeader } from "@/components/work/work-header";
import { CaseStudyView } from "@/components/work/case-study-view";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projectBySlug[slug as ProjectSlug];
  if (!project) return { title: "Not found" };
  return { title: project.name, description: project.tagline };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projectBySlug[slug as ProjectSlug];
  if (!project) notFound();

  return (
    <>
      <WorkHeader />
      <main id="main" className="relative z-[1] pt-14">
        <CaseStudyView project={project} />
      </main>
    </>
  );
}

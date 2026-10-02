import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projectBySlug, projects } from "@/content/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = projectBySlug(slug);
  if (!p) return {};
  return {
    title: `${p.name} · Projects`,
    description: p.one,
    alternates: { canonical: `/projects/${p.slug}` },
    openGraph: { title: `${p.name} · Sujith C`, description: p.one },
  };
}

/* The explorer lives in the layout and reads the slug from the URL. */
export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!projectBySlug(slug)) notFound();
  return null;
}

import type { Metadata } from "next";
import { projectsIntro } from "@/content/site";

export const metadata: Metadata = {
  title: "Projects",
  description: projectsIntro,
  alternates: { canonical: "/projects" },
};

/* The explorer lives in the layout; with no slug it shows the first project. */
export default function ProjectsPage() {
  return null;
}

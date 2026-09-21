import type { MetadataRoute } from "next";
import { profile } from "@/content/personal";
import { projects } from "@/content/projects";

const origin = profile.meta.url.replace(/\/$/, "");
const lastModified = new Date("2026-09-19");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: origin, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${origin}/work`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    ...projects.map((p) => ({
      url: `${origin}/work/${p.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}

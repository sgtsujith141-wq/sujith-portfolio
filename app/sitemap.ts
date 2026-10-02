import type { MetadataRoute } from "next";
import { projects, site } from "@/content/site";

const lastModified = new Date("2026-10-02");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/projects`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    ...projects.map((p) => ({ url: `${site.url}/projects/${p.slug}`, lastModified, changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
}

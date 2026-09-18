import type { MetadataRoute } from "next";
import { profile } from "@/content/profile";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: profile.meta.url,
      lastModified: new Date("2026-09-18"),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}

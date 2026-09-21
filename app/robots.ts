import type { MetadataRoute } from "next";
import { profile } from "@/content/personal";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${profile.meta.url.replace(/\/$/, "")}/sitemap.xml`,
  };
}

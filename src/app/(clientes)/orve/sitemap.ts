import type { MetadataRoute } from "next";
import { orveSitemapEntries } from "@/content/orve/routes";

// Orvé's sitemap, for a domain of its own. Its page is not in the Steevanz sitemap (src/app/sitemap.ts).
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return orveSitemapEntries().map((entry) => ({ ...entry, lastModified, changeFrequency: "monthly" as const }));
}

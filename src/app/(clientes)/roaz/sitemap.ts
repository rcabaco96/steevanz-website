import type { MetadataRoute } from "next";
import { roazSitemapEntries } from "@/content/roaz/routes";

// Roaz's sitemap, for a domain of its own. Its page is not in the Steevanz sitemap (src/app/sitemap.ts).
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return roazSitemapEntries().map((entry) => ({ ...entry, lastModified, changeFrequency: "monthly" as const }));
}

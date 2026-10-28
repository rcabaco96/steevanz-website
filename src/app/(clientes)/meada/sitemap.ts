import type { MetadataRoute } from "next";
import { meadaSitemapEntries } from "@/content/meada/routes";

// Meada's sitemap, for a domain of its own. Its page is not in the Steevanz sitemap (src/app/sitemap.ts).
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return meadaSitemapEntries().map((entry) => ({ ...entry, lastModified, changeFrequency: "monthly" as const }));
}

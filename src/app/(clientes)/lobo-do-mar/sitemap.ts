import type { MetadataRoute } from "next";
import { loboSitemapEntries } from "@/content/lobo-do-mar/routes";

// Lobo do Mar's sitemap, for its own domain once it has one (src/lib/client-sites.ts). Its pages are not in the
// Steevanz sitemap (src/app/sitemap.ts).
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return loboSitemapEntries().map((entry) => ({ ...entry, lastModified, changeFrequency: "monthly" as const }));
}

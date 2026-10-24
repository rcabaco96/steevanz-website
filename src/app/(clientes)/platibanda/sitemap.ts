import type { MetadataRoute } from "next";
import { listings } from "@/content/platibanda/listings";
import { platibandaSitemapEntries } from "@/content/platibanda/routes";

// Platibanda's sitemap, for a domain of its own. Its pages are not in the Steevanz sitemap (src/app/sitemap.ts).
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return platibandaSitemapEntries(listings.map((l) => l.slug)).map((entry) => ({ ...entry, lastModified, changeFrequency: "weekly" as const }));
}

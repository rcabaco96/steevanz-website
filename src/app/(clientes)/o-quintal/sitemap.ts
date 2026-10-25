import type { MetadataRoute } from "next";
import { oQuintalListed } from "@/content/o-quintal/products";
import { oQuintalSitemapEntries } from "@/content/o-quintal/routes";

// O Quintal's sitemap, for its own domain once it has one (src/lib/client-sites.ts). Its pages are not in the
// Steevanz sitemap (src/app/sitemap.ts).
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return oQuintalSitemapEntries(oQuintalListed.map((item) => item.id)).map((entry) => ({ ...entry, lastModified, changeFrequency: "weekly" as const }));
}

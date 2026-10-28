import type { MetadataRoute } from "next";
import { seteChavesSitemapEntries } from "@/content/sete-chaves/routes";

// Sete Chaves' sitemap, for a domain of its own. Its page is not in the Steevanz sitemap (src/app/sitemap.ts).
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return seteChavesSitemapEntries().map((entry) => ({
    ...entry,
    lastModified,
    changeFrequency: "monthly" as const,
  }));
}

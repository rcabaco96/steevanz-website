import type { MetadataRoute } from "next";
import { fabiosSitemapEntries } from "@/content/fabios-roadstop/routes";

// Fabio's Roadstop's sitemap, served at www.fabiosroadstop.pt/sitemap.xml by the proxy. Its pages are not in
// the Steevanz sitemap (src/app/sitemap.ts).
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return fabiosSitemapEntries().map((entry) => ({ ...entry, lastModified, changeFrequency: "monthly" as const }));
}

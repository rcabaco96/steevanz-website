import type { MetadataRoute } from "next";
import { prumoOrigin } from "@/content/prumo/routes";

// Prumo's sitemap, for a domain of its own (one page). Its pages are not in the Steevanz sitemap (src/app/sitemap.ts).
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: prumoOrigin, lastModified: new Date(), changeFrequency: "monthly", priority: 1 }];
}

import type { MetadataRoute } from "next";
import { ferragialOrigin } from "@/content/ferragial/routes";

// The Adega Ferragial's sitemap, for a domain of its own: one page. Not in the Steevanz sitemap (src/app/sitemap.ts).
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: ferragialOrigin, lastModified: new Date(), changeFrequency: "monthly", priority: 1 }];
}

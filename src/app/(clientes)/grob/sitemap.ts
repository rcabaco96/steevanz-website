import type { MetadataRoute } from "next";
import { grobSitemapEntries } from "@/content/grob/routes";

// O sitemap do GROB, para o domínio próprio quando o tiver (src/lib/client-sites.ts). As suas páginas não entram
// no sitemap da Steevanz (src/app/sitemap.ts).
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return grobSitemapEntries().map((entry) => ({ ...entry, lastModified, changeFrequency: "monthly" as const }));
}

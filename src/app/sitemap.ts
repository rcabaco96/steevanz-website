import type { MetadataRoute } from "next";
import { allPublicRoutes } from "@/lib/all-routes";
import { htmlLang, locales } from "@/lib/i18n";
import { localizedHrefs, type Route } from "@/lib/routes";
import { absoluteUrl } from "@/lib/site";

function priorityFor(route: Route): number {
  if (route.key === "home") return 1;
  if (route.key === "product" || route.key === "book") return 0.9;
  if (route.key === "products" || route.key === "sector") return 0.8;
  if (route.key === "doc" || route.key === "docs") return 0.6;
  return 0.4;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return allPublicRoutes().flatMap((route) => {
    const paths = localizedHrefs(route);
    const languages = {
      [htmlLang.pt]: absoluteUrl(paths.pt),
      [htmlLang.en]: absoluteUrl(paths.en),
      "x-default": absoluteUrl(paths.pt),
    };
    return locales.map((locale) => ({
      url: absoluteUrl(paths[locale]),
      lastModified,
      changeFrequency: route.key === "doc" ? ("monthly" as const) : ("weekly" as const),
      priority: priorityFor(route),
      alternates: { languages },
    }));
  });
}

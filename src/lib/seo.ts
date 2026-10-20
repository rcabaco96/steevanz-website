import type { Metadata } from "next";
// Relative imports with extensions keep this module runnable by `node --test` (tests/site-i18n.test.mjs).
import { defaultLocale, htmlLang, locales, ogLocale, type Locale } from "./i18n.ts";
import { localizedHrefs, type Route } from "./routes.ts";
import { absoluteUrl, site } from "./site.ts";

interface PageMetadataInput {
  locale: Locale;
  route: Route;
  title: string;
  description: string;
  image?: string;
  absoluteTitle?: boolean;
  noIndex?: boolean;
  type?: "website" | "article";
}

/** hreflang alternates: the page in each of the six languages, plus x-default (Portuguese). */
export function languageAlternates(route: Route): Record<string, string> {
  const paths = localizedHrefs(route);
  return {
    ...Object.fromEntries(locales.map((locale) => [htmlLang[locale], absoluteUrl(paths[locale])])),
    "x-default": absoluteUrl(paths[defaultLocale]),
  };
}

export function pageMetadata({
  locale,
  route,
  title,
  description,
  image,
  absoluteTitle = false,
  noIndex = false,
  type = "website",
}: PageMetadataInput): Metadata {
  const paths = localizedHrefs(route);
  const canonical = absoluteUrl(paths[locale]);
  const ogImage = image ?? `/og/${locale}`;
  const images = [{ url: ogImage, width: 1200, height: 630, alt: title }];

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical,
      languages: languageAlternates(route),
    },
    openGraph: {
      type,
      url: canonical,
      siteName: site.name,
      title,
      description,
      locale: ogLocale[locale],
      alternateLocale: locales.filter((other) => other !== locale).map((other) => ogLocale[other]),
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}

import type { Metadata } from "next";
import { htmlLang, ogLocale, type Locale } from "./i18n";
import { localizedHrefs, type Route } from "./routes";
import { absoluteUrl, site } from "./site";

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
  const alternateLocale: Locale = locale === "pt" ? "en" : "pt";
  const ogImage = image ?? `/og/${locale}`;
  const images = [{ url: ogImage, width: 1200, height: 630, alt: title }];

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical,
      languages: {
        [htmlLang.pt]: absoluteUrl(paths.pt),
        [htmlLang.en]: absoluteUrl(paths.en),
        "x-default": absoluteUrl(paths.pt),
      },
    },
    openGraph: {
      type,
      url: canonical,
      siteName: site.name,
      title,
      description,
      locale: ogLocale[locale],
      alternateLocale: [ogLocale[alternateLocale]],
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

import type { Metadata } from "next";
import { dolci, dolciCopy, type DolciLocale } from "@/content/dolci-salati";
import { siteUrl } from "@/lib/site";

export function dolciMetadata(locale: DolciLocale): Metadata {
  const copy = dolciCopy[locale];
  return {
    metadataBase: new URL(siteUrl),
    title: copy.title,
    description: copy.description,
    alternates: { languages: { "pt-PT": "/dolci-salati", en: "/dolci-salati/en" } },
    openGraph: {
      title: copy.title,
      description: copy.description,
      locale: locale === "pt" ? "pt_PT" : "en_GB",
      type: "website",
      images: [{ url: dolci.terrace, width: 1546, height: 1017, alt: copy.placeSection.terraceAlt }],
    },
  };
}

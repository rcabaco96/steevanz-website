import type { Product } from "@/content/products";
import type { FaqItem } from "@/content/types";
import type { Locale } from "./i18n";
import { href } from "./routes";
import { absoluteUrl, site, siteUrl } from "./site";

type JsonLdNode = Record<string, unknown>;

const organizationId = `${siteUrl}/#organization`;
const websiteId = `${siteUrl}/#website`;

export function organizationJsonLd(locale: Locale): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": organizationId,
    name: site.name,
    url: siteUrl,
    logo: absoluteUrl("/icon.svg"),
    email: site.email,
    telephone: site.phoneDisplay.replace(/\s/g, ""),
    sameAs: [site.instagramUrl],
    address: { "@type": "PostalAddress", addressLocality: site.city, addressCountry: site.country },
    areaServed: { "@type": "Country", name: "Portugal" },
    description:
      locale === "pt"
        ? "Placas NFC para reviews no Google e soluções de inteligência artificial para restaurantes, salões, clínicas e comércio local."
        : "NFC plates for Google reviews and AI solutions for restaurants, salons, clinics and local shops.",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: site.email,
      telephone: site.phoneDisplay.replace(/\s/g, ""),
      availableLanguage: ["Portuguese", "English"],
    },
  };
}

export function websiteJsonLd(locale: Locale): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": websiteId,
    name: site.name,
    url: absoluteUrl(href(locale, { key: "home" })),
    inLanguage: locale === "pt" ? "pt-PT" : "en",
    publisher: { "@id": organizationId },
  };
}

export function productJsonLd(input: {
  locale: Locale;
  product: Product;
  name: string;
  description: string;
  image: string;
}): JsonLdNode {
  const { locale, product, name, description, image } = input;
  const url = absoluteUrl(href(locale, { key: "product", productId: product.id }));
  const isRecurring = product.priceBilling === "monthly";
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image: absoluteUrl(image),
    url,
    brand: { "@type": "Brand", name: site.name },
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "EUR",
      price: product.priceFrom.toFixed(2),
      availability: "https://schema.org/InStock",
      seller: { "@id": organizationId },
      priceSpecification: {
        "@type": isRecurring ? "UnitPriceSpecification" : "PriceSpecification",
        price: product.priceFrom.toFixed(2),
        priceCurrency: "EUR",
        minPrice: product.priceFrom.toFixed(2),
        valueAddedTaxIncluded: false,
        ...(isRecurring ? { referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "MON" } } : {}),
      },
    },
  };
}

export function faqJsonLd(items: FaqItem[]): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: stripInlineMarkup(item.a) },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function howToJsonLd(input: {
  name: string;
  description: string;
  path: string;
  steps: { title: string; body: string }[];
}): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    step: input.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: stripInlineMarkup(step.title),
      text: stripInlineMarkup(step.body),
    })),
  };
}

export function stripInlineMarkup(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/`(.+?)`/g, "$1")
    .replace(/\[(.+?)\]\((.+?)\)/g, "$1");
}

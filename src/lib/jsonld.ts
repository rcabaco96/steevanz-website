import type { Product } from "@/content/products";
import type { FaqItem } from "@/content/types";
import { htmlLang, localize, type Locale, type Localized } from "./i18n";
import { href } from "./routes";
import { absoluteUrl, site, siteUrl } from "./site";

type JsonLdNode = Record<string, unknown>;

const organizationId = `${siteUrl}/#organization`;
const websiteId = `${siteUrl}/#website`;

/** What Steevanz is, with the brand line, in each language (schema.org Organization). */
const organizationDescription: Localized<string> = {
  pt: "Websites, Menu digital em vídeo, reservas, reviews no Google e cartão de cliente para restaurantes, cafés, cabeleireiros, clínicas, alojamentos e lojas. Tecnologia do futuro. Com os bons modos de antigamente.",
  en: "Websites, video digital menus, bookings, Google reviews and digital loyalty cards for restaurants, cafés, salons, clinics, holiday rentals and shops. Technology of the future. With good old-fashioned manners.",
  es: "Webs, Menú digital en vídeo, reservas, reseñas en Google y tarjeta de cliente digital para restaurantes, cafeterías, peluquerías, clínicas, alojamientos y tiendas. Tecnología del futuro. Con los buenos modales de antes.",
  fr: "Sites web, Menu digital en vidéo, réservations, avis Google et carte de fidélité digitale pour restaurants, cafés, salons de coiffure, cliniques, locations de vacances et boutiques. Technologie du futur. Avec les bonnes manières d'antan.",
  de: "Websites, Digitale Speisekarte mit Videos, Reservierungen, Google-Bewertungen und digitale Kundenkarte für Restaurants, Cafés, Friseursalons, Praxen, Ferienunterkünfte und Geschäfte. Technologie der Zukunft. Mit den guten Manieren von früher.",
  it: "Siti web, Menù digitale in video, prenotazioni, recensioni Google e carta fedeltà digitale per ristoranti, bar, parrucchieri, cliniche, case vacanza e negozi. Tecnologia del futuro. Con le buone maniere di una volta.",
};

export function organizationJsonLd(locale: Locale): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": organizationId,
    name: site.name,
    url: siteUrl,
    logo: absoluteUrl("/icons/icon-512.png"),
    email: site.email,
    telephone: site.phoneDisplay.replace(/\s/g, ""),
    sameAs: [site.instagramUrl, "https://www.linkedin.com/company/steevanz", "https://www.facebook.com/steevanzsteevanz"],
    address: { "@type": "PostalAddress", addressLocality: site.city, addressCountry: site.country },
    areaServed: { "@type": "Country", name: "Portugal" },
    description: localize(organizationDescription, locale),
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: site.email,
      telephone: site.phoneDisplay.replace(/\s/g, ""),
      // The languages Steevanz answers in (the site is in six; contact stays in these two until the owner says otherwise).
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
    inLanguage: htmlLang[locale],
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
  // Every product is described as a Service (owner, 2026-10-11): we set it up and deliver it, the cart
  // is a request with indicative prices, so Google's merchant listing / product snippet fields
  // (shipping, returns, reviews) don't apply — and we never add ratings we don't have (rule 1).
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    image: absoluteUrl(image),
    url,
    serviceType: name,
    provider: { "@id": organizationId },
    areaServed: { "@type": "Country", name: "Portugal" },
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "EUR",
      price: product.priceFrom.toFixed(2),
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

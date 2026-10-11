import type { Metadata, Viewport } from "next";
import type { Locale } from "./i18n";
import { siteUrl } from "./site";

const defaults = {
  pt: {
    title: "Steevanz — Placas para reviews no Google e IA para negócios locais",
    description:
      "Placas com tecnologia Steevanz que levam os clientes à sua página de reviews no Google com um toque, e soluções de IA para reservas, atendimento e automação. Para restaurantes, salões, clínicas, lojas e alojamento local.",
  },
  en: {
    title: "Steevanz — Plates for Google reviews and AI for local businesses",
    description:
      "Plates with Steevanz technology that take customers to your Google review page in one tap, plus AI solutions for bookings, customer service and automation. For restaurants, salons, clinics, shops and holiday rentals.",
  },
};

export function rootMetadata(locale: Locale): Metadata {
  return {
    metadataBase: new URL(siteUrl),
    title: { default: defaults[locale].title, template: "%s" },
    description: defaults[locale].description,
    applicationName: "Steevanz",
    authors: [{ name: "Steevanz" }],
    creator: "Steevanz",
    formatDetection: { telephone: false },
  };
}

export const rootViewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbf7f1" },
    { media: "(prefers-color-scheme: dark)", color: "#120a14" },
  ],
  width: "device-width",
  initialScale: 1,
};

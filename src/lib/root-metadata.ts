import type { Metadata, Viewport } from "next";
import type { Locale } from "./i18n";
import { siteUrl } from "./site";

// The fallback title and description (pages without their own), with the home's slogan (owner, 2026-10-20).
const defaults = {
  pt: {
    title: "Steevanz | Os seus clientes encontram, compram e voltam",
    description:
      "Websites, Menu digital em vídeo, reservas, reviews no Google e cartão de cliente para restaurantes, cafés, cabeleireiros, clínicas, alojamentos e lojas. Tecnologia do futuro. Com os bons modos de antigamente.",
  },
  en: {
    title: "Steevanz | Your customers find you, buy from you and come back",
    description:
      "Websites, video digital menus, bookings, Google reviews and digital loyalty cards for restaurants, cafés, salons, clinics, holiday rentals and shops. Technology of the future. With good old-fashioned manners.",
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

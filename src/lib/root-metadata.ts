import type { Metadata, Viewport } from "next";
import { localize, type Locale, type Localized } from "./i18n";
import { siteUrl } from "./site";

// The fallback title and description (pages without their own), with the home's slogan (owner, 2026-10-20).
const defaults: Localized<{ title: string; description: string }> = {
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
  es: {
    title: "Steevanz | Sus clientes le encuentran, le compran y vuelven",
    description:
      "Webs, Menú digital en vídeo, reservas, reseñas en Google y tarjeta de cliente digital para restaurantes, cafeterías, peluquerías, clínicas, alojamientos y tiendas. Tecnología del futuro. Con los buenos modales de antes.",
  },
  fr: {
    title: "Steevanz | Vos clients vous trouvent, achètent chez vous et reviennent",
    description:
      "Sites web, Menu digital en vidéo, réservations, avis Google et carte de fidélité digitale pour restaurants, cafés, salons de coiffure, cliniques, locations de vacances et boutiques. Technologie du futur. Avec les bonnes manières d'antan.",
  },
  de: {
    title: "Steevanz | Ihre Kunden finden Sie, kaufen bei Ihnen und kommen wieder",
    description:
      "Websites, Digitale Speisekarte mit Videos, Reservierungen, Google-Bewertungen und digitale Kundenkarte für Restaurants, Cafés, Friseursalons, Praxen, Ferienunterkünfte und Geschäfte. Technologie der Zukunft. Mit den guten Manieren von früher.",
  },
  it: {
    title: "Steevanz | I vostri clienti vi trovano, comprano da voi e tornano",
    description:
      "Siti web, Menù digitale in video, prenotazioni, recensioni Google e carta fedeltà digitale per ristoranti, bar, parrucchieri, cliniche, case vacanza e negozi. Tecnologia del futuro. Con le buone maniere di una volta.",
  },
};

export function rootMetadata(locale: Locale): Metadata {
  const text = localize(defaults, locale);
  return {
    metadataBase: new URL(siteUrl),
    title: { default: text.title, template: "%s" },
    description: text.description,
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

// The people behind each «Cartão de visita digital»: the page /c/<slug> and its contact file /c/<slug>/vcard.
// A content file for now (owner, 2026-10-20); a database and an admin editor can replace it later, with the
// owner's approval. Only real people who asked for a card, with the details they gave us.
// Relative imports with extensions keep this module runnable by `node --test` (tests/business-card.test.mjs).
import type { Locale, Localized } from "../lib/i18n.ts";

export type SocialNetwork = "instagram" | "linkedin" | "facebook" | "tiktok" | "youtube" | "x";

export interface BusinessCard {
  slug: string;
  /** The card owner's language: the page's labels and the html lang follow it. */
  locale: Locale;
  name: string;
  /** For the contact file's N field (family name; given names). */
  familyName: string;
  givenName: string;
  role?: string;
  company?: string;
  /** A square photo in /public, shown round. */
  photo?: { src: string; width: number; height: number };
  /** International format with spaces for display, e.g. «+351 961 292 679». */
  phone?: string;
  /** WhatsApp number (any format; only the digits are used). */
  whatsapp?: string;
  email?: string;
  website?: string;
  socials?: { network: SocialNetwork; url: string }[];
  address?: { lines: string[]; mapsUrl?: string };
}

export const businessCards: BusinessCard[] = [
  // The Steevanz example card (owner, 2026-10-20), shown on the product page as «Veja um exemplo».
  {
    slug: "rogerio-cabaco",
    locale: "pt",
    name: "Rogério Cabaço",
    familyName: "Cabaço",
    givenName: "Rogério",
    role: "CEO & Founder",
    company: "Steevanz",
    photo: { src: "/assinatura/foto.png", width: 180, height: 180 },
    phone: "+351 961 292 679",
    whatsapp: "+351 961 292 679",
    email: "rcabaco@steevanz.com",
    website: "https://www.steevanz.com",
    socials: [
      { network: "instagram", url: "https://www.instagram.com/steevanz_" },
      { network: "linkedin", url: "https://www.linkedin.com/company/steevanz" },
    ],
  },
];

export function getBusinessCard(slug: string): BusinessCard | undefined {
  return businessCards.find((card) => card.slug === slug);
}

/** «+351 961 292 679» → «+351961292679» (tel: links and the contact file). */
export function phoneForLink(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, "");
  return digits.startsWith("00") ? `+${digits.slice(2)}` : digits;
}

/** wa.me wants the number with the country code and digits only. */
export function whatsappLink(number: string): string {
  return `https://wa.me/${phoneForLink(number).replace(/\D/g, "")}`;
}

/** «https://www.steevanz.com/» → «www.steevanz.com». */
export function displayUrl(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export const socialLabels: Record<SocialNetwork, string> = {
  instagram: "Instagram",
  linkedin: "LinkedIn",
  facebook: "Facebook",
  tiktok: "TikTok",
  youtube: "YouTube",
  x: "X",
};

export interface BusinessCardLabels {
  save: string;
  saveHint: string;
  call: string;
  whatsapp: string;
  email: string;
  website: string;
  socials: string;
  address: string;
  openMap: string;
  madeBy: string;
  getYours: string;
}

/** The page's own words in the six site languages (the card's details stay as the owner wrote them). */
export const businessCardLabels: Localized<BusinessCardLabels> = {
  pt: {
    save: "Guardar contacto",
    saveHint: "Fica nos contactos do seu telemóvel, com nome, telefone e email.",
    call: "Ligar",
    whatsapp: "WhatsApp",
    email: "Email",
    website: "Website",
    socials: "Redes sociais",
    address: "Morada",
    openMap: "Abrir no mapa",
    madeBy: "Cartão de visita digital Steevanz",
    getYours: "Quero um cartão assim",
  },
  en: {
    save: "Save contact",
    saveHint: "It goes into your phone's contacts, with name, phone and email.",
    call: "Call",
    whatsapp: "WhatsApp",
    email: "Email",
    website: "Website",
    socials: "Social media",
    address: "Address",
    openMap: "Open in maps",
    madeBy: "Steevanz digital business card",
    getYours: "I want a card like this",
  },
  es: {
    save: "Guardar contacto",
    saveHint: "Se guarda en los contactos de su móvil, con nombre, teléfono y email.",
    call: "Llamar",
    whatsapp: "WhatsApp",
    email: "Email",
    website: "Sitio web",
    socials: "Redes sociales",
    address: "Dirección",
    openMap: "Abrir en el mapa",
    madeBy: "Tarjeta de visita digital Steevanz",
    getYours: "Quiero una tarjeta así",
  },
  fr: {
    save: "Enregistrer le contact",
    saveHint: "Il s'ajoute aux contacts de votre téléphone, avec nom, téléphone et e-mail.",
    call: "Appeler",
    whatsapp: "WhatsApp",
    email: "E-mail",
    website: "Site web",
    socials: "Réseaux sociaux",
    address: "Adresse",
    openMap: "Ouvrir dans le plan",
    madeBy: "Carte de visite digitale Steevanz",
    getYours: "Je veux une carte comme celle-ci",
  },
  de: {
    save: "Kontakt speichern",
    saveHint: "Er landet in den Kontakten Ihres Handys, mit Name, Telefon und E-Mail.",
    call: "Anrufen",
    whatsapp: "WhatsApp",
    email: "E-Mail",
    website: "Website",
    socials: "Soziale Netzwerke",
    address: "Adresse",
    openMap: "In Karten öffnen",
    madeBy: "Digitale Visitenkarte von Steevanz",
    getYours: "Ich möchte so eine Karte",
  },
  it: {
    save: "Salvi il contatto",
    saveHint: "Finisce nei contatti del Suo telefono, con nome, telefono ed email.",
    call: "Chiami",
    whatsapp: "WhatsApp",
    email: "Email",
    website: "Sito web",
    socials: "Social",
    address: "Indirizzo",
    openMap: "Apra nella mappa",
    madeBy: "Biglietto da visita digitale Steevanz",
    getYours: "Voglio un biglietto così",
  },
};

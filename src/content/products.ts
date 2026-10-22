import type { Localized } from "@/lib/i18n";
import type { PhotoId } from "./media";
import type { ProductId, SectorId } from "./types";

export type PriceBilling = "one-time" | "monthly" | "project";

export type ProductFamily = "plates" | "operations" | "ai" | "web";

/** The order families appear in (header menu, products index). */
export const productFamilies: ProductFamily[] = ["plates", "operations", "ai", "web"];

export type ProductIcon =
  | "star-tap"
  | "share-tap"
  | "menu-tap"
  | "guide-tap"
  | "card-tap"
  | "key-tap"
  | "stamp"
  | "calendar"
  | "queue"
  | "chat"
  | "voice"
  | "shield-star"
  | "flow"
  | "page"
  | "browser"
  | "bag";

export interface ProductImage {
  src: string;
  alt: Localized<string>;
  width: number;
  height: number;
}

export interface ProductFormat {
  id: string;
  label: Localized<string>;
}

export interface ProductCustomization {
  formats: ProductFormat[];
  logoExtra: number;
  // "unit": charged on every plate; "line": charged once per cart line (the design is set up once for the whole pack).
  logoExtraPer: "unit" | "line";
  logoExtraIsProvisional: boolean;
  textMaxLength: number;
  /** Only the format is chosen in the cart (no logo option, no text): e.g. the keychain, with or without a key ring. */
  formatOnly?: boolean;
}

// Quantity discount: from `quantity` units on, every unit costs `unitPrice` (12 plates pay the 10-plate price).
// The cart offers each one as a pack shortcut.
export interface ProductPack {
  quantity: number;
  unitPrice: number;
}

export interface Product {
  id: ProductId;
  slug: Localized<string>;
  family: ProductFamily;
  icon: ProductIcon;
  priceFrom: number;
  priceBilling: PriceBilling;
  priceQualifier: Localized<string>;
  /**
   * Units offered on the order that starts the service, once per account (the guest guide's 1st plate): the cart
   * takes them off the first line of the product unless the signed-in client already has it active.
   */
  signupFreeUnits?: number;
  priceIsProvisional: boolean;
  flagship?: boolean;
  sectors: SectorId[];
  related: ProductId[];
  image?: ProductImage;
  contextPhoto?: PhotoId;
  customization?: ProductCustomization;
  packs?: ProductPack[];
  /** What one unit of a pack is: a plate (default), a property (plate and guide included), a card or a keychain. */
  packUnit?: "plate" | "property" | "card" | "keychain";
}

const plateLogoExtra = 10;
const plateTextMaxLength = 60;

export const products: Product[] = [
  {
    id: "google-review-plates",
    slug: { pt: "placas-google-reviews", en: "google-review-plates" },
    family: "plates",
    icon: "star-tap",
    priceFrom: 29,
    priceBilling: "one-time",
    priceQualifier: { pt: "por placa, configuração incluída", en: "per plate, setup included", es: "por placa, configuración incluida", fr: "par plaque, configuration incluse", de: "pro Schild, Einrichtung inklusive", it: "per targa, configurazione inclusa" },
    priceIsProvisional: true,
    flagship: true,
    sectors: ["restaurants", "beauty", "clinics", "retail", "lodging"],
    related: ["ai-reviews", "social-plates", "loyalty"],
    contextPhoto: "restaurant-table",
    customization: {
      formats: [
        { id: "counter-acrylic", label: { pt: "Placa de balcão em acrílico", en: "Acrylic counter plate", es: "Placa de mostrador en acrílico", fr: "Plaque de comptoir en acrylique", de: "Thekenaufsteller aus Acryl", it: "Targa da banco in acrilico" } },
        { id: "table-stand", label: { pt: "Expositor de mesa", en: "Table stand", es: "Expositor de mesa", fr: "Chevalet de table", de: "Tischaufsteller", it: "Espositore da tavolo" } },
        { id: "sticker", label: { pt: "Autocolante (balcão ou montra)", en: "Sticker (counter or window)", es: "Pegatina (mostrador o escaparate)", fr: "Autocollant (comptoir ou vitrine)", de: "Aufkleber (Theke oder Schaufenster)", it: "Adesivo (banco o vetrina)" } },
        { id: "wall-plate", label: { pt: "Placa de parede", en: "Wall plate", es: "Placa de pared", fr: "Plaque murale", de: "Wandschild", it: "Targa da parete" } },
      ],
      // Owner decision 2026-10-05: with the packs, the logo costs +5 € on each plate.
      logoExtra: 5,
      logoExtraPer: "unit",
      logoExtraIsProvisional: true,
      textMaxLength: plateTextMaxLength,
    },
    packs: [
      { quantity: 3, unitPrice: 25 },
      { quantity: 5, unitPrice: 23 },
      { quantity: 10, unitPrice: 20 },
    ],
  },
  {
    id: "social-plates",
    slug: { pt: "placas-redes-sociais", en: "social-media-plates" },
    family: "plates",
    icon: "share-tap",
    priceFrom: 24,
    priceBilling: "one-time",
    priceQualifier: { pt: "por placa ou cartão", en: "per plate or card", es: "por placa o tarjeta", fr: "par plaque ou carte", de: "pro Schild oder Karte", it: "per targa o card" },
    priceIsProvisional: true,
    sectors: ["restaurants", "beauty", "retail", "lodging"],
    related: ["google-review-plates", "loyalty", "ai-chatbot"],
    contextPhoto: "phone-tap",
    customization: {
      formats: [
        { id: "counter-plate", label: { pt: "Placa de balcão", en: "Counter plate", es: "Placa de mostrador", fr: "Plaque de comptoir", de: "Thekenschild", it: "Targa da banco" } },
        { id: "sticker", label: { pt: "Autocolante (montra ou mesa)", en: "Sticker (window or table)", es: "Pegatina (escaparate o mesa)", fr: "Autocollant (vitrine ou table)", de: "Aufkleber (Schaufenster oder Tisch)", it: "Adesivo (vetrina o tavolo)" } },
        { id: "card", label: { pt: "Cartão (tamanho cartão bancário)", en: "Card (credit-card size)", es: "Tarjeta (tamaño tarjeta bancaria)", fr: "Carte (format carte bancaire)", de: "Karte (im Scheckkartenformat)", it: "Card (formato carta di credito)" } },
      ],
      logoExtra: plateLogoExtra,
      logoExtraPer: "unit",
      logoExtraIsProvisional: true,
      textMaxLength: plateTextMaxLength,
    },
  },
  {
    id: "digital-menu",
    slug: { pt: "menu-digital", en: "digital-menu" },
    family: "plates",
    icon: "menu-tap",
    // Owner, 2026-10-15: 20 € per plate, 15 € each from 10 plates (the old packs of 5/10/20 are gone);
    // 2026-10-18: the video menu (building and hosting the menu and its videos) is 30 €/month, shown on the site.
    priceFrom: 20,
    priceBilling: "one-time",
    priceQualifier: { pt: "por placa + 30 €/mês pelo menu em vídeo", en: "per plate + €30/month for the video menu", es: "por placa + 30 €/mes por el menú en vídeo", fr: "par plaque + 30 €/mois pour le menu en vidéo", de: "pro Schild + 30 €/Monat für die Video-Speisekarte", it: "per targa + 30 €/mese per il menù in video" },
    priceIsProvisional: true,
    sectors: ["restaurants", "retail"],
    related: ["google-review-plates", "social-plates", "bookings"],
    contextPhoto: "restaurant-hero",
    customization: {
      formats: [
        { id: "round-sticker", label: { pt: "Autocolante circular de mesa", en: "Round table sticker", es: "Pegatina redonda de mesa", fr: "Autocollant rond de table", de: "Runder Tischaufkleber", it: "Adesivo rotondo da tavolo" } },
        { id: "round-base", label: { pt: "Base circular de mesa", en: "Round table base", es: "Base redonda de mesa", fr: "Socle rond de table", de: "Runder Tischständer", it: "Base rotonda da tavolo" } },
      ],
      logoExtra: plateLogoExtra,
      logoExtraPer: "line",
      logoExtraIsProvisional: true,
      textMaxLength: plateTextMaxLength,
    },
    packs: [{ quantity: 10, unitPrice: 15 }],
  },
  {
    id: "guest-guide",
    slug: { pt: "guia-digital-alojamento", en: "digital-guest-guide" },
    family: "plates",
    icon: "guide-tap",
    // Owner, 2026-10-20: the same model as the Menu digital: 20 € per plate, 15 € each from 10 plates,
    // plus 30 €/month for the guide (writing, four languages, hosting and changes).
    // Owner, 2026-10-20: the 30 €/month is per account (one fee for the host or manager, however many properties);
    // one plate per property.
    // Owner, 2026-10-21: the 1st plate is offered when the client joins the service (one free plate per account,
    // on the order that starts the guide); every other plate costs 20 € / 15 € as before. See `signupFreeUnits`.
    priceFrom: 20,
    priceBilling: "one-time",
    priceQualifier: { pt: "por placa, uma por alojamento, + 30 €/mês por conta · 1.ª placa oferecida na adesão", en: "per plate, one per property, + €30/month per account · 1st plate free when you sign up", es: "por placa, una por alojamiento, + 30 €/mes por cuenta · 1.ª placa de regalo al darse de alta", fr: "par plaque, une par logement, + 30 €/mois par compte · 1re plaque offerte à l'inscription", de: "pro Schild, eins pro Unterkunft, + 30 €/Monat pro Konto · 1. Schild bei Vertragsbeginn kostenlos", it: "per targa, una per alloggio, + 30 €/mese per account · 1ª targa in omaggio all'adesione" },
    signupFreeUnits: 1,
    priceIsProvisional: true,
    sectors: ["lodging"],
    related: ["ai-chatbot", "automation", "google-review-plates"],
    contextPhoto: "holiday-rental",
    customization: {
      formats: [
        { id: "wall-plate", label: { pt: "Placa de parede (entrada, por dentro)", en: "Wall plate (inside the entrance)", es: "Placa de pared (en la entrada, por dentro)", fr: "Plaque murale (à l'intérieur, près de l'entrée)", de: "Wandschild (innen am Eingang)", it: "Targa da parete (all'ingresso, all'interno)" } },
        { id: "table-stand", label: { pt: "Expositor (sala ou receção)", en: "Stand (living room or reception)", es: "Expositor (salón o recepción)", fr: "Chevalet (salon ou réception)", de: "Aufsteller (Wohnzimmer oder Rezeption)", it: "Espositore (soggiorno o reception)" } },
        { id: "sticker", label: { pt: "Autocolante (frigorífico ou espelho)", en: "Sticker (fridge or mirror)", es: "Pegatina (nevera o espejo)", fr: "Autocollant (frigo ou miroir)", de: "Aufkleber (Kühlschrank oder Spiegel)", it: "Adesivo (frigo o specchio)" } },
      ],
      logoExtra: plateLogoExtra,
      logoExtraPer: "line",
      logoExtraIsProvisional: true,
      textMaxLength: plateTextMaxLength,
    },
    packs: [{ quantity: 10, unitPrice: 15 }],
  },
  {
    id: "loyalty",
    slug: { pt: "cartao-fidelidade-digital", en: "digital-loyalty-card" },
    family: "plates",
    icon: "stamp",
    priceFrom: 19,
    priceBilling: "monthly",
    priceQualifier: { pt: "por mês, por loja", en: "per month, per location", es: "al mes, por local", fr: "par mois, par établissement", de: "pro Monat, pro Standort", it: "al mese, per punto vendita" },
    priceIsProvisional: true,
    sectors: ["restaurants", "beauty", "retail"],
    related: ["google-review-plates", "social-plates", "bookings"],
    contextPhoto: "cafe-counter",
  },
  {
    // Owner, 2026-10-20: 10 € per card + IVA, name, contacts and company logo included (no logo extra).
    // The packs are the owner's proposal: change them here and the product page, cart and docs tables follow.
    id: "business-card",
    slug: { pt: "cartao-de-visita-digital", en: "digital-business-card" },
    family: "plates",
    icon: "card-tap",
    priceFrom: 10,
    priceBilling: "one-time",
    priceQualifier: { pt: "por cartão, com nome, contactos e logótipo", en: "per card, with name, contact details and logo", es: "por tarjeta, con nombre, contactos y logotipo", fr: "par carte, avec nom, coordonnées et logo", de: "pro Karte, mit Name, Kontaktdaten und Logo", it: "per biglietto, con nome, contatti e logo" },
    priceIsProvisional: true,
    sectors: ["restaurants", "beauty", "clinics", "retail", "lodging"],
    related: ["keychain", "social-plates", "website"],
    packUnit: "card",
    packs: [
      { quantity: 10, unitPrice: 9 },
      { quantity: 25, unitPrice: 8 },
      { quantity: 50, unitPrice: 7 },
    ],
  },
  {
    // Owner, 2026-10-20: 5 € + IVA each, tap only (no QR code). Packs of 10 for 45 € and 25 for 100 € confirmed.
    // Two formats at the same price (owner, 2026-10-20): with a key ring («Porta-chaves») or without (a tag to stick
    // or hang). The tag stores a /k/<code> address, so Steevanz can change its destination later at no extra cost.
    id: "keychain",
    slug: { pt: "chaveiro-digital", en: "digital-keychain" },
    family: "plates",
    icon: "key-tap",
    priceFrom: 5,
    priceBilling: "one-time",
    priceQualifier: { pt: "cada, com ou sem argola; abre o WhatsApp, o Instagram ou o site", en: "each, with or without a key ring; opens WhatsApp, Instagram or your website", es: "cada uno, con o sin anilla; abre WhatsApp, Instagram o la web", fr: "pièce, avec ou sans anneau ; ouvre WhatsApp, Instagram ou le site", de: "pro Stück, mit oder ohne Ring; öffnet WhatsApp, Instagram oder die Website", it: "al pezzo, con o senza anello; apre WhatsApp, Instagram o il sito" },
    priceIsProvisional: true,
    sectors: ["restaurants", "beauty", "retail", "lodging"],
    related: ["business-card", "social-plates", "google-review-plates"],
    packUnit: "keychain",
    customization: {
      formats: [
        { id: "keyring", label: { pt: "Porta-chaves (com argola)", en: "Keychain (with key ring)", es: "Llavero (con anilla)", fr: "Porte-clés (avec anneau)", de: "Schlüsselanhänger (mit Ring)", it: "Portachiavi (con anello)" } },
        { id: "tag", label: { pt: "Tag (sem argola, para colar ou pendurar)", en: "Tag (no key ring, to stick or hang)", es: "Etiqueta (sin anilla, para pegar o colgar)", fr: "Étiquette (sans anneau, à coller ou à suspendre)", de: "Tag (ohne Ring, zum Aufkleben oder Aufhängen)", it: "Tag (senza anello, da attaccare o appendere)" } },
      ],
      // Only the format is chosen: no logo extra and no text (personalisation is seen at the demo).
      formatOnly: true,
      logoExtra: 0,
      logoExtraPer: "unit",
      logoExtraIsProvisional: false,
      textMaxLength: 0,
    },
    packs: [
      { quantity: 10, unitPrice: 4.5 },
      { quantity: 25, unitPrice: 4 },
    ],
  },
  {
    id: "bookings",
    slug: { pt: "sistema-reservas-online", en: "online-booking-system" },
    family: "operations",
    icon: "calendar",
    priceFrom: 29,
    priceBilling: "monthly",
    priceQualifier: { pt: "por mês, por estabelecimento", en: "per month, per venue", es: "al mes, por establecimiento", fr: "par mois, par établissement", de: "pro Monat, pro Betrieb", it: "al mese, per locale" },
    // Accepted by the owner (2026-10-21): no longer «Preço indicativo».
    priceIsProvisional: false,
    sectors: ["restaurants", "beauty", "clinics"],
    related: ["waitlist", "ai-voice", "ai-chatbot"],
    contextPhoto: "salon-chair",
  },
  {
    id: "waitlist",
    slug: { pt: "lista-espera-digital", en: "digital-waitlist" },
    family: "operations",
    icon: "queue",
    priceFrom: 19,
    priceBilling: "monthly",
    priceQualifier: { pt: "por mês, por estabelecimento", en: "per month, per venue", es: "al mes, por establecimiento", fr: "par mois, par établissement", de: "pro Monat, pro Betrieb", it: "al mese, per locale" },
    // Accepted by the owner (2026-10-21): no longer «Preço indicativo».
    priceIsProvisional: false,
    sectors: ["restaurants", "clinics", "beauty"],
    related: ["bookings", "google-review-plates", "ai-voice"],
    contextPhoto: "restaurant-busy",
  },
  {
    id: "ai-chatbot",
    slug: { pt: "chatbot-ia", en: "ai-chatbot" },
    family: "ai",
    icon: "chat",
    priceFrom: 49,
    priceBilling: "monthly",
    priceQualifier: { pt: "por mês, site + WhatsApp", en: "per month, website + WhatsApp", es: "al mes, web + WhatsApp", fr: "par mois, site + WhatsApp", de: "pro Monat, Website + WhatsApp", it: "al mese, sito + WhatsApp" },
    priceIsProvisional: true,
    sectors: ["restaurants", "beauty", "clinics", "retail", "lodging"],
    related: ["ai-voice", "bookings", "automation"],
    contextPhoto: "phone-chat",
  },
  {
    id: "ai-voice",
    slug: { pt: "rececao-voz-ia", en: "ai-voice-receptionist" },
    family: "ai",
    icon: "voice",
    priceFrom: 99,
    priceBilling: "monthly",
    priceQualifier: { pt: "por mês, por número", en: "per month, per phone line", es: "al mes, por número", fr: "par mois, par numéro", de: "pro Monat, pro Rufnummer", it: "al mese, per numero" },
    priceIsProvisional: true,
    sectors: ["restaurants", "beauty", "clinics", "lodging"],
    related: ["ai-chatbot", "bookings", "waitlist"],
    contextPhoto: "reception-phone",
  },
  {
    id: "ai-reviews",
    slug: { pt: "gestao-reviews-ia", en: "ai-review-management" },
    family: "ai",
    icon: "shield-star",
    priceFrom: 29,
    priceBilling: "monthly",
    priceQualifier: { pt: "por mês, por perfil Google", en: "per month, per Google profile", es: "al mes, por perfil de Google", fr: "par mois, par profil Google", de: "pro Monat, pro Google-Profil", it: "al mese, per profilo Google" },
    priceIsProvisional: true,
    sectors: ["restaurants", "beauty", "clinics", "retail", "lodging"],
    related: ["google-review-plates", "ai-chatbot", "automation"],
    contextPhoto: "owner-laptop",
  },
  {
    id: "automation",
    slug: { pt: "automacao-processos", en: "process-automation" },
    family: "ai",
    icon: "flow",
    // 149 € is the fixed-price «Limpezas e prazos» preset for holiday rentals (proposal 2026-10-11); bespoke projects start higher.
    priceFrom: 149,
    priceBilling: "project",
    priceQualifier: { pt: "por projeto, preço fechado", en: "per project, fixed price", es: "por proyecto, precio cerrado", fr: "par projet, prix fixe", de: "pro Projekt, Festpreis", it: "per progetto, prezzo fisso" },
    priceIsProvisional: true,
    sectors: ["restaurants", "beauty", "clinics", "retail", "lodging"],
    related: ["ai-chatbot", "ai-reviews", "bookings"],
    contextPhoto: "shop-owner",
  },
  {
    id: "landing-page",
    slug: { pt: "landing-page", en: "landing-page" },
    family: "web",
    icon: "page",
    priceFrom: 600,
    priceBilling: "project",
    priceQualifier: { pt: "por projeto, + 15 €/mês de alojamento, sem fidelização", en: "per project, + €15/month hosting, no lock-in", es: "por proyecto, + 15 €/mes de alojamiento web, sin permanencia", fr: "par projet, + 15 €/mois d'hébergement, sans engagement", de: "pro Projekt, + 15 €/Monat Hosting, ohne Mindestlaufzeit", it: "per progetto, + 15 €/mese di hosting, senza vincoli" },
    priceIsProvisional: true,
    sectors: ["restaurants", "beauty", "clinics", "retail"],
    related: ["website", "google-review-plates", "bookings"],
  },
  {
    id: "website",
    slug: { pt: "criacao-website", en: "business-website" },
    family: "web",
    icon: "browser",
    priceFrom: 800,
    priceBilling: "project",
    priceQualifier: { pt: "até 5 páginas, + 25 €/mês de alojamento, sem fidelização", en: "up to 5 pages, + €25/month hosting, no lock-in", es: "hasta 5 páginas, + 25 €/mes de alojamiento web, sin permanencia", fr: "jusqu'à 5 pages, + 25 €/mois d'hébergement, sans engagement", de: "bis zu 5 Seiten, + 25 €/Monat Hosting, ohne Mindestlaufzeit", it: "fino a 5 pagine, + 25 €/mese di hosting, senza vincoli" },
    priceIsProvisional: true,
    sectors: ["restaurants", "beauty", "clinics", "retail", "lodging"],
    related: ["bookings", "digital-menu", "ai-chatbot"],
  },
  {
    id: "online-shop",
    slug: { pt: "loja-online", en: "online-shop" },
    family: "web",
    icon: "bag",
    priceFrom: 1200,
    priceBilling: "project",
    priceQualifier: { pt: "até 50 produtos, + 19 €/mês e 3% por venda, sem fidelização", en: "up to 50 products, + €19/month and 3% per sale, no lock-in", es: "hasta 50 productos, + 19 €/mes y 3 % por venta, sin permanencia", fr: "jusqu'à 50 produits, + 19 €/mois et 3 % par vente, sans engagement", de: "bis zu 50 Produkte, + 19 €/Monat und 3 % pro Verkauf, ohne Mindestlaufzeit", it: "fino a 50 prodotti, + 19 €/mese e 3% per vendita, senza vincoli" },
    priceIsProvisional: true,
    sectors: ["restaurants", "beauty", "clinics", "retail"],
    related: ["website", "loyalty", "automation"],
  },
];

/** Website products (landing page, website, online shop): the checkout asks for a short brief. */
export function isWebProduct(id: string): boolean {
  return products.some((product) => product.id === id && product.family === "web");
}

export const productIds = products.map((product) => product.id);

export function getProduct(id: ProductId): Product {
  const product = products.find((candidate) => candidate.id === id);
  if (!product) throw new Error(`Unknown product ${id}`);
  return product;
}

export function isProductId(value: string): value is ProductId {
  return products.some((product) => product.id === value);
}

/**
 * Product ids renamed on 2026-10-11 (old id → current id). Ids that come from outside (old links
 * with ?produto=…, carts saved in browsers, rows stored before the rename) still resolve.
 */
export const renamedProductIds: Readonly<Record<string, ProductId>> = {
  "nfc-google-reviews": "google-review-plates",
  "nfc-social": "social-plates",
  "nfc-menu": "digital-menu",
};

/** The current product id for an id from outside (URL, saved cart, database row), old ids included. */
export function toProductId(value: unknown): ProductId | null {
  if (typeof value !== "string") return null;
  if (isProductId(value)) return value;
  return Object.prototype.hasOwnProperty.call(renamedProductIds, value) ? renamedProductIds[value] : null;
}

/** Like `toProductId`, but keeps an unknown value as it is (labels, stored rows). */
export function canonicalProductId(value: string): string {
  return toProductId(value) ?? value;
}

/** The id plus its old ids, to match database rows written before or after the rename. */
export function productIdVariants(id: string): string[] {
  return [id, ...Object.keys(renamedProductIds).filter((old) => renamedProductIds[old] === id)];
}

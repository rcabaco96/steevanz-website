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
  priceIsProvisional: boolean;
  flagship?: boolean;
  sectors: SectorId[];
  related: ProductId[];
  image?: ProductImage;
  contextPhoto?: PhotoId;
  customization?: ProductCustomization;
  packs?: ProductPack[];
  /** What one unit of a pack is: a plate (default) or a property (plate and guide included). */
  packUnit?: "plate" | "property";
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
    priceQualifier: { pt: "por placa, configuração incluída", en: "per plate, setup included" },
    priceIsProvisional: true,
    flagship: true,
    sectors: ["restaurants", "beauty", "clinics", "retail", "lodging"],
    related: ["ai-reviews", "social-plates", "loyalty"],
    contextPhoto: "restaurant-table",
    customization: {
      formats: [
        { id: "counter-acrylic", label: { pt: "Placa de balcão em acrílico", en: "Acrylic counter plate" } },
        { id: "table-stand", label: { pt: "Expositor de mesa", en: "Table stand" } },
        { id: "sticker", label: { pt: "Autocolante (balcão ou montra)", en: "Sticker (counter or window)" } },
        { id: "wall-plate", label: { pt: "Placa de parede", en: "Wall plate" } },
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
    priceQualifier: { pt: "por placa ou cartão", en: "per plate or card" },
    priceIsProvisional: true,
    sectors: ["restaurants", "beauty", "retail", "lodging"],
    related: ["google-review-plates", "loyalty", "ai-chatbot"],
    contextPhoto: "phone-tap",
    customization: {
      formats: [
        { id: "counter-plate", label: { pt: "Placa de balcão", en: "Counter plate" } },
        { id: "sticker", label: { pt: "Autocolante (montra ou mesa)", en: "Sticker (window or table)" } },
        { id: "card", label: { pt: "Cartão (tamanho cartão bancário)", en: "Card (credit-card size)" } },
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
    priceQualifier: { pt: "por placa + 30 €/mês pelo menu em vídeo", en: "per plate + €30/month for the video menu" },
    priceIsProvisional: true,
    sectors: ["restaurants", "retail"],
    related: ["google-review-plates", "social-plates", "bookings"],
    contextPhoto: "restaurant-hero",
    customization: {
      formats: [
        { id: "round-sticker", label: { pt: "Autocolante circular de mesa", en: "Round table sticker" } },
        { id: "round-base", label: { pt: "Base circular de mesa", en: "Round table base" } },
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
    priceFrom: 69,
    priceBilling: "one-time",
    priceQualifier: {
      pt: "por alojamento, placa e 4 línguas incluídas; depois 3 €/mês",
      en: "per property, plate and 4 languages included; then €3/month",
    },
    priceIsProvisional: true,
    sectors: ["lodging"],
    related: ["ai-chatbot", "automation", "google-review-plates"],
    contextPhoto: "holiday-rental",
    customization: {
      formats: [
        { id: "wall-plate", label: { pt: "Placa de parede (entrada, por dentro)", en: "Wall plate (inside the entrance)" } },
        { id: "table-stand", label: { pt: "Expositor (sala ou receção)", en: "Stand (living room or reception)" } },
        { id: "sticker", label: { pt: "Autocolante (frigorífico ou espelho)", en: "Sticker (fridge or mirror)" } },
      ],
      logoExtra: plateLogoExtra,
      logoExtraPer: "line",
      logoExtraIsProvisional: true,
      textMaxLength: plateTextMaxLength,
    },
    packUnit: "property",
    // Owner proposal 2026-10-11: volume prices for property managers (per property, plate and guide included).
    packs: [
      { quantity: 3, unitPrice: 59 },
      { quantity: 5, unitPrice: 55 },
      { quantity: 10, unitPrice: 49 },
    ],
  },
  {
    id: "loyalty",
    slug: { pt: "cartao-fidelidade-digital", en: "digital-loyalty-card" },
    family: "plates",
    icon: "stamp",
    priceFrom: 19,
    priceBilling: "monthly",
    priceQualifier: { pt: "por mês, por loja", en: "per month, per location" },
    priceIsProvisional: true,
    sectors: ["restaurants", "beauty", "retail"],
    related: ["google-review-plates", "social-plates", "bookings"],
    contextPhoto: "cafe-counter",
  },
  {
    id: "bookings",
    slug: { pt: "sistema-reservas-online", en: "online-booking-system" },
    family: "operations",
    icon: "calendar",
    priceFrom: 29,
    priceBilling: "monthly",
    priceQualifier: { pt: "por mês, por estabelecimento", en: "per month, per venue" },
    priceIsProvisional: true,
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
    priceQualifier: { pt: "por mês, por estabelecimento", en: "per month, per venue" },
    priceIsProvisional: true,
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
    priceQualifier: { pt: "por mês, site + WhatsApp", en: "per month, website + WhatsApp" },
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
    priceQualifier: { pt: "por mês, por número", en: "per month, per phone line" },
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
    priceQualifier: { pt: "por mês, por perfil Google", en: "per month, per Google profile" },
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
    priceQualifier: { pt: "por projeto, preço fechado", en: "per project, fixed price" },
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
    priceFrom: 350,
    priceBilling: "project",
    priceQualifier: { pt: "por projeto, + 15 €/mês de alojamento, sem fidelização", en: "per project, + €15/month hosting, no lock-in" },
    priceIsProvisional: true,
    sectors: ["restaurants", "beauty", "clinics", "retail"],
    related: ["website", "google-review-plates", "bookings"],
  },
  {
    id: "website",
    slug: { pt: "criacao-website", en: "business-website" },
    family: "web",
    icon: "browser",
    priceFrom: 700,
    priceBilling: "project",
    priceQualifier: { pt: "até 5 páginas, + 25 €/mês de alojamento, sem fidelização", en: "up to 5 pages, + €25/month hosting, no lock-in" },
    priceIsProvisional: true,
    sectors: ["restaurants", "beauty", "clinics", "retail", "lodging"],
    related: ["bookings", "digital-menu", "ai-chatbot"],
  },
  {
    id: "online-shop",
    slug: { pt: "loja-online", en: "online-shop" },
    family: "web",
    icon: "bag",
    priceFrom: 750,
    priceBilling: "project",
    priceQualifier: { pt: "até 50 produtos, + 19 €/mês e 3% por venda, sem fidelização", en: "up to 50 products, + €19/month and 3% per sale, no lock-in" },
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

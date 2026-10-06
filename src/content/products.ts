import type { Localized } from "@/lib/i18n";
import type { PhotoId } from "./media";
import type { ProductId, SectorId } from "./types";

export type PriceBilling = "one-time" | "monthly" | "project";

export type ProductFamily = "nfc" | "operations" | "ai";

export type ProductIcon =
  | "star-tap"
  | "share-tap"
  | "menu-tap"
  | "stamp"
  | "calendar"
  | "queue"
  | "chat"
  | "voice"
  | "shield-star"
  | "flow";

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
}

const plateLogoExtra = 10;
const plateTextMaxLength = 60;

export const products: Product[] = [
  {
    id: "nfc-google-reviews",
    slug: { pt: "placas-nfc-google-reviews", en: "nfc-google-review-plates" },
    family: "nfc",
    icon: "star-tap",
    priceFrom: 29,
    priceBilling: "one-time",
    priceQualifier: { pt: "por placa, configuração incluída", en: "per plate, setup included" },
    priceIsProvisional: true,
    flagship: true,
    sectors: ["restaurants", "beauty", "clinics", "retail"],
    related: ["ai-reviews", "nfc-social", "loyalty"],
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
    id: "nfc-social",
    slug: { pt: "nfc-redes-sociais", en: "nfc-social-media" },
    family: "nfc",
    icon: "share-tap",
    priceFrom: 24,
    priceBilling: "one-time",
    priceQualifier: { pt: "por placa ou cartão", en: "per plate or card" },
    priceIsProvisional: true,
    sectors: ["restaurants", "beauty", "retail"],
    related: ["nfc-google-reviews", "loyalty", "ai-chatbot"],
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
    id: "nfc-menu",
    slug: { pt: "cardapio-digital-nfc", en: "nfc-digital-menu" },
    family: "nfc",
    icon: "menu-tap",
    priceFrom: 15,
    priceBilling: "one-time",
    priceQualifier: { pt: "por placa, configuração incluída", en: "per plate, setup included" },
    priceIsProvisional: true,
    sectors: ["restaurants", "retail"],
    related: ["nfc-google-reviews", "nfc-social", "bookings"],
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
    packs: [
      { quantity: 5, unitPrice: 12 },
      { quantity: 10, unitPrice: 10 },
      { quantity: 20, unitPrice: 9 },
    ],
  },
  {
    id: "loyalty",
    slug: { pt: "cartao-fidelidade-digital", en: "digital-loyalty-card" },
    family: "nfc",
    icon: "stamp",
    priceFrom: 19,
    priceBilling: "monthly",
    priceQualifier: { pt: "por mês, por loja", en: "per month, per location" },
    priceIsProvisional: true,
    sectors: ["restaurants", "beauty", "retail"],
    related: ["nfc-google-reviews", "nfc-social", "bookings"],
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
    related: ["bookings", "nfc-google-reviews", "ai-voice"],
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
    sectors: ["restaurants", "beauty", "clinics", "retail"],
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
    sectors: ["restaurants", "beauty", "clinics"],
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
    sectors: ["restaurants", "beauty", "clinics", "retail"],
    related: ["nfc-google-reviews", "ai-chatbot", "automation"],
    contextPhoto: "owner-laptop",
  },
  {
    id: "automation",
    slug: { pt: "automacao-processos", en: "process-automation" },
    family: "ai",
    icon: "flow",
    priceFrom: 250,
    priceBilling: "project",
    priceQualifier: { pt: "por projeto, preço fechado", en: "per project, fixed price" },
    priceIsProvisional: true,
    sectors: ["restaurants", "beauty", "clinics", "retail"],
    related: ["ai-chatbot", "ai-reviews", "bookings"],
    contextPhoto: "shop-owner",
  },
];

export const productIds = products.map((product) => product.id);

export function getProduct(id: ProductId): Product {
  const product = products.find((candidate) => candidate.id === id);
  if (!product) throw new Error(`Unknown product ${id}`);
  return product;
}

export function isProductId(value: string): value is ProductId {
  return products.some((product) => product.id === value);
}

export const flagshipProduct = products.find((product) => product.flagship) ?? products[0];

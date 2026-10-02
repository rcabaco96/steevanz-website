import type { Localized } from "@/lib/i18n";
import type { PhotoId } from "./media";
import type { ProductId, SectorId } from "./types";

export type PriceBilling = "one-time" | "monthly" | "project";

export type ProductFamily = "nfc" | "operations" | "ai";

export type ProductIcon =
  | "star-tap"
  | "share-tap"
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
  logoExtraIsProvisional: boolean;
  textMaxLength: number;
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
}

const plateLogoExtra = 5;
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
      logoExtra: plateLogoExtra,
      logoExtraIsProvisional: true,
      textMaxLength: plateTextMaxLength,
    },
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
      logoExtraIsProvisional: true,
      textMaxLength: plateTextMaxLength,
    },
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

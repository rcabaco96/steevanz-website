// Copy for «Soluções por setor» (/novo-ultra, SectorIndex). Pure data: prices are NOT written here; they come
// from products.ts (via the shared.ts helpers) and, for the lodging pack, from the lodging sector's `pack`.
import type { PhotoId } from "../media";
import type { ProductId, SectorId } from "../types";

export const sectorIndexCopy = {
  title: "Soluções por *setor*",
  lead: "O que costuma fazer mais diferença em cada tipo de negócio.",
  vatNote: "Preços sem IVA.",
  packLabel: "Pacote alojamento:",
  /** {setup} and {monthly} are replaced with euros(pack.setup) and euros(pack.monthly) from sectors.ts. */
  packValue: "{setup} de configuração + {monthly}/mês",
} as const;

export interface SectorIndexRow {
  sector: SectorId;
  name: string;
  summary: string;
  productIds: readonly ProductId[];
  link: string;
  photo: PhotoId;
  /** Shows the sector's bundle price (sectors.ts `pack`) under the product list. */
  showPack?: boolean;
}

export const sectorIndexRows: readonly SectorIndexRow[] = [
  {
    sector: "restaurants",
    name: "Restauração e cafés",
    summary: "Mesas cheias, menu à vista e o telefone atendido.",
    productIds: ["digital-menu", "google-review-plates", "bookings", "waitlist", "ai-voice"],
    link: "Ver soluções para restauração",
    photo: "restaurant-table",
  },
  {
    sector: "beauty",
    name: "Cabeleireiros e beleza",
    summary: "Agenda cheia e clientes que voltam.",
    productIds: ["bookings", "loyalty", "google-review-plates", "ai-chatbot"],
    link: "Ver soluções para beleza",
    photo: "salon-chair",
  },
  {
    sector: "clinics",
    name: "Clínicas",
    summary: "Marcações a entrar, mesmo fora de horas.",
    productIds: ["bookings", "ai-voice", "waitlist", "ai-reviews"],
    link: "Ver soluções para clínicas",
    photo: "clinic",
  },
  {
    sector: "lodging",
    name: "Alojamento local",
    summary: "Hóspedes bem recebidos, sem chamadas a meio da noite.",
    productIds: ["guest-guide", "ai-chatbot", "website", "automation"],
    link: "Ver soluções para alojamento",
    photo: "holiday-rental",
    showPack: true,
  },
  {
    sector: "retail",
    name: "Lojas e comércio",
    summary: "A montra a trabalhar, mesmo de porta fechada.",
    productIds: ["google-review-plates", "social-plates", "loyalty", "online-shop", "ai-chatbot"],
    link: "Ver soluções para lojas",
    photo: "shop-owner",
  },
];

/**
 * Short names for the index lines. The product pages' full names are longer («Sistema de reservas online»,
 * «Placas para reviews no Google»…); anything not listed falls back to getProductCopy(id, "pt").name.
 */
export const sectorIndexProductNames: Partial<Record<ProductId, string>> = {
  "digital-menu": "Menu digital",
  "google-review-plates": "Placas para reviews",
  bookings: "Reservas online",
  waitlist: "Lista de espera",
  "ai-voice": "Receção por voz com IA",
  loyalty: "Cartão de cliente digital",
  "ai-chatbot": "Chatbot com IA",
  "ai-reviews": "Gestão de reviews com IA",
  "guest-guide": "Guia do alojamento",
  website: "Website",
  automation: "Automação à medida",
  "social-plates": "Placas para redes sociais",
  "online-shop": "Loja online",
};

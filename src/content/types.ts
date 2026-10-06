import type { Locale, Localized } from "@/lib/i18n";

export type ProductId =
  | "nfc-google-reviews"
  | "nfc-social"
  | "nfc-menu"
  | "loyalty"
  | "bookings"
  | "waitlist"
  | "ai-chatbot"
  | "ai-voice"
  | "ai-reviews"
  | "automation";

export type SectorId = "restaurants" | "beauty" | "clinics" | "retail";

export type DocPageId =
  | "getting-started"
  | "setup"
  | "configuration"
  | "usage"
  | "troubleshooting"
  | "faq";

export type CalloutTone = "info" | "tip" | "warning";

export type DocBlock =
  | { type: "h2"; id: string; text: string }
  | { type: "h3"; id: string; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "steps"; items: { title: string; body: string }[] }
  | { type: "callout"; tone: CalloutTone; title?: string; text: string }
  | { type: "code"; code: string; label?: string }
  | { type: "table"; head: string[]; rows: string[][] }
  | { type: "faq"; items: { q: string; a: string }[] };

export interface DocPageContent {
  title: string;
  description: string;
  blocks: DocBlock[];
}

export interface ProductDocs {
  productId: ProductId;
  pages: Record<DocPageId, Localized<DocPageContent>>;
}

export interface TitledText {
  title: string;
  body: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface ProductCopy {
  name: string;
  shortName: string;
  tagline: string;
  summary: string;
  metaTitle: string;
  metaDescription: string;
  heroTitle: string;
  heroSubtitle: string;
  problem: { title: string; body: string; points: string[] };
  solution: { title: string; body: string; points: string[] };
  steps: TitledText[];
  features: TitledText[];
  useCases: ({ sector: SectorId } & TitledText)[];
  includes: string[];
  faq: FaqItem[];
}

export type ProductCopyByLocale = Record<Locale, ProductCopy>;

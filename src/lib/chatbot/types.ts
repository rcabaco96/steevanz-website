// Shared types of the WhatsApp AI assistant («Chatbot com IA para site e WhatsApp»). Pure module:
// used by the admin, the local runner (scripts/chatbot) and the tests (node --test, no build).
// Architecture and decisions: docs/chatbot/ARCHITECTURE.md.

/** The six site languages (owner, 2026-10-20). The assistant answers in the customer's one. */
export const chatbotLanguages = ["pt", "en", "es", "fr", "de", "it"] as const;
export type ChatbotLanguage = (typeof chatbotLanguages)[number];

export function isChatbotLanguage(value: unknown): value is ChatbotLanguage {
  return typeof value === "string" && (chatbotLanguages as readonly string[]).includes(value);
}

/**
 * What kind of business the assistant serves. It changes the fixed safety rules: lodging never
 * shares access codes nor confirms who is staying; clinics never give medical advice.
 */
export const chatbotBusinessKinds = ["restaurant", "lodging", "beauty", "clinic", "retail", "other"] as const;
export type ChatbotBusinessKind = (typeof chatbotBusinessKinds)[number];

export function isChatbotBusinessKind(value: unknown): value is ChatbotBusinessKind {
  return typeof value === "string" && (chatbotBusinessKinds as readonly string[]).includes(value);
}

/** One opening interval; several per weekday are allowed (lunch and dinner). 0 = Sunday. */
export interface WeeklyHours {
  weekday: number;
  /** "HH:MM" (seconds are ignored when they come from Postgres). */
  opens: string;
  closes: string;
}

/** A whole day closed (holiday, vacation). */
export interface Closure {
  /** "YYYY-MM-DD" in the business's time zone. */
  day: string;
  reason?: string | null;
}

export type KnowledgeKind = "faq" | "policy" | "info";

/** One answer the business gave us: a frequent question, a policy or a piece of information. */
export interface KnowledgeEntry {
  id: string;
  kind: KnowledgeKind;
  question: string;
  answer: string;
  /** Extra words people use for this ("wifi, internet, password"). */
  keywords?: string | null;
  /** Lodging with several properties on one number: the property this entry is about (null = all). */
  property?: string | null;
  /** The language the entry is written in (null = the bot's default language). */
  language?: ChatbotLanguage | null;
  active: boolean;
}

/** A dish (video menu) or a service (bookings) with its price. */
export interface CatalogItem {
  name: string;
  description?: string | null;
  priceCents: number | null;
  /** Services: how long it takes. */
  durationMinutes?: number | null;
}

/** A section of a document the business gave the assistant (PDF, Word, text, web page). */
export interface KnowledgeChunk {
  id: string;
  documentId: string;
  documentTitle: string;
  /** «Título › Secção». */
  heading: string;
  body: string;
  property?: string | null;
  language?: ChatbotLanguage | null;
}

/** Everything the assistant may use to answer, put together from the business's data. */
export interface BusinessKnowledge {
  businessName: string;
  kind: ChatbotBusinessKind;
  timeZone: string;
  address?: string | null;
  phone?: string | null;
  mapsUrl?: string | null;
  /** The booking page (Steevanz bookings or the business's own). */
  bookingUrl?: string | null;
  /** The digital menu or price list. */
  menuUrl?: string | null;
  /** The privacy notice the first message links to. */
  privacyUrl?: string | null;
  hours: WeeklyHours[];
  closures: Closure[];
  items: CatalogItem[];
  entries: KnowledgeEntry[];
  /** Sections of the business's documents (searched after its own answers). */
  chunks?: KnowledgeChunk[];
  /** Lodging: up to five properties served by the same number. */
  properties: string[];
}

export type ConversationMode = "bot" | "human";

export interface BotSettings {
  enabled: boolean;
  /** Formal («o senhor») or closer. Only the real model uses it; the fixed messages are always polite. */
  tone: "formal" | "friendly";
  /** Languages the assistant may answer in; others get the default language. */
  languages: ChatbotLanguage[];
  defaultLanguage: ChatbotLanguage;
  /** After the team took a chat over, give it back to the assistant after this long without the team writing (null = only by hand). */
  autoResumeMinutes: number | null;
}

export type HandoffReason =
  | "emergency"
  | "customer_asked"
  | "complaint"
  | "access_code"
  | "medical"
  | "refund"
  | "damage"
  | "early_checkin"
  | "late_checkout"
  | "unknown_answer"
  | "loop_guard"
  | "owner_took_over";

/** What the assistant remembers of one chat between messages. */
export interface ConversationState {
  mode: ConversationMode;
  language: ChatbotLanguage | null;
  /** The assistant has already answered in this chat (there is no introduction message since 2026-10-21). */
  greeted: boolean;
  /** The last bot message offered to pass the chat to a person: a «sim» now means yes. */
  offeredHandoff: boolean;
  handoffReason: HandoffReason | null;
  /** Lodging with several properties: the one this guest is in, once known. */
  property: string | null;
  /** Epoch ms of the last customer message (the 24-hour window of the official API). */
  lastCustomerAt: number | null;
  /** Epoch ms of the last message the team sent in this chat. */
  lastOwnerAt: number | null;
  /** Epoch ms of the bot's recent replies, for the loop guard. */
  recentBotReplies: number[];
}

export function newConversationState(): ConversationState {
  return {
    mode: "bot",
    language: null,
    greeted: false,
    offeredHandoff: false,
    handoffReason: null,
    property: null,
    lastCustomerAt: null,
    lastOwnerAt: null,
    recentBotReplies: [],
  };
}

export type MessageAuthor = "customer" | "bot" | "owner" | "system";

export interface ChatMessage {
  author: MessageAuthor;
  body: string;
  /** Epoch ms. */
  at: number;
}

/** A bot as the engine sees it: its settings and what it knows. */
export interface BotProfile {
  id: string;
  settings: BotSettings;
  knowledge: BusinessKnowledge;
}

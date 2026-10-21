// Database rows of the assistant (supabase/migrations/20261020200000_chatbot.sql) and how they turn
// into what the engine uses. Pure module: shared by the admin, the runner and the tests.
import { formatPrice } from "./text.ts";
import {
  isChatbotBusinessKind,
  isChatbotLanguage,
  newConversationState,
  type BotProfile,
  type ChatbotBusinessKind,
  type ChatbotLanguage,
  type Closure,
  type ConversationState,
  type KnowledgeChunk,
  type KnowledgeEntry,
  type KnowledgeKind,
  type WeeklyHours,
} from "./types.ts";

export const botColumns =
  "id, owner_id, establishment_id, video_menu_id, name, kind, enabled, channel_provider, whatsapp_number, tone, languages, default_language, address, phone, maps_url, booking_url, menu_url, privacy_url, time_zone, properties, auto_resume_minutes, answer_provider, paid_answers_allowed, alert_number, retention_days, created_at, updated_at";

export interface BotRow {
  id: string;
  owner_id: string;
  establishment_id: string | null;
  video_menu_id: string | null;
  name: string;
  kind: ChatbotBusinessKind;
  enabled: boolean;
  channel_provider: "open-wa" | "cloud-api";
  whatsapp_number: string | null;
  tone: "formal" | "friendly";
  languages: string[];
  default_language: string;
  address: string | null;
  phone: string | null;
  maps_url: string | null;
  booking_url: string | null;
  menu_url: string | null;
  privacy_url: string | null;
  time_zone: string;
  properties: string[];
  auto_resume_minutes: number | null;
  answer_provider: "mock" | "ollama" | "real";
  paid_answers_allowed: boolean;
  alert_number: string | null;
  retention_days: number;
  created_at: string;
  updated_at: string;
}

export const knowledgeColumns = "id, bot_id, kind, question, answer, keywords, property, language, active, position, created_at, updated_at";

export interface KnowledgeRow {
  id: string;
  bot_id: string;
  kind: KnowledgeKind;
  question: string;
  answer: string;
  keywords: string | null;
  property: string | null;
  language: string | null;
  active: boolean;
  position: number;
  created_at: string;
  updated_at: string;
}

export const sessionColumns = "bot_id, state, qr, qr_updated_at, number, runner_id, last_seen_at, message, updated_at";

export type SessionState = "stopped" | "starting" | "qr" | "connected" | "disconnected" | "error";

export interface SessionRow {
  bot_id: string;
  state: SessionState;
  qr: string | null;
  qr_updated_at: string | null;
  number: string | null;
  runner_id: string | null;
  last_seen_at: string | null;
  message: string | null;
  updated_at: string;
}

export const conversationColumns =
  "id, bot_id, channel, contact_id, contact_name, state, mode, language, property, handoff_reason, handoff_summary, handoff_urgent, handoff_at, needs_attention, last_customer_at, last_message_at, created_at";

export interface ConversationRow {
  id: string;
  bot_id: string;
  channel: "whatsapp" | "web";
  contact_id: string;
  contact_name: string | null;
  state: Partial<ConversationState> | null;
  mode: "bot" | "human";
  language: string | null;
  property: string | null;
  handoff_reason: string | null;
  handoff_summary: string | null;
  handoff_urgent: boolean;
  handoff_at: string | null;
  needs_attention: boolean;
  last_customer_at: string | null;
  last_message_at: string;
  created_at: string;
}

export const messageColumns = "id, conversation_id, bot_id, author, body, external_id, intents, provider, language, created_at";

export interface MessageRow {
  id: string;
  conversation_id: string;
  bot_id: string;
  author: "customer" | "bot" | "owner" | "system";
  body: string;
  external_id: string | null;
  intents: string[];
  provider: string | null;
  language: string | null;
  created_at: string;
}

export const documentColumns = "id, bot_id, title, source, kind, file_name, source_url, property, language, char_count, chunk_count, active, created_at, updated_at";

export interface DocumentRow {
  id: string;
  bot_id: string;
  title: string;
  source: "upload" | "text" | "url";
  kind: "pdf" | "docx" | "text" | "markdown" | "html";
  file_name: string | null;
  source_url: string | null;
  property: string | null;
  language: string | null;
  char_count: number;
  chunk_count: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChunkRow {
  id: string;
  document_id: string;
  position: number;
  heading: string;
  body: string;
}

/** Document sections as the engine reads them (only active documents). */
export function chunksFrom(documents: readonly DocumentRow[], chunks: readonly ChunkRow[]): KnowledgeChunk[] {
  const byId = new Map(documents.filter((document) => document.active).map((document) => [document.id, document]));
  return chunks
    .filter((chunk) => byId.has(chunk.document_id))
    .map((chunk) => {
      const document = byId.get(chunk.document_id)!;
      return {
        id: chunk.id,
        documentId: document.id,
        documentTitle: document.title,
        heading: chunk.heading,
        body: chunk.body,
        property: document.property,
        language: isChatbotLanguage(document.language) ? document.language : null,
      };
    });
}

/** The parts of other features the assistant reads (establishment, its hours, services, video menu). */
export interface KnowledgeSources {
  establishment?: { name: string; address: string | null; phone: string | null; maps_url: string | null; time_zone: string } | null;
  hours?: { weekday: number; opens: string; closes: string }[];
  closures?: { day: string; reason: string | null }[];
  services?: { name: string; price_cents: number | null; duration_minutes: number; active: boolean }[];
  menu?: { slug: string; active: boolean; dishes: { name: string; description: string; price_cents: number }[] } | null;
  /** Sections of the bot's documents (chunksFrom). */
  chunks?: KnowledgeChunk[];
  /** The site's address, for the video menu link ("https://www.steevanz.com"). */
  siteUrl: string;
}

export function languagesOf(row: Pick<BotRow, "languages">): ChatbotLanguage[] {
  const list = row.languages.filter(isChatbotLanguage);
  return list.length ? list : ["pt"];
}

/** Puts a bot together from its row, its knowledge entries and what it reads from other features. */
export function botProfileFrom(row: BotRow, entries: readonly KnowledgeRow[], sources: KnowledgeSources): BotProfile {
  const languages = languagesOf(row);
  const defaultLanguage = isChatbotLanguage(row.default_language) ? row.default_language : "pt";
  const hours: WeeklyHours[] = (sources.hours ?? []).map((slot) => ({ weekday: slot.weekday, opens: slot.opens.slice(0, 5), closes: slot.closes.slice(0, 5) }));
  const closures: Closure[] = (sources.closures ?? []).map((closure) => ({ day: closure.day, reason: closure.reason }));
  const establishment = sources.establishment ?? null;
  const menu = sources.menu && sources.menu.active ? sources.menu : null;
  const items = [
    ...(menu?.dishes ?? []).map((dish) => ({ name: dish.name, description: dish.description || null, priceCents: dish.price_cents })),
    ...(sources.services ?? []).filter((service) => service.active).map((service) => ({ name: service.name, priceCents: service.price_cents, durationMinutes: service.duration_minutes })),
  ];
  const knowledgeEntries: KnowledgeEntry[] = entries.map((entry) => ({
    id: entry.id,
    kind: entry.kind,
    question: entry.question,
    answer: entry.answer,
    keywords: entry.keywords,
    property: entry.property,
    language: isChatbotLanguage(entry.language) ? entry.language : null,
    active: entry.active,
  }));
  return {
    id: row.id,
    settings: {
      enabled: row.enabled,
      tone: row.tone,
      languages,
      defaultLanguage: languages.includes(defaultLanguage) ? defaultLanguage : languages[0],
      autoResumeMinutes: row.auto_resume_minutes,
    },
    knowledge: {
      businessName: row.name,
      kind: isChatbotBusinessKind(row.kind) ? row.kind : "other",
      timeZone: row.time_zone || establishment?.time_zone || "Europe/Lisbon",
      address: row.address ?? establishment?.address ?? null,
      phone: row.phone ?? establishment?.phone ?? null,
      mapsUrl: row.maps_url ?? establishment?.maps_url ?? null,
      bookingUrl: row.booking_url,
      menuUrl: row.menu_url ?? (menu && menu.dishes.length ? `${sources.siteUrl.replace(/\/+$/, "")}/menu/${menu.slug}` : null),
      privacyUrl: row.privacy_url,
      hours,
      closures,
      items,
      entries: knowledgeEntries,
      chunks: sources.chunks ?? [],
      properties: row.properties.slice(0, 5),
    },
  };
}

/** The engine's memory read back from the database (unknown keys dropped, missing ones filled). */
export function conversationStateFrom(row: Pick<ConversationRow, "state" | "mode">): ConversationState {
  const saved = row.state ?? {};
  const fresh = newConversationState();
  return {
    mode: row.mode === "human" ? "human" : "bot",
    language: isChatbotLanguage(saved.language) ? saved.language : null,
    greeted: saved.greeted === true,
    offeredHandoff: saved.offeredHandoff === true,
    handoffReason: (saved.handoffReason as ConversationState["handoffReason"]) ?? null,
    property: typeof saved.property === "string" ? saved.property : null,
    lastCustomerAt: typeof saved.lastCustomerAt === "number" ? saved.lastCustomerAt : null,
    lastOwnerAt: typeof saved.lastOwnerAt === "number" ? saved.lastOwnerAt : null,
    recentBotReplies: Array.isArray(saved.recentBotReplies) ? saved.recentBotReplies.filter((at): at is number => typeof at === "number").slice(-20) : fresh.recentBotReplies,
  };
}

/** One line per dish or service, for the admin's «what the assistant knows» panel. */
export function itemSummary(item: { name: string; priceCents: number | null; durationMinutes?: number | null }): string {
  return [item.name, item.priceCents !== null ? formatPrice(item.priceCents, "pt") : null, item.durationMinutes ? `${item.durationMinutes} min` : null].filter(Boolean).join(" · ");
}

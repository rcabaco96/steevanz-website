// Admin reads of the WhatsApp assistant (service role; RLS lets nothing else in). Until the
// migration 20261020200000_chatbot.sql is approved and applied, they throw ChatbotNotReadyError and
// the pages show a notice instead.
import { listClients } from "@/lib/admin/queries";
import { siteUrl } from "@/lib/site";
import { createServiceClient } from "@/lib/supabase/service";
import {
  botColumns,
  conversationColumns,
  knowledgeColumns,
  messageColumns,
  sessionColumns,
  type BotRow,
  type ConversationRow,
  documentColumns,
  type DocumentRow,
  type KnowledgeRow,
  type MessageRow,
  type SessionRow,
} from "./rows";
import { setupFactsFrom, setupProgress, type SetupFacts, type SetupProgress } from "./setup";
import { failOn, loadBotProfile } from "./supabase-store";
import type { BotProfile, WeeklyHours } from "./types";

export { ChatbotNotReadyError } from "./supabase-store";

export const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export interface BotListItem extends BotRow {
  ownerLabel: string;
  session: Pick<SessionRow, "state" | "last_seen_at"> | null;
  waiting: number;
  /** «Configurar em 5 passos»: 0–100. */
  setupScore: number;
}

export async function listBots(): Promise<BotListItem[]> {
  const client = createServiceClient();
  const { data, error } = await client.from("chatbot_bots").select(botColumns).order("name");
  failOn(error, "listBots");
  const bots = (data ?? []) as BotRow[];
  if (!bots.length) return [];
  const ids = bots.map((bot) => bot.id);
  const ownerIds = [...new Set(bots.map((bot) => bot.owner_id))];
  const [sessions, waiting, owners, setup] = await Promise.all([
    client.from("chatbot_sessions").select("bot_id, state, last_seen_at").in("bot_id", ids),
    client.from("chatbot_conversations").select("bot_id").eq("needs_attention", true).in("bot_id", ids),
    client.from("profiles").select("id, email, full_name, business_name").in("id", ownerIds),
    setupScores(bots),
  ]);
  failOn(sessions.error, "listBots sessions");
  failOn(waiting.error, "listBots waiting");
  failOn(owners.error, "listBots owners");
  const sessionBy = new Map(((sessions.data ?? []) as Pick<SessionRow, "bot_id" | "state" | "last_seen_at">[]).map((row) => [row.bot_id, row]));
  const waitingBy = new Map<string, number>();
  for (const row of (waiting.data ?? []) as { bot_id: string }[]) waitingBy.set(row.bot_id, (waitingBy.get(row.bot_id) ?? 0) + 1);
  const ownerBy = new Map(((owners.data ?? []) as { id: string; email: string; full_name: string | null; business_name: string | null }[]).map((row) => [row.id, row]));
  return bots.map((bot) => {
    const owner = ownerBy.get(bot.owner_id);
    return {
      ...bot,
      ownerLabel: owner?.business_name || owner?.full_name || owner?.email || "Cliente",
      session: sessionBy.get(bot.id) ?? null,
      waiting: waitingBy.get(bot.id) ?? 0,
      setupScore: setup.get(bot.id) ?? 0,
    };
  });
}

function countBy<T>(rows: readonly T[], key: (row: T) => string): Map<string, number> {
  const map = new Map<string, number>();
  for (const row of rows) map.set(key(row), (map.get(key(row)) ?? 0) + 1);
  return map;
}

/**
 * Each bot's setup score for the list, from its entries, documents and what it reads from its Espaço and video
 * menu (address, hours, priced services and dishes), without loading every document section.
 */
async function setupScores(bots: readonly BotRow[]): Promise<Map<string, number>> {
  const client = createServiceClient();
  const ids = bots.map((bot) => bot.id);
  const establishmentIds = [...new Set(bots.map((bot) => bot.establishment_id).filter((value): value is string => Boolean(value)))];
  const menuIds = [...new Set(bots.map((bot) => bot.video_menu_id).filter((value): value is string => Boolean(value)))];
  const none = Promise.resolve({ data: [] as never[], error: null });
  const [entries, documents, establishments, hours, services, dishes] = await Promise.all([
    client.from("chatbot_knowledge").select("id, bot_id, kind, question, answer, active").in("bot_id", ids),
    client.from("chatbot_documents").select("bot_id").eq("active", true).in("bot_id", ids),
    establishmentIds.length ? client.from("establishments").select("id, address, phone, maps_url").in("id", establishmentIds) : none,
    establishmentIds.length ? client.from("establishment_hours").select("establishment_id").in("establishment_id", establishmentIds) : none,
    establishmentIds.length ? client.from("establishment_services").select("establishment_id").eq("active", true).not("price_cents", "is", null).in("establishment_id", establishmentIds) : none,
    menuIds.length ? client.from("video_menu_dishes").select("menu_id").in("menu_id", menuIds) : none,
  ]);
  failOn(entries.error, "setupScores entries");
  // Before the documents migration the table doesn't exist: no documents.
  const documentRows = documents.error ? [] : ((documents.data ?? []) as { bot_id: string }[]);
  for (const result of [establishments, hours, services, dishes]) failOn(result.error, "setupScores sources");
  const entriesBy = new Map<string, KnowledgeRow[]>();
  for (const entry of (entries.data ?? []) as KnowledgeRow[]) entriesBy.set(entry.bot_id, [...(entriesBy.get(entry.bot_id) ?? []), entry]);
  const documentsBy = countBy(documentRows, (row) => row.bot_id);
  const establishmentBy = new Map(((establishments.data ?? []) as { id: string; address: string | null; phone: string | null; maps_url: string | null }[]).map((row) => [row.id, row]));
  const hoursBy = countBy((hours.data ?? []) as { establishment_id: string }[], (row) => row.establishment_id);
  const servicesBy = countBy((services.data ?? []) as { establishment_id: string }[], (row) => row.establishment_id);
  const dishesBy = countBy((dishes.data ?? []) as { menu_id: string }[], (row) => row.menu_id);
  const scores = new Map<string, number>();
  for (const bot of bots) {
    const place = bot.establishment_id ? establishmentBy.get(bot.establishment_id) : undefined;
    const facts = setupFactsFrom({
      location: Boolean(bot.address || bot.maps_url || place?.address || place?.maps_url),
      contact: Boolean(bot.phone || bot.booking_url || place?.phone),
      structuredHours: bot.establishment_id ? (hoursBy.get(bot.establishment_id) ?? 0) : 0,
      pricedItems: (bot.establishment_id ? (servicesBy.get(bot.establishment_id) ?? 0) : 0) + (bot.video_menu_id ? (dishesBy.get(bot.video_menu_id) ?? 0) : 0),
      entries: entriesBy.get(bot.id) ?? [],
      documents: documentsBy.get(bot.id) ?? 0,
    });
    scores.set(bot.id, setupProgress(facts).score);
  }
  return scores;
}

/** The setup facts of one bot from what the engine reads (its profile), its entries and its documents. */
export function botSetup(profile: BotProfile, entries: readonly KnowledgeRow[], documents: readonly DocumentRow[] | null): { facts: SetupFacts; progress: SetupProgress } {
  const knowledge = profile.knowledge;
  const facts = setupFactsFrom({
    location: Boolean(knowledge.address || knowledge.mapsUrl),
    contact: Boolean(knowledge.phone || knowledge.bookingUrl),
    structuredHours: knowledge.hours.length,
    pricedItems: knowledge.items.filter((item) => item.priceCents !== null).length,
    entries,
    documents: (documents ?? []).filter((document) => document.active).length,
  });
  return { facts, progress: setupProgress(facts) };
}

/** Clients for the «Novo assistente» form (staff accounts left out). */
export async function listClientOptions(): Promise<{ id: string; label: string }[]> {
  const clients = await listClients("");
  return clients.map((client) => ({ id: client.id, label: [client.business_name || client.full_name, client.email].filter(Boolean).join(" · ") }));
}

export interface AdminBot {
  row: BotRow;
  profile: BotProfile;
  ownerLabel: string;
  entries: KnowledgeRow[];
  session: SessionRow | null;
  establishments: { id: string; name: string; slug: string }[];
  /** null: the documents migration (20261021120000) isn't applied yet. */
  documents: DocumentRow[] | null;
  menus: { id: string; name: string; slug: string }[];
  /** The linked Espaço's own weekly hours (the setup can use them instead of writing its own). */
  establishmentHours: WeeklyHours[];
}

export async function getAdminBot(id: string): Promise<AdminBot | null> {
  if (!uuidPattern.test(id)) return null;
  const client = createServiceClient();
  const loaded = await loadBotProfile(client, id, siteUrl);
  if (!loaded) return null;
  const [entries, session, owner, establishments, menus, documents, establishmentHours] = await Promise.all([
    client.from("chatbot_knowledge").select(knowledgeColumns).eq("bot_id", id).order("position").order("created_at"),
    client.from("chatbot_sessions").select(sessionColumns).eq("bot_id", id).maybeSingle(),
    client.from("profiles").select("email, full_name, business_name").eq("id", loaded.row.owner_id).maybeSingle(),
    client.from("establishments").select("id, name, slug").eq("owner_id", loaded.row.owner_id).order("name"),
    client.from("video_menus").select("id, business_name, slug").order("business_name"),
    client.from("chatbot_documents").select(documentColumns).eq("bot_id", id).order("created_at", { ascending: false }),
    loaded.row.establishment_id
      ? client.from("establishment_hours").select("weekday, opens, closes").eq("establishment_id", loaded.row.establishment_id)
      : Promise.resolve({ data: [] as WeeklyHours[], error: null }),
  ]);
  const documentsMissing = documents.error?.code === "PGRST205" || documents.error?.code === "42P01";
  if (!documentsMissing) failOn(documents.error, "getAdminBot documents");
  failOn(entries.error, "getAdminBot entries");
  failOn(session.error, "getAdminBot session");
  failOn(owner.error, "getAdminBot owner");
  failOn(establishments.error, "getAdminBot establishments");
  failOn(menus.error, "getAdminBot menus");
  failOn(establishmentHours.error, "getAdminBot establishment hours");
  const ownerRow = owner.data as { email: string; full_name: string | null; business_name: string | null } | null;
  return {
    row: loaded.row,
    profile: loaded.profile,
    ownerLabel: ownerRow?.business_name || ownerRow?.full_name || ownerRow?.email || "Cliente",
    entries: (entries.data ?? []) as KnowledgeRow[],
    session: (session.data ?? null) as SessionRow | null,
    establishments: (establishments.data ?? []) as { id: string; name: string; slug: string }[],
    documents: documentsMissing ? null : ((documents.data ?? []) as DocumentRow[]),
    menus: ((menus.data ?? []) as { id: string; business_name: string; slug: string }[]).map((menu) => ({ id: menu.id, name: menu.business_name, slug: menu.slug })),
    establishmentHours: ((establishmentHours.data ?? []) as WeeklyHours[]).map((slot) => ({ weekday: slot.weekday, opens: slot.opens.slice(0, 5), closes: slot.closes.slice(0, 5) })),
  };
}

/** The inbox: chats waiting for the team first (urgent first), then the latest ones. */
export async function listConversations(botId: string, limit = 60): Promise<ConversationRow[]> {
  const { data, error } = await createServiceClient()
    .from("chatbot_conversations")
    .select(conversationColumns)
    .eq("bot_id", botId)
    .order("needs_attention", { ascending: false })
    .order("handoff_urgent", { ascending: false })
    .order("last_message_at", { ascending: false })
    .limit(limit);
  failOn(error, "listConversations");
  return (data ?? []) as ConversationRow[];
}

export async function getConversationMessages(botId: string, conversationId: string, limit = 200): Promise<MessageRow[]> {
  if (!uuidPattern.test(conversationId)) return [];
  const { data, error } = await createServiceClient()
    .from("chatbot_messages")
    .select(messageColumns)
    .eq("bot_id", botId)
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: false })
    .limit(limit);
  failOn(error, "getConversationMessages");
  return ((data ?? []) as MessageRow[]).reverse();
}

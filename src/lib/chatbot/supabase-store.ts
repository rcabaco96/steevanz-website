// The assistant's data in Supabase (service role), used by the local runner and the admin. Takes the
// client as an argument so it runs both in Next.js and in plain Node (scripts/chatbot). Needs the
// tables of supabase/migrations/20261020200000_chatbot.sql: until it is applied every call throws
// ChatbotNotReadyError.
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Handoff } from "./engine.ts";
import {
  botColumns,
  botProfileFrom,
  conversationColumns,
  conversationStateFrom,
  knowledgeColumns,
  type BotRow,
  type ConversationRow,
  type KnowledgeRow,
  type KnowledgeSources,
  type SessionState,
} from "./rows.ts";
import type { ChatbotStore, LoadedConversation, NewMessage, SaveExtra } from "./store.ts";
import type { BotProfile, ChatMessage, ConversationState } from "./types.ts";

/** The assistant's tables aren't in the database yet (the migration is waiting for approval). */
export class ChatbotNotReadyError extends Error {
  constructor() {
    super("chatbot tables missing (migration 20261020200000_chatbot.sql not applied)");
    this.name = "ChatbotNotReadyError";
  }
}

export function failOn(error: { code?: string; message: string } | null, context: string): void {
  if (!error) return;
  if (error.code === "PGRST205" || error.code === "42P01") throw new ChatbotNotReadyError();
  throw new Error(`${context}: ${error.message}`);
}

export const historyLimit = 20;

/** A bot with everything it knows: its entries, its establishment (hours, services) and video menu. */
export async function loadBotProfile(client: SupabaseClient, botId: string, siteUrl: string): Promise<{ row: BotRow; profile: BotProfile } | null> {
  const { data, error } = await client.from("chatbot_bots").select(botColumns).eq("id", botId).maybeSingle();
  failOn(error, "loadBotProfile");
  if (!data) return null;
  const row = data as BotRow;
  const [entries, sources] = await Promise.all([
    client.from("chatbot_knowledge").select(knowledgeColumns).eq("bot_id", botId).order("position").order("created_at"),
    loadSources(client, row, siteUrl),
  ]);
  failOn(entries.error, "loadBotProfile entries");
  return { row, profile: botProfileFrom(row, (entries.data ?? []) as KnowledgeRow[], sources) };
}

async function loadSources(client: SupabaseClient, row: BotRow, siteUrl: string): Promise<KnowledgeSources> {
  const sources: KnowledgeSources = { siteUrl };
  if (row.establishment_id) {
    const id = row.establishment_id;
    const [establishment, hours, closures, services] = await Promise.all([
      client.from("establishments").select("name, address, phone, maps_url, time_zone").eq("id", id).maybeSingle(),
      client.from("establishment_hours").select("weekday, opens, closes").eq("establishment_id", id),
      client.from("establishment_closures").select("day, reason").eq("establishment_id", id).gte("day", new Date().toISOString().slice(0, 10)),
      client.from("establishment_services").select("name, price_cents, duration_minutes, active").eq("establishment_id", id).order("sort"),
    ]);
    for (const result of [establishment, hours, closures, services]) if (result.error) throw new Error(`loadSources: ${result.error.message}`);
    sources.establishment = establishment.data as KnowledgeSources["establishment"];
    sources.hours = (hours.data ?? []) as KnowledgeSources["hours"];
    sources.closures = (closures.data ?? []) as KnowledgeSources["closures"];
    sources.services = (services.data ?? []) as KnowledgeSources["services"];
  }
  if (row.video_menu_id) {
    const [menu, dishes] = await Promise.all([
      client.from("video_menus").select("slug, active").eq("id", row.video_menu_id).maybeSingle(),
      client.from("video_menu_dishes").select("name, description, price_cents").eq("menu_id", row.video_menu_id).order("position"),
    ]);
    if (menu.error) throw new Error(`loadSources menu: ${menu.error.message}`);
    if (dishes.error) throw new Error(`loadSources dishes: ${dishes.error.message}`);
    if (menu.data) sources.menu = { ...(menu.data as { slug: string; active: boolean }), dishes: (dishes.data ?? []) as { name: string; description: string; price_cents: number }[] };
  }
  return sources;
}

/** What the runner reports for the admin's «Ligação» tab (pairing QR, connected, errors). */
export async function writeSession(
  client: SupabaseClient,
  botId: string,
  patch: { state: SessionState; qr?: string | null; number?: string | null; runnerId?: string; message?: string | null },
): Promise<void> {
  const now = new Date().toISOString();
  const row: Record<string, unknown> = { bot_id: botId, state: patch.state, last_seen_at: now };
  if (patch.qr !== undefined) {
    row.qr = patch.qr;
    row.qr_updated_at = patch.qr ? now : null;
  }
  if (patch.number !== undefined) row.number = patch.number;
  if (patch.runnerId !== undefined) row.runner_id = patch.runnerId;
  if (patch.message !== undefined) row.message = patch.message;
  const { error } = await client.from("chatbot_sessions").upsert(row, { onConflict: "bot_id" });
  failOn(error, "writeSession");
}

function iso(ms: number | null): string | null {
  return ms === null ? null : new Date(ms).toISOString();
}

export class SupabaseChatbotStore implements ChatbotStore {
  private readonly client: SupabaseClient;
  private readonly botIds = new Map<string, string>();

  constructor(client: SupabaseClient) {
    this.client = client;
  }

  async openConversation(botId: string, chatId: string, contactName: string | null): Promise<LoadedConversation> {
    const insert = await this.client
      .from("chatbot_conversations")
      .upsert({ bot_id: botId, channel: "whatsapp", contact_id: chatId, contact_name: contactName }, { onConflict: "bot_id,channel,contact_id", ignoreDuplicates: true });
    failOn(insert.error, "openConversation insert");
    const { data, error } = await this.client
      .from("chatbot_conversations")
      .select(conversationColumns)
      .eq("bot_id", botId)
      .eq("channel", "whatsapp")
      .eq("contact_id", chatId)
      .single();
    failOn(error, "openConversation");
    const row = data as ConversationRow;
    this.botIds.set(row.id, botId);
    if (contactName && contactName !== row.contact_name) {
      await this.client.from("chatbot_conversations").update({ contact_name: contactName }).eq("id", row.id);
    }
    const messages = await this.client
      .from("chatbot_messages")
      .select("author, body, created_at")
      .eq("conversation_id", row.id)
      .order("created_at", { ascending: false })
      .limit(historyLimit);
    failOn(messages.error, "openConversation messages");
    const history: ChatMessage[] = ((messages.data ?? []) as { author: ChatMessage["author"]; body: string; created_at: string }[])
      .reverse()
      .map((message) => ({ author: message.author, body: message.body, at: Date.parse(message.created_at) }));
    return { id: row.id, state: conversationStateFrom(row), history };
  }

  async saveConversation(conversationId: string, state: ConversationState, extra: SaveExtra = {}): Promise<void> {
    const update: Record<string, unknown> = {
      state,
      mode: state.mode,
      language: state.language,
      property: state.property,
      last_customer_at: iso(state.lastCustomerAt),
      last_message_at: new Date().toISOString(),
    };
    const handoff: Handoff | null | undefined = extra.handoff;
    if (handoff) {
      update.handoff_reason = handoff.reason;
      update.handoff_summary = handoff.summary.slice(0, 2000);
      update.handoff_urgent = handoff.urgent;
      update.handoff_at = new Date().toISOString();
      update.needs_attention = true;
    } else if (state.mode === "bot") {
      update.handoff_reason = null;
      update.handoff_urgent = false;
    }
    if (state.mode === "human" && state.handoffReason === "owner_took_over") update.handoff_reason = "owner_took_over";
    if (extra.needsAttention !== undefined) update.needs_attention = extra.needsAttention;
    const { error } = await this.client.from("chatbot_conversations").update(update).eq("id", conversationId);
    failOn(error, "saveConversation");
  }

  async appendMessage(conversationId: string, message: NewMessage): Promise<void> {
    const botId = this.botIds.get(conversationId);
    if (!botId) throw new Error("appendMessage: open the conversation first");
    const { error } = await this.client.from("chatbot_messages").insert({
      conversation_id: conversationId,
      bot_id: botId,
      author: message.author,
      body: message.body.slice(0, 4096),
      external_id: message.externalId ?? null,
      intents: message.intents ?? [],
      provider: message.provider ?? null,
      language: message.language ?? null,
      created_at: new Date(message.at).toISOString(),
    });
    // The same channel message twice (a reconnection): already stored, nothing to do.
    if (error && error.code === "23505") return;
    failOn(error, "appendMessage");
  }

  async hasMessage(botId: string, externalId: string): Promise<boolean> {
    const { data, error } = await this.client.from("chatbot_messages").select("id").eq("bot_id", botId).eq("external_id", externalId).limit(1);
    failOn(error, "hasMessage");
    return Boolean(data?.length);
  }
}

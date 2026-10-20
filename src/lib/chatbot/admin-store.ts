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
  type KnowledgeRow,
  type MessageRow,
  type SessionRow,
} from "./rows";
import { failOn, loadBotProfile } from "./supabase-store";
import type { BotProfile } from "./types";

export { ChatbotNotReadyError } from "./supabase-store";

export const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export interface BotListItem extends BotRow {
  ownerLabel: string;
  session: Pick<SessionRow, "state" | "last_seen_at"> | null;
  waiting: number;
}

export async function listBots(): Promise<BotListItem[]> {
  const client = createServiceClient();
  const { data, error } = await client.from("chatbot_bots").select(botColumns).order("name");
  failOn(error, "listBots");
  const bots = (data ?? []) as BotRow[];
  if (!bots.length) return [];
  const ids = bots.map((bot) => bot.id);
  const ownerIds = [...new Set(bots.map((bot) => bot.owner_id))];
  const [sessions, waiting, owners] = await Promise.all([
    client.from("chatbot_sessions").select("bot_id, state, last_seen_at").in("bot_id", ids),
    client.from("chatbot_conversations").select("bot_id").eq("needs_attention", true).in("bot_id", ids),
    client.from("profiles").select("id, email, full_name, business_name").in("id", ownerIds),
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
    };
  });
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
  menus: { id: string; name: string; slug: string }[];
}

export async function getAdminBot(id: string): Promise<AdminBot | null> {
  if (!uuidPattern.test(id)) return null;
  const client = createServiceClient();
  const loaded = await loadBotProfile(client, id, siteUrl);
  if (!loaded) return null;
  const [entries, session, owner, establishments, menus] = await Promise.all([
    client.from("chatbot_knowledge").select(knowledgeColumns).eq("bot_id", id).order("position").order("created_at"),
    client.from("chatbot_sessions").select(sessionColumns).eq("bot_id", id).maybeSingle(),
    client.from("profiles").select("email, full_name, business_name").eq("id", loaded.row.owner_id).maybeSingle(),
    client.from("establishments").select("id, name, slug").eq("owner_id", loaded.row.owner_id).order("name"),
    client.from("video_menus").select("id, business_name, slug").order("business_name"),
  ]);
  failOn(entries.error, "getAdminBot entries");
  failOn(session.error, "getAdminBot session");
  failOn(owner.error, "getAdminBot owner");
  failOn(establishments.error, "getAdminBot establishments");
  failOn(menus.error, "getAdminBot menus");
  const ownerRow = owner.data as { email: string; full_name: string | null; business_name: string | null } | null;
  return {
    row: loaded.row,
    profile: loaded.profile,
    ownerLabel: ownerRow?.business_name || ownerRow?.full_name || ownerRow?.email || "Cliente",
    entries: (entries.data ?? []) as KnowledgeRow[],
    session: (session.data ?? null) as SessionRow | null,
    establishments: (establishments.data ?? []) as { id: string; name: string; slug: string }[],
    menus: ((menus.data ?? []) as { id: string; business_name: string; slug: string }[]).map((menu) => ({ id: menu.id, name: menu.business_name, slug: menu.slug })),
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

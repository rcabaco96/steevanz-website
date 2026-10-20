"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ActionState } from "@/lib/action-state";
import { AdminAccessError, requireAdmin } from "@/lib/admin/auth";
import { siteUrl } from "@/lib/site";
import { createServiceClient } from "@/lib/supabase/service";
import { demoBots, type DemoBotKey } from "./demo";
import { respond } from "./engine";
import { conversationStateFrom } from "./rows";
import { ChatbotNotReadyError, failOn, loadBotProfile } from "./supabase-store";
import { chatbotLanguages, isChatbotBusinessKind, isChatbotLanguage, newConversationState, type BotProfile, type ChatMessage, type ConversationState } from "./types";

// Admin: the WhatsApp assistants, their knowledge and their conversations. Nothing here costs money:
// the «Experimentar» box runs the free mock; no language model and no WhatsApp message is involved.

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const notReadyMessage = "A base de dados ainda não tem as tabelas do assistente (falta aprovar e aplicar a migração 20261020200000_chatbot.sql).";

class ChatbotMessage extends Error {}

function value(formData: FormData, key: string): string {
  const entry = formData.get(key);
  return typeof entry === "string" ? entry.trim() : "";
}

function optional(formData: FormData, key: string, max: number): string | null {
  const text = value(formData, key);
  if (!text) return null;
  if (text.length > max) throw new ChatbotMessage(`O campo «${key}» é demasiado longo (máximo ${max} caracteres).`);
  return text;
}

function httpsUrl(formData: FormData, key: string, label: string): string | null {
  const text = optional(formData, key, 500);
  if (!text) return null;
  if (!/^https:\/\/[^\s]+$/.test(text)) throw new ChatbotMessage(`${label}: escreva um endereço completo que comece por https://`);
  return text;
}

function id(formData: FormData, key = "id"): string {
  const text = value(formData, key);
  if (!uuid.test(text)) throw new ChatbotMessage("Registo não encontrado.");
  return text;
}

async function guarded(task: () => Promise<ActionState>): Promise<ActionState> {
  try {
    await requireAdmin();
    return await task();
  } catch (error) {
    if (error instanceof AdminAccessError) return { ok: false, message: "Sessão expirada ou sem permissão. Entre novamente." };
    if (error instanceof ChatbotMessage) return { ok: false, message: error.message };
    if (error instanceof ChatbotNotReadyError) return { ok: false, message: notReadyMessage };
    console.error("[chatbot] action failed:", error instanceof Error ? error.message : error);
    return { ok: false, message: "Ocorreu um erro. Tente novamente." };
  }
}

function refresh(botId?: string) {
  revalidatePath("/admin/chatbot");
  if (botId) revalidatePath(`/admin/chatbot/${botId}`);
}

export async function createBot(_state: ActionState, formData: FormData): Promise<ActionState> {
  let created: string | null = null;
  const result = await guarded(async () => {
    const ownerId = id(formData, "owner_id");
    const name = value(formData, "name");
    const kind = value(formData, "kind");
    if (!name || name.length > 120) throw new ChatbotMessage("Escreva o nome do negócio (até 120 caracteres).");
    if (!isChatbotBusinessKind(kind)) throw new ChatbotMessage("Escolha o tipo de negócio.");
    const { data, error } = await createServiceClient().from("chatbot_bots").insert({ owner_id: ownerId, name, kind }).select("id").single();
    failOn(error, "createBot");
    created = (data as { id: string }).id;
    refresh();
    return { ok: true, message: "Assistente criado." };
  });
  if (created) redirect(`/admin/chatbot/${created}?tab=definicoes`);
  return result;
}

export async function updateBot(_state: ActionState, formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const botId = id(formData);
    const name = value(formData, "name");
    const kind = value(formData, "kind");
    if (!name || name.length > 120) throw new ChatbotMessage("Escreva o nome do negócio (até 120 caracteres).");
    if (!isChatbotBusinessKind(kind)) throw new ChatbotMessage("Escolha o tipo de negócio.");
    const languages = formData.getAll("languages").filter((entry): entry is string => typeof entry === "string" && isChatbotLanguage(entry));
    if (!languages.length) throw new ChatbotMessage("Escolha pelo menos uma língua.");
    const defaultLanguage = value(formData, "default_language");
    if (!isChatbotLanguage(defaultLanguage) || !languages.includes(defaultLanguage)) throw new ChatbotMessage("A língua principal tem de estar entre as línguas escolhidas.");
    const properties = value(formData, "properties")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    if (properties.length > 5) throw new ChatbotMessage("No máximo cinco alojamentos por número.");
    if (properties.some((property) => property.length > 120)) throw new ChatbotMessage("O nome de cada alojamento tem no máximo 120 caracteres.");
    const resume = value(formData, "auto_resume_minutes");
    const autoResume = resume ? Number(resume) : null;
    if (autoResume !== null && !(Number.isInteger(autoResume) && autoResume >= 15 && autoResume <= 10080)) throw new ChatbotMessage("Escolha quando o assistente volta à conversa.");
    const retention = Number(value(formData, "retention_days") || 180);
    if (!Number.isInteger(retention) || retention < 7 || retention > 730) throw new ChatbotMessage("O prazo de conservação vai de 7 a 730 dias.");
    const establishmentId = value(formData, "establishment_id");
    const menuId = value(formData, "video_menu_id");
    const channel = value(formData, "channel_provider");
    const tone = value(formData, "tone");
    const number = optional(formData, "whatsapp_number", 40);
    const update = {
      name,
      kind,
      establishment_id: uuid.test(establishmentId) ? establishmentId : null,
      video_menu_id: uuid.test(menuId) ? menuId : null,
      channel_provider: channel === "cloud-api" ? "cloud-api" : "open-wa",
      whatsapp_number: number ? number.replace(/[^\d+]/g, "") : null,
      tone: tone === "friendly" ? "friendly" : "formal",
      languages: chatbotLanguages.filter((language) => languages.includes(language)),
      default_language: defaultLanguage,
      address: optional(formData, "address", 200),
      phone: optional(formData, "phone", 40),
      maps_url: httpsUrl(formData, "maps_url", "Mapa"),
      booking_url: httpsUrl(formData, "booking_url", "Página de reservas"),
      menu_url: httpsUrl(formData, "menu_url", "Menu ou preçário"),
      privacy_url: httpsUrl(formData, "privacy_url", "Política de privacidade"),
      properties,
      auto_resume_minutes: autoResume,
      alert_number: optional(formData, "alert_number", 40),
      retention_days: retention,
    };
    const { error } = await createServiceClient().from("chatbot_bots").update(update).eq("id", botId);
    if (error?.code === "23505") throw new ChatbotMessage("Esse número de WhatsApp já está noutro assistente.");
    failOn(error, "updateBot");
    refresh(botId);
    return { ok: true, message: "Definições guardadas." };
  });
}

export async function setBotEnabled(_state: ActionState, formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const botId = id(formData);
    const enabled = value(formData, "enabled") === "1";
    const { error } = await createServiceClient().from("chatbot_bots").update({ enabled }).eq("id", botId);
    failOn(error, "setBotEnabled");
    refresh(botId);
    return { ok: true, message: enabled ? "Assistente ligado: responde quando o programa estiver a correr." : "Assistente desligado: não responde a ninguém." };
  });
}

export async function saveEntry(_state: ActionState, formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const botId = id(formData, "bot_id");
    const entryId = value(formData, "id");
    const kind = value(formData, "kind");
    const question = value(formData, "question");
    const answer = value(formData, "answer");
    if (!question || question.length > 300) throw new ChatbotMessage("Escreva a pergunta ou o tema (até 300 caracteres).");
    if (!answer || answer.length > 2000) throw new ChatbotMessage("Escreva a resposta (até 2000 caracteres).");
    const language = value(formData, "language");
    const row = {
      bot_id: botId,
      kind: kind === "policy" || kind === "info" ? kind : "faq",
      question,
      answer,
      keywords: optional(formData, "keywords", 300),
      property: optional(formData, "property", 120),
      language: isChatbotLanguage(language) ? language : null,
      active: value(formData, "active") !== "0",
    };
    const client = createServiceClient();
    if (entryId) {
      if (!uuid.test(entryId)) throw new ChatbotMessage("Resposta não encontrada.");
      const { error } = await client.from("chatbot_knowledge").update(row).eq("id", entryId).eq("bot_id", botId);
      failOn(error, "saveEntry update");
    } else {
      const { count, error: countError } = await client.from("chatbot_knowledge").select("id", { count: "exact", head: true }).eq("bot_id", botId);
      failOn(countError, "saveEntry count");
      const { error } = await client.from("chatbot_knowledge").insert({ ...row, position: count ?? 0 });
      failOn(error, "saveEntry insert");
    }
    refresh(botId);
    return { ok: true, message: entryId ? "Resposta atualizada." : "Resposta acrescentada." };
  });
}

export async function deleteEntry(_state: ActionState, formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const botId = id(formData, "bot_id");
    const entryId = id(formData);
    const { error } = await createServiceClient().from("chatbot_knowledge").delete().eq("id", entryId).eq("bot_id", botId);
    failOn(error, "deleteEntry");
    refresh(botId);
    return { ok: true, message: "Resposta apagada." };
  });
}

/** «Devolver ao assistente» (the bot answers again) or «Marcar como vista» (out of the inbox). */
export async function resolveConversation(_state: ActionState, formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const botId = id(formData, "bot_id");
    const conversationId = id(formData);
    const giveBack = value(formData, "action") === "return";
    const client = createServiceClient();
    const { data, error } = await client.from("chatbot_conversations").select("state, mode").eq("id", conversationId).eq("bot_id", botId).maybeSingle();
    failOn(error, "resolveConversation read");
    if (!data) throw new ChatbotMessage("Conversa não encontrada.");
    const update: Record<string, unknown> = { needs_attention: false };
    if (giveBack) {
      const state = conversationStateFrom(data as { state: Partial<ConversationState> | null; mode: "bot" | "human" });
      update.state = { ...state, mode: "bot", handoffReason: null, offeredHandoff: false, recentBotReplies: [] };
      update.mode = "bot";
      update.handoff_reason = null;
      update.handoff_urgent = false;
    }
    const { error: saveError } = await client.from("chatbot_conversations").update(update).eq("id", conversationId).eq("bot_id", botId);
    failOn(saveError, "resolveConversation");
    refresh(botId);
    return { ok: true, message: giveBack ? "Conversa devolvida ao assistente." : "Conversa marcada como vista." };
  });
}

// «Experimentar»: a test chat with the free mock, in the browser. Nothing is stored or sent. ----------

export interface TestTurn {
  author: "customer" | "bot" | "system";
  body: string;
}

export interface TestChatState {
  turns: TestTurn[];
  conversation: ConversationState | null;
  error: string | null;
}

export async function testChat(state: TestChatState, formData: FormData): Promise<TestChatState> {
  const message = value(formData, "message").slice(0, 1000);
  if (value(formData, "reset") === "1") return { turns: [], conversation: null, error: null };
  if (!message) return { ...state, error: "Escreva uma mensagem." };
  try {
    await requireAdmin();
  } catch {
    return { ...state, error: "Sessão expirada ou sem permissão. Entre novamente." };
  }
  let bot: BotProfile | null = null;
  const demo = value(formData, "demo");
  if (demo && demo in demoBots) {
    bot = demoBots[demo as DemoBotKey];
  } else {
    const botId = value(formData, "bot_id");
    if (!uuid.test(botId)) return { ...state, error: "Assistente não encontrado." };
    try {
      const loaded = await loadBotProfile(createServiceClient(), botId, siteUrl);
      bot = loaded?.profile ?? null;
    } catch (error) {
      if (error instanceof ChatbotNotReadyError) return { ...state, error: notReadyMessage };
      console.error("[chatbot] test load failed:", error instanceof Error ? error.message : error);
      return { ...state, error: "Não consegui ler o assistente. Tente novamente." };
    }
  }
  if (!bot) return { ...state, error: "Assistente não encontrado." };
  // A switched-off bot can still be tried here.
  const tried: BotProfile = { ...bot, settings: { ...bot.settings, enabled: true } };
  // The previous state comes back from the browser: read it again through the same checks as the database.
  const previous = state.conversation;
  const conversation = previous ? conversationStateFrom({ state: previous, mode: previous.mode === "human" ? "human" : "bot" }) : newConversationState();
  const now = Date.now();
  const history: ChatMessage[] = state.turns.slice(-20).map((turn, index) => ({ author: turn.author === "system" ? "system" : turn.author, body: turn.body, at: now - (state.turns.length - index) * 1000 }));
  const result = await respond({ bot: tried, conversation, history, message: { body: message, at: now }, now: new Date(now) });
  const turns: TestTurn[] = [...state.turns, { author: "customer", body: message }, ...result.replies.map((body) => ({ author: "bot" as const, body }))];
  if (result.handoff) turns.push({ author: "system", body: `Passagem para a equipa${result.handoff.urgent ? " (urgente)" : ""}.\n${result.handoff.summary}` });
  if (result.silent === "human") turns.push({ author: "system", body: "O assistente fica calado: a equipa tem esta conversa. Recomece para testar de novo." });
  return { turns: turns.slice(-60), conversation: result.conversation, error: null };
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ActionState } from "@/lib/action-state";
import { AdminAccessError, requireAdmin } from "@/lib/admin/auth";
import { siteUrl } from "@/lib/site";
import { createServiceClient } from "@/lib/supabase/service";
import { demoBots, type DemoBotKey } from "./demo";
import { documentLimits, htmlToText, splitIntoChunks, type DocumentKind } from "./documents";
import { extractDocument, ExtractError, isPrivateHost } from "./extract";
import { respond } from "./engine";
import { chooseProvider } from "./llm/providers";
import { conversationStateFrom } from "./rows";
import { ChatbotNotReadyError, failOn, loadBotProfile } from "./supabase-store";
import { chatbotLanguages, isChatbotBusinessKind, isChatbotLanguage, newConversationState, type BotProfile, type ChatMessage, type ConversationState } from "./types";

// Admin: the WhatsApp assistants, their knowledge and their conversations. Nothing here costs money:
// the «Experimentar» box runs the free mock; no language model and no WhatsApp message is involved.

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const notReadyMessage = "A base de dados ainda não tem as tabelas do assistente (falta aprovar e aplicar a migração 20261020200000_chatbot.sql).";
const documentsNotReadyMessage = "A base de dados ainda não tem as tabelas dos documentos (falta aprovar e aplicar a migração 20261021120000_chatbot_documents.sql).";

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
      // «IA de teste (Gemini, grátis)»: off unless ticked. Never touches the paid switch.
      answer_provider: value(formData, "test_ai") === "1" ? "gemini" : "mock",
    };
    const { error } = await createServiceClient().from("chatbot_bots").update(update).eq("id", botId);
    if (error?.code === "23505") throw new ChatbotMessage("Esse número de WhatsApp já está noutro assistente.");
    if (error?.code === "23514" && update.answer_provider === "gemini") throw new ChatbotMessage("Para ligar a IA de teste falta aprovar e aplicar a migração 20261021130000_chatbot_test_ai.sql.");
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
  /** Where a bot answer came from (documents), shown only here in the admin. */
  sources?: { title: string; heading: string }[];
  /** Who wrote it (free answers or the test AI) and why the test AI was not used, if so. */
  by?: string;
  note?: string;
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
  let answerProvider = "mock";
  const demo = value(formData, "demo");
  if (demo && demo in demoBots) {
    bot = demoBots[demo as DemoBotKey];
  } else {
    const botId = value(formData, "bot_id");
    if (!uuid.test(botId)) return { ...state, error: "Assistente não encontrado." };
    try {
      const loaded = await loadBotProfile(createServiceClient(), botId, siteUrl);
      bot = loaded?.profile ?? null;
      answerProvider = loaded?.row.answer_provider ?? "mock";
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
  // The test AI (Gemini free tier) only when turned on for this bot; the paid provider never runs here.
  const provider = chooseProvider({ choice: answerProvider, paidAllowed: false, env: process.env });
  const result = await respond({ bot: tried, conversation, history, message: { body: message, at: now }, now: new Date(now) }, provider);
  const sources = result.sources.map((source) => ({ title: source.documentTitle, heading: source.heading }));
  const by = result.provider?.startsWith("gemini") ? "IA de teste (Gemini)" : result.provider ? "Respostas gratuitas" : null;
  const replies: TestTurn[] = result.replies.map((body, index) =>
    index === result.replies.length - 1 ? { author: "bot" as const, body, ...(sources.length ? { sources } : {}), ...(by ? { by } : {}), ...(result.providerNote ? { note: result.providerNote } : {}) } : { author: "bot" as const, body },
  );
  const turns: TestTurn[] = [...state.turns, { author: "customer", body: message }, ...replies];
  if (result.handoff) turns.push({ author: "system", body: `Passagem para a equipa${result.handoff.urgent ? " (urgente)" : ""}.\n${result.handoff.summary}` });
  if (result.silent === "human") turns.push({ author: "system", body: "O assistente fica calado: a equipa tem esta conversa. Recomece para testar de novo." });
  return { turns: turns.slice(-60), conversation: result.conversation, error: null };
}

// Documents: PDF, Word, text, Markdown, pasted text or a web page. Text is extracted here (free code),
// cut into titled sections and stored; the original file is not kept. -----------------------------

const tooBig = "Demasiado grande (máximo 2,5 MB). Envie uma versão mais pequena ou cole o texto.";

async function fetchPage(address: string): Promise<{ kind: DocumentKind; bytes: Uint8Array; mime: string; name: string }> {
  let url: URL;
  try {
    url = new URL(address);
  } catch {
    throw new ChatbotMessage("Endereço inválido.");
  }
  if (url.protocol !== "https:" || isPrivateHost(url.hostname)) throw new ChatbotMessage("Use um endereço público que comece por https://");
  const response = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(10_000), headers: { "User-Agent": "SteevanzAssistant/1.0 (+https://www.steevanz.com)" } }).catch(() => null);
  if (!response || !response.ok) throw new ChatbotMessage("Não consegui abrir esse endereço. Confirme que a página é pública.");
  if (isPrivateHost(new URL(response.url).hostname)) throw new ChatbotMessage("Esse endereço não é permitido.");
  if (Number(response.headers.get("content-length") ?? 0) > documentLimits.maxFileBytes) throw new ChatbotMessage(tooBig);
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (bytes.byteLength > documentLimits.maxFileBytes) throw new ChatbotMessage(tooBig);
  const mime = (response.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
  const name = url.pathname.split("/").pop() || url.hostname;
  const kind: DocumentKind = mime === "application/pdf" || name.toLowerCase().endsWith(".pdf") ? "pdf" : mime === "text/plain" ? "text" : mime === "text/markdown" ? "markdown" : "html";
  return { kind, bytes, mime, name };
}

function isMissingTable(error: { code?: string } | null): boolean {
  return error?.code === "PGRST205" || error?.code === "42P01";
}

export async function addDocument(_state: ActionState, formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const botId = id(formData, "bot_id");
    const source = value(formData, "source");
    let kind: DocumentKind;
    let text: string;
    let suggestedTitle: string | null = null;
    let fileName: string | null = null;
    let sourceUrl: string | null = null;
    try {
      if (source === "upload") {
        const file = formData.get("file");
        if (!(file instanceof File) || !file.size) throw new ChatbotMessage("Escolha um ficheiro.");
        if (file.size > documentLimits.maxFileBytes) throw new ChatbotMessage(tooBig);
        const extracted = await extractDocument(file.name, file.type, new Uint8Array(await file.arrayBuffer()));
        kind = extracted.kind;
        text = extracted.text;
        fileName = file.name.slice(0, 255);
        suggestedTitle = extracted.title ?? file.name.replace(/\.[a-z0-9]+$/i, "");
      } else if (source === "url") {
        const address = value(formData, "url");
        const page = await fetchPage(address);
        if (page.kind === "html") {
          const html = htmlToText(new TextDecoder("utf-8").decode(page.bytes));
          kind = "html";
          text = html.text;
          suggestedTitle = html.title;
        } else {
          const extracted = await extractDocument(page.name, page.mime, page.bytes);
          kind = extracted.kind;
          text = extracted.text;
          suggestedTitle = page.name;
        }
        sourceUrl = address.length <= 500 ? address : null;
      } else if (source === "text") {
        text = value(formData, "text").slice(0, documentLimits.maxChars);
        if (text.replace(/\s/g, "").length < 20) throw new ChatbotMessage("Cole o texto do documento (pelo menos algumas frases).");
        kind = /^#{1,6}\s/m.test(text) ? "markdown" : "text";
      } else {
        throw new ChatbotMessage("Escolha de onde vem o documento.");
      }
    } catch (error) {
      if (error instanceof ExtractError) throw new ChatbotMessage(error.message);
      throw error;
    }
    const title = (value(formData, "title") || suggestedTitle || "Documento").slice(0, 200);
    const chunks = splitIntoChunks(text, title);
    if (!chunks.length) throw new ChatbotMessage("Não encontrei texto aproveitável neste documento.");
    const language = value(formData, "language");
    const client = createServiceClient();
    const { data, error } = await client
      .from("chatbot_documents")
      .insert({
        bot_id: botId,
        title,
        source,
        kind,
        file_name: fileName,
        source_url: sourceUrl,
        property: optional(formData, "property", 120),
        language: isChatbotLanguage(language) ? language : null,
        char_count: chunks.reduce((sum, chunk) => sum + chunk.body.length, 0),
        chunk_count: chunks.length,
      })
      .select("id")
      .single();
    if (isMissingTable(error)) throw new ChatbotMessage(documentsNotReadyMessage);
    failOn(error, "addDocument");
    const documentId = (data as { id: string }).id;
    for (let start = 0; start < chunks.length; start += 200) {
      const rows = chunks.slice(start, start + 200).map((chunk, offset) => ({
        document_id: documentId,
        bot_id: botId,
        position: start + offset,
        heading: chunk.heading.slice(0, 500),
        body: chunk.body.slice(0, 4000),
      }));
      const { error: chunkError } = await client.from("chatbot_document_chunks").insert(rows);
      if (chunkError) {
        await client.from("chatbot_documents").delete().eq("id", documentId);
        failOn(chunkError, "addDocument chunks");
      }
    }
    refresh(botId);
    return { ok: true, message: `Documento «${title}» acrescentado: ${chunks.length} ${chunks.length === 1 ? "secção" : "secções"}.` };
  });
}

export async function deleteDocument(_state: ActionState, formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const botId = id(formData, "bot_id");
    const documentId = id(formData);
    const { error } = await createServiceClient().from("chatbot_documents").delete().eq("id", documentId).eq("bot_id", botId);
    if (isMissingTable(error)) throw new ChatbotMessage(documentsNotReadyMessage);
    failOn(error, "deleteDocument");
    refresh(botId);
    return { ok: true, message: "Documento apagado." };
  });
}

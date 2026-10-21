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
import { groqEnabled } from "./llm/groq";
import { chooseProvider } from "./llm/providers";
import { conversationStateFrom, type KnowledgeRow } from "./rows";
import { entryFor, findSuggestedFaq, serializeHours, serializePriceList, setupKeywords, setupLimits, setupQuestions, type PriceItem } from "./setup";
import { ChatbotNotReadyError, failOn, loadBotProfile } from "./supabase-store";
import {
  chatbotLanguages,
  isChatbotBusinessKind,
  isChatbotLanguage,
  newConversationState,
  type BotProfile,
  type ChatMessage,
  type Closure,
  type ConversationState,
  type KnowledgeKind,
  type WeeklyHours,
} from "./types";

// Admin: the WhatsApp assistants, their knowledge and their conversations. No WhatsApp message is sent
// from here. «Experimentar» answers with the bot's chosen writer: the free answers, a test AI (Ollama,
// Groq's free tier) or, only with the owner's paid-answers switch on, the AI for clients (Mistral).

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
  if (created) redirect(`/admin/chatbot/${created}?tab=configurar`);
  return result;
}

/**
 * The answer writer chosen in Definições: free answers (default), the local Ollama, Groq's free tier
 * (only while CHATBOT_GROQ_ENABLED=1) or the AI for clients, Mistral ('real'). Choosing 'real' does not
 * authorise it: Mistral answers only once the owner also turns on paid answers (setPaidAnswers).
 */
function answerProviderFrom(formData: FormData): "mock" | "ollama" | "groq" | "real" {
  const choice = value(formData, "answer_provider");
  if (choice === "ollama") return "ollama";
  if (choice === "real") return "real";
  if (choice === "groq") {
    if (!groqEnabled(process.env)) throw new ChatbotMessage("A IA de teste Groq ainda não está ativa neste servidor (falta CHATBOT_GROQ_ENABLED=1).");
    return "groq";
  }
  return "mock";
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
      // AI: off («mock») unless chosen. Never touches the paid switch (setPaidAnswers).
      answer_provider: answerProviderFrom(formData),
    };
    const { error } = await createServiceClient().from("chatbot_bots").update(update).eq("id", botId);
    if (error?.code === "23505") throw new ChatbotMessage("Esse número de WhatsApp já está noutro assistente.");
    if (error?.code === "23514" && update.answer_provider === "ollama") throw new ChatbotMessage("Para ligar a IA de teste falta aprovar e aplicar a migração 20261021130000_chatbot_test_ai.sql.");
    if (error?.code === "23514" && update.answer_provider === "groq") throw new ChatbotMessage("Para ligar a IA de teste Groq falta aprovar e aplicar a migração 20261021150000_chatbot_groq.sql.");
    failOn(error, "updateBot");
    refresh(botId);
    return { ok: true, message: "Definições guardadas." };
  });
}

/**
 * The owner's switch for paid answers (paid_answers_allowed), separate from the settings form and only
 * in the admin (ADMIN_EMAILS; clients never see it): with it on and «IA para clientes (Mistral, UE)»
 * chosen, Mistral writes the answers; off, the free answers reply. Mistral's own spending limit is set
 * in its console when the account moves to the paid plan.
 */
export async function setPaidAnswers(_state: ActionState, formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const botId = id(formData);
    const allowed = value(formData, "paid_answers_allowed") === "1";
    const { error } = await createServiceClient().from("chatbot_bots").update({ paid_answers_allowed: allowed }).eq("id", botId);
    failOn(error, "setPaidAnswers");
    refresh(botId);
    return {
      ok: true,
      message: allowed
        ? "IA paga autorizada: com «IA para clientes (Mistral, UE)» escolhida, a Mistral escreve as respostas."
        : "IA paga desligada: este assistente responde sem IA paga.",
    };
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
  /** Where a bot answer came from (document and clean section name, once each), shown only here in the admin. */
  sources?: { title: string; section: string | null }[];
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
  let paidAllowed = false;
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
      paidAllowed = loaded?.row.paid_answers_allowed === true;
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
  // The test AI only when turned on for this bot: Ollama where it runs on this computer (not on
  // Vercel: there the free answers reply), Groq's free tier also here on the site (capped; any limit,
  // error or timeout → the free answers, with the reason in the note). The AI for clients (Mistral) only
  // with the owner's authorisation for this bot, the same as in the WhatsApp runner.
  const provider = chooseProvider({ choice: answerProvider, paidAllowed, env: process.env });
  // One answer at a time per bot here (the test AI's «one in flight per conversation»).
  const result = await respond({ bot: tried, conversation, history, message: { body: message, at: now }, now: new Date(now), conversationKey: `experimentar:${tried.id}` }, provider);
  const sources: { title: string; section: string | null }[] = [];
  for (const source of result.sources) {
    const item = { title: source.documentTitle, section: source.section ?? null };
    if (!sources.some((seen) => seen.title === item.title && seen.section === item.section)) sources.push(item);
  }
  const by = result.provider?.startsWith("ollama")
    ? "IA de teste local (Ollama)"
    : result.provider?.startsWith("groq")
      ? "IA de teste (Groq, grátis)"
      : result.provider?.startsWith("mistral")
        ? "IA para clientes (Mistral, UE)"
        : result.provider
          ? "Respostas gratuitas"
          : null;
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

// «Configurar em 5 passos»: each step saves on its own. Hours and the price list are knowledge entries with a
// fixed question in a canonical text (setup.ts), read back into structured hours and items by the engine. ---

function jsonField(formData: FormData, key: string): unknown {
  try {
    return JSON.parse(value(formData, key) || "null");
  } catch {
    throw new ChatbotMessage("Não consegui ler o formulário. Recarregue a página e tente novamente.");
  }
}

/** Writes (or removes, with an empty answer) the bot's entry with this question. */
async function upsertSetupEntry(botId: string, question: string, answer: string, kind: KnowledgeKind, keywords: string | null): Promise<void> {
  const client = createServiceClient();
  const { data, error } = await client.from("chatbot_knowledge").select("id, question").eq("bot_id", botId);
  failOn(error, "upsertSetupEntry read");
  const rows = (data ?? []) as Pick<KnowledgeRow, "id" | "question">[];
  const existing = entryFor(rows, question);
  if (!answer.trim()) {
    if (existing) {
      const { error: deleteError } = await client.from("chatbot_knowledge").delete().eq("id", existing.id).eq("bot_id", botId);
      failOn(deleteError, "upsertSetupEntry delete");
    }
    return;
  }
  const row = { kind, question, answer, keywords, active: true };
  if (existing) {
    const { error: updateError } = await client.from("chatbot_knowledge").update(row).eq("id", existing.id).eq("bot_id", botId);
    failOn(updateError, "upsertSetupEntry update");
  } else {
    const { error: insertError } = await client.from("chatbot_knowledge").insert({ ...row, bot_id: botId, position: rows.length, property: null, language: null });
    failOn(insertError, "upsertSetupEntry insert");
  }
}

/** Step 1: the business (name, type, address, phone, booking and map links, languages, tone). */
export async function saveSetupBusiness(_state: ActionState, formData: FormData): Promise<ActionState> {
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
    const update = {
      name,
      kind,
      address: optional(formData, "address", 200),
      phone: optional(formData, "phone", 40),
      booking_url: httpsUrl(formData, "booking_url", "Link de marcação"),
      maps_url: httpsUrl(formData, "maps_url", "Link do Google Maps"),
      languages: chatbotLanguages.filter((language) => languages.includes(language)),
      default_language: defaultLanguage,
      tone: value(formData, "tone") === "friendly" ? "friendly" : "formal",
    };
    const { error } = await createServiceClient().from("chatbot_bots").update(update).eq("id", botId);
    failOn(error, "saveSetupBusiness");
    refresh(botId);
    return { ok: true, message: "Dados do negócio guardados." };
  });
}

const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

function hoursFrom(raw: unknown): WeeklyHours[] {
  if (!Array.isArray(raw) || raw.length > 7 * 3) throw new ChatbotMessage("Horário inválido.");
  return raw.map((slot) => {
    const { weekday, opens, closes } = (slot ?? {}) as Record<string, unknown>;
    if (typeof weekday !== "number" || !Number.isInteger(weekday) || weekday < 0 || weekday > 6) throw new ChatbotMessage("Horário inválido.");
    if (typeof opens !== "string" || typeof closes !== "string" || !timePattern.test(opens) || !timePattern.test(closes)) throw new ChatbotMessage("Escreva as horas como 09:00.");
    if (closes <= opens) throw new ChatbotMessage("Em cada dia, a hora de fecho tem de ser depois da de abertura.");
    return { weekday, opens, closes };
  });
}

function closuresFrom(raw: unknown): Closure[] {
  if (!Array.isArray(raw) || raw.length > setupLimits.closures) throw new ChatbotMessage(`No máximo ${setupLimits.closures} dias fechados.`);
  return raw.map((item) => {
    const { day, reason } = (item ?? {}) as Record<string, unknown>;
    if (typeof day !== "string" || !datePattern.test(day) || Number.isNaN(Date.parse(day))) throw new ChatbotMessage("Escolha a data de cada dia fechado.");
    const text = typeof reason === "string" ? reason.replace(/[()\n]/g, " ").trim().slice(0, 80) : "";
    return { day, reason: text || null };
  });
}

/**
 * Step 2: the weekly hours and closed days (or the linked Espaço's, without copying them) and a free note
 * about holidays and vacations.
 */
export async function saveSetupHours(_state: ActionState, formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const botId = id(formData);
    const useEstablishment = value(formData, "mode") === "establishment";
    const notes = value(formData, "notes");
    if (notes.length > setupLimits.notes) throw new ChatbotMessage(`A nota sobre feriados e férias tem no máximo ${setupLimits.notes} caracteres.`);
    if (useEstablishment) {
      await upsertSetupEntry(botId, setupQuestions.hours, "", "info", null);
    } else {
      const hours = hoursFrom(jsonField(formData, "hours"));
      if (!hours.length) throw new ChatbotMessage("Marque pelo menos um dia aberto, com as horas.");
      const closures = closuresFrom(jsonField(formData, "closures") ?? []);
      await upsertSetupEntry(botId, setupQuestions.hours, serializeHours(hours, closures), "info", setupKeywords.hours);
    }
    await upsertSetupEntry(botId, setupQuestions.holidays, notes, "policy", setupKeywords.holidays);
    refresh(botId);
    return { ok: true, message: useEstablishment ? "O assistente usa o horário do Espaço." : "Horário guardado." };
  });
}

/** Step 3: the services and prices (a simple list; a pasted list is read in the browser first, with a preview). */
export async function saveSetupServices(_state: ActionState, formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const botId = id(formData);
    const raw = jsonField(formData, "items");
    if (!Array.isArray(raw) || raw.length > setupLimits.items) throw new ChatbotMessage(`No máximo ${setupLimits.items} serviços.`);
    const items: PriceItem[] = [];
    for (const entry of raw) {
      const { name, priceCents, priceFrom, durationMinutes } = (entry ?? {}) as Record<string, unknown>;
      const label = typeof name === "string" ? name.replace(/\s+/g, " ").trim() : "";
      if (!label) continue;
      if (label.length > setupLimits.itemName) throw new ChatbotMessage(`O nome «${label.slice(0, 30)}…» é demasiado longo.`);
      const price = priceCents === null || priceCents === undefined ? null : Number(priceCents);
      if (price !== null && !(Number.isInteger(price) && price >= 0 && price <= 10_000_000)) throw new ChatbotMessage(`Preço inválido em «${label}».`);
      const minutes = durationMinutes === null || durationMinutes === undefined ? null : Number(durationMinutes);
      if (minutes !== null && !(Number.isInteger(minutes) && minutes > 0 && minutes <= 24 * 60)) throw new ChatbotMessage(`Duração inválida em «${label}».`);
      items.push({ name: label, priceCents: price, priceFrom: priceFrom === true && price !== null, durationMinutes: minutes });
    }
    await upsertSetupEntry(botId, setupQuestions.services, serializePriceList(items), "info", setupKeywords.services);
    refresh(botId);
    return { ok: true, message: items.length ? `${items.length} ${items.length === 1 ? "serviço guardado" : "serviços guardados"}.` : "Lista vazia: o assistente não diz preços." };
  });
}

/** Step 4: the suggested questions for the sector; only the answered ones are kept (an emptied answer is removed). */
export async function saveSetupFaqs(_state: ActionState, formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const botId = id(formData);
    const kind = value(formData, "kind");
    if (!isChatbotBusinessKind(kind)) throw new ChatbotMessage("Escolha primeiro o tipo de negócio.");
    const raw = jsonField(formData, "answers");
    if (!Array.isArray(raw) || raw.length > 20) throw new ChatbotMessage("Respostas inválidas.");
    let saved = 0;
    for (const entry of raw) {
      const { id: faqId, answer } = (entry ?? {}) as Record<string, unknown>;
      const faq = typeof faqId === "string" ? findSuggestedFaq(kind, faqId) : null;
      if (!faq) continue;
      const text = typeof answer === "string" ? answer.trim() : "";
      if (text.length > setupLimits.faqAnswer) throw new ChatbotMessage(`A resposta a «${faq.question}» tem no máximo ${setupLimits.faqAnswer} caracteres.`);
      await upsertSetupEntry(botId, faq.question, text, faq.kind, faq.keywords);
      if (text) saved++;
    }
    refresh(botId);
    return { ok: true, message: saved ? `${saved} ${saved === 1 ? "resposta guardada" : "respostas guardadas"}.` : "Nenhuma resposta escrita: nada guardado." };
  });
}

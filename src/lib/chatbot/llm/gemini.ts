// Test-only AI answers with the Google Gemini API free tier (owner, 2026-10-20: free AI for tests,
// no paid API yet). OFF by default: a bot uses it only when «IA de teste (Gemini, grátis)» is turned on
// in the admin AND GEMINI_API_KEY is in .env.local. Grounded: the model sees only the bot's own
// information and the retrieved entries/document sections, must answer NO_ANSWER otherwise, and the
// engine's safety rules run before (emergency, codes, medical, hand-off) and after (sanitizeReply).
//
// Google's terms (checked 2026-10-20, docs/chatbot/ARCHITECTURE.md): the free tier may use content
// to improve Google's products, and only paid services may be offered to users in the EEA — so this
// is for the owner's own test messages only, never real customers.
import { minimumChunkScore, minimumCoverage, minimumScore, type SearchHit } from "../knowledge.ts";
import { CallLimiter, limitFromEnv } from "./limiter.ts";
import { buildSystemPrompt } from "./prompt.ts";
import { formatPrice } from "../text.ts";
import { ProviderDisabledError, type AnswerProvider, type AnswerRequest, type AnswerResult, type AnswerSource } from "./types.ts";

export const defaultGeminiModel = "gemini-3.5-flash-lite";
const endpoint = "https://generativelanguage.googleapis.com/v1beta/models";
const noAnswer = "NO_ANSWER";

export type FetchLike = (input: string, init: { method: string; headers: Record<string, string>; body: string; signal?: AbortSignal }) => Promise<{
  ok: boolean;
  status: number;
  json: () => Promise<unknown>;
}>;

export interface GeminiConfig {
  apiKey: string | null;
  model?: string;
  limiter: CallLimiter;
  fetch?: FetchLike;
  timeoutMs?: number;
}

interface ContextItem {
  ref: string;
  text: string;
  source?: AnswerSource;
  entryId?: string;
}

/** The numbered pieces of information the model may use ([E1] entries, [S1] document sections). */
export function contextItems(request: AnswerRequest): ContextItem[] {
  const items: ContextItem[] = [];
  const entries = request.hits.filter((hit) => hit.score >= minimumScore * 0.6);
  entries.slice(0, 5).forEach((hit, index) => {
    if (hit.doc.kind === "entry" && hit.doc.entry) {
      items.push({ ref: `E${index + 1}`, text: `Q: ${hit.doc.entry.question}\nA: ${hit.doc.entry.answer}`, entryId: hit.doc.entry.id });
    } else if (hit.doc.item) {
      const item = hit.doc.item;
      items.push({ ref: `E${index + 1}`, text: `${item.name}${item.priceCents !== null ? ` — ${formatPrice(item.priceCents, request.language)}` : ""}${item.description ? `: ${item.description}` : ""}` });
    }
  });
  const chunks = (request.chunkHits ?? []).filter((hit: SearchHit) => hit.score >= minimumChunkScore * 0.6 || hit.coverage >= minimumCoverage);
  chunks.slice(0, 4).forEach((hit, index) => {
    const chunk = hit.doc.chunk;
    if (!chunk) return;
    items.push({
      ref: `S${index + 1}`,
      text: `[${chunk.heading}]\n${chunk.body}`,
      source: { documentId: chunk.documentId, documentTitle: chunk.documentTitle, heading: chunk.heading, chunkId: chunk.id },
    });
  });
  return items;
}

/** The request body for generateContent (exported for the tests). */
export function geminiRequestBody(request: AnswerRequest, items: readonly ContextItem[]) {
  const system = [
    buildSystemPrompt(request.knowledge, request.settings, request.language),
    "",
    `If the information below does not answer the customer's message, reply exactly ${noAnswer} and nothing else.`,
    "After each fact you use, cite its reference in square brackets, e.g. [S1] or [E2]. Never cite anything else.",
  ].join("\n");
  const context = items.length ? items.map((item) => `[${item.ref}]\n${item.text}`).join("\n\n") : "(no matching entries or document sections)";
  const history = request.history.slice(-6).map((message) => ({
    role: message.author === "customer" ? "user" : "model",
    parts: [{ text: message.body }],
  }));
  return {
    systemInstruction: { parts: [{ text: system }] },
    contents: [...history, { role: "user", parts: [{ text: `Relevant information:\n${context}\n\nCustomer message:\n${request.message}` }] }],
    generationConfig: { temperature: 0.2, maxOutputTokens: 400 },
  };
}

/** The model's text → the answer, its sources (from the [S1]/[E1] references) and no references left. */
export function parseGeminiAnswer(raw: string, items: readonly ContextItem[]): { text: string | null; sources: AnswerSource[]; entryIds: string[] } {
  const trimmed = raw.trim();
  if (!trimmed || trimmed.toUpperCase().startsWith(noAnswer)) return { text: null, sources: [], entryIds: [] };
  const cited = new Set([...trimmed.matchAll(/\[([ES]\d+)\]/g)].map((match) => match[1]));
  const used = items.filter((item) => cited.has(item.ref));
  const text = trimmed.replace(/\s*\[[ES]\d+\](?:\s*\[[ES]\d+\])*/g, "").replace(/[ \t]+\n/g, "\n").trim();
  return {
    text: text || null,
    sources: used.map((item) => item.source).filter((source): source is AnswerSource => Boolean(source)),
    entryIds: used.map((item) => item.entryId).filter((value): value is string => Boolean(value)),
  };
}

export class GeminiError extends Error {}

export function createGeminiProvider(config: GeminiConfig): AnswerProvider {
  const model = config.model || defaultGeminiModel;
  const doFetch: FetchLike = config.fetch ?? ((input, init) => fetch(input, init));
  return {
    id: "gemini",
    paid: false,
    async answer(request: AnswerRequest): Promise<AnswerResult> {
      if (!config.apiKey) throw new ProviderDisabledError("gemini (sem GEMINI_API_KEY)");
      if (!config.limiter.take()) throw new ProviderDisabledError("gemini (limite de testes atingido)");
      const items = contextItems(request);
      const response = await doFetch(`${endpoint}/${encodeURIComponent(model)}:generateContent`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": config.apiKey },
        body: JSON.stringify(geminiRequestBody(request, items)),
        signal: AbortSignal.timeout(config.timeoutMs ?? 15_000),
      });
      if (!response.ok) throw new GeminiError(`Gemini respondeu ${response.status}`);
      const data = (await response.json()) as { candidates?: { content?: { parts?: { text?: string }[] }; finishReason?: string }[] };
      const candidate = data.candidates?.[0];
      if (!candidate || candidate.finishReason === "SAFETY") throw new GeminiError("Gemini sem resposta utilizável");
      const raw = (candidate.content?.parts ?? []).map((part) => part.text ?? "").join("");
      const parsed = parseGeminiAnswer(raw, items);
      return { text: parsed.text, provider: `gemini:${model}`, usedEntryIds: parsed.entryIds, sources: parsed.sources };
    },
  };
}

/** One limiter for the whole process, so the ceiling holds across all bots. */
let sharedLimiter: CallLimiter | null = null;

export function geminiFromEnv(env: Record<string, string | undefined>, fetchImpl?: FetchLike): AnswerProvider {
  sharedLimiter ??= new CallLimiter({
    perMinute: limitFromEnv(env.GEMINI_MAX_PER_MINUTE, 10, 10),
    perDay: limitFromEnv(env.GEMINI_MAX_PER_DAY, 200, 200),
  });
  return createGeminiProvider({ apiKey: env.GEMINI_API_KEY?.trim() || null, model: env.GEMINI_MODEL?.trim(), limiter: sharedLimiter, fetch: fetchImpl });
}

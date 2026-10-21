// Test-only AI answers with a model running on the owner's own computer through Ollama (owner,
// 2026-10-21: free local AI for tests; the Gemini free tier is not allowed in the EEA). Free, no
// account, nothing leaves the computer. OFF by default: a bot uses it only when «IA de teste local
// (Ollama, grátis)» is turned on in the admin. It only works where Ollama is reachable (the local
// runner in scripts/chatbot and `npm run dev`); on Vercel it is disabled and the free mock answers.
//
// Grounded (llm/grounding.ts, shared with Groq): the model sees only the bot's own information and
// the retrieved entries/document passages, must answer NO_ANSWER otherwise, and the engine's safety rules run before (emergency,
// codes, medical, hand-off) and after (sanitizeReply). Any error, timeout or busy model → the mock.
import { contextItems, groundedMessages, parseGroundedAnswer, seenText, type ContextItem, type FetchLike } from "./grounding.ts";
import { CallLimiter, limitFromEnv } from "./limiter.ts";
import { buildSystemPrompt, languageNames } from "./prompt.ts";
import { ProviderDisabledError, type AnswerProvider, type AnswerRequest, type AnswerResult } from "./types.ts";

export type { FetchLike } from "./grounding.ts";

export const defaultOllamaUrl = "http://127.0.0.1:11434";
export const defaultOllamaModel = "qwen2.5:7b";
/** A laptop without a graphics card writes ~5–10 words a second: short answers, one minute at most. */
export const defaultOllamaTimeoutMs = 60_000;
export const ollamaOptions = { temperature: 0.2, num_predict: 160, num_ctx: 4096 };

export interface OllamaConfig {
  /** null: Ollama is not available here (e.g. on Vercel). */
  url: string | null;
  model?: string;
  limiter: CallLimiter;
  fetch?: FetchLike;
  timeoutMs?: number;
}

/** Ollama runs on the computer of the runner or of `npm run dev`; on Vercel only with an explicit OLLAMA_URL. */
export function ollamaAvailable(env: Record<string, string | undefined>): boolean {
  return !env.VERCEL || Boolean(env.OLLAMA_URL?.trim());
}

/** The request body for POST /api/chat (exported for the tests). */
export function ollamaRequestBody(request: AnswerRequest, items: readonly ContextItem[], model: string) {
  const system = buildSystemPrompt(request.knowledge, request.settings, request.language);
  return {
    model,
    stream: false,
    keep_alive: "30m",
    options: ollamaOptions,
    messages: groundedMessages(request, items, system, languageNames[request.language]),
  };
}

/** An answer cut by the length limit loses its unfinished last sentence (or is dropped if nothing is left). */
export function completeSentences(text: string): string {
  const match = text.match(/^[\s\S]*[.!?…)](?=\s|$)/);
  return match ? match[0].trim() : "";
}

export class OllamaError extends Error {}

export function createOllamaProvider(config: OllamaConfig): AnswerProvider {
  const model = config.model || defaultOllamaModel;
  const doFetch: FetchLike = config.fetch ?? ((input, init) => fetch(input, init));
  // One answer at a time: the model uses the whole processor, a second one would only wait and time out.
  let busy = false;
  return {
    id: "ollama",
    paid: false,
    async answer(request: AnswerRequest): Promise<AnswerResult> {
      if (!config.url) throw new ProviderDisabledError("ollama (só funciona no computador onde corre o assistente)");
      if (busy) throw new ProviderDisabledError("ollama (ocupada com outra resposta)");
      if (!config.limiter.take()) throw new ProviderDisabledError("ollama (limite de testes atingido)");
      busy = true;
      try {
        const items = contextItems(request);
        const body = ollamaRequestBody(request, items, model);
        let response;
        try {
          response = await doFetch(`${config.url.replace(/\/+$/, "")}/api/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
            signal: AbortSignal.timeout(config.timeoutMs ?? defaultOllamaTimeoutMs),
          });
        } catch (error) {
          const name = error instanceof Error ? error.name : "";
          if (name === "TimeoutError" || name === "AbortError") throw new OllamaError(`sem resposta em ${Math.round((config.timeoutMs ?? defaultOllamaTimeoutMs) / 1000)} s`);
          throw new OllamaError("Ollama não está ligado (ollama serve)");
        }
        const data = (await response.json().catch(() => ({}))) as { error?: string; message?: { content?: string }; done_reason?: string };
        if (!response.ok) throw new OllamaError(`Ollama respondeu ${response.status}${data.error ? `: ${data.error}` : ""}`);
        let raw = data.message?.content ?? "";
        if (data.done_reason === "length") raw = completeSentences(raw);
        if (!raw.trim()) throw new OllamaError("Ollama sem resposta utilizável");
        const parsed = parseGroundedAnswer(raw, items, request.history, seenText(body.messages));
        return { text: parsed.text, provider: `ollama:${model}`, usedEntryIds: parsed.entryIds, sources: parsed.sources };
      } finally {
        busy = false;
      }
    },
  };
}

/** One limiter and one provider per process, so the ceilings and the one-at-a-time rule hold across bots. */
let shared: { key: string; provider: AnswerProvider } | null = null;
let sharedLimiter: CallLimiter | null = null;

export function ollamaFromEnv(env: Record<string, string | undefined>, fetchImpl?: FetchLike): AnswerProvider {
  sharedLimiter ??= new CallLimiter({
    perMinute: limitFromEnv(env.CHATBOT_OLLAMA_MAX_PER_MINUTE, 10, 30),
    perDay: limitFromEnv(env.CHATBOT_OLLAMA_MAX_PER_DAY, 500, 2000),
  });
  const url = ollamaAvailable(env) ? env.OLLAMA_URL?.trim() || defaultOllamaUrl : null;
  const model = env.CHATBOT_OLLAMA_MODEL?.trim() || defaultOllamaModel;
  const timeoutMs = limitFromEnv(env.CHATBOT_OLLAMA_TIMEOUT_MS, defaultOllamaTimeoutMs, 120_000);
  const key = `${url}|${model}|${timeoutMs}`;
  if (fetchImpl) return createOllamaProvider({ url, model, timeoutMs, limiter: sharedLimiter, fetch: fetchImpl });
  if (shared?.key !== key) shared = { key, provider: createOllamaProvider({ url, model, timeoutMs, limiter: sharedLimiter }) };
  return shared.provider;
}

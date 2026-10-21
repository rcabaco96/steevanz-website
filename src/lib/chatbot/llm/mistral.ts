// The AI for CLIENTS (owner, 2026-10-21): Mistral AI, a French company with the data in the EU. A bot
// uses it only when «IA para clientes (Mistral, UE)» is chosen in the admin (answer_provider 'real')
// AND the owner authorised paid answers for that bot (paid_answers_allowed, an admin-only switch);
// otherwise the free answers reply. The conversation's texts and the excerpts are sent to Mistral to
// write the answer.
//
// Today the account is on Mistral's free «Experiment» plan (no card): Mistral may use those requests
// to improve its models, so only test data. With the first client the owner moves to the paid «Scale»
// plan with a spending limit set in Mistral's console. Either way: ceilings by default inside the free
// plan (about 1 request per second: ≤ 30/min, ≤ 500/day, per bot and tokens per day, all lowerable or
// raisable by environment), one answer in flight per conversation, ≥ 1,1 s between requests, a 15 s
// timeout, no retries. HTTP 429, any error, a timeout or a missing key → the free answers reply and
// «Experimentar» shows why; a 429 also pauses Mistral for the time it asks (retry-after); a billing
// answer or a refused key (401) turns it off for the rest of the process. Grounded with the same rules
// as the test AIs (llm/grounding.ts); the engine's safety rules run before (emergency, codes, medical,
// hand-off) and after (sanitizeReply).
import { contextItems, groundedMessages, parseGroundedAnswer, seenText, type ContextItem, type FetchLike } from "./grounding.ts";
import { isBillingError } from "./groq.ts";
import { CallLimiter, limitFromEnv, TokenBudget, type CallLimits } from "./limiter.ts";
import { completeSentences } from "./ollama.ts";
import { buildSystemPrompt, languageNames } from "./prompt.ts";
import { ProviderDisabledError, type AnswerProvider, type AnswerRequest, type AnswerResult } from "./types.ts";

export const mistralUrl = "https://api.mistral.ai/v1/chat/completions";
/** Mistral Small (GET /v1/models, 2026-10-21: mistral-small-latest = mistral-small-2603); CHATBOT_MISTRAL_MODEL changes it. */
export const defaultMistralModel = "mistral-small-latest";
export const defaultMistralTimeoutMs = 15_000;
export const mistralOptions = { temperature: 0.2, max_tokens: 300 };
/**
 * Our ceilings. Mistral's free «Experiment» plan allows about 1 request per second (and plenty of tokens);
 * these keep well inside it and also cap the bill on the paid plan. Each can be changed by environment
 * up to `max`.
 */
export const mistralDefaults = {
  perMinute: { env: "CHATBOT_MISTRAL_MAX_PER_MINUTE", value: 30, max: 600 },
  perDay: { env: "CHATBOT_MISTRAL_MAX_PER_DAY", value: 500, max: 50_000 },
  botPerMinute: { env: "CHATBOT_MISTRAL_BOT_MAX_PER_MINUTE", value: 15, max: 600 },
  botPerDay: { env: "CHATBOT_MISTRAL_BOT_MAX_PER_DAY", value: 300, max: 50_000 },
  tokensPerMinute: { env: "CHATBOT_MISTRAL_MAX_TOKENS_PER_MINUTE", value: 100_000, max: 1_000_000 },
  tokensPerDay: { env: "CHATBOT_MISTRAL_MAX_TOKENS_PER_DAY", value: 1_000_000, max: 100_000_000 },
  /** At least this long between two requests (the free plan's ≈ 1 request/second). */
  minIntervalMs: { env: "CHATBOT_MISTRAL_MIN_INTERVAL_MS", value: 1_100, max: 10_000 },
} as const;
/** A request waits at most this long for its turn; longer → the free answers reply (never a queue). */
const maxWaitMs = 3_000;
/** A 429 without retry-after pauses Mistral this long; never longer than an hour. */
const defaultCooldownMs = 60_000;
const maxCooldownMs = 60 * 60_000;

export interface MistralConfig {
  apiKey: string | null;
  model?: string;
  limiter: CallLimiter;
  tokens: TokenBudget;
  botLimits: CallLimits;
  minIntervalMs?: number;
  fetch?: FetchLike;
  timeoutMs?: number;
  clock?: () => number;
  sleep?: (ms: number) => Promise<void>;
}

export function mistralKeyPresent(env: Record<string, string | undefined>): boolean {
  return Boolean(env.MISTRAL_API_KEY?.trim());
}

/**
 * Mistral Small 4 thinks only when asked: «none» = a plain answer with no thinking (cheaper, faster).
 * Other models don't take the parameter.
 */
export function takesReasoningEffort(model: string): boolean {
  return /^(?:mistral-small|magistral)/.test(model);
}

/** The request body for POST /v1/chat/completions (exported for the tests). */
export function mistralRequestBody(request: AnswerRequest, items: readonly ContextItem[], model: string) {
  const system = buildSystemPrompt(request.knowledge, request.settings, request.language);
  const messages = groundedMessages(request, items, system, languageNames[request.language]);
  return {
    model,
    stream: false,
    temperature: mistralOptions.temperature,
    max_tokens: mistralOptions.max_tokens,
    ...(takesReasoningEffort(model) ? { reasoning_effort: "none" } : {}),
    messages,
  };
}

/** About how many tokens a request costs (≈ 3,5 characters per token, plus the longest answer). */
export function estimateMistralTokens(body: ReturnType<typeof mistralRequestBody>): number {
  return Math.ceil(JSON.stringify(body.messages).length / 3.5) + body.max_tokens;
}

type ContentChunk = { type?: string; text?: string };
interface MistralResponse {
  choices?: { message?: { content?: string | ContentChunk[] | null }; finish_reason?: string }[];
  usage?: { total_tokens?: number };
  message?: string;
  detail?: unknown;
  type?: string;
  code?: string | number;
  error?: { message?: string; code?: string; type?: string };
}

/** The answer text: a plain string, or the «text» chunks of a chunk list (thinking chunks are left out). */
export function mistralContent(content: string | ContentChunk[] | null | undefined): string {
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return "";
  return content
    .filter((chunk) => chunk?.type === "text" && typeof chunk.text === "string")
    .map((chunk) => chunk.text)
    .join("");
}

function errorText(data: MistralResponse): string {
  const detail = typeof data.detail === "string" ? data.detail : Array.isArray(data.detail) ? JSON.stringify(data.detail) : "";
  return (data.error?.message ?? data.message ?? detail ?? "").slice(0, 160);
}

export class MistralError extends Error {}

export function createMistralProvider(config: MistralConfig): AnswerProvider {
  const model = config.model || defaultMistralModel;
  const doFetch: FetchLike = config.fetch ?? ((input, init) => fetch(input, init));
  const clock = config.clock ?? Date.now;
  const sleep = config.sleep ?? ((ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms)));
  const timeoutMs = config.timeoutMs ?? defaultMistralTimeoutMs;
  const minIntervalMs = config.minIntervalMs ?? mistralDefaults.minIntervalMs.value;
  const inFlight = new Set<string>();
  const botLimiters = new Map<string, CallLimiter>();
  let nextSlot = 0;
  let pausedUntil = 0;
  let disabled: string | null = null;
  return {
    id: "mistral",
    // Paid per token on the «Scale» plan (free on «Experiment»): only with the owner's switch.
    paid: true,
    async answer(request: AnswerRequest): Promise<AnswerResult> {
      if (!config.apiKey) throw new ProviderDisabledError("mistral (falta a chave MISTRAL_API_KEY neste servidor)");
      if (disabled) throw new ProviderDisabledError(`mistral (${disabled})`);
      const now = clock();
      if (now < pausedUntil) throw new ProviderDisabledError(`mistral (limite da Mistral atingido; volta a tentar daqui a ${Math.ceil((pausedUntil - now) / 1000)} s)`);
      const key = request.conversationKey ?? `${request.botId ?? "bot"}:sem-conversa`;
      if (inFlight.has(key)) throw new ProviderDisabledError("mistral (ainda a responder à mensagem anterior desta conversa)");
      const botId = request.botId ?? "bot";
      let botLimiter = botLimiters.get(botId);
      if (!botLimiter) botLimiters.set(botId, (botLimiter = new CallLimiter(config.botLimits, clock)));
      const items = contextItems(request);
      const body = mistralRequestBody(request, items, model);
      const estimate = estimateMistralTokens(body);
      if (!config.limiter.canTake() || !botLimiter.canTake()) throw new ProviderDisabledError("mistral (limite de pedidos atingido)");
      if (!config.tokens.allows(estimate)) throw new ProviderDisabledError("mistral (limite de tokens atingido)");
      // ≈ 1 request per second: wait for the next free slot (short), never queue.
      const slot = Math.max(now, nextSlot);
      const wait = slot - now;
      if (wait > maxWaitMs) throw new ProviderDisabledError("mistral (demasiados pedidos ao mesmo tempo)");
      nextSlot = slot + minIntervalMs;
      config.limiter.take();
      botLimiter.take();
      inFlight.add(key);
      try {
        if (wait > 0) await sleep(wait);
        let response;
        try {
          response = await doFetch(mistralUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json", Authorization: `Bearer ${config.apiKey}` },
            body: JSON.stringify(body),
            signal: AbortSignal.timeout(timeoutMs),
          });
        } catch (error) {
          const name = error instanceof Error ? error.name : "";
          if (name === "TimeoutError" || name === "AbortError") {
            // It may still have been counted by Mistral.
            config.tokens.record(estimate);
            throw new MistralError(`sem resposta em ${Math.round(timeoutMs / 1000)} s`);
          }
          throw new MistralError("não consegui ligar à Mistral");
        }
        const data = (await response.json().catch(() => ({}))) as MistralResponse;
        if (!response.ok) {
          const message = errorText(data);
          if (response.status === 429) {
            const after = Number(response.headers?.get("retry-after"));
            pausedUntil = clock() + (Number.isFinite(after) && after > 0 ? Math.min(after * 1000, maxCooldownMs) : defaultCooldownMs);
            throw new MistralError("limite da Mistral atingido (429)");
          }
          if (isBillingError(response.status, `${message} ${data.error?.code ?? data.code ?? ""} ${data.error?.type ?? data.type ?? ""}`)) {
            disabled = "a Mistral pediu pagamento ou um plano: desligada até reiniciar";
            throw new ProviderDisabledError(`mistral (${disabled})`);
          }
          if (response.status === 401) {
            disabled = "chave MISTRAL_API_KEY recusada (401)";
            throw new ProviderDisabledError(`mistral (${disabled})`);
          }
          throw new MistralError(`Mistral respondeu ${response.status}${message ? `: ${message}` : ""}`);
        }
        config.tokens.record(data.usage?.total_tokens ?? estimate);
        const choice = data.choices?.[0];
        let raw = mistralContent(choice?.message?.content);
        if (choice?.finish_reason === "length") raw = completeSentences(raw);
        if (!raw.trim()) throw new MistralError("Mistral sem resposta utilizável");
        const parsed = parseGroundedAnswer(raw, items, request.history, seenText(body.messages));
        return { text: parsed.text, provider: `mistral:${model}`, usedEntryIds: parsed.entryIds, sources: parsed.sources };
      } finally {
        inFlight.delete(key);
      }
    },
  };
}

/** One set of ceilings and one provider per process, so the limits hold across bots and conversations. */
let shared: { key: string; provider: AnswerProvider } | null = null;
let sharedLimiter: CallLimiter | null = null;
let sharedTokens: TokenBudget | null = null;

const fromEnv = (env: Record<string, string | undefined>, name: keyof typeof mistralDefaults) =>
  limitFromEnv(env[mistralDefaults[name].env], mistralDefaults[name].value, mistralDefaults[name].max);

export function mistralFromEnv(env: Record<string, string | undefined>, fetchImpl?: FetchLike): AnswerProvider {
  sharedLimiter ??= new CallLimiter({ perMinute: fromEnv(env, "perMinute"), perDay: fromEnv(env, "perDay") });
  sharedTokens ??= new TokenBudget({ perMinute: fromEnv(env, "tokensPerMinute"), perDay: fromEnv(env, "tokensPerDay") });
  const config: MistralConfig = {
    apiKey: env.MISTRAL_API_KEY?.trim() || null,
    model: env.CHATBOT_MISTRAL_MODEL?.trim() || defaultMistralModel,
    timeoutMs: limitFromEnv(env.CHATBOT_MISTRAL_TIMEOUT_MS, defaultMistralTimeoutMs, 30_000),
    minIntervalMs: fromEnv(env, "minIntervalMs"),
    limiter: sharedLimiter,
    tokens: sharedTokens,
    botLimits: { perMinute: fromEnv(env, "botPerMinute"), perDay: fromEnv(env, "botPerDay") },
  };
  if (fetchImpl) return createMistralProvider({ ...config, fetch: fetchImpl });
  // The key itself is not kept in the cache key, only whether there is one.
  const key = `${config.apiKey ? config.apiKey.length : 0}|${config.model}|${config.timeoutMs}|${config.minIntervalMs}|${config.botLimits.perMinute}|${config.botLimits.perDay}`;
  if (shared?.key !== key) shared = { key, provider: createMistralProvider(config) };
  return shared.provider;
}

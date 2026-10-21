// Test-only AI answers with Groq's FREE tier (owner, 2026-10-21): unlike the local Ollama, it works
// on the site too (admin «Experimentar» runs on Vercel). OFF by default: a bot uses it only when «IA
// de teste (Groq, grátis)» is chosen in the admin, and only while CHATBOT_GROQ_ENABLED=1 (the admin
// offers it only then; unsetting it is also a kill switch). The conversation's texts and the excerpts
// are sent to Groq, Inc. (USA) to write the answer.
//
// Never a paid plan and never spending: ceilings well inside the free limits (per process, per bot,
// tokens per minute and per day), one answer in flight per conversation, a 15 s timeout, no retries.
// HTTP 429, any error, a timeout or a missing key → the free answers reply and «Experimentar» shows
// why; a 429 also pauses Groq for the time it asks (retry-after); a billing/upgrade answer turns Groq
// off for the rest of the process. Grounded with the same rules as Ollama (llm/grounding.ts); the
// engine's safety rules run before (emergency, codes, medical, hand-off) and after (sanitizeReply).
import { contextItems, groundedMessages, parseGroundedAnswer, type ContextItem, type FetchLike } from "./grounding.ts";
import { CallLimiter, limitFromEnv, TokenBudget, type CallLimits } from "./limiter.ts";
import { completeSentences } from "./ollama.ts";
import { buildSystemPrompt, languageNames } from "./prompt.ts";
import { ProviderDisabledError, type AnswerProvider, type AnswerRequest, type AnswerResult } from "./types.ts";

export const groqUrl = "https://api.groq.com/openai/v1/chat/completions";
/** A production model on Groq's free tier (console.groq.com/docs/models); CHATBOT_GROQ_MODEL changes it. */
export const defaultGroqModel = "llama-3.3-70b-versatile";
export const defaultGroqTimeoutMs = 15_000;
export const groqOptions = { temperature: 0.2, max_tokens: 220 };
/**
 * Our ceilings, well below the free tier of llama-3.3-70b-versatile (about 30 requests/min,
 * 1 000/day, 12 000 tokens/min and 100 000 tokens/day per Groq organisation — see
 * console.groq.com/settings/limits). Each can be lowered (or raised up to `max`) by environment.
 */
export const groqDefaults = {
  perMinute: { env: "CHATBOT_GROQ_MAX_PER_MINUTE", value: 20, max: 30 },
  perDay: { env: "CHATBOT_GROQ_MAX_PER_DAY", value: 300, max: 1000 },
  botPerMinute: { env: "CHATBOT_GROQ_BOT_MAX_PER_MINUTE", value: 10, max: 30 },
  botPerDay: { env: "CHATBOT_GROQ_BOT_MAX_PER_DAY", value: 150, max: 1000 },
  tokensPerMinute: { env: "CHATBOT_GROQ_MAX_TOKENS_PER_MINUTE", value: 9_000, max: 30_000 },
  tokensPerDay: { env: "CHATBOT_GROQ_MAX_TOKENS_PER_DAY", value: 80_000, max: 500_000 },
} as const;
/** A 429 without retry-after pauses Groq this long; never longer than an hour. */
const defaultCooldownMs = 60_000;
const maxCooldownMs = 60 * 60_000;

export interface GroqConfig {
  /** CHATBOT_GROQ_ENABLED=1 (set after the migration that allows 'groq' was applied). */
  enabled: boolean;
  apiKey: string | null;
  model?: string;
  limiter: CallLimiter;
  tokens: TokenBudget;
  botLimits: CallLimits;
  fetch?: FetchLike;
  timeoutMs?: number;
  clock?: () => number;
}

export function groqEnabled(env: Record<string, string | undefined>): boolean {
  return env.CHATBOT_GROQ_ENABLED?.trim() === "1";
}

export function groqKeyPresent(env: Record<string, string | undefined>): boolean {
  return Boolean(env.GROQ_API_KEY?.trim());
}

/** The request body for POST /openai/v1/chat/completions (exported for the tests). */
export function groqRequestBody(request: AnswerRequest, items: readonly ContextItem[], model: string) {
  const system = buildSystemPrompt(request.knowledge, request.settings, request.language);
  return {
    model,
    stream: false,
    temperature: groqOptions.temperature,
    max_tokens: groqOptions.max_tokens,
    messages: groundedMessages(request, items, system, languageNames[request.language]),
  };
}

/** About how many tokens a request costs (≈ 3,5 characters per token, plus the longest answer). */
export function estimateTokens(body: ReturnType<typeof groqRequestBody>): number {
  return Math.ceil(JSON.stringify(body.messages).length / 3.5) + body.max_tokens;
}

/** An answer about paying (billing, upgrade, paid plan) that is not a plain rate limit. */
export function isBillingError(status: number, message: string): boolean {
  if (status === 402) return true;
  if (status === 429) return false;
  return /billing|payment|upgrade|paid plan|credit card|insufficient.?(?:quota|funds|balance)/i.test(message);
}

export class GroqError extends Error {}

interface GroqResponse {
  choices?: { message?: { content?: string }; finish_reason?: string }[];
  usage?: { total_tokens?: number };
  error?: { message?: string; code?: string; type?: string };
}

export function createGroqProvider(config: GroqConfig): AnswerProvider {
  const model = config.model || defaultGroqModel;
  const doFetch: FetchLike = config.fetch ?? ((input, init) => fetch(input, init));
  const clock = config.clock ?? Date.now;
  const timeoutMs = config.timeoutMs ?? defaultGroqTimeoutMs;
  const inFlight = new Set<string>();
  const botLimiters = new Map<string, CallLimiter>();
  let pausedUntil = 0;
  let disabled: string | null = null;
  return {
    id: "groq",
    // Free tier only: never a paid plan (a billing answer turns it off).
    paid: false,
    async answer(request: AnswerRequest): Promise<AnswerResult> {
      if (!config.enabled) throw new ProviderDisabledError("groq (desligada neste servidor: falta CHATBOT_GROQ_ENABLED=1)");
      if (!config.apiKey) throw new ProviderDisabledError("groq (falta a chave GROQ_API_KEY neste servidor)");
      if (disabled) throw new ProviderDisabledError(`groq (${disabled})`);
      const now = clock();
      if (now < pausedUntil) throw new ProviderDisabledError(`groq (limite gratuito da Groq atingido; volta a tentar daqui a ${Math.ceil((pausedUntil - now) / 1000)} s)`);
      const key = request.conversationKey ?? `${request.botId ?? "bot"}:sem-conversa`;
      if (inFlight.has(key)) throw new ProviderDisabledError("groq (ainda a responder à mensagem anterior desta conversa)");
      const botId = request.botId ?? "bot";
      let botLimiter = botLimiters.get(botId);
      if (!botLimiter) botLimiters.set(botId, (botLimiter = new CallLimiter(config.botLimits, clock)));
      const items = contextItems(request);
      const body = groqRequestBody(request, items, model);
      const estimate = estimateTokens(body);
      if (!config.limiter.canTake() || !botLimiter.canTake()) throw new ProviderDisabledError("groq (limite de testes atingido)");
      if (!config.tokens.allows(estimate)) throw new ProviderDisabledError("groq (limite de tokens de teste atingido)");
      config.limiter.take();
      botLimiter.take();
      inFlight.add(key);
      try {
        let response;
        try {
          response = await doFetch(groqUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${config.apiKey}` },
            body: JSON.stringify(body),
            signal: AbortSignal.timeout(timeoutMs),
          });
        } catch (error) {
          const name = error instanceof Error ? error.name : "";
          if (name === "TimeoutError" || name === "AbortError") {
            // It may still have been counted by Groq.
            config.tokens.record(estimate);
            throw new GroqError(`sem resposta em ${Math.round(timeoutMs / 1000)} s`);
          }
          throw new GroqError("não consegui ligar à Groq");
        }
        const data = (await response.json().catch(() => ({}))) as GroqResponse;
        if (!response.ok) {
          const message = (data.error?.message ?? "").slice(0, 160);
          if (response.status === 429) {
            const after = Number(response.headers?.get("retry-after"));
            pausedUntil = clock() + (Number.isFinite(after) && after > 0 ? Math.min(after * 1000, maxCooldownMs) : defaultCooldownMs);
            throw new GroqError("limite gratuito da Groq atingido (429)");
          }
          if (isBillingError(response.status, `${message} ${data.error?.code ?? ""} ${data.error?.type ?? ""}`)) {
            disabled = "a Groq pediu um plano pago: desligada (só usamos o plano grátis)";
            throw new ProviderDisabledError(`groq (${disabled})`);
          }
          if (response.status === 401) {
            disabled = "chave GROQ_API_KEY recusada (401)";
            throw new ProviderDisabledError(`groq (${disabled})`);
          }
          throw new GroqError(`Groq respondeu ${response.status}${message ? `: ${message}` : ""}`);
        }
        config.tokens.record(data.usage?.total_tokens ?? estimate);
        const choice = data.choices?.[0];
        let raw = choice?.message?.content ?? "";
        if (choice?.finish_reason === "length") raw = completeSentences(raw);
        if (!raw.trim()) throw new GroqError("Groq sem resposta utilizável");
        const parsed = parseGroundedAnswer(raw, items);
        return { text: parsed.text, provider: `groq:${model}`, usedEntryIds: parsed.entryIds, sources: parsed.sources };
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

const fromEnv = (env: Record<string, string | undefined>, name: keyof typeof groqDefaults) =>
  limitFromEnv(env[groqDefaults[name].env], groqDefaults[name].value, groqDefaults[name].max);

export function groqFromEnv(env: Record<string, string | undefined>, fetchImpl?: FetchLike): AnswerProvider {
  sharedLimiter ??= new CallLimiter({ perMinute: fromEnv(env, "perMinute"), perDay: fromEnv(env, "perDay") });
  sharedTokens ??= new TokenBudget({ perMinute: fromEnv(env, "tokensPerMinute"), perDay: fromEnv(env, "tokensPerDay") });
  const config: GroqConfig = {
    enabled: groqEnabled(env),
    apiKey: env.GROQ_API_KEY?.trim() || null,
    model: env.CHATBOT_GROQ_MODEL?.trim() || defaultGroqModel,
    timeoutMs: limitFromEnv(env.CHATBOT_GROQ_TIMEOUT_MS, defaultGroqTimeoutMs, 30_000),
    limiter: sharedLimiter,
    tokens: sharedTokens,
    botLimits: { perMinute: fromEnv(env, "botPerMinute"), perDay: fromEnv(env, "botPerDay") },
  };
  if (fetchImpl) return createGroqProvider({ ...config, fetch: fetchImpl });
  // The key itself is not kept in the cache key, only whether there is one.
  const key = `${config.enabled}|${config.apiKey ? config.apiKey.length : 0}|${config.model}|${config.timeoutMs}|${config.botLimits.perMinute}|${config.botLimits.perDay}`;
  if (shared?.key !== key) shared = { key, provider: createGroqProvider(config) };
  return shared.provider;
}

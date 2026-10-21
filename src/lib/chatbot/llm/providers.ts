// Which answer writer a bot uses:
// - "mock" (default): free answers put together from the business's own information.
// - "ollama": test-only AI with a free model on the owner's own computer (llm/ollama.ts), turned on
//   per bot in the admin; only where Ollama runs (local runner, npm run dev), never on Vercel; capped,
//   one answer at a time, and falls back to the mock on any problem.
// - "groq": test-only AI on Groq's FREE tier (llm/groq.ts), turned on per bot in the admin; works on
//   the site too, only while CHATBOT_GROQ_ENABLED=1 and GROQ_API_KEY are set; capped well inside the
//   free limits, never a paid plan, and falls back to the mock on any limit, error or timeout.
// - "real": the AI for clients, Mistral (EU; llm/mistral.ts), only when the owner also authorised paid
//   answers for that bot (paid_answers_allowed, an admin-only switch). Without that authorisation it
//   never calls anything: the free answers reply and «Experimentar» says why.
import { groqFromEnv } from "./groq.ts";
import { mistralFromEnv } from "./mistral.ts";
import { ollamaFromEnv, type FetchLike } from "./ollama.ts";
import { mockProvider } from "./mock.ts";
import { ProviderDisabledError, type AnswerProvider } from "./types.ts";

export type ProviderChoice = "mock" | "ollama" | "groq" | "real";

/** 'real' without the owner's authorisation: calling it throws (no key read, no request), the engine uses the mock. */
export const paidNotAllowedProvider: AnswerProvider = {
  id: "mistral-not-allowed",
  paid: true,
  answer: async () => {
    throw new ProviderDisabledError("mistral (falta o dono autorizar a IA paga deste assistente em Definições)");
  },
};

export interface ProviderConfig {
  choice: ProviderChoice | string;
  /** The owner's switch for paid answers (paid_answers_allowed). False until he turns it on. */
  paidAllowed: boolean;
  /** Environment with OLLAMA_URL, CHATBOT_OLLAMA_MODEL, GROQ_API_KEY, CHATBOT_GROQ_*, MISTRAL_API_KEY, CHATBOT_MISTRAL_*, the caps and VERCEL (process.env in production). */
  env?: Record<string, string | undefined>;
  fetch?: FetchLike;
}

export function chooseProvider(config: ProviderConfig): AnswerProvider {
  if (config.choice === "ollama") return ollamaFromEnv(config.env ?? {}, config.fetch);
  if (config.choice === "groq") return groqFromEnv(config.env ?? {}, config.fetch);
  if (config.choice === "real") return config.paidAllowed ? mistralFromEnv(config.env ?? {}, config.fetch) : paidNotAllowedProvider;
  return mockProvider;
}

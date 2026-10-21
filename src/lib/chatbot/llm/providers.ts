// Which answer writer a bot uses:
// - "mock" (default): free answers put together from the business's own information.
// - "ollama": test-only AI with a free model on the owner's own computer (llm/ollama.ts), turned on
//   per bot in the admin; only where Ollama runs (local runner, npm run dev), never on Vercel; capped,
//   one answer at a time, and falls back to the mock on any problem.
// - "groq": test-only AI on Groq's FREE tier (llm/groq.ts), turned on per bot in the admin; works on
//   the site too, only while CHATBOT_GROQ_ENABLED=1 and GROQ_API_KEY are set; capped well inside the
//   free limits, never a paid plan, and falls back to the mock on any limit, error or timeout.
// - "real": the paid provider for clients (Anthropic or another, phase 2): a placeholder that refuses
//   to run (no key read, no request made) until the owner chooses, accepts the price and switches it on.
import { groqFromEnv } from "./groq.ts";
import { ollamaFromEnv, type FetchLike } from "./ollama.ts";
import { mockProvider } from "./mock.ts";
import { ProviderDisabledError, type AnswerProvider } from "./types.ts";

export type ProviderChoice = "mock" | "ollama" | "groq" | "real";

/** The placeholder for a paid model (e.g. Anthropic): calling it throws, the engine uses the mock. */
export const realProviderPlaceholder: AnswerProvider = {
  id: "anthropic-disabled",
  paid: true,
  answer: async () => {
    throw new ProviderDisabledError("anthropic-disabled");
  },
};

export interface ProviderConfig {
  choice: ProviderChoice | string;
  /** The owner's switch for paid answers (a bot setting). False until he turns it on. */
  paidAllowed: boolean;
  /** Environment with OLLAMA_URL, CHATBOT_OLLAMA_MODEL, GROQ_API_KEY, CHATBOT_GROQ_*, the caps and VERCEL (process.env in production). */
  env?: Record<string, string | undefined>;
  fetch?: FetchLike;
}

export function chooseProvider(config: ProviderConfig): AnswerProvider {
  if (config.choice === "ollama") return ollamaFromEnv(config.env ?? {}, config.fetch);
  if (config.choice === "groq") return groqFromEnv(config.env ?? {}, config.fetch);
  if (config.choice === "real" && config.paidAllowed) return realProviderPlaceholder;
  return mockProvider;
}

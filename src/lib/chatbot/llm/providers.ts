// Which answer writer a bot uses:
// - "mock" (default): free answers put together from the business's own information.
// - "gemini": test-only AI with the Google Gemini free tier (llm/gemini.ts), turned on per bot in the
//   admin, needs GEMINI_API_KEY; capped, and falls back to the mock on any problem.
// - "real": the paid provider for clients (Anthropic or another, phase 2): a placeholder that refuses
//   to run (no key read, no request made) until the owner chooses, accepts the price and switches it on.
import { geminiFromEnv, type FetchLike } from "./gemini.ts";
import { mockProvider } from "./mock.ts";
import { ProviderDisabledError, type AnswerProvider } from "./types.ts";

export type ProviderChoice = "mock" | "gemini" | "real";

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
  /** Environment with GEMINI_API_KEY and the caps (process.env in production). */
  env?: Record<string, string | undefined>;
  fetch?: FetchLike;
}

export function chooseProvider(config: ProviderConfig): AnswerProvider {
  if (config.choice === "gemini") return geminiFromEnv(config.env ?? {}, config.fetch);
  if (config.choice === "real" && config.paidAllowed) return realProviderPlaceholder;
  return mockProvider;
}

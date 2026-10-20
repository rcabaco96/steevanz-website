// Which answer writer a bot uses. Today: always the free mock. A real model is a placeholder that
// refuses to run (no API key is read, no request is made): turning it on is phase 2 and needs the
// owner to choose a provider, accept its price and switch it on from the site.
import { mockProvider } from "./mock.ts";
import { ProviderDisabledError, type AnswerProvider } from "./types.ts";

export type ProviderChoice = "mock" | "real";

/**
 * The placeholder for a paid model. It has the interface but no implementation on purpose: calling it
 * throws, the engine logs it and answers with the mock instead.
 */
export const realProviderPlaceholder: AnswerProvider = {
  id: "real-disabled",
  paid: true,
  answer: async () => {
    throw new ProviderDisabledError("real-disabled");
  },
};

export interface ProviderConfig {
  choice: ProviderChoice;
  /** The owner's switch on the site (a bot setting). False until he turns it on. */
  paidAllowed: boolean;
}

export function chooseProvider(config: ProviderConfig): AnswerProvider {
  if (config.choice === "real" && config.paidAllowed) return realProviderPlaceholder;
  return mockProvider;
}

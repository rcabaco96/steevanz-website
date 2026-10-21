// The answer-writing layer behind one interface, so the free mock (today) and a real language model
// (later, only when the owner turns it on from the site and chooses who pays) are interchangeable.
import type { OpeningState } from "../hours.ts";
import type { Intent } from "../intents.ts";
import type { KnowledgeIndex, SearchHit } from "../knowledge.ts";
import type { BotSettings, BusinessKnowledge, ChatbotLanguage, ChatMessage } from "../types.ts";

export interface AnswerRequest {
  language: ChatbotLanguage;
  /** What to search with: the customer's message, plus the conversation's topic for a follow-up (context.ts). */
  message: string;
  /** The customer's message exactly as written (an AI answers this; `message` may carry words of the previous question). */
  customerMessage?: string;
  /** The previous customer question this message continues («Dá para cortar o cabelo amanhã?» before «Quanto custa?»). */
  followUpOf?: string | null;
  /** «Quero a segunda opção» right after a list the assistant sent: the option picked. */
  picked?: string | null;
  intents: readonly Intent[];
  /** The business's own answers that match the message, best first (already filtered by property). */
  hits: readonly SearchHit[];
  /** The best sections of the business's documents (searchChunks), best first. */
  chunkHits?: readonly SearchHit[];
  /** A follow-up: the document windows around the conversation's topic (context.ts windowQuery), tried first. */
  topicChunkHits?: readonly SearchHit[];
  /** The bot's search index (documents' passages for the free answers); built from `knowledge` when missing. */
  index?: KnowledgeIndex;
  knowledge: BusinessKnowledge;
  settings: BotSettings;
  opening: OpeningState;
  history: readonly ChatMessage[];
  property: string | null;
  now: Date;
  /** The bot answering (per-bot ceilings of an outside AI). */
  botId?: string;
  /** One conversation (one answer in flight per conversation with an outside AI). */
  conversationKey?: string;
}

export interface AnswerResult {
  /** null: nothing in the business's information answers it (the engine says «I don't know»). */
  text: string | null;
  provider: string;
  /** Knowledge entries the answer came from (for the conversation log). */
  usedEntryIds: string[];
  /** Document sections the answer quotes (shown in the admin's «Experimentar», never to customers). */
  sources?: AnswerSource[];
}

export interface AnswerSource {
  documentId: string;
  documentTitle: string;
  heading: string;
  chunkId: string;
  /** A clean section name for the admin («4. Serviços e preços», «Cabelo»); null when the document has none. */
  section?: string | null;
}

export interface AnswerProvider {
  readonly id: string;
  /** Costs money per call. The engine never calls a paid provider unless the owner enabled it. */
  readonly paid: boolean;
  answer(request: AnswerRequest): Promise<AnswerResult>;
}

/** A paid provider that is not switched on (or not built yet): the engine falls back to the mock. */
export class ProviderDisabledError extends Error {
  constructor(provider: string) {
    super(`answer provider ${provider} is disabled`);
    this.name = "ProviderDisabledError";
  }
}

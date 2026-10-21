// Where conversations and messages are kept, behind one interface: Supabase in production
// (supabase-store.ts, once the migration is approved and applied) or memory for the tests and the
// offline simulator. Pure module.
import type { Handoff } from "./engine.ts";
import type { Intent } from "./intents.ts";
import { newConversationState, type ChatbotLanguage, type ChatMessage, type ConversationState, type MessageAuthor } from "./types.ts";

export interface LoadedConversation {
  id: string;
  state: ConversationState;
  /** The latest messages, oldest first (enough for the engine and the summary). */
  history: ChatMessage[];
}

export interface NewMessage {
  author: MessageAuthor;
  body: string;
  at: number;
  externalId?: string | null;
  intents?: readonly Intent[];
  provider?: string | null;
  language?: ChatbotLanguage | null;
}

export interface SaveExtra {
  /** A new hand-off: kept with the conversation and shown in the team's inbox. */
  handoff?: Handoff | null;
  /** Put the chat in (true) or take it out of (false) the team's inbox. */
  needsAttention?: boolean;
}

export interface ChatbotStore {
  /** The conversation of this chat, created when it is the first message. */
  openConversation(botId: string, chatId: string, contactName: string | null): Promise<LoadedConversation>;
  saveConversation(conversationId: string, state: ConversationState, extra?: SaveExtra): Promise<void>;
  appendMessage(conversationId: string, message: NewMessage): Promise<void>;
  /** Whether this channel message id was already stored (duplicates after a reconnection). */
  hasMessage(botId: string, externalId: string): Promise<boolean>;
}

export interface MemoryConversation {
  id: string;
  botId: string;
  chatId: string;
  contactName: string | null;
  state: ConversationState;
  handoff: Handoff | null;
  needsAttention: boolean;
  messages: (NewMessage & { conversationId: string })[];
}

export class MemoryStore implements ChatbotStore {
  readonly conversations = new Map<string, MemoryConversation>();
  private readonly seen = new Set<string>();
  private readonly historyLimit: number;

  constructor(historyLimit = 20) {
    this.historyLimit = historyLimit;
  }

  async openConversation(botId: string, chatId: string, contactName: string | null): Promise<LoadedConversation> {
    const key = `${botId}:${chatId}`;
    let conversation = this.conversations.get(key);
    if (!conversation) {
      conversation = { id: key, botId, chatId, contactName, state: newConversationState(), handoff: null, needsAttention: false, messages: [] };
      this.conversations.set(key, conversation);
    }
    return {
      id: conversation.id,
      state: conversation.state,
      history: conversation.messages.slice(-this.historyLimit).map(({ author, body, at }) => ({ author, body, at })),
    };
  }

  async saveConversation(conversationId: string, state: ConversationState, extra: SaveExtra = {}): Promise<void> {
    const conversation = this.conversations.get(conversationId);
    if (!conversation) throw new Error(`conversation ${conversationId} not found`);
    conversation.state = state;
    if (extra.handoff) {
      conversation.handoff = extra.handoff;
      conversation.needsAttention = true;
    }
    if (extra.needsAttention !== undefined) conversation.needsAttention = extra.needsAttention;
  }

  async appendMessage(conversationId: string, message: NewMessage): Promise<void> {
    const conversation = this.conversations.get(conversationId);
    if (!conversation) throw new Error(`conversation ${conversationId} not found`);
    conversation.messages.push({ ...message, conversationId });
    if (message.externalId) this.seen.add(`${conversation.botId}:${message.externalId}`);
  }

  async hasMessage(botId: string, externalId: string): Promise<boolean> {
    return this.seen.has(`${botId}:${externalId}`);
  }
}

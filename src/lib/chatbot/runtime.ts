// One bot running on one WhatsApp number: takes each incoming message from the adapter, keeps the
// conversation in the store, asks the engine, and sends the replies at a human pace. Messages of the
// same chat are handled one at a time, in order. The owner writing from the phone takes the chat over.
// Pure module (clock, sleep and randomness are injected; tests/chatbot-runtime.test.mjs).
import type { ChannelAdapter, InboundMessage } from "./adapters.ts";
import { respond, type EngineResult, type Handoff } from "./engine.ts";
import { buildIndex, type KnowledgeIndex } from "./knowledge.ts";
import { mockProvider } from "./llm/mock.ts";
import type { AnswerProvider } from "./llm/types.ts";
import { defaultPacing, isFresh, Pacer, typingDelay, type PacingConfig } from "./pacing.ts";
import type { ChatbotStore } from "./store.ts";
import type { BotProfile } from "./types.ts";

export interface HandoffEvent {
  botId: string;
  chatId: string;
  contactName: string | null;
  handoff: Handoff;
}

export interface RuntimeDeps {
  bot: BotProfile;
  adapter: ChannelAdapter;
  store: ChatbotStore;
  provider?: AnswerProvider;
  pacing?: PacingConfig;
  clock?: () => number;
  sleep?: (ms: number) => Promise<void>;
  random?: () => number;
  /**
   * Pilot safety: only these phone numbers (digits with country code, e.g. "3519…") are answered or
   * even stored; every other chat is ignored. null = everyone (not for the open-wa pilot).
   */
  allowlist?: readonly string[] | null;
  /** Checked right before each send: false = the kill switch is on (bot switched off), send nothing. */
  canSend?: () => boolean;
  /** Tell the team (a notice in the admin, an email, a WhatsApp to the owner's own number…). */
  onHandoff?: (event: HandoffEvent) => Promise<void> | void;
  log?: (line: string) => void;
}

export type HandleStatus = "replied" | "silent" | "ignored" | "not_allowed" | "duplicate" | "owner" | "stale" | "own_echo" | "paused";

/** "351912345678@c.us" → "351912345678"; ids without a phone number ("…@lid") → null. */
export function phoneOfChat(chatId: string): string | null {
  const [user, server] = chatId.split("@");
  if (server && server !== "c.us" && server !== "s.whatsapp.net") return null;
  const digits = user.replace(/\D/g, "");
  return digits.length >= 8 ? digits : null;
}

export function isAllowed(chatId: string, allowlist: readonly string[] | null | undefined): boolean {
  if (!allowlist) return true;
  const phone = phoneOfChat(chatId);
  return phone !== null && allowlist.some((allowed) => allowed.replace(/\D/g, "") === phone);
}

export interface HandleOutcome {
  status: HandleStatus;
  result?: EngineResult;
}

/** How long a sent message's text is remembered to recognise its echo (open-wa reports our own sends). */
const echoMemoryMs = 2 * 60_000;

export function createRuntime(deps: RuntimeDeps) {
  const clock = deps.clock ?? Date.now;
  const sleep = deps.sleep ?? ((ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms)));
  const pacing = deps.pacing ?? defaultPacing;
  const pacer = new Pacer(pacing);
  const log = deps.log ?? (() => {});
  let bot = deps.bot;
  let provider = deps.provider ?? mockProvider;
  let index: KnowledgeIndex = buildIndex(bot.knowledge);
  const queues = new Map<string, Promise<unknown>>();
  const sentIds = new Set<string>();
  const recentSent = new Map<string, { body: string; at: number }[]>();

  function rememberSent(chatId: string, messageId: string, body: string) {
    sentIds.add(messageId);
    const now = clock();
    const list = (recentSent.get(chatId) ?? []).filter((entry) => now - entry.at < echoMemoryMs);
    list.push({ body, at: now });
    recentSent.set(chatId, list);
  }

  function isOwnEcho(message: InboundMessage): boolean {
    if (sentIds.has(message.messageId)) return true;
    const now = clock();
    return (recentSent.get(message.chatId) ?? []).some((entry) => now - entry.at < echoMemoryMs && entry.body === message.body);
  }

  async function handleNow(message: InboundMessage): Promise<HandleOutcome> {
    if (message.isGroup) return { status: "ignored" };
    // Pilot: anyone outside the owner's list is neither answered nor stored.
    if (!isAllowed(message.chatId, deps.allowlist)) return { status: "not_allowed" };
    if (message.fromOwner && isOwnEcho(message)) return { status: "own_echo" };
    if (await deps.store.hasMessage(bot.id, message.messageId)) return { status: "duplicate" };
    const conversation = await deps.store.openConversation(bot.id, message.chatId, message.contactName ?? null);

    if (message.fromOwner) {
      // The team answered from the phone: the assistant steps back in this chat.
      await deps.store.appendMessage(conversation.id, { author: "owner", body: message.body, at: message.at, externalId: message.messageId });
      const wasBot = conversation.state.mode === "bot";
      await deps.store.saveConversation(conversation.id, {
        ...conversation.state,
        mode: "human",
        handoffReason: wasBot ? "owner_took_over" : conversation.state.handoffReason,
        lastOwnerAt: message.at,
        offeredHandoff: false,
      }, { needsAttention: false });
      return { status: "owner" };
    }

    await deps.store.appendMessage(conversation.id, { author: "customer", body: message.body, at: message.at, externalId: message.messageId });
    const now = clock();
    if (!isFresh(message.at, now, pacing)) {
      // Backlog after a reconnection: no automatic reply hours later; the team sees it in the inbox.
      await deps.store.saveConversation(conversation.id, { ...conversation.state, lastCustomerAt: message.at }, { needsAttention: true });
      return { status: "stale" };
    }

    const result = await respond(
      { bot, conversation: conversation.state, history: conversation.history, message: { body: message.body, at: message.at, kind: message.kind === "text" ? "text" : "media" }, now: new Date(now), index },
      provider,
    );

    let status: HandleStatus = result.replies.length ? "replied" : "silent";
    for (const reply of result.replies) {
      const wait = pacer.waitBeforeSend(message.chatId, clock());
      if (wait === Infinity || (deps.canSend && !deps.canSend())) {
        log(`[chatbot ${bot.id}] ${wait === Infinity ? "hourly/daily limit reached" : "replies switched off"}: not replying`);
        status = "paused";
        break;
      }
      const typing = typingDelay(reply, pacing, deps.random);
      if (wait) await sleep(wait);
      if (deps.adapter.simulateTyping) await deps.adapter.simulateTyping(message.chatId, typing);
      else await sleep(typing);
      // The kill switch may have been turned on while «typing».
      if (deps.canSend && !deps.canSend()) {
        status = "paused";
        break;
      }
      const sent = await deps.adapter.sendText(message.chatId, reply);
      rememberSent(message.chatId, sent.messageId, reply);
      pacer.record(message.chatId, clock());
      await deps.store.appendMessage(conversation.id, {
        author: "bot",
        body: reply,
        at: clock(),
        externalId: sent.messageId,
        intents: result.intents,
        provider: result.provider,
        language: result.language,
      });
    }

    // A customer writing while the team has the chat (or while the daily ceiling holds replies back) waits in the inbox.
    const waiting = result.silent === "human" || status === "paused";
    await deps.store.saveConversation(conversation.id, result.conversation, result.handoff ? { handoff: result.handoff } : waiting ? { needsAttention: true } : {});
    if (result.handoff) {
      log(`[chatbot ${bot.id}] hand-off (${result.handoff.reason}) in ${message.chatId}`);
      await deps.onHandoff?.({ botId: bot.id, chatId: message.chatId, contactName: message.contactName ?? null, handoff: result.handoff });
    }
    return { status, result };
  }

  return {
    /** Handles one message; messages of the same chat wait for the previous one. */
    handle(message: InboundMessage): Promise<HandleOutcome> {
      const previous = queues.get(message.chatId) ?? Promise.resolve();
      const next = previous.then(() => handleNow(message));
      const settled = next.catch(() => {});
      queues.set(message.chatId, settled);
      void settled.then(() => {
        if (queues.get(message.chatId) === settled) queues.delete(message.chatId);
      });
      return next;
    },
    /** New settings or knowledge from the admin (and the answer writer, when it changed). */
    updateBot(next: BotProfile, nextProvider?: AnswerProvider) {
      bot = next;
      index = buildIndex(next.knowledge);
      if (nextProvider) provider = nextProvider;
    },
    get bot() {
      return bot;
    },
  };
}

export type BotRuntime = ReturnType<typeof createRuntime>;

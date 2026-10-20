// The assistant's brain for one incoming message: language, intents, the fixed safety rules
// (emergency, access codes, medical, hand-off), then the business's own answer, then a last check.
// No I/O: the runner gives it the conversation and sends/stores what it returns. Pure module
// (tests/chatbot.test.mjs).
import { handoffSummary, sanitizeReply } from "./guardrails.ts";
import { formatNextOpening, openingState } from "./hours.ts";
import { detectIntents, isSmallTalk, type Intent } from "./intents.ts";
import { buildIndex, findProperty, minimumChunkScore, minimumScore, search, searchChunks, type KnowledgeIndex } from "./knowledge.ts";
import { replyLanguage } from "./language.ts";
import { mockProvider } from "./llm/mock.ts";
import { ProviderDisabledError, type AnswerProvider, type AnswerSource } from "./llm/types.ts";
import { fixedMessages } from "./messages.ts";
import { normalize } from "./text.ts";
import type { BotProfile, ChatbotLanguage, ChatMessage, ConversationState, HandoffReason } from "./types.ts";

/** More than this many bot replies in the loop window and the chat goes to a person (another bot?). */
export const loopGuard = { maxReplies: 8, windowMs: 10 * 60_000 };

export interface EngineInput {
  bot: BotProfile;
  conversation: ConversationState;
  /** The chat so far, oldest first, without the new message. */
  history: readonly ChatMessage[];
  message: { body: string; at: number; kind?: "text" | "media" };
  now: Date;
  /** Built once per bot and reused (buildIndex). Built here when missing. */
  index?: KnowledgeIndex;
}

export interface Handoff {
  reason: HandoffReason;
  /** Emergencies: alert the team at once, by every channel available. */
  urgent: boolean;
  /** For the team, in Portuguese. */
  summary: string;
}

export type SilentReason = "disabled" | "human" | "empty";

export interface EngineResult {
  /** Messages to send, in order (none when silent). */
  replies: string[];
  conversation: ConversationState;
  handoff: Handoff | null;
  intents: Intent[];
  language: ChatbotLanguage;
  /** Who wrote the free answer ("mock", or a real model later); null for fixed messages only. */
  provider: string | null;
  usedEntryIds: string[];
  /** Document sections the answer quotes (for the admin; never sent to the customer). */
  sources: AnswerSource[];
  /** Why an outside AI was not used for this answer (shown in the admin's «Experimentar»). */
  providerNote?: string | null;
  /** Why nothing was sent. */
  silent: SilentReason | null;
  /** Something was removed from the answer by the last check (logged for review). */
  blocked: boolean;
}

/** Hand-off rules by intent, most serious first. */
function handoffFor(found: readonly Intent[], state: ConversationState, kind: BotProfile["knowledge"]["kind"]): HandoffReason | null {
  const has = (intent: Intent) => found.includes(intent);
  if (has("emergency")) return "emergency";
  if (kind === "lodging" && has("access_code")) return "access_code";
  if (kind === "clinic" && has("medical")) return "medical";
  if (has("complaint")) return "complaint";
  if (kind === "lodging") {
    if (has("refund")) return "refund";
    if (has("damage")) return "damage";
    if (has("early_checkin")) return "early_checkin";
    if (has("late_checkout")) return "late_checkout";
  }
  if (has("human")) return "customer_asked";
  if (state.offeredHandoff && has("yes") && found.every((intent) => intent === "yes" || intent === "thanks")) return "customer_asked";
  if (kind !== "lodging" && has("refund")) return "refund";
  return null;
}

export async function respond(input: EngineInput, provider: AnswerProvider = mockProvider): Promise<EngineResult> {
  const { bot, history, message, now } = input;
  const { settings, knowledge } = bot;
  const nowMs = now.getTime();
  let state: ConversationState = { ...input.conversation, recentBotReplies: input.conversation.recentBotReplies.filter((at) => nowMs - at < loopGuard.windowMs) };
  const base = { intents: [] as Intent[], language: state.language ?? settings.defaultLanguage, provider: null, usedEntryIds: [] as string[], sources: [] as AnswerSource[], blocked: false };

  if (!settings.enabled) return { ...base, replies: [], conversation: state, handoff: null, silent: "disabled" };

  // The team took the chat over: the assistant stays quiet until it is given back (by hand, or after
  // the team's silence when the business chose an automatic return).
  if (state.mode === "human") {
    const resumeAfter = settings.autoResumeMinutes;
    const idleSince = state.lastOwnerAt ?? 0;
    if (resumeAfter !== null && idleSince && nowMs - idleSince >= resumeAfter * 60_000) {
      state = { ...state, mode: "bot", handoffReason: null, offeredHandoff: false };
    } else {
      return { ...base, replies: [], conversation: { ...state, lastCustomerAt: message.at }, handoff: null, silent: "human" };
    }
  }

  const language = replyLanguage(message.body, state.language, settings.languages, settings.defaultLanguage);
  const text = fixedMessages[language];
  state = { ...state, language, lastCustomerAt: message.at };
  const replies: string[] = [];
  if (!state.greeted) {
    replies.push(text.intro(knowledge.businessName, knowledge.privacyUrl ?? null));
    state = { ...state, greeted: true };
  }

  if (message.kind === "media" || !normalize(message.body)) {
    replies.push(text.textOnly);
    return finish({ ...base, language, replies, conversation: state, handoff: null, silent: null });
  }

  const found = detectIntents(message.body, knowledge.kind);
  const opening = openingState(knowledge.hours, knowledge.closures, knowledge.timeZone, now);
  const fullHistory: ChatMessage[] = [...history, { author: "customer", body: message.body, at: message.at }];

  const handOff = (reason: HandoffReason, sentence: string): EngineResult => {
    replies.push(sentence);
    const summary = handoffSummary({ reason, language, property: state.property, history: fullHistory });
    return finish({
      ...base,
      intents: found,
      language,
      replies,
      conversation: { ...state, mode: "human", handoffReason: reason, offeredHandoff: false },
      handoff: { reason, urgent: reason === "emergency" || (found.includes("urgent") && reason !== "customer_asked"), summary },
      silent: null,
    });
  };

  // Too many replies in a short time: probably another bot or a stuck loop. A person takes over.
  if (state.recentBotReplies.length >= loopGuard.maxReplies) return handOff("loop_guard", text.handoff);

  const reason = handoffFor(found, state, knowledge.kind);
  if (reason === "emergency") return handOff(reason, text.emergency);
  if (reason === "access_code") return handOff(reason, text.accessCode);
  if (reason === "medical") return handOff(reason, text.medical);
  if (reason) {
    const closedNote = opening.known && !opening.open && opening.next ? text.handoffClosed(formatNextOpening(opening.next, language)) : text.handoff;
    return handOff(reason, closedNote);
  }

  if (knowledge.kind === "lodging" && found.includes("guest_identity")) {
    replies.push(text.guestIdentity);
    return finish({ ...base, intents: found, language, replies, conversation: { ...state, offeredHandoff: false }, handoff: null, silent: null });
  }

  // Lodging with several properties: learn which one the guest is in.
  const named = knowledge.properties.length > 1 ? findProperty(message.body, knowledge.properties) : null;
  if (named) state = { ...state, property: named };

  const index = input.index ?? buildIndex(knowledge);
  let query = message.body;
  let hits = search(index, query, { property: state.property, language });
  let chunkHits = searchChunks(index, query, { property: state.property, language });
  // The guest only named the property («Moinho Velho»): answer the question asked just before.
  if (named && !hits.some((hit) => hit.score >= minimumScore) && !chunkHits.some((hit) => hit.score >= minimumChunkScore)) {
    const previous = [...history].reverse().find((entry) => entry.author === "customer");
    if (previous) {
      query = previous.body;
      hits = search(index, query, { property: state.property, language });
      chunkHits = searchChunks(index, query, { property: state.property, language });
    }
  }

  // «Olá», «obrigado», «ok» with nothing to look up: a short polite answer.
  if ((isSmallTalk(found) || (named && !found.length)) && !hits.some((hit) => hit.score >= minimumScore) && !chunkHits.some((hit) => hit.score >= minimumChunkScore)) {
    if (found.includes("thanks")) replies.push(text.thanks);
    else replies.push(text.howCanIHelp);
    return finish({ ...base, intents: found, language, replies, conversation: { ...state, offeredHandoff: false }, handoff: null, silent: null });
  }

  // The best answers are about different properties and we don't know the guest's: ask first.
  if (knowledge.properties.length > 1 && !state.property) {
    const strong = hits.filter((hit) => hit.score >= minimumScore);
    const properties = new Set(strong.map((hit) => hit.doc.property).filter(Boolean));
    if (properties.size > 1 || (strong[0]?.doc.property && !strong.some((hit) => !hit.doc.property))) {
      replies.push(text.whichProperty(knowledge.properties.join(" · ")));
      return finish({ ...base, intents: found, language, replies, conversation: state, handoff: null, silent: null });
    }
  }

  const answerIntents = query === message.body ? found : detectIntents(query, knowledge.kind);
  const request = { language, message: query, intents: answerIntents, hits, chunkHits, knowledge, settings, opening, history, property: state.property, now };
  let answer;
  let providerNote: string | null = null;
  try {
    answer = await provider.answer(request);
  } catch (error) {
    // Any problem with an outside AI (off, cap reached, error, timeout): the free answers take over.
    if (provider === mockProvider) throw error;
    providerNote = error instanceof ProviderDisabledError ? error.message.replace(/^answer provider (.*) is disabled$/, "IA não usada: $1") : `IA não usada: ${provider.id} (${error instanceof Error ? error.message : "erro"})`;
    answer = await mockProvider.answer(request);
  }

  if (!answer.text) {
    replies.push(text.dontKnow(knowledge.phone ?? null));
    return finish({ ...base, intents: found, language, replies, conversation: { ...state, offeredHandoff: true }, handoff: null, silent: null, provider: answer.provider, providerNote });
  }

  const checked = sanitizeReply(answer.text, knowledge.kind);
  if (checked.blocked && !checked.text) {
    // Everything was a secret: the host answers instead.
    return handOff("access_code", text.accessCode);
  }
  replies.push(checked.text);
  return finish({
    ...base,
    intents: found,
    language,
    replies,
    conversation: { ...state, offeredHandoff: false },
    handoff: null,
    silent: null,
    provider: answer.provider,
    usedEntryIds: answer.usedEntryIds,
    sources: answer.sources ?? [],
    providerNote,
    blocked: checked.blocked,
  });

  function finish(result: EngineResult): EngineResult {
    if (!result.replies.length) return result;
    return { ...result, conversation: { ...result.conversation, recentBotReplies: [...result.conversation.recentBotReplies, nowMs] } };
  }
}

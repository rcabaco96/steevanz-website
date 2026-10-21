// The site chat (web channel, phase D of docs/chatbot/PLANO-PRODUTO.md; today only the test page /chat-teste):
// what a request may carry, the limits that keep a public page from draining the free AI quota, and the origin
// check. Pure module (tests/chatbot-web.test.mjs); the route is src/app/api/chatbot/web/route.ts.
//
// Nothing is stored: like the admin's «Experimentar», the conversation lives in the visitor's browser
// (sessionStorage) and comes back with each message. The only thing written is a salted hash of the visitor's IP
// per message (the limits), in the same table the site's forms use.
import { conversationStateFrom } from "./rows.ts";
import { newConversationState, type ChatMessage, type ConversationState } from "./types.ts";

/** Caps per message and per visitor (owner, 2026-10-21: low enough that visitors can't drain Groq's free quota). */
export const webLimits = {
  /** Characters of one visitor message. */
  messageChars: 500,
  /** Bytes of one request body. */
  bodyBytes: 16_000,
  /** Earlier messages sent back with a request (the engine reads the last ones). */
  historyTurns: 20,
  /** Characters of one earlier message. */
  turnChars: 1000,
  /** Owner's choice (2026-10-21): 20 a minute and 80 a day per visitor, 300 a day for everyone (env can change them). */
  perIpMinute: 20,
  perIpDay: 80,
  /** Every visitor together, per day. */
  globalDay: 300,
} as const;

export interface VisitorLimits {
  perIpMinute: number;
  perIpDay: number;
  globalDay: number;
}

/** The visitor caps, from CHATBOT_WEB_MAX_PER_MINUTE, CHATBOT_WEB_MAX_PER_DAY and CHATBOT_WEB_MAX_TOTAL_PER_DAY when set (whole numbers ≥ 1). */
export function visitorLimitsFrom(env: Record<string, string | undefined>): VisitorLimits {
  const read = (name: string, fallback: number) => {
    const value = Number(env[name]);
    return Number.isInteger(value) && value >= 1 ? value : fallback;
  };
  return {
    perIpMinute: read("CHATBOT_WEB_MAX_PER_MINUTE", webLimits.perIpMinute),
    perIpDay: read("CHATBOT_WEB_MAX_PER_DAY", webLimits.perIpDay),
    globalDay: read("CHATBOT_WEB_MAX_TOTAL_PER_DAY", webLimits.globalDay),
  };
}

export const busyMessage = "Estamos com muitas mensagens, tente daqui a pouco.";

export interface WebTurn {
  author: "customer" | "bot";
  body: string;
}

export interface WebRequest {
  message: string;
  turns: WebTurn[];
  conversation: ConversationState;
  /** A random id the browser keeps for this tab (one answer at a time per conversation). */
  session: string;
}

export type WebRequestError = "message_missing" | "message_too_long" | "bad_request";

const sessionPattern = /^[A-Za-z0-9_-]{8,64}$/;

/** Reads a request body (already parsed JSON) through the same checks as the database rows. */
export function parseWebRequest(body: unknown): WebRequest | { error: WebRequestError } {
  if (!body || typeof body !== "object" || Array.isArray(body)) return { error: "bad_request" };
  const input = body as Record<string, unknown>;
  if (typeof input.message !== "string") return { error: "message_missing" };
  const message = input.message.replace(/\s+/g, " ").trim();
  if (!message) return { error: "message_missing" };
  if (message.length > webLimits.messageChars) return { error: "message_too_long" };
  if (typeof input.session !== "string" || !sessionPattern.test(input.session)) return { error: "bad_request" };
  const rawTurns = input.turns === undefined ? [] : input.turns;
  if (!Array.isArray(rawTurns)) return { error: "bad_request" };
  const turns: WebTurn[] = [];
  for (const turn of rawTurns.slice(-webLimits.historyTurns)) {
    if (!turn || typeof turn !== "object") return { error: "bad_request" };
    const { author, body: text } = turn as Record<string, unknown>;
    if ((author !== "customer" && author !== "bot") || typeof text !== "string") return { error: "bad_request" };
    turns.push({ author, body: text.slice(0, webLimits.turnChars) });
  }
  const saved = input.conversation;
  const conversation =
    saved && typeof saved === "object" && !Array.isArray(saved)
      ? conversationStateFrom({ state: saved as Partial<ConversationState>, mode: "bot" })
      : newConversationState();
  // No team inbox on this channel: the chat is never left with «the team» (a tampered state can't silence it).
  return { message, turns, conversation: { ...conversation, mode: "bot", handoffReason: null }, session: input.session };
}

/** The earlier messages as the engine reads them (oldest first, one second apart, ending just before now). */
export function historyFrom(turns: readonly WebTurn[], now: number): ChatMessage[] {
  return turns.map((turn, index) => ({ author: turn.author, body: turn.body, at: now - (turns.length - index) * 1000 }));
}

/**
 * Where a request may come from: the site itself (www and bare domain), the deployment's own address (previews,
 * local dev) and nothing else. A browser always sends Origin on a POST; no Origin, or another site's, is refused.
 */
export function originAllowed(origin: string | null, ownOrigin: string | null, siteUrl: string): boolean {
  if (!origin) return false;
  let host: string;
  try {
    const url = new URL(origin);
    if (url.origin !== origin.replace(/\/+$/, "")) return false;
    host = url.host;
  } catch {
    return false;
  }
  const allowed = new Set<string>();
  for (const candidate of [siteUrl, "https://www.steevanz.com", "https://steevanz.com", ownOrigin]) {
    if (!candidate) continue;
    try {
      allowed.add(new URL(candidate).host);
    } catch {
      // ignore a malformed setting
    }
  }
  return allowed.has(host);
}

/** Counts of earlier messages: by one visitor (their IP's hash) or by everyone (null). */
export interface AttemptStore {
  count(visitor: string | null, sinceMs: number): Promise<number>;
  add(visitor: string, at: number): Promise<void>;
}

export type LimitReason = "visitor_minute" | "visitor_day" | "everyone_day";

/** Whether one more message is allowed now; when it is, it is counted. */
export async function takeWebSlot(store: AttemptStore, visitor: string, now: number, limits: VisitorLimits = webLimits): Promise<LimitReason | null> {
  const minute = now - 60_000;
  const day = now - 24 * 60 * 60_000;
  const [lastMinute, lastDay, everyone] = await Promise.all([store.count(visitor, minute), store.count(visitor, day), store.count(null, day)]);
  if (lastMinute >= limits.perIpMinute) return "visitor_minute";
  if (lastDay >= limits.perIpDay) return "visitor_day";
  if (everyone >= limits.globalDay) return "everyone_day";
  await store.add(visitor, now);
  return null;
}

/** In memory (tests, and the fallback when the database can't be reached): per server instance only. */
export function memoryAttemptStore(): AttemptStore {
  const seen: { visitor: string; at: number }[] = [];
  return {
    async count(visitor, sinceMs) {
      return seen.filter((attempt) => attempt.at >= sinceMs && (visitor === null || attempt.visitor === visitor)).length;
    },
    async add(visitor, at) {
      seen.push({ visitor, at });
      // Keep a day at most.
      while (seen.length && seen[0].at < at - 24 * 60 * 60_000) seen.shift();
    },
  };
}

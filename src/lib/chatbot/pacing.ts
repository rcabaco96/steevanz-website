// Anti-ban hygiene for an unofficial WhatsApp Web connection (open-wa), also sensible for the
// official API: reply only to people who wrote first, never in bulk, at a human pace, and never to
// old messages after a reconnection. Pure module with the clock passed in (tests/chatbot.test.mjs).

export interface PacingConfig {
  /** Typing time per character, with a floor and a ceiling (looks human, avoids instant bursts). */
  typingMsPerChar: number;
  typingMinMs: number;
  typingMaxMs: number;
  /** ± random share of each delay. */
  jitter: number;
  /** Gap between two messages to the same chat. */
  minGapPerChatMs: number;
  /** Ceiling of messages per number per minute, per hour and per day. */
  maxPerMinute: number;
  maxPerHour: number;
  maxPerDay: number;
  /** Only answer customers who wrote in the last … (the official API's 24-hour window). */
  replyWindowMs: number;
  /** Messages older than this when they reach us (backlog after a reconnection) get no automatic reply. */
  maxMessageAgeMs: number;
}

export const defaultPacing: PacingConfig = {
  typingMsPerChar: 35,
  typingMinMs: 1500,
  typingMaxMs: 8000,
  jitter: 0.25,
  minGapPerChatMs: 1500,
  maxPerMinute: 20,
  maxPerHour: 200,
  maxPerDay: 600,
  replyWindowMs: 24 * 60 * 60_000,
  maxMessageAgeMs: 15 * 60_000,
};

/**
 * The open-wa pilot on the owner's test number (owner, 2026-10-20: «muito cuidado»): slower typing
 * (3–8 s), at most 10 replies an hour and 50 a day. The runner uses these unless told otherwise.
 */
export const pilotPacing: PacingConfig = {
  ...defaultPacing,
  typingMsPerChar: 60,
  typingMinMs: 3000,
  typingMaxMs: 8000,
  jitter: 0,
  minGapPerChatMs: 5000,
  maxPerMinute: 3,
  maxPerHour: 10,
  maxPerDay: 50,
};

/** How long to «type» a message before sending it. `random` returns 0..1 (Math.random in production). */
export function typingDelay(text: string, config: PacingConfig = defaultPacing, random: () => number = Math.random): number {
  const base = Math.min(config.typingMaxMs, Math.max(config.typingMinMs, text.length * config.typingMsPerChar));
  const factor = 1 + (random() * 2 - 1) * config.jitter;
  return Math.round(Math.min(config.typingMaxMs, Math.max(config.typingMinMs, base * factor)));
}

/** Whether a message is fresh enough for an automatic reply. */
export function isFresh(messageAt: number, now: number, config: PacingConfig = defaultPacing): boolean {
  return now - messageAt <= config.maxMessageAgeMs;
}

/** Whether we may still write to this customer (they wrote within the reply window). */
export function withinReplyWindow(lastCustomerAt: number | null, now: number, config: PacingConfig = defaultPacing): boolean {
  return lastCustomerAt !== null && now - lastCustomerAt <= config.replyWindowMs;
}

/** Counts what one number has sent, to keep under the per-minute and per-day ceilings. */
export class Pacer {
  private readonly sent: number[] = [];
  private readonly lastByChat = new Map<string, number>();

  private readonly config: PacingConfig;

  constructor(config: PacingConfig = defaultPacing) {
    this.config = config;
  }

  /** Milliseconds to wait before sending to this chat (0 = now); Infinity = hourly or daily ceiling reached (don't send). */
  waitBeforeSend(chatId: string, now: number): number {
    const day = 24 * 60 * 60_000;
    while (this.sent.length && now - this.sent[0] >= day) this.sent.shift();
    if (this.sent.length >= this.config.maxPerDay) return Infinity;
    const lastHour = this.sent.filter((at) => now - at < 60 * 60_000);
    if (lastHour.length >= this.config.maxPerHour) return Infinity;
    const lastMinute = this.sent.filter((at) => now - at < 60_000);
    const minuteWait = lastMinute.length >= this.config.maxPerMinute ? 60_000 - (now - lastMinute[0]) : 0;
    const last = this.lastByChat.get(chatId);
    const chatWait = last === undefined ? 0 : Math.max(0, this.config.minGapPerChatMs - (now - last));
    return Math.max(minuteWait, chatWait);
  }

  record(chatId: string, now: number): void {
    this.sent.push(now);
    this.lastByChat.set(chatId, now);
  }
}

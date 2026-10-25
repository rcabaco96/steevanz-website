// The official WhatsApp Business Cloud API (Meta) as a ChannelAdapter, plus the webhook pieces: the
// subscription check, the X-Hub-Signature-256 check and the reading of Meta's payloads into InboundMessage.
// Pure module (fetch is injected; tests/chatbot-cloud-api.test.mjs never reaches Meta). The route is
// src/app/api/chatbot/whatsapp/route.ts.
//
// Costs (Meta, since 2026-10-01): every message the assistant sends is charged per delivered message,
// unless the chat started from a click-to-WhatsApp ad (free entry point). Messages received are free.
// The assistant never writes first (no templates), so it only ever sends inside the 24-hour window.
import { createHmac, timingSafeEqual } from "node:crypto";
import type { AdapterHandlers, ChannelAdapter, InboundMessage } from "./adapters.ts";

export const graphUrl = "https://graph.facebook.com";
export const defaultGraphVersion = "v23.0";

/** WhatsApp's own ceiling for one text message. */
export const maxTextChars = 4096;

type Fetch = (input: string, init?: RequestInit) => Promise<Response>;

// ── Webhook subscription (GET) ───────────────────────────────────────────────

/**
 * Meta's subscription check: `hub.mode=subscribe`, our verify token, and a challenge to echo back.
 * Returns the challenge to answer with, or null (→ 403).
 */
export function verifySubscription(params: URLSearchParams, verifyToken: string | undefined): string | null {
  if (!verifyToken) return null;
  if (params.get("hub.mode") !== "subscribe") return null;
  const token = params.get("hub.verify_token") ?? "";
  const challenge = params.get("hub.challenge");
  if (!challenge || !sameText(token, verifyToken)) return null;
  return challenge;
}

// ── Signature (POST) ─────────────────────────────────────────────────────────

/** `X-Hub-Signature-256: sha256=<hex>` = HMAC-SHA256 of the raw body with the Meta app secret. */
export function validSignature(rawBody: string | Uint8Array, header: string | null, appSecret: string | undefined): boolean {
  if (!appSecret || !header?.startsWith("sha256=")) return false;
  const expected = createHmac("sha256", appSecret).update(rawBody).digest("hex");
  return sameText(header.slice("sha256=".length).toLowerCase(), expected);
}

function sameText(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

// ── Payload → InboundMessage ─────────────────────────────────────────────────

export interface WebhookBatch {
  /** The business number that received the messages (metadata.phone_number_id). */
  phoneNumberId: string;
  messages: InboundMessage[];
}

interface MetaMessage {
  id?: unknown;
  from?: unknown;
  to?: unknown;
  timestamp?: unknown;
  type?: unknown;
  text?: { body?: unknown };
  button?: { text?: unknown };
  interactive?: { button_reply?: { title?: unknown }; list_reply?: { title?: unknown } };
  image?: { caption?: unknown };
  video?: { caption?: unknown };
  document?: { caption?: unknown };
  group_id?: unknown;
}

const asText = (value: unknown): string => (typeof value === "string" ? value : "");
const digits = (value: unknown): string => asText(value).replace(/\D/g, "");

/** The text a customer typed or picked (buttons and lists count as text; a caption with its media). */
function bodyOf(message: MetaMessage): { body: string; kind: InboundMessage["kind"] } {
  switch (message.type) {
    case "text":
      return { body: asText(message.text?.body), kind: "text" };
    case "button":
      return { body: asText(message.button?.text), kind: "text" };
    case "interactive":
      return { body: asText(message.interactive?.button_reply?.title) || asText(message.interactive?.list_reply?.title), kind: "text" };
    case "image":
    case "video":
    case "document":
      return { body: asText(message[message.type]?.caption), kind: "media" };
    case "audio":
    case "sticker":
      return { body: "", kind: "media" };
    default:
      return { body: "", kind: "other" };
  }
}

function inbound(message: MetaMessage, chat: string, fromOwner: boolean, names: Map<string, string>): InboundMessage | null {
  const id = asText(message.id);
  if (!id || !chat) return null;
  const seconds = Number(asText(message.timestamp));
  const { body, kind } = bodyOf(message);
  return {
    chatId: chat,
    messageId: id,
    fromOwner,
    body,
    at: Number.isFinite(seconds) && seconds > 0 ? seconds * 1000 : Date.now(),
    kind,
    contactName: fromOwner ? null : (names.get(chat) ?? null),
    isGroup: Boolean(message.group_id),
  };
}

/**
 * Reads one webhook POST. `messages` are the customers' (field «messages»); `message_echoes` are what the
 * business wrote from the WhatsApp Business app on the same number (coexistence, field «smb_message_echoes»):
 * those come back as `fromOwner`, so the team taking over pauses the assistant in that chat, as on open-wa.
 * Statuses (sent/delivered/read), history and contact syncs are ignored.
 */
export function readWebhook(payload: unknown): WebhookBatch[] {
  const batches = new Map<string, InboundMessage[]>();
  const entries = (payload as { object?: unknown; entry?: unknown })?.object === "whatsapp_business_account" ? (payload as { entry?: unknown }).entry : null;
  if (!Array.isArray(entries)) return [];
  for (const entry of entries) {
    const changes = (entry as { changes?: unknown })?.changes;
    if (!Array.isArray(changes)) continue;
    for (const change of changes) {
      const field = (change as { field?: unknown })?.field;
      const value = (change as { value?: unknown })?.value as
        | { metadata?: { phone_number_id?: unknown }; contacts?: unknown; messages?: unknown; message_echoes?: unknown }
        | undefined;
      const phoneNumberId = asText(value?.metadata?.phone_number_id);
      if (!value || !phoneNumberId) continue;
      const list = batches.get(phoneNumberId) ?? [];
      if (field === "messages" && Array.isArray(value.messages)) {
        const names = new Map<string, string>();
        if (Array.isArray(value.contacts)) {
          for (const contact of value.contacts as { wa_id?: unknown; profile?: { name?: unknown } }[]) {
            const name = asText(contact?.profile?.name).trim();
            if (digits(contact?.wa_id) && name) names.set(digits(contact.wa_id), name.slice(0, 120));
          }
        }
        for (const message of value.messages as MetaMessage[]) {
          const read = inbound(message, digits(message?.from), false, names);
          if (read) list.push(read);
        }
      } else if (field === "smb_message_echoes" && Array.isArray(value.message_echoes)) {
        for (const echo of value.message_echoes as MetaMessage[]) {
          const read = inbound(echo, digits(echo?.to), true, new Map());
          if (read) list.push(read);
        }
      }
      if (list.length) batches.set(phoneNumberId, list);
    }
  }
  return [...batches].map(([phoneNumberId, messages]) => ({ phoneNumberId, messages }));
}

// ── The adapter (sending) ────────────────────────────────────────────────────

export interface CloudApiConfig {
  phoneNumberId: string;
  accessToken: string;
  version?: string;
  fetch?: Fetch;
  log?: (line: string) => void;
}

export class CloudApiError extends Error {
  readonly status: number;
  readonly code: number | null;
  constructor(status: number, code: number | null, message: string) {
    super(message);
    this.name = "CloudApiError";
    this.status = status;
    this.code = code;
  }
}

/**
 * One business number on the Cloud API. Messages arrive through the webhook (not through start()), so the
 * route hands each one to the runtime itself; `noteInbound` lets the typing indicator point at the customer's
 * last message (Meta shows «a escrever…» and marks it as read, for at most 25 s or until the reply).
 */
export class CloudApiAdapter implements ChannelAdapter {
  readonly kind = "cloud-api" as const;
  private readonly config: CloudApiConfig;
  private readonly lastInbound = new Map<string, string>();
  private readonly fetcher: Fetch;

  constructor(config: CloudApiConfig) {
    this.config = config;
    this.fetcher = config.fetch ?? ((input, init) => fetch(input, init));
  }

  async start(handlers: AdapterHandlers): Promise<void> {
    handlers.onStatus({ state: "connected", number: null });
  }

  async stop(): Promise<void> {}

  noteInbound(message: InboundMessage): void {
    if (!message.fromOwner) this.lastInbound.set(message.chatId, message.messageId);
  }

  private async post(body: Record<string, unknown>): Promise<Record<string, unknown>> {
    const version = this.config.version || defaultGraphVersion;
    const response = await this.fetcher(`${graphUrl}/${version}/${encodeURIComponent(this.config.phoneNumberId)}/messages`, {
      method: "POST",
      headers: { Authorization: `Bearer ${this.config.accessToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({ messaging_product: "whatsapp", ...body }),
      signal: AbortSignal.timeout(15_000),
    });
    const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;
    if (!response.ok) {
      const error = (data.error ?? {}) as { code?: unknown; message?: unknown };
      // Never the token: only Meta's status, code and message.
      throw new CloudApiError(response.status, typeof error.code === "number" ? error.code : null, `Cloud API ${response.status}: ${asText(error.message) || "erro"}`);
    }
    return data;
  }

  async sendText(chatId: string, text: string): Promise<{ messageId: string }> {
    const data = await this.post({
      recipient_type: "individual",
      to: chatId,
      type: "text",
      text: { body: text.slice(0, maxTextChars), preview_url: /https?:\/\//.test(text) },
    });
    const id = asText((data.messages as { id?: unknown }[] | undefined)?.[0]?.id);
    return { messageId: id || `cloud-out-${Date.now()}` };
  }

  async simulateTyping(chatId: string, ms: number): Promise<void> {
    const messageId = this.lastInbound.get(chatId);
    if (messageId) {
      try {
        await this.post({ status: "read", message_id: messageId, typing_indicator: { type: "text" } });
      } catch (error) {
        // Cosmetic: a failed «a escrever…» never stops the reply.
        this.config.log?.(`[cloud-api] typing indicator: ${error instanceof Error ? error.message : error}`);
      }
    }
    await new Promise<void>((resolve) => setTimeout(resolve, ms));
  }
}

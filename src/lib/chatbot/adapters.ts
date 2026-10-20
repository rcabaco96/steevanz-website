// The one interface every WhatsApp connection implements, so the business logic never depends on
// how messages travel: open-wa (WhatsApp Web, unofficial), the official WhatsApp Business Cloud API,
// or the fake adapter of the tests and the offline simulator. Pure module.

export type AdapterKind = "fake" | "open-wa" | "cloud-api";

export interface InboundMessage {
  /** The chat (e.g. "351912345678@c.us" on open-wa, the phone number on the Cloud API). */
  chatId: string;
  /** The channel's id of this message (used to never process it twice). */
  messageId: string;
  /** Written by the business itself (the owner answering from the phone): the team takes over. */
  fromOwner: boolean;
  body: string;
  /** Epoch ms when it was sent. */
  at: number;
  kind: "text" | "media" | "other";
  contactName?: string | null;
  /** Groups, broadcast lists and status updates never get automatic replies. */
  isGroup: boolean;
}

export type AdapterStatus =
  | { state: "starting" }
  /** Pairing: the QR (its text; the admin draws it) that the business scans in WhatsApp > Linked devices. */
  | { state: "qr"; qr: string }
  | { state: "connected"; number: string | null }
  | { state: "disconnected"; reason: string }
  | { state: "error"; message: string };

export interface AdapterHandlers {
  onMessage: (message: InboundMessage) => Promise<void> | void;
  onStatus: (status: AdapterStatus) => void;
}

export interface ChannelAdapter {
  readonly kind: AdapterKind;
  start(handlers: AdapterHandlers): Promise<void>;
  stop(): Promise<void>;
  sendText(chatId: string, text: string): Promise<{ messageId: string }>;
  /** Shows «a escrever…» for a while, when the channel supports it. */
  simulateTyping?(chatId: string, ms: number): Promise<void>;
}

/** In-memory adapter for the tests and the offline simulator: nothing leaves the computer. */
export class FakeAdapter implements ChannelAdapter {
  readonly kind = "fake" as const;
  readonly sent: { chatId: string; text: string; messageId: string }[] = [];
  private handlers: AdapterHandlers | null = null;
  private counter = 0;

  async start(handlers: AdapterHandlers): Promise<void> {
    this.handlers = handlers;
    handlers.onStatus({ state: "connected", number: null });
  }

  async stop(): Promise<void> {
    this.handlers?.onStatus({ state: "disconnected", reason: "stopped" });
    this.handlers = null;
  }

  async sendText(chatId: string, text: string): Promise<{ messageId: string }> {
    const messageId = `fake-out-${++this.counter}`;
    this.sent.push({ chatId, text, messageId });
    return { messageId };
  }

  /** Delivers a message as if it arrived from WhatsApp. */
  async receive(message: Partial<InboundMessage> & { chatId: string; body: string }): Promise<void> {
    if (!this.handlers) throw new Error("FakeAdapter not started");
    await this.handlers.onMessage({
      messageId: `fake-in-${++this.counter}`,
      fromOwner: false,
      at: Date.now(),
      kind: "text",
      isGroup: false,
      ...message,
    });
  }
}

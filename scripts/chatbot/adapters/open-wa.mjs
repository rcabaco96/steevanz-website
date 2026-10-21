// open-wa adapter (WhatsApp Web automation, unofficial): turns the business's own WhatsApp account
// into the bot's channel through a «linked device» session (QR scanned in WhatsApp > Linked devices).
// Read docs/chatbot/ARCHITECTURE.md (risks: possible number bans, WhatsApp terms, open-wa licence)
// before using it with a real number.
//
// open-wa is NOT a dependency of the site: it is installed only on the computer that runs the bot,
// inside this folder (scripts/chatbot: `npm install`, see README.md). Nothing here runs on Vercel.
//
// Written against open-wa v5 (createClient + PuppeteerDriver, 5.6.x) with fallbacks to the v4 names
// (create, ev 'qr.**', onAnyMessage). open-wa's v5 docs are still being reorganised: check the QR and
// message events on the first pairing (the QR is also printed in the terminal by open-wa itself).

/** WhatsApp ids: "351912345678@c.us" (person), "...@g.us" (group), "status@broadcast". */
function isGroupId(id) {
  return typeof id === "string" && (id.endsWith("@g.us") || id.endsWith("@broadcast") || id.endsWith("@newsletter"));
}

/** open-wa message → InboundMessage (src/lib/chatbot/adapters.ts). */
export function toInbound(message) {
  const chatId = message.fromMe ? (message.to ?? message.chatId ?? message.chat?.id) : (message.from ?? message.chatId ?? message.chat?.id);
  const seconds = Number(message.t ?? message.timestamp ?? 0);
  const type = message.type ?? "chat";
  return {
    chatId: typeof chatId === "object" && chatId?._serialized ? chatId._serialized : String(chatId ?? ""),
    messageId: String(message.id?._serialized ?? message.id ?? `${chatId}-${seconds}`),
    fromOwner: Boolean(message.fromMe),
    body: type === "chat" ? String(message.body ?? "") : String(message.caption ?? ""),
    at: seconds ? seconds * 1000 : Date.now(),
    kind: type === "chat" ? "text" : ["image", "video", "audio", "ptt", "document", "sticker"].includes(type) ? "media" : "other",
    contactName: message.sender?.pushname ?? message.sender?.formattedName ?? message.notifyName ?? null,
    isGroup: Boolean(message.isGroupMsg) || isGroupId(String(chatId ?? "")),
  };
}

async function loadOpenWa() {
  try {
    return await import("@open-wa/wa-automate");
  } catch (error) {
    throw new Error(
      "O open-wa não está instalado neste computador. Na pasta scripts/chatbot corra `npm install` (ver README.md). " +
        `Detalhe: ${error instanceof Error ? error.message : error}`,
    );
  }
}

async function loadDriver() {
  try {
    const { PuppeteerDriver } = await import("@open-wa/driver-puppeteer");
    return PuppeteerDriver ? new PuppeteerDriver() : null;
  } catch {
    return null;
  }
}

/**
 * @param {{ sessionId: string, sessionDataPath: string, executablePath?: string, headless?: boolean, licenseKey?: string, log?: (line: string) => void }} options
 * @returns {import("../../../src/lib/chatbot/adapters.ts").ChannelAdapter}
 */
export function createOpenWaAdapter(options) {
  const log = options.log ?? console.log;
  let client = null;

  return {
    kind: "open-wa",

    async start(handlers) {
      handlers.onStatus({ state: "starting" });
      const wa = await loadOpenWa();
      // Only the config fields open-wa documents for v5 (README «Configuration and CLI»), plus
      // sessionDataPath (v4 name) so the session survives restarts in a folder outside the repo.
      const config = {
        sessionId: options.sessionId,
        sessionDataPath: options.sessionDataPath,
        headless: options.headless ?? true,
        qrTimeout: 0,
        authTimeout: 0,
        ...(options.executablePath ? { executablePath: options.executablePath, useChrome: true } : {}),
        ...(options.licenseKey ? { licenseKey: options.licenseKey } : {}),
      };

      // The pairing QR: v4 emits it on `ev` ("qr.**"); v5 may call a callback or print it only.
      const onQr = (qr) => {
        const text = typeof qr === "string" ? qr : String(qr?.qr ?? qr?.data ?? "");
        if (text) handlers.onStatus({ state: "qr", qr: text });
      };
      if (wa.ev?.on) wa.ev.on("qr.**", (qr) => onQr(qr));

      if (typeof wa.createClient === "function") {
        const driver = await loadDriver();
        client = await wa.createClient({ ...config, ...(driver ? { driver } : {}) });
      } else if (typeof wa.create === "function") {
        client = await wa.create(config);
      } else {
        throw new Error("Versão do open-wa sem createClient/create: confirme a versão instalada (ver README.md).");
      }

      const number = (await client.getHostNumber?.().catch(() => null)) ?? null;
      handlers.onStatus({ state: "connected", number: number ? String(number) : null });

      // onAnyMessage also reports what the owner sends from the phone (fromMe): that is how the team
      // takes a chat over. Without it, only customers' messages arrive.
      const subscribe = client.onAnyMessage?.bind(client) ?? client.onMessage?.bind(client);
      if (!subscribe) throw new Error("open-wa sem onAnyMessage/onMessage.");
      if (!client.onAnyMessage) log("[open-wa] onAnyMessage indisponível: as respostas do dono pelo telemóvel não pausam o assistente.");
      await subscribe(async (message) => {
        try {
          await handlers.onMessage(toInbound(message));
        } catch (error) {
          log(`[open-wa] erro ao tratar mensagem: ${error instanceof Error ? error.message : error}`);
        }
      });

      client.onStateChanged?.((state) => {
        const value = String(state ?? "").toUpperCase();
        if (value === "CONNECTED") handlers.onStatus({ state: "connected", number: number ? String(number) : null });
        else if (["CONFLICT", "UNPAIRED", "UNLAUNCHED", "DISCONNECTED", "TIMEOUT"].includes(value)) handlers.onStatus({ state: "disconnected", reason: value });
      });
      client.onLogout?.(() => handlers.onStatus({ state: "disconnected", reason: "LOGOUT" }));
    },

    async stop() {
      if (!client) return;
      try {
        await client.kill?.();
      } finally {
        client = null;
      }
    },

    async sendText(chatId, text) {
      if (!client) throw new Error("open-wa não está ligado");
      const result = await client.sendText(chatId, text);
      const id = typeof result === "string" ? result : (result?.id?._serialized ?? result?.id ?? "");
      return { messageId: String(id || `${chatId}-${Date.now()}`) };
    },

    async simulateTyping(chatId, ms) {
      if (!client?.simulateTyping) return new Promise((resolve) => setTimeout(resolve, ms));
      await client.simulateTyping(chatId, true).catch(() => {});
      await new Promise((resolve) => setTimeout(resolve, ms));
      await client.simulateTyping(chatId, false).catch(() => {});
    },
  };
}

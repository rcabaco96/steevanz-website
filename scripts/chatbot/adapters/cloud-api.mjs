// Official WhatsApp Business Cloud API adapter: a placeholder, switched off on purpose.
//
// How it would work (phase 2, only if the owner chooses the official API — costs and Meta
// verification in docs/chatbot/ARCHITECTURE.md):
//   - Meta calls a webhook on the site (e.g. /api/chatbot/whatsapp, verified with the app secret)
//     for every incoming message; no long-running process or browser is needed, so it fits Vercel.
//   - Replies go to POST https://graph.facebook.com/<version>/<phone-number-id>/messages with the
//     business's access token. Inside the 24-hour customer service window the reply is a free-form
//     text; outside it only Meta-approved templates may be sent (the assistant never starts chats).
//   - The same engine (src/lib/chatbot/engine.ts) and store are reused unchanged.
//
// Nothing is sent from here: start() refuses, so no request to Meta is ever made by mistake.

export function createCloudApiAdapter() {
  return {
    kind: "cloud-api",
    async start() {
      throw new Error("O adaptador da API oficial do WhatsApp ainda não está ativo (fase 2). Ver docs/chatbot/ARCHITECTURE.md.");
    },
    async stop() {},
    async sendText() {
      throw new Error("API oficial do WhatsApp desligada.");
    },
  };
}

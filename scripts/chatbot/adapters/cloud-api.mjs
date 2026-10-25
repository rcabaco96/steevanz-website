// The official WhatsApp Business Cloud API does not run in this program: Meta calls the site's webhook
// (src/app/api/chatbot/whatsapp/route.ts, adapter in src/lib/chatbot/cloud-api.ts) for every message, on
// Vercel, with no long-running process. A bot set to «API oficial» in the admin is answered there, so this
// runner refuses it instead of answering the same chats twice.

export function createCloudApiAdapter() {
  return {
    kind: "cloud-api",
    async start() {
      throw new Error("Este assistente usa a API oficial do WhatsApp: responde no webhook do site (/api/chatbot/whatsapp), não neste programa.");
    },
    async stop() {},
    async sendText() {
      throw new Error("API oficial do WhatsApp: as respostas saem do webhook do site.");
    },
  };
}

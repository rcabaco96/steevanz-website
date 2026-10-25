import type { SupabaseClient } from "@supabase/supabase-js";
import { after, NextResponse } from "next/server";
import { CloudApiAdapter, readWebhook, validSignature, verifySubscription } from "@/lib/chatbot/cloud-api";
import { chooseProvider } from "@/lib/chatbot/llm/providers";
import { defaultPacing } from "@/lib/chatbot/pacing";
import { createRuntime, type HandoffEvent } from "@/lib/chatbot/runtime";
import { loadBotProfile, SupabaseChatbotStore } from "@/lib/chatbot/supabase-store";
import { sendEmail } from "@/lib/email/send";
import { siteUrl } from "@/lib/site";
import { createServiceClient } from "@/lib/supabase/service";

// Webhook of the official WhatsApp Business Cloud API (Meta) for one business number: the Steevanz one.
// Meta calls GET once to check the subscription and POST for every message. The POST answers 200 at once
// (Meta retries otherwise) and the reply is worked out after the response, with the same runtime, engine
// and store as the open-wa runner; replies go back through the Graph API.
//
// Nothing runs until every variable below is set on Vercel, the bot's channel is «API oficial» and its
// replies are switched on in /admin/chatbot (the kill switch, read on every message).
//   WHATSAPP_VERIFY_TOKEN       any long random text, also typed in Meta › WhatsApp › Configuration
//   WHATSAPP_APP_SECRET         Meta › App settings › Basic › App secret (checks X-Hub-Signature-256)
//   WHATSAPP_ACCESS_TOKEN       permanent System User token with whatsapp_business_messaging
//   WHATSAPP_PHONE_NUMBER_ID    the number's id (Meta › WhatsApp › API setup); other numbers are ignored
//   CHATBOT_WHATSAPP_BOT_ID     the assistant answering (default: the one named «Steevanz»)
//   CHATBOT_WHATSAPP_ALLOWLIST  optional: only these numbers (351…, comma-separated) get replies — for the first tests
//   WHATSAPP_GRAPH_VERSION      optional, default v23.0

export const maxDuration = 60;

const noStore = { "Cache-Control": "private, no-store" };

export function GET(request: Request) {
  const challenge = verifySubscription(new URL(request.url).searchParams, process.env.WHATSAPP_VERIFY_TOKEN?.trim());
  if (!challenge) return new NextResponse("forbidden", { status: 403, headers: noStore });
  return new NextResponse(challenge, { status: 200, headers: { ...noStore, "Content-Type": "text/plain" } });
}

export async function POST(request: Request) {
  const raw = await request.text();
  if (raw.length > 1_000_000) return new NextResponse(null, { status: 413, headers: noStore });
  if (!validSignature(raw, request.headers.get("x-hub-signature-256"), process.env.WHATSAPP_APP_SECRET?.trim())) {
    return new NextResponse("forbidden", { status: 403, headers: noStore });
  }
  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    return new NextResponse(null, { status: 400, headers: noStore });
  }
  const ownNumber = process.env.WHATSAPP_PHONE_NUMBER_ID?.trim();
  const batch = readWebhook(payload).find((item) => item.phoneNumberId === ownNumber);
  if (batch) {
    after(async () => {
      try {
        await answer(batch.messages);
      } catch (error) {
        console.error("[chatbot-whatsapp]", error instanceof Error ? error.message : error);
      }
    });
  }
  return new NextResponse(null, { status: 200, headers: noStore });
}

async function botIdFor(client: SupabaseClient): Promise<string | null> {
  const fromEnv = process.env.CHATBOT_WHATSAPP_BOT_ID?.trim();
  if (fromEnv) return fromEnv;
  const { data, error } = await client.from("chatbot_bots").select("id").eq("name", "Steevanz").limit(2);
  if (error) throw new Error(`bot lookup: ${error.message}`);
  return data && data.length === 1 ? (data[0] as { id: string }).id : null;
}

function allowlistFrom(value: string | undefined): string[] | null {
  const list = (value ?? "").split(",").map((item) => item.replace(/\D/g, "")).filter((item) => item.length >= 8);
  return list.length ? list : null;
}

async function answer(messages: Parameters<CloudApiAdapter["noteInbound"]>[0][]) {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN?.trim();
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID?.trim();
  if (!accessToken || !phoneNumberId) return;

  const client = createServiceClient();
  const botId = await botIdFor(client);
  if (!botId) {
    console.error("[chatbot-whatsapp] no bot: set CHATBOT_WHATSAPP_BOT_ID");
    return;
  }
  const loaded = await loadBotProfile(client, botId, siteUrl);
  if (!loaded) return;
  const { row, profile } = loaded;
  // Only a bot set to the official API: the open-wa runner and this webhook never answer for the same bot.
  if (row.channel_provider !== "cloud-api") {
    console.error(`[chatbot-whatsapp] bot ${botId} is not on the official API (channel ${row.channel_provider})`);
    return;
  }

  const adapter = new CloudApiAdapter({ phoneNumberId, accessToken, version: process.env.WHATSAPP_GRAPH_VERSION?.trim() || undefined, log: console.log });
  const runtime = createRuntime({
    bot: profile,
    adapter,
    store: new SupabaseChatbotStore(client),
    // A shorter «a escrever…» than the open-wa pilot: the function waits while it types.
    pacing: { ...defaultPacing, typingMaxMs: 5000 },
    allowlist: allowlistFrom(process.env.CHATBOT_WHATSAPP_ALLOWLIST),
    // The admin's «Ligar respostas»; off → messages are stored for the inbox, nothing is sent.
    canSend: () => row.enabled,
    provider: chooseProvider({ choice: row.answer_provider, paidAllowed: row.paid_answers_allowed === true, env: process.env }),
    log: console.log,
    onHandoff: (event) => notifyOwner(event, row.name),
  });
  for (const message of messages) {
    adapter.noteInbound(message);
    const outcome = await runtime.handle(message);
    if (outcome.status !== "replied") console.log(`[chatbot-whatsapp] ${message.messageId}: ${outcome.status}`);
  }
}

const escapeHtml = (text: string) => text.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);

/** A hand-off: an email to the admins (the conversation is already waiting in /admin/chatbot › Conversas). */
async function notifyOwner(event: HandoffEvent, botName: string) {
  const to = (process.env.ADMIN_EMAILS ?? "").split(",").map((item) => item.trim()).filter(Boolean);
  if (!to.length) return;
  const who = event.contactName ? `${event.contactName} (+${event.chatId})` : `+${event.chatId}`;
  const link = `${siteUrl}/admin/chatbot/${event.botId}`;
  const subject = `${event.handoff.urgent ? "URGENTE · " : ""}WhatsApp: ${who} quer falar consigo`;
  const text = `${who} no WhatsApp da ${botName}.\n\n${event.handoff.summary}\n\nResponda no WhatsApp (o assistente fica em silêncio nesta conversa) ou veja em ${link}`;
  const html = `<p><strong>${escapeHtml(who)}</strong> no WhatsApp da ${escapeHtml(botName)}.</p><p style="white-space:pre-line">${escapeHtml(event.handoff.summary)}</p><p>Responda no WhatsApp (o assistente fica em silêncio nesta conversa) ou veja em <a href="${link}">Conversas</a>.</p>`;
  await sendEmail({ to, subject, text, html });
}

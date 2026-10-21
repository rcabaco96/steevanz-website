import { createHash } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { respond } from "@/lib/chatbot/engine";
import { buildIndex, type KnowledgeIndex } from "@/lib/chatbot/knowledge";
import { chooseProvider } from "@/lib/chatbot/llm/providers";
import type { BotRow } from "@/lib/chatbot/rows";
import { loadBotProfile } from "@/lib/chatbot/supabase-store";
import type { BotProfile } from "@/lib/chatbot/types";
import { busyMessage, historyFrom, memoryAttemptStore, originAllowed, parseWebRequest, takeWebSlot, visitorLimitsFrom, webLimits, type AttemptStore } from "@/lib/chatbot/web-channel";
import { siteUrl } from "@/lib/site";
import { createServiceClient } from "@/lib/supabase/service";

// The site chat (web channel): one visitor message in, the assistant's replies out. Public, so it is guarded:
// JSON only, small bodies, the site's own origin, 20 messages a minute and 80 a day per visitor, 300 a day for
// everyone (src/lib/chatbot/web-channel.ts; CHATBOT_WEB_MAX_* change them). Nothing is stored but a salted hash of the IP per message (the limits);
// the conversation comes back from the browser. Replies only: never sources, notes, provider or keys.

const noStore = { "Cache-Control": "private, no-store" };
const unavailable = "O assistente não está disponível de momento. Ligue-nos para o 961 292 679.";

function reply(status: number, body: Record<string, unknown>) {
  return NextResponse.json(body, { status, headers: noStore });
}

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

/** The visitor as the limits count them: a salted hash, never the IP itself. */
function visitorKey(ip: string): string {
  const salt = process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(-24) ?? "steevanz";
  return createHash("sha256").update(`${salt}:chat-web:${ip}`).digest("hex");
}

/** The site's forms table (submission_attempts), kind «chat-web»; its own hashes, so the forms' limits are not touched. */
function databaseAttempts(client: SupabaseClient): AttemptStore {
  return {
    async count(visitor, sinceMs) {
      let query = client.from("submission_attempts").select("id", { count: "exact", head: true }).eq("kind", "chat-web").gte("created_at", new Date(sinceMs).toISOString());
      if (visitor) query = query.eq("ip_hash", visitor);
      const { count, error } = await query;
      if (error) throw error;
      return count ?? 0;
    },
    async add(visitor, at) {
      const { error } = await client.from("submission_attempts").insert({ ip_hash: visitor, kind: "chat-web", created_at: new Date(at).toISOString() });
      if (error) throw error;
    },
  };
}

/** When the database can't be reached: this instance's own counts (still limited). */
const fallbackAttempts = memoryAttemptStore();

/** The configured bot, read once a minute per server instance (its answers and document change rarely). */
let cached: { at: number; row: BotRow; profile: BotProfile; index: KnowledgeIndex } | null = null;
const cacheMs = 60_000;

async function webBot(client: SupabaseClient): Promise<typeof cached> {
  if (cached && Date.now() - cached.at < cacheMs) return cached;
  let botId = process.env.CHATBOT_WEB_TEST_BOT_ID?.trim() || null;
  if (!botId) {
    // Without the variable: the one bot named «Steevanz» (scripts/chatbot/steevanz-bot.mjs creates it).
    const { data, error } = await client.from("chatbot_bots").select("id").eq("name", "Steevanz").limit(2);
    if (error) throw new Error(`web bot lookup: ${error.message}`);
    if (!data || data.length !== 1) return null;
    botId = (data[0] as { id: string }).id;
  }
  const loaded = await loadBotProfile(client, botId, siteUrl);
  if (!loaded) return null;
  cached = { at: Date.now(), row: loaded.row, profile: loaded.profile, index: buildIndex(loaded.profile.knowledge) };
  return cached;
}

export async function POST(request: Request) {
  const ownOrigin = (() => {
    try {
      return new URL(request.url).origin;
    } catch {
      return null;
    }
  })();
  if (!originAllowed(request.headers.get("origin"), ownOrigin, siteUrl)) return reply(403, { error: "forbidden" });
  if (!request.headers.get("content-type")?.startsWith("application/json")) return reply(415, { error: "bad_request" });
  const text = await request.text();
  if (text.length > webLimits.bodyBytes) return reply(413, { error: "bad_request" });
  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return reply(400, { error: "bad_request" });
  }
  const parsed = parseWebRequest(body);
  if ("error" in parsed) {
    const message = parsed.error === "message_too_long" ? `A mensagem é demasiado longa (máximo ${webLimits.messageChars} caracteres).` : parsed.error === "message_missing" ? "Escreva uma mensagem." : "Pedido inválido.";
    return reply(400, { error: parsed.error, message });
  }

  // The page's own switch (the bot's «Ligado» is its WhatsApp switch, off while no number is paired).
  if (process.env.CHATBOT_WEB_DISABLED === "1") return reply(503, { error: "unavailable", message: unavailable });

  let client: SupabaseClient;
  try {
    client = createServiceClient();
  } catch {
    return reply(503, { error: "unavailable", message: unavailable });
  }

  const now = Date.now();
  const visitor = visitorKey(clientIp(request));
  const limits = visitorLimitsFrom(process.env);
  let limited;
  try {
    limited = await takeWebSlot(databaseAttempts(client), visitor, now, limits);
  } catch (error) {
    console.error("[chatbot-web] limits:", error instanceof Error ? error.message : error);
    limited = await takeWebSlot(fallbackAttempts, visitor, now, limits);
  }
  if (limited) return reply(429, { error: "busy", message: busyMessage });

  let bot;
  try {
    bot = await webBot(client);
  } catch (error) {
    console.error("[chatbot-web] bot:", error instanceof Error ? error.message : error);
    return reply(503, { error: "unavailable", message: unavailable });
  }
  if (!bot) return reply(503, { error: "unavailable", message: unavailable });

  // The bot's own choice: Groq's free tier (test AI) when it is on for this bot and on this server, the AI for
  // clients (Mistral) only with the owner's paid switch; any limit or error → the free answers.
  const provider = chooseProvider({ choice: bot.row.answer_provider, paidAllowed: bot.row.paid_answers_allowed === true, env: process.env });
  try {
    const result = await respond(
      {
        bot: { ...bot.profile, settings: { ...bot.profile.settings, enabled: true } },
        conversation: parsed.conversation,
        history: historyFrom(parsed.turns, now),
        message: { body: parsed.message, at: now },
        now: new Date(now),
        index: bot.index,
        conversationKey: `web:${parsed.session}`,
        channel: "web",
        inbox: false,
      },
      provider,
    );
    return reply(200, { replies: result.replies, conversation: result.conversation });
  } catch (error) {
    console.error("[chatbot-web] respond:", error instanceof Error ? error.message : error);
    return reply(500, { error: "failed", message: "Não consegui responder agora. Tente novamente." });
  }
}

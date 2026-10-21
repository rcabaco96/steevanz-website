// The Steevanz assistant (the site chat on /chat-teste, phase D): its answers and document are written from the
// site's content by src/lib/chatbot/steevanz.ts, so they say what the site says. Free: no AI, no paid API.
//
//   node scripts/chatbot/steevanz-bot.mjs            writes the quality-gate fixtures (tests/fixtures/steevanz*.{txt,json})
//   node scripts/chatbot/steevanz-bot.mjs --apply    also creates/updates the bot's rows in Supabase (data only, no
//                                                    migration): the «Steevanz» bot, its answers and its document
//
// Run it again after changing products, prices or product copy. With --apply it reads NEXT_PUBLIC_SUPABASE_URL and
// SUPABASE_SERVICE_ROLE_KEY from .env.local (never printed). The bot's own settings chosen later in the admin
// (who writes the answers, the WhatsApp on/off) are kept; a new bot starts on Groq's free tier. The site chat
// answers whatever the WhatsApp switch says (CHATBOT_WEB_DISABLED=1 turns the page off).
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parseArgs } from "node:util";
import { createClient } from "@supabase/supabase-js";
import { splitIntoChunks } from "../../src/lib/chatbot/documents.ts";
import { steevanzBot, steevanzDocument, steevanzDocumentTitle, steevanzEntries, steevanzHoursEntry } from "../../src/lib/chatbot/steevanz.ts";

const root = join(import.meta.dirname, "../..");
const { values: args } = parseArgs({ options: { apply: { type: "boolean", default: false } }, strict: true });

const document = steevanzDocument();
const entries = [steevanzHoursEntry, ...steevanzEntries()];
writeFileSync(join(root, "tests/fixtures/steevanz.txt"), document);
writeFileSync(join(root, "tests/fixtures/steevanz-entries.json"), `${JSON.stringify(entries, null, 2)}\n`);
console.log(`Fixtures: ${entries.length} respostas, documento com ${document.length} caracteres.`);
if (!args.apply) process.exit(0);

function loadEnv() {
  const file = join(root, ".env.local");
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
  }
}
loadEnv();
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !serviceKey) {
  console.error("Falta NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY no .env.local.");
  process.exit(1);
}
const db = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
const fail = (error, context) => {
  if (error) throw new Error(`${context}: ${error.message}`);
};

// The bot: CHATBOT_WEB_TEST_BOT_ID, or the one named «Steevanz»; created for the first admin account when missing.
let botId = process.env.CHATBOT_WEB_TEST_BOT_ID || null;
if (!botId) {
  const { data, error } = await db.from("chatbot_bots").select("id").eq("name", steevanzBot.name).limit(2);
  fail(error, "find bot");
  if (data.length > 1) throw new Error("Há mais de um assistente chamado «Steevanz»: defina CHATBOT_WEB_TEST_BOT_ID.");
  botId = data[0]?.id ?? null;
}
const fields = { ...steevanzBot, languages: [...steevanzBot.languages] };
if (botId) {
  const { error } = await db.from("chatbot_bots").update(fields).eq("id", botId);
  fail(error, "update bot");
} else {
  const adminEmail = (process.env.ADMIN_EMAILS ?? "").split(",")[0]?.trim().toLowerCase();
  if (!adminEmail) throw new Error("Falta ADMIN_EMAILS no .env.local (o dono do assistente).");
  const { data: owner, error: ownerError } = await db.from("profiles").select("id").ilike("email", adminEmail).maybeSingle();
  fail(ownerError, "owner");
  if (!owner) throw new Error("A conta do administrador não tem perfil no Supabase.");
  const { data, error } = await db
    .from("chatbot_bots")
    .insert({ ...fields, owner_id: owner.id, answer_provider: "groq", retention_days: 30 })
    .select("id")
    .single();
  fail(error, "create bot");
  botId = data.id;
}

// Its answers: replaced as a whole (they are generated; edit the site, not the rows).
{
  const { error } = await db.from("chatbot_knowledge").delete().eq("bot_id", botId);
  fail(error, "clear answers");
  const rows = entries.map((entry, position) => ({ bot_id: botId, ...entry, language: "pt", active: true, position }));
  const { error: insertError } = await db.from("chatbot_knowledge").insert(rows);
  fail(insertError, "insert answers");
}

// Its document: the previous version with the same title is replaced.
{
  const { error } = await db.from("chatbot_documents").delete().eq("bot_id", botId).eq("title", steevanzDocumentTitle);
  fail(error, "clear document");
  const chunks = splitIntoChunks(document, steevanzDocumentTitle);
  const { data, error: insertError } = await db
    .from("chatbot_documents")
    .insert({
      bot_id: botId,
      title: steevanzDocumentTitle,
      source: "text",
      kind: "text",
      language: "pt",
      char_count: chunks.reduce((sum, chunk) => sum + chunk.body.length, 0),
      chunk_count: chunks.length,
    })
    .select("id")
    .single();
  fail(insertError, "insert document");
  const rows = chunks.map((chunk, position) => ({ document_id: data.id, bot_id: botId, position, heading: chunk.heading.slice(0, 500), body: chunk.body.slice(0, 4000) }));
  const { error: chunkError } = await db.from("chatbot_document_chunks").insert(rows);
  if (chunkError) {
    await db.from("chatbot_documents").delete().eq("id", data.id);
    fail(chunkError, "insert document sections");
  }
}
console.log(`Assistente Steevanz atualizado: ${botId} (${entries.length} respostas, 1 documento).`);

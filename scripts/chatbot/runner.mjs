// Steevanz WhatsApp assistant runner. open-wa is ONLY for the owner's tests (owner, 2026-10-20);
// paying clients will use the official WhatsApp Cloud API. Keeps one WhatsApp session open on this
// computer, answers with the engine in src/lib/chatbot and writes to Supabase. Started ONLY by hand:
//
//   node scripts/chatbot/runner.mjs --bot <bot id>           (default: listens only, never sends)
//   node scripts/chatbot/runner.mjs --bot <bot id> --reply   (replies, only to CHATBOT_ALLOWLIST)
//
// Pilot safety, all on by default (docs/chatbot/PILOTO.md): listen-only unless --reply; with --reply
// it refuses to start without CHATBOT_TEST_NUMBER and CHATBOT_ALLOWLIST in .env.local; it stops if
// the paired number is not the test number; it answers and stores only allowlisted numbers; never
// writes first, never to groups; 3-8 s typing, at most 10 replies/hour and 50/day; the admin's
// «Desligar respostas» (or a PAUSE file in the session folder) stops every send within seconds.
import { closeSync, existsSync, mkdirSync, openSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { homedir, hostname } from "node:os";
import { join } from "node:path";
import { parseArgs } from "node:util";
import { createClient } from "@supabase/supabase-js";
import { chooseProvider } from "../../src/lib/chatbot/llm/providers.ts";
import { pilotPacing } from "../../src/lib/chatbot/pacing.ts";
import { createRuntime } from "../../src/lib/chatbot/runtime.ts";
import { ChatbotNotReadyError, loadBotProfile, SupabaseChatbotStore, writeSession } from "../../src/lib/chatbot/supabase-store.ts";
import { createCloudApiAdapter } from "./adapters/cloud-api.mjs";
import { createOpenWaAdapter } from "./adapters/open-wa.mjs";

function loadEnv() {
  const file = join(import.meta.dirname, "../../.env.local");
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
  }
}
loadEnv();

const { values: args } = parseArgs({
  options: {
    bot: { type: "string" },
    reply: { type: "boolean", default: false },
    // Kept for clarity in commands: listening only is already the default.
    "listen-only": { type: "boolean", default: false },
    visible: { type: "boolean", default: false },
  },
  strict: true,
});

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
if (!args.bot || !uuid.test(args.bot)) {
  console.error("Indique o assistente: node scripts/chatbot/runner.mjs --bot <id do assistente no /admin/chatbot>");
  process.exit(1);
}
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !serviceKey) {
  console.error("Falta NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY no .env.local.");
  process.exit(1);
}

const botId = args.bot;
const listenOnly = !args.reply || args["listen-only"];
const digitsOf = (value) => (value ?? "").replace(/\D/g, "");
// Numbers live only in .env.local (never in git): the test number and who may get replies.
const testNumber = digitsOf(process.env.CHATBOT_TEST_NUMBER);
const allowlist = (process.env.CHATBOT_ALLOWLIST ?? "").split(",").map(digitsOf).filter((digits) => digits.length >= 8);
if (!listenOnly && (!testNumber || !allowlist.length)) {
  console.error("Para responder (--reply) defina no .env.local CHATBOT_TEST_NUMBER (o número de teste) e CHATBOT_ALLOWLIST (os números que podem receber respostas, separados por vírgulas). Ver docs/chatbot/PILOTO.md.");
  process.exit(1);
}
const siteUrl = (process.env.CHATBOT_SITE_URL ?? "https://www.steevanz.com").replace(/\/+$/, "");
const baseDir = process.env.CHATBOT_DATA_DIR ?? join(homedir(), ".steevanz-chatbot");
const sessionDir = join(baseDir, botId);
const runnerId = hostname();
const log = (line) => console.log(`${new Date().toISOString().slice(11, 19)} ${line}`);

// --- One runner per bot on this computer -------------------------------------------------------
mkdirSync(sessionDir, { recursive: true });
const lockFile = join(sessionDir, "runner.lock");
try {
  const fd = openSync(lockFile, "wx");
  writeFileSync(fd, String(process.pid));
  closeSync(fd);
} catch {
  console.error(`Este assistente já parece estar a correr neste computador (${lockFile}). Se não estiver, apague esse ficheiro.`);
  process.exit(1);
}
const releaseLock = () => {
  try {
    unlinkSync(lockFile);
  } catch {}
};

const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });

let loaded;
try {
  loaded = await loadBotProfile(supabase, botId, siteUrl);
} catch (error) {
  releaseLock();
  if (error instanceof ChatbotNotReadyError) {
    console.error("A base de dados ainda não tem as tabelas do assistente (migração 20261020200000_chatbot.sql por aprovar).");
    process.exit(1);
  }
  throw error;
}
if (!loaded) {
  releaseLock();
  console.error(`Não há nenhum assistente com o id ${botId}.`);
  process.exit(1);
}

const { row } = loaded;
log(`Assistente «${row.name}» (${row.kind}) · canal ${row.channel_provider} · ${row.enabled ? "respostas ligadas no admin" : "respostas DESLIGADAS no admin"}`);
log(
  row.answer_provider === "ollama"
    ? `Respostas: IA de teste local (Ollama em ${process.env.OLLAMA_URL?.trim() || "http://127.0.0.1:11434"}, modelo ${process.env.CHATBOT_OLLAMA_MODEL?.trim() || "qwen2.5:7b"}); se falhar, respostas gratuitas.`
    : row.answer_provider === "groq"
      ? `Respostas: IA de teste (Groq, grátis, modelo ${process.env.CHATBOT_GROQ_MODEL?.trim() || "openai/gpt-oss-120b"})${process.env.CHATBOT_GROQ_ENABLED?.trim() === "1" && process.env.GROQ_API_KEY?.trim() ? "" : " — DESLIGADA aqui (falta CHATBOT_GROQ_ENABLED=1 ou GROQ_API_KEY)"}; se falhar ou atingir o limite, respostas gratuitas.`
      : row.answer_provider === "real"
        ? row.paid_answers_allowed
          ? `Respostas: IA para clientes (Mistral, UE, modelo ${process.env.CHATBOT_MISTRAL_MODEL?.trim() || "mistral-small-latest"})${process.env.MISTRAL_API_KEY?.trim() ? "" : " — DESLIGADA aqui (falta MISTRAL_API_KEY)"}; se falhar ou atingir o limite, respostas gratuitas.`
          : "Respostas: IA para clientes escolhida, mas a IA paga não está autorizada pelo dono — respostas gratuitas (sem IA)."
        : "Respostas: gratuitas, só com a informação do negócio (sem IA).",
);
log(listenOnly ? "Modo: SÓ A OUVIR (não envia nada a ninguém)." : `Modo: responde só a ${allowlist.length} número(s) da lista; máx. 10 respostas/hora e 50/dia.`);

const adapter =
  row.channel_provider === "cloud-api"
    ? createCloudApiAdapter()
    : createOpenWaAdapter({
        sessionId: `steevanz-${botId}`,
        sessionDataPath: sessionDir,
        headless: !args.visible,
        executablePath: process.env.CHROME_PATH || undefined,
        licenseKey: process.env.OPENWA_LICENSE_KEY || undefined,
        log,
      });

// Listening only (the default): the adapter never sends (pairing tests without answering anyone).
const channel = listenOnly
  ? {
      ...adapter,
      kind: adapter.kind,
      start: (handlers) => adapter.start(handlers),
      stop: () => adapter.stop(),
      sendText: async (chatId, text) => {
        log(`[só a ouvir] não enviado para ${chatId}: ${text.slice(0, 80)}`);
        return { messageId: `listen-only-${Date.now()}-${Math.random()}` };
      },
      simulateTyping: undefined,
    }
  : adapter;

const pauseFile = join(sessionDir, "PAUSE");
/** Kill switch: replies off in the admin, a PAUSE file in the session folder, or listening only. */
const canSend = () => !listenOnly && loaded.row.enabled && !existsSync(pauseFile);

const store = new SupabaseChatbotStore(supabase);
const runtime = createRuntime({
  bot: loaded.profile,
  adapter: channel,
  store,
  pacing: pilotPacing,
  // Only the owner's list is answered or stored, also while listening.
  allowlist,
  canSend,
  // The free mock unless chosen otherwise in the admin. «IA para clientes (Mistral, UE)» only when the
  // owner also authorised paid answers for this bot (paid_answers_allowed); «IA de teste local (Ollama)»
  // answered by Ollama on this computer (ollama serve); «IA de teste (Groq, grátis)» on Groq's free
  // tier, capped. Any problem, limit, timeout or Ollama not running → the free answers.
  provider: chooseProvider({ choice: row.answer_provider, paidAllowed: row.paid_answers_allowed, env: process.env }),
  log,
  // Pilot: no WhatsApp alerts (that would be the bot writing first); the hand-off shows in the admin.
  onHandoff: ({ handoff }) => log(`Passagem para a equipa (${handoff.reason}${handoff.urgent ? ", URGENTE" : ""}): ver /admin/chatbot › Conversas.`),
});

const session = (patch) => writeSession(supabase, botId, { runnerId, ...patch }).catch((error) => log(`Estado da sessão não gravado: ${error.message}`));

await session({ state: "starting", qr: null, message: null });

let stopping = false;
async function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  log("A desligar…");
  clearInterval(refresh);
  clearInterval(heartbeat);
  clearInterval(prune);
  try {
    await adapter.stop();
  } catch {}
  await session({ state: "stopped", qr: null, message: null });
  releaseLock();
  process.exit(code);
}

// New knowledge or settings from the admin (and the replies on/off switch), every 15 seconds.
const refresh = setInterval(async () => {
  try {
    const next = await loadBotProfile(supabase, botId, siteUrl);
    if (next) {
      // The owner's paid-answers switch counts too: turning it off stops Mistral within 15 s.
      const providerChanged = next.row.answer_provider !== loaded.row.answer_provider || next.row.paid_answers_allowed !== loaded.row.paid_answers_allowed;
      loaded = next;
      runtime.updateBot(next.profile, providerChanged ? chooseProvider({ choice: next.row.answer_provider, paidAllowed: next.row.paid_answers_allowed, env: process.env }) : undefined);
    }
  } catch (error) {
    log(`Não consegui atualizar o conhecimento: ${error instanceof Error ? error.message : error}`);
  }
}, 15_000);

let lastState = "starting";
const heartbeat = setInterval(() => void session({ state: lastState }), 30_000);

// RGPD retention, once a day (and once at start-up).
const runPrune = async () => {
  const { data, error } = await supabase.rpc("chatbot_prune");
  if (error) log(`Limpeza de mensagens antigas falhou: ${error.message}`);
  else if (data) log(`Limpeza: ${data} mensagens antigas apagadas.`);
};
const prune = setInterval(() => void runPrune(), 24 * 60 * 60_000);
void runPrune();

process.on("SIGINT", () => void stop(0));
process.on("SIGTERM", () => void stop(0));

try {
  await adapter.start({
    onStatus: (status) => {
      lastState = status.state === "starting" ? "starting" : status.state;
      if (status.state === "qr") {
        log("À espera do QR: abra o WhatsApp do negócio > Dispositivos ligados > Ligar um dispositivo (o QR também aparece no /admin/chatbot).");
        void session({ state: "qr", qr: status.qr, message: null });
      } else if (status.state === "connected") {
        // Never run on a number other than the test number.
        if (testNumber && (!status.number || digitsOf(status.number) !== testNumber)) {
          log("O número ligado NÃO é o número de teste (CHATBOT_TEST_NUMBER). A desligar sem responder a ninguém.");
          void session({ state: "error", qr: null, message: "Número ligado diferente do número de teste: desligado." }).then(() => stop(1));
          return;
        }
        log("Ligado.");
        void session({ state: "connected", qr: null, number: status.number ? `…${digitsOf(status.number).slice(-3)}` : null, message: null });
      } else if (status.state === "disconnected") {
        log(`Desligado: ${status.reason}`);
        void session({ state: "disconnected", qr: null, message: status.reason });
      } else if (status.state === "error") {
        void session({ state: "error", message: status.message.slice(0, 500) });
      }
    },
    onMessage: async (message) => {
      const outcome = await runtime.handle(message);
      const who = message.chatId.replace(/\d(?=\d{3})/g, "•");
      if (outcome.status === "not_allowed") log(`mensagem de ${who}: fora da lista, ignorada (nem guardada nem respondida)`);
      else if (outcome.status !== "own_echo") log(`${message.fromOwner ? "dono" : "contacto"} ${who}: ${outcome.status}`);
    },
  });
} catch (error) {
  const text = error instanceof Error ? error.message : String(error);
  log(`Não arrancou: ${text}`);
  await session({ state: "error", message: text.slice(0, 500) });
  releaseLock();
  process.exit(1);
}

// Steevanz WhatsApp assistant runner: keeps one business's WhatsApp session open on this computer
// (later on the free Oracle server), answers its customers with the engine in src/lib/chatbot and
// writes everything to Supabase. Started ONLY by hand (never by the site, never automatically):
//
//   node scripts/chatbot/runner.mjs --bot <bot id>                 (open-wa, replies on)
//   node scripts/chatbot/runner.mjs --bot <bot id> --listen-only   (pairs and logs, never sends)
//
// Read README.md in this folder and docs/chatbot/ARCHITECTURE.md first. Costs nothing: answers come
// from the free mock (no language model is called), and open-wa uses the business's own WhatsApp.
import { closeSync, existsSync, mkdirSync, openSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { homedir, hostname } from "node:os";
import { join } from "node:path";
import { parseArgs } from "node:util";
import { createClient } from "@supabase/supabase-js";
import { chooseProvider } from "../../src/lib/chatbot/llm/providers.ts";
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
const listenOnly = args["listen-only"];
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
log(`Assistente «${row.name}» (${row.kind}) · canal ${row.channel_provider} · ${row.enabled ? "ligado" : "DESLIGADO no admin (não responde)"}${listenOnly ? " · só a ouvir" : ""}`);

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

// --listen-only: the adapter never sends (pairing tests on a real number without answering anyone).
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

const store = new SupabaseChatbotStore(supabase);
const runtime = createRuntime({
  bot: loaded.profile,
  adapter: channel,
  store,
  // The free mock unless the owner chose a real model AND allowed paid answers on the site; even
  // then the real provider is a placeholder that refuses (phase 2) and the mock answers.
  provider: chooseProvider({ choice: row.answer_provider, paidAllowed: row.paid_answers_allowed }),
  log,
  onHandoff: async ({ chatId, contactName, handoff }) => {
    log(`Passagem para a equipa (${handoff.reason}${handoff.urgent ? ", URGENTE" : ""}) · ${contactName ?? chatId}`);
    // Optional alert on the owner's own WhatsApp (a contact of the business, never a customer).
    const digits = (loaded.row.alert_number ?? "").replace(/\D/g, "");
    if (!digits || listenOnly) return;
    const alert = `${handoff.urgent ? "URGENTE · " : ""}Assistente Steevanz: conversa passada para si (${contactName ?? chatId}).\n${handoff.summary}`;
    try {
      await adapter.sendText(`${digits}@c.us`, alert);
    } catch (error) {
      log(`Não consegui avisar o dono: ${error instanceof Error ? error.message : error}`);
    }
  },
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

// New knowledge or settings from the admin, every minute.
const refresh = setInterval(async () => {
  try {
    const next = await loadBotProfile(supabase, botId, siteUrl);
    if (next) {
      loaded = next;
      runtime.updateBot(next.profile);
    }
  } catch (error) {
    log(`Não consegui atualizar o conhecimento: ${error instanceof Error ? error.message : error}`);
  }
}, 60_000);

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
        log(`Ligado${status.number ? ` ao número ${status.number}` : ""}.`);
        void session({ state: "connected", qr: null, number: status.number, message: null });
      } else if (status.state === "disconnected") {
        log(`Desligado: ${status.reason}`);
        void session({ state: "disconnected", qr: null, message: status.reason });
      } else if (status.state === "error") {
        void session({ state: "error", message: status.message.slice(0, 500) });
      }
    },
    onMessage: async (message) => {
      const outcome = await runtime.handle(message);
      if (outcome.status !== "own_echo") log(`${message.fromOwner ? "dono" : "cliente"} ${message.chatId.replace(/\d(?=\d{3})/g, "•")}: ${outcome.status}`);
    },
  });
} catch (error) {
  const text = error instanceof Error ? error.message : String(error);
  log(`Não arrancou: ${text}`);
  await session({ state: "error", message: text.slice(0, 500) });
  releaseLock();
  process.exit(1);
}

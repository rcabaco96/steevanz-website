// Offline simulator of the WhatsApp assistant: the whole flow (language, rules, knowledge, hand-off,
// pacing) with a fake WhatsApp and memory storage. No WhatsApp, no internet, no paid calls.
//
//   node scripts/chatbot/simulate.mjs                         (example restaurant, interactive)
//   node scripts/chatbot/simulate.mjs --demo alojamento       (example holiday rental, 2 properties)
//   node scripts/chatbot/simulate.mjs --script "Olá|A que horas abrem?|Quero falar com alguém"
//   node scripts/chatbot/simulate.mjs --bot <id>              (a real bot's knowledge, read-only from Supabase)
//
// In the interactive mode: /dono <texto> = the owner answers from the phone, /devolver = the team
// gives the chat back, /novo = a new customer, /estado = the conversation's memory, /sair.
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { createInterface } from "node:readline/promises";
import { parseArgs } from "node:util";
import { FakeAdapter } from "../../src/lib/chatbot/adapters.ts";
import { demoBots } from "../../src/lib/chatbot/demo.ts";
import { createRuntime } from "../../src/lib/chatbot/runtime.ts";
import { MemoryStore } from "../../src/lib/chatbot/store.ts";

const { values: args } = parseArgs({
  options: {
    demo: { type: "string", default: "restaurante" },
    bot: { type: "string" },
    script: { type: "string" },
  },
  strict: true,
});

async function loadBot() {
  if (!args.bot) {
    const bot = demoBots[args.demo];
    if (!bot) throw new Error(`Exemplo desconhecido: ${args.demo} (use: ${Object.keys(demoBots).join(", ")})`);
    return bot;
  }
  // A real bot's knowledge, read-only (a free database read; nothing is written).
  const file = join(import.meta.dirname, "../../.env.local");
  if (existsSync(file)) {
    for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
    }
  }
  const { createClient } = await import("@supabase/supabase-js");
  const { loadBotProfile } = await import("../../src/lib/chatbot/supabase-store.ts");
  const client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
  const loaded = await loadBotProfile(client, args.bot, process.env.CHATBOT_SITE_URL ?? "https://www.steevanz.com");
  if (!loaded) throw new Error(`Não há nenhum assistente com o id ${args.bot}.`);
  // Simulating a switched-off bot still shows its answers.
  return { ...loaded.profile, settings: { ...loaded.profile.settings, enabled: true } };
}

const bot = await loadBot();
const adapter = new FakeAdapter();
const store = new MemoryStore();
const runtime = createRuntime({
  bot,
  adapter,
  store,
  sleep: async () => {},
  onHandoff: ({ handoff }) => console.log(`\n  ⚑ PASSAGEM PARA A EQUIPA${handoff.urgent ? " (URGENTE)" : ""}\n  ${handoff.summary.replace(/\n/g, "\n  ")}\n`),
});

let customer = 1;
let printed = 0;
const chatId = () => `simulador-${customer}@c.us`;

await adapter.start({ onMessage: (message) => runtime.handle(message).then((outcome) => show(outcome)), onStatus: () => {} });

function show(outcome) {
  for (const sent of adapter.sent.slice(printed)) console.log(`\n  🤖 ${sent.text.replace(/\n/g, "\n     ")}`);
  printed = adapter.sent.length;
  const sources = outcome.result?.sources ?? [];
  if (sources.length) console.log(`     (fonte: ${sources.map((source) => source.heading).join(" · ")})`);
  if (outcome.status === "silent") console.log("  (o assistente fica calado: a equipa tem esta conversa)");
}

async function say(body, fromOwner = false) {
  await adapter.receive({ chatId: chatId(), body, fromOwner, at: Date.now() });
}

console.log(`Simulador do assistente · ${bot.knowledge.businessName} (${bot.knowledge.kind}) · respostas: mock gratuito\n`);

if (args.script) {
  for (const line of args.script.split("|")) {
    console.log(`\n👤 ${line}`);
    await say(line);
  }
  process.exit(0);
}

const rl = createInterface({ input: process.stdin, output: process.stdout });
for (;;) {
  const line = (await rl.question("\n👤 ")).trim();
  if (!line) continue;
  if (line === "/sair") break;
  if (line === "/novo") {
    customer++;
    console.log("  (novo cliente)");
    continue;
  }
  if (line === "/estado") {
    console.log(store.conversations.get(`${bot.id}:${chatId()}`)?.state ?? "(sem conversa)");
    continue;
  }
  if (line === "/devolver") {
    const conversation = store.conversations.get(`${bot.id}:${chatId()}`);
    if (conversation) conversation.state = { ...conversation.state, mode: "bot", handoffReason: null };
    console.log("  (conversa devolvida ao assistente)");
    continue;
  }
  if (line.startsWith("/dono ")) {
    await say(line.slice(6), true);
    console.log("  (o dono respondeu pelo telemóvel: o assistente pausa nesta conversa)");
    continue;
  }
  await say(line);
}
rl.close();

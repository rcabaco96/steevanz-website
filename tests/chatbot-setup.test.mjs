// «Configurar em 5 passos» (src/lib/chatbot/setup.ts): reading price lists and timetables pasted from
// WhatsApp/Word, the questions suggested per sector, the completeness score, and — the point of the setup —
// bots configured ONLY through it (no document) answering prices, hours and frequent questions correctly,
// asking back on «Quanto custa?», and never inventing. Free answers and what a test AI receives (fake HTTP
// client: no request leaves the test).
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { cutByOldVersion } from "../src/lib/chatbot/documents.ts";
import { respond } from "../src/lib/chatbot/engine.ts";
import { askedDate } from "../src/lib/chatbot/hours.ts";
import { detectIntents } from "../src/lib/chatbot/intents.ts";
import { createGroqProvider } from "../src/lib/chatbot/llm/groq.ts";
import { CallLimiter, TokenBudget } from "../src/lib/chatbot/llm/limiter.ts";
import { mockProvider } from "../src/lib/chatbot/llm/mock.ts";
import { fixedMessages } from "../src/lib/chatbot/messages.ts";
import { botProfileFrom } from "../src/lib/chatbot/rows.ts";
import {
  findSuggestedFaq,
  parseHours,
  parsePriceList,
  serializeHours,
  serializePriceList,
  setupFactsFrom,
  setupKeywords,
  setupKnowledge,
  setupProgress,
  setupQuestions,
  suggestedFaqs,
  suggestedTestQuestions,
} from "../src/lib/chatbot/setup.ts";
import { chatbotBusinessKinds, newConversationState } from "../src/lib/chatbot/types.ts";
import { normalize } from "../src/lib/chatbot/text.ts";

const today = "2026-10-21";
const item = (name, euros, extra = {}) => ({ name, priceCents: euros === null ? null : Math.round(euros * 100), priceFrom: false, durationMinutes: null, ...extra });

describe("setup: price lists pasted from WhatsApp, Word, Instagram", () => {
  const cases = [
    ["Corte 16€", [item("Corte", 16)]],
    ["Barba - 10 €", [item("Barba", 10)]],
    ["Degradê 18 euros 40 min", [item("Degradê", 18, { durationMinutes: 40 })]],
    ["*Corte + barba* ........ 22,50€", [item("Corte + barba", 22.5)]],
    ["Coloração: desde 35 €", [item("Coloração", 35, { priceFrom: true })]],
    ["Coloração a partir de 35€", [item("Coloração", 35, { priceFrom: true })]],
    ["1. Manicure 12€ (45min)", [item("Manicure", 12, { durationMinutes: 45 })]],
    ["Pedicure — 1h — 20 €", [item("Pedicure", 20, { durationMinutes: 60 })]],
    ["Madeixas 1h30 45€", [item("Madeixas", 45, { durationMinutes: 90 })]],
    ["Brushing 15 eur", [item("Brushing", 15)]],
    ["€12 Corte criança (até 12 anos)", [item("Corte criança (até 12 anos)", 12)]],
    ["Corte criança (até 12 anos) 12€", [item("Corte criança (até 12 anos)", 12)]],
    ["Corte 16€ | Barba 10€ | Sobrancelhas 6€", [item("Corte", 16), item("Barba", 10), item("Sobrancelhas", 6)]],
    ["Corte 16€, Barba 10€", [item("Corte", 16), item("Barba", 10)]],
    ["Corte, lavagem e brushing 25€", [item("Corte, lavagem e brushing", 25)]],
    ["Corte / barba 20€", [item("Corte / barba", 20)]],
    ["Tranças - sob consulta", [item("Tranças (sob consulta)", null)]],
    ["✂️ Desenho/risco +4€", [item("Desenho/risco (extra)", 4)]],
    ["Alisamento 80-120€", [item("Alisamento", 80, { priceFrom: true })]],
    ["Menu do dia 9,50", [item("Menu do dia", 9.5)]],
    ["Corte 16", [item("Corte", 16)]],
    ["Massagem 60 min 1.200€", [item("Massagem", 1200, { durationMinutes: 60 })]],
    ["Botox capilar 50€ + IVA", [item("Botox capilar", 50)]],
    ["16€ - Corte", [item("Corte", 16)]],
    ["Unhas de gel 25 € 1 hora", [item("Unhas de gel", 25, { durationMinutes: 60 })]],
    ["Penteado\n25€", [item("Penteado", 25)]],
    ["Limpeza de pele\t30,00 €\t50 min", [item("Limpeza de pele", 30, { durationMinutes: 50 })]],
    ["Bacalhau à Brás ... 14,50 EUR", [item("Bacalhau à Brás", 14.5)]],
    ["• Pastel de nata 1,50€", [item("Pastel de nata", 1.5)]],
  ];
  for (const [text, expected] of cases) {
    it(`reads «${text.replace(/\n/g, " ⏎ ")}»`, () => {
      const result = parsePriceList(text);
      assert.deepEqual(result.items, expected);
      assert.deepEqual(result.skipped, []);
    });
  }

  it("skips titles silently and reports lines without a price instead of guessing one", () => {
    const result = parsePriceList("PREÇÁRIO 2026\nCABELO\nCorte 16€\nBarba:\nBarba à navalha 15€\nTodos os serviços incluem lavagem\nCorte criança até 12\n");
    assert.deepEqual(result.items, [item("Corte", 16), item("Barba à navalha", 15)]);
    assert.deepEqual(result.skipped, ["Todos os serviços incluem lavagem", "Corte criança até 12"]);
  });

  it("reads a whole messy WhatsApp list and writes it back in a canonical form that reads the same", () => {
    const pasted = [
      "*TABELA DE PREÇOS* 💈",
      "",
      "✂️ Corte clássico ........ 16€",
      "- Degradê 18 euros (40 min)",
      "• Barba à navalha — 15 € — 30min",
      "Corte + barba 28€",
      "Coloração: desde 35 €",
      "Tranças - sob consulta",
      "Desenho +4€",
    ].join("\n");
    const result = parsePriceList(pasted);
    assert.equal(result.items.length, 7);
    const canonical = serializePriceList(result.items).replace(/\u00a0/g, " ");
    assert.match(canonical, /^Corte clássico — 16 €$/m);
    assert.match(canonical, /^Degradê — 18 € · 40 min$/m);
    assert.match(canonical, /^Coloração — desde 35 €$/m);
    assert.match(canonical, /^Tranças \(sob consulta\)$/m);
    assert.doesNotMatch(canonical, /IVA/);
    const again = parsePriceList(canonical);
    assert.deepEqual(again.items, result.items);
    assert.deepEqual(again.skipped, []);
  });
});

describe("setup: opening hours pasted as text", () => {
  const slots = (week) => week.map((slot) => `${slot.weekday} ${slot.opens}-${slot.closes}`);
  const cases = [
    ["Segunda a sexta: 9h-19h", ["1 09:00-19:00", "2 09:00-19:00", "3 09:00-19:00", "4 09:00-19:00", "5 09:00-19:00"]],
    ["Seg-Sex 09:00-13:00 e 14:30-19:00\nSáb. 10h às 13h", ["1 09:00-13:00", "1 14:30-19:00", "2 09:00-13:00", "2 14:30-19:00", "3 09:00-13:00", "3 14:30-19:00", "4 09:00-13:00", "4 14:30-19:00", "5 09:00-13:00", "5 14:30-19:00", "6 10:00-13:00"]],
    ["2ª a 6ª das 9h às 19h", ["1 09:00-19:00", "2 09:00-19:00", "3 09:00-19:00", "4 09:00-19:00", "5 09:00-19:00"]],
    ["Segunda a sexta:\n9h - 19h", ["1 09:00-19:00", "2 09:00-19:00", "3 09:00-19:00", "4 09:00-19:00", "5 09:00-19:00"]],
    ["Mon-Fri 9am-6pm\nSat 10am-2pm", ["1 09:00-18:00", "2 09:00-18:00", "3 09:00-18:00", "4 09:00-18:00", "5 09:00-18:00", "6 10:00-14:00"]],
    ["Fins de semana 10-14\nDias úteis 9-18", ["0 10:00-14:00", "1 09:00-18:00", "2 09:00-18:00", "3 09:00-18:00", "4 09:00-18:00", "5 09:00-18:00", "6 10:00-14:00"]],
    ["Segunda, quarta e sexta: 10-18", ["1 10:00-18:00", "3 10:00-18:00", "5 10:00-18:00"]],
    ["Sexta a domingo 18h-02h", ["0 18:00-23:59", "5 18:00-23:59", "6 18:00-23:59"]],
  ];
  for (const [text, expected] of cases) {
    it(`reads «${text.replace(/\n/g, " ⏎ ")}»`, () => {
      const result = parseHours(text, today);
      assert.deepEqual(slots(result.hours), expected);
      assert.deepEqual(result.skipped, []);
    });
  }

  it("lets a later line win for its days, and reads closed days and dates", () => {
    const result = parseHours("Horário:\nTodos os dias 12h–15h / 19h–23h\nTerça: encerrado\nFechado a 25/12 (Natal)\nEncerrado 1 de janeiro - Ano Novo", today);
    assert.ok(!result.hours.some((slot) => slot.weekday === 2));
    assert.deepEqual(result.closedDays, [2]);
    assert.equal(result.hours.length, 12);
    assert.deepEqual(result.closures, [
      { day: "2026-12-25", reason: "Natal" },
      { day: "2027-01-01", reason: "Ano Novo" },
    ]);
    assert.deepEqual(result.skipped, []);
  });

  it("reports what it can't read", () => {
    const result = parseHours("Segunda a sexta 9h-19h\nAbrimos quando o mar deixa", today);
    assert.deepEqual(result.skipped, ["Abrimos quando o mar deixa"]);
  });

  it("writes the week and closures canonically and reads them back the same", () => {
    const read = parseHours("Terça a sábado 10h-13h e 14h-19h\nDomingo e segunda fechado\nFechado a 24/12 (Consoada)", today);
    const canonical = serializeHours(read.hours, read.closures).replace(/\u00a0/g, " ");
    assert.match(canonical, /^Segunda-feira: fechado$/m);
    assert.match(canonical, /^Terça-feira: 10:00–13:00 e 14:00–19:00$/m);
    assert.match(canonical, /^Fechado a 24\/12\/2026 \(Consoada\)$/m);
    const again = parseHours(canonical, today);
    assert.deepEqual(again.hours, read.hours);
    assert.deepEqual(again.closures, read.closures);
    assert.deepEqual(again.skipped, []);
  });

  it("reads explicit dates in a customer's message («dia 25 de dezembro», «25/12», «no Natal»)", () => {
    const now = new Date("2026-10-21T12:30:00Z");
    assert.equal(askedDate("Abrem no dia 25 de dezembro?", "Europe/Lisbon", now)?.date, "2026-12-25");
    assert.equal(askedDate("Estão abertos a 25/12?", "Europe/Lisbon", now)?.date, "2026-12-25");
    assert.equal(askedDate("Abrem no Natal?", "Europe/Lisbon", now)?.date, "2026-12-25");
    assert.equal(askedDate("Are you open on December 31?", "Europe/Lisbon", now)?.date, "2026-12-31");
    assert.equal(askedDate("Abrem a 3 de março?", "Europe/Lisbon", now)?.date, "2027-03-03");
    assert.equal(askedDate("Abrem amanhã?", "Europe/Lisbon", now), null);
    assert.equal(askedDate("Quanto custa um corte?", "Europe/Lisbon", now), null);
  });
});

describe("setup: questions suggested per sector", () => {
  for (const kind of chatbotBusinessKinds) {
    it(`${kind}: 8 to 12 questions, each different, with words to find it and an example`, () => {
      const faqs = suggestedFaqs(kind);
      assert.ok(faqs.length >= 8 && faqs.length <= 12, `${faqs.length}`);
      assert.equal(new Set(faqs.map((faq) => faq.id)).size, faqs.length);
      assert.equal(new Set(faqs.map((faq) => normalize(faq.question))).size, faqs.length);
      for (const faq of faqs) {
        assert.ok(faq.keywords.split(",").length >= 1 && faq.example.startsWith("Ex.:"), faq.id);
        assert.equal(findSuggestedFaq(kind, faq.id), faq);
        // A suggested question never trips a safety rule (hand-off, emergency, medical…) on its own.
        const intents = detectIntents(faq.question, kind);
        for (const unsafe of ["human", "complaint", "emergency", "medical", "access_code", "guest_identity", "damage"]) assert.ok(!intents.includes(unsafe), `${faq.id}: ${unsafe}`);
        assert.doesNotMatch(`${faq.question} ${faq.example}`, /NFC|com IVA|IVA \(/);
        // Never the setup's own questions (they have their own steps).
        assert.ok(!Object.values(setupQuestions).some((question) => normalize(question) === normalize(faq.question)), faq.id);
      }
    });

    it(`${kind}: test questions, with the first priced service when there is a list`, () => {
      const plain = suggestedTestQuestions(kind);
      assert.ok(plain.length >= 5);
      const withItems = suggestedTestQuestions(kind, [{ name: "Corte clássico", priceCents: 1600 }]);
      assert.equal(withItems[1], "Corte clássico: quanto custa?");
    });
  }

  it("each answered suggestion is found by its own question with the free answers", async () => {
    for (const kind of chatbotBusinessKinds) {
      const faqs = suggestedFaqs(kind);
      const answers = Object.fromEntries(faqs.map((faq, index) => [faq.id, `Resposta número ${index + 1} do negócio.`]));
      const bot = setupBot({ kind, faqs: answers });
      for (const [index, faq] of faqs.entries()) {
        const result = await ask(bot, faq.question);
        assert.match(result.replies.join("\n"), new RegExp(`Resposta número ${index + 1} do`), `${kind} · ${faq.question} → «${result.replies.join(" ")}»`);
      }
    }
  });
});

describe("setup: completeness", () => {
  const entry = (question, answer = "x", extra = {}) => ({ id: question, kind: "faq", question, answer, active: true, ...extra });

  it("is 0 for a new bot and 100 with everything done", () => {
    assert.equal(setupProgress(setupFactsFrom({ location: false, contact: false, structuredHours: 0, pricedItems: 0, entries: [], documents: 0 })).score, 0);
    const full = setupFactsFrom({
      location: true,
      contact: true,
      structuredHours: 5,
      pricedItems: 3,
      entries: ["a?", "b?", "c?", "d?", "e?"].map((question) => entry(question)),
      documents: 1,
    });
    const progress = setupProgress(full);
    assert.equal(progress.score, 100);
    assert.ok(progress.steps.every((step) => step.done));
  });

  it("counts partial work: half the business details, each answered question, the setup's own entries", () => {
    const facts = setupFactsFrom({
      location: true,
      contact: false,
      structuredHours: 0,
      pricedItems: 0,
      entries: [entry(setupQuestions.hours, "Segunda: fechado", { kind: "info" }), entry(setupQuestions.services, "Corte — 16 €", { kind: "info" }), entry("Têm estacionamento?"), entry("Aceitam cães?"), entry("Vazia?", " "), entry("Parada?", "x", { active: false })],
      documents: 0,
    });
    assert.equal(facts.answeredQuestions, 2);
    const progress = setupProgress(facts);
    // 10 (where) + 20 (hours entry) + 20 (price entry) + 2 × 4 (questions).
    assert.equal(progress.score, 58);
    assert.deepEqual(
      progress.steps.filter((step) => step.done).map((step) => step.id),
      ["hours", "prices"],
    );
  });
});

describe("setup: entries read back into the engine's structured data", () => {
  it("turns the setup's hours and price list into hours, closures and items, and keeps hand-written entries", () => {
    const entries = [
      { id: "h", kind: "info", question: setupQuestions.hours, answer: serializeHours(parseHours("Terça a sexta 10h-20h", today).hours, [{ day: "2026-12-25", reason: "Natal" }]), active: true },
      { id: "s", kind: "info", question: setupQuestions.services, answer: "Corte — 16 €\nColoração — desde 35 € · 90 min", active: true },
      { id: "f", kind: "faq", question: "Têm estacionamento?", answer: "Sim.", active: true },
    ];
    const read = setupKnowledge(entries, today);
    assert.equal(read.hours.length, 4);
    assert.deepEqual(read.closures, [{ day: "2026-12-25", reason: "Natal" }]);
    assert.deepEqual(read.items, [
      { name: "Corte", priceCents: 1600, durationMinutes: null },
      { name: "Coloração", priceCents: 3500, durationMinutes: 90, priceFrom: true },
    ]);
    assert.deepEqual([...read.consumed].sort(), ["h", "s"]);
  });

  it("leaves an hours entry written another way as an ordinary entry (never half-read)", () => {
    const entries = [{ id: "h", kind: "info", question: "Qual é o horário?", answer: "Abrimos de terça a sexta, mas no verão só de manhã.", active: true }];
    const read = setupKnowledge(entries, today);
    assert.equal(read.hours, null);
    assert.equal(read.consumed.size, 0);
  });

  it("uses the setup's hours over the linked Espaço's, and the Espaço's when the setup has none", () => {
    const sources = { siteUrl: "https://www.steevanz.com", hours: [{ weekday: 1, opens: "08:00:00", closes: "12:00:00" }] };
    const withSetup = setupBot({ hours: "Terça a sexta 10h-20h", sources });
    assert.ok(withSetup.knowledge.hours.every((slot) => slot.weekday >= 2 && slot.weekday <= 5));
    const without = setupBot({ hours: null, sources });
    assert.deepEqual(without.knowledge.hours, [{ weekday: 1, opens: "08:00", closes: "12:00" }]);
  });
});

describe("documents stored by the older cutter", () => {
  it("is recognised by its section titles (decorations, sentences), never a current document", () => {
    assert.ok(cutByOldVersion(["Guia › B A R B E A R I A · P O R T O · D E S D E 2 0 1 4 › A equipa tem quatro barbeiros"], "Guia"));
    assert.ok(cutByOldVersion(["Guia › Bem-vindo à nossa casa, esperamos que goste da estadia e volte sempre."], "Guia"));
    assert.ok(!cutByOldVersion(["Guia", "Guia › 1. Quem somos", "Guia › CABELO", "Guia › Horário"], "Guia"));
  });
});

// Bots configured only through the setup ---------------------------------------------------------------

const row = (kind, extra = {}) => ({
  id: `setup-${kind}`,
  owner_id: "owner",
  establishment_id: null,
  video_menu_id: null,
  name: "Negócio de teste",
  kind,
  enabled: true,
  channel_provider: "open-wa",
  whatsapp_number: null,
  tone: "formal",
  languages: ["pt", "en", "es", "fr", "de", "it"],
  default_language: "pt",
  address: null,
  phone: null,
  maps_url: null,
  booking_url: null,
  menu_url: null,
  privacy_url: null,
  time_zone: "Europe/Lisbon",
  properties: [],
  auto_resume_minutes: null,
  answer_provider: "mock",
  paid_answers_allowed: false,
  alert_number: null,
  retention_days: 180,
  created_at: "",
  updated_at: "",
  ...extra,
});

/** The entries the setup's actions write (saveSetupHours, saveSetupServices, saveSetupFaqs), read back like the runner does. */
function setupBot({ kind = "beauty", business = {}, hours = null, closures = [], notes = "", prices = null, faqs = {}, sources = { siteUrl: "https://www.steevanz.com" } }) {
  const entries = [];
  const add = (entryKind, question, answer, keywords) =>
    entries.push({ id: `e${entries.length + 1}`, bot_id: "b", kind: entryKind, question, answer, keywords, property: null, language: null, active: true, position: entries.length, created_at: "", updated_at: "" });
  if (hours) add("info", setupQuestions.hours, serializeHours(parseHours(hours, today).hours, closures), setupKeywords.hours);
  if (notes) add("policy", setupQuestions.holidays, notes, setupKeywords.holidays);
  if (prices) add("info", setupQuestions.services, serializePriceList(parsePriceList(prices).items), setupKeywords.services);
  for (const faq of suggestedFaqs(kind)) if (faqs[faq.id]) add(faq.kind, faq.question, faqs[faq.id], faq.keywords);
  return { ...botProfileFrom(row(kind, business), entries, sources), entryText: entries.map((entry) => entry.answer).join("\n") };
}

// Wednesday 2026-10-21, 13:30 in Lisbon.
const start = Date.parse("2026-10-21T12:30:00Z");

async function ask(bot, body) {
  return respond({ bot, conversation: newConversationState(), history: [], message: { body, at: start }, now: new Date(start) });
}

const barbershop = setupBot({
  kind: "beauty",
  business: { name: "Barbearia do Teste", address: "Rua das Flores 12, Porto", phone: null, booking_url: "https://reservas.example/barbearia", maps_url: "https://maps.example/barbearia" },
  hours: "Terça a sexta 10h-20h\nSábado 9h-18h\nDomingo e segunda: fechado",
  closures: [{ day: "2026-12-25", reason: "Natal" }],
  notes: "Fechamos nos feriados nacionais.",
  prices: "*PREÇOS* 💈\n✂️ Corte clássico ........ 16€\nDegradê 18 euros 40 min\nBarba à navalha - 15 € (30 min)\nCorte + barba 28€\nCorte de criança (até 12 anos) 12€\nColoração: desde 35 €",
  faqs: {
    "walk-in": "Atendemos sem marcação, mas com marcação não espera.",
    payments: "Multibanco, MB WAY e dinheiro.",
    parking: "Há um parque gratuito na rua de trás.",
    kids: "Sim, cortes de criança até aos 12 anos.",
    discounts: "10 % de desconto para estudantes com cartão, de terça a quinta.",
    cancel: "Pode cancelar ou remarcar até 24 horas antes, por mensagem.",
    late: "Com mais de 15 minutos de atraso, pode ter de remarcar.",
  },
});

const restaurant = setupBot({
  kind: "restaurant",
  business: { name: "Tasca do Teste", address: "Largo do Teste 3, Lisboa", phone: "910 000 000" },
  hours: "Terça a domingo 12h-15h e 19h-23h\nSegunda: encerrado",
  prices: "Bacalhau à Brás 14,50€\nPolvo à lagareiro 18€\nArroz de pato 13,50 €\nSalada de grão (vegetariano) 9€\nPastel de nata 1,50€",
  faqs: {
    vegetarian: "Sim, temos sempre pratos vegetarianos, como a salada de grão.",
    allergies: "Indique a alergia ao reservar; temos a lista de alergénios de cada prato.",
    pets: "Sim, na esplanada. Lá dentro só cães de assistência.",
    "kids-menu": "Sim, temos menu infantil e cadeiras de bebé.",
    groups: "Sim, até 30 pessoas, com menu de grupo.",
    terrace: "Sim, com 8 mesas.",
  },
});

const lodging = setupBot({
  kind: "lodging",
  business: { name: "Casa do Teste" },
  faqs: {
    checkin: "A partir das 15:00. Envie-nos a hora prevista de chegada.",
    checkout: "Até às 11:00.",
    parking: "Sim, lugar privado na garagem, incluído.",
    wifi: "Sim, fibra. A rede e a palavra-passe estão no frigorífico.",
    pets: "Não aceitamos animais.",
    smoking: "Só na varanda. Dentro de casa não.",
    towels: "Sim, incluídas. Toalhas de praia também.",
  },
});

/**
 * Dialogues: what the customer writes, what the free answers must (not) say, what the AI must receive.
 * notConfigured: the setup doesn't say it → «Não tenho essa informação» (counted as an invention otherwise).
 */
const dialogues = [
  {
    bot: barbershop,
    name: "«Quanto custa?» first: a question back with real examples, then the option picked",
    turns: [
      { customer: "Quanto custa?", includes: ["^Depende do que procura", "corte clássico \\(16 €\\)", "Qual lhe interessa\\?"], ai: ["Corte clássico — 16 €", "Degradê — 18 €"] },
      { customer: "Quero a segunda opção", includes: ["Degradê — 18 €"], excludes: ["[Ss]egunda-feira", "Corte clássico"] },
    ],
  },
  { bot: barbershop, name: "price of a named service", turns: [{ customer: "Quanto custa um corte?", includes: ["Corte clássico — 16 €"], excludes: ["Degradê"], ai: ["Corte clássico — 16 €"] }] },
  { bot: barbershop, name: "a «desde» price", turns: [{ customer: "Quanto custa a coloração?", includes: ["Coloração — desde 35 €"] }] },
  {
    bot: barbershop,
    name: "a service, its price, how long it takes",
    turns: [
      { customer: "Fazem degradê?", includes: ["Degradê — 18 €"] },
      { customer: "Quanto custa?", includes: ["18 €"], excludes: ["^Depende"] },
      { customer: "E quanto tempo demora?", includes: ["40 min"] },
    ],
  },
  { bot: barbershop, name: "the whole list", turns: [{ customer: "Que serviços têm?", includes: ["Corte clássico — 16 €", "Barba à navalha — 15 € · 30 min", "Coloração — desde 35 €"], ai: ["Corte clássico — 16 €"] }] },
  {
    bot: barbershop,
    name: "tomorrow, then «Quanto custa?» (the owner's test)",
    turns: [
      { customer: "Dá para cortar o cabelo amanhã?", includes: ["10:00", "20:00", "reservas\\.example/barbearia"], excludes: ["€", "Não tenho"], ai: [], system: ["10:00–20:00"] },
      { customer: "Quanto custa?", includes: ["16 €"], excludes: ["Não tenho", "fechad"] },
    ],
  },
  { bot: barbershop, name: "a closed weekday", turns: [{ customer: "Abrem à segunda?", includes: ["[Ss]egunda-feira", "fechados"], excludes: ["10:00"] }] },
  { bot: barbershop, name: "a closed date with its reason", turns: [{ customer: "Abrem no dia 25 de dezembro?", includes: ["25/12", "fechados", "Natal"] }] },
  { bot: barbershop, name: "Christmas by name", turns: [{ customer: "Estão abertos no Natal?", includes: ["fechados", "Natal"] }] },
  { bot: barbershop, name: "Saturday's hours", turns: [{ customer: "Estão abertos no sábado?", includes: ["09:00", "18:00"] }] },
  { bot: barbershop, name: "today, open now", turns: [{ customer: "Até que horas estão abertos hoje?", includes: ["20:00"] }] },
  { bot: barbershop, name: "holidays note", turns: [{ customer: "Fecham nos feriados?", includes: ["feriados nacionais"] }] },
  { bot: barbershop, name: "parking", turns: [{ customer: "Têm estacionamento?", includes: ["parque gratuito"], ai: ["parque gratuito"] }] },
  { bot: barbershop, name: "payments", turns: [{ customer: "Aceitam MB WAY?", includes: ["MB WAY"] }] },
  { bot: barbershop, name: "walk-ins and booking", turns: [{ customer: "Preciso de marcar?", includes: ["sem marcação", "reservas\\.example/barbearia"] }] },
  { bot: barbershop, name: "cancelling", turns: [{ customer: "Posso desmarcar?", includes: ["24 horas"] }] },
  { bot: barbershop, name: "student discount", turns: [{ customer: "Há desconto para estudantes?", includes: ["10 %"] }] },
  { bot: barbershop, name: "late", turns: [{ customer: "E se eu chegar atrasado?", includes: ["15 minutos"] }] },
  { bot: barbershop, name: "address and map", turns: [{ customer: "Onde ficam?", includes: ["Rua das Flores 12", "maps\\.example"] }] },
  { bot: barbershop, name: "not configured: a service", turns: [{ customer: "Fazem tranças?", notConfigured: true }] },
  { bot: barbershop, name: "not configured: a price", turns: [{ customer: "Quanto custa uma permanente?", notConfigured: true }] },
  { bot: barbershop, name: "English", turns: [{ customer: "How much is a haircut?", includes: ["€16"], language: "en" }] },
  { bot: barbershop, name: "a person", turns: [{ customer: "Quero falar com alguém", handoff: "customer_asked", ai: null }] },
  { bot: barbershop, name: "a greeting", turns: [{ customer: "Olá", equals: "Olá! Em que posso ajudar?", ai: null }] },

  {
    bot: restaurant,
    name: "restaurant: «Quanto custa?», then a dish",
    turns: [
      { customer: "Quanto custa?", includes: ["^Depende do que procura", "bacalhau à Brás \\(14,50 €\\)"], ai: ["Bacalhau à Brás — 14,50 €"] },
      { customer: "E o polvo?", includes: ["Polvo à lagareiro — 18 €"] },
    ],
  },
  { bot: restaurant, name: "restaurant: a dish's price", turns: [{ customer: "Quanto custa o arroz de pato?", includes: ["Arroz de pato — 13,50 €"] }] },
  { bot: restaurant, name: "restaurant: vegetarian", turns: [{ customer: "Têm pratos vegetarianos?", includes: ["vegetarian"] }] },
  { bot: restaurant, name: "restaurant: allergies", turns: [{ customer: "Sou celíaco, têm pratos sem glúten?", includes: ["alergénios"] }] },
  { bot: restaurant, name: "restaurant: dogs", turns: [{ customer: "Posso levar o cão?", includes: ["esplanada"] }] },
  { bot: restaurant, name: "restaurant: kids", turns: [{ customer: "Têm menu infantil?", includes: ["menu infantil"] }] },
  { bot: restaurant, name: "restaurant: closed on Monday", turns: [{ customer: "Abrem na segunda-feira?", includes: ["fechados"] }] },
  {
    bot: restaurant,
    name: "restaurant: booking for Saturday, by phone",
    turns: [{ customer: "Queria reservar mesa para sábado", includes: ["12:00", "19:00", "910 000 000"], excludes: ["há vaga", "temos mesa"] }],
  },
  { bot: restaurant, name: "restaurant: not configured", turns: [{ customer: "Fazem entregas ao domicílio?", notConfigured: true }] },

  { bot: lodging, name: "lodging: check-in", turns: [{ customer: "A que horas é o check-in?", includes: ["15:00"] }] },
  { bot: lodging, name: "lodging: check-out", turns: [{ customer: "Até que horas é o check-out?", includes: ["11:00"] }] },
  { bot: lodging, name: "lodging: wifi", turns: [{ customer: "Há wifi?", includes: ["frigorífico"] }] },
  { bot: lodging, name: "lodging: smoking", turns: [{ customer: "Pode-se fumar?", includes: ["varanda"] }] },
  { bot: lodging, name: "lodging: door code goes to the host", turns: [{ customer: "Qual é o código da porta?", handoff: "access_code", ai: null }] },
  { bot: lodging, name: "lodging: late check-out goes to the host", turns: [{ customer: "Posso fazer o check-out mais tarde?", handoff: "late_checkout", ai: null }] },
  { bot: lodging, name: "lodging: not configured", turns: [{ customer: "Há piscina?", notConfigured: true }] },
];

/** Prices and clock times in a text, as plain values («16 €» → «€16», «9h30» → «9:30»). */
function figures(text) {
  const prices = (text.match(/\d+(?:[.,]\d{1,2})?\s?(?:€|euros?\b)|€\s?\d+(?:[.,]\d{1,2})?/gi) ?? []).map((price) => `€${price.replace(/[^\d.,]/g, "").replace(",", ".").replace(/\.0+$/, "")}`);
  const times = (text.match(/\b\d{1,2}(?::\d{2}|h\d{2}\b|h\b)/gi) ?? []).map((time) => {
    const [hours, minutes] = time.toLowerCase().replace("h", ":").split(":");
    return `${Number(hours)}:${minutes || "00"}`;
  });
  return [...prices, ...times];
}

function fakeAi(replyFor) {
  const calls = [];
  const fetch = async (_url, init) => {
    calls.push(JSON.parse(init.body));
    return { ok: true, status: 200, headers: { get: () => null }, json: async () => ({ choices: [{ message: { role: "assistant", content: replyFor() }, finish_reason: "stop" }], usage: { total_tokens: 400 } }) };
  };
  return { calls, fetch };
}

function testAi(fetch) {
  const clock = () => start;
  return createGroqProvider({
    enabled: true,
    apiKey: "gsk_test_not_a_real_key",
    limiter: new CallLimiter({ perMinute: 1000, perDay: 10000 }, clock),
    tokens: new TokenBudget({ perMinute: 10_000_000, perDay: 100_000_000 }, clock),
    botLimits: { perMinute: 1000, perDay: 10000 },
    clock,
    fetch,
  });
}

async function play(bot, turns, provider, onTurn) {
  let state = newConversationState();
  const history = [];
  for (const [index, turn] of turns.entries()) {
    const at = start + index * 60_000;
    const result = await respond({ bot, conversation: state, history: [...history], message: { body: turn.customer, at }, now: new Date(at), conversationKey: `${bot.id}:${turns[0].customer}` }, provider);
    onTurn(turn, result);
    history.push({ author: "customer", body: turn.customer, at });
    for (const reply of result.replies) history.push({ author: "bot", body: reply, at: at + 1000 });
    state = result.conversation;
  }
}

describe("setup only (no document): the assistant answers what was configured", () => {
  let turns = 0;
  let right = 0;
  for (const dialogue of dialogues) {
    it(dialogue.name, async () => {
      const bot = dialogue.bot;
      const known = new Set(figures(`${bot.entryText}\n${serializeHours(bot.knowledge.hours, bot.knowledge.closures)}`));
      const failures = [];
      await play(bot, dialogue.turns, mockProvider, (turn, result) => {
        turns++;
        // Prices are written with a no-break space («16 €»).
        const reply = result.replies.join("\n").replace(/[\u00a0\u202f]/g, " ");
        const where = `«${turn.customer}» → «${reply}»`;
        const before = failures.length;
        const dontKnow = fixedMessages[result.language].dontKnow(bot.knowledge.phone ?? null);
        if (turn.notConfigured && reply !== dontKnow) failures.push(`${where}: not configured, expected «não tenho essa informação»`);
        if (turn.equals && reply !== turn.equals) failures.push(`${where}: expected «${turn.equals}»`);
        for (const source of turn.includes ?? []) if (!new RegExp(source, "u").test(reply)) failures.push(`${where}: expected /${source}/`);
        for (const source of turn.excludes ?? []) if (new RegExp(source, "u").test(reply)) failures.push(`${where}: unexpected /${source}/`);
        if (turn.language && result.language !== turn.language) failures.push(`${where}: language ${result.language}`);
        if ((turn.handoff ?? null) !== (result.handoff?.reason ?? null)) failures.push(`${where}: hand-off ${result.handoff?.reason ?? "none"}`);
        for (const figure of figures(reply)) if (!known.has(figure)) failures.push(`${where}: «${figure}» was never configured (invention)`);
        if (/com IVA|IVA \(\d/i.test(reply)) failures.push(`${where}: VAT`);
        if (failures.length === before) right++;
      });
      // The same turns with a test AI behind a fake endpoint: it gets the configured prices, hours and answers.
      const { calls, fetch } = fakeAi(() => "Resposta de teste. [E1]");
      let before = 0;
      await play({ ...bot, id: `${bot.id}-ai` }, dialogue.turns, testAi(fetch), (turn) => {
        const where = `«${turn.customer}» (AI)`;
        if (turn.ai === null) {
          if (calls.length !== before) failures.push(`${where}: the AI must not be called`);
        } else if (calls.length !== before + 1) {
          failures.push(`${where}: one AI call expected`);
        } else {
          const messages = calls.at(-1).messages;
          const excerpts = messages.at(-1).content.split("\n\n")[0].replace(/[\u00a0\u202f]/g, " ");
          for (const text of turn.ai ?? []) if (!excerpts.includes(text)) failures.push(`${where}: excerpts must include «${text}»\n${excerpts}`);
          for (const text of turn.system ?? []) if (!messages[0].content.includes(text)) failures.push(`${where}: system prompt must include «${text}»`);
        }
        before = calls.length;
      });
      assert.ok(!failures.length, failures.join("\n"));
    });
  }

  it("gets every configured turn right with the free answers (the setup's quality bar)", () => {
    assert.ok(turns > 0);
    assert.equal(right, turns, `${right} of ${turns}`);
  });
});

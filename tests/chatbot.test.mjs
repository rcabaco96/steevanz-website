import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { demoLodging, demoRestaurant } from "../src/lib/chatbot/demo.ts";
import { respond } from "../src/lib/chatbot/engine.ts";
import { handoffSummary, sanitizeReply } from "../src/lib/chatbot/guardrails.ts";
import { askedDay, formatNextOpening, formatWeek, hoursOn, localClock, openingState } from "../src/lib/chatbot/hours.ts";
import { detectIntents } from "../src/lib/chatbot/intents.ts";
import { buildIndex, findProperty, minimumScore, search } from "../src/lib/chatbot/knowledge.ts";
import { guessLanguage, replyLanguage } from "../src/lib/chatbot/language.ts";
import { buildSystemPrompt } from "../src/lib/chatbot/llm/prompt.ts";
import { chooseProvider, realProviderPlaceholder } from "../src/lib/chatbot/llm/providers.ts";
import { Pacer, isFresh, typingDelay, withinReplyWindow, defaultPacing } from "../src/lib/chatbot/pacing.ts";
import { hasKeyword, normalize } from "../src/lib/chatbot/text.ts";
import { newConversationState } from "../src/lib/chatbot/types.ts";

const all = ["pt", "en", "es", "fr", "de", "it"];
// Tuesday 2026-10-20 13:30 in Lisbon (UTC+1 in October) = 12:30 UTC.
const tuesdayLunch = new Date("2026-10-20T12:30:00Z");
// Tuesday 2026-10-20 16:30 in Lisbon: between lunch and dinner.
const tuesdayAfternoon = new Date("2026-10-20T15:30:00Z");

async function ask(bot, body, { state = newConversationState(), now = tuesdayLunch, history = [] } = {}) {
  return respond({ bot, conversation: state, history, message: { body, at: now.getTime() }, now });
}

/** A conversation that already had its first message. */
function greeted(extra = {}) {
  return { ...newConversationState(), greeted: true, language: "pt", ...extra };
}

describe("chatbot text helpers", () => {
  it("normalizes accents, case and punctuation", () => {
    assert.equal(normalize("Olá! Qual é a password do Wi-Fi?"), "ola qual e a password do wi fi");
    assert.equal(normalize("Öffnungszeiten heute?"), "offnungszeiten heute");
  });

  it("matches keywords as whole words, with * for word beginnings", () => {
    assert.ok(hasKeyword("queria reservar mesa", "reserv*"));
    assert.ok(hasKeyword("a que horas abrem", "a que horas"));
    assert.ok(!hasKeyword("pinheiro", "pin"));
    assert.ok(!hasKeyword("a que", "a que horas"));
  });
});

describe("chatbot language detection", () => {
  const cases = [
    ["Olá, a que horas abrem hoje?", "pt"],
    ["Bom dia, têm estacionamento?", "pt"],
    ["Hello, what time do you open today?", "en"],
    ["Is there parking near the house?", "en"],
    ["Hola, ¿a qué hora abren mañana?", "es"],
    ["Buenas tardes, ¿tienen mesa para cuatro personas?", "es"],
    ["Bonjour, vous êtes ouverts aujourd'hui ?", "fr"],
    ["Bonsoir, je voudrais réserver une table pour deux", "fr"],
    ["Guten Tag, haben Sie heute geöffnet?", "de"],
    ["Wo kann ich parken? Danke!", "de"],
    ["Buongiorno, siete aperti oggi?", "it"],
    ["Vorrei prenotare un tavolo per due persone, grazie", "it"],
  ];
  for (const [text, language] of cases) {
    it(`reads «${text}» as ${language}`, () => assert.equal(guessLanguage(text).language, language));
  }

  it("can't tell from a number or «ok»", () => {
    assert.equal(guessLanguage("123").language, null);
    assert.equal(guessLanguage("👍").language, null);
  });

  it("keeps the conversation's language when a message is unclear", () => {
    assert.equal(replyLanguage("ok", "en", all, "pt"), "en");
    assert.equal(replyLanguage("menu?", "de", all, "pt"), "de");
  });

  it("falls back to the default language when the customer's is not allowed", () => {
    assert.equal(replyLanguage("Guten Tag, haben Sie heute geöffnet?", null, ["pt", "en"], "pt"), "pt");
    assert.equal(replyLanguage("👍", null, all, "pt"), "pt");
  });
});

describe("chatbot intents", () => {
  it("finds the usual questions in several languages", () => {
    assert.deepEqual(detectIntents("A que horas abrem?", "restaurant"), ["hours"]);
    assert.ok(detectIntents("Queria reservar mesa para 4", "restaurant").includes("booking"));
    assert.ok(detectIntents("Where are you located?", "restaurant").includes("location"));
    assert.ok(detectIntents("Quanto custa o polvo?", "restaurant").includes("price"));
    assert.ok(detectIntents("Quiero hablar con una persona", "restaurant").includes("human"));
    assert.ok(detectIntents("Ich möchte mich beschweren, Beschwerde!", "restaurant").includes("complaint"));
  });

  it("keeps lodging and clinic rules to their businesses", () => {
    assert.ok(detectIntents("What's the door code?", "lodging").includes("access_code"));
    assert.ok(!detectIntents("What's the door code?", "restaurant").includes("access_code"));
    assert.ok(detectIntents("Que medicamento devo tomar para a dor?", "clinic").includes("medical"));
    assert.ok(!detectIntents("Que medicamento devo tomar para a dor?", "restaurant").includes("medical"));
  });

  it("counts «sim» as a yes only when it is (almost) the whole message", () => {
    assert.ok(detectIntents("Sim", "restaurant").includes("yes"));
    assert.ok(!detectIntents("sim mas queria saber se têm estacionamento e a que horas fecham", "restaurant").includes("yes"));
  });

  it("spots emergencies", () => {
    assert.ok(detectIntents("Socorro, cheira a gás na cozinha!", "lodging").includes("emergency"));
    assert.ok(detectIntents("There's a fire!", "restaurant").includes("emergency"));
  });

  it("a day with «can I come» phrasing is about that day's hours and how to book, in the six languages", () => {
    for (const question of [
      "Dá para cortar o cabelo amanhã?",
      "Estão abertos no sábado?",
      "Abrem hoje?",
      "Posso ir sem marcação no sábado?",
      "Têm vaga hoje à tarde?",
      "E no fim de semana?",
      "Cortam cabelo depois de amanhã?",
      "Can I come tomorrow?",
      "Are you open on Sunday?",
      "¿Puedo ir mañana por la mañana?",
      "Vous êtes ouverts demain ?",
      "Haben Sie am Samstag geöffnet?",
      "Siete aperti domenica?",
      "Posso venire oggi?",
    ]) {
      assert.deepEqual(detectIntents(question, "beauty"), ["hours", "booking"], question);
    }
  });

  it("does not turn other questions into hours questions", () => {
    assert.deepEqual(detectIntents("Posso ir com o meu cão?", "beauty"), []);
    assert.deepEqual(detectIntents("Dá para pagar com MB WAY?", "beauty"), []);
    assert.deepEqual(detectIntents("Guten Morgen", "beauty"), ["greeting"]);
    assert.deepEqual(detectIntents("Hoje está a chover, há guarda-chuvas para os clientes?", "beauty"), []);
    // A price question on a day stays a price question.
    assert.deepEqual(detectIntents("Sou estudante, quanto pago por um degradê na quarta?", "beauty"), ["price"]);
  });
});

describe("chatbot asked day", () => {
  // Wednesday 21/10/2026, 13:30 in Lisbon.
  const wednesday = new Date("2026-10-21T12:30:00Z");
  const day = (message, now = wednesday) => askedDay(message, "Europe/Lisbon", now);

  it("resolves today, tomorrow, the day after, weekdays and the weekend in the business's time zone", () => {
    assert.deepEqual(day("Abrem hoje?"), { date: "2026-10-21", weekday: 3, daysAhead: 0, mention: "today" });
    assert.deepEqual(day("Dá para amanhã?"), { date: "2026-10-22", weekday: 4, daysAhead: 1, mention: "tomorrow" });
    assert.equal(day("E depois de amanhã?").date, "2026-10-23");
    assert.equal(day("Estão abertos no sábado?").date, "2026-10-24");
    assert.equal(day("Abrem à segunda?").date, "2026-10-26");
    assert.equal(day("Abrem na quarta?").daysAhead, 0);
    assert.equal(day("Abrem na próxima quarta?").daysAhead, 7);
    assert.equal(day("This weekend?").date, "2026-10-24");
    assert.equal(day("Mañana por la mañana").date, "2026-10-22");
    assert.equal(day("Demain ?").date, "2026-10-22");
    assert.equal(day("Morgen?").date, "2026-10-22");
    assert.equal(day("Domani?").date, "2026-10-22");
    // 23:30 UTC on 21/10 is already 00:30 on Thursday 22/10 in Lisbon.
    assert.equal(day("Abrem hoje?", new Date("2026-10-21T23:30:00Z")).date, "2026-10-22");
  });

  it("ignores words that only look like days", () => {
    assert.equal(day("Guten Morgen"), null);
    assert.equal(day("Abrem no dia 8 de dezembro?"), null);
    assert.equal(day("Quero a segunda via da fatura"), null);
  });

  it("gives that day's hours, closures first", () => {
    const { hours, closures } = demoRestaurant.knowledge;
    assert.deepEqual(hoursOn(hours, closures, { date: "2026-10-22", weekday: 4 }), { closure: null, slots: [{ opens: "12:00", closes: "15:00" }, { opens: "19:00", closes: "23:00" }] });
    assert.deepEqual(hoursOn(hours, closures, { date: "2026-10-26", weekday: 1 }), { closure: null, slots: [] });
    assert.deepEqual(hoursOn(hours, closures, { date: "2026-12-25", weekday: 5 }), { closure: { reason: "Natal" }, slots: [] });
  });
});

describe("chatbot opening hours", () => {
  const { hours, closures, timeZone } = demoRestaurant.knowledge;

  it("reads the business's wall clock", () => {
    assert.deepEqual(localClock(tuesdayLunch, timeZone), { weekday: 2, minutes: 13 * 60 + 30, date: "2026-10-20" });
  });

  it("is open at lunch and says until when", () => {
    const state = openingState(hours, closures, timeZone, tuesdayLunch);
    assert.equal(state.open, true);
    assert.equal(state.closesAt, "15:00");
  });

  it("between services, says it opens again today at dinner", () => {
    const state = openingState(hours, closures, timeZone, tuesdayAfternoon);
    assert.equal(state.open, false);
    assert.deepEqual(state.next, { date: "2026-10-20", weekday: 2, opens: "19:00", daysAhead: 0 });
    assert.equal(formatNextOpening(state.next, "pt"), "hoje às 19:00");
  });

  it("on Monday (closed), points to Tuesday", () => {
    const monday = new Date("2026-10-19T10:00:00Z");
    const state = openingState(hours, closures, timeZone, monday);
    assert.equal(state.open, false);
    assert.equal(state.next.daysAhead, 1);
    assert.equal(formatNextOpening(state.next, "en"), "tomorrow at 12:00");
  });

  it("skips closure days", () => {
    // Christmas 2026 is a Friday.
    const christmas = new Date("2026-12-25T13:00:00Z");
    const state = openingState(hours, closures, timeZone, christmas);
    assert.equal(state.open, false);
    assert.deepEqual(state.closedToday, { reason: "Natal" });
    assert.equal(state.next.date, "2026-12-26");
  });

  it("without hours, never claims to be closed", () => {
    assert.equal(openingState([], [], timeZone, tuesdayLunch).known, false);
  });

  it("writes the week in the customer's language, Monday first", () => {
    const week = formatWeek(hours, "pt").split("\n");
    assert.equal(week[0], "Segunda-feira: fechado");
    assert.equal(week[1], "Terça-feira: 12:00–15:00 e 19:00–23:00");
    assert.match(formatWeek(hours, "de"), /^Montag: geschlossen/);
  });
});

describe("chatbot knowledge search", () => {
  const index = buildIndex(demoRestaurant.knowledge);

  it("finds the parking answer in Portuguese and in English", () => {
    assert.equal(search(index, "Há sítio para estacionar o carro?")[0].doc.entry.id, "r1");
    assert.equal(search(index, "Is there parking?")[0].doc.entry.id, "r1");
  });

  it("finds dishes by name", () => {
    const hits = search(index, "Quanto custa o polvo?");
    assert.equal(hits[0].doc.item.name, "Polvo à lagareiro");
    assert.ok(hits[0].score >= minimumScore);
  });

  it("finds nothing for unrelated questions", () => {
    const hits = search(index, "Qual é a capital da Mongólia?").filter((hit) => hit.score >= minimumScore);
    assert.equal(hits.length, 0);
  });

  it("leaves out other properties' entries once the property is known", () => {
    const lodging = buildIndex(demoLodging.knowledge);
    const hits = search(lodging, "wifi password", { property: "Moinho Velho" }).filter((hit) => hit.score >= minimumScore);
    assert.ok(hits.every((hit) => hit.doc.property !== "Casa do Rio"));
    assert.equal(hits[0].doc.entry.id, "l2");
  });

  it("recognises the property a guest names", () => {
    assert.equal(findProperty("Estou no moinho velho", demoLodging.knowledge.properties), "Moinho Velho");
    assert.equal(findProperty("casa do rio", demoLodging.knowledge.properties), "Casa do Rio");
    assert.equal(findProperty("olá", demoLodging.knowledge.properties), null);
  });
});

describe("chatbot guardrails", () => {
  it("never lets a lodging answer carry a door or keybox code", () => {
    const result = sanitizeReply("Enviamos as instruções.\nCódigo da porta: 4821", "lodging");
    assert.equal(result.text, "Enviamos as instruções.");
    assert.equal(result.blocked, true);
    assert.equal(sanitizeReply("The keybox code is 12 34", "lodging").text, "");
  });

  it("keeps postal codes and plain numbers", () => {
    assert.equal(sanitizeReply("Morada: Rua A 1, código postal 1100-123 Lisboa", "lodging").blocked, false);
    assert.equal(sanitizeReply("O check-out é até às 11:00", "lodging").blocked, false);
  });

  it("removes card numbers for every business", () => {
    assert.equal(sanitizeReply("Cartão 4111 1111 1111 1111", "restaurant").blocked, true);
  });

  it("summarises a hand-off for the team in Portuguese", () => {
    const summary = handoffSummary({
      reason: "complaint",
      language: "en",
      property: "Casa do Rio",
      history: [
        { author: "customer", body: "Hello", at: 1 },
        { author: "bot", body: "Hi", at: 2 },
        { author: "customer", body: "The shower is cold, terrible", at: 3 },
      ],
    });
    assert.match(summary, /Motivo: Reclamação/);
    assert.match(summary, /Língua do cliente: inglês/);
    assert.match(summary, /Alojamento: Casa do Rio/);
    assert.match(summary, /«The shower is cold, terrible»/);
  });
});

describe("chatbot engine", () => {
  it("sends no introduction message: a bare greeting gets a short hello in the customer's language", async () => {
    const result = await ask(demoRestaurant, "Olá");
    assert.deepEqual(result.replies, ["Olá! Em que posso ajudar?"]);
    assert.equal(result.conversation.greeted, true);
    for (const [body, reply] of [
      ["Bom dia", "Olá! Em que posso ajudar?"],
      ["Boa tarde, tudo bem?", "Olá! Em que posso ajudar?"],
      ["Hi there", "Hello! How can I help you?"],
      ["Hola", "¡Hola! ¿En qué puedo ayudarle?"],
      ["Bonjour", "Bonjour ! Comment puis-je vous aider ?"],
      ["Guten Morgen", "Guten Tag! Wie kann ich Ihnen helfen?"],
      ["Buongiorno", "Buongiorno! Come posso aiutarLa?"],
    ]) {
      const greeting = await ask(demoRestaurant, body);
      assert.deepEqual(greeting.replies, [reply], body);
    }
    // Also later in the chat, and never the old introduction.
    const later = await ask(demoRestaurant, "Olá", { state: greeted() });
    assert.deepEqual(later.replies, ["Olá! Em que posso ajudar?"]);
  });

  it("the first reply to a question is the answer itself (no introduction before it)", async () => {
    const result = await ask(demoRestaurant, "Olá, têm estacionamento?");
    assert.equal(result.replies.length, 1);
    assert.match(result.replies[0], /parque público na Rua Nova/);
    assert.doesNotMatch(result.replies.join(" "), /assistente automático|guardadas/);
    const media = await ask(demoRestaurant, "");
    assert.equal(media.replies.length, 1);
    assert.match(media.replies[0], /só consigo ler mensagens de texto/);
  });

  it("answers the hours in the customer's language", async () => {
    const result = await ask(demoRestaurant, "Hello, what time do you open?", { state: greeted({ language: null }), now: tuesdayAfternoon });
    assert.equal(result.language, "en");
    assert.match(result.replies[0], /We're closed right now\. We open today at 19:00\./);
    assert.match(result.replies[0], /Tuesday: 12:00–15:00 and 19:00–23:00/);
  });

  it("answers from the business's own frequent questions", async () => {
    const result = await ask(demoRestaurant, "Têm estacionamento?", { state: greeted() });
    assert.match(result.replies[0], /parque público na Rua Nova/);
    assert.deepEqual(result.usedEntryIds, ["r1"]);
    assert.equal(result.provider, "mock");
  });

  it("sends the booking link when the customer wants to book", async () => {
    const result = await ask(demoRestaurant, "Queria reservar uma mesa para sábado", { state: greeted() });
    assert.match(result.replies.at(-1), /https:\/\/www\.steevanz\.com\/reservar\/tasca-exemplo/);
    assert.equal(result.handoff, null);
  });

  it("a day asked: that day's hours and how to book, never a free slot", async () => {
    // Tuesday 20/10/2026, 13:30 in Lisbon.
    const tomorrow = await ask(demoRestaurant, "Dá para jantar amanhã?", { state: greeted() });
    assert.deepEqual(tomorrow.replies, [
      "Amanhã (quarta-feira, 21/10) estamos abertos das 12:00 às 15:00 e das 19:00 às 23:00.\n\nPode reservar aqui, com a disponibilidade em tempo real: https://www.steevanz.com/reservar/tasca-exemplo",
    ]);
    const today = await ask(demoRestaurant, "Abrem hoje?", { state: greeted(), now: tuesdayAfternoon });
    assert.match(today.replies[0], /^Hoje \(terça-feira, 20\/10\) estamos abertos das 12:00 às 15:00 e das 19:00 às 23:00\. Neste momento estamos fechados\. Abrimos hoje às 19:00\./);
    const monday = await ask(demoRestaurant, "Can I come on Monday?", { state: greeted({ language: "en" }) });
    assert.match(monday.replies[0], /^On Monday \(26\/10\) we're closed\./);
    const christmas = new Date("2026-12-24T12:00:00Z");
    const closure = await ask(demoRestaurant, "Abrem amanhã?", { state: greeted(), now: christmas });
    assert.match(closure.replies[0], /^Amanhã \(sexta-feira, 25\/12\) estamos fechados \(Natal\)\./);
    for (const result of [tomorrow, today, monday, closure]) assert.doesNotMatch(result.replies.join(" "), /há vaga|temos vaga|free slot/i);
  });

  it("lists matching dishes with prices", async () => {
    const result = await ask(demoRestaurant, "Quanto custa o bacalhau?", { state: greeted() });
    assert.match(result.replies[0], /Bacalhau à Brás — 14,50/);
  });

  it("says it doesn't know instead of inventing, and a «sim» then hands off", async () => {
    const first = await ask(demoRestaurant, "Fazem casamentos com música ao vivo e fogo de artifício?", { state: greeted() });
    assert.match(first.replies[0], /Não tenho essa informação/);
    assert.equal(first.conversation.offeredHandoff, true);
    const second = await ask(demoRestaurant, "Sim", { state: first.conversation });
    assert.equal(second.handoff.reason, "customer_asked");
    assert.equal(second.conversation.mode, "human");
  });

  it("hands complaints to the team with a summary", async () => {
    const result = await ask(demoRestaurant, "Quero fazer uma reclamação, o serviço foi péssimo", { state: greeted() });
    assert.equal(result.handoff.reason, "complaint");
    assert.match(result.handoff.summary, /Reclamação/);
    assert.equal(result.conversation.mode, "human");
  });

  it("when closed, says when the team will reply", async () => {
    const result = await ask(demoRestaurant, "Quero falar com o gerente", { state: greeted(), now: tuesdayAfternoon });
    assert.match(result.replies[0], /Neste momento estamos fechados: respondemos hoje às 19:00/);
  });

  it("stays quiet while the team has the chat, then the owner can give it back", async () => {
    const state = greeted({ mode: "human", handoffReason: "complaint", lastOwnerAt: tuesdayLunch.getTime() - 60_000 });
    const result = await ask(demoRestaurant, "Olá? Ainda aí?", { state });
    assert.equal(result.silent, "human");
    assert.deepEqual(result.replies, []);
  });

  it("returns to the bot after the team's silence when the business chose it", async () => {
    const state = greeted({ mode: "human", handoffReason: "access_code", lastOwnerAt: tuesdayLunch.getTime() - 13 * 60 * 60_000 });
    const result = await ask(demoLodging, "A que horas é o check-out?", { state });
    assert.equal(result.silent, null);
    assert.match(result.replies[0], /11:00/);
  });

  it("does nothing when the bot is switched off", async () => {
    const off = { ...demoRestaurant, settings: { ...demoRestaurant.settings, enabled: false } };
    assert.equal((await ask(off, "Olá")).silent, "disabled");
  });

  it("emergency: 112 first and an urgent alert", async () => {
    const result = await ask(demoLodging, "Help! There's a fire in the kitchen", { state: greeted({ language: null }) });
    assert.match(result.replies[0], /call 112/);
    assert.equal(result.handoff.reason, "emergency");
    assert.equal(result.handoff.urgent, true);
  });

  it("lodging: never gives access codes, and the host is told", async () => {
    const result = await ask(demoLodging, "Qual é o código da porta?", { state: greeted({ property: "Casa do Rio" }) });
    assert.match(result.replies[0], /não envio códigos de acesso/);
    assert.equal(result.handoff.reason, "access_code");
    assert.ok(!result.replies.join(" ").includes("4821"));
  });

  it("lodging: a code typed into an answer by mistake is never sent", async () => {
    const result = await ask(demoLodging, "Como entro em casa?", { state: greeted({ property: "Casa do Rio" }) });
    assert.ok(!result.replies.join(" ").includes("4821"));
    assert.equal(result.blocked, true);
  });

  it("lodging: never confirms who is staying", async () => {
    const result = await ask(demoLodging, "O João Silva está hospedado aí?", { state: greeted() });
    assert.match(result.replies[0], /não posso dar informações sobre quem está hospedado/);
    assert.equal(result.handoff, null);
  });

  it("lodging: early check-in goes to the host", async () => {
    const result = await ask(demoLodging, "Can we do an early check-in at 10am?", { state: greeted({ language: "en" }) });
    assert.equal(result.handoff.reason, "early_checkin");
  });

  it("lodging with several properties: asks which one before a property answer", async () => {
    const first = await ask(demoLodging, "What's the wifi password?", { state: greeted({ language: "en" }) });
    assert.match(first.replies[0], /Which of our properties/);
    const second = await ask(demoLodging, "Moinho Velho, wifi please", { state: first.conversation });
    assert.equal(second.conversation.property, "Moinho Velho");
    assert.match(second.replies[0], /moinho-verde/);
  });

  it("clinic: no medical advice", async () => {
    const clinic = { ...demoRestaurant, knowledge: { ...demoRestaurant.knowledge, kind: "clinic" } };
    const result = await ask(clinic, "Que medicamento devo tomar para a febre?", { state: greeted() });
    assert.match(result.replies[0], /Não posso dar aconselhamento médico/);
    assert.equal(result.handoff.reason, "medical");
  });

  it("loop guard: too many replies in a row go to a person", async () => {
    const now = tuesdayLunch.getTime();
    const state = greeted({ recentBotReplies: Array.from({ length: 8 }, (_, i) => now - i * 1000) });
    const result = await ask(demoRestaurant, "Têm estacionamento?", { state });
    assert.equal(result.handoff.reason, "loop_guard");
  });
});

describe("chatbot answer providers", () => {
  it("uses the free mock unless the owner allowed a paid model", () => {
    assert.equal(chooseProvider({ choice: "real", paidAllowed: false }).id, "mock");
    assert.equal(chooseProvider({ choice: "mock", paidAllowed: true }).id, "mock");
  });

  it("the paid placeholder never runs: the engine falls back to the mock", async () => {
    const result = await respond(
      { bot: demoRestaurant, conversation: greeted(), history: [], message: { body: "Têm estacionamento?", at: tuesdayLunch.getTime() }, now: tuesdayLunch },
      realProviderPlaceholder,
    );
    assert.equal(result.provider, "mock");
    assert.match(result.replies[0], /Rua Nova/);
  });

  it("writes the safety rules into the (unsent) system prompt", () => {
    const prompt = buildSystemPrompt(demoLodging.knowledge, demoLodging.settings, "en");
    assert.match(prompt, /NEVER share door, keybox, alarm or safe codes/);
    assert.match(prompt, /NEVER confirm or deny who is staying/);
    assert.match(prompt, /Use ONLY the business information below/);
  });
});

describe("chatbot pacing (anti-ban)", () => {
  it("types at a human pace, within bounds", () => {
    assert.equal(typingDelay("ok", defaultPacing, () => 0.5), defaultPacing.typingMinMs);
    assert.equal(typingDelay("x".repeat(1000), defaultPacing, () => 0.5), defaultPacing.typingMaxMs);
  });

  it("keeps a gap per chat and a ceiling per minute and per day", () => {
    const pacer = new Pacer({ ...defaultPacing, maxPerMinute: 2, maxPerDay: 3 });
    assert.equal(pacer.waitBeforeSend("a", 0), 0);
    pacer.record("a", 0);
    assert.equal(pacer.waitBeforeSend("a", 500), 1000);
    assert.equal(pacer.waitBeforeSend("b", 500), 0);
    pacer.record("b", 500);
    assert.equal(pacer.waitBeforeSend("c", 1000), 59_000);
    pacer.record("c", 61_000);
    assert.equal(pacer.waitBeforeSend("d", 62_000), Infinity);
  });

  it("never auto-replies to old messages nor outside the 24-hour window", () => {
    assert.equal(isFresh(0, 10 * 60_000), true);
    assert.equal(isFresh(0, 60 * 60_000), false);
    assert.equal(withinReplyWindow(null, 0), false);
    assert.equal(withinReplyWindow(0, 25 * 60 * 60_000), false);
  });
});

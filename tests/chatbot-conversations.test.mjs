// The assistant's quality gate: whole conversations, not single questions. Every dialogue in
// tests/fixtures/dialogues/*.json is played turn by turn against the business's document in each
// layout (structured PDF text, flat, messy, WhatsApp style), once with the free answers and once with
// a test AI behind a fake HTTP client (no request leaves the test): the free answers must say (or not
// say) what the dialogue expects, and the AI must receive what it needs (excerpts, the conversation,
// the earlier question a follow-up continues, the day asked). To add a sector, add a JSON file with its
// document fixtures and dialogues; nothing here is specific to one business.
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { listOptions, pickedOption, recentTurns, resolveFollowUp, subjectWords } from "../src/lib/chatbot/context.ts";
import { sectionName } from "../src/lib/chatbot/doc-answers.ts";
import { respond } from "../src/lib/chatbot/engine.ts";
import { dayMention, mentionsWeekday } from "../src/lib/chatbot/hours.ts";
import { detectIntents } from "../src/lib/chatbot/intents.ts";
import { buildIndex } from "../src/lib/chatbot/knowledge.ts";
import { createGroqProvider } from "../src/lib/chatbot/llm/groq.ts";
import { CallLimiter, TokenBudget } from "../src/lib/chatbot/llm/limiter.ts";
import { replyLanguage } from "../src/lib/chatbot/language.ts";
import { bulletsOnLines, parseGroundedAnswer, withoutEmptyLinks, withoutRepeats, withoutUnknownLinks } from "../src/lib/chatbot/llm/grounding.ts";
import { mockProvider } from "../src/lib/chatbot/llm/mock.ts";
import { buildSystemPrompt } from "../src/lib/chatbot/llm/prompt.ts";
import { normalize } from "../src/lib/chatbot/text.ts";
import { newConversationState } from "../src/lib/chatbot/types.ts";
import { documentChunks } from "./helpers/document-layouts.mjs";

const dialoguesDir = new URL("./fixtures/dialogues/", import.meta.url);
const specs = readdirSync(dialoguesDir)
  .filter((name) => name.endsWith(".json"))
  .map((name) => JSON.parse(readFileSync(new URL(name, dialoguesDir), "utf8")));

const settings = { enabled: true, tone: "formal", languages: ["pt", "en", "es", "fr", "de", "it"], defaultLanguage: "pt", autoResumeMinutes: null };

/** A bot that knows only the document (the hardest case: no hours, services or address set in the admin). */
function documentBot(spec, layout) {
  return {
    id: `${spec.sector}-${layout}`,
    settings,
    knowledge: {
      businessName: spec.business,
      kind: spec.sector,
      timeZone: "Europe/Lisbon",
      address: null,
      phone: null,
      mapsUrl: null,
      bookingUrl: null,
      menuUrl: null,
      privacyUrl: null,
      hours: [],
      closures: [],
      items: [],
      entries: [],
      properties: [],
      chunks: documentChunks(spec.documents, layout, spec.documentTitle),
    },
  };
}

const pattern = (source) => new RegExp(source, "iu");
const applies = (expectation, layout) => expectation && (!expectation.layouts || expectation.layouts.includes(layout));

/** A fake Groq endpoint: records each request and answers with the turn's canned reply. */
function fakeAi(replyFor) {
  const calls = [];
  const fetch = async (_url, init) => {
    const body = JSON.parse(init.body);
    calls.push(body);
    return {
      ok: true,
      status: 200,
      headers: { get: () => null },
      json: async () => ({ choices: [{ message: { role: "assistant", content: replyFor(calls.length) }, finish_reason: "stop" }], usage: { total_tokens: 500 } }),
    };
  };
  return { calls, fetch };
}

function testAi(fetch, clock) {
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

/** Plays a dialogue like the runner does: the chat's history and state carried from turn to turn. */
async function play(bot, turns, provider, start, onTurn) {
  let state = newConversationState();
  const history = [];
  for (const [index, turn] of turns.entries()) {
    const at = start + index * 60_000;
    const result = await respond({ bot, conversation: state, history: [...history], message: { body: turn.customer, at }, now: new Date(at), conversationKey: `${bot.id}:${turns[0].customer}` }, provider);
    await onTurn(turn, result, index, [...history]);
    history.push({ author: "customer", body: turn.customer, at });
    for (const reply of result.replies) history.push({ author: "bot", body: reply, at: at + 1000 });
    state = result.conversation;
  }
}

function checkFree(turn, result, layout, where) {
  const reply = result.replies.join("\n");
  const free = turn.free;
  if (applies(free, layout)) {
    if (free.equals) assert.equal(reply, free.equals, `${where}: «${reply}»`);
    for (const source of free.includes ?? []) assert.match(reply, pattern(source), `${where}: expected /${source}/ in «${reply}»`);
    for (const source of free.excludes ?? []) assert.doesNotMatch(reply, pattern(source), `${where}: unexpected /${source}/ in «${reply}»`);
  }
  if (turn.language) assert.equal(result.language, turn.language, `${where}: language`);
  if (turn.handoff) assert.equal(result.handoff?.reason, turn.handoff, `${where}: hand-off`);
  else assert.equal(result.handoff, null, `${where}: no hand-off expected («${reply}»)`);
  // Never a total with VAT worked out (owner's rule).
  assert.doesNotMatch(reply, /com IVA|IVA \(\d/i, `${where}: VAT`);
}

function checkAi(turn, calls, before, history, layout, where) {
  if (turn.ai === null) {
    assert.equal(calls.length, before, `${where}: the AI must not be called`);
    return;
  }
  assert.equal(calls.length, before + 1, `${where}: one AI call`);
  const messages = calls[calls.length - 1].messages;
  const last = messages[messages.length - 1].content;
  const excerpts = last.split("\n\n")[0];
  const ai = turn.ai ?? {};
  // The conversation so far (within the history limits) reaches the AI, customer and assistant turns alike.
  const sent = messages.slice(1, -1).map((message) => message.content);
  for (const message of recentTurns(history)) assert.ok(sent.includes(message.body), `${where}: history must include «${message.body}»`);
  assert.equal(sent.length, recentTurns(history).length, `${where}: history length`);
  if (!applies(ai, layout)) return;
  for (const source of ai.excerpts ?? []) assert.match(excerpts, pattern(source), `${where}: excerpts must include /${source}/\n${excerpts}`);
  for (const source of ai.history ?? []) assert.ok(sent.some((content) => pattern(source).test(content)), `${where}: history must include /${source}/`);
  if (ai.followUpOf === null) assert.doesNotMatch(last, /earlier question/, `${where}: not a follow-up`);
  else if (ai.followUpOf) assert.match(last, pattern(`earlier question «[^»]*${ai.followUpOf}`), `${where}: follow-up of «${ai.followUpOf}»\n${last}`);
  if (ai.dayAsked) assert.match(last, pattern(`Day asked about: [^\\n]*${ai.dayAsked}`), `${where}: day asked\n${last}`);
  if (ai.noDay) assert.doesNotMatch(last, /Day asked about/, `${where}: no day asked`);
  if (ai.picked) assert.match(last, pattern(`picks this option[^\\n]*${ai.picked}`), `${where}: option picked`);
  if (ai.language) assert.match(last, pattern(`Reply in ${ai.language}`), `${where}: reply language`);
}

for (const spec of specs) {
  const start = Date.parse(spec.now);
  describe(`chatbot conversations: ${spec.business}`, () => {
    it("has enough dialogues to be a quality gate (at least 25, 2–4 turns mostly)", () => {
      assert.ok(spec.dialogues.length >= 25, `${spec.dialogues.length} dialogues`);
      assert.ok(spec.dialogues.filter((dialogue) => dialogue.turns.length >= 2).length >= 20);
    });
    for (const layout of spec.layouts) {
      describe(layout, () => {
        const bot = documentBot(spec, layout);
        for (const dialogue of spec.dialogues) {
          it(dialogue.name, async () => {
            await play(bot, dialogue.turns, mockProvider, start, (turn, result, index) => checkFree(turn, result, layout, `${layout} · turn ${index + 1} «${turn.customer}» (free)`));
            const replies = dialogue.turns.map((turn, index) => turn.ai?.reply ?? `Resposta de teste ${index + 1}. [S1]`);
            let currentTurn = 0;
            const { calls, fetch } = fakeAi(() => replies[Math.min(currentTurn, replies.length - 1)]);
            let before = 0;
            await play({ ...bot, id: `${bot.id}-ai` }, dialogue.turns, testAi(fetch, () => start), start, (turn, result, index, history) => {
              checkAi(turn, calls, before, history, layout, `${layout} · turn ${index + 1} «${turn.customer}» (AI)`);
              before = calls.length;
              currentTurn = index + 1;
            });
          });
        }
      });
    }
  });
}

describe("chatbot conversation context (context.ts)", () => {
  const at = Date.parse("2026-10-21T12:30:00Z");
  const turn = (author, body, minutes = 0) => ({ author, body, at: at - minutes * 60_000 });

  it("keeps the last turns for the AI within the limits, without system notes", () => {
    const history = [turn("customer", "a".repeat(900), 9), turn("bot", "Resposta 1", 8), turn("system", "Passagem para a equipa", 7), turn("customer", "Pergunta 2", 6), turn("bot", "b".repeat(600), 5)];
    const kept = recentTurns(history);
    assert.ok(kept.every((message) => message.author !== "system"));
    assert.ok(kept.reduce((size, message) => size + message.body.length, 0) <= 1500 + 2);
    assert.ok(kept.at(-1).body.endsWith("…") && kept.at(-1).body.length <= 501);
    assert.equal(kept.length, 4);
  });

  it("reads what a message is about without question words, days or fillers", () => {
    assert.deepEqual(subjectWords("Quanto custa?"), []);
    assert.deepEqual(subjectWords("E ao sábado?"), []);
    assert.deepEqual(subjectWords("Quanto tempo demora?"), []);
    assert.deepEqual(subjectWords("How much is it?"), []);
    assert.deepEqual(subjectWords("E para crianças?"), ["criancas"]);
    assert.deepEqual(subjectWords("Dá para cortar o cabelo amanhã?"), ["cortar", "cabelo"]);
  });

  it("carries the subject into a price follow-up and the day into an hours follow-up", () => {
    const priced = resolveFollowUp({ message: "Quanto custa?", at, history: [turn("customer", "Fazem degradê?", 2), turn("bot", "Sim.", 1)], kind: "beauty" });
    assert.match(priced.query, /degrade/);
    assert.deepEqual(priced.intents, ["price"]);
    assert.equal(priced.previous, "Fazem degradê?");
    const day = resolveFollowUp({ message: "E a barba?", at, history: [turn("customer", "Quanto custa um corte?", 2), turn("bot", "16 €", 1)], kind: "beauty" });
    assert.deepEqual(day.intents, ["price"]);
    assert.doesNotMatch(day.query, /corte/);
    const hours = resolveFollowUp({ message: "E então?", at, history: [turn("customer", "Abrem amanhã?", 2), turn("bot", "Sim.", 1)], kind: "beauty" });
    assert.match(hours.query, /amanha/);
    assert.ok(hours.intents.includes("hours"));
  });

  it("doesn't carry anything into a new question, after a hand-off, or after hours", () => {
    const fresh = resolveFollowUp({ message: "Têm estacionamento?", at, history: [turn("customer", "Quanto custa um corte?", 2)], kind: "beauty" });
    assert.equal(fresh.previous, null);
    const address = resolveFollowUp({ message: "Onde ficam?", at, history: [turn("customer", "Quanto custa um corte?", 2)], kind: "beauty" });
    assert.equal(address.query, "Onde ficam?");
    const afterHandoff = resolveFollowUp({ message: "Quanto custa?", at, history: [turn("customer", "Fazem degradê?", 4), turn("customer", "Quero falar com alguém", 2)], kind: "beauty" });
    assert.equal(afterHandoff.previous, null);
    const old = resolveFollowUp({ message: "Quanto custa?", at, history: [turn("customer", "Fazem degradê?", 7 * 60)], kind: "beauty" });
    assert.equal(old.previous, null);
  });

  it("reads «a segunda opção» after a list as that option, never as Monday", () => {
    const options = listOptions("Depende do que procura. Por exemplo: corte clássico (16 €), degradê / fade (18 €), desenho ou risco (+4 €) ou corte de criança (12 €). Qual lhe interessa?");
    assert.deepEqual(options, ["corte clássico (16 €)", "degradê / fade (18 €)", "desenho ou risco (+4 €)", "corte de criança (12 €)"]);
    assert.equal(pickedOption("Quero a segunda opção", options), "degradê / fade (18 €)");
    assert.equal(pickedOption("A última", options), "corte de criança (12 €)");
    assert.equal(pickedOption("the second one", options), "degradê / fade (18 €)");
    assert.equal(pickedOption("Pode ser na segunda?", options), null);
    assert.deepEqual(listOptions("• Corte — 16 €\n• Barba — 10 €"), ["Corte — 16 €", "Barba — 10 €"]);
  });
});

describe("chatbot sources in the admin: clean section names", () => {
  const spec = specs[0];
  it("never shows letter-spaced decorations or sentences as section names (older stored documents)", () => {
    const index = buildIndex({ entries: [], items: [], chunks: documentChunks(spec.documents, "old", spec.documentTitle) });
    for (const passage of index.passages) {
      const name = sectionName(passage);
      if (!name) continue;
      assert.doesNotMatch(name, /B A R B|BARBEARIA · PORTO|A equipa tem quatro barbeiros/, name);
    }
  });

  it("names the section a structured document's line belongs to", () => {
    const index = buildIndex({ entries: [], items: [], chunks: documentChunks(spec.documents, "structured", spec.documentTitle) });
    const fade = index.passages.find((passage) => passage.text.startsWith("Degradê / fade"));
    assert.equal(sectionName(fade), "Cabelo");
    const team = index.passages.find((passage) => passage.text.startsWith("Tiago Moura"));
    assert.equal(sectionName(team), "1. Quem somos");
  });

  it("gives each answer's sources once per document section", async () => {
    const bot = documentBot(spec, "old");
    const result = await respond({ bot, conversation: newConversationState(), history: [], message: { body: "Quantos barbeiros têm?", at: Date.parse(spec.now) }, now: new Date(spec.now) });
    const keys = result.sources.map((source) => `${source.documentTitle}|${source.section ?? ""}`);
    assert.equal(new Set(keys).size, keys.length);
    for (const source of result.sources) assert.doesNotMatch(source.section ?? "", /B A R B|A equipa tem/);
  });
});

describe("chatbot language and day words in a conversation", () => {
  const all = ["pt", "en", "es", "fr", "de", "it"];

  it("keeps Portuguese on a new conversation unless another language is clear", () => {
    assert.equal(replyLanguage("Queria reservar uma mesa para segunda", null, all, "pt"), "pt");
    assert.equal(replyLanguage("Queria marcar um corte para sábado", null, all, "pt"), "pt");
    assert.equal(replyLanguage("Hola", null, all, "pt"), "es");
    assert.equal(replyLanguage("Hello", null, all, "pt"), "en");
    assert.equal(replyLanguage("Quiero reservar una mesa para el lunes", null, all, "pt"), "es");
    assert.equal(replyLanguage("Bonjour, vous êtes ouverts demain ?", null, all, "pt"), "fr");
  });

  it("switches language mid-conversation only on clear evidence", () => {
    assert.equal(replyLanguage("Thanks!", "pt", all, "pt"), "pt");
    assert.equal(replyLanguage("menu?", "pt", all, "pt"), "pt");
    assert.equal(replyLanguage("And how much is it for kids?", "pt", all, "pt"), "en");
    assert.equal(replyLanguage("Obrigado", "en", all, "pt"), "en");
  });

  it("reads «segunda» as an ordinal next to «opção», «vez», «terceira»…, and as Monday otherwise", () => {
    assert.equal(dayMention(normalize("Quero a segunda opção")), null);
    assert.equal(dayMention(normalize("A segunda e a terceira opção")), null);
    assert.equal(dayMention(normalize("É a segunda vez que pergunto")), null);
    assert.deepEqual(dayMention(normalize("Pode ser na segunda?")), { kind: "weekday", weekday: 1, next: false });
    assert.deepEqual(dayMention(normalize("Abrem segunda-feira?")), { kind: "weekday", weekday: 1, next: false });
    assert.deepEqual(detectIntents("Quero a segunda opção", "beauty"), []);
  });

  it("doesn't read a goodbye with a day as an hours question", () => {
    assert.deepEqual(detectIntents("Obrigado, até amanhã!", "beauty"), ["thanks", "bye"]);
  });

  it("finds a weekday inside a range of a timetable line", () => {
    assert.ok(mentionsWeekday(normalize("Terça a sexta-feira 10:00–13:00 e 14:30–20:00"), 4));
    assert.ok(!mentionsWeekday(normalize("Terça a sexta-feira 10:00–13:00"), 1));
    assert.ok(mentionsWeekday(normalize("Sexta a domingo 12:00–23:00"), 6));
    assert.ok(mentionsWeekday(normalize("Monday to Friday 9:00–18:00"), 3));
    assert.ok(!mentionsWeekday(normalize("Monday to Friday 9:00–18:00"), 6));
  });
});

describe("chatbot AI writing style (prompt and answer clean-up)", () => {
  const knowledge = { businessName: "Barbearia Exemplo", kind: "beauty", timeZone: "Europe/Lisbon", hours: [], closures: [], items: [], entries: [], properties: [] };

  it("asks for natural European Portuguese, as the business, without facts to copy", () => {
    const prompt = buildSystemPrompt(knowledge, settings, "pt");
    for (const rule of [/first person plural/, /telemóvel/, /never «você»/, /No English words/, /no Markdown/, /only when the customer asks a yes\/no question/, /never repeat a sentence/, /ask back in ONE sentence/, /Bad: «Abertura amanhã/]) assert.match(prompt, rule);
    // Examples never carry real hours or prices the model could copy.
    assert.doesNotMatch(prompt.split("Business information:")[0], /\d{1,2}:\d{2}|\d+ ?€/);
    assert.match(buildSystemPrompt(knowledge, { ...settings, tone: "formal" }, "pt"), /No emojis/);
  });

  it("cleans gpt-oss characters from the answer", () => {
    const parsed = parseGroundedAnswer("Sim, amanhã (quinta\u2011feira) custa 16\u202F€.\u200B [S1]", [{ ref: "S1", text: "x" }]);
    assert.equal(parsed.text, "Sim, amanhã (quinta-feira) custa 16 €.");
  });
});

describe("chatbot AI answers never point to a link they don't write", () => {
  it("drops «através do nosso link» without an address and keeps real links", () => {
    assert.equal(withoutEmptyLinks("O degradê / fade custa 18 €. Pode marcar através do nosso link de marcação ou vir sem marcação, se houver vaga."), "O degradê / fade custa 18 €.");
    assert.equal(
      withoutEmptyLinks("Estamos fechados à segunda. Para marcar, use o nosso site de reservas online."),
      "Estamos fechados à segunda.",
    );
    const real = "Sim, amanhã estamos abertos das 10:00 às 13:00. Pode marcar em reservas.fiodenavalha.example.";
    assert.equal(withoutEmptyLinks(real), real);
    assert.equal(withoutEmptyLinks("Veja o link."), "Veja o link.");
  });

  it("a dot inside an address doesn't end the sentence; a list survives a link sentence after it", () => {
    for (const real of [
      "O corte custa 16 €. Pode marcar no nosso site reservas.fiodenavalha.example.",
      "Pode marcar no link https://reservas.fiodenavalha.example/marcar ou ligar.",
      "Marque pelo site www.fio.pt. Obrigado.",
    ])
      assert.equal(withoutEmptyLinks(real), real);
    assert.equal(withoutEmptyLinks("Temos:\n• Corte 16 €\n• Barba 15 €\nPode marcar pelo nosso site... Até já!"), "Temos:\n• Corte 16 €\n• Barba 15 €\nAté já!");
    assert.equal(
      parseGroundedAnswer("Depende do tipo de corte: • Corte clássico 16 € • Degradê / fade 18 € • Cabelo comprido 22 €. Qual prefere? [S1]", [{ ref: "S1", text: "x" }]).text,
      "Depende do tipo de corte:\n• Corte clássico 16 €\n• Degradê / fade 18 €\n• Cabelo comprido 22 €.\nQual prefere?",
    );
    assert.equal(bulletsOnLines("Temos:\n• Corte 16 €\n• Barba 15 €"), "Temos:\n• Corte 16 €\n• Barba 15 €");
    // A link the model was never given is invented: its sentence goes (Groq live test, 2026-10-21).
    const seen = "Relevant information:\n[S1] Online: em reservas.fiodenavalha.example, 24 horas por dia.\n[S2] Email: ola@fiodenavalha.example";
    assert.equal(
      withoutUnknownLinks("Sim, o degradê custa 18 € − 2 € = 16 € para estudantes na quarta-feira. Pode marcar em https://barbearia-fiodenavalha.pt/marcar ou vir sem marcação.", seen),
      "Sim, o degradê custa 18 € − 2 € = 16 € para estudantes na quarta-feira.",
    );
    for (const known of ["Pode marcar em https://reservas.fiodenavalha.example.", "Pode marcar em www.reservas.fiodenavalha.example/ ou por email para ola@fiodenavalha.example."])
      assert.equal(withoutUnknownLinks(known, seen), known);
    assert.equal(withoutUnknownLinks("Pode marcar em reservas.fiodenavalha.example/promo.", seen), "", "a made-up page on a real site is invented too");
    assert.equal(withoutUnknownLinks("Pode marcar em https://x.pt.", ""), "Pode marcar em https://x.pt.", "nothing to compare with: unchanged");
    assert.equal(parseGroundedAnswer("Veja https://inventado.pt/marcar. [S1]", [{ ref: "S1", text: "x" }], [], seen).text, null);
    // References the model made up in the same style are removed too.
    assert.equal(parseGroundedAnswer("Até 10 minutos de atraso atendemos. [A12][A16]", [{ ref: "S1", text: "x" }]).text, "Até 10 minutos de atraso atendemos.");
    // A sentence already written earlier in the chat is not repeated (never the first one: that is the answer).
    const said = [
      { author: "customer", body: "A que horas abrem amanhã?", at: 1 },
      { author: "bot", body: "Abrimos amanhã (quinta-feira) das 10:00 às 13:00 e das 14:30 às 20:00. Pode marcar online em reservas.fiodenavalha.example ou vir sem marcação se houver vaga.", at: 2 },
    ];
    assert.equal(
      withoutRepeats("Abrimos sábado das 09:00 às 18:00. Pode marcar online em reservas.fiodenavalha.example ou vir sem marcação, se houver vaga.", said),
      "Abrimos sábado das 09:00 às 18:00.",
    );
    assert.equal(withoutRepeats("Pode marcar online em reservas.fiodenavalha.example ou vir sem marcação se houver vaga.", said), "Pode marcar online em reservas.fiodenavalha.example ou vir sem marcação se houver vaga.");
    assert.equal(withoutRepeats("Abrimos sábado das 09:00 às 18:00. Também pode marcar por telefone.", said), "Abrimos sábado das 09:00 às 18:00. Também pode marcar por telefone.");
    assert.equal(withoutRepeats("Abrimos sábado das 09:00 às 18:00. Pode marcar online em reservas.fiodenavalha.example.", []), "Abrimos sábado das 09:00 às 18:00. Pode marcar online em reservas.fiodenavalha.example.");
    assert.equal(
      parseGroundedAnswer("Abrimos sábado das 09:00 às 18:00. [S1] Pode marcar online em reservas.fiodenavalha.example ou vir sem marcação, se houver vaga. [S2]", [{ ref: "S1", text: "x" }], said).text,
      "Abrimos sábado das 09:00 às 18:00.",
    );
    assert.equal(bulletsOnLines("• Corte 16 € • Barba 15 €"), "• Corte 16 €\n• Barba 15 €");
    assert.equal(parseGroundedAnswer("O corte custa 16 €. [S1] Pode marcar no nosso site reservas.fiodenavalha.example. [S2]", [{ ref: "S1", text: "x" }, { ref: "S2", text: "y" }]).text, "O corte custa 16 €. Pode marcar no nosso site reservas.fiodenavalha.example.");
  });
});

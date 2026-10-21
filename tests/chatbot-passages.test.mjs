// Free answers from a business document whatever its layout: the same barbershop facts as a PDF's
// text (titles, tables, frequent questions), one flat block, a messy copy with random line breaks
// and bullets, a WhatsApp-style text, and sections stored by the older cutter. Same questions, same
// right answers; «Não tenho essa informação» when the document doesn't say it.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { demoLodging } from "../src/lib/chatbot/demo.ts";
import { splitIntoChunks } from "../src/lib/chatbot/documents.ts";
import { respond } from "../src/lib/chatbot/engine.ts";
import { collapseLetterSpacing, documentPassages, splitPassage } from "../src/lib/chatbot/passages.ts";
import { newConversationState } from "../src/lib/chatbot/types.ts";

const fixture = (name) => readFileSync(new URL(`./fixtures/${name}`, import.meta.url), "utf8");
const structured = fixture("barbearia-fio-de-navalha.txt");
const title = "Barbearia Fio de Navalha - informacao para clientes";

/** Deterministic random numbers (the messy copy is the same on every run). */
function random(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** The same text re-wrapped at random widths, with bullets and blank lines here and there. */
function messy(text, seed = 7) {
  const next = random(seed);
  const out = [];
  for (const line of text.split("\n")) {
    if (!line.trim()) {
      out.push("");
      continue;
    }
    const width = 32 + Math.floor(next() * 32);
    let current = next() < 0.3 ? (next() < 0.5 ? "• " : "- ") : "";
    for (const word of line.split(" ")) {
      if (current.length + word.length > width && current.trim()) {
        out.push(current.trimEnd());
        current = "";
      }
      current += `${word} `;
    }
    if (current.trim()) out.push(current.trimEnd());
    if (next() < 0.1) out.push("");
  }
  return out.join("\n");
}

const toChunks = (parts) => parts.map((part, index) => ({ id: `c${index}`, documentId: "barbearia", documentTitle: title, property: null, language: "pt", ...part }));

/** How the older cutter stored documents: lines joined into paragraphs, one wrong title for everything. */
function oldStyleChunks(text) {
  const flat = text.replace(/\s+/g, " ");
  const parts = [];
  for (let start = 0; start < flat.length; ) {
    let end = Math.min(flat.length, start + 800);
    if (end < flat.length) end = flat.lastIndexOf(" ", end);
    parts.push({ heading: `${title} › T R E S › A equipa tem quatro barbeiros`, body: flat.slice(start, end).trim() });
    start = end + 1;
  }
  return toChunks(parts);
}

const versions = {
  structured: toChunks(splitIntoChunks(structured, title)),
  flat: toChunks(splitIntoChunks(structured.replace(/\s+/g, " "), title)),
  messy: toChunks(splitIntoChunks(messy(structured), title)),
  whatsapp: toChunks(splitIntoChunks(fixture("barbearia-fio-de-navalha-whatsapp.txt"), title)),
  "stored by the older cutter": oldStyleChunks(structured),
};

const now = new Date("2026-10-21T12:30:00Z");
function barbershop(chunks, extra = {}) {
  return { ...demoLodging, knowledge: { ...demoLodging.knowledge, kind: "beauty", businessName: "Fio de Navalha", entries: [], properties: [], chunks, ...extra } };
}
async function ask(bot, body) {
  const result = await respond({ bot, conversation: { ...newConversationState(), greeted: true, language: "pt" }, history: [], message: { body, at: now.getTime() }, now });
  return { text: result.replies.join("\n"), sources: result.sources };
}

const dontKnow = /^Não tenho essa informação/;
/** Question → what the answer must (and must not) say, in every version of the document. */
const expectations = [
  ["Que serviços tem?", [/Corte clássico/, /16 ?€/, /Barba à navalha/], [dontKnow]],
  ["Quanto custa um corte?", [/Corte clássico[^\n]*16 ?€/], [dontKnow]],
  ["Quanto custa a barba à navalha?", [/Barba à navalha com toalha quente/, /15 ?€/], [/40 ?€/, /Combinados/, dontKnow]],
  ["Abrem à segunda?", [/fechad/i, /segunda/i], [dontKnow]],
  ["Qual o horário?", [/10:00/, /S[áa]bado/, /fechad/i], [/Não tenho o horário/, dontKnow]],
  ["Do you have parking?", [/Parque Trindade/, /another language/], [/fechados à segunda/]],
  ["Posso ir com o meu cão?", [/cães pequenos com trela/], [dontKnow]],
  ["Fazem tranças?", [/Não fazemos/, /tranças/], [/€/, dontKnow]],
  ["Aceitam MB WAY?", [/Multibanco/], [dontKnow]],
  ["Qual a morada?", [/Rua do Almada 210/, /4050-032/], [dontKnow]],
  ["Vendem máquinas de cortar?", [dontKnow], [/€/]],
];

/** «Can I come on that day?» → the day's hours (or the timetable after «Amanhã é quinta-feira»), plus how to book. */
const dayQuestions = [
  ["Dá para cortar o cabelo amanhã?", [/Amanhã é quinta-feira, 22\/10/, /10:00–13:00/]],
  ["Estão abertos no sábado?", [/S[áa]bado:? 09:00–18:00/]],
  ["Abrem hoje?", [/Hoje é quarta-feira, 21\/10/, /10:00–13:00/]],
  ["Can I come tomorrow?", [/Tomorrow is Thursday, 22\/10/, /10:00–13:00/, /another language/]],
  ["Posso ir sem marcação no sábado?", [/S[áa]bado:? 09:00–18:00/, /[Ss]em marcação/]],
];

describe("chatbot document answers: any layout, same answers", () => {
  for (const [name, chunks] of Object.entries(versions)) {
    describe(name, () => {
      const bot = barbershop(chunks);
      for (const [question, must, mustNot] of expectations) {
        it(question, async () => {
          const { text } = await ask(bot, question);
          for (const pattern of must) assert.match(text, pattern, `${question} → ${text}`);
          for (const pattern of mustNot) assert.doesNotMatch(text, pattern, `${question} → ${text}`);
          // Never a title or the columns of a table as the start of an answer.
          assert.doesNotMatch(text, /^(\d{1,2}\.\s|Serviço Duração Preço|Dia Horário)/, `${question} → ${text}`);
        });
      }

      // Wednesday 21/10/2026 in Lisbon: «amanhã» is Thursday (only in the range «Terça a sexta-feira»).
      for (const [question, must] of dayQuestions) {
        it(`a day: ${question}`, async () => {
          const { text } = await ask(bot, question);
          for (const pattern of must) assert.match(text, pattern, `${question} → ${text}`);
          assert.match(text, /reservas\.fiodenavalha\.example/, `${question} → ${text}`);
          assert.doesNotMatch(text, dontKnow, `${question} → ${text}`);
          // Opening hours and how to book, never a free slot.
          assert.doesNotMatch(text, /temos vaga|há vaga (amanhã|hoje|no sábado)|there is a (free )?slot/i, `${question} → ${text}`);
        });
      }

      it("a date the document doesn't list: quotes what it says about December, never «yes»", async () => {
        const { text } = await ask(bot, "Abrem no dia 8 de dezembro?");
        assert.doesNotMatch(text, /^Sim|8 de dezembro/);
        assert.ok(/dezembro/.test(text) || dontKnow.test(text), text);
      });
    });
  }

  it("says which document and section an answer quotes (for the admin)", async () => {
    const { sources } = await ask(barbershop(versions.structured), "Posso ir com o meu cão?");
    assert.equal(sources[0].documentTitle, title);
    assert.ok(versions.structured.some((chunk) => chunk.id === sources[0].chunkId));
  });

  it("other languages: the Portuguese excerpt and the note", async () => {
    const { text } = await ask(barbershop(versions.messy), "¿Tienen aparcamiento?");
    assert.match(text, /Parque Trindade/);
    assert.match(text, /otro idioma/);
  });

  it("the business's own answers still win over the document", async () => {
    const entry = { id: "e1", kind: "faq", question: "Têm estacionamento?", answer: "Sim, temos dois lugares à porta para clientes.", keywords: "parque, carro", active: true };
    const { text, sources } = await ask(barbershop(versions.structured, { entries: [entry] }), "Há estacionamento?");
    assert.match(text, /dois lugares à porta/);
    assert.deepEqual(sources, []);
  });

  it("structured hours and services still win over the document", async () => {
    const bot = barbershop(versions.flat, {
      hours: [2, 3, 4, 5, 6].map((weekday) => ({ weekday, opens: "09:30", closes: "19:00" })),
      items: [{ name: "Corte clássico", priceCents: 1700, durationMinutes: 30 }],
    });
    const hours = await ask(bot, "Qual o horário?");
    assert.match(hours.text, /09:30/);
    assert.deepEqual(hours.sources, []);
    const price = await ask(bot, "Quanto custa um corte clássico?");
    assert.match(price.text, /17\s?€/);
    assert.doesNotMatch(price.text, /16\s?€/);
  });
});

describe("chatbot document answers: passages", () => {
  const passages = (text) => documentPassages(toChunks([{ heading: title, body: text }])).map((passage) => passage.text);

  it("keeps a question with its answer and every price line on its own", () => {
    const list = passages("Serviço Duração Preço\nCorte clássico 30 min 16 €\nBarba à navalha 35 min 15 €\nHá estacionamento?\nNão temos parque próprio.");
    assert.ok(list.includes("Corte clássico 30 min 16 €"));
    assert.ok(list.includes("Barba à navalha 35 min 15 €"));
    const question = documentPassages(toChunks([{ heading: title, body: "Há estacionamento?\nNão temos parque próprio." }]))[0];
    assert.equal(question.question, true);
  });

  it("joins lines broken in the middle of a sentence and splits a flat price list", () => {
    assert.deepEqual(passages("Barba à navalha com toalha\nquente (ritual completo) 35 min\n15 €"), ["Barba à navalha com toalha quente (ritual completo) 35 min 15 €"]);
    assert.deepEqual(splitPassage("Corte 30 min 16 € Degradê 40 min 18 € Não fazemos tranças."), ["Corte 30 min 16 €", "Degradê 40 min 18 €", "Não fazemos tranças."]);
    assert.deepEqual(splitPassage("Produtos: pomada 16€, cera 15€, óleo de barba 14€."), ["Produtos: pomada 16€", "cera 15€", "óleo de barba 14€."]);
  });

  it("drops decoration and repeated table captions, keeps «4.» with its title", () => {
    assert.equal(collapseLetterSpacing("B A R B E A R I A · P O R T O"), "BARBEARIA · PORTO");
    const flat = passages("4. Serviços e preços Cabelo Serviço Duração Preço Corte 30 min 16 € Barba Serviço Duração Preço Aparar 20 min 10 € Outros Serviço Duração Preço Sobrancelhas 10 min 5 €");
    assert.ok(flat.every((text) => !text.includes("Serviço Duração Preço")), flat.join(" | "));
    assert.ok(passages("Texto.\n4. Serviços e preços\nCorte 30 min 16 €").includes("4. Serviços e preços"));
  });
});

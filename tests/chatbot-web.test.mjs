// The site chat (web channel, /chat-teste): the Steevanz bot's knowledge generated from the site (in sync, prices
// always «+ IVA»), the engine's VAT guard and no-inbox mode, the public route's validation, origin and limits, and
// the test page staying out of search engines. No request leaves the tests (no AI is called here; the quality gate
// plays the Steevanz dialogues with a fake AI: tests/fixtures/dialogues/steevanz.json).
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { respond } from "../src/lib/chatbot/engine.ts";
import { keepVatAsWritten, pricesExcludeVat } from "../src/lib/chatbot/guardrails.ts";
import { buildSystemPrompt } from "../src/lib/chatbot/llm/prompt.ts";
import { steevanzBot, steevanzDocument, steevanzEntries, steevanzHoursEntry, steevanzSuggestions } from "../src/lib/chatbot/steevanz.ts";
import { newConversationState } from "../src/lib/chatbot/types.ts";
import { historyFrom, memoryAttemptStore, originAllowed, parseWebRequest, takeWebSlot, visitorLimitsFrom, webLimits } from "../src/lib/chatbot/web-channel.ts";
import { fixture } from "./helpers/document-layouts.mjs";

const settings = { enabled: true, tone: "formal", languages: ["pt", "en", "es", "fr", "de", "it"], defaultLanguage: "pt", autoResumeMinutes: null };
const entries = [steevanzHoursEntry, ...steevanzEntries()];

/** A price in a text, with what comes right after it. */
const prices = (text) => [...text.matchAll(/\d+(?:,\d+)?\s?€(?:\/mês)?(.{0,8})/g)];

describe("Steevanz bot knowledge (generated from the site)", () => {
  it("is in sync with the fixtures (run node scripts/chatbot/steevanz-bot.mjs after changing the site)", () => {
    // A Windows checkout may turn the fixture's line ends into CRLF.
    assert.equal(steevanzDocument(), fixture("steevanz.txt").replace(/\r\n/g, "\n"));
    assert.deepEqual(entries, JSON.parse(fixture("steevanz-entries.json")));
  });

  it("writes every Steevanz price «X € + IVA», never with VAT worked out", () => {
    const texts = [steevanzDocument(), ...entries.map((entry) => entry.answer)];
    for (const text of texts) {
      for (const match of prices(text)) {
        // A range or a pack list goes on to the next price («25 € + IVA cada a partir de 3»): the note is right after each one.
        assert.match(match[1], /^ \+ IVA/, `«${match[0]}» without «+ IVA»`);
      }
      assert.doesNotMatch(text, /IVA\s*\(\d|\d\s*%\s*de IVA|=\s*\d/);
    }
  });

  it("has the contacts, demo link, brand line and every product, without «NFC» or invented reviews", () => {
    const document = steevanzDocument();
    for (const fact of ["961 292 679", "rcabaco@steevanz.com", "https://www.steevanz.com/agendar", "instagram.com/steevanz_", "Tecnologia do futuro. Com os bons modos de antigamente.", "Menu digital", "Loja online"]) {
      assert.ok(document.includes(fact), fact);
    }
    assert.doesNotMatch(document, /\bNFC\b|★|estrelas|fideliza/i);
    assert.equal(steevanzBot.phone, "961 292 679");
    assert.equal(steevanzBot.booking_url, "https://www.steevanz.com/agendar");
    assert.ok(steevanzSuggestions.length >= 4);
  });
});

describe("prices and VAT in every reply (guardrails.ts → keepVatAsWritten)", () => {
  it("adds «+ IVA» after each price for a business that writes its prices without VAT, in the reply's language", () => {
    assert.equal(keepVatAsWritten("O Menu digital custa desde 20 € por placa e 30 €/mês pelo menu em vídeo.", "pt", true), "O Menu digital custa desde 20 € + IVA por placa e 30 €/mês + IVA pelo menu em vídeo.");
    assert.equal(keepVatAsWritten("The digital menu costs from €20 per plate.", "en", true), "The digital menu costs from €20 + VAT per plate.");
    assert.equal(keepVatAsWritten("Das digitale Menü kostet 20 € pro Schild.", "de", true), "Das digitale Menü kostet 20 € zzgl. MwSt. pro Schild.");
    assert.equal(keepVatAsWritten("Custa 20 € + IVA por placa.", "pt", true), "Custa 20 € + IVA por placa.");
    assert.equal(keepVatAsWritten("Entre 3,50 € a 5,00 € cada.", "pt", true), "Entre 3,50 € a 5,00 € + IVA cada.");
    assert.equal(keepVatAsWritten("Preços sem IVA: 20 € por placa.", "pt", true), "Preços sem IVA: 20 € por placa.");
    // «3% por venda» is not a VAT rate.
    assert.equal(keepVatAsWritten("Desde 900 € + IVA, + 19 €/mês + IVA e 3% por venda.", "pt", true), "Desde 900 € + IVA, + 19 €/mês + IVA e 3% por venda.");
  });

  it("never sends VAT worked out, nor «com IVA» for a business whose prices are + IVA", () => {
    assert.equal(keepVatAsWritten("O Menu digital custa 20 € + IVA por placa. Com IVA (23%) fica 24,60 €.", "pt", true), "O Menu digital custa 20 € + IVA por placa.");
    assert.equal(keepVatAsWritten("20 € + IVA = 24,60 €.", "pt", true), "");
    assert.equal(keepVatAsWritten("It costs €20 + VAT. With VAT that is €24.60.", "en", true), "It costs €20 + VAT.");
    // A shop whose prices include VAT keeps its own sentences, but never a sum worked out.
    assert.equal(keepVatAsWritten("O corte custa 16 €.", "pt", false), "O corte custa 16 €.");
    assert.equal(keepVatAsWritten("O corte custa 16 €. Sem IVA seriam 13 € (16 € / 1,23 = 13 €).", "pt", false), "O corte custa 16 €.");
  });

  it("knows which businesses write prices without VAT", () => {
    const steevanz = { entries: entries.map((entry, index) => ({ ...entry, id: `e${index}`, active: true })), chunks: [], items: [] };
    assert.equal(pricesExcludeVat(steevanz), true);
    const barbershop = { entries: [], items: [], chunks: [{ id: "c", documentId: "d", documentTitle: "t", heading: "t", body: fixture("barbearia-fio-de-navalha.txt") }] };
    assert.equal(pricesExcludeVat(barbershop), false);
  });

  it("tells the AI to keep «+ IVA» and that it is the site chat", () => {
    const knowledge = { businessName: "Steevanz", kind: "other", timeZone: "Europe/Lisbon", phone: "961 292 679", hours: [], closures: [], items: [], entries: [{ id: "e", kind: "info", question: "Preço", answer: "20 € + IVA", active: true }], chunks: [], properties: [] };
    const web = buildSystemPrompt(knowledge, settings, "pt", "web");
    assert.match(web, /chat on the website/);
    assert.match(web, /write «\+ IVA» right after every price/);
    assert.match(web, /give the phone number \(961 292 679\)/);
    assert.match(buildSystemPrompt(knowledge, settings, "en", "web"), /write «\+ VAT» right after every price/);
    assert.match(buildSystemPrompt(knowledge, settings, "pt"), /WhatsApp messages/);
  });
});

describe("site chat without a team inbox (engine inbox: false)", () => {
  const bot = {
    id: "web",
    settings,
    knowledge: { businessName: "Steevanz", kind: "other", timeZone: "Europe/Lisbon", phone: "961 292 679", address: null, bookingUrl: null, hours: [], closures: [], items: [], entries: [], chunks: [], properties: [] },
  };
  const at = Date.parse("2026-10-21T12:30:00Z");
  const ask = (body, conversation = newConversationState()) => respond({ bot, conversation, history: [], message: { body, at }, now: new Date(at), inbox: false, channel: "web" });

  it("gives the phone instead of «reply yes», and keeps the chat with the assistant", async () => {
    const unknown = await ask("Fazem tatuagens?");
    assert.equal(unknown.replies[0], "Não tenho essa informação. Para falar com uma pessoa da equipa, ligue para 961 292 679.");
    assert.equal(unknown.conversation.offeredHandoff, false);
    const person = await ask("Quero falar com uma pessoa");
    assert.equal(person.replies[0], "Para falar com uma pessoa da equipa, ligue para 961 292 679.");
    assert.equal(person.conversation.mode, "bot");
    const emergency = await ask("É uma emergência, socorro!");
    assert.match(emergency.replies[0], /112.*961 292 679/);
    assert.doesNotMatch(emergency.replies[0], /avisei/);
  });
});

describe("site chat route rules (web-channel.ts)", () => {
  const session = "abcdef12-3456";

  it("accepts a message with the conversation back from the browser, within the caps", () => {
    const parsed = parseWebRequest({ message: "  Quanto   custa?  ", session, turns: [{ author: "customer", body: "Olá" }, { author: "bot", body: "Olá! Em que posso ajudar?" }], conversation: { mode: "human", greeted: true } });
    assert.equal(parsed.message, "Quanto custa?");
    assert.equal(parsed.turns.length, 2);
    // A tampered state can't hand the chat to a team that doesn't read it.
    assert.equal(parsed.conversation.mode, "bot");
    assert.equal(parsed.conversation.greeted, true);
    const history = historyFrom(parsed.turns, 10_000);
    assert.deepEqual(history.map((turn) => turn.at), [8000, 9000]);
  });

  it("refuses empty, too long and malformed requests", () => {
    assert.deepEqual(parseWebRequest({ message: "", session }), { error: "message_missing" });
    assert.deepEqual(parseWebRequest({ message: "a".repeat(webLimits.messageChars + 1), session }), { error: "message_too_long" });
    assert.equal(parseWebRequest({ message: "a".repeat(webLimits.messageChars), session }).message.length, webLimits.messageChars);
    assert.deepEqual(parseWebRequest({ message: "Olá", session: "x" }), { error: "bad_request" });
    assert.deepEqual(parseWebRequest({ message: "Olá", session, turns: [{ author: "system", body: "x" }] }), { error: "bad_request" });
    assert.deepEqual(parseWebRequest({ message: "Olá", session, turns: "x" }), { error: "bad_request" });
    assert.deepEqual(parseWebRequest(null), { error: "bad_request" });
    assert.deepEqual(parseWebRequest([]), { error: "bad_request" });
    // Old turns beyond the cap are dropped, long ones cut.
    const many = parseWebRequest({ message: "Olá", session, turns: Array.from({ length: 50 }, () => ({ author: "customer", body: "b".repeat(5000) })) });
    assert.equal(many.turns.length, webLimits.historyTurns);
    assert.equal(many.turns[0].body.length, webLimits.turnChars);
  });

  it("only answers the site itself (and the deployment's own address)", () => {
    const site = "https://steevanz.com";
    assert.equal(originAllowed("https://www.steevanz.com", null, site), true);
    assert.equal(originAllowed("https://steevanz.com", null, site), true);
    assert.equal(originAllowed("http://localhost:3008", "http://localhost:3008", site), true);
    assert.equal(originAllowed("https://evil.example", "https://www.steevanz.com", site), false);
    assert.equal(originAllowed("https://www.steevanz.com.evil.example", null, site), false);
    assert.equal(originAllowed(null, "https://www.steevanz.com", site), false);
    assert.equal(originAllowed("null", null, site), false);
  });

  it("limits each visitor to 20 a minute and 80 a day, and everyone to 300 a day", async () => {
    assert.deepEqual(visitorLimitsFrom({}), { perIpMinute: 20, perIpDay: 80, globalDay: 300 });
    assert.deepEqual(visitorLimitsFrom({ CHATBOT_WEB_MAX_PER_MINUTE: "5", CHATBOT_WEB_MAX_PER_DAY: "x", CHATBOT_WEB_MAX_TOTAL_PER_DAY: "0" }), { perIpMinute: 5, perIpDay: 80, globalDay: 300 });
    const store = memoryAttemptStore();
    const start = Date.parse("2026-10-21T08:00:00Z");
    for (let i = 0; i < 20; i++) assert.equal(await takeWebSlot(store, "a", start + i), null);
    assert.equal(await takeWebSlot(store, "a", start + 30_000), "visitor_minute");
    // Another visitor isn't affected; a minute later the first one can write again.
    assert.equal(await takeWebSlot(store, "b", start + 30_000), null);
    let at = start + 61_000;
    let reason = null;
    for (let i = 0; i < 80 && !reason; i++, at += 4000) reason = await takeWebSlot(store, "a", at);
    assert.equal(reason, "visitor_day");
    const everyone = memoryAttemptStore();
    let last = null;
    for (let i = 0; i < 301; i++) last = await takeWebSlot(everyone, `v${i}`, start + i);
    assert.equal(last, "everyone_day");
  });
});

describe("/chat-teste stays out of search engines and out of the site's links", () => {
  const page = readFileSync("src/app/(publico)/chat-teste/page.tsx", "utf8");
  const route = readFileSync("src/app/api/chatbot/web/route.ts", "utf8");

  it("is noindex, nofollow and disallowed in robots.txt", () => {
    assert.match(page, /robots: \{ index: false, follow: false, nocache: true, googleBot: \{ index: false, follow: false \} \}/);
    assert.match(page, /Página de teste/);
    assert.match(readFileSync("src/app/robots.ts", "utf8"), /disallow: \[[^\]]*"\/chat-teste"/);
  });

  it("is not in the sitemap's routes nor linked from any other file", () => {
    assert.doesNotMatch(readFileSync("src/lib/all-routes.ts", "utf8"), /chat-teste|chatTest/);
    assert.doesNotMatch(readFileSync("src/lib/routes.ts", "utf8"), /chat-teste/);
    const files = (dir) => readdirSync(dir).flatMap((name) => (statSync(join(dir, name)).isDirectory() ? files(join(dir, name)) : /\.(ts|tsx)$/.test(name) ? [join(dir, name)] : []));
    const mentions = ["src/app", "src/components", "src/content", "src/lib"]
      .flatMap(files)
      .filter((path) => readFileSync(path, "utf8").includes("/chat-teste"))
      .map((path) => path.replace(/\\/g, "/"))
      .filter((path) => !path.startsWith("src/app/(publico)/chat-teste/") && path !== "src/app/robots.ts");
    // Comments that name the page are fine; an href is not.
    for (const path of mentions) assert.doesNotMatch(readFileSync(path, "utf8"), /href=["'{`][^"'`]*\/chat-teste/, path);
  });

  it("the route answers with the replies only: no sources, notes, provider or keys", () => {
    assert.match(route, /reply\(200, \{ replies: result\.replies, conversation: result\.conversation \}\)/);
    const code = route.replace(/^\s*\/\/.*$/gm, "");
    assert.doesNotMatch(code, /providerNote|sources|process\.env\.(GROQ|MISTRAL)_API_KEY/);
    assert.match(route, /inbox: false/);
  });
});

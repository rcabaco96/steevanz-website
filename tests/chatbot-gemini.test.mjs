// The Gemini test provider with a fake HTTP client: no request ever leaves the computer.
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { demoLodging, demoRestaurant } from "../src/lib/chatbot/demo.ts";
import { respond } from "../src/lib/chatbot/engine.ts";
import { createGeminiProvider, parseGeminiAnswer } from "../src/lib/chatbot/llm/gemini.ts";
import { CallLimiter, limitFromEnv } from "../src/lib/chatbot/llm/limiter.ts";
import { chooseProvider } from "../src/lib/chatbot/llm/providers.ts";
import { newConversationState } from "../src/lib/chatbot/types.ts";

const now = new Date("2026-10-20T12:30:00Z");

function fakeFetch(reply, status = 200) {
  const calls = [];
  const fetch = async (url, init) => {
    calls.push({ url, init, body: JSON.parse(init.body) });
    return { ok: status === 200, status, json: async () => (typeof reply === "function" ? reply(calls.at(-1)) : { candidates: [{ content: { parts: [{ text: reply }] } }] }) };
  };
  return { fetch, calls };
}

function provider(fetch, { apiKey = "test-key", perMinute = 10, perDay = 200 } = {}) {
  return createGeminiProvider({ apiKey, model: "gemini-test", limiter: new CallLimiter({ perMinute, perDay }, () => now.getTime()), fetch });
}

function ask(bot, body, answerProvider, state = {}) {
  return respond({ bot, conversation: { ...newConversationState(), greeted: true, language: "pt", ...state }, history: [], message: { body, at: now.getTime() }, now }, answerProvider);
}

describe("chatbot test AI (Gemini free tier, mocked)", () => {
  it("is off unless chosen, and never for the paid switch", () => {
    assert.equal(chooseProvider({ choice: "mock", paidAllowed: false, env: { GEMINI_API_KEY: "x" } }).id, "mock");
    assert.equal(chooseProvider({ choice: "gemini", paidAllowed: false, env: {} }).id, "gemini");
    assert.equal(chooseProvider({ choice: "real", paidAllowed: false }).id, "mock");
  });

  it("without a key it falls back to the free answers and says why", async () => {
    const { fetch, calls } = fakeFetch("x");
    const result = await ask(demoRestaurant, "Têm estacionamento?", provider(fetch, { apiKey: null }));
    assert.equal(calls.length, 0);
    assert.equal(result.provider, "mock");
    assert.match(result.replies[0], /Rua Nova/);
    assert.match(result.providerNote, /GEMINI_API_KEY/);
  });

  it("sends only the bot's information and retrieved sections, with the key in a header", async () => {
    const { fetch, calls } = fakeFetch("O supermercado fica a 400 metros, na Avenida Principal. [S1]");
    const result = await ask(demoLodging, "Onde fica o supermercado mais perto?", provider(fetch));
    assert.equal(calls.length, 1);
    assert.match(calls[0].url, /models\/gemini-test:generateContent$/);
    assert.equal(calls[0].init.headers["x-goog-api-key"], "test-key");
    const system = calls[0].body.systemInstruction.parts[0].text;
    assert.match(system, /Use ONLY the business information below/);
    assert.match(system, /NEVER share door, keybox, alarm or safe codes/);
    assert.match(system, /NO_ANSWER/);
    const user = calls[0].body.contents.at(-1).parts[0].text;
    assert.match(user, /\[S1\]/);
    assert.match(user, /Supermercado e farmácia/);
    assert.equal(result.replies[0], "O supermercado fica a 400 metros, na Avenida Principal.");
    assert.equal(result.provider, "gemini:gemini-test");
    assert.equal(result.sources[0].documentTitle, "Guia da casa (exemplo)");
  });

  it("NO_ANSWER becomes «não tenho essa informação» (never invents)", async () => {
    const { fetch } = fakeFetch("NO_ANSWER");
    const result = await ask(demoRestaurant, "Fazem casamentos com fogo de artifício?", provider(fetch));
    assert.match(result.replies[0], /Não tenho essa informação/);
  });

  it("an API error or the free-tier limit (429) falls back to the free answers", async () => {
    const { fetch } = fakeFetch("", 429);
    const result = await ask(demoRestaurant, "Têm estacionamento?", provider(fetch));
    assert.equal(result.provider, "mock");
    assert.match(result.replies[0], /Rua Nova/);
    assert.match(result.providerNote, /429/);
  });

  it("our own cap stops calls well before Google's limits", async () => {
    const { fetch, calls } = fakeFetch("Há um parque público na Rua Nova. [E1]");
    const capped = provider(fetch, { perMinute: 2 });
    for (let i = 0; i < 4; i++) await ask(demoRestaurant, "Têm estacionamento?", capped);
    assert.equal(calls.length, 2);
    assert.equal(limitFromEnv("50", 10, 10), 10);
    assert.equal(limitFromEnv("5", 10, 10), 5);
    assert.equal(limitFromEnv(undefined, 200, 200), 200);
  });

  it("safety rules run before the AI: emergencies and access codes never reach it", async () => {
    const { fetch, calls } = fakeFetch("anything");
    const emergency = await ask(demoLodging, "Socorro, há fogo na cozinha! pegou fogo", provider(fetch));
    assert.match(emergency.replies[0], /112/);
    const code = await ask(demoLodging, "Qual é o código da porta?", provider(fetch), { property: "Casa do Rio" });
    assert.equal(code.handoff.reason, "access_code");
    assert.equal(calls.length, 0);
  });

  it("…and after it: a code in the AI's answer is never sent", async () => {
    const { fetch } = fakeFetch("Claro! O código da porta é 4821. [E1]");
    const result = await ask(demoLodging, "Como entro em casa?", provider(fetch), { property: "Casa do Rio" });
    assert.ok(!result.replies.join(" ").includes("4821"));
  });

  it("strips references and maps them to sources", () => {
    const items = [{ ref: "S1", text: "x", source: { documentId: "d", documentTitle: "Guia", heading: "Guia › Lixo", chunkId: "c" } }, { ref: "E1", text: "y", entryId: "e1" }];
    const parsed = parseGeminiAnswer("O lixo vai para o ecoponto [S1] e o check-out é às 11:00 [E1].", items);
    assert.equal(parsed.text, "O lixo vai para o ecoponto e o check-out é às 11:00.");
    assert.deepEqual(parsed.entryIds, ["e1"]);
    assert.equal(parsed.sources[0].heading, "Guia › Lixo");
  });
});

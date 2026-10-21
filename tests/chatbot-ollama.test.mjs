// The local Ollama test provider with a fake HTTP client: no request ever leaves the test.
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { demoLodging, demoRestaurant } from "../src/lib/chatbot/demo.ts";
import { respond } from "../src/lib/chatbot/engine.ts";
import { parseGroundedAnswer } from "../src/lib/chatbot/llm/grounding.ts";
import { CallLimiter, limitFromEnv } from "../src/lib/chatbot/llm/limiter.ts";
import { completeSentences, createOllamaProvider, ollamaAvailable, ollamaFromEnv } from "../src/lib/chatbot/llm/ollama.ts";
import { chooseProvider } from "../src/lib/chatbot/llm/providers.ts";
import { newConversationState } from "../src/lib/chatbot/types.ts";

const now = new Date("2026-10-20T12:30:00Z");

function fakeFetch(reply, { status = 200, doneReason = "stop", error } = {}) {
  const calls = [];
  const fetch = async (url, init) => {
    calls.push({ url, init, body: JSON.parse(init.body) });
    if (error) throw error;
    const content = typeof reply === "function" ? reply(calls.at(-1)) : reply;
    return {
      ok: status === 200,
      status,
      json: async () => (status === 200 ? { model: "qwen-test", message: { role: "assistant", content }, done: true, done_reason: doneReason } : { error: content }),
    };
  };
  return { fetch, calls };
}

function provider(fetch, { url = "http://127.0.0.1:11434", perMinute = 10, perDay = 500, timeoutMs } = {}) {
  return createOllamaProvider({ url, model: "qwen-test", timeoutMs, limiter: new CallLimiter({ perMinute, perDay }, () => now.getTime()), fetch });
}

function ask(bot, body, answerProvider, state = {}) {
  return respond({ bot, conversation: { ...newConversationState(), greeted: true, language: "pt", ...state }, history: [], message: { body, at: now.getTime() }, now }, answerProvider);
}

describe("chatbot test AI (local Ollama, mocked)", () => {
  it("is off unless chosen, and never for the paid switch", () => {
    assert.equal(chooseProvider({ choice: "mock", paidAllowed: false, env: {} }).id, "mock");
    assert.equal(chooseProvider({ choice: "ollama", paidAllowed: false, env: {} }).id, "ollama");
    assert.equal(chooseProvider({ choice: "gemini", paidAllowed: false, env: {} }).id, "mock");
    assert.equal(chooseProvider({ choice: "real", paidAllowed: false }).id, "mistral-not-allowed");
  });

  it("sends only the bot's information and retrieved sections to /api/chat, short and not streamed", async () => {
    const { fetch, calls } = fakeFetch("O supermercado fica a 400 metros, na Avenida Principal. [S1]");
    const result = await ask(demoLodging, "Onde fica o supermercado mais perto?", provider(fetch));
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, "http://127.0.0.1:11434/api/chat");
    const body = calls[0].body;
    assert.equal(body.model, "qwen-test");
    assert.equal(body.stream, false);
    assert.ok(body.options.temperature <= 0.3);
    assert.ok(body.options.num_predict <= 200);
    const system = body.messages[0];
    assert.equal(system.role, "system");
    assert.match(system.content, /Use ONLY the business information below/);
    assert.match(system.content, /NEVER share door, keybox, alarm or safe codes/);
    assert.match(system.content, /NO_ANSWER/);
    assert.match(system.content, /Never calculate VAT/);
    assert.match(system.content, /simple arithmetic using only numbers written in the information/);
    assert.match(system.content, /specific date or holiday that the information does not name/);
    const user = body.messages.at(-1);
    assert.equal(user.role, "user");
    assert.match(user.content, /\[S1\]/);
    assert.match(user.content, /Supermercado e farmácia/);
    assert.match(user.content, /Reply in European Portuguese/);
    assert.equal(result.replies[0], "O supermercado fica a 400 metros, na Avenida Principal.");
    assert.equal(result.provider, "ollama:qwen-test");
    assert.equal(result.sources[0].documentTitle, "Guia da casa (exemplo)");
  });

  it("answers in the customer's language", async () => {
    const { fetch, calls } = fakeFetch("There is a public car park on Rua Nova. [E1]");
    await ask(demoRestaurant, "Do you have parking?", provider(fetch), { language: "en" });
    assert.match(calls[0].body.messages.at(-1).content, /Reply in English/);
    assert.match(calls[0].body.messages[0].content, /Answer in English/);
  });

  it("NO_ANSWER becomes «não tenho essa informação» (never invents), also after a sentence", async () => {
    for (const reply of ["NO_ANSWER", "Não tenho a certeza. NO_ANSWER"]) {
      const { fetch } = fakeFetch(reply);
      const result = await ask(demoRestaurant, "Fazem casamentos com fogo de artifício?", provider(fetch));
      assert.match(result.replies[0], /Não tenho essa informação/);
    }
  });

  it("Ollama not running, a missing model or a timeout fall back to the free answers and say why", async () => {
    const refused = fakeFetch("", { error: Object.assign(new TypeError("fetch failed"), { cause: { code: "ECONNREFUSED" } }) });
    let result = await ask(demoRestaurant, "Têm estacionamento?", provider(refused.fetch));
    assert.equal(result.provider, "mock");
    assert.match(result.replies[0], /Rua Nova/);
    assert.match(result.providerNote, /ollama serve/);

    const missing = fakeFetch("model 'qwen-test' not found", { status: 404 });
    result = await ask(demoRestaurant, "Têm estacionamento?", provider(missing.fetch));
    assert.equal(result.provider, "mock");
    assert.match(result.providerNote, /404: model 'qwen-test' not found/);

    const slow = async (_url, init) =>
      new Promise((_resolve, reject) => init.signal.addEventListener("abort", () => reject(init.signal.reason)));
    result = await ask(demoRestaurant, "Têm estacionamento?", provider(slow, { timeoutMs: 20 }));
    assert.equal(result.provider, "mock");
    assert.match(result.replies[0], /Rua Nova/);
    assert.match(result.providerNote, /sem resposta em 0 s/);
  });

  it("on Vercel it never calls anything and the free answers reply", async () => {
    assert.equal(ollamaAvailable({ VERCEL: "1" }), false);
    assert.equal(ollamaAvailable({ VERCEL: "1", OLLAMA_URL: "http://10.0.0.5:11434" }), true);
    assert.equal(ollamaAvailable({}), true);
    const { fetch, calls } = fakeFetch("x");
    const result = await ask(demoRestaurant, "Têm estacionamento?", ollamaFromEnv({ VERCEL: "1" }, fetch));
    assert.equal(calls.length, 0);
    assert.equal(result.provider, "mock");
    assert.match(result.providerNote, /só funciona no computador onde corre o assistente/);
  });

  it("reads OLLAMA_URL and CHATBOT_OLLAMA_MODEL from the environment", async () => {
    const { fetch, calls } = fakeFetch("Há um parque público na Rua Nova. [E1]");
    await ask(demoRestaurant, "Têm estacionamento?", ollamaFromEnv({ OLLAMA_URL: "http://localhost:9999/", CHATBOT_OLLAMA_MODEL: "llama3.2:3b" }, fetch));
    assert.equal(calls[0].url, "http://localhost:9999/api/chat");
    assert.equal(calls[0].body.model, "llama3.2:3b");
  });

  it("one answer at a time: a second message while it is writing gets the free answer", async () => {
    let release;
    const calls = [];
    const fetch = async (url) => {
      calls.push(url);
      await new Promise((resolve) => (release = resolve));
      return { ok: true, status: 200, json: async () => ({ message: { content: "Há um parque público na Rua Nova. [E1]" }, done_reason: "stop" }) };
    };
    const shared = provider(fetch);
    const first = ask(demoRestaurant, "Têm estacionamento?", shared);
    await new Promise((resolve) => setTimeout(resolve, 5));
    const second = await ask(demoRestaurant, "Têm estacionamento?", shared);
    assert.equal(second.provider, "mock");
    assert.match(second.providerNote, /ocupada/);
    release();
    assert.equal((await first).provider, "ollama:qwen-test");
    assert.equal(calls.length, 1);
  });

  it("our cap stops calls so the computer is not held up", async () => {
    const { fetch, calls } = fakeFetch("Há um parque público na Rua Nova. [E1]");
    const capped = provider(fetch, { perMinute: 2 });
    for (let i = 0; i < 4; i++) await ask(demoRestaurant, "Têm estacionamento?", capped);
    assert.equal(calls.length, 2);
    assert.equal(limitFromEnv("50", 10, 30), 30);
    assert.equal(limitFromEnv("5", 10, 30), 5);
  });

  it("an answer cut by the token limit loses its unfinished sentence", async () => {
    assert.equal(completeSentences("Há um parque na Rua Nova. Também pode estacionar na"), "Há um parque na Rua Nova.");
    assert.equal(completeSentences("Sem ponto final"), "");
    const { fetch } = fakeFetch("Há um parque público na Rua Nova [E1]. Também pode estacionar na", { doneReason: "length" });
    const result = await ask(demoRestaurant, "Têm estacionamento?", provider(fetch));
    assert.equal(result.replies[0], "Há um parque público na Rua Nova.");
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
    const parsed = parseGroundedAnswer("O lixo vai para o ecoponto [S1] e o check-out é às 11:00 [E1].", items);
    assert.equal(parsed.text, "O lixo vai para o ecoponto e o check-out é às 11:00.");
    assert.deepEqual(parsed.entryIds, ["e1"]);
    assert.equal(parsed.sources[0].heading, "Guia › Lixo");
  });

  it("also strips gpt-oss references: CJK brackets and several in one", () => {
    const items = [{ ref: "S5", text: "x", source: { documentId: "d", documentTitle: "B", heading: "B", chunkId: "c5" } }, { ref: "S7", text: "y", source: { documentId: "d", documentTitle: "B", heading: "B", chunkId: "c7" } }];
    assert.equal(parseGroundedAnswer("18 € − 2 € = 16 €【S5】【S7】.", items).text, "18 € − 2 € = 16 €.");
    const grouped = parseGroundedAnswer("Custa 16 € [S5, S7].", items);
    assert.equal(grouped.text, "Custa 16 €.");
    assert.equal(grouped.sources.length, 2);
  });
});

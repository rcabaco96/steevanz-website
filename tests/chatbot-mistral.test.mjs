// The AI for clients (Mistral, EU) with a fake HTTP client: no request ever leaves the test (no key, no
// call to api.mistral.ai). Same engine, grounding and fallbacks as the test AIs.
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { demoRestaurant } from "../src/lib/chatbot/demo.ts";
import { respond } from "../src/lib/chatbot/engine.ts";
import { CallLimiter, TokenBudget } from "../src/lib/chatbot/llm/limiter.ts";
import { createMistralProvider, defaultMistralModel, mistralContent, mistralDefaults, mistralFromEnv, mistralUrl } from "../src/lib/chatbot/llm/mistral.ts";
import { chooseProvider } from "../src/lib/chatbot/llm/providers.ts";
import { newConversationState } from "../src/lib/chatbot/types.ts";

const now = new Date("2026-10-21T12:30:00Z");
const fakeKey = "mistral_test_not_a_real_key";

function fakeFetch(reply, { status = 200, finishReason = "stop", error, headers = {}, errorBody } = {}) {
  const calls = [];
  const fetch = async (url, init) => {
    calls.push({ url, init, body: JSON.parse(init.body) });
    if (error) throw error;
    const content = typeof reply === "function" ? reply(calls.at(-1)) : reply;
    return {
      ok: status === 200,
      status,
      headers: { get: (name) => headers[name.toLowerCase()] ?? null },
      json: async () =>
        status === 200
          ? { id: "x", object: "chat.completion", choices: [{ index: 0, message: { role: "assistant", content }, finish_reason: finishReason }], usage: { total_tokens: 900 } }
          : (errorBody ?? { object: "error", message: content, type: "invalid_request_error", code: String(status) }),
    };
  };
  return { fetch, calls };
}

function provider(fetch, options = {}) {
  const clock = options.clock ?? (() => now.getTime());
  return createMistralProvider({
    apiKey: "apiKey" in options ? options.apiKey : fakeKey,
    model: options.model,
    timeoutMs: options.timeoutMs,
    minIntervalMs: options.minIntervalMs ?? 0,
    limiter: new CallLimiter({ perMinute: options.perMinute ?? 30, perDay: options.perDay ?? 500 }, clock),
    tokens: new TokenBudget({ perMinute: options.tokensPerMinute ?? 100_000, perDay: options.tokensPerDay ?? 1_000_000 }, clock),
    botLimits: { perMinute: options.botPerMinute ?? 15, perDay: options.botPerDay ?? 300 },
    clock,
    sleep: options.sleep,
    fetch,
  });
}

function ask(bot, body, answerProvider, { state = {}, history = [], conversationKey = "conversa-1", at = now } = {}) {
  return respond(
    { bot, conversation: { ...newConversationState(), greeted: true, language: "pt", ...state }, history, message: { body, at: at.getTime() }, now: at, conversationKey },
    answerProvider,
  );
}

describe("AI for clients (Mistral, EU; mocked)", () => {
  it("is used only for 'real' with the owner's paid switch on", async () => {
    assert.equal(chooseProvider({ choice: "real", paidAllowed: true, env: {} }).id, "mistral");
    assert.equal(chooseProvider({ choice: "real", paidAllowed: false, env: { MISTRAL_API_KEY: fakeKey } }).id, "mistral-not-allowed");
    assert.equal(chooseProvider({ choice: "mock", paidAllowed: true, env: { MISTRAL_API_KEY: fakeKey } }).id, "mock");
    assert.equal(chooseProvider({ choice: "groq", paidAllowed: true, env: { MISTRAL_API_KEY: fakeKey } }).id, "groq");
    // Not authorised: no request at all, the free answers reply and say why.
    const { fetch, calls } = fakeFetch("x");
    const result = await ask(demoRestaurant, "Têm estacionamento?", chooseProvider({ choice: "real", paidAllowed: false, env: { MISTRAL_API_KEY: fakeKey }, fetch }));
    assert.equal(calls.length, 0);
    assert.equal(result.provider, "mock");
    assert.match(result.replies[0], /Rua Nova/);
    assert.match(result.providerNote, /falta o dono autorizar a IA paga/);
  });

  it("sends one short, grounded chat completion with the key only in the Authorization header", async () => {
    const { fetch, calls } = fakeFetch("Há um parque público na Rua Nova. [E1]");
    const result = await ask(demoRestaurant, "Têm estacionamento?", provider(fetch));
    assert.equal(calls.length, 1);
    const { url, init, body } = calls[0];
    assert.equal(url, mistralUrl);
    assert.equal(url, "https://api.mistral.ai/v1/chat/completions");
    assert.equal(init.method, "POST");
    assert.equal(init.headers.Authorization, `Bearer ${fakeKey}`);
    assert.equal(init.headers["Content-Type"], "application/json");
    assert.ok(!init.body.includes(fakeKey));
    assert.ok(init.signal);
    assert.equal(body.model, defaultMistralModel);
    assert.equal(body.model, "mistral-small-latest");
    assert.equal(body.stream, false);
    assert.ok(body.temperature <= 0.3);
    assert.ok(body.max_tokens <= 400);
    // Mistral Small 4 answers without thinking (cheaper and faster).
    assert.equal(body.reasoning_effort, "none");
    assert.equal(body.messages[0].role, "system");
    assert.match(body.messages[0].content, /Use ONLY the business information below/);
    assert.match(body.messages[0].content, /NO_ANSWER/);
    assert.match(body.messages[0].content, /Never calculate VAT/);
    const user = body.messages.at(-1);
    assert.equal(user.role, "user");
    assert.match(user.content, /\[E1\]/);
    assert.match(user.content, /Reply in European Portuguese/);
    assert.equal(result.replies[0], "Há um parque público na Rua Nova.");
    assert.equal(result.provider, "mistral:mistral-small-latest");
    assert.equal(result.providerNote, null);
  });

  it("another model gets no reasoning parameter; CHATBOT_MISTRAL_MODEL picks it", async () => {
    const { fetch, calls } = fakeFetch("Há um parque público na Rua Nova. [E1]");
    await ask(demoRestaurant, "Têm estacionamento?", provider(fetch, { model: "mistral-medium-latest" }));
    assert.equal(calls[0].body.model, "mistral-medium-latest");
    assert.equal("reasoning_effort" in calls[0].body, false);
    const env = fakeFetch("Há um parque público na Rua Nova. [E1]");
    const result = await ask(demoRestaurant, "Têm estacionamento?", mistralFromEnv({ MISTRAL_API_KEY: fakeKey, CHATBOT_MISTRAL_MODEL: "ministral-8b-latest", CHATBOT_MISTRAL_MIN_INTERVAL_MS: "1" }, env.fetch));
    assert.equal(env.calls[0].body.model, "ministral-8b-latest");
    assert.equal(result.provider, "mistral:ministral-8b-latest");
  });

  it("reads a chunk list (text chunks only, thinking left out)", () => {
    assert.equal(mistralContent("Olá."), "Olá.");
    assert.equal(mistralContent([{ type: "thinking", thinking: [{ type: "text", text: "pensar" }] }, { type: "text", text: "O corte custa 16 €." }]), "O corte custa 16 €.");
    assert.equal(mistralContent(null), "");
  });

  it("answers in the customer's language", async () => {
    const { fetch, calls } = fakeFetch("There is a public car park on Rua Nova. [E1]");
    const result = await ask(demoRestaurant, "Do you have parking?", provider(fetch), { state: { language: "en" } });
    assert.match(calls[0].body.messages.at(-1).content, /Reply in English/);
    assert.match(calls[0].body.messages[0].content, /Answer in English/);
    assert.equal(result.replies[0], "There is a public car park on Rua Nova.");
  });

  it("gets the conversation and the earlier question of a follow-up", async () => {
    const { fetch, calls } = fakeFetch("Ao domingo estamos fechados. [E1]");
    const history = [
      { author: "customer", body: "Têm estacionamento?", at: now.getTime() - 120_000 },
      { author: "bot", body: "Há um parque público na Rua Nova.", at: now.getTime() - 119_000 },
    ];
    await ask(demoRestaurant, "E ao domingo?", provider(fetch), { history });
    const messages = calls[0].body.messages;
    assert.deepEqual(
      messages.slice(1, -1).map((message) => [message.role, message.content]),
      [
        ["user", "Têm estacionamento?"],
        ["assistant", "Há um parque público na Rua Nova."],
      ],
    );
    assert.match(messages.at(-1).content, /Customer message:\nE ao domingo\?/);
  });

  it("NO_ANSWER becomes «não tenho essa informação» (never invents)", async () => {
    for (const reply of ["NO_ANSWER", "Não sei. NO_ANSWER", [{ type: "text", text: "NO_ANSWER" }]]) {
      const { fetch } = fakeFetch(reply);
      const result = await ask(demoRestaurant, "Fazem casamentos com fogo de artifício?", provider(fetch));
      assert.match(result.replies[0], /Não tenho essa informação/);
      assert.equal(result.conversation.offeredHandoff, true);
    }
  });

  it("without a key: no call, the free answers say why", async () => {
    const noKey = fakeFetch("x");
    const result = await ask(demoRestaurant, "Têm estacionamento?", provider(noKey.fetch, { apiKey: null }));
    assert.equal(noKey.calls.length, 0);
    assert.equal(result.provider, "mock");
    assert.match(result.replies[0], /Rua Nova/);
    assert.match(result.providerNote, /falta a chave MISTRAL_API_KEY/);
  });

  it("HTTP 429: the free answers reply, Mistral pauses for retry-after, and nothing is retried", async () => {
    let time = now.getTime();
    const clock = () => time;
    const limited = fakeFetch("Requests rate limit exceeded", { status: 429, headers: { "retry-after": "30" } });
    const mistral = provider(limited.fetch, { clock });
    let result = await ask(demoRestaurant, "Têm estacionamento?", mistral);
    assert.equal(limited.calls.length, 1);
    assert.equal(result.provider, "mock");
    assert.match(result.replies[0], /Rua Nova/);
    assert.match(result.providerNote, /limite da Mistral atingido \(429\)/);
    time += 10_000;
    result = await ask(demoRestaurant, "Têm estacionamento?", mistral);
    assert.equal(limited.calls.length, 1, "no call while paused");
    assert.match(result.providerNote, /volta a tentar daqui a 20 s/);
    time += 21_000;
    await ask(demoRestaurant, "Têm estacionamento?", mistral);
    assert.equal(limited.calls.length, 2, "one new call after the pause");
  });

  it("a billing answer or a refused key (401) turns Mistral off; other errors and a timeout fall back once each", async () => {
    const billing = fakeFetch("Payment required: no active billing plan", { status: 402 });
    const paying = provider(billing.fetch);
    await ask(demoRestaurant, "Têm estacionamento?", paying);
    let result = await ask(demoRestaurant, "Têm estacionamento?", paying);
    assert.equal(billing.calls.length, 1);
    assert.equal(result.provider, "mock");
    assert.match(result.providerNote, /pediu pagamento ou um plano: desligada/);

    const refused = fakeFetch("Unauthorized", { status: 401, errorBody: { message: "Unauthorized", request_id: "r" } });
    const mistral = provider(refused.fetch);
    await ask(demoRestaurant, "Têm estacionamento?", mistral);
    result = await ask(demoRestaurant, "Têm estacionamento?", mistral);
    assert.equal(refused.calls.length, 1);
    assert.match(result.providerNote, /MISTRAL_API_KEY recusada \(401\)/);

    const broken = fakeFetch("Internal server error", { status: 500 });
    result = await ask(demoRestaurant, "Têm estacionamento?", provider(broken.fetch));
    assert.equal(broken.calls.length, 1);
    assert.match(result.providerNote, /Mistral respondeu 500: Internal server error/);

    const invalid = fakeFetch("", { status: 422, errorBody: { detail: [{ type: "missing", loc: ["body", "model"], msg: "Field required" }] } });
    result = await ask(demoRestaurant, "Têm estacionamento?", provider(invalid.fetch));
    assert.match(result.providerNote, /Mistral respondeu 422: .*Field required/);

    const offline = fakeFetch("", { error: new TypeError("fetch failed") });
    result = await ask(demoRestaurant, "Têm estacionamento?", provider(offline.fetch));
    assert.match(result.providerNote, /não consegui ligar à Mistral/);

    let slowCalls = 0;
    const slow = async (_url, init) => {
      slowCalls++;
      return new Promise((_resolve, reject) => init.signal.addEventListener("abort", () => reject(init.signal.reason)));
    };
    result = await ask(demoRestaurant, "Têm estacionamento?", provider(slow, { timeoutMs: 20 }));
    assert.equal(slowCalls, 1);
    assert.equal(result.provider, "mock");
    assert.match(result.replies[0], /Rua Nova/);
    assert.match(result.providerNote, /sem resposta em 0 s/);
  });

  it("caps: per process, per bot and tokens; free-plan defaults", async () => {
    assert.equal(mistralDefaults.perMinute.value, 30);
    assert.equal(mistralDefaults.perDay.value, 500);
    assert.ok(mistralDefaults.minIntervalMs.value >= 1000);

    const perProcess = fakeFetch("Há um parque público na Rua Nova. [E1]");
    const capped = provider(perProcess.fetch, { perMinute: 2 });
    for (let i = 0; i < 4; i++) {
      const result = await ask(demoRestaurant, "Têm estacionamento?", capped);
      if (i >= 2) assert.match(result.providerNote, /limite de pedidos atingido/);
    }
    assert.equal(perProcess.calls.length, 2);

    const perBot = fakeFetch("Há um parque público na Rua Nova. [E1]");
    const shared = provider(perBot.fetch, { botPerDay: 1 });
    await ask(demoRestaurant, "Têm estacionamento?", shared);
    await ask(demoRestaurant, "Têm estacionamento?", shared);
    await ask({ ...demoRestaurant, id: "outro-bot" }, "Têm estacionamento?", shared);
    assert.equal(perBot.calls.length, 2, "one for each bot");

    const tokens = fakeFetch("Há um parque público na Rua Nova. [E1]");
    const result = await ask(demoRestaurant, "Têm estacionamento?", provider(tokens.fetch, { tokensPerDay: 300 }));
    assert.equal(tokens.calls.length, 0);
    assert.match(result.providerNote, /limite de tokens atingido/);
  });

  it("≈ 1 request per second: a second request waits its turn; a long queue is refused, never retried", async () => {
    const waits = [];
    const { fetch, calls } = fakeFetch("Há um parque público na Rua Nova. [E1]");
    const mistral = provider(fetch, { minIntervalMs: 1100, sleep: async (ms) => void waits.push(ms) });
    await ask(demoRestaurant, "Têm estacionamento?", mistral, { conversationKey: "a" });
    await ask(demoRestaurant, "Têm estacionamento?", mistral, { conversationKey: "b" });
    await ask(demoRestaurant, "Têm estacionamento?", mistral, { conversationKey: "c" });
    assert.deepEqual(waits, [1100, 2200]);
    const result = await ask(demoRestaurant, "Têm estacionamento?", mistral, { conversationKey: "d" });
    assert.equal(calls.length, 3);
    assert.match(result.providerNote, /demasiados pedidos ao mesmo tempo/);
  });

  it("one answer in flight per conversation", async () => {
    let release;
    const fetch = async () => {
      await new Promise((resolve) => (release = resolve));
      return { ok: true, status: 200, headers: { get: () => null }, json: async () => ({ choices: [{ message: { content: "Há um parque público na Rua Nova. [E1]" }, finish_reason: "stop" }] }) };
    };
    const mistral = provider(fetch);
    const first = ask(demoRestaurant, "Têm estacionamento?", mistral);
    await new Promise((resolve) => setImmediate(resolve));
    const second = await ask(demoRestaurant, "Têm estacionamento?", mistral);
    assert.match(second.providerNote, /ainda a responder à mensagem anterior/);
    release();
    assert.equal((await first).provider, "mistral:mistral-small-latest");
  });

  it("a link the model was never given is dropped (shared grounding)", async () => {
    const { fetch } = fakeFetch("Há um parque público na Rua Nova. [E1] Veja o mapa em https://mapas-inventados.pt/rua-nova.");
    const result = await ask(demoRestaurant, "Têm estacionamento?", provider(fetch));
    assert.equal(result.replies[0], "Há um parque público na Rua Nova.");
  });

  it("an answer cut by max_tokens keeps only whole sentences", async () => {
    const { fetch } = fakeFetch("Há um parque público na Rua Nova. [E1] Também há lugares na", { finishReason: "length" });
    const result = await ask(demoRestaurant, "Têm estacionamento?", provider(fetch));
    assert.equal(result.replies[0], "Há um parque público na Rua Nova.");
  });
});

// The Groq free-tier test provider with a fake HTTP client: no request ever leaves the test (no key,
// no call to api.groq.com). Also the improved grounding shared with Ollama (barbershop fixture).
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { demoLodging, demoRestaurant } from "../src/lib/chatbot/demo.ts";
import { splitIntoChunks } from "../src/lib/chatbot/documents.ts";
import { respond } from "../src/lib/chatbot/engine.ts";
import { createGroqProvider, defaultGroqModel, groqEnabled, groqFromEnv, groqUrl, isBillingError } from "../src/lib/chatbot/llm/groq.ts";
import { CallLimiter, TokenBudget } from "../src/lib/chatbot/llm/limiter.ts";
import { createOllamaProvider } from "../src/lib/chatbot/llm/ollama.ts";
import { chooseProvider } from "../src/lib/chatbot/llm/providers.ts";
import { newConversationState } from "../src/lib/chatbot/types.ts";

const now = new Date("2026-10-21T12:30:00Z");
const fakeKey = "gsk_test_not_a_real_key";

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
          ? { choices: [{ message: { role: "assistant", content }, finish_reason: finishReason }], usage: { total_tokens: 900 } }
          : (errorBody ?? { error: { message: content, type: "invalid_request_error" } }),
    };
  };
  return { fetch, calls };
}

function provider(fetch, options = {}) {
  const clock = options.clock ?? (() => now.getTime());
  return createGroqProvider({
    enabled: options.enabled ?? true,
    apiKey: "apiKey" in options ? options.apiKey : fakeKey,
    model: options.model,
    timeoutMs: options.timeoutMs,
    limiter: new CallLimiter({ perMinute: options.perMinute ?? 20, perDay: options.perDay ?? 300 }, clock),
    tokens: new TokenBudget({ perMinute: options.tokensPerMinute ?? 9000, perDay: options.tokensPerDay ?? 80000 }, clock),
    botLimits: { perMinute: options.botPerMinute ?? 10, perDay: options.botPerDay ?? 150 },
    clock,
    fetch,
  });
}

function ask(bot, body, answerProvider, { state = {}, conversationKey = "conversa-1" } = {}) {
  return respond(
    { bot, conversation: { ...newConversationState(), greeted: true, language: "pt", ...state }, history: [], message: { body, at: now.getTime() }, now, conversationKey },
    answerProvider,
  );
}

const fixture = (name) => readFileSync(new URL(`./fixtures/${name}`, import.meta.url), "utf8");
const title = "Guia da barbearia (teste)";
const toChunks = (parts) => parts.map((part, index) => ({ id: `c${index}`, documentId: "barbearia", documentTitle: title, property: null, language: "pt", ...part }));
const barbershopVersions = {
  structured: toChunks(splitIntoChunks(fixture("barbearia-fio-de-navalha.txt"), title)),
  flat: toChunks(splitIntoChunks(fixture("barbearia-fio-de-navalha.txt").replace(/\s+/g, " "), title)),
  whatsapp: toChunks(splitIntoChunks(fixture("barbearia-fio-de-navalha-whatsapp.txt"), title)),
};
const barbershop = (chunks) => ({ ...demoLodging, id: "barbearia-bot", knowledge: { ...demoLodging.knowledge, kind: "beauty", businessName: "Fio de Navalha", entries: [], properties: [], chunks } });

describe("chatbot test AI (Groq free tier, mocked)", () => {
  it("is chosen only as 'groq', never for the paid switch", () => {
    assert.equal(chooseProvider({ choice: "groq", paidAllowed: false, env: {} }).id, "groq");
    assert.equal(chooseProvider({ choice: "mock", paidAllowed: true, env: { GROQ_API_KEY: fakeKey, CHATBOT_GROQ_ENABLED: "1" } }).id, "mock");
    assert.equal(groqEnabled({ CHATBOT_GROQ_ENABLED: "1" }), true);
    assert.equal(groqEnabled({ CHATBOT_GROQ_ENABLED: "true" }), false);
    assert.equal(groqEnabled({}), false);
  });

  it("sends one short, grounded chat completion with the key only in the Authorization header", async () => {
    const { fetch, calls } = fakeFetch("Há um parque público na Rua Nova. [E1]");
    const result = await ask(demoRestaurant, "Têm estacionamento?", provider(fetch));
    assert.equal(calls.length, 1);
    const { url, init, body } = calls[0];
    assert.equal(url, groqUrl);
    assert.equal(url, "https://api.groq.com/openai/v1/chat/completions");
    assert.equal(init.method, "POST");
    assert.equal(init.headers.Authorization, `Bearer ${fakeKey}`);
    assert.equal(init.headers["Content-Type"], "application/json");
    assert.ok(!init.body.includes(fakeKey));
    assert.ok(init.signal);
    assert.equal(body.model, defaultGroqModel);
    assert.equal(body.model, "openai/gpt-oss-120b");
    assert.equal(body.stream, false);
    assert.ok(body.temperature <= 0.3);
    // gpt-oss thinks first: little thinking, hidden, with room for it in max_tokens.
    assert.equal(body.reasoning_effort, "low");
    assert.equal(body.include_reasoning, false);
    assert.ok(body.max_tokens <= 1000);
    const system = body.messages[0];
    assert.equal(system.role, "system");
    assert.match(system.content, /Use ONLY the business information below/);
    assert.match(system.content, /NO_ANSWER/);
    assert.match(system.content, /Never calculate VAT/);
    assert.match(system.content, /simple arithmetic using only numbers written in the information/);
    assert.match(system.content, /specific date or holiday that the information does not name explicitly/);
    assert.match(system.content, /Today: Wednesday, 21 October 2026/);
    const user = body.messages.at(-1);
    assert.equal(user.role, "user");
    assert.match(user.content, /\[E1\]/);
    assert.match(user.content, /Reply in European Portuguese/);
    assert.equal(result.replies[0], "Há um parque público na Rua Nova.");
    assert.equal(result.provider, "groq:openai/gpt-oss-120b");
    assert.equal(result.providerNote, null);
  });

  it("answers in the customer's language", async () => {
    const { fetch, calls } = fakeFetch("There is a public car park on Rua Nova. [E1]");
    const result = await ask(demoRestaurant, "Do you have parking?", provider(fetch), { state: { language: "en" } });
    assert.match(calls[0].body.messages.at(-1).content, /Reply in English/);
    assert.match(calls[0].body.messages[0].content, /Answer in English/);
    assert.equal(result.replies[0], "There is a public car park on Rua Nova.");
  });

  it("NO_ANSWER becomes «não tenho essa informação» (never invents)", async () => {
    for (const reply of ["NO_ANSWER", "Não sei bem. NO_ANSWER"]) {
      const { fetch } = fakeFetch(reply);
      const result = await ask(demoRestaurant, "Fazem casamentos com fogo de artifício?", provider(fetch));
      assert.match(result.replies[0], /Não tenho essa informação/);
      assert.equal(result.conversation.offeredHandoff, true);
    }
  });

  it("switched off (no CHATBOT_GROQ_ENABLED) or without a key: no call, the free answers say why", async () => {
    const off = fakeFetch("x");
    let result = await ask(demoRestaurant, "Têm estacionamento?", provider(off.fetch, { enabled: false }));
    assert.equal(off.calls.length, 0);
    assert.equal(result.provider, "mock");
    assert.match(result.replies[0], /Rua Nova/);
    assert.match(result.providerNote, /CHATBOT_GROQ_ENABLED=1/);

    const noKey = fakeFetch("x");
    result = await ask(demoRestaurant, "Têm estacionamento?", provider(noKey.fetch, { apiKey: null }));
    assert.equal(noKey.calls.length, 0);
    assert.equal(result.provider, "mock");
    assert.match(result.providerNote, /falta a chave GROQ_API_KEY/);
  });

  it("HTTP 429: the free answers reply, Groq pauses for retry-after, and nothing is retried", async () => {
    let time = now.getTime();
    const clock = () => time;
    const limited = fakeFetch("Rate limit reached. Need more tokens? Upgrade to Dev Tier today.", { status: 429, headers: { "retry-after": "30" } });
    const groq = provider(limited.fetch, { clock });
    let result = await ask(demoRestaurant, "Têm estacionamento?", groq);
    assert.equal(limited.calls.length, 1);
    assert.equal(result.provider, "mock");
    assert.match(result.replies[0], /Rua Nova/);
    assert.match(result.providerNote, /limite gratuito da Groq atingido \(429\)/);
    time += 10_000;
    result = await ask(demoRestaurant, "Têm estacionamento?", groq);
    assert.equal(limited.calls.length, 1, "no call while paused");
    assert.match(result.providerNote, /volta a tentar daqui a 20 s/);
    time += 21_000;
    await ask(demoRestaurant, "Têm estacionamento?", groq);
    assert.equal(limited.calls.length, 2, "one new call after the pause (a 429 is not a billing error)");
  });

  it("a billing/upgrade answer (no paid plan, ever) turns Groq off for good", async () => {
    assert.equal(isBillingError(402, ""), true);
    assert.equal(isBillingError(400, "Please upgrade to a paid plan to use this model"), true);
    assert.equal(isBillingError(429, "Upgrade to Dev Tier today"), false);
    assert.equal(isBillingError(500, "Internal server error"), false);
    const billing = fakeFetch("This model requires a paid plan. Add billing information to upgrade.", { status: 400 });
    const groq = provider(billing.fetch);
    let result = await ask(demoRestaurant, "Têm estacionamento?", groq);
    assert.equal(result.provider, "mock");
    assert.match(result.providerNote, /plano pago: desligada/);
    result = await ask(demoRestaurant, "Têm estacionamento?", groq);
    assert.equal(billing.calls.length, 1);
    assert.match(result.providerNote, /plano pago: desligada/);
  });

  it("a refused key (401) stops calling; other errors and a timeout fall back once each", async () => {
    const refused = fakeFetch("Invalid API Key", { status: 401 });
    const groq = provider(refused.fetch);
    await ask(demoRestaurant, "Têm estacionamento?", groq);
    const result401 = await ask(demoRestaurant, "Têm estacionamento?", groq);
    assert.equal(refused.calls.length, 1);
    assert.match(result401.providerNote, /GROQ_API_KEY recusada \(401\)/);

    const broken = fakeFetch("Internal server error", { status: 500 });
    let result = await ask(demoRestaurant, "Têm estacionamento?", provider(broken.fetch));
    assert.equal(broken.calls.length, 1);
    assert.equal(result.provider, "mock");
    assert.match(result.providerNote, /Groq respondeu 500: Internal server error/);

    const offline = fakeFetch("", { error: new TypeError("fetch failed") });
    result = await ask(demoRestaurant, "Têm estacionamento?", provider(offline.fetch));
    assert.match(result.providerNote, /não consegui ligar à Groq/);

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

  it("caps: per process, per bot and tokens", async () => {
    const perProcess = fakeFetch("Há um parque público na Rua Nova. [E1]");
    const capped = provider(perProcess.fetch, { perMinute: 2 });
    for (let i = 0; i < 4; i++) {
      const result = await ask(demoRestaurant, "Têm estacionamento?", capped);
      if (i >= 2) assert.match(result.providerNote, /limite de testes atingido/);
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
    assert.match(result.providerNote, /limite de tokens de teste atingido/);

    const budget = new TokenBudget({ perMinute: 1000, perDay: 1500 }, () => now.getTime());
    assert.equal(budget.allows(900), true);
    budget.record(900);
    assert.equal(budget.allows(200), false, "per minute");
    assert.equal(budget.usedToday, 900);
  });

  it("one answer in flight per conversation; other conversations are not held up", async () => {
    const releases = [];
    const calls = [];
    const fetch = async (url) => {
      calls.push(url);
      await new Promise((resolve) => releases.push(resolve));
      return { ok: true, status: 200, json: async () => ({ choices: [{ message: { content: "Há um parque público na Rua Nova. [E1]" }, finish_reason: "stop" }] }) };
    };
    const groq = provider(fetch);
    const first = ask(demoRestaurant, "Têm estacionamento?", groq, { conversationKey: "a" });
    await new Promise((resolve) => setTimeout(resolve, 5));
    const same = await ask(demoRestaurant, "Têm estacionamento?", groq, { conversationKey: "a" });
    assert.equal(same.provider, "mock");
    assert.match(same.providerNote, /ainda a responder à mensagem anterior/);
    const other = ask(demoRestaurant, "Têm estacionamento?", groq, { conversationKey: "b" });
    await new Promise((resolve) => setTimeout(resolve, 5));
    assert.equal(calls.length, 2);
    releases.forEach((release) => release());
    assert.equal((await first).provider, "groq:openai/gpt-oss-120b");
    assert.equal((await other).provider, "groq:openai/gpt-oss-120b");
  });

  it("an answer cut by max_tokens loses its unfinished sentence", async () => {
    const { fetch } = fakeFetch("Há um parque público na Rua Nova [E1]. Também pode estacionar na", { finishReason: "length" });
    const result = await ask(demoRestaurant, "Têm estacionamento?", provider(fetch));
    assert.equal(result.replies[0], "Há um parque público na Rua Nova.");
  });

  it("safety rules run before and after Groq", async () => {
    const { fetch, calls } = fakeFetch("Claro! O código da porta é 4821. [E1]");
    const emergency = await ask(demoLodging, "Socorro, há fogo na cozinha! pegou fogo", provider(fetch));
    assert.match(emergency.replies[0], /112/);
    assert.equal(calls.length, 0);
    const result = await ask(demoLodging, "Como entro em casa?", provider(fetch), { state: { property: "Casa do Rio" } });
    assert.ok(!result.replies.join(" ").includes("4821"));
  });

  it("reads GROQ_API_KEY, CHATBOT_GROQ_ENABLED and CHATBOT_GROQ_MODEL from the environment", async () => {
    const { fetch, calls } = fakeFetch("Há um parque público na Rua Nova. [E1]");
    await ask(demoRestaurant, "Têm estacionamento?", groqFromEnv({ GROQ_API_KEY: ` ${fakeKey} `, CHATBOT_GROQ_ENABLED: "1", CHATBOT_GROQ_MODEL: "llama-3.1-8b-instant" }, fetch));
    assert.equal(calls[0].body.model, "llama-3.1-8b-instant");
    assert.equal(calls[0].init.headers.Authorization, `Bearer ${fakeKey}`);
    const off = fakeFetch("x");
    const result = await ask(demoRestaurant, "Têm estacionamento?", groqFromEnv({ GROQ_API_KEY: fakeKey }, off.fetch));
    assert.equal(off.calls.length, 0);
    assert.match(result.providerNote, /CHATBOT_GROQ_ENABLED/);
  });
});

describe("chatbot AI grounding: the right lines reach the model (barbershop fixture)", () => {
  /** Question → lines the excerpts must contain. */
  const cases = [
    ["Quanto custa um corte?", "pt", [/Corte clássico[^\n]*16 ?€/]],
    ["How much is a haircut?", "en", [/Corte clássico[^\n]*16 ?€/, /Degradê[^\n]*18 ?€/]],
    ["Sou estudante, quanto pago por um degradê na quarta?", "pt", [/Degradê \/ fade[^\n]*18 ?€/, /[Ee]studantes:? 2 ?€ de desconto[^\n]*terça a quinta/]],
    ["Abrem no dia 8 de dezembro?", "pt", [/1 de janeiro[^\n]*25 (de dezembro )?e 26 de dezembro/, /outros feriados abrimos com o horário de sábado/, /Sábado:? 09:00–18:00/]],
  ];
  for (const [version, chunks] of Object.entries(barbershopVersions)) {
    describe(version, () => {
      for (const [question, language, must] of cases) {
        it(question, async () => {
          const { fetch, calls } = fakeFetch("NO_ANSWER");
          await ask(barbershop(chunks), question, provider(fetch), { state: { language } });
          assert.equal(calls.length, 1);
          const user = calls[0].body.messages.at(-1).content;
          const excerpts = user.slice(0, user.indexOf("Customer message:"));
          for (const pattern of must) assert.match(excerpts, pattern, `${question} →\n${excerpts}`);
          // Small enough for the free tier's tokens per minute.
          assert.ok(JSON.stringify(calls[0].body.messages).length < 9000);
        });
      }
    });
  }

  it("the model's sources point at the document; the arithmetic answer passes through", async () => {
    const reply = (call) => {
      const user = call.body.messages.at(-1).content;
      const price = user.match(/\[(S\d+)\][^\n]*Degradê \/ fade[^\n]*18 €/)[1];
      const discount = user.match(/\[(S\d+)\][^\n]*Estudantes: 2 € de desconto/)[1];
      return `Com cartão de estudante, à quarta o degradê fica 18 € − 2 € = 16 € [${price}] [${discount}].`;
    };
    const { fetch } = fakeFetch(reply);
    const result = await ask(barbershop(barbershopVersions.structured), "Sou estudante, quanto pago por um degradê na quarta?", provider(fetch));
    assert.equal(result.replies[0], "Com cartão de estudante, à quarta o degradê fica 18 € − 2 € = 16 €.");
    assert.ok(result.sources.length >= 1);
    assert.equal(result.sources[0].documentTitle, title);
  });

  it("Ollama gets the same improved excerpts and rules", async () => {
    const calls = [];
    const fetch = async (url, init) => {
      calls.push(JSON.parse(init.body));
      return { ok: true, status: 200, json: async () => ({ message: { content: "NO_ANSWER" }, done_reason: "stop" }) };
    };
    const ollama = createOllamaProvider({ url: "http://127.0.0.1:11434", model: "qwen-test", limiter: new CallLimiter({ perMinute: 10, perDay: 100 }, () => now.getTime()), fetch });
    await ask(barbershop(barbershopVersions.structured), "Sou estudante, quanto pago por um degradê na quarta?", ollama);
    const user = calls[0].messages.at(-1).content;
    assert.match(user, /Degradê \/ fade[^\n]*18 €/);
    assert.match(user, /Estudantes: 2 € de desconto/);
    assert.match(calls[0].messages[0].content, /simple arithmetic using only numbers written in the information/);
  });
});

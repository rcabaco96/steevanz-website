import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { FakeAdapter } from "../src/lib/chatbot/adapters.ts";
import { demoLodging, demoRestaurant } from "../src/lib/chatbot/demo.ts";
import { createRuntime } from "../src/lib/chatbot/runtime.ts";
import { MemoryStore } from "../src/lib/chatbot/store.ts";

// Tuesday 2026-10-20 13:30 in Lisbon.
const start = new Date("2026-10-20T12:30:00Z").getTime();

function setup(bot = demoRestaurant) {
  let now = start;
  const adapter = new FakeAdapter();
  const store = new MemoryStore();
  const handoffs = [];
  const runtime = createRuntime({
    bot,
    adapter,
    store,
    clock: () => now,
    sleep: async (ms) => {
      now += ms;
    },
    random: () => 0.5,
    onHandoff: (event) => handoffs.push(event),
  });
  const message = (chatId, body, extra = {}) => ({
    chatId,
    body,
    messageId: `${chatId}-${Math.random()}`,
    fromOwner: false,
    at: now,
    kind: "text",
    isGroup: false,
    ...extra,
  });
  return { adapter, store, runtime, handoffs, message, advance: (ms) => (now += ms), now: () => now };
}

describe("chatbot runtime", () => {
  it("replies, keeps the conversation and stores both sides", async () => {
    const { adapter, store, runtime, message } = setup();
    const outcome = await runtime.handle(message("351910000001@c.us", "Olá, têm estacionamento?"));
    assert.equal(outcome.status, "replied");
    assert.equal(adapter.sent.length, 2);
    assert.match(adapter.sent[0].text, /assistente automático/);
    assert.match(adapter.sent[1].text, /Rua Nova/);
    const conversation = store.conversations.get("demo-restaurante:351910000001@c.us");
    assert.deepEqual(conversation.messages.map((m) => m.author), ["customer", "bot", "bot"]);
  });

  it("never answers groups", async () => {
    const { adapter, runtime, message } = setup();
    assert.equal((await runtime.handle(message("123@g.us", "Olá", { isGroup: true }))).status, "ignored");
    assert.equal(adapter.sent.length, 0);
  });

  it("processes a message only once (reconnections deliver duplicates)", async () => {
    const { adapter, runtime, message } = setup();
    const first = message("351910000002@c.us", "Olá");
    await runtime.handle(first);
    assert.equal((await runtime.handle(first)).status, "duplicate");
    assert.equal(adapter.sent.length, 2);
  });

  it("does not auto-reply to old messages after a reconnection", async () => {
    const { adapter, runtime, message, now } = setup();
    const outcome = await runtime.handle(message("351910000003@c.us", "Olá", { at: now() - 60 * 60_000 }));
    assert.equal(outcome.status, "stale");
    assert.equal(adapter.sent.length, 0);
  });

  it("the owner answering from the phone takes the chat over; the bot then stays quiet", async () => {
    const { adapter, store, runtime, message, advance } = setup();
    const chat = "351910000004@c.us";
    await runtime.handle(message(chat, "Olá"));
    advance(5_000);
    assert.equal((await runtime.handle(message(chat, "Já lhe ligo!", { fromOwner: true }))).status, "owner");
    advance(5_000);
    const outcome = await runtime.handle(message(chat, "Obrigado, fico à espera"));
    assert.equal(outcome.status, "silent");
    assert.equal(adapter.sent.length, 2);
    const conversation = store.conversations.get(`demo-restaurante:${chat}`);
    assert.equal(conversation.state.mode, "human");
    assert.equal(conversation.state.handoffReason, "owner_took_over");
  });

  it("recognises its own sent messages echoed back as «from me»", async () => {
    const { adapter, runtime, message } = setup();
    const chat = "351910000005@c.us";
    await runtime.handle(message(chat, "Olá"));
    const echo = adapter.sent[0];
    const outcome = await runtime.handle(message(chat, echo.text, { fromOwner: true, messageId: echo.messageId }));
    assert.equal(outcome.status, "own_echo");
  });

  it("tells the team on a hand-off, with the summary", async () => {
    const { runtime, handoffs, message } = setup();
    await runtime.handle(message("351910000006@c.us", "Quero falar com uma pessoa, por favor"));
    assert.equal(handoffs.length, 1);
    assert.equal(handoffs[0].handoff.reason, "customer_asked");
    assert.match(handoffs[0].handoff.summary, /pediu para falar com uma pessoa/);
  });

  it("handles one chat in order even when messages arrive together", async () => {
    const { adapter, runtime, message } = setup();
    const chat = "351910000007@c.us";
    await Promise.all([runtime.handle(message(chat, "Olá")), runtime.handle(message(chat, "A que horas fecham?"))]);
    assert.match(adapter.sent[0].text, /assistente automático/);
    assert.match(adapter.sent.at(-1).text, /15:00/);
  });

  it("lodging: answers the earlier question once the guest names the property", async () => {
    const { adapter, runtime, message, advance } = setup(demoLodging);
    const chat = "447700900000@c.us";
    await runtime.handle(message(chat, "Hi! What's the wifi password?"));
    assert.match(adapter.sent.at(-1).text, /Which of our properties/);
    advance(20_000);
    await runtime.handle(message(chat, "Moinho Velho"));
    assert.match(adapter.sent.at(-1).text, /moinho-verde/);
  });
});

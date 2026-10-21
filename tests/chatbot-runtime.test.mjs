import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { FakeAdapter } from "../src/lib/chatbot/adapters.ts";
import { demoLodging, demoRestaurant } from "../src/lib/chatbot/demo.ts";
import { pilotPacing, Pacer, typingDelay } from "../src/lib/chatbot/pacing.ts";
import { createRuntime, isAllowed, phoneOfChat } from "../src/lib/chatbot/runtime.ts";
import { MemoryStore } from "../src/lib/chatbot/store.ts";

// Tuesday 2026-10-20 13:30 in Lisbon.
const start = new Date("2026-10-20T12:30:00Z").getTime();

function setup(bot = demoRestaurant, extra = {}) {
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
    ...extra,
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
    // No introduction message (owner's decision, 2026-10-21): only the answer.
    assert.equal(adapter.sent.length, 1);
    assert.match(adapter.sent[0].text, /Rua Nova/);
    assert.doesNotMatch(adapter.sent[0].text, /assistente automático/);
    const conversation = store.conversations.get("demo-restaurante:351910000001@c.us");
    assert.deepEqual(conversation.messages.map((m) => m.author), ["customer", "bot"]);
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
    assert.equal(adapter.sent.length, 1);
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
    assert.equal(adapter.sent.length, 1);
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
    assert.equal(adapter.sent[0].text, "Olá! Em que posso ajudar?");
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

describe("chatbot pilot safety (open-wa test number)", () => {
  it("reads phone numbers from chat ids, never from ids without a number", () => {
    assert.equal(phoneOfChat("351910000001@c.us"), "351910000001");
    assert.equal(phoneOfChat("123456789012345@lid"), null);
    assert.equal(isAllowed("351910000001@c.us", ["+351 910 000 001"]), true);
    assert.equal(isAllowed("351910000002@c.us", ["351910000001"]), false);
    assert.equal(isAllowed("123456789012345@lid", ["123456789012345"]), false);
    assert.equal(isAllowed("351910000002@c.us", null), true);
  });

  it("ignores everyone outside the allowlist: no reply, nothing stored", async () => {
    const { adapter, store, runtime, message } = setup(demoRestaurant, { allowlist: ["351910000001"] });
    assert.equal((await runtime.handle(message("351910000099@c.us", "Olá"))).status, "not_allowed");
    assert.equal(adapter.sent.length, 0);
    assert.equal(store.conversations.size, 0);
    assert.equal((await runtime.handle(message("351910000001@c.us", "Olá"))).status, "replied");
  });

  it("an empty allowlist answers no one", async () => {
    const { adapter, runtime, message } = setup(demoRestaurant, { allowlist: [] });
    assert.equal((await runtime.handle(message("351910000001@c.us", "Olá"))).status, "not_allowed");
    assert.equal(adapter.sent.length, 0);
  });

  it("the kill switch stops every send", async () => {
    const { adapter, runtime, message } = setup(demoRestaurant, { canSend: () => false });
    assert.equal((await runtime.handle(message("351910000001@c.us", "Olá"))).status, "paused");
    assert.equal(adapter.sent.length, 0);
  });

  it("pilot pace: 3 to 8 s typing, at most 10 replies an hour and 50 a day", () => {
    assert.equal(typingDelay("ok", pilotPacing, () => 1), 3000);
    assert.equal(typingDelay("x".repeat(500), pilotPacing, () => 0), 8000);
    const pacer = new Pacer(pilotPacing);
    let now = 0;
    for (let i = 0; i < 10; i++) {
      now += pacer.waitBeforeSend(`chat${i}`, now);
      pacer.record(`chat${i}`, now);
    }
    assert.equal(pacer.waitBeforeSend("chat-new", now + 1000), Infinity);
    assert.notEqual(pacer.waitBeforeSend("chat-new", now + 61 * 60_000), Infinity);
  });
});

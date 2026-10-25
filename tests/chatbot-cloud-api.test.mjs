import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it } from "node:test";
import { CloudApiAdapter, CloudApiError, readWebhook, validSignature, verifySubscription } from "../src/lib/chatbot/cloud-api.ts";
import { demoRestaurant } from "../src/lib/chatbot/demo.ts";
import { createRuntime } from "../src/lib/chatbot/runtime.ts";
import { MemoryStore } from "../src/lib/chatbot/store.ts";

// The official WhatsApp Cloud API: never Meta itself in tests (owner's rule), only a fake fetch.

const phoneNumberId = "1100000000001";
const customer = "351910000099";

function messagesPayload(messages, contacts = [{ wa_id: customer, profile: { name: "Ana Teste" } }]) {
  return {
    object: "whatsapp_business_account",
    entry: [{ id: "waba", changes: [{ field: "messages", value: { messaging_product: "whatsapp", metadata: { phone_number_id: phoneNumberId }, contacts, messages } }] }],
  };
}

function text(body, id = `wamid.${Math.random()}`, at = Math.floor(Date.now() / 1000)) {
  return { from: customer, id, timestamp: String(at), type: "text", text: { body } };
}

function fakeFetch(responses = []) {
  const calls = [];
  const fetcher = async (url, init) => {
    calls.push({ url, body: JSON.parse(init.body), auth: init.headers.Authorization });
    const next = responses.shift() ?? { ok: true, body: { messages: [{ id: `wamid.out.${calls.length}` }] } };
    return new Response(JSON.stringify(next.body), { status: next.ok === false ? (next.status ?? 400) : 200 });
  };
  return { fetcher, calls };
}

describe("cloud api webhook", () => {
  it("answers Meta's subscription check only with the right token", () => {
    const params = (token) => new URLSearchParams({ "hub.mode": "subscribe", "hub.verify_token": token, "hub.challenge": "1234" });
    assert.equal(verifySubscription(params("segredo"), "segredo"), "1234");
    assert.equal(verifySubscription(params("outro"), "segredo"), null);
    assert.equal(verifySubscription(params("segredo"), undefined), null);
    assert.equal(verifySubscription(new URLSearchParams({ "hub.mode": "unsubscribe", "hub.verify_token": "segredo", "hub.challenge": "1" }), "segredo"), null);
  });

  it("accepts only bodies signed with the app secret", () => {
    const raw = JSON.stringify(messagesPayload([text("Olá")]));
    const signature = `sha256=${createHmac("sha256", "app-secret").update(raw).digest("hex")}`;
    assert.equal(validSignature(raw, signature, "app-secret"), true);
    assert.equal(validSignature(`${raw} `, signature, "app-secret"), false);
    assert.equal(validSignature(raw, signature, "other"), false);
    assert.equal(validSignature(raw, null, "app-secret"), false);
    assert.equal(validSignature(raw, signature, undefined), false);
  });

  it("reads customers' texts, buttons and captions, with the contact's name", () => {
    const [batch] = readWebhook(
      messagesPayload([
        text("Quanto custa o menu digital?", "wamid.1"),
        { from: customer, id: "wamid.2", timestamp: "1761400000", type: "interactive", interactive: { type: "button_reply", button_reply: { id: "b", title: "Ver demonstração" } } },
        { from: customer, id: "wamid.3", timestamp: "1761400000", type: "image", image: { id: "m", caption: "É assim?" } },
        { from: customer, id: "wamid.4", timestamp: "1761400000", type: "audio", audio: { id: "a" } },
      ]),
    );
    assert.equal(batch.phoneNumberId, phoneNumberId);
    assert.deepEqual(
      batch.messages.map((m) => [m.messageId, m.body, m.kind, m.fromOwner, m.chatId]),
      [
        ["wamid.1", "Quanto custa o menu digital?", "text", false, customer],
        ["wamid.2", "Ver demonstração", "text", false, customer],
        ["wamid.3", "É assim?", "media", false, customer],
        ["wamid.4", "", "media", false, customer],
      ],
    );
    assert.equal(batch.messages[0].contactName, "Ana Teste");
    assert.equal(batch.messages[1].at, 1761400000 * 1000);
  });

  it("reads what the owner writes from the WhatsApp Business app (coexistence) as the owner", () => {
    const [batch] = readWebhook({
      object: "whatsapp_business_account",
      entry: [{ changes: [{ field: "smb_message_echoes", value: { metadata: { phone_number_id: phoneNumberId }, message_echoes: [{ from: "351961292679", to: customer, id: "wamid.echo", timestamp: "1761400000", type: "text", text: { body: "Olá Ana, é o Roger" } }] } }] }],
    });
    assert.equal(batch.messages[0].fromOwner, true);
    assert.equal(batch.messages[0].chatId, customer);
    assert.equal(batch.messages[0].contactName, null);
  });

  it("ignores statuses, other objects and broken payloads", () => {
    const statuses = { object: "whatsapp_business_account", entry: [{ changes: [{ field: "messages", value: { metadata: { phone_number_id: phoneNumberId }, statuses: [{ id: "wamid.x", status: "read" }] } }] }] };
    assert.deepEqual(readWebhook(statuses), []);
    assert.deepEqual(readWebhook({ object: "page", entry: [] }), []);
    assert.deepEqual(readWebhook(null), []);
    assert.deepEqual(readWebhook({ object: "whatsapp_business_account", entry: [{ changes: [{ field: "messages", value: { messages: [text("sem número")] } }] }] }), []);
  });
});

describe("cloud api adapter", () => {
  it("sends text to the Graph API with the number's token and returns Meta's id", async () => {
    const { fetcher, calls } = fakeFetch();
    const adapter = new CloudApiAdapter({ phoneNumberId, accessToken: "token-x", fetch: fetcher });
    const sent = await adapter.sendText(customer, "Veja a demonstração: https://www.steevanz.com/menu/trattoria-da-nonna");
    assert.equal(sent.messageId, "wamid.out.1");
    assert.equal(calls[0].url, `https://graph.facebook.com/v23.0/${phoneNumberId}/messages`);
    assert.equal(calls[0].auth, "Bearer token-x");
    assert.deepEqual(calls[0].body, {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: customer,
      type: "text",
      text: { body: "Veja a demonstração: https://www.steevanz.com/menu/trattoria-da-nonna", preview_url: true },
    });
  });

  it("reports Meta's errors without the token", async () => {
    const { fetcher } = fakeFetch([{ ok: false, status: 401, body: { error: { code: 190, message: "Invalid OAuth access token" } } }]);
    const adapter = new CloudApiAdapter({ phoneNumberId, accessToken: "token-secreto", fetch: fetcher });
    await assert.rejects(adapter.sendText(customer, "Olá"), (error) => {
      assert.ok(error instanceof CloudApiError);
      assert.equal(error.status, 401);
      assert.equal(error.code, 190);
      assert.doesNotMatch(error.message, /token-secreto/);
      return true;
    });
  });

  it("shows «a escrever…» on the customer's last message, and a failure there never blocks the reply", async () => {
    const { fetcher, calls } = fakeFetch([{ ok: false, status: 400, body: { error: { message: "typing off" } } }]);
    const adapter = new CloudApiAdapter({ phoneNumberId, accessToken: "t", fetch: fetcher });
    await adapter.simulateTyping(customer, 0); // no inbound yet: no request
    assert.equal(calls.length, 0);
    adapter.noteInbound({ chatId: customer, messageId: "wamid.in", fromOwner: false, body: "Olá", at: Date.now(), kind: "text", isGroup: false });
    await adapter.simulateTyping(customer, 0);
    assert.deepEqual(calls[0].body, { messaging_product: "whatsapp", status: "read", message_id: "wamid.in", typing_indicator: { type: "text" } });
  });

  it("runs the shared runtime end to end: reply sent, owner from the app takes over, kill switch holds replies", async () => {
    let now = Date.now();
    const { fetcher, calls } = fakeFetch();
    const adapter = new CloudApiAdapter({ phoneNumberId, accessToken: "t", fetch: fetcher });
    const store = new MemoryStore();
    let enabled = true;
    const runtime = createRuntime({
      bot: demoRestaurant,
      adapter,
      store,
      clock: () => now,
      sleep: async (ms) => {
        now += ms;
      },
      random: () => 0.5,
      canSend: () => enabled,
    });
    // Instant «typing» in the test.
    adapter.simulateTyping = async () => {};

    const [first] = readWebhook(messagesPayload([text("Têm estacionamento?", "wamid.a", Math.floor(now / 1000))])).map((b) => b.messages);
    assert.equal((await runtime.handle(first[0])).status, "replied");
    assert.equal(calls.length, 1);
    assert.match(calls[0].body.text.body, /Rua Nova/);

    // Meta delivers the same message twice: answered once.
    assert.equal((await runtime.handle(first[0])).status, "duplicate");

    const echo = readWebhook({
      object: "whatsapp_business_account",
      entry: [{ changes: [{ field: "smb_message_echoes", value: { metadata: { phone_number_id: phoneNumberId }, message_echoes: [{ from: "351000", to: customer, id: "wamid.owner", timestamp: String(Math.floor(now / 1000)), type: "text", text: { body: "Eu respondo" } }] } }] }],
    })[0].messages[0];
    assert.equal((await runtime.handle(echo)).status, "owner");
    assert.equal((await runtime.handle(readWebhook(messagesPayload([text("E ao sábado?", "wamid.b", Math.floor(now / 1000))]))[0].messages[0])).status, "silent");
    assert.equal(calls.length, 1);

    enabled = false;
    const other = { ...readWebhook(messagesPayload([text("Olá", "wamid.c", Math.floor(now / 1000))]))[0].messages[0], chatId: "351910000100" };
    assert.equal((await runtime.handle(other)).status, "paused");
    assert.equal(calls.length, 1);
  });
});

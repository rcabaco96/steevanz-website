import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  demoAdd,
  demoChange,
  demoConfirmDue,
  demoConfirmMs,
  demoPlaceOrder,
  demoSessionMs,
  demoStorageKey,
  maxDemoOrders,
  newDemoSession,
  nextDemoConfirmIn,
  readDemoSession,
} from "../src/lib/video-menus/demo-ordering.ts";
import { maxCartItems } from "../src/lib/video-menus/ordering-rules.ts";
import { hasPublicDemoOrdering } from "../src/lib/video-menus/rules.ts";

const pizza = { id: "d1", name: "Pizza Margherita", priceCents: 1050 };
const tiramisu = { id: "d2", name: "Tiramisù", priceCents: 550 };
const t0 = Date.parse("2026-10-22T12:00:00Z");

/** Applies a step that must succeed. */
function ok(result) {
  assert.ok(!("error" in result), `unexpected error: ${result.error}`);
  return result.session;
}

describe("which public links take demo orders", () => {
  it("only the Trattoria, O Ermita and Lobo do Mar, and only with «Pedidos no menu» on", () => {
    for (const slug of ["trattoria-da-nonna", "o-ermita", "lobo-do-mar"]) {
      assert.equal(hasPublicDemoOrdering(slug, true), true, slug);
      assert.equal(hasPublicDemoOrdering(slug, false), false, slug);
      assert.equal(hasPublicDemoOrdering(slug, undefined), false, slug);
    }
  });

  it("never another demo menu nor a client's menu", () => {
    for (const slug of ["sakura-sushi", "marisqueira-do-cais", "dolci-salati", "fabios-roadstop", "raza17raza"]) {
      assert.equal(hasPublicDemoOrdering(slug, true), false, slug);
    }
  });
});

describe("each visitor's demo session is their own", () => {
  it("two visitors of the same link never see each other's cart or orders", () => {
    let ana = newDemoSession("ana", t0);
    let rui = newDemoSession("rui", t0);
    ana = ok(demoAdd(ana, pizza, t0));
    ana = ok(demoAdd(ana, pizza, t0));
    rui = ok(demoAdd(rui, tiramisu, t0));
    assert.deepEqual(ana.lines.map((line) => [line.dish, line.quantity]), [["d1", 2]]);
    assert.deepEqual(rui.lines.map((line) => [line.dish, line.quantity]), [["d2", 1]]);

    const anaOrder = demoPlaceOrder(ana, t0 + 1000);
    ana = anaOrder.session;
    assert.equal(ana.orders.length, 1);
    assert.equal(ana.lines.length, 0);
    // Rui's session is untouched by Ana's order.
    assert.equal(rui.orders.length, 0);
    assert.equal(rui.lines.length, 1);

    const ruiOrder = demoPlaceOrder(rui, t0 + 2000);
    // Each session numbers its own orders from 1, with tokens of its own.
    assert.equal(anaOrder.order.number, 1);
    assert.equal(ruiOrder.order.number, 1);
    assert.notEqual(anaOrder.order.token, ruiOrder.order.token);
  });

  it("never changes the session it is given (no shared state between calls)", () => {
    const start = newDemoSession("s", t0);
    const frozen = JSON.stringify(start);
    const after = ok(demoAdd(start, pizza, t0));
    demoPlaceOrder(after, t0);
    assert.equal(JSON.stringify(start), frozen);
    assert.equal(after.lines.length, 1);
  });

  it("is kept under one key per menu (the tab's sessionStorage)", () => {
    assert.equal(demoStorageKey("trattoria-da-nonna"), "steevanz:pedido-demo:trattoria-da-nonna");
    assert.notEqual(demoStorageKey("trattoria-da-nonna"), demoStorageKey("sakura-sushi"));
  });
});

describe("the demo cart follows the table's rules", () => {
  it("merges the same dish, keeps notes apart and removes at 0", () => {
    let session = ok(demoAdd(newDemoSession("s", t0), pizza, t0));
    session = ok(demoAdd(session, pizza, t0));
    assert.equal(session.lines.length, 1);
    const line = session.lines[0].id;
    session = ok(demoChange(session, line, { note: "  sem   azeitonas " }, t0));
    assert.equal(session.lines[0].note, "sem azeitonas");
    session = ok(demoAdd(session, pizza, t0));
    assert.equal(session.lines.length, 2);
    session = ok(demoChange(session, line, { quantity: 0 }, t0));
    assert.equal(session.lines.length, 1);
  });

  it("refuses a full cart and an empty order", () => {
    let session = newDemoSession("s", t0);
    for (let index = 0; index < maxCartItems; index += 1) session = ok(demoAdd(session, { id: `d${index}`, name: "Prato", priceCents: 100 }, t0));
    assert.deepEqual(demoAdd(session, pizza, t0), { error: "cart_full" });
    assert.deepEqual(demoPlaceOrder(newDemoSession("e", t0), t0), { error: "cart_empty" });
  });

  it("totals the order and keeps at most the newest orders", () => {
    let session = newDemoSession("s", t0);
    session = ok(demoAdd(session, pizza, t0));
    session = ok(demoAdd(session, tiramisu, t0));
    const { order } = demoPlaceOrder(session, t0);
    assert.equal(order.totalCents, 1600);
    assert.equal(order.status, "placed");
    for (let index = 0; index < maxDemoOrders + 5; index += 1) session = demoPlaceOrder(ok(demoAdd(session, pizza, t0)), t0 + index).session;
    assert.equal(session.orders.length, maxDemoOrders);
    assert.equal(session.orders[0].number, maxDemoOrders + 5);
  });
});

describe("the simulated confirmation", () => {
  it("confirms an order once its time comes, and says when the next one is due", () => {
    let session = ok(demoAdd(newDemoSession("s", t0), pizza, t0));
    session = demoPlaceOrder(session, t0).session;
    assert.equal(nextDemoConfirmIn(session, t0 + 1000), demoConfirmMs - 1000);
    assert.equal(demoConfirmDue(session, t0 + demoConfirmMs - 1), session);
    session = demoConfirmDue(session, t0 + demoConfirmMs);
    assert.equal(session.orders[0].status, "confirmed");
    assert.equal(nextDemoConfirmIn(session, t0 + demoConfirmMs), null);
  });
});

describe("reading a kept demo session", () => {
  it("reads back what was kept", () => {
    let session = ok(demoAdd(newDemoSession("s", t0), pizza, t0));
    session = demoPlaceOrder(ok(demoAdd(session, tiramisu, t0)), t0).session;
    session = ok(demoAdd(session, pizza, t0));
    assert.deepEqual(readDemoSession(JSON.stringify(session), t0 + 60_000), session);
  });

  it("forgets a session left alone too long (the visitor starts over)", () => {
    const session = ok(demoAdd(newDemoSession("s", t0), pizza, t0));
    assert.equal(readDemoSession(JSON.stringify(session), t0 + demoSessionMs + 1), null);
    assert.ok(readDemoSession(JSON.stringify(session), t0 + demoSessionMs));
  });

  it("ignores nothing kept, broken text and wrong shapes", () => {
    assert.equal(readDemoSession(null, t0), null);
    assert.equal(readDemoSession("{not json", t0), null);
    assert.equal(readDemoSession("[]", t0), null);
    assert.equal(readDemoSession(JSON.stringify({ id: "", updatedAt: t0, lines: [], orders: [] }), t0), null);
  });

  it("drops lines and orders that don't hold up", () => {
    const raw = JSON.stringify({
      id: "s",
      updatedAt: t0,
      nextLine: 3,
      lines: [{ id: "demo-1", dish: "d1", name: "Pizza", priceCents: 1050, quantity: 2, note: "" }, { id: "x", dish: "d2", name: "Mau", priceCents: -5, quantity: 1, note: "" }, "lixo"],
      orders: [{ id: "s-1", number: 1, token: "s-1", status: "hacked", totalCents: 1, createdAt: new Date(t0).toISOString(), lines: [] }],
    });
    const session = readDemoSession(raw, t0);
    assert.equal(session.lines.length, 1);
    assert.equal(session.orders.length, 0);
  });
});

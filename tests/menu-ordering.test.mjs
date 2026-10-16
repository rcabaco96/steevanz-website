import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  addToCart,
  cartItemCount,
  cartTotalCents,
  changeLine,
  dishCounts,
  isOrderingToken,
  maxCartItems,
  maxLineQuantity,
  maxNoteLength,
  nextOrderNumber,
  normaliseNote,
  orderBarLabel,
  orderingErrorMessage,
  serviceDay,
  tableChannel,
  tableName,
  tableNamesUpTo,
} from "../src/lib/video-menus/ordering-rules.ts";

const tiramisu = { id: "d1", name: "Tiramisù", priceCents: 490 };
const burger = { id: "d2", name: "Hambúrguer", priceCents: 1150 };
const line = (id, dish, quantity, note = "") => ({ id, dish: dish.id, name: dish.name, priceCents: dish.priceCents, quantity, note });

describe("adding to the table's cart", () => {
  it("starts a line, then merges the same dish without a note into it", () => {
    let result = addToCart([], tiramisu, "a");
    assert.deepEqual(result.lines, [line("a", tiramisu, 1)]);
    result = addToCart(result.lines, tiramisu, "b");
    assert.deepEqual(result.lines, [line("a", tiramisu, 2)]);
    result = addToCart(result.lines, burger, "c");
    assert.equal(result.lines.length, 2);
  });

  it("keeps a line with a note apart (a new add joins the plain line)", () => {
    const lines = [line("a", tiramisu, 1, "sem canela")];
    const result = addToCart(lines, tiramisu, "b");
    assert.deepEqual(result.lines, [line("a", tiramisu, 1, "sem canela"), line("b", tiramisu, 1)]);
  });

  it("refuses past the line and cart limits", () => {
    assert.deepEqual(addToCart([line("a", tiramisu, maxLineQuantity)], tiramisu, "b"), { error: "line_full" });
    const full = [line("a", tiramisu, 20), line("b", burger, 20), line("c", tiramisu, 10, "quente")];
    assert.equal(cartItemCount(full), maxCartItems);
    assert.deepEqual(addToCart(full, burger, "d"), { error: "cart_full" });
  });
});

describe("changing a line", () => {
  it("removes it at 0 and ignores a line already gone", () => {
    const lines = [line("a", tiramisu, 2), line("b", burger, 1)];
    assert.deepEqual(changeLine(lines, "a", { quantity: 0 }).lines, [line("b", burger, 1)]);
    assert.equal(changeLine(lines, "zz", { quantity: 3 }).lines, lines);
  });

  it("keeps the quantity within 1 to 20 and the cart within 50", () => {
    assert.deepEqual(changeLine([line("a", tiramisu, 20)], "a", { quantity: 21 }), { error: "line_full" });
    const lines = [line("a", tiramisu, 20), line("b", burger, 20), line("c", burger, 9, "bem passado")];
    assert.deepEqual(changeLine(lines, "c", { quantity: 11 }), { error: "cart_full" });
    // Going down is always fine.
    assert.equal(changeLine(lines, "c", { quantity: 2 }).lines[2].quantity, 2);
  });

  it("clearing a note merges the line into the dish's plain line", () => {
    const lines = [line("a", tiramisu, 2), line("b", tiramisu, 3, "sem canela")];
    assert.deepEqual(changeLine(lines, "b", { note: "  " }).lines, [line("a", tiramisu, 5)]);
    // Capped at the line limit.
    const big = [line("a", tiramisu, 15), line("b", tiramisu, 10, "x")];
    assert.equal(changeLine(big, "b", { note: "" }).lines[0].quantity, maxLineQuantity);
    // Without a plain line it just loses its note.
    assert.deepEqual(changeLine([line("b", tiramisu, 3, "x")], "b", { note: "" }).lines, [line("b", tiramisu, 3)]);
  });

  it("checks the note's length", () => {
    assert.deepEqual(changeLine([line("a", tiramisu, 1)], "a", { note: "x".repeat(maxNoteLength + 1) }), { error: "note_too_long" });
    assert.equal(changeLine([line("a", tiramisu, 1)], "a", { note: "x".repeat(maxNoteLength) }).lines[0].note.length, maxNoteLength);
  });
});

describe("notes", () => {
  it("are one trimmed line without control characters", () => {
    assert.equal(normaliseNote("  sem\n\ncebola \t por favor  "), "sem cebola por favor");
    assert.equal(normaliseNote("a\u0000b"), "a b");
    assert.equal(normaliseNote(""), "");
    assert.equal(normaliseNote("x".repeat(201)), null);
  });
});

describe("totals and words", () => {
  const lines = [line("a", tiramisu, 2), line("b", burger, 1), line("c", tiramisu, 1, "sem canela")];

  it("counts items, euros and each dish", () => {
    assert.equal(cartItemCount(lines), 4);
    assert.equal(cartTotalCents(lines), 3 * 490 + 1150);
    assert.deepEqual(dishCounts(lines), { d1: 3, d2: 1 });
    assert.equal(cartTotalCents([]), 0);
  });

  it("labels the order bar", () => {
    assert.equal(orderBarLabel(3, 1450).replace(/\s/g, " "), "Pedido · 3 itens · 14,50 €");
    assert.equal(orderBarLabel(1, 490).replace(/\s/g, " "), "Pedido · 1 item · 4,90 €");
  });

  it("has a message for every problem", () => {
    for (const code of ["cart_full", "line_full", "note_too_long", "cart_empty", "order_too_soon", "rate_limited", "dish_missing", "table_missing", "ordering_off", "network"]) {
      assert.ok(orderingErrorMessage(code).length > 10, code);
    }
    assert.match(orderingErrorMessage("whatever"), /erro/);
  });
});

describe("order numbers", () => {
  it("count per day from 1", () => {
    assert.equal(nextOrderNumber([]), 1);
    assert.equal(nextOrderNumber([1, 2, 3]), 4);
    assert.equal(nextOrderNumber([5, 2]), 6);
  });

  it("use Lisbon's day", () => {
    // 23:30 UTC on 31 March 2026 is already 1 April in Lisbon (summer time).
    assert.equal(serviceDay(new Date("2026-03-31T23:30:00Z")), "2026-04-01");
    // In winter Lisbon is UTC.
    assert.equal(serviceDay(new Date("2026-01-15T23:30:00Z")), "2026-01-15");
  });
});

describe("tables", () => {
  it("creates «Mesa 1» to N without the ones that exist", () => {
    assert.deepEqual(tableNamesUpTo(3, []), ["Mesa 1", "Mesa 2", "Mesa 3"]);
    assert.deepEqual(tableNamesUpTo(4, ["mesa  2", "Esplanada", "Mesa 4"]), ["Mesa 1", "Mesa 3"]);
    assert.equal(tableNamesUpTo(500, []).length, 100);
  });

  it("checks names and tokens", () => {
    assert.equal(tableName("  Mesa   7 "), "Mesa 7");
    assert.equal(tableName(""), null);
    assert.equal(tableName("x".repeat(41)), null);
    assert.ok(isOrderingToken("Ab-_".repeat(6)));
    assert.ok(!isOrderingToken("short"));
    assert.ok(!isOrderingToken("a".repeat(30) + "/"));
    assert.equal(tableChannel("123"), "mesa:123");
  });
});

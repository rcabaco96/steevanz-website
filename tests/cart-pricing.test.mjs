import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { priceCart, sanitizeLines, unitPriceFor } from "../src/lib/cart/pricing.ts";

function line(productId, quantity, options) {
  return { id: `${productId}-${quantity}`, productId, quantity, options };
}

const menu = (quantity, logo = false) => line("nfc-menu", quantity, { format: "round-sticker", logo, text: "" });

describe("digital menu packs", () => {
  it("charges 15 € for a single plate", () => {
    const { oneTime } = priceCart([menu(1)]);
    assert.equal(oneTime.lines[0].unitCents, 1500);
    assert.equal(oneTime.subtotalCents, 1500);
  });

  it("prices the packs of 5, 10 and 20 at 60 €, 100 € and 180 €", () => {
    assert.equal(priceCart([menu(5)]).oneTime.subtotalCents, 6000);
    assert.equal(priceCart([menu(10)]).oneTime.subtotalCents, 10000);
    assert.equal(priceCart([menu(20)]).oneTime.subtotalCents, 18000);
  });

  it("keeps the best pack price reached for quantities in between", () => {
    assert.equal(priceCart([menu(4)]).oneTime.subtotalCents, 4 * 1500);
    assert.equal(priceCart([menu(7)]).oneTime.subtotalCents, 7 * 1200);
    assert.equal(priceCart([menu(12)]).oneTime.subtotalCents, 12 * 1000);
    assert.equal(priceCart([menu(30)]).oneTime.subtotalCents, 30 * 900);
  });

  it("charges the logo once per line, not per plate", () => {
    const { oneTime } = priceCart([menu(10, true)]);
    assert.equal(oneTime.lines[0].unitCents, 1000);
    assert.equal(oneTime.lines[0].lineExtraCents, 1000);
    assert.equal(oneTime.subtotalCents, 11000);
    assert.equal(oneTime.vatCents, 2530);
    assert.equal(oneTime.totalCents, 13530);
  });

  it("ignores packs on products without them", () => {
    assert.equal(unitPriceFor({ priceFrom: 29 }, 50), 29);
  });
});

describe("Google review plates", () => {
  it("prices 1, 3, 5 and 10 plates at 29 €, 75 €, 115 € and 200 €", () => {
    const subtotal = (quantity) => priceCart([line("nfc-google-reviews", quantity, { format: "counter-acrylic" })]).oneTime.subtotalCents;
    assert.deepEqual([1, 3, 5, 10].map(subtotal), [2900, 7500, 11500, 20000]);
    // Between packs, the price of the pack reached so far.
    assert.equal(subtotal(4), 10000);
  });

  it("charge the logo at +5 € on each plate", () => {
    const { oneTime } = priceCart([line("nfc-google-reviews", 3, { format: "counter-acrylic", logo: true, text: "" })]);
    assert.equal(oneTime.lines[0].unitCents, 3000);
    assert.equal(oneTime.lines[0].lineExtraCents, 0);
    assert.equal(oneTime.subtotalCents, 9000);
  });
});

describe("other plates", () => {
  it("still charge the logo on every unit", () => {
    const { oneTime } = priceCart([line("nfc-social", 3, { format: "counter-plate", logo: true, text: "" })]);
    assert.equal(oneTime.lines[0].unitCents, 3400);
    assert.equal(oneTime.lines[0].lineExtraCents, 0);
    assert.equal(oneTime.subtotalCents, 10200);
  });

  it("keeps one-off and monthly totals apart", () => {
    const totals = priceCart([menu(5, true), line("loyalty", 1)]);
    assert.equal(totals.oneTime.subtotalCents, 7000);
    assert.equal(totals.monthly.subtotalCents, 1900);
  });
});

describe("sanitizeLines", () => {
  it("accepts the digital menu formats and falls back to the first one", () => {
    const [valid, unknown] = sanitizeLines([
      { id: "a", productId: "nfc-menu", quantity: 20, options: { format: "round-base", logo: true, text: "Veja o menu" } },
      { id: "b", productId: "nfc-menu", quantity: 5, options: { format: "wall-plate" } },
    ]);
    assert.deepEqual(valid.options, { format: "round-base", logo: true, text: "Veja o menu" });
    assert.equal(unknown.options.format, "round-sticker");
  });
});

import { alreadyActive, ownedSpaces } from "../src/lib/cart/ownership.ts";

describe("products the account already has", () => {
  const owned = [
    { productId: "ai-reviews", spaces: 1 },
    { productId: "waitlist", spaces: 2 },
    { productId: "nfc-menu", spaces: 1 },
  ];
  it("leaves out a monthly product already active", () => {
    assert.equal(alreadyActive("ai-reviews", owned), true);
    assert.equal(alreadyActive("ai-chatbot", owned), false);
  });
  it("lets per-space products add spaces", () => {
    assert.equal(alreadyActive("waitlist", owned), false);
    assert.equal(ownedSpaces("waitlist", owned), 2);
    assert.equal(ownedSpaces("bookings", owned), 0);
  });
  it("lets one-off products be bought again", () => {
    assert.equal(alreadyActive("nfc-menu", owned), false);
    assert.equal(ownedSpaces("nfc-menu", owned), 0);
  });
});

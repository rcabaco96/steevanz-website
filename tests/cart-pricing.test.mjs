import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { priceCart, sanitizeLines, unitPriceFor } from "../src/lib/cart/pricing.ts";

function line(productId, quantity, options) {
  return { id: `${productId}-${quantity}`, productId, quantity, options };
}

const menu = (quantity, logo = false) => line("digital-menu", quantity, { format: "round-sticker", logo, text: "" });

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
    const subtotal = (quantity) => priceCart([line("google-review-plates", quantity, { format: "counter-acrylic" })]).oneTime.subtotalCents;
    assert.deepEqual([1, 3, 5, 10].map(subtotal), [2900, 7500, 11500, 20000]);
    // Between packs, the price of the pack reached so far.
    assert.equal(subtotal(4), 10000);
  });

  it("charge the logo at +5 € on each plate", () => {
    const { oneTime } = priceCart([line("google-review-plates", 3, { format: "counter-acrylic", logo: true, text: "" })]);
    assert.equal(oneTime.lines[0].unitCents, 3000);
    assert.equal(oneTime.lines[0].lineExtraCents, 0);
    assert.equal(oneTime.subtotalCents, 9000);
  });
});

describe("other plates", () => {
  it("still charge the logo on every unit", () => {
    const { oneTime } = priceCart([line("social-plates", 3, { format: "counter-plate", logo: true, text: "" })]);
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
      { id: "a", productId: "digital-menu", quantity: 20, options: { format: "round-base", logo: true, text: "Veja o menu" } },
      { id: "b", productId: "digital-menu", quantity: 5, options: { format: "wall-plate" } },
    ]);
    assert.deepEqual(valid.options, { format: "round-base", logo: true, text: "Veja o menu" });
    assert.equal(unknown.options.format, "round-sticker");
  });
});

import { alreadyActive } from "../src/lib/cart/ownership.ts";

describe("products the account already has", () => {
  const owned = [
    { productId: "ai-reviews", spaces: 1 },
    { productId: "waitlist", spaces: 2 },
    { productId: "digital-menu", spaces: 1 },
  ];
  it("leaves out a monthly product already active", () => {
    assert.equal(alreadyActive("ai-reviews", owned), true);
    assert.equal(alreadyActive("ai-chatbot", owned), false);
  });
  it("leaves out the space products already active too (one business per client)", () => {
    assert.equal(alreadyActive("waitlist", owned), true);
    assert.equal(alreadyActive("bookings", owned), false);
  });
  it("lets one-off products be bought again", () => {
    assert.equal(alreadyActive("digital-menu", owned), false);
  });
});

import { canonicalProductId, productIdVariants, toProductId } from "../src/content/products.ts";

describe("renamed product ids (old links, saved carts, stored rows)", () => {
  const renames = [
    ["nfc-google-reviews", "google-review-plates"],
    ["nfc-social", "social-plates"],
    ["nfc-menu", "digital-menu"],
  ];
  it("resolves every old id to the current one", () => {
    for (const [old, current] of renames) {
      assert.equal(toProductId(old), current);
      assert.equal(toProductId(current), current);
      assert.equal(canonicalProductId(old), current);
      assert.deepEqual(productIdVariants(current), [current, old]);
    }
    assert.equal(toProductId("nope"), null);
    assert.equal(toProductId("toString"), null);
    assert.equal(canonicalProductId("nope"), "nope");
  });
  it("keeps a cart saved with an old id, under the new id", () => {
    const [line] = sanitizeLines([{ id: "old", productId: "nfc-menu", quantity: 3, options: { format: "wall-plate" } }]);
    assert.equal(line.productId, "digital-menu");
    assert.equal(line.quantity, 3);
  });
  it("matches an owned product stored with an old id", () => {
    assert.equal(alreadyActive("ai-reviews", [{ productId: "ai-reviews", spaces: 1 }]), true);
    assert.equal(alreadyActive("nfc-google-reviews", [{ productId: "google-review-plates", spaces: 1 }]), false);
  });
});

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getProduct, products } from "../src/content/products.ts";
import { priceCart, sanitizeOptions } from "../src/lib/cart/pricing.ts";

const guide = (quantity, logo = false) => ({
  id: `guest-guide-${quantity}`,
  productId: "guest-guide",
  quantity,
  options: { format: "wall-plate", logo, text: "" },
});

describe("digital guest guide pricing", () => {
  it("is a one-time product at 69 € per property", () => {
    const { oneTime, monthly } = priceCart([guide(1)]);
    assert.equal(oneTime.lines[0].billing, "one-time");
    assert.equal(oneTime.subtotalCents, 6900);
    assert.equal(monthly.lines.length, 0);
  });

  it("gives managers 59 € from 3, 55 € from 5 and 49 € from 10 properties", () => {
    assert.equal(priceCart([guide(2)]).oneTime.subtotalCents, 2 * 6900);
    assert.equal(priceCart([guide(3)]).oneTime.subtotalCents, 3 * 5900);
    assert.equal(priceCart([guide(5)]).oneTime.subtotalCents, 5 * 5500);
    assert.equal(priceCart([guide(10)]).oneTime.subtotalCents, 10 * 4900);
    assert.equal(priceCart([guide(14)]).oneTime.subtotalCents, 14 * 4900);
  });

  it("charges the logo once per line", () => {
    const { oneTime } = priceCart([guide(5, true)]);
    assert.equal(oneTime.lines[0].lineExtraCents, 1000);
    assert.equal(oneTime.subtotalCents, 5 * 5500 + 1000);
  });

  it("only accepts its own plate formats", () => {
    assert.equal(sanitizeOptions("guest-guide", { format: "sticker" }).format, "sticker");
    assert.equal(sanitizeOptions("guest-guide", { format: "round-base" }).format, "wall-plate");
  });

  it("is marked as a provisional price, counted per property", () => {
    const product = getProduct("guest-guide");
    assert.equal(product.priceIsProvisional, true);
    assert.equal(product.packUnit, "property");
  });
});

describe("holiday-rental sector tags", () => {
  const tagged = (id) => getProduct(id).sectors.includes("lodging");

  it("tags the products that fit holiday rentals", () => {
    for (const id of ["guest-guide", "google-review-plates", "ai-chatbot", "ai-reviews", "automation"]) {
      assert.ok(tagged(id), `${id} should be tagged with lodging`);
    }
  });

  it("leaves out slot bookings, waiting lists, the menu and stamp cards", () => {
    for (const id of ["digital-menu", "bookings", "waitlist", "loyalty"]) {
      assert.ok(!tagged(id), `${id} should not be tagged with lodging`);
    }
  });

  it("has unique product slugs in both languages", () => {
    for (const locale of ["pt", "en"]) {
      const slugs = products.map((product) => product.slug[locale]);
      assert.equal(new Set(slugs).size, slugs.length);
    }
  });
});

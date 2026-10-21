import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getProduct, products } from "../src/content/products.ts";
import { priceCart, sanitizeOptions } from "../src/lib/cart/pricing.ts";
import { copy as guestGuideCopy } from "../src/content/product-copy/guest-guide.ts";

const guide = (quantity, logo = false) => ({
  id: `guest-guide-${quantity}`,
  productId: "guest-guide",
  quantity,
  options: { format: "wall-plate", logo, text: "" },
});

describe("digital guest guide pricing", () => {
  it("costs 20 € per plate, like the Menu digital", () => {
    const { oneTime, monthly } = priceCart([guide(1)]);
    assert.equal(oneTime.lines[0].billing, "one-time");
    assert.equal(oneTime.subtotalCents, 2000);
    assert.equal(monthly.lines.length, 0);
  });

  it("charges 15 € per plate from 10 plates", () => {
    assert.equal(priceCart([guide(9)]).oneTime.subtotalCents, 9 * 2000);
    assert.equal(priceCart([guide(10)]).oneTime.subtotalCents, 10 * 1500);
    assert.equal(priceCart([guide(14)]).oneTime.subtotalCents, 14 * 1500);
  });

  it("has the same plate prices and monthly fee as the Menu digital", () => {
    const product = getProduct("guest-guide");
    const menu = getProduct("digital-menu");
    assert.equal(product.priceFrom, menu.priceFrom);
    assert.deepEqual(product.packs, menu.packs);
    assert.match(product.priceQualifier.pt, /30 €\/mês/);
    assert.match(menu.priceQualifier.pt, /30 €\/mês/);
  });

  it("charges the logo once per line", () => {
    const { oneTime } = priceCart([guide(5, true)]);
    assert.equal(oneTime.lines[0].lineExtraCents, 1000);
    assert.equal(oneTime.subtotalCents, 5 * 2000 + 1000);
  });

  it("only accepts its own plate formats", () => {
    assert.equal(sanitizeOptions("guest-guide", { format: "sticker" }).format, "sticker");
    assert.equal(sanitizeOptions("guest-guide", { format: "round-base" }).format, "wall-plate");
  });

  it("is marked as a provisional price, counted per plate", () => {
    const product = getProduct("guest-guide");
    assert.equal(product.priceIsProvisional, true);
    assert.equal(product.packUnit, undefined);
  });

  it("says the 30 €/month is per account and there is one plate per property, in every language", () => {
    const { priceQualifier } = getProduct("guest-guide");
    const perAccount = { pt: /por conta/, en: /per account/, es: /por cuenta/, fr: /par compte/, de: /pro Konto/, it: /per account/ };
    for (const [locale, pattern] of Object.entries(perAccount)) {
      assert.match(priceQualifier[locale], pattern, locale);
      assert.match(guestGuideCopy[locale].faq[0].a, pattern, locale);
      assert.match(guestGuideCopy[locale].faq[0].a, /3 .+ × (20 €|€20) \+ (30 €|€30)\//, locale);
    }
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

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getProduct, products } from "../src/content/products.ts";
import { priceCart, sanitizeOptions } from "../src/lib/cart/pricing.ts";
import { copy as guestGuideCopy } from "../src/content/product-copy/guest-guide.ts";

const guide = (quantity, format = "wall-plate", id = `guest-guide-${quantity}-${format}`) => ({
  id,
  productId: "guest-guide",
  quantity,
  options: { format, logo: false, text: "" },
});

// Owner, 2026-10-21: only 30 €/month per account and the plate is offered (one per property). No plate prices, no packs.
describe("digital guest guide pricing", () => {
  it("costs 30 € a month and nothing once", () => {
    const { oneTime, monthly } = priceCart([guide(1)]);
    const product = getProduct("guest-guide");
    assert.equal(product.priceFrom, 30);
    assert.equal(product.priceBilling, "monthly");
    assert.equal(monthly.lines[0].billing, "monthly");
    assert.equal(monthly.subtotalCents, 3000);
    assert.equal(oneTime.lines.length, 0);
  });

  it("charges one fee per account, however many plates (one per property, all free)", () => {
    for (const quantity of [1, 3, 10, 25]) {
      const { monthly } = priceCart([guide(quantity)]);
      assert.equal(monthly.lines[0].unitCents, 0, `${quantity} plates`);
      assert.equal(monthly.lines[0].accountCents, 3000, `${quantity} plates`);
      assert.equal(monthly.subtotalCents, 3000, `${quantity} plates`);
      assert.equal(monthly.quantity, quantity);
    }
  });

  it("charges the fee once even with several plate formats in the cart", () => {
    const { monthly } = priceCart([guide(2, "wall-plate"), guide(1, "sticker"), { id: "l", productId: "loyalty", quantity: 1 }]);
    assert.deepEqual(monthly.lines.map((line) => line.accountCents), [3000, 0, 0]);
    assert.equal(monthly.subtotalCents, 3000 + 1900);
  });

  it("has no packs and never charges a logo or anything else for the plate", () => {
    const product = getProduct("guest-guide");
    assert.equal(product.packs, undefined);
    assert.equal(product.pricePer, "account");
    assert.equal(product.customization.formatOnly, true);
    const options = sanitizeOptions("guest-guide", { format: "sticker", logo: true, text: "Casa Azul" });
    assert.deepEqual(options, { format: "sticker", logo: false, text: "" });
    const { monthly } = priceCart([{ id: "x", productId: "guest-guide", quantity: 5, options: { format: "sticker", logo: true, text: "x" } }]);
    assert.equal(monthly.lines[0].lineExtraCents, 0);
    assert.equal(monthly.subtotalCents, 3000);
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

  it("says the 30 €/month is per account and the plate is free, one per property, in every language", () => {
    const { priceQualifier } = getProduct("guest-guide");
    const perAccount = { pt: /por conta/, en: /per account/, es: /por cuenta/, fr: /par compte/, de: /pro Konto/, it: /per account/ };
    const free = { pt: /oferecida/, en: /free/, es: /de regalo/, fr: /offerte/, de: /kostenlos/, it: /in omaggio/ };
    const vat = { pt: /\+ IVA/, en: /\+ VAT/, es: /\+ IVA/, fr: /\+ TVA/, de: /zzgl\. MwSt\./, it: /\+ IVA/ };
    for (const [locale, pattern] of Object.entries(perAccount)) {
      const answer = guestGuideCopy[locale].faq[0].a;
      assert.match(priceQualifier[locale], pattern, locale);
      assert.match(priceQualifier[locale], free[locale], locale);
      assert.match(answer, pattern, locale);
      assert.match(answer, free[locale], locale);
      assert.match(answer, vat[locale], locale);
      assert.match(answer, /3 .+: (30 €|€30)\//, locale);
      assert.doesNotMatch(JSON.stringify(guestGuideCopy[locale]), /20 €|€20|15 €|€15/, locale);
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

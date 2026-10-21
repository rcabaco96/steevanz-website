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

// Plate prices as on 2026-10-20 for a client who already has the guide (no sign-up offer).
const active = ["guest-guide"];

describe("digital guest guide pricing", () => {
  it("costs 20 € per plate, like the Menu digital", () => {
    const { oneTime, monthly } = priceCart([guide(1)], active);
    assert.equal(oneTime.lines[0].billing, "one-time");
    assert.equal(oneTime.subtotalCents, 2000);
    assert.equal(monthly.lines.length, 0);
  });

  it("charges 15 € per plate from 10 plates", () => {
    assert.equal(priceCart([guide(9)], active).oneTime.subtotalCents, 9 * 2000);
    assert.equal(priceCart([guide(10)], active).oneTime.subtotalCents, 10 * 1500);
    assert.equal(priceCart([guide(14)], active).oneTime.subtotalCents, 14 * 1500);
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
    const { oneTime } = priceCart([guide(5, true)], active);
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
});

// Owner, 2026-10-21: the 1st plate is offered when the client joins the service, once per account.
describe("guest guide sign-up offer", () => {
  it("offers the 1st plate on the order that starts the guide", () => {
    const one = priceCart([guide(1)]).oneTime;
    assert.equal(one.lines[0].offerCents, 2000);
    assert.equal(one.subtotalCents, 0);
    assert.equal(priceCart([guide(3)]).oneTime.subtotalCents, 2 * 2000);
  });

  it("offers the plate at the line's price, the 15 € pack price from 10 plates", () => {
    const { oneTime } = priceCart([guide(10)]);
    assert.equal(oneTime.lines[0].offerCents, 1500);
    assert.equal(oneTime.subtotalCents, 9 * 1500);
  });

  it("never offers more than one plate per order, even across lines", () => {
    const { oneTime } = priceCart([guide(2), { ...guide(1), id: "second", options: { format: "sticker", logo: false, text: "" } }]);
    assert.deepEqual(oneTime.lines.map((line) => line.offerCents), [2000, 0]);
    assert.equal(oneTime.subtotalCents, 2000 + 2000);
  });

  it("charges every plate to a client who already has the guide", () => {
    const { oneTime } = priceCart([guide(3)], ["guest-guide"]);
    assert.equal(oneTime.lines[0].offerCents, 0);
    assert.equal(oneTime.subtotalCents, 3 * 2000);
  });

  it("still charges the logo design on the line with the free plate", () => {
    const { oneTime } = priceCart([guide(1, true)]);
    assert.equal(oneTime.lines[0].lineExtraCents, 1000);
    assert.equal(oneTime.subtotalCents, 1000);
  });

  it("is only for the guide", () => {
    for (const product of products) assert.equal(Boolean(product.signupFreeUnits), product.id === "guest-guide", product.id);
    assert.equal(getProduct("guest-guide").signupFreeUnits, 1);
  });

  it("says it, with the 30 €/month per account and one plate per property, in every language", () => {
    const { priceQualifier } = getProduct("guest-guide");
    const perAccount = { pt: /por conta/, en: /per account/, es: /por cuenta/, fr: /par compte/, de: /pro Konto/, it: /per account/ };
    const offer = { pt: /1\.ª placa .*oferecida/, en: /1st plate .*free/, es: /1\.ª placa .*de regalo/, fr: /1re plaque .*offerte/, de: /1\. Schild .*kostenlos/, it: /1ª targa .*in omaggio/ };
    for (const [locale, pattern] of Object.entries(perAccount)) {
      const answer = guestGuideCopy[locale].faq[0].a;
      assert.match(priceQualifier[locale], pattern, locale);
      assert.match(priceQualifier[locale], offer[locale], locale);
      assert.match(answer, pattern, locale);
      assert.match(answer, /3 .+: 2 .+ × (20 €|€20) \(.+\) \+ (30 €|€30)\//, locale);
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

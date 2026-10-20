import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { businessCardLabels, businessCards, getBusinessCard } from "../src/content/business-cards.ts";
import { docs as businessCardDocs } from "../src/content/docs/business-card.ts";
import { docs as keychainDocs } from "../src/content/docs/keychain.ts";
import { productCopy } from "../src/content/product-copy/index.ts";
import { getProduct } from "../src/content/products.ts";
import { priceCart } from "../src/lib/cart/pricing.ts";
import { buildVCard, escapeText, foldLine } from "../src/lib/business-card/vcard.ts";

// «Cartão de visita digital» and «Chaveiro digital» (owner, 2026-10-20): prices and packs from products.ts,
// complete in the six languages, house words, and a contact file phones can import.

const locales = ["pt", "en", "es", "fr", "de", "it"];

function strings(value) {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === "object") return Object.values(value).flatMap(strings);
  return [];
}

function shape(value) {
  if (Array.isArray(value)) return value.map(shape);
  if (value && typeof value === "object") return Object.fromEntries(Object.keys(value).sort().map((key) => [key, shape(value[key])]));
  return typeof value;
}

const forbidden = [/\bNFC\b/, /com IVA|IVA incluíd|IVA incluid|IVA inclusa|IVA compresa|TVA comprise|TVA incluse|\bTTC\b|inkl\.? MwSt|incl\.? VAT|including VAT|VAT included/i, /fideliza/i];

function assertHouseWords(texts, label) {
  for (const text of texts) for (const pattern of forbidden) assert.doesNotMatch(text, pattern, `${label}: ${text}`);
}

const oneTime = (productId, quantity) => priceCart([{ id: "a", productId, quantity }]).oneTime.subtotalCents;

describe("business card and keychain prices", () => {
  it("sells the card at 10 € with packs of 10, 25 and 50 at 9, 8 and 7 € a card, logo included", () => {
    const card = getProduct("business-card");
    assert.equal(card.priceFrom, 10);
    assert.equal(card.family, "plates");
    assert.deepEqual(card.packs, [
      { quantity: 10, unitPrice: 9 },
      { quantity: 25, unitPrice: 8 },
      { quantity: 50, unitPrice: 7 },
    ]);
    assert.equal(card.customization, undefined, "no logo extra: name, contacts and logo are included");
    assert.equal(oneTime("business-card", 1), 1000);
    assert.equal(oneTime("business-card", 10), 9000);
    assert.equal(oneTime("business-card", 25), 20000);
    assert.equal(oneTime("business-card", 50), 35000);
    assert.equal(oneTime("business-card", 12), 12 * 900);
  });

  it("sells the keychain at 5 € with packs of 10 for 45 € and 25 for 100 €", () => {
    const keychain = getProduct("keychain");
    assert.equal(keychain.priceFrom, 5);
    assert.equal(oneTime("keychain", 1), 500);
    assert.equal(oneTime("keychain", 10), 4500);
    assert.equal(oneTime("keychain", 25), 10000);
  });
});

describe("business card and keychain copy in six languages", () => {
  for (const id of ["business-card", "keychain"]) {
    it(`has every ${id} product field in every language, with the house words`, () => {
      const record = productCopy[id];
      const pt = record.pt;
      for (const locale of locales) {
        const copy = record[locale];
        assert.ok(copy, `${id}.${locale} missing`);
        assert.deepEqual(Object.keys(copy).sort(), Object.keys(pt).sort(), `${id}.${locale} fields`);
        for (const key of ["steps", "features", "useCases", "includes", "faq"]) assert.equal(copy[key].length, pt[key].length, `${id}.${locale}.${key}`);
        for (const text of strings(copy)) assert.ok(text.trim().length > 0, `${id}.${locale} has an empty text`);
        if (locale !== "en") assert.notEqual(copy.heroTitle, record.en.heroTitle, `${id}.${locale} still in English`);
        assertHouseWords(strings(copy), `${id}.${locale}`);
        // The price question gives the product's own prices, never with VAT added.
        const faq = copy.faq.map((item) => item.a).join(" ");
        const prices = id === "business-card" ? [/10\s?€|€\s?10/, /90\s?€|€\s?90/, /200\s?€|€\s?200/, /350\s?€|€\s?350/] : [/5\s?€|€\s?5/, /45\s?€|€\s?45/, /100\s?€|€\s?100/];
        for (const price of prices) assert.match(faq, price, `${id}.${locale} FAQ price ${price}`);
        assert.match(faq, /\+ IVA|\+ VAT|\+ TVA|zzgl\. MwSt\./, `${id}.${locale} FAQ says + VAT`);
      }
    });
  }

  it("says changing the card's details later is included at no extra cost (owner, 2026-10-20)", () => {
    const included = { pt: /incluíd[oa], sem custo extra/, en: /included at no extra cost/, es: /incluid[oa], sin coste adicional/, fr: /inclus[e]?, sans frais supplémentaires/, de: /inklusive, ohne Aufpreis/, it: /inclus[oa], senza costi aggiuntivi/ };
    const docsFaq = (locale) => strings(businessCardDocs.pages.faq[locale]).join(" ");
    for (const locale of locales) {
      const answer = productCopy["business-card"][locale].faq.find((item) => /\?/.test(item.q) && included[locale].test(item.a));
      assert.ok(answer, `business-card.${locale} FAQ says changes are included`);
      assert.match(docsFaq(locale), included[locale], `business-card docs FAQ ${locale}`);
    }
  });

  it("states the keychain packs as confirmed prices, not as a proposal (owner, 2026-10-20)", () => {
    const flag = /indicativ|orientativ|Richtwert|confirm|bestätig/i;
    for (const locale of locales) {
      const priceAnswer = productCopy.keychain[locale].faq.find((item) => /45/.test(item.a));
      assert.doesNotMatch(priceAnswer.a, flag, `keychain.${locale} FAQ price`);
      assert.doesNotMatch(strings(keychainDocs.pages["getting-started"][locale]).join(" "), flag, `keychain docs ${locale}`);
    }
  });

  it("says honestly that the keychain has no QR code", () => {
    const answers = { pt: /QR/, en: /QR/, es: /QR/, fr: /QR/, de: /QR/, it: /QR/ };
    for (const locale of locales) assert.match(productCopy.keychain[locale].faq.map((item) => item.q + item.a).join(" "), answers[locale], locale);
  });

  for (const [name, product] of Object.entries({ businessCardDocs, keychainDocs })) {
    it(`translates every ${name} page with the Portuguese shape and the house words`, () => {
      assert.equal(Object.keys(product.pages).length, 6);
      for (const [pageId, page] of Object.entries(product.pages)) {
        for (const locale of locales) {
          assert.ok(page[locale], `${name}.${pageId}.${locale} missing`);
          assert.deepEqual(shape(page[locale]), shape(page.pt), `${name}.${pageId}.${locale} differs from pt`);
          assertHouseWords(strings(page[locale]), `${name}.${pageId}.${locale}`);
          for (const [, link] of strings(page[locale]).join(" ").matchAll(/\]\((\/[^)]*)\)/g)) {
            assert.match(link, locale === "pt" ? /^\/docs\// : new RegExp(`^/${locale}/`), `${name}.${pageId}.${locale}: ${link}`);
          }
        }
      }
    });
  }

  it("labels the contact page in the six languages", () => {
    for (const locale of locales) {
      assert.deepEqual(Object.keys(businessCardLabels[locale]).sort(), Object.keys(businessCardLabels.pt).sort(), locale);
      assertHouseWords(strings(businessCardLabels[locale]), `labels.${locale}`);
    }
  });
});

describe("the contact file (vCard)", () => {
  const card = getBusinessCard("rogerio-cabaco");

  it("has the Steevanz example card", () => {
    assert.ok(card);
    assert.equal(businessCards.filter((item) => item.slug === "rogerio-cabaco").length, 1);
    assert.equal(card.email, "rcabaco@steevanz.com");
  });

  it("writes a vCard 3.0 with CRLF lines of at most 75 bytes, in UTF-8", () => {
    const vcf = buildVCard(card, { base64: "A".repeat(500), type: "JPEG" });
    assert.ok(vcf.startsWith("BEGIN:VCARD\r\nVERSION:3.0\r\n"));
    assert.ok(vcf.endsWith("END:VCARD\r\n"));
    assert.doesNotMatch(vcf.replace(/\r\n/g, ""), /\n|\r/, "only CRLF line ends");
    for (const line of vcf.split("\r\n")) assert.ok(new TextEncoder().encode(line).length <= 75, line);
    const unfolded = vcf.replace(/\r\n /g, "");
    assert.match(unfolded, /\r\nN:Cabaço;Rogério;;;\r\n/);
    assert.match(unfolded, /\r\nFN:Rogério Cabaço\r\n/);
    assert.match(unfolded, /\r\nORG:Steevanz\r\n/);
    assert.match(unfolded, /\r\nTITLE:CEO & Founder\r\n/);
    assert.match(unfolded, /\r\nTEL;TYPE=CELL,VOICE:\+351961292679\r\n/);
    assert.match(unfolded, /\r\nEMAIL;TYPE=INTERNET,WORK:rcabaco@steevanz\.com\r\n/);
    assert.match(unfolded, /\r\nURL;TYPE=WORK:https:\/\/www\.steevanz\.com\r\n/);
    assert.match(unfolded, /item\d\.URL:https:\/\/wa\.me\/351961292679\r\nitem\d\.X-ABLabel:WhatsApp/);
    assert.match(unfolded, /item\d\.URL:https:\/\/www\.instagram\.com\/steevanz_\r\nitem\d\.X-ABLabel:Instagram/);
    assert.match(unfolded, /item\d\.URL:https:\/\/www\.linkedin\.com\/company\/steevanz\r\nitem\d\.X-ABLabel:LinkedIn/);
    assert.match(unfolded, new RegExp(`PHOTO;ENCODING=b;TYPE=JPEG:${"A".repeat(500)}\\r\\n`));
  });

  it("saves without a photo too", () => {
    const vcf = buildVCard(card);
    assert.doesNotMatch(vcf, /PHOTO/);
    assert.match(vcf, /FN:Rogério Cabaço/);
  });

  it("escapes text and folds without splitting a character", () => {
    assert.equal(escapeText("a,b;c\\d\ne"), "a\\,b\\;c\\\\d\\ne");
    const long = `NOTE:${"ç".repeat(60)}`;
    const folded = foldLine(long);
    for (const line of folded.split("\r\n")) assert.ok(new TextEncoder().encode(line).length <= 75);
    assert.equal(folded.replace(/\r\n /g, ""), long);
  });
});

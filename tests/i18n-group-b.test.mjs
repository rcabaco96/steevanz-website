import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { productCopy } from "../src/content/product-copy/index.ts";
import { productExamples } from "../src/content/product-examples.ts";
import { webBriefCopy } from "../src/content/web-brief.ts";
import { webSharedCopy } from "../src/content/web-products.ts";
import { extraLocales } from "../src/lib/i18n.ts";

// Group B of the site translation (es, fr, de, it): the three website products' pages, their shared
// copy, the checkout brief, the product examples and the generated web docs.

/** The shape of a value: same keys (deep) and same array lengths, ignoring the strings themselves. */
function shape(value) {
  if (Array.isArray(value)) return value.map(shape);
  if (value && typeof value === "object") return Object.fromEntries(Object.keys(value).sort().map((key) => [key, shape(value[key])]));
  return typeof value;
}

function strings(value) {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === "object") return Object.values(value).flatMap(strings);
  return [];
}

/** Brand and price rules every translated text keeps. */
function assertHouseRules(texts, label) {
  for (const text of texts) {
    assert.doesNotMatch(text, /\bNFC\b/, `${label}: ${text}`);
    assert.doesNotMatch(text, /IVA incluído|IVA incluido|IVA inclusa|TVA comprise|TTC|inkl\.? MwSt|incl\.? VAT|including VAT|VAT included/i, `${label}: ${text}`);
    assert.doesNotMatch(text, /de siempre|de toujours|di sempre/i, `${label}: ${text}`);
  }
}

/** A translated record: every field of pt, same array lengths, and (almost) nothing left in English. */
function assertTranslated(record, en, pt, label) {
  assert.ok(record, `${label} is missing`);
  assert.deepEqual(shape(record), shape(pt), `${label} differs from pt`);
  const english = strings(en);
  const own = strings(record);
  const same = own.filter((text, index) => text === english[index] && /[a-z]{4,} [a-z]{4,}/i.test(text));
  assert.ok(same.length <= Math.ceil(own.length * 0.05), `${label} still has English: ${same.slice(0, 5).join(" | ")}`);
  assertHouseRules(own, label);
}

describe("website products translated in es, fr, de, it", () => {
  for (const id of ["website", "landing-page", "online-shop"]) {
    it(`translates the whole ${id} page`, () => {
      const { pt, en } = productCopy[id];
      for (const locale of extraLocales) assertTranslated(productCopy[id][locale], en, pt, `${id}.${locale}`);
    });
  }
});

describe("online shop price (owner, 2026-10-20: from 900 €)", () => {
  it("says 900 in the FAQ in every language", () => {
    for (const locale of ["pt", "en", ...extraLocales]) assert.match(productCopy["online-shop"][locale].faq[0].a, /900/, locale);
  });
});

describe("web shared copy, checkout brief and product examples in es, fr, de, it", () => {
  it("translates every field", () => {
    const records = { webSharedCopy, webBriefCopy, ...Object.fromEntries(Object.entries(productExamples).map(([id, examples]) => [`examples.${id}`, examples.copy])) };
    for (const [name, record] of Object.entries(records)) {
      for (const locale of extraLocales) assertTranslated(record[locale], record.en, record.pt, `${name}.${locale}`);
    }
  });
});

describe("web docs (landing page, website, online shop) in es, fr, de, it", () => {
  it("has every page in each language, translated, with links in that language", async () => {
    const { webDocs } = await import("../src/content/docs/web.ts");
    for (const id of ["landing-page", "website", "online-shop"]) {
      const { pages } = webDocs(id);
      for (const [pageId, page] of Object.entries(pages)) {
        for (const locale of extraLocales) {
          const label = `docs.${id}.${pageId}.${locale}`;
          assert.ok(page[locale], `${label} is missing`);
          assert.equal(page[locale].blocks.length, page.en.blocks.length, `${label}: blocks`);
          assert.deepEqual(page[locale].blocks.map((block) => block.type), page.en.blocks.map((block) => block.type), `${label}: block types`);
          assert.notEqual(page[locale].title, page.en.title, `${label}: title still English`);
          const texts = strings(page[locale]);
          assertHouseRules(texts, label);
          const links = texts.flatMap((text) => [...text.matchAll(/\]\((\/[^)]*)\)/g)].map((match) => match[1]));
          for (const href of links) assert.match(href, new RegExp(`^/${locale}(/|$)`), `${label}: ${href}`);
        }
      }
    }
  });
});

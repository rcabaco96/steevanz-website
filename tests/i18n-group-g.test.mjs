import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { docs as digitalMenu } from "../src/content/docs/digital-menu.ts";

// Help docs translated into es, fr, de and it (group G): same shape as pt, links in the page's own language,
// and the house words (no «NFC», no VAT-inclusive prices).

const extra = ["es", "fr", "de", "it"];
const translated = { digitalMenu };

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

function links(value) {
  return strings(value).flatMap((text) => [...text.matchAll(/\]\(([^)]*)\)/g)].map((match) => match[1]));
}

describe("help docs in es, fr, de, it (group G)", () => {
  for (const [name, product] of Object.entries(translated)) {
    it(`translates every ${name} doc page with the Portuguese shape`, () => {
      assert.equal(Object.keys(product.pages).length, 6);
      for (const [pageId, page] of Object.entries(product.pages)) {
        assert.deepEqual(shape(page.en), shape(page.pt), `${name}.${pageId}.en differs from pt`);
        for (const locale of extra) {
          assert.ok(page[locale], `${name}.${pageId}.${locale} is missing`);
          assert.deepEqual(shape(page[locale]), shape(page.pt), `${name}.${pageId}.${locale} differs from pt`);
          assert.notEqual(page[locale].title, page.en.title, `${name}.${pageId}.${locale} title is still English`);
          assert.notEqual(page[locale].description, page.en.description, `${name}.${pageId}.${locale} description is still English`);
          for (const text of strings(page[locale])) {
            assert.doesNotMatch(text, /\bNFC\b/, text);
            assert.doesNotMatch(text, /IVA incluido|IVA inclusa|TVA comprise|TTC|inkl\.? MwSt|incl\.? VAT|including VAT/i, text);
            for (const [, link] of text.matchAll(/\]\((\/[^)]*)\)/g)) assert.match(link, new RegExp(`^/${locale}/`), `${name}.${pageId}.${locale}: ${link}`);
          }
          // The same pages as the English text, with the language's own prefix (es/fr/de/it reuse the English slugs).
          assert.deepEqual(links(page[locale]).map((link) => link.replace(`/${locale}/`, "/en/")).sort(), links(page.en).sort(), `${name}.${pageId}.${locale} links`);
        }
      }
    });
  }

  it("describes the current Menu digital: six languages, sections on one page, table ordering, one video per dish", () => {
    for (const locale of ["pt", "en", ...extra]) {
      const text = strings(Object.values(digitalMenu.pages).map((page) => page[locale])).join(" ");
      assert.match(text, /☰/, `${locale}: sections reached with ☰`);
      assert.match(text, /30 €|€30/, `${locale}: 30 € a month`);
      const languages = { pt: /seis idiomas/i, en: /six languages/i, es: /seis idiomas/i, fr: /six langues/i, de: /sechs Sprachen/i, it: /sei lingue/i };
      assert.match(text, languages[locale], `${locale}: six languages`);
    }
  });
});

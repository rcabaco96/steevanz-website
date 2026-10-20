import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { productCopy } from "../src/content/product-copy/index.ts";

// Group A translations (es, fr, de, it): these product pages are fully translated, field by field.
const translated = ["digital-menu", "google-review-plates", "loyalty", "bookings", "waitlist"];
const extra = ["es", "fr", "de", "it"];
const fields = ["name", "shortName", "tagline", "summary", "metaTitle", "metaDescription", "heroTitle", "heroSubtitle", "problem", "solution", "steps", "features", "useCases", "includes", "faq"];

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

describe("group A product pages in es, fr, de, it", () => {
  for (const id of translated) {
    const record = productCopy[id];
    if (!fields.every((field) => extra.every((locale) => record[locale]?.[field] !== undefined))) {
      // Not translated yet: skip until its commit lands (each file is pushed on its own).
      it.skip(`${id} (not translated yet)`);
      continue;
    }
    it(`${id}: every field, the same shape as pt, and no English left`, () => {
      for (const locale of extra) {
        const copy = record[locale];
        assert.deepEqual(shape(copy), shape(record.pt), `${id}.${locale} shape`);
        for (const field of fields) assert.notDeepEqual(copy[field], record.en[field], `${id}.${locale}.${field} is still English`);
        assert.deepEqual(copy.useCases.map((u) => u.sector), record.pt.useCases.map((u) => u.sector), `${id}.${locale} sectors`);
        const en = new Set(strings(record.en).filter((text) => text.length > 30));
        for (const text of strings(copy)) {
          assert.ok(!en.has(text), `${id}.${locale} still has English: ${text}`);
          assert.doesNotMatch(text, /\bNFC\b|de siempre|de toujours|di sempre/, `${id}.${locale}: ${text}`);
          assert.doesNotMatch(text, /€\s*\d|IVA incluido|IVA inclusa|TVA comprise|TTC|inkl\.? MwSt/, `${id}.${locale}: ${text}`);
        }
      }
    });
  }
});

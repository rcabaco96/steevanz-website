import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { copy as aiChatbot } from "../src/content/product-copy/ai-chatbot.ts";
import { copy as aiVoice } from "../src/content/product-copy/ai-voice.ts";
import { copy as aiReviews } from "../src/content/product-copy/ai-reviews.ts";
import { copy as automation } from "../src/content/product-copy/automation.ts";
import { copy as guestGuide } from "../src/content/product-copy/guest-guide.ts";
import { extraLocales } from "../src/lib/i18n.ts";

// Product pages translated in full into es, fr, de, it (group C of the site translation, 2026-10-20).
const translated = { "ai-chatbot": aiChatbot, "ai-voice": aiVoice, "ai-reviews": aiReviews, "automation": automation, "guest-guide": guestGuide };

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

describe("group C product pages in es, fr, de, it", () => {
  for (const [id, record] of Object.entries(translated)) {
    it(`${id} has every field of the English page, translated`, () => {
      for (const locale of extraLocales) {
        const page = record[locale];
        assert.ok(page, `${id}.${locale} is missing`);
        assert.deepEqual(shape(page), shape(record.en), `${id}.${locale} differs in shape from en`);
        assert.deepEqual(page.useCases.map((u) => u.sector), record.en.useCases.map((u) => u.sector), `${id}.${locale} sectors`);
        for (const field of ["metaTitle", "metaDescription", "heroTitle", "heroSubtitle"]) assert.notEqual(page[field], record.en[field], `${id}.${locale}.${field} is still English`);
        const ours = strings(page);
        const english = new Set(strings(record.en));
        const same = ours.filter((text) => english.has(text) && /\s/.test(text));
        assert.deepEqual(same, [], `${id}.${locale} still has English sentences`);
        for (const text of ours) {
          assert.doesNotMatch(text, /\bNFC\b/, text);
          assert.doesNotMatch(text, /de siempre|de toujours|di sempre/i, text);
        }
      }
    });
  }
});

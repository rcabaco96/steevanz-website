import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { docs as aiVoice } from "../src/content/docs/ai-voice.ts";

// Help docs translated into es/fr/de/it (group F): AI Voice Receptionist, AI Chatbot, AI Reviews.
const translated = { "ai-voice": aiVoice };
const extra = ["es", "fr", "de", "it"];

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

describe("help docs translated (group F)", () => {
  for (const [name, record] of Object.entries(translated)) {
    it(`${name}: every page has es/fr/de/it with the shape of pt, its own links and the house words`, () => {
      for (const [pageId, page] of Object.entries(record.pages)) {
        for (const locale of extra) {
          const copy = page[locale];
          assert.ok(copy, `${name}/${pageId}.${locale} is missing`);
          assert.deepEqual(shape(copy), shape(page.pt), `${name}/${pageId}.${locale} differs from pt`);
          assert.notEqual(copy.title, page.en.title, `${name}/${pageId}.${locale} title is still English`);
          // The block types stay in the same order as English.
          assert.deepEqual(copy.blocks.map((block) => block.type), page.en.blocks.map((block) => block.type));
          for (const text of strings(copy)) {
            assert.doesNotMatch(text, /\bNFC\b/, text);
            assert.doesNotMatch(text, /IVA incluido|IVA inclusa|TVA comprise|TTC|inkl\.? MwSt/i, text);
            for (const [, target] of text.matchAll(/\]\((\/[^)]*)\)/g)) assert.match(target, new RegExp(`^/${locale}(/|$)`), `${name}/${pageId}.${locale} link ${target}`);
          }
        }
      }
    });
  }
});

// The same business document in the layouts real businesses upload: the PDF's text as written
// (titles, tables, frequent questions), one flat block without line breaks, a messy copy re-wrapped
// at random widths with bullets here and there, a WhatsApp/Instagram-style text, and the sections an
// older version of the cutter stored (wrong titles: «B A R B E A R I A · …», a sentence as a title).
// Shared by the conversation tests (tests/chatbot-conversations.test.mjs) and the live check script.
import { readFileSync } from "node:fs";
import { splitIntoChunks } from "../../src/lib/chatbot/documents.ts";

export const fixture = (name) => readFileSync(new URL(`../fixtures/${name}`, import.meta.url), "utf8");

/** Deterministic random numbers (the messy copy is the same on every run). */
function random(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** The same text re-wrapped at random widths, with bullets and blank lines here and there. */
export function messy(text, seed = 7) {
  const next = random(seed);
  const out = [];
  for (const line of text.split("\n")) {
    if (!line.trim()) {
      out.push("");
      continue;
    }
    const width = 32 + Math.floor(next() * 32);
    let current = next() < 0.3 ? (next() < 0.5 ? "• " : "- ") : "";
    for (const word of line.split(" ")) {
      if (current.length + word.length > width && current.trim()) {
        out.push(current.trimEnd());
        current = "";
      }
      current += `${word} `;
    }
    if (current.trim()) out.push(current.trimEnd());
    if (next() < 0.1) out.push("");
  }
  return out.join("\n");
}

/** How the older cutter stored documents: lines joined into paragraphs, a decoration and a sentence as titles. */
export function oldStyleParts(text, title) {
  const flat = text.replace(/\s+/g, " ");
  const parts = [];
  const heading = `${title} › B A R B E A R I A · P O R T O · D E S D E 2 0 1 4 › A equipa tem quatro barbeiros`;
  for (let start = 0; start < flat.length; ) {
    let end = Math.min(flat.length, start + 800);
    if (end < flat.length) end = flat.lastIndexOf(" ", end);
    parts.push({ heading, body: flat.slice(start, end).trim() });
    start = end + 1;
  }
  return parts;
}

/** A document's stored sections for a layout: structured, flat, messy, whatsapp or old. */
export function documentChunks(documents, layout, title, documentId = "doc") {
  const base = fixture(documents.structured);
  const parts =
    layout === "structured"
      ? splitIntoChunks(base, title)
      : layout === "flat"
        ? splitIntoChunks(base.replace(/\s+/g, " "), title)
        : layout === "messy"
          ? splitIntoChunks(messy(base), title)
          : layout === "whatsapp"
            ? splitIntoChunks(fixture(documents.whatsapp), title)
            : oldStyleParts(base, title);
  return parts.map((part, index) => ({ id: `${documentId}-${layout}-${index}`, documentId, documentTitle: title, property: null, language: "pt", ...part }));
}

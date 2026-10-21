// What a language model may see and how its answer is read back (shared by any model provider).
// The model gets only numbered pieces of the bot's own information ([E1] entries, [S1] document
// sections) found by the free search, must answer NO_ANSWER when they don't cover the message, and
// cites the references it used; the citations become the sources shown in «Experimentar».
import { minimumChunkScore, minimumCoverage, minimumScore, type SearchHit } from "../knowledge.ts";
import { formatPrice } from "../text.ts";
import type { AnswerRequest, AnswerSource } from "./types.ts";

export const noAnswer = "NO_ANSWER";

/** At most this many entries and document sections, each cut to a length (a small local model is slow to read). */
export const contextLimits = { entries: 5, sections: 3, entryChars: 800, sectionChars: 1200 };

export type FetchLike = (input: string, init: { method: string; headers: Record<string, string>; body: string; signal?: AbortSignal }) => Promise<{
  ok: boolean;
  status: number;
  json: () => Promise<unknown>;
}>;

export interface ContextItem {
  ref: string;
  text: string;
  source?: AnswerSource;
  entryId?: string;
}

const cut = (text: string, max: number) => (text.length > max ? `${text.slice(0, max).trimEnd()}…` : text);

/** The numbered pieces of information the model may use ([E1] entries, [S1] document sections). */
export function contextItems(request: AnswerRequest): ContextItem[] {
  const items: ContextItem[] = [];
  const entries = request.hits.filter((hit) => hit.score >= minimumScore * 0.6);
  entries.slice(0, contextLimits.entries).forEach((hit, index) => {
    if (hit.doc.kind === "entry" && hit.doc.entry) {
      items.push({ ref: `E${index + 1}`, text: cut(`Q: ${hit.doc.entry.question}\nA: ${hit.doc.entry.answer}`, contextLimits.entryChars), entryId: hit.doc.entry.id });
    } else if (hit.doc.item) {
      const item = hit.doc.item;
      const line = `${item.name}${item.priceCents !== null ? ` — ${formatPrice(item.priceCents, request.language)}` : ""}${item.description ? `: ${item.description}` : ""}`;
      items.push({ ref: `E${index + 1}`, text: cut(line, contextLimits.entryChars) });
    }
  });
  const chunks = (request.chunkHits ?? []).filter((hit: SearchHit) => hit.score >= minimumChunkScore * 0.6 || hit.coverage >= minimumCoverage);
  chunks.slice(0, contextLimits.sections).forEach((hit, index) => {
    const chunk = hit.doc.chunk;
    if (!chunk) return;
    items.push({
      ref: `S${index + 1}`,
      text: cut(`[${chunk.heading}]\n${chunk.body}`, contextLimits.sectionChars),
      source: { documentId: chunk.documentId, documentTitle: chunk.documentTitle, heading: chunk.heading, chunkId: chunk.id },
    });
  });
  return items;
}

/** The pieces as one block of text for the model. */
export function contextBlock(items: readonly ContextItem[]): string {
  return items.length ? items.map((item) => `[${item.ref}]\n${item.text}`).join("\n\n") : "(no matching entries or document sections)";
}

/** The model's text → the answer, its sources (from the [S1]/[E1] references) and no references left. */
export function parseGroundedAnswer(raw: string, items: readonly ContextItem[]): { text: string | null; sources: AnswerSource[]; entryIds: string[] } {
  const trimmed = raw.trim();
  // Small models sometimes write a sentence and then NO_ANSWER: anywhere in the reply, it means «I don't know».
  if (!trimmed || /NO[_ ]ANSWER/i.test(trimmed)) return { text: null, sources: [], entryIds: [] };
  const cited = new Set([...trimmed.matchAll(/\[([ES]\d+)\]/g)].map((match) => match[1]));
  const used = items.filter((item) => cited.has(item.ref));
  const text = trimmed
    .replace(/\s*\[[ES]\d+\](?:\s*\[[ES]\d+\])*/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .trim();
  return {
    text: text || null,
    sources: used.map((item) => item.source).filter((source): source is AnswerSource => Boolean(source)),
    entryIds: used.map((item) => item.entryId).filter((value): value is string => Boolean(value)),
  };
}

// What a language model may see and how its answer is read back (shared by every model provider:
// the local Ollama and Groq's free tier). The model gets only numbered pieces of the bot's own
// information ([E1] entries, [S1] document passages), must answer NO_ANSWER when they don't cover the
// message, and cites the references it used; the citations become the sources shown in «Experimentar».
//
// Document passages come from passages.ts across the WHOLE document (not 2–3 big sections): the best
// small passages for the message, plus, for price questions, the matching price lines (or the price
// list itself when the question is in another language) and any discount lines, and for hours
// questions the timetable, holiday and closing lines. A test with the barbershop fixture showed why:
// with three big sections the model missed «Corte clássico … 16 €» and never saw the student discount
// together with the price it applies to.
import { allowed, hoursSignal, intentWords, isAnchor, longestPriceRun, timetable } from "../doc-answers.ts";
import { buildIndex, minimumScore, passageCoverage, passageQuery, scorePassage, type KnowledgeIndex } from "../knowledge.ts";
import { answerAfter, blockAfter, type Passage } from "../passages.ts";
import { formatPrice, hasAnyKeyword, normalize } from "../text.ts";
import type { AnswerRequest, AnswerSource } from "./types.ts";

export const noAnswer = "NO_ANSWER";

/**
 * How much the model reads: entries, the best passages overall, price lines, the price list when
 * nothing priced matches, hours lines, discount lines; each passage cut to a length and everything
 * to a total (Groq's free tier counts tokens per minute and per day; a small local model is slow).
 */
export const contextLimits = {
  entries: 5,
  entryChars: 600,
  passages: 14,
  pricePassages: 6,
  priceList: 12,
  hoursPassages: 10,
  discountPassages: 3,
  passageChars: 320,
  maxPassages: 26,
  totalChars: 3800,
};

export type FetchLike = (
  input: string,
  init: { method: string; headers: Record<string, string>; body: string; signal?: AbortSignal },
) => Promise<{
  ok: boolean;
  status: number;
  json: () => Promise<unknown>;
  headers?: { get(name: string): string | null };
}>;

export interface ContextItem {
  ref: string;
  text: string;
  source?: AnswerSource;
  entryId?: string;
}

const cut = (text: string, max: number) => (text.length > max ? `${text.slice(0, max).trimEnd()}…` : text);

/** Discount words in the six languages (normalized; "*" = word beginning). */
const discountWords = ["desconto*", "promoca*", "discount*", "descuento*", "promocion*", "remise*", "reduction*", "rabatt*", "ermassig*", "sconto*", "sconti"];

/** A short title that names a part of the document («Cabelo», «Combinados», «5. Descontos»), not a line of a list or timetable. */
function isSectionTitle(passage: Passage): boolean {
  return passage.titleLike && !passage.question && !passage.price && !passage.time && hoursSignal(passage) < 2;
}

/** The nearest section title before a passage: tells the model what a line belongs to. */
function sectionOf(passage: Passage): string | null {
  for (let at = passage.position - 1; at >= 0 && at >= passage.position - 25; at--) {
    if (isSectionTitle(passage.siblings[at])) return passage.siblings[at].text;
  }
  return null;
}

/** The passages cut from the same line or paragraph as this one, in order. */
function groupOf(passage: Passage): Passage[] {
  let start = passage.position;
  let end = passage.position;
  while (start > 0 && passage.siblings[start - 1].group === passage.group) start--;
  while (end + 1 < passage.siblings.length && passage.siblings[end + 1].group === passage.group) end++;
  return passage.siblings.slice(start, end + 1);
}

/**
 * The document passages the model gets for a message, in order of priority (deduplicated, at most
 * contextLimits.maxPassages). Exported for the tests.
 */
export function groundingPassages(request: Pick<AnswerRequest, "message" | "intents" | "property">, index: KnowledgeIndex): Passage[] {
  const passages = index.passages.filter((passage) => allowed(passage, request));
  if (!passages.length) return [];
  const chosen: Passage[] = [];
  const seen = new Set<Passage>();
  const push = (passage: Passage | undefined) => {
    if (passage && !seen.has(passage)) {
      seen.add(passage);
      chosen.push(passage);
    }
  };
  /**
   * A passage with the rest of its line when that is short («Tiago Moura — fundador. … Atende de
   * terça a sábado.»), or at least the sentence before a short one that can't stand alone.
   */
  const add = (passage: Passage | undefined) => {
    if (!passage || seen.has(passage)) return;
    const group = groupOf(passage);
    if (group.length > 1 && group.length <= 4 && group.reduce((size, item) => size + item.text.length + 1, 0) <= contextLimits.passageChars) {
      push(passage);
      group.forEach(push);
      return;
    }
    const previous = passage.siblings[passage.position - 1];
    if (passage.text.length < 50 && previous && previous.group === passage.group) push(previous);
    push(passage);
  };
  /** A passage with what makes it readable: a question with its answer, an answer with its question, a title with its lines. */
  const addWithContext = (passage: Passage) => {
    add(passage);
    if (passage.question) answerAfter(passage).forEach(add);
    else if (isAnchor(passage)) blockAfter(passage, 4, 320).forEach(add);
    else {
      const previous = passage.siblings[passage.position - 1];
      if (previous?.question) add(previous);
    }
  };
  /** Best first; passages far below the best one (a single common word) are noise and left out. */
  const ranked = (candidates: readonly Passage[], query: ReturnType<typeof passageQuery>, startBonus = false) => {
    const scored = candidates
      .map((passage) => ({ passage, score: scorePassage(index, passage, query, { startBonus }) }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score);
    const floor = (scored[0]?.score ?? 0) * 0.3;
    return scored.filter((item) => item.score >= floor).map((item) => item.passage);
  };

  const has = (intent: string) => request.intents.includes(intent as never);
  const query = passageQuery(request.message);

  // Price questions: the price lines of what was asked (and the price list itself when nothing priced
  // matches, e.g. «How much is a haircut?» on a Portuguese list), plus discount lines.
  if (has("price") || has("menu")) {
    const priceQuery = passageQuery(request.message, intentWords(request.message, ["menu", "price"]));
    const priced = passages.filter((passage) => passage.price);
    const matching = priceQuery.words.length ? ranked(priced, priceQuery, true).slice(0, contextLimits.pricePassages) : [];
    matching.forEach(add);
    if (matching.length < 2) {
      const list = longestPriceRun(passages).filter((passage) => passage.price);
      list.slice(0, contextLimits.priceList).forEach(add);
    }
    const discounts = passages.filter((passage) => hasAnyKeyword(normalize(passage.text), discountWords) && !passage.question);
    const relevant = discounts.filter((passage) => passageCoverage(passage, priceQuery) > 0);
    (relevant.length ? relevant : discounts).slice(0, contextLimits.discountPassages).forEach(add);
  }

  // The best passages for the message across the whole document.
  for (const passage of ranked(passages, query).slice(0, contextLimits.passages)) addWithContext(passage);

  // Hours questions: the timetable, holiday and closing lines (strongest hours signal first).
  if (has("hours")) {
    timetable(passages).forEach(add);
    passages
      .filter((passage) => !passage.question)
      .map((passage) => ({ passage, signal: hoursSignal(passage) }))
      .filter((item) => item.signal >= 2)
      .sort((a, b) => b.signal - a.signal || a.passage.position - b.passage.position)
      .slice(0, contextLimits.hoursPassages)
      .forEach((item) => add(item.passage));
  }

  // Within the ceilings, in priority order.
  const kept: Passage[] = [];
  let size = 0;
  for (const passage of chosen) {
    if (kept.length >= contextLimits.maxPassages) break;
    const length = Math.min(passage.text.length, contextLimits.passageChars) + 12;
    if (size + length > contextLimits.totalChars) continue;
    kept.push(passage);
    size += length;
  }
  return kept;
}

/** The numbered pieces of information the model may use ([E1] entries, [S1] document passages). */
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
  if (!request.knowledge.chunks?.length) return items;
  const index = request.index ?? buildIndex(request.knowledge);
  // Reading order (the model follows a list better as it is written), the pieces of one line joined,
  // the section title in brackets; the same text twice only once.
  const order = new Map(index.passages.map((passage, position) => [passage, position]));
  const passages = groundingPassages(request, index).sort((a, b) => (order.get(a) ?? 0) - (order.get(b) ?? 0));
  const runs: Passage[][] = [];
  for (const passage of passages) {
    const run = runs[runs.length - 1];
    const last = run?.[run.length - 1];
    if (last && last.siblings === passage.siblings && last.group === passage.group && last.position + 1 === passage.position) run.push(passage);
    else runs.push([passage]);
  }
  const written = new Set<string>();
  for (const run of runs) {
    const first = run[0];
    const section = first.titleLike ? null : sectionOf(first);
    const text = cut(`${section ? `(${section}) ` : ""}${run.map((passage) => passage.text).join(" ")}`, contextLimits.passageChars + 160);
    const key = normalize(text);
    if (written.has(key)) continue;
    written.add(key);
    items.push({
      ref: `S${items.filter((item) => item.ref.startsWith("S")).length + 1}`,
      text,
      source: { documentId: first.chunk.documentId, documentTitle: first.chunk.documentTitle, heading: first.chunk.heading, chunkId: first.chunk.id },
    });
  }
  return items;
}

/** The pieces as one block of text for the model. */
export function contextBlock(items: readonly ContextItem[]): string {
  return items.length ? items.map((item) => `[${item.ref}] ${item.text}`).join("\n") : "(no matching entries or document passages)";
}

/**
 * The grounding rules every model gets after the business prompt (owner's rules: only the excerpts,
 * never invent prices or hours, simple arithmetic only with the excerpts' numbers, amounts never
 * with VAT calculated, a date the excerpts don't name is «I don't know»).
 */
export function groundingRules(): string[] {
  return [
    `If the information below does not answer the customer's message, reply exactly ${noAnswer} and nothing else. Never guess prices, hours, availability or any other fact.`,
    "After each fact you use, cite its reference in square brackets, e.g. [S1] or [E2]. Never cite anything else.",
    "Prices: quote them exactly as written. Only when the question needs it (e.g. a discount on a listed price), do simple arithmetic using only numbers written in the information, and show it briefly, e.g. «18 € − 2 € = 16 €». Check that the conditions of a discount (days, who, which service) match the question; if they don't, don't apply it.",
    "Never calculate VAT and never add VAT to any price: if a price says «+ IVA» / «+ VAT», keep it that way.",
    "Dates: if the customer asks about a specific date or holiday that the information does not name explicitly, do not work it out from the weekday or from general rules; say you don't have that information for that date and offer to pass the chat to the team. Never contradict yourself.",
  ];
}

/** «Today: Wednesday, 21 October 2026 (Europe/Lisbon).» — for «are you open today?». */
export function todayLine(request: Pick<AnswerRequest, "now" | "knowledge">): string {
  const zone = request.knowledge.timeZone || "Europe/Lisbon";
  let day: string;
  try {
    day = new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: zone }).format(request.now);
  } catch {
    day = request.now.toISOString().slice(0, 10);
  }
  return `Today: ${day} (${zone}).`;
}

/** The chat messages for any chat-completion API: system prompt, the last turns, then the excerpts and the message. */
export function groundedMessages(request: AnswerRequest, items: readonly ContextItem[], system: string, languageName: string) {
  const history = request.history.slice(-6).map((message) => ({
    role: message.author === "customer" ? "user" : "assistant",
    content: message.body,
  }));
  return [
    { role: "system", content: [system, todayLine(request), "", ...groundingRules()].join("\n") },
    ...history,
    { role: "user", content: `Relevant information:\n${contextBlock(items)}\n\nCustomer message:\n${request.message}\n\nReply in ${languageName}, in at most 4 short sentences, or ${noAnswer}.` },
  ];
}

/** The model's text → the answer, its sources (from the [S1]/[E1] references) and no references left. */
export function parseGroundedAnswer(raw: string, items: readonly ContextItem[]): { text: string | null; sources: AnswerSource[]; entryIds: string[] } {
  const trimmed = raw.trim();
  // Small models sometimes write a sentence and then NO_ANSWER: anywhere in the reply, it means «I don't know».
  if (!trimmed || /NO[_ ]ANSWER/i.test(trimmed)) return { text: null, sources: [], entryIds: [] };
  // gpt-oss writes the references in CJK brackets (【S5】), sometimes several in one («[S1, S3]»).
  const ref = String.raw`[\[【]\s*[ES]\d+(?:\s*[,;]\s*[ES]\d+)*\s*[\]】]`;
  const cited = new Set([...trimmed.matchAll(new RegExp(ref, "g"))].flatMap((match) => match[0].match(/[ES]\d+/g) ?? []));
  const used = items.filter((item) => cited.has(item.ref));
  const text = trimmed
    .replace(new RegExp(String.raw`\s*${ref}(?:\s*${ref})*`, "g"), "")
    .replace(/[ \t]+\n/g, "\n")
    .trim();
  const sources: AnswerSource[] = [];
  for (const item of used) if (item.source && !sources.some((source) => source.chunkId === item.source!.chunkId)) sources.push(item.source);
  return {
    text: text || null,
    sources,
    entryIds: used.map((item) => item.entryId).filter((value): value is string => Boolean(value)),
  };
}

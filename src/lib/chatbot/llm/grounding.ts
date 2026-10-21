// What a language model may see and how its answer is read back (shared by every model provider:
// the local Ollama and Groq's free tier). The model gets only numbered pieces of the bot's own
// information ([E1] entries, [S1] document passages), must answer NO_ANSWER when they don't cover the
// message, and cites the references it used; the citations become the sources shown in «Experimentar».
//
// Document passages come from passages.ts across the WHOLE document (not 2–3 big sections): the best
// small passages for the message, plus, for price questions, the matching price lines (or the price
// list itself when the question is in another language) and any discount lines, for hours questions
// the timetable, holiday and closing lines, and for booking questions the booking link and the «sem
// marcação» rule. A day in the message («Dá para cortar o cabelo amanhã?», «Estão abertos no
// sábado?») counts as an hours + booking question (intents.ts); the model also gets today's and
// tomorrow's weekday and date and the day asked, resolved in the bot's time zone (with that day's
// hours when they are set in the admin). A test with the barbershop fixture showed why:
// with three big sections the model missed «Corte clássico … 16 €» and never saw the student discount
// together with the price it applies to.
import { recentTurns } from "../context.ts";
import { addressPassages, allowed, asksPriceOfNothing, bookingPassages, hoursSignal, intentWords, isAnchor, longestPriceRun, sectionTitleOf, sourceOf, timetable } from "../doc-answers.ts";
import { askedDay, dayAhead, formatDay, hoursOn, localClock, type AskedDay } from "../hours.ts";
import { buildIndex, minimumScore, passageCoverage, passageMatches, passageQuery, scorePassage, type KnowledgeIndex } from "../knowledge.ts";
import { answerAfter, blockAfter, type Passage } from "../passages.ts";
import { formatPrice, hasAnyKeyword, normalize } from "../text.ts";
import type { ChatMessage } from "../types.ts";
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
  pricePassages: 8,
  priceList: 12,
  hoursPassages: 10,
  bookingPassages: 4,
  discountPassages: 3,
  followUpPassages: 4,
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

/** The nearest section title before a passage: tells the model what a line belongs to. */
function sectionOf(passage: Passage): string | null {
  const previous = passage.siblings[passage.position - 1];
  return previous ? sectionTitleOf(previous) : null;
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
export function groundingPassages(request: Pick<AnswerRequest, "message" | "intents" | "property" | "followUpOf">, index: KnowledgeIndex): Passage[] {
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
    // Fewer than two lines name what was asked (another language, a generic «cortar o cabelo» carried from
    // the previous turn), or nothing was named («Quanto custa?»): the price list itself too, so the model
    // can answer or ask which one with real examples.
    const direct = matching.filter((passage) => passageMatches(passage, priceQuery.words).length === priceQuery.words.length);
    if (direct.length < 2 || asksPriceOfNothing(request)) {
      const list = longestPriceRun(passages).filter((passage) => passage.price);
      list.slice(0, contextLimits.priceList).forEach(add);
    }
    const discounts = passages.filter((passage) => hasAnyKeyword(normalize(passage.text), discountWords) && !passage.question);
    const relevant = discounts.filter((passage) => passageCoverage(passage, priceQuery) > 0);
    (relevant.length ? relevant : discounts).slice(0, contextLimits.discountPassages).forEach(add);
  }

  // Hours questions (also «Dá para ir amanhã?», «Estão abertos no sábado?»): the timetable, holiday and
  // closing lines (strongest hours signal first), before the general passages so they always fit.
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

  // Address questions («Onde ficam?»): the address lines, wherever they are.
  if (has("location")) addressPassages(passages).forEach(add);

  // Booking questions: how to book (the online link, by phone) and the «sem marcação» rule.
  if (has("booking")) bookingPassages(passages).slice(0, contextLimits.bookingPassages).forEach(addWithContext);

  // The best passages for the message across the whole document.
  for (const passage of ranked(passages, query).slice(0, contextLimits.passages)) addWithContext(passage);

  // A follow-up («E são válidos quanto tempo?» after «Vendem vales-oferta?»): a few passages about the
  // earlier question too, so the model sees what «it» is.
  if (request.followUpOf) for (const passage of ranked(passages, passageQuery(request.followUpOf)).slice(0, contextLimits.followUpPassages)) addWithContext(passage);

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
      source: sourceOf(first),
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
    `If the information below does not answer the customer's message and there is nothing in it to ask back about, reply exactly ${noAnswer} and nothing else. Never guess prices, hours, availability or any other fact.`,
    "The chat so far comes before the customer's message. Use it to understand short follow-ups («Quanto custa?», «E ao sábado?», «E para crianças?», «And the beard?»): they are about the service, product or day of the previous messages, unless they name another one.",
    `If the message is still ambiguous (e.g. «Quanto custa?» and no service was named), don't reply ${noAnswer}: ask which one in one short sentence, naming up to 4 options from the information with their prices exactly as written.`,
    "After each fact you use, cite its reference in square brackets, e.g. [S1] or [E2]. Never cite anything else.",
    "Prices: quote them exactly as written. Only when the question needs it (e.g. a discount on a listed price), do simple arithmetic using only numbers written in the information, and show it briefly, e.g. «18 € − 2 € = 16 €». Check that the conditions of a discount (days, who, which service) match the question; if they don't, don't apply it.",
    "Never calculate VAT and never add VAT to any price: if a price says «+ IVA» / «+ VAT», keep it that way.",
    "Days: «today», «tomorrow» and weekday names are worked out for you above and next to the message («Day asked about»). For such a day, use the opening hours of that weekday from the information, unless the information lists a holiday, closure or holidays period that covers that date. If the customer asks about a specific date or holiday that the information does not name explicitly, do not work it out from the weekday or from general rules; say you don't have that information for that date and offer to pass the chat to the team. Never contradict yourself.",
    "«Can I come tomorrow?», «Is there a free slot on Saturday?»: answer with that day's opening hours (or that it is closed) and how to book or the rule for coming without booking, as written in the information. You cannot see the calendar: never say that there is a free slot or that a time is available, and never confirm a booking.",
    "Opening hours of the business always come from the business's opening hours, never from the days a staff member works.",
  ];
}

/** «Wednesday, 21/10/2026 (quarta-feira)»: English for the model, the weekday also in the reply language. */
function dayText(day: AskedDay, language: AnswerRequest["language"]): string {
  const english = formatDay(day, "en");
  return language === "en" ? english : `${english} (${formatDay(day, language).split(",")[0]})`;
}

/** «Today: Wednesday, 21/10/2026 (quarta-feira). Tomorrow: Thursday, 22/10/2026 (quinta-feira). Time zone: Europe/Lisbon.» */
export function todayLine(request: Pick<AnswerRequest, "now" | "knowledge" | "language">): string {
  const zone = request.knowledge.timeZone || "Europe/Lisbon";
  try {
    localClock(request.now, zone);
  } catch {
    return `Today: ${request.now.toISOString().slice(0, 10)}.`;
  }
  const today = dayAhead(request.now, zone, 0);
  const tomorrow = dayAhead(request.now, zone, 1);
  return `Today: ${dayText(today, request.language)}. Tomorrow: ${dayText(tomorrow, request.language)}. Time zone: ${zone}.`;
}

/**
 * The day the message asks about («amanhã», «no sábado»…), resolved in the business's time zone, with
 * that day's opening hours when the business set them in the admin (null: the message names no day).
 */
export function askedDayLine(request: Pick<AnswerRequest, "now" | "knowledge" | "language" | "message">): string | null {
  const zone = request.knowledge.timeZone || "Europe/Lisbon";
  let day: AskedDay | null;
  try {
    day = askedDay(request.message, zone, request.now);
  } catch {
    return null;
  }
  if (!day) return null;
  const relative = day.daysAhead === 0 ? "today, " : day.daysAhead === 1 ? "tomorrow, " : "";
  const line = `Day asked about: ${relative}${dayText(day, request.language)}.`;
  if (!request.knowledge.hours.length) return line;
  const { closure, slots } = hoursOn(request.knowledge.hours, request.knowledge.closures, day);
  if (closure) return `${line} Opening hours that day: closed${closure.reason ? ` (${closure.reason})` : ""}.`;
  return `${line} Opening hours that day: ${slots.length ? slots.map((slot) => `${slot.opens}–${slot.closes}`).join(" and ") : "closed"}.`;
}

/**
 * The chat messages for any chat-completion API: system prompt, the last turns of the chat (customer,
 * assistant and team, within context.ts historyLimits), then the excerpts, the day asked, which earlier
 * question a follow-up continues, and the customer's message as written.
 */
export function groundedMessages(request: AnswerRequest, items: readonly ContextItem[], system: string, languageName: string) {
  const history = recentTurns(request.history).map((message) => ({
    role: message.author === "customer" ? "user" : "assistant",
    content: message.body,
  }));
  const dayLine = askedDayLine(request);
  const followUp = request.followUpOf
    ? `This message follows the customer's earlier question «${request.followUpOf}»: answer it in that context (same service, product or day, unless the message names another one).`
    : null;
  const picked = request.picked ? `The customer picks this option from your previous message: «${request.picked}».` : null;
  return [
    { role: "system", content: [system, todayLine(request), "", ...groundingRules()].join("\n") },
    ...history,
    {
      role: "user",
      content: [
        `Relevant information:\n${contextBlock(items)}`,
        dayLine,
        followUp,
        picked,
        `Customer message:\n${request.customerMessage ?? request.message}`,
        `Reply in ${languageName}: a short, natural WhatsApp message (at most 4 short sentences), or a short question back if it is ambiguous, or ${noAnswer}.`,
      ]
        .filter(Boolean)
        .join("\n\n"),
    },
  ];
}

/** «link», «site», «website», «enlace», «lien», «sito»: a sentence pointing to an address. */
const linkWords = /\b(?:link|links|site|website|enlace|lien|sito|webseite)\b/i;
/** A web address or a bare domain («reservas.fiodenavalha.example»). */
const addressPattern = /https?:\/\/|www\.|[a-z0-9-]+\.[a-z]{2,}(?:\/|\b)/i;

/**
 * Sentences (and lines) with the spaces or line breaks after them, so a list keeps its lines and a
 * sentence dropped after a list doesn't take the list with it. A dot inside an address
 * («reservas.fiodenavalha.example», «www.x.pt») does not end a sentence: only punctuation followed by a
 * space or the end does (check, 2026-10-21: «Pode marcar no nosso site reservas.fiodenavalha.example.» was
 * cut at «reservas.» and the sentence with the link dropped, leaving «fiodenavalha.example.»).
 */
export function sentences(text: string): string[] {
  return text.match(/(?:[^.!?…\n]|[.!?…]+(?!\s|$))+(?:[.!?…]+)?\s*/g) ?? [text];
}

/**
 * Sentences that send the customer to «o nosso link» / «o nosso site» without writing any address
 * (live test, 2026-10-21: «Pode marcar através do nosso link…» after a price) are dropped; the rest of
 * the answer stays. Nothing is dropped when that would leave nothing.
 */
export function withoutEmptyLinks(text: string): string {
  const parts = sentences(text);
  const kept = parts.filter((part) => !(linkWords.test(part) && !addressPattern.test(part)));
  return kept.length && kept.length < parts.length ? kept.join("").trim() : text;
}

/**
 * A list written on one line («Depende do tipo de corte: • Corte clássico 16 € • Degradê / fade 18 €. Qual
 * prefere?», gpt-oss live test 2026-10-21) → the lead, one option per line, and the question after it.
 */
export function bulletsOnLines(text: string): string {
  return text
    .split("\n")
    .flatMap((line) => {
      if ((line.match(/•/g) ?? []).length < 2) return [line];
      const [lead, ...items] = line.split(/\s*•\s*/);
      const lines = lead.trim() ? [lead.trim()] : [];
      const last = items.pop() ?? "";
      const tail = last.match(/^(.*?[.!?…])\s+(\p{Lu}.*|[¿¡].*)$/u);
      for (const item of [...items, tail ? tail[1] : last]) if (item.trim()) lines.push(`• ${item.trim()}`);
      if (tail) lines.push(tail[2].trim());
      return lines;
    })
    .join("\n");
}

const wordsOf = (text: string) => new Set(normalize(text).split(/[^a-z0-9]+/).filter(Boolean));

/**
 * A sentence the assistant already wrote earlier in the chat (live test, 2026-10-21: «Pode marcar online em
 * … ou vir sem marcação» after every answer, also after «E ao sábado?» and «E para crianças?»): dropped
 * when it is not the first sentence of the answer (that one is the answer itself) and it says nearly the
 * same as an earlier one (≥ 80 % of the shorter sentence's words, at least 5 words). Any language.
 */
export function withoutRepeats(text: string, history: readonly ChatMessage[]): string {
  const earlier = recentTurns(history)
    .filter((message) => message.author === "bot")
    .flatMap((message) => sentences(message.body))
    .map(wordsOf)
    .filter((words) => words.size >= 5);
  if (!earlier.length) return text;
  const parts = sentences(text);
  const kept = parts.filter((part, index) => {
    if (index === 0) return true;
    const words = wordsOf(part);
    if (words.size < 5) return true;
    return !earlier.some((before) => {
      let shared = 0;
      for (const word of words) if (before.has(word)) shared++;
      return shared / Math.min(words.size, before.size) >= 0.8;
    });
  });
  return kept.length < parts.length ? kept.join("").trim() : text;
}

/** Everything a model was given, as one text (to tell its own links from invented ones). */
export function seenText(messages: readonly { content: string }[]): string {
  return messages.map((message) => message.content).join("\n");
}

/** Web addresses, bare domains and e-mail domains in a text («https://x.pt/marcar», «reservas.fio.example»). */
const addressToken = /(?:https?:\/\/)?(?:[a-z0-9-]+\.)+[a-z]{2,}(?:\/[^\s)»"']*)?/gi;
const plainAddress = (address: string) =>
  address
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/[.,;:!?…]+$/, "")
    .replace(/\/+$/, "");

/**
 * A web address the model was never given is invented (live test with Groq, 2026-10-21: «Pode marcar em
 * https://barbearia-fiodenavalha.pt/marcar» when the document says reservas.fiodenavalha.example): the
 * sentence with it is dropped. `seen` is everything the model received (prompt, history, excerpts); an
 * address counts as known when it appears there as written (without http(s):// and www.).
 */
export function withoutUnknownLinks(text: string, seen: string): string {
  if (!seen) return text;
  const known = seen.toLowerCase().replace(/https?:\/\//g, "").replace(/\bwww\./g, "");
  const invented = (part: string) => [...part.matchAll(addressToken)].some((match) => !known.includes(plainAddress(match[0])));
  const parts = sentences(text);
  const kept = parts.filter((part) => !invented(part));
  return kept.length < parts.length ? kept.join("").trim() : text;
}

/** The model's text → the answer, its sources (from the [S1]/[E1] references) and no references left. */
export function parseGroundedAnswer(
  raw: string,
  items: readonly ContextItem[],
  history: readonly ChatMessage[] = [],
  /** Everything the model was given (to drop invented links); empty: not checked. */
  seen = "",
): { text: string | null; sources: AnswerSource[]; entryIds: string[] } {
  // gpt-oss writes «quinta-feira» with a non-breaking hyphen, «16 €» with narrow no-break spaces and ends some answers with a zero-width space: plain characters.
  const trimmed = raw.replace(/[\u2010\u2011]/g, "-").replace(/[\u00A0\u202F]/g, " ").replace(/[\u200B-\u200D\uFEFF]/g, "").trim();
  // Small models sometimes write a sentence and then NO_ANSWER: anywhere in the reply, it means «I don't know».
  if (!trimmed || /NO[_ ]ANSWER/i.test(trimmed)) return { text: null, sources: [], entryIds: [] };
  // gpt-oss writes the references in CJK brackets (【S5】), sometimes several in one («[S1, S3]»).
  const ref = String.raw`[\[【]\s*[ES]\d+(?:\s*[,;]\s*[ES]\d+)*\s*[\]】]`;
  const cited = new Set([...trimmed.matchAll(new RegExp(ref, "g"))].flatMap((match) => match[0].match(/[ES]\d+/g) ?? []));
  const used = items.filter((item) => cited.has(item.ref));
  const cleaned = trimmed
    .replace(new RegExp(String.raw`\s*${ref}(?:\s*${ref})*`, "g"), "")
    // References the model made up in the same style («[A12][A16]», live test 2026-10-21).
    .replace(/\s*[\[【]\s*[A-Z]{1,2}\d+(?:\s*[,;–-]\s*[A-Z]{0,2}\d+)*\s*[\]】]/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .trim();
  // An answer that was only an invented link becomes no answer (the engine says it doesn't know).
  const text = withoutRepeats(withoutUnknownLinks(withoutEmptyLinks(bulletsOnLines(cleaned)), seen), history);
  const sources: AnswerSource[] = [];
  for (const item of used) if (item.source && !sources.some((source) => source.chunkId === item.source!.chunkId)) sources.push(item.source);
  return {
    text: text || null,
    sources,
    entryIds: used.map((item) => item.entryId).filter((value): value is string => Boolean(value)),
  };
}

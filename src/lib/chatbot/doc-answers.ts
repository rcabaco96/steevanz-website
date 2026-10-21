// Free answers from the business's documents, whatever their layout: the best passages for a
// question (a line, a sentence, a price line, a question with its answer), and, when the business
// has no structured hours or services, the hours and the price list found anywhere in the text.
// Quotes only what the documents say; returns null when they don't say it. Pure module
// (tests/chatbot-passages.test.mjs).
import { intentKeywords, type Intent } from "./intents.ts";
import { minimumChunkScore, minimumCoverage, passageCoverage, passageQuery, scorePassage, type KnowledgeIndex, type PassageQuery } from "./knowledge.ts";
import type { AnswerRequest, AnswerSource } from "./llm/types.ts";
import { fixedMessages } from "./messages.ts";
import { answerAfter, blockAfter, timePattern, type Passage } from "./passages.ts";
import { hasAnyKeyword, hasKeyword, normalize, searchWords } from "./text.ts";

export interface DocumentAnswer {
  text: string;
  sources: AnswerSource[];
}

type DocumentRequest = Pick<AnswerRequest, "message" | "language" | "settings" | "property" | "chunkHits" | "intents">;

/** Days, holidays and open/closed words in the six languages (normalized; "*" = word beginning). */
const dayWords = [
  "segunda", "terca", "quarta", "quinta", "sexta", "sabado*", "domingo*", "feriado*", "fim de semana", "dias uteis",
  "monday*", "tuesday*", "wednesday*", "thursday*", "friday*", "saturday*", "sunday*", "weekday*", "weekend*", "holiday*",
  "lunes", "martes", "miercoles", "jueves", "viernes", "festivo*", "lundi*", "mardi*", "mercredi*", "jeudi*", "vendredi*", "samedi*", "dimanche*",
  "montag*", "dienstag*", "mittwoch*", "donnerstag*", "freitag*", "samstag*", "sonntag*", "feiertag*",
  "lunedi", "martedi", "mercoledi", "giovedi", "venerdi", "domenica", "festiv*",
];
const openWords = [
  "fechad*", "fechamos", "encerrad*", "aberto*", "aberta*", "abrimos", "horario*", "closed", "open", "opens", "hours",
  "cerrad*", "abierto*", "cerramos", "ferme*", "ouvert*", "horaire*", "geschlossen", "geoffnet", "offen", "offnungszeit*",
  "chiuso", "chiusi", "aperto", "aperti", "orari*",
];

/** Days and clock times a passage mentions (a timetable line has both, or a day and «fechado»). */
function daysAndTimes(passage: Passage): number {
  const normalized = normalize(passage.text);
  const days = dayWords.filter((word) => hasKeyword(normalized, word)).length;
  const times = passage.time ? (passage.text.match(new RegExp(timePattern.source, "gi")) ?? []).length : 0;
  return days + times;
}

/** How much a passage looks like opening hours: days, clock times, «fechado»/«aberto». */
export function hoursSignal(passage: Passage): number {
  return daysAndTimes(passage) + (hasAnyKeyword(normalize(passage.text), openWords) ? 1 : 0);
}

/** «3. Horário Dia Horário Segunda-feira Fechado …» (a flattened table) → «Segunda-feira Fechado …». */
function withoutTitlePrefix(text: string): string {
  const tokens = text.split(" ");
  const first = tokens.findIndex((token) => dayWords.some((word) => !word.includes(" ") && hasKeyword(normalize(token).split(" ")[0] ?? "", word)));
  if (first <= 0 || !tokens.slice(0, first).every((token) => /^(?:\d{1,2}\.?|\p{Lu}[\p{L}\-]*:?)$/u.test(token))) return text;
  return tokens.slice(first).join(" ");
}

/** The message's words that only say which kind of question it is («quanto custa», «horário»). */
export function intentWords(message: string, intents: readonly Intent[], extra: readonly string[] = []): string[] {
  const normalized = normalize(message);
  const words = searchWords(message);
  const explained = new Set<string>();
  for (const keyword of [...intents.flatMap((intent) => intentKeywords[intent]), ...extra]) {
    if (keyword.includes(" ")) {
      if (hasKeyword(normalized, keyword)) for (const part of keyword.split(" ")) explained.add(part);
    } else {
      for (const word of words) if (hasKeyword(word, keyword)) explained.add(word);
    }
  }
  return [...explained];
}

export function allowed(passage: Passage, request: Pick<DocumentRequest, "property">): boolean {
  const property = passage.chunk.property?.trim();
  return !request.property || !property || property === request.property;
}

/** A title or label that introduces what follows («Morada»), not a line of a list («Domingo Fechado» after «Sábado 9:00–18:00»). */
export function isAnchor(passage: Passage): boolean {
  if (!passage.titleLike) return false;
  const previous = passage.siblings[passage.position - 1];
  return !(previous && (previous.price || previous.time));
}

function inOrder(index: KnowledgeIndex, passages: Passage[]): Passage[] {
  const order = new Map(index.passages.map((passage, position) => [passage, position]));
  return [...passages].sort((a, b) => (order.get(a) ?? 0) - (order.get(b) ?? 0));
}

interface Picked {
  passages: Passage[];
  joiner: string;
}

/**
 * The best passages among `candidates`: the answer after a matching question, the lines after a
 * matching title, or the best 1–`max` passages (those almost as good as the best), in reading order.
 */
function pick(
  index: KnowledgeIndex,
  candidates: readonly Passage[],
  query: PassageQuery,
  options: { max?: number; maxChars?: number; startBonus?: boolean; minShare?: number; ratio?: number } = {},
): Picked | null {
  const max = options.max ?? 3;
  const maxChars = options.maxChars ?? 500;
  // A passage must cover enough of what was asked on its own (a question with its answer counts as one).
  const covers = (passage: Passage) => {
    const share = passageCoverage(passage, query);
    if (share >= (options.minShare ?? 0) || !passage.question) return share;
    return Math.max(share, ...answerAfter(passage).map((next) => passageCoverage(next, query)));
  };
  const scored = [...new Set(candidates)]
    .map((passage) => ({ passage, score: scorePassage(index, passage, query, { startBonus: options.startBonus }) }))
    .filter((item) => item.score > 0 && covers(item.passage) >= (options.minShare ?? 0))
    .sort((a, b) => b.score - a.score);
  if (!scored.length) return null;
  const best = scored[0].passage;
  if (best.question) {
    const answer = answerAfter(best);
    if (answer.length) return { passages: answer, joiner: " " };
  }
  if (isAnchor(best)) {
    const block = blockAfter(best);
    if (block.length) return { passages: block, joiner: "\n" };
  }
  const chosen = [best];
  let size = best.text.length;
  for (const item of scored.slice(1)) {
    if (chosen.length >= max || item.score < scored[0].score * (options.ratio ?? 0.75)) break;
    if (item.passage.question || (item.passage.titleLike && !item.passage.price) || size + item.passage.text.length > maxChars) continue;
    chosen.push(item.passage);
    size += item.passage.text.length + 1;
  }
  return { passages: inOrder(index, chosen), joiner: "\n" };
}

function finish(request: DocumentRequest, picked: Picked, prefix: (passage: Passage) => string = () => "", note: string | null = null): DocumentAnswer {
  const { passages } = picked;
  const sources: AnswerSource[] = [];
  for (const passage of passages) {
    if (sources.some((source) => source.chunkId === passage.chunk.id)) continue;
    sources.push({ documentId: passage.chunk.documentId, documentTitle: passage.chunk.documentTitle, heading: passage.chunk.heading, chunkId: passage.chunk.id });
  }
  const written = passages[0].chunk.language ?? request.settings.defaultLanguage;
  const text = [passages.map((passage) => `${prefix(passage)}${passage.text}`).join(picked.joiner), note].filter(Boolean).join("\n");
  return { text: written === request.language ? text : `${text}\n${fixedMessages[request.language].answerInOtherLanguage}`, sources };
}

/** The best passages of the best document windows for the question (null: the documents don't say it). */
export function documentAnswer(request: DocumentRequest, index: KnowledgeIndex): DocumentAnswer | null {
  const hits = (request.chunkHits ?? []).filter((hit) => hit.doc.kind === "chunk" && hit.score >= minimumChunkScore && hit.coverage >= minimumCoverage);
  if (!hits.length) return null;
  const candidates = hits.slice(0, 2).flatMap((hit) => hit.doc.passages ?? []).filter((passage) => allowed(passage, request));
  const picked = pick(index, candidates, passageQuery(request.message), { minShare: minimumCoverage });
  return picked ? finish(request, picked) : null;
}

/** The timetable: the passage with the most days and times and the timetable lines around it (empty: none). */
export function timetable(passages: readonly Passage[]): Passage[] {
  let best: Passage | null = null;
  let bestSignal = 0;
  for (const passage of passages) {
    if (passage.question) continue;
    const signal = hoursSignal(passage);
    if (signal > bestSignal) [best, bestSignal] = [passage, signal];
  }
  if (!best || bestSignal < 2) return [];
  const chosen = [best];
  let size = best.text.length;
  const fits = (passage: Passage | undefined): passage is Passage =>
    Boolean(passage) && !passage!.question && daysAndTimes(passage!) > 0 && passage!.text.length <= 120 && chosen.length < 7 && size + passage!.text.length <= 450;
  for (let at = best.position - 1; fits(best.siblings[at]); at--) {
    chosen.unshift(best.siblings[at]);
    size += best.siblings[at].text.length + 1;
  }
  for (let at = best.position + 1; fits(best.siblings[at]); at++) {
    chosen.push(best.siblings[at]);
    size += best.siblings[at].text.length + 1;
  }
  return chosen;
}

/**
 * Opening hours from the documents, for a business without structured hours: the passages about
 * the day or date asked, or the timetable (the passages around the one with the most days and times).
 */
export function documentHours(request: DocumentRequest, index: KnowledgeIndex): DocumentAnswer | null {
  const passages = index.passages.filter((passage) => allowed(passage, request));
  const signal = new Map(passages.map((passage) => [passage, hoursSignal(passage)]));
  if (![...signal.values()].some((value) => value >= 2)) return null;
  const query = passageQuery(request.message, intentWords(request.message, ["hours"], openWords));
  if (query.words.length) {
    const candidates = passages.filter((passage) => (signal.get(passage) ?? 0) > 0 || (passage.question && answerAfter(passage).some((next) => hoursSignal(next) > 0)));
    const picked = pick(index, candidates, query, { minShare: 0.5 });
    if (picked) return finish(request, picked);
    const general = documentAnswer(request, index);
    if (general) return general;
  }
  const chosen = timetable(passages);
  if (!chosen.length) return null;
  const answer = finish(request, { passages: chosen, joiner: "\n" });
  const first = chosen[0].text;
  return { ...answer, text: answer.text.replace(first, withoutTitlePrefix(first)) };
}

/** Street words in the six languages (normalized) and postal codes: what an address looks like. */
const streetPattern =
  /\b(rua|r|avenida|av|praca|largo|travessa|estrada|alameda|rotunda|beco|calcada|street|st|road|rd|avenue|lane|calle|c|avda|plaza|paseo|carrer|rue|boulevard|bd|place|chemin|strasse|str|platz|weg|allee|gasse|via|viale|piazza|corso|vicolo)\b/;
const postalPattern = /\b\d{4}-\d{3}\b|\b\d{5}\b|\b[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}\b/;

/**
 * The address from the documents, for a business without a structured address: the passage that
 * looks most like one (a street word, a number, a postal code). With other words in the question
 * («onde fica o parque mais perto?») the general search answers instead.
 */
export function documentLocation(request: DocumentRequest, index: KnowledgeIndex): DocumentAnswer | null {
  const query = passageQuery(request.message, intentWords(request.message, ["location"]));
  if (query.words.length) return documentAnswer(request, index);
  let best: Passage | null = null;
  let bestScore = 0;
  for (const passage of index.passages) {
    if (!allowed(passage, request) || passage.question) continue;
    const normalized = normalize(passage.text);
    if (!streetPattern.test(normalized)) continue;
    const score = 1 + (postalPattern.test(passage.text) ? 2 : 0) + (/\d/.test(passage.text) ? 1 : 0);
    if (score > bestScore) [best, bestScore] = [passage, score];
  }
  if (!best || bestScore < 2) return null;
  // «Rua do Almada 210» + «4050-032 Porto» on the next line.
  const next = best.siblings[best.position + 1];
  const lines = !postalPattern.test(best.text) && next && postalPattern.test(next.text) && next.text.length <= 60 ? [best, next] : [best];
  const answer = finish(request, { passages: lines, joiner: "\n" });
  // A long passage (a flattened page): only the address itself, from the street to the postal code and town.
  const street = best.text.match(/(?:^|[\s,;:(])((?:Rua|R\.|Avenida|Av\.|Praça|Largo|Travessa|Estrada|Alameda|Calçada|Street|Road|Avenue|Calle|Avda\.|Plaza|Paseo|Rue|Boulevard|Place|Via|Viale|Piazza|Corso)\b[^.!?]{0,90}?(?:\b\d{4}-\d{3}\b|\b\d{5}\b)(?:\s+\p{Lu}[\p{L}-]+)?)/u);
  return street && best.text.length > 120 ? { ...answer, text: answer.text.replace(best.text, street[1].trim()) } : answer;
}

/** The longest run of price lines in the passages (a few other lines in between are allowed: titles, notes). */
export function longestPriceRun(passages: readonly Passage[]): Passage[] {
  let best: Passage[] = [];
  let run: Passage[] = [];
  let gap = 0;
  let last: Passage | null = null;
  for (const passage of passages) {
    if (last && last.siblings !== passage.siblings) [run, gap] = [[], 0];
    last = passage;
    if (passage.price) {
      run.push(passage);
      gap = 0;
      if (run.filter((item) => item.price).length > best.filter((item) => item.price).length) best = [...run];
    } else if (run.length && ++gap <= 3) {
      if (passage.titleLike) run.push(passage);
    } else {
      [run, gap] = [[], 0];
    }
  }
  return best;
}

/** At most this many lines of a price list in an overview, and characters. */
const overviewLimits = { lines: 8, chars: 650 };

/**
 * Services and prices from the documents, for a business without a structured list: the price lines
 * of what was asked («quanto custa a barba à navalha?»), or the first lines of the longest price list
 * («que serviços tem?»). null: nothing priced matches (the general search may still answer).
 */
export function documentCatalog(request: DocumentRequest, index: KnowledgeIndex): DocumentAnswer | null {
  const passages = index.passages.filter((passage) => allowed(passage, request));
  const priced = passages.filter((passage) => passage.price);
  if (!priced.length) return null;
  const query = passageQuery(request.message, intentWords(request.message, ["menu", "price"]));
  if (query.words.length) {
    const picked = pick(index, priced, query, { max: 4, maxChars: 450, startBonus: true, minShare: 0.5, ratio: 0.85 });
    return picked ? finish(request, picked) : null;
  }
  const best = longestPriceRun(passages);
  if (!best.length) return null;
  const first = best[0];
  const before = first.siblings[first.position - 1];
  const lines: Passage[] = before?.titleLike ? [before] : [];
  let size = lines.reduce((sum, passage) => sum + passage.text.length + 1, 0);
  let shown = 0;
  for (const passage of best) {
    if (passage.price && (shown >= overviewLimits.lines || size + passage.text.length > overviewLimits.chars)) break;
    lines.push(passage);
    size += passage.text.length + 3;
    if (passage.price) shown++;
  }
  while (lines.length && !lines[lines.length - 1].price) lines.pop();
  const more = best.filter((passage) => passage.price).length > shown ? fixedMessages[request.language].moreInList : null;
  return finish(request, { passages: lines, joiner: "\n" }, (passage) => (passage.price ? "• " : ""), more);
}

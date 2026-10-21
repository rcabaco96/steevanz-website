// Free answers from the business's documents, whatever their layout: the best passages for a
// question (a line, a sentence, a price line, a question with its answer), and, when the business
// has no structured hours or services, the hours and the price list found anywhere in the text.
// Quotes only what the documents say; returns null when they don't say it. Pure module
// (tests/chatbot-passages.test.mjs).
import { dayLabel, mentionsWeekday, type AskedDay } from "./hours.ts";
import { intentKeywords, type Intent } from "./intents.ts";
import { conceptsOfPassage, minimumChunkScore, minimumCoverage, passageCoverage, passageQuery, scorePassage, wordsExplainedBy, type KnowledgeIndex, type PassageQuery, type SearchHit } from "./knowledge.ts";
import type { AnswerRequest, AnswerSource } from "./llm/types.ts";
import { fixedMessages } from "./messages.ts";
import { answerAfter, blockAfter, pricePattern, timePattern, type Passage } from "./passages.ts";
import { hasAnyKeyword, hasKeyword, normalize, sameWord, searchWords } from "./text.ts";

export interface DocumentAnswer {
  text: string;
  sources: AnswerSource[];
}

type DocumentRequest = Pick<AnswerRequest, "message" | "language" | "settings" | "property" | "chunkHits" | "topicChunkHits" | "intents">;

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
      // The message's own words where the phrase matches («onde fica*» explains «onde» and «ficam»).
      const parts = keyword.split(" ");
      const tokens = normalized.split(" ");
      for (let start = 0; start + parts.length <= tokens.length; start++) {
        const matches = parts.every((part, offset) => (part.endsWith("*") ? tokens[start + offset].startsWith(part.slice(0, -1)) : tokens[start + offset] === part));
        if (matches) for (let offset = 0; offset < parts.length; offset++) explained.add(tokens[start + offset]);
      }
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
  // A passage that covers everything asked beats one that only shares a frequent word («E são válidos quanto
  // tempo?»: «Válidos durante 12 meses» over «Quanto tempo demora um corte?»).
  const scored = [...new Set(candidates)]
    .map((passage) => ({ passage, share: covers(passage), score: scorePassage(index, passage, query, { startBonus: options.startBonus }) }))
    .filter((item) => item.score > 0 && item.share >= (options.minShare ?? 0))
    .map((item) => ({ ...item, score: item.score * (0.6 + 0.4 * item.share) }))
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

/** A short title that names a part of the document («Cabelo», «Combinados», «5. Descontos»), not a line of a list or timetable. */
export function isSectionTitle(passage: Passage): boolean {
  return passage.titleLike && !passage.question && !passage.price && !passage.time && hoursSignal(passage) < 2 && !looksLikeSentence(passage.text) && !isCaption(passage);
}

/** Column titles of a table («Dia Horário», «Serviço Duração Preço», «Produto Preço»), in the six languages (normalized). */
const captionWords = new Set(
  (
    "dia dias horario horarios hora servico servicos duracao preco precos produto produtos valor descricao tempo " +
    "day days hours time service services duration price prices product products description item " +
    "servicio duracion precio producto descripcion jour horaire prix produit duree tag zeit preis produkt dauer giorno orario prezzo prodotto durata"
  ).split(" "),
);

/** A table's column titles, not a section of the document. */
function isCaption(passage: Passage): boolean {
  return passage.words.length >= 2 && passage.words.every((word) => captionWords.has(word));
}

/** The nearest section title before a passage (or the passage itself when it is one): what a line belongs to. */
export function sectionTitleOf(passage: Passage): string | null {
  for (let at = passage.position; at >= 0 && at >= passage.position - 25; at--) {
    if (isSectionTitle(passage.siblings[at])) return passage.siblings[at].text;
  }
  return null;
}

/** Verbs that make a short line a sentence («A equipa tem quatro barbeiros»), not a title, in the six languages (normalized). */
const sentenceVerbs = new Set(
  "tem temos sao somos esta estao fica ficam fazemos abrimos fechamos atendemos aceitamos has have is are was were we tiene tienen son estan hay somos avons sont sommes hat haben ist sind gibt hanno sono siamo".split(" "),
);

/** A line written as a sentence (four words or more with a verb), e.g. a sentence an older cutter took for a title. */
export function looksLikeSentence(text: string): boolean {
  const words = normalize(text).split(" ");
  return words.length >= 4 && words.some((word) => sentenceVerbs.has(word));
}

/** Letter-spaced decoration («B A R B E A R I A · P O R T O · D E S D E 2 0 1 4», «BARBEARIA · PORTO · DESDE 2014»). */
function isDecoration(part: string): boolean {
  const tokens = part.trim().split(/\s+/);
  if (tokens.length >= 4 && tokens.filter((token) => token.length === 1).length / tokens.length >= 0.6) return true;
  return /[·•|]/.test(part) && part === part.toUpperCase() && /\p{Lu}/u.test(part);
}

/**
 * A clean section name for the admin: the nearest section title in the text, else the last part of the
 * stored heading that is a real title (no letter-spaced decoration, no sentence, not the document's
 * own title). null: the document has no usable section name.
 */
export function sectionName(passage: Passage): string | null {
  const title = normalize(passage.chunk.documentTitle);
  const usable = (part: string | null | undefined): part is string => {
    const value = part?.trim();
    if (!value || isDecoration(value) || looksLikeSentence(value) || /[:;,]$/.test(value) || value.split(/\s+/).length > 8) return false;
    const normalized = normalize(value);
    return Boolean(normalized) && !title.includes(normalized) && !normalized.includes(title);
  };
  const near = sectionTitleOf(passage);
  if (usable(near)) return near.trim();
  const parts = passage.chunk.heading.split(" › ").slice(1).reverse();
  return parts.find(usable)?.trim() ?? null;
}

/** Where a quoted passage comes from (shown in the admin, never to customers). */
export function sourceOf(passage: Passage): AnswerSource {
  return {
    documentId: passage.chunk.documentId,
    documentTitle: passage.chunk.documentTitle,
    heading: passage.chunk.heading,
    chunkId: passage.chunk.id,
    section: sectionName(passage),
  };
}

/** Sources without repeats: one per document and section. */
export function uniqueSources(sources: readonly AnswerSource[]): AnswerSource[] {
  const seen = new Set<string>();
  return sources.filter((source) => {
    const key = `${source.documentId}|${source.section ?? ""}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function finish(request: DocumentRequest, picked: Picked, prefix: (passage: Passage) => string = () => "", note: string | null = null): DocumentAnswer {
  // The same sentence twice («Válidos durante 12 meses.» and, in the FAQ, «São válidos durante 12 meses.»): once.
  const keys = picked.passages.map((passage) => normalize(passage.text));
  const passages = picked.passages.filter((_, at) => !keys.some((other, index) => index !== at && other.includes(keys[at]) && (other !== keys[at] || index < at)));
  const sources = uniqueSources(passages.map(sourceOf));
  const written = passages[0].chunk.language ?? request.settings.defaultLanguage;
  const text = [passages.map((passage) => `${prefix(passage)}${passage.text}`).join(picked.joiner), note].filter(Boolean).join("\n");
  return { text: written === request.language ? text : `${text}\n${fixedMessages[request.language].answerInOtherLanguage}`, sources };
}

/** The best passages of the best document windows for the question (null: the documents don't say it). */
export function documentAnswer(request: DocumentRequest, index: KnowledgeIndex): DocumentAnswer | null {
  const usable = (hits: readonly SearchHit[] | undefined, coverage: boolean) =>
    (hits ?? []).filter((hit) => hit.doc.kind === "chunk" && hit.score >= minimumChunkScore && (!coverage || hit.coverage >= minimumCoverage));
  const query = passageQuery(request.message);
  // A follow-up («E são válidos quanto tempo?» after «Vendem vales-oferta?»): first the windows around the
  // conversation's topic, then the message's own; the passage quoted always has to match the message.
  for (const hits of [usable(request.topicChunkHits, false), usable(request.chunkHits, true)]) {
    if (!hits.length) continue;
    const candidates = hits.slice(0, 2).flatMap((hit) => hit.doc.passages ?? []).filter((passage) => allowed(passage, request));
    const picked = pick(index, candidates, query, { minShare: minimumCoverage });
    if (picked) return finish(request, picked);
  }
  return null;
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
 * Opening hours from the documents, for a business without structured hours: for a day asked
 * («amanhã», «no sábado») the timetable lines of that weekday (or the whole timetable when it names
 * the day only in a range, «Terça a sexta-feira»), after «Amanhã é quinta-feira, 22/10.»; otherwise
 * the passages about the day or date asked, or the timetable (the passages around the one with the
 * most days and times).
 */
export function documentHours(request: DocumentRequest, index: KnowledgeIndex, day: AskedDay | null = null): DocumentAnswer | null {
  const passages = index.passages.filter((passage) => allowed(passage, request));
  const signal = new Map(passages.map((passage) => [passage, hoursSignal(passage)]));
  if (![...signal.values()].some((value) => value >= 2)) return null;
  if (day) {
    const chosen = timetable(passages);
    if (chosen.length) {
      const sameDay = chosen.filter((passage) => mentionsWeekday(normalize(passage.text), day.weekday));
      const lines = sameDay.length ? sameDay : chosen;
      const answer = finish(request, { passages: lines, joiner: "\n" });
      const first = lines[0].text;
      const text = answer.text.replace(first, withoutTitlePrefix(first));
      const intro = day.mention === "weekend" ? null : fixedMessages[request.language].dayIs(dayLabel(day, request.language));
      return { ...answer, text: intro ? `${intro}\n${text}` : text };
    }
  }
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
/** The passage that looks most like an address (a street word, a number, a postal code), with the postal code line after it («4050-032 Porto»); empty: none. */
export function addressPassages(passages: readonly Passage[]): Passage[] {
  let best: Passage | null = null;
  let bestScore = 0;
  for (const passage of passages) {
    if (passage.question) continue;
    if (!streetPattern.test(normalize(passage.text))) continue;
    const score = 1 + (postalPattern.test(passage.text) ? 2 : 0) + (/\d/.test(passage.text) ? 1 : 0);
    if (score > bestScore) [best, bestScore] = [passage, score];
  }
  if (!best || bestScore < 2) return [];
  const next = best.siblings[best.position + 1];
  return !postalPattern.test(best.text) && next && postalPattern.test(next.text) && next.text.length <= 60 ? [best, next] : [best];
}

export function documentLocation(request: DocumentRequest, index: KnowledgeIndex): DocumentAnswer | null {
  const query = passageQuery(request.message, intentWords(request.message, ["location"]));
  if (query.words.length) return documentAnswer(request, index);
  const lines = addressPassages(index.passages.filter((passage) => allowed(passage, request)));
  if (!lines.length) return null;
  const best = lines[0];
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
    // «E a barba?» on a list with a «Barba» part: the lines of that part.
    const title = passages.find((passage) => isSectionTitle(passage) && sameWords(passage.words, query.words));
    const part = title ? blockAfter(title, 6, 500).filter((passage) => passage.price) : [];
    if (part.length >= 2) return finish(request, { passages: part, joiner: "\n" });
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

/** Booking words in the six languages (normalized; "*" = word beginning). */
const bookingWords = [
  "marcar", "marcac*", "marque", "marcam", "reserv*", "agend*", "book", "booking*", "booked", "appointment*", "walk in*", "cita", "citas",
  "rendez vous", "rdv", "buchen", "termin", "termine", "prenot*", "appuntament*", "vaga", "vagas", "hueco*",
];
/** «Sem marcação»: coming without booking, in the six languages. */
const walkInWords = [
  "sem marcac*", "sem reserva*", "walk in*", "without booking", "without an appointment", "sin cita", "sin reserva", "sans rendez vous",
  "sans reservation", "ohne termin", "ohne reservierung", "ohne voranmeldung", "senza appuntamento", "senza prenotazione",
];
/** A web address or a bare domain («reservas.fiodenavalha.example»). */
const linkPattern = /\bhttps?:\/\/\S+|\bwww\.\S+|(?<![@\w.-])[a-z0-9-]+(?:\.[a-z0-9-]+)*\.(?:com|pt|es|fr|de|it|eu|net|org|io|app|example)\b/i;

/**
 * The document's lines about booking, best first: coming without booking («Sem marcação: aceitamos
 * clientes sem marcação quando há vaga»), then the booking link, then the other booking lines. Price
 * lines are left out («Noivo … (com marcação) 90 min 55 €»).
 */
export function bookingPassages(passages: readonly Passage[]): Passage[] {
  return passages
    .filter((passage) => !passage.price)
    .map((passage) => {
      const normalized = normalize(passage.text);
      const walkIn = hasAnyKeyword(normalized, walkInWords);
      const booking = walkIn || hasAnyKeyword(normalized, bookingWords);
      const link = linkPattern.test(passage.text);
      return { passage, booking, score: (walkIn ? 3 : 0) + (link ? 2 : 0) + (hasKeyword(normalized, "online") ? 1 : 0) - (passage.question ? 1 : 0) };
    })
    .filter((item) => item.booking)
    .sort((a, b) => b.score - a.score || a.passage.position - b.passage.position)
    .map((item) => item.passage);
}

/** How to book, from the documents: the booking link line and the «sem marcação» rule (null: they don't say). */
export function documentBooking(request: DocumentRequest, index: KnowledgeIndex): DocumentAnswer | null {
  const ranked = bookingPassages(index.passages.filter((passage) => allowed(passage, request) && !passage.question));
  if (!ranked.length) return null;
  const link = ranked.find((passage) => linkPattern.test(passage.text));
  const walkIn = ranked.find((passage) => hasAnyKeyword(normalize(passage.text), walkInWords));
  const chosen = [...new Set([link, walkIn].filter((passage): passage is Passage => Boolean(passage)))];
  if (!chosen.length) chosen.push(ranked[0]);
  return finish(request, { passages: inOrder(index, chosen), joiner: "\n" });
}

/** The same words, in any order (light stemming: «Barbas» = «barba»). */
function sameWords(a: readonly string[], b: readonly string[]): boolean {
  return a.length > 0 && b.length > 0 && a.every((word) => b.some((other) => sameWord(word, other))) && b.every((word) => a.some((other) => sameWord(word, other)));
}

/**
 * «Fazem degradê?», «Têm pomada?», «Fazem barba?»: a short question that names something lines of the
 * price list start with → those lines (at most 3), not a sentence that only mentions it (a discount).
 */
export function documentNamedItem(request: DocumentRequest, index: KnowledgeIndex): DocumentAnswer | null {
  const words = passageQuery(request.message).words.filter((word) => !/^\d+$/.test(word));
  if (!words.length || words.length > 2) return null;
  const lines = index.passages.filter(
    (passage) => passage.price && !passage.question && allowed(passage, request) && words.every((word) => passage.words.slice(0, 3).some((candidate) => sameWord(word, candidate))),
  );
  return lines.length ? finish(request, { passages: lines.slice(0, 3), joiner: "\n" }) : null;
}

/** Words that ask for the whole list («preços», «tabela», «quanto custam os serviços?»), in the six languages (normalized). */
const listWords = [
  "precos", "prices", "precios", "preise", "prezzi", "tarifa*", "tabela*", "lista*", "list", "custam", "cuestan", "kosten", "costano", "coutent",
  "servicos", "services", "servicios", "dienstleistungen", "servizi", "tratamentos", "treatments", "pratos", "dishes", "todos", "todas", "tudo", "all",
];

/**
 * «Quanto custa?», «How much?», «Qual é o preço?» with nothing named (neither in the message nor, for a
 * follow-up, in the conversation's topic) and not asking for the whole list: the answer is a question
 * back («Depende do que procura. Por exemplo: …»), never «I don't know».
 */
export function asksPriceOfNothing(request: Pick<AnswerRequest, "message" | "intents">): boolean {
  if (!request.intents.includes("price")) return false;
  if (hasAnyKeyword(normalize(request.message), listWords)) return false;
  return !passageQuery(request.message, intentWords(request.message, ["menu", "price"])).words.length;
}

/**
 * One line of a price list as a short example: «Corte clássico (tesoura e máquina…) 30 min 16 €» →
 * «corte clássico (16 €)»; «Desenho ou risco … +4 €» → «desenho ou risco (+4 €)». null: no price.
 */
export function shortPriceLine(text: string): string | null {
  const match = new RegExp(pricePattern.source, "i").exec(text);
  if (!match) return null;
  const price = `${text[match.index - 1] === "+" ? "+" : ""}${match[0].trim()}`;
  let name = text.slice(0, match.index).split(/\s[(—–·|]|\s\d+\s?min\b|:\s|\s-\s/)[0];
  name = name.replace(/[\s:;,.\-–—·|+]+$/u, "").trim();
  if (!name) return null;
  const words = name.split(/\s+/);
  if (words.length > 7) name = words.slice(0, 7).join(" ");
  // A flattened table keeps its part title in front: «Cabelo Corte clássico» → «Corte clássico».
  if (/^\p{Lu}\p{Ll}+\s+\p{Lu}\p{Ll}/u.test(name) && name.split(/\s+/).length >= 3) name = name.replace(/^\S+\s+/, "");
  // «Corte clássico» → «corte clássico» inside a sentence (not «IVA», not ««O Fio de Navalha»»).
  if (/^\p{Lu}\p{Ll}/u.test(name)) name = name.charAt(0).toLowerCase() + name.slice(1);
  return `${name} (${price})`;
}

/**
 * A few examples from the documents' price list for a question back («Depende do que procura. Por
 * exemplo: corte clássico (16 €), degradê / fade (18 €), …»): the first lines, then the first line of
 * each part of the list (after a title), at most `max`. null: fewer than two priced lines.
 */
export function documentPriceExamples(request: Pick<DocumentRequest, "property">, index: KnowledgeIndex, max = 4): { examples: string[]; sources: AnswerSource[] } | null {
  const run = longestPriceRun(index.passages.filter((passage) => allowed(passage, request)));
  const priced = run.filter((passage) => passage.price);
  if (priced.length < 2) return null;
  const chosen: Passage[] = priced.slice(0, 2);
  run.forEach((passage, position) => {
    if (!passage.titleLike || chosen.length >= max) return;
    const next = run.slice(position + 1).find((item) => item.price);
    if (next && !chosen.includes(next)) chosen.push(next);
  });
  for (const passage of priced) if (chosen.length < max && !chosen.includes(passage)) chosen.push(passage);
  const ordered = priced.filter((passage) => chosen.includes(passage));
  const examples = [...new Set(ordered.map((passage) => shortPriceLine(passage.text)).filter((line): line is string => Boolean(line)))];
  return examples.length >= 2 ? { examples, sources: uniqueSources(ordered.map(sourceOf)) } : null;
}

/**
 * A subject carried from the previous turn that is too general for one price line («Dá para cortar o
 * cabelo amanhã?» → «Quanto custa?»): every word of it that the price list has is a word of one broad
 * idea (shared by at least 4 priced lines) and appears in 3 lines or more. Then the examples of that
 * idea, in the list's order, for a question back. null: the subject is specific («degradê», «crianças»).
 */
export function generalSubjectExamples(request: Pick<DocumentRequest, "message" | "property">, index: KnowledgeIndex, max = 4): { examples: string[]; sources: AnswerSource[] } | null {
  const query = passageQuery(request.message, intentWords(request.message, ["menu", "price"]));
  if (!query.words.length || !query.concepts.size) return null;
  const priced = index.passages.filter((passage) => passage.price && allowed(passage, request));
  const broad = [...query.concepts].filter((concept) => priced.filter((passage) => conceptsOfPassage(passage).has(concept)).length >= 4);
  if (!broad.length) return null;
  const explained = new Set(broad.flatMap((concept) => wordsExplainedBy(concept, query.normalized, query.words)));
  // Lines that name it first («Cabelo comprido…», «Coloração de cabelo…»), not a discount that mentions it.
  const names = (passage: Passage, word: string) => passage.words.slice(0, 3).some((candidate) => sameWord(word, candidate));
  const counts = query.words.map((word) => ({ word, lines: priced.filter((passage) => names(passage, word)).length }));
  if (!counts.every(({ word, lines }) => !lines || (explained.has(word) && lines >= 3))) return null;
  const lines = priced.filter((passage) => broad.some((concept) => conceptsOfPassage(passage).has(concept)));
  const examples: string[] = [];
  const used: Passage[] = [];
  for (const passage of lines) {
    const line = shortPriceLine(passage.text);
    if (!line || examples.includes(line)) continue;
    examples.push(line);
    used.push(passage);
    if (examples.length >= max) break;
  }
  return examples.length >= 2 ? { examples, sources: uniqueSources(used.map(sourceOf)) } : null;
}

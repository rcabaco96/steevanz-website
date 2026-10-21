// The free answer writer used everywhere today: deterministic answers put together from the
// business's own information (frequent questions, hours, address, menu or services, booking link).
// It never invents: when nothing matches it returns null and the engine says «I don't know».
import { askedDate, askedDay, dayLabel, formatNextOpening, formatWeek, hoursOn, type AskedDay, type OpeningState } from "../hours.ts";
import { subjectWords } from "../context.ts";
import { asksPriceOfNothing, documentNamedItem, documentAnswer, documentBooking, documentCatalog, documentHours, documentLocation, documentPriceExamples, generalSubjectExamples, uniqueSources, type DocumentAnswer } from "../doc-answers.ts";
import { buildIndex, minimumCoverage, minimumScore, questionWords, type KnowledgeIndex, type SearchHit } from "../knowledge.ts";
import { fixedMessages } from "../messages.ts";
import { intentKeywords } from "../intents.ts";
import { formatPrice, hasAnyKeyword, normalize, sameWord, searchWords } from "../text.ts";
import type { BusinessKnowledge, CatalogItem, ChatbotLanguage } from "../types.ts";
import type { AnswerProvider, AnswerRequest, AnswerResult, AnswerSource } from "./types.ts";

/** The kinds of question with an answer of their own (hours, address, booking, services, prices). */
const answerIntents: readonly string[] = ["hours", "location", "booking", "menu", "price"];

/** An entry this strong answers the question better than the generic hours/address answers. */
const strongScore = 4.5;

export function hoursAnswer(knowledge: BusinessKnowledge, opening: OpeningState, language: ChatbotLanguage): string {
  const text = fixedMessages[language];
  if (!opening.known) return text.noHours;
  const now = opening.closedToday?.reason
    ? [text.closedTodayReason(opening.closedToday.reason), opening.next ? text.opensOn(formatNextOpening(opening.next, language)) : null].filter(Boolean).join(" ")
    : opening.open && opening.closesAt
      ? text.openNow(opening.closesAt)
      : text.closedNow(opening.next ? formatNextOpening(opening.next, language) : null);
  return `${now}\n\n${text.hoursTitle}\n${formatWeek(knowledge.hours, language)}`;
}

/**
 * The opening hours of the day asked («Abrem amanhã?», «Dá para ir no sábado?»): that day's slots or
 * «closed» (a closure day says why); for today, also whether it is open right now. Never whether
 * there is a free slot: the assistant doesn't see the calendar.
 */
export function dayHoursAnswer(knowledge: BusinessKnowledge, opening: OpeningState, day: AskedDay, language: ChatbotLanguage): string {
  const text = fixedMessages[language];
  const { closure, slots } = hoursOn(knowledge.hours, knowledge.closures, day);
  const sentence = text.dayHours(dayLabel(day, language), slots, closure?.reason ?? null);
  if (day.daysAhead !== 0 || !slots.length) return sentence;
  const now = opening.open && opening.closesAt ? text.openNow(opening.closesAt) : opening.next?.daysAhead === 0 ? text.closedNow(formatNextOpening(opening.next, language)) : text.closedNow(null);
  return `${sentence} ${now}`;
}

export function locationAnswer(knowledge: BusinessKnowledge, language: ChatbotLanguage): string | null {
  const text = fixedMessages[language];
  if (!knowledge.address && !knowledge.mapsUrl) return null;
  return [knowledge.address ? text.address(knowledge.address) : null, knowledge.mapsUrl ? text.mapsLink(knowledge.mapsUrl) : null].filter(Boolean).join("\n");
}

export function bookingAnswer(knowledge: BusinessKnowledge, language: ChatbotLanguage): string | null {
  const text = fixedMessages[language];
  if (knowledge.bookingUrl) return text.booking(knowledge.bookingUrl);
  if (knowledge.phone) return text.bookingByPhone(knowledge.phone);
  return null;
}

/** An item's price as the customer reads it («16 €», «desde 35 €»), or null without a price. */
export function itemPrice(item: CatalogItem, language: ChatbotLanguage): string | null {
  if (item.priceCents === null) return null;
  const price = formatPrice(item.priceCents, language);
  return item.priceFrom ? fixedMessages[language].priceFrom(price) : price;
}

function itemLine(item: CatalogItem, language: ChatbotLanguage): string {
  const details = [
    itemPrice(item, language),
    item.durationMinutes ? fixedMessages[language].minutes(item.durationMinutes) : null,
  ].filter(Boolean);
  return `• ${item.name}${details.length ? ` — ${details.join(" · ")}` : ""}`;
}

export function itemsAnswer(items: readonly CatalogItem[], knowledge: BusinessKnowledge, language: ChatbotLanguage): string {
  const text = fixedMessages[language];
  return [text.menuIntro, ...items.map((item) => itemLine(item, language)), knowledge.menuUrl ? text.menuLink(knowledge.menuUrl) : null].filter(Boolean).join("\n");
}

export function mockAnswer(request: AnswerRequest): AnswerResult {
  const { intents, hits, knowledge, language, opening } = request;
  const has = (intent: string) => intents.includes(intent as never);
  const entryHits = hits.filter((hit): hit is SearchHit & { doc: { entry: NonNullable<SearchHit["doc"]["entry"]> } } => hit.doc.kind === "entry" && hit.score >= minimumScore && hit.coverage >= minimumCoverage);
  const itemHits = preferNamed(hits.filter((hit) => hit.doc.kind === "item" && hit.score >= minimumScore), request.message).slice(0, 5);
  const topEntry = entryHits[0] ?? null;
  const strongEntry = topEntry && topEntry.score >= strongScore ? topEntry : null;
  const parts: string[] = [];
  const used: string[] = [];

  const entryText = (hit: NonNullable<typeof topEntry>) => {
    const entry = hit.doc.entry;
    used.push(entry.id);
    const written = entry.language ?? request.settings.defaultLanguage;
    return written === language ? entry.answer : `${entry.answer}\n${fixedMessages[language].answerInOtherLanguage}`;
  };

  let sources: AnswerSource[] = [];
  let documentIndex = request.index ?? null;
  const index = () => (documentIndex ??= buildIndex(knowledge));
  const fromDocument = (answer: DocumentAnswer | null): boolean => {
    if (!answer) return false;
    parts.push(answer.text);
    sources = [...sources, ...answer.sources];
    return true;
  };
  const hasDocuments = Boolean(knowledge.chunks?.length);

  if (strongEntry) parts.push(entryText(strongEntry));
  // «Fecham nos feriados?», «Abrem nas férias?»: an entry that covers what the message is about beats the weekly
  // timetable (the subject is the holidays, not the hours).
  const subjectEntry =
    !strongEntry && topEntry && topEntry.coverage >= 1 && subjectWords(request.customerMessage ?? request.message).length > 0 ? topEntry : null;
  // «Abrem amanhã?», «Dá para ir no sábado?»: the hours of that day.
  // «Abrem no dia 25 de dezembro?», «no Natal?»: a date, only with the business's own hours and closures.
  const day = has("hours") ? (askedDay(request.message, knowledge.timeZone, request.now) ?? (opening.known ? askedDate(request.message, knowledge.timeZone, request.now) : null)) : null;
  if (has("hours") && !strongEntry && !subjectEntry) {
    // No structured hours: the documents' hours, wherever they are in the text, before «I don't know».
    if (opening.known && day) parts.push(dayHoursAnswer(knowledge, opening, day, language));
    else if (opening.known || !hasDocuments) parts.push(hoursAnswer(knowledge, opening, language));
    else if (!fromDocument(documentHours(request, index(), day))) {
      // «Têm disponibilidade para o fim de semana?» in a house guide without opening hours: no «I don't have the hours»
      // when the customer didn't ask for them (the day only made it an hours-and-booking question).
      if (hasAnyKeyword(normalize(request.customerMessage ?? request.message), intentKeywords.hours)) parts.push(hoursAnswer(knowledge, opening, language));
    }
  }
  if (has("location") && !strongEntry) {
    const location = locationAnswer(knowledge, language);
    if (location) parts.push(location);
    else if (hasDocuments) fromDocument(documentLocation(request, index()));
  }
  const wantsCatalog = has("menu") || has("price");
  // «Quanto custa?» with nothing named (now or earlier in the chat): ask which one, with examples from
  // the business's own list («Depende do que procura. Por exemplo: corte clássico (16 €), …»).
  // The same when the subject came from the previous turn and is too general for one line («Dá para
  // cortar o cabelo amanhã?» → «Quanto custa?»): the examples of that kind of service.
  const carriedSubject = Boolean(request.customerMessage) && request.customerMessage !== request.message && !subjectWords(request.customerMessage!).length;
  const clarify =
    itemHits.length || topEntry
      ? null
      : asksPriceOfNothing(request)
        ? priceExamples(request, hasDocuments ? index() : null)
        : has("price") && carriedSubject
          ? hasDocuments
            ? withLanguage(request, index(), generalSubjectExamples(request, index()))
            : priceExamples(request, null)
          : null;
  if (clarify) {
    parts.push(fixedMessages[language].whichOption(clarify.examples));
    sources = [...sources, ...clarify.sources];
    if (clarify.otherLanguage) parts.push(fixedMessages[language].answerInOtherLanguage);
  } else if (itemHits.length && (wantsCatalog || (!topEntry && !intents.some((intent) => answerIntents.includes(intent))))) {
    parts.push(itemsAnswer(itemHits.map((hit) => hit.doc.item!), knowledge, language));
  } else if (wantsCatalog && !topEntry) {
    // No matching item: the services and prices the documents list, or the whole list set in the admin
    // when nothing in particular was asked («Que serviços têm?», «Têm preçário?»).
    if (hasDocuments) fromDocument(documentCatalog(request, index()));
    else if (knowledge.items.length && !subjectWords(request.customerMessage ?? request.message).length) parts.push(wholeList(knowledge, language));
    if (knowledge.menuUrl) parts.push(fixedMessages[language].menuLink(knowledge.menuUrl));
  }
  if (!parts.length && topEntry) parts.push(entryText(topEntry));
  // «Fazem degradê?»: the lines of the price list that name it.
  if (!parts.length && hasDocuments && !intents.some((intent) => answerIntents.includes(intent))) fromDocument(documentNamedItem(request, index()));
  if (!parts.length && hasDocuments) fromDocument(documentAnswer(request, index()));
  if (has("booking")) {
    // The booking link set in the admin; otherwise what the documents say (online link, «sem marcação»), then the phone.
    const fromDocs = !knowledge.bookingUrl && hasDocuments ? documentBooking(request, index()) : null;
    if (fromDocs) {
      // Not twice when the answer above already quotes these lines.
      const said = parts.join("\n");
      const fresh = fromDocs.text.split("\n").filter((line) => !said.includes(line));
      if (fresh.length) fromDocument({ ...fromDocs, text: fresh.join("\n") });
    } else {
      const booking = bookingAnswer(knowledge, language);
      // Not when the answer above already gives the booking link («Como marcar uma demonstração? … Marque em <link>»).
      if (booking && !(knowledge.bookingUrl && parts.some((part) => part.includes(knowledge.bookingUrl!)))) parts.push(booking);
    }
  }
  // «(This information is only available in another language…)» once, at the end.
  const note = fixedMessages[language].answerInOtherLanguage;
  const noted = parts.some((part) => part.endsWith(note)) ? [...parts.map((part) => (part.endsWith(note) ? part.slice(0, -note.length).trimEnd() : part)).filter(Boolean), note] : parts;
  return { text: noted.length ? noted.join("\n\n") : null, provider: "mock", usedEntryIds: used, sources: uniqueSources(sources) };
}

/**
 * Items whose own name has a word of the message («Quanto custa um corte?» → the «Corte …» lines) beat items
 * found only through a shared idea (every haircut for «corte»); without such a name, all of them.
 */
function preferNamed(hits: SearchHit[], message: string): SearchHit[] {
  const asked = searchWords(message).filter((word) => !questionWords.has(word));
  const named = hits.filter((hit) => hit.doc.titleWords.some((title) => asked.some((word) => sameWord(word, title))));
  return named.length ? named : hits;
}

const wholeListMax = 12;

/** The services or dishes set in the admin, the first dozen, with «there are more» after. */
function wholeList(knowledge: BusinessKnowledge, language: ChatbotLanguage): string {
  const shown = itemsAnswer(knowledge.items.slice(0, wholeListMax), knowledge, language);
  return knowledge.items.length > wholeListMax ? `${shown}
${fixedMessages[language].moreInList}` : shown;
}

/** A few priced examples for a question back: the structured services or dishes, else the documents' price list. */
function priceExamples(request: AnswerRequest, index: KnowledgeIndex | null): { examples: string[]; sources: AnswerSource[]; otherLanguage: boolean } | null {
  const items = request.knowledge.items.filter((item) => item.priceCents !== null).slice(0, 4);
  if (items.length >= 2) {
    const lower = (name: string) => (/^\p{Lu}\p{Ll}/u.test(name) ? name.charAt(0).toLowerCase() + name.slice(1) : name);
    return { examples: items.map((item) => `${lower(item.name)} (${itemPrice(item, request.language)})`), sources: [], otherLanguage: false };
  }
  if (!index) return null;
  return withLanguage(request, index, documentPriceExamples(request, index));
}

/** Examples quoted from a document, noting when it is written in another language than the customer's. */
function withLanguage(request: AnswerRequest, index: KnowledgeIndex, found: { examples: string[]; sources: AnswerSource[] } | null) {
  if (!found) return null;
  const chunk = index.passages.find((passage) => passage.chunk.id === found.sources[0]?.chunkId)?.chunk;
  const written = chunk?.language ?? request.settings.defaultLanguage;
  return { ...found, otherLanguage: written !== request.language };
}

export const mockProvider: AnswerProvider = {
  id: "mock",
  paid: false,
  answer: async (request) => mockAnswer(request),
};

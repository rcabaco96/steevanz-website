// The free answer writer used everywhere today: deterministic answers put together from the
// business's own information (frequent questions, hours, address, menu or services, booking link).
// It never invents: when nothing matches it returns null and the engine says «I don't know».
import { askedDay, dayLabel, formatNextOpening, formatWeek, hoursOn, type AskedDay, type OpeningState } from "../hours.ts";
import { documentAnswer, documentBooking, documentCatalog, documentHours, documentLocation, type DocumentAnswer } from "../doc-answers.ts";
import { buildIndex, minimumCoverage, minimumScore, type SearchHit } from "../knowledge.ts";
import { fixedMessages } from "../messages.ts";
import { formatPrice } from "../text.ts";
import type { BusinessKnowledge, CatalogItem, ChatbotLanguage } from "../types.ts";
import type { AnswerProvider, AnswerRequest, AnswerResult, AnswerSource } from "./types.ts";

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

function itemLine(item: CatalogItem, language: ChatbotLanguage): string {
  const details = [
    item.priceCents !== null ? formatPrice(item.priceCents, language) : null,
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
  const itemHits = hits.filter((hit) => hit.doc.kind === "item" && hit.score >= minimumScore).slice(0, 5);
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
  // «Abrem amanhã?», «Dá para ir no sábado?»: the hours of that day.
  const day = has("hours") ? askedDay(request.message, knowledge.timeZone, request.now) : null;
  if (has("hours") && !strongEntry) {
    // No structured hours: the documents' hours, wherever they are in the text, before «I don't know».
    if (opening.known && day) parts.push(dayHoursAnswer(knowledge, opening, day, language));
    else if (opening.known || !hasDocuments || !fromDocument(documentHours(request, index(), day))) parts.push(hoursAnswer(knowledge, opening, language));
  }
  if (has("location") && !strongEntry) {
    const location = locationAnswer(knowledge, language);
    if (location) parts.push(location);
    else if (hasDocuments) fromDocument(documentLocation(request, index()));
  }
  const wantsCatalog = has("menu") || has("price");
  if (itemHits.length && (wantsCatalog || !topEntry)) {
    parts.push(itemsAnswer(itemHits.map((hit) => hit.doc.item!), knowledge, language));
  } else if (wantsCatalog && !topEntry) {
    // No matching item: the services and prices the documents list.
    if (hasDocuments) fromDocument(documentCatalog(request, index()));
    if (knowledge.menuUrl) parts.push(fixedMessages[language].menuLink(knowledge.menuUrl));
  }
  if (!parts.length && topEntry) parts.push(entryText(topEntry));
  if (!parts.length && hasDocuments) fromDocument(documentAnswer(request, index()));
  if (has("booking")) {
    // The booking link set in the admin; otherwise what the documents say (online link, «sem marcação»), then the phone.
    const fromDocs = !knowledge.bookingUrl && hasDocuments ? documentBooking(request, index()) : null;
    if (fromDocs) {
      // Not twice when the answer above already quotes these lines.
      const said = parts.join("\n");
      if (!fromDocs.text.split("\n").every((line) => said.includes(line))) fromDocument(fromDocs);
    } else {
      const booking = bookingAnswer(knowledge, language);
      if (booking) parts.push(booking);
    }
  }
  // «(This information is only available in another language…)» once, at the end.
  const note = fixedMessages[language].answerInOtherLanguage;
  const noted = parts.filter((part) => part.endsWith(note)).length > 1 ? [...parts.map((part) => (part.endsWith(note) ? part.slice(0, -note.length).trimEnd() : part)), note] : parts;
  return { text: noted.length ? noted.join("\n\n") : null, provider: "mock", usedEntryIds: used, sources };
}

export const mockProvider: AnswerProvider = {
  id: "mock",
  paid: false,
  answer: async (request) => mockAnswer(request),
};

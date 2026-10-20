// The free answer writer used everywhere today: deterministic answers put together from the
// business's own information (frequent questions, hours, address, menu or services, booking link).
// It never invents: when nothing matches it returns null and the engine says «I don't know».
import { formatNextOpening, formatWeek, type OpeningState } from "../hours.ts";
import { bestSentences } from "../documents.ts";
import { minimumChunkScore, minimumCoverage, minimumScore, type SearchHit } from "../knowledge.ts";
import { fixedMessages } from "../messages.ts";
import { formatPrice, sameWord, searchWords } from "../text.ts";
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

/** Quotes the most relevant sentences of the best document section(s) for the question. */
export function chunkAnswer(request: AnswerRequest): { text: string; sources: AnswerSource[] } | null {
  const hits = (request.chunkHits ?? []).filter((hit) => hit.doc.kind === "chunk" && hit.score >= minimumChunkScore && hit.coverage >= minimumCoverage);
  if (!hits.length) return null;
  const queryWords = searchWords(request.message);
  const relevance = (sentence: string) => {
    const words = searchWords(sentence);
    return queryWords.filter((word) => words.some((candidate) => sameWord(word, candidate))).length;
  };
  // The best section, and a second one when it is almost as good (an answer split across sections).
  const chosen = [hits[0], ...hits.slice(1, 2).filter((hit) => hit.score >= hits[0].score * 0.85 && hit.doc.chunk?.id !== hits[0].doc.chunk?.id)];
  const quotes = chosen.map((hit) => bestSentences(hit.doc.chunk!.body, relevance, chosen.length > 1 ? 2 : 3, chosen.length > 1 ? 350 : 600)).filter(Boolean);
  if (!quotes.length) return null;
  const sources = chosen.map((hit) => ({ documentId: hit.doc.chunk!.documentId, documentTitle: hit.doc.chunk!.documentTitle, heading: hit.doc.chunk!.heading, chunkId: hit.doc.chunk!.id }));
  const written = chosen[0].doc.chunk!.language ?? request.settings.defaultLanguage;
  const text = quotes.join("\n\n");
  return { text: written === request.language ? text : `${text}\n${fixedMessages[request.language].answerInOtherLanguage}`, sources };
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

  if (strongEntry) parts.push(entryText(strongEntry));
  if (has("hours") && !strongEntry) parts.push(hoursAnswer(knowledge, opening, language));
  if (has("location") && !strongEntry) {
    const location = locationAnswer(knowledge, language);
    if (location) parts.push(location);
  }
  const wantsCatalog = has("menu") || has("price");
  if (itemHits.length && (wantsCatalog || !topEntry)) {
    parts.push(itemsAnswer(itemHits.map((hit) => hit.doc.item!), knowledge, language));
  } else if (wantsCatalog && !topEntry && knowledge.menuUrl) {
    parts.push(fixedMessages[language].menuLink(knowledge.menuUrl));
  }
  if (!parts.length && topEntry) parts.push(entryText(topEntry));
  let sources: AnswerSource[] = [];
  if (!parts.length) {
    const fromDocuments = chunkAnswer(request);
    if (fromDocuments) {
      parts.push(fromDocuments.text);
      sources = fromDocuments.sources;
    }
  }
  if (has("booking")) {
    const booking = bookingAnswer(knowledge, language);
    if (booking) parts.push(booking);
  }
  return { text: parts.length ? parts.join("\n\n") : null, provider: "mock", usedEntryIds: used, sources };
}

export const mockProvider: AnswerProvider = {
  id: "mock",
  paid: false,
  answer: async (request) => mockAnswer(request),
};

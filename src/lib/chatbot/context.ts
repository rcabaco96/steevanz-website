// The conversation around a message. Customers write follow-ups that only make sense with the turn
// before («Dá para cortar o cabelo amanhã?» → «Quanto custa?»; «Quanto custa um corte?» → «E para
// crianças?» → «E a barba?»; «A que horas abrem amanhã?» → «E ao sábado?»; «How much?»). Here the
// recent customer messages are followed as a running topic (what it is about, what kind of question,
// which day), and a short or elliptic message borrows what it lacks from that topic: the search runs
// on the message plus the topic's words, and the kind of question carries over. The last turns are
// also what an AI sees of the chat (recentTurns). Pure module (tests/chatbot-conversations.test.mjs).
import { intentWords } from "./doc-answers.ts";
import { dayMention, dayPhrase, isDayWord, type DayMention } from "./hours.ts";
import { availabilityPhrases, detectIntents, intentKeywords, type Intent } from "./intents.ts";
import { questionWords, wordsExplainedBy } from "./knowledge.ts";
import { hasAnyKeyword, normalize, searchWords } from "./text.ts";
import type { ChatbotBusinessKind, ChatMessage } from "./types.ts";

/** What an AI sees of the chat before the new message: at most this many messages and characters (each message cut). */
export const historyLimits = { messages: 6, chars: 1500, messageChars: 500 };

/** A topic older than this (between two customer messages) is forgotten. */
export const topicMemoryMs = 6 * 60 * 60_000;

/** The last turns of the chat (customer, assistant and team; not the system notes), oldest first, within historyLimits. */
export function recentTurns(history: readonly ChatMessage[], limits = historyLimits): ChatMessage[] {
  const kept: ChatMessage[] = [];
  let size = 0;
  for (let index = history.length - 1; index >= 0 && kept.length < limits.messages; index--) {
    const message = history[index];
    const text = message.body.trim();
    if (message.author === "system" || !text) continue;
    const body = text.length > limits.messageChars ? `${text.slice(0, limits.messageChars).trimEnd()}…` : text;
    if (kept.length && size + body.length > limits.chars) break;
    kept.unshift({ ...message, body });
    size += body.length;
  }
  return kept;
}

/** The kinds of question that are about the business's information (the others are small talk or safety rules). */
const answerIntents: readonly Intent[] = ["hours", "location", "booking", "menu", "price"];
const smallTalk: readonly Intent[] = ["greeting", "thanks", "bye", "yes"];
/** Kinds of question that keep the thing asked about («Quanto custa?» / «Dá para marcar?» after «Fazem degradê?»). */
const itemIntents: readonly Intent[] = ["price", "menu", "booking"];

/** Words that only carry the request («quero saber», «can you tell me», «quisiera»), in the six languages (normalized). */
const fillerWords = new Set(
  (
    "quero queria gostava gostaria saber dizer diga diz podia poderia pode entao tambem mais ainda sobre agora ok certo bem tal " +
    "want wanted would like know tell about also then too so ok well please " +
    "quiero quisiera saber decir digame tambien entonces mas vale " +
    "veux voudrais savoir dire aussi alors donc " +
    "mochte moechte will wissen sagen auch dann noch " +
    "voglio vorrei sapere dire anche allora poi"
  ).split(" "),
);

/** Generic words for «the thing» asked about: alone they don't say which service or dish («Quanto custa o serviço?»). */
const genericWords = [
  "menu*", "ementa", "carta", "prato*", "comida", "dish*", "food", "plat", "plats", "speisekarte", "gericht*", "piatt*", "servico*", "service*",
  "servicio*", "dienstleistung*", "serviz*", "tratamento*", "treatment*", "tratamiento*", "soin*", "behandlung*", "trattament*", "opcao", "opcoes",
  "option*", "opcion*", "coisa*", "thing*",
];

/** Words that point back to what was just talked about («isso», «that», «eso», «ça», «dies», «quello»; not «das», a Portuguese contraction too). */
const pointingWords = new Set(
  (
    "isso disso nisso esse essa desse dessa nesse nessa aquele aquela aquilo it that this those these them one eso ese esa esos esas ello " +
    "ca cela celui celle ceux dies davon dafur dafuer quello quella questo questa cio"
  ).split(" "),
);

/** A message that starts like a continuation: «E ao sábado?», «and on Saturday?», «y para niños?», «et pour…», «und…», «e per…». */
const continuationStart = /^(?:e|and|y|et|und|ed|tambem|also|plus|what about|how about|e quanto|e se|then)\b/;

/** What a message is about, without the words that only say which kind of question it is, days, courtesy and fillers. */
export function subjectWords(text: string): string[] {
  const normalized = normalize(text);
  const words = searchWords(text);
  const explained = new Set([
    ...intentWords(text, [...smallTalk, ...answerIntents], [...availabilityPhrases, ...genericWords]),
    // «Quanto tempo demora?» asks about the same thing as before, not about «tempo».
    ...wordsExplainedBy("duration", normalized, words),
  ]);
  return words.filter((word) => !questionWords.has(word) && !fillerWords.has(word) && !pointingWords.has(word) && !isDayWord(word) && !explained.has(word));
}

/** What the conversation is about so far. */
export interface Topic {
  /** The customer message that set it (or last added to it). */
  text: string;
  subject: string[];
  intents: Intent[];
  day: DayMention | null;
  at: number;
}

export interface FollowUp {
  /** What to search with: the message, plus the topic's words when it lacks them. */
  query: string;
  /** The kinds of question to answer: the message's own, or the topic's when it has none. */
  intents: Intent[];
  /** The previous customer question this message continues (null: it stands alone). */
  previous: string | null;
  /** «Quero a segunda opção» right after a list the assistant sent: that option («degradê / fade (18 €)»). */
  picked?: string | null;
  /**
   * «E são válidos quanto tempo?» after «Vendem vales-oferta?», «E pomada?» after «Vendem óleo de barba?»:
   * the document windows are searched with the topic's words too (the passage quoted still has to match
   * the message itself).
   */
  windowQuery?: string;
}

/** Ordinal words in the six languages (normalized), by position (-1 = the last one). */
const ordinalWords: [number, readonly string[]][] = [
  [0, ["primeira", "primeiro", "first", "primera", "primero", "premiere", "premier", "erste", "ersten", "erster", "erstes", "prima", "primo"]],
  [1, ["segunda", "segundo", "second", "deuxieme", "seconde", "zweite", "zweiten", "zweiter", "zweites", "seconda", "secondo"]],
  [2, ["terceira", "terceiro", "third", "tercera", "tercero", "troisieme", "dritte", "dritten", "dritter", "drittes", "terza", "terzo"]],
  [3, ["quarta", "quarto", "fourth", "cuarta", "cuarto", "quatrieme", "vierte", "vierten", "vierter", "viertes"]],
  [-1, ["ultima", "ultimo", "last", "derniere", "dernier", "letzte", "letzten", "letzter", "letztes"]],
];
/** «na segunda», «até sexta», «segunda-feira»: a day, not an option. */
const dayLeads = new Set(["na", "no", "nas", "nos", "ate", "para", "proxima", "proximo", "esta", "nesta", "on", "el", "le", "am", "il"]);

/** The options of a list the assistant sent: «• …» lines, or «Por exemplo: a, b, c ou d.». */
export function listOptions(text: string): string[] {
  const bullets = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => /^[•▪◦*-]\s+/.test(line))
    .map((line) => line.replace(/^[•▪◦*-]\s+/, ""));
  if (bullets.length >= 2) return bullets;
  for (const match of text.matchAll(/:\s+([^?!]+?)(?:\.(?:\s|$)|[?!]|$)/g)) {
    const parts = match[1].split(/,\s+/);
    const last = parts.pop() ?? "";
    const split = last.match(/^(.*\S)\s+(?:ou|or|o|oder)\s+(\S.*)$/);
    const options = [...parts, ...(split ? [split[1], split[2]] : [last])].map((part) => part.trim()).filter(Boolean);
    if (options.length >= 2) return options;
  }
  return [];
}

/** The option a short message picks by its position («a segunda opção», «the second one», «la última»), or null. */
export function pickedOption(message: string, options: readonly string[]): string | null {
  if (options.length < 2) return null;
  const tokens = normalize(message).split(" ");
  if (!tokens.length || tokens.length > 7) return null;
  for (const [position, names] of ordinalWords) {
    const at = tokens.findIndex((token) => names.includes(token));
    if (at < 0 || dayLeads.has(tokens[at - 1] ?? "") || tokens[at + 1] === "feira") continue;
    return options.at(position) ?? null;
  }
  return null;
}

interface Resolution extends FollowUp {
  topic: Topic | null;
}

function resolveAgainst(text: string, at: number, kind: ChatbotBusinessKind, topic: Topic | null): Resolution {
  const found = detectIntents(text, kind);
  const own = subjectWords(text);
  const ownIntents = found.filter((intent) => answerIntents.includes(intent));
  const ownDay = dayMention(normalize(text));
  // A request for a person, a complaint, an emergency…: the safety rules answer it and the topic starts over.
  if (found.some((intent) => !answerIntents.includes(intent) && !smallTalk.includes(intent) && intent !== "urgent")) return { query: text, intents: found, previous: null, topic: null };
  const alone: Resolution = { query: text, intents: found, previous: null, topic: own.length || ownIntents.length ? { text, subject: own, intents: ownIntents, day: ownDay, at } : topic };
  if (!topic || at - topic.at > topicMemoryMs || (!topic.subject.length && !topic.intents.length)) return alone;
  const tokens = normalize(text).split(" ");
  const elliptic = !own.length || continuationStart.test(normalize(text)) || tokens.some((token) => pointingWords.has(token));
  // «Fazem tranças?» after a price question stands alone; «E tranças?» doesn't.
  if (!elliptic || own.length > 3) return alone;
  // «E num degradê à quarta?» after a price or discount question: the day only says when; it is still about
  // the price (a day alone, «E ao sábado?», stays an hours question).
  const normalized = normalize(text);
  const dayOnly =
    ownDay !== null &&
    own.length > 0 &&
    ownIntents.every((intent) => intent === "hours" || intent === "booking") &&
    topic.intents.some((intent) => intent === "price" || intent === "menu") &&
    !hasAnyKeyword(normalized, [...intentKeywords.hours, ...intentKeywords.booking, ...availabilityPhrases]);
  const kept = dayOnly ? found.filter((intent) => intent !== "hours" && intent !== "booking") : found;
  const keptOwn = dayOnly ? [] : ownIntents;
  // The thing asked about carries over when the message names none and asks the same kind of thing about it
  // (price, booking) or nothing at all; never into an hours or address question («Onde ficam?»).
  const carrySubject = !own.length && keptOwn.every((intent) => itemIntents.includes(intent));
  // The kind of question carries over when the message has none of its own: price, menu and booking for a new
  // thing («E a barba?»); hours and address only when nothing new is named («E então?»).
  const carried = keptOwn.length ? [] : topic.intents.filter((intent) => !own.length || itemIntents.includes(intent));
  if (!carrySubject && !carried.length) {
    if (ownIntents.length || !own.length) return alone;
    return { ...alone, previous: topic.text, windowQuery: topic.subject.length ? `${text} ${topic.subject.join(" ")}` : undefined };
  }
  const intents = [...new Set([...kept, ...carried])];
  const day = ownDay ?? (carried.includes("hours") && topic.day ? topic.day : null);
  const extra = [carrySubject ? topic.subject.join(" ") : "", !ownDay && day ? dayPhrase(day) : ""].filter(Boolean).join(" ");
  const subject = own.length ? own : carrySubject ? topic.subject : [];
  return {
    query: extra ? `${text} ${extra}` : text,
    intents,
    previous: topic.text,
    topic: { text, subject, intents: intents.filter((intent) => answerIntents.includes(intent)), day, at },
  };
}

/**
 * The message read in its conversation: when it is short or elliptic («Quanto custa?», «E ao
 * sábado?», «E para crianças?», «How much?») and an earlier customer message set a topic, the search
 * query gets the topic's words and the message gets the topic's kind of question. Messages made only
 * of greetings or thanks don't change the topic.
 */
export function resolveFollowUp(input: { message: string; at: number; history: readonly ChatMessage[]; kind: ChatbotBusinessKind }): FollowUp {
  let topic: Topic | null = null;
  const customers = input.history.filter((message) => message.author === "customer").slice(-4);
  for (const message of customers) topic = resolveAgainst(message.body, message.at, input.kind, topic).topic;
  // «Quero a segunda opção» right after a list: that option, with the topic's kind of question.
  const last = input.history[input.history.length - 1];
  const picked = last && (last.author === "bot" || last.author === "owner") ? pickedOption(input.message, listOptions(last.body)) : null;
  if (picked) {
    const name = picked.replace(/\([^)]*\)/g, " ").replace(/\s+/g, " ").trim();
    // «Quero a segunda» is the second option here, not Monday: no hours or booking question unless written out.
    const normalized = normalize(input.message);
    const found = detectIntents(input.message, input.kind).filter((intent) => (intent !== "hours" && intent !== "booking") || hasAnyKeyword(normalized, intentKeywords[intent]));
    const carried = topic?.intents.filter((intent) => itemIntents.includes(intent)) ?? [];
    return { query: name, intents: [...new Set([...found, ...carried])], previous: topic?.text ?? null, picked };
  }
  const { query, intents, previous, windowQuery } = resolveAgainst(input.message, input.at, input.kind, topic);
  return { query, intents, previous, ...(windowQuery ? { windowQuery } : {}) };
}

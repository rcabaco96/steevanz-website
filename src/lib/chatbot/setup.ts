// «Configurar em 5 passos»: what a business fills in by itself in the admin (business details, hours,
// services and prices, frequent questions, documents) and how it is stored without new tables: hours and
// the price list are knowledge entries with a fixed question, written in a canonical text that is read
// back here into the engine's structured hours, closures and catalogue items (rows.ts → botProfileFrom).
// A hand-written entry with the same question that doesn't read back stays an ordinary entry.
// Also: reading a price list or a timetable pasted from WhatsApp/Word, the frequent questions suggested
// per sector, the test questions and the setup's completeness. Pure module (tests/chatbot-setup.test.mjs).
import { formatPrice } from "./text.ts";
import { normalize } from "./text.ts";
import type { CatalogItem, ChatbotBusinessKind, Closure, KnowledgeKind, WeeklyHours } from "./types.ts";

/** The fixed questions of the entries the setup writes (and finds again). */
export const setupQuestions = {
  hours: "Qual é o horário?",
  services: "Serviços e preços",
  holidays: "Fecham nos feriados ou para férias?",
} as const;

export const setupKeywords = {
  hours: "horário, abrem, fecham, aberto, fechado, horas",
  services: "serviços, preços, preçário, tabela",
  holidays: "feriado, feriados, férias, fechado, encerrado, natal, páscoa, agosto",
} as const;

export const setupLimits = { items: 120, itemName: 120, closures: 40, faqAnswer: 1000, notes: 1000 };

// Price lists ----------------------------------------------------------------------------------------

export interface PriceItem {
  name: string;
  priceCents: number | null;
  /** The price is where it starts («desde 35 €», «15–20 €»). */
  priceFrom: boolean;
  durationMinutes: number | null;
}

export interface PriceListResult {
  items: PriceItem[];
  /** Lines that are neither a priced item nor a title (shown in the preview, never saved). */
  skipped: string[];
}

const currencyAfter = String.raw`(?:€|eur(?:os?)?\b|eur\.)`;
const amount = String.raw`(\d{1,3}(?:\.\d{3})+|\d{1,5})(?:[.,](\d{1,2}))?`;
/** «16€», «16,50 €», «16 euros», «€16», «€ 16,5», «16,-€», «16€50». */
const pricePatterns: RegExp[] = [
  new RegExp(String.raw`(\d{1,4})€(\d{2})(?!\d)`, "iu"),
  new RegExp(String.raw`${amount}\s*,-\s*€?`, "iu"),
  new RegExp(String.raw`${amount}\s*${currencyAfter}`, "iu"),
  new RegExp(String.raw`€\s*${amount}`, "iu"),
];
const rangePattern = new RegExp(String.raw`(?<![\d\p{L}])${amount}\s*(?:€|euros?)?\s*(?:-|–|—|a|até|ate|to)\s*${amount}\s*${currencyAfter}`, "iu");
const fromWords = /(?:^|\s)(?:desde|a partir de|apartir de|from|starting at|ab|à partir de|a partir dos?)\s*$/iu;
const onRequestWords = /\b(sob consulta|sob orçamento|sob orcamento|a consultar|on request|preço a combinar|preco a combinar|grátis|gratis|gratuito|gratuita|oferta|free)\b/iu;
const durationPatterns: { pattern: RegExp; minutes: (match: RegExpMatchArray) => number }[] = [
  { pattern: /(\d{1,2})\s*h\s*(\d{1,2})\s*(?:m(?:in(?:utos?|s)?)?)?(?![\p{L}\d])/iu, minutes: (m) => Number(m[1]) * 60 + Number(m[2]) },
  { pattern: /(\d{1,2})[.,](5)\s*h(?:oras?|rs?)?(?![\p{L}\d])/iu, minutes: (m) => Number(m[1]) * 60 + 30 },
  { pattern: /(\d{1,2})\s*(?:h|horas?|hrs?|hours?)(?![\p{L}\d])/iu, minutes: (m) => Number(m[1]) * 60 },
  { pattern: /(\d{1,3})\s*(?:min(?:utos?|s|\.)?|m|minutes?)(?![\p{L}\d])/iu, minutes: (m) => Number(m[1]) },
];

function cents(whole: string, fraction: string | undefined): number {
  const euros = Number(whole.replace(/\./g, ""));
  const part = fraction ? Number(fraction.padEnd(2, "0")) : 0;
  return euros * 100 + part;
}

/** «• *Corte* ✂️» → «Corte»: bullets, numbering, emoji and WhatsApp/Markdown emphasis off. */
function cleanLine(line: string): string {
  return line
    .replace(/\p{Extended_Pictographic}|\u{FE0F}|\u{200D}/gu, " ")
    .replace(/^\s*(?:[-•*·–—>»✓✔︎+]+|\d{1,2}[.)](?!\d))\s*/u, "")
    .replace(/(^|\s)[*_~]+(?=\S)/g, "$1")
    .replace(/(?<=\S)[*_~]+(?=\s|$|[.,;:!?)])/g, "")
    .replace(/\t+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** A line that only names a group («CABELO», «Barba:», «Preçário 2026», «Serviços»). */
function isTitle(line: string): boolean {
  if (/\d/.test(line) && !/^(preçário|precario|tabela|lista|menu)\b/iu.test(line)) return false;
  if (line.endsWith(":")) return true;
  const letters = line.replace(/[^\p{L}]/gu, "");
  if (letters.length >= 3 && letters === letters.toUpperCase() && letters !== letters.toLowerCase()) return true;
  return /^(preçário|precario|preços|precos|tabela de preços|tabela|lista de preços|serviços|servicos|menu|price list|prices)\b/iu.test(line);
}

/** What is left of a line once the price and duration are out: the item's name. */
function nameOf(text: string): string {
  return text
    .replace(/\(\s*\)|\[\s*\]/g, " ")
    // A VAT note pasted with a price («+ IVA», «s/ IVA», and the inclusive forms): never part of the name.
    .replace(/(?:\+|[cs]\/|com)\s*iva\b|iva\s+inclu[ií]do/giu, " ")
    .replace(/(?:^|\s)(?:desde|a partir de|apartir de|from)(?=\s|$)/giu, " ")
    .replace(/\.{2,}|…+|_{2,}/g, " ")
    .replace(/\s+/g, " ")
    .replace(/^[\s\-–—:|·,;/=>]+|[\s\-–—:|·,;/=(>]+$/gu, "")
    .trim()
    .slice(0, setupLimits.itemName);
}

interface FoundPrice {
  priceCents: number;
  priceFrom: boolean;
  /** The text without the price. */
  rest: string;
}

function findPrice(text: string): FoundPrice | null {
  const range = text.match(rangePattern);
  if (range && range.index !== undefined) {
    return { priceCents: cents(range[1], range[2]), priceFrom: true, rest: `${text.slice(0, range.index)} ${text.slice(range.index + range[0].length)}` };
  }
  let found: { match: RegExpMatchArray; priceCents: number } | null = null;
  for (const pattern of pricePatterns) {
    const match = text.match(pattern);
    if (!match || match.index === undefined) continue;
    if (!found || match.index < (found.match.index ?? 0)) found = { match, priceCents: cents(match[1], match[2]) };
  }
  if (!found) {
    // «Corte 16», «Barba - 10», «Menu do dia 9,50»: a bare number at the end, after a name.
    const bare = text.match(/^(.*\p{L}.*?)[\s:\-–—|.]+(\d{1,3}(?:[.,]\d{2})?)\s*$/u);
    if (!bare) return null;
    const before = normalize(bare[1]).split(" ").pop() ?? "";
    if (["ate", "anos", "n", "no", "x", "de", "para", "com", "mais", "menos"].includes(before)) return null;
    const [whole, fraction] = bare[2].split(/[.,]/);
    return { priceCents: cents(whole, fraction), priceFrom: false, rest: bare[1] };
  }
  const index = found.match.index ?? 0;
  const before = text.slice(0, index);
  return { priceCents: found.priceCents, priceFrom: fromWords.test(before), rest: `${before} ${text.slice(index + found.match[0].length)}` };
}

function findDuration(text: string): { minutes: number; rest: string } | null {
  for (const { pattern, minutes } of durationPatterns) {
    const match = text.match(pattern);
    if (!match || match.index === undefined) continue;
    const value = minutes(match);
    if (value <= 0 || value > 24 * 60) continue;
    return { minutes: value, rest: `${text.slice(0, match.index)} ${text.slice(match.index + match[0].length)}` };
  }
  return null;
}

function readItem(text: string): PriceItem | null {
  const price = findPrice(text);
  let rest = price ? price.rest : text;
  const duration = findDuration(rest);
  if (duration) rest = duration.rest;
  let name = nameOf(rest)
    // «Tranças - sob consulta» → «Tranças (sob consulta)».
    .replace(/\s*[-–—:]\s*(sob consulta|sob orçamento|sob orcamento|a consultar|on request|grátis|gratis|gratuito|gratuita)$/iu, " ($1)");
  // «Desenho/risco +4€»: an extra on top of another service.
  if (price && /\+$/.test(name)) name = `${name.replace(/\s*\+$/, "")} (extra)`;
  if (!name || !/\p{L}{2}/u.test(name)) return null;
  if (!price) return onRequestWords.test(text) ? { name, priceCents: null, priceFrom: false, durationMinutes: duration?.minutes ?? null } : null;
  return { name, priceCents: price.priceCents, priceFrom: price.priceFrom, durationMinutes: duration?.minutes ?? null };
}

/** A price alone on its line («16 €», «- 10€ -»): it belongs to the name on the line before. */
function priceOnly(text: string): FoundPrice | null {
  const price = findPrice(text);
  if (!price) return null;
  const rest = findDuration(price.rest)?.rest ?? price.rest;
  return /\p{L}{2}/u.test(nameOf(rest)) ? null : price;
}

/**
 * Reads a price list pasted from WhatsApp, Word, Instagram or a PDF: one item per line («Corte 16€»,
 * «Barba - 10 €», «Degradê 18 euros 40 min», «Coloração: desde 35 €», «Corte ........ 16,00 €»), several
 * on one line when each has its price («Corte 16€ | Barba 10€»), a name with its price on the next line,
 * titles skipped, «sob consulta» kept without a price. Never guesses a price that isn't written.
 */
export function parsePriceList(text: string): PriceListResult {
  const items: PriceItem[] = [];
  const skipped: string[] = [];
  let pendingName: string | null = null;
  const flushPending = () => {
    if (pendingName) skipped.push(pendingName);
    pendingName = null;
  };
  for (const raw of text.replace(/\r\n?/g, "\n").split("\n")) {
    const line = cleanLine(raw);
    if (!line) {
      flushPending();
      continue;
    }
    if (items.length >= setupLimits.items) break;
    const alone = priceOnly(line);
    if (alone && pendingName) {
      const named = findDuration(pendingName);
      const duration = findDuration(alone.rest) ?? named;
      items.push({ name: nameOf(named ? named.rest : pendingName), priceCents: alone.priceCents, priceFrom: alone.priceFrom, durationMinutes: duration?.minutes ?? null });
      pendingName = null;
      continue;
    }
    // Several items on one line, each with its price.
    const segments = line.split(/\s*[|;•·]\s*|\s+\/\s+|,\s+(?=\p{L})/u).filter(Boolean);
    if (segments.length > 1) {
      const read = segments.map((segment) => (findPrice(segment) ? readItem(segment) : null));
      if (read.every(Boolean)) {
        flushPending();
        items.push(...(read as PriceItem[]));
        continue;
      }
    }
    const item = readItem(line);
    if (item) {
      flushPending();
      items.push(item);
      continue;
    }
    if (isTitle(line)) {
      flushPending();
      continue;
    }
    flushPending();
    pendingName = line;
  }
  flushPending();
  return { items: items.slice(0, setupLimits.items), skipped };
}

/** One canonical line per item, read back by parsePriceList: «Coloração — desde 35 € · 60 min». */
export function serializePriceList(items: readonly PriceItem[]): string {
  return items
    .filter((item) => item.name.trim())
    .slice(0, setupLimits.items)
    .map((item) => {
      const name = item.name.replace(/\s+/g, " ").trim().slice(0, setupLimits.itemName);
      const price = item.priceCents !== null ? `${item.priceFrom ? "desde " : ""}${formatPrice(item.priceCents, "pt")}` : null;
      const duration = item.durationMinutes ? `${item.durationMinutes} min` : null;
      if (!price) return [`${name}${onRequestWords.test(name) ? "" : " (sob consulta)"}`, duration].filter(Boolean).join(" · ");
      return `${name} — ${[price, duration].filter(Boolean).join(" · ")}`;
    })
    .join("\n");
}

export function catalogItemsFrom(items: readonly PriceItem[]): CatalogItem[] {
  return items.map((item) => ({ name: item.name, priceCents: item.priceCents, durationMinutes: item.durationMinutes, ...(item.priceFrom ? { priceFrom: true } : {}) }));
}

// Opening hours --------------------------------------------------------------------------------------

export interface HoursResult {
  hours: WeeklyHours[];
  /** Weekdays the text says are closed («Domingo: fechado»). */
  closedDays: number[];
  closures: Closure[];
  skipped: string[];
}

/** Weekday names and short forms (normalized, «ª» as «a»), 0 = Sunday. */
const dayNames: readonly string[][] = [
  ["domingos", "domingo", "dom", "sundays", "sunday", "sun"],
  ["segunda feira", "segundas", "segunda", "seg", "2a feira", "2a", "mondays", "monday", "mon"],
  ["terca feira", "tercas", "terca", "ter", "3a feira", "3a", "tuesdays", "tuesday", "tue", "tues"],
  ["quarta feira", "quartas", "quarta", "qua", "qta", "4a feira", "4a", "wednesdays", "wednesday", "wed"],
  ["quinta feira", "quintas", "quinta", "qui", "qna", "5a feira", "5a", "thursdays", "thursday", "thu", "thurs"],
  ["sexta feira", "sextas", "sexta", "sex", "6a feira", "6a", "fridays", "friday", "fri"],
  ["sabados", "sabado", "sab", "saturdays", "saturday", "sat"],
];
const dayGroups: { words: string[]; days: number[] }[] = [
  { words: ["todos os dias", "todos dias", "diariamente", "diario", "every day", "everyday", "daily", "7 dias por semana"], days: [0, 1, 2, 3, 4, 5, 6] },
  { words: ["dias uteis", "dias de semana", "durante a semana", "weekdays"], days: [1, 2, 3, 4, 5] },
  { words: ["fins de semana", "fim de semana", "fins semana", "weekends", "weekend"], days: [6, 0] },
];
const closedWords = /\b(fechad[oa]s?|encerrad[oa]s?|closed|folga|descanso|nao abrimos|nao abre|nao abrem)\b/;
const monthNames = ["janeiro", "fevereiro", "marco", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

/** Lower case, no accents, «ª/º» as «a», dashes as «-», «às» as «as»; keeps digits, «:», «/», «-», «,». */
function hoursText(line: string): string {
  return line
    .replace(/[ªº]/g, "a")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[–—]/g, "-")
    .replace(/\(\s*([^)]*)\)/g, " ( $1 ) ")
    .replace(/[^a-z0-9:/\-,.()&+ ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

interface DayMatch {
  start: number;
  end: number;
  days: number[];
}

function findDays(text: string): DayMatch[] {
  const found: DayMatch[] = [];
  const taken = (start: number, end: number) => found.some((match) => start < match.end && end > match.start);
  const scan = (phrase: string, days: number[]) => {
    const pattern = new RegExp(`(?<![a-z0-9])${phrase.replace(/ /g, "[ -]")}(?![a-z0-9])\\.?`, "g");
    for (const match of text.matchAll(pattern)) {
      const start = match.index ?? 0;
      const end = start + match[0].length;
      if (!taken(start, end)) found.push({ start, end, days });
    }
  };
  for (const group of dayGroups) for (const word of group.words) scan(word, group.days);
  const names = dayNames.flatMap((list, weekday) => list.map((name) => ({ name, weekday }))).sort((a, b) => b.name.length - a.name.length);
  for (const { name, weekday } of names) scan(name, [weekday]);
  return found.sort((a, b) => a.start - b.start);
}

/** Monday first: «sexta a domingo» = 5, 6, 0. */
function dayRange(from: number, to: number): number[] {
  const order = (day: number) => (day === 0 ? 7 : day);
  const days: number[] = [];
  for (let day = order(from); ; day = day === 7 ? 1 : day + 1) {
    days.push(day === 7 ? 0 : day);
    if (day === order(to) || days.length > 7) break;
  }
  return days;
}

function daysOf(text: string, matches: readonly DayMatch[]): number[] {
  const days = new Set<number>();
  for (let index = 0; index < matches.length; index++) {
    const current = matches[index];
    const next = matches[index + 1];
    if (next && current.days.length === 1 && next.days.length === 1) {
      const between = text.slice(current.end, next.start).trim();
      if (/^(-|a|as|ate|to|till|until|through|al|au|bis)$/.test(between)) {
        for (const day of dayRange(current.days[0], next.days[0])) days.add(day);
        index++;
        continue;
      }
    }
    for (const day of current.days) days.add(day);
  }
  return [...days];
}

const clock = String.raw`(\d{1,2})(?:\s*[:h.]\s*(\d{2}))?\s*(h(?:oras|rs)?|am|pm)?`;
const intervalPattern = new RegExp(String.raw`(?<![\d/])${clock}\s*(?:-|as|a|ate|to|till|until)\s*${clock}(?![\d/])`, "g");

function clockTime(hours: string, minutes: string | undefined, suffix: string | undefined): number | null {
  let hour = Number(hours);
  const minute = minutes ? Number(minutes) : 0;
  if (suffix === "pm" && hour < 12) hour += 12;
  if (suffix === "am" && hour === 12) hour = 0;
  if (hour > 24 || minute > 59) return null;
  return hour * 60 + minute;
}

function hhmm(minutes: number): string {
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}

function intervals(text: string): { opens: string; closes: string }[] {
  const found: { opens: string; closes: string }[] = [];
  for (const match of text.matchAll(intervalPattern)) {
    const opens = clockTime(match[1], match[2], match[3]);
    let closes = clockTime(match[4], match[5], match[6] ?? (match[3] === "pm" ? "pm" : undefined));
    if (opens === null || closes === null) continue;
    // Bare «9-13» needs a sensible range; «24h», «00:00» and past midnight close at 23:59.
    if (closes === 0 || closes >= 24 * 60 || closes <= opens) closes = 23 * 60 + 59;
    if (opens >= 24 * 60 || closes - opens < 15) continue;
    found.push({ opens: hhmm(opens), closes: hhmm(closes) });
  }
  return found;
}

/** «25/12», «25/12/2026», «25 de dezembro» → "YYYY-MM-DD" (no year: the next one from today). */
function datesOf(text: string, today: string): string[] {
  const [year, month, day] = today.split("-").map(Number);
  const resolve = (d: number, m: number, y: number | null): string | null => {
    if (m < 1 || m > 12 || d < 1 || d > 31) return null;
    let full = y === null ? year : y < 100 ? 2000 + y : y;
    if (y === null && (m < month || (m === month && d < day))) full += 1;
    const date = new Date(Date.UTC(full, m - 1, d));
    if (date.getUTCMonth() !== m - 1) return null;
    return date.toISOString().slice(0, 10);
  };
  const dates: string[] = [];
  for (const match of text.matchAll(/(?<!\d)(\d{1,2})[/.-](\d{1,2})(?:[/.-](\d{2,4}))?(?!\d)/g)) {
    const date = resolve(Number(match[1]), Number(match[2]), match[3] ? Number(match[3]) : null);
    if (date) dates.push(date);
  }
  for (const match of text.matchAll(new RegExp(`(?<!\\d)(\\d{1,2})(?:\\s*(?:e|,)\\s*(\\d{1,2}))?\\s+de\\s+(${monthNames.join("|")})(?:\\s+de\\s+(\\d{4}))?`, "g"))) {
    const m = monthNames.indexOf(match[3]) + 1;
    const y = match[4] ? Number(match[4]) : null;
    for (const d of [match[1], match[2]].filter(Boolean)) {
      const date = resolve(Number(d), m, y);
      if (date) dates.push(date);
    }
  }
  return [...new Set(dates)];
}

/**
 * Reads opening hours written any usual way: «Segunda a sexta: 9h-19h», «Seg-Sex 09:00-13:00 e
 * 14:30-19:00», «2ª a 6ª das 9h às 19h», «Sáb 9-13», «Domingo: fechado», «Todos os dias 12h–15h / 19h–23h»,
 * the days on one line and the times on the next, and closed dates («Fechado a 25/12 (Natal)»). A later
 * line wins for its days («Todos os dias 10-22» then «Domingo fechado»). `today` ("YYYY-MM-DD") resolves
 * dates written without the year.
 */
export function parseHours(text: string, today: string): HoursResult {
  const byDay = new Map<number, { opens: string; closes: string }[]>();
  const closures = new Map<string, string | null>();
  const skipped: string[] = [];
  let pendingDays: number[] | null = null;
  for (const raw of text.replace(/\r\n?/g, "\n").split("\n")) {
    const original = raw.replace(/^\s*[-•*·>]+\s*/, "").replace(/(^|\s)[*_~]+(?=\S)|(?<=\S)[*_~]+(?=\s|$)/g, "$1").trim();
    if (!original) continue;
    const line = hoursText(original);
    const matches = findDays(line);
    const days: number[] | null = matches.length ? daysOf(line, matches) : pendingDays;
    let rest = line;
    for (const match of [...matches].reverse()) rest = `${rest.slice(0, match.start)} ${rest.slice(match.end)}`;
    const slots = intervals(rest);
    const closed = closedWords.test(line);
    if (!matches.length) {
      const dates = closed ? datesOf(line, today) : [];
      if (dates.length) {
        const reason = original.match(/\(([^)]+)\)/)?.[1]?.trim() ?? original.match(/\s[-–—:]\s*([^\d()]+)$/u)?.[1]?.trim() ?? null;
        for (const date of dates) closures.set(date, reason && reason.length <= 80 ? reason : null);
        continue;
      }
      if (days && slots.length) {
        for (const day of days) byDay.set(day, slots);
        pendingDays = null;
        continue;
      }
      // «Horário:», «HORÁRIO DE FUNCIONAMENTO»: a title, not a line to report.
      if (!/\d/.test(line) && (/(horario|horarios|hours|opening)/.test(line) || line.endsWith(":"))) continue;
      skipped.push(original);
      continue;
    }
    if (slots.length) {
      for (const day of days ?? []) byDay.set(day, slots);
      pendingDays = null;
    } else if (closed) {
      for (const day of days ?? []) byDay.set(day, []);
      pendingDays = null;
    } else {
      pendingDays = days;
    }
  }
  const hours: WeeklyHours[] = [];
  const closedDays: number[] = [];
  for (const [weekday, slots] of [...byDay].sort((a, b) => a[0] - b[0])) {
    if (!slots.length) closedDays.push(weekday);
    for (const slot of slots) hours.push({ weekday, ...slot });
  }
  return { hours, closedDays, closures: [...closures].sort((a, b) => a[0].localeCompare(b[0])).map(([day, reason]) => ({ day, reason })), skipped };
}

const weekdayLabels = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];

/** The week (Monday first) and the closed dates as canonical lines, read back by parseHours. */
export function serializeHours(hours: readonly WeeklyHours[], closures: readonly Closure[]): string {
  const week = [1, 2, 3, 4, 5, 6, 0].map((weekday) => {
    const slots = hours
      .filter((slot) => slot.weekday === weekday)
      .sort((a, b) => a.opens.localeCompare(b.opens))
      .map((slot) => `${slot.opens.slice(0, 5)}–${slot.closes.slice(0, 5)}`);
    return `${weekdayLabels[weekday]}: ${slots.length ? slots.join(" e ") : "fechado"}`;
  });
  const days = [...closures]
    .sort((a, b) => a.day.localeCompare(b.day))
    .slice(0, setupLimits.closures)
    .map((closure) => {
      const [year, month, day] = closure.day.split("-");
      const reason = closure.reason?.replace(/[()\n]/g, " ").replace(/\s+/g, " ").trim();
      return `Fechado a ${day}/${month}/${year}${reason ? ` (${reason})` : ""}`;
    });
  return [...week, ...days].join("\n");
}

// Reading the setup's entries back (rows.ts) ---------------------------------------------------------

export interface SetupEntryLike {
  id: string;
  kind: KnowledgeKind;
  question: string;
  answer: string;
  active: boolean;
}

const sameQuestion = (a: string, b: string) => normalize(a) === normalize(b);

export function isSetupEntry(entry: Pick<SetupEntryLike, "question">, which: keyof typeof setupQuestions): boolean {
  return sameQuestion(entry.question, setupQuestions[which]);
}

export interface SetupKnowledge {
  /** Structured hours from the setup's entry (null: no such entry, or it doesn't read back). */
  hours: WeeklyHours[] | null;
  closures: Closure[];
  items: CatalogItem[];
  /** The entries read back into hours or items: not searched as entries too. */
  consumed: Set<string>;
}

/**
 * The hours and price list written by the setup, read back from their entries. An entry that doesn't
 * read back completely (written by hand in another way) stays an ordinary entry. `today` only matters
 * for dates written without a year (never in the setup's own text).
 */
export function setupKnowledge(entries: readonly SetupEntryLike[], today = new Date().toISOString().slice(0, 10)): SetupKnowledge {
  const result: SetupKnowledge = { hours: null, closures: [], items: [], consumed: new Set() };
  for (const entry of entries) {
    if (!entry.active || entry.kind !== "info") continue;
    if (result.hours === null && isSetupEntry(entry, "hours")) {
      const read = parseHours(entry.answer, today);
      if (read.hours.length && !read.skipped.length) {
        result.hours = read.hours;
        result.closures = read.closures;
        result.consumed.add(entry.id);
      }
    } else if (!result.items.length && isSetupEntry(entry, "services")) {
      const read = parsePriceList(entry.answer);
      if (read.items.length && !read.skipped.length) {
        result.items = catalogItemsFrom(read.items);
        result.consumed.add(entry.id);
      }
    }
  }
  return result;
}

// Frequent questions per sector ----------------------------------------------------------------------

export interface SuggestedFaq {
  /** Stable key (the form sends it back; the question and keywords come from here, not the browser). */
  id: string;
  question: string;
  keywords: string;
  kind: KnowledgeKind;
  /** An example answer, shown as the field's placeholder. */
  example: string;
}

const common = {
  parking: { id: "parking", question: "Têm estacionamento?", keywords: "estacionamento, estacionar, parque, carro, lugar", kind: "faq", example: "Ex.: Há um parque gratuito a 50 m, na rua de trás." },
  payments: { id: "payments", question: "Que formas de pagamento aceitam?", keywords: "pagamento, pagar, cartão, multibanco, mbway, dinheiro", kind: "faq", example: "Ex.: Multibanco, MB WAY e dinheiro. Não aceitamos cheques." },
  cancel: { id: "cancel", question: "Como posso cancelar ou remarcar?", keywords: "cancelar, cancelamento, remarcar, desmarcar, alterar marcação", kind: "policy", example: "Ex.: Pode cancelar ou remarcar até 24 horas antes, por mensagem." },
  invoice: { id: "invoice", question: "Passam fatura com NIF?", keywords: "fatura, factura, nif, contribuinte, recibo", kind: "faq", example: "Ex.: Sim, passamos fatura com o NIF que nos indicar." },
  access: { id: "access", question: "O espaço é acessível a cadeira de rodas?", keywords: "acessível, acessibilidade, cadeira de rodas, mobilidade reduzida, rampa", kind: "faq", example: "Ex.: Sim, a entrada é ao nível da rua e temos casa de banho adaptada." },
  pets: { id: "pets", question: "Aceitam animais?", keywords: "animais, animal, cão, cães, gato, pet", kind: "policy", example: "Ex.: Sim, cães de pequeno porte são bem-vindos." },
  kids: { id: "kids", question: "Atendem crianças?", keywords: "crianças, criança, filhos, miúdos, bebé", kind: "faq", example: "Ex.: Sim, a partir dos 3 anos." },
  gift: { id: "gift", question: "Têm vales de oferta?", keywords: "vale, vales, oferta, presente, cartão oferta", kind: "faq", example: "Ex.: Sim, com o valor que quiser, válidos por 6 meses." },
  wifi: { id: "wifi", question: "Têm Wi-Fi?", keywords: "wifi, wi-fi, internet, rede", kind: "faq", example: "Ex.: Sim, Wi-Fi gratuito para clientes." },
} satisfies Record<string, SuggestedFaq>;

const faqsByKind: Record<ChatbotBusinessKind, SuggestedFaq[]> = {
  restaurant: [
    common.parking,
    common.payments,
    { id: "vegetarian", question: "Têm opções vegetarianas ou veganas?", keywords: "vegetariano, vegetariana, vegano, vegan, sem carne", kind: "faq", example: "Ex.: Sim, temos sempre dois pratos vegetarianos e um vegano." },
    { id: "allergies", question: "Têm pratos sem glúten ou para alergias?", keywords: "glúten, alergia, alergias, alergénios, intolerância, celíaco, lactose", kind: "policy", example: "Ex.: Indique a alergia ao reservar; temos a lista de alergénios de cada prato." },
    { ...common.pets, example: "Ex.: Sim, na esplanada. Lá dentro só cães de assistência." },
    { id: "kids-menu", question: "Têm menu ou cadeira para crianças?", keywords: "crianças, menu infantil, cadeira de bebé, cadeira alta, bebé", kind: "faq", example: "Ex.: Sim, temos menu infantil e cadeiras de bebé." },
    { id: "delivery", question: "Fazem entregas ou take-away?", keywords: "entrega, entregas, take away, takeaway, levar, domicílio, uber eats, glovo", kind: "faq", example: "Ex.: Take-away sim, por telefone. Entregas pela Glovo." },
    { id: "groups", question: "Aceitam grupos ou eventos?", keywords: "grupo, grupos, evento, eventos, aniversário, jantar de grupo, festa", kind: "faq", example: "Ex.: Sim, até 30 pessoas, com menu de grupo. Reserve com uma semana." },
    { id: "terrace", question: "Têm esplanada?", keywords: "esplanada, terraço, exterior, lá fora", kind: "faq", example: "Ex.: Sim, com 8 mesas, aberta de abril a outubro." },
    { ...common.cancel, question: "Como funcionam as reservas e os cancelamentos?", example: "Ex.: Reservas por telefone ou online. Se não puder vir, avise até 2 horas antes." },
    common.access,
    common.wifi,
  ],
  lodging: [
    { id: "checkin", question: "A que horas é o check-in?", keywords: "check-in, checkin, entrada, chegada, chegar", kind: "policy", example: "Ex.: A partir das 15:00. Envie-nos a hora prevista de chegada." },
    { id: "checkout", question: "A que horas é o check-out?", keywords: "check-out, checkout, saída, sair", kind: "policy", example: "Ex.: Até às 11:00." },
    { ...common.parking, question: "Há estacionamento?", example: "Ex.: Sim, lugar privado na garagem, incluído." },
    { ...common.wifi, question: "Há Wi-Fi?", example: "Ex.: Sim, fibra. A rede e a palavra-passe estão no frigorífico." },
    { ...common.pets, example: "Ex.: Não aceitamos animais." },
    { ...common.cancel, question: "Como funciona o cancelamento?", example: "Ex.: Grátis até 7 dias antes; depois cobramos a primeira noite." },
    { id: "baby", question: "Têm berço ou cadeira de bebé?", keywords: "berço, cama de bebé, cadeira de bebé, bebé", kind: "faq", example: "Ex.: Sim, sem custo. Peça ao reservar." },
    { id: "smoking", question: "É permitido fumar?", keywords: "fumar, fumadores, tabaco, cigarro", kind: "policy", example: "Ex.: Só na varanda. Dentro de casa não." },
    { id: "supermarket", question: "Onde fica o supermercado mais próximo?", keywords: "supermercado, mercearia, compras, minimercado", kind: "info", example: "Ex.: O Pingo Doce fica a 5 minutos a pé, na rua principal." },
    { id: "airport", question: "Como chego do aeroporto?", keywords: "aeroporto, transfer, táxi, uber, comboio, metro, autocarro", kind: "info", example: "Ex.: De táxi ou Uber, cerca de 25 minutos. Podemos marcar um transfer." },
    { id: "towels", question: "Há toalhas e roupa de cama?", keywords: "toalhas, roupa de cama, lençóis, toalhas de praia", kind: "faq", example: "Ex.: Sim, incluídas. Toalhas de praia também." },
    { id: "luggage", question: "Posso deixar a bagagem antes do check-in?", keywords: "bagagem, malas, deixar malas, guardar malas", kind: "policy", example: "Ex.: Sim, a partir das 10:00, se a casa estiver livre." },
  ],
  clinic: [
    { id: "insurance", question: "Têm acordos com seguros ou subsistemas?", keywords: "seguro, seguros, acordo, acordos, médis, multicare, advancecare, adse, subsistema", kind: "faq", example: "Ex.: Sim, com Médis, Multicare e AdvanceCare." },
    common.payments,
    { ...common.cancel, question: "Como posso cancelar ou remarcar uma consulta?", example: "Ex.: Avise até 24 horas antes, por telefone ou mensagem." },
    { id: "arrive", question: "Com quanto tempo de antecedência devo chegar?", keywords: "antecedência, chegar antes, chegar mais cedo, minutos antes", kind: "faq", example: "Ex.: 10 minutos antes, para a ficha de cliente." },
    { id: "bring", question: "Que documentos devo trazer?", keywords: "documentos, trazer, cartão de cidadão, cartão do seguro, exames", kind: "faq", example: "Ex.: Cartão de cidadão, cartão do seguro e exames anteriores." },
    common.parking,
    { ...common.kids, example: "Ex.: Sim, temos consultas para crianças a partir dos 3 anos." },
    common.invoice,
    common.access,
    { id: "walk-in", question: "Atendem sem marcação?", keywords: "sem marcação, sem marcar, sem consulta marcada, walk-in", kind: "policy", example: "Ex.: Só com marcação. Ligue-nos para ver a primeira vaga." },
  ],
  retail: [
    { id: "shipping", question: "Fazem envios? Para onde e quanto custa?", keywords: "envio, envios, portes, enviar, correio, ctt, ilhas, estrangeiro", kind: "policy", example: "Ex.: Sim, para todo o país. Portes de 4 €, grátis acima de 50 €." },
    { id: "shipping-time", question: "Quanto tempo demora a entrega?", keywords: "demora, prazo, entrega, chegar, dias úteis", kind: "faq", example: "Ex.: 2 a 3 dias úteis no continente." },
    { id: "returns", question: "Posso trocar ou devolver?", keywords: "troca, trocas, trocar, devolução, devolver, talão", kind: "policy", example: "Ex.: Trocas em 30 dias com talão, produto sem uso." },
    common.payments,
    { id: "pickup", question: "Posso encomendar e levantar na loja?", keywords: "levantar, levantamento, recolher, buscar, click and collect", kind: "faq", example: "Ex.: Sim, reservamos 3 dias para levantar." },
    { id: "order", question: "Fazem encomendas de produtos que não têm?", keywords: "encomenda, encomendar, mandar vir, não têm, esgotado", kind: "faq", example: "Ex.: Sim, em 1 a 2 semanas, com sinal de 20 %." },
    common.gift,
    { id: "online", question: "Têm loja online?", keywords: "loja online, site, online, comprar online, internet", kind: "faq", example: "Ex.: Ainda não; encomendas por mensagem." },
    common.parking,
    { id: "wrap", question: "Fazem embrulho para oferta?", keywords: "embrulho, embrulhar, papel de presente, presente", kind: "faq", example: "Ex.: Sim, sem custo." },
  ],
  beauty: [
    { id: "walk-in", question: "Preciso de marcar ou atendem sem marcação?", keywords: "sem marcação, sem marcar, walk-in, aparecer", kind: "policy", example: "Ex.: Atendemos sem marcação, mas com marcação não espera." },
    common.cancel,
    { id: "late", question: "E se chegar atrasado?", keywords: "atraso, atrasado, atrasada, chegar tarde", kind: "policy", example: "Ex.: Com mais de 15 minutos de atraso, pode ter de remarcar." },
    common.payments,
    common.parking,
    { ...common.kids, example: "Ex.: Sim, cortes de criança até aos 12 anos." },
    { id: "discounts", question: "Têm descontos para estudantes ou outros?", keywords: "desconto, descontos, estudante, estudantes, sénior, promoção", kind: "policy", example: "Ex.: 10 % para estudantes com cartão, de terça a quinta." },
    { id: "products", question: "Que produtos ou marcas usam?", keywords: "produtos, marca, marcas, champô, verniz", kind: "faq", example: "Ex.: Trabalhamos com L'Oréal Professionnel e Reuzel." },
    { id: "sell", question: "Vendem produtos?", keywords: "vender, vendem, comprar produtos, loja", kind: "faq", example: "Ex.: Sim, os que usamos no salão." },
    common.gift,
    { id: "events", question: "Fazem serviços para noivas ou eventos?", keywords: "noiva, noivas, casamento, evento, eventos, madrinha", kind: "faq", example: "Ex.: Sim, com prova antes. Peça orçamento por mensagem." },
  ],
  other: [
    common.parking,
    common.payments,
    common.cancel,
    common.invoice,
    common.access,
    { id: "quote", question: "Fazem orçamentos?", keywords: "orçamento, orçamentos, estimativa, quanto fica", kind: "faq", example: "Ex.: Sim, gratuitos, por mensagem ou no local." },
    { id: "home", question: "Fazem serviços ao domicílio?", keywords: "domicílio, deslocação, ir a casa, em casa", kind: "faq", example: "Ex.: Sim, na zona de Lisboa, com deslocação de 10 €." },
    { id: "duration", question: "Quanto tempo demora o serviço?", keywords: "demora, quanto tempo, prazo, duração", kind: "faq", example: "Ex.: Normalmente 1 hora." },
    { id: "warranty", question: "Têm garantia?", keywords: "garantia, garantias", kind: "policy", example: "Ex.: Sim, 6 meses em todos os serviços." },
  ],
};

export function suggestedFaqs(kind: ChatbotBusinessKind): SuggestedFaq[] {
  return faqsByKind[kind] ?? faqsByKind.other;
}

export function findSuggestedFaq(kind: ChatbotBusinessKind, id: string): SuggestedFaq | null {
  return suggestedFaqs(kind).find((faq) => faq.id === id) ?? null;
}

/** The entry already answering a suggested question (same question, any capitals or accents). */
export function entryFor<T extends Pick<SetupEntryLike, "question">>(entries: readonly T[], question: string): T | null {
  return entries.find((entry) => sameQuestion(entry.question, question)) ?? null;
}

// Test questions for «Experimentar» -------------------------------------------------------------------

const testQuestionsByKind: Record<ChatbotBusinessKind, string[]> = {
  restaurant: ["A que horas abrem hoje?", "Quanto custa?", "Têm pratos vegetarianos?", "Posso reservar mesa para sábado?", "Onde ficam?", "Aceitam cães?", "Is there parking?"],
  lodging: ["A que horas é o check-in?", "Há estacionamento?", "Qual é a password do Wi-Fi?", "Podemos levar o cão?", "Onde fica o supermercado?", "Can we check out later?"],
  clinic: ["Têm acordo com a Médis?", "Quanto custa uma consulta?", "Abrem ao sábado?", "Como marco uma consulta?", "Onde ficam?", "Do you speak English?"],
  retail: ["Fazem envios para a Madeira?", "Posso trocar um artigo?", "Abrem amanhã?", "Quanto custa?", "Onde ficam?", "Do you ship abroad?"],
  beauty: ["Quanto custa?", "Abrem amanhã?", "Como faço para marcar?", "Aceitam MB WAY?", "Onde ficam?", "How much is a haircut?"],
  other: ["Quanto custa?", "A que horas abrem?", "Como faço para marcar?", "Onde ficam?", "Aceitam MB WAY?", "Do you speak English?"],
};

/** The suggested test questions; with a price list, the first service's price too («Corte clássico: quanto custa?»). */
export function suggestedTestQuestions(kind: ChatbotBusinessKind, items: readonly Pick<CatalogItem, "name" | "priceCents">[] = []): string[] {
  const questions = [...(testQuestionsByKind[kind] ?? testQuestionsByKind.other)];
  const first = items.find((item) => item.priceCents !== null && item.name.length <= 40);
  if (first) {
    questions.splice(1, 0, `${first.name}: quanto custa?`);
  }
  return questions.slice(0, 8);
}

// Completeness ---------------------------------------------------------------------------------------

export interface SetupFacts {
  /** Address or map link (the bot's or its linked Espaço's). */
  hasLocation: boolean;
  /** Phone or booking link. */
  hasContact: boolean;
  /** Structured hours (setup or Espaço) or an hours entry written by hand. */
  hasHours: boolean;
  /** Priced items (setup, Espaço, video menu) or a price-list entry written by hand. */
  hasPrices: boolean;
  /** Active answered entries other than the setup's own hours/prices. */
  answeredQuestions: number;
  documents: number;
}

export type SetupStepId = "business" | "hours" | "prices" | "questions" | "documents";

export interface SetupProgress {
  /** 0–100. */
  score: number;
  steps: { id: SetupStepId; label: string; done: boolean; points: number }[];
}

export const setupTargets = { questions: 5 };

/**
 * How ready the assistant is, in five parts of 20 points: business details (where + how to contact),
 * hours, prices, at least five answered questions (4 points each) and a document.
 */
export function setupProgress(facts: SetupFacts): SetupProgress {
  const questions = Math.min(facts.answeredQuestions, setupTargets.questions);
  const steps: SetupProgress["steps"] = [
    { id: "business", label: "Dados do negócio", done: facts.hasLocation && facts.hasContact, points: (facts.hasLocation ? 10 : 0) + (facts.hasContact ? 10 : 0) },
    { id: "hours", label: "Horário", done: facts.hasHours, points: facts.hasHours ? 20 : 0 },
    { id: "prices", label: "Preços", done: facts.hasPrices, points: facts.hasPrices ? 20 : 0 },
    { id: "questions", label: `${setupTargets.questions}+ perguntas respondidas`, done: questions >= setupTargets.questions, points: questions * (20 / setupTargets.questions) },
    { id: "documents", label: "Documento", done: facts.documents > 0, points: facts.documents > 0 ? 20 : 0 },
  ];
  return { score: Math.round(steps.reduce((sum, step) => sum + step.points, 0)), steps };
}

/** The facts from a bot's entries and what it reads elsewhere (shared by the bots list and the bot page). */
export function setupFactsFrom(input: {
  location: boolean;
  contact: boolean;
  structuredHours: number;
  pricedItems: number;
  entries: readonly SetupEntryLike[];
  documents: number;
}): SetupFacts {
  const active = input.entries.filter((entry) => entry.active && entry.answer.trim());
  const own = (which: keyof typeof setupQuestions) => active.some((entry) => isSetupEntry(entry, which));
  return {
    hasLocation: input.location,
    hasContact: input.contact,
    hasHours: input.structuredHours > 0 || own("hours"),
    hasPrices: input.pricedItems > 0 || own("services"),
    answeredQuestions: active.filter((entry) => !isSetupEntry(entry, "hours") && !isSetupEntry(entry, "services")).length,
    documents: input.documents,
  };
}

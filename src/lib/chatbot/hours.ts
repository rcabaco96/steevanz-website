// Opening hours in the business's time zone: open now? when does it open next? and the week as
// text in the customer's language. Pure module (tests/chatbot.test.mjs).
import { normalize } from "./text.ts";
import type { DayLabel } from "./messages.ts";
import type { ChatbotLanguage, Closure, WeeklyHours } from "./types.ts";

const locales: Record<ChatbotLanguage, string> = { pt: "pt-PT", en: "en-GB", es: "es-ES", fr: "fr-FR", de: "de-DE", it: "it-IT" };

/** "13:00:00" or "13:00" → minutes since midnight. */
export function toMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

export function hhmm(time: string): string {
  return time.slice(0, 5);
}

/** The wall clock of the business: weekday (0 = Sunday), minutes since midnight and the date. */
export function localClock(now: Date, timeZone: string): { weekday: number; minutes: number; date: string } {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", { timeZone, weekday: "short", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
      .formatToParts(now)
      .map((part) => [part.type, part.value]),
  );
  const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(parts.weekday);
  return { weekday, minutes: Number(parts.hour) * 60 + Number(parts.minute), date: `${parts.year}-${parts.month}-${parts.day}` };
}

function addDays(date: string, days: number): string {
  const value = new Date(`${date}T12:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}

export interface OpeningState {
  /** No hours at all: the assistant never says «closed» (it doesn't know). */
  known: boolean;
  open: boolean;
  /** Open now: closes at "HH:MM". */
  closesAt: string | null;
  /** Closed now: the next opening, if one is within the next 14 days. */
  next: { date: string; weekday: number; opens: string; daysAhead: number } | null;
  /** Today is a closure day (holiday, vacation). */
  closedToday: { reason: string | null } | null;
}

export function openingState(hours: readonly WeeklyHours[], closures: readonly Closure[], timeZone: string, now: Date): OpeningState {
  if (!hours.length) return { known: false, open: false, closesAt: null, next: null, closedToday: null };
  const clock = localClock(now, timeZone);
  const closedDays = new Map(closures.map((closure) => [closure.day, closure.reason ?? null]));
  const closedToday = closedDays.has(clock.date) ? { reason: closedDays.get(clock.date) ?? null } : null;
  const today = hours.filter((slot) => slot.weekday === clock.weekday).sort((a, b) => toMinutes(a.opens) - toMinutes(b.opens));
  if (!closedToday) {
    const current = today.find((slot) => toMinutes(slot.opens) <= clock.minutes && clock.minutes < toMinutes(slot.closes));
    if (current) return { known: true, open: true, closesAt: hhmm(current.closes), next: null, closedToday: null };
  }
  for (let daysAhead = 0; daysAhead <= 14; daysAhead++) {
    const date = addDays(clock.date, daysAhead);
    if (closedDays.has(date)) continue;
    const weekday = (clock.weekday + daysAhead) % 7;
    const slots = hours.filter((slot) => slot.weekday === weekday).sort((a, b) => toMinutes(a.opens) - toMinutes(b.opens));
    const slot = slots.find((candidate) => daysAhead > 0 || toMinutes(candidate.opens) > clock.minutes);
    if (slot) return { known: true, open: false, closesAt: null, next: { date, weekday, opens: hhmm(slot.opens), daysAhead }, closedToday };
  }
  return { known: true, open: false, closesAt: null, next: null, closedToday };
}

export function weekdayName(weekday: number, language: ChatbotLanguage): string {
  // 2024-01-07 was a Sunday.
  const reference = new Date(Date.UTC(2024, 0, 7 + weekday, 12));
  return new Intl.DateTimeFormat(locales[language], { weekday: "long", timeZone: "UTC" }).format(reference);
}

const closedWord: Record<ChatbotLanguage, string> = { pt: "fechado", en: "closed", es: "cerrado", fr: "fermé", de: "geschlossen", it: "chiuso" };
const andWord: Record<ChatbotLanguage, string> = { pt: "e", en: "and", es: "y", fr: "et", de: "und", it: "e" };

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** The week, Monday first, one line per day: "Segunda-feira: 12:00–15:00 e 19:00–23:00". */
export function formatWeek(hours: readonly WeeklyHours[], language: ChatbotLanguage): string {
  return [1, 2, 3, 4, 5, 6, 0]
    .map((weekday) => {
      const slots = hours.filter((slot) => slot.weekday === weekday).sort((a, b) => toMinutes(a.opens) - toMinutes(b.opens));
      const text = slots.length ? slots.map((slot) => `${hhmm(slot.opens)}–${hhmm(slot.closes)}`).join(` ${andWord[language]} `) : closedWord[language];
      return `${capitalize(weekdayName(weekday, language))}: ${text}`;
    })
    .join("\n");
}

/** When the next opening is, in words: «hoje às 19:00», «amanhã às 12:00», «segunda-feira às 09:00». */
export function formatNextOpening(next: NonNullable<OpeningState["next"]>, language: ChatbotLanguage): string {
  const at = { pt: "às", en: "at", es: "a las", fr: "à", de: "um", it: "alle" }[language];
  const day =
    next.daysAhead === 0
      ? { pt: "hoje", en: "today", es: "hoy", fr: "aujourd'hui", de: "heute", it: "oggi" }[language]
      : next.daysAhead === 1
        ? { pt: "amanhã", en: "tomorrow", es: "mañana", fr: "demain", de: "morgen", it: "domani" }[language]
        : weekdayName(next.weekday, language);
  return `${day} ${at} ${next.opens}`;
}

/** How a message names a day: today, tomorrow, the day after, the weekend or a weekday. */
export type DayMention = { kind: "today" | "tomorrow" | "after_tomorrow" | "weekend" } | { kind: "weekday"; weekday: number; next: boolean };

// Normalized phrases in the six languages (accents removed, as normalize() writes them).
const afterTomorrowWords = ["depois de amanha", "day after tomorrow", "pasado manana", "apres demain", "ubermorgen", "uebermorgen", "dopodomani"];
const todayWords = [
  "hoje", "hj", "esta tarde", "esta noite", "logo a noite", "hoje a noite", "esta manha", "today", "tonight", "this afternoon", "this evening",
  "this morning", "hoy", "esta noche", "esta manana", "aujourd hui", "ce soir", "cet apres midi", "ce matin", "heute", "oggi", "stasera",
  "stamattina", "questa sera", "stanotte", "oggi pomeriggio",
];
const tomorrowWords = ["amanha", "tomorrow", "manana", "demain", "morgen", "domani"];
const weekendWords = ["fim de semana", "fds", "weekend", "week end", "fin de semana", "wochenende", "fine settimana"];
const nextWords = ["proxim*", "next", "prochain*", "nachst*", "naechst*", "prossim*"];
/** Weekday names by weekday (0 = Sunday), normalized; «segunda»…«sexta» alone also mean «second»…«sixth» (checked below). */
const weekdayWords: readonly (readonly string[])[] = [
  ["domingo", "domingos", "sunday", "sundays", "dimanche", "sonntag", "sonntags", "domenica"],
  ["segunda feira", "segunda", "monday", "mondays", "lunes", "lundi", "montag", "montags", "lunedi"],
  ["terca feira", "terca", "tuesday", "tuesdays", "martes", "mardi", "dienstag", "dienstags", "martedi"],
  ["quarta feira", "quarta", "wednesday", "wednesdays", "miercoles", "mercredi", "mittwoch", "mittwochs", "mercoledi"],
  ["quinta feira", "quinta", "thursday", "thursdays", "jueves", "jeudi", "donnerstag", "donnerstags", "giovedi"],
  ["sexta feira", "sexta", "friday", "fridays", "viernes", "vendredi", "freitag", "freitags", "venerdi"],
  ["sabado", "sabados", "saturday", "saturdays", "samedi", "samstag", "samstags", "sabato"],
];
const dayWordSet = new Set([...afterTomorrowWords, ...todayWords, ...tomorrowWords, ...weekendWords, ...weekdayWords.flat(), "feira"].flatMap((phrase) => phrase.split(" ")));

/** A word that is part of a day's name («amanhã», «sábado», «fim», «semana»…), normalized. */
export function isDayWord(word: string): boolean {
  return dayWordSet.has(word);
}

/** «a/à/na/no/até… segunda»: the Portuguese short weekday names only count after one of these (or before «feira»). */
const ptDayLead = new Set(["a", "as", "na", "nas", "nesta", "esta", "proxima", "ate", "de", "para", "ao", "e", "ou"]);
const ptShortDays = new Set(["segunda", "terca", "quarta", "quinta", "sexta"]);
/** What may follow «na segunda» when it is a day («na quinta à tarde», «na sexta de manhã», «na segunda ou terça»), not «a segunda via». */
const ptDayFollow = new Set(["a", "as", "de", "do", "da", "ao", "e", "ou", "dia", "pela", "por", "que", "para", "sem", "com", "estao", "abrem", "abre", "ate", "depois", "antes", "mas", "entre", "agora", "proxima", "seguinte", "tarde", "manha", "noite"]);

function ptWeekday(tokens: readonly string[], at: number): boolean {
  const next = tokens[at + 1];
  if (next === "feira") return true;
  return ptDayLead.has(tokens[at - 1] ?? "") && (next === undefined || ptDayFollow.has(next));
}

function phraseAt(tokens: readonly string[], phrase: string): number {
  const parts = phrase.split(" ");
  for (let start = 0; start + parts.length <= tokens.length; start++) {
    if (parts.every((part, offset) => (part.endsWith("*") ? tokens[start + offset].startsWith(part.slice(0, -1)) : tokens[start + offset] === part))) return start;
  }
  return -1;
}

/** The day a message asks about («amanhã», «no sábado», «this weekend»…), or null. Takes a normalized text. */
export function dayMention(normalized: string): DayMention | null {
  if (!normalized) return null;
  // «guten Morgen» is a greeting; «por la mañana» / «de la mañana» is «in the morning», not «tomorrow».
  const text = ` ${normalized} `.replace(/ guten morgen /g, " ").replace(/ (por|de) la manana /g, " ").trim();
  const tokens = text ? text.split(" ") : [];
  if (!tokens.length) return null;
  const found: { at: number; mention: DayMention }[] = [];
  const first = (phrases: readonly string[]) => Math.min(...phrases.map((phrase) => phraseAt(tokens, phrase)).filter((at) => at >= 0), Infinity);
  const after = first(afterTomorrowWords);
  if (after < Infinity) found.push({ at: after, mention: { kind: "after_tomorrow" } });
  const today = first(todayWords);
  if (today < Infinity) found.push({ at: today, mention: { kind: "today" } });
  if (after === Infinity) {
    const tomorrow = first(tomorrowWords);
    if (tomorrow < Infinity) found.push({ at: tomorrow, mention: { kind: "tomorrow" } });
  }
  const weekend = first(weekendWords);
  if (weekend < Infinity) found.push({ at: weekend, mention: { kind: "weekend" } });
  const next = nextWords.some((word) => phraseAt(tokens, word) >= 0);
  weekdayWords.forEach((names, weekday) => {
    for (const name of names) {
      const at = phraseAt(tokens, name);
      if (at < 0) continue;
      if (ptShortDays.has(name) && !ptWeekday(tokens, at)) continue;
      found.push({ at, mention: { kind: "weekday", weekday, next } });
      return;
    }
  });
  if (!found.length) return null;
  return found.sort((a, b) => a.at - b.at)[0].mention;
}

export interface AskedDay {
  /** "YYYY-MM-DD" in the business's time zone. */
  date: string;
  weekday: number;
  daysAhead: number;
  mention: DayMention["kind"];
}

/** The calendar day a message asks about, in the business's time zone (null: it names no day). */
export function askedDay(message: string, timeZone: string, now: Date): AskedDay | null {
  const mention = dayMention(normalize(message));
  if (!mention) return null;
  const clock = localClock(now, timeZone);
  let daysAhead: number;
  if (mention.kind === "weekday") {
    daysAhead = (mention.weekday - clock.weekday + 7) % 7;
    if (daysAhead === 0 && mention.next) daysAhead = 7;
  } else if (mention.kind === "today") daysAhead = 0;
  else if (mention.kind === "tomorrow") daysAhead = 1;
  else if (mention.kind === "after_tomorrow") daysAhead = 2;
  else daysAhead = clock.weekday === 0 ? 0 : 6 - clock.weekday;
  return { date: addDays(clock.date, daysAhead), weekday: (clock.weekday + daysAhead) % 7, daysAhead, mention: mention.kind };
}

/** The opening hours of one calendar day: closed for a closure (with its reason), the weekday's slots otherwise. */
export function hoursOn(hours: readonly WeeklyHours[], closures: readonly Closure[], day: Pick<AskedDay, "date" | "weekday">): { closure: { reason: string | null } | null; slots: { opens: string; closes: string }[] } {
  const closure = closures.find((item) => item.day === day.date);
  if (closure) return { closure: { reason: closure.reason ?? null }, slots: [] };
  const slots = hours
    .filter((slot) => slot.weekday === day.weekday)
    .sort((a, b) => toMinutes(a.opens) - toMinutes(b.opens))
    .map((slot) => ({ opens: hhmm(slot.opens), closes: hhmm(slot.closes) }));
  return { closure: null, slots };
}

/** «quinta-feira, 22/10/2026» (or «Thursday, 22/10/2026»…). */
export function formatDay(day: Pick<AskedDay, "date" | "weekday">, language: ChatbotLanguage, withYear = true): string {
  const [year, month, date] = day.date.split("-");
  return `${weekdayName(day.weekday, language)}, ${date}/${month}${withYear ? `/${year}` : ""}`;
}

/** Whether a normalized text names this weekday in any of the six languages («Sábado 09:00–18:00», «Segunda: fechados»). */
export function mentionsWeekday(normalized: string, weekday: number): boolean {
  const tokens = normalized ? normalized.split(" ") : [];
  return weekdayWords[weekday].some((name) => phraseAt(tokens, name) >= 0);
}

/** The asked day for a sentence in the customer's language: today / tomorrow / another day, «quinta-feira», «22/10» («22.10.» in German). */
export function dayLabel(day: AskedDay, language: ChatbotLanguage): DayLabel {
  const [, month, date] = day.date.split("-");
  return {
    kind: day.daysAhead === 0 ? "today" : day.daysAhead === 1 ? "tomorrow" : "other",
    weekday: weekdayName(day.weekday, language),
    date: language === "de" ? `${date}.${month}.` : `${date}/${month}`,
  };
}

/** The calendar day `daysAhead` days from now in the business's time zone (0 = today). */
export function dayAhead(now: Date, timeZone: string, daysAhead: number): AskedDay {
  const clock = localClock(now, timeZone);
  return { date: addDays(clock.date, daysAhead), weekday: (clock.weekday + daysAhead) % 7, daysAhead, mention: daysAhead === 0 ? "today" : daysAhead === 1 ? "tomorrow" : "weekday" };
}

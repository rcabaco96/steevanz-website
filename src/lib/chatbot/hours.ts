// Opening hours in the business's time zone: open now? when does it open next? and the week as
// text in the customer's language. Pure module (tests/chatbot.test.mjs).
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

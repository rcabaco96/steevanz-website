// Automatic opening of the waitlist with the establishment's opening hours. Pure module: also used
// by the tests.
//
// - Inside an opening interval (and not a closed day), a closed queue opens on its own, unless it
//   was closed by hand during this interval (then it stays closed until the next one).
// - Outside the opening hours, an open or paused queue closes on its own, unless it was opened by
//   hand after the last closing time (then it stays as the team left it).
// Times are local to the establishment (DST-safe through the zoned helpers of the booking engine).

import { addDaysToDate, parseTimeToMinutes, weekdayOfDate, zonedDateString, zonedDateTimeToUtc } from "../../booking/slots.ts";

export type QueueState = "open" | "paused" | "closed";

export interface OpeningHours {
  weekday: number;
  /** "HH:MM" or "HH:MM:SS". */
  opens: string;
  closes: string;
}

export interface ScheduleInput {
  state: QueueState;
  /** When the state last changed (by hand or automatically). */
  stateChangedAt: number;
  hours: OpeningHours[];
  /** Closed days, "YYYY-MM-DD". */
  closures: string[];
  timeZone: string;
  now: number;
}

const minutesOf = (time: string) => parseTimeToMinutes(time.slice(0, 5));

function intervalsOn(date: string, input: ScheduleInput): { start: number; end: number }[] {
  if (input.closures.includes(date)) return [];
  const weekday = weekdayOfDate(date);
  return input.hours
    .filter((item) => item.weekday === weekday)
    .map((item) => ({
      start: zonedDateTimeToUtc(date, minutesOf(item.opens), input.timeZone).getTime(),
      end: zonedDateTimeToUtc(date, minutesOf(item.closes), input.timeZone).getTime(),
    }))
    .filter((item) => item.end > item.start)
    .sort((a, b) => a.start - b.start);
}

/** The state the queue should move to now, or null to leave it as it is. */
export function scheduledState(input: ScheduleInput): QueueState | null {
  const today = zonedDateString(new Date(input.now), input.timeZone);
  const intervals = [...intervalsOn(addDaysToDate(today, -1), input), ...intervalsOn(today, input)];
  const current = intervals.find((item) => item.start <= input.now && input.now < item.end);
  if (current) {
    return input.state === "closed" && input.stateChangedAt < current.start ? "open" : null;
  }
  const lastEnd = intervals.filter((item) => item.end <= input.now).at(-1)?.end;
  if (lastEnd === undefined) return null;
  return input.state !== "closed" && input.stateChangedAt < lastEnd ? "closed" : null;
}

/** "Abre às 12:00" / "Fecha às 15:00" for the owner, or null without hours today. */
export function nextScheduleChange(input: Omit<ScheduleInput, "state" | "stateChangedAt">): { kind: "opens" | "closes"; at: number } | null {
  const today = zonedDateString(new Date(input.now), input.timeZone);
  const full = { ...input, state: "closed" as const, stateChangedAt: 0 };
  const intervals = [...intervalsOn(today, full), ...intervalsOn(addDaysToDate(today, 1), full)];
  const current = intervals.find((item) => item.start <= input.now && input.now < item.end);
  if (current) return { kind: "closes", at: current.end };
  const next = intervals.find((item) => item.start > input.now);
  return next ? { kind: "opens", at: next.start } : null;
}

// Free times of one service on the online booking page. Pure module: also used by the tests.
//
// Every service says how it is booked:
// - "one": one customer at a time per person or place (a haircut, a consultation, a pitch). Start
//   times every `intervalMinutes` inside the opening hours; the service must end before closing
//   and one eligible person or place must be free for the service plus its gap, inside their own
//   hours when they have them. Without people or places, the space itself is the one resource.
// - "group": several people at the same time until it fills (a restaurant table). Each opening
//   interval of the day is a turn with a capacity in people; arrival times every `intervalMinutes`,
//   the last one `lastArrivalMinutes` before the turn ends. While the people booked for this
//   service in the turn plus the party fit, every arrival time of the turn is free.
// Closed days, blocks for everyone and the minimum notice apply to both. Times are local to the
// establishment (DST-safe through the zoned helpers of the Steevanz booking engine).

import {
  addDaysToDate,
  minutesToTime,
  parseTimeToMinutes,
  weekdayOfDate,
  zonedDateString,
  zonedDateTimeToUtc,
  zonedTimeString,
} from "../../booking/slots.ts";

export interface OpeningInterval {
  weekday: number;
  opens: string;
  closes: string;
}

/** A booking or block. staffId null: the whole space (a block for everyone, or a booking of the space itself). */
export interface BusyPeriod {
  staffId: string | null;
  start: number;
  end: number;
  kind: "booking" | "block";
}

export interface BookingAvailabilityInput {
  kind: "one" | "group";
  timeZone: string;
  now: number;
  minNoticeMinutes: number;
  maxDaysAhead: number;
  intervalMinutes: number;
  /** "one": how long the service takes. "group": how long the booking shows in calendars. */
  durationMinutes: number;
  /** "one": gap kept free after the service (cleaning, preparation). */
  bufferMinutes: number;
  /** "group": the last arrival is this long before the turn ends. */
  lastArrivalMinutes: number;
  hours: OpeningInterval[];
  closures: string[];
  /** "one": the people or places that can do it (empty: the space itself). */
  staff: string[];
  /** "one": own weekly hours of people or places (missing: the space's hours). */
  staffHours: Record<string, OpeningInterval[]>;
  /** "one": bookings of one-at-a-time services and blocks. "group": blocks. */
  busy: BusyPeriod[];
  /** "group": people per turn. */
  capacity: number;
  partySize: number;
  /** "group": bookings of this service (arrival time and people). */
  arrivals: { start: number; party: number }[];
}

export interface BookingSlot {
  start: string;
  end: string;
  time: string;
  /** "one": people or places free for this time (in the order given). */
  staff: string[];
  /** "group": the turn this arrival belongs to. */
  turn?: { label: string; start: string; end: string };
}

export interface BookingDay {
  date: string;
  weekday: number;
  slots: BookingSlot[];
}

const MINUTE_MS = 60_000;

function overlaps(startA: number, endA: number, startB: number, endB: number): boolean {
  return startA < endB && startB < endA;
}

/** Name of a turn from when it starts: morning, lunch or dinner. */
export function turnLabel(opensMinutes: number): string {
  return opensMinutes < 11 * 60 ? "Manhã" : opensMinutes < 16 * 60 ? "Almoço" : "Jantar";
}

/** People booked to arrive in [start, end). */
export function bookedInTurn(arrivals: { start: number; party: number }[], start: number, end: number): number {
  return arrivals.filter((item) => item.start >= start && item.start < end).reduce((sum, item) => sum + item.party, 0);
}

/** Whether [minute, minute + length] fits inside one of a person's own intervals that weekday. */
function withinOwnHours(intervals: OpeningInterval[] | undefined, weekday: number, minute: number, length: number): boolean {
  if (!intervals?.length) return true;
  return intervals.some((item) => item.weekday === weekday && minute >= parseTimeToMinutes(item.opens) && minute + length <= parseTimeToMinutes(item.closes));
}

export function bookingAvailability(input: BookingAvailabilityInput, options: { from?: string; days?: number } = {}): BookingDay[] {
  const { timeZone, intervalMinutes } = input;
  const today = zonedDateString(new Date(input.now), timeZone);
  const earliest = input.now + input.minNoticeMinutes * MINUTE_MS;
  const closed = new Set(input.closures);
  const first = options.from && options.from > today ? options.from : today;
  const last = addDaysToDate(today, input.maxDaysAhead);
  const group = input.kind === "group";
  const fit = group ? input.lastArrivalMinutes : input.durationMinutes;
  const days: BookingDay[] = [];

  for (let date = first, count = 0; date <= last && count < (options.days ?? input.maxDaysAhead + 1); date = addDaysToDate(date, 1), count++) {
    const weekday = weekdayOfDate(date);
    if (closed.has(date)) {
      days.push({ date, weekday, slots: [] });
      continue;
    }
    const slots = new Map<number, BookingSlot>();
    for (const interval of input.hours.filter((item) => item.weekday === weekday)) {
      const opens = parseTimeToMinutes(interval.opens);
      const closes = parseTimeToMinutes(interval.closes);
      let turn: BookingSlot["turn"];
      if (group) {
        const turnStart = zonedDateTimeToUtc(date, opens, timeZone).getTime();
        const turnEnd = zonedDateTimeToUtc(date, closes, timeZone).getTime();
        // A full turn has no free arrival time at all.
        if (bookedInTurn(input.arrivals, turnStart, turnEnd) + input.partySize > input.capacity) continue;
        turn = { label: turnLabel(opens), start: new Date(turnStart).toISOString(), end: new Date(turnEnd).toISOString() };
      }
      for (let minute = opens; minute + fit <= closes; minute += intervalMinutes) {
        const startDate = zonedDateTimeToUtc(date, minute, timeZone);
        // Skip local times that don't exist (spring DST gap).
        if (zonedDateString(startDate, timeZone) !== date || zonedTimeString(startDate, timeZone) !== minutesToTime(minute)) continue;
        const start = startDate.getTime();
        if (start < earliest || slots.has(start)) continue;
        // "group" bookings end with the turn at the latest; "one" bookings hold their gap too (it is
        // stored in the booking's end, so the next booking respects it).
        const end = group ? Math.min(start + input.durationMinutes * MINUTE_MS, Date.parse(turn!.end)) : start + (input.durationMinutes + input.bufferMinutes) * MINUTE_MS;
        const heldUntil = end;
        if (input.busy.some((period) => period.kind === "block" && period.staffId === null && overlaps(start, heldUntil, period.start, period.end))) continue;
        let staff: string[] = [];
        if (!group) {
          if (input.staff.length) {
            staff = input.staff.filter(
              (staffId) =>
                withinOwnHours(input.staffHours[staffId], weekday, minute, input.durationMinutes) &&
                !input.busy.some((period) => period.staffId === staffId && overlaps(start, heldUntil, period.start, period.end)),
            );
            if (!staff.length) continue;
          } else if (input.busy.some((period) => period.kind === "booking" && period.staffId === null && overlaps(start, heldUntil, period.start, period.end))) {
            continue;
          }
        }
        slots.set(start, { start: startDate.toISOString(), end: new Date(end).toISOString(), time: minutesToTime(minute), staff, ...(turn ? { turn } : {}) });
      }
    }
    days.push({ date, weekday, slots: [...slots.entries()].sort(([a], [b]) => a - b).map(([, slot]) => slot) });
  }
  return days;
}

export function findBookingSlot(days: BookingDay[], startIso: string): BookingSlot | null {
  const target = Date.parse(startIso);
  if (Number.isNaN(target)) return null;
  for (const day of days) for (const slot of day.slots) if (Date.parse(slot.start) === target) return slot;
  return null;
}

/** Whether a booking can still be cancelled or changed online. */
export function canChangeOnline(startsAt: string, cancelUntilHours: number, now: number): boolean {
  return Date.parse(startsAt) - now >= cancelUntilHours * 60 * MINUTE_MS;
}

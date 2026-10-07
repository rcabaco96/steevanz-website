// Free slots of an establishment's online booking page. Pure module: also used by the tests.
//
// - Service mode (barbers, clinics): start times every `intervalMinutes` inside the opening hours;
//   the service (plus its buffer) must end before closing, and at least one eligible professional
//   must be free for the whole time. Without professionals the establishment is one resource.
// - Table mode (restaurants): arrival times every `intervalMinutes`; the seats already booked for
//   that arrival time plus the party must fit `seatsPerSlot`.
// Closed days, establishment-wide blocks and the minimum notice apply to both. Times are local to
// the establishment (DST-safe through the zoned helpers of the Steevanz booking engine).

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

/** A booking or block. staffId null = the whole establishment (or, for bookings without professionals, the single resource). */
export interface BusyPeriod {
  staffId: string | null;
  start: number;
  end: number;
  /** Blocks close the slot for everyone when staffId is null; bookings without staff only matter when there are no professionals. */
  kind: "booking" | "block";
}

export interface BookingAvailabilityInput {
  mode: "service" | "table";
  timeZone: string;
  now: number;
  minNoticeMinutes: number;
  maxDaysAhead: number;
  intervalMinutes: number;
  /** Minutes the booking occupies (service duration + buffer, or the table time). */
  occupiedMinutes: number;
  /** Minutes that must fit before closing (service duration without buffer; table mode: the interval). */
  fitMinutes: number;
  hours: OpeningInterval[];
  closures: string[];
  /** Eligible professionals (service mode). Empty = single resource. */
  staff: string[];
  busy: BusyPeriod[];
  seatsPerSlot: number;
  partySize: number;
  /** Seats already booked per arrival time (ISO start). */
  seatsTaken: Record<string, number>;
}

export interface BookingSlot {
  start: string;
  end: string;
  time: string;
  /** Professionals free for this slot (service mode, in the order given). */
  staff: string[];
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

function freeStaff(input: BookingAvailabilityInput, start: number, end: number): string[] | null {
  const blockedForAll = input.busy.some((period) => period.kind === "block" && period.staffId === null && overlaps(start, end, period.start, period.end));
  if (blockedForAll) return null;
  if (!input.staff.length) {
    const taken = input.busy.some((period) => period.kind === "booking" && overlaps(start, end, period.start, period.end));
    return taken ? null : [];
  }
  const free = input.staff.filter(
    (staffId) => !input.busy.some((period) => period.staffId === staffId && overlaps(start, end, period.start, period.end)),
  );
  return free.length ? free : null;
}

export function bookingAvailability(input: BookingAvailabilityInput, options: { from?: string; days?: number } = {}): BookingDay[] {
  const { timeZone, intervalMinutes } = input;
  const today = zonedDateString(new Date(input.now), timeZone);
  const earliest = input.now + input.minNoticeMinutes * MINUTE_MS;
  const closed = new Set(input.closures);
  const first = options.from && options.from > today ? options.from : today;
  const last = addDaysToDate(today, input.maxDaysAhead);
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
      for (let minute = opens; minute + input.fitMinutes <= closes; minute += intervalMinutes) {
        const startDate = zonedDateTimeToUtc(date, minute, timeZone);
        // Skip local times that don't exist (spring DST gap).
        if (zonedDateString(startDate, timeZone) !== date || zonedTimeString(startDate, timeZone) !== minutesToTime(minute)) continue;
        const start = startDate.getTime();
        if (start < earliest || slots.has(start)) continue;
        const end = start + input.occupiedMinutes * MINUTE_MS;
        const iso = startDate.toISOString();
        let staff: string[] = [];
        if (input.mode === "table") {
          const blocked = input.busy.some((period) => period.kind === "block" && period.staffId === null && overlaps(start, end, period.start, period.end));
          if (blocked || (input.seatsTaken[iso] ?? 0) + input.partySize > input.seatsPerSlot) continue;
        } else {
          const free = freeStaff(input, start, end);
          if (!free) continue;
          staff = free;
        }
        slots.set(start, { start: iso, end: new Date(end).toISOString(), time: minutesToTime(minute), staff });
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

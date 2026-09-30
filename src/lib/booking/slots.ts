export interface WeeklyRule {
  weekday: number;
  startTime: string;
  endTime: string;
  slotMinutes: number;
  active: boolean;
}

export interface WeeklyBreak {
  weekday: number;
  startTime: string;
  endTime: string;
}

export interface AvailabilityConfig {
  timeZone: string;
  minNoticeHours: number;
  maxDaysAhead: number;
  rules: WeeklyRule[];
  breaks: WeeklyBreak[];
  blockedDates: string[];
}

export interface BusyInterval {
  start: Date;
  end: Date;
}

export interface Slot {
  start: string;
  end: string;
  time: string;
}

export interface DayAvailability {
  date: string;
  weekday: number;
  slots: Slot[];
}

const MINUTE_MS = 60_000;
const HOUR_MS = 60 * MINUTE_MS;
const formatterCache = new Map<string, Intl.DateTimeFormat>();

function zonedFormatter(timeZone: string): Intl.DateTimeFormat {
  let formatter = formatterCache.get(timeZone);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    formatterCache.set(timeZone, formatter);
  }
  return formatter;
}

interface ZonedParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}

export function zonedParts(instant: Date, timeZone: string): ZonedParts {
  const values: Record<string, number> = {};
  for (const part of zonedFormatter(timeZone).formatToParts(instant)) {
    if (part.type !== "literal") values[part.type] = Number(part.value);
  }
  return {
    year: values.year,
    month: values.month,
    day: values.day,
    hour: values.hour === 24 ? 0 : values.hour,
    minute: values.minute,
    second: values.second,
  };
}

export function timeZoneOffsetMs(instant: Date, timeZone: string): number {
  const parts = zonedParts(instant, timeZone);
  const asUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
  const truncated = Math.floor(instant.getTime() / 1000) * 1000;
  return asUtc - truncated;
}

function parseDate(date: string): { year: number; month: number; day: number } {
  const [year, month, day] = date.split("-").map(Number);
  return { year, month, day };
}

export function parseTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + (minutes || 0);
}

export function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
}

export function zonedDateTimeToUtc(date: string, minutesOfDay: number, timeZone: string): Date {
  const { year, month, day } = parseDate(date);
  const naiveUtc = Date.UTC(year, month - 1, day, 0, minutesOfDay);
  const firstOffset = timeZoneOffsetMs(new Date(naiveUtc), timeZone);
  const firstGuess = naiveUtc - firstOffset;
  const secondOffset = timeZoneOffsetMs(new Date(firstGuess), timeZone);
  if (secondOffset === firstOffset) return new Date(firstGuess);
  return new Date(naiveUtc - secondOffset);
}

export function zonedDateString(instant: Date, timeZone: string): string {
  const parts = zonedParts(instant, timeZone);
  return `${parts.year}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}`;
}

export function zonedTimeString(instant: Date, timeZone: string): string {
  const parts = zonedParts(instant, timeZone);
  return minutesToTime(parts.hour * 60 + parts.minute);
}

export function addDaysToDate(date: string, days: number): string {
  const { year, month, day } = parseDate(date);
  const shifted = new Date(Date.UTC(year, month - 1, day + days));
  return shifted.toISOString().slice(0, 10);
}

export function weekdayOfDate(date: string): number {
  const { year, month, day } = parseDate(date);
  return new Date(Date.UTC(year, month - 1, day, 12)).getUTCDay();
}

function overlaps(startA: number, endA: number, startB: number, endB: number): boolean {
  return startA < endB && startB < endA;
}

export function computeAvailability(config: AvailabilityConfig, now: Date, busy: BusyInterval[]): DayAvailability[] {
  const { timeZone } = config;
  const earliestStart = now.getTime() + config.minNoticeHours * HOUR_MS;
  const blocked = new Set(config.blockedDates);
  const busyRanges = busy.map((interval) => [interval.start.getTime(), interval.end.getTime()] as const);
  const today = zonedDateString(now, timeZone);
  const days: DayAvailability[] = [];

  for (let offset = 0; offset <= config.maxDaysAhead; offset += 1) {
    const date = addDaysToDate(today, offset);
    const weekday = weekdayOfDate(date);
    if (blocked.has(date)) {
      days.push({ date, weekday, slots: [] });
      continue;
    }

    const dayBreaks = config.breaks
      .filter((item) => item.weekday === weekday)
      .map((item) => [parseTimeToMinutes(item.startTime), parseTimeToMinutes(item.endTime)] as const);
    const slotsByStart = new Map<number, Slot>();

    for (const rule of config.rules) {
      if (!rule.active || rule.weekday !== weekday || rule.slotMinutes <= 0) continue;
      const ruleStart = parseTimeToMinutes(rule.startTime);
      const ruleEnd = parseTimeToMinutes(rule.endTime);

      for (let minute = ruleStart; minute + rule.slotMinutes <= ruleEnd; minute += rule.slotMinutes) {
        const slotEndMinute = minute + rule.slotMinutes;
        if (dayBreaks.some(([breakStart, breakEnd]) => overlaps(minute, slotEndMinute, breakStart, breakEnd))) continue;

        const start = zonedDateTimeToUtc(date, minute, timeZone);
        if (zonedDateString(start, timeZone) !== date || zonedTimeString(start, timeZone) !== minutesToTime(minute)) continue;
        const startMs = start.getTime();
        const endMs = startMs + rule.slotMinutes * MINUTE_MS;
        if (startMs < earliestStart) continue;
        if (busyRanges.some(([busyStart, busyEnd]) => overlaps(startMs, endMs, busyStart, busyEnd))) continue;
        if (slotsByStart.has(startMs)) continue;

        slotsByStart.set(startMs, {
          start: new Date(startMs).toISOString(),
          end: new Date(endMs).toISOString(),
          time: minutesToTime(minute),
        });
      }
    }

    const slots = [...slotsByStart.entries()].sort(([a], [b]) => a - b).map(([, slot]) => slot);
    days.push({ date, weekday, slots });
  }

  return days;
}

export function findSlot(days: DayAvailability[], startIso: string): Slot | null {
  const target = new Date(startIso).getTime();
  if (Number.isNaN(target)) return null;
  for (const day of days) {
    for (const slot of day.slots) {
      if (new Date(slot.start).getTime() === target) return slot;
    }
  }
  return null;
}

/**
 * Business rule: the shared base of competitor numbers is updated twice a day, at 10:00 and 19:00
 * Portuguese time; each place is read then only if nothing updated it since the previous slot.
 * Pure module (tested with node --test). Portugal changes clock in summer, so slots are computed
 * in Europe/Lisbon, never as fixed UTC hours.
 */

export const competitionUpdateHours = [10, 19] as const;
/** After a slot the reader needs a few minutes before the table shows the new numbers. */
export const competitionUpdatingMinutes = 15;

const timeZone = "Europe/Lisbon";
const parts = new Intl.DateTimeFormat("en-GB", { timeZone, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" });

function lisbonWall(at: Date) {
  const values = Object.fromEntries(parts.formatToParts(at).map((part) => [part.type, part.value]));
  return { year: Number(values.year), month: Number(values.month), day: Number(values.day), hour: Number(values.hour), minute: Number(values.minute), second: Number(values.second) };
}

/** Offset of Portuguese time from UTC at that instant, in ms (0 in winter, 1 h in summer). */
function lisbonOffsetMs(at: Date): number {
  const wall = lisbonWall(at);
  return Date.UTC(wall.year, wall.month - 1, wall.day, wall.hour, wall.minute, wall.second) - Math.floor(at.getTime() / 1000) * 1000;
}

/** The instant of hour:00 Portuguese time on the Lisbon calendar day year-month-day. */
function lisbonInstant(year: number, month: number, day: number, hour: number): Date {
  const guess = Date.UTC(year, month - 1, day, hour);
  const first = guess - lisbonOffsetMs(new Date(guess));
  // Recheck with the offset at the result (matters only right around a clock change).
  return new Date(guess - lisbonOffsetMs(new Date(first)));
}

/** Update slots around `now`: yesterday's, today's and tomorrow's (Portuguese calendar). */
function slotsAround(now: Date): Date[] {
  const today = lisbonWall(now);
  const slots: Date[] = [];
  for (const shift of [-1, 0, 1]) {
    const day = new Date(Date.UTC(today.year, today.month - 1, today.day + shift));
    for (const hour of competitionUpdateHours) slots.push(lisbonInstant(day.getUTCFullYear(), day.getUTCMonth() + 1, day.getUTCDate(), hour));
  }
  return slots.sort((a, b) => a.getTime() - b.getTime());
}

/** Next 10:00 or 19:00 in Portugal, strictly after `now`. */
export function nextCompetitionUpdate(now: Date = new Date()): Date {
  return slotsAround(now).find((slot) => slot.getTime() > now.getTime())!;
}

/** Last 10:00 or 19:00 in Portugal at or before `now`. */
export function previousCompetitionUpdate(now: Date = new Date()): Date {
  return [...slotsAround(now)].reverse().find((slot) => slot.getTime() <= now.getTime())!;
}

/** Whether a place last read at `readAt` still needs the read of the slot that just passed. */
export function needsSlotRead(readAt: string | null, now: Date = new Date()): boolean {
  return !readAt || Date.parse(readAt) < previousCompetitionUpdate(now).getTime();
}

/** "02:14:33" (hours may exceed 24 never: the next slot is at most ~15 h away). */
export function countdownText(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return [hours, minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");
}

/** "10:00" / "19:00" of a slot, in Portuguese time. */
export function slotLabel(slot: Date): string {
  const wall = lisbonWall(slot);
  return `${String(wall.hour).padStart(2, "0")}:00`;
}

/** The update slot right before `slot` (10:00 → previous day's 19:00, 19:00 → same day's 10:00). */
export function slotBefore(slot: Date): Date {
  return previousCompetitionUpdate(new Date(slot.getTime() - 1000));
}

/** Hour (Portuguese time) of the customers' daily routine (scheduler tick, /api/cron/tick). */
export const customerRoutineHour = 22;

/** hour:00 Portuguese time on the Portuguese calendar day of `now` (DST-aware). */
export function lisbonTimeOfDay(now: Date, hour: number): Date {
  const wall = lisbonWall(now);
  return lisbonInstant(wall.year, wall.month, wall.day, hour);
}

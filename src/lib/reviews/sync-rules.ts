/**
 * Business rule (see .claude/skills/regras-negocio-reviews): the "Atualizar" button only updates
 * that customer's reviews; one daily routine, at the end of the day, updates the customers who
 * did not update that day. Pure module so it can be tested with node --test.
 */
import { zonedParts } from "./analytics.ts";

export type DailySync = "skip" | "refresh" | "full";

/** Whether two instants fall on the same calendar day in Portugal. */
export function sameLocalDay(a: string, b: string): boolean {
  return zonedParts(a).date === zonedParts(b).date;
}

/**
 * What the daily routine does for one business:
 * - the monthly whole-history read always runs (a customer who updates every day would otherwise
 *   never get replies to old reviews checked);
 * - otherwise, if the customer already updated today, nothing (saves Apify credit);
 * - otherwise, the usual 30-day refresh.
 */
export function dailySyncFor(business: { lastSyncedAt: string | null; fullDue: boolean }, now: Date = new Date()): DailySync {
  if (business.fullDue) return "full";
  if (business.lastSyncedAt && sameLocalDay(business.lastSyncedAt, now.toISOString())) return "skip";
  return "refresh";
}

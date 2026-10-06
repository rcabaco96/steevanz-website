/**
 * Business rule (see .claude/skills/regras-negocio-reviews): the "Atualizar" button only updates
 * that customer's reviews; one daily routine, at the end of the day, asks the local reader to
 * update the customers who did not update that day. Pure module so it can be tested with node --test.
 */
import { zonedParts } from "./analytics.ts";

export type DailySync = "skip" | "refresh" | "full";


/** Calendar day in Portugal ("YYYY-MM-DD"). */
export function lisbonDay(at: string | Date): string {
  return zonedParts(typeof at === "string" ? at : at.toISOString()).date;
}

/** Whether two instants fall on the same calendar day in Portugal. */
export function sameLocalDay(a: string, b: string): boolean {
  return lisbonDay(a) === lisbonDay(b);
}

/**
 * Business rule: the whole history of a customer is read only once, on the first import. Replies
 * are kept up to date by the daily reads of recent reviews.
 */
export function needsFullSync(business: { full_synced_at: string | null }): boolean {
  return !business.full_synced_at;
}

/**
 * What the daily routine does for one business:
 * - the first import (whole history) runs when it never happened;
 * - otherwise, if the customer already updated today, nothing (one read per customer per day);
 * - otherwise, the usual update.
 */
export function dailySyncFor(business: { lastSyncedAt: string | null; fullDue: boolean }, now: Date = new Date()): DailySync {
  if (business.fullDue) return "full";
  if (business.lastSyncedAt && sameLocalDay(business.lastSyncedAt, now.toISOString())) return "skip";
  return "refresh";
}

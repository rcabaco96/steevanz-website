/**
 * Scheduler tick (/api/cron/tick), called every 15 minutes by Supabase pg_cron. Pure decision of
 * what one tick does, all in Portuguese time (Europe/Lisbon, DST-aware). Rules in
 * .claude/skills/regras-negocio-reviews (sources, schedule and costs):
 *
 * - competition slots at 10:00 and 19:00: the first tick at/after a slot not yet handled plans the
 *   competitor work (one zone snapshot per customer with competitors + the per-place reply checks);
 * - customers' daily routine at 22:00, once a day: daily jobs of non-verified customers (DataForSEO),
 *   official Google API for verified customers, reader-offline alert only while the reader has jobs;
 * - every tick: queued jobs are dispatched (panel requests, routine) and finished tasks collected.
 *
 * The last handled slot / day live in scheduler_state (supabase/migrations/20261004190000_scheduler.sql).
 * Only relative imports, so it can be tested with node --test.
 */
import { competitionUpdateHours, customerRoutineHour, lisbonTimeOfDay, nextCompetitionUpdate, previousCompetitionUpdate, slotLabel } from "./competition-schedule.ts";
import type { PlanBusiness, PlanCompetitor } from "./reader-queue.ts";
import { lisbonDay } from "./sync-rules.ts";

/** scheduler_state keys. */
export const schedulerKeys = { competitionSlot: "competition_slot", customerDay: "customer_day" } as const;

/** Queued jobs sent to DataForSEO per tick (96 ticks a day). */
export const tickMaxJobs = 100;
/** Google Maps zoom of the zone snapshot ("12z"): about a 10 km radius around the customer (competitorRadiusKm). */
export const zoneSnapshotZoom = 12;

export interface SchedulerState {
  /** ISO instant of the last competition slot handled. */
  competitionSlot: string | null;
  /** Portuguese calendar day ("YYYY-MM-DD") whose 22:00 customer routine was handled. */
  customerDay: string | null;
}

export interface TickDecision {
  at: string;
  day: string;
  competition: { due: boolean; slot: string; label: string; next: string };
  /**
   * due: queue the day's jobs of non-verified customers (once a day). verified: sync verified
   * customers not synced that day through the official API — on every tick from 22:00 to midnight,
   * within a time budget, so a long list is finished by the following ticks.
   */
  customers: { due: boolean; verified: boolean; day: string; startsAt: string };
  dispatch: { maxJobs: number };
  collect: true;
}

/**
 * What a tick at `now` does. The competition slot is the last 10:00 / 19:00 at or before `now`;
 * it is due when it is not the one stored. The customer routine is due from 22:00 until midnight
 * when that day was not handled yet (a day missed entirely is not caught up: the next day's
 * routine covers every customer not updated that day).
 */
export function decideTick(now: Date, state: SchedulerState): TickDecision {
  const slot = previousCompetitionUpdate(now);
  const day = lisbonDay(now);
  const routineStart = lisbonTimeOfDay(now, customerRoutineHour);
  const afterRoutineStart = now.getTime() >= routineStart.getTime();
  return {
    at: now.toISOString(),
    day,
    competition: {
      due: !sameInstant(state.competitionSlot, slot),
      slot: slot.toISOString(),
      label: slotLabel(slot),
      next: nextCompetitionUpdate(now).toISOString(),
    },
    customers: { due: afterRoutineStart && state.customerDay !== day, verified: afterRoutineStart, day, startsAt: routineStart.toISOString() },
    dispatch: { maxJobs: tickMaxJobs },
    collect: true,
  };
}

function sameInstant(stored: string | null, slot: Date): boolean {
  if (!stored) return false;
  const time = Date.parse(stored);
  return Number.isFinite(time) && time === slot.getTime();
}

export interface ZoneSnapshotPlan {
  businessId: string;
  keyword: string;
  lat: number;
  lng: number;
  zoom: number;
}

/**
 * One zone snapshot per customer that compares with at least one place (excluded and own places
 * left out): a single DataForSEO Maps request around the customer, searching its Google category,
 * returns the numbers (rating, total, stars) of every competitor nearby. Customers without
 * coordinates or category are reported as skipped.
 */
export function planZoneSnapshots(businesses: PlanBusiness[], competitors: PlanCompetitor[]): { snapshots: ZoneSnapshotPlan[]; skipped: string[] } {
  const withCompetitors = new Set(competitors.filter((row) => !row.excluded && !row.is_self && row.business_id).map((row) => row.business_id));
  const snapshots: ZoneSnapshotPlan[] = [];
  const skipped: string[] = [];
  for (const business of businesses) {
    if (!withCompetitors.has(business.id)) continue;
    const keyword = business.category?.trim();
    if (!keyword || typeof business.lat !== "number" || typeof business.lng !== "number") {
      skipped.push(business.id);
      continue;
    }
    snapshots.push({ businessId: business.id, keyword, lat: business.lat, lng: business.lng, zoom: zoneSnapshotZoom });
  }
  return { snapshots, skipped };
}

/** Human summary of the schedule (for the dry run and logs). */
export const tickSchedule = {
  everyMinutes: 15,
  competitionHours: competitionUpdateHours,
  customerHour: customerRoutineHour,
  timeZone: "Europe/Lisbon",
} as const;

import type { SupabaseClient } from "@supabase/supabase-js";
import { getEstablishment, loadBundle } from "@/lib/establishments/store";
import type { EstablishmentBundle } from "@/lib/establishments/types";
import { siteUrl } from "@/lib/site";
import { sendReminder } from "./bookings/notify";
import type { EstablishmentBookingRow } from "./bookings/store";
import { applySchedule, ensureWaitlistSettings, settleQueue, staleAfterHours } from "./waitlist/store";

// Routines of the establishment modules, run by the scheduler tick (every 15 minutes).

/** Reminders go out the day before: between 24 h and 2 h before the booking. */
const reminderWindowHours = { from: 2, to: 24 } as const;
/** Bookings made shortly before their time don't need a reminder. */
const minLeadHours = 6;
const remindersPerTick = 40;
/** Waitlist entries (names, emails) are kept 30 days, as the join page says. */
export const waitlistRetentionDays = 30;

/** Address of the public pages in emails sent outside a request (no request origin to use). */
function publicBaseUrl(): string {
  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  return production ? `https://${production}` : siteUrl;
}

export async function runModuleRoutines(client: SupabaseClient, options: { now: Date; dryRun: boolean }) {
  const now = options.now.getTime();
  const { data, error } = await client
    .from("establishment_bookings")
    .select("*")
    .eq("status", "confirmed")
    .is("reminder_sent_at", null)
    .not("email", "is", null)
    .gte("starts_at", new Date(now + reminderWindowHours.from * 3_600_000).toISOString())
    .lte("starts_at", new Date(now + reminderWindowHours.to * 3_600_000).toISOString())
    .order("starts_at")
    .limit(remindersPerTick);
  if (error) throw new Error(`reminders: ${error.message}`);
  const due = ((data ?? []) as EstablishmentBookingRow[]).filter((booking) => Date.parse(booking.starts_at) - Date.parse(booking.created_at) >= minLeadHours * 3_600_000);

  const cutoff = new Date(now - waitlistRetentionDays * 86_400_000).toISOString();
  const stale = new Date(now - staleAfterHours * 3_600_000).toISOString();
  if (options.dryRun) {
    const { count } = await client.from("waitlist_entries").select("id", { count: "exact", head: true }).lt("joined_at", cutoff);
    return { reminders: { due: due.length, sent: 0 }, waitlistExpired: count ?? 0 };
  }

  const bundles = new Map<string, EstablishmentBundle | null>();
  let sent = 0;
  for (const booking of due) {
    if (!bundles.has(booking.establishment_id)) {
      const establishment = await getEstablishment(booking.establishment_id);
      bundles.set(booking.establishment_id, establishment ? await loadBundle(establishment) : null);
    }
    const bundle = bundles.get(booking.establishment_id);
    if (!bundle) continue;
    // Claim the reminder first: two ticks running at once (Vercel and pg_cron) never both send it.
    // Claimed even if sending then fails, so a broken address is not retried every 15 minutes.
    const { data: claimed, error: claimError } = await client
      .from("establishment_bookings")
      .update({ reminder_sent_at: new Date().toISOString() })
      .eq("id", booking.id)
      .is("reminder_sent_at", null)
      .select("id");
    if (claimError) throw new Error(`reminder claim: ${claimError.message}`);
    if (!claimed?.length) continue;
    if (await sendReminder(booking, bundle, `${publicBaseUrl()}/reservar/${bundle.establishment.slug}/${booking.token}`)) sent++;
  }

  // Tickets nobody closed (left waiting or called from a previous service) are closed as cancelled.
  const { error: staleError } = await client
    .from("waitlist_entries")
    .update({ status: "cancelled", finished_at: new Date(now).toISOString() })
    .in("status", ["waiting", "called"])
    .lt("joined_at", stale);
  if (staleError) throw new Error(`waitlist stale tickets: ${staleError.message}`);

  const { count: expired, error: purgeError } = await client.from("waitlist_entries").delete({ count: "exact" }).lt("joined_at", cutoff);
  if (purgeError) throw new Error(`waitlist retention: ${purgeError.message}`);
  const waitlists = await settleWaitlists(client, now);
  return { reminders: { due: due.length, sent }, waitlistExpired: expired ?? 0, waitlists };
}

/**
 * Safety net for the automatic waitlist (the pages already do it whenever someone looks at the
 * queue): opening hours applied, and calls past the time to show up closed as served.
 */
async function settleWaitlists(client: SupabaseClient, now: number) {
  const [scheduled, overdue] = await Promise.all([
    client.from("waitlist_settings").select("establishment_id").eq("auto_hours", true).limit(500),
    client.from("waitlist_entries").select("establishment_id").eq("status", "called").lt("called_at", new Date(now - 60_000).toISOString()).limit(500),
  ]);
  if (scheduled.error) throw new Error(`waitlist schedule: ${scheduled.error.message}`);
  if (overdue.error) throw new Error(`waitlist overdue: ${overdue.error.message}`);
  const ids = new Set([...(scheduled.data ?? []), ...(overdue.data ?? [])].map((row: { establishment_id: string }) => row.establishment_id));
  for (const id of ids) {
    const establishment = await getEstablishment(id);
    if (!establishment) continue;
    await applySchedule(establishment, await ensureWaitlistSettings(establishment));
    await settleQueue(id);
  }
  return { establishments: ids.size };
}

import { kindDefaults } from "@/lib/establishments/kinds";
import { loadBundle } from "@/lib/establishments/store";
import type { EstablishmentBundle, EstablishmentRow } from "@/lib/establishments/types";
import { createServiceClient } from "@/lib/supabase/service";
import { startOfLocalDay, tokenPattern } from "../common";
import { estimateWait, type EtaEntry } from "./eta";
import { scheduledState } from "./schedule";

export type QueueState = "open" | "paused" | "closed";
export type EntryStatus = "waiting" | "called" | "served" | "no_show" | "cancelled";
export type EntryReply = "on_way" | "late" | "leaving";

export interface WaitlistSettingsRow {
  establishment_id: string;
  state: QueueState;
  avg_minutes: number;
  ask_party: boolean;
  ask_service: boolean;
  ask_staff: boolean;
  max_party: number;
  max_waiting: number;
  grace_minutes: number;
  message: string | null;
  /** Opens and closes with the establishment's opening hours. */
  auto_hours: boolean;
  /** Marking «Não apareceu» calls the next ticket right away. */
  auto_next: boolean;
  state_changed_at: string;
  updated_at: string;
}

export interface WaitlistEntryRow {
  id: string;
  establishment_id: string;
  token: string;
  number: number;
  name: string;
  party_size: number | null;
  service_id: string | null;
  staff_id: string | null;
  email: string | null;
  notes: string | null;
  source: "online" | "staff";
  status: EntryStatus;
  reply: EntryReply | null;
  sort_key: number;
  joined_at: string;
  called_at: string | null;
  replied_at: string | null;
  finished_at: string | null;
  /** Not used today (customers don't check in: a call closes on its own). */
  arrived_at: string | null;
  /** Who closed the ticket: the team, the automatic rules or the customer leaving ("arrived" is not used today). */
  close_reason: "staff" | "arrived" | "auto" | "left" | null;
  /** The ticket page's web push subscription, when the customer switched notifications on. */
  push_subscription: unknown;
  /** Last "Enviar notificação de teste" from the ticket page (at most one every 30 seconds). */
  push_test_at: string | null;
}

/** Tickets left waiting or called longer than this (e.g. from yesterday) are no longer part of the queue. */
export const staleAfterHours = 12;

export const stateLabels: Record<QueueState, string> = { open: "Aberta", paused: "Em pausa", closed: "Fechada" };
export const replyLabels: Record<EntryReply, string> = { on_way: "A caminho", late: "Vai atrasar-se", leaving: "Já não vem" };
export const statusLabels: Record<EntryStatus, string> = {
  waiting: "À espera",
  called: "Chamado",
  served: "Atendido",
  no_show: "Não apareceu",
  cancelled: "Desistiu",
};

/** The queue's settings, created with the defaults of the business kind the first time. */
export async function ensureWaitlistSettings(establishment: EstablishmentRow): Promise<WaitlistSettingsRow> {
  const client = createServiceClient();
  const { data, error } = await client.from("waitlist_settings").select("*").eq("establishment_id", establishment.id).maybeSingle();
  if (error) throw new Error(`waitlist settings: ${error.message}`);
  if (data) return data as WaitlistSettingsRow;
  const defaults = kindDefaults[establishment.kind].waitlist;
  const { data: created, error: insertError } = await client
    .from("waitlist_settings")
    .upsert(
      { establishment_id: establishment.id, avg_minutes: defaults.avgMinutes, ask_party: defaults.askParty, ask_service: defaults.askService, ask_staff: defaults.askStaff },
      { onConflict: "establishment_id", ignoreDuplicates: false },
    )
    .select("*")
    .single();
  if (insertError) throw new Error(`waitlist settings insert: ${insertError.message}`);
  return created as WaitlistSettingsRow;
}

/**
 * With "abrir e fechar com o horário", moves the queue to the state its opening hours ask for.
 * The update only applies if nobody changed the state in the meantime.
 */
export async function applySchedule(establishment: EstablishmentRow, settings: WaitlistSettingsRow, bundle?: EstablishmentBundle): Promise<WaitlistSettingsRow> {
  if (!settings.auto_hours) return settings;
  const { hours, closures } = bundle ?? (await loadBundle(establishment));
  const next = scheduledState({
    state: settings.state,
    stateChangedAt: Date.parse(settings.state_changed_at),
    hours,
    closures: closures.map((item) => item.day),
    timeZone: establishment.time_zone,
    now: Date.now(),
  });
  if (!next) return settings;
  const { data, error } = await createServiceClient()
    .from("waitlist_settings")
    .update({ state: next })
    .eq("establishment_id", establishment.id)
    .eq("state", settings.state)
    .select("*")
    .maybeSingle();
  if (error) throw new Error(`waitlist schedule: ${error.message}`);
  return (data as WaitlistSettingsRow | null) ?? settings;
}

/** The queue's settings, with the opening hours applied. What every queue page starts from. */
export async function currentSettings(establishment: EstablishmentRow, bundle?: EstablishmentBundle): Promise<WaitlistSettingsRow> {
  return applySchedule(establishment, await ensureWaitlistSettings(establishment), bundle);
}

/** Called tickets past the time to show up: they close as served. */
export function overdueCalls(live: WaitlistEntryRow[], settings: WaitlistSettingsRow, now: number): WaitlistEntryRow[] {
  return live.filter(
    (entry) => entry.status === "called" && entry.called_at && now - Date.parse(entry.called_at) > settings.grace_minutes * 60_000,
  );
}

/** Closes overdue calls in the database as served. */
export async function settleQueue(establishmentId: string): Promise<WaitlistEntryRow[]> {
  const { data, error } = await createServiceClient().rpc("waitlist_settle", { p_establishment: establishmentId });
  if (error) throw new Error(`waitlist settle: ${error.message}`);
  return (data ?? []) as WaitlistEntryRow[];
}

export interface QueueSnapshot {
  /** Waiting and called, in queue order. */
  live: WaitlistEntryRow[];
  /** Finished today (served, no-show, cancelled), most recent first. */
  doneToday: WaitlistEntryRow[];
  /** When people were called in the last 90 minutes (for the pace). */
  recentCalls: number[];
  /** When the snapshot was read (the reference for waiting times shown with it). */
  now: number;
}

/**
 * The live queue. With the settings, overdue calls are settled first (closed as served), so every
 * page that shows the queue keeps it moving on its own.
 */
export async function loadQueue(establishment: EstablishmentRow, settings?: WaitlistSettingsRow): Promise<QueueSnapshot> {
  const snapshot = await readQueue(establishment);
  if (!settings || !overdueCalls(snapshot.live, settings, snapshot.now).length) return snapshot;
  await settleQueue(establishment.id);
  return readQueue(establishment);
}

async function readQueue(establishment: EstablishmentRow): Promise<QueueSnapshot> {
  const client = createServiceClient();
  const dayStart = startOfLocalDay(establishment.time_zone).toISOString();
  const [live, done, calls] = await Promise.all([
    client
      .from("waitlist_entries")
      .select("*")
      .eq("establishment_id", establishment.id)
      .in("status", ["waiting", "called"])
      .gte("joined_at", new Date(Date.now() - staleAfterHours * 3_600_000).toISOString())
      .order("sort_key")
      .limit(500),
    client
      .from("waitlist_entries")
      .select("*")
      .eq("establishment_id", establishment.id)
      .in("status", ["served", "no_show", "cancelled"])
      .gte("joined_at", dayStart)
      .order("finished_at", { ascending: false })
      .limit(100),
    client
      .from("waitlist_entries")
      .select("called_at")
      .eq("establishment_id", establishment.id)
      .gte("called_at", new Date(Date.now() - 90 * 60_000).toISOString())
      .limit(200),
  ]);
  for (const result of [live, done, calls]) if (result.error) throw new Error(`loadQueue: ${result.error.message}`);
  return {
    live: (live.data ?? []) as WaitlistEntryRow[],
    doneToday: (done.data ?? []) as WaitlistEntryRow[],
    recentCalls: ((calls.data ?? []) as { called_at: string }[]).map((row) => Date.parse(row.called_at)),
    now: Date.now(),
  };
}

function etaEntry(entry: WaitlistEntryRow, bundle: EstablishmentBundle, settings: WaitlistSettingsRow): EtaEntry {
  const service = settings.ask_service && entry.service_id ? bundle.services.find((item) => item.id === entry.service_id) : null;
  return { serviceMinutes: settings.ask_service ? (service?.duration_minutes ?? settings.avg_minutes) : null, staffId: entry.staff_id };
}

/** Place in the queue (1 = next) and estimated minutes for a waiting entry. */
export function entryOutlook(entry: WaitlistEntryRow, queue: QueueSnapshot, bundle: EstablishmentBundle, settings: WaitlistSettingsRow) {
  const waiting = queue.live.filter((item) => item.status === "waiting");
  const index = waiting.findIndex((item) => item.id === entry.id);
  const ahead = index < 0 ? [] : waiting.slice(0, index);
  const minutes = estimateWait({
    ahead: ahead.map((item) => etaEntry(item, bundle, settings)),
    self: etaEntry(entry, bundle, settings),
    avgMinutes: settings.avg_minutes,
    activeStaff: bundle.staff.filter((item) => item.active).length,
    staffIds: bundle.staff.filter((item) => item.active).map((item) => item.id),
    recentCalls: queue.recentCalls,
    now: queue.now,
  });
  return { position: index + 1, minutes };
}

export async function getEntryByToken(token: string): Promise<WaitlistEntryRow | null> {
  if (!tokenPattern.test(token)) return null;
  const { data, error } = await createServiceClient().from("waitlist_entries").select("*").eq("token", token).maybeSingle();
  if (error) throw new Error(`getEntryByToken: ${error.message}`);
  return data as WaitlistEntryRow | null;
}

export interface WaitlistStats {
  days: number;
  joined: number;
  /** Marked as served by the team (or the customer's «Cheguei»). */
  served: number;
  /** Called and closed on their own once the time to show up passed (nobody marked anything). */
  autoClosed: number;
  noShow: number;
  cancelled: number;
  /** Median minutes between joining and being called. */
  medianWait: number | null;
  /** Entries per weekday (0 = Sunday) and hour, for the busiest times. */
  byHour: { weekday: number; hour: number; count: number }[];
}

export async function loadStats(establishment: EstablishmentRow, days = 30): Promise<WaitlistStats> {
  const since = new Date(Date.now() - days * 86_400_000).toISOString();
  const { data, error } = await createServiceClient()
    .from("waitlist_entries")
    .select("status, joined_at, called_at, close_reason")
    .eq("establishment_id", establishment.id)
    .gte("joined_at", since)
    .limit(5000);
  if (error) throw new Error(`loadStats: ${error.message}`);
  const rows = (data ?? []) as { status: EntryStatus; joined_at: string; called_at: string | null; close_reason: WaitlistEntryRow["close_reason"] }[];
  const waits = rows
    .filter((row) => row.called_at)
    .map((row) => (Date.parse(row.called_at!) - Date.parse(row.joined_at)) / 60_000)
    .sort((a, b) => a - b);
  const median = waits.length ? Math.round(waits.length % 2 ? waits[(waits.length - 1) / 2] : (waits[waits.length / 2 - 1] + waits[waits.length / 2]) / 2) : null;
  const format = new Intl.DateTimeFormat("en-US", { timeZone: establishment.time_zone, weekday: "short", hour: "2-digit", hourCycle: "h23" });
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const counts = new Map<string, number>();
  for (const row of rows) {
    const parts = format.formatToParts(new Date(row.joined_at));
    const weekday = weekdays.indexOf(parts.find((part) => part.type === "weekday")?.value ?? "");
    const hour = Number(parts.find((part) => part.type === "hour")?.value);
    const key = `${weekday}:${hour}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return {
    days,
    joined: rows.length,
    served: rows.filter((row) => row.status === "served" && row.close_reason !== "auto").length,
    autoClosed: rows.filter((row) => row.status === "served" && row.close_reason === "auto").length,
    noShow: rows.filter((row) => row.status === "no_show").length,
    cancelled: rows.filter((row) => row.status === "cancelled").length,
    medianWait: median,
    byHour: [...counts.entries()]
      .map(([key, count]) => {
        const [weekday, hour] = key.split(":").map(Number);
        return { weekday, hour, count };
      })
      .sort((a, b) => b.count - a.count),
  };
}

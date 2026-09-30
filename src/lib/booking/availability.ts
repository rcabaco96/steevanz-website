import type { SupabaseClient } from "@supabase/supabase-js";
import { site } from "@/lib/site";
import { tryCreateServiceClient } from "@/lib/supabase/service";
import { computeAvailability, type AvailabilityConfig, type BusyInterval, type DayAvailability } from "./slots";

export interface SettingsRow {
  timezone: string;
  min_notice_hours: number;
  max_days_ahead: number;
}

export interface RuleRow {
  id: string;
  weekday: number;
  start_time: string;
  end_time: string;
  slot_minutes: number;
  active: boolean;
}

export interface BreakRow {
  id: string;
  weekday: number;
  start_time: string;
  end_time: string;
}

export interface BlockedDateRow {
  id: string;
  date: string;
  reason: string | null;
}

export const defaultSettings: SettingsRow = {
  timezone: site.timeZone,
  min_notice_hours: 12,
  max_days_ahead: 30,
};

export interface AvailabilityTables {
  settings: SettingsRow;
  rules: RuleRow[];
  breaks: BreakRow[];
  blockedDates: BlockedDateRow[];
}

export async function loadAvailabilityTables(client: SupabaseClient): Promise<AvailabilityTables> {
  const [settingsResult, rulesResult, breaksResult, blockedResult] = await Promise.all([
    client.from("booking_settings").select("timezone, min_notice_hours, max_days_ahead").eq("id", 1).maybeSingle(),
    client
      .from("availability_rules")
      .select("id, weekday, start_time, end_time, slot_minutes, active")
      .order("weekday")
      .order("start_time"),
    client.from("availability_breaks").select("id, weekday, start_time, end_time").order("weekday").order("start_time"),
    client.from("blocked_dates").select("id, date, reason").order("date"),
  ]);

  const firstError = settingsResult.error ?? rulesResult.error ?? breaksResult.error ?? blockedResult.error;
  if (firstError) throw new Error(`Failed to load availability: ${firstError.message}`);

  return {
    settings: (settingsResult.data as SettingsRow | null) ?? defaultSettings,
    rules: (rulesResult.data ?? []) as RuleRow[],
    breaks: (breaksResult.data ?? []) as BreakRow[],
    blockedDates: (blockedResult.data ?? []) as BlockedDateRow[],
  };
}

export function toAvailabilityConfig(tables: AvailabilityTables): AvailabilityConfig {
  return {
    timeZone: tables.settings.timezone || site.timeZone,
    minNoticeHours: tables.settings.min_notice_hours,
    maxDaysAhead: tables.settings.max_days_ahead,
    rules: tables.rules.map((rule) => ({
      weekday: rule.weekday,
      startTime: rule.start_time,
      endTime: rule.end_time,
      slotMinutes: rule.slot_minutes,
      active: rule.active,
    })),
    breaks: tables.breaks.map((item) => ({
      weekday: item.weekday,
      startTime: item.start_time,
      endTime: item.end_time,
    })),
    blockedDates: tables.blockedDates.map((row) => row.date),
  };
}

export async function loadBusyIntervals(client: SupabaseClient, from: Date): Promise<BusyInterval[]> {
  const { data, error } = await client
    .from("bookings")
    .select("slot_start, slot_end")
    .neq("status", "cancelled")
    .gte("slot_end", from.toISOString());
  if (error) throw new Error(`Failed to load bookings: ${error.message}`);
  return ((data ?? []) as { slot_start: string; slot_end: string }[]).map((row) => ({
    start: new Date(row.slot_start),
    end: new Date(row.slot_end),
  }));
}

export type AvailabilityResult =
  | { ok: true; timeZone: string; days: DayAvailability[] }
  | { ok: false; reason: "unconfigured" | "error" };

export async function getAvailability(client?: SupabaseClient | null): Promise<AvailabilityResult> {
  const supabase = client ?? tryCreateServiceClient();
  if (!supabase) return { ok: false, reason: "unconfigured" };
  try {
    const now = new Date();
    const [tables, busy] = await Promise.all([loadAvailabilityTables(supabase), loadBusyIntervals(supabase, now)]);
    const config = toAvailabilityConfig(tables);
    return { ok: true, timeZone: config.timeZone, days: computeAvailability(config, now, busy) };
  } catch (error) {
    console.error("[booking] availability failed:", error instanceof Error ? error.message : error);
    return { ok: false, reason: "error" };
  }
}

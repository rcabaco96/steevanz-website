import { kindDefaults } from "@/lib/establishments/kinds";
import { isUuid, shortTime } from "@/lib/establishments/store";
import type { EstablishmentBundle, EstablishmentRow } from "@/lib/establishments/types";
import { addDaysToDate, zonedDateString, zonedDateTimeToUtc } from "@/lib/booking/slots";
import { createServiceClient } from "@/lib/supabase/service";
import { tokenPattern } from "../common";
import { bookingAvailability, canChangeOnline, type BookingDay, type BusyPeriod } from "./availability";

export type BookingStatus = "confirmed" | "arrived" | "no_show" | "cancelled";

export interface BookingPageRow {
  establishment_id: string;
  active: boolean;
  mode: "table" | "service";
  slot_interval_minutes: number;
  min_notice_minutes: number;
  max_days_ahead: number;
  table_minutes: number;
  seats_per_slot: number;
  max_party: number;
  cancel_until_hours: number;
  policy: string | null;
  confirmation_note: string | null;
  notify_owner: boolean;
  calendar_token: string;
  /** How late a customer may arrive (shown to them; past it the team sees the booking as late). */
  late_grace_minutes: number;
  updated_at: string;
}

export interface EstablishmentBookingRow {
  id: string;
  establishment_id: string;
  token: string;
  service_id: string | null;
  staff_id: string | null;
  party_size: number | null;
  starts_at: string;
  ends_at: string;
  name: string;
  email: string | null;
  phone: string | null;
  notes: string | null;
  status: BookingStatus;
  source: "online" | "staff";
  reminder_sent_at: string | null;
  cancelled_at: string | null;
  /** Largest "Estamos com atraso" this customer was emailed about (no repeats). */
  delay_notified_minutes: number;
  created_at: string;
}

export interface BookingDelayRow {
  id: string;
  establishment_id: string;
  /** Null: the whole space. */
  staff_id: string | null;
  day: string;
  minutes: number;
}

/** "Estamos com atraso" set for a local day (the whole space and/or professionals). */
export async function loadDelays(establishment: EstablishmentRow, day: string): Promise<BookingDelayRow[]> {
  const { data, error } = await createServiceClient().from("booking_delays").select("*").eq("establishment_id", establishment.id).eq("day", day).gt("minutes", 0);
  if (error) throw new Error(`loadDelays: ${error.message}`);
  return (data ?? []) as BookingDelayRow[];
}

/** The delay that applies to a booking: its professional's own, otherwise the whole space's. */
export function delayFor(delays: BookingDelayRow[], staffId: string | null): number {
  const own = staffId ? delays.find((item) => item.staff_id === staffId) : undefined;
  return own?.minutes ?? delays.find((item) => item.staff_id === null)?.minutes ?? 0;
}

/** Past the arrival tolerance and nobody marked it: the team decides (arrived or no-show). */
export function isLate(booking: Pick<EstablishmentBookingRow, "status" | "starts_at">, page: Pick<BookingPageRow, "late_grace_minutes">, now: number): boolean {
  return booking.status === "confirmed" && now > Date.parse(booking.starts_at) + page.late_grace_minutes * 60_000;
}

/** The bookings of a list that are late right now. */
export function lateBookingIds(bookings: Pick<EstablishmentBookingRow, "id" | "status" | "starts_at">[], page: Pick<BookingPageRow, "late_grace_minutes">): Set<string> {
  const now = Date.now();
  return new Set(bookings.filter((booking) => isLate(booking, page, now)).map((booking) => booking.id));
}

/** Today at the counter: the day's bookings, the delays set, which are late and the next one to arrive. */
export async function todayAgenda(establishment: EstablishmentRow, page: Pick<BookingPageRow, "late_grace_minutes">) {
  const now = Date.now();
  const date = zonedDateString(new Date(now), establishment.time_zone);
  const [{ bookings }, delays] = await Promise.all([loadDay(establishment, date), loadDelays(establishment, date)]);
  const late = new Set(bookings.filter((booking) => isLate(booking, page, now)).map((booking) => booking.id));
  const next = bookings.find((booking) => booking.status === "confirmed" && !late.has(booking.id)) ?? null;
  return { date, now, bookings, delays, late, next };
}

/** "Guardamos a mesa 10 minutos." / "Tolerância de 10 minutos." (null without tolerance). */
export function toleranceText(page: Pick<BookingPageRow, "late_grace_minutes" | "mode">): string | null {
  if (!page.late_grace_minutes) return null;
  return page.mode === "table" ? `Guardamos a mesa ${page.late_grace_minutes} minutos.` : `Tolerância de atraso: ${page.late_grace_minutes} minutos.`;
}

export interface BookingBlockRow {
  id: string;
  establishment_id: string;
  staff_id: string | null;
  starts_at: string;
  ends_at: string;
  reason: string | null;
}

export const bookingStatusLabels: Record<BookingStatus, string> = {
  confirmed: "Confirmada",
  arrived: "Chegou",
  no_show: "Não compareceu",
  cancelled: "Cancelada",
};

/** Start times are offered every 15 minutes (tables and services alike), as booking sites do. */
export const slotStepMinutes = 15;
/** Restaurants take the last table booking one hour before closing. */
export const lastTableBeforeCloseMinutes = 60;

/**
 * The booking page. Its kind follows the business (restaurants book tables, the rest book
 * services), so it is never a setting: a space that changes kind changes kind of booking too.
 */
export async function ensureBookingPage(establishment: EstablishmentRow): Promise<BookingPageRow> {
  const client = createServiceClient();
  const mode = kindDefaults[establishment.kind].bookingMode;
  const { data, error } = await client.from("booking_pages").select("*").eq("establishment_id", establishment.id).maybeSingle();
  if (error) throw new Error(`booking page: ${error.message}`);
  if (data) {
    const page = data as BookingPageRow;
    if (page.mode !== mode) await client.from("booking_pages").update({ mode }).eq("establishment_id", establishment.id);
    return { ...page, mode };
  }
  const { data: created, error: insertError } = await client
    .from("booking_pages")
    .upsert({ establishment_id: establishment.id, mode, slot_interval_minutes: slotStepMinutes }, { onConflict: "establishment_id" })
    .select("*")
    .single();
  if (insertError) throw new Error(`booking page insert: ${insertError.message}`);
  return created as BookingPageRow;
}

/** Bookings that hold time (confirmed or arrived) and blocks overlapping [from, to). */
export async function loadBusy(establishmentId: string, from: Date, to: Date) {
  const client = createServiceClient();
  const [bookings, blocks] = await Promise.all([
    client
      .from("establishment_bookings")
      .select("staff_id, party_size, starts_at, ends_at")
      .eq("establishment_id", establishmentId)
      .in("status", ["confirmed", "arrived"])
      .lt("starts_at", to.toISOString())
      .gt("ends_at", from.toISOString())
      .limit(5000),
    client.from("booking_blocks").select("staff_id, starts_at, ends_at").eq("establishment_id", establishmentId).lt("starts_at", to.toISOString()).gt("ends_at", from.toISOString()),
  ]);
  if (bookings.error) throw new Error(`loadBusy: ${bookings.error.message}`);
  if (blocks.error) throw new Error(`loadBusy blocks: ${blocks.error.message}`);
  return {
    bookings: (bookings.data ?? []) as Pick<EstablishmentBookingRow, "staff_id" | "party_size" | "starts_at" | "ends_at">[],
    blocks: (blocks.data ?? []) as Pick<BookingBlockRow, "staff_id" | "starts_at" | "ends_at">[],
  };
}

export interface AvailabilityRequest {
  serviceId: string | null;
  staffId: string | null;
  partySize: number;
  from?: string;
  days?: number;
}

/** What the booking page needs for a request, or why it can't be answered. */
export function resolveRequest(bundle: EstablishmentBundle, page: BookingPageRow, request: AvailabilityRequest) {
  const activeStaff = bundle.staff.filter((item) => item.active);
  if (page.mode === "table") {
    if (request.partySize < 1 || request.partySize > page.max_party) return { error: "party" } as const;
    return { occupied: page.table_minutes, fit: lastTableBeforeCloseMinutes, staff: [] as string[], service: null } as const;
  }
  const service = bundle.services.find((item) => item.id === request.serviceId && item.active);
  if (!service) return { error: "service" } as const;
  if (request.staffId && !activeStaff.some((item) => item.id === request.staffId)) return { error: "staff" } as const;
  const staff = request.staffId ? [request.staffId] : activeStaff.map((item) => item.id);
  return { occupied: service.duration_minutes + service.buffer_minutes, fit: service.duration_minutes, staff, service } as const;
}

export async function computeDays(bundle: EstablishmentBundle, page: BookingPageRow, request: AvailabilityRequest, now = Date.now()): Promise<BookingDay[]> {
  const resolved = resolveRequest(bundle, page, request);
  if ("error" in resolved) return [];
  const { establishment } = bundle;
  const today = zonedDateString(new Date(now), establishment.time_zone);
  const from = request.from && request.from > today ? request.from : today;
  const days = Math.min(request.days ?? page.max_days_ahead + 1, page.max_days_ahead + 1);
  const rangeStart = zonedDateTimeToUtc(from, 0, establishment.time_zone);
  const rangeEnd = zonedDateTimeToUtc(addDaysToDate(from, days + 1), 0, establishment.time_zone);
  const { bookings, blocks } = await loadBusy(establishment.id, rangeStart, rangeEnd);
  const busy: BusyPeriod[] = [
    ...bookings.map((row) => ({ staffId: row.staff_id, start: Date.parse(row.starts_at), end: Date.parse(row.ends_at), kind: "booking" as const })),
    ...blocks.map((row) => ({ staffId: row.staff_id, start: Date.parse(row.starts_at), end: Date.parse(row.ends_at), kind: "block" as const })),
  ];
  const tables = page.mode === "table" ? bookings.map((row) => ({ start: Date.parse(row.starts_at), end: Date.parse(row.ends_at), party: row.party_size ?? 1 })) : [];
  return bookingAvailability(
    {
      mode: page.mode,
      timeZone: establishment.time_zone,
      now,
      minNoticeMinutes: page.min_notice_minutes,
      maxDaysAhead: page.max_days_ahead,
      intervalMinutes: slotStepMinutes,
      occupiedMinutes: resolved.occupied,
      fitMinutes: resolved.fit,
      hours: bundle.hours.map((row) => ({ weekday: row.weekday, opens: shortTime(row.opens), closes: shortTime(row.closes) })),
      closures: bundle.closures.map((row) => row.day),
      staff: resolved.staff,
      busy,
      seatsPerSlot: page.seats_per_slot,
      partySize: request.partySize,
      tables,
    },
    { from, days },
  );
}

/**
 * "Anyone": the free professionals, least busy that day first (bookings already held), so work is
 * spread instead of always landing on the first name.
 */
export async function leastBusyFirst(establishment: EstablishmentRow, staff: string[], startIso: string): Promise<string[]> {
  if (staff.length < 2) return staff;
  const date = zonedDateString(new Date(startIso), establishment.time_zone);
  const { bookings } = await loadBusy(establishment.id, zonedDateTimeToUtc(date, 0, establishment.time_zone), zonedDateTimeToUtc(addDaysToDate(date, 1), 0, establishment.time_zone));
  const load = new Map<string, number>();
  for (const row of bookings) if (row.staff_id) load.set(row.staff_id, (load.get(row.staff_id) ?? 0) + 1);
  return [...staff].sort((a, b) => (load.get(a) ?? 0) - (load.get(b) ?? 0));
}

export async function getBookingByToken(token: string): Promise<EstablishmentBookingRow | null> {
  if (!tokenPattern.test(token)) return null;
  const { data, error } = await createServiceClient().from("establishment_bookings").select("*").eq("token", token).maybeSingle();
  if (error) throw new Error(`getBookingByToken: ${error.message}`);
  return data as EstablishmentBookingRow | null;
}

export async function getBooking(establishmentId: string, id: string): Promise<EstablishmentBookingRow | null> {
  if (!isUuid(id)) return null;
  const { data, error } = await createServiceClient().from("establishment_bookings").select("*").eq("id", id).eq("establishment_id", establishmentId).maybeSingle();
  if (error) throw new Error(`getBooking: ${error.message}`);
  return data as EstablishmentBookingRow | null;
}

/** Bookings (any status) and blocks of one local day. */
export async function loadDay(establishment: EstablishmentRow, date: string) {
  const start = zonedDateTimeToUtc(date, 0, establishment.time_zone).toISOString();
  const end = zonedDateTimeToUtc(addDaysToDate(date, 1), 0, establishment.time_zone).toISOString();
  const client = createServiceClient();
  const [bookings, blocks] = await Promise.all([
    client.from("establishment_bookings").select("*").eq("establishment_id", establishment.id).gte("starts_at", start).lt("starts_at", end).order("starts_at"),
    client.from("booking_blocks").select("*").eq("establishment_id", establishment.id).lt("starts_at", end).gt("ends_at", start).order("starts_at"),
  ]);
  if (bookings.error) throw new Error(`loadDay: ${bookings.error.message}`);
  if (blocks.error) throw new Error(`loadDay blocks: ${blocks.error.message}`);
  return { bookings: (bookings.data ?? []) as EstablishmentBookingRow[], blocks: (blocks.data ?? []) as BookingBlockRow[] };
}

export async function loadUpcoming(establishment: EstablishmentRow, days = 14): Promise<EstablishmentBookingRow[]> {
  const { data, error } = await createServiceClient()
    .from("establishment_bookings")
    .select("*")
    .eq("establishment_id", establishment.id)
    .eq("status", "confirmed")
    .gte("starts_at", new Date().toISOString())
    .lt("starts_at", new Date(Date.now() + days * 86_400_000).toISOString())
    .order("starts_at")
    .limit(500);
  if (error) throw new Error(`loadUpcoming: ${error.message}`);
  return (data ?? []) as EstablishmentBookingRow[];
}

export interface BookingStats {
  days: number;
  total: number;
  online: number;
  arrived: number;
  noShow: number;
  cancelled: number;
}

export async function loadBookingStats(establishment: EstablishmentRow, days = 30): Promise<BookingStats> {
  const { data, error } = await createServiceClient()
    .from("establishment_bookings")
    .select("status, source")
    .eq("establishment_id", establishment.id)
    .gte("starts_at", new Date(Date.now() - days * 86_400_000).toISOString())
    .lt("starts_at", new Date().toISOString())
    .limit(10000);
  if (error) throw new Error(`loadBookingStats: ${error.message}`);
  const rows = (data ?? []) as { status: BookingStatus; source: string }[];
  return {
    days,
    total: rows.length,
    online: rows.filter((row) => row.source === "online").length,
    arrived: rows.filter((row) => row.status === "arrived").length,
    noShow: rows.filter((row) => row.status === "no_show").length,
    cancelled: rows.filter((row) => row.status === "cancelled").length,
  };
}

/** Whether a booking still holds a place and can still be changed or cancelled online (now). */
export function bookingChangeState(booking: EstablishmentBookingRow, page: BookingPageRow): { active: boolean; changeable: boolean } {
  const now = Date.now();
  const active = booking.status === "confirmed" && Date.parse(booking.ends_at) > now;
  return { active, changeable: active && canChangeOnline(booking.starts_at, page.cancel_until_hours, now) };
}

export function formatBookingWhen(iso: string, timeZone: string): string {
  return new Intl.DateTimeFormat("pt-PT", { timeZone, weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
}

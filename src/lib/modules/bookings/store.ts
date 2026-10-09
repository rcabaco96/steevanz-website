import { isUuid, shortTime } from "@/lib/establishments/store";
import type { EstablishmentBundle, EstablishmentRow, ServiceRow } from "@/lib/establishments/types";
import { addDaysToDate, zonedDateString, zonedDateTimeToUtc } from "@/lib/booking/slots";
import { createServiceClient } from "@/lib/supabase/service";
import { tokenPattern } from "../common";
import { bookedInTurn, bookingAvailability, canChangeOnline, turnLabel, type BookingDay, type BusyPeriod } from "./availability";

export type BookingStatus = "confirmed" | "arrived" | "no_show" | "cancelled";

export interface BookingPageRow {
  establishment_id: string;
  active: boolean;
  slot_interval_minutes: number;
  min_notice_minutes: number;
  max_days_ahead: number;
  /** Not used any more (restaurants book by turn). */
  table_minutes: number;
  /** Restaurants: people per turn (lunch, dinner). */
  seats_per_slot: number;
  /** Restaurants: the last booking starts this long before the turn ends. */
  last_booking_minutes: number;
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

/** Past the arrival tolerance, while the booked time is still running: the customer may still come. */
export function isLate(booking: Pick<EstablishmentBookingRow, "status" | "starts_at" | "ends_at">, page: Pick<BookingPageRow, "late_grace_minutes">, now: number): boolean {
  return booking.status === "confirmed" && now > Date.parse(booking.starts_at) + page.late_grace_minutes * 60_000 && !isOverdue(booking, now);
}

/** The booked time is over and nobody marked it: no longer late, the team says what happened. */
export function isOverdue(booking: Pick<EstablishmentBookingRow, "status" | "ends_at">, now: number): boolean {
  return booking.status === "confirmed" && now > Date.parse(booking.ends_at);
}

export interface TurnSummary {
  service: ServiceRow;
  label: string;
  start: number;
  end: number;
  /** People booked to arrive in this turn for this service (confirmed or arrived). */
  booked: number;
  capacity: number;
}

/** Group services (restaurant tables): each turn of a local day with how many people are booked. */
export function dayTurns(bundle: EstablishmentBundle, date: string, bookings: Pick<EstablishmentBookingRow, "status" | "starts_at" | "party_size" | "service_id">[]): TurnSummary[] {
  const timeZone = bundle.establishment.time_zone;
  const weekday = new Date(`${date}T12:00:00Z`).getUTCDay();
  const minutes = (value: string) => Number(value.slice(0, 2)) * 60 + Number(value.slice(3, 5));
  const intervals = bundle.hours
    .filter((row) => row.weekday === weekday)
    .map((row) => ({ opens: minutes(row.opens), closes: minutes(row.closes) }))
    .sort((a, b) => a.opens - b.opens);
  return bundle.services
    .filter((service) => service.active && service.booking_kind === "group")
    .flatMap((service) => {
      const arrivals = bookings
        .filter((booking) => booking.service_id === service.id && (booking.status === "confirmed" || booking.status === "arrived"))
        .map((booking) => ({ start: Date.parse(booking.starts_at), party: booking.party_size ?? 1 }));
      return intervals.map(({ opens, closes }) => {
        const start = zonedDateTimeToUtc(date, opens, timeZone).getTime();
        const end = zonedDateTimeToUtc(date, closes, timeZone).getTime();
        return { service, label: turnLabel(opens), start, end, booked: bookedInTurn(arrivals, start, end), capacity: service.capacity ?? 1 };
      });
    });
}

/** One day of the agenda: bookings, blocks, delays (today), which are late or past their time, and the turns (restaurants). */
export async function loadAgendaDay(bundle: EstablishmentBundle, page: BookingPageRow, date: string) {
  const { establishment } = bundle;
  const now = Date.now();
  const today = zonedDateString(new Date(now), establishment.time_zone);
  const [{ bookings, blocks }, delays] = await Promise.all([loadDay(establishment, date), date === today ? loadDelays(establishment, date) : Promise.resolve([])]);
  const late = new Set(bookings.filter((booking) => isLate(booking, page, now)).map((booking) => booking.id));
  const overdue = new Set(bookings.filter((booking) => isOverdue(booking, now)).map((booking) => booking.id));
  return { date, today, now, bookings, blocks, delays, late, overdue, turns: dayTurns(bundle, date, bookings) };
}

/** Bookings still on (confirmed or arrived) per local day, for the day picker. */
export async function bookingCountsByDay(establishment: EstablishmentRow, from: string, days: number): Promise<Map<string, number>> {
  const { data, error } = await createServiceClient()
    .from("establishment_bookings")
    .select("starts_at")
    .eq("establishment_id", establishment.id)
    .in("status", ["confirmed", "arrived"])
    .gte("starts_at", zonedDateTimeToUtc(from, 0, establishment.time_zone).toISOString())
    .lt("starts_at", zonedDateTimeToUtc(addDaysToDate(from, days), 0, establishment.time_zone).toISOString())
    .limit(5000);
  if (error) throw new Error(`bookingCountsByDay: ${error.message}`);
  const counts = new Map<string, number>();
  for (const row of (data ?? []) as { starts_at: string }[]) {
    const day = zonedDateString(new Date(row.starts_at), establishment.time_zone);
    counts.set(day, (counts.get(day) ?? 0) + 1);
  }
  return counts;
}

/** Blocked periods from today on (Definições). */
export async function loadUpcomingBlocks(establishment: EstablishmentRow): Promise<BookingBlockRow[]> {
  const { data, error } = await createServiceClient()
    .from("booking_blocks")
    .select("*")
    .eq("establishment_id", establishment.id)
    .gt("ends_at", new Date().toISOString())
    .order("starts_at")
    .limit(100);
  if (error) throw new Error(`loadUpcomingBlocks: ${error.message}`);
  return (data ?? []) as BookingBlockRow[];
}

/** "Guardamos a mesa 10 minutos." / "Tolerância de 10 minutos." (null without tolerance). */
export function toleranceText(page: Pick<BookingPageRow, "late_grace_minutes">): string | null {
  if (!page.late_grace_minutes) return null;
  return `Tolerância de atraso: ${page.late_grace_minutes} minutos.`;
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
  confirmed: "Por chegar",
  arrived: "Chegou",
  no_show: "Não veio",
  cancelled: "Cancelada",
};

/** Start times are offered every 15 minutes (tables and services alike), as booking sites do. */
export const slotStepMinutes = 15;
/** How long a restaurant booking shows in calendars (it holds a place for the whole turn). */
const tableCalendarMinutes = 120;

/**
 * The booking page. Its kind follows the business (restaurants book tables, the rest book
 * services), so it is never a setting: a space that changes kind changes kind of booking too.
 */
export async function ensureBookingPage(establishment: EstablishmentRow): Promise<BookingPageRow> {
  const client = createServiceClient();
  const { data, error } = await client.from("booking_pages").select("*").eq("establishment_id", establishment.id).maybeSingle();
  if (error) throw new Error(`booking page: ${error.message}`);
  if (data) return data as BookingPageRow;
  const { data: created, error: insertError } = await client
    .from("booking_pages")
    .upsert({ establishment_id: establishment.id, slot_interval_minutes: slotStepMinutes }, { onConflict: "establishment_id" })
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
      .select("id, service_id, staff_id, party_size, starts_at, ends_at")
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
    bookings: (bookings.data ?? []) as Pick<EstablishmentBookingRow, "id" | "service_id" | "staff_id" | "party_size" | "starts_at" | "ends_at">[],
    blocks: (blocks.data ?? []) as Pick<BookingBlockRow, "staff_id" | "starts_at" | "ends_at">[],
  };
}

export interface AvailabilityRequest {
  serviceId: string | null;
  staffId: string | null;
  partySize: number;
  from?: string;
  days?: number;
  /** The team changing a booking: it doesn't count against itself. */
  excludeId?: string;
  /** The team booking (phone, counter): no minimum notice. */
  forStaff?: boolean;
}

/** The people or places that can do a service: the chosen ones, or every active one. */
export function serviceStaff(bundle: EstablishmentBundle, service: ServiceRow): string[] {
  const active = bundle.staff.filter((item) => item.active).map((item) => item.id);
  const chosen = bundle.serviceStaff.filter((row) => row.service_id === service.id).map((row) => row.staff_id);
  return chosen.length ? active.filter((id) => chosen.includes(id)) : active;
}

/** What a request needs (the service, and who can do it), or why it can't be answered. */
export function resolveRequest(bundle: EstablishmentBundle, request: AvailabilityRequest) {
  const service = bundle.services.find((item) => item.id === request.serviceId && item.active);
  if (!service) return { error: "service" } as const;
  if (service.booking_kind === "group") {
    if (request.partySize < 1 || request.partySize > (request.forStaff ? 1000 : service.max_party)) return { error: "party" } as const;
    return { service, staff: [] as string[] } as const;
  }
  const eligible = serviceStaff(bundle, service);
  if (request.staffId && !eligible.includes(request.staffId)) return { error: "staff" } as const;
  return { service, staff: request.staffId ? [request.staffId] : eligible } as const;
}

export async function computeDays(bundle: EstablishmentBundle, page: BookingPageRow, request: AvailabilityRequest, now = Date.now()): Promise<BookingDay[]> {
  const resolved = resolveRequest(bundle, request);
  if ("error" in resolved) return [];
  const { service } = resolved;
  const { establishment } = bundle;
  const today = zonedDateString(new Date(now), establishment.time_zone);
  const from = request.from && request.from > today ? request.from : today;
  const horizon = request.forStaff ? Math.max(page.max_days_ahead, 365) : page.max_days_ahead;
  const days = Math.min(request.days ?? horizon + 1, horizon + 1);
  const rangeStart = zonedDateTimeToUtc(from, 0, establishment.time_zone);
  const rangeEnd = zonedDateTimeToUtc(addDaysToDate(from, days + 1), 0, establishment.time_zone);
  const busyRows = await loadBusy(establishment.id, rangeStart, rangeEnd);
  const bookings = request.excludeId ? busyRows.bookings.filter((row) => row.id !== request.excludeId) : busyRows.bookings;
  const groupIds = new Set(bundle.services.filter((item) => item.booking_kind === "group").map((item) => item.id));
  const busy: BusyPeriod[] = [
    // One-at-a-time services only: group bookings (tables) never hold a person or the space.
    ...bookings
      .filter((row) => !(row.service_id && groupIds.has(row.service_id)))
      .map((row) => ({ staffId: row.staff_id, start: Date.parse(row.starts_at), end: Date.parse(row.ends_at), kind: "booking" as const })),
    ...busyRows.blocks.map((row) => ({ staffId: row.staff_id, start: Date.parse(row.starts_at), end: Date.parse(row.ends_at), kind: "block" as const })),
  ];
  const staffHours: Record<string, { weekday: number; opens: string; closes: string }[]> = {};
  for (const row of bundle.staffHours) (staffHours[row.staff_id] ??= []).push({ weekday: row.weekday, opens: shortTime(row.opens), closes: shortTime(row.closes) });
  return bookingAvailability(
    {
      kind: service.booking_kind,
      timeZone: establishment.time_zone,
      now,
      minNoticeMinutes: request.forStaff ? 0 : page.min_notice_minutes,
      maxDaysAhead: horizon,
      intervalMinutes: slotStepMinutes,
      durationMinutes: service.booking_kind === "group" ? tableCalendarMinutes : service.duration_minutes,
      bufferMinutes: service.booking_kind === "group" ? 0 : service.buffer_minutes,
      lastArrivalMinutes: page.last_booking_minutes,
      hours: bundle.hours.map((row) => ({ weekday: row.weekday, opens: shortTime(row.opens), closes: shortTime(row.closes) })),
      closures: bundle.closures.map((row) => row.day),
      staff: resolved.staff,
      staffHours,
      busy,
      capacity: service.capacity ?? 1,
      partySize: request.partySize,
      arrivals: bookings.filter((row) => row.service_id === service.id).map((row) => ({ start: Date.parse(row.starts_at), party: row.party_size ?? 1 })),
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

/** Whether a booking still holds a place and can still be changed or cancelled online (now). */
export function bookingChangeState(booking: EstablishmentBookingRow, page: BookingPageRow): { active: boolean; changeable: boolean } {
  const now = Date.now();
  const active = booking.status === "confirmed" && Date.parse(booking.ends_at) > now;
  return { active, changeable: active && canChangeOnline(booking.starts_at, page.cancel_until_hours, now) };
}

export function formatBookingWhen(iso: string, timeZone: string): string {
  return new Intl.DateTimeFormat("pt-PT", { timeZone, weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
}

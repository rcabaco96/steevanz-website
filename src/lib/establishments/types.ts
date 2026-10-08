import type { BusinessKind } from "./kinds";

export interface EstablishmentRow {
  id: string;
  owner_id: string;
  slug: string;
  name: string;
  kind: BusinessKind;
  accent_color: string;
  phone: string | null;
  address: string | null;
  time_zone: string;
  created_at: string;
  updated_at: string;
}

export interface ServiceRow {
  id: string;
  establishment_id: string;
  name: string;
  duration_minutes: number;
  buffer_minutes: number;
  price_cents: number | null;
  active: boolean;
  sort: number;
  /** "one": one customer at a time per person or place; "group": several people until it fills (per turn). */
  booking_kind: "one" | "group";
  /** Group: people per turn. */
  capacity: number | null;
  /** Group: the most people in one booking (online). */
  max_party: number;
}

/** Who (or what) does a service. None for a service = every active person or place. */
export interface ServiceStaffRow {
  service_id: string;
  staff_id: string;
}

/** A person's or place's own weekly hours (none = the space's hours). */
export interface StaffHoursRow {
  id: string;
  staff_id: string;
  weekday: number;
  opens: string;
  closes: string;
}

export interface StaffRow {
  id: string;
  establishment_id: string;
  name: string;
  active: boolean;
  sort: number;
}

export interface HoursRow {
  id: string;
  establishment_id: string;
  weekday: number;
  /** "HH:MM:SS" from Postgres. */
  opens: string;
  closes: string;
}

export interface ClosureRow {
  id: string;
  establishment_id: string;
  day: string;
  reason: string | null;
}

/** Everything the modules share about one establishment. */
export interface EstablishmentBundle {
  establishment: EstablishmentRow;
  services: ServiceRow[];
  staff: StaffRow[];
  hours: HoursRow[];
  closures: ClosureRow[];
  serviceStaff: ServiceStaffRow[];
  staffHours: StaffHoursRow[];
}

export const weekdayNames = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"] as const;
/** Monday first, as people read a week in Portugal. */
export const weekdayOrder = [1, 2, 3, 4, 5, 6, 0] as const;

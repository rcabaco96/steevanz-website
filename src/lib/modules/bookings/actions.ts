"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { z } from "zod";
import type { ActionState } from "@/lib/action-state";
import { requestOrigin } from "@/lib/booking/request";
import { parseTimeToMinutes, zonedDateString, zonedDateTimeToUtc } from "@/lib/booking/slots";
import { safeNextPath } from "@/lib/auth/session";
import { accessErrorMessage, requireEstablishmentAccess } from "@/lib/establishments/access";
import { isUuid, loadBundle } from "@/lib/establishments/store";
import type { EstablishmentBundle, EstablishmentRow, ServiceRow } from "@/lib/establishments/types";
import { createServiceClient } from "@/lib/supabase/service";
import { formText, isBot, isModuleRateLimited, phoneFrom, publicToken } from "../common";
import { publicEstablishment } from "../public";
import { canChangeOnline, findBookingSlot, type BookingSlot } from "./availability";
import { sendBookingConfirmation, sendCancellationNotice, sendDelayNotice } from "./notify";
import { businessTemplates } from "./templates";
import { computeDays, ensureBookingPage, getBooking, getBookingByToken, leastBusyFirst, resolveRequest, type BookingStatus, type EstablishmentBookingRow } from "./store";

function refresh(establishment: EstablishmentRow) {
  revalidatePath("/conta", "layout");
  revalidatePath("/admin", "layout");
  revalidatePath(`/reservar/${establishment.slug}`, "layout");
}

const contactSchema = z.object({
  name: z.string().trim().min(1).max(80),
  email: z.union([z.email().max(200), z.literal("")]).transform((email) => email.toLowerCase() || null),
  phone: z.string().trim().max(40).transform((text) => text || null),
  notes: z.string().trim().max(500).transform((text) => text || null),
});

interface BookParams {
  bundle: EstablishmentBundle;
  service: ServiceRow;
  staffCandidates: string[];
  party: number | null;
  slot: BookingSlot;
  contact: z.output<typeof contactSchema>;
  source: "online" | "staff";
  /** The team changing an existing booking (same link for the customer). */
  bookingId?: string;
}

/** Books (or rebooks) a free slot. The database checks again, atomically: "taken" when it filled up. */
async function book(params: BookParams): Promise<EstablishmentBookingRow | "taken"> {
  const shared = {
    p_service: params.service.id,
    p_staff: params.staffCandidates,
    p_party: params.party,
    p_starts: params.slot.start,
    p_ends: params.slot.end,
    p_name: params.contact.name,
    p_email: params.contact.email,
    p_phone: params.contact.phone,
    p_notes: params.contact.notes,
    p_capacity: params.service.booking_kind === "group" ? (params.service.capacity ?? 1) : null,
    p_turn_start: params.slot.turn?.start ?? null,
    p_turn_end: params.slot.turn?.end ?? null,
  };
  const client = createServiceClient();
  const { data, error } = params.bookingId
    ? await client.rpc("establishment_rebook", { p_booking: params.bookingId, ...shared })
    : await client.rpc("establishment_book", { p_establishment: params.bundle.establishment.id, p_token: publicToken(), p_source: params.source, ...shared });
  if (error) {
    if (error.message.includes("slot_taken")) return "taken";
    throw new Error(error.message);
  }
  return data as EstablishmentBookingRow;
}

// --- Public --------------------------------------------------------------------------------------

/**
 * Public: books a slot from the booking page. With `replace_token` (changing an existing booking),
 * the old one is cancelled once the new one is taken.
 */
export async function createBooking(_previous: ActionState, formData: FormData): Promise<ActionState> {
  let target: string | null = null;
  try {
    const establishment = await publicEstablishment(formText(formData, "slug"), "bookings");
    if (!establishment) return { ok: false, message: "As reservas online deste estabelecimento não estão disponíveis." };
    if (isBot(formData)) return { ok: false, message: "Não foi possível reservar." };
    const contact = contactSchema.safeParse({
      name: formText(formData, "name"),
      email: formText(formData, "email"),
      phone: "",
      notes: formText(formData, "notes"),
    });
    if (!contact.success) return { ok: false, message: contact.error.issues[0]?.path[0] === "email" ? "Indique um email válido." : "Indique o seu nome." };
    const typedPhone = phoneFrom(formData);
    if ("error" in typedPhone) return { ok: false, message: typedPhone.error };
    contact.data.phone = typedPhone.phone;
    if (!contact.data.email && !contact.data.phone) return { ok: false, message: "Indique o email ou o telemóvel, para o estabelecimento o poder contactar." };
    const client = createServiceClient();
    if (await isModuleRateLimited(client, "booking_module")) return { ok: false, message: "Demasiados pedidos. Aguarde uns minutos." };

    const [bundle, page] = await Promise.all([loadBundle(establishment), ensureBookingPage(establishment)]);
    if (!page.active) return { ok: false, message: "As reservas online estão fechadas de momento." };
    const replacing = formText(formData, "replace_token") ? await getBookingByToken(formText(formData, "replace_token")) : null;
    if (replacing && (replacing.establishment_id !== establishment.id || replacing.status !== "confirmed" || !canChangeOnline(replacing.starts_at, page.cancel_until_hours, Date.now()))) {
      return { ok: false, message: "Esta reserva já não pode ser alterada online. Contacte o estabelecimento." };
    }

    const request = {
      serviceId: formText(formData, "service") || null,
      staffId: formText(formData, "staff") || null,
      partySize: Number(formText(formData, "party")) || 1,
    };
    const resolved = resolveRequest(bundle, request);
    if ("error" in resolved) return { ok: false, message: "Escolha de novo o serviço ou o número de pessoas." };
    const start = formText(formData, "start");
    const startDay = Number.isNaN(Date.parse(start)) ? null : zonedDateString(new Date(start), establishment.time_zone);
    if (!startDay) return { ok: false, message: "Escolha uma hora." };
    const days = await computeDays(bundle, page, { ...request, from: startDay, days: 1 });
    const slot = findBookingSlot(days, start);
    if (!slot) return { ok: false, message: "Essa hora acabou de ficar ocupada. Escolha outra, por favor." };

    const result = await book({
      bundle,
      service: resolved.service,
      staffCandidates: resolved.service.booking_kind === "one" ? (request.staffId ? slot.staff : await leastBusyFirst(establishment, slot.staff, slot.start)) : [],
      party: resolved.service.booking_kind === "group" ? request.partySize : null,
      slot,
      contact: contact.data,
      source: "online",
    });
    if (result === "taken") return { ok: false, message: "Essa hora acabou de ficar ocupada. Escolha outra, por favor." };
    if (replacing) {
      await client.from("establishment_bookings").update({ status: "cancelled", cancelled_at: new Date().toISOString() }).eq("id", replacing.id);
    }
    const manageUrl = `${await requestOrigin()}/reservar/${establishment.slug}/${result.token}`;
    after(() => sendBookingConfirmation(result, bundle, page, manageUrl, Boolean(replacing)));
    refresh(establishment);
    target = `/reservar/${establishment.slug}/${result.token}?nova=1`;
  } catch (error) {
    console.error("[bookings] create failed:", error instanceof Error ? error.message : error);
    return { ok: false, message: "Não foi possível reservar. Tente novamente." };
  }
  redirect(target);
}

/** Public: the customer cancels from the link in their email (until the page's limit). */
export async function cancelBookingByToken(_previous: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const booking = await getBookingByToken(formText(formData, "token"));
    if (!booking || booking.status !== "confirmed") return { ok: false, message: "Esta reserva já não está ativa." };
    const establishment = await publicEstablishment(formText(formData, "slug"), "bookings");
    if (!establishment || establishment.id !== booking.establishment_id) return { ok: false, message: "Reserva não encontrada." };
    const [bundle, page] = await Promise.all([loadBundle(establishment), ensureBookingPage(establishment)]);
    if (!canChangeOnline(booking.starts_at, page.cancel_until_hours, Date.now())) {
      return { ok: false, message: `Já não é possível cancelar online (até ${page.cancel_until_hours} h antes). Contacte o estabelecimento.` };
    }
    const { error } = await createServiceClient()
      .from("establishment_bookings")
      .update({ status: "cancelled", cancelled_at: new Date().toISOString() })
      .eq("id", booking.id)
      .eq("status", "confirmed");
    if (error) throw new Error(error.message);
    after(() => sendCancellationNotice(booking, bundle, page, true));
    refresh(establishment);
    return { ok: true, message: "Reserva cancelada. Obrigado por avisar!" };
  } catch (error) {
    console.error("[bookings] cancel failed:", error instanceof Error ? error.message : error);
    return { ok: false, message: "Não foi possível cancelar. Tente novamente." };
  }
}

// --- Staff (client area / admin) ---------------------------------------------------------------

async function staffGuard(task: () => Promise<ActionState>): Promise<ActionState> {
  try {
    return await task();
  } catch (error) {
    const denied = accessErrorMessage(error);
    if (denied) return { ok: false, message: denied };
    console.error("[bookings] staff action failed:", error instanceof Error ? error.message : error);
    return { ok: false, message: "Ocorreu um erro. Tente novamente." };
  }
}

const dateSchema = z.iso.date();
const timeSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/);

/**
 * Staff: a booking taken by phone or at the counter, or a change to one (time, people, service,
 * contact). Only free times can be picked (the same rules as the booking page, without the minimum
 * notice); a change never counts the booking against itself and keeps the customer's link.
 */
export async function staffSaveBooking(_previous: ActionState, formData: FormData): Promise<ActionState> {
  let target: string | null = null;
  const outcome = await staffGuard(async () => {
    const { establishment } = await requireEstablishmentAccess(formText(formData, "establishment_id"), "bookings");
    const [bundle, page] = await Promise.all([loadBundle(establishment), ensureBookingPage(establishment)]);
    const editing = formText(formData, "booking_id") ? await getBooking(establishment.id, formText(formData, "booking_id")) : null;
    if (formText(formData, "booking_id") && !editing) return { ok: false, message: "Reserva não encontrada." };
    const contact = contactSchema.safeParse({
      name: formText(formData, "name"),
      email: formText(formData, "email"),
      phone: "",
      notes: formText(formData, "notes"),
    });
    if (!contact.success) return { ok: false, message: "Indique o nome (e um email válido, se o puser)." };
    const typedPhone = phoneFrom(formData);
    if ("error" in typedPhone) return { ok: false, message: typedPhone.error };
    contact.data.phone = typedPhone.phone;
    const request = {
      serviceId: formText(formData, "service") || null,
      staffId: formText(formData, "staff") || null,
      partySize: Number(formText(formData, "party")) || 1,
    };
    const resolved = resolveRequest(bundle, { ...request, forStaff: true });
    if ("error" in resolved) return { ok: false, message: resolved.error === "party" ? "Indique o número de pessoas." : "Escolha o serviço." };
    const start = formText(formData, "start");
    const startDay = Number.isNaN(Date.parse(start)) ? null : zonedDateString(new Date(start), establishment.time_zone);
    if (!startDay || !dateSchema.safeParse(startDay).success) return { ok: false, message: "Escolha uma hora." };
    const days = await computeDays(bundle, page, { ...request, from: startDay, days: 1, excludeId: editing?.id, forStaff: true });
    const slot = findBookingSlot(days, start);
    if (!slot) return { ok: false, message: "Essa hora já não está livre. Escolha outra." };
    const result = await book({
      bundle,
      service: resolved.service,
      staffCandidates: resolved.service.booking_kind === "one" ? (request.staffId ? slot.staff : await leastBusyFirst(establishment, slot.staff, slot.start)) : [],
      party: resolved.service.booking_kind === "group" ? request.partySize : null,
      slot,
      contact: contact.data,
      source: "staff",
      bookingId: editing?.id,
    });
    if (result === "taken") return { ok: false, message: "Essa hora acabou de ficar ocupada. Escolha outra." };
    if (formData.get("send_confirmation") === "on" && result.email) {
      const manageUrl = `${await requestOrigin()}/reservar/${establishment.slug}/${result.token}`;
      after(() => sendBookingConfirmation(result, bundle, { ...page, notify_owner: false }, manageUrl, Boolean(editing)));
    }
    refresh(establishment);
    target = safeNextPath(formText(formData, "back"), "") || null;
    return { ok: true, message: editing ? "Reserva alterada." : `Reserva de ${result.name} guardada.` };
  });
  if (outcome?.ok && target) redirect(target);
  return outcome;
}

const statuses: BookingStatus[] = ["confirmed", "arrived", "no_show", "cancelled"];

export async function setBookingStatus(_previous: ActionState, formData: FormData): Promise<ActionState> {
  return staffGuard(async () => {
    const { establishment } = await requireEstablishmentAccess(formText(formData, "establishment_id"), "bookings");
    const status = formText(formData, "status") as BookingStatus;
    if (!statuses.includes(status)) return { ok: false, message: "Pedido inválido." };
    const booking = await getBooking(establishment.id, formText(formData, "booking_id"));
    if (!booking) return { ok: false, message: "Reserva não encontrada." };
    const { error } = await createServiceClient()
      .from("establishment_bookings")
      .update({ status, cancelled_at: status === "cancelled" ? new Date().toISOString() : null })
      .eq("id", booking.id);
    if (error) throw new Error(error.message);
    if (status === "cancelled" && booking.status !== "cancelled" && formData.get("notify") === "on") {
      const [bundle, page] = await Promise.all([loadBundle(establishment), ensureBookingPage(establishment)]);
      after(() => sendCancellationNotice(booking, bundle, page, false));
    }
    refresh(establishment);
    return { ok: true, message: "Reserva atualizada." };
  });
}

export async function addBlock(_previous: ActionState, formData: FormData): Promise<ActionState> {
  return staffGuard(async () => {
    const { establishment } = await requireEstablishmentAccess(formText(formData, "establishment_id"), "bookings");
    const date = formText(formData, "date");
    const from = formText(formData, "from");
    const to = formText(formData, "to");
    if (!dateSchema.safeParse(date).success || !timeSchema.safeParse(from).success || !timeSchema.safeParse(to).success || to <= from) {
      return { ok: false, message: "Indique o dia e o período (fim depois do início)." };
    }
    const staff = formText(formData, "staff");
    const { error } = await createServiceClient()
      .from("booking_blocks")
      .insert({
        establishment_id: establishment.id,
        staff_id: isUuid(staff) ? staff : null,
        starts_at: zonedDateTimeToUtc(date, parseTimeToMinutes(from), establishment.time_zone).toISOString(),
        ends_at: zonedDateTimeToUtc(date, parseTimeToMinutes(to), establishment.time_zone).toISOString(),
        reason: formText(formData, "reason").slice(0, 120) || null,
      });
    if (error) throw new Error(error.message);
    refresh(establishment);
    return { ok: true, message: "Horário bloqueado." };
  });
}

export async function removeBlock(_previous: ActionState, formData: FormData): Promise<ActionState> {
  return staffGuard(async () => {
    const { establishment } = await requireEstablishmentAccess(formText(formData, "establishment_id"), "bookings");
    const id = formText(formData, "block_id");
    if (!isUuid(id)) return { ok: false, message: "Pedido inválido." };
    const { error } = await createServiceClient().from("booking_blocks").delete().eq("id", id).eq("establishment_id", establishment.id);
    if (error) throw new Error(error.message);
    refresh(establishment);
    return { ok: true, message: "Bloqueio removido." };
  });
}

const pageSchema = z.object({
  active: z.boolean(),
  min_notice_minutes: z.coerce.number().int().min(0).max(20160),
  max_days_ahead: z.coerce.number().int().min(1).max(365),
  last_booking_minutes: z.coerce.number().int().min(0).max(240),
  seats_per_slot: z.coerce.number().int().min(1).max(1000),
  max_party: z.coerce.number().int().min(1).max(100),
  cancel_until_hours: z.coerce.number().int().min(0).max(336),
  policy: z.string().trim().max(600).transform((text) => text || null),
  confirmation_note: z.string().trim().max(300).transform((text) => text || null),
  notify_owner: z.boolean(),
  late_grace_minutes: z.coerce.number().int().min(0).max(60),
});

export async function saveBookingPage(_previous: ActionState, formData: FormData): Promise<ActionState> {
  return staffGuard(async () => {
    const { establishment } = await requireEstablishmentAccess(formText(formData, "establishment_id"), "bookings");
    const parsed = pageSchema.safeParse({
      active: formData.get("active") === "on",
      min_notice_minutes: formText(formData, "min_notice_minutes"),
      max_days_ahead: formText(formData, "max_days_ahead"),
      last_booking_minutes: formText(formData, "last_booking_minutes") || "60",
      seats_per_slot: formText(formData, "seats_per_slot"),
      max_party: formText(formData, "max_party"),
      cancel_until_hours: formText(formData, "cancel_until_hours"),
      policy: formText(formData, "policy"),
      confirmation_note: formText(formData, "confirmation_note"),
      notify_owner: formData.get("notify_owner") === "on",
      late_grace_minutes: formText(formData, "late_grace_minutes") || "10",
    });
    if (!parsed.success) return { ok: false, message: "Verifique os valores das definições." };
    await ensureBookingPage(establishment);
    const { error } = await createServiceClient().from("booking_pages").update(parsed.data).eq("establishment_id", establishment.id);
    if (error) throw new Error(error.message);
    refresh(establishment);
    return { ok: true, message: parsed.data.active ? "Definições guardadas. A página de reservas está aberta." : "Definições guardadas. A página de reservas está fechada." };
  });
}

/** New private calendar address (the old one stops working). */
export async function rotateCalendarToken(_previous: ActionState, formData: FormData): Promise<ActionState> {
  return staffGuard(async () => {
    const { establishment } = await requireEstablishmentAccess(formText(formData, "establishment_id"), "bookings");
    await ensureBookingPage(establishment);
    const { error } = await createServiceClient().from("booking_pages").update({ calendar_token: publicToken().replace(/[-_]/g, "") }).eq("establishment_id", establishment.id);
    if (error) throw new Error(error.message);
    refresh(establishment);
    return { ok: true, message: "Endereço do calendário renovado. Volte a subscrevê-lo no seu calendário." };
  });
}

/** Customers of the next hours hear about a delay (by email); later ones see it on their booking page. */
const delayNoticeHours = 3;

/**
 * "Estamos com atraso" for today, for the whole space or one professional. Nothing moves: the
 * customers of the next hours are told the expected time, once per increase (from 10 minutes).
 */
export async function setBookingDelay(_previous: ActionState, formData: FormData): Promise<ActionState> {
  return staffGuard(async () => {
    const { establishment } = await requireEstablishmentAccess(formText(formData, "establishment_id"), "bookings");
    const minutes = Number(formText(formData, "minutes"));
    if (!Number.isInteger(minutes) || minutes < 0 || minutes > 180) return { ok: false, message: "Pedido inválido." };
    const staff = formText(formData, "staff_id");
    const staffId = isUuid(staff) ? staff : null;
    const day = zonedDateString(new Date(), establishment.time_zone);
    const client = createServiceClient();
    let existing = client.from("booking_delays").select("id").eq("establishment_id", establishment.id).eq("day", day);
    existing = staffId ? existing.eq("staff_id", staffId) : existing.is("staff_id", null);
    const { data: found, error: findError } = await existing.maybeSingle<{ id: string }>();
    if (findError) throw new Error(findError.message);
    const { error } = found
      ? await client.from("booking_delays").update({ minutes, updated_at: new Date().toISOString() }).eq("id", found.id)
      : await client.from("booking_delays").insert({ establishment_id: establishment.id, staff_id: staffId, day, minutes });
    if (error) throw new Error(error.message);

    let told = 0;
    if (minutes >= 10) {
      const now = Date.now();
      let query = client
        .from("establishment_bookings")
        .select("*")
        .eq("establishment_id", establishment.id)
        .eq("status", "confirmed")
        .not("email", "is", null)
        .lt("delay_notified_minutes", minutes)
        .gte("starts_at", new Date(now).toISOString())
        .lte("starts_at", new Date(now + delayNoticeHours * 3_600_000).toISOString());
      if (staffId) query = query.eq("staff_id", staffId);
      const { data, error: listError } = await query.limit(50);
      if (listError) throw new Error(listError.message);
      const affected = (data ?? []) as EstablishmentBookingRow[];
      if (affected.length) {
        const bundle = await loadBundle(establishment);
        const origin = await requestOrigin();
        await client.from("establishment_bookings").update({ delay_notified_minutes: minutes }).in("id", affected.map((booking) => booking.id));
        after(async () => {
          for (const booking of affected) await sendDelayNotice(booking, bundle, minutes, `${origin}/reservar/${establishment.slug}/${booking.token}`);
        });
        told = affected.length;
      }
    }
    refresh(establishment);
    if (!minutes) return { ok: true, message: "Sem atraso." };
    return { ok: true, message: told ? `Atraso de ${minutes} min. Avisámos ${told} ${told === 1 ? "cliente" : "clientes"} por email.` : `Atraso de ${minutes} min registado.` };
  });
}

/**
 * Starts the services from an example business (restaurant, barbershop…): its usual services and,
 * for sports, the pitches each one uses. Existing services stay; names already there are skipped.
 */
export async function applyBusinessTemplate(_previous: ActionState, formData: FormData): Promise<ActionState> {
  return staffGuard(async () => {
    const { establishment } = await requireEstablishmentAccess(formText(formData, "establishment_id"), "bookings");
    const template = businessTemplates.find((item) => item.id === formText(formData, "template"));
    if (!template) return { ok: false, message: "Escolha um exemplo." };
    const client = createServiceClient();
    const bundle = await loadBundle(establishment);
    const places = new Map(bundle.staff.map((item) => [item.name, item.id]));
    for (const [index, name] of (template.places ?? []).entries()) {
      if (places.has(name)) continue;
      const { data, error } = await client.from("establishment_staff").insert({ establishment_id: establishment.id, name, active: true, sort: index }).select("id").single<{ id: string }>();
      if (error) throw new Error(error.message);
      places.set(name, data.id);
    }
    const existing = new Set(bundle.services.map((item) => item.name.toLowerCase()));
    let added = 0;
    for (const [index, service] of template.services.entries()) {
      if (existing.has(service.name.toLowerCase())) continue;
      const { data, error } = await client
        .from("establishment_services")
        .insert({
          establishment_id: establishment.id,
          name: service.name,
          duration_minutes: service.duration_minutes,
          buffer_minutes: 0,
          booking_kind: service.booking_kind,
          capacity: service.booking_kind === "group" ? (service.capacity ?? 40) : null,
          max_party: service.max_party ?? 8,
          active: true,
          sort: index,
        })
        .select("id")
        .single<{ id: string }>();
      if (error) throw new Error(error.message);
      const staffIds = (service.places ?? []).map((name) => places.get(name)).filter((id): id is string => Boolean(id));
      if (staffIds.length) {
        const { error: linkError } = await client.from("establishment_service_staff").insert(staffIds.map((staffId) => ({ service_id: data.id, staff_id: staffId })));
        if (linkError) throw new Error(linkError.message);
      }
      added++;
    }
    refresh(establishment);
    return { ok: true, message: added ? `${added} ${added === 1 ? "serviço criado" : "serviços criados"}. Ajuste os nomes, tempos e preços.` : "Esses serviços já existem." };
  });
}

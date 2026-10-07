"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { z } from "zod";
import type { ActionState } from "@/lib/action-state";
import { requestOrigin } from "@/lib/booking/request";
import { zonedDateString, zonedDateTimeToUtc, parseTimeToMinutes } from "@/lib/booking/slots";
import { accessErrorMessage, requireEstablishmentAccess } from "@/lib/establishments/access";
import { isUuid, loadBundle } from "@/lib/establishments/store";
import type { EstablishmentBundle, EstablishmentRow } from "@/lib/establishments/types";
import { createServiceClient } from "@/lib/supabase/service";
import { formText, isBot, isModuleRateLimited, publicToken } from "../common";
import { publicEstablishment } from "../public";
import { canChangeOnline, findBookingSlot } from "./availability";
import { sendBookingConfirmation, sendCancellationNotice } from "./notify";
import { computeDays, ensureBookingPage, getBooking, getBookingByToken, resolveRequest, type BookingPageRow, type BookingStatus, type EstablishmentBookingRow } from "./store";

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
  page: BookingPageRow;
  serviceId: string | null;
  staffCandidates: string[];
  party: number | null;
  start: Date;
  end: Date;
  contact: z.output<typeof contactSchema>;
  source: "online" | "staff";
}

async function book(params: BookParams): Promise<EstablishmentBookingRow | "taken"> {
  const { data, error } = await createServiceClient().rpc("establishment_book", {
    p_establishment: params.bundle.establishment.id,
    p_token: publicToken(),
    p_service: params.serviceId,
    p_staff: params.staffCandidates,
    p_party: params.party,
    p_starts: params.start.toISOString(),
    p_ends: params.end.toISOString(),
    p_name: params.contact.name,
    p_email: params.contact.email,
    p_phone: params.contact.phone,
    p_notes: params.contact.notes,
    p_source: params.source,
    p_capacity: params.page.mode === "table" ? params.page.seats_per_slot : null,
  });
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
      phone: formText(formData, "phone"),
      notes: formText(formData, "notes"),
    });
    if (!contact.success) return { ok: false, message: contact.error.issues[0]?.path[0] === "email" ? "Indique um email válido." : "Indique o seu nome." };
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
    const resolved = resolveRequest(bundle, page, request);
    if ("error" in resolved) return { ok: false, message: "Escolha de novo o serviço ou o número de pessoas." };
    const start = formText(formData, "start");
    const startDay = Number.isNaN(Date.parse(start)) ? null : zonedDateString(new Date(start), establishment.time_zone);
    if (!startDay) return { ok: false, message: "Escolha uma hora." };
    const days = await computeDays(bundle, page, { ...request, from: startDay, days: 1 });
    const slot = findBookingSlot(days, start);
    if (!slot) return { ok: false, message: "Essa hora acabou de ficar ocupada. Escolha outra, por favor." };

    const result = await book({
      bundle,
      page,
      serviceId: resolved.service?.id ?? null,
      staffCandidates: page.mode === "service" ? slot.staff : [],
      party: page.mode === "table" ? request.partySize : null,
      start: new Date(slot.start),
      end: new Date(slot.end),
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
 * Staff: a booking taken by phone or at the counter. Opening hours are not enforced (the team
 * decides), but a professional can't be double-booked and table capacity still applies.
 */
export async function staffCreateBooking(_previous: ActionState, formData: FormData): Promise<ActionState> {
  return staffGuard(async () => {
    const { establishment } = await requireEstablishmentAccess(formText(formData, "establishment_id"), "bookings");
    const [bundle, page] = await Promise.all([loadBundle(establishment), ensureBookingPage(establishment)]);
    const date = formText(formData, "date");
    const time = formText(formData, "time");
    if (!dateSchema.safeParse(date).success || !timeSchema.safeParse(time).success) return { ok: false, message: "Indique o dia e a hora." };
    const contact = contactSchema.safeParse({
      name: formText(formData, "name"),
      email: formText(formData, "email"),
      phone: formText(formData, "phone"),
      notes: formText(formData, "notes"),
    });
    if (!contact.success) return { ok: false, message: "Indique o nome (e um email válido, se o puser)." };
    const start = zonedDateTimeToUtc(date, parseTimeToMinutes(time), establishment.time_zone);
    let minutes = page.table_minutes;
    let serviceId: string | null = null;
    let candidates: string[] = [];
    let party: number | null = null;
    if (page.mode === "service") {
      const service = bundle.services.find((item) => item.id === formText(formData, "service"));
      if (!service) return { ok: false, message: "Escolha o serviço." };
      serviceId = service.id;
      minutes = service.duration_minutes + service.buffer_minutes;
      const chosen = formText(formData, "staff");
      const active = bundle.staff.filter((item) => item.active).map((item) => item.id);
      candidates = chosen && isUuid(chosen) ? [chosen] : active;
    } else {
      party = Number(formText(formData, "party"));
      if (!Number.isInteger(party) || party < 1 || party > 1000) return { ok: false, message: "Indique o número de pessoas." };
    }
    const result = await book({
      bundle,
      page,
      serviceId,
      staffCandidates: candidates,
      party,
      start,
      end: new Date(start.getTime() + minutes * 60_000),
      contact: contact.data,
      source: "staff",
    });
    if (result === "taken") {
      return { ok: false, message: page.mode === "table" ? "Não há lugares suficientes para essa hora." : "Esse profissional (ou a agenda) já está ocupado a essa hora." };
    }
    if (formData.get("send_confirmation") === "on" && result.email) {
      const manageUrl = `${await requestOrigin()}/reservar/${establishment.slug}/${result.token}`;
      after(() => sendBookingConfirmation(result, bundle, { ...page, notify_owner: false }, manageUrl, false));
    }
    refresh(establishment);
    return { ok: true, message: `Reserva de ${result.name} guardada.` };
  });
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
  mode: z.enum(["table", "service"]),
  slot_interval_minutes: z.coerce.number().int().min(5).max(120),
  min_notice_minutes: z.coerce.number().int().min(0).max(20160),
  max_days_ahead: z.coerce.number().int().min(1).max(365),
  table_minutes: z.coerce.number().int().min(15).max(480),
  seats_per_slot: z.coerce.number().int().min(1).max(1000),
  max_party: z.coerce.number().int().min(1).max(100),
  cancel_until_hours: z.coerce.number().int().min(0).max(336),
  policy: z.string().trim().max(600).transform((text) => text || null),
  confirmation_note: z.string().trim().max(300).transform((text) => text || null),
  notify_owner: z.boolean(),
});

export async function saveBookingPage(_previous: ActionState, formData: FormData): Promise<ActionState> {
  return staffGuard(async () => {
    const { establishment } = await requireEstablishmentAccess(formText(formData, "establishment_id"), "bookings");
    const parsed = pageSchema.safeParse({
      active: formData.get("active") === "on",
      mode: formText(formData, "mode"),
      slot_interval_minutes: formText(formData, "slot_interval_minutes"),
      min_notice_minutes: Math.round(Number(formText(formData, "min_notice_hours").replace(",", ".")) * 60),
      max_days_ahead: formText(formData, "max_days_ahead"),
      table_minutes: formText(formData, "table_minutes"),
      seats_per_slot: formText(formData, "seats_per_slot"),
      max_party: formText(formData, "max_party"),
      cancel_until_hours: formText(formData, "cancel_until_hours"),
      policy: formText(formData, "policy"),
      confirmation_note: formText(formData, "confirmation_note"),
      notify_owner: formData.get("notify_owner") === "on",
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

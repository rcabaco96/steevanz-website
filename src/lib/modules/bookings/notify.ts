import { sendOwnerEmail } from "@/lib/booking/email";
import { googleCalendarUrl } from "@/lib/booking/ics";
import type { EstablishmentBundle } from "@/lib/establishments/types";
import { createServiceClient } from "@/lib/supabase/service";
import { formatBookingWhen, toleranceText, type BookingPageRow, type EstablishmentBookingRow } from "./store";

/** "Corte · Rui" / "Futebol (1 hora) · Campo de futebol 2" / "Mesa para 4 pessoas". */
export function bookingSummary(booking: EstablishmentBookingRow, bundle: EstablishmentBundle): string {
  const service = booking.service_id ? bundle.services.find((item) => item.id === booking.service_id) : null;
  const staff = booking.staff_id ? bundle.staff.find((item) => item.id === booking.staff_id) : null;
  const people = booking.party_size ? `${booking.party_size} ${booking.party_size === 1 ? "pessoa" : "pessoas"}` : null;
  if (service && people) return `${service.name} para ${people}`;
  if (service) return `${service.name}${staff ? ` · ${staff.name}` : ""}`;
  return people ? `Reserva para ${people}` : "Reserva";
}

export function calendarEvent(booking: EstablishmentBookingRow, bundle: EstablishmentBundle) {
  const { establishment } = bundle;
  return {
    uid: `reserva-${booking.id}`,
    start: booking.starts_at,
    end: booking.ends_at,
    title: `${bookingSummary(booking, bundle)} · ${establishment.name}`,
    description: [establishment.address, establishment.phone].filter(Boolean).join(" · "),
  };
}

async function ownerEmail(ownerId: string): Promise<string | null> {
  const { data } = await createServiceClient().from("profiles").select("email").eq("id", ownerId).maybeSingle<{ email: string }>();
  return data?.email ?? null;
}

export async function sendBookingConfirmation(booking: EstablishmentBookingRow, bundle: EstablishmentBundle, page: BookingPageRow, manageUrl: string, changed: boolean) {
  const { establishment } = bundle;
  const when = formatBookingWhen(booking.starts_at, establishment.time_zone);
  const summary = bookingSummary(booking, bundle);
  const tasks: Promise<unknown>[] = [];
  if (booking.email) {
    tasks.push(
      sendOwnerEmail({
        to: [booking.email],
        subject: `${changed ? "Reserva alterada" : "Reserva confirmada"}: ${establishment.name}, ${when}`,
        heading: changed ? "A sua reserva foi alterada" : "A sua reserva está confirmada",
        rows: [
          { label: "Onde", value: [establishment.name, establishment.address].filter(Boolean).join(", ") },
          { label: "Quando", value: when },
          { label: "O quê", value: summary },
          { label: "Nota", value: page.confirmation_note },
          { label: "Atrasos", value: toleranceText(page) },
          { label: "Calendário", value: googleCalendarUrl(calendarEvent(booking, bundle)) },
          { label: "Política", value: page.policy },
          { label: "Contacto", value: establishment.phone },
        ],
        adminUrl: manageUrl,
        linkLabel: "Ver, alterar ou cancelar",
      }),
    );
  }
  if (page.notify_owner) {
    const to = await ownerEmail(establishment.owner_id);
    if (to) {
      tasks.push(
        sendOwnerEmail({
          to: [to],
          subject: `${changed ? "Reserva alterada" : "Nova reserva"}: ${booking.name}, ${when}`,
          heading: `${changed ? "Reserva alterada" : "Nova reserva"} em ${establishment.name}`,
          rows: [
            { label: "Quando", value: when },
            { label: "O quê", value: summary },
            { label: "Nome", value: booking.name },
            { label: "Email", value: booking.email },
            { label: "Telefone", value: booking.phone },
            { label: "Notas", value: booking.notes },
          ],
          replyTo: booking.email ?? undefined,
        }),
      );
    }
  }
  await Promise.all(tasks);
}

export async function sendCancellationNotice(booking: EstablishmentBookingRow, bundle: EstablishmentBundle, page: BookingPageRow, byCustomer: boolean) {
  const { establishment } = bundle;
  const when = formatBookingWhen(booking.starts_at, establishment.time_zone);
  const tasks: Promise<unknown>[] = [];
  if (booking.email && !byCustomer) {
    tasks.push(
      sendOwnerEmail({
        to: [booking.email],
        subject: `Reserva cancelada: ${establishment.name}, ${when}`,
        heading: "A sua reserva foi cancelada",
        rows: [
          { label: "Onde", value: establishment.name },
          { label: "Quando", value: when },
          { label: "Contacto", value: establishment.phone },
        ],
      }),
    );
  }
  if (byCustomer && page.notify_owner) {
    const to = await ownerEmail(establishment.owner_id);
    if (to) {
      tasks.push(
        sendOwnerEmail({
          to: [to],
          subject: `Reserva cancelada pelo cliente: ${booking.name}, ${when}`,
          heading: `Reserva cancelada em ${establishment.name}`,
          rows: [
            { label: "Quando", value: when },
            { label: "O quê", value: bookingSummary(booking, bundle) },
            { label: "Nome", value: booking.name },
          ],
        }),
      );
    }
  }
  await Promise.all(tasks);
}

/** "Estamos com atraso": the expected time, so the customer doesn't arrive early and wait. */
export async function sendDelayNotice(booking: EstablishmentBookingRow, bundle: EstablishmentBundle, minutes: number, manageUrl: string): Promise<boolean> {
  if (!booking.email) return false;
  const { establishment } = bundle;
  const expected = new Intl.DateTimeFormat("pt-PT", { timeZone: establishment.time_zone, hour: "2-digit", minute: "2-digit" }).format(new Date(Date.parse(booking.starts_at) + minutes * 60_000));
  return sendOwnerEmail({
    to: [booking.email],
    subject: `${establishment.name}: estamos com cerca de ${minutes} min de atraso`,
    heading: `Estamos com cerca de ${minutes} minutos de atraso`,
    rows: [
      { label: "A sua reserva", value: `${formatBookingWhen(booking.starts_at, establishment.time_zone)} · ${bookingSummary(booking, bundle)}` },
      { label: "Hora prevista", value: `cerca das ${expected}` },
      { label: "Contacto", value: establishment.phone },
    ],
    adminUrl: manageUrl,
    linkLabel: "Ver a reserva",
  });
}

export async function sendReminder(booking: EstablishmentBookingRow, bundle: EstablishmentBundle, manageUrl: string): Promise<boolean> {
  if (!booking.email) return false;
  const { establishment } = bundle;
  const when = formatBookingWhen(booking.starts_at, establishment.time_zone);
  return sendOwnerEmail({
    to: [booking.email],
    subject: `Lembrete: ${establishment.name}, ${when}`,
    heading: "Lembrete da sua reserva",
    rows: [
      { label: "Onde", value: [establishment.name, establishment.address].filter(Boolean).join(", ") },
      { label: "Quando", value: when },
      { label: "O quê", value: bookingSummary(booking, bundle) },
      { label: "Não pode ir?", value: "Cancele ou mude a hora pelo botão abaixo: assim o lugar fica livre para outra pessoa." },
    ],
    adminUrl: manageUrl,
    linkLabel: "Alterar ou cancelar",
  });
}

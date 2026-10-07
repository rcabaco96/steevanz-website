import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CancelBookingForm } from "@/components/public/bookings/CancelBookingForm";
import { BrandFrame, PublicCard, brandButton, brandSecondaryButton } from "@/components/public/BrandFrame";
import { googleCalendarUrl } from "@/lib/booking/ics";
import { loadBundle } from "@/lib/establishments/store";
import { bookingSummary, calendarEvent } from "@/lib/modules/bookings/notify";
import { bookingChangeState, bookingStatusLabels, ensureBookingPage, formatBookingWhen, getBookingByToken } from "@/lib/modules/bookings/store";
import { publicEstablishment } from "@/lib/modules/public";

type Props = { params: Promise<{ slug: string; token: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

export const metadata: Metadata = { title: "A sua reserva", referrer: "no-referrer" };

export default async function BookingManagePage({ params, searchParams }: Props) {
  const { slug, token } = await params;
  const isNew = (await searchParams).nova === "1";
  const establishment = await publicEstablishment(slug, "bookings");
  if (!establishment) notFound();
  const booking = await getBookingByToken(token);
  if (!booking || booking.establishment_id !== establishment.id) notFound();
  const [bundle, page] = await Promise.all([loadBundle(establishment), ensureBookingPage(establishment)]);
  const { active, changeable } = bookingChangeState(booking, page);

  return (
    <BrandFrame establishment={establishment} eyebrow="A sua reserva">
      {isNew && active ? (
        <section role="status" className="flex flex-col items-center gap-1 rounded-[var(--radius-card)] bg-[var(--brand)] px-5 py-6 text-center text-[var(--brand-text)]">
          <p className="display text-3xl">Reserva confirmada!</p>
          <p className="text-sm opacity-90">{booking.email ? `Enviámos os detalhes para ${booking.email}.` : "Guarde esta página: é a sua reserva."}</p>
        </section>
      ) : null}
      <PublicCard>
        <div className="flex items-start justify-between gap-3">
          <p className="text-xs font-semibold tracking-[0.12em] text-subtle uppercase">Reserva</p>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              booking.status === "cancelled" ? "bg-danger-soft text-danger" : booking.status === "confirmed" ? "bg-success-soft text-success" : "bg-surface-2 text-muted"
            }`}
          >
            {bookingStatusLabels[booking.status]}
          </span>
        </div>
        <p className="display text-2xl leading-tight first-letter:uppercase">{formatBookingWhen(booking.starts_at, establishment.time_zone)}</p>
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
          <dt className="text-subtle">O quê</dt>
          <dd className="text-text">{bookingSummary(booking, bundle)}</dd>
          <dt className="text-subtle">Nome</dt>
          <dd className="text-text">{booking.name}</dd>
          {establishment.address ? (
            <>
              <dt className="text-subtle">Onde</dt>
              <dd className="text-text">{establishment.address}</dd>
            </>
          ) : null}
          {booking.notes ? (
            <>
              <dt className="text-subtle">Notas</dt>
              <dd className="text-text">{booking.notes}</dd>
            </>
          ) : null}
        </dl>
        {page.confirmation_note && active ? <p className="rounded-xl bg-surface-2/70 px-3 py-2 text-sm text-text">{page.confirmation_note}</p> : null}
        {active ? (
          <div className="grid grid-cols-2 gap-2">
            <a href={googleCalendarUrl(calendarEvent(booking, bundle))} target="_blank" rel="noopener" className={`${brandSecondaryButton} !min-h-11 text-sm`}>
              Google Calendar
            </a>
            <a href={`/reservar/${establishment.slug}/${booking.token}/calendario.ics`} className={`${brandSecondaryButton} !min-h-11 text-sm`}>
              Outro calendário
            </a>
          </div>
        ) : null}
      </PublicCard>

      {changeable ? (
        <PublicCard>
          <h2 className="text-lg font-semibold text-text">Precisa de mudar?</h2>
          <Link href={`/reservar/${establishment.slug}?alterar=${booking.token}`} className={brandButton}>
            Escolher outra hora
          </Link>
          <CancelBookingForm slug={establishment.slug} token={booking.token} />
          {page.policy ? <p className="text-xs text-muted">{page.policy}</p> : null}
        </PublicCard>
      ) : active ? (
        <p className="px-2 text-center text-sm text-muted">
          Já não é possível alterar online (até {page.cancel_until_hours} h antes).{establishment.phone ? ` Ligue para o ${establishment.phone}.` : ""}
        </p>
      ) : (
        <Link href={`/reservar/${establishment.slug}`} className={brandButton}>
          Fazer nova reserva
        </Link>
      )}
    </BrandFrame>
  );
}

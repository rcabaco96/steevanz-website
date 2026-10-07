import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CancelBookingForm } from "@/components/public/bookings/CancelBookingForm";
import { BrandFrame, PublicCard, brandButton, brandSecondaryButton } from "@/components/public/BrandFrame";
import { googleCalendarUrl } from "@/lib/booking/ics";
import { loadBundle } from "@/lib/establishments/store";
import { bookingSummary, calendarEvent } from "@/lib/modules/bookings/notify";
import { bookingChangeState, ensureBookingPage, getBookingByToken } from "@/lib/modules/bookings/store";
import { publicEstablishment } from "@/lib/modules/public";

type Props = { params: Promise<{ slug: string; token: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

export const metadata: Metadata = { title: "A sua reserva", referrer: "no-referrer" };

const statusChip = {
  confirmed: "Confirmada",
  arrived: "Concluída",
  no_show: "Não compareceu",
  cancelled: "Cancelada",
} as const;

export default async function BookingManagePage({ params, searchParams }: Props) {
  const { slug, token } = await params;
  const isNew = (await searchParams).nova === "1";
  const establishment = await publicEstablishment(slug, "bookings");
  if (!establishment) notFound();
  const booking = await getBookingByToken(token);
  if (!booking || booking.establishment_id !== establishment.id) notFound();
  const [bundle, page] = await Promise.all([loadBundle(establishment), ensureBookingPage(establishment)]);
  const { active, changeable } = bookingChangeState(booking, page);
  const tz = establishment.time_zone;
  const start = new Date(booking.starts_at);
  const weekday = new Intl.DateTimeFormat("pt-PT", { timeZone: tz, weekday: "long" }).format(start);
  const date = new Intl.DateTimeFormat("pt-PT", { timeZone: tz, day: "numeric", month: "long" }).format(start);
  const time = new Intl.DateTimeFormat("pt-PT", { timeZone: tz, hour: "2-digit", minute: "2-digit" }).format(start);
  const cancelled = booking.status === "cancelled";

  return (
    <BrandFrame establishment={establishment} service="A sua reserva">
      {isNew && active ? (
        <div role="status" className="flex flex-col gap-1 text-center">
          <h2 className="display text-[2rem] leading-tight">Está reservado.</h2>
          <p className="text-muted">{booking.email ? `Enviámos a confirmação para ${booking.email}.` : "Guarde esta página: é a sua reserva."}</p>
        </div>
      ) : null}

      <article className={`ticket overflow-hidden ${cancelled ? "opacity-75" : ""}`}>
        <div className="bg-[var(--brand)] px-6 pt-5 pb-6 text-[var(--brand-text)]">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm opacity-85 first-letter:uppercase">{weekday}</span>
            <span className="rounded-full bg-black/15 px-3 py-1 text-sm font-semibold">{statusChip[booking.status]}</span>
          </div>
          <p className={`display mt-1 text-[4.2rem] leading-[0.95] tabular-nums ${cancelled ? "line-through decoration-2" : ""}`}>{time}</p>
          <p className="display text-[1.6rem] leading-tight">{date}</p>
        </div>
        <div className="ticket-tear" />
        <dl className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 px-6 pt-5 pb-6 text-base">
          <dt className="text-muted">Reserva</dt>
          <dd className="font-semibold text-text">{bookingSummary(booking, bundle)}</dd>
          <dt className="text-muted">Nome</dt>
          <dd className="text-text">{booking.name}</dd>
          {establishment.address ? (
            <>
              <dt className="text-muted">Onde</dt>
              <dd className="text-text">{establishment.address}</dd>
            </>
          ) : null}
          {booking.notes ? (
            <>
              <dt className="text-muted">Notas</dt>
              <dd className="text-text">{booking.notes}</dd>
            </>
          ) : null}
        </dl>
        {page.confirmation_note && active ? <p className="mx-6 mb-6 rounded-2xl bg-surface-2/70 px-4 py-3 text-sm text-text">{page.confirmation_note}</p> : null}
      </article>

      {active ? (
        <div className="grid grid-cols-2 gap-2">
          <a href={googleCalendarUrl(calendarEvent(booking, bundle))} target="_blank" rel="noopener" className={`${brandSecondaryButton} text-sm`}>
            Google Calendar
          </a>
          <a href={`/reservar/${establishment.slug}/${booking.token}/calendario.ics`} className={`${brandSecondaryButton} text-sm`}>
            Outro calendário
          </a>
        </div>
      ) : null}

      {changeable ? (
        <PublicCard>
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold text-text">Precisa de mudar?</h2>
            <p className="text-muted">Pode trocar a hora ou cancelar até {page.cancel_until_hours} h antes. O lugar fica livre para outra pessoa.</p>
          </div>
          <Link href={`/reservar/${establishment.slug}?alterar=${booking.token}`} className={brandButton}>
            Escolher outra hora
          </Link>
          <CancelBookingForm slug={establishment.slug} token={booking.token} />
          {page.policy ? <p className="text-sm text-muted">{page.policy}</p> : null}
        </PublicCard>
      ) : active ? (
        <p className="px-4 text-center text-muted">
          Já não é possível alterar online (até {page.cancel_until_hours} h antes).{establishment.phone ? ` Ligue para ${establishment.phone}.` : ""}
        </p>
      ) : (
        <Link href={`/reservar/${establishment.slug}`} className={brandButton}>
          Fazer nova reserva
        </Link>
      )}
    </BrandFrame>
  );
}

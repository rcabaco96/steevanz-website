import type { ReactNode } from "react";
import { ActionForm, SubmitButton } from "@/components/backoffice/ActionForm";
import { Panel } from "@/components/backoffice/ui";
import type { EstablishmentBundle } from "@/lib/establishments/types";
import { setBookingStatus } from "@/lib/modules/bookings/actions";
import { bookingSummary } from "@/lib/modules/bookings/notify";
import { delayFor, toleranceText, type BookingDelayRow, type BookingPageRow, type EstablishmentBookingRow } from "@/lib/modules/bookings/store";
import { DelayControl, NewBookingForm } from "../bookings/BookingsModule";
import { More } from "./More";

function StatusAction({
  booking,
  establishmentId,
  status,
  children,
  variant,
  size = "sm",
  className = "",
  confirmMessage,
}: {
  booking: EstablishmentBookingRow;
  establishmentId: string;
  status: EstablishmentBookingRow["status"];
  children: ReactNode;
  variant: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
  className?: string;
  confirmMessage?: string;
}) {
  return (
    <ActionForm action={setBookingStatus} hideMessage className="contents" confirmMessage={confirmMessage}>
      <input type="hidden" name="establishment_id" value={establishmentId} />
      <input type="hidden" name="booking_id" value={booking.id} />
      <input type="hidden" name="status" value={status} />
      <SubmitButton size={size} variant={variant} className={className}>
        {children}
      </SubmitButton>
    </ActionForm>
  );
}

const doneLabel: Record<EstablishmentBookingRow["status"], string> = { confirmed: "", arrived: "Chegou", no_show: "Não veio", cancelled: "Cancelada" };

/**
 * Today's bookings for the team (the Balcão): who is next, the rest of the day in order with
 * "Chegou", the late ones flagged, "Estamos com atraso" and a phone booking. Other days stay in the
 * module's agenda.
 */
export function BookingsCounter({
  bundle,
  page,
  date,
  bookings,
  delays,
  late,
  next,
}: {
  bundle: EstablishmentBundle;
  page: BookingPageRow;
  date: string;
  bookings: EstablishmentBookingRow[];
  delays: BookingDelayRow[];
  late: Set<string>;
  next: EstablishmentBookingRow | null;
}) {
  const { establishment } = bundle;
  const timeZone = establishment.time_zone;
  const clock = (iso: string) => new Intl.DateTimeFormat("pt-PT", { timeZone, hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
  const tables = page.mode === "table";
  const open = bookings.filter((booking) => booking.status === "confirmed");
  const done = bookings.filter((booking) => booking.status !== "confirmed");
  const people = bookings.filter((booking) => booking.status !== "cancelled" && booking.status !== "no_show").reduce((sum, booking) => sum + (booking.party_size ?? 0), 0);
  const word = (count: number) => (tables ? (count === 1 ? "reserva" : "reservas") : count === 1 ? "marcação" : "marcações");
  const tolerance = toleranceText(page);
  const nextDelay = next ? delayFor(delays, next.staff_id) : 0;

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-muted">
        <strong className="font-semibold text-text">
          {open.length} {word(open.length)} por chegar
        </strong>
        {` · ${bookings.filter((booking) => booking.status !== "cancelled").length} hoje`}
        {tables && people ? ` · ${people} pessoas` : ""}
        {tolerance ? ` · ${tolerance}` : ""}
      </p>

      {next ? (
        <Panel title="A seguir">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 gap-4">
              <span className="text-2xl font-semibold tabular-nums text-text">{clock(next.starts_at)}</span>
              <div className="min-w-0">
                <p className="truncate font-semibold text-text">{next.name}</p>
                <p className="text-sm text-muted">
                  {bookingSummary(next, bundle)}
                  {next.phone ? ` · ${next.phone}` : ""}
                </p>
                {next.notes ? <p className="text-sm text-subtle">«{next.notes}»</p> : null}
                {nextDelay ? (
                  <p className="text-sm font-semibold text-gold-text">
                    Com o atraso de hoje: cerca das {clock(new Date(Date.parse(next.starts_at) + nextDelay * 60_000).toISOString())}
                  </p>
                ) : null}
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              <StatusAction booking={next} establishmentId={establishment.id} status="arrived" variant="primary" size="md">
                Chegou
              </StatusAction>
              <StatusAction booking={next} establishmentId={establishment.id} status="no_show" variant="secondary" size="md" confirmMessage={`Marcar ${next.name} como «Não veio»?`}>
                Não veio
              </StatusAction>
            </div>
          </div>
        </Panel>
      ) : null}

      <DelayControl bundle={bundle} delays={delays} />

      <Panel title={`Por chegar · ${open.length}`}>
        {open.length ? (
          <ul className="-my-3 divide-y divide-line">
            {open.map((booking) => {
              const isLate = late.has(booking.id);
              return (
                <li key={booking.id} className="flex items-center gap-3 py-3">
                  <span className={`w-12 shrink-0 font-semibold tabular-nums ${isLate ? "text-danger" : "text-text"}`}>{clock(booking.starts_at)}</span>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2">
                      <span className="truncate font-semibold text-text">{booking.name}</span>
                      {isLate ? <span className="shrink-0 rounded-full bg-danger-soft px-2 py-0.5 text-xs font-semibold text-danger">Atrasado</span> : null}
                    </p>
                    <p className="truncate text-sm text-muted">
                      {bookingSummary(booking, bundle)}
                      {booking.source === "staff" ? " · por telefone" : ""}
                      {booking.notes ? ` · «${booking.notes}»` : ""}
                    </p>
                  </div>
                  <div className="hidden shrink-0 sm:block">
                    <StatusAction booking={booking} establishmentId={establishment.id} status="arrived" variant="secondary">
                      Chegou
                    </StatusAction>
                  </div>
                  <More label={`Mais opções para ${booking.name}`}>
                    <StatusAction booking={booking} establishmentId={establishment.id} status="arrived" variant="ghost" className="w-full justify-start! sm:hidden">
                      Chegou
                    </StatusAction>
                    <StatusAction booking={booking} establishmentId={establishment.id} status="no_show" variant="ghost" className="w-full justify-start!">
                      Não veio
                    </StatusAction>
                    {booking.phone ? (
                      <a href={`tel:${booking.phone.replace(/\s+/g, "")}`} className="flex h-9 items-center rounded-full px-4 text-sm font-semibold text-text hover:bg-surface-2">
                        Ligar · {booking.phone}
                      </a>
                    ) : null}
                  </More>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-sm text-muted">
            {bookings.length ? `Já não há ${tables ? "reservas" : "marcações"} por chegar hoje.` : `Sem ${tables ? "reservas" : "marcações"} para hoje.`}
          </p>
        )}
      </Panel>

      <NewBookingForm bundle={bundle} page={page} date={date} />

      {done.length ? (
        <details className="card p-4 sm:p-5">
          <summary className="cursor-pointer text-sm font-semibold text-muted">Hoje já tratadas · {done.length}</summary>
          <ul className="mt-3 flex flex-col divide-y divide-line">
            {done.map((booking) => (
              <li key={booking.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                <span className="min-w-0 truncate text-text">
                  <span className="tabular-nums text-muted">{clock(booking.starts_at)}</span> · {booking.name}
                </span>
                <span className="flex shrink-0 items-center gap-2">
                  <span className={booking.status === "arrived" ? "text-success" : "text-muted"}>{doneLabel[booking.status]}</span>
                  {booking.status !== "cancelled" ? (
                    <StatusAction booking={booking} establishmentId={establishment.id} status="confirmed" variant="ghost">
                      Repor
                    </StatusAction>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </div>
  );
}

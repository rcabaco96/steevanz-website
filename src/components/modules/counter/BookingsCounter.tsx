import type { ReactNode } from "react";
import { ActionForm } from "@/components/backoffice/ActionForm";
import type { EstablishmentBundle } from "@/lib/establishments/types";
import { setBookingStatus } from "@/lib/modules/bookings/actions";
import { bookingSummary } from "@/lib/modules/bookings/notify";
import { delayFor, toleranceText, type BookingDelayRow, type BookingPageRow, type EstablishmentBookingRow } from "@/lib/modules/bookings/store";
import { DelayControl, NewBookingForm } from "../bookings/BookingsModule";
import { CounterSubmit } from "./CounterSubmit";
import { More } from "./More";

function StatusAction({
  booking,
  establishmentId,
  status,
  children,
  tone,
  size = "md",
  className = "",
}: {
  booking: EstablishmentBookingRow;
  establishmentId: string;
  status: EstablishmentBookingRow["status"];
  children: ReactNode;
  tone: "brand" | "soft" | "quiet" | "danger";
  size?: "lg" | "md";
  className?: string;
}) {
  return (
    <ActionForm action={setBookingStatus} hideMessage className="contents">
      <input type="hidden" name="establishment_id" value={establishmentId} />
      <input type="hidden" name="booking_id" value={booking.id} />
      <input type="hidden" name="status" value={status} />
      <CounterSubmit size={size} tone={tone} className={className}>
        {children}
      </CounterSubmit>
    </ActionForm>
  );
}

const doneLabel: Record<EstablishmentBookingRow["status"], string> = { confirmed: "", arrived: "Chegou", no_show: "Não veio", cancelled: "Cancelada" };

/**
 * Today's bookings at the counter: who is next (big), the rest of the day in order with "Chegou",
 * the late ones in red, "Estamos com atraso" and a phone booking. Other days stay in the module.
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
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-1">
        <p className="font-semibold text-text">
          Hoje · {open.length} {word(open.length)} por chegar
        </p>
        <p className="text-sm text-muted">
          {bookings.filter((booking) => booking.status !== "cancelled").length} no total{tables && people ? ` · ${people} pessoas` : ""}
          {tolerance ? ` · ${tolerance.replace(/\.$/, "")}` : ""}
        </p>
      </div>

      {next ? (
        <section aria-labelledby="seguinte-title" className="overflow-hidden rounded-[2rem] border border-line bg-surface shadow-[0_30px_60px_-40px_rgb(0_0_0/0.35)]">
          <div className="flex items-end gap-5 px-5 pt-5 sm:px-7 sm:pt-6">
            <div className="min-w-0 flex-1">
              <h2 id="seguinte-title" className="text-sm font-semibold text-muted">
                A seguir
              </h2>
              <p className="display mt-1 text-[4rem] leading-[0.9] tabular-nums text-[var(--brand)] sm:text-[5rem]">{clock(next.starts_at)}</p>
              <p className="mt-2 truncate text-xl font-semibold text-text">{next.name}</p>
              <p className="truncate text-sm text-muted">
                {bookingSummary(next, bundle)}
                {next.phone ? ` · ${next.phone}` : ""}
              </p>
              {next.notes ? <p className="mt-1 text-sm text-subtle">«{next.notes}»</p> : null}
              {nextDelay ? (
                <p className="mt-1 text-sm font-semibold text-gold-text">
                  Com o atraso de hoje: cerca das {clock(new Date(Date.parse(next.starts_at) + nextDelay * 60_000).toISOString())}
                </p>
              ) : null}
            </div>
          </div>
          <div className="grid grid-cols-[1fr_auto] gap-2 p-5 sm:p-7">
            <ActionForm action={setBookingStatus} hideMessage className="flex flex-col">
              <input type="hidden" name="establishment_id" value={establishment.id} />
              <input type="hidden" name="booking_id" value={next.id} />
              <input type="hidden" name="status" value="arrived" />
              <CounterSubmit size="xl">Chegou</CounterSubmit>
            </ActionForm>
            <ActionForm action={setBookingStatus} hideMessage confirmMessage={`Marcar ${next.name} como «Não veio»?`} className="flex flex-col">
              <input type="hidden" name="establishment_id" value={establishment.id} />
              <input type="hidden" name="booking_id" value={next.id} />
              <input type="hidden" name="status" value="no_show" />
              <CounterSubmit size="xl" tone="soft" className="w-auto! px-5 text-base!">
                Não veio
              </CounterSubmit>
            </ActionForm>
          </div>
        </section>
      ) : null}

      <DelayControl bundle={bundle} delays={delays} />

      <section aria-labelledby="dia-title" className="flex flex-col gap-2">
        <h2 id="dia-title" className="px-1 text-sm font-semibold text-muted">
          {open.length ? `Por chegar · ${open.length}` : "Por chegar"}
        </h2>
        {open.length ? (
          <ul className="flex flex-col gap-2">
            {open.map((booking) => {
              const isLate = late.has(booking.id);
              const isNext = next?.id === booking.id;
              return (
                <li
                  key={booking.id}
                  className={`flex items-center gap-3 rounded-3xl border p-3 pr-2 ${isLate ? "border-danger/40 bg-danger-soft/40" : isNext ? "border-[var(--brand)] bg-surface" : "border-line bg-surface"}`}
                >
                  <span className={`display w-16 shrink-0 text-center text-2xl tabular-nums ${isLate ? "text-danger" : "text-text"}`}>{clock(booking.starts_at)}</span>
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
                    <StatusAction booking={booking} establishmentId={establishment.id} status="arrived" tone={isLate ? "brand" : "soft"}>
                      Chegou
                    </StatusAction>
                  </div>
                  <More label={`Mais opções para ${booking.name}`}>
                    <StatusAction booking={booking} establishmentId={establishment.id} status="arrived" tone="quiet" className="w-full justify-start! sm:hidden">
                      Chegou
                    </StatusAction>
                    <StatusAction booking={booking} establishmentId={establishment.id} status="no_show" tone="quiet" className="w-full justify-start!">
                      Não veio
                    </StatusAction>
                    {booking.phone ? (
                      <a href={`tel:${booking.phone.replace(/\s+/g, "")}`} className="flex h-11 items-center rounded-2xl px-4 text-sm font-semibold text-muted hover:bg-surface-2 hover:text-text">
                        Ligar · {booking.phone}
                      </a>
                    ) : null}
                  </More>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="rounded-3xl border border-dashed border-line-strong px-5 py-8 text-center text-muted">
            {bookings.length ? `Já não há ${tables ? "reservas" : "marcações"} por chegar hoje.` : `Sem ${tables ? "reservas" : "marcações"} para hoje.`}
          </p>
        )}
      </section>

      <NewBookingForm bundle={bundle} page={page} date={date} />

      {done.length ? (
        <details className="rounded-3xl border border-line bg-surface p-4 sm:p-5">
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
                    <StatusAction booking={booking} establishmentId={establishment.id} status="confirmed" tone="quiet" size="md">
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

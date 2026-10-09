import Link from "next/link";
import { ActionForm, SubmitButton } from "@/components/backoffice/ActionForm";
import { EmptyState, Panel, adminInputClasses, adminLabelClasses } from "@/components/backoffice/ui";
import { PhoneField } from "@/components/shared/PhoneField";
import { buttonClasses } from "@/components/ui/Button";
import { requestOrigin } from "@/lib/booking/request";
import { addDaysToDate, zonedDateString } from "@/lib/booking/slots";
import { kindWords } from "@/lib/establishments/kinds";
import { moduleEstablishments } from "@/lib/establishments/provision";
import { loadBundle } from "@/lib/establishments/store";
import type { EstablishmentBundle, EstablishmentRow } from "@/lib/establishments/types";
import { addBlock, removeBlock, rotateCalendarToken, saveBookingPage, setBookingDelay, setBookingStatus, staffSaveBooking } from "@/lib/modules/bookings/actions";
import type { BookingSlot } from "@/lib/modules/bookings/availability";
import {
  bookingCountsByDay,
  computeDays,
  ensureBookingPage,
  getBooking,
  loadAgendaDay,
  loadUpcomingBlocks,
  serviceStaff,
  type BookingBlockRow,
  type BookingDelayRow,
  type BookingPageRow,
  type EstablishmentBookingRow,
} from "@/lib/modules/bookings/store";
import { More } from "../counter/More";
import type { ModuleProps } from "../registry";
import { AutoRefresh } from "../shared/AutoRefresh";
import { CopyButton } from "../shared/CopyButton";
import { EstablishmentSettings } from "../shared/EstablishmentSettings";
import { Materials } from "../shared/Materials";
import { ModuleNav, pickEstablishment, pickView, queryValue, type ModuleQuery } from "../shared/ModuleNav";
import { NoEstablishment } from "../shared/NoEstablishment";
import { templateForKind } from "@/lib/modules/bookings/templates";
import { AutoSubmitForm } from "./AutoSubmitForm";
import { ServicesView } from "./ServicesView";

/** The tabs; a business with a fixed service (a restaurant) sees "Lotação" instead of "Serviços". */
function moduleViews(establishment: EstablishmentRow) {
  return [
    { id: "reservas", label: "Reservas" },
    { id: "servicos", label: templateForKind(establishment.kind)?.fixed?.label ?? "Serviços" },
    { id: "definicoes", label: "Definições" },
    { id: "partilhar", label: "Partilhar" },
  ];
}

const datePattern = /^\d{4}-\d{2}-\d{2}$/;

function clock(iso: string, timeZone: string): string {
  return new Intl.DateTimeFormat("pt-PT", { timeZone, hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
}

function dayTitle(date: string, today: string): string {
  const label = new Intl.DateTimeFormat("pt-PT", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }).format(new Date(`${date}T12:00:00Z`));
  if (date === today) return `Hoje, ${label}`;
  if (date === addDaysToDate(today, 1)) return `Amanhã, ${label}`;
  return label;
}

const people = (count: number) => `${count} ${count === 1 ? "pessoa" : "pessoas"}`;

/** "4 pessoas" (with the service when there are several) / "Corte · Rui". */
function what(booking: EstablishmentBookingRow, bundle: EstablishmentBundle): string {
  const service = booking.service_id ? bundle.services.find((item) => item.id === booking.service_id) : null;
  const staff = booking.staff_id ? bundle.staff.find((item) => item.id === booking.staff_id) : null;
  if (booking.party_size) return service && bundle.services.filter((item) => item.active).length > 1 ? `${service.name} · ${people(booking.party_size)}` : people(booking.party_size);
  if (service) return `${service.name}${staff ? ` · ${staff.name}` : ""}`;
  return "Reserva";
}

const doneTone: Record<EstablishmentBookingRow["status"], string> = {
  confirmed: "",
  arrived: "bg-success-soft text-success",
  no_show: "bg-danger-soft text-danger",
  cancelled: "bg-surface-2 text-subtle",
};
const doneLabel: Record<EstablishmentBookingRow["status"], string> = { confirmed: "", arrived: "Chegou", no_show: "Não veio", cancelled: "Cancelada" };

function StatusForm({ bundle, booking, status, label, className = "", confirm, notify = false }: { bundle: EstablishmentBundle; booking: EstablishmentBookingRow; status: EstablishmentBookingRow["status"]; label: string; className?: string; confirm?: string; notify?: boolean }) {
  return (
    <ActionForm action={setBookingStatus} hideMessage confirmMessage={confirm} className="contents">
      <input type="hidden" name="establishment_id" value={bundle.establishment.id} />
      <input type="hidden" name="booking_id" value={booking.id} />
      <input type="hidden" name="status" value={status} />
      {notify ? <input type="hidden" name="notify" value="on" /> : null}
      <SubmitButton size="sm" variant="ghost" className={`w-full justify-start! ${className}`}>
        {label}
      </SubmitButton>
    </ActionForm>
  );
}

/** One booking in the day list: what matters at a glance, the actions behind "⋯". */
function BookingRow({ booking, bundle, late, canArrive, editHref }: { booking: EstablishmentBookingRow; bundle: EstablishmentBundle; late: boolean; canArrive: boolean; editHref: string }) {
  const tz = bundle.establishment.time_zone;
  const open = booking.status === "confirmed";
  const contact = [booking.phone, booking.email].filter(Boolean).join(" · ");
  return (
    <li className={`flex items-center gap-3 py-3 ${open ? "" : "opacity-70"}`}>
      <span className={`w-12 shrink-0 font-semibold tabular-nums ${late ? "text-danger" : "text-text"}`}>{clock(booking.starts_at, tz)}</span>
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className={`font-semibold text-text ${booking.status === "cancelled" ? "line-through" : ""}`}>{booking.name}</span>
          {late ? <span className="rounded-full bg-danger-soft px-2 py-0.5 text-xs font-semibold text-danger">Atrasado</span> : null}
          {!open ? <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${doneTone[booking.status]}`}>{doneLabel[booking.status]}</span> : null}
        </p>
        <p className="truncate text-sm text-muted">
          {what(booking, bundle)}
          {contact ? ` · ${contact}` : ""}
          {booking.source === "staff" ? " · por telefone" : ""}
        </p>
        {booking.notes ? <p className="truncate text-sm text-subtle">«{booking.notes}»</p> : null}
      </div>
      {open && canArrive ? (
        <div className="hidden shrink-0 sm:block">
          <ActionForm action={setBookingStatus} hideMessage className="contents">
            <input type="hidden" name="establishment_id" value={bundle.establishment.id} />
            <input type="hidden" name="booking_id" value={booking.id} />
            <input type="hidden" name="status" value="arrived" />
            <SubmitButton size="sm" variant={late ? "primary" : "secondary"}>
              Chegou
            </SubmitButton>
          </ActionForm>
        </div>
      ) : null}
      {booking.status === "cancelled" && !booking.phone ? (
        <span className="w-11 shrink-0" />
      ) : (
        <More label={`Opções da reserva de ${booking.name}`}>
          {open && canArrive ? <StatusForm bundle={bundle} booking={booking} status="arrived" label="Chegou" className="sm:hidden" /> : null}
          {open && canArrive ? <StatusForm bundle={bundle} booking={booking} status="no_show" label="Não veio" /> : null}
          {open ? (
            <Link href={editHref} className="flex h-9 items-center rounded-full px-4 text-sm font-semibold text-text hover:bg-surface-2">
              Alterar reserva
            </Link>
          ) : null}
          {open ? (
            <StatusForm
              bundle={bundle}
              booking={booking}
              status="cancelled"
              label="Cancelar reserva"
              className="text-danger"
              notify={Boolean(booking.email)}
              confirm={`Cancelar a reserva de ${booking.name}?${booking.email ? " O cliente recebe um email a avisar." : ""}`}
            />
          ) : null}
          {booking.status === "arrived" || booking.status === "no_show" ? <StatusForm bundle={bundle} booking={booking} status="confirmed" label="Desfazer" /> : null}
          {booking.phone ? (
            <a href={`tel:${booking.phone.replace(/\s+/g, "")}`} className="flex h-9 items-center rounded-full px-4 text-sm font-semibold text-text hover:bg-surface-2">
              Ligar
            </a>
          ) : null}
        </More>
      )}
    </li>
  );
}

/** "Estamos com atraso" for today: the whole space or one professional. Customers of the next hours are told. */
function DelayControl({ bundle, delays }: { bundle: EstablishmentBundle; delays: BookingDelayRow[] }) {
  const staff = bundle.staff.filter((item) => item.active);
  const lines = [{ id: "", name: staff.length ? "Todos" : "" }, ...staff.map((item) => ({ id: item.id, name: item.name }))];
  const current = (id: string) => delays.find((item) => (item.staff_id ?? "") === id)?.minutes ?? 0;
  return (
    <details className="card p-4 sm:p-5" open={delays.length > 0}>
      <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-2 text-sm font-semibold text-text">
        <span>Estamos com atraso</span>
        {delays.length ? (
          <span className="rounded-full bg-gold-soft px-2.5 py-0.5 text-xs font-semibold text-gold-text">
            {delays.map((item) => `${item.staff_id ? (staff.find((person) => person.id === item.staff_id)?.name ?? "") : "Todos"}: +${item.minutes} min`).join(" · ")}
          </span>
        ) : (
          <span className="text-xs font-normal text-muted">Avisar os clientes das próximas horas</span>
        )}
      </summary>
      <div className="mt-4 flex flex-col gap-3">
        {lines.map((line) => (
          <div key={line.id || "all"} className="flex flex-wrap items-center gap-2">
            {line.name ? <span className="w-20 shrink-0 text-sm font-semibold text-text">{line.name}</span> : null}
            {[0, 10, 15, 30, 45].map((minutes) => (
              <ActionForm key={minutes} action={setBookingDelay} hideMessage className="contents">
                <input type="hidden" name="establishment_id" value={bundle.establishment.id} />
                <input type="hidden" name="minutes" value={minutes} />
                {line.id ? <input type="hidden" name="staff_id" value={line.id} /> : null}
                <SubmitButton size="sm" variant={current(line.id) === minutes ? "primary" : "secondary"}>
                  {minutes ? `+${minutes} min` : "Sem atraso"}
                </SubmitButton>
              </ActionForm>
            ))}
          </div>
        ))}
        <p className="text-xs text-subtle">
          Só para hoje. Nenhuma reserva muda de hora: os clientes das próximas 3 horas recebem um email com a hora prevista e todos veem o aviso no link da reserva.
        </p>
      </div>
    </details>
  );
}

export interface AgendaLinks {
  /** A day of the agenda. */
  day: (date: string) => string;
  newBooking: (date: string) => string;
  edit: (bookingId: string, date: string) => string;
  settings: string;
}

/**
 * One day of bookings for the team (the module and the Balcão): how full each turn is (restaurants),
 * who is still to come, and what is done. Changing, cancelling and "Não veio" are behind "⋯".
 */
export function AgendaDay({ bundle, agenda, links }: { bundle: EstablishmentBundle; agenda: Awaited<ReturnType<typeof loadAgendaDay>>; links: AgendaLinks }) {
  const { establishment } = bundle;
  const tz = establishment.time_zone;
  const { date, today, bookings, blocks, delays, late, turns } = agenda;
  const open = bookings.filter((booking) => booking.status === "confirmed");
  const done = bookings.filter((booking) => booking.status !== "confirmed");
  const held = bookings.filter((booking) => booking.status === "confirmed" || booking.status === "arrived");
  const canArrive = date <= today;
  const word = (count: number) => (count === 1 ? "reserva" : "reservas");
  const partySum = held.reduce((sum, booking) => sum + (booking.party_size ?? 0), 0);
  const groupServices = new Set(turns.map((turn) => turn.service.id)).size;
  const row = (booking: EstablishmentBookingRow) => (
    <BookingRow key={booking.id} booking={booking} bundle={bundle} late={late.has(booking.id)} canArrive={canArrive} editHref={links.edit(booking.id, date)} />
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-text first-letter:uppercase">{dayTitle(date, today)}</h2>
          <p className="text-sm text-muted">
            {held.length} {word(held.length)}
            {partySum ? ` · ${people(partySum)}` : ""}
            {open.length && open.length !== held.length ? ` · ${open.length} por chegar` : ""}
          </p>
        </div>
        <Link href={links.newBooking(date)} className={buttonClasses("primary", "md")}>
          Nova reserva
        </Link>
      </div>

      {turns.length ? (
        <div className="card grid grid-cols-1 divide-y divide-line sm:grid-cols-2 sm:divide-x sm:divide-y-0">
          {turns.map((turn) => {
            const full = turn.booked >= turn.capacity;
            return (
              <div key={turn.service.id + turn.start} className="flex flex-col gap-2 px-4 py-3 sm:px-5">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-semibold text-text">
                    {groupServices > 1 ? `${turn.service.name} · ${turn.label}` : turn.label} <span className="font-normal text-muted">{clock(new Date(turn.start).toISOString(), tz)}–{clock(new Date(turn.end).toISOString(), tz)}</span>
                  </span>
                  {full ? <span className="rounded-full bg-danger-soft px-2 py-0.5 text-xs font-semibold text-danger">Cheio</span> : null}
                </div>
                <span className="text-sm text-muted">
                  {turn.booked === 0 ? (
                    `Sem reservas · lotação de ${turn.capacity} pessoas`
                  ) : full ? (
                    <>
                      Cheio · reservas para <strong className="font-semibold tabular-nums text-text">{turn.booked}</strong> pessoas
                    </>
                  ) : (
                    <>
                      Reservas para <strong className="font-semibold tabular-nums text-text">{turn.booked}</strong> {turn.booked === 1 ? "pessoa" : "pessoas"} · ainda há lugar para{" "}
                      {turn.capacity - turn.booked}
                    </>
                  )}
                </span>
                <span className="h-1.5 overflow-hidden rounded-full bg-surface-2">
                  <span className={`block h-full rounded-full ${full ? "bg-danger" : "bg-accent"}`} style={{ width: `${Math.min(100, (turn.booked / Math.max(1, turn.capacity)) * 100)}%` }} />
                </span>
              </div>
            );
          })}
        </div>
      ) : null}

      {/* Running late matters for back-to-back appointments, not for restaurant capacity. */}
      {date === today && bundle.services.some((service) => service.active && service.booking_kind === "one") ? <DelayControl bundle={bundle} delays={delays} /> : null}

      {blocks.length ? (
        <p className="rounded-2xl border border-dashed border-line-strong px-4 py-3 text-sm text-muted">
          Reservas fechadas:{" "}
          {blocks
            .map((block) => `${clock(block.starts_at, tz)}–${clock(block.ends_at, tz)}${block.staff_id ? ` (${bundle.staff.find((item) => item.id === block.staff_id)?.name ?? ""})` : ""}${block.reason ? ` · ${block.reason}` : ""}`)
            .join("; ")}
          .{" "}
          <Link href={links.settings} className="font-semibold text-accent-text hover:underline">
            Gerir
          </Link>
        </p>
      ) : null}

      {open.length ? (
        <Panel title={`Por chegar · ${open.length}`}>
          <ul className="-my-3 divide-y divide-line">{open.map(row)}</ul>
        </Panel>
      ) : (
        <EmptyState>{bookings.length ? "Já não há reservas por chegar neste dia." : "Sem reservas neste dia."}</EmptyState>
      )}

      {done.length ? (
        <details className="card p-4 sm:p-5">
          <summary className="cursor-pointer text-sm font-semibold text-muted">
            Chegaram, não vieram ou cancelaram · {done.length}
          </summary>
          <ul className="mt-2 divide-y divide-line">{done.map(row)}</ul>
        </details>
      ) : null}
    </div>
  );
}

/** Days with how many bookings each, to jump around the agenda. */
function DayPicker({ date, today, counts, links, start }: { date: string; today: string; counts: Map<string, number>; links: AgendaLinks & { strip: (start: string) => string }; start: string }) {
  const days = Array.from({ length: 7 }, (_, index) => addDaysToDate(start, index));
  const weekday = new Intl.DateTimeFormat("pt-PT", { weekday: "short", timeZone: "UTC" });
  const dayNumber = new Intl.DateTimeFormat("pt-PT", { day: "numeric", month: "short", timeZone: "UTC" });
  return (
    <div className="flex items-center gap-1">
      <Link href={links.strip(addDaysToDate(start, -7))} aria-label="Semana anterior" className={buttonClasses("ghost", "sm", "shrink-0 px-2.5!")}>
        ←
      </Link>
      <nav aria-label="Dias" className="grid flex-1 grid-cols-7 gap-1">
        {days.map((day) => {
          const count = counts.get(day) ?? 0;
          const current = day === date;
          return (
            <Link
              key={day}
              href={links.day(day)}
              aria-current={current ? "page" : undefined}
              className={`flex flex-col items-center gap-0.5 rounded-xl px-1 py-2 text-center transition-colors ${current ? "bg-surface-inverse text-inverse" : "hover:bg-surface-2"}`}
            >
              <span className={`text-xs first-letter:uppercase ${current ? "" : "text-muted"}`}>{day === today ? "Hoje" : weekday.format(new Date(`${day}T12:00:00Z`)).replace(".", "")}</span>
              <span className="text-sm font-semibold">{dayNumber.format(new Date(`${day}T12:00:00Z`)).replace(".", "")}</span>
              <span className={`text-xs tabular-nums ${current ? "" : count ? "text-accent-text" : "text-subtle"}`}>{count ? count : "–"}</span>
            </Link>
          );
        })}
      </nav>
      <Link href={links.strip(addDaysToDate(start, 7))} aria-label="Semana seguinte" className={buttonClasses("ghost", "sm", "shrink-0 px-2.5!")}>
        →
      </Link>
    </div>
  );
}

/** Times grouped as the customer sees them: by turn (restaurants) or morning, afternoon and evening. */
function slotGroups(slots: BookingSlot[]): { label: string; slots: BookingSlot[] }[] {
  const groups: { label: string; slots: BookingSlot[] }[] = [];
  for (const slot of slots) {
    const hour = Number(slot.time.slice(0, 2));
    const label = slot.turn?.label ?? (hour < 13 ? "Manhã" : hour < 20 ? "Tarde" : "Noite");
    const last = groups[groups.length - 1];
    if (last && last.label === label) last.slots.push(slot);
    else groups.push({ label, slots: [slot] });
  }
  return groups;
}

/**
 * New booking (or a change to one) by the team: pick the day and the people (or the service), see
 * only the free times, pick one and the contact. The same rules as the booking page, without the
 * minimum notice.
 */
async function BookingFormView({
  bundle,
  page,
  query,
  basePath,
  keep,
  booking,
  backTo,
}: {
  bundle: EstablishmentBundle;
  page: BookingPageRow;
  query: ModuleQuery;
  basePath: string;
  keep: Record<string, string>;
  booking: EstablishmentBookingRow | null;
  backTo: (date: string) => string;
}) {
  const { establishment } = bundle;
  const tz = establishment.time_zone;
  const today = zonedDateString(new Date(), tz);
  const services = bundle.services.filter((item) => item.active);
  const requestedDay = queryValue(query, "dia");
  const date = datePattern.test(requestedDay) && requestedDay >= today ? requestedDay : booking ? zonedDateString(new Date(booking.starts_at), tz) : today;
  const party = Math.min(100, Math.max(1, Number(queryValue(query, "pessoas")) || booking?.party_size || 2));
  const service = services.find((item) => item.id === (queryValue(query, "servico") || booking?.service_id)) ?? services[0] ?? null;
  const group = service?.booking_kind === "group";
  const eligible = service && !group ? bundle.staff.filter((item) => serviceStaff(bundle, service).includes(item.id)) : [];
  const person = eligible.find((item) => item.id === (queryValue(query, "profissional") || booking?.staff_id))?.id ?? "";
  const days = service
    ? await computeDays(bundle, page, { serviceId: service.id, staffId: person || null, partySize: party, from: date, days: 1, excludeId: booking?.id, forStaff: true })
    : [];
  const slots = days.find((day) => day.date === date)?.slots ?? [];
  const current = booking && slots.some((slot) => slot.start === new Date(booking.starts_at).toISOString()) ? new Date(booking.starts_at).toISOString() : null;
  const input = `${adminInputClasses} h-11`;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-text">{booking ? `Alterar a reserva de ${booking.name}` : "Nova reserva"}</h2>
        <Link href={backTo(date)} className={buttonClasses("ghost", "sm")}>
          Voltar às reservas
        </Link>
      </div>

      <Panel title="1. Dia e hora">
        <AutoSubmitForm action={basePath} className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:items-end">
          {Object.entries(keep).map(([name, value]) => (
            <input key={name} type="hidden" name={name} value={value} />
          ))}
          <label className={adminLabelClasses}>
            Dia
            <input type="date" name="dia" min={today} defaultValue={date} className={input} />
          </label>
          {services.length > 1 ? (
            <label className={adminLabelClasses}>
              Serviço
              <select name="servico" defaultValue={service?.id ?? ""} className={input}>
                {services.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
          ) : service ? (
            <input type="hidden" name="servico" value={service.id} />
          ) : null}
          {group ? (
            <label className={adminLabelClasses}>
              Pessoas
              <input type="number" name="pessoas" min={1} max={1000} defaultValue={party} className={input} />
            </label>
          ) : eligible.length > 1 ? (
            <label className={adminLabelClasses}>
              {kindWords[bundle.establishment.kind].who.question.replace("?", "")}
              <select name="profissional" defaultValue={person} className={input}>
                <option value="">{kindWords[bundle.establishment.kind].who.any}</option>
                {eligible.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          <noscript>
            <button type="submit" className={buttonClasses("secondary", "md")}>
              Ver horas livres
            </button>
          </noscript>
        </AutoSubmitForm>
      </Panel>

      <ActionForm action={staffSaveBooking} className="flex flex-col gap-5">
        <input type="hidden" name="establishment_id" value={establishment.id} />
        {booking ? <input type="hidden" name="booking_id" value={booking.id} /> : null}
        <input type="hidden" name="back" value={backTo(date)} />
        <input type="hidden" name="service" value={service?.id ?? ""} />
        {group ? <input type="hidden" name="party" value={party} /> : null}
        {person ? <input type="hidden" name="staff" value={person} /> : null}

        <Panel title={`Horas livres · ${service ? `${service.name} · ` : ""}${dayTitle(date, today)}${group ? ` · ${people(party)}` : ""}`}>
          {!service ? (
            <p className="text-sm text-muted">Crie primeiro um serviço no separador Serviços.</p>
          ) : slots.length ? (
            <div className="flex flex-col gap-4">
              {slotGroups(slots).map((group) => (
                <fieldset key={group.label} className="flex flex-col gap-2">
                  <legend className="mb-1 text-sm font-semibold text-muted">{group.label}</legend>
                  <div className="flex flex-wrap gap-2">
                    {group.slots.map((slot) => (
                      <label key={slot.start}>
                        <input type="radio" name="start" value={slot.start} required defaultChecked={slot.start === current} className="peer sr-only" />
                        <span className="inline-flex h-10 min-w-16 cursor-pointer items-center justify-center rounded-full border border-line-strong px-3 text-sm font-semibold tabular-nums text-text transition-colors peer-checked:border-transparent peer-checked:bg-accent peer-checked:text-accent-contrast peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent hover:bg-surface-2">
                          {slot.time}
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">
              {group ? `Não há lugar para ${people(party)} neste dia (turnos cheios, fechado ou já passou).` : "Não há horas livres neste dia para este serviço."} Experimente outro dia.
            </p>
          )}
        </Panel>

        <Panel title="2. Cliente">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className={adminLabelClasses}>
              Nome
              <input name="name" required maxLength={80} defaultValue={booking?.name ?? ""} className={input} />
            </label>
            <PhoneField label="Telefone" defaultValue={booking?.phone} labelClassName={adminLabelClasses} inputClassName={input} />
            <label className={adminLabelClasses}>
              Email (opcional)
              <input name="email" type="email" maxLength={200} defaultValue={booking?.email ?? ""} className={input} />
            </label>
            <label className={adminLabelClasses}>
              Notas (opcional)
              <input name="notes" maxLength={500} defaultValue={booking?.notes ?? ""} className={input} />
            </label>
            <label className="flex items-center gap-2 text-sm text-text sm:col-span-2">
              <input type="checkbox" name="send_confirmation" defaultChecked className="h-4 w-4 accent-accent" />
              {booking ? "Avisar o cliente da alteração por email (se tiver email)" : "Enviar a confirmação por email (se tiver email)"}
            </label>
          </div>
        </Panel>

        <div>
          <SubmitButton size="lg" pendingLabel="A guardar…">
            {booking ? "Guardar alteração" : "Guardar reserva"}
          </SubmitButton>
        </div>
      </ActionForm>
    </div>
  );
}

function Choice({ name, label, value, options, hint }: { name: string; label: string; value: number; options: [number, string][]; hint?: string }) {
  const known = options.some(([option]) => option === value);
  return (
    <label className={adminLabelClasses}>
      {label}
      <select name={name} defaultValue={value} className={`${adminInputClasses} h-11`}>
        {known ? null : <option value={value}>{value}</option>}
        {options.map(([option, text]) => (
          <option key={option} value={option}>
            {text}
          </option>
        ))}
      </select>
      {hint ? <span className="text-xs font-normal text-subtle">{hint}</span> : null}
    </label>
  );
}

function PageSettings({ page, establishmentId, hasGroup }: { page: BookingPageRow; establishmentId: string; hasGroup: boolean }) {
  const input = `${adminInputClasses} h-11`;
  return (
    <ActionForm resetKey={page.updated_at} action={saveBookingPage} className="flex flex-col gap-6">
      <input type="hidden" name="establishment_id" value={establishmentId} />
      <input type="hidden" name="seats_per_slot" value={page.seats_per_slot} />
      <input type="hidden" name="max_party" value={page.max_party} />
      <Panel title="Reservas online">
        <label className="flex items-center gap-2 text-sm font-semibold text-text">
          <input type="checkbox" name="active" defaultChecked={page.active} className="h-4.5 w-4.5 accent-accent" />
          Aceitar reservas online
        </label>
        <p className="mt-2 text-sm text-muted">Desligado, a página de reservas fica fechada e só entram as reservas que fizer aqui.</p>
      </Panel>

      <Panel title="Regras para o cliente">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Choice
            name="min_notice_minutes"
            label="Antecedência mínima"
            value={page.min_notice_minutes}
            options={[
              [0, "Sem antecedência"],
              [30, "30 minutos"],
              [60, "1 hora"],
              [120, "2 horas"],
              [240, "4 horas"],
              [1440, "1 dia"],
            ]}
          />
          <Choice
            name="max_days_ahead"
            label="Até quantos dias à frente"
            value={page.max_days_ahead}
            options={[
              [7, "1 semana"],
              [14, "2 semanas"],
              [30, "1 mês"],
              [60, "2 meses"],
              [90, "3 meses"],
              [180, "6 meses"],
            ]}
          />
          {hasGroup ? (
            <Choice
              name="last_booking_minutes"
              label="Última reserva"
              value={page.last_booking_minutes}
              options={[
                [30, "30 minutos antes de fechar"],
                [60, "1 hora antes de fechar"],
                [90, "1 h 30 antes de fechar"],
                [120, "2 horas antes de fechar"],
              ]}
              hint="Ex.: jantar até às 23:00 e «1 hora antes» → a última reserva é às 22:00."
            />
          ) : (
            <input type="hidden" name="last_booking_minutes" value={page.last_booking_minutes} />
          )}
          <Choice
            name="late_grace_minutes"
            label="Tolerância de atraso"
            value={page.late_grace_minutes}
            options={[
              [0, "Sem tolerância"],
              [5, "5 minutos"],
              [10, "10 minutos"],
              [15, "15 minutos"],
              [20, "20 minutos"],
              [30, "30 minutos"],
            ]}
            hint="O cliente vê-a ao reservar. Passado esse tempo, a reserva aparece como «Atrasado»."
          />
          <Choice
            name="cancel_until_hours"
            label="Cancelar ou alterar online até"
            value={page.cancel_until_hours}
            options={[
              [0, "À hora marcada"],
              [1, "1 hora antes"],
              [2, "2 horas antes"],
              [4, "4 horas antes"],
              [24, "1 dia antes"],
              [48, "2 dias antes"],
            ]}
          />
        </div>
      </Panel>

      <Panel title="Avisos e mensagens">
        <div className="grid grid-cols-1 gap-4">
          <label className="flex items-center gap-2 text-sm text-text">
            <input type="checkbox" name="notify_owner" defaultChecked={page.notify_owner} className="h-4.5 w-4.5 accent-accent" />
            Receber um email a cada reserva nova ou cancelada
          </label>
          <label className={adminLabelClasses}>
            Nota na confirmação (opcional)
            <input name="confirmation_note" maxLength={300} defaultValue={page.confirmation_note ?? ""} className={input} />
          </label>
          <label className={adminLabelClasses}>
            Regras de cancelamento (opcional)
            <textarea name="policy" rows={2} maxLength={600} defaultValue={page.policy ?? ""} className={`${adminInputClasses} py-2`} />
          </label>
        </div>
      </Panel>

      <div>
        <SubmitButton>Guardar definições</SubmitButton>
      </div>
    </ActionForm>
  );
}

function BlocksPanel({ bundle, blocks }: { bundle: EstablishmentBundle; blocks: BookingBlockRow[] }) {
  const tz = bundle.establishment.time_zone;
  const input = `${adminInputClasses} h-10 text-sm`;
  const staff = bundle.staff.filter((item) => item.active);
  const when = new Intl.DateTimeFormat("pt-PT", { timeZone: tz, weekday: "short", day: "numeric", month: "short" });
  return (
    <Panel title="Fechar reservas num dia ou horário">
      <p className="-mt-2 mb-4 text-sm text-muted">Para um evento, uma folga ou uma sala reservada. Os dias inteiros de fecho marcam-se em «Dias fechados», mais abaixo.</p>
      {blocks.length ? (
        <ul className="mb-4 divide-y divide-line">
          {blocks.map((block) => (
            <li key={block.id} className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm">
              <span className="text-text first-letter:uppercase">
                {when.format(new Date(block.starts_at))}, {clock(block.starts_at, tz)}–{clock(block.ends_at, tz)}
                {block.staff_id ? ` · ${bundle.staff.find((item) => item.id === block.staff_id)?.name ?? ""}` : ""}
                {block.reason ? <span className="text-muted"> · {block.reason}</span> : null}
              </span>
              <ActionForm action={removeBlock} hideMessage>
                <input type="hidden" name="establishment_id" value={bundle.establishment.id} />
                <input type="hidden" name="block_id" value={block.id} />
                <SubmitButton size="sm" variant="ghost">
                  Reabrir
                </SubmitButton>
              </ActionForm>
            </li>
          ))}
        </ul>
      ) : null}
      <ActionForm action={addBlock} className="grid grid-cols-1 gap-3 sm:grid-cols-4">
        <input type="hidden" name="establishment_id" value={bundle.establishment.id} />
        <label className={adminLabelClasses}>
          Dia
          <input name="date" type="date" required className={input} />
        </label>
        <label className={adminLabelClasses}>
          Das
          <input name="from" type="time" required className={input} />
        </label>
        <label className={adminLabelClasses}>
          Às
          <input name="to" type="time" required className={input} />
        </label>
        {staff.length ? (
          <label className={adminLabelClasses}>
            Quem
            <select name="staff" defaultValue="" className={input}>
              <option value="">Todos</option>
              {staff.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        <label className={`${adminLabelClasses} sm:col-span-3`}>
          Motivo (opcional)
          <input name="reason" maxLength={120} placeholder="Evento privado, formação…" className={input} />
        </label>
        <div className="flex items-end">
          <SubmitButton size="sm">Fechar este horário</SubmitButton>
        </div>
      </ActionForm>
    </Panel>
  );
}

function setupWarnings(bundle: EstablishmentBundle, page: BookingPageRow): string[] {
  const warnings: string[] = [];
  if (!bundle.services.some((item) => item.active)) {
    warnings.push(templateForKind(bundle.establishment.kind)?.fixed ? "As reservas ainda não estão ativas: veja o separador Lotação." : "Ainda não há serviços: crie-os (ou comece por um exemplo) no separador Serviços.");
  }
  if (!bundle.hours.length) warnings.push("Falta o horário: sem ele não há horas para reservar.");
  if (!page.active) warnings.push("As reservas online estão desligadas: só entram as que fizer aqui.");
  return warnings;
}

/** Links of the agenda inside a module page (`basePath` + the space when there are several). */
export function agendaLinks(basePath: string, establishments: EstablishmentRow[], current: EstablishmentRow): AgendaLinks & { strip: (start: string) => string } {
  const href = (params: Record<string, string>) => `${basePath}?${new URLSearchParams({ ...(establishments.length > 1 ? { loja: current.slug } : {}), ...params })}`;
  return {
    day: (date) => href({ dia: date }),
    strip: (start) => href({ dia: start, inicio: start }),
    newBooking: (date) => href({ vista: "nova", dia: date }),
    edit: (bookingId, date) => href({ vista: "alterar", reserva: bookingId, dia: date }),
    settings: href({ vista: "definicoes" }),
  };
}

export async function BookingsModule({ userId, viewer, basePath, query, productId }: ModuleProps) {
  const establishments = await moduleEstablishments(userId, productId);
  const current = pickEstablishment(establishments, query);
  if (!current) return <NoEstablishment productId={productId} viewer={viewer} ownerId={userId} />;
  const [bundle, page] = await Promise.all([loadBundle(current), ensureBookingPage(current)]);
  const links = agendaLinks(basePath, establishments, current);
  const views = moduleViews(current);
  const requestedView = queryValue(query, "vista");
  const view = requestedView === "nova" || requestedView === "alterar" ? "reservas" : pickView(query, views);
  const nav = <ModuleNav basePath={basePath} establishments={establishments} current={current} views={views} view={view} />;
  const warnings = setupWarnings(bundle, page);
  const warningBox = warnings.length ? (
    <div className="rounded-2xl border border-gold/40 bg-gold-soft px-4 py-3 text-sm text-gold-text">
      <ul className="flex flex-col gap-1">
        {warnings.map((warning) => (
          <li key={warning}>{warning}</li>
        ))}
      </ul>
      <Link href={links.settings} className="mt-1 inline-block font-semibold underline">
        Abrir definições
      </Link>
    </div>
  ) : null;

  if (requestedView === "nova" || requestedView === "alterar") {
    const booking = requestedView === "alterar" ? await getBooking(current.id, queryValue(query, "reserva")) : null;
    const keep = { ...(establishments.length > 1 ? { loja: current.slug } : {}), vista: requestedView, ...(booking ? { reserva: booking.id } : {}) };
    return (
      <div className="flex flex-col gap-6">
        {nav}
        {requestedView === "alterar" && (!booking || booking.status !== "confirmed") ? (
          <EmptyState>Esta reserva já não pode ser alterada.</EmptyState>
        ) : (
          <BookingFormView bundle={bundle} page={page} query={query ?? {}} basePath={basePath} keep={keep} booking={booking} backTo={links.day} />
        )}
      </div>
    );
  }

  if (view === "servicos") {
    return (
      <div className="flex flex-col gap-6">
        {nav}
        <ServicesView bundle={bundle} settingsHref={links.settings} />
      </div>
    );
  }

  if (view === "definicoes") {
    const blocks = await loadUpcomingBlocks(current);
    return (
      <div className="flex flex-col gap-6">
        {nav}
        <PageSettings page={page} establishmentId={current.id} hasGroup={bundle.services.some((item) => item.booking_kind === "group")} />
        <EstablishmentSettings bundle={bundle} viewer={viewer} sections={["hours", "closures", "details"]} />
        <BlocksPanel bundle={bundle} blocks={blocks} />
      </div>
    );
  }

  if (view === "partilhar") {
    const origin = await requestOrigin();
    const publicUrl = `${origin}/reservar/${current.slug}`;
    const calendarUrl = `${origin}/api/agenda/${page.calendar_token}`;
    return (
      <div className="flex flex-col gap-6">
        {nav}
        {warningBox}
        <Materials
          title="Link de reservas"
          url={publicUrl}
          hint="Partilhe este link no Instagram (bio), no perfil do Google («Reservar»), no WhatsApp e no site."
          poster={{
            heading: current.kind === "restaurant" ? "Reserve a sua mesa." : "Marque online, a qualquer hora.",
            sub: "Aponte a câmara ao código para ver as horas livres.",
            name: current.name,
          }}
        />
        <Panel title="Ver as reservas no calendário do telemóvel">
          <p className="-mt-2 mb-3 text-sm text-muted">
            No Google Calendar: «Outros calendários» → «+» → «A partir de URL» e cole este endereço (o iPhone e o Outlook também aceitam). Atualiza sozinho. É privado: não o
            partilhe.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <code className="min-w-0 flex-1 truncate rounded-xl border border-line bg-surface-2/60 px-3 py-2.5 text-xs">{calendarUrl}</code>
            <CopyButton value={calendarUrl} label="Copiar endereço" />
          </div>
          <ActionForm action={rotateCalendarToken} confirmMessage="Criar um novo endereço? O atual deixa de funcionar." className="mt-3">
            <input type="hidden" name="establishment_id" value={current.id} />
            <SubmitButton size="sm" variant="ghost">
              Criar novo endereço
            </SubmitButton>
          </ActionForm>
        </Panel>
      </div>
    );
  }

  // Reservas: one day, with the week around it.
  const today = zonedDateString(new Date(), current.time_zone);
  const requested = queryValue(query, "dia");
  const date = datePattern.test(requested) ? requested : today;
  const requestedStart = queryValue(query, "inicio");
  const start = datePattern.test(requestedStart) ? requestedStart : date >= today && date < addDaysToDate(today, 7) ? today : date;
  const [agenda, counts] = await Promise.all([loadAgendaDay(bundle, page, date), bookingCountsByDay(current, start, 7)]);
  return (
    <div className="flex flex-col gap-6">
      <AutoRefresh intervalMs={30_000} />
      {nav}
      {warningBox}
      <DayPicker date={date} today={today} counts={counts} links={links} start={start} />
      <AgendaDay bundle={bundle} agenda={agenda} links={links} />
    </div>
  );
}

import Link from "next/link";
import type { ReactNode } from "react";
import { ActionForm, SubmitButton } from "@/components/backoffice/ActionForm";
import { EmptyState, Panel, adminInputClasses, adminLabelClasses } from "@/components/backoffice/ui";
import { requestOrigin } from "@/lib/booking/request";
import { addDaysToDate, zonedDateString } from "@/lib/booking/slots";
import { readableTextOn } from "@/lib/establishments/kinds";
import { moduleEstablishments } from "@/lib/establishments/provision";
import { loadBundle } from "@/lib/establishments/store";
import type { EstablishmentBundle } from "@/lib/establishments/types";
import { addBlock, removeBlock, rotateCalendarToken, saveBookingPage, setBookingDelay, setBookingStatus, staffCreateBooking } from "@/lib/modules/bookings/actions";
import { peakSeated } from "@/lib/modules/bookings/availability";
import { bookingSummary } from "@/lib/modules/bookings/notify";
import {
  bookingStatusLabels,
  ensureBookingPage,
  lateBookingIds,
  loadBookingStats,
  loadDelays,
  loadDay,
  loadUpcoming,
  type BookingDelayRow,
  type BookingPageRow,
  type EstablishmentBookingRow,
} from "@/lib/modules/bookings/store";
import type { ModuleProps } from "../registry";
import { AutoRefresh } from "../shared/AutoRefresh";
import { CopyButton } from "../shared/CopyButton";
import { EstablishmentSettings } from "../shared/EstablishmentSettings";
import { Materials } from "../shared/Materials";
import { ModuleNav, pickEstablishment, pickView, queryValue } from "../shared/ModuleNav";
import { NoEstablishment } from "../shared/NoEstablishment";

const views = [
  { id: "agenda", label: "Agenda" },
  { id: "proximas", label: "Próximas" },
  { id: "estatisticas", label: "Estatísticas" },
  { id: "definicoes", label: "Definições" },
  { id: "link", label: "Link e botão" },
];

const statusTone: Record<EstablishmentBookingRow["status"], string> = {
  confirmed: "bg-accent-soft text-accent-text",
  arrived: "bg-success-soft text-success",
  no_show: "bg-danger-soft text-danger",
  cancelled: "bg-surface-2 text-subtle line-through",
};

/** Colour on the left edge of each booking: what still needs attention stands out. */
const statusEdge: Record<EstablishmentBookingRow["status"], string> = {
  confirmed: "border-l-accent",
  arrived: "border-l-success",
  no_show: "border-l-danger",
  cancelled: "border-l-line-strong",
};

function time(iso: string, timeZone: string): string {
  return new Intl.DateTimeFormat("pt-PT", { timeZone, hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
}

function BookingCard({ booking, bundle, showDate = false, late = false }: { booking: EstablishmentBookingRow; bundle: EstablishmentBundle; showDate?: boolean; late?: boolean }) {
  const { establishment } = bundle;
  const hidden = (
    <>
      <input type="hidden" name="establishment_id" value={establishment.id} />
      <input type="hidden" name="booking_id" value={booking.id} />
    </>
  );
  const statusForm = (status: EstablishmentBookingRow["status"], label: string, variant: "primary" | "secondary" | "ghost" = "secondary", extra?: ReactNode) => (
    <ActionForm action={setBookingStatus} hideMessage className="contents">
      {hidden}
      <input type="hidden" name="status" value={status} />
      {extra}
      <SubmitButton size="sm" variant={variant}>
        {label}
      </SubmitButton>
    </ActionForm>
  );
  return (
    <li className={`card flex flex-col gap-3 border-l-4 p-4 ${late ? "border-l-danger bg-danger-soft/30" : statusEdge[booking.status]} ${booking.status === "cancelled" ? "opacity-70" : ""}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 gap-3">
          <span className="display shrink-0 text-2xl tabular-nums">{time(booking.starts_at, establishment.time_zone)}</span>
          <div className="min-w-0">
            <p className="font-semibold text-text">{booking.name}</p>
            <p className="text-sm text-muted">
              {showDate
                ? `${new Intl.DateTimeFormat("pt-PT", { timeZone: establishment.time_zone, weekday: "short", day: "numeric", month: "short" }).format(new Date(booking.starts_at))} · `
                : ""}
              {bookingSummary(booking, bundle)} · até {time(booking.ends_at, establishment.time_zone)}
            </p>
            <p className="text-sm text-muted">
              {[booking.phone, booking.email].filter(Boolean).map((contact, index) => (
                <span key={contact}>
                  {index ? " · " : ""}
                  <a href={contact!.includes("@") ? `mailto:${contact}` : `tel:${contact!.replace(/\s+/g, "")}`} className="hover:text-text hover:underline">
                    {contact}
                  </a>
                </span>
              ))}
              {booking.source === "staff" ? <span className="text-subtle"> · pelo telefone/balcão</span> : null}
            </p>
            {booking.notes ? <p className="mt-1 text-sm text-subtle">«{booking.notes}»</p> : null}
          </div>
        </div>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${late ? "bg-danger-soft text-danger" : statusTone[booking.status]}`}>
          {late ? "Atrasado" : bookingStatusLabels[booking.status]}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {booking.status === "confirmed" ? (
          <>
            {statusForm("arrived", "Chegou", "primary")}
            {statusForm("no_show", "Não compareceu", "ghost")}
            <details className="relative">
              <summary className="cursor-pointer list-none rounded-full px-3 py-1.5 text-sm font-semibold text-danger hover:bg-danger-soft">Cancelar…</summary>
              <ActionForm action={setBookingStatus} className="mt-2 flex flex-col gap-2 rounded-2xl border border-line bg-surface p-3">
                {hidden}
                <input type="hidden" name="status" value="cancelled" />
                {booking.email ? (
                  <label className="flex items-center gap-2 text-sm text-text">
                    <input type="checkbox" name="notify" defaultChecked className="h-4 w-4 accent-accent" />
                    Avisar o cliente por email
                  </label>
                ) : null}
                <SubmitButton size="sm" variant="secondary" className="text-danger">
                  Confirmar cancelamento
                </SubmitButton>
              </ActionForm>
            </details>
          </>
        ) : (
          statusForm("confirmed", "Repor como confirmada", "ghost")
        )}
      </div>
    </li>
  );
}

export function NewBookingForm({ bundle, page, date }: { bundle: EstablishmentBundle; page: BookingPageRow; date: string }) {
  const input = `${adminInputClasses} h-10 text-sm`;
  const services = bundle.services.filter((item) => item.active);
  const staff = bundle.staff.filter((item) => item.active);
  return (
    <details className="group card p-4 sm:p-5">
      <summary className="cursor-pointer list-none text-sm font-semibold text-text">
        <span className="inline-flex items-center gap-2">
          <span aria-hidden="true" className="grid h-6 w-6 place-items-center rounded-full bg-accent-soft text-accent-text group-open:rotate-45">
            +
          </span>
          {page.mode === "table" ? "Nova reserva (telefone ou balcão)" : "Nova marcação (telefone ou balcão)"}
        </span>
      </summary>
      <ActionForm action={staffCreateBooking} className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input type="hidden" name="establishment_id" value={bundle.establishment.id} />
        <label className={adminLabelClasses}>
          Dia
          <input name="date" type="date" required defaultValue={date} className={input} />
        </label>
        <label className={adminLabelClasses}>
          Hora
          <input name="time" type="time" required step={300} className={input} />
        </label>
        {page.mode === "service" ? (
          <>
            <label className={adminLabelClasses}>
              Serviço
              <select name="service" required className={input}>
                {services.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} · {item.duration_minutes} min
                  </option>
                ))}
              </select>
            </label>
            <label className={adminLabelClasses}>
              Profissional
              <select name="staff" defaultValue="" className={input}>
                <option value="">{staff.length ? "Qualquer um livre" : "—"}</option>
                {staff.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
          </>
        ) : (
          <label className={adminLabelClasses}>
            Pessoas
            <input name="party" type="number" min={1} max={1000} required defaultValue={2} className={input} />
          </label>
        )}
        <label className={adminLabelClasses}>
          Nome
          <input name="name" required maxLength={80} className={input} />
        </label>
        <label className={adminLabelClasses}>
          Telefone
          <input name="phone" type="tel" maxLength={40} className={input} />
        </label>
        <label className={adminLabelClasses}>
          Email (opcional)
          <input name="email" type="email" maxLength={200} className={input} />
        </label>
        <label className={`${adminLabelClasses} sm:col-span-2`}>
          Notas
          <input name="notes" maxLength={500} className={input} />
        </label>
        <label className="flex items-center gap-2 text-sm text-text sm:col-span-2">
          <input type="checkbox" name="send_confirmation" defaultChecked className="h-4 w-4 accent-accent" />
          Enviar confirmação por email ao cliente (se tiver email)
        </label>
        <div className="sm:col-span-2">
          <SubmitButton size="sm">Guardar reserva</SubmitButton>
        </div>
      </ActionForm>
    </details>
  );
}

function BlockForm({ bundle, date }: { bundle: EstablishmentBundle; date: string }) {
  const input = `${adminInputClasses} h-10 text-sm`;
  const staff = bundle.staff.filter((item) => item.active);
  return (
    <details className="card p-4 sm:p-5">
      <summary className="cursor-pointer text-sm font-semibold text-text">Fechar as reservas num horário</summary>
      <ActionForm action={addBlock} className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-4">
        <input type="hidden" name="establishment_id" value={bundle.establishment.id} />
        <label className={adminLabelClasses}>
          Dia
          <input name="date" type="date" required defaultValue={date} className={input} />
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
          <SubmitButton size="sm">Bloquear</SubmitButton>
        </div>
      </ActionForm>
    </details>
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

function PageSettings({ page, establishmentId, calendarUrl }: { page: BookingPageRow; establishmentId: string; calendarUrl: string }) {
  const input = `${adminInputClasses} h-11`;
  const tables = page.mode === "table";
  return (
    <>
      <Panel title={tables ? "Reservas de mesa" : "Marcações online"}>
        <ActionForm key={page.updated_at} action={saveBookingPage} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <input type="hidden" name="establishment_id" value={establishmentId} />
          <label className="flex items-center gap-2 text-sm font-semibold text-text sm:col-span-2">
            <input type="checkbox" name="active" defaultChecked={page.active} className="h-4.5 w-4.5 accent-accent" />
            {tables ? "Aceitar reservas online" : "Aceitar marcações online"}
          </label>
          {tables ? (
            <>
              <label className={adminLabelClasses}>
                Lugares para reservas
                <input name="seats_per_slot" type="number" min={1} max={1000} required defaultValue={page.seats_per_slot} className={input} />
                <span className="text-xs font-normal text-subtle">Quantas pessoas podem estar sentadas com reserva ao mesmo tempo. Deixe lugares para quem chega sem reserva.</span>
              </label>
              <Choice
                name="table_minutes"
                label="Duração de uma refeição"
                value={page.table_minutes}
                options={[
                  [60, "1 hora"],
                  [90, "1 h 30"],
                  [120, "2 horas"],
                  [150, "2 h 30"],
                  [180, "3 horas"],
                ]}
                hint="Quanto tempo a mesa fica ocupada. Conta para os lugares livres."
              />
              <label className={adminLabelClasses}>
                Máximo de pessoas por reserva
                <input name="max_party" type="number" min={1} max={100} required defaultValue={page.max_party} className={input} />
                <span className="text-xs font-normal text-subtle">Grupos maiores veem o seu contacto para combinar.</span>
              </label>
            </>
          ) : (
            <>
              <input type="hidden" name="seats_per_slot" value={page.seats_per_slot} />
              <input type="hidden" name="table_minutes" value={page.table_minutes} />
              <input type="hidden" name="max_party" value={page.max_party} />
              <p className="rounded-2xl bg-surface-2/60 px-4 py-3 text-sm text-muted sm:col-span-2">
                Os horários saem dos <strong className="font-semibold text-text">serviços</strong> (duração) e dos <strong className="font-semibold text-text">profissionais</strong>, mais abaixo. Quem
                escolhe «qualquer um» fica com o profissional menos ocupado nesse dia.
              </p>
            </>
          )}
          <Choice
            name="min_notice_minutes"
            label={tables ? "Reservar com pelo menos" : "Marcar com pelo menos"}
            value={page.min_notice_minutes}
            options={[
              [0, "Sem antecedência"],
              [30, "30 minutos de antecedência"],
              [60, "1 hora de antecedência"],
              [120, "2 horas de antecedência"],
              [240, "4 horas de antecedência"],
              [1440, "1 dia de antecedência"],
            ]}
          />
          <Choice
            name="max_days_ahead"
            label={tables ? "Reservas até" : "Marcações até"}
            value={page.max_days_ahead}
            options={[
              [7, "1 semana à frente"],
              [14, "2 semanas à frente"],
              [30, "1 mês à frente"],
              [60, "2 meses à frente"],
              [90, "3 meses à frente"],
              [180, "6 meses à frente"],
            ]}
          />
          <Choice
            name="late_grace_minutes"
            label={tables ? "Guardar a mesa durante" : "Tolerância de atraso"}
            value={page.late_grace_minutes}
            options={[
              [0, "Sem tolerância"],
              [5, "5 minutos"],
              [10, "10 minutos"],
              [15, "15 minutos"],
              [20, "20 minutos"],
              [30, "30 minutos"],
            ]}
            hint="O cliente vê-a ao reservar e na confirmação. Passado esse tempo, a reserva aparece como «Atrasado» para decidir."
          />
          <Choice
            name="cancel_until_hours"
            label="O cliente cancela ou altera online até"
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
          <label className="flex items-center gap-2 self-end pb-3 text-sm text-text">
            <input type="checkbox" name="notify_owner" defaultChecked={page.notify_owner} className="h-4.5 w-4.5 accent-accent" />
            Receber um email a cada {tables ? "reserva" : "marcação"} ou cancelamento
          </label>
          <details className="sm:col-span-2">
            <summary className="cursor-pointer text-sm font-semibold text-muted hover:text-text">Mensagens para o cliente (opcional)</summary>
            <div className="mt-3 grid grid-cols-1 gap-4">
              <label className={adminLabelClasses}>
                Nota na confirmação
                <input name="confirmation_note" maxLength={300} defaultValue={page.confirmation_note ?? ""} placeholder="Ex.: Estacionamento gratuito nas traseiras." className={input} />
              </label>
              <label className={adminLabelClasses}>
                Política de cancelamento
                <textarea name="policy" rows={2} maxLength={600} defaultValue={page.policy ?? ""} placeholder="Ex.: Guardamos a mesa 15 minutos." className={`${adminInputClasses} py-2`} />
              </label>
            </div>
          </details>
          <div className="sm:col-span-2">
            <SubmitButton size="sm">Guardar</SubmitButton>
          </div>
        </ActionForm>
      </Panel>
      <Panel title="Ver no calendário do telemóvel">
        <p className="-mt-2 mb-3 text-sm text-muted">
          No Google Calendar: «Outros calendários» → «+» → «A partir de URL» e cole este endereço (Outlook e iPhone também aceitam). Atualiza sozinho; é privado: não o
          partilhe.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <code className="min-w-0 flex-1 truncate rounded-xl border border-line bg-surface-2/60 px-3 py-2.5 text-xs">{calendarUrl}</code>
          <CopyButton value={calendarUrl} label="Copiar endereço" />
        </div>
        <ActionForm action={rotateCalendarToken} confirmMessage="Criar um novo endereço? O atual deixa de funcionar." className="mt-3">
          <input type="hidden" name="establishment_id" value={establishmentId} />
          <SubmitButton size="sm" variant="ghost">
            Renovar endereço
          </SubmitButton>
        </ActionForm>
      </Panel>
    </>
  );
}

/** "Estamos com atraso" for today: the whole space or one professional. Customers of the next hours are told. */
export function DelayControl({ bundle, delays }: { bundle: EstablishmentBundle; delays: BookingDelayRow[] }) {
  const staff = bundle.staff.filter((item) => item.active);
  const lines = [{ id: "", name: staff.length ? "Todos" : "" }, ...staff.map((item) => ({ id: item.id, name: item.name }))];
  const current = (id: string) => delays.find((item) => (item.staff_id ?? "") === id)?.minutes ?? 0;
  return (
    <details className="card p-4 sm:p-5" open={delays.length > 0}>
      <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-2 text-sm font-semibold text-text">
        <span>Estamos com atraso?</span>
        {delays.length ? (
          <span className="rounded-full bg-gold-soft px-2.5 py-0.5 text-xs font-semibold text-gold-text">
            {delays.map((item) => `${item.staff_id ? (staff.find((person) => person.id === item.staff_id)?.name ?? "") : "Todos"}: +${item.minutes} min`).join(" · ")}
          </span>
        ) : (
          <span className="text-xs font-normal text-muted">Avise os clientes das próximas horas</span>
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
          Só para hoje. Os clientes das próximas 3 horas recebem um email com a hora prevista (só quando o atraso aumenta) e todos veem o aviso no link da reserva. Nenhuma
          reserva muda de hora.
        </p>
      </div>
    </details>
  );
}

function Tile({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="card flex flex-col gap-1 p-4">
      <span className="text-sm text-muted">{label}</span>
      <span className="display text-3xl tabular-nums">{value}</span>
      <span className="text-xs text-subtle">{hint}</span>
    </div>
  );
}

export async function BookingsModule({ userId, viewer, basePath, query, productId }: ModuleProps) {
  const establishments = await moduleEstablishments(userId, productId);
  const current = pickEstablishment(establishments, query);
  if (!current) return <NoEstablishment productId={productId} viewer={viewer} ownerId={userId} />;
  const view = pickView(query, views);
  const [bundle, page] = await Promise.all([loadBundle(current), ensureBookingPage(current)]);
  const nav = <ModuleNav basePath={basePath} establishments={establishments} current={current} views={views} view={view} />;
  const origin = await requestOrigin();
  const publicUrl = `${origin}/reservar/${current.slug}`;
  const linkTo = (params: Record<string, string>) =>
    `${basePath}?${new URLSearchParams({ ...(establishments.length > 1 ? { loja: current.slug } : {}), ...params })}`;

  const warnings: string[] = [];
  if (!page.active) warnings.push("A página de reservas está fechada: os clientes ainda não conseguem reservar online.");
  if (!bundle.hours.length) warnings.push("Falta o horário: sem ele não há horas para reservar.");
  if (page.mode === "service" && !bundle.services.some((item) => item.active)) warnings.push("Falta pelo menos um serviço ativo (com a duração).");
  const warningBox = warnings.length ? (
    <div className="rounded-2xl border border-gold/40 bg-gold-soft px-4 py-3 text-sm text-gold-text">
      <ul className="flex flex-col gap-1">
        {warnings.map((warning) => (
          <li key={warning}>{warning}</li>
        ))}
      </ul>
      <Link href={linkTo({ vista: "definicoes" })} className="mt-1 inline-block font-semibold underline">
        Abrir definições
      </Link>
    </div>
  ) : null;

  if (view === "proximas") {
    const upcoming = await loadUpcoming(current, 14);
    return (
      <div className="flex flex-col gap-6">
        {nav}
        <p className="-mt-2 text-sm text-muted">Reservas confirmadas nos próximos 14 dias.</p>
        {upcoming.length ? (
          <ul className="flex flex-col gap-2">
            {upcoming.map((booking) => (
              <BookingCard key={booking.id} booking={booking} bundle={bundle} showDate />
            ))}
          </ul>
        ) : (
          <EmptyState>Sem reservas nos próximos 14 dias.</EmptyState>
        )}
      </div>
    );
  }

  if (view === "estatisticas") {
    const stats = await loadBookingStats(current);
    const rate = (value: number) => (stats.total ? `${Math.round((value / stats.total) * 100)}%` : "–");
    return (
      <div className="flex flex-col gap-6">
        {nav}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Tile label="Reservas" value={String(stats.total)} hint={`Nos últimos ${stats.days} dias (já passadas).`} />
          <Tile label="Online" value={rate(stats.online)} hint={`${stats.online} feitas pelos clientes na página de reservas.`} />
          <Tile label="Faltas" value={rate(stats.noShow)} hint={`${stats.noShow} marcadas como «não compareceu».`} />
          <Tile label="Cancelamentos" value={rate(stats.cancelled)} hint={`${stats.cancelled} canceladas pelo cliente ou pela equipa.`} />
        </div>
        <p className="text-sm text-muted">
          Marque cada reserva como «chegou» ou «não compareceu»: com esses dados percebe em que dias há mais faltas e se vale a pena pedir confirmação.
        </p>
      </div>
    );
  }

  if (view === "definicoes") {
    return (
      <div className="flex flex-col gap-6">
        {nav}
        {warningBox}
        <PageSettings page={page} establishmentId={current.id} calendarUrl={`${origin}/api/agenda/${page.calendar_token}`} />
        <EstablishmentSettings
          bundle={bundle}
          viewer={viewer}
          sections={page.mode === "service" ? ["hours", "closures", "services", "staff", "details"] : ["hours", "closures", "details"]}
        />
      </div>
    );
  }

  if (view === "link") {
    const embed = `<iframe src="${publicUrl}" title="Reservas ${current.name}" style="width:100%;max-width:520px;height:900px;border:0;border-radius:16px"></iframe>`;
    const button = `<a href="${publicUrl}" target="_blank" rel="noopener" style="display:inline-block;padding:14px 22px;border-radius:999px;background:${current.accent_color};color:${readableTextOn(current.accent_color)};font-weight:600;text-decoration:none">Reservar</a>`;
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
            sub: "Aponte a câmara ao código para ver os horários livres.",
            name: current.name,
            color: current.accent_color,
            textColor: readableTextOn(current.accent_color),
          }}
          extra={
            <div className="mt-5 flex flex-col gap-4 border-t border-line pt-4">
              {[
                { label: "Botão para o site", code: button },
                { label: "Agenda dentro do site (iframe)", code: embed },
              ].map((item) => (
                <div key={item.label} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-text">{item.label}</span>
                    <CopyButton value={item.code} label="Copiar código" />
                  </div>
                  <pre className="overflow-x-auto rounded-xl border border-line bg-surface-2/60 p-3 text-xs whitespace-pre-wrap text-muted">{item.code}</pre>
                </div>
              ))}
            </div>
          }
        />
      </div>
    );
  }

  // Agenda of one day.
  const today = zonedDateString(new Date(), current.time_zone);
  const requested = queryValue(query, "dia");
  const date = /^\d{4}-\d{2}-\d{2}$/.test(requested) ? requested : today;
  const [{ bookings, blocks }, delays] = await Promise.all([loadDay(current, date), loadDelays(current, date)]);
  const late = lateBookingIds(bookings, page);
  const live = bookings.filter((booking) => booking.status !== "cancelled");
  const covers = live.reduce((sum, booking) => sum + (booking.party_size ?? 0), 0);
  const dayLabel = new Intl.DateTimeFormat("pt-PT", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }).format(new Date(`${date}T12:00:00Z`));
  const localMinutes = (iso: string) => {
    const [h, m] = time(iso, current.time_zone).split(":").map(Number);
    return h * 60 + m;
  };
  type Group = { key: string; title: string; items: EstablishmentBookingRow[]; meter?: { ratio: number; label: string } };
  let groups: Group[];
  if (page.mode === "table") {
    // By service: lunch and dinner (the opening intervals of the day), with how full each one gets.
    const weekday = new Date(`${date}T12:00:00Z`).getUTCDay();
    const intervals = bundle.hours
      .filter((row) => row.weekday === weekday)
      .map((row) => ({ opens: Number(row.opens.slice(0, 2)) * 60 + Number(row.opens.slice(3, 5)), closes: Number(row.closes.slice(0, 2)) * 60 + Number(row.closes.slice(3, 5)) }))
      .sort((x, y) => x.opens - y.opens);
    const name = (opens: number) => (opens < 16 * 60 ? "Almoço" : "Jantar");
    groups = intervals.map((interval, index) => ({ key: `i${index}`, title: `${name(interval.opens)} · ${String(Math.floor(interval.opens / 60)).padStart(2, "0")}:${String(interval.opens % 60).padStart(2, "0")}–${String(Math.floor(interval.closes / 60)).padStart(2, "0")}:${String(interval.closes % 60).padStart(2, "0")}`, items: [] as EstablishmentBookingRow[] }));
    const other: Group = { key: "other", title: "Fora do horário", items: [] };
    for (const booking of bookings) {
      const minute = localMinutes(booking.starts_at);
      const index = intervals.findIndex((interval) => minute >= interval.opens && minute < interval.closes);
      (index >= 0 ? groups[index] : other).items.push(booking);
    }
    for (const group of groups) {
      const held = group.items.filter((booking) => booking.status === "confirmed" || booking.status === "arrived");
      const people = held.reduce((sum, booking) => sum + (booking.party_size ?? 1), 0);
      const peak = peakSeated(
        held.map((booking) => ({ start: Date.parse(booking.starts_at), end: Date.parse(booking.ends_at), party: booking.party_size ?? 1 })),
        Math.min(...held.map((booking) => Date.parse(booking.starts_at)), Infinity),
        Math.max(...held.map((booking) => Date.parse(booking.ends_at)), 0),
      );
      group.title += ` · ${people} ${people === 1 ? "pessoa" : "pessoas"}`;
      if (held.length) group.meter = { ratio: peak / page.seats_per_slot, label: `até ${peak} de ${page.seats_per_slot} lugares ao mesmo tempo` };
    }
    groups = [...groups, other].filter((group) => group.items.length);
  } else {
    // By professional.
    const staff = bundle.staff;
    const byStaff = new Map<string, EstablishmentBookingRow[]>();
    for (const booking of bookings) {
      const key = booking.staff_id ?? "none";
      byStaff.set(key, [...(byStaff.get(key) ?? []), booking]);
    }
    groups = [...byStaff.entries()]
      .map(([key, items]) => ({ key, title: key === "none" ? "Sem profissional" : (staff.find((item) => item.id === key)?.name ?? "Profissional"), items }))
      .sort((x, y) => x.title.localeCompare(y.title, "pt"));
    for (const group of groups) {
      const held = group.items.filter((booking) => booking.status !== "cancelled").length;
      group.title += ` · ${held} ${held === 1 ? "marcação" : "marcações"}`;
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {nav}
      <AutoRefresh intervalMs={30_000} />
      {warningBox}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="display text-2xl first-letter:uppercase">{date === today ? `Hoje, ${dayLabel}` : dayLabel}</h2>
          <p className="text-sm text-muted">
            {live.length} {page.mode === "table" ? (live.length === 1 ? "reserva" : "reservas") : live.length === 1 ? "marcação" : "marcações"}
            {page.mode === "table" && covers ? ` · ${covers} pessoas` : ""}
          </p>
        </div>
        <nav aria-label="Dia" className="flex flex-wrap items-center gap-1">
          <Link href={linkTo({ dia: addDaysToDate(date, -1) })} className="rounded-full px-3 py-2 text-sm font-semibold text-muted hover:bg-surface-2 hover:text-text" aria-label="Dia anterior">
            ←
          </Link>
          {date !== today ? (
            <Link href={linkTo({})} className="rounded-full px-3 py-2 text-sm font-semibold text-muted hover:bg-surface-2 hover:text-text">
              Hoje
            </Link>
          ) : null}
          <Link href={linkTo({ dia: addDaysToDate(date, 1) })} className="rounded-full px-3 py-2 text-sm font-semibold text-muted hover:bg-surface-2 hover:text-text" aria-label="Dia seguinte">
            →
          </Link>
          <form method="get" action={basePath} className="ml-1 flex shrink-0 items-center gap-2">
            {establishments.length > 1 ? <input type="hidden" name="loja" value={current.slug} /> : null}
            <input type="date" name="dia" defaultValue={date} aria-label="Escolher dia" className={`${adminInputClasses} h-9 w-auto text-sm`} />
            <button type="submit" className="h-9 shrink-0 whitespace-nowrap rounded-full border border-line px-4 text-sm font-semibold text-text hover:bg-surface-2">
              Ver dia
            </button>
          </form>
        </nav>
      </div>

      {blocks.length ? (
        <ul className="flex flex-col gap-2">
          {blocks.map((block) => (
            <li key={block.id} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-dashed border-line-strong px-4 py-2.5 text-sm">
              <span className="text-text">
                Bloqueado {time(block.starts_at, current.time_zone)}–{time(block.ends_at, current.time_zone)}
                {block.staff_id ? ` · ${bundle.staff.find((item) => item.id === block.staff_id)?.name ?? ""}` : " · todos"}
                {block.reason ? <span className="text-muted"> · {block.reason}</span> : null}
              </span>
              <ActionForm action={removeBlock} hideMessage>
                <input type="hidden" name="establishment_id" value={current.id} />
                <input type="hidden" name="block_id" value={block.id} />
                <SubmitButton size="sm" variant="ghost">
                  Desbloquear
                </SubmitButton>
              </ActionForm>
            </li>
          ))}
        </ul>
      ) : null}

      <NewBookingForm bundle={bundle} page={page} date={date} />
      {date === today ? <DelayControl bundle={bundle} delays={delays} /> : null}

      {bookings.length ? (
        groups.map((group) => (
          <section key={group.key} aria-label={group.title} className="flex flex-col gap-2">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-sm font-semibold text-muted">{group.title}</h3>
              {group.meter ? (
                <span className="flex items-center gap-2 text-xs text-muted">
                  <span className="h-1.5 w-24 overflow-hidden rounded-full bg-surface-2">
                    <span className={`block h-full rounded-full ${group.meter.ratio >= 1 ? "bg-danger" : "bg-accent"}`} style={{ width: `${Math.min(100, group.meter.ratio * 100)}%` }} />
                  </span>
                  {group.meter.label}
                </span>
              ) : null}
            </div>
            <ul className="flex flex-col gap-2">
              {group.items.map((booking) => (
                <BookingCard key={booking.id} booking={booking} bundle={bundle} late={late.has(booking.id)} />
              ))}
            </ul>
          </section>
        ))
      ) : (
        <EmptyState>{page.mode === "table" ? "Sem reservas neste dia." : "Sem marcações neste dia."}</EmptyState>
      )}

      <BlockForm bundle={bundle} date={date} />
    </div>
  );
}

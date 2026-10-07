import Link from "next/link";
import type { ReactNode } from "react";
import { ActionForm, SubmitButton } from "@/components/backoffice/ActionForm";
import { EmptyState, Panel, adminInputClasses, adminLabelClasses } from "@/components/backoffice/ui";
import { requestOrigin } from "@/lib/booking/request";
import { addDaysToDate, zonedDateString } from "@/lib/booking/slots";
import { readableTextOn } from "@/lib/establishments/kinds";
import { listOwnerEstablishments, loadBundle } from "@/lib/establishments/store";
import type { EstablishmentBundle } from "@/lib/establishments/types";
import { addBlock, removeBlock, rotateCalendarToken, saveBookingPage, setBookingStatus, staffCreateBooking } from "@/lib/modules/bookings/actions";
import { bookingSummary } from "@/lib/modules/bookings/notify";
import {
  bookingStatusLabels,
  ensureBookingPage,
  loadBookingStats,
  loadDay,
  loadUpcoming,
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

function time(iso: string, timeZone: string): string {
  return new Intl.DateTimeFormat("pt-PT", { timeZone, hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
}

function BookingCard({ booking, bundle, showDate = false }: { booking: EstablishmentBookingRow; bundle: EstablishmentBundle; showDate?: boolean }) {
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
    <li className={`card flex flex-col gap-3 p-4 ${booking.status === "cancelled" ? "opacity-70" : ""}`}>
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
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${statusTone[booking.status]}`}>{bookingStatusLabels[booking.status]}</span>
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

function NewBookingForm({ bundle, page, date }: { bundle: EstablishmentBundle; page: BookingPageRow; date: string }) {
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
          Nova reserva (telefone ou balcão)
        </span>
      </summary>
      <ActionForm action={staffCreateBooking} className="mt-4 grid gap-3 sm:grid-cols-2">
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
      <summary className="cursor-pointer text-sm font-semibold text-text">Bloquear um horário</summary>
      <ActionForm action={addBlock} className="mt-4 grid gap-3 sm:grid-cols-4">
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

function PageSettings({ page, establishmentId, calendarUrl }: { page: BookingPageRow; establishmentId: string; calendarUrl: string }) {
  const input = `${adminInputClasses} h-11`;
  return (
    <>
      <Panel title="Página de reservas">
        <ActionForm action={saveBookingPage} className="grid gap-4 sm:grid-cols-2">
          <input type="hidden" name="establishment_id" value={establishmentId} />
          <label className="flex items-center gap-2 text-sm font-semibold text-text sm:col-span-2">
            <input type="checkbox" name="active" defaultChecked={page.active} className="h-4.5 w-4.5 accent-accent" />
            Aceitar reservas online
          </label>
          <label className={adminLabelClasses}>
            Tipo de reserva
            <select name="mode" defaultValue={page.mode} className={input}>
              <option value="table">Mesas (nº de pessoas e lotação)</option>
              <option value="service">Serviços (duração e profissional)</option>
            </select>
          </label>
          <label className={adminLabelClasses}>
            Intervalo entre horários (min)
            <input name="slot_interval_minutes" type="number" min={5} max={120} step={5} required defaultValue={page.slot_interval_minutes} className={input} />
          </label>
          <label className={adminLabelClasses}>
            Antecedência mínima (horas)
            <input name="min_notice_hours" inputMode="decimal" required defaultValue={String(page.min_notice_minutes / 60).replace(".", ",")} className={input} />
          </label>
          <label className={adminLabelClasses}>
            Reservas até quantos dias à frente
            <input name="max_days_ahead" type="number" min={1} max={365} required defaultValue={page.max_days_ahead} className={input} />
          </label>
          <fieldset className="grid gap-4 rounded-2xl bg-surface-2/60 p-3 sm:col-span-2 sm:grid-cols-3">
            <legend className="px-1 text-xs font-semibold text-muted">Só para mesas</legend>
            <label className={adminLabelClasses}>
              Lugares por horário
              <input name="seats_per_slot" type="number" min={1} max={1000} required defaultValue={page.seats_per_slot} className={input} />
            </label>
            <label className={adminLabelClasses}>
              Máximo por grupo online
              <input name="max_party" type="number" min={1} max={100} required defaultValue={page.max_party} className={input} />
            </label>
            <label className={adminLabelClasses}>
              Duração de uma mesa (min)
              <input name="table_minutes" type="number" min={15} max={480} step={5} required defaultValue={page.table_minutes} className={input} />
            </label>
          </fieldset>
          <label className={adminLabelClasses}>
            Cancelar/alterar online até (horas antes)
            <input name="cancel_until_hours" type="number" min={0} max={336} required defaultValue={page.cancel_until_hours} className={input} />
          </label>
          <label className="flex items-center gap-2 self-end text-sm text-text">
            <input type="checkbox" name="notify_owner" defaultChecked={page.notify_owner} className="h-4.5 w-4.5 accent-accent" />
            Receber email a cada reserva ou cancelamento
          </label>
          <label className={`${adminLabelClasses} sm:col-span-2`}>
            Nota na confirmação (opcional)
            <input name="confirmation_note" maxLength={300} defaultValue={page.confirmation_note ?? ""} placeholder="Ex.: Estacionamento gratuito nas traseiras." className={input} />
          </label>
          <label className={`${adminLabelClasses} sm:col-span-2`}>
            Política de cancelamento (opcional)
            <textarea name="policy" rows={2} maxLength={600} defaultValue={page.policy ?? ""} placeholder="Ex.: Pedimos que cancele com pelo menos 2 horas de antecedência." className={`${adminInputClasses} py-2`} />
          </label>
          <div className="sm:col-span-2">
            <SubmitButton size="sm">Guardar</SubmitButton>
          </div>
        </ActionForm>
      </Panel>
      <Panel title="Ver as reservas no seu calendário">
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
  const establishments = await listOwnerEstablishments(userId);
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
  if (page.mode === "service" && !bundle.services.some((item) => item.active)) warnings.push("Falta pelo menos um serviço ativo.");
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
  const { bookings, blocks } = await loadDay(current, date);
  const live = bookings.filter((booking) => booking.status !== "cancelled");
  const covers = live.reduce((sum, booking) => sum + (booking.party_size ?? 0), 0);
  const dayLabel = new Intl.DateTimeFormat("pt-PT", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }).format(new Date(`${date}T12:00:00Z`));

  return (
    <div className="flex flex-col gap-5">
      {nav}
      <AutoRefresh intervalMs={30_000} />
      {warningBox}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="display text-2xl first-letter:uppercase">{date === today ? `Hoje, ${dayLabel}` : dayLabel}</h2>
          <p className="text-sm text-muted">
            {live.length} {live.length === 1 ? "reserva" : "reservas"}
            {page.mode === "table" && covers ? ` · ${covers} pessoas` : ""}
          </p>
        </div>
        <nav aria-label="Dia" className="flex items-center gap-1">
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
          <form method="get" action={basePath} className="ml-1 flex items-center gap-1">
            {establishments.length > 1 ? <input type="hidden" name="loja" value={current.slug} /> : null}
            <input type="date" name="dia" defaultValue={date} aria-label="Escolher dia" className={`${adminInputClasses} h-9 w-auto text-sm`} />
            <button type="submit" className="rounded-full px-3 py-2 text-sm font-semibold text-muted hover:bg-surface-2 hover:text-text">
              Ir
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

      {bookings.length ? (
        <ul className="flex flex-col gap-2">
          {bookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} bundle={bundle} />
          ))}
        </ul>
      ) : (
        <EmptyState>Sem reservas neste dia.</EmptyState>
      )}

      <NewBookingForm bundle={bundle} page={page} date={date} />
      <BlockForm bundle={bundle} date={date} />
    </div>
  );
}

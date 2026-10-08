"use client";

import { useActionState, useEffect, useMemo, useState, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { AlertIcon } from "@/components/icons";
import { Skeleton } from "@/components/ui/Skeleton";
import { createBooking } from "@/lib/modules/bookings/actions";
import { brandButton, brandSecondaryButton, publicInput, publicLabel } from "../BrandFrame";

export interface WizardService {
  id: string;
  name: string;
  minutes: number;
  price: string | null;
}

export interface WizardOption {
  id: string;
  name: string;
}

interface DaySlots {
  date: string;
  weekday: number;
  slots: { start: string; time: string }[];
}

const dayFormat = new Intl.DateTimeFormat("pt-PT", { weekday: "short", timeZone: "UTC" });
const longFormat = new Intl.DateTimeFormat("pt-PT", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });
const noon = (date: string) => new Date(`${date}T12:00:00Z`);

function addDays(date: string, days: number): string {
  const value = noon(date);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} aria-busy={pending} className={brandButton}>
      {pending ? <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" /> : null}
      {pending ? "A reservar…" : "Confirmar reserva"}
    </button>
  );
}

function StepTitle({ number, children }: { number: number; children: ReactNode }) {
  return (
    <h2 className="flex items-center gap-2.5 text-lg font-semibold text-text">
      <span className="grid h-7 w-7 place-items-center rounded-full bg-[var(--brand)] text-sm text-[var(--brand-text)]">{number}</span>
      {children}
    </h2>
  );
}

const pageDays = 14;

/** Slots split by part of the day: lunch and dinner (tables), morning, afternoon and evening (services). */
function periods<T extends { time: string }>(slots: T[], mode: "table" | "service"): { label: string; slots: T[] }[] {
  const label = (time: string) => {
    const hour = Number(time.slice(0, 2));
    if (mode === "table") return hour < 16 ? "Almoço" : "Jantar";
    return hour < 13 ? "Manhã" : hour < 20 ? "Tarde" : "Noite";
  };
  const groups: { label: string; slots: T[] }[] = [];
  for (const slot of slots) {
    const name = label(slot.time);
    const last = groups[groups.length - 1];
    if (last && last.label === name) last.slots.push(slot);
    else groups.push({ label: name, slots: [slot] });
  }
  return groups;
}

export function BookingWizard({
  slug,
  mode,
  services,
  staff,
  maxParty,
  replaceToken,
  initial,
  policy,
}: {
  slug: string;
  mode: "table" | "service";
  services: WizardService[];
  staff: WizardOption[];
  maxParty: number;
  replaceToken: string | null;
  initial: { service: string | null; staff: string | null; party: number };
  policy: string | null;
}) {
  const [service, setService] = useState(initial.service ?? services[0]?.id ?? "");
  const [person, setPerson] = useState(initial.staff ?? "");
  const [party, setParty] = useState(Math.min(maxParty, Math.max(1, initial.party)));
  const [from, setFrom] = useState<string | null>(null);
  const [days, setDays] = useState<DaySlots[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [date, setDate] = useState<string | null>(null);
  const [start, setStart] = useState<string | null>(null);
  const [state, formAction] = useActionState(createBooking, null);

  const query = useMemo(() => {
    const params = new URLSearchParams({ days: String(pageDays) });
    if (mode === "service") {
      params.set("service", service);
      if (person) params.set("staff", person);
    } else params.set("party", String(party));
    if (from) params.set("from", from);
    return params.toString();
  }, [mode, service, person, party, from]);

  useEffect(() => {
    if (mode === "service" && !service) return;
    let cancelled = false;
    const controller = new AbortController();
    // Show the skeleton only if the answer takes more than ~300 ms (no flashing).
    const slow = window.setTimeout(() => setLoading(true), 300);
    fetch(`/api/reservar/${slug}/disponibilidade?${query}`, { signal: controller.signal, cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error(String(response.status));
        const body = (await response.json()) as { days: DaySlots[] };
        if (cancelled) return;
        setDays(body.days);
        setFailed(false);
        const firstOpen = body.days.find((day) => day.slots.length)?.date ?? null;
        setDate((current) => (current && body.days.some((day) => day.date === current && day.slots.length) ? current : firstOpen));
        setStart(null);
      })
      .catch((error: unknown) => {
        if (!cancelled && !(error instanceof DOMException && error.name === "AbortError")) setFailed(true);
      })
      .finally(() => {
        window.clearTimeout(slow);
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
      window.clearTimeout(slow);
      controller.abort();
    };
  }, [slug, query, mode, service]);

  const selectedDay = days?.find((day) => day.date === date) ?? null;
  const chosenService = services.find((item) => item.id === service);
  const chosenSlot = selectedDay?.slots.find((slot) => slot.start === start) ?? null;
  const lastDay = days?.length ? days[days.length - 1].date : null;
  const busy = loading;

  return (
    <div className="flex flex-col gap-5">
      <section className="card flex flex-col gap-4 p-5">
        <StepTitle number={1}>{mode === "service" ? "O que deseja marcar?" : "Quantas pessoas?"}</StepTitle>
        {mode === "service" ? (
          <>
            <fieldset className="flex flex-col gap-2">
              <legend className="sr-only">Serviço</legend>
              {services.map((item) => (
                <label
                  key={item.id}
                  className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-line bg-surface-2/40 px-4 py-3.5 transition-colors has-[:checked]:border-[var(--brand)] has-[:checked]:bg-[color-mix(in_oklab,var(--brand)_10%,var(--surface))]"
                >
                  <span className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="service-choice"
                      value={item.id}
                      checked={service === item.id}
                      onChange={() => {
                        setService(item.id);
                        setFrom(null);
                      }}
                      className="h-4.5 w-4.5 accent-[var(--brand)]"
                    />
                    <span className="font-semibold text-text">{item.name}</span>
                  </span>
                  <span className="shrink-0 text-sm text-muted">
                    {item.minutes} min{item.price ? ` · ${item.price}` : ""}
                  </span>
                </label>
              ))}
            </fieldset>
            {staff.length ? (
              <fieldset className="flex flex-col gap-2">
                <legend className="mb-1 text-sm font-semibold text-text">Com quem?</legend>
                <div className="flex flex-wrap gap-2">
                  {[{ id: "", name: "Qualquer um" }, ...staff].map((item) => (
                    <button
                      key={item.id || "any"}
                      type="button"
                      aria-pressed={person === item.id}
                      onClick={() => {
                        setPerson(item.id);
                        setFrom(null);
                      }}
                      className={`h-11 rounded-full border px-4 text-sm font-semibold transition-colors ${
                        person === item.id ? "border-transparent bg-[var(--brand)] text-[var(--brand-text)]" : "border-line text-text hover:border-line-strong"
                      }`}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
                {person === "" ? <p className="text-xs text-subtle">Com «qualquer um» vê mais horários.</p> : null}
              </fieldset>
            ) : null}
          </>
        ) : (
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              aria-label="Menos uma pessoa"
              onClick={() => setParty((value) => Math.max(1, value - 1))}
              className={`${brandSecondaryButton} !w-14`}
              disabled={party <= 1}
            >
              −
            </button>
            <p className="display text-4xl tabular-nums" aria-live="polite">
              {party} <span className="text-lg text-muted">{party === 1 ? "pessoa" : "pessoas"}</span>
            </p>
            <button
              type="button"
              aria-label="Mais uma pessoa"
              onClick={() => setParty((value) => Math.min(maxParty, value + 1))}
              className={`${brandSecondaryButton} !w-14`}
              disabled={party >= maxParty}
            >
              +
            </button>
          </div>
        )}
        {mode === "table" ? <p className="-mt-2 text-center text-xs text-subtle">Grupos maiores de {maxParty}: contacte-nos diretamente.</p> : null}
      </section>

      <section className="card flex flex-col gap-4 p-5" aria-busy={busy}>
        <StepTitle number={2}>Dia e hora</StepTitle>
        {busy ? (
          <div className="flex flex-col gap-4">
            <span role="status" className="sr-only">
              A carregar horários…
            </span>
            <div className="flex gap-2 overflow-hidden">
              {Array.from({ length: 6 }, (_, index) => (
                <Skeleton key={index} className="h-16 w-14 shrink-0 rounded-2xl" />
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 6 }, (_, index) => (
                <Skeleton key={index} className="h-11 rounded-xl" />
              ))}
            </div>
          </div>
        ) : failed ? (
          <p role="alert" className="text-sm text-danger">
            Não foi possível carregar os horários. Verifique a ligação e tente de novo.
          </p>
        ) : days && days.length ? (
          <>
            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:thin]" role="listbox" aria-label="Dia">
              {days.map((day) => {
                const open = day.slots.length > 0;
                const selected = day.date === date;
                return (
                  <button
                    key={day.date}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    disabled={!open}
                    onClick={() => {
                      setDate(day.date);
                      setStart(null);
                    }}
                    className={`flex w-[3.6rem] shrink-0 flex-col items-center rounded-2xl border px-1 py-2.5 text-xs transition-colors ${
                      selected
                        ? "border-transparent bg-[var(--brand)] text-[var(--brand-text)]"
                        : open
                          ? "border-line text-text hover:border-line-strong"
                          : "border-transparent text-subtle line-through opacity-50"
                    }`}
                  >
                    <span className="capitalize">{dayFormat.format(noon(day.date)).replace(".", "")}</span>
                    <span className="text-lg font-semibold tabular-nums">{noon(day.date).getUTCDate()}</span>
                  </button>
                );
              })}
              {lastDay ? (
                <button
                  type="button"
                  onClick={() => {
                    setFrom(addDays(lastDay, 1));
                    setDate(null);
                  }}
                  className="flex w-14 shrink-0 flex-col items-center justify-center rounded-2xl border border-dashed border-line-strong px-1 py-2 text-xs font-semibold text-muted hover:text-text"
                >
                  Mais dias →
                </button>
              ) : null}
            </div>
            {from ? (
              <button type="button" onClick={() => setFrom(null)} className="-mt-2 self-start text-xs font-semibold text-muted hover:text-text">
                ← Voltar a hoje
              </button>
            ) : null}
            {selectedDay ? (
              <div className="flex flex-col gap-2">
                <p className="text-sm font-semibold text-text first-letter:uppercase">{longFormat.format(noon(selectedDay.date))}</p>
                {periods(selectedDay.slots, mode).map((period) => (
                <div key={period.label} className="flex flex-col gap-2">
                <p className="text-xs font-semibold text-muted">{period.label}</p>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4" role="listbox" aria-label={`Hora · ${period.label}`}>
                  {period.slots.map((slot) => (
                    <button
                      key={slot.start}
                      type="button"
                      role="option"
                      aria-selected={slot.start === start}
                      onClick={() => setStart(slot.start)}
                      className={`h-12 rounded-2xl border text-base font-semibold tabular-nums transition-colors ${
                        slot.start === start ? "border-transparent bg-[var(--brand)] text-[var(--brand-text)]" : "border-line text-text hover:border-line-strong"
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
                </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted">Sem horários livres nestes dias. Veja os dias seguintes.</p>
            )}
          </>
        ) : (
          <p className="text-sm text-muted">Sem horários disponíveis.</p>
        )}
      </section>

      {chosenSlot && selectedDay ? (
        <section className="card flex flex-col gap-4 p-5">
          <StepTitle number={3}>Os seus dados</StepTitle>
          <p className="rounded-2xl bg-surface-2/70 px-4 py-3 text-sm text-text">
            <strong className="first-letter:uppercase">{longFormat.format(noon(selectedDay.date))}</strong>, às <strong>{chosenSlot.time}</strong>
            <br />
            {mode === "service"
              ? `${chosenService?.name ?? ""}${person ? ` com ${staff.find((item) => item.id === person)?.name ?? ""}` : ""}`
              : `${party} ${party === 1 ? "pessoa" : "pessoas"}`}
          </p>
          <form action={formAction} className="flex flex-col gap-4">
            <input type="hidden" name="slug" value={slug} />
            <input type="hidden" name="start" value={chosenSlot.start} />
            <input type="hidden" name="service" value={mode === "service" ? service : ""} />
            <input type="hidden" name="staff" value={mode === "service" ? person : ""} />
            <input type="hidden" name="party" value={String(party)} />
            {replaceToken ? <input type="hidden" name="replace_token" value={replaceToken} /> : null}
            <div aria-hidden="true" className="hidden">
              <label>
                Website
                <input name="website_url" tabIndex={-1} autoComplete="off" />
              </label>
            </div>
            <label className={publicLabel}>
              Nome
              <input name="name" required maxLength={80} autoComplete="name" className={publicInput} />
            </label>
            <label className={publicLabel}>
              Email
              <input name="email" type="email" maxLength={200} autoComplete="email" inputMode="email" placeholder="Para receber a confirmação" className={publicInput} />
            </label>
            <label className={publicLabel}>
              Telemóvel
              <input name="phone" type="tel" maxLength={40} autoComplete="tel" className={publicInput} />
            </label>
            <label className={publicLabel}>
              Notas (opcional)
              <textarea name="notes" rows={2} maxLength={500} placeholder="Alergias, cadeira de bebé, pedidos especiais…" className={`${publicInput} h-auto py-2.5`} />
            </label>
            {policy ? <p className="text-xs text-muted">{policy}</p> : null}
            {state && !state.ok ? (
              <p role="alert" className="flex items-center gap-1.5 text-sm text-danger">
                <AlertIcon size={15} />
                {state.message}
              </p>
            ) : null}
            <Submit />
            <p className="text-xs text-subtle">Os seus dados são usados apenas para gerir esta reserva.</p>
          </form>
        </section>
      ) : null}
    </div>
  );
}

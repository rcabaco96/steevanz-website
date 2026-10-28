"use client";

import { AnimatePresence, m } from "motion/react";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import type { RoazCopy } from "@/content/roaz/copy";
import { roaz, roazDuration, roazPrice, roazWhatsappHref } from "@/content/roaz/facts";
import { ChatIcon, CloseIcon, MinusIcon, PhoneIcon, PlusIcon, TicketIcon } from "./icons";
import { Wordmark } from "./Logo";
import { pickTourEvent } from "./sections";

const weekdays = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
const weekdaysLong = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];
const months = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

/** Today's date (local), read in the browser only: the server never guesses the visitor's day. */
const noop = () => () => {};
const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
};

interface Day {
  key: string;
  short: string;
  day: number;
  long: string;
}

/** «2 adultos e 1 criança» */
function peopleLabel(adults: number, children: number): string {
  const a = `${adults} ${adults === 1 ? "adulto" : "adultos"}`;
  if (!children) return a;
  return `${a} e ${children} ${children === 1 ? "criança" : "crianças"}`;
}

// The «Sistema de reservas online» demo, in five small steps: the trip, the day (the next eight days), the time
// (that trip's departures), who comes (adults and children, up to the boat's seats) and a name. It shows the total
// without VAT («+ IVA»), then a sample ticket and the WhatsApp message written for the visitor. Nothing is stored, no
// payment, no availability promised; the number belongs to no one, and the page says so.
export function BookingForm({ copy }: { copy: RoazCopy }) {
  const { booking, tours } = copy;
  const [tourId, setTourId] = useState<string>(tours.list[0].id);
  const [dayKey, setDayKey] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [name, setName] = useState("");
  const [ticket, setTicket] = useState(false);
  const today = useSyncExternalStore(noop, todayKey, () => null);

  useEffect(() => {
    const onPick = (event: Event) => {
      const id = (event as CustomEvent<string>).detail;
      if (tours.list.some((t) => t.id === id)) {
        setTourId(id);
        setTime(null);
        setTicket(false);
      }
    };
    window.addEventListener(pickTourEvent, onPick);
    return () => window.removeEventListener(pickTourEvent, onPick);
  }, [tours.list]);

  const tour = tours.list.find((t) => t.id === tourId) ?? tours.list[0];

  const days = useMemo<Day[]>(() => {
    if (!today) return [];
    const [y, mo, d] = today.split("-").map(Number);
    return Array.from({ length: 8 }, (_, i) => {
      const date = new Date(y, mo, d + i + 1);
      const wd = date.getDay();
      return {
        key: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
        short: weekdays[wd],
        day: date.getDate(),
        long: `${weekdaysLong[wd]}, ${date.getDate()} de ${months[date.getMonth()]}`,
      };
    });
  }, [today]);

  const day = days.find((d) => d.key === dayKey) ?? null;
  const validTime = time && (tour.departures as readonly string[]).includes(time) ? time : null;
  const people = adults + children;
  const total = adults * tour.adult + children * tour.child;
  const ready = Boolean(day && validTime && adults > 0);
  const tourLabel = `${tour.name} ${tour.nameLine}`;
  const who = name.trim() ? booking.messageName.replace("{nome}", name.trim()) : "";
  const message =
    ready && day && validTime
      ? booking.message
          .replace("{saida}", tourLabel)
          .replace("{dia}", day.long)
          .replace("{hora}", validTime)
          .replace("{pessoas}", peopleLabel(adults, children))
          .replace("{nome}", who)
      : "";

  const chip =
    "flex min-h-11 cursor-pointer items-center justify-center rounded-full px-4 text-[0.95rem] ring-1 ring-tinta/15 transition-colors peer-checked:bg-fundo peer-checked:text-sal peer-checked:ring-fundo peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ocre hover:ring-falesia-deep/60";
  const legend = "rz-label mb-4 text-ocre";
  const stepper = "grid size-11 place-items-center rounded-full ring-1 ring-tinta/20 transition-colors hover:bg-areia disabled:cursor-not-allowed disabled:opacity-35";

  return (
    <form className="relative rounded-[2rem] bg-sal p-5 shadow-[0_30px_70px_-45px_rgb(6_48_58/0.6)] sm:p-9" onSubmit={(e) => e.preventDefault()}>
      <fieldset className="min-w-0">
        <legend className={legend}>{booking.step1}</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {tours.list.map((t) => (
            <label key={t.id} className="relative block">
              <input
                type="radio"
                name="saida"
                value={t.id}
                checked={tourId === t.id}
                onChange={() => {
                  setTourId(t.id);
                  setTime(null);
                  setTicket(false);
                }}
                className="peer sr-only"
              />
              <span className="flex min-h-16 cursor-pointer items-center justify-between gap-3 rounded-2xl px-4 py-3 ring-1 ring-tinta/12 transition-colors peer-checked:bg-areia peer-checked:ring-2 peer-checked:ring-falesia-deep peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ocre hover:ring-falesia-deep/50">
                <span className="min-w-0">
                  <span className="block font-display text-[1.25rem] leading-tight font-bold uppercase">
                    {t.name} {t.nameLine}
                  </span>
                  <span className="block text-[0.82rem] text-pedra">{roazDuration(t.minutes)}</span>
                </span>
                <span className="shrink-0 text-right leading-none whitespace-nowrap">
                  <span className="font-stencil text-[1.35rem] font-bold">{roazPrice(t.adult)}</span>{" "}
                  <span className="rz-label text-[0.6rem] text-ocre">{tours.plusVat}</span>
                </span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-9 min-w-0">
        <legend className={legend}>{booking.step2}</legend>
        {days.length ? (
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
            {days.map((d) => (
              <label key={d.key} className="relative">
                <input
                  type="radio"
                  name="dia"
                  checked={dayKey === d.key}
                  onChange={() => {
                    setDayKey(d.key);
                    setTicket(false);
                  }}
                  className="peer sr-only"
                />
                <span className={`${chip} flex-col rounded-2xl px-1 py-1.5 leading-tight`} title={d.long}>
                  <span className="text-[0.72rem] tracking-[0.12em] uppercase opacity-70">{d.short}</span>
                  <span className="font-stencil text-xl font-bold">{d.day}</span>
                </span>
              </label>
            ))}
          </div>
        ) : (
          <div aria-hidden="true" className="grid grid-cols-4 gap-2 sm:grid-cols-8">
            {Array.from({ length: 8 }, (_, i) => (
              <span key={i} className="h-14 animate-pulse rounded-2xl bg-areia" />
            ))}
          </div>
        )}
        <p className="mt-3 text-xs text-pedra">{booking.dateNote}</p>
      </fieldset>

      <fieldset className="mt-9 min-w-0">
        <legend className={legend}>{booking.step3}</legend>
        <div className="flex flex-wrap gap-2">
          {tour.departures.map((t) => (
            <label key={t} className="relative">
              <input
                type="radio"
                name="hora"
                checked={validTime === t}
                onChange={() => {
                  setTime(t);
                  setTicket(false);
                }}
                className="peer sr-only"
              />
              <span className={`${chip} min-w-20 font-stencil text-[1.1rem] font-bold tabular-nums`}>{t}</span>
            </label>
          ))}
        </div>
        {tour.departureNote ? <p className="mt-3 text-xs text-pedra">{tour.departureNote}</p> : null}
      </fieldset>

      <fieldset className="mt-9 min-w-0">
        <legend className={legend}>{booking.step4}</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { label: booking.adults, sub: `${roazPrice(tour.adult)} ${tours.plusVat}`, value: adults, set: setAdults, min: 1 },
            { label: booking.children, sub: `${tour.childLabel} · ${roazPrice(tour.child)} ${tours.plusVat}`, value: children, set: setChildren, min: 0 },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between gap-3 rounded-2xl px-4 py-3 ring-1 ring-tinta/12">
              <span className="min-w-0">
                <span className="block font-semibold">{row.label}</span>
                <span className="block text-[0.78rem] text-pedra">{row.sub}</span>
              </span>
              <span className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  className={stepper}
                  aria-label={`${booking.less}: ${row.label}`}
                  disabled={row.value <= row.min}
                  onClick={() => {
                    row.set(Math.max(row.min, row.value - 1));
                    setTicket(false);
                  }}
                >
                  <MinusIcon width={16} height={16} />
                </button>
                <output aria-live="polite" className="w-7 text-center font-stencil text-2xl font-bold tabular-nums">
                  {row.value}
                </output>
                <button
                  type="button"
                  className={stepper}
                  aria-label={`${booking.more}: ${row.label}`}
                  disabled={people >= roaz.seats}
                  onClick={() => {
                    row.set(row.value + 1);
                    setTicket(false);
                  }}
                >
                  <PlusIcon width={16} height={16} />
                </button>
              </span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-pedra">{booking.seatsNote.replace("{lugares}", String(roaz.seats))}</p>
      </fieldset>

      <div className="mt-9">
        <label htmlFor="rz-nome" className={`${legend} block`}>
          {booking.step5} <span className="font-sans tracking-normal normal-case text-pedra">{booking.nameOptional}</span>
        </label>
        <input
          id="rz-nome"
          type="text"
          autoComplete="given-name"
          maxLength={60}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={booking.namePlaceholder}
          className="h-13 w-full rounded-full bg-areia px-5 text-base placeholder:text-pedra/70 focus:bg-white focus:outline-2 focus:outline-ocre"
        />
      </div>

      <div className="mt-9 rounded-2xl bg-areia p-5" aria-live="polite">
        <p className="rz-label text-pedra">{booking.summary}</p>
        {ready && day && validTime ? (
          <div className="mt-3">
            <p className="font-display text-[1.6rem] leading-tight font-bold uppercase">{tourLabel}</p>
            <p className="mt-1 text-[0.98rem]">
              {day.long}, às {validTime} · {peopleLabel(adults, children)}
            </p>
            <p className="mt-3 flex items-baseline gap-2">
              <span className="text-sm text-pedra">{booking.total}</span>
              <span className="font-stencil text-[2rem] leading-none font-bold whitespace-nowrap">{roazPrice(total)}</span>
              <span className="rz-label text-[0.66rem] text-ocre">{tours.plusVat}</span>
            </p>
          </div>
        ) : (
          <p className="mt-3 text-pedra">{booking.pending}</p>
        )}
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          disabled={!ready}
          onClick={() => setTicket(true)}
          className="inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-fundo px-4 font-display text-[1.05rem] font-bold tracking-[0.06em] whitespace-nowrap sm:px-6 sm:text-[1.15rem] sm:tracking-[0.08em] text-sal uppercase transition-colors hover:bg-fundo-3 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-1"
        >
          <TicketIcon width={20} height={20} />
          {booking.showTicket}
        </button>
        {ready ? (
          <a
            href={roazWhatsappHref(message)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-falesia px-4 font-display text-[1.05rem] font-bold tracking-[0.06em] whitespace-nowrap sm:px-6 sm:text-[1.15rem] sm:tracking-[0.08em] text-fundo uppercase transition-colors hover:bg-falesia-deep sm:flex-1"
          >
            <ChatIcon width={18} height={18} />
            {booking.send}
            <span className="sr-only"> {copy.newTab}</span>
          </a>
        ) : (
          <span
            aria-disabled="true"
            className="inline-flex h-14 cursor-not-allowed items-center justify-center gap-2.5 rounded-full bg-falesia/40 px-4 font-display text-[1.05rem] font-bold tracking-[0.06em] whitespace-nowrap sm:px-6 sm:text-[1.15rem] sm:tracking-[0.08em] text-fundo/70 uppercase sm:flex-1"
          >
            <ChatIcon width={18} height={18} />
            {booking.send}
          </span>
        )}
      </div>
      <a
        href={roaz.phoneHref}
        className="mt-3 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full font-display text-[1.1rem] font-bold tracking-[0.08em] uppercase ring-1 ring-tinta/25 transition-colors hover:bg-fundo hover:text-sal"
      >
        <PhoneIcon width={17} height={17} />
        {booking.call}
      </a>
      <p className="mt-4 text-xs leading-relaxed text-pedra">{booking.demoNote}</p>

      {/* The sample ticket: a boarding pass with a tear line. */}
      <AnimatePresence>
        {ticket && ready && day && validTime ? (
          <m.div
            key="ticket"
            role="region"
            aria-label={booking.ticketTitle}
            initial={{ opacity: 0, y: 40, rotate: -3 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 overflow-hidden rounded-[1.5rem] bg-fundo text-sal shadow-[0_30px_60px_-30px_rgb(6_48_58/0.9)]"
          >
            <div className="flex items-start justify-between gap-4 p-5 sm:p-6">
              <div>
                <Wordmark className="w-24" />
                <p className="rz-label mt-4 text-[0.66rem] text-agua-claro">{booking.ticketTitle}</p>
                <p className="mt-1 font-display text-[1.8rem] leading-none font-extrabold uppercase">{tourLabel}</p>
              </div>
              <button type="button" onClick={() => setTicket(false)} aria-label={booking.ticketClose} className="grid size-11 shrink-0 place-items-center rounded-full ring-1 ring-sal/30 hover:bg-sal/10">
                <CloseIcon />
              </button>
            </div>
            <dl className="grid grid-cols-2 gap-4 px-5 pb-5 sm:grid-cols-4 sm:px-6">
              <div>
                <dt className="rz-label text-[0.6rem] text-falesia">Dia</dt>
                <dd className="mt-1 text-[0.95rem] leading-snug">{day.long}</dd>
              </div>
              <div>
                <dt className="rz-label text-[0.6rem] text-falesia">Hora</dt>
                <dd className="mt-1 font-stencil text-2xl leading-none font-bold">{validTime}</dd>
              </div>
              <div>
                <dt className="rz-label text-[0.6rem] text-falesia">{booking.step4.replace(/^\d · /, "")}</dt>
                <dd className="mt-1 text-[0.95rem] leading-snug">{peopleLabel(adults, children)}</dd>
              </div>
              <div>
                <dt className="rz-label text-[0.6rem] text-falesia">{booking.ticketBoarding}</dt>
                <dd className="mt-1 text-[0.95rem] leading-snug">{booking.ticketBoardingNote}</dd>
              </div>
            </dl>
            <div aria-hidden="true" className="rz-perforation h-4 bg-fundo" />
            <div className="flex flex-wrap items-center justify-between gap-3 bg-fundo-2 px-5 py-4 sm:px-6">
              <p className="text-[0.85rem]">
                {roaz.meetingPoint}
                {name.trim() ? ` · ${name.trim()}` : ""}
              </p>
              <p className="flex items-baseline gap-2">
                <span className="font-stencil text-2xl font-bold whitespace-nowrap">{roazPrice(total)}</span>
                <span className="rz-label text-[0.6rem] text-falesia">{tours.plusVat}</span>
              </p>
            </div>
            <p className="bg-falesia px-5 py-2 text-center text-[0.75rem] font-semibold tracking-[0.06em] text-fundo uppercase sm:px-6">{booking.ticketDemo}</p>
          </m.div>
        ) : null}
      </AnimatePresence>
    </form>
  );
}

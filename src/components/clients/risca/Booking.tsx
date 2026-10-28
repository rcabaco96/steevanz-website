"use client";

import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import type { RiscaCategory, RiscaCopy } from "@/content/risca/copy";
import { risca, riscaDuration, riscaPrice } from "@/content/risca/facts";
import { CalendarIcon, CheckIcon, PhoneIcon } from "./icons";
import { pickServiceEvent, pickStylistEvent, riscaSections } from "./sections";
import type { PickService } from "./Services";

const weekdays = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
const weekdaysLong = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];
const months = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

/** Today's date (local), read in the browser only: the server never guesses the visitor's day. */
const noop = () => () => {};
const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
};

const toMinutes = (hhmm: string) => {
  const [h, mm] = hhmm.split(":").map(Number);
  return h * 60 + mm;
};
const toHhmm = (minutes: number) => `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
const pad = (n: number) => String(n).padStart(2, "0");

/** A fixed, made-up agenda: some hours are already taken (the same ones on every visit), so only free hours show. */
function taken(seed: string): boolean {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return h % 5 < 2;
}

interface Day {
  key: string;
  date: Date;
  weekday: number;
}

const anyone = "qualquer";

// The online booking, the way the salon's real booking system works (Steevanz's «Sistema de reservas online»): the
// service, the person (or no preference), the day, the hour — only free hours appear, each person on their own
// working days — and a name. Confirming shows a demonstration ticket with a calendar file: nothing is booked, sent
// or stored (the page says so). Phones: heading, the steps, then the summary; large screens: the summary stays
// beside the steps.
export function Booking({ copy }: { copy: RiscaCopy }) {
  const { booking, services, team } = copy;
  const reduced = useReducedMotion();
  const [categoryId, setCategoryId] = useState<RiscaCategory["id"]>(services.list[0].id);
  const [serviceIdx, setServiceIdx] = useState<number | null>(null);
  const [stylistId, setStylistId] = useState<string>(anyone);
  const [dayKey, setDayKey] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [done, setDone] = useState(false);
  const today = useSyncExternalStore(noop, todayKey, () => null);

  const category = services.list.find((c) => c.id === categoryId) ?? services.list[0];
  const service = serviceIdx === null ? null : category.services[serviceIdx] ?? null;
  const people = team.list.filter((s) => category.stylists.includes(s.id));
  const stylist = people.find((s) => s.id === stylistId) ?? null;

  useEffect(() => {
    const onService = (event: Event) => {
      const { category: id, index } = (event as CustomEvent<PickService>).detail;
      const found = services.list.find((c) => c.id === id);
      if (!found) return;
      setCategoryId(id);
      setServiceIdx(index);
      setStylistId((current) => (found.stylists.includes(current) ? current : anyone));
      setDone(false);
    };
    const onStylist = (event: Event) => {
      const id = (event as CustomEvent<string>).detail;
      const person = team.list.find((s) => s.id === id);
      if (!person) return;
      setStylistId(id);
      setCategoryId((current) => {
        const ok = services.list.find((c) => c.id === current)?.stylists.includes(id);
        if (ok) return current;
        setServiceIdx(null);
        return services.list.find((c) => c.stylists.includes(id))?.id ?? current;
      });
      setDone(false);
    };
    window.addEventListener(pickServiceEvent, onService);
    window.addEventListener(pickStylistEvent, onStylist);
    return () => {
      window.removeEventListener(pickServiceEvent, onService);
      window.removeEventListener(pickStylistEvent, onStylist);
    };
  }, [services.list, team.list]);

  /** The next open days on which the chosen person (or anyone who does this service) works. */
  const days = useMemo<Day[]>(() => {
    if (!today) return [];
    const [y, mo, d] = today.split("-").map(Number);
    const works = (wd: number) => (stylist ? stylist.days.includes(wd) : people.some((p) => p.days.includes(wd)));
    const out: Day[] = [];
    for (let i = 1; out.length < 8 && i < 40; i++) {
      const date = new Date(y, mo, d + i);
      const wd = date.getDay();
      if (!risca.openingByWeekday[wd] || !works(wd)) continue;
      out.push({ key: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`, date, weekday: wd });
    }
    return out;
  }, [today, stylist, people]);

  const day = days.find((d) => d.key === dayKey) ?? null;
  const times = useMemo(() => {
    if (!day || !service) return [];
    const [opens, closes] = risca.openingByWeekday[day.weekday];
    const last = toMinutes(closes) - service.minutes;
    const out: string[] = [];
    for (let t = toMinutes(opens); t <= last; t += 30) {
      const hhmm = toHhmm(t);
      if (!taken(`${day.key}|${stylistId}|${hhmm}`)) out.push(hhmm);
    }
    return out;
  }, [day, service, stylistId]);
  const validTime = time && times.includes(time) ? time : null;
  const ready = Boolean(service && day && validTime);
  const longDay = day ? `${weekdaysLong[day.weekday]}, ${day.date.getDate()} de ${months[day.date.getMonth()]}` : "";
  const who = stylist ? stylist.name : booking.anyone;

  const ics = useMemo(() => {
    if (!ready || !service || !day || !validTime) return "";
    const start = toMinutes(validTime);
    const end = start + service.minutes;
    const date = `${day.date.getFullYear()}${pad(day.date.getMonth() + 1)}${pad(day.date.getDate())}`;
    const at = (mins: number) => `${date}T${pad(Math.floor(mins / 60))}${pad(mins % 60)}00`;
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Risca//Demonstracao//PT",
      "BEGIN:VEVENT",
      `UID:${date}-${validTime.replace(":", "")}@risca.example`,
      `DTSTAMP:${date}T000000`,
      `DTSTART:${at(start)}`,
      `DTEND:${at(end)}`,
      `SUMMARY:Risca · ${service.name} (demonstração)`,
      `LOCATION:${risca.street}\\, ${risca.postalCode} ${risca.locality}`,
      "DESCRIPTION:Marcação de demonstração de um negócio fictício. Nenhuma marcação foi feita.",
      "END:VEVENT",
      "END:VCALENDAR",
    ];
    return `data:text/calendar;charset=utf-8,${encodeURIComponent(lines.join("\r\n"))}`;
  }, [ready, service, day, validTime]);

  const chip =
    "flex min-h-11 cursor-pointer items-center justify-center px-4 text-[0.92rem] font-medium ring-1 ring-tinta/20 transition-colors peer-checked:bg-tinta peer-checked:text-gesso peer-checked:ring-tinta peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-vermelhao-escuro hover:ring-tinta/60";
  const legend = "rc-label mb-4 text-vermelhao-escuro";
  const reset = () => {
    setDone(false);
    setServiceIdx(null);
    setDayKey(null);
    setTime(null);
  };

  return (
    <section id={riscaSections.book} aria-labelledby="rc-booking-title" className="relative bg-papel py-24 sm:py-32">
      <div className="mx-auto grid max-w-[92rem] grid-cols-1 gap-10 px-5 sm:px-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-14">
        <div className="lg:col-start-1 lg:row-start-1">
          <p className="rc-label mb-5 flex items-center gap-4 text-vermelhao-escuro">
            <span aria-hidden="true" className="h-[2px] w-10 bg-vermelhao" />
            {booking.eyebrow}
          </p>
          <h2 id="rc-booking-title" className="text-[clamp(3.2rem,12vw,7.4rem)] leading-[0.86]">
            <span className="rc-display block">{booking.title}</span>
            <span className="rc-serif block text-[0.8em]">{booking.titleSerif}</span>
          </h2>
          <p className="mt-6 max-w-md leading-relaxed text-cinza">{booking.intro}</p>
        </div>

        <form className="min-w-0 bg-gesso p-5 sm:p-9 lg:col-start-2 lg:row-span-2 lg:row-start-1" onSubmit={(e) => e.preventDefault()} aria-describedby="rc-booking-demo">
          <fieldset className="min-w-0">
            <legend className={legend}>{booking.step1}</legend>
            <div className="-mx-5 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
              <div className="flex w-max gap-2 sm:w-auto sm:flex-wrap">
                {services.list.map((c) => (
                  <label key={c.id} className="relative shrink-0">
                    <input
                      type="radio"
                      name="familia"
                      value={c.id}
                      checked={categoryId === c.id}
                      onChange={() => {
                        setCategoryId(c.id);
                        setServiceIdx(null);
                        if (!c.stylists.includes(stylistId)) setStylistId(anyone);
                        setDone(false);
                      }}
                      className="peer sr-only"
                    />
                    <span className={chip}>{c.title}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="mt-4 grid gap-2">
              {category.services.map((s, i) => (
                <label key={s.name} className="relative block">
                  <input
                    type="radio"
                    name="servico"
                    checked={serviceIdx === i}
                    onChange={() => {
                      setServiceIdx(i);
                      setDone(false);
                    }}
                    className="peer sr-only"
                  />
                  <span className="flex min-h-14 cursor-pointer items-center justify-between gap-4 px-4 py-3 ring-1 ring-tinta/15 transition-colors peer-checked:bg-tinta peer-checked:text-gesso peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-vermelhao-escuro hover:ring-tinta/50">
                    <span className="min-w-0">
                      <span className="block leading-snug font-medium">{s.name}</span>
                      <span className="block text-[0.8rem] opacity-70">{riscaDuration(s.minutes)}</span>
                    </span>
                    <span className="shrink-0 text-right whitespace-nowrap">
                      {s.from ? <span className="mr-1 text-[0.7rem] opacity-70">{services.from}</span> : null}
                      <span className="rc-display text-[1.5rem] leading-none">{riscaPrice(s.price)}</span>{" "}
                      <span className="text-[0.62rem] font-semibold tracking-[0.1em] uppercase opacity-70">{services.plusVat}</span>
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-9 min-w-0">
            <legend className={legend}>{booking.step2}</legend>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {[{ id: anyone, name: booking.anyone, role: booking.anyoneNote }, ...people].map((p) => (
                <label key={p.id} className="relative">
                  <input
                    type="radio"
                    name="profissional"
                    checked={(stylist?.id ?? anyone) === p.id}
                    onChange={() => {
                      setStylistId(p.id);
                      setDone(false);
                    }}
                    className="peer sr-only"
                  />
                  <span className={`${chip} h-full flex-col items-start px-3 py-2 text-left leading-tight`}>
                    <span className="font-semibold">{p.name}</span>
                    <span className="mt-0.5 text-[0.72rem] opacity-70">{p.role}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-9 min-w-0">
            <legend className={legend}>{booking.step3}</legend>
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
                        setDone(false);
                      }}
                      className="peer sr-only"
                    />
                    <span className={`${chip} flex-col px-1 py-1.5 leading-tight`} title={`${weekdaysLong[d.weekday]}, ${d.date.getDate()} de ${months[d.date.getMonth()]}`}>
                      <span className="text-[0.68rem] tracking-[0.12em] uppercase opacity-70">{weekdays[d.weekday]}</span>
                      <span className="rc-display text-[1.6rem] leading-none">{d.date.getDate()}</span>
                    </span>
                  </label>
                ))}
              </div>
            ) : (
              <div aria-hidden="true" className="grid grid-cols-4 gap-2 sm:grid-cols-8">
                {Array.from({ length: 8 }, (_, i) => (
                  <span key={i} className="h-14 animate-pulse bg-papel" />
                ))}
              </div>
            )}
            <p className="mt-3 text-xs text-cinza">{booking.closedNote}</p>
          </fieldset>

          <fieldset className="mt-9 min-w-0">
            <legend className={legend}>{booking.step4}</legend>
            {!service ? (
              <p className="text-[0.9rem] text-cinza">{booking.pickService}</p>
            ) : !day ? (
              <p className="text-[0.9rem] text-cinza">{booking.pending}</p>
            ) : times.length ? (
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                {times.map((t) => (
                  <label key={t} className="relative">
                    <input
                      type="radio"
                      name="hora"
                      checked={validTime === t}
                      onChange={() => {
                        setTime(t);
                        setDone(false);
                      }}
                      className="peer sr-only"
                    />
                    <span className={`${chip} px-2 tabular-nums`}>{t}</span>
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-[0.9rem] text-cinza">{booking.noTimes}</p>
            )}
          </fieldset>

          <div className="mt-9">
            <label htmlFor="rc-nome" className={`${legend} block`}>
              {booking.step5} <span className="tracking-normal text-cinza normal-case">{booking.nameOptional}</span>
            </label>
            <input
              id="rc-nome"
              type="text"
              autoComplete="given-name"
              maxLength={60}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={booking.namePlaceholder}
              className="h-13 w-full bg-papel px-5 text-base placeholder:text-cinza focus:bg-white focus:outline-2 focus:outline-vermelhao-escuro"
            />
          </div>
        </form>

        <div className="lg:sticky lg:top-24 lg:col-start-1 lg:row-start-2 lg:self-start">
          <div className="relative overflow-hidden bg-tinta p-6 text-gesso sm:p-8" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              {done && ready && service && day && validTime ? (
                <m.div
                  key="done"
                  initial={reduced ? { opacity: 0 } : { clipPath: "polygon(0% 0%, 0% 0%, -20% 100%, -20% 100%)" }}
                  animate={reduced ? { opacity: 1 } : { clipPath: "polygon(0% 0%, 120% 0%, 100% 100%, -20% 100%)" }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
                >
                  <p className="rc-label flex items-center gap-2 text-vermelhao">
                    <CheckIcon width={16} height={16} strokeWidth={2.4} /> {booking.done.title}
                  </p>
                  <p className="rc-display mt-4 text-[2.4rem]">{service.name}</p>
                  <p className="rc-serif mt-1 text-[1.4rem] text-gesso/85">
                    {longDay}, {booking.at} {validTime} · {booking.with} {who}
                  </p>
                  <p className="mt-4 text-[0.9rem] leading-relaxed text-gesso/70">{booking.done.text}</p>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <a href={ics} download="risca-marcacao-demonstracao.ics" className="inline-flex h-12 items-center justify-center gap-2 bg-gesso px-5 text-[0.78rem] font-bold tracking-[0.14em] text-tinta uppercase transition-colors hover:bg-vermelhao">
                      <CalendarIcon width={17} height={17} /> {booking.done.calendar}
                    </a>
                    <button type="button" onClick={reset} className="inline-flex h-12 items-center justify-center px-5 text-[0.78rem] font-bold tracking-[0.14em] uppercase ring-1 ring-gesso/40 transition-colors hover:bg-gesso hover:text-tinta">
                      {booking.done.again}
                    </button>
                  </div>
                </m.div>
              ) : (
                <m.div key="summary" exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                  <p className="rc-label text-gesso/60">{booking.summary}</p>
                  {ready && service && day && validTime ? (
                    <>
                      <p className="rc-display mt-4 text-[2.4rem]">{service.name}</p>
                      <p className="rc-serif mt-1 text-[1.4rem] text-gesso/85">
                        {longDay}, {booking.at} {validTime} · {booking.with} {who}
                      </p>
                      <p className="mt-3 text-[0.95rem] text-gesso/80">
                        {riscaDuration(service.minutes)} · {service.from ? `${services.from} ` : ""}
                        {riscaPrice(service.price)} <span className="text-[0.7rem] font-semibold tracking-[0.1em] uppercase">{services.plusVat}</span>
                        {name.trim() ? ` · ${name.trim()}` : ""}
                      </p>
                    </>
                  ) : (
                    <p className="mt-4 text-gesso/70">{booking.pending}</p>
                  )}
                  <div className="mt-6 flex flex-col gap-3">
                    <button
                      type="button"
                      disabled={!ready}
                      onClick={() => setDone(true)}
                      className="rc-slant inline-flex h-14 items-center justify-center gap-2 bg-vermelhao pr-9 pl-6 text-[0.85rem] font-bold tracking-[0.14em] text-tinta uppercase transition-colors hover:bg-gesso disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-vermelhao"
                    >
                      {booking.confirm}
                    </button>
                    <a href={risca.phoneHref} className="inline-flex h-12 items-center justify-center gap-2 text-[0.8rem] font-bold tracking-[0.14em] uppercase ring-1 ring-gesso/30 transition-colors hover:bg-gesso hover:text-tinta">
                      <PhoneIcon width={16} height={16} /> {booking.call}
                    </a>
                  </div>
                </m.div>
              )}
            </AnimatePresence>
          </div>
          <p id="rc-booking-demo" className="mt-4 text-xs leading-relaxed text-cinza">
            {booking.demoNote} {services.vatNote}
          </p>
        </div>
      </div>
    </section>
  );
}

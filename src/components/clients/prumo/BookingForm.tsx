"use client";

import { AnimatePresence, m } from "motion/react";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import type { PrumoCopy, PrumoDisciplineId } from "@/content/prumo/copy";
import { prumo, prumoDuration, prumoPrice } from "@/content/prumo/facts";
import { CheckIcon, PhoneIcon } from "./icons";
import { pickServiceEvent } from "./sections";

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

interface Day {
  key: string;
  short: string;
  day: number;
  long: string;
  weekday: number;
}

// The online booking, as the «Sistema de reservas online» works: the treatment, the therapist (only those who do it,
// or «no preference»), the day (the next open days), the hour (every half hour, so the session ends by closing time)
// and a name. Demo: confirming shows what a real clinic's visitor would get (an email confirmation and a reminder the
// day before); nothing is sent or stored, and the page says so.
export function BookingForm({ copy }: { copy: PrumoCopy }) {
  const { booking, disciplines, team } = copy;
  const [disciplineId, setDisciplineId] = useState<PrumoDisciplineId>(disciplines.list[0].id);
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [therapistId, setTherapistId] = useState<string>("any");
  const [dayKey, setDayKey] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [done, setDone] = useState(false);
  const today = useSyncExternalStore(noop, todayKey, () => null);
  const doneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onPick = (event: Event) => {
      const id = (event as CustomEvent<string>).detail;
      const discipline = disciplines.list.find((d) => d.services.some((s) => s.id === id));
      if (!discipline) return;
      setDisciplineId(discipline.id);
      setServiceId(id);
      setTherapistId("any");
      setTime(null);
      setDone(false);
    };
    window.addEventListener(pickServiceEvent, onPick);
    return () => window.removeEventListener(pickServiceEvent, onPick);
  }, [disciplines.list]);

  useEffect(() => {
    if (done) doneRef.current?.focus();
  }, [done]);

  const discipline = disciplines.list.find((d) => d.id === disciplineId) ?? disciplines.list[0];
  const service = discipline.services.find((s) => s.id === serviceId) ?? null;
  const therapists = team.list.filter((t) => t.disciplines.includes(discipline.id));
  const therapist = therapists.find((t) => t.id === therapistId) ?? null;

  const days = useMemo<Day[]>(() => {
    if (!today) return [];
    const [y, mo, d] = today.split("-").map(Number);
    const out: Day[] = [];
    const short = new Intl.DateTimeFormat("pt-PT", { weekday: "short" });
    const long = new Intl.DateTimeFormat("pt-PT", { weekday: "long", day: "numeric", month: "long" });
    for (let i = 1; out.length < 8 && i < 30; i++) {
      const date = new Date(y, mo, d + i);
      const wd = date.getDay();
      if (!prumo.openingByWeekday[wd]) continue;
      out.push({
        key: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
        short: short.format(date).replace(/\.$/, ""),
        day: date.getDate(),
        long: long.format(date),
        weekday: wd,
      });
    }
    return out;
  }, [today]);

  const day = days.find((d) => d.key === dayKey) ?? null;
  const times = useMemo(() => {
    if (!day) return [];
    const [opens, closes] = prumo.openingByWeekday[day.weekday];
    const last = toMinutes(closes) - (service?.minutes ?? 30);
    const out: string[] = [];
    for (let t = toMinutes(opens); t <= last; t += 30) out.push(toHhmm(t));
    return out;
  }, [day, service]);
  const validTime = time && times.includes(time) ? time : null;
  const ready = Boolean(service && day && validTime);

  const chip =
    "flex min-h-11 items-center justify-center rounded-full px-4 text-[0.95rem] ring-1 ring-tinta/15 transition-colors peer-checked:bg-ardosia peer-checked:text-cal peer-checked:ring-ardosia peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-latao-fundo hover:ring-latao/60";
  const legend = "pr-label mb-4 text-latao-fundo";

  if (done && service && day && validTime) {
    return (
      <div ref={doneRef} tabIndex={-1} className="rounded-[2rem] bg-cal p-6 shadow-[0_30px_70px_-45px_rgb(29_39_48/0.5)] outline-none sm:p-10" aria-live="polite">
        <span className="grid size-14 place-items-center rounded-full bg-ardosia text-cal">
          <CheckIcon width={26} height={26} />
        </span>
        <h3 className="mt-6 font-display text-[clamp(1.8rem,6vw,2.4rem)] leading-tight">{booking.done.title}</h3>
        <p className="mt-4 font-display text-[1.3rem] leading-snug">
          {service.name} · {prumoDuration(service.minutes)}
          <span className="mt-1 block text-[1.05rem] text-latao-fundo italic">
            {day.long} {booking.at} {validTime}
            {therapist ? ` · ${booking.with} ${therapist.name}` : ""}
          </span>
        </p>
        <p className="mt-5 max-w-md leading-relaxed text-pedra">{booking.done.text}</p>
        <button
          type="button"
          onClick={() => {
            setDone(false);
            setTime(null);
          }}
          className="mt-7 inline-flex h-12 items-center rounded-full px-6 font-semibold ring-1 ring-tinta/25 transition-colors hover:bg-ardosia hover:text-cal"
        >
          {booking.done.again}
        </button>
        <p className="mt-5 text-xs leading-relaxed text-pedra">{booking.demoNote}</p>
      </div>
    );
  }

  return (
    <form
      className="rounded-[2rem] bg-cal p-5 shadow-[0_30px_70px_-45px_rgb(29_39_48/0.5)] sm:p-9"
      onSubmit={(e) => {
        e.preventDefault();
        if (ready) setDone(true);
      }}
    >
      <fieldset className="min-w-0">
        <legend className={legend}>{booking.step1}</legend>
        <div className="-mx-5 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max gap-2 sm:w-auto sm:flex-wrap">
            {disciplines.list.map((d) => (
              <label key={d.id} className="relative shrink-0">
                <input
                  type="radio"
                  name="area"
                  value={d.id}
                  checked={disciplineId === d.id}
                  onChange={() => {
                    setDisciplineId(d.id);
                    setServiceId(null);
                    setTherapistId("any");
                  }}
                  className="peer sr-only"
                />
                <span className={chip}>{d.title}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="mt-4 grid gap-2">
          {discipline.services.map((s) => (
            <label key={s.id} className="relative block">
              <input type="radio" name="tratamento" checked={serviceId === s.id} onChange={() => setServiceId(s.id)} className="peer sr-only" />
              <span className="flex min-h-14 items-center justify-between gap-4 rounded-2xl px-4 py-3 ring-1 ring-tinta/12 transition-colors peer-checked:bg-anca peer-checked:ring-latao peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-latao-fundo hover:ring-latao/60">
                <span className="min-w-0">
                  <span className="block leading-snug">{s.name}</span>
                  <span className="block text-[0.82rem] text-pedra">
                    {prumoDuration(s.minutes)}
                    {s.note ? ` · ${s.note}` : ""}
                  </span>
                </span>
                <span className="shrink-0 text-right whitespace-nowrap">
                  <span className="block font-display text-lg leading-none">{prumoPrice(s.price)}</span>
                  <span className="mt-1 block text-[0.65rem] font-semibold tracking-[0.1em] text-pedra uppercase">{disciplines.plusVat}</span>
                </span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-9 min-w-0">
        <legend className={legend}>{booking.step2}</legend>
        <div className="flex flex-wrap gap-2">
          <label className="relative">
            <input type="radio" name="terapeuta" checked={therapist === null} onChange={() => setTherapistId("any")} className="peer sr-only" />
            <span className={`${chip} flex-col !items-start px-5 py-1.5 leading-tight`}>
              <span>{booking.anyTherapist}</span>
              <span className="text-[0.72rem] opacity-70">{booking.anyTherapistNote}</span>
            </span>
          </label>
          {therapists.map((t) => (
            <label key={t.id} className="relative">
              <input type="radio" name="terapeuta" checked={therapist?.id === t.id} onChange={() => setTherapistId(t.id)} className="peer sr-only" />
              <span className={`${chip} flex-col !items-start px-5 py-1.5 leading-tight`}>
                <span>{t.name}</span>
                <span className="text-[0.72rem] opacity-70">{t.role}</span>
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
                <input type="radio" name="dia" checked={dayKey === d.key} onChange={() => setDayKey(d.key)} className="peer sr-only" />
                <span className={`${chip} min-h-14 flex-col px-1 leading-tight`} title={d.long}>
                  <span className="text-[0.72rem] font-semibold tracking-[0.1em] uppercase opacity-70">{d.short}</span>
                  <span className="font-display text-xl">{d.day}</span>
                </span>
              </label>
            ))}
          </div>
        ) : (
          <div aria-hidden="true" className="grid grid-cols-4 gap-2 sm:grid-cols-8">
            {Array.from({ length: 8 }, (_, i) => (
              <span key={i} className="h-14 animate-pulse rounded-full bg-anca" />
            ))}
          </div>
        )}
        <p className="mt-3 text-xs text-pedra">{booking.closedNote}</p>
      </fieldset>

      <AnimatePresence initial={false}>
        {day ? (
          <m.fieldset
            key="horas"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="min-w-0 overflow-hidden"
          >
            <legend className={`${legend} pt-9`}>{booking.step4}</legend>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
              {times.map((t) => (
                <label key={t} className="relative">
                  <input type="radio" name="hora" checked={validTime === t} onChange={() => setTime(t)} className="peer sr-only" />
                  <span className={`${chip} px-2 tabular-nums`}>{t}</span>
                </label>
              ))}
            </div>
          </m.fieldset>
        ) : null}
      </AnimatePresence>

      <div className="mt-9">
        <label htmlFor="pr-nome" className={`${legend} block`}>
          {booking.step5} <span className="tracking-normal text-pedra normal-case">{booking.nameOptional}</span>
        </label>
        <input
          id="pr-nome"
          type="text"
          autoComplete="given-name"
          maxLength={60}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={booking.namePlaceholder}
          className="h-13 w-full rounded-full bg-anca px-5 text-base placeholder:text-pedra/80 focus:bg-white focus:outline-2 focus:outline-latao-fundo"
        />
      </div>

      <div className="mt-9 rounded-2xl bg-anca p-5" aria-live="polite">
        <p className="pr-label text-pedra">{booking.summary}</p>
        {ready && service && day && validTime ? (
          <p className="mt-3 font-display text-[1.3rem] leading-snug">
            {name.trim() ? `${name.trim()}: ` : ""}
            {service.name} · {prumoDuration(service.minutes)} · {prumoPrice(service.price)}{" "}
            <span className="font-sans text-xs font-semibold tracking-[0.1em] text-pedra uppercase">{disciplines.plusVat}</span>
            <span className="mt-1 block text-[1.05rem] text-latao-fundo italic">
              {day.long} {booking.at} {validTime}
              {therapist ? ` · ${booking.with} ${therapist.name}` : ""}
            </span>
          </p>
        ) : (
          <p className="mt-3 text-pedra">{service ? booking.pending : booking.pickService}</p>
        )}
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={!ready}
          className="inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-ardosia px-6 text-[1rem] font-semibold text-cal transition-colors hover:bg-ardosia-3 disabled:cursor-not-allowed disabled:bg-ardosia/35 sm:flex-1"
        >
          <CheckIcon width={18} height={18} />
          {booking.confirm}
        </button>
        <a
          href={prumo.phoneHref}
          className="inline-flex h-14 items-center justify-center gap-2 rounded-full px-6 text-[1rem] font-semibold ring-1 ring-tinta/25 transition-colors hover:bg-ardosia hover:text-cal"
        >
          <PhoneIcon width={17} height={17} />
          {booking.call}
        </a>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-pedra">{booking.demoNote}</p>
    </form>
  );
}

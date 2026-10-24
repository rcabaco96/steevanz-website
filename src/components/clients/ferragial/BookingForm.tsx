"use client";

import { AnimatePresence, m } from "motion/react";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import type { FerragialCopy } from "@/content/ferragial/copy";
import {
  ferragialDuration,
  ferragialExperiences,
  ferragialLanguages,
  ferragialMailHref,
  ferragialPrice,
  ferragialWhatsappHref,
} from "@/content/ferragial/facts";
import { ChatIcon, MailIcon, MinusIcon, PlusIcon } from "./icons";
import { pickExperienceEvent } from "./sections";

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
  month: string;
  long: string;
  weekday: number;
}

// The booking request: the experience, the day (the next days it runs: its weekdays, its months), the start time, how
// many people, the language of the visit and a name; a summary with the total (per person × people, without VAT,
// «+ IVA» beside it) and the request written for WhatsApp or email. Nothing is stored and no availability is promised
// (the winery confirms). Demo: the number and the address are fictional, and the page says so under the buttons.
export function BookingForm({ copy }: { copy: FerragialCopy }) {
  const { booking } = copy;
  const [expId, setExpId] = useState(ferragialExperiences[0].id);
  const [dayKey, setDayKey] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [people, setPeople] = useState(2);
  const [language, setLanguage] = useState<string>(ferragialLanguages[0]);
  const [name, setName] = useState("");
  const today = useSyncExternalStore(noop, todayKey, () => null);

  useEffect(() => {
    const onPick = (event: Event) => {
      const id = (event as CustomEvent<string>).detail;
      if (ferragialExperiences.some((e) => e.id === id)) {
        setExpId(id);
        setDayKey(null);
        setTime(null);
      }
    };
    window.addEventListener(pickExperienceEvent, onPick);
    return () => window.removeEventListener(pickExperienceEvent, onPick);
  }, []);

  const exp = ferragialExperiences.find((e) => e.id === expId) ?? ferragialExperiences[0];

  const days = useMemo<Day[]>(() => {
    if (!today) return [];
    const [y, mo, d] = today.split("-").map(Number);
    const out: Day[] = [];
    const short = new Intl.DateTimeFormat("pt-PT", { weekday: "short" });
    const month = new Intl.DateTimeFormat("pt-PT", { month: "short" });
    const long = new Intl.DateTimeFormat("pt-PT", { weekday: "long", day: "numeric", month: "long" });
    for (let i = 1; out.length < 8 && i <= 75; i++) {
      const date = new Date(y, mo, d + i);
      const wd = date.getDay();
      if (!exp.slots[wd]) continue;
      if (exp.months && !exp.months.includes(date.getMonth())) continue;
      out.push({
        key: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
        short: short.format(date).replace(/\.$/, ""),
        day: date.getDate(),
        month: month.format(date).replace(/\.$/, ""),
        long: long.format(date),
        weekday: wd,
      });
    }
    return out;
  }, [today, exp]);

  const day = days.find((d) => d.key === dayKey) ?? null;
  const times = day ? (exp.slots[day.weekday] ?? []) : [];
  const validTime = time && times.includes(time) ? time : null;
  const count = Math.min(people, exp.maxPeople);
  const total = exp.price * count;
  const peopleLabel = `${count} ${count === 1 ? booking.person : booking.persons}`;
  const ready = Boolean(day && validTime);
  const who = name.trim() ? booking.messageName.replace("{nome}", name.trim()) : "";
  const message =
    ready && day && validTime
      ? booking.message
          .replace("{experiencia}", `${exp.name} (${ferragialDuration(exp.minutes)})`)
          .replace("{dia}", day.long)
          .replace("{hora}", validTime)
          .replace("{pessoas}", peopleLabel)
          .replace("{lingua}", language)
          .replace("{total}", ferragialPrice(total))
          .replace("{nome}", who)
      : "";

  const chip =
    "flex min-h-11 cursor-pointer items-center justify-center rounded-full px-4 text-[0.92rem] ring-1 ring-tinta/15 transition-colors peer-checked:bg-tinto peer-checked:text-cal peer-checked:ring-tinto peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-barro hover:ring-tinto/50";
  const legend = "fg-label mb-4 text-barro";

  return (
    <form className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr] lg:items-start lg:gap-10" onSubmit={(e) => e.preventDefault()}>
      <div className="rounded-[1.5rem] bg-white/70 p-5 ring-1 ring-tinta/8 sm:p-9">
        <fieldset className="min-w-0">
          <legend className={legend}>{booking.step1}</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {ferragialExperiences.map((e) => (
              <label key={e.id} className="relative block">
                <input
                  type="radio"
                  name="fg-experiencia"
                  checked={expId === e.id}
                  onChange={() => {
                    setExpId(e.id);
                    setDayKey(null);
                    setTime(null);
                  }}
                  className="peer sr-only"
                />
                <span className="flex min-h-16 items-center justify-between gap-3 rounded-xl px-4 py-3 ring-1 ring-tinta/12 transition-colors peer-checked:bg-cal-2 peer-checked:ring-tinto peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-barro hover:ring-tinto/50">
                  <span className="min-w-0">
                    <span className="block leading-snug">{e.name}</span>
                    <span className="block text-[0.8rem] text-pedra">{ferragialDuration(e.minutes)}</span>
                  </span>
                  <span className="shrink-0 text-right whitespace-nowrap">
                    <span className="block font-display text-lg leading-none">{ferragialPrice(e.price)}</span>
                    <span className="mt-1 block text-[0.62rem] tracking-[0.1em] text-pedra uppercase">{copy.visits.plusVat}</span>
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-9 min-w-0">
          <legend className={legend}>{booking.step2}</legend>
          {!today ? (
            <div aria-busy="true" className="grid grid-cols-4 gap-2 sm:grid-cols-8">
              <span role="status" className="sr-only">
                {booking.loading}
              </span>
              {Array.from({ length: 8 }, (_, i) => (
                <span key={i} aria-hidden="true" className="h-16 animate-pulse rounded-xl bg-cal-2" />
              ))}
            </div>
          ) : days.length ? (
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
              {days.map((d) => (
                <label key={d.key} className="relative">
                  <input type="radio" name="fg-dia" checked={dayKey === d.key} onChange={() => setDayKey(d.key)} className="peer sr-only" />
                  <span className={`${chip} min-h-16 flex-col rounded-xl px-1 leading-tight`} title={d.long}>
                    <span className="text-[0.68rem] tracking-[0.12em] uppercase opacity-70">{d.short}</span>
                    <span className="font-display text-xl">{d.day}</span>
                    <span className="text-[0.68rem] opacity-70">{d.month}</span>
                  </span>
                </label>
              ))}
            </div>
          ) : (
            <div className="rounded-xl bg-cal-2 p-5">
              <p className="font-semibold">{booking.none}</p>
              {exp.season ? <p className="mt-1 text-pedra">{exp.season}</p> : null}
              <a
                href={ferragialWhatsappHref(booking.noneMessage.replace("{experiencia}", exp.name))}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex h-11 items-center gap-2 rounded-full bg-xisto px-5 text-[0.76rem] font-semibold tracking-[0.1em] text-cal uppercase hover:bg-tinto"
              >
                <ChatIcon width={17} height={17} />
                {booking.noneAsk}
                <span className="sr-only"> {copy.newTab}</span>
              </a>
            </div>
          )}
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
              <legend className={`${legend} pt-9`}>{booking.step3}</legend>
              <div className="flex flex-wrap gap-2">
                {times.map((t) => (
                  <label key={t} className="relative">
                    <input type="radio" name="fg-hora" checked={validTime === t} onChange={() => setTime(t)} className="peer sr-only" />
                    <span className={`${chip} min-w-20 tabular-nums`}>{t}</span>
                  </label>
                ))}
              </div>
            </m.fieldset>
          ) : null}
        </AnimatePresence>

        <fieldset className="mt-9 grid min-w-0 gap-6 sm:grid-cols-2">
          <legend className={legend}>{booking.step4}</legend>
          <div>
            <p className="mb-2 text-sm text-pedra" id="fg-people-label">
              {booking.people}
            </p>
            <div className="flex items-center gap-3" role="group" aria-labelledby="fg-people-label">
              <button type="button" onClick={() => setPeople((n) => Math.max(1, Math.min(n, exp.maxPeople) - 1))} aria-label={booking.less} className="grid size-11 place-items-center rounded-full ring-1 ring-tinta/15 hover:bg-cal-2">
                <MinusIcon width={18} height={18} />
              </button>
              <span className="w-10 text-center font-display text-2xl tabular-nums" aria-live="polite">
                {count}
              </span>
              <button type="button" onClick={() => setPeople((n) => Math.min(exp.maxPeople, n + 1))} aria-label={booking.more} className="grid size-11 place-items-center rounded-full ring-1 ring-tinta/15 hover:bg-cal-2">
                <PlusIcon width={18} height={18} />
              </button>
            </div>
          </div>
          <label className="block">
            <span className="mb-2 block text-sm text-pedra">{booking.language}</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="block h-12 w-full rounded-xl bg-white px-4 text-base ring-1 ring-tinta/15 outline-none focus:ring-2 focus:ring-barro"
            >
              {ferragialLanguages.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </label>
        </fieldset>

        <label className="mt-9 block">
          <span className={legend}>{booking.step5}</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={booking.namePlaceholder}
            autoComplete="name"
            maxLength={60}
            className="mt-4 block h-12 w-full rounded-xl bg-white px-4 text-base ring-1 ring-tinta/15 outline-none focus:ring-2 focus:ring-barro"
          />
        </label>
      </div>

      <aside aria-live="polite" className="fg-dark rounded-[1.5rem] bg-xisto p-6 text-cal sm:p-8 lg:sticky lg:top-24">
        <p className="fg-label text-palha">{booking.summary}</p>
        <p className="mt-4 font-display text-[1.9rem] leading-tight">{exp.name}</p>
        <p className="mt-1 text-cal/70">
          {ferragialDuration(exp.minutes)} · {peopleLabel} · {language}
        </p>
        <p className="mt-4 min-h-12 text-cal/90">{day && validTime ? `${day.long}, às ${validTime}` : booking.pick}</p>
        <div className="mt-5 flex items-baseline justify-between gap-4 border-t border-cal/15 pt-5">
          <span className="text-cal/70">
            {booking.total} <span className="text-xs">({count} × {ferragialPrice(exp.price)})</span>
          </span>
          <span>
            <span className="font-display text-[2rem] tabular-nums">{ferragialPrice(total)}</span>
            <span className="ml-2 text-[0.7rem] font-semibold tracking-[0.12em] text-cal/70 uppercase">{booking.plusVat}</span>
          </span>
        </div>
        <div className="mt-6 grid gap-2">
          <a
            href={ready ? ferragialWhatsappHref(message) : undefined}
            aria-disabled={!ready}
            onClick={(e) => !ready && e.preventDefault()}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex h-13 items-center justify-center gap-2 rounded-full px-5 text-[0.76rem] font-semibold tracking-[0.1em] uppercase transition-colors ${
              ready ? "bg-barro text-cal hover:bg-barro-2" : "cursor-not-allowed bg-cal/10 text-cal/45"
            }`}
          >
            <ChatIcon width={18} height={18} />
            {booking.whatsapp}
            <span className="sr-only"> {copy.newTab}</span>
          </a>
          <a
            href={ready ? ferragialMailHref(booking.subject, message) : undefined}
            aria-disabled={!ready}
            onClick={(e) => !ready && e.preventDefault()}
            className={`inline-flex h-12 items-center justify-center gap-2 rounded-full px-5 text-[0.76rem] font-semibold tracking-[0.1em] uppercase ring-1 transition-colors ${
              ready ? "ring-cal/40 hover:bg-cal/10" : "cursor-not-allowed text-cal/40 ring-cal/15"
            }`}
          >
            <MailIcon width={18} height={18} />
            {booking.email}
          </a>
        </div>
        <p className="mt-4 text-[0.78rem] leading-relaxed text-cal/65">{booking.demoNote}</p>
      </aside>
    </form>
  );
}

"use client";

import { AnimatePresence, m } from "motion/react";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import type { OrveCopy } from "@/content/orve/copy";
import { orve, orveDuration, orvePrice, orveWhatsappHref } from "@/content/orve/facts";
import { ChatIcon, PhoneIcon } from "./icons";
import type { OrveLocale } from "@/content/orve/routes";
import { pickRitualEvent } from "./sections";

/** The date formats of each language («ter», «terça-feira, 28 de outubro»; «Tue», «Tuesday 28 October»…). */
const dateLocale: Record<OrveLocale, string> = { pt: "pt-PT", en: "en-GB", es: "es-ES", fr: "fr-FR", de: "de-DE", it: "it-IT" };

/** Today's date (local), read in the browser only: the server never guesses the visitor's day. */
const noop = () => () => {};
const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
};

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};
const toHhmm = (minutes: number) => `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

interface Day {
  key: string;
  short: string;
  day: number;
  long: string;
  weekday: number;
}

// The booking request, in four small steps: the ritual, the day (the next open days), the hour (every half hour,
// so the ritual ends by closing time) and a name. It writes the WhatsApp message for the visitor; nothing is stored
// and no availability is promised (the atelier confirms). Demo: the message goes to Steevanz's WhatsApp and says it is
// a test of the demo site (owner, 2026-10-24); the page says so under the buttons.
export function BookingForm({ copy }: { copy: OrveCopy }) {
  const { booking, rituals, locale } = copy;
  const [familyId, setFamilyId] = useState(rituals.list[0].id);
  const [treatmentIdx, setTreatmentIdx] = useState<number | null>(null);
  const [dayKey, setDayKey] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [name, setName] = useState("");
  const today = useSyncExternalStore(noop, todayKey, () => null);

  useEffect(() => {
    const onPick = (event: Event) => {
      const id = (event as CustomEvent<string>).detail;
      if (rituals.list.some((r) => r.id === id)) {
        setFamilyId(id);
        setTreatmentIdx(0);
        setTime(null);
      }
    };
    window.addEventListener(pickRitualEvent, onPick);
    return () => window.removeEventListener(pickRitualEvent, onPick);
  }, [rituals.list]);

  const family = rituals.list.find((r) => r.id === familyId) ?? rituals.list[0];
  const treatment = treatmentIdx === null ? null : family.treatments[treatmentIdx] ?? null;

  const days = useMemo<Day[]>(() => {
    if (!today) return [];
    const [y, mo, d] = today.split("-").map(Number);
    const out: Day[] = [];
    const short = new Intl.DateTimeFormat(dateLocale[locale], { weekday: "short" });
    const long = new Intl.DateTimeFormat(dateLocale[locale], { weekday: "long", day: "numeric", month: "long" });
    for (let i = 1; out.length < 8 && i < 30; i++) {
      const date = new Date(y, mo, d + i);
      const wd = date.getDay();
      if (!orve.openingByWeekday[wd]) continue;
      out.push({
        key: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
        short: short.format(date).replace(/\.$/, ""),
        day: date.getDate(),
        long: long.format(date),
        weekday: wd,
      });
    }
    return out;
  }, [today, locale]);

  const day = days.find((d) => d.key === dayKey) ?? null;
  const times = useMemo(() => {
    if (!day) return [];
    const [opens, closes] = orve.openingByWeekday[day.weekday];
    const last = toMinutes(closes) - (treatment?.minutes ?? 30);
    const out: string[] = [];
    for (let t = toMinutes(opens); t <= last; t += 30) out.push(toHhmm(t));
    return out;
  }, [day, treatment]);
  const validTime = time && times.includes(time) ? time : null;

  const ready = Boolean(treatment && day && validTime);
  const ritualLabel = treatment ? `${treatment.name} (${orveDuration(treatment.minutes, locale)})` : "";
  const who = name.trim() ? booking.messageName.replace("{nome}", name.trim()) : "";
  const message =
    ready && day && validTime
      ? booking.message.replace("{nome}", who).replace("{ritual}", ritualLabel).replace("{dia}", day.long).replace("{hora}", validTime)
      : "";

  const chip =
    "flex min-h-11 cursor-pointer items-center justify-center rounded-full px-4 text-[0.92rem] ring-1 ring-tinta/15 transition-colors peer-checked:bg-tinta peer-checked:text-nacar peer-checked:ring-tinta peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-cobre hover:ring-cobre/50";
  const legend = "or-label mb-4 text-cobre";

  return (
    <form className="rounded-[2rem] bg-nacar p-5 shadow-[0_30px_70px_-45px_rgb(36_24_20/0.5)] sm:p-9" onSubmit={(e) => e.preventDefault()}>
      <fieldset className="min-w-0">
        <legend className={legend}>{booking.step1}</legend>
        <div className="-mx-5 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max gap-2 sm:w-auto sm:flex-wrap">
            {rituals.list.map((r) => (
              <label key={r.id} className="relative shrink-0">
                <input
                  type="radio"
                  name="familia"
                  value={r.id}
                  checked={familyId === r.id}
                  onChange={() => {
                    setFamilyId(r.id);
                    setTreatmentIdx(null);
                  }}
                  className="peer sr-only"
                />
                <span className={chip}>{r.title}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="mt-4 grid gap-2">
          {family.treatments.map((t, i) => (
            <label key={t.name} className="relative block">
              <input type="radio" name="ritual" checked={treatmentIdx === i} onChange={() => setTreatmentIdx(i)} className="peer sr-only" />
              <span className="flex min-h-14 cursor-pointer items-center justify-between gap-4 rounded-2xl px-4 py-3 ring-1 ring-tinta/12 transition-colors peer-checked:bg-linho peer-checked:ring-cobre peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-cobre hover:ring-cobre/50">
                <span className="min-w-0">
                  <span className="block leading-snug hyphens-auto">{t.name}</span>
                  <span className="block text-[0.8rem] text-pedra">{orveDuration(t.minutes, locale)}</span>
                </span>
                {/* The VAT words under the price: «zzgl. MwSt.» beside it pushed long German names off a phone. */}
                <span className="shrink-0 text-right whitespace-nowrap">
                  <span className="block font-display text-lg leading-none">{orvePrice(t.price, locale)}</span>
                  <span className="mt-1 block text-[0.65rem] tracking-[0.1em] text-pedra uppercase">{rituals.plusVat}</span>
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
                <input type="radio" name="dia" checked={dayKey === d.key} onChange={() => setDayKey(d.key)} className="peer sr-only" />
                <span className={`${chip} flex-col px-1 leading-tight`} title={d.long}>
                  <span className="text-[0.72rem] tracking-[0.12em] uppercase opacity-70">{d.short}</span>
                  <span className="font-display text-xl">{d.day}</span>
                </span>
              </label>
            ))}
          </div>
        ) : (
          <div aria-hidden="true" className="grid grid-cols-4 gap-2 sm:grid-cols-8">
            {Array.from({ length: 8 }, (_, i) => (
              <span key={i} className="h-14 animate-pulse rounded-full bg-linho" />
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
            <legend className={`${legend} pt-9`}>{booking.step3}</legend>
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
        <label htmlFor="or-nome" className={`${legend} block`}>
          {booking.step4} <span className="tracking-normal normal-case text-pedra">{booking.nameOptional}</span>
        </label>
        <input
          id="or-nome"
          type="text"
          autoComplete="given-name"
          maxLength={60}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={booking.namePlaceholder}
          className="h-13 w-full rounded-full bg-linho px-5 text-base placeholder:text-pedra/70 focus:bg-white focus:outline-2 focus:outline-cobre"
        />
      </div>

      <div className="mt-9 rounded-2xl bg-linho p-5" aria-live="polite">
        <p className="or-label text-pedra">{booking.summary}</p>
        {ready && treatment && day && validTime ? (
          <p className="mt-3 font-display text-[1.35rem] leading-snug">
            {treatment.name} · {orveDuration(treatment.minutes, locale)} · {orvePrice(treatment.price, locale)}{" "}
            <span className="font-sans text-xs tracking-[0.1em] text-pedra uppercase">{rituals.plusVat}</span>
            <span className="mt-1 block text-[1.05rem] text-cobre italic">
              {booking.summaryWhen.replace("{dia}", day.long).replace("{hora}", validTime)}
            </span>
          </p>
        ) : (
          <p className="mt-3 text-pedra">{booking.pending}</p>
        )}
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        {ready ? (
          <a
            href={orveWhatsappHref(message)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-cobre px-6 sm:flex-1 text-[0.85rem] font-medium tracking-[0.14em] text-nacar uppercase transition-colors hover:bg-cobre-deep"
          >
            <ChatIcon width={18} height={18} />
            {booking.send}
            <span className="sr-only"> {copy.newTab}</span>
          </a>
        ) : (
          <span
            aria-disabled="true"
            className="inline-flex h-14 cursor-not-allowed items-center sm:flex-1 justify-center gap-2.5 rounded-full bg-cobre/35 px-6 text-[0.85rem] font-medium tracking-[0.14em] text-nacar uppercase"
          >
            <ChatIcon width={18} height={18} />
            {booking.send}
          </span>
        )}
        <a
          href={orve.phoneHref}
          className="inline-flex h-14 items-center justify-center gap-2 rounded-full px-6 text-[0.85rem] font-medium tracking-[0.14em] uppercase ring-1 ring-tinta/25 transition-colors hover:bg-tinta hover:text-nacar"
        >
          <PhoneIcon width={17} height={17} />
          {booking.call}
        </a>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-pedra">{booking.demoNote}</p>
    </form>
  );
}

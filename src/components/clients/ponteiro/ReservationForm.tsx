"use client";

import { AnimatePresence, m } from "motion/react";
import { useMemo, useState, useSyncExternalStore } from "react";
import type { PonteiroCopy } from "@/content/ponteiro/copy";
import { ponteiro, ponteiroWhatsappHref } from "@/content/ponteiro/facts";
import { ChatIcon, PhoneIcon } from "./icons";

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

type Meal = "almoco" | "jantar";
interface Day {
  key: string;
  short: string;
  long: string;
  weekday: number;
}

// The reservation request, in five small steps: the day (the next open days), the meal, the hour (every half hour
// of that meal), how many people and a name. It writes the WhatsApp message for the visitor; nothing is stored and no
// table is promised (the house confirms). Demo: the number belongs to no one, and the page says so.
export function ReservationForm({ copy }: { copy: PonteiroCopy }) {
  const { reservas } = copy;
  const [dayKey, setDayKey] = useState<string | null>(null);
  const [meal, setMeal] = useState<Meal | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [people, setPeople] = useState<number | null>(null);
  const [name, setName] = useState("");
  const today = useSyncExternalStore(noop, todayKey, () => null);

  const days = useMemo<Day[]>(() => {
    if (!today) return [];
    const [y, mo, d] = today.split("-").map(Number);
    const out: Day[] = [];
    for (let i = 0; out.length < 8 && i < 30; i++) {
      const date = new Date(y, mo, d + i);
      const wd = date.getDay();
      if (!ponteiro.mealsByWeekday[wd]) continue;
      out.push({
        key: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
        short: `${weekdays[wd]} ${date.getDate()}`,
        long: `${weekdaysLong[wd]}, ${date.getDate()} de ${months[date.getMonth()]}`,
        weekday: wd,
      });
    }
    return out;
  }, [today]);

  const day = days.find((d) => d.key === dayKey) ?? null;
  const meals = day ? ponteiro.mealsByWeekday[day.weekday] : [];
  const validMeal = meal && meals.includes(meal) ? meal : null;
  const times = useMemo(() => {
    if (!validMeal) return [];
    const [first, last] = ponteiro.mealSlots[validMeal];
    const out: string[] = [];
    for (let t = toMinutes(first); t <= toMinutes(last); t += 30) out.push(toHhmm(t));
    return out;
  }, [validMeal]);
  const validTime = time && times.includes(time) ? time : null;

  const ready = Boolean(day && validMeal && validTime && people);
  const peopleLabel = people === 1 ? reservas.personOne : reservas.personMany.replace("{n}", people === 8 ? reservas.peopleMore : String(people ?? ""));
  const who = name.trim() ? reservas.messageName.replace("{nome}", name.trim()) : "";
  const message =
    ready && day && validMeal && validTime
      ? reservas.message
          .replace("{nome}", who)
          .replace("{pessoas}", peopleLabel)
          .replace("{refeicao}", reservas.meals[validMeal].toLowerCase())
          .replace("{dia}", day.long)
          .replace("{hora}", validTime)
      : "";

  const chip =
    "flex min-h-11 cursor-pointer items-center justify-center rounded-full px-4 text-[0.95rem] ring-1 ring-tinta/15 transition-colors peer-checked:bg-tinta peer-checked:text-papel peer-checked:ring-tinta peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ginja hover:ring-ginja/50";
  const legend = "pn-label mb-4 text-ginja";
  const step = (key: string, children: React.ReactNode) => (
    <m.div key={key} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.4, ease: [0.2, 0.9, 0.25, 1] }} className="overflow-hidden">
      {children}
    </m.div>
  );

  return (
    <form className="rounded-[1.8rem] bg-papel p-5 shadow-[0_30px_70px_-45px_rgb(26_23_20/0.5)] ring-1 ring-tinta/8 sm:p-9" onSubmit={(e) => e.preventDefault()}>
      <fieldset className="min-w-0">
        <legend className={legend}>{reservas.step1}</legend>
        {days.length ? (
          <div className="grid grid-cols-4 gap-2">
            {days.map((d) => (
              <label key={d.key} className="relative">
                <input
                  type="radio"
                  name="dia"
                  checked={dayKey === d.key}
                  onChange={() => {
                    setDayKey(d.key);
                    setTime(null);
                  }}
                  className="peer sr-only"
                />
                <span className={`${chip} flex-col px-1 leading-tight`} title={d.long}>
                  <span className="text-[0.72rem] tracking-[0.12em] uppercase opacity-70">{d.short.split(" ")[0]}</span>
                  <span className="font-display text-[1.45rem] leading-none">{d.short.split(" ")[1]}</span>
                </span>
              </label>
            ))}
          </div>
        ) : (
          <div aria-hidden="true" className="grid grid-cols-4 gap-2">
            {Array.from({ length: 8 }, (_, i) => (
              <span key={i} className="h-14 animate-pulse rounded-full bg-marmore" />
            ))}
          </div>
        )}
        <p className="mt-3 text-xs text-cinza">{reservas.closedNote}</p>
      </fieldset>

      <AnimatePresence initial={false}>
        {day
          ? step(
              "refeicao",
              <fieldset className="min-w-0">
                <legend className={`${legend} pt-8`}>{reservas.step2}</legend>
                <div className="grid grid-cols-2 gap-2">
                  {(["almoco", "jantar"] as const).map((id) => {
                    const open = meals.includes(id);
                    return (
                      <label key={id} className="relative">
                        <input
                          type="radio"
                          name="refeicao"
                          disabled={!open}
                          checked={validMeal === id}
                          onChange={() => {
                            setMeal(id);
                            setTime(null);
                          }}
                          className="peer sr-only"
                        />
                        <span className={`${chip} gap-2 ${open ? "" : "cursor-not-allowed line-through opacity-40"}`}>
                          {reservas.meals[id]}
                          <span className="text-xs tabular-nums opacity-60">{ponteiro.mealSlots[id][0]}</span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>,
            )
          : null}
        {validMeal
          ? step(
              "hora",
              <fieldset className="min-w-0">
                <legend className={`${legend} pt-8`}>{reservas.step3}</legend>
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
                  {times.map((t) => (
                    <label key={t} className="relative">
                      <input type="radio" name="hora" checked={validTime === t} onChange={() => setTime(t)} className="peer sr-only" />
                      <span className={`${chip} px-2 tabular-nums`}>{t}</span>
                    </label>
                  ))}
                </div>
              </fieldset>,
            )
          : null}
      </AnimatePresence>

      <fieldset className="mt-8 min-w-0">
        <legend className={legend}>{reservas.step4}</legend>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
          {Array.from({ length: 8 }, (_, i) => i + 1).map((n) => (
            <label key={n} className="relative">
              <input type="radio" name="pessoas" checked={people === n} onChange={() => setPeople(n)} className="peer sr-only" />
              <span className={`${chip} px-1 tabular-nums`} title={n === 8 ? reservas.peopleMore : undefined}>
                {n === 8 ? "8+" : n}
              </span>
            </label>
          ))}
        </div>
        {people === 8 ? <p className="mt-3 text-xs text-cinza">{reservas.peopleNote}</p> : null}
      </fieldset>

      <div className="mt-8">
        <label htmlFor="pn-nome" className={`${legend} block`}>
          {reservas.step5} <span className="tracking-normal normal-case text-cinza">{reservas.nameOptional}</span>
        </label>
        <input
          id="pn-nome"
          type="text"
          autoComplete="given-name"
          maxLength={60}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={reservas.namePlaceholder}
          className="h-13 w-full rounded-full bg-marmore px-5 text-base placeholder:text-cinza/70 focus:bg-white focus:outline-2 focus:outline-ginja"
        />
      </div>

      <div className="mt-8 rounded-2xl bg-marmore p-5" aria-live="polite">
        <p className="pn-label text-cinza">{reservas.summary}</p>
        {ready && day && validMeal && validTime ? (
          <p className="mt-3 font-display text-[1.45rem] leading-snug">
            {reservas.meals[validMeal]} · {peopleLabel}
            <span className="mt-1 block text-[1.1rem] text-ginja italic">
              {day.long}, às {validTime}
            </span>
          </p>
        ) : (
          <p className="mt-3 text-cinza">{reservas.pending}</p>
        )}
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        {ready ? (
          <a
            href={ponteiroWhatsappHref(message)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-ginja px-6 font-semibold text-papel transition-colors hover:bg-ginja-deep sm:flex-1"
          >
            <ChatIcon width={19} height={19} />
            {reservas.send}
            <span className="sr-only"> {copy.newTab}</span>
          </a>
        ) : (
          <span aria-disabled="true" className="inline-flex h-14 cursor-not-allowed items-center justify-center gap-2.5 rounded-full bg-ginja/35 px-6 font-semibold text-papel sm:flex-1">
            <ChatIcon width={19} height={19} />
            {reservas.send}
          </span>
        )}
        <a
          href={ponteiro.phoneHref}
          className="inline-flex h-14 items-center justify-center gap-2 rounded-full px-6 font-semibold ring-1 ring-tinta/25 transition-colors hover:bg-tinta hover:text-papel"
        >
          <PhoneIcon width={18} height={18} />
          {reservas.call}
        </a>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-cinza">{reservas.demoNote}</p>
    </form>
  );
}

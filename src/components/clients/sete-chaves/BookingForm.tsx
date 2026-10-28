"use client";

import { AnimatePresence, m } from "motion/react";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { seteChavesCopy as copy } from "@/content/sete-chaves/copy";
import {
  dayNumber,
  isDemoOccupied,
  minNightsFor,
  nightPrice,
  seteChavesMailHref,
  seteChavesPrice,
  seteChavesUnits,
  seteChavesWhatsappHref,
} from "@/content/sete-chaves/facts";
import { ChatIcon, ChevronIcon, MailIcon, MinusIcon, PlusIcon } from "./icons";
import { FobMark } from "./Logo";
import { pickKeyEvent } from "./sections";

/** Today's date (local), read in the browser only: the server never guesses the visitor's day. */
const noop = () => () => {};
const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
};

/** A day number (days since 1970-01-01) back to a local date. */
const fromDayNumber = (n: number) => {
  const utc = new Date(n * 86_400_000);
  return new Date(utc.getUTCFullYear(), utc.getUTCMonth(), utc.getUTCDate());
};

const longDate = new Intl.DateTimeFormat("pt-PT", {
  weekday: "long",
  day: "numeric",
  month: "long",
});
const monthTitle = new Intl.DateTimeFormat("pt-PT", {
  month: "long",
  year: "numeric",
});

// The booking REQUEST, in four small steps: the key (room or small house), the dates on a calendar, the guests and a
// name. It writes the WhatsApp message or the email for the visitor; nothing is stored, nothing is charged, no
// booking engine. The «occupied» nights are a fixed demo pattern (facts.ts) and the page says so. The estimate adds
// the example price of each night, without VAT, with «+ IVA» (owner's absolute rule: never a VAT-inclusive amount).
export function BookingForm() {
  const { booking, rooms, plusVat } = copy;
  const [unitId, setUnitId] = useState(seteChavesUnits[0].id);
  const [monthOffset, setMonthOffset] = useState(0);
  const [checkIn, setCheckIn] = useState<number | null>(null);
  const [checkOut, setCheckOut] = useState<number | null>(null);
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const today = useSyncExternalStore(noop, todayKey, () => null);

  const unit =
    seteChavesUnits.find((u) => u.id === unitId) ?? seteChavesUnits[0];
  const guestCount = Math.min(guests, unit.guests);

  const nightsFree = (from: number, to: number, id = unitId) => {
    const u = seteChavesUnits.find((x) => x.id === id) ?? unit;
    for (let d = from; d < to; d++)
      if (isDemoOccupied(u, fromDayNumber(d))) return false;
    return true;
  };

  const chooseUnit = (id: string) => {
    setUnitId(id);
    setNotice(null);
    if (checkIn !== null && !nightsFree(checkIn, checkOut ?? checkIn + 1, id)) {
      setCheckIn(null);
      setCheckOut(null);
    }
  };

  useEffect(() => {
    const onPick = (event: Event) => {
      const id = (event as CustomEvent<string>).detail;
      if (seteChavesUnits.some((u) => u.id === id)) chooseUnit(id);
    };
    window.addEventListener(pickKeyEvent, onPick);
    return () => window.removeEventListener(pickKeyEvent, onPick);
  });

  const todayNumber = useMemo(() => {
    if (!today) return null;
    const [y, mo, d] = today.split("-").map(Number);
    return dayNumber(new Date(y, mo, d));
  }, [today]);

  const month = useMemo(() => {
    if (!today) return null;
    const [y, mo] = today.split("-").map(Number);
    const first = new Date(y, mo + monthOffset, 1);
    const lead = (first.getDay() + 6) % 7; // Monday first
    const days = new Date(
      first.getFullYear(),
      first.getMonth() + 1,
      0,
    ).getDate();
    const cells: (Date | null)[] = Array.from({ length: lead }, () => null);
    for (let d = 1; d <= days; d++)
      cells.push(new Date(first.getFullYear(), first.getMonth(), d));
    return { title: monthTitle.format(first), cells };
  }, [today, monthOffset]);

  const pickDay = (date: Date) => {
    const n = dayNumber(date);
    setNotice(null);
    if (checkIn === null || checkOut !== null || n <= checkIn) {
      if (isDemoOccupied(unit, date)) {
        setNotice(booking.busyNight);
        return;
      }
      setCheckIn(n);
      setCheckOut(null);
      return;
    }
    if (!nightsFree(checkIn, n)) {
      setNotice(booking.busyInside);
      return;
    }
    const min = minNightsFor(fromDayNumber(checkIn));
    if (n - checkIn < min) {
      setNotice(booking.minNights(min));
      return;
    }
    setCheckOut(n);
  };

  const nights = checkIn !== null && checkOut !== null ? checkOut - checkIn : 0;
  /** The nights grouped by their example price: «2 × 85 €», «1 × 120 €». */
  const groups = useMemo(() => {
    if (checkIn === null || checkOut === null) return [];
    const byPrice = new Map<number, number>();
    for (let d = checkIn; d < checkOut; d++) {
      const price = nightPrice(unit, fromDayNumber(d));
      byPrice.set(price, (byPrice.get(price) ?? 0) + 1);
    }
    return [...byPrice.entries()].map(([price, count]) => ({ price, count }));
  }, [checkIn, checkOut, unit]);
  const subtotal = groups.reduce((sum, g) => sum + g.price * g.count, 0);

  const ready = nights > 0;
  const who = name.trim()
    ? booking.messageName.replace("{nome}", name.trim())
    : "";
  const message =
    ready && checkIn !== null && checkOut !== null
      ? booking.message
          .replace("{nome}", who)
          .replace("{chave}", `n.º ${unit.key}, ${unit.name} (${unit.kind})`)
          .replace("{chegada}", longDate.format(fromDayNumber(checkIn)))
          .replace("{partida}", longDate.format(fromDayNumber(checkOut)))
          .replace("{noites}", booking.nights(nights))
          .replace("{hospedes}", String(guestCount))
      : "";

  const legend = "sc-label mb-4 block text-latao-deep";
  const btn =
    "inline-flex h-14 items-center justify-center gap-2.5 rounded-full px-6 text-[0.82rem] font-semibold tracking-[0.12em] uppercase transition-[filter,background-color]";

  return (
    <form
      className="-mx-5 bg-cal p-5 shadow-[0_30px_70px_-45px_rgb(38_44_51/0.5)] sm:mx-0 sm:rounded-[2rem] sm:p-9"
      onSubmit={(e) => e.preventDefault()}
    >
      <fieldset className="min-w-0">
        <legend className={legend}>{booking.step1}</legend>
        <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2">
          {seteChavesUnits.map((u) => (
            <label key={u.id} className="relative block">
              <input
                type="radio"
                name="chave"
                value={u.id}
                checked={unitId === u.id}
                onChange={() => chooseUnit(u.id)}
                className="peer sr-only"
              />
              <span className="flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl px-3 py-2.5 ring-1 ring-tinta/12 transition-colors peer-checked:bg-linho peer-checked:ring-latao-deep peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-latao-deep hover:ring-latao/60">
                <FobMark
                  number={u.key}
                  ring={false}
                  gradientId={`sc-brass-form-${u.key}`}
                  className="h-9 w-auto shrink-0"
                />
                <span className="min-w-0 flex-1">
                  <span className="block leading-tight font-semibold">
                    {u.name}
                  </span>
                  <span className="block text-[0.78rem] text-pedra">
                    {u.kind} · {rooms.guests(u.guests)}
                  </span>
                </span>
                <span className="shrink-0 text-right">
                  <span className="block font-display text-[1.15rem] leading-none">
                    {seteChavesPrice(u.priceLow)}
                  </span>
                  <span className="mt-0.5 block text-[0.6rem] font-semibold tracking-[0.08em] text-pedra">
                    {plusVat}
                  </span>
                </span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-9 min-w-0">
        <legend className={legend}>{booking.step2}</legend>
        <p className="mb-3 text-sm text-pedra">{booking.calendarHelp}</p>
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setMonthOffset((v) => Math.max(0, v - 1))}
            disabled={monthOffset === 0}
            aria-label={booking.prevMonth}
            className="grid size-11 place-items-center rounded-full ring-1 ring-tinta/15 transition-colors hover:bg-linho disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ChevronIcon className="rotate-180" />
          </button>
          <p
            aria-live="polite"
            className="font-display text-[1.3rem] leading-none first-letter:uppercase"
          >
            {month?.title ?? "…"}
          </p>
          <button
            type="button"
            onClick={() => setMonthOffset((v) => Math.min(11, v + 1))}
            disabled={monthOffset === 11}
            aria-label={booking.nextMonth}
            className="grid size-11 place-items-center rounded-full ring-1 ring-tinta/15 transition-colors hover:bg-linho disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ChevronIcon />
          </button>
        </div>
        <div className="mt-4 grid grid-cols-7 text-center text-[0.68rem] font-semibold tracking-[0.08em] text-pedra uppercase">
          {booking.weekdays.map((w) => (
            <span key={w} className="pb-2">
              {w}
            </span>
          ))}
        </div>
        {month && todayNumber !== null ? (
          <div className="grid grid-cols-7">
            {month.cells.map((date, i) => {
              if (!date) return <span key={`x${i}`} />;
              const n = dayNumber(date);
              const past = n <= todayNumber;
              const busy = !past && isDemoOccupied(unit, date);
              const start = n === checkIn;
              const end = n === checkOut;
              const inside =
                checkIn !== null &&
                checkOut !== null &&
                n > checkIn &&
                n < checkOut;
              const label = `${longDate.format(date)}${past ? `, ${booking.dayPast}` : busy ? `, ${booking.dayBusy}` : ""}`;
              return (
                <button
                  key={n}
                  type="button"
                  disabled={past}
                  onClick={() => pickDay(date)}
                  aria-label={label}
                  aria-pressed={start || end || inside}
                  className={`relative grid h-11 place-items-center text-[0.95rem] tabular-nums transition-colors disabled:cursor-not-allowed ${
                    start || end
                      ? "rounded-full bg-xisto font-semibold text-cal"
                      : inside
                        ? "bg-latao-claro/45"
                        : past
                          ? "text-tinta/25"
                          : busy
                            ? "text-tinta/40 line-through decoration-mancha/70"
                            : "rounded-full hover:bg-linho"
                  }`}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        ) : (
          <div aria-hidden="true" className="grid grid-cols-7 gap-1">
            {Array.from({ length: 35 }, (_, i) => (
              <span
                key={i}
                className="h-10 animate-pulse rounded-full bg-linho"
              />
            ))}
          </div>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.78rem] text-pedra">
          <span className="flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="size-3 rounded-full ring-1 ring-tinta/25"
            />{" "}
            {booking.legendFree}
          </span>
          <span className="flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="text-tinta/40 line-through decoration-mancha/70"
            >
              12
            </span>{" "}
            {booking.legendBusy}
          </span>
          <span className="flex items-center gap-1.5">
            <span aria-hidden="true" className="size-3 rounded-full bg-xisto" />{" "}
            {booking.legendPicked}
          </span>
          {checkIn !== null ? (
            <button
              type="button"
              onClick={() => {
                setCheckIn(null);
                setCheckOut(null);
                setNotice(null);
              }}
              className="ml-auto inline-flex min-h-10 items-center underline underline-offset-4"
            >
              {booking.clear}
            </button>
          ) : null}
        </div>
        <p
          aria-live="polite"
          className="mt-3 min-h-5 text-sm font-medium text-mancha"
        >
          {notice ??
            (checkIn !== null && checkOut === null ? booking.pickCheckOut : "")}
        </p>
        <p className="mt-1 text-xs text-pedra">{booking.demoAvailability}</p>
      </fieldset>

      <fieldset className="mt-9 min-w-0">
        <legend className={legend}>{booking.step3}</legend>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setGuests(Math.max(1, guestCount - 1))}
            disabled={guestCount <= 1}
            aria-label={booking.less}
            className="grid size-12 place-items-center rounded-full ring-1 ring-tinta/15 hover:bg-linho disabled:opacity-35"
          >
            <MinusIcon />
          </button>
          <output
            aria-live="polite"
            aria-label={booking.guestsLabel}
            className="min-w-16 text-center font-display text-[2rem] leading-none"
          >
            {guestCount}
          </output>
          <button
            type="button"
            onClick={() => setGuests(Math.min(unit.guests, guestCount + 1))}
            disabled={guestCount >= unit.guests}
            aria-label={booking.more}
            className="grid size-12 place-items-center rounded-full ring-1 ring-tinta/15 hover:bg-linho disabled:opacity-35"
          >
            <PlusIcon />
          </button>
          <span className="text-sm text-pedra">
            {unit.name}: {rooms.guests(unit.guests)}
            {unit.extra ? ` · ${unit.extra}` : ""}
          </span>
        </div>
      </fieldset>

      <div className="mt-9">
        <label htmlFor="sc-nome" className={legend}>
          {booking.step4}{" "}
          <span className="tracking-normal normal-case text-pedra">
            {booking.nameOptional}
          </span>
        </label>
        <input
          id="sc-nome"
          type="text"
          autoComplete="name"
          maxLength={60}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={booking.namePlaceholder}
          className="h-13 w-full rounded-full bg-linho px-5 text-base placeholder:text-pedra/70 focus:bg-white focus:outline-2 focus:outline-latao-deep"
        />
      </div>

      <div className="mt-9 rounded-2xl bg-linho p-5" aria-live="polite">
        <p className="sc-label text-pedra">{booking.summary}</p>
        <AnimatePresence initial={false} mode="wait">
          {ready && checkIn !== null && checkOut !== null ? (
            <m.div
              key="ok"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="mt-3 font-display text-[1.4rem] leading-snug">
                {unit.name} · {rooms.keyLabel(unit.key)}
              </p>
              <p className="mt-1 text-[0.95rem]">
                {booking.checkIn}: {longDate.format(fromDayNumber(checkIn))}
                <br />
                {booking.checkOut}: {longDate.format(fromDayNumber(checkOut))}
              </p>
              <p className="mt-3 text-[0.95rem]">
                {booking.nights(nights)} · {rooms.guests(guestCount)}
              </p>
              <p className="mt-1 text-[0.95rem] text-pedra">
                {groups
                  .map((g) => `${g.count} × ${seteChavesPrice(g.price)}`)
                  .join(" · ")}
              </p>
              <p className="mt-2 font-display text-[1.7rem] leading-none">
                {seteChavesPrice(subtotal)}{" "}
                <span className="font-sans text-[0.75rem] font-semibold tracking-[0.1em] text-latao-deep">
                  {plusVat}
                </span>
              </p>
              <p className="mt-2 text-xs text-pedra">
                {booking.estimate}
                {unit.breakfast === "opcional"
                  ? ` ${booking.keyBreakfast}`
                  : ""}
              </p>
            </m.div>
          ) : (
            <m.p
              key="pending"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-3 text-pedra"
            >
              {booking.pending}
            </m.p>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        {ready ? (
          <>
            <a
              href={seteChavesWhatsappHref(message)}
              target="_blank"
              rel="noopener noreferrer"
              className={`${btn} sc-brass text-tinta hover:brightness-110 sm:flex-1`}
            >
              <ChatIcon width={18} height={18} />
              {booking.sendWhatsapp}
              <span className="sr-only"> {copy.newTab}</span>
            </a>
            <a
              href={seteChavesMailHref(booking.emailSubject, message)}
              className={`${btn} bg-xisto text-cal hover:bg-tinta sm:flex-1`}
            >
              <MailIcon width={18} height={18} />
              {booking.sendEmail}
            </a>
          </>
        ) : (
          <>
            <span
              aria-disabled="true"
              className={`${btn} cursor-not-allowed bg-latao/35 text-tinta/60 sm:flex-1`}
            >
              <ChatIcon width={18} height={18} />
              {booking.sendWhatsapp}
            </span>
            <span
              aria-disabled="true"
              className={`${btn} cursor-not-allowed bg-xisto/25 text-tinta/60 sm:flex-1`}
            >
              <MailIcon width={18} height={18} />
              {booking.sendEmail}
            </span>
          </>
        )}
      </div>
      <p className="mt-4 text-xs leading-relaxed text-pedra">
        {booking.demoNote}
      </p>
    </form>
  );
}

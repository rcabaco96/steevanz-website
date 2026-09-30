"use client";

import Link from "next/link";
import { AnimatePresence, LazyMotion, MotionConfig, domAnimation, m } from "motion/react";
import { useMemo, useRef, useState, useTransition, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Check, ClockIcon } from "@/components/icons";
import { buttonClasses } from "@/components/ui/Button";
import type { BookingCopy, FormField } from "@/content/booking";
import { submitBooking, type BookingActionState } from "@/lib/booking/actions";
import { formatSlotDate, formatSlotRange, formatSlotTime } from "@/lib/booking/format";
import { buildIcs, googleCalendarUrl, type CalendarEvent } from "@/lib/booking/ics";
import type { DayAvailability, Slot } from "@/lib/booking/slots";
import type { Locale } from "@/lib/i18n";
import { BookingCalendar, initialMonth } from "./BookingCalendar";
import {
  ConsentField,
  FormAlert,
  HiddenInputs,
  Honeypot,
  SelectField,
  TextAreaField,
  TextField,
  type SelectOption,
} from "./fields";

type Step = "choose" | "details" | "done";

interface BookingFlowProps {
  locale: Locale;
  copy: BookingCopy;
  products: SelectOption[];
  sectors: SelectOption[];
  initialProductId: string;
  initialDays: DayAvailability[];
  timeZone: string;
  tracking: Record<string, string>;
  links: { privacy: string; requestInfo: string; home: string };
}

const ease = [0.16, 1, 0.3, 1] as const;

const stepMotion = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2, ease } },
};

function firstAvailableDate(days: DayAvailability[]): string | null {
  return days.find((day) => day.slots.length > 0)?.date ?? null;
}

export function BookingFlow({
  locale,
  copy,
  products,
  sectors,
  initialProductId,
  initialDays,
  timeZone,
  tracking,
  links,
}: BookingFlowProps) {
  const t = copy.form;
  const [days, setDays] = useState(initialDays);
  const [step, setStep] = useState<Step>("choose");
  const [productId, setProductId] = useState(initialProductId);
  const [selectedDate, setSelectedDate] = useState<string | null>(() => firstAvailableDate(initialDays));
  const [month, setMonth] = useState(() => initialMonth(initialDays, firstAvailableDate(initialDays)));
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [result, setResult] = useState<BookingActionState>({ status: "idle" });
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const cardRef = useRef<HTMLDivElement>(null);

  const hasAnySlot = useMemo(() => days.some((day) => day.slots.length > 0), [days]);
  const selectedDay = days.find((day) => day.date === selectedDate) ?? null;
  const productName = products.find((product) => product.value === productId)?.label ?? t.productUndecided;
  const errorFields: FormField[] = result.status === "error" ? result.fields : [];
  const fieldError = (field: FormField) => (errorFields.includes(field) ? t.fieldErrors[field] : undefined);
  const stepIndex = step === "choose" ? 1 : step === "details" ? 2 : 3;

  function scrollToCard() {
    const card = cardRef.current;
    if (!card) return;
    const top = card.getBoundingClientRect().top;
    if (top < 0 || top > window.innerHeight * 0.4) {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      card.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    }
  }

  function goTo(next: Step) {
    setStep(next);
    requestAnimationFrame(scrollToCard);
  }

  function selectDate(date: string) {
    setSelectedDate(date);
    setSelectedSlot(null);
    setNotice(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedSlot) {
      goTo("choose");
      return;
    }
    const formData = new FormData(event.currentTarget);
    formData.set("slotStart", selectedSlot.start);
    formData.set("productId", productId);
    formData.set("referrer", document.referrer.slice(0, 300));
    startTransition(async () => {
      const response = await submitBooking({ status: "idle" }, formData);
      startTransition(() => {
        setResult(response);
        if (response.status === "success") {
          setDays((current) =>
            current.map((day) => ({ ...day, slots: day.slots.filter((slot) => slot.start !== response.start) })),
          );
          goTo("done");
        } else if (response.status === "error" && response.code === "slot_taken") {
          if (response.days) setDays(response.days);
          setSelectedSlot(null);
          setNotice(copy.slotTaken);
          goTo("choose");
        }
      });
    });
  }

  const generalError =
    result.status === "error"
      ? result.code === "rate_limited"
        ? t.rateLimitedError
        : result.code === "unavailable"
          ? t.unavailableError
          : result.code === "generic"
            ? t.genericError
            : null
      : null;

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <div ref={cardRef} className="card relative scroll-mt-28 overflow-hidden">
          <div aria-hidden="true" className="glow-backdrop pointer-events-none absolute inset-0 opacity-50" />
          <div className="relative border-b border-line px-5 py-4 sm:px-8">
            <ol className="flex items-center gap-2 sm:gap-4" aria-label={copy.stepLabel.replace("{current}", String(stepIndex)).replace("{total}", "3")}>
              {[copy.steps.choose, copy.steps.details, copy.steps.done].map((label, index) => {
                const position = index + 1;
                const state = position < stepIndex ? "complete" : position === stepIndex ? "current" : "upcoming";
                return (
                  <li key={label} className="flex min-w-0 flex-1 items-center gap-2 sm:flex-none" aria-current={state === "current" ? "step" : undefined}>
                    <span
                      className={[
                        "grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-semibold transition-colors duration-300",
                        state === "upcoming" ? "border border-line-strong text-subtle" : "bg-accent text-accent-contrast",
                      ].join(" ")}
                    >
                      {state === "complete" ? <Check size={14} /> : position}
                    </span>
                    <span className={`truncate text-sm ${state === "current" ? "font-semibold text-text" : "text-subtle"} ${state === "current" ? "" : "hidden sm:inline"}`}>
                      {label}
                    </span>
                    {position < 3 ? <span aria-hidden="true" className="hidden h-px w-8 bg-line-strong sm:block" /> : null}
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="relative px-5 py-6 sm:px-8 sm:py-8">
            <AnimatePresence mode="wait" initial={false}>
              {step === "choose" ? (
                <m.div key="choose" {...stepMotion} className="flex flex-col gap-7">
                  <SelectField
                    name="productIdSelect"
                    label={copy.productLabel}
                    options={products}
                    placeholder={t.productUndecided}
                    value={productId}
                    onChange={setProductId}
                  />

                  {notice ? <FormAlert>{notice}</FormAlert> : null}

                  {hasAnySlot ? (
                    <div className="grid gap-8 md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] md:gap-10">
                      <section aria-labelledby="booking-date-label" className="flex flex-col gap-3">
                        <h2 id="booking-date-label" className="text-sm font-semibold text-text">
                          {copy.dateLabel}
                        </h2>
                        <BookingCalendar
                          locale={locale}
                          days={days}
                          month={month}
                          onMonthChange={setMonth}
                          selectedDate={selectedDate}
                          onSelectDate={selectDate}
                          labels={{
                            previousMonth: copy.previousMonth,
                            nextMonth: copy.nextMonth,
                            weekdaysShort: copy.weekdaysShort,
                            available: copy.available,
                            dateLabel: copy.dateLabel,
                          }}
                        />
                      </section>

                      <section aria-labelledby="booking-time-label" className="flex min-h-64 flex-col gap-3">
                        <div className="flex items-baseline justify-between gap-3">
                          <h2 id="booking-time-label" className="text-sm font-semibold text-text">
                            {copy.timeLabel}
                          </h2>
                          {selectedDay ? (
                            <p className="text-sm first-letter:uppercase text-muted">{formatSlotDate(selectedDay.slots[0]?.start ?? `${selectedDay.date}T12:00:00Z`, locale, timeZone)}</p>
                          ) : null}
                        </div>
                        {selectedDay && selectedDay.slots.length > 0 ? (
                          <div role="radiogroup" aria-labelledby="booking-time-label" className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-3">
                            {selectedDay.slots.map((slot, index) => {
                              const checked = selectedSlot?.start === slot.start;
                              return (
                                <m.button
                                  key={`${selectedDay.date}-${slot.start}`}
                                  type="button"
                                  role="radio"
                                  aria-checked={checked}
                                  onClick={() => {
                                    setSelectedSlot(slot);
                                    setNotice(null);
                                  }}
                                  initial={{ opacity: 0, y: 8 }}
                                  animate={{ opacity: 1, y: 0, transition: { duration: 0.3, ease, delay: Math.min(index * 0.02, 0.3) } }}
                                  className={[
                                    "h-11 rounded-xl border text-[0.95rem] font-semibold tabular-nums transition-[background-color,border-color,color,box-shadow] duration-200",
                                    checked
                                      ? "border-accent bg-accent text-accent-contrast shadow-[0_10px_24px_-14px_rgb(var(--glow)/0.9)]"
                                      : "border-line bg-surface text-text hover:border-accent/60 hover:bg-accent-soft",
                                  ].join(" ")}
                                >
                                  {slot.time}
                                </m.button>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="rounded-2xl border border-dashed border-line-strong px-4 py-6 text-center text-sm text-muted">
                            {selectedDay ? copy.noSlotsOnDay : copy.pickDateFirst}
                          </p>
                        )}
                        <p className="mt-auto flex items-center gap-1.5 pt-2 text-xs text-subtle">
                          <ClockIcon size={14} />
                          {copy.timeZoneNote}
                        </p>
                      </section>
                    </div>
                  ) : (
                    <div className="flex flex-col items-start gap-4 rounded-2xl border border-dashed border-line-strong p-6">
                      <p className="text-muted">{copy.noSlotsAtAll}</p>
                      <Link href={links.requestInfo} className={buttonClasses("secondary", "md")}>
                        {copy.unavailableCta}
                      </Link>
                    </div>
                  )}

                  <div className="flex flex-col-reverse items-stretch gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-muted" aria-live="polite">
                      {selectedSlot ? formatSlotRange(selectedSlot.start, selectedSlot.end, locale, timeZone) : " "}
                    </p>
                    <button
                      type="button"
                      disabled={!selectedSlot}
                      onClick={() => goTo("details")}
                      className={buttonClasses("primary", "lg", "w-full sm:w-auto")}
                    >
                      {copy.continue}
                      <ArrowRight size={18} className="transition-transform duration-300 group-hover/button:translate-x-0.5" />
                    </button>
                  </div>
                </m.div>
              ) : null}

              {step === "details" && selectedSlot ? (
                <m.div key="details" {...stepMotion}>
                  <form
                    onSubmit={handleSubmit}
                    onChange={(event) => {
                      const target = event.target as unknown as HTMLInputElement;
                      if (!target.name) return;
                      const value = target.type === "checkbox" ? (target.checked ? "on" : "") : target.value;
                      setDraft((current) => ({ ...current, [target.name]: value }));
                    }}
                    className="relative flex flex-col gap-6"
                  >
                    <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface-2/70 p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent-text">
                          <ClockIcon size={20} />
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold tracking-wide text-subtle uppercase">{copy.summaryTitle}</p>
                          <p className="font-semibold text-text first-letter:uppercase">
                            {formatSlotRange(selectedSlot.start, selectedSlot.end, locale, timeZone)}
                          </p>
                          <p className="text-sm text-muted">{productName}</p>
                        </div>
                      </div>
                      <button type="button" onClick={() => goTo("choose")} className={buttonClasses("ghost", "sm", "self-start sm:self-center")}>
                        {copy.change}
                      </button>
                    </div>

                    {generalError ? <FormAlert>{generalError}</FormAlert> : null}

                    <div className="grid gap-5 sm:grid-cols-2">
                      <TextField
                        name="name"
                        label={t.labels.name}
                        required
                        autoComplete="name"
                        placeholder={t.placeholders.name}
                        maxLength={120}
                        defaultValue={draft.name}
                        error={fieldError("name")}
                      />
                      <TextField
                        name="email"
                        type="email"
                        label={t.labels.email}
                        required
                        autoComplete="email"
                        inputMode="email"
                        placeholder={t.placeholders.email}
                        defaultValue={draft.email}
                        error={fieldError("email")}
                      />
                      <TextField
                        name="phone"
                        type="tel"
                        label={t.labels.phone}
                        required
                        autoComplete="tel"
                        inputMode="tel"
                        placeholder={t.placeholders.phone}
                        maxLength={24}
                        defaultValue={draft.phone}
                        error={fieldError("phone")}
                      />
                      <TextField
                        name="businessName"
                        label={t.labels.businessName}
                        optionalLabel={t.optional}
                        autoComplete="organization"
                        placeholder={t.placeholders.businessName}
                        maxLength={160}
                        defaultValue={draft.businessName}
                        error={fieldError("businessName")}
                      />
                      <SelectField
                        name="sector"
                        label={t.labels.sector}
                        optionalLabel={t.optional}
                        options={sectors}
                        placeholder={t.sectorPlaceholder}
                        defaultValue={draft.sector ?? ""}
                        error={fieldError("sector")}
                        className="sm:col-span-2"
                      />
                      <TextAreaField
                        name="message"
                        label={t.labels.message}
                        optionalLabel={t.optional}
                        placeholder={t.placeholders.message}
                        defaultValue={draft.message}
                        error={fieldError("message")}
                        className="sm:col-span-2"
                      />
                    </div>

                    <ConsentField copy={t} privacyHref={links.privacy} error={fieldError("consent")} defaultChecked={draft.consent === "on"} />
                    <Honeypot label={t.honeypotLabel} />
                    <HiddenInputs values={{ ...tracking, locale }} />

                    <div className="flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
                      <button type="button" onClick={() => goTo("choose")} className={buttonClasses("ghost", "md", "w-full sm:w-auto")}>
                        <ArrowLeft size={18} />
                        {copy.back}
                      </button>
                      <button type="submit" disabled={pending} aria-busy={pending} className={buttonClasses("primary", "lg", "w-full sm:w-auto")}>
                        {pending ? (
                          <>
                            <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
                            {t.sending}
                          </>
                        ) : (
                          <>
                            {copy.submit}
                            <Check size={18} />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </m.div>
              ) : null}

              {step === "done" && result.status === "success" ? (
                <m.div key="done" {...stepMotion}>
                  <BookingSuccess
                    copy={copy}
                    locale={locale}
                    timeZone={timeZone}
                    start={result.start}
                    end={result.end}
                    reference={result.reference}
                    productName={productName}
                    homeHref={links.home}
                    onReset={() => {
                      setResult({ status: "idle" });
                      setSelectedSlot(null);
                      setStep("choose");
                    }}
                  />
                </m.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </MotionConfig>
    </LazyMotion>
  );
}

interface BookingSuccessProps {
  copy: BookingCopy;
  locale: Locale;
  timeZone: string;
  start: string;
  end: string;
  reference: string;
  productName: string;
  homeHref: string;
  onReset: () => void;
}

function BookingSuccess({ copy, locale, timeZone, start, end, reference, productName, homeHref, onReset }: BookingSuccessProps) {
  const event: CalendarEvent = {
    uid: reference,
    start,
    end,
    title: copy.success.eventTitle,
    description: `${copy.success.eventDescription} ${productName}.`,
  };
  const icsHref = `data:text/calendar;charset=utf-8,${encodeURIComponent(buildIcs(event))}`;

  return (
    <div className="flex flex-col items-center gap-6 py-4 text-center sm:py-8" role="status">
      <m.span
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, transition: { type: "spring", stiffness: 260, damping: 18 } }}
        className="grid h-18 w-18 place-items-center rounded-full bg-success-soft text-success shadow-[0_0_0_10px_color-mix(in_oklab,var(--success)_12%,transparent)]"
      >
        <Check size={36} strokeWidth={2.2} />
      </m.span>
      <div className="flex max-w-lg flex-col gap-3">
        <h2 className="display text-3xl sm:text-4xl">{copy.success.title}</h2>
        <p className="text-muted">{copy.success.body}</p>
      </div>
      <div className="w-full max-w-md rounded-2xl border border-line bg-surface-2/70 p-5 text-left">
        <p className="text-xs font-semibold tracking-wide text-subtle uppercase">{copy.summaryTitle}</p>
        <p className="mt-1 text-lg font-semibold text-text first-letter:uppercase">{formatSlotDate(start, locale, timeZone)}</p>
        <p className="tabular-nums text-muted">
          {formatSlotTime(start, locale, timeZone)}–{formatSlotTime(end, locale, timeZone)} · {productName}
        </p>
      </div>
      <div className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
        <a href={icsHref} download={copy.success.icsFileName} className={buttonClasses("primary", "md", "flex-1")}>
          {copy.success.addToCalendar}
        </a>
        <a href={googleCalendarUrl(event)} target="_blank" rel="noopener noreferrer" className={buttonClasses("secondary", "md", "flex-1")}>
          {copy.success.googleCalendar}
        </a>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <button type="button" onClick={onReset} className={buttonClasses("ghost", "sm")}>
          {copy.success.another}
        </button>
        <Link href={homeHref} className={buttonClasses("ghost", "sm")}>
          {copy.success.home}
        </Link>
      </div>
    </div>
  );
}

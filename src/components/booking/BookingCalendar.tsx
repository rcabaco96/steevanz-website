"use client";

import { useMemo } from "react";
import { ArrowLeft, ArrowRight } from "@/components/icons";
import { formatLongDate, formatMonth } from "@/lib/booking/format";
import { addDaysToDate, weekdayOfDate, type DayAvailability } from "@/lib/booking/slots";
import type { Locale } from "@/lib/i18n";

interface BookingCalendarProps {
  locale: Locale;
  days: DayAvailability[];
  month: string;
  onMonthChange: (month: string) => void;
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  labels: { previousMonth: string; nextMonth: string; weekdaysShort: string[]; available: string; dateLabel: string };
}

interface CalendarCell {
  date: string;
  day: number;
  inMonth: boolean;
  slots: number;
  inRange: boolean;
}

function monthKey(date: string): string {
  return date.slice(0, 7);
}

function shiftMonth(month: string, delta: number): string {
  const [year, value] = month.split("-").map(Number);
  const shifted = new Date(Date.UTC(year, value - 1 + delta, 1));
  return shifted.toISOString().slice(0, 7);
}

function buildCells(month: string, byDate: Map<string, DayAvailability>): CalendarCell[] {
  const firstOfMonth = `${month}-01`;
  const leading = (weekdayOfDate(firstOfMonth) + 6) % 7;
  const gridStart = addDaysToDate(firstOfMonth, -leading);
  return Array.from({ length: 42 }, (_, index) => {
    const date = addDaysToDate(gridStart, index);
    const entry = byDate.get(date);
    return {
      date,
      day: Number(date.slice(8, 10)),
      inMonth: monthKey(date) === month,
      slots: entry?.slots.length ?? 0,
      inRange: Boolean(entry),
    };
  });
}

export function BookingCalendar({
  locale,
  days,
  month,
  onMonthChange,
  selectedDate,
  onSelectDate,
  labels,
}: BookingCalendarProps) {
  const byDate = useMemo(() => new Map(days.map((day) => [day.date, day])), [days]);
  const cells = useMemo(() => buildCells(month, byDate), [month, byDate]);
  const firstMonth = days.length ? monthKey(days[0].date) : month;
  const lastMonth = days.length ? monthKey(days[days.length - 1].date) : month;
  const canGoBack = month > firstMonth;
  const canGoForward = month < lastMonth;
  const today = days[0]?.date;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-base font-semibold capitalize text-text" aria-live="polite">
          {formatMonth(`${month}-01`, locale)}
        </p>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => onMonthChange(shiftMonth(month, -1))}
            disabled={!canGoBack}
            aria-label={labels.previousMonth}
            className="grid h-10 w-10 place-items-center rounded-full border border-line text-text transition-colors hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ArrowLeft size={17} />
          </button>
          <button
            type="button"
            onClick={() => onMonthChange(shiftMonth(month, 1))}
            disabled={!canGoForward}
            aria-label={labels.nextMonth}
            className="grid h-10 w-10 place-items-center rounded-full border border-line text-text transition-colors hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ArrowRight size={17} />
          </button>
        </div>
      </div>

      <div role="group" aria-label={labels.dateLabel} className="grid grid-cols-7 gap-1 text-center">
        {labels.weekdaysShort.map((weekday) => (
          <span key={weekday} aria-hidden="true" className="pb-1 font-mono text-[0.68rem] tracking-[0.12em] text-subtle uppercase">
            {weekday}
          </span>
        ))}
        {cells.map((cell) => {
          const selectable = cell.inMonth && cell.slots > 0;
          const selected = cell.date === selectedDate;
          if (!cell.inMonth) return <span key={cell.date} aria-hidden="true" className="aspect-square" />;
          return (
            <button
              key={cell.date}
              type="button"
              disabled={!selectable}
              aria-pressed={selected}
              aria-label={`${formatLongDate(cell.date, locale)}${selectable ? `, ${labels.available}` : ""}`}
              onClick={() => onSelectDate(cell.date)}
              className={[
                "relative flex aspect-square min-h-10 flex-col items-center justify-center rounded-xl text-[0.95rem] tabular-nums transition-[background-color,color,transform,box-shadow] duration-200 ease-(--ease-out-expo)",
                selected
                  ? "bg-accent font-semibold text-accent-contrast shadow-[0_10px_24px_-12px_rgb(var(--glow)/0.9)]"
                  : selectable
                    ? "font-semibold text-text hover:bg-accent-soft active:scale-95"
                    : "cursor-not-allowed text-subtle/50",
                cell.date === today && !selected ? "ring-1 ring-line-strong" : "",
              ].join(" ")}
            >
              {cell.day}
              {selectable && !selected ? (
                <span aria-hidden="true" className="absolute bottom-1.5 h-1 w-1 rounded-full bg-accent" />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function initialMonth(days: DayAvailability[], selectedDate: string | null): string {
  if (selectedDate) return monthKey(selectedDate);
  return days.length ? monthKey(days[0].date) : new Date().toISOString().slice(0, 7);
}

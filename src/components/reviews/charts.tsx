"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { formatInt, formatPercent } from "@/lib/reviews/format";

export type ValueFormat = "int" | "percent";

const formatters: Record<ValueFormat, (value: number) => string> = { int: formatInt, percent: (value) => formatPercent(value) };

type VizColor = "viz-1" | "viz-2";

const fillClass: Record<VizColor, string> = { "viz-1": "bg-viz-1", "viz-2": "bg-viz-2" };
const strokeVar: Record<VizColor, string> = { "viz-1": "var(--viz-1)", "viz-2": "var(--viz-2)" };

function useElementWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return [ref, width] as const;
}

/** Shows every nth x label so labels never collide, based on the longest label. */
function everyNth(labels: string[], plotWidth: number): number {
  const longest = Math.max(1, ...labels.map((label) => label.length));
  const spacing = longest * 6.5 + 10;
  return Math.max(1, Math.ceil(labels.length / Math.max(1, Math.floor(plotWidth / spacing))));
}

function niceTicks(max: number, count = 4): number[] {
  if (max <= 0) return [0, 1];
  const rough = max / count;
  const magnitude = 10 ** Math.floor(Math.log10(rough));
  const step = [1, 2, 2.5, 5, 10].map((factor) => factor * magnitude).find((candidate) => candidate >= rough) ?? rough;
  const ticks: number[] = [];
  for (let value = 0; value <= max + step * 0.001; value += step) ticks.push(Math.round(value * 1000) / 1000);
  if (ticks[ticks.length - 1] < max) ticks.push(ticks[ticks.length - 1] + step);
  return ticks;
}

interface TooltipState {
  x: number;
  title: string;
  rows: { label: string; value: string; color?: VizColor }[];
}

function Tooltip({ state, containerWidth }: { state: TooltipState | null; containerWidth: number }) {
  if (!state) return null;
  const width = 176;
  const left = Math.min(Math.max(state.x - width / 2, 0), Math.max(0, containerWidth - width));
  return (
    <div
      role="status"
      style={{ left, width }}
      className="pointer-events-none absolute -top-2 z-10 -translate-y-full rounded-xl border border-line bg-surface px-3 py-2 text-xs shadow-[0_12px_32px_-12px_rgb(var(--shadow-color)/0.35)]"
    >
      <p className="mb-1 text-subtle">{state.title}</p>
      {state.rows.map((row) => (
        <p key={row.label} className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-1.5 text-muted">
            {row.color ? <span aria-hidden="true" className={`h-0.5 w-3 rounded-full ${fillClass[row.color]}`} /> : null}
            {row.label}
          </span>
          <span className="text-sm font-semibold text-text">{row.value}</span>
        </p>
      ))}
    </div>
  );
}

export function DataTable({ caption, headers, rows }: { caption: string; headers: string[]; rows: (string | number)[][] }) {
  return (
    <details className="group mt-3 text-sm">
      <summary className="inline-flex min-h-10 cursor-pointer list-none items-center gap-1.5 rounded-full text-xs font-semibold text-muted hover:text-text [&::-webkit-details-marker]:hidden">
        <svg aria-hidden="true" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform group-open:rotate-90">
          <path d="m9 6 6 6-6 6" />
        </svg>
        Ver dados
      </summary>
      <div className="mt-2 max-h-72 overflow-auto rounded-xl border border-line">
        <table className="w-full text-left text-xs">
          <caption className="sr-only">{caption}</caption>
          <thead className="sticky top-0 bg-surface-2">
            <tr>
              {headers.map((header, index) => (
                <th key={header} scope="col" className={`px-3 py-2 font-semibold text-muted ${index ? "text-right" : ""}`}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-t border-line">
                {row.map((cell, index) => (
                  <td key={index} className={`px-3 py-1.5 ${index ? "tabular text-right" : "text-text"}`}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}

export interface ColumnDatum {
  key: string;
  label: string;
  longLabel: string;
  value: number;
  /** Too little data behind this value: drawn in grey and flagged in the tooltip. */
  muted?: boolean;
}

interface ColumnChartProps {
  data: ColumnDatum[];
  seriesLabel: string;
  valueFormat?: ValueFormat;
  color?: VizColor;
  marker?: { key: string; label: string };
  height?: number;
  fixedMax?: number;
}

export function ColumnChart({ data, seriesLabel, valueFormat = "int", color = "viz-1", marker, height = 160, fixedMax }: ColumnChartProps) {
  const formatValue = formatters[valueFormat];
  const [ref, width] = useElementWidth<HTMLDivElement>();
  const [active, setActive] = useState<number | null>(null);
  const max = fixedMax ?? Math.max(0, ...data.map((datum) => datum.value));
  const ticks = niceTicks(max);
  const top = fixedMax ?? ticks[ticks.length - 1];
  const plotWidth = Math.max(0, width - 36);
  const labelEvery = everyNth(data.map((datum) => datum.label), plotWidth);
  const markerIndex = marker ? data.findIndex((datum) => datum.key === marker.key) : -1;
  const slot = data.length ? plotWidth / data.length : 0;
  const tooltip: TooltipState | null =
    active === null
      ? null
      : {
          x: 36 + slot * (active + 0.5),
          title: data[active].longLabel,
          rows: [{ label: data[active].muted ? `${seriesLabel} (poucos dados)` : seriesLabel, value: formatValue(data[active].value), color }],
        };

  return (
    <div ref={ref} className="relative select-none" onPointerLeave={() => setActive(null)}>
      <Tooltip state={tooltip} containerWidth={width} />
      <div className="flex" style={{ height }}>
        <div className="relative w-9 shrink-0">
          {ticks.map((tick) => (
            <span key={tick} className="tabular absolute right-2 translate-y-1/2 text-[0.7rem] text-subtle" style={{ bottom: `${(tick / top) * 100}%` }}>
              {formatValue(tick)}
            </span>
          ))}
        </div>
        <div className="relative flex-1 border-b border-line">
          {ticks.slice(1).map((tick) => (
            <span key={tick} aria-hidden="true" className="absolute inset-x-0 border-t border-line/70" style={{ bottom: `${(tick / top) * 100}%` }} />
          ))}
          {markerIndex >= 0 ? (
            <span aria-hidden="true" className="absolute inset-y-0 border-l border-text/40" style={{ left: slot * markerIndex }}>
              <span className="absolute -top-1 left-1 -translate-y-full rounded-full bg-surface-2 px-1.5 py-0.5 text-[0.65rem] font-semibold whitespace-nowrap text-muted">
                {marker!.label}
              </span>
            </span>
          ) : null}
          <div className="absolute inset-0 flex items-end gap-0.5">
            {data.map((datum, index) => (
              <div key={datum.key} className="relative flex h-full min-w-0 flex-1 items-end justify-center">
                <span
                  aria-hidden="true"
                  className={`block w-full max-w-6 rounded-t-[4px] transition-opacity ${datum.muted ? "bg-line-strong" : fillClass[color]} ${active !== null && active !== index ? "opacity-50" : ""}`}
                  style={{ height: datum.value > 0 ? `max(2px, ${(datum.value / top) * 100}%)` : 0 }}
                />
                <button
                  type="button"
                  aria-label={`${datum.longLabel}: ${formatValue(datum.value)} ${seriesLabel}`}
                  onPointerEnter={() => setActive(index)}
                  onFocus={() => setActive(index)}
                  onBlur={() => setActive(null)}
                  className="absolute inset-0 rounded-sm focus-visible:outline-2 focus-visible:outline-ring"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="ml-9 flex gap-0.5 pt-1.5" aria-hidden="true">
        {data.map((datum, index) => (
          <span key={datum.key} className="min-w-0 flex-1 overflow-visible text-center text-[0.7rem] whitespace-nowrap text-subtle">
            {index % labelEvery === 0 ? datum.label : ""}
          </span>
        ))}
      </div>
    </div>
  );
}

export interface LinePoint {
  key: string;
  label: string;
  longLabel: string;
  value: number | null;
}

export function RatingLineChart({ data, seriesLabel, height = 150 }: { data: LinePoint[]; seriesLabel: string; height?: number }) {
  const [ref, width] = useElementWidth<HTMLDivElement>();
  const [active, setActive] = useState<number | null>(null);
  const values = data.map((point) => point.value).filter((value): value is number => value !== null);
  const low = values.length ? Math.max(1, Math.floor((Math.min(...values) - 0.25) * 2) / 2) : 1;
  const ticks: number[] = [];
  const tickStep = 5 - low > 2 ? 1 : 0.5;
  for (let value = low; value <= 5.0001; value += tickStep) ticks.push(value);
  const gutter = 36;
  const plotWidth = Math.max(0, width - gutter);
  const padY = 8;
  const plotHeight = height - padY * 2;
  const x = (index: number) => gutter + (data.length <= 1 ? plotWidth / 2 : (plotWidth * (index + 0.5)) / data.length);
  const y = (value: number) => padY + plotHeight * (1 - (value - low) / (5 - low));
  const labelEvery = everyNth(data.map((point) => point.label), plotWidth);

  const segments: string[] = [];
  let current = "";
  data.forEach((point, index) => {
    if (point.value === null) {
      if (current) segments.push(current);
      current = "";
      return;
    }
    current += `${current ? "L" : "M"}${x(index).toFixed(1)},${y(point.value).toFixed(1)}`;
  });
  if (current) segments.push(current);

  function nearest(event: PointerEvent<SVGRectElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const relative = event.clientX - rect.left;
    const index = Math.round((relative / rect.width) * data.length - 0.5);
    setActive(Math.min(data.length - 1, Math.max(0, index)));
  }

  function onKey(event: KeyboardEvent<SVGRectElement>) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    setActive((previous) => {
      const start = previous ?? (event.key === "ArrowRight" ? -1 : data.length);
      return Math.min(data.length - 1, Math.max(0, start + (event.key === "ArrowRight" ? 1 : -1)));
    });
  }

  const activePoint = active === null ? null : data[active];
  const tooltip: TooltipState | null = activePoint
    ? { x: x(active!), title: activePoint.longLabel, rows: [{ label: seriesLabel, value: activePoint.value === null ? "sem reviews" : activePoint.value.toFixed(1).replace(".", ","), color: "viz-1" }] }
    : null;

  return (
    <div ref={ref} className="relative select-none">
      <Tooltip state={tooltip} containerWidth={width} />
      {width > 0 ? (
        <svg width={width} height={height} className="block overflow-visible" role="img" aria-label={`${seriesLabel} por período`}>
          {ticks.map((tick) => (
            <g key={tick}>
              <line x1={gutter} x2={width} y1={y(tick)} y2={y(tick)} stroke="var(--line)" strokeWidth={1} />
              <text x={gutter - 8} y={y(tick)} dy="0.32em" textAnchor="end" className="fill-subtle text-[0.7rem]" style={{ fontVariantNumeric: "tabular-nums" }}>
                {tick.toFixed(1).replace(".", ",")}
              </text>
            </g>
          ))}
          {activePoint ? <line x1={x(active!)} x2={x(active!)} y1={padY} y2={height - padY} stroke="var(--text-subtle)" strokeWidth={1} /> : null}
          {segments.map((path) => (
            <path key={path} d={path} fill="none" stroke={strokeVar["viz-1"]} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
          ))}
          {data.map((point, index) =>
            point.value === null || (data.length > 16 && index !== active) ? null : (
              <circle key={point.key} cx={x(index)} cy={y(point.value)} r={4} fill={strokeVar["viz-1"]} stroke="var(--surface)" strokeWidth={2} />
            ),
          )}
          <rect
            x={gutter}
            y={0}
            width={plotWidth}
            height={height}
            fill="transparent"
            tabIndex={0}
            aria-label={`${seriesLabel}: use as setas para percorrer os períodos`}
            onPointerMove={nearest}
            onPointerLeave={() => setActive(null)}
            onKeyDown={onKey}
            onBlur={() => setActive(null)}
            className="focus-visible:outline-2 focus-visible:outline-ring"
          />
        </svg>
      ) : (
        <div style={{ height }} />
      )}
      <div className="ml-9 flex pt-1.5" aria-hidden="true">
        {data.map((point, index) => (
          <span key={point.key} className="min-w-0 flex-1 text-center text-[0.7rem] whitespace-nowrap text-subtle">
            {index % labelEvery === 0 ? point.label : ""}
          </span>
        ))}
      </div>
    </div>
  );
}

export interface BarRow {
  key: string;
  label: ReactNode;
  value: number;
  display: string;
  detail?: string;
}

/** Horizontal bars with the value at the tip. Few rows, so every bar is labeled. */
export function BarList({ rows, max, color = "viz-1" }: { rows: BarRow[]; max?: number; color?: VizColor }) {
  const top = max ?? Math.max(1, ...rows.map((row) => row.value));
  return (
    <ul className="grid grid-cols-[max-content_minmax(0,1fr)_max-content] items-center gap-x-3 gap-y-3">
      {rows.map((row) => (
        <li key={row.key} className="contents">
          <span className="text-sm text-text">{row.label}</span>
          <span className="h-3 min-w-0">
            <span
              className={`block h-full rounded-r-[4px] ${fillClass[color]}`}
              style={{ width: row.value > 0 ? `max(2px, ${(row.value / top) * 100}%)` : 0 }}
            />
          </span>
          <span className="tabular text-right text-sm font-semibold text-text">
            {row.display}
            {row.detail ? <span className="ml-1 font-normal text-subtle">{row.detail}</span> : null}
          </span>
        </li>
      ))}
    </ul>
  );
}

export interface RatingRow {
  key: string;
  label: string;
  rating: number | null;
  count: number;
}

/**
 * Average ratings as dots on a shared 1–5★ scale. Bars from zero would hide the
 * differences that matter (4,0 vs 4,4), and a truncated bar axis would exaggerate them.
 */
export function RatingDots({ rows }: { rows: RatingRow[] }) {
  const position = (rating: number) => `${((rating - 1) / 4) * 100}%`;
  return (
    <div>
      <ul className="grid grid-cols-[max-content_minmax(0,1fr)_max-content] items-center gap-x-3 gap-y-1">
        {rows.map((row) => (
          <li key={row.key} className="contents">
            <span className="text-sm text-text">{row.label}</span>
            <span className="relative h-8 min-w-0" aria-hidden="true">
              <span className="absolute inset-x-0 top-1/2 border-t border-line" />
              {[1, 2, 3, 4, 5].map((tick) => (
                <span key={tick} className="absolute top-1/2 h-2 -translate-x-1/2 -translate-y-1/2 border-l border-line" style={{ left: position(tick) }} />
              ))}
              {row.rating !== null ? (
                <span
                  className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-viz-1 ring-2 ring-surface"
                  style={{ left: position(row.rating) }}
                />
              ) : null}
            </span>
            <span className="tabular text-right text-sm font-semibold text-text">
              {row.rating === null ? "–" : `${row.rating.toFixed(1).replace(".", ",")}★`}
              <span className="ml-1 font-normal text-subtle">({row.count})</span>
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-1 grid grid-cols-[max-content_minmax(0,1fr)_max-content] gap-x-3" aria-hidden="true">
        <span className="invisible text-sm">{rows.reduce((longest, row) => (row.label.length > longest.length ? row.label : longest), "")}</span>
        <span className="relative h-4 text-[0.7rem] text-subtle">
          {[1, 2, 3, 4, 5].map((tick) => (
            <span key={tick} className="absolute -translate-x-1/2" style={{ left: position(tick) }}>
              {tick}★
            </span>
          ))}
        </span>
        <span className="invisible text-sm font-semibold">0,0★ (000)</span>
      </div>
    </div>
  );
}



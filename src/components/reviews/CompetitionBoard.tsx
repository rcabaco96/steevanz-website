"use client";

import { useState } from "react";
import { GoogleG } from "@/components/icons";
import type { CompetitorEntry } from "@/lib/reviews/competitors";

type SortKey = "rating" | "reviews" | "pace";

const tabs: { key: SortKey; label: string }[] = [
  { key: "rating", label: "Avaliação" },
  { key: "reviews", label: "Total de reviews" },
  { key: "pace", label: "Reviews por mês" },
];

/** The table always lists this many places; the customer is added below when outside it. */
const shownPlaces = 30;
const pageSize = 10;

const number = new Intl.NumberFormat("pt-PT", { maximumFractionDigits: 0 });
const decimal = (value: number, digits: number) => value.toFixed(digits).replace(".", ",");

function value(entry: CompetitorEntry, key: SortKey): number | null {
  if (key === "rating") return entry.average ?? entry.rating;
  if (key === "reviews") return entry.reviewsCount;
  return entry.pacePerMonth;
}

function display(entry: CompetitorEntry, key: SortKey): string {
  const current = value(entry, key);
  if (current === null) return "–";
  if (key === "rating") return `${decimal(entry.rating ?? current, 1)}★`;
  if (key === "reviews") return number.format(current);
  return `${number.format(current)}/mês`;
}

/** First, last and the pages around the current one, with gaps in between: 1 … 4 5 6 … 10. */
function pageItems(current: number, total: number): (number | "gap")[] {
  const items: (number | "gap")[] = [];
  for (let page = 0; page < total; page++) {
    if (page === 0 || page === total - 1 || Math.abs(page - current) <= 1) items.push(page);
    else if (items[items.length - 1] !== "gap") items.push("gap");
  }
  return items;
}

function distance(meters: number | null): string {
  if (meters === null || meters === 0) return "";
  return meters < 1000 ? `${number.format(Math.round(meters / 10) * 10)} m` : `${decimal(meters / 1000, 1)} km`;
}

export function CompetitionBoard({ entries }: { entries: CompetitorEntry[] }) {
  const [sort, setSort] = useState<SortKey>("rating");
  const [page, setPage] = useState(0);
  const sorted = [...entries].sort((a, b) => (value(b, sort) ?? -1) - (value(a, sort) ?? -1) || b.reviewsCount - a.reviewsCount);
  const values = sorted.map((entry) => value(entry, sort)).filter((current): current is number => current !== null);
  const max = Math.max(1, ...values);
  // Ratings sit on a shared star scale starting at the lowest whole star, labelled on screen.
  const floor = Math.max(1, Math.floor(Math.min(5, ...values)));
  const share = (current: number) => (sort === "rating" ? (current - floor) / (5 - floor || 1) : current / max);

  const listed = sorted.slice(0, shownPlaces);
  const pages = Math.max(1, Math.ceil(listed.length / pageSize));
  const currentPage = Math.min(page, pages - 1);
  const rows = listed.slice(currentPage * pageSize, currentPage * pageSize + pageSize);
  const selfIndex = sorted.findIndex((entry) => entry.isSelf);
  const pinSelf = selfIndex >= 0 && !rows.some((entry) => entry.isSelf);

  function row(entry: CompetitorEntry, rank: number) {
    const current = value(entry, sort);
    return (
      <li
        key={entry.id}
        className={`grid grid-cols-[2rem_minmax(0,1fr)_max-content] items-center gap-x-3 gap-y-1.5 rounded-2xl px-3 py-2.5 ${
          entry.isSelf ? "bg-accent-soft ring-1 ring-accent/40" : "bg-surface-2/50"
        }`}
      >
        <span className={`text-center text-sm font-semibold ${entry.isSelf ? "text-accent-text" : "text-subtle"}`}>{current === null ? "–" : `${rank}.º`}</span>
        <span className="flex min-w-0 items-center gap-2">
          <a
            href={entry.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Abrir ${entry.name} no Google Maps`}
            title="Abrir no Google Maps"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent text-accent-contrast shadow-sm transition-colors hover:bg-accent-hover"
          >
            <GoogleG size={17} />
          </a>
          <span className="flex min-w-0 flex-col">
            <a
              href={entry.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`relative max-w-full truncate self-start text-sm text-text hover:text-accent-text hover:underline ${entry.isSelf ? "font-semibold" : ""}`}
            >
              {entry.name}
              <span className="sr-only"> (abrir no Google Maps)</span>
            </a>
            <span className="text-xs text-subtle">{entry.isSelf ? "O seu negócio" : distance(entry.distanceM)}</span>
          </span>
        </span>
        <span className="tabular text-right text-sm font-semibold text-text">
          {display(entry, sort)}
          {sort === "rating" && entry.average !== null ? <span className="block text-xs font-normal text-subtle">média {decimal(entry.average, 2)}</span> : null}
        </span>
        <span className="col-span-2 col-start-2 h-1.5 rounded-full bg-line/60" aria-hidden="true">
          {current !== null ? (
            <span
              className={`block h-full rounded-full ${entry.isSelf ? "bg-viz-1" : "bg-line-strong"}`}
              style={{ width: `${Math.max(2, Math.min(1, share(current)) * 100)}%` }}
            />
          ) : null}
        </span>
      </li>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div role="tablist" aria-label="Ordenar concorrentes por" className="flex flex-wrap gap-1.5">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={sort === tab.key}
            onClick={() => {
              setSort(tab.key);
              setPage(0);
            }}
            className={`inline-flex h-10 items-center rounded-full px-4 text-sm font-semibold transition-colors ${
              sort === tab.key ? "bg-surface-inverse text-inverse" : "border border-line bg-surface text-muted hover:text-text"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div role="tabpanel" className="flex flex-col gap-1.5">
        <ol className="flex flex-col gap-1.5">{rows.map((entry) => row(entry, sorted.indexOf(entry) + 1))}</ol>
        {pinSelf ? (
          <>
            <div className="flex items-center gap-3 py-1 text-xs text-subtle" aria-hidden="true">
              <span className="h-px flex-1 border-t border-dashed border-line-strong" />A sua posição
              <span className="h-px flex-1 border-t border-dashed border-line-strong" />
            </div>
            <ol className="flex flex-col">{row(sorted[selfIndex], selfIndex + 1)}</ol>
          </>
        ) : null}
      </div>

      {pages > 1 ? (
        <nav aria-label="Páginas da tabela" className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setPage(currentPage - 1)}
            disabled={currentPage === 0}
            className="inline-flex h-10 items-center rounded-full border border-line bg-surface px-4 text-sm font-semibold text-text disabled:opacity-40"
          >
            ← Anterior
          </button>
          <span className="text-sm text-muted sm:hidden">
            Página {currentPage + 1} de {pages}
          </span>
          <span className="hidden gap-1 sm:flex">
            {pageItems(currentPage, pages).map((item, index) =>
              item === "gap" ? (
                <span key={`gap-${index}`} className="grid h-10 w-6 place-items-center text-subtle" aria-hidden="true">
                  …
                </span>
              ) : (
                <button
                  key={item}
                  type="button"
                  onClick={() => setPage(item)}
                  aria-current={item === currentPage ? "page" : undefined}
                  aria-label={`Página ${item + 1}: ${item * pageSize + 1}.º a ${Math.min(listed.length, (item + 1) * pageSize)}.º`}
                  className={`grid h-10 w-10 place-items-center rounded-full text-sm font-semibold ${
                    item === currentPage ? "bg-surface-inverse text-inverse" : "text-muted hover:bg-surface-2"
                  }`}
                >
                  {item + 1}
                </button>
              ),
            )}
          </span>
          <button
            type="button"
            onClick={() => setPage(currentPage + 1)}
            disabled={currentPage === pages - 1}
            className="inline-flex h-10 items-center rounded-full border border-line bg-surface px-4 text-sm font-semibold text-text disabled:opacity-40"
          >
            Seguinte →
          </button>
        </nav>
      ) : null}

      <p className="text-xs text-subtle">
        {sort === "rating"
          ? `Barras numa escala de ${floor}★ a 5★. Média exata calculada a partir da distribuição de estrelas no Google.`
          : sort === "pace"
            ? "Reviews novas por mês, medidas nas últimas semanas. «–»: ainda a medir."
            : "Total de reviews no Google."}
      </p>
    </div>
  );
}

"use client";

import { useState, type ReactNode } from "react";
import { VerifiedBadge } from "@/components/google/VerifiedBadge";
import { GoogleG } from "@/components/icons";
import {
  competitorLimit,
  entryRankScore,
  fewReviewsBelow,
  rankPriorReviews,
  rankPriorStars,
  replyMinSample,
  type CompetitorEntry,
} from "@/lib/reviews/competitors";
import { formatPercent } from "@/lib/reviews/format";
import { profileItems, profileScore, type ProfileItem } from "@/lib/reviews/maps-reader";
import { CompetitionCountdown } from "./CompetitionCountdown";
import { InfoTip } from "./InfoTip";

// "Reviews por mês" left the table on 2026-10-04 and "Fotos" on 2026-10-09 (owner's decisions).
// «Ranking» (rating and number of reviews together) opens first since 2026-10-10 (owner's decision).
type SortKey = "rank" | "rating" | "reviews" | "replies" | "profile";

const tabs: { key: SortKey; label: string }[] = [
  { key: "rank", label: "Ranking" },
  { key: "rating", label: "Avaliação Google" },
  { key: "reviews", label: "Total de reviews" },
  { key: "replies", label: "Respondidas" },
  { key: "profile", label: "Perfil" },
];

const profileLabels: Record<ProfileItem, string> = {
  claimed: "perfil reivindicado",
  website: "site",
  phone: "telefone",
  hours: "horário",
  description: "descrição",
};

/** The table always lists this many places; the customer is added below when outside it. */
const shownPlaces = competitorLimit + 1;
const pageSize = 10;

const number = new Intl.NumberFormat("pt-PT", { maximumFractionDigits: 0 });
const decimal = (value: number, digits: number) =>
  value.toFixed(digits).replace(".", ",");

function value(entry: CompetitorEntry, key: SortKey): number | null {
  if (key === "rank") return entryRankScore(entry);
  if (key === "rating") return entry.average ?? entry.rating;
  if (key === "reviews") return entry.reviewsCount;
  if (key === "profile") return entry.profile ? profileScore(entry.profile) : null;
  return entry.replyRate;
}

/** No review on Google yet: last on the rating ranking, shown as such rather than "–". */
function withoutReviews(entry: CompetitorEntry): boolean {
  return entry.reviewsCount === 0 && (entry.average ?? entry.rating) === null;
}

/** Star-based tabs: the ranking and Google's rating. */
const starred = (key: SortKey) => key === "rank" || key === "rating";

function display(entry: CompetitorEntry, key: SortKey): string {
  const current = value(entry, key);
  if (current === null && starred(key) && withoutReviews(entry)) return "Sem reviews";
  if (current === null) return "–";
  // The ranking never shows its score: Google's rating, as the customer sees it on Maps.
  if (key === "rank") return `${decimal(entry.rating ?? entry.average ?? current, 1)}★`;
  if (key === "rating") return `${decimal(entry.rating ?? current, 1)}★`;
  if (key === "reviews") return number.format(current);
  return formatPercent(current);
}

/** Under the ranking: how many reviews the rating rests on, flagged when few. */
function rankNote(entry: CompetitorEntry): string | null {
  if (entry.reviewsCount <= 0) return null;
  const reviews = `${number.format(entry.reviewsCount)} ${entry.reviewsCount === 1 ? "review" : "reviews"}`;
  return entry.reviewsCount < fewReviewsBelow ? `${reviews} · poucas reviews` : reviews;
}

/** Under the profile score: what is missing ("falta site, horário") or that it is complete. */
function profileNote(entry: CompetitorEntry): string | null {
  if (!entry.profile) return null;
  const missing = profileItems.filter((item) => !entry.profile![item]).map((item) => profileLabels[item]);
  return missing.length ? `falta ${missing.join(", ")}` : "completo";
}

/** Under the reply rate: how many reviews it rests on, or why it is not shown. */
function replyNote(entry: CompetitorEntry): string | null {
  const sample = entry.replySample;
  if (sample === null) return null;
  if (sample === 0) return "sem reviews";
  const reviews = `${number.format(sample)} ${sample === 1 ? "review" : "reviews"}`;
  return sample < replyMinSample ? `só ${reviews}` : reviews;
}

/** First, last and the pages around the current one, with gaps in between: 1 … 4 5 6 … 10. */
function pageItems(current: number, total: number): (number | "gap")[] {
  const items: (number | "gap")[] = [];
  for (let page = 0; page < total; page++) {
    if (page === 0 || page === total - 1 || Math.abs(page - current) <= 1)
      items.push(page);
    else if (items[items.length - 1] !== "gap") items.push("gap");
  }
  return items;
}

function distance(meters: number | null): string {
  if (meters === null || meters === 0) return "";
  return meters < 1000
    ? `${number.format(Math.round(meters / 10) * 10)} m`
    : `${decimal(meters / 1000, 1)} km`;
}

export function CompetitionBoard({
  entries,
  replyInfo,
}: {
  entries: CompetitorEntry[];
  replyInfo: ReactNode;
}) {
  const [sort, setSort] = useState<SortKey>("rank");
  const [page, setPage] = useState(0);
  // The reply ranking appears once some competitor has been measured, even when every sample is
  // too small to show a rate ("–" with "só N reviews" says why).
  const shownTabs = entries.some(
    (entry) => !entry.isSelf && entry.replySample !== null,
  )
    ? tabs
    : tabs.filter((tab) => tab.key !== "replies");
  // The profile appears once the reader has read it for some place.
  const readTabs = shownTabs.filter(
    (tab) => tab.key !== "profile" || entries.some((entry) => entry.profile),
  );
  const sorted = [...entries].sort(
    (a, b) =>
      (value(b, sort) ?? -1) - (value(a, sort) ?? -1) ||
      (sort === "replies" ? (b.replySample ?? 0) - (a.replySample ?? 0) : 0) ||
      b.reviewsCount - a.reviewsCount,
  );
  const values = sorted
    .map((entry) => value(entry, sort))
    .filter((current): current is number => current !== null);
  const max = Math.max(1, ...values);
  // Ratings sit on a shared star scale starting at the lowest whole star, labelled on screen.
  const floor = Math.max(1, Math.floor(Math.min(5, ...values)));
  const share = (current: number) =>
    starred(sort)
      ? (current - floor) / (5 - floor || 1)
      : sort === "replies" || sort === "profile"
        ? current
        : current / max;

  const listed = sorted.slice(0, shownPlaces);
  const pages = Math.max(1, Math.ceil(listed.length / pageSize));
  const currentPage = Math.min(page, pages - 1);
  const rows = listed.slice(
    currentPage * pageSize,
    currentPage * pageSize + pageSize,
  );
  const selfIndex = sorted.findIndex((entry) => entry.isSelf);
  const pinSelf = selfIndex >= 0 && !rows.some((entry) => entry.isSelf);

  function row(entry: CompetitorEntry, rank: number) {
    const current = value(entry, sort);
    const note = sort === "rank" ? rankNote(entry) : sort === "replies" ? replyNote(entry) : sort === "profile" ? profileNote(entry) : null;
    return (
      <li
        key={entry.id}
        className={`grid grid-cols-[2rem_minmax(0,1fr)_max-content] items-center gap-x-3 gap-y-1.5 rounded-2xl px-3 py-2.5 ${
          entry.isSelf
            ? "bg-accent-soft ring-1 ring-accent/40"
            : "bg-surface-2/50"
        }`}
      >
        <span
          className={`text-center text-sm font-semibold ${entry.isSelf ? "text-accent-text" : "text-subtle"}`}
        >
          {current === null && !(starred(sort) && withoutReviews(entry)) ? "–" : `${rank}.º`}
        </span>
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
            <span className="flex min-w-0 items-center gap-1.5">
              <a
                href={entry.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`relative min-w-0 truncate text-sm text-text hover:text-accent-text hover:underline ${entry.isSelf ? "font-semibold" : ""}`}
              >
                {entry.name}
                <span className="sr-only"> (abrir no Google Maps)</span>
              </a>
              {/* Business rule 14: the «Perfil verificado» seal goes wherever the business appears. */}
              {entry.verified ? <VerifiedBadge size="sm" name={entry.name} /> : null}
            </span>
            <span className="text-xs text-subtle">
              {entry.isSelf ? "O seu negócio" : distance(entry.distanceM)}
            </span>
          </span>
        </span>
        <span className="tabular text-right text-sm font-semibold text-text">
          {display(entry, sort)}
          {sort === "rating" && entry.average !== null ? (
            <span className="block text-xs font-normal text-subtle">
              média {decimal(entry.average, 2)}
            </span>
          ) : null}
          {note ? (
            <span className="block text-xs font-normal text-subtle">
              {note}
            </span>
          ) : null}
        </span>
        <span
          className="col-span-2 col-start-2 h-1.5 rounded-full bg-line/60"
          aria-hidden="true"
        >
          {current !== null ? (
            <span
              className={`block h-full rounded-full ${entry.isSelf ? "bg-viz-1" : "bg-line-strong"}`}
              style={{
                width: `${Math.max(2, Math.min(1, share(current)) * 100)}%`,
              }}
            />
          ) : null}
        </span>
      </li>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div
          role="tablist"
          aria-label="Ordenar concorrentes por"
          className="flex flex-wrap gap-1.5"
        >
          {readTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={sort === tab.key}
              onClick={() => {
                setSort(tab.key);
                setPage(0);
              }}
              className={`inline-flex h-10 items-center rounded-full px-3.5 text-sm font-semibold transition-colors sm:px-4 ${
                sort === tab.key
                  ? "bg-surface-inverse text-inverse"
                  : "border border-line bg-surface text-muted hover:text-text"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="self-end sm:shrink-0 sm:self-start">
          <CompetitionCountdown />
        </div>
      </div>

      {sort === "rank" ? (
        <p className="flex items-start gap-1.5 text-xs text-subtle">
          <span>Ordenado pela nota do Google e pelo número de reviews: quem tem poucas reviews desce, porque a nota ainda pode mudar muito.</span>
          <InfoTip label="Como é feito o ranking">
            {`Cada negócio conta como se tivesse mais ${rankPriorReviews} reviews de ${rankPriorStars}★ (o meio da escala). Com muitas reviews isso quase não mexe na nota; com poucas, puxa-a para o meio. Assim um 5,0★ com 3 reviews fica abaixo de um 4,8★ com 400, e um 1★ com uma só review continua em baixo. Este cálculo só decide a ordem: a nota mostrada é sempre a do Google. «Poucas reviews»: menos de ${fewReviewsBelow}.`}
          </InfoTip>
        </p>
      ) : null}

      <div role="tabpanel" className="flex flex-col gap-1.5">
        <ol className="flex flex-col gap-1.5">
          {rows.map((entry) => row(entry, sorted.indexOf(entry) + 1))}
        </ol>
        {pinSelf ? (
          <>
            <div
              className="flex items-center gap-3 py-1 text-xs text-subtle"
              aria-hidden="true"
            >
              <span className="h-px flex-1 border-t border-dashed border-line-strong" />
              A sua posição
              <span className="h-px flex-1 border-t border-dashed border-line-strong" />
            </div>
            <ol className="flex flex-col">
              {row(sorted[selfIndex], selfIndex + 1)}
            </ol>
          </>
        ) : null}
      </div>

      {pages > 1 ? (
        <nav
          aria-label="Páginas da tabela"
          className="flex items-center justify-between gap-2"
        >
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
                <span
                  key={`gap-${index}`}
                  className="grid h-10 w-6 place-items-center text-subtle"
                  aria-hidden="true"
                >
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
                    item === currentPage
                      ? "bg-surface-inverse text-inverse"
                      : "text-muted hover:bg-surface-2"
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
        {sort === "rating" ? (
          `Barras numa escala de ${floor}★ a 5★. Média exata calculada a partir da distribuição de estrelas no Google.`
        ) : sort === "replies" ? (
          <>
            Barras de 0 a 100%. Reviews recentes com resposta do dono no Google
            (estimativa). «–»: ainda sem medição ou menos de {replyMinSample}{" "}
            reviews. <InfoTip label="Respondidas">{replyInfo}</InfoTip>
          </>
        ) : sort === "profile" ? (
          "Barras de 0 a 100%. Campos preenchidos no perfil Google: perfil reivindicado pelo dono, site, telefone, horário e descrição. «–»: ainda não lido."
        ) : (
          "Total de reviews no Google."
        )}
      </p>
    </div>
  );
}

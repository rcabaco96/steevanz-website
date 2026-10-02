import Link from "next/link";
import type { ReactNode } from "react";
import { AlertIcon, ArrowUpRight, Check, CloseIcon, LightbulbIcon, ProductGlyph, SparkleIcon, StarFilled, WhatsAppIcon } from "@/components/icons";
import { buttonClasses } from "@/components/ui/Button";
import { priceLabel } from "@/components/ui/Price";
import { getProduct } from "@/content/products";
import type { ProductId } from "@/content/types";
import { aiReviewsPitch, recommendations, type AiReviewsPitch, type Recommendation } from "@/lib/reviews/recommendations";
import { href as routeHref } from "@/lib/routes";
import { whatsappUrl } from "@/lib/site";
import {
  attributionWindowMinutes,
  bucketKey,
  filterReviews,
  minSample,
  type Comparison,
  type DashboardAnalytics,
  type PeriodId,
  type RatingGoal,
  type ReviewFilters,
  type ReviewStarFilter,
} from "@/lib/reviews/analytics";
import { formatBucket, formatDate, formatDateTime, formatHours, formatInt, formatPercent, formatRating, formatSignedPercent, weekdayLong, weekdayShort } from "@/lib/reviews/format";
import { competitorRadiusKm, type Competition } from "@/lib/reviews/competitors";
import type { ThemeId } from "@/lib/reviews/text";
import type { DashboardSource } from "@/lib/reviews/types";
import { BarList, ColumnChart, DataTable, Heatmap, RatingDots, RatingLineChart, SplitBar, type ColumnDatum } from "./charts";
import { CompetitionBoard } from "./CompetitionBoard";
import { DashboardSync } from "./DashboardSync";
import { ReviewText } from "./ReviewText";
import { Stars } from "./Stars";
import { ThemeReviews } from "./ThemeReviews";

export const periodLabels: Record<PeriodId, string> = { "30d": "30 dias", "90d": "90 dias", "12m": "12 meses", all: "Tudo" };
const periodOrder: PeriodId[] = ["all", "12m", "90d", "30d"];
const radiusLabel = `${String(competitorRadiusKm).replace(".", ",")} km`;

/** Hidden for now at the owner's request; the charts and data stay ready for later. */
const showEvolutionSection = false;

export const themeLabels: Record<ThemeId, string> = {
  service: "Atendimento",
  quality: "Comida e qualidade",
  price: "Preço",
  waiting: "Tempo de espera",
  cleanliness: "Limpeza",
  ambience: "Ambiente",
  location: "Localização",
};

const starFilterLabels: Record<ReviewStarFilter, string> = { all: "Todas", positive: "Positivas", neutral: "Neutras", negative: "Negativas" };

export interface DashboardQuery {
  period: PeriodId;
  filters: ReviewFilters;
  limit: number;
}

export const reviewsPageSize = 20;

function Section({ id, title, lead, children }: { id: string; title: string; lead?: ReactNode; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 id={`${id}-title`} className="display text-2xl sm:text-3xl">
          {title}
        </h2>
        {lead ? <p className="max-w-3xl text-sm text-muted sm:text-base">{lead}</p> : null}
      </div>
      {children}
    </section>
  );
}

function Card({ title, subtitle, children, className = "" }: { title?: string; subtitle?: string; children: ReactNode; className?: string }) {
  return (
    <div className={`card min-w-0 p-4 sm:p-6 ${className}`}>
      {title ? (
        <div className="mb-5 flex flex-col gap-0.5">
          <h3 className="font-semibold text-text">{title}</h3>
          {subtitle ? <p className="text-sm text-subtle">{subtitle}</p> : null}
        </div>
      ) : null}
      {children}
    </div>
  );
}


function Delta({ comparison, format, unit = "", allTime = false }: { comparison: Comparison; format: "count" | "rating" | "share"; unit?: string; allTime?: boolean }) {
  const { current, previous } = comparison;
  if (allTime) return <span className="text-xs text-subtle">todo o histórico</span>;
  if (current === null || previous === null) return <span className="text-xs text-subtle">poucos dados para comparar</span>;
  let diff: number;
  let label: string;
  if (format === "count") {
    if (previous === 0) return <span className="text-xs text-subtle">poucos dados para comparar</span>;
    diff = (current / previous - 1) * 100;
    label = formatSignedPercent(diff);
  } else if (format === "rating") {
    diff = current - previous;
    label = `${diff > 0 ? "+" : ""}${diff.toFixed(1).replace(".", ",")}${unit}`;
  } else {
    diff = (current - previous) * 100;
    label = `${diff > 0 ? "+" : ""}${Math.round(diff)} p.p.`;
  }
  const flat = Math.abs(diff) < (format === "rating" ? 0.05 : 1);
  const tone = flat ? "text-subtle" : diff > 0 ? "text-success" : "text-danger";
  const arrow = flat ? "→" : diff > 0 ? "↑" : "↓";
  return (
    <span className={`text-xs font-semibold ${tone}`}>
      <span aria-hidden="true">{arrow} </span>
      {label} <span className="font-normal text-subtle">vs período anterior</span>
    </span>
  );
}

function StatTile({ label, value, children }: { label: string; value: string; children?: ReactNode }) {
  return (
    <div className="card flex min-w-0 flex-col gap-1.5 p-4 sm:p-5">
      <p className="text-sm text-muted">{label}</p>
      <p className="text-3xl font-semibold tracking-[-0.02em] text-text">{value}</p>
      {children}
    </div>
  );
}

function formatDuration(months: number): string {
  if (months < 1) {
    const weeks = Math.max(1, Math.ceil(months * 4.35));
    return `${weeks} ${weeks === 1 ? "semana" : "semanas"}`;
  }
  const rounded = Math.ceil(months);
  return `${rounded} ${rounded === 1 ? "mês" : "meses"}`;
}

const plural = (count: number, one: string, many: string) => `${formatInt(count)} ${count === 1 ? one : many}`;

function ProgressBar({
  value,
  label,
  tone = "accent",
  track = "bg-surface",
  fill,
}: {
  value: number;
  label: string;
  tone?: "accent" | "success";
  track?: string;
  fill?: string;
}) {
  const percent = Math.round(Math.min(1, Math.max(0, value)) * 100);
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      className={`h-3 overflow-hidden rounded-full ${track}`}
    >
      <div
        className={`h-full rounded-full transition-[width] duration-700 ease-(--ease-out-expo) ${fill ?? (tone === "success" ? "bg-success" : "bg-viz-1")}`}
        style={{ width: `${Math.max(percent, 3)}%` }}
      />
    </div>
  );
}

function GoalProgress({ goal }: { goal: RatingGoal }) {
  const percent = Math.round((goal.progress ?? 0) * 100);
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-3 text-sm font-semibold text-text">
        <span>{formatRating(goal.current)}★</span>
        <span className="text-xs font-normal text-muted">{percent}% do caminho</span>
        <span>{formatRating(goal.next)}★</span>
      </div>
      <ProgressBar value={goal.progress ?? 0} label={`Progresso de ${formatRating(goal.current)} para ${formatRating(goal.next)} estrelas`} />
      <p className="text-xs text-muted">
        A sua média é {goal.average.toFixed(3).replace(".", ",")}★ (o Google arredonda para {formatRating(goal.current)}★). Aos{" "}
        {(goal.next! - 0.05).toFixed(2).replace(".", ",")}★ passa a mostrar {formatRating(goal.next)}★.
      </p>
    </div>
  );
}

function RatingGoalCard({ goal }: { goal: RatingGoal }) {
  return (
    <div className="card col-span-2 flex flex-col gap-4 p-5 sm:p-6 lg:row-span-2">
      <div className="flex flex-col gap-1">
        <p className="text-sm text-muted">Avaliação no Google</p>
        <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-6xl font-semibold tracking-[-0.03em] text-text">{formatRating(goal.current)}</span>
          <Stars rating={goal.current} size={22} />
        </p>
        <p className="text-sm text-subtle">{plural(goal.totalReviews, "review", "reviews")} no total</p>
      </div>
      {goal.next !== null && goal.fiveStarsNeeded !== null ? (
        <div className="flex flex-col gap-3 rounded-2xl bg-accent-soft/60 p-4">
          {goal.progress !== null ? <GoalProgress goal={goal} /> : null}
          <p className="text-[0.95rem] text-text">
            Faltam <strong>{plural(goal.fiveStarsNeeded, "review de 5★", "reviews de 5★")}</strong> para subir para{" "}
            <strong>{formatRating(goal.next)}★</strong>.
          </p>
          <p className="text-sm text-muted">
            {goal.monthsToNext !== null
              ? `Ao ritmo dos últimos 3 meses (cerca de ${formatInt(Math.max(1, Math.round(goal.fiveStarsPerMonth)))} de 5★ por mês), chega lá em ${formatDuration(goal.monthsToNext)}.`
              : "Nos últimos 3 meses não entrou nenhuma review de 5★. As placas ajudam a pedir mais."}
          </p>
        </div>
      ) : (
        <p className="rounded-2xl bg-success-soft p-4 text-[0.95rem] text-success">Está no máximo. Agora é manter!</p>
      )}
      {goal.previous !== null && goal.oneStarsToDrop !== null ? (
        <p className="flex items-start gap-2 text-sm text-muted">
          <AlertIcon size={16} className="mt-0.5 shrink-0 text-danger" />
          <span>
            {goal.oneStarsToDrop === 1 ? "Basta 1 review de 1★" : `Bastam ${formatInt(goal.oneStarsToDrop)} reviews de 1★`} para descer para{" "}
            {formatRating(goal.previous)}★. Responder às negativas ajuda a conter o estrago.
          </span>
        </p>
      ) : null}
      {goal.exact ? null : <p className="text-xs text-subtle">Estimativa a partir dos totais do Google.</p>}
    </div>
  );
}

function productLink(productId: ProductId): string {
  return routeHref("pt", { key: "product", productId });
}

function AiReviewsPromo({ pitch, businessName }: { pitch: AiReviewsPitch; businessName: string }) {
  const product = getProduct("ai-reviews");
  const title =
    pitch.negativeUnanswered > 0
      ? `${plural(pitch.negativeUnanswered, "review negativa", "reviews negativas")} sem resposta`
      : pitch.unanswered > 0
        ? `${plural(pitch.unanswered, "review à espera", "reviews à espera")} de resposta`
        : `Responde às reviews em ${formatHours(pitch.medianReplyHours)}`;
  const whatsappMessage = `Olá! Vi o painel de reviews do ${businessName} e quero saber mais sobre a Gestão de reviews com IA.`;
  return (
    <aside aria-labelledby="ai-reviews-promo" className="relative isolate overflow-hidden rounded-[var(--radius-card)] bg-surface-inverse p-5 text-inverse sm:p-7">
      <div aria-hidden="true" className="absolute -top-24 -right-24 -z-10 h-64 w-64 rounded-full bg-accent/40 blur-3xl" />
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:gap-10">
        <div className="flex flex-1 flex-col gap-3">
          <p className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.14em] text-gold uppercase">
            <SparkleIcon size={15} /> Gestão de reviews com IA
          </p>
          <h3 id="ai-reviews-promo" className="display text-2xl leading-tight sm:text-3xl">
            {title}
          </h3>
          <p className="leading-relaxed opacity-85">
            Quem pesquisa o seu negócio lê as respostas. A IA prepara uma resposta personalizada para cada review, no tom da sua marca, e só tem de a aprovar
            com um toque por WhatsApp ou email. Nada é publicado sem o seu sim, e as negativas chegam-lhe de imediato.
          </p>
        </div>
        <div className="flex flex-col gap-4 rounded-2xl bg-inverse/10 p-4 lg:w-80">
          <div className="flex flex-col gap-1.5">
            <p className="flex justify-between text-sm">
              <span className="opacity-80">Hoje</span>
              <strong>{formatPercent(pitch.replyRate)} respondidas</strong>
            </p>
            <ProgressBar value={pitch.replyRate ?? 0} label="Reviews respondidas hoje" track="bg-inverse/15" fill="bg-inverse/60" />
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="flex justify-between text-sm">
              <span className="opacity-80">Com a IA</span>
              <strong>100% respondidas</strong>
            </p>
            <ProgressBar value={1} label="Reviews respondidas com a gestão de reviews com IA" track="bg-inverse/15" fill="bg-gold" />
          </div>
          <p className="text-xs opacity-75">
            {priceLabel(product, "pt")} + IVA · preço indicativo
          </p>
          <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
            <a href={productLink("ai-reviews")} target="_blank" rel="noopener" className={buttonClasses("primary", "md", "w-full")}>
              Quero responder a todas
            </a>
            <a href={whatsappUrl(whatsappMessage)} target="_blank" rel="noopener noreferrer" className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-inverse/25 px-5 text-[0.95rem] font-semibold text-inverse transition-colors hover:bg-inverse/10">
              <WhatsAppIcon size={17} /> Falar connosco
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
}

function RecommendationCards({ items }: { items: Recommendation[] }) {
  return (
    <ul className="grid gap-3 sm:gap-4 lg:grid-cols-3">
      {items.map((item) => {
        const product = getProduct(item.productId);
        return (
          <li key={item.productId} className="card flex flex-col gap-3 p-5">
            <p className="inline-flex items-center gap-1.5 self-start rounded-full bg-gold-soft px-2.5 py-1 text-xs font-semibold text-gold-text">
              <LightbulbIcon size={13} /> {item.signal}
            </p>
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent-text">
                <ProductGlyph icon={product.icon} size={19} />
              </span>
              <h3 className="pt-1 font-semibold text-text">{item.title}</h3>
            </div>
            <p className="text-sm leading-relaxed text-muted">{item.body}</p>
            <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-3">
              <span className="text-sm font-semibold text-text">{priceLabel(product, "pt")}</span>
              <a href={productLink(item.productId)} target="_blank" rel="noopener" className="inline-flex min-h-10 items-center gap-1 text-sm font-semibold text-accent-text hover:underline">
                Saber mais <ArrowUpRight size={15} />
              </a>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function competitionNotes(competition: Competition): { tone: "good" | "info"; text: ReactNode }[] {
  const self = competition.entries.find((entry) => entry.isSelf);
  const notes: { tone: "good" | "info"; text: ReactNode }[] = [];
  if (competition.ratingRank === 1) notes.push({ tone: "good", text: "É o negócio mais bem avaliado da zona. Agora é manter!" });
  else if (competition.ratingGap) {
    notes.push({
      tone: "info",
      text: (
        <>
          {competition.ratingGap.fiveStarsToPass !== null ? (
            <>
              Faltam <strong>{plural(competition.ratingGap.fiveStarsToPass, "review de 5★", "reviews de 5★")}</strong> para passar o{" "}
              <strong>{competition.ratingGap.name}</strong> na avaliação.
            </>
          ) : (
            <>
              O <strong>{competition.ratingGap.name}</strong> tem 5,0★: só reviews de 5★ o deixam ao seu alcance.
            </>
          )}
        </>
      ),
    });
  }
  if (competition.reviewsGap) {
    notes.push({
      tone: "info",
      text: (
        <>
          Faltam <strong>{plural(competition.reviewsGap.reviewsDiff, "review", "reviews")}</strong> para passar o <strong>{competition.reviewsGap.name}</strong> em
          número de reviews.
        </>
      ),
    });
  }
  if (competition.paceLeader && self?.pacePerMonth !== null && self?.pacePerMonth !== undefined) {
    const fasterPct = self.pacePerMonth > 0 ? Math.round((competition.paceLeader.pacePerMonth / self.pacePerMonth - 1) * 100) : null;
    notes.push({
      tone: "info",
      text: (
        <>
          O <strong>{competition.paceLeader.name}</strong> recebe cerca de <strong>{formatInt(competition.paceLeader.pacePerMonth)} reviews por mês</strong>
          {fasterPct === null ? (
            `, e o seu negócio não recebeu nenhuma nos últimos 3 meses`
          ) : fasterPct >= 10 ? (
            <>
              , um ritmo <strong>{fasterPct}% mais rápido</strong> que o seu ({formatInt(self.pacePerMonth)} por mês)
            </>
          ) : null}
          .
        </>
      ),
    });
  } else if (competition.paceRank === 1) {
    notes.push({ tone: "good", text: "É o negócio da zona que recebe mais reviews por mês." });
  }
  return notes;
}

/** Top-of-page summary: where the customer stands nearby and what it takes to climb, leading to the table. */
function CompetitionSummary({ competition }: { competition: Competition }) {
  const notes = competitionNotes(competition);
  const ranks = [
    { label: "Avaliação", rank: competition.ratingRank },
    { label: "Total de reviews", rank: competition.reviewsRank },
    { label: "Reviews por mês", rank: competition.paceRank },
  ];
  return (
    <aside aria-labelledby="competition-summary-title" className="card flex flex-col gap-4 p-4 sm:p-5 lg:w-[27rem] lg:shrink-0">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="competition-summary-title" className="font-semibold text-text">
          Na sua zona
        </h2>
        <span className="text-xs text-subtle">
          {plural(competition.total - 1, "concorrente", "concorrentes")} até {radiusLabel}
        </span>
      </div>
      <dl className="grid grid-cols-3 gap-2">
        {ranks.map((item) => (
          <div key={item.label} className="flex min-w-0 flex-col gap-0.5 rounded-xl bg-surface-2/70 px-2.5 py-2">
            <dt className="text-[0.7rem] leading-tight text-muted">{item.label}</dt>
            <dd className="flex flex-wrap items-baseline gap-x-1">
              <span className={`text-2xl font-semibold tracking-[-0.02em] ${item.rank === 1 ? "text-success" : "text-text"}`}>
                {item.rank === null ? "–" : `${item.rank}.º`}
              </span>
              <span className="text-[0.7rem] whitespace-nowrap text-subtle">de {competition.total}</span>
            </dd>
          </div>
        ))}
      </dl>
      {notes.length ? (
        <ul className="flex flex-col gap-2">
          {notes.map((note, index) => (
            <li key={index} className={`flex items-start gap-2 text-sm leading-snug ${note.tone === "good" ? "text-success" : "text-muted"}`}>
              {note.tone === "good" ? <Check size={16} className="mt-0.5 shrink-0" /> : <ArrowUpRight size={16} className="mt-0.5 shrink-0 text-accent-text" />}
              <span>{note.text}</span>
            </li>
          ))}
        </ul>
      ) : null}
      <a href="#competition" className={buttonClasses("primary", "md", "w-full")}>
        Ver a tabela da concorrência
        <span aria-hidden="true">↓</span>
      </a>
    </aside>
  );
}

function CompetitionSection({ competition, category }: { competition: Competition; category: string | null }) {
  return (
    <Section
      id="competition"
      title="Como está face à concorrência"
      lead={`${plural(competition.total - 1, "negócio", "negócios")} ${category ? `de «${category}» ` : ""}num raio de ${radiusLabel}. Dados públicos do Google, atualizados todas as semanas${competition.lastSnapshotOn ? ` (última atualização a ${formatDate(`${competition.lastSnapshotOn}T12:00:00Z`)})` : ""}.`}
    >
      <Card>
        <CompetitionBoard entries={competition.entries} />
      </Card>
    </Section>
  );
}

function insightsFor(source: DashboardSource, analytics: DashboardAnalytics): string[] {
  const items: string[] = [];
  const competition = source.competition;
  if (competition?.ratingRank) {
    items.push(
      competition.ratingRank === 1
        ? `É o mais bem avaliado entre ${competition.total} negócios da mesma categoria num raio de ${radiusLabel}.`
        : `Está em ${competition.ratingRank}.º de ${competition.total} na avaliação entre os negócios da mesma categoria num raio de ${radiusLabel}. Veja abaixo quanto falta para subir.`,
    );
  }
  const { beforeAfter, plates, weekdays, themes, kpis, tapHeatmap } = analytics;
  if (beforeAfter && beforeAfter.upliftPct !== null && Math.abs(beforeAfter.upliftPct) >= 10) {
    items.push(
      `Desde que as placas foram instaladas, recebe em média ${formatRating(beforeAfter.after.reviewsPerMonth)} reviews por mês, ${formatSignedPercent(beforeAfter.upliftPct)} face aos meses anteriores (${formatRating(beforeAfter.before.reviewsPerMonth)}/mês).`,
    );
  }
  const reliablePlates = plates.filter((plate) => plate.enoughData && plate.conversion !== null);
  const bestPlate = [...reliablePlates].sort((a, b) => b.conversion! - a.conversion!)[0];
  const worstPlate = [...reliablePlates].sort((a, b) => a.conversion! - b.conversion!)[0];
  if (bestPlate && worstPlate && bestPlate.code !== worstPlate.code && bestPlate.conversion! > worstPlate.conversion! * 1.4) {
    items.push(
      `A placa «${bestPlate.label}» converte ${formatPercent(bestPlate.conversion)} dos toques em reviews, contra ${formatPercent(worstPlate.conversion)} em «${worstPlate.label}». Vale a pena pedir a review junto da placa com melhor resultado.`,
    );
  }
  const bestDay = weekdays.filter((day) => day.enoughTaps && day.conversion !== null).sort((a, b) => b.conversion! - a.conversion!)[0];
  if (bestDay && kpis.conversion.current && bestDay.conversion! > kpis.conversion.current * 1.2) {
    items.push(`À ${weekdayLong[bestDay.weekday]}, ${formatPercent(bestDay.conversion)} dos toques resultam numa review, o melhor dia da semana.`);
  }
  const hourTotals = Array.from({ length: 24 }, (_, hour) => tapHeatmap.reduce((sum, row) => sum + row[hour], 0));
  const totalTaps = hourTotals.reduce((sum, value) => sum + value, 0);
  if (totalTaps >= 30) {
    let bestStart = 0;
    let bestSum = -1;
    for (let hour = 0; hour < 22; hour++) {
      const sum = hourTotals[hour] + hourTotals[hour + 1] + hourTotals[hour + 2];
      if (sum > bestSum) {
        bestSum = sum;
        bestStart = hour;
      }
    }
    items.push(`Entre as ${bestStart}h e as ${bestStart + 3}h acontecem ${formatPercent(bestSum / totalTaps)} dos toques. É a melhor altura para a equipa lembrar os clientes.`);
  }
  const weakest = themes.find((theme) => theme.verdict === "improve");
  if (weakest) {
    items.push(
      `«${themeLabels[weakest.id]}» é o tema com pior avaliação: ${formatRating(weakest.avgRating)}★ em ${weakest.mentions} reviews que o mencionam. Veja abaixo o que os clientes dizem.`,
    );
  }
  const overall = kpis.avgRating.current;
  const worstDay = weekdays.filter((day) => day.reviews >= 10 && day.avgRating !== null).sort((a, b) => a.avgRating! - b.avgRating!)[0];
  if (worstDay && overall !== null && worstDay.avgRating! <= overall - 0.5) {
    items.push(
      `À ${weekdayLong[worstDay.weekday]} a avaliação média cai para ${formatRating(worstDay.avgRating)}★ (média geral ${formatRating(overall)}★). Vale a pena perceber o que muda nesse dia: equipa, movimento, fornecedores.`,
    );
  }
  if (kpis.replyRate.current !== null && kpis.replyRate.current < 0.7 && analytics.unansweredCount > 0) {
    items.push(`Há ${plural(analytics.unansweredCount, "review", "reviews")} sem resposta neste período. Responder a todas, sobretudo às negativas, mostra a quem pesquisa que o negócio está atento.`);
  }
  if (!source.taps.length) items.push("Ainda não há toques registados. Assim que as placas apontarem para o link Steevanz, aparecem aqui os toques e a conversão.");
  return items.slice(0, 5);
}

function beforeAfterGapText(gap: DashboardAnalytics["beforeAfterGap"]): string {
  if (gap === "no-install-date") return "Indique à Steevanz a data de instalação das placas para comparar o antes e o depois.";
  if (gap === "too-early") return "As placas foram instaladas há menos de um mês. A comparação aparece quando houver pelo menos um mês de dados.";
  return "Não há reviews suficientes antes das placas para fazer uma comparação justa.";
}

export function ReviewsDashboard({ source, analytics, basePath, query }: { source: DashboardSource; analytics: DashboardAnalytics; basePath: string; query: DashboardQuery }) {
  const { business } = source;
  const { kpis, series, period } = analytics;
  const insights = insightsFor(source, analytics);
  const granularityLabel = period.granularity === "month" ? "mês" : period.granularity === "week" ? "semana" : "dia";
  const markerKey = business.platesInstalledOn ? bucketKey(`${business.platesInstalledOn}T12:00:00Z`, period.granularity) : null;
  const marker = markerKey && series.some((bucket) => bucket.key === markerKey) ? { key: markerKey, label: "Placas" } : undefined;
  const lastKey = series[series.length - 1]?.key;
  const longLabel = (key: string) =>
    `${period.granularity === "week" ? `Semana de ${formatBucket(key)}` : formatBucket(key, true)}${key === lastKey ? " (em curso)" : ""}`;
  const reviewColumns: ColumnDatum[] = series.map((bucket) => ({ key: bucket.key, label: formatBucket(bucket.key), longLabel: longLabel(bucket.key), value: bucket.reviews }));
  const tapColumns: ColumnDatum[] = series.map((bucket) => ({ key: bucket.key, label: formatBucket(bucket.key), longLabel: longLabel(bucket.key), value: bucket.taps }));
  const hasTaps = source.taps.length > 0;
  const activeHours = Array.from({ length: 24 }, (_, hour) => hour).filter((hour) => analytics.tapHeatmap.some((row) => row[hour] > 0));
  const heatHours = activeHours.length
    ? Array.from({ length: activeHours[activeHours.length - 1] - activeHours[0] + 1 }, (_, index) => activeHours[0] + index)
    : [];
  const weekdayOrder = [1, 2, 3, 4, 5, 6, 0];

  const href = (changes: Partial<{ period: PeriodId; stars: ReviewStarFilter; unanswered: boolean; theme: ThemeId | null; limit: number }>, hash = "") => {
    const next = { period: query.period, ...query.filters, limit: query.limit, ...changes };
    const params = new URLSearchParams();
    if (next.period !== "all") params.set("periodo", next.period);
    if (next.stars !== "all") params.set("estrelas", next.stars);
    if (next.unanswered) params.set("resposta", "sem");
    if (next.theme) params.set("tema", next.theme);
    if (next.limit > reviewsPageSize) params.set("n", String(next.limit));
    const search = params.toString();
    return `${basePath}${search ? `?${search}` : ""}${hash}`;
  };

  const periodStartMs = period.start ? Date.parse(period.start) : null;
  const periodReviews = source.reviews.filter((review) => periodStartMs === null || Date.parse(review.publishedAt) >= periodStartMs);
  const filtered = filterReviews(periodReviews, query.filters);
  const visible = filtered.slice(0, query.limit);
  const filterActive = query.filters.stars !== "all" || query.filters.unanswered || query.filters.theme !== null;
  const pitch = aiReviewsPitch(source, analytics, periodReviews);
  const suggestions = recommendations(source, analytics, periodReviews);

  return (
    <div className="flex flex-col gap-12 sm:gap-16">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
        <div className="flex min-w-0 flex-col gap-5">
          <div className="flex flex-col gap-2">
            <p className="eyebrow">Análise de reviews Google</p>
            <h1 className="display text-[2.2rem] leading-tight sm:text-5xl">{business.name}</h1>
            {business.platesInstalledOn ? (
              <p className="text-sm text-subtle">Placas instaladas a {formatDate(`${business.platesInstalledOn}T12:00:00Z`)} · toques em tempo real</p>
            ) : null}
          </div>
          <DashboardSync
            syncUrl={`/api/painel/${business.slug}/sync`}
            lastSyncedAt={business.lastSyncedAt}
            lastSyncedLabel={business.lastSyncedAt ? `a ${formatDateTime(business.lastSyncedAt)}` : ""}
          />
          <nav aria-label="Período" className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 [scrollbar-width:none]">
            {periodOrder.map((id) => (
              <Link
                key={id}
                href={href({ period: id, limit: reviewsPageSize })}
                scroll={false}
                aria-current={id === period.id ? "page" : undefined}
                className={`inline-flex h-10 shrink-0 items-center rounded-full px-4 text-sm font-semibold transition-colors ${
                  id === period.id ? "bg-surface-inverse text-inverse" : "border border-line bg-surface text-muted hover:text-text"
                }`}
              >
                {periodLabels[id]}
              </Link>
            ))}
          </nav>
        </div>
        {source.competition ? <CompetitionSummary competition={source.competition} /> : null}
      </div>

      <section aria-label="Indicadores" className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {analytics.ratingGoal ? (
          <RatingGoalCard goal={analytics.ratingGoal} />
        ) : (
          <div className="card col-span-2 p-5 sm:p-6 lg:row-span-2">
            <p className="text-sm text-muted">Ainda não há reviews importadas do Google.</p>
          </div>
        )}
        <StatTile label="Avaliação no período" value={kpis.avgRating.current === null ? "–" : `${formatRating(kpis.avgRating.current)}★`}>
          <Delta allTime={period.id === "all"} comparison={kpis.avgRating} format="rating" unit="★" />
        </StatTile>
        <StatTile label="Reviews no período" value={formatInt(kpis.reviews.current ?? 0)}>
          <Delta allTime={period.id === "all"} comparison={kpis.reviews} format="count" />
        </StatTile>
        <StatTile label="Toques nas placas" value={formatInt(kpis.taps.current ?? 0)}>
          <Delta allTime={period.id === "all"} comparison={kpis.taps} format="count" />
        </StatTile>
        <StatTile label="Toques que viram review" value={formatPercent(kpis.conversion.current)}>
          {kpis.conversion.current === null ? (
            <span className="text-xs text-subtle">precisa de {minSample.taps} toques ou mais</span>
          ) : (
            <Delta allTime={period.id === "all"} comparison={kpis.conversion} format="share" />
          )}
        </StatTile>
      </section>

      {insights.length ? (
        <section aria-labelledby="insights-title" className="card flex flex-col gap-4 border-accent/30 p-5 sm:p-6">
          <h2 id="insights-title" className="flex items-center gap-2 font-semibold text-text">
            <LightbulbIcon size={20} className="text-accent-text" />
            Destaques
          </h2>
          <ul className="flex flex-col gap-3">
            {insights.map((insight) => (
              <li key={insight} className="flex gap-3 text-[0.95rem] leading-relaxed text-muted">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {insight}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {showEvolutionSection ? (
      <Section id="evolution" title="Evolução" lead={`Reviews, avaliação e toques por ${granularityLabel} no período escolhido.`}>
        <div className="grid gap-4 lg:grid-cols-2">
          <Card title={`Reviews por ${granularityLabel}`} subtitle={marker ? "A linha marca a instalação das placas." : undefined} className="lg:col-span-2">
            <div className="pt-6">
              <ColumnChart data={reviewColumns} seriesLabel="reviews" marker={marker} />
            </div>
            <DataTable
              caption={`Reviews por ${granularityLabel}`}
              headers={["Período", "Reviews", "Avaliação média", "Toques"]}
              rows={series.map((bucket) => [longLabel(bucket.key), bucket.reviews, formatRating(bucket.avgRating), bucket.taps])}
            />
          </Card>
          <Card title={`Avaliação média por ${granularityLabel}`}>
            <div className="pt-6">
              <RatingLineChart
                seriesLabel="Avaliação média"
                data={series.map((bucket) => ({ key: bucket.key, label: formatBucket(bucket.key), longLabel: longLabel(bucket.key), value: bucket.avgRating }))}
              />
            </div>
          </Card>
          <Card title={`Toques nas placas por ${granularityLabel}`}>
            {hasTaps ? (
              <div className="pt-6">
                <ColumnChart data={tapColumns} seriesLabel="toques" color="viz-2" marker={marker} />
              </div>
            ) : (
              <p className="text-sm text-muted">Sem toques registados.</p>
            )}
          </Card>
        </div>
      </Section>
      ) : null}

      <Section id="before-after" title="Antes e depois das placas" lead="Compara o tempo desde a instalação com igual período anterior (independente do filtro).">
        {analytics.beforeAfter ? (
          <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
            {[
              {
                label: "Reviews por mês",
                before: formatRating(analytics.beforeAfter.before.reviewsPerMonth),
                after: formatRating(analytics.beforeAfter.after.reviewsPerMonth),
                note: analytics.beforeAfter.upliftPct !== null ? `${formatSignedPercent(analytics.beforeAfter.upliftPct)} reviews por mês` : null,
              },
              {
                label: "Avaliação média",
                before: `${formatRating(analytics.beforeAfter.before.avgRating)}★`,
                after: `${formatRating(analytics.beforeAfter.after.avgRating)}★`,
                note: null,
              },
              {
                label: "Reviews com texto",
                before: formatPercent(analytics.beforeAfter.before.textShare),
                after: formatPercent(analytics.beforeAfter.after.textShare),
                note: null,
              },
            ].map((item) => (
              <div key={item.label} className="card flex flex-col gap-3 p-4 sm:p-5">
                <p className="text-sm text-muted">{item.label}</p>
                <div className="flex items-end justify-between gap-3">
                  <div className="flex flex-col">
                    <span className="text-xs text-subtle">Antes</span>
                    <span className="text-xl font-semibold text-muted">{item.before}</span>
                  </div>
                  <span aria-hidden="true" className="pb-1 text-subtle">
                    →
                  </span>
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-subtle">Depois</span>
                    <span className="text-3xl font-semibold tracking-[-0.02em] text-text">{item.after}</span>
                  </div>
                </div>
                {item.note ? <p className={`text-sm font-semibold ${analytics.beforeAfter!.upliftPct! >= 0 ? "text-success" : "text-danger"}`}>{item.note}</p> : null}
              </div>
            ))}
          </div>
        ) : (
          <Card>
            <p className="text-sm text-muted">{beforeAfterGapText(analytics.beforeAfterGap)}</p>
          </Card>
        )}
      </Section>

      <Section
        id="plates"
        title="Placas NFC"
        lead={`Uma review conta como vinda da placa quando é publicada até ${attributionWindowMinutes} minutos depois de um toque. É uma estimativa: o Google não diz de onde vem cada review.`}
      >
        {hasTaps ? (
          <div className="grid gap-4 lg:grid-cols-2">
            <Card title="Desempenho por placa" subtitle="Percentagem de toques que resultam numa review." className="lg:col-span-2">
              <ul className="flex flex-col divide-y divide-line">
                {analytics.plates.map((plate) => {
                  const best = Math.max(0.0001, ...analytics.plates.filter((candidate) => candidate.enoughData).map((candidate) => candidate.conversion ?? 0));
                  const shown = plate.enoughData ? formatPercent(plate.conversion) : "–";
                  return (
                    <li key={plate.code} className="flex flex-col gap-2 py-3 first:pt-0 last:pb-0 sm:grid sm:grid-cols-[minmax(0,12rem)_minmax(0,1fr)_max-content] sm:items-center sm:gap-4">
                      <div className="flex items-baseline justify-between gap-3 sm:block">
                        <p className="font-medium text-text">{plate.label}</p>
                        <p className="text-2xl font-semibold tracking-[-0.02em] text-text sm:hidden">{shown}</p>
                      </div>
                      <span className="flex items-center gap-3">
                        <span className="h-3 min-w-0 flex-1" aria-hidden="true">
                          {plate.enoughData ? (
                            <span className="block h-full rounded-r-[4px] bg-viz-1" style={{ width: `max(2px, ${((plate.conversion ?? 0) / best) * 100}%)` }} />
                          ) : (
                            <span className="block h-full w-full rounded-[4px] border border-dashed border-line-strong" />
                          )}
                        </span>
                        <span className="hidden w-12 text-right text-lg font-semibold text-text sm:inline">{shown}</span>
                      </span>
                      <p className="tabular text-sm text-muted sm:text-right">
                        {plate.enoughData
                          ? `${formatInt(plate.taps)} toques · ${formatInt(plate.attributedReviews)} reviews`
                          : `${plural(plate.taps, "toque", "toques")}: poucos dados (mín. ${minSample.taps})`}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </Card>
            <Card title="Quando tocam nas placas" subtitle="Toques por dia da semana e hora. Mostra quando a equipa deve lembrar os clientes." className="lg:col-span-2">
              <div className="pt-6">
                <Heatmap
                  hours={heatHours}
                  valueLabel="toques"
                  rows={weekdayOrder.map((weekday) => ({ label: weekdayShort[weekday], longLabel: weekdayLong[weekday], values: analytics.tapHeatmap[weekday] }))}
                />
              </div>
              <DataTable
                caption="Toques por dia da semana e hora"
                headers={["Dia", ...heatHours.map((hour) => `${hour}h`)]}
                rows={weekdayOrder.map((weekday) => [weekdayShort[weekday], ...heatHours.map((hour) => analytics.tapHeatmap[weekday][hour])])}
              />
            </Card>
            <Card title="Toques que viram review, por dia" subtitle={`A cinzento: menos de ${minSample.taps} toques nesse dia, valor pouco fiável.`}>
              <div className="pt-6">
                <ColumnChart
                  seriesLabel="de conversão"
                  valueFormat="percent"
                  data={analytics.weekdays.map((day) => ({
                    key: String(day.weekday),
                    label: weekdayShort[day.weekday],
                    longLabel: `${weekdayLong[day.weekday]} (${day.taps} toques)`,
                    value: day.conversion ?? 0,
                    muted: !day.enoughTaps,
                  }))}
                />
              </div>
              <DataTable
                caption="Conversão por dia da semana"
                headers={["Dia", "Toques", "Reviews atribuídas", "Conversão"]}
                rows={analytics.weekdays.map((day) => [weekdayLong[day.weekday], day.taps, day.attributed, formatPercent(day.conversion)])}
              />
            </Card>
            <Card title="NFC ou QR code" subtitle="Ajuda a decidir se vale a pena manter o QR impresso.">
              <SplitBar
                segments={[
                  { key: "nfc", label: "Toque NFC", value: analytics.sources.nfc, className: "bg-viz-1" },
                  { key: "qr", label: "QR code", value: analytics.sources.qr, className: "bg-viz-2" },
                ]}
              />
              <p className="mt-4 text-sm text-muted">{plural(kpis.uniqueVisitors, "pessoa diferente tocou", "pessoas diferentes tocaram")} nas placas neste período (estimativa).</p>
            </Card>
          </div>
        ) : (
          <Card>
            <p className="text-sm text-muted">Ainda não há toques registados para este negócio.</p>
          </Card>
        )}
      </Section>

      <Section id="feedback" title="O que dizem os clientes" lead="Temas detetados automaticamente no texto das reviews do período.">
        <div className="grid gap-4 lg:grid-cols-2">
          <Card title="Distribuição de estrelas">
            <BarList
              rows={analytics.starDistribution.map((row) => ({
                key: String(row.stars),
                label: (
                  <span className="inline-flex items-center gap-1.5">
                    {row.stars}
                    <StarFilled size={14} className="text-star" />
                  </span>
                ),
                value: row.count,
                display: formatPercent(row.share),
                detail: `(${row.count})`,
              }))}
            />
            {kpis.reviews.current ? (
              <p className="mt-4 text-sm text-muted">
                <strong className="text-success">{formatPercent(analytics.sentiment.positive / kpis.reviews.current)} positivas</strong> (4–5★) ·{" "}
                <strong className="text-danger">{formatPercent(analytics.sentiment.negative / kpis.reviews.current)} negativas</strong> (1–2★)
              </p>
            ) : null}
          </Card>
          <Card title="Avaliação por dia da semana" subtitle={`Ajuda a detetar dias com problemas (equipa, movimento). «–»: menos de ${minSample.reviews} reviews.`}>
            <RatingDots
              rows={analytics.weekdays.map((day) => ({
                key: String(day.weekday),
                label: weekdayLong[day.weekday].replace("-feira", ""),
                rating: day.enoughReviews ? day.avgRating : null,
                count: day.reviews,
              }))}
            />
          </Card>
          <Card title="Temas mais falados" subtitle="Toque num tema para ler o que os clientes escreveram." className="lg:col-span-2">
            {analytics.themes.length ? (
              <ul className="divide-y divide-line">
                {analytics.themes.map((theme) => (
                  <li key={theme.id}>
                    <details className="group py-1">
                      <summary className="grid min-h-12 cursor-pointer list-none grid-cols-[minmax(0,1fr)_max-content] items-center gap-x-4 gap-y-1 py-2 sm:grid-cols-[minmax(0,1fr)_7rem_4rem_7.5rem_max-content] [&::-webkit-details-marker]:hidden">
                        <span className="font-medium text-text">{themeLabels[theme.id]}</span>
                        <span className="tabular inline-flex items-center justify-end gap-1 font-semibold text-text sm:order-3">
                          {formatRating(theme.avgRating)}
                          <StarFilled size={13} className="text-star" />
                        </span>
                        <span className="tabular text-sm text-muted sm:order-2 sm:text-right">{plural(theme.mentions, "menção", "menções")}</span>
                        <span className="text-right sm:order-4">
                          {theme.verdict === "strength" ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-success-soft px-2.5 py-1 text-xs font-semibold text-success">
                              <Check size={13} /> Ponto forte
                            </span>
                          ) : theme.verdict === "improve" ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-danger-soft px-2.5 py-1 text-xs font-semibold text-danger">
                              <AlertIcon size={13} /> A melhorar
                            </span>
                          ) : null}
                        </span>
                        <span className="col-span-2 inline-flex items-center gap-1 justify-self-start text-sm font-semibold text-accent-text sm:order-5 sm:col-span-1 sm:justify-self-end">
                          <span className="group-open:hidden">Ver reviews</span>
                          <span className="hidden group-open:inline">Fechar</span>
                          <svg aria-hidden="true" viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform group-open:rotate-180">
                            <path d="m6 9 6 6 6-6" />
                          </svg>
                        </span>
                      </summary>
                      <div className="flex flex-col gap-3 pb-4">
                        {theme.examples.length ? (
                          <ul className="flex flex-col gap-2">
                            {theme.examples.map((example) => (
                              <li key={example.reviewId} className="rounded-xl bg-surface-2/60 px-3.5 py-2.5">
                                <p className="text-[0.95rem] text-text">“{example.quote}”</p>
                                <p className="mt-1 flex items-center gap-2 text-xs text-subtle">
                                  <Stars rating={example.rating} size={12} />
                                  <span className="sr-only">{example.rating} estrelas,</span>
                                  {formatDate(example.publishedAt)}
                                </p>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                        <ThemeReviews
                          slug={business.slug}
                          theme={theme.id}
                          period={period.id}
                          count={theme.mentions}
                          label={`Ver as ${plural(theme.mentions, "review", "reviews")} sobre ${themeLabels[theme.id].toLowerCase()}`}
                        />
                      </div>
                    </details>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted">Ainda não há reviews com texto suficiente.</p>
            )}
          </Card>
          {(["positive", "negative"] as const).map((tone) => (
            <Card key={tone} title={tone === "positive" ? "Palavras nas reviews positivas" : "Palavras nas reviews negativas"}>
              {analytics.words[tone].length ? (
                <ul className="flex flex-wrap gap-2">
                  {analytics.words[tone].map((entry) => (
                    <li
                      key={entry.word}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm ${tone === "positive" ? "bg-success-soft text-success" : "bg-danger-soft text-danger"}`}
                    >
                      {entry.word}
                      <span className="tabular text-xs opacity-75">{entry.count}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted">Sem dados suficientes neste período.</p>
              )}
            </Card>
          ))}
        </div>
      </Section>

      {source.competition ? <CompetitionSection competition={source.competition} category={business.category} /> : null}

      {suggestions.length ? (
        <Section id="recommended" title="Recomendado para o seu negócio" lead="Sugestões a partir do que as suas reviews e placas mostram.">
          <RecommendationCards items={suggestions} />
        </Section>
      ) : null}

      <Section
        id="reviews"
        title="Reviews"
        lead={kpis.reviews.current ? undefined : "Sem reviews neste período."}
      >
        {kpis.reviews.current ? (
          <div className="card flex flex-col gap-3 p-4 sm:p-5">
            <div className="flex items-baseline justify-between gap-3">
              <p className="font-semibold text-text">Reviews respondidas</p>
              <p className="text-2xl font-semibold tracking-[-0.02em] text-text">{formatPercent(kpis.replyRate.current)}</p>
            </div>
            <ProgressBar
              value={kpis.replyRate.current ?? 0}
              label="Percentagem de reviews respondidas no período"
              tone={analytics.unansweredCount === 0 ? "success" : "accent"}
              track="bg-surface-2"
            />
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-sm text-muted">
              <span>
                {analytics.unansweredCount
                  ? `${plural(analytics.unansweredCount, "por responder", "por responder")} · meta: responder a todas`
                  : "Todas respondidas. Excelente!"}
                {kpis.medianReplyHours !== null ? ` · responde em ${formatHours(kpis.medianReplyHours)} (mediana)` : ""}
              </span>
              {analytics.unansweredCount && !query.filters.unanswered ? (
                <Link href={href({ unanswered: true, limit: reviewsPageSize }, "#reviews")} scroll={false} className="inline-flex min-h-10 items-center font-semibold text-accent-text hover:underline">
                  Ver as que faltam →
                </Link>
              ) : null}
            </div>
          </div>
        ) : null}
        {pitch ? <AiReviewsPromo pitch={pitch} businessName={business.name} /> : null}
        <div className="flex flex-col gap-3">
          <nav aria-label="Filtrar reviews" className="flex flex-wrap gap-1.5">
            {(Object.keys(starFilterLabels) as ReviewStarFilter[]).map((stars) => (
              <Link
                key={stars}
                href={href({ stars, limit: reviewsPageSize }, "#reviews")}
                scroll={false}
                aria-current={query.filters.stars === stars ? "true" : undefined}
                className={`inline-flex h-10 shrink-0 items-center rounded-full px-4 text-sm font-semibold transition-colors ${
                  query.filters.stars === stars ? "bg-surface-inverse text-inverse" : "border border-line bg-surface text-muted hover:text-text"
                }`}
              >
                {starFilterLabels[stars]}
              </Link>
            ))}
            <Link
              href={href({ unanswered: !query.filters.unanswered, limit: reviewsPageSize }, "#reviews")}
              scroll={false}
              aria-pressed={query.filters.unanswered}
              className={`inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full px-4 text-sm font-semibold transition-colors ${
                query.filters.unanswered ? "bg-accent text-accent-contrast" : "border border-line bg-surface text-muted hover:text-text"
              }`}
            >
              {query.filters.unanswered ? <Check size={14} /> : null}
              Sem resposta ({formatInt(analytics.unansweredCount)})
            </Link>
          </nav>
          {query.filters.theme ? (
            <Link
              href={href({ theme: null, limit: reviewsPageSize }, "#reviews")}
              scroll={false}
              className="inline-flex h-9 items-center gap-1.5 self-start rounded-full bg-accent-soft px-3.5 text-sm font-semibold text-accent-text"
            >
              Tema: {themeLabels[query.filters.theme]}
              <CloseIcon size={14} />
              <span className="sr-only">(remover filtro)</span>
            </Link>
          ) : null}
          <p className="text-sm text-subtle" role="status">
            {plural(filtered.length, "review", "reviews")}
            {filterActive ? " com estes filtros" : ""}, das mais recentes para as mais antigas.
          </p>
        </div>

        {visible.length ? (
          <ul className="grid gap-3 sm:gap-4 lg:grid-cols-2">
            {visible.map((review) => (
              <li key={review.id} className="card flex flex-col gap-3 p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2">
                    <Stars rating={review.rating} size={15} />
                    <span className="sr-only">{review.rating} estrelas</span>
                  </span>
                  <span className="text-xs text-subtle">{formatDateTime(review.publishedAt)}</span>
                </div>
                <ReviewText text={review.text} />
                {review.ownerReply ? (
                  <details className="group rounded-xl bg-surface-2/60 px-3.5 py-2">
                    <summary className="flex min-h-9 cursor-pointer list-none items-center justify-between gap-2 text-sm font-semibold text-muted [&::-webkit-details-marker]:hidden">
                      <span className="inline-flex items-center gap-1.5">
                        <Check size={14} className="text-success" /> Respondida
                        {review.ownerRepliedAt ? <span className="font-normal text-subtle">· {formatDate(review.ownerRepliedAt)}</span> : null}
                      </span>
                      <span className="text-xs font-normal text-subtle group-open:hidden">ver resposta</span>
                    </summary>
                    <p className="pb-2 text-sm leading-relaxed whitespace-pre-line text-muted">{review.ownerReply}</p>
                  </details>
                ) : (
                  <a
                    href={business.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex min-h-10 items-center gap-1.5 self-start text-sm font-semibold text-accent-text hover:underline"
                  >
                    Sem resposta · responder no Google <ArrowUpRight size={15} />
                  </a>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <Card>
            <p className="text-sm text-muted">Nenhuma review com estes filtros.</p>
          </Card>
        )}

        {filtered.length > visible.length ? (
          <Link
            href={href({ limit: query.limit + reviewsPageSize })}
            scroll={false}
            className="inline-flex h-12 items-center justify-center self-center rounded-full border border-line-strong bg-surface px-6 text-sm font-semibold text-text hover:bg-surface-2"
          >
            Ver mais reviews ({formatInt(filtered.length - visible.length)} restantes)
          </Link>
        ) : null}
      </Section>
    </div>
  );
}

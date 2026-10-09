import type { ReactNode } from "react";
import { AlertIcon, ArrowUpRight, Check, CloseIcon, LightbulbIcon, ProductGlyph, SparkleIcon, StarFilled, WhatsAppIcon } from "@/components/icons";
import { buttonClasses } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { priceLabel } from "@/components/ui/Price";
import { getProduct } from "@/content/products";
import { getProductCopy } from "@/content/product-copy";
import { BusinessName } from "./BusinessName";
import type { ProductId } from "@/content/types";
import { aiReviewsPitch, recommendations, themeServices, type AiReviewsPitch, type Recommendation, type ThemeService } from "@/lib/reviews/recommendations";
import { href as routeHref } from "@/lib/routes";
import { whatsappUrl } from "@/lib/site";
import {
  bucketKey,
  filterReviews,
  hasPlatesProduct,
  minSample,
  type Comparison,
  type DashboardAnalytics,
  type PeriodId,
  type RatingGoal,
  type ReviewFilters,
  type ReviewStarFilter,
} from "@/lib/reviews/analytics";
import { formatBucket, formatDate, formatDateTime, formatHours, formatInt, formatPercent, formatRating, formatSignedPercent, weekdayLong } from "@/lib/reviews/format";
import { competitorLimit, radiusLabel, type Competition } from "@/lib/reviews/competitors";
import type { ThemeId } from "@/lib/reviews/text";
import type { DashboardSource } from "@/lib/reviews/types";
import { BarList, ColumnChart, DataTable, RatingDots, RatingLineChart, type ColumnDatum } from "./charts";
import { CompetitionBoard } from "./CompetitionBoard";
import { DashboardBusyProvider, PendingLink, Refreshable } from "./DashboardBusy";
import { DashboardSync } from "./DashboardSync";
import { googleReviewUrl } from "@/lib/reviews/google-links";
import type { ReaderJobsState } from "@/lib/reviews/import-jobs";
import { HistoryImport } from "./HistoryImport";
import { InfoTip } from "./InfoTip";
import { ReaderJobsProvider } from "./ReaderJobs";
import { ReviewText } from "./ReviewText";
import { Stars } from "./Stars";
import { ThemeReviews } from "./ThemeReviews";

export const periodLabels: Record<PeriodId, string> = { "30d": "30 dias", "90d": "90 dias", "12m": "12 meses", all: "Tudo" };

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

/**
 * How each figure built with our own criteria is calculated, shown behind an (i) icon.
 * Business rule: anything we compute ourselves must explain itself (see the reviews skill).
 */
const infoTexts = {
  ratingGoal:
    "O Google mostra a média de todas as reviews arredondada a uma casa decimal (4,45 aparece como 4,5). A barra mostra onde está a sua média exata entre a nota atual e a seguinte. «Faltam X reviews de 5★» é o mínimo de reviews de 5★ que leva a média ao valor em que o Google passa a mostrar a nota seguinte. O ritmo usa as reviews de 5★ dos últimos 3 meses. Com o histórico incompleto, usamos os totais do Google (estimativa).",
  avgRating:
    "Média das estrelas das reviews publicadas no período escolhido. A comparação é com o período anterior de igual duração e só aparece com pelo menos 5 reviews nesse período.",
  reviews: "Reviews publicadas no Google no período escolhido, comparadas com o período anterior de igual duração (mínimo de 5 reviews para comparar).",
  competition: (radiusKm: number) =>
    `Até ${competitorLimit} negócios num raio de ${radiusLabel(radiusKm)}: primeiro os da mesma categoria do Google (os com mais reviews), depois os que o Google associa a essa pesquisa. Avaliação: ordenada pela média exata, calculada a partir da distribuição de estrelas no Google. «Faltam X reviews de 5★»: mínimo de reviews de 5★ para a sua média exata passar a do negócio logo acima. Respondidas: percentagem das reviews recentes com resposta do dono (estimativa, ver o (i) na tabela). Dados públicos do Google, atualizados duas vezes por dia (10:00 e 19:00). Setas: lugares ganhos ou perdidos face a há um mês e a variação da sua nota ou do seu total de reviews nesse mês. O seu negócio de há um mês é calculado com as suas reviews (sem as publicadas no último mês); nos concorrentes, tiramos ao total as reviews que recebem por mês e mantemos a nota de hoje, até termos registos com um mês.`,
  competitionReplies:
    "Percentagem das reviews recentes de cada negócio que têm resposta do dono no Google. Contamos as reviews mais recentes (até 60) publicadas nos últimos 12 meses, sem as dos últimos 7 dias, para dar tempo a responder. Nos concorrentes, é medida uma vez, quando entram na comparação, com as mesmas reviews usadas para o ritmo; no seu negócio, com as suas reviews importadas e a mesma regra. Com menos de 5 reviews contadas não mostramos valor («–»). Empates: primeiro quem tem mais reviews contadas. É uma estimativa: guardamos só a percentagem e o número de reviews contadas, nunca os textos.",
  pace: "Média de reviews por mês nos últimos 3 meses, comparada com os 3 meses antes. Não depende do filtro de período: mostra sempre o ritmo atual.",
  replyRate:
    "Percentagem das reviews do período que já têm resposta do dono no Google. Ao atualizar, apanhamos as respostas novas a reviews dos últimos 90 dias; respostas a reviews mais antigas aparecem na verificação do histórico completo.",
  sentiment: "Regra Steevanz: reviews de 1 a 3★ contam como negativas e de 4 a 5★ como positivas. Não há categoria neutra.",
  weekdayRating: "Média das estrelas das reviews publicadas em cada dia da semana (hora de Lisboa). Dias com menos de 5 reviews não mostram valor.",
  themes:
    "Detetamos os temas no texto das reviews com listas de palavras em português e inglês (ex.: «espera», «demora», «fila» para Tempo de espera). «Ponto forte»: pelo menos 5 menções, média acima da média geral e 80% ou mais positivas (4–5★). «A melhorar»: pelo menos 5 menções e 30% ou mais negativas (1–3★), ou média 0,4★ abaixo da geral.",
  words: "Palavras mais repetidas nas reviews positivas (4–5★) e negativas (1–3★), sem palavras comuns como «muito» ou «bom». Cada palavra conta uma vez por review e só aparece se surgir em pelo menos 2.",
  beforeAfter:
    "Compara o tempo desde a instalação das placas com igual número de meses antes (mínimo 3 meses). Reviews por mês = reviews no intervalo ÷ meses. Só aparece com pelo menos 1 mês de placas e 3 reviews antes. Não depende do filtro de período.",
  replies:
    "Percentagem das reviews do período que já têm resposta do dono no Google; o tempo é a mediana entre a review e a resposta. Ao atualizar, vemos as respostas novas a reviews dos últimos 90 dias; respostas a reviews mais antigas aparecem na verificação do histórico completo (todos os meses, ou com o link por baixo de «Atualizar reviews»).",
  recommendations: "Cada sugestão só aparece quando os seus dados mostram um sinal concreto (indicado em cada cartão) e nunca para serviços que já tem.",
  insights: "Frases geradas automaticamente a partir dos números deste painel. Só aparecem quando a diferença é relevante e há dados suficientes.",
};

const starFilterLabels: Record<ReviewStarFilter, string> ={ all: "Todas", positive: "Positivas (4–5★)", negative: "Negativas (1–3★)" };

export interface DashboardQuery {
  period: PeriodId;
  filters: ReviewFilters;
  limit: number;
}

export const reviewsPageSize = 20;

function Section({ id, title, lead, info, children }: { id: string; title: string; lead?: ReactNode; info?: ReactNode; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <h2 id={`${id}-title`} className="display text-2xl sm:text-3xl">
            {title}
          </h2>
          {info ? <InfoTip label={title}>{info}</InfoTip> : null}
        </div>
        {lead ? <p className="max-w-3xl text-sm text-muted sm:text-base">{lead}</p> : null}
      </div>
      {children}
    </section>
  );
}

function Card({ title, subtitle, info, children, className = "" }: { title?: string; subtitle?: string; info?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={`card min-w-0 p-4 sm:p-6 ${className}`}>
      {title ? (
        <div className="mb-5 flex flex-col gap-0.5">
          <h3 className="flex items-center gap-1.5 font-semibold text-text">
            {title}
            {info ? <InfoTip label={title}>{info}</InfoTip> : null}
          </h3>
          {subtitle ? <p className="text-sm text-subtle">{subtitle}</p> : null}
        </div>
      ) : null}
      {children}
    </div>
  );
}


function Delta({
  comparison,
  format,
  unit = "",
  allTime = false,
  versus = "período anterior",
}: {
  comparison: Comparison;
  format: "count" | "rating" | "share";
  unit?: string;
  allTime?: boolean;
  versus?: string;
}) {
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
      {label} <span className="font-normal text-subtle">vs {versus}</span>
    </span>
  );
}

function StatTile({ label, value, info, children }: { label: string; value: string; info?: ReactNode; children?: ReactNode }) {
  return (
    <div className="card flex min-w-0 flex-col gap-1.5 p-4 sm:p-5">
      <p className="flex items-center gap-1.5 text-sm text-muted">
        {label}
        {info ? <InfoTip label={label}>{info}</InfoTip> : null}
      </p>
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
    <div className="card flex flex-col gap-4 p-5 sm:p-6">
      <div className="flex flex-col gap-1">
        <p className="flex items-center gap-1.5 text-sm text-muted">
          Avaliação no Google
          <InfoTip label="Avaliação no Google e meta">{infoTexts.ratingGoal}</InfoTip>
        </p>
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
              <div className="flex min-w-0 flex-col gap-0.5">
                <p className="text-xs font-semibold uppercase tracking-[0.06em] text-accent-text">{getProductCopy(item.productId, "pt").name}</p>
                <h3 className="font-semibold text-text">{item.title}</h3>
              </div>
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

/** Inside an opened theme with a problem: the services that tackle it (at most 2). */
function ThemeServiceCards({ items, theme }: { items: ThemeService[]; theme: string }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-text">
        <LightbulbIcon size={14} className="text-gold-text" /> Pode ajudar com {theme.toLowerCase()}
      </p>
      <ul className="grid gap-2 sm:grid-cols-2">
        {items.map((item) => {
          const product = getProduct(item.productId);
          return (
            <li key={item.productId} className="flex flex-col gap-2 rounded-xl border border-line bg-surface p-3.5">
              <div className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent-text">
                  <ProductGlyph icon={product.icon} size={16} />
                </span>
                <p className="min-w-0 text-sm font-semibold text-text">{getProductCopy(item.productId, "pt").name}</p>
              </div>
              <p className="text-sm leading-relaxed text-muted">{item.body}</p>
              <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-2">
                <span className="text-sm font-semibold text-text">{priceLabel(product, "pt")}</span>
                <a href={productLink(item.productId)} target="_blank" rel="noopener" className="inline-flex min-h-10 items-center gap-1 text-sm font-semibold text-accent-text hover:underline">
                  Saber mais <ArrowUpRight size={15} />
                </a>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function competitionNotes(competition: Competition): { tone: "good" | "info"; text: ReactNode }[] {
  const notes: { tone: "good" | "info"; text: ReactNode }[] = [];
  const self = competition.entries.find((entry) => entry.isSelf);
  if (self && self.reviewsCount === 0 && (self.average ?? self.rating) === null) {
    notes.push({ tone: "info", text: "Ainda não tem reviews no Google: a primeira já o tira do último lugar." });
    return notes;
  }
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
  return notes;
}

/**
 * Top-of-page summary: where the customer stands nearby and what it takes to climb, leading to the
 * table. Always shown: before the competitors are read, and for any position not known yet, a
 * loading placeholder.
 */
const signedPercent = new Intl.NumberFormat("pt-PT", { style: "percent", maximumFractionDigits: 1, signDisplay: "exceptZero" });

/** "▲ 2 · +1,2%": places climbed since the comparison day and the change of the customer's own number. */
function RankTrendLine({ places, change, since }: { places: number | null; change: number | null; since: string }) {
  if (places === null && change === null) return null;
  const direction = places ?? 0;
  const tone = direction > 0 ? "text-success" : direction < 0 ? "text-danger" : "text-subtle";
  const arrow = direction > 0 ? "▲" : direction < 0 ? "▼" : "=";
  const placesLabel = places === null || places === 0 ? "mesma posição" : `${Math.abs(places)} ${Math.abs(places) === 1 ? "lugar" : "lugares"}`;
  return (
    <span className={`flex flex-wrap items-center gap-x-1 text-[0.7rem] leading-tight font-semibold ${tone}`} title={`Desde ${formatDate(`${since}T12:00:00Z`)}`}>
      <span aria-hidden="true">{arrow}</span>
      <span className="sr-only">{direction > 0 ? "Subiu" : direction < 0 ? "Desceu" : "Manteve"}</span>
      {places === null || places === 0 ? null : <span>{Math.abs(places)}</span>}
      {places !== null && places !== 0 ? <span className="sr-only">{placesLabel}</span> : null}
      {change !== null ? <span className="font-normal text-subtle">{places ? "· " : ""}{signedPercent.format(change)}</span> : null}
    </span>
  );
}

function CompetitionSummary({ competition, radiusKm }: { competition: Competition | null; radiusKm: number }) {
  const radius = radiusLabel(radiusKm);
  const notes = competition ? competitionNotes(competition) : [];
  const trend = competition?.trend ?? null;
  const ranks = [
    { label: "Avaliação", rank: competition?.ratingRank ?? null, places: trend?.ratingRankChange ?? null, change: trend?.ratingChange ?? null },
    { label: "Total de reviews", rank: competition?.reviewsRank ?? null, places: trend?.reviewsRankChange ?? null, change: trend?.reviewsChange ?? null },
  ];
  return (
    <aside aria-labelledby="competition-summary-title" className="card flex flex-col gap-4 p-4 sm:p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="competition-summary-title" className="flex items-center gap-1.5 font-semibold text-text">
          Na sua zona
          <InfoTip label="Na sua zona">{infoTexts.competition(radiusKm)}</InfoTip>
        </h2>
        <span className="text-xs text-subtle">
          {competition ? `${plural(competition.competitors, "concorrente", "concorrentes")} até ${radius}` : `concorrentes até ${radius}`}
        </span>
      </div>
      <dl className="grid grid-cols-2 gap-2">
        {ranks.map((item) => (
          <div key={item.label} className="flex min-w-0 flex-col gap-0.5 rounded-xl bg-surface-2/70 px-2.5 py-2">
            <dt className="text-[0.7rem] leading-tight text-muted">{item.label}</dt>
            <dd className="flex flex-wrap items-baseline gap-x-1">
              {item.rank === null || !competition ? (
                <span className="flex flex-col gap-1 pt-1">
                  <Skeleton className="h-6 w-10" />
                  <span className="text-[0.7rem] whitespace-nowrap text-subtle">a carregar</span>
                </span>
              ) : (
                <>
                  <span className={`text-2xl font-semibold tracking-[-0.02em] ${item.rank === 1 ? "text-success" : "text-text"}`}>{item.rank}.º</span>
                  <span className="text-[0.7rem] whitespace-nowrap text-subtle">de {competition.total}</span>
                  {trend ? (
                    <span className="basis-full">
                      <RankTrendLine places={item.places} change={item.change} since={trend.since} />
                    </span>
                  ) : null}
                </>
              )}
            </dd>
          </div>
        ))}
      </dl>
      {trend ? <p className="-mt-2 text-[0.7rem] text-subtle">Setas e percentagens: face a há 1 mês.</p> : null}
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
      {competition ? (
        <a href="#competition" className={buttonClasses("primary", "md", "w-full")}>
          Ver a tabela da concorrência
          <span aria-hidden="true">↓</span>
        </a>
      ) : (
        <p className="text-sm text-muted">
          A carregar a concorrência: o leitor procura os negócios da zona na primeira importação e lê a nota, o total e as estrelas de cada um. As posições
          aparecem aqui à medida que chegam.
        </p>
      )}
    </aside>
  );
}

function CompetitionSection({ competition, category, radiusKm }: { competition: Competition; category: string | null; radiusKm: number }) {
  return (
    <Section
      id="competition"
      title="Como está face à concorrência"
      info={infoTexts.competition(radiusKm)}
      lead={`${plural(competition.competitors, "negócio", "negócios")} ${category ? `de «${category}» ` : ""}num raio de ${radiusLabel(radiusKm)}. Dados públicos do Google, atualizados duas vezes por dia${competition.lastSnapshotOn ? ` (última atualização a ${formatDate(`${competition.lastSnapshotOn}T12:00:00Z`)})` : ""}.`}
    >
      <Card>
        <CompetitionBoard entries={competition.entries} replyInfo={infoTexts.competitionReplies} />
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
        ? `É o mais bem avaliado entre ${competition.total} negócios da mesma categoria num raio de ${radiusLabel(source.business.competitorRadiusKm)}.`
        : `Está em ${competition.ratingRank}.º de ${competition.total} na avaliação entre os negócios da mesma categoria num raio de ${radiusLabel(source.business.competitorRadiusKm)}. Veja abaixo quanto falta para subir.`,
    );
  }
  const { beforeAfter, weekdays, themes, kpis } = analytics;
  if (beforeAfter && beforeAfter.upliftPct !== null && Math.abs(beforeAfter.upliftPct) >= 10) {
    items.push(
      `Desde que as placas foram instaladas, recebe em média ${formatRating(beforeAfter.after.reviewsPerMonth)} reviews por mês, ${formatSignedPercent(beforeAfter.upliftPct)} face aos meses anteriores (${formatRating(beforeAfter.before.reviewsPerMonth)}/mês).`,
    );
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
  return items.slice(0, 5);
}

function beforeAfterGapText(gap: DashboardAnalytics["beforeAfterGap"]): string {
  if (gap === "no-install-date") return "Indique à Steevanz a data de instalação das placas para comparar o antes e o depois.";
  if (gap === "too-early") return "As placas foram instaladas há menos de um mês. A comparação aparece quando houver pelo menos um mês de dados.";
  return "Não há reviews suficientes antes das placas para fazer uma comparação justa.";
}

export function ReviewsDashboard({
  source,
  analytics,
  basePath,
  query,
  readerJobs,
  googleConnect = null,
}: {
  source: DashboardSource;
  analytics: DashboardAnalytics;
  basePath: string;
  query: DashboardQuery;
  readerJobs: ReaderJobsState;
  /** Where «Ligar Google» goes; null when the Business Profile is already connected. */
  googleConnect?: { href: string; external: boolean } | null;
}) {
  const { business } = source;
  const { kpis, series, period } = analytics;
  // Everything about the NFC plates (install date, chart marker, «Antes e depois») only for clients who have them.
  const hasPlates = hasPlatesProduct(business);
  const insights = insightsFor(source, analytics);
  const granularityLabel = period.granularity === "month" ? "mês" : period.granularity === "week" ? "semana" : "dia";
  const markerKey = hasPlates && business.platesInstalledOn ? bucketKey(`${business.platesInstalledOn}T12:00:00Z`, period.granularity) : null;
  const marker = markerKey && series.some((bucket) => bucket.key === markerKey) ? { key: markerKey, label: "Placas" } : undefined;
  const lastKey = series[series.length - 1]?.key;
  const longLabel = (key: string) =>
    `${period.granularity === "week" ? `Semana de ${formatBucket(key)}` : formatBucket(key, true)}${key === lastKey ? " (em curso)" : ""}`;
  const reviewColumns: ColumnDatum[] = series.map((bucket) => ({ key: bucket.key, label: formatBucket(bucket.key), longLabel: longLabel(bucket.key), value: bucket.reviews }));

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
    <DashboardBusyProvider>
    <div className="flex flex-col gap-12 sm:gap-16">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
        <div className="flex min-w-0 flex-col gap-5">
          <div className="flex flex-col gap-2">
            <p className="eyebrow">Análise de reviews Google</p>
            <BusinessName name={business.name} mapsUrl={business.googleMapsUrl} />
            {hasPlates && business.platesInstalledOn ? (
              <p className="text-sm text-subtle">Placas instaladas a {formatDate(`${business.platesInstalledOn}T12:00:00Z`)}</p>
            ) : null}
          </div>
          <ReaderJobsProvider slug={business.slug} initial={readerJobs}>
            <DashboardSync syncUrl={`/api/painel/${business.slug}/sync`} lastSyncedLabel={business.lastSyncedAt ? `a ${formatDateTime(business.lastSyncedAt)}` : ""} />
            <HistoryImport slug={business.slug} googleConnect={googleConnect} />
          </ReaderJobsProvider>
        </div>
        <div className="flex flex-col gap-4 lg:w-[27rem] lg:shrink-0">
          <Refreshable scopes={["sync"]}>
            <CompetitionSummary competition={source.competition} radiusKm={business.competitorRadiusKm} />
          </Refreshable>
          <Refreshable scopes={["sync"]}>
            {analytics.ratingGoal ? (
              <RatingGoalCard goal={analytics.ratingGoal} />
            ) : (
              <div className="card p-5 sm:p-6">
                <p className="text-sm text-muted">Ainda não há reviews importadas do Google.</p>
              </div>
            )}
          </Refreshable>
        </div>
      </div>

      <Refreshable scopes={["sync","period"]}>
  <section aria-label="Indicadores" className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {insights.length ? (
            <section aria-labelledby="insights-title" className="card col-span-2 flex flex-col gap-4 border-accent/30 p-5 sm:p-6 lg:row-span-2">
              <h2 id="insights-title" className="flex items-center gap-2 font-semibold text-text">
                <LightbulbIcon size={20} className="text-accent-text" />
                Destaques
                <InfoTip label="Destaques">{infoTexts.insights}</InfoTip>
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
          <StatTile label="Avaliação no período" info={infoTexts.avgRating} value={kpis.avgRating.current === null ? "–" : `${formatRating(kpis.avgRating.current)}★`}>
            <Delta allTime={period.id === "all"} comparison={kpis.avgRating} format="rating" unit="★" />
          </StatTile>
          <StatTile label="Reviews no período" info={infoTexts.reviews} value={formatInt(kpis.reviews.current ?? 0)}>
            <Delta allTime={period.id === "all"} comparison={kpis.reviews} format="count" />
          </StatTile>
          <StatTile label="Reviews respondidas" info={infoTexts.replyRate} value={formatPercent(kpis.replyRate.current)}>
            <Delta allTime={period.id === "all"} comparison={kpis.replyRate} format="share" />
          </StatTile>
          <StatTile label="Reviews por mês" info={infoTexts.pace} value={formatRating(kpis.pace.current)}>
            <Delta comparison={kpis.pace} format="count" versus="3 meses anteriores" />
          </StatTile>
        </section>
      </Refreshable>

      <Refreshable scopes={["sync"]}>
  {source.competition ? <CompetitionSection competition={source.competition} category={business.category} radiusKm={business.competitorRadiusKm} /> : null}
      </Refreshable>

      <Refreshable scopes={["sync","period"]}>
  <Section id="feedback" title="O que dizem os clientes" lead="Estrelas, dias da semana e palavras mais usadas nas reviews do período.">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card title="Distribuição de estrelas" info={infoTexts.sentiment}>
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
                  <strong className="text-danger">{formatPercent(analytics.sentiment.negative / kpis.reviews.current)} negativas</strong> (1–3★)
                </p>
              ) : null}
            </Card>
            <Card title="Avaliação por dia da semana" info={infoTexts.weekdayRating} subtitle={`Ajuda a detetar dias com problemas (equipa, movimento). «–»: menos de ${minSample.reviews} reviews.`}>
              <RatingDots
                rows={analytics.weekdays.map((day) => ({
                  key: String(day.weekday),
                  label: weekdayLong[day.weekday].replace("-feira", ""),
                  rating: day.enoughReviews ? day.avgRating : null,
                  count: day.reviews,
                }))}
              />
            </Card>
            {(["positive", "negative"] as const).map((tone) => (
              <Card key={tone} info={infoTexts.words} title={tone === "positive" ? "Palavras nas reviews positivas" : "Palavras nas reviews negativas"}>
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
      </Refreshable>

      <Refreshable scopes={["sync","period"]}>
  <Section id="themes" info={infoTexts.themes} title="Temas mais falados" lead="Avaliação média das reviews que mencionam cada tema. Toque num tema para ler o que os clientes escreveram.">
          <Card>
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
                        {(() => {
                          const services = themeServices(theme, business.activeServices);
                          return services.length ? <ThemeServiceCards items={services} theme={themeLabels[theme.id]} /> : null;
                        })()}
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
        </Section>
      </Refreshable>

      {hasPlates ? (
      <Refreshable scopes={["sync"]}>
  <Section id="before-after" info={infoTexts.beforeAfter} title="Antes e depois das placas" lead="Compara o tempo desde a instalação com igual período anterior (independente do filtro).">
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
      </Refreshable>
      ) : null}

      {showEvolutionSection ? (
      <Section id="evolution" title="Evolução" lead={`Reviews e avaliação por ${granularityLabel} no período escolhido.`}>
        <div className="grid gap-4 lg:grid-cols-2">
          <Card title={`Reviews por ${granularityLabel}`} subtitle={marker ? "A linha marca a instalação das placas." : undefined} className="lg:col-span-2">
            <div className="pt-6">
              <ColumnChart data={reviewColumns} seriesLabel="reviews" marker={marker} />
            </div>
            <DataTable
              caption={`Reviews por ${granularityLabel}`}
              headers={["Período", "Reviews", "Avaliação média"]}
              rows={series.map((bucket) => [longLabel(bucket.key), bucket.reviews, formatRating(bucket.avgRating)])}
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
        </div>
      </Section>
      ) : null}

      <Refreshable scopes={["sync","period"]}>
  {suggestions.length ? (
          <Section id="recommended" info={infoTexts.recommendations} title="Recomendado para o seu negócio" lead={hasPlates ? "Sugestões a partir do que as suas reviews e placas mostram." : "Sugestões a partir do que as suas reviews mostram."}>
            <RecommendationCards items={suggestions} />
          </Section>
        ) : null}
      </Refreshable>

      <Section
        id="reviews"
        title="Reviews"
        lead={kpis.reviews.current ? undefined : "Sem reviews neste período."}
      >
        {kpis.reviews.current ? (
          <div className="card flex flex-col gap-3 p-4 sm:p-5">
            <div className="flex items-baseline justify-between gap-3">
              <p className="flex items-center gap-1.5 font-semibold text-text">
                Reviews respondidas
                <InfoTip label="Reviews respondidas">{infoTexts.replies}</InfoTip>
              </p>
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
                <PendingLink scope="reviews" href={href({ unanswered: true, limit: reviewsPageSize }, "#reviews")} scroll={false} className="inline-flex min-h-10 items-center font-semibold text-accent-text hover:underline">
                  Ver as que faltam →
                </PendingLink>
              ) : null}
            </div>
          </div>
        ) : null}
        {pitch ? <AiReviewsPromo pitch={pitch} businessName={business.name} /> : null}
        <div className="flex flex-col gap-3">
          <nav aria-label="Filtrar reviews" className="flex flex-wrap gap-1.5">
            {(Object.keys(starFilterLabels) as ReviewStarFilter[]).map((stars) => (
              <PendingLink scope="reviews"
                key={stars}
                href={href({ stars, limit: reviewsPageSize }, "#reviews")}
                scroll={false}
                aria-current={query.filters.stars === stars ? "true" : undefined}
                className={`inline-flex h-10 shrink-0 items-center rounded-full px-4 text-sm font-semibold transition-colors ${
                  query.filters.stars === stars ? "bg-surface-inverse text-inverse" : "border border-line bg-surface text-muted hover:text-text"
                }`}
              >
                {starFilterLabels[stars]}
              </PendingLink>
            ))}
            <PendingLink scope="reviews"
              href={href({ unanswered: !query.filters.unanswered, limit: reviewsPageSize }, "#reviews")}
              scroll={false}
              aria-pressed={query.filters.unanswered}
              className={`inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full px-4 text-sm font-semibold transition-colors ${
                query.filters.unanswered ? "bg-accent text-accent-contrast" : "border border-line bg-surface text-muted hover:text-text"
              }`}
            >
              {query.filters.unanswered ? <Check size={14} /> : null}
              Sem resposta ({formatInt(analytics.unansweredCount)})
            </PendingLink>
          </nav>
          {query.filters.theme ? (
            <PendingLink scope="reviews"
              href={href({ theme: null, limit: reviewsPageSize }, "#reviews")}
              scroll={false}
              className="inline-flex h-9 items-center gap-1.5 self-start rounded-full bg-accent-soft px-3.5 text-sm font-semibold text-accent-text"
            >
              Tema: {themeLabels[query.filters.theme]}
              <CloseIcon size={14} />
              <span className="sr-only">(remover filtro)</span>
            </PendingLink>
          ) : null}
          <p className="text-sm text-subtle" role="status">
            {plural(filtered.length, "review", "reviews")}
            {filterActive ? " com estes filtros" : ""}, das mais recentes para as mais antigas.
          </p>
        </div>

        <Refreshable scopes={["sync", "period", "reviews"]}>
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
                    href={googleReviewUrl(review.id, business.googleFid) ?? business.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex min-h-10 items-center gap-1.5 self-start text-sm font-semibold text-accent-text hover:underline"
                  >
                    Sem resposta · responder no Google <ArrowUpRight size={15} />
                    <span className="sr-only">(abre esta review no Google Maps)</span>
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
          <PendingLink scope="reviews"
            href={href({ limit: query.limit + reviewsPageSize })}
            scroll={false}
            className="inline-flex h-12 items-center justify-center self-center rounded-full border border-line-strong bg-surface px-6 text-sm font-semibold text-text hover:bg-surface-2"
          >
            Ver mais reviews ({formatInt(filtered.length - visible.length)} restantes)
          </PendingLink>
        ) : null}
        </Refreshable>
      </Section>
    </div>
    </DashboardBusyProvider>
  );
}

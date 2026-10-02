import { isNegative, type DashboardAnalytics } from "./analytics.ts";
import { normalize } from "./text.ts";
import type { DashboardSource, GoogleReview } from "./types.ts";

/** Product ids from the Steevanz catalogue that the dashboard can recommend. */
export type RecommendedProduct = "ai-reviews" | "waitlist" | "ai-voice" | "bookings" | "nfc-google-reviews" | "loyalty";

export interface Recommendation {
  productId: RecommendedProduct;
  /** The data point that triggered it, shown so the suggestion never feels random. */
  signal: string;
  title: string;
  body: string;
}

export interface AiReviewsPitch {
  unanswered: number;
  negativeUnanswered: number;
  replyRate: number | null;
  medianReplyHours: number | null;
}

const phonePattern = /\b(telefon\w*|ligu\w*|ligar|liguei|chamadas?|nao atend\w*|ninguem atend\w*|phone|call\w*)\b/;
const bookingPattern = /\b(reserv\w*|marca[cç]\w*|marcar|booking|book\w*)\b/;

function negativeMentions(reviews: GoogleReview[], pattern: RegExp): number {
  return reviews.filter((review) => isNegative(review.rating) && review.text && pattern.test(normalize(review.text))).length;
}

const format1 = (value: number) => value.toFixed(1).replace(".", ",");

/**
 * The AI review management pitch is shown when replies are visibly lagging: reviews left
 * unanswered (above all negative ones), a low reply rate or slow replies.
 */
export function aiReviewsPitch(source: DashboardSource, analytics: DashboardAnalytics, periodReviews: GoogleReview[]): AiReviewsPitch | null {
  if (source.business.activeServices?.includes("ai-reviews")) return null;
  const unanswered = periodReviews.filter((review) => !review.ownerReply?.trim());
  const negativeUnanswered = unanswered.filter((review) => isNegative(review.rating)).length;
  const { replyRate, medianReplyHours } = analytics.kpis;
  const lagging =
    unanswered.length >= 3 || negativeUnanswered > 0 || (replyRate.current !== null && replyRate.current < 0.9) || (medianReplyHours ?? 0) > 48;
  if (!lagging || !periodReviews.length) return null;
  return { unanswered: unanswered.length, negativeUnanswered, replyRate: replyRate.current, medianReplyHours };
}

/** Complementary products, each backed by something the reviews or taps actually show. */
export function recommendations(source: DashboardSource, analytics: DashboardAnalytics, periodReviews: GoogleReview[]): Recommendation[] {
  const owned = new Set(source.business.activeServices ?? []);
  const items: Recommendation[] = [];
  const waiting = analytics.themes.find((theme) => theme.id === "waiting");

  if (waiting && waiting.mentions >= 3 && (waiting.verdict === "improve" || waiting.negativeShare >= 0.25) && !owned.has("waitlist")) {
    items.push({
      productId: "waitlist",
      signal: `Tempo de espera · ${format1(waiting.avgRating ?? 0)}★ em ${waiting.mentions} reviews`,
      title: "Os clientes queixam-se da espera",
      body: "Com a Lista de espera digital entram na fila por QR code ou NFC, veem o tempo estimado e são avisados por SMS ou WhatsApp quando é a vez deles. Esperam onde quiserem, sem aglomerações à porta.",
    });
  }

  const phoneComplaints = negativeMentions(periodReviews, phonePattern);
  if (phoneComplaints >= 2 && !owned.has("ai-voice")) {
    items.push({
      productId: "ai-voice",
      signal: `${phoneComplaints} reviews falam do telefone`,
      title: "Há clientes que não conseguem ligar",
      body: "A Receção por voz com IA atende o telefone 24 horas, responde às perguntas frequentes, faz reservas e passa as chamadas urgentes à sua equipa.",
    });
  }

  const bookingComplaints = negativeMentions(periodReviews, bookingPattern);
  if (bookingComplaints >= 2 && !owned.has("bookings")) {
    items.push({
      productId: "bookings",
      signal: `${bookingComplaints} reviews com problemas em reservas`,
      title: "Reservas que correm mal custam estrelas",
      body: "O Sistema de reservas online aceita reservas a qualquer hora, envia lembretes por SMS, WhatsApp ou email e evita reservas perdidas ao telefone.",
    });
  }

  const goal = analytics.ratingGoal;
  const reliablePlates = analytics.plates.filter((plate) => plate.enoughData && plate.conversion !== null);
  const competition = source.competition;
  const ownPace = competition?.entries.find((entry) => entry.isSelf)?.pacePerMonth ?? null;
  if (competition?.paceLeader && ownPace !== null && competition.paceLeader.pacePerMonth >= Math.max(ownPace * 1.2, ownPace + 2)) {
    // Losing ground to a named neighbour is the strongest argument, so it goes first.
    items.unshift({
      productId: "nfc-google-reviews",
      signal: `${competition.paceLeader.name}: ${Math.round(competition.paceLeader.pacePerMonth)} reviews/mês · o seu: ${Math.round(ownPace)}`,
      title: "A concorrência está a receber mais reviews",
      body: "Quem recebe mais reviews aparece mais nas pesquisas do Google. Placas NFC nas mesas, no balcão e à saída pedem a review no melhor momento, com um toque, para não ficar para trás.",
    });
  } else if (goal?.monthsToNext !== null && goal?.monthsToNext !== undefined && goal.monthsToNext > 4 && goal.next !== null) {
    const best = [...reliablePlates].sort((a, b) => b.conversion! - a.conversion!)[0];
    items.push({
      productId: "nfc-google-reviews",
      signal: `${goal.fiveStarsNeeded} reviews de 5★ até aos ${format1(goal.next)}★`,
      title: "Chegar mais depressa à próxima estrela",
      body: best
        ? `Ao ritmo atual faltam cerca de ${Math.ceil(goal.monthsToNext)} meses. A placa «${best.label}» já converte ${Math.round(best.conversion! * 100)}% dos toques: mais placas nos sítios certos (mesas, balcão, saída) trazem mais reviews por mês.`
        : `Ao ritmo atual faltam cerca de ${Math.ceil(goal.monthsToNext)} meses. Placas NFC nas mesas e no balcão pedem a review no melhor momento, com um toque.`,
    });
  }

  const total = analytics.kpis.reviews.current ?? 0;
  if (total >= 15 && analytics.sentiment.positive / total >= 0.85 && !owned.has("loyalty")) {
    items.push({
      productId: "loyalty",
      signal: `${Math.round((analytics.sentiment.positive / total) * 100)}% das reviews são positivas`,
      title: "Os clientes gostam de si. Faça-os voltar",
      body: "Com o Cartão de fidelização digital, cada visita é carimbada por NFC ou QR code no telemóvel do cliente, sem app, com recompensas automáticas.",
    });
  }

  return items.slice(0, 3);
}

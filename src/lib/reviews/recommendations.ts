import { isNegative, type DashboardAnalytics, type ThemeStats } from "./analytics.ts";
import { normalize, type ThemeId } from "./text.ts";
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

// --- Services inside "Temas mais falados" -----------------------------------------------------------

export type ThemeServiceProduct = "waitlist" | "bookings" | "ai-reviews" | "ai-chatbot" | "loyalty";

export interface ThemeService {
  productId: ThemeServiceProduct;
  /** How this service tackles the complaint of this theme (one sentence). */
  body: string;
}

/** At most this many services per theme. */
export const themeServicesLimit = 2;

const replyBody = {
  service: "Responder a cada queixa sobre o atendimento, com calma e no seu tom, mostra a quem lê que o problema foi ouvido e traz o cliente de volta.",
  quality: "Uma resposta cuidada a cada queixa sobre a qualidade mostra que leva o assunto a sério, antes que outros clientes tirem conclusões.",
  price: "Explicar o que está incluído e agradecer a crítica sobre o preço evita que a review fique sem resposta à vista de todos.",
  cleanliness: "Responder às queixas de limpeza depressa, a dizer o que mudou, tranquiliza quem está a decidir se vem.",
  ambience: "Responder a quem não gostou do ambiente (ruído, temperatura, espaço) mostra que ouve e que está a melhorar.",
  location: "Responder a quem se perdeu ou não encontrou estacionamento, com as indicações certas, ajuda os próximos clientes.",
} as const;

/**
 * Services shown inside a theme of "Temas mais falados" once it is opened, only when the theme shows a
 * problem (same rule as the waitlist suggestion: at least 3 mentions and "A melhorar" or 25%+ negative),
 * at most 2, the best fit first, never one the customer already has.
 */
export function themeServices(theme: Pick<ThemeStats, "id" | "mentions" | "verdict" | "negativeShare">, owned: readonly string[] = []): ThemeService[] {
  if (theme.mentions < 3 || (theme.verdict !== "improve" && theme.negativeShare < 0.25)) return [];
  const reply = (id: Exclude<ThemeId, "waiting">): ThemeService => ({ productId: "ai-reviews", body: replyBody[id] });
  const byTheme: Record<ThemeId, ThemeService[]> = {
    waiting: [
      { productId: "waitlist", body: "Os clientes entram na fila por QR code ou NFC, veem o tempo estimado e são avisados por SMS ou WhatsApp. Esperam onde quiserem, sem fila à porta." },
      { productId: "bookings", body: "Com reservas online a qualquer hora e lembretes automáticos, sabe quem vem e quando, e há menos gente à espera de mesa." },
    ],
    service: [
      reply("service"),
      { productId: "ai-chatbot", body: "O chatbot responde logo, 24 horas, às perguntas do site e do WhatsApp, e a equipa fica livre para quem está no balcão." },
    ],
    price: [
      { productId: "loyalty", body: "O cartão de fidelização dá a quem volta uma recompensa automática, e o preço passa a valer mais para os clientes habituais." },
      reply("price"),
    ],
    quality: [reply("quality")],
    cleanliness: [reply("cleanliness")],
    ambience: [reply("ambience")],
    location: [
      { productId: "ai-chatbot", body: "O chatbot explica como chegar, onde estacionar e o horário, a qualquer hora, no site e no WhatsApp." },
      reply("location"),
    ],
  };
  return byTheme[theme.id].filter((service) => !owned.includes(service.productId)).slice(0, themeServicesLimit);
}

/** Complementary products, each backed by something the reviews or competitors actually show. */
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
    items.push({
      productId: "nfc-google-reviews",
      signal: `${goal.fiveStarsNeeded} reviews de 5★ até aos ${format1(goal.next)}★`,
      title: "Chegar mais depressa à próxima estrela",
      body: `Ao ritmo atual faltam cerca de ${Math.ceil(goal.monthsToNext)} meses. Placas NFC nas mesas, no balcão e à saída pedem a review no melhor momento, com um toque.`,
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

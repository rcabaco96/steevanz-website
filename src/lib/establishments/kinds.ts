// Business kinds and the words each one uses. Pure module (no imports): also used by the tests.

export const businessKinds = ["restaurant", "salon", "clinic", "retail"] as const;
export type BusinessKind = (typeof businessKinds)[number];

export function isBusinessKind(value: string): value is BusinessKind {
  return (businessKinds as readonly string[]).includes(value);
}

const kindHints: [BusinessKind, RegExp][] = [
  ["salon", /barb|cabele|sal[aã]o|salon|est[eé]tica|beauty|hair|nail|unha|spa|massag|tattoo|tatua/],
  ["clinic", /cl[ií]nic|clinic|dent|m[eé]dic|medic|fisio|physio|veterin|consult|sa[uú]de|health|psic|optic|[oó]tic/],
  ["restaurant", /restaur|caf[eé]|bar|pastel|padaria|bakery|pizz|marisq|seafood|tasca|snack|cervej|brew|food|grill|sushi|churrasq|tapas|hamb[uú]rg|burger|gelat|tea|ch[aá]/],
  ["retail", /loja|store|shop|boutique|mercad|market|livraria|florist|farm[aá]c|pharmac/],
];

/** The kind that fits a Google category ("Restaurante de marisco", "Barber shop"); restaurant if unsure. */
export function kindFromCategory(category: string | null | undefined): BusinessKind {
  const text = (category ?? "").toLowerCase();
  return kindHints.find(([, pattern]) => pattern.test(text))?.[0] ?? "restaurant";
}

export const kindLabels: Record<BusinessKind, string> = {
  restaurant: "Restaurante, café ou bar",
  salon: "Barbeiro, cabeleireiro ou estética",
  clinic: "Clínica ou consultório",
  retail: "Loja ou serviço ao balcão",
};

export interface KindWords {
  /** "a sua mesa está pronta" / "é a sua vez". */
  ready: string;
  /** Short call shown on the call screen and in the panel. */
  callAction: string;
  /** What the queue is for, on the join page. */
  joinTitle: string;
  /** Booking page title. */
  bookingTitle: string;
  /** Example reward for a new loyalty program. */
  rewardExample: string;
}

export const kindWords: Record<BusinessKind, KindWords> = {
  restaurant: {
    ready: "A sua mesa está pronta. Dirija-se à entrada.",
    callAction: "Mesa pronta",
    joinTitle: "Entrar na lista de espera",
    bookingTitle: "Reservar mesa",
    rewardExample: "Um café oferecido",
  },
  salon: {
    ready: "É a sua vez. Dirija-se à receção.",
    callAction: "É a sua vez",
    joinTitle: "Entrar na fila",
    bookingTitle: "Marcar serviço",
    rewardExample: "Um corte oferecido",
  },
  clinic: {
    ready: "É a sua vez. Dirija-se à receção.",
    callAction: "É a sua vez",
    joinTitle: "Tirar senha",
    bookingTitle: "Marcar consulta",
    rewardExample: "Uma oferta da casa",
  },
  retail: {
    ready: "É a sua vez. Dirija-se ao balcão.",
    callAction: "É a sua vez",
    joinTitle: "Entrar na fila",
    bookingTitle: "Marcar atendimento",
    rewardExample: "Uma oferta da casa",
  },
};

/** Sensible starting settings per kind (all can be changed afterwards). */
export const kindDefaults: Record<
  BusinessKind,
  { waitlist: { askParty: boolean; askService: boolean; askStaff: boolean; avgMinutes: number }; bookingMode: "table" | "service" }
> = {
  restaurant: { waitlist: { askParty: true, askService: false, askStaff: false, avgMinutes: 15 }, bookingMode: "table" },
  salon: { waitlist: { askParty: false, askService: true, askStaff: true, avgMinutes: 30 }, bookingMode: "service" },
  clinic: { waitlist: { askParty: false, askService: true, askStaff: false, avgMinutes: 20 }, bookingMode: "service" },
  retail: { waitlist: { askParty: false, askService: false, askStaff: false, avgMinutes: 5 }, bookingMode: "service" },
};

/** "Café Central" → "cafe-central" (letters, numbers and hyphens, at most 60 characters). */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/g, "");
}

function channel(value: number): number {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

/** Relative luminance of a #rrggbb colour (WCAG). */
export function luminance(hex: string): number {
  const value = /^#([0-9a-f]{6})$/i.exec(hex)?.[1];
  if (!value) return 0;
  const [r, g, b] = [0, 2, 4].map((i) => Number.parseInt(value.slice(i, i + 2), 16));
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** White or near-black text, whichever reads better on the brand colour. */
export function readableTextOn(hex: string): "#ffffff" | "#1d1220" {
  const l = luminance(hex);
  const onWhite = 1.05 / (l + 0.05);
  const onDark = (l + 0.05) / (luminance("#1d1220") + 0.05);
  return onWhite >= onDark ? "#ffffff" : "#1d1220";
}

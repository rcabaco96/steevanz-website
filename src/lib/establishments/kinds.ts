// Business kinds and the words each one uses. Pure module (no imports): also used by the tests.
// A new kind of business = one value in the database enum (business_kind) plus its entry in each
// record below (label, words, waitlist defaults) and, for bookings, its starting services
// (src/lib/modules/bookings/templates.ts) and hours (provision.ts).

export const businessKinds = ["restaurant", "barbershop", "salon", "clinic", "sports", "retail"] as const;
export type BusinessKind = (typeof businessKinds)[number];

export function isBusinessKind(value: string): value is BusinessKind {
  return (businessKinds as readonly string[]).includes(value);
}

const kindHints: [BusinessKind, RegExp][] = [
  ["barbershop", /barb/],
  ["salon", /cabele|sal[aã]o|salon|est[eé]tica|beauty|hair|nail|unha|spa|massag|tattoo|tatua/],
  ["sports", /desport|sport|padel|futebol|football|soccer|t[eé]nis|tennis|basket|gin[aá]sio|gym|fitness|pavilh/],
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
  barbershop: "Barbearia",
  salon: "Cabeleireiro ou estética",
  clinic: "Clínica ou consultório",
  sports: "Espaço desportivo",
  retail: "Loja ou outro serviço",
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
  barbershop: {
    ready: "É a sua vez. Dirija-se à cadeira.",
    callAction: "É a sua vez",
    joinTitle: "Entrar na fila",
    bookingTitle: "Marcar corte",
    rewardExample: "Um corte oferecido",
  },
  salon: {
    ready: "É a sua vez. Dirija-se à receção.",
    callAction: "É a sua vez",
    joinTitle: "Entrar na fila",
    bookingTitle: "Marcar serviço",
    rewardExample: "Um serviço oferecido",
  },
  clinic: {
    ready: "É a sua vez. Dirija-se à receção.",
    callAction: "É a sua vez",
    joinTitle: "Tirar senha",
    bookingTitle: "Marcar consulta",
    rewardExample: "Uma oferta da casa",
  },
  sports: {
    ready: "É a sua vez. Dirija-se à receção.",
    callAction: "É a sua vez",
    joinTitle: "Entrar na fila",
    bookingTitle: "Reservar campo",
    rewardExample: "Uma hora de campo oferecida",
  },
  retail: {
    ready: "É a sua vez. Dirija-se ao balcão.",
    callAction: "É a sua vez",
    joinTitle: "Entrar na fila",
    bookingTitle: "Reservar",
    rewardExample: "Uma oferta da casa",
  },
};

/** Sensible starting settings per kind (all can be changed afterwards). */
export const kindDefaults: Record<
  BusinessKind,
  { waitlist: { askParty: boolean; askService: boolean; askStaff: boolean; avgMinutes: number } }
> = {
  restaurant: { waitlist: { askParty: true, askService: false, askStaff: false, avgMinutes: 15 } },
  barbershop: { waitlist: { askParty: false, askService: true, askStaff: true, avgMinutes: 30 } },
  salon: { waitlist: { askParty: false, askService: true, askStaff: true, avgMinutes: 30 } },
  clinic: { waitlist: { askParty: false, askService: true, askStaff: false, avgMinutes: 20 } },
  sports: { waitlist: { askParty: false, askService: false, askStaff: false, avgMinutes: 15 } },
  retail: { waitlist: { askParty: false, askService: false, askStaff: false, avgMinutes: 5 } },
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

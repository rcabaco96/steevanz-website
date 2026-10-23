// The prospecting CRM's rules (admin › Contactos › CRM). Pure module: used by the admin (server and
// browser), the prospector and the tests.

export const stages = ["new", "contacted", "interested", "meeting", "proposal", "customer", "lost"] as const;
export type Stage = (typeof stages)[number];

export const stageLabels: Record<Stage, string> = {
  new: "Por contactar",
  contacted: "Contactado",
  interested: "Interessado",
  meeting: "Reunião marcada",
  proposal: "Proposta enviada",
  customer: "Cliente",
  lost: "Sem interesse",
};

/** Stages where the conversation is over: no next contact, shown faded. */
export const closedStages: ReadonlySet<Stage> = new Set(["customer", "lost"]);

export function isStage(value: string): value is Stage {
  return (stages as readonly string[]).includes(value);
}

export const siteStatuses = ["none", "down", "ai", "outdated", "ok"] as const;
export type SiteStatus = (typeof siteStatuses)[number];

export const siteStatusLabels: Record<SiteStatus, string> = {
  none: "Sem site próprio",
  down: "Site em baixo ou partido",
  ai: "Parece feito com IA",
  outdated: "Site desatualizado",
  ok: "Site em ordem",
};

export function isSiteStatus(value: string): value is SiteStatus {
  return (siteStatuses as readonly string[]).includes(value);
}

/** Who to call first: broken sites, then AI-made, out of date, no site, fine, not checked yet. */
const siteOrder: Record<SiteStatus | "unchecked", number> = { down: 0, ai: 1, outdated: 2, none: 3, ok: 4, unchecked: 5 };

// ---------- dates (Lisbon calendar days, "yyyy-mm-dd") ----------

const lisbonDay = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Lisbon", year: "numeric", month: "2-digit", day: "2-digit" });

/** Today's date in Lisbon. */
export function lisbonToday(now: Date = new Date()): string {
  return lisbonDay.format(now);
}

export function addDays(date: string, days: number): string {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day + days)).toISOString().slice(0, 10);
}

export function isDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return parsed.getUTCFullYear() === year && parsed.getUTCMonth() === month - 1 && parsed.getUTCDate() === day && year >= 2020 && year <= 2100;
}

const weekdayShort = ["Dom.", "Seg.", "Ter.", "Qua.", "Qui.", "Sex.", "Sáb."];
const monthShort = ["jan.", "fev.", "mar.", "abr.", "mai.", "jun.", "jul.", "ago.", "set.", "out.", "nov.", "dez."];

/** «Hoje», «Amanhã», «Ontem» or «Seg., 27 out.» (with the year when it is another year). */
export function niceDate(date: string, today: string): string {
  if (date === today) return "Hoje";
  if (date === addDays(today, 1)) return "Amanhã";
  if (date === addDays(today, -1)) return "Ontem";
  const [year, month, day] = date.split("-").map(Number);
  const weekday = weekdayShort[new Date(Date.UTC(year, month - 1, day)).getUTCDay()];
  return `${weekday}, ${day} ${monthShort[month - 1]}${year !== Number(today.slice(0, 4)) ? ` ${year}` : ""}`;
}

/** «agora», «há 5 min», «há 3 h», «ontem», «há 4 dias». */
export function ago(iso: string, now: Date = new Date()): string {
  const minutes = Math.round((now.getTime() - Date.parse(iso)) / 60_000);
  if (minutes < 1) return "agora";
  if (minutes < 60) return `há ${minutes} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `há ${hours} h`;
  const days = Math.round(hours / 24);
  return days === 1 ? "ontem" : `há ${days} dias`;
}

// ---------- the pipeline ----------

export interface CrmState {
  status: Stage;
  next_contact: string | null;
  attempts: number;
}

/** To call today: the next contact day has come and the conversation is not over. */
export function isDue(prospect: Pick<CrmState, "status" | "next_contact">, today: string): boolean {
  return Boolean(prospect.next_contact && prospect.next_contact <= today && !closedStages.has(prospect.status));
}

/** What changes with a new stage: «Contactado» brings a next contact in 3 days (if there is none); closing clears it. */
export function stageChange(current: Pick<CrmState, "next_contact">, stage: Stage, today: string): Pick<CrmState, "status" | "next_contact"> {
  if (closedStages.has(stage)) return { status: stage, next_contact: null };
  if (stage === "contacted" && !current.next_contact) return { status: stage, next_contact: addDays(today, 3) };
  return { status: stage, next_contact: current.next_contact };
}

/** «Não atendeu»: one more attempt and call again tomorrow. */
export function noAnswer(current: Pick<CrmState, "attempts">, today: string): Pick<CrmState, "attempts" | "next_contact"> {
  return { attempts: Math.min(999, (current.attempts || 0) + 1), next_contact: addDays(today, 1) };
}

/** The «Voltar a contactar» shortcuts. */
export const nextContactPresets: { label: string; days: number }[] = [
  { label: "Hoje", days: 0 },
  { label: "Amanhã", days: 1 },
  { label: "Daqui a 3 dias", days: 3 },
  { label: "Daqui a 1 semana", days: 7 },
  { label: "Daqui a 2 semanas", days: 14 },
  { label: "Daqui a 1 mês", days: 30 },
];

export const sortLabels = { prio: "Prioridade", next: "Próximo contacto", reviews: "Mais reviews", fewest: "Menos reviews", recent: "Mexidos há pouco" } as const;
export type CrmSort = keyof typeof sortLabels;

export interface SortableProspect extends CrmState {
  reviews: number | null;
  site_status: SiteStatus | null;
  worked_at: string | null;
}

export function compareProspects(sort: CrmSort, today: string): (a: SortableProspect, b: SortableProspect) => number {
  const reviews = (row: SortableProspect) => row.reviews ?? 0;
  switch (sort) {
    case "next":
      return (a, b) => (a.next_contact ?? "9999").localeCompare(b.next_contact ?? "9999") || reviews(b) - reviews(a);
    case "reviews":
      return (a, b) => reviews(b) - reviews(a);
    case "fewest":
      return (a, b) => reviews(a) - reviews(b);
    case "recent":
      return (a, b) => (b.worked_at ?? "").localeCompare(a.worked_at ?? "") || reviews(b) - reviews(a);
    default:
      return (a, b) =>
        Number(isDue(b, today)) - Number(isDue(a, today)) ||
        Number(closedStages.has(a.status)) - Number(closedStages.has(b.status)) ||
        siteOrder[a.site_status ?? "unchecked"] - siteOrder[b.site_status ?? "unchecked"] ||
        reviews(b) - reviews(a);
  }
}

// ---------- kinds of business ----------

const sectorRules: [string, RegExp][] = [
  ["Barbearias", /barbe/i],
  ["Cabeleireiros", /cabeleir|hair/i],
  ["Restauração", /restaurante|restaurant|marisqueira|churrasq|churrasc|piz+aria|hamburg|sandu[ií]ch|tasca|comida|kebab|sushi|tapas|grill|steak/i],
  ["Cafés e pastelarias", /caf[eé]|pastelaria|confeitaria|padaria|gelad|espresso|cafetaria|bakery|ice cream/i],
  ["Bares", /\bbar\b|pub\b|discoteca|cocktail/i],
  ["Estética e beleza", /beleza|est[eé]tic|unhas|nail|\bspa\b|massag|tatua|piercing|sobrancelh|c[ií]lios|depila|tosquia|beauty|maquilh/i],
  ["Saúde e bem-estar", /cl[ií]nica|sa[uú]de|dentist|dental|fisioter|bem-estar|quiropr|m[eé]dic|farm[aá]cia|[oó]tica|psic[oó]log|veterin|osteopat|nutri/i],
  ["Imobiliárias", /imobili|propriedades|empreiteir|constru[cç][aã]o civil|construtor|casas de f[eé]rias/i],
  ["Alojamento", /hotel|alojamento|apartament|hostel|guest ?house|h[oó]spedes|turismo rural|condom[ií]nio|resort|\bvilla/i],
  ["Atividades e turismo", /barco|tur[ií]stic|passeio|\btours?\b|surf|mergulh|kayak|caiaque|aventura|golfe?|padel|t[eé]nis|gin[aá]sio|desport|fitness|yoga|pilates/i],
  ["Lojas", /loja|supermercado|mercearia|florista|joalharia|relojoaria|antiqu[aá]rio|boutique|lavandaria|store|shop/i],
];

/** The CRM's kind of business, from the Google category (when none was stored). */
export function sectorOf(category: string | null): string {
  if (!category) return "Outros";
  return sectorRules.find(([, pattern]) => pattern.test(category))?.[0] ?? "Outros";
}

// ---------- phone, WhatsApp and contact cards ----------

/** Digits for wa.me, only for numbers that can have WhatsApp: Portuguese mobiles (9…) or foreign numbers. */
export function whatsappNumber(phone: string | null): string | null {
  if (!phone) return null;
  let digits = phone.replace(/\D/g, "");
  if (phone.trim().startsWith("00")) digits = digits.slice(2);
  if (digits.length === 9 && /^[239]/.test(digits)) digits = `351${digits}`;
  if (digits.startsWith("351")) return /^3519\d{8}$/.test(digits) ? digits : null;
  return phone.trim().startsWith("+") || phone.trim().startsWith("00") ? (digits.length >= 8 && digits.length <= 15 ? digits : null) : null;
}

export interface WhatsAppSettings {
  whatsapp_template: string;
  whatsapp_none: string;
  whatsapp_down: string;
  whatsapp_ai: string;
  whatsapp_outdated: string;
  whatsapp_other: string;
}

/** The message, with {negocio} and {situacao} filled in (the sentence for the website's label). */
export function whatsappMessage(settings: WhatsAppSettings, prospect: { name: string; site_status: SiteStatus | null }): string {
  const sentences: Record<SiteStatus, string> = { none: settings.whatsapp_none, down: settings.whatsapp_down, ai: settings.whatsapp_ai, outdated: settings.whatsapp_outdated, ok: settings.whatsapp_other };
  const fill = (text: string) => text.replace(/\{negocio\}/g, prospect.name);
  const situation = fill(prospect.site_status ? sentences[prospect.site_status] : settings.whatsapp_other);
  return fill(settings.whatsapp_template.replace(/\{situacao\}/g, situation))
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

export function whatsappLink(phone: string | null, message: string): string | null {
  const number = whatsappNumber(phone);
  return number ? `https://wa.me/${number}${message ? `?text=${encodeURIComponent(message)}` : ""}` : null;
}

/** How the business is saved on the phone: easy to find all together, and clear in WhatsApp. */
export const contactSuffix = " · Lead Steevanz";

export interface ContactCardFields {
  name: string;
  phone: string | null;
  email: string | null;
  other_emails: string[];
  website: string | null;
  address: string | null;
  maps_url: string | null;
  category: string | null;
}

const vcardText = (value: string) => value.replace(/\\/g, "\\\\").replace(/\r?\n/g, "\\n").replace(/([,;])/g, "\\$1");

/** One business as a vCard 3.0 (opens «Novo contacto» on the phone). */
export function vcard(prospect: ContactCardFields): string {
  const name = `${prospect.name}${contactSuffix}`;
  const lines = ["BEGIN:VCARD", "VERSION:3.0", `N:${vcardText(name)};;;;`, `FN:${vcardText(name)}`, `ORG:${vcardText(prospect.name)}`];
  if (prospect.phone) {
    const mobile = whatsappNumber(prospect.phone) !== null;
    lines.push(`TEL;TYPE=${mobile ? "CELL" : "WORK,VOICE"}:${prospect.phone.replace(/[^\d+]/g, "")}`);
  }
  for (const email of [prospect.email, ...prospect.other_emails].filter(Boolean)) lines.push(`EMAIL;TYPE=INTERNET,WORK:${vcardText(email as string)}`);
  if (prospect.address) lines.push(`ADR;TYPE=WORK:;;${vcardText(prospect.address)};;;;`);
  if (prospect.website) lines.push(`URL:${vcardText(prospect.website)}`);
  const note = [prospect.category, prospect.maps_url ? `Google Maps: ${prospect.maps_url}` : null].filter(Boolean).join("\n");
  if (note) lines.push(`NOTE:${vcardText(note)}`);
  lines.push("CATEGORIES:Lead Steevanz", "END:VCARD");
  return lines.join("\r\n");
}

export function vcards(prospects: ContactCardFields[]): string {
  return `${prospects.map(vcard).join("\r\n")}\r\n`;
}

// ---------- copy to a spreadsheet ----------

export interface ExportRow extends ContactCardFields, CrmState {
  sector: string;
  site_status: SiteStatus | null;
  site_reasons: string[];
  rating: number | null;
  reviews: number | null;
  notes: string | null;
}

/** Tab-separated, ready to paste into Excel or Google Sheets. */
export function spreadsheet(rows: ExportRow[]): string {
  const head = ["Negócio", "Categoria", "Setor", "Situação", "Porquê", "Telefone", "Email", "Site / rede social", "Morada", "Nota Google", "Reviews", "Google Maps", "Fase", "Voltar a contactar", "Tentativas", "Notas"];
  const clean = (value: unknown) => String(value ?? "").replace(/[\t\n\r]+/g, " ");
  const lines = rows.map((row) =>
    [
      row.name,
      row.category,
      row.sector,
      row.site_status ? siteStatusLabels[row.site_status] : "Por verificar",
      row.site_reasons.join("; "),
      row.phone,
      [row.email, ...row.other_emails].filter(Boolean).join(", "),
      row.website,
      row.address,
      row.rating !== null && row.reviews ? String(row.rating).replace(".", ",") : "",
      row.reviews ?? "",
      row.maps_url,
      stageLabels[row.status],
      row.next_contact ? row.next_contact.split("-").reverse().join("/") : "",
      row.attempts || "",
      row.notes,
    ]
      .map(clean)
      .join("\t"),
  );
  return [head.join("\t"), ...lines].join("\n");
}

// ---------- lists (zones) ----------

/** A list is the «Onde» of its searches: «Armação de Pêra» and «armação de pêra » are the same list. */
export function listKey(area: string): string {
  return area.trim().replace(/\s+/g, " ").toLocaleLowerCase("pt");
}

/** Who did it: «eu» for the admin looking, otherwise the start of their email. */
export function actorName(actor: string | null, me: string): string {
  if (!actor) return "";
  if (actor.toLowerCase() === me.toLowerCase()) return "eu";
  return actor.split("@")[0];
}

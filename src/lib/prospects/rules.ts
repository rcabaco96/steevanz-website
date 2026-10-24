// Prospecting rules. Pure module: used by the prospector script, the admin and the tests. The CRM's
// stages and the rest of the pipeline are in crm.ts.

/** What a business could buy from us, from what Google shows about it. */
export type Opportunity = "site" | "modules";

/** As the filter names them: our products, and «no site of its own» (a sign, not something we sell). */
export const opportunityLabels: Record<Opportunity, string> = {
  modules: "Reservas Online, Lista de Espera ou Cartão",
  site: "Sem site próprio",
};

const moduleCategories = /restaurante|restaurant|café|cafe|bar\b|pastelaria|padaria|tasca|pizzaria|marisqueira|churrasqueira|barbearia|barbeir|barber|cabeleireiro|hair|salão|salao|estética|estetica|beauty|unhas|nail|spa|clínica|clinica|dentista|dental|fisioterapia|consultório|consultorio|padel|ténis|tenis|futebol|ginásio|ginasio|campo/i;

/** Links that are not a site of their own: social networks, directories, app stores, link pages. */
const notOwnSite = /(^|\.)(facebook\.com|fb\.com|instagram\.com|tiktok\.com|twitter\.com|x\.com|linkedin\.com|youtube\.com|linktr\.ee|linkin\.bio|bio\.link|pai\.pt|yelp\.[a-z.]+|tripadvisor\.[a-z.]+|zomato\.com|google\.com|goo\.gl|g\.page|wa\.me|whatsapp\.com|diariododigital\.com|cylex[a-z-]*\.[a-z.]+|infobel\.[a-z.]+|guiaempresas\.[a-z.]+|empresite\.[a-z.]+|racius\.com|apps\.apple\.com)$/i;
/** Booking platforms: the business already books online with someone else (worth knowing before calling). */
const bookingPlatforms = /(^|\.)(buk|appbarber|fresha|treatwell|booksy|thefork|zenchef|covermanager|mybusiness|setmore|calendly|agendor|trinks|barberbooking|squire|vagaro|planity|timify|reservio)\.[a-z.]+$/i;

export type SiteKind = "none" | "own" | "social" | "booking";

/** What the website field really is: none, a site of its own, a social/directory page or a booking platform. */
export function siteKind(website: string | null): SiteKind {
  if (!website) return "none";
  let host: string;
  try {
    host = new URL(website).hostname.replace(/^www\./, "");
  } catch {
    return "none";
  }
  if (bookingPlatforms.test(host)) return "booking";
  if (notOwnSite.test(host)) return "social";
  return "own";
}

/** «Facebook», «Instagram», «Buk»…: the name of the page the business links to instead of a site. */
export function linkName(website: string | null): string {
  if (!website) return "";
  try {
    const host = new URL(website).hostname.replace(/^www\./, "");
    const known: Record<string, string> = { "facebook.com": "Facebook", "fb.com": "Facebook", "instagram.com": "Instagram", "tiktok.com": "TikTok", "linktr.ee": "Linktree", "play.google.com": "uma app", "apps.apple.com": "uma app", "pai.pt": "o Pai.pt", "buk.pt": "Buk", "appbarber.com.br": "AppBarber", "fresha.com": "Fresha", "treatwell.pt": "Treatwell", "booksy.com": "Booksy", "thefork.pt": "TheFork" };
    const match = Object.keys(known).find((domain) => host === domain || host.endsWith(`.${domain}`));
    return match ? known[match] : host;
  } catch {
    return "";
  }
}

/**
 * What the list shows on each business: a product of ours with the reason in brackets, or a note
 * that helps on the phone (no site of its own, already booking elsewhere), which sells nothing.
 */
export interface Reason {
  opportunity: Opportunity | null;
  text: string;
  /** A note, not a product. */
  note?: boolean;
}

const restaurantLike = /restaurante|restaurant|café|cafe|bar\b|pastelaria|padaria|tasca|pizzaria|marisqueira|churrasqueira/i;
const sportsLike = /padel|ténis|tenis|futebol|ginásio|ginasio|campo/i;

/** What we could sell this business (by its kind), named like our products, then the useful notes. We
 * cannot tell from Google whether it already has review plates, so reviews are only a filter. */
export function reasons(prospect: { rating: number | null; reviews: number | null; website: string | null; category: string | null }): Reason[] {
  const found: Reason[] = [];
  const kind = siteKind(prospect.website);
  if (prospect.category && moduleCategories.test(prospect.category)) {
    const products = restaurantLike.test(prospect.category) ? "Lista de Espera e Reservas Online" : sportsLike.test(prospect.category) ? "Reservas Online" : "Reservas Online e Cartão de cliente digital";
    found.push({ opportunity: "modules", text: products });
  }
  if (kind === "booking") found.push({ opportunity: null, text: `Já reserva com ${linkName(prospect.website)}`, note: true });
  if (kind === "none") found.push({ opportunity: "site", text: "Sem site", note: true });
  if (kind === "social") found.push({ opportunity: "site", text: `Sem site próprio: só tem ${linkName(prospect.website)}`, note: true });
  if (kind === "booking") found.push({ opportunity: "site", text: "Sem site próprio", note: true });
  return found;
}

export function opportunities(prospect: { rating: number | null; reviews: number | null; website: string | null; category: string | null }): Opportunity[] {
  const found: Opportunity[] = [];
  if (siteKind(prospect.website) !== "own") found.push("site");
  if (prospect.category && moduleCategories.test(prospect.category)) found.push("modules");
  return found;
}

/** RFC 4180 CSV (quoted fields with commas, quotes and line breaks), as the scraper writes it. */
export function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let index = 0; index < text.length; index++) {
    const char = text[index];
    if (quoted) {
      if (char === '"' && text[index + 1] === '"') {
        field += '"';
        index++;
      } else if (char === '"') quoted = false;
      else field += char;
    } else if (char === '"') quoted = true;
    else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && text[index + 1] === "\n") index++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else field += char;
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  const [head, ...body] = rows.filter((cells) => cells.some((cell) => cell.trim()));
  if (!head) return [];
  const keys = head.map((key) => key.trim().replace(/^﻿/, ""));
  return body.map((cells) => Object.fromEntries(keys.map((key, index) => [key, cells[index] ?? ""])));
}

export interface ProspectFields {
  place_id: string;
  name: string;
  category: string | null;
  address: string | null;
  phone: string | null;
  website: string | null;
  email: string | null;
  rating: number | null;
  reviews: number | null;
  latitude: number | null;
  longitude: number | null;
  maps_url: string | null;
}

const text = (value: string | undefined, max: number) => {
  const clean = (value ?? "").trim();
  return clean ? clean.slice(0, max) : null;
};
const number = (value: string | undefined) => {
  const parsed = Number((value ?? "").replace(",", "."));
  return value && Number.isFinite(parsed) ? parsed : null;
};

/** The first email that looks like a real address (the scraper lists those found on the website). */
export function pickEmail(value: string | undefined): string | null {
  const found = (value ?? "")
    .split(/[\s,;|]+/)
    .map((item) => item.trim().replace(/^mailto:/i, "").toLowerCase())
    .find((item) => /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/.test(item) && !/\.(png|jpe?g|gif|webp|svg)$/.test(item) && !/example\.|sentry|wixpress/.test(item));
  return found ? found.slice(0, 200) : null;
}

/** One row of the scraper's CSV as a prospect, or null without a place or a name. */
export function prospectFromRow(row: Record<string, string>): ProspectFields | null {
  const placeId = text(row.place_id, 300) ?? text(row.data_id, 300) ?? text(row.cid, 300);
  const name = text(row.title, 200);
  if (!placeId || !name) return null;
  const rating = number(row.review_rating);
  const reviews = number(row.review_count);
  return {
    place_id: placeId,
    name,
    category: text(row.category, 120),
    address: text(row.address, 300),
    phone: text(row.phone, 60),
    website: text(row.website, 500),
    email: pickEmail(row.emails),
    rating: rating !== null && rating >= 0 && rating <= 5 ? Math.round(rating * 10) / 10 : null,
    reviews: reviews !== null && reviews >= 0 ? Math.round(reviews) : null,
    latitude: number(row.latitude),
    longitude: number(row.longitude),
    maps_url: text(row.link, 1000),
  };
}

// Digital business cards (/c/<slug>) and keychain tags (/k/<code>) edited in the admin (owner, 2026-10-20):
// the rules shared by the admin forms, the public pages and the tests. Pure module (no server or browser
// APIs), so the admin's forms use it in the browser too.
// Relative imports with extensions keep this module runnable by `node --test` (tests/business-card-admin.test.mjs).
import type { BusinessCard, SocialNetwork } from "../../content/business-cards.ts";
import { locales, type Locale } from "../i18n.ts";

/**
 * Cards and tags are programmed with the production address, whatever site the admin is opened on (a
 * preview's address would stop working). Always «www»: no extra redirect on every tap.
 */
export const programOrigin = "https://www.steevanz.com";

export function cardPublicPath(slug: string): string {
  return `/c/${slug}`;
}

export function cardVCardPath(slug: string): string {
  return `/c/${slug}/vcard`;
}

export function tagPublicPath(code: string): string {
  return `/k/${code}`;
}

/** Every path that shows this card, to refresh after a change. */
export function cardPaths(slug: string): string[] {
  return [cardPublicPath(slug), cardVCardPath(slug)];
}

// Slugs and codes ------------------------------------------------------------------------------------

export const cardSlugMaxLength = 60;
export const tagCodeMaxLength = 40;
const slugPattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** The address suggested from a name: "Rogério Cabaço" → "rogerio-cabaco". */
export function suggestSlug(text: string, maxLength = cardSlugMaxLength): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, maxLength)
    .replace(/-+$/g, "");
}

function slugIssue(slug: string, maxLength: number, what: string): string | null {
  if (!slug) return `Indique ${what}.`;
  if (slug.length < 2) return "Tem de ter pelo menos 2 caracteres.";
  if (slug.length > maxLength) return `Pode ter até ${maxLength} caracteres.`;
  if (!slugPattern.test(slug)) return "Só letras minúsculas sem acentos, números e hífens (sem hífen no início nem no fim).";
  return null;
}

/** Why this card address can't be used (Portuguese, for the form), or null when it can. */
export function cardSlugProblem(slug: string): string | null {
  return slugIssue(slug, cardSlugMaxLength, "o endereço do cartão");
}

/** Why this tag code can't be used, or null when it can. */
export function tagCodeProblem(code: string): string | null {
  return slugIssue(code, tagCodeMaxLength, "o código da tag");
}

// Values typed in the forms ------------------------------------------------------------------------

/**
 * A phone number as shown on the card: "+351 961 292 679". Portuguese numbers may be typed without the
 * country code (9 digits starting with 2 or 9). Other numbers need "+" or "00" and the country code and
 * keep their spacing. "" for an empty field, null when it isn't a phone number.
 */
export function normalizePhone(input: string): string | null {
  const text = input.trim();
  if (!text) return "";
  if (!/^[+\d\s().-]+$/.test(text)) return null;
  let digits = text.replace(/\D/g, "");
  const international = text.startsWith("+") || text.startsWith("00");
  if (text.startsWith("00")) digits = digits.slice(2);
  if (!international) {
    if (/^[29]\d{8}$/.test(digits)) digits = `351${digits}`;
    else return null;
  }
  if (digits.length < 8 || digits.length > 15) return null;
  if (digits.startsWith("351") && digits.length === 12) return `+351 ${digits.slice(3, 6)} ${digits.slice(6, 9)} ${digits.slice(9)}`;
  // Another country: its own grouping as typed, with the "+" in front.
  const typed = text.replace(/^00/, "+").replace(/\s+/g, " ");
  return typed.startsWith("+") ? typed : `+${digits}`;
}

/** The digits wa.me wants (country code included), or null. */
export function whatsappDigits(input: string): string | null {
  const phone = normalizePhone(input);
  return phone ? phone.replace(/\D/g, "") : null;
}

const emailPattern = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[a-z]{2,}$/i;

/** "" for empty, null when it isn't an email address. */
export function normalizeEmail(input: string): string | null {
  const text = input.trim().toLowerCase();
  if (!text) return "";
  return text.length <= 200 && emailPattern.test(text) ? text : null;
}

/**
 * A web address: "steevanz.com" becomes "https://steevanz.com"; only http(s), with a real host name and
 * no user or password in it. "" for empty, null when it isn't one.
 */
export function normalizeWebUrl(input: string, maxLength = 500): string | null {
  const text = input.trim();
  if (!text) return "";
  const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(text) ? text : `https://${text.replace(/^\/+/, "")}`;
  if (withScheme.length > maxLength || /\s/.test(withScheme)) return null;
  return isSafeHttpUrl(withScheme) ? withScheme : null;
}

/** Only http: and https:, a host with a dot (or localhost), no credentials. The gate of every redirect. */
export function isSafeHttpUrl(value: string): boolean {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return false;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return false;
  if (url.username || url.password) return false;
  if (!/^https?:\/\/[^/\s]/i.test(value)) return false;
  return url.hostname === "localhost" || /^[a-z0-9.-]+\.[a-z0-9-]{2,}$/i.test(url.hostname);
}

export const socialNetworks: readonly SocialNetwork[] = ["instagram", "linkedin", "facebook", "tiktok", "youtube", "x"];

/** Each network's address for an account name typed with or without "@". */
const socialProfile: Record<SocialNetwork, (handle: string) => string> = {
  instagram: (handle) => `https://www.instagram.com/${handle}`,
  linkedin: (handle) => `https://www.linkedin.com/in/${handle}`,
  facebook: (handle) => `https://www.facebook.com/${handle}`,
  tiktok: (handle) => `https://www.tiktok.com/@${handle}`,
  youtube: (handle) => `https://www.youtube.com/@${handle}`,
  x: (handle) => `https://x.com/${handle}`,
};

export const socialPlaceholders: Record<SocialNetwork, string> = {
  instagram: "@conta ou https://instagram.com/…",
  linkedin: "https://linkedin.com/in/…",
  facebook: "https://facebook.com/…",
  tiktok: "@conta",
  youtube: "@canal",
  x: "@conta",
};

/** An account name ("@steevanz_", "steevanz_") or an address. "" for empty, null when it's neither. */
export function normalizeSocial(network: SocialNetwork, input: string): string | null {
  const text = input.trim();
  if (!text) return "";
  const handle = text.replace(/^@/, "");
  // "dolciesalati.ap" is an account; "instagram.com/…", "www.…" and "https://…" are addresses.
  if (/^[A-Za-z0-9._-]{1,60}$/.test(handle) && !/^www\./i.test(handle)) return socialProfile[network](handle);
  return normalizeWebUrl(text);
}

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}

export const localeNamesPt: Record<Locale, string> = {
  pt: "Português",
  en: "Inglês",
  es: "Espanhol",
  fr: "Francês",
  de: "Alemão",
  it: "Italiano",
};

/** A photo address: a path of the site or https. */
export function isPhotoUrl(value: string): boolean {
  return (/^\/[^/\\]/.test(value) || /^https:\/\//.test(value)) && value.length <= 500 && !/\s/.test(value);
}

// Business cards ---------------------------------------------------------------------------------------

export interface BusinessCardRow {
  id: string;
  slug: string;
  active: boolean;
  locale: string;
  client_name: string | null;
  name: string;
  given_name: string | null;
  family_name: string | null;
  role: string | null;
  company: string | null;
  phone: string | null;
  phone2: string | null;
  whatsapp: string | null;
  email: string | null;
  website: string | null;
  socials: unknown;
  address: string | null;
  maps_url: string | null;
  photo_url: string | null;
  note: string | null;
  created_at: string;
  updated_at: string;
}

export const cardColumns =
  "id, slug, active, locale, client_name, name, given_name, family_name, role, company, phone, phone2, whatsapp, email, website, socials, address, maps_url, photo_url, note, created_at, updated_at";

/** "Rogério Cabaço" → given "Rogério", family "Cabaço"; one word is only a given name. */
export function splitName(name: string): { givenName: string; familyName: string } {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length < 2) return { givenName: words[0] ?? "", familyName: "" };
  return { givenName: words.slice(0, -1).join(" "), familyName: words[words.length - 1] };
}

/** The social links stored in a row, keeping only known networks with safe addresses, in the form's order. */
export function cleanSocials(value: unknown): { network: SocialNetwork; url: string }[] {
  if (!Array.isArray(value)) return [];
  const byNetwork = new Map<SocialNetwork, string>();
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const { network, url } = item as { network?: unknown; url?: unknown };
    if (typeof network !== "string" || typeof url !== "string") continue;
    if (!(socialNetworks as readonly string[]).includes(network) || !isSafeHttpUrl(url)) continue;
    if (!byNetwork.has(network as SocialNetwork)) byNetwork.set(network as SocialNetwork, url);
  }
  return socialNetworks.filter((network) => byNetwork.has(network)).map((network) => ({ network, url: byNetwork.get(network)! }));
}

/** Uploaded photos are 512 px squares; the content file's own photo keeps its size. */
export const cardPhotoSize = 512;

/** A database row in the shape of the public page and the contact file. */
export function rowToCard(row: BusinessCardRow): BusinessCard {
  const split = splitName(row.name);
  const lines = (row.address ?? "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const optional = (value: string | null) => value?.trim() || undefined;
  const website = row.website && isSafeHttpUrl(row.website) ? row.website : undefined;
  const mapsUrl = row.maps_url && isSafeHttpUrl(row.maps_url) ? row.maps_url : undefined;
  const socials = cleanSocials(row.socials);
  return {
    slug: row.slug,
    locale: isLocale(row.locale) ? row.locale : "pt",
    name: row.name.trim(),
    givenName: row.given_name?.trim() || split.givenName,
    familyName: row.family_name?.trim() || split.familyName,
    role: optional(row.role),
    company: optional(row.company),
    photo: row.photo_url && isPhotoUrl(row.photo_url) ? { src: row.photo_url, width: cardPhotoSize, height: cardPhotoSize } : undefined,
    phone: optional(row.phone),
    phone2: optional(row.phone2),
    whatsapp: optional(row.whatsapp),
    email: optional(row.email),
    website,
    socials: socials.length ? socials : undefined,
    address: lines.length ? { lines, mapsUrl } : undefined,
  };
}

/**
 * The public card: the database row when the table answers (null when it has no active card with this
 * slug), else the content file's card. `isMissing` tells a missing table or database (before the
 * migration) from other failures: those also fall back to the file when it has the card, and otherwise
 * throw, so an error is never shown (or cached) as «página não encontrada».
 */
export async function cardWithFallback(
  read: () => Promise<BusinessCardRow | null>,
  fallback: BusinessCard | undefined,
  isMissing: (error: unknown) => boolean,
  onError: (error: unknown) => void = () => {},
): Promise<BusinessCard | null> {
  try {
    const row = await read();
    return row ? rowToCard(row) : null;
  } catch (error) {
    if (isMissing(error)) return fallback ?? null;
    onError(error);
    if (fallback) return fallback;
    throw error;
  }
}

/** What the card form sends, already trimmed. */
export type CardFormValues = Record<
  | "name"
  | "slug"
  | "locale"
  | "client_name"
  | "given_name"
  | "family_name"
  | "role"
  | "company"
  | "phone"
  | "phone2"
  | "whatsapp"
  | "email"
  | "website"
  | "address"
  | "maps_url"
  | "note",
  string
> & { socials: Partial<Record<SocialNetwork, string>>; active: boolean };

/** The columns written by the form (the photo is handled apart). */
export type CardFields = Omit<BusinessCardRow, "id" | "photo_url" | "created_at" | "updated_at" | "socials"> & {
  socials: { network: SocialNetwork; url: string }[];
};

type Parsed<T> = { ok: true; value: T } | { ok: false; message: string };

function limit(value: string, max: number, label: string): string | null {
  return value.length > max ? `${label} pode ter até ${max} caracteres.` : null;
}

/** Checks and tidies the card form; the first problem is returned in Portuguese. */
export function parseCardForm(values: CardFormValues): Parsed<CardFields> {
  const name = values.name.trim();
  if (!name) return { ok: false, message: "Indique o nome da pessoa." };
  const slug = values.slug.trim().toLowerCase();
  const slugMessage = cardSlugProblem(slug);
  if (slugMessage) return { ok: false, message: `Endereço do cartão: ${slugMessage}` };
  if (!isLocale(values.locale)) return { ok: false, message: "Escolha a língua da página." };
  const lengths: [string, number, string][] = [
    [name, 120, "O nome"],
    [values.client_name, 120, "O cliente"],
    [values.given_name, 80, "O nome próprio"],
    [values.family_name, 80, "O apelido"],
    [values.role, 120, "O cargo"],
    [values.company, 120, "A empresa"],
    [values.address, 300, "A morada"],
    [values.note, 1000, "A nota"],
  ];
  for (const [value, max, label] of lengths) {
    const message = limit(value.trim(), max, label);
    if (message) return { ok: false, message };
  }
  if (values.address.split(/\r?\n/).filter((line) => line.trim()).length > 4) return { ok: false, message: "A morada pode ter até 4 linhas." };
  const phones: Record<"phone" | "phone2" | "whatsapp", string> = { phone: "", phone2: "", whatsapp: "" };
  for (const [key, label] of [
    ["phone", "O telefone"],
    ["phone2", "O outro telefone"],
    ["whatsapp", "O WhatsApp"],
  ] as const) {
    const phone = normalizePhone(values[key]);
    if (phone === null) return { ok: false, message: `${label} não parece válido. Use, por exemplo, 961 292 679 ou +34 600 000 000.` };
    phones[key] = phone;
  }
  const email = normalizeEmail(values.email);
  if (email === null) return { ok: false, message: "O email não parece válido." };
  const website = normalizeWebUrl(values.website);
  if (website === null) return { ok: false, message: "O website não parece válido (por exemplo, www.empresa.pt)." };
  const mapsInput = normalizeWebUrl(values.maps_url);
  if (mapsInput === null || (mapsInput && !mapsInput.startsWith("https://"))) return { ok: false, message: "O link do mapa tem de ser um endereço https://." };
  const socials: { network: SocialNetwork; url: string }[] = [];
  for (const network of socialNetworks) {
    const url = normalizeSocial(network, values.socials[network] ?? "");
    if (url === null) return { ok: false, message: `O endereço de ${socialNames[network]} não parece válido.` };
    if (url) socials.push({ network, url });
  }
  const orNull = (value: string) => value.trim() || null;
  return {
    ok: true,
    value: {
      slug,
      active: values.active,
      locale: values.locale,
      client_name: orNull(values.client_name),
      name,
      given_name: orNull(values.given_name),
      family_name: orNull(values.family_name),
      role: orNull(values.role),
      company: orNull(values.company),
      phone: phones.phone || null,
      phone2: phones.phone2 || null,
      whatsapp: phones.whatsapp || null,
      email: email || null,
      website: website || null,
      socials,
      address: values.address.trim() ? values.address.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).join("\n") : null,
      maps_url: mapsInput || null,
      note: orNull(values.note),
    },
  };
}

export const socialNames: Record<SocialNetwork, string> = {
  instagram: "Instagram",
  linkedin: "LinkedIn",
  facebook: "Facebook",
  tiktok: "TikTok",
  youtube: "YouTube",
  x: "X",
};

/** Up to two initials for a card without a photo: "Rogério Cabaço" → "RC". */
export function initialsOfName(name: string): string {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => Array.from(part)[0])
      .slice(0, 2)
      .join("")
      .toLocaleUpperCase("pt-PT") || "?"
  );
}

/** Lowercase, without accents: the admin's search matches «cabaco» with «Cabaço». */
export function searchText(...parts: (string | null | undefined)[]): string {
  return parts
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

// Keychain tags ------------------------------------------------------------------------------------

export const tagDestinationTypes = ["whatsapp", "instagram", "website", "custom"] as const;
export type TagDestinationType = (typeof tagDestinationTypes)[number];

export const tagDestinationNames: Record<TagDestinationType, string> = {
  whatsapp: "WhatsApp",
  instagram: "Instagram",
  website: "Website",
  custom: "Outro link",
};

export interface KeychainTagRow {
  id: string;
  code: string;
  label: string;
  destination_type: string;
  destination_url: string;
  active: boolean;
  tap_count: number;
  last_tap_at: string | null;
  created_at: string;
  updated_at: string;
}

export const tagColumns = "id, code, label, destination_type, destination_url, active, tap_count, last_tap_at, created_at, updated_at";

export function isTagDestinationType(value: unknown): value is TagDestinationType {
  return typeof value === "string" && (tagDestinationTypes as readonly string[]).includes(value);
}

/** What the destination fields of the tag form hold. */
export interface TagDestinationInputs {
  /** WhatsApp: the number and an optional message that opens already written. */
  whatsapp: string;
  message: string;
  /** Instagram: the account name or its address. */
  instagram: string;
  /** Website or another link. */
  url: string;
}

const instagramHandle = /^[A-Za-z0-9._]{1,30}$/;

/** The address the tag opens, built from the form; the first problem in Portuguese. */
export function buildTagDestination(type: TagDestinationType, inputs: TagDestinationInputs): Parsed<string> {
  if (type === "whatsapp") {
    const digits = whatsappDigits(inputs.whatsapp);
    if (!digits) return { ok: false, message: "Indique o número de WhatsApp, por exemplo 961 292 679 ou +34 600 000 000." };
    const message = inputs.message.trim();
    if (message.length > 500) return { ok: false, message: "A mensagem pode ter até 500 caracteres." };
    return { ok: true, value: `https://wa.me/${digits}${message ? `?text=${encodeURIComponent(message)}` : ""}` };
  }
  if (type === "instagram") {
    const text = inputs.instagram.trim();
    const handle = /instagram\.com/i.test(text) ? instagramHandleFromUrl(text) : text.replace(/^@/, "");
    if (!handle || !instagramHandle.test(handle)) return { ok: false, message: "Indique a conta de Instagram (por exemplo @steevanz_) ou o seu endereço." };
    return { ok: true, value: `https://www.instagram.com/${handle}` };
  }
  const url = normalizeWebUrl(inputs.url, 1000);
  if (!url) return { ok: false, message: "Indique um endereço que comece por https:// (por exemplo, www.empresa.pt)." };
  return { ok: true, value: url };
}

function instagramHandleFromUrl(text: string): string | null {
  const url = normalizeWebUrl(text);
  if (!url) return null;
  const parsed = new URL(url);
  if (!/(^|\.)instagram\.com$/i.test(parsed.hostname)) return null;
  return parsed.pathname.split("/").filter(Boolean)[0] ?? null;
}

/** The form's fields from a saved destination (to edit it). */
export function tagDestinationInputs(type: string, url: string): TagDestinationInputs {
  const inputs: TagDestinationInputs = { whatsapp: "", message: "", instagram: "", url: "" };
  let parsed: URL | null = null;
  try {
    parsed = new URL(url);
  } catch {
    parsed = null;
  }
  if (type === "whatsapp" && parsed) {
    const digits = parsed.pathname.replace(/\D/g, "");
    inputs.whatsapp = normalizePhone(`+${digits}`) || digits;
    inputs.message = parsed.searchParams.get("text") ?? "";
  } else if (type === "instagram" && parsed) {
    inputs.instagram = parsed.pathname.split("/").filter(Boolean)[0] ?? "";
  } else {
    inputs.url = url;
  }
  return inputs;
}

/**
 * The address /k/<code> may redirect to, or null. Checked again on every tap, whatever is stored: only
 * http(s) (never javascript:, data: or others), no credentials, and for WhatsApp and Instagram only
 * their own sites.
 */
export function safeTagDestination(type: string, url: string): string | null {
  if (!isTagDestinationType(type) || typeof url !== "string" || url.length > 1000 || !isSafeHttpUrl(url)) return null;
  const host = new URL(url).hostname.toLowerCase();
  if (type === "whatsapp" && !["wa.me", "api.whatsapp.com"].includes(host)) return null;
  if (type === "instagram" && !/(^|\.)instagram\.com$/.test(host)) return null;
  return url;
}

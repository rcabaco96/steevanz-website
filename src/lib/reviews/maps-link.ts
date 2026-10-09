/**
 * A Google Maps place link pasted in the admin → what a new customer needs: name, Google feature id,
 * coordinates and a clean link to that one place. Maps links often carry the places visited before
 * (e.g. "…!1s<McDonald's>…!3m5!1s<the place>…"): the place is always the LAST one in the link.
 */

export interface MapsPlaceLink {
  name: string;
  /** Google's feature id "0x…:0x…". */
  fid: string;
  lat: number;
  lng: number;
  /** Google's knowledge-graph id ("/g/…"), when the link carries it. */
  kgId: string | null;
  /** The place alone, without the places visited before. */
  cleanUrl: string;
}

const lastMatch = (text: string, pattern: RegExp) => [...text.matchAll(pattern)].at(-1) ?? null;

/** A postal code (Portugal "8365-111", or 5 digits elsewhere in Europe). */
const postalCode = /(^|\s)(\d{4}-\d{3}|\d{5})(\s|$)/;
/** The start of a street address: "R. Álvaro Gomes", "Rua…", "Av.…", "EN125", "Estrada…", "Street"… */
const streetStart =
  /^(r\.|rua|av\.?|avenida|estr\.?|estrada|lg\.?|largo|pç\.?|praça|praceta|tv\.?|trav\.?|travessa|calçada|cç\.?|beco|rotunda|urb\.?|urbanização|alameda|caminho|bairro|sítio|lugar|zona industrial|en\s?\d|n\s?\d|estrada nacional|edifício|ed\.|loja|lote|street|st\.|road|rd\.|avenue|ave\.)(\s|$|\d)/i;

/**
 * The place's name without the address Google sometimes puts in the link: a place reached through an
 * address search gets "/maps/place/King Kebab Armação Pêra, R. Álvaro Gomes lote 4 loja C, 8365-111
 * Armação de Pêra/…". Cut at the first comma after which the rest looks like an address (a street
 * word right after it, or a postal code further on). Names with commas but no address stay as they are.
 */
export function stripAddress(name: string): string {
  const parts = name.split(/\s*,\s*/);
  for (let index = 1; index < parts.length; index++) {
    const rest = parts.slice(index);
    if (streetStart.test(parts[index]) || rest.some((part) => postalCode.test(part))) {
      const kept = parts.slice(0, index).join(", ").trim();
      return kept || name.trim();
    }
  }
  return name.trim();
}

/**
 * The name to store when the reader sees the place's real title (the page's h1): only when the stored
 * name is that title plus an address (taken from a link), never over a name an admin chose. Null when
 * nothing should change.
 */
export function nameFromPage(stored: string, title: string | null | undefined): string | null {
  const shown = title?.replace(/\s+/g, " ").trim();
  if (!shown || shown.length > 160 || shown === stored.trim()) return null;
  const withAddress = stripAddress(stored) !== stored.trim() || stored.startsWith(`${shown},`);
  // The title must be about the same place (a word in common), never a stray heading of the page.
  const words = (text: string) => new Set(text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").split(/[^a-z0-9]+/).filter((word) => word.length >= 2));
  const storedWords = words(stripAddress(stored));
  const related = [...words(shown)].some((word) => storedWords.has(word));
  return withAddress && related ? shown : null;
}

export function parseMapsPlaceLink(url: string): MapsPlaceLink | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  const rawName = parsed.pathname.match(/\/maps\/place\/([^/]+)/)?.[1];
  if (!rawName) return null;
  let name: string;
  try {
    name = decodeURIComponent(rawName.replace(/\+/g, " ")).trim();
  } catch {
    name = rawName.replace(/\+/g, " ").trim();
  }
  // "Name, street, postal code town" (a place reached through an address search): the name alone.
  name = stripAddress(name);
  let path = parsed.pathname;
  try {
    path = decodeURIComponent(path);
  } catch {}
  const fid = lastMatch(path, /!1s(0x[0-9a-f]+:0x[0-9a-f]+)/gi)?.[1];
  const coords = lastMatch(path, /!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/g) ?? path.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  if (!name || !fid || !coords) return null;
  const lat = Number(coords[1]);
  const lng = Number(coords[2]);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  const kgId = lastMatch(path, /!16s([^!]+)/g)?.[1];
  const nameSegment = encodeURIComponent(name).replace(/%20/g, "+");
  const cleanUrl = `https://www.google.com/maps/place/${nameSegment}/@${lat},${lng},17z/data=!4m6!3m5!1s${fid}!8m2!3d${lat}!4d${lng}${kgId ? `!16s${encodeURIComponent(kgId)}` : ""}`;
  return { name, fid, lat, lng, kgId: kgId ? decodeURIComponent(kgId) : null, cleanUrl };
}

/** Short Maps links (maps.app.goo.gl, goo.gl, g.page) only say where the place is after a redirect. */
export const isShortMapsLink = (url: string) => /^https:\/\/(maps\.app\.goo\.gl|goo\.gl|g\.page)\//i.test(url);

/**
 * Google's place id ("ChIJ…") from the feature id in a Maps link ("0x<a>:0x<b>"): the place id is
 * base64url of [0x0a 0x12 0x09 <a, 8 bytes little-endian> 0x11 <b, 8 bytes little-endian>]. Checked
 * on 2026-10-04 against place ids Google gave for 4 places. Pure (browser and server).
 */
export function placeIdFromFid(fid: string | null | undefined): string | null {
  const match = fid?.match(/^0x([0-9a-f]{1,16}):0x([0-9a-f]{1,16})$/i);
  if (!match) return null;
  const bytes = new Uint8Array(20);
  const view = new DataView(bytes.buffer);
  bytes.set([0x0a, 0x12, 0x09], 0);
  view.setBigUint64(3, BigInt(`0x${match[1]}`), true);
  bytes[11] = 0x11;
  view.setBigUint64(12, BigInt(`0x${match[2]}`), true);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** Google's own "ask for reviews" link: opens the write-a-review window straight away. */
export const writeReviewLink = (placeId: string) => `https://search.google.com/local/writereview?placeid=${encodeURIComponent(placeId)}`;

/** The NFC plate's link for a place in a Maps link: Google's write-a-review window. */
export function plateLink(place: Pick<MapsPlaceLink, "fid">): string | null {
  const placeId = placeIdFromFid(place.fid);
  return placeId ? writeReviewLink(placeId) : null;
}

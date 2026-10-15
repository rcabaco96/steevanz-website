// Digital menus in videos: the rules shared by the admin, the public pages and the tests. Pure module
// (no server or browser APIs), so the admin's forms use it in the browser too.

import type { MenuCollection, MenuDish, VideoMenuData } from "../../content/demo-menu.ts";
import { initialsOf } from "../establishments/logo-rules.ts";

// YouTube ------------------------------------------------------------------------------------------

const videoIdPattern = /^[A-Za-z0-9_-]{11}$/;

export function isYouTubeId(value: string): boolean {
  return videoIdPattern.test(value);
}

/**
 * The 11-character video id from whatever the owner pastes: the id itself or a link in any of
 * YouTube's formats (shorts/, watch?v=, youtu.be/, embed/, live/, with or without https, www or m.).
 * Null when it isn't a YouTube video.
 */
export function parseYouTubeId(input: string): string | null {
  const text = input.trim();
  if (isYouTubeId(text)) return text;
  let url: URL;
  try {
    url = new URL(/^[a-z][a-z0-9+.-]*:\/\//i.test(text) ? text : `https://${text}`);
  } catch {
    return null;
  }
  const host = url.hostname.toLowerCase().replace(/^(www|m|music)\./, "");
  let candidate: string | null = null;
  if (host === "youtu.be") {
    candidate = url.pathname.split("/")[1] ?? null;
  } else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    const fromQuery = url.searchParams.get("v");
    const fromPath = url.pathname.match(/^\/(?:shorts|embed|live|v|e)\/([^/]+)/)?.[1];
    candidate = url.pathname === "/watch" ? fromQuery : (fromPath ?? null);
  }
  return candidate && isYouTubeId(candidate) ? candidate : null;
}

/** The video's picture, straight from YouTube's image servers (no API, no key). */
export function youTubeThumbnail(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

// Prices -------------------------------------------------------------------------------------------

/** 10 000 € (the database allows up to this). */
export const maxPriceCents = 1_000_000;

/**
 * Cents from a price typed the Portuguese way or not: "4,50", "4.5", "4", "4,50 €", "€ 12",
 * "1.250,00", "1 250,5". Null when it isn't a price (letters, negative, more than 2 decimals, too high).
 */
export function parsePriceCents(input: string): number | null {
  const text = input.replace(/[\s  €]/g, "").replace(/eur(os?)?$/i, "");
  if (!/^\d[\d.,]*$/.test(text)) return null;
  const lastComma = text.lastIndexOf(",");
  const lastDot = text.lastIndexOf(".");
  let whole = text;
  let fraction = "";
  if (lastComma >= 0 || lastDot >= 0) {
    // Both separators: the last one is the decimal one. Only dots: "1.250" (groups of three) is a
    // thousand, "4.5" is a decimal. Only commas: always decimal (pt-PT).
    const onlyThousands = lastComma < 0 && /^\d{1,3}(\.\d{3})+$/.test(text);
    const decimal = onlyThousands ? -1 : Math.max(lastComma, lastDot);
    if (decimal >= 0) {
      whole = text.slice(0, decimal);
      fraction = text.slice(decimal + 1);
      if (!/^\d{1,2}$/.test(fraction)) return null;
    }
    const groupSeparator = decimal >= 0 ? (text[decimal] === "," ? "." : ",") : ".";
    const grouped = new RegExp(`^\\d{1,3}(\\${groupSeparator}\\d{3})+$`);
    if (/[.,]/.test(whole)) {
      if (!grouped.test(whole)) return null;
      whole = whole.replaceAll(groupSeparator, "");
    }
  }
  if (!/^\d+$/.test(whole)) return null;
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, "0") || "0");
  return Number.isSafeInteger(cents) && cents <= maxPriceCents ? cents : null;
}

const euro = new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" });

/** "4,50 €" */
export function formatPriceCents(cents: number): string {
  return euro.format(cents / 100);
}

/** The price as it goes back into the form's field: "4,50". */
export function priceInputValue(cents: number): string {
  return (cents / 100).toFixed(2).replace(".", ",");
}

// Slugs --------------------------------------------------------------------------------------------

export const slugMaxLength = 60;
const slugPattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** The address suggested from the business's name: "Café do Zé" → "cafe-do-ze". */
export function slugFromName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, slugMaxLength)
    .replace(/-+$/g, "");
}

/** Why this address can't be used (in Portuguese, for the form), or null when it can. */
export function slugProblem(slug: string): string | null {
  if (!slug) return "Indique o endereço do menu.";
  if (slug.length < 2) return "O endereço tem de ter pelo menos 2 caracteres.";
  if (slug.length > slugMaxLength) return `O endereço pode ter até ${slugMaxLength} caracteres.`;
  if (!slugPattern.test(slug)) return "O endereço só pode ter letras minúsculas sem acentos, números e hífens (sem hífen no início nem no fim).";
  return null;
}

/** The public page of a menu. The demo keeps its old address. */
export function menuPublicPath(slug: string): string {
  return slug === "raza17raza" ? "/raza17raza" : `/menu/${slug}`;
}

/** Every path that shows this menu (both answer for the demo), to refresh after a change. */
export function menuPaths(slug: string): string[] {
  return slug === "raza17raza" ? ["/raza17raza", `/menu/${slug}`] : [`/menu/${slug}`];
}

// Instagram and logo -------------------------------------------------------------------------------

/**
 * The Instagram handle from "@handle", "handle" or a profile link. `null` for an empty field,
 * `undefined` when it isn't a valid handle.
 */
export function parseInstagram(input: string): string | null | undefined {
  let text = input.trim();
  if (!text) return null;
  const link = text.match(/^(?:https?:\/\/)?(?:www\.|m\.)?instagram\.com\/([^/?#]+)/i);
  if (link) text = link[1];
  text = text.replace(/^@/, "");
  return /^[A-Za-z0-9._]{1,30}$/.test(text) ? text : undefined;
}

/** A logo address the menu can show: a path of this site ("/media/…") or an https link. */
export function isLogoUrl(value: string): boolean {
  if (value.length > 500) return false;
  if (/^\/[^/\\]/.test(value)) return !/\s/.test(value);
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

/** Without a logo: the business's initials on the Steevanz colour, as a picture the menu can draw. */
export function initialsLogo(business: string): string {
  const initials = initialsOf(business).replace(/[<>&"']/g, "");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 168 168"><rect width="168" height="168" fill="#7a2d60"/><text x="84" y="84" dy=".35em" text-anchor="middle" font-family="system-ui,sans-serif" font-size="64" font-weight="700" fill="#fff">${initials}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

// From the database to the player ------------------------------------------------------------------

export interface VideoMenuRow {
  id: string;
  slug: string;
  business_name: string;
  logo_url: string | null;
  instagram: string | null;
  review_business_id: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface VideoMenuDishRow {
  id: string;
  menu_id: string;
  video_id: string;
  name: string;
  description: string;
  price_cents: number;
  position: number;
}

export interface VideoMenuCollectionRow {
  id: string;
  menu_id: string;
  name: string;
  position: number;
  is_default: boolean;
}

export interface VideoMenuLinkRow {
  collection_id: string;
  dish_id: string;
  position: number;
}

const byPosition = <T extends { position: number }>(a: T, b: T) => a.position - b.position;

/**
 * The menu in the shape the player takes (the same as the static demo): dishes keyed by their id
 * in their order, the default collection first (the player opens the first one), empty collections
 * left out, and «Todos» with every dish when no collection has any. Null when there's no dish.
 */
export function toVideoMenuData(
  menu: Pick<VideoMenuRow, "business_name" | "logo_url" | "instagram">,
  dishRows: VideoMenuDishRow[],
  collectionRows: VideoMenuCollectionRow[],
  linkRows: VideoMenuLinkRow[],
): VideoMenuData | null {
  const ordered = [...dishRows].sort(byPosition);
  if (!ordered.length) return null;
  const dishes: Record<string, MenuDish> = {};
  for (const dish of ordered) {
    dishes[dish.id] = { video: dish.video_id, name: dish.name, description: dish.description, price: dish.price_cents / 100 };
  }
  const collections: MenuCollection[] = [...collectionRows]
    .sort((a, b) => Number(b.is_default) - Number(a.is_default) || byPosition(a, b))
    .map((collection) => ({
      id: collection.id,
      name: collection.name,
      dishes: linkRows
        .filter((link) => link.collection_id === collection.id && dishes[link.dish_id])
        .sort(byPosition)
        .map((link) => link.dish_id),
    }))
    .filter((collection) => collection.dishes.length > 0);
  if (!collections.length) collections.push({ id: "todos", name: "Todos", dishes: ordered.map((dish) => dish.id) });
  return {
    business: menu.business_name,
    logo: menu.logo_url || initialsLogo(menu.business_name),
    instagram: menu.instagram,
    dishes,
    collections,
  };
}

/** Swaps an item with its neighbour; the same list when it's already at that end. */
export function moveItem<T>(items: T[], index: number, direction: -1 | 1): T[] {
  const target = index + direction;
  if (index < 0 || index >= items.length || target < 0 || target >= items.length) return items;
  const next = [...items];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

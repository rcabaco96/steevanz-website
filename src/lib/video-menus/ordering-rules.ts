// Ordering at the table (video menus): the rules shared by the server, the table's phones and the
// tests. Pure module (no server or browser APIs). The database applies the same limits
// (supabase/migrations/20261017120000_menu_ordering.sql).

import { languageNamesPt, type MenuLanguage } from "./i18n.ts";

/** Items (the sum of the quantities) in one table's cart. */
export const maxCartItems = 50;
/** Of one line. */
export const maxLineQuantity = 20;
export const maxNoteLength = 200;
/** A cart left alone this long, and the orders older than this, belong to another group at the table. */
export const sessionHours = 4;
/** The Portuguese day an order is numbered in. */
export const orderTimeZone = "Europe/Lisbon";

/** A table's or an order's secret (crypto random, base64url, at least 22 characters). */
export const tokenPattern = /^[A-Za-z0-9_-]{22,64}$/;
export function isOrderingToken(value: string): boolean {
  return tokenPattern.test(value);
}

/** The table's Realtime Broadcast channel (from its id, never its token). */
export function tableChannel(tableId: string): string {
  return `mesa:${tableId}`;
}

// The cart -----------------------------------------------------------------------------------------

export interface CartLine {
  id: string;
  /** The dish's id (the key in the menu's dishes). */
  dish: string;
  name: string;
  priceCents: number;
  quantity: number;
  /** '' when none. */
  note: string;
}

export type OrderingError =
  | "cart_full"
  | "line_full"
  | "note_too_long"
  | "cart_empty"
  | "order_too_soon"
  | "rate_limited"
  | "dish_missing"
  | "table_missing"
  | "ordering_off"
  | "bad_request"
  | "network";

/**
 * A note as it's kept: one line, trimmed, no control characters, inner spaces collapsed. Null when it
 * is longer than the limit.
 */
export function normaliseNote(input: string): string | null {
  const note = input.replace(/[\u0000-\u001f\u007f]+/g, " ").replace(/\s+/g, " ").trim();
  return note.length > maxNoteLength ? null : note;
}

export function cartItemCount(lines: Pick<CartLine, "quantity">[]): number {
  return lines.reduce((sum, line) => sum + line.quantity, 0);
}

export function cartTotalCents(lines: Pick<CartLine, "quantity" | "priceCents">[]): number {
  return lines.reduce((sum, line) => sum + line.quantity * line.priceCents, 0);
}

/** How many of each dish are in the cart (all its lines, with or without a note). */
export function dishCounts(lines: Pick<CartLine, "dish" | "quantity">[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const line of lines) counts[line.dish] = (counts[line.dish] ?? 0) + line.quantity;
  return counts;
}

/**
 * One more of a dish, as the server does it: it joins the dish's line without a note (a line with a
 * note stays apart), or starts one at the end. An error when the cart or that line is full.
 */
export function addToCart(lines: CartLine[], dish: { id: string; name: string; priceCents: number }, newLineId: string): { lines: CartLine[] } | { error: "cart_full" | "line_full" } {
  if (cartItemCount(lines) >= maxCartItems) return { error: "cart_full" };
  const index = lines.findIndex((line) => line.dish === dish.id && line.note === "");
  if (index < 0) return { lines: [...lines, { id: newLineId, dish: dish.id, name: dish.name, priceCents: dish.priceCents, quantity: 1, note: "" }] };
  if (lines[index].quantity >= maxLineQuantity) return { error: "line_full" };
  return { lines: lines.map((line, at) => (at === index ? { ...line, quantity: line.quantity + 1 } : line)) };
}

/**
 * A line's new quantity (0 removes it) and/or note, as the server does it: a line whose note is
 * cleared joins the dish's line without a note (up to the line limit).
 */
export function changeLine(lines: CartLine[], lineId: string, change: { quantity?: number; note?: string }): { lines: CartLine[] } | { error: "cart_full" | "line_full" | "note_too_long" } {
  const line = lines.find((candidate) => candidate.id === lineId);
  if (!line) return { lines };
  if (change.quantity !== undefined && change.quantity <= 0) return { lines: lines.filter((candidate) => candidate.id !== lineId) };
  const quantity = change.quantity ?? line.quantity;
  const note = change.note === undefined ? line.note : normaliseNote(change.note);
  if (note === null) return { error: "note_too_long" };
  if (quantity > maxLineQuantity) return { error: "line_full" };
  if (quantity > line.quantity && cartItemCount(lines) - line.quantity + quantity > maxCartItems) return { error: "cart_full" };
  if (note === "" && line.note !== "") {
    const plain = lines.find((candidate) => candidate.id !== lineId && candidate.dish === line.dish && candidate.note === "");
    if (plain) {
      return {
        lines: lines
          .filter((candidate) => candidate.id !== lineId)
          .map((candidate) => (candidate.id === plain.id ? { ...candidate, quantity: Math.min(maxLineQuantity, candidate.quantity + quantity) } : candidate)),
      };
    }
  }
  return { lines: lines.map((candidate) => (candidate.id === lineId ? { ...candidate, quantity, note } : candidate)) };
}

// Words --------------------------------------------------------------------------------------------

const euro = new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" });

export function itemsLabel(count: number): string {
  return `${count} ${count === 1 ? "item" : "itens"}`;
}

/** The order bar: "Pedido · 3 itens · 14,50 €". */
export function orderBarLabel(count: number, totalCents: number): string {
  return `Pedido · ${itemsLabel(count)} · ${euro.format(totalCents / 100)}`;
}

/** What a table's phone says when something can't be done. */
export function orderingErrorMessage(error: OrderingError | string): string {
  switch (error) {
    case "cart_full":
      return `O pedido já tem ${maxCartItems} itens, o máximo de uma vez. Faça este pedido e depois outro.`;
    case "line_full":
      return `Máximo de ${maxLineQuantity} do mesmo prato numa linha.`;
    case "note_too_long":
      return `A nota pode ter até ${maxNoteLength} caracteres.`;
    case "cart_empty":
      return "O pedido está vazio.";
    case "order_too_soon":
      return "Acabou de ser feito um pedido nesta mesa. Espere uns segundos.";
    case "rate_limited":
      return "Muitas alterações seguidas. Espere um momento.";
    case "dish_missing":
      return "Este prato já não está no menu.";
    case "table_missing":
      return "Este código de mesa já não é válido. Peça ajuda ao funcionário.";
    case "ordering_off":
      return "Os pedidos no menu estão desligados de momento.";
    case "network":
      return "Sem ligação. Tente outra vez.";
    default:
      return "Ocorreu um erro. Tente outra vez.";
  }
}

export type OrderStatus = "placed" | "confirmed";

export function orderStatusLabel(status: OrderStatus): string {
  return status === "confirmed" ? "Pedido confirmado ✓" : "À espera de confirmação";
}

// The state every phone at the table shows ----------------------------------------------------------

export interface TableOrderLine {
  /** The dish (the table's phones show its name in their language); null once it left the menu. */
  dish?: string | null;
  /** Its Portuguese name when the order was placed. */
  name: string;
  priceCents: number;
  quantity: number;
  note: string;
}

export interface TableOrder {
  id: string;
  number: number;
  token: string;
  status: OrderStatus;
  totalCents: number;
  createdAt: string;
  lines: TableOrderLine[];
}

export interface TableState {
  version: number;
  lines: CartLine[];
  /** This session's orders, the newest first. */
  orders: TableOrder[];
}

// Orders -------------------------------------------------------------------------------------------

/** The day an order is numbered in (Lisbon time): "2026-10-17". */
export function serviceDay(at: Date, timeZone = orderTimeZone): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(at);
}

/** The next order number of a menu's day: one more than the highest so far, 1 for the first. */
export function nextOrderNumber(numbersToday: number[]): number {
  return numbersToday.reduce((highest, number) => Math.max(highest, number), 0) + 1;
}

/** "14:32", Lisbon time. */
export function orderTime(iso: string, timeZone = orderTimeZone): string {
  return new Intl.DateTimeFormat("pt-PT", { timeZone, hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
}

// The staff's page (/pedido/<token>) ------------------------------------------------------------------

/**
 * The lines the staff read: always the dishes' Portuguese names as the order was placed (whatever the
 * customer's menu language), and the notes exactly as the customer typed them.
 */
export function staffOrderLines(rows: { dish_name: string; unit_price_cents: number; quantity: number; note: string; position: number }[]): TableOrderLine[] {
  return [...rows].sort((a, b) => a.position - b.position).map((line) => ({ name: line.dish_name, priceCents: line.unit_price_cents, quantity: line.quantity, note: line.note }));
}

/** The small note on the staff's page: «Cliente pediu em inglês»; nothing for Portuguese or unknown. */
export function customerLanguageNote(language: MenuLanguage | null | undefined): string | null {
  if (!language || language === "pt") return null;
  return `Cliente pediu em ${languageNamesPt[language]}`;
}

// Tables (admin) -----------------------------------------------------------------------------------

export const maxTableNameLength = 40;
/** «Criar mesas 1 a N»: at most this many at once. */
export const maxTablesAtOnce = 100;

/** «Mesa 1» … «Mesa N», without the names the menu already has (any case or spacing). */
export function tableNamesUpTo(count: number, existing: string[]): string[] {
  const taken = new Set(existing.map((name) => name.trim().replace(/\s+/g, " ").toLowerCase()));
  const names: string[] = [];
  for (let number = 1; number <= Math.min(count, maxTablesAtOnce); number += 1) {
    const name = `Mesa ${number}`;
    if (!taken.has(name.toLowerCase())) names.push(name);
  }
  return names;
}

/** A table's name as it's kept, or null when it's empty or too long. */
export function tableName(input: string): string | null {
  const name = input.trim().replace(/\s+/g, " ");
  return name && name.length <= maxTableNameLength ? name : null;
}

/** The public path of a table's link. */
export function tablePath(token: string): string {
  return `/m/${token}`;
}

/** The public path of an order's staff page (in its QR code). */
export function orderPath(token: string): string {
  return `/pedido/${token}`;
}

// Ordering on a demo menu's public link (owner, 2026-10-22: «Ativa os pedidos do menu nesse link mas
// que não partilhem entre todas as pessoas que estejam a aceder ao link»). The public link is shared
// by everyone, so a demo order never leaves the visitor's browser: the cart and the orders live in
// this tab only (sessionStorage), nothing is sent to the server, no kitchen or staff page sees them
// and nobody is emailed. Each tab starts its own session with a random id; it is forgotten when the
// tab closes or after `sessionHours` without a change. The staff's confirmation is simulated a few
// seconds after the order. Pure module (no server or browser APIs): the tests use it as it is.

import { addToCart, cartTotalCents, changeLine, maxCartItems, maxLineQuantity, nextOrderNumber, normaliseNote, sessionHours, type CartLine, type TableOrder, type TableOrderLine } from "./ordering-rules.ts";

/** A demo session is forgotten this long after its last change. */
export const demoSessionMs = sessionHours * 3_600_000;
/** The staff's confirmation, simulated this long after the order. */
export const demoConfirmMs = 4_000;
/** Orders kept in one demo session (the newest). */
export const maxDemoOrders = 20;

export interface DemoSession {
  /** Random, made in the visitor's tab; only names this session's orders (never sent anywhere). */
  id: string;
  /** Epoch ms of the last change. */
  updatedAt: number;
  /** The next line's number in this session. */
  nextLine: number;
  lines: CartLine[];
  /** The newest first, like the table's. */
  orders: TableOrder[];
}

/** Where the tab keeps a menu's demo session (one per menu; sessionStorage is per tab already). */
export function demoStorageKey(slug: string): string {
  return `steevanz:pedido-demo:${slug}`;
}

export function newDemoSession(id: string, now: number): DemoSession {
  return { id, updatedAt: now, nextLine: 1, lines: [], orders: [] };
}

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);
const isCount = (value: unknown, max: number): value is number => Number.isInteger(value) && (value as number) >= 1 && (value as number) <= max;
const isCents = (value: unknown): value is number => Number.isInteger(value) && (value as number) >= 0 && (value as number) <= 1_000_000_00;
const isText = (value: unknown, max: number): value is string => typeof value === "string" && value.length <= max;

/** A line of an order (a cart line without its id). */
function readOrderLine(value: unknown): TableOrderLine | null {
  if (!isRecord(value)) return null;
  const { dish, name, priceCents, quantity, note } = value;
  if (!isText(dish, 64) || !dish || !isText(name, 200) || !isCents(priceCents) || !isCount(quantity, maxLineQuantity) || !isText(note, 1000)) return null;
  const cleanNote = normaliseNote(note);
  return cleanNote === null ? null : { dish, name, priceCents, quantity, note: cleanNote };
}

function readLine(value: unknown): CartLine | null {
  const line = readOrderLine(value);
  if (!line || !isRecord(value) || !isText(value.id, 40) || !value.id) return null;
  return { id: value.id, ...line, dish: line.dish as string };
}

function readOrder(value: unknown): TableOrder | null {
  if (!isRecord(value)) return null;
  const { id, number, token, status, totalCents, createdAt, lines } = value;
  if (!isText(id, 80) || !id || !isCount(number, 100_000) || !isText(token, 80) || !token || (status !== "placed" && status !== "confirmed")) return null;
  if (!isCents(totalCents) || !isText(createdAt, 40) || Number.isNaN(Date.parse(createdAt)) || !Array.isArray(lines)) return null;
  const orderLines = lines.map(readOrderLine).filter((line): line is TableOrderLine => line !== null);
  if (!orderLines.length) return null;
  return { id, number, token, status, totalCents, createdAt, lines: orderLines };
}

/**
 * The tab's demo session as kept, or null when there is none, it can't be read, or it was left alone
 * longer than `demoSessionMs` (then the visitor starts over).
 */
export function readDemoSession(raw: string | null, now: number): DemoSession | null {
  if (!raw) return null;
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!isRecord(value)) return null;
  const { id, updatedAt, nextLine, lines, orders } = value;
  if (!isText(id, 80) || !id || typeof updatedAt !== "number" || !Number.isFinite(updatedAt) || !Array.isArray(lines) || !Array.isArray(orders)) return null;
  if (now - updatedAt > demoSessionMs || updatedAt - now > 60_000) return null;
  const cart: CartLine[] = [];
  for (const candidate of lines) {
    const line = readLine(candidate);
    if (line && cart.reduce((sum, kept) => sum + kept.quantity, 0) + line.quantity <= maxCartItems) cart.push(line);
  }
  return {
    id,
    updatedAt,
    nextLine: Number.isInteger(nextLine) && (nextLine as number) > 0 ? (nextLine as number) : cart.length + 1,
    lines: cart,
    orders: orders.map(readOrder).filter((order): order is TableOrder => order !== null).slice(0, maxDemoOrders),
  };
}

/** One more of a dish, with the table's rules (the same limits and merging). */
export function demoAdd(session: DemoSession, dish: { id: string; name: string; priceCents: number }, now: number): { session: DemoSession } | { error: "cart_full" | "line_full" } {
  const result = addToCart(session.lines, dish, `demo-${session.nextLine}`);
  if ("error" in result) return result;
  return { session: { ...session, lines: result.lines, nextLine: session.nextLine + 1, updatedAt: now } };
}

/** A line's quantity (0 removes it) and/or note, with the table's rules. */
export function demoChange(
  session: DemoSession,
  lineId: string,
  change: { quantity?: number; note?: string },
  now: number,
): { session: DemoSession } | { error: "cart_full" | "line_full" | "note_too_long" } {
  const result = changeLine(session.lines, lineId, change);
  if ("error" in result) return result;
  return { session: { ...session, lines: result.lines, updatedAt: now } };
}

/** The cart becomes this session's next order (numbered from 1 in each session), waiting for the (simulated) staff. */
export function demoPlaceOrder(session: DemoSession, now: number): { session: DemoSession; order: TableOrder } | { error: "cart_empty" } {
  if (!session.lines.length) return { error: "cart_empty" };
  const number = nextOrderNumber(session.orders.map((order) => order.number));
  const order: TableOrder = {
    id: `${session.id}-${number}`,
    number,
    token: `${session.id}-${number}`,
    status: "placed",
    totalCents: cartTotalCents(session.lines),
    createdAt: new Date(now).toISOString(),
    lines: session.lines.map(({ dish, name, priceCents, quantity, note }) => ({ dish, name, priceCents, quantity, note })),
  };
  return { session: { ...session, lines: [], orders: [order, ...session.orders].slice(0, maxDemoOrders), updatedAt: now }, order };
}

/** The orders whose simulated confirmation is due by now, confirmed (the same session when none is). */
export function demoConfirmDue(session: DemoSession, now: number): DemoSession {
  const due = (order: TableOrder) => order.status === "placed" && Date.parse(order.createdAt) + demoConfirmMs <= now;
  if (!session.orders.some(due)) return session;
  return { ...session, orders: session.orders.map((order) => (due(order) ? { ...order, status: "confirmed" } : order)) };
}

/** Milliseconds until the next simulated confirmation, or null when no order is waiting. */
export function nextDemoConfirmIn(session: DemoSession, now: number): number | null {
  const waiting = session.orders.filter((order) => order.status === "placed").map((order) => Date.parse(order.createdAt) + demoConfirmMs - now);
  return waiting.length ? Math.max(0, Math.min(...waiting)) : null;
}

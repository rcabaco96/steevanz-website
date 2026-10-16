import { after, NextResponse } from "next/server";
import { z } from "zod";
import { maxLineQuantity, normaliseNote, type OrderingError } from "@/lib/video-menus/ordering-rules";
import { broadcastTableChange, cartAdd, cartSet, getTableByToken, getTableState, OrderingFailure, placeOrder, type OrderingTable } from "@/lib/video-menus/ordering-store";

// A table's shared cart (the table's link: /m/<token>). GET: the cart and this session's orders.
// POST: one change ({op: "add" | "set" | "order"}), answered with the new state and announced to the
// table's other phones. The token is checked on every call; nothing is read or written without it.

const noStore = { "Cache-Control": "private, no-store" };
const maxBodyBytes = 4096;

const uuid = z.uuid();
const changeSchema = z.discriminatedUnion("op", [
  z.object({ op: z.literal("add"), dish: uuid }),
  z.object({
    op: z.literal("set"),
    line: uuid,
    quantity: z.number().int().min(0).max(maxLineQuantity).optional(),
    note: z.string().max(1000).optional(),
  }),
  z.object({ op: z.literal("order") }),
]);

function problem(error: OrderingError, status: number, extra: Record<string, unknown> = {}) {
  return NextResponse.json({ error, ...extra }, { status, headers: noStore });
}

async function findTable(ctx: RouteContext<"/api/mesa/[token]">): Promise<OrderingTable | NextResponse> {
  const { token } = await ctx.params;
  const table = await getTableByToken(token);
  if (!table) return problem("table_missing", 404);
  if (!table.ordering) return problem("ordering_off", 403);
  return table;
}

export async function GET(_request: Request, ctx: RouteContext<"/api/mesa/[token]">) {
  try {
    const table = await findTable(ctx);
    if (table instanceof NextResponse) return table;
    return NextResponse.json({ state: await getTableState(table.id) }, { headers: noStore });
  } catch (error) {
    if (error instanceof OrderingFailure) return problem(error.code, 404);
    console.error("[ordering] state failed:", error instanceof Error ? error.message : error);
    return problem("bad_request", 500);
  }
}

export async function POST(request: Request, ctx: RouteContext<"/api/mesa/[token]">) {
  // JSON only (a form from another site can't send it without asking first).
  if (!request.headers.get("content-type")?.startsWith("application/json")) return problem("bad_request", 415);
  const text = await request.text();
  if (text.length > maxBodyBytes) return problem("bad_request", 413);
  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return problem("bad_request", 400);
  }
  const parsed = changeSchema.safeParse(body);
  if (!parsed.success) return problem("bad_request", 400);
  const change = parsed.data;

  let table: OrderingTable | NextResponse;
  try {
    table = await findTable(ctx);
  } catch (error) {
    console.error("[ordering] table lookup failed:", error instanceof Error ? error.message : error);
    return problem("bad_request", 500);
  }
  if (table instanceof NextResponse) return table;
  const tableId = table.id;

  let placed: { number: number; token: string } | undefined;
  let version: number;
  try {
    if (change.op === "add") {
      version = await cartAdd(tableId, change.dish);
    } else if (change.op === "set") {
      let note: string | null = null;
      if (change.note !== undefined) {
        note = normaliseNote(change.note);
        if (note === null) return problem("note_too_long", 400);
      }
      version = await cartSet(tableId, change.line, change.quantity ?? null, note);
    } else {
      const order = await placeOrder(tableId);
      placed = { number: order.number, token: order.token };
      version = order.version;
    }
  } catch (error) {
    if (error instanceof OrderingFailure) {
      // The phone gets the current state with the reason, to show what's really there.
      const state = await getTableState(tableId).catch(() => undefined);
      return problem(error.code, error.code === "rate_limited" ? 429 : 409, { state });
    }
    console.error("[ordering] change failed:", error instanceof Error ? error.message : error);
    return problem("bad_request", 500);
  }

  // The other phones at the table fetch again: told at once, while this phone's answer is made
  // (the answer doesn't wait for it).
  const told = broadcastTableChange(tableId, Number.isFinite(version) ? version : null);
  after(() => told);
  try {
    const state = await getTableState(tableId);
    return NextResponse.json({ state, placed }, { headers: noStore });
  } catch (error) {
    console.error("[ordering] state after change failed:", error instanceof Error ? error.message : error);
    return NextResponse.json({ placed }, { headers: noStore });
  }
}

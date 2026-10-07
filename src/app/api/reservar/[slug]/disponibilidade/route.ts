import type { NextRequest } from "next/server";
import { loadBundle } from "@/lib/establishments/store";
import { computeDays, ensureBookingPage } from "@/lib/modules/bookings/store";
import { publicEstablishment } from "@/lib/modules/public";

const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const uuidPattern = /^[0-9a-f-]{36}$/i;
const maxDays = 14;

function reply(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

/** Free start times of the public booking page, a week or two at a time. */
export async function GET(request: NextRequest, ctx: RouteContext<"/api/reservar/[slug]/disponibilidade">) {
  const { slug } = await ctx.params;
  const establishment = await publicEstablishment(slug, "bookings");
  if (!establishment) return reply({ error: "not_found" }, 404);
  const params = request.nextUrl.searchParams;
  const service = params.get("service");
  const staff = params.get("staff");
  const from = params.get("from");
  const party = Number(params.get("party") ?? "1");
  const days = Math.min(maxDays, Math.max(1, Number(params.get("days") ?? "7") || 7));
  if ((service && !uuidPattern.test(service)) || (staff && !uuidPattern.test(staff)) || (from && !datePattern.test(from)) || !Number.isInteger(party)) {
    return reply({ error: "invalid" }, 400);
  }
  try {
    const [bundle, page] = await Promise.all([loadBundle(establishment), ensureBookingPage(establishment)]);
    if (!page.active) return reply({ error: "closed" }, 409);
    const result = await computeDays(bundle, page, { serviceId: service, staffId: staff, partySize: party, from: from ?? undefined, days });
    return reply({
      days: result.map((day) => ({ date: day.date, weekday: day.weekday, slots: day.slots.map((slot) => ({ start: slot.start, time: slot.time })) })),
      maxDaysAhead: page.max_days_ahead,
    });
  } catch (error) {
    console.error("[bookings] availability failed:", error instanceof Error ? error.message : error);
    return reply({ error: "unavailable" }, 500);
  }
}

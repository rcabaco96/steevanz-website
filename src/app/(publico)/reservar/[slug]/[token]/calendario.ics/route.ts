import { loadBundle } from "@/lib/establishments/store";
import { buildCalendar } from "@/lib/modules/bookings/calendar";
import { calendarEvent } from "@/lib/modules/bookings/notify";
import { getBookingByToken } from "@/lib/modules/bookings/store";
import { publicEstablishment } from "@/lib/modules/public";

/** The customer's booking as a calendar file (Apple Calendar, Outlook…). */
export async function GET(_request: Request, ctx: RouteContext<"/reservar/[slug]/[token]/calendario.ics">) {
  const { slug, token } = await ctx.params;
  const establishment = await publicEstablishment(slug, "bookings");
  const booking = establishment ? await getBookingByToken(token) : null;
  if (!establishment || !booking || booking.establishment_id !== establishment.id) return new Response("Not found", { status: 404 });
  const bundle = await loadBundle(establishment);
  const body = buildCalendar(establishment.name, [{ ...calendarEvent(booking, bundle), cancelled: booking.status === "cancelled" }]);
  return new Response(body, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="reserva-${establishment.slug}.ics"`,
      "Cache-Control": "private, no-store",
    },
  });
}

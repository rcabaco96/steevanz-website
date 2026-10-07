import { getEstablishment, loadBundle } from "@/lib/establishments/store";
import { buildCalendar } from "@/lib/modules/bookings/calendar";
import { bookingSummary } from "@/lib/modules/bookings/notify";
import type { EstablishmentBookingRow } from "@/lib/modules/bookings/store";
import { createServiceClient } from "@/lib/supabase/service";

const tokenPattern = /^[A-Za-z0-9]{20,64}$/;

/**
 * Private calendar subscription of an establishment's bookings (last 7 days and the next 90),
 * for Google Calendar / Outlook / Apple Calendar. The address is the secret: it can be renewed
 * in the bookings settings.
 */
export async function GET(_request: Request, ctx: RouteContext<"/api/agenda/[token]">) {
  const { token } = await ctx.params;
  const clean = token.replace(/\.ics$/, "");
  if (!tokenPattern.test(clean)) return new Response("Not found", { status: 404 });
  const client = createServiceClient();
  const { data: page } = await client.from("booking_pages").select("establishment_id").eq("calendar_token", clean).maybeSingle<{ establishment_id: string }>();
  const establishment = page ? await getEstablishment(page.establishment_id) : null;
  if (!establishment) return new Response("Not found", { status: 404 });
  const { data, error } = await client
    .from("establishment_bookings")
    .select("*")
    .eq("establishment_id", establishment.id)
    .gte("starts_at", new Date(Date.now() - 7 * 86_400_000).toISOString())
    .lt("starts_at", new Date(Date.now() + 90 * 86_400_000).toISOString())
    .order("starts_at")
    .limit(3000);
  if (error) return new Response("Unavailable", { status: 503 });
  const bundle = await loadBundle(establishment);
  const events = ((data ?? []) as EstablishmentBookingRow[]).map((booking) => ({
    uid: `reserva-${booking.id}`,
    start: booking.starts_at,
    end: booking.ends_at,
    title: `${booking.name} · ${bookingSummary(booking, bundle)}`,
    description: [booking.phone && `Tel.: ${booking.phone}`, booking.email && `Email: ${booking.email}`, booking.notes && `Notas: ${booking.notes}`]
      .filter(Boolean)
      .join("\n"),
    cancelled: booking.status === "cancelled",
  }));
  return new Response(buildCalendar(`Reservas ${establishment.name}`, events), {
    headers: { "Content-Type": "text/calendar; charset=utf-8", "Cache-Control": "private, no-store" },
  });
}

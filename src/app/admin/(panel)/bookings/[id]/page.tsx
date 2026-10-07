import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackLink, ContactActions, ContactDetails, PipelineEditor, TrackingDetails } from "@/components/admin/RecordDetail";
import { Panel } from "@/components/backoffice/ui";
import { updateBooking } from "@/lib/admin/actions";
import { requireAdmin } from "@/lib/admin/auth";
import { getBooking } from "@/lib/admin/queries";
import { formatSlotDate, formatSlotTime } from "@/lib/booking/format";
import { productLabel } from "@/lib/booking/labels";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Marcação" };

export default async function AdminBookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const booking = await getBooking(id);
  if (!booking) notFound();

  return (
    <>
      <BackLink href="/admin/bookings" label="Marcações" />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <p className="eyebrow">{productLabel(booking.product_id)}</p>
          <h1 className="display text-3xl sm:text-4xl">{booking.name}</h1>
          <p className="text-lg text-muted first-letter:uppercase">
            {formatSlotDate(booking.slot_start, "pt", site.timeZone)} ·{" "}
            <span className="tabular-nums">
              {formatSlotTime(booking.slot_start, "pt", site.timeZone)}–{formatSlotTime(booking.slot_end, "pt", site.timeZone)}
            </span>
          </p>
        </div>
        <ContactActions row={booking} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-6">
          <Panel title="Contacto">
            <ContactDetails row={booking} />
          </Panel>
          <Panel title="Origem">
            <TrackingDetails row={booking} />
          </Panel>
        </div>
        <div className="lg:sticky lg:top-36 lg:self-start">
          <PipelineEditor
            row={booking}
            action={updateBooking}
            cancelledHint="Marcar como “Cancelado” liberta o horário para novas marcações."
          />
        </div>
      </div>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { FilterBar } from "@/components/admin/FilterBar";
import { AdminPageHeader, EmptyState, StatusBadge } from "@/components/backoffice/ui";
import { buttonClasses } from "@/components/ui/Button";
import { requireAdmin } from "@/lib/admin/auth";
import { filtersToQuery, listBookings, parseFilters, type AdminSearchParams } from "@/lib/admin/queries";
import { formatSlotDate, formatSlotTime } from "@/lib/booking/format";
import { productLabel } from "@/lib/booking/labels";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Marcações" };

function hasEnded(iso: string): boolean {
  return new Date(iso).getTime() < Date.now();
}

export default async function AdminBookingsPage({ searchParams }: { searchParams: Promise<AdminSearchParams> }) {
  await requireAdmin();
  const filters = parseFilters(await searchParams);
  const bookings = await listBookings(filters);

  return (
    <>
      <AdminPageHeader
        title="Marcações"
        description={`${bookings.length} ${bookings.length === 1 ? "resultado" : "resultados"}`}
        actions={
          <a href={`/admin/export/bookings${filtersToQuery(filters)}`} className={buttonClasses("secondary", "sm")}>
            Exportar CSV
          </a>
        }
      />
      <FilterBar basePath="/admin/bookings" filters={filters} dateLabel="Demonstração" />

      {bookings.length ? (
        <ul className="card divide-y divide-line overflow-hidden">
          {bookings.map((booking) => {
            const past = hasEnded(booking.slot_end);
            return (
              <li key={booking.id}>
                <Link
                  href={`/admin/bookings/${booking.id}`}
                  className={`grid gap-2 px-4 py-4 transition-colors hover:bg-surface-2 sm:grid-cols-[11rem_1fr_auto] sm:items-center sm:gap-4 sm:px-5 ${past ? "opacity-70" : ""}`}
                >
                  <div className="flex items-baseline gap-2 sm:flex-col sm:gap-0">
                    <span className="font-semibold text-text tabular-nums">{formatSlotTime(booking.slot_start, "pt", site.timeZone)}</span>
                    <span className="text-sm text-muted first-letter:uppercase">{formatSlotDate(booking.slot_start, "pt", site.timeZone)}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-text">
                      {booking.name}
                      {booking.business_name ? <span className="font-normal text-muted"> · {booking.business_name}</span> : null}
                    </p>
                    <p className="truncate text-sm text-muted">
                      {productLabel(booking.product_id)} · {booking.email}
                    </p>
                  </div>
                  <StatusBadge status={booking.status} />
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <EmptyState>Nenhuma marcação encontrada.</EmptyState>
      )}
    </>
  );
}

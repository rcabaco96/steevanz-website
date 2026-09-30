import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { AdminPageHeader, EmptyState, Panel, StatusBadge } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { dashboardStats, type DashboardStats } from "@/lib/admin/queries";
import { formatSlotRange } from "@/lib/booking/format";
import { kindLabels, productLabel } from "@/lib/booking/labels";
import { pipelineStatuses } from "@/lib/booking/types";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Resumo" };

function StatTile({ label, value, detail, href }: { label: string; value: number; detail: string; href: string }) {
  return (
    <Link href={href} className="card card-interactive flex flex-col gap-1 p-4 sm:p-5">
      <span className="text-sm text-muted">{label}</span>
      <span className="display text-4xl tabular-nums sm:text-5xl">{value}</span>
      <span className="text-xs text-subtle">{detail}</span>
    </Link>
  );
}

function StatusBreakdown({ counts, basePath }: { counts: DashboardStats["bookings"]["byStatus"]; basePath: string }) {
  return (
    <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {pipelineStatuses.map((status) => (
        <li key={status}>
          <Link
            href={`${basePath}?status=${status}`}
            className="flex items-center justify-between gap-2 rounded-xl border border-line px-3 py-2.5 transition-colors hover:bg-surface-2"
          >
            <StatusBadge status={status} />
            <span className="font-semibold tabular-nums text-text">{counts[status]}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function ProductBars({ rows }: { rows: DashboardStats["byProduct"] }) {
  if (!rows.length) return <EmptyState>Ainda sem dados.</EmptyState>;
  const max = Math.max(...rows.map((row) => row.bookings + row.leads), 1);
  return (
    <ul className="flex flex-col gap-3">
      {rows.map((row) => {
        const total = row.bookings + row.leads;
        return (
          <li key={row.productId ?? "none"} className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="truncate text-text">{productLabel(row.productId)}</span>
              <span className="shrink-0 tabular-nums text-muted">
                <strong className="text-text">{total}</strong> · {row.bookings} marc. · {row.leads} ped.
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-surface-2" aria-hidden="true">
              <div className="h-full rounded-full bg-accent" style={{ width: `${Math.max((total / max) * 100, 2)}%` }} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default async function AdminDashboardPage() {
  await requireAdmin();
  const stats = await dashboardStats();

  return (
    <>
      <AdminPageHeader title="Resumo" description="Marcações de demonstração e pedidos de informação." />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Marcações · 7 dias" value={stats.bookings.last7} detail={`${stats.bookings.last30} nos últimos 30 dias`} href="/admin/bookings" />
        <StatTile label="Pedidos · 7 dias" value={stats.leads.last7} detail={`${stats.leads.last30} nos últimos 30 dias`} href="/admin/leads" />
        <StatTile label="Marcações novas" value={stats.bookings.byStatus.new} detail={`${stats.bookings.total} no total`} href="/admin/bookings?status=new" />
        <StatTile label="Pedidos novos" value={stats.leads.byStatus.new} detail={`${stats.leads.waitlist} em lista de espera`} href="/admin/leads?status=new" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel
          title="Próximas demonstrações"
          actions={
            <Link href="/admin/bookings" className="inline-flex items-center gap-1 text-sm font-semibold text-accent-text">
              Ver todas <ArrowRight size={15} />
            </Link>
          }
        >
          {stats.upcoming.length ? (
            <ul className="divide-y divide-line">
              {stats.upcoming.map((booking) => (
                <li key={booking.id}>
                  <Link href={`/admin/bookings/${booking.id}`} className="-mx-2 flex items-center justify-between gap-3 rounded-xl px-2 py-3 transition-colors hover:bg-surface-2">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-text">{booking.name}</p>
                      <p className="truncate text-sm text-muted first-letter:uppercase">
                        {formatSlotRange(booking.slot_start, booking.slot_end, "pt", site.timeZone)}
                      </p>
                    </div>
                    <StatusBadge status={booking.status} />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState>Sem demonstrações marcadas.</EmptyState>
          )}
        </Panel>

        <Panel
          title="Pedidos recentes"
          actions={
            <Link href="/admin/leads" className="inline-flex items-center gap-1 text-sm font-semibold text-accent-text">
              Ver todos <ArrowRight size={15} />
            </Link>
          }
        >
          {stats.recentLeads.length ? (
            <ul className="divide-y divide-line">
              {stats.recentLeads.map((lead) => (
                <li key={lead.id}>
                  <Link href={`/admin/leads/${lead.id}`} className="-mx-2 flex items-center justify-between gap-3 rounded-xl px-2 py-3 transition-colors hover:bg-surface-2">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-text">{lead.name}</p>
                      <p className="truncate text-sm text-muted">
                        {kindLabels[lead.kind]} · {productLabel(lead.product_id)}
                      </p>
                    </div>
                    <StatusBadge status={lead.status} />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState>Sem pedidos ainda.</EmptyState>
          )}
        </Panel>

        <Panel title="Marcações por estado">
          <StatusBreakdown counts={stats.bookings.byStatus} basePath="/admin/bookings" />
        </Panel>

        <Panel title="Pedidos por estado">
          <StatusBreakdown counts={stats.leads.byStatus} basePath="/admin/leads" />
        </Panel>

        <Panel title="Interesse por produto" className="lg:col-span-2">
          <ProductBars rows={stats.byProduct} />
        </Panel>
      </div>
    </>
  );
}

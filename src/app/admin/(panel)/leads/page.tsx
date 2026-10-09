import type { Metadata } from "next";
import Link from "next/link";
import { ContactsTabs } from "@/components/admin/ContactsTabs";
import { FilterBar } from "@/components/admin/FilterBar";
import { AdminPageHeader, EmptyState, StatusBadge } from "@/components/backoffice/ui";
import { buttonClasses } from "@/components/ui/Button";
import { requireAdmin } from "@/lib/admin/auth";
import { lisbonTimestamp } from "@/lib/admin/csv";
import { filtersToQuery, listLeads, parseFilters, type AdminSearchParams } from "@/lib/admin/queries";
import { kindLabels, productLabel } from "@/lib/booking/labels";

export const metadata: Metadata = { title: "Pedidos de informação" };

export default async function AdminLeadsPage({ searchParams }: { searchParams: Promise<AdminSearchParams> }) {
  await requireAdmin();
  const filters = parseFilters(await searchParams);
  const leads = await listLeads(filters);

  return (
    <>
      <AdminPageHeader
        title="Contactos"
        description="Demonstrações marcadas no site e pedidos de informação."
        actions={
          <a href={`/admin/export/leads${filtersToQuery(filters)}`} className={buttonClasses("secondary", "sm")}>
            Exportar CSV
          </a>
        }
      />
      <ContactsTabs current="leads" />
      <FilterBar basePath="/admin/leads" filters={filters} dateLabel="Recebido" showKind />
      <p className="-mt-2 text-sm text-muted">{`${leads.length} ${leads.length === 1 ? "pedido" : "pedidos"}`}</p>

      {leads.length ? (
        <ul className="card divide-y divide-line overflow-hidden">
          {leads.map((lead) => (
            <li key={lead.id}>
              <Link
                href={`/admin/leads/${lead.id}`}
                className="grid grid-cols-1 gap-2 px-4 py-4 transition-colors hover:bg-surface-2 sm:grid-cols-[11rem_1fr_auto] sm:items-center sm:gap-4 sm:px-5"
              >
                <div className="flex items-baseline gap-2 sm:flex-col sm:gap-0">
                  <span className="text-sm font-semibold text-text tabular-nums">{lisbonTimestamp(lead.created_at)}</span>
                  <span className="text-sm text-muted">{kindLabels[lead.kind]}</span>
                </div>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-text">
                    {lead.name}
                    {lead.business_name ? <span className="font-normal text-muted"> · {lead.business_name}</span> : null}
                  </p>
                  <p className="truncate text-sm text-muted">
                    {productLabel(lead.product_id)} · {lead.email}
                  </p>
                </div>
                <StatusBadge status={lead.status} />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState>Nenhum pedido encontrado.</EmptyState>
      )}
    </>
  );
}

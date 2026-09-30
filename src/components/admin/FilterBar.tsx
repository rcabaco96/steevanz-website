import Link from "next/link";
import { buttonClasses } from "@/components/ui/Button";
import { getProductCopy } from "@/content/product-copy";
import { products } from "@/content/products";
import type { ListFilters } from "@/lib/admin/queries";
import { kindLabels, statusLabels } from "@/lib/booking/labels";
import { leadKinds, pipelineStatuses } from "@/lib/booking/types";
import { adminInputClasses, adminLabelClasses } from "./ui";

interface FilterBarProps {
  basePath: string;
  filters: ListFilters;
  showKind?: boolean;
  dateLabel: string;
}

export function FilterBar({ basePath, filters, showKind = false, dateLabel }: FilterBarProps) {
  const activeCount = Object.values(filters).filter(Boolean).length;
  return (
    <details className="card group p-4 sm:p-5" open={activeCount > 0 ? true : undefined}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-text [&::-webkit-details-marker]:hidden">
        <span>
          Filtros
          {activeCount ? <span className="ml-2 rounded-full bg-accent-soft px-2 py-0.5 text-xs text-accent-text">{activeCount}</span> : null}
        </span>
        <span className="text-xs font-normal text-subtle group-open:hidden">Mostrar</span>
        <span className="hidden text-xs font-normal text-subtle group-open:inline">Esconder</span>
      </summary>
      <form method="get" action={basePath} className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        <label className={`${adminLabelClasses} sm:col-span-2`}>
          Pesquisa
          <input type="search" name="q" defaultValue={filters.q} placeholder="Nome, email, telemóvel…" className={`${adminInputClasses} h-11`} />
        </label>
        <label className={adminLabelClasses}>
          Estado
          <select name="status" defaultValue={filters.status} className={`${adminInputClasses} h-11`}>
            <option value="">Todos</option>
            {pipelineStatuses.map((status) => (
              <option key={status} value={status}>
                {statusLabels[status]}
              </option>
            ))}
          </select>
        </label>
        <label className={adminLabelClasses}>
          Produto
          <select name="product" defaultValue={filters.product} className={`${adminInputClasses} h-11`}>
            <option value="">Todos</option>
            <option value="none">Sem produto</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {getProductCopy(product.id, "pt").shortName}
              </option>
            ))}
          </select>
        </label>
        {showKind ? (
          <label className={adminLabelClasses}>
            Tipo
            <select name="kind" defaultValue={filters.kind} className={`${adminInputClasses} h-11`}>
              <option value="">Todos</option>
              {leadKinds.map((kind) => (
                <option key={kind} value={kind}>
                  {kindLabels[kind]}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        <label className={adminLabelClasses}>
          {dateLabel} de
          <input type="date" name="from" defaultValue={filters.from} className={`${adminInputClasses} h-11`} />
        </label>
        <label className={adminLabelClasses}>
          até
          <input type="date" name="to" defaultValue={filters.to} className={`${adminInputClasses} h-11`} />
        </label>
        <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-6">
          <button type="submit" className={buttonClasses("primary", "md")}>
            Aplicar
          </button>
          {activeCount ? (
            <Link href={basePath} className={buttonClasses("ghost", "md")}>
              Limpar
            </Link>
          ) : null}
        </div>
      </form>
    </details>
  );
}

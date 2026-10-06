import type { Metadata } from "next";
import Link from "next/link";
import { OrderList } from "@/components/account/OrderList";
import { AdminPageHeader, adminInputClasses } from "@/components/backoffice/ui";
import { buttonClasses } from "@/components/ui/Button";
import { orderStatusLabels, orderStatuses } from "@/lib/accounts/types";
import { requireAdmin } from "@/lib/admin/auth";
import { listOrders, parseOrderFilters, type AdminSearchParams } from "@/lib/admin/queries";

export const metadata: Metadata = { title: "Encomendas" };

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<AdminSearchParams> }) {
  await requireAdmin();
  const filters = parseOrderFilters(await searchParams);
  const orders = await listOrders(filters);

  return (
    <>
      <AdminPageHeader title="Encomendas" description={`${orders.length} ${orders.length === 1 ? "resultado" : "resultados"}`} />
      <form method="get" action="/admin/encomendas" className="flex flex-wrap gap-2">
        <input
          type="search"
          name="q"
          defaultValue={filters.q}
          aria-label="Pesquisar encomendas"
          placeholder="Referência, nome, email…"
          className={`${adminInputClasses} h-11 min-w-48 flex-1`}
        />
        <select name="status" defaultValue={filters.status} aria-label="Estado" className={`${adminInputClasses} h-11 w-auto`}>
          <option value="">Todos os estados</option>
          {orderStatuses.map((status) => (
            <option key={status} value={status}>
              {orderStatusLabels[status]}
            </option>
          ))}
        </select>
        <button type="submit" className={buttonClasses("primary", "md")}>
          Aplicar
        </button>
        {filters.q || filters.status ? (
          <Link href="/admin/encomendas" className={buttonClasses("ghost", "md")}>
            Limpar
          </Link>
        ) : null}
      </form>
      <OrderList orders={orders} showCustomer hrefFor={(order) => `/admin/encomendas/${order.id}`} empty="Nenhuma encomenda encontrada." />
    </>
  );
}

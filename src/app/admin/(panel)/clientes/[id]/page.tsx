import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SubscriptionBadge } from "@/components/account/badges";
import { OrderList } from "@/components/account/OrderList";
import { BackLink } from "@/components/admin/RecordDetail";
import { ActionForm, SubmitButton } from "@/components/backoffice/ActionForm";
import { adminInputClasses, adminLabelClasses } from "@/components/backoffice/ui";
import { AccountCard, AddProduct } from "@/components/admin/ClientDetail";
import { MailIcon, ProductGlyph } from "@/components/icons";
import { EstablishmentsAdminPanel } from "@/components/modules/shared/EstablishmentsAdminPanel";
import { productModules } from "@/components/modules/registry";
import { ModulePlaceholder } from "@/components/modules/ModulePlaceholder";
import { buttonClasses } from "@/components/ui/Button";
import { getProductCopy } from "@/content/product-copy";
import { getProduct, isProductId, products } from "@/content/products";
import { subscriptionStatusLabels, subscriptionStatuses, type ClientProductRow } from "@/lib/accounts/types";
import { removeClientProduct, saveClientProduct } from "@/lib/admin/actions";
import { requireAdmin } from "@/lib/admin/auth";
import { lisbonTimestamp } from "@/lib/admin/csv";
import { isPerSpace as perSpace } from "@/lib/cart/ownership";
import { getProfile, listClientOrders, listClientPanels, listClientProducts } from "@/lib/admin/queries";
import { coveredEstablishmentIds, listOwnerEstablishments } from "@/lib/establishments/store";

export const metadata: Metadata = { title: "Cliente" };

function initials(name: string): string {
  const parts = name.replace(/@.*/, "").split(/[\s._-]+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "?";
}

function SectionTitle({ id, title, hint }: { id: string; title: string; hint?: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <h2 id={id} className="text-lg font-semibold text-text">
        {title}
      </h2>
      {hint ? <p className="text-sm text-muted">{hint}</p> : null}
    </div>
  );
}

/** One product the client has: what it is, its state, and the way into it. */
function ProductCard({ row, ownerId }: { row: ClientProductRow; ownerId: string }) {
  const productId = isProductId(row.product_id) ? row.product_id : null;
  const hasModule = productId ? productModules[productId] !== ModulePlaceholder : false;
  return (
    <li className="card flex flex-col gap-4 p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {productId ? (
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent-text">
              <ProductGlyph icon={getProduct(productId).icon} size={19} />
            </span>
          ) : null}
          <div className="min-w-0">
            <p className="font-semibold text-text">{productId ? getProductCopy(productId, "pt").name : row.product_id}</p>
            <p className="text-xs text-subtle">
              Desde {lisbonTimestamp(row.activated_at)}
              {perSpace(row.product_id) ? ` · ${row.spaces} ${row.spaces === 1 ? "espaço" : "espaços"}` : ""}
            </p>
          </div>
        </div>
        <SubscriptionBadge status={row.status} />
      </div>
      {row.notes ? <p className="rounded-xl bg-surface-2/60 px-3 py-2 text-sm text-muted">{row.notes}</p> : null}
      <div className="mt-auto flex flex-wrap items-center gap-2">
        {productId ? (
          <Link href={`/admin/clientes/${ownerId}/${row.product_id}`} className={buttonClasses(hasModule ? "primary" : "secondary", "sm")}>
            {hasModule ? "Abrir" : "Ver"}
          </Link>
        ) : null}
        <details className="group w-full">
          <summary className="cursor-pointer list-none text-sm font-semibold text-muted hover:text-text">Alterar estado, notas ou remover</summary>
          <ActionForm
            key={`${row.status}:${row.notes ?? ""}:${row.spaces}`}
            action={saveClientProduct}
            className={`mt-3 grid grid-cols-1 gap-2 sm:items-end ${perSpace(row.product_id) ? "sm:grid-cols-[9rem_6rem_minmax(0,1fr)_auto]" : "sm:grid-cols-[9rem_minmax(0,1fr)_auto]"}`}
          >
            <input type="hidden" name="user_id" value={ownerId} />
            <input type="hidden" name="product_id" value={row.product_id} />
            <label className={adminLabelClasses}>
              Estado
              <select name="status" defaultValue={row.status} className={`${adminInputClasses} h-10`}>
                {subscriptionStatuses.map((status) => (
                  <option key={status} value={status}>
                    {subscriptionStatusLabels[status]}
                  </option>
                ))}
              </select>
            </label>
            {perSpace(row.product_id) ? (
              <label className={adminLabelClasses}>
                Espaços
                <input name="spaces" type="number" min={1} max={100} required defaultValue={row.spaces} className={`${adminInputClasses} h-10`} />
              </label>
            ) : (
              <input type="hidden" name="spaces" value={row.spaces} />
            )}
            <label className={adminLabelClasses}>
              Notas internas
              <input name="notes" defaultValue={row.notes ?? ""} maxLength={2000} className={`${adminInputClasses} h-10`} />
            </label>
            <SubmitButton size="sm" variant="secondary" pendingLabel="A guardar…">
              Guardar
            </SubmitButton>
          </ActionForm>
          <ActionForm
            action={removeClientProduct}
            confirmMessage={`Remover «${productId ? getProductCopy(productId, "pt").name : row.product_id}» deste cliente? Deixa de o ver na área de cliente. Os espaços e os dados (fila, cartões, reservas) ficam guardados.`}
            className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3"
          >
            <input type="hidden" name="user_id" value={ownerId} />
            <input type="hidden" name="product_id" value={row.product_id} />
            <span className="text-xs text-subtle">Adicionado por engano? Remova-o: suspender ou cancelar mantém o histórico.</span>
            <SubmitButton size="sm" variant="ghost" pendingLabel="A remover…" className="text-danger">
              Remover produto
            </SubmitButton>
          </ActionForm>
        </details>
      </div>
    </li>
  );
}

export default async function AdminClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const profile = await getProfile(id);
  if (!profile) notFound();
  const [owned, orders, panels, establishments] = await Promise.all([
    listClientProducts(profile.id),
    listClientOrders(profile),
    listClientPanels(profile.id),
    listOwnerEstablishments(profile.id),
  ]);
  const ownedIds = new Set(owned.map((row) => row.product_id));
  const moduleRows = owned.filter((row) => row.status === "active" && perSpace(row.product_id));
  const coverage = Object.fromEntries(
    await Promise.all(moduleRows.map(async (row) => [row.product_id, { spaces: row.spaces, ids: await coveredEstablishmentIds(profile.id, row.product_id) }] as const)),
  );
  const available = products.filter((product) => !ownedIds.has(product.id));
  const active = owned.filter((row) => row.status === "active");
  const displayName = profile.full_name ?? profile.email;

  return (
    <>
      <BackLink href="/admin/clientes" label="Clientes" />

      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <span aria-hidden="true" className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-accent-soft text-lg font-semibold text-accent-text">
            {initials(displayName)}
          </span>
          <div className="min-w-0">
            <h1 className="display text-3xl sm:text-4xl">{displayName}</h1>
            <p className="text-muted">
              {[profile.business_name, `${active.length} ${active.length === 1 ? "produto ativo" : "produtos ativos"}`].filter(Boolean).join(" · ")}
            </p>
          </div>
        </div>
        <a href={`mailto:${profile.email}`} className={buttonClasses("secondary", "sm", "self-start sm:self-auto")}>
          <MailIcon size={16} />
          Enviar email
        </a>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="flex min-w-0 flex-col gap-8">
          <section aria-labelledby="produtos-title" className="flex flex-col gap-3">
            <SectionTitle id="produtos-title" title="Produtos" hint="O que o cliente comprou. «Abrir» mostra a gestão tal como o cliente a vê." />
            <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {owned.map((row) => (
                <ProductCard key={row.id} row={row} ownerId={profile.id} />
              ))}
            </ul>
            {available.length ? <AddProduct ownerId={profile.id} available={available.map((product) => product.id)} open={!owned.length} /> : null}
          </section>

          <EstablishmentsAdminPanel ownerId={profile.id} establishments={establishments} activeProducts={active.map((row) => row.product_id)} coverage={coverage} />

          <section aria-labelledby="paineis-title" className="flex flex-col gap-3">
            <SectionTitle id="paineis-title" title="Painéis de reviews" />
            {panels.length ? (
              <ul className="card divide-y divide-line overflow-hidden">
                {panels.map((panel) => (
                  <li key={panel.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5">
                    <span className="font-semibold text-text">{panel.name}</span>
                    <span className="flex items-center gap-2">
                      <Link href={`/admin/reviews/${panel.id}`} className={buttonClasses("secondary", "sm")}>
                        Gerir
                      </Link>
                      <Link href={`/painel/${panel.slug}`} target="_blank" className={buttonClasses("ghost", "sm")}>
                        Abrir painel
                      </Link>
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted">
                Sem painéis. O acesso dá-se em{" "}
                <Link href="/admin/reviews" className="font-semibold text-accent-text hover:underline">
                  Reviews
                </Link>
                , na página de cada negócio.
              </p>
            )}
          </section>

          <section aria-labelledby="encomendas-title" className="flex flex-col gap-3">
            <SectionTitle id="encomendas-title" title="Encomendas" />
            <OrderList orders={orders} hrefFor={(order) => `/admin/encomendas/${order.id}`} empty="Sem encomendas." />
          </section>
        </div>

        <aside className="lg:sticky lg:top-36 lg:self-start">
          <AccountCard profile={profile} />
        </aside>
      </div>
    </>
  );
}

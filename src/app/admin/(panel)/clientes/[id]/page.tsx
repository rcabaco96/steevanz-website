import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SubscriptionBadge } from "@/components/account/badges";
import { OrderList } from "@/components/account/OrderList";
import { BackLink } from "@/components/admin/RecordDetail";
import { ActionForm, SubmitButton } from "@/components/backoffice/ActionForm";
import { DetailRow, EmptyState, Panel, adminInputClasses, adminLabelClasses } from "@/components/backoffice/ui";
import { MailIcon, ProductGlyph } from "@/components/icons";
import { buttonClasses } from "@/components/ui/Button";
import { getProductCopy } from "@/content/product-copy";
import { getProduct, isProductId, products } from "@/content/products";
import { subscriptionStatusLabels, subscriptionStatuses } from "@/lib/accounts/types";
import { saveClientProduct } from "@/lib/admin/actions";
import { requireAdmin } from "@/lib/admin/auth";
import { lisbonTimestamp } from "@/lib/admin/csv";
import { getProfile, listClientOrders, listClientPanels, listClientProducts } from "@/lib/admin/queries";

export const metadata: Metadata = { title: "Cliente" };

export default async function AdminClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const profile = await getProfile(id);
  if (!profile) notFound();
  const [owned, orders, panels] = await Promise.all([listClientProducts(profile.id), listClientOrders(profile), listClientPanels(profile.id)]);
  const ownedIds = new Set(owned.map((row) => row.product_id));
  const available = products.filter((product) => !ownedIds.has(product.id));

  return (
    <>
      <BackLink href="/admin/clientes" label="Clientes" />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <p className="eyebrow">Cliente</p>
          <h1 className="display text-3xl sm:text-4xl">{profile.full_name ?? profile.email}</h1>
          {profile.business_name ? <p className="text-lg text-muted">{profile.business_name}</p> : null}
        </div>
        <a href={`mailto:${profile.email}`} className={buttonClasses("primary", "sm")}>
          <MailIcon size={16} />
          Email
        </a>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-6">
          <Panel title="Painéis de reviews">
            {panels.length ? (
              <ul className="flex flex-col divide-y divide-line">
                {panels.map((panel) => (
                  <li key={panel.id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                    <span className="font-semibold text-text">{panel.name}</span>
                    <span className="flex items-center gap-4 text-sm">
                      <Link href={`/admin/reviews/${panel.id}`} className="font-semibold text-accent-text hover:underline">
                        Gerir
                      </Link>
                      <Link href={`/painel/${panel.slug}`} target="_blank" className="font-semibold text-muted hover:text-text">
                        Abrir painel
                      </Link>
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState>Sem painéis. O acesso dá-se na página do negócio, em Reviews.</EmptyState>
            )}
          </Panel>
          <Panel title="Produtos">
            {owned.length ? (
              <ul className="flex flex-col divide-y divide-line">
                {owned.map((row) => {
                  const productId = isProductId(row.product_id) ? row.product_id : null;
                  return (
                    <li key={row.id} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          {productId ? (
                            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent-text">
                              <ProductGlyph icon={getProduct(productId).icon} size={18} />
                            </span>
                          ) : null}
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-text">{productId ? getProductCopy(productId, "pt").name : row.product_id}</p>
                            <p className="text-xs text-subtle">Desde {lisbonTimestamp(row.activated_at)}</p>
                          </div>
                        </div>
                        <SubscriptionBadge status={row.status} />
                      </div>
                      <ActionForm action={saveClientProduct} className="flex flex-wrap items-end gap-2">
                        <input type="hidden" name="user_id" value={profile.id} />
                        <input type="hidden" name="product_id" value={row.product_id} />
                        <label className={`${adminLabelClasses} w-36`}>
                          Estado
                          <select name="status" defaultValue={row.status} className={`${adminInputClasses} h-10`}>
                            {subscriptionStatuses.map((status) => (
                              <option key={status} value={status}>
                                {subscriptionStatusLabels[status]}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className={`${adminLabelClasses} min-w-40 flex-1`}>
                          Notas
                          <input name="notes" defaultValue={row.notes ?? ""} maxLength={2000} className={`${adminInputClasses} h-10`} />
                        </label>
                        <SubmitButton size="sm" variant="secondary" pendingLabel="…">
                          Guardar
                        </SubmitButton>
                        {productId ? (
                          <Link href={`/admin/clientes/${profile.id}/${row.product_id}`} className={buttonClasses("ghost", "sm")}>
                            Abrir módulo
                          </Link>
                        ) : null}
                      </ActionForm>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <EmptyState>Este cliente ainda não tem produtos.</EmptyState>
            )}
            {available.length ? (
              <ActionForm action={saveClientProduct} className="mt-5 flex flex-wrap items-end gap-2 border-t border-line pt-5">
                <input type="hidden" name="user_id" value={profile.id} />
                <input type="hidden" name="status" value="active" />
                <label className={`${adminLabelClasses} min-w-48 flex-1`}>
                  Adicionar produto
                  <select name="product_id" required defaultValue="" className={`${adminInputClasses} h-11`}>
                    <option value="" disabled>
                      Escolher…
                    </option>
                    {available.map((product) => (
                      <option key={product.id} value={product.id}>
                        {getProductCopy(product.id, "pt").name}
                      </option>
                    ))}
                  </select>
                </label>
                <SubmitButton pendingLabel="A adicionar…">Ativar</SubmitButton>
              </ActionForm>
            ) : null}
          </Panel>

          <Panel title="Encomendas">
            <OrderList orders={orders} hrefFor={(order) => `/admin/encomendas/${order.id}`} empty="Sem encomendas." />
          </Panel>
        </div>

        <div className="lg:sticky lg:top-36 lg:self-start">
          <Panel title="Conta">
            <dl>
              <DetailRow label="Nome">{profile.full_name}</DetailRow>
              <DetailRow label="Email">{profile.email}</DetailRow>
              <DetailRow label="Telemóvel">{profile.phone}</DetailRow>
              <DetailRow label="Negócio">{profile.business_name}</DetailRow>
              <DetailRow label="NIF">{profile.nif}</DetailRow>
              <DetailRow label="Registo">{lisbonTimestamp(profile.created_at)}</DetailRow>
            </dl>
          </Panel>
        </div>
      </div>
    </>
  );
}

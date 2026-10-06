import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OrderStatusBadge } from "@/components/account/badges";
import { orderSummary } from "@/components/account/OrderList";
import { BackLink, ContactActions } from "@/components/admin/RecordDetail";
import { ActionForm, SubmitButton } from "@/components/backoffice/ActionForm";
import { DetailRow, Panel, adminInputClasses, adminLabelClasses } from "@/components/backoffice/ui";
import { orderStatusLabels, orderStatuses } from "@/lib/accounts/types";
import { updateOrder } from "@/lib/admin/actions";
import { requireAdmin } from "@/lib/admin/auth";
import { lisbonTimestamp } from "@/lib/admin/csv";
import { accountForOrder, getOrder } from "@/lib/admin/queries";
import { productLabel, sectorLabel } from "@/lib/booking/labels";
import { formatCents } from "@/lib/cart/pricing";

export const metadata: Metadata = { title: "Encomenda" };

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();
  const account = await accountForOrder(order);

  return (
    <>
      <BackLink href="/admin/encomendas" label="Encomendas" />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <p className="eyebrow font-mono">{order.reference}</p>
          <h1 className="display text-3xl sm:text-4xl">{order.name}</h1>
          <p className="text-lg text-muted">{orderSummary(order) || "Valor sob proposta"}</p>
        </div>
        <ContactActions row={order} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-6">
          <Panel title="Artigos">
            <ul className="flex flex-col divide-y divide-line">
              {order.items.map((item, index) => (
                <li key={`${item.productId}-${index}`} className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="font-semibold text-text">
                      {productLabel(item.productId)} <span className="font-normal text-muted">× {item.quantity}</span>
                    </p>
                    {item.details.length ? <p className="text-sm whitespace-pre-line text-muted">{item.details.join("\n")}</p> : null}
                  </div>
                  <span className="shrink-0 text-sm text-text tabular-nums">
                    {formatCents(item.subtotalCents, "pt")}
                    {item.billing === "monthly" ? "/mês" : ""}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 border-t border-line pt-3 text-xs text-subtle">Valores s/ IVA por linha. Totais com IVA: {orderSummary(order) || "—"}.</p>
          </Panel>
          <Panel title="Contacto">
            <dl>
              <DetailRow label="Nome">{order.name}</DetailRow>
              <DetailRow label="Email">{order.email}</DetailRow>
              <DetailRow label="Telemóvel">{order.phone}</DetailRow>
              <DetailRow label="Negócio">{order.business_name}</DetailRow>
              <DetailRow label="Setor">{sectorLabel(order.sector)}</DetailRow>
              <DetailRow label="Mensagem">{order.message}</DetailRow>
              <DetailRow label="Recebida">{lisbonTimestamp(order.created_at)}</DetailRow>
            </dl>
          </Panel>
        </div>

        <div className="flex flex-col gap-6 lg:sticky lg:top-36 lg:self-start">
          <Panel title="Conta">
            {account ? (
              <p className="text-sm text-muted">
                <Link href={`/admin/clientes/${account.id}`} className="font-semibold text-accent-text underline-offset-4 hover:underline">
                  {account.full_name ?? account.email}
                </Link>
                {order.user_id ? " · encomenda feita com sessão iniciada." : " · conta com o mesmo email (encomenda feita sem sessão)."}
              </p>
            ) : (
              <p className="text-sm text-muted">
                Não há conta com <strong className="text-text">{order.email}</strong>. Para aceitar e ativar os produtos, o cliente tem de criar conta com
                este email.
              </p>
            )}
          </Panel>
          <Panel title="Estado" actions={<OrderStatusBadge status={order.status} />}>
            <ActionForm action={updateOrder} className="flex flex-col gap-4">
              <input type="hidden" name="id" value={order.id} />
              <label className={adminLabelClasses}>
                Estado
                <select name="status" defaultValue={order.status} className={`${adminInputClasses} h-11`}>
                  {orderStatuses.map((status) => (
                    <option key={status} value={status}>
                      {orderStatusLabels[status]}
                    </option>
                  ))}
                </select>
              </label>
              <p className="-mt-2 text-xs text-subtle">Ao marcar como “Aceite”, os produtos da encomenda ficam ativos na área de cliente.</p>
              <label className={adminLabelClasses}>
                Notas internas
                <textarea
                  name="admin_notes"
                  rows={5}
                  maxLength={5000}
                  defaultValue={order.admin_notes ?? ""}
                  className={`${adminInputClasses} resize-y py-2.5 leading-relaxed`}
                />
              </label>
              <SubmitButton pendingLabel="A guardar…" className="self-start">
                Guardar
              </SubmitButton>
            </ActionForm>
          </Panel>
        </div>
      </div>
    </>
  );
}

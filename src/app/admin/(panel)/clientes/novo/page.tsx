import type { Metadata } from "next";
import { BackLink } from "@/components/admin/RecordDetail";
import { ActionForm, SubmitButton } from "@/components/backoffice/ActionForm";
import { AdminPageHeader, adminInputClasses, adminLabelClasses } from "@/components/backoffice/ui";
import { ProductGlyph } from "@/components/icons";
import { getProductCopy } from "@/content/product-copy";
import { products } from "@/content/products";
import { createClientAccount } from "@/lib/admin/actions";
import { requireAdmin } from "@/lib/admin/auth";

export const metadata: Metadata = { title: "Novo cliente" };

export default async function AdminNewClientPage() {
  await requireAdmin();
  const input = `${adminInputClasses} h-11`;
  return (
    <>
      <BackLink href="/admin/clientes" label="Clientes" />
      <AdminPageHeader title="Novo cliente" description="Cria a conta sem password e sem enviar email. Se escolher a lista de espera, o cartão ou as reservas, o espaço do cliente fica logo criado. Envie-lhe o acesso quando quiser." />
      <ActionForm action={createClientAccount} className="card flex max-w-3xl flex-col gap-6 p-5 sm:p-6">
        <fieldset className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <legend className="mb-3 text-lg font-semibold text-text">Dono do negócio</legend>
          <label className={adminLabelClasses}>
            Nome
            <input name="full_name" required maxLength={120} autoComplete="off" placeholder="Ana Ferreira" className={input} />
          </label>
          <label className={adminLabelClasses}>
            Email
            <input name="email" type="email" required maxLength={200} autoComplete="off" placeholder="ana@cafecentral.pt" className={input} />
            <span className="text-xs font-normal text-subtle">É com este email que o cliente entra.</span>
          </label>
          <label className={adminLabelClasses}>
            Negócio
            <input name="business_name" maxLength={160} placeholder="Café Central" className={input} />
          </label>
          <label className={adminLabelClasses}>
            Telemóvel
            <input name="phone" type="tel" maxLength={40} placeholder="912 345 678" className={input} />
          </label>
          <label className={adminLabelClasses}>
            NIF
            <input name="nif" inputMode="numeric" maxLength={20} className={input} />
          </label>
        </fieldset>

        <fieldset className="flex flex-col gap-3 border-t border-line pt-5">
          <legend className="sr-only">Produtos</legend>
          <div>
            <p className="text-lg font-semibold text-text">Produtos</p>
            <p className="text-sm text-muted">Opcional. Os que escolher ficam já ativos; pode mudar depois.</p>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <label
                key={product.id}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-line px-3 py-2.5 transition-colors hover:bg-surface-2 has-[:checked]:border-accent has-[:checked]:bg-accent-soft/50 has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-accent/20"
              >
                <input type="checkbox" name="products" value={product.id} className="peer sr-only" />
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-surface-2 text-muted peer-checked:bg-accent peer-checked:text-accent-contrast">
                  <ProductGlyph icon={product.icon} size={16} />
                </span>
                <span className="min-w-0 text-sm font-semibold text-text">{getProductCopy(product.id, "pt").name}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="border-t border-line pt-5">
          <SubmitButton pendingLabel="A criar…">Criar cliente</SubmitButton>
        </div>
      </ActionForm>
    </>
  );
}

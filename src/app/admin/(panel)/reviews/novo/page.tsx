import type { Metadata } from "next";
import Link from "next/link";
import { ActionForm, SubmitButton } from "@/components/backoffice/ActionForm";
import { MapsLinkField } from "@/components/admin/MapsLinkField";
import { AdminPageHeader, adminInputClasses, adminLabelClasses, Panel } from "@/components/backoffice/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { createBusinessFromMapsLink } from "@/lib/admin/review-actions";

export const metadata: Metadata = { title: "Novo negócio" };

export default async function NewReviewBusinessPage() {
  await requireAdmin();
  return (
    <>
      <AdminPageHeader
        title="Novo negócio"
        description="Basta o link do Google Maps."
        actions={
          <Link href="/admin/reviews" className="text-sm font-semibold text-muted hover:text-text">
            ← Voltar à lista
          </Link>
        }
      />
      <Panel>
        <ActionForm action={createBusinessFromMapsLink} className="flex flex-col gap-4">
          <MapsLinkField inputClassName={adminInputClasses} labelClassName={adminLabelClasses} />
          <p className="-mt-1 text-xs text-subtle">
            O nome e o endereço do painel saem do link, e a primeira importação vai buscar as reviews, a nota, a categoria e a concorrência. O resto (email de
            alertas, placas, serviços) acrescenta-se depois, na página do negócio.
          </p>
          <fieldset className="flex flex-col gap-3 rounded-2xl border border-line p-4">
            <legend className="px-1 text-sm font-semibold text-text">Dono do negócio (opcional)</legend>
            <p className="-mt-1 text-xs text-subtle">
              Com email, a conta do cliente fica criada já, mas nada lhe é enviado: o convite envia-se depois, na página do negócio. Sem email, fica só o contacto.
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className={adminLabelClasses}>
                Nome
                <input name="contact_name" maxLength={120} autoComplete="off" className={`${adminInputClasses} h-11`} />
              </label>
              <label className={adminLabelClasses}>
                Telefone
                <input name="contact_phone" type="tel" maxLength={40} autoComplete="off" className={`${adminInputClasses} h-11`} />
              </label>
              <label className={`${adminLabelClasses} sm:col-span-2`}>
                Email
                <input name="email" type="email" maxLength={200} autoComplete="off" placeholder="dono@negocio.pt" className={`${adminInputClasses} h-11`} />
              </label>
            </div>
          </fieldset>
          <SubmitButton>Criar negócio</SubmitButton>
        </ActionForm>
      </Panel>
    </>
  );
}

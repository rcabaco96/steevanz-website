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
          <SubmitButton>Criar negócio</SubmitButton>
        </ActionForm>
      </Panel>
    </>
  );
}

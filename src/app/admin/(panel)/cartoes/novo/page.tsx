import type { Metadata } from "next";
import { BackLink } from "@/components/admin/RecordDetail";
import { CardForm } from "@/components/admin/cards/CardForm";
import { AdminPageHeader } from "@/components/backoffice/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { cardProductHrefs } from "../shared";

export const metadata: Metadata = { title: "Novo cartão de visita" };

export default async function AdminNewBusinessCardPage() {
  await requireAdmin();
  return (
    <>
      <BackLink href="/admin/cartoes" label="Cartões de visita" />
      <AdminPageHeader title="Novo cartão de visita" description="Os dados da pessoa, como aparecem na página do cartão. A pré-visualização mostra o resultado enquanto escreve." />
      <CardForm productHrefs={cardProductHrefs()} />
    </>
  );
}

import type { Metadata } from "next";
import { BackLink } from "@/components/admin/RecordDetail";
import { TagForm } from "@/components/admin/cards/TagForm";
import { AdminPageHeader } from "@/components/backoffice/ui";
import { requireAdmin } from "@/lib/admin/auth";

export const metadata: Metadata = { title: "Nova tag" };

export default async function AdminNewKeychainTagPage() {
  await requireAdmin();
  return (
    <>
      <BackLink href="/admin/tags" label="Porta-chaves / Tags" />
      <AdminPageHeader title="Nova tag" description="Um porta-chaves ou tag: o nome, o código do endereço e para onde abre." />
      <TagForm />
    </>
  );
}

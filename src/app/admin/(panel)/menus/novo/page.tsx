import type { Metadata } from "next";
import { BackLink } from "@/components/admin/RecordDetail";
import { MenuDetailsForm } from "@/components/admin/menus/MenuDetailsForm";
import { AdminPageHeader } from "@/components/backoffice/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { listReviewBusinessOptions } from "@/lib/video-menus/store";

export const metadata: Metadata = { title: "Novo menu em vídeo" };

export default async function AdminNewVideoMenuPage() {
  await requireAdmin();
  const businesses = await listReviewBusinessOptions();
  return (
    <>
      <BackLink href="/admin/menus" label="Menus em vídeo" />
      <AdminPageHeader title="Novo menu em vídeo" description="Primeiro os dados do negócio; a seguir, na página do menu, junta os pratos (cada um com o seu vídeo) e as coleções." />
      <section className="card max-w-3xl p-5 sm:p-6">
        <MenuDetailsForm businesses={businesses} />
      </section>
    </>
  );
}

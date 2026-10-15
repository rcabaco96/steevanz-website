import type { Metadata } from "next";
import { BackLink } from "@/components/admin/RecordDetail";
import { MenusNotReady } from "@/components/admin/menus/MenuBits";
import { MenuEditor } from "@/components/admin/menus/MenuEditor";
import { EmptyState } from "@/components/backoffice/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { getAdminMenu, listReviewBusinessOptions, MenusNotReadyError, type AdminMenu } from "@/lib/video-menus/store";

export const metadata: Metadata = { title: "Menu em vídeo" };

export default async function AdminVideoMenuPage({ params }: PageProps<"/admin/menus/[id]">) {
  await requireAdmin();
  const { id } = await params;
  let data: AdminMenu | null = null;
  try {
    data = await getAdminMenu(id);
  } catch (error) {
    if (!(error instanceof MenusNotReadyError)) throw error;
    return (
      <>
        <BackLink href="/admin/menus" label="Menus em vídeo" />
        <MenusNotReady />
      </>
    );
  }
  if (!data) {
    return (
      <>
        <BackLink href="/admin/menus" label="Menus em vídeo" />
        <EmptyState>Este menu já não existe.</EmptyState>
      </>
    );
  }
  const businesses = await listReviewBusinessOptions();
  return <MenuEditor data={data} businesses={businesses} />;
}

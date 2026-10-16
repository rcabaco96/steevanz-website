import type { Metadata } from "next";
import Link from "next/link";
import { MenuList, MenusNotReady } from "@/components/admin/menus/MenuBits";
import { AdminPageHeader, EmptyState } from "@/components/backoffice/ui";
import { PlusIcon } from "@/components/icons";
import { buttonClasses } from "@/components/ui/Button";
import { requireAdmin } from "@/lib/admin/auth";
import { listMenus, MenusNotReadyError, type AdminMenuListItem } from "@/lib/video-menus/store";

export const metadata: Metadata = { title: "Menus em vídeo" };

export default async function AdminVideoMenusPage() {
  await requireAdmin();
  let menus: AdminMenuListItem[] | null = null;
  try {
    menus = await listMenus();
  } catch (error) {
    if (!(error instanceof MenusNotReadyError)) throw error;
  }

  return (
    <>
      <AdminPageHeader
        title="Menus em vídeo"
        description={menus ? `${menus.length} ${menus.length === 1 ? "menu" : "menus"} · cada prato com o seu vídeo` : undefined}
        actions={
          <Link href="/admin/menus/novo" className={buttonClasses("primary", "md")}>
            <PlusIcon size={16} />
            Novo menu
          </Link>
        }
      />
      {!menus ? (
        <MenusNotReady />
      ) : menus.length ? (
        <MenuList menus={menus} />
      ) : (
        <EmptyState>Ainda não há menus. Crie o primeiro com «Novo menu».</EmptyState>
      )}
    </>
  );
}

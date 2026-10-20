import type { Metadata } from "next";
import Link from "next/link";
import { CardsNotReady } from "@/components/admin/cards/CardsBits";
import { TagList } from "@/components/admin/cards/TagList";
import { AdminPageHeader, EmptyState } from "@/components/backoffice/ui";
import { PlusIcon } from "@/components/icons";
import { buttonClasses } from "@/components/ui/Button";
import { requireAdmin } from "@/lib/admin/auth";
import type { KeychainTagRow } from "@/lib/business-cards/rules";
import { CardsNotReadyError, listTags } from "@/lib/business-cards/store";

export const metadata: Metadata = { title: "Porta-chaves / Tags" };

export default async function AdminKeychainTagsPage() {
  await requireAdmin();
  let tags: KeychainTagRow[] | null = null;
  try {
    tags = await listTags();
  } catch (error) {
    if (!(error instanceof CardsNotReadyError)) throw error;
  }

  return (
    <>
      <AdminPageHeader
        title="Porta-chaves / Tags"
        description="Cada tag guarda um endereço curto da Steevanz; aqui escolhe para onde abre (WhatsApp, Instagram, site…) e pode mudar quando quiser."
        actions={
          <Link href="/admin/tags/novo" className={buttonClasses("primary", "md")}>
            <PlusIcon size={16} />
            Nova tag
          </Link>
        }
      />
      {!tags ? <CardsNotReady what="tags" /> : tags.length ? <TagList tags={tags} /> : <EmptyState>Ainda não há tags. Crie a primeira com «Nova tag».</EmptyState>}
    </>
  );
}

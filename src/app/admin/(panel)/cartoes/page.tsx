import type { Metadata } from "next";
import Link from "next/link";
import { CardList } from "@/components/admin/cards/CardList";
import { CardsNotReady } from "@/components/admin/cards/CardsBits";
import { AdminPageHeader, EmptyState } from "@/components/backoffice/ui";
import { PlusIcon } from "@/components/icons";
import { buttonClasses } from "@/components/ui/Button";
import { requireAdmin } from "@/lib/admin/auth";
import type { BusinessCardRow } from "@/lib/business-cards/rules";
import { CardsNotReadyError, listCards } from "@/lib/business-cards/store";

export const metadata: Metadata = { title: "Cartões de visita" };

export default async function AdminBusinessCardsPage() {
  await requireAdmin();
  let cards: BusinessCardRow[] | null = null;
  try {
    cards = await listCards();
  } catch (error) {
    if (!(error instanceof CardsNotReadyError)) throw error;
  }

  return (
    <>
      <AdminPageHeader
        title="Cartões de visita"
        description="A página de contacto de cada pessoa, o endereço para programar o cartão e o QR."
        actions={
          <Link href="/admin/cartoes/novo" className={buttonClasses("primary", "md")}>
            <PlusIcon size={16} />
            Novo cartão
          </Link>
        }
      />
      {!cards ? (
        <CardsNotReady what="cards" />
      ) : cards.length ? (
        <CardList cards={cards} />
      ) : (
        <EmptyState>Ainda não há cartões. Crie o primeiro com «Novo cartão».</EmptyState>
      )}
    </>
  );
}

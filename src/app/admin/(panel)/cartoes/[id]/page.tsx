import type { Metadata } from "next";
import { BackLink } from "@/components/admin/RecordDetail";
import { ActiveBadge } from "@/components/admin/cards/ActiveToggle";
import { CardForm } from "@/components/admin/cards/CardForm";
import { CardsNotReady, DeleteForm, OpenLink, ProgramPanel } from "@/components/admin/cards/CardsBits";
import { FormMessage } from "@/components/backoffice/ActionForm";
import { AdminPageHeader, EmptyState } from "@/components/backoffice/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { deleteCard } from "@/lib/business-cards/actions";
import { cardPublicPath, cardVCardPath, type BusinessCardRow } from "@/lib/business-cards/rules";
import { CardsNotReadyError, getAdminCard } from "@/lib/business-cards/store";
import { cardProductHrefs } from "../shared";

export const metadata: Metadata = { title: "Cartão de visita" };

type Props = { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function AdminBusinessCardPage({ params, searchParams }: Props) {
  await requireAdmin();
  const [{ id }, query] = await Promise.all([params, searchParams]);
  let card: BusinessCardRow | null = null;
  try {
    card = await getAdminCard(id);
  } catch (error) {
    if (!(error instanceof CardsNotReadyError)) throw error;
    return (
      <>
        <BackLink href="/admin/cartoes" label="Cartões de visita" />
        <CardsNotReady what="cards" />
      </>
    );
  }
  if (!card) {
    return (
      <>
        <BackLink href="/admin/cartoes" label="Cartões de visita" />
        <EmptyState>Este cartão já não existe.</EmptyState>
      </>
    );
  }
  const line = [card.role, card.company, card.client_name ? `Cliente: ${card.client_name}` : ""].filter(Boolean).join(" · ");
  return (
    <>
      <BackLink href="/admin/cartoes" label="Cartões de visita" />
      <AdminPageHeader title={card.name} description={line || undefined} actions={<ActiveBadge active={card.active} />} />
      {query.criado ? <FormMessage ok message="Cartão criado. Programe o cartão com o endereço abaixo." /> : null}
      <ProgramPanel
        path={cardPublicPath(card.slug)}
        title="Programar o cartão"
        hint={card.active ? "Este é o endereço a gravar no cartão (toque) e no QR impresso." : "O cartão está desligado: o endereço só abre depois de o ativar."}
        qrLabel={`Código QR do cartão de ${card.name}`}
      >
        <OpenLink href={cardPublicPath(card.slug)}>Abrir página</OpenLink>
        <OpenLink href={cardVCardPath(card.slug)} download>
          Descarregar vCard
        </OpenLink>
      </ProgramPanel>
      <CardForm card={card} productHrefs={cardProductHrefs()} />
      <DeleteForm action={deleteCard} id={card.id} label="Apagar cartão" message="Apagar o cartão tira a página do ar: quem tocar no cartão vê «página não encontrada»." />
    </>
  );
}

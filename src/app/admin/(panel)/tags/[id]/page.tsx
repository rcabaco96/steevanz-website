import type { Metadata } from "next";
import { BackLink } from "@/components/admin/RecordDetail";
import { ActiveBadge } from "@/components/admin/cards/ActiveToggle";
import { CardsNotReady, DeleteForm, OpenLink, ProgramPanel } from "@/components/admin/cards/CardsBits";
import { TagForm } from "@/components/admin/cards/TagForm";
import { FormMessage } from "@/components/backoffice/ActionForm";
import { AdminPageHeader, EmptyState } from "@/components/backoffice/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { deleteTag } from "@/lib/business-cards/actions";
import { tagPublicPath, type KeychainTagRow } from "@/lib/business-cards/rules";
import { CardsNotReadyError, getAdminTag } from "@/lib/business-cards/store";

export const metadata: Metadata = { title: "Tag" };

type Props = { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

const taps = new Intl.NumberFormat("pt-PT");
const when = new Intl.DateTimeFormat("pt-PT", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Lisbon" });

export default async function AdminKeychainTagPage({ params, searchParams }: Props) {
  await requireAdmin();
  const [{ id }, query] = await Promise.all([params, searchParams]);
  let tag: KeychainTagRow | null = null;
  try {
    tag = await getAdminTag(id);
  } catch (error) {
    if (!(error instanceof CardsNotReadyError)) throw error;
    return (
      <>
        <BackLink href="/admin/tags" label="Porta-chaves / Tags" />
        <CardsNotReady what="tags" />
      </>
    );
  }
  if (!tag) {
    return (
      <>
        <BackLink href="/admin/tags" label="Porta-chaves / Tags" />
        <EmptyState>Esta tag já não existe.</EmptyState>
      </>
    );
  }
  const tapLine = `${taps.format(tag.tap_count)} ${tag.tap_count === 1 ? "toque" : "toques"}${tag.last_tap_at ? ` · o último a ${when.format(new Date(tag.last_tap_at))}` : ""}`;
  return (
    <>
      <BackLink href="/admin/tags" label="Porta-chaves / Tags" />
      <AdminPageHeader title={tag.label} description={tapLine} actions={<ActiveBadge active={tag.active} feminine />} />
      {query.criada ? <FormMessage ok message="Tag criada. Programe a tag com o endereço abaixo." /> : null}
      <ProgramPanel
        path={tagPublicPath(tag.code)}
        title="Programar a tag"
        hint={tag.active ? "Grave este endereço na tag. Se mudar o destino mais tarde, a tag não precisa de ser reprogramada." : "A tag está desligada: o endereço só abre depois de a ativar."}
        qrLabel={`Código QR da tag ${tag.label}`}
        qrOptional
      >
        <OpenLink href={tagPublicPath(tag.code)}>Testar a tag</OpenLink>
      </ProgramPanel>
      <TagForm tag={tag} />
      <DeleteForm action={deleteTag} id={tag.id} label="Apagar tag" message="Apagar a tag faz com que quem lhe tocar veja «página não encontrada»." />
    </>
  );
}

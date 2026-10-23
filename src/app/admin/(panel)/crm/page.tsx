import type { Metadata } from "next";
import Link from "next/link";
import { ContactsTabs } from "@/components/admin/ContactsTabs";
import { CrmBoard } from "@/components/admin/crm/CrmBoard";
import type { ProductOption } from "@/components/admin/crm/CrmRow";
import { ActionForm, SubmitButton } from "@/components/backoffice/ActionForm";
import { AdminPageHeader, EmptyState, adminInputClasses, adminLabelClasses } from "@/components/backoffice/ui";
import { buttonClasses } from "@/components/ui/Button";
import { getProductCopy } from "@/content/product-copy";
import { productFamilies, products } from "@/content/products";
import { ui } from "@/content/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { listKey, siteStatusLabels } from "@/lib/prospects/crm";
import { saveWhatsAppSettingsAction } from "@/lib/prospects/crm-actions";
import { getProspectSettings, listCrmLists, listCrmProspects } from "@/lib/prospects/store";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = { title: "CRM" };

/** Every Steevanz product with the link to its page on the site, by family, for «Enviar produto». */
function productOptions(): ProductOption[] {
  return productFamilies.flatMap((family) =>
    products
      .filter((product) => product.family === family)
      .map((product) => ({ id: product.id, name: getProductCopy(product.id, "pt").name, family: ui.pt.nav.families[family], url: absoluteUrl(`/produtos/${product.slug.pt}`) })),
  );
}

export default async function AdminCrmPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const me = await requireAdmin();
  const params = await searchParams;
  const asked = listKey(String((Array.isArray(params.lista) ? params.lista[0] : params.lista) ?? ""));
  const lists = await listCrmLists();
  // Without a choice: the list with most businesses (each zone on its own), or every list with «todas».
  const list = asked === "todas" ? null : (lists.find((item) => item.key === asked) ?? [...lists].sort((a, b) => b.count - a.count)[0] ?? null);
  const [prospects, settings] = await Promise.all([listCrmProspects(list), getProspectSettings()]);
  const total = lists.reduce((sum, item) => sum + item.count, 0);
  const chip = (active: boolean) =>
    `inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-sm font-semibold transition-colors ${active ? "border-accent bg-accent-soft text-accent-text" : "border-line bg-surface text-muted hover:text-text"}`;
  const input = `${adminInputClasses} min-h-11 py-2 text-base sm:text-sm`;

  return (
    <>
      <AdminPageHeader title="Contactos" description="Demonstrações marcadas no site, pedidos de informação e negócios a contactar." />
      <ContactsTabs current="crm" />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <nav aria-label="Listas" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
          {lists.map((item) => (
            <Link key={item.key} href={`/admin/crm?lista=${encodeURIComponent(item.area)}`} aria-current={list?.key === item.key ? "page" : undefined} className={chip(list?.key === item.key)}>
              {item.area}
              <span className="text-xs font-medium opacity-75 tabular-nums">{item.count}</span>
            </Link>
          ))}
          {lists.length > 1 ? (
            <Link href="/admin/crm?lista=todas" aria-current={!list ? "page" : undefined} className={chip(!list)}>
              Todas
              <span className="text-xs font-medium opacity-75 tabular-nums">{total}</span>
            </Link>
          ) : null}
        </nav>
        <Link href={`/admin/prospecao${list ? `?onde=${encodeURIComponent(list.area)}` : ""}#nova-pesquisa`} className={buttonClasses("secondary", "sm", "shrink-0 self-start sm:self-auto")}>
          {list ? `Procurar novos em ${list.area}` : "Procurar novos"}
        </Link>
      </div>

      {lists.length ? (
        <CrmBoard key={list?.key ?? "todas"} prospects={prospects} me={me} settings={settings} products={productOptions()} />
      ) : (
        <EmptyState>Ainda não há listas. Em «Encontrar clientes», procure um tipo de negócio numa zona: os negócios encontrados aparecem aqui.</EmptyState>
      )}

      <details className="card group p-5 sm:p-6">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-lg font-semibold text-text">
          Mensagem do WhatsApp
          <span aria-hidden="true" className="size-2 -translate-y-0.5 rotate-45 border-r-2 border-b-2 border-muted transition-transform group-open:translate-y-0.5 group-open:rotate-[225deg]" />
        </summary>
        <p className="mt-2 text-sm text-muted">
          O botão «WhatsApp» de cada negócio abre a conversa com esta mensagem, que ainda pode mudar antes de enviar. {"{negocio}"} é trocado pelo nome do negócio e {"{situacao}"} pela frase da
          situação do site.
        </p>
        <ActionForm action={saveWhatsAppSettingsAction} className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
          <label className={`${adminLabelClasses} lg:col-span-2`}>
            Mensagem
            <textarea name="whatsapp_template" required maxLength={1000} rows={3} defaultValue={settings.whatsapp_template} className={input} />
          </label>
          {(
            [
              ["whatsapp_none", siteStatusLabels.none],
              ["whatsapp_down", siteStatusLabels.down],
              ["whatsapp_ai", siteStatusLabels.ai],
              ["whatsapp_outdated", siteStatusLabels.outdated],
              ["whatsapp_other", `${siteStatusLabels.ok} ou por verificar`],
            ] as const
          ).map(([name, label]) => (
            <label key={name} className={adminLabelClasses}>
              {`{situacao} quando: ${label}`}
              <textarea name={name} maxLength={300} rows={2} defaultValue={settings[name]} className={input} />
            </label>
          ))}
          <div className="lg:col-span-2">
            <SubmitButton size="md" pendingLabel="A guardar…">
              Guardar mensagem
            </SubmitButton>
          </div>
        </ActionForm>
      </details>

      <div className="flex max-w-[80ch] flex-col gap-1.5 text-xs text-subtle">
        <p>
          «Ligar» abre o telefone no telemóvel; no computador use «Copiar». «Guardar» põe o negócio nos contactos do telemóvel como «Nome · Lead Steevanz», para o encontrar no WhatsApp.
          «Guardar contactos» faz o mesmo com todos os negócios filtrados de uma vez.
        </p>
        <p>
          «Próximo contacto» é o dia em que deve voltar a contactar: a partir desse dia o negócio aparece em «Para hoje». «Não atendeu» conta a tentativa e põe o próximo contacto para amanhã; ao
          passar a «Contactado» fica para daqui a 3 dias (pode mudar).
        </p>
        <p>
          A situação do site é vista pelo programa de pesquisa no computador do escritório, que abre cada site sozinho. «Sem site» quer dizer que o Google não mostra um site próprio: alguns podem ter
          um que não puseram no Google, por isso vale a pena confirmar na chamada. Só dados públicos de empresas; nada de envios em massa.
        </p>
      </div>
    </>
  );
}

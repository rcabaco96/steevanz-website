import Link from "next/link";
import { ActionForm, SubmitButton } from "@/components/backoffice/ActionForm";
import { adminInputClasses, adminLabelClasses } from "@/components/backoffice/ui";
import { ArrowUpRight } from "@/components/icons";
import { buttonClasses } from "@/components/ui/Button";
import { createEstablishment, deleteEstablishment } from "@/lib/establishments/actions";
import { businessKinds, kindLabels } from "@/lib/establishments/kinds";
import type { EstablishmentRow } from "@/lib/establishments/types";

const moduleLinks = [
  { product: "waitlist", label: "Lista de espera", publicPath: "fila" },
  { product: "loyalty", label: "Cartão de cliente", publicPath: "cartao" },
  { product: "bookings", label: "Reservas", publicPath: "reservar" },
] as const;

/**
 * Admin, client page: the client's shops. Each shop has its own waitlist, loyalty card and booking
 * page (for the products the client has active); "Novo espaço" stays folded until needed (the first one is created on its own).
 */
export function EstablishmentsAdminPanel({
  ownerId,
  establishments,
  activeProducts,
  coverage,
}: {
  ownerId: string;
  establishments: EstablishmentRow[];
  activeProducts: string[];
  /** Per product: spaces paid for and which spaces they cover. */
  coverage: Record<string, { spaces: number; ids: string[] }>;
}) {
  const input = `${adminInputClasses} h-11`;
  const modules = moduleLinks.filter((item) => activeProducts.includes(item.product));
  return (
    <section id="estabelecimentos" aria-labelledby="lojas-title" className="flex scroll-mt-24 flex-col gap-3">
      <div className="flex flex-col gap-0.5">
        <h2 id="lojas-title" className="text-lg font-semibold text-text">
          Espaços
        </h2>
        <p className="text-sm text-muted">O restaurante, café ou barbearia onde a lista de espera, o cartão e as reservas funcionam. O primeiro é criado sozinho; acrescente outro só se o cliente tiver mais de uma morada.</p>
      </div>

      {establishments.length ? (
        <ul className="flex flex-col gap-3">
          {establishments.map((establishment) => {
            const covered = modules.filter((item) => coverage[item.product]?.ids.includes(establishment.id));
            return (
            <li key={establishment.id} className="card overflow-hidden">
              <div className="flex">
                <span aria-hidden="true" className="w-1.5 shrink-0 bg-accent" />
                <div className="flex min-w-0 flex-1 flex-col gap-4 p-4 sm:p-5">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-base font-semibold text-text">{establishment.name}</p>
                      <p className="text-sm text-muted">{kindLabels[establishment.kind]}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {covered.length ? (
                        <Link href={`/admin/clientes/${ownerId}/balcao?${new URLSearchParams({ loja: establishment.slug })}`} title="Fila, reservas de hoje e cartão num só sítio" className={buttonClasses("primary", "sm")}>
                          Abrir Balcão
                        </Link>
                      ) : null}
                      {covered.length ? (
                        <Link
                          href={`/admin/clientes/${ownerId}/${covered[0].product}?${new URLSearchParams({ loja: establishment.slug, vista: "definicoes" })}`}
                          title="Nome, cor, tipo de negócio, horário, serviços e equipa"
                          className={buttonClasses("secondary", "sm")}
                        >
                          Editar espaço
                        </Link>
                      ) : null}
                      <ActionForm
                        action={deleteEstablishment}
                        hideMessage
                        confirmMessage={`Remover «${establishment.name}» e tudo dos seus módulos (fila, cartões, reservas)? Não se pode desfazer.`}
                      >
                        <input type="hidden" name="id" value={establishment.id} />
                        <SubmitButton size="sm" variant="ghost" className="text-muted hover:text-danger">
                          Remover espaço
                        </SubmitButton>
                      </ActionForm>
                    </div>
                  </div>
                  {covered.length ? (
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                      {covered.map((item) => (
                        <div key={item.product} className="flex items-stretch overflow-hidden rounded-xl border border-line">
                          <Link
                            href={`/admin/clientes/${ownerId}/${item.product}?${new URLSearchParams({ loja: establishment.slug })}`}
                            className="flex flex-1 items-center px-3 py-2.5 text-sm font-semibold text-text transition-colors hover:bg-surface-2"
                          >
                            {item.label}
                          </Link>
                          <a
                            href={`/${item.publicPath}/${establishment.slug}`}
                            target="_blank"
                            rel="noopener"
                            title={`Ver a página que os clientes abrem (${item.label})`}
                            aria-label={`Página pública: ${item.label}`}
                            className="grid w-10 place-items-center border-l border-line text-muted transition-colors hover:bg-surface-2 hover:text-text"
                          >
                            <ArrowUpRight size={15} />
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="rounded-xl bg-surface-2/60 px-3 py-2.5 text-sm text-muted">
                      Ative a lista de espera, o cartão ou as reservas em Produtos para gerir este espaço.
                    </p>
                  )}
                </div>
              </div>
            </li>
            );
          })}
        </ul>
      ) : (
        <p className="rounded-2xl border border-dashed border-line-strong px-4 py-5 text-sm text-muted">
          Ainda sem espaços. O primeiro é criado sozinho quando ativar a lista de espera, o cartão ou as reservas.
        </p>
      )}

      {establishments.length ? null : (
      <details className="group card p-4 sm:p-5" open>
        <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold text-text">
          <span aria-hidden="true" className="grid h-6 w-6 place-items-center rounded-full bg-accent-soft text-accent-text transition-transform group-open:rotate-45">
            +
          </span>
          Novo espaço
        </summary>
        <ActionForm action={createEstablishment} className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input type="hidden" name="owner_id" value={ownerId} />
          <label className={adminLabelClasses}>
            Nome do espaço
            <input name="name" required maxLength={120} placeholder="Café Central" className={input} />
          </label>
          <label className={adminLabelClasses}>
            Tipo de negócio
            <select name="kind" defaultValue="restaurant" className={input}>
              {businessKinds.map((kind) => (
                <option key={kind} value={kind}>
                  {kindLabels[kind]}
                </option>
              ))}
            </select>
          </label>
          <details className="sm:col-span-2">
            <summary className="cursor-pointer text-xs font-semibold text-muted hover:text-text">Endereço das páginas (opcional)</summary>
            <label className={`${adminLabelClasses} mt-2`}>
              <input name="slug" maxLength={60} placeholder="sai do nome: cafe-central" className={input} />
              <span className="text-xs font-normal text-subtle">As páginas ficam em …/fila/cafe-central, …/cartao/cafe-central e …/reservar/cafe-central.</span>
            </label>
          </details>
          <div className="sm:col-span-2">
            <SubmitButton size="sm">Criar espaço</SubmitButton>
          </div>
        </ActionForm>
      </details>
      )}
    </section>
  );
}

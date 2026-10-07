import Link from "next/link";
import { ActionForm, SubmitButton } from "@/components/backoffice/ActionForm";
import { Panel, adminInputClasses, adminLabelClasses } from "@/components/backoffice/ui";
import { createEstablishment, deleteEstablishment } from "@/lib/establishments/actions";
import { businessKinds, kindLabels } from "@/lib/establishments/kinds";
import type { EstablishmentRow } from "@/lib/establishments/types";

const moduleLinks = [
  { product: "waitlist", label: "Lista de espera", publicPath: "fila" },
  { product: "loyalty", label: "Cartão", publicPath: "cartao" },
  { product: "bookings", label: "Reservas", publicPath: "reservar" },
] as const;

/** Admin, client page: the client's establishments (the base of the waitlist, loyalty card and bookings). */
export function EstablishmentsAdminPanel({ ownerId, establishments, activeProducts }: { ownerId: string; establishments: EstablishmentRow[]; activeProducts: string[] }) {
  const input = `${adminInputClasses} h-11`;
  const modules = moduleLinks.filter((item) => activeProducts.includes(item.product));
  return (
    <div id="estabelecimentos" className="scroll-mt-24">
      <Panel title="Estabelecimentos">
        <p className="-mt-2 mb-4 text-sm text-muted">
          Cada loja tem a sua lista de espera, cartão de cliente e página de reservas. Os módulos aparecem com os produtos ativos abaixo.
        </p>
        {establishments.length ? (
          <ul className="mb-5 flex flex-col divide-y divide-line">
            {establishments.map((establishment) => (
              <li key={establishment.id} className="flex flex-col gap-2 py-3 first:pt-0">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="flex items-center gap-2">
                    <span aria-hidden="true" className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: establishment.accent_color }} />
                    <span className="font-semibold text-text">{establishment.name}</span>
                    <span className="text-xs text-subtle">{kindLabels[establishment.kind]}</span>
                  </span>
                  <ActionForm
                    action={deleteEstablishment}
                    hideMessage
                    confirmMessage={`Remover «${establishment.name}» e tudo dos seus módulos (fila, cartões, reservas)? Não se pode desfazer.`}
                  >
                    <input type="hidden" name="id" value={establishment.id} />
                    <SubmitButton size="sm" variant="ghost" className="text-danger">
                      Remover
                    </SubmitButton>
                  </ActionForm>
                </div>
                {modules.length ? (
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                    {modules.map((item) => (
                      <span key={item.product} className="flex items-center gap-2">
                        <Link
                          href={`/admin/clientes/${ownerId}/${item.product}?${new URLSearchParams({ loja: establishment.slug })}`}
                          className="font-semibold text-accent-text hover:underline"
                        >
                          {item.label}
                        </Link>
                        <a href={`/${item.publicPath}/${establishment.slug}`} target="_blank" rel="noopener" className="text-xs text-muted hover:text-text">
                          página pública ↗
                        </a>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-subtle">Ative a lista de espera, o cartão ou as reservas para os módulos aparecerem.</p>
                )}
              </li>
            ))}
          </ul>
        ) : null}
        <ActionForm action={createEstablishment} className="grid gap-3 rounded-2xl bg-surface-2/60 p-3 sm:grid-cols-2">
          <input type="hidden" name="owner_id" value={ownerId} />
          <label className={adminLabelClasses}>
            Novo estabelecimento
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
          <label className={`${adminLabelClasses} sm:col-span-2`}>
            Endereço das páginas (opcional)
            <input name="slug" maxLength={60} placeholder="sai do nome: cafe-central" className={input} />
            <span className="text-xs font-normal text-subtle">Fica em …/fila/cafe-central, …/cartao/cafe-central e …/reservar/cafe-central.</span>
          </label>
          <div className="sm:col-span-2">
            <SubmitButton size="sm">Criar estabelecimento</SubmitButton>
          </div>
        </ActionForm>
      </Panel>
    </div>
  );
}

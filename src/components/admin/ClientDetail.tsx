import { ActionForm, SubmitButton } from "@/components/backoffice/ActionForm";
import { adminInputClasses, adminLabelClasses } from "@/components/backoffice/ui";
import { MailIcon, PhoneIcon, PlusIcon, ProductGlyph } from "@/components/icons";
import { getProductCopy } from "@/content/product-copy";
import { getProduct } from "@/content/products";
import type { ProductId } from "@/content/types";
import { saveClientProduct, updateClientProfile } from "@/lib/admin/actions";
import type { getProfile } from "@/lib/admin/queries";

type Profile = NonNullable<Awaited<ReturnType<typeof getProfile>>>;

/** Picks one of the products the client doesn't have yet and activates it. */
export function AddProduct({ ownerId, available, open }: { ownerId: string; available: ProductId[]; open: boolean }) {
  return (
    <details className="group rounded-[var(--radius-card)] border-2 border-dashed border-line-strong p-4 open:border-solid open:border-line open:bg-surface sm:p-5" open={open}>
      <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold text-text">
        <span aria-hidden="true" className="grid h-6 w-6 place-items-center rounded-full bg-accent-soft text-accent-text transition-transform group-open:rotate-45">
          <PlusIcon size={14} />
        </span>
        Adicionar produto
      </summary>
      <ActionForm key={available.join(",")} action={saveClientProduct} className="mt-4 flex flex-col gap-4">
        <input type="hidden" name="user_id" value={ownerId} />
        <input type="hidden" name="status" value="active" />
        <fieldset className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
          <legend className="sr-only">Produto a ativar</legend>
          {available.map((id) => (
            <label
              key={id}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-line px-3 py-2.5 transition-colors hover:bg-surface-2 has-[:checked]:border-accent has-[:checked]:bg-accent-soft/50 has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-accent/20"
            >
              <input type="radio" name="product_id" value={id} required className="peer sr-only" />
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-surface-2 text-muted peer-checked:bg-accent peer-checked:text-accent-contrast">
                <ProductGlyph icon={getProduct(id).icon} size={16} />
              </span>
              <span className="min-w-0 text-sm font-semibold text-text">{getProductCopy(id, "pt").name}</span>
            </label>
          ))}
        </fieldset>
        <SubmitButton size="sm" pendingLabel="A ativar…" className="self-start">
          Ativar produto
        </SubmitButton>
      </ActionForm>
    </details>
  );
}

const sinceDate = new Intl.DateTimeFormat("pt-PT", { timeZone: "Europe/Lisbon", day: "numeric", month: "long", year: "numeric" });

/** The client's account: the facts stacked (label over value), contacts as tappable rows. */
export function AccountCard({ profile }: { profile: Profile }) {
  const facts = [
    { label: "Nome", value: profile.full_name },
    { label: "Negócio", value: profile.business_name },
    { label: "NIF", value: profile.nif },
    { label: "Cliente desde", value: sinceDate.format(new Date(profile.created_at)) },
  ].filter((fact) => fact.value);
  const contacts = [
    { href: `mailto:${profile.email}`, icon: <MailIcon size={16} />, label: "Email", value: profile.email },
    ...(profile.phone ? [{ href: `tel:${profile.phone.replace(/[^\d+]/g, "")}`, icon: <PhoneIcon size={16} />, label: "Telemóvel", value: profile.phone }] : []),
  ];
  const input = `${adminInputClasses} h-10`;
  return (
    <section aria-labelledby="conta-title" className="card flex flex-col gap-5 p-5">
      <details className="group">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
          <h2 id="conta-title" className="text-lg font-semibold text-text">
            Conta
          </h2>
          <span className="rounded-full px-3 py-1 text-sm font-semibold text-accent-text hover:bg-accent-soft">
            <span className="group-open:hidden">Editar</span>
            <span className="hidden group-open:inline">Cancelar</span>
          </span>
        </summary>
        <ActionForm key={profile.updated_at} action={updateClientProfile} className="mt-4 flex flex-col gap-3">
          <input type="hidden" name="id" value={profile.id} />
          <label className={adminLabelClasses}>
            Nome
            <input name="full_name" required maxLength={120} defaultValue={profile.full_name ?? ""} className={input} />
          </label>
          <label className={adminLabelClasses}>
            Negócio
            <input name="business_name" maxLength={160} defaultValue={profile.business_name ?? ""} className={input} />
          </label>
          <label className={adminLabelClasses}>
            Telemóvel
            <input name="phone" type="tel" maxLength={40} defaultValue={profile.phone ?? ""} className={input} />
          </label>
          <label className={adminLabelClasses}>
            NIF
            <input name="nif" inputMode="numeric" maxLength={20} defaultValue={profile.nif ?? ""} className={input} />
          </label>
          <p className="text-xs text-subtle">O email não se muda aqui: é com ele que o cliente entra.</p>
          <SubmitButton size="sm" pendingLabel="A guardar…" className="self-start">
            Guardar
          </SubmitButton>
        </ActionForm>
      </details>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-4 [details[open]~&]:hidden lg:grid-cols-1">
        {facts.map((fact) => (
          <div key={fact.label} className="min-w-0">
            <dt className="text-xs text-subtle">{fact.label}</dt>
            <dd className="mt-0.5 font-medium text-text [overflow-wrap:break-word]">{fact.value}</dd>
          </div>
        ))}
      </dl>
      <ul className="flex flex-col gap-2 border-t border-line pt-4 [details[open]~&]:hidden">
        {contacts.map((contact) => (
          <li key={contact.label}>
            <a href={contact.href} className="flex items-center gap-3 rounded-xl bg-surface-2/60 px-3 py-2.5 transition-colors hover:bg-surface-2">
              <span aria-hidden="true" className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-surface text-muted">
                {contact.icon}
              </span>
              <span className="min-w-0">
                <span className="block text-xs text-subtle">{contact.label}</span>
                <span title={contact.value} className="block truncate text-sm font-semibold text-text">
                  {contact.value}
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

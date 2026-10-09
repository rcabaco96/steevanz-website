import { ActionForm, SubmitButton } from "@/components/backoffice/ActionForm";
import { EmptyState, Panel, adminInputClasses, adminLabelClasses } from "@/components/backoffice/ui";
import {
  addClosure,
  deleteService,
  deleteStaff,
  removeClosure,
  saveHours,
  saveService,
  saveStaff,
  updateEstablishment,
} from "@/lib/establishments/actions";
import { businessKinds, kindLabels } from "@/lib/establishments/kinds";
import { iconUrl } from "@/lib/establishments/logo-rules";
import { shortTime } from "@/lib/establishments/store";
import { weekdayNames, weekdayOrder, type EstablishmentBundle } from "@/lib/establishments/types";
import { LogoForm } from "./LogoForm";

export type SettingsSection = "details" | "services" | "staff" | "hours" | "closures";

const input = `${adminInputClasses} h-11`;
const smallInput = `${adminInputClasses} h-10 text-sm`;

function Hidden({ id }: { id: string }) {
  return <input type="hidden" name="establishment_id" value={id} />;
}

function Details({ bundle, viewer }: { bundle: EstablishmentBundle; viewer: "client" | "admin" }) {
  const { establishment } = bundle;
  return (
    <Panel title="Espaço">
      <ActionForm resetKey={establishment.updated_at} action={updateEstablishment} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Hidden id={establishment.id} />
        <label className={adminLabelClasses}>
          Nome
          <input name="name" required maxLength={120} defaultValue={establishment.name} className={input} />
        </label>
        <label className={adminLabelClasses}>
          Tipo de negócio
          <select name="kind" defaultValue={establishment.kind} className={input}>
            {businessKinds.map((kind) => (
              <option key={kind} value={kind}>
                {kindLabels[kind]}
              </option>
            ))}
          </select>
        </label>
        <label className={adminLabelClasses}>
          Telefone
          <input name="phone" type="tel" maxLength={40} defaultValue={establishment.phone ?? ""} className={input} />
        </label>
        <label className={`${adminLabelClasses} sm:col-span-2`}>
          Morada
          <input name="address" maxLength={200} defaultValue={establishment.address ?? ""} className={input} />
        </label>
        {viewer === "admin" ? (
          <label className={`${adminLabelClasses} sm:col-span-2`}>
            Endereço das páginas
            <span className="flex items-center gap-1">
              <span className="text-sm text-subtle">…/fila/</span>
              <input name="slug" maxLength={60} defaultValue={establishment.slug} className={input} />
            </span>
            <span className="text-xs font-normal text-subtle">Mudar o endereço invalida os QR codes e placas já impressos.</span>
          </label>
        ) : null}
        <div className="sm:col-span-2">
          <SubmitButton size="sm">Guardar</SubmitButton>
        </div>
      </ActionForm>
      <div className="mt-5 border-t border-line pt-5">
        <LogoForm establishmentId={establishment.id} hasLogo={Boolean(establishment.logo_path)} iconSrc={iconUrl(establishment.slug, 192, establishment.logo_path)} />
      </div>
    </Panel>
  );
}

function Services({ bundle }: { bundle: EstablishmentBundle }) {
  const id = bundle.establishment.id;
  return (
    <Panel title="Serviços">
      <p className="-mt-2 mb-4 text-sm text-muted">Duração de cada serviço e, se quiser, um intervalo depois (limpeza, preparação) que o cliente não vê.</p>
      {bundle.services.length ? (
        <ul className="mb-5 flex flex-col divide-y divide-line">
          {bundle.services.map((service) => (
            <li key={service.id} className="py-3 first:pt-0">
              <ActionForm
                key={`${service.name}:${service.duration_minutes}:${service.buffer_minutes}:${service.price_cents}:${service.active}`}
                action={saveService}
                className="grid grid-cols-2 gap-2 sm:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))_auto] sm:items-end">
                <Hidden id={id} />
                <input type="hidden" name="id" value={service.id} />
                <label className={`${adminLabelClasses} col-span-2 sm:col-span-1`}>
                  Nome
                  <input name="name" required maxLength={80} defaultValue={service.name} className={smallInput} />
                </label>
                <label className={adminLabelClasses}>
                  Minutos
                  <input name="duration_minutes" type="number" min={5} max={480} step={5} required defaultValue={service.duration_minutes} className={smallInput} />
                </label>
                <label className={adminLabelClasses}>
                  Intervalo
                  <input name="buffer_minutes" type="number" min={0} max={120} step={5} defaultValue={service.buffer_minutes} className={smallInput} />
                </label>
                <label className={adminLabelClasses}>
                  Preço (€)
                  <input
                    name="price"
                    inputMode="decimal"
                    defaultValue={service.price_cents === null ? "" : (service.price_cents / 100).toFixed(2).replace(".", ",")}
                    className={smallInput}
                  />
                </label>
                <div className="col-span-2 flex items-center gap-3 sm:col-span-1">
                  <label className="flex items-center gap-1.5 text-sm text-muted">
                    <input type="checkbox" name="active" defaultChecked={service.active} className="h-4 w-4 accent-accent" />
                    Ativo
                  </label>
                  <SubmitButton size="sm" variant="secondary">
                    Guardar
                  </SubmitButton>
                </div>
              </ActionForm>
              <ActionForm action={deleteService} confirmMessage={`Remover o serviço «${service.name}»?`} className="mt-1">
                <Hidden id={id} />
                <input type="hidden" name="id" value={service.id} />
                <SubmitButton size="sm" variant="ghost" className="!px-0 text-danger">
                  Remover
                </SubmitButton>
              </ActionForm>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mb-5">
          <EmptyState>Ainda sem serviços.</EmptyState>
        </div>
      )}
      <ActionForm action={saveService} className="grid grid-cols-2 gap-2 rounded-2xl bg-surface-2/60 p-3 sm:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))_auto] sm:items-end">
        <Hidden id={id} />
        <input type="hidden" name="active" value="on" />
        <label className={`${adminLabelClasses} col-span-2 sm:col-span-1`}>
          Novo serviço
          <input name="name" required maxLength={80} placeholder="Corte de cabelo" className={smallInput} />
        </label>
        <label className={adminLabelClasses}>
          Minutos
          <input name="duration_minutes" type="number" min={5} max={480} step={5} required defaultValue={30} className={smallInput} />
        </label>
        <label className={adminLabelClasses}>
          Intervalo
          <input name="buffer_minutes" type="number" min={0} max={120} step={5} defaultValue={0} className={smallInput} />
        </label>
        <label className={adminLabelClasses}>
          Preço (€)
          <input name="price" inputMode="decimal" placeholder="opcional" className={smallInput} />
        </label>
        <div className="col-span-2 sm:col-span-1">
          <SubmitButton size="sm">Adicionar</SubmitButton>
        </div>
      </ActionForm>
    </Panel>
  );
}

function Staff({ bundle }: { bundle: EstablishmentBundle }) {
  const id = bundle.establishment.id;
  return (
    <Panel title="Profissionais">
      <p className="-mt-2 mb-4 text-sm text-muted">Quem atende. Os clientes podem escolher um profissional ou «qualquer um».</p>
      {bundle.staff.length ? (
        <ul className="mb-5 flex flex-col divide-y divide-line">
          {bundle.staff.map((person) => (
            <li key={person.id} className="flex flex-wrap items-end gap-2 py-3 first:pt-0">
              <ActionForm key={`${person.name}:${person.active}`} action={saveStaff} className="flex flex-1 flex-wrap items-end gap-2">
                <Hidden id={id} />
                <input type="hidden" name="id" value={person.id} />
                <label className={`${adminLabelClasses} min-w-40 flex-1`}>
                  Nome
                  <input name="name" required maxLength={80} defaultValue={person.name} className={smallInput} />
                </label>
                <label className="flex h-10 items-center gap-1.5 text-sm text-muted">
                  <input type="checkbox" name="active" defaultChecked={person.active} className="h-4 w-4 accent-accent" />
                  A trabalhar
                </label>
                <SubmitButton size="sm" variant="secondary">
                  Guardar
                </SubmitButton>
              </ActionForm>
              <ActionForm action={deleteStaff} confirmMessage={`Remover ${person.name}?`}>
                <Hidden id={id} />
                <input type="hidden" name="id" value={person.id} />
                <SubmitButton size="sm" variant="ghost" className="text-danger">
                  Remover
                </SubmitButton>
              </ActionForm>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mb-5">
          <EmptyState>Sem profissionais: o estabelecimento conta como uma só agenda.</EmptyState>
        </div>
      )}
      <ActionForm action={saveStaff} className="flex flex-wrap items-end gap-2 rounded-2xl bg-surface-2/60 p-3">
        <Hidden id={id} />
        <input type="hidden" name="active" value="on" />
        <label className={`${adminLabelClasses} min-w-40 flex-1`}>
          Novo profissional
          <input name="name" required maxLength={80} placeholder="Rui" className={smallInput} />
        </label>
        <SubmitButton size="sm">Adicionar</SubmitButton>
      </ActionForm>
    </Panel>
  );
}

function Hours({ bundle }: { bundle: EstablishmentBundle }) {
  return (
    <Panel title="Horário">
      <p className="-mt-2 mb-4 text-sm text-muted">Até dois períodos por dia (por exemplo almoço e jantar). Dia sem horas = fechado.</p>
      <ActionForm key={bundle.hours.map((row) => `${row.weekday}${row.opens}${row.closes}`).join("|")} action={saveHours} className="flex flex-col gap-2">
        <Hidden id={bundle.establishment.id} />
        {weekdayOrder.map((weekday) => {
          const intervals = bundle.hours.filter((row) => row.weekday === weekday);
          return (
            <fieldset key={weekday} className="grid grid-cols-[5.5rem_1fr] items-center gap-2 border-b border-line pb-2 last:border-b-0 sm:grid-cols-[7rem_1fr_1fr]">
              <legend className="sr-only">{weekdayNames[weekday]}</legend>
              <span aria-hidden="true" className="text-sm font-semibold text-text">
                {weekdayNames[weekday]}
              </span>
              {[0, 1].map((index) => (
                <span key={index} className={`flex items-center gap-1.5 ${index === 1 ? "col-start-2 sm:col-start-auto" : ""}`}>
                  <input
                    type="time"
                    name={`h${weekday}_${index}_opens`}
                    aria-label={`${weekdayNames[weekday]}, período ${index + 1}, abre`}
                    defaultValue={intervals[index] ? shortTime(intervals[index].opens) : ""}
                    className={`${smallInput} min-w-0`}
                  />
                  <span aria-hidden="true" className="text-subtle">
                    –
                  </span>
                  <input
                    type="time"
                    name={`h${weekday}_${index}_closes`}
                    aria-label={`${weekdayNames[weekday]}, período ${index + 1}, fecha`}
                    defaultValue={intervals[index] ? shortTime(intervals[index].closes) : ""}
                    className={`${smallInput} min-w-0`}
                  />
                </span>
              ))}
            </fieldset>
          );
        })}
        <div className="pt-2">
          <SubmitButton size="sm">Guardar horário</SubmitButton>
        </div>
      </ActionForm>
    </Panel>
  );
}

function Closures({ bundle }: { bundle: EstablishmentBundle }) {
  const id = bundle.establishment.id;
  const format = new Intl.DateTimeFormat("pt-PT", { weekday: "short", day: "numeric", month: "long", timeZone: "UTC" });
  return (
    <Panel title="Dias fechados">
      {bundle.closures.length ? (
        <ul className="mb-4 flex flex-col divide-y divide-line">
          {bundle.closures.map((closure) => (
            <li key={closure.id} className="flex items-center justify-between gap-3 py-2.5">
              <span className="text-sm text-text">
                {format.format(new Date(`${closure.day}T12:00:00Z`))}
                {closure.reason ? <span className="text-muted"> · {closure.reason}</span> : null}
              </span>
              <ActionForm action={removeClosure} hideMessage>
                <Hidden id={id} />
                <input type="hidden" name="id" value={closure.id} />
                <SubmitButton size="sm" variant="ghost" className="text-danger" ariaLabel="Remover dia fechado">
                  Remover
                </SubmitButton>
              </ActionForm>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mb-4 text-sm text-muted">Nenhum dia fechado marcado.</p>
      )}
      <ActionForm action={addClosure} className="flex flex-wrap items-end gap-2 rounded-2xl bg-surface-2/60 p-3">
        <Hidden id={id} />
        <label className={adminLabelClasses}>
          Data
          <input name="day" type="date" required className={smallInput} />
        </label>
        <label className={`${adminLabelClasses} min-w-40 flex-1`}>
          Motivo (opcional)
          <input name="reason" maxLength={120} placeholder="Férias" className={smallInput} />
        </label>
        <SubmitButton size="sm">Adicionar</SubmitButton>
      </ActionForm>
    </Panel>
  );
}

export function EstablishmentSettings({
  bundle,
  viewer,
  sections,
}: {
  bundle: EstablishmentBundle;
  viewer: "client" | "admin";
  sections: SettingsSection[];
}) {
  return (
    <div className="flex flex-col gap-6">
      {sections.includes("details") ? <Details bundle={bundle} viewer={viewer} /> : null}
      {sections.includes("services") ? <Services bundle={bundle} /> : null}
      {sections.includes("staff") ? <Staff bundle={bundle} /> : null}
      {sections.includes("hours") ? <Hours bundle={bundle} /> : null}
      {sections.includes("closures") ? <Closures bundle={bundle} /> : null}
    </div>
  );
}

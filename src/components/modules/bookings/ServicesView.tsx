import { ActionForm, SubmitButton } from "@/components/backoffice/ActionForm";
import { Panel, adminInputClasses, adminLabelClasses } from "@/components/backoffice/ui";
import { deleteService, deleteStaff, saveService, saveStaff, saveStaffHours } from "@/lib/establishments/actions";
import { shortTime } from "@/lib/establishments/store";
import { weekdayNames, weekdayOrder, type EstablishmentBundle, type ServiceRow, type StaffRow } from "@/lib/establishments/types";
import { applyBusinessTemplate } from "@/lib/modules/bookings/actions";
import { businessTemplates, templateForKind, type BusinessTemplate } from "@/lib/modules/bookings/templates";
import { ServiceKindFields } from "./ServiceKindFields";

const input = `${adminInputClasses} h-10 text-sm`;

const price = new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" });

function minutesLabel(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours} h ${rest}` : `${hours} h`;
}

/** "Um de cada vez · 30 min · Rui, Pedro" / "Várias pessoas · até 40 pessoas por turno · até 8 por reserva". */
function serviceSummary(service: ServiceRow, bundle: EstablishmentBundle): string {
  if (service.booking_kind === "group") return `Várias pessoas · até ${service.capacity ?? 0} pessoas por turno · até ${service.max_party} por reserva`;
  const chosen = bundle.serviceStaff.filter((row) => row.service_id === service.id).map((row) => bundle.staff.find((person) => person.id === row.staff_id)?.name).filter(Boolean);
  return [
    "Um de cada vez",
    minutesLabel(service.duration_minutes),
    service.buffer_minutes ? `+${service.buffer_minutes} min de intervalo` : null,
    bundle.staff.length ? (chosen.length ? chosen.join(", ") : "qualquer um") : null,
  ]
    .filter(Boolean)
    .join(" · ");
}

function ServiceForm({ bundle, service }: { bundle: EstablishmentBundle; service: ServiceRow | null }) {
  const id = bundle.establishment.id;
  return (
    <ActionForm
      key={service ? `${service.id}:${service.name}:${service.booking_kind}:${service.duration_minutes}:${service.capacity}:${service.active}` : "new"}
      action={saveService}
      className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2"
    >
      <input type="hidden" name="establishment_id" value={id} />
      {service ? <input type="hidden" name="id" value={service.id} /> : null}
      <label className={adminLabelClasses}>
        Nome
        <input name="name" required maxLength={80} defaultValue={service?.name ?? ""} className={input} />
      </label>
      <label className={adminLabelClasses}>
        Preço (€, opcional)
        <input
          name="price"
          inputMode="decimal"
          defaultValue={service?.price_cents == null ? "" : (service.price_cents / 100).toFixed(2).replace(".", ",")}
         
          className={input}
        />
      </label>
      <ServiceKindFields
        kind={service?.booking_kind ?? "one"}
        duration={service?.duration_minutes ?? 30}
        buffer={service?.buffer_minutes ?? 0}
        capacity={service?.capacity ?? null}
        maxParty={service?.max_party ?? 8}
        staff={bundle.staff.filter((person) => person.active).map((person) => ({ id: person.id, name: person.name }))}
        chosen={service ? bundle.serviceStaff.filter((row) => row.service_id === service.id).map((row) => row.staff_id) : []}
      />
      <label className="flex items-center gap-2 text-sm text-text sm:col-span-2">
        <input type="checkbox" name="active" defaultChecked={service?.active ?? true} className="h-4 w-4 accent-accent" />
        Disponível para reservar
      </label>
      <div className="sm:col-span-2">
        <SubmitButton size="sm">{service ? "Guardar serviço" : "Adicionar serviço"}</SubmitButton>
      </div>
    </ActionForm>
  );
}

function StaffHoursForm({ bundle, person }: { bundle: EstablishmentBundle; person: StaffRow }) {
  const own = bundle.staffHours.filter((row) => row.staff_id === person.id);
  return (
    <ActionForm key={own.map((row) => `${row.weekday}${row.opens}${row.closes}`).join("|")} action={saveStaffHours} className="mt-3 flex flex-col gap-2">
      <input type="hidden" name="establishment_id" value={bundle.establishment.id} />
      <input type="hidden" name="staff_id" value={person.id} />
      <p className="text-xs text-subtle">Deixe tudo vazio para seguir o horário do espaço. Um dia vazio, com outros preenchidos, é folga.</p>
      {weekdayOrder.map((weekday) => {
        const intervals = own.filter((row) => row.weekday === weekday);
        return (
          <fieldset key={weekday} className="grid grid-cols-[5.5rem_1fr] items-center gap-2 sm:grid-cols-[7rem_1fr_1fr]">
            <legend className="sr-only">{weekdayNames[weekday]}</legend>
            <span aria-hidden="true" className="text-sm text-text">
              {weekdayNames[weekday]}
            </span>
            {[0, 1].map((index) => (
              <span key={index} className={`flex items-center gap-1.5 ${index === 1 ? "col-start-2 sm:col-start-auto" : ""}`}>
                <input type="time" name={`h${weekday}_${index}_opens`} aria-label={`${weekdayNames[weekday]}, período ${index + 1}, início`} defaultValue={intervals[index] ? shortTime(intervals[index].opens) : ""} className={`${input} min-w-0`} />
                <span aria-hidden="true" className="text-subtle">
                  –
                </span>
                <input type="time" name={`h${weekday}_${index}_closes`} aria-label={`${weekdayNames[weekday]}, período ${index + 1}, fim`} defaultValue={intervals[index] ? shortTime(intervals[index].closes) : ""} className={`${input} min-w-0`} />
              </span>
            ))}
          </fieldset>
        );
      })}
      <div className="pt-1">
        <SubmitButton size="sm" variant="secondary">
          Guardar horário
        </SubmitButton>
      </div>
    </ActionForm>
  );
}

function StaffPanel({ bundle }: { bundle: EstablishmentBundle }) {
  const id = bundle.establishment.id;
  return (
    <Panel title="Pessoas e espaços">
      <p className="-mt-2 mb-4 text-sm text-muted">
        Os barbeiros, médicos, salas ou campos que atendem um cliente de cada vez. Quem reserva escolhe um deles ou «qualquer um». Se não adicionar nenhum, as reservas
        ficam todas numa só agenda.
      </p>
      {bundle.staff.length ? (
        <ul className="mb-4 divide-y divide-line">
          {bundle.staff.map((person) => {
            const ownHours = bundle.staffHours.some((row) => row.staff_id === person.id);
            return (
              <li key={person.id} className="py-3">
                <div className="flex flex-wrap items-end gap-2">
                  <ActionForm key={`${person.name}:${person.active}`} action={saveStaff} className="flex flex-1 flex-wrap items-end gap-2">
                    <input type="hidden" name="establishment_id" value={id} />
                    <input type="hidden" name="id" value={person.id} />
                    <label className={`${adminLabelClasses} min-w-40 flex-1`}>
                      Nome
                      <input name="name" required maxLength={80} defaultValue={person.name} className={input} />
                    </label>
                    <label className="flex h-10 items-center gap-1.5 text-sm text-muted">
                      <input type="checkbox" name="active" defaultChecked={person.active} className="h-4 w-4 accent-accent" />
                      Disponível
                    </label>
                    <SubmitButton size="sm" variant="secondary">
                      Guardar
                    </SubmitButton>
                  </ActionForm>
                  <ActionForm action={deleteStaff} confirmMessage={`Remover ${person.name}?`}>
                    <input type="hidden" name="establishment_id" value={id} />
                    <input type="hidden" name="id" value={person.id} />
                    <SubmitButton size="sm" variant="ghost" className="text-danger">
                      Remover
                    </SubmitButton>
                  </ActionForm>
                </div>
                <details className="mt-2">
                  <summary className="cursor-pointer text-sm font-semibold text-muted hover:text-text">{ownHours ? "Horário próprio" : "Horário: o do espaço"}</summary>
                  <StaffHoursForm bundle={bundle} person={person} />
                </details>
              </li>
            );
          })}
        </ul>
      ) : null}
      <ActionForm action={saveStaff} className="flex flex-wrap items-end gap-2 rounded-2xl bg-surface-2/60 p-3">
        <input type="hidden" name="establishment_id" value={id} />
        <input type="hidden" name="active" value="on" />
        <label className={`${adminLabelClasses} min-w-40 flex-1`}>
          Adicionar pessoa ou espaço
          <input name="name" required maxLength={80} className={input} />
        </label>
        <SubmitButton size="sm">Adicionar</SubmitButton>
      </ActionForm>
    </Panel>
  );
}

/**
 * A business whose service is fixed (a restaurant's table): only its setup, no services to add or
 * remove. The turns are the opening periods (Definições → Horário).
 */
function FixedServiceView({ bundle, template, settingsHref }: { bundle: EstablishmentBundle; template: BusinessTemplate & { fixed: NonNullable<BusinessTemplate["fixed"]> }; settingsHref: string }) {
  const id = bundle.establishment.id;
  const service = bundle.services.find((item) => item.booking_kind === "group");
  if (!service) {
    return (
      <Panel title={template.fixed.title}>
        <p className="-mt-2 mb-4 text-sm text-muted">{template.hint}</p>
        <ActionForm action={applyBusinessTemplate}>
          <input type="hidden" name="establishment_id" value={id} />
          <input type="hidden" name="template" value={template.id} />
          <SubmitButton>Ativar as reservas</SubmitButton>
        </ActionForm>
      </Panel>
    );
  }
  return (
    <Panel title={template.fixed.title}>
      <ActionForm key={`${service.capacity}:${service.max_party}:${service.active}`} action={saveService} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <input type="hidden" name="establishment_id" value={id} />
        <input type="hidden" name="id" value={service.id} />
        <input type="hidden" name="name" value={service.name} />
        <input type="hidden" name="booking_kind" value="group" />
        <input type="hidden" name="staff_choice" value="1" />
        <label className={adminLabelClasses}>
          Pessoas por turno
          <input name="capacity" type="number" min={1} max={10000} required defaultValue={service.capacity ?? 40} className={input} />
          <span className="text-xs font-normal text-subtle">
            Quantas pessoas aceita com reserva no almoço e no jantar. Ex.: 50. Quando as reservas de um turno somarem 50 pessoas, esse turno fica cheio.
          </span>
        </label>
        <label className={adminLabelClasses}>
          Máximo de pessoas por reserva
          <input name="max_party" type="number" min={1} max={1000} required defaultValue={service.max_party} className={input} />
          <span className="text-xs font-normal text-subtle">Online. Grupos maiores veem o seu contacto; por telefone pode reservar mais.</span>
        </label>
        <label className="flex items-center gap-2 text-sm text-text sm:col-span-2">
          <input type="checkbox" name="active" defaultChecked={service.active} className="h-4 w-4 accent-accent" />
          Aceitar reservas
        </label>
        <p className="text-sm text-muted sm:col-span-2">
          Os turnos (almoço, jantar) são os períodos do horário, em{" "}
          <a href={settingsHref} className="font-semibold text-accent-text hover:underline">
            Definições
          </a>
          .
        </p>
        <div className="sm:col-span-2">
          <SubmitButton size="sm">Guardar</SubmitButton>
        </div>
      </ActionForm>
    </Panel>
  );
}

/**
 * The services customers book, created by the owner (or started from an example business), and the
 * people or places that do them. A restaurant only sees its capacity; people and places show up when a
 * service is booked one customer at a time.
 */
export function ServicesView({ bundle, settingsHref }: { bundle: EstablishmentBundle; settingsHref: string }) {
  const id = bundle.establishment.id;
  const template = templateForKind(bundle.establishment.kind);
  if (template?.fixed) return <FixedServiceView bundle={bundle} template={{ ...template, fixed: template.fixed }} settingsHref={settingsHref} />;
  const services = bundle.services;
  const oneAtATime = services.some((service) => service.booking_kind === "one");
  return (
    <div className="flex flex-col gap-6">
      {!services.length ? (
        <Panel title="Comece com um exemplo">
          <p className="-mt-2 mb-4 text-sm text-muted">Escolha o que mais se parece com o seu negócio: os serviços habituais ficam criados e depois ajusta nomes, tempos e preços.</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {businessTemplates.map((template) => (
              <ActionForm key={template.id} action={applyBusinessTemplate} className="flex">
                <input type="hidden" name="establishment_id" value={id} />
                <input type="hidden" name="template" value={template.id} />
                <button type="submit" className="card card-interactive flex w-full flex-col gap-1 p-4 text-left">
                  <span className="font-semibold text-text">{template.label}</span>
                  <span className="text-sm text-muted">{template.hint}</span>
                  <span className="text-xs text-subtle">{template.services.map((service) => service.name).join(" · ")}</span>
                </button>
              </ActionForm>
            ))}
          </div>
        </Panel>
      ) : null}

      <Panel title="Serviços">
        <p className="-mt-2 mb-4 text-sm text-muted">O que os clientes escolhem ao reservar.</p>
        {services.length ? (
          <ul className="mb-4 divide-y divide-line">
            {services.map((service) => (
              <li key={service.id} className="py-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-text">
                      {service.name}
                      {service.price_cents != null ? <span className="font-normal text-muted"> · {price.format(service.price_cents / 100)}</span> : null}
                      {!service.active ? <span className="ml-2 rounded-full bg-surface-2 px-2 py-0.5 text-xs font-semibold text-subtle">Escondido</span> : null}
                    </p>
                    <p className="text-sm text-muted">{serviceSummary(service, bundle)}</p>
                  </div>
                  <ActionForm action={deleteService} confirmMessage={`Remover o serviço «${service.name}»? As reservas já feitas mantêm-se.`}>
                    <input type="hidden" name="establishment_id" value={id} />
                    <input type="hidden" name="id" value={service.id} />
                    <SubmitButton size="sm" variant="ghost" className="text-danger">
                      Remover
                    </SubmitButton>
                  </ActionForm>
                </div>
                <details className="mt-1">
                  <summary className="cursor-pointer text-sm font-semibold text-accent-text">Editar</summary>
                  <ServiceForm bundle={bundle} service={service} />
                </details>
              </li>
            ))}
          </ul>
        ) : null}
        <details className="rounded-2xl bg-surface-2/60 p-3" open={!services.length}>
          <summary className="cursor-pointer text-sm font-semibold text-text">{services.length ? "+ Novo serviço" : "Criar um serviço de raiz"}</summary>
          <ServiceForm bundle={bundle} service={null} />
        </details>
      </Panel>

      {oneAtATime || bundle.staff.length ? (
        <StaffPanel bundle={bundle} />
      ) : (
        <details className="card p-4 sm:p-5">
          <summary className="cursor-pointer text-sm font-semibold text-muted">Tem pessoas ou espaços que fazem os serviços? (barbeiros, médicos, campos)</summary>
          <div className="mt-4">
            <StaffPanel bundle={bundle} />
          </div>
        </details>
      )}
    </div>
  );
}

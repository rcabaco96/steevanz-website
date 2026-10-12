import type { ReactNode } from "react";
import { ActionForm, SubmitButton } from "@/components/backoffice/ActionForm";
import { Panel, adminInputClasses, adminLabelClasses } from "@/components/backoffice/ui";
import { PhoneField } from "@/components/shared/PhoneField";
import { kindWords } from "@/lib/establishments/kinds";
import type { EstablishmentBundle } from "@/lib/establishments/types";
import { addEntryByStaff, callEntry, callNext, moveEntry, setEntryStatus, setQueueState } from "@/lib/modules/waitlist/actions";
import { formatWait } from "@/lib/modules/waitlist/eta";
import { nextScheduleChange } from "@/lib/modules/waitlist/schedule";
import { queueWait, replyLabels, servingCapacity, statusLabels, type QueueSnapshot, type WaitlistEntryRow, type WaitlistSettingsRow } from "@/lib/modules/waitlist/store";
import { More } from "./More";

function minutesSince(iso: string, now: number): number {
  return Math.max(0, Math.round((now - Date.parse(iso)) / 60_000));
}

function ago(iso: string, now: number): string {
  const minutes = minutesSince(iso, now);
  if (minutes < 1) return "agora";
  if (minutes < 60) return `há ${minutes} min`;
  return `há ${Math.floor(minutes / 60)} h ${minutes % 60} min`;
}

function details(entry: WaitlistEntryRow, bundle: EstablishmentBundle): string {
  const parts: string[] = [];
  if (entry.party_size) parts.push(`${entry.party_size} ${entry.party_size === 1 ? "pessoa" : "pessoas"}`);
  const service = entry.service_id ? bundle.services.find((item) => item.id === entry.service_id) : null;
  if (service) parts.push(service.name);
  const staff = entry.staff_id ? bundle.staff.find((item) => item.id === entry.staff_id) : null;
  if (entry.service_id || entry.staff_id) parts.push(staff ? `com ${staff.name}` : kindWords[bundle.establishment.kind].who.any.toLowerCase());
  if (entry.source === "staff") parts.push("adicionado pela equipa");
  return parts.join(" · ");
}

function EntryAction({
  action,
  establishmentId,
  entryId,
  fields = {},
  children,
}: {
  action: typeof callEntry;
  establishmentId: string;
  entryId: string;
  fields?: Record<string, string>;
  children: ReactNode;
}) {
  return (
    <ActionForm action={action} hideMessage className="contents">
      <input type="hidden" name="establishment_id" value={establishmentId} />
      <input type="hidden" name="entry_id" value={entryId} />
      {Object.entries(fields).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      {children}
    </ActionForm>
  );
}

const menuItem = "w-full justify-start!";

function PhoneLink({ phone }: { phone: string | null }) {
  if (!phone) return null;
  return (
    <p className="text-sm">
      <a href={`tel:${phone.replace(/\s+/g, "")}`} className="font-medium text-accent-text">
        {phone}
      </a>
    </p>
  );
}

function StateActions({ settings, establishmentId }: { settings: WaitlistSettingsRow; establishmentId: string }) {
  const form = (state: WaitlistSettingsRow["state"], label: string, variant: "primary" | "secondary" | "ghost", confirm?: string) => (
    <ActionForm action={setQueueState} hideMessage confirmMessage={confirm}>
      <input type="hidden" name="establishment_id" value={establishmentId} />
      <input type="hidden" name="state" value={state} />
      <SubmitButton size="sm" variant={variant} pendingLabel="A mudar…">
        {label}
      </SubmitButton>
    </ActionForm>
  );
  const close = "Fechar a fila? Ninguém novo entra e as senhas voltam a começar no 1. Quem já está na fila continua a ser chamado.";
  return <div className="flex flex-wrap gap-1">{settings.state === "open" ? form("closed", "Fechar a fila", "secondary", close) : form("open", "Abrir a fila", "primary")}</div>;
}

function AddForm({ bundle, settings }: { bundle: EstablishmentBundle; settings: WaitlistSettingsRow }) {
  const input = `${adminInputClasses} h-10 text-sm`;
  const services = bundle.services.filter((item) => item.active);
  const staff = bundle.staff.filter((item) => item.active);
  return (
    <details className="group card p-4 sm:p-5">
      <summary className="cursor-pointer list-none text-sm font-semibold text-text marker:hidden">
        <span className="inline-flex items-center gap-2">
          <span aria-hidden="true" className="grid h-6 w-6 place-items-center rounded-full bg-accent-soft text-accent-text group-open:rotate-45">
            +
          </span>
          Adicionar alguém à fila
        </span>
      </summary>
      <ActionForm action={addEntryByStaff} className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input type="hidden" name="establishment_id" value={bundle.establishment.id} />
        <label className={adminLabelClasses}>
          Nome
          <input name="name" required maxLength={60} className={input} />
        </label>
        {settings.ask_party ? (
          <label className={adminLabelClasses}>
            Pessoas
            <input name="party" type="number" min={1} max={settings.max_party} required defaultValue={2} className={input} />
          </label>
        ) : null}
        {settings.ask_service && services.length ? (
          <label className={adminLabelClasses}>
            Serviço
            <select name="service" className={input}>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        {settings.ask_staff && staff.length ? (
          <label className={adminLabelClasses}>
            Profissional
            <select name="staff" className={input} defaultValue="">
              <option value="">{kindWords[bundle.establishment.kind].who.any}</option>
              {staff.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.name}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        <PhoneField label="Telemóvel (opcional)" labelClassName={adminLabelClasses} inputClassName={input} />
        <label className={adminLabelClasses}>
          Nota (opcional)
          <input name="notes" maxLength={200} className={input} />
        </label>
        <div className="sm:col-span-2">
          <SubmitButton size="sm">Adicionar à fila</SubmitButton>
        </div>
      </ActionForm>
    </details>
  );
}

function Figure({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="text-2xl font-semibold tabular-nums text-text">{value}</dd>
    </div>
  );
}

/**
 * The queue for the team (the module's "Fila" tab and the Atendimento): one "Chamar o seguinte" (the next
 * ticket in order, whoever they asked for), who is being served and the line. Whoever is called is
 * being served; calling more people than there are professionals closes the oldest call as served,
 * so nobody has to mark anything. The exceptions are behind "⋯" on each row.
 */
export function QueueCounter({ bundle, settings, queue }: { bundle: EstablishmentBundle; settings: WaitlistSettingsRow; queue: QueueSnapshot }) {
  const { now } = queue;
  const establishmentId = bundle.establishment.id;
  const timeZone = bundle.establishment.time_zone;
  const called = queue.live.filter((entry) => entry.status === "called").sort((a, b) => Date.parse(b.called_at ?? "") - Date.parse(a.called_at ?? ""));
  const waiting = queue.live.filter((entry) => entry.status === "waiting");
  const latest: WaitlistEntryRow | undefined = called[0];
  const next: WaitlistEntryRow | undefined = waiting[0];
  const capacity = servingCapacity(bundle);
  const newcomerWait = queueWait(queue, bundle, settings);
  const change = settings.auto_hours ? nextScheduleChange({ hours: bundle.hours, closures: bundle.closures.map((item) => item.day), timeZone, now }) : null;
  const clock = (at: number) => new Intl.DateTimeFormat("pt-PT", { timeZone, hour: "2-digit", minute: "2-digit" }).format(new Date(at));
  const served = queue.doneToday.filter((entry) => entry.status === "served").length;
  // Groups of different sizes: a free table for 2 goes to the first group that fits, not the next in line.
  const pickByParty = settings.ask_party;
  const stateTitle = settings.state === "open" ? "Fila aberta" : "Fila fechada";
  const dot = settings.state === "open" ? "bg-success" : "bg-subtle";

  return (
    <div className="flex flex-col gap-5">
      <Panel title={stateTitle} actions={<StateActions settings={settings} establishmentId={establishmentId} />}>
        <p className="-mt-2 mb-4 flex items-center gap-2 text-sm text-muted">
          <span aria-hidden="true" className={`h-2 w-2 shrink-0 rounded-full ${dot}`} />
          <span>
            {settings.state === "open" ? "Os clientes entram pelo QR code ou pelo link." : "Os clientes não conseguem entrar. A equipa pode sempre adicionar alguém à fila."}
            {change ? ` ${change.kind === "closes" ? "Fecha" : "Abre"} às ${clock(change.at)}, com o horário.` : ""}
          </span>
        </p>

        <div className="flex flex-col gap-4 border-t border-line pt-4">
          <p className="text-sm text-muted">
            A atender agora:{" "}
            {latest ? (
              <>
                <strong className="font-semibold text-text">
                  Senha {latest.number} · {latest.name}
                </strong>
                {latest.called_at ? ` · chamada ${ago(latest.called_at, now)}` : ""}
              </>
            ) : (
              "ninguém"
            )}
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            {next ? (
              <>
                <ActionForm action={callNext} hideMessage className="sm:shrink-0">
                  <input type="hidden" name="establishment_id" value={establishmentId} />
                  <SubmitButton size="lg" pendingLabel="A chamar…" className="w-full sm:w-auto">
                    Chamar o seguinte
                  </SubmitButton>
                </ActionForm>
                <p className="text-sm text-muted">
                  A seguir: <strong className="font-semibold text-text">senha {next.number}</strong> · {next.name}
                  {details(next, bundle) ? ` · ${details(next, bundle)}` : ""}
                </p>
              </>
            ) : (
              <span className="text-sm font-semibold text-subtle">Ninguém à espera</span>
            )}
          </div>
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-line pt-4 sm:grid-cols-4">
          <Figure label="À espera" value={String(waiting.length)} />
          <Figure label="Em atendimento" value={String(called.length)} />
          <Figure label="Quem entrar agora" value={newcomerWait ? formatWait(newcomerWait).replace("cerca de ", "~") : "É o próximo"} />
          <Figure label="Atendidos hoje" value={String(served)} />
        </dl>
        <p className="mt-4 text-xs text-subtle">
          Quem é chamado fica em atendimento. {capacity === 1 ? "Ao chamar o seguinte, o anterior passa a atendido" : `Até ${capacity} pessoas ao mesmo tempo (uma por profissional): ao chamar mais uma, a chamada há mais tempo passa a atendida`}, sem
          ter de marcar nada. Se alguém não aparecer, use «Não apareceu» no «⋯».
        </p>
      </Panel>

      {called.length ? (
        <Panel title={`Em atendimento · ${called.length}`}>
          <ul className="-my-3 divide-y divide-line">
            {called.map((entry) => (
              <li key={entry.id} className="flex items-center gap-3 py-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent-soft font-semibold tabular-nums text-accent-text">{entry.number}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-text">{entry.name}</p>
                  <p className="truncate text-sm text-muted">
                    {`Chamado ${ago(entry.called_at ?? "", now)}`}
                    {entry.reply ? ` · ${replyLabels[entry.reply]}` : ""}
                    {details(entry, bundle) ? ` · ${details(entry, bundle)}` : ""}
                  </p>
                  <PhoneLink phone={entry.phone} />
                </div>
                <More label={`Mais opções para ${entry.name}`}>
                  <EntryAction action={setEntryStatus} establishmentId={establishmentId} entryId={entry.id} fields={{ status: "served" }}>
                    <SubmitButton size="sm" variant="ghost" className={menuItem}>
                      Já foi atendido
                    </SubmitButton>
                  </EntryAction>
                  <EntryAction action={callEntry} establishmentId={establishmentId} entryId={entry.id}>
                    <SubmitButton size="sm" variant="ghost" className={menuItem}>
                      Chamar outra vez
                    </SubmitButton>
                  </EntryAction>
                  <EntryAction action={setEntryStatus} establishmentId={establishmentId} entryId={entry.id} fields={{ status: "no_show" }}>
                    <SubmitButton size="sm" variant="ghost" className={`${menuItem} text-danger`}>
                      Não apareceu{settings.auto_next ? " (chama o seguinte)" : ""}
                    </SubmitButton>
                  </EntryAction>
                </More>
              </li>
            ))}
          </ul>
        </Panel>
      ) : null}

      <Panel title={`À espera · ${waiting.length}`}>
        {waiting.length ? (
          <ol className="-my-3 divide-y divide-line">
            {waiting.map((entry, index) => {
              const minutes = queueWait(queue, bundle, settings, entry);
              return (
                <li key={entry.id} className="flex items-center gap-3 py-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-surface-2 font-semibold tabular-nums text-text">{entry.number}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-text">{entry.name}</p>
                    <p className="truncate text-sm text-muted">
                      {[details(entry, bundle), `entrou ${ago(entry.joined_at, now)}`, minutes ? `vez em ${formatWait(minutes).replace("cerca de ", "~")}` : "é o próximo"]
                        .filter(Boolean)
                        .join(" · ")}
                      {entry.reply ? ` · ${replyLabels[entry.reply]}` : ""}
                      {entry.notes ? ` · «${entry.notes}»` : ""}
                    </p>
                    <PhoneLink phone={entry.phone} />
                  </div>
                  {pickByParty && index > 0 ? (
                    <EntryAction action={callEntry} establishmentId={establishmentId} entryId={entry.id}>
                      <SubmitButton size="sm" variant="secondary" pendingLabel="A chamar…" ariaLabel={`Chamar ${entry.name} (${details(entry, bundle)})`}>
                        Chamar
                      </SubmitButton>
                    </EntryAction>
                  ) : null}
                  <More label={`Mais opções para ${entry.name}`}>
                    {pickByParty ? null : (
                      <EntryAction action={callEntry} establishmentId={establishmentId} entryId={entry.id}>
                        <SubmitButton size="sm" variant="ghost" className={menuItem} pendingLabel="A chamar…">
                          Chamar já (fora da ordem)
                        </SubmitButton>
                      </EntryAction>
                    )}
                    {index > 0 ? (
                      <EntryAction action={moveEntry} establishmentId={establishmentId} entryId={entry.id} fields={{ direction: "up" }}>
                        <SubmitButton size="sm" variant="ghost" className={menuItem}>
                          Subir um lugar
                        </SubmitButton>
                      </EntryAction>
                    ) : null}
                    {index < waiting.length - 1 ? (
                      <EntryAction action={moveEntry} establishmentId={establishmentId} entryId={entry.id} fields={{ direction: "down" }}>
                        <SubmitButton size="sm" variant="ghost" className={menuItem}>
                          Descer um lugar
                        </SubmitButton>
                      </EntryAction>
                    ) : null}
                    <EntryAction action={setEntryStatus} establishmentId={establishmentId} entryId={entry.id} fields={{ status: "cancelled" }}>
                      <SubmitButton size="sm" variant="ghost" className={`${menuItem} text-danger`}>
                        Desistiu
                      </SubmitButton>
                    </EntryAction>
                  </More>
                </li>
              );
            })}
          </ol>
        ) : (
          <p className="text-sm text-muted">
            {settings.state === "open" ? "Ninguém à espera. Quem ler o QR ou tocar na placa aparece aqui." : "A fila não está aberta: ninguém consegue entrar."}
          </p>
        )}
      </Panel>

      <AddForm bundle={bundle} settings={settings} />

      {queue.doneToday.length ? (
        <details className="card p-4 sm:p-5">
          <summary className="cursor-pointer text-sm font-semibold text-muted">Hoje: {queue.doneToday.length} terminados</summary>
          <ul className="mt-3 flex flex-col divide-y divide-line">
            {queue.doneToday.map((entry) => (
              <li key={entry.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                <span className="min-w-0 truncate text-text">
                  <span className="tabular-nums text-muted">Senha {entry.number}</span> · {entry.name}
                </span>
                <span className="shrink-0 text-muted">{statusLabels[entry.status]}</span>
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </div>
  );
}

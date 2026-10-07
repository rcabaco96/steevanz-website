import type { ReactNode } from "react";
import { ActionForm, SubmitButton } from "@/components/backoffice/ActionForm";
import { EmptyState, adminInputClasses, adminLabelClasses } from "@/components/backoffice/ui";
import { kindWords } from "@/lib/establishments/kinds";
import type { EstablishmentBundle } from "@/lib/establishments/types";
import { addEntryByStaff, callEntry, moveEntry, setEntryStatus, setQueueState } from "@/lib/modules/waitlist/actions";
import { estimateWait, formatWait } from "@/lib/modules/waitlist/eta";
import {
  entryOutlook,
  replyLabels,
  stateLabels,
  statusLabels,
  type QueueSnapshot,
  type WaitlistEntryRow,
  type WaitlistSettingsRow,
} from "@/lib/modules/waitlist/store";
import { AutoRefresh } from "../shared/AutoRefresh";


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
  if (entry.service_id || entry.staff_id) parts.push(staff ? `com ${staff.name}` : "qualquer profissional");
  if (entry.source === "staff") parts.push("adicionado ao balcão");
  return parts.join(" · ");
}

function EntryForm({
  action,
  establishmentId,
  entryId,
  children,
  fields = {},
}: {
  action: typeof callEntry;
  establishmentId: string;
  entryId: string;
  children: ReactNode;
  fields?: Record<string, string>;
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

const stateCopy = {
  open: {
    title: "A fila está aberta",
    text: "Os clientes entram pelo QR code ou pelo link.",
    tone: "border-success/40 bg-success-soft/50",
    dot: "bg-success",
  },
  paused: {
    title: "Entradas em pausa",
    text: "Ninguém novo entra. Quem já está na fila continua a ser chamado.",
    tone: "border-gold/40 bg-gold-soft/50",
    dot: "bg-gold",
  },
  closed: {
    title: "A fila está fechada",
    text: "Os clientes não conseguem entrar. Abra a fila quando começar a atender.",
    tone: "border-line bg-surface-2/60",
    dot: "bg-subtle",
  },
} as const;

function StateButton({
  establishmentId,
  state,
  children,
  variant,
  confirmMessage,
}: {
  establishmentId: string;
  state: WaitlistSettingsRow["state"];
  children: ReactNode;
  variant: "primary" | "secondary" | "ghost";
  confirmMessage?: string;
}) {
  return (
    <ActionForm action={setQueueState} hideMessage confirmMessage={confirmMessage}>
      <input type="hidden" name="establishment_id" value={establishmentId} />
      <input type="hidden" name="state" value={state} />
      <SubmitButton size="sm" variant={variant} pendingLabel="A mudar…">
        {children}
      </SubmitButton>
    </ActionForm>
  );
}

/**
 * The queue's state said in words, with the next actions as plain verbs ("Abrir fila",
 * "Pausar entradas", "Fechar fila") instead of a switch the owner has to decode.
 */
function StateBanner({ settings, establishmentId }: { settings: WaitlistSettingsRow; establishmentId: string }) {
  const copy = stateCopy[settings.state];
  const closeConfirm = "Fechar a fila? Ninguém novo entra. Quem já está na fila continua a ser chamado.";
  return (
    <div className={`flex flex-col gap-4 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between ${copy.tone}`}>
      <div className="flex min-w-0 items-start gap-3">
        <span aria-hidden="true" className="relative mt-1.5 flex h-3 w-3 shrink-0">
          {settings.state === "open" ? <span className={`absolute inset-0 animate-ping rounded-full opacity-60 ${copy.dot}`} /> : null}
          <span className={`relative h-3 w-3 rounded-full ${copy.dot}`} />
        </span>
        <div className="min-w-0">
          <p className="text-lg font-semibold text-text">{copy.title}</p>
          <p className="text-sm text-muted">{copy.text}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 sm:shrink-0 sm:justify-end">
        {settings.state === "open" ? (
          <>
            <StateButton establishmentId={establishmentId} state="paused" variant="secondary">
              Pausar entradas
            </StateButton>
            <StateButton establishmentId={establishmentId} state="closed" variant="ghost" confirmMessage={closeConfirm}>
              Fechar fila
            </StateButton>
          </>
        ) : settings.state === "paused" ? (
          <>
            <StateButton establishmentId={establishmentId} state="open" variant="primary">
              Retomar entradas
            </StateButton>
            <StateButton establishmentId={establishmentId} state="closed" variant="ghost" confirmMessage={closeConfirm}>
              Fechar fila
            </StateButton>
          </>
        ) : (
          <StateButton establishmentId={establishmentId} state="open" variant="primary">
            Abrir fila
          </StateButton>
        )}
      </div>
    </div>
  );
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
          Adicionar alguém ao balcão
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
              <option value="">Qualquer um</option>
              {staff.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.name}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        <label className={`${adminLabelClasses} sm:col-span-2`}>
          Nota (opcional)
          <input name="notes" maxLength={200} placeholder="Ex.: prefere esplanada" className={input} />
        </label>
        <div className="sm:col-span-2">
          <SubmitButton size="sm">Adicionar à fila</SubmitButton>
        </div>
      </ActionForm>
    </details>
  );
}

export function QueueBoard({ bundle, settings, queue }: { bundle: EstablishmentBundle; settings: WaitlistSettingsRow; queue: QueueSnapshot }) {
  const now = queue.now;
  const establishmentId = bundle.establishment.id;
  const words = kindWords[bundle.establishment.kind];
  const called = queue.live.filter((entry) => entry.status === "called");
  const waiting = queue.live.filter((entry) => entry.status === "waiting");
  const newcomerWait = estimateWait({
    ahead: waiting.map((entry) => ({
      serviceMinutes: settings.ask_service ? (bundle.services.find((item) => item.id === entry.service_id)?.duration_minutes ?? settings.avg_minutes) : null,
      staffId: entry.staff_id,
    })),
    avgMinutes: settings.avg_minutes,
    activeStaff: bundle.staff.filter((item) => item.active).length,
    recentCalls: queue.recentCalls,
    now,
  });

  return (
    <div className="flex flex-col gap-5">
      <AutoRefresh intervalMs={8000} />
      <section className="card flex flex-col gap-5 p-4 sm:p-5">
        <StateBanner settings={settings} establishmentId={establishmentId} />
        <dl className="grid grid-cols-3 gap-3 border-t border-line pt-4">
          <div>
            <dt className="text-sm text-muted">À espera</dt>
            <dd className="display text-3xl tabular-nums">{waiting.length}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted">Chamados</dt>
            <dd className="display text-3xl tabular-nums">{called.length}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted">Quem entrar agora</dt>
            <dd className="display text-2xl leading-9">{newcomerWait ? formatWait(newcomerWait).replace("cerca de ", "~ ") : "Sem espera"}</dd>
          </div>
        </dl>
      </section>

      {called.length ? (
        <section aria-labelledby="chamados-title" className="flex flex-col gap-2">
          <h2 id="chamados-title" className="text-sm font-semibold text-muted">
            Chamados
          </h2>
          <ul className="flex flex-col gap-2">
            {called.map((entry) => {
              const late = entry.called_at && minutesSince(entry.called_at, now) > settings.grace_minutes;
              return (
                <li key={entry.id} className={`card flex flex-col gap-3 p-4 ${late ? "border-danger/50 bg-danger-soft/40" : "border-accent/50 bg-accent-soft/40"}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl ${late ? "bg-danger text-white" : "bg-accent text-accent-contrast"}`}>
                        <span className="display text-2xl leading-none tabular-nums">{entry.number}</span>
                      </span>
                      <div className="min-w-0">
                      <p className="text-lg font-semibold text-text">{entry.name}</p>
                      <p className="text-sm text-muted">{details(entry, bundle) || " "}</p>
                      {entry.notes ? <p className="text-sm text-subtle">«{entry.notes}»</p> : null}
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1 text-right">
                      <span className={`text-xs font-semibold ${late ? "text-danger" : "text-accent-text"}`}>
                        Chamado {entry.called_at ? ago(entry.called_at, now) : ""}
                      </span>
                      {entry.reply ? (
                        <span className="rounded-full bg-surface-2 px-2 py-0.5 text-xs font-semibold text-text">{replyLabels[entry.reply]}</span>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <EntryForm action={setEntryStatus} establishmentId={establishmentId} entryId={entry.id} fields={{ status: "served" }}>
                      <SubmitButton size="sm">Atendido</SubmitButton>
                    </EntryForm>
                    <EntryForm action={callEntry} establishmentId={establishmentId} entryId={entry.id}>
                      <SubmitButton size="sm" variant="secondary">
                        Chamar outra vez
                      </SubmitButton>
                    </EntryForm>
                    <EntryForm action={setEntryStatus} establishmentId={establishmentId} entryId={entry.id} fields={{ status: "waiting" }}>
                      <SubmitButton size="sm" variant="ghost">
                        Voltar à fila
                      </SubmitButton>
                    </EntryForm>
                    <EntryForm action={setEntryStatus} establishmentId={establishmentId} entryId={entry.id} fields={{ status: "no_show" }}>
                      <SubmitButton size="sm" variant="ghost" className="text-danger">
                        Não apareceu
                      </SubmitButton>
                    </EntryForm>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      <section aria-labelledby="espera-title" className="flex flex-col gap-2">
        <h2 id="espera-title" className="text-sm font-semibold text-muted">
          À espera
        </h2>
        {waiting.length ? (
          <ol className="flex flex-col gap-2">
            {waiting.map((entry, index) => {
              const outlook = entryOutlook(entry, queue, bundle, settings);
              return (
                <li key={entry.id} className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="flex w-14 shrink-0 flex-col items-center rounded-2xl bg-surface-2 py-1.5">
                      <span className="display text-2xl leading-none tabular-nums text-text">{entry.number}</span>
                      <span className="mt-0.5 text-[0.7rem] text-muted">{index + 1}.º</span>
                    </span>
                    <div className="min-w-0">
                      <p className="text-lg font-semibold text-text">{entry.name}</p>
                      <p className="text-sm text-muted">{details(entry, bundle) || " "}</p>
                      <p className="text-xs text-subtle">
                        Entrou {ago(entry.joined_at, now)} · {outlook.minutes ? `vez ${formatWait(outlook.minutes)}` : "é o próximo"}
                        {entry.reply ? ` · ${replyLabels[entry.reply]}` : ""}
                      </p>
                      {entry.notes ? <p className="text-sm text-subtle">«{entry.notes}»</p> : null}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                    <EntryForm action={callEntry} establishmentId={establishmentId} entryId={entry.id}>
                      <SubmitButton size="sm" pendingLabel="A chamar…">
                        Chamar
                      </SubmitButton>
                    </EntryForm>
                    <EntryForm action={moveEntry} establishmentId={establishmentId} entryId={entry.id} fields={{ direction: "up" }}>
                      <SubmitButton size="sm" variant="ghost" ariaLabel={`Subir ${entry.name} na fila`}>
                        ↑
                      </SubmitButton>
                    </EntryForm>
                    <EntryForm action={moveEntry} establishmentId={establishmentId} entryId={entry.id} fields={{ direction: "down" }}>
                      <SubmitButton size="sm" variant="ghost" ariaLabel={`Descer ${entry.name} na fila`}>
                        ↓
                      </SubmitButton>
                    </EntryForm>
                    <EntryForm action={setEntryStatus} establishmentId={establishmentId} entryId={entry.id} fields={{ status: "cancelled" }}>
                      <SubmitButton size="sm" variant="ghost" className="text-danger">
                        Desistiu
                      </SubmitButton>
                    </EntryForm>
                  </div>
                </li>
              );
            })}
          </ol>
        ) : (
          <EmptyState>
            {settings.state === "open"
              ? "Ninguém à espera. Quem ler o QR ou tocar na placa aparece aqui."
              : `A fila está ${stateLabels[settings.state].toLowerCase()}. Abra-a para os clientes poderem entrar.`}
          </EmptyState>
        )}
      </section>

      <AddForm bundle={bundle} settings={settings} />

      {queue.doneToday.length ? (
        <details className="card p-4 sm:p-5">
          <summary className="cursor-pointer text-sm font-semibold text-muted">Hoje: {queue.doneToday.length} terminados</summary>
          <ul className="mt-3 flex flex-col divide-y divide-line">
            {queue.doneToday.map((entry) => (
              <li key={entry.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                <span className="min-w-0 truncate text-text">
                  <span className="tabular-nums text-muted">N.º {entry.number}</span> · {entry.name}
                </span>
                <span className="flex shrink-0 items-center gap-3">
                  <span className="text-muted">{statusLabels[entry.status]}</span>
                  {entry.status !== "served" ? (
                    <EntryForm action={setEntryStatus} establishmentId={establishmentId} entryId={entry.id} fields={{ status: "waiting" }}>
                      <SubmitButton size="sm" variant="ghost">
                        Repor na fila
                      </SubmitButton>
                    </EntryForm>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>
        </details>
      ) : null}
      <p className="text-xs text-subtle">
        A página atualiza-se sozinha. Ao chamar, o telemóvel do cliente toca na página da fila («{words.ready}») e, se deixou email, recebe também um email.
      </p>
    </div>
  );
}

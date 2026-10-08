import type { ReactNode } from "react";
import { ActionForm } from "@/components/backoffice/ActionForm";
import type { EstablishmentBundle } from "@/lib/establishments/types";
import { callEntry, callNext, moveEntry, setEntryStatus, setQueueState } from "@/lib/modules/waitlist/actions";
import { estimateWait, formatWait } from "@/lib/modules/waitlist/eta";
import { nextScheduleChange } from "@/lib/modules/waitlist/schedule";
import { entryOutlook, replyLabels, type QueueSnapshot, type WaitlistEntryRow, type WaitlistSettingsRow } from "@/lib/modules/waitlist/store";
import { AddForm, ago, details, minutesSince } from "../waitlist/QueueBoard";
import { CounterSubmit } from "./CounterSubmit";
import { More } from "./More";

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

function StateControl({ settings, establishmentId, schedule }: { settings: WaitlistSettingsRow; establishmentId: string; schedule: string | null }) {
  const form = (state: WaitlistSettingsRow["state"], label: string, tone: "brand" | "soft" | "quiet", confirm?: string) => (
    <ActionForm action={setQueueState} hideMessage confirmMessage={confirm}>
      <input type="hidden" name="establishment_id" value={establishmentId} />
      <input type="hidden" name="state" value={state} />
      <CounterSubmit size="sm" tone={tone} pendingLabel="A mudar…">
        {label}
      </CounterSubmit>
    </ActionForm>
  );
  const close = "Fechar a fila? Ninguém novo entra. Quem já está na fila continua a ser chamado.";
  const dot = settings.state === "open" ? "bg-success" : settings.state === "paused" ? "bg-gold" : "bg-subtle";
  const title = settings.state === "open" ? "Fila aberta" : settings.state === "paused" ? "Entradas em pausa" : "Fila fechada";
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
      <p className="flex min-w-0 items-center gap-2.5">
        <span aria-hidden="true" className="relative flex h-2.5 w-2.5 shrink-0">
          {settings.state === "open" ? <span className={`absolute inset-0 animate-ping rounded-full opacity-60 ${dot}`} /> : null}
          <span className={`relative h-2.5 w-2.5 rounded-full ${dot}`} />
        </span>
        <span className="font-semibold text-text">{title}</span>
        {schedule ? <span className="truncate text-sm text-muted">{schedule}</span> : null}
      </p>
      <div className="flex gap-1">
        {settings.state === "open" ? (
          <>
            {form("paused", "Pausar entradas", "quiet")}
            {form("closed", "Fechar", "quiet", close)}
          </>
        ) : settings.state === "paused" ? (
          <>
            {form("open", "Retomar entradas", "brand")}
            {form("closed", "Fechar", "quiet", close)}
          </>
        ) : (
          form("open", "Abrir a fila", "brand")
        )}
      </div>
    </div>
  );
}

/**
 * The queue as the team uses it all day: one huge "Chamar o seguinte" (one per professional when
 * customers choose one), who is being called, and the line. Everything else is behind "⋯".
 */
export function QueueCounter({ bundle, settings, queue }: { bundle: EstablishmentBundle; settings: WaitlistSettingsRow; queue: QueueSnapshot }) {
  const { now } = queue;
  const establishmentId = bundle.establishment.id;
  const timeZone = bundle.establishment.time_zone;
  const called = queue.live.filter((entry) => entry.status === "called").sort((a, b) => Date.parse(b.called_at ?? "") - Date.parse(a.called_at ?? ""));
  const waiting = queue.live.filter((entry) => entry.status === "waiting");
  const latest: WaitlistEntryRow | undefined = called[0];
  const staff = settings.ask_staff ? bundle.staff.filter((item) => item.active) : [];
  const lanes = staff.length
    ? staff.map((person) => ({ id: person.id, name: person.name, next: waiting.find((entry) => !entry.staff_id || entry.staff_id === person.id) ?? null }))
    : [{ id: "", name: "", next: waiting[0] ?? null }];
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
  const change = settings.auto_hours ? nextScheduleChange({ hours: bundle.hours, closures: bundle.closures.map((item) => item.day), timeZone, now }) : null;
  const clock = (at: number) => new Intl.DateTimeFormat("pt-PT", { timeZone, hour: "2-digit", minute: "2-digit" }).format(new Date(at));
  const schedule = change ? `· ${change.kind === "closes" ? "fecha" : "abre"} às ${clock(change.at)}` : null;
  const served = queue.doneToday.filter((entry) => entry.status === "served").length;

  return (
    <div className="flex flex-col gap-5">
      <StateControl settings={settings} establishmentId={establishmentId} schedule={schedule} />

      <section aria-labelledby="chamar-title" className="overflow-hidden rounded-[2rem] border border-line bg-surface shadow-[0_30px_60px_-40px_rgb(0_0_0/0.35)]">
        <div className="flex items-end justify-between gap-4 px-5 pt-5 sm:px-7 sm:pt-6">
          <div className="min-w-0">
            <h2 id="chamar-title" className="text-sm font-semibold text-muted">
              A chamar agora
            </h2>
            {latest ? (
              <p className="mt-1 flex min-w-0 items-baseline gap-3">
                <span className="display text-[4.5rem] leading-[0.9] tabular-nums text-[var(--brand)] sm:text-[5.5rem]">{latest.number}</span>
                <span className="min-w-0">
                  <span className="block truncate text-xl font-semibold text-text">{latest.name}</span>
                  <span className="block text-sm text-muted">
                    {latest.called_at ? `chamado ${ago(latest.called_at, now)}` : ""}
                    {latest.reply ? ` · ${replyLabels[latest.reply]}` : ""}
                  </span>
                </span>
              </p>
            ) : (
              <p className="mt-2 text-xl text-muted">Ninguém chamado.</p>
            )}
          </div>
          <dl className="hidden shrink-0 text-right sm:block">
            <dt className="text-sm text-muted">À espera</dt>
            <dd className="display text-5xl leading-none tabular-nums">{waiting.length}</dd>
          </dl>
        </div>

        <div className={`grid grid-cols-1 gap-3 p-5 sm:p-7 ${lanes.length > 2 ? "sm:grid-cols-3" : lanes.length > 1 ? "sm:grid-cols-2" : ""}`}>
          {lanes.map((lane) => (
            <div key={lane.id || "all"} className="flex flex-col gap-2">
              {lane.next ? (
                <ActionForm action={callNext} hideMessage>
                  <input type="hidden" name="establishment_id" value={establishmentId} />
                  {lane.id ? <input type="hidden" name="staff_id" value={lane.id} /> : null}
                  <CounterSubmit size="xl" pendingLabel="A chamar…" className={lane.name ? "flex-col gap-0! leading-tight" : ""}>
                    {lane.name ? (
                      <>
                        <span>Chamar o seguinte</span>
                        <span className="text-sm font-medium opacity-85">{lane.name}</span>
                      </>
                    ) : (
                      "Chamar o seguinte"
                    )}
                  </CounterSubmit>
                </ActionForm>
              ) : (
                <div className="flex min-h-20 items-center justify-center rounded-[1.75rem] border-2 border-dashed border-line-strong px-6 text-lg font-semibold text-subtle">
                  {lane.name ? `${lane.name}: ninguém à espera` : "Ninguém à espera"}
                </div>
              )}
              <p className="text-center text-sm text-muted">
                {lane.next ? (
                  <>
                    A seguir: <strong className="font-semibold text-text">N.º {lane.next.number}</strong> · {lane.next.name}
                    {details(lane.next, bundle) ? ` · ${details(lane.next, bundle)}` : ""}
                  </>
                ) : settings.state === "open" ? (
                  "Quem entrar pelo QR aparece aqui."
                ) : (
                  "Abra a fila para os clientes poderem entrar."
                )}
              </p>
            </div>
          ))}
        </div>

        <dl className="grid grid-cols-3 divide-x divide-line border-t border-line bg-surface-2/40 text-center">
          <div className="px-2 py-3 sm:hidden">
            <dt className="text-xs text-muted">À espera</dt>
            <dd className="display text-2xl tabular-nums">{waiting.length}</dd>
          </div>
          <div className="hidden px-2 py-3 sm:block">
            <dt className="text-xs text-muted">Chamados</dt>
            <dd className="display text-2xl tabular-nums">{called.length}</dd>
          </div>
          <div className="px-2 py-3">
            <dt className="text-xs text-muted">Quem entrar agora</dt>
            <dd className={`display ${newcomerWait ? "text-2xl" : "text-lg leading-8"}`}>{newcomerWait ? formatWait(newcomerWait).replace("cerca de ", "~") : "Sem espera"}</dd>
          </div>
          <div className="px-2 py-3">
            <dt className="text-xs text-muted">Atendidos hoje</dt>
            <dd className="display text-2xl tabular-nums">{served}</dd>
          </div>
        </dl>
      </section>

      <p className="-mt-1 px-2 text-center text-xs text-subtle">
        Ninguém precisa de marcar nada: a chamada fecha sozinha como atendida ao fim de {settings.grace_minutes} min. Se alguém não aparecer, toque em «Não
        apareceu»{settings.auto_next ? " e o seguinte é logo chamado" : ""}.
      </p>

      {called.length ? (
        <section aria-labelledby="chamados-title" className="flex flex-col gap-2">
          <h2 id="chamados-title" className="px-1 text-sm font-semibold text-muted">
            Chamados · {called.length}
          </h2>
          <ul className="flex flex-col gap-2">
            {called.map((entry) => {
              const limit = settings.grace_minutes * (entry.reply === "late" ? 2 : 1);
              const elapsed = entry.called_at ? minutesSince(entry.called_at, now) : 0;
              const over = elapsed >= limit;
              return (
                <li key={entry.id} className="flex items-center gap-3 rounded-3xl border border-line bg-surface p-3 pr-2">
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[var(--brand)] text-[var(--brand-text)]">
                    <span className="display text-2xl leading-none tabular-nums">{entry.number}</span>
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-text">{entry.name}</p>
                    <p className="truncate text-sm text-muted">
                      {over ? "A fechar…" : `Fecha sozinha em ${Math.max(1, limit - elapsed)} min`}
                      {entry.reply ? ` · ${replyLabels[entry.reply]}` : ""}
                      {details(entry, bundle) ? ` · ${details(entry, bundle)}` : ""}
                    </p>
                  </div>
                  <div className="hidden shrink-0 sm:block">
                    <EntryAction action={setEntryStatus} establishmentId={establishmentId} entryId={entry.id} fields={{ status: "no_show" }}>
                      <CounterSubmit size="md" tone="danger">
                        Não apareceu
                      </CounterSubmit>
                    </EntryAction>
                  </div>
                  <More label={`Mais opções para ${entry.name}`}>
                    <EntryAction action={setEntryStatus} establishmentId={establishmentId} entryId={entry.id} fields={{ status: "no_show" }}>
                      <CounterSubmit size="md" tone="danger" className={`${menuItem} sm:hidden`}>
                        Não apareceu{settings.auto_next ? " (chama o seguinte)" : ""}
                      </CounterSubmit>
                    </EntryAction>
                    <EntryAction action={setEntryStatus} establishmentId={establishmentId} entryId={entry.id} fields={{ status: "served" }}>
                      <CounterSubmit size="md" tone="quiet" className={menuItem}>
                        Já foi atendido
                      </CounterSubmit>
                    </EntryAction>
                    <EntryAction action={callEntry} establishmentId={establishmentId} entryId={entry.id}>
                      <CounterSubmit size="md" tone="quiet" className={menuItem}>
                        Chamar outra vez
                      </CounterSubmit>
                    </EntryAction>
                    <EntryAction action={setEntryStatus} establishmentId={establishmentId} entryId={entry.id} fields={{ status: "waiting" }}>
                      <CounterSubmit size="md" tone="quiet" className={menuItem}>
                        Voltar à fila
                      </CounterSubmit>
                    </EntryAction>
                  </More>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      <section aria-labelledby="espera-title" className="flex flex-col gap-2">
        <h2 id="espera-title" className="px-1 text-sm font-semibold text-muted">
          À espera · {waiting.length}
        </h2>
        {waiting.length ? (
          <ol className="flex flex-col gap-2">
            {waiting.map((entry, index) => {
              const outlook = entryOutlook(entry, queue, bundle, settings);
              return (
                <li key={entry.id} className="flex items-center gap-3 rounded-3xl border border-line bg-surface p-3 pr-2">
                  <span className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-surface-2">
                    <span className="display text-2xl leading-none tabular-nums text-text">{entry.number}</span>
                    <span className="text-[0.68rem] text-muted">{index + 1}.º</span>
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-text">{entry.name}</p>
                    <p className="truncate text-sm text-muted">
                      {details(entry, bundle) || (entry.source === "staff" ? "adicionado ao balcão" : "pelo QR")}
                    </p>
                    <p className="truncate text-xs text-subtle">
                      Entrou {ago(entry.joined_at, now)} · {outlook.minutes ? `vez em ${formatWait(outlook.minutes).replace("cerca de ", "~")}` : "é o próximo"}
                      {entry.reply ? ` · ${replyLabels[entry.reply]}` : ""}
                      {entry.notes ? ` · «${entry.notes}»` : ""}
                    </p>
                  </div>
                  <More label={`Mais opções para ${entry.name}`}>
                    <EntryAction action={callEntry} establishmentId={establishmentId} entryId={entry.id}>
                      <CounterSubmit size="md" tone="quiet" className={menuItem} pendingLabel="A chamar…">
                        Chamar já (fora da ordem)
                      </CounterSubmit>
                    </EntryAction>
                    {index > 0 ? (
                      <EntryAction action={moveEntry} establishmentId={establishmentId} entryId={entry.id} fields={{ direction: "up" }}>
                        <CounterSubmit size="md" tone="quiet" className={menuItem}>
                          Subir um lugar
                        </CounterSubmit>
                      </EntryAction>
                    ) : null}
                    {index < waiting.length - 1 ? (
                      <EntryAction action={moveEntry} establishmentId={establishmentId} entryId={entry.id} fields={{ direction: "down" }}>
                        <CounterSubmit size="md" tone="quiet" className={menuItem}>
                          Descer um lugar
                        </CounterSubmit>
                      </EntryAction>
                    ) : null}
                    <EntryAction action={setEntryStatus} establishmentId={establishmentId} entryId={entry.id} fields={{ status: "cancelled" }}>
                      <CounterSubmit size="md" tone="danger" className={menuItem}>
                        Desistiu
                      </CounterSubmit>
                    </EntryAction>
                  </More>
                </li>
              );
            })}
          </ol>
        ) : (
          <p className="rounded-3xl border border-dashed border-line-strong px-5 py-8 text-center text-muted">
            {settings.state === "open" ? "Ninguém à espera. Quem ler o QR ou tocar na placa aparece aqui." : "A fila não está aberta: ninguém consegue entrar."}
          </p>
        )}
      </section>

      <AddForm bundle={bundle} settings={settings} />
    </div>
  );
}

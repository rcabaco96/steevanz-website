import type { Metadata } from "next";
import { ActionForm, SubmitButton } from "@/components/backoffice/ActionForm";
import { AdminPageHeader, adminInputClasses, adminLabelClasses, EmptyState, Panel } from "@/components/backoffice/ui";
import { CloseIcon } from "@/components/icons";
import { createBlockedDate, createBreak, deleteAvailabilityItem, saveRule, saveSettings } from "@/lib/admin/actions";
import { requireAdmin } from "@/lib/admin/auth";
import { loadAvailabilityTables, loadBusyIntervals, toAvailabilityConfig, type RuleRow } from "@/lib/booking/availability";
import { formatLongDate } from "@/lib/booking/format";
import { computeAvailability, zonedDateString } from "@/lib/booking/slots";
import { site } from "@/lib/site";
import { createServiceClient } from "@/lib/supabase/service";

export const metadata: Metadata = { title: "Disponibilidade" };

const weekdayOrder = [1, 2, 3, 4, 5, 6, 0];
const weekdayNames = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
const slotOptions = [15, 20, 30, 45, 60, 90];

function hhmm(time: string): string {
  return time.slice(0, 5);
}

function WeekdaySelect({ defaultValue = 1 }: { defaultValue?: number }) {
  return (
    <select name="weekday" defaultValue={defaultValue} className={`${adminInputClasses} h-11`}>
      {weekdayOrder.map((weekday) => (
        <option key={weekday} value={weekday}>
          {weekdayNames[weekday]}
        </option>
      ))}
    </select>
  );
}

function DeleteButton({ kind, id, label, confirmMessage }: { kind: "rule" | "break" | "blocked"; id: string; label: string; confirmMessage: string }) {
  return (
    <ActionForm action={deleteAvailabilityItem} confirmMessage={confirmMessage} hideMessage className="flex shrink-0 flex-wrap items-end">
      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="id" value={id} />
      <SubmitButton variant="ghost" size="sm" ariaLabel={label} className="h-11 w-11 px-0 text-danger">
        <CloseIcon size={18} />
      </SubmitButton>
    </ActionForm>
  );
}

function RuleFields({ rule }: { rule?: RuleRow }) {
  const slotValue = rule?.slot_minutes ?? 30;
  const options = slotOptions.includes(slotValue) ? slotOptions : [...slotOptions, slotValue].sort((a, b) => a - b);
  return (
    <>
      <input type="hidden" name="id" value={rule?.id ?? ""} />
      {rule ? <input type="hidden" name="weekday" value={rule.weekday} /> : (
        <label className={`${adminLabelClasses} col-span-2 sm:col-span-1`}>
          Dia
          <WeekdaySelect />
        </label>
      )}
      <label className={adminLabelClasses}>
        Início
        <input type="time" name="start_time" required step={300} defaultValue={rule ? hhmm(rule.start_time) : "10:00"} className={`${adminInputClasses} h-11`} />
      </label>
      <label className={adminLabelClasses}>
        Fim
        <input type="time" name="end_time" required step={300} defaultValue={rule ? hhmm(rule.end_time) : "18:00"} className={`${adminInputClasses} h-11`} />
      </label>
      <label className={adminLabelClasses}>
        Duração
        <select name="slot_minutes" defaultValue={slotValue} className={`${adminInputClasses} h-11`}>
          {options.map((minutes) => (
            <option key={minutes} value={minutes}>
              {minutes} min
            </option>
          ))}
        </select>
      </label>
      <label className="flex h-11 items-center gap-2 self-end text-sm font-medium text-muted">
        <input type="checkbox" name="active" defaultChecked={rule ? rule.active : true} className="h-5 w-5 accent-accent" />
        Ativo
      </label>
    </>
  );
}

export default async function AdminAvailabilityPage() {
  await requireAdmin();
  const client = createServiceClient();
  const now = new Date();
  const [tables, busy] = await Promise.all([loadAvailabilityTables(client), loadBusyIntervals(client, now)]);
  const config = toAvailabilityConfig(tables);
  const preview = computeAvailability({ ...config, maxDaysAhead: Math.min(config.maxDaysAhead, 13) }, now, busy);
  const today = zonedDateString(now, site.timeZone);
  const upcomingBlocked = tables.blockedDates.filter((row) => row.date >= today);

  return (
    <>
      <AdminPageHeader
        title="Disponibilidade"
        description="Horários em que os clientes podem marcar demonstrações (hora de Lisboa)."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-6">
          <Panel title="Horário semanal">
            <div className="flex flex-col gap-5">
              {weekdayOrder.map((weekday) => {
                const rules = tables.rules.filter((rule) => rule.weekday === weekday);
                return (
                  <div key={weekday} className="flex flex-col gap-2 border-b border-line pb-5 last:border-b-0 last:pb-0">
                    <h3 className="text-sm font-semibold text-text">{weekdayNames[weekday]}</h3>
                    {rules.length ? (
                      rules.map((rule) => (
                        <div key={rule.id} className="flex items-start gap-2">
                          <ActionForm action={saveRule} className="grid flex-1 grid-cols-2 items-end gap-2 sm:grid-cols-[1fr_1fr_1fr_auto_auto]">
                            <RuleFields rule={rule} />
                            <SubmitButton variant="secondary" size="sm" pendingLabel="…" className="h-11">
                              Guardar
                            </SubmitButton>
                          </ActionForm>
                          <DeleteButton kind="rule" id={rule.id} label={`Remover horário de ${weekdayNames[weekday]}`} confirmMessage="Remover este horário?" />
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-subtle">Fechado</p>
                    )}
                  </div>
                );
              })}
            </div>
          </Panel>

          <Panel title="Adicionar horário">
            <ActionForm action={saveRule} className="grid grid-cols-2 items-end gap-2 sm:grid-cols-[1.2fr_1fr_1fr_1fr_auto_auto]">
              <RuleFields />
              <SubmitButton size="sm" pendingLabel="…" className="h-11">
                Adicionar
              </SubmitButton>
            </ActionForm>
          </Panel>

          <Panel title="Pausas (ex.: almoço)">
            <div className="flex flex-col gap-2">
              {tables.breaks.length ? (
                <ul className="divide-y divide-line">
                  {[...tables.breaks]
                    .sort((a, b) => weekdayOrder.indexOf(a.weekday) - weekdayOrder.indexOf(b.weekday) || a.start_time.localeCompare(b.start_time))
                    .map((item) => (
                      <li key={item.id} className="flex items-center justify-between gap-3 py-1.5">
                        <span className="text-sm text-text">
                          {weekdayNames[item.weekday]} ·{" "}
                          <span className="tabular-nums">
                            {hhmm(item.start_time)}–{hhmm(item.end_time)}
                          </span>
                        </span>
                        <DeleteButton kind="break" id={item.id} label="Remover pausa" confirmMessage="Remover esta pausa?" />
                      </li>
                    ))}
                </ul>
              ) : (
                <EmptyState>Sem pausas.</EmptyState>
              )}
              <ActionForm action={createBreak} className="mt-3 grid grid-cols-2 items-end gap-2 sm:grid-cols-[1.2fr_1fr_1fr_auto]">
                <label className={`${adminLabelClasses} col-span-2 sm:col-span-1`}>
                  Dia
                  <WeekdaySelect />
                </label>
                <label className={adminLabelClasses}>
                  Início
                  <input type="time" name="start_time" required step={300} defaultValue="13:00" className={`${adminInputClasses} h-11`} />
                </label>
                <label className={adminLabelClasses}>
                  Fim
                  <input type="time" name="end_time" required step={300} defaultValue="14:00" className={`${adminInputClasses} h-11`} />
                </label>
                <SubmitButton size="sm" pendingLabel="…" className="col-span-2 h-11 sm:col-span-1">
                  Adicionar
                </SubmitButton>
              </ActionForm>
            </div>
          </Panel>
        </div>

        <div className="flex flex-col gap-6">
          <Panel title="Regras gerais">
            <ActionForm action={saveSettings} className="flex flex-col gap-3">
              <label className={adminLabelClasses}>
                Antecedência mínima (horas)
                <input
                  type="number"
                  name="min_notice_hours"
                  min={0}
                  max={720}
                  required
                  defaultValue={tables.settings.min_notice_hours}
                  className={`${adminInputClasses} h-11`}
                />
              </label>
              <label className={adminLabelClasses}>
                Marcações até (dias à frente)
                <input
                  type="number"
                  name="max_days_ahead"
                  min={1}
                  max={365}
                  required
                  defaultValue={tables.settings.max_days_ahead}
                  className={`${adminInputClasses} h-11`}
                />
              </label>
              <p className="text-xs text-subtle">Fuso horário: {tables.settings.timezone}</p>
              <SubmitButton size="sm" pendingLabel="A guardar…" className="self-start">
                Guardar
              </SubmitButton>
            </ActionForm>
          </Panel>

          <Panel title="Dias bloqueados">
            <div className="flex flex-col gap-2">
              {upcomingBlocked.length ? (
                <ul className="divide-y divide-line">
                  {upcomingBlocked.map((row) => (
                    <li key={row.id} className="flex items-center justify-between gap-3 py-1.5">
                      <span className="min-w-0 text-sm">
                        <span className="block text-text first-letter:uppercase">{formatLongDate(row.date, "pt")}</span>
                        {row.reason ? <span className="block truncate text-subtle">{row.reason}</span> : null}
                      </span>
                      <DeleteButton kind="blocked" id={row.id} label="Desbloquear dia" confirmMessage="Desbloquear este dia?" />
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyState>Nenhum dia bloqueado.</EmptyState>
              )}
              <ActionForm action={createBlockedDate} className="mt-3 flex flex-col gap-2">
                <label className={adminLabelClasses}>
                  Data
                  <input type="date" name="date" required min={today} className={`${adminInputClasses} h-11`} />
                </label>
                <label className={adminLabelClasses}>
                  Motivo (opcional)
                  <input type="text" name="reason" maxLength={200} placeholder="Férias, feriado…" className={`${adminInputClasses} h-11`} />
                </label>
                <SubmitButton size="sm" pendingLabel="…" className="self-start">
                  Bloquear dia
                </SubmitButton>
              </ActionForm>
            </div>
          </Panel>

          <Panel title="Pré-visualização (14 dias)">
            <ul className="flex flex-col gap-1 text-sm">
              {preview.map((day) => (
                <li key={day.date} className="flex items-center justify-between gap-3 py-0.5">
                  <span className={`first-letter:uppercase ${day.slots.length ? "text-text" : "text-subtle"}`}>{formatLongDate(day.date, "pt")}</span>
                  <span className={`tabular-nums ${day.slots.length ? "font-semibold text-text" : "text-subtle"}`}>
                    {day.slots.length ? `${day.slots.length} vagas` : "—"}
                  </span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </>
  );
}

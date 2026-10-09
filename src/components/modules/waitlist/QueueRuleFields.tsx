"use client";

import { useState } from "react";
import { adminInputClasses, adminLabelClasses } from "@/components/backoffice/ui";

const input = `${adminInputClasses} h-11`;
const graceOptions = [2, 3, 5, 10, 15];

type Ask = "ask_party" | "ask_service" | "ask_staff";

const askLabels: Record<Ask, string> = {
  ask_party: "Número de pessoas",
  ask_service: "Serviço",
  ask_staff: "Profissional preferido",
};

/**
 * The queue rules that depend on each other: only the questions that suit the kind of business are
 * shown (the others under «Mais opções», unless already switched on), the most people per group only
 * when the party size is asked, and the minutes per turn only when the wait is not worked out from
 * the services' durations. Hidden fields stay in the form, so saving keeps their values.
 */
export function QueueRuleFields({
  avgMinutes,
  graceMinutes,
  maxWaiting,
  maxParty,
  asks,
  suited,
  hasServices,
  hasStaff,
  staffLabel = "Profissional preferido",
}: {
  avgMinutes: number;
  graceMinutes: number;
  maxWaiting: number;
  maxParty: number;
  asks: Record<Ask, boolean>;
  /** Questions that make sense for this kind of business. */
  suited: Record<Ask, boolean>;
  hasServices: boolean;
  hasStaff: boolean;
  /** «Barbeiro preferido», «Campo preferido»… */
  staffLabel?: string;
}) {
  const [on, setOn] = useState(asks);
  const all: Ask[] = ["ask_party", "ask_service", "ask_staff"];
  const shown = all.filter((ask) => suited[ask] || asks[ask]);
  const more = all.filter((ask) => !shown.includes(ask));
  const missing: Partial<Record<Ask, string>> = {
    ask_service: hasServices ? undefined : "guarde e adicione os serviços abaixo",
    ask_staff: hasStaff ? undefined : "guarde e adicione os profissionais abaixo",
  };

  const checkbox = (ask: Ask) => (
    <label key={ask} className="flex items-center gap-2 text-sm text-text">
      <input
        type="checkbox"
        name={ask}
        checked={on[ask]}
        onChange={(event) => setOn((current) => ({ ...current, [ask]: event.target.checked }))}
        className="h-4.5 w-4.5 accent-accent"
      />
      {ask === "ask_staff" ? staffLabel : askLabels[ask]}
      {on[ask] && missing[ask] ? <span className="text-subtle">({missing[ask]})</span> : null}
    </label>
  );

  return (
    <>
      <fieldset className="flex flex-col gap-2 sm:col-span-2">
        <legend className="mb-1 text-sm font-medium text-muted">O que perguntar ao cliente</legend>
        {shown.length ? shown.map(checkbox) : <p className="text-sm text-subtle">Só o nome e o contacto.</p>}
        {more.length ? (
          <details className="text-sm">
            <summary className="cursor-pointer text-muted">Mais opções</summary>
            <div className="mt-2 flex flex-col gap-2">{more.map(checkbox)}</div>
          </details>
        ) : null}
      </fieldset>
      <label className={`${adminLabelClasses} ${on.ask_service ? "hidden" : ""}`}>
        Minutos por vez (média)
        <input name="avg_minutes" type="number" min={1} max={240} required defaultValue={avgMinutes} className={input} />
        <span className="text-xs font-normal text-subtle">
          Tempo médio entre duas chamadas. Depois de 3 chamadas, a espera estimada tem também em conta o ritmo real da última hora e meia.
        </span>
      </label>
      <label className={adminLabelClasses}>
        Tempo para chegar depois de chamado
        <select name="grace_minutes" defaultValue={graceMinutes} className={input}>
          {graceOptions.concat(graceOptions.includes(graceMinutes) ? [] : [graceMinutes]).map((minutes) => (
            <option key={minutes} value={minutes}>
              {minutes} minutos
            </option>
          ))}
        </select>
        <span className="text-xs font-normal text-subtle">
          O cliente deve esperar no local: quando é chamado vê «venha já» e até que horas guardamos a vez. Depois disso, «Não apareceu» chama o seguinte.
        </span>
      </label>
      <label className={adminLabelClasses}>
        Máximo à espera
        <input name="max_waiting" type="number" min={1} max={500} required defaultValue={maxWaiting} className={input} />
      </label>
      <label className={`${adminLabelClasses} ${on.ask_party ? "" : "hidden"}`}>
        Máximo de pessoas por grupo
        <input name="max_party" type="number" min={1} max={100} required defaultValue={maxParty} className={input} />
      </label>
      {on.ask_service ? (
        <p className="text-xs text-subtle sm:col-span-2">A espera estimada soma a duração dos serviços das pessoas à frente, dividida pelos profissionais a trabalhar.</p>
      ) : null}
    </>
  );
}

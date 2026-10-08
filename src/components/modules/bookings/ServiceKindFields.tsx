"use client";

import { useState } from "react";
import { adminInputClasses, adminLabelClasses } from "@/components/backoffice/ui";

const input = `${adminInputClasses} h-10 text-sm`;

const durations = [10, 15, 20, 30, 40, 45, 60, 75, 90, 120, 150, 180, 240];
const gaps = [0, 5, 10, 15, 20, 30];

function minutesLabel(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours} h ${rest}` : `${hours} ${hours === 1 ? "hora" : "horas"}`;
}

/**
 * How a service is booked, with only the fields that matter for the choice: duration and who does
 * it (one at a time), or places per turn and the most people per booking (several at once).
 */
export function ServiceKindFields({
  kind: initialKind,
  duration,
  buffer,
  capacity,
  maxParty,
  staff,
  chosen,
}: {
  kind: "one" | "group";
  duration: number;
  buffer: number;
  capacity: number | null;
  maxParty: number;
  staff: { id: string; name: string }[];
  chosen: string[];
}) {
  const [kind, setKind] = useState(initialKind);
  const durationOptions = durations.includes(duration) ? durations : [...durations, duration].sort((a, b) => a - b);
  return (
    <>
      <fieldset className="flex flex-col gap-2 sm:col-span-2">
        <legend className="mb-1 text-sm font-medium text-muted">Como se reserva</legend>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {(
            [
              ["one", "Um cliente de cada vez", "Cortes, consultas, campos: cada pessoa ou espaço atende um de cada vez."],
              ["group", "Várias pessoas à mesma hora", "Restaurantes: aceita reservas até encher a lotação do almoço ou do jantar."],
            ] as const
          ).map(([value, title, hint]) => (
            <label key={value} className="flex cursor-pointer gap-2.5 rounded-2xl border border-line p-3 text-sm has-[:checked]:border-accent has-[:checked]:bg-accent-soft/50">
              <input type="radio" name="booking_kind" value={value} checked={kind === value} onChange={() => setKind(value)} className="mt-0.5 h-4 w-4 accent-accent" />
              <span>
                <span className="block font-semibold text-text">{title}</span>
                <span className="block text-xs text-muted">{hint}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      {kind === "one" ? (
        <>
          <label className={adminLabelClasses}>
            Duração
            <select name="duration_minutes" defaultValue={duration} className={input}>
              {durationOptions.map((value) => (
                <option key={value} value={value}>
                  {minutesLabel(value)}
                </option>
              ))}
            </select>
          </label>
          <label className={adminLabelClasses}>
            Intervalo depois
            <select name="buffer_minutes" defaultValue={buffer} className={input}>
              {gaps.map((value) => (
                <option key={value} value={value}>
                  {value ? `${value} min (limpeza, preparação)` : "Sem intervalo"}
                </option>
              ))}
            </select>
          </label>
          {staff.length ? (
            <fieldset className="flex flex-col gap-2 sm:col-span-2">
              <input type="hidden" name="staff_choice" value="1" />
              <legend className="mb-1 text-sm font-medium text-muted">Quem faz este serviço</legend>
              <div className="flex flex-wrap gap-2">
                {staff.map((person) => (
                  <label key={person.id} className="flex cursor-pointer items-center gap-2 rounded-full border border-line px-3 py-1.5 text-sm text-text has-[:checked]:border-accent has-[:checked]:bg-accent-soft/50">
                    <input type="checkbox" name="staff_ids" value={person.id} defaultChecked={chosen.includes(person.id)} className="h-4 w-4 accent-accent" />
                    {person.name}
                  </label>
                ))}
              </div>
              <span className="text-xs text-subtle">Nenhum escolhido: qualquer um pode fazer.</span>
            </fieldset>
          ) : null}
        </>
      ) : (
        <>
          <label className={adminLabelClasses}>
            Pessoas por turno
            <input name="capacity" type="number" min={1} max={10000} required defaultValue={capacity ?? 40} className={input} />
            <span className="text-xs font-normal text-subtle">Ex.: 50. Quando as reservas do almoço (ou do jantar) somarem 50 pessoas, esse turno fica cheio.</span>
          </label>
          <label className={adminLabelClasses}>
            Máximo de pessoas por reserva
            <input name="max_party" type="number" min={1} max={1000} required defaultValue={maxParty} className={input} />
            <span className="text-xs font-normal text-subtle">Online. Grupos maiores veem o seu contacto.</span>
          </label>
          <input type="hidden" name="staff_choice" value="1" />
        </>
      )}
    </>
  );
}

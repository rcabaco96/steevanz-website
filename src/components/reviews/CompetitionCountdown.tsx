"use client";

import { useSyncExternalStore } from "react";
import { ClockIcon } from "@/components/icons";
import { competitionUpdateHours, competitionUpdatingMinutes, countdownText, nextCompetitionUpdate, previousCompetitionUpdate, slotLabel } from "@/lib/reviews/competition-schedule";
import { InfoTip } from "./InfoTip";

function subscribe(onChange: () => void) {
  const timer = window.setInterval(onChange, 1000);
  return () => window.clearInterval(timer);
}

/** Current second; null while rendering on the server (the countdown only exists in the browser). */
function useSecond(): number | null {
  return useSyncExternalStore(
    subscribe,
    () => Math.floor(Date.now() / 1000) * 1000,
    () => null,
  );
}

const hoursText = competitionUpdateHours.map((hour) => `${String(hour).padStart(2, "0")}:00`).join(" e às ");

/** Countdown to the next update of the shared competition base (10:00 and 19:00, Portuguese time). */
export function CompetitionCountdown() {
  const now = useSecond();
  const date = now === null ? null : new Date(now);
  const next = date ? nextCompetitionUpdate(date) : null;
  const previous = date ? previousCompetitionUpdate(date) : null;
  const updating = date && previous ? date.getTime() - previous.getTime() < competitionUpdatingMinutes * 60_000 : false;

  return (
    <div className="flex items-center gap-2 rounded-full border border-line bg-surface py-1.5 pr-1.5 pl-3 text-sm">
      <ClockIcon size={16} className="shrink-0 text-accent-text" />
      <span className="flex flex-col leading-tight sm:flex-row sm:items-baseline sm:gap-1.5">
        <span className="text-xs text-subtle">{updating ? "A atualizar a concorrência" : "Próxima atualização"}</span>
        <span className="font-semibold text-text tabular-nums" aria-live="off">
          {updating ? `desde as ${slotLabel(previous!)}` : next && date ? countdownText(next.getTime() - date.getTime()) : `às ${hoursText}`}
        </span>
      </span>
      <InfoTip label="Atualização da concorrência">
        Os números desta tabela vêm de uma base partilhada com todos os negócios da zona. É atualizada duas vezes por dia, às {hoursText} (hora de Portugal): nessa
        altura lemos no Google cada negócio que ainda não foi atualizado desde a atualização anterior (por exemplo, quando o próprio negócio já atualizou os seus dados).
        Os números novos podem demorar alguns minutos a aparecer.
      </InfoTip>
    </div>
  );
}

"use client";

import { useState, useTransition } from "react";
import { setAutoModeAction } from "@/lib/reviews/reply-actions";
import { autoLimitOptions, replyWindowDays, type AutoMode } from "@/lib/reviews/replies";
import { AutoReplyChoice, type AutoReplyValue } from "./AutoReplyChoice";
import { InfoTip } from "./InfoTip";

interface AutoReplyPanelProps {
  slug: string;
  mode: AutoMode;
  limit: number;
  used: number;
  negative: boolean;
}

/** Inbox card to switch automatic replies on/off; saves on every change. */
export function AutoReplyPanel({ slug, mode, limit, used, negative }: AutoReplyPanelProps) {
  const [value, setValue] = useState<AutoReplyValue>({ mode, limit, negative });
  const [error, setError] = useState<string | null>(null);
  const [saving, startSaving] = useTransition();
  const changed = value.mode !== mode || value.limit !== limit || value.negative !== negative;

  function change(next: AutoReplyValue) {
    setValue(next);
    setError(null);
    startSaving(async () => {
      const result = await setAutoModeAction(slug, next);
      if (!result.ok) setError(result.message);
    });
  }

  const status =
    mode === "off"
      ? "Cada resposta espera pela sua aprovação."
      : mode === "always"
        ? `${used} ${used === 1 ? "resposta aprovada" : "respostas aprovadas"} automaticamente.`
        : used >= limit
          ? `As ${limit} respostas automáticas já foram usadas: as próximas esperam pela sua aprovação.`
          : `${used} de ${limit} respostas automáticas usadas.`;

  return (
    <div className="card flex flex-col gap-3 p-4 sm:p-5">
      <div className="flex items-center gap-1.5">
        <h2 className="font-semibold text-text">Resposta automática</h2>
        <InfoTip label="Resposta automática">
          Quando está ligada, cada resposta nova preparada pelo sistema fica logo aprovada, sem esperar por si. «Só as próximas» aprova um número fixo de respostas e depois volta a
          pedir a sua aprovação; mudar o número recomeça a contagem. As reviews negativas (1 a 3★) e as respostas reescritas depois de uma rejeição esperam sempre por si, a não
          ser que inclua as negativas. As respostas a reviews antigas (publicadas mais de {replyWindowDays} dias antes de configurar as respostas) também esperam sempre por si.
          Enquanto o Google não estiver ligado, «aprovada» não publica nada.
        </InfoTip>
      </div>
      <AutoReplyChoice {...value} limits={autoLimitOptions} hideLegend sidebar onChange={change} />
      <p role="status" className={`text-sm ${error ? "text-danger" : "text-subtle"}`}>
        {error ?? (saving ? "A guardar…" : changed ? "Guardado." : status)}
      </p>
    </div>
  );
}

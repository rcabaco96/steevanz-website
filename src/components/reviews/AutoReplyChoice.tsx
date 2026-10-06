"use client";

import { Check } from "@/components/icons";
import type { AutoMode } from "@/lib/reviews/replies";

export interface AutoReplyValue {
  mode: AutoMode;
  limit: number;
  negative: boolean;
}

interface AutoReplyChoiceProps extends AutoReplyValue {
  limits: number[];
  disabled?: boolean;
  /** Hide the legend visually when the surrounding card already has the title. */
  hideLegend?: boolean;
  /** Inside the inbox side column (22rem on desktop): too narrow for the options side by side there. */
  sidebar?: boolean;
  onChange: (value: AutoReplyValue) => void;
}

/** "Resposta automática": off, only the next N replies (to try it out), or always. */
export function AutoReplyChoice({ mode, limit, negative, limits, disabled, hideLegend, sidebar, onChange }: AutoReplyChoiceProps) {
  const options: { id: AutoMode; title: string; detail: string }[] = [
    { id: "off", title: "Desligada", detail: "Aprova cada resposta." },
    { id: "limit", title: "Só as próximas", detail: "Para experimentar." },
    { id: "always", title: "Sempre", detail: "Aprova sozinho." },
  ];
  return (
    <fieldset disabled={disabled} className="flex flex-col gap-3 disabled:opacity-60">
      <legend className={hideLegend ? "sr-only" : "mb-1.5 text-sm font-semibold text-text"}>Resposta automática</legend>
      {/* Side by side only where "✓ Desligada" fits in a third: stacked on phones and in the desktop side column. */}
      <div className={`grid gap-2 sm:grid-cols-3 ${sidebar ? "lg:grid-cols-1" : ""}`}>
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            aria-pressed={mode === option.id}
            onClick={() => onChange({ mode: option.id, limit, negative })}
            className={`flex min-h-12 flex-col items-start justify-center rounded-xl border px-3 py-2.5 text-left transition-colors ${
              mode === option.id ? "border-accent bg-accent-soft text-text" : "border-line bg-surface text-muted hover:border-line-strong hover:text-text"
            }`}
          >
            <span className="flex items-center gap-1 text-sm font-semibold">
              {mode === option.id ? <Check size={14} className="shrink-0 text-accent-text" /> : null}
              {option.title}
            </span>
            <span className="text-xs text-subtle">{option.detail}</span>
          </button>
        ))}
      </div>
      {mode === "limit" ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted">Aprovar automaticamente as próximas</span>
          <div className="flex gap-1.5">
            {limits.map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={limit === value}
                onClick={() => onChange({ mode, limit: value, negative })}
                className={`h-9 min-w-11 rounded-full px-3 text-sm font-semibold ${limit === value ? "bg-surface-inverse text-inverse" : "border border-line bg-surface text-muted hover:text-text"}`}
              >
                {value}
              </button>
            ))}
          </div>
          <span className="text-sm text-muted">respostas.</span>
        </div>
      ) : null}
      {mode !== "off" ? (
        <label className="flex items-start gap-3 rounded-xl border border-line p-3">
          <input
            type="checkbox"
            checked={negative}
            onChange={(event) => onChange({ mode, limit, negative: event.target.checked })}
            className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--color-accent)]"
          />
          <span className="flex flex-col">
            <span className="text-sm font-semibold text-text">Incluir reviews negativas (1 a 3★)</span>
            <span className="text-xs text-subtle">Recomendamos deixar desligado: as negativas pedem sempre o seu olhar.</span>
          </span>
        </label>
      ) : null}
    </fieldset>
  );
}

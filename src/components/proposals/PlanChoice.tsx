"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { AlertIcon } from "@/components/icons";
import type { PaymentPlan } from "@/lib/proposals/totals";

/** One way to pay the monthly lines, with its amounts already formatted on the server. */
export interface PlanOption {
  id: PaymentPlan;
  title: string;
  badge?: string;
  /** «450 € + IVA/ano». */
  price: string;
  /** The same 12 months paid monthly, struck through: «540 €». */
  was?: string;
  /** «poupa 90 € + IVA por ano». */
  savings?: string;
  note: string;
  /** The «Na adjudicação» box for this plan. */
  due: { label: string; subtotal: string; vat: string; total: string; after: string };
}

interface PlanContextValue {
  options: PlanOption[];
  plan: PaymentPlan | null;
  setPlan: (plan: PaymentPlan) => void;
}

const PlanContext = createContext<PlanContextValue>({ options: [], plan: null, setPlan: () => {} });

/** The plan picked in the form, shared with the «Na adjudicação» box higher up the page. */
export function PlanProvider({ options, children }: { options: PlanOption[]; children: ReactNode }) {
  const [plan, setPlan] = useState<PaymentPlan | null>(options[0]?.id ?? null);
  return <PlanContext.Provider value={{ options, plan, setPlan }}>{children}</PlanContext.Provider>;
}

export function usePlan(): PlanContextValue {
  return useContext(PlanContext);
}

/** What is invoiced on acceptance, following the plan chosen in the form (annual by default). */
export function DueBox() {
  const { options, plan } = usePlan();
  const option = options.find((item) => item.id === plan) ?? options[0];
  if (!option) return null;
  return (
    <section aria-live="polite" className="rounded-[var(--radius-card)] border border-line bg-surface-2 px-5 py-5 sm:px-7">
      <p className="text-sm font-semibold text-text">Na adjudicação: {option.due.label}</p>
      <p className="mt-1 text-muted tabular-nums">
        {option.due.subtotal} + IVA {option.due.vat} = <strong className="text-text">{option.due.total}</strong>
      </p>
      <p className="mt-1 text-sm text-subtle">{option.due.after}</p>
      {options.length > 1 ? <p className="mt-2 text-xs text-subtle">Escolha o plano no formulário de adjudicação, mais abaixo.</p> : null}
    </section>
  );
}

/** «Como prefere pagar as mensalidades?»: only when the proposal offers more than one plan. */
export function PlanField({ error }: { error?: string }) {
  const { options, plan, setPlan } = usePlan();
  if (options.length < 2) return null;
  const current = options.find((option) => option.id === plan);
  return (
    <fieldset className="flex flex-col gap-2.5" aria-describedby={error ? "field-plan-error" : undefined}>
      <legend className="mb-2.5 text-sm font-semibold text-text">Como prefere pagar as mensalidades?</legend>
      {options.map((option) => (
        <label
          key={option.id}
          className="flex cursor-pointer items-start gap-3 rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-line-strong has-[:checked]:border-accent/55 has-[:checked]:bg-accent-soft/40"
        >
          <input
            type="radio"
            name="plan"
            value={option.id}
            required
            defaultChecked={option.id === plan}
            onChange={() => setPlan(option.id)}
            className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-accent"
          />
          <span className="min-w-0 flex-1">
            <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="font-semibold text-text">{option.title}</span>
              {option.badge ? (
                <span className="rounded-full bg-gold-soft px-2 py-0.5 text-xs font-semibold text-gold-text ring-1 ring-gold/40">{option.badge}</span>
              ) : null}
            </span>
            <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 tabular-nums">
              {option.was ? (
                <s className="text-subtle" aria-label={`em vez de ${option.was}`}>
                  {option.was}
                </s>
              ) : null}
              <span className="font-semibold text-text">{option.price}</span>
            </span>
            {option.savings ? (
              <span className="mt-1.5 inline-flex rounded-full bg-success-soft px-2.5 py-0.5 text-xs font-semibold text-success ring-1 ring-success/25">{option.savings}</span>
            ) : null}
            <span className="mt-0.5 block text-sm leading-snug text-muted">{option.note}</span>
          </span>
        </label>
      ))}
      {current ? (
        <p aria-live="polite" className="text-sm text-muted tabular-nums">
          Na adjudicação: <strong className="text-text">{current.due.total}</strong> com IVA ({current.due.label}).
        </p>
      ) : null}
      {error ? (
        <p id="field-plan-error" className="flex items-center gap-1.5 text-sm text-danger" role="alert">
          <AlertIcon size={15} className="shrink-0" />
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}

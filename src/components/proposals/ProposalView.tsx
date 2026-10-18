import type { ReactNode } from "react";
import { Check, MailIcon, PhoneIcon } from "@/components/icons";
import type { Proposal, ProposalLine } from "@/content/proposals";
import { phoneDisplay } from "@/lib/proposals/accept";
import {
  annualLineCents,
  annualLineSavingsCents,
  annualPaidMonths,
  dueLabel,
  dueOnAcceptance,
  formatDate,
  formatEuros,
  formatQuantity,
  freeMonthsLabel,
  lineTotal,
  planOptions,
  proposalTotals,
  validUntil,
  type GroupTotals,
  twelveMonthsCents,
  type PaymentPlan,
} from "@/lib/proposals/totals";
import { site } from "@/lib/site";
import { AcceptanceForm } from "./AcceptanceForm";
import { DueBox, PlanProvider, type PlanOption } from "./PlanChoice";

function Card({ title, eyebrow, children, className = "" }: { title: string; eyebrow?: string; children: ReactNode; className?: string }) {
  return (
    <section className={`card px-5 py-6 sm:px-7 ${className}`}>
      {eyebrow ? <p className="eyebrow mb-1.5">{eyebrow}</p> : null}
      <h2 className="display text-[1.45rem] text-text">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

interface AnnualRow {
  /** The line as 12 monthly payments, struck through: «180 €». */
  was: string;
  /** «150 €». */
  price: string;
  /** «30 €». */
  save: string;
}

function Lines({ lines, suffix = "", annual }: { lines: readonly ProposalLine[]; suffix?: string; annual?: (line: ProposalLine) => AnnualRow }) {
  return (
    <ul className="divide-y divide-line border-y border-line">
      {lines.map((line) => {
        const total = lineTotal(line);
        return (
          <li key={line.description} className="py-3.5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="font-semibold leading-snug text-text">{line.description}</p>
                {line.detail ? <p className="mt-0.5 text-sm text-subtle">{line.detail}</p> : null}
                {line.quantity > 1 ? <p className="mt-0.5 text-sm text-muted tabular-nums">{formatQuantity(line)}</p> : null}
              </div>
              <div className="shrink-0 pt-px text-right whitespace-nowrap tabular-nums">
                <p className="font-semibold text-text">
                  {formatEuros(total.grossCents)}
                  {suffix ? <span className="text-sm font-normal text-subtle">{suffix}</span> : null}
                </p>
              </div>
            </div>
            {annual ? (
              <AnnualLineRow row={annual(line)} />
            ) : null}
            {line.discount && total.discountCents ? (
              <div className="mt-2 flex items-start justify-between gap-4 rounded-xl bg-success-soft px-3 py-2 text-sm text-success">
                <p className="min-w-0 leading-snug">{line.discount.description}</p>
                <p className="shrink-0 font-semibold whitespace-nowrap tabular-nums">− {formatEuros(total.discountCents)}</p>
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

function Totals({ totals, vatRate, suffix = "", compact = false }: { totals: GroupTotals; vatRate: number; suffix?: string; compact?: boolean }) {
  return (
    <dl className="mt-4 flex flex-col gap-1.5 text-sm tabular-nums">
      <div className="flex justify-between gap-4 text-muted">
        <dt>Subtotal (sem IVA)</dt>
        <dd className="whitespace-nowrap">
          {formatEuros(totals.subtotalCents)}
          {suffix}
        </dd>
      </div>
      <div className="flex justify-between gap-4 text-muted">
        <dt>IVA ({vatRate}%)</dt>
        <dd className="whitespace-nowrap">
          {formatEuros(totals.vatCents)}
          {suffix}
        </dd>
      </div>
      <div className="mt-1.5 flex items-baseline justify-between gap-4 border-t border-line pt-3 text-text">
        <dt className="font-semibold whitespace-nowrap">Total com IVA</dt>
        <dd className={`display whitespace-nowrap ${compact ? "text-[1.35rem]" : "text-[1.6rem]"}`}>
          {formatEuros(totals.totalCents)}
          {suffix ? <span className="font-sans text-sm text-subtle">{suffix}</span> : null}
        </dd>
      </div>
    </dl>
  );
}

/** Under a monthly line: its price for a year paid upfront, against 12 monthly payments, and the saving. */
function AnnualLineRow({ row }: { row: AnnualRow }) {
  return (
    <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1.5 rounded-xl bg-gold-soft/60 px-3 py-2 text-sm tabular-nums">
      <span className="text-muted">Anual:</span>
      <s className="text-subtle" aria-label={`em vez de ${row.was}`}>
        {row.was}
      </s>
      <span className="font-semibold text-text">{row.price}/ano</span>
      <span className="ml-auto rounded-full bg-success-soft px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap text-success ring-1 ring-success/25">
        poupa {row.save}
      </span>
    </div>
  );
}

/** The recommended annual plan: the monthly lines a year upfront, with months free. */
function AnnualOption({ proposal, totals, monthly }: { proposal: Proposal; totals: GroupTotals; monthly: GroupTotals }) {
  const months = annualPaidMonths(proposal);
  const savings = proposalTotals(proposal).annualSavings;
  return (
    <div className="mt-5 rounded-2xl border border-gold/45 bg-gold-soft/45 px-4 py-4">
      <p className="inline-flex rounded-full bg-gold-soft px-2.5 py-1 text-xs font-semibold text-gold-text ring-1 ring-gold/40">Recomendado · {freeMonthsLabel(proposal)}</p>
      <p className="mt-2.5 font-semibold text-text">Anual, pago adiantado</p>
      <p className="text-sm text-muted">12 meses pelo preço de {months}.</p>
      <p className="mt-2 flex flex-wrap items-baseline gap-x-2 tabular-nums">
        <s className="text-subtle" aria-label={`em vez de ${formatEuros(monthly.subtotalCents * 12)}`}>
          {formatEuros(monthly.subtotalCents * 12)}
        </s>
        <span className="font-semibold text-text">{formatEuros(totals.subtotalCents)}/ano + IVA</span>
      </p>
      {savings ? (
        <p className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 tabular-nums">
          <span className="rounded-full bg-success-soft px-3 py-1 text-sm font-semibold text-success ring-1 ring-success/25">
            Poupa {formatEuros(savings.subtotalCents)} + IVA por ano
          </span>
          <span className="text-sm text-muted">({formatEuros(savings.totalCents)} com IVA)</span>
        </p>
      ) : null}
      <Totals totals={totals} vatRate={proposal.vatRate} suffix="/ano" compact />
    </div>
  );
}

function planOptionsFor(proposal: Proposal): PlanOption[] {
  const totals = proposalTotals(proposal);
  return planOptions(proposal).map((id: PaymentPlan) => {
    const due = dueOnAcceptance(proposal, id);
    const dueText = { label: dueLabel(proposal, id), subtotal: formatEuros(due.subtotalCents), vat: formatEuros(due.vatCents), total: formatEuros(due.totalCents) };
    if (id === "annual" && totals.annual) {
      return {
        id,
        title: "Anual",
        badge: `Recomendado · ${freeMonthsLabel(proposal)}`,
        price: `${formatEuros(totals.annual.subtotalCents)} + IVA/ano`,
        was: formatEuros(totals.monthly.subtotalCents * 12),
        savings: totals.annualSavings ? `poupa ${formatEuros(totals.annualSavings.subtotalCents)} + IVA por ano` : undefined,
        note: `12 meses pelo preço de ${annualPaidMonths(proposal)}, pago adiantado.`,
        due: { ...dueText, after: `Depois, ${formatEuros(totals.annual.totalCents)}/ano com IVA, a cada 12 meses.` },
      };
    }
    return {
      id,
      title: "Mensal",
      price: `${formatEuros(totals.monthly.subtotalCents)} + IVA/mês`,
      note: "Sem período mínimo; cancela com 30 dias de aviso.",
      due: { ...dueText, after: `Depois, ${formatEuros(totals.monthly.totalCents)}/mês com IVA, no início de cada mês.` },
    };
  });
}

/** The quote as a page: what is included, the lines, the totals, the conditions and the acceptance form. */
export function ProposalView({ proposal, expired }: { proposal: Proposal; expired: boolean }) {
  const totals = proposalTotals(proposal);
  const until = formatDate(validUntil(proposal));
  const plans = planOptionsFor(proposal);

  return (
    <div className="flex min-h-dvh flex-col">
      {/* Always the dark brand plum (also in dark mode, where the inverse surface turns light). */}
      <header className="relative overflow-hidden bg-[#1d1220] text-[#f7f1e8]">
        <div aria-hidden="true" className="pointer-events-none absolute -top-24 -right-20 h-64 w-64 rounded-full bg-[#7a2d60]/45 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-28 -left-16 h-56 w-56 rounded-full bg-[#cfa563]/20 blur-3xl" />
        <div className="relative mx-auto flex w-full max-w-2xl flex-col gap-3 px-4 pt-7 pb-10 sm:px-6 sm:pt-9 sm:pb-12">
          <p className="display text-[1.3rem] leading-none">
            Steevanz<span className="pl-0.5 text-[#e9c685]">.</span>
          </p>
          <p className="mt-6 font-mono text-[0.72rem] tracking-[0.16em] text-[#e9c685] uppercase">Proposta {proposal.number}</p>
          <h1 className="display text-[2.15rem] leading-[1.04] sm:text-[2.9rem]">
            Proposta para <span className="display-italic text-[#e9c685]">{proposal.clientName}</span>
          </h1>
          <p className="text-sm opacity-80">
            {formatDate(proposal.date)} · válida até {until}
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <span className="rounded-full bg-white/10 px-3 py-1.5 tabular-nums">
              Pagamento único <strong className="font-semibold">{formatEuros(totals.oneOff.subtotalCents)}</strong> + IVA
            </span>
            {totals.annual ? (
              <span className="rounded-full bg-white/10 px-3 py-1.5 tabular-nums">
                Anual <strong className="font-semibold">{formatEuros(totals.annual.subtotalCents)}/ano</strong> + IVA
              </span>
            ) : null}
            {proposal.monthly.length ? (
              <span className="rounded-full bg-white/10 px-3 py-1.5 tabular-nums">
                {totals.annual ? "ou mensal" : "Mensal"} <strong className="font-semibold">{formatEuros(totals.monthly.subtotalCents)}/mês</strong> + IVA
              </span>
            ) : null}
          </div>
        </div>
      </header>

      <PlanProvider options={plans}>
      <main className="relative mx-auto -mt-5 flex w-full max-w-2xl flex-1 flex-col gap-4 px-4 pb-12 sm:px-6">
        <Card title="O que inclui" eyebrow="Em resumo">
          <ul className="flex flex-col gap-3">
            {proposal.included.map((item) => (
              <li key={item} className="flex gap-3 leading-relaxed text-muted">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent-text">
                  <Check size={14} />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Card>

        {proposal.oneOff.length ? (
          <Card title="Pagamento único" eyebrow="Pago na adjudicação">
            <Lines lines={proposal.oneOff} />
            <Totals totals={totals.oneOff} vatRate={proposal.vatRate} />
          </Card>
        ) : null}

        {proposal.monthly.length ? (
          <Card title="Mensalidade" eyebrow={totals.annual ? "Por ano ou por mês" : "Todos os meses"}>
            <Lines
              lines={proposal.monthly}
              suffix="/mês"
              annual={
                totals.annual
                  ? (line) => ({
                      was: formatEuros(twelveMonthsCents(line)),
                      price: formatEuros(annualLineCents(proposal, line)),
                      save: formatEuros(annualLineSavingsCents(proposal, line)),
                    })
                  : undefined
              }
            />
            {totals.annual ? (
              <>
                <AnnualOption proposal={proposal} totals={totals.annual} monthly={totals.monthly} />
                <div className="mt-5 px-1">
                  <p className="font-semibold text-text">Ou mensal</p>
                  <p className="text-sm text-muted">Sem período mínimo; cancela com 30 dias de aviso.</p>
                  <Totals totals={totals.monthly} vatRate={proposal.vatRate} suffix="/mês" />
                </div>
              </>
            ) : (
              <Totals totals={totals.monthly} vatRate={proposal.vatRate} suffix="/mês" />
            )}
          </Card>
        ) : null}

        <DueBox />

        <Card title="Condições">
          <ul className="flex flex-col gap-2.5 text-sm leading-relaxed text-muted">
            {proposal.conditions.map((condition) => (
              <li key={condition} className="flex gap-2.5">
                <span aria-hidden="true" className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                <span>{condition}</span>
              </li>
            ))}
          </ul>
          {proposal.notes?.length ? (
            <div className="mt-5 rounded-2xl bg-surface-2 px-4 py-3 text-sm leading-relaxed text-muted">
              {proposal.notes.map((note) => (
                <p key={note}>{note}</p>
              ))}
            </div>
          ) : null}
        </Card>

        <section id="adjudicar" className="card scroll-mt-4 px-5 py-6 sm:px-7">
          <AcceptanceForm
            proposalId={proposal.id}
            clientName={proposal.clientName}
            number={proposal.number}
            nextSteps={proposal.nextSteps}
            expired={expired}
            validUntil={until}
          />
        </section>
      </main>
      </PlanProvider>

      <footer className="mx-auto flex w-full max-w-2xl flex-col items-center gap-3 px-4 pb-10 text-center text-sm text-subtle sm:px-6">
        <p>Alguma dúvida sobre a proposta? Fale connosco.</p>
        <div className="flex flex-wrap justify-center gap-2">
          <a href={site.phoneHref} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-4 font-medium text-muted hover:text-text">
            <PhoneIcon size={16} />
            {phoneDisplay}
          </a>
          <a href={`mailto:${site.email}`} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-4 font-medium text-muted hover:text-text">
            <MailIcon size={16} />
            {site.email}
          </a>
        </div>
        <p className="display-italic mt-2 text-base text-muted">Steevanz. Tecnologia do futuro. Com os bons modos de antigamente.</p>
      </footer>
    </div>
  );
}

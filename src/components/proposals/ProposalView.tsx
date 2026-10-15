import type { ReactNode } from "react";
import { Check, MailIcon, PhoneIcon } from "@/components/icons";
import type { Proposal, ProposalLine } from "@/content/proposals";
import { phoneDisplay } from "@/lib/proposals/accept";
import { formatDate, formatEuros, formatQuantity, lineTotal, proposalTotals, validUntil, type GroupTotals } from "@/lib/proposals/totals";
import { site } from "@/lib/site";
import { AcceptanceForm } from "./AcceptanceForm";

function Card({ title, eyebrow, children, className = "" }: { title: string; eyebrow?: string; children: ReactNode; className?: string }) {
  return (
    <section className={`card px-5 py-6 sm:px-7 ${className}`}>
      {eyebrow ? <p className="eyebrow mb-1.5">{eyebrow}</p> : null}
      <h2 className="display text-[1.45rem] text-text">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Lines({ lines, suffix = "" }: { lines: readonly ProposalLine[]; suffix?: string }) {
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
              <p className="shrink-0 pt-px font-semibold whitespace-nowrap text-text tabular-nums">
                {formatEuros(total.grossCents)}
                {suffix ? <span className="text-sm font-normal text-subtle">{suffix}</span> : null}
              </p>
            </div>
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

function Totals({ totals, vatRate, suffix = "" }: { totals: GroupTotals; vatRate: number; suffix?: string }) {
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
        <dt className="font-semibold">Total com IVA</dt>
        <dd className="display text-[1.6rem] whitespace-nowrap">
          {formatEuros(totals.totalCents)}
          {suffix ? <span className="font-sans text-sm text-subtle">{suffix}</span> : null}
        </dd>
      </div>
    </dl>
  );
}

/** The quote as a page: what is included, the lines, the totals, the conditions and the acceptance form. */
export function ProposalView({ proposal, expired }: { proposal: Proposal; expired: boolean }) {
  const totals = proposalTotals(proposal);
  const until = formatDate(validUntil(proposal));

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
            <span className="rounded-full bg-white/10 px-3 py-1.5 tabular-nums">
              Mensal <strong className="font-semibold">{formatEuros(totals.monthly.subtotalCents)}/mês</strong> + IVA
            </span>
          </div>
        </div>
      </header>

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
          <Card title="Mensalidade" eyebrow="Todos os meses">
            <Lines lines={proposal.monthly} suffix="/mês" />
            <Totals totals={totals.monthly} vatRate={proposal.vatRate} suffix="/mês" />
          </Card>
        ) : null}

        {proposal.oneOff.length && proposal.monthly.length ? (
          <section className="rounded-[var(--radius-card)] border border-accent/25 bg-accent-soft/60 px-5 py-5 sm:px-7">
            <p className="text-sm font-semibold text-accent-text">Na adjudicação: itens únicos + 1.ª mensalidade</p>
            <p className="mt-1 text-muted tabular-nums">
              {formatEuros(totals.dueOnAcceptance.subtotalCents)} + IVA {formatEuros(totals.dueOnAcceptance.vatCents)} ={" "}
              <strong className="text-text">{formatEuros(totals.dueOnAcceptance.totalCents)}</strong>
            </p>
            <p className="mt-1 text-sm text-subtle tabular-nums">
              Depois, {formatEuros(totals.monthly.totalCents)}/mês com IVA, no início de cada mês.
            </p>
          </section>
        ) : null}

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
        <p className="display-italic mt-2 text-base text-muted">Steevanz, com os bons modos de sempre.</p>
      </footer>
    </div>
  );
}

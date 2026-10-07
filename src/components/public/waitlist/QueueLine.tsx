/** The queue drawn as people: one dot per person ahead, and "you" at the end when given. */
export function QueueLine({ ahead, withYou = false, max = 14 }: { ahead: number; withYou?: boolean; max?: number }) {
  const shown = Math.min(ahead, max);
  const extra = ahead - shown;
  return (
    <div className="flex flex-wrap items-center gap-1.5" aria-hidden="true">
      {Array.from({ length: shown }, (_, index) => (
        <span key={index} className="h-3 w-3 rounded-full bg-[color-mix(in_oklab,var(--brand)_35%,var(--surface-2))]" />
      ))}
      {extra > 0 ? <span className="px-1 text-xs font-semibold text-muted">+{extra}</span> : null}
      {withYou ? (
        <span className="ml-0.5 inline-flex h-6 items-center rounded-full bg-[var(--brand)] px-2.5 text-xs font-semibold text-[var(--brand-text)]">Você</span>
      ) : null}
      {!ahead && !withYou ? <span className="text-sm text-muted">Ninguém à espera</span> : null}
    </div>
  );
}

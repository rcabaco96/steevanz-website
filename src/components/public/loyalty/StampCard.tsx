import { formatCardCode, stampSlots } from "@/lib/modules/loyalty/rules";

function StarMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[52%] w-[52%]" fill="currentColor">
      <path d="m12 3.2 2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.6l-5.2 2.8 1-5.9-4.3-4.1 5.9-.8L12 3.2Z" />
    </svg>
  );
}

function GiftMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[48%] w-[48%]" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="9" width="16" height="11" rx="1.5" />
      <path d="M3 9h18M12 9v11M12 9c-1.5-3.5-5-4-5-1.6C7 9 12 9 12 9Zm0 0c1.5-3.5 5-4 5-1.6C17 9 12 9 12 9Z" />
    </svg>
  );
}

/**
 * The loyalty card in the shop's colours: gold stamps, a gift in each circle that gives a reward (the
 * rewards along the way and the last one) and the card code the team can search. The newest stamp is keyed by the count, so it lands again (animation)
 * every time a stamp is added.
 */
export function StampCard({
  name,
  holder,
  stamps,
  required,
  reward,
  rewardAt = [required],
  code,
}: {
  name: string;
  holder: string;
  stamps: number;
  required: number;
  /** The next reward. */
  reward: string;
  /** Circles (1 = first) that give a reward. */
  rewardAt?: number[];
  /** Shown once the card exists (staff can look it up by this code). */
  code?: string;
}) {
  const slots = stampSlots(stamps, required);
  const columns = required <= 10 ? 5 : required <= 12 ? 6 : 7;
  return (
    <section
      aria-label={`Cartão ${name}: ${stamps} de ${required} carimbos`}
      className="relative isolate overflow-hidden rounded-[1.6rem] bg-[var(--brand)] p-6 text-[var(--brand-text)] shadow-[0_24px_48px_-24px_rgba(29,18,32,0.6)]"
    >
      {/* Soft light across the card, like a laminated pass. */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(135deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0)_45%,rgba(0,0,0,0.12)_100%)]" />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm opacity-80">Cartão de cliente</p>
          <p className="display mt-0.5 text-[1.6rem] leading-tight text-balance">{name}</p>
        </div>
        {code ? (
          <p className="shrink-0 rounded-full bg-black/15 px-3 py-1 text-sm font-semibold tracking-[0.08em] tabular-nums" title="Código do cartão">
            {formatCardCode(code)}
          </p>
        ) : null}
      </div>

      <ol aria-hidden="true" className="mt-6 grid gap-2.5" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
        {slots.map((filled, index) => {
          const last = rewardAt.includes(index + 1);
          const newest = filled && index === stamps - 1;
          return (
            <li key={newest ? `stamp-${stamps}` : index} className="aspect-square">
              {filled ? (
                <span
                  className={`grid h-full w-full place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#f2d48c,#c99a45_70%)] text-[#5a3d0c] shadow-[inset_0_-2px_0_rgba(0,0,0,0.18),0_3px_8px_-3px_rgba(0,0,0,0.45)] ${newest ? "stamp-land" : ""}`}
                >
                  <StarMark />
                </span>
              ) : (
                <span
                  className={`grid h-full w-full place-items-center rounded-full border-2 ${last ? "border-[#e2bd6c] text-[#e2bd6c]" : "border-dashed border-current opacity-40"}`}
                >
                  {last ? <GiftMark /> : null}
                </span>
              )}
            </li>
          );
        })}
      </ol>

      <div className="mt-6 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="display text-[1.6rem] leading-none tabular-nums">
            {stamps}
            <span className="text-base opacity-70"> de {required}</span>
          </p>
          <p className="mt-1 text-sm opacity-85">
            {rewardAt.length > 1 ? "Próxima recompensa" : "Recompensa"}: <strong className="font-semibold">{reward}</strong>
          </p>
        </div>
        <p className="shrink-0 truncate text-right text-sm opacity-80">{holder}</p>
      </div>
    </section>
  );
}

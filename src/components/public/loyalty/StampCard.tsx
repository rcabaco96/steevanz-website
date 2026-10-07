import { formatCardCode, stampSlots } from "@/lib/modules/loyalty/rules";

/** The card itself, in the establishment's colours: stamps, reward and the card code. */
export function StampCard({
  name,
  holder,
  stamps,
  required,
  reward,
  code,
}: {
  name: string;
  holder: string;
  stamps: number;
  required: number;
  reward: string;
  /** Shown once the card exists (staff can look it up by this code). */
  code?: string;
}) {
  const slots = stampSlots(stamps, required);
  const columns = required <= 10 ? 5 : required <= 12 ? 6 : 7;
  return (
    <section
      aria-label={`Cartão ${name}: ${stamps} de ${required} carimbos`}
      className="relative overflow-hidden rounded-[1.6rem] bg-[var(--brand)] p-5 text-[var(--brand-text)] shadow-[0_18px_40px_-18px_rgba(29,18,32,0.55)]"
    >
      <span aria-hidden="true" className="pointer-events-none absolute -top-16 -right-16 h-44 w-44 rounded-full bg-white/10" />
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[0.7rem] font-semibold tracking-[0.16em] uppercase opacity-75">Cartão de cliente</p>
          <p className="display mt-1 truncate text-2xl">{name}</p>
        </div>
        {code ? <p className="shrink-0 rounded-full bg-black/15 px-2.5 py-1 font-mono text-xs tracking-[0.12em]">{formatCardCode(code)}</p> : null}
      </div>
      <ol aria-hidden="true" className="relative mt-5 grid gap-2.5" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
        {slots.map((filled, index) => {
          const last = index === slots.length - 1;
          return (
            <li
              key={index}
              className={`grid aspect-square place-items-center rounded-full ${
                filled ? "bg-[#d6ad60] text-[#3d2a08]" : last ? "border-2 border-dashed border-[#d6ad60]/80" : "border-2 border-current/35"
              }`}
            >
              {filled ? (
                <svg viewBox="0 0 24 24" className="h-1/2 w-1/2" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
                  <path d="m5 12.5 4.2 4.2L19 7" />
                </svg>
              ) : last ? (
                <span className="text-[0.65rem] font-bold text-[#d6ad60]">★</span>
              ) : null}
            </li>
          );
        })}
      </ol>
      <div className="relative mt-5 flex items-end justify-between gap-3 text-sm">
        <p className="min-w-0 opacity-90">
          Ao fim de {required} carimbos: <strong className="font-semibold">{reward}</strong>
        </p>
        <p className="shrink-0 text-right text-xs opacity-75">{holder}</p>
      </div>
    </section>
  );
}

/** Text glyphs instead of SVGs: hundreds of these render on a long review list. */
export function Stars({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <span className="relative inline-block leading-none tracking-[0.1em] whitespace-nowrap" style={{ fontSize: size }} aria-hidden="true">
      <span className="text-line-strong">★★★★★</span>
      <span className="absolute inset-y-0 left-0 overflow-hidden text-star" style={{ width: `${(Math.max(0, Math.min(5, rating)) / 5) * 100}%` }}>
        ★★★★★
      </span>
    </span>
  );
}

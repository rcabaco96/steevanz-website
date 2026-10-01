/** The Steevanz flower mark: five cream petals, aubergine drops, gold heart. */
export function FlowerMark({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <rect width="40" height="40" rx="9" fill="#562650" />
      <g transform="translate(20 20)">
        {[0, 72, 144, 216, 288].map((r) => (
          <g key={r} transform={`rotate(${r})`}>
            <ellipse cx="0" cy="-7.4" rx="6" ry="7.6" fill="#f3ebde" />
            <path d="M0 -10.5 Q1.6 -6 0 -3.4 Q-1.6 -6 0 -10.5Z" fill="#562650" />
          </g>
        ))}
        <circle r="2" fill="#d9a238" />
      </g>
    </svg>
  );
}

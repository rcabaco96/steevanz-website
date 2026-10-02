/** The Steevanz flower as a single fine hand-drawn line (decorative). */
export function HandFlower({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="-60 -60 120 120"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="0.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {[0, 72, 144, 216, 288].map((r) => (
        <g key={r} transform={`rotate(${r})`}>
          <path d="M0 -6C10 -12 23 -28 18 -40C14 -50 -14 -51 -19 -41C-24 -29 -9 -13 0 -6" />
          <path d="M0 -10C3 -16 3 -22 0 -28C-3 -22 -3 -16 0 -10" />
        </g>
      ))}
      <circle r="4.5" />
    </svg>
  );
}

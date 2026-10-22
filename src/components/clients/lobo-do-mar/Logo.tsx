import { useId } from "react";

// The restaurant's own logo, redrawn as a vector from its Instagram picture and its table plaques (owner,
// 2026-10-22): «LOBO DO MAR» round the top in heavy slab letters, a twisted rope ring, crossed knife and fork, the
// captain's cap, a ship's wheel, a lifebuoy, a scallop shell, an anchor each side and «RESTAURANTE» round the bottom.
// Its colours: navy (`ink`: the letters, the cutlery, the inner ring) and coral (`accent`: the rope and the emblems).

const cx = 200;
const cy = 214;
const rope = Array.from({ length: 52 }, (_, i) => {
  const a = (i / 52) * Math.PI * 2;
  const x = cx + 113 * Math.cos(a);
  const y = cy + 113 * Math.sin(a);
  return { x: x.toFixed(1), y: y.toFixed(1), r: ((a * 180) / Math.PI + 128).toFixed(1) };
});
const spokes = Array.from({ length: 8 }, (_, i) => {
  const a = (i * Math.PI) / 4;
  return `M${(143 + Math.cos(a) * 4).toFixed(1)} ${(214 + Math.sin(a) * 4).toFixed(1)}L${(143 + Math.cos(a) * 23).toFixed(1)} ${(214 + Math.sin(a) * 23).toFixed(1)}`;
}).join("");

export function Badge({
  className = "",
  ink = "var(--color-marinho)",
  accent = "var(--color-coral)",
  label,
}: {
  className?: string;
  ink?: string;
  accent?: string;
  label?: string;
}) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 400 400" className={className} role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      <defs>
        <path id={`${id}-t`} d="M 52 214 A 148 148 0 0 1 348 214" />
        <path id={`${id}-b`} d="M 67 214 A 133 133 0 0 0 333 214" />
        <mask id={`${id}-shell`}>
          <rect x="-40" y="-40" width="80" height="80" fill="#fff" />
          <path d="M0 -12V11M-8 -11L-11 11M8 -11L11 11M-15 -6L-19 9M15 -6L19 9" stroke="#000" strokeWidth="1.8" strokeLinecap="round" />
        </mask>
      </defs>
      <g fill={ink} style={{ fontFamily: "var(--font-display)" }}>
        <text style={{ fontSize: 46, letterSpacing: 2 }}>
          <textPath href={`#${id}-t`} startOffset="50%" textAnchor="middle">
            LOBO DO MAR
          </textPath>
        </text>
        <text style={{ fontSize: 25, letterSpacing: 9 }}>
          <textPath href={`#${id}-b`} startOffset="50%" textAnchor="middle" dominantBaseline="hanging">
            RESTAURANTE
          </textPath>
        </text>
      </g>
      <g fill={accent}>
        {rope.map((s, i) => (
          <ellipse key={i} cx={s.x} cy={s.y} rx="4.6" ry="11.5" transform={`rotate(${s.r} ${s.x} ${s.y})`} />
        ))}
      </g>
      <circle cx={cx} cy={cy} r="98" fill="none" stroke={ink} strokeWidth="6" />
      <g fill="none" stroke={accent} strokeWidth="5" strokeLinecap="round">
        {[46, 354].map((x) => (
          <g key={x}>
            <circle cx={x} cy="186" r="5" />
            <path d={`M${x} 191v34M${x - 9} 200h18M${x - 14} 216c2 9 8 13 14 13s12-4 14-13`} />
          </g>
        ))}
      </g>
      <g fill={ink} transform={`translate(${cx} ${cy}) rotate(-45) scale(1.06)`}>
        <path d="M-6.5 -82C8 -80 12 -58 12 -34V-2H-6.5Z" />
        <rect x="-5" y="2" width="10" height="82" rx="5" />
      </g>
      <g fill={ink} transform={`translate(${cx} ${cy}) rotate(45) scale(1.06)`}>
        <rect x="-10" y="-84" width="3.6" height="28" rx="1.8" />
        <rect x="-3.6" y="-86" width="3.6" height="30" rx="1.8" />
        <rect x="2.8" y="-86" width="3.6" height="30" rx="1.8" />
        <rect x="9" y="-84" width="3.6" height="28" rx="1.8" />
        <path d="M-10 -58H12.6C12.6 -46 6 -40 4 -36V-30H-2V-36C-4 -40 -10 -46 -10 -58Z" />
        <rect x="-4.5" y="-32" width="9" height="116" rx="4.5" />
      </g>
      <g fill={accent} transform="translate(200 158) scale(1.3)">
        <path d="M-22 -2C-20 -14 -6 -19 8 -18C20 -17 26 -12 24 -6C22 -2 16 0 8 1L-16 4C-21 4 -23 1 -22 -2Z" />
        <path d="M-17 6L19 2C20 7 14 11 4 12L-10 13C-15 13 -18 10 -17 6Z" />
      </g>
      <g fill="none" stroke={accent} strokeLinecap="round">
        <circle cx="143" cy="214" r="15" strokeWidth="6" />
        <path d={spokes} strokeWidth="3.4" />
      </g>
      <circle cx="143" cy="214" r="4.5" fill={accent} />
      <circle cx="257" cy="214" r="16" fill="none" stroke={accent} strokeWidth="12" />
      <circle cx="257" cy="214" r="16" fill="none" stroke="#fff" strokeWidth="12" strokeDasharray="6.3 18.8" strokeDashoffset="3" opacity="0.92" />
      <g fill={accent} transform="translate(200 272) scale(1.3)">
        <g mask={`url(#${id}-shell)`}>
          <path d="M0 -16C-14 -16 -22 -7 -22 2C-22 7 -19 11 -15 12H15C19 11 22 7 22 2C22 -7 14 -16 0 -16Z" />
        </g>
        <path d="M-6 12H6L4 17H-4Z" />
      </g>
    </svg>
  );
}

/** The name as a wordmark, for the header. */
export function Wordmark({ className = "" }: { className?: string }) {
  return <span className={`font-display leading-none tracking-[0.04em] uppercase ${className}`}>Lobo do Mar</span>;
}

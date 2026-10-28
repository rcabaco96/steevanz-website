import type { FerragialWine } from "@/content/ferragial/facts";
import { talhaHorizon, talhaPath, talhaRim, talhaSun } from "./Logo";

// A bottle of the house, drawn (not photographed: the wines are fictional, so are their labels). A Bordeaux bottle in
// dark glass for the reds, clear glass showing the wine for the white and the rosé; a lime-wash label with the talha
// mark, the name, the kind and the vintage, and a band in the wine's own colour. The tasting box shows three bottles.
const darkGlass = "#1f2420";

function Single({ wine, x = 0, scale = 1, idSuffix = "" }: { wine: FerragialWine; x?: number; scale?: number; idSuffix?: string }) {
  const clear = wine.id === "branco" || wine.id === "rose";
  const body = clear ? wine.glass : darkGlass;
  const gid = `fg-glass-${wine.id}${idSuffix}`;
  return (
    <g transform={`translate(${x + 30 * (1 - scale)} ${200 * (1 - scale)}) scale(${scale})`}>
      <defs>
        <linearGradient id={gid} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0.35" />
          <stop offset="0.28" stopColor="#fff" stopOpacity="0.22" />
          <stop offset="0.4" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      {/* Glass */}
      <path d="M24 8h12v44c0 10 18 16 18 34v106a6 6 0 0 1-6 6H12a6 6 0 0 1-6-6V86c0-18 18-24 18-34V8Z" fill={body} />
      <path d="M24 8h12v44c0 10 18 16 18 34v106a6 6 0 0 1-6 6H12a6 6 0 0 1-6-6V86c0-18 18-24 18-34V8Z" fill={`url(#${gid})`} />
      {/* Capsule */}
      <rect x="22.5" y="2" width="15" height="40" rx="2" fill={wine.band} />
      <rect x="22.5" y="36" width="15" height="2" fill="#000" opacity="0.2" />
      {/* Label */}
      <rect x="9" y="104" width="42" height="68" rx="1.5" fill="#f3eee4" />
      <rect x="9" y="160" width="42" height="12" fill={wine.band} />
      <g transform="translate(23.5 108) scale(0.2)">
        <rect {...talhaRim} fill="#241c1b" />
        <path d={talhaPath} fill="none" stroke="#241c1b" strokeWidth="3" />
        <path d={talhaSun} fill="#b4532a" />
        <path d={talhaHorizon} stroke="#241c1b" strokeWidth="2" />
      </g>
      <text x="30" y="137" textAnchor="middle" fontFamily="var(--font-display)" fontSize="8.2" fill="#241c1b">
        Ferragial
      </text>
      <text x="30" y="146" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="3.6" letterSpacing="0.6" fill="#6b5f58">
        {wine.talha ? "TALHA" : wine.id === "reserva" ? "RESERVA" : "ALENTEJO"}
      </text>
      <text x="30" y="168.5" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="4.6" letterSpacing="0.8" fill="#f3eee4">
        {wine.box ? "SELEÇÃO" : wine.vintage}
      </text>
    </g>
  );
}

export function Bottle({ wine, className = "" }: { wine: FerragialWine; className?: string }) {
  if (wine.box) {
    // Branco, Tinto and Talha Tinto: the box's three wines.
    return (
      <svg viewBox="-34 0 128 200" className={`block overflow-visible ${className}`} aria-hidden="true" focusable="false">
        <Single wine={{ ...wine, id: "branco", glass: "#e7cf7c", band: "#c9a74a", vintage: "2025" }} x={-30} scale={0.9} idSuffix="-box" />
        <Single wine={{ ...wine, id: "talha-tinto", band: "#b4532a", vintage: "2024", talha: true }} x={30} scale={0.9} idSuffix="-box" />
        <Single wine={{ ...wine, id: "tinto", band: "#7a1c30", vintage: "2023" }} x={0} idSuffix="-box" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 60 200" className={`block overflow-visible ${className}`} aria-hidden="true" focusable="false">
      <Single wine={wine} />
    </svg>
  );
}

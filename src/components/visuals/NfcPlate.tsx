import { useId } from "react";

export type PlateVariant = "stand" | "square" | "sticker" | "wall";
export type PlateFinish = "black" | "white";
export type PlateSymbol = "stars" | "social" | "stamps";

interface NfcPlateProps {
  variant?: PlateVariant;
  finish?: PlateFinish;
  line1: string;
  line2: string;
  className?: string;
  title?: string;
  symbol?: PlateSymbol;
}

const finishes = {
  black: { face: "#141014", faceTo: "#2a2230", edge: "#3b3140", text: "#f6efe6", subtle: "#b9a9bf", accent: "#e9c685", qr: "#f6efe6" },
  white: { face: "#fdfbf7", faceTo: "#ece4d8", edge: "#d6cbbb", text: "#1d1220", subtle: "#6f5d71", accent: "#b07f2a", qr: "#1d1220" },
};

const qrCells = [
  "1111111010111",
  "1000001001001",
  "1011101011101",
  "1011101000101",
  "1011101011001",
  "1000001010111",
  "1111111010101",
  "0000000011000",
  "1101011100111",
  "0110100101010",
  "1011011110101",
  "0100110001011",
  "1110101011101",
];

function QrMark({ x, y, size, color }: { x: number; y: number; size: number; color: string }) {
  const cell = size / qrCells.length;
  return (
    <g>
      {qrCells.flatMap((row, rowIndex) =>
        row.split("").map((value, columnIndex) =>
          value === "1" ? (
            <rect
              key={`${rowIndex}-${columnIndex}`}
              x={x + columnIndex * cell}
              y={y + rowIndex * cell}
              width={cell + 0.2}
              height={cell + 0.2}
              fill={color}
            />
          ) : null,
        ),
      )}
    </g>
  );
}

function Stars({ cx, y, size, color }: { cx: number; y: number; size: number; color: string }) {
  const gap = size * 0.18;
  const total = size * 5 + gap * 4;
  const start = cx - total / 2;
  return (
    <g fill={color}>
      {[0, 1, 2, 3, 4].map((index) => (
        <path
          key={index}
          transform={`translate(${start + index * (size + gap)} ${y}) scale(${size / 24})`}
          d="m12 2.8 2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2 6.4 20.2l1.1-6.3L2.9 9.5l6.3-.9L12 2.8Z"
        />
      ))}
    </g>
  );
}

function SocialDots({ cx, y, size, color }: { cx: number; y: number; size: number; color: string }) {
  const gap = size * 0.5;
  const total = size * 3 + gap * 2;
  const start = cx - total / 2;
  return (
    <g fill="none" stroke={color} strokeWidth={1.8}>
      <rect x={start} y={y} width={size} height={size} rx={size * 0.3} />
      <circle cx={start + size / 2} cy={y + size / 2} r={size * 0.22} />
      <circle cx={start + size + gap + size / 2} cy={y + size / 2} r={size / 2} />
      <path d={`M${start + size + gap + size / 2 + 2} ${y + size * 0.2}h-2a2.5 2.5 0 0 0-2.5 2.5V${y + size}`} />
      <path d={`M${start + 2 * (size + gap) + size * 0.2} ${y + size * 0.15}v${size * 0.55}a${size * 0.22} ${size * 0.22} 0 1 1-${size * 0.22}-${size * 0.22}M${start + 2 * (size + gap) + size * 0.2} ${y + size * 0.15}c0 ${size * 0.25} ${size * 0.2} ${size * 0.4} ${size * 0.5} ${size * 0.4}`} />
    </g>
  );
}

function StampRow({ cx, y, size, color }: { cx: number; y: number; size: number; color: string }) {
  const gap = size * 0.25;
  const total = size * 5 + gap * 4;
  const start = cx - total / 2;
  return (
    <g>
      {[0, 1, 2, 3, 4].map((index) => (
        <circle
          key={index}
          cx={start + index * (size + gap) + size / 2}
          cy={y + size / 2}
          r={size / 2 - 1}
          fill={index < 3 ? color : "none"}
          stroke={color}
          strokeWidth={1.6}
        />
      ))}
    </g>
  );
}

function SymbolRow({ symbol, cx, y, size, color }: { symbol: PlateSymbol; cx: number; y: number; size: number; color: string }) {
  if (symbol === "social") return <SocialDots cx={cx} y={y} size={size} color={color} />;
  if (symbol === "stamps") return <StampRow cx={cx} y={y} size={size * 0.9} color={color} />;
  return <Stars cx={cx} y={y} size={size} color={color} />;
}

function NfcSymbol({ cx, cy, scale, color }: { cx: number; cy: number; scale: number; color: string }) {
  return (
    <g transform={`translate(${cx - 12 * scale} ${cy - 12 * scale}) scale(${scale})`} fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round">
      <path d="M8.5 8.5a5 5 0 0 1 0 7M12 6a8.5 8.5 0 0 1 0 12M15.5 3.5a12 12 0 0 1 0 17" />
      <circle cx="5" cy="12" r="1.3" fill={color} stroke="none" />
    </g>
  );
}

export function NfcPlate({ variant = "stand", finish = "black", line1, line2, className = "", title, symbol = "stars" }: NfcPlateProps) {
  const gradientId = useId();
  const shineId = useId();
  const colors = finishes[finish];
  const decorative = !title;

  if (variant === "sticker") {
    return (
      <svg viewBox="0 0 200 200" className={className} role={decorative ? undefined : "img"} aria-hidden={decorative ? true : undefined} aria-label={title}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={colors.faceTo} />
            <stop offset="1" stopColor={colors.face} />
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r="92" fill={`url(#${gradientId})`} stroke={colors.edge} strokeWidth="3" />
        <NfcSymbol cx={100} cy={62} scale={1.6} color={colors.accent} />
        <SymbolRow symbol={symbol} cx={100} y={92} size={18} color={colors.accent} />
        <text x="100" y="138" textAnchor="middle" fontFamily="var(--font-display)" fontSize="19" fill={colors.text}>
          {line1}
        </text>
        <text x="100" y="158" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="11" fill={colors.subtle}>
          {line2}
        </text>
      </svg>
    );
  }

  const isStand = variant === "stand";
  const width = 220;
  const height = isStand ? 300 : variant === "wall" ? 280 : 220;
  const faceHeight = isStand ? 260 : height - 8;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative ? true : undefined}
      aria-label={title}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor={colors.faceTo} />
          <stop offset="1" stopColor={colors.face} />
        </linearGradient>
        <linearGradient id={shineId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.28" />
          <stop offset="0.45" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>
      {isStand ? (
        <>
          <ellipse cx="110" cy="292" rx="96" ry="7" fill="#000" opacity="0.18" />
          <path d="M22 262h176l10 24H12l10-24Z" fill={colors.edge} />
          <path d="M12 286h196v4H12z" fill={colors.faceTo} opacity="0.7" />
        </>
      ) : null}
      <rect x="10" y="4" width="200" height={faceHeight} rx="18" fill={colors.edge} />
      <rect x="14" y="8" width="192" height={faceHeight - 8} rx="15" fill={`url(#${gradientId})`} />
      <rect x="14" y="8" width="192" height={faceHeight - 8} rx="15" fill={`url(#${shineId})`} />
      <NfcSymbol cx={110} cy={isStand ? 50 : 42} scale={1.7} color={colors.accent} />
      <SymbolRow symbol={symbol} cx={110} y={isStand ? 80 : 68} size={20} color={colors.accent} />
      <text x="110" y={isStand ? 134 : 118} textAnchor="middle" fontFamily="var(--font-display)" fontSize="24" fill={colors.text}>
        {line1}
      </text>
      <text x="110" y={isStand ? 156 : 138} textAnchor="middle" fontFamily="var(--font-sans)" fontSize="12.5" fill={colors.subtle}>
        {line2}
      </text>
      {variant !== "square" ? (
        <>
          <rect x="76" y={isStand ? 176 : 170} width="68" height="68" rx="8" fill="#ffffff" />
          <QrMark x={82} y={isStand ? 182 : 176} size={56} color="#1d1220" />
        </>
      ) : (
        <>
          <rect x="84" y="156" width="52" height="52" rx="7" fill="#ffffff" />
          <QrMark x={89} y={161} size={42} color="#1d1220" />
        </>
      )}
    </svg>
  );
}

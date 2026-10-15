// Text running round a circle, turning slowly (after React Bits' CircularText, MIT + Commons Clause,
// © David Haz): an SVG text path and a CSS rotation, so it costs no JavaScript at all.

import styles from "./dolci.module.css";

interface CircleTextProps {
  text: string;
  id: string;
  className?: string;
  slow?: boolean;
}

export function CircleText({ text, id, className = "", slow = false }: CircleTextProps) {
  // r = 44 in a 100 × 100 box; the text is spread to fill the whole circle exactly.
  const circumference = 2 * Math.PI * 44;
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className={`${slow ? styles.spinSlow : styles.spin} ${className}`}>
      <defs>
        <path id={id} d="M50,50 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
      </defs>
      <text fontSize="6.2" fontWeight="600" letterSpacing="0.9" fill="currentColor" style={{ textTransform: "uppercase" }}>
        <textPath href={`#${id}`} textLength={circumference - 2} lengthAdjust="spacing">
          {text}
        </textPath>
      </text>
    </svg>
  );
}

import type { SVGProps } from "react";

// As linhas de um campo de futsal (40 × 20 m): o retângulo, a linha do meio, o círculo central, as duas áreas de
// 6 m e as marcas de penálti. O motivo do site: desenhado na abertura, por trás do emblema e nas transições.
// `vertical`: o campo de pé, para o telemóvel. Cada linha tem `data-line` (a abertura desenha-as uma a uma).
export function CourtLines({ vertical = false, ...props }: SVGProps<SVGSVGElement> & { vertical?: boolean }) {
  const lines = (
    <g fill="none" stroke="currentColor" strokeWidth={0.12} strokeLinecap="round" vectorEffect="non-scaling-stroke">
      <rect data-line x={0.5} y={0.5} width={40} height={20} pathLength={1} vectorEffect="non-scaling-stroke" />
      <path data-line d="M20.5 0.5V20.5" pathLength={1} vectorEffect="non-scaling-stroke" />
      <circle data-line cx={20.5} cy={10.5} r={3} pathLength={1} vectorEffect="non-scaling-stroke" />
      <path data-line d="M0.5 4.5a6 6 0 0 1 6 6a6 6 0 0 1 -6 6" pathLength={1} vectorEffect="non-scaling-stroke" />
      <path data-line d="M40.5 4.5a6 6 0 0 0 -6 6a6 6 0 0 0 6 6" pathLength={1} vectorEffect="non-scaling-stroke" />
      <circle cx={20.5} cy={10.5} r={0.18} fill="currentColor" stroke="none" />
      <circle cx={6.5} cy={10.5} r={0.18} fill="currentColor" stroke="none" />
      <circle cx={34.5} cy={10.5} r={0.18} fill="currentColor" stroke="none" />
    </g>
  );
  return (
    <svg viewBox={vertical ? "0 0 21 41" : "0 0 41 21"} aria-hidden="true" {...props}>
      {vertical ? <g transform="translate(21 0) rotate(90)">{lines}</g> : lines}
    </svg>
  );
}

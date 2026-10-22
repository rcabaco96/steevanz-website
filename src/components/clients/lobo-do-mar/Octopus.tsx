// The octopus drawn on the restaurant's walls, as a line drawing: a round head with two eyes and eight tentacles
// curling into spirals. Every stroke is a separate path (data-draw) so the page can draw it as it scrolls by.

function tentacle(baseX: number, baseY: number, angle: number, length: number, curl: number): string {
  // A tentacle: out from the head along `angle`, bending, then rolling into a spiral at its tip.
  const pts: string[] = [];
  let x = baseX;
  let y = baseY;
  let a = angle;
  const steps = 26;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const step = (length / steps) * (1 - t * 0.55);
    a += curl * (0.02 + t * t * 0.42);
    x += Math.cos(a) * step;
    y += Math.sin(a) * step;
    pts.push(`${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return `M${baseX} ${baseY}L${pts.join("L")}`;
}

const head = "M300 250C300 170 250 110 200 110S100 170 100 250c0 40 20 66 46 80h108c26-14 46-40 46-80Z";
const arms = [
  tentacle(150, 330, 2.2, 260, 1),
  tentacle(165, 334, 1.9, 300, -1),
  tentacle(185, 336, 1.65, 330, 1),
  tentacle(200, 336, 1.5, 340, -1),
  tentacle(215, 336, 1.35, 330, 1),
  tentacle(235, 334, 1.2, 300, -1),
  tentacle(250, 330, 0.95, 260, 1),
  tentacle(140, 320, 2.6, 220, -1),
];
const details = [
  "M160 230c8-10 22-10 30 0",
  "M210 230c8-10 22-10 30 0",
  "M175 236a6 6 0 1 0 0.1 0Z",
  "M225 236a6 6 0 1 0 0.1 0Z",
  "M130 190c10-30 30-50 60-60",
  "M150 280c20 10 80 10 100 0",
];

export function Octopus({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="-60 60 520 480" className={className} fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path data-draw d={head} />
      {details.map((d) => (
        <path key={d} data-draw d={d} />
      ))}
      {arms.map((d, i) => (
        <path key={i} data-draw d={d} />
      ))}
      {arms.map((d, i) => (
        <path key={`s${i}`} data-draw d={d} transform="translate(5 4)" strokeWidth="1.2" opacity="0.55" />
      ))}
    </svg>
  );
}

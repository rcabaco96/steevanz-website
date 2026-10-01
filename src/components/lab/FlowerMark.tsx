/**
 * The Steevanz mark, drawn after the real logo: five cream obovate petals, the
 * aubergine drops forming a star, fine gold filaments and a gold heart, on the
 * plum tile. One source of truth (string), used by React and by the theme veil.
 * Parts carry classes (fm-petal, fm-drop, fm-gold, fm-heart) for animation.
 */
const PETAL = "M0 -1.8 C 4.6 -3.6 9.4 -10.6 6.8 -15.2 C 4.8 -18.6 -4.8 -18.6 -6.8 -15.2 C -9.4 -10.6 -4.6 -3.6 0 -1.8 Z";
const DROP = "M0 -2.6 C 1.9 -4.6 2.2 -7.6 0 -10.4 C -2.2 -7.6 -1.9 -4.6 0 -2.6 Z";

function filaments() {
  let out = "";
  for (let k = 0; k < 30; k++) {
    const a = (k / 30) * Math.PI * 2;
    const r1 = 1.4;
    const r2 = 3.6 + (k % 3) * 0.5;
    const x1 = (Math.cos(a) * r1).toFixed(2);
    const y1 = (Math.sin(a) * r1).toFixed(2);
    const x2 = (Math.cos(a) * r2).toFixed(2);
    const y2 = (Math.sin(a) * r2).toFixed(2);
    out += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/><circle cx="${x2}" cy="${y2}" r="0.45"/>`;
  }
  return out;
}

export function flowerMarkSvg(size = 30, tile = true) {
  const angles = [0, 72, 144, 216, 288];
  const petals = angles.map((r) => `<g transform="rotate(${r})"><path class="fm-petal" d="${PETAL}" fill="#f1e7da" stroke="#4a1d45" stroke-width="0.35"/></g>`).join("");
  const drops = angles.map((r) => `<g transform="rotate(${r})"><path class="fm-drop" d="${DROP}" fill="#3d0d38"/></g>`).join("");
  return `<svg class="fm" width="${size}" height="${size}" viewBox="0 0 40 40" aria-hidden="true">${
    tile ? '<rect class="fm-tile" width="40" height="40" rx="9" fill="#562650"/>' : ""
  }<g transform="translate(20 20.6) scale(0.98)">${petals}${drops}<g class="fm-gold" stroke="#e0aa3e" stroke-width="0.3" fill="#f0c25a">${filaments()}</g><circle class="fm-heart" r="1.5" fill="#f3cf6e"/></g></svg>`;
}

export function FlowerMark({ size = 30, tile = true }: { size?: number; tile?: boolean }) {
  return <span className="fm-wrap" style={{ display: "inline-grid", lineHeight: 0 }} dangerouslySetInnerHTML={{ __html: flowerMarkSvg(size, tile) }} />;
}

// Ilustração das duas placas de mesa (em pé, acrílico creme granitado; e plana, cor sólida com relevo creme),
// como as placas reais da Steevanz, em SVG sem filtros, máscaras nem transparências (o PDF fica limpo no iPhone).
// Uso: const { placasSvg } = require("./placa"); placasSvg({ logoDataUri, qrUrl, cores, fundo })
const QRCode = require("qrcode");
const fs = require("fs");
const { PNG } = require("pngjs");

// Logótipo do cliente sem canal alfa: compõe o PNG sobre a cor de fundo (evita /SMask no PDF).
function logoOpaco(ficheiro, fundoHex) {
  const p = PNG.sync.read(fs.readFileSync(ficheiro));
  const bg = [1, 3, 5].map((i) => parseInt(fundoHex.slice(i, i + 2), 16));
  const out = new PNG({ width: p.width, height: p.height, colorType: 2, inputHasAlpha: false });
  const rgb = Buffer.alloc(p.width * p.height * 3);
  for (let i = 0, j = 0; i < p.data.length; i += 4, j += 3) {
    const a = p.data[i + 3] / 255;
    for (let k = 0; k < 3; k++) rgb[j + k] = Math.round(p.data[i + k] * a + bg[k] * (1 - a));
  }
  out.data = rgb;
  return "data:image/png;base64," + PNG.sync.write(out, { colorType: 2, inputColorType: 2, inputHasAlpha: false }).toString("base64");
}

// Pontos do granitado: gerador pseudoaleatório com semente fixa (sempre o mesmo desenho).
function pontos(n, x, y, w, h, seed, cores) {
  let s = seed;
  const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  let out = "";
  for (let i = 0; i < n; i++) {
    const c = cores[Math.floor(r() * cores.length)];
    out += `<circle cx="${(x + r() * w).toFixed(1)}" cy="${(y + r() * h).toFixed(1)}" r="${(0.35 + r() * 0.9).toFixed(2)}" fill="${c}"/>`;
  }
  return out;
}

// Ícone «toque»: oval com as ondas de aproximação e mão a segurar o telemóvel (traço numa só cor).
function iconeToque(cx, cy, escala, cor, fundo) {
  const t = (v) => (v * escala).toFixed(1);
  return `<g transform="translate(${cx} ${cy})" fill="none" stroke="${cor}" stroke-width="${t(2.6)}" stroke-linecap="round" stroke-linejoin="round">
    <ellipse cx="${t(-14)}" cy="${t(2)}" rx="${t(24)}" ry="${t(17)}"/>
    <path d="M${t(-24)} ${t(-3)} a${t(5)} ${t(5)} 0 0 1 0 ${t(10)}"/>
    <path d="M${t(-19)} ${t(-7)} a${t(10)} ${t(10)} 0 0 1 0 ${t(18)}"/>
    <path d="M${t(-14)} ${t(-11)} a${t(15)} ${t(15)} 0 0 1 0 ${t(26)}"/>
    <rect x="${t(6)}" y="${t(-22)}" width="${t(17)}" height="${t(30)}" rx="${t(3)}" fill="${fundo}"/>
    <path d="M${t(11.5)} ${t(-18)} h${t(6)}"/>
    <path d="M${t(9)} ${t(-6)} q${t(-5)} ${t(0)} ${t(-5)} ${t(5)} v${t(9)} q0 ${t(9)} ${t(9)} ${t(9)} h${t(9)} q${t(8)} 0 ${t(8)} ${t(-8)} v${t(-10)}" fill="${fundo}"/>
    <path d="M${t(23)} ${t(-12)} h${t(3)} q${t(2)} 0 ${t(2)} ${t(2.5)} t${t(-2)} ${t(2.5)} h${t(-3)} M${t(23)} ${t(-7)} h${t(3)} q${t(2)} 0 ${t(2)} ${t(2.5)} t${t(-2)} ${t(2.5)} h${t(-3)} M${t(23)} ${t(-2)} h${t(3)} q${t(2)} 0 ${t(2)} ${t(2.5)} t${t(-2)} ${t(2.5)} h${t(-3)}" fill="${fundo}"/>
  </g>`;
}

async function qrPath(url) {
  const qr = QRCode.create(url, { errorCorrectionLevel: "M" });
  const n = qr.modules.size;
  let d = "";
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (qr.modules.get(x, y)) d += `M${x} ${y}h1v1h-1z`;
  return { d, n };
}

async function placasSvg({ logoDataUri, qrUrl, rosa, rosaEscuro, relSombra = "#c84f86", verde, creme, granito }) {
  const { d: qd, n: qn } = await qrPath(qrUrl);
  // Placa em pé (esquerda) — 0..250 × 0..420
  const W = 560, H = 440;
  const up = { x: 30, y: 10, w: 200, h: 340 };
  const qrS = 70, qrUnit = qrS / (qn + 2);
  const upright = `
    <g>
      <rect x="10" y="372" width="240" height="40" rx="8" fill="${granito}"/>
      <rect x="10" y="404" width="240" height="8" rx="4" fill="#d9d0c2"/>
      <rect x="44" y="350" width="172" height="26" rx="5" fill="#e3dbcd"/>
      <path d="M${up.x} ${up.y + 22} q0 -22 22 -22 h${up.w - 44} q22 0 22 22 v${up.h + 6} h-${up.w} z" fill="${creme}" stroke="#d8cfbf" stroke-width="1.5"/>
      ${pontos(900, up.x + 4, up.y + 4, up.w - 8, up.h - 2, 7, ["#b9ae9c", "#8f8576", "#cfc5b4", "#6f675c"])}
      <text x="${up.x + up.w / 2}" y="${up.y + 62}" text-anchor="middle" font-family="Hanken Grotesk, Segoe UI, sans-serif" font-weight="600" font-size="46" letter-spacing="-1" fill="${rosaEscuro}">Menu</text>
      <circle cx="${up.x + up.w / 2}" cy="${up.y + 148}" r="56" fill="${creme}"/>
      <image href="${logoDataUri}" x="${up.x + up.w / 2 - 54}" y="${up.y + 94}" width="108" height="108" clip-path="url(#cl1)"/>
      ${iconeToque(up.x + 62, up.y + 290, 1.0, rosaEscuro, creme)}
      <rect x="${up.x + 112}" y="${up.y + 255}" width="${qrS}" height="${qrS}" rx="4" fill="${creme}"/>
      <g transform="translate(${up.x + 112 + qrUnit} ${up.y + 255 + qrUnit}) scale(${qrUnit})"><path d="${qd}" fill="${rosaEscuro}"/></g>
    </g>`;
  // Placa plana (direita): cor sólida com relevo creme
  const fl = { x: 290, y: 70, w: 250, h: 330 };
  const rel = "#fbf3e6";
  const qrS2 = 80, qrUnit2 = qrS2 / (qn + 2);
  const flat = `
    <g>
      <rect x="${fl.x + 4}" y="${fl.y + 7}" width="${fl.w}" height="${fl.h}" rx="18" fill="${relSombra}"/>
      <rect x="${fl.x}" y="${fl.y}" width="${fl.w}" height="${fl.h}" rx="18" fill="${rosa}"/>
      <text x="${fl.x + fl.w / 2 + 1.5}" y="${fl.y + 58 + 2}" text-anchor="middle" font-family="Hanken Grotesk, Segoe UI, sans-serif" font-weight="700" font-size="40" letter-spacing="-1" fill="${relSombra}">Menu</text>
      <text x="${fl.x + fl.w / 2}" y="${fl.y + 58}" text-anchor="middle" font-family="Hanken Grotesk, Segoe UI, sans-serif" font-weight="700" font-size="40" letter-spacing="-1" fill="${rel}">Menu</text>
      <circle cx="${fl.x + fl.w / 2 + 2}" cy="${fl.y + 130}" r="54" fill="${relSombra}"/>
      <circle cx="${fl.x + fl.w / 2}" cy="${fl.y + 128}" r="54" fill="${creme}"/>
      <image href="${logoDataUri}" x="${fl.x + fl.w / 2 - 50}" y="${fl.y + 78}" width="100" height="100" clip-path="url(#cl2)"/>
      ${iconeToque(fl.x + 80, fl.y + 266, 1.1, relSombra, rosa).replace(/translate\(([\d.]+) ([\d.]+)\)/, (m, a, b) => `translate(${+a + 1.5} ${+b + 2})`)}
      ${iconeToque(fl.x + 78, fl.y + 264, 1.1, rel, rosa)}
      <rect x="${fl.x + 142}" y="${fl.y + 226}" width="${qrS2}" height="${qrS2}" rx="6" fill="${relSombra}"/>
      <rect x="${fl.x + 140}" y="${fl.y + 224}" width="${qrS2}" height="${qrS2}" rx="6" fill="${rel}"/>
      <g transform="translate(${fl.x + 140 + qrUnit2} ${fl.y + 224 + qrUnit2}) scale(${qrUnit2})"><path d="${qd}" fill="${rosaEscuro}"/></g>
    </g>`;
  const defs = `<defs><clipPath id="cl1"><circle cx="${up.x + up.w / 2}" cy="${up.y + 148}" r="53"/></clipPath><clipPath id="cl2"><circle cx="${fl.x + fl.w / 2}" cy="${fl.y + 128}" r="49"/></clipPath></defs>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Placas de mesa: abrem o menu com um toque ou com o QR code">${defs}${upright}${flat}</svg>`;
}

module.exports = { placasSvg, logoOpaco };

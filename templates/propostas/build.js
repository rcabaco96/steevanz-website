// Gera proposta.html e orcamento.html (autónomos, com imagens embutidas) a partir do ficheiro de dados.
// Uso: node build.js [proposta.json] [--saida pasta]
const fs = require("fs");
const path = require("path");
const QRCode = require("qrcode");
const carregar = require("./dados");
const { placasSvg, logoOpaco } = require("./placa");

const ASSETS = path.join(__dirname, "assets");
const MENU_DEMO_URL = "https://www.steevanz.com/raza17raza";

const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

async function qrSvg(url) {
  return QRCode.toString(url, { type: "svg", margin: 0, errorCorrectionLevel: "M", color: { dark: "#1d1220", light: "#ffffff" } });
}

async function svgPlacas(dados) {
  const p = dados.placa;
  return placasSvg({ logoDataUri: logoOpaco(path.join(__dirname, p.logo), p.creme), qrUrl: p.menuUrl, rosa: p.cor, rosaEscuro: p.corImpressao, relSombra: p.corRelevoSombra, verde: p.corSecundaria, creme: p.creme, granito: p.base });
}

async function render(template, v, dados) {
  const qr = { "qr-aceitacao": await qrSvg(v.aceitacaoUrl), "qr-menu": await qrSvg(MENU_DEMO_URL), placas: await svgPlacas(dados) };
  let html = fs.readFileSync(path.join(__dirname, template), "utf8");
  html = html.replace(/\{\{\{(\w+)\}\}\}/g, (m, k) => {
    if (!(k in v)) throw new Error(`Falta o valor «${k}» (${template})`);
    return v[k];
  });
  html = html.replace(/\{\{(\w+)\}\}/g, (m, k) => {
    if (!(k in v)) throw new Error(`Falta o valor «${k}» (${template})`);
    return esc(v[k]);
  });
  html = html.replace(/@@([\w-]+)@@/g, (m, name) => {
    if (qr[name]) return qr[name];
    const file = path.join(ASSETS, `${name}.jpg`);
    return "data:image/jpeg;base64," + fs.readFileSync(file).toString("base64");
  });
  return html;
}

(async () => {
  const { v, pastaSaida, dados } = carregar();
  for (const [template, out] of [["deck.html", "proposta.html"], ["quote.html", "orcamento.html"]]) {
    const html = await render(template, v, dados);
    fs.writeFileSync(path.join(pastaSaida, out), html);
    console.log(`${out}: ${(html.length / 1e6).toFixed(2)} MB → ${pastaSaida}`);
  }
  // Página só com as placas, que o pdf.js fotografa para placas.png (usada no PowerPoint).
  const placas = await svgPlacas(dados);
  fs.writeFileSync(path.join(pastaSaida, "placas.html"), `<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@600;700&display=block" rel="stylesheet"><style>html,body{margin:0;background:#fbf7f1}svg{display:block;width:1120px;height:880px}</style></head><body>${placas}</body></html>`);
})().catch((e) => { console.error(e.message); process.exit(1); });

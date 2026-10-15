// Gera proposta.html e orcamento.html (autónomos, com imagens embutidas) a partir do ficheiro de dados.
// Uso: node build.js [proposta.json] [--saida pasta]
const fs = require("fs");
const path = require("path");
const QRCode = require("qrcode");
const carregar = require("./dados");

const ASSETS = path.join(__dirname, "assets");
const MENU_DEMO_URL = "https://www.steevanz.com/raza17raza";

const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

async function qrSvg(url) {
  return QRCode.toString(url, { type: "svg", margin: 0, errorCorrectionLevel: "M", color: { dark: "#1d1220", light: "#0000" } });
}

async function render(template, v) {
  const qr = { "qr-aceitacao": await qrSvg(v.aceitacaoUrl), "qr-menu": await qrSvg(MENU_DEMO_URL) };
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
  const { v, pastaSaida } = carregar();
  for (const [template, out] of [["deck.html", "proposta.html"], ["quote.html", "orcamento.html"]]) {
    const html = await render(template, v);
    fs.writeFileSync(path.join(pastaSaida, out), html);
    console.log(`${out}: ${(html.length / 1e6).toFixed(2)} MB → ${pastaSaida}`);
  }
})().catch((e) => { console.error(e.message); process.exit(1); });

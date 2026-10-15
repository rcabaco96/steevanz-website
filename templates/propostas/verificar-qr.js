// Confirma que o QR code de adjudicação se lê e aponta exatamente para o endereço do ficheiro de dados.
// Uso: node verificar-qr.js [proposta.json]   (precisa das devDependencies: jsqr, pngjs)
const QRCode = require("qrcode");
const { PNG } = require("pngjs");
const jsQR = require("jsqr");
const carregar = require("./dados");

(async () => {
  const { v } = carregar();
  const buf = await QRCode.toBuffer(v.aceitacaoUrl, { type: "png", margin: 2, width: 600, errorCorrectionLevel: "M", color: { dark: "#1d1220", light: "#ffffff" } });
  const png = PNG.sync.read(buf);
  const res = jsQR(new Uint8ClampedArray(png.data), png.width, png.height);
  const lido = res && res.data;
  if (lido === v.aceitacaoUrl) console.log(`QR OK: ${lido}`);
  else { console.error(`QR NÃO confere: lido «${lido}», esperado «${v.aceitacaoUrl}»`); process.exit(1); }
})();

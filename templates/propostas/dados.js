// Lê o ficheiro de dados da proposta, calcula os valores (subtotais e totais, sempre sem IVA) e a pasta de saída.
// Nunca se mostram valores com IVA calculado (dono, 2026-10-18): só o valor sem IVA, com «+ IVA».
// Uso nos outros scripts: const d = require("./dados")();
// Argumentos aceites: [ficheiro.json] [--saida pasta]
const fs = require("fs");
const path = require("path");

const DEFAULT_EXEMPLOS = {
  landingTitulo: "Assim ficou a do <span class=\"hl\">Dolci e Salati</span>.",
  landingEtiqueta: "Feito pela Steevanz para um cliente, um café e gelataria em Armação de Pêra · Ver ao vivo: steevanz.com/dolci-salati",
  menuTitulo: "Veja-o <span class=\"scrib\">a mexer</span>.",
  menuEtiqueta: "Demonstração feita pela Steevanz com o logótipo de um cliente (Dolci e Salati) · Ver ao vivo: steevanz.com/raza17raza",
};

// pt-PT: vírgula decimal e espaço (não separável) nos milhares, também a partir de 1000 (1 025,00 €).
const grupos = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
const eur = (v) => {
  const [i, d] = Math.abs(v).toFixed(2).split(".");
  return (v < 0 ? "−" : "") + grupos(i) + "," + d + " €";
};
const num = (v) => (Number.isInteger(v) ? grupos(v) : v.toFixed(2).replace(".", ","));
const fmtDate = (d) => `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;

module.exports = function carregar(argv = process.argv.slice(2)) {
  let ficheiro = "proposta.json";
  let saida = null;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--saida") saida = argv[++i];
    else if (!argv[i].startsWith("--")) ficheiro = argv[i];
  }
  const ficheiroAbs = path.resolve(process.cwd(), ficheiro);
  const d = JSON.parse(fs.readFileSync(ficheiroAbs, "utf8"));
  const pastaSaida = path.resolve(process.cwd(), saida || path.join(__dirname, "saida", d.slug || "proposta"));
  fs.mkdirSync(pastaSaida, { recursive: true });

  const p = d.placas;
  const unitario = p.quantidade >= p.aPartirDe ? p.precoQuantidade : p.precoUnitario;
  const placasBruto = p.quantidade * p.precoUnitario;
  const desconto = placasBruto - p.quantidade * unitario;
  const placas = placasBruto - desconto;
  // Placas Google Reviews (opcional): preço por placa, preço do pack a partir de N placas e o logótipo por placa.
  const g = d.placasGoogle && d.placasGoogle.quantidade > 0 ? d.placasGoogle : null;
  const gLogo = g ? g.logo || 0 : 0;
  const gNormal = g ? g.precoUnitario + gLogo : 0;
  const gUsado = g ? (g.quantidade >= g.packDe ? g.precoPack : g.precoUnitario) + gLogo : 0;
  const gBruto = g ? g.quantidade * gNormal : 0;
  const gDesconto = g ? gBruto - g.quantidade * gUsado : 0;
  const google = gBruto - gDesconto;
  const unicoSub = d.landingPage.preco + placas + google;
  const mensalSub = d.landingPage.mensal + d.menu.mensal;
  // Plano anual pago adiantado: 12 meses pelo preço de (12 − mesesOferta).
  const mesesOferta = (d.planoAnual && d.planoAnual.mesesOferta) || 0;
  const mesesPagos = 12 - mesesOferta;
  const lpAnual = d.landingPage.mensal * mesesPagos;
  const menuAnual = d.menu.mensal * mesesPagos;
  const anualSub = lpAnual + menuAnual;
  const anualSemDesconto = mensalSub * 12;
  const poupanca = anualSemDesconto - anualSub;
  const data = new Date(`${d.data}T12:00:00`);
  const validade = new Date(data);
  validade.setDate(validade.getDate() + (d.validadeDias || 30));

  const v = {
    cliente: d.cliente,
    nif: d.nif || "",
    morada: d.morada || "",
    contacto: d.contacto || "",
    numero: d.numero || "",
    dataFmt: fmtDate(data),
    ano: String(data.getFullYear()),
    validadeFmt: fmtDate(validade),
    validadeDias: String(d.validadeDias || 30),
    aceitacaoUrl: d.aceitacaoUrl,
    aceitacaoCurta: d.aceitacaoUrl.replace(/^https?:\/\/(www\.)?/, ""),
    lpPreco: num(d.landingPage.preco),
    lpPrecoEur: eur(d.landingPage.preco),
    lpMensal: num(d.landingPage.mensal),
    lpMensalEur: eur(d.landingPage.mensal),
    menuMensal: num(d.menu.mensal),
    menuMensalEur: eur(d.menu.mensal),
    placasQtd: String(p.quantidade),
    placasUnit: num(p.precoUnitario),
    placasUnitEur: eur(p.precoUnitario),
    placasVol: num(p.precoQuantidade),
    placasDe: String(p.aPartirDe),
    placasUsado: num(unitario),
    placasBrutoEur: eur(placasBruto),
    placasDescontoEur: eur(desconto),
    placasEur: eur(placas),
    temDesconto: desconto > 0,
    descontoStyle: desconto > 0 ? "" : "display: none",
    googleStyle: g ? "" : "display: none",
    googleDescontoStyle: gDesconto > 0 ? "" : "display: none",
    googleQtd: g ? String(g.quantidade) : "0",
    googleNormal: num(gNormal),
    googleNormalEur: eur(gNormal),
    googleUsado: num(gUsado),
    googleBrutoEur: eur(gBruto),
    googleDescontoEur: eur(gDesconto),
    googleEur: eur(google),
    googlePack: g ? num(g.precoPack + gLogo) : "",
    googlePackDe: g ? String(g.packDe) : "",
    googleComLogo: gLogo > 0 ? ", com o vosso logótipo" : "",
    unicoSubEur: eur(unicoSub),
    mensalSubEur: eur(mensalSub),
    mesesOferta: String(mesesOferta),
    mesesPagos: String(mesesPagos),
    descontoAnualPct: String(Math.round((mesesOferta / 12) * 100)),
    lpAnual: num(lpAnual),
    lpAnualEur: eur(lpAnual),
    menuAnual: num(menuAnual),
    menuAnualEur: eur(menuAnual),
    mensalSub: num(mensalSub),
    anualSubEur: eur(anualSub),
    anualSemDescontoEur: eur(anualSemDesconto),
    poupancaEur: eur(poupanca),
    poupanca: num(poupanca),
    lpAnualCheio: num(d.landingPage.mensal * 12),
    lpAnualCheioEur: eur(d.landingPage.mensal * 12),
    menuAnualCheioEur: eur(d.menu.mensal * 12),
    menuAnualCheio: num(d.menu.mensal * 12),
    anualCheio: num(anualSemDesconto),
    lpPoupa: num(d.landingPage.mensal * mesesOferta),
    menuPoupa: num(d.menu.mensal * mesesOferta),
    adjAnualSubEur: eur(unicoSub + anualSub),
    adjMensalSubEur: eur(unicoSub + mensalSub),
  };
  const exemplos = Object.assign({}, DEFAULT_EXEMPLOS, d.exemplos || {});
  Object.assign(v, {
    exLandingTitulo: exemplos.landingTitulo,
    exLandingEtiqueta: exemplos.landingEtiqueta,
    exMenuTitulo: exemplos.menuTitulo,
    exMenuEtiqueta: exemplos.menuEtiqueta,
  });
  return { dados: d, v, pastaSaida, ficheiro: ficheiroAbs };
};
module.exports.eur = eur;

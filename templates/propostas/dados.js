// Lê o ficheiro de dados da proposta, calcula os valores (subtotais, IVA, totais) e a pasta de saída.
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
const round = (v) => Math.round(v * 100) / 100;
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
  const unicoSub = d.landingPage.preco + placas;
  const unicoIva = round(unicoSub * d.iva);
  const mensalSub = d.landingPage.mensal + d.menu.mensal;
  const mensalIva = round(mensalSub * d.iva);
  // Plano anual pago adiantado: 12 meses pelo preço de (12 − mesesOferta).
  const mesesOferta = (d.planoAnual && d.planoAnual.mesesOferta) || 0;
  const mesesPagos = 12 - mesesOferta;
  const lpAnual = d.landingPage.mensal * mesesPagos;
  const menuAnual = d.menu.mensal * mesesPagos;
  const anualSub = lpAnual + menuAnual;
  const anualIva = round(anualSub * d.iva);
  const anualSemDesconto = mensalSub * 12;
  const poupanca = anualSemDesconto - anualSub;
  const data = new Date(`${d.data}T12:00:00`);
  const validade = new Date(data);
  validade.setDate(validade.getDate() + (d.validadeDias || 30));
  const ivaPct = Math.round(d.iva * 100);

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
    ivaPct: String(ivaPct),
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
    unicoSubEur: eur(unicoSub),
    unicoIvaEur: eur(unicoIva),
    unicoTotEur: eur(unicoSub + unicoIva),
    mensalSubEur: eur(mensalSub),
    mensalIvaEur: eur(mensalIva),
    mensalTotEur: eur(mensalSub + mensalIva),
    mesesOferta: String(mesesOferta),
    mesesPagos: String(mesesPagos),
    descontoAnualPct: String(Math.round((mesesOferta / 12) * 100)),
    lpAnual: num(lpAnual),
    lpAnualEur: eur(lpAnual),
    menuAnual: num(menuAnual),
    menuAnualEur: eur(menuAnual),
    mensalSub: num(mensalSub),
    anualSubEur: eur(anualSub),
    anualIvaEur: eur(anualIva),
    anualTotEur: eur(anualSub + anualIva),
    anualSemDescontoEur: eur(anualSemDesconto),
    poupancaEur: eur(poupanca),
    poupanca: num(poupanca),
    poupancaComIvaEur: eur(round(poupanca * (1 + d.iva))),
    lpAnualCheio: num(d.landingPage.mensal * 12),
    lpAnualCheioEur: eur(d.landingPage.mensal * 12),
    menuAnualCheioEur: eur(d.menu.mensal * 12),
    menuAnualCheio: num(d.menu.mensal * 12),
    anualCheio: num(anualSemDesconto),
    lpPoupa: num(d.landingPage.mensal * mesesOferta),
    menuPoupa: num(d.menu.mensal * mesesOferta),
    adjAnualSubEur: eur(unicoSub + anualSub),
    adjAnualIvaEur: eur(unicoIva + anualIva),
    adjAnualTotEur: eur(unicoSub + anualSub + unicoIva + anualIva),
    adjMensalSubEur: eur(unicoSub + mensalSub),
    adjMensalIvaEur: eur(unicoIva + mensalIva),
    adjMensalTotEur: eur(unicoSub + mensalSub + unicoIva + mensalIva),
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

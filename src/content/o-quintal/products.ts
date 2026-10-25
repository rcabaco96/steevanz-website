// O Quintal's catalogue: the shop's «back-office» until there is one (owner, 2026-10-25). Edit this file to change
// a price, take a product off sale (inStock: false) or add one; the checkout reads prices from here only.
//
// Source of every product, price, unit and description: the business's own shop, https://www.o-quintal.com
// (Jumpseller), read on 2026-10-25 — the category pages (Frutas, Legumes p. 1–2, Produtos Regionais) and each
// product page. Names keep the site's wording, with spelling and accents corrected (e.g. «Maça» → «Maçã»,
// «Broculos» → «Brócolos»). Nothing here is invented: no product, price or description that the site doesn't show.
//
// priceCents: as the site shows it (its terms: «Os preços apresentados incluem IVA»). null = the site gives no clear
// price for what is sold (see `priceNote`): the product is shown «Preço sob consulta» and can't be bought until the
// owner fills it in.
//
// On 2026-10-25 every product page checked on o-quintal.com said «Este produto está esgotado» while the category
// pages listed them normally; inStock is left true here and the question is in the report for the owner.
//
// Kept free of imports so the unit tests can load it directly.

export type OQuintalCategoryId = "cabazes" | "fruta" | "legumes" | "regionais" | "mercearia";

export interface OQuintalCategory {
  id: OQuintalCategoryId;
  name: string;
  /** Short line under the category's title (shop copy, no facts). */
  intro: string;
}

export const oQuintalCategories: readonly OQuintalCategory[] = [
  { id: "cabazes", name: "Cabazes", intro: "Os cabazes da semana, prontos a levar para casa." },
  { id: "fruta", name: "Fruta", intro: "Fruta escolhida peça a peça." },
  { id: "legumes", name: "Legumes", intro: "Legumes, ervas e leguminosas secas." },
  { id: "regionais", name: "Produtos regionais", intro: "Mel, marmeladas e alheiras de Mirandela." },
  { id: "mercearia", name: "Ovos e mercearia", intro: "Caixas de ovos e outros produtos." },
];

export interface OQuintalChoice {
  id: string;
  name: string;
  /**
   * Price of this choice when it differs from the product's (cents). undefined = the product's price;
   * null = the site gives no price for this choice (not purchasable).
   */
  priceCents?: number | null;
}

export interface OQuintalOption {
  /** «Cabaz», «Vinho», «Tamanho»… */
  label: string;
  choices: readonly OQuintalChoice[];
}

export interface OQuintalProduct {
  /** The product's slug on o-quintal.com (stable, and it points back to the source). */
  id: string;
  name: string;
  category: OQuintalCategoryId;
  /** Paragraphs from the product page, verbatim (empty when the page has none). */
  description: readonly string[];
  /** Price in cents, as the site shows it; null = «Preço sob consulta». */
  priceCents: number | null;
  /** What the price buys, from the product page («kg», «500 g», «molho»…); null when the page doesn't say. */
  unit: string | null;
  /** Why the price is empty, for the owner (never shown to customers). */
  priceNote?: string;
  option?: OQuintalOption;
  inStock: boolean;
  /** The product's page on o-quintal.com. */
  sourceUrl: string;
  /** The product's photo on o-quintal.com (scripts/o-quintal/fetch-images.mjs downloads it). */
  sourceImage: string | null;
  featured?: boolean;
}

const site = "https://www.o-quintal.com";
const cdn = "https://cdnx.jumpseller.com/oquintal/image";

type Row = Omit<OQuintalProduct, "sourceUrl" | "inStock" | "description" | "sourceImage"> & {
  description?: readonly string[];
  inStock?: boolean;
  image?: string;
};

function product(row: Row): OQuintalProduct {
  const { image, description = [], inStock = true, ...rest } = row;
  return { ...rest, description, inStock, sourceUrl: `${site}/${row.id}`, sourceImage: image ? `${cdn}/${image}` : null };
}

export const oQuintalProducts: readonly OQuintalProduct[] = [
  // Cabazes (the home page's banners: «Cabazes de frutas e legumes», «Cabaz Alheira de Mirandela», «Preparados para sopas»).
  product({
    id: "cabaz-de-frescos-legumes-e-frutas",
    name: "Cabaz de Frescos (frutas e legumes)",
    category: "cabazes",
    description: [
      "Frescos e cuidadosamente selecionados para si.",
      "A composição de cada cabaz muda de semana para semana, conforme a época.",
    ],
    priceCents: 2000,
    unit: "cabaz",
    option: {
      label: "Cabaz",
      choices: [
        { id: "misto", name: "Cabaz Misto", priceCents: 2500 },
        { id: "legumes", name: "Cabaz Legumes", priceCents: 2000 },
        { id: "fruta", name: "Cabaz Fruta", priceCents: 2000 },
        { id: "familiar", name: "Cabaz Familiar", priceCents: 3000 },
        { id: "grande", name: "Cabaz Grande", priceCents: 4500 },
        { id: "fruta-legumes", name: "Cabaz Fruta + Cabaz Legumes", priceCents: null },
      ],
    },
    priceNote: "«Cabaz Fruta + Cabaz Legumes» aparece nas opções do site sem preço próprio.",
    image: "35011173/2.jpg?1759478831",
    featured: true,
  }),
  product({
    id: "cabaz-preparado-para-sopas",
    name: "Cabaz preparado para sopas",
    category: "cabazes",
    description: [
      "5 preparados para sopas.",
      "Os preparados são escolhidos por nós de acordo com a disponibilidade, no entanto pode pedir para excluir algum caso não consuma algum dos produtos.",
    ],
    priceCents: 2000,
    unit: "cabaz",
    option: {
      label: "Variedade",
      choices: [
        { id: "camponesa", name: "Camponesa" },
        { id: "cremosa", name: "Cremosa" },
        { id: "portuguesa", name: "Portuguesa" },
        { id: "juliana", name: "Juliana" },
        { id: "feijao-verde", name: "Feijão verde" },
        { id: "feijao-verde-alho-frances", name: "Feijão verde com alho francês" },
        { id: "outras", name: "Outras" },
      ],
    },
    image: "59896429/IMG_20250206_145256.jpg?1738853940",
    featured: true,
  }),
  product({
    id: "cabaz-alheira-de-mirandela",
    name: "Cabaz Alheira de Mirandela",
    category: "cabazes",
    description: [
      "Cabaz com todos os produtos para uma refeição de 4 pessoas.",
      "Cabaz composto por: 4 Alheiras de Mirandela, 1 molho de grelos, 6 ovos, 1 kg de batata e 1 vinho tinto ou branco Encostas da Arrábida Colheita Especial Casa Ermelinda Freitas 75 cl.",
    ],
    priceCents: 2000,
    unit: "cabaz",
    option: {
      label: "Vinho",
      choices: [
        { id: "tinto", name: "Com vinho tinto" },
        { id: "branco", name: "Com vinho branco" },
      ],
    },
    image: "35015983/1.jpg?1683651847",
    featured: true,
  }),

  // Fruta (https://www.o-quintal.com/fruta, 21 products).
  product({
    id: "pera-abacate",
    name: "Abacate",
    category: "fruta",
    description: ["Pera abacate."],
    priceCents: null,
    unit: null,
    priceNote: "O site mostra 2,00 € na lista de Frutas e 2,50 € na página do produto («Peso aproximado»).",
    image: "35011243/pera-abacate.jpg?1683644051",
  }),
  product({
    id: "abacaxi",
    name: "Abacaxi",
    category: "fruta",
    description: ["Apenas se vende o abacaxi à unidade e o peso varia de peça para peça."],
    priceCents: null,
    unit: null,
    priceNote: "O site mostra 1,89 € «Preço por Kg», mas vende-o só à unidade com peso variável: falta o preço por peça.",
    image: "35014329/1.jpg?1683649231",
  }),
  product({ id: "banana", name: "Banana", category: "fruta", priceCents: 149, unit: "kg", image: "35014352/2.jpg?1683649258" }),
  product({ id: "dispiro-de-roer", name: "Dióspiro de roer", category: "fruta", priceCents: 249, unit: "kg", image: "35014687/19.jpg?1683649858" }),
  product({ id: "laranja", name: "Laranja", category: "fruta", priceCents: 179, unit: "kg", image: "35014801/42.jpg?1683650024" }),
  product({ id: "limao", name: "Limão", category: "fruta", priceCents: 110, unit: "500 g", image: "35014809/23.jpg?1750772403" }),
  product({ id: "maca-golden", name: "Maçã Golden", category: "fruta", priceCents: 189, unit: "kg", image: "35014848/25.jpg?1683650091" }),
  product({ id: "maca-royal-gala", name: "Maçã Royal Gala", category: "fruta", priceCents: 199, unit: "kg", image: "35014921/27.jpg?1686642781" }),
  product({ id: "manga-aviao", name: "Manga", category: "fruta", priceCents: 200, unit: "unidade", image: "35014960/28.jpg?1683650215" }),
  product({
    id: "papaia",
    name: "Papaia",
    category: "fruta",
    priceCents: null,
    unit: null,
    priceNote: "O site mostra 2,90 € com «Peso aproximado», sem dizer se é por kg ou por peça.",
    image: "35015075/30.jpg?1683650319",
  }),
  product({ id: "pera-rocha", name: "Pera Rocha", category: "fruta", priceCents: 199, unit: "kg", image: "35015096/32.jpg?1683650350" }),
  product({ id: "anonas", name: "Anonas", category: "fruta", priceCents: 299, unit: "kg", image: "35015126/40.jpg?1683650461" }),
  product({ id: "ameixa-preta", name: "Ameixa", category: "fruta", priceCents: 249, unit: "kg", image: "35015272/51.jpg?1683650722" }),
  product({ id: "uva-cardinal", name: "Uva preta", category: "fruta", priceCents: 299, unit: "kg", image: "35015202/47.jpg?1699550448" }),
  product({
    id: "3kg-maca-royal-gala-pequena-alcobaca",
    name: "3 kg Maçã Royal Gala (Alcobaça)",
    category: "fruta",
    priceCents: 500,
    unit: "3 kg",
    image: "27182613/maca_royal_gala2.jpg?1663396512",
    featured: true,
  }),
  product({ id: "3-kg-pera-rocha-oeste", name: "3 kg Pera Rocha (Oeste)", category: "fruta", priceCents: 500, unit: "3 kg", image: "81270968/P_C3_AAra-Rocha1.jpg?1789631512", featured: true }),
  product({
    id: "3kg-diospiro-roer",
    name: "3 kg Dióspiro de roer",
    category: "fruta",
    priceCents: 500,
    unit: "3 kg",
    image: "82355010/Di_C3_B3spiros_20Nacionais_20do_20Quintal.png?1791560496",
    featured: true,
  }),
  product({
    id: "3k-maca-golden-alcobaca",
    name: "3 kg Maçã Golden (Alcobaça)",
    category: "fruta",
    priceCents: 500,
    unit: "3 kg",
    image: "82744148/Promo_C3_A7_C3_A3o_20de_20Ma_C3_A7_C3_A3s_20Golden_203KG_20por_205_E2_82_AC.png?1792332711",
  }),
  product({ id: "tamara-medjool", name: "Tâmara Medjool", category: "fruta", priceCents: 1650, unit: null, image: "77418127/tamara.png?1780569534", featured: true }),
  product({
    id: "caixa-de-manga-palmer",
    name: "Caixa de manga",
    category: "fruta",
    description: ["Preço por caixa.", "A quantidade de mangas pode variar consoante o tamanho de cada unidade.", "As imagens são meramente ilustrativas."],
    priceCents: 1000,
    unit: "caixa",
    image: "74788259/4686.jpg?1773764758",
    featured: true,
  }),

  // Legumes (https://www.o-quintal.com/legumes, pages 1 and 2).
  product({ id: "abobora", name: "Abóbora", category: "legumes", priceCents: 149, unit: "kg", image: "35014383/43.jpg?1687789835" }),
  product({ id: "agriao", name: "Agrião", category: "legumes", priceCents: 150, unit: "molho", image: "35014392/12.jpg?1683649314" }),
  product({ id: "alho-frances", name: "Alho-francês", category: "legumes", priceCents: 145, unit: "500 g", image: "35014403/3.jpg?1704796864" }),
  product({ id: "alface-frizada", name: "Alface frisada", category: "legumes", priceCents: 150, unit: "unidade", image: "35014396/6.jpg?1683649325" }),
  product({ id: "alho-seco", name: "Alho seco (100 g)", category: "legumes", description: ["Preço por kg: 5,99 €."], priceCents: 60, unit: "100 g", image: "35014426/37.jpg?1683649401" }),
  product({ id: "batata-agria", name: "Batata para fritar", category: "legumes", description: ["Batata especial para fritar."], priceCents: 129, unit: "kg", image: "35014456/39.jpg?1683649463" }),
  product({ id: "batata-vermelha-lavada", name: "Batata para cozer", category: "legumes", description: ["Batata especial para cozer."], priceCents: 129, unit: "kg", image: "35014462/6.jpg?1683649486" }),
  product({ id: "batata-miuda", name: "Batata miúda", category: "legumes", description: ["Batata especial para assar."], priceCents: 149, unit: "kg", image: "35014471/31.jpg?1683649504" }),
  product({ id: "beringela", name: "Beringela", category: "legumes", priceCents: 160, unit: "500 g", image: "35014529/8.jpg?1760351965" }),
  product({
    id: "beterraba",
    name: "Beterraba",
    category: "legumes",
    priceCents: null,
    unit: null,
    priceNote: "O site mostra 0,85 € com a escolha «500g» ou «1Kg», sem preço para cada uma.",
    image: "35014534/9.jpg?1706463569",
  }),
  product({ id: "batata-doce", name: "Batata-doce", category: "legumes", description: ["Batata nacional."], priceCents: 199, unit: "kg", image: "35014510/10.jpg?1683649560" }),
  product({ id: "broculos", name: "Brócolos", category: "legumes", priceCents: 150, unit: "500 g", image: "35014542/33.jpg?1756194278" }),
  product({ id: "caldo-verde-250g", name: "Caldo verde (250 g)", category: "legumes", priceCents: 185, unit: "unidade", image: "35014552/13.jpg?1683649630" }),
  product({ id: "cebola-roxa", name: "Cebola roxa", category: "legumes", priceCents: 190, unit: "kg", image: "35014583/11.jpg?1691945525" }),
  product({
    id: "cebola",
    name: "Cebola",
    category: "legumes",
    priceCents: null,
    unit: null,
    priceNote: "O site mostra 0,60 € com a escolha «500g» ou «1Kg», sem preço para cada uma.",
    image: "35014578/10.jpg?1760351899",
  }),
  product({
    id: "cenoura",
    name: "Cenoura",
    category: "legumes",
    priceCents: null,
    unit: null,
    priceNote: "O site mostra 0,60 € com a escolha «500g» ou «1Kg», sem preço para cada uma.",
    image: "35014587/12.jpg?1687946951",
  }),
  product({
    id: "chuchu",
    name: "Chuchu",
    category: "legumes",
    priceCents: null,
    unit: null,
    priceNote: "O site mostra 1,75 € («Preço por Kg» nos dados da página) com a escolha «500g» ou «1Kg», sem preço para cada uma.",
    image: "35014591/14.jpg?1683649684",
  }),
  product({ id: "cogumelos-frescos-couvete-300g", name: "Cogumelos frescos (300 g)", category: "legumes", priceCents: 250, unit: "embalagem", image: "35014632/7.jpg?1683649733" }),
  product({ id: "coentros-molho", name: "Coentros", category: "legumes", priceCents: 50, unit: "molho", image: "35014624/35.jpg?1683649721" }),
  product({ id: "courgetes", name: "Courgetes", category: "legumes", priceCents: 110, unit: "500 g", image: "35014637/28.jpg?1775914924" }),
  product({ id: "couve-coracao", name: "Couve coração", category: "legumes", priceCents: 169, unit: "kg", image: "35014643/16.jpg?1683649769" }),
  product({ id: "couve-lombardo", name: "Couve lombardo", category: "legumes", priceCents: 229, unit: "kg", image: "35014647/17.jpg?1683649783" }),
  product({ id: "couve-portuguesa", name: "Couve portuguesa", category: "legumes", priceCents: 225, unit: "unidade", image: "35014660/18.jpg?1683649804" }),
  product({ id: "couve-flor", name: "Couve-flor", category: "legumes", priceCents: 299, unit: "kg", image: "35014667/38.jpg?1683649828" }),
  product({ id: "espinafres", name: "Espinafres", category: "legumes", priceCents: 250, unit: "molho", image: "35014698/20.jpg?1734633506" }),
  product({ id: "feijao-verde", name: "Feijão-verde", category: "legumes", priceCents: 499, unit: "kg", image: "35014711/21.jpg?1683649891" }),
  product({ id: "grelos-de-nabo", name: "Grelos de nabo", category: "legumes", priceCents: 399, unit: "molho", image: "35014729/19.jpg?1683649913" }),
  product({ id: "hortela", name: "Hortelã", category: "legumes", priceCents: 100, unit: "molho", image: "35014740/22.jpg?1683649933" }),
  product({ id: "nabicas", name: "Nabiças", category: "legumes", priceCents: 250, unit: "molho", image: "35015042/19.jpg?1683650266" }),
  product({ id: "nabo-sem-rama", name: "Nabo sem rama", category: "legumes", priceCents: 150, unit: "500 g", image: "35015058/29.jpg?1683650289" }),
  // The category page says «Preço por Kg» and the product's own text «Preço por 500g»: the product page wins.
  product({ id: "pepino", name: "Pepino", category: "legumes", priceCents: 125, unit: "500 g", image: "35015094/31.jpg?1750772357" }),
  product({ id: "pimento-vermelho", name: "Pimento vermelho", category: "legumes", priceCents: 180, unit: "500 g", image: "35015101/33.jpg?1683650362" }),
  product({ id: "pimento-verde", name: "Pimento verde", category: "legumes", priceCents: 180, unit: "500 g", image: "35015102/34.jpg?1683650372" }),
  product({ id: "salsa", name: "Salsa", category: "legumes", priceCents: 50, unit: "molho", image: "35015115/36.jpg?1683650419" }),
  product({ id: "tomate-salada", name: "Tomate salada", category: "legumes", priceCents: 150, unit: "500 g", image: "35015120/38.jpg?1704129535" }),
  product({ id: "grao-de-bico-seco-500g", name: "Grão-de-bico seco (500 g)", category: "legumes", priceCents: 175, unit: "500 g", image: "35015286/55.jpg?1683650772" }),
  product({ id: "feijao-encarnado-seco-500g", name: "Feijão encarnado seco (500 g)", category: "legumes", priceCents: 175, unit: "500 g", image: "35015292/57.jpg?1683650786" }),
  product({ id: "feijao-branco-seco-500g", name: "Feijão branco seco (500 g)", category: "legumes", priceCents: 175, unit: "500 g" }),
  product({ id: "feijao-preto-seco-500g", name: "Feijão preto seco (500 g)", category: "legumes", priceCents: 175, unit: "500 g" }),
  product({ id: "feijao-manteiga-seco-500g", name: "Feijão-manteiga seco (500 g)", category: "legumes", priceCents: 230, unit: "500 g", image: "35015311/61.jpg?1683650832" }),
  product({ id: "feijao-catarino-seco-500g", name: "Feijão catarino seco (500 g)", category: "legumes", priceCents: 175, unit: "500 g" }),
  product({ id: "feijao-frade-seco-500g", name: "Feijão-frade seco (500 g)", category: "legumes", priceCents: 175, unit: "500 g" }),
  product({ id: "rabanetes-500g", name: "Rabanetes (500 g)", category: "legumes", priceCents: 250, unit: "500 g", image: "35015324/22.jpg?1683650865" }),
  product({ id: "grelos-de-couve", name: "Grelos de couve", category: "legumes", priceCents: 300, unit: null, image: "8942320/grelo_couve.jpg?1614807408" }),
  product({ id: "tomate-cherry", name: "Tomate cherry", category: "legumes", priceCents: 549, unit: null, image: "35015923/Design_sem_nome__3_.jpg?1683651665" }),
  product({ id: "couve-roxa", name: "Couve roxa", category: "legumes", priceCents: 169, unit: "kg", image: "35015919/Design_sem_nome__4_.jpg?1683651647" }),
  product({ id: "espargos-molho", name: "Espargos", category: "legumes", priceCents: 390, unit: "molho", image: "35015603/32.jpg?1683651229" }),
  product({ id: "couve-chinesa", name: "Couve chinesa", category: "legumes", description: ["Unidade com +/- 500 a 800 g."], priceCents: 299, unit: "unidade", image: "35015680/18.jpg?1683651274" }),
  product({ id: "aipo", name: "Aipo", category: "legumes", description: ["Preço por unidade, +/- 500 g."], priceCents: 200, unit: "unidade", image: "35015684/15.jpg?1683651285" }),
  product({ id: "couves-de-bruxelas-500g", name: "Couves de Bruxelas (500 g)", category: "legumes", priceCents: 250, unit: "500 g" }),

  // Produtos regionais (https://www.o-quintal.com/queijos-alentejanos).
  product({
    id: "mel-de-rosmaninho-monte-dos-bens-1kg",
    name: "Mel multifloral nacional (1 kg)",
    category: "regionais",
    description: ["Mel multifloral de produção nacional."],
    priceCents: 1200,
    unit: "1 kg",
    image: "35014447/5.jpg?1683649441",
    featured: true,
  }),
  product({
    id: "marmelada-quinta-dos-jugais-500g",
    name: "Marmelada Quinta dos Jugais (500 g)",
    category: "regionais",
    description: ["Marmelada, receita tradicional.", "Ingredientes: marmelo e açúcar."],
    priceCents: 575,
    unit: "500 g",
    image: "35016284/17.jpg?1683652186",
  }),
  product({
    id: "marmelada-com-noz-quinta-dos-jugais-500g",
    name: "Marmelada com noz Quinta dos Jugais (500 g)",
    category: "regionais",
    description: ["Marmelada, receita tradicional com pedaços de noz.", "Ingredientes: marmelo, açúcar e noz."],
    priceCents: 575,
    unit: "500 g",
    image: "35016291/36.jpg?1683652196",
  }),
  product({
    id: "4-alheiras-de-mirandela",
    name: "4 alheiras de Mirandela",
    category: "regionais",
    description: ["Só comercializamos embalagens de 4 unidades."],
    priceCents: 1000,
    unit: "embalagem de 4",
    option: {
      label: "Variedade",
      choices: [
        { id: "mirandela", name: "Mirandela" },
        { id: "mirandela-caca", name: "Mirandela c/ caça" },
      ],
    },
    image: "35015992/25.jpg?1683651901",
    featured: true,
  }),

  // Ovos e mercearia (home page «Caixas 5 dúzias Ovos — Caixas com variedade L e XL»; «Produtos Destacados»).
  product({
    id: "caixa-5-duzias-ovos",
    name: "Caixa de 5 dúzias de ovos",
    category: "mercearia",
    description: ["Caixas com variedade L e XL."],
    priceCents: 1500,
    unit: "caixa",
    option: {
      label: "Tamanho",
      choices: [
        { id: "l", name: "5 dúzias tamanho L" },
        { id: "xl", name: "5 dúzias tamanho XL" },
        { id: "matinados", name: "5 dúzias matinados M/L" },
      ],
    },
    image: "73789358/11367.jpg?1772021525",
    featured: true,
  }),
  product({
    id: "leite-nido-25kg",
    name: "Leite Nido Nestlé",
    category: "mercearia",
    priceCents: null,
    unit: null,
    priceNote: "O site mostra 15,50 € com a escolha «900g» ou «2,5Kg», sem preço para cada uma.",
    image: "82355102/Promo_C3_A7_C3_A3o_20NIDO__20Sabor_20e_20Comodidade_20em_20Casa.png?1791560729",
  }),
];

const byId = new Map(oQuintalProducts.map((item) => [item.id, item]));

export function findOQuintalProduct(id: string): OQuintalProduct | undefined {
  return byId.get(id);
}

export function oQuintalProductsIn(category: OQuintalCategoryId): OQuintalProduct[] {
  return oQuintalProducts.filter((item) => item.category === category);
}

/** The unit price of a product (and its choice), in cents, or null when it can't be bought. */
export function oQuintalUnitPrice(item: OQuintalProduct, choiceId?: string | null): number | null {
  if (!item.inStock) return null;
  if (item.option) {
    const choice = item.option.choices.find((entry) => entry.id === choiceId);
    if (!choice) return null;
    if (choice.priceCents !== undefined) return choice.priceCents;
  } else if (choiceId) {
    return null;
  }
  return item.priceCents;
}

/** The lowest price a product can be bought for (for the cards: «desde 20,00 €»), or null. */
export function oQuintalFromPrice(item: OQuintalProduct): { cents: number; varies: boolean } | null {
  if (!item.inStock) return null;
  if (!item.option) return item.priceCents === null ? null : { cents: item.priceCents, varies: false };
  const prices = item.option.choices
    .map((choice) => (choice.priceCents === undefined ? item.priceCents : choice.priceCents))
    .filter((price): price is number => price !== null);
  if (!prices.length) return null;
  const min = Math.min(...prices);
  return { cents: min, varies: prices.some((price) => price !== min) };
}

/** «1,49 €» (pt-PT; the site shows «€1,49», the Portuguese convention puts the symbol after). */
export function formatEuros(cents: number): string {
  const euros = Math.floor(cents / 100);
  const rest = String(cents % 100).padStart(2, "0");
  return `${euros.toLocaleString("pt-PT")},${rest} €`;
}

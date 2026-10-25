// O Quintal: the facts of the business, each from its own shop https://www.o-quintal.com (read on 2026-10-25).
// Nothing here is invented: no ratings, no review counts, no opening hours (the site shows none).
//  - Name, tagline, «atendimento personalizado» sentence, meta description: the home page.
//  - Phone («chamada para a rede móvel»), email, «Lisboa e arredores»: /contact.
//  - Delivery zones: /zonas-de-entrega. Delivery or pickup, delivery times, perishables: /terms-and-conditions.
//  - Company, NIF and registered address: /terms-and-conditions.
//  - Business baskets («sem contratos fixos», «Pedir Proposta»): /cestas-de-fruta-para-empresas.
//  - Facebook and Instagram: links in the site's footer.
// Kept free of imports so the unit tests can load it directly.

const media = "/media/clients/o-quintal";

export const oQuintal = {
  name: "O Quintal",
  tagline: "Frescos e cuidadosamente selecionados para si",
  /** The home page's paragraph, verbatim. */
  promise:
    "O atendimento personalizado e a qualidade dos nossos produtos são o nosso estandarte e a razão pela qual os nossos clientes confiam em nós.",
  /** The site's meta description, first sentence. */
  summary: "Cabazes de frescos com frutas e legumes com produtos de qualidade a um preço acessível.",
  /** The meta description goes on («trabalhamos apenas com produtores altamente qualificados…»). */
  producers: "Trabalhamos apenas com produtores altamente qualificados.",
  /** /cestas-de-fruta-para-empresas, verbatim. */
  origin: "Os nossos produtos são, na sua maioria, de origem nacional e de pequenos produtores.",
  selection: "As nossas frutas são selecionadas criteriosamente.",
  /** The business's logo on its Jumpseller shop (alt «O Quintal»). */
  logo: "https://images.jumpseller.com/store/oquintal/store/logo/Frutas___Legumes_(1).png?1683658257",
  /** The home page's four picture blocks, with the text shown on each (o-quintal.com). */
  banners: {
    cabazes: "https://assets.jumpseller.com/store/oquintal/themes/322200/options/28504187/Design%20sem%20nome%20%286%29.jpg?1683657955",
    alheira: "https://assets.jumpseller.com/store/oquintal/themes/322200/options/28504195/Design%20sem%20nome%20%287%29.jpg?1683657955",
    sopas: "https://assets.jumpseller.com/store/oquintal/themes/322200/settings/51a12e499a4ecef04594/Sopas.jpg?1738866858",
    ovos: "https://assets.jumpseller.com/store/oquintal/themes/322200/settings/2e17895c3644301e1831/1530.png?1772106435",
  },
  area: "Lisboa e arredores",
  phoneDisplay: "912 083 448",
  phoneHref: "tel:+351912083448",
  /** Required next to a mobile number in Portugal; the site says «(chamada para a rede móvel)». */
  phoneNote: "Chamada para a rede móvel nacional",
  email: "oquintal@hotmail.com",
  facebook: "https://www.facebook.com/oquintaldequeluz",
  instagram: "https://www.instagram.com/oquintalfrutas",
  instagramHandle: "@oquintalfrutas",
  complaints: "https://www.livroreclamacoes.pt/Inicio/",
  /** «Entregamos em parte dos concelhos de …» (/zonas-de-entrega). */
  deliveryCouncils: ["Amadora", "Odivelas", "Oeiras", "Cascais", "Sintra", "Lisboa"],
  deliveryNote: "Entregamos em parte destes concelhos. Pergunte-nos se a sua zona está abrangida.",
  /** /terms-and-conditions: «Entrega ao domicílio» or «Levantamento em local indicado pela O Quintal». */
  fulfilment: {
    delivery: "Entrega ao domicílio",
    pickup: "Levantamento em local indicado pela O Quintal",
  },
  /** /terms-and-conditions (perishables are excluded from the right of withdrawal). */
  perishables:
    "Os bens perecíveis, como frutas, legumes e outros produtos alimentares frescos, estão excluídos do direito de livre resolução. Em caso de falta de conformidade, tem direito à substituição, redução do preço ou resolução do contrato, nos termos da lei.",
  business: {
    title: "Cestas de fruta para empresas",
    text: "O nosso objetivo é incentivar a melhoria dos hábitos alimentares diários. Sem contratos fixos: pode pausar ou ajustar as entregas, por exemplo nas férias, ou parar quando quiser, sem custos.",
  },
  legal: {
    company: "Almeida & Frias, Lda",
    nif: "510 879 250",
    address: "Rua 5 de Outubro, 42, 2785-554 São Domingos de Rana",
  },
  /** The business's previous shop, the source of the catalogue. */
  sourceSite: "https://www.o-quintal.com",
  media: {
    og: `${media}/og.jpg`,
    favicon: `${media}/icone.ico`,
    icon192: `${media}/icone-192.png`,
    icon512: `${media}/icone-512.png`,
    appleIcon: `${media}/icone-apple.png`,
  },
} as const;

/** Shop settings the owner still has to confirm (see the report of 2026-10-25). */
export const oQuintalShop = {
  /**
   * Delivery fee in cents. The site's terms only say «Os custos de transporte são calculados automaticamente no
   * momento da encomenda» and show no value: null = not charged online, the page says it is still to be confirmed.
   */
  deliveryFeeCents: null as number | null,
  /** Minimum order in cents (the site states none). Stripe itself refuses payments under 0,50 €. */
  minimumCents: 50,
};

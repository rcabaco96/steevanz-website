// Texts of Meada's website, in European Portuguese. Meada is a FICTIONAL shop (see ./facts.ts): the products, their
// makers, prices (always without VAT, with «+ IVA») and the team are made up for the demo. No ratings, no reviews,
// no testimonials, no customer numbers, no results promised. Kept free of imports for the unit tests.

import type { MeadaPhotoId } from "./facts";

export type MeadaCategoryId = "mesa" | "texteis" | "cestaria" | "cera";

export interface MeadaProduct {
  id: string;
  category: MeadaCategoryId;
  name: string;
  /** Material and where it is made (fictional workshops). */
  origin: string;
  detail: string;
  /** Euros, without VAT. */
  price: number;
  image: MeadaPhotoId;
  alt: string;
  /** Where the picture is centred in its card (CSS object-position). */
  focus?: string;
}

export interface MeadaCraft {
  id: string;
  name: string;
  nameItalic: string;
  text: string;
  maker: string;
  media: { kind: "video"; video: "barro" | "bordado" } | { kind: "photo"; image: MeadaPhotoId };
  alt: string;
}

export interface MeadaFaq {
  q: string;
  a: string;
}

export const meadaCopy = {
  htmlLang: "pt-PT",
  ogLocale: "pt_PT",
  meta: {
    title: "Meada · Casa & Ofícios em Guimarães",
    description:
      "Loja de casa e ofícios portugueses no centro histórico de Guimarães: linho, barro, vime, lã e cera, com loja online e cartão de cliente. Site de demonstração da Steevanz para um negócio fictício.",
  },
  ogAlt: "O logótipo da Meada sobre linho cru, ao lado de uma etiqueta de papel kraft atada com fio vermelho e de um tear com fios vermelhos.",
  skip: "Saltar para o conteúdo",
  newTab: "(abre num novo separador)",
  logoLabel: "Meada, casa e ofícios",
  demo: "Negócio fictício · site de demonstração",
  nav: {
    label: "Menu principal",
    shop: "Loja",
    crafts: "Ofícios",
    card: "Cartão de cliente",
    visit: "Visitar",
    bag: "Cesto",
    open: "Abrir o menu",
    close: "Fechar o menu",
  },
  hero: {
    kicker: "Casa & ofícios · Guimarães",
    title: "Coisas feitas à mão, para uma casa que dura.",
    lead: "Linho, barro, vime, lã e cera de oficinas do Norte, escolhidos um a um, na loja do Largo e na loja online.",
    shop: "Ver a loja",
    visit: "Visitar a loja",
    scroll: "Descer",
    alt: "Mãos de uma tecedeira a passar fios vermelhos num tear de madeira.",
    tagTop: "Feito à mão",
    tagLine: "Cada peça tem quem a fez.",
    tagPrice: "N.º 001",
  },
  manifesto: {
    eyebrow: "A meada",
    text: "Uma meada é o fio antes de ser peça. Juntamos o trabalho de quem ainda faz as coisas devagar, e passamos o fio a quem as leva para casa.",
  },
  shop: {
    eyebrow: "Loja online",
    title: "A loja,",
    titleItalic: "também à distância.",
    intro: "Escolha as peças, junte-as ao cesto e encomende. Levanta na loja ou recebe em casa, embrulhado em papel kraft e atado com fio vermelho.",
    vatNote: "Preços sem IVA.",
    plusVat: "+ IVA",
    demoNote: "Valores de exemplo de um negócio fictício.",
    all: "Tudo",
    categories: {
      mesa: "Mesa",
      texteis: "Têxteis",
      cestaria: "Cestaria e casa",
      cera: "Cera e sabão",
    } as Record<MeadaCategoryId, string>,
    add: "Encomendar",
    added: "No cesto",
    list: [
      {
        id: "jarro-barro",
        category: "mesa",
        name: "Jarro de barro vermelho",
        origin: "Barro · oficina em Barcelos",
        detail: "Torneado à mão, 28 cm. Para flores secas ou ramos de oliveira.",
        price: 34,
        image: "jarro",
        alt: "Um jarro de barro com flores secas, encostado a uma parede cor de terra.",
        focus: "72% 50%",
      },
      {
        id: "tacas-gres",
        category: "mesa",
        name: "Taças de grés, conjunto de 3",
        origin: "Grés · oficina em Viana",
        detail: "Vidrado mate, cada uma com o seu tom. Vão à máquina.",
        price: 42,
        image: "tacas",
        alt: "Taças pequenas de grés e um pote de barro numa prateleira de madeira.",
        focus: "45% 70%",
      },
      {
        id: "canecas-barro",
        category: "mesa",
        name: "Canecas de barro vidrado, par",
        origin: "Barro · oficina no Minho",
        detail: "Por fora em barro cru, por dentro vidradas. 300 ml.",
        price: 26,
        image: "canecas",
        alt: "Canecas de barro claro com o interior vidrado em castanho escuro.",
        focus: "40% 50%",
      },
      {
        id: "tigelas-pintadas",
        category: "mesa",
        name: "Tigelas pintadas à mão, conjunto de 4",
        origin: "Faiança · pintura à mão",
        detail: "Quatro cores de pigmento, nenhuma igual à outra.",
        price: 58,
        image: "pratos",
        alt: "Pilhas de tigelas e pratos de cerâmica em várias cores numa prateleira branca.",
        focus: "30% 60%",
      },
      {
        id: "guardanapos-linho",
        category: "texteis",
        name: "Guardanapos de linho, conjunto de 4",
        origin: "Linho · tecido em Guimarães",
        detail: "Linho cru lavado, 45 × 45 cm. Ganham com cada lavagem.",
        price: 32,
        image: "guardanapos",
        alt: "Um guardanapo de linho cru dobrado com um ramo de alecrim e uma margarida.",
        focus: "60% 40%",
      },
      {
        id: "bordado-ponto-cruz",
        category: "texteis",
        name: "Bordado em ponto de cruz, no bastidor",
        origin: "Linho e algodão · bordado à mão",
        detail: "Aves e coração em linha vermelha. Para pendurar na parede.",
        price: 45,
        image: "panoBordado",
        alt: "Um bordado de aves e coração em ponto de cruz vermelho, num bastidor de madeira.",
        focus: "50% 55%",
      },
      {
        id: "manta-la",
        category: "texteis",
        name: "Manta de lã tricotada",
        origin: "Lã · tricotada à mão",
        detail: "Lã natural, 130 × 170 cm. Para o sofá ou ao fundo da cama.",
        price: 89,
        image: "mantaLa",
        alt: "Mantas de lã tricotada em tons de cru e castanho, dobradas umas sobre as outras.",
        focus: "45% 50%",
      },
      {
        id: "manta-tear",
        category: "texteis",
        name: "Manta de tear, linho e lã",
        origin: "Linho e lã · tecida em tear manual",
        detail: "Riscas vermelhas e pretas sobre cru, 140 × 200 cm.",
        price: 120,
        image: "mantaTear",
        alt: "Pormenor de uma manta tecida em tear, com riscas vermelhas e pretas sobre fundo cru.",
        focus: "50% 50%",
      },
      {
        id: "cesto-vime",
        category: "cestaria",
        name: "Cesto de vime com asa",
        origin: "Vime · entrançado à mão",
        detail: "Para o pão, a fruta ou a feira. 38 cm de diâmetro.",
        price: 28,
        image: "cestoVime",
        alt: "Cestos de vime de vários tamanhos, com asas, empilhados numa loja.",
        focus: "45% 70%",
      },
      {
        id: "cestos-palha",
        category: "cestaria",
        name: "Cestos de palha com galão, conjunto de 3",
        origin: "Palha e algodão · entrançados à mão",
        detail: "Três tamanhos que encaixam. Para arrumar mantas ou plantas.",
        price: 39,
        image: "cestosPalha",
        alt: "Cestos redondos de palha com bandas de tecido às cores, empilhados.",
        focus: "40% 60%",
      },
      {
        id: "velas-cera",
        category: "cera",
        name: "Velas de cera de abelha, par",
        origin: "Cera de abelha · enroladas à mão",
        detail: "Folha de cera em favo, enrolada à mão. Cerca de 6 horas cada.",
        price: 14,
        image: "velas",
        alt: "Duas velas de cera de abelha enroladas, com o desenho do favo, sobre madeira.",
        focus: "50% 50%",
      },
      {
        id: "sabonete-azeite",
        category: "cera",
        name: "Sabonete de azeite, embrulhado à mão",
        origin: "Azeite · feito a frio",
        detail: "Embrulhado em papel kraft e atado com fio. 120 g.",
        price: 6.5,
        image: "sabonete",
        alt: "Um sabonete claro embrulhado numa cinta de papel kraft atada com fio, sobre ardósia.",
        focus: "50% 55%",
      },
    ] satisfies MeadaProduct[] as MeadaProduct[],
  },
  bag: {
    title: "O seu cesto",
    empty: "O cesto está vazio. Escolha uma peça na loja.",
    open: "Abrir o cesto",
    close: "Fechar o cesto",
    items: "{n} peças",
    item: "1 peça",
    remove: "Tirar do cesto",
    less: "Menos uma",
    more: "Mais uma",
    subtotal: "Total das peças",
    deliveryLabel: "Entrega",
    pickup: "Levantar na loja, no Largo",
    pickupNote: "Sem custo. Avisamos quando estiver pronto.",
    shipping: "Enviar para casa",
    shippingNote: "Os portes dependem do peso e do destino e são confirmados antes do pagamento.",
    gift: "Embrulhar para oferta",
    nameLabel: "O seu nome",
    nameOptional: "(opcional)",
    namePlaceholder: "Como o devemos tratar",
    send: "Enviar encomenda",
    message:
      "Olá, Meada! {nome}Gostaria de encomendar:\n{linhas}\nTotal das peças: {total} + IVA.\nEntrega: {entrega}.{oferta}",
    messageName: "Sou {nome}. ",
    giftLine: "\nÉ para oferta, por favor embrulhem.",
    demoNote:
      "Demonstração: numa loja online feita pela Steevanz, o pagamento acontece no próprio site, com MB WAY, Multibanco ou cartão. Aqui, por ser um negócio fictício, a encomenda segue por WhatsApp para um número que não pertence a ninguém.",
    added: "{nome} juntou-se ao cesto.",
  },
  crafts: {
    eyebrow: "Os ofícios",
    title: "Quatro ofícios,",
    titleItalic: "um fio.",
    intro: "Trabalhamos com pequenas oficinas do Norte. Cada peça chega com uma etiqueta escrita à mão com o nome de quem a fez.",
    note: "Oficinas e artesãos fictícios, de um negócio de demonstração.",
    list: [
      {
        id: "linho",
        name: "Linho",
        nameItalic: "e bordado",
        text: "O linho de Guimarães, tecido e bordado em ponto de cruz, como nos enxovais de antigamente.",
        maker: "Bordadeira · Guimarães",
        media: { kind: "video", video: "bordado" },
        alt: "Uma agulha passa linha escura num pano de linho já com pontos de cruz bordados.",
      },
      {
        id: "barro",
        name: "Barro",
        nameItalic: "e grés",
        text: "Peças torneadas à roda, uma de cada vez. Cada jarro sai um pouco diferente do anterior.",
        maker: "Oleiro · Barcelos",
        media: { kind: "video", video: "barro" },
        alt: "Mãos sujas de barro a levantar uma peça na roda de oleiro, vista de cima.",
      },
      {
        id: "vime",
        name: "Vime",
        nameItalic: "e palha",
        text: "Cestos entrançados à mão, com a fibra húmida, a pensar no uso de todos os dias.",
        maker: "Cesteiro · Minho",
        media: { kind: "photo", image: "vimeTrama" },
        alt: "O fundo de um cesto de vime, com a fibra entrançada em espiral.",
      },
      {
        id: "la",
        name: "Lã",
        nameItalic: "e tear",
        text: "Mantas tecidas em teares manuais, fio a fio, em linho e lã da região.",
        maker: "Tecedeira · Guimarães",
        media: { kind: "photo", image: "mantaTear" },
        alt: "Uma manta tecida em tear, com riscas vermelhas e pretas sobre cru.",
      },
    ] satisfies MeadaCraft[] as MeadaCraft[],
  },
  card: {
    eyebrow: "Cartão de cliente digital",
    title: "Um ponto",
    titleItalic: "por cada compra.",
    intro: "O cartão de carimbos da Meada vive no telemóvel. Adere com um toque na placa ou lendo o QR code na caixa, sem app e sem papel.",
    steps: [
      { title: "Adere na caixa", text: "Um toque na placa ou o QR code, e o cartão fica no telemóvel, só com o seu nome." },
      { title: "Um ponto por compra", text: "A cada compra, a equipa lê o QR do seu cartão e dá o ponto." },
      { title: "Oito pontos, uma oferta", text: "Ao oitavo ponto, a oferta aparece no cartão, pronta a usar." },
    ],
    reward: "Ao 8.º ponto: um saco de linho Meada, oferecido.",
    rewardShort: "Saco de linho oferecido",
    phoneTitle: "Cartão Meada",
    phoneName: "Cartão de exemplo",
    phoneCount: "{n} de 8 pontos",
    phoneDone: "Oferta pronta a usar",
    phoneAlt: "Um telemóvel com o cartão de cliente da Meada: oito quadrados de linho, preenchidos com pontos de cruz vermelhos.",
    demoNote: "Regra e oferta de exemplo, de um negócio fictício.",
  },
  gallery: {
    eyebrow: "A casa",
    title: "No Largo,",
    titleItalic: "entre fios e barro.",
    photos: [
      { image: "chavenas", alt: "Chávenas pintadas à mão penduradas numa fila, contra uma parede creme." },
      { image: "embrulho", alt: "Um embrulho de papel pardo atado com cordel." },
      { image: "barroCru", alt: "Taças de barro cru, ainda por cozer, alinhadas numa tábua." },
      { image: "etiqueta", alt: "Etiquetas de papel kraft atadas com cordel de juta." },
      { image: "agulha", alt: "Uma agulha enfiada com linha vermelha sobre fundo branco." },
      { image: "lavanda", alt: "Uma jarra de louça azul e branca com lavanda seca, no parapeito de uma janela caiada." },
    ] satisfies { image: MeadaPhotoId; alt: string }[] as { image: MeadaPhotoId; alt: string }[],
  },
  marquee: ["Linho", "Barro", "Vime", "Lã", "Cera", "Grés", "Palha", "Bordado"],
  services: {
    eyebrow: "Encomendas",
    title: "Da loja",
    titleItalic: "até sua casa.",
    list: [
      { icon: "store", title: "Levantar na loja", text: "Encomende online e levante no Largo, sem custo, quando lhe der jeito." },
      { icon: "truck", title: "Envios para todo o país", text: "Peças frágeis bem protegidas. Os portes são confirmados antes do pagamento." },
      { icon: "gift", title: "Embrulho para oferta", text: "Papel kraft, fio vermelho e uma etiqueta escrita à mão, sem custo." },
    ] as { icon: "store" | "truck" | "gift"; title: string; text: string }[],
  },
  visit: {
    photoAlt: "Uma parede branca com prateleiras de madeira, quadros e peças de artesanato.",
    eyebrow: "Visitar",
    title: "A loja",
    titleItalic: "no Largo.",
    intro: "No centro histórico, a dois passos das ruas de pedra. Entre para ver as peças ao vivo, tocar no linho e levantar as encomendas.",
    addressLabel: "Morada",
    hoursLabel: "Horário",
    phoneLabel: "Telefone",
    phoneNote: "Número fictício, de demonstração",
    whatsappLabel: "WhatsApp",
    directions: "Como chegar",
    closedLabel: "Fechado",
    mapLabel: "Mapa ilustrado do centro histórico, com a loja Meada assinalada por um ponto de cruz vermelho no Largo das Tecedeiras.",
    demoContacts: "Contactos fictícios: o número não pertence a ninguém.",
  },
  team: {
    title: "Quem está ao balcão",
    people: [
      { name: "Inês", role: "Escolhe as peças e visita as oficinas" },
      { name: "Tomás", role: "Trata das encomendas e dos embrulhos" },
    ],
    note: "Equipa fictícia.",
  },
  review: {
    title: "Esteve cá? Deixe a sua avaliação.",
    text: "A sua opinião no Google ajuda outras pessoas a encontrar a loja e ajuda-nos a fazer melhor.",
    button: "Deixar avaliação no Google",
  },
  faq: {
    eyebrow: "Perguntas",
    title: "Antes de",
    titleItalic: "encomendar.",
    items: [
      {
        q: "As peças são iguais às das fotografias?",
        a: "São feitas à mão, por isso cada uma tem pequenas diferenças de cor, de forma e de tamanho. É isso que as torna únicas.",
      },
      {
        q: "Fazem envios para todo o país?",
        a: "Sim, para o continente e para as ilhas. Os portes dependem do peso e do destino, e confirmamos o valor antes do pagamento. Levantar na loja não tem custo.",
      },
      {
        q: "Posso devolver uma compra feita online?",
        a: "Sim. Tem 14 dias, a contar da entrega, para devolver uma compra feita à distância, como manda a lei. A peça deve vir como a recebeu.",
      },
      {
        q: "Fazem embrulho para oferta?",
        a: "Fazemos, sem custo: papel kraft, fio vermelho e uma etiqueta escrita à mão. Basta escolher «Embrulhar para oferta» no cesto ou pedir ao balcão.",
      },
      {
        q: "Como funciona o cartão de cliente?",
        a: "Adere na caixa com um toque na placa ou lendo o QR code. O cartão fica no telemóvel, sem app. A cada compra ganha um ponto e, ao oitavo, recebe um saco de linho Meada.",
      },
      {
        q: "Como posso pagar?",
        a: "Na loja: dinheiro, cartão ou MB WAY. Numa loja online feita pela Steevanz: MB WAY, Multibanco ou cartão, no próprio site. Neste site de demonstração as encomendas seguem por WhatsApp.",
      },
    ] satisfies MeadaFaq[] as MeadaFaq[],
  },
  footer: {
    tagline: "Casa & ofícios. Linho, barro, vime, lã e cera de pequenas oficinas do Norte.",
    hours: "Horário",
    contacts: "Contactos",
    rights: "Todos os direitos reservados.",
    complaints: "Livro de Reclamações",
    credit: "Site por Steevanz",
    fictional:
      "A Meada é um negócio fictício, criado pela Steevanz para mostrar como pode ser o site e a loja online de uma loja. Nome, logótipo, equipa, oficinas, morada, contactos, produtos e preços são inventados; as fotografias e os vídeos são de bancos de imagens gratuitos.",
    credits: "Fotografias: Pixabay. Vídeos: Mixkit.",
  },
  notFound: {
    title: "Esta página perdeu o fio.",
    text: "A página que procura não existe. Volte ao início e retome a meada.",
    back: "Voltar ao início",
  },
} as const;

export type MeadaCopy = typeof meadaCopy;

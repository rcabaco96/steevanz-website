// Texts of Platibanda's website, in European Portuguese. Platibanda is a FICTIONAL agency (see ./facts.ts): the
// services, their fees (always without VAT, with «+ IVA»), the guide and the team are made up for the demo. No
// ratings, no reviews, no testimonials, no customer numbers, no results promised. Kept free of imports for the tests.

export interface PlatibandaService {
  id: string;
  title: string;
  titleItalic: string;
  text: string;
  points: string[];
  /** The fee, without VAT («+ IVA» is shown next to it), or a plain line when there is no fee. */
  fee: string;
  feeVat: boolean;
  barra: "ocre" | "telha" | "anil";
}

export interface PlatibandaAgent {
  name: string;
  familyName: string;
  givenName: string;
  role: string;
  initials: string;
  text: string;
  /** Placeholder numbers: a range not given to anyone. */
  phone: string;
  email: string;
  languages: string;
}

export interface PlatibandaFaq {
  q: string;
  a: string;
}

export const platibandaCopy = {
  htmlLang: "pt-PT",
  ogLocale: "pt_PT",
  meta: {
    title: "Platibanda · Casas do Sotavento, em Tavira",
    description:
      "Comprar, arrendar e passar férias no Sotavento algarvio: casas em Tavira, Cabanas, Santa Luzia, Fuseta e Olhão. Site de demonstração da Steevanz para uma imobiliária fictícia.",
  },
  ogAlt: "O logótipo da Platibanda sobre uma fachada algarvia com platibanda, ao lado do rio Gilão ao fim da tarde.",
  skip: "Saltar para o conteúdo",
  newTab: "(abre num novo separador)",
  logoLabel: "Platibanda, casas do Sotavento",
  logoTagline: "Casas do Sotavento",
  demo: "Negócio fictício · site de demonstração",
  fictionalListing: "Imóvel fictício (exemplo)",
  photosNote: "Fotografias ilustrativas.",
  nav: {
    label: "Menu principal",
    listings: "Imóveis",
    sell: "Vender",
    holidays: "Férias",
    team: "Equipa",
    contact: "Contactos",
    visit: "Pedir visita",
    open: "Abrir o menu",
    close: "Fechar o menu",
    home: "Início",
  },
  hero: {
    kicker: "Imobiliária em Tavira · Sotavento algarvio",
    title: "Casas com platibanda, ria à porta.",
    lead: "Vendemos, arrendamos e cuidamos de casas entre Tavira, a ria e o barrocal.",
    primary: "Ver imóveis",
    secondary: "Vender a minha casa",
    scroll: "Descer",
    alt: "O rio Gilão em Tavira ao fim da tarde, visto do alto, com a ponte e as casas brancas das margens.",
    line: "Cada casa tem a sua platibanda.",
  },
  street: {
    eyebrow: "Em destaque",
    title: "Uma rua",
    titleItalic: "inteira de casas.",
    intro: "Algumas das casas que temos agora. Deslize pela rua e entre na que lhe interessa.",
    open: "Ver imóvel",
    all: "Ver todos os imóveis",
  },
  listings: {
    eyebrow: "Imóveis",
    title: "Comprar, arrendar",
    titleItalic: "ou passar férias.",
    intro: "Filtre por negócio, tipo de casa, zona, quartos e preço. Cada imóvel tem a sua página, com fotografias e o pedido de visita.",
    filtersLabel: "Filtrar imóveis",
    deal: "Negócio",
    all: "Todos",
    kind: "Tipo",
    kindAll: "Todos os tipos",
    zone: "Zona",
    zoneAll: "Todas as zonas",
    bedrooms: "Quartos",
    bedroomsAny: "Qualquer",
    bedroomsMin: "{n} ou mais",
    price: "Preço até",
    priceAny: "Sem limite",
    priceHint: "Escolha comprar, arrendar ou férias para filtrar pelo preço.",
    count: { one: "1 imóvel", many: "{n} imóveis" },
    empty: "Nenhum imóvel com estes filtros. Experimente alargar a procura.",
    clear: "Limpar filtros",
    open: "Ver imóvel",
    area: "m²",
    bedroomsShort: { one: "1 quarto", many: "{n} quartos" },
    bathroomsShort: { one: "1 casa de banho", many: "{n} casas de banho" },
    note: "Valores de exemplo de um negócio fictício. Os preços dos imóveis são os pedidos pelos proprietários.",
  },
  manifesto: {
    eyebrow: "A casa",
    text: "Em Tavira, cada casa acaba numa platibanda e cada porta tem a sua barra pintada. Conhecemos estas ruas porta a porta, e é assim que vendemos: devagar, com a verdade toda e a chave na mão.",
    alt: "Tavira vista do alto, com o casario branco, os telhados de telha e o rio.",
  },
  services: {
    eyebrow: "Para proprietários",
    title: "Vender, arrendar,",
    titleItalic: "cuidar da casa.",
    intro: "Trabalhamos com quem vende, com quem arrenda e com quem tem casas de férias. Tudo combinado por escrito antes de começar.",
    vatNote: "Valores sem IVA (acresce IVA à taxa legal).",
    demoNote: "Valores de exemplo de um negócio fictício.",
    plusVat: "+ IVA",
    cta: "Pedir uma avaliação",
    list: [
      {
        id: "vender",
        title: "Vender",
        titleItalic: "a sua casa",
        text: "Avaliamos a casa, preparamos as fotografias e a página do imóvel, mostramos a casa a quem a quer mesmo ver e acompanhamos tudo até à escritura.",
        points: ["Avaliação no local, sem custo", "Fotografias e página própria do imóvel", "Visitas acompanhadas", "Apoio até à escritura"],
        fee: "Comissão definida no contrato de mediação, antes de começarmos",
        feeVat: true,
        barra: "ocre",
      },
      {
        id: "arrendar",
        title: "Arrendar",
        titleItalic: "todo o ano",
        text: "Encontramos o inquilino certo para arrendamentos de longa duração: visitas, análise de candidaturas, contrato e entrega das chaves.",
        points: ["Anúncio e visitas", "Análise das candidaturas", "Contrato e vistoria de entrada", "Entrega das chaves"],
        fee: "O valor de uma renda mensal, pago só quando o contrato é assinado",
        feeVat: true,
        barra: "telha",
      },
      {
        id: "cuidar",
        title: "Cuidar",
        titleItalic: "da casa de férias",
        text: "Gerimos o seu alojamento local: reservas, check-in, limpeza e roupa entre estadias, pequenas reparações e um guia digital dentro da casa para os hóspedes.",
        points: ["Check-in à chegada", "Limpeza e roupa de cama", "Pequenas reparações", "Guia digital na casa, em quatro línguas"],
        fee: "Desde 95 €/mês por alojamento; limpeza e roupa 45 € por saída",
        feeVat: true,
        barra: "anil",
      },
    ] satisfies PlatibandaService[],
  },
  holidays: {
    eyebrow: "Férias e alojamento local",
    title: "Chegar, abrir a porta",
    titleItalic: "e saber tudo.",
    intro: "Nas casas de férias que gerimos, o hóspede encontra um guia digital à entrada: um toque do telemóvel na placa, ou o QR impresso nela, e abre o WiFi, o check-in, as regras da casa e as nossas sugestões, na língua do telemóvel.",
    points: [
      { title: "WiFi num toque", text: "O nome da rede e a palavra-passe com um botão para copiar." },
      { title: "Check-in e check-out", text: "Horas, onde deixar as chaves, o lixo e a reciclagem." },
      { title: "Regras da casa", text: "Ruído, piscina, animais: tudo escrito, sem mensagens a meio da noite." },
      { title: "As nossas sugestões", text: "Praias, barcos para as ilhas, mercados e onde comer." },
    ],
    never: "O guia nunca tem códigos de portas, de cofres ou do alarme: esses seguem na mensagem de check-in.",
    videoAlt: "Alpendre de madeira e pedra com espreguiçadeiras à beira de uma piscina, a água a mexer devagar.",
    phoneLabel: "Exemplo do guia digital de uma casa de férias fictícia",
    guide: {
      house: "Casa da Ria",
      place: "Fuseta",
      langs: ["PT", "EN", "FR", "DE"],
      welcome: "Bem-vindos! Fiquem à vontade.",
      wifiLabel: "WiFi",
      wifiNetwork: "CasaDaRia",
      wifiPassword: "••••••••",
      copy: "Copiar",
      checkin: "Check-in a partir das 16:00",
      checkout: "Check-out até às 11:00",
      sections: [
        { title: "Chegada", text: "As chaves são entregues à porta por alguém da nossa equipa." },
        { title: "Lixo e reciclagem", text: "Ecopontos no fim da rua, à esquerda." },
        { title: "Regras da casa", text: "Silêncio depois das 23:00. Não se fuma dentro de casa." },
        { title: "Praias", text: "Barco para a ilha a partir do cais, a três minutos a pé." },
        { title: "Mercado", text: "Peixe fresco de manhã, no mercado da vila." },
        { title: "Emergência", text: "112 · Farmácia de serviço afixada no centro." },
      ],
    },
    cta: "Ver casas de férias",
    note: "Exemplo de guia de uma casa fictícia.",
  },
  team: {
    eyebrow: "Equipa",
    title: "Quem lhe abre",
    titleItalic: "a porta.",
    intro: "Cada um de nós tem um cartão de visita digital: um toque do telemóvel no cartão, ou o QR impresso nele, e o contacto fica guardado. Aqui, o mesmo num botão.",
    note: "Equipa fictícia, criada para esta demonstração.",
    save: "Guardar contacto",
    call: "Ligar",
    whatsapp: "WhatsApp",
    cardBack: "Toque ou QR",
    languages: "Fala",
    list: [
      {
        name: "Marta Gonçalves",
        familyName: "Gonçalves",
        givenName: "Marta",
        role: "Consultora · venda",
        initials: "MG",
        text: "Avalia as casas e acompanha cada venda, da primeira visita à escritura.",
        phone: "+351 900 000 001",
        email: "marta@platibanda.example",
        languages: "Português, inglês e francês",
      },
      {
        name: "Rui Palma",
        familyName: "Palma",
        givenName: "Rui",
        role: "Consultor · arrendamento",
        initials: "RP",
        text: "Trata dos arrendamentos de longa duração: candidaturas, contratos e vistorias.",
        phone: "+351 900 000 002",
        email: "rui@platibanda.example",
        languages: "Português, inglês e espanhol",
      },
      {
        name: "Sofia Carmo",
        familyName: "Carmo",
        givenName: "Sofia",
        role: "Alojamento local",
        initials: "SC",
        text: "Cuida das casas de férias, dos hóspedes e dos guias digitais de cada casa.",
        phone: "+351 900 000 003",
        email: "sofia@platibanda.example",
        languages: "Português, inglês e alemão",
      },
    ] satisfies PlatibandaAgent[],
  },
  places: ["Tavira", "Cabanas", "Santa Luzia", "Conceição", "Fuseta", "Olhão", "Cacela", "Santa Catarina"],
  contact: {
    eyebrow: "Contactos",
    title: "Passe pela loja",
    titleItalic: "ou escreva-nos.",
    intro: "Estamos no centro de Tavira. Para pedir uma visita, uma avaliação ou uma casa para férias, escreva-nos ou ligue.",
    alt: "Os paços do concelho de Tavira, de arcadas brancas, numa praça empedrada ao sol.",
    addressLabel: "Morada",
    hoursLabel: "Horário",
    phoneLabel: "Telefone",
    phoneNote: "Número de demonstração, sem dono.",
    directions: "Como chegar",
    closedLabel: "Fechado",
    demoNote: "Demonstração: os contactos deste negócio fictício não pertencem a ninguém.",
    form: {
      title: "O que procura?",
      reasons: ["Comprar casa", "Arrendar casa", "Vender a minha casa", "Casa para férias", "Gestão da minha casa de férias"],
      reasonLabel: "Assunto",
      name: "Nome",
      namePlaceholder: "O seu nome",
      message: "Mensagem",
      messagePlaceholder: "Zona, tipo de casa, datas…",
      send: "Enviar pelo WhatsApp",
      call: "Ou ligue",
      note: "Abre o WhatsApp com a mensagem escrita; só é enviada quando carregar em enviar.",
      error: "Escreva o seu nome, por favor.",
    },
  },
  review: {
    title: "Deixe a sua avaliação",
    text: "Comprou, arrendou ou passou férias numa casa nossa? Conte como foi no Google. Ajuda quem procura casa no Sotavento.",
    button: "Avaliar no Google",
  },
  faq: {
    eyebrow: "Perguntas",
    title: "Antes de",
    titleItalic: "pedir a chave.",
    list: [
      {
        q: "Como peço uma visita a um imóvel?",
        a: "Na página do imóvel, carregue em «Pedir visita»: abre o WhatsApp com a referência já escrita. Também pode ligar ou passar pela loja.",
      },
      {
        q: "A avaliação da minha casa tem custo?",
        a: "Não. Vamos ao local, vemos a casa e dizemos-lhe por quanto achamos que se vende, sem compromisso.",
      },
      {
        q: "Os valores dos serviços incluem IVA?",
        a: "Não. Os valores dos nossos serviços são apresentados sem IVA; acresce IVA à taxa legal. Os preços dos imóveis são os pedidos pelos proprietários.",
      },
      {
        q: "O que é o guia digital das casas de férias?",
        a: "Uma página para o telemóvel com o WiFi, o check-in, as regras da casa e as nossas sugestões. Abre com um toque numa placa dentro da casa ou pelo QR, sem instalar nada.",
      },
      {
        q: "Trabalham só em Tavira?",
        a: "Trabalhamos no Sotavento: Tavira, Cabanas, Santa Luzia, Conceição, Fuseta, Olhão, Cacela e o barrocal à volta.",
      },
    ] satisfies PlatibandaFaq[],
  },
  listing: {
    back: "Todos os imóveis",
    ref: "Referência",
    price: "Preço",
    deal: "Negócio",
    kind: "Tipo",
    typology: "Tipologia",
    area: "Área bruta privativa",
    plot: "Terreno",
    bedrooms: "Quartos",
    bathrooms: "Casas de banho",
    energy: "Classe energética",
    guests: "Hóspedes",
    minNights: "Estadia mínima",
    nights: "{n} noites",
    zone: "Zona",
    features: "O que tem",
    about: "Sobre a casa",
    gallery: "Fotografias",
    photoOf: "Fotografia {i} de {n}",
    previous: "Fotografia anterior",
    next: "Fotografia seguinte",
    openPhoto: "Ver em ecrã inteiro",
    closePhoto: "Fechar",
    guide: "Guia digital incluído: o hóspede abre o WiFi, o check-in e as regras com um toque numa placa à entrada.",
    visit: {
      title: "Pedir visita",
      intro: "Diga-nos quando lhe dá jeito. Respondemos no próprio dia útil.",
      holidayTitle: "Pedir disponibilidade",
      holidayIntro: "Diga-nos as datas e quantas pessoas. Respondemos no próprio dia útil.",
      when: "Quando prefere",
      whenOptions: ["Esta semana, de manhã", "Esta semana, à tarde", "Ao sábado de manhã", "Qualquer dia"],
      dates: "Datas e pessoas",
      datesPlaceholder: "Ex.: 10 a 17 de julho, 4 pessoas",
      name: "Nome",
      namePlaceholder: "O seu nome",
      send: "Pedir visita pelo WhatsApp",
      sendHoliday: "Pedir pelo WhatsApp",
      call: "Ligar",
      note: "Abre o WhatsApp com a mensagem escrita; só é enviada quando carregar em enviar.",
      error: "Escreva o seu nome, por favor.",
    },
    more: "Outros imóveis",
    shareNote: "Valores de exemplo de um negócio fictício.",
  },
  footer: {
    tagline: "Imobiliária e gestão de alojamento local no Sotavento algarvio.",
    hours: "Horário",
    contacts: "Contactos",
    fictional:
      "Platibanda é um negócio fictício, criado pela Steevanz para demonstrar um site de imobiliária. Os imóveis, os preços, a equipa e os contactos são exemplos; as fotografias são ilustrativas.",
    rights: "Todos os direitos reservados.",
    complaints: "Livro de Reclamações",
    credit: "Site por Steevanz",
    credits: "Fotografias e vídeos: Pexels.",
  },
  notFound: {
    title: "Esta porta não abre.",
    text: "A página que procura não existe ou o imóvel já não está disponível.",
    back: "Voltar ao início",
  },
} as const;

export type PlatibandaCopy = typeof platibandaCopy;

/** «{n} ou mais» + { n: 2 } → «2 ou mais». The texts hold no functions, so they can be handed to client components. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ""));
}

/** The singular or the plural form of a text, with the number filled in. */
export function plural(forms: { one: string; many: string }, n: number): string {
  return fill(n === 1 ? forms.one : forms.many, { n });
}

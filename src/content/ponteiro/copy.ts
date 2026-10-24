// Texts of Ponteiro's website, in European Portuguese. Ponteiro is a FICTIONAL business (see ./facts.ts): the
// dishes, the prices (always without VAT, with «+ IVA»), the hours and the team are made up for the demo. No ratings,
// no reviews, no testimonials, no customer numbers, no results promised. Kept free of imports for the unit tests.

import type { PonteiroPhotoId } from "./facts";

export interface PonteiroItem {
  name: string;
  note?: string;
  /** Euros, without VAT. */
  price: number;
}

export interface PonteiroGroup {
  title: string;
  items: PonteiroItem[];
}

export interface PonteiroTab {
  id: string;
  label: string;
  hours: string;
  intro: string;
  image: PonteiroPhotoId;
  alt: string;
  groups: PonteiroGroup[];
}

export interface PonteiroMoment {
  id: string;
  /** Minutes since midnight: where the clock hand stands for this moment. */
  minutes: number;
  name: string;
  title: string;
  text: string;
  serves: string[];
  image: PonteiroPhotoId;
  alt: string;
}

export interface PonteiroShelfItem {
  name: string;
  price: number;
  image: PonteiroPhotoId;
  alt: string;
}

export interface PonteiroPerson {
  time: string;
  name: string;
  role: string;
  text: string;
}

export interface PonteiroFaq {
  q: string;
  a: string;
}

export const ponteiroCopy = {
  htmlLang: "pt-PT",
  ogLocale: "pt_PT",
  meta: {
    title: "Ponteiro · Café, cozinha e bar no Porto",
    description:
      "Pastéis de nata às 7:30, prato do dia ao almoço, forno a lenha ao jantar e o bar até tarde, no Bonfim. Site de demonstração da Steevanz para um negócio fictício.",
  },
  ogAlt: "O logótipo do Ponteiro, um relógio dentro da letra p, ao lado de um café a cair da máquina.",
  skip: "Saltar para o conteúdo",
  newTab: "(abre num novo separador)",
  logoLabel: "Ponteiro, café, cozinha e bar",
  demo: "Negócio fictício · site de demonstração",
  nav: {
    label: "Menu principal",
    day: "O dia",
    carta: "Carta",
    menu: "Menu digital",
    casa: "A casa",
    book: "Reservar",
    open: "Abrir o menu",
    close: "Fechar o menu",
  },
  clock: {
    label: "A hora da casa, ao longo da página",
  },
  opening: {
    sign: "Abre às 7:30",
  },
  hero: {
    kicker: "Café · Cozinha · Bar — Bonfim, Porto",
    title: "Do primeiro café ao último copo.",
    lead: "Às 7:30 sai o primeiro tabuleiro de pastéis de nata. Ao almoço há prato do dia, ao jantar o forno a lenha, e à noite o balcão vira bar.",
    book: "Reservar mesa",
    carta: "Ver a carta",
    scroll: "Descer",
    alt: "Um café expresso a cair da máquina para um copo, no balcão.",
    triptych: [
      { time: "07:30", label: "Café e pastelaria", alt: "Um expresso a cair da máquina para um copo." },
      { time: "13:00", label: "Cozinha e forno a lenha", alt: "Lenha a arder dentro de um forno." },
      { time: "22:00", label: "Bar", alt: "Uma bebida servida num copo baixo, ao balcão do bar." },
    ],
    tripTitle: "Uma casa,",
    tripTitleItalic: "o dia inteiro.",
  },
  day: {
    eyebrow: "O dia no Ponteiro",
    title: "Quatro horas,",
    titleItalic: "uma só casa.",
    intro: "O relógio da sala manda em tudo: o que sai do forno, o que se serve à mesa e a luz que fica acesa ao balcão.",
    moments: [
      {
        id: "manha",
        minutes: 450,
        name: "Manhã",
        title: "O balcão abre com o forno quente.",
        text: "Bica, galão e torradas de pão alentejano. Os pastéis de nata saem em tabuleiros ao longo da manhã, ainda mornos.",
        serves: ["Bica e galão", "Pastel de nata", "Torradas", "Croissant de manteiga"],
        image: "nataTabuleiro",
        alt: "Um tabuleiro de pastéis de nata acabados de sair do forno.",
      },
      {
        id: "almoco",
        minutes: 750,
        name: "Almoço",
        title: "Prato do dia, sopa e café.",
        text: "Cozinha portuguesa de tacho e de forno, com um prato diferente em cada dia da semana e pratos da carta para quem tem tempo.",
        serves: ["Prato do dia", "Bacalhau à Brás", "Polvo no forno", "Sardinhas na época"],
        image: "polvo",
        alt: "Um tentáculo de polvo assado com batatas e azeite.",
      },
      {
        id: "lanche",
        minutes: 990,
        name: "Lanche",
        title: "A vitrine à hora do lanche.",
        text: "Bolos da casa à fatia, chocolate quente com natas e mesas junto à janela para ficar um bocado.",
        serves: ["Bolo de laranja", "Bolo de chocolate", "Chocolate quente", "Chá"],
        image: "boloLaranja",
        alt: "Uma fatia de bolo de laranja num prato com gomos de laranja.",
      },
      {
        id: "noite",
        minutes: 1320,
        name: "Noite",
        title: "Jantar, e depois o bar.",
        text: "O forno a lenha serve o jantar até às 22:30. Depois as luzes baixam, o balcão vira bar e fica aberto até à meia-noite (às sextas e sábados, até às duas).",
        serves: ["Porto tónico", "Negroni", "Ginjinha", "Copo de vinho do Douro"],
        image: "cocktail",
        alt: "Um cocktail de cor âmbar num copo, com uma rodela de laranja seca.",
      },
    ] satisfies PonteiroMoment[],
  },
  carta: {
    eyebrow: "A carta",
    title: "Do balcão,",
    titleItalic: "da cozinha e do bar.",
    intro: "Uma carta curta, que muda com a época. Os preços são por pessoa ou por peça, sem IVA.",
    vatNote: "Preços sem IVA (acresce IVA à taxa legal).",
    demoNote: "Valores de exemplo de um negócio fictício.",
    plusVat: "+ IVA",
    tabsLabel: "Partes da carta",
    tabs: [
      {
        id: "balcao",
        label: "Balcão",
        hours: "Das 7:30 ao fecho",
        intro: "Café de lote da casa, leite do dia e a pastelaria feita aqui, de madrugada.",
        image: "nataPires",
        alt: "Um pastel de nata num pires branco.",
        groups: [
          {
            title: "Cafetaria",
            items: [
              { name: "Bica", price: 0.8 },
              { name: "Galão", price: 1.4 },
              { name: "Meia de leite", price: 1.3 },
              { name: "Cappuccino", price: 2.2 },
              { name: "Chocolate quente com natas", price: 2.8 },
            ],
          },
          {
            title: "Pastelaria",
            items: [
              { name: "Pastel de nata", note: "a sair do forno toda a manhã", price: 1.2 },
              { name: "Croissant de manteiga", price: 1.6 },
              { name: "Torrada de pão alentejano", price: 2.2 },
              { name: "Bolo de laranja, à fatia", price: 2.4 },
              { name: "Bolo de chocolate e natas, à fatia", price: 3.2 },
            ],
          },
        ],
      },
      {
        id: "cozinha",
        label: "Cozinha",
        hours: "12:00–15:00 · 19:30–22:30",
        intro: "Tachos ao almoço, forno a lenha ao jantar. O prato do dia muda de terça a domingo.",
        image: "bras",
        alt: "Uma frigideira de bacalhau à Brás com salsa.",
        groups: [
          {
            title: "Ao almoço",
            items: [
              { name: "Menu do dia", note: "sopa, prato do dia, bebida e café", price: 11.5 },
              { name: "Caldo verde", price: 3 },
              { name: "Bitoque com ovo e batata frita", price: 12 },
            ],
          },
          {
            title: "Da carta",
            items: [
              { name: "Pataniscas com arroz de feijão", price: 12.5 },
              { name: "Bacalhau à Brás", price: 13.5 },
              { name: "Sardinhas assadas", note: "na época", price: 13 },
              { name: "Polvo no forno a lenha com batata a murro", price: 18.5 },
              { name: "Arroz doce", price: 3.5 },
            ],
          },
        ],
      },
      {
        id: "bar",
        label: "Bar",
        hours: "Das 22:00 ao fecho",
        intro: "Vinhos do Douro a copo, cocktails clássicos e os licores que se pedem ao balcão.",
        image: "gin",
        alt: "Um gin tónico com lima, num copo com gelo, sobre uma tábua.",
        groups: [
          {
            title: "Cocktails",
            items: [
              { name: "Porto tónico", price: 6.5 },
              { name: "Gin tónico", price: 8 },
              { name: "Negroni", price: 9 },
              { name: "Meia-noite", note: "o cocktail da casa: Porto tawny, café e laranja", price: 9.5 },
            ],
          },
          {
            title: "Ao copo",
            items: [
              { name: "Fino", price: 1.8 },
              { name: "Copo de vinho do Douro", price: 3.5 },
              { name: "Ginjinha", price: 2 },
            ],
          },
        ],
      },
    ] satisfies PonteiroTab[],
  },
  prato: {
    label: "Prato do dia",
    todayIs: "Hoje é",
    closed: "Hoje estamos fechados. Até amanhã!",
    week: [
      { weekday: 2, day: "Terça", dish: "Arroz de pato" },
      { weekday: 3, day: "Quarta", dish: "Bacalhau à Brás" },
      { weekday: 4, day: "Quinta", dish: "Rojões à moda do Minho" },
      { weekday: 5, day: "Sexta", dish: "Polvo no forno" },
      { weekday: 6, day: "Sábado", dish: "Cozido à portuguesa" },
      { weekday: 0, day: "Domingo", dish: "Cabrito no forno a lenha" },
    ],
    note: "Faz parte do menu do dia, ao almoço.",
  },
  vitrine: {
    eyebrow: "A vitrine",
    title: "Feito aqui,",
    titleItalic: "de madrugada.",
    intro: "Tudo o que está na vitrine sai do nosso forno antes de abrirmos a porta. Quando acaba, acabou.",
    shelves: [
      [
        { name: "Pastel de nata", price: 1.2, image: "nataMontra", alt: "Pastéis de nata alinhados numa montra." },
        { name: "Croissant de manteiga", price: 1.6, image: "croissants", alt: "Um cesto de croissants dourados." },
        { name: "Bolo de chocolate e natas", price: 3.2, image: "boloChocolateNatas", alt: "Uma fatia de bolo de chocolate com natas e cerejas." },
        { name: "Pastel de nata", price: 1.2, image: "nataMacro", alt: "Pastéis de nata vistos de perto." },
      ],
      [
        { name: "Bolo de laranja", price: 2.4, image: "boloLaranja", alt: "Uma fatia de bolo de laranja." },
        { name: "Croissant de manteiga", price: 1.6, image: "croissantPrato", alt: "Croissants num prato, sobre um pano de linho." },
        { name: "Bolo de chocolate", price: 3.2, image: "boloChocolate", alt: "Uma fatia de bolo de chocolate com um morango." },
        { name: "Chocolate quente com natas", price: 2.8, image: "chocolateQuente", alt: "Uma chávena de chocolate quente com natas e canela." },
      ],
    ] satisfies PonteiroShelfItem[][],
  },
  menu: {
    eyebrow: "Menu digital",
    title: "Veja o prato",
    titleItalic: "antes de pedir.",
    sentence: "Em cada mesa há um código. Basta apontar a câmara, ou encostar o telemóvel à placa, e a carta abre com cada prato em vídeo, na língua de quem a lê.",
    points: [
      { title: "Com um toque ou QR", text: "Sem aplicação e sem esperar pela carta de papel." },
      { title: "Cada prato em vídeo", text: "Vê-se o polvo a sair do forno antes de o pedir." },
      { title: "Em várias línguas", text: "Quem nos visita lê a carta na sua língua." },
    ],
    button: "Abrir um Menu digital de exemplo",
    note: "O telemóvel mostra um Menu digital de demonstração da Steevanz, de outro negócio fictício.",
    phoneLabel: "Gravação de um Menu digital de demonstração a ser percorrido num telemóvel.",
  },
  reservas: {
    eyebrow: "Reservas",
    title: "Guarde já",
    titleItalic: "a sua mesa.",
    intro: "Escolha o dia, a refeição, a hora e quantos são. O pedido segue por mensagem e respondemos a confirmar.",
    step1: "Dia",
    step2: "Refeição",
    step3: "Hora",
    step4: "Pessoas",
    step5: "Nome",
    nameOptional: "(opcional)",
    namePlaceholder: "Como se chama?",
    meals: { almoco: "Almoço", jantar: "Jantar" },
    closedNote: "À segunda-feira estamos fechados; ao domingo só servimos almoço.",
    peopleMore: "8 ou mais",
    peopleNote: "Para grupos de 8 ou mais, ligue-nos: juntamos as mesas.",
    summary: "O seu pedido",
    pending: "Escolha o dia, a refeição, a hora e quantos são.",
    send: "Pedir por WhatsApp",
    call: "Ligar",
    message: "Olá! {nome}Queria reservar mesa para {pessoas} ao {refeicao} de {dia}, às {hora}. Obrigado!",
    messageName: "Sou {nome}. ",
    personOne: "1 pessoa",
    personMany: "{n} pessoas",
    demoNote:
      "Demonstração: o pedido abre uma mensagem para um número que não pertence a ninguém. Num restaurante a sério, as reservas podem entrar logo numa agenda online, com confirmação e lembrete por email.",
  },
  espera: {
    eyebrow: "Lista de espera",
    title: "Sem reserva?",
    titleItalic: "Não fique à porta.",
    intro: "Ao fim de semana a sala enche. À entrada há uma placa: entra na lista de espera com um toque ou pelo código, e vai dar uma volta ao Bonfim.",
    steps: [
      { title: "Entra na lista", text: "Lê o código à porta ou toca na placa. Não precisa de instalar nada." },
      { title: "Vê quanto falta", text: "O telemóvel mostra a senha que está a ser chamada e o tempo estimado." },
      { title: "Avisamos quando a mesa estiver pronta", text: "O telemóvel toca e é só voltar." },
    ],
    phone: {
      title: "Lista de espera",
      ticket: "A sua senha",
      waiting: "À espera",
      eta: "Tempo estimado",
      etaValue: "15 min",
      ready: "A sua mesa está pronta",
      readyText: "Dirija-se à entrada.",
    },
    illustration: "Ilustração da lista de espera no telemóvel (valores de exemplo).",
  },
  casa: {
    eyebrow: "A casa",
    title: "Quem dá corda",
    titleItalic: "ao relógio.",
    text: "O Ponteiro é o café do bairro que não quis fechar à hora de almoço, nem ao jantar. Uma sala comprida, um balcão de mármore de ponta a ponta e um relógio de parede que nunca se atrasou.",
    team: [
      { time: "05:30", name: "Rosa", role: "Pastelaria", text: "Acende o forno e tende a massa folhada antes de o bairro acordar." },
      { time: "07:30", name: "Tiago", role: "Balcão", text: "Abre a porta, tira a primeira bica e sabe de cor como cada vizinho gosta do galão." },
      { time: "11:00", name: "Duarte", role: "Cozinha", text: "Escolhe o peixe no mercado e decide o prato do dia pelo que encontrou." },
      { time: "21:30", name: "Inês", role: "Bar", text: "Troca a máquina de café pelos copos baixos e inventou o cocktail «Meia-noite»." },
    ] satisfies PonteiroPerson[],
    note: "Equipa fictícia de um negócio fictício.",
    filmAlt: "O balcão comprido de um café, com pessoas sentadas ao fundo, contra a luz da janela.",
  },
  marquee: ["Bica", "Pastel de nata", "Prato do dia", "Forno a lenha", "Porto tónico", "Ginjinha", "Galão", "Até tarde"],
  review: {
    title: "Esteve cá?",
    text: "Diga-nos como foi. Uma avaliação no Google ajuda o bairro a encontrar-nos e a nós a fazer melhor.",
    button: "Deixe a sua avaliação",
  },
  faq: {
    eyebrow: "Perguntas",
    title: "Antes de",
    titleItalic: "vir.",
    items: [
      { q: "É preciso reservar?", a: "Ao almoço e ao jantar recomendamos, sobretudo de quinta a sábado. Para o café, o lanche e o bar não é preciso: e se a sala estiver cheia, há lista de espera." },
      { q: "Servem refeições a qualquer hora?", a: "A cozinha serve das 12:00 às 15:00 e das 19:30 às 22:30. Fora dessas horas há sempre pastelaria, torradas e tostas ao balcão." },
      { q: "Há opções vegetarianas?", a: "Há sempre uma sopa e um prato vegetariano no dia. Diga-nos também se tem alguma alergia: a carta indica os alergénios de cada prato." },
      { q: "Posso fazer uma encomenda de pastéis de nata?", a: "Pode. Peça com um dia de antecedência por telefone ou mensagem, e levante ao balcão a partir das 7:30." },
      { q: "Fazem jantares de grupo?", a: "Sim, até 24 pessoas na sala do fundo, com um menu fechado. Ligue-nos para combinarmos." },
      { q: "Aceitam animais?", a: "Na esplanada, sempre. Lá dentro, cães pequenos ao colo ou à trela, fora das horas de refeição." },
    ] satisfies PonteiroFaq[],
  },
  visit: {
    eyebrow: "Visitar",
    addressLabel: "Morada",
    hoursLabel: "Horário",
    phoneLabel: "Telefone",
    phoneNote: "Chamada para a rede fixa nacional",
    whatsappLabel: "WhatsApp",
    directions: "Como chegar",
    mapLabel: "Mapa ilustrado do Bonfim com a posição do Ponteiro.",
    closedLabel: "Fechado",
  },
  closing: {
    title: "Até amanhã.",
    line: "Às 7:30 levantamos a porta, com o primeiro tabuleiro de pastéis de nata a sair do forno.",
    shutterSign: "Abre às 7:30",
  },
  footer: {
    tagline: "Café, cozinha e bar no Bonfim, do primeiro café ao último copo.",
    hours: "Horário",
    contacts: "Contactos",
    fictional:
      "O Ponteiro é um negócio fictício, criado pela Steevanz para mostrar um site de restauração: o nome, a equipa, a morada, os pratos e os preços são inventados e os contactos não pertencem a ninguém.",
    rights: "Todos os direitos reservados.",
    credits: "Fotografias e vídeos: Pixabay (licença de conteúdo Pixabay).",
    complaints: "Livro de Reclamações",
    credit: "Site por Steevanz",
  },
  notFound: {
    title: "Esta página já fechou.",
    text: "O endereço não existe, mas a casa continua aberta.",
    back: "Voltar ao Ponteiro",
  },
};

export type PonteiroCopy = typeof ponteiroCopy;

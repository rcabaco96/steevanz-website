// Texts of Orvé's website, in European Portuguese. Orvé is a FICTIONAL business (see ./facts.ts): the treatments,
// durations, prices (always without VAT, with «+ IVA») and the team are made up for the demo. No ratings, no
// reviews, no testimonials, no customer numbers, no results promised. Kept free of imports for the unit tests.

import type { OrvePhotoId } from "./facts";

export interface OrveTreatment {
  name: string;
  note?: string;
  minutes: number;
  /** Euros, without VAT. */
  price: number;
}

export interface OrveRitual {
  id: string;
  number: string;
  title: string;
  titleItalic: string;
  intro: string;
  image: OrvePhotoId;
  alt: string;
  treatments: OrveTreatment[];
}

export interface OrveStep {
  title: string;
  text: string;
  minutes: number;
  image: OrvePhotoId | "vaporVideo";
  alt: string;
}

export interface OrvePerson {
  /** Where the picture is centred inside the drop (CSS object-position). */
  focus?: string;
  name: string;
  role: string;
  text: string;
  image: OrvePhotoId;
  alt: string;
}

export interface OrveFaq {
  q: string;
  a: string;
}

export const orveCopy = {
  htmlLang: "pt-PT",
  ogLocale: "pt_PT",
  meta: {
    title: "Orvé · Atelier de pele e beleza em Lisboa",
    description:
      "Rituais de rosto e corpo, unhas, sobrancelhas e pestanas, depilação e maquilhagem, sem pressa, no Príncipe Real. Site de demonstração da Steevanz para um negócio fictício.",
  },
  ogAlt: "O logótipo da Orvé ao lado de uma cliente de olhos fechados durante um cuidado do olhar.",
  skip: "Saltar para o conteúdo",
  newTab: "(abre num novo separador)",
  logoLabel: "Orvé, atelier de pele e beleza",
  demo: "Negócio fictício · site de demonstração",
  nav: {
    label: "Menu principal",
    rituals: "Rituais",
    ritual: "O ritual",
    house: "A casa",
    team: "Equipa",
    book: "Marcar",
    open: "Abrir o menu",
    close: "Fechar o menu",
  },
  hero: {
    kicker: "Atelier de pele e beleza · Príncipe Real",
    title: "A pele, ao amanhecer.",
    lead: "Rosto, corpo, unhas, olhar e depilação, feitos sem pressa numa casa cheia de luz.",
    book: "Marcar tratamento",
    prices: "Rituais e preços",
    scroll: "Descer",
    alt: "Uma esteticista aplica uma máscara de hidratação no rosto de uma cliente deitada.",
    lens: "Cada ritual começa com uma pausa.",
    ring: "hidratação · luz · calma · pele · tempo · ",
  },
  manifesto: {
    eyebrow: "A casa",
    text: "Acreditamos numa beleza sem pressa: pele bem tratada, gestos precisos e todo o tempo que for preciso para sair daqui mais leve do que entrou.",
  },
  rituals: {
    eyebrow: "Rituais e preços",
    title: "Escolha o seu",
    titleItalic: "ritual.",
    intro: "Seis famílias de cuidados, cada uma com o tempo que precisa. Na dúvida, comece por uma conversa: dizemos-lhe com franqueza o que faz sentido para a sua pele.",
    vatNote: "Preços sem IVA (acresce IVA à taxa legal).",
    demoNote: "Valores de exemplo de um negócio fictício.",
    plusVat: "+ IVA",
    book: "Marcar este ritual",
    jump: "Ir para",
    list: [
      {
        id: "rosto",
        number: "01",
        title: "Rosto",
        titleItalic: "e pele",
        intro: "Limpeza, hidratação e massagem para uma pele que respira. O nosso ritual da casa nasce aqui.",
        image: "rosto",
        alt: "Esteticista aplica com um pincel uma máscara no rosto de uma cliente.",
        treatments: [
          { name: "Hidratação «Orvalho»", note: "o ritual da casa", minutes: 60, price: 48 },
          { name: "Limpeza de pele profunda", minutes: 75, price: 55 },
          { name: "Peeling suave de frutos", minutes: 45, price: 42 },
          { name: "Massagem facial esculpida", minutes: 45, price: 40 },
          { name: "Luz LED", note: "complemento a qualquer ritual de rosto", minutes: 20, price: 15 },
        ],
      },
      {
        id: "corpo",
        number: "02",
        title: "Corpo",
        titleItalic: "e massagem",
        intro: "Óleos mornos, mãos atentas e o silêncio de uma cabine só sua.",
        image: "corpo",
        alt: "Óleo de massagem a escorrer sobre as costas de uma cliente deitada.",
        treatments: [
          { name: "Massagem relaxante", minutes: 50, price: 45 },
          { name: "Massagem com pedras quentes", minutes: 75, price: 62 },
          { name: "Drenagem linfática manual", minutes: 60, price: 50 },
          { name: "Esfoliação e envolvimento corporal", minutes: 60, price: 52 },
        ],
      },
      {
        id: "maos",
        number: "03",
        title: "Mãos",
        titleItalic: "e pés",
        intro: "Unhas cuidadas por quem tem tempo para os detalhes, do clássico ao gel.",
        image: "maos",
        alt: "Vista de cima de uma manicure a pintar as unhas de uma cliente, com flores na mesa.",
        treatments: [
          { name: "Manicure clássica", minutes: 40, price: 15 },
          { name: "Verniz gel nas mãos", minutes: 60, price: 24 },
          { name: "Pedicure com banho de pés", minutes: 60, price: 28 },
          { name: "Remoção de gel", minutes: 20, price: 8 },
        ],
      },
      {
        id: "olhar",
        number: "04",
        title: "Sobrancelhas",
        titleItalic: "e pestanas",
        intro: "Desenho, laminação e lifting para um olhar descansado, sem exageros.",
        image: "olhar",
        alt: "Uma cliente de olhos fechados enquanto lhe aplicam um produto na pálpebra.",
        treatments: [
          { name: "Design de sobrancelhas", minutes: 30, price: 14 },
          { name: "Laminação de sobrancelhas", minutes: 45, price: 32 },
          { name: "Lifting de pestanas com tinta", minutes: 60, price: 38 },
          { name: "Tinta de sobrancelhas ou pestanas", minutes: 15, price: 9 },
        ],
      },
      {
        id: "depilacao",
        number: "05",
        title: "Depilação",
        titleItalic: "com cera",
        intro: "Cera morna, mãos rápidas e uma pele que fica tranquila depois.",
        image: "pele",
        alt: "Uma mulher de roupão branco cuida da pele em frente ao espelho.",
        treatments: [
          { name: "Buço ou queixo", minutes: 10, price: 5 },
          { name: "Axilas", minutes: 15, price: 8 },
          { name: "Meia perna", minutes: 25, price: 14 },
          { name: "Perna inteira", minutes: 40, price: 22 },
          { name: "Virilha completa", minutes: 30, price: 18 },
        ],
      },
      {
        id: "maquilhagem",
        number: "06",
        title: "Maquilhagem",
        titleItalic: "para o dia",
        intro: "Do jantar de sexta ao dia do casamento, com a pele preparada antes da cor.",
        image: "maquilhagem",
        alt: "Uma maquilhadora aplica pó com um pincel no rosto de uma noiva.",
        treatments: [
          { name: "Maquilhagem de dia", minutes: 45, price: 30 },
          { name: "Maquilhagem de evento", minutes: 60, price: 45 },
          { name: "Noiva, com prova", minutes: 150, price: 140 },
        ],
      },
    ] as OrveRitual[],
  },
  journey: {
    eyebrow: "O ritual da casa",
    title: "Hidratação",
    titleItalic: "«Orvalho».",
    intro: "Sessenta minutos, quatro tempos. É o tratamento que mais gostamos de fazer e o melhor para conhecer a casa.",
    counter: "minutos",
    steps: [
      {
        title: "Conversa",
        text: "Olhamos para a sua pele consigo e perguntamos como é o seu dia a dia. Só depois escolhemos os produtos.",
        minutes: 5,
        image: "esfera",
        alt: "Esteticista prepara o rosto de uma cliente deitada numa marquesa.",
      },
      {
        title: "Limpeza e vapor",
        text: "Limpeza dupla e um vapor morno que abre a pele e acalma a respiração.",
        minutes: 15,
        image: "vaporVideo",
        alt: "Vapor morno sobre o rosto de uma cliente, durante uma limpeza de pele.",
      },
      {
        title: "Máscara e massagem",
        text: "Uma máscara de hidratação intensa enquanto as mãos trabalham o rosto, o pescoço e os ombros.",
        minutes: 30,
        image: "hidratacao",
        alt: "Rosto de uma cliente com uma máscara de hidratação brilhante.",
      },
      {
        title: "Bruma e chá",
        text: "Uma bruma fresca para fechar, e um chá de ervas antes de voltar à rua.",
        minutes: 10,
        image: "lifting",
        alt: "Massagem final no rosto de uma cliente, de olhos fechados.",
      },
    ] satisfies OrveStep[],
    price: "Hidratação «Orvalho» · 60 min · 48 €",
  },
  house: {
    eyebrow: "A casa",
    title: "Luz natural,",
    titleItalic: "cabines só suas.",
    text: "Um primeiro andar de janelas altas no Príncipe Real, com cabines privadas, toalhas mornas e um chá de ervas no fim de cada ritual.",
    alt: "Uma cabine de estética clara, com uma cliente deitada sob uma manta cinzenta e uma esteticista a tratar-lhe o rosto.",
  },
  team: {
    eyebrow: "Equipa",
    title: "As mãos",
    titleItalic: "da casa.",
    intro: "Uma equipa pequena, que conhece os clientes pelo nome.",
    note: "Equipa fictícia, criada para esta demonstração.",
    people: [
      {
        name: "Inês Carvalhal",
        role: "Esteticista · rosto",
        text: "Faz o ritual «Orvalho» como ninguém e explica cada passo sem pressa.",
        image: "lifting",
        alt: "Mãos de esteticista em massagem facial.",
      },
      {
        name: "Beatriz Moura",
        role: "Massagista · corpo",
        text: "Massagem relaxante, pedras quentes e drenagem. Mãos firmes, voz baixa.",
        image: "costas",
        focus: "45% 8%",
        alt: "Mãos de massagista nas costas de um cliente, à luz de velas.",
      },
      {
        name: "Joana Teles",
        role: "Mãos, pés e olhar",
        text: "Unhas, sobrancelhas e pestanas, com um olho afinado para o pormenor.",
        image: "maosMassagem",
        alt: "Vista de cima de uma manicure a massajar as mãos de uma cliente.",
      },
    ] satisfies OrvePerson[],
  },
  gallery: {
    eyebrow: "Reflexos",
    title: "Pequenos momentos",
    titleItalic: "da casa.",
    photos: [
      { image: "hidratacao", alt: "Rosto com máscara de hidratação." },
      { image: "led", alt: "Máscara de luz LED vermelha sobre uma marquesa." },
      { image: "maos", alt: "Manicure vista de cima, com flores na mesa." },
      { image: "altaFrequencia", alt: "Tratamento facial com um elétrodo de vidro." },
      { image: "mascara", alt: "Uma mulher de toalha na cabeça aplica uma máscara escura." },
      { image: "limpeza", alt: "Limpeza de pele numa cabine clara." },
      { image: "olhar", alt: "Aplicação de produto na pálpebra." },
      { image: "costas", alt: "Massagem às costas à luz de velas." },
    ] satisfies { image: OrvePhotoId; alt: string }[],
  },
  marquee: ["Hidratação", "Massagem", "Manicure", "Laminação", "Pedras quentes", "Lifting de pestanas", "Peeling", "Maquilhagem"],
  booking: {
    eyebrow: "Marcar",
    title: "Marque o seu",
    titleItalic: "momento.",
    intro: "Escolha o ritual, o dia e a hora que preferir. O pedido segue pelo WhatsApp e confirmamos consigo a disponibilidade.",
    step1: "1. O ritual",
    step2: "2. O dia",
    step3: "3. A hora",
    step4: "4. O seu nome",
    namePlaceholder: "Como se chama?",
    nameOptional: "(opcional)",
    chooseRitual: "Escolha um ritual",
    chooseDay: "Escolha um dia",
    chooseTime: "Escolha uma hora",
    summary: "O seu pedido",
    send: "Pedir pelo WhatsApp",
    call: "Ligar",
    pending: "Escolha o ritual, o dia e a hora para enviar o pedido.",
    closedNote: "Encerramos ao domingo e à segunda.",
    demoNote: "Demonstração: os contactos deste negócio fictício não pertencem a ninguém.",
    /** The WhatsApp message: {nome} is « Sou <name>.» or nothing; plain text so it can reach the browser. */
    message: "Olá!{nome} Gostaria de marcar {ritual} para {dia}, às {hora}. Até breve!",
    messageName: " Sou {nome}.",
  },
  visit: {
    addressLabel: "Morada",
    hoursLabel: "Horário",
    closedLabel: "Encerrado",
    phoneLabel: "Telefone",
    phoneNote: "Chamada para a rede móvel nacional.",
    whatsappLabel: "WhatsApp",
    directions: "Como chegar",
    mapLabel: "Mapa ilustrado do Príncipe Real com a localização do atelier.",
  },
  review: {
    title: "Já nos visitou?",
    text: "A sua opinião ajuda outras pessoas a escolher. Conte-nos como foi no Google.",
    button: "Deixe a sua avaliação",
  },
  faq: {
    eyebrow: "Perguntas frequentes",
    title: "Antes de",
    titleItalic: "vir.",
    items: [
      { q: "Preciso de marcação?", a: "Sim. Trabalhamos só por marcação, para que cada ritual tenha o tempo todo que precisa. Marque pelo WhatsApp, por telefone ou aqui no site." },
      { q: "Com quanto tempo devo chegar?", a: "Dez minutos antes chega. Dá para trocar de roupa com calma e falar connosco sobre o que procura." },
      { q: "Posso desmarcar ou mudar a hora?", a: "Pode, até 24 horas antes, sem custos. Basta uma mensagem." },
      { q: "Os preços incluem IVA?", a: "Não. Os preços apresentados são sem IVA; acresce IVA à taxa legal." },
      { q: "Têm vales de oferta?", a: "Temos, para qualquer ritual ou para um valor à sua escolha. Peça-nos pelo WhatsApp e enviamos por mensagem ou num envelope." },
      { q: "Também atendem homens?", a: "Claro. Rosto, massagem, mãos, pés e depilação são para toda a gente." },
    ] satisfies OrveFaq[],
  },
  footer: {
    tagline: "Atelier de pele e beleza no Príncipe Real. Rituais sem pressa, numa casa cheia de luz.",
    hours: "Horário",
    contacts: "Contactos",
    rights: "Todos os direitos reservados.",
    fictional: "Orvé é um negócio fictício, criado pela Steevanz para demonstrar um site de estética e beleza.",
    complaints: "Livro de Reclamações",
    credit: "Site por Steevanz",
    credits: "Imagens e vídeos: Mixkit (licença gratuita).",
  },
  notFound: {
    title: "Esta página evaporou.",
    text: "Talvez o endereço esteja errado. A casa continua no mesmo sítio.",
    back: "Voltar ao início",
  },
};

export type OrveCopy = typeof orveCopy;

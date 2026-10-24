// The words of Risca's website (a FICTIONAL hair salon in Porto, Steevanz's showcase for hair salons; owner,
// 2026-10-24). European Portuguese only. The services, durations, prices (always without VAT, with «+ IVA») and the
// team are made up for the demo. No ratings, no reviews, no testimonials, no customer numbers, no results promised.
// Kept free of imports so the unit tests can load it directly.

import type { RiscaPhotoId } from "./facts";

export interface RiscaService {
  name: string;
  /** Minutes the chair is booked for. */
  minutes: number;
  /** Euros, without VAT. */
  price: number;
  /** «desde»: the price grows with the length or volume of the hair. */
  from?: boolean;
  note?: string;
}

export interface RiscaCategory {
  id: "corte" | "cor" | "tratamentos" | "penteados" | "barbearia";
  title: string;
  lead: string;
  photo: RiscaPhotoId;
  /** Ids of the stylists who do this family of services (booking demo). */
  stylists: readonly string[];
  services: readonly RiscaService[];
}

export interface RiscaStylist {
  id: string;
  name: string;
  role: string;
  text: string;
  /** A picture of the kind of work they do (stock footage; not a portrait of the stylist). */
  photo: RiscaPhotoId;
  /** Weekdays they work (0 = Sunday). */
  days: readonly number[];
}

const categories: readonly RiscaCategory[] = [
  {
    id: "corte",
    title: "Corte",
    lead: "Lavagem, corte e acabamento. Linhas que crescem bem, para não precisar de nós todas as semanas.",
    photo: "corte",
    stylists: ["ines", "beatriz"],
    services: [
      { name: "Corte e brushing", minutes: 60, price: 32, from: true, note: "Lavagem, corte e acabamento" },
      { name: "Corte curto ou pixie", minutes: 45, price: 28 },
      { name: "Brushing", minutes: 40, price: 18, from: true },
      { name: "Acerto de franja", minutes: 15, price: 8 },
      { name: "Corte de criança (até aos 10 anos)", minutes: 30, price: 15 },
    ],
  },
  {
    id: "barbearia",
    title: "Barbearia",
    lead: "Cortes à tesoura ou à máquina, degradês limpos, barba com toalha quente e a risca desenhada à navalha. Com marcação ou sem ela: entre na fila pelo telemóvel.",
    photo: "navalha",
    stylists: ["rui", "duarte"],
    services: [
      { name: "Corte de homem", minutes: 30, price: 18, note: "Tesoura ou máquina, com lavagem" },
      { name: "Degradê", minutes: 40, price: 20 },
      { name: "Corte e barba", minutes: 50, price: 28 },
      { name: "Barba com toalha quente", minutes: 25, price: 14 },
      { name: "Barbear à navalha", minutes: 30, price: 16 },
      { name: "Risca desenhada à navalha", minutes: 10, price: 5 },
      { name: "Corte de rapaz (até aos 12 anos)", minutes: 25, price: 13 },
    ],
  },
  {
    id: "cor",
    title: "Cor",
    lead: "Da raiz ao balayage, com diagnóstico antes de pintar e teste de sensibilidade a quem pinta pela primeira vez.",
    photo: "cor",
    stylists: ["tiago", "ines"],
    services: [
      { name: "Coloração de raiz", minutes: 90, price: 38 },
      { name: "Coloração completa", minutes: 120, price: 48, from: true },
      { name: "Madeixas", minutes: 150, price: 65, from: true },
      { name: "Balayage", minutes: 180, price: 95, from: true },
      { name: "Gloss ou tonalização", minutes: 30, price: 25 },
    ],
  },
  {
    id: "tratamentos",
    title: "Tratamentos",
    lead: "Para cabelo seco, pintado ou cansado do verão: hidratação, reconstrução e couro cabeludo.",
    photo: "lavagem",
    stylists: ["tiago", "beatriz", "ines"],
    services: [
      { name: "Hidratação profunda", minutes: 30, price: 22 },
      { name: "Reconstrução capilar", minutes: 45, price: 35 },
      { name: "Tratamento do couro cabeludo", minutes: 40, price: 28 },
      { name: "Alisamento com queratina", minutes: 180, price: 120, from: true },
    ],
  },
  {
    id: "penteados",
    title: "Penteados e noivas",
    lead: "Ondas, apanhados e tranças para casamentos, batizados e noites que pedem cabelo à altura.",
    photo: "noiva",
    stylists: ["beatriz"],
    services: [
      { name: "Ondas ou caracóis", minutes: 45, price: 30 },
      { name: "Penteado de evento", minutes: 60, price: 40 },
      { name: "Apanhado", minutes: 75, price: 45 },
      { name: "Prova de noiva", minutes: 90, price: 55 },
      { name: "Penteado de noiva (no dia)", minutes: 120, price: 120 },
    ],
  },
];

const stylists: readonly RiscaStylist[] = [
  {
    id: "ines",
    name: "Inês Maia",
    role: "Direção criativa · corte",
    text: "Bobs com linha, pixies, franjas e cabelo comprido com movimento. Começa sempre por perguntar como penteia o cabelo de manhã.",
    photo: "pente",
    days: [2, 3, 4, 5, 6],
  },
  {
    id: "tiago",
    name: "Tiago Sá",
    role: "Colorista",
    text: "Balayage, madeixas, loiros frios e correções de cor. Mistura cada tom à mão e explica a manutenção antes de começar.",
    photo: "corPincel",
    days: [3, 4, 5, 6],
  },
  {
    id: "beatriz",
    name: "Beatriz Couto",
    role: "Penteados e noivas",
    text: "Apanhados, ondas e tranças. Faz a prova com a noiva semanas antes e, no dia, chega com tudo ensaiado.",
    photo: "noivaFlores",
    days: [2, 4, 5, 6],
  },
  {
    id: "rui",
    name: "Rui Freitas",
    role: "Barbeiro · barba",
    text: "Cortes à tesoura, barba com toalha quente e barbear à navalha. Rápido sem ser apressado.",
    photo: "tesoura",
    days: [2, 3, 4, 5, 6],
  },
  {
    id: "duarte",
    name: "Duarte Lobo",
    role: "Barbeiro · degradês",
    text: "Degradês à máquina, cortes curtos e a risca desenhada à navalha. Fica com a fila dos sábados de manhã.",
    photo: "maquina",
    days: [3, 4, 5, 6],
  },
];

export const riscaCopy = {
  htmlLang: "pt-PT",
  ogLocale: "pt_PT",
  meta: {
    title: "Risca · Cabeleireiro e barbearia no Porto",
    description:
      "Corte de senhora, cor e balayage, penteados de noiva, barbearia com barba à toalha quente e cortes de criança, em Cedofeita, no Porto. Marcação online ou fila pelo telemóvel. Site de demonstração da Steevanz para um negócio fictício.",
  },
  ogAlt: "Risca, cabeleireiro e barbearia no Porto: o logótipo cortado por uma linha vermelha ao lado de uma fotografia de cabelo ao vento.",
  skip: "Saltar para o conteúdo",
  newTab: "(abre num novo separador)",
  logoLabel: "Risca, cabeleireiro e barbearia, início",
  demo: "Negócio fictício · site de demonstração",
  nav: {
    label: "Menu principal",
    services: "Serviços",
    barber: "Barbearia",
    colour: "Cor",
    team: "Equipa",
    card: "Cartão",
    visit: "Visitar",
    book: "Marcar",
    open: "Abrir o menu",
    close: "Fechar o menu",
  },
  opening: "Cabeleireiro e barbearia · Porto",
  hero: {
    kicker: "Cabeleireiro e barbearia · Cedofeita, Porto",
    titleTop: "Cabelo com",
    titleSerif: "linha.",
    lead: "Senhora, homem e criança: corte, cor, barba à navalha e penteados para os dias grandes. Marque online a qualquer hora, ou entre na fila da barbearia pelo telemóvel.",
    book: "Marcar online",
    prices: "Ver preços",
    scroll: "Descer",
    alt: "Uma cabeleireira faz um brushing num cabelo comprido, num salão com um espelho redondo.",
    cover: {
      issue: "N.º 01 · Outono 2026",
      lines: ["O bob está de volta", "Barba: a toalha quente conta", "Loiros frios, sem amarelo"],
      side: "Corte · Cor · Barbearia",
    },
  },
  manifesto: {
    label: "Manifesto",
    words: [
      { text: "Cada" },
      { text: "cabeça" },
      { text: "tem" },
      { text: "a" },
      { text: "sua", serif: true },
      { text: "risca.", accent: true },
      { text: "Nós" },
      { text: "encontramo-la" },
      { text: "com" },
      { text: "tesoura", serif: true },
      { text: "afiada," },
      { text: "cor" },
      { text: "pensada" },
      { text: "e" },
      { text: "tempo", serif: true },
      { text: "para" },
      { text: "ouvir." },
    ] as readonly { text: string; serif?: boolean; accent?: boolean }[],
  },
  services: {
    eyebrow: "Carta de serviços",
    title: "Escolha.",
    titleSerif: "Nós cortamos.",
    intro: "Preços por serviço, com a duração para saber quanto tempo fica connosco. Os valores «desde» crescem com o comprimento e o volume: dizemos-lhe o preço antes de começar.",
    tabsLabel: "Famílias de serviços",
    from: "desde",
    plusVat: "+ IVA",
    vatNote: "Preços sem IVA.",
    demoNote: "Valores de exemplo de um negócio fictício.",
    book: "Marcar",
    bookLabel: "Marcar {servico}",
    list: categories,
  },
  colour: {
    eyebrow: "Cor",
    title: "A cor,",
    titleSerif: "escolhida à mão.",
    intro: "Antes de pintar, abrimos a cartela consigo: o tom, o reflexo e quanto tempo quer que dure.",
    steps: [
      { title: "Diagnóstico", text: "Quinze minutos para ver a base, o histórico e o que quer. Sem custo, antes de qualquer cor." },
      { title: "Teste de sensibilidade", text: "Para quem pinta pela primeira vez: um pequeno toque de cor 48 horas antes." },
      { title: "Manutenção", text: "Sai com a próxima visita sugerida e os cuidados para a cor durar em casa." },
    ],
    swatches: [
      { name: "Preto azulado", from: "#0d0f14", to: "#2a2f3a" },
      { name: "Chocolate", from: "#2b1a12", to: "#5a3826" },
      { name: "Avelã", from: "#5b3b22", to: "#9a6a41" },
      { name: "Cobre", from: "#7a2e12", to: "#c4622c" },
      { name: "Mel", from: "#8c5a24", to: "#d9a35a" },
      { name: "Loiro areia", from: "#a88a5c", to: "#e3cfa2" },
      { name: "Loiro pérola", from: "#b9ad9b", to: "#f1ebdf" },
      { name: "Cinza prata", from: "#6f7276", to: "#d6d8da" },
      { name: "Vermelhão", from: "#8f1a0c", to: "#ff4127" },
    ],
    fanLabel: "Cartela de cores de cabelo: preto azulado, chocolate, avelã, cobre, mel, loiro areia, loiro pérola, cinza prata e vermelhão.",
    prices: "Ver preços da cor",
  },
  team: {
    eyebrow: "Equipa",
    title: "Cinco pares",
    titleSerif: "de mãos.",
    intro: "Três cabeleireiros e dois barbeiros. Escolha a pessoa ao marcar, ou deixe connosco: juntamos o seu pedido a quem o faz melhor.",
    note: "Equipa fictícia, criada para esta demonstração. As fotografias mostram o tipo de trabalho, não as pessoas.",
    book: "Marcar com {nome}",
    list: stylists,
  },
  lookbook: {
    eyebrow: "Lookbook",
    title: "Cortes, cores",
    titleSerif: "e dias grandes.",
    note: "Imagens ilustrativas de banco de imagens (Mixkit).",
    alts: {
      caracois: "Caracóis volumosos, cor de cobre.",
      apanhado: "Um apanhado a ser preso na nuca.",
      comprido: "Cabelo comprido castanho, liso e brilhante.",
      ondas: "Ondas feitas com ferro num cabelo loiro.",
      brushing: "Um brushing em cabelo comprido, junto à janela do salão.",
      estudio: "Uma cabeleireira finaliza um penteado num estúdio.",
      caracois2: "Caracóis curtos e definidos, num fundo bege.",
      ferramentas: "Tesoura, pentes e máquina numa toalha branca.",
      olhar: "Olhar de um cliente durante um corte de homem.",
      homem: "Uma barbeira acerta um corte de homem, ao espelho.",
      nuca: "Degradê feito à máquina na nuca.",
      movimento: "Cabelo comprido ruivo a mover-se ao vento.",
    },
  },
  card: {
    eyebrow: "Cartão de cliente digital",
    title: "Seis visitas,",
    titleSerif: "uma hidratação por nossa conta.",
    intro: "O cartão de carimbos vive no seu telemóvel, sem app e sem papel para perder.",
    steps: [
      { title: "Adira ao balcão", text: "Um toque com o telemóvel na placa do balcão, ou leia o QR. O cartão fica guardado no telemóvel." },
      { title: "Um carimbo por visita", text: "Mostra o cartão e a equipa carimba, lendo o QR do seu cartão." },
      { title: "A recompensa aparece sozinha", text: "Ao sexto carimbo, a hidratação profunda fica no telemóvel, pronta a usar." },
    ],
    cardName: "Cartão Risca",
    cardHolder: "Cliente desde 2026",
    stampsLabel: "carimbos",
    reward: "Hidratação oferecida",
    rewardReady: "Pronta a usar na próxima visita",
    example: "Exemplo de regra de um negócio fictício.",
  },
  marquee: ["Corte", "Balayage", "Barba", "Brushing", "Degradê", "Madeixas", "Navalha", "Noivas", "Franja"],
  booking: {
    eyebrow: "Marcação online",
    title: "Marque",
    titleSerif: "a qualquer hora.",
    intro: "Escolha o serviço, o cabeleireiro ou o barbeiro, o dia e a hora. Só aparecem horas livres, e recebe a confirmação por email com um lembrete na véspera.",
    step1: "1 · Serviço",
    step2: "2 · Cabeleireiro ou barbeiro",
    step3: "3 · Dia",
    step4: "4 · Hora",
    step5: "5 · O seu nome",
    anyone: "Sem preferência",
    anyoneNote: "Quem estiver livre",
    nameOptional: "(opcional nesta demonstração)",
    namePlaceholder: "Como se chama?",
    noTimes: "Sem horas livres neste dia. Experimente outro dia.",
    pickService: "Escolha primeiro um serviço.",
    closedNote: "Domingo e segunda estamos fechados.",
    summary: "A sua marcação",
    pending: "Escolha o serviço, o dia e a hora.",
    confirm: "Confirmar marcação",
    call: "Prefere ligar?",
    with: "com",
    at: "às",
    done: {
      title: "Marcação de demonstração",
      text: "Isto é uma demonstração: nenhuma marcação foi feita. Num salão real, recebia agora a confirmação por email e, na véspera, um lembrete com a opção de alterar ou desmarcar.",
      calendar: "Guardar no calendário",
      again: "Fazer outra marcação",
    },
    demoNote: "Demonstração: os contactos deste negócio fictício não pertencem a ninguém e nada fica guardado.",
  },
  queue: {
    eyebrow: "Barbearia sem marcação",
    title: "Entre na fila.",
    titleSerif: "Espere onde quiser.",
    intro: "Passou à porta e apetece-lhe cortar já? Entre na fila da barbearia pelo telemóvel e vá tomar um café: avisamos quando for a sua vez.",
    steps: [
      { title: "Leia o QR à porta", text: "Ou toque com o telemóvel na placa. Abre a fila no navegador: sem app e sem conta." },
      { title: "Veja quanto falta", text: "A senha que está a ser atendida e o tempo estimado, sempre atualizados no telemóvel." },
      { title: "Volte quando tocar", text: "Quando chega a sua vez, a página da senha toca. Sem ficar sentado à espera." },
    ],
    counter: "Prefere não usar o telemóvel? Deixamos o seu nome na fila ao balcão.",
    hoursLabel: "Fila sem marcação",
    phone: {
      title: "Fila da barbearia",
      ticket: "A sua senha",
      serving: "A atender",
      ahead: "à sua frente",
      wait: "Espera estimada",
      minutes: "min",
      turn: "É a sua vez!",
      turnText: "Dirija-se à cadeira 2.",
    },
    example: "Exemplo de uma fila num negócio fictício: as senhas e os tempos mudam com o ritmo do dia.",
    alt: "Um barbeiro apara a barba de um cliente com toalha branca, numa barbearia de luz quente.",
  },
  review: {
    title: "Já cortou connosco?",
    text: "Conte aos outros como foi. Uma frase sobre o corte, a cor, a barba ou o atendimento ajuda quem procura cabeleireiro ou barbearia no Porto.",
    button: "Deixe a sua avaliação",
  },
  visit: {
    eyebrow: "Visitar",
    title: "Rua da Risca,",
    titleSerif: "Cedofeita.",
    addressLabel: "Morada",
    hoursLabel: "Horário",
    phoneLabel: "Telefone",
    phoneNote: "Número de demonstração, não atribuído",
    whatsappLabel: "WhatsApp",
    closedLabel: "Fechado",
    directions: "Como chegar",
    mapLabel: "Mapa ilustrado da zona de Cedofeita, no Porto, com a Risca assinalada.",
    note: "Morada fictícia num bairro real.",
  },
  faq: {
    eyebrow: "Perguntas",
    title: "Antes de",
    titleSerif: "marcar.",
    list: [
      {
        q: "Posso marcar online?",
        a: "Sim, a qualquer hora: escolhe o serviço, a pessoa (ou sem preferência), o dia e a hora. Recebe a confirmação por email e um lembrete na véspera, com a opção de alterar ou desmarcar.",
      },
      {
        q: "Posso aparecer na barbearia sem marcação?",
        a: "Pode. À porta, leia o QR ou toque com o telemóvel na placa e entra na fila: vê a senha que está a ser atendida e quanto falta, e o telemóvel avisa quando for a sua vez. Se preferir, deixamos o seu nome na fila ao balcão.",
      },
      {
        q: "Cortam cabelo a crianças?",
        a: "Sim, a meninas e a meninos: o corte de criança (até aos 10 anos) no cabeleireiro e o corte de rapaz (até aos 12) na barbearia.",
      },
      {
        q: "E se me atrasar ou precisar de desmarcar?",
        a: "Guardamos o lugar durante 10 minutos. Se não puder vir, desmarque pelo link do email até 24 horas antes: a cadeira fica livre para outra pessoa.",
      },
      {
        q: "Porque é que alguns preços dizem «desde»?",
        a: "Porque o comprimento e o volume mudam o tempo e o produto. Dizemos-lhe o valor antes de começar, sem surpresas. Os preços são sem IVA.",
      },
      {
        q: "Fazem teste de sensibilidade antes da cor?",
        a: "Sim, a quem pinta pela primeira vez connosco: um pequeno toque de cor 48 horas antes. Marque-o junto com o diagnóstico.",
      },
      {
        q: "Para noivas, a prova é obrigatória?",
        a: "Recomendamos a prova três a seis semanas antes do casamento. Levamos fotografias, o vestido e o véu em conta, e no dia está tudo ensaiado.",
      },
      {
        q: "Como funciona o cartão de cliente?",
        a: "Adere ao balcão com um toque do telemóvel na placa ou lendo o QR, sem instalar nada. A cada visita damos um carimbo; ao sexto, a hidratação seguinte é por nossa conta.",
      },
      {
        q: "Como posso pagar?",
        a: "Numerário, Multibanco e MB WAY.",
      },
    ],
  },
  footer: {
    tagline: "Cabeleireiro e barbearia em Cedofeita, no Porto. Corte, cor, barba, tratamentos e penteados.",
    hours: "Horário",
    contacts: "Contactos",
    rights: "Todos os direitos reservados.",
    fictional: "A Risca é um negócio fictício, criado pela Steevanz para demonstrar um site de cabeleireiro e barbearia: nome, equipa, morada, contactos e preços são inventados.",
    complaints: "Livro de Reclamações",
    credit: "Site por Steevanz",
    credits: "Imagens e vídeos: Mixkit (licença gratuita).",
  },
  notFound: {
    title: "Esta página levou um corte.",
    text: "O endereço não existe. Volte ao início e marque o seu.",
    home: "Voltar ao início",
  },
} as const;

export type RiscaCopy = typeof riscaCopy;

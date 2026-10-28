// The words of Prumo's website (a FICTIONAL clinic of physiotherapy, osteopathy and wellness in Coimbra, Steevanz's
// showcase for health and wellness businesses; owner, 2026-10-24). Portuguese (pt-PT) only.
// Health rules of this demo: no medical claims, no promised results, no fake credentials. The team is fictional and
// says so; the professional licence numbers are an obvious placeholder «(n.º da cédula)»; the insurers and
// agreements are a placeholder list; the page says it does not replace medical advice. Prices are examples, always
// without VAT with «+ IVA» beside them (owner's absolute rule), even though real health services may be VAT-exempt.
// Never ratings, reviews, testimonials, customer numbers or percentages. Kept free of imports (unit tests load it).

import type { PrumoPhotoId } from "./facts";

export type PrumoDisciplineId = "fisioterapia" | "osteopatia" | "pilates" | "massagem" | "nutricao";

export interface PrumoService {
  id: string;
  name: string;
  minutes: number;
  /** Euros, without VAT. */
  price: number;
  /** A short note beside the duration («por pessoa», «10 aulas»). */
  note?: string;
}

export interface PrumoDiscipline {
  id: PrumoDisciplineId;
  number: string;
  title: string;
  /** What happens in a session, in plain words (no promises). */
  intro: string;
  forWhom: string;
  image: PrumoPhotoId;
  alt: string;
  services: PrumoService[];
}

export interface PrumoTherapist {
  id: string;
  name: string;
  role: string;
  focus: string;
  disciplines: PrumoDisciplineId[];
  /** Only the regulated professions show the placeholder for their licence number. */
  licence: boolean;
  image: PrumoPhotoId;
  alt: string;
}

const disciplines: PrumoDiscipline[] = [
  {
    id: "fisioterapia",
    number: "01",
    title: "Fisioterapia",
    intro:
      "Começamos por ouvir e avaliar: como se mexe, o que custa, o que mudou. Depois explicamos o que vimos e combinamos um plano de sessões, com exercícios para fazer em casa.",
    forWhom: "Dores de costas e pescoço, recuperação depois de uma lesão ou cirurgia, desporto, postura no trabalho.",
    image: "fisioterapia",
    alt: "Fisioterapeuta a mobilizar o joelho de uma pessoa deitada na marquesa",
    services: [
      { id: "fisio-primeira", name: "Primeira consulta de fisioterapia", minutes: 60, price: 45, note: "avaliação e tratamento" },
      { id: "fisio-sessao", name: "Sessão de fisioterapia", minutes: 45, price: 35 },
      { id: "fisio-desporto", name: "Fisioterapia desportiva", minutes: 45, price: 40 },
      { id: "fisio-postura", name: "Reeducação postural", minutes: 50, price: 40 },
    ],
  },
  {
    id: "osteopatia",
    number: "02",
    title: "Osteopatia",
    intro:
      "Uma abordagem manual e cuidadosa, que olha para o corpo como um todo. Cada consulta começa com perguntas e uma avaliação; só depois vem o tratamento com as mãos.",
    forWhom: "Tensões nas costas, pescoço e ombros, desconfortos que voltam com o stress ou com longas horas sentado.",
    image: "osteopatia",
    alt: "Mãos de um osteopata na base do pescoço de uma pessoa deitada",
    services: [
      { id: "osteo-primeira", name: "Primeira consulta de osteopatia", minutes: 60, price: 55 },
      { id: "osteo-seguimento", name: "Consulta de seguimento", minutes: 45, price: 45 },
    ],
  },
  {
    id: "pilates",
    number: "03",
    title: "Pilates clínico",
    intro:
      "Exercício orientado por fisioterapeutas, no reformer e no tapete, em aulas individuais ou em grupos pequenos. Cada plano começa por uma avaliação e acompanha o seu ritmo.",
    forWhom: "Quem quer mexer-se melhor, voltar ao exercício com acompanhamento ou complementar a fisioterapia.",
    image: "pilates",
    alt: "Aula de pilates no reformer, com a instrutora a acompanhar",
    services: [
      { id: "pilates-individual", name: "Aula individual de pilates clínico", minutes: 50, price: 40 },
      { id: "pilates-dupla", name: "Aula em dupla", minutes: 50, price: 25, note: "por pessoa" },
      { id: "pilates-grupo", name: "Aula de grupo (até 4 pessoas)", minutes: 50, price: 15 },
      { id: "pilates-pack", name: "Pack de 10 aulas de grupo", minutes: 50, price: 130, note: "10 aulas, válido 3 meses" },
    ],
  },
  {
    id: "massagem",
    number: "04",
    title: "Massagem terapêutica",
    intro:
      "Massagem feita por quem conhece o corpo: firme onde é preciso, calma no resto. Ajustamos a pressão consigo durante toda a sessão.",
    forWhom: "Costas e pescoço carregados, pernas cansadas depois do treino, uma pausa no meio da semana.",
    image: "massagem",
    alt: "Massagem terapêutica nas pernas de uma pessoa deitada",
    services: [
      { id: "massagem-costas", name: "Massagem terapêutica de costas e pescoço", minutes: 30, price: 28 },
      { id: "massagem-corpo", name: "Massagem terapêutica de corpo inteiro", minutes: 60, price: 45 },
      { id: "massagem-desporto", name: "Massagem desportiva de recuperação", minutes: 45, price: 38 },
    ],
  },
  {
    id: "nutricao",
    number: "05",
    title: "Nutrição",
    intro:
      "Consultas com uma nutricionista para olhar para o que come no dia a dia, sem dietas da moda. Sai com um plano escrito, simples de seguir na sua cozinha.",
    forWhom: "Quem quer comer melhor, ajustar a alimentação ao treino ou ter um acompanhamento regular.",
    image: "nutricao",
    alt: "Prato com abacate, rúcula e tomate-cereja",
    services: [
      { id: "nutricao-primeira", name: "Primeira consulta de nutrição", minutes: 60, price: 50 },
      { id: "nutricao-seguimento", name: "Consulta de acompanhamento", minutes: 30, price: 35 },
    ],
  },
];

const team: PrumoTherapist[] = [
  {
    id: "ines",
    name: "Inês Valadares",
    role: "Fisioterapeuta",
    focus: "Fisioterapia músculo-esquelética e reeducação postural",
    disciplines: ["fisioterapia", "pilates"],
    licence: true,
    image: "fisioterapia",
    alt: "Mãos de fisioterapeuta a mobilizar uma perna",
  },
  {
    id: "tomas",
    name: "Tomás Brandão",
    role: "Osteopata",
    focus: "Osteopatia, coluna e articulações",
    disciplines: ["osteopatia"],
    licence: true,
    image: "cervical",
    alt: "Osteopata a tratar a zona do pescoço de uma pessoa deitada",
  },
  {
    id: "marta",
    name: "Marta Seixas",
    role: "Fisioterapeuta",
    focus: "Pilates clínico e fisioterapia desportiva",
    disciplines: ["pilates", "fisioterapia"],
    licence: true,
    image: "reformer",
    alt: "Estúdio de pilates com reformers e uma instrutora",
  },
  {
    id: "rui",
    name: "Rui Calado",
    role: "Massagista",
    focus: "Massagem terapêutica e de recuperação",
    disciplines: ["massagem"],
    licence: false,
    image: "massagemCostas",
    alt: "Mãos de massagista nas costas de uma pessoa",
  },
  {
    id: "joana",
    name: "Joana Arede",
    role: "Nutricionista",
    focus: "Nutrição clínica e desportiva",
    disciplines: ["nutricao"],
    licence: true,
    image: "legumes",
    alt: "Legumes a ser cortados numa tábua de madeira",
  },
];

export const prumoCopy = {
  skip: "Saltar para o conteúdo",
  newTab: "(abre num novo separador)",
  logoLabel: "Prumo, início",
  logoLine: "Fisioterapia · Osteopatia · Bem-estar",
  tagline: "Fisioterapia, osteopatia e bem-estar em Coimbra",
  demo: "Negócio fictício · site de demonstração",
  meta: {
    title: "Prumo · Fisioterapia, osteopatia e bem-estar em Coimbra",
    description:
      "Fisioterapia, osteopatia, pilates clínico, massagem terapêutica e nutrição em Celas, Coimbra. Marcação online com terapeuta, dia e hora. Site de demonstração da Steevanz para um negócio fictício.",
    ogAlt: "Prumo, clínica de fisioterapia, osteopatia e bem-estar: o logótipo sobre uma sessão de fisioterapia",
  },
  nav: {
    label: "Menu principal",
    disciplines: "Tratamentos",
    firstVisit: "Primeira consulta",
    studio: "Pilates",
    team: "Equipa",
    visit: "Visitar",
    book: "Marcar",
    open: "Abrir menu",
    close: "Fechar menu",
  },
  hero: {
    kicker: "Fisioterapia · Osteopatia · Pilates clínico",
    title: "Voltar a mexer-se",
    titleItalic: "com calma e com método.",
    lead: "Uma clínica pequena em Celas, Coimbra. Avaliamos com tempo, explicamos o que vemos e acompanhamos cada passo.",
    book: "Marcar consulta",
    prices: "Ver tratamentos",
    scroll: "Descer",
    alt: "Fisioterapeuta a avaliar a mobilidade da perna de uma pessoa deitada na marquesa",
    axisLine: "Cada corpo tem o seu prumo.",
    axisMarks: ["Ouvir", "Avaliar", "Tratar", "Acompanhar"],
  },
  manifesto: {
    eyebrow: "Como trabalhamos",
    text: "Primeiro ouvimos. Depois avaliamos com calma, explicamos o que vemos e combinamos consigo um plano à sua medida, na marquesa, no estúdio e em casa.",
    note: "Sem pressa e sem promessas: cada pessoa é avaliada antes de qualquer tratamento.",
  },
  disciplines: {
    eyebrow: "Tratamentos e preços",
    title: "Cinco formas",
    titleItalic: "de cuidar do corpo.",
    intro: "Cada tratamento começa por uma conversa e uma avaliação. As durações são as de uma sessão normal; na primeira vez, contamos com mais tempo.",
    plusVat: "+ IVA",
    vatNote: "Preços sem IVA.",
    demoNote: "Valores de exemplo de um negócio fictício.",
    forWhom: "Para quem",
    book: "Marcar",
    list: disciplines,
  },
  firstVisit: {
    eyebrow: "A primeira consulta",
    title: "Uma hora,",
    titleItalic: "sem pressas.",
    intro: "É assim que costuma correr a primeira consulta de fisioterapia ou osteopatia. Traga roupa confortável e, se tiver, exames ou relatórios recentes.",
    totalLabel: "minutos, no total",
    steps: [
      { minutes: 10, title: "Conversa", text: "O que sente, desde quando, o que já fez e o que gostava de voltar a fazer." },
      { minutes: 15, title: "Avaliação", text: "Postura, movimento e força, com testes simples. Explicamos cada um antes de o fazer." },
      { minutes: 30, title: "Primeiro tratamento", text: "Terapia manual, exercício ou ambos, sempre com o seu acordo e ao seu ritmo." },
      { minutes: 5, title: "Plano", text: "O que combinámos, por escrito: as próximas sessões e os exercícios para casa." },
    ],
    note: "Se a avaliação mostrar que precisa de outro profissional de saúde, dizemos-lhe e explicamos porquê.",
  },
  studio: {
    eyebrow: "O estúdio",
    title: "Pilates clínico,",
    titleItalic: "em grupos pequenos.",
    intro:
      "Um estúdio com reformers e luz natural, no mesmo piso da clínica. As aulas são dadas por fisioterapeutas e nunca passam de quatro pessoas, para que cada exercício seja ajustado a quem o faz.",
    points: ["Aulas individuais, em dupla ou em grupo até 4 pessoas", "Avaliação antes da primeira aula", "Horários de manhã cedo e ao fim do dia"],
    alt: "Aula de pilates no reformer, com uma instrutora a acompanhar duas alunas",
    card: {
      eyebrow: "Cartão de cliente digital",
      title: "Cada aula, um carimbo.",
      text: "O cartão fica no telemóvel, sem app: adere com um toque na placa da receção ou lendo o QR code, e a equipa carimba cada aula de pilates. Ao décimo carimbo, a recompensa aparece sozinha no telemóvel.",
      reward: "Ao 10.º carimbo: uma massagem de costas e pescoço de 30 minutos oferecida.",
      example: "Exemplo de regra num negócio fictício.",
      cardName: "Cartão Prumo",
      cardLine: "Pilates clínico",
      stampsLabel: "carimbos",
      rewardShort: "Massagem oferecida",
    },
  },
  team: {
    eyebrow: "Equipa",
    title: "Quem",
    titleItalic: "cuida de si.",
    intro: "Cada pessoa é acompanhada sempre que possível pelo mesmo terapeuta, do primeiro dia ao último.",
    note: "Equipa fictícia: nomes e percursos inventados para este site de demonstração.",
    licenceLabel: "Cédula profissional",
    licencePlaceholder: "(n.º da cédula)",
    list: team,
  },
  marquee: ["Fisioterapia", "Osteopatia", "Pilates clínico", "Massagem terapêutica", "Nutrição", "Reeducação postural"],
  space: {
    eyebrow: "O espaço",
    title: "Luz natural,",
    titleItalic: "salas calmas.",
    intro: "Três salas de tratamento, um estúdio de pilates e uma sala de espera pequena, onde raramente se espera. Acesso sem degraus desde a rua.",
    photos: [
      { id: "estudio", alt: "Estúdio de chão de madeira com uma pessoa a alongar no tapete" },
      { id: "ombro", alt: "Fisioterapeuta a tratar o ombro de uma pessoa deitada" },
      { id: "tratamento", alt: "Sala de tratamento com janela, fisioterapeuta e marquesa" },
      { id: "avaliacao", alt: "Avaliação da mobilidade do pescoço, com as mãos do terapeuta a apoiar a cabeça" },
      { id: "pescoco", alt: "Sala de tratamento clara, com o terapeuta a trabalhar junto à marquesa" },
    ] as { id: PrumoPhotoId; alt: string }[],
  },
  booking: {
    eyebrow: "Marcação online",
    title: "Marque quando",
    titleItalic: "lhe der jeito.",
    intro:
      "Escolha o tratamento, o terapeuta, o dia e a hora, a qualquer hora do dia. Recebe a confirmação por email e, na véspera, um lembrete com a opção de alterar ou desmarcar.",
    points: ["Só aparecem horários livres", "Confirmação e lembrete por email", "Altere ou desmarque pelo link do email"],
    step1: "1. Tratamento",
    step2: "2. Terapeuta",
    step3: "3. Dia",
    step4: "4. Hora",
    step5: "5. O seu nome",
    nameOptional: "(opcional)",
    namePlaceholder: "Como se chama?",
    anyTherapist: "Sem preferência",
    anyTherapistNote: "o primeiro horário livre",
    pickService: "Escolha primeiro um tratamento.",
    closedNote: "Ao domingo e feriados estamos fechados; ao sábado, só de manhã.",
    summary: "A sua marcação",
    pending: "Escolha o tratamento, o dia e a hora.",
    with: "com",
    at: "às",
    confirm: "Confirmar marcação",
    call: "Prefere ligar?",
    done: {
      title: "Marcação de demonstração",
      text: "Isto é uma demonstração: nenhuma marcação foi feita. Numa clínica real, recebia agora a confirmação por email e, na véspera, um lembrete com a opção de alterar ou desmarcar.",
      again: "Fazer outra marcação",
    },
    demoNote: "Demonstração: os contactos deste negócio fictício não pertencem a ninguém e nada fica guardado.",
  },
  visit: {
    eyebrow: "Visitar",
    title: "Em Celas,",
    titleItalic: "perto de tudo.",
    addressLabel: "Morada",
    directions: "Como chegar",
    hoursLabel: "Horário",
    contactsLabel: "Contactos",
    phoneNote: "Número de demonstração, não atribuído",
    whatsapp: "WhatsApp",
    email: "Email",
    access: "Entrada ao nível da rua, sem degraus. Estacionamento pago na rua.",
    insurance: {
      title: "Seguros e acordos",
      text: "Lista de exemplo: numa clínica real, aqui ficam os seguros de saúde, subsistemas e acordos com empresas com que trabalha, e o que o cliente tem de trazer.",
      list: ["(seguros e acordos)", "(seguro de saúde)", "(subsistema de saúde)", "(acordo com empresa)"],
    },
  },
  review: {
    title: "Já nos visitou?",
    text: "Conte como correu. A sua opinião no Google ajuda outras pessoas a escolher e ajuda-nos a fazer melhor.",
    button: "Deixe a sua avaliação",
  },
  faq: {
    eyebrow: "Perguntas",
    title: "Antes de",
    titleItalic: "vir.",
    items: [
      {
        q: "Preciso de uma prescrição médica?",
        a: "Para a maior parte das consultas, não. Se tiver relatórios, exames ou uma indicação do seu médico, traga-os: ajudam-nos a perceber melhor o seu caso.",
      },
      {
        q: "O que devo levar à primeira consulta?",
        a: "Roupa confortável, que deixe mexer à vontade, e exames ou relatórios recentes, se os tiver. Chegue cinco minutos antes para tratarmos da ficha.",
      },
      {
        q: "Quantas sessões vou precisar?",
        a: "Depende de cada pessoa, por isso não prometemos números à partida. No fim da primeira consulta combinamos um plano e revemo-lo consigo ao longo das sessões.",
      },
      {
        q: "Trabalham com seguros?",
        a: "Neste site de demonstração, os seguros e acordos aparecem apenas como exemplo. Numa clínica real, a lista fica nesta página e é confirmada na marcação.",
      },
      {
        q: "Posso desmarcar ou mudar a hora?",
        a: "Sim, pelo link do email de confirmação ou pelo telefone. Pedimos que avise com 24 horas de antecedência, para darmos o horário a outra pessoa.",
      },
      {
        q: "O pilates clínico é para quem nunca fez?",
        a: "Sim. Antes da primeira aula fazemos uma avaliação e começamos pelo que faz sentido para si. Os grupos têm no máximo quatro pessoas.",
      },
    ],
  },
  health: {
    title: "Nota de saúde",
    text: "A informação deste site é geral e não substitui o aconselhamento do seu médico ou de outro profissional de saúde. Em caso de urgência, ligue 112.",
  },
  footer: {
    tagline: "Fisioterapia, osteopatia, pilates clínico, massagem terapêutica e nutrição, em Celas, Coimbra.",
    hours: "Horário",
    contacts: "Contactos",
    regulator: "Registo na Entidade Reguladora da Saúde: (n.º de registo)",
    fictional:
      "A Prumo é um negócio fictício, criado pela Steevanz para demonstrar um site de clínica de fisioterapia e bem-estar: nome, equipa, morada, contactos, tratamentos e preços são inventados.",
    rights: "Todos os direitos reservados.",
    credits: "Fotografias e vídeos: Mixkit (licença gratuita).",
    complaints: "Livro de Reclamações",
    credit: "Site por Steevanz",
  },
  notFound: {
    title: "Esta página saiu do prumo.",
    text: "O endereço não existe ou mudou. Volte ao início e encontre o que procura.",
    back: "Voltar ao início",
  },
};

export type PrumoCopy = typeof prumoCopy;

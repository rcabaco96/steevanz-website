// «Um dia no seu negócio» (#dia): copy and screen data for the DayJourney section of /novo-ultra.
// Pure data (no JSX). Every business here is fictional and the section says so under the phone.
// Rules: no reviews, ratings or review text anywhere (the review screen is the empty form), no Google
// look-alikes, no invented numbers (tests/home-ultra.test.mjs scans this file).

export type JourneyPhotoId = "restaurant-table" | "salon-chair" | "clinic" | "holiday-rental";

export type JourneyRowIcon = "clock" | "pin" | "calendar";

/** Code screens (rendered at 390 CSS px inside the phone). */
export type JourneyCodeScreen =
  | { kind: "search"; query: string; business: string; category: string; chips: readonly string[] }
  | {
      kind: "site";
      photo: JourneyPhotoId;
      business: string;
      tagline: string;
      items: readonly string[];
      rows: readonly { icon: JourneyRowIcon; text: string }[];
      cta: string;
    }
  | { kind: "review"; business: string }
  | { kind: "stamp"; business: string; brand: string; brandText: string; reward: string; from: number }
  | { kind: "guide"; business: string }
  | { kind: "chat"; business: string; assistant: string; question: string; card: { title: string; action: string; icon: "pin" | "bag" } }
  | { kind: "social"; business: string }
  | { kind: "shop"; business: string }
  | { kind: "order"; business: string; table: string; dishes: readonly string[]; cta: string; note: string }
  | {
      kind: "booking";
      business: string;
      title: string;
      services: readonly string[];
      people: readonly string[];
      slots: readonly string[];
      cta: string;
    }
  | { kind: "dates"; business: string; month: string; from: number; to: number; cta: string }
  | { kind: "queue"; business: string; title: string; ahead: string; text: string };

/** A real product still (public/home-ultra, produced in parallel), with a code screen if it is missing. */
export type JourneyStillScreen = { kind: "still"; src: string; tone: "light" | "dark"; fallback: JourneyCodeScreen };

export type JourneyScreen = JourneyCodeScreen | JourneyStillScreen;

export interface JourneyStep {
  time: string;
  title: string;
  text: string;
  screen: JourneyScreen;
}

export interface JourneySector {
  id: "restauracao" | "beleza" | "clinicas" | "alojamento" | "lojas";
  label: string;
  business: string;
  steps: readonly [JourneyStep, JourneyStep, JourneyStep, JourneyStep, JourneyStep];
}

export const dayJourney = {
  titleId: "dia-title",
  title: "Um dia no seu *negócio*",
  lead: "Do primeiro clique ao regresso, veja como as peças trabalham juntas.",
  switcherLabel: "Escolher setor",
  note: "Exemplos com negócios fictícios.",
  controls: {
    previous: "Passo anterior",
    next: "Passo seguinte",
    pause: "Pausar",
    play: "Continuar",
    /** «Passo 2 de 5» */
    stepOf: (step: number, total: number) => `Passo ${step} de ${total}`,
  },
  /** The physical plate next to the phone on the review and stamp steps (TapPlate copy). */
  plates: {
    review: { line1: "Gostou?", line2: "Toque para avaliar" },
    stamp: { line1: "Carimbo", line2: "Encoste o telemóvel" },
    social: { line1: "Siga-nos", line2: "Toque para abrir" },
  },
  /** Labels used inside the code screens. */
  screen: {
    results: "Resultados",
    reviewTitle: "Deixe a sua avaliação",
    reviewField: "Conte como foi a sua visita",
    reviewPublish: "Publicar",
    stampToast: "Mais um carimbo",
    stampDone: "Cartão completo",
    stampHolder: "O seu cliente",
    guideWelcome: "Welcome",
    guideLanguages: ["PT", "EN", "FR"],
    guideRows: [
      { title: "Wi-Fi", text: "Network and password" },
      { title: "House rules", text: "Quiet hours and recycling" },
      { title: "Check-out", text: "Keys and departure time" },
      { title: "Around here", text: "Beach, food and transport" },
    ],
    chatOnline: "Responde a qualquer hora",
    socialFollow: "Seguir a loja",
    socialLine: "A loja, nas suas redes sociais",
    shopTotal: "Total",
    orderTotal: "pratos no pedido",
    queueHint: "Avisamos quando for a sua vez.",
    bookingService: "Serviço",
    bookingWho: "Com quem",
    bookingWhen: "Hoje",
    weekdays: ["S", "T", "Q", "Q", "S", "S", "D"],
    nights: (n: number) => `${n} noites`,
  },
  sectors: [
    {
      id: "restauracao",
      label: "Restauração",
      business: "Tasca do Largo",
      steps: [
        {
          time: "12:05",
          title: "Procura onde almoçar",
          text: "Alguém pesquisa “tasca perto de mim” e encontra o seu site.",
          screen: {
            kind: "search",
            query: "tasca perto de mim",
            business: "Tasca do Largo",
            category: "Cozinha portuguesa",
            chips: ["Site", "Menu", "Como chegar"],
          },
        },
        {
          time: "12:07",
          title: "Vê o site",
          text: "Fotografias, horário, morada e o menu, tudo no telemóvel.",
          screen: {
            kind: "site",
            photo: "restaurant-table",
            business: "Tasca do Largo",
            tagline: "Cozinha portuguesa, ao almoço e ao jantar.",
            items: ["Menu do dia", "Petiscos", "Sobremesas"],
            rows: [
              { icon: "clock", text: "Hoje · 12:00–15:00 e 19:00–23:00" },
              { icon: "pin", text: "Morada e como chegar" },
            ],
            cta: "Ver o menu",
          },
        },
        {
          time: "13:10",
          title: "Pede à mesa",
          text: "Toca na placa da mesa, vê os pratos em vídeo e faz o pedido. A equipa confirma com um QR.",
          screen: {
            kind: "still",
            src: "/home-ultra/menu-pedido.jpg",
            tone: "dark",
            fallback: {
              kind: "order",
              business: "Tasca do Largo",
              table: "Mesa 4",
              dishes: ["Bacalhau à Brás", "Polvo à lagareiro", "Pudim da casa"],
              cta: "Enviar pedido",
              note: "A equipa confirma com um QR",
            },
          },
        },
        {
          time: "14:20",
          title: "Deixa a avaliação",
          text: "Na hora da conta, um toque na placa abre o formulário de avaliação do seu perfil no Google.",
          screen: { kind: "review", business: "Tasca do Largo" },
        },
        {
          time: "14:22",
          title: "Ganha um carimbo",
          text: "Encosta o telemóvel e ganha mais um carimbo no cartão de cliente. Sem app.",
          screen: {
            kind: "stamp",
            business: "Tasca do Largo",
            brand: "#7a2d60",
            brandText: "#fbf7f1",
            reward: "Sobremesa oferecida",
            from: 4,
          },
        },
      ],
    },
    {
      id: "beleza",
      label: "Beleza",
      business: "Barbearia Navalha d'Ouro",
      steps: [
        {
          time: "09:40",
          title: "Procura uma barbearia",
          text: "“Barbearia perto de mim” e lá está o seu site.",
          screen: {
            kind: "search",
            query: "barbearia perto de mim",
            business: "Barbearia Navalha d'Ouro",
            category: "Corte e barba",
            chips: ["Site", "Marcar", "Como chegar"],
          },
        },
        {
          time: "09:41",
          title: "Vê os serviços",
          text: "Serviços, preços e fotografias do espaço, claros no telemóvel.",
          screen: {
            kind: "site",
            photo: "salon-chair",
            business: "Navalha d'Ouro",
            tagline: "Cortes e barba, com tempo para si.",
            items: ["Corte", "Barba", "Corte e barba"],
            rows: [
              { icon: "clock", text: "Hoje · 9:00–19:00" },
              { icon: "pin", text: "Morada e como chegar" },
            ],
            cta: "Marcar",
          },
        },
        {
          time: "09:43",
          title: "Marca sozinho",
          text: "Escolhe o serviço, o barbeiro e a hora, a qualquer hora do dia.",
          screen: {
            kind: "still",
            src: "/home-ultra/hero-reservas.jpg",
            tone: "light",
            fallback: {
              kind: "booking",
              business: "Navalha d'Ouro",
              title: "Marcar",
              services: ["Corte", "Barba", "Corte e barba"],
              people: ["Rui", "Tiago", "Qualquer um"],
              slots: ["9:30", "10:15", "11:00", "14:30", "16:00", "17:45"],
              cta: "Confirmar marcação",
            },
          },
        },
        {
          time: "17:30",
          title: "Deixa a avaliação",
          text: "Uma placa junto ao espelho e um toque abrem o formulário de avaliação.",
          screen: { kind: "review", business: "Barbearia Navalha d'Ouro" },
        },
        {
          time: "17:32",
          title: "Mais um carimbo",
          text: "Quando completa o cartão, a oferta aparece sozinha.",
          screen: {
            kind: "stamp",
            business: "Navalha d'Ouro",
            brand: "#1d1220",
            brandText: "#fbf7f1",
            reward: "Corte oferecido",
            from: 7,
          },
        },
      ],
    },
    {
      id: "clinicas",
      label: "Clínicas",
      business: "Clínica Sorriso",
      steps: [
        {
          time: "21:15",
          title: "Procura um dentista",
          text: "“Dentista perto de mim” leva-o ao site da clínica.",
          screen: {
            kind: "search",
            query: "dentista perto de mim",
            business: "Clínica Sorriso",
            category: "Clínica dentária",
            chips: ["Site", "Marcar consulta", "Como chegar"],
          },
        },
        {
          time: "21:16",
          title: "Vê a clínica",
          text: "Especialidades, horários e como chegar, sem ligar.",
          screen: {
            kind: "site",
            photo: "clinic",
            business: "Clínica Sorriso",
            tagline: "Medicina dentária para toda a família.",
            items: ["Ortodontia", "Implantes", "Higiene oral"],
            rows: [
              { icon: "clock", text: "Seg. a sáb. · 9:00–20:00" },
              { icon: "pin", text: "Morada e como chegar" },
            ],
            cta: "Marcar consulta",
          },
        },
        {
          time: "21:18",
          title: "Marca a consulta",
          text: "Escolhe a consulta, o médico e a hora, mesmo com a clínica fechada.",
          screen: {
            kind: "still",
            src: "/home-ultra/jornada-reservar-clinica.jpg",
            tone: "light",
            fallback: {
              kind: "booking",
              business: "Clínica Sorriso",
              title: "Marcar consulta",
              services: ["Consulta", "Higiene oral", "Ortodontia"],
              people: ["Dra. Marta", "Dr. Nuno"],
              slots: ["9:00", "10:30", "11:15", "15:00", "16:45", "18:30"],
              cta: "Confirmar consulta",
            },
          },
        },
        {
          time: "10:05",
          title: "Espera sem stress",
          text: "Junta-se à fila no telemóvel e é avisado quando chega a sua vez.",
          screen: {
            kind: "still",
            src: "/home-ultra/jornada-fila-clinica.jpg",
            tone: "light",
            fallback: {
              kind: "queue",
              business: "Clínica Sorriso",
              title: "Está na fila",
              ahead: "2 pessoas antes de si",
              text: "Pode esperar no café ao lado.",
            },
          },
        },
        {
          time: "11:00",
          title: "Deixa a avaliação",
          text: "Um toque na placa abre o formulário. Se surgir uma avaliação negativa, recebe um alerta e uma proposta de resposta.",
          screen: { kind: "review", business: "Clínica Sorriso" },
        },
      ],
    },
    {
      id: "alojamento",
      label: "Alojamento",
      business: "Maré Alta",
      steps: [
        {
          time: "Março",
          title: "Procura casa para o verão",
          text: "Encontra o site da casa e vê as fotografias e as datas livres.",
          screen: {
            kind: "still",
            src: "/home-ultra/jornada-site-alojamento.jpg",
            tone: "light",
            fallback: {
              kind: "site",
              photo: "holiday-rental",
              business: "Maré Alta",
              tagline: "Casa de férias a dois passos do mar.",
              items: ["Julho", "Agosto", "Setembro"],
              rows: [
                { icon: "calendar", text: "Datas livres no verão" },
                { icon: "pin", text: "Como chegar" },
              ],
              cta: "Ver datas livres",
            },
          },
        },
        {
          time: "Março",
          title: "Reserva direto",
          text: "Escolhe as datas e reserva no site da casa.",
          screen: {
            kind: "still",
            src: "/home-ultra/jornada-reserva-alojamento.jpg",
            tone: "light",
            fallback: { kind: "dates", business: "Maré Alta", month: "Julho", from: 14, to: 21, cta: "Reservar" },
          },
        },
        {
          time: "16:40",
          title: "Chega e toca na placa",
          text: "Wi-Fi, regras da casa e check-out, na língua do hóspede.",
          screen: { kind: "guide", business: "Maré Alta" },
        },
        {
          time: "23:50",
          title: "Pergunta à noite",
          text: "“Is there a pharmacy open now?” O assistente responde em inglês e só o acorda se for urgente.",
          screen: {
            kind: "chat",
            business: "Maré Alta",
            assistant: "Assistente · Maré Alta",
            question: "Is there a pharmacy open now?",
            card: { title: "Farmácia de serviço", action: "Como chegar", icon: "pin" },
          },
        },
        {
          time: "Saída",
          title: "Deixa a avaliação",
          text: "Um toque na placa junto à porta abre o formulário de avaliação.",
          screen: { kind: "review", business: "Maré Alta" },
        },
      ],
    },
    {
      id: "lojas",
      label: "Lojas",
      business: "Loja da Esquina",
      steps: [
        {
          time: "21:00",
          title: "Passa pela montra",
          text: "Toca no autocolante da montra e segue a loja nas redes sociais.",
          screen: { kind: "social", business: "Loja da Esquina" },
        },
        {
          time: "21:02",
          title: "Vê a loja online",
          text: "Os produtos, com preço, à distância de um toque.",
          screen: { kind: "shop", business: "Loja da Esquina" },
        },
        {
          time: "21:05",
          title: "Faz uma pergunta",
          text: "“Há bolo de laranja amanhã?” O chatbot responde e explica como encomendar.",
          screen: {
            kind: "chat",
            business: "Loja da Esquina",
            assistant: "Assistente · Loja da Esquina",
            question: "Há bolo de laranja amanhã?",
            card: { title: "Encomendar para amanhã", action: "Encomendar", icon: "bag" },
          },
        },
        {
          time: "12:30",
          title: "Paga e ganha um carimbo",
          text: "Encosta o telemóvel e acumula mais um carimbo.",
          screen: {
            kind: "stamp",
            business: "Loja da Esquina",
            brand: "#5e1f49",
            brandText: "#fbf7f1",
            reward: "Um bolo oferecido",
            from: 2,
          },
        },
        {
          time: "17:00",
          title: "Deixa a avaliação",
          text: "Um toque na placa do balcão abre o formulário de avaliação.",
          screen: { kind: "review", business: "Loja da Esquina" },
        },
      ],
    },
  ],
} as const satisfies {
  titleId: string;
  title: string;
  lead: string;
  switcherLabel: string;
  note: string;
  controls: Record<string, unknown>;
  plates: Record<"review" | "stamp" | "social", { line1: string; line2: string }>;
  screen: Record<string, unknown>;
  sectors: readonly JourneySector[];
};

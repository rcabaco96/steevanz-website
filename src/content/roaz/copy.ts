// Texts of Roaz's website, in European Portuguese. Roaz is a FICTIONAL business (see ./facts.ts): the trips, their
// durations, departure times, prices (always without VAT, with «+ IVA»), the policies, the boat and the skipper are
// made up for the demo. No ratings, no reviews, no testimonials, no numbers of guests, no results promised, no licence
// numbers (placeholders only). Kept free of imports for the unit tests.

import type { RoazPhotoId } from "./facts";

/** How a trip's picture opens on screen (Tours.tsx): through the mouth of a cave, binoculars, the horizon, a wake. */
export type RoazReveal = "gruta" | "binoculos" | "horizonte" | "esteira";

export interface RoazTour {
  id: string;
  number: string;
  name: string;
  nameLine: string;
  intro: string;
  minutes: number;
  /** Departure times (example). */
  departures: string[];
  departureNote?: string;
  from: string;
  includes: string[];
  suits: string;
  /** Euros per person, without VAT. */
  adult: number;
  /** Euros per child (age range in `childLabel`), without VAT. */
  child: number;
  childLabel: string;
  reveal: RoazReveal;
  video: "grutasVideo" | "golfinhosVideo" | "porDoSolVideo" | "kayakVideo";
  poster: RoazPhotoId;
  alt: string;
}

export interface RoazStop {
  id: string;
  name: string;
  note: string;
  image?: RoazPhotoId;
  alt?: string;
}

export interface RoazFaq {
  q: string;
  a: string;
}

export const roazCopy = {
  htmlLang: "pt-PT",
  ogLocale: "pt_PT",
  meta: {
    title: "Roaz · Passeios de mar em Ferragudo, Algarve",
    description:
      "Grutas e falésias, golfinhos ao largo, pôr do sol na costa, kayak e SUP, a partir do cais de Ferragudo. Reserva online. Site de demonstração da Steevanz para um negócio fictício.",
  },
  ogAlt: "O logótipo da Roaz sobre as falésias douradas do Algarve, com um barco a deixar a esteira no mar.",
  skip: "Saltar para o conteúdo",
  newTab: "(abre num novo separador)",
  logoLabel: "Roaz, passeios de mar em Ferragudo",
  tagline: "Passeios de mar · Ferragudo",
  demo: "Negócio fictício · site de demonstração",
  nav: {
    label: "Menu principal",
    tours: "Saídas",
    coast: "A costa",
    aboard: "Antes de embarcar",
    faq: "Perguntas",
    book: "Reservar",
    open: "Abrir o menu",
    close: "Fechar o menu",
  },
  hero: {
    kicker: "Passeios de mar · Ferragudo · Algarve",
    title: "Saímos do cais. O resto é a costa.",
    lead: "Grutas e falésias, golfinhos ao largo, o pôr do sol no mar e kayak entre as rochas, num barco pequeno e com tempo para ver.",
    book: "Reservar saída",
    tours: "Ver as saídas",
    scroll: "Largar amarras",
    alt: "Vista aérea das falésias douradas do Algarve, com casas brancas no topo e um barco a deixar uma esteira branca no mar.",
    horizon: "Ao largo de Ferragudo",
    bearing: "Rumo a nascente, ao longo da costa",
  },
  manifesto: {
    eyebrow: "A Roaz",
    text: "Um barco pequeno, um skipper que conhece cada rocha e a costa mais bonita do Algarve à porta. Saímos quando o mar deixa, vamos devagar onde vale a pena e voltamos sempre ao mesmo cais.",
  },
  coast: {
    eyebrow: "A costa",
    title: "Do Arade",
    titleLine: "a Benagil.",
    intro: "A rota da saída «Grutas e falésias», de poente para nascente. Deslize e siga o barco.",
    stops: [
      { id: "ferragudo", name: "Ferragudo", note: "O cais, na foz do Arade. Embarque e regresso.", image: "aldeia", alt: "A aldeia branca de Ferragudo junto à água, com barcos de pesca fundeados." },
      { id: "praia-grande", name: "Praia Grande", note: "O Castelo de São João do Arade à saída do rio.", image: "castelo", alt: "O forte de São João do Arade sobre a areia, à entrada do rio." },
      { id: "carvoeiro", name: "Carvoeiro", note: "A baía de casas brancas encaixada nas falésias.", image: "carvoeiro", alt: "Carvoeiro: casas brancas sobre as falésias e uma pequena praia em baixo." },
      { id: "algar-seco", name: "Algar Seco", note: "Rocha esculpida, arcos e algares junto à água.", image: "falesias", alt: "Falésias douradas recortadas sobre água verde-escura, vistas de cima." },
      { id: "alfanzina", name: "Farol de Alfanzina", note: "O farol branco e vermelho no alto da falésia.", image: "farol", alt: "O farol de Alfanzina, branco com o topo vermelho, no meio do mato da falésia." },
      { id: "benagil", name: "Benagil", note: "A gruta com o céu aberto no teto.", image: "algar", alt: "Dentro de uma gruta do Algarve, um buraco redondo no teto mostra o céu azul." },
      { id: "marinha", name: "Praia da Marinha", note: "Os rochedos e a água transparente. Volta ao cais.", image: "marinha", alt: "A Praia da Marinha, com rochedos dourados e água azul-turquesa." },
    ] satisfies RoazStop[],
    boatLabel: "O barco da Roaz",
  },
  tours: {
    eyebrow: "As saídas",
    title: "Quatro maneiras",
    titleLine: "de ir ao mar.",
    intro: "Todas saem de Ferragudo e voltam ao mesmo sítio. Diga-nos quem vem e ajudamos a escolher.",
    vatNote: "Preços por pessoa, sem IVA (acresce IVA à taxa legal).",
    demoNote: "Valores de exemplo de um negócio fictício.",
    plusVat: "+ IVA",
    perPerson: "por pessoa",
    adultLabel: "Adulto",
    durationLabel: "Duração",
    departuresLabel: "Saídas",
    fromLabel: "Partida",
    includesLabel: "Inclui",
    suitsLabel: "Para quem",
    book: "Reservar esta saída",
    list: [
      {
        id: "grutas",
        number: "01",
        name: "Grutas",
        nameLine: "e falésias",
        intro: "A costa dourada entre Ferragudo e a Praia da Marinha, rente às rochas: arcos, algares, praias escondidas e a gruta de Benagil vista do mar.",
        minutes: 90,
        departures: ["10:00", "12:00", "14:30", "16:30"],
        from: "Cais de Ferragudo",
        includes: ["Skipper e explicação da costa", "Coletes salva-vidas para todos", "Água a bordo"],
        suits: "Todas as idades. Crianças a partir dos 3 anos, sempre com um adulto.",
        adult: 35,
        child: 25,
        childLabel: "Criança (3–12)",
        reveal: "gruta",
        video: "grutasVideo",
        poster: "grutas",
        alt: "Vista aérea de um arco de rocha dourada sobre o mar escuro, na costa do Algarve.",
      },
      {
        id: "golfinhos",
        number: "02",
        name: "Golfinhos",
        nameLine: "ao largo",
        intro: "Mar aberto à procura de golfinhos, com regras de observação responsável: distância, motor ao ralenti e nunca atrás deles. São selvagens: não prometemos avistamentos.",
        minutes: 150,
        departures: ["09:30", "14:00"],
        from: "Cais de Ferragudo",
        includes: ["Skipper e guia de observação", "Coletes salva-vidas", "Binóculos a bordo", "Água e fruta"],
        suits: "A partir dos 6 anos. Pouco indicado para quem enjoa com facilidade.",
        adult: 45,
        child: 30,
        childLabel: "Criança (6–12)",
        reveal: "binoculos",
        video: "golfinhosVideo",
        poster: "golfinhos",
        alt: "Golfinhos a nadar junto à proa de um barco, vistos de cima, na água azul.",
      },
      {
        id: "por-do-sol",
        number: "03",
        name: "Pôr do sol",
        nameLine: "na costa",
        intro: "A costa a mudar de cor enquanto o sol desce no mar. Saímos uma hora antes do pôr do sol e voltamos com as primeiras luzes acesas em terra.",
        minutes: 105,
        departures: ["18:00"],
        departureNote: "A hora acompanha o pôr do sol de cada mês (a do exemplo é para outubro).",
        from: "Cais de Ferragudo",
        includes: ["Skipper", "Coletes salva-vidas", "Uma bebida por pessoa e petiscos"],
        suits: "Casais, amigos e famílias. Bebidas alcoólicas só para maiores de 18.",
        adult: 40,
        child: 25,
        childLabel: "Criança (3–12)",
        reveal: "horizonte",
        video: "porDoSolVideo",
        poster: "porDoSol",
        alt: "Um veleiro no horizonte com o sol a pôr-se e o mar dourado.",
      },
      {
        id: "kayak",
        number: "04",
        name: "Kayak e SUP",
        nameLine: "entre as rochas",
        intro: "Com guia, a remar da Praia Grande até às grutas e recantos onde o barco não chega. Sem pressa, com paragem para um mergulho quando o mar deixa.",
        minutes: 150,
        departures: ["09:00", "15:00"],
        from: "Praia Grande de Ferragudo",
        includes: ["Guia certificado", "Kayak duplo ou prancha de SUP", "Colete e saco estanque", "Fotografias do dia"],
        suits: "A partir dos 8 anos, com um adulto. É preciso saber nadar.",
        adult: 35,
        child: 25,
        childLabel: "Criança (8–12)",
        reveal: "esteira",
        video: "kayakVideo",
        poster: "kayak",
        alt: "Dois kayaks amarelos vistos de cima, a remar lado a lado em água escura.",
      },
    ] satisfies RoazTour[],
    extras: {
      title: "Também há",
      items: [
        { name: "Barco privado", text: "A saída à sua medida, só para o seu grupo (até 12 pessoas), 2 horas.", price: 280, unit: "por saída" },
        { name: "Aluguer de kayak simples", text: "Na Praia Grande, com colete e indicações do guia.", price: 15, unit: "por hora" },
        { name: "Aluguer de kayak duplo", text: "Para dois, com colete e saco estanque.", price: 25, unit: "por hora" },
        { name: "Aluguer de SUP", text: "Prancha, remo e colete. Para quem já tem prática.", price: 15, unit: "por hora" },
      ],
    },
  },
  waitlist: {
    eyebrow: "Saídas sem reserva",
    title: "Passou pelo cais?",
    titleLine: "Entre na lista.",
    intro: "Há lugares guardados para quem aparece. Leia o QR code no quiosque, ou toque na placa com o telemóvel, e entre na lista de espera digital da próxima saída: vê a senha que está a ser chamada e o tempo estimado, e o telemóvel avisa quando for a sua vez. Até lá, vá tomar um café à praça.",
    points: ["Sem app e sem criar conta", "A senha e o tempo estimado no telemóvel", "Aviso quando o barco estiver pronto"],
    product: "Lista de espera digital",
    screenTitle: "Lista de espera",
    screenNext: "Próxima saída",
    screenTour: "Grutas e falésias",
    screenCalling: "A chamar",
    screenYours: "A sua senha",
    screenWait: "Tempo estimado",
    screenPeople: "Pessoas",
    screenTurn: "É a sua vez! Dirija-se ao quiosque.",
    screenNote: "Ecrã de exemplo",
  },
  gallery: {
    eyebrow: "Diário de bordo",
    title: "O que se vê",
    titleLine: "lá de fora.",
    items: [
      { image: "benagilInterior", caption: "Benagil, por dentro", alt: "O interior da gruta de Benagil, com a luz a entrar pelo teto e pela abertura para o mar." },
      { image: "praia", caption: "Falésias a nascente", alt: "Uma praia de areia clara junto a uma falésia dourada em camadas e água transparente." },
      { image: "esteira", caption: "A esteira", alt: "Um barco visto de cima a deixar uma esteira branca no mar azul." },
      { image: "rochedos", caption: "Rochedos da Marinha", alt: "Rochedos dourados a sair da água, com ondas pequenas a rebentar." },
      { image: "sup", caption: "SUP ao fim da tarde", alt: "Duas pessoas em pranchas de SUP, em silhueta, no mar ao pôr do sol." },
      { image: "ferragudo", caption: "Regresso a Ferragudo", alt: "A aldeia de Ferragudo com as casas brancas refletidas na água do rio." },
    ] as { image: RoazPhotoId; caption: string; alt: string }[],
    note: "Fotografias de banco de imagens livres (Pixabay), da costa algarvia.",
  },
  marquee: ["Grutas", "Golfinhos", "Pôr do sol", "Kayak", "SUP", "Barco privado"],
  aboard: {
    eyebrow: "Antes de embarcar",
    title: "O mar manda.",
    titleLine: "Nós cumprimos.",
    intro: "As regras simples que um bom passeio precisa. São um exemplo: um negócio real escreve aqui as suas.",
    blocks: [
      {
        id: "mar",
        title: "Condições do mar",
        text: "Antes de cada saída o skipper vê a ondulação, o vento e os avisos da capitania. Se o mar não deixar, a saída não sai: avisamos por mensagem até 2 horas antes e escolhe outra data ou recebe o valor de volta.",
      },
      {
        id: "cancelar",
        title: "Cancelar ou mudar",
        text: "Sem custo até 24 horas antes da saída. Depois disso, mudamos a data quando houver lugar. Chegue 15 minutos antes ao ponto de encontro.",
      },
      {
        id: "seguranca",
        title: "Segurança a bordo",
        text: "Coletes salva-vidas para todos os tamanhos, briefing antes de largar, rádio VHF e kit de primeiros socorros. Lotação máxima de 12 pessoas.",
      },
      {
        id: "levar",
        title: "O que levar",
        text: "Protetor solar, chapéu, um casaco leve para o regresso e calçado que se possa molhar. No kayak, fato de banho e uma muda de roupa.",
      },
    ],
    licencesTitle: "Licenças e seguros",
    licences: [
      "Operador marítimo-turístico registado (n.º RNAAT)",
      "Agente de animação turística (n.º RNAAT)",
      "Seguro de responsabilidade civil e de acidentes pessoais (n.º de apólice)",
      "Embarcação registada na capitania (n.º de registo)",
    ],
    licencesNote: "Espaços reservados: num negócio real entram aqui os números verdadeiros.",
  },
  skipper: {
    eyebrow: "O skipper",
    title: "Guarde o contacto",
    titleLine: "de quem o leva.",
    intro: "No fim da saída, o skipper mostra o seu cartão: um toque do telemóvel ou o QR code e o contacto fica guardado, para marcar a próxima ou pedir as fotografias do dia.",
    product: "Cartão de visita digital",
    name: "Duarte Sequeira",
    role: "Skipper · Roaz",
    front: "Passeios de mar",
    save: "Guardar contacto",
    saveNote: "Contacto de exemplo (número sem dono).",
    note: "Equipa fictícia.",
    tap: "Toque ou QR",
  },
  booking: {
    eyebrow: "Reserva online",
    title: "Escolha a saída,",
    titleLine: "o dia e quem vem.",
    intro: "Quatro passos e fica com o bilhete. Sem pagamentos aqui: paga no cais, antes de embarcar.",
    step1: "1 · A saída",
    step2: "2 · O dia",
    step3: "3 · A hora",
    step4: "4 · Quem vem",
    step5: "5 · O seu nome",
    nameOptional: "(opcional)",
    namePlaceholder: "Como se chama?",
    adults: "Adultos",
    children: "Crianças",
    less: "Menos",
    more: "Mais",
    seatsNote: "Até {lugares} pessoas por reserva.",
    summary: "A sua saída",
    pending: "Escolha a saída, o dia, a hora e quantas pessoas vêm.",
    total: "Total",
    showTicket: "Ver bilhete",
    send: "Pedir por WhatsApp",
    call: "Ligar",
    ticketTitle: "Bilhete",
    ticketDemo: "Bilhete de exemplo · não é uma reserva",
    ticketBoarding: "Embarque",
    ticketBoardingNote: "15 min antes, no quiosque",
    ticketClose: "Fechar o bilhete",
    message: "Olá! Gostava de reservar a saída «{saida}» no dia {dia}, às {hora}, para {pessoas}.{nome} Obrigado!",
    messageName: " O meu nome é {nome}.",
    demoNote:
      "Demonstração: nada fica reservado nem é pago, e o número de WhatsApp não tem dono. Num site real, a reserva entra na agenda da Roaz e o cliente recebe a confirmação e um lembrete por email.",
    product: "Sistema de reservas online",
    dateNote: "Saídas todos os dias de abril a outubro; no resto do ano, conforme o mar.",
  },
  visit: {
    meetingLabel: "Ponto de encontro",
    hoursLabel: "Quiosque",
    phoneLabel: "Telefone",
    phoneNote: "Chamada para a rede móvel nacional",
    whatsappLabel: "WhatsApp",
    directions: "Abrir no mapa",
    mapLabel: "Mapa ilustrado de Ferragudo: o rio Arade, o cais e o quiosque da Roaz.",
  },
  review: {
    title: "Foi connosco ao mar?",
    text: "Conte como correu numa avaliação no Google. Ajuda quem está a escolher o primeiro passeio e ajuda-nos a fazer melhor.",
    button: "Deixe a sua avaliação",
  },
  faq: {
    eyebrow: "Perguntas",
    title: "Antes de",
    titleLine: "reservar.",
    items: [
      {
        q: "E se o mar estiver mau?",
        a: "Quem decide é o skipper, sempre a pensar na segurança. Se a saída for cancelada por causa do mar, avisamos até 2 horas antes e escolhe outra data ou recebe o valor de volta.",
      },
      {
        q: "Entramos na gruta de Benagil?",
        a: "As regras de acesso às grutas são definidas pelas autoridades e mudam. O barco segue as regras em vigor nesse dia e a ondulação: muitas vezes vê-se a gruta do mar. No kayak e no SUP chega-se mais perto, quando é permitido.",
      },
      {
        q: "Vamos ver golfinhos de certeza?",
        a: "Não há certezas com animais selvagens. Vamos aos sítios onde costumam andar, com paciência e respeito, mas não os perseguimos nem prometemos avistamentos.",
      },
      {
        q: "Podem ir crianças e bebés?",
        a: "Na saída das grutas e no pôr do sol, a partir dos 3 anos; nos golfinhos, a partir dos 6; no kayak e no SUP, a partir dos 8. Há coletes de todos os tamanhos.",
      },
      {
        q: "Onde estaciono e onde é o encontro?",
        a: "O encontro é no quiosque da Roaz, junto ao cais de Ferragudo. Há estacionamento público à entrada da aldeia, a poucos minutos a pé do cais.",
      },
      {
        q: "Quem enjoa pode vir?",
        a: "A saída das grutas é curta e perto da costa, a mais tranquila. Se costuma enjoar, coma qualquer coisa leve antes e fique na parte de trás do barco, a olhar para o horizonte.",
      },
      {
        q: "Como pago?",
        a: "No quiosque, antes de embarcar, em dinheiro ou cartão. A reserva online guarda o lugar; o pagamento é feito no cais.",
      },
    ] satisfies RoazFaq[],
  },
  footer: {
    tagline: "Passeios de mar a partir do cais de Ferragudo: grutas, golfinhos, pôr do sol, kayak e SUP.",
    hours: "Quiosque",
    contacts: "Contactos",
    links: "Na página",
    rights: "Todos os direitos reservados.",
    credits: "Fotografias e vídeos: Pixabay (licença Pixabay).",
    credit: "Site por Steevanz",
    complaints: "Livro de Reclamações",
    licence: "Operador marítimo-turístico (n.º RNAAT)",
    fictional:
      "A Roaz é um negócio fictício, criado pela Steevanz para mostrar um site de passeios de mar. O nome, o logótipo, o barco, o skipper, o ponto de encontro, as saídas, os horários e os preços são valores de exemplo; os contactos não pertencem a ninguém. Os lugares da costa são reais.",
  },
  notFound: {
    title: "Esta página ficou em terra.",
    text: "O endereço não existe ou mudou. Volte ao cais e escolha a sua saída.",
    back: "Voltar ao início",
  },
} as const;

export type RoazCopy = typeof roazCopy;

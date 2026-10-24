// Every text of Sete Chaves' website (pt-PT only). A FICTIONAL guest house made up by Steevanz as a demo: the hosts,
// the rooms, the rules and the prices are invented («valores de exemplo»); the page and its footer say so. Prices are
// always without VAT, with «+ IVA» beside them (owner's absolute rule). No ratings, reviews or customer numbers: the
// reviews area is only the call to leave one. Kept free of imports so the unit tests can load it directly.

/** Steevanz's product pages, for the two Steevanz products this guest house uses (owner, 2026-10-20: «Conhecer …»). */
export const steevanzLinks = {
  guide: "https://www.steevanz.com/produtos/guia-digital-alojamento",
  keychain: "https://www.steevanz.com/produtos/chaveiro-digital",
  site: "https://www.steevanz.com",
} as const;

export const seteChavesCopy = {
  skip: "Saltar para o conteúdo",
  newTab: "(abre num novo separador)",
  logoLabel: "Sete Chaves, início",
  logoLine: "Casa de campo · Aljezur",
  /** Shown under the hero's buttons, in the menu and wherever an example price appears. */
  demo: "Site de demonstração · negócio fictício, valores de exemplo",
  plusVat: "+ IVA",
  perNight: "por noite",
  vatNote:
    "Preços por noite, sem IVA. Valores de exemplo de um negócio fictício.",
  preloader: "Guardada a sete chaves",

  nav: {
    label: "Menu principal",
    rooms: "Quartos",
    day: "Um dia aqui",
    around: "Arredores",
    guide: "Guia da casa",
    rules: "Regras",
    book: "Reservar",
    open: "Abrir o menu",
    close: "Fechar o menu",
  },

  hero: {
    kicker: "Casa de campo · Costa Vicentina",
    title: "Uma casa guardada a sete chaves.",
    lead: "Cinco quartos na casa velha e duas casinhas no jardim, entre a serra e o mar de Aljezur. Uma chave para cada porta.",
    book: "Reservar",
    rooms: "Ver os quartos",
    alt: "Cortina de linho a mexer com o vento, com a sombra de uma cadeira",
    scroll: "Descer",
    fob: "N.º 7 · Aljezur",
    fobLine: "Sete portas. Uma chave para cada uma.",
  },

  story: {
    eyebrow: "A casa",
    title: "Um monte de 1890, aberto outra vez.",
    paragraphs: [
      "O monte esteve fechado vinte anos. Quando o recuperámos, encontrámos sete chaves de ferro penduradas atrás da porta da cozinha — uma para cada divisão que dava para o pátio.",
      "Ficaram as chaves, as paredes caiadas, o chão de barro e o forno do pão. Juntámos casas de banho novas, roupa de linho e um pequeno-almoço feito com o que há por perto.",
    ],
    hosts: "Os anfitriões",
    hostsText:
      "A Marta e o Rui recebem cada hóspede à chegada e deixam-no em paz o resto do tempo.",
    hostsNote:
      "Anfitriões e história fictícios, criados para esta demonstração.",
    facts: [
      { label: "Chaves", value: "7" },
      { label: "Quartos na casa velha", value: "5" },
      { label: "Casinhas no jardim", value: "2" },
    ],
    photoAlt:
      "Molho de chaves antigas de ferro pendurado numa parede de madeira",
  },

  rooms: {
    eyebrow: "Quartos e casinhas",
    title: "Escolha a sua chave.",
    intro:
      "Cinco quartos na casa velha, com pequeno-almoço, e duas casinhas no jardim, com cozinha. Todos com roupa de linho, toalhas de praia e Wi-Fi.",
    guests: (n: number) => `${n} ${n === 1 ? "pessoa" : "pessoas"}`,
    from: "Desde",
    low: "out.–mai.",
    peak: "jun.–set.",
    breakfastIncluded: "Pequeno-almoço incluído",
    breakfastOptional: "Pequeno-almoço opcional (cesto: 12 € por pessoa + IVA)",
    book: "Reservar esta chave",
    keyLabel: (n: number) => `Chave n.º ${n}`,
    boardLabel: "Quadro das chaves: escolha um quarto",
    photoNote: "Fotografias ilustrativas.",
  },

  day: {
    eyebrow: "Um dia aqui",
    title: "Do pequeno-almoço às estrelas.",
    moments: [
      {
        time: "08:30",
        title: "Pequeno-almoço no alpendre",
        text: "Pão do forno da aldeia, fruta da época, queijo de cabra, mel da serra e doce de medronho. Servido até às 10:30.",
        photo: "pequenoAlmoco",
        alt: "Pequeno-almoço visto de cima: croissant, compota, mel, sumo de laranja e café",
      },
      {
        time: "11:00",
        title: "Praia da Amoreira",
        text: "A praia onde a ribeira de Aljezur encontra o mar, entre dunas e falésias. Levamos-lhe o guarda-sol, se quiser.",
        photo: "ribeira",
        alt: "Ribeira a atravessar um areal até ao mar, entre falésias verdes",
      },
      {
        time: "15:00",
        title: "Piscina de água salgada",
        text: "Aberta de maio a outubro, das 9:00 às 20:00, com espreguiçadeiras à sombra das alfarrobeiras.",
        photo: "piscina",
        alt: "Piscina azul ao sol, com palmeira e muro branco",
      },
      {
        time: "19:30",
        title: "Pôr do sol na falésia",
        text: "Da Arrifana ao Cabo de São Vicente, o sol põe-se no mar. Emprestamos uma manta e um cesto para levar.",
        photo: "sagres",
        alt: "Falésias da costa de Sagres ao fim da tarde, sobre o mar",
      },
      {
        time: "23:00",
        title: "Céu sem luzes",
        text: "Longe das vilas, a Via Láctea vê-se do pátio em noites sem lua. Há um telescópio pequeno na sala comum.",
        photo: "estrelas",
        alt: "Via Láctea sobre um campo escuro",
      },
    ],
  },

  around: {
    eyebrow: "Arredores",
    title: "Entre a serra e o mar.",
    intro:
      "A casa fica no vale, a cinco minutos da vila. Distâncias aproximadas por estrada, a partir da vila de Aljezur.",
    places: [
      {
        name: "Praia da Amoreira",
        distance: "≈ 8 km",
        text: "A ribeira de Aljezur chega ao mar entre dunas.",
        photo: "ribeira",
        alt: "Ribeira a chegar ao mar num areal largo",
      },
      {
        name: "Praia da Arrifana",
        distance: "≈ 10 km",
        text: "Escolas de surf, a Pedra da Agulha e o porto de pesca.",
        photo: "arrifana",
        alt: "Baía da Arrifana vista da falésia, com a vila em cima",
      },
      {
        name: "Praia de Monte Clérigo",
        distance: "≈ 8 km",
        text: "Uma aldeia de casas brancas virada a poente.",
        photo: "falesias",
        alt: "Falésia da costa de Aljezur com uma gaivota no ar",
      },
      {
        name: "Rota Vicentina",
        distance: "na vila",
        text: "O Caminho Histórico passa em Aljezur; o Trilho dos Pescadores segue pelo topo das falésias.",
        photo: "passadico",
        alt: "Passadiço de madeira a descer para o mar ao pôr do sol",
      },
      {
        name: "Odeceixe",
        distance: "≈ 17 km",
        text: "Praia de rio e de mar, na fronteira com o Alentejo.",
        photo: "surf",
        alt: "Surfistas no mar da Costa Vicentina",
      },
      {
        name: "Cabo de São Vicente",
        distance: "≈ 40 km",
        text: "O farol no canto sudoeste da Europa, com Sagres ao lado.",
        photo: "cabo",
        alt: "Farol do Cabo de São Vicente no alto da falésia",
      },
    ],
    strip: [
      "Amoreira",
      "Arrifana",
      "Monte Clérigo",
      "Bordeira",
      "Odeceixe",
      "Sagres",
      "Rota Vicentina",
    ],
    seaAlt: "Vista aérea de surfistas nas ondas da Costa Vicentina",
  },

  guide: {
    eyebrow: "Guia da casa",
    title: "Tudo o que precisa de saber, num toque.",
    intro:
      "Em cada quarto há uma pequena placa na mesa de cabeceira. Um toque do telemóvel — ou o QR code — abre o guia da casa: a password do Wi-Fi com botão para copiar, as horas do pequeno-almoço, as regras, como chegar às praias sem rede e as nossas recomendações. Em português, inglês, francês e alemão.",
    points: [
      "Abre com um toque ou com o QR code, sem instalar nada",
      "Na língua do telemóvel do hóspede",
      "Sempre atualizado, sem papéis na gaveta",
    ],
    keychain:
      "E na argola de cada chave, um porta-chaves que abre o WhatsApp da casa com um toque.",
    plate: "Toque aqui",
    plateSub: "Guia da casa",
    product: "Este guia é o Guia digital da Steevanz.",
    cta: "Conhecer o Guia digital",
    keychainCta: "Conhecer o porta-chaves",
    phoneLabel: "Exemplo do guia da casa aberto num telemóvel",
    screen: {
      title: "Guia da casa",
      hello: "Bem-vindo à Sete Chaves",
      wifi: "Wi-Fi",
      network: "SeteChaves-Hospedes",
      password: "Password",
      copy: "Copiar",
      sections: [
        { title: "Pequeno-almoço", text: "08:30–10:30, no alpendre" },
        { title: "Check-out", text: "Até às 11:00. Deixe a chave no quadro." },
        { title: "Praias sem rede", text: "Mapa para guardar antes de sair" },
        { title: "Piscina", text: "09:00–20:00, de maio a outubro" },
        { title: "Silêncio", text: "Das 22:00 às 08:30" },
        { title: "Recomendações", text: "Peixe, padarias e trilhos" },
        { title: "Farmácia e saúde", text: "Na vila, a 5 minutos" },
      ],
    },
  },

  rules: {
    eyebrow: "Regras da casa",
    title: "Poucas regras, todas com bons motivos.",
    items: [
      {
        label: "Check-in",
        value: "15:00–20:00",
        text: "Chega mais tarde? Diga-nos e deixamos a chave no quadro.",
      },
      {
        label: "Check-out",
        value: "até 11:00",
        text: "Pode deixar as malas e aproveitar a piscina até à tarde.",
      },
      {
        label: "Silêncio",
        value: "22:00–08:30",
        text: "As paredes são grossas, mas o pátio é de todos.",
      },
      {
        label: "Estadia mínima",
        value: "2 noites",
        text: "Quatro noites em julho e agosto.",
      },
      {
        label: "Animais",
        value: "a pedido",
        text: "Bem-vindos nas duas casinhas do jardim.",
      },
      {
        label: "Fumar",
        value: "só lá fora",
        text: "Dentro de casa não; no pátio há cinzeiros.",
      },
    ],
    more: [
      "Crianças são bem-vindas; berço sem custo, a pedido.",
      "A piscina não tem vigilância: crianças sempre acompanhadas.",
      "Estacionamento gratuito dentro do portão.",
    ],
  },

  booking: {
    eyebrow: "Reservar",
    title: "Peça a sua chave.",
    intro:
      "Escolha o quarto e as datas e envie-nos o pedido por WhatsApp ou email. Respondemos com a confirmação e os dados para o pagamento. Não cobramos nada neste site.",
    step1: "1 · A chave",
    step2: "2 · As datas",
    step3: "3 · Hóspedes",
    step4: "4 · O seu nome",
    nameOptional: "(opcional)",
    namePlaceholder: "Ex.: Ana Lopes",
    calendarHelp: "Toque no dia de chegada e depois no dia de partida.",
    legendFree: "Livre",
    legendBusy: "Ocupado",
    legendPicked: "A sua estadia",
    demoAvailability:
      "Disponibilidade ilustrativa: neste site de demonstração os dias ocupados são de exemplo.",
    prevMonth: "Mês anterior",
    nextMonth: "Mês seguinte",
    checkIn: "Chegada",
    checkOut: "Partida",
    pickCheckIn: "Escolha o dia de chegada",
    pickCheckOut: "Agora o dia de partida",
    busyInside: "Há noites ocupadas nesse intervalo. Escolha outras datas.",
    busyNight:
      "Essa noite está ocupada (exemplo). Escolha outro dia de chegada.",
    weekdays: ["seg", "ter", "qua", "qui", "sex", "sáb", "dom"],
    dayBusy: "ocupado",
    dayPast: "indisponível",
    clear: "Limpar datas",
    keyBreakfast: "O cesto do pequeno-almoço das casinhas pede-se à parte.",
    minNights: (n: number) => `Estadia mínima nestas datas: ${n} noites.`,
    guestsLabel: "Número de hóspedes",
    less: "Menos um hóspede",
    more: "Mais um hóspede",
    summary: "O seu pedido",
    pending: "Escolha a chave e as datas para ver o resumo.",
    nights: (n: number) => `${n} ${n === 1 ? "noite" : "noites"}`,
    estimate:
      "Estimativa sem IVA, com valores de exemplo. O valor final vem na confirmação.",
    sendWhatsapp: "Pedir por WhatsApp",
    sendEmail: "Pedir por email",
    emailSubject: "Pedido de reserva — Sete Chaves",
    /** {nome} {chave} {chegada} {partida} {noites} {hospedes} */
    message:
      "Olá! Gostava de pedir uma reserva na Sete Chaves.{nome}\nChave: {chave}\nChegada: {chegada}\nPartida: {partida} ({noites})\nHóspedes: {hospedes}\nObrigado!",
    messageName: " Chamo-me {nome}.",
    demoNote:
      "Demonstração: a Sete Chaves é um negócio fictício criado pela Steevanz e os contactos não estão atribuídos. Num site real, o pedido chega ao WhatsApp ou ao email da casa.",
  },

  contact: {
    title: "Como chegar e contactos",
    addressLabel: "Morada",
    addressNote: "Morada fictícia",
    directions: "Abrir no mapa",
    phoneLabel: "Telefone",
    whatsappLabel: "WhatsApp",
    emailLabel: "Email",
    arrival:
      "A partir da vila, siga a estrada da serra durante 3 km e vire no portão de ferro com o 7. Os últimos 600 metros são em terra batida, transitável para qualquer carro.",
    mapLabel:
      "Mapa ilustrado do vale: a vila de Aljezur, a ribeira, a estrada da serra e a casa",
  },

  review: {
    title: "Já ficou connosco?",
    text: "Conte aos próximos hóspedes como foi. Uma avaliação no Google ajuda uma casa pequena mais do que imagina.",
    button: "Deixe a sua avaliação",
  },

  faq: {
    eyebrow: "Perguntas",
    title: "Antes de fazer a mala.",
    items: [
      {
        q: "Como faço uma reserva?",
        a: "Escolha a chave e as datas no formulário e envie o pedido por WhatsApp ou email. Respondemos no próprio dia com a confirmação e os dados para o pagamento. Este site não cobra nada.",
      },
      {
        q: "O pequeno-almoço está incluído?",
        a: "Nos cinco quartos da casa velha, sim. Nas duas casinhas, que têm cozinha, pode pedir o cesto do pequeno-almoço por 12 € por pessoa e dia + IVA (valor de exemplo).",
      },
      {
        q: "Posso chegar depois das 20:00?",
        a: "Pode. Avise-nos e deixamos a sua chave no quadro da entrada, com o guia da casa à espera no quarto.",
      },
      {
        q: "Há rede de telemóvel?",
        a: "Na casa há Wi-Fi em todos os quartos. Em algumas praias a rede falha: o guia da casa tem um mapa para guardar antes de sair.",
      },
      {
        q: "Aceitam animais?",
        a: "Nas duas casinhas do jardim, sim, a pedido. Nos quartos da casa velha, não.",
      },
      {
        q: "E se precisar de cancelar?",
        a: "Num site real, aqui fica a política de cancelamento da casa. Nesta demonstração não há reservas nem pagamentos.",
      },
    ],
  },

  footer: {
    tagline:
      "Casa de campo com cinco quartos e duas casinhas, no vale de Aljezur.",
    visit: "Morada",
    contacts: "Contactos",
    stay: "Estadia",
    fictional:
      "A Sete Chaves é um negócio fictício, criado pela Steevanz para mostrar como pode ser o site de um alojamento. Os nomes, a casa, os anfitriões, a morada, os contactos e os preços são valores de exemplo; as fotografias e vídeos são de bancos de imagens livres.",
    rights: "Todos os direitos reservados.",
    complaints: "Livro de Reclamações",
    credit: "Site por Steevanz",
    credits: "Fotografias e vídeos: Pixabay e Mixkit (licenças livres).",
  },

  notFound: {
    title: "Esta porta não abre.",
    text: "A página que procura não existe. Volte à entrada e escolha outra chave.",
    back: "Voltar à entrada",
  },
} as const;

export type SeteChavesCopy = typeof seteChavesCopy;

// Texts of Fabio's Roadstop's website, in European Portuguese and English. Taken from the client's old site
// (www.fabiosroadstop.pt: «Restaurante Americano · Panquecas · Hambúrgueres · Batidos · Cocktails · Cozinha
// aberta todo o dia», «Nossa História») and from what its photos and video show. No ratings, no prices.

import type { FabiosLocale, FabiosPage } from "./routes";

export interface FabiosDish {
  id: "pancakes" | "burgers" | "shakes" | "cocktails";
  name: string;
  line: string;
  /** Key of `fabios.media` (null: a typographic card, no photo of this dish exists yet). */
  image: "burgers" | "drinksTray" | "toast" | "menuArt" | null;
  alt: string;
}

export interface FabiosCopy {
  htmlLang: string;
  ogLocale: string;
  meta: Record<FabiosPage, { title: string; description: string }>;
  skip: string;
  nav: { menu: string; about: string; contact: string; call: string; open: string; close: string; home: string };
  langLabel: string;
  otherLang: string;
  hero: {
    kicker: string;
    lead: string;
    menu: string;
    directions: string;
    call: string;
    badge: string;
    craving: string;
    videoLabel: string;
    pause: string;
    play: string;
  };
  marquee: string[];
  dishes: { eyebrow: string; title: string; titleScript: string; intro: string; items: FabiosDish[]; cta: string };
  allDay: {
    eyebrow: string;
    hoursUnit: string;
    title: string;
    text: string;
    monday: string;
    steps: { time: string; name: string; text: string }[];
  };
  experience: {
    eyebrow: string;
    title: string;
    titleScript: string;
    text: string;
    cta: string;
    interiorAlt: string;
    polaroids: { image: "facade" | "eating" | "menuArt"; caption: string; alt: string }[];
  };
  visit: {
    eyebrow: string;
    title: string;
    titleScript: string;
    addressLabel: string;
    hoursLabel: string;
    hours: { days: string; time: string }[];
    phoneLabel: string;
    phoneNote: string;
    emailLabel: string;
    directions: string;
    call: string;
    write: string;
    facadeAlt: string;
    facadeCaption: string;
    mapButton: string;
    mapNote: string;
    mapTitle: string;
  };
  social: { eyebrow: string; title: string; instagram: string; facebook: string; tripadvisor: string; tripadvisorText: string };
  footer: { tagline: string; complaints: string; credit: string; rights: string; menu: string; follow: string };
  about: {
    eyebrow: string;
    title: string;
    titleScript: string;
    intro: string;
    quote: string;
    quoteBy: string;
    story: string[];
    values: { title: string; text: string }[];
    galleryAlt: { interior: string; lemonades: string; facade: string };
    cta: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    titleScript: string;
    intro: string;
    topicsTitle: string;
    topics: { label: string; subject: string }[];
  };
  notFound: { title: string; text: string; back: string };
  newTab: string;
  logoAlt: string;
  carAlt: string;
}

const pt: FabiosCopy = {
  htmlLang: "pt-PT",
  ogLocale: "pt_PT",
  meta: {
    home: {
      title: "Fabio's Roadstop | American diner em Armação de Pêra",
      description:
        "Panquecas, hambúrgueres, batidos e cocktails num diner americano dos anos 50 em Armação de Pêra, no Algarve. Cozinha aberta todo o dia, de terça a domingo.",
    },
    about: {
      title: "Sobre nós | Fabio's Roadstop",
      description:
        "A história do Fabio's Roadstop: um sonho pessoal tornado diner americano em Armação de Pêra, com produtos de qualidade e um atendimento que faz sentir em casa.",
    },
    contact: {
      title: "Contactos | Fabio's Roadstop",
      description:
        "Morada, telefone, email e horário do Fabio's Roadstop, no Edifício Mar Salgado, em Armação de Pêra. Aberto de terça a domingo, das 10h às 23h.",
    },
  },
  skip: "Saltar para o conteúdo",
  nav: {
    menu: "Menu",
    about: "Sobre nós",
    contact: "Contactos",
    call: "Ligar",
    open: "Abrir o menu de navegação",
    close: "Fechar o menu de navegação",
    home: "Início",
  },
  langLabel: "Português",
  otherLang: "English",
  hero: {
    kicker: "American diner · Armação de Pêra",
    lead: "Panquecas, hambúrgueres, batidos e cocktails num diner dos anos 50, em pleno Algarve.",
    menu: "Ver menu",
    directions: "Como chegar",
    call: "Ligar",
    badge: "Cozinha aberta todo o dia ✦ All day kitchen ✦ ",
    craving: "Hoje apetecem-me",
    videoLabel: "Vídeo do restaurante: amigos à mesa, hambúrgueres no cesto e um brinde com batidos",
    pause: "Pausar o vídeo",
    play: "Continuar o vídeo",
  },
  marquee: ["Panquecas", "Hambúrgueres", "Batidos", "Cocktails", "Hot dogs", "Cozinha aberta todo o dia"],
  dishes: {
    eyebrow: "O que servimos",
    title: "Clássicos americanos,",
    titleScript: "feitos com carinho",
    intro: "Quatro razões para parar na nossa estrada. O menu completo, com fotografias e preços, está no menu digital.",
    items: [
      {
        id: "pancakes",
        name: "Panquecas",
        line: "O clássico do pequeno-almoço americano, a qualquer hora do dia.",
        image: "menuArt",
        alt: "Capa do menu do Fabio's Roadstop com um carro clássico e a placa «Food»",
      },
      {
        id: "burgers",
        name: "Hambúrgueres",
        line: "Servidos à americana, no cesto, com o papel aos quadrados.",
        image: "burgers",
        alt: "Hambúrgueres em cestos com papel aos quadrados vermelhos, a caminho da mesa",
      },
      {
        id: "shakes",
        name: "Batidos",
        line: "Copo alto, palhinha e aquele sabor de diner.",
        image: "drinksTray",
        alt: "Tabuleiro com batidos e sumos coloridos no balcão do Fabio's Roadstop",
      },
      {
        id: "cocktails",
        name: "Cocktails",
        line: "Para brindar ao fim do dia, até às 23h.",
        image: "toast",
        alt: "Amigos a brindar com batidos e cocktails à mesa",
      },
    ],
    cta: "Ver o menu completo",
  },
  allDay: {
    eyebrow: "Cozinha aberta todo o dia",
    hoursUnit: "horas",
    title: "de cozinha aberta, sem pausas.",
    text: "De terça a domingo, das 10h às 23h. Chegue quando lhe apetecer: a cozinha não fecha a meio da tarde.",
    monday: "À segunda-feira descansamos.",
    steps: [
      { time: "10h", name: "Pequeno-almoço", text: "Panquecas para começar bem o dia." },
      { time: "13h", name: "Almoço", text: "Hambúrgueres e hot dogs à americana." },
      { time: "17h", name: "Lanche", text: "Batidos e uma pausa entre a praia e o jantar." },
      { time: "21h", name: "Jantar", text: "Jantar com tempo e cocktails até às 23h." },
    ],
  },
  experience: {
    eyebrow: "A experiência",
    title: "Entre e viaje",
    titleScript: "até aos anos 50",
    text: "Bancos vermelhos ao balcão, sofás azul-pastel, mesas aos quadrados, néons e discos de vinil na parede. O Fabio's Roadstop é um diner americano onde se vem com a família ou com os amigos e se fica à vontade, como em casa.",
    cta: "A nossa história",
    interiorAlt:
      "Interior do Fabio's Roadstop: balcão branco com bancos vermelhos, sofás azul-pastel, mesas aos quadrados e letreiros iluminados",
    polaroids: [
      { image: "facade", caption: "Procure o letreiro vermelho", alt: "Fachada com o letreiro vermelho «Fabio's Roadstop»" },
      { image: "eating", caption: "Hambúrguer a sério", alt: "Cliente a dar uma dentada num hambúrguer, com o néon «Love» ao fundo" },
      { image: "menuArt", caption: "O nosso menu de estrada", alt: "Capa do menu com um carro clássico desenhado" },
    ],
  },
  visit: {
    eyebrow: "Visite-nos",
    title: "Pare na",
    titleScript: "nossa estrada",
    addressLabel: "Morada",
    hoursLabel: "Horário",
    hours: [
      { days: "Terça a domingo", time: "10h – 23h" },
      { days: "Segunda-feira", time: "Encerrado" },
    ],
    phoneLabel: "Telefone",
    phoneNote: "Chamada para a rede fixa nacional",
    emailLabel: "Email",
    directions: "Como chegar",
    call: "Ligar",
    write: "Enviar email",
    facadeAlt: "Fachada do Fabio's Roadstop com o letreiro vermelho",
    facadeCaption: "Procure o letreiro vermelho no Edifício Mar Salgado.",
    mapButton: "Mostrar o mapa",
    mapNote: "O mapa vem do Google Maps, que pode guardar cookies.",
    mapTitle: "Mapa do Fabio's Roadstop em Armação de Pêra",
  },
  social: {
    eyebrow: "Siga a estrada",
    title: "Fotografias, novidades e o que se diz de nós.",
    instagram: "Instagram",
    facebook: "Facebook",
    tripadvisor: "TripAdvisor",
    tripadvisorText: "Leia as avaliações de quem já nos visitou",
  },
  footer: {
    tagline: "American diner em Armação de Pêra. Panquecas, hambúrgueres, batidos e cocktails.",
    complaints: "Livro de Reclamações",
    credit: "Site por Steevanz",
    rights: "Todos os direitos reservados.",
    menu: "Menu digital",
    follow: "Siga-nos",
  },
  about: {
    eyebrow: "Sobre nós",
    title: "A nossa",
    titleScript: "história",
    intro: "Um restaurante americano com um conceito próprio, onde a qualidade dos produtos vem sempre primeiro.",
    quote: "O Fabio's Roadstop é um sonho pessoal que eu realizei.",
    quoteBy: "Fabio",
    story: [
      "Um restaurante americano que junta o nosso conceito único ao que mais valorizamos: a qualidade dos produtos. Fazemos testes todos os dias para melhorar o resultado final da nossa comida.",
      "Damos atenção a cada detalhe e, por isso, cada prato chega à mesa de forma cuidada e especial.",
      "Somos uma equipa unida, com vontade de servir melhor e de fazer melhor. Aprendemos, testamos e voltamos a tentar até cada produto estar ao mais alto nível. O objetivo é simples: oferecer algo único, com qualidade e um ótimo atendimento.",
      "Queremos que se sinta em casa, que partilhe bons momentos com a família ou com os amigos e que aproveite o melhor que temos para oferecer, das bebidas a uma refeição deliciosa.",
    ],
    values: [
      { title: "Comida fresca", text: "Ingredientes frescos e de qualidade, em todos os pratos." },
      { title: "Serviço rápido à mesa", text: "Uma equipa simpática que serve bem e depressa." },
      { title: "Feito com carinho", text: "Receitas testadas todos os dias, até ficarem como devem." },
    ],
    galleryAlt: {
      interior: "Balcão do Fabio's Roadstop com bancos vermelhos e letreiros iluminados por cima",
      lemonades: "Três limonadas em frascos com palhinhas às riscas, com néons ao fundo",
      facade: "Fachada com o letreiro vermelho «Fabio's Roadstop»",
    },
    cta: "Venha conhecer-nos",
  },
  contact: {
    eyebrow: "Contactos",
    title: "Fale",
    titleScript: "connosco",
    intro: "Ligue-nos ou escreva-nos para reservar uma mesa, marcar uma festa de aniversário ou encomendar comida.",
    topicsTitle: "Escreva-nos sobre",
    topics: [
      { label: "Reserva de mesa", subject: "Reserva de mesa" },
      { label: "Festa de aniversário", subject: "Reserva de aniversário" },
      { label: "Encomendar comida", subject: "Encomendar comida" },
      { label: "Trabalhar connosco", subject: "Aderir à equipa" },
    ],
  },
  notFound: {
    title: "Esta estrada não dá a lado nenhum.",
    text: "A página que procura não existe ou mudou de sítio.",
    back: "Voltar ao início",
  },
  newTab: "(abre num novo separador)",
  logoAlt: "Fabio's Roadstop",
  carAlt: "",
};

const en: FabiosCopy = {
  htmlLang: "en",
  ogLocale: "en_GB",
  meta: {
    home: {
      title: "Fabio's Roadstop | American diner in Armação de Pêra",
      description:
        "Pancakes, burgers, milkshakes and cocktails in a 1950s American diner in Armação de Pêra, Algarve. All-day kitchen, Tuesday to Sunday.",
    },
    about: {
      title: "About us | Fabio's Roadstop",
      description:
        "The story of Fabio's Roadstop: a personal dream turned American diner in Armação de Pêra, with quality food and service that makes you feel at home.",
    },
    contact: {
      title: "Contact | Fabio's Roadstop",
      description:
        "Address, phone, email and opening hours of Fabio's Roadstop, Edifício Mar Salgado, Armação de Pêra. Open Tuesday to Sunday, 10 am to 11 pm.",
    },
  },
  skip: "Skip to content",
  nav: {
    menu: "Menu",
    about: "About us",
    contact: "Contact",
    call: "Call",
    open: "Open the navigation menu",
    close: "Close the navigation menu",
    home: "Home",
  },
  langLabel: "English",
  otherLang: "Português",
  hero: {
    kicker: "American diner · Armação de Pêra",
    lead: "Pancakes, burgers, milkshakes and cocktails in a 1950s diner, right in the Algarve.",
    menu: "See the menu",
    directions: "Get directions",
    call: "Call us",
    badge: "All day kitchen ✦ Cozinha aberta todo o dia ✦ ",
    craving: "Today I'm craving",
    videoLabel: "Video of the restaurant: friends at a table, burgers in baskets and a toast with milkshakes",
    pause: "Pause the video",
    play: "Play the video",
  },
  marquee: ["Pancakes", "Burgers", "Milkshakes", "Cocktails", "Hot dogs", "All-day kitchen"],
  dishes: {
    eyebrow: "What we serve",
    title: "American classics,",
    titleScript: "made with love",
    intro: "Four good reasons to pull over. The full menu, with photos and prices, is on our digital menu.",
    items: [
      {
        id: "pancakes",
        name: "Pancakes",
        line: "The American breakfast classic, at any time of day.",
        image: "menuArt",
        alt: "Fabio's Roadstop menu cover with a classic car and a «Food» sign",
      },
      {
        id: "burgers",
        name: "Burgers",
        line: "Served the American way: in a basket, on red-check paper.",
        image: "burgers",
        alt: "Burgers in baskets lined with red-check paper, on their way to the table",
      },
      {
        id: "shakes",
        name: "Milkshakes",
        line: "Tall glass, straw and that proper diner taste.",
        image: "drinksTray",
        alt: "A tray of colourful milkshakes and juices on the Fabio's Roadstop counter",
      },
      {
        id: "cocktails",
        name: "Cocktails",
        line: "For a toast at the end of the day, until 11 pm.",
        image: "toast",
        alt: "Friends raising milkshakes and cocktails at the table",
      },
    ],
    cta: "See the full menu",
  },
  allDay: {
    eyebrow: "All-day kitchen",
    hoursUnit: "hours",
    title: "of open kitchen, no breaks.",
    text: "Tuesday to Sunday, 10 am to 11 pm. Come whenever you like: the kitchen doesn't close in the afternoon.",
    monday: "On Mondays, we rest.",
    steps: [
      { time: "10 am", name: "Breakfast", text: "Pancakes to get the day going." },
      { time: "1 pm", name: "Lunch", text: "Burgers and hot dogs, the American way." },
      { time: "5 pm", name: "Afternoon", text: "Milkshakes between the beach and dinner." },
      { time: "9 pm", name: "Dinner", text: "An unhurried dinner and cocktails until 11 pm." },
    ],
  },
  experience: {
    eyebrow: "The experience",
    title: "Step in and travel",
    titleScript: "back to the fifties",
    text: "Red stools at the counter, pastel-blue booths, checkered tables, neon signs and vinyl records on the wall. Fabio's Roadstop is an American diner to enjoy with family or friends, and to feel at home.",
    cta: "Our story",
    interiorAlt:
      "Inside Fabio's Roadstop: white counter with red stools, pastel-blue booths, checkered tables and illuminated signs",
    polaroids: [
      { image: "facade", caption: "Look for the red sign", alt: "Shop front with the red «Fabio's Roadstop» sign" },
      { image: "eating", caption: "A proper burger", alt: "A guest biting into a burger, with a «Love» neon behind" },
      { image: "menuArt", caption: "Our road-trip menu", alt: "Menu cover with a drawing of a classic car" },
    ],
  },
  visit: {
    eyebrow: "Visit us",
    title: "Pull over",
    titleScript: "on our road",
    addressLabel: "Address",
    hoursLabel: "Opening hours",
    hours: [
      { days: "Tuesday to Sunday", time: "10 am – 11 pm" },
      { days: "Monday", time: "Closed" },
    ],
    phoneLabel: "Phone",
    phoneNote: "Call to a Portuguese landline",
    emailLabel: "Email",
    directions: "Get directions",
    call: "Call us",
    write: "Send an email",
    facadeAlt: "Fabio's Roadstop shop front with the red sign",
    facadeCaption: "Look for the red sign on the Edifício Mar Salgado.",
    mapButton: "Show the map",
    mapNote: "The map comes from Google Maps, which may set cookies.",
    mapTitle: "Map of Fabio's Roadstop in Armação de Pêra",
  },
  social: {
    eyebrow: "Follow the road",
    title: "Photos, news and what people say about us.",
    instagram: "Instagram",
    facebook: "Facebook",
    tripadvisor: "Tripadvisor",
    tripadvisorText: "Read reviews from our guests",
  },
  footer: {
    tagline: "American diner in Armação de Pêra. Pancakes, burgers, milkshakes and cocktails.",
    complaints: "Complaints book",
    credit: "Website by Steevanz",
    rights: "All rights reserved.",
    menu: "Digital menu",
    follow: "Follow us",
  },
  about: {
    eyebrow: "About us",
    title: "Our",
    titleScript: "story",
    intro: "An American restaurant with a concept of its own, where the quality of the food always comes first.",
    quote: "Fabio's Roadstop is a personal dream I made come true.",
    quoteBy: "Fabio",
    story: [
      "An American restaurant that brings together our own concept and what we value most: the quality of our food. We run tests every day to make the end result even better.",
      "We pay attention to every detail, so every dish reaches the table with care and a special touch.",
      "We are a close-knit team, keen to serve better and do better. We learn, we test and we try again until every product is at its very best. Our goal is simple: to offer something unique, with quality and great service.",
      "We want you to feel at home, to share happy moments with family or friends and to enjoy the best we have to offer, from our drinks to a delicious meal.",
    ],
    values: [
      { title: "Fresh food", text: "Fresh, quality ingredients in every dish." },
      { title: "Quick table service", text: "A friendly team that serves well and fast." },
      { title: "Made with love", text: "Recipes tested every day until they're just right." },
    ],
    galleryAlt: {
      interior: "The Fabio's Roadstop counter with red stools and illuminated signs above",
      lemonades: "Three lemonades in jars with striped straws, neon signs behind",
      facade: "Shop front with the red «Fabio's Roadstop» sign",
    },
    cta: "Come and meet us",
  },
  contact: {
    eyebrow: "Contact",
    title: "Get in",
    titleScript: "touch",
    intro: "Call or write to us to book a table, plan a birthday party or order food.",
    topicsTitle: "Write to us about",
    topics: [
      { label: "Booking a table", subject: "Table booking" },
      { label: "A birthday party", subject: "Birthday booking" },
      { label: "Ordering food", subject: "Food order" },
      { label: "Joining the team", subject: "Joining the team" },
    ],
  },
  notFound: {
    title: "This road leads nowhere.",
    text: "The page you are looking for doesn't exist or has moved.",
    back: "Back to the homepage",
  },
  newTab: "(opens in a new tab)",
  logoAlt: "Fabio's Roadstop",
  carAlt: "",
};

export const fabiosCopy: Record<FabiosLocale, FabiosCopy> = { pt, en };

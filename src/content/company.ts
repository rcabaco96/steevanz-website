import type { Localized } from "@/lib/i18n";
import type { TitledText } from "./types";

export interface AboutCopy {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  lead: string;
  storyTitle: string;
  story: string[];
  valuesEyebrow: string;
  valuesTitle: string;
  values: TitledText[];
  howTitle: string;
  how: TitledText[];
  photoCaption: string;
  ctaTitle: string;
  ctaBody: string;
}

export interface ContactCopy {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  lead: string;
  channels: { whatsapp: string; whatsappBody: string; email: string; emailBody: string; phone: string; phoneBody: string; instagram: string; instagramBody: string };
  hoursTitle: string;
  hours: string;
  responseTime: string;
  demoTitle: string;
  demoBody: string;
  infoTitle: string;
  infoBody: string;
  locationTitle: string;
  location: string;
}

export const aboutCopy: Localized<AboutCopy> = {
  pt: {
    metaTitle: "Sobre a Steevanz — tecnologia com os bons modos de sempre",
    metaDescription: "Somos uma equipa portuguesa que torna a tecnologia simples e acessível para negócios locais: placas NFC, reservas e inteligência artificial com suporte próximo.",
    eyebrow: "Sobre nós",
    title: "Tecnologia do amanhã, com os bons modos de sempre.",
    lead: "A Steevanz nasceu de uma família alentejana de nerds e geeks com uma ideia simples: a tecnologia deve adaptar-se às pessoas, e não o contrário.",
    storyTitle: "A nossa história",
    story: [
      "Desde 2021 que desenvolvemos software à medida para empresas de várias dimensões. Pelo caminho, reparámos numa coisa: os negócios locais — o restaurante do bairro, o salão de sempre, a clínica de confiança — eram quem mais beneficiava da tecnologia e quem menos acesso tinha a ela.",
      "Ferramentas pensadas para grandes empresas são caras, complicadas e vêm com contratos que ninguém lê. Decidimos fazer o contrário: produtos simples, preços claros, instalação feita por nós e uma pessoa real do outro lado do WhatsApp.",
      "Começámos pelas placas NFC para reviews no Google, porque resolvem um problema que todos os negócios têm, com um investimento pequeno e resultados visíveis. A partir daí juntámos reservas, filas, fidelização e inteligência artificial, sempre com a mesma regra: se não poupa tempo ou não traz clientes, não vale a pena.",
    ],
    valuesEyebrow: "O que nos guia",
    valuesTitle: "Ser Steevanz é ser",
    values: [
      { title: "Empático", body: "Explicamos sem jargão. Não tem de saber o que é um front end para trabalhar connosco." },
      { title: "Honesto", body: "Se uma ferramenta não faz sentido para o seu negócio, dizemos-lhe. Preferimos um cliente satisfeito a uma venda." },
      { title: "Eficiente", body: "Soluções que funcionam no primeiro dia e não precisam de manuais de cem páginas." },
      { title: "Leal", body: "Acompanhamos os nossos clientes a longo prazo, com suporte próximo e respostas rápidas." },
    ],
    howTitle: "Como trabalhamos",
    how: [
      { title: "Primeiro ouvimos", body: "Cada demonstração começa com perguntas sobre o seu negócio, não com uma apresentação de produto." },
      { title: "Depois configuramos", body: "Tratamos da instalação, dos testes e da formação da equipa. Recebe tudo pronto a usar." },
      { title: "E ficamos por perto", body: "Suporte por WhatsApp e e-mail, melhorias contínuas e zero letras miudinhas." },
    ],
    photoCaption: "Pequena equipa, grande atenção ao detalhe.",
    ctaTitle: "Vamos conhecer o seu negócio?",
    ctaBody: "Marque uma conversa de 20 minutos. Sem pressões, sem jargão, com café virtual incluído.",
  },
  en: {
    metaTitle: "About Steevanz — technology with good old-fashioned manners",
    metaDescription: "We're a Portuguese team making technology simple and accessible for local businesses: NFC plates, bookings and AI, with hands-on support.",
    eyebrow: "About us",
    title: "Tomorrow's technology, with good old-fashioned manners.",
    lead: "Steevanz was born from an Alentejo family of nerds and geeks with a simple idea: technology should adapt to people, not the other way round.",
    storyTitle: "Our story",
    story: [
      "Since 2021 we have been building bespoke software for companies of all sizes. Along the way we noticed something: local businesses — the neighbourhood restaurant, the salon you've always used, the clinic you trust — stood to gain the most from technology and had the least access to it.",
      "Tools designed for large companies are expensive, complicated and come with contracts nobody reads. We decided to do the opposite: simple products, clear prices, setup done by us and a real person on the other end of WhatsApp.",
      "We started with NFC plates for Google reviews, because they solve a problem every business has, with a small investment and visible results. From there we added bookings, queues, loyalty and artificial intelligence, always with the same rule: if it doesn't save time or bring customers, it isn't worth it.",
    ],
    valuesEyebrow: "What guides us",
    valuesTitle: "Being Steevanz means being",
    values: [
      { title: "Empathetic", body: "We explain without jargon. You don't need to know what a front end is to work with us." },
      { title: "Honest", body: "If a tool doesn't make sense for your business, we'll tell you. We'd rather have a happy client than a sale." },
      { title: "Efficient", body: "Solutions that work from day one and don't need hundred-page manuals." },
      { title: "Loyal", body: "We stay with our clients for the long run, with close support and quick answers." },
    ],
    howTitle: "How we work",
    how: [
      { title: "First, we listen", body: "Every demo starts with questions about your business, not with a product pitch." },
      { title: "Then, we set it up", body: "We handle installation, testing and team training. You get everything ready to use." },
      { title: "And we stay close", body: "Support by WhatsApp and email, continuous improvements and no small print." },
    ],
    photoCaption: "A small team with a big eye for detail.",
    ctaTitle: "Shall we get to know your business?",
    ctaBody: "Book a 20-minute chat. No pressure, no jargon, virtual coffee included.",
  },
};

export const contactCopy: Localized<ContactCopy> = {
  pt: {
    metaTitle: "Contacto — fale com a Steevanz por WhatsApp, e-mail ou telefone",
    metaDescription: "Fale com a Steevanz por WhatsApp, e-mail ou telefone. Respondemos em dias úteis. Agende uma demonstração gratuita das placas NFC e soluções de IA.",
    eyebrow: "Contacto",
    title: "Fale connosco. Respondemos como gostamos que nos respondam.",
    lead: "Escolha o canal que lhe der mais jeito. Por norma respondemos no próprio dia útil.",
    channels: {
      whatsapp: "WhatsApp",
      whatsappBody: "A forma mais rápida de falar connosco.",
      email: "E-mail",
      emailBody: "Para pedidos detalhados ou documentos.",
      phone: "Telefone",
      phoneBody: "Em dias úteis, das 10h às 18h.",
      instagram: "Instagram",
      instagramBody: "Novidades e bastidores.",
    },
    hoursTitle: "Horário",
    hours: "Segunda a sexta, das 10h às 18h",
    responseTime: "Resposta habitual no mesmo dia útil.",
    demoTitle: "Prefere ver a funcionar?",
    demoBody: "Escolha dia e hora para uma demonstração gratuita de 20 minutos, online ou por telefone.",
    infoTitle: "Quer informação por escrito?",
    infoBody: "Deixe o seu contacto e enviamos-lhe detalhes e preços do produto que lhe interessa.",
    locationTitle: "Onde estamos",
    location: "Lisboa, com clientes em todo o país. Trabalhamos à distância e deslocamo-nos quando é preciso.",
  },
  en: {
    metaTitle: "Contact — talk to Steevanz by WhatsApp, email or phone",
    metaDescription: "Talk to Steevanz by WhatsApp, email or phone. We reply on working days. Book a free demo of our NFC plates and AI solutions.",
    eyebrow: "Contact",
    title: "Talk to us. We reply the way we like to be replied to.",
    lead: "Pick whichever channel suits you best. We usually reply on the same working day.",
    channels: {
      whatsapp: "WhatsApp",
      whatsappBody: "The quickest way to reach us.",
      email: "Email",
      emailBody: "For detailed requests or documents.",
      phone: "Phone",
      phoneBody: "Working days, 10am to 6pm.",
      instagram: "Instagram",
      instagramBody: "News and behind the scenes.",
    },
    hoursTitle: "Opening hours",
    hours: "Monday to Friday, 10am to 6pm (Lisbon time)",
    responseTime: "We usually reply on the same working day.",
    demoTitle: "Would you rather see it working?",
    demoBody: "Pick a day and time for a free 20-minute demo, online or by phone.",
    infoTitle: "Want information in writing?",
    infoBody: "Leave your details and we'll send you information and prices for the product you're interested in.",
    locationTitle: "Where we are",
    location: "Lisbon, with clients across Portugal. We work remotely and travel when needed.",
  },
};

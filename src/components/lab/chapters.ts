import { href } from "@/lib/routes";
import { whatsappUrl } from "@/lib/site";

// Homepage content (PT). Facts come from the current site and the previous one
// (manifesto, website packages, portfolio); prices are the published "desde" values.

export type ModuleVisual = "plate" | "browser" | "dashboard" | "chat" | "booking";

export interface Offer {
  name: string;
  note?: string;
  price?: string;
}

export interface ServiceModule {
  id: string;
  index: string;
  label: string;
  title: string[];
  lead: string;
  offers: Offer[];
  cta: { label: string; href: string };
  visual: ModuleVisual;
  figure: string;
  idealFor: string[];
}

export const intro = {
  wordmark: "STEEVANZ",
  line: "Empresa portuguesa · desde 2021",
  hint: "Desliza para descobrir",
};

export const about = {
  kicker: "Quem somos",
  title: ["Somos a", "Steevanz."],
  body: "Uma equipa portuguesa de software. Desde 2021 tornamos a tecnologia empática e realmente acessível a todos, com os bons modos de sempre.",
  facts: [
    { value: "2021", label: "a construir software" },
    { value: "8", label: "projetos para marcas como Sporting CP, BMW e Crédito Agrícola" },
    { value: "5", label: "áreas, uma só equipa" },
  ],
  cta: { label: "Conhecer a equipa", href: href("pt", { key: "about" }) },
};

export const modules: ServiceModule[] = [
  {
    id: "nfc",
    index: "01",
    label: "Placas NFC",
    title: ["Placas NFC", "para reviews."],
    lead: "Placas NFC que levam o cliente direto à página de review do seu negócio no Google. Sem app, em iPhone e Android.",
    offers: [
      { name: "Placas NFC para reviews no Google", note: "por placa, configuração incluída", price: "desde 29 €" },
      { name: "NFC para redes sociais", note: "placas e cartões", price: "desde 24 €" },
      { name: "Cartão de fidelização digital", note: "por loja", price: "19 €/mês" },
    ],
    cta: { label: "Ver placas NFC", href: href("pt", { key: "product", productId: "nfc-google-reviews" }) },
    visual: "plate",
    figure: "Placa NFC de mesa",
    idealFor: ["Restaurantes", "Salões", "Clínicas", "Lojas"],
  },
  {
    id: "websites",
    index: "02",
    label: "Websites",
    title: ["Websites", "à medida."],
    lead: "Da primeira presença online à plataforma corporate. Design à medida, rápidos e prontos a converter.",
    offers: [
      { name: "Site Startup", note: "landing page, 1 página", price: "350 €" },
      { name: "Site Multipage", note: "gestão de conteúdos, até 6 páginas", price: "500 €" },
      { name: "Site Corporate", note: "uma plataforma à sua medida", price: "sob consulta" },
    ],
    cta: { label: "Pedir proposta", href: href("pt", { key: "requestInfo" }) },
    visual: "browser",
    figure: "Site à medida",
    idealFor: ["Negócios locais", "Startups", "Empresas"],
  },
  {
    id: "software",
    index: "03",
    label: "Software",
    title: ["Software", "à medida."],
    lead: "Plataformas, backoffices e apps internas para equipas que querem trabalhar melhor. Já o fizemos para BMW, Sporting CP e Aubay.",
    offers: [
      { name: "Plataformas web e mobile", note: "do protótipo à produção" },
      { name: "Backoffices e integrações", note: "gestão, analytics e SEO" },
      { name: "Infraestrutura & Cloud", note: "Azure, AWS, redes e suporte" },
      { name: "Acompanhamento contínuo", note: "não desaparecemos depois do deploy" },
    ],
    cta: { label: "Falar de um projeto", href: href("pt", { key: "contact" }) },
    visual: "dashboard",
    figure: "Painel de gestão",
    idealFor: ["Empresas", "Equipas internas", "Marcas"],
  },
  {
    id: "ia",
    index: "04",
    label: "Inteligência artificial",
    title: ["Chatbot e receção", "por voz."],
    lead: "Assistentes que atendem, respondem e organizam, 24 horas por dia, em português.",
    offers: [
      { name: "Chatbot IA", note: "site e WhatsApp", price: "49 €/mês" },
      { name: "Receção por voz IA", note: "atende o telefone por si", price: "99 €/mês" },
      { name: "Gestão de reviews IA", note: "respostas no tom da sua marca", price: "29 €/mês" },
      { name: "Automação de processos", note: "preço fechado por projeto", price: "desde 250 €" },
    ],
    cta: { label: "Ver soluções de IA", href: href("pt", { key: "product", productId: "ai-chatbot" }) },
    visual: "chat",
    figure: "Assistente no WhatsApp",
    idealFor: ["Restaurantes", "Clínicas", "Serviços"],
  },
  {
    id: "reservas",
    index: "05",
    label: "Reservas",
    title: ["Reservas e", "lista de espera."],
    lead: "Marcações e filas online, com lembretes automáticos, para que a agenda se encha sozinha.",
    offers: [
      { name: "Reservas online", note: "mesas, marcações e serviços", price: "29 €/mês" },
      { name: "Lista de espera digital", note: "aviso por SMS ou WhatsApp", price: "19 €/mês" },
    ],
    cta: { label: "Ver reservas online", href: href("pt", { key: "product", productId: "bookings" }) },
    visual: "booking",
    figure: "Reserva online",
    idealFor: ["Restaurantes", "Salões", "Clínicas"],
  },
];

export const finale = {
  kicker: "Contacto",
  title: ["Vamos falar?"],
  line: "Conte-nos o que precisa. Responde-lhe um Steevanz de carne e osso, nunca um robô.",
  primary: { label: "Agendar conversa", href: href("pt", { key: "book" }) },
  secondary: { label: "Falar no WhatsApp", href: whatsappUrl("Olá! Gostava de saber mais sobre a Steevanz.") },
};

export const portfolio = {
  kicker: "Trabalho",
  title: "Um bom bairro valoriza a propriedade.",
  lead: "Alguns dos vizinhos com quem já fizemos negócio. Cada projeto, uma história à parte.",
  projects: [
    { client: "BMW", title: "Plataforma frontend modular", tags: ["Angular", "NgRx", "Testing"] },
    { client: "Crédito Agrícola", title: "Plataformas frontend à medida", tags: ["Angular", "Vue 3", "Design systems"] },
    { client: "Sporting CP", title: "Bilhética & Loja Verde", tags: ["E-commerce", "Backoffice", "QR code"] },
    { client: "Sporting CP", title: "Gamebox & app interna", tags: ["Plataforma web", "App interna"] },
    { client: "Aubay Portugal", title: "Timesheet app", tags: ["App interna", ".NET", "React"] },
    { client: "Aubay Portugal", title: "Resource manager", tags: ["Recrutamento", "Plataforma web"] },
    { client: "Mesh", title: "Rebranding & loja online", tags: ["Rebranding", "E-commerce", "Integrações"] },
    { client: "Efficient Safe", title: "App & backoffice", tags: ["Mobile", "Plugin de acessos", "Backoffice"] },
  ],
};

/** Timeline steps: hero, about, one per module (one petal each), contact. */
export const STEPS = ["Início", "O que fazemos", ...modules.map((m) => (m.id === "ia" ? "IA" : m.label)), about.kicker, finale.kicker];

/** Scroll progress runs from 0 (hero) to CHAPTER_SPAN (contact). */
export const CHAPTER_SPAN = STEPS.length - 1;


import type { Localized } from "@/lib/i18n";
import type { ProductId } from "./types";

/**
 * Shared copy for the website products (landing page, website, online shop): the sector
 * starting points («modelos») and the rules every site is built to. Text only: the owner's demo
 * projects are not linked until their placeholder reviews and testimonials are removed.
 */

export type WebProductId = Extract<ProductId, "landing-page" | "website" | "online-shop">;

export interface WebModelo {
  id: string;
  name: string;
  /** What this starting point already has, per product. */
  includes: Record<WebProductId, string>;
  /** Steevanz products that plug in. */
  connections: string;
}

export interface WebSharedCopy {
  modelosEyebrow: string;
  modelosTitle: string;
  modelosLead: string;
  modelosAll: string;
  connectionsLabel: string;
  modelos: WebModelo[];
  extrasEyebrow: string;
  extrasTitle: string;
  addOnsTitle: string;
  addOnsNote: string;
  notIncludedTitle: string;
  monthlyTitle: string;
  rulesEyebrow: string;
  rulesTitle: string;
  rules: string[];
  shopRules: string[];
  rulesNote: string;
}

export const webSharedCopy: Localized<WebSharedCopy> = {
  pt: {
    modelosEyebrow: "Modelos por setor",
    modelosTitle: "Começamos de uma base pensada para o seu negócio",
    modelosLead:
      "Cada setor tem um ponto de partida com a estrutura e as ligações que fazem sentido. Depois adaptamos tudo à sua marca: logótipo, cores, textos e fotos.",
    modelosAll:
      "Todos os modelos incluem: botão principal bem visível, contactos e WhatsApp, mapa, ligação às suas reviews reais do Google, aviso de cookies, privacidade, Livro de Reclamações, pensado para telemóvel e acessível.",
    connectionsLabel: "Liga com",
    modelos: [
      {
        id: "restaurante",
        name: "Restaurante ou café",
        includes: {
          "landing-page": "Destaque, menu da época, reservas, horário e mapa, take-away e contactos.",
          website: "Início, Menu, Reservas, Eventos e grupos, Galeria e Contactos. Take-away opcional.",
          "online-shop": "Encomendas para levantar, cabazes, bolos por encomenda e vales de oferta, com hora de recolha.",
        },
        connections: "Menu digital, reservas, lista de espera, cartão de fidelidade e placas de reviews.",
      },
      {
        id: "beleza",
        name: "Barbearia, cabeleireiro ou estética",
        includes: {
          "landing-page": "Serviços e preços, equipa, fotos de trabalhos e um botão para marcar.",
          website: "Início, Serviços e preços, Equipa, Galeria de trabalhos, Marcar e Contactos.",
          "online-shop": "Produtos que usa no salão, cartões de oferta e pacotes de tratamentos.",
        },
        connections: "Reservas com lembretes, lista de espera, cartão de fidelidade e chatbot.",
      },
      {
        id: "clinica",
        name: "Clínica",
        includes: {
          "landing-page": "Uma especialidade ou campanha, equipa, pedido de marcação e contactos claros.",
          website: "Início, Especialidades, Equipa clínica, Acordos, Pedido de consulta e Contactos. Formulários sem dados de saúde.",
          "online-shop": "Produtos de cuidado, vales de consulta e pacotes de sessões pagos online.",
        },
        connections: "Reservas, receção por voz com IA, chatbot e gestão de reviews.",
      },
      {
        id: "ginasio",
        name: "Ginásio ou estúdio",
        includes: {
          "landing-page": "Modalidades, horário das aulas, planos e pedido de aula experimental.",
          website: "Início, Modalidades, Horário de aulas, Preços e planos, Equipa, Aula experimental e Contactos.",
          "online-shop": "Planos, packs de aulas, cartões de oferta e merchandising.",
        },
        connections: "Reservas de aulas, cartão de fidelidade e chatbot.",
      },
      {
        id: "alojamento",
        name: "Alojamento local",
        includes: {
          "landing-page": "A casa, fotos, comodidades, a zona e pedido de reserva, com o número de registo RNAL visível.",
          website: "Início, Alojamentos (uma página cada), A zona, Pedido de reserva, Condições e Contactos, em várias línguas e com o RNAL.",
          "online-shop": "Vales de estadia, experiências e produtos da região.",
        },
        connections: "Chatbot para as perguntas dos hóspedes e gestão de reviews.",
      },
      {
        id: "loja",
        name: "Loja",
        includes: {
          "landing-page": "Abertura, promoção ou coleção nova, com morada, horário e WhatsApp.",
          website: "Início, Coleções ou Marcas, Sobre, Visite-nos e Contactos.",
          "online-shop": "Catálogo, página de produto, carrinho, checkout e página de envios e devoluções.",
        },
        connections: "Cartão de fidelidade, placas de reviews e chatbot.",
      },
    ],
    extrasEyebrow: "Preço e opções",
    extrasTitle: "O que fica de fora e o que pode juntar",
    addOnsTitle: "Opções extra",
    addOnsNote: "Valores sem IVA, indicativos. Entram na proposta só se as escolher.",
    notIncludedTitle: "Não incluído",
    monthlyTitle: "Plano mensal",
    rulesEyebrow: "Regras e boas práticas",
    rulesTitle: "O básico legal e prático, tratado de raiz",
    rules: [
      "Aviso de cookies com «Rejeitar» tão fácil como «Aceitar».",
      "Ligação ao Livro de Reclamações Eletrónico, bem visível.",
      "Identificação da empresa e preços com IVA incluído.",
      "Construído segundo as regras de acessibilidade WCAG 2.1 AA.",
      "Domínio registado em seu nome: o site é seu.",
      "Pagamento em duas partes: 50% na adjudicação e 50% antes de publicar.",
    ],
    shopRules: [
      "MB WAY, Multibanco e cartão, com a sua própria conta de pagamentos.",
      "Termos de venda, direito de livre resolução de 14 dias e política de devoluções.",
    ],
    rulesNote:
      "Preparamos a estrutura e os modelos dos textos legais. O conteúdo final é validado por si, pelo seu contabilista ou pelo seu advogado.",
  },
  en: {
    modelosEyebrow: "Templates by sector",
    modelosTitle: "We start from a base designed for your business",
    modelosLead:
      "Each sector has a starting point with the structure and connections that make sense. Then we adapt everything to your brand: logo, colours, texts and photos.",
    modelosAll:
      "Every template includes: a clear main button, contacts and WhatsApp, a map, a link to your real Google reviews, a cookie banner, privacy, the complaints book, a phone-first layout and accessibility.",
    connectionsLabel: "Connects with",
    modelos: [
      {
        id: "restaurante",
        name: "Restaurant or café",
        includes: {
          "landing-page": "Highlights, seasonal menu, bookings, hours and map, takeaway and contacts.",
          website: "Home, Menu, Bookings, Events and groups, Gallery and Contacts. Optional takeaway.",
          "online-shop": "Pickup orders, hampers, cakes to order and gift vouchers, with a collection time.",
        },
        connections: "Digital menu, bookings, waitlist, loyalty card and review plates.",
      },
      {
        id: "beleza",
        name: "Barber, salon or beauty",
        includes: {
          "landing-page": "Services and prices, team, photos of your work and a booking button.",
          website: "Home, Services and prices, Team, Portfolio, Book and Contacts.",
          "online-shop": "The products you use in the salon, gift cards and treatment packs.",
        },
        connections: "Bookings with reminders, waitlist, loyalty card and chatbot.",
      },
      {
        id: "clinica",
        name: "Clinic",
        includes: {
          "landing-page": "One speciality or campaign, team, appointment request and clear contacts.",
          website: "Home, Specialities, Clinical team, Insurance agreements, Appointment request and Contacts. Forms without health data.",
          "online-shop": "Care products, consultation vouchers and session packs paid online.",
        },
        connections: "Bookings, AI voice receptionist, chatbot and review management.",
      },
      {
        id: "ginasio",
        name: "Gym or studio",
        includes: {
          "landing-page": "Classes, timetable, plans and a free trial class request.",
          website: "Home, Classes, Timetable, Prices and plans, Team, Trial class and Contacts.",
          "online-shop": "Plans, class packs, gift cards and merchandise.",
        },
        connections: "Class bookings, loyalty card and chatbot.",
      },
      {
        id: "alojamento",
        name: "Holiday rental",
        includes: {
          "landing-page": "The property, photos, amenities, the area and a booking request, with the RNAL licence number shown.",
          website: "Home, Properties (one page each), The area, Booking request, Terms and Contacts, in several languages and with the RNAL number.",
          "online-shop": "Stay vouchers, experiences and local products.",
        },
        connections: "Chatbot for guest questions and review management.",
      },
      {
        id: "loja",
        name: "Shop",
        includes: {
          "landing-page": "An opening, a promotion or a new collection, with address, hours and WhatsApp.",
          website: "Home, Collections or Brands, About, Visit us and Contacts.",
          "online-shop": "Catalogue, product page, cart, checkout and a shipping and returns page.",
        },
        connections: "Loyalty card, review plates and chatbot.",
      },
    ],
    extrasEyebrow: "Price and options",
    extrasTitle: "What's left out and what you can add",
    addOnsTitle: "Extra options",
    addOnsNote: "Prices exclude VAT and are indicative. They go into the proposal only if you choose them.",
    notIncludedTitle: "Not included",
    monthlyTitle: "Monthly plan",
    rulesEyebrow: "Rules and good practice",
    rulesTitle: "The legal and practical basics, built in",
    rules: [
      "Cookie banner where «Reject» is as easy as «Accept».",
      "A clearly visible link to the Portuguese electronic complaints book.",
      "Company details and prices shown with VAT included.",
      "Built to the WCAG 2.1 AA accessibility guidelines.",
      "Domain registered in your name: the site is yours.",
      "Payment in two parts: 50% when you accept and 50% before launch.",
    ],
    shopRules: [
      "MB WAY, Multibanco and cards, with your own payment account.",
      "Terms of sale, the 14-day right of withdrawal and a returns policy.",
    ],
    rulesNote:
      "We prepare the structure and templates for the legal texts. The final wording is checked by you, your accountant or your lawyer.",
  },
};

export function isWebProductId(id: ProductId): id is WebProductId {
  return id === "landing-page" || id === "website" || id === "online-shop";
}

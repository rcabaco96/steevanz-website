// Copy and demo data for the «O que quer melhorar?» section of /novo-ultra (pure data).
// Goal titles, lines and products come from shared.ts (`goals`); prices from shared.ts helpers only.
// The demos show the product itself: real screen recordings where they exist, the live cards drawn in
// code otherwise. Rule: no numbers, ratings or prices inside the demos (times and a «+1» are UI, not stats).
import type { ProductId } from "../types";
import type { GoalId } from "./shared";

export const goalsCopy = {
  title: "O que quer *melhorar*?",
  lead: "Escolha por onde começar. Cada solução funciona sozinha ou em conjunto com as outras.",
  tablistLabel: "O que quer melhorar?",
  pause: "Pausar demonstração",
  resume: "Retomar demonstração",
  vat: " + IVA",
  contact: "Falar connosco",
} as const;

/** Chip label per product (these win over the product-copy names where they differ). */
export const goalChipLabels: Record<ProductId, string> = {
  website: "Website",
  "landing-page": "Landing page",
  "google-review-plates": "Placas para reviews",
  "ai-reviews": "Gestão de reviews com IA",
  bookings: "Reservas online",
  waitlist: "Lista de espera",
  "ai-voice": "Receção por voz com IA",
  "digital-menu": "Menu digital",
  "online-shop": "Loja online",
  "ai-chatbot": "Chatbot com IA",
  loyalty: "Cartão de cliente",
  "social-plates": "Placas para redes sociais",
  "guest-guide": "Guia do alojamento",
  automation: "Automação à medida",
};

export type GoalDemo =
  | {
      kind: "video";
      /** 480×1038 recording (phones and 1×). */
      src: string;
      /** 720p version, used from 1024px on 2dppx screens. */
      src720: string;
      poster: string;
      /** Small caption floating next to the phone. */
      caption: string;
      playLabel: string;
    }
  | { kind: "stamps"; caption: string; durationMs: number }
  | { kind: "flow"; caption: string; durationMs: number };

// Video files are produced in parallel into public/home-ultra/. Until they exist, the poster fails and
// the CSS mini demo (goals/GoalDemos.tsx) shows in its place, and auto-advance uses `missingVideoMs`.
export const goalDemos: Record<GoalId, GoalDemo> = {
  // The real client page /dolci-salati scrolling.
  encontrado: {
    kind: "video",
    src: "/home-ultra/hero-site.mp4",
    src720: "/home-ultra/hero-site-720.mp4",
    poster: "/home-ultra/hero-site.jpg",
    caption: "Landing page",
    playLabel: "Ver a landing page a funcionar",
  },
  // /reservar/navalha-douro: service, barber, day, time.
  casa: {
    kind: "video",
    src: "/home-ultra/hero-reservas.mp4",
    src720: "/home-ultra/hero-reservas-720.mp4",
    poster: "/home-ultra/hero-reservas.jpg",
    caption: "Reservas online",
    playLabel: "Ver as reservas online a funcionar",
  },
  // The Menu digital opening, then the grid of dishes (stock dishes of the demo menu: never a client's).
  vender: {
    kind: "video",
    src: "/home-ultra/hero-menu.mp4",
    src720: "/home-ultra/hero-menu-720.mp4",
    poster: "/home-ultra/hero-menu.jpg",
    caption: "Menu digital",
    playLabel: "Ver o Menu digital a funcionar",
  },
  voltar: { kind: "stamps", caption: "Cartão de cliente", durationMs: 4500 },
  medida: { kind: "flow", caption: "Automação à medida", durationMs: 4000 },
};

/** Step length when a goal's video file is missing (the CSS mini demo shows instead). */
export const missingVideoMs = 6000;

/** The live loyalty card (Fazer voltar). A sample shop, clearly a demo. */
export const stampDemo = {
  title: "O seu cartão",
  name: "Tasca do Largo",
  holder: "O seu cliente",
  required: 8,
  before: 3,
  after: 4,
  reward: "Sobremesa oferecida",
  toast: "Carimbo adicionado",
} as const;

/** The automation flow (À medida). */
export const flowDemo = {
  title: "Automação",
  status: "Ativa",
  intro: "Sempre que entra uma reserva:",
  nodes: [
    { title: "Nova reserva", note: "Chega pelo site", icon: "calendar" },
    { title: "Aviso à equipa", note: "No telemóvel de quem está de serviço", icon: "bell" },
    { title: "Resumo no WhatsApp", note: "Ao fim do dia, para si", icon: "whatsapp" },
  ],
} as const;

/** Fallback mini demos (shown while a recording does not exist). */
export const miniDemos = {
  site: {
    url: "oseunegocio.pt",
    name: "O seu negócio",
    tagline: "Aberto todos os dias",
    directions: "Como chegar",
    tap: "Um toque",
  },
  booking: {
    title: "Reservar",
    hint: "Escolha a hora",
    day: "Sábado",
    times: ["12:00", "12:30", "13:00", "13:30", "20:00", "20:30"],
    pick: 2,
    toast: "Reserva confirmada",
  },
  menu: {
    section: "Cafés e bebidas",
    dish: "Latte",
    image: "/home-ultra/prato-latte.jpg",
    add: "Adicionar",
    bar: "Pedido da mesa",
  },
} as const;

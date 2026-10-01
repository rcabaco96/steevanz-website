// Placeholder copy for the /lab prototype. Final wording is still to be agreed.

export interface Chapter {
  kicker: string;
  title: string[];
  body?: string;
  specs?: string[];
  link?: { label: string; href: string };
  clients?: string[];
}

export const intro = {
  wordmark: "STEEVANZ",
  line: "Estúdio de software · desde 2021",
  hint: "Desliza — ou arranca uma pétala",
};

export const chapters: Chapter[] = [
  {
    kicker: "01 — Placas Steevanz",
    title: ["Um toque.", "Uma review."],
    body: "O cliente encosta o telemóvel e a review do Google abre.",
    specs: ["Sem app", "iPhone e Android", "Desde 29 €"],
    link: { label: "Conhecer as placas", href: "/produtos/placas-nfc-google-reviews" },
  },
  {
    kicker: "02 — Websites",
    title: ["Sites que", "vendem."],
    body: "Rápidos, bonitos e feitos para converter.",
    specs: ["Design à medida", "SEO", "Lançamento chave na mão"],
  },
  {
    kicker: "03 — Software à medida",
    title: ["Feito à", "sua medida."],
    body: "Plataformas e backoffices que simplificam o dia a dia.",
    specs: ["Web e mobile", "Integrações", "Suporte contínuo"],
  },
  {
    kicker: "04 — Inteligência artificial",
    title: ["IA que", "nunca fecha."],
    body: "Assistentes que respondem, marcam e organizam.",
    specs: ["24/7", "Voz e chat", "Automação"],
  },
  {
    kicker: "05 — Quem confia em nós",
    title: ["Grandes", "casas."],
    clients: ["BMW", "Crédito Agrícola", "Sporting CP", "Aubay"],
  },
];

export const finale = {
  kicker: "Contacto",
  title: ["Vamos falar?"],
  line: "Conte-nos o que precisa.",
  primary: { label: "Falar connosco", href: "/contacto" },
  secondary: { label: "Agendar conversa", href: "/agendar" },
};

/** Scroll progress runs from 0 (intro) to CHAPTER_SPAN (finale). */
export const CHAPTER_SPAN = chapters.length + 1;

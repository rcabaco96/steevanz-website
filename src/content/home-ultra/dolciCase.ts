// Real case on /novo-ultra: Dolci e Salati (gelataria e brunch, Armação de Pêra).
// Only what Steevanz really did: the house page (/dolci-salati) and the video menu (/raza17raza).
// No results, quotes, reviews or numbers. The Google quotes on Dolci's own page are not ours to show,
// and the dish videos in the menu are stock footage, so they never appear here as Dolci's dishes.

export const dolciCase = {
  title: "Dolci e *Salati*",
  subtitle: "Gelataria e brunch em Armação de Pêra.",
  body: "Fizemos a página da casa, a partir do site e dos reels do Instagram, e o menu em vídeo com o logótipo da casa e as suas coleções.",
  links: [
    { label: "A página da casa", action: "Ver a página", href: "/dolci-salati" },
    { label: "O menu em vídeo", action: "Ver o menu", href: "/raza17raza" },
  ],
  photo: {
    src: "/media/clients/dolci-salati/esplanada.jpg",
    width: 1546,
    height: 1017,
    alt: "Esplanada da Dolci e Salati em Armação de Pêra",
  },
  logo: { src: "/media/clients/dolci-e-salati-logo.png", alt: "Dolci e Salati" },
  /** The real /dolci-salati page scrolling on a phone (same file as the goals demo, so it is cached). */
  pageVideo: {
    src: "/home-ultra/hero-site.mp4",
    poster: "/home-ultra/hero-site.jpg",
    alt: "A página da Dolci e Salati num telemóvel",
    playLabel: "Ver a página da Dolci e Salati a deslizar",
  },
  /** Desktop only: a still of the video menu's opening (Dolci logo, no dishes). */
  menuStill: {
    src: "/home-ultra/caso-dolci-menu.jpg",
    alt: "Abertura do menu em vídeo da Dolci e Salati, com o logótipo da casa",
    caption: "A abertura do menu em vídeo, com o logótipo da casa.",
  },
} as const;

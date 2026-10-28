/** The ids of the page's sections, used by the menu's anchors. */
export const ponteiroSections = {
  day: "o-dia",
  carta: "carta",
  menu: "menu-digital",
  book: "reservar",
  waitlist: "lista-de-espera",
  casa: "a-casa",
  visit: "visitar",
  faq: "perguntas",
} as const;

/** Where the page's clock starts and ends: 07:30 → 02:00 of the next day, in minutes since midnight. */
export const clockStart = 450;
export const clockEnd = 1560;

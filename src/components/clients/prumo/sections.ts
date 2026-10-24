/** The ids of the page's sections, used by the menu's anchors. */
export const prumoSections = {
  disciplines: "tratamentos",
  firstVisit: "primeira-consulta",
  studio: "pilates",
  team: "equipa",
  space: "espaco",
  book: "marcar",
  visit: "visitar",
  faq: "perguntas",
} as const;

/** Tells the booking form (BookingForm.tsx) which treatment to start from (a «Marcar» link beside a price). */
export const pickServiceEvent = "pr:pick";

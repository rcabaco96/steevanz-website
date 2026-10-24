/** The ids of the page's sections, used by the menu's anchors. */
export const seteChavesSections = {
  rooms: "quartos",
  day: "um-dia",
  around: "arredores",
  guide: "guia",
  rules: "regras",
  book: "reservar",
  faq: "perguntas",
} as const;

/** Tells the booking form (BookingForm.tsx) which key to start from (a «Reservar esta chave» link). */
export const pickKeyEvent = "sc:pick";

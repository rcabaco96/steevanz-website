/** The ids of the page's sections, used by the menu's anchors. */
export const roazSections = {
  tours: "saidas",
  coast: "costa",
  waitlist: "sem-reserva",
  aboard: "antes-de-embarcar",
  skipper: "skipper",
  book: "reservar",
  faq: "perguntas",
} as const;

/** Tells the booking form (BookingForm.tsx) which trip to start from (a «Reservar esta saída» link). */
export const pickTourEvent = "rz:pick";

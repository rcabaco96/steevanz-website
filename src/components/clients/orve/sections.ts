/** The ids of the page's sections, used by the menu's anchors. */
export const orveSections = {
  rituals: "rituais",
  ritual: "ritual",
  house: "casa",
  team: "equipa",
  book: "marcar",
  faq: "perguntas",
} as const;

/** Tells the booking form (BookingForm.tsx) which family of rituals to start from (a «Marcar este ritual» link). */
export const pickRitualEvent = "or:pick";

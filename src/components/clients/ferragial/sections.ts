/** The ids of the page's sections, used by the menu's anchors. */
export const ferragialSections = {
  wines: "vinhos",
  visits: "visitas",
  book: "reservar",
  talha: "talha",
  year: "ano",
  club: "clube",
  visit: "chegar",
  faq: "perguntas",
} as const;

/** Tells the booking form (BookingForm.tsx) which experience to start from (an «Escolher esta» link). */
export const pickExperienceEvent = "fg:pick-experience";

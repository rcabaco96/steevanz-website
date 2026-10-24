/** The ids of the page's sections, used by the menu's anchors. */
export const riscaSections = {
  services: "servicos",
  queue: "barbearia",
  colour: "cor",
  team: "equipa",
  card: "cartao",
  book: "marcar",
  visit: "visitar",
  faq: "perguntas",
} as const;

/** Tells the booking form (BookingForm.tsx) which service or stylist to start from («Marcar» links). */
export const pickServiceEvent = "rc:pick-service";
export const pickStylistEvent = "rc:pick-stylist";
/** Tells the price list (Services.tsx) which family to open («Ver preços da cor»). */
export const openCategoryEvent = "rc:open-category";

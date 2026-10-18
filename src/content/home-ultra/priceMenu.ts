// Copy for the «Preços à vista» menu card on /novo-ultra (PriceMenu section). Pure data.
// The prices themselves never live here: they come from src/content/products.ts through shared.ts.

export const priceMenuCopy = {
  title: "Preços à *vista*",
  lead: "Preços de partida, sem IVA. Antes de decidir, recebe sempre uma proposta fechada.",
  legend: "Escolher grupo de preços",
  /** Shown under a monthly price when the product has no other qualifier. */
  perMonth: "por mês",
  footnote: "Preços indicativos, sem IVA.",
} as const;

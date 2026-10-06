/**
 * Who runs «Importar histórico completo» (REVIEWS_FULL_IMPORT_SOURCE): the Steevanz reader by
 * default (free; owner's decision 2026-10-04: no paid provider), else Apify or DataForSEO (paid,
 * kept in the code for later). The reader also searches the competitors of a new customer.
 */
export type FullImportSource = "reader" | "apify" | "dataforseo";

export function fullImportSource(): FullImportSource {
  const value = process.env.REVIEWS_FULL_IMPORT_SOURCE?.trim().toLowerCase();
  return value === "apify" || value === "dataforseo" ? value : "reader";
}

// Relative imports with extensions keep this module runnable by `node --test` (tests/i18n-group-g.test.mjs).
import type { DocPageId, ProductDocs } from "../types.ts";
import { de } from "./business-card.de.ts";
import { en } from "./business-card.en.ts";
import { es } from "./business-card.es.ts";
import { fr } from "./business-card.fr.ts";
import { it } from "./business-card.it.ts";
import { pt } from "./business-card.pt.ts";

const pageIds: DocPageId[] = ["getting-started", "setup", "configuration", "usage", "troubleshooting", "faq"];

export const docs: ProductDocs = {
  productId: "business-card",
  pages: Object.fromEntries(
    pageIds.map((id) => [id, { pt: pt[id], en: en[id], es: es[id], fr: fr[id], de: de[id], it: it[id] }]),
  ) as ProductDocs["pages"],
};

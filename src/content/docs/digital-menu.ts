// Relative imports with extensions keep this module runnable by `node --test` (tests/i18n-group-g.test.mjs).
import type { DocPageId, ProductDocs } from "../types.ts";
import { de } from "./digital-menu.de.ts";
import { en } from "./digital-menu.en.ts";
import { es } from "./digital-menu.es.ts";
import { fr } from "./digital-menu.fr.ts";
import { it } from "./digital-menu.it.ts";
import { pt } from "./digital-menu.pt.ts";

const pageIds: DocPageId[] = ["getting-started", "setup", "configuration", "usage", "troubleshooting", "faq"];

export const docs: ProductDocs = {
  productId: "digital-menu",
  pages: Object.fromEntries(
    pageIds.map((id) => [id, { pt: pt[id], en: en[id], es: es[id], fr: fr[id], de: de[id], it: it[id] }]),
  ) as ProductDocs["pages"],
};

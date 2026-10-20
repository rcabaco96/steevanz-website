// Relative imports with extensions keep this module runnable by `node --test` (tests/i18n-group-g.test.mjs).
import type { DocPageId, ProductDocs } from "../types.ts";
import { de } from "./guest-guide.de.ts";
import { en } from "./guest-guide.en.ts";
import { es } from "./guest-guide.es.ts";
import { fr } from "./guest-guide.fr.ts";
import { it } from "./guest-guide.it.ts";
import { pt } from "./guest-guide.pt.ts";

const pageIds: DocPageId[] = ["getting-started", "setup", "configuration", "usage", "troubleshooting", "faq"];

export const docs: ProductDocs = {
  productId: "guest-guide",
  pages: Object.fromEntries(
    pageIds.map((id) => [id, { pt: pt[id], en: en[id], es: es[id], fr: fr[id], de: de[id], it: it[id] }]),
  ) as ProductDocs["pages"],
};

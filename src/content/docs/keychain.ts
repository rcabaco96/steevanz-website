// Relative imports with extensions keep this module runnable by `node --test` (tests/i18n-group-g.test.mjs).
import type { DocPageId, ProductDocs } from "../types.ts";
import { de } from "./keychain.de.ts";
import { en } from "./keychain.en.ts";
import { es } from "./keychain.es.ts";
import { fr } from "./keychain.fr.ts";
import { it } from "./keychain.it.ts";
import { pt } from "./keychain.pt.ts";

const pageIds: DocPageId[] = ["getting-started", "setup", "configuration", "usage", "troubleshooting", "faq"];

export const docs: ProductDocs = {
  productId: "keychain",
  pages: Object.fromEntries(
    pageIds.map((id) => [id, { pt: pt[id], en: en[id], es: es[id], fr: fr[id], de: de[id], it: it[id] }]),
  ) as ProductDocs["pages"],
};

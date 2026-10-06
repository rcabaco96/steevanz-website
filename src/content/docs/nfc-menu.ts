import type { DocPageId, ProductDocs } from "../types";
import { en } from "./nfc-menu.en";
import { pt } from "./nfc-menu.pt";

const pageIds: DocPageId[] = ["getting-started", "setup", "configuration", "usage", "troubleshooting", "faq"];

export const docs: ProductDocs = {
  productId: "nfc-menu",
  pages: Object.fromEntries(pageIds.map((id) => [id, { pt: pt[id], en: en[id] }])) as ProductDocs["pages"],
};

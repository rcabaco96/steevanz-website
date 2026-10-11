import type { DocPageId, ProductDocs } from "../types";
import { en } from "./digital-menu.en";
import { pt } from "./digital-menu.pt";

const pageIds: DocPageId[] = ["getting-started", "setup", "configuration", "usage", "troubleshooting", "faq"];

export const docs: ProductDocs = {
  productId: "digital-menu",
  pages: Object.fromEntries(pageIds.map((id) => [id, { pt: pt[id], en: en[id] }])) as ProductDocs["pages"],
};

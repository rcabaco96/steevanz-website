import type { DocPageId, ProductDocs } from "../types";
import { en } from "./guest-guide.en";
import { pt } from "./guest-guide.pt";

const pageIds: DocPageId[] = ["getting-started", "setup", "configuration", "usage", "troubleshooting", "faq"];

export const docs: ProductDocs = {
  productId: "guest-guide",
  pages: Object.fromEntries(pageIds.map((id) => [id, { pt: pt[id], en: en[id] }])) as ProductDocs["pages"],
};

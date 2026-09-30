import { docPages } from "@/content/doc-pages";
import { products } from "@/content/products";
import { sectors } from "@/content/sectors";
import type { Route, StaticRouteKey } from "./routes";

const indexableStaticKeys: StaticRouteKey[] = [
  "home",
  "products",
  "sectors",
  "docs",
  "book",
  "requestInfo",
  "about",
  "contact",
  "privacy",
  "cookies",
  "terms",
];

export function allPublicRoutes(): Route[] {
  return [
    ...indexableStaticKeys.map((key) => ({ key }) as Route),
    ...products.map((product) => ({ key: "product", productId: product.id }) as Route),
    ...sectors.map((sector) => ({ key: "sector", sectorId: sector.id }) as Route),
    ...products.flatMap((product) =>
      docPages.map((page) => ({ key: "doc", productId: product.id, pageId: page.id }) as Route),
    ),
  ];
}

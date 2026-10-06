import type { ComponentType } from "react";
import type { ProductId } from "@/content/types";
import { ModulePlaceholder } from "./ModulePlaceholder";

export interface ModuleProps {
  productId: ProductId;
  /** Owner of the module data. */
  userId: string;
  /** Admins see the same module as the client, with extra controls where a module needs them. */
  viewer: "client" | "admin";
}

// One management module per product. Each product gets its own component here
// as it is built; until then they all show the placeholder.
export const productModules: Record<ProductId, ComponentType<ModuleProps>> = {
  "nfc-google-reviews": ModulePlaceholder,
  "nfc-social": ModulePlaceholder,
  loyalty: ModulePlaceholder,
  bookings: ModulePlaceholder,
  waitlist: ModulePlaceholder,
  "ai-chatbot": ModulePlaceholder,
  "ai-voice": ModulePlaceholder,
  "ai-reviews": ModulePlaceholder,
  automation: ModulePlaceholder,
};

export function ProductModule(props: ModuleProps) {
  const Module = productModules[props.productId];
  return <Module {...props} />;
}

import type { ComponentType } from "react";
import type { ProductId } from "@/content/types";
import { BookingsModule } from "./bookings/BookingsModule";
import { LoyaltyModule } from "./loyalty/LoyaltyModule";
import { ModulePlaceholder } from "./ModulePlaceholder";
import type { ModuleQuery } from "./shared/ModuleNav";
import { WaitlistModule } from "./waitlist/WaitlistModule";

export interface ModuleProps {
  productId: ProductId;
  /** Owner of the module data. */
  userId: string;
  /** Admins see the same module as the client, with extra controls where a module needs them. */
  viewer: "client" | "admin";
  /** Page the module lives on (its tabs and establishment switcher link here). */
  basePath: string;
  /** The page's search params (selected establishment and view). */
  query?: ModuleQuery;
}

// One management module per product. Each product gets its own component here
// as it is built; until then they all show the placeholder.
export const productModules: Record<ProductId, ComponentType<ModuleProps>> = {
  "nfc-google-reviews": ModulePlaceholder,
  "nfc-social": ModulePlaceholder,
  loyalty: LoyaltyModule,
  bookings: BookingsModule,
  waitlist: WaitlistModule,
  "ai-chatbot": ModulePlaceholder,
  "ai-voice": ModulePlaceholder,
  "ai-reviews": ModulePlaceholder,
  automation: ModulePlaceholder,
  "nfc-menu": ModulePlaceholder,
};

export function ProductModule(props: ModuleProps) {
  const Module = productModules[props.productId];
  return <Module {...props} />;
}

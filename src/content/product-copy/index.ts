// Relative imports with extensions keep this module runnable by `node --test` (tests/site-i18n.test.mjs).
import { localizePartial, type Locale } from "../../lib/i18n.ts";
import type { ProductCopy, ProductCopyByLocale, ProductId } from "../types.ts";
import { copy as aiChatbot } from "./ai-chatbot.ts";
import { copy as aiReviews } from "./ai-reviews.ts";
import { copy as aiVoice } from "./ai-voice.ts";
import { copy as automation } from "./automation.ts";
import { copy as bookings } from "./bookings.ts";
import { copy as guestGuide } from "./guest-guide.ts";
import { copy as landingPage } from "./landing-page.ts";
import { copy as loyalty } from "./loyalty.ts";
import { copy as googleReviewPlates } from "./google-review-plates.ts";
import { copy as digitalMenu } from "./digital-menu.ts";
import { copy as socialPlates } from "./social-plates.ts";
import { copy as onlineShop } from "./online-shop.ts";
import { copy as waitlist } from "./waitlist.ts";
import { copy as website } from "./website.ts";

export const productCopy: Record<ProductId, ProductCopyByLocale> = {
  "google-review-plates": googleReviewPlates,
  "social-plates": socialPlates,
  "digital-menu": digitalMenu,
  "guest-guide": guestGuide,
  loyalty,
  bookings,
  waitlist,
  "ai-chatbot": aiChatbot,
  "ai-voice": aiVoice,
  "ai-reviews": aiReviews,
  automation,
  "landing-page": landingPage,
  website,
  "online-shop": onlineShop,
};

export function getProductCopy(id: ProductId, locale: Locale): ProductCopy {
  return localizePartial(productCopy[id], locale);
}

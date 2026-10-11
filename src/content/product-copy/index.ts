import type { Locale } from "@/lib/i18n";
import type { ProductCopy, ProductCopyByLocale, ProductId } from "../types";
import { copy as aiChatbot } from "./ai-chatbot";
import { copy as aiReviews } from "./ai-reviews";
import { copy as aiVoice } from "./ai-voice";
import { copy as automation } from "./automation";
import { copy as bookings } from "./bookings";
import { copy as guestGuide } from "./guest-guide";
import { copy as landingPage } from "./landing-page";
import { copy as loyalty } from "./loyalty";
import { copy as googleReviewPlates } from "./google-review-plates";
import { copy as digitalMenu } from "./digital-menu";
import { copy as socialPlates } from "./social-plates";
import { copy as onlineShop } from "./online-shop";
import { copy as waitlist } from "./waitlist";
import { copy as website } from "./website";

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
  return productCopy[id][locale];
}

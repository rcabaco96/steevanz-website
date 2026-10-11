import type { Locale } from "@/lib/i18n";
import type { ProductCopy, ProductCopyByLocale, ProductId } from "../types";
import { copy as aiChatbot } from "./ai-chatbot";
import { copy as aiReviews } from "./ai-reviews";
import { copy as aiVoice } from "./ai-voice";
import { copy as automation } from "./automation";
import { copy as bookings } from "./bookings";
import { copy as landingPage } from "./landing-page";
import { copy as loyalty } from "./loyalty";
import { copy as nfcGoogleReviews } from "./nfc-google-reviews";
import { copy as nfcMenu } from "./nfc-menu";
import { copy as nfcSocial } from "./nfc-social";
import { copy as onlineShop } from "./online-shop";
import { copy as waitlist } from "./waitlist";
import { copy as website } from "./website";

export const productCopy: Record<ProductId, ProductCopyByLocale> = {
  "nfc-google-reviews": nfcGoogleReviews,
  "nfc-social": nfcSocial,
  "nfc-menu": nfcMenu,
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

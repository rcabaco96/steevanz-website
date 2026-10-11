import type { DocPageId, ProductDocs, ProductId } from "../types";
import { docs as aiChatbot } from "./ai-chatbot";
import { docs as aiReviews } from "./ai-reviews";
import { docs as aiVoice } from "./ai-voice";
import { docs as automation } from "./automation";
import { docs as bookings } from "./bookings";
import { docs as guestGuide } from "./guest-guide";
import { docs as loyalty } from "./loyalty";
import { docs as nfcGoogleReviews } from "./nfc-google-reviews";
import { docs as nfcMenu } from "./nfc-menu";
import { docs as nfcSocial } from "./nfc-social";
import { docs as waitlist } from "./waitlist";
import { webDocs } from "./web";

export const productDocs: Record<ProductId, ProductDocs> = {
  "nfc-google-reviews": nfcGoogleReviews,
  "nfc-social": nfcSocial,
  "nfc-menu": nfcMenu,
  "guest-guide": guestGuide,
  loyalty,
  bookings,
  waitlist,
  "ai-chatbot": aiChatbot,
  "ai-voice": aiVoice,
  "ai-reviews": aiReviews,
  automation,
  "landing-page": webDocs("landing-page"),
  website: webDocs("website"),
  "online-shop": webDocs("online-shop"),
};

export function getDocPage(productId: ProductId, pageId: DocPageId) {
  return productDocs[productId].pages[pageId];
}

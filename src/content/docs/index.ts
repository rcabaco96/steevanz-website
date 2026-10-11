import type { DocPageId, ProductDocs, ProductId } from "../types";
import { docs as aiChatbot } from "./ai-chatbot";
import { docs as aiReviews } from "./ai-reviews";
import { docs as aiVoice } from "./ai-voice";
import { docs as automation } from "./automation";
import { docs as bookings } from "./bookings";
import { docs as guestGuide } from "./guest-guide";
import { docs as loyalty } from "./loyalty";
import { docs as googleReviewPlates } from "./google-review-plates";
import { docs as digitalMenu } from "./digital-menu";
import { docs as socialPlates } from "./social-plates";
import { docs as waitlist } from "./waitlist";
import { webDocs } from "./web";

export const productDocs: Record<ProductId, ProductDocs> = {
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
  "landing-page": webDocs("landing-page"),
  website: webDocs("website"),
  "online-shop": webDocs("online-shop"),
};

export function getDocPage(productId: ProductId, pageId: DocPageId) {
  return productDocs[productId].pages[pageId];
}

import type { DocPageContent, DocPageId } from "../types";

export const en: Record<DocPageId, DocPageContent> = {
  "getting-started": {
    title: "Getting started with the NFC digital menu",
    description:
      "How Steevanz's round NFC plates take guests, at the table, to videos, photos and carousels of your dishes with prices on Instagram or YouTube.",
    blocks: [
      {
        type: "p",
        text: "The digital menu is a small round NFC plate, one per table. Guests tap it with their phone and open an Instagram highlight or a YouTube playlist with your dishes, as videos, photos or carousels, each with its price. It's like flicking through the menu while seeing the real food.",
      },
      {
        type: "p",
        text: "Like every Steevanz product, it's a managed service: we write, test and set up the plates. This documentation helps you prepare the content and get the most out of the plates.",
      },
      { type: "h2", id: "whats-included", text: "What's included" },
      {
        type: "table",
        head: ["Item", "Details"],
        rows: [
          ["Round NFC plate", "Round table sticker or round table base"],
          ["Printed QR code", "For phones without NFC or with NFC turned off"],
          ["Setup", "We link each plate to your menu's Instagram highlight or YouTube playlist"],
          ["Changing the destination", "Switch the highlight or playlist without reprinting the plates"],
        ],
      },
      { type: "h2", id: "pricing", text: "Pricing" },
      {
        type: "table",
        head: ["Quantity", "Price", "Per plate"],
        rows: [
          ["1 plate", "€15", "€15"],
          ["Pack of 5", "€60", "€12"],
          ["Pack of 10", "€100", "€10"],
          ["Pack of 20", "€180", "€9"],
        ],
      },
      {
        type: "p",
        text: "Your logo and brand colours are charged once per order (the design is made once for all plates), not per plate.",
      },
      { type: "h2", id: "how-it-works", text: "How it works" },
      {
        type: "ol",
        items: [
          "The guest sits down and taps the plate with their phone (or scans the QR code).",
          "Your menu's Instagram highlight or YouTube playlist opens.",
          "The guest sees the dishes with prices and orders with more confidence.",
        ],
      },
      { type: "h2", id: "next-steps", text: "Next steps" },
      {
        type: "ul",
        items: [
          "[Setup](/en/docs/nfc-digital-menu/setup): preparing the highlight or playlist and placing the plates.",
          "[Configuration](/en/docs/nfc-digital-menu/configuration): changing the destination and keeping prices right.",
          "[Usage](/en/docs/nfc-digital-menu/usage): good practice for your menu content.",
        ],
      },
    ],
  },
  setup: {
    title: "Setting up the NFC digital menu",
    description: "Prepare your menu's Instagram highlight or YouTube playlist and place the plates on your tables.",
    blocks: [
      { type: "h2", id: "prepare-content", text: "1. Prepare the content" },
      {
        type: "p",
        text: "The plate opens one specific place, not your whole profile: an Instagram highlight or a YouTube playlist with just the menu.",
      },
      { type: "h3", id: "instagram", text: "Instagram: create a \"Menu\" highlight" },
      {
        type: "steps",
        items: [
          { title: "Post the dishes as stories", body: "One video, photo or carousel per dish, with its name and price written on the image." },
          { title: "Create the highlight", body: "On your profile, tap \"New\" under highlights, pick the dish stories and call it \"Menu\"." },
          { title: "Split it into sections", body: "For a long menu, create one highlight per section (Starters, Mains, Desserts, Drinks)." },
        ],
      },
      { type: "h3", id: "youtube", text: "YouTube: create a playlist" },
      {
        type: "steps",
        items: [
          { title: "Post one short video per dish", body: "Shorts work well. Put the name and price in the title and in the video itself." },
          { title: "Create the \"Menu\" playlist", body: "Add the videos in menu order and make the playlist public." },
        ],
      },
      {
        type: "callout",
        tone: "tip",
        title: "No videos or photos yet?",
        text: "We work with partners who create videos, photos and carousels of dishes. We'll get you a quote and set up the plates once the content is published.",
      },
      { type: "h2", id: "send-link", text: "2. Send us the link" },
      {
        type: "p",
        text: "Send us the link to the highlight or playlist. We write the plates, test them on iPhone and Android and ship them ready to use.",
      },
      { type: "h2", id: "place-plates", text: "3. Place the plates" },
      {
        type: "ul",
        items: [
          "One plate per table, somewhere visible and within easy reach (centre of the table or next to the napkin holder).",
          "Clean the surface before sticking the sticker and press for a few seconds.",
          "Avoid metal surfaces: metal can stop NFC from working. Use the round table base there instead.",
        ],
      },
    ],
  },
  configuration: {
    title: "Configuring the NFC digital menu",
    description: "Change where the plates go and keep dishes and prices up to date.",
    blocks: [
      { type: "h2", id: "change-destination", text: "Changing the destination" },
      {
        type: "p",
        text: "The plates point to a short link managed by Steevanz. To switch the highlight or playlist (a summer menu, for example), just ask us: the destination changes without reprinting anything.",
      },
      { type: "h2", id: "keep-prices-right", text: "Keeping prices up to date" },
      {
        type: "ul",
        items: [
          "When a price changes, post the new story or video and remove the old one from the highlight or playlist.",
          "Dishes that leave the menu should also leave the highlight or playlist.",
          "Review the digital menu whenever you change the printed menu.",
        ],
      },
      {
        type: "callout",
        tone: "warning",
        text: "Stories that aren't in a highlight disappear after 24 hours. Always keep the dishes in the highlight.",
      },
      { type: "h2", id: "customisation", text: "Customisation" },
      {
        type: "p",
        text: "The plates can carry your logo and brand colours and a short text, such as \"Tap to see the menu\". The design is made once per order.",
      },
    ],
  },
  usage: {
    title: "Using the NFC digital menu",
    description: "Good practice so the digital menu helps guests choose.",
    blocks: [
      { type: "h2", id: "content-that-works", text: "Content that works" },
      {
        type: "ul",
        items: [
          "Show the dish exactly as it arrives at the table, in good light.",
          "Always put the name and price on the image or in the video.",
          "Short videos (up to 15 seconds) hold attention better than long ones.",
          "Start with your most ordered dishes or the ones you want to sell more of.",
        ],
      },
      { type: "h2", id: "team", text: "Your team" },
      {
        type: "p",
        text: "Tell guests they can see the dishes on their phone when you hand over the menu. An invitation from the team greatly increases the number of taps.",
      },
      { type: "h2", id: "pair-with-reviews", text: "Pair it with Google reviews" },
      {
        type: "p",
        text: "On the same table, the Google reviews plate asks for a review at the end of the meal. The menu helps guests choose at the start; reviews help new guests find you.",
      },
    ],
  },
  troubleshooting: {
    title: "Troubleshooting the NFC digital menu",
    description: "What to do when a plate doesn't open the menu.",
    blocks: [
      {
        type: "table",
        head: ["Problem", "What to do"],
        rows: [
          ["The phone doesn't react to the tap", "Check NFC is on (Android) and hold the top of the phone against the centre of the plate. Or scan the QR code."],
          ["It opens the profile, not the menu", "The highlight or playlist may have been deleted or renamed. Send us the new link."],
          ["The playlist is empty or private", "On YouTube, check that the playlist and its videos are public."],
          ["The plate doesn't work on metal", "Swap the sticker for the round table base."],
          ["Prices are out of date", "Update the stories or videos: the plate always shows what's published."],
        ],
      },
      {
        type: "callout",
        tone: "info",
        text: "If a plate breaks, contact us: we'll replace it with the same destination.",
      },
    ],
  },
  faq: {
    title: "NFC digital menu FAQ",
    description: "Quick answers about the digital menu plates.",
    blocks: [
      {
        type: "faq",
        items: [
          { q: "Do guests need to install an app?", a: "No. The phone opens Instagram or YouTube; if the app isn't installed, it opens in the browser." },
          { q: "Does it work on iPhone and Android?", a: "Yes. Recent iPhones read NFC with nothing to turn on; on Android NFC must be on. There's always the printed QR code." },
          { q: "Does it replace the printed menu?", a: "It complements it. Seeing dishes as videos and photos helps guests choose, but the printed menu is still useful for those who prefer it." },
          { q: "How much does it cost?", a: "€15 per plate, or packs of 5 for €60, 10 for €100 and 20 for €180. The logo is charged once per order." },
          { q: "Do you create the videos?", a: "Not directly: we work with partners who create videos, photos and carousels of dishes, and we'll get you a quote." },
          { q: "Can I change the destination later?", a: "Yes, without reprinting the plates. Just send us the new highlight or playlist." },
        ],
      },
    ],
  },
};

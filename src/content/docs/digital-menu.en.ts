import type { DocPageContent, DocPageId } from "../types";

export const en: Record<DocPageId, DocPageContent> = {
  "getting-started": {
    title: "Getting started with the digital menu",
    description:
      "How the Steevanz video menu works: one video per dish, with its price, opened with a tap or the QR code on the table plate, with table ordering if you want it.",
    blocks: [
      {
        type: "p",
        text: "The digital menu is your menu on video. Every dish has its own vertical video, with its name, price and description, on your business's own page. Guests open it with a tap or the QR code on the round plate on each table, with nothing to install.",
      },
      {
        type: "p",
        text: "Like every Steevanz product, it's a managed service: we build the menu, host the videos and write and test the plates. This documentation helps you prepare the videos and get the most out of the menu.",
      },
      { type: "h2", id: "whats-included", text: "What's included" },
      {
        type: "table",
        head: ["Item", "Details"],
        rows: [
          ["Video menu", "Your business's page with your logo, collections and one vertical video per dish, with name, price and description"],
          ["Table ordering (optional)", "The table orders from their phones and your team confirms by scanning a QR code"],
          ["Round plate", "Round table sticker or round table base, one per table"],
          ["Printed QR code", "For phones that can't read a tap or have that option switched off"],
          ["Setup and hosting", "We build the menu and host the menu and videos"],
          ["Filming guide", "A guide to filming your dish videos with a phone"],
        ],
      },
      { type: "h2", id: "pricing", text: "Pricing" },
      {
        type: "table",
        head: ["Quantity", "Price", "Per plate"],
        rows: [
          ["1 to 9 plates", "€20 each", "€20"],
          ["10 plates or more", "€15 each (10 plates: €150)", "€15"],
        ],
      },
      {
        type: "p",
        text: "Your logo and brand colours are charged once per order (the design is made once for all the plates), not per plate. Building the menu and hosting the menu and videos cost €30 a month (excluding VAT).",
      },
      { type: "h2", id: "how-it-works", text: "How it works" },
      {
        type: "ol",
        items: [
          "The guest sits down and taps the plate with their phone (or scans the QR code).",
          "The menu opens with an animation of your logo, at the top of the page.",
          "Dishes play in a grid. One tap opens full screen, just like Reels, and guests swipe up and down to see the others.",
          "With table ordering on, the guest taps «Adicionar» (add) on the dishes and orders right there.",
        ],
      },
      { type: "h2", id: "next-steps", text: "Next steps" },
      {
        type: "ul",
        items: [
          "[Setup](/en/docs/digital-menu/setup): filming the videos, sending us the menu and placing the plates.",
          "[Configuration](/en/docs/digital-menu/configuration): changing dishes and prices and switching on table ordering.",
          "[Usage](/en/docs/digital-menu/usage): videos that work and table ordering day to day.",
        ],
      },
    ],
  },
  setup: {
    title: "Setting up the digital menu",
    description: "Film your dish videos, send us the menu and place the plates on your tables.",
    blocks: [
      { type: "h2", id: "film-videos", text: "1. Film the videos" },
      {
        type: "p",
        text: "Every dish has its own video. Film them with your phone, upright: we give you a guide to filming the videos.",
      },
      {
        type: "steps",
        items: [
          { title: "One video per dish", body: "Upright, with the dish exactly as it arrives at the table." },
          { title: "No text on top", body: "You don't need to write the name or price on the video: the menu shows them on top." },
          { title: "Keep it short", body: "A few seconds are enough to show the dish. Short videos hold attention better." },
        ],
      },
      { type: "h2", id: "send-menu", text: "2. Send us the menu" },
      {
        type: "p",
        text: "Send us the videos and, for each dish, its name, price and a short description, grouped into the collections you want (Brunch and Drinks, for example). Send your logo too. We build the menu and show it to you before it goes on the tables.",
      },
      {
        type: "callout",
        tone: "tip",
        title: "Table ordering",
        text: "If you want tables to order from their phones, tell us how many tables you have. Each table gets its own plate, with its own link and QR code.",
      },
      { type: "h2", id: "place-plates", text: "3. Place the plates" },
      {
        type: "ul",
        items: [
          "One plate per table, somewhere visible and within easy reach (centre of the table or next to the napkin holder).",
          "With table ordering, each plate belongs to one table: put each one on its own table.",
          "Clean the surface before sticking the sticker and press for a few seconds.",
          "Avoid metal surfaces: metal blocks the plate's signal. Use the round table base there instead.",
        ],
      },
    ],
  },
  configuration: {
    title: "Configuring the digital menu",
    description: "Change dishes, prices and collections, and switch table ordering on or off.",
    blocks: [
      { type: "h2", id: "dishes-prices", text: "Changing dishes and prices" },
      {
        type: "p",
        text: "Steevanz manages the menu. To change a price, add or remove a dish, swap a video or reorganise the collections, send us a message: we update the menu and the plates stay the same.",
      },
      { type: "h2", id: "collections", text: "Collections" },
      {
        type: "p",
        text: "Dishes are grouped into collections, such as Brunch and Drinks. They are all on the same page, one section after another, and the ☰ button takes guests straight to each one.",
      },
      { type: "h2", id: "table-ordering", text: "Table ordering" },
      {
        type: "p",
        text: "Table ordering is switched on or off menu by menu. Without it, the plate opens the menu just for browsing. Each table has its own plate, with its own link and QR code; if you need more tables, just ask us.",
      },
      {
        type: "callout",
        tone: "warning",
        text: "If a table's code is changed, the old link stops working and that table's plate has to be replaced.",
      },
      { type: "h2", id: "customisation", text: "Customisation" },
      {
        type: "p",
        text: "The menu carries your logo. The plates can carry your logo and brand colours and a short text, such as \"Tap to see the menu\". The plate design is made once per order.",
      },
    ],
  },
  usage: {
    title: "Using the digital menu",
    description: "Good practice so the digital menu helps guests choose, and table ordering day to day.",
    blocks: [
      { type: "h2", id: "videos-that-work", text: "Videos that work" },
      {
        type: "ul",
        items: [
          "Show the dish exactly as it arrives at the table, in good light.",
          "Always film upright: that's how the menu shows the videos.",
          "Short videos hold attention better than long ones.",
          "Put your most ordered dishes, or the ones you want to sell more of, first.",
        ],
      },
      { type: "h2", id: "ordering-day-to-day", text: "Table ordering day to day" },
      {
        type: "ol",
        items: [
          "Every phone at the table sees the same order in real time. Each person taps «Adicionar» (add) on the dishes and can add a note, such as «sem cebola» (no onion).",
          "«Fazer pedido» (place order) shows a QR code and the order number on the phone.",
          "Your staff scan the QR code with their phone camera, no app or login, and see the table, the time, the dishes with their notes and the total.",
          "They tap «Confirmar pedido» (confirm order) and the table sees «Pedido confirmado ✓» (order confirmed) straight away.",
        ],
      },
      {
        type: "callout",
        tone: "info",
        text: "Order numbers start again every day.",
      },
      { type: "h2", id: "team", text: "Your team" },
      {
        type: "p",
        text: "Tell guests they can see the dishes on their phone when they sit down. An invitation from the team greatly increases the number of taps.",
      },
      { type: "h2", id: "pair-with-reviews", text: "Pair it with Google reviews" },
      {
        type: "p",
        text: "On the same table, the Google reviews plate asks for a review at the end of the meal. The menu helps guests choose at the start; reviews help new guests find you.",
      },
    ],
  },
  troubleshooting: {
    title: "Troubleshooting the digital menu",
    description: "What to do when a plate doesn't open the menu or an order doesn't come through.",
    blocks: [
      {
        type: "table",
        head: ["Problem", "What to do"],
        rows: [
          ["The phone doesn't react to the tap", "Check the phone's contactless (tap) reading is on (Android connection settings) and hold the top of the phone against the centre of the plate. Or scan the QR code."],
          ["The plate opens a page that doesn't exist", "The table's code may have been changed or the menu switched off. Contact us."],
          ["The videos are slow to start", "Check the phone's internet connection (Wi-Fi or mobile data). If it always happens, let us know."],
          ["Staff can't scan the order's QR code", "Ask the guest to turn up their screen brightness and bring the camera closer to the code."],
          ["The plate doesn't work on metal", "Swap the sticker for the round table base."],
          ["Prices are out of date", "Send us the new prices: we update the menu and the plates stay the same."],
        ],
      },
      {
        type: "callout",
        tone: "info",
        text: "If a plate breaks, contact us: we'll replace it.",
      },
    ],
  },
  faq: {
    title: "Digital menu FAQ",
    description: "Quick answers about the video menu, table ordering and the plates.",
    blocks: [
      {
        type: "faq",
        items: [
          { q: "Do guests need to install an app?", a: "No. The menu opens in the phone's browser. Neither guests nor staff need an app." },
          { q: "Do I need Instagram or YouTube?", a: "No. The menu has its own page on Steevanz and we host the videos." },
          { q: "Does it work on iPhone and Android?", a: "Yes. Recent iPhones read the plate with nothing to turn on; on Android, the contactless (tap) reading option must be on. There's always the printed QR code." },
          { q: "Does it replace the printed menu?", a: "It complements it. Seeing dishes on video helps guests choose, but the printed menu is still useful for those who prefer it." },
          { q: "How much does it cost?", a: "€20 per plate, or €15 per plate from 10 plates. The logo is charged once per order. Building and hosting the menu cost €30 a month (excluding VAT)." },
          { q: "Who films the videos?", a: "Usually the business itself, with a phone: we give you a guide to filming the videos. We build the menu and host the videos." },
          { q: "Is table ordering required?", a: "No. It's switched on or off menu by menu. Without it, the plate opens the menu just for browsing." },
          { q: "Can I change the menu later?", a: "Yes, without changing the plates. Send us the new dishes, prices or videos and we update the menu." },
        ],
      },
    ],
  },
};

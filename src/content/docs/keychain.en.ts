import type { DocPageContent, DocPageId } from "../types";

export const en: Record<DocPageId, DocPageContent> = {
  "getting-started": {
    title: "Getting started with the digital keychain",
    description: "What the digital keychain is, what it can open, how much it costs and how customers use it with one tap of their phone.",
    blocks: [
      {
        type: "p",
        text: "The digital keychain is a small tag for your customers' keys. With one tap of a phone, it opens your business's WhatsApp, Instagram or website. It works on iPhone and Android, with no app.",
      },
      {
        type: "p",
        text: "We take care of everything: we set up each keychain's destination and test it on iPhone and Android before delivery.",
      },
      { type: "h2", id: "what-it-opens", text: "What it can open" },
      {
        type: "table",
        head: ["Destination", "What the customer sees"],
        rows: [
          ["WhatsApp", "A chat with your business"],
          ["Instagram", "Your business's profile"],
          ["Website", "Your site"],
        ],
      },
      { type: "h2", id: "pricing", text: "Pricing" },
      {
        type: "table",
        head: ["Quantity", "Price per keychain", "Total"],
        rows: [
          ["1 keychain", "€5", "€5"],
          ["Pack of 10", "€4.50", "€45"],
          ["Pack of 25", "€4", "€100"],
        ],
      },
      { type: "p", text: "All prices + VAT. They are indicative and confirmed at the demo." },
      { type: "h2", id: "how-it-works", text: "How it works for customers" },
      {
        type: "ol",
        items: [
          "The customer holds their phone near the keychain.",
          "The destination you chose opens straight away.",
          "There's no app to install and no need to search for your name.",
        ],
      },
      {
        type: "callout",
        tone: "info",
        title: "Tap only",
        text: "The keychain has no QR code. Very old phones, or phones without contactless reading, can't open it. For those, the Digital business card and the plates have a QR code.",
      },
      { type: "h2", id: "next-steps", text: "Next steps" },
      {
        type: "ul",
        items: [
          "[Ordering and delivery](/en/docs/digital-keychain/setup): what to send us and what happens until the keychains reach you.",
          "[Configuration](/en/docs/digital-keychain/configuration): how to choose between WhatsApp, Instagram and website.",
          "[Usage](/en/docs/digital-keychain/usage): who to give them to and how to explain them to customers.",
        ],
      },
    ],
  },
  setup: {
    title: "Ordering and delivery of the digital keychain",
    description: "What to send us for each destination, how to choose the quantity and what we do before delivery.",
    blocks: [
      { type: "h2", id: "choose-destination", text: "1. Choose the destination" },
      {
        type: "p",
        text: "Each keychain opens one destination, chosen when you order. Tell us which one and send us what we need:",
      },
      {
        type: "table",
        head: ["Destination", "What to send us"],
        rows: [
          ["WhatsApp", "The WhatsApp number you use to answer customers"],
          ["Instagram", "Your business's profile name (the @)"],
          ["Website", "The address of the site or page you want it to open"],
        ],
      },
      { type: "h2", id: "quantity", text: "2. Tell us how many" },
      {
        type: "p",
        text: "You can order single keychains or packs of 10 and 25. If you'd like to talk about personalisation, such as your logo, we'll go through it with you at the demo.",
      },
      { type: "h2", id: "setup-and-test", text: "3. We set up and test" },
      {
        type: "p",
        text: "We set up each keychain with your destination and test it on iPhone and Android before delivery. It's ready within a few working days; we give you the exact timing at the demo.",
      },
      {
        type: "callout",
        tone: "tip",
        text: "When the keychains arrive, try one with your own phone before giving them away.",
      },
    ],
  },
  configuration: {
    title: "Configuring the digital keychain",
    description: "How to choose between WhatsApp, Instagram and website, with tips for each destination.",
    blocks: [
      { type: "h2", id: "one-destination", text: "One destination per keychain" },
      {
        type: "p",
        text: "Each keychain always opens the destination chosen when you ordered. Pick the one your customers use most to get in touch with you.",
      },
      { type: "h2", id: "whatsapp", text: "WhatsApp" },
      {
        type: "p",
        text: "Opens a chat with your business. The natural choice if you take bookings, appointments or orders by message. Use a number someone keeps an eye on during the day.",
      },
      { type: "h2", id: "instagram", text: "Instagram" },
      {
        type: "p",
        text: "Opens your business's profile. It makes sense if you post news, your work or dishes of the day and want customers to follow you.",
      },
      { type: "h2", id: "website", text: "Website" },
      {
        type: "p",
        text: "Opens your site or a page of your choice. Go for a page that works well on a phone.",
      },
      {
        type: "callout",
        tone: "info",
        text: "Personalising the keychain, for example with your logo, is something we go through with you at the demo.",
      },
    ],
  },
  usage: {
    title: "Using the digital keychain",
    description: "Who to give the keychain to and how to explain what it does to a customer in one sentence.",
    blocks: [
      { type: "h2", id: "who-to-give", text: "Who to give it to" },
      {
        type: "table",
        head: ["Business", "How to use it"],
        rows: [
          ["Cafés, restaurants, salons and shops", "Give it to your regulars: your WhatsApp or Instagram is always on their keys"],
          ["Holiday rentals", "The keyring on the property's key opens the host's WhatsApp"],
          ["Estate agents", "Hand over the keychain with the keys to the new home"],
          ["Teams, events and trade fairs", "A useful giveaway that stays on the keys instead of ending up in the bin"],
        ],
      },
      { type: "h2", id: "explain", text: "Explain it in one sentence" },
      {
        type: "p",
        text: "When you hand it over, say something like: «Hold your phone near this keychain and you're straight through to us on WhatsApp.» Showing it once with your own phone helps.",
      },
      {
        type: "callout",
        tone: "tip",
        text: "If a customer has an Android phone and it doesn't open first time, ask them to switch on contactless (tap) reading in the connection settings.",
      },
    ],
  },
  troubleshooting: {
    title: "Troubleshooting the digital keychain",
    description: "What to do when a tap opens nothing or a keychain opens the wrong destination.",
    blocks: [
      { type: "h2", id: "tap-does-nothing", text: "A tap opens nothing" },
      {
        type: "ul",
        items: [
          "On iPhone XS and newer, bring the top of the phone close to the keychain, with the screen on.",
          "On Android, switch on contactless (tap) reading in the connection settings.",
          "If the phone case is thick, try without it.",
        ],
      },
      {
        type: "callout",
        tone: "warning",
        title: "There's no QR code",
        text: "The keychain works by tap only. Very old phones, or phones without contactless reading, can't open it. For those customers, the Digital business card and the plates have a QR code.",
      },
      { type: "h2", id: "wrong-destination", text: "It opens the wrong destination" },
      {
        type: "p",
        text: "We test every keychain before delivery. If something isn't right, contact us by WhatsApp or email, tell us what it should open and we'll work out the solution with you.",
      },
      { type: "h2", id: "more-keychains", text: "You need more keychains" },
      {
        type: "p",
        text: "You can order more whenever you like, singly or in packs. Contact us by WhatsApp or email.",
      },
    ],
  },
  faq: {
    title: "Digital keychain FAQ",
    description: "Quick answers about compatible phones, QR codes, destinations, prices and timing.",
    blocks: [
      {
        type: "faq",
        items: [
          {
            q: "Does it work on iPhone and Android?",
            a: "Yes, with no app. On iPhone XS and newer, just bring the top of the phone close. Most Android phones read it as long as contactless (tap) reading is switched on in the connection settings.",
          },
          {
            q: "Does it have a QR code?",
            a: "No, it works by tap only. Very old phones, or phones without contactless reading, can't open it. If you need a QR code, the Digital business card and the plates have one.",
          },
          {
            q: "What does it open?",
            a: "One destination per keychain, chosen when you order: a WhatsApp chat with your business, your Instagram or your website.",
          },
          {
            q: "How much does it cost?",
            a: "€5 + VAT per keychain. In packs, 10 for €45 and 25 for €100, + VAT. These prices are indicative and confirmed at the demo.",
          },
          {
            q: "How long does it take?",
            a: "A few working days. We give you the exact timing at the demo.",
          },
          {
            q: "How is it different from the Digital business card?",
            a: "The card opens a full contact page and has a QR code. The keychain is smaller and simpler: it opens a single destination directly.",
          },
        ],
      },
    ],
  },
};

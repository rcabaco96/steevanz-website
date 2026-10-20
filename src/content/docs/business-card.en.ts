import type { DocPageContent, DocPageId } from "../types";

export const en: Record<DocPageId, DocPageContent> = {
  "getting-started": {
    title: "Getting started with the digital business card",
    description:
      "What the digital business card is, what's included, what it costs and how the people you meet save your contact with one tap of their phone.",
    blocks: [
      {
        type: "p",
        text: "The digital business card is a credit-card-sized PVC card with your name, role, contact details and your company logo. With one tap of a phone on the card, or by scanning the QR code printed on it, people open your digital contact page and save your contact.",
      },
      {
        type: "p",
        text: "It's a done-for-you service: we design the card, create the page and keep it up to date. It works on iPhone and Android, and nobody needs to install an app.",
      },
      { type: "h2", id: "whats-included", text: "What's included" },
      {
        type: "table",
        head: ["Item", "Details"],
        rows: [
          ["PVC card", "Credit-card size (85.6 × 54 mm), printed on both sides with Steevanz quality"],
          ["Personalisation", "Your name, role, contact details and company logo, included in the price"],
          ["Digital contact page", "Fast, made for the phone, with the «Save contact» button"],
          ["Tap or QR", "Opens with one tap of a phone or with the QR code printed on the card, on iPhone and Android, with no app"],
          ["Changes included", "If your details change, we update the page at no extra cost and the card keeps working"],
        ],
      },
      { type: "h2", id: "pricing", text: "Pricing" },
      {
        type: "table",
        head: ["Quantity", "Price per card", "Total"],
        rows: [
          ["1 card", "€10", "€10"],
          ["From 10", "€9", "€90 (10)"],
          ["From 25", "€8", "€200 (25)"],
          ["From 50", "€7", "€350 (50)"],
        ],
      },
      {
        type: "p",
        text: "One pack can mix cards for different people at the same company, each with their own page. Prices + VAT, indicative and confirmed after the demo.",
      },
      { type: "h2", id: "how-it-works", text: "How it works for whoever taps" },
      {
        type: "ol",
        items: [
          "You show the card and the person brings their phone close (or scans the QR code with the camera).",
          "Your contact page opens, with your photo, name, role and company.",
          "With the «Save contact» button, your details go into their phone's contacts, with nothing typed by hand.",
        ],
      },
      {
        type: "callout",
        tone: "info",
        title: "See an example",
        text: "The contact page of Steevanz's founder: www.steevanz.com/c/rogerio-cabaco",
      },
      { type: "h2", id: "next-steps", text: "Next steps" },
      {
        type: "ul",
        items: [
          "[Setup](/en/docs/digital-business-card/setup): which details to send us and how you approve the card.",
          "[Configuration](/en/docs/digital-business-card/configuration): what the page shows, the «Save contact» button and how to ask for changes.",
          "[Usage](/en/docs/digital-business-card/usage): how to present the card at meetings, trade fairs and at the counter.",
        ],
      },
    ],
  },
  setup: {
    title: "Setting up the digital business card",
    description: "The details we need for the card and the page, how you approve the design and how you receive the tested cards.",
    blocks: [
      { type: "h2", id: "send-details", text: "1. Send us your details" },
      {
        type: "p",
        text: "Send them by WhatsApp or email, whichever is easier for you. If the cards are for several people at your company, send each person's details.",
      },
      {
        type: "table",
        head: ["Detail", "What it's for"],
        rows: [
          ["Name", "How you want it to appear on the card and the page"],
          ["Role", "Shown under your name"],
          ["Phone", "For the «Call» and «WhatsApp» buttons"],
          ["Email", "For the «Email» button"],
          ["Website", "For the «Website» button"],
          ["Social networks", "Instagram, LinkedIn or any others you want to show"],
          ["Address (optional)", "Shown with a map link, if you want it on the page"],
          ["Photo", "Shown on the page and in the saved contact"],
          ["Company logo", "Goes on the front of the card"],
        ],
      },
      {
        type: "callout",
        tone: "tip",
        text: "One pack can mix cards for different people at the same company. Each person has their own page.",
      },
      { type: "h2", id: "approve", text: "2. Approve the card and the page" },
      {
        type: "p",
        text: "We design the card: your logo on the front; your name, contact details, the QR code and the small tap symbol on the back. We also create your contact page. Before printing, we send you a proof of the card and the link to the page. We only print once you approve.",
      },
      { type: "h2", id: "receive", text: "3. Receive your cards" },
      {
        type: "p",
        text: "The cards are tested on iPhone and Android before delivery and arrive within a few working days. We give you the exact timing at the demo.",
      },
    ],
  },
  configuration: {
    title: "Configuring the digital business card",
    description: "What the contact page shows, what the saved contact contains, the page's language and how to ask for changes.",
    blocks: [
      { type: "h2", id: "contact-page", text: "What the contact page shows" },
      {
        type: "ol",
        items: [
          "Your photo, name, role and company.",
          "The «Save contact» button.",
          "The «Call», «WhatsApp», «Email» and «Website» buttons.",
          "Your social networks, such as Instagram or LinkedIn.",
          "Your address, with a map link, if you want to show it.",
        ],
      },
      {
        type: "p",
        text: "The page is fast, made for the phone and doesn't appear on Google: it only opens from the card or its link.",
      },
      { type: "h2", id: "save-contact", text: "The «Save contact» button" },
      {
        type: "p",
        text: "It downloads a contact file that the phone adds to its contacts. The saved contact includes:",
      },
      {
        type: "ul",
        items: ["Name", "Phone", "Email", "Website", "Company and role", "Photo"],
      },
      { type: "h2", id: "language", text: "Page language" },
      {
        type: "p",
        text: "The page is in your language: Portuguese, English, Spanish, French, German or Italian. Tell us which one you prefer when you send us your details.",
      },
      { type: "h2", id: "changes", text: "Asking for changes" },
      {
        type: "p",
        text: "You don't need to edit the page: we set it up and update it. If your number, role or email changes, send us the change by WhatsApp or email. It's included at no extra cost: we update the page and the card keeps working, same card, nothing to reprint.",
      },
    ],
  },
  usage: {
    title: "Using the digital business card",
    description: "How to present the card so people save your contact, and good practices at meetings, trade fairs and at the counter.",
    blocks: [
      { type: "h2", id: "present", text: "How to present the card" },
      {
        type: "ol",
        items: [
          "Hold the card out to the person.",
          "On an iPhone, they bring the top of the phone close to the card. On Android, the tap reading option just needs to be on.",
          "If the phone doesn't react, they point the camera at the QR code printed on the card.",
        ],
      },
      {
        type: "callout",
        tone: "tip",
        text: "Just say: «Bring your phone close and save my contact.» They get your correct details without typing anything.",
      },
      { type: "h2", id: "meetings", text: "At meetings" },
      {
        type: "p",
        text: "At the end of the meeting, show the card and ask them to save your contact right there. They get your name, phone, email and photo, with no typos. The card goes back into your wallet.",
      },
      { type: "h2", id: "trade-fairs", text: "At trade fairs and events" },
      {
        type: "p",
        text: "Paper cards run out at the worst moment. With the digital business card, every visitor saves your contact from the same card. You can still hand out cards if you want.",
      },
      { type: "h2", id: "counter", text: "At the counter" },
      {
        type: "p",
        text: "In a shop, a restaurant or an estate agency, keep the card to hand and invite the customer to save your contact before leaving. When they need you, they find you straight away in their contacts.",
      },
    ],
  },
  troubleshooting: {
    title: "Troubleshooting the digital business card",
    description: "What to do when a phone doesn't react to the tap, when the contact is saved without a photo or when the card gets damaged.",
    blocks: [
      { type: "h2", id: "tap-not-working", text: "The phone doesn't react to the tap" },
      {
        type: "ul",
        items: [
          "On iPhone XS and newer, just bring the top of the phone close to the card, with no app.",
          "On most Android phones, contactless (tap) reading must be switched on in the connection settings.",
          "On other phones, use the QR code printed on the card: just point the camera at it.",
        ],
      },
      {
        type: "callout",
        tone: "tip",
        text: "The QR code opens exactly the same page as the tap.",
      },
      { type: "h2", id: "no-photo", text: "The contact was saved without a photo" },
      {
        type: "p",
        text: "On some phones, the photo may not be kept in the saved contact. The other details are still saved, and the photo is still visible on your page.",
      },
      { type: "h2", id: "out-of-date", text: "The details are out of date" },
      {
        type: "p",
        text: "Send us the change by WhatsApp or email. We update the page at no extra cost and the card keeps working, with nothing to reprint.",
      },
      { type: "h2", id: "card-damaged", text: "The card is damaged or lost" },
      {
        type: "p",
        text: "Ask us for a new card. It links to the same page, so your details and your link stay the same.",
      },
    ],
  },
  faq: {
    title: "Digital business card FAQ",
    description: "Quick answers about iPhone and Android, changes, the logo, packs for teams, Google and timing.",
    blocks: [
      {
        type: "faq",
        items: [
          {
            q: "Does it work on iPhone and Android?",
            a: "Yes, with no app. On iPhone XS and newer, people just bring the top of the phone close. On most Android phones, tap reading needs to be on. For everyone else, there's the QR code printed on the card.",
          },
          {
            q: "Can I change my details later?",
            a: "Yes, and it's included at no extra cost. Send us the change by WhatsApp or email and we update the page. The card keeps working: same card, nothing to reprint.",
          },
          {
            q: "Can I edit the page myself?",
            a: "Not today. We set up and update the page, so just ask us.",
          },
          {
            q: "Does the company logo cost extra?",
            a: "No. Personalisation with your name, role, contact details and company logo is included in the price.",
          },
          {
            q: "In a pack, can the cards be for different people?",
            a: "Yes. One pack can mix cards for different people at the same company, each with their own page.",
          },
          {
            q: "Does my page appear on Google?",
            a: "No. The page isn't indexed by Google: it only opens from the card or its link.",
          },
          {
            q: "Can I still hand out cards?",
            a: "You can, if you want. But a single card can last for years, because there's nothing to reprint when a number or role changes.",
          },
          {
            q: "How long does it take to receive the cards?",
            a: "A few working days after you approve the design and the page. We give you the exact timing at the demo.",
          },
        ],
      },
    ],
  },
};

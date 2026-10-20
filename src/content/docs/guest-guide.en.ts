import type { DocPageContent, DocPageId } from "../types";

export const en: Record<DocPageId, DocPageContent> = {
  "getting-started": {
    title: "Getting started with the digital guest guide",
    description:
      "What the digital guest guide is, what it includes, how much it costs and how guests open it with one tap on a plate inside the property.",
    blocks: [
      {
        type: "p",
        text: "The digital guest guide is a mobile page with everything guests need to know during their stay: WiFi, check-in and check-out, house rules, appliances, bins, emergencies and your recommendations. It comes in Portuguese, English and two more languages, and opens with one tap on a plate placed inside the property, or through the QR code printed on the same plate.",
      },
      {
        type: "p",
        text: "It's a done-for-you service: we write, translate, publish and keep the guide up to date. There's nothing to install and no new tool to learn.",
      },
      { type: "h2", id: "whats-included", text: "What's included" },
      {
        type: "table",
        head: ["Item", "Details"],
        rows: [
          ["Writing the guide", "We turn your notes, photos or current guide into a clear page organised by topic"],
          ["Four languages", "Portuguese, English and two more of your choice (French, Spanish, German or Italian), checked by us"],
          ["Tap plates", "Wall plate, stand or sticker, with a QR code, to place inside the property"],
          ["Printable version", "A PDF with the same content, so a paper copy can stay in the property"],
          ["Online hosting and changes", "Hosting of the page and changes made by us within two working days"],
        ],
      },
      { type: "h2", id: "pricing", text: "Pricing" },
      {
        type: "table",
        head: ["Properties", "Plates (one per property)", "Monthly fee"],
        rows: [
          ["1 property", "1 free plate", "€30/month per account"],
          ["3 properties", "3 free plates", "€30/month per account"],
          ["10 properties", "10 free plates", "€30/month per account"],
        ],
      },
      {
        type: "p",
        text: "The guide costs €30 per month per account, + VAT, however many properties you have, with writing the guides, translation into four languages, online hosting and changes included. The plate is free, one per property. For example, 3 properties: €30/month + VAT, with 3 free plates. Additional languages have a small cost, shown in your quote. Prices exclude VAT, are proposals and are confirmed after the demo.",
      },
      { type: "h2", id: "how-it-works", text: "How it works for guests" },
      {
        type: "ol",
        items: [
          "Guests walk in and hold their phone near the plate (or scan the QR code).",
          "The guide opens in the phone's language, with a button to switch languages.",
          "They find the WiFi (with a copy-password button), the house rules and your recommendations without messaging you.",
        ],
      },
      {
        type: "callout",
        tone: "info",
        title: "What the guide never contains",
        text: "Door, key-box or alarm codes. Those keep going out in your check-in message.",
      },
      { type: "h2", id: "next-steps", text: "Next steps" },
      {
        type: "ul",
        items: [
          "[Setup](/en/docs/digital-guest-guide/setup): what information to send us and where to put the plate.",
          "[Configuration](/en/docs/digital-guest-guide/configuration): languages, sections and how to request changes.",
          "[Usage](/en/docs/digital-guest-guide/usage): good practice so guests actually read the guide.",
        ],
      },
    ],
  },
  setup: {
    title: "Setting up the digital guest guide",
    description: "The information we need to write the guide, how you approve the draft and where to place the plate inside the property.",
    blocks: [
      { type: "h2", id: "send-information", text: "1. Send us the information" },
      {
        type: "p",
        text: "Send it however suits you: a document, photos, the paper guide you already have or a WhatsApp voice message. We'll organise it.",
      },
      {
        type: "table",
        head: ["Topic", "What to tell us"],
        rows: [
          ["Check-in and check-out", "Times, how to leave the keys, what to do with rubbish and linen"],
          ["WiFi", "Network name and password"],
          ["The property", "How the hob, oven, washing machine, heating, air conditioning and hot water work"],
          ["Rules", "House and building rules, quiet hours, smoking, pets, parties"],
          ["Bins and recycling", "Where the bins are and how to sort waste"],
          ["Getting there and parking", "From the airport and station, parking and public transport"],
          ["Emergencies", "Your contact, nearest pharmacy, hospital and health centre"],
          ["Recommendations", "Restaurants, beaches, walks and shops you recommend"],
          ["Legal details", "Registration number (RNAL)"],
        ],
      },
      {
        type: "callout",
        tone: "warning",
        title: "Don't send us access codes",
        text: "Door, key-box and alarm codes never go into the guide. If one reaches us by mistake, we don't publish it.",
      },
      { type: "h2", id: "approve", text: "2. Approve the draft" },
      {
        type: "p",
        text: "Within about three working days we send you a link to the draft in Portuguese and the other languages. Ask for any corrections you like. We only publish once you approve.",
      },
      { type: "h2", id: "place-plate", text: "3. Place the plate" },
      {
        type: "p",
        text: "The plate arrives written and tested within two to four working days. Place it inside the property, somewhere guests see as they walk in.",
      },
      {
        type: "table",
        head: ["Format", "Where it works best"],
        rows: [
          ["Wall plate", "By the front door, on the inside"],
          ["Stand", "On the living-room table, the kitchen counter or at reception"],
          ["Sticker", "On the fridge or the hall mirror"],
        ],
      },
      {
        type: "callout",
        tone: "tip",
        text: "Avoid the outside door: the guide contains the WiFi password and should only be within reach of people staying there.",
      },
    ],
  },
  configuration: {
    title: "Configuring the digital guest guide",
    description: "Languages, guide sections, the \"Review your stay\" section, the link to your website and how to request changes.",
    blocks: [
      { type: "h2", id: "languages", text: "Languages" },
      {
        type: "p",
        text: "The guide includes Portuguese, English and two more languages of your choice from French, Spanish, German and Italian. It opens automatically in the language of the guest's phone and has a switcher. If you need more languages, we include the cost in your quote.",
      },
      { type: "h2", id: "sections", text: "Sections" },
      {
        type: "ul",
        items: [
          "Welcome",
          "Check-in and check-out",
          "WiFi, with a copy-password button",
          "How the property works: appliances, heating, air conditioning and hot water",
          "House and building rules",
          "Bins and recycling",
          "Noise and neighbours",
          "Emergencies: 112, your contact, pharmacy, hospital and health centre",
          "Getting there and parking",
          "Host recommendations",
          "Tourist tax: what it is and why it's charged",
          "Review your stay",
          "Complaints book and registration number",
        ],
      },
      {
        type: "p",
        text: "Together, these sections include the content Portuguese law requires in a holiday rental's information book: how the property works, rules, waste, appliances, noise, building rules and the contact of the person in charge, in Portuguese, English and two more languages.",
      },
      { type: "h2", id: "review-your-stay", text: "The \"Review your stay\" section" },
      {
        type: "p",
        text: "It's the same for every guest: it explains that Booking.com sends its review request by email and Airbnb in the app (under Trips), after check-out, and that their opinion helps other travellers. It offers no discounts or gifts and doesn't ask for a particular score, because the platforms forbid it. If your property has a Google profile, we can add the Google link.",
      },
      { type: "h2", id: "website", text: "Link to your website" },
      {
        type: "p",
        text: "If you have your own website, we can show a discreet \"Official website\" link. It's off by default: Airbnb forbids encouraging guests to book off the platform, so we never use lines like \"book direct and save\".",
      },
      { type: "h2", id: "changes", text: "Requesting changes" },
      {
        type: "p",
        text: "Send us what changed by WhatsApp or email. We update the guide and the PDF within two working days, in every language. The plate never needs replacing.",
      },
    ],
  },
  usage: {
    title: "Using the digital guest guide",
    description: "Good practice so guests find and use the guide, and how it works together with the WhatsApp assistant.",
    blocks: [
      { type: "h2", id: "let-guests-know", text: "Let guests know about the guide" },
      {
        type: "ul",
        items: [
          "Mention it in your check-in message: \"When you arrive, tap the plate by the door for the WiFi and everything about the house.\"",
          "Place the plate where it's seen straight away.",
          "Leave the printed version in a drawer or on the living-room table for guests who prefer paper.",
        ],
      },
      { type: "h2", id: "recommendations", text: "Recommendations that make a difference" },
      {
        type: "p",
        text: "Guests value what only a local knows: the neighbourhood bakery, the quieter beach, the restaurant with no tourists. Five to ten well-chosen recommendations beat a long list.",
      },
      { type: "h2", id: "assistant", text: "With the WhatsApp assistant" },
      {
        type: "p",
        text: "If you also have the AI assistant, the guide's content is its knowledge base. When a guest asks on WhatsApp, they get the same answer that's in the guide, in their language. The assistant never shares access codes either.",
      },
      { type: "h2", id: "several-properties", text: "Several properties" },
      {
        type: "p",
        text: "Each property has its own guide and plate. For managers, we keep the same look across all of them and apply shared changes in one go, such as new building rules or a different emergency contact.",
      },
    ],
  },
  troubleshooting: {
    title: "Troubleshooting the digital guest guide",
    description: "What to do when a guest can't open the guide with a tap or when information is out of date.",
    blocks: [
      { type: "h2", id: "tap-does-not-open", text: "The tap doesn't open the guide" },
      {
        type: "ul",
        items: [
          "On iPhone XS and newer, just hold the top of the phone near the plate with the screen on.",
          "On Android, contactless (tap) reading must be switched on in settings. Many phones have it on already.",
          "Thick or metal cases can block the reading. In that case, guests use the QR code.",
        ],
      },
      {
        type: "callout",
        tone: "tip",
        text: "Every plate has a printed QR code. Anyone who can't open it with a tap points the camera and lands on the same guide.",
      },
      { type: "h2", id: "outdated-information", text: "Some information is out of date" },
      {
        type: "p",
        text: "Send us the correction by WhatsApp or email. We update it within two working days. For urgent cases, such as a wrong WiFi password, tell us and we'll prioritise it.",
      },
      { type: "h2", id: "damaged-plate", text: "The plate broke or went missing" },
      {
        type: "p",
        text: "We send a new one with the same address, so the guide stays the same. An extra plate for the same property has a small cost, shown in your quote.",
      },
      { type: "h2", id: "shared-link", text: "The link was shared outside the property" },
      {
        type: "p",
        text: "The guide's address is private and impossible to guess, but a guest could save it. If you change the WiFi password or want a new address, tell us and we'll create one and rewrite the plate.",
      },
    ],
  },
  faq: {
    title: "Digital guest guide FAQ",
    description: "Quick answers on pricing, languages, security, reviews and the mandatory holiday-rental sign.",
    blocks: [
      {
        type: "faq",
        items: [
          {
            q: "What does it cost per month?",
            a: "€30 per month per account, + VAT, however many properties you have, with online hosting and changes included. The plate is free, one per property. For example, 3 properties: €30/month + VAT, with 3 free plates. With the Holiday-rental pack, the guide is included while the pack is active.",
          },
          {
            q: "Does the guide count as the information book the law requires?",
            a: "The guide includes the content the law asks for in the information book, in Portuguese, English and two more languages, and we deliver a printable version that we recommend keeping in the property.",
          },
          {
            q: "Does the guide replace the mandatory holiday-rental sign?",
            a: "No. The identification sign with your registration number follows an official model set by law. The guide shows your registration number, but it doesn't replace that sign.",
          },
          {
            q: "Does the guide collect guest data?",
            a: "No. The guide has no forms and asks for no personal data. Only the usual technical server logs are kept.",
          },
          {
            q: "Can I ask for reviews through the guide?",
            a: "The guide has a neutral section explaining where to leave a review, the same for everyone and with nothing offered in return, as Booking.com and Airbnb require.",
          },
          {
            q: "Do you file the SIBA guest registrations?",
            a: "No. If you want deadline reminders, the \"Cleanings and deadlines\" automation handles that. For automatic filing, we recommend specialist tools such as Chekin or Hostkit.",
          },
        ],
      },
    ],
  },
};

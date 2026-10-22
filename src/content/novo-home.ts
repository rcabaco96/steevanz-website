// Copy for the home page in the six languages: «/» (pt), «/en», «/es», «/fr», «/de» and «/it», the same
// sections in the same order. Facts only: every price comes from products.ts (always without VAT,
// «+ IVA» / «+ VAT» / «+ TVA» / «zzgl. MwSt.») and every client named here is one the owner allowed us
// to show. No invented numbers, reviews or testimonials.

// Relative imports with extensions keep this module runnable by `node --test` (tests/home-novo.test.mjs).
import { locales, localize, type Locale, type Localized } from "../lib/i18n.ts";
import type { ProductId } from "./types";

/** The plate animations (components/visuals/HeroTapScene and ReviewTapScene). */
export interface TapSceneCopy {
  plateLine1: string;
  plateLine2: string;
  /** Small plain-text platform names under the plate's lines (no logos). */
  plateMarks: string;
  screenIdle: string;
  screenTitle: string;
  screenPrompt: string;
  screenButton: string;
  chipNoApp: string;
  chipTap: string;
  ariaLabel: string;
}

export const sceneCopy: Localized<TapSceneCopy> = {
  pt: {
    plateLine1: "Avalie-nos",
    plateLine2: "Toque ou leia o QR",
    plateMarks: "Google · Booking · Tripadvisor",
    screenIdle: "Aproxime o telemóvel",
    screenTitle: "O seu restaurante",
    screenPrompt: "Deixe a sua avaliação",
    screenButton: "Publicar",
    chipNoApp: "Sem app",
    chipTap: "Abre em segundos",
    ariaLabel: "Animação: um telemóvel toca numa placa para avaliações e abre o formulário de avaliação, onde o cliente toca nas estrelas.",
  },
  en: {
    plateLine1: "Review us",
    plateLine2: "Tap or scan the QR",
    plateMarks: "Google · Booking · Tripadvisor",
    screenIdle: "Hold your phone near",
    screenTitle: "Your restaurant",
    screenPrompt: "Leave a review",
    screenButton: "Post",
    chipNoApp: "No app",
    chipTap: "Opens in seconds",
    ariaLabel: "Animation: a phone taps a review plate and opens the review form, where the customer taps the stars.",
  },
  es: {
    plateLine1: "Valórenos",
    plateLine2: "Toque o escanee el QR",
    plateMarks: "Google · Booking · Tripadvisor",
    screenIdle: "Acerque el móvil",
    screenTitle: "Su restaurante",
    screenPrompt: "Deje su reseña",
    screenButton: "Publicar",
    chipNoApp: "Sin app",
    chipTap: "Se abre en segundos",
    ariaLabel: "Animación: un móvil toca una placa para reseñas y abre el formulario de reseña, donde el cliente toca las estrellas.",
  },
  fr: {
    plateLine1: "Notez-nous",
    plateLine2: "Touchez ou scannez le QR",
    plateMarks: "Google · Booking · Tripadvisor",
    screenIdle: "Approchez votre téléphone",
    screenTitle: "Votre restaurant",
    screenPrompt: "Laissez votre avis",
    screenButton: "Publier",
    chipNoApp: "Sans application",
    chipTap: "S'ouvre en quelques secondes",
    ariaLabel: "Animation : un téléphone touche une plaque pour avis et ouvre le formulaire d'avis, où le client touche les étoiles.",
  },
  de: {
    plateLine1: "Ihre Meinung?",
    plateLine2: "Antippen oder QR scannen",
    plateMarks: "Google · Booking · Tripadvisor",
    screenIdle: "Handy hierhin halten",
    screenTitle: "Ihr Restaurant",
    screenPrompt: "Bewertung abgeben",
    screenButton: "Posten",
    chipNoApp: "Keine App",
    chipTap: "Öffnet in Sekunden",
    ariaLabel: "Animation: Ein Handy berührt ein Bewertungsschild und öffnet das Bewertungsformular, in dem der Gast die Sterne antippt.",
  },
  it: {
    plateLine1: "Ci recensisca",
    plateLine2: "Tocchi o inquadri il QR",
    plateMarks: "Google · Booking · Tripadvisor",
    screenIdle: "Avvicini il telefono",
    screenTitle: "Il Suo ristorante",
    screenPrompt: "Lasci una recensione",
    screenButton: "Pubblica",
    chipNoApp: "Senza app",
    chipTap: "Si apre in pochi secondi",
    ariaLabel: "Animazione: un telefono tocca una targa per recensioni e apre il modulo di recensione, dove il cliente tocca le stelle.",
  },
};

const novoPt = {
  metaTitle: "Steevanz | Os seus clientes encontram, compram e voltam",
  metaDescription:
    "Websites, Menu digital em vídeo, reservas, placas para avaliações e cartão de cliente para restaurantes, cafés, cabeleireiros, clínicas, alojamentos e lojas.",
  hero: {
    eyebrow: "Tecnologia para negócios locais",
    titleStart: "Os seus clientes",
    titleAccent: "encontram, compram e voltam.",
    subtitle:
      "Websites, reservas, Menu digital, placas para avaliações, cartão de cliente e assistentes com IA. Nós fazemos, configuramos e ficamos por perto.",
    primary: "Agendar demonstração",
    secondary: "Falar connosco",
  },
  whatsappMessage: "Olá! Gostava de saber mais sobre as soluções da Steevanz.",
  perMonth: "/mês",
  clients: {
    // Owner, 2026-10-22: «super podre e fraca» → a real band. Truthful only: the logos are real clients (sport,
    // cars, banking, insurance, accounting) and «desde 2021» is the About page's own date.
    eyebrow: "Clientes",
    titleStart: "Grandes marcas e negócios locais",
    titleAccent: "confiam em nós.",
    lead: "Do desporto aos automóveis, da banca aos seguros. Desde 2021, o mesmo cuidado com cada cliente, grande ou pequeno.",
  },
  goals: {
    title: "O que quer melhorar?",
    lead: "Escolha o objetivo. Mostramos o que resolve, a funcionar, e quanto custa.",
    from: "desde",
    vat: "+ IVA",
  },
  showcase: {
    title: "O Menu digital que abre o apetite",
    lead: "Os pratos em vídeo, com preços, num toque na mesa. E a mesa pode fazer o pedido ali mesmo.",
    steps: [
      { title: "Um toque na placa", body: "O cliente encosta o telemóvel à placa da mesa. Não instala nada." },
      { title: "Os pratos em vídeo", body: "Cada prato num vídeo curto, com nome, descrição e preço." },
      { title: "Pedir à mesa", body: "Escolhe, acrescenta notas e faz o pedido. A equipa confirma no seu ecrã." },
    ],
    cta: "Conhecer o Menu digital",
    from: "desde",
    vat: "+ IVA",
  },
  finalCta: {
    title: "Conte-nos o que quer melhorar.",
    body: "Uma conversa sem compromisso: mostramos tudo a funcionar e dizemos com franqueza o que faz sentido para o seu negócio.",
    primary: "Agendar demonstração",
    secondary: "Falar no WhatsApp",
  },
  /** The two-line brand line (owner, 2026-10-18): always both sentences, in this order. */
  brandLine: ["Tecnologia do futuro.", "Com os bons modos de antigamente."],
};

export type NovoCopy = typeof novoPt;

export const novoCopy: Localized<NovoCopy> = {
  pt: novoPt,
  en: {
    metaTitle: "Steevanz | Your customers find you, buy from you and come back",
    metaDescription:
      "Websites, video digital menus, bookings, review plates and digital loyalty cards for restaurants, cafés, salons, clinics, holiday rentals and shops.",
    hero: {
      eyebrow: "Technology for local businesses",
      titleStart: "Your customers",
      titleAccent: "find you, buy from you and come back.",
      subtitle:
        "Websites, bookings, digital menus, review plates, loyalty cards and AI assistants. We build it, set it up and stay close by.",
      primary: "Book a demo",
      secondary: "Talk to us",
    },
    whatsappMessage: "Hi! I'd like to know more about Steevanz solutions.",
    perMonth: "/month",
    clients: {
      eyebrow: "Clients",
      titleStart: "Big brands and local businesses",
      titleAccent: "trust us.",
      lead: "From sport to cars, from banking to insurance. Since 2021, the same care for every client, large or small.",
    },
    goals: {
      title: "What would you like to improve?",
      lead: "Pick a goal. We'll show you what solves it, working, and what it costs.",
      from: "from",
      vat: "+ VAT",
    },
    showcase: {
      title: "A digital menu that whets the appetite",
      lead: "Your dishes on video, with prices, one tap away at the table. And the table can order right there.",
      steps: [
        { title: "One tap on the plate", body: "Customers hold their phone to the table plate. Nothing to install." },
        { title: "Dishes on video", body: "Each dish in a short video, with its name, description and price." },
        { title: "Order at the table", body: "They choose, add notes and send the order. Your team confirms it on screen." },
      ],
      cta: "Discover the digital menu",
      from: "from",
      vat: "+ VAT",
    },
    finalCta: {
      title: "Tell us what you'd like to improve.",
      body: "A friendly, no-strings chat: we show you everything working and tell you honestly what makes sense for your business.",
      primary: "Book a demo",
      secondary: "Chat on WhatsApp",
    },
    /** The two-line brand line, in English. */
    brandLine: ["Technology of the future.", "With good old-fashioned manners."],
  },
  es: {
    metaTitle: "Steevanz | Sus clientes le encuentran, le compran y vuelven",
    metaDescription:
      "Webs, Menú digital en vídeo, reservas, placas para reseñas y tarjeta de cliente digital para restaurantes, cafeterías, peluquerías, clínicas, alojamientos y tiendas.",
    hero: {
      eyebrow: "Tecnología para negocios locales",
      titleStart: "Sus clientes",
      titleAccent: "le encuentran, le compran y vuelven.",
      subtitle:
        "Webs, reservas, Menú digital, placas para reseñas, tarjeta de cliente y asistentes con IA. Nosotros lo hacemos, lo configuramos y seguimos a su lado.",
      primary: "Reservar una demostración",
      secondary: "Hablar con nosotros",
    },
    whatsappMessage: "¡Hola! Me gustaría saber más sobre las soluciones de Steevanz.",
    perMonth: "/mes",
    clients: {
      eyebrow: "Clientes",
      titleStart: "Grandes marcas y negocios locales",
      titleAccent: "confían en nosotros.",
      lead: "Del deporte a la automoción, de la banca a los seguros. Desde 2021, el mismo cuidado con cada cliente, grande o pequeño.",
    },
    goals: {
      title: "¿Qué quiere mejorar?",
      lead: "Elija el objetivo. Le enseñamos lo que lo resuelve, funcionando, y cuánto cuesta.",
      from: "desde",
      vat: "+ IVA",
    },
    showcase: {
      title: "El Menú digital que abre el apetito",
      lead: "Los platos en vídeo, con precios, con un toque en la mesa. Y la mesa puede pedir ahí mismo.",
      steps: [
        { title: "Un toque en la placa", body: "El cliente acerca el móvil a la placa de la mesa. No instala nada." },
        { title: "Los platos en vídeo", body: "Cada plato en un vídeo corto, con nombre, descripción y precio." },
        { title: "Pedir en la mesa", body: "Elige, añade notas y hace el pedido. Su equipo lo confirma en pantalla." },
      ],
      cta: "Conocer el Menú digital",
      from: "desde",
      vat: "+ IVA",
    },
    finalCta: {
      title: "Cuéntenos qué quiere mejorar.",
      body: "Una conversación sin compromiso: se lo enseñamos todo funcionando y le decimos con franqueza qué tiene sentido para su negocio.",
      primary: "Reservar una demostración",
      secondary: "Hablar por WhatsApp",
    },
    brandLine: ["Tecnología del futuro.", "Con los buenos modales de antes."],
  },
  fr: {
    metaTitle: "Steevanz | Vos clients vous trouvent, achètent chez vous et reviennent",
    metaDescription:
      "Sites web, Menu digital en vidéo, réservations, plaques pour avis et carte de fidélité digitale pour restaurants, cafés, salons de coiffure, cliniques, locations de vacances et boutiques.",
    hero: {
      eyebrow: "Technologie pour les commerces locaux",
      titleStart: "Vos clients",
      titleAccent: "vous trouvent, achètent chez vous et reviennent.",
      subtitle:
        "Sites web, réservations, Menu digital, plaques pour avis, carte de fidélité et assistants IA. Nous les créons, les configurons et restons à vos côtés.",
      primary: "Réserver une démo",
      secondary: "Nous parler",
    },
    whatsappMessage: "Bonjour ! J'aimerais en savoir plus sur les solutions Steevanz.",
    perMonth: "/mois",
    clients: {
      eyebrow: "Clients",
      titleStart: "Grandes marques et commerces de proximité",
      titleAccent: "nous font confiance.",
      lead: "Du sport à l'automobile, de la banque à l'assurance. Depuis 2021, le même soin pour chaque client, grand ou petit.",
    },
    goals: {
      title: "Que souhaitez-vous améliorer ?",
      lead: "Choisissez un objectif. Nous vous montrons ce qui y répond, en fonctionnement, et ce que cela coûte.",
      from: "à partir de",
      vat: "+ TVA",
    },
    showcase: {
      title: "Un Menu digital qui met en appétit",
      lead: "Vos plats en vidéo, avec les prix, d'un toucher sur la table. Et la table peut commander directement.",
      steps: [
        { title: "Un toucher sur la plaque", body: "Le client approche son téléphone de la plaque de table. Rien à installer." },
        { title: "Les plats en vidéo", body: "Chaque plat dans une courte vidéo, avec son nom, sa description et son prix." },
        { title: "Commander à table", body: "Il choisit, ajoute ses remarques et passe commande. Votre équipe confirme sur son écran." },
      ],
      cta: "Découvrir le Menu digital",
      from: "à partir de",
      vat: "+ TVA",
    },
    finalCta: {
      title: "Dites-nous ce que vous voulez améliorer.",
      body: "Un échange sans engagement : nous vous montrons tout en fonctionnement et vous disons franchement ce qui a du sens pour votre activité.",
      primary: "Réserver une démo",
      secondary: "Écrire sur WhatsApp",
    },
    brandLine: ["Technologie du futur.", "Avec les bonnes manières d'antan."],
  },
  de: {
    metaTitle: "Steevanz | Ihre Kunden finden Sie, kaufen bei Ihnen und kommen wieder",
    metaDescription:
      "Websites, digitale Speisekarte mit Videos, Reservierungen, Bewertungsschilder und digitale Kundenkarte für Restaurants, Cafés, Friseursalons, Praxen, Ferienunterkünfte und Geschäfte.",
    hero: {
      eyebrow: "Technologie für lokale Betriebe",
      titleStart: "Ihre Kunden",
      titleAccent: "finden Sie, kaufen bei Ihnen und kommen wieder.",
      subtitle:
        "Websites, Reservierungen, digitale Speisekarte, Bewertungsschilder, Kundenkarte und KI-Assistenten. Wir bauen es, richten es ein und bleiben an Ihrer Seite.",
      primary: "Demo vereinbaren",
      secondary: "Mit uns sprechen",
    },
    whatsappMessage: "Hallo! Ich möchte mehr über die Lösungen von Steevanz erfahren.",
    perMonth: "/Monat",
    clients: {
      eyebrow: "Kunden",
      titleStart: "Große Marken und lokale Betriebe",
      titleAccent: "vertrauen uns.",
      lead: "Vom Sport bis zum Automobil, von Banken bis zu Versicherungen. Seit 2021 dieselbe Sorgfalt für jeden Kunden, ob groß oder klein.",
    },
    goals: {
      title: "Was möchten Sie verbessern?",
      lead: "Wählen Sie ein Ziel. Wir zeigen Ihnen, was hilft, live im Einsatz, und was es kostet.",
      from: "ab",
      vat: "zzgl. MwSt.",
    },
    showcase: {
      title: "Die digitale Speisekarte, die Appetit macht",
      lead: "Ihre Gerichte als Video, mit Preisen, mit einem Antippen am Tisch. Und der Tisch kann direkt dort bestellen.",
      steps: [
        { title: "Einmal antippen", body: "Der Gast hält sein Handy an das Tischschild. Nichts zu installieren." },
        { title: "Gerichte als Video", body: "Jedes Gericht in einem kurzen Video, mit Name, Beschreibung und Preis." },
        { title: "Am Tisch bestellen", body: "Auswählen, Wünsche notieren, bestellen. Ihr Team bestätigt am Bildschirm." },
      ],
      cta: "Die digitale Speisekarte entdecken",
      from: "ab",
      vat: "zzgl. MwSt.",
    },
    finalCta: {
      title: "Erzählen Sie uns, was Sie verbessern möchten.",
      body: "Ein unverbindliches Gespräch: Wir zeigen Ihnen alles live und sagen Ihnen ehrlich, was für Ihren Betrieb sinnvoll ist.",
      primary: "Demo vereinbaren",
      secondary: "Auf WhatsApp schreiben",
    },
    brandLine: ["Technologie der Zukunft.", "Mit den guten Manieren von früher."],
  },
  it: {
    metaTitle: "Steevanz | I Suoi clienti La trovano, comprano da Lei e tornano",
    metaDescription:
      "Siti web, Menù digitale in video, prenotazioni, targhe per recensioni e carta fedeltà digitale per ristoranti, bar, parrucchieri, cliniche, case vacanza e negozi.",
    hero: {
      eyebrow: "Tecnologia per le attività locali",
      titleStart: "I Suoi clienti",
      titleAccent: "La trovano, comprano da Lei e tornano.",
      subtitle:
        "Siti web, prenotazioni, Menù digitale, targhe per recensioni, carta fedeltà e assistenti con IA. Li realizziamo, li configuriamo e restiamo al Suo fianco.",
      primary: "Prenoti una demo",
      secondary: "Parliamone",
    },
    whatsappMessage: "Buongiorno! Vorrei saperne di più sulle soluzioni Steevanz.",
    perMonth: "/mese",
    clients: {
      eyebrow: "Clienti",
      titleStart: "Grandi marchi e attività locali",
      titleAccent: "si fidano di noi.",
      lead: "Dallo sport all'automobile, dalla banca alle assicurazioni. Dal 2021, la stessa cura per ogni cliente, grande o piccolo.",
    },
    goals: {
      title: "Cosa vuole migliorare?",
      lead: "Scelga l'obiettivo. Le mostriamo cosa lo risolve, già in funzione, e quanto costa.",
      from: "da",
      vat: "+ IVA",
    },
    showcase: {
      title: "Il Menù digitale che stuzzica l'appetito",
      lead: "I piatti in video, con i prezzi, con un tocco al tavolo. E il tavolo può ordinare direttamente.",
      steps: [
        { title: "Un tocco sulla targa", body: "Il cliente avvicina il telefono alla targa sul tavolo. Niente da installare." },
        { title: "I piatti in video", body: "Ogni piatto in un breve video, con nome, descrizione e prezzo." },
        { title: "Ordinare al tavolo", body: "Sceglie, aggiunge note e invia l'ordine. Lo staff conferma sul suo schermo." },
      ],
      cta: "Scopra il Menù digitale",
      from: "da",
      vat: "+ IVA",
    },
    finalCta: {
      title: "Ci racconti cosa vuole migliorare.",
      body: "Una chiacchierata senza impegno: Le mostriamo tutto in funzione e Le diciamo con franchezza cosa ha senso per la Sua attività.",
      primary: "Prenoti una demo",
      secondary: "Ci scriva su WhatsApp",
    },
    brandLine: ["Tecnologia del futuro.", "Con le buone maniere di una volta."],
  },
};

/** The hero's three sectors and the Steevanz moments over their footage (owner, 2026-10-22: «Negócios reais +
 * Steevanz», three columns: café | restaurant, hair salon | holiday rental, clinic | practice). Fictional businesses;
 * the review card is only the empty form whose stars are being tapped (no names, counts or averages); no prices;
 * the guest guide shows the Wi-Fi and check-in, never a door code. */
export interface HeroReelCopy {
  /** Each sector's two names, shown as «A | B». */
  places: [[string, string], [string, string], [string, string]];
  review: { business: string; prompt: string; publish: string; chip: string };
  menu: { dish: string; note: string };
  booking: { kicker: string; business: string; done: string; service: string; when: string; chip: string };
  guide: { kicker: string; business: string; wifi: string; network: string; copy: string; times: string; chip: string; chipNote: string };
  clinic: { kicker: string; business: string; done: string; when: string; reminder: string; chipNote: string };
}

export const heroReelCopy: Localized<HeroReelCopy> = {
  pt: {
    places: [["Café", "Restaurante"], ["Cabeleireiros", "Alojamento local"], ["Clínicas", "Consultórios"]],
    review: { business: "Café da Praça", prompt: "Deixe a sua avaliação", publish: "Publicar", chip: "Avalie-nos" },
    menu: { dish: "Pizza Margherita", note: "Menu digital · em vídeo" },
    booking: { kicker: "Marcar serviço", business: "Salão Flor de Lis", done: "Está reservado.", service: "Corte + brushing · Ana", when: "Sábado · 11:00", chip: "Corte + brushing · 11:00" },
    guide: { kicker: "Guia digital", business: "Casa das Ondas", wifi: "Wi-Fi", network: "CasaOndas_5G", copy: "Copiar password", times: "Check-in 15:00 · Check-out 11:00", chip: "Guia da casa", chipNote: "Wi-Fi · Check-in 15:00" },
    clinic: { kicker: "Marcar consulta", business: "Clínica Sorriso Atlântico", done: "Consulta marcada.", when: "Terça · 09:30", reminder: "Lembrete por email na véspera", chipNote: "Lembrete na véspera" },
  },
  en: {
    places: [["Café", "Restaurant"], ["Hair salons", "Holiday rentals"], ["Clinics", "Practices"]],
    review: { business: "Café da Praça", prompt: "Leave a review", publish: "Post", chip: "Rate us" },
    menu: { dish: "Pizza Margherita", note: "Digital menu · on video" },
    booking: { kicker: "Book a service", business: "Salão Flor de Lis", done: "You're booked.", service: "Cut + blow-dry · Ana", when: "Saturday · 11:00", chip: "Cut + blow-dry · 11:00" },
    guide: { kicker: "Digital guide", business: "Casa das Ondas", wifi: "Wi-Fi", network: "CasaOndas_5G", copy: "Copy password", times: "Check-in 15:00 · Check-out 11:00", chip: "House guide", chipNote: "Wi-Fi · Check-in 15:00" },
    clinic: { kicker: "Book an appointment", business: "Clínica Sorriso Atlântico", done: "Appointment booked.", when: "Tuesday · 09:30", reminder: "Email reminder the day before", chipNote: "Reminder the day before" },
  },
  es: {
    places: [["Cafetería", "Restaurante"], ["Peluquerías", "Alojamiento turístico"], ["Clínicas", "Consultas"]],
    review: { business: "Café da Praça", prompt: "Deje su reseña", publish: "Publicar", chip: "Valórenos" },
    menu: { dish: "Pizza Margherita", note: "Menú digital · en vídeo" },
    booking: { kicker: "Reservar servicio", business: "Salão Flor de Lis", done: "Cita reservada.", service: "Corte + peinado · Ana", when: "Sábado · 11:00", chip: "Corte + peinado · 11:00" },
    guide: { kicker: "Guía digital", business: "Casa das Ondas", wifi: "Wi-Fi", network: "CasaOndas_5G", copy: "Copiar contraseña", times: "Check-in 15:00 · Check-out 11:00", chip: "Guía de la casa", chipNote: "Wi-Fi · Check-in 15:00" },
    clinic: { kicker: "Pedir cita", business: "Clínica Sorriso Atlântico", done: "Cita confirmada.", when: "Martes · 09:30", reminder: "Recordatorio por email el día antes", chipNote: "Recordatorio el día antes" },
  },
  fr: {
    places: [["Café", "Restaurant"], ["Coiffure", "Location saisonnière"], ["Cliniques", "Cabinets"]],
    review: { business: "Café da Praça", prompt: "Laissez votre avis", publish: "Publier", chip: "Notez-nous" },
    menu: { dish: "Pizza Margherita", note: "Menu digital · en vidéo" },
    booking: { kicker: "Réserver une prestation", business: "Salão Flor de Lis", done: "C'est réservé.", service: "Coupe + brushing · Ana", when: "Samedi · 11 h", chip: "Coupe + brushing · 11 h" },
    guide: { kicker: "Guide digital", business: "Casa das Ondas", wifi: "Wi-Fi", network: "CasaOndas_5G", copy: "Copier le mot de passe", times: "Arrivée 15 h · Départ 11 h", chip: "Guide de la maison", chipNote: "Wi-Fi · Arrivée 15 h" },
    clinic: { kicker: "Prendre rendez-vous", business: "Clínica Sorriso Atlântico", done: "Rendez-vous confirmé.", when: "Mardi · 9 h 30", reminder: "Rappel par e-mail la veille", chipNote: "Rappel la veille" },
  },
  de: {
    places: [["Café", "Restaurant"], ["Friseure", "Ferienwohnungen"], ["Kliniken", "Praxen"]],
    review: { business: "Café da Praça", prompt: "Ihre Bewertung", publish: "Veröffentlichen", chip: "Bewerten Sie uns" },
    menu: { dish: "Pizza Margherita", note: "Digitale Speisekarte · im Video" },
    booking: { kicker: "Termin buchen", business: "Salão Flor de Lis", done: "Reserviert.", service: "Schnitt + Föhnen · Ana", when: "Samstag · 11:00 Uhr", chip: "Schnitt + Föhnen · 11:00" },
    guide: { kicker: "Digitale Gästemappe", business: "Casa das Ondas", wifi: "WLAN", network: "CasaOndas_5G", copy: "Passwort kopieren", times: "Check-in 15:00 · Check-out 11:00", chip: "Gästemappe", chipNote: "WLAN · Check-in 15:00" },
    clinic: { kicker: "Termin vereinbaren", business: "Clínica Sorriso Atlântico", done: "Termin gebucht.", when: "Dienstag · 09:30 Uhr", reminder: "Erinnerung per E-Mail am Vortag", chipNote: "Erinnerung am Vortag" },
  },
  it: {
    places: [["Bar", "Ristorante"], ["Parrucchieri", "Case vacanza"], ["Cliniche", "Studi medici"]],
    review: { business: "Café da Praça", prompt: "Lasci una recensione", publish: "Pubblica", chip: "Ci valuti" },
    menu: { dish: "Pizza Margherita", note: "Menù digitale · in video" },
    booking: { kicker: "Prenoti un servizio", business: "Salão Flor de Lis", done: "È prenotato.", service: "Taglio + piega · Ana", when: "Sabato · 11:00", chip: "Taglio + piega · 11:00" },
    guide: { kicker: "Guida digitale", business: "Casa das Ondas", wifi: "Wi-Fi", network: "CasaOndas_5G", copy: "Copi la password", times: "Check-in 15:00 · Check-out 11:00", chip: "Guida della casa", chipNote: "Wi-Fi · Check-in 15:00" },
    clinic: { kicker: "Prenoti una visita", business: "Clínica Sorriso Atlântico", done: "Visita prenotata.", when: "Martedì · 09:30", reminder: "Promemoria via email il giorno prima", chipNote: "Promemoria il giorno prima" },
  },
};

export type GoalId = "found" | "full" | "sell" | "return" | "custom";

/** A product in a goal: its card shows `benefit` (what it does for that goal); `label` replaces its name. */
export interface GoalProduct {
  id: ProductId;
  label?: string;
  benefit: string;
}

export interface Goal {
  id: GoalId;
  title: string;
  lead: string;
  products: GoalProduct[];
}

type GoalText = { title: string; lead: string; products: Partial<Record<ProductId, { benefit: string; label?: string }>> };

/** The goals' products are the same in every language; only the words change. */
const goal = (id: GoalId, products: ProductId[], text: Localized<GoalText>) =>
  Object.fromEntries(
    locales.map((locale) => {
      const { title, lead, products: words } = localize(text, locale);
      return [locale, { id, title, lead, products: products.map((product) => ({ id: product, ...words[product]! })) }];
    }),
  ) as Localized<Goal>;

const goalList = [
  goal("found", ["website", "landing-page", "google-review-plates"], {
    pt: {
      title: "Ser encontrado",
      lead: "Quem procura no Google ou no Instagram chega até si, e gosta do que vê.",
      products: {
        website: { benefit: "Um site rápido que aparece no Google e convence quem chega." },
        "landing-page": { benefit: "Uma página com um só objetivo: que liguem, reservem ou encomendem." },
        "google-review-plates": { benefit: "Mais avaliações no Google, no Tripadvisor ou na Booking, para subir quando o procuram." },
      },
    },
    en: {
      title: "Get found",
      lead: "People searching on Google or Instagram find you, and like what they see.",
      products: {
        website: { benefit: "A fast site that shows up on Google and wins visitors over." },
        "landing-page": { benefit: "One page, one goal: getting people to call, book or order." },
        "google-review-plates": { benefit: "More reviews on Google, Tripadvisor or Booking, so you rank higher when people search." },
      },
    },
    es: {
      title: "Que le encuentren",
      lead: "Quien busca en Google o en Instagram llega hasta usted, y le gusta lo que ve.",
      products: {
        website: { benefit: "Una web rápida que aparece en Google y convence a quien llega." },
        "landing-page": { benefit: "Una página con un solo objetivo: que llamen, reserven o pidan." },
        "google-review-plates": { benefit: "Más reseñas en Google, Tripadvisor o Booking, para subir cuando le buscan." },
      },
    },
    fr: {
      title: "Être trouvé",
      lead: "Ceux qui cherchent sur Google ou Instagram arrivent jusqu'à vous, et aiment ce qu'ils voient.",
      products: {
        website: { benefit: "Un site rapide, visible sur Google, qui convainc les visiteurs." },
        "landing-page": { benefit: "Une page, un seul objectif : qu'on vous appelle, réserve ou commande." },
        "google-review-plates": { benefit: "Plus d'avis sur Google, Tripadvisor ou Booking, pour remonter quand on vous cherche." },
      },
    },
    de: {
      title: "Gefunden werden",
      lead: "Wer bei Google oder Instagram sucht, findet zu Ihnen und mag, was er sieht.",
      products: {
        website: { benefit: "Eine schnelle Website, die bei Google auftaucht und Besucher überzeugt." },
        "landing-page": { benefit: "Eine Seite mit einem Ziel: dass man anruft, reserviert oder bestellt." },
        "google-review-plates": { benefit: "Mehr Bewertungen auf Google, Tripadvisor oder Booking, damit Sie in der Suche weiter oben stehen." },
      },
    },
    it: {
      title: "Farsi trovare",
      lead: "Chi cerca su Google o su Instagram arriva da Lei, e gli piace quello che vede.",
      products: {
        website: { benefit: "Un sito veloce che compare su Google e convince chi arriva." },
        "landing-page": { benefit: "Una pagina con un solo obiettivo: che La chiamino, prenotino o ordinino." },
        "google-review-plates": { benefit: "Più recensioni su Google, Tripadvisor o Booking, per salire quando La cercano." },
      },
    },
  }),
  goal("full", ["bookings", "waitlist", "ai-chatbot", "ai-voice"], {
    pt: {
      title: "Encher a casa",
      lead: "Reservas a qualquer hora, uma fila sem confusão à porta e o telefone sempre atendido.",
      products: {
        bookings: { benefit: "Reservas a qualquer hora, com lembrete para não faltarem." },
        waitlist: { benefit: "Uma fila sem confusão: o cliente é avisado no telemóvel." },
        "ai-chatbot": { benefit: "Responde no site e no WhatsApp, mesmo com a casa cheia." },
        "ai-voice": { benefit: "O telefone sempre atendido, e as reservas feitas na chamada." },
      },
    },
    en: {
      title: "Fill the place",
      lead: "Bookings at any hour, a calm queue at the door and the phone always answered.",
      products: {
        bookings: { benefit: "Bookings at any hour, with reminders so people turn up." },
        waitlist: { benefit: "A calm queue: customers get a phone alert when it's their turn." },
        "ai-chatbot": { benefit: "Answers on your website and WhatsApp, even when you're packed." },
        "ai-voice": { benefit: "The phone always answered, and bookings taken on the call." },
      },
    },
    es: {
      title: "Llenar el local",
      lead: "Reservas a cualquier hora, una cola sin líos en la puerta y el teléfono siempre atendido.",
      products: {
        bookings: { benefit: "Reservas a cualquier hora, con recordatorio para que no fallen." },
        waitlist: { benefit: "Una cola sin líos: el cliente recibe un aviso en el móvil." },
        "ai-chatbot": { benefit: "Responde en la web y en WhatsApp, incluso con el local lleno." },
        "ai-voice": { benefit: "El teléfono siempre atendido, y las reservas hechas en la llamada." },
      },
    },
    fr: {
      title: "Faire salle comble",
      lead: "Des réservations à toute heure, une file d'attente sereine à l'entrée et le téléphone toujours décroché.",
      products: {
        bookings: { benefit: "Des réservations à toute heure, avec un rappel pour qu'on ne vous oublie pas." },
        waitlist: { benefit: "Une file sereine : le client est prévenu sur son téléphone." },
        "ai-chatbot": { benefit: "Répond sur votre site et sur WhatsApp, même quand c'est complet." },
        "ai-voice": { benefit: "Le téléphone toujours décroché, et les réservations prises pendant l'appel." },
      },
    },
    de: {
      title: "Das Haus füllen",
      lead: "Reservierungen rund um die Uhr, eine geordnete Warteschlange an der Tür und ein Telefon, das immer beantwortet wird.",
      products: {
        bookings: { benefit: "Reservierungen rund um die Uhr, mit Erinnerung gegen No-Shows." },
        waitlist: { benefit: "Eine geordnete Warteschlange: Gäste werden aufs Handy benachrichtigt." },
        "ai-chatbot": { benefit: "Antwortet auf der Website und in WhatsApp, auch wenn das Haus voll ist." },
        "ai-voice": { benefit: "Das Telefon immer besetzt, Reservierungen direkt im Gespräch." },
      },
    },
    it: {
      title: "Riempire il locale",
      lead: "Prenotazioni a qualsiasi ora, una coda ordinata alla porta e nessuna chiamata persa.",
      products: {
        bookings: { benefit: "Prenotazioni a qualsiasi ora, con promemoria perché nessuno manchi." },
        waitlist: { benefit: "Una coda ordinata: il cliente riceve un avviso sul telefono." },
        "ai-chatbot": { benefit: "Risponde sul sito e su WhatsApp, anche con il locale pieno." },
        "ai-voice": { benefit: "Il telefono sempre risposto, e le prenotazioni prese durante la chiamata." },
      },
    },
  }),
  goal("sell", ["digital-menu", "guest-guide", "online-shop", "business-card"], {
    pt: {
      title: "Vender mais",
      lead: "Mostre bem o que vende: os pratos em vídeo à mesa, a loja aberta online e o seu contacto à mão.",
      products: {
        "digital-menu": { label: "Menu digital em vídeo + Pedidos à mesa", benefit: "Cada prato no seu vídeo, com preço, e pedidos feitos à mesa." },
        "guest-guide": { benefit: "Recomende os seus favoritos aos hóspedes, em quatro línguas." },
        "online-shop": { benefit: "A loja aberta a toda a hora, com pagamento por MB WAY, Multibanco e cartão." },
        "business-card": { benefit: "O seu contacto guardado no telemóvel do cliente, com um toque no cartão." },
      },
    },
    en: {
      title: "Sell more",
      lead: "Show what you sell at its best: dishes on video at the table, a shop open online and your contact close at hand.",
      products: {
        "digital-menu": { label: "Video digital menu + table ordering", benefit: "Every dish in its own video, with its price, and orders from the table." },
        "guest-guide": { benefit: "Recommend your favourite places to guests, in four languages." },
        "online-shop": { benefit: "Your shop open around the clock, with MB WAY, Multibanco and card payments." },
        "business-card": { benefit: "Your contact saved on the customer's phone, with one tap on the card." },
      },
    },
    es: {
      title: "Vender más",
      lead: "Muestre bien lo que vende: los platos en vídeo en la mesa, la tienda abierta online y su contacto a mano.",
      products: {
        "digital-menu": { label: "Menú digital en vídeo + pedidos en la mesa", benefit: "Cada plato en su vídeo, con precio, y pedidos desde la mesa." },
        "guest-guide": { benefit: "Recomiende sus sitios favoritos a los huéspedes, en cuatro idiomas." },
        "online-shop": { benefit: "La tienda abierta a todas horas, con pago por MB WAY, Multibanco y tarjeta." },
        "business-card": { benefit: "Su contacto guardado en el móvil del cliente, con un toque en la tarjeta." },
      },
    },
    fr: {
      title: "Vendre plus",
      lead: "Montrez au mieux ce que vous vendez : les plats en vidéo à table, la boutique ouverte en ligne et vos coordonnées à portée de main.",
      products: {
        "digital-menu": { label: "Menu digital en vidéo + commande à table", benefit: "Chaque plat en vidéo, avec son prix, et la commande depuis la table." },
        "guest-guide": { benefit: "Recommandez vos bonnes adresses aux voyageurs, en quatre langues." },
        "online-shop": { benefit: "Votre boutique ouverte à toute heure, avec paiement par MB WAY, Multibanco et carte." },
        "business-card": { benefit: "Vos coordonnées enregistrées dans le téléphone du client, d'un simple toucher sur la carte." },
      },
    },
    de: {
      title: "Mehr verkaufen",
      lead: "Zeigen Sie, was Sie verkaufen: Gerichte als Video am Tisch, einen Shop, der online immer geöffnet ist, und Ihre Kontaktdaten griffbereit.",
      products: {
        "digital-menu": { label: "Digitale Speisekarte mit Videos + Bestellung am Tisch", benefit: "Jedes Gericht im eigenen Video, mit Preis, und Bestellung vom Tisch." },
        "guest-guide": { benefit: "Empfehlen Sie Ihren Gästen Ihre Lieblingsorte, in vier Sprachen." },
        "online-shop": { benefit: "Ihr Shop rund um die Uhr geöffnet, mit Zahlung per MB WAY, Multibanco und Karte." },
        "business-card": { benefit: "Ihre Kontaktdaten im Handy des Kunden gespeichert, mit einmal Antippen der Karte." },
      },
    },
    it: {
      title: "Vendere di più",
      lead: "Mostri al meglio ciò che vende: i piatti in video al tavolo, il negozio aperto online e il Suo contatto a portata di mano.",
      products: {
        "digital-menu": { label: "Menù digitale in video + ordini al tavolo", benefit: "Ogni piatto nel suo video, con il prezzo, e ordini dal tavolo." },
        "guest-guide": { benefit: "Consigli i Suoi posti preferiti agli ospiti, in quattro lingue." },
        "online-shop": { benefit: "Il negozio aperto a ogni ora, con pagamento tramite MB WAY, Multibanco e carta." },
        "business-card": { benefit: "Il Suo contatto salvato sul telefono del cliente, con un tocco sul biglietto." },
      },
    },
  }),
  goal("return", ["loyalty", "social-plates", "keychain"], {
    pt: {
      title: "Fazer voltar",
      lead: "Um cartão de carimbos que não fica em casa e um toque para o seguirem nas redes.",
      products: {
        loyalty: { benefit: "Carimbos no telemóvel, e a recompensa chega sozinha." },
        "social-plates": { benefit: "Um toque e passam a segui-lo nas redes sociais." },
        keychain: { benefit: "O seu WhatsApp ou Instagram nas chaves do cliente, a um toque." },
      },
    },
    en: {
      title: "Bring them back",
      lead: "A stamp card that never gets left at home, and one tap to follow you on social media.",
      products: {
        loyalty: { benefit: "Stamps on the phone, and the reward arrives on its own." },
        "social-plates": { benefit: "One tap and they follow you on social media." },
        keychain: { benefit: "Your WhatsApp or Instagram on the customer's keys, one tap away." },
      },
    },
    es: {
      title: "Que vuelvan",
      lead: "Una tarjeta de sellos que nunca se queda en casa y un toque para seguirle en redes.",
      products: {
        loyalty: { benefit: "Sellos en el móvil, y la recompensa llega sola." },
        "social-plates": { benefit: "Un toque y empiezan a seguirle en redes sociales." },
        keychain: { benefit: "Su WhatsApp o Instagram en el llavero del cliente, a un toque." },
      },
    },
    fr: {
      title: "Faire revenir",
      lead: "Une carte à tampons qu'on n'oublie jamais à la maison, et un toucher pour vous suivre sur les réseaux.",
      products: {
        loyalty: { benefit: "Des tampons sur le téléphone, et la récompense arrive toute seule." },
        "social-plates": { benefit: "Un toucher, et ils vous suivent sur les réseaux sociaux." },
        keychain: { benefit: "Votre WhatsApp ou Instagram sur le trousseau du client, à portée d'un toucher." },
      },
    },
    de: {
      title: "Wiederkommen lassen",
      lead: "Eine Stempelkarte, die nie zu Hause liegen bleibt, und ein Antippen, um Ihnen in den sozialen Netzwerken zu folgen.",
      products: {
        loyalty: { benefit: "Stempel auf dem Handy, und die Prämie kommt von selbst." },
        "social-plates": { benefit: "Einmal antippen, und man folgt Ihnen in den sozialen Netzwerken." },
        keychain: { benefit: "Ihr WhatsApp oder Instagram am Schlüsselbund des Kunden, einmal antippen genügt." },
      },
    },
    it: {
      title: "Farli tornare",
      lead: "Una carta timbri che non resta mai a casa e un tocco per seguirLa sui social.",
      products: {
        loyalty: { benefit: "Timbri sul telefono, e il premio arriva da solo." },
        "social-plates": { benefit: "Un tocco e iniziano a seguirLa sui social." },
        keychain: { benefit: "Il Suo WhatsApp o Instagram sulle chiavi del cliente, a portata di tocco." },
      },
    },
  }),
  goal("custom", ["automation"], {
    pt: {
      title: "À medida",
      lead: "Tarefas repetidas que lhe roubam tempo? Automatizamos o processo, com preço fechado.",
      products: { automation: { benefit: "Faturas, lembretes e seguimento de contactos, automatizados com preço fechado." } },
    },
    en: {
      title: "Made to measure",
      lead: "Repetitive tasks eating into your time? We automate the process, at a fixed price.",
      products: { automation: { benefit: "Invoices, reminders and follow-ups, automated at a fixed price." } },
    },
    es: {
      title: "A medida",
      lead: "¿Tareas repetitivas que le roban tiempo? Automatizamos el proceso, con precio cerrado.",
      products: { automation: { benefit: "Facturas, recordatorios y seguimiento de contactos, automatizados a precio cerrado." } },
    },
    fr: {
      title: "Sur mesure",
      lead: "Des tâches répétitives qui vous prennent du temps ? Nous automatisons le processus, à prix fixe.",
      products: { automation: { benefit: "Factures, rappels et suivi des contacts, automatisés à prix fixe." } },
    },
    de: {
      title: "Nach Maß",
      lead: "Wiederkehrende Aufgaben, die Ihnen Zeit rauben? Wir automatisieren den Ablauf, zum Festpreis.",
      products: { automation: { benefit: "Rechnungen, Erinnerungen und Nachverfolgung, automatisiert zum Festpreis." } },
    },
    it: {
      title: "Su misura",
      lead: "Attività ripetitive che Le rubano tempo? Automatizziamo il processo, a prezzo fisso.",
      products: { automation: { benefit: "Fatture, promemoria e follow-up, automatizzati a prezzo fisso." } },
    },
  }),
];

export const goals: Localized<Goal[]> = Object.fromEntries(
  locales.map((locale) => [locale, goalList.map((entry) => localize(entry, locale))]),
) as Localized<Goal[]>;

/** «Conhecer <produto>» on each goal card (owner, 2026-10-20: product calls go to the product page). */
export const goalCtas: Record<ProductId, Localized<string>> = {
  website: { pt: "Conhecer o website", en: "Discover the website", es: "Conocer la web", fr: "Découvrir le site web", de: "Die Website entdecken", it: "Scopra il sito web" },
  "landing-page": { pt: "Conhecer a landing page", en: "Discover the landing page", es: "Conocer la landing page", fr: "Découvrir la landing page", de: "Die Landingpage entdecken", it: "Scopra la landing page" },
  "online-shop": { pt: "Conhecer a loja online", en: "Discover the online shop", es: "Conocer la tienda online", fr: "Découvrir la boutique en ligne", de: "Den Onlineshop entdecken", it: "Scopra il negozio online" },
  "google-review-plates": { pt: "Conhecer as placas", en: "Discover the plates", es: "Conocer las placas", fr: "Découvrir les plaques", de: "Die Schilder entdecken", it: "Scopra le targhe" },
  "ai-reviews": { pt: "Conhecer a gestão de reviews", en: "Discover review management", es: "Conocer la gestión de reseñas", fr: "Découvrir la gestion des avis", de: "Das Bewertungsmanagement entdecken", it: "Scopra la gestione delle recensioni" },
  bookings: { pt: "Conhecer as reservas", en: "Discover online bookings", es: "Conocer las reservas", fr: "Découvrir les réservations", de: "Die Online-Reservierung entdecken", it: "Scopra le prenotazioni" },
  waitlist: { pt: "Conhecer a lista de espera", en: "Discover the waitlist", es: "Conocer la lista de espera", fr: "Découvrir la liste d'attente", de: "Die Warteliste entdecken", it: "Scopra la lista d'attesa" },
  "ai-chatbot": { pt: "Conhecer o chatbot", en: "Discover the chatbot", es: "Conocer el chatbot", fr: "Découvrir le chatbot", de: "Den Chatbot entdecken", it: "Scopra il chatbot" },
  "ai-voice": { pt: "Conhecer a receção por voz", en: "Discover the voice receptionist", es: "Conocer la recepcionista de voz", fr: "Découvrir la réceptionniste vocale", de: "Die Telefonrezeption entdecken", it: "Scopra la receptionist vocale" },
  "digital-menu": { pt: "Conhecer o Menu digital", en: "Discover the digital menu", es: "Conocer el Menú digital", fr: "Découvrir le Menu digital", de: "Die digitale Speisekarte entdecken", it: "Scopra il Menù digitale" },
  "guest-guide": { pt: "Conhecer o guia digital", en: "Discover the guest guide", es: "Conocer la guía digital", fr: "Découvrir le livret d'accueil", de: "Die Gästemappe entdecken", it: "Scopra la guida digitale" },
  loyalty: { pt: "Conhecer o cartão", en: "Discover the loyalty card", es: "Conocer la tarjeta", fr: "Découvrir la carte de fidélité", de: "Die Kundenkarte entdecken", it: "Scopra la carta fedeltà" },
  "social-plates": { pt: "Conhecer as placas para redes", en: "Discover the social media plates", es: "Conocer las placas para redes", fr: "Découvrir les plaques réseaux sociaux", de: "Die Social-Media-Schilder entdecken", it: "Scopra le targhe social" },
  "business-card": { pt: "Conhecer o cartão de visita", en: "Discover the business card", es: "Conocer la tarjeta de visita", fr: "Découvrir la carte de visite", de: "Die Visitenkarte entdecken", it: "Scopra il biglietto da visita" },
  keychain: { pt: "Conhecer o porta-chaves", en: "Discover the keychain", es: "Conocer el llavero", fr: "Découvrir le porte-clés", de: "Den Schlüsselanhänger entdecken", it: "Scopra il portachiavi" },
  automation: { pt: "Conhecer a automação", en: "Discover automation", es: "Conocer la automatización", fr: "Découvrir l'automatisation", de: "Die Automatisierung entdecken", it: "Scopra l'automazione" },
};

// The «Confiam em nós» strip shows the client logos in src/content/client-logos.ts.

/* ---------- Como trabalhamos ---------- */

export const howCopy: Localized<{ title: string; steps: { title: string; body: string }[] }> = {
  pt: {
    title: "Como trabalhamos",
    // Owner, 2026-10-20: steps 1 to 3 are his words; step 4 is our proposal (one line to change).
    steps: [
      { title: "Queixe-se", body: "Conte-nos o que o incomoda no seu negócio: mesas vazias, poucas reviews, clientes que não voltam." },
      { title: "Oiça soluções", body: "Mostramos-lhe o que faz sentido, já a funcionar, com os preços à vista." },
      { title: "Escolha a sua", body: "Só o que precisa. Sem pacotes forçados." },
      { title: "Nós tratamos do resto", body: "Montamos, configuramos e ensinamos. E continuamos por perto." },
    ],
  },
  en: {
    title: "How we work",
    steps: [
      { title: "Tell us what's wrong", body: "Tell us what bothers you about your business: empty tables, few reviews, customers who don't come back." },
      { title: "Hear the solutions", body: "We show you what makes sense, already working, with the prices in plain sight." },
      { title: "Pick yours", body: "Only what you need. No forced bundles." },
      { title: "We handle the rest", body: "We set it up, configure it and show you how. And we stay close by." },
    ],
  },
  es: {
    title: "Cómo trabajamos",
    steps: [
      { title: "Cuéntenos qué falla", body: "Cuéntenos qué le preocupa de su negocio: mesas vacías, pocas reseñas, clientes que no vuelven." },
      { title: "Escuche soluciones", body: "Le enseñamos lo que tiene sentido, ya funcionando, con los precios a la vista." },
      { title: "Elija la suya", body: "Solo lo que necesita. Sin paquetes forzados." },
      { title: "Nosotros nos ocupamos del resto", body: "Lo montamos, lo configuramos y le enseñamos a usarlo. Y seguimos a su lado." },
    ],
  },
  fr: {
    title: "Comment nous travaillons",
    steps: [
      { title: "Dites-nous ce qui coince", body: "Racontez-nous ce qui vous gêne dans votre activité : tables vides, peu d'avis, clients qui ne reviennent pas." },
      { title: "Découvrez les solutions", body: "Nous vous montrons ce qui a du sens, déjà en fonctionnement, avec les prix bien visibles." },
      { title: "Choisissez la vôtre", body: "Seulement ce dont vous avez besoin. Pas de formules imposées." },
      { title: "Nous nous occupons du reste", body: "Nous installons, configurons et vous montrons comment faire. Et nous restons à vos côtés." },
    ],
  },
  de: {
    title: "So arbeiten wir",
    steps: [
      { title: "Erzählen Sie, was hakt", body: "Sagen Sie uns, was Sie an Ihrem Betrieb stört: leere Tische, wenige Bewertungen, Kunden, die nicht wiederkommen." },
      { title: "Lösungen kennenlernen", body: "Wir zeigen Ihnen, was sinnvoll ist, bereits im Einsatz, mit offenen Preisen." },
      { title: "Ihre Wahl treffen", body: "Nur, was Sie brauchen. Keine aufgezwungenen Pakete." },
      { title: "Den Rest erledigen wir", body: "Wir richten alles ein, konfigurieren es und zeigen Ihnen, wie es geht. Und wir bleiben an Ihrer Seite." },
    ],
  },
  it: {
    title: "Come lavoriamo",
    steps: [
      { title: "Ci dica cosa non va", body: "Ci racconti cosa La preoccupa nella Sua attività: tavoli vuoti, poche recensioni, clienti che non tornano." },
      { title: "Ascolti le soluzioni", body: "Le mostriamo quello che ha senso, già in funzione, con i prezzi in chiaro." },
      { title: "Scelga la Sua", body: "Solo quello che Le serve. Nessun pacchetto imposto." },
      { title: "Al resto pensiamo noi", body: "Installiamo, configuriamo e Le insegniamo a usarlo. E restiamo al Suo fianco." },
    ],
  },
};

/* ---------- Cartão de cliente digital (banner) ---------- */

/**
 * The loyalty card band, beside its ad video (content/product-ads.ts). Facts from
 * content/product-copy/loyalty.ts; the price is read from products.ts and shown «/mês + IVA».
 */
const loyaltyPt = {
  eyebrow: "Cartão de cliente digital",
  titleStart: "Clientes que voltam,",
  titleAccent: "carimbo a carimbo.",
  body: "O cartão de carimbos passa a viver no telemóvel do cliente: adere com um toque na placa ou pelo QR, sem app. A equipa carimba em segundos e, por exemplo, ao fim de 9 cafés o 10.º é oferecido, sozinho.",
  points: ["Sem app e sem cartões de papel para perder", "Carimbo dado pela equipa, lendo o QR do cartão", "Recompensa automática quando o cartão fica completo"],
  from: "desde",
  vat: "+ IVA",
  cta: "Conhecer o cartão",
};

export const loyaltyCopy: Localized<typeof loyaltyPt> = {
  pt: loyaltyPt,
  en: {
    eyebrow: "Digital loyalty card",
    titleStart: "Customers who come back,",
    titleAccent: "stamp by stamp.",
    body: "The stamp card now lives on your customer's phone: they join with one tap on the plate or by scanning the QR, no app needed. Your team stamps it in seconds and, say, after 9 coffees the 10th is on the house, all by itself.",
    points: ["No app and no paper cards to lose", "Stamped by your team, by scanning the card's QR", "An automatic reward when the card is full"],
    from: "from",
    vat: "+ VAT",
    cta: "Discover the loyalty card",
  },
  es: {
    eyebrow: "Tarjeta de cliente digital",
    titleStart: "Clientes que vuelven,",
    titleAccent: "sello a sello.",
    body: "La tarjeta de sellos pasa a vivir en el móvil del cliente: se apunta con un toque en la placa o con el QR, sin app. Su equipo sella en segundos y, por ejemplo, tras 9 cafés el 10.º sale gratis, automáticamente.",
    points: ["Sin app y sin tarjetas de papel que perder", "Sello dado por su equipo, leyendo el QR de la tarjeta", "Recompensa automática cuando la tarjeta se completa"],
    from: "desde",
    vat: "+ IVA",
    cta: "Conocer la tarjeta",
  },
  fr: {
    eyebrow: "Carte de fidélité digitale",
    titleStart: "Des clients qui reviennent,",
    titleAccent: "tampon après tampon.",
    body: "La carte à tampons vit désormais sur le téléphone du client : il la rejoint d'un toucher sur la plaque ou par QR code, sans application. Votre équipe tamponne en quelques secondes et, par exemple, après 9 cafés le 10e est offert, automatiquement.",
    points: ["Sans application et sans cartes en papier à perdre", "Tamponnée par votre équipe, en scannant le QR de la carte", "Une récompense automatique quand la carte est complète"],
    from: "à partir de",
    vat: "+ TVA",
    cta: "Découvrir la carte",
  },
  de: {
    eyebrow: "Digitale Kundenkarte",
    titleStart: "Kunden, die wiederkommen,",
    titleAccent: "Stempel für Stempel.",
    body: "Die Stempelkarte lebt jetzt auf dem Handy Ihrer Kunden: Sie melden sich mit einem Antippen am Schild oder per QR-Code an, ganz ohne App. Ihr Team stempelt in Sekunden, und nach zum Beispiel 9 Kaffees gibt es den 10. gratis, ganz automatisch.",
    points: ["Keine App und keine Papierkarten, die verloren gehen", "Gestempelt von Ihrem Team, per Scan des QR-Codes der Karte", "Automatische Prämie, sobald die Karte voll ist"],
    from: "ab",
    vat: "zzgl. MwSt.",
    cta: "Die Kundenkarte entdecken",
  },
  it: {
    eyebrow: "Carta fedeltà digitale",
    titleStart: "Clienti che tornano,",
    titleAccent: "timbro dopo timbro.",
    body: "La carta timbri ora vive sullo smartphone del cliente: si iscrive con un tocco sulla targa o con il QR, senza app. Il Suo staff timbra in pochi secondi e, per esempio, dopo 9 caffè il 10° è offerto, in automatico.",
    points: ["Niente app e niente carte di carta da perdere", "Timbro dato dal Suo staff, leggendo il QR della carta", "Premio automatico quando la carta è completa"],
    from: "da",
    vat: "+ IVA",
    cta: "Scopra la carta fedeltà",
  },
};

/* ---------- Bandas com os anúncios dos produtos (guia, cartão de visita, porta-chaves, lista de espera, reservas, …) ---------- */

/**
 * The bands with the product ads (content/product-ads.ts), right above the goals (homeAdBands below). Facts from
 * content/product-copy/<product>.ts. No prices here: they are read
 * from products.ts and shown without VAT, with «+ IVA». {price}, {quantity} and {quantities} are filled in
 * by components/novo/AdBand.
 */
export interface AdBandCopy {
  eyebrow: string;
  titleStart: string;
  titleAccent: string;
  body: string;
  points: string[];
  /** «desde» before the price, or "" when the price is a flat one. */
  from: string;
  /** «por placa», «por cartão», … */
  per: string;
  note: string;
  vat: string;
  cta: string;
}

export const guideBandCopy: Localized<AdBandCopy> = {
  pt: {
    eyebrow: "Guia digital do alojamento",
    titleStart: "Menos perguntas,",
    titleAccent: "hóspedes mais felizes.",
    body: "O hóspede toca na placa e encontra o WiFi, o check-in, as regras da casa e as suas recomendações, na língua dele. Menos mensagens para si.",
    points: ["WiFi com botão para copiar a password", "Português, inglês e mais duas línguas", "Atualizado por nós, sem trocar a placa"],
    from: "desde",
    per: "por placa",
    note: "Uma placa por alojamento e uma só mensalidade por conta. {price} por placa a partir de {quantity} alojamentos. A 1.ª placa é oferecida na adesão.",
    vat: "+ IVA",
    cta: "Conhecer o guia",
  },
  en: {
    eyebrow: "Digital guest guide",
    titleStart: "Fewer questions,",
    titleAccent: "happier guests.",
    body: "Guests tap the plate and find the WiFi, check-in, house rules and your recommendations, in their own language. Fewer messages for you.",
    points: ["WiFi with a button to copy the password", "Portuguese, English and two more languages", "Kept up to date by us, no new plate needed"],
    from: "from",
    per: "per plate",
    note: "One plate per property and a single monthly fee per account. {price} per plate for {quantity} properties or more. The 1st plate is free when you sign up.",
    vat: "+ VAT",
    cta: "Discover the guest guide",
  },
  es: {
    eyebrow: "Guía digital del alojamiento",
    titleStart: "Menos preguntas,",
    titleAccent: "huéspedes más contentos.",
    body: "El huésped toca la placa y encuentra el wifi, el check-in, las normas de la casa y sus recomendaciones, en su idioma. Menos mensajes para usted.",
    points: ["Wifi con botón para copiar la contraseña", "Portugués, inglés y dos idiomas más", "Actualizada por nosotros, sin cambiar la placa"],
    from: "desde",
    per: "por placa",
    note: "Una placa por alojamiento y una sola cuota mensual por cuenta. {price} por placa a partir de {quantity} alojamientos. La 1.ª placa es de regalo al darse de alta.",
    vat: "+ IVA",
    cta: "Conocer la guía",
  },
  fr: {
    eyebrow: "Livret d'accueil digital",
    titleStart: "Moins de questions,",
    titleAccent: "des voyageurs plus heureux.",
    body: "Le voyageur touche la plaque et trouve le wifi, l'arrivée, le règlement intérieur et vos recommandations, dans sa langue. Moins de messages pour vous.",
    points: ["Wifi avec un bouton pour copier le mot de passe", "Portugais, anglais et deux autres langues", "Mis à jour par nous, sans changer la plaque"],
    from: "à partir de",
    per: "la plaque",
    note: "Une plaque par logement et un seul abonnement mensuel par compte. {price} la plaque à partir de {quantity} logements. La 1re plaque est offerte à l'inscription.",
    vat: "+ TVA",
    cta: "Découvrir le livret d'accueil",
  },
  de: {
    eyebrow: "Digitale Gästemappe",
    titleStart: "Weniger Fragen,",
    titleAccent: "zufriedenere Gäste.",
    body: "Ihre Gäste tippen auf das Schild und finden WLAN, Check-in, Hausregeln und Ihre Empfehlungen in ihrer eigenen Sprache. Weniger Nachrichten für Sie.",
    points: ["WLAN mit Taste zum Kopieren des Passworts", "Portugiesisch, Englisch und zwei weitere Sprachen", "Von uns aktuell gehalten, ohne neues Schild"],
    from: "ab",
    per: "pro Schild",
    note: "Ein Schild pro Unterkunft und eine einzige Monatsgebühr pro Konto. {price} pro Schild ab {quantity} Unterkünften. Das 1. Schild ist bei Vertragsbeginn kostenlos.",
    vat: "zzgl. MwSt.",
    cta: "Die Gästemappe entdecken",
  },
  it: {
    eyebrow: "Guida digitale dell'alloggio",
    titleStart: "Meno domande,",
    titleAccent: "ospiti più contenti.",
    body: "L'ospite tocca la targa e trova il wifi, il check-in, le regole della casa e i Suoi consigli, nella sua lingua. Meno messaggi per Lei.",
    points: ["Wifi con un pulsante per copiare la password", "Portoghese, inglese e altre due lingue", "Aggiornata da noi, senza cambiare la targa"],
    from: "da",
    per: "a targa",
    note: "Una targa per alloggio e un solo canone mensile per account. {price} a targa da {quantity} alloggi. La 1ª targa è in omaggio all'adesione.",
    vat: "+ IVA",
    cta: "Scopra la guida",
  },
};

export const businessCardBandCopy: Localized<AdBandCopy> = {
  pt: {
    eyebrow: "Cartão de visita digital",
    titleStart: "O seu contacto,",
    titleAccent: "guardado num toque.",
    body: "O cliente aproxima o telemóvel do seu cartão, ou lê o QR, e abre-se a sua página de contacto. Com o botão «Guardar contacto», os seus dados ficam no telemóvel dele, sem erros.",
    points: ["Em iPhone e Android, sem app", "Nome, contactos e logótipo da empresa incluídos", "Mudou de número? Atualizamos sem custo extra"],
    from: "",
    per: "por cartão",
    note: "Packs de {quantities} cartões, desde {price} por cartão.",
    vat: "+ IVA",
    cta: "Conhecer os cartões",
  },
  en: {
    eyebrow: "Digital business card",
    titleStart: "Your contact,",
    titleAccent: "saved with one tap.",
    body: "Your client holds their phone to your card, or scans the QR, and your contact page opens. With the «Save contact» button, your details go straight into their phone, with no typos.",
    points: ["On iPhone and Android, no app", "Name, contact details and company logo included", "New number? We update it at no extra cost"],
    from: "",
    per: "per card",
    note: "Packs of {quantities} cards, from {price} per card.",
    vat: "+ VAT",
    cta: "Discover the business cards",
  },
  es: {
    eyebrow: "Tarjeta de visita digital",
    titleStart: "Su contacto,",
    titleAccent: "guardado con un toque.",
    body: "El cliente acerca el móvil a su tarjeta, o lee el QR, y se abre su página de contacto. Con el botón «Guardar contacto», sus datos quedan en el móvil del cliente, sin errores.",
    points: ["En iPhone y Android, sin app", "Nombre, contactos y logotipo de la empresa incluidos", "¿Ha cambiado de número? Lo actualizamos sin coste extra"],
    from: "",
    per: "por tarjeta",
    note: "Packs de {quantities} tarjetas, desde {price} por tarjeta.",
    vat: "+ IVA",
    cta: "Conocer las tarjetas",
  },
  fr: {
    eyebrow: "Carte de visite digitale",
    titleStart: "Votre contact,",
    titleAccent: "enregistré d'un toucher.",
    body: "Votre client approche son téléphone de votre carte, ou scanne le QR code, et votre page de contact s'ouvre. Avec le bouton «Enregistrer le contact», vos coordonnées arrivent dans son téléphone, sans erreur.",
    points: ["Sur iPhone et Android, sans application", "Nom, coordonnées et logo de l'entreprise inclus", "Nouveau numéro ? Nous le mettons à jour sans frais"],
    from: "",
    per: "la carte",
    note: "Packs de {quantities} cartes, à partir de {price} la carte.",
    vat: "+ TVA",
    cta: "Découvrir les cartes de visite",
  },
  de: {
    eyebrow: "Digitale Visitenkarte",
    titleStart: "Ihr Kontakt,",
    titleAccent: "mit einem Antippen gespeichert.",
    body: "Ihr Kunde hält das Handy an Ihre Karte oder scannt den QR-Code, und Ihre Kontaktseite öffnet sich. Mit der Taste „Kontakt speichern“ landen Ihre Daten fehlerfrei in seinem Handy.",
    points: ["Auf iPhone und Android, ohne App", "Name, Kontaktdaten und Firmenlogo inklusive", "Neue Nummer? Wir aktualisieren ohne Aufpreis"],
    from: "",
    per: "pro Karte",
    note: "Pakete mit {quantities} Karten, ab {price} pro Karte.",
    vat: "zzgl. MwSt.",
    cta: "Die Visitenkarten entdecken",
  },
  it: {
    eyebrow: "Biglietto da visita digitale",
    titleStart: "Il Suo contatto,",
    titleAccent: "salvato con un tocco.",
    body: "Il cliente avvicina il telefono al Suo biglietto, o inquadra il QR, e si apre la Sua pagina di contatto. Con il pulsante «Salvi il contatto», i Suoi dati finiscono nel suo telefono, senza errori.",
    points: ["Su iPhone e Android, senza app", "Nome, contatti e logo dell'azienda inclusi", "Nuovo numero? Lo aggiorniamo senza costi extra"],
    from: "",
    per: "a biglietto",
    note: "Pacchetti da {quantities} biglietti, da {price} a biglietto.",
    vat: "+ IVA",
    cta: "Scopra i biglietti da visita",
  },
};

export const keychainBandCopy: Localized<AdBandCopy> = {
  pt: {
    eyebrow: "Porta-chaves digital",
    titleStart: "O seu negócio",
    titleAccent: "nas chaves dos clientes.",
    body: "Em vez de ditar o número ou escrevê-lo num papel, o cliente aproxima o telemóvel do porta-chaves e abre-se logo a conversa no WhatsApp, o seu Instagram ou o seu site.",
    points: ["Em iPhone e Android, sem app", "Com argola, ou em tag para colar ou pendurar", "Mudamos o destino mais tarde, sem custo"],
    from: "",
    per: "cada",
    note: "Em packs de {quantities}, desde {price} cada.",
    vat: "+ IVA",
    cta: "Conhecer o porta-chaves",
  },
  en: {
    eyebrow: "Digital keychain",
    titleStart: "Your business",
    titleAccent: "on your customers' keys.",
    body: "Instead of reading out a number or writing it on paper, your customer holds their phone to the keychain and the WhatsApp chat, your Instagram or your website opens straight away.",
    points: ["On iPhone and Android, no app", "With a key ring, or as a tag to stick or hang", "We change the destination later at no cost"],
    from: "",
    per: "each",
    note: "In packs of {quantities}, from {price} each.",
    vat: "+ VAT",
    cta: "Discover the keychain",
  },
  es: {
    eyebrow: "Llavero digital",
    titleStart: "Su negocio",
    titleAccent: "en las llaves de sus clientes.",
    body: "En vez de dictar el número o escribirlo en un papel, el cliente acerca el móvil al llavero y se abre al momento la conversación de WhatsApp, su Instagram o su web.",
    points: ["En iPhone y Android, sin app", "Con anilla, o en etiqueta para pegar o colgar", "Cambiamos el destino más adelante, sin coste"],
    from: "",
    per: "cada uno",
    note: "En packs de {quantities}, desde {price} cada uno.",
    vat: "+ IVA",
    cta: "Conocer el llavero",
  },
  fr: {
    eyebrow: "Porte-clés digital",
    titleStart: "Votre entreprise",
    titleAccent: "sur les clés de vos clients.",
    body: "Au lieu de dicter un numéro ou de l'écrire sur un papier, votre client approche son téléphone du porte-clés et la conversation WhatsApp, votre Instagram ou votre site s'ouvre aussitôt.",
    points: ["Sur iPhone et Android, sans application", "Avec anneau, ou en étiquette à coller ou à suspendre", "Nous changeons la destination plus tard, sans frais"],
    from: "",
    per: "pièce",
    note: "En packs de {quantities}, à partir de {price} pièce.",
    vat: "+ TVA",
    cta: "Découvrir le porte-clés",
  },
  de: {
    eyebrow: "Digitaler Schlüsselanhänger",
    titleStart: "Ihr Geschäft",
    titleAccent: "am Schlüsselbund Ihrer Kunden.",
    body: "Statt die Nummer zu diktieren oder auf einen Zettel zu schreiben, hält Ihr Kunde das Handy an den Anhänger, und der WhatsApp-Chat, Ihr Instagram oder Ihre Website öffnet sich sofort.",
    points: ["Auf iPhone und Android, ohne App", "Mit Ring oder als Tag zum Aufkleben oder Aufhängen", "Das Ziel ändern wir später kostenlos"],
    from: "",
    per: "pro Stück",
    note: "In Paketen mit {quantities} Stück, ab {price} pro Stück.",
    vat: "zzgl. MwSt.",
    cta: "Den Schlüsselanhänger entdecken",
  },
  it: {
    eyebrow: "Portachiavi digitale",
    titleStart: "La Sua attività",
    titleAccent: "sulle chiavi dei clienti.",
    body: "Invece di dettare il numero o scriverlo su un foglio, il cliente avvicina il telefono al portachiavi e si apre subito la chat di WhatsApp, il Suo Instagram o il Suo sito.",
    points: ["Su iPhone e Android, senza app", "Con anello, o come tag da attaccare o appendere", "Cambiamo la destinazione in seguito, senza costi"],
    from: "",
    per: "al pezzo",
    note: "In pacchetti da {quantities}, da {price} al pezzo.",
    vat: "+ IVA",
    cta: "Scopra il portachiavi",
  },
};

export const waitlistBandCopy: Localized<AdBandCopy> = {
  pt: {
    eyebrow: "Lista de espera digital",
    titleStart: "Acabe com a fila",
    titleAccent: "à porta.",
    body: "O cliente lê o QR à entrada, vê no telemóvel quanto falta e pode ir dar uma volta. Quando chega a vez, o telemóvel avisa: «É a sua vez».",
    points: ["Entrada por QR, com um toque ou pela equipa", "Tempo de espera estimado para o cliente", "Sem app: funciona no navegador do telemóvel"],
    from: "",
    per: "por mês, por estabelecimento",
    note: "",
    vat: "+ IVA",
    cta: "Conhecer a lista de espera",
  },
  en: {
    eyebrow: "Digital waitlist",
    titleStart: "No more queue",
    titleAccent: "at the door.",
    body: "Customers scan the QR at the entrance, see on their phone how long is left and can step out for a while. When it's their turn, the phone lets them know: «It's your turn».",
    points: ["Join by QR, with a tap or through your team", "Estimated waiting time for the customer", "No app: it works in the phone's browser"],
    from: "",
    per: "per month, per venue",
    note: "",
    vat: "+ VAT",
    cta: "Discover the waitlist",
  },
  es: {
    eyebrow: "Lista de espera digital",
    titleStart: "Se acabó la cola",
    titleAccent: "en la puerta.",
    body: "El cliente lee el QR en la entrada, ve en el móvil cuánto falta y puede ir a dar una vuelta. Cuando llega su turno, el móvil le avisa: «Es su turno».",
    points: ["Entrada por QR, con un toque o a través del equipo", "Tiempo de espera estimado para el cliente", "Sin app: funciona en el navegador del móvil"],
    from: "",
    per: "al mes, por establecimiento",
    note: "",
    vat: "+ IVA",
    cta: "Conocer la lista de espera",
  },
  fr: {
    eyebrow: "Liste d'attente digitale",
    titleStart: "Fini la file",
    titleAccent: "devant la porte.",
    body: "Le client scanne le QR code à l'entrée, voit sur son téléphone combien de temps il reste et peut aller faire un tour. Quand c'est son tour, le téléphone le prévient : «C'est votre tour».",
    points: ["Inscription par QR code, d'un toucher ou par l'équipe", "Temps d'attente estimé pour le client", "Sans application : tout se passe dans le navigateur du téléphone"],
    from: "",
    per: "par mois, par établissement",
    note: "",
    vat: "+ TVA",
    cta: "Découvrir la liste d'attente",
  },
  de: {
    eyebrow: "Digitale Warteliste",
    titleStart: "Schluss mit der Schlange",
    titleAccent: "vor der Tür.",
    body: "Ihre Kunden scannen den QR-Code am Eingang, sehen auf dem Handy, wie lange es noch dauert, und können kurz weggehen. Sind sie dran, meldet sich das Handy: „Sie sind dran“.",
    points: ["Eintragen per QR-Code, mit einem Antippen oder durch Ihr Team", "Geschätzte Wartezeit für den Kunden", "Ohne App: läuft im Browser des Handys"],
    from: "",
    per: "pro Monat, pro Betrieb",
    note: "",
    vat: "zzgl. MwSt.",
    cta: "Die Warteliste entdecken",
  },
  it: {
    eyebrow: "Lista d'attesa digitale",
    titleStart: "Basta con la fila",
    titleAccent: "alla porta.",
    body: "Il cliente inquadra il QR all'ingresso, vede sul telefono quanto manca e può andare a fare un giro. Quando arriva il suo turno, il telefono lo avvisa: «Tocca a Lei».",
    points: ["Iscrizione con il QR, con un tocco o tramite il personale", "Tempo di attesa stimato per il cliente", "Senza app: funziona nel browser del telefono"],
    from: "",
    per: "al mese, per locale",
    note: "",
    vat: "+ IVA",
    cta: "Scopra la lista d'attesa",
  },
};

export const bookingsBandCopy: Localized<AdBandCopy> = {
  pt: {
    eyebrow: "Sistema de reservas online",
    titleStart: "Reservas a qualquer hora,",
    titleAccent: "sem atender o telefone.",
    body: "As mãos ocupadas, a casa cheia e o telefone sempre a tocar. Às 23h, um cliente marca em 30 segundos pelo link no seu Instagram, recebe a confirmação e, antes da visita, um lembrete por email.",
    points: ["Link pronto para o Instagram, o site e o Google", "Confirmação e lembrete automáticos por email", "As reservas no calendário do telemóvel"],
    from: "",
    per: "por mês, por estabelecimento",
    note: "",
    vat: "+ IVA",
    cta: "Conhecer as reservas",
  },
  en: {
    eyebrow: "Online booking system",
    titleStart: "Bookings at any hour,",
    titleAccent: "without answering the phone.",
    body: "Your hands busy, a full house and the phone ringing non-stop. At 11 pm, a customer books in 30 seconds from the link on your Instagram, gets the confirmation and, before the visit, a reminder by email.",
    points: ["Booking link ready for Instagram, your website and Google", "Automatic confirmation and reminder by email", "Bookings in the phone's calendar"],
    from: "",
    per: "per month, per venue",
    note: "",
    vat: "+ VAT",
    cta: "Discover online bookings",
  },
  es: {
    eyebrow: "Sistema de reservas online",
    titleStart: "Reservas a cualquier hora,",
    titleAccent: "sin coger el teléfono.",
    body: "Las manos ocupadas, el local lleno y el teléfono sin parar de sonar. A las 23 h, un cliente reserva en 30 segundos desde el enlace de su Instagram, recibe la confirmación y, antes de la visita, un recordatorio por email.",
    points: ["Enlace listo para Instagram, la web y Google", "Confirmación y recordatorio automáticos por email", "Las reservas en el calendario del móvil"],
    from: "",
    per: "al mes, por establecimiento",
    note: "",
    vat: "+ IVA",
    cta: "Conocer las reservas",
  },
  fr: {
    eyebrow: "Système de réservation en ligne",
    titleStart: "Des réservations à toute heure,",
    titleAccent: "sans décrocher le téléphone.",
    body: "Les mains occupées, du monde partout et le téléphone qui sonne sans arrêt. À 23 h, un client réserve en 30 secondes depuis le lien de votre Instagram, reçoit la confirmation et, avant sa venue, un rappel par e-mail.",
    points: ["Lien prêt pour Instagram, votre site et Google", "Confirmation et rappel automatiques par e-mail", "Les réservations dans le calendrier du téléphone"],
    from: "",
    per: "par mois, par établissement",
    note: "",
    vat: "+ TVA",
    cta: "Découvrir les réservations",
  },
  de: {
    eyebrow: "Online-Reservierungssystem",
    titleStart: "Reservierungen rund um die Uhr,",
    titleAccent: "ohne ans Telefon zu gehen.",
    body: "Alle Hände voll zu tun, volles Haus, und das Telefon klingelt ununterbrochen. Um 23 Uhr bucht ein Kunde in 30 Sekunden über den Link in Ihrem Instagram, erhält die Bestätigung und vor dem Besuch eine Erinnerung per E-Mail.",
    points: ["Reservierungslink fertig für Instagram, Website und Google", "Automatische Bestätigung und Erinnerung per E-Mail", "Die Reservierungen im Kalender des Handys"],
    from: "",
    per: "pro Monat, pro Betrieb",
    note: "",
    vat: "zzgl. MwSt.",
    cta: "Die Online-Reservierung entdecken",
  },
  it: {
    eyebrow: "Sistema di prenotazione online",
    titleStart: "Prenotazioni a qualsiasi ora,",
    titleAccent: "senza rispondere al telefono.",
    body: "Le mani occupate, il locale pieno e il telefono che squilla senza sosta. Alle 23, un cliente prenota in 30 secondi dal link sul Suo Instagram, riceve la conferma e, prima della visita, un promemoria via email.",
    points: ["Link pronto per Instagram, il sito e Google", "Conferma e promemoria automatici via email", "Le prenotazioni nel calendario del telefono"],
    from: "",
    per: "al mese, per locale",
    note: "",
    vat: "+ IVA",
    cta: "Scopra le prenotazioni",
  },
};

export const chatbotBandCopy: Localized<AdBandCopy> = {
  pt: {
    eyebrow: "Chatbot com IA",
    titleStart: "Respostas a qualquer hora,",
    titleAccent: "no site e no WhatsApp.",
    body: "A password do WiFi, onde estacionar, a que horas abre: o assistente conhece o seu negócio e responde em segundos, de dia e de noite, na língua de cada cliente. Quando é preciso, passa a conversa para a sua equipa, com um resumo.",
    points: ["Treinado com a informação real do seu negócio", "Português, inglês e outras línguas", "Passa para uma pessoa quando a conversa o exige"],
    from: "",
    per: "por mês, site + WhatsApp",
    note: "",
    vat: "+ IVA",
    cta: "Conhecer o chatbot",
  },
  en: {
    eyebrow: "AI chatbot",
    titleStart: "Answers at any hour,",
    titleAccent: "on your website and WhatsApp.",
    body: "The WiFi password, where to park, what time you open: the assistant knows your business and answers in seconds, day and night, in each customer's language. When needed, it hands the conversation over to your team, with a summary.",
    points: ["Trained on your business's real information", "Portuguese, English and other languages", "Hands over to a person when the conversation needs it"],
    from: "",
    per: "per month, website + WhatsApp",
    note: "",
    vat: "+ VAT",
    cta: "Discover the chatbot",
  },
  es: {
    eyebrow: "Chatbot con IA",
    titleStart: "Respuestas a cualquier hora,",
    titleAccent: "en la web y en WhatsApp.",
    body: "La contraseña del wifi, dónde aparcar, a qué hora abre: el asistente conoce su negocio y responde en segundos, de día y de noche, en el idioma de cada cliente. Cuando hace falta, pasa la conversación a su equipo, con un resumen.",
    points: ["Entrenado con la información real de su negocio", "Portugués, inglés y otros idiomas", "Pasa a una persona cuando la conversación lo requiere"],
    from: "",
    per: "al mes, web + WhatsApp",
    note: "",
    vat: "+ IVA",
    cta: "Conocer el chatbot",
  },
  fr: {
    eyebrow: "Chatbot IA",
    titleStart: "Des réponses à toute heure,",
    titleAccent: "sur votre site et WhatsApp.",
    body: "Le mot de passe du wifi, où se garer, l'heure d'ouverture : l'assistant connaît votre entreprise et répond en quelques secondes, jour et nuit, dans la langue de chaque client. Si besoin, il passe la conversation à votre équipe, avec un résumé.",
    points: ["Entraîné avec les vraies informations de votre entreprise", "Portugais, anglais et d'autres langues", "Passe la main à une personne quand la conversation l'exige"],
    from: "",
    per: "par mois, site + WhatsApp",
    note: "",
    vat: "+ TVA",
    cta: "Découvrir le chatbot",
  },
  de: {
    eyebrow: "KI-Chatbot",
    titleStart: "Antworten rund um die Uhr,",
    titleAccent: "auf der Website und in WhatsApp.",
    body: "Das WLAN-Passwort, wo man parkt, wann Sie öffnen: Der Assistent kennt Ihr Geschäft und antwortet in Sekunden, Tag und Nacht, in der Sprache jedes Kunden. Wenn nötig, übergibt er das Gespräch mit einer Zusammenfassung an Ihr Team.",
    points: ["Mit den echten Informationen Ihres Geschäfts trainiert", "Portugiesisch, Englisch und weitere Sprachen", "Übergibt an einen Menschen, wenn das Gespräch es verlangt"],
    from: "",
    per: "pro Monat, Website + WhatsApp",
    note: "",
    vat: "zzgl. MwSt.",
    cta: "Den Chatbot entdecken",
  },
  it: {
    eyebrow: "Chatbot con IA",
    titleStart: "Risposte a qualsiasi ora,",
    titleAccent: "sul sito e su WhatsApp.",
    body: "La password del wifi, dove parcheggiare, a che ora apre: l'assistente conosce la Sua attività e risponde in pochi secondi, giorno e notte, nella lingua di ogni cliente. Quando serve, passa la conversazione al Suo personale, con un riepilogo.",
    points: ["Addestrato con le informazioni reali della Sua attività", "Portoghese, inglese e altre lingue", "Passa a una persona quando la conversazione lo richiede"],
    from: "",
    per: "al mese, sito + WhatsApp",
    note: "",
    vat: "+ IVA",
    cta: "Scopra il chatbot",
  },
};

/**
 * The home's bands with an ad video, in their order on the page, all of them above «O que quer melhorar?» (owner,
 * 2026-10-20). components/novo/NovoHome shows only those whose product has an ad in content/product-ads.ts and
 * alternates the tone (gold, rose) and the video's side (left, right), so a new ad on the home is one entry here.
 */
export const homeAdBands: { productId: ProductId; headingId: string; copy: Localized<AdBandCopy> }[] = [
  { productId: "guest-guide", headingId: "novo-guide", copy: guideBandCopy },
  { productId: "business-card", headingId: "novo-business-card", copy: businessCardBandCopy },
  { productId: "keychain", headingId: "novo-keychain", copy: keychainBandCopy },
  { productId: "waitlist", headingId: "novo-waitlist", copy: waitlistBandCopy },
  { productId: "bookings", headingId: "novo-bookings", copy: bookingsBandCopy },
  { productId: "ai-chatbot", headingId: "novo-chatbot", copy: chatbotBandCopy },
];

/* ---------- Placas para avaliações (banner): Google, Tripadvisor ou Booking.com ---------- */

/**
 * The plates banner. The price is never written here: it is read from products.ts
 * («google-review-plates»: priceFrom and the packs) and always shown without VAT, with «+ IVA».
 * The animation beside it is components/visuals/HeroTapScene (texts in sceneCopy above).
 */
const platesPt = {
  eyebrow: "Placas para avaliações",
  titleStart: "Mais avaliações,",
  titleAccent: "com um toque.",
  body: "O cliente encosta o telemóvel à placa, ou lê o QR, e abre logo a avaliação do seu negócio no Google ou no Tripadvisor, ou a página do seu alojamento na Booking.com. Uma placa, um destino, à sua escolha.",
  points: ["Google, Tripadvisor ou Booking.com, um destino por placa", "No balcão, na mesa, na montra ou na parede", "Com o seu texto e, se quiser, o seu logótipo", "Configurada por nós, pronta a usar"],
  from: "desde",
  perPlate: "por placa",
  /** {price} and {quantity} come from the best pack in products.ts. */
  pack: "{price} por placa a partir de {quantity}",
  vat: "+ IVA",
  cta: "Conhecer as placas",
  /** The secondary button that opens the ad in a window; the length «(27 s)» is added from product-ads.ts. */
  video: "Ver o vídeo",
};

export const platesCopy: Localized<typeof platesPt> = {
  pt: platesPt,
  en: {
    eyebrow: "Review plates",
    titleStart: "More reviews,",
    titleAccent: "with one tap.",
    body: "Customers hold their phone to the plate, or scan the QR, and your business's review page on Google or Tripadvisor opens straight away, or your property's page on Booking.com. One plate, one destination of your choice.",
    points: ["Google, Tripadvisor or Booking.com, one destination per plate", "On the counter, the table, the window or the wall", "With your wording and, if you like, your logo", "Set up by us, ready to use"],
    from: "from",
    perPlate: "per plate",
    pack: "{price} per plate for {quantity} or more",
    vat: "+ VAT",
    cta: "Discover the plates",
    video: "Watch the video",
  },
  es: {
    eyebrow: "Placas para reseñas",
    titleStart: "Más reseñas,",
    titleAccent: "con un toque.",
    body: "El cliente acerca el móvil a la placa, o lee el QR, y se abre al momento la página de reseñas de su negocio en Google o Tripadvisor, o la página de su alojamiento en Booking.com. Una placa, un destino, a su elección.",
    points: ["Google, Tripadvisor o Booking.com, un destino por placa", "En el mostrador, en la mesa, en el escaparate o en la pared", "Con su texto y, si quiere, su logotipo", "Configurada por nosotros, lista para usar"],
    from: "desde",
    perPlate: "por placa",
    pack: "{price} por placa a partir de {quantity}",
    vat: "+ IVA",
    cta: "Conocer las placas",
    video: "Ver el vídeo",
  },
  fr: {
    eyebrow: "Plaques pour avis",
    titleStart: "Plus d'avis,",
    titleAccent: "d'un simple toucher.",
    body: "Le client approche son téléphone de la plaque, ou scanne le QR code, et la page d'avis de votre établissement sur Google ou Tripadvisor s'ouvre aussitôt, ou la page de votre hébergement sur Booking.com. Une plaque, une destination, à votre choix.",
    points: ["Google, Tripadvisor ou Booking.com, une destination par plaque", "Sur le comptoir, la table, la vitrine ou le mur", "Avec votre texte et, si vous le souhaitez, votre logo", "Configurée par nous, prête à l'emploi"],
    from: "à partir de",
    perPlate: "la plaque",
    pack: "{price} la plaque à partir de {quantity}",
    vat: "+ TVA",
    cta: "Découvrir les plaques",
    video: "Voir la vidéo",
  },
  de: {
    eyebrow: "Bewertungsschilder",
    titleStart: "Mehr Bewertungen,",
    titleAccent: "mit einem Antippen.",
    body: "Ihr Gast hält das Handy an das Schild oder scannt den QR-Code, und sofort öffnet sich die Bewertungsseite Ihres Betriebs auf Google oder Tripadvisor oder die Seite Ihrer Unterkunft auf Booking.com. Ein Schild, ein Ziel Ihrer Wahl.",
    points: ["Google, Tripadvisor oder Booking.com, ein Ziel pro Schild", "Auf der Theke, dem Tisch, im Schaufenster oder an der Wand", "Mit Ihrem Text und, wenn Sie möchten, Ihrem Logo", "Von uns eingerichtet, sofort einsatzbereit"],
    from: "ab",
    perPlate: "pro Schild",
    pack: "{price} pro Schild ab {quantity} Stück",
    vat: "zzgl. MwSt.",
    cta: "Die Schilder entdecken",
    video: "Video ansehen",
  },
  it: {
    eyebrow: "Targhe per recensioni",
    titleStart: "Più recensioni,",
    titleAccent: "con un tocco.",
    body: "Il cliente avvicina il telefono alla targa, o inquadra il QR, e si apre subito la pagina delle recensioni della Sua attività su Google o Tripadvisor, oppure la pagina della Sua struttura su Booking.com. Una targa, una destinazione a Sua scelta.",
    points: ["Google, Tripadvisor o Booking.com, una destinazione per targa", "Sul banco, sul tavolo, in vetrina o a parete", "Con il Suo testo e, se vuole, il Suo logo", "Configurata da noi, pronta all'uso"],
    from: "da",
    perPlate: "a targa",
    pack: "{price} a targa da {quantity} pezzi",
    vat: "+ IVA",
    cta: "Scopra le targhe",
    video: "Guardi il video",
  },
};

/* ---------- Setores ---------- */

/** `see` has the sector's name at {sector}, lower-cased where the language does so (not in German). */
export const sectorsCopy: Localized<{ title: string; lead: string; together: string; pack: string; see: string; lowerSector: boolean }> = {
  pt: {
    title: "Soluções por setor",
    lead: "As combinações que mais fazem a diferença em cada tipo de negócio.",
    together: "Juntos, desde",
    pack: "Pack, desde",
    see: "Ver a solução para {sector}",
    lowerSector: true,
  },
  en: {
    title: "Solutions by sector",
    lead: "The combinations that make the biggest difference in each kind of business.",
    together: "Together, from",
    pack: "Pack, from",
    see: "See the solution for {sector}",
    lowerSector: true,
  },
  es: {
    title: "Soluciones por sector",
    lead: "Las combinaciones que más se notan en cada tipo de negocio.",
    together: "Juntos, desde",
    pack: "Pack, desde",
    see: "Ver la solución para {sector}",
    lowerSector: true,
  },
  fr: {
    title: "Solutions par secteur",
    lead: "Les combinaisons qui font le plus la différence pour chaque type d'activité.",
    together: "Ensemble, à partir de",
    pack: "Pack, à partir de",
    see: "Voir la solution pour {sector}",
    lowerSector: true,
  },
  de: {
    title: "Lösungen nach Branche",
    lead: "Die Kombinationen, die in jeder Branche am meisten bewirken.",
    together: "Zusammen ab",
    pack: "Paket ab",
    see: "Lösung für {sector} ansehen",
    lowerSector: false,
  },
  it: {
    title: "Soluzioni per settore",
    lead: "Le combinazioni che fanno più la differenza in ogni tipo di attività.",
    together: "Insieme, da",
    pack: "Pacchetto, da",
    see: "Veda la soluzione per {sector}",
    lowerSector: true,
  },
};

/**
 * The monthly part of a one-off product's price, read from its priceQualifier in products.ts
 * (the website's hosting, the video menu's 30 €/month, …): 0 when there is none.
 */
export function monthlyExtra(product: { priceBilling: string; priceQualifier: { pt: string } }): number {
  if (product.priceBilling === "monthly") return 0;
  const match = product.priceQualifier.pt.match(/(\d+(?:,\d+)?)\s*€\/mês/);
  return match ? Number(match[1].replace(",", ".")) : 0;
}

/** «/mês», «/month», «/mes», «/mois», «/Monat» or «/mese». */
export function perMonth(locale: Locale): string {
  return localize(novoCopy, locale).perMonth;
}

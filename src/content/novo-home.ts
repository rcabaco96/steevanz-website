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
    plateLine1: "Gostou?",
    plateLine2: "Toque para avaliar",
    screenIdle: "Aproxime o telemóvel",
    screenTitle: "O seu restaurante",
    screenPrompt: "Deixe a sua avaliação",
    screenButton: "Publicar",
    chipNoApp: "Sem app",
    chipTap: "Abre em segundos",
    ariaLabel: "Animação: um telemóvel toca numa placa e abre o formulário de review do Google, onde o cliente toca nas estrelas.",
  },
  en: {
    plateLine1: "Enjoyed it?",
    plateLine2: "Tap to review",
    screenIdle: "Hold your phone near",
    screenTitle: "Your restaurant",
    screenPrompt: "Leave a review",
    screenButton: "Post",
    chipNoApp: "No app",
    chipTap: "Opens in seconds",
    ariaLabel: "Animation: a phone taps a plate and opens the Google review form, where the customer taps the stars.",
  },
  es: {
    plateLine1: "¿Le ha gustado?",
    plateLine2: "Toque para valorar",
    screenIdle: "Acerque el móvil",
    screenTitle: "Su restaurante",
    screenPrompt: "Deje su reseña",
    screenButton: "Publicar",
    chipNoApp: "Sin app",
    chipTap: "Se abre en segundos",
    ariaLabel: "Animación: un móvil toca una placa y abre el formulario de reseña de Google, donde el cliente toca las estrellas.",
  },
  fr: {
    plateLine1: "Ça vous a plu ?",
    plateLine2: "Touchez pour noter",
    screenIdle: "Approchez votre téléphone",
    screenTitle: "Votre restaurant",
    screenPrompt: "Laissez votre avis",
    screenButton: "Publier",
    chipNoApp: "Sans application",
    chipTap: "S'ouvre en quelques secondes",
    ariaLabel: "Animation : un téléphone touche une plaque et ouvre le formulaire d'avis Google, où le client touche les étoiles.",
  },
  de: {
    plateLine1: "Hat's geschmeckt?",
    plateLine2: "Antippen und bewerten",
    screenIdle: "Handy hierhin halten",
    screenTitle: "Ihr Restaurant",
    screenPrompt: "Bewertung abgeben",
    screenButton: "Posten",
    chipNoApp: "Keine App",
    chipTap: "Öffnet in Sekunden",
    ariaLabel: "Animation: Ein Handy berührt ein Schild und öffnet das Google-Bewertungsformular, in dem der Gast die Sterne antippt.",
  },
  it: {
    plateLine1: "Ti è piaciuto?",
    plateLine2: "Tocca per recensire",
    screenIdle: "Avvicina il telefono",
    screenTitle: "Il vostro ristorante",
    screenPrompt: "Lascia una recensione",
    screenButton: "Pubblica",
    chipNoApp: "Senza app",
    chipTap: "Si apre in pochi secondi",
    ariaLabel: "Animazione: un telefono tocca una targa e apre il modulo di recensione Google, dove il cliente tocca le stelle.",
  },
};

const novoPt = {
  metaTitle: "Steevanz | Os seus clientes encontram, compram e voltam",
  metaDescription:
    "Websites, Menu digital em vídeo, reservas, reviews no Google e cartão de cliente para restaurantes, cafés, cabeleireiros, clínicas, alojamentos e lojas.",
  hero: {
    eyebrow: "Tecnologia para negócios locais",
    titleStart: "Os seus clientes",
    titleAccent: "encontram, compram e voltam.",
    subtitle:
      "Websites, reservas, Menu digital, reviews no Google, cartão de cliente e assistentes com IA. Nós fazemos, configuramos e ficamos por perto.",
    primary: "Agendar demonstração",
    secondary: "Falar connosco",
  },
  whatsappMessage: "Olá! Gostava de saber mais sobre as soluções da Steevanz.",
  perMonth: "/mês",
  clients: {
    title: "Confiam em nós",
    pause: "Pausar a faixa de clientes",
    play: "Retomar a faixa de clientes",
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
      "Websites, video digital menus, bookings, Google reviews and digital loyalty cards for restaurants, cafés, salons, clinics, holiday rentals and shops.",
    hero: {
      eyebrow: "Technology for local businesses",
      titleStart: "Your customers",
      titleAccent: "find you, buy from you and come back.",
      subtitle:
        "Websites, bookings, digital menus, Google reviews, loyalty cards and AI assistants. We build it, set it up and stay close by.",
      primary: "Book a demo",
      secondary: "Talk to us",
    },
    whatsappMessage: "Hi! I'd like to know more about Steevanz solutions.",
    perMonth: "/month",
    clients: {
      title: "They trust us",
      pause: "Pause the client strip",
      play: "Play the client strip",
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
      "Webs, Menú digital en vídeo, reservas, reseñas en Google y tarjeta de cliente digital para restaurantes, cafeterías, peluquerías, clínicas, alojamientos y tiendas.",
    hero: {
      eyebrow: "Tecnología para negocios locales",
      titleStart: "Sus clientes",
      titleAccent: "le encuentran, le compran y vuelven.",
      subtitle:
        "Webs, reservas, Menú digital, reseñas en Google, tarjeta de cliente y asistentes con IA. Nosotros lo hacemos, lo configuramos y seguimos a su lado.",
      primary: "Reservar una demostración",
      secondary: "Hablar con nosotros",
    },
    whatsappMessage: "¡Hola! Me gustaría saber más sobre las soluciones de Steevanz.",
    perMonth: "/mes",
    clients: {
      title: "Confían en nosotros",
      pause: "Pausar la franja de clientes",
      play: "Reanudar la franja de clientes",
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
      "Sites web, Menu digital en vidéo, réservations, avis Google et carte de fidélité digitale pour restaurants, cafés, salons de coiffure, cliniques, locations de vacances et boutiques.",
    hero: {
      eyebrow: "Technologie pour les commerces locaux",
      titleStart: "Vos clients",
      titleAccent: "vous trouvent, achètent chez vous et reviennent.",
      subtitle:
        "Sites web, réservations, Menu digital, avis Google, carte de fidélité et assistants IA. Nous les créons, les configurons et restons à vos côtés.",
      primary: "Réserver une démo",
      secondary: "Nous parler",
    },
    whatsappMessage: "Bonjour ! J'aimerais en savoir plus sur les solutions Steevanz.",
    perMonth: "/mois",
    clients: {
      title: "Ils nous font confiance",
      pause: "Mettre en pause le défilé des clients",
      play: "Relancer le défilé des clients",
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
      "Websites, digitale Speisekarte mit Videos, Reservierungen, Google-Bewertungen und digitale Kundenkarte für Restaurants, Cafés, Friseursalons, Praxen, Ferienunterkünfte und Geschäfte.",
    hero: {
      eyebrow: "Technologie für lokale Betriebe",
      titleStart: "Ihre Kunden",
      titleAccent: "finden Sie, kaufen bei Ihnen und kommen wieder.",
      subtitle:
        "Websites, Reservierungen, digitale Speisekarte, Google-Bewertungen, Kundenkarte und KI-Assistenten. Wir bauen es, richten es ein und bleiben an Ihrer Seite.",
      primary: "Demo vereinbaren",
      secondary: "Mit uns sprechen",
    },
    whatsappMessage: "Hallo! Ich möchte mehr über die Lösungen von Steevanz erfahren.",
    perMonth: "/Monat",
    clients: {
      title: "Sie vertrauen uns",
      pause: "Kundenleiste anhalten",
      play: "Kundenleiste fortsetzen",
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
    metaTitle: "Steevanz | I vostri clienti vi trovano, comprano da voi e tornano",
    metaDescription:
      "Siti web, Menù digitale in video, prenotazioni, recensioni Google e carta fedeltà digitale per ristoranti, bar, parrucchieri, cliniche, case vacanza e negozi.",
    hero: {
      eyebrow: "Tecnologia per le attività locali",
      titleStart: "I vostri clienti",
      titleAccent: "vi trovano, comprano da voi e tornano.",
      subtitle:
        "Siti web, prenotazioni, Menù digitale, recensioni Google, carta fedeltà e assistenti con IA. Li realizziamo, li configuriamo e restiamo al vostro fianco.",
      primary: "Prenota una demo",
      secondary: "Parliamone",
    },
    whatsappMessage: "Buongiorno! Vorrei saperne di più sulle soluzioni Steevanz.",
    perMonth: "/mese",
    clients: {
      title: "Si fidano di noi",
      pause: "Metti in pausa la fascia dei clienti",
      play: "Riprendi la fascia dei clienti",
    },
    goals: {
      title: "Cosa volete migliorare?",
      lead: "Scegliete l'obiettivo. Vi mostriamo cosa lo risolve, già in funzione, e quanto costa.",
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
      cta: "Scopri il Menù digitale",
      from: "da",
      vat: "+ IVA",
    },
    finalCta: {
      title: "Raccontateci cosa volete migliorare.",
      body: "Una chiacchierata senza impegno: vi mostriamo tutto in funzione e vi diciamo con franchezza cosa ha senso per la vostra attività.",
      primary: "Prenota una demo",
      secondary: "Scriveteci su WhatsApp",
    },
    brandLine: ["Tecnologia del futuro.", "Con le buone maniere di una volta."],
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
  goal("found", ["website", "landing-page", "online-shop", "google-review-plates", "ai-reviews"], {
    pt: {
      title: "Ser encontrado",
      lead: "Quem procura no Google ou no Instagram chega até si, e gosta do que vê.",
      products: {
        website: { benefit: "Um site rápido que aparece no Google e convence quem chega." },
        "landing-page": { benefit: "Uma página com um só objetivo: que liguem, reservem ou encomendem." },
        "online-shop": { benefit: "Venda a quem o encontra online, com MB WAY, Multibanco e cartão." },
        "google-review-plates": { benefit: "Mais reviews no Google, para subir quando o procuram." },
        "ai-reviews": { benefit: "Todas as reviews respondidas, no tom da sua marca." },
      },
    },
    en: {
      title: "Get found",
      lead: "People searching on Google or Instagram find you, and like what they see.",
      products: {
        website: { benefit: "A fast site that shows up on Google and wins visitors over." },
        "landing-page": { benefit: "One page, one goal: getting people to call, book or order." },
        "online-shop": { benefit: "Sell to people who find you online, with MB WAY, Multibanco and cards." },
        "google-review-plates": { benefit: "More Google reviews, so you rank higher when people search." },
        "ai-reviews": { benefit: "Every review answered, in your brand's tone." },
      },
    },
    es: {
      title: "Que le encuentren",
      lead: "Quien busca en Google o en Instagram llega hasta usted, y le gusta lo que ve.",
      products: {
        website: { benefit: "Una web rápida que aparece en Google y convence a quien llega." },
        "landing-page": { benefit: "Una página con un solo objetivo: que llamen, reserven o pidan." },
        "online-shop": { benefit: "Venda a quien le encuentra online, con MB WAY, Multibanco y tarjeta." },
        "google-review-plates": { benefit: "Más reseñas en Google, para subir cuando le buscan." },
        "ai-reviews": { benefit: "Todas las reseñas respondidas, con el tono de su marca." },
      },
    },
    fr: {
      title: "Être trouvé",
      lead: "Ceux qui cherchent sur Google ou Instagram arrivent jusqu'à vous, et aiment ce qu'ils voient.",
      products: {
        website: { benefit: "Un site rapide, visible sur Google, qui convainc les visiteurs." },
        "landing-page": { benefit: "Une page, un seul objectif : qu'on vous appelle, réserve ou commande." },
        "online-shop": { benefit: "Vendez à ceux qui vous trouvent en ligne, par MB WAY, Multibanco et carte." },
        "google-review-plates": { benefit: "Plus d'avis Google, pour remonter quand on vous cherche." },
        "ai-reviews": { benefit: "Chaque avis reçoit une réponse, dans le ton de votre marque." },
      },
    },
    de: {
      title: "Gefunden werden",
      lead: "Wer bei Google oder Instagram sucht, findet zu Ihnen und mag, was er sieht.",
      products: {
        website: { benefit: "Eine schnelle Website, die bei Google auftaucht und Besucher überzeugt." },
        "landing-page": { benefit: "Eine Seite mit einem Ziel: dass man anruft, reserviert oder bestellt." },
        "online-shop": { benefit: "Verkaufen Sie an alle, die Sie online finden, mit MB WAY, Multibanco und Karte." },
        "google-review-plates": { benefit: "Mehr Google-Bewertungen, damit Sie in der Suche weiter oben stehen." },
        "ai-reviews": { benefit: "Jede Bewertung beantwortet, im Ton Ihrer Marke." },
      },
    },
    it: {
      title: "Farsi trovare",
      lead: "Chi cerca su Google o su Instagram arriva da voi, e gli piace quello che vede.",
      products: {
        website: { benefit: "Un sito veloce che compare su Google e convince chi arriva." },
        "landing-page": { benefit: "Una pagina con un solo obiettivo: farvi chiamare, prenotare o ordinare." },
        "online-shop": { benefit: "Vendete a chi vi trova online, con MB WAY, Multibanco e carta." },
        "google-review-plates": { benefit: "Più recensioni su Google, per salire quando vi cercano." },
        "ai-reviews": { benefit: "Ogni recensione con una risposta, nel tono del vostro marchio." },
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
  goal("sell", ["digital-menu", "guest-guide"], {
    pt: {
      title: "Vender mais",
      lead: "Os pratos em vídeo abrem o apetite, e a mesa faz o pedido no telemóvel.",
      products: {
        "digital-menu": { label: "Menu digital em vídeo + Pedidos à mesa", benefit: "Cada prato no seu vídeo, com preço, e pedidos feitos à mesa." },
        "guest-guide": { benefit: "Recomende os seus favoritos aos hóspedes, em quatro línguas." },
      },
    },
    en: {
      title: "Sell more",
      lead: "Dishes on video whet the appetite, and the table orders from their phone.",
      products: {
        "digital-menu": { label: "Video digital menu + table ordering", benefit: "Every dish in its own video, with its price, and orders from the table." },
        "guest-guide": { benefit: "Recommend your favourite places to guests, in four languages." },
      },
    },
    es: {
      title: "Vender más",
      lead: "Los platos en vídeo abren el apetito, y la mesa pide desde el móvil.",
      products: {
        "digital-menu": { label: "Menú digital en vídeo + pedidos en la mesa", benefit: "Cada plato en su vídeo, con precio, y pedidos desde la mesa." },
        "guest-guide": { benefit: "Recomiende sus sitios favoritos a los huéspedes, en cuatro idiomas." },
      },
    },
    fr: {
      title: "Vendre plus",
      lead: "Les plats en vidéo mettent en appétit, et la table commande depuis le téléphone.",
      products: {
        "digital-menu": { label: "Menu digital en vidéo + commande à table", benefit: "Chaque plat en vidéo, avec son prix, et la commande depuis la table." },
        "guest-guide": { benefit: "Recommandez vos bonnes adresses aux voyageurs, en quatre langues." },
      },
    },
    de: {
      title: "Mehr verkaufen",
      lead: "Gerichte als Video machen Appetit, und der Tisch bestellt per Handy.",
      products: {
        "digital-menu": { label: "Digitale Speisekarte mit Videos + Bestellung am Tisch", benefit: "Jedes Gericht im eigenen Video, mit Preis, und Bestellung vom Tisch." },
        "guest-guide": { benefit: "Empfehlen Sie Ihren Gästen Ihre Lieblingsorte, in vier Sprachen." },
      },
    },
    it: {
      title: "Vendere di più",
      lead: "I piatti in video stuzzicano l'appetito, e il tavolo ordina dal telefono.",
      products: {
        "digital-menu": { label: "Menù digitale in video + ordini al tavolo", benefit: "Ogni piatto nel suo video, con il prezzo, e ordini dal tavolo." },
        "guest-guide": { benefit: "Consigliate i vostri posti preferiti agli ospiti, in quattro lingue." },
      },
    },
  }),
  goal("return", ["loyalty", "social-plates"], {
    pt: {
      title: "Fazer voltar",
      lead: "Um cartão de carimbos que não fica em casa e um toque para o seguirem nas redes.",
      products: {
        loyalty: { benefit: "Carimbos no telemóvel, e a recompensa chega sozinha." },
        "social-plates": { benefit: "Um toque e passam a segui-lo nas redes sociais." },
      },
    },
    en: {
      title: "Bring them back",
      lead: "A stamp card that never gets left at home, and one tap to follow you on social media.",
      products: {
        loyalty: { benefit: "Stamps on the phone, and the reward arrives on its own." },
        "social-plates": { benefit: "One tap and they follow you on social media." },
      },
    },
    es: {
      title: "Que vuelvan",
      lead: "Una tarjeta de sellos que nunca se queda en casa y un toque para seguirle en redes.",
      products: {
        loyalty: { benefit: "Sellos en el móvil, y la recompensa llega sola." },
        "social-plates": { benefit: "Un toque y empiezan a seguirle en redes sociales." },
      },
    },
    fr: {
      title: "Faire revenir",
      lead: "Une carte à tampons qu'on n'oublie jamais à la maison, et un toucher pour vous suivre sur les réseaux.",
      products: {
        loyalty: { benefit: "Des tampons sur le téléphone, et la récompense arrive toute seule." },
        "social-plates": { benefit: "Un toucher, et ils vous suivent sur les réseaux sociaux." },
      },
    },
    de: {
      title: "Wiederkommen lassen",
      lead: "Eine Stempelkarte, die nie zu Hause liegen bleibt, und ein Antippen, um Ihnen in den sozialen Netzwerken zu folgen.",
      products: {
        loyalty: { benefit: "Stempel auf dem Handy, und die Prämie kommt von selbst." },
        "social-plates": { benefit: "Einmal antippen, und man folgt Ihnen in den sozialen Netzwerken." },
      },
    },
    it: {
      title: "Farli tornare",
      lead: "Una carta timbri che non resta mai a casa e un tocco per seguirvi sui social.",
      products: {
        loyalty: { benefit: "Timbri sul telefono, e il premio arriva da solo." },
        "social-plates": { benefit: "Un tocco e iniziano a seguirvi sui social." },
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
      lead: "Attività ripetitive che vi rubano tempo? Automatizziamo il processo, a prezzo fisso.",
      products: { automation: { benefit: "Fatture, promemoria e follow-up, automatizzati a prezzo fisso." } },
    },
  }),
];

export const goals: Localized<Goal[]> = Object.fromEntries(
  locales.map((locale) => [locale, goalList.map((entry) => localize(entry, locale))]),
) as Localized<Goal[]>;

/** «Conhecer <produto>» on each goal card (owner, 2026-10-20: product calls go to the product page). */
export const goalCtas: Record<ProductId, Localized<string>> = {
  website: { pt: "Conhecer o website", en: "Discover the website", es: "Conocer la web", fr: "Découvrir le site web", de: "Die Website entdecken", it: "Scopri il sito web" },
  "landing-page": { pt: "Conhecer a landing page", en: "Discover the landing page", es: "Conocer la landing page", fr: "Découvrir la landing page", de: "Die Landingpage entdecken", it: "Scopri la landing page" },
  "online-shop": { pt: "Conhecer a loja online", en: "Discover the online shop", es: "Conocer la tienda online", fr: "Découvrir la boutique en ligne", de: "Den Onlineshop entdecken", it: "Scopri il negozio online" },
  "google-review-plates": { pt: "Conhecer as placas", en: "Discover the plates", es: "Conocer las placas", fr: "Découvrir les plaques", de: "Die Schilder entdecken", it: "Scopri le targhe" },
  "ai-reviews": { pt: "Conhecer a gestão de reviews", en: "Discover review management", es: "Conocer la gestión de reseñas", fr: "Découvrir la gestion des avis", de: "Das Bewertungsmanagement entdecken", it: "Scopri la gestione delle recensioni" },
  bookings: { pt: "Conhecer as reservas", en: "Discover online bookings", es: "Conocer las reservas", fr: "Découvrir les réservations", de: "Die Online-Reservierung entdecken", it: "Scopri le prenotazioni" },
  waitlist: { pt: "Conhecer a lista de espera", en: "Discover the waitlist", es: "Conocer la lista de espera", fr: "Découvrir la liste d'attente", de: "Die Warteliste entdecken", it: "Scopri la lista d'attesa" },
  "ai-chatbot": { pt: "Conhecer o chatbot", en: "Discover the chatbot", es: "Conocer el chatbot", fr: "Découvrir le chatbot", de: "Den Chatbot entdecken", it: "Scopri il chatbot" },
  "ai-voice": { pt: "Conhecer a receção por voz", en: "Discover the voice receptionist", es: "Conocer la recepcionista de voz", fr: "Découvrir la réceptionniste vocale", de: "Die Telefonrezeption entdecken", it: "Scopri la receptionist vocale" },
  "digital-menu": { pt: "Conhecer o Menu digital", en: "Discover the digital menu", es: "Conocer el Menú digital", fr: "Découvrir le Menu digital", de: "Die digitale Speisekarte entdecken", it: "Scopri il Menù digitale" },
  "guest-guide": { pt: "Conhecer o guia digital", en: "Discover the guest guide", es: "Conocer la guía digital", fr: "Découvrir le livret d'accueil", de: "Die Gästemappe entdecken", it: "Scopri la guida digitale" },
  loyalty: { pt: "Conhecer o cartão", en: "Discover the loyalty card", es: "Conocer la tarjeta", fr: "Découvrir la carte de fidélité", de: "Die Kundenkarte entdecken", it: "Scopri la carta fedeltà" },
  "social-plates": { pt: "Conhecer as placas para redes", en: "Discover the social media plates", es: "Conocer las placas para redes", fr: "Découvrir les plaques réseaux sociaux", de: "Die Social-Media-Schilder entdecken", it: "Scopri le targhe social" },
  automation: { pt: "Conhecer a automação", en: "Discover automation", es: "Conocer la automatización", fr: "Découvrir l'automatisation", de: "Die Automatisierung entdecken", it: "Scopri l'automazione" },
};

/**
 * Clients the owner allowed us to name (2026-10-18). The logo files are still to come: each one
 * gets an SVG slot (`logo`), and until then the name is set in type. Never add what was done for a
 * client here without the owner's word.
 */
export interface TrustedClient {
  id: string;
  name: string;
  /** TODO(logos): path to the client's SVG logo in public/home/clients/ once the owner sends it. */
  logo?: { src: string; width: number; height: number };
}

export const trustedClients: TrustedClient[] = [
  { id: "sporting", name: "Sporting" },
  { id: "bmw", name: "BMW" },
  { id: "credito-agricola", name: "Crédito Agrícola" },
  { id: "eic", name: "EIC" },
  { id: "agilflex", name: "Agilflex" },
  { id: "dianaconta", name: "Dianaconta" },
  { id: "dolci-salati", name: "Dolci e Salati" },
];

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
      { title: "Diteci cosa non va", body: "Raccontateci cosa vi preoccupa nella vostra attività: tavoli vuoti, poche recensioni, clienti che non tornano." },
      { title: "Ascoltate le soluzioni", body: "Vi mostriamo quello che ha senso, già in funzione, con i prezzi in chiaro." },
      { title: "Scegliete la vostra", body: "Solo quello che vi serve. Nessun pacchetto imposto." },
      { title: "Al resto pensiamo noi", body: "Installiamo, configuriamo e vi insegniamo a usarlo. E restiamo al vostro fianco." },
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
    body: "La carta timbri ora vive sullo smartphone del cliente: si iscrive con un tocco sulla targa o con il QR, senza app. Il vostro staff timbra in pochi secondi e, per esempio, dopo 9 caffè il 10° è offerto, in automatico.",
    points: ["Niente app e niente carte di carta da perdere", "Timbro dato dal vostro staff, leggendo il QR della carta", "Premio automatico quando la carta è completa"],
    from: "da",
    vat: "+ IVA",
    cta: "Scopri la carta fedeltà",
  },
};

/* ---------- Placas de reviews do Google (banner) ---------- */

/**
 * The plates banner. The price is never written here: it is read from products.ts
 * («google-review-plates»: priceFrom and the packs) and always shown without VAT, with «+ IVA».
 * The animation beside it is components/visuals/HeroTapScene (texts in sceneCopy above).
 */
const platesPt = {
  eyebrow: "Placas de reviews do Google",
  titleStart: "Mais reviews no Google,",
  titleAccent: "com um toque.",
  body: "O cliente encosta o telemóvel à placa, ou lê o QR, e abre logo o formulário de review do seu negócio no Google. Sem instalar nada, sem procurar.",
  points: ["No balcão, na mesa, na montra ou na parede", "Com o seu texto e, se quiser, o seu logótipo", "Configurada por nós, pronta a usar"],
  from: "desde",
  perPlate: "por placa",
  /** {price} and {quantity} come from the best pack in products.ts. */
  pack: "{price} por placa a partir de {quantity}",
  vat: "+ IVA",
  cta: "Conhecer as placas",
};

export const platesCopy: Localized<typeof platesPt> = {
  pt: platesPt,
  en: {
    eyebrow: "Google review plates",
    titleStart: "More Google reviews,",
    titleAccent: "with one tap.",
    body: "Customers hold their phone to the plate, or scan the QR, and your business's Google review form opens straight away. Nothing to install, nothing to search for.",
    points: ["On the counter, the table, the window or the wall", "With your wording and, if you like, your logo", "Set up by us, ready to use"],
    from: "from",
    perPlate: "per plate",
    pack: "{price} per plate for {quantity} or more",
    vat: "+ VAT",
    cta: "Discover the plates",
  },
  es: {
    eyebrow: "Placas para reseñas en Google",
    titleStart: "Más reseñas en Google,",
    titleAccent: "con un toque.",
    body: "El cliente acerca el móvil a la placa, o lee el QR, y se abre al momento el formulario de reseña de su negocio en Google. Sin instalar nada, sin buscar.",
    points: ["En el mostrador, en la mesa, en el escaparate o en la pared", "Con su texto y, si quiere, su logotipo", "Configurada por nosotros, lista para usar"],
    from: "desde",
    perPlate: "por placa",
    pack: "{price} por placa a partir de {quantity}",
    vat: "+ IVA",
    cta: "Conocer las placas",
  },
  fr: {
    eyebrow: "Plaques pour avis Google",
    titleStart: "Plus d'avis Google,",
    titleAccent: "d'un simple toucher.",
    body: "Le client approche son téléphone de la plaque, ou scanne le QR code, et le formulaire d'avis Google de votre établissement s'ouvre aussitôt. Rien à installer, rien à chercher.",
    points: ["Sur le comptoir, la table, la vitrine ou le mur", "Avec votre texte et, si vous le souhaitez, votre logo", "Configurée par nous, prête à l'emploi"],
    from: "à partir de",
    perPlate: "la plaque",
    pack: "{price} la plaque à partir de {quantity}",
    vat: "+ TVA",
    cta: "Découvrir les plaques",
  },
  de: {
    eyebrow: "Google-Bewertungsschilder",
    titleStart: "Mehr Google-Bewertungen,",
    titleAccent: "mit einem Antippen.",
    body: "Ihr Gast hält das Handy an das Schild oder scannt den QR-Code, und das Google-Bewertungsformular Ihres Betriebs öffnet sich sofort. Nichts installieren, nichts suchen.",
    points: ["Auf der Theke, dem Tisch, im Schaufenster oder an der Wand", "Mit Ihrem Text und, wenn Sie möchten, Ihrem Logo", "Von uns eingerichtet, sofort einsatzbereit"],
    from: "ab",
    perPlate: "pro Schild",
    pack: "{price} pro Schild ab {quantity} Stück",
    vat: "zzgl. MwSt.",
    cta: "Die Schilder entdecken",
  },
  it: {
    eyebrow: "Targhe per recensioni Google",
    titleStart: "Più recensioni su Google,",
    titleAccent: "con un tocco.",
    body: "Il cliente avvicina il telefono alla targa, o inquadra il QR, e si apre subito il modulo di recensione Google della vostra attività. Senza installare nulla, senza cercare.",
    points: ["Sul banco, sul tavolo, in vetrina o a parete", "Con il vostro testo e, se volete, il vostro logo", "Configurata da noi, pronta all'uso"],
    from: "da",
    perPlate: "a targa",
    pack: "{price} a targa da {quantity} pezzi",
    vat: "+ IVA",
    cta: "Scopri le targhe",
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
    see: "Vedi la soluzione per {sector}",
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

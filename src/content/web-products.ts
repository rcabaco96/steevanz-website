import type { Localized } from "@/lib/i18n";
import type { ProductId } from "./types";

/**
 * Shared copy for the website products (landing page, website, online shop): the sector
 * starting points («modelos») and the rules every site is built to. Text only: the owner's demo
 * projects are not linked until their placeholder reviews and testimonials are removed.
 */

export type WebProductId = Extract<ProductId, "landing-page" | "website" | "online-shop">;

export interface WebModelo {
  id: string;
  name: string;
  /** What this starting point already has, per product. */
  includes: Record<WebProductId, string>;
  /** Steevanz products that plug in. */
  connections: string;
}

export interface WebSharedCopy {
  modelosEyebrow: string;
  modelosTitle: string;
  modelosLead: string;
  modelosAll: string;
  connectionsLabel: string;
  modelos: WebModelo[];
  extrasEyebrow: string;
  extrasTitle: string;
  addOnsTitle: string;
  addOnsNote: string;
  notIncludedTitle: string;
  monthlyTitle: string;
  rulesEyebrow: string;
  rulesTitle: string;
  rules: string[];
  shopRules: string[];
  rulesNote: string;
}

export const webSharedCopy: Localized<WebSharedCopy> = {
  pt: {
    modelosEyebrow: "Modelos por setor",
    modelosTitle: "Começamos de uma base pensada para o seu negócio",
    modelosLead:
      "Cada setor tem um ponto de partida com a estrutura e as ligações que fazem sentido. Depois adaptamos tudo à sua marca: logótipo, cores, textos e fotos.",
    modelosAll:
      "Todos os modelos incluem: botão principal bem visível, contactos e WhatsApp, mapa, ligação às suas reviews reais do Google, aviso de cookies, privacidade, Livro de Reclamações, pensado para telemóvel e acessível.",
    connectionsLabel: "Liga com",
    modelos: [
      {
        id: "restaurante",
        name: "Restaurante ou café",
        includes: {
          "landing-page": "Destaque, menu da época, reservas, horário e mapa, take-away e contactos.",
          website: "Início, Menu, Reservas, Eventos e grupos, Galeria e Contactos. Take-away opcional.",
          "online-shop": "Encomendas para levantar, cabazes, bolos por encomenda e vales de oferta, com hora de recolha.",
        },
        connections: "Menu digital, reservas, lista de espera, cartão de fidelidade e placas de reviews.",
      },
      {
        id: "beleza",
        name: "Barbearia, cabeleireiro ou estética",
        includes: {
          "landing-page": "Serviços e preços, equipa, fotos de trabalhos e um botão para marcar.",
          website: "Início, Serviços e preços, Equipa, Galeria de trabalhos, Marcar e Contactos.",
          "online-shop": "Produtos que usa no salão, cartões de oferta e pacotes de tratamentos.",
        },
        connections: "Reservas com lembretes, lista de espera, cartão de fidelidade e chatbot.",
      },
      {
        id: "clinica",
        name: "Clínica",
        includes: {
          "landing-page": "Uma especialidade ou campanha, equipa, pedido de marcação e contactos claros.",
          website: "Início, Especialidades, Equipa clínica, Acordos, Pedido de consulta e Contactos. Formulários sem dados de saúde.",
          "online-shop": "Produtos de cuidado, vales de consulta e pacotes de sessões pagos online.",
        },
        connections: "Reservas, receção por voz com IA, chatbot e gestão de reviews.",
      },
      {
        id: "ginasio",
        name: "Ginásio ou estúdio",
        includes: {
          "landing-page": "Modalidades, horário das aulas, planos e pedido de aula experimental.",
          website: "Início, Modalidades, Horário de aulas, Preços e planos, Equipa, Aula experimental e Contactos.",
          "online-shop": "Planos, packs de aulas, cartões de oferta e merchandising.",
        },
        connections: "Reservas de aulas, cartão de fidelidade e chatbot.",
      },
      {
        id: "alojamento",
        name: "Alojamento local",
        includes: {
          "landing-page": "A casa, fotos, comodidades, a zona e pedido de reserva, com o número de registo RNAL visível.",
          website: "Início, Alojamentos (uma página cada), A zona, Pedido de reserva, Condições e Contactos, em várias línguas e com o RNAL.",
          "online-shop": "Vales de estadia, experiências e produtos da região.",
        },
        connections: "Chatbot para as perguntas dos hóspedes e gestão de reviews.",
      },
      {
        id: "loja",
        name: "Loja",
        includes: {
          "landing-page": "Abertura, promoção ou coleção nova, com morada, horário e WhatsApp.",
          website: "Início, Coleções ou Marcas, Sobre, Visite-nos e Contactos.",
          "online-shop": "Catálogo, página de produto, carrinho, checkout e página de envios e devoluções.",
        },
        connections: "Cartão de fidelidade, placas de reviews e chatbot.",
      },
    ],
    extrasEyebrow: "Preço e opções",
    extrasTitle: "O que fica de fora e o que pode juntar",
    addOnsTitle: "Opções extra",
    addOnsNote: "Valores sem IVA, indicativos. Entram na proposta só se as escolher.",
    notIncludedTitle: "Não incluído",
    monthlyTitle: "Plano mensal",
    rulesEyebrow: "Regras e boas práticas",
    rulesTitle: "O básico legal e prático, tratado de raiz",
    rules: [
      "Aviso de cookies com «Rejeitar» tão fácil como «Aceitar».",
      "Ligação ao Livro de Reclamações Eletrónico, bem visível.",
      "Identificação da empresa, preços e informação ao consumidor como a lei exige.",
      "Construído segundo as regras de acessibilidade WCAG 2.1 AA.",
      "Domínio registado em seu nome: o site é seu.",
      "Pagamento em duas partes: 50% na adjudicação e 50% antes de publicar.",
    ],
    shopRules: [
      "MB WAY, Multibanco e cartão, com a sua própria conta de pagamentos.",
      "Termos de venda, direito de livre resolução de 14 dias e política de devoluções.",
    ],
    rulesNote:
      "Preparamos a estrutura e os modelos dos textos legais. O conteúdo final é validado por si, pelo seu contabilista ou pelo seu advogado.",
  },
  en: {
    modelosEyebrow: "Templates by sector",
    modelosTitle: "We start from a base designed for your business",
    modelosLead:
      "Each sector has a starting point with the structure and connections that make sense. Then we adapt everything to your brand: logo, colours, texts and photos.",
    modelosAll:
      "Every template includes: a clear main button, contacts and WhatsApp, a map, a link to your real Google reviews, a cookie banner, privacy, the complaints book, a phone-first layout and accessibility.",
    connectionsLabel: "Connects with",
    modelos: [
      {
        id: "restaurante",
        name: "Restaurant or café",
        includes: {
          "landing-page": "Highlights, seasonal menu, bookings, hours and map, takeaway and contacts.",
          website: "Home, Menu, Bookings, Events and groups, Gallery and Contacts. Optional takeaway.",
          "online-shop": "Pickup orders, hampers, cakes to order and gift vouchers, with a collection time.",
        },
        connections: "Digital menu, bookings, waitlist, loyalty card and review plates.",
      },
      {
        id: "beleza",
        name: "Barber, salon or beauty",
        includes: {
          "landing-page": "Services and prices, team, photos of your work and a booking button.",
          website: "Home, Services and prices, Team, Portfolio, Book and Contacts.",
          "online-shop": "The products you use in the salon, gift cards and treatment packs.",
        },
        connections: "Bookings with reminders, waitlist, loyalty card and chatbot.",
      },
      {
        id: "clinica",
        name: "Clinic",
        includes: {
          "landing-page": "One speciality or campaign, team, appointment request and clear contacts.",
          website: "Home, Specialities, Clinical team, Insurance agreements, Appointment request and Contacts. Forms without health data.",
          "online-shop": "Care products, consultation vouchers and session packs paid online.",
        },
        connections: "Bookings, AI voice receptionist, chatbot and review management.",
      },
      {
        id: "ginasio",
        name: "Gym or studio",
        includes: {
          "landing-page": "Classes, timetable, plans and a free trial class request.",
          website: "Home, Classes, Timetable, Prices and plans, Team, Trial class and Contacts.",
          "online-shop": "Plans, class packs, gift cards and merchandise.",
        },
        connections: "Class bookings, loyalty card and chatbot.",
      },
      {
        id: "alojamento",
        name: "Holiday rental",
        includes: {
          "landing-page": "The property, photos, amenities, the area and a booking request, with the RNAL licence number shown.",
          website: "Home, Properties (one page each), The area, Booking request, Terms and Contacts, in several languages and with the RNAL number.",
          "online-shop": "Stay vouchers, experiences and local products.",
        },
        connections: "Chatbot for guest questions and review management.",
      },
      {
        id: "loja",
        name: "Shop",
        includes: {
          "landing-page": "An opening, a promotion or a new collection, with address, hours and WhatsApp.",
          website: "Home, Collections or Brands, About, Visit us and Contacts.",
          "online-shop": "Catalogue, product page, cart, checkout and a shipping and returns page.",
        },
        connections: "Loyalty card, review plates and chatbot.",
      },
    ],
    extrasEyebrow: "Price and options",
    extrasTitle: "What's left out and what you can add",
    addOnsTitle: "Extra options",
    addOnsNote: "Prices exclude VAT and are indicative. They go into the proposal only if you choose them.",
    notIncludedTitle: "Not included",
    monthlyTitle: "Monthly plan",
    rulesEyebrow: "Rules and good practice",
    rulesTitle: "The legal and practical basics, built in",
    rules: [
      "Cookie banner where «Reject» is as easy as «Accept».",
      "A clearly visible link to the Portuguese electronic complaints book.",
      "Company details, prices and consumer information as the law requires.",
      "Built to the WCAG 2.1 AA accessibility guidelines.",
      "Domain registered in your name: the site is yours.",
      "Payment in two parts: 50% when you accept and 50% before launch.",
    ],
    shopRules: [
      "MB WAY, Multibanco and cards, with your own payment account.",
      "Terms of sale, the 14-day right of withdrawal and a returns policy.",
    ],
    rulesNote:
      "We prepare the structure and templates for the legal texts. The final wording is checked by you, your accountant or your lawyer.",
  },
  es: {
    modelosEyebrow: "Plantillas por sector",
    modelosTitle: "Partimos de una base pensada para su negocio",
    modelosLead:
      "Cada sector tiene un punto de partida con la estructura y las conexiones que tienen sentido. Después lo adaptamos todo a su marca: logotipo, colores, textos y fotos.",
    modelosAll:
      "Todas las plantillas incluyen: un botón principal bien visible, contactos y WhatsApp, mapa, enlace a sus reseñas reales de Google, aviso de cookies, privacidad, Libro de Reclamaciones, diseño pensado para el móvil y accesibilidad.",
    connectionsLabel: "Se conecta con",
    modelos: [
      {
        id: "restaurante",
        name: "Restaurante o cafetería",
        includes: {
          "landing-page": "Destacados, carta de temporada, reservas, horario y mapa, comida para llevar y contactos.",
          website: "Inicio, Carta, Reservas, Eventos y grupos, Galería y Contacto. Comida para llevar opcional.",
          "online-shop": "Pedidos para recoger, cestas, tartas por encargo y vales regalo, con hora de recogida.",
        },
        connections: "Menú digital, reservas, lista de espera, tarjeta de cliente y placas para reseñas.",
      },
      {
        id: "beleza",
        name: "Barbería, peluquería o estética",
        includes: {
          "landing-page": "Servicios y precios, equipo, fotos de trabajos y un botón para reservar.",
          website: "Inicio, Servicios y precios, Equipo, Galería de trabajos, Reservar y Contacto.",
          "online-shop": "Los productos que usa en el salón, tarjetas regalo y paquetes de tratamientos.",
        },
        connections: "Reservas con recordatorios, lista de espera, tarjeta de cliente y chatbot.",
      },
      {
        id: "clinica",
        name: "Clínica",
        includes: {
          "landing-page": "Una especialidad o campaña, equipo, solicitud de cita y contactos claros.",
          website: "Inicio, Especialidades, Equipo médico, Convenios, Solicitud de cita y Contacto. Formularios sin datos de salud.",
          "online-shop": "Productos de cuidado, bonos de consulta y paquetes de sesiones pagados online.",
        },
        connections: "Reservas, recepcionista de voz con IA, chatbot y gestión de reseñas.",
      },
      {
        id: "ginasio",
        name: "Gimnasio o estudio",
        includes: {
          "landing-page": "Actividades, horario de clases, planes y solicitud de clase de prueba.",
          website: "Inicio, Actividades, Horario de clases, Precios y planes, Equipo, Clase de prueba y Contacto.",
          "online-shop": "Planes, bonos de clases, tarjetas regalo y merchandising.",
        },
        connections: "Reservas de clases, tarjeta de cliente y chatbot.",
      },
      {
        id: "alojamento",
        name: "Alojamiento turístico",
        includes: {
          "landing-page": "La casa, fotos, comodidades, la zona y solicitud de reserva, con el número de registro RNAL visible.",
          website: "Inicio, Alojamientos (una página cada uno), La zona, Solicitud de reserva, Condiciones y Contacto, en varios idiomas y con el RNAL.",
          "online-shop": "Vales de estancia, experiencias y productos de la región.",
        },
        connections: "Chatbot para las preguntas de los huéspedes y gestión de reseñas.",
      },
      {
        id: "loja",
        name: "Tienda",
        includes: {
          "landing-page": "Una apertura, una promoción o una colección nueva, con dirección, horario y WhatsApp.",
          website: "Inicio, Colecciones o Marcas, Quiénes somos, Visítenos y Contacto.",
          "online-shop": "Catálogo, ficha de producto, carrito, checkout y una página de envíos y devoluciones.",
        },
        connections: "Tarjeta de cliente, placas para reseñas y chatbot.",
      },
    ],
    extrasEyebrow: "Precio y opciones",
    extrasTitle: "Lo que queda fuera y lo que puede añadir",
    addOnsTitle: "Opciones adicionales",
    addOnsNote: "Importes sin IVA, orientativos. Solo entran en la propuesta si los elige.",
    notIncludedTitle: "No incluido",
    monthlyTitle: "Plan mensual",
    rulesEyebrow: "Normas y buenas prácticas",
    rulesTitle: "Lo básico legal y práctico, resuelto desde el principio",
    rules: [
      "Aviso de cookies en el que «Rechazar» es tan fácil como «Aceptar».",
      "Enlace bien visible al Libro de Reclamaciones Electrónico portugués.",
      "Datos de la empresa, precios e información al consumidor como exige la ley.",
      "Construida según las pautas de accesibilidad WCAG 2.1 AA.",
      "Dominio registrado a su nombre: la web es suya.",
      "Pago en dos partes: el 50 % al aceptar la propuesta y el 50 % antes de publicar.",
    ],
    shopRules: [
      "MB WAY, Multibanco y tarjeta, con su propia cuenta de pagos.",
      "Condiciones de venta, derecho de desistimiento de 14 días y política de devoluciones.",
    ],
    rulesNote:
      "Preparamos la estructura y los modelos de los textos legales. El contenido final lo valida usted, su gestor o su abogado.",
  },
  fr: {
    modelosEyebrow: "Modèles par secteur",
    modelosTitle: "Nous partons d'une base pensée pour votre activité",
    modelosLead:
      "Chaque secteur a un point de départ avec la structure et les connexions qui ont du sens. Ensuite, nous adaptons tout à votre marque : logo, couleurs, textes et photos.",
    modelosAll:
      "Tous les modèles comprennent : un bouton principal bien visible, contacts et WhatsApp, un plan, un lien vers vos vrais avis Google, un bandeau cookies, la confidentialité, le livre de réclamations, une mise en page pensée pour le mobile et l'accessibilité.",
    connectionsLabel: "Se connecte avec",
    modelos: [
      {
        id: "restaurante",
        name: "Restaurant ou café",
        includes: {
          "landing-page": "Temps forts, carte de saison, réservations, horaires et plan, vente à emporter et contacts.",
          website: "Accueil, Carte, Réservations, Événements et groupes, Galerie et Contact. Vente à emporter en option.",
          "online-shop": "Commandes à emporter, paniers garnis, gâteaux sur commande et bons cadeaux, avec heure de retrait.",
        },
        connections: "Menu digital, réservations, liste d'attente, carte de fidélité et plaques pour avis.",
      },
      {
        id: "beleza",
        name: "Barbier, coiffeur ou esthétique",
        includes: {
          "landing-page": "Prestations et tarifs, équipe, photos de réalisations et un bouton pour réserver.",
          website: "Accueil, Prestations et tarifs, Équipe, Réalisations, Réserver et Contact.",
          "online-shop": "Les produits que vous utilisez au salon, cartes cadeaux et forfaits de soins.",
        },
        connections: "Réservations avec rappels, liste d'attente, carte de fidélité et chatbot.",
      },
      {
        id: "clinica",
        name: "Clinique",
        includes: {
          "landing-page": "Une spécialité ou une campagne, l'équipe, une demande de rendez-vous et des contacts clairs.",
          website: "Accueil, Spécialités, Équipe médicale, Conventions, Demande de rendez-vous et Contact. Formulaires sans données de santé.",
          "online-shop": "Produits de soin, bons de consultation et forfaits de séances payés en ligne.",
        },
        connections: "Réservations, réceptionniste vocale IA, chatbot et gestion des avis.",
      },
      {
        id: "ginasio",
        name: "Salle de sport ou studio",
        includes: {
          "landing-page": "Activités, planning des cours, formules et demande de cours d'essai.",
          website: "Accueil, Activités, Planning des cours, Tarifs et formules, Équipe, Cours d'essai et Contact.",
          "online-shop": "Formules, cartes de cours, cartes cadeaux et produits dérivés.",
        },
        connections: "Réservation de cours, carte de fidélité et chatbot.",
      },
      {
        id: "alojamento",
        name: "Location de vacances",
        includes: {
          "landing-page": "Le logement, les photos, les équipements, le quartier et une demande de réservation, avec le numéro d'enregistrement RNAL visible.",
          website: "Accueil, Logements (une page chacun), Le quartier, Demande de réservation, Conditions et Contact, en plusieurs langues et avec le RNAL.",
          "online-shop": "Bons de séjour, expériences et produits de la région.",
        },
        connections: "Chatbot pour les questions des voyageurs et gestion des avis.",
      },
      {
        id: "loja",
        name: "Boutique",
        includes: {
          "landing-page": "Une ouverture, une promotion ou une nouvelle collection, avec adresse, horaires et WhatsApp.",
          website: "Accueil, Collections ou Marques, À propos, Nous rendre visite et Contact.",
          "online-shop": "Catalogue, fiche produit, panier, paiement et une page livraisons et retours.",
        },
        connections: "Carte de fidélité, plaques pour avis et chatbot.",
      },
    ],
    extrasEyebrow: "Prix et options",
    extrasTitle: "Ce qui n'est pas compris et ce que vous pouvez ajouter",
    addOnsTitle: "Options supplémentaires",
    addOnsNote: "Montants hors TVA, à titre indicatif. Ils n'entrent dans la proposition que si vous les choisissez.",
    notIncludedTitle: "Non compris",
    monthlyTitle: "Offre mensuelle",
    rulesEyebrow: "Règles et bonnes pratiques",
    rulesTitle: "Les bases légales et pratiques, prévues dès le départ",
    rules: [
      "Bandeau cookies où « Refuser » est aussi simple que « Accepter ».",
      "Lien bien visible vers le livre de réclamations électronique portugais.",
      "Identification de l'entreprise, prix et information du consommateur comme l'exige la loi.",
      "Construit selon les règles d'accessibilité WCAG 2.1 AA.",
      "Nom de domaine enregistré à votre nom : le site vous appartient.",
      "Paiement en deux fois : 50 % à l'acceptation et 50 % avant la mise en ligne.",
    ],
    shopRules: [
      "MB WAY, Multibanco et carte, avec votre propre compte de paiement.",
      "Conditions de vente, droit de rétractation de 14 jours et politique de retours.",
    ],
    rulesNote:
      "Nous préparons la structure et les modèles des textes légaux. Le contenu final est validé par vous, votre comptable ou votre avocat.",
  },
  de: {
    modelosEyebrow: "Vorlagen nach Branche",
    modelosTitle: "Wir starten mit einer Basis, die zu Ihrem Unternehmen passt",
    modelosLead:
      "Jede Branche hat einen Ausgangspunkt mit der Struktur und den Verbindungen, die Sinn ergeben. Danach passen wir alles an Ihre Marke an: Logo, Farben, Texte und Fotos.",
    modelosAll:
      "Alle Vorlagen enthalten: einen gut sichtbaren Hauptbutton, Kontakt und WhatsApp, eine Karte, einen Link zu Ihren echten Google-Bewertungen, Cookie-Banner, Datenschutz, Beschwerdebuch, ein Layout fürs Handy und Barrierefreiheit.",
    connectionsLabel: "Verbindet sich mit",
    modelos: [
      {
        id: "restaurante",
        name: "Restaurant oder Café",
        includes: {
          "landing-page": "Highlights, Saisonkarte, Reservierungen, Öffnungszeiten und Karte, Essen zum Mitnehmen und Kontakt.",
          website: "Start, Speisekarte, Reservierungen, Events und Gruppen, Galerie und Kontakt. Essen zum Mitnehmen optional.",
          "online-shop": "Bestellungen zum Abholen, Geschenkkörbe, Torten auf Bestellung und Gutscheine, mit Abholzeit.",
        },
        connections: "Digitale Speisekarte, Reservierungen, Warteliste, Kundenkarte und Bewertungsschilder.",
      },
      {
        id: "beleza",
        name: "Barbershop, Friseur oder Kosmetik",
        includes: {
          "landing-page": "Leistungen und Preise, Team, Fotos Ihrer Arbeiten und ein Button zum Buchen.",
          website: "Start, Leistungen und Preise, Team, Galerie, Termin buchen und Kontakt.",
          "online-shop": "Die Produkte, die Sie im Salon verwenden, Geschenkkarten und Behandlungspakete.",
        },
        connections: "Reservierungen mit Erinnerungen, Warteliste, Kundenkarte und Chatbot.",
      },
      {
        id: "clinica",
        name: "Klinik oder Praxis",
        includes: {
          "landing-page": "Ein Fachbereich oder eine Kampagne, Team, Terminanfrage und klare Kontaktdaten.",
          website: "Start, Fachbereiche, Ärzteteam, Versicherungspartner, Terminanfrage und Kontakt. Formulare ohne Gesundheitsdaten.",
          "online-shop": "Pflegeprodukte, Gutscheine für Termine und Behandlungspakete, online bezahlt.",
        },
        connections: "Reservierungen, KI-Telefonrezeption, Chatbot und Bewertungsmanagement.",
      },
      {
        id: "ginasio",
        name: "Fitnessstudio oder Studio",
        includes: {
          "landing-page": "Kursangebot, Kursplan, Tarife und Anfrage für ein Probetraining.",
          website: "Start, Kursangebot, Kursplan, Preise und Tarife, Team, Probetraining und Kontakt.",
          "online-shop": "Tarife, Kurspakete, Geschenkkarten und Merchandise.",
        },
        connections: "Kursbuchungen, Kundenkarte und Chatbot.",
      },
      {
        id: "alojamento",
        name: "Ferienunterkunft",
        includes: {
          "landing-page": "Die Unterkunft, Fotos, Ausstattung, die Umgebung und eine Buchungsanfrage, mit sichtbarer RNAL-Registrierungsnummer.",
          website: "Start, Unterkünfte (je eine Seite), Die Umgebung, Buchungsanfrage, Bedingungen und Kontakt, in mehreren Sprachen und mit der RNAL-Nummer.",
          "online-shop": "Aufenthaltsgutscheine, Erlebnisse und Produkte aus der Region.",
        },
        connections: "Chatbot für Fragen der Gäste und Bewertungsmanagement.",
      },
      {
        id: "loja",
        name: "Geschäft",
        includes: {
          "landing-page": "Eine Eröffnung, eine Aktion oder eine neue Kollektion, mit Adresse, Öffnungszeiten und WhatsApp.",
          website: "Start, Kollektionen oder Marken, Über uns, Besuchen Sie uns und Kontakt.",
          "online-shop": "Katalog, Produktseite, Warenkorb, Kasse und eine Seite zu Versand und Rücksendungen.",
        },
        connections: "Kundenkarte, Bewertungsschilder und Chatbot.",
      },
    ],
    extrasEyebrow: "Preis und Optionen",
    extrasTitle: "Was nicht enthalten ist und was Sie hinzufügen können",
    addOnsTitle: "Zusätzliche Optionen",
    addOnsNote: "Beträge zzgl. MwSt., Richtwerte. Sie kommen nur ins Angebot, wenn Sie sie wählen.",
    notIncludedTitle: "Nicht enthalten",
    monthlyTitle: "Monatsplan",
    rulesEyebrow: "Regeln und gute Praxis",
    rulesTitle: "Das rechtliche und praktische Fundament, von Anfang an",
    rules: [
      "Cookie-Banner, bei dem „Ablehnen“ so einfach ist wie „Akzeptieren“.",
      "Gut sichtbarer Link zum portugiesischen elektronischen Beschwerdebuch.",
      "Firmenangaben, Preise und Verbraucherinformationen, wie gesetzlich vorgeschrieben.",
      "Gebaut nach den Barrierefreiheitsrichtlinien WCAG 2.1 AA.",
      "Domain auf Ihren Namen registriert: Die Website gehört Ihnen.",
      "Zahlung in zwei Teilen: 50 % bei Auftragserteilung und 50 % vor der Veröffentlichung.",
    ],
    shopRules: [
      "MB WAY, Multibanco und Karte, mit Ihrem eigenen Zahlungskonto.",
      "Verkaufsbedingungen, 14-tägiges Widerrufsrecht und Rückgaberichtlinie.",
    ],
    rulesNote:
      "Wir bereiten die Struktur und die Vorlagen für die Rechtstexte vor. Den endgültigen Inhalt prüfen Sie, Ihr Steuerberater oder Ihr Anwalt.",
  },
  it: {
    modelosEyebrow: "Modelli per settore",
    modelosTitle: "Partiamo da una base pensata per la vostra attività",
    modelosLead:
      "Ogni settore ha un punto di partenza con la struttura e i collegamenti che hanno senso. Poi adattiamo tutto al vostro marchio: logo, colori, testi e foto.",
    modelosAll:
      "Tutti i modelli includono: un pulsante principale ben visibile, contatti e WhatsApp, mappa, collegamento alle vostre vere recensioni Google, banner dei cookie, privacy, Libro dei reclami, impaginazione pensata per lo smartphone e accessibilità.",
    connectionsLabel: "Si collega con",
    modelos: [
      {
        id: "restaurante",
        name: "Ristorante o bar",
        includes: {
          "landing-page": "In evidenza, menù stagionale, prenotazioni, orari e mappa, asporto e contatti.",
          website: "Home, Menù, Prenotazioni, Eventi e gruppi, Galleria e Contatti. Asporto opzionale.",
          "online-shop": "Ordini da ritirare, cesti regalo, torte su ordinazione e buoni regalo, con orario di ritiro.",
        },
        connections: "Menù digitale, prenotazioni, lista d'attesa, carta fedeltà e targhe per recensioni.",
      },
      {
        id: "beleza",
        name: "Barbiere, parrucchiere o estetica",
        includes: {
          "landing-page": "Servizi e prezzi, staff, foto dei lavori e un pulsante per prenotare.",
          website: "Home, Servizi e prezzi, Staff, Galleria dei lavori, Prenota e Contatti.",
          "online-shop": "I prodotti che usate in salone, carte regalo e pacchetti di trattamenti.",
        },
        connections: "Prenotazioni con promemoria, lista d'attesa, carta fedeltà e chatbot.",
      },
      {
        id: "clinica",
        name: "Clinica",
        includes: {
          "landing-page": "Una specialità o una campagna, l'équipe, la richiesta di appuntamento e contatti chiari.",
          website: "Home, Specialità, Équipe medica, Convenzioni, Richiesta di visita e Contatti. Moduli senza dati sanitari.",
          "online-shop": "Prodotti per la cura, buoni per visite e pacchetti di sedute pagati online.",
        },
        connections: "Prenotazioni, receptionist vocale con IA, chatbot e gestione delle recensioni.",
      },
      {
        id: "ginasio",
        name: "Palestra o studio",
        includes: {
          "landing-page": "Discipline, orario dei corsi, abbonamenti e richiesta di lezione di prova.",
          website: "Home, Discipline, Orario dei corsi, Prezzi e abbonamenti, Staff, Lezione di prova e Contatti.",
          "online-shop": "Abbonamenti, pacchetti di lezioni, carte regalo e merchandising.",
        },
        connections: "Prenotazione dei corsi, carta fedeltà e chatbot.",
      },
      {
        id: "alojamento",
        name: "Casa vacanza",
        includes: {
          "landing-page": "La casa, le foto, i servizi, la zona e la richiesta di prenotazione, con il numero di registrazione RNAL in vista.",
          website: "Home, Alloggi (una pagina ciascuno), La zona, Richiesta di prenotazione, Condizioni e Contatti, in più lingue e con il RNAL.",
          "online-shop": "Buoni soggiorno, esperienze e prodotti del territorio.",
        },
        connections: "Chatbot per le domande degli ospiti e gestione delle recensioni.",
      },
      {
        id: "loja",
        name: "Negozio",
        includes: {
          "landing-page": "Un'inaugurazione, una promozione o una nuova collezione, con indirizzo, orari e WhatsApp.",
          website: "Home, Collezioni o Marchi, Chi siamo, Venite a trovarci e Contatti.",
          "online-shop": "Catalogo, scheda prodotto, carrello, checkout e una pagina su spedizioni e resi.",
        },
        connections: "Carta fedeltà, targhe per recensioni e chatbot.",
      },
    ],
    extrasEyebrow: "Prezzo e opzioni",
    extrasTitle: "Cosa resta fuori e cosa potete aggiungere",
    addOnsTitle: "Opzioni extra",
    addOnsNote: "Importi IVA esclusa, indicativi. Entrano nella proposta solo se li scegliete.",
    notIncludedTitle: "Non incluso",
    monthlyTitle: "Piano mensile",
    rulesEyebrow: "Regole e buone pratiche",
    rulesTitle: "Le basi legali e pratiche, sistemate fin dall'inizio",
    rules: [
      "Banner dei cookie in cui «Rifiuta» è facile quanto «Accetta».",
      "Collegamento ben visibile al Libro dei reclami elettronico portoghese.",
      "Dati dell'azienda e prezzi con IVA, come richiesto dalla legge.",
      "Realizzato secondo le linee guida di accessibilità WCAG 2.1 AA.",
      "Dominio registrato a vostro nome: il sito è vostro.",
      "Pagamento in due parti: 50% all'accettazione e 50% prima della pubblicazione.",
    ],
    shopRules: [
      "MB WAY, Multibanco e carta, con il vostro conto pagamenti.",
      "Condizioni di vendita, diritto di recesso di 14 giorni e politica dei resi.",
    ],
    rulesNote:
      "Prepariamo la struttura e i modelli dei testi legali. Il contenuto finale lo verificate voi, il vostro commercialista o il vostro avvocato.",
  },
};

export function isWebProductId(id: ProductId): id is WebProductId {
  return id === "landing-page" || id === "website" || id === "online-shop";
}

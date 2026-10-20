import type { Localized } from "@/lib/i18n";

export type FormField =
  | "name"
  | "email"
  | "phone"
  | "businessName"
  | "sector"
  | "message"
  | "consent"
  | "productId"
  | "slotStart"
  | "kind";

export interface FormCopy {
  labels: Record<Exclude<FormField, "slotStart">, string>;
  placeholders: { name: string; email: string; phone: string; businessName: string; message: string };
  optional: string;
  productUndecided: string;
  sectorPlaceholder: string;
  sectorOther: string;
  consentBefore: string;
  consentLink: string;
  consentAfter: string;
  fieldErrors: Record<FormField, string>;
  genericError: string;
  unavailableError: string;
  rateLimitedError: string;
  sending: string;
  honeypotLabel: string;
}

export interface BookingCopy {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  lead: string;
  perks: string[];
  steps: { choose: string; details: string; done: string };
  stepLabel: string;
  productLabel: string;
  dateLabel: string;
  timeLabel: string;
  timeZoneNote: string;
  pickDateFirst: string;
  noSlotsOnDay: string;
  noSlotsAtAll: string;
  previousMonth: string;
  nextMonth: string;
  weekdaysShort: string[];
  available: string;
  continue: string;
  back: string;
  change: string;
  submit: string;
  summaryTitle: string;
  demoTitle: string;
  slotTaken: string;
  unavailableTitle: string;
  unavailableBody: string;
  unavailableCta: string;
  success: {
    title: string;
    body: string;
    addToCalendar: string;
    googleCalendar: string;
    icsFileName: string;
    eventTitle: string;
    eventDescription: string;
    another: string;
    home: string;
  };
  form: FormCopy;
}

export interface InfoRequestCopy {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  lead: string;
  kinds: { info_request: { title: string; body: string }; waitlist: { title: string; body: string } };
  kindLegend: string;
  submit: string;
  preferDemo: string;
  preferDemoCta: string;
  unavailableTitle: string;
  unavailableBody: string;
  success: { title: string; body: string; home: string; book: string };
  form: FormCopy;
}

const ptForm: FormCopy = {
  labels: {
    name: "Nome",
    email: "Email",
    phone: "Telemóvel",
    businessName: "Nome do negócio",
    sector: "Setor",
    message: "Mensagem",
    consent: "Consentimento",
    productId: "Produto",
    kind: "Tipo de pedido",
  },
  placeholders: {
    name: "O seu nome",
    email: "nome@empresa.pt",
    phone: "+351 912 345 678",
    businessName: "Ex.: Café Central",
    message: "Conte-nos um pouco sobre o seu negócio e o que gostava de melhorar.",
  },
  optional: "opcional",
  productUndecided: "Ainda não sei / várias soluções",
  sectorPlaceholder: "Escolha o setor",
  sectorOther: "Outro",
  consentBefore: "Aceito que a Steevanz trate os meus dados para responder a este pedido, de acordo com a ",
  consentLink: "Política de Privacidade",
  consentAfter: ".",
  fieldErrors: {
    name: "Indique o seu nome.",
    email: "Indique um email válido.",
    phone: "Indique um número de telemóvel válido.",
    businessName: "O nome do negócio é demasiado longo.",
    sector: "Escolha um setor válido.",
    message: "A mensagem é demasiado longa (máximo 2000 caracteres).",
    consent: "Precisamos do seu consentimento para continuar.",
    productId: "Escolha um produto válido.",
    slotStart: "Escolha um dia e uma hora.",
    kind: "Escolha o tipo de pedido.",
  },
  genericError: "Não foi possível enviar o pedido. Tente novamente dentro de momentos.",
  unavailableError: "O serviço está temporariamente indisponível. Contacte-nos por email ou WhatsApp.",
  rateLimitedError: "Recebemos vários pedidos seguidos a partir desta ligação. Aguarde alguns minutos e tente novamente.",
  sending: "A enviar…",
  honeypotLabel: "Não preencha este campo",
};

const enForm: FormCopy = {
  labels: {
    name: "Name",
    email: "Email",
    phone: "Mobile phone",
    businessName: "Business name",
    sector: "Sector",
    message: "Message",
    consent: "Consent",
    productId: "Product",
    kind: "Request type",
  },
  placeholders: {
    name: "Your name",
    email: "name@company.com",
    phone: "+351 912 345 678",
    businessName: "e.g. Café Central",
    message: "Tell us a little about your business and what you would like to improve.",
  },
  optional: "optional",
  productUndecided: "Not sure yet / several solutions",
  sectorPlaceholder: "Choose your sector",
  sectorOther: "Other",
  consentBefore: "I agree that Steevanz may process my data to reply to this request, in line with the ",
  consentLink: "Privacy Policy",
  consentAfter: ".",
  fieldErrors: {
    name: "Please enter your name.",
    email: "Please enter a valid email address.",
    phone: "Please enter a valid phone number.",
    businessName: "The business name is too long.",
    sector: "Please choose a valid sector.",
    message: "The message is too long (2000 characters max).",
    consent: "We need your consent to continue.",
    productId: "Please choose a valid product.",
    slotStart: "Please choose a day and time.",
    kind: "Please choose a request type.",
  },
  genericError: "We couldn't send your request. Please try again in a moment.",
  unavailableError: "The service is temporarily unavailable. Please contact us by email or WhatsApp.",
  rateLimitedError: "We received several requests in a row from this connection. Please wait a few minutes and try again.",
  sending: "Sending…",
  honeypotLabel: "Leave this field empty",
};

const esForm: FormCopy = {
  labels: {
    name: "Nombre",
    email: "Email",
    phone: "Móvil",
    businessName: "Nombre del negocio",
    sector: "Sector",
    message: "Mensaje",
    consent: "Consentimiento",
    productId: "Producto",
    kind: "Tipo de solicitud",
  },
  placeholders: {
    name: "Su nombre",
    email: "nombre@empresa.com",
    phone: "+351 912 345 678",
    businessName: "p. ej. Café Central",
    message: "Cuéntenos un poco sobre su negocio y lo que le gustaría mejorar.",
  },
  optional: "opcional",
  productUndecided: "Aún no lo sé / varias soluciones",
  sectorPlaceholder: "Elija su sector",
  sectorOther: "Otro",
  consentBefore: "Acepto que Steevanz trate mis datos para responder a esta solicitud, de acuerdo con la ",
  consentLink: "Política de privacidad",
  consentAfter: ".",
  fieldErrors: {
    name: "Indique su nombre.",
    email: "Indique un email válido.",
    phone: "Indique un número de teléfono válido.",
    businessName: "El nombre del negocio es demasiado largo.",
    sector: "Elija un sector válido.",
    message: "El mensaje es demasiado largo (máximo 2000 caracteres).",
    consent: "Necesitamos su consentimiento para continuar.",
    productId: "Elija un producto válido.",
    slotStart: "Elija un día y una hora.",
    kind: "Elija un tipo de solicitud.",
  },
  genericError: "No hemos podido enviar su solicitud. Inténtelo de nuevo dentro de un momento.",
  unavailableError: "El servicio no está disponible en este momento. Contáctenos por email o WhatsApp.",
  rateLimitedError: "Hemos recibido varias solicitudes seguidas desde esta conexión. Espere unos minutos y vuelva a intentarlo.",
  sending: "Enviando…",
  honeypotLabel: "Deje este campo vacío",
};

const frForm: FormCopy = {
  labels: {
    name: "Nom",
    email: "E-mail",
    phone: "Téléphone portable",
    businessName: "Nom de l'établissement",
    sector: "Secteur",
    message: "Message",
    consent: "Consentement",
    productId: "Produit",
    kind: "Type de demande",
  },
  placeholders: {
    name: "Votre nom",
    email: "nom@entreprise.com",
    phone: "+351 912 345 678",
    businessName: "ex. Café Central",
    message: "Parlez-nous un peu de votre activité et de ce que vous aimeriez améliorer.",
  },
  optional: "facultatif",
  productUndecided: "Je ne sais pas encore / plusieurs solutions",
  sectorPlaceholder: "Choisissez votre secteur",
  sectorOther: "Autre",
  consentBefore: "J'accepte que Steevanz traite mes données pour répondre à cette demande, conformément à la ",
  consentLink: "Politique de confidentialité",
  consentAfter: ".",
  fieldErrors: {
    name: "Indiquez votre nom.",
    email: "Indiquez une adresse e-mail valide.",
    phone: "Indiquez un numéro de téléphone valide.",
    businessName: "Le nom de l'établissement est trop long.",
    sector: "Choisissez un secteur valide.",
    message: "Le message est trop long (2000 caractères maximum).",
    consent: "Nous avons besoin de votre consentement pour continuer.",
    productId: "Choisissez un produit valide.",
    slotStart: "Choisissez un jour et une heure.",
    kind: "Choisissez un type de demande.",
  },
  genericError: "Nous n'avons pas pu envoyer votre demande. Réessayez dans un instant.",
  unavailableError: "Le service est momentanément indisponible. Contactez-nous par e-mail ou WhatsApp.",
  rateLimitedError: "Nous avons reçu plusieurs demandes d'affilée depuis cette connexion. Patientez quelques minutes et réessayez.",
  sending: "Envoi…",
  honeypotLabel: "Laissez ce champ vide",
};

const deForm: FormCopy = {
  labels: {
    name: "Name",
    email: "E-Mail",
    phone: "Handynummer",
    businessName: "Name des Betriebs",
    sector: "Branche",
    message: "Nachricht",
    consent: "Einwilligung",
    productId: "Produkt",
    kind: "Art der Anfrage",
  },
  placeholders: {
    name: "Ihr Name",
    email: "name@firma.de",
    phone: "+351 912 345 678",
    businessName: "z. B. Café Central",
    message: "Erzählen Sie uns kurz von Ihrem Betrieb und was Sie verbessern möchten.",
  },
  optional: "optional",
  productUndecided: "Noch unentschieden / mehrere Lösungen",
  sectorPlaceholder: "Wählen Sie Ihre Branche",
  sectorOther: "Andere",
  consentBefore: "Ich bin einverstanden, dass Steevanz meine Daten zur Beantwortung dieser Anfrage verarbeitet, gemäß der ",
  consentLink: "Datenschutzerklärung",
  consentAfter: ".",
  fieldErrors: {
    name: "Bitte geben Sie Ihren Namen ein.",
    email: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
    phone: "Bitte geben Sie eine gültige Telefonnummer ein.",
    businessName: "Der Name des Betriebs ist zu lang.",
    sector: "Bitte wählen Sie eine gültige Branche.",
    message: "Die Nachricht ist zu lang (höchstens 2000 Zeichen).",
    consent: "Wir brauchen Ihre Einwilligung, um fortzufahren.",
    productId: "Bitte wählen Sie ein gültiges Produkt.",
    slotStart: "Bitte wählen Sie Tag und Uhrzeit.",
    kind: "Bitte wählen Sie die Art der Anfrage.",
  },
  genericError: "Ihre Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es gleich noch einmal.",
  unavailableError: "Der Dienst ist vorübergehend nicht verfügbar. Bitte kontaktieren Sie uns per E-Mail oder WhatsApp.",
  rateLimitedError: "Wir haben von dieser Verbindung mehrere Anfragen hintereinander erhalten. Bitte warten Sie ein paar Minuten und versuchen Sie es dann erneut.",
  sending: "Wird gesendet…",
  honeypotLabel: "Dieses Feld leer lassen",
};

const itForm: FormCopy = {
  labels: {
    name: "Nome",
    email: "Email",
    phone: "Cellulare",
    businessName: "Nome dell'attività",
    sector: "Settore",
    message: "Messaggio",
    consent: "Consenso",
    productId: "Prodotto",
    kind: "Tipo di richiesta",
  },
  placeholders: {
    name: "Il vostro nome",
    email: "nome@azienda.it",
    phone: "+351 912 345 678",
    businessName: "es. Café Central",
    message: "Raccontateci qualcosa della vostra attività e di cosa vorreste migliorare.",
  },
  optional: "facoltativo",
  productUndecided: "Non lo so ancora / più soluzioni",
  sectorPlaceholder: "Scegliete il vostro settore",
  sectorOther: "Altro",
  consentBefore: "Acconsento al trattamento dei miei dati da parte di Steevanz per rispondere a questa richiesta, secondo l'",
  consentLink: "Informativa sulla privacy",
  consentAfter: ".",
  fieldErrors: {
    name: "Inserite il vostro nome.",
    email: "Inserite un indirizzo email valido.",
    phone: "Inserite un numero di telefono valido.",
    businessName: "Il nome dell'attività è troppo lungo.",
    sector: "Scegliete un settore valido.",
    message: "Il messaggio è troppo lungo (massimo 2000 caratteri).",
    consent: "Abbiamo bisogno del vostro consenso per continuare.",
    productId: "Scegliete un prodotto valido.",
    slotStart: "Scegliete un giorno e un orario.",
    kind: "Scegliete un tipo di richiesta.",
  },
  genericError: "Non siamo riusciti a inviare la richiesta. Riprovate tra un momento.",
  unavailableError: "Il servizio è temporaneamente non disponibile. Contattateci via email o WhatsApp.",
  rateLimitedError: "Abbiamo ricevuto diverse richieste di fila da questa connessione. Attendete qualche minuto e riprovate.",
  sending: "Invio in corso…",
  honeypotLabel: "Lasciate vuoto questo campo",
};

export const bookingCopy: Localized<BookingCopy> = {
  pt: {
    metaTitle: "Agendar demonstração gratuita | Steevanz",
    metaDescription:
      "Escolha o dia e a hora para uma demonstração sem compromisso das placas e soluções de IA da Steevanz para o seu negócio.",
    eyebrow: "Demonstração gratuita",
    title: "Veja como funciona, no seu negócio.",
    lead: "Escolha um horário que lhe dê jeito. Mostramos a solução com exemplos do seu setor e respondemos a todas as dúvidas, sem compromisso.",
    perks: [
      "Cerca de 30 minutos, por videochamada ou telefone",
      "Sem compromisso e sem custos",
      "Exemplos reais do seu setor",
    ],
    steps: { choose: "Dia e hora", details: "Os seus dados", done: "Confirmado" },
    stepLabel: "Passo {current} de {total}",
    productLabel: "Que solução quer conhecer?",
    dateLabel: "Escolha o dia",
    timeLabel: "Escolha a hora",
    timeZoneNote: "Horas de Portugal continental (Lisboa).",
    pickDateFirst: "Escolha primeiro um dia no calendário.",
    noSlotsOnDay: "Não há horários livres neste dia.",
    noSlotsAtAll: "De momento não há horários disponíveis. Deixe-nos um pedido de informação e entramos em contacto.",
    previousMonth: "Mês anterior",
    nextMonth: "Mês seguinte",
    weekdaysShort: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
    available: "com horários livres",
    continue: "Continuar",
    back: "Voltar",
    change: "Alterar",
    submit: "Confirmar marcação",
    summaryTitle: "A sua demonstração",
    demoTitle: "Demonstração Steevanz",
    slotTaken: "Esse horário acabou de ser reservado. Escolha outro, por favor.",
    unavailableTitle: "O agendamento online está temporariamente indisponível",
    unavailableBody: "Pedimos desculpa pelo incómodo. Pode pedir a demonstração por email ou WhatsApp e respondemos no mesmo dia útil.",
    unavailableCta: "Pedir informação",
    success: {
      title: "Demonstração marcada!",
      body: "Obrigado. Recebemos o seu pedido e vamos entrar em contacto para confirmar os detalhes da chamada.",
      addToCalendar: "Adicionar ao calendário (.ics)",
      googleCalendar: "Google Calendar",
      icsFileName: "demonstracao-steevanz.ics",
      eventTitle: "Demonstração Steevanz",
      eventDescription: "Demonstração das soluções Steevanz. Entraremos em contacto para confirmar os detalhes.",
      another: "Marcar outra",
      home: "Voltar ao início",
    },
    form: ptForm,
  },
  en: {
    metaTitle: "Book a free demo | Steevanz",
    metaDescription:
      "Pick a day and time for a no-obligation demo of Steevanz plates and AI solutions for your business.",
    eyebrow: "Free demo",
    title: "See how it works, in your business.",
    lead: "Pick a time that suits you. We'll walk you through the solution with examples from your sector and answer every question, with no obligation.",
    perks: ["About 30 minutes, by video call or phone", "No obligation, no cost", "Real examples from your sector"],
    steps: { choose: "Day and time", details: "Your details", done: "Confirmed" },
    stepLabel: "Step {current} of {total}",
    productLabel: "Which solution would you like to see?",
    dateLabel: "Choose a day",
    timeLabel: "Choose a time",
    timeZoneNote: "Times shown in Lisbon time (Portugal).",
    pickDateFirst: "Pick a day in the calendar first.",
    noSlotsOnDay: "No free times on this day.",
    noSlotsAtAll: "There are no times available right now. Send us an info request and we'll get in touch.",
    previousMonth: "Previous month",
    nextMonth: "Next month",
    weekdaysShort: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    available: "has free times",
    continue: "Continue",
    back: "Back",
    change: "Change",
    submit: "Confirm booking",
    summaryTitle: "Your demo",
    demoTitle: "Steevanz demo",
    slotTaken: "That time was just booked. Please choose another one.",
    unavailableTitle: "Online booking is temporarily unavailable",
    unavailableBody: "Sorry about that. You can ask for a demo by email or WhatsApp and we'll reply the same working day.",
    unavailableCta: "Request info",
    success: {
      title: "Your demo is booked!",
      body: "Thank you. We've received your request and will be in touch to confirm the call details.",
      addToCalendar: "Add to calendar (.ics)",
      googleCalendar: "Google Calendar",
      icsFileName: "steevanz-demo.ics",
      eventTitle: "Steevanz demo",
      eventDescription: "Demo of Steevanz solutions. We'll be in touch to confirm the details.",
      another: "Book another",
      home: "Back to home",
    },
    form: enForm,
  },
  es: {
    metaTitle: "Reserve una demostración gratuita | Steevanz",
    metaDescription: "Elija día y hora para una demostración sin compromiso de las placas y las soluciones de IA de Steevanz para su negocio.",
    eyebrow: "Demostración gratuita",
    title: "Vea cómo funciona, en su negocio.",
    lead: "Elija el momento que mejor le venga. Le enseñamos la solución con ejemplos de su sector y respondemos a todas sus preguntas, sin compromiso.",
    perks: ["Unos 30 minutos, por videollamada o teléfono", "Sin compromiso y sin coste", "Ejemplos reales de su sector"],
    steps: { choose: "Día y hora", details: "Sus datos", done: "Confirmada" },
    stepLabel: "Paso {current} de {total}",
    productLabel: "¿Qué solución le gustaría ver?",
    dateLabel: "Elija un día",
    timeLabel: "Elija una hora",
    timeZoneNote: "Horas en hora de Lisboa (Portugal).",
    pickDateFirst: "Primero elija un día en el calendario.",
    noSlotsOnDay: "No hay horas libres este día.",
    noSlotsAtAll: "Ahora mismo no hay horas disponibles. Envíenos una solicitud de información y nos pondremos en contacto.",
    previousMonth: "Mes anterior",
    nextMonth: "Mes siguiente",
    weekdaysShort: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
    available: "tiene horas libres",
    continue: "Continuar",
    back: "Atrás",
    change: "Cambiar",
    submit: "Confirmar reserva",
    summaryTitle: "Su demostración",
    demoTitle: "Demostración Steevanz",
    slotTaken: "Esa hora se acaba de reservar. Elija otra, por favor.",
    unavailableTitle: "La reserva online no está disponible en este momento",
    unavailableBody: "Disculpe las molestias. Puede pedir una demostración por email o WhatsApp y le responderemos el mismo día laborable.",
    unavailableCta: "Pedir información",
    success: {
      title: "¡Su demostración está reservada!",
      body: "Gracias. Hemos recibido su solicitud y nos pondremos en contacto para confirmar los detalles de la llamada.",
      addToCalendar: "Añadir al calendario (.ics)",
      googleCalendar: "Google Calendar",
      icsFileName: "steevanz-demostracion.ics",
      eventTitle: "Demostración Steevanz",
      eventDescription: "Demostración de las soluciones Steevanz. Nos pondremos en contacto para confirmar los detalles.",
      another: "Reservar otra",
      home: "Volver al inicio",
    },
    form: esForm,
  },
  fr: {
    metaTitle: "Réservez une démo gratuite | Steevanz",
    metaDescription: "Choisissez le jour et l'heure d'une démo sans engagement des plaques et solutions d'IA Steevanz pour votre activité.",
    eyebrow: "Démo gratuite",
    title: "Voyez comment ça marche, chez vous.",
    lead: "Choisissez le moment qui vous convient. Nous vous présentons la solution avec des exemples de votre secteur et répondons à toutes vos questions, sans engagement.",
    perks: ["Environ 30 minutes, en visio ou par téléphone", "Sans engagement, sans frais", "Des exemples réels de votre secteur"],
    steps: { choose: "Jour et heure", details: "Vos coordonnées", done: "Confirmée" },
    stepLabel: "Étape {current} sur {total}",
    productLabel: "Quelle solution aimeriez-vous voir ?",
    dateLabel: "Choisissez un jour",
    timeLabel: "Choisissez une heure",
    timeZoneNote: "Heures indiquées à l'heure de Lisbonne (Portugal).",
    pickDateFirst: "Choisissez d'abord un jour dans le calendrier.",
    noSlotsOnDay: "Aucun créneau libre ce jour-là.",
    noSlotsAtAll: "Aucun créneau n'est disponible pour le moment. Envoyez-nous une demande d'informations et nous vous recontacterons.",
    previousMonth: "Mois précédent",
    nextMonth: "Mois suivant",
    weekdaysShort: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
    available: "a des créneaux libres",
    continue: "Continuer",
    back: "Retour",
    change: "Modifier",
    submit: "Confirmer la réservation",
    summaryTitle: "Votre démo",
    demoTitle: "Démo Steevanz",
    slotTaken: "Ce créneau vient d'être réservé. Choisissez-en un autre, s'il vous plaît.",
    unavailableTitle: "La réservation en ligne est momentanément indisponible",
    unavailableBody: "Toutes nos excuses. Vous pouvez demander une démo par e-mail ou WhatsApp et nous vous répondrons le jour ouvré même.",
    unavailableCta: "Demander des informations",
    success: {
      title: "Votre démo est réservée !",
      body: "Merci. Nous avons bien reçu votre demande et vous recontacterons pour confirmer les détails de l'appel.",
      addToCalendar: "Ajouter au calendrier (.ics)",
      googleCalendar: "Google Agenda",
      icsFileName: "steevanz-demo.ics",
      eventTitle: "Démo Steevanz",
      eventDescription: "Démo des solutions Steevanz. Nous vous recontacterons pour confirmer les détails.",
      another: "Réserver une autre démo",
      home: "Retour à l'accueil",
    },
    form: frForm,
  },
  de: {
    metaTitle: "Kostenlose Demo vereinbaren | Steevanz",
    metaDescription: "Wählen Sie Tag und Uhrzeit für eine unverbindliche Demo der Steevanz-Schilder und KI-Lösungen für Ihren Betrieb.",
    eyebrow: "Kostenlose Demo",
    title: "Sehen Sie, wie es in Ihrem Betrieb funktioniert.",
    lead: "Wählen Sie einen passenden Termin. Wir zeigen Ihnen die Lösung mit Beispielen aus Ihrer Branche und beantworten alle Fragen, unverbindlich.",
    perks: ["Etwa 30 Minuten, per Videoanruf oder Telefon", "Unverbindlich und kostenlos", "Echte Beispiele aus Ihrer Branche"],
    steps: { choose: "Tag und Uhrzeit", details: "Ihre Daten", done: "Bestätigt" },
    stepLabel: "Schritt {current} von {total}",
    productLabel: "Welche Lösung möchten Sie sehen?",
    dateLabel: "Tag wählen",
    timeLabel: "Uhrzeit wählen",
    timeZoneNote: "Uhrzeiten in Lissabonner Zeit (Portugal).",
    pickDateFirst: "Wählen Sie zuerst einen Tag im Kalender.",
    noSlotsOnDay: "An diesem Tag sind keine Termine frei.",
    noSlotsAtAll: "Im Moment sind keine Termine frei. Schicken Sie uns eine Infoanfrage, und wir melden uns bei Ihnen.",
    previousMonth: "Vorheriger Monat",
    nextMonth: "Nächster Monat",
    weekdaysShort: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
    available: "hat freie Termine",
    continue: "Weiter",
    back: "Zurück",
    change: "Ändern",
    submit: "Termin bestätigen",
    summaryTitle: "Ihre Demo",
    demoTitle: "Steevanz-Demo",
    slotTaken: "Dieser Termin wurde gerade vergeben. Bitte wählen Sie einen anderen.",
    unavailableTitle: "Die Online-Terminbuchung ist vorübergehend nicht verfügbar",
    unavailableBody: "Das tut uns leid. Sie können eine Demo per E-Mail oder WhatsApp anfragen, und wir antworten am selben Werktag.",
    unavailableCta: "Infos anfordern",
    success: {
      title: "Ihre Demo ist gebucht!",
      body: "Vielen Dank. Wir haben Ihre Anfrage erhalten und melden uns, um die Details des Gesprächs zu bestätigen.",
      addToCalendar: "Zum Kalender hinzufügen (.ics)",
      googleCalendar: "Google Kalender",
      icsFileName: "steevanz-demo.ics",
      eventTitle: "Steevanz-Demo",
      eventDescription: "Demo der Steevanz-Lösungen. Wir melden uns, um die Details zu bestätigen.",
      another: "Weiteren Termin buchen",
      home: "Zur Startseite",
    },
    form: deForm,
  },
  it: {
    metaTitle: "Prenotate una demo gratuita | Steevanz",
    metaDescription: "Scegliete giorno e ora per una demo senza impegno delle targhe e delle soluzioni di IA di Steevanz per la vostra attività.",
    eyebrow: "Demo gratuita",
    title: "Guardate come funziona, nella vostra attività.",
    lead: "Scegliete il momento che preferite. Vi mostriamo la soluzione con esempi del vostro settore e rispondiamo a tutte le domande, senza impegno.",
    perks: ["Circa 30 minuti, in videochiamata o al telefono", "Senza impegno e senza costi", "Esempi reali del vostro settore"],
    steps: { choose: "Giorno e ora", details: "I vostri dati", done: "Confermata" },
    stepLabel: "Passo {current} di {total}",
    productLabel: "Quale soluzione vorreste vedere?",
    dateLabel: "Scegliete un giorno",
    timeLabel: "Scegliete un orario",
    timeZoneNote: "Orari indicati in ora di Lisbona (Portogallo).",
    pickDateFirst: "Scegliete prima un giorno nel calendario.",
    noSlotsOnDay: "Nessun orario libero in questo giorno.",
    noSlotsAtAll: "Al momento non ci sono orari disponibili. Inviateci una richiesta di informazioni e vi ricontatteremo.",
    previousMonth: "Mese precedente",
    nextMonth: "Mese successivo",
    weekdaysShort: ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"],
    available: "ha orari liberi",
    continue: "Continua",
    back: "Indietro",
    change: "Modifica",
    submit: "Conferma la prenotazione",
    summaryTitle: "La vostra demo",
    demoTitle: "Demo Steevanz",
    slotTaken: "Quell'orario è appena stato prenotato. Sceglietene un altro, per favore.",
    unavailableTitle: "La prenotazione online non è disponibile al momento",
    unavailableBody: "Ci scusiamo. Potete chiedere una demo via email o WhatsApp e vi risponderemo entro lo stesso giorno lavorativo.",
    unavailableCta: "Chiedi informazioni",
    success: {
      title: "La vostra demo è prenotata!",
      body: "Grazie. Abbiamo ricevuto la vostra richiesta e vi ricontatteremo per confermare i dettagli della chiamata.",
      addToCalendar: "Aggiungi al calendario (.ics)",
      googleCalendar: "Google Calendar",
      icsFileName: "steevanz-demo.ics",
      eventTitle: "Demo Steevanz",
      eventDescription: "Demo delle soluzioni Steevanz. Vi ricontatteremo per confermare i dettagli.",
      another: "Prenota un'altra demo",
      home: "Torna alla home",
    },
    form: itForm,
  },
};

export const infoRequestCopy: Localized<InfoRequestCopy> = {
  pt: {
    metaTitle: "Pedir informação | Steevanz",
    metaDescription:
      "Tem dúvidas sobre as placas ou as soluções de IA da Steevanz? Envie-nos o seu pedido ou junte-se à lista de espera e respondemos rapidamente.",
    eyebrow: "Pedir informação",
    title: "Diga-nos o que precisa.",
    lead: "Envie as suas dúvidas ou junte-se à lista de espera de um produto. Respondemos normalmente no mesmo dia útil.",
    kinds: {
      info_request: { title: "Pedido de informação", body: "Preços, prazos ou como se adapta ao seu negócio." },
      waitlist: { title: "Lista de espera", body: "Seja avisado assim que o produto estiver disponível." },
    },
    kindLegend: "O que pretende?",
    submit: "Enviar pedido",
    preferDemo: "Prefere ver a funcionar?",
    preferDemoCta: "Agendar demonstração",
    unavailableTitle: "O formulário está temporariamente indisponível",
    unavailableBody: "Pode contactar-nos diretamente por email ou WhatsApp.",
    success: {
      title: "Pedido enviado!",
      body: "Obrigado pelo contacto. Vamos analisar o seu pedido e responder em breve.",
      home: "Voltar ao início",
      book: "Agendar demonstração",
    },
    form: ptForm,
  },
  en: {
    metaTitle: "Request information | Steevanz",
    metaDescription:
      "Questions about Steevanz plates or AI solutions? Send us your request or join the waiting list and we'll get back to you quickly.",
    eyebrow: "Request info",
    title: "Tell us what you need.",
    lead: "Send us your questions or join a product's waiting list. We usually reply the same working day.",
    kinds: {
      info_request: { title: "Information request", body: "Pricing, timings or how it fits your business." },
      waitlist: { title: "Waiting list", body: "Be the first to know when the product is available." },
    },
    kindLegend: "What would you like?",
    submit: "Send request",
    preferDemo: "Rather see it in action?",
    preferDemoCta: "Book a demo",
    unavailableTitle: "The form is temporarily unavailable",
    unavailableBody: "You can contact us directly by email or WhatsApp.",
    success: {
      title: "Request sent!",
      body: "Thanks for getting in touch. We'll review your request and reply soon.",
      home: "Back to home",
      book: "Book a demo",
    },
    form: enForm,
  },
  es: {
    metaTitle: "Pedir información | Steevanz",
    metaDescription: "¿Tiene dudas sobre las placas o las soluciones de IA de Steevanz? Envíenos su solicitud o apúntese a la lista de espera y le responderemos enseguida.",
    eyebrow: "Pedir información",
    title: "Díganos qué necesita.",
    lead: "Envíenos sus dudas o apúntese a la lista de espera de un producto. Normalmente respondemos el mismo día laborable.",
    kinds: {
      info_request: { title: "Solicitud de información", body: "Precios, plazos o cómo se adapta a su negocio." },
      waitlist: { title: "Lista de espera", body: "Le avisamos en cuanto el producto esté disponible." },
    },
    kindLegend: "¿Qué desea?",
    submit: "Enviar solicitud",
    preferDemo: "¿Prefiere verlo funcionando?",
    preferDemoCta: "Reservar una demostración",
    unavailableTitle: "El formulario no está disponible en este momento",
    unavailableBody: "Puede contactarnos directamente por email o WhatsApp.",
    success: {
      title: "¡Solicitud enviada!",
      body: "Gracias por escribirnos. Revisaremos su solicitud y le responderemos pronto.",
      home: "Volver al inicio",
      book: "Reservar una demostración",
    },
    form: esForm,
  },
  fr: {
    metaTitle: "Demander des informations | Steevanz",
    metaDescription: "Des questions sur les plaques ou les solutions d'IA Steevanz ? Envoyez-nous votre demande ou inscrivez-vous sur la liste d'attente et nous vous répondrons rapidement.",
    eyebrow: "Demander des informations",
    title: "Dites-nous ce dont vous avez besoin.",
    lead: "Envoyez-nous vos questions ou inscrivez-vous sur la liste d'attente d'un produit. Nous répondons en général le jour ouvré même.",
    kinds: {
      info_request: { title: "Demande d'informations", body: "Prix, délais ou adaptation à votre activité." },
      waitlist: { title: "Liste d'attente", body: "Soyez prévenu dès que le produit est disponible." },
    },
    kindLegend: "Que souhaitez-vous ?",
    submit: "Envoyer la demande",
    preferDemo: "Vous préférez le voir fonctionner ?",
    preferDemoCta: "Réserver une démo",
    unavailableTitle: "Le formulaire est momentanément indisponible",
    unavailableBody: "Vous pouvez nous contacter directement par e-mail ou WhatsApp.",
    success: {
      title: "Demande envoyée !",
      body: "Merci de nous avoir écrit. Nous allons étudier votre demande et vous répondre très vite.",
      home: "Retour à l'accueil",
      book: "Réserver une démo",
    },
    form: frForm,
  },
  de: {
    metaTitle: "Infos anfordern | Steevanz",
    metaDescription: "Fragen zu den Steevanz-Schildern oder KI-Lösungen? Schicken Sie uns Ihre Anfrage oder tragen Sie sich in die Warteliste ein, und wir melden uns schnell.",
    eyebrow: "Infos anfordern",
    title: "Sagen Sie uns, was Sie brauchen.",
    lead: "Schicken Sie uns Ihre Fragen oder tragen Sie sich in die Warteliste eines Produkts ein. Wir antworten meist am selben Werktag.",
    kinds: {
      info_request: { title: "Infoanfrage", body: "Preise, Fristen oder wie es zu Ihrem Betrieb passt." },
      waitlist: { title: "Warteliste", body: "Erfahren Sie als Erste, wenn das Produkt verfügbar ist." },
    },
    kindLegend: "Was möchten Sie?",
    submit: "Anfrage senden",
    preferDemo: "Lieber live sehen?",
    preferDemoCta: "Demo vereinbaren",
    unavailableTitle: "Das Formular ist vorübergehend nicht verfügbar",
    unavailableBody: "Sie können uns direkt per E-Mail oder WhatsApp kontaktieren.",
    success: {
      title: "Anfrage gesendet!",
      body: "Danke für Ihre Nachricht. Wir prüfen Ihre Anfrage und melden uns bald.",
      home: "Zur Startseite",
      book: "Demo vereinbaren",
    },
    form: deForm,
  },
  it: {
    metaTitle: "Chiedi informazioni | Steevanz",
    metaDescription: "Avete domande sulle targhe o sulle soluzioni di IA di Steevanz? Inviateci la vostra richiesta o iscrivetevi alla lista d'attesa e vi risponderemo presto.",
    eyebrow: "Chiedi informazioni",
    title: "Diteci di cosa avete bisogno.",
    lead: "Inviateci le vostre domande o iscrivetevi alla lista d'attesa di un prodotto. Di solito rispondiamo entro lo stesso giorno lavorativo.",
    kinds: {
      info_request: { title: "Richiesta di informazioni", body: "Prezzi, tempi o come si adatta alla vostra attività." },
      waitlist: { title: "Lista d'attesa", body: "Vi avvisiamo appena il prodotto è disponibile." },
    },
    kindLegend: "Cosa desiderate?",
    submit: "Invia richiesta",
    preferDemo: "Preferite vederlo in funzione?",
    preferDemoCta: "Prenota una demo",
    unavailableTitle: "Il modulo non è disponibile al momento",
    unavailableBody: "Potete contattarci direttamente via email o WhatsApp.",
    success: {
      title: "Richiesta inviata!",
      body: "Grazie per averci scritto. Esamineremo la vostra richiesta e vi risponderemo presto.",
      home: "Torna alla home",
      book: "Prenota una demo",
    },
    form: itForm,
  },
};

export const waitlistParamValues = ["lista-espera", "waitlist"];

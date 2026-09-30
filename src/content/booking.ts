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

export const bookingCopy: Localized<BookingCopy> = {
  pt: {
    metaTitle: "Agendar demonstração gratuita | Steevanz",
    metaDescription:
      "Escolha o dia e a hora para uma demonstração sem compromisso das placas NFC e soluções de IA da Steevanz para o seu negócio.",
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
      "Pick a day and time for a no-obligation demo of Steevanz NFC plates and AI solutions for your business.",
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
};

export const infoRequestCopy: Localized<InfoRequestCopy> = {
  pt: {
    metaTitle: "Pedir informação | Steevanz",
    metaDescription:
      "Tem dúvidas sobre as placas NFC ou as soluções de IA da Steevanz? Envie-nos o seu pedido ou junte-se à lista de espera e respondemos rapidamente.",
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
      "Questions about Steevanz NFC plates or AI solutions? Send us your request or join the waiting list and we'll get back to you quickly.",
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
};

export const waitlistParamValues = ["lista-espera", "waitlist"];

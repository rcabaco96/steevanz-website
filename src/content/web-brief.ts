// Relative, type-only imports keep this module runnable by `node --test` (tests/web-brief.test.mjs).
import type { Localized } from "../lib/i18n.ts";

/** The short project brief the checkout asks for when the cart has a website product. */

export const briefGoals = ["contact", "book", "order", "quote", "inform"] as const;
export const briefDomainStatuses = ["has", "new", "unsure"] as const;
export const briefContentStatuses = ["ready", "partial", "none"] as const;

export type BriefGoal = (typeof briefGoals)[number];
export type BriefDomainStatus = (typeof briefDomainStatuses)[number];
export type BriefContentStatus = (typeof briefContentStatuses)[number];

/** Form field names, in the order they are shown and emailed. */
export const briefFields = ["webBusiness", "webGoal", "webPages", "webSite", "webDomain", "webContent", "webDeadline", "webReferences"] as const;
export type BriefField = (typeof briefFields)[number];

export const briefMaxLength: Record<BriefField, number> = {
  webBusiness: 600,
  webGoal: 20,
  webPages: 400,
  webSite: 200,
  webDomain: 20,
  webContent: 20,
  webDeadline: 120,
  webReferences: 600,
};

export interface WebBriefCopy {
  title: string;
  lead: string;
  labels: Record<BriefField, string>;
  placeholders: Partial<Record<BriefField, string>>;
  choose: string;
  goals: Record<BriefGoal, string>;
  domain: Record<BriefDomainStatus, string>;
  content: Record<BriefContentStatus, string>;
  errors: { webBusiness: string; webGoal: string };
  /** Short labels for the order emails and the stored order. */
  emailTitle: string;
  emailLabels: Record<BriefField, string>;
}

export const webBriefCopy: Localized<WebBriefCopy> = {
  pt: {
    title: "Sobre o seu projeto web",
    lead: "Algumas perguntas rápidas para prepararmos a proposta. Responda ao que souber: o resto vemos juntos.",
    labels: {
      webBusiness: "O que faz o negócio e onde fica?",
      webGoal: "O que quer que o visitante faça?",
      webPages: "Que páginas imagina? Para a loja: quantos produtos, mais ou menos",
      webSite: "Já tem site ou domínio? Qual o endereço?",
      webDomain: "Domínio",
      webContent: "Logótipo, fotos e textos",
      webDeadline: "Tem uma data limite?",
      webReferences: "2 ou 3 sites de que gosta (e porquê)",
    },
    placeholders: {
      webBusiness: "Ex.: Barbearia com 3 cadeiras no centro de Évora",
      webPages: "Ex.: Início, Serviços e preços, Equipa, Contactos; em português e inglês",
      webSite: "Ex.: www.o-seu-negocio.pt, ou só o Instagram",
      webDeadline: "Ex.: abertura a 1 de dezembro, antes do verão",
      webReferences: "Cole os links e diga o que gosta em cada um",
    },
    choose: "Escolha uma opção",
    goals: {
      contact: "Ligar ou enviar mensagem",
      book: "Reservar ou marcar",
      order: "Encomendar ou comprar",
      quote: "Pedir orçamento",
      inform: "Conhecer o negócio e visitá-lo",
    },
    domain: {
      has: "Já tenho domínio",
      new: "Ainda não tenho: quero ajuda a registar",
      unsure: "Não sei",
    },
    content: {
      ready: "Tenho tudo pronto",
      partial: "Tenho uma parte (ex.: logótipo e fotos, sem textos)",
      none: "Ainda não tenho: preciso de ajuda",
    },
    errors: {
      webBusiness: "Diga-nos em poucas palavras o que faz o negócio.",
      webGoal: "Escolha o principal objetivo do site.",
    },
    emailTitle: "Briefing web",
    emailLabels: {
      webBusiness: "Negócio",
      webGoal: "Objetivo principal",
      webPages: "Páginas / produtos",
      webSite: "Site ou domínio atual",
      webDomain: "Domínio",
      webContent: "Conteúdos",
      webDeadline: "Prazo",
      webReferences: "Referências",
    },
  },
  en: {
    title: "About your web project",
    lead: "A few quick questions so we can prepare the proposal. Answer what you know: we'll go through the rest together.",
    labels: {
      webBusiness: "What does your business do and where is it?",
      webGoal: "What should visitors do?",
      webPages: "Which pages do you need? For a shop: roughly how many products",
      webSite: "Do you have a website or domain now? Its address?",
      webDomain: "Domain",
      webContent: "Logo, photos and texts",
      webDeadline: "Any deadline?",
      webReferences: "2 or 3 websites you like (and why)",
    },
    placeholders: {
      webBusiness: "e.g. A 3-chair barber shop in central Évora",
      webPages: "e.g. Home, Services and prices, Team, Contacts; in Portuguese and English",
      webSite: "e.g. www.your-business.pt, or just Instagram",
      webDeadline: "e.g. opening on 1 December, before summer",
      webReferences: "Paste the links and tell us what you like about each",
    },
    choose: "Choose an option",
    goals: {
      contact: "Call or send a message",
      book: "Book an appointment or table",
      order: "Order or buy",
      quote: "Request a quote",
      inform: "Get to know the business and visit",
    },
    domain: {
      has: "I already have a domain",
      new: "Not yet: I'd like help registering one",
      unsure: "I'm not sure",
    },
    content: {
      ready: "I have everything ready",
      partial: "I have some of it (e.g. logo and photos, no texts)",
      none: "Not yet: I need help",
    },
    errors: {
      webBusiness: "Tell us in a few words what your business does.",
      webGoal: "Choose the website's main goal.",
    },
    emailTitle: "Web brief",
    emailLabels: {
      webBusiness: "Business",
      webGoal: "Main goal",
      webPages: "Pages / products",
      webSite: "Current website or domain",
      webDomain: "Domain",
      webContent: "Content",
      webDeadline: "Deadline",
      webReferences: "References",
    },
  },
  es: {
    title: "Sobre su proyecto web",
    lead: "Unas preguntas rápidas para preparar la propuesta. Responda a lo que sepa: el resto lo vemos juntos.",
    labels: {
      webBusiness: "¿A qué se dedica su negocio y dónde está?",
      webGoal: "¿Qué quiere que haga quien visite la web?",
      webPages: "¿Qué páginas imagina? Para la tienda: cuántos productos, más o menos",
      webSite: "¿Ya tiene web o dominio? ¿Cuál es la dirección?",
      webDomain: "Dominio",
      webContent: "Logotipo, fotos y textos",
      webDeadline: "¿Tiene una fecha límite?",
      webReferences: "2 o 3 webs que le gusten (y por qué)",
    },
    placeholders: {
      webBusiness: "Ej.: Barbería con 3 sillones en el centro de Évora",
      webPages: "Ej.: Inicio, Servicios y precios, Equipo, Contacto; en portugués y español",
      webSite: "Ej.: www.su-negocio.pt, o solo Instagram",
      webDeadline: "Ej.: apertura el 1 de diciembre, antes del verano",
      webReferences: "Pegue los enlaces y díganos qué le gusta de cada uno",
    },
    choose: "Elija una opción",
    goals: {
      contact: "Llamar o enviar un mensaje",
      book: "Reservar o pedir cita",
      order: "Hacer un pedido o comprar",
      quote: "Pedir presupuesto",
      inform: "Conocer el negocio y visitarlo",
    },
    domain: {
      has: "Ya tengo dominio",
      new: "Aún no tengo: quiero ayuda para registrarlo",
      unsure: "No lo sé",
    },
    content: {
      ready: "Lo tengo todo listo",
      partial: "Tengo una parte (ej.: logotipo y fotos, sin textos)",
      none: "Aún no tengo: necesito ayuda",
    },
    errors: {
      webBusiness: "Díganos en pocas palabras a qué se dedica su negocio.",
      webGoal: "Elija el objetivo principal de la web.",
    },
    emailTitle: "Briefing web",
    emailLabels: {
      webBusiness: "Negocio",
      webGoal: "Objetivo principal",
      webPages: "Páginas / productos",
      webSite: "Web o dominio actual",
      webDomain: "Dominio",
      webContent: "Contenidos",
      webDeadline: "Plazo",
      webReferences: "Referencias",
    },
  },
  fr: {
    title: "À propos de votre projet web",
    lead: "Quelques questions rapides pour préparer la proposition. Répondez à ce que vous savez : nous verrons le reste ensemble.",
    labels: {
      webBusiness: "Que fait votre entreprise et où se trouve-t-elle ?",
      webGoal: "Que voulez-vous que les visiteurs fassent ?",
      webPages: "Quelles pages imaginez-vous ? Pour une boutique : combien de produits, à peu près",
      webSite: "Avez-vous déjà un site ou un nom de domaine ? Quelle adresse ?",
      webDomain: "Nom de domaine",
      webContent: "Logo, photos et textes",
      webDeadline: "Avez-vous une date limite ?",
      webReferences: "2 ou 3 sites que vous aimez (et pourquoi)",
    },
    placeholders: {
      webBusiness: "Ex. : barbier avec 3 fauteuils dans le centre d'Évora",
      webPages: "Ex. : Accueil, Prestations et tarifs, Équipe, Contact ; en portugais et en français",
      webSite: "Ex. : www.votre-entreprise.pt, ou seulement Instagram",
      webDeadline: "Ex. : ouverture le 1er décembre, avant l'été",
      webReferences: "Collez les liens et dites-nous ce qui vous plaît dans chacun",
    },
    choose: "Choisissez une option",
    goals: {
      contact: "Appeler ou envoyer un message",
      book: "Réserver ou prendre rendez-vous",
      order: "Commander ou acheter",
      quote: "Demander un devis",
      inform: "Découvrir l'entreprise et venir sur place",
    },
    domain: {
      has: "J'ai déjà un nom de domaine",
      new: "Pas encore : je veux de l'aide pour l'enregistrer",
      unsure: "Je ne sais pas",
    },
    content: {
      ready: "J'ai tout ce qu'il faut",
      partial: "J'en ai une partie (ex. : logo et photos, sans textes)",
      none: "Pas encore : j'ai besoin d'aide",
    },
    errors: {
      webBusiness: "Dites-nous en quelques mots ce que fait votre entreprise.",
      webGoal: "Choisissez l'objectif principal du site.",
    },
    emailTitle: "Brief web",
    emailLabels: {
      webBusiness: "Entreprise",
      webGoal: "Objectif principal",
      webPages: "Pages / produits",
      webSite: "Site ou nom de domaine actuel",
      webDomain: "Nom de domaine",
      webContent: "Contenus",
      webDeadline: "Délai",
      webReferences: "Références",
    },
  },
  de: {
    title: "Zu Ihrem Webprojekt",
    lead: "Ein paar kurze Fragen, damit wir das Angebot vorbereiten können. Beantworten Sie, was Sie wissen: Den Rest klären wir gemeinsam.",
    labels: {
      webBusiness: "Was macht Ihr Unternehmen und wo ist es?",
      webGoal: "Was sollen Besucher tun?",
      webPages: "Welche Seiten stellen Sie sich vor? Für einen Shop: ungefähr wie viele Produkte",
      webSite: "Haben Sie schon eine Website oder Domain? Unter welcher Adresse?",
      webDomain: "Domain",
      webContent: "Logo, Fotos und Texte",
      webDeadline: "Gibt es einen Termin, bis wann es fertig sein muss?",
      webReferences: "2 oder 3 Websites, die Ihnen gefallen (und warum)",
    },
    placeholders: {
      webBusiness: "Z. B.: Barbershop mit 3 Stühlen im Zentrum von Évora",
      webPages: "Z. B.: Start, Leistungen und Preise, Team, Kontakt; auf Portugiesisch und Deutsch",
      webSite: "Z. B.: www.ihr-unternehmen.pt, oder nur Instagram",
      webDeadline: "Z. B.: Eröffnung am 1. Dezember, vor dem Sommer",
      webReferences: "Fügen Sie die Links ein und sagen Sie uns, was Ihnen jeweils gefällt",
    },
    choose: "Bitte wählen",
    goals: {
      contact: "Anrufen oder eine Nachricht schreiben",
      book: "Reservieren oder einen Termin buchen",
      order: "Bestellen oder kaufen",
      quote: "Ein Angebot anfragen",
      inform: "Das Unternehmen kennenlernen und vorbeikommen",
    },
    domain: {
      has: "Ich habe schon eine Domain",
      new: "Noch nicht: Ich möchte Hilfe bei der Registrierung",
      unsure: "Weiß ich nicht",
    },
    content: {
      ready: "Ich habe alles fertig",
      partial: "Ich habe einen Teil (z. B. Logo und Fotos, keine Texte)",
      none: "Noch nicht: Ich brauche Hilfe",
    },
    errors: {
      webBusiness: "Sagen Sie uns in wenigen Worten, was Ihr Unternehmen macht.",
      webGoal: "Wählen Sie das Hauptziel der Website.",
    },
    emailTitle: "Web-Briefing",
    emailLabels: {
      webBusiness: "Unternehmen",
      webGoal: "Hauptziel",
      webPages: "Seiten / Produkte",
      webSite: "Aktuelle Website oder Domain",
      webDomain: "Domain",
      webContent: "Inhalte",
      webDeadline: "Termin",
      webReferences: "Referenzen",
    },
  },
  it: {
    title: "Il vostro progetto web",
    lead: "Qualche domanda veloce per preparare la proposta. Rispondete a ciò che sapete: il resto lo vediamo insieme.",
    labels: {
      webBusiness: "Di cosa si occupa la vostra attività e dove si trova?",
      webGoal: "Cosa volete che faccia chi visita il sito?",
      webPages: "Che pagine immaginate? Per il negozio: quanti prodotti, più o meno",
      webSite: "Avete già un sito o un dominio? Qual è l'indirizzo?",
      webDomain: "Dominio",
      webContent: "Logo, foto e testi",
      webDeadline: "C'è una scadenza?",
      webReferences: "2 o 3 siti che vi piacciono (e perché)",
    },
    placeholders: {
      webBusiness: "Es.: barbiere con 3 poltrone nel centro di Évora",
      webPages: "Es.: Home, Servizi e prezzi, Staff, Contatti; in portoghese e italiano",
      webSite: "Es.: www.la-vostra-attivita.pt, o solo Instagram",
      webDeadline: "Es.: apertura il 1° dicembre, prima dell'estate",
      webReferences: "Incollate i link e diteci cosa vi piace di ognuno",
    },
    choose: "Scegliete un'opzione",
    goals: {
      contact: "Chiamare o mandare un messaggio",
      book: "Prenotare o fissare un appuntamento",
      order: "Ordinare o acquistare",
      quote: "Chiedere un preventivo",
      inform: "Conoscere l'attività e venire a trovarvi",
    },
    domain: {
      has: "Ho già un dominio",
      new: "Non ancora: vorrei aiuto per registrarlo",
      unsure: "Non lo so",
    },
    content: {
      ready: "Ho tutto pronto",
      partial: "Ne ho una parte (es.: logo e foto, senza testi)",
      none: "Non ancora: mi serve aiuto",
    },
    errors: {
      webBusiness: "Diteci in poche parole di cosa si occupa la vostra attività.",
      webGoal: "Scegliete l'obiettivo principale del sito.",
    },
    emailTitle: "Brief web",
    emailLabels: {
      webBusiness: "Attività",
      webGoal: "Obiettivo principale",
      webPages: "Pagine / prodotti",
      webSite: "Sito o dominio attuale",
      webDomain: "Dominio",
      webContent: "Contenuti",
      webDeadline: "Scadenza",
      webReferences: "Riferimenti",
    },
  },
};

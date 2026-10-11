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
};

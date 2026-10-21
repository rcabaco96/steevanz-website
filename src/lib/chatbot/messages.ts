// The assistant's fixed sentences in the six site languages, in the site's register (pt «o senhor»
// implied, es «usted», fr «vous», de «Sie», it «Lei»). Used by the mock answers and by every safety
// rule, whatever model writes the free answers later. Pure module.
import type { ChatbotLanguage } from "./types.ts";

export interface FixedMessages {
  /** First message of a chat: who is answering and the privacy note (the site promises both). */
  intro: (business: string, privacyUrl: string | null) => string;
  howCanIHelp: string;
  thanks: string;
  /** The chat goes to a person. */
  handoff: string;
  /** …and the business is closed now. */
  handoffClosed: (when: string) => string;
  emergency: string;
  accessCode: string;
  guestIdentity: string;
  medical: string;
  /** Nothing in the business's information answers the question. */
  dontKnow: (phone: string | null) => string;
  hoursTitle: string;
  openNow: (closesAt: string) => string;
  closedNow: (when: string | null) => string;
  closedTodayReason: (reason: string) => string;
  opensOn: (when: string) => string;
  noHours: string;
  address: (address: string) => string;
  mapsLink: (url: string) => string;
  booking: (url: string) => string;
  bookingByPhone: (phone: string) => string;
  menuIntro: string;
  menuLink: (url: string) => string;
  /** After the first lines of a long list quoted from a document. */
  moreInList: string;
  minutes: (count: number) => string;
  /** An answer written in another language than the customer's (the mock can't translate). */
  answerInOtherLanguage: string;
  whichProperty: (list: string) => string;
  textOnly: string;
}

const pt: FixedMessages = {
  intro: (business, privacyUrl) =>
    `Olá! Sou o assistente automático de ${business}. Respondo com a informação do negócio e, quando for preciso, passo a conversa à equipa.` +
    ` As mensagens são guardadas apenas para prestar este serviço${privacyUrl ? ` (${privacyUrl})` : ""}.`,
  howCanIHelp: "Em que posso ajudar?",
  thanks: "De nada! Se precisar de mais alguma coisa, estou por aqui.",
  handoff: "Vou passar a sua mensagem à equipa, que lhe responde aqui assim que possível.",
  handoffClosed: (when) => `Vou passar a sua mensagem à equipa. Neste momento estamos fechados: respondemos ${when}.`,
  emergency: "Se é uma emergência, ligue já para o 112. Já avisei a equipa, que o contacta assim que possível.",
  accessCode: "Por segurança, não envio códigos de acesso por mensagem automática. Já avisei o anfitrião, que lhe responde em breve.",
  guestIdentity: "Por privacidade, não posso dar informações sobre quem está hospedado.",
  medical: "Não posso dar aconselhamento médico. Passo a sua questão à equipa clínica, que lhe responde em breve. Se for urgente, ligue para o 112.",
  dontKnow: (phone) =>
    `Não tenho essa informação. ${phone ? `Pode ligar para ${phone} ou, se preferir, ` : "Se preferir, "}responda «sim» e passo a conversa a uma pessoa da equipa.`,
  hoursTitle: "O nosso horário:",
  openNow: (closesAt) => `Neste momento estamos abertos, até às ${closesAt}.`,
  closedNow: (when) => (when ? `Neste momento estamos fechados. Abrimos ${when}.` : "Neste momento estamos fechados."),
  closedTodayReason: (reason) => `Hoje estamos fechados (${reason}).`,
  opensOn: (when) => `Abrimos ${when}.`,
  noHours: "Não tenho o horário atualizado. A equipa confirma-lho em breve.",
  address: (address) => `Estamos em ${address}.`,
  mapsLink: (url) => `Mapa: ${url}`,
  booking: (url) => `Pode reservar aqui, com a disponibilidade em tempo real: ${url}`,
  bookingByPhone: (phone) => `Para reservar, ligue para ${phone}.`,
  menuIntro: "Encontrei isto:",
  menuLink: (url) => `Veja tudo aqui: ${url}`,
  moreInList: "(Há mais opções. Diga-me qual procura e eu digo-lhe o preço.)",
  minutes: (count) => `${count} min`,
  answerInOtherLanguage: "(Por agora, esta informação só está disponível noutra língua.)",
  whichProperty: (list) => `Em qual dos alojamentos está hospedado? ${list}`,
  textOnly: "De momento só consigo ler mensagens de texto. Pode escrever a sua pergunta?",
};

const en: FixedMessages = {
  intro: (business, privacyUrl) =>
    `Hello! I'm the automated assistant of ${business}. I answer with the business's own information and, when needed, pass the conversation to the team.` +
    ` Messages are kept only to provide this service${privacyUrl ? ` (${privacyUrl})` : ""}.`,
  howCanIHelp: "How can I help you?",
  thanks: "You're welcome! If you need anything else, I'm here.",
  handoff: "I'll pass your message to the team, who will reply here as soon as possible.",
  handoffClosed: (when) => `I'll pass your message to the team. We're closed right now: we'll reply ${when}.`,
  emergency: "If this is an emergency, please call 112 now. I have already alerted the team, who will contact you as soon as possible.",
  accessCode: "For security reasons, I don't send access codes in automated messages. I've alerted the host, who will reply shortly.",
  guestIdentity: "For privacy reasons, I can't share any information about who is staying.",
  medical: "I can't give medical advice. I'm passing your question to the clinical team, who will reply shortly. If it's urgent, please call 112.",
  dontKnow: (phone) =>
    `I don't have that information. ${phone ? `You can call ${phone} or, if you prefer, ` : "If you prefer, "}reply «yes» and I'll pass the conversation to someone on the team.`,
  hoursTitle: "Our opening hours:",
  openNow: (closesAt) => `We're open right now, until ${closesAt}.`,
  closedNow: (when) => (when ? `We're closed right now. We open ${when}.` : "We're closed right now."),
  closedTodayReason: (reason) => `We're closed today (${reason}).`,
  opensOn: (when) => `We open ${when}.`,
  noHours: "I don't have the current opening hours. The team will confirm them shortly.",
  address: (address) => `We're at ${address}.`,
  mapsLink: (url) => `Map: ${url}`,
  booking: (url) => `You can book here, with real-time availability: ${url}`,
  bookingByPhone: (phone) => `To book, please call ${phone}.`,
  menuIntro: "Here's what I found:",
  menuLink: (url) => `See everything here: ${url}`,
  moreInList: "(There's more. Tell me which one you're looking for and I'll tell you the price.)",
  minutes: (count) => `${count} min`,
  answerInOtherLanguage: "(This information is only available in another language for now.)",
  whichProperty: (list) => `Which of our properties are you staying at? ${list}`,
  textOnly: "For now I can only read text messages. Could you type your question?",
};

const es: FixedMessages = {
  intro: (business, privacyUrl) =>
    `¡Hola! Soy el asistente automático de ${business}. Respondo con la información del negocio y, cuando hace falta, paso la conversación al equipo.` +
    ` Los mensajes se guardan solo para prestar este servicio${privacyUrl ? ` (${privacyUrl})` : ""}.`,
  howCanIHelp: "¿En qué puedo ayudarle?",
  thanks: "¡De nada! Si necesita algo más, aquí estoy.",
  handoff: "Paso su mensaje al equipo, que le responderá aquí lo antes posible.",
  handoffClosed: (when) => `Paso su mensaje al equipo. Ahora mismo estamos cerrados: le responderemos ${when}.`,
  emergency: "Si es una emergencia, llame ahora al 112. Ya he avisado al equipo, que se pondrá en contacto con usted lo antes posible.",
  accessCode: "Por seguridad, no envío códigos de acceso en mensajes automáticos. Ya he avisado al anfitrión, que le responderá en breve.",
  guestIdentity: "Por privacidad, no puedo dar información sobre quién está alojado.",
  medical: "No puedo dar consejo médico. Paso su pregunta al equipo clínico, que le responderá en breve. Si es urgente, llame al 112.",
  dontKnow: (phone) =>
    `No tengo esa información. ${phone ? `Puede llamar al ${phone} o, si lo prefiere, ` : "Si lo prefiere, "}responda «sí» y paso la conversación a una persona del equipo.`,
  hoursTitle: "Nuestro horario:",
  openNow: (closesAt) => `Ahora mismo estamos abiertos, hasta las ${closesAt}.`,
  closedNow: (when) => (when ? `Ahora mismo estamos cerrados. Abrimos ${when}.` : "Ahora mismo estamos cerrados."),
  closedTodayReason: (reason) => `Hoy estamos cerrados (${reason}).`,
  opensOn: (when) => `Abrimos ${when}.`,
  noHours: "No tengo el horario actualizado. El equipo se lo confirmará en breve.",
  address: (address) => `Estamos en ${address}.`,
  mapsLink: (url) => `Mapa: ${url}`,
  booking: (url) => `Puede reservar aquí, con disponibilidad en tiempo real: ${url}`,
  bookingByPhone: (phone) => `Para reservar, llame al ${phone}.`,
  menuIntro: "Esto es lo que he encontrado:",
  menuLink: (url) => `Véalo todo aquí: ${url}`,
  moreInList: "(Hay más opciones. Dígame cuál busca y le digo el precio.)",
  minutes: (count) => `${count} min`,
  answerInOtherLanguage: "(Por ahora esta información solo está disponible en otro idioma.)",
  whichProperty: (list) => `¿En cuál de nuestros alojamientos se hospeda? ${list}`,
  textOnly: "Por ahora solo puedo leer mensajes de texto. ¿Puede escribir su pregunta?",
};

const fr: FixedMessages = {
  intro: (business, privacyUrl) =>
    `Bonjour ! Je suis l'assistant automatique de ${business}. Je réponds avec les informations de l'établissement et, si nécessaire, je transmets la conversation à l'équipe.` +
    ` Les messages sont conservés uniquement pour fournir ce service${privacyUrl ? ` (${privacyUrl})` : ""}.`,
  howCanIHelp: "Comment puis-je vous aider ?",
  thanks: "Je vous en prie ! Si vous avez besoin d'autre chose, je suis là.",
  handoff: "Je transmets votre message à l'équipe, qui vous répondra ici dès que possible.",
  handoffClosed: (when) => `Je transmets votre message à l'équipe. Nous sommes fermés en ce moment : nous vous répondrons ${when}.`,
  emergency: "S'il s'agit d'une urgence, appelez immédiatement le 112. J'ai déjà prévenu l'équipe, qui vous contactera dès que possible.",
  accessCode: "Par sécurité, je n'envoie pas de codes d'accès par message automatique. J'ai prévenu l'hôte, qui vous répondra rapidement.",
  guestIdentity: "Par respect de la vie privée, je ne peux pas donner d'informations sur les personnes hébergées.",
  medical: "Je ne peux pas donner de conseil médical. Je transmets votre question à l'équipe soignante, qui vous répondra rapidement. En cas d'urgence, appelez le 112.",
  dontKnow: (phone) =>
    `Je n'ai pas cette information. ${phone ? `Vous pouvez appeler le ${phone} ou, si vous préférez, ` : "Si vous préférez, "}répondez « oui » et je transmets la conversation à une personne de l'équipe.`,
  hoursTitle: "Nos horaires :",
  openNow: (closesAt) => `Nous sommes ouverts en ce moment, jusqu'à ${closesAt}.`,
  closedNow: (when) => (when ? `Nous sommes fermés en ce moment. Nous ouvrons ${when}.` : "Nous sommes fermés en ce moment."),
  closedTodayReason: (reason) => `Nous sommes fermés aujourd'hui (${reason}).`,
  opensOn: (when) => `Nous ouvrons ${when}.`,
  noHours: "Je n'ai pas les horaires à jour. L'équipe vous les confirmera rapidement.",
  address: (address) => `Nous sommes au ${address}.`,
  mapsLink: (url) => `Plan : ${url}`,
  booking: (url) => `Vous pouvez réserver ici, avec les disponibilités en temps réel : ${url}`,
  bookingByPhone: (phone) => `Pour réserver, appelez le ${phone}.`,
  menuIntro: "Voici ce que j'ai trouvé :",
  menuLink: (url) => `Tout voir ici : ${url}`,
  moreInList: "(Il y a d'autres options. Dites-moi laquelle vous cherchez et je vous donne le prix.)",
  minutes: (count) => `${count} min`,
  answerInOtherLanguage: "(Pour l'instant, cette information n'est disponible que dans une autre langue.)",
  whichProperty: (list) => `Dans lequel de nos logements séjournez-vous ? ${list}`,
  textOnly: "Pour l'instant, je ne peux lire que les messages texte. Pouvez-vous écrire votre question ?",
};

const de: FixedMessages = {
  intro: (business, privacyUrl) =>
    `Guten Tag! Ich bin der automatische Assistent von ${business}. Ich antworte mit den Informationen des Betriebs und gebe das Gespräch bei Bedarf an das Team weiter.` +
    ` Nachrichten werden nur zur Erbringung dieses Dienstes gespeichert${privacyUrl ? ` (${privacyUrl})` : ""}.`,
  howCanIHelp: "Wie kann ich Ihnen helfen?",
  thanks: "Gern geschehen! Wenn Sie noch etwas brauchen, bin ich für Sie da.",
  handoff: "Ich gebe Ihre Nachricht an das Team weiter, das Ihnen hier so bald wie möglich antwortet.",
  handoffClosed: (when) => `Ich gebe Ihre Nachricht an das Team weiter. Wir haben gerade geschlossen: Wir antworten ${when}.`,
  emergency: "Wenn es sich um einen Notfall handelt, rufen Sie bitte sofort die 112 an. Ich habe das Team bereits informiert, das sich so bald wie möglich bei Ihnen meldet.",
  accessCode: "Aus Sicherheitsgründen sende ich keine Zugangscodes per automatischer Nachricht. Ich habe den Gastgeber informiert, der Ihnen gleich antwortet.",
  guestIdentity: "Aus Datenschutzgründen kann ich keine Auskunft darüber geben, wer hier wohnt.",
  medical: "Ich kann keine medizinische Beratung geben. Ich leite Ihre Frage an das medizinische Team weiter, das Ihnen bald antwortet. Wenn es dringend ist, rufen Sie bitte die 112 an.",
  dontKnow: (phone) =>
    `Diese Information habe ich leider nicht. ${phone ? `Sie können ${phone} anrufen oder, wenn Sie möchten, ` : "Wenn Sie möchten, "}antworten Sie mit «ja», und ich gebe das Gespräch an eine Person aus dem Team weiter.`,
  hoursTitle: "Unsere Öffnungszeiten:",
  openNow: (closesAt) => `Wir haben gerade geöffnet, bis ${closesAt} Uhr.`,
  closedNow: (when) => (when ? `Wir haben gerade geschlossen. Wir öffnen ${when}.` : "Wir haben gerade geschlossen."),
  closedTodayReason: (reason) => `Heute haben wir geschlossen (${reason}).`,
  opensOn: (when) => `Wir öffnen ${when}.`,
  noHours: "Ich habe die aktuellen Öffnungszeiten nicht. Das Team bestätigt sie Ihnen in Kürze.",
  address: (address) => `Sie finden uns hier: ${address}.`,
  mapsLink: (url) => `Karte: ${url}`,
  booking: (url) => `Hier können Sie mit Echtzeit-Verfügbarkeit reservieren: ${url}`,
  bookingByPhone: (phone) => `Für eine Reservierung rufen Sie bitte ${phone} an.`,
  menuIntro: "Das habe ich gefunden:",
  menuLink: (url) => `Alles finden Sie hier: ${url}`,
  moreInList: "(Es gibt noch mehr. Sagen Sie mir, was Sie suchen, und ich nenne Ihnen den Preis.)",
  minutes: (count) => `${count} Min.`,
  answerInOtherLanguage: "(Diese Information gibt es vorerst nur in einer anderen Sprache.)",
  whichProperty: (list) => `In welcher unserer Unterkünfte wohnen Sie? ${list}`,
  textOnly: "Im Moment kann ich nur Textnachrichten lesen. Könnten Sie Ihre Frage schreiben?",
};

const it: FixedMessages = {
  intro: (business, privacyUrl) =>
    `Buongiorno! Sono l'assistente automatico di ${business}. Rispondo con le informazioni dell'attività e, quando serve, passo la conversazione al team.` +
    ` I messaggi vengono conservati solo per fornire questo servizio${privacyUrl ? ` (${privacyUrl})` : ""}.`,
  howCanIHelp: "Come posso aiutarLa?",
  thanks: "Prego! Se ha bisogno di altro, sono qui.",
  handoff: "Passo il Suo messaggio al team, che Le risponderà qui il prima possibile.",
  handoffClosed: (when) => `Passo il Suo messaggio al team. In questo momento siamo chiusi: Le risponderemo ${when}.`,
  emergency: "Se si tratta di un'emergenza, chiami subito il 112. Ho già avvisato il team, che La contatterà il prima possibile.",
  accessCode: "Per sicurezza, non invio codici di accesso con messaggi automatici. Ho avvisato l'host, che Le risponderà a breve.",
  guestIdentity: "Per motivi di privacy, non posso dare informazioni su chi alloggia qui.",
  medical: "Non posso dare consigli medici. Passo la Sua domanda al team clinico, che Le risponderà a breve. Se è urgente, chiami il 112.",
  dontKnow: (phone) =>
    `Non ho questa informazione. ${phone ? `Può chiamare il ${phone} oppure, se preferisce, ` : "Se preferisce, "}risponda «sì» e passo la conversazione a una persona del team.`,
  hoursTitle: "I nostri orari:",
  openNow: (closesAt) => `In questo momento siamo aperti, fino alle ${closesAt}.`,
  closedNow: (when) => (when ? `In questo momento siamo chiusi. Apriamo ${when}.` : "In questo momento siamo chiusi."),
  closedTodayReason: (reason) => `Oggi siamo chiusi (${reason}).`,
  opensOn: (when) => `Apriamo ${when}.`,
  noHours: "Non ho gli orari aggiornati. Il team glieli confermerà a breve.",
  address: (address) => `Ci trova in ${address}.`,
  mapsLink: (url) => `Mappa: ${url}`,
  booking: (url) => `Può prenotare qui, con la disponibilità in tempo reale: ${url}`,
  bookingByPhone: (phone) => `Per prenotare, chiami il ${phone}.`,
  menuIntro: "Ecco cosa ho trovato:",
  menuLink: (url) => `Veda tutto qui: ${url}`,
  moreInList: "(Ci sono altre opzioni. Mi dica quale cerca e Le dico il prezzo.)",
  minutes: (count) => `${count} min`,
  answerInOtherLanguage: "(Per ora questa informazione è disponibile solo in un'altra lingua.)",
  whichProperty: (list) => `In quale dei nostri alloggi soggiorna? ${list}`,
  textOnly: "Per ora posso leggere solo messaggi di testo. Può scrivere la Sua domanda?",
};

export const fixedMessages: Record<ChatbotLanguage, FixedMessages> = { pt, en, es, fr, de, it };

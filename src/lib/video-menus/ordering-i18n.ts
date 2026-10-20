// Ordering at the table in the menu's six languages (owner, 2026-10-19): what the table's phones say.
// The staff's page stays in Portuguese (ordering-rules). Pure module; loaded only with the ordering
// code (a table's page), never with the plain menu.

import { formatMenuPrice, languageLocales, type MenuLanguage } from "./i18n.ts";
import { maxCartItems, maxLineQuantity, maxNoteLength, orderTimeZone, type OrderingError, type OrderStatus } from "./ordering-rules.ts";

export interface OrderingText {
  items: (count: number) => string;
  each: (price: string) => string;
  lessAria: (dish: string) => string;
  removeAria: (dish: string) => string;
  moreAria: (dish: string) => string;
  remove: string;
  noteFor: (dish: string) => string;
  notePlaceholder: string;
  note: string;
  view: string;
  order: (number: number) => string;
  bar: string;
  tableOrderAria: (table: string) => string;
  closeOrder: string;
  close: string;
  yourOrder: string;
  tableOrder: string;
  showCode: string;
  qrAria: string;
  backToOrder: (items: string) => string;
  orderMore: string;
  shared: string;
  empty: string;
  ordered: string;
  total: string;
  sendQuestion: (items: string, total: string) => string;
  back: string;
  sending: string;
  confirm: string;
  placeOrder: string;
  confirmedChip: string;
  waitingChip: string;
  status: Record<OrderStatus, string>;
  errors: Record<OrderingError, string>;
}

export const orderingText: Record<MenuLanguage, OrderingText> = {
  pt: {
    items: (count) => `${count} ${count === 1 ? "item" : "itens"}`,
    each: (price) => `${price} cada`,
    lessAria: (dish) => `Menos um: ${dish}`,
    removeAria: (dish) => `Tirar do pedido: ${dish}`,
    moreAria: (dish) => `Mais um: ${dish}`,
    remove: "Remover",
    noteFor: (dish) => `Nota para ${dish}`,
    notePlaceholder: "Nota (ex.: sem cebola)",
    note: "Nota:",
    view: "Ver",
    order: (number) => `Pedido #${number}`,
    bar: "Pedido",
    tableOrderAria: (table) => `Pedido da ${table}`,
    closeOrder: "Fechar o pedido",
    close: "Fechar",
    yourOrder: "O seu pedido",
    tableOrder: "Pedido da mesa",
    showCode: "Mostre este código ao funcionário",
    qrAria: "Código QR do pedido",
    backToOrder: (items) => `Voltar ao pedido (${items})`,
    orderMore: "Pedir mais",
    shared: "Todos nesta mesa veem e alteram este pedido.",
    empty: "Ainda não há pratos no pedido. Toque em «Adicionar» nos pratos do menu.",
    ordered: "Já pedido",
    total: "Total",
    sendQuestion: (items, total) => `Enviar o pedido de ${items} (${total})?`,
    back: "Voltar",
    sending: "A enviar…",
    confirm: "Confirmar pedido",
    placeOrder: "Fazer pedido",
    confirmedChip: "Confirmado ✓",
    waitingChip: "À espera",
    status: { confirmed: "Pedido confirmado ✓", placed: "À espera de confirmação" },
    errors: {
      cart_full: `O pedido já tem ${maxCartItems} itens, o máximo de uma vez. Faça este pedido e depois outro.`,
      line_full: `Máximo de ${maxLineQuantity} do mesmo prato numa linha.`,
      note_too_long: `A nota pode ter até ${maxNoteLength} caracteres.`,
      cart_empty: "O pedido está vazio.",
      order_too_soon: "Acabou de ser feito um pedido nesta mesa. Espere uns segundos.",
      rate_limited: "Muitas alterações seguidas. Espere um momento.",
      dish_missing: "Este prato já não está no menu.",
      table_missing: "Este código de mesa já não é válido. Peça ajuda ao funcionário.",
      ordering_off: "Os pedidos no menu estão desligados de momento.",
      network: "Sem ligação. Tente outra vez.",
      bad_request: "Ocorreu um erro. Tente outra vez.",
    },
  },
  en: {
    items: (count) => `${count} ${count === 1 ? "item" : "items"}`,
    each: (price) => `${price} each`,
    lessAria: (dish) => `One less: ${dish}`,
    removeAria: (dish) => `Remove from the order: ${dish}`,
    moreAria: (dish) => `One more: ${dish}`,
    remove: "Remove",
    noteFor: (dish) => `Note for ${dish}`,
    notePlaceholder: "Note (e.g. no onion)",
    note: "Note:",
    view: "View",
    order: (number) => `Order #${number}`,
    bar: "Order",
    tableOrderAria: (table) => `Order for ${table}`,
    closeOrder: "Close the order",
    close: "Close",
    yourOrder: "Your order",
    tableOrder: "Table order",
    showCode: "Show this code to a member of staff",
    qrAria: "Order QR code",
    backToOrder: (items) => `Back to the order (${items})`,
    orderMore: "Order more",
    shared: "Everyone at this table sees and changes this order.",
    empty: "No dishes in the order yet. Tap «Add» on the menu's dishes.",
    ordered: "Already ordered",
    total: "Total",
    sendQuestion: (items, total) => `Send the order of ${items} (${total})?`,
    back: "Back",
    sending: "Sending…",
    confirm: "Confirm order",
    placeOrder: "Place order",
    confirmedChip: "Confirmed ✓",
    waitingChip: "Waiting",
    status: { confirmed: "Order confirmed ✓", placed: "Waiting for confirmation" },
    errors: {
      cart_full: `The order already has ${maxCartItems} items, the most at once. Place this order, then another.`,
      line_full: `At most ${maxLineQuantity} of the same dish on one line.`,
      note_too_long: `The note can have up to ${maxNoteLength} characters.`,
      cart_empty: "The order is empty.",
      order_too_soon: "An order was just placed at this table. Wait a few seconds.",
      rate_limited: "Too many changes in a row. Wait a moment.",
      dish_missing: "This dish is no longer on the menu.",
      table_missing: "This table code is no longer valid. Ask a member of staff for help.",
      ordering_off: "Ordering from the menu is switched off at the moment.",
      network: "No connection. Try again.",
      bad_request: "Something went wrong. Try again.",
    },
  },
  es: {
    items: (count) => `${count} ${count === 1 ? "artículo" : "artículos"}`,
    each: (price) => `${price} c/u`,
    lessAria: (dish) => `Uno menos: ${dish}`,
    removeAria: (dish) => `Quitar del pedido: ${dish}`,
    moreAria: (dish) => `Uno más: ${dish}`,
    remove: "Quitar",
    noteFor: (dish) => `Nota para ${dish}`,
    notePlaceholder: "Nota (p. ej.: sin cebolla)",
    note: "Nota:",
    view: "Ver",
    order: (number) => `Pedido n.º ${number}`,
    bar: "Pedido",
    tableOrderAria: (table) => `Pedido de la ${table}`,
    closeOrder: "Cerrar el pedido",
    close: "Cerrar",
    yourOrder: "Su pedido",
    tableOrder: "Pedido de la mesa",
    showCode: "Muestre este código al camarero",
    qrAria: "Código QR del pedido",
    backToOrder: (items) => `Volver al pedido (${items})`,
    orderMore: "Pedir más",
    shared: "Todos en esta mesa ven y cambian este pedido.",
    empty: "Aún no hay platos en el pedido. Toque «Añadir» en los platos de la carta.",
    ordered: "Ya pedido",
    total: "Total",
    sendQuestion: (items, total) => `¿Enviar el pedido de ${items} (${total})?`,
    back: "Volver",
    sending: "Enviando…",
    confirm: "Confirmar pedido",
    placeOrder: "Hacer pedido",
    confirmedChip: "Confirmado ✓",
    waitingChip: "En espera",
    status: { confirmed: "Pedido confirmado ✓", placed: "Esperando confirmación" },
    errors: {
      cart_full: `El pedido ya tiene ${maxCartItems} artículos, el máximo de una vez. Haga este pedido y luego otro.`,
      line_full: `Máximo ${maxLineQuantity} del mismo plato en una línea.`,
      note_too_long: `La nota puede tener hasta ${maxNoteLength} caracteres.`,
      cart_empty: "El pedido está vacío.",
      order_too_soon: "Se acaba de hacer un pedido en esta mesa. Espere unos segundos.",
      rate_limited: "Demasiados cambios seguidos. Espere un momento.",
      dish_missing: "Este plato ya no está en la carta.",
      table_missing: "Este código de mesa ya no es válido. Pida ayuda al camarero.",
      ordering_off: "Los pedidos desde la carta están desactivados en este momento.",
      network: "Sin conexión. Inténtelo de nuevo.",
      bad_request: "Se ha producido un error. Inténtelo de nuevo.",
    },
  },
  fr: {
    items: (count) => `${count} ${count === 1 ? "article" : "articles"}`,
    each: (price) => `${price} l’unité`,
    lessAria: (dish) => `Un de moins : ${dish}`,
    removeAria: (dish) => `Retirer de la commande : ${dish}`,
    moreAria: (dish) => `Un de plus : ${dish}`,
    remove: "Retirer",
    noteFor: (dish) => `Remarque pour ${dish}`,
    notePlaceholder: "Remarque (ex. : sans oignon)",
    note: "Remarque :",
    view: "Voir",
    order: (number) => `Commande nº ${number}`,
    bar: "Commande",
    tableOrderAria: (table) => `Commande de la ${table}`,
    closeOrder: "Fermer la commande",
    close: "Fermer",
    yourOrder: "Votre commande",
    tableOrder: "Commande de la table",
    showCode: "Montrez ce code au serveur",
    qrAria: "Code QR de la commande",
    backToOrder: (items) => `Retour à la commande (${items})`,
    orderMore: "Commander encore",
    shared: "Tout le monde à cette table voit et modifie cette commande.",
    empty: "Pas encore de plats dans la commande. Touchez «Ajouter» sur les plats de la carte.",
    ordered: "Déjà commandé",
    total: "Total",
    sendQuestion: (items, total) => `Envoyer la commande de ${items} (${total}) ?`,
    back: "Retour",
    sending: "Envoi…",
    confirm: "Confirmer la commande",
    placeOrder: "Commander",
    confirmedChip: "Confirmée ✓",
    waitingChip: "En attente",
    status: { confirmed: "Commande confirmée ✓", placed: "En attente de confirmation" },
    errors: {
      cart_full: `La commande a déjà ${maxCartItems} articles, le maximum en une fois. Passez cette commande, puis une autre.`,
      line_full: `${maxLineQuantity} au maximum du même plat sur une ligne.`,
      note_too_long: `La remarque peut contenir jusqu’à ${maxNoteLength} caractères.`,
      cart_empty: "La commande est vide.",
      order_too_soon: "Une commande vient d’être passée à cette table. Attendez quelques secondes.",
      rate_limited: "Trop de modifications d’affilée. Attendez un instant.",
      dish_missing: "Ce plat n’est plus à la carte.",
      table_missing: "Ce code de table n’est plus valable. Demandez de l’aide au serveur.",
      ordering_off: "Les commandes depuis la carte sont désactivées pour le moment.",
      network: "Pas de connexion. Réessayez.",
      bad_request: "Une erreur s’est produite. Réessayez.",
    },
  },
  de: {
    items: (count) => `${count} Artikel`,
    each: (price) => `je ${price}`,
    lessAria: (dish) => `Eins weniger: ${dish}`,
    removeAria: (dish) => `Aus der Bestellung nehmen: ${dish}`,
    moreAria: (dish) => `Eins mehr: ${dish}`,
    remove: "Entfernen",
    noteFor: (dish) => `Hinweis zu ${dish}`,
    notePlaceholder: "Hinweis (z. B. ohne Zwiebeln)",
    note: "Hinweis:",
    view: "Ansehen",
    order: (number) => `Bestellung Nr. ${number}`,
    bar: "Bestellung",
    tableOrderAria: (table) => `Bestellung von ${table}`,
    closeOrder: "Bestellung schließen",
    close: "Schließen",
    yourOrder: "Ihre Bestellung",
    tableOrder: "Bestellung des Tisches",
    showCode: "Zeigen Sie diesen Code dem Personal",
    qrAria: "QR-Code der Bestellung",
    backToOrder: (items) => `Zurück zur Bestellung (${items})`,
    orderMore: "Mehr bestellen",
    shared: "Alle an diesem Tisch sehen und ändern diese Bestellung.",
    empty: "Noch keine Gerichte in der Bestellung. Tippen Sie bei den Gerichten auf «Hinzufügen».",
    ordered: "Bereits bestellt",
    total: "Summe",
    sendQuestion: (items, total) => `Bestellung mit ${items} (${total}) senden?`,
    back: "Zurück",
    sending: "Wird gesendet…",
    confirm: "Bestellung bestätigen",
    placeOrder: "Bestellen",
    confirmedChip: "Bestätigt ✓",
    waitingChip: "Wartet",
    status: { confirmed: "Bestellung bestätigt ✓", placed: "Wartet auf Bestätigung" },
    errors: {
      cart_full: `Die Bestellung hat schon ${maxCartItems} Artikel, das Maximum auf einmal. Senden Sie diese Bestellung und dann eine weitere.`,
      line_full: `Höchstens ${maxLineQuantity} vom selben Gericht in einer Zeile.`,
      note_too_long: `Der Hinweis darf bis zu ${maxNoteLength} Zeichen haben.`,
      cart_empty: "Die Bestellung ist leer.",
      order_too_soon: "An diesem Tisch wurde gerade bestellt. Warten Sie ein paar Sekunden.",
      rate_limited: "Zu viele Änderungen hintereinander. Warten Sie einen Moment.",
      dish_missing: "Dieses Gericht ist nicht mehr auf der Karte.",
      table_missing: "Dieser Tischcode ist nicht mehr gültig. Bitten Sie das Personal um Hilfe.",
      ordering_off: "Bestellungen über die Karte sind gerade ausgeschaltet.",
      network: "Keine Verbindung. Versuchen Sie es erneut.",
      bad_request: "Ein Fehler ist aufgetreten. Versuchen Sie es erneut.",
    },
  },
  it: {
    items: (count) => `${count} ${count === 1 ? "articolo" : "articoli"}`,
    each: (price) => `${price} cad.`,
    lessAria: (dish) => `Uno in meno: ${dish}`,
    removeAria: (dish) => `Tolga dall’ordine: ${dish}`,
    moreAria: (dish) => `Uno in più: ${dish}`,
    remove: "Rimuova",
    noteFor: (dish) => `Nota per ${dish}`,
    notePlaceholder: "Nota (es.: senza cipolla)",
    note: "Nota:",
    view: "Veda",
    order: (number) => `Ordine n. ${number}`,
    bar: "Ordine",
    tableOrderAria: (table) => `Ordine del ${table}`,
    closeOrder: "Chiuda l’ordine",
    close: "Chiuda",
    yourOrder: "Il Suo ordine",
    tableOrder: "Ordine del tavolo",
    showCode: "Mostri questo codice al personale",
    qrAria: "Codice QR dell’ordine",
    backToOrder: (items) => `Torni all’ordine (${items})`,
    orderMore: "Ordini altro",
    shared: "Tutti a questo tavolo vedono e modificano questo ordine.",
    empty: "Nessun piatto nell’ordine. Tocchi «Aggiunga» sui piatti del menù.",
    ordered: "Già ordinato",
    total: "Totale",
    sendQuestion: (items, total) => `Inviare l’ordine di ${items} (${total})?`,
    back: "Indietro",
    sending: "Invio in corso…",
    confirm: "Confermi l’ordine",
    placeOrder: "Ordini",
    confirmedChip: "Confermato ✓",
    waitingChip: "In attesa",
    status: { confirmed: "Ordine confermato ✓", placed: "In attesa di conferma" },
    errors: {
      cart_full: `L’ordine ha già ${maxCartItems} articoli, il massimo in una volta. Invii questo ordine e poi un altro.`,
      line_full: `Al massimo ${maxLineQuantity} dello stesso piatto in una riga.`,
      note_too_long: `La nota può avere fino a ${maxNoteLength} caratteri.`,
      cart_empty: "L’ordine è vuoto.",
      order_too_soon: "È appena stato fatto un ordine a questo tavolo. Attenda qualche secondo.",
      rate_limited: "Troppe modifiche di seguito. Attenda un momento.",
      dish_missing: "Questo piatto non è più nel menù.",
      table_missing: "Questo codice del tavolo non è più valido. Chieda aiuto al personale.",
      ordering_off: "Gli ordini dal menù sono disattivati in questo momento.",
      network: "Nessuna connessione. Riprovi.",
      bad_request: "Si è verificato un errore. Riprovi.",
    },
  },
};

/** What a table's phone says when something can't be done, in its language. */
export function orderingError(language: MenuLanguage, error: OrderingError | string): string {
  const errors = orderingText[language].errors;
  return error in errors ? errors[error as OrderingError] : errors.bad_request;
}

/** The order bar: "Order · 3 items · €14.50". */
export function orderBar(language: MenuLanguage, count: number, totalCents: number): string {
  const text = orderingText[language];
  return `${text.bar} · ${text.items(count)} · ${formatMenuPrice(totalCents / 100, language)}`;
}

/** "14:32", Lisbon time (the restaurant's), as the language writes the time. */
export function orderClock(language: MenuLanguage, iso: string): string {
  return new Intl.DateTimeFormat(languageLocales[language], { timeZone: orderTimeZone, hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
}

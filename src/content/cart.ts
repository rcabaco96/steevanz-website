import type { LocalizedPartial } from "@/lib/i18n";

export interface CartCopy {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  lead: string;
  add: string;
  addShort: string;
  inCart: string;
  addedAnnouncement: string;
  headerLabel: string;
  headerLabelCount: string;
  accountLabel: string;
  accountHint: { text: string; link: string };
  empty: { title: string; body: string; cta: string };
  groups: {
    oneTime: { title: string; body: string };
    monthly: { title: string; body: string };
  };
  quantity: string;
  decrease: string;
  increase: string;
  remove: string;
  unitPrice: string;
  /** Project products (websites, automation): one per order, price from the proposal. */
  projectFrom: string;
  oneProject: string;
  perMonth: string;
  addMore: string;
  /** Signed-in clients: products already active on the account. */
  owned: { notice: string; removeAll: string };
  summaryTitle: string;
  oneTimeTotal: string;
  monthlyTotal: string;
  pricesNote: string;
  checkout: string;
  checkoutShort: string;
  backToCart: string;
  checkoutTitle: string;
  checkoutLead: string;
  submit: string;
  emptyCartError: string;
  success: { title: string; body: string; reference: string; products: string; home: string };
  itemCount: { one: string; other: string };
  clear: string;
  clearConfirm: string;
  clearYes: string;
  cancel: string;
  /** Next to every amount: prices are shown without VAT, never with VAT added. */
  plusVat: string;
  barOneTime: string;
  barMonthly: string;
  customize: {
    title: string;
    format: string;
    logo: string;
    logoExtra: string;
    logoExtraOnce: string;
    lineExtra: string;
    text: string;
    textPlaceholder: string;
    addVariant: string;
    productHint: string;
  };
  packs: {
    title: string;
    option: string;
    unit: string;
  };
}

export const cartCopy: LocalizedPartial<CartCopy> = {
  pt: {
    metaTitle: "Carrinho | Steevanz",
    metaDescription: "Escolha os produtos Steevanz para o seu negócio e veja quanto fica a pagar.",
    eyebrow: "Carrinho",
    title: "Monte a sua solução.",
    lead: "Escolha os produtos e as quantidades para ver quanto fica a pagar. Não há pagamento no site: enviamos-lhe uma proposta fechada.",
    add: "Adicionar ao carrinho",
    addShort: "Adicionar",
    inCart: "No carrinho",
    addedAnnouncement: "Adicionado ao carrinho.",
    headerLabel: "Carrinho",
    headerLabelCount: "Carrinho, {count} artigos",
    accountLabel: "A minha conta",
    accountHint: { text: "Tem conta? Entre antes de enviar para acompanhar a encomenda e gerir os produtos na sua área de cliente.", link: "Entrar ou criar conta" },
    empty: {
      title: "O seu carrinho está vazio.",
      body: "Adicione os produtos que lhe interessam para ver quanto fica a pagar.",
      cta: "Ver produtos",
    },
    groups: {
      oneTime: { title: "Pagamento único", body: "Paga uma vez, no arranque." },
      monthly: { title: "Mensalidades", body: "Valor cobrado todos os meses." },
    },
    quantity: "Quantidade",
    decrease: "Diminuir quantidade de {name}",
    increase: "Aumentar quantidade de {name}",
    remove: "Remover {name}",
    unitPrice: "cada",
    projectFrom: "desde {price} + IVA",
    oneProject: "1 projeto",
    perMonth: "/mês",
    addMore: "Adicionar outros produtos",
    owned: {
      notice: "Já tem ativo na sua conta: {names}. Não entra nesta encomenda.",
      removeAll: "Tirar do carrinho",
    },
    summaryTitle: "Resumo",
    oneTimeTotal: "A pagar uma vez",
    monthlyTotal: "A pagar por mês",
    pricesNote: "Preços indicativos (valores \"desde\"), sem IVA, confirmados na proposta. Acresce IVA à taxa legal.",
    checkout: "Avançar para checkout",
    checkoutShort: "Avançar",
    backToCart: "Voltar ao carrinho",
    checkoutTitle: "Os seus dados",
    checkoutLead: "Enviamos o pedido à nossa equipa e entramos em contacto com uma proposta. Nada é cobrado agora.",
    submit: "Enviar pedido",
    emptyCartError: "O carrinho está vazio. Adicione pelo menos um produto.",
    success: {
      title: "Pedido enviado.",
      body: "Obrigado! Recebemos a sua escolha e vamos contactá-lo em breve com uma proposta.",
      reference: "Referência",
      products: "Ver produtos",
      home: "Voltar ao início",
    },
    itemCount: { one: "{count} artigo", other: "{count} artigos" },
    clear: "Limpar carrinho",
    clearConfirm: "Remover todos os produtos?",
    clearYes: "Sim, limpar",
    cancel: "Cancelar",
    plusVat: "+ IVA",
    barOneTime: "Único",
    barMonthly: "Mensal",
    customize: {
      title: "Personalização",
      format: "Formato",
      logo: "Com logótipo e cores do negócio",
      logoExtra: "+{price} por unidade",
      logoExtraOnce: "+{price} uma só vez, seja qual for a quantidade",
      lineExtra: "+ {price} de logótipo e cores, uma vez",
      text: "Texto na placa",
      textPlaceholder: "Ex.: Gostou? Deixe-nos a sua opinião!",
      addVariant: "Adicionar outro formato ou versão",
      productHint: "Formato, logótipo e texto escolhem-se no carrinho.",
    },
    packs: {
      title: "Packs com desconto",
      option: "{count} un.",
      unit: "{price}/un.",
    },
  },
  en: {
    metaTitle: "Cart | Steevanz",
    metaDescription: "Pick the Steevanz products for your business and see how much it costs.",
    eyebrow: "Cart",
    title: "Build your setup.",
    lead: "Choose products and quantities to see what you would pay. There is no payment on the website: we send you a fixed-price proposal.",
    add: "Add to cart",
    addShort: "Add",
    inCart: "In cart",
    addedAnnouncement: "Added to cart.",
    headerLabel: "Cart",
    headerLabelCount: "Cart, {count} items",
    accountLabel: "My account",
    accountHint: { text: "Have an account? Sign in before sending to track the order and manage your products in the client area.", link: "Sign in or create an account" },
    empty: {
      title: "Your cart is empty.",
      body: "Add the products you are interested in to see what you would pay.",
      cta: "See products",
    },
    groups: {
      oneTime: { title: "One-off payment", body: "Paid once, at the start." },
      monthly: { title: "Monthly plans", body: "Charged every month." },
    },
    quantity: "Quantity",
    decrease: "Decrease quantity of {name}",
    increase: "Increase quantity of {name}",
    remove: "Remove {name}",
    unitPrice: "each",
    projectFrom: "from {price} + VAT",
    oneProject: "1 project",
    perMonth: "/month",
    addMore: "Add other products",
    owned: {
      notice: "Already active on your account: {names}. It is left out of this order.",
      removeAll: "Remove from cart",
    },
    summaryTitle: "Summary",
    oneTimeTotal: "Paid once",
    monthlyTotal: "Paid monthly",
    pricesNote: "Indicative prices (\"from\" values), excluding VAT, confirmed in your proposal. VAT is added at the legal rate.",
    checkout: "Proceed to checkout",
    checkoutShort: "Checkout",
    backToCart: "Back to cart",
    checkoutTitle: "Your details",
    checkoutLead: "We send your request to our team and get back to you with a proposal. Nothing is charged now.",
    submit: "Send request",
    emptyCartError: "Your cart is empty. Add at least one product.",
    success: {
      title: "Request sent.",
      body: "Thank you! We received your selection and will contact you shortly with a proposal.",
      reference: "Reference",
      products: "See products",
      home: "Back to home",
    },
    itemCount: { one: "{count} item", other: "{count} items" },
    clear: "Clear cart",
    clearConfirm: "Remove all products?",
    clearYes: "Yes, clear",
    cancel: "Cancel",
    plusVat: "+ VAT",
    barOneTime: "One-off",
    barMonthly: "Monthly",
    customize: {
      title: "Customisation",
      format: "Format",
      logo: "With your logo and brand colours",
      logoExtra: "+{price} per unit",
      logoExtraOnce: "+{price} once, whatever the quantity",
      lineExtra: "+ {price} for logo and colours, once",
      text: "Text on the plate",
      textPlaceholder: "e.g. Enjoyed it? Leave us a review!",
      addVariant: "Add another format or version",
      productHint: "Choose the format, logo and text in your cart.",
    },
    packs: {
      title: "Discounted packs",
      option: "{count} pcs",
      unit: "{price}/pc",
    },
  },
  es: {
    metaTitle: "Carrito | Steevanz",
    metaDescription: "Elija los productos Steevanz para su negocio y vea cuánto le costará.",
    eyebrow: "Carrito",
    title: "Monte su solución.",
    lead: "Elija los productos y las cantidades para ver cuánto le costará. No hay pago en la web: le enviamos una propuesta cerrada.",
    add: "Añadir al carrito",
    addShort: "Añadir",
    inCart: "En el carrito",
    addedAnnouncement: "Añadido al carrito.",
    headerLabel: "Carrito",
    headerLabelCount: "Carrito, {count} productos",
    accountLabel: "Mi cuenta",
    accountHint: { text: "¿Tiene cuenta? Inicie sesión antes de enviar para seguir el pedido y gestionar los productos en su área de cliente.", link: "Iniciar sesión o crear cuenta" },
    empty: {
      title: "Su carrito está vacío.",
      body: "Añada los productos que le interesan para ver cuánto le costará.",
      cta: "Ver productos",
    },
    groups: {
      oneTime: { title: "Pago único", body: "Se paga una vez, al empezar." },
      monthly: { title: "Cuotas mensuales", body: "Importe que se cobra cada mes." },
    },
    quantity: "Cantidad",
    decrease: "Reducir la cantidad de {name}",
    increase: "Aumentar la cantidad de {name}",
    remove: "Quitar {name}",
    unitPrice: "cada uno",
    projectFrom: "desde {price} + IVA",
    oneProject: "1 proyecto",
    perMonth: "/mes",
    addMore: "Añadir otros productos",
    owned: {
      notice: "Ya tiene activo en su cuenta: {names}. No se incluye en este pedido.",
      removeAll: "Quitar del carrito",
    },
    summaryTitle: "Resumen",
    oneTimeTotal: "A pagar una vez",
    monthlyTotal: "A pagar al mes",
    pricesNote: "Precios orientativos (importes \"desde\"), sin IVA, confirmados en la propuesta. Se añade el IVA al tipo legal.",
    checkout: "Continuar al pedido",
    checkoutShort: "Continuar",
    backToCart: "Volver al carrito",
    checkoutTitle: "Sus datos",
    checkoutLead: "Enviamos la solicitud a nuestro equipo y le contactamos con una propuesta. No se cobra nada ahora.",
    submit: "Enviar solicitud",
    emptyCartError: "El carrito está vacío. Añada al menos un producto.",
    success: {
      title: "Solicitud enviada.",
      body: "¡Gracias! Hemos recibido su selección y le contactaremos en breve con una propuesta.",
      reference: "Referencia",
      products: "Ver productos",
      home: "Volver al inicio",
    },
    itemCount: { one: "{count} producto", other: "{count} productos" },
    clear: "Vaciar carrito",
    clearConfirm: "¿Quitar todos los productos?",
    clearYes: "Sí, vaciar",
    cancel: "Cancelar",
    plusVat: "+ IVA",
    barOneTime: "Único",
    barMonthly: "Mensual",
    customize: {
      title: "Personalización",
      format: "Formato",
      logo: "Con el logotipo y los colores del negocio",
      logoExtra: "+{price} por unidad",
      logoExtraOnce: "+{price} una sola vez, sea cual sea la cantidad",
      lineExtra: "+ {price} de logotipo y colores, una vez",
      text: "Texto en la placa",
      textPlaceholder: "Ej.: ¿Le ha gustado? ¡Déjenos su opinión!",
      addVariant: "Añadir otro formato o versión",
      productHint: "El formato, el logotipo y el texto se eligen en el carrito.",
    },
    packs: {
      title: "Packs con descuento",
      option: "{count} uds.",
      unit: "{price}/ud.",
    },
  },
  fr: {
    metaTitle: "Panier | Steevanz",
    metaDescription: "Choisissez les produits Steevanz pour votre entreprise et voyez combien cela coûte.",
    eyebrow: "Panier",
    title: "Composez votre solution.",
    lead: "Choisissez les produits et les quantités pour voir combien vous paierez. Aucun paiement sur le site : nous vous envoyons une proposition ferme.",
    add: "Ajouter au panier",
    addShort: "Ajouter",
    inCart: "Dans le panier",
    addedAnnouncement: "Ajouté au panier.",
    headerLabel: "Panier",
    headerLabelCount: "Panier, {count} articles",
    accountLabel: "Mon compte",
    accountHint: { text: "Vous avez un compte ? Connectez-vous avant d'envoyer pour suivre la commande et gérer vos produits dans votre espace client.", link: "Se connecter ou créer un compte" },
    empty: {
      title: "Votre panier est vide.",
      body: "Ajoutez les produits qui vous intéressent pour voir combien vous paierez.",
      cta: "Voir les produits",
    },
    groups: {
      oneTime: { title: "Paiement unique", body: "Payé une seule fois, au démarrage." },
      monthly: { title: "Abonnements mensuels", body: "Montant facturé chaque mois." },
    },
    quantity: "Quantité",
    decrease: "Diminuer la quantité de {name}",
    increase: "Augmenter la quantité de {name}",
    remove: "Retirer {name}",
    unitPrice: "l'unité",
    projectFrom: "à partir de {price} + TVA",
    oneProject: "1 projet",
    perMonth: "/mois",
    addMore: "Ajouter d'autres produits",
    owned: {
      notice: "Déjà actif sur votre compte : {names}. Ce produit n'entre pas dans cette commande.",
      removeAll: "Retirer du panier",
    },
    summaryTitle: "Récapitulatif",
    oneTimeTotal: "À payer une fois",
    monthlyTotal: "À payer par mois",
    pricesNote: "Prix indicatifs (montants « à partir de »), hors TVA, confirmés dans la proposition. La TVA s'ajoute au taux légal.",
    checkout: "Passer la commande",
    checkoutShort: "Continuer",
    backToCart: "Retour au panier",
    checkoutTitle: "Vos coordonnées",
    checkoutLead: "Nous transmettons votre demande à notre équipe et revenons vers vous avec une proposition. Rien n'est facturé maintenant.",
    submit: "Envoyer la demande",
    emptyCartError: "Le panier est vide. Ajoutez au moins un produit.",
    success: {
      title: "Demande envoyée.",
      body: "Merci ! Nous avons bien reçu votre sélection et vous contacterons très vite avec une proposition.",
      reference: "Référence",
      products: "Voir les produits",
      home: "Retour à l'accueil",
    },
    itemCount: { one: "{count} article", other: "{count} articles" },
    clear: "Vider le panier",
    clearConfirm: "Retirer tous les produits ?",
    clearYes: "Oui, vider",
    cancel: "Annuler",
    plusVat: "+ TVA",
    barOneTime: "Unique",
    barMonthly: "Mensuel",
    customize: {
      title: "Personnalisation",
      format: "Format",
      logo: "Avec le logo et les couleurs de l'entreprise",
      logoExtra: "+{price} par unité",
      logoExtraOnce: "+{price} une seule fois, quelle que soit la quantité",
      lineExtra: "+ {price} de logo et couleurs, une fois",
      text: "Texte sur la plaque",
      textPlaceholder: "Ex. : Vous avez aimé ? Laissez-nous votre avis !",
      addVariant: "Ajouter un autre format ou une autre version",
      productHint: "Le format, le logo et le texte se choisissent dans le panier.",
    },
    packs: {
      title: "Packs à prix réduit",
      option: "{count} pcs",
      unit: "{price}/pc",
    },
  },
  de: {
    metaTitle: "Warenkorb | Steevanz",
    metaDescription: "Wählen Sie die Steevanz-Produkte für Ihr Geschäft und sehen Sie, was sie kosten.",
    eyebrow: "Warenkorb",
    title: "Stellen Sie Ihre Lösung zusammen.",
    lead: "Wählen Sie Produkte und Mengen und sehen Sie, was Sie zahlen würden. Auf der Website wird nichts bezahlt: Wir senden Ihnen ein verbindliches Angebot.",
    add: "In den Warenkorb",
    addShort: "Hinzufügen",
    inCart: "Im Warenkorb",
    addedAnnouncement: "Zum Warenkorb hinzugefügt.",
    headerLabel: "Warenkorb",
    headerLabelCount: "Warenkorb, {count} Artikel",
    accountLabel: "Mein Konto",
    accountHint: { text: "Sie haben ein Konto? Melden Sie sich vor dem Absenden an, um die Bestellung zu verfolgen und Ihre Produkte im Kundenbereich zu verwalten.", link: "Anmelden oder Konto erstellen" },
    empty: {
      title: "Ihr Warenkorb ist leer.",
      body: "Fügen Sie die Produkte hinzu, die Sie interessieren, und sehen Sie, was Sie zahlen würden.",
      cta: "Produkte ansehen",
    },
    groups: {
      oneTime: { title: "Einmalzahlung", body: "Einmal zu Beginn bezahlt." },
      monthly: { title: "Monatliche Beträge", body: "Wird jeden Monat berechnet." },
    },
    quantity: "Menge",
    decrease: "Menge von {name} verringern",
    increase: "Menge von {name} erhöhen",
    remove: "{name} entfernen",
    unitPrice: "pro Stück",
    projectFrom: "ab {price} zzgl. MwSt.",
    oneProject: "1 Projekt",
    perMonth: "/Monat",
    addMore: "Weitere Produkte hinzufügen",
    owned: {
      notice: "Bereits in Ihrem Konto aktiv: {names}. Nicht Teil dieser Bestellung.",
      removeAll: "Aus dem Warenkorb entfernen",
    },
    summaryTitle: "Übersicht",
    oneTimeTotal: "Einmalig zu zahlen",
    monthlyTotal: "Monatlich zu zahlen",
    pricesNote: "Richtpreise („ab“-Beträge), ohne MwSt., im Angebot bestätigt. Zuzüglich der gesetzlichen MwSt.",
    checkout: "Weiter zur Bestellung",
    checkoutShort: "Weiter",
    backToCart: "Zurück zum Warenkorb",
    checkoutTitle: "Ihre Angaben",
    checkoutLead: "Wir leiten Ihre Anfrage an unser Team weiter und melden uns mit einem Angebot. Jetzt wird nichts berechnet.",
    submit: "Anfrage senden",
    emptyCartError: "Der Warenkorb ist leer. Fügen Sie mindestens ein Produkt hinzu.",
    success: {
      title: "Anfrage gesendet.",
      body: "Vielen Dank! Wir haben Ihre Auswahl erhalten und melden uns in Kürze mit einem Angebot.",
      reference: "Referenz",
      products: "Produkte ansehen",
      home: "Zur Startseite",
    },
    itemCount: { one: "{count} Artikel", other: "{count} Artikel" },
    clear: "Warenkorb leeren",
    clearConfirm: "Alle Produkte entfernen?",
    clearYes: "Ja, leeren",
    cancel: "Abbrechen",
    plusVat: "zzgl. MwSt.",
    barOneTime: "Einmalig",
    barMonthly: "Monatlich",
    customize: {
      title: "Gestaltung",
      format: "Format",
      logo: "Mit Logo und Farben Ihres Geschäfts",
      logoExtra: "+{price} pro Stück",
      logoExtraOnce: "+{price} einmalig, unabhängig von der Menge",
      lineExtra: "+ {price} für Logo und Farben, einmalig",
      text: "Text auf dem Schild",
      textPlaceholder: "z. B. Hat es Ihnen gefallen? Hinterlassen Sie uns eine Bewertung!",
      addVariant: "Weiteres Format oder weitere Version hinzufügen",
      productHint: "Format, Logo und Text wählen Sie im Warenkorb.",
    },
    packs: {
      title: "Rabattpakete",
      option: "{count} Stk.",
      unit: "{price}/Stk.",
    },
  },
  it: {
    metaTitle: "Carrello | Steevanz",
    metaDescription: "Scelga i prodotti Steevanz per la Sua attività e veda quanto costano.",
    eyebrow: "Carrello",
    title: "Componga la Sua soluzione.",
    lead: "Scelga prodotti e quantità per vedere quanto pagherà. Sul sito non si paga nulla: Le inviamo una proposta definitiva.",
    add: "Aggiunga al carrello",
    addShort: "Aggiunga",
    inCart: "Nel carrello",
    addedAnnouncement: "Aggiunto al carrello.",
    headerLabel: "Carrello",
    headerLabelCount: "Carrello, {count} articoli",
    accountLabel: "Il mio account",
    accountHint: { text: "Ha un account? Acceda prima di inviare per seguire l'ordine e gestire i prodotti nella Sua area clienti.", link: "Acceda o crei un account" },
    empty: {
      title: "Il Suo carrello è vuoto.",
      body: "Aggiunga i prodotti che Le interessano per vedere quanto pagherà.",
      cta: "Veda i prodotti",
    },
    groups: {
      oneTime: { title: "Pagamento unico", body: "Si paga una volta, all'avvio." },
      monthly: { title: "Canoni mensili", body: "Importo addebitato ogni mese." },
    },
    quantity: "Quantità",
    decrease: "Diminuisca la quantità di {name}",
    increase: "Aumenti la quantità di {name}",
    remove: "Rimuova {name}",
    unitPrice: "cad.",
    projectFrom: "da {price} + IVA",
    oneProject: "1 progetto",
    perMonth: "/mese",
    addMore: "Aggiunga altri prodotti",
    owned: {
      notice: "Già attivo sul Suo account: {names}. Non rientra in questo ordine.",
      removeAll: "Tolga dal carrello",
    },
    summaryTitle: "Riepilogo",
    oneTimeTotal: "Da pagare una volta",
    monthlyTotal: "Da pagare al mese",
    pricesNote: "Prezzi indicativi (importi \"da\"), IVA esclusa, confermati nella proposta. Si aggiunge l'IVA all'aliquota di legge.",
    checkout: "Proceda all'ordine",
    checkoutShort: "Proceda",
    backToCart: "Torni al carrello",
    checkoutTitle: "I Suoi dati",
    checkoutLead: "Inoltriamo la richiesta al nostro team e La ricontattiamo con una proposta. Ora non viene addebitato nulla.",
    submit: "Invii la richiesta",
    emptyCartError: "Il carrello è vuoto. Aggiunga almeno un prodotto.",
    success: {
      title: "Richiesta inviata.",
      body: "Grazie! Abbiamo ricevuto la Sua scelta e La contatteremo presto con una proposta.",
      reference: "Riferimento",
      products: "Veda i prodotti",
      home: "Torni alla home",
    },
    itemCount: { one: "{count} articolo", other: "{count} articoli" },
    clear: "Svuoti il carrello",
    clearConfirm: "Rimuovere tutti i prodotti?",
    clearYes: "Sì, svuoti",
    cancel: "Annulli",
    plusVat: "+ IVA",
    barOneTime: "Unico",
    barMonthly: "Mensile",
    customize: {
      title: "Personalizzazione",
      format: "Formato",
      logo: "Con logo e colori dell'attività",
      logoExtra: "+{price} per unità",
      logoExtraOnce: "+{price} una sola volta, qualunque sia la quantità",
      lineExtra: "+ {price} per logo e colori, una volta",
      text: "Testo sulla targa",
      textPlaceholder: "Es.: Le è piaciuto? Ci lasci la Sua opinione!",
      addVariant: "Aggiunga un altro formato o versione",
      productHint: "Formato, logo e testo si scelgono nel carrello.",
    },
    packs: {
      title: "Pacchetti scontati",
      option: "{count} pz",
      unit: "{price}/pz",
    },
  },
};

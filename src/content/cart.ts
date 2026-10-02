import type { Localized } from "@/lib/i18n";

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
  perMonth: string;
  addMore: string;
  summaryTitle: string;
  subtotal: string;
  vat: string;
  total: string;
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
  vatIncluded: string;
  barOneTime: string;
  barMonthly: string;
  customize: {
    title: string;
    format: string;
    logo: string;
    logoExtra: string;
    text: string;
    textPlaceholder: string;
    addVariant: string;
    productHint: string;
  };
}

export const cartCopy: Localized<CartCopy> = {
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
    perMonth: "/mês",
    addMore: "Adicionar outros produtos",
    summaryTitle: "Resumo",
    subtotal: "Subtotal",
    vat: "IVA ({rate}%)",
    total: "Total",
    oneTimeTotal: "A pagar uma vez",
    monthlyTotal: "A pagar por mês",
    pricesNote: "Preços indicativos (valores \"desde\"), confirmados na proposta.",
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
    vatIncluded: "c/ IVA",
    barOneTime: "Único",
    barMonthly: "Mensal",
    customize: {
      title: "Personalização",
      format: "Formato",
      logo: "Com logótipo e cores do negócio",
      logoExtra: "+{price} por unidade",
      text: "Texto na placa",
      textPlaceholder: "Ex.: Gostou? Deixe-nos a sua opinião!",
      addVariant: "Adicionar outro formato ou versão",
      productHint: "Formato, logótipo e texto escolhem-se no carrinho.",
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
    perMonth: "/month",
    addMore: "Add other products",
    summaryTitle: "Summary",
    subtotal: "Subtotal",
    vat: "VAT ({rate}%)",
    total: "Total",
    oneTimeTotal: "Paid once",
    monthlyTotal: "Paid monthly",
    pricesNote: "Indicative prices (\"from\" values), confirmed in your proposal.",
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
    vatIncluded: "incl. VAT",
    barOneTime: "One-off",
    barMonthly: "Monthly",
    customize: {
      title: "Customisation",
      format: "Format",
      logo: "With your logo and brand colours",
      logoExtra: "+{price} per unit",
      text: "Text on the plate",
      textPlaceholder: "e.g. Enjoyed it? Leave us a review!",
      addVariant: "Add another format or version",
      productHint: "Choose the format, logo and text in your cart.",
    },
  },
};

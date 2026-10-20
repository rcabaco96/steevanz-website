// Relative imports with extensions keep this module runnable by `node --test` (tests/i18n-group-b.test.mjs).
import { localizePartial, type Locale, type Localized } from "../../lib/i18n.ts";
import { href } from "../../lib/routes.ts";
import { productCopy } from "../product-copy/index.ts";
import type { DocBlock, DocPageContent, DocPageId, ProductCopy, ProductDocs } from "../types.ts";
import type { WebProductId } from "../web-products.ts";

/**
 * One set of docs for the three website products (landing page, website, online shop): the
 * project runs the same way, so the pages share their text and change only where the product does.
 */

interface WebFacts {
  /** Delivery time after the content is complete. */
  days: Record<Locale, string>;
  monthly: Record<Locale, string>;
  allowance: Record<Locale, string>;
  /** «a página» / «o site» / «a loja», used inside sentences (German: nominative only). */
  thing: Record<Locale, string>;
  /** «pronta» / «pronto» (pt), «prête» / «prêt» (fr), «pronta» / «pronto» (it): agrees with `thing`. */
  ready: { pt: string; fr: string; it: string };
  isShop: boolean;
}

const facts: Record<WebProductId, WebFacts> = {
  "landing-page": {
    days: { pt: "5 dias úteis", en: "5 working days", es: "5 días laborables", fr: "5 jours ouvrés", de: "5 Werktage", it: "5 giorni lavorativi" },
    monthly: { pt: "15 € + IVA por mês", en: "€15 + VAT a month", es: "15 € + IVA al mes", fr: "15 € + TVA par mois", de: "15 € zzgl. MwSt. pro Monat", it: "15 € + IVA al mese" },
    allowance: { pt: "30 minutos", en: "30 minutes", es: "30 minutos", fr: "30 minutes", de: "30 Minuten", it: "30 minuti" },
    thing: { pt: "a página", en: "the page", es: "la página", fr: "la page", de: "die Seite", it: "la pagina" },
    ready: { pt: "pronta", fr: "prête", it: "pronta" },
    isShop: false,
  },
  website: {
    days: { pt: "10 dias úteis", en: "10 working days", es: "10 días laborables", fr: "10 jours ouvrés", de: "10 Werktage", it: "10 giorni lavorativi" },
    monthly: { pt: "25 € + IVA por mês", en: "€25 + VAT a month", es: "25 € + IVA al mes", fr: "25 € + TVA par mois", de: "25 € zzgl. MwSt. pro Monat", it: "25 € + IVA al mese" },
    allowance: { pt: "1 hora", en: "1 hour", es: "1 hora", fr: "1 heure", de: "1 Stunde", it: "1 ora" },
    thing: { pt: "o site", en: "the website", es: "la web", fr: "le site", de: "die Website", it: "il sito" },
    ready: { pt: "pronto", fr: "prêt", it: "pronto" },
    isShop: false,
  },
  "online-shop": {
    days: { pt: "15 a 20 dias úteis", en: "15 to 20 working days", es: "15 a 20 días laborables", fr: "15 à 20 jours ouvrés", de: "15 bis 20 Werktage", it: "15-20 giorni lavorativi" },
    monthly: {
      pt: "19 € + IVA por mês e 3% por venda",
      en: "€19 + VAT a month and 3% per sale",
      es: "19 € + IVA al mes y 3 % por venta",
      fr: "19 € + TVA par mois et 3 % par vente",
      de: "19 € zzgl. MwSt. pro Monat und 3 % pro Verkauf",
      it: "19 € + IVA al mese e 3% per vendita",
    },
    allowance: { pt: "1 h 30", en: "1.5 hours", es: "1 h 30", fr: "1 h 30", de: "1,5 Stunden", it: "1 ora e mezza" },
    thing: { pt: "a loja", en: "the shop", es: "la tienda", fr: "la boutique", de: "der Shop", it: "il negozio" },
    ready: { pt: "pronta", fr: "prête", it: "pronto" },
    isShop: true,
  },
};

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);
const only = <T,>(condition: boolean, items: T[]): T[] => (condition ? items : []);

/** The links a doc page points to, in the page's own language. */
function linksIn(locale: Locale, productId: WebProductId) {
  return {
    product: href(locale, { key: "product", productId }),
    setup: href(locale, { key: "doc", productId, pageId: "setup" }),
    configuration: href(locale, { key: "doc", productId, pageId: "configuration" }),
    usage: href(locale, { key: "doc", productId, pageId: "usage" }),
    cart: href(locale, { key: "cart" }),
    contact: href(locale, { key: "contact" }),
  };
}

type Links = ReturnType<typeof linksIn>;

/** What a Spanish, French, German or Italian page is built from: the product page in that language, its facts and links. */
interface DocContext {
  f: WebFacts;
  c: ProductCopy;
  link: Links;
}

type DocSet = Record<DocPageId, DocPageContent>;

function pages(productId: WebProductId): Record<DocPageId, Localized<DocPageContent>> {
  const f = facts[productId];
  const pt = productCopy[productId].pt;
  const en = productCopy[productId].en;
  const link = { pt: linksIn("pt", productId), en: linksIn("en", productId) };
  const context = (locale: "es" | "fr" | "de" | "it"): DocContext => ({
    f,
    c: localizePartial(productCopy[productId], locale),
    link: linksIn(locale, productId),
  });
  const extra = { es: docsEs(context("es")), fr: docsFr(context("fr")), de: docsDe(context("de")), it: docsIt(context("it")) };
  const withExtra = (id: DocPageId, base: { pt: DocPageContent; en: DocPageContent }): Localized<DocPageContent> => ({
    ...base,
    es: extra.es[id],
    fr: extra.fr[id],
    de: extra.de[id],
    it: extra.it[id],
  });

  const gettingStartedPt: DocBlock[] = [
    { type: "p", text: `**${pt.name}.** ${pt.summary}` },
    { type: "h2", id: "para-quem", text: "Para quem é" },
    { type: "ul", items: pt.useCases.map((useCase) => `**${useCase.title}:** ${useCase.body}`) },
    { type: "h2", id: "como-decorre", text: "Como decorre o projeto" },
    { type: "steps", items: pt.steps },
    { type: "h2", id: "prazo", text: "Prazo" },
    {
      type: "p",
      text: `${capitalize(f.thing.pt)} fica ${f.ready.pt} em **${f.days.pt}** depois de recebermos os conteúdos completos. Antes de publicar, mostramos a primeira versão num link privado e tem 2 rondas de alterações incluídas.`,
    },
    {
      type: "callout",
      tone: "tip",
      title: "Comece a juntar os conteúdos",
      text: `Logótipo, fotos e os dados da empresa são o que mais atrasa um projeto. Veja a [lista do que precisamos](${link.pt.setup}) e vá juntando o que já tem.`,
    },
    { type: "h2", id: "proximos-passos", text: "Próximos passos" },
    {
      type: "p",
      text: `Veja a [página do produto](${link.pt.product}) com preços e opções, ou faça o pedido no [carrinho](${link.pt.cart}): respondemos com uma proposta de preço fechado.`,
    },
  ];

  const gettingStartedEn: DocBlock[] = [
    { type: "p", text: `**${en.name}.** ${en.summary}` },
    { type: "h2", id: "who-its-for", text: "Who it's for" },
    { type: "ul", items: en.useCases.map((useCase) => `**${useCase.title}:** ${useCase.body}`) },
    { type: "h2", id: "how-it-runs", text: "How the project runs" },
    { type: "steps", items: en.steps },
    { type: "h2", id: "timeline", text: "Timeline" },
    {
      type: "p",
      text: `${capitalize(f.thing.en)} is ready **${f.days.en}** after we receive all your content. Before launch, we show you the first version on a private link, and two rounds of changes are included.`,
    },
    {
      type: "callout",
      tone: "tip",
      title: "Start gathering your content",
      text: `Logo, photos and company details are what usually slows a project down. See the [list of what we need](${link.en.setup}) and start collecting what you already have.`,
    },
    { type: "h2", id: "next-steps", text: "Next steps" },
    {
      type: "p",
      text: `See the [product page](${link.en.product}) for prices and options, or send your request from the [cart](${link.en.cart}): we reply with a fixed-price proposal.`,
    },
  ];

  const setupPt: DocBlock[] = [
    {
      type: "p",
      text: "Depois de aceitar a proposta e pagar os primeiros 50%, enviamos-lhe esta lista. Quanto mais depressa chegar tudo, mais depressa começamos: o prazo conta a partir dos conteúdos completos.",
    },
    { type: "h2", id: "lista", text: "O que precisamos de si" },
    {
      type: "ol",
      items: [
        "**Dados da empresa:** nome, NIF, morada, telefone, email, horário e redes sociais.",
        "**Marca:** logótipo (de preferência em vetor), cores e, se tiver, os tipos de letra.",
        f.isShop
          ? "**Produtos:** uma foto por produto e a folha de cálculo que lhe enviamos, com nome, descrição, preço com IVA, variantes, stock, peso e categoria."
          : "**Fotos:** suas ou de bancos de imagens com licença.",
        "**Textos** de cada secção ou página, ou a opção de copywriting com uma chamada de 20 minutos.",
        "**Domínio:** o acesso ao registo do domínio que já tem, ou o nome que quer registar em seu nome.",
        "**Livro de Reclamações Eletrónico:** o registo do negócio na plataforma, que tem de ser feito por si.",
        ...only(f.isShop, [
          "**Venda online:** a entidade de resolução alternativa de litígios a que está ligado, a política de devoluções, as zonas e os valores de envio.",
          "**Contas:** conta no fornecedor de pagamentos (ajudamos a escolher e a abrir) e, se quiser faturação automática, conta no Moloni ou no InvoiceXpress.",
        ]),
        "**Casos especiais:** número de registo RNAL, no alojamento local, ou registo na ERS, nas clínicas, quando se aplique.",
        "**Referências:** 2 ou 3 sites de que gosta, e o que não quer ver no seu.",
      ],
    },
    { type: "h2", id: "dominio", text: "Domínio" },
    {
      type: "p",
      text: "O domínio fica sempre registado em seu nome. Se já tem um, precisamos do acesso ao registo (ou que alguém altere os DNS por nós). Se não tem, ajudamos a escolher e a registar: um domínio .pt custa cerca de 15 a 20 € por ano. Podemos geri-lo por si, como opção.",
    },
    { type: "h2", id: "email", text: "Email profissional" },
    {
      type: "p",
      text: "Configuramos o email com o seu domínio no Google Workspace, no Microsoft 365 ou no Zoho. A licença paga-se diretamente ao fornecedor (por exemplo, cerca de 8 € por utilizador e por mês no Google Workspace).",
    },
    {
      type: "callout",
      tone: "warning",
      title: "O prazo conta a partir dos conteúdos completos",
      text: `Os ${f.days.pt} começam quando temos tudo o que está na lista${f.isShop ? ", incluindo a conta de pagamentos aprovada" : ""}. Se faltar alguma coisa, avisamos logo.`,
    },
    { type: "p", text: `A seguir: veja como ligamos as ferramentas e tratamos do Google na [configuração](${link.pt.configuration}).` },
  ];

  const setupEn: DocBlock[] = [
    {
      type: "p",
      text: "Once you accept the proposal and pay the first 50%, we send you this list. The sooner everything arrives, the sooner we start: the timeline counts from complete content.",
    },
    { type: "h2", id: "checklist", text: "What we need from you" },
    {
      type: "ol",
      items: [
        "**Company details:** name, tax number (NIF), address, phone, email, opening hours and social links.",
        "**Brand:** logo (vector if possible), colours and, if you have them, fonts.",
        f.isShop
          ? "**Products:** one photo per product and the spreadsheet we send you, with name, description, price incl. VAT, variants, stock, weight and category."
          : "**Photos:** your own or properly licensed stock.",
        "**Texts** for each section or page, or the copywriting option with a 20-minute call.",
        "**Domain:** access to the domain you already have, or the name you want registered in your name.",
        "**Electronic complaints book:** your business's registration on the platform, which you have to do yourself.",
        ...only(f.isShop, [
          "**Selling online:** the alternative dispute resolution body you belong to, your returns policy, shipping zones and rates.",
          "**Accounts:** a payment provider account (we help you choose and open it) and, for automatic invoicing, a Moloni or InvoiceXpress account.",
        ]),
        "**Special cases:** the RNAL licence number for holiday rentals, or the ERS registration for clinics, where it applies.",
        "**References:** 2 or 3 websites you like, and anything you don't want on yours.",
      ],
    },
    { type: "h2", id: "domain", text: "Domain" },
    {
      type: "p",
      text: "The domain is always registered in your name. If you have one, we need access to it (or someone to change the DNS for us). If not, we help you choose and register one: a .pt domain costs about €15 to €20 a year. We can manage it for you as an option.",
    },
    { type: "h2", id: "email", text: "Professional email" },
    {
      type: "p",
      text: "We set up email on your domain with Google Workspace, Microsoft 365 or Zoho. You pay the licence straight to the provider (for example, about €8 per user a month for Google Workspace).",
    },
    {
      type: "callout",
      tone: "warning",
      title: "The timeline counts from complete content",
      text: `The ${f.days.en} start once we have everything on the list${f.isShop ? ", including an approved payment account" : ""}. If something is missing, we tell you straight away.`,
    },
    { type: "p", text: `Next: see how we connect your tools and set up Google in [configuration](${link.en.configuration}).` },
  ];

  const configurationPt: DocBlock[] = [
    { type: "p", text: `Tudo o que está nesta página fica configurado por nós antes de publicar ${f.thing.pt}.` },
    { type: "h2", id: "ferramentas-steevanz", text: "Ferramentas Steevanz" },
    {
      type: "p",
      text: "Se já usa produtos Steevanz, ligamo-los sem custo extra de construção:",
    },
    {
      type: "table",
      head: ["Ferramenta", "Como aparece"],
      rows: [
        ["Reservas", "Botão «Reservar» que abre a sua página de reservas"],
        ["Lista de espera", "Ligação para o cliente entrar na fila e acompanhar a vez"],
        ["Menu digital", "Página ou botão «Ver o menu», sempre atualizado"],
        ["Cartão de fidelidade", "Botão para o cliente aderir ao cartão"],
        ["Chatbot com IA", "Janela de conversa para responder a perguntas"],
        ["Reviews", "Botão «Deixe uma review» que abre a sua página no Google"],
      ],
    },
    { type: "h2", id: "google", text: "Google e SEO" },
    {
      type: "ul",
      items: [
        "Título e descrição em cada página, e dados estruturados do negócio.",
        "Mapa do site enviado ao Google e Google Search Console configurada.",
        "Nome, morada e telefone iguais aos do seu perfil no Google.",
        "Imagem de partilha para redes sociais e WhatsApp.",
        "Estatísticas de visitas sem cookies, que respeitam a privacidade.",
      ],
    },
    {
      type: "callout",
      tone: "info",
      text: "Não prometemos posições no Google: dependem de muitos fatores, como as reviews e a concorrência. Garantimos que fica bem construído e registado.",
    },
    { type: "h2", id: "regras", text: "Cookies, privacidade e Livro de Reclamações" },
    {
      type: "ul",
      items: [
        "Aviso de cookies com «Rejeitar» tão fácil como «Aceitar», e nada que não seja essencial antes do consentimento.",
        "Política de privacidade e de cookies, a partir de modelos que valida.",
        "Ligação ao Livro de Reclamações Eletrónico, bem visível.",
        "Identificação da empresa e preços com IVA incluído.",
        "Construção segundo as regras de acessibilidade WCAG 2.1 AA.",
      ],
    },
    ...only<DocBlock>(f.isShop, [
      { type: "h2", id: "pagamentos-envios", text: "Pagamentos, envios e faturação" },
      {
        type: "ul",
        items: [
          "**Pagamentos:** MB WAY, referência Multibanco e cartão, com a sua conta no fornecedor (ifthenpay, Eupago, Easypay ou Stripe). O dinheiro entra na sua conta.",
          "**Envios:** tabelas por zona e peso (continente, ilhas, UE), envio grátis a partir de um valor e levantamento na loja.",
          "**Checkout:** total com IVA e portes antes de pagar, e botão «Encomendar com obrigação de pagar».",
          "**Faturação:** cada venda tem de ter fatura de software certificado. Como opção, ligamos o Moloni ou o InvoiceXpress.",
          "**Venda à distância:** termos de venda, direito de livre resolução de 14 dias com formulário, e a entidade de resolução alternativa de litígios.",
        ],
      },
    ]),
    { type: "h2", id: "linguas", text: "Línguas" },
    {
      type: "p",
      text: "Cada língua extra é uma opção na proposta. Traduzimos e valida antes de publicar; recomendamos revisão por um falante nativo.",
    },
    { type: "p", text: `A seguir: como pedir alterações depois de publicar, na [utilização](${link.pt.usage}).` },
  ];

  const configurationEn: DocBlock[] = [
    { type: "p", text: `We set up everything on this page before ${f.thing.en} goes live.` },
    { type: "h2", id: "steevanz-tools", text: "Steevanz tools" },
    { type: "p", text: "If you already use Steevanz products, we connect them at no extra build cost:" },
    {
      type: "table",
      head: ["Tool", "How it shows up"],
      rows: [
        ["Bookings", "A «Book» button that opens your booking page"],
        ["Waitlist", "A link for customers to join the queue and follow their turn"],
        ["Digital menu", "A «See the menu» page or button, always up to date"],
        ["Loyalty card", "A button for customers to join your card"],
        ["AI chatbot", "A chat window that answers questions"],
        ["Reviews", "A «Leave a review» button that opens your Google page"],
      ],
    },
    { type: "h2", id: "google", text: "Google and SEO" },
    {
      type: "ul",
      items: [
        "Title and description on every page, plus structured business data.",
        "Sitemap sent to Google and Google Search Console set up.",
        "Name, address and phone matching your Google Business Profile.",
        "A share image for social media and WhatsApp.",
        "Cookie-free visit statistics that respect privacy.",
      ],
    },
    {
      type: "callout",
      tone: "info",
      text: "We don't promise Google rankings: they depend on many factors, such as reviews and competition. We make sure the site is built and registered properly.",
    },
    { type: "h2", id: "rules", text: "Cookies, privacy and complaints book" },
    {
      type: "ul",
      items: [
        "Cookie banner where «Reject» is as easy as «Accept», with nothing non-essential loading before consent.",
        "Privacy and cookie policies, from templates you approve.",
        "A clearly visible link to the Portuguese electronic complaints book.",
        "Company details and prices with VAT included.",
        "Built to the WCAG 2.1 AA accessibility guidelines.",
      ],
    },
    ...only<DocBlock>(f.isShop, [
      { type: "h2", id: "payments-shipping", text: "Payments, shipping and invoicing" },
      {
        type: "ul",
        items: [
          "**Payments:** MB WAY, Multibanco reference and cards, on your own provider account (ifthenpay, Eupago, Easypay or Stripe). The money goes to your account.",
          "**Shipping:** rates by zone and weight (mainland, islands, EU), free shipping above a set amount and in-store pickup.",
          "**Checkout:** total with VAT and shipping shown before payment, and an «Order with obligation to pay» button.",
          "**Invoicing:** every sale needs an invoice from certified software. As an option, we connect Moloni or InvoiceXpress.",
          "**Distance selling:** terms of sale, the 14-day right of withdrawal with a form, and the alternative dispute resolution body.",
        ],
      },
    ]),
    { type: "h2", id: "languages", text: "Languages" },
    {
      type: "p",
      text: "Each extra language is an option in the proposal. We translate and you approve before launch; we recommend a review by a native speaker.",
    },
    { type: "p", text: `Next: how to request changes after launch, in [usage](${link.en.usage}).` },
  ];

  const usagePt: DocBlock[] = [
    {
      type: "p",
      text: `Depois de publicar, não precisa de mexer em nada técnico: o plano mensal (${f.monthly.pt}) cobre o alojamento, a segurança e as pequenas alterações.`,
    },
    { type: "h2", id: "pedir-alteracao", text: "Pedir uma alteração" },
    {
      type: "ol",
      items: [
        "Envie uma mensagem por WhatsApp ou email com o que quer mudar e onde.",
        "Junte o texto novo, as fotos ou uma captura de ecrã, se ajudar.",
        "Confirmamos o pedido e avisamos quando estiver publicado.",
      ],
    },
    { type: "h2", id: "pequenas-alteracoes", text: "O que conta como pequena alteração" },
    {
      type: "table",
      head: ["Incluído no plano", "Fica em proposta à parte"],
      rows: [
        ["Mudar horários, preços, textos ou fotos", "Páginas ou secções novas"],
        ["Trocar um serviço ou um prato", "Uma língua nova"],
        ["Atualizar um aviso ou uma campanha", "Funcionalidades novas (formulários avançados, blog)"],
      ],
    },
    {
      type: "p",
      text: `O plano inclui até **${f.allowance.pt}** de pequenas alterações por mês. Se um pedido passar disso, dizemos o valor antes de avançar.`,
    },
    ...only<DocBlock>(f.isShop, [
      { type: "h2", id: "encomendas", text: "Gerir encomendas" },
      {
        type: "ul",
        items: [
          "Cada encomenda paga chega-lhe por email e fica no painel da loja.",
          "Prepare o envio, marque a encomenda como enviada e junte o código de seguimento: o cliente recebe-o por email.",
          "Devoluções e reembolsos fazem-se no painel da loja ou do fornecedor de pagamentos. Explicamos tudo na formação.",
          "Com a faturação ligada, a fatura sai sozinha a cada encomenda paga.",
        ],
      },
    ]),
    { type: "h2", id: "plano-mensal", text: "Plano mensal" },
    {
      type: "ul",
      items: [
        "Alojamento, certificado de segurança, monitorização e cópias de segurança.",
        "Atualizações de segurança.",
        "Suporte por WhatsApp e email.",
        "Sem fidelização: cancela com 30 dias de aviso e entregamos-lhe os ficheiros para alojar noutro lado.",
      ],
    },
  ];

  const usageEn: DocBlock[] = [
    {
      type: "p",
      text: `After launch, you don't need to touch anything technical: the monthly plan (${f.monthly.en}) covers hosting, security and small changes.`,
    },
    { type: "h2", id: "request-a-change", text: "Requesting a change" },
    {
      type: "ol",
      items: [
        "Send a WhatsApp message or email saying what you want to change and where.",
        "Attach the new text, photos or a screenshot if it helps.",
        "We confirm the request and let you know when it's live.",
      ],
    },
    { type: "h2", id: "small-changes", text: "What counts as a small change" },
    {
      type: "table",
      head: ["Included in the plan", "Quoted separately"],
      rows: [
        ["Changing hours, prices, texts or photos", "New pages or sections"],
        ["Swapping a service or a dish", "A new language"],
        ["Updating a notice or a campaign", "New features (advanced forms, blog)"],
      ],
    },
    {
      type: "p",
      text: `The plan includes up to **${f.allowance.en}** of small changes a month. If a request goes beyond that, we tell you the price before going ahead.`,
    },
    ...only<DocBlock>(f.isShop, [
      { type: "h2", id: "orders", text: "Managing orders" },
      {
        type: "ul",
        items: [
          "Every paid order reaches you by email and appears in the shop dashboard.",
          "Prepare the parcel, mark the order as shipped and add the tracking code: the customer gets it by email.",
          "Returns and refunds are handled in the shop or payment provider dashboard. We cover this in the training.",
          "With invoicing connected, the invoice is issued automatically for every paid order.",
        ],
      },
    ]),
    { type: "h2", id: "monthly-plan", text: "Monthly plan" },
    {
      type: "ul",
      items: [
        "Hosting, security certificate, monitoring and backups.",
        "Security updates.",
        "Support by WhatsApp and email.",
        "No lock-in: cancel with 30 days' notice and we hand over the files so you can host elsewhere.",
      ],
    },
  ];

  const troubleshootingPt: DocBlock[] = [
    { type: "p", text: "Os problemas mais comuns e o que fazer. Se não resolver, fale connosco por WhatsApp ou email." },
    {
      type: "table",
      head: ["Problema", "O que fazer"],
      rows: [
        ["Não abre depois de mudar o domínio", "A mudança de DNS pode levar até 48 horas a chegar a todo o lado. Se passar disso, avise-nos."],
        ["Não recebo os emails do formulário", "Veja a pasta de spam e marque o remetente como seguro. Se continuar, avise-nos para testarmos o envio."],
        ["Ainda não aparece no Google", "O Google demora dias ou semanas a mostrar um site novo. Já enviámos o mapa do site; pesquise pelo nome do negócio dentro de alguns dias."],
        ["Vejo informação antiga", "Atualize a página ou abra-a numa janela privada. As alterações podem levar alguns minutos a aparecer."],
        ["Aparece um aviso de segurança", "Não deve acontecer: o certificado renova-se sozinho. Envie-nos uma captura de ecrã."],
        ...only(f.isShop, [
          ["Pagamento MB WAY por concluir", "O cliente tem de aprovar o pagamento na app dentro do prazo. Se expirar, a encomenda fica por pagar e o cliente pode tentar de novo."],
          ["Referência Multibanco sem pagamento", "A referência tem um prazo definido no fornecedor. Depois disso, a encomenda pode ser cancelada."],
        ]),
      ],
    },
    {
      type: "callout",
      tone: "tip",
      text: `Ao pedir ajuda, diga-nos o endereço da página, o que estava a fazer e, se possível, envie uma captura de ecrã. Contactos na página [Contacto](${link.pt.contact}).`,
    },
  ];

  const troubleshootingEn: DocBlock[] = [
    { type: "p", text: "The most common issues and what to do. If that doesn't fix it, contact us by WhatsApp or email." },
    {
      type: "table",
      head: ["Issue", "What to do"],
      rows: [
        ["It doesn't open after a domain change", "DNS changes can take up to 48 hours to reach everywhere. If it takes longer, let us know."],
        ["Form emails don't arrive", "Check your spam folder and mark the sender as safe. If it keeps happening, tell us and we'll test it."],
        ["It's not on Google yet", "Google takes days or weeks to show a new website. We've already sent the sitemap; search for your business name in a few days."],
        ["I see old information", "Refresh the page or open it in a private window. Changes can take a few minutes to show."],
        ["A security warning appears", "It shouldn't happen: the certificate renews itself. Send us a screenshot."],
        ...only(f.isShop, [
          ["An MB WAY payment isn't completed", "The customer has to approve it in the app within the time limit. If it expires, the order stays unpaid and the customer can try again."],
          ["An unpaid Multibanco reference", "The reference has a deadline set at the provider. After that, the order can be cancelled."],
        ]),
      ],
    },
    {
      type: "callout",
      tone: "tip",
      text: `When asking for help, tell us the page address, what you were doing and, if you can, send a screenshot. Our details are on the [Contact](${link.en.contact}) page.`,
    },
  ];

  return {
    "getting-started": withExtra("getting-started", {
      pt: { title: `Primeiros passos: ${pt.name}`, description: pt.metaDescription, blocks: gettingStartedPt },
      en: { title: `Getting started: ${en.name}`, description: en.metaDescription, blocks: gettingStartedEn },
    }),
    setup: withExtra("setup", {
      pt: {
        title: "Arranque do projeto: o que precisamos de si",
        description: `A lista de conteúdos, o domínio e o email para começar ${f.thing.pt} com a Steevanz.`,
        blocks: setupPt,
      },
      en: {
        title: "Project kick-off: what we need from you",
        description: `The content checklist, domain and email to get ${f.thing.en} started with Steevanz.`,
        blocks: setupEn,
      },
    }),
    configuration: withExtra("configuration", {
      pt: {
        title: "Configuração: ferramentas, Google e regras",
        description: `Como ligamos as ferramentas Steevanz, o Google e o básico legal ${f.isShop ? "e os pagamentos " : ""}antes de publicar.`,
        blocks: configurationPt,
      },
      en: {
        title: "Configuration: tools, Google and the rules",
        description: `How we connect your Steevanz tools, Google and the legal basics ${f.isShop ? "and payments " : ""}before launch.`,
        blocks: configurationEn,
      },
    }),
    usage: withExtra("usage", {
      pt: {
        title: "Utilização: alterações e plano mensal",
        description: `Como pedir alterações depois de publicar${f.isShop ? ", gerir encomendas" : ""} e o que cobre o plano mensal.`,
        blocks: usagePt,
      },
      en: {
        title: "Usage: changes and the monthly plan",
        description: `How to request changes after launch${f.isShop ? ", manage orders" : ""} and what the monthly plan covers.`,
        blocks: usageEn,
      },
    }),
    troubleshooting: withExtra("troubleshooting", {
      pt: { title: "Resolução de problemas", description: "Os problemas mais comuns depois de publicar e o que fazer.", blocks: troubleshootingPt },
      en: { title: "Troubleshooting", description: "The most common issues after launch and what to do.", blocks: troubleshootingEn },
    }),
    faq: withExtra("faq", {
      pt: {
        title: `Perguntas frequentes: ${pt.shortName}`,
        description: "Preço, prazos, conteúdos, domínio e alterações.",
        blocks: [{ type: "faq", items: pt.faq }],
      },
      en: {
        title: `FAQ: ${en.shortName}`,
        description: "Price, timelines, content, domain and changes.",
        blocks: [{ type: "faq", items: en.faq }],
      },
    }),
  };
}

// Spanish, French, German and Italian: the same pages, written in each language (anchor ids stay in English).

function docsEs({ f, c, link }: DocContext): DocSet {
  const shop = f.isShop;
  return {
    "getting-started": {
      title: `Primeros pasos: ${c.name}`,
      description: c.metaDescription,
      blocks: [
        { type: "p", text: `**${c.name}.** ${c.summary}` },
        { type: "h2", id: "who-its-for", text: "Para quién es" },
        { type: "ul", items: c.useCases.map((useCase) => `**${useCase.title}:** ${useCase.body}`) },
        { type: "h2", id: "how-it-runs", text: "Cómo se desarrolla el proyecto" },
        { type: "steps", items: c.steps },
        { type: "h2", id: "timeline", text: "Plazo" },
        {
          type: "p",
          text: `${capitalize(f.thing.es)} estará lista en **${f.days.es}** desde que recibimos todos los contenidos. Antes de publicar, le mostramos la primera versión en un enlace privado, e incluye 2 rondas de cambios.`,
        },
        {
          type: "callout",
          tone: "tip",
          title: "Empiece a reunir los contenidos",
          text: `El logotipo, las fotos y los datos de la empresa son lo que más retrasa un proyecto. Vea la [lista de lo que necesitamos](${link.setup}) y vaya reuniendo lo que ya tiene.`,
        },
        { type: "h2", id: "next-steps", text: "Próximos pasos" },
        {
          type: "p",
          text: `Vea la [página del producto](${link.product}) con precios y opciones, o envíe su solicitud desde el [carrito](${link.cart}): le respondemos con una propuesta de precio cerrado.`,
        },
      ],
    },
    setup: {
      title: "Arranque del proyecto: lo que necesitamos de usted",
      description: `La lista de contenidos, el dominio y el correo para poner en marcha ${f.thing.es} con Steevanz.`,
      blocks: [
        {
          type: "p",
          text: "Cuando acepte la propuesta y pague el primer 50 %, le enviamos esta lista. Cuanto antes llegue todo, antes empezamos: el plazo cuenta desde que tenemos los contenidos completos.",
        },
        { type: "h2", id: "checklist", text: "Lo que necesitamos de usted" },
        {
          type: "ol",
          items: [
            "**Datos de la empresa:** nombre, NIF, dirección, teléfono, correo electrónico, horario y redes sociales.",
            "**Marca:** logotipo (a ser posible en vectorial), colores y, si las tiene, las tipografías.",
            shop
              ? "**Productos:** una foto por producto y la hoja de cálculo que le enviamos, con nombre, descripción, precio con IVA, variantes, stock, peso y categoría."
              : "**Fotos:** suyas o de bancos de imágenes con licencia.",
            "**Textos** de cada sección o página, o la opción de copywriting con una llamada de 20 minutos.",
            "**Dominio:** el acceso al registro del dominio que ya tiene, o el nombre que quiere registrar a su nombre.",
            "**Libro de Reclamaciones Electrónico:** el registro de su negocio en la plataforma portuguesa, que tiene que hacer usted.",
            ...only(shop, [
              "**Venta online:** la entidad de resolución alternativa de litigios a la que está adherido, la política de devoluciones, las zonas y las tarifas de envío.",
              "**Cuentas:** una cuenta en un proveedor de pagos (le ayudamos a elegirlo y a abrirla) y, si quiere facturación automática, una cuenta en Moloni o InvoiceXpress.",
            ]),
            "**Casos especiales:** el número de registro RNAL, en los alojamientos turísticos, o el registro en la ERS, en las clínicas, cuando corresponda.",
            "**Referencias:** 2 o 3 webs que le gusten, y lo que no quiere ver en la suya.",
          ],
        },
        { type: "h2", id: "domain", text: "Dominio" },
        {
          type: "p",
          text: "El dominio siempre queda registrado a su nombre. Si ya tiene uno, necesitamos acceso al registro (o que alguien cambie los DNS por nosotros). Si no lo tiene, le ayudamos a elegirlo y a registrarlo: un dominio .pt cuesta entre 15 y 20 € al año, aproximadamente. Como opción, podemos gestionarlo por usted.",
        },
        { type: "h2", id: "email", text: "Correo profesional" },
        {
          type: "p",
          text: "Configuramos el correo con su dominio en Google Workspace, Microsoft 365 o Zoho. La licencia se paga directamente al proveedor (por ejemplo, unos 8 € por usuario y mes en Google Workspace).",
        },
        {
          type: "callout",
          tone: "warning",
          title: "El plazo cuenta desde los contenidos completos",
          text: `El plazo de ${f.days.es} empieza cuando tenemos todo lo que figura en la lista${shop ? ", incluida la cuenta de pagos aprobada" : ""}. Si falta algo, le avisamos enseguida.`,
        },
        { type: "p", text: `A continuación: vea cómo conectamos las herramientas y nos ocupamos de Google en la [configuración](${link.configuration}).` },
      ],
    },
    configuration: {
      title: "Configuración: herramientas, Google y normas",
      description: `Cómo conectamos las herramientas Steevanz, Google y lo básico legal ${shop ? "y los pagos " : ""}antes de publicar.`,
      blocks: [
        { type: "p", text: `Configuramos todo lo que aparece en esta página antes de publicar ${f.thing.es}.` },
        { type: "h2", id: "steevanz-tools", text: "Herramientas Steevanz" },
        { type: "p", text: "Si ya usa productos Steevanz, los conectamos sin coste adicional de desarrollo:" },
        {
          type: "table",
          head: ["Herramienta", "Cómo aparece"],
          rows: [
            ["Reservas", "Un botón «Reservar» que abre su página de reservas"],
            ["Lista de espera", "Un enlace para que el cliente se apunte a la cola y siga su turno"],
            ["Menú digital", "Una página o un botón «Ver la carta», siempre actualizado"],
            ["Tarjeta de cliente", "Un botón para que el cliente se una a su tarjeta"],
            ["Chatbot con IA", "Una ventana de chat que responde a las preguntas"],
            ["Reseñas", "Un botón «Deje una reseña» que abre su página de Google"],
          ],
        },
        { type: "h2", id: "google", text: "Google y SEO" },
        {
          type: "ul",
          items: [
            "Título y descripción en cada página, y datos estructurados del negocio.",
            "Mapa del sitio enviado a Google y Google Search Console configurada.",
            "Nombre, dirección y teléfono iguales a los de su Perfil de Empresa en Google.",
            "Imagen para compartir en redes sociales y WhatsApp.",
            "Estadísticas de visitas sin cookies, respetuosas con la privacidad.",
          ],
        },
        {
          type: "callout",
          tone: "info",
          text: "No prometemos posiciones en Google: dependen de muchos factores, como las reseñas y la competencia. Garantizamos que todo queda bien construido y dado de alta.",
        },
        { type: "h2", id: "rules", text: "Cookies, privacidad y Libro de Reclamaciones" },
        {
          type: "ul",
          items: [
            "Aviso de cookies en el que «Rechazar» es tan fácil como «Aceptar», y nada que no sea esencial antes del consentimiento.",
            "Política de privacidad y de cookies, a partir de modelos que usted valida.",
            "Enlace bien visible al Libro de Reclamaciones Electrónico portugués.",
            "Datos de la empresa y precios con IVA, como exige la ley.",
            "Construcción según las pautas de accesibilidad WCAG 2.1 AA.",
          ],
        },
        ...only<DocBlock>(shop, [
          { type: "h2", id: "payments-shipping", text: "Pagos, envíos y facturación" },
          {
            type: "ul",
            items: [
              "**Pagos:** MB WAY, referencia Multibanco y tarjeta, con su cuenta en el proveedor (ifthenpay, Eupago, Easypay o Stripe). El dinero entra en su cuenta.",
              "**Envíos:** tarifas por zona y peso (Portugal continental, islas, UE), envío gratis a partir de un importe y recogida en tienda.",
              "**Checkout:** total con IVA y gastos de envío antes de pagar, y botón «Pedido con obligación de pago».",
              "**Facturación:** cada venta necesita una factura de un programa certificado. Como opción, conectamos Moloni o InvoiceXpress.",
              "**Venta a distancia:** condiciones de venta, derecho de desistimiento de 14 días con formulario y la entidad de resolución alternativa de litigios.",
            ],
          },
        ]),
        { type: "h2", id: "languages", text: "Idiomas" },
        {
          type: "p",
          text: "Cada idioma adicional es una opción en la propuesta. Nosotros traducimos y usted valida antes de publicar; recomendamos la revisión de un hablante nativo.",
        },
        { type: "p", text: `A continuación: cómo pedir cambios después de publicar, en [uso](${link.usage}).` },
      ],
    },
    usage: {
      title: "Uso: cambios y plan mensual",
      description: `Cómo pedir cambios después de publicar${shop ? ", gestionar pedidos" : ""} y qué cubre el plan mensual.`,
      blocks: [
        {
          type: "p",
          text: `Después de publicar, no tiene que tocar nada técnico: el plan mensual (${f.monthly.es}) cubre el hosting, la seguridad y los pequeños cambios.`,
        },
        { type: "h2", id: "request-a-change", text: "Pedir un cambio" },
        {
          type: "ol",
          items: [
            "Envíe un mensaje por WhatsApp o un correo electrónico con lo que quiere cambiar y dónde.",
            "Adjunte el texto nuevo, las fotos o una captura de pantalla, si ayuda.",
            "Confirmamos la solicitud y le avisamos cuando esté publicado.",
          ],
        },
        { type: "h2", id: "small-changes", text: "Qué cuenta como pequeño cambio" },
        {
          type: "table",
          head: ["Incluido en el plan", "Va en una propuesta aparte"],
          rows: [
            ["Cambiar horarios, precios, textos o fotos", "Páginas o secciones nuevas"],
            ["Cambiar un servicio o un plato", "Un idioma nuevo"],
            ["Actualizar un aviso o una campaña", "Funciones nuevas (formularios avanzados, blog)"],
          ],
        },
        {
          type: "p",
          text: `El plan incluye hasta **${f.allowance.es}** de pequeños cambios al mes. Si una solicitud supera ese tiempo, le decimos el importe antes de seguir.`,
        },
        ...only<DocBlock>(shop, [
          { type: "h2", id: "orders", text: "Gestionar pedidos" },
          {
            type: "ul",
            items: [
              "Cada pedido pagado le llega por correo electrónico y queda en el panel de la tienda.",
              "Prepare el envío, marque el pedido como enviado y añada el código de seguimiento: el cliente lo recibe por correo electrónico.",
              "Las devoluciones y los reembolsos se hacen en el panel de la tienda o del proveedor de pagos. Se lo explicamos todo en la formación.",
              "Con la facturación conectada, la factura se emite sola con cada pedido pagado.",
            ],
          },
        ]),
        { type: "h2", id: "monthly-plan", text: "Plan mensual" },
        {
          type: "ul",
          items: [
            "Hosting, certificado de seguridad, monitorización y copias de seguridad.",
            "Actualizaciones de seguridad.",
            "Soporte por WhatsApp y correo electrónico.",
            "Sin permanencia: cancele con 30 días de preaviso y le entregamos los archivos para alojarlos en otro sitio.",
          ],
        },
      ],
    },
    troubleshooting: {
      title: "Solución de problemas",
      description: "Los problemas más habituales después de publicar y qué hacer.",
      blocks: [
        { type: "p", text: "Los problemas más habituales y qué hacer. Si no se resuelve, escríbanos por WhatsApp o correo electrónico." },
        {
          type: "table",
          head: ["Problema", "Qué hacer"],
          rows: [
            ["No abre después de cambiar el dominio", "El cambio de DNS puede tardar hasta 48 horas en llegar a todas partes. Si tarda más, avísenos."],
            ["No recibo los correos del formulario", "Revise la carpeta de spam y marque el remitente como seguro. Si sigue pasando, avísenos para probar el envío."],
            ["Todavía no aparece en Google", "Google tarda días o semanas en mostrar una web nueva. Ya hemos enviado el mapa del sitio; busque el nombre de su negocio dentro de unos días."],
            ["Veo información antigua", "Actualice la página o ábrala en una ventana privada. Los cambios pueden tardar unos minutos en aparecer."],
            ["Aparece un aviso de seguridad", "No debería ocurrir: el certificado se renueva solo. Envíenos una captura de pantalla."],
            ...only(shop, [
              ["Pago con MB WAY sin completar", "El cliente tiene que aprobar el pago en la app dentro del plazo. Si caduca, el pedido queda pendiente de pago y el cliente puede volver a intentarlo."],
              ["Referencia Multibanco sin pagar", "La referencia tiene un plazo definido en el proveedor. Pasado ese plazo, el pedido puede cancelarse."],
            ]),
          ],
        },
        {
          type: "callout",
          tone: "tip",
          text: `Al pedir ayuda, díganos la dirección de la página, qué estaba haciendo y, si puede, envíenos una captura de pantalla. Tiene nuestros datos en la página de [Contacto](${link.contact}).`,
        },
      ],
    },
    faq: {
      title: `Preguntas frecuentes: ${c.shortName}`,
      description: "Precio, plazos, contenidos, dominio y cambios.",
      blocks: [{ type: "faq", items: c.faq }],
    },
  };
}

function docsFr({ f, c, link }: DocContext): DocSet {
  const shop = f.isShop;
  return {
    "getting-started": {
      title: `Premiers pas : ${c.name}`,
      description: c.metaDescription,
      blocks: [
        { type: "p", text: `**${c.name}.** ${c.summary}` },
        { type: "h2", id: "who-its-for", text: "Pour qui" },
        { type: "ul", items: c.useCases.map((useCase) => `**${useCase.title} :** ${useCase.body}`) },
        { type: "h2", id: "how-it-runs", text: "Déroulement du projet" },
        { type: "steps", items: c.steps },
        { type: "h2", id: "timeline", text: "Délai" },
        {
          type: "p",
          text: `${capitalize(f.thing.fr)} sera ${f.ready.fr} **${f.days.fr}** après réception de tous vos contenus. Avant la mise en ligne, nous vous montrons une première version sur un lien privé, et deux séries de modifications sont incluses.`,
        },
        {
          type: "callout",
          tone: "tip",
          title: "Commencez à rassembler vos contenus",
          text: `Le logo, les photos et les informations sur l'entreprise sont ce qui retarde le plus un projet. Consultez la [liste de ce dont nous avons besoin](${link.setup}) et rassemblez déjà ce que vous avez.`,
        },
        { type: "h2", id: "next-steps", text: "Prochaines étapes" },
        {
          type: "p",
          text: `Consultez la [page du produit](${link.product}) pour les prix et les options, ou envoyez votre demande depuis le [panier](${link.cart}) : nous vous répondons avec une proposition à prix fixe.`,
        },
      ],
    },
    setup: {
      title: "Lancement du projet : ce dont nous avons besoin",
      description: `La liste des contenus, le nom de domaine et l'e-mail pour lancer ${f.thing.fr} avec Steevanz.`,
      blocks: [
        {
          type: "p",
          text: "Dès que vous acceptez la proposition et réglez les premiers 50 %, nous vous envoyons cette liste. Plus vite tout arrive, plus vite nous commençons : le délai court à partir des contenus complets.",
        },
        { type: "h2", id: "checklist", text: "Ce dont nous avons besoin" },
        {
          type: "ol",
          items: [
            "**Informations sur l'entreprise :** nom, numéro fiscal (NIF), adresse, téléphone, e-mail, horaires et réseaux sociaux.",
            "**Marque :** logo (en vectoriel si possible), couleurs et, si vous en avez, les polices.",
            shop
              ? "**Produits :** une photo par produit et le tableau que nous vous envoyons, avec nom, description, prix avec TVA, variantes, stock, poids et catégorie."
              : "**Photos :** les vôtres ou issues de banques d'images sous licence.",
            "**Textes** de chaque section ou page, ou l'option rédaction avec un appel de 20 minutes.",
            "**Nom de domaine :** l'accès au domaine que vous avez déjà, ou le nom que vous voulez enregistrer à votre nom.",
            "**Livre de réclamations électronique :** l'inscription de votre entreprise sur la plateforme portugaise, que vous devez faire vous-même.",
            ...only(shop, [
              "**Vente en ligne :** l'organisme de règlement extrajudiciaire des litiges auquel vous adhérez, votre politique de retours, vos zones et vos tarifs de livraison.",
              "**Comptes :** un compte chez un prestataire de paiement (nous vous aidons à le choisir et à l'ouvrir) et, pour la facturation automatique, un compte Moloni ou InvoiceXpress.",
            ]),
            "**Cas particuliers :** le numéro d'enregistrement RNAL pour les locations de vacances, ou l'enregistrement auprès de l'ERS pour les cliniques, le cas échéant.",
            "**Références :** 2 ou 3 sites que vous aimez, et ce que vous ne voulez pas voir sur le vôtre.",
          ],
        },
        { type: "h2", id: "domain", text: "Nom de domaine" },
        {
          type: "p",
          text: "Le nom de domaine est toujours enregistré à votre nom. Si vous en avez un, nous avons besoin d'y accéder (ou que quelqu'un modifie les DNS pour nous). Sinon, nous vous aidons à le choisir et à l'enregistrer : un domaine .pt coûte environ 15 à 20 € par an. Nous pouvons le gérer pour vous, en option.",
        },
        { type: "h2", id: "email", text: "E-mail professionnel" },
        {
          type: "p",
          text: "Nous configurons l'e-mail sur votre domaine avec Google Workspace, Microsoft 365 ou Zoho. La licence se paie directement au fournisseur (par exemple, environ 8 € par utilisateur et par mois chez Google Workspace).",
        },
        {
          type: "callout",
          tone: "warning",
          title: "Le délai court à partir des contenus complets",
          text: `Le délai de ${f.days.fr} commence quand nous avons tout ce qui figure sur la liste${shop ? ", y compris le compte de paiement validé" : ""}. S'il manque quelque chose, nous vous prévenons tout de suite.`,
        },
        { type: "p", text: `Ensuite : découvrez comment nous connectons vos outils et nous occupons de Google dans la [configuration](${link.configuration}).` },
      ],
    },
    configuration: {
      title: "Configuration : outils, Google et règles",
      description: `Comment nous connectons vos outils Steevanz, Google et les bases légales ${shop ? "et les paiements " : ""}avant la mise en ligne.`,
      blocks: [
        { type: "p", text: "Nous configurons tout ce qui figure sur cette page avant la mise en ligne." },
        { type: "h2", id: "steevanz-tools", text: "Outils Steevanz" },
        { type: "p", text: "Si vous utilisez déjà des produits Steevanz, nous les connectons sans frais de réalisation supplémentaires :" },
        {
          type: "table",
          head: ["Outil", "Comment il apparaît"],
          rows: [
            ["Réservations", "Un bouton « Réserver » qui ouvre votre page de réservation"],
            ["Liste d'attente", "Un lien pour que le client rejoigne la file et suive son tour"],
            ["Menu digital", "Une page ou un bouton « Voir la carte », toujours à jour"],
            ["Carte de fidélité", "Un bouton pour que le client rejoigne votre carte"],
            ["Chatbot IA", "Une fenêtre de discussion qui répond aux questions"],
            ["Avis", "Un bouton « Laisser un avis » qui ouvre votre page Google"],
          ],
        },
        { type: "h2", id: "google", text: "Google et SEO" },
        {
          type: "ul",
          items: [
            "Titre et description sur chaque page, et données structurées de l'entreprise.",
            "Plan du site envoyé à Google et Google Search Console configurée.",
            "Nom, adresse et téléphone identiques à ceux de votre fiche d'établissement Google.",
            "Image de partage pour les réseaux sociaux et WhatsApp.",
            "Statistiques de visites sans cookies, respectueuses de la vie privée.",
          ],
        },
        {
          type: "callout",
          tone: "info",
          text: "Nous ne promettons pas de position sur Google : elle dépend de nombreux facteurs, comme les avis et la concurrence. Nous garantissons que tout est bien construit et déclaré.",
        },
        { type: "h2", id: "rules", text: "Cookies, confidentialité et livre de réclamations" },
        {
          type: "ul",
          items: [
            "Bandeau cookies où « Refuser » est aussi simple que « Accepter », et rien de non essentiel avant le consentement.",
            "Politique de confidentialité et de cookies, à partir de modèles que vous validez.",
            "Lien bien visible vers le livre de réclamations électronique portugais.",
            "Identification de l'entreprise et prix affichés avec la TVA, comme l'exige la loi.",
            "Réalisation selon les règles d'accessibilité WCAG 2.1 AA.",
          ],
        },
        ...only<DocBlock>(shop, [
          { type: "h2", id: "payments-shipping", text: "Paiements, livraisons et facturation" },
          {
            type: "ul",
            items: [
              "**Paiements :** MB WAY, référence Multibanco et carte, sur votre propre compte chez le prestataire (ifthenpay, Eupago, Easypay ou Stripe). L'argent arrive sur votre compte.",
              "**Livraisons :** tarifs par zone et par poids (Portugal continental, îles, UE), livraison gratuite à partir d'un montant et retrait en magasin.",
              "**Validation de commande :** total avec TVA et frais de port affiché avant le paiement, et bouton « Commande avec obligation de paiement ».",
              "**Facturation :** chaque vente doit faire l'objet d'une facture émise par un logiciel certifié. En option, nous connectons Moloni ou InvoiceXpress.",
              "**Vente à distance :** conditions de vente, droit de rétractation de 14 jours avec formulaire, et l'organisme de règlement extrajudiciaire des litiges.",
            ],
          },
        ]),
        { type: "h2", id: "languages", text: "Langues" },
        {
          type: "p",
          text: "Chaque langue supplémentaire est une option de la proposition. Nous traduisons et vous validez avant la mise en ligne ; nous conseillons une relecture par un locuteur natif.",
        },
        { type: "p", text: `Ensuite : comment demander des modifications après la mise en ligne, dans [utilisation](${link.usage}).` },
      ],
    },
    usage: {
      title: "Utilisation : modifications et offre mensuelle",
      description: `Comment demander des modifications après la mise en ligne${shop ? ", gérer les commandes" : ""} et ce que couvre l'offre mensuelle.`,
      blocks: [
        {
          type: "p",
          text: `Après la mise en ligne, vous n'avez rien de technique à gérer : l'offre mensuelle (${f.monthly.fr}) couvre l'hébergement, la sécurité et les petites modifications.`,
        },
        { type: "h2", id: "request-a-change", text: "Demander une modification" },
        {
          type: "ol",
          items: [
            "Envoyez un message WhatsApp ou un e-mail en indiquant ce que vous voulez changer et où.",
            "Joignez le nouveau texte, les photos ou une capture d'écran si cela aide.",
            "Nous confirmons la demande et vous prévenons dès que c'est en ligne.",
          ],
        },
        { type: "h2", id: "small-changes", text: "Ce qui compte comme petite modification" },
        {
          type: "table",
          head: ["Compris dans l'offre", "Sur devis à part"],
          rows: [
            ["Changer des horaires, des prix, des textes ou des photos", "Nouvelles pages ou sections"],
            ["Remplacer une prestation ou un plat", "Une nouvelle langue"],
            ["Mettre à jour une annonce ou une campagne", "Nouvelles fonctionnalités (formulaires avancés, blog)"],
          ],
        },
        {
          type: "p",
          text: `L'offre comprend jusqu'à **${f.allowance.fr}** de petites modifications par mois. Si une demande va au-delà, nous vous indiquons le prix avant de commencer.`,
        },
        ...only<DocBlock>(shop, [
          { type: "h2", id: "orders", text: "Gérer les commandes" },
          {
            type: "ul",
            items: [
              "Chaque commande payée vous arrive par e-mail et apparaît dans le tableau de bord de la boutique.",
              "Préparez le colis, marquez la commande comme expédiée et ajoutez le numéro de suivi : le client le reçoit par e-mail.",
              "Les retours et les remboursements se gèrent dans le tableau de bord de la boutique ou du prestataire de paiement. Nous vous expliquons tout pendant la formation.",
              "Avec la facturation connectée, la facture est émise automatiquement à chaque commande payée.",
            ],
          },
        ]),
        { type: "h2", id: "monthly-plan", text: "Offre mensuelle" },
        {
          type: "ul",
          items: [
            "Hébergement, certificat de sécurité, surveillance et sauvegardes.",
            "Mises à jour de sécurité.",
            "Assistance par WhatsApp et e-mail.",
            "Sans engagement : résiliable avec un préavis de 30 jours, et nous vous remettons les fichiers pour un hébergement ailleurs.",
          ],
        },
      ],
    },
    troubleshooting: {
      title: "Résolution des problèmes",
      description: "Les problèmes les plus courants après la mise en ligne et que faire.",
      blocks: [
        { type: "p", text: "Les problèmes les plus courants et que faire. Si cela ne suffit pas, contactez-nous par WhatsApp ou par e-mail." },
        {
          type: "table",
          head: ["Problème", "Que faire"],
          rows: [
            ["Rien ne s'affiche après un changement de domaine", "La propagation des DNS peut prendre jusqu'à 48 heures. Au-delà, prévenez-nous."],
            ["Je ne reçois pas les e-mails du formulaire", "Vérifiez le dossier spam et marquez l'expéditeur comme sûr. Si le problème persiste, prévenez-nous pour que nous testions l'envoi."],
            ["Pas encore visible sur Google", "Google met des jours, voire des semaines, à afficher un nouveau site. Nous avons déjà envoyé le plan du site ; recherchez le nom de votre entreprise dans quelques jours."],
            ["Je vois d'anciennes informations", "Actualisez la page ou ouvrez-la dans une fenêtre de navigation privée. Les modifications peuvent mettre quelques minutes à apparaître."],
            ["Un avertissement de sécurité s'affiche", "Cela ne devrait pas arriver : le certificat se renouvelle automatiquement. Envoyez-nous une capture d'écran."],
            ...only(shop, [
              ["Paiement MB WAY non finalisé", "Le client doit approuver le paiement dans l'application dans le délai imparti. S'il expire, la commande reste impayée et le client peut réessayer."],
              ["Référence Multibanco non payée", "La référence a une date limite définie chez le prestataire. Passé ce délai, la commande peut être annulée."],
            ]),
          ],
        },
        {
          type: "callout",
          tone: "tip",
          text: `Quand vous demandez de l'aide, indiquez-nous l'adresse de la page, ce que vous faisiez et, si possible, envoyez une capture d'écran. Nos coordonnées sont sur la page [Contact](${link.contact}).`,
        },
      ],
    },
    faq: {
      title: `Questions fréquentes : ${c.shortName}`,
      description: "Prix, délais, contenus, nom de domaine et modifications.",
      blocks: [{ type: "faq", items: c.faq }],
    },
  };
}

function docsDe({ f, c, link }: DocContext): DocSet {
  const shop = f.isShop;
  return {
    "getting-started": {
      title: `Erste Schritte: ${c.name}`,
      description: c.metaDescription,
      blocks: [
        { type: "p", text: `**${c.name}.** ${c.summary}` },
        { type: "h2", id: "who-its-for", text: "Für wen" },
        { type: "ul", items: c.useCases.map((useCase) => `**${useCase.title}:** ${useCase.body}`) },
        { type: "h2", id: "how-it-runs", text: "So läuft das Projekt ab" },
        { type: "steps", items: c.steps },
        { type: "h2", id: "timeline", text: "Zeitrahmen" },
        {
          type: "p",
          text: `${capitalize(f.thing.de)} ist **${f.days.de}** nach Eingang aller Inhalte fertig. Vor der Veröffentlichung zeigen wir Ihnen die erste Version über einen privaten Link, und zwei Korrekturrunden sind inbegriffen.`,
        },
        {
          type: "callout",
          tone: "tip",
          title: "Sammeln Sie schon Ihre Inhalte",
          text: `Logo, Fotos und Firmendaten verzögern ein Projekt am häufigsten. Sehen Sie sich die [Liste mit allem, was wir brauchen](${link.setup}) an und sammeln Sie schon, was Sie haben.`,
        },
        { type: "h2", id: "next-steps", text: "Nächste Schritte" },
        {
          type: "p",
          text: `Auf der [Produktseite](${link.product}) finden Sie Preise und Optionen, oder Sie senden Ihre Anfrage über den [Warenkorb](${link.cart}): Wir antworten mit einem Angebot zum Festpreis.`,
        },
      ],
    },
    setup: {
      title: "Projektstart: Was wir von Ihnen brauchen",
      description: "Die Liste der Inhalte, Domain und E-Mail, um Ihr Projekt mit Steevanz zu starten.",
      blocks: [
        {
          type: "p",
          text: "Sobald Sie das Angebot annehmen und die ersten 50 % bezahlen, schicken wir Ihnen diese Liste. Je schneller alles da ist, desto schneller legen wir los: Der Zeitrahmen beginnt mit vollständigen Inhalten.",
        },
        { type: "h2", id: "checklist", text: "Was wir von Ihnen brauchen" },
        {
          type: "ol",
          items: [
            "**Firmendaten:** Name, Steuernummer (NIF), Adresse, Telefon, E-Mail, Öffnungszeiten und Social-Media-Profile.",
            "**Marke:** Logo (möglichst als Vektordatei), Farben und, falls vorhanden, Schriften.",
            shop
              ? "**Produkte:** ein Foto pro Produkt und die Tabelle, die wir Ihnen schicken, mit Name, Beschreibung, Preis mit MwSt., Varianten, Lagerbestand, Gewicht und Kategorie."
              : "**Fotos:** eigene oder aus lizenzierten Bilddatenbanken.",
            "**Texte** für jeden Abschnitt oder jede Seite, oder die Option Texterstellung mit einem Telefonat von 20 Minuten.",
            "**Domain:** Zugang zu Ihrer bestehenden Domain oder der Name, den Sie auf Ihren Namen registrieren möchten.",
            "**Elektronisches Beschwerdebuch:** die Registrierung Ihres Unternehmens auf der portugiesischen Plattform, die Sie selbst vornehmen müssen.",
            ...only(shop, [
              "**Onlinehandel:** die Stelle für alternative Streitbeilegung, der Sie angeschlossen sind, Ihre Rückgaberichtlinie, Versandzonen und Versandpreise.",
              "**Konten:** ein Konto bei einem Zahlungsanbieter (wir helfen bei Auswahl und Eröffnung) und, für automatische Rechnungen, ein Konto bei Moloni oder InvoiceXpress.",
            ]),
            "**Sonderfälle:** die RNAL-Registrierungsnummer bei Ferienunterkünften oder die ERS-Registrierung bei Kliniken, falls zutreffend.",
            "**Referenzen:** 2 oder 3 Websites, die Ihnen gefallen, und was Sie auf Ihrer nicht sehen möchten.",
          ],
        },
        { type: "h2", id: "domain", text: "Domain" },
        {
          type: "p",
          text: "Die Domain wird immer auf Ihren Namen registriert. Wenn Sie schon eine haben, brauchen wir Zugang dazu (oder jemanden, der die DNS-Einträge für uns ändert). Wenn nicht, helfen wir Ihnen bei Auswahl und Registrierung: Eine .pt-Domain kostet etwa 15 bis 20 € pro Jahr. Optional verwalten wir sie für Sie.",
        },
        { type: "h2", id: "email", text: "Professionelle E-Mail" },
        {
          type: "p",
          text: "Wir richten E-Mail auf Ihrer Domain mit Google Workspace, Microsoft 365 oder Zoho ein. Die Lizenz zahlen Sie direkt an den Anbieter (zum Beispiel etwa 8 € pro Nutzer und Monat bei Google Workspace).",
        },
        {
          type: "callout",
          tone: "warning",
          title: "Der Zeitrahmen beginnt mit vollständigen Inhalten",
          text: `Die ${f.days.de} laufen ab dem Moment, in dem wir alles von der Liste haben${shop ? ", einschließlich des freigegebenen Zahlungskontos" : ""}. Wenn etwas fehlt, sagen wir sofort Bescheid.`,
        },
        { type: "p", text: `Weiter: Wie wir Ihre Tools anbinden und Google einrichten, lesen Sie unter [Konfiguration](${link.configuration}).` },
      ],
    },
    configuration: {
      title: "Konfiguration: Tools, Google und Regeln",
      description: `Wie wir Ihre Steevanz-Tools, Google und die rechtlichen Grundlagen ${shop ? "sowie die Zahlungen " : ""}vor der Veröffentlichung einrichten.`,
      blocks: [
        { type: "p", text: `Alles auf dieser Seite richten wir ein, bevor ${f.thing.de} online geht.` },
        { type: "h2", id: "steevanz-tools", text: "Steevanz-Tools" },
        { type: "p", text: "Wenn Sie schon Steevanz-Produkte nutzen, binden wir sie ohne zusätzliche Entwicklungskosten ein:" },
        {
          type: "table",
          head: ["Tool", "So erscheint es"],
          rows: [
            ["Reservierungen", "Ein Button „Reservieren“, der Ihre Reservierungsseite öffnet"],
            ["Warteliste", "Ein Link, über den sich Kunden in die Warteschlange einreihen und ihren Platz verfolgen"],
            ["Digitale Speisekarte", "Eine Seite oder ein Button „Speisekarte ansehen“, immer aktuell"],
            ["Kundenkarte", "Ein Button, mit dem Kunden Ihrer Kundenkarte beitreten"],
            ["KI-Chatbot", "Ein Chatfenster, das Fragen beantwortet"],
            ["Bewertungen", "Ein Button „Bewertung schreiben“, der Ihre Google-Seite öffnet"],
          ],
        },
        { type: "h2", id: "google", text: "Google und SEO" },
        {
          type: "ul",
          items: [
            "Titel und Beschreibung auf jeder Seite, dazu strukturierte Unternehmensdaten.",
            "Sitemap an Google gesendet und Google Search Console eingerichtet.",
            "Name, Adresse und Telefon identisch mit Ihrem Google-Unternehmensprofil.",
            "Ein Vorschaubild zum Teilen in sozialen Netzwerken und WhatsApp.",
            "Besucherstatistiken ohne Cookies, datenschutzfreundlich.",
          ],
        },
        {
          type: "callout",
          tone: "info",
          text: "Wir versprechen keine Google-Platzierungen: Sie hängen von vielen Faktoren ab, etwa von Bewertungen und Konkurrenz. Wir sorgen dafür, dass alles sauber gebaut und angemeldet ist.",
        },
        { type: "h2", id: "rules", text: "Cookies, Datenschutz und Beschwerdebuch" },
        {
          type: "ul",
          items: [
            "Cookie-Banner, bei dem „Ablehnen“ so einfach ist wie „Akzeptieren“, und vor der Einwilligung wird nichts Unnötiges geladen.",
            "Datenschutz- und Cookie-Richtlinie auf Basis von Vorlagen, die Sie freigeben.",
            "Gut sichtbarer Link zum portugiesischen elektronischen Beschwerdebuch.",
            "Firmenangaben und Preise mit MwSt., wie gesetzlich vorgeschrieben.",
            "Umsetzung nach den Barrierefreiheitsrichtlinien WCAG 2.1 AA.",
          ],
        },
        ...only<DocBlock>(shop, [
          { type: "h2", id: "payments-shipping", text: "Zahlungen, Versand und Rechnungen" },
          {
            type: "ul",
            items: [
              "**Zahlungen:** MB WAY, Multibanco-Referenz und Karte, über Ihr eigenes Konto beim Anbieter (ifthenpay, Eupago, Easypay oder Stripe). Das Geld geht auf Ihr Konto.",
              "**Versand:** Tarife nach Zone und Gewicht (Festland, Inseln, EU), kostenloser Versand ab einem Bestellwert und Abholung im Geschäft.",
              "**Kasse:** Gesamtbetrag mit MwSt. und Versand vor der Zahlung sichtbar, und ein Button „Zahlungspflichtig bestellen“.",
              "**Rechnungen:** Jeder Verkauf braucht eine Rechnung aus zertifizierter Software. Optional binden wir Moloni oder InvoiceXpress an.",
              "**Fernabsatz:** Verkaufsbedingungen, 14-tägiges Widerrufsrecht mit Formular und die Stelle für alternative Streitbeilegung.",
            ],
          },
        ]),
        { type: "h2", id: "languages", text: "Sprachen" },
        {
          type: "p",
          text: "Jede weitere Sprache ist eine Option im Angebot. Wir übersetzen, und Sie geben vor der Veröffentlichung frei; wir empfehlen eine Prüfung durch einen Muttersprachler.",
        },
        { type: "p", text: `Weiter: Wie Sie nach der Veröffentlichung Änderungen anfragen, lesen Sie unter [Nutzung](${link.usage}).` },
      ],
    },
    usage: {
      title: "Nutzung: Änderungen und Monatsplan",
      description: `Wie Sie nach der Veröffentlichung Änderungen anfragen${shop ? ", Bestellungen verwalten" : ""} und was der Monatsplan abdeckt.`,
      blocks: [
        {
          type: "p",
          text: `Nach der Veröffentlichung müssen Sie sich um nichts Technisches kümmern: Der Monatsplan (${f.monthly.de}) deckt Hosting, Sicherheit und kleine Änderungen ab.`,
        },
        { type: "h2", id: "request-a-change", text: "Eine Änderung anfragen" },
        {
          type: "ol",
          items: [
            "Schicken Sie eine WhatsApp-Nachricht oder E-Mail mit dem, was Sie ändern möchten, und wo.",
            "Fügen Sie den neuen Text, Fotos oder einen Screenshot bei, wenn es hilft.",
            "Wir bestätigen die Anfrage und sagen Bescheid, sobald die Änderung online ist.",
          ],
        },
        { type: "h2", id: "small-changes", text: "Was als kleine Änderung gilt" },
        {
          type: "table",
          head: ["Im Plan enthalten", "Separates Angebot"],
          rows: [
            ["Öffnungszeiten, Preise, Texte oder Fotos ändern", "Neue Seiten oder Abschnitte"],
            ["Eine Leistung oder ein Gericht austauschen", "Eine neue Sprache"],
            ["Einen Hinweis oder eine Aktion aktualisieren", "Neue Funktionen (erweiterte Formulare, Blog)"],
          ],
        },
        {
          type: "p",
          text: `Der Plan enthält bis zu **${f.allowance.de}** kleine Änderungen pro Monat. Geht eine Anfrage darüber hinaus, nennen wir Ihnen vorher den Preis.`,
        },
        ...only<DocBlock>(shop, [
          { type: "h2", id: "orders", text: "Bestellungen verwalten" },
          {
            type: "ul",
            items: [
              "Jede bezahlte Bestellung kommt per E-Mail bei Ihnen an und erscheint im Shop-Dashboard.",
              "Packen Sie die Sendung, markieren Sie die Bestellung als versendet und fügen Sie die Sendungsnummer hinzu: Der Kunde erhält sie per E-Mail.",
              "Rücksendungen und Erstattungen erledigen Sie im Dashboard des Shops oder des Zahlungsanbieters. Wir erklären alles in der Schulung.",
              "Mit angebundener Rechnungssoftware wird die Rechnung bei jeder bezahlten Bestellung automatisch erstellt.",
            ],
          },
        ]),
        { type: "h2", id: "monthly-plan", text: "Monatsplan" },
        {
          type: "ul",
          items: [
            "Hosting, Sicherheitszertifikat, Überwachung und Backups.",
            "Sicherheitsupdates.",
            "Support per WhatsApp und E-Mail.",
            "Ohne Mindestlaufzeit: mit 30 Tagen Frist kündbar, und wir übergeben Ihnen die Dateien, damit Sie woanders hosten können.",
          ],
        },
      ],
    },
    troubleshooting: {
      title: "Fehlerbehebung",
      description: "Die häufigsten Probleme nach der Veröffentlichung und was zu tun ist.",
      blocks: [
        { type: "p", text: "Die häufigsten Probleme und was zu tun ist. Wenn das nicht hilft, schreiben Sie uns per WhatsApp oder E-Mail." },
        {
          type: "table",
          head: ["Problem", "Was tun"],
          rows: [
            ["Nach dem Domainwechsel öffnet sich nichts", "DNS-Änderungen können bis zu 48 Stunden brauchen, bis sie überall ankommen. Dauert es länger, sagen Sie uns Bescheid."],
            ["Die E-Mails aus dem Formular kommen nicht an", "Sehen Sie im Spam-Ordner nach und markieren Sie den Absender als sicher. Passiert es weiterhin, sagen Sie uns Bescheid, dann testen wir den Versand."],
            ["Noch nicht bei Google zu finden", "Google braucht Tage oder Wochen, um eine neue Website anzuzeigen. Die Sitemap haben wir schon gesendet; suchen Sie in ein paar Tagen nach Ihrem Firmennamen."],
            ["Ich sehe alte Informationen", "Laden Sie die Seite neu oder öffnen Sie sie in einem privaten Fenster. Änderungen können ein paar Minuten brauchen."],
            ["Eine Sicherheitswarnung erscheint", "Das sollte nicht passieren: Das Zertifikat erneuert sich automatisch. Schicken Sie uns einen Screenshot."],
            ...only(shop, [
              ["MB-WAY-Zahlung nicht abgeschlossen", "Der Kunde muss die Zahlung innerhalb der Frist in der App bestätigen. Läuft sie ab, bleibt die Bestellung unbezahlt, und der Kunde kann es erneut versuchen."],
              ["Multibanco-Referenz nicht bezahlt", "Die Referenz hat eine beim Anbieter festgelegte Frist. Danach kann die Bestellung storniert werden."],
            ]),
          ],
        },
        {
          type: "callout",
          tone: "tip",
          text: `Wenn Sie uns um Hilfe bitten, nennen Sie uns die Adresse der Seite und was Sie gerade gemacht haben, und schicken Sie nach Möglichkeit einen Screenshot. Unsere Kontaktdaten finden Sie auf der Seite [Kontakt](${link.contact}).`,
        },
      ],
    },
    faq: {
      title: `Häufige Fragen: ${c.shortName}`,
      description: "Preis, Zeitrahmen, Inhalte, Domain und Änderungen.",
      blocks: [{ type: "faq", items: c.faq }],
    },
  };
}

function docsIt({ f, c, link }: DocContext): DocSet {
  const shop = f.isShop;
  return {
    "getting-started": {
      title: `Primi passi: ${c.name}`,
      description: c.metaDescription,
      blocks: [
        { type: "p", text: `**${c.name}.** ${c.summary}` },
        { type: "h2", id: "who-its-for", text: "Per chi è" },
        { type: "ul", items: c.useCases.map((useCase) => `**${useCase.title}:** ${useCase.body}`) },
        { type: "h2", id: "how-it-runs", text: "Come si svolge il progetto" },
        { type: "steps", items: c.steps },
        { type: "h2", id: "timeline", text: "Tempi" },
        {
          type: "p",
          text: `${capitalize(f.thing.it)} sarà ${f.ready.it} in **${f.days.it}** da quando riceviamo tutti i contenuti. Prima della pubblicazione vi mostriamo la prima versione su un link privato, e sono inclusi 2 giri di modifiche.`,
        },
        {
          type: "callout",
          tone: "tip",
          title: "Iniziate a raccogliere i contenuti",
          text: `Logo, foto e dati dell'azienda sono ciò che rallenta di più un progetto. Guardate l'[elenco di ciò che ci serve](${link.setup}) e iniziate a raccogliere quello che avete già.`,
        },
        { type: "h2", id: "next-steps", text: "Prossimi passi" },
        {
          type: "p",
          text: `Guardate la [pagina del prodotto](${link.product}) con prezzi e opzioni, oppure inviate la richiesta dal [carrello](${link.cart}): vi rispondiamo con una proposta a prezzo fisso.`,
        },
      ],
    },
    setup: {
      title: "Avvio del progetto: cosa ci serve da voi",
      description: `L'elenco dei contenuti, il dominio e l'email per avviare ${f.thing.it} con Steevanz.`,
      blocks: [
        {
          type: "p",
          text: "Dopo che avete accettato la proposta e pagato il primo 50%, vi inviamo questo elenco. Prima arriva tutto, prima iniziamo: i tempi partono dai contenuti completi.",
        },
        { type: "h2", id: "checklist", text: "Cosa ci serve da voi" },
        {
          type: "ol",
          items: [
            "**Dati dell'azienda:** nome, numero fiscale portoghese (NIF), indirizzo, telefono, email, orari e social.",
            "**Marchio:** logo (possibilmente vettoriale), colori e, se li avete, i caratteri tipografici.",
            shop
              ? "**Prodotti:** una foto per prodotto e il foglio di calcolo che vi inviamo, con nome, descrizione, prezzo con IVA, varianti, magazzino, peso e categoria."
              : "**Foto:** vostre o da archivi di immagini con licenza.",
            "**Testi** di ogni sezione o pagina, oppure l'opzione copywriting con una chiamata di 20 minuti.",
            "**Dominio:** l'accesso al dominio che avete già, o il nome che volete registrare a vostro nome.",
            "**Libro dei reclami elettronico:** la registrazione della vostra attività sulla piattaforma portoghese, che dovete fare voi.",
            ...only(shop, [
              "**Vendita online:** l'organismo di risoluzione alternativa delle controversie a cui aderite, la politica dei resi, le zone e le tariffe di spedizione.",
              "**Account:** un account presso un fornitore di pagamenti (vi aiutiamo a sceglierlo e ad aprirlo) e, per la fatturazione automatica, un account Moloni o InvoiceXpress.",
            ]),
            "**Casi particolari:** il numero di registrazione RNAL per le case vacanza, o la registrazione all'ERS per le cliniche, quando serve.",
            "**Riferimenti:** 2 o 3 siti che vi piacciono, e cosa non volete vedere nel vostro.",
          ],
        },
        { type: "h2", id: "domain", text: "Dominio" },
        {
          type: "p",
          text: "Il dominio è sempre registrato a vostro nome. Se ne avete già uno, ci serve l'accesso (o qualcuno che modifichi i DNS per noi). Se non ce l'avete, vi aiutiamo a sceglierlo e a registrarlo: un dominio .pt costa circa 15-20 € all'anno. Come opzione, possiamo gestirlo noi per voi.",
        },
        { type: "h2", id: "email", text: "Email professionale" },
        {
          type: "p",
          text: "Configuriamo l'email sul vostro dominio con Google Workspace, Microsoft 365 o Zoho. La licenza si paga direttamente al fornitore (per esempio, circa 8 € per utente al mese con Google Workspace).",
        },
        {
          type: "callout",
          tone: "warning",
          title: "I tempi partono dai contenuti completi",
          text: `I ${f.days.it} partono quando abbiamo tutto ciò che è nell'elenco${shop ? ", compreso il conto pagamenti approvato" : ""}. Se manca qualcosa, ve lo diciamo subito.`,
        },
        { type: "p", text: `Poi: scoprite come colleghiamo gli strumenti e ci occupiamo di Google nella [configurazione](${link.configuration}).` },
      ],
    },
    configuration: {
      title: "Configurazione: strumenti, Google e regole",
      description: `Come colleghiamo gli strumenti Steevanz, Google e le basi legali ${shop ? "e i pagamenti " : ""}prima della pubblicazione.`,
      blocks: [
        { type: "p", text: `Configuriamo tutto ciò che trovate in questa pagina prima di pubblicare ${f.thing.it}.` },
        { type: "h2", id: "steevanz-tools", text: "Strumenti Steevanz" },
        { type: "p", text: "Se usate già prodotti Steevanz, li colleghiamo senza costi di sviluppo aggiuntivi:" },
        {
          type: "table",
          head: ["Strumento", "Come appare"],
          rows: [
            ["Prenotazioni", "Un pulsante «Prenota» che apre la vostra pagina di prenotazione"],
            ["Lista d'attesa", "Un link per entrare in coda e seguire il proprio turno"],
            ["Menù digitale", "Una pagina o un pulsante «Vedi il menù», sempre aggiornato"],
            ["Carta fedeltà", "Un pulsante per aderire alla vostra carta"],
            ["Chatbot con IA", "Una finestra di chat che risponde alle domande"],
            ["Recensioni", "Un pulsante «Lascia una recensione» che apre la vostra pagina Google"],
          ],
        },
        { type: "h2", id: "google", text: "Google e SEO" },
        {
          type: "ul",
          items: [
            "Titolo e descrizione in ogni pagina, e dati strutturati dell'attività.",
            "Sitemap inviata a Google e Google Search Console configurata.",
            "Nome, indirizzo e telefono uguali a quelli del vostro Profilo dell'attività su Google.",
            "Immagine di condivisione per social e WhatsApp.",
            "Statistiche delle visite senza cookie, rispettose della privacy.",
          ],
        },
        {
          type: "callout",
          tone: "info",
          text: "Non promettiamo posizioni su Google: dipendono da molti fattori, come le recensioni e la concorrenza. Garantiamo che tutto sia costruito e registrato a dovere.",
        },
        { type: "h2", id: "rules", text: "Cookie, privacy e Libro dei reclami" },
        {
          type: "ul",
          items: [
            "Banner dei cookie in cui «Rifiuta» è facile quanto «Accetta», e niente di non essenziale prima del consenso.",
            "Informativa sulla privacy e sui cookie, a partire da modelli che approvate voi.",
            "Collegamento ben visibile al Libro dei reclami elettronico portoghese.",
            "Dati dell'azienda e prezzi con IVA, come richiesto dalla legge.",
            "Realizzazione secondo le linee guida di accessibilità WCAG 2.1 AA.",
          ],
        },
        ...only<DocBlock>(shop, [
          { type: "h2", id: "payments-shipping", text: "Pagamenti, spedizioni e fatturazione" },
          {
            type: "ul",
            items: [
              "**Pagamenti:** MB WAY, riferimento Multibanco e carta, con il vostro account presso il fornitore (ifthenpay, Eupago, Easypay o Stripe). I soldi arrivano sul vostro conto.",
              "**Spedizioni:** tariffe per zona e peso (Portogallo continentale, isole, UE), spedizione gratuita sopra un certo importo e ritiro in negozio.",
              "**Checkout:** totale con IVA e spese di spedizione prima del pagamento, e pulsante «Ordine con obbligo di pagamento».",
              "**Fatturazione:** ogni vendita richiede una fattura emessa con un software certificato. Come opzione, colleghiamo Moloni o InvoiceXpress.",
              "**Vendita a distanza:** condizioni di vendita, diritto di recesso di 14 giorni con modulo, e l'organismo di risoluzione alternativa delle controversie.",
            ],
          },
        ]),
        { type: "h2", id: "languages", text: "Lingue" },
        {
          type: "p",
          text: "Ogni lingua in più è un'opzione nella proposta. Traduciamo noi e voi approvate prima della pubblicazione; consigliamo una revisione da parte di un madrelingua.",
        },
        { type: "p", text: `Poi: come chiedere modifiche dopo la pubblicazione, in [utilizzo](${link.usage}).` },
      ],
    },
    usage: {
      title: "Utilizzo: modifiche e piano mensile",
      description: `Come chiedere modifiche dopo la pubblicazione${shop ? ", gestire gli ordini" : ""} e cosa copre il piano mensile.`,
      blocks: [
        {
          type: "p",
          text: `Dopo la pubblicazione non dovete toccare nulla di tecnico: il piano mensile (${f.monthly.it}) copre hosting, sicurezza e piccole modifiche.`,
        },
        { type: "h2", id: "request-a-change", text: "Chiedere una modifica" },
        {
          type: "ol",
          items: [
            "Mandate un messaggio WhatsApp o un'email con cosa volete cambiare e dove.",
            "Allegate il nuovo testo, le foto o uno screenshot, se aiuta.",
            "Confermiamo la richiesta e vi avvisiamo quando è online.",
          ],
        },
        { type: "h2", id: "small-changes", text: "Cosa conta come piccola modifica" },
        {
          type: "table",
          head: ["Incluso nel piano", "Con preventivo a parte"],
          rows: [
            ["Cambiare orari, prezzi, testi o foto", "Nuove pagine o sezioni"],
            ["Sostituire un servizio o un piatto", "Una nuova lingua"],
            ["Aggiornare un avviso o una campagna", "Nuove funzionalità (moduli avanzati, blog)"],
          ],
        },
        {
          type: "p",
          text: `Il piano include fino a **${f.allowance.it}** di piccole modifiche al mese. Se una richiesta va oltre, vi diciamo il prezzo prima di procedere.`,
        },
        ...only<DocBlock>(shop, [
          { type: "h2", id: "orders", text: "Gestire gli ordini" },
          {
            type: "ul",
            items: [
              "Ogni ordine pagato vi arriva via email e compare nel pannello del negozio.",
              "Preparate il pacco, segnate l'ordine come spedito e aggiungete il codice di tracciamento: il cliente lo riceve via email.",
              "Resi e rimborsi si gestiscono nel pannello del negozio o del fornitore dei pagamenti. Vi spieghiamo tutto durante la formazione.",
              "Con la fatturazione collegata, la fattura viene emessa da sola a ogni ordine pagato.",
            ],
          },
        ]),
        { type: "h2", id: "monthly-plan", text: "Piano mensile" },
        {
          type: "ul",
          items: [
            "Hosting, certificato di sicurezza, monitoraggio e backup.",
            "Aggiornamenti di sicurezza.",
            "Assistenza via WhatsApp ed email.",
            "Senza vincoli: disdetta con 30 giorni di preavviso, e vi consegniamo i file per poter cambiare hosting.",
          ],
        },
      ],
    },
    troubleshooting: {
      title: "Risoluzione dei problemi",
      description: "I problemi più comuni dopo la pubblicazione e cosa fare.",
      blocks: [
        { type: "p", text: "I problemi più comuni e cosa fare. Se non si risolve, scriveteci via WhatsApp o email." },
        {
          type: "table",
          head: ["Problema", "Cosa fare"],
          rows: [
            ["Non si apre dopo il cambio di dominio", "Il cambio dei DNS può richiedere fino a 48 ore per arrivare ovunque. Se ci vuole di più, avvisateci."],
            ["Non ricevo le email del modulo", "Controllate la cartella spam e segnate il mittente come sicuro. Se continua, avvisateci e testiamo l'invio."],
            ["Non compare ancora su Google", "Google impiega giorni o settimane a mostrare un sito nuovo. Abbiamo già inviato la sitemap; cercate il nome della vostra attività tra qualche giorno."],
            ["Vedo informazioni vecchie", "Aggiornate la pagina o apritela in una finestra privata. Le modifiche possono richiedere qualche minuto per comparire."],
            ["Compare un avviso di sicurezza", "Non dovrebbe succedere: il certificato si rinnova da solo. Mandateci uno screenshot."],
            ...only(shop, [
              ["Pagamento MB WAY non completato", "Il cliente deve approvare il pagamento nell'app entro il tempo previsto. Se scade, l'ordine resta da pagare e il cliente può riprovare."],
              ["Riferimento Multibanco non pagato", "Il riferimento ha una scadenza impostata presso il fornitore. Dopo quella data, l'ordine può essere annullato."],
            ]),
          ],
        },
        {
          type: "callout",
          tone: "tip",
          text: `Quando chiedete aiuto, diteci l'indirizzo della pagina, cosa stavate facendo e, se possibile, mandateci uno screenshot. I nostri contatti sono nella pagina [Contatti](${link.contact}).`,
        },
      ],
    },
    faq: {
      title: `Domande frequenti: ${c.shortName}`,
      description: "Prezzo, tempi, contenuti, dominio e modifiche.",
      blocks: [{ type: "faq", items: c.faq }],
    },
  };
}

export function webDocs(productId: WebProductId): ProductDocs {
  return { productId, pages: pages(productId) };
}

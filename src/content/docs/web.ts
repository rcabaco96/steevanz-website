import { href } from "@/lib/routes";
import { productCopy } from "../product-copy";
import type { DocBlock, DocPageContent, DocPageId, ProductDocs } from "../types";
import type { WebProductId } from "../web-products";

/**
 * One set of docs for the three website products (landing page, website, online shop): the
 * project runs the same way, so the pages share their text and change only where the product does.
 */

interface WebFacts {
  /** Delivery time after the content is complete. */
  days: { pt: string; en: string };
  monthly: { pt: string; en: string };
  allowance: { pt: string; en: string };
  /** «a página» / «o site» / «a loja», used inside sentences. */
  thing: { pt: string; en: string };
  /** «pronta» / «pronto». */
  ready: string;
  isShop: boolean;
}

const facts: Record<WebProductId, WebFacts> = {
  "landing-page": {
    days: { pt: "5 dias úteis", en: "5 working days" },
    monthly: { pt: "15 € + IVA por mês", en: "€15 + VAT a month" },
    allowance: { pt: "30 minutos", en: "30 minutes" },
    thing: { pt: "a página", en: "the page" },
    ready: "pronta",
    isShop: false,
  },
  website: {
    days: { pt: "10 dias úteis", en: "10 working days" },
    monthly: { pt: "25 € + IVA por mês", en: "€25 + VAT a month" },
    allowance: { pt: "1 hora", en: "1 hour" },
    thing: { pt: "o site", en: "the website" },
    ready: "pronto",
    isShop: false,
  },
  "online-shop": {
    days: { pt: "15 a 20 dias úteis", en: "15 to 20 working days" },
    monthly: { pt: "39 € + IVA por mês", en: "€39 + VAT a month" },
    allowance: { pt: "1 h 30", en: "1.5 hours" },
    thing: { pt: "a loja", en: "the shop" },
    ready: "pronta",
    isShop: true,
  },
};

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);
const only = <T,>(condition: boolean, items: T[]): T[] => (condition ? items : []);

function pages(productId: WebProductId): Record<DocPageId, { pt: DocPageContent; en: DocPageContent }> {
  const f = facts[productId];
  const pt = productCopy[productId].pt;
  const en = productCopy[productId].en;
  const link = {
    pt: {
      product: href("pt", { key: "product", productId }),
      setup: href("pt", { key: "doc", productId, pageId: "setup" }),
      configuration: href("pt", { key: "doc", productId, pageId: "configuration" }),
      usage: href("pt", { key: "doc", productId, pageId: "usage" }),
      cart: href("pt", { key: "cart" }),
      contact: href("pt", { key: "contact" }),
    },
    en: {
      product: href("en", { key: "product", productId }),
      setup: href("en", { key: "doc", productId, pageId: "setup" }),
      configuration: href("en", { key: "doc", productId, pageId: "configuration" }),
      usage: href("en", { key: "doc", productId, pageId: "usage" }),
      cart: href("en", { key: "cart" }),
      contact: href("en", { key: "contact" }),
    },
  };

  const gettingStartedPt: DocBlock[] = [
    { type: "p", text: `**${pt.name}.** ${pt.summary}` },
    { type: "h2", id: "para-quem", text: "Para quem é" },
    { type: "ul", items: pt.useCases.map((useCase) => `**${useCase.title}:** ${useCase.body}`) },
    { type: "h2", id: "como-decorre", text: "Como decorre o projeto" },
    { type: "steps", items: pt.steps },
    { type: "h2", id: "prazo", text: "Prazo" },
    {
      type: "p",
      text: `${capitalize(f.thing.pt)} fica ${f.ready} em **${f.days.pt}** depois de recebermos os conteúdos completos. Antes de publicar, mostramos a primeira versão num link privado e tem 2 rondas de alterações incluídas.`,
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
    "getting-started": {
      pt: { title: `Primeiros passos: ${pt.name}`, description: pt.metaDescription, blocks: gettingStartedPt },
      en: { title: `Getting started: ${en.name}`, description: en.metaDescription, blocks: gettingStartedEn },
    },
    setup: {
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
    },
    configuration: {
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
    },
    usage: {
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
    },
    troubleshooting: {
      pt: { title: "Resolução de problemas", description: "Os problemas mais comuns depois de publicar e o que fazer.", blocks: troubleshootingPt },
      en: { title: "Troubleshooting", description: "The most common issues after launch and what to do.", blocks: troubleshootingEn },
    },
    faq: {
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
    },
  };
}

export function webDocs(productId: WebProductId): ProductDocs {
  return { productId, pages: pages(productId) };
}

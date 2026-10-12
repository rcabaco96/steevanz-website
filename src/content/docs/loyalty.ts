import type { ProductDocs } from "../types";

export const docs: ProductDocs = {
  productId: "loyalty",
  pages: {
    "getting-started": {
      pt: {
        title: "Primeiros passos com o cartão de fidelidade digital",
        description: "Como funciona o cartão de fidelidade da Steevanz: o cliente adere por QR code ou com um toque, junta carimbos a cada visita e recebe a recompensa no telemóvel.",
        blocks: [
          {
            type: "p",
            text: "O cartão de carimbos passa para o telemóvel do cliente. Adere ao balcão em segundos, junta um carimbo a cada visita e, ao completar o cartão, a recompensa aparece pronta a usar. Sem app e sem cartões de papel.",
          },
          { type: "h2", id: "como-funciona", text: "Como funciona" },
          {
            type: "ol",
            items: [
              "O cliente lê o QR code ou toca na placa ao balcão e cria o cartão só com o nome (o email é recomendado, o telemóvel é opcional).",
              "O cartão abre no telemóvel e pode ficar no ecrã principal, como uma app.",
              "A cada visita, a equipa dá o carimbo: lê o QR do cartão com o telemóvel do balcão, ou procura o cliente no Balcão.",
              "Ao chegar a uma recompensa (pelo caminho ou com o cartão completo), ela aparece no cartão. A equipa entrega-a da mesma forma. Uma recompensa já ganha não muda, mesmo que o dono mude as recompensas depois.",
            ],
          },
          {
            type: "steps",
            items: [
              { title: "Sem aplicação", body: "O cartão é uma página no telemóvel do cliente. Não há nada para instalar." },
              { title: "Sem fraude", body: "Só a equipa dá carimbos, no painel (com sessão iniciada). Quando dar cada carimbo é decisão sua." },
              { title: "Com estatísticas", body: "Veja quantos clientes aderiram, quantos voltaram e quantas recompensas foram entregues." },
            ],
          },
          { type: "p", text: "Próximo passo: veja como fazemos a [instalação](/docs/cartao-fidelidade-digital/instalacao)." },
        ],
      },
      en: {
        title: "Getting started with the digital loyalty card",
        description: "How the Steevanz loyalty card works: customers join by QR code or with a tap, collect a stamp at every visit and get their reward on their phone.",
        blocks: [
          {
            type: "p",
            text: "The stamp card moves to the customer's phone. They join at the counter in seconds, collect a stamp at every visit and, once the card is full, the reward appears ready to use. No app and no paper cards.",
          },
          { type: "h2", id: "how-it-works", text: "How it works" },
          {
            type: "ol",
            items: [
              "Customers scan the QR code or tap the plate at the counter and create their card with just a name (email recommended, phone optional).",
              "The card opens on the phone and can sit on the home screen, like an app.",
              "At every visit, your staff give the stamp: they scan the card's QR with the counter phone, or find the customer in the Balcão.",
              "When a reward is reached (along the way or with a full card), it appears on the card. Your staff hand it over the same way. A reward already earned never changes, even if the owner changes the rewards later.",
            ],
          },
          {
            type: "steps",
            items: [
              { title: "No app needed", body: "The card is a page on the customer's phone. There's nothing to install." },
              { title: "No fraud", body: "Only your staff give stamps, from the dashboard (signed in). When to give each stamp is up to you." },
              { title: "With stats", body: "See how many customers joined, how many came back and how many rewards were handed out." },
            ],
          },
          { type: "p", text: "Next step: see how we handle the [setup](/en/docs/digital-loyalty-card/setup)." },
        ],
      },
    },
    setup: {
      pt: {
        title: "Instalação do cartão de fidelidade digital",
        description: "Como a Steevanz põe o cartão a funcionar: regras e recompensa, placa de adesão ao balcão e um teste completo.",
        blocks: [
          { type: "p", text: "Tratamos da instalação consigo. Normalmente fica pronta em poucos dias úteis." },
          {
            type: "steps",
            items: [
              { title: "Enviar a informação do negócio", body: "Envie-nos o nome do negócio, as regras (quantos carimbos) e a recompensa. Usamos esta informação para configurar o cartão e a página." },
              { title: "Rever o texto de consentimento", body: "O texto que o cliente aceita ao criar o cartão. Usamos um texto padrão com o nome do seu negócio, que pode alterar." },
              { title: "Instalar a placa de adesão", body: "A placa com QR code fica no balcão, à vista, para os clientes aderirem." },
              { title: "Fazer um teste completo", body: "Criamos um cartão de teste, damos um carimbo e entregamos uma recompensa, para confirmar que tudo funciona." },
            ],
          },
          { type: "callout", tone: "info", text: "Depois, pode mudar as regras quando quiser em [configuração](/docs/cartao-fidelidade-digital/configuracao)." },
        ],
      },
      en: {
        title: "Setting up the digital loyalty card",
        description: "How Steevanz gets the card running: rules and reward, the sign-up plate at the counter and a full test.",
        blocks: [
          { type: "p", text: "We handle the setup with you. It is usually ready within a few working days." },
          {
            type: "steps",
            items: [
              { title: "Send your business details", body: "Send us your business name, the rules (how many stamps) and the reward. We use them to set up the card and the page." },
              { title: "Review the consent text", body: "The text customers accept when creating their card. We use a standard text with your business name, which you can change." },
              { title: "Place the sign-up plate", body: "The plate with QR code sits on the counter, in view, for customers to join." },
              { title: "Run a full test", body: "We create a test card, give a stamp and hand over a reward, to confirm everything works." },
            ],
          },
          { type: "callout", tone: "info", text: "Afterwards you can change the rules whenever you like in [configuration](/en/docs/digital-loyalty-card/configuration)." },
        ],
      },
    },
    configuration: {
      pt: {
        title: "Configuração: recompensas, antifraude e RGPD",
        description: "As regras do cartão: carimbos para completar, recompensa, validade e dados dos clientes.",
        blocks: [
          { type: "p", text: "As regras estão no separador **Definições** do cartão, na sua área de cliente." },
          {
            type: "table",
            head: ["Definição", "Para quê"],
            rows: [
              ["Carimbos para completar", "De 2 a 50 (por omissão 10). Se baixar o número, os cartões que já têm carimbos suficientes ficam logo completos."],
              ["Recompensa ao completar o cartão", "O que o cliente ganha no último carimbo, ex.: «um prato do dia oferecido»."],
              ["Recompensas pelo caminho", "Até 3, antes do cartão completo (ex.: ao 3.º carimbo um café, ao 6.º uma sobremesa). A primeira chega cedo e faz voltar; a grande fica no fim. Nos restaurantes vêm sugeridas; nos outros negócios fica só a final."],
              ["Consumo mínimo para carimbar", "«1 carimbo por visita a partir de X €». Aparece no cartão do cliente e no Balcão; a equipa aplica. Vazio = sem mínimo."],
              ["Validade da recompensa", "Em dias; vazio = sem validade."],
              ["Primeiro carimbo na adesão", "Oferece 1 carimbo ao criar o cartão."],
              ["Cartão ativo", "Em pausa: sem novas adesões nem carimbos."],
              ["Texto de consentimento", "Mostrado ao criar o cartão."],
            ],
          },
          { type: "h2", id: "rgpd", text: "Dados dos clientes" },
          {
            type: "ul",
            items: [
              "Só o nome é obrigatório. O email serve para recuperar o cartão; o telemóvel ajuda a encontrá-lo ao balcão.",
              "O cliente aceita o texto de consentimento ao criar o cartão.",
              "A pedido do cliente, a equipa apaga o cartão e todo o histórico.",
            ],
          },
        ],
      },
      en: {
        title: "Configuration: rewards, anti-fraud and GDPR",
        description: "The card's rules: stamps to complete, reward, validity and customer data.",
        blocks: [
          { type: "p", text: "The rules are in the card's **Settings** tab, in your client area." },
          {
            type: "table",
            head: ["Setting", "What it's for"],
            rows: [
              ["Stamps to complete", "From 2 to 50 (10 by default). If you lower it, cards that already have enough stamps are completed straight away."],
              ["Reward for a full card", "What the customer gets on the last stamp, e.g. «a free dish of the day»."],
              ["Rewards along the way", "Up to 3 before the card is full (e.g. a coffee at the 3rd stamp, a dessert at the 6th). The first comes early and brings people back; the big one stays at the end. Suggested for restaurants; other businesses keep only the final one."],
              ["Minimum spend per stamp", "«1 stamp per visit from X €». Shown on the customer's card and in the Balcão; your staff apply it. Empty = no minimum."],
              ["Reward validity", "In days; empty = no expiry."],
              ["First stamp on joining", "Gives 1 stamp when the card is created."],
              ["Card active", "Paused: no new sign-ups or stamps."],
              ["Consent text", "Shown when the card is created."],
            ],
          },
          { type: "h2", id: "gdpr", text: "Customer data" },
          {
            type: "ul",
            items: [
              "Only the name is required. The email lets them recover the card; the phone helps find it at the counter.",
              "Customers accept the consent text when creating their card.",
              "At the customer's request, your staff delete the card and its whole history.",
            ],
          },
        ],
      },
    },
    usage: {
      pt: {
        title: "Utilização diária do cartão",
        description: "Como dar carimbos, entregar recompensas, recuperar cartões e passar os carimbos do papel.",
        blocks: [
          { type: "h2", id: "carimbar", text: "Dar um carimbo" },
          {
            type: "ul",
            items: [
              "**Com o QR (a forma principal):** leia o QR do cartão com a câmara do telemóvel ou tablet do balcão. O cartão abre no Balcão: carregue em «Dar carimbo».",
              "**Sem QR:** procure o cliente no Balcão pelo nome, telemóvel ou código do cartão.",
            ],
          },
          { type: "h2", id: "recompensa", text: "Entregar a recompensa" },
          { type: "p", text: "Quando o cliente ganha uma recompensa, o cartão no telemóvel dele mostra-a (com uma pequena animação). Para a usar, leia o QR do cartão e carregue em «Entregar» no Balcão. O cartão recomeça e os carimbos a mais passam para o novo." },
          { type: "h2", id: "recuperar", text: "Cliente que mudou de telemóvel" },
          {
            type: "ul",
            items: [
              "Se deixou email: «Já tinha cartão?» na página de adesão envia-lhe o link.",
              "Sem email: procure o cartão no Balcão e carregue em «Mostrar QR do cartão». O cliente lê-o e o cartão volta a abrir.",
            ],
          },
          { type: "h2", id: "papel", text: "Carimbos do cartão de papel" },
          { type: "p", text: "Nos clientes do módulo, em «Mais», passe os carimbos que o cliente tinha no papel. O carimbo da visita de hoje pode ser dado logo a seguir." },
          { type: "callout", tone: "tip", text: "Errou um carimbo? «Retirar carimbo» no cartão do cliente. Se esse carimbo tinha completado o cartão, anula a recompensa por usar." },
        ],
      },
      en: {
        title: "Using the card day to day",
        description: "How to give stamps, hand over rewards, recover cards and move stamps from paper cards.",
        blocks: [
          { type: "h2", id: "stamping", text: "Giving a stamp" },
          {
            type: "ul",
            items: [
              "**With the QR (the main way):** scan the card's QR with the counter phone or tablet camera. The card opens in the Balcão: tap «Give stamp».",
              "**Without the QR:** find the customer in the Balcão by name, phone or card code.",
            ],
          },
          { type: "h2", id: "reward", text: "Handing over the reward" },
          { type: "p", text: "When a customer wins a reward, the card on their phone shows it (with a short animation). To use it, scan the card's QR and tap «Hand over» in the Balcão. The card starts again and any extra stamps carry over." },
          { type: "h2", id: "recover", text: "A customer with a new phone" },
          {
            type: "ul",
            items: [
              "If they left an email: «Already have a card?» on the sign-up page sends them the link.",
              "Without an email: find the card in the Balcão and tap «Show card QR». The customer scans it and the card opens again.",
            ],
          },
          { type: "h2", id: "paper", text: "Stamps from a paper card" },
          { type: "p", text: "In the module's customers, under «More», move the stamps the customer had on paper. Today's visit can be stamped right after." },
          { type: "callout", tone: "tip", text: "Stamped by mistake? «Remove stamp» on the customer's card. If that stamp completed the card, it takes back the unused reward." },
        ],
      },
    },
    troubleshooting: {
      pt: {
        title: "Resolução de problemas do cartão",
        description: "Soluções para problemas comuns: o carimbo é recusado, o cliente perdeu o cartão e a placa não abre.",
        blocks: [
          { type: "h2", id: "recusado", text: "O carimbo é recusado" },
          { type: "p", text: "Confirme que o cartão está ativo nas definições: em pausa, não se dão nem retiram carimbos." },
          { type: "h2", id: "perdeu", text: "O cliente perdeu o cartão" },
          { type: "p", text: "Use «Já tinha cartão?» (com email) ou «Mostrar QR do cartão» no Balcão. Veja [utilização](/docs/cartao-fidelidade-digital/utilizacao)." },
          { type: "h2", id: "placa", text: "A placa não abre" },
          { type: "p", text: "A leitura por aproximação tem de estar ligada no telemóvel (no Android, nas definições de ligações). Em alternativa, o cliente lê o QR code impresso na placa." },
        ],
      },
      en: {
        title: "Loyalty card troubleshooting",
        description: "Fixes for common issues: the stamp is refused, the customer lost the card and the plate doesn't open.",
        blocks: [
          { type: "h2", id: "refused", text: "The stamp is refused" },
          { type: "p", text: "Check the card is active in the settings: while paused, stamps can't be given or removed." },
          { type: "h2", id: "lost", text: "The customer lost their card" },
          { type: "p", text: "Use «Already have a card?» (with email) or «Show card QR» in the Balcão. See [usage](/en/docs/digital-loyalty-card/usage)." },
          { type: "h2", id: "plate", text: "The plate doesn't open" },
          { type: "p", text: "The phone's contactless (tap) reading must be on (on Android, in the connection settings). Otherwise, the customer scans the QR code printed on the plate." },
        ],
      },
    },
    faq: {
      pt: {
        title: "Perguntas frequentes sobre o cartão de fidelidade digital",
        description: "Respostas às dúvidas mais comuns: apps, telemóveis compatíveis, fraude, dados e cancelamento.",
        blocks: [
          { type: "h2", id: "perguntas", text: "Perguntas e respostas" },
          {
            type: "faq",
            items: [
              { q: "O cliente precisa de instalar uma app?", a: "Não. O cartão abre no navegador e pode ficar no ecrã principal do telemóvel." },
              { q: "O cartão fica na Apple Wallet ou na Google Wallet?", a: "Ainda não. É uma página no telemóvel, que pode ficar no ecrã principal." },
              { q: "Que telemóveis funcionam?", a: "Qualquer telemóvel com câmara usa o QR code. Os iPhone XS e mais recentes e a maioria dos Android com a leitura por aproximação ligada também leem a placa." },
              { q: "Como evito carimbos falsos?", a: "Só a equipa dá carimbos, pelo Balcão (com sessão iniciada). O cliente não consegue carimbar sozinho." },
              { q: "Que dados são guardados?", a: "O nome (email e telemóvel opcionais) e o registo de carimbos e recompensas, de acordo com o RGPD." },
              { q: "Posso cancelar o plano?", a: "Sim, o plano é mensal e sem fidelização. Recomendamos avisar os clientes para usarem as recompensas que já ganharam." },
            ],
          },
        ],
      },
      en: {
        title: "Digital loyalty card FAQ",
        description: "Answers to common questions: apps, compatible phones, fraud, data and cancelling.",
        blocks: [
          { type: "h2", id: "questions", text: "Questions and answers" },
          {
            type: "faq",
            items: [
              { q: "Do customers need to install an app?", a: "No. The card opens in the browser and can sit on the phone's home screen." },
              { q: "Does the card go in Apple Wallet or Google Wallet?", a: "Not yet. It's a page on the phone that can sit on the home screen." },
              { q: "Which phones work?", a: "Any phone with a camera can use the QR code. iPhone XS and newer and most Android phones with contactless reading on also read the plate." },
              { q: "How do I prevent fake stamps?", a: "Only your staff give stamps, from the Balcão (signed in). Customers can't stamp their own card." },
              { q: "What data is stored?", a: "The name (email and phone optional) and the record of stamps and rewards, in line with GDPR." },
              { q: "Can I cancel the plan?", a: "Yes, the plan is monthly with no minimum term. We recommend telling customers so they can use rewards they've already earned." },
            ],
          },
        ],
      },
    },
  },
};

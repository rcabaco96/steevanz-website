import type { ProductDocs } from "../types";

export const docs: ProductDocs = {
  productId: "nfc-social",
  pages: {
    "getting-started": {
      pt: {
        title: "Primeiros passos com NFC para redes sociais",
        description:
          "Descubra como as placas, autocolantes e cartões NFC da Steevanz levam os clientes ao seu Instagram, Facebook, TikTok, site ou cartão de visita digital.",
        blocks: [
          {
            type: "p",
            text: "Os produtos NFC para redes sociais transformam um simples toque com o telemóvel numa nova visita ao seu Instagram, à sua página de Facebook, ao seu TikTok ou ao seu site. Também servem como cartão de visita digital: um toque e o seu contacto fica guardado no telemóvel do cliente.",
          },
          {
            type: "p",
            text: "Tal como os restantes produtos Steevanz, é um serviço gerido. Nós configuramos tudo; esta documentação ajuda-o a escolher bem e a tirar partido do que tem.",
          },
          { type: "h2", id: "o-que-inclui", text: "O que inclui" },
          {
            type: "table",
            head: ["Produto", "Para que serve"],
            rows: [
              ["Placa ou suporte de balcão", "Levar clientes a seguir o negócio numa rede social ou a uma página de links"],
              ["Autocolante NFC", "Montras, menus, embalagens, espelhos"],
              ["Cartão NFC de visita", "Partilhar o seu contacto pessoal ou da equipa com um toque"],
              ["Página de links (link-in-bio)", "Uma página alojada pela Steevanz com todos os seus links num só sítio"],
            ],
          },
          { type: "h2", id: "como-funciona", text: "Como funciona" },
          {
            type: "p",
            text: "Cada placa ou cartão tem um chip NFC e, na maioria dos formatos, um código QR impresso. Ambos apontam para um link curto gerido pela Steevanz, que encaminha o cliente para o destino que escolheu. Como o destino fica do nosso lado, pode mudá-lo sempre que quiser sem reimprimir nada.",
          },
          {
            type: "ol",
            items: [
              "O cliente aproxima o telemóvel ou lê o QR.",
              "O telemóvel abre o link: na aplicação da rede social, se estiver instalada, ou no navegador.",
              "O cliente segue a sua página, vê a sua montra de links ou guarda o seu contacto.",
            ],
          },
          { type: "h2", id: "para-quem", text: "Para quem é" },
          {
            type: "ul",
            items: [
              "**Restaurantes e cafés** que querem mais seguidores no Instagram para mostrar pratos e novidades.",
              "**Salões de cabeleireiro e estética** que usam o Instagram ou o TikTok como portefólio.",
              "**Lojas** que querem levar clientes à loja online ou ao catálogo.",
              "**Profissionais e equipas comerciais** que trocam contactos todos os dias.",
            ],
          },
          { type: "h2", id: "proximos-passos", text: "Próximos passos" },
          {
            type: "ul",
            items: [
              "[Instalação](/docs/nfc-redes-sociais/instalacao): escolher o destino e colocar as placas.",
              "[Configuração](/docs/nfc-redes-sociais/configuracao): página de links, cartão de visita e alteração do destino.",
              "[Utilização](/docs/nfc-redes-sociais/utilizacao): ideias de colocação e estatísticas de toques.",
            ],
          },
          {
            type: "callout",
            tone: "info",
            text: "A Steevanz é independente e não tem qualquer afiliação com a Meta, o TikTok, a Google ou a Apple. As placas apenas abrem os links públicos das suas páginas.",
          },
        ],
      },
      en: {
        title: "Getting started with NFC for social media",
        description:
          "See how Steevanz NFC plates, stickers and cards take customers to your Instagram, Facebook, TikTok, website or digital business card in a single tap.",
        blocks: [
          {
            type: "p",
            text: "Our NFC social media products turn a simple phone tap into a new visit to your Instagram, Facebook page, TikTok or website. They also work as a digital business card: one tap and your contact details are saved on the customer's phone.",
          },
          {
            type: "p",
            text: "Like all Steevanz products, it's a managed service. We set everything up; this documentation helps you choose well and make the most of what you have.",
          },
          { type: "h2", id: "whats-included", text: "What's included" },
          {
            type: "table",
            head: ["Product", "What it's for"],
            rows: [
              ["Counter plate or stand", "Getting customers to follow you on a social network or visit a links page"],
              ["NFC sticker", "Shop windows, menus, packaging, mirrors"],
              ["NFC business card", "Sharing your own or your team's contact details with a tap"],
              ["Links page (link-in-bio)", "A page hosted by Steevanz with all your links in one place"],
            ],
          },
          { type: "h2", id: "how-it-works", text: "How it works" },
          {
            type: "p",
            text: "Each plate or card has an NFC chip and, on most formats, a printed QR code. Both point to a short link managed by Steevanz, which forwards the customer to the destination you choose. Because the destination lives on our side, you can change it whenever you like without reprinting anything.",
          },
          {
            type: "ol",
            items: [
              "The customer taps their phone or scans the QR code.",
              "The phone opens the link: in the social media app if it's installed, otherwise in the browser.",
              "The customer follows your page, browses your links or saves your contact.",
            ],
          },
          { type: "h2", id: "who-its-for", text: "Who it's for" },
          {
            type: "ul",
            items: [
              "**Restaurants and cafés** wanting more Instagram followers to show off dishes and news.",
              "**Hair and beauty salons** using Instagram or TikTok as a portfolio.",
              "**Shops** wanting to send customers to their online store or catalogue.",
              "**Professionals and sales teams** who swap contact details every day.",
            ],
          },
          { type: "h2", id: "next-steps", text: "Next steps" },
          {
            type: "ul",
            items: [
              "[Setup](/en/docs/nfc-social-media/setup): choosing a destination and placing your plates.",
              "[Configuration](/en/docs/nfc-social-media/configuration): links page, business card and changing the destination.",
              "[Usage](/en/docs/nfc-social-media/usage): placement ideas and tap statistics.",
            ],
          },
          {
            type: "callout",
            tone: "info",
            text: "Steevanz is independent and has no affiliation with Meta, TikTok, Google or Apple. The plates simply open the public links to your pages.",
          },
        ],
      },
    },
    setup: {
      pt: {
        title: "Instalação dos produtos NFC para redes sociais",
        description:
          "Como escolher o destino certo para cada placa ou cartão NFC, que informação enviar à Steevanz e onde colocar as placas para ter mais toques.",
        blocks: [
          {
            type: "p",
            text: "A instalação começa por uma decisão: para onde deve ir o cliente quando toca na placa? Depois de definido o destino, a Steevanz grava, bloqueia e testa os chips, e só tem de os colocar no sítio certo.",
          },
          { type: "h2", id: "escolher-destino", text: "Escolher o destino" },
          {
            type: "table",
            head: ["Destino", "Quando escolher"],
            rows: [
              ["Um perfil (Instagram, TikTok, Facebook)", "Quando tem uma rede principal e quer crescer nela"],
              ["Página de links Steevanz", "Quando tem várias redes, site, menu ou loja online"],
              ["Site ou página específica", "Para promoções, menu digital ou loja online"],
              ["Cartão de contacto", "Para cartões pessoais ou da equipa"],
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Na dúvida, escolha a página de links. Dá ao cliente todas as opções num só toque e pode alterar o conteúdo a qualquer momento.",
          },
          { type: "h2", id: "passos-instalacao", text: "Passos de instalação" },
          {
            type: "steps",
            items: [
              {
                title: "Reunir os links",
                body: "Copie o endereço completo de cada perfil, por exemplo `https://www.instagram.com/onomedoseunegocio`. Confirme que os perfis são públicos.",
              },
              {
                title: "Enviar à Steevanz",
                body: "Envie os links, o logótipo e, no caso de cartões de visita, os dados de contacto (nome, cargo, telemóvel, email, morada). Pode fazê-lo por WhatsApp ou email.",
              },
              {
                title: "Aprovar a pré-visualização",
                body: "Enviamos-lhe uma pré-visualização da página de links ou do cartão digital. Peça as alterações que quiser antes da gravação.",
              },
              {
                title: "Receber e colocar",
                body: "As placas chegam gravadas, bloqueadas e testadas. Coloque-as nos locais escolhidos.",
              },
              {
                title: "Testar no local",
                body: "Toque com um iPhone e um Android em cada placa e leia o QR com a câmara para confirmar o destino.",
              },
            ],
          },
          { type: "h2", id: "onde-colocar", text: "Onde colocar" },
          {
            type: "ul",
            items: [
              "Junto à caixa, onde o cliente espera com o telemóvel na mão.",
              "Nas mesas, ao lado do menu ou do suporte de avaliações Google.",
              "Na montra, do lado de dentro do vidro: o NFC atravessa vidro fino, mas teste sempre.",
              "Em espelhos de salões de beleza, onde os clientes costumam tirar fotografias.",
            ],
          },
          {
            type: "callout",
            tone: "warning",
            title: "Evite metal",
            text: "Superfícies metálicas e terminais de pagamento interferem com o NFC. Para metal, peça a versão anti-metal.",
          },
          { type: "h2", id: "combinar-produtos", text: "Combinar com outros produtos" },
          {
            type: "p",
            text: "Muitos negócios combinam uma placa de redes sociais com uma [placa NFC Google Reviews](/produtos/placas-nfc-google-reviews). Mantenha as duas bem identificadas (\"Siga-nos\" e \"Avalie-nos\") para o cliente saber o que acontece em cada uma.",
          },
        ],
      },
      en: {
        title: "Setting up your NFC social media products",
        description:
          "How to choose the right destination for each NFC plate or card, what information to send to Steevanz and where to place plates to get more taps.",
        blocks: [
          {
            type: "p",
            text: "Setup starts with one decision: where should customers go when they tap the plate? Once the destination is set, Steevanz writes, locks and tests the chips, and you just need to put them in the right place.",
          },
          { type: "h2", id: "choose-destination", text: "Choosing a destination" },
          {
            type: "table",
            head: ["Destination", "When to choose it"],
            rows: [
              ["A single profile (Instagram, TikTok, Facebook)", "When you have one main network and want to grow it"],
              ["Steevanz links page", "When you have several networks, a website, a menu or an online shop"],
              ["Website or a specific page", "For promotions, a digital menu or an online shop"],
              ["Contact card", "For personal or team business cards"],
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "If in doubt, choose the links page. It gives customers every option in one tap and you can change its content at any time.",
          },
          { type: "h2", id: "setup-steps", text: "Setup steps" },
          {
            type: "steps",
            items: [
              {
                title: "Gather your links",
                body: "Copy the full address of each profile, for example `https://www.instagram.com/yourbusinessname`. Make sure the profiles are public.",
              },
              {
                title: "Send them to Steevanz",
                body: "Send the links, your logo and, for business cards, the contact details (name, job title, mobile, email, address). WhatsApp or email both work.",
              },
              {
                title: "Approve the preview",
                body: "We send you a preview of the links page or digital card. Ask for any changes before we write the chips.",
              },
              {
                title: "Receive and place",
                body: "The plates arrive written, locked and tested. Put them in the spots you've chosen.",
              },
              {
                title: "Test on site",
                body: "Tap each plate with an iPhone and an Android phone and scan the QR code with the camera to confirm the destination.",
              },
            ],
          },
          { type: "h2", id: "where-to-place", text: "Where to place them" },
          {
            type: "ul",
            items: [
              "By the till, where customers wait with their phone in hand.",
              "On tables, next to the menu or your Google review stand.",
              "In the shop window, on the inside of the glass: NFC works through thin glass, but always test it.",
              "On salon mirrors, where clients tend to take photos.",
            ],
          },
          {
            type: "callout",
            tone: "warning",
            title: "Avoid metal",
            text: "Metal surfaces and card terminals interfere with NFC. For metal, ask for the anti-metal version.",
          },
          { type: "h2", id: "combine-products", text: "Combining with other products" },
          {
            type: "p",
            text: "Many businesses pair a social media plate with an [NFC Google review plate](/en/products/nfc-google-review-plates). Label them clearly (\"Follow us\" and \"Review us\") so customers know what each one does.",
          },
        ],
      },
    },
    configuration: {
      pt: {
        title: "Configuração: página de links, cartão e destino",
        description:
          "Como funciona a página de links alojada pela Steevanz, o cartão de visita digital com contacto guardável e a alteração do destino sem reimprimir.",
        blocks: [
          {
            type: "p",
            text: "Nesta página explicamos as três peças que pode configurar: o destino de cada placa, a página de links e o cartão de visita digital.",
          },
          { type: "h2", id: "redirecionamento-dinamico", text: "Redirecionamento dinâmico" },
          {
            type: "p",
            text: "Os chips são gravados com um link curto da Steevanz e depois **bloqueados**, para que ninguém os possa reescrever. O destino real fica guardado do nosso lado. Isso significa que pode:",
          },
          {
            type: "ul",
            items: [
              "Trocar o Instagram pelo TikTok numa campanha de verão.",
              "Apontar temporariamente uma placa para uma promoção ou para o menu de Natal.",
              "Corrigir um link sem trocar a placa.",
            ],
          },
          {
            type: "p",
            text: "Para alterar o destino, basta enviar-nos o novo link por WhatsApp ou email, indicando que placas devem mudar. Confirmamos quando estiver ativo.",
          },
          { type: "h2", id: "pagina-links", text: "Página de links" },
          {
            type: "p",
            text: "A página de links é uma página simples e rápida, alojada pela Steevanz, com o seu logótipo, as suas cores e uma lista de botões. Pode incluir:",
          },
          {
            type: "ul",
            items: [
              "Redes sociais (Instagram, Facebook, TikTok, YouTube, LinkedIn).",
              "Site, loja online ou menu digital.",
              "Botões de WhatsApp, chamada e direções no mapa.",
              "Link para avaliações e para reservas, se usar esses serviços.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Menos é mais. Uma página com 4 a 6 botões bem escolhidos funciona melhor do que uma lista longa. Coloque em primeiro lugar a ação mais importante.",
          },
          { type: "h2", id: "cartao-visita-digital", text: "Cartão de visita digital" },
          {
            type: "p",
            text: "O cartão NFC abre uma página de contacto com a sua fotografia, nome, cargo e botões de ação. O botão **Guardar contacto** descarrega um ficheiro `.vcf` (vCard), que o telemóvel reconhece e propõe adicionar aos contactos.",
          },
          {
            type: "table",
            head: ["Sistema", "O que acontece ao guardar"],
            rows: [
              ["iPhone", "Abre a pré-visualização do contacto; o utilizador toca em \"Criar novo contacto\""],
              ["Android", "Abre a aplicação de contactos ou pergunta onde guardar; o utilizador confirma"],
            ],
          },
          {
            type: "p",
            text: "Usamos uma página em vez de gravar o contacto diretamente no chip porque funciona de forma consistente em iPhone e Android, e porque permite atualizar os dados (por exemplo, um novo número de telemóvel) sem trocar o cartão.",
          },
          { type: "h2", id: "dados-necessarios", text: "Dados que precisamos" },
          {
            type: "ul",
            items: [
              "Logótipo em boa resolução (de preferência SVG ou PNG com fundo transparente).",
              "Cores da marca, se as tiver definidas.",
              "Links completos de cada rede e site.",
              "Para cartões: nome, cargo, telemóvel, email, morada e fotografia (opcional).",
            ],
          },
        ],
      },
      en: {
        title: "Configuration: links page, card and destination",
        description:
          "How the Steevanz-hosted links page works, how the digital business card saves contacts, and how to change the destination without reprinting anything.",
        blocks: [
          {
            type: "p",
            text: "This page explains the three things you can configure: the destination of each plate, the links page and the digital business card.",
          },
          { type: "h2", id: "dynamic-redirect", text: "Dynamic redirect" },
          {
            type: "p",
            text: "The chips are written with a Steevanz short link and then **locked** so nobody can rewrite them. The real destination is stored on our side. That means you can:",
          },
          {
            type: "ul",
            items: [
              "Swap Instagram for TikTok during a summer campaign.",
              "Temporarily point a plate at a promotion or your Christmas menu.",
              "Fix a link without replacing the plate.",
            ],
          },
          {
            type: "p",
            text: "To change the destination, just send us the new link via WhatsApp or email and tell us which plates should change. We'll confirm once it's live.",
          },
          { type: "h2", id: "links-page", text: "Links page" },
          {
            type: "p",
            text: "The links page is a simple, fast page hosted by Steevanz, with your logo, your colours and a list of buttons. It can include:",
          },
          {
            type: "ul",
            items: [
              "Social networks (Instagram, Facebook, TikTok, YouTube, LinkedIn).",
              "Website, online shop or digital menu.",
              "WhatsApp, call and map directions buttons.",
              "Links to reviews and bookings, if you use those services.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Less is more. A page with 4 to 6 well-chosen buttons works better than a long list. Put the most important action first.",
          },
          { type: "h2", id: "digital-business-card", text: "Digital business card" },
          {
            type: "p",
            text: "The NFC card opens a contact page with your photo, name, job title and action buttons. The **Save contact** button downloads a `.vcf` (vCard) file, which the phone recognises and offers to add to contacts.",
          },
          {
            type: "table",
            head: ["System", "What happens when saving"],
            rows: [
              ["iPhone", "Shows a contact preview; the user taps \"Create New Contact\""],
              ["Android", "Opens the contacts app or asks where to save; the user confirms"],
            ],
          },
          {
            type: "p",
            text: "We use a page rather than writing the contact straight onto the chip because it behaves consistently on iPhone and Android, and it lets us update your details (a new mobile number, say) without replacing the card.",
          },
          { type: "h2", id: "information-needed", text: "Information we need" },
          {
            type: "ul",
            items: [
              "Your logo in good resolution (ideally SVG, or PNG with a transparent background).",
              "Brand colours, if you have them.",
              "Full links for each network and website.",
              "For cards: name, job title, mobile, email, address and photo (optional).",
            ],
          },
        ],
      },
    },
    usage: {
      pt: {
        title: "Utilização: ideias de colocação e estatísticas",
        description:
          "Como os clientes abrem as suas redes com NFC em iPhone e Android, ideias para colocar as placas e como ler as estatísticas de toques de cada placa.",
        blocks: [
          {
            type: "p",
            text: "Com as placas no sítio, o objetivo é simples: fazer com que os clientes as usem. Esta página mostra o que o cliente vê no telemóvel, dá ideias práticas e explica as estatísticas.",
          },
          { type: "h2", id: "experiencia-cliente", text: "O que o cliente vê" },
          {
            type: "table",
            head: ["Situação", "Comportamento habitual"],
            rows: [
              ["iPhone com a app instalada", "Surge uma notificação; ao tocar, a app abre normalmente no perfil"],
              ["iPhone sem a app", "O perfil abre no Safari"],
              ["Android com a app instalada", "Abre diretamente a app ou pergunta com que app abrir"],
              ["Android sem a app", "O perfil abre no navegador predefinido"],
            ],
          },
          {
            type: "callout",
            tone: "info",
            text: "Por vezes, sobretudo quando a pessoa não tem sessão iniciada, o perfil abre no navegador com um botão para abrir na aplicação. É um comportamento das próprias redes sociais e não depende da placa.",
          },
          { type: "h2", id: "ideias-colocacao", text: "Ideias de colocação" },
          {
            type: "ul",
            items: [
              "**Café**: autocolante no balcão de levantamento, onde se espera pelo café.",
              "**Restaurante**: suporte de mesa com \"Siga-nos e veja os pratos do dia\".",
              "**Cabeleireiro**: autocolante no espelho, junto ao momento da fotografia final.",
              "**Loja**: autocolante no provador ou nas embalagens.",
              "**Eventos e feiras**: cartões de visita NFC para a equipa comercial.",
            ],
          },
          { type: "h2", id: "chamada-acao", text: "Uma boa chamada à ação" },
          {
            type: "p",
            text: "Uma placa só com um logótipo passa despercebida. Um texto curto a dizer o que o cliente ganha funciona melhor:",
          },
          {
            type: "ul",
            items: [
              "\"Siga-nos no Instagram: novidades todas as semanas.\"",
              "\"Encoste o telemóvel para ver o menu e as nossas redes.\"",
              "\"Guarde o meu contacto com um toque.\"",
            ],
          },
          {
            type: "p",
            text: "Não prometa ofertas que dependam de seguir a página sem verificar primeiro as regras de promoções da rede social em causa.",
          },
          { type: "h2", id: "estatisticas", text: "Estatísticas de toques" },
          {
            type: "p",
            text: "Como cada toque passa pelo redirecionamento da Steevanz, conseguimos contar as aberturas por placa, sem recolher dados pessoais dos clientes. Pode pedir-nos o resumo, ou consultá-lo na sua área de cliente, se estiver disponível para o seu plano.",
          },
          {
            type: "ul",
            items: [
              "Número de aberturas por placa e por período.",
              "Comparação entre locais (mesa, balcão, montra).",
              "Divisão entre NFC e QR, quando os links são distintos.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Use os números para decidir. Se a placa da montra quase não é usada e a do balcão tem muitos toques, mude a da montra para outro sítio.",
          },
          { type: "h2", id: "cuidados", text: "Cuidados" },
          {
            type: "p",
            text: "Limpe as placas com um pano macio e detergente neutro, sem álcool nem produtos abrasivos. Guarde os cartões de visita longe de ímanes fortes e evite dobrá-los.",
          },
        ],
      },
      en: {
        title: "Usage: placement ideas and statistics",
        description:
          "How customers open your social pages with NFC on iPhone and Android, practical ideas for placing plates and how to read the tap statistics per plate.",
        blocks: [
          {
            type: "p",
            text: "With the plates in place, the goal is simple: get customers to use them. This page shows what customers see on their phone, offers practical ideas and explains the statistics.",
          },
          { type: "h2", id: "customer-experience", text: "What the customer sees" },
          {
            type: "table",
            head: ["Situation", "Typical behaviour"],
            rows: [
              ["iPhone with the app installed", "A notification appears; tapping it usually opens the profile in the app"],
              ["iPhone without the app", "The profile opens in Safari"],
              ["Android with the app installed", "Opens the app directly or asks which app to use"],
              ["Android without the app", "The profile opens in the default browser"],
            ],
          },
          {
            type: "callout",
            tone: "info",
            text: "Sometimes, especially when the person isn't signed in, the profile opens in the browser with a button to open it in the app. That's how the social networks themselves behave and doesn't depend on the plate.",
          },
          { type: "h2", id: "placement-ideas", text: "Placement ideas" },
          {
            type: "ul",
            items: [
              "**Café**: a sticker on the pick-up counter, where people wait for their coffee.",
              "**Restaurant**: a table stand saying \"Follow us for today's specials\".",
              "**Hair salon**: a sticker on the mirror, right at the final-photo moment.",
              "**Shop**: a sticker in the fitting room or on packaging.",
              "**Events and trade fairs**: NFC business cards for your sales team.",
            ],
          },
          { type: "h2", id: "call-to-action", text: "A good call to action" },
          {
            type: "p",
            text: "A plate with just a logo gets overlooked. A short line telling customers what they get works better:",
          },
          {
            type: "ul",
            items: [
              "\"Follow us on Instagram: something new every week.\"",
              "\"Tap your phone to see our menu and socials.\"",
              "\"Save my contact with one tap.\"",
            ],
          },
          {
            type: "p",
            text: "Don't promise rewards for following your page without first checking the promotion rules of the social network concerned.",
          },
          { type: "h2", id: "tap-statistics", text: "Tap statistics" },
          {
            type: "p",
            text: "Because every tap goes through the Steevanz redirect, we can count opens per plate without collecting any personal data about your customers. Ask us for a summary, or check it in your client area if it's available on your plan.",
          },
          {
            type: "ul",
            items: [
              "Number of opens per plate and per period.",
              "Comparison between spots (table, counter, window).",
              "NFC versus QR split, when the links are kept separate.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Let the numbers guide you. If the window plate is barely used and the counter one gets lots of taps, move the window plate somewhere else.",
          },
          { type: "h2", id: "care", text: "Care" },
          {
            type: "p",
            text: "Clean plates with a soft cloth and mild detergent, without alcohol or abrasive products. Keep business cards away from strong magnets and avoid bending them.",
          },
        ],
      },
    },
    troubleshooting: {
      pt: {
        title: "Resolução de problemas: NFC para redes sociais",
        description:
          "Soluções para placas e cartões NFC que não abrem, perfis que abrem no navegador, contactos que não ficam guardados e links de redes sociais alterados.",
        blocks: [
          {
            type: "p",
            text: "A maioria das situações resolve-se em poucos minutos. Se nada disto ajudar, fale connosco pelo [contacto](/contacto) ou por WhatsApp.",
          },
          { type: "h2", id: "nao-le", text: "O telemóvel não lê a placa" },
          {
            type: "ol",
            items: [
              "Desbloqueie o ecrã. Os telemóveis só leem NFC com o ecrã ligado.",
              "Em Android, ative o NFC nas definições.",
              "Em iPhone 7, 8 ou X, use o \"Leitor de etiquetas NFC\" na Central de Controlo. Do iPhone XS em diante a leitura é automática.",
              "Retire capas metálicas, capas-carteira ou popsockets e aproxime a parte superior (iPhone) ou central (muitos Android) das costas do telemóvel.",
              "Se nada funcionar, use o código QR.",
            ],
          },
          { type: "h2", id: "abre-navegador", text: "Abre no navegador em vez da aplicação" },
          {
            type: "p",
            text: "É normal em alguns casos. As redes sociais decidem se o link abre na aplicação ou no navegador, com base no sistema operativo, na versão da aplicação e na sessão iniciada. O cliente pode tocar em \"Abrir na aplicação\" no topo da página.",
          },
          {
            type: "callout",
            tone: "tip",
            text: "Se isto for frequente com o seu público, uma página de links pode dar melhores resultados: abre sempre rapidamente no navegador e cada botão leva à rede certa.",
          },
          { type: "h2", id: "perfil-nao-encontrado", text: "Perfil não encontrado" },
          {
            type: "ul",
            items: [
              "Mudou o nome de utilizador? O link antigo deixa de funcionar. Envie-nos o novo link e atualizamos o destino.",
              "O perfil é privado? Os visitantes veem apenas o nome e o botão de seguir.",
              "A conta foi suspensa ou restringida? Resolva primeiro com a rede social; entretanto podemos apontar as placas para o seu site.",
            ],
          },
          { type: "h2", id: "contacto-nao-guarda", text: "O contacto não fica guardado" },
          {
            type: "ul",
            items: [
              "Confirme que tocou em **Guardar contacto** e depois em \"Criar novo contacto\" (iPhone) ou em guardar (Android).",
              "Alguns navegadores dentro de aplicações (por exemplo, o navegador interno de uma rede social) bloqueiam descargas. Abra a página no Safari ou no Chrome.",
              "Se os dados estiverem desatualizados, envie-nos a correção: a alteração é feita do nosso lado, sem trocar o cartão.",
            ],
          },
          { type: "h2", id: "danos", text: "Placa ou cartão danificado" },
          {
            type: "p",
            text: "Cartões dobrados ou placas partidas podem ter o chip danificado. Envie-nos uma fotografia e tratamos da substituição.",
          },
        ],
      },
      en: {
        title: "Troubleshooting NFC for social media",
        description:
          "Fixes for NFC plates and cards that won't open, profiles opening in the browser, contacts that won't save and social media links that have changed.",
        blocks: [
          {
            type: "p",
            text: "Most issues can be sorted in a few minutes. If none of this helps, [contact us](/en/contact) or message us on WhatsApp.",
          },
          { type: "h2", id: "wont-read", text: "The phone won't read the plate" },
          {
            type: "ol",
            items: [
              "Unlock the screen. Phones only read NFC with the screen on.",
              "On Android, turn NFC on in settings.",
              "On iPhone 7, 8 or X, use \"NFC Tag Reader\" in Control Centre. From iPhone XS onwards reading is automatic.",
              "Remove metal cases, wallet cases or popsockets and hold the top (iPhone) or middle (many Android phones) of the back of the phone to the plate.",
              "If nothing works, use the QR code.",
            ],
          },
          { type: "h2", id: "opens-in-browser", text: "It opens in the browser instead of the app" },
          {
            type: "p",
            text: "This is normal in some cases. The social networks decide whether a link opens in the app or the browser, based on the operating system, the app version and whether the user is signed in. The customer can tap \"Open in app\" at the top of the page.",
          },
          {
            type: "callout",
            tone: "tip",
            text: "If this happens a lot with your audience, a links page may work better: it always opens quickly in the browser and each button leads to the right network.",
          },
          { type: "h2", id: "profile-not-found", text: "Profile not found" },
          {
            type: "ul",
            items: [
              "Changed your username? The old link stops working. Send us the new link and we'll update the destination.",
              "Is the profile private? Visitors only see the name and the follow button.",
              "Was the account suspended or restricted? Sort it out with the social network first; meanwhile we can point your plates at your website.",
            ],
          },
          { type: "h2", id: "contact-not-saving", text: "The contact won't save" },
          {
            type: "ul",
            items: [
              "Make sure you tapped **Save contact** and then \"Create New Contact\" (iPhone) or save (Android).",
              "Some in-app browsers (such as a social network's built-in browser) block downloads. Open the page in Safari or Chrome.",
              "If the details are out of date, send us the correction: we change it on our side, with no new card needed.",
            ],
          },
          { type: "h2", id: "damage", text: "Damaged plate or card" },
          {
            type: "p",
            text: "Bent cards or broken plates may have a damaged chip. Send us a photo and we'll arrange a replacement.",
          },
        ],
      },
    },
    faq: {
      pt: {
        title: "Perguntas frequentes: NFC para redes sociais",
        description:
          "Respostas rápidas sobre placas e cartões NFC para Instagram, Facebook, TikTok e contactos: compatibilidade, alterações de destino, estatísticas e privacidade.",
        blocks: [
          { type: "h2", id: "perguntas", text: "Perguntas frequentes" },
          {
            type: "faq",
            items: [
              {
                q: "Posso ligar uma placa a mais do que uma rede social?",
                a: "Cada placa abre um único destino. Para várias redes, use a página de links da Steevanz, que reúne todos os seus perfis num só sítio.",
              },
              {
                q: "Posso mudar o destino depois de receber as placas?",
                a: "Sim. Os chips apontam para um redirecionamento gerido pela Steevanz. Envie-nos o novo link e atualizamos, sem reimprimir.",
              },
              {
                q: "O cliente precisa de ter a aplicação instalada?",
                a: "Não. Se não tiver a aplicação, o perfil abre no navegador.",
              },
              {
                q: "O cartão de visita funciona em iPhone e Android?",
                a: "Sim. O cartão abre uma página com um botão para guardar o contacto, que funciona nos dois sistemas.",
              },
              {
                q: "Posso atualizar os dados do cartão de visita?",
                a: "Sim. Os dados estão na página alojada pela Steevanz, por isso um novo telemóvel ou email não obriga a trocar o cartão.",
              },
              {
                q: "Alguém pode reprogramar as minhas placas?",
                a: "Não. Bloqueamos todos os chips depois de os gravar.",
              },
              {
                q: "Recolhem dados dos meus clientes?",
                a: "As estatísticas contam aberturas por placa, sem identificar quem tocou. Não recolhemos dados pessoais dos clientes através das placas.",
              },
              {
                q: "A Steevanz é parceira da Meta ou do TikTok?",
                a: "Não. A Steevanz é independente. As placas abrem os links públicos das suas páginas.",
              },
              {
                q: "O NFC funciona através do vidro da montra?",
                a: "Normalmente sim, com vidro simples e fino. Vidros duplos ou com películas metalizadas podem impedir a leitura; teste antes de fixar.",
              },
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Tem outra dúvida? [Fale connosco](/contacto) ou veja o [produto NFC para redes sociais](/produtos/nfc-redes-sociais).",
          },
        ],
      },
      en: {
        title: "NFC for social media FAQ",
        description:
          "Quick answers about NFC plates and cards for Instagram, Facebook, TikTok and contacts: compatibility, changing destinations, statistics and privacy.",
        blocks: [
          { type: "h2", id: "questions", text: "Frequently asked questions" },
          {
            type: "faq",
            items: [
              {
                q: "Can one plate link to more than one social network?",
                a: "Each plate opens a single destination. For several networks, use the Steevanz links page, which brings all your profiles together.",
              },
              {
                q: "Can I change the destination after receiving the plates?",
                a: "Yes. The chips point to a redirect managed by Steevanz. Send us the new link and we'll update it, with no reprinting.",
              },
              {
                q: "Does the customer need the app installed?",
                a: "No. Without the app, the profile opens in the browser.",
              },
              {
                q: "Does the business card work on iPhone and Android?",
                a: "Yes. The card opens a page with a save-contact button that works on both systems.",
              },
              {
                q: "Can I update the details on my business card?",
                a: "Yes. The details live on the page hosted by Steevanz, so a new mobile number or email doesn't mean a new card.",
              },
              {
                q: "Can someone reprogram my plates?",
                a: "No. We lock every chip after writing it.",
              },
              {
                q: "Do you collect data about my customers?",
                a: "Statistics count opens per plate without identifying who tapped. We don't collect customers' personal data through the plates.",
              },
              {
                q: "Is Steevanz a Meta or TikTok partner?",
                a: "No. Steevanz is independent. The plates open the public links to your pages.",
              },
              {
                q: "Does NFC work through a shop window?",
                a: "Usually yes, with plain thin glass. Double glazing or metallised films can block it; test before fixing it in place.",
              },
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Got another question? [Get in touch](/en/contact) or see the [NFC social media product](/en/products/nfc-social-media).",
          },
        ],
      },
    },
  },
};

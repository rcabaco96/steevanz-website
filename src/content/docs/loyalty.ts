import type { ProductDocs } from "../types";

export const docs: ProductDocs = {
  productId: "loyalty",
  pages: {
    "getting-started": {
      pt: {
        title: "Primeiros passos com o cartão de fidelidade digital",
        description:
          "Conheça o cartão de fidelidade digital da Steevanz: carimbos por NFC ou QR, sem aplicação, guardado na Apple Wallet ou Google Wallet do seu cliente.",
        blocks: [
          {
            type: "p",
            text: "O cartão de fidelidade digital substitui os cartões de cartão que se perdem na carteira. O cliente adere com um toque ou lendo um código QR, guarda o cartão no telemóvel e vai acumulando carimbos a cada visita. Quando completa o cartão, recebe a recompensa.",
          },
          {
            type: "p",
            text: "É um serviço gerido: a Steevanz desenha o cartão com a sua imagem, define as regras consigo e dá formação à equipa. Esta documentação explica como tudo funciona.",
          },
          { type: "h2", id: "como-funciona", text: "Como funciona" },
          {
            type: "ol",
            items: [
              "O cliente toca na placa NFC ou lê o QR ao balcão.",
              "Preenche um formulário curto e dá o consentimento para o tratamento dos dados.",
              "Adiciona o cartão à Apple Wallet ou à Google Wallet, ou abre-o como página web.",
              "Em cada visita, a equipa atribui um carimbo.",
              "Ao completar o cartão, o cliente recebe a recompensa e começa um cartão novo.",
            ],
          },
          {
            type: "callout",
            tone: "info",
            title: "Sem aplicação",
            text: "O cliente não instala nenhuma aplicação. A Apple Wallet e a Google Wallet já existem na maioria dos telemóveis, e quem preferir pode usar o cartão como página web.",
          },
          { type: "h2", id: "vantagens", text: "Vantagens face ao cartão de papel" },
          {
            type: "table",
            head: ["Cartão de papel", "Cartão digital Steevanz"],
            rows: [
              ["Perde-se ou fica esquecido em casa", "Está sempre no telemóvel"],
              ["Carimbos fáceis de falsificar", "Carimbos validados pela equipa, com limite por visita"],
              ["Não sabe quem são os seus clientes", "Base de clientes com consentimento RGPD"],
              ["Sem forma de comunicar", "Notificações na Wallet sobre recompensas e novidades"],
              ["Reimpressão a cada alteração", "Regras e visual alteráveis sem custos de impressão"],
            ],
          },
          { type: "h2", id: "para-quem", text: "Para quem é" },
          {
            type: "ul",
            items: [
              "**Cafés e pastelarias**: o clássico \"compre 9, o 10.º é oferta\".",
              "**Restaurantes**: recompensas por visitas, como uma sobremesa ao fim de 5 refeições.",
              "**Cabeleireiros e estética**: um tratamento oferecido ao fim de um número de serviços.",
              "**Lojas de bairro**: incentivar visitas regulares.",
            ],
          },
          { type: "h2", id: "proximos-passos", text: "Próximos passos" },
          {
            type: "ul",
            items: [
              "[Instalação](/docs/cartao-fidelidade-digital/instalacao): o que precisa de decidir e como preparamos tudo.",
              "[Configuração](/docs/cartao-fidelidade-digital/configuracao): regras de recompensa, antifraude e RGPD.",
              "[Utilização](/docs/cartao-fidelidade-digital/utilizacao): como a equipa carimba e entrega recompensas.",
            ],
          },
          {
            type: "p",
            text: "Quer ver um exemplo real? [Agende uma demonstração gratuita](/agendar).",
          },
        ],
      },
      en: {
        title: "Getting started with the digital loyalty card",
        description:
          "Meet the Steevanz digital loyalty card: stamps by NFC or QR, no app to install, saved in your customer's Apple Wallet or Google Wallet in seconds.",
        blocks: [
          {
            type: "p",
            text: "The digital loyalty card replaces paper cards that get lost in wallets. Customers join with a tap or by scanning a QR code, save the card on their phone and collect a stamp on every visit. When the card is full, they get their reward.",
          },
          {
            type: "p",
            text: "It's a managed service: Steevanz designs the card with your branding, sets the rules with you and trains your team. This documentation explains how it all works.",
          },
          { type: "h2", id: "how-it-works", text: "How it works" },
          {
            type: "ol",
            items: [
              "The customer taps the NFC plate or scans the QR code at the counter.",
              "They fill in a short form and give consent for their data to be processed.",
              "They add the card to Apple Wallet or Google Wallet, or open it as a web page.",
              "On each visit, your staff add a stamp.",
              "When the card is complete, the customer gets the reward and starts a new card.",
            ],
          },
          {
            type: "callout",
            tone: "info",
            title: "No app needed",
            text: "Customers don't install any app. Apple Wallet and Google Wallet are already on most phones, and anyone who prefers can use the card as a web page.",
          },
          { type: "h2", id: "benefits", text: "Benefits over a paper card" },
          {
            type: "table",
            head: ["Paper card", "Steevanz digital card"],
            rows: [
              ["Gets lost or left at home", "Always on the phone"],
              ["Stamps are easy to fake", "Stamps validated by staff, with a per-visit limit"],
              ["You don't know who your customers are", "Customer list with GDPR consent"],
              ["No way to reach customers", "Wallet notifications about rewards and news"],
              ["Reprinting for every change", "Rules and design can change with no printing costs"],
            ],
          },
          { type: "h2", id: "who-its-for", text: "Who it's for" },
          {
            type: "ul",
            items: [
              "**Cafés and bakeries**: the classic \"buy 9, get the 10th free\".",
              "**Restaurants**: visit-based rewards, such as a free dessert after 5 meals.",
              "**Hair and beauty salons**: a free treatment after a set number of services.",
              "**Local shops**: encouraging regular visits.",
            ],
          },
          { type: "h2", id: "next-steps", text: "Next steps" },
          {
            type: "ul",
            items: [
              "[Setup](/en/docs/digital-loyalty-card/setup): what you need to decide and how we prepare everything.",
              "[Configuration](/en/docs/digital-loyalty-card/configuration): reward rules, anti-fraud and GDPR.",
              "[Usage](/en/docs/digital-loyalty-card/usage): how staff add stamps and hand out rewards.",
            ],
          },
          {
            type: "p",
            text: "Want to see a real example? [Book a free demo](/en/book-a-demo).",
          },
        ],
      },
    },
    setup: {
      pt: {
        title: "Instalação do cartão de fidelidade digital",
        description:
          "Passo a passo para lançar o cartão de fidelidade digital: definir a recompensa, aprovar o design, instalar a placa NFC ao balcão e formar a equipa.",
        blocks: [
          {
            type: "p",
            text: "Lançar o cartão de fidelidade leva poucos dias. A maior parte do trabalho fica do nosso lado; do seu, precisamos de algumas decisões e de meia hora para a formação da equipa.",
          },
          { type: "h2", id: "decisoes-iniciais", text: "Decisões iniciais" },
          {
            type: "ul",
            items: [
              "**Recompensa**: o que oferece (um café, uma sobremesa, um desconto num serviço).",
              "**Número de carimbos**: quantas visitas ou compras são precisas.",
              "**Regra de carimbo**: um carimbo por visita, por compra, ou a partir de um valor mínimo.",
              "**Validade**: se os carimbos ou a recompensa expiram, e ao fim de quanto tempo.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Comece simples. Uma regra que o cliente percebe numa frase (\"9 cafés, o 10.º é oferta\") funciona melhor do que regras com exceções.",
          },
          { type: "h2", id: "passos-lancamento", text: "Passos de lançamento" },
          {
            type: "steps",
            items: [
              {
                title: "Enviar a informação do negócio",
                body: "Envie-nos o nome do negócio, as regras e a recompensa. Usamos esta informação para configurar o cartão e a página web.",
              },
              {
                title: "Aprovar as regras e o design",
                body: "Enviamos uma pré-visualização do cartão e um resumo das regras. Confirme ou peça ajustes.",
              },
              {
                title: "Rever os textos legais",
                body: "Preparamos o texto de consentimento e a informação de privacidade com base nos seus dados de empresa. Confirme o nome legal, o NIF e o contacto para questões de privacidade.",
              },
              {
                title: "Instalar a placa de adesão",
                body: "Coloque a placa NFC com QR junto à caixa, bem visível. Evite colocá-la por cima do terminal de pagamento ou sobre metal.",
              },
              {
                title: "Formar a equipa",
                body: "Numa chamada curta, mostramos à equipa como atribuir carimbos, entregar recompensas e responder às dúvidas mais comuns.",
              },
              {
                title: "Fazer um teste completo",
                body: "Adira com o seu próprio telemóvel, receba um carimbo e confirme que o cartão atualiza na Wallet.",
              },
            ],
          },
          { type: "h2", id: "material-balcao", text: "Material de balcão" },
          {
            type: "p",
            text: "A placa de adesão deve dizer claramente o que o cliente ganha, por exemplo \"Junte 9 carimbos e o 10.º café é oferta. Toque aqui.\". Se tiver várias caixas, recomendamos uma placa por caixa.",
          },
          { type: "h2", id: "migrar-papel", text: "Migrar do cartão de papel" },
          {
            type: "p",
            text: "Se já tem cartões de papel em circulação, pode aceitá-los durante um período de transição. A equipa pode atribuir no cartão digital os carimbos que o cliente já tinha no papel, recolhendo o cartão antigo. Defina uma data limite e comunique-a aos clientes.",
          },
          {
            type: "callout",
            tone: "info",
            text: "Tem dúvidas sobre a melhor recompensa para o seu negócio? Fale connosco pelo [contacto](/contacto); ajudamos a definir regras equilibradas.",
          },
        ],
      },
      en: {
        title: "Setting up the digital loyalty card",
        description:
          "Step-by-step guide to launching your digital loyalty card: choosing the reward, approving the design, placing the NFC plate and training your team.",
        blocks: [
          {
            type: "p",
            text: "Launching your loyalty card takes just a few days. Most of the work is on our side; on yours, we need a few decisions and half an hour to train your team.",
          },
          { type: "h2", id: "initial-decisions", text: "Initial decisions" },
          {
            type: "ul",
            items: [
              "**Reward**: what you offer (a coffee, a dessert, a discount on a service).",
              "**Number of stamps**: how many visits or purchases are needed.",
              "**Stamp rule**: one stamp per visit, per purchase, or above a minimum spend.",
              "**Expiry**: whether stamps or rewards expire, and after how long.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Keep it simple. A rule customers understand in one sentence (\"9 coffees, the 10th is free\") works better than rules with exceptions.",
          },
          { type: "h2", id: "launch-steps", text: "Launch steps" },
          {
            type: "steps",
            items: [
              {
                title: "Send your business details",
                body: "Send us your business name, the rules and the reward. We use them to set up the card and the web page.",
              },
              {
                title: "Approve the rules and design",
                body: "We send a preview of the card and a summary of the rules. Confirm or ask for tweaks.",
              },
              {
                title: "Review the legal text",
                body: "We prepare the consent text and privacy notice using your company details. Confirm your legal name, tax number and privacy contact.",
              },
              {
                title: "Place the sign-up plate",
                body: "Put the NFC plate with QR code by the till, clearly visible. Avoid placing it on top of the card terminal or on metal.",
              },
              {
                title: "Train your team",
                body: "On a short call, we show your staff how to add stamps, hand out rewards and answer common questions.",
              },
              {
                title: "Run a full test",
                body: "Join with your own phone, receive a stamp and check the card updates in your Wallet.",
              },
            ],
          },
          { type: "h2", id: "counter-materials", text: "Counter materials" },
          {
            type: "p",
            text: "The sign-up plate should say clearly what customers get, for example \"Collect 9 stamps and your 10th coffee is free. Tap here.\". If you have several tills, we recommend one plate per till.",
          },
          { type: "h2", id: "migrate-from-paper", text: "Moving from paper cards" },
          {
            type: "p",
            text: "If you already have paper cards in circulation, you can accept them for a transition period. Staff can add the stamps a customer already had on paper to their digital card and collect the old one. Set a cut-off date and let customers know.",
          },
          {
            type: "callout",
            tone: "info",
            text: "Not sure which reward suits your business? [Contact us](/en/contact) and we'll help you set balanced rules.",
          },
        ],
      },
    },
    configuration: {
      pt: {
        title: "Configuração: recompensas, antifraude e RGPD",
        description:
          "Como configurar as regras de recompensa, a proteção antifraude, as notificações na Wallet e o consentimento RGPD do cartão de fidelidade digital.",
        blocks: [
          {
            type: "p",
            text: "Todas as regras do programa são configuradas pela Steevanz de acordo com o que definir connosco. Esta página explica as opções disponíveis e as boas práticas.",
          },
          { type: "h2", id: "regras-recompensa", text: "Regras de recompensa" },
          {
            type: "table",
            head: ["Exemplo", "Regra"],
            rows: [
              ["Café", "9 carimbos, o 10.º café é oferta"],
              ["Restaurante", "5 refeições, sobremesa oferecida na 6.ª"],
              ["Cabeleireiro", "6 cortes, o 7.º com desconto"],
              ["Loja", "1 carimbo por compra acima de um valor mínimo"],
            ],
          },
          {
            type: "p",
            text: "Pode também definir a validade da recompensa (por exemplo, 60 dias após completar o cartão) e se os carimbos expiram por inatividade. Qualquer alteração às regras aplica-se aos cartões existentes a partir desse momento; avise os clientes com antecedência.",
          },
          { type: "h2", id: "antifraude", text: "Proteção antifraude" },
          {
            type: "ul",
            items: [
              "**Carimbos apenas pela equipa**: o cliente não consegue carimbar sozinho. O funcionário valida com o PIN de carimbo, escrito no telemóvel do cliente, ou no painel.",
              "**Janela temporal**: só é possível um carimbo por cliente dentro de um intervalo definido (por exemplo, um por visita a cada 2 horas).",
              "**Registo de atividade**: cada carimbo fica registado com data e hora, para poder verificar situações estranhas.",
              "**PIN que se muda**: se o PIN de carimbo for divulgado, muda-se em segundos nas Definições.",
            ],
          },
          {
            type: "callout",
            tone: "warning",
            title: "Proteja o PIN de carimbo",
            text: "Não deixe o PIN de carimbo visível para os clientes nem o escreva em papéis junto à caixa. Se suspeitar que foi divulgado, mude-o nas Definições.",
          },
          { type: "h2", id: "notificacoes-wallet", text: "Notificações na Wallet" },
          {
            type: "p",
            text: "Os cartões na Apple Wallet e na Google Wallet atualizam-se automaticamente. Quando o cartão muda, o telemóvel pode mostrar uma notificação, por exemplo \"Falta 1 carimbo para o seu café grátis\".",
          },
          {
            type: "ul",
            items: [
              "Use as notificações com moderação: uma mensagem útil vale mais do que várias promocionais.",
              "O cliente pode desativar as notificações de um cartão nas definições da Wallet.",
              "Mensagens de marketing só devem ser enviadas a quem deu esse consentimento.",
            ],
          },
          { type: "h2", id: "rgpd", text: "Dados dos clientes e RGPD" },
          {
            type: "p",
            text: "O programa recolhe apenas os dados necessários (tipicamente nome e email ou telemóvel). O seu negócio é o responsável pelo tratamento e a Steevanz atua como subcontratante.",
          },
          {
            type: "ul",
            items: [
              "O consentimento para o programa e o consentimento para marketing são pedidos em separado.",
              "O cliente pode pedir acesso, correção ou eliminação dos dados; contacte-nos e tratamos do pedido.",
              "Os dados não são vendidos nem partilhados com terceiros para fins comerciais.",
              "Mantenha a informação de privacidade acessível a partir do cartão.",
            ],
          },
          {
            type: "callout",
            tone: "info",
            text: "A Steevanz não é a Apple nem a Google e não tem qualquer afiliação com estas empresas. Os cartões usam as funcionalidades públicas da Apple Wallet e da Google Wallet.",
          },
        ],
      },
      en: {
        title: "Configuration: rewards, anti-fraud and GDPR",
        description:
          "How to configure reward rules, anti-fraud protection, Wallet notifications and GDPR consent for your Steevanz digital loyalty card programme.",
        blocks: [
          {
            type: "p",
            text: "All programme rules are configured by Steevanz based on what you agree with us. This page explains the options available and good practice.",
          },
          { type: "h2", id: "reward-rules", text: "Reward rules" },
          {
            type: "table",
            head: ["Example", "Rule"],
            rows: [
              ["Café", "9 stamps, the 10th coffee is free"],
              ["Restaurant", "5 meals, free dessert on the 6th"],
              ["Hair salon", "6 cuts, discount on the 7th"],
              ["Shop", "1 stamp per purchase above a minimum spend"],
            ],
          },
          {
            type: "p",
            text: "You can also set how long a reward stays valid (for example, 60 days after completing the card) and whether stamps expire after inactivity. Any rule change applies to existing cards from that point on; let customers know in advance.",
          },
          { type: "h2", id: "anti-fraud", text: "Anti-fraud protection" },
          {
            type: "ul",
            items: [
              "**Staff-only stamps**: customers can't stamp their own card. Staff validate with a code or a tap on the shop's device.",
              "**Time window**: only one stamp per customer within a set interval (for example, one per visit every 2 hours).",
              "**Activity log**: every stamp is recorded with date and time, so you can check anything odd.",
              "**Individual codes**: if a staff code is shared inappropriately, we change it.",
            ],
          },
          {
            type: "callout",
            tone: "warning",
            title: "Protect your staff code",
            text: "Don't leave the stamp code where customers can see it or write it on notes by the till. If you think it's been leaked, ask us for a new one.",
          },
          { type: "h2", id: "wallet-notifications", text: "Wallet notifications" },
          {
            type: "p",
            text: "Cards in Apple Wallet and Google Wallet update automatically. When a card changes, the phone can show a notification, such as \"1 stamp to go until your free coffee\".",
          },
          {
            type: "ul",
            items: [
              "Use notifications sparingly: one useful message beats several promotional ones.",
              "Customers can turn off notifications for a card in their Wallet settings.",
              "Marketing messages should only go to people who have consented to them.",
            ],
          },
          { type: "h2", id: "gdpr", text: "Customer data and GDPR" },
          {
            type: "p",
            text: "The programme collects only the data it needs (typically a name and an email or mobile number). Your business is the data controller and Steevanz acts as the processor.",
          },
          {
            type: "ul",
            items: [
              "Consent to join the programme and consent to marketing are requested separately.",
              "Customers can ask to access, correct or delete their data; contact us and we'll handle the request.",
              "Data is never sold or shared with third parties for commercial purposes.",
              "Keep the privacy notice accessible from the card.",
            ],
          },
          {
            type: "callout",
            tone: "info",
            text: "Steevanz is not Apple or Google and has no affiliation with either company. The cards use the public features of Apple Wallet and Google Wallet.",
          },
        ],
      },
    },
    usage: {
      pt: {
        title: "Utilização: carimbos e recompensas no dia a dia",
        description:
          "Como a equipa convida clientes, atribui carimbos, entrega recompensas e acompanha as estatísticas do cartão de fidelidade digital no dia a dia.",
        blocks: [
          {
            type: "p",
            text: "O sucesso de um programa de fidelidade depende sobretudo da equipa: convidar os clientes, carimbar sempre e entregar as recompensas sem complicações.",
          },
          { type: "h2", id: "convidar-clientes", text: "Convidar os clientes" },
          {
            type: "p",
            text: "Nas primeiras semanas, convide todos os clientes ao pagar. Uma frase simples chega:",
          },
          {
            type: "ul",
            items: [
              "\"Já tem o nosso cartão de fidelidade? É só encostar o telemóvel aqui e ganha já o primeiro carimbo.\"",
              "\"Fica guardado na Wallet do telemóvel, não precisa de aplicação.\"",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Dar o primeiro carimbo logo na adesão motiva o cliente e mostra-lhe como o processo funciona.",
          },
          { type: "h2", id: "atribuir-carimbo", text: "Atribuir um carimbo" },
          {
            type: "steps",
            items: [
              {
                title: "Pedir o cartão",
                body: "O cliente abre o cartão na Wallet ou na página web e mostra-o à equipa.",
              },
              {
                title: "Validar",
                body: "O funcionário valida o carimbo com o PIN de carimbo no telemóvel do cliente, ou procurando o cliente no painel.",
              },
              {
                title: "Confirmar",
                body: "O cartão atualiza em poucos segundos e mostra o novo número de carimbos.",
              },
            ],
          },
          {
            type: "p",
            text: "Se o sistema recusar o carimbo, é normalmente porque o cliente já recebeu um dentro da janela temporal definida. Explique a regra com simpatia.",
          },
          { type: "h2", id: "entregar-recompensa", text: "Entregar a recompensa" },
          {
            type: "ol",
            items: [
              "Quando o cartão está completo, o cliente vê a indicação de recompensa disponível.",
              "A equipa confirma a recompensa da mesma forma que valida um carimbo.",
              "A recompensa é marcada como usada e o cartão recomeça do zero.",
            ],
          },
          {
            type: "callout",
            tone: "warning",
            text: "Marque sempre a recompensa como usada no momento em que a entrega. Se não o fizer, o cliente pode voltar a usá-la.",
          },
          { type: "h2", id: "estatisticas", text: "Estatísticas" },
          {
            type: "p",
            text: "Na sua área de cliente, ou num resumo periódico enviado pela Steevanz, pode acompanhar:",
          },
          {
            type: "ul",
            items: [
              "Número de clientes inscritos e novas adesões por período.",
              "Carimbos atribuídos e recompensas entregues.",
              "Clientes que não voltam há algum tempo.",
              "Evolução ao longo dos meses.",
            ],
          },
          { type: "h2", id: "boas-praticas", text: "Boas práticas" },
          {
            type: "ul",
            items: [
              "Carimbe em todas as visitas elegíveis, mesmo nas horas de maior movimento.",
              "Relembre a recompensa quando falta pouco para completar o cartão.",
              "Reveja as regras ao fim de alguns meses com base nas estatísticas.",
              "Combine com [placas NFC Google Reviews](/produtos/placas-nfc-google-reviews) para pedir avaliações aos clientes fiéis, sem ligar a avaliação à recompensa.",
            ],
          },
        ],
      },
      en: {
        title: "Usage: stamps and rewards day to day",
        description:
          "How your team invites customers, adds stamps, hands out rewards and follows the statistics of your digital loyalty card programme day to day.",
        blocks: [
          {
            type: "p",
            text: "A loyalty programme succeeds mostly thanks to your team: inviting customers, stamping every time and handing out rewards without fuss.",
          },
          { type: "h2", id: "invite-customers", text: "Inviting customers" },
          {
            type: "p",
            text: "For the first few weeks, invite every customer at the till. One simple line is enough:",
          },
          {
            type: "ul",
            items: [
              "\"Have you got our loyalty card? Just tap your phone here and you'll get your first stamp now.\"",
              "\"It saves to your phone's Wallet, no app needed.\"",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Giving the first stamp at sign-up motivates customers and shows them how it works.",
          },
          { type: "h2", id: "add-stamp", text: "Adding a stamp" },
          {
            type: "steps",
            items: [
              {
                title: "Ask for the card",
                body: "The customer opens the card in their Wallet or on the web page and shows it to staff.",
              },
              {
                title: "Validate",
                body: "Staff validate the stamp with the shop code or a tap on the shop's device, depending on your setup.",
              },
              {
                title: "Confirm",
                body: "The card updates within a few seconds and shows the new stamp count.",
              },
            ],
          },
          {
            type: "p",
            text: "If the system refuses a stamp, it's usually because the customer already received one within the set time window. Explain the rule politely.",
          },
          { type: "h2", id: "redeem-reward", text: "Handing out the reward" },
          {
            type: "ol",
            items: [
              "When the card is full, the customer sees that a reward is available.",
              "Staff confirm the reward the same way they validate a stamp.",
              "The reward is marked as used and the card starts again from zero.",
            ],
          },
          {
            type: "callout",
            tone: "warning",
            text: "Always mark the reward as used when you hand it over. Otherwise the customer could use it again.",
          },
          { type: "h2", id: "statistics", text: "Statistics" },
          {
            type: "p",
            text: "In your client area, or in a regular summary sent by Steevanz, you can follow:",
          },
          {
            type: "ul",
            items: [
              "Number of members and new sign-ups per period.",
              "Stamps given and rewards redeemed.",
              "Customers who haven't been back for a while.",
              "Trends over the months.",
            ],
          },
          { type: "h2", id: "good-practice", text: "Good practice" },
          {
            type: "ul",
            items: [
              "Stamp every eligible visit, even at the busiest times.",
              "Mention the reward when a customer is close to completing the card.",
              "Review the rules after a few months based on the statistics.",
              "Pair it with [NFC Google review plates](/en/products/nfc-google-review-plates) to ask loyal customers for reviews, without linking the review to the reward.",
            ],
          },
        ],
      },
    },
    troubleshooting: {
      pt: {
        title: "Resolução de problemas do cartão de fidelidade",
        description:
          "Soluções para cartões que não aparecem na Wallet, carimbos recusados, telemóveis trocados, cartões que não atualizam e placas NFC que não respondem.",
        blocks: [
          {
            type: "p",
            text: "Estas são as situações mais comuns e como resolvê-las. Se o problema continuar, fale connosco pelo [contacto](/contacto) ou por WhatsApp.",
          },
          { type: "h2", id: "nao-adiciona-wallet", text: "O cartão não é adicionado à Wallet" },
          {
            type: "ul",
            items: [
              "**iPhone**: confirme que abriu a página no Safari. Navegadores internos de outras aplicações podem bloquear o botão \"Adicionar à Apple Wallet\".",
              "**Android**: a Google Wallet tem de estar instalada e configurada. Se não estiver, o cliente pode usar o cartão como página web.",
              "Em qualquer caso, a versão web funciona sempre: basta guardar a página nos favoritos ou no ecrã principal.",
            ],
          },
          { type: "h2", id: "carimbo-recusado", text: "O carimbo foi recusado" },
          {
            type: "ol",
            items: [
              "Verifique se o cliente já recebeu um carimbo dentro da janela temporal (por exemplo, nas últimas 2 horas).",
              "Confirme que a equipa está a usar o PIN de carimbo atual.",
              "Verifique a ligação à internet do dispositivo da loja.",
              "Se o problema persistir, anote a hora e contacte-nos: consultamos o registo de atividade.",
            ],
          },
          { type: "h2", id: "cartao-nao-atualiza", text: "O cartão não atualiza" },
          {
            type: "p",
            text: "As atualizações chegam à Wallet através da internet. Se o telemóvel do cliente estiver sem rede ou em modo de poupança de energia, a atualização pode demorar. Na Apple Wallet, puxar o cartão para baixo nos detalhes força uma atualização. Os carimbos ficam sempre registados do nosso lado, mesmo que o cartão demore a mostrar.",
          },
          { type: "h2", id: "trocou-telemovel", text: "O cliente trocou de telemóvel" },
          {
            type: "p",
            text: "Os carimbos estão associados ao registo do cliente e não ao telemóvel. O cliente pode voltar a adicionar o cartão no telemóvel novo usando o mesmo email ou número com que se inscreveu. Se tiver dificuldades, contacte-nos e recuperamos o cartão.",
          },
          { type: "h2", id: "placa-nao-responde", text: "A placa de adesão não responde" },
          {
            type: "ul",
            items: [
              "O ecrã do telemóvel tem de estar desbloqueado; em Android, o NFC tem de estar ativo.",
              "iPhone 7, 8 e X usam o \"Leitor de etiquetas NFC\" na Central de Controlo; do XS em diante, a leitura é automática.",
              "Afaste a placa do terminal de pagamento e de superfícies metálicas.",
              "Use sempre o QR como alternativa.",
            ],
          },
          {
            type: "callout",
            tone: "info",
            text: "Pedidos de eliminação de dados de clientes são tratados pela Steevanz. Reencaminhe-nos o pedido e confirmamos quando estiver concluído.",
          },
        ],
      },
      en: {
        title: "Troubleshooting the digital loyalty card",
        description:
          "Fixes for cards that won't add to Wallet, refused stamps, customers with new phones, cards that don't update and NFC sign-up plates that won't respond.",
        blocks: [
          {
            type: "p",
            text: "These are the most common situations and how to fix them. If the problem persists, [contact us](/en/contact) or message us on WhatsApp.",
          },
          { type: "h2", id: "wont-add-to-wallet", text: "The card won't add to Wallet" },
          {
            type: "ul",
            items: [
              "**iPhone**: check the page was opened in Safari. Other apps' built-in browsers can block the \"Add to Apple Wallet\" button.",
              "**Android**: Google Wallet must be installed and set up. If it isn't, the customer can use the card as a web page.",
              "Either way, the web version always works: just bookmark the page or add it to the home screen.",
            ],
          },
          { type: "h2", id: "stamp-refused", text: "A stamp was refused" },
          {
            type: "ol",
            items: [
              "Check whether the customer already received a stamp within the time window (for example, in the last 2 hours).",
              "Make sure staff are using the current shop code.",
              "Check the shop device's internet connection.",
              "If it keeps happening, note the time and contact us: we'll check the activity log.",
            ],
          },
          { type: "h2", id: "card-not-updating", text: "The card isn't updating" },
          {
            type: "p",
            text: "Updates reach the Wallet over the internet. If the customer's phone has no signal or is in low-power mode, the update may take a while. In Apple Wallet, pulling down on the card's details screen forces a refresh. Stamps are always recorded on our side, even if the card takes a moment to show them.",
          },
          { type: "h2", id: "new-phone", text: "The customer has a new phone" },
          {
            type: "p",
            text: "Stamps are tied to the customer's record, not to the phone. They can add the card again on the new phone using the same email or number they signed up with. If they have trouble, contact us and we'll recover the card.",
          },
          { type: "h2", id: "plate-not-responding", text: "The sign-up plate won't respond" },
          {
            type: "ul",
            items: [
              "The phone screen must be unlocked; on Android, NFC must be turned on.",
              "iPhone 7, 8 and X use \"NFC Tag Reader\" in Control Centre; from XS onwards, reading is automatic.",
              "Move the plate away from the card terminal and metal surfaces.",
              "The QR code is always there as a fallback.",
            ],
          },
          {
            type: "callout",
            tone: "info",
            text: "Customer data deletion requests are handled by Steevanz. Forward the request to us and we'll confirm once it's done.",
          },
        ],
      },
    },
    faq: {
      pt: {
        title: "Perguntas frequentes: cartão de fidelidade digital",
        description:
          "Respostas às dúvidas mais comuns sobre o cartão de fidelidade digital: aplicação, Wallet, carimbos, fraude, RGPD, notificações e alteração de regras.",
        blocks: [
          { type: "h2", id: "perguntas", text: "Perguntas frequentes" },
          {
            type: "faq",
            items: [
              {
                q: "O cliente precisa de instalar uma aplicação?",
                a: "Não. O cartão é guardado na Apple Wallet ou na Google Wallet, ou usado como página web.",
              },
              {
                q: "E se o cliente não quiser usar a Wallet?",
                a: "Pode usar a versão web do cartão, que funciona em qualquer telemóvel com navegador.",
              },
              {
                q: "O cliente pode carimbar o próprio cartão?",
                a: "Não. Os carimbos são validados pelo funcionário, com o PIN de carimbo ou no painel, e há um limite por visita.",
              },
              {
                q: "Posso mudar a recompensa depois do lançamento?",
                a: "Sim. Diga-nos o que quer alterar e atualizamos as regras. Recomendamos avisar os clientes com antecedência.",
              },
              {
                q: "Os carimbos perdem-se se o cliente trocar de telemóvel?",
                a: "Não. Estão associados ao registo do cliente e o cartão pode ser adicionado de novo no telemóvel novo.",
              },
              {
                q: "Quem é o responsável pelos dados dos clientes?",
                a: "O seu negócio é o responsável pelo tratamento e a Steevanz é subcontratante. Veja a página de [configuração](/docs/cartao-fidelidade-digital/configuracao) para mais detalhes sobre o RGPD.",
              },
              {
                q: "Posso enviar promoções aos clientes?",
                a: "Sim, através das notificações do cartão, mas apenas a quem deu consentimento para comunicações de marketing.",
              },
              {
                q: "Funciona com várias lojas?",
                a: "Sim. O preço é por loja e pode decidir se os carimbos são partilhados entre lojas ou separados.",
              },
              {
                q: "A Steevanz é parceira da Apple ou da Google?",
                a: "Não. A Steevanz é independente e usa as funcionalidades públicas da Apple Wallet e da Google Wallet.",
              },
              {
                q: "Quanto tempo demora a lançar?",
                a: "Normalmente poucos dias depois de recebermos o nome do negócio e a aprovação das regras.",
              },
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Quer ver como funciona? [Agende uma demonstração](/agendar) ou veja o [cartão de fidelidade digital](/produtos/cartao-fidelidade-digital).",
          },
        ],
      },
      en: {
        title: "Digital loyalty card FAQ",
        description:
          "Answers to common questions about the digital loyalty card: apps, Wallet, stamps, fraud prevention, GDPR, notifications and changing your rules.",
        blocks: [
          { type: "h2", id: "questions", text: "Frequently asked questions" },
          {
            type: "faq",
            items: [
              {
                q: "Do customers need to install an app?",
                a: "No. The card is saved in Apple Wallet or Google Wallet, or used as a web page.",
              },
              {
                q: "What if a customer doesn't want to use Wallet?",
                a: "They can use the web version of the card, which works on any phone with a browser.",
              },
              {
                q: "Can customers stamp their own card?",
                a: "No. Stamps are validated by staff, with a code or a tap on the shop's device, and there's a per-visit limit.",
              },
              {
                q: "Can I change the reward after launch?",
                a: "Yes. Tell us what you'd like to change and we'll update the rules. We recommend letting customers know in advance.",
              },
              {
                q: "Are stamps lost if a customer changes phone?",
                a: "No. They're tied to the customer's record and the card can be added again on the new phone.",
              },
              {
                q: "Who is responsible for customer data?",
                a: "Your business is the data controller and Steevanz is the processor. See the [configuration](/en/docs/digital-loyalty-card/configuration) page for more on GDPR.",
              },
              {
                q: "Can I send promotions to customers?",
                a: "Yes, through card notifications, but only to people who have consented to marketing messages.",
              },
              {
                q: "Does it work across several locations?",
                a: "Yes. Pricing is per location and you can decide whether stamps are shared across locations or kept separate.",
              },
              {
                q: "Is Steevanz an Apple or Google partner?",
                a: "No. Steevanz is independent and uses the public features of Apple Wallet and Google Wallet.",
              },
              {
                q: "How long does it take to launch?",
                a: "Usually a few days after we receive your business name and approval of the rules.",
              },
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Want to see how it works? [Book a demo](/en/book-a-demo) or see the [digital loyalty card](/en/products/digital-loyalty-card).",
          },
        ],
      },
    },
  },
};

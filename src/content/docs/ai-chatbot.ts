import type { ProductDocs } from "../types";

export const docs: ProductDocs = {
  productId: "ai-chatbot",
  pages: {
    "getting-started": {
      pt: {
        title: "Primeiros passos com o chatbot com IA",
        description:
          "O que é o chatbot com IA da Steevanz, onde funciona (site e WhatsApp), o que sabe responder, os seus limites e o que precisa de preparar para começar.",
        blocks: [
          {
            type: "p",
            text: "O chatbot com IA responde às perguntas dos seus clientes no **site** e no **WhatsApp**, a qualquer hora, com base na informação do seu negócio: menu, preços, horários, serviços e políticas. Quando a conversa pede uma marcação ou uma pessoa, encaminha para o link de reserva ou para a sua equipa.",
          },
          { type: "h2", id: "o-que-faz", text: "O que o chatbot faz" },
          {
            type: "ul",
            items: [
              "Responde a perguntas frequentes: horários, morada, estacionamento, preços, serviços, alergénios, formas de pagamento.",
              "Encaminha para o seu [sistema de reservas](/produtos/sistema-reservas-online) quando o cliente quer marcar.",
              "Passa a conversa para uma pessoa da equipa quando o pedido sai do âmbito definido.",
              "Responde na língua do cliente, útil para zonas turísticas.",
              "Guarda o histórico das conversas para consultar e melhorar as respostas.",
            ],
          },
          { type: "h2", id: "limites", text: "O que o chatbot não faz" },
          {
            type: "p",
            text: "O chatbot só responde com base na informação que lhe foi dada. Quando não sabe, diz que não sabe e oferece o contacto da equipa, em vez de inventar. Ainda assim, como qualquer sistema de IA, **pode cometer erros**, por isso recomendamos rever as conversas regularmente, sobretudo nas primeiras semanas.",
          },
          {
            type: "callout",
            tone: "warning",
            title: "Clínicas e saúde",
            text: "Em clínicas, o chatbot está configurado para não dar aconselhamento médico, diagnósticos ou indicações de medicação. Pode explicar serviços, preços e marcações, e encaminha qualquer questão clínica para a equipa.",
          },
          { type: "h2", id: "canais", text: "Site e WhatsApp" },
          {
            type: "table",
            head: ["Canal", "Como o cliente fala com o chatbot", "O que é preciso"],
            rows: [
              ["Site", "Uma janela de conversa no canto do ecrã", "Colar um pequeno código no site, uma única vez"],
              ["WhatsApp", "Envia mensagem para o número do negócio", "Um número ligado à WhatsApp Business Platform e verificação da empresa junto da Meta"],
            ],
          },
          { type: "h2", id: "o-que-preparar", text: "O que preparar" },
          {
            type: "ul",
            items: [
              "Menu ou lista de serviços com preços atualizados.",
              "Horários, incluindo feriados e épocas especiais.",
              "Políticas: cancelamentos, grupos, animais, pagamentos, reembolsos.",
              "As perguntas que a sua equipa mais recebe e as respostas que costuma dar.",
              "O que deve ser sempre passado para uma pessoa (reclamações, pedidos especiais, eventos).",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Continue para a [instalação](/docs/chatbot-ia/instalacao) ou [agende uma demonstração](/agendar) para ver o chatbot a responder com dados de um negócio como o seu.",
          },
        ],
      },
      en: {
        title: "Getting started with the AI chatbot",
        description:
          "What the Steevanz AI chatbot is, where it works (website and WhatsApp), what it can answer, its limits and what you need to prepare to get started.",
        blocks: [
          {
            type: "p",
            text: "The AI chatbot answers your customers' questions on your **website** and on **WhatsApp**, at any time, based on your business's information: menu, prices, opening hours, services and policies. When a conversation calls for a booking or a person, it hands over to your booking link or your team.",
          },
          { type: "h2", id: "what-it-does", text: "What the chatbot does" },
          {
            type: "ul",
            items: [
              "Answers common questions: opening hours, address, parking, prices, services, allergens, payment methods.",
              "Directs customers to your [booking system](/en/products/online-booking-system) when they want to book.",
              "Hands the conversation to a team member when a request falls outside its defined scope.",
              "Replies in the customer's language, which helps in tourist areas.",
              "Keeps a conversation history so you can review it and improve answers.",
            ],
          },
          { type: "h2", id: "limits", text: "What the chatbot does not do" },
          {
            type: "p",
            text: "The chatbot only answers based on the information it has been given. When it does not know, it says so and offers your team's contact details instead of making something up. Even so, like any AI system, **it can make mistakes**, so we recommend reviewing conversations regularly, especially in the first few weeks.",
          },
          {
            type: "callout",
            tone: "warning",
            title: "Clinics and healthcare",
            text: "For clinics, the chatbot is configured not to give medical advice, diagnoses or medication guidance. It can explain services, prices and bookings, and passes any clinical question to your team.",
          },
          { type: "h2", id: "channels", text: "Website and WhatsApp" },
          {
            type: "table",
            head: ["Channel", "How customers talk to the chatbot", "What is needed"],
            rows: [
              ["Website", "A chat window in the corner of the screen", "Pasting a short snippet into your site, once"],
              ["WhatsApp", "They message your business number", "A number connected to the WhatsApp Business Platform and business verification with Meta"],
            ],
          },
          { type: "h2", id: "what-to-prepare", text: "What to prepare" },
          {
            type: "ul",
            items: [
              "Your menu or service list with up-to-date prices.",
              "Opening hours, including bank holidays and seasonal changes.",
              "Policies: cancellations, groups, pets, payments, refunds.",
              "The questions your team gets asked most and the answers they usually give.",
              "What should always go to a person (complaints, special requests, events).",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Continue to [setup](/en/docs/ai-chatbot/setup) or [book a demo](/en/book-a-demo) to see the chatbot answering with data from a business like yours.",
          },
        ],
      },
    },
    setup: {
      pt: {
        title: "Instalação do chatbot com IA no site e no WhatsApp",
        description:
          "Passo a passo para instalar o chatbot com IA: base de conhecimento, widget no site, ligação ao WhatsApp Business Platform e verificação da empresa.",
        blocks: [
          {
            type: "p",
            text: "A Steevanz trata da instalação. A parte que depende de si é sobretudo reunir a informação do negócio e, para o WhatsApp, dar alguns acessos e aprovações.",
          },
          { type: "h2", id: "passos", text: "Passos de instalação" },
          {
            type: "steps",
            items: [
              {
                title: "Recolha da informação",
                body: "Recebemos o menu, serviços, preços, horários e políticas, em documentos, fotografias ou links para o seu site.",
              },
              {
                title: "Criação da base de conhecimento",
                body: "Organizamos essa informação num formato que o chatbot consegue consultar e definimos o tom de voz e os temas proibidos.",
              },
              {
                title: "Regras de encaminhamento",
                body: "Definimos quando o chatbot envia o link de reserva, quando passa a conversa a uma pessoa e para que contacto.",
              },
              {
                title: "Testes internos",
                body: "Fazemos dezenas de perguntas reais e difíceis e corrigimos as respostas antes de qualquer cliente falar com o chatbot.",
              },
              {
                title: "Instalação no site",
                body: "Colamos o código do widget no seu site ou enviamos-lho para passar a quem o gere.",
              },
              {
                title: "Ligação ao WhatsApp",
                body: "Ligamos o número à WhatsApp Business Platform e acompanhamos a verificação da empresa.",
              },
              {
                title: "Revisão das primeiras conversas",
                body: "Nas primeiras semanas revemos consigo o histórico e ajustamos a base de conhecimento.",
              },
            ],
          },
          { type: "h2", id: "widget-no-site", text: "Widget no site" },
          {
            type: "p",
            text: "O widget é um pequeno script que se coloca antes do fecho da tag `body`, em todas as páginas. Funciona com a maioria dos construtores de sites e plataformas de gestão de conteúdos.",
          },
          {
            type: "code",
            label: "Código do widget (exemplo)",
            code: "<script\n  src=\"https://chat.steevanz.com/widget.js\"\n  data-business=\"o-seu-negocio\"\n  data-lang=\"auto\"\n  defer\n></script>",
          },
          {
            type: "callout",
            tone: "info",
            text: "O identificador do negócio acima é ilustrativo. Enviamos-lhe o código final já preenchido.",
          },
          { type: "h2", id: "whatsapp", text: "Ligação ao WhatsApp" },
          {
            type: "p",
            text: "Para que o chatbot responda no WhatsApp, o número tem de estar ligado à **WhatsApp Business Platform**, a solução da Meta para empresas que usam integrações. Isto é diferente da aplicação WhatsApp Business normal.",
          },
          {
            type: "ul",
            items: [
              "Precisa de uma conta de empresa na Meta e de concluir a **verificação da empresa**, com documentos como a certidão permanente ou uma fatura em nome do negócio.",
              "O número pode ser novo ou o atual. Se já usa esse número numa aplicação WhatsApp, analisamos consigo a melhor forma de o migrar ou de o manter a funcionar em paralelo.",
              "O nome apresentado aos clientes está sujeito a aprovação pela Meta.",
            ],
          },
          {
            type: "callout",
            tone: "warning",
            text: "Os prazos de verificação e aprovação dependem da Meta, não da Steevanz. Recomendamos começar este passo cedo; entretanto, o chatbot pode já estar ativo no site.",
          },
          { type: "h2", id: "seguinte", text: "A seguir" },
          {
            type: "p",
            text: "Veja em [configuração](/docs/chatbot-ia/configuracao) como definir o tom, os encaminhamentos e as regras de segurança do chatbot.",
          },
        ],
      },
      en: {
        title: "Setting up the AI chatbot on your website and WhatsApp",
        description:
          "Step-by-step guide to setting up the AI chatbot: knowledge base, website widget, WhatsApp Business Platform connection and business verification.",
        blocks: [
          {
            type: "p",
            text: "Steevanz handles the setup. What depends on you is mainly gathering your business information and, for WhatsApp, granting some access and approvals.",
          },
          { type: "h2", id: "steps", text: "Setup steps" },
          {
            type: "steps",
            items: [
              {
                title: "Gathering information",
                body: "We receive your menu, services, prices, opening hours and policies, as documents, photos or links to your website.",
              },
              {
                title: "Building the knowledge base",
                body: "We organise that information in a format the chatbot can consult and define the tone of voice and off-limits topics.",
              },
              {
                title: "Hand-over rules",
                body: "We define when the chatbot sends the booking link, when it passes the conversation to a person and to which contact.",
              },
              {
                title: "Internal testing",
                body: "We ask dozens of real and tricky questions and correct the answers before any customer talks to the chatbot.",
              },
              {
                title: "Website installation",
                body: "We paste the widget snippet into your website or send it to you to pass on to whoever manages it.",
              },
              {
                title: "WhatsApp connection",
                body: "We connect your number to the WhatsApp Business Platform and guide you through business verification.",
              },
              {
                title: "Reviewing early conversations",
                body: "In the first few weeks we review the history with you and adjust the knowledge base.",
              },
            ],
          },
          { type: "h2", id: "website-widget", text: "Website widget" },
          {
            type: "p",
            text: "The widget is a small script placed just before the closing `body` tag on every page. It works with most website builders and content management systems.",
          },
          {
            type: "code",
            label: "Widget snippet (example)",
            code: "<script\n  src=\"https://chat.steevanz.com/widget.js\"\n  data-business=\"your-business\"\n  data-lang=\"auto\"\n  defer\n></script>",
          },
          {
            type: "callout",
            tone: "info",
            text: "The business identifier above is an example. We send you the final snippet already filled in.",
          },
          { type: "h2", id: "whatsapp", text: "Connecting WhatsApp" },
          {
            type: "p",
            text: "For the chatbot to reply on WhatsApp, your number must be connected to the **WhatsApp Business Platform**, Meta's solution for businesses using integrations. This is different from the standard WhatsApp Business app.",
          },
          {
            type: "ul",
            items: [
              "You need a Meta business account and must complete **business verification**, with documents such as your company registration certificate or a utility bill in the business's name.",
              "The number can be new or your existing one. If you already use it in a WhatsApp app, we will work out with you the best way to migrate it or keep it running alongside.",
              "The display name shown to customers is subject to approval by Meta.",
            ],
          },
          {
            type: "callout",
            tone: "warning",
            text: "Verification and approval times depend on Meta, not Steevanz. We recommend starting this step early; in the meantime, the chatbot can already be live on your website.",
          },
          { type: "h2", id: "next", text: "Next" },
          {
            type: "p",
            text: "See [configuration](/en/docs/ai-chatbot/configuration) to set the chatbot's tone, hand-overs and safety rules.",
          },
        ],
      },
    },
    configuration: {
      pt: {
        title: "Configuração do chatbot com IA",
        description:
          "Como configurar o chatbot com IA: base de conhecimento, tom de voz, idiomas, encaminhamento para reservas e para a equipa, limites de segurança e RGPD.",
        blocks: [
          {
            type: "p",
            text: "A qualidade das respostas depende sobretudo da qualidade da informação e das regras definidas. Estas são as definições principais, que ajustamos consigo sempre que precisar.",
          },
          { type: "h2", id: "base-de-conhecimento", text: "Base de conhecimento" },
          {
            type: "p",
            text: "É o conjunto de informação que o chatbot pode usar para responder. Deve ser específica, atual e sem contradições.",
          },
          {
            type: "table",
            head: ["Tema", "Exemplos do que incluir"],
            rows: [
              ["Menu ou serviços", "Pratos, ingredientes e alergénios; serviços, duração e preços"],
              ["Horários", "Horário normal, feriados, férias, cozinha aberta até"],
              ["Localização", "Morada, estacionamento, transportes, acessibilidade"],
              ["Políticas", "Cancelamentos, sinais, grupos, animais, crianças, pagamentos"],
              ["Contactos", "Telefone, email, quando e como falar com uma pessoa"],
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Quando uma informação muda, retire a versão antiga. Duas versões do mesmo preço ou horário são a causa mais comum de respostas erradas.",
          },
          { type: "h2", id: "tom-e-idiomas", text: "Tom de voz e idiomas" },
          {
            type: "ul",
            items: [
              "**Tom**: mais formal (tratamento por «o senhor» ou «a senhora») ou mais próximo, conforme a sua marca.",
              "**Idiomas**: o chatbot responde por defeito na língua em que o cliente escreve. Pode limitar a um conjunto de línguas.",
              "**Respostas curtas**: em WhatsApp e no telemóvel, respostas breves com um link funcionam melhor do que parágrafos longos.",
            ],
          },
          { type: "h2", id: "encaminhamento", text: "Encaminhamento para reservas e para pessoas" },
          {
            type: "ul",
            items: [
              "**Reserva**: quando o cliente quer marcar, o chatbot envia o seu link de reserva, se possível já filtrado pelo serviço certo.",
              "**Pessoa**: reclamações, pedidos especiais, eventos, orçamentos ou qualquer tema fora do âmbito são passados à equipa, com o resumo da conversa.",
              "**Fora de horas**: o chatbot informa quando a equipa poderá responder.",
            ],
          },
          { type: "h2", id: "limites-de-seguranca", text: "Limites de segurança" },
          {
            type: "ul",
            items: [
              "Não inventa: quando a resposta não está na base de conhecimento, diz que não sabe e oferece contacto humano.",
              "Não dá aconselhamento médico, jurídico ou financeiro.",
              "Não promete descontos, reembolsos ou exceções que não estejam nas políticas.",
              "Não pede dados sensíveis, como dados de saúde ou números de cartão.",
            ],
          },
          { type: "h2", id: "whatsapp-regras", text: "Regras do WhatsApp" },
          {
            type: "p",
            text: "No WhatsApp Business Platform, o negócio pode responder livremente durante **24 horas** após a última mensagem do cliente. Fora dessa janela, só pode iniciar conversa com **mensagens modelo** previamente aprovadas pela Meta, por exemplo um lembrete ou uma confirmação. Criamos e submetemos esses modelos por si.",
          },
          { type: "h2", id: "rgpd", text: "Privacidade e RGPD" },
          {
            type: "p",
            text: "O widget e o WhatsApp mostram uma nota de privacidade no início da conversa. Os registos das conversas são guardados apenas durante o prazo acordado e usados para prestar o serviço e melhorar as respostas do seu negócio. O seu negócio é o responsável pelo tratamento e a Steevanz atua como subcontratante.",
          },
        ],
      },
      en: {
        title: "Configuring the AI chatbot",
        description:
          "How to configure the AI chatbot: knowledge base, tone of voice, languages, hand-over to bookings and staff, safety guardrails and GDPR considerations.",
        blocks: [
          {
            type: "p",
            text: "Answer quality depends mainly on the quality of the information and rules you provide. These are the main settings, which we adjust with you whenever needed.",
          },
          { type: "h2", id: "knowledge-base", text: "Knowledge base" },
          {
            type: "p",
            text: "This is the body of information the chatbot can use to answer. It should be specific, current and free of contradictions.",
          },
          {
            type: "table",
            head: ["Topic", "Examples of what to include"],
            rows: [
              ["Menu or services", "Dishes, ingredients and allergens; services, duration and prices"],
              ["Opening hours", "Normal hours, bank holidays, closures, last kitchen orders"],
              ["Location", "Address, parking, public transport, accessibility"],
              ["Policies", "Cancellations, deposits, groups, pets, children, payments"],
              ["Contacts", "Phone, email, when and how to reach a person"],
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "When information changes, remove the old version. Two versions of the same price or opening hours are the most common cause of wrong answers.",
          },
          { type: "h2", id: "tone-and-languages", text: "Tone of voice and languages" },
          {
            type: "ul",
            items: [
              "**Tone**: more formal or more relaxed, to match your brand.",
              "**Languages**: by default the chatbot replies in the language the customer writes in. You can limit it to a set of languages.",
              "**Short answers**: on WhatsApp and mobile, brief replies with a link work better than long paragraphs.",
            ],
          },
          { type: "h2", id: "hand-over", text: "Hand-over to bookings and people" },
          {
            type: "ul",
            items: [
              "**Booking**: when a customer wants to book, the chatbot sends your booking link, ideally pre-filtered for the right service.",
              "**Person**: complaints, special requests, events, quotes or anything out of scope go to your team, with a summary of the conversation.",
              "**Out of hours**: the chatbot says when your team will be able to reply.",
            ],
          },
          { type: "h2", id: "guardrails", text: "Safety guardrails" },
          {
            type: "ul",
            items: [
              "It does not make things up: when the answer is not in the knowledge base, it says it does not know and offers human contact.",
              "It does not give medical, legal or financial advice.",
              "It does not promise discounts, refunds or exceptions that are not in your policies.",
              "It does not ask for sensitive data such as health details or card numbers.",
            ],
          },
          { type: "h2", id: "whatsapp-rules", text: "WhatsApp rules" },
          {
            type: "p",
            text: "On the WhatsApp Business Platform, a business can reply freely for **24 hours** after the customer's last message. Outside that window, it can only start a conversation with **template messages** pre-approved by Meta, such as a reminder or confirmation. We create and submit those templates for you.",
          },
          { type: "h2", id: "gdpr", text: "Privacy and GDPR" },
          {
            type: "p",
            text: "The widget and WhatsApp show a privacy notice at the start of the conversation. Conversation logs are kept only for the agreed period and used to provide the service and improve your business's answers. Your business is the data controller and Steevanz acts as a processor.",
          },
        ],
      },
    },
    usage: {
      pt: {
        title: "Utilização diária do chatbot com IA",
        description:
          "Como acompanhar o chatbot no dia a dia: rever conversas, assumir uma conversa, atualizar menu, preços e horários e medir o que os clientes perguntam.",
        blocks: [
          {
            type: "p",
            text: "Um chatbot bem configurado não precisa de atenção constante, mas melhora muito com uma revisão regular. Esta página explica a rotina recomendada.",
          },
          { type: "h2", id: "rever-conversas", text: "Rever conversas" },
          {
            type: "p",
            text: "Na sua área de cliente encontra o histórico de conversas do site e do WhatsApp. Nas primeiras semanas, reveja algumas conversas por dia; depois, uma revisão semanal costuma chegar. Procure sobretudo:",
          },
          {
            type: "ul",
            items: [
              "Perguntas a que o chatbot respondeu «não sei», que indicam informação em falta.",
              "Respostas corretas mas pouco claras ou demasiado longas.",
              "Conversas passadas à equipa que o chatbot poderia ter resolvido sozinho.",
            ],
          },
          { type: "h2", id: "assumir-conversa", text: "Assumir uma conversa" },
          {
            type: "p",
            text: "Quando o chatbot passa uma conversa à equipa, recebe um aviso com o resumo. No WhatsApp, a pessoa da equipa responde diretamente e o chatbot deixa de intervir nessa conversa até a devolver. Lembre-se da janela de **24 horas**: se responder depois disso, pode ser necessário usar uma mensagem modelo.",
          },
          { type: "h2", id: "atualizar-informacao", text: "Atualizar informação" },
          {
            type: "steps",
            items: [
              {
                title: "Identifique a alteração",
                body: "Novo prato, novo preço, horário de verão, férias ou uma nova política.",
              },
              {
                title: "Envie-nos a informação",
                body: "Por WhatsApp ou email, com a data a partir da qual é válida. Algumas atualizações simples pode fazê-las diretamente na sua área de cliente.",
              },
              {
                title: "Confirme a resposta",
                body: "Depois da atualização, faça a pergunta ao chatbot no site e confirme que responde com a nova informação.",
              },
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Avise-nos com antecedência de feriados e fechos. É das perguntas mais comuns e das que mais frustram o cliente se a resposta estiver errada.",
          },
          { type: "h2", id: "aprender-com-perguntas", text: "Aprender com as perguntas" },
          {
            type: "p",
            text: "As conversas mostram o que os clientes realmente querem saber. Perguntas repetidas sobre estacionamento, opções vegetarianas ou preços de um serviço podem indicar que essa informação deve estar mais visível no seu site, no menu ou no perfil do Google.",
          },
          { type: "h2", id: "rotina-recomendada", text: "Rotina recomendada" },
          {
            type: "table",
            head: ["Frequência", "Tarefa"],
            rows: [
              ["Diária (primeiras semanas)", "Ler algumas conversas e assinalar respostas a corrigir"],
              ["Semanal", "Rever perguntas sem resposta e conversas passadas à equipa"],
              ["Antes de cada mudança", "Enviar novo menu, preços, horários ou fechos com a data de início"],
              ["Mensal", "Rever com a Steevanz o tom, os encaminhamentos e as perguntas mais frequentes"],
            ],
          },
          {
            type: "p",
            text: "Se algo não correr bem, consulte a [resolução de problemas](/docs/chatbot-ia/resolucao-problemas).",
          },
        ],
      },
      en: {
        title: "Using the AI chatbot day to day",
        description:
          "How to look after the chatbot day to day: reviewing conversations, taking over a chat, updating menu, prices and hours and learning from questions.",
        blocks: [
          {
            type: "p",
            text: "A well-configured chatbot does not need constant attention, but it improves a lot with regular review. This page explains the recommended routine.",
          },
          { type: "h2", id: "review-conversations", text: "Reviewing conversations" },
          {
            type: "p",
            text: "In your client area you will find the conversation history for the website and WhatsApp. In the first few weeks, review a few conversations each day; after that, a weekly review is usually enough. Look especially for:",
          },
          {
            type: "ul",
            items: [
              "Questions the chatbot answered with “I don't know”, which point to missing information.",
              "Answers that are correct but unclear or too long.",
              "Conversations handed to your team that the chatbot could have resolved itself.",
            ],
          },
          { type: "h2", id: "take-over", text: "Taking over a conversation" },
          {
            type: "p",
            text: "When the chatbot hands a conversation to your team, you receive an alert with a summary. On WhatsApp, a team member replies directly and the chatbot stays out of that conversation until it is handed back. Remember the **24-hour** window: if you reply after that, you may need to use a template message.",
          },
          { type: "h2", id: "update-information", text: "Updating information" },
          {
            type: "steps",
            items: [
              {
                title: "Identify the change",
                body: "A new dish, new price, summer hours, a holiday closure or a new policy.",
              },
              {
                title: "Send us the information",
                body: "By WhatsApp or email, with the date it takes effect. Some simple updates you can make directly in your client area.",
              },
              {
                title: "Check the answer",
                body: "After the update, ask the chatbot the question on your website and confirm it replies with the new information.",
              },
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Let us know about bank holidays and closures in advance. It is one of the most common questions and one of the most frustrating for customers if the answer is wrong.",
          },
          { type: "h2", id: "learn-from-questions", text: "Learning from questions" },
          {
            type: "p",
            text: "Conversations show what customers really want to know. Repeated questions about parking, vegetarian options or the price of a service may mean that information should be more visible on your website, menu or Google Business Profile.",
          },
          { type: "h2", id: "recommended-routine", text: "Recommended routine" },
          {
            type: "table",
            head: ["How often", "Task"],
            rows: [
              ["Daily (first few weeks)", "Read a few conversations and flag answers to correct"],
              ["Weekly", "Review unanswered questions and conversations handed to your team"],
              ["Before any change", "Send the new menu, prices, hours or closures with the start date"],
              ["Monthly", "Review tone, hand-overs and the most common questions with Steevanz"],
            ],
          },
          {
            type: "p",
            text: "If something goes wrong, see [troubleshooting](/en/docs/ai-chatbot/troubleshooting).",
          },
        ],
      },
    },
    troubleshooting: {
      pt: {
        title: "Resolução de problemas do chatbot com IA",
        description:
          "Soluções para problemas comuns do chatbot com IA: respostas erradas, widget que não aparece no site, WhatsApp sem resposta e mensagens modelo rejeitadas.",
        blocks: [
          {
            type: "p",
            text: "Quando nos contactar, indique o canal (site ou WhatsApp), a data e hora aproximadas e, se possível, uma captura de ecrã da conversa. Isso acelera muito a análise.",
          },
          { type: "h2", id: "resposta-errada", text: "O chatbot deu uma resposta errada" },
          {
            type: "ol",
            items: [
              "Verifique se a informação correta está na base de conhecimento e se não existe uma versão antiga em paralelo.",
              "Veja se a pergunta era ambígua; por vezes basta acrescentar uma resposta explícita para esse caso.",
              "Envie-nos o exemplo; corrigimos a base de conhecimento e testamos de novo.",
            ],
          },
          {
            type: "callout",
            tone: "warning",
            text: "Se a resposta errada puder ter consequências para o cliente, por exemplo sobre alergénios ou preços, contacte o cliente diretamente para corrigir a informação.",
          },
          { type: "h2", id: "widget-nao-aparece", text: "O widget não aparece no site" },
          {
            type: "ul",
            items: [
              "Confirme que o código foi colado em todas as páginas e não apenas na página inicial.",
              "Limpe a cache do site e do navegador; alguns sistemas de cache demoram a mostrar alterações.",
              "Verifique se um bloqueador de publicidade ou um gestor de cookies está a impedir o carregamento do script.",
              "Se o site tiver uma política de segurança de conteúdo restritiva, o domínio do widget tem de ser autorizado.",
            ],
          },
          { type: "h2", id: "whatsapp-sem-resposta", text: "O chatbot não responde no WhatsApp" },
          {
            type: "ul",
            items: [
              "Confirme que a verificação da empresa e a ligação do número estão concluídas.",
              "Veja se a conversa foi assumida por uma pessoa da equipa; nesse caso o chatbot fica em silêncio até ser devolvida.",
              "Verifique se o número está a ser usado ao mesmo tempo noutra aplicação de forma incompatível.",
            ],
          },
          { type: "h2", id: "modelos-rejeitados", text: "Mensagens modelo rejeitadas" },
          {
            type: "p",
            text: "A Meta pode rejeitar modelos com conteúdo promocional numa categoria de serviço, com variáveis mal formatadas ou com texto pouco claro. Reescrevemos e voltamos a submeter; normalmente basta tornar o objetivo da mensagem mais explícito.",
          },
          { type: "h2", id: "respostas-longas", text: "Respostas demasiado longas ou formais" },
          {
            type: "p",
            text: "Ajustamos o tom e o comprimento das respostas na configuração. Diga-nos como preferia que o chatbot respondesse, de preferência com um exemplo real. Veja também as [perguntas frequentes](/docs/chatbot-ia/perguntas-frequentes) ou [contacte-nos](/contacto).",
          },
        ],
      },
      en: {
        title: "AI chatbot troubleshooting",
        description:
          "Fixes for common AI chatbot issues: wrong answers, widget not showing on your website, no replies on WhatsApp and rejected template messages.",
        blocks: [
          {
            type: "p",
            text: "When you contact us, tell us the channel (website or WhatsApp), the approximate date and time and, if possible, a screenshot of the conversation. That speeds things up considerably.",
          },
          { type: "h2", id: "wrong-answer", text: "The chatbot gave a wrong answer" },
          {
            type: "ol",
            items: [
              "Check that the correct information is in the knowledge base and that there is no older version alongside it.",
              "Consider whether the question was ambiguous; sometimes adding an explicit answer for that case is enough.",
              "Send us the example; we will correct the knowledge base and test again.",
            ],
          },
          {
            type: "callout",
            tone: "warning",
            text: "If the wrong answer could affect the customer, for example about allergens or prices, contact the customer directly to correct the information.",
          },
          { type: "h2", id: "widget-not-showing", text: "The widget is not showing on the website" },
          {
            type: "ul",
            items: [
              "Check the snippet was added to every page, not just the home page.",
              "Clear your website and browser cache; some caching systems take a while to show changes.",
              "Check whether an ad blocker or cookie consent tool is stopping the script from loading.",
              "If your site has a strict content security policy, the widget's domain needs to be allowed.",
            ],
          },
          { type: "h2", id: "whatsapp-no-reply", text: "The chatbot is not replying on WhatsApp" },
          {
            type: "ul",
            items: [
              "Check that business verification and the number connection are complete.",
              "See whether a team member has taken over the conversation; if so, the chatbot stays silent until it is handed back.",
              "Check that the number is not being used in another app in an incompatible way at the same time.",
            ],
          },
          { type: "h2", id: "rejected-templates", text: "Rejected template messages" },
          {
            type: "p",
            text: "Meta may reject templates with promotional content in a utility category, badly formatted variables or unclear wording. We rewrite and resubmit them; usually it is enough to make the purpose of the message more explicit.",
          },
          { type: "h2", id: "long-answers", text: "Answers too long or too formal" },
          {
            type: "p",
            text: "We adjust tone and answer length in the configuration. Tell us how you would prefer the chatbot to reply, ideally with a real example. See also the [FAQ](/en/docs/ai-chatbot/faq) or [contact us](/en/contact).",
          },
        ],
      },
    },
    faq: {
      pt: {
        title: "Perguntas frequentes sobre o chatbot com IA",
        description:
          "Respostas às dúvidas mais comuns sobre o chatbot com IA da Steevanz: exatidão, idiomas, WhatsApp, reservas, passagem para a equipa, clínicas e RGPD.",
        blocks: [
          { type: "h2", id: "perguntas", text: "Perguntas e respostas" },
          {
            type: "faq",
            items: [
              {
                q: "O chatbot pode inventar respostas?",
                a: "Está configurado para responder apenas com base na sua informação e dizer que não sabe quando não tem resposta. Ainda assim, a IA pode cometer erros, por isso recomendamos rever as conversas regularmente.",
              },
              {
                q: "Em que línguas responde?",
                a: "Por defeito responde na língua em que o cliente escreve. Pode limitar a um conjunto de línguas.",
              },
              {
                q: "Posso usar o meu número de WhatsApp atual?",
                a: "Em muitos casos sim. Analisamos consigo se é melhor migrar o número atual ou usar um número novo. Veja a [instalação](/docs/chatbot-ia/instalacao).",
              },
              {
                q: "O que é a janela de 24 horas do WhatsApp?",
                a: "Depois da última mensagem do cliente, o negócio pode responder livremente durante 24 horas. Fora desse período, só pode enviar mensagens modelo aprovadas pela Meta.",
              },
              {
                q: "O chatbot faz reservas?",
                a: "Encaminha o cliente para o seu link de reserva, onde escolhe o horário com disponibilidade real. Funciona especialmente bem com o [sistema de reservas online](/produtos/sistema-reservas-online).",
              },
              {
                q: "Como passa a conversa a uma pessoa?",
                a: "Quando o pedido sai do âmbito definido ou o cliente pede para falar com alguém, a equipa recebe um aviso com o resumo e continua a conversa.",
              },
              {
                q: "Posso usá-lo numa clínica?",
                a: "Sim, para informação sobre serviços, preços, horários e marcações. Não dá aconselhamento médico e encaminha questões clínicas para a equipa.",
              },
              {
                q: "Como atualizo o menu ou os preços?",
                a: "Envie-nos a alteração por WhatsApp ou email. Algumas atualizações simples pode fazer diretamente na sua área de cliente.",
              },
              {
                q: "As conversas ficam guardadas?",
                a: "Sim, durante o prazo acordado, para prestar o serviço e melhorar as respostas, em conformidade com o RGPD.",
              },
              {
                q: "Como posso ver o chatbot em funcionamento?",
                a: "[Agende uma demonstração](/agendar) e mostramos-lhe o chatbot a responder com informação de um negócio como o seu.",
              },
            ],
          },
          { type: "h2", id: "documentacao-relacionada", text: "Documentação relacionada" },
          {
            type: "ul",
            items: [
              "[Primeiros passos](/docs/chatbot-ia/primeiros-passos): o que o chatbot faz, os seus limites e o que preparar.",
              "[Instalação](/docs/chatbot-ia/instalacao): widget no site e ligação ao WhatsApp.",
              "[Configuração](/docs/chatbot-ia/configuracao): base de conhecimento, tom, encaminhamentos e limites de segurança.",
              "[Utilização](/docs/chatbot-ia/utilizacao): rever conversas, assumir conversas e atualizar informação.",
            ],
          },
          { type: "h2", id: "mais-ajuda", text: "Ainda tem dúvidas?" },
          {
            type: "p",
            text: "Veja a [página do produto](/produtos/chatbot-ia), a [resolução de problemas](/docs/chatbot-ia/resolucao-problemas) ou [fale connosco](/contacto).",
          },
        ],
      },
      en: {
        title: "AI chatbot FAQ",
        description:
          "Answers to common questions about the Steevanz AI chatbot: accuracy, languages, WhatsApp, bookings, handing over to staff, clinics and GDPR.",
        blocks: [
          { type: "h2", id: "questions", text: "Questions and answers" },
          {
            type: "faq",
            items: [
              {
                q: "Can the chatbot make up answers?",
                a: "It is configured to answer only from your information and to say it does not know when it has no answer. Even so, AI can make mistakes, so we recommend reviewing conversations regularly.",
              },
              {
                q: "Which languages does it reply in?",
                a: "By default it replies in the language the customer writes in. You can limit it to a set of languages.",
              },
              {
                q: "Can I use my current WhatsApp number?",
                a: "In many cases, yes. We will look at whether it is better to migrate your current number or use a new one. See [setup](/en/docs/ai-chatbot/setup).",
              },
              {
                q: "What is the WhatsApp 24-hour window?",
                a: "After the customer's last message, a business can reply freely for 24 hours. Outside that period, it can only send template messages approved by Meta.",
              },
              {
                q: "Does the chatbot take bookings?",
                a: "It sends customers to your booking link, where they choose a time with real availability. It works especially well with the [online booking system](/en/products/online-booking-system).",
              },
              {
                q: "How does it hand over to a person?",
                a: "When a request is out of scope or the customer asks to speak to someone, your team receives an alert with a summary and continues the conversation.",
              },
              {
                q: "Can I use it in a clinic?",
                a: "Yes, for information about services, prices, opening hours and appointments. It does not give medical advice and passes clinical questions to your team.",
              },
              {
                q: "How do I update the menu or prices?",
                a: "Send us the change by WhatsApp or email. Some simple updates you can make directly in your client area.",
              },
              {
                q: "Are conversations stored?",
                a: "Yes, for the agreed period, to provide the service and improve answers, in line with GDPR.",
              },
              {
                q: "How can I see the chatbot in action?",
                a: "[Book a demo](/en/book-a-demo) and we will show you the chatbot answering with information from a business like yours.",
              },
            ],
          },
          { type: "h2", id: "related-docs", text: "Related documentation" },
          {
            type: "ul",
            items: [
              "[Getting started](/en/docs/ai-chatbot/getting-started): what the chatbot does, its limits and what to prepare.",
              "[Setup](/en/docs/ai-chatbot/setup): website widget and WhatsApp connection.",
              "[Configuration](/en/docs/ai-chatbot/configuration): knowledge base, tone, hand-overs and safety guardrails.",
              "[Usage](/en/docs/ai-chatbot/usage): reviewing conversations, taking over chats and updating information.",
            ],
          },
          { type: "h2", id: "more-help", text: "Still have questions?" },
          {
            type: "p",
            text: "Visit the [product page](/en/products/ai-chatbot), [troubleshooting](/en/docs/ai-chatbot/troubleshooting) or [contact us](/en/contact).",
          },
        ],
      },
    },
  },
};

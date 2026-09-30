import type { ProductDocs } from "../types";

export const docs: ProductDocs = {
  productId: "ai-voice",
  pages: {
    "getting-started": {
      pt: {
        title: "Primeiros passos com a Receção por Voz IA",
        description:
          "Saiba o que faz a Receção por Voz IA da Steevanz, como atende chamadas 24/7 em português e inglês e o que precisa de preparar antes de começar.",
        blocks: [
          {
            type: "p",
            text: "A **Receção por Voz IA** é uma rececionista virtual que atende as chamadas do seu negócio a qualquer hora, em português ou inglês. Responde a perguntas frequentes, regista marcações, transfere chamadas urgentes para a sua equipa e envia-lhe um resumo de cada conversa. É um serviço gerido: a Steevanz configura tudo consigo e acompanha o funcionamento por WhatsApp e email.",
          },
          {
            type: "h2",
            id: "o-que-faz",
            text: "O que a rececionista faz por si",
          },
          {
            type: "ul",
            items: [
              "**Atende chamadas 24/7**, incluindo fora de horas, feriados e momentos de maior movimento em que ninguém consegue pegar no telefone.",
              "**Responde a perguntas frequentes**: horário, morada, estacionamento, preços indicativos, serviços disponíveis, políticas de cancelamento.",
              "**Regista marcações e reservas** diretamente no seu sistema de reservas ou calendário, quando existe integração.",
              "**Transfere chamadas urgentes** para o telemóvel de um membro da equipa, segundo as regras que definir.",
              "**Envia resumos** de cada chamada por WhatsApp ou email, com o nome, contacto e motivo da chamada.",
            ],
          },
          {
            type: "h2",
            id: "como-funciona",
            text: "Como funciona, em traços gerais",
          },
          {
            type: "p",
            text: "As chamadas chegam à rececionista de uma de duas formas: através do **reencaminhamento** do número que já usa (por exemplo, só quando está ocupado, não atende ou fora de horas) ou através de um **número novo e dedicado**. Em ambos os casos, o cliente liga, ouve uma saudação personalizada com o nome do seu negócio e fala naturalmente, como falaria com uma pessoa.",
          },
          {
            type: "p",
            text: "No fim da chamada, recebe um resumo. Se a chamada exigir intervenção humana, a rececionista transfere-a ou deixa um pedido de contacto para a sua equipa ligar de volta.",
          },
          {
            type: "h2",
            id: "para-quem",
            text: "Para quem é indicada",
          },
          {
            type: "table",
            head: ["Tipo de negócio", "Utilização mais comum"],
            rows: [
              ["Restaurantes", "Reservas de mesa, horários, pedidos de grupo, perguntas sobre o menu"],
              ["Salões e estética", "Marcações, remarcações, preços de serviços, disponibilidade de profissionais"],
              ["Clínicas", "Pedidos de consulta, informações administrativas, encaminhamento de urgências para a equipa"],
            ],
          },
          {
            type: "h2",
            id: "o-que-preparar",
            text: "O que preparar antes de começar",
          },
          {
            type: "ol",
            items: [
              "Uma lista das perguntas que os clientes fazem mais vezes ao telefone e as respetivas respostas.",
              "O seu horário de funcionamento, incluindo exceções como feriados e férias.",
              "O acesso ao seu sistema de reservas ou calendário, se quiser que a rececionista faça marcações.",
              "O número de telemóvel para onde devem ser transferidas as chamadas urgentes.",
              "A decisão entre reencaminhar o número atual ou usar um número novo.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            title: "Não precisa de ter tudo perfeito",
            text: "Na reunião inicial ajudamos a organizar a informação. Pode começar com as perguntas mais comuns e ir acrescentando outras à medida que analisamos as chamadas reais.",
          },
          {
            type: "h2",
            id: "proximos-passos",
            text: "Próximos passos",
          },
          {
            type: "p",
            text: "Veja o guia de [instalação](/docs/rececao-voz-ia/instalacao) para perceber como ligamos a rececionista ao seu telefone, ou [marque uma demonstração](/agendar) para ouvir uma chamada de exemplo. Também pode rever a [página do produto](/produtos/rececao-voz-ia) com preços e funcionalidades.",
          },
        ],
      },
      en: {
        title: "Getting started with the AI Voice Receptionist",
        description:
          "Learn what the Steevanz AI Voice Receptionist does, how it answers calls 24/7 in Portuguese and English, and what to prepare before you start.",
        blocks: [
          {
            type: "p",
            text: "The **AI Voice Receptionist** is a virtual receptionist that answers your business calls at any hour, in Portuguese or English. It answers common questions, takes bookings, transfers urgent calls to your team and sends you a summary of every conversation. It is a managed service: Steevanz sets everything up with you and keeps an eye on it, with support by WhatsApp and email.",
          },
          {
            type: "h2",
            id: "what-it-does",
            text: "What the receptionist does for you",
          },
          {
            type: "ul",
            items: [
              "**Answers calls 24/7**, including out of hours, on bank holidays and during busy spells when nobody can get to the phone.",
              "**Answers frequently asked questions**: opening hours, address, parking, indicative prices, available services, cancellation policies.",
              "**Takes bookings** straight into your booking system or calendar, where an integration is available.",
              "**Transfers urgent calls** to a team member's mobile, following the rules you set.",
              "**Sends summaries** of every call by WhatsApp or email, with the caller's name, contact and reason for calling.",
            ],
          },
          {
            type: "h2",
            id: "how-it-works",
            text: "How it works, in broad strokes",
          },
          {
            type: "p",
            text: "Calls reach the receptionist in one of two ways: by **forwarding** the number you already use (for example, only when you are busy, don't answer or are closed) or through a **new dedicated number**. Either way, the caller hears a personalised greeting with your business name and speaks naturally, just as they would to a person.",
          },
          {
            type: "p",
            text: "When the call ends, you receive a summary. If the call needs a human, the receptionist transfers it or leaves a callback request for your team.",
          },
          {
            type: "h2",
            id: "who-its-for",
            text: "Who it is for",
          },
          {
            type: "table",
            head: ["Type of business", "Most common use"],
            rows: [
              ["Restaurants", "Table bookings, opening hours, group enquiries, menu questions"],
              ["Salons and beauty", "Appointments, rescheduling, service prices, staff availability"],
              ["Clinics", "Appointment requests, admin information, routing urgent matters to the team"],
            ],
          },
          {
            type: "h2",
            id: "what-to-prepare",
            text: "What to prepare before you start",
          },
          {
            type: "ol",
            items: [
              "A list of the questions customers ask most often on the phone, with the answers.",
              "Your opening hours, including exceptions such as bank holidays and closures.",
              "Access to your booking system or calendar, if you want the receptionist to take bookings.",
              "The mobile number that urgent calls should be transferred to.",
              "A decision between forwarding your current number or using a new one.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            title: "You don't need everything perfect",
            text: "We help you organise the information during the kick-off call. You can start with the most common questions and add more as we review real calls.",
          },
          {
            type: "h2",
            id: "next-steps",
            text: "Next steps",
          },
          {
            type: "p",
            text: "Read the [setup guide](/en/docs/ai-voice-receptionist/setup) to see how we connect the receptionist to your phone, or [book a demo](/en/book-a-demo) to hear a sample call. You can also check the [product page](/en/products/ai-voice-receptionist) for pricing and features.",
          },
        ],
      },
    },
    setup: {
      pt: {
        title: "Instalação da Receção por Voz IA",
        description:
          "Passo a passo para ligar a Receção por Voz IA ao seu telefone: reencaminhamento do número atual ou número dedicado, códigos habituais e testes finais.",
        blocks: [
          {
            type: "p",
            text: "A instalação é feita em conjunto com a equipa Steevanz e costuma ficar concluída em poucos dias úteis, dependendo sobretudo da integração com o seu sistema de reservas. Esta página explica as duas formas de ligar a rececionista ao seu telefone e o processo completo.",
          },
          {
            type: "h2",
            id: "escolher-numero",
            text: "Escolher entre reencaminhamento e número dedicado",
          },
          {
            type: "table",
            head: ["Opção", "Vantagens", "A ter em conta"],
            rows: [
              ["Reencaminhar o número atual", "Os clientes continuam a ligar para o número que já conhecem; pode reencaminhar só algumas chamadas", "Depende do seu operador e do tipo de linha; o reencaminhamento pode ter custos no seu tarifário"],
              ["Número novo dedicado", "Configuração independente do seu operador; ideal para campanhas ou uma linha de reservas", "É preciso divulgar o novo número no site, Google e redes sociais"],
            ],
          },
          {
            type: "h2",
            id: "processo-instalacao",
            text: "Processo de instalação",
          },
          {
            type: "steps",
            items: [
              {
                title: "Reunião inicial",
                body: "Falamos sobre o seu negócio, as chamadas que recebe, o horário e as regras de transferência. Decidimos em conjunto se vamos reencaminhar o número atual ou usar um número dedicado.",
              },
              {
                title: "Envio da informação base",
                body: "Envia-nos as perguntas frequentes, preços indicativos, serviços e políticas. Pode ser um documento simples, fotografias do menu ou uma lista por WhatsApp.",
              },
              {
                title: "Configuração da rececionista",
                body: "Preparamos a saudação, a voz, as respostas e as regras de encaminhamento. Se houver sistema de reservas ou calendário compatível, fazemos a integração.",
              },
              {
                title: "Chamadas de teste",
                body: "Antes de ligar a linha real, fazemos chamadas de teste consigo e ajustamos o tom, as respostas e as transferências até ficar satisfeito.",
              },
              {
                title: "Ativação do reencaminhamento ou do número",
                body: "Ativa o reencaminhamento no seu telefone (ou com o seu operador), ou começamos a divulgar o número dedicado. Confirmamos juntos que as chamadas chegam corretamente.",
              },
              {
                title: "Acompanhamento das primeiras semanas",
                body: "Revemos os resumos das primeiras chamadas e afinamos respostas e regras. Qualquer ajuste é pedido por WhatsApp ou email.",
              },
            ],
          },
          {
            type: "h2",
            id: "codigos-reencaminhamento",
            text: "Códigos de reencaminhamento habituais",
          },
          {
            type: "p",
            text: "Em muitas linhas móveis em Portugal (MEO, NOS, Vodafone, DIGI, entre outras) o reencaminhamento pode ser ativado com os códigos GSM normalizados. Substitua `NUMERO` pelo número que lhe indicarmos:",
          },
          {
            type: "code",
            label: "Códigos GSM comuns",
            code: "**21*NUMERO#   reencaminhar todas as chamadas\n**61*NUMERO#   reencaminhar quando não atende\n**67*NUMERO#   reencaminhar quando está ocupado\n**62*NUMERO#   reencaminhar quando está inacessível\n##21#          desativar o reencaminhamento de todas as chamadas\n##002#         desativar todos os reencaminhamentos",
          },
          {
            type: "callout",
            tone: "warning",
            title: "Confirme sempre com o seu operador",
            text: "Estes códigos são comuns, mas não universais. Linhas fixas, centrais telefónicas e alguns tarifários empresariais usam métodos diferentes, e o reencaminhamento pode ser cobrado. Confirme com o seu operador antes de ativar; se preferir, acompanhamos o processo consigo.",
          },
          {
            type: "h3",
            id: "fora-de-horas",
            text: "Reencaminhar apenas fora de horas",
          },
          {
            type: "p",
            text: "Os códigos GSM não têm horário. Se quiser que a rececionista atenda só fora de horas, há duas abordagens: ativar e desativar o reencaminhamento manualmente no fecho e na abertura, ou usar uma central telefónica ou serviço do operador que suporte regras horárias. Em alternativa, a rececionista pode atender sempre e aplicar regras diferentes consoante a hora.",
          },
          {
            type: "h2",
            id: "depois-instalacao",
            text: "Depois da instalação",
          },
          {
            type: "p",
            text: "Siga para a página de [configuração](/docs/rececao-voz-ia/configuracao) para ver o que pode personalizar. Se algo não correr como esperado, consulte a [resolução de problemas](/docs/rececao-voz-ia/resolucao-problemas) ou [contacte-nos](/contacto).",
          },
        ],
      },
      en: {
        title: "Setting up the AI Voice Receptionist",
        description:
          "Step-by-step guide to connecting the AI Voice Receptionist to your phone: forwarding your existing number or a dedicated line, common codes and testing.",
        blocks: [
          {
            type: "p",
            text: "Setup is done together with the Steevanz team and is usually complete within a few working days, depending mainly on the integration with your booking system. This page explains the two ways to connect the receptionist to your phone and the full process.",
          },
          {
            type: "h2",
            id: "choose-number",
            text: "Choosing between forwarding and a dedicated number",
          },
          {
            type: "table",
            head: ["Option", "Advantages", "Things to consider"],
            rows: [
              ["Forward your current number", "Customers keep calling the number they know; you can forward only some calls", "Depends on your operator and line type; forwarding may be charged on your plan"],
              ["New dedicated number", "Independent of your operator; ideal for campaigns or a bookings line", "You need to publish the new number on your website, Google and social media"],
            ],
          },
          {
            type: "h2",
            id: "setup-process",
            text: "Setup process",
          },
          {
            type: "steps",
            items: [
              {
                title: "Kick-off call",
                body: "We talk about your business, the calls you receive, your opening hours and your transfer rules. Together we decide whether to forward your current number or use a dedicated one.",
              },
              {
                title: "Send us the basics",
                body: "Send us your FAQs, indicative prices, services and policies. A simple document, photos of your menu or a list over WhatsApp all work.",
              },
              {
                title: "Receptionist configuration",
                body: "We prepare the greeting, voice, answers and routing rules. If you have a compatible booking system or calendar, we set up the integration.",
              },
              {
                title: "Test calls",
                body: "Before going live, we make test calls with you and adjust the tone, answers and transfers until you are happy.",
              },
              {
                title: "Activate forwarding or the new number",
                body: "You switch on forwarding on your phone (or with your operator), or we start publishing the dedicated number. We check together that calls arrive correctly.",
              },
              {
                title: "Follow-up in the first weeks",
                body: "We review the summaries of the first calls and fine-tune answers and rules. Any change can be requested by WhatsApp or email.",
              },
            ],
          },
          {
            type: "h2",
            id: "forwarding-codes",
            text: "Common forwarding codes",
          },
          {
            type: "p",
            text: "On many mobile lines in Portugal (MEO, NOS, Vodafone, DIGI and others) forwarding can be switched on with the standard GSM codes. Replace `NUMBER` with the number we give you:",
          },
          {
            type: "code",
            label: "Common GSM codes",
            code: "**21*NUMBER#   forward all calls\n**61*NUMBER#   forward when unanswered\n**67*NUMBER#   forward when busy\n**62*NUMBER#   forward when unreachable\n##21#          cancel forwarding of all calls\n##002#         cancel all forwarding",
          },
          {
            type: "callout",
            tone: "warning",
            title: "Always check with your operator",
            text: "These codes are common but not universal. Landlines, phone systems (PBX) and some business plans use different methods, and forwarding may be charged. Check with your operator before switching it on; we are happy to walk you through it.",
          },
          {
            type: "h3",
            id: "out-of-hours",
            text: "Forwarding only out of hours",
          },
          {
            type: "p",
            text: "GSM codes have no schedule. If you want the receptionist to answer only out of hours, you can either switch forwarding on and off manually at closing and opening time, or use a phone system or operator service that supports time-based rules. Alternatively, the receptionist can answer all the time and apply different rules depending on the hour.",
          },
          {
            type: "h2",
            id: "after-setup",
            text: "After setup",
          },
          {
            type: "p",
            text: "Head to the [configuration](/en/docs/ai-voice-receptionist/configuration) page to see what you can customise. If something doesn't work as expected, see [troubleshooting](/en/docs/ai-voice-receptionist/troubleshooting) or [contact us](/en/contact).",
          },
        ],
      },
    },
    configuration: {
      pt: {
        title: "Configuração da Receção por Voz IA",
        description:
          "Personalize a saudação, a voz, as perguntas frequentes, as marcações, as transferências e os resumos da sua Receção por Voz IA, sempre com apoio da Steevanz.",
        blocks: [
          {
            type: "p",
            text: "Quase tudo na rececionista pode ser ajustado ao seu negócio. Como se trata de um serviço gerido, não precisa de mexer em definições técnicas: diga-nos o que quer mudar por WhatsApp ou email e tratamos disso. Esta página descreve o que pode ser configurado e as nossas recomendações.",
          },
          {
            type: "h2",
            id: "saudacao-rgpd",
            text: "Saudação e aviso de gravação",
          },
          {
            type: "p",
            text: "A saudação é a primeira coisa que o cliente ouve. Deve ser curta, dizer o nome do negócio e, se as chamadas forem gravadas ou transcritas, **informar o cliente logo no início**, como exige o RGPD.",
          },
          {
            type: "code",
            label: "Exemplo de saudação",
            code: "Olá, ligou para o Restaurante Exemplo. Sou a assistente virtual e esta chamada pode ser gravada para melhorar o nosso serviço. Em que posso ajudar?",
          },
          {
            type: "callout",
            tone: "info",
            title: "Proteção de dados",
            text: "Definimos consigo o período de conservação das gravações e transcrições. Recomendamos guardar apenas o necessário e indicar na sua política de privacidade que utiliza um assistente de voz para atender chamadas.",
          },
          {
            type: "h2",
            id: "voz-idioma",
            text: "Voz e idioma",
          },
          {
            type: "ul",
            items: [
              "**Voz**: pode escolher entre vozes femininas e masculinas, com diferentes tons. Na fase de testes ouvimos algumas opções consigo.",
              "**Idioma**: a rececionista fala português europeu e inglês. Pode começar em português e mudar para inglês quando o cliente fala nessa língua.",
              "**Tom**: mais formal para clínicas, mais descontraído para um café ou bar. Ajustamos o vocabulário ao seu estilo.",
            ],
          },
          {
            type: "h2",
            id: "conhecimento",
            text: "Perguntas frequentes e informação do negócio",
          },
          {
            type: "p",
            text: "A rececionista responde com base na informação que nos dá. Quanto mais clara e atualizada, melhores as respostas. Inclua horários, morada e indicações, estacionamento, serviços, preços indicativos, políticas de cancelamento e atrasos, e o que fazer em casos especiais (grupos grandes, alergias, crianças, animais).",
          },
          {
            type: "callout",
            tone: "tip",
            text: "Quando mudar o menu, os preços ou o horário, envie-nos a atualização. Mudanças simples costumam ficar ativas no mesmo dia útil.",
          },
          {
            type: "h2",
            id: "marcacoes",
            text: "Marcações e reservas",
          },
          {
            type: "p",
            text: "Se usar um sistema de reservas ou calendário compatível, como o nosso [sistema de reservas online](/produtos/sistema-reservas-online), a rececionista consulta a disponibilidade e regista a marcação. Sem integração, recolhe os dados (nome, contacto, data, hora, número de pessoas ou serviço) e envia-os como pedido para a sua equipa confirmar.",
          },
          {
            type: "h2",
            id: "transferencias",
            text: "Transferências e resumos",
          },
          {
            type: "table",
            head: ["Definição", "Exemplos"],
            rows: [
              ["Quando transferir", "Pedido explícito para falar com alguém, reclamação, urgência, fornecedor"],
              ["Para onde transferir", "Telemóvel do gerente, telemóvel de quem está de serviço"],
              ["Se ninguém atender", "Deixar pedido de contacto e avisar por WhatsApp"],
              ["Resumos", "Por WhatsApp, por email, ou ambos; após cada chamada ou num resumo diário"],
            ],
          },
          {
            type: "p",
            text: "Para ver como tudo isto funciona no dia a dia, consulte a página de [utilização](/docs/rececao-voz-ia/utilizacao).",
          },
        ],
      },
      en: {
        title: "Configuring the AI Voice Receptionist",
        description:
          "Customise the greeting, voice, FAQs, bookings, call transfers and call summaries of your AI Voice Receptionist, with the Steevanz team handling the details.",
        blocks: [
          {
            type: "p",
            text: "Almost everything about the receptionist can be tailored to your business. As it is a managed service, you don't need to touch technical settings: tell us what you want to change by WhatsApp or email and we take care of it. This page describes what can be configured and what we recommend.",
          },
          {
            type: "h2",
            id: "greeting-gdpr",
            text: "Greeting and recording notice",
          },
          {
            type: "p",
            text: "The greeting is the first thing callers hear. It should be short, say your business name and, if calls are recorded or transcribed, **tell the caller at the very start**, as GDPR requires.",
          },
          {
            type: "code",
            label: "Sample greeting",
            code: "Hello, you've reached Example Restaurant. I'm the virtual assistant and this call may be recorded to help us improve our service. How can I help?",
          },
          {
            type: "callout",
            tone: "info",
            title: "Data protection",
            text: "We agree with you how long recordings and transcripts are kept. We recommend keeping only what you need and stating in your privacy policy that you use a voice assistant to answer calls.",
          },
          {
            type: "h2",
            id: "voice-language",
            text: "Voice and language",
          },
          {
            type: "ul",
            items: [
              "**Voice**: choose between female and male voices with different tones. We listen to a few options with you during testing.",
              "**Language**: the receptionist speaks European Portuguese and English. It can start in Portuguese and switch to English when the caller speaks English.",
              "**Tone**: more formal for clinics, more relaxed for a café or bar. We adapt the wording to your style.",
            ],
          },
          {
            type: "h2",
            id: "knowledge",
            text: "FAQs and business information",
          },
          {
            type: "p",
            text: "The receptionist answers based on the information you give us. The clearer and more up to date it is, the better the answers. Include opening hours, address and directions, parking, services, indicative prices, cancellation and lateness policies, and what to do in special cases (large groups, allergies, children, pets).",
          },
          {
            type: "callout",
            tone: "tip",
            text: "When your menu, prices or hours change, send us the update. Simple changes are usually live on the same working day.",
          },
          {
            type: "h2",
            id: "bookings",
            text: "Bookings and appointments",
          },
          {
            type: "p",
            text: "If you use a compatible booking system or calendar, such as our [online booking system](/en/products/online-booking-system), the receptionist checks availability and records the booking. Without an integration, it collects the details (name, contact, date, time, party size or service) and sends them as a request for your team to confirm.",
          },
          {
            type: "h2",
            id: "transfers-summaries",
            text: "Transfers and summaries",
          },
          {
            type: "table",
            head: ["Setting", "Examples"],
            rows: [
              ["When to transfer", "Explicit request to speak to someone, complaint, urgent matter, supplier"],
              ["Where to transfer", "Manager's mobile, mobile of whoever is on duty"],
              ["If nobody answers", "Take a callback request and alert you by WhatsApp"],
              ["Summaries", "By WhatsApp, email or both; after each call or as a daily digest"],
            ],
          },
          {
            type: "p",
            text: "To see how all of this works day to day, read the [usage](/en/docs/ai-voice-receptionist/usage) page.",
          },
        ],
      },
    },
    usage: {
      pt: {
        title: "Utilização diária da Receção por Voz IA",
        description:
          "Como funciona a Receção por Voz IA no dia a dia: o que acontece numa chamada, como ler os resumos, tratar pedidos de contacto e conhecer os limites do serviço.",
        blocks: [
          {
            type: "p",
            text: "Depois de ativa, a rececionista trabalha sozinha. O seu papel passa a ser ler os resumos, responder aos pedidos de contacto e avisar-nos quando algo muda no negócio. Esta página explica o fluxo típico e as boas práticas.",
          },
          {
            type: "h2",
            id: "fluxo-chamada",
            text: "O que acontece numa chamada",
          },
          {
            type: "ol",
            items: [
              "O cliente liga e ouve a saudação com o nome do negócio e o aviso de gravação.",
              "A rececionista percebe o motivo da chamada e responde, faz perguntas de esclarecimento ou recolhe dados.",
              "Se for uma marcação, confirma data, hora e contacto, e regista-a ou envia-a como pedido.",
              "Se a chamada cumprir as regras de transferência, liga para o telemóvel definido.",
              "No fim, despede-se e é gerado um resumo que recebe por WhatsApp ou email.",
            ],
          },
          {
            type: "h2",
            id: "resumos",
            text: "Ler os resumos das chamadas",
          },
          {
            type: "p",
            text: "Cada resumo inclui, sempre que disponível, o **número de quem ligou**, o **nome**, o **motivo**, a **ação tomada** (respondeu, marcou, transferiu, deixou pedido de contacto) e eventuais notas. Os pedidos que precisam de resposta vêm destacados.",
          },
          {
            type: "callout",
            tone: "tip",
            title: "Crie uma rotina",
            text: "Defina um momento fixo, por exemplo à abertura, para rever os pedidos de contacto da noite. Ligar de volta no mesmo dia faz grande diferença na perceção do cliente.",
          },
          {
            type: "h2",
            id: "limites",
            text: "O que a rececionista não faz",
          },
          {
            type: "ul",
            items: [
              "**Não aceita pagamentos** nem pede dados de cartão por telefone.",
              "**Não dá aconselhamento médico**, diagnósticos ou indicações clínicas; em clínicas, encaminha para a equipa e, em caso de emergência, indica o 112.",
              "**Não promete** descontos, exceções ou condições que não estejam na informação que nos deu.",
              "**Não substitui** a sua equipa em conversas sensíveis, como reclamações graves; nesses casos transfere ou deixa pedido de contacto.",
            ],
          },
          {
            type: "h2",
            id: "sotaques-ruido",
            text: "Sotaques, ruído e chamadas difíceis",
          },
          {
            type: "p",
            text: "A rececionista entende bem sotaques regionais e falantes de inglês com diferentes pronúncias. Em chamadas com muito ruído de fundo, ligação fraca ou pessoas a falar ao mesmo tempo, pode pedir para repetir. Se continuar sem perceber, oferece-se para deixar um pedido de contacto, para que o cliente nunca fique sem resposta.",
          },
          {
            type: "h2",
            id: "melhoria-continua",
            text: "Melhorar ao longo do tempo",
          },
          {
            type: "p",
            text: "Se notar uma pergunta a que a rececionista respondeu mal ou não soube responder, envie-nos o resumo dessa chamada. Acrescentamos a resposta e ajustamos as regras. Para situações técnicas, consulte a [resolução de problemas](/docs/rececao-voz-ia/resolucao-problemas).",
          },
        ],
      },
      en: {
        title: "Using the AI Voice Receptionist day to day",
        description:
          "How the AI Voice Receptionist works day to day: what happens on a call, how to read call summaries, handle callback requests and understand its limits.",
        blocks: [
          {
            type: "p",
            text: "Once live, the receptionist works on its own. Your role becomes reading the summaries, handling callback requests and letting us know when something changes in the business. This page explains the typical flow and good practice.",
          },
          {
            type: "h2",
            id: "call-flow",
            text: "What happens on a call",
          },
          {
            type: "ol",
            items: [
              "The caller hears the greeting with your business name and the recording notice.",
              "The receptionist works out why they are calling and answers, asks clarifying questions or collects details.",
              "For a booking, it confirms the date, time and contact, then records it or sends it as a request.",
              "If the call matches your transfer rules, it rings the mobile you chose.",
              "At the end, it says goodbye and a summary is sent to you by WhatsApp or email.",
            ],
          },
          {
            type: "h2",
            id: "summaries",
            text: "Reading call summaries",
          },
          {
            type: "p",
            text: "Each summary includes, where available, the **caller's number**, **name**, **reason for calling**, **action taken** (answered, booked, transferred, callback requested) and any notes. Requests that need a reply are highlighted.",
          },
          {
            type: "callout",
            tone: "tip",
            title: "Build a routine",
            text: "Set a fixed time, for example at opening, to go through overnight callback requests. Calling back the same day makes a big difference to how customers see you.",
          },
          {
            type: "h2",
            id: "limits",
            text: "What the receptionist won't do",
          },
          {
            type: "ul",
            items: [
              "**It won't take payments** or ask for card details over the phone.",
              "**It won't give medical advice**, diagnoses or clinical guidance; at clinics it routes to the team and, in an emergency, tells the caller to dial 112.",
              "**It won't promise** discounts, exceptions or terms that are not in the information you gave us.",
              "**It won't replace** your team in sensitive conversations such as serious complaints; in those cases it transfers or takes a callback request.",
            ],
          },
          {
            type: "h2",
            id: "accents-noise",
            text: "Accents, noise and difficult calls",
          },
          {
            type: "p",
            text: "The receptionist copes well with regional Portuguese accents and English speakers with different pronunciations. On calls with lots of background noise, a weak signal or people talking over each other, it may ask the caller to repeat. If it still can't understand, it offers to take a callback request so the caller is never left without an answer.",
          },
          {
            type: "h2",
            id: "continuous-improvement",
            text: "Improving over time",
          },
          {
            type: "p",
            text: "If you spot a question the receptionist handled badly or couldn't answer, send us the summary of that call. We add the answer and adjust the rules. For technical issues, see [troubleshooting](/en/docs/ai-voice-receptionist/troubleshooting).",
          },
        ],
      },
    },
    troubleshooting: {
      pt: {
        title: "Resolução de problemas da Receção por Voz IA",
        description:
          "Soluções para os problemas mais comuns da Receção por Voz IA: chamadas que não chegam, transferências falhadas, resumos em falta e respostas incorretas.",
        blocks: [
          {
            type: "p",
            text: "A maioria dos problemas tem origem no reencaminhamento do operador ou em informação desatualizada. Antes de nos contactar, verifique os pontos abaixo. Se o problema continuar, envie-nos uma mensagem com a hora aproximada da chamada e o número de onde ligou.",
          },
          {
            type: "h2",
            id: "chamadas-nao-chegam",
            text: "As chamadas não chegam à rececionista",
          },
          {
            type: "steps",
            items: [
              {
                title: "Confirme o estado do reencaminhamento",
                body: "Em muitas linhas móveis, marcar `*#21#`, `*#61#` ou `*#67#` mostra se o reencaminhamento correspondente está ativo e para que número.",
              },
              {
                title: "Verifique o número de destino",
                body: "Confirme que o número configurado é exatamente o que lhe indicámos, com o indicativo correto.",
              },
              {
                title: "Faça uma chamada de teste",
                body: "Ligue de outro telefone para o seu número, sem atender, e aguarde. Se ouvir a saudação, o reencaminhamento está a funcionar.",
              },
              {
                title: "Contacte o operador",
                body: "Se os códigos não funcionarem, o seu tarifário pode ter o reencaminhamento bloqueado ou exigir ativação pelo apoio ao cliente do operador.",
              },
            ],
          },
          {
            type: "h2",
            id: "atende-cedo-tarde",
            text: "A rececionista atende cedo ou tarde demais",
          },
          {
            type: "p",
            text: "No reencaminhamento quando não atende, o tempo até a chamada passar para a rececionista é definido pelo operador. Em muitas redes é possível ajustá-lo com um código como `**61*NUMERO**TEMPO#`, em que o tempo é normalmente um múltiplo de 5 segundos até 30. Confirme com o seu operador se esta opção existe no seu tarifário.",
          },
          {
            type: "h2",
            id: "transferencias-falham",
            text: "As transferências falham",
          },
          {
            type: "ul",
            items: [
              "Confirme que o telemóvel de destino tem rede e não está em modo não incomodar.",
              "Verifique se esse telemóvel não reencaminha, por sua vez, para o correio de voz demasiado depressa.",
              "Se mudou de pessoa de serviço ou de número, avise-nos para atualizarmos as regras.",
            ],
          },
          {
            type: "h2",
            id: "resumos-em-falta",
            text: "Não recebo os resumos",
          },
          {
            type: "p",
            text: "Verifique a pasta de spam ou promoções do email e adicione o remetente aos contactos. No WhatsApp, confirme que não bloqueou nem arquivou a conversa. Se mudou de número ou email, diga-nos para atualizar o destino.",
          },
          {
            type: "h2",
            id: "respostas-incorretas",
            text: "A rececionista deu uma resposta errada",
          },
          {
            type: "p",
            text: "Normalmente acontece quando a informação mudou (horário, preços, menu) e não foi atualizada, ou quando a pergunta não estava prevista. Envie-nos o resumo da chamada e a resposta correta; corrigimos rapidamente.",
          },
          {
            type: "callout",
            tone: "warning",
            title: "Desligar em caso de emergência",
            text: "Se precisar de desligar a rececionista de imediato, desative o reencaminhamento (por exemplo com `##002#`, se o seu operador suportar) e avise-nos pelo [contacto](/contacto) ou WhatsApp.",
          },
        ],
      },
      en: {
        title: "Troubleshooting the AI Voice Receptionist",
        description:
          "Fixes for the most common AI Voice Receptionist issues: calls not arriving, failed transfers, missing call summaries and incorrect answers to callers.",
        blocks: [
          {
            type: "p",
            text: "Most issues come down to operator forwarding or out-of-date information. Before contacting us, check the points below. If the problem persists, send us a message with the approximate time of the call and the number you called from.",
          },
          {
            type: "h2",
            id: "calls-not-arriving",
            text: "Calls are not reaching the receptionist",
          },
          {
            type: "steps",
            items: [
              {
                title: "Check the forwarding status",
                body: "On many mobile lines, dialling `*#21#`, `*#61#` or `*#67#` shows whether that forwarding is active and to which number.",
              },
              {
                title: "Check the destination number",
                body: "Make sure the number set up is exactly the one we gave you, with the right country code.",
              },
              {
                title: "Make a test call",
                body: "Call your number from another phone, don't answer, and wait. If you hear the greeting, forwarding is working.",
              },
              {
                title: "Contact your operator",
                body: "If the codes don't work, your plan may block forwarding or require it to be switched on through the operator's customer service.",
              },
            ],
          },
          {
            type: "h2",
            id: "answers-too-early-late",
            text: "The receptionist picks up too early or too late",
          },
          {
            type: "p",
            text: "With forwarding on no answer, the delay before the call passes to the receptionist is set by the operator. On many networks you can adjust it with a code such as `**61*NUMBER**TIME#`, where the time is usually a multiple of 5 seconds up to 30. Check with your operator whether your plan supports this.",
          },
          {
            type: "h2",
            id: "transfers-failing",
            text: "Transfers are failing",
          },
          {
            type: "ul",
            items: [
              "Make sure the destination mobile has signal and is not on do not disturb.",
              "Check that the mobile is not itself sending calls to voicemail too quickly.",
              "If the person on duty or their number has changed, let us know so we can update the rules.",
            ],
          },
          {
            type: "h2",
            id: "missing-summaries",
            text: "I'm not receiving summaries",
          },
          {
            type: "p",
            text: "Check your spam or promotions folder and add the sender to your contacts. On WhatsApp, make sure you haven't blocked or archived the chat. If your number or email has changed, tell us so we can update it.",
          },
          {
            type: "h2",
            id: "wrong-answers",
            text: "The receptionist gave a wrong answer",
          },
          {
            type: "p",
            text: "This usually happens when information has changed (hours, prices, menu) and wasn't updated, or when the question wasn't anticipated. Send us the call summary and the correct answer and we will fix it quickly.",
          },
          {
            type: "callout",
            tone: "warning",
            title: "Switching off in an emergency",
            text: "If you need to take the receptionist offline straight away, cancel forwarding (for example with `##002#`, if your operator supports it) and let us know via the [contact page](/en/contact) or WhatsApp.",
          },
        ],
      },
    },
    faq: {
      pt: {
        title: "Perguntas frequentes sobre a Receção por Voz IA",
        description:
          "Respostas às dúvidas mais comuns sobre a Receção por Voz IA: número de telefone, idiomas, gravação e RGPD, marcações, transferências, custos e cancelamento.",
        blocks: [
          {
            type: "p",
            text: "Reunimos aqui as perguntas que os clientes nos fazem com mais frequência. Se não encontrar a sua, [fale connosco](/contacto).",
          },
          {
            type: "h2",
            id: "perguntas",
            text: "Perguntas e respostas",
          },
          {
            type: "faq",
            items: [
              {
                q: "Tenho de mudar de número de telefone?",
                a: "Não. Pode manter o seu número e reencaminhar as chamadas para a rececionista, apenas quando está ocupado, não atende ou fora de horas. Também pode optar por um número novo dedicado.",
              },
              {
                q: "Os clientes percebem que estão a falar com uma IA?",
                a: "Sim, e é assim que deve ser. A saudação apresenta a rececionista como assistente virtual. A conversa é natural, mas não fingimos que é uma pessoa.",
              },
              {
                q: "Em que idiomas atende?",
                a: "Em português europeu e inglês. Pode mudar de idioma durante a chamada, conforme a língua em que o cliente fala.",
              },
              {
                q: "As chamadas são gravadas? E o RGPD?",
                a: "Pode escolher gravar ou apenas transcrever. Em qualquer caso, o cliente é informado no início da chamada. Definimos consigo o prazo de conservação e recomendamos atualizar a sua política de privacidade.",
              },
              {
                q: "Consegue fazer marcações no meu sistema?",
                a: "Sim, quando o sistema de reservas ou calendário permite integração. Caso contrário, a rececionista recolhe os dados e envia-os como pedido para a sua equipa confirmar.",
              },
              {
                q: "O que acontece se alguém precisar mesmo de falar com uma pessoa?",
                a: "A rececionista transfere a chamada para o telemóvel que definir. Se ninguém atender, deixa um pedido de contacto e avisa-o por WhatsApp ou email.",
              },
              {
                q: "Pode aceitar pagamentos ou dar indicações médicas?",
                a: "Não. A rececionista não aceita pagamentos nem dados de cartão e não dá aconselhamento médico. Nestes casos encaminha para a sua equipa.",
              },
              {
                q: "O reencaminhamento tem custos?",
                a: "Depende do seu operador e tarifário. Algumas chamadas reencaminhadas são cobradas como chamadas feitas por si. Confirme com o seu operador antes de ativar.",
              },
              {
                q: "Quanto tempo demora a instalação?",
                a: "Normalmente alguns dias úteis. O prazo depende sobretudo da informação que nos envia e da integração com o sistema de reservas.",
              },
              {
                q: "Posso cancelar o serviço?",
                a: "Sim. Basta desativar o reencaminhamento e avisar-nos. As condições de cancelamento estão descritas na proposta que recebe antes de começar.",
              },
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Quer ouvir como soa? [Marque uma demonstração](/agendar) e fazemos uma chamada de exemplo com informação do seu negócio.",
          },
        ],
      },
      en: {
        title: "AI Voice Receptionist FAQ",
        description:
          "Answers to common questions about the AI Voice Receptionist: phone numbers, languages, call recording and GDPR, bookings, transfers, costs and cancelling.",
        blocks: [
          {
            type: "p",
            text: "Here are the questions customers ask us most often. If yours isn't here, [get in touch](/en/contact).",
          },
          {
            type: "h2",
            id: "questions",
            text: "Questions and answers",
          },
          {
            type: "faq",
            items: [
              {
                q: "Do I need to change my phone number?",
                a: "No. You can keep your number and forward calls to the receptionist, only when you are busy, don't answer or are closed. You can also choose a new dedicated number.",
              },
              {
                q: "Will callers know they are talking to an AI?",
                a: "Yes, and that's how it should be. The greeting introduces the receptionist as a virtual assistant. The conversation feels natural, but we never pretend it is a person.",
              },
              {
                q: "Which languages does it speak?",
                a: "European Portuguese and English. It can switch language mid-call, depending on how the caller speaks.",
              },
              {
                q: "Are calls recorded? What about GDPR?",
                a: "You can choose to record or only transcribe. Either way, callers are told at the start of the call. We agree the retention period with you and recommend updating your privacy policy.",
              },
              {
                q: "Can it book appointments in my system?",
                a: "Yes, when your booking system or calendar supports an integration. Otherwise, the receptionist collects the details and sends them as a request for your team to confirm.",
              },
              {
                q: "What if someone really needs to speak to a person?",
                a: "The receptionist transfers the call to the mobile you choose. If nobody answers, it takes a callback request and alerts you by WhatsApp or email.",
              },
              {
                q: "Can it take payments or give medical advice?",
                a: "No. The receptionist doesn't take payments or card details and doesn't give medical advice. In those cases it routes the caller to your team.",
              },
              {
                q: "Does call forwarding cost anything?",
                a: "It depends on your operator and plan. Some forwarded calls are charged as calls made by you. Check with your operator before switching it on.",
              },
              {
                q: "How long does setup take?",
                a: "Usually a few working days. It depends mainly on how quickly we receive your information and on the booking system integration.",
              },
              {
                q: "Can I cancel?",
                a: "Yes. Just cancel forwarding and let us know. Cancellation terms are set out in the proposal you receive before we start.",
              },
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Want to hear what it sounds like? [Book a demo](/en/book-a-demo) and we'll run a sample call with your business information.",
          },
        ],
      },
    },
  },
};

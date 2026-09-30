import type { ProductDocs } from "../types";

export const docs: ProductDocs = {
  productId: "ai-reviews",
  pages: {
    "getting-started": {
      pt: {
        title: "Primeiros passos com a Gestão de Reviews IA",
        description:
          "Descubra como a Gestão de Reviews IA da Steevanz acompanha as avaliações do seu perfil Google, prepara respostas no seu tom e o alerta para reviews negativas.",
        blocks: [
          {
            type: "p",
            text: "A **Gestão de Reviews IA** ajuda-o a responder a todas as avaliações do seu Perfil da Empresa no Google, sem ter de passar horas a escrever. A Steevanz liga o serviço ao seu perfil, acompanha as novas reviews e prepara rascunhos de resposta no tom da sua marca, que aprova antes de serem publicados.",
          },
          {
            type: "h2",
            id: "o-que-inclui",
            text: "O que está incluído",
          },
          {
            type: "ul",
            items: [
              "**Monitorização contínua** das novas avaliações no seu Perfil da Empresa no Google.",
              "**Rascunhos de resposta** escritos no tom do seu negócio, enviados por WhatsApp ou email para aprovação.",
              "**Alertas imediatos** quando recebe uma avaliação de 1 a 3 estrelas.",
              "**Relatório mensal** com a evolução da classificação, o número de avaliações e os temas mais mencionados.",
              "**Apoio humano** da equipa Steevanz para casos delicados.",
            ],
          },
          {
            type: "h2",
            id: "porque-responder",
            text: "Porque vale a pena responder a todas as reviews",
          },
          {
            type: "p",
            text: "Quem procura um restaurante, salão ou clínica lê as avaliações e também as respostas. Uma resposta cuidada a uma crítica mostra que leva o feedback a sério; um agradecimento personalizado a uma avaliação positiva reforça a relação com o cliente. O difícil é manter a consistência quando o dia a dia está cheio, e é aí que o serviço ajuda.",
          },
          {
            type: "p",
            text: "As avaliações também lhe dizem coisas. Lê-las com regularidade, e não apenas quando algo corre mal, revela padrões: um prato que todos elogiam, um tempo de espera que se repete, um membro da equipa que os clientes mencionam pelo nome. O relatório mensal reúne esses padrões para que possa agir.",
          },
          {
            type: "h2",
            id: "como-funciona",
            text: "Como funciona",
          },
          {
            type: "ol",
            items: [
              "Dá à Steevanz acesso de gestor ao seu Perfil da Empresa no Google.",
              "Definimos consigo o tom, as regras e os casos que exigem atenção especial.",
              "Quando chega uma nova avaliação, prepara-se um rascunho de resposta.",
              "Recebe o rascunho, aprova ou pede alterações, e a resposta é publicada.",
              "Todos os meses recebe um relatório com os resultados.",
            ],
          },
          {
            type: "callout",
            tone: "info",
            title: "Serviço independente",
            text: "A Steevanz é um prestador independente e não tem qualquer ligação ao Google. Trabalhamos através das ferramentas normais que o Google disponibiliza aos gestores de perfis.",
          },
          {
            type: "h2",
            id: "combinar-nfc",
            text: "Combinar com as placas NFC",
          },
          {
            type: "p",
            text: "O serviço funciona especialmente bem com as [placas NFC para Google Reviews](/produtos/placas-nfc-google-reviews): as placas ajudam a receber mais avaliações, e a gestão com IA garante que todas têm resposta. Para começar, consulte a [instalação](/docs/gestao-reviews-ia/instalacao) ou [marque uma demonstração](/agendar).",
          },
        ],
      },
      en: {
        title: "Getting started with AI Review Management",
        description:
          "See how Steevanz AI Review Management monitors reviews on your Google Business Profile, drafts replies in your tone and alerts you to negative reviews fast.",
        blocks: [
          {
            type: "p",
            text: "**AI Review Management** helps you reply to every review on your Google Business Profile without spending hours writing. Steevanz connects the service to your profile, monitors new reviews and drafts replies in your brand's tone, which you approve before they are published.",
          },
          {
            type: "h2",
            id: "whats-included",
            text: "What's included",
          },
          {
            type: "ul",
            items: [
              "**Continuous monitoring** of new reviews on your Google Business Profile.",
              "**Draft replies** written in your business's tone, sent by WhatsApp or email for approval.",
              "**Instant alerts** when you receive a 1 to 3 star review.",
              "**Monthly report** with your rating trend, review volume and most mentioned topics.",
              "**Human support** from the Steevanz team for sensitive cases.",
            ],
          },
          {
            type: "h2",
            id: "why-reply",
            text: "Why it's worth replying to every review",
          },
          {
            type: "p",
            text: "People looking for a restaurant, salon or clinic read reviews and the replies too. A thoughtful reply to criticism shows you take feedback seriously; a personal thank-you to a positive review strengthens the relationship. The hard part is staying consistent when the day is full, and that is where the service helps.",
          },
          {
            type: "p",
            text: "Replies also tell you things. Reading reviews regularly, rather than only when something goes wrong, reveals patterns: a dish everyone praises, a waiting time that keeps coming up, a team member customers mention by name. The monthly report brings those patterns together so you can act on them.",
          },
          {
            type: "h2",
            id: "how-it-works",
            text: "How it works",
          },
          {
            type: "ol",
            items: [
              "You give Steevanz manager access to your Google Business Profile.",
              "We agree the tone, the rules and the cases that need special attention.",
              "When a new review arrives, a draft reply is prepared.",
              "You receive the draft, approve it or ask for changes, and the reply is published.",
              "Every month you receive a report with the results.",
            ],
          },
          {
            type: "callout",
            tone: "info",
            title: "An independent service",
            text: "Steevanz is an independent provider and is not affiliated with Google. We work through the standard tools Google offers to profile managers.",
          },
          {
            type: "h2",
            id: "pair-with-nfc",
            text: "Pairing with NFC plates",
          },
          {
            type: "p",
            text: "The service works especially well with [NFC Google review plates](/en/products/nfc-google-review-plates): the plates help you collect more reviews, and AI management makes sure every one gets a reply. To get going, see [setup](/en/docs/ai-review-management/setup) or [book a demo](/en/book-a-demo).",
          },
        ],
      },
    },
    setup: {
      pt: {
        title: "Instalação da Gestão de Reviews IA",
        description:
          "Como dar à Steevanz acesso de gestor ao seu Perfil da Empresa no Google, definir o tom das respostas e ativar os alertas da Gestão de Reviews IA.",
        blocks: [
          {
            type: "p",
            text: "A instalação é simples e não exige conhecimentos técnicos. O passo mais importante é dar acesso ao seu Perfil da Empresa no Google, sem nunca partilhar a palavra-passe da sua conta.",
          },
          {
            type: "h2",
            id: "requisitos",
            text: "Antes de começar",
          },
          {
            type: "ul",
            items: [
              "O seu Perfil da Empresa no Google tem de estar **verificado**.",
              "Precisa de ter acesso como **proprietário** do perfil para convidar novos gestores.",
              "Tenha à mão alguns exemplos de respostas que já escreveu e de que gosta, se existirem.",
            ],
          },
          {
            type: "callout",
            tone: "warning",
            title: "Nunca partilhe a sua palavra-passe",
            text: "Não precisamos da palavra-passe da sua conta Google. O acesso é dado através de um convite de gestor, que pode remover a qualquer momento.",
          },
          {
            type: "h2",
            id: "passos-instalacao",
            text: "Passos de instalação",
          },
          {
            type: "steps",
            items: [
              {
                title: "Reunião inicial",
                body: "Conversamos sobre o seu negócio, os clientes, o tipo de avaliações que recebe e o tom que quer transmitir.",
              },
              {
                title: "Convidar a Steevanz como gestor",
                body: "Nas definições de pessoas e acessos do seu Perfil da Empresa no Google, adicione o email que lhe indicarmos com a função de gestor. Se tiver dúvidas, orientamo-lo em chamada.",
              },
              {
                title: "Aceitação do convite",
                body: "Aceitamos o convite e confirmamos consigo que o acesso está ativo e que vemos as avaliações existentes.",
              },
              {
                title: "Definição do tom e das regras",
                body: "Preparamos um guia de estilo curto: forma de tratamento, assinatura, palavras a evitar, como lidar com críticas e quando o alertar.",
              },
              {
                title: "Canal de aprovação",
                body: "Escolhe se prefere receber os rascunhos por WhatsApp, por email ou por ambos, e quem da sua equipa os aprova.",
              },
              {
                title: "Arranque",
                body: "Começamos pelas avaliações recentes ainda sem resposta e passamos a acompanhar as novas.",
              },
            ],
          },
          {
            type: "h2",
            id: "varios-perfis",
            text: "Vários estabelecimentos",
          },
          {
            type: "p",
            text: "Se tiver mais de um espaço, cada um tem normalmente o seu próprio perfil no Google. Repetimos o convite para cada perfil e pode definir regras diferentes por local, por exemplo um tom mais formal numa clínica e mais descontraído num café.",
          },
          {
            type: "callout",
            tone: "info",
            title: "Pode remover o acesso quando quiser",
            text: "O acesso de gestor fica visível nas definições do seu perfil e pode ser removido a qualquer momento pelo proprietário. Continua sempre a ser o dono do perfil e de todas as avaliações.",
          },
          {
            type: "h2",
            id: "proximos-passos",
            text: "Próximos passos",
          },
          {
            type: "p",
            text: "Veja a página de [configuração](/docs/gestao-reviews-ia/configuracao) para afinar o tom e os alertas. Se o convite não funcionar, consulte a [resolução de problemas](/docs/gestao-reviews-ia/resolucao-problemas).",
          },
        ],
      },
      en: {
        title: "Setting up AI Review Management",
        description:
          "How to give Steevanz manager access to your Google Business Profile, agree the tone of your replies and switch on AI Review Management alerts.",
        blocks: [
          {
            type: "p",
            text: "Setup is simple and needs no technical knowledge. The key step is giving access to your Google Business Profile, without ever sharing your account password.",
          },
          {
            type: "h2",
            id: "requirements",
            text: "Before you start",
          },
          {
            type: "ul",
            items: [
              "Your Google Business Profile must be **verified**.",
              "You need **owner** access to the profile to invite new managers.",
              "Have a few examples of replies you've written and like, if you have any.",
            ],
          },
          {
            type: "callout",
            tone: "warning",
            title: "Never share your password",
            text: "We don't need your Google account password. Access is granted through a manager invitation, which you can remove at any time.",
          },
          {
            type: "h2",
            id: "setup-steps",
            text: "Setup steps",
          },
          {
            type: "steps",
            items: [
              {
                title: "Kick-off call",
                body: "We talk about your business, your customers, the kind of reviews you get and the tone you want to convey.",
              },
              {
                title: "Invite Steevanz as a manager",
                body: "In the people and access settings of your Google Business Profile, add the email address we give you with the manager role. If you're unsure, we can guide you on a call.",
              },
              {
                title: "Invitation accepted",
                body: "We accept the invitation and confirm with you that access is active and that we can see your existing reviews.",
              },
              {
                title: "Agree tone and rules",
                body: "We prepare a short style guide: how to address customers, sign-off, words to avoid, how to handle criticism and when to alert you.",
              },
              {
                title: "Approval channel",
                body: "You choose whether to receive drafts by WhatsApp, email or both, and who on your team approves them.",
              },
              {
                title: "Go live",
                body: "We start with recent reviews that have no reply yet and then keep track of new ones.",
              },
            ],
          },
          {
            type: "h2",
            id: "multiple-locations",
            text: "Multiple locations",
          },
          {
            type: "p",
            text: "If you have more than one site, each usually has its own Google profile. We repeat the invitation for each profile and you can set different rules per location, for example a more formal tone at a clinic and a more relaxed one at a café.",
          },
          {
            type: "callout",
            tone: "info",
            title: "You can remove access whenever you like",
            text: "Manager access is visible in your profile settings and the owner can remove it at any time. You always remain the owner of the profile and all its reviews.",
          },
          {
            type: "h2",
            id: "next-steps",
            text: "Next steps",
          },
          {
            type: "p",
            text: "See the [configuration](/en/docs/ai-review-management/configuration) page to fine-tune tone and alerts. If the invitation doesn't work, check [troubleshooting](/en/docs/ai-review-management/troubleshooting).",
          },
        ],
      },
    },
    configuration: {
      pt: {
        title: "Configuração da Gestão de Reviews IA",
        description:
          "Defina o tom das respostas, as regras para avaliações negativas, os alertas e o modo de aprovação da Gestão de Reviews IA para o seu perfil no Google.",
        blocks: [
          {
            type: "p",
            text: "A configuração define como as respostas soam e quando é chamado a intervir. Pode alterar qualquer definição a qualquer momento, basta enviar-nos uma mensagem.",
          },
          {
            type: "h2",
            id: "tom-de-voz",
            text: "Tom de voz",
          },
          {
            type: "table",
            head: ["Elemento", "Opções habituais"],
            rows: [
              ["Tratamento", "Você, tratamento pelo nome, forma mais institucional"],
              ["Registo", "Caloroso e próximo, profissional e sóbrio, descontraído"],
              ["Assinatura", "Nome do negócio, nome do proprietário, a equipa"],
              ["Idioma", "Responder na língua em que a avaliação foi escrita"],
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Pedimos-lhe três ou quatro respostas que tenha escrito e de que goste. São a melhor referência para manter a voz do seu negócio.",
          },
          {
            type: "h2",
            id: "regras-negativas",
            text: "Regras para avaliações negativas",
          },
          {
            type: "p",
            text: "As avaliações de 1 a 3 estrelas nunca são respondidas sem a sua aprovação. As diretrizes que seguimos por defeito são:",
          },
          {
            type: "ul",
            items: [
              "Responder com calma, agradecer o feedback e reconhecer a experiência do cliente, sem discutir.",
              "Não entrar em detalhes nem justificar em excesso; propor continuar a conversa em privado, com um contacto do negócio.",
              "**Nunca partilhar dados pessoais** do cliente, como o que consumiu, datas de marcação ou informação de saúde.",
              "Não oferecer compensações em público.",
            ],
          },
          {
            type: "h3",
            id: "exemplo-resposta",
            text: "Exemplo de resposta a uma crítica",
          },
          {
            type: "code",
            label: "Avaliação de 2 estrelas sobre tempo de espera",
            code: "Olá, Ana. Obrigado por nos ter deixado o seu comentário e lamentamos que a espera tenha sido tão longa. Não é a experiência que queremos proporcionar. Gostaríamos de perceber melhor o que aconteceu: se puder, escreva-nos para o email do restaurante. A equipa do Restaurante Exemplo",
          },
          {
            type: "p",
            text: "Repare que a resposta não discute, não revela detalhes da visita e oferece um canal privado. Para avaliações positivas, a resposta deve ser curta, agradecer e, sempre que possível, referir algo concreto que o cliente mencionou, como um prato ou o nome de quem o atendeu.",
          },
          {
            type: "h2",
            id: "alertas",
            text: "Alertas",
          },
          {
            type: "p",
            text: "Por defeito, recebe um alerta imediato em cada avaliação de 1 a 3 estrelas, com o texto da avaliação e uma proposta de resposta. Pode ajustar o limite (por exemplo, apenas 1 e 2 estrelas), escolher quem recebe os alertas e definir se quer ser avisado também de avaliações com palavras-chave específicas, como o nome de um funcionário.",
          },
          {
            type: "h2",
            id: "aprovacao",
            text: "Modo de aprovação",
          },
          {
            type: "table",
            head: ["Modo", "Como funciona"],
            rows: [
              ["Aprovar tudo", "Todos os rascunhos precisam da sua aprovação antes de serem publicados"],
              ["Aprovação só para críticas", "Avaliações de 4 e 5 estrelas são respondidas segundo o guia de estilo; as restantes aguardam aprovação"],
            ],
          },
          {
            type: "p",
            text: "Recomendamos começar com **aprovar tudo** nas primeiras semanas. Depois de confiar no tom, pode passar para o segundo modo. Veja como tudo funciona no dia a dia na página de [utilização](/docs/gestao-reviews-ia/utilizacao).",
          },
        ],
      },
      en: {
        title: "Configuring AI Review Management",
        description:
          "Set the tone of replies, rules for negative reviews, alerts and the approval mode of AI Review Management for your Google Business Profile.",
        blocks: [
          {
            type: "p",
            text: "Configuration decides how replies sound and when you're asked to step in. You can change any setting at any time; just send us a message.",
          },
          {
            type: "h2",
            id: "tone-of-voice",
            text: "Tone of voice",
          },
          {
            type: "table",
            head: ["Element", "Typical options"],
            rows: [
              ["Form of address", "First name, neutral, more formal"],
              ["Register", "Warm and friendly, professional and understated, relaxed"],
              ["Sign-off", "Business name, owner's name, the team"],
              ["Language", "Reply in the language the review was written in"],
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "We'll ask you for three or four replies you've written and like. They're the best reference for keeping your business's voice.",
          },
          {
            type: "h2",
            id: "negative-review-rules",
            text: "Rules for negative reviews",
          },
          {
            type: "p",
            text: "Reviews of 1 to 3 stars are never answered without your approval. The guidelines we follow by default are:",
          },
          {
            type: "ul",
            items: [
              "Reply calmly, thank the reviewer and acknowledge their experience, without arguing.",
              "Don't go into detail or over-explain; offer to continue the conversation privately, with a business contact.",
              "**Never share customers' personal data**, such as what they ordered, appointment dates or health information.",
              "Don't offer compensation in public.",
            ],
          },
          {
            type: "h3",
            id: "sample-reply",
            text: "Sample reply to criticism",
          },
          {
            type: "code",
            label: "2 star review about waiting time",
            code: "Hi Anna, thank you for taking the time to leave a review, and we're sorry the wait was so long. That's not the experience we want to offer. We'd like to understand what happened: if you can, please drop us a line at the restaurant's email address. The team at Example Restaurant",
          },
          {
            type: "p",
            text: "Notice that the reply doesn't argue, doesn't reveal details of the visit and offers a private channel. For positive reviews, replies should be short, say thank you and, wherever possible, mention something specific the customer wrote about, such as a dish or the name of the person who served them.",
          },
          {
            type: "h2",
            id: "alerts",
            text: "Alerts",
          },
          {
            type: "p",
            text: "By default you get an instant alert for every 1 to 3 star review, with the review text and a suggested reply. You can change the threshold (for example, only 1 and 2 stars), choose who receives alerts and ask to be notified about reviews with specific keywords, such as a staff member's name.",
          },
          {
            type: "h2",
            id: "approval",
            text: "Approval mode",
          },
          {
            type: "table",
            head: ["Mode", "How it works"],
            rows: [
              ["Approve everything", "Every draft needs your approval before it is published"],
              ["Approve criticism only", "4 and 5 star reviews are answered following the style guide; the rest wait for approval"],
            ],
          },
          {
            type: "p",
            text: "We recommend starting with **approve everything** for the first few weeks. Once you trust the tone, you can switch to the second mode. See how it all works day to day on the [usage](/en/docs/ai-review-management/usage) page.",
          },
        ],
      },
    },
    usage: {
      pt: {
        title: "Utilização diária da Gestão de Reviews IA",
        description:
          "Como aprovar respostas, reagir a alertas de avaliações negativas, denunciar reviews que violam as políticas do Google e ler o relatório mensal de reviews.",
        blocks: [
          {
            type: "p",
            text: "No dia a dia, o seu trabalho resume-se a aprovar rascunhos e a agir quando surge uma crítica. Esta página explica o que fazer em cada situação e o que o Google permite ou proíbe.",
          },
          {
            type: "h2",
            id: "aprovar-rascunhos",
            text: "Aprovar rascunhos",
          },
          {
            type: "p",
            text: "Cada rascunho chega com o texto da avaliação, a classificação e a resposta proposta. Pode responder com uma aprovação simples, pedir alterações por escrito (por exemplo, mencionar um prato ou corrigir um nome) ou dizer que prefere responder pessoalmente.",
          },
          {
            type: "h2",
            id: "reviews-negativas",
            text: "Quando chega uma avaliação negativa",
          },
          {
            type: "steps",
            items: [
              {
                title: "Leia com calma",
                body: "Evite responder a quente. Confirme com a equipa o que aconteceu, se for possível identificar a situação.",
              },
              {
                title: "Reveja a proposta de resposta",
                body: "A proposta agradece, reconhece a experiência e convida a continuar a conversa em privado. Ajuste se houver algo concreto a acrescentar.",
              },
              {
                title: "Aprove e acompanhe",
                body: "Depois de publicada, se o cliente o contactar, resolva a situação em privado. Alguns clientes atualizam a avaliação por iniciativa própria.",
              },
            ],
          },
          {
            type: "h2",
            id: "politicas-google",
            text: "O que as políticas do Google não permitem",
          },
          {
            type: "ul",
            items: [
              "**Oferecer incentivos** (descontos, brindes, sorteios) em troca de avaliações.",
              "**Pedir avaliações apenas a clientes satisfeitos** ou filtrar quem é convidado a avaliar.",
              "**Publicar avaliações falsas**, incluindo de funcionários, familiares ou do próprio negócio.",
              "Pedir a um cliente que retire uma avaliação em troca de algo.",
            ],
          },
          {
            type: "callout",
            tone: "warning",
            text: "Estas práticas podem levar à remoção de avaliações ou a restrições no perfil. A Steevanz não as utiliza nem recomenda.",
          },
          {
            type: "h2",
            id: "denunciar",
            text: "Denunciar avaliações que violam as políticas",
          },
          {
            type: "p",
            text: "Se uma avaliação contiver insultos, conteúdo ofensivo, informação pessoal, spam ou vier claramente de alguém que nunca foi cliente, pode denunciá-la ao Google através do próprio perfil. Ajudamos a preparar a denúncia, mas a decisão é sempre do Google: **denunciar não garante a remoção**. Uma crítica legítima, mesmo que injusta na sua perspetiva, normalmente não é removida; nesse caso, uma boa resposta é a melhor defesa.",
          },
          {
            type: "h2",
            id: "relatorio-mensal",
            text: "Relatório mensal",
          },
          {
            type: "p",
            text: "Todos os meses recebe um relatório com a evolução da classificação média, o número de novas avaliações, a taxa de resposta e os temas mais mencionados, positivos e negativos. Use-o para decidir onde melhorar, por exemplo tempos de espera ou atendimento. Tem dúvidas? Veja as [perguntas frequentes](/docs/gestao-reviews-ia/perguntas-frequentes).",
          },
        ],
      },
      en: {
        title: "Using AI Review Management day to day",
        description:
          "How to approve replies, act on negative review alerts, report reviews that breach Google's policies and read your monthly AI review management report.",
        blocks: [
          {
            type: "p",
            text: "Day to day, your job comes down to approving drafts and acting when criticism comes in. This page explains what to do in each situation and what Google allows or forbids.",
          },
          {
            type: "h2",
            id: "approving-drafts",
            text: "Approving drafts",
          },
          {
            type: "p",
            text: "Each draft arrives with the review text, the star rating and the proposed reply. You can reply with a simple approval, ask for changes in writing (for example, mention a dish or correct a name) or say you'd rather reply personally.",
          },
          {
            type: "h2",
            id: "negative-reviews",
            text: "When a negative review arrives",
          },
          {
            type: "steps",
            items: [
              {
                title: "Read it calmly",
                body: "Avoid replying in the heat of the moment. Check with your team what happened, if the situation can be identified.",
              },
              {
                title: "Review the suggested reply",
                body: "The draft thanks the reviewer, acknowledges their experience and invites them to continue privately. Adjust it if there's something specific to add.",
              },
              {
                title: "Approve and follow up",
                body: "Once it's published, if the customer gets in touch, resolve things privately. Some customers update their review of their own accord.",
              },
            ],
          },
          {
            type: "h2",
            id: "google-policies",
            text: "What Google's policies don't allow",
          },
          {
            type: "ul",
            items: [
              "**Offering incentives** (discounts, freebies, prize draws) in exchange for reviews.",
              "**Asking only happy customers** for reviews or filtering who is invited to review.",
              "**Posting fake reviews**, including from staff, family or the business itself.",
              "Asking a customer to remove a review in exchange for something.",
            ],
          },
          {
            type: "callout",
            tone: "warning",
            text: "These practices can lead to reviews being removed or restrictions on your profile. Steevanz does not use or recommend them.",
          },
          {
            type: "h2",
            id: "reporting",
            text: "Reporting reviews that breach the policies",
          },
          {
            type: "p",
            text: "If a review contains insults, offensive content, personal information or spam, or clearly comes from someone who was never a customer, you can report it to Google from the profile itself. We help prepare the report, but the decision always rests with Google: **reporting does not guarantee removal**. Legitimate criticism, even if you feel it is unfair, is usually not removed; in that case a good reply is your best defence.",
          },
          {
            type: "h2",
            id: "monthly-report",
            text: "Monthly report",
          },
          {
            type: "p",
            text: "Every month you receive a report with your average rating trend, number of new reviews, response rate and the most mentioned topics, positive and negative. Use it to decide where to improve, such as waiting times or service. Questions? See the [FAQ](/en/docs/ai-review-management/faq).",
          },
        ],
      },
    },
    troubleshooting: {
      pt: {
        title: "Resolução de problemas da Gestão de Reviews IA",
        description:
          "Soluções para problemas comuns da Gestão de Reviews IA: convite de gestor que falha, respostas não publicadas, alertas em falta e avaliações que desaparecem.",
        blocks: [
          {
            type: "p",
            text: "Estes são os problemas que surgem com mais frequência e como resolvê-los. Se nenhum se aplicar, [contacte-nos](/contacto) com o nome do perfil e uma descrição do que aconteceu.",
          },
          {
            type: "h2",
            id: "convite",
            text: "O convite de gestor não funciona",
          },
          {
            type: "ul",
            items: [
              "Confirme que está a usar a conta Google que é **proprietária** do perfil; gestores não podem convidar outras pessoas.",
              "Verifique se escreveu corretamente o email que lhe indicámos.",
              "Se o perfil ainda não estiver verificado, é preciso concluir a verificação primeiro.",
              "Se o convite expirou, basta enviá-lo de novo.",
            ],
          },
          {
            type: "h2",
            id: "resposta-nao-aparece",
            text: "A resposta aprovada não aparece no Google",
          },
          {
            type: "p",
            text: "As respostas podem demorar algum tempo a ficar visíveis publicamente, e o Google pode rever respostas antes de as mostrar. Se passadas 24 horas a resposta continuar invisível, avise-nos; verificamos se foi rejeitada por algum filtro e ajustamos o texto.",
          },
          {
            type: "h2",
            id: "alertas-em-falta",
            text: "Não recebo alertas",
          },
          {
            type: "steps",
            items: [
              {
                title: "Verifique o canal",
                body: "Confirme a pasta de spam do email e se a conversa de WhatsApp não está arquivada ou silenciada.",
              },
              {
                title: "Confirme o limite de alerta",
                body: "Se definiu alertas só para 1 e 2 estrelas, uma avaliação de 3 estrelas não gera alerta imediato.",
              },
              {
                title: "Verifique os acessos",
                body: "Se alguém removeu o acesso de gestor da Steevanz, deixamos de ver novas avaliações. Confirme nas definições de pessoas e acessos do perfil.",
              },
            ],
          },
          {
            type: "h2",
            id: "reviews-desaparecem",
            text: "Algumas avaliações desapareceram",
          },
          {
            type: "p",
            text: "O Google remove por vezes avaliações que os seus filtros automáticos consideram suspeitas, e os próprios autores podem apagá-las. Nem a Steevanz nem o proprietário do perfil controlam este processo. Se notar uma quebra grande e repentina, fale connosco para analisarmos a situação.",
          },
          {
            type: "callout",
            tone: "info",
            title: "Denúncias recusadas",
            text: "Se o Google recusou a remoção de uma avaliação denunciada, normalmente não há muito mais a fazer além de responder com cuidado. Uma resposta calma costuma pesar mais para quem lê do que a própria crítica.",
          },
          {
            type: "h2",
            id: "rascunho-nao-gosto",
            text: "Não gosto do tom dos rascunhos",
          },
          {
            type: "p",
            text: "Nas primeiras semanas é normal serem precisos ajustes. Quando pedir uma alteração, explique o motivo (por exemplo, demasiado formal, demasiado longo, não assinamos assim). Usamos esse feedback para atualizar o guia de estilo, e os rascunhos seguintes passam a refleti-lo. Se preferir, marcamos uma chamada curta para rever vários exemplos de uma vez.",
          },
        ],
      },
      en: {
        title: "Troubleshooting AI Review Management",
        description:
          "Fixes for common AI Review Management issues: manager invitation not arriving, replies not showing on Google, missing alerts and reviews disappearing.",
        blocks: [
          {
            type: "p",
            text: "These are the issues that come up most often and how to fix them. If none apply, [contact us](/en/contact) with the profile name and a description of what happened.",
          },
          {
            type: "h2",
            id: "invitation",
            text: "The manager invitation isn't working",
          },
          {
            type: "ul",
            items: [
              "Make sure you're using the Google account that **owns** the profile; managers can't invite other people.",
              "Check you typed the email address we gave you correctly.",
              "If the profile isn't verified yet, verification must be completed first.",
              "If the invitation has expired, just send it again.",
            ],
          },
          {
            type: "h2",
            id: "reply-not-showing",
            text: "An approved reply isn't showing on Google",
          },
          {
            type: "p",
            text: "Replies can take a while to become publicly visible, and Google may review replies before showing them. If a reply is still not visible after 24 hours, let us know; we'll check whether it was held by a filter and adjust the wording.",
          },
          {
            type: "h2",
            id: "missing-alerts",
            text: "I'm not getting alerts",
          },
          {
            type: "steps",
            items: [
              {
                title: "Check the channel",
                body: "Look in your email spam folder and make sure the WhatsApp chat isn't archived or muted.",
              },
              {
                title: "Check the alert threshold",
                body: "If you set alerts for 1 and 2 stars only, a 3 star review won't trigger an instant alert.",
              },
              {
                title: "Check access",
                body: "If someone removed Steevanz's manager access, we can no longer see new reviews. Check the people and access settings of the profile.",
              },
            ],
          },
          {
            type: "h2",
            id: "reviews-disappearing",
            text: "Some reviews have disappeared",
          },
          {
            type: "p",
            text: "Google sometimes removes reviews its automated filters consider suspicious, and authors can delete their own reviews. Neither Steevanz nor the profile owner controls this. If you notice a large, sudden drop, talk to us and we'll look into it.",
          },
          {
            type: "callout",
            tone: "info",
            title: "Rejected reports",
            text: "If Google declines to remove a reported review, there's usually little more to do beyond replying carefully. A calm reply often carries more weight with readers than the criticism itself.",
          },
          {
            type: "h2",
            id: "tone-not-right",
            text: "I don't like the tone of the drafts",
          },
          {
            type: "p",
            text: "Some adjustment is normal in the first few weeks. When you ask for a change, explain why (for example too formal, too long, that's not how we sign off). We use that feedback to update the style guide, and later drafts reflect it. If you prefer, we can book a short call to go through several examples at once.",
          },
        ],
      },
    },
    faq: {
      pt: {
        title: "Perguntas frequentes sobre a Gestão de Reviews IA",
        description:
          "Respostas às dúvidas mais comuns sobre a Gestão de Reviews IA: acesso ao perfil Google, aprovação de respostas, reviews negativas, políticas e relatórios.",
        blocks: [
          {
            type: "p",
            text: "As perguntas mais frequentes sobre o serviço. Se precisar de mais detalhe, [fale connosco](/contacto).",
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
                q: "Precisam da palavra-passe da minha conta Google?",
                a: "Não. Basta convidar a Steevanz como gestor do seu Perfil da Empresa no Google. Pode remover esse acesso a qualquer momento.",
              },
              {
                q: "As respostas são publicadas sem eu ver?",
                a: "Só se escolher esse modo para avaliações de 4 e 5 estrelas. As avaliações de 1 a 3 estrelas são sempre enviadas para sua aprovação.",
              },
              {
                q: "As respostas parecem escritas por uma máquina?",
                a: "Não devem. Definimos consigo um guia de estilo, usamos exemplos seus e evitamos respostas genéricas repetidas. Cada resposta refere o que o cliente escreveu.",
              },
              {
                q: "Conseguem apagar avaliações negativas?",
                a: "Não. Só o Google pode remover avaliações, e apenas quando violam as suas políticas. Ajudamos a denunciar essas avaliações, mas a remoção não é garantida.",
              },
              {
                q: "Podem ajudar-me a ter mais avaliações?",
                a: "O serviço foca-se nas respostas. Para receber mais avaliações de forma legítima, recomendamos as nossas placas NFC para Google Reviews, que facilitam o pedido a todos os clientes.",
              },
              {
                q: "Posso oferecer um desconto a quem deixar uma avaliação?",
                a: "Não. As políticas do Google proíbem incentivos em troca de avaliações. Também não é permitido pedir avaliações apenas a clientes satisfeitos.",
              },
              {
                q: "Respondem em inglês a turistas?",
                a: "Sim. Por defeito, respondemos na língua em que a avaliação foi escrita, dentro dos idiomas acordados consigo.",
              },
              {
                q: "Funciona com outras plataformas além do Google?",
                a: "O serviço foi pensado para o Perfil da Empresa no Google. Se usa outras plataformas, fale connosco para avaliarmos o seu caso.",
              },
              {
                q: "O que inclui o relatório mensal?",
                a: "A evolução da classificação média, o número de novas avaliações, a taxa de resposta e os temas mais mencionados, com sugestões de onde melhorar.",
              },
              {
                q: "Posso cancelar?",
                a: "Sim. Avise-nos e remova o acesso de gestor da Steevanz. As condições estão descritas na proposta que recebe antes de começar.",
              },
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Veja a [página do produto](/produtos/gestao-reviews-ia) com preços ou [marque uma demonstração](/agendar) para ver exemplos de respostas.",
          },
        ],
      },
      en: {
        title: "AI Review Management FAQ",
        description:
          "Answers to common questions about AI Review Management: Google profile access, approving replies, negative reviews, Google's policies and monthly reports.",
        blocks: [
          {
            type: "p",
            text: "The questions we're asked most about the service. If you need more detail, [get in touch](/en/contact).",
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
                q: "Do you need my Google account password?",
                a: "No. You just invite Steevanz as a manager of your Google Business Profile. You can remove that access at any time.",
              },
              {
                q: "Are replies published without me seeing them?",
                a: "Only if you choose that mode for 4 and 5 star reviews. Reviews of 1 to 3 stars are always sent to you for approval.",
              },
              {
                q: "Will the replies sound machine-written?",
                a: "They shouldn't. We agree a style guide with you, use your own examples and avoid repeating generic replies. Each reply refers to what the customer actually wrote.",
              },
              {
                q: "Can you delete negative reviews?",
                a: "No. Only Google can remove reviews, and only when they breach its policies. We help you report those reviews, but removal isn't guaranteed.",
              },
              {
                q: "Can you help me get more reviews?",
                a: "The service focuses on replies. To collect more reviews legitimately, we recommend our NFC Google review plates, which make it easy to ask every customer.",
              },
              {
                q: "Can I offer a discount for leaving a review?",
                a: "No. Google's policies forbid incentives in exchange for reviews. Asking only happy customers for reviews isn't allowed either.",
              },
              {
                q: "Do you reply to tourists in English?",
                a: "Yes. By default we reply in the language the review was written in, within the languages agreed with you.",
              },
              {
                q: "Does it work with platforms other than Google?",
                a: "The service is designed for Google Business Profile. If you use other platforms, talk to us and we'll look at your case.",
              },
              {
                q: "What's in the monthly report?",
                a: "Your average rating trend, number of new reviews, response rate and the most mentioned topics, with suggestions on where to improve.",
              },
              {
                q: "Can I cancel?",
                a: "Yes. Let us know and remove Steevanz's manager access. The terms are set out in the proposal you receive before we start.",
              },
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "See the [product page](/en/products/ai-review-management) for pricing or [book a demo](/en/book-a-demo) to see sample replies.",
          },
        ],
      },
    },
  },
};

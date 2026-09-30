import type { ProductDocs } from "../types";

export const docs: ProductDocs = {
  productId: "bookings",
  pages: {
    "getting-started": {
      pt: {
        title: "Primeiros passos com o sistema de reservas online",
        description:
          "Saiba como funciona o sistema de reservas online da Steevanz para restaurantes, salões e clínicas, o que preparar e o que acontece nos primeiros dias.",
        blocks: [
          {
            type: "p",
            text: "O sistema de reservas online da Steevanz permite que os seus clientes marquem mesa, serviço ou consulta a qualquer hora, sem telefonemas e sem trocas de mensagens. É um **serviço gerido**: a nossa equipa configura tudo consigo, publica o link de reserva nos seus canais e acompanha-o por WhatsApp ou email sempre que precisar.",
          },
          { type: "h2", id: "o-que-e", text: "O que é e para quem é" },
          {
            type: "p",
            text: "O sistema adapta-se ao tipo de negócio. A lógica de disponibilidade é diferente num restaurante, num salão ou numa clínica, por isso configuramos o modelo certo desde o início.",
          },
          {
            type: "table",
            head: ["Tipo de negócio", "O cliente reserva", "O sistema controla"],
            rows: [
              ["Restaurantes e cafés", "Mesa para um número de pessoas", "Lotação por turno, mesas, duração média da refeição"],
              ["Salões e barbearias", "Um serviço com um profissional", "Duração de cada serviço, agenda de cada membro da equipa, intervalos"],
              ["Clínicas", "Um tipo de consulta com um profissional", "Tipos de consulta, agenda de cada profissional, tempos de preparação"],
            ],
          },
          { type: "h2", id: "como-funciona", text: "Como funciona no dia a dia" },
          {
            type: "ol",
            items: [
              "O cliente abre o seu link de reserva a partir do site, do Instagram, do perfil do Google ou de uma conversa de WhatsApp.",
              "Escolhe o serviço ou o número de pessoas, a data e um horário disponível.",
              "Indica nome, contacto e, se aplicável, notas (alergias, preferências, primeira visita).",
              "Recebe a confirmação de imediato e, mais tarde, um lembrete com links para cancelar ou reagendar.",
              "A reserva aparece no painel e, se ativar a sincronização, no seu Google Calendar ou Outlook.",
            ],
          },
          {
            type: "callout",
            tone: "info",
            title: "Não precisa de instalar nada",
            text: "O sistema funciona no navegador, no computador, tablet ou telemóvel. Não há aplicações para instalar nem servidores para manter.",
          },
          { type: "h2", id: "o-que-preparar", text: "O que preparar antes de começar" },
          {
            type: "p",
            text: "Para que a configuração fique pronta rapidamente, reúna esta informação antes da primeira reunião:",
          },
          {
            type: "ul",
            items: [
              "**Horário de funcionamento** de cada dia, incluindo pausas e dias de fecho.",
              "**Lista de serviços ou tipos de consulta**, com duração e preço (se quiser mostrá-lo).",
              "**Equipa**: quem atende, que serviços faz cada pessoa e os respetivos horários.",
              "Para restaurantes: **lotação**, número e tamanho das mesas e turnos (almoço, jantar).",
              "**Políticas**: antecedência mínima para reservar, prazo de cancelamento e se pretende pedir sinal.",
              "Logótipo e cores, para a página de reserva ficar com a imagem do seu negócio.",
            ],
          },
          { type: "h2", id: "primeiros-dias", text: "Os primeiros dias" },
          {
            type: "p",
            text: "Depois de publicado o link, recomendamos uma semana de acompanhamento mais próximo. Verifique as reservas que entram, confirme que os horários mostrados correspondem à realidade e diga-nos o que ajustar. Pequenos acertos, como aumentar um intervalo entre serviços ou fechar um turno com pouca procura, fazem grande diferença.",
          },
          {
            type: "callout",
            tone: "tip",
            text: "Continue para a [instalação](/docs/sistema-reservas-online/instalacao) para ver os passos de arranque, ou [agende uma demonstração](/agendar) se ainda está a avaliar o sistema.",
          },
        ],
      },
      en: {
        title: "Getting started with the online booking system",
        description:
          "Learn how the Steevanz online booking system works for restaurants, salons and clinics, what to prepare and what to expect in the first few days.",
        blocks: [
          {
            type: "p",
            text: "The Steevanz online booking system lets your customers book a table, a service or an appointment at any time, with no phone calls and no back-and-forth messages. It is a **managed service**: our team sets everything up with you, publishes your booking link on your channels and supports you by WhatsApp or email whenever you need.",
          },
          { type: "h2", id: "what-it-is", text: "What it is and who it is for" },
          {
            type: "p",
            text: "The system adapts to your type of business. Availability works differently in a restaurant, a salon or a clinic, so we configure the right model from the start.",
          },
          {
            type: "table",
            head: ["Business type", "The customer books", "The system manages"],
            rows: [
              ["Restaurants and cafés", "A table for a number of guests", "Capacity per shift, tables, average dining time"],
              ["Salons and barbers", "A service with a staff member", "Duration of each service, each team member's diary, buffer times"],
              ["Clinics", "An appointment type with a practitioner", "Appointment types, each practitioner's diary, preparation time"],
            ],
          },
          { type: "h2", id: "how-it-works", text: "How it works day to day" },
          {
            type: "ol",
            items: [
              "The customer opens your booking link from your website, Instagram, Google Business Profile or a WhatsApp chat.",
              "They choose the service or party size, the date and an available time.",
              "They enter their name, contact details and, where relevant, notes (allergies, preferences, first visit).",
              "They receive an instant confirmation and, later, a reminder with links to cancel or reschedule.",
              "The booking appears in your dashboard and, if you enable sync, in Google Calendar or Outlook.",
            ],
          },
          {
            type: "callout",
            tone: "info",
            title: "Nothing to install",
            text: "The system runs in the browser on a computer, tablet or phone. There are no apps to install and no servers to maintain.",
          },
          { type: "h2", id: "what-to-prepare", text: "What to prepare before you start" },
          {
            type: "p",
            text: "To get set up quickly, gather this information before your first call with us:",
          },
          {
            type: "ul",
            items: [
              "**Opening hours** for each day, including breaks and closed days.",
              "**List of services or appointment types**, with duration and price (if you want to display it).",
              "**Team**: who serves customers, which services each person offers and their working hours.",
              "For restaurants: **capacity**, number and size of tables, and shifts (lunch, dinner).",
              "**Policies**: minimum notice for bookings, cancellation window and whether you want to take a deposit.",
              "Logo and brand colours, so the booking page looks like your business.",
            ],
          },
          { type: "h2", id: "first-days", text: "The first few days" },
          {
            type: "p",
            text: "Once your link is live, we recommend a week of closer follow-up. Check the bookings coming in, confirm that the times shown match reality and tell us what to adjust. Small tweaks, such as a longer buffer between services or closing a quiet shift, make a big difference.",
          },
          {
            type: "callout",
            tone: "tip",
            text: "Continue to [setup](/en/docs/online-booking-system/setup) for the launch steps, or [book a demo](/en/book-a-demo) if you are still evaluating the system.",
          },
        ],
      },
    },
    setup: {
      pt: {
        title: "Instalação do sistema de reservas",
        description:
          "Passo a passo para pôr o sistema de reservas a funcionar: configuração inicial, link de reserva, botão no site, Instagram, Google e WhatsApp.",
        blocks: [
          {
            type: "p",
            text: "A instalação é feita pela equipa da Steevanz em conjunto consigo. Nesta página explicamos cada fase, para saber o que esperar e o que lhe vamos pedir.",
          },
          { type: "h2", id: "passos-de-arranque", text: "Passos de arranque" },
          {
            type: "steps",
            items: [
              {
                title: "Reunião de levantamento",
                body: "Numa chamada curta revemos horários, serviços, equipa, lotação e políticas de cancelamento. Se já usa uma agenda em papel ou outro sistema, analisamos como migrar as reservas futuras.",
              },
              {
                title: "Configuração da agenda",
                body: "Criamos os serviços ou turnos, os perfis da equipa, os horários, os intervalos entre marcações e os dias de fecho já conhecidos.",
              },
              {
                title: "Personalização da página de reserva",
                body: "Aplicamos o seu logótipo e cores e escrevemos os textos de confirmação e de lembrete no tom do seu negócio.",
              },
              {
                title: "Testes consigo",
                body: "Fazemos reservas de teste, confirmamos que os lembretes chegam e que a reserva aparece no painel e no calendário sincronizado.",
              },
              {
                title: "Publicação do link",
                body: "Colocamos o link e o botão de reserva no site, no Instagram, no perfil do Google e nas respostas de WhatsApp.",
              },
              {
                title: "Acompanhamento",
                body: "Durante as primeiras semanas revemos as reservas consigo e ajustamos o que for preciso.",
              },
            ],
          },
          { type: "h2", id: "link-de-reserva", text: "O seu link de reserva" },
          {
            type: "p",
            text: "Cada negócio recebe um link próprio. É esse link que partilha em todos os canais. Pode também ter links diretos para um serviço ou profissional específico, úteis em campanhas ou na assinatura de email.",
          },
          {
            type: "code",
            label: "Formato do link",
            code: "https://reservas.steevanz.com/o-seu-negocio\nhttps://reservas.steevanz.com/o-seu-negocio?servico=corte-senhora\nhttps://reservas.steevanz.com/o-seu-negocio?profissional=ana",
          },
          {
            type: "callout",
            tone: "info",
            text: "Os endereços acima são ilustrativos. O link exato do seu negócio é-lhe enviado no fim da configuração.",
          },
          { type: "h2", id: "botao-no-site", text: "Botão ou agenda no seu site" },
          {
            type: "p",
            text: "Há duas formas de ligar o site ao sistema: um **botão** que abre a página de reserva, ou a **agenda incorporada** diretamente numa página, através de um iframe. Se o seu site foi feito por outra empresa, enviamos-lhe o código para passar a quem o gere.",
          },
          {
            type: "code",
            label: "Agenda incorporada (iframe)",
            code: "<iframe\n  src=\"https://reservas.steevanz.com/o-seu-negocio?embed=1\"\n  title=\"Reservar online\"\n  width=\"100%\"\n  height=\"720\"\n  style=\"border:0\"\n  loading=\"lazy\"\n></iframe>",
          },
          { type: "h2", id: "outros-canais", text: "Instagram, Google e WhatsApp" },
          {
            type: "ul",
            items: [
              "**Instagram**: colocamos o link na bio e, se quiser, como botão de ação no perfil.",
              "**Perfil da Empresa no Google**: adicionamos o link no campo de reservas ou marcações, para que o botão de reserva apareça na pesquisa e no Maps.",
              "**WhatsApp Business**: criamos uma resposta rápida com o link, para enviar em segundos quando alguém pede para marcar.",
              "**Material impresso**: um código QR para montra, balcão ou cartões, que abre o mesmo link.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Depois de instalado, veja a página de [configuração](/docs/sistema-reservas-online/configuracao) para afinar horários, lembretes e políticas.",
          },
        ],
      },
      en: {
        title: "Setting up the booking system",
        description:
          "Step-by-step guide to launching your booking system: initial setup, booking link, website button, Instagram, Google Business Profile and WhatsApp.",
        blocks: [
          {
            type: "p",
            text: "Setup is carried out by the Steevanz team together with you. This page explains each stage so you know what to expect and what we will ask you for.",
          },
          { type: "h2", id: "launch-steps", text: "Launch steps" },
          {
            type: "steps",
            items: [
              {
                title: "Discovery call",
                body: "In a short call we go through opening hours, services, team, capacity and cancellation policies. If you currently use a paper diary or another system, we look at how to bring over future bookings.",
              },
              {
                title: "Diary configuration",
                body: "We create the services or shifts, staff profiles, working hours, buffer times between appointments and any known closure dates.",
              },
              {
                title: "Booking page branding",
                body: "We apply your logo and colours and write the confirmation and reminder messages in your business's tone of voice.",
              },
              {
                title: "Testing with you",
                body: "We make test bookings and check that reminders arrive and that the booking shows up in the dashboard and in the synced calendar.",
              },
              {
                title: "Publishing the link",
                body: "We add the booking link and button to your website, Instagram, Google Business Profile and WhatsApp replies.",
              },
              {
                title: "Follow-up",
                body: "During the first few weeks we review bookings with you and make any adjustments needed.",
              },
            ],
          },
          { type: "h2", id: "booking-link", text: "Your booking link" },
          {
            type: "p",
            text: "Each business gets its own link, and that is the link you share on every channel. You can also have direct links to a specific service or staff member, which are handy for campaigns or your email signature.",
          },
          {
            type: "code",
            label: "Link format",
            code: "https://reservas.steevanz.com/your-business\nhttps://reservas.steevanz.com/your-business?servico=womens-cut\nhttps://reservas.steevanz.com/your-business?profissional=ana",
          },
          {
            type: "callout",
            tone: "info",
            text: "The addresses above are examples. You will receive your business's exact link at the end of setup.",
          },
          { type: "h2", id: "website-button", text: "Button or embedded diary on your website" },
          {
            type: "p",
            text: "There are two ways to connect your website: a **button** that opens the booking page, or the **embedded diary** placed directly on a page using an iframe. If another company manages your website, we send you the code to pass on to them.",
          },
          {
            type: "code",
            label: "Embedded diary (iframe)",
            code: "<iframe\n  src=\"https://reservas.steevanz.com/your-business?embed=1\"\n  title=\"Book online\"\n  width=\"100%\"\n  height=\"720\"\n  style=\"border:0\"\n  loading=\"lazy\"\n></iframe>",
          },
          { type: "h2", id: "other-channels", text: "Instagram, Google and WhatsApp" },
          {
            type: "ul",
            items: [
              "**Instagram**: we add the link to your bio and, if you like, as an action button on your profile.",
              "**Google Business Profile**: we add the link in the bookings or appointments field so a booking button appears in Search and Maps.",
              "**WhatsApp Business**: we create a quick reply containing the link, so you can send it in seconds when someone asks to book.",
              "**Printed material**: a QR code for your window, counter or business cards that opens the same link.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Once you are live, see [configuration](/en/docs/online-booking-system/configuration) to fine-tune hours, reminders and policies.",
          },
        ],
      },
    },
    configuration: {
      pt: {
        title: "Configuração do sistema de reservas",
        description:
          "Como configurar horários, fechos, serviços, intervalos, lembretes, sinal, política de cancelamento, equipa e sincronização com Google Calendar ou Outlook.",
        blocks: [
          {
            type: "p",
            text: "Tudo o que está nesta página pode ser alterado a qualquer momento. Algumas definições consegue mudar sozinho no painel; para as restantes, basta enviar-nos uma mensagem e tratamos disso.",
          },
          { type: "h2", id: "horarios-e-fechos", text: "Horários e fechos" },
          {
            type: "ul",
            items: [
              "**Horário semanal**: define os períodos em que se aceitam reservas, por dia da semana.",
              "**Fechos pontuais**: feriados, férias ou eventos privados bloqueiam o calendário nessas datas.",
              "**Antecedência mínima**: por exemplo, não aceitar reservas com menos de duas horas de antecedência.",
              "**Janela máxima**: até quantos dias ou semanas no futuro o cliente pode marcar.",
            ],
          },
          {
            type: "callout",
            tone: "warning",
            text: "Se fechar um dia que já tem reservas, essas reservas não são canceladas automaticamente. Contacte os clientes ou peça-nos ajuda para enviar uma mensagem a todos.",
          },
          { type: "h2", id: "servicos-e-lotacao", text: "Serviços, duração e lotação" },
          { type: "h3", id: "restaurantes", text: "Restaurantes" },
          {
            type: "p",
            text: "Configuramos turnos (por exemplo, almoço e jantar), a lotação por turno ou por horário de chegada, o tamanho mínimo e máximo de grupo para reserva online e a duração média de uma mesa. Grupos grandes podem ser encaminhados para contacto direto.",
          },
          { type: "h3", id: "saloes-e-clinicas", text: "Salões e clínicas" },
          {
            type: "p",
            text: "Cada serviço ou tipo de consulta tem uma duração e, opcionalmente, um **tempo de intervalo** antes ou depois (limpeza, preparação da sala, notas clínicas). Esse intervalo não fica visível para o cliente, mas impede marcações seguidas sem folga.",
          },
          { type: "h2", id: "lembretes", text: "Confirmações e lembretes" },
          {
            type: "table",
            head: ["Mensagem", "Quando é enviada", "Canais possíveis"],
            rows: [
              ["Confirmação", "Logo após a reserva", "Email, SMS, WhatsApp"],
              ["Lembrete", "Por exemplo, 24 horas antes (ajustável)", "SMS, WhatsApp, email"],
              ["Alteração", "Quando a reserva é reagendada", "Email, SMS, WhatsApp"],
              ["Cancelamento", "Quando o cliente ou o negócio cancela", "Email, SMS, WhatsApp"],
            ],
          },
          {
            type: "p",
            text: "Os lembretes incluem links para **cancelar** ou **reagendar**. Um cliente que cancela com antecedência liberta o lugar para outra pessoa, em vez de simplesmente não aparecer.",
          },
          { type: "h2", id: "sinal-e-cancelamento", text: "Sinal e política de cancelamento" },
          {
            type: "p",
            text: "O pedido de sinal é **opcional**. Pode aplicá-lo só a certos serviços, a grupos grandes ou a datas especiais. Defina também o prazo a partir do qual o cancelamento deixa de ser gratuito e escreva a política em linguagem simples; ela é mostrada ao cliente antes de confirmar.",
          },
          { type: "h2", id: "equipa-e-sincronizacao", text: "Equipa, acessos e sincronização" },
          {
            type: "ul",
            items: [
              "**Administrador**: vê e altera tudo, incluindo definições e acessos.",
              "**Gestor**: gere reservas de toda a equipa, sem mexer nas definições.",
              "**Profissional**: vê e gere a sua própria agenda.",
              "**Sincronização de calendário**: cada profissional pode ligar o seu Google Calendar ou Outlook. As reservas aparecem no calendário pessoal e os eventos pessoais marcados como ocupado bloqueiam horários no sistema.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Veja como gerir o dia a dia em [utilização](/docs/sistema-reservas-online/utilizacao).",
          },
        ],
      },
      en: {
        title: "Configuring the booking system",
        description:
          "How to configure opening hours, closures, services, buffer times, reminders, deposits, cancellation policy, staff roles and Google Calendar or Outlook sync.",
        blocks: [
          {
            type: "p",
            text: "Everything on this page can be changed at any time. Some settings you can change yourself in the dashboard; for the rest, just send us a message and we will handle it.",
          },
          { type: "h2", id: "hours-and-closures", text: "Opening hours and closures" },
          {
            type: "ul",
            items: [
              "**Weekly schedule**: the periods when bookings are accepted, for each day of the week.",
              "**One-off closures**: bank holidays, annual leave or private events block the calendar on those dates.",
              "**Minimum notice**: for example, no bookings less than two hours in advance.",
              "**Booking window**: how many days or weeks ahead customers can book.",
            ],
          },
          {
            type: "callout",
            tone: "warning",
            text: "If you close a day that already has bookings, those bookings are not cancelled automatically. Contact the customers or ask us to help send a message to all of them.",
          },
          { type: "h2", id: "services-and-capacity", text: "Services, duration and capacity" },
          { type: "h3", id: "restaurants", text: "Restaurants" },
          {
            type: "p",
            text: "We set up shifts (for example lunch and dinner), capacity per shift or per arrival time, the minimum and maximum party size for online bookings and the average table time. Large groups can be directed to contact you directly.",
          },
          { type: "h3", id: "salons-and-clinics", text: "Salons and clinics" },
          {
            type: "p",
            text: "Each service or appointment type has a duration and, optionally, a **buffer time** before or after (cleaning, room preparation, clinical notes). The buffer is not shown to the customer but prevents back-to-back bookings with no breathing space.",
          },
          { type: "h2", id: "reminders", text: "Confirmations and reminders" },
          {
            type: "table",
            head: ["Message", "When it is sent", "Possible channels"],
            rows: [
              ["Confirmation", "Straight after booking", "Email, SMS, WhatsApp"],
              ["Reminder", "For example 24 hours before (adjustable)", "SMS, WhatsApp, email"],
              ["Change", "When the booking is rescheduled", "Email, SMS, WhatsApp"],
              ["Cancellation", "When the customer or the business cancels", "Email, SMS, WhatsApp"],
            ],
          },
          {
            type: "p",
            text: "Reminders include links to **cancel** or **reschedule**. A customer who cancels in advance frees the slot for someone else instead of simply not turning up.",
          },
          { type: "h2", id: "deposits-and-cancellation", text: "Deposits and cancellation policy" },
          {
            type: "p",
            text: "Taking a deposit is **optional**. You can apply it only to certain services, to large groups or to special dates. Also set the point after which cancellation is no longer free, and write the policy in plain language; it is shown to the customer before they confirm.",
          },
          { type: "h2", id: "staff-and-sync", text: "Staff, access and calendar sync" },
          {
            type: "ul",
            items: [
              "**Administrator**: sees and changes everything, including settings and access.",
              "**Manager**: manages bookings for the whole team without changing settings.",
              "**Staff member**: sees and manages their own diary.",
              "**Calendar sync**: each staff member can connect Google Calendar or Outlook. Bookings appear in their personal calendar, and personal events marked as busy block times in the system.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "See how to manage the day to day in [usage](/en/docs/online-booking-system/usage).",
          },
        ],
      },
    },
    usage: {
      pt: {
        title: "Utilização diária do sistema de reservas",
        description:
          "Como gerir reservas no dia a dia: ver a agenda, adicionar reservas por telefone, reagendar, cancelar, registar faltas e bloquear horários.",
        blocks: [
          {
            type: "p",
            text: "Depois de configurado, o sistema pede pouco trabalho. Esta página reúne as tarefas mais comuns da equipa ao longo do dia.",
          },
          { type: "h2", id: "ver-a-agenda", text: "Ver a agenda do dia" },
          {
            type: "p",
            text: "No painel vê as reservas do dia por hora, por profissional ou por turno. Cada reserva mostra nome, contacto, número de pessoas ou serviço e as notas do cliente. Muitas equipas deixam o painel aberto num tablet na receção ou junto à entrada da sala.",
          },
          { type: "h2", id: "reservas-manuais", text: "Adicionar reservas por telefone ou ao balcão" },
          {
            type: "p",
            text: "Nem todos os clientes reservam online. Quando alguém liga ou pede ao balcão, crie a reserva no painel. Assim a disponibilidade fica sempre correta e o cliente recebe os mesmos lembretes que quem reservou online.",
          },
          {
            type: "callout",
            tone: "warning",
            text: "Evite apontar reservas em papel em paralelo. Se um horário for ocupado fora do sistema, pode ser reservado online por outra pessoa.",
          },
          { type: "h2", id: "alteracoes", text: "Reagendar e cancelar" },
          {
            type: "ul",
            items: [
              "O cliente pode reagendar ou cancelar sozinho através do link na confirmação ou no lembrete, dentro do prazo definido.",
              "A equipa pode mover uma reserva para outro horário ou profissional no painel; o cliente é notificado da alteração.",
              "Ao cancelar do lado do negócio, escreva um motivo curto; ele é incluído na mensagem ao cliente.",
            ],
          },
          { type: "h2", id: "chegadas-e-faltas", text: "Chegadas, faltas e atrasos" },
          {
            type: "p",
            text: "Marque cada reserva como **chegou**, **não compareceu** ou **cancelada**. Este registo permite perceber quais os dias e horários com mais faltas e decidir, com dados reais, se faz sentido pedir sinal ou antecipar o lembrete.",
          },
          { type: "h2", id: "bloquear-horarios", text: "Bloquear horários pontuais" },
          {
            type: "ol",
            items: [
              "Identifique o período a bloquear (uma reunião, uma formação, uma saída mais cedo).",
              "Crie um bloqueio no painel para o profissional ou para a sala inteira.",
              "Confirme que não há reservas já marcadas nesse período; se houver, reagende-as antes.",
            ],
          },
          { type: "h2", id: "rotina-semanal", text: "Rotina semanal recomendada" },
          {
            type: "p",
            text: "Uma revisão curta por semana evita a maioria dos problemas. Reserve dez minutos, por exemplo à segunda-feira de manhã, para:",
          },
          {
            type: "ul",
            items: [
              "Confirmar os horários da equipa para a semana e registar folgas ou ausências.",
              "Verificar feriados e fechos das próximas semanas e bloqueá-los com antecedência.",
              "Rever o registo de faltas da semana anterior e ver se se concentram em algum dia ou serviço.",
              "Ler as notas deixadas pelos clientes, que muitas vezes revelam pedidos repetidos, como cadeira de bebé ou mesa na esplanada.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Algo não está a funcionar como esperado? Consulte a [resolução de problemas](/docs/sistema-reservas-online/resolucao-problemas) ou [fale connosco](/contacto).",
          },
        ],
      },
      en: {
        title: "Using the booking system day to day",
        description:
          "How to manage bookings day to day: view the diary, add phone bookings, reschedule, cancel, record no-shows and block out times.",
        blocks: [
          {
            type: "p",
            text: "Once configured, the system needs very little work. This page covers the tasks your team will do most often throughout the day.",
          },
          { type: "h2", id: "view-the-diary", text: "Viewing today's diary" },
          {
            type: "p",
            text: "In the dashboard you can see the day's bookings by time, by staff member or by shift. Each booking shows the name, contact details, party size or service and any customer notes. Many teams keep the dashboard open on a tablet at reception or by the host stand.",
          },
          { type: "h2", id: "manual-bookings", text: "Adding phone and walk-in bookings" },
          {
            type: "p",
            text: "Not every customer books online. When someone phones or asks at the counter, create the booking in the dashboard. That way availability is always accurate and the customer receives the same reminders as online bookers.",
          },
          {
            type: "callout",
            tone: "warning",
            text: "Avoid keeping a paper diary alongside the system. If a slot is taken outside the system, someone else can book it online.",
          },
          { type: "h2", id: "changes", text: "Rescheduling and cancelling" },
          {
            type: "ul",
            items: [
              "Customers can reschedule or cancel themselves via the link in their confirmation or reminder, within the window you set.",
              "Your team can move a booking to another time or staff member in the dashboard; the customer is notified of the change.",
              "When cancelling on the business side, add a short reason; it is included in the message to the customer.",
            ],
          },
          { type: "h2", id: "arrivals-and-no-shows", text: "Arrivals, no-shows and late arrivals" },
          {
            type: "p",
            text: "Mark each booking as **arrived**, **no-show** or **cancelled**. This record shows you which days and times have the most no-shows, so you can decide with real data whether to take deposits or send reminders earlier.",
          },
          { type: "h2", id: "block-out-times", text: "Blocking out one-off times" },
          {
            type: "ol",
            items: [
              "Identify the period to block (a meeting, a training session, leaving early).",
              "Create a block in the dashboard for the staff member or the whole venue.",
              "Check there are no existing bookings in that period; if there are, reschedule them first.",
            ],
          },
          { type: "h2", id: "weekly-routine", text: "Recommended weekly routine" },
          {
            type: "p",
            text: "A short weekly review prevents most problems. Set aside ten minutes, for example on Monday morning, to:",
          },
          {
            type: "ul",
            items: [
              "Confirm staff hours for the week and record days off or absences.",
              "Check bank holidays and closures for the coming weeks and block them in advance.",
              "Review last week's no-shows and see whether they cluster on a particular day or service.",
              "Read customer notes, which often reveal recurring requests such as a high chair or a terrace table.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Something not working as expected? See [troubleshooting](/en/docs/online-booking-system/troubleshooting) or [contact us](/en/contact).",
          },
        ],
      },
    },
    troubleshooting: {
      pt: {
        title: "Resolução de problemas do sistema de reservas",
        description:
          "Soluções para os problemas mais comuns: horários que não aparecem, lembretes que não chegam, reservas duplicadas e sincronização de calendário.",
        blocks: [
          {
            type: "p",
            text: "A maioria das situações resolve-se em poucos minutos. Se não encontrar a resposta aqui, envie-nos uma mensagem por WhatsApp ou email com o nome do cliente, a data da reserva e uma captura de ecrã, se possível.",
          },
          { type: "h2", id: "sem-horarios", text: "O cliente diz que não há horários disponíveis" },
          {
            type: "ul",
            items: [
              "Confirme que o dia não tem um fecho pontual ou um bloqueio esquecido.",
              "Verifique a **antecedência mínima** e a **janela máxima**: o cliente pode estar a tentar reservar demasiado em cima da hora ou demasiado longe.",
              "Em salões e clínicas, veja se o profissional escolhido tem horário nesse dia e se o calendário sincronizado não tem eventos marcados como ocupado.",
              "Em restaurantes, confirme se o grupo excede o tamanho máximo permitido online.",
            ],
          },
          { type: "h2", id: "lembretes-nao-chegam", text: "Os lembretes não chegam" },
          {
            type: "ol",
            items: [
              "Veja no painel se o contacto do cliente está correto, incluindo o indicativo do país no telemóvel.",
              "Peça ao cliente para verificar a pasta de spam ou de promoções, no caso do email.",
              "Confirme se o cliente não pediu para deixar de receber mensagens.",
              "Se o problema afetar vários clientes ao mesmo tempo, contacte-nos de imediato para verificarmos o envio.",
            ],
          },
          { type: "h2", id: "reservas-duplicadas", text: "Reservas duplicadas ou sobrepostas" },
          {
            type: "p",
            text: "Normalmente resultam de reservas registadas fora do sistema ou de um cliente que reservou duas vezes por engano. Cancele a duplicada no painel (o cliente é avisado) e, se as sobreposições se repetirem, reveja com a nossa equipa a lotação e os intervalos configurados.",
          },
          { type: "h2", id: "calendario-nao-sincroniza", text: "O calendário não sincroniza" },
          {
            type: "p",
            text: "A ligação ao Google Calendar ou Outlook pode expirar se a palavra-passe da conta mudar ou se o acesso for revogado. Nesse caso, basta voltar a ligar a conta. As alterações podem demorar alguns minutos a aparecer.",
          },
          {
            type: "callout",
            tone: "info",
            text: "Enquanto a sincronização está em baixo, o sistema de reservas continua a funcionar normalmente. Apenas o calendário externo deixa de ser atualizado.",
          },
          { type: "h2", id: "botao-nao-aparece", text: "O botão ou a agenda não aparecem no site" },
          {
            type: "p",
            text: "Confirme que o código foi colado sem alterações e que o site permite incorporar iframes. Alguns construtores de sites exigem um bloco próprio de HTML. Envie-nos o endereço da página e verificamos consigo.",
          },
          {
            type: "callout",
            tone: "tip",
            text: "Veja também as [perguntas frequentes](/docs/sistema-reservas-online/perguntas-frequentes) ou [contacte-nos](/contacto).",
          },
        ],
      },
      en: {
        title: "Booking system troubleshooting",
        description:
          "Fixes for the most common issues: times not showing, reminders not arriving, duplicate bookings, calendar sync and the website button not appearing.",
        blocks: [
          {
            type: "p",
            text: "Most issues can be sorted out in a few minutes. If you cannot find the answer here, message us on WhatsApp or by email with the customer's name, the booking date and a screenshot if possible.",
          },
          { type: "h2", id: "no-times", text: "A customer says there are no times available" },
          {
            type: "ul",
            items: [
              "Check that the day does not have a one-off closure or a forgotten block.",
              "Check the **minimum notice** and **booking window**: the customer may be trying to book too close to the time or too far ahead.",
              "In salons and clinics, check that the chosen staff member works that day and that their synced calendar has no events marked as busy.",
              "In restaurants, check whether the party exceeds the maximum size allowed online.",
            ],
          },
          { type: "h2", id: "reminders-not-arriving", text: "Reminders are not arriving" },
          {
            type: "ol",
            items: [
              "Check in the dashboard that the customer's contact details are correct, including the country code on their mobile number.",
              "For email, ask the customer to check their spam or promotions folder.",
              "Check that the customer has not opted out of messages.",
              "If the problem affects several customers at once, contact us straight away so we can check delivery.",
            ],
          },
          { type: "h2", id: "duplicate-bookings", text: "Duplicate or overlapping bookings" },
          {
            type: "p",
            text: "These usually come from bookings recorded outside the system or a customer booking twice by mistake. Cancel the duplicate in the dashboard (the customer is notified) and, if overlaps keep happening, review the configured capacity and buffer times with our team.",
          },
          { type: "h2", id: "calendar-not-syncing", text: "The calendar is not syncing" },
          {
            type: "p",
            text: "The connection to Google Calendar or Outlook can expire if the account password changes or access is revoked. If so, simply reconnect the account. Changes can take a few minutes to appear.",
          },
          {
            type: "callout",
            tone: "info",
            text: "While sync is down, the booking system keeps working normally. Only the external calendar stops being updated.",
          },
          { type: "h2", id: "button-not-showing", text: "The button or diary is not showing on the website" },
          {
            type: "p",
            text: "Check that the code was pasted without changes and that your website allows iframes. Some website builders require a dedicated HTML block. Send us the page address and we will check it with you.",
          },
          {
            type: "callout",
            tone: "tip",
            text: "See also the [FAQ](/en/docs/online-booking-system/faq) or [contact us](/en/contact).",
          },
        ],
      },
    },
    faq: {
      pt: {
        title: "Perguntas frequentes sobre o sistema de reservas",
        description:
          "Respostas às dúvidas mais comuns sobre o sistema de reservas online da Steevanz: custos para o cliente, faltas, sinal, dados pessoais e canais.",
        blocks: [
          { type: "h2", id: "perguntas", text: "Perguntas e respostas" },
          {
            type: "faq",
            items: [
              {
                q: "Os meus clientes precisam de criar conta para reservar?",
                a: "Não. Basta indicar nome e contacto. Quanto menos passos, mais pessoas concluem a reserva.",
              },
              {
                q: "Posso continuar a aceitar reservas por telefone?",
                a: "Sim. Registe-as no painel para que a disponibilidade fique correta e o cliente receba os mesmos lembretes.",
              },
              {
                q: "Os lembretes ajudam mesmo a reduzir faltas?",
                a: "Os lembretes dão ao cliente uma forma fácil de cancelar ou reagendar em vez de simplesmente faltar. O resultado depende do negócio, por isso recomendamos acompanhar o registo de faltas no painel.",
              },
              {
                q: "Sou obrigado a pedir sinal?",
                a: "Não. O sinal é opcional e pode ser aplicado só a certos serviços, grupos grandes ou datas especiais.",
              },
              {
                q: "Funciona com o Google Calendar e o Outlook?",
                a: "Sim. Cada profissional pode sincronizar a sua agenda, para ver as reservas no calendário pessoal e bloquear horários ocupados.",
              },
              {
                q: "Posso pôr o botão de reserva no Google e no Instagram?",
                a: "Sim. Na instalação colocamos o link no Perfil da Empresa no Google, na bio do Instagram e numa resposta rápida de WhatsApp. Veja os detalhes na [instalação](/docs/sistema-reservas-online/instalacao).",
              },
              {
                q: "E se tiver vários profissionais ou várias salas?",
                a: "Cada profissional tem a sua agenda, serviços e horários. O cliente pode escolher uma pessoa específica ou o primeiro disponível.",
              },
              {
                q: "Como são tratados os dados dos clientes?",
                a: "Os dados são usados apenas para gerir a reserva e enviar as mensagens associadas, de acordo com o RGPD. O seu negócio continua a ser o responsável pelo tratamento e a Steevanz atua como subcontratante.",
              },
              {
                q: "Posso mudar horários e serviços depois de configurado?",
                a: "Sempre. Algumas alterações faz no painel; para as restantes, envie-nos uma mensagem e tratamos disso.",
              },
              {
                q: "Como vejo o sistema a funcionar antes de decidir?",
                a: "[Agende uma demonstração](/agendar) e mostramos-lhe o sistema configurado para um negócio como o seu.",
              },
            ],
          },
          { type: "h2", id: "documentacao-relacionada", text: "Documentação relacionada" },
          {
            type: "ul",
            items: [
              "[Primeiros passos](/docs/sistema-reservas-online/primeiros-passos): o que é o sistema e o que preparar.",
              "[Instalação](/docs/sistema-reservas-online/instalacao): link de reserva, botão no site, Google, Instagram e WhatsApp.",
              "[Configuração](/docs/sistema-reservas-online/configuracao): horários, lembretes, sinal, equipa e calendários.",
              "[Utilização](/docs/sistema-reservas-online/utilizacao): gestão diária de reservas, faltas e bloqueios.",
            ],
          },
          { type: "h2", id: "mais-ajuda", text: "Ainda tem dúvidas?" },
          {
            type: "p",
            text: "Consulte a [resolução de problemas](/docs/sistema-reservas-online/resolucao-problemas), veja a [página do produto](/produtos/sistema-reservas-online) ou [fale connosco](/contacto). Respondemos por WhatsApp ou email.",
          },
        ],
      },
      en: {
        title: "Booking system FAQ",
        description:
          "Answers to common questions about the Steevanz online booking system: customer accounts, no-shows, deposits, personal data, calendars and channels.",
        blocks: [
          { type: "h2", id: "questions", text: "Questions and answers" },
          {
            type: "faq",
            items: [
              {
                q: "Do my customers need to create an account to book?",
                a: "No. They only need to enter their name and contact details. The fewer the steps, the more people complete their booking.",
              },
              {
                q: "Can I still take bookings by phone?",
                a: "Yes. Record them in the dashboard so availability stays accurate and the customer receives the same reminders.",
              },
              {
                q: "Do reminders really help reduce no-shows?",
                a: "Reminders give customers an easy way to cancel or reschedule instead of simply not turning up. Results vary by business, so we recommend keeping an eye on the no-show record in the dashboard.",
              },
              {
                q: "Do I have to take a deposit?",
                a: "No. Deposits are optional and can be applied only to certain services, large groups or special dates.",
              },
              {
                q: "Does it work with Google Calendar and Outlook?",
                a: "Yes. Each staff member can sync their calendar to see bookings in their personal calendar and block out busy times.",
              },
              {
                q: "Can I add the booking button to Google and Instagram?",
                a: "Yes. During setup we add the link to your Google Business Profile, your Instagram bio and a WhatsApp quick reply. See [setup](/en/docs/online-booking-system/setup) for details.",
              },
              {
                q: "What if I have several staff members or rooms?",
                a: "Each staff member has their own diary, services and hours. Customers can choose a specific person or the first available.",
              },
              {
                q: "How is customer data handled?",
                a: "Data is used only to manage the booking and send related messages, in line with GDPR. Your business remains the data controller and Steevanz acts as a processor.",
              },
              {
                q: "Can I change hours and services after setup?",
                a: "Any time. Some changes you can make in the dashboard; for the rest, send us a message and we will take care of it.",
              },
              {
                q: "How can I see the system working before I decide?",
                a: "[Book a demo](/en/book-a-demo) and we will show you the system set up for a business like yours.",
              },
            ],
          },
          { type: "h2", id: "related-docs", text: "Related documentation" },
          {
            type: "ul",
            items: [
              "[Getting started](/en/docs/online-booking-system/getting-started): what the system is and what to prepare.",
              "[Setup](/en/docs/online-booking-system/setup): booking link, website button, Google, Instagram and WhatsApp.",
              "[Configuration](/en/docs/online-booking-system/configuration): hours, reminders, deposits, staff and calendars.",
              "[Usage](/en/docs/online-booking-system/usage): day-to-day booking management, no-shows and blocked times.",
            ],
          },
          { type: "h2", id: "more-help", text: "Still have questions?" },
          {
            type: "p",
            text: "See [troubleshooting](/en/docs/online-booking-system/troubleshooting), visit the [product page](/en/products/online-booking-system) or [contact us](/en/contact). We reply by WhatsApp or email.",
          },
        ],
      },
    },
  },
};

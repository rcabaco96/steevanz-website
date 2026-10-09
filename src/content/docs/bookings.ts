import type { ProductDocs } from "../types";

export const docs: ProductDocs = {
  productId: "bookings",
  pages: {
    "getting-started": {
      pt: {
        title: "Primeiros passos com o sistema de reservas online",
        description: "Como funcionam as reservas online da Steevanz: o cliente reserva pelo link, a qualquer hora, e a sua equipa vê tudo numa só agenda.",
        blocks: [
          {
            type: "p",
            text: "Os clientes reservam pelo seu link (Instagram, site, perfil no Google), a qualquer hora, sem ligar. Recebem a confirmação e um lembrete por email, e a sua equipa vê as reservas do dia no telemóvel ou no computador.",
          },
          { type: "h2", id: "como-funciona", text: "Como funciona" },
          {
            type: "ol",
            items: [
              "O cliente abre o link e escolhe o que quer reservar.",
              "Restaurantes: diz quantas pessoas vêm. Outros negócios: escolhe o serviço e, se quiser, com quem (ou «qualquer um»).",
              "Escolhe o dia e uma das horas livres e confirma com o nome e o contacto.",
              "Recebe a confirmação por email e um lembrete na véspera, com opção de alterar ou cancelar.",
              "A reserva aparece na sua agenda. A equipa marca «Chegou» quando o cliente chega.",
            ],
          },
          { type: "h2", id: "dois-modelos", text: "Restaurantes e serviços" },
          {
            type: "ul",
            items: [
              "**Restaurantes, cafés e bares:** reservas por número de pessoas. Cada turno (almoço, jantar) tem uma lotação; quando as reservas a enchem, esse turno fica cheio.",
              "**Barbearias, cabeleireiros, clínicas, espaços desportivos e outros:** serviços com a sua duração, feitos por pessoas ou espaços (barbeiros, médicos, campos) que atendem um cliente de cada vez.",
            ],
          },
          { type: "h2", id: "o-que-inclui", text: "O que inclui" },
          {
            type: "ul",
            items: [
              "Página de reservas com o nome e os serviços do seu negócio, sem app nem conta para o cliente.",
              "Agenda para a equipa, com reservas por telefone e alterações (e «Estamos com atraso» nas marcações de serviços).",
              "Confirmação e lembrete por email.",
              "Calendário para ver as reservas no telemóvel (Google Calendar, iPhone, Outlook).",
              "Configuração pela equipa da Steevanz e suporte por WhatsApp e email.",
            ],
          },
          { type: "p", text: "Próximo passo: veja como fazemos a [instalação](/docs/sistema-reservas-online/instalacao)." },
        ],
      },
      en: {
        title: "Getting started with the online booking system",
        description: "How Steevanz online bookings work: customers book through your link, at any hour, and your team sees everything in one diary.",
        blocks: [
          {
            type: "p",
            text: "Customers book through your link (Instagram, website, Google profile), at any hour, without calling. They get a confirmation and a reminder by email, and your team sees the day's bookings on phone or computer.",
          },
          { type: "h2", id: "how-it-works", text: "How it works" },
          {
            type: "ol",
            items: [
              "The customer opens the link and chooses what to book.",
              "Restaurants: they say how many people are coming. Other businesses: they choose the service and, if they like, with whom (or «anyone»).",
              "They pick the day and one of the free times and confirm with their name and contact.",
              "They get a confirmation by email and a reminder the day before, with an option to change or cancel.",
              "The booking appears in your diary. Your team marks «Arrived» when the customer comes in.",
            ],
          },
          { type: "h2", id: "two-models", text: "Restaurants and services" },
          {
            type: "ul",
            items: [
              "**Restaurants, cafés and bars:** bookings by number of people. Each sitting (lunch, dinner) has a capacity; when bookings fill it, that sitting is full.",
              "**Barbers, salons, clinics, sports venues and others:** services with their own duration, done by people or places (barbers, doctors, pitches) who see one customer at a time.",
            ],
          },
          { type: "h2", id: "whats-included", text: "What's included" },
          {
            type: "ul",
            items: [
              "Booking page with your business name and services, no app or account for customers.",
              "Diary for your team, with phone bookings and changes (and «We're running late» for service appointments).",
              "Confirmation and reminder by email.",
              "Calendar to see bookings on your phone (Google Calendar, iPhone, Outlook).",
              "Set up by the Steevanz team, with support by WhatsApp and email.",
            ],
          },
          { type: "p", text: "Next step: see how we handle the [setup](/en/docs/online-booking-system/setup)." },
        ],
      },
    },
    setup: {
      pt: {
        title: "Instalação do sistema de reservas online",
        description: "Como a Steevanz põe as reservas a funcionar: tipo de negócio, serviços ou lotação, horário, regras e o link nos seus canais.",
        blocks: [
          { type: "p", text: "Tratamos da instalação consigo. Normalmente fica pronta em poucos dias úteis." },
          {
            type: "steps",
            items: [
              { title: "Tipo de negócio", body: "Criamos o seu espaço com o tipo de negócio certo. Os serviços habituais desse tipo já vêm criados (ex.: barbearia: corte, barba, corte e barba)." },
              { title: "Serviços ou lotação", body: "Restaurantes: lotação por turno e máximo de pessoas por reserva. Outros negócios: ajustamos os serviços, as durações e preços, e quem faz cada um." },
              { title: "Horário", body: "O horário do espaço, os dias fechados e, se for preciso, o horário próprio de cada pessoa ou espaço." },
              { title: "Regras", body: "Antecedência mínima, até quantos dias se pode reservar, tolerância de atraso e até quando o cliente pode cancelar." },
              { title: "O link nos seus canais", body: "Colocamos o link de reserva no Instagram, no site e no seu perfil de empresa no Google, e entregamos um cartaz com QR code." },
            ],
          },
          { type: "callout", tone: "info", text: "Depois, pode mudar tudo quando quiser: veja a [configuração](/docs/sistema-reservas-online/configuracao)." },
        ],
      },
      en: {
        title: "Setting up the online booking system",
        description: "How Steevanz gets bookings running: business type, services or capacity, opening hours, rules and the link on your channels.",
        blocks: [
          { type: "p", text: "We handle the setup with you. It is usually ready within a few working days." },
          {
            type: "steps",
            items: [
              { title: "Business type", body: "We create your space with the right business type. Its usual services come ready (e.g. barber: cut, beard, cut and beard)." },
              { title: "Services or capacity", body: "Restaurants: capacity per sitting and the most people per booking. Other businesses: we adjust the services, durations and prices, and who does each one." },
              { title: "Opening hours", body: "Your opening hours, closed days and, if needed, each person's or place's own hours." },
              { title: "Rules", body: "Minimum notice, how many days ahead customers can book, lateness allowance and until when customers can cancel." },
              { title: "The link on your channels", body: "We add the booking link to your Instagram, website and Google Business Profile, and deliver a poster with a QR code." },
            ],
          },
          { type: "callout", tone: "info", text: "Afterwards you can change everything whenever you like: see [configuration](/en/docs/online-booking-system/configuration)." },
        ],
      },
    },
    configuration: {
      pt: {
        title: "Configuração do sistema de reservas online",
        description: "Lotação por turno, serviços, pessoas e espaços, horário, regras para o cliente, avisos e dias ou horas fechados.",
        blocks: [
          { type: "h2", id: "lotacao", text: "Restaurantes: lotação" },
          {
            type: "p",
            text: "No separador **Lotação**: quantas pessoas aceita com reserva em cada turno e o máximo de pessoas por reserva online. Os turnos são os períodos do horário (ex.: almoço 12:00–15:00, jantar 19:00–23:00). Várias reservas podem ser para a mesma hora; o turno só fica cheio quando as reservas somam a lotação. A conta é feita ao turno inteiro, sem tentar adivinhar quem sai mais cedo: se costuma ter rotação de mesas, ponha uma lotação um pouco acima dos lugares. Quem chega sem reserva entra se houver lugar, como sempre.",
          },
          { type: "h2", id: "servicos", text: "Outros negócios: serviços, pessoas e espaços" },
          {
            type: "ul",
            items: [
              "No separador **Serviços**: nome, preço (opcional), duração e um intervalo depois (limpeza, preparação) que o cliente não vê.",
              "**Pessoas e espaços:** barbeiros, médicos, salas, campos. Cada um atende um cliente de cada vez e pode ter horário próprio.",
              "Em cada serviço escolhe quem o faz. Sem escolha, qualquer um. O cliente pode escolher «qualquer um» e fica com quem estiver menos ocupado nesse dia.",
            ],
          },
          { type: "h2", id: "regras", text: "Regras para o cliente" },
          {
            type: "table",
            head: ["Definição", "Para quê"],
            rows: [
              ["Antecedência mínima", "Até quando antes da hora se pode reservar online."],
              ["Até quantos dias à frente", "Quanto para a frente a agenda está aberta."],
              ["Tolerância de atraso", "Quanto tempo espera por um cliente atrasado. O cliente vê-a ao reservar."],
              ["Cancelar ou alterar online até", "Depois disso, o cliente tem de contactar o negócio."],
              ["Última reserva (restaurantes)", "Quanto antes de fechar é a última hora para reservar."],
            ],
          },
          { type: "h2", id: "avisos", text: "Avisos e mensagens" },
          {
            type: "ul",
            items: [
              "Email ao dono a cada reserva nova ou cancelada (opcional).",
              "Nota na confirmação e regras de cancelamento, mostradas ao cliente.",
              "O cliente recebe a confirmação e um lembrete na véspera por email.",
            ],
          },
          { type: "h2", id: "fechar", text: "Dias e horas fechados" },
          { type: "p", text: "Dias inteiros em «Dias fechados». Para um evento, uma folga ou um campo em manutenção, use «Fechar reservas num dia ou horário», para todos ou para uma pessoa ou espaço." },
        ],
      },
      en: {
        title: "Configuring the online booking system",
        description: "Capacity per sitting, services, people and places, opening hours, customer rules, notifications and closed days or hours.",
        blocks: [
          { type: "h2", id: "capacity", text: "Restaurants: capacity" },
          {
            type: "p",
            text: "In the **Capacity** tab: how many people you accept with a booking per sitting and the most people per online booking. Sittings are your opening periods (e.g. lunch 12:00–15:00, dinner 19:00–23:00). Several bookings can share a time; a sitting is only full when bookings add up to its capacity. It counts the whole sitting, without guessing who leaves early: if tables usually turn over, set the capacity a little above your seats. Walk-ins still get a table when there is room.",
          },
          { type: "h2", id: "services", text: "Other businesses: services, people and places" },
          {
            type: "ul",
            items: [
              "In the **Services** tab: name, price (optional), duration and a gap afterwards (cleaning, preparation) customers don't see.",
              "**People and places:** barbers, doctors, rooms, pitches. Each sees one customer at a time and can have their own hours.",
              "In each service, choose who does it. With no choice, anyone can. Customers can pick «anyone» and get whoever is least busy that day.",
            ],
          },
          { type: "h2", id: "rules", text: "Customer rules" },
          {
            type: "table",
            head: ["Setting", "What it's for"],
            rows: [
              ["Minimum notice", "How close to the time customers can still book online."],
              ["How many days ahead", "How far ahead the diary is open."],
              ["Lateness allowance", "How long you wait for a late customer. Customers see it when booking."],
              ["Cancel or change online until", "After that, customers have to contact the business."],
              ["Last booking (restaurants)", "How long before closing the last booking time is."],
            ],
          },
          { type: "h2", id: "notifications", text: "Notifications and messages" },
          {
            type: "ul",
            items: [
              "Email to the owner for every new or cancelled booking (optional).",
              "Confirmation note and cancellation rules, shown to the customer.",
              "Customers get a confirmation and a reminder the day before by email.",
            ],
          },
          { type: "h2", id: "closing", text: "Closed days and hours" },
          { type: "p", text: "Whole days go in «Closed days». For an event, a day off or a pitch under maintenance, use «Close bookings on a day or time», for everyone or for one person or place." },
        ],
      },
    },
    usage: {
      pt: {
        title: "Utilização diária das reservas",
        description: "Como gerir as reservas no dia a dia: a agenda, reservas por telefone, alterações, chegadas, faltas e atrasos.",
        blocks: [
          { type: "p", text: "No separador **Reservas** vê os dias da semana com quantas reservas tem cada um e, no dia escolhido, a ocupação de cada turno e a lista «Por chegar». A página atualiza-se sozinha." },
          {
            type: "steps",
            items: [
              { title: "Reserva por telefone", body: "«Nova reserva»: escolha o dia e as pessoas (ou o serviço), e aparecem só as horas livres. Escolha uma, escreva o nome e guarde." },
              { title: "Alterar", body: "No «⋯» da reserva, «Alterar reserva»: muda a hora, as pessoas, o serviço ou o contacto. O link do cliente mantém-se e pode avisá-lo por email." },
              { title: "Chegou ou não veio", body: "«Chegou» quando o cliente chega; «Não veio» no «⋯». Passada a tolerância, a reserva aparece como «Atrasado»." },
              { title: "Cancelar", body: "No «⋯», «Cancelar reserva». Se o cliente deixou email, recebe um aviso." },
            ],
          },
          { type: "h2", id: "atraso", text: "Estamos com atraso" },
          {
            type: "p",
            text: "Só em negócios com marcações de serviços (barbearias, clínicas…), onde um atraso passa para as marcações seguintes. Num dia complicado, em «Estamos com atraso» escolha +10, +15, +30 ou +45 minutos, para todos ou para uma pessoa ou espaço. Os clientes das próximas 3 horas com email recebem a hora prevista, e todos veem o aviso na página da reserva. Nenhuma reserva muda de hora.",
          },
          { type: "callout", tone: "tip", text: "Para ver as reservas no calendário do telemóvel, use o endereço em **Partilhar**." },
        ],
      },
      en: {
        title: "Using bookings day to day",
        description: "How to run bookings every day: the diary, phone bookings, changes, arrivals, no-shows and delays.",
        blocks: [
          { type: "p", text: "In the **Bookings** tab you see the days of the week with how many bookings each has and, for the chosen day, how full each sitting is and the «To arrive» list. The page updates by itself." },
          {
            type: "steps",
            items: [
              { title: "Phone booking", body: "«New booking»: choose the day and the people (or the service), and only free times appear. Pick one, type the name and save." },
              { title: "Change", body: "In the booking's «⋯», «Change booking»: change the time, people, service or contact. The customer's link stays the same and you can email them." },
              { title: "Arrived or no-show", body: "«Arrived» when the customer comes in; «No-show» in the «⋯». Past the lateness allowance, the booking shows as «Late»." },
              { title: "Cancel", body: "In the «⋯», «Cancel booking». If the customer left an email, they are told." },
            ],
          },
          { type: "h2", id: "delay", text: "We're running late" },
          {
            type: "p",
            text: "Only for businesses with service appointments (barbers, clinics…), where one delay pushes the next appointments. On a hard day, in «We're running late» pick +10, +15, +30 or +45 minutes, for everyone or for one person or place. Customers in the next 3 hours with an email get the expected time, and everyone sees the notice on their booking page. No booking changes time.",
          },
          { type: "callout", tone: "tip", text: "To see bookings in your phone's calendar, use the address in **Share**." },
        ],
      },
    },
    troubleshooting: {
      pt: {
        title: "Resolução de problemas das reservas",
        description: "Soluções para problemas comuns: não aparecem horas livres, o cliente não recebeu o email e o calendário não atualiza.",
        blocks: [
          { type: "h2", id: "sem-horas", text: "Não aparecem horas livres" },
          {
            type: "ol",
            items: [
              "Confirme que as reservas online estão ligadas em Definições e que há horário para esse dia.",
              "Restaurantes: o turno pode estar cheio. Veja a ocupação no separador Reservas.",
              "Serviços: confirme que alguém faz o serviço e trabalha nesse dia (horário próprio).",
              "A antecedência mínima ou um horário fechado também tiram horas.",
            ],
          },
          { type: "h2", id: "email", text: "O cliente não recebeu o email" },
          { type: "p", text: "Confirme o email na reserva e peça ao cliente para ver no spam. A página da reserva tem sempre a informação toda." },
          { type: "h2", id: "calendario", text: "O calendário do telemóvel não atualiza" },
          { type: "p", text: "Os calendários subscritos atualizam de tempos a tempos (o Google pode demorar algumas horas). A agenda no separador Reservas está sempre atualizada." },
        ],
      },
      en: {
        title: "Bookings troubleshooting",
        description: "Fixes for common issues: no free times showing, the customer didn't get the email and the calendar not updating.",
        blocks: [
          { type: "h2", id: "no-times", text: "No free times show up" },
          {
            type: "ol",
            items: [
              "Check online bookings are on in Settings and that there are opening hours for that day.",
              "Restaurants: the sitting may be full. Check how full it is in the Bookings tab.",
              "Services: check someone does the service and works that day (own hours).",
              "Minimum notice or a closed time also remove times.",
            ],
          },
          { type: "h2", id: "email", text: "The customer didn't get the email" },
          { type: "p", text: "Check the email on the booking and ask the customer to look in spam. The booking page always has all the details." },
          { type: "h2", id: "calendar", text: "The phone calendar doesn't update" },
          { type: "p", text: "Subscribed calendars refresh from time to time (Google can take a few hours). The diary in the Bookings tab is always up to date." },
        ],
      },
    },
    faq: {
      pt: {
        title: "Perguntas frequentes sobre o sistema de reservas online",
        description: "Respostas às dúvidas mais comuns: contas e apps, lembretes, reservas por telefone, lotação, pagamentos e dados.",
        blocks: [
          { type: "h2", id: "perguntas", text: "Perguntas e respostas" },
          {
            type: "faq",
            items: [
              { q: "Os clientes precisam de conta ou de app?", a: "Não. Reservam numa página web com o nome e o contacto." },
              { q: "Como recebem a confirmação e os lembretes?", a: "Por email: a confirmação logo, e um lembrete na véspera. Não enviamos SMS nem WhatsApp." },
              { q: "Posso continuar a aceitar reservas por telefone?", a: "Sim. Adiciona-as na mesma agenda, escolhendo entre as horas livres, para nunca haver reservas a mais." },
              { q: "Num restaurante, podem reservar várias pessoas para a mesma hora?", a: "Sim. Conta o número de pessoas por turno: o turno só fica cheio quando as reservas somam a lotação." },
              { q: "Posso pedir sinal ou pagamento na reserva?", a: "Ainda não. As reservas são gratuitas para o cliente." },
              { q: "Vejo as reservas no Google Calendar?", a: "Sim: subscreva o endereço que está em Partilhar no Google Calendar, no iPhone ou no Outlook. É só para ver; as alterações fazem-se na agenda." },
              { q: "Como são tratados os dados dos clientes?", a: "Guardamos só o necessário para gerir as reservas e enviar os emails, de acordo com o RGPD. Os dados continuam a ser seus." },
            ],
          },
        ],
      },
      en: {
        title: "Online booking system FAQ",
        description: "Answers to common questions: accounts and apps, reminders, phone bookings, capacity, payments and data.",
        blocks: [
          { type: "h2", id: "questions", text: "Questions and answers" },
          {
            type: "faq",
            items: [
              { q: "Do customers need an account or an app?", a: "No. They book on a web page with their name and contact." },
              { q: "How do they get the confirmation and reminders?", a: "By email: the confirmation straight away and a reminder the day before. We don't send SMS or WhatsApp messages." },
              { q: "Can I still take bookings by phone?", a: "Yes. You add them to the same diary, picking from the free times, so there's never overbooking." },
              { q: "At a restaurant, can several bookings be for the same time?", a: "Yes. It counts people per sitting: a sitting is only full when bookings add up to its capacity." },
              { q: "Can I take a deposit or payment when booking?", a: "Not yet. Bookings are free for customers." },
              { q: "Can I see bookings in Google Calendar?", a: "Yes: subscribe to the address in Share in Google Calendar, on iPhone or in Outlook. It's view-only; changes are made in the diary." },
              { q: "How is customer data handled?", a: "We only store what's needed to manage bookings and send the emails, in line with GDPR. The data remains yours." },
            ],
          },
        ],
      },
    },
  },
};

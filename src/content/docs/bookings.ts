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
      es: {
        title: "Primeros pasos con el sistema de reservas online",
        description: "Cómo funcionan las reservas online de Steevanz: el cliente reserva desde su enlace, a cualquier hora, y su equipo lo ve todo en una sola agenda.",
        blocks: [
          {
            type: "p",
            text: "Los clientes reservan desde su enlace (Instagram, web, perfil de Google), a cualquier hora, sin llamar. Reciben la confirmación y un recordatorio por email, y su equipo ve las reservas del día en el móvil o en el ordenador.",
          },
          { type: "h2", id: "how-it-works", text: "Cómo funciona" },
          {
            type: "ol",
            items: [
              "El cliente abre el enlace y elige qué quiere reservar.",
              "Restaurantes: indica cuántas personas vienen. Otros negocios: elige el servicio y, si quiere, con quién (o «cualquiera»).",
              "Elige el día y una de las horas libres y confirma con su nombre y contacto.",
              "Recibe la confirmación por email y un recordatorio el día anterior, con opción de cambiar o cancelar.",
              "La reserva aparece en su agenda. Su equipo marca «Ha llegado» cuando llega el cliente.",
            ],
          },
          { type: "h2", id: "two-models", text: "Restaurantes y servicios" },
          {
            type: "ul",
            items: [
              "**Restaurantes, cafeterías y bares:** reservas por número de personas. Cada turno (comida, cena) tiene un aforo; cuando las reservas lo llenan, ese turno queda completo.",
              "**Barberías, peluquerías, clínicas, espacios deportivos y otros:** servicios con su duración, prestados por personas o espacios (barberos, médicos, pistas) que atienden a un cliente cada vez.",
            ],
          },
          { type: "h2", id: "whats-included", text: "Qué incluye" },
          {
            type: "ul",
            items: [
              "Página de reservas con el nombre y los servicios de su negocio, sin app ni cuenta para el cliente.",
              "Agenda para el equipo, con reservas por teléfono y cambios (y «Vamos con retraso» en las citas de servicios).",
              "Confirmación y recordatorio por email.",
              "Calendario para ver las reservas en el móvil (Google Calendar, iPhone, Outlook).",
              "Configuración por el equipo de Steevanz y soporte por WhatsApp y email.",
            ],
          },
          { type: "p", text: "Siguiente paso: vea cómo hacemos la [instalación](/es/docs/online-booking-system/setup)." },
        ],
      },
      fr: {
        title: "Premiers pas avec le système de réservation en ligne",
        description: "Comment fonctionnent les réservations en ligne Steevanz : le client réserve via votre lien, à toute heure, et votre équipe voit tout dans un seul agenda.",
        blocks: [
          {
            type: "p",
            text: "Vos clients réservent via votre lien (Instagram, site web, fiche Google), à toute heure, sans appeler. Ils reçoivent la confirmation et un rappel par e-mail, et votre équipe voit les réservations du jour sur téléphone ou ordinateur.",
          },
          { type: "h2", id: "how-it-works", text: "Comment ça marche" },
          {
            type: "ol",
            items: [
              "Le client ouvre le lien et choisit ce qu'il veut réserver.",
              "Restaurants : il indique combien de personnes viennent. Autres commerces : il choisit la prestation et, s'il le souhaite, avec qui (ou «peu importe»).",
              "Il choisit le jour et l'un des créneaux libres, puis confirme avec son nom et son contact.",
              "Il reçoit la confirmation par e-mail et un rappel la veille, avec la possibilité de modifier ou d'annuler.",
              "La réservation apparaît dans votre agenda. Votre équipe marque «Arrivé» quand le client arrive.",
            ],
          },
          { type: "h2", id: "two-models", text: "Restaurants et prestations" },
          {
            type: "ul",
            items: [
              "**Restaurants, cafés et bars :** réservations par nombre de personnes. Chaque service (déjeuner, dîner) a une capacité ; quand les réservations la remplissent, ce service est complet.",
              "**Barbiers, salons de coiffure, cliniques, espaces sportifs et autres :** prestations avec leur durée, assurées par des personnes ou des espaces (barbiers, médecins, terrains) qui reçoivent un client à la fois.",
            ],
          },
          { type: "h2", id: "whats-included", text: "Ce qui est inclus" },
          {
            type: "ul",
            items: [
              "Page de réservation avec le nom et les prestations de votre commerce, sans application ni compte pour le client.",
              "Agenda pour l'équipe, avec réservations par téléphone et modifications (et «Nous avons du retard» pour les rendez-vous de prestations).",
              "Confirmation et rappel par e-mail.",
              "Calendrier pour voir les réservations sur votre téléphone (Google Agenda, iPhone, Outlook).",
              "Configuration par l'équipe Steevanz et assistance par WhatsApp et e-mail.",
            ],
          },
          { type: "p", text: "Étape suivante : voyez comment nous faisons l'[installation](/fr/docs/online-booking-system/setup)." },
        ],
      },
      de: {
        title: "Erste Schritte mit dem Online-Reservierungssystem",
        description: "So funktionieren die Online-Reservierungen von Steevanz: Kunden reservieren über Ihren Link, rund um die Uhr, und Ihr Team sieht alles in einem Kalender.",
        blocks: [
          {
            type: "p",
            text: "Ihre Kunden reservieren über Ihren Link (Instagram, Website, Google-Profil), rund um die Uhr, ohne anzurufen. Sie erhalten eine Bestätigung und eine Erinnerung per E-Mail, und Ihr Team sieht die Reservierungen des Tages auf Handy oder Computer.",
          },
          { type: "h2", id: "how-it-works", text: "So funktioniert es" },
          {
            type: "ol",
            items: [
              "Der Kunde öffnet den Link und wählt, was er reservieren möchte.",
              "Restaurants: Er gibt an, wie viele Personen kommen. Andere Geschäfte: Er wählt die Leistung und, wenn er möchte, bei wem (oder «egal wer»).",
              "Er wählt den Tag und eine der freien Uhrzeiten und bestätigt mit Namen und Kontakt.",
              "Er erhält die Bestätigung per E-Mail und am Vortag eine Erinnerung, mit der Möglichkeit, zu ändern oder zu stornieren.",
              "Die Reservierung erscheint in Ihrem Kalender. Ihr Team markiert «Angekommen», wenn der Kunde da ist.",
            ],
          },
          { type: "h2", id: "two-models", text: "Restaurants und Dienstleistungen" },
          {
            type: "ul",
            items: [
              "**Restaurants, Cafés und Bars:** Reservierungen nach Personenzahl. Jede Schicht (Mittag, Abend) hat eine Kapazität; sind die Plätze durch Reservierungen belegt, ist diese Schicht ausgebucht.",
              "**Barbiere, Friseure, Praxen, Sportstätten und andere:** Leistungen mit eigener Dauer, erbracht von Personen oder Räumen (Barbiere, Ärzte, Plätze), die jeweils einen Kunden bedienen.",
            ],
          },
          { type: "h2", id: "whats-included", text: "Was enthalten ist" },
          {
            type: "ul",
            items: [
              "Reservierungsseite mit dem Namen und den Leistungen Ihres Geschäfts, ohne App oder Konto für den Kunden.",
              "Kalender für Ihr Team, mit telefonischen Reservierungen und Änderungen (und «Wir haben Verspätung» bei Terminen für Leistungen).",
              "Bestätigung und Erinnerung per E-Mail.",
              "Kalender, um die Reservierungen auf dem Handy zu sehen (Google Kalender, iPhone, Outlook).",
              "Einrichtung durch das Steevanz-Team und Support per WhatsApp und E-Mail.",
            ],
          },
          { type: "p", text: "Nächster Schritt: Sehen Sie, wie wir die [Einrichtung](/de/docs/online-booking-system/setup) übernehmen." },
        ],
      },
      it: {
        title: "Primi passi con il sistema di prenotazione online",
        description: "Come funzionano le prenotazioni online di Steevanz: il cliente prenota dal vostro link, a qualsiasi ora, e il vostro staff vede tutto in un'unica agenda.",
        blocks: [
          {
            type: "p",
            text: "I clienti prenotano dal vostro link (Instagram, sito, profilo Google), a qualsiasi ora, senza telefonare. Ricevono la conferma e un promemoria via email, e il vostro staff vede le prenotazioni del giorno sul telefono o sul computer.",
          },
          { type: "h2", id: "how-it-works", text: "Come funziona" },
          {
            type: "ol",
            items: [
              "Il cliente apre il link e sceglie cosa prenotare.",
              "Ristoranti: indica quante persone vengono. Altre attività: sceglie il servizio e, se vuole, con chi (o «chiunque»).",
              "Sceglie il giorno e uno degli orari liberi e conferma con nome e contatto.",
              "Riceve la conferma via email e un promemoria il giorno prima, con la possibilità di modificare o annullare.",
              "La prenotazione compare nella vostra agenda. Lo staff segna «Arrivato» quando il cliente arriva.",
            ],
          },
          { type: "h2", id: "two-models", text: "Ristoranti e servizi" },
          {
            type: "ul",
            items: [
              "**Ristoranti, caffè e bar:** prenotazioni per numero di persone. Ogni turno (pranzo, cena) ha una capienza; quando le prenotazioni la riempiono, quel turno è al completo.",
              "**Barbieri, parrucchieri, cliniche, centri sportivi e altri:** servizi con la loro durata, svolti da persone o spazi (barbieri, medici, campi) che servono un cliente alla volta.",
            ],
          },
          { type: "h2", id: "whats-included", text: "Cosa include" },
          {
            type: "ul",
            items: [
              "Pagina di prenotazione con il nome e i servizi della vostra attività, senza app né account per il cliente.",
              "Agenda per lo staff, con prenotazioni telefoniche e modifiche (e «Siamo in ritardo» per gli appuntamenti di servizi).",
              "Conferma e promemoria via email.",
              "Calendario per vedere le prenotazioni sul telefono (Google Calendar, iPhone, Outlook).",
              "Configurazione da parte del team Steevanz e assistenza via WhatsApp ed email.",
            ],
          },
          { type: "p", text: "Prossimo passo: vedete come facciamo l'[installazione](/it/docs/online-booking-system/setup)." },
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
      es: {
        title: "Instalación del sistema de reservas online",
        description: "Cómo Steevanz pone las reservas en marcha: tipo de negocio, servicios o aforo, horario, reglas y el enlace en sus canales.",
        blocks: [
          { type: "p", text: "Nos encargamos de la instalación con usted. Normalmente queda lista en pocos días laborables." },
          {
            type: "steps",
            items: [
              { title: "Tipo de negocio", body: "Creamos su espacio con el tipo de negocio adecuado. Los servicios habituales de ese tipo ya vienen creados (p. ej.: barbería: corte, barba, corte y barba)." },
              { title: "Servicios o aforo", body: "Restaurantes: aforo por turno y máximo de personas por reserva. Otros negocios: ajustamos los servicios, las duraciones y los precios, y quién hace cada uno." },
              { title: "Horario", body: "El horario del local, los días cerrados y, si hace falta, el horario propio de cada persona o espacio." },
              { title: "Reglas", body: "Antelación mínima, con cuántos días se puede reservar, tolerancia de retraso y hasta cuándo puede cancelar el cliente." },
              { title: "El enlace en sus canales", body: "Ponemos el enlace de reserva en su Instagram, su web y su Perfil de Empresa de Google, y le entregamos un cartel con código QR." },
            ],
          },
          { type: "callout", tone: "info", text: "Después, puede cambiarlo todo cuando quiera: vea la [configuración](/es/docs/online-booking-system/configuration)." },
        ],
      },
      fr: {
        title: "Installation du système de réservation en ligne",
        description: "Comment Steevanz met les réservations en service : type de commerce, prestations ou capacité, horaires, règles et le lien sur vos canaux.",
        blocks: [
          { type: "p", text: "Nous nous occupons de l'installation avec vous. Elle est généralement prête en quelques jours ouvrés." },
          {
            type: "steps",
            items: [
              { title: "Type de commerce", body: "Nous créons votre espace avec le bon type de commerce. Les prestations habituelles de ce type sont déjà créées (par ex. barbier : coupe, barbe, coupe et barbe)." },
              { title: "Prestations ou capacité", body: "Restaurants : capacité par service et nombre maximum de personnes par réservation. Autres commerces : nous ajustons les prestations, les durées et les prix, et qui assure chacune." },
              { title: "Horaires", body: "Les horaires de l'établissement, les jours de fermeture et, si besoin, les horaires propres à chaque personne ou espace." },
              { title: "Règles", body: "Délai minimum, combien de jours à l'avance on peut réserver, tolérance de retard et jusqu'à quand le client peut annuler." },
              { title: "Le lien sur vos canaux", body: "Nous ajoutons le lien de réservation à votre Instagram, à votre site et à votre fiche d'établissement Google, et nous remettons une affiche avec QR code." },
            ],
          },
          { type: "callout", tone: "info", text: "Ensuite, vous pouvez tout changer quand vous voulez : voir la [configuration](/fr/docs/online-booking-system/configuration)." },
        ],
      },
      de: {
        title: "Einrichtung des Online-Reservierungssystems",
        description: "Wie Steevanz die Reservierungen startklar macht: Geschäftsart, Leistungen oder Kapazität, Öffnungszeiten, Regeln und der Link auf Ihren Kanälen.",
        blocks: [
          { type: "p", text: "Wir übernehmen die Einrichtung gemeinsam mit Ihnen. Meist ist sie in wenigen Werktagen fertig." },
          {
            type: "steps",
            items: [
              { title: "Geschäftsart", body: "Wir legen Ihren Bereich mit der passenden Geschäftsart an. Die üblichen Leistungen dieser Art sind schon angelegt (z. B. Barbier: Haarschnitt, Bart, Haarschnitt und Bart)." },
              { title: "Leistungen oder Kapazität", body: "Restaurants: Kapazität pro Schicht und höchste Personenzahl pro Reservierung. Andere Geschäfte: Wir passen die Leistungen, Dauern und Preise an und legen fest, wer welche Leistung erbringt." },
              { title: "Öffnungszeiten", body: "Die Öffnungszeiten, Ruhetage und bei Bedarf die eigenen Zeiten jeder Person oder jedes Raums." },
              { title: "Regeln", body: "Mindestvorlauf, wie viele Tage im Voraus reserviert werden kann, Toleranz bei Verspätung und bis wann der Kunde stornieren kann." },
              { title: "Der Link auf Ihren Kanälen", body: "Wir fügen den Reservierungslink in Ihr Instagram, Ihre Website und Ihr Google-Unternehmensprofil ein und liefern ein Plakat mit QR-Code." },
            ],
          },
          { type: "callout", tone: "info", text: "Danach können Sie alles jederzeit ändern: siehe [Konfiguration](/de/docs/online-booking-system/configuration)." },
        ],
      },
      it: {
        title: "Installazione del sistema di prenotazione online",
        description: "Come Steevanz mette in funzione le prenotazioni: tipo di attività, servizi o capienza, orari, regole e il link sui vostri canali.",
        blocks: [
          { type: "p", text: "Ci occupiamo dell'installazione insieme a voi. Di solito è pronta in pochi giorni lavorativi." },
          {
            type: "steps",
            items: [
              { title: "Tipo di attività", body: "Creiamo il vostro spazio con il tipo di attività giusto. I servizi abituali di quel tipo sono già creati (es.: barbiere: taglio, barba, taglio e barba)." },
              { title: "Servizi o capienza", body: "Ristoranti: capienza per turno e numero massimo di persone per prenotazione. Altre attività: regoliamo i servizi, le durate e i prezzi, e chi svolge ciascuno." },
              { title: "Orari", body: "Gli orari del locale, i giorni di chiusura e, se serve, gli orari propri di ogni persona o spazio." },
              { title: "Regole", body: "Preavviso minimo, con quanti giorni di anticipo si può prenotare, tolleranza sul ritardo e fino a quando il cliente può annullare." },
              { title: "Il link sui vostri canali", body: "Inseriamo il link di prenotazione nel vostro Instagram, nel sito e nel profilo dell'attività su Google, e consegniamo un cartello con QR code." },
            ],
          },
          { type: "callout", tone: "info", text: "In seguito potete cambiare tutto quando volete: vedete la [configurazione](/it/docs/online-booking-system/configuration)." },
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
      es: {
        title: "Configuración del sistema de reservas online",
        description: "Aforo por turno, servicios, personas y espacios, horario, reglas para el cliente, avisos y días u horas cerrados.",
        blocks: [
          { type: "h2", id: "capacity", text: "Restaurantes: aforo" },
          {
            type: "p",
            text: "En la pestaña **Aforo**: cuántas personas acepta con reserva en cada turno y el máximo de personas por reserva online. Los turnos son los periodos del horario (p. ej.: comida 12:00–15:00, cena 19:00–23:00). Varias reservas pueden ser para la misma hora; el turno solo queda completo cuando las reservas suman el aforo. La cuenta se hace sobre el turno entero, sin intentar adivinar quién se va antes: si suele rotar las mesas, ponga un aforo un poco por encima de sus plazas. Quien llega sin reserva entra si hay sitio, como siempre.",
          },
          { type: "h2", id: "services", text: "Otros negocios: servicios, personas y espacios" },
          {
            type: "ul",
            items: [
              "En la pestaña **Servicios**: nombre, precio (opcional), duración y un intervalo después (limpieza, preparación) que el cliente no ve.",
              "**Personas y espacios:** barberos, médicos, salas, pistas. Cada uno atiende a un cliente cada vez y puede tener horario propio.",
              "En cada servicio elija quién lo hace. Sin elección, cualquiera. El cliente puede elegir «cualquiera» y le toca quien esté menos ocupado ese día.",
            ],
          },
          { type: "h2", id: "rules", text: "Reglas para el cliente" },
          {
            type: "table",
            head: ["Ajuste", "Para qué sirve"],
            rows: [
              ["Antelación mínima", "Hasta cuánto antes de la hora se puede reservar online."],
              ["Con cuántos días de antelación", "Hasta qué fecha está abierta la agenda."],
              ["Tolerancia de retraso", "Cuánto tiempo espera a un cliente que llega tarde. El cliente la ve al reservar."],
              ["Cancelar o cambiar online hasta", "Después, el cliente tiene que contactar con el negocio."],
              ["Última reserva (restaurantes)", "Cuánto antes del cierre es la última hora para reservar."],
            ],
          },
          { type: "h2", id: "notifications", text: "Avisos y mensajes" },
          {
            type: "ul",
            items: [
              "Email al dueño por cada reserva nueva o cancelada (opcional).",
              "Nota en la confirmación y reglas de cancelación, que ve el cliente.",
              "El cliente recibe la confirmación y un recordatorio el día anterior por email.",
            ],
          },
          { type: "h2", id: "closing", text: "Días y horas cerrados" },
          { type: "p", text: "Los días enteros, en «Días cerrados». Para un evento, un día libre o una pista en mantenimiento, use «Cerrar reservas en un día u horario», para todos o para una persona o espacio." },
        ],
      },
      fr: {
        title: "Configuration du système de réservation en ligne",
        description: "Capacité par service, prestations, personnes et espaces, horaires, règles pour le client, notifications et jours ou heures fermés.",
        blocks: [
          { type: "h2", id: "capacity", text: "Restaurants : capacité" },
          {
            type: "p",
            text: "Dans l'onglet **Capacité** : combien de personnes vous acceptez sur réservation à chaque service et le nombre maximum de personnes par réservation en ligne. Les services sont les périodes de vos horaires (par ex. déjeuner 12:00–15:00, dîner 19:00–23:00). Plusieurs réservations peuvent tomber à la même heure ; un service n'est complet que lorsque les réservations atteignent sa capacité. Le calcul porte sur le service entier, sans deviner qui part plus tôt : si vos tables tournent souvent, mettez une capacité un peu au-dessus de vos places. Les clients sans réservation entrent s'il y a de la place, comme toujours.",
          },
          { type: "h2", id: "services", text: "Autres commerces : prestations, personnes et espaces" },
          {
            type: "ul",
            items: [
              "Dans l'onglet **Prestations** : nom, prix (facultatif), durée et un intervalle après (nettoyage, préparation) que le client ne voit pas.",
              "**Personnes et espaces :** barbiers, médecins, salles, terrains. Chacun reçoit un client à la fois et peut avoir ses propres horaires.",
              "Pour chaque prestation, choisissez qui l'assure. Sans choix, n'importe qui. Le client peut choisir «peu importe» et il est attribué à la personne la moins occupée ce jour-là.",
            ],
          },
          { type: "h2", id: "rules", text: "Règles pour le client" },
          {
            type: "table",
            head: ["Paramètre", "À quoi il sert"],
            rows: [
              ["Délai minimum", "Jusqu'à combien de temps avant l'heure on peut réserver en ligne."],
              ["Combien de jours à l'avance", "Jusqu'où l'agenda est ouvert."],
              ["Tolérance de retard", "Combien de temps vous attendez un client en retard. Le client la voit en réservant."],
              ["Annuler ou modifier en ligne jusqu'à", "Ensuite, le client doit contacter le commerce."],
              ["Dernière réservation (restaurants)", "Combien de temps avant la fermeture se situe la dernière heure de réservation."],
            ],
          },
          { type: "h2", id: "notifications", text: "Notifications et messages" },
          {
            type: "ul",
            items: [
              "E-mail au gérant à chaque réservation nouvelle ou annulée (facultatif).",
              "Note de confirmation et règles d'annulation, affichées au client.",
              "Le client reçoit la confirmation et un rappel la veille par e-mail.",
            ],
          },
          { type: "h2", id: "closing", text: "Jours et heures fermés" },
          { type: "p", text: "Les jours entiers vont dans «Jours fermés». Pour un événement, un jour de repos ou un terrain en maintenance, utilisez «Fermer les réservations un jour ou à un horaire», pour tous ou pour une personne ou un espace." },
        ],
      },
      de: {
        title: "Konfiguration des Online-Reservierungssystems",
        description: "Kapazität pro Schicht, Leistungen, Personen und Räume, Öffnungszeiten, Regeln für Kunden, Benachrichtigungen und geschlossene Tage oder Zeiten.",
        blocks: [
          { type: "h2", id: "capacity", text: "Restaurants: Kapazität" },
          {
            type: "p",
            text: "Im Reiter **Kapazität**: wie viele Personen Sie pro Schicht mit Reservierung annehmen und die höchste Personenzahl pro Online-Reservierung. Schichten sind die Zeiträume Ihrer Öffnungszeiten (z. B. Mittag 12:00–15:00, Abend 19:00–23:00). Mehrere Reservierungen können zur selben Uhrzeit sein; eine Schicht ist erst ausgebucht, wenn die Reservierungen zusammen ihre Kapazität erreichen. Gerechnet wird über die ganze Schicht, ohne zu raten, wer früher geht: Wenn Ihre Tische oft wechseln, setzen Sie die Kapazität etwas über Ihre Plätze. Gäste ohne Reservierung bekommen wie immer einen Tisch, wenn Platz ist.",
          },
          { type: "h2", id: "services", text: "Andere Geschäfte: Leistungen, Personen und Räume" },
          {
            type: "ul",
            items: [
              "Im Reiter **Leistungen**: Name, Preis (optional), Dauer und eine Pause danach (Reinigung, Vorbereitung), die der Kunde nicht sieht.",
              "**Personen und Räume:** Barbiere, Ärzte, Räume, Plätze. Jede Person oder jeder Raum bedient einen Kunden nach dem anderen und kann eigene Zeiten haben.",
              "Wählen Sie bei jeder Leistung, wer sie erbringt. Ohne Auswahl: jeder. Der Kunde kann «egal wer» wählen und kommt zu dem, der an diesem Tag am wenigsten ausgelastet ist.",
            ],
          },
          { type: "h2", id: "rules", text: "Regeln für Kunden" },
          {
            type: "table",
            head: ["Einstellung", "Wofür"],
            rows: [
              ["Mindestvorlauf", "Wie kurz vor der Uhrzeit noch online reserviert werden kann."],
              ["Wie viele Tage im Voraus", "Wie weit im Voraus der Kalender offen ist."],
              ["Toleranz bei Verspätung", "Wie lange Sie auf einen verspäteten Kunden warten. Der Kunde sieht sie beim Reservieren."],
              ["Online stornieren oder ändern bis", "Danach muss der Kunde das Geschäft kontaktieren."],
              ["Letzte Reservierung (Restaurants)", "Wie lange vor Schließung die letzte Reservierungszeit liegt."],
            ],
          },
          { type: "h2", id: "notifications", text: "Benachrichtigungen und Nachrichten" },
          {
            type: "ul",
            items: [
              "E-Mail an den Inhaber bei jeder neuen oder stornierten Reservierung (optional).",
              "Hinweis in der Bestätigung und Stornoregeln, die der Kunde sieht.",
              "Der Kunde erhält die Bestätigung und am Vortag eine Erinnerung per E-Mail.",
            ],
          },
          { type: "h2", id: "closing", text: "Geschlossene Tage und Zeiten" },
          { type: "p", text: "Ganze Tage kommen unter «Geschlossene Tage». Für eine Veranstaltung, einen freien Tag oder einen Platz in Wartung nutzen Sie «Reservierungen an einem Tag oder zu einer Uhrzeit schließen», für alle oder für eine Person oder einen Raum." },
        ],
      },
      it: {
        title: "Configurazione del sistema di prenotazione online",
        description: "Capienza per turno, servizi, persone e spazi, orari, regole per il cliente, avvisi e giorni od orari chiusi.",
        blocks: [
          { type: "h2", id: "capacity", text: "Ristoranti: capienza" },
          {
            type: "p",
            text: "Nella scheda **Capienza**: quante persone accettate su prenotazione in ogni turno e il numero massimo di persone per prenotazione online. I turni sono le fasce dei vostri orari (es.: pranzo 12:00–15:00, cena 19:00–23:00). Più prenotazioni possono essere alla stessa ora; il turno è al completo solo quando le prenotazioni raggiungono la capienza. Il conto si fa sull'intero turno, senza indovinare chi se ne va prima: se i tavoli girano spesso, impostate una capienza un po' sopra i vostri posti. Chi arriva senza prenotazione entra se c'è posto, come sempre.",
          },
          { type: "h2", id: "services", text: "Altre attività: servizi, persone e spazi" },
          {
            type: "ul",
            items: [
              "Nella scheda **Servizi**: nome, prezzo (facoltativo), durata e una pausa dopo (pulizia, preparazione) che il cliente non vede.",
              "**Persone e spazi:** barbieri, medici, sale, campi. Ognuno serve un cliente alla volta e può avere orari propri.",
              "In ogni servizio scegliete chi lo svolge. Senza scelta, chiunque. Il cliente può scegliere «chiunque» e gli tocca chi è meno occupato quel giorno.",
            ],
          },
          { type: "h2", id: "rules", text: "Regole per il cliente" },
          {
            type: "table",
            head: ["Impostazione", "A cosa serve"],
            rows: [
              ["Preavviso minimo", "Fino a quanto prima dell'orario si può prenotare online."],
              ["Con quanti giorni di anticipo", "Fin dove è aperta l'agenda."],
              ["Tolleranza sul ritardo", "Quanto aspettate un cliente in ritardo. Il cliente la vede quando prenota."],
              ["Annullare o modificare online fino a", "Dopo, il cliente deve contattare l'attività."],
              ["Ultima prenotazione (ristoranti)", "Quanto prima della chiusura è l'ultimo orario prenotabile."],
            ],
          },
          { type: "h2", id: "notifications", text: "Avvisi e messaggi" },
          {
            type: "ul",
            items: [
              "Email al titolare per ogni prenotazione nuova o annullata (facoltativo).",
              "Nota nella conferma e regole di annullamento, mostrate al cliente.",
              "Il cliente riceve la conferma e un promemoria il giorno prima via email.",
            ],
          },
          { type: "h2", id: "closing", text: "Giorni e orari chiusi" },
          { type: "p", text: "I giorni interi vanno in «Giorni di chiusura». Per un evento, un giorno libero o un campo in manutenzione, usate «Chiudi le prenotazioni in un giorno o orario», per tutti o per una persona o uno spazio." },
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
              { title: "Chegou ou não veio", body: "«Chegou» quando o cliente chega; «Não veio» no «⋯». Passada a tolerância, a reserva aparece como «Atrasado»; quando a hora reservada acaba sem nada marcado, como «Passou a hora: chegou?», com «Chegou» e «Não veio» à vista." },
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
              { title: "Arrived or no-show", body: "«Arrived» when the customer comes in; «No-show» in the «⋯». Past the lateness allowance, the booking shows as «Late»; once the booked time is over with nothing marked, as «Time's up: did they come?», with «Arrived» and «No-show» in view." },
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
      es: {
        title: "Uso diario de las reservas",
        description: "Cómo gestionar las reservas en el día a día: la agenda, reservas por teléfono, cambios, llegadas, ausencias y retrasos.",
        blocks: [
          { type: "p", text: "En la pestaña **Reservas** ve los días de la semana con cuántas reservas tiene cada uno y, en el día elegido, la ocupación de cada turno y la lista «Por llegar». La página se actualiza sola." },
          {
            type: "steps",
            items: [
              { title: "Reserva por teléfono", body: "«Nueva reserva»: elija el día y las personas (o el servicio) y aparecen solo las horas libres. Elija una, escriba el nombre y guarde." },
              { title: "Cambiar", body: "En el «⋯» de la reserva, «Cambiar reserva»: cambie la hora, las personas, el servicio o el contacto. El enlace del cliente se mantiene y puede avisarle por email." },
              { title: "Ha llegado o no vino", body: "«Ha llegado» cuando llega el cliente; «No vino» en el «⋯». Pasada la tolerancia, la reserva aparece como «Con retraso»; cuando termina la hora reservada sin nada marcado, como «Pasó la hora: ¿ha llegado?», con «Ha llegado» y «No vino» a la vista." },
              { title: "Cancelar", body: "En el «⋯», «Cancelar reserva». Si el cliente dejó su email, recibe un aviso." },
            ],
          },
          { type: "h2", id: "delay", text: "Vamos con retraso" },
          {
            type: "p",
            text: "Solo en negocios con citas de servicios (barberías, clínicas…), donde un retraso pasa a las citas siguientes. En un día complicado, en «Vamos con retraso» elija +10, +15, +30 o +45 minutos, para todos o para una persona o espacio. Los clientes de las próximas 3 horas con email reciben la hora prevista, y todos ven el aviso en la página de su reserva. Ninguna reserva cambia de hora.",
          },
          { type: "callout", tone: "tip", text: "Para ver las reservas en el calendario del móvil, use la dirección de **Compartir**." },
        ],
      },
      fr: {
        title: "Utilisation quotidienne des réservations",
        description: "Comment gérer les réservations au quotidien : l'agenda, les réservations par téléphone, les modifications, les arrivées, les absences et les retards.",
        blocks: [
          { type: "p", text: "Dans l'onglet **Réservations**, vous voyez les jours de la semaine avec le nombre de réservations de chacun et, pour le jour choisi, le remplissage de chaque service et la liste «À venir». La page se met à jour toute seule." },
          {
            type: "steps",
            items: [
              { title: "Réservation par téléphone", body: "«Nouvelle réservation» : choisissez le jour et les personnes (ou la prestation), et seuls les créneaux libres apparaissent. Choisissez-en un, tapez le nom et enregistrez." },
              { title: "Modifier", body: "Dans le «⋯» de la réservation, «Modifier la réservation» : changez l'heure, les personnes, la prestation ou le contact. Le lien du client reste le même et vous pouvez le prévenir par e-mail." },
              { title: "Arrivé ou absent", body: "«Arrivé» quand le client arrive ; «Absent» dans le «⋯». Passée la tolérance, la réservation apparaît «En retard» ; une fois l'heure réservée écoulée sans rien de marqué, «Heure passée : est-il venu ?», avec «Arrivé» et «Absent» en vue." },
              { title: "Annuler", body: "Dans le «⋯», «Annuler la réservation». Si le client a laissé un e-mail, il est prévenu." },
            ],
          },
          { type: "h2", id: "delay", text: "Nous avons du retard" },
          {
            type: "p",
            text: "Seulement pour les commerces avec des rendez-vous de prestations (barbiers, cliniques…), où un retard se répercute sur les rendez-vous suivants. Un jour difficile, dans «Nous avons du retard», choisissez +10, +15, +30 ou +45 minutes, pour tous ou pour une personne ou un espace. Les clients des 3 prochaines heures qui ont un e-mail reçoivent l'heure prévue, et tous voient l'avis sur la page de leur réservation. Aucune réservation ne change d'heure.",
          },
          { type: "callout", tone: "tip", text: "Pour voir les réservations dans le calendrier de votre téléphone, utilisez l'adresse dans **Partager**." },
        ],
      },
      de: {
        title: "Reservierungen im Alltag",
        description: "Wie Sie die Reservierungen täglich führen: der Kalender, telefonische Reservierungen, Änderungen, Ankünfte, Nichterscheinen und Verspätungen.",
        blocks: [
          { type: "p", text: "Im Reiter **Reservierungen** sehen Sie die Wochentage mit der Zahl der Reservierungen pro Tag und, für den gewählten Tag, die Auslastung jeder Schicht und die Liste «Noch erwartet». Die Seite aktualisiert sich von selbst." },
          {
            type: "steps",
            items: [
              { title: "Telefonische Reservierung", body: "«Neue Reservierung»: Wählen Sie den Tag und die Personen (oder die Leistung), dann erscheinen nur freie Uhrzeiten. Wählen Sie eine, geben Sie den Namen ein und speichern Sie." },
              { title: "Ändern", body: "Im «⋯» der Reservierung «Reservierung ändern»: Uhrzeit, Personen, Leistung oder Kontakt ändern. Der Link des Kunden bleibt gleich und Sie können ihn per E-Mail informieren." },
              { title: "Angekommen oder nicht erschienen", body: "«Angekommen», wenn der Kunde da ist; «Nicht erschienen» im «⋯». Nach Ablauf der Toleranz erscheint die Reservierung als «Verspätet»; ist die reservierte Zeit vorbei, ohne dass etwas markiert wurde, als «Zeit vorbei: angekommen?», mit «Angekommen» und «Nicht erschienen» gut sichtbar." },
              { title: "Stornieren", body: "Im «⋯» «Reservierung stornieren». Hat der Kunde eine E-Mail hinterlassen, wird er benachrichtigt." },
            ],
          },
          { type: "h2", id: "delay", text: "Wir haben Verspätung" },
          {
            type: "p",
            text: "Nur bei Geschäften mit Terminen für Leistungen (Barbiere, Praxen …), wo sich eine Verspätung auf die folgenden Termine auswirkt. An einem schwierigen Tag wählen Sie unter «Wir haben Verspätung» +10, +15, +30 oder +45 Minuten, für alle oder für eine Person oder einen Raum. Kunden der nächsten 3 Stunden mit E-Mail erhalten die voraussichtliche Uhrzeit, und alle sehen den Hinweis auf ihrer Reservierungsseite. Keine Reservierung wird verschoben.",
          },
          { type: "callout", tone: "tip", text: "Um die Reservierungen im Kalender Ihres Handys zu sehen, nutzen Sie die Adresse unter **Teilen**." },
        ],
      },
      it: {
        title: "Uso quotidiano delle prenotazioni",
        description: "Come gestire le prenotazioni ogni giorno: l'agenda, le prenotazioni telefoniche, le modifiche, gli arrivi, le assenze e i ritardi.",
        blocks: [
          { type: "p", text: "Nella scheda **Prenotazioni** vedete i giorni della settimana con quante prenotazioni ha ciascuno e, nel giorno scelto, l'occupazione di ogni turno e l'elenco «In arrivo». La pagina si aggiorna da sola." },
          {
            type: "steps",
            items: [
              { title: "Prenotazione telefonica", body: "«Nuova prenotazione»: scegliete il giorno e le persone (o il servizio) e compaiono solo gli orari liberi. Sceglietene uno, scrivete il nome e salvate." },
              { title: "Modificare", body: "Nel «⋯» della prenotazione, «Modifica prenotazione»: cambiate l'orario, le persone, il servizio o il contatto. Il link del cliente resta lo stesso e potete avvisarlo via email." },
              { title: "Arrivato o non venuto", body: "«Arrivato» quando il cliente arriva; «Non venuto» nel «⋯». Superata la tolleranza, la prenotazione compare come «In ritardo»; quando l'orario prenotato finisce senza nulla segnato, come «Orario passato: è arrivato?», con «Arrivato» e «Non venuto» in vista." },
              { title: "Annullare", body: "Nel «⋯», «Annulla prenotazione». Se il cliente ha lasciato l'email, riceve un avviso." },
            ],
          },
          { type: "h2", id: "delay", text: "Siamo in ritardo" },
          {
            type: "p",
            text: "Solo per le attività con appuntamenti di servizi (barbieri, cliniche…), dove un ritardo si ripercuote sugli appuntamenti successivi. In una giornata difficile, in «Siamo in ritardo» scegliete +10, +15, +30 o +45 minuti, per tutti o per una persona o uno spazio. I clienti delle prossime 3 ore con email ricevono l'orario previsto, e tutti vedono l'avviso nella pagina della propria prenotazione. Nessuna prenotazione cambia orario.",
          },
          { type: "callout", tone: "tip", text: "Per vedere le prenotazioni nel calendario del telefono, usate l'indirizzo in **Condividi**." },
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
      es: {
        title: "Solución de problemas de las reservas",
        description: "Soluciones a problemas habituales: no aparecen horas libres, el cliente no recibió el email y el calendario no se actualiza.",
        blocks: [
          { type: "h2", id: "no-times", text: "No aparecen horas libres" },
          {
            type: "ol",
            items: [
              "Compruebe que las reservas online están activadas en Ajustes y que hay horario para ese día.",
              "Restaurantes: el turno puede estar completo. Vea la ocupación en la pestaña Reservas.",
              "Servicios: compruebe que alguien hace el servicio y trabaja ese día (horario propio).",
              "La antelación mínima o un horario cerrado también quitan horas.",
            ],
          },
          { type: "h2", id: "email", text: "El cliente no recibió el email" },
          { type: "p", text: "Compruebe el email de la reserva y pida al cliente que mire en el spam. La página de la reserva siempre tiene toda la información." },
          { type: "h2", id: "calendar", text: "El calendario del móvil no se actualiza" },
          { type: "p", text: "Los calendarios suscritos se actualizan cada cierto tiempo (Google puede tardar unas horas). La agenda de la pestaña Reservas está siempre al día." },
        ],
      },
      fr: {
        title: "Résolution des problèmes de réservation",
        description: "Solutions aux problèmes courants : aucun créneau libre, le client n'a pas reçu l'e-mail et le calendrier ne se met pas à jour.",
        blocks: [
          { type: "h2", id: "no-times", text: "Aucun créneau libre n'apparaît" },
          {
            type: "ol",
            items: [
              "Vérifiez que les réservations en ligne sont activées dans Paramètres et qu'il y a des horaires pour ce jour-là.",
              "Restaurants : le service est peut-être complet. Voyez le remplissage dans l'onglet Réservations.",
              "Prestations : vérifiez que quelqu'un assure la prestation et travaille ce jour-là (horaires propres).",
              "Le délai minimum ou un horaire fermé retirent aussi des créneaux.",
            ],
          },
          { type: "h2", id: "email", text: "Le client n'a pas reçu l'e-mail" },
          { type: "p", text: "Vérifiez l'e-mail sur la réservation et demandez au client de regarder dans ses spams. La page de la réservation contient toujours toutes les informations." },
          { type: "h2", id: "calendar", text: "Le calendrier du téléphone ne se met pas à jour" },
          { type: "p", text: "Les calendriers abonnés se mettent à jour de temps en temps (Google peut prendre quelques heures). L'agenda de l'onglet Réservations est toujours à jour." },
        ],
      },
      de: {
        title: "Fehlerbehebung für Reservierungen",
        description: "Lösungen für häufige Probleme: keine freien Uhrzeiten, der Kunde hat die E-Mail nicht erhalten und der Kalender aktualisiert sich nicht.",
        blocks: [
          { type: "h2", id: "no-times", text: "Es erscheinen keine freien Uhrzeiten" },
          {
            type: "ol",
            items: [
              "Prüfen Sie, ob die Online-Reservierungen in den Einstellungen eingeschaltet sind und ob es für diesen Tag Öffnungszeiten gibt.",
              "Restaurants: Die Schicht kann ausgebucht sein. Sehen Sie die Auslastung im Reiter Reservierungen.",
              "Leistungen: Prüfen Sie, ob jemand die Leistung erbringt und an diesem Tag arbeitet (eigene Zeiten).",
              "Auch der Mindestvorlauf oder eine geschlossene Zeit entfernen Uhrzeiten.",
            ],
          },
          { type: "h2", id: "email", text: "Der Kunde hat die E-Mail nicht erhalten" },
          { type: "p", text: "Prüfen Sie die E-Mail-Adresse in der Reservierung und bitten Sie den Kunden, im Spam-Ordner nachzusehen. Die Reservierungsseite enthält immer alle Angaben." },
          { type: "h2", id: "calendar", text: "Der Handy-Kalender aktualisiert sich nicht" },
          { type: "p", text: "Abonnierte Kalender aktualisieren sich von Zeit zu Zeit (bei Google kann das einige Stunden dauern). Der Kalender im Reiter Reservierungen ist immer aktuell." },
        ],
      },
      it: {
        title: "Risoluzione dei problemi delle prenotazioni",
        description: "Soluzioni ai problemi più comuni: non compaiono orari liberi, il cliente non ha ricevuto l'email e il calendario non si aggiorna.",
        blocks: [
          { type: "h2", id: "no-times", text: "Non compaiono orari liberi" },
          {
            type: "ol",
            items: [
              "Verificate che le prenotazioni online siano attive in Impostazioni e che ci siano orari per quel giorno.",
              "Ristoranti: il turno può essere al completo. Vedete l'occupazione nella scheda Prenotazioni.",
              "Servizi: verificate che qualcuno svolga il servizio e lavori quel giorno (orari propri).",
              "Anche il preavviso minimo o un orario chiuso tolgono orari.",
            ],
          },
          { type: "h2", id: "email", text: "Il cliente non ha ricevuto l'email" },
          { type: "p", text: "Verificate l'email nella prenotazione e chiedete al cliente di guardare nello spam. La pagina della prenotazione ha sempre tutte le informazioni." },
          { type: "h2", id: "calendar", text: "Il calendario del telefono non si aggiorna" },
          { type: "p", text: "I calendari in abbonamento si aggiornano di tanto in tanto (Google può impiegare qualche ora). L'agenda nella scheda Prenotazioni è sempre aggiornata." },
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
      es: {
        title: "Preguntas frecuentes sobre el sistema de reservas online",
        description: "Respuestas a las dudas más habituales: cuentas y apps, recordatorios, reservas por teléfono, aforo, pagos y datos.",
        blocks: [
          { type: "h2", id: "questions", text: "Preguntas y respuestas" },
          {
            type: "faq",
            items: [
              { q: "¿Los clientes necesitan cuenta o app?", a: "No. Reservan en una página web con su nombre y contacto." },
              { q: "¿Cómo reciben la confirmación y los recordatorios?", a: "Por email: la confirmación al momento y un recordatorio el día anterior. No enviamos SMS ni WhatsApp." },
              { q: "¿Puedo seguir aceptando reservas por teléfono?", a: "Sí. Las añade en la misma agenda, eligiendo entre las horas libres, para que nunca haya reservas de más." },
              { q: "En un restaurante, ¿pueden reservar varias personas para la misma hora?", a: "Sí. Cuenta el número de personas por turno: el turno solo queda completo cuando las reservas suman el aforo." },
              { q: "¿Puedo pedir una señal o el pago al reservar?", a: "Todavía no. Las reservas son gratuitas para el cliente." },
              { q: "¿Veo las reservas en Google Calendar?", a: "Sí: suscríbase a la dirección de Compartir en Google Calendar, en el iPhone o en Outlook. Es solo para ver; los cambios se hacen en la agenda." },
              { q: "¿Cómo se tratan los datos de los clientes?", a: "Guardamos solo lo necesario para gestionar las reservas y enviar los emails, conforme al RGPD. Los datos siguen siendo suyos." },
            ],
          },
        ],
      },
      fr: {
        title: "Questions fréquentes sur le système de réservation en ligne",
        description: "Réponses aux questions les plus courantes : comptes et applications, rappels, réservations par téléphone, capacité, paiements et données.",
        blocks: [
          { type: "h2", id: "questions", text: "Questions et réponses" },
          {
            type: "faq",
            items: [
              { q: "Les clients ont-ils besoin d'un compte ou d'une application ?", a: "Non. Ils réservent sur une page web avec leur nom et leur contact." },
              { q: "Comment reçoivent-ils la confirmation et les rappels ?", a: "Par e-mail : la confirmation aussitôt et un rappel la veille. Nous n'envoyons ni SMS ni messages WhatsApp." },
              { q: "Puis-je continuer à prendre des réservations par téléphone ?", a: "Oui. Vous les ajoutez dans le même agenda, en choisissant parmi les créneaux libres, pour ne jamais avoir de surréservation." },
              { q: "Dans un restaurant, plusieurs réservations peuvent-elles être à la même heure ?", a: "Oui. Le calcul se fait en personnes par service : un service n'est complet que lorsque les réservations atteignent sa capacité." },
              { q: "Puis-je demander un acompte ou un paiement à la réservation ?", a: "Pas encore. Les réservations sont gratuites pour le client." },
              { q: "Puis-je voir les réservations dans Google Agenda ?", a: "Oui : abonnez-vous à l'adresse indiquée dans Partager, dans Google Agenda, sur iPhone ou dans Outlook. C'est en lecture seule ; les modifications se font dans l'agenda." },
              { q: "Comment les données des clients sont-elles traitées ?", a: "Nous ne conservons que le nécessaire pour gérer les réservations et envoyer les e-mails, conformément au RGPD. Les données restent les vôtres." },
            ],
          },
        ],
      },
      de: {
        title: "Häufige Fragen zum Online-Reservierungssystem",
        description: "Antworten auf die häufigsten Fragen: Konten und Apps, Erinnerungen, telefonische Reservierungen, Kapazität, Zahlungen und Daten.",
        blocks: [
          { type: "h2", id: "questions", text: "Fragen und Antworten" },
          {
            type: "faq",
            items: [
              { q: "Brauchen Kunden ein Konto oder eine App?", a: "Nein. Sie reservieren auf einer Webseite mit Namen und Kontakt." },
              { q: "Wie erhalten sie die Bestätigung und die Erinnerungen?", a: "Per E-Mail: die Bestätigung sofort und eine Erinnerung am Vortag. Wir versenden keine SMS und keine WhatsApp-Nachrichten." },
              { q: "Kann ich weiterhin telefonische Reservierungen annehmen?", a: "Ja. Sie tragen sie in denselben Kalender ein und wählen dabei aus den freien Uhrzeiten, damit es nie zu Überbuchungen kommt." },
              { q: "Können im Restaurant mehrere Reservierungen zur selben Uhrzeit sein?", a: "Ja. Gezählt werden die Personen pro Schicht: Eine Schicht ist erst ausgebucht, wenn die Reservierungen zusammen ihre Kapazität erreichen." },
              { q: "Kann ich bei der Reservierung eine Anzahlung oder Zahlung verlangen?", a: "Noch nicht. Reservierungen sind für Kunden kostenlos." },
              { q: "Sehe ich die Reservierungen im Google Kalender?", a: "Ja: Abonnieren Sie die Adresse unter Teilen im Google Kalender, auf dem iPhone oder in Outlook. Sie dient nur zum Ansehen; Änderungen nehmen Sie im Kalender des Dashboards vor." },
              { q: "Wie werden die Kundendaten behandelt?", a: "Wir speichern nur, was nötig ist, um die Reservierungen zu verwalten und die E-Mails zu senden, gemäß DSGVO. Die Daten bleiben Ihre." },
            ],
          },
        ],
      },
      it: {
        title: "Domande frequenti sul sistema di prenotazione online",
        description: "Risposte ai dubbi più comuni: account e app, promemoria, prenotazioni telefoniche, capienza, pagamenti e dati.",
        blocks: [
          { type: "h2", id: "questions", text: "Domande e risposte" },
          {
            type: "faq",
            items: [
              { q: "I clienti hanno bisogno di un account o di un'app?", a: "No. Prenotano su una pagina web con nome e contatto." },
              { q: "Come ricevono la conferma e i promemoria?", a: "Via email: la conferma subito e un promemoria il giorno prima. Non inviamo SMS né messaggi WhatsApp." },
              { q: "Posso continuare ad accettare prenotazioni telefoniche?", a: "Sì. Le aggiungete nella stessa agenda, scegliendo tra gli orari liberi, così non ci sono mai prenotazioni in eccesso." },
              { q: "In un ristorante, più prenotazioni possono essere alla stessa ora?", a: "Sì. Conta il numero di persone per turno: il turno è al completo solo quando le prenotazioni raggiungono la capienza." },
              { q: "Posso chiedere una caparra o il pagamento alla prenotazione?", a: "Non ancora. Le prenotazioni sono gratuite per il cliente." },
              { q: "Vedo le prenotazioni in Google Calendar?", a: "Sì: abbonatevi all'indirizzo che trovate in Condividi, in Google Calendar, su iPhone o in Outlook. È solo in lettura; le modifiche si fanno nell'agenda." },
              { q: "Come vengono trattati i dati dei clienti?", a: "Conserviamo solo il necessario per gestire le prenotazioni e inviare le email, nel rispetto del GDPR. I dati restano vostri." },
            ],
          },
        ],
      },
    },
  },
};

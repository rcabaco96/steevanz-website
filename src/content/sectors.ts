import type { Localized, LocalizedPartial } from "@/lib/i18n";
import type { PhotoId } from "./media";
import { sectorSlugs } from "./sector-slugs.ts";
import type { FaqItem, ProductId, SectorId, TitledText } from "./types";

export interface SectorCopy {
  name: string;
  cardTitle: string;
  cardBody: string;
  metaTitle: string;
  metaDescription: string;
  heroTitle: string;
  heroSubtitle: string;
  pains: TitledText[];
  bundleTitle: string;
  bundleBody: string;
  dayInTheLife: TitledText[];
  faq: FaqItem[];
}

export interface SectorPackCopy {
  badge: string;
  eyebrow: string;
  title: string;
  body: string;
  items: string[];
  setupLabel: string;
  monthlyLabel: string;
  /** {setup} and {monthly} are replaced with the prices of each extra property. */
  extraProperty: string;
  /** {setup} and {monthly} are replaced with the prices of the same products bought separately. */
  separately: string;
  website: string;
  note: string;
  requestInfo: string;
}

// A bundle sold through the demo (not the cart): the cart has one billing per product and no bundle discounts.
export interface SectorPack {
  setup: number;
  monthly: number;
  extraSetup: number;
  extraMonthly: number;
  separatelySetup: number;
  separatelyMonthly: number;
  /** Product the demo and info-request forms open with. */
  demoProduct: ProductId;
  isProvisional: boolean;
  copy: Localized<SectorPackCopy>;
}

export type SectorSide = { kind: "photo"; photo: PhotoId } | { kind: "product"; productId: ProductId };

export interface Sector {
  id: SectorId;
  slug: Localized<string>;
  photo: PhotoId;
  /** Picture next to the "day in the life" timeline when the sector has no video. */
  side: SectorSide;
  bundle: ProductId[];
  /** Honest limits of the bundle for this sector, shown under the recommended products. */
  bundleNote?: Localized<string>;
  pack?: SectorPack;
  copy: LocalizedPartial<SectorCopy>;
}

export const sectors: Sector[] = [
  {
    id: "restaurants",
    slug: sectorSlugs.restaurants,
    photo: "restaurant-table",
    side: { kind: "photo", photo: "retail" },
    bundle: ["google-review-plates", "bookings", "waitlist", "ai-voice"],
    copy: {
      pt: {
        name: "Restaurantes e cafés",
        cardTitle: "Restaurantes e cafés",
        cardBody: "Mais reviews no Google, mesas cheias sem telefonemas perdidos e uma fila de espera que não entope a porta.",
        metaTitle: "Placas e IA para restaurantes | Steevanz",
        metaDescription: "Placas para reviews no Google, reservas online, lista de espera digital e receção por voz com IA. Pensado para restaurantes e cafés em Portugal.",
        heroTitle: "A sala cheia. O telefone atendido. As reviews a crescer.",
        heroSubtitle: "Num restaurante, cada minuto de serviço conta. Juntamos as ferramentas que tiram trabalho à equipa e trazem mais clientes pela porta, sem apps para instalar e com a configuração feita por nós.",
        pains: [
          { title: "Clientes satisfeitos que nunca deixam review", body: "Saem contentes, mas ninguém se lembra de procurar o restaurante no Google. Quem escreve são sobretudo os descontentes." },
          { title: "O telefone toca em plena hora de ponta", body: "Entre a cozinha e a sala, ninguém consegue atender. Cada chamada perdida pode ser uma mesa de quatro que foi para o vizinho." },
          { title: "Uma fila à porta que desmotiva", body: "Grupos à espera no passeio, sem saber quanto tempo falta. Muitos desistem antes de a mesa ficar livre." },
        ],
        bundleTitle: "O pacote para restaurantes",
        bundleBody: "Placas nas mesas e no balcão para pedir reviews no momento certo, reservas online com lembretes que reduzem as faltas, lista de espera digital com aviso no telemóvel e uma receção por voz que atende quando a equipa não pode.",
        dayInTheLife: [
          { title: "12:15 — Reservas a entrar sozinhas", body: "Os clientes reservam pelo Instagram e pelo perfil no Google. A confirmação e o lembrete seguem automaticamente." },
          { title: "13:30 — Casa cheia, fila organizada", body: "Quem chega sem reserva junta-se à lista de espera com um QR code e é avisado no telemóvel quando a mesa está pronta." },
          { title: "14:45 — A conta e um toque", body: "Na altura de pagar, o empregado aponta para a placa na mesa. Um toque com o telemóvel e o cliente está no formulário de review." },
          { title: "22:30 — Telefone atendido depois de fechar", body: "A receção por voz responde a horários e morada, aceita reservas para amanhã e envia-lhe um resumo por WhatsApp." },
        ],
        faq: [
          { q: "Preciso de mudar o meu sistema de reservas atual?", a: "Não obrigatoriamente. Se já usa uma plataforma de que gosta, podemos começar pelas placas e pela lista de espera. Na demonstração analisamos o que faz sentido manter." },
          { q: "As placas aguentam o ambiente de um restaurante?", a: "Sim. São em acrílico resistente, limpam-se com um pano húmido e o chip fica protegido dentro da placa. Não use lixívia nem produtos abrasivos." },
          { q: "Quanto tempo demora a pôr tudo a funcionar?", a: "As placas ficam prontas em poucos dias úteis. Reservas e lista de espera costumam estar ativas numa a duas semanas, incluindo a formação da equipa." },
        ],
      },
      en: {
        name: "Restaurants and cafés",
        cardTitle: "Restaurants and cafés",
        cardBody: "More Google reviews, full tables without missed calls and a waiting list that doesn't block the door.",
        metaTitle: "Plates and AI for restaurants | Steevanz",
        metaDescription: "Plates for Google reviews, online bookings, digital waiting lists and an AI voice receptionist. Built for restaurants and cafés in Portugal.",
        heroTitle: "A full room. Every call answered. Reviews climbing.",
        heroSubtitle: "In a restaurant, every minute of service counts. We bring together the tools that take work off your team and bring more guests through the door, with no apps to install and the setup done by us.",
        pains: [
          { title: "Happy guests who never leave a review", body: "They leave smiling, but nobody remembers to look you up on Google. The people who do write are mostly the unhappy ones." },
          { title: "The phone rings mid-rush", body: "Between the kitchen and the floor, nobody can pick up. Every missed call could be a table of four that went next door." },
          { title: "A queue at the door that puts people off", body: "Groups waiting on the pavement with no idea how long it will take. Many give up before a table frees up." },
        ],
        bundleTitle: "The restaurant bundle",
        bundleBody: "Plates on tables and at the counter to ask for reviews at the right moment, online bookings with reminders that cut no-shows, a digital waiting list with phone alerts and a voice receptionist that answers when your team can't.",
        dayInTheLife: [
          { title: "12:15 — Bookings coming in on their own", body: "Guests book from Instagram and your Google profile. Confirmation and reminder go out automatically." },
          { title: "13:30 — Full house, orderly queue", body: "Walk-ins join the waiting list with a QR code and get a text when their table is ready." },
          { title: "14:45 — The bill and a tap", body: "When paying, the waiter points to the plate on the table. One tap and the guest is on the review form." },
          { title: "22:30 — Calls answered after closing", body: "The voice receptionist gives opening hours and directions, takes bookings for tomorrow and sends you a WhatsApp summary." },
        ],
        faq: [
          { q: "Do I need to replace my current booking system?", a: "Not necessarily. If you already use a platform you like, we can start with the plates and the waiting list. In the demo we look at what's worth keeping." },
          { q: "Will the plates survive a restaurant environment?", a: "Yes. They are made of tough acrylic, wipe clean with a damp cloth and the chip is sealed inside. Avoid bleach and abrasive products." },
          { q: "How long does it take to get everything running?", a: "The plates are ready within a few working days. Bookings and the waiting list are usually live in one to two weeks, including staff training." },
        ],
      },
      es: {
        name: "Restaurantes y cafeterías",
        cardTitle: "Restaurantes y cafeterías",
        cardBody: "Más reseñas en Google, mesas llenas sin llamadas perdidas y una lista de espera que no colapsa la puerta.",
        bundleTitle: "El pack para restaurantes",
        bundleBody: "Placas en las mesas y en la barra para pedir reseñas en el momento justo, reservas online con recordatorios que reducen las ausencias, lista de espera digital con aviso en el móvil y una recepcionista de voz que atiende cuando su equipo no puede.",
        metaTitle: "Placas e IA para restaurantes | Steevanz",
        metaDescription: "Placas para reseñas en Google, reservas online, lista de espera digital y recepcionista de voz con IA. Pensado para restaurantes y cafeterías en Portugal.",
        heroTitle: "La sala llena. El teléfono atendido. Las reseñas creciendo.",
        heroSubtitle: "En un restaurante, cada minuto de servicio cuenta. Reunimos las herramientas que quitan trabajo al equipo y traen más clientes por la puerta, sin apps que instalar y con la configuración hecha por nosotros.",
        pains: [
          { title: "Clientes satisfechos que nunca dejan una reseña", body: "Se van contentos, pero nadie se acuerda de buscar el restaurante en Google. Quienes escriben son sobre todo los descontentos." },
          { title: "El teléfono suena en plena hora punta", body: "Entre la cocina y la sala, nadie puede atender. Cada llamada perdida puede ser una mesa de cuatro que se ha ido al vecino." },
          { title: "Una cola en la puerta que desanima", body: "Grupos esperando en la acera sin saber cuánto falta. Muchos se van antes de que quede libre la mesa." },
        ],
        dayInTheLife: [
          { title: "12:15 — Reservas que entran solas", body: "Los clientes reservan desde Instagram y desde el perfil de Google. La confirmación y el recordatorio salen automáticamente." },
          { title: "13:30 — Casa llena, cola organizada", body: "Quien llega sin reserva se apunta a la lista de espera con un código QR y recibe un aviso en el móvil cuando su mesa está lista." },
          { title: "14:45 — La cuenta y un toque", body: "A la hora de pagar, el camarero señala la placa de la mesa. Un toque con el móvil y el cliente está en el formulario de reseña." },
          { title: "22:30 — Teléfono atendido tras el cierre", body: "La recepcionista de voz informa de horarios y dirección, acepta reservas para mañana y le envía un resumen por WhatsApp." },
        ],
        faq: [
          { q: "¿Tengo que cambiar mi sistema de reservas actual?", a: "No necesariamente. Si ya usa una plataforma que le gusta, podemos empezar por las placas y la lista de espera. En la demostración vemos qué conviene mantener." },
          { q: "¿Aguantan las placas el ambiente de un restaurante?", a: "Sí. Son de acrílico resistente, se limpian con un paño húmedo y el chip queda protegido dentro de la placa. No use lejía ni productos abrasivos." },
          { q: "¿Cuánto se tarda en ponerlo todo en marcha?", a: "Las placas están listas en pocos días laborables. Las reservas y la lista de espera suelen estar activas en una o dos semanas, incluida la formación del equipo." },
        ],
      },
      fr: {
        name: "Restaurants et cafés",
        cardTitle: "Restaurants et cafés",
        cardBody: "Plus d'avis Google, des tables pleines sans appels manqués et une liste d'attente qui ne bouche pas l'entrée.",
        bundleTitle: "La formule restaurants",
        bundleBody: "Des plaques sur les tables et au comptoir pour demander un avis au bon moment, des réservations en ligne avec des rappels qui réduisent les absences, une liste d'attente digitale avec alerte sur le téléphone et une réceptionniste vocale qui répond quand votre équipe ne peut pas.",
        metaTitle: "Plaques et IA pour restaurants | Steevanz",
        metaDescription: "Plaques pour avis Google, réservations en ligne, liste d'attente digitale et réceptionniste vocale IA. Conçu pour les restaurants et les cafés au Portugal.",
        heroTitle: "Une salle pleine. Chaque appel décroché. Des avis en hausse.",
        heroSubtitle: "Dans un restaurant, chaque minute de service compte. Nous réunissons les outils qui allègent le travail de votre équipe et font entrer plus de clients, sans application à installer et avec une configuration faite par nos soins.",
        pains: [
          { title: "Des clients satisfaits qui ne laissent jamais d'avis", body: "Ils repartent contents, mais personne ne pense à chercher le restaurant sur Google. Ceux qui écrivent sont surtout les mécontents." },
          { title: "Le téléphone sonne en plein coup de feu", body: "Entre la cuisine et la salle, personne ne peut décrocher. Chaque appel manqué peut être une table de quatre partie chez le voisin." },
          { title: "Une file à l'entrée qui décourage", body: "Des groupes qui attendent sur le trottoir sans savoir combien de temps il reste. Beaucoup renoncent avant qu'une table se libère." },
        ],
        dayInTheLife: [
          { title: "12:15 — Les réservations arrivent toutes seules", body: "Les clients réservent depuis Instagram et votre fiche Google. La confirmation et le rappel partent automatiquement." },
          { title: "13:30 — Salle comble, file organisée", body: "Ceux qui arrivent sans réservation s'inscrivent sur la liste d'attente avec un QR code et reçoivent une alerte sur leur téléphone quand la table est prête." },
          { title: "14:45 — L'addition et un toucher", body: "Au moment de payer, le serveur montre la plaque sur la table. Un toucher avec le téléphone et le client est sur le formulaire d'avis." },
          { title: "22:30 — Les appels décrochés après la fermeture", body: "La réceptionniste vocale donne les horaires et l'adresse, prend les réservations pour le lendemain et vous envoie un résumé sur WhatsApp." },
        ],
        faq: [
          { q: "Dois-je changer mon système de réservation actuel ?", a: "Pas forcément. Si vous utilisez déjà une plateforme qui vous plaît, nous pouvons commencer par les plaques et la liste d'attente. Lors de la démonstration, nous voyons ce qu'il vaut la peine de garder." },
          { q: "Les plaques résistent-elles à l'environnement d'un restaurant ?", a: "Oui. Elles sont en acrylique résistant, se nettoient avec un chiffon humide et la puce est protégée à l'intérieur de la plaque. N'utilisez ni eau de Javel ni produits abrasifs." },
          { q: "Combien de temps faut-il pour tout mettre en place ?", a: "Les plaques sont prêtes en quelques jours ouvrés. Les réservations et la liste d'attente sont en général actives en une à deux semaines, formation de l'équipe comprise." },
        ],
      },
      de: {
        name: "Restaurants und Cafés",
        cardTitle: "Restaurants und Cafés",
        cardBody: "Mehr Google-Bewertungen, volle Tische ohne verpasste Anrufe und eine Warteliste, die nicht die Tür versperrt.",
        bundleTitle: "Das Paket für Restaurants",
        bundleBody: "Schilder auf den Tischen und an der Theke, um im richtigen Moment um Bewertungen zu bitten, Online-Reservierungen mit Erinnerungen gegen No-Shows, eine digitale Warteliste mit Benachrichtigung aufs Handy und eine Telefonrezeption, die rangeht, wenn Ihr Team keine Hand frei hat.",
        metaTitle: "Schilder und KI für Restaurants | Steevanz",
        metaDescription: "Schilder für Google-Bewertungen, Online-Reservierungen, digitale Warteliste und KI-Telefonrezeption. Gemacht für Restaurants und Cafés in Portugal.",
        heroTitle: "Volles Haus. Jeder Anruf angenommen. Die Bewertungen steigen.",
        heroSubtitle: "Im Restaurant zählt jede Minute im Service. Wir bündeln die Werkzeuge, die Ihrem Team Arbeit abnehmen und mehr Gäste durch die Tür bringen, ohne Apps zum Installieren und von uns eingerichtet.",
        pains: [
          { title: "Zufriedene Gäste, die nie eine Bewertung schreiben", body: "Sie gehen zufrieden, aber niemand denkt daran, das Restaurant bei Google zu suchen. Wer schreibt, sind vor allem die Unzufriedenen." },
          { title: "Das Telefon klingelt mitten im Hochbetrieb", body: "Zwischen Küche und Gastraum kann niemand rangehen. Jeder verpasste Anruf kann ein Vierertisch sein, der zum Nachbarn geht." },
          { title: "Eine Schlange vor der Tür, die abschreckt", body: "Gruppen warten auf dem Gehweg, ohne zu wissen, wie lange es noch dauert. Viele geben auf, bevor ein Tisch frei wird." },
        ],
        dayInTheLife: [
          { title: "12:15 — Reservierungen kommen von allein", body: "Gäste reservieren über Instagram und Ihr Google-Profil. Bestätigung und Erinnerung gehen automatisch raus." },
          { title: "13:30 — Volles Haus, geordnete Warteschlange", body: "Wer ohne Reservierung kommt, trägt sich per QR-Code in die Warteliste ein und bekommt eine Nachricht aufs Handy, sobald der Tisch frei ist." },
          { title: "14:45 — Die Rechnung und ein Antippen", body: "Beim Bezahlen zeigt die Bedienung auf das Schild am Tisch. Einmal mit dem Handy antippen und der Gast ist im Bewertungsformular." },
          { title: "22:30 — Anrufe auch nach Feierabend angenommen", body: "Die Telefonrezeption nennt Öffnungszeiten und Adresse, nimmt Reservierungen für morgen an und schickt Ihnen eine Zusammenfassung per WhatsApp." },
        ],
        faq: [
          { q: "Muss ich mein bisheriges Reservierungssystem ersetzen?", a: "Nicht unbedingt. Wenn Sie bereits eine Plattform nutzen, mit der Sie zufrieden sind, beginnen wir mit den Schildern und der Warteliste. In der Demo schauen wir, was sich zu behalten lohnt." },
          { q: "Halten die Schilder den Restaurantalltag aus?", a: "Ja. Sie sind aus robustem Acryl, lassen sich mit einem feuchten Tuch reinigen und der Chip ist im Schild geschützt. Verwenden Sie keine Bleiche und keine Scheuermittel." },
          { q: "Wie lange dauert es, bis alles läuft?", a: "Die Schilder sind in wenigen Werktagen fertig. Reservierungen und Warteliste sind meist in ein bis zwei Wochen aktiv, inklusive Schulung des Teams." },
        ],
      },
      it: {
        name: "Ristoranti e bar",
        cardTitle: "Ristoranti e bar",
        cardBody: "Più recensioni su Google, tavoli pieni senza chiamate perse e una lista d'attesa che non intasa l'ingresso.",
        bundleTitle: "Il pacchetto per ristoranti",
        bundleBody: "Targhe sui tavoli e al banco per chiedere recensioni al momento giusto, prenotazioni online con promemoria che riducono le disdette, lista d'attesa digitale con avviso sul telefono e una receptionist vocale che risponde quando lo staff non può.",
        metaTitle: "Targhe e IA per ristoranti | Steevanz",
        metaDescription: "Targhe per recensioni Google, prenotazioni online, lista d'attesa digitale e receptionist vocale con IA. Pensato per ristoranti e bar in Portogallo.",
        heroTitle: "La sala piena. Il telefono che risponde. Le recensioni che crescono.",
        heroSubtitle: "In un ristorante ogni minuto di servizio conta. Riuniamo gli strumenti che tolgono lavoro allo staff e portano più clienti alla porta, senza app da installare e con la configurazione fatta da noi.",
        pains: [
          { title: "Clienti soddisfatti che non lasciano mai una recensione", body: "Escono contenti, ma nessuno si ricorda di cercare il ristorante su Google. Chi scrive sono soprattutto gli scontenti." },
          { title: "Il telefono squilla in pieno servizio", body: "Tra cucina e sala nessuno può rispondere. Ogni chiamata persa può essere un tavolo da quattro finito dal vicino." },
          { title: "Una coda alla porta che scoraggia", body: "Gruppi in attesa sul marciapiede senza sapere quanto manca. Molti rinunciano prima che il tavolo si liberi." },
        ],
        dayInTheLife: [
          { title: "12:15 — Prenotazioni che arrivano da sole", body: "I clienti prenotano da Instagram e dal profilo Google. Conferma e promemoria partono in automatico." },
          { title: "13:30 — Tutto pieno, coda ordinata", body: "Chi arriva senza prenotazione si iscrive alla lista d'attesa con un codice QR e riceve un avviso sul telefono quando il tavolo è pronto." },
          { title: "14:45 — Il conto e un tocco", body: "Al momento di pagare, il cameriere indica la targa sul tavolo. Un tocco con il telefono e il cliente è nel modulo della recensione." },
          { title: "22:30 — Telefono che risponde dopo la chiusura", body: "La receptionist vocale comunica orari e indirizzo, accetta prenotazioni per domani e Le invia un riepilogo su WhatsApp." },
        ],
        faq: [
          { q: "Devo cambiare il mio attuale sistema di prenotazione?", a: "Non necessariamente. Se usa già una piattaforma che Le piace, possiamo iniziare dalle targhe e dalla lista d'attesa. Nella demo valutiamo cosa conviene tenere." },
          { q: "Le targhe resistono all'ambiente di un ristorante?", a: "Sì. Sono in acrilico resistente, si puliscono con un panno umido e il chip è protetto all'interno della targa. Non usi candeggina né prodotti abrasivi." },
          { q: "Quanto tempo serve per mettere tutto in funzione?", a: "Le targhe sono pronte in pochi giorni lavorativi. Prenotazioni e lista d'attesa sono di solito attive in una o due settimane, formazione dello staff compresa." },
        ],
      },
    },
  },
  {
    id: "beauty",
    slug: sectorSlugs.beauty,
    photo: "salon-chair",
    side: { kind: "photo", photo: "retail" },
    bundle: ["bookings", "google-review-plates", "loyalty", "ai-chatbot"],
    copy: {
      pt: {
        name: "Cabeleireiros e estética",
        cardTitle: "Cabeleireiros e estética",
        cardBody: "Agenda sempre cheia, menos faltas e clientes que voltam por causa do cartão de fidelidade no telemóvel.",
        metaTitle: "Marcações online e placas para cabeleireiros | Steevanz",
        metaDescription: "Agenda online com lembretes por email, placas para reviews, cartão de fidelidade digital e chatbot com IA para cabeleireiros e centros de estética.",
        heroTitle: "Mãos ocupadas com clientes, não com o telemóvel.",
        heroSubtitle: "Entre um corte e uma coloração não há tempo para responder a mensagens. Deixe as marcações, os lembretes e as perguntas repetidas connosco e concentre-se no que faz melhor.",
        pains: [
          { title: "Mensagens a toda a hora para marcar", body: "\"Tem vaga sábado?\" chega por Instagram, WhatsApp e telefone, muitas vezes enquanto está com um cliente na cadeira." },
          { title: "Faltas que deixam buracos na agenda", body: "Uma marcação esquecida é uma hora de trabalho perdida que já não se recupera." },
          { title: "Clientes que experimentam e não voltam", body: "Sem um motivo concreto para regressar, é fácil o cliente ir ao salão mais perto de casa na próxima vez." },
        ],
        bundleTitle: "O pacote para salões",
        bundleBody: "Marcações online por serviço e por profissional, lembretes automáticos, cartão de fidelidade sem app, placas para reviews junto ao espelho ou à caixa e um chatbot que responde a preços e disponibilidade 24 horas por dia.",
        dayInTheLife: [
          { title: "08:00 — Agenda do dia já confirmada", body: "Os lembretes saíram na véspera. Quem não pode vir remarcou sozinho e a vaga voltou a ficar disponível." },
          { title: "11:00 — Perguntas respondidas sem parar o trabalho", body: "O chatbot responde a preços, duração dos serviços e horários, e envia o link de marcação." },
          { title: "16:30 — Carimbo digital na caixa", body: "O cliente encosta o telemóvel e ganha mais um carimbo. Ao décimo, o tratamento de oferta aparece automaticamente." },
          { title: "19:00 — Review no Google antes de sair", body: "Uma placa discreta ao lado do espelho lembra o cliente de partilhar o novo visual e a experiência." },
        ],
        faq: [
          { q: "Cada profissional pode ter a sua própria agenda?", a: "Sim. Cada pessoa tem os seus serviços, horários e folgas. O cliente pode escolher com quem quer marcar ou deixar ao critério do salão." },
          { q: "O cartão de fidelidade obriga os clientes a instalar uma app?", a: "Não. O cartão abre no navegador e pode ficar no ecrã principal do telemóvel. O cliente só precisa de um toque ou de ler um QR code." },
          { q: "Posso cobrar um sinal nas marcações mais longas?", a: "Podemos configurar pedido de sinal para serviços específicos, como colorações ou tratamentos longos. Falamos dos detalhes na demonstração." },
        ],
      },
      en: {
        name: "Hair salons and beauty",
        cardTitle: "Hair salons and beauty",
        cardBody: "A full diary, fewer no-shows and clients who come back thanks to a loyalty card on their phone.",
        metaTitle: "Online bookings and review plates for salons | Steevanz",
        metaDescription: "Online appointments with email reminders, plates for Google reviews, a digital loyalty card and an AI chatbot for hair salons and beauty clinics.",
        heroTitle: "Hands busy with clients, not with your phone.",
        heroSubtitle: "Between a cut and a colour there's no time to answer messages. Leave bookings, reminders and repeated questions to us and focus on what you do best.",
        pains: [
          { title: "Booking messages all day long", body: "\"Any slots on Saturday?\" arrives via Instagram, WhatsApp and phone, often while you have a client in the chair." },
          { title: "No-shows that leave gaps in the diary", body: "A forgotten appointment is an hour of work lost that you never get back." },
          { title: "Clients who try you once and don't return", body: "Without a clear reason to come back, it's easy for a client to pick the salon closest to home next time." },
        ],
        bundleTitle: "The salon bundle",
        bundleBody: "Online bookings by service and by stylist, automatic reminders, a loyalty card with no app, review plates by the mirror or the till and a chatbot that answers prices and availability around the clock.",
        dayInTheLife: [
          { title: "08:00 — Today's diary already confirmed", body: "Reminders went out yesterday. Anyone who can't make it rescheduled on their own and the slot opened up again." },
          { title: "11:00 — Questions answered without stopping work", body: "The chatbot answers prices, service lengths and opening hours, then sends the booking link." },
          { title: "16:30 — A digital stamp at the till", body: "The client taps their phone and earns another stamp. On the tenth, the free treatment appears automatically." },
          { title: "19:00 — A Google review before leaving", body: "A discreet plate next to the mirror reminds clients to share their new look and experience." },
        ],
        faq: [
          { q: "Can each stylist have their own diary?", a: "Yes. Each person has their own services, hours and days off. Clients can choose who to book with or leave it to the salon." },
          { q: "Do clients need to install an app for the loyalty card?", a: "No. The card opens in the browser and can sit on the phone's home screen. Clients just tap or scan a QR code." },
          { q: "Can I take a deposit for longer appointments?", a: "We can set up deposits for specific services such as colouring or long treatments. We'll go through the details in the demo." },
        ],
      },
      es: {
        name: "Peluquerías y estética",
        cardTitle: "Peluquerías y estética",
        cardBody: "Agenda siempre llena, menos ausencias y clientes que vuelven gracias a la tarjeta de cliente en el móvil.",
        bundleTitle: "El pack para salones",
        bundleBody: "Citas online por servicio y por profesional, recordatorios automáticos, tarjeta de cliente sin app, placas para reseñas junto al espejo o a la caja y un chatbot que responde a precios y disponibilidad las 24 horas.",
        metaTitle: "Citas online y placas para peluquerías | Steevanz",
        metaDescription: "Agenda online con recordatorios por correo, placas para reseñas, tarjeta de cliente digital y chatbot con IA para peluquerías y centros de estética.",
        heroTitle: "Las manos ocupadas con los clientes, no con el móvil.",
        heroSubtitle: "Entre un corte y un tinte no hay tiempo para responder mensajes. Deje en nuestras manos las citas, los recordatorios y las preguntas repetidas, y céntrese en lo que mejor sabe hacer.",
        pains: [
          { title: "Mensajes a todas horas para pedir cita", body: "\"¿Tiene hueco el sábado?\" llega por Instagram, WhatsApp y teléfono, muchas veces mientras tiene a un cliente en el sillón." },
          { title: "Ausencias que dejan huecos en la agenda", body: "Una cita olvidada es una hora de trabajo perdida que ya no se recupera." },
          { title: "Clientes que prueban y no vuelven", body: "Sin un motivo concreto para regresar, es fácil que el cliente vaya la próxima vez al salón más cercano a su casa." },
        ],
        dayInTheLife: [
          { title: "08:00 — La agenda del día ya confirmada", body: "Los recordatorios salieron la víspera. Quien no puede venir ha cambiado la cita por su cuenta y el hueco ha vuelto a quedar libre." },
          { title: "11:00 — Preguntas respondidas sin dejar de trabajar", body: "El chatbot responde sobre precios, duración de los servicios y horarios, y envía el enlace para pedir cita." },
          { title: "16:30 — Sello digital en la caja", body: "El cliente acerca el móvil y suma un sello más. Al décimo, el tratamiento de regalo aparece automáticamente." },
          { title: "19:00 — Reseña en Google antes de salir", body: "Una placa discreta junto al espejo recuerda al cliente que comparta su nuevo look y su experiencia." },
        ],
        faq: [
          { q: "¿Puede cada profesional tener su propia agenda?", a: "Sí. Cada persona tiene sus servicios, horarios y días libres. El cliente puede elegir con quién quiere la cita o dejarlo a criterio del salón." },
          { q: "¿La tarjeta de cliente obliga a instalar una app?", a: "No. La tarjeta se abre en el navegador y puede quedarse en la pantalla de inicio del móvil. El cliente solo necesita un toque o leer un código QR." },
          { q: "¿Puedo cobrar una señal en las citas más largas?", a: "Podemos configurar una señal para servicios concretos, como tintes o tratamientos largos. Hablamos de los detalles en la demostración." },
        ],
      },
      fr: {
        name: "Coiffure et esthétique",
        cardTitle: "Coiffure et esthétique",
        cardBody: "Un agenda toujours plein, moins de rendez-vous manqués et des clients qui reviennent grâce à la carte de fidélité sur leur téléphone.",
        bundleTitle: "La formule salons",
        bundleBody: "Rendez-vous en ligne par prestation et par professionnel, rappels automatiques, carte de fidélité sans application, plaques pour avis près du miroir ou de la caisse et un chatbot qui répond sur les prix et les disponibilités 24 h/24.",
        metaTitle: "Rendez-vous en ligne et plaques pour salons de coiffure | Steevanz",
        metaDescription: "Agenda en ligne avec rappels par e-mail, plaques pour avis, carte de fidélité digitale et chatbot IA pour salons de coiffure et instituts de beauté.",
        heroTitle: "Les mains occupées par vos clients, pas par votre téléphone.",
        heroSubtitle: "Entre une coupe et une coloration, pas le temps de répondre aux messages. Confiez-nous les rendez-vous, les rappels et les questions répétitives, et concentrez-vous sur ce que vous faites le mieux.",
        pains: [
          { title: "Des messages à toute heure pour prendre rendez-vous", body: "« Vous avez de la place samedi ? » arrive par Instagram, WhatsApp et téléphone, souvent pendant que vous avez un client dans le fauteuil." },
          { title: "Des absences qui laissent des trous dans l'agenda", body: "Un rendez-vous oublié, c'est une heure de travail perdue qui ne se rattrape pas." },
          { title: "Des clients qui essaient une fois et ne reviennent pas", body: "Sans raison concrète de revenir, le client ira facilement au salon le plus proche de chez lui la prochaine fois." },
        ],
        dayInTheLife: [
          { title: "08:00 — L'agenda du jour déjà confirmé", body: "Les rappels sont partis la veille. Ceux qui ne pouvaient pas venir ont déplacé leur rendez-vous eux-mêmes et le créneau s'est libéré." },
          { title: "11:00 — Les questions traitées sans arrêter le travail", body: "Le chatbot répond sur les prix, la durée des prestations et les horaires, puis envoie le lien de réservation." },
          { title: "16:30 — Un tampon digital à la caisse", body: "Le client approche son téléphone et gagne un tampon de plus. Au dixième, le soin offert apparaît automatiquement." },
          { title: "19:00 — Un avis Google avant de partir", body: "Une plaque discrète à côté du miroir rappelle au client de partager sa nouvelle coupe et son expérience." },
        ],
        faq: [
          { q: "Chaque professionnel peut-il avoir son propre agenda ?", a: "Oui. Chaque personne a ses prestations, ses horaires et ses jours de repos. Le client peut choisir avec qui prendre rendez-vous ou laisser le salon décider." },
          { q: "La carte de fidélité oblige-t-elle les clients à installer une application ?", a: "Non. La carte s'ouvre dans le navigateur et peut rester sur l'écran d'accueil du téléphone. Le client n'a besoin que d'un toucher ou de scanner un QR code." },
          { q: "Puis-je demander un acompte pour les rendez-vous longs ?", a: "Nous pouvons configurer un acompte pour certaines prestations, comme les colorations ou les soins longs. Nous en parlons en détail lors de la démonstration." },
        ],
      },
      de: {
        name: "Friseur und Kosmetik",
        cardTitle: "Friseur und Kosmetik",
        cardBody: "Ein immer voller Terminkalender, weniger No-Shows und Kunden, die dank der Kundenkarte auf dem Handy wiederkommen.",
        bundleTitle: "Das Paket für Salons",
        bundleBody: "Online-Termine nach Leistung und Mitarbeiter, automatische Erinnerungen, eine Kundenkarte ohne App, Bewertungsschilder am Spiegel oder an der Kasse und ein Chatbot, der rund um die Uhr Preise und freie Termine beantwortet.",
        metaTitle: "Online-Termine und Bewertungsschilder für Friseursalons | Steevanz",
        metaDescription: "Online-Terminkalender mit E-Mail-Erinnerungen, Schilder für Bewertungen, digitale Kundenkarte und KI-Chatbot für Friseursalons und Kosmetikstudios.",
        heroTitle: "Hände frei für Ihre Kunden, nicht fürs Handy.",
        heroSubtitle: "Zwischen Schnitt und Farbe bleibt keine Zeit, Nachrichten zu beantworten. Überlassen Sie uns Termine, Erinnerungen und die immer gleichen Fragen und konzentrieren Sie sich auf das, was Sie am besten können.",
        pains: [
          { title: "Terminanfragen zu jeder Tageszeit", body: "„Haben Sie Samstag noch was frei?“ kommt per Instagram, WhatsApp und Telefon, oft dann, wenn gerade ein Kunde im Stuhl sitzt." },
          { title: "No-Shows, die Lücken in den Kalender reißen", body: "Ein vergessener Termin ist eine verlorene Arbeitsstunde, die sich nicht mehr aufholen lässt." },
          { title: "Kunden, die einmal kommen und nicht wieder", body: "Ohne einen konkreten Grund zurückzukommen, geht der Kunde beim nächsten Mal leicht zum Salon um die Ecke." },
        ],
        dayInTheLife: [
          { title: "08:00 — Der Tageskalender ist schon bestätigt", body: "Die Erinnerungen gingen am Vortag raus. Wer nicht kommen kann, hat selbst umgebucht und der Termin ist wieder frei." },
          { title: "11:00 — Fragen beantwortet, ohne die Arbeit zu unterbrechen", body: "Der Chatbot beantwortet Fragen zu Preisen, Dauer der Leistungen und Öffnungszeiten und schickt den Buchungslink." },
          { title: "16:30 — Digitaler Stempel an der Kasse", body: "Der Kunde hält das Handy ans Schild und bekommt einen weiteren Stempel. Beim zehnten erscheint die Gratisbehandlung automatisch." },
          { title: "19:00 — Google-Bewertung vor dem Gehen", body: "Ein dezentes Schild neben dem Spiegel erinnert den Kunden daran, seinen neuen Look und seine Erfahrung zu teilen." },
        ],
        faq: [
          { q: "Kann jede Mitarbeiterin und jeder Mitarbeiter einen eigenen Kalender haben?", a: "Ja. Jede Person hat ihre eigenen Leistungen, Arbeitszeiten und freien Tage. Der Kunde kann wählen, bei wem er bucht, oder es dem Salon überlassen." },
          { q: "Müssen Kunden für die Kundenkarte eine App installieren?", a: "Nein. Die Karte öffnet sich im Browser und kann auf dem Startbildschirm des Handys bleiben. Der Kunde braucht nur ein Antippen oder einen QR-Code." },
          { q: "Kann ich bei längeren Terminen eine Anzahlung verlangen?", a: "Wir können eine Anzahlung für bestimmte Leistungen einrichten, etwa Colorationen oder lange Behandlungen. Die Details besprechen wir in der Demo." },
        ],
      },
      it: {
        name: "Parrucchieri ed estetica",
        cardTitle: "Parrucchieri ed estetica",
        cardBody: "Agenda sempre piena, meno disdette e clienti che tornano grazie alla carta fedeltà sullo smartphone.",
        bundleTitle: "Il pacchetto per saloni",
        bundleBody: "Appuntamenti online per servizio e per professionista, promemoria automatici, carta fedeltà senza app, targhe per recensioni vicino allo specchio o alla cassa e un chatbot che risponde su prezzi e disponibilità 24 ore su 24.",
        metaTitle: "Appuntamenti online e targhe per parrucchieri | Steevanz",
        metaDescription: "Agenda online con promemoria via e-mail, targhe per recensioni, carta fedeltà digitale e chatbot con IA per parrucchieri e centri estetici.",
        heroTitle: "Mani occupate con i clienti, non con il telefono.",
        heroSubtitle: "Tra un taglio e un colore non c'è tempo per rispondere ai messaggi. Lasci a noi appuntamenti, promemoria e domande ripetute e si concentri su ciò che sa fare meglio.",
        pains: [
          { title: "Messaggi a tutte le ore per prenotare", body: "\"Avete posto sabato?\" arriva su Instagram, WhatsApp e al telefono, spesso mentre ha un cliente sulla poltrona." },
          { title: "Disdette che lasciano buchi in agenda", body: "Un appuntamento dimenticato è un'ora di lavoro persa che non si recupera più." },
          { title: "Clienti che provano e non tornano", body: "Senza un motivo concreto per tornare, è facile che la volta dopo il cliente scelga il salone più vicino a casa." },
        ],
        dayInTheLife: [
          { title: "08:00 — L'agenda del giorno è già confermata", body: "I promemoria sono partiti il giorno prima. Chi non può venire ha spostato l'appuntamento da solo e il posto è tornato libero." },
          { title: "11:00 — Domande risolte senza fermare il lavoro", body: "Il chatbot risponde su prezzi, durata dei servizi e orari, e invia il link per prenotare." },
          { title: "16:30 — Timbro digitale alla cassa", body: "Il cliente avvicina il telefono e guadagna un altro timbro. Al decimo, il trattamento omaggio compare in automatico." },
          { title: "19:00 — Recensione su Google prima di uscire", body: "Una targa discreta accanto allo specchio ricorda al cliente di condividere il nuovo look e la sua esperienza." },
        ],
        faq: [
          { q: "Ogni professionista può avere la propria agenda?", a: "Sì. Ogni persona ha i propri servizi, orari e giorni liberi. Il cliente può scegliere con chi prenotare o lasciar decidere al salone." },
          { q: "La carta fedeltà obbliga i clienti a installare un'app?", a: "No. La carta si apre nel browser e può restare nella schermata principale del telefono. Al cliente basta un tocco o la lettura di un codice QR." },
          { q: "Posso chiedere un acconto per gli appuntamenti più lunghi?", a: "Possiamo configurare la richiesta di un acconto per servizi specifici, come colorazioni o trattamenti lunghi. Ne parliamo nel dettaglio durante la demo." },
        ],
      },
    },
  },
  {
    id: "clinics",
    slug: sectorSlugs.clinics,
    photo: "clinic",
    side: { kind: "photo", photo: "reception-phone" },
    bundle: ["bookings", "ai-voice", "waitlist", "ai-reviews"],
    copy: {
      pt: {
        name: "Clínicas e consultórios",
        cardTitle: "Clínicas e consultórios",
        cardBody: "Receção que atende sempre, marcações com lembrete e uma sala de espera mais calma para os pacientes.",
        metaTitle: "Receção com IA e marcações para clínicas | Steevanz",
        metaDescription: "Receção por voz com IA, marcações online com lembretes, sala de espera digital e gestão de reviews para clínicas dentárias, fisioterapia e consultórios.",
        heroTitle: "Uma receção que nunca deixa um paciente sem resposta.",
        heroSubtitle: "A receção de uma clínica divide-se entre o balcão, o telefone e os e-mails. Automatizamos o que é repetitivo para que a equipa tenha tempo para as pessoas que estão à sua frente.",
        pains: [
          { title: "Chamadas perdidas são consultas perdidas", body: "Quando a rececionista está a atender um paciente ao balcão, o telefone fica a tocar. Muitos não voltam a ligar." },
          { title: "Faltas às consultas", body: "Cada falta sem aviso é tempo clínico desperdiçado e um paciente em lista de espera que podia ter sido atendido." },
          { title: "Uma sala de espera cheia e ansiosa", body: "Sem saber quanto falta, os pacientes perguntam repetidamente ao balcão e a tensão aumenta." },
        ],
        bundleTitle: "O pacote para clínicas",
        bundleBody: "Receção por voz com IA que atende, esclarece dúvidas administrativas e marca consultas, agenda online por tipo de consulta e profissional, aviso no telemóvel quando é a vez do paciente e acompanhamento das reviews no Google.",
        dayInTheLife: [
          { title: "07:45 — Marcações feitas durante a noite", body: "Pacientes que ligaram fora de horas foram atendidos pela receção por voz e as consultas já estão na agenda." },
          { title: "10:00 — Balcão livre para quem chega", body: "As dúvidas sobre horários, acordos e preparação para exames são respondidas automaticamente ao telefone." },
          { title: "15:20 — Espera sem ansiedade", body: "O paciente acompanha a fila no telemóvel e é avisado quando chega a sua vez." },
          { title: "18:30 — Reviews acompanhadas", body: "Recebe um alerta se surgir uma review negativa e uma proposta de resposta cuidadosa, sem dados clínicos." },
        ],
        faq: [
          { q: "A IA dá conselhos médicos aos pacientes?", a: "Não. A receção por voz e o chatbot tratam apenas de questões administrativas: horários, marcações, preços e preparação indicada pela clínica. Situações clínicas são encaminhadas para a equipa." },
          { q: "Como são tratados os dados dos pacientes?", a: "Recolhemos apenas o necessário para a marcação, com base legal adequada ao RGPD, e assinamos um acordo de subcontratação com a clínica. Dados de saúde não são pedidos nem guardados pelos nossos sistemas." },
          { q: "Funciona com vários médicos e especialidades?", a: "Sim. Cada profissional tem a sua agenda, tipos de consulta, durações e horários próprios." },
        ],
      },
      en: {
        name: "Clinics and practices",
        cardTitle: "Clinics and practices",
        cardBody: "A front desk that always answers, appointments with reminders and a calmer waiting room for patients.",
        metaTitle: "AI receptionist and bookings for clinics | Steevanz",
        metaDescription: "AI voice receptionist, online appointments with reminders, a digital waiting room and review management for dental clinics, physiotherapy and private practices.",
        heroTitle: "A front desk that never leaves a patient unanswered.",
        heroSubtitle: "A clinic's front desk is split between the counter, the phone and the inbox. We automate the repetitive work so your team has time for the people in front of them.",
        pains: [
          { title: "Missed calls are missed appointments", body: "When the receptionist is helping a patient at the desk, the phone keeps ringing. Many callers never try again." },
          { title: "Appointment no-shows", body: "Every unannounced no-show is wasted clinical time and a patient on the waiting list who could have been seen." },
          { title: "A crowded, anxious waiting room", body: "Without knowing how long is left, patients keep asking at the desk and tension rises." },
        ],
        bundleTitle: "The clinic bundle",
        bundleBody: "An AI voice receptionist that answers, handles admin questions and books appointments, online scheduling by appointment type and practitioner, phone alerts when it's the patient's turn and monitoring of your Google reviews.",
        dayInTheLife: [
          { title: "07:45 — Appointments booked overnight", body: "Patients who called after hours were handled by the voice receptionist and their appointments are already in the diary." },
          { title: "10:00 — A free desk for walk-ins", body: "Questions about hours, insurance agreements and test preparation are answered automatically on the phone." },
          { title: "15:20 — Waiting without anxiety", body: "Patients can step out for a coffee. They get a text when their appointment is a few minutes away." },
          { title: "18:30 — Reviews under control", body: "You get an alert if a negative review appears, plus a careful draft reply with no clinical details." },
        ],
        faq: [
          { q: "Does the AI give patients medical advice?", a: "No. The voice receptionist and chatbot handle administrative questions only: hours, appointments, prices and preparation instructions set by the clinic. Clinical matters are passed to your team." },
          { q: "How is patient data handled?", a: "We collect only what is needed for the booking, on a lawful GDPR basis, and sign a data processing agreement with the clinic. Our systems do not ask for or store health data." },
          { q: "Does it work with multiple doctors and specialities?", a: "Yes. Each practitioner has their own diary, appointment types, durations and hours." },
        ],
      },
      es: {
        name: "Clínicas y consultas",
        cardTitle: "Clínicas y consultas",
        cardBody: "Una recepción que siempre atiende, citas con recordatorio y una sala de espera más tranquila para los pacientes.",
        bundleTitle: "El pack para clínicas",
        bundleBody: "Recepcionista de voz con IA que atiende, resuelve dudas administrativas y da citas, agenda online por tipo de consulta y profesional, aviso en el móvil cuando le toca al paciente y seguimiento de las reseñas en Google.",
        metaTitle: "Recepción con IA y citas para clínicas | Steevanz",
        metaDescription: "Recepcionista de voz con IA, citas online con recordatorios, sala de espera digital y gestión de reseñas para clínicas dentales, fisioterapia y consultas.",
        heroTitle: "Una recepción que nunca deja a un paciente sin respuesta.",
        heroSubtitle: "La recepción de una clínica se reparte entre el mostrador, el teléfono y el correo. Automatizamos lo repetitivo para que el equipo tenga tiempo para las personas que tiene delante.",
        pains: [
          { title: "Llamadas perdidas son citas perdidas", body: "Cuando la recepcionista atiende a un paciente en el mostrador, el teléfono sigue sonando. Muchos no vuelven a llamar." },
          { title: "Pacientes que no acuden a la cita", body: "Cada ausencia sin aviso es tiempo clínico desperdiciado y un paciente en lista de espera que podría haber sido atendido." },
          { title: "Una sala de espera llena y nerviosa", body: "Sin saber cuánto falta, los pacientes preguntan una y otra vez en el mostrador y la tensión aumenta." },
        ],
        dayInTheLife: [
          { title: "07:45 — Citas dadas durante la noche", body: "Los pacientes que llamaron fuera de horario fueron atendidos por la recepcionista de voz y sus citas ya están en la agenda." },
          { title: "10:00 — Mostrador libre para quien llega", body: "Las dudas sobre horarios, convenios y preparación de pruebas se responden automáticamente por teléfono." },
          { title: "15:20 — Esperar sin nervios", body: "El paciente sigue la cola en el móvil y recibe un aviso cuando le toca." },
          { title: "18:30 — Reseñas bajo control", body: "Recibe una alerta si aparece una reseña negativa y una propuesta de respuesta cuidadosa, sin datos clínicos." },
        ],
        faq: [
          { q: "¿La IA da consejos médicos a los pacientes?", a: "No. La recepcionista de voz y el chatbot solo tratan cuestiones administrativas: horarios, citas, precios y la preparación indicada por la clínica. Las situaciones clínicas se derivan al equipo." },
          { q: "¿Cómo se tratan los datos de los pacientes?", a: "Recogemos solo lo necesario para la cita, con una base legal adecuada al RGPD, y firmamos un contrato de encargo del tratamiento con la clínica. Nuestros sistemas no piden ni guardan datos de salud." },
          { q: "¿Funciona con varios médicos y especialidades?", a: "Sí. Cada profesional tiene su propia agenda, tipos de consulta, duraciones y horarios." },
        ],
      },
      fr: {
        name: "Cliniques et cabinets",
        cardTitle: "Cliniques et cabinets",
        cardBody: "Un accueil qui répond toujours, des rendez-vous avec rappel et une salle d'attente plus sereine pour les patients.",
        bundleTitle: "La formule cliniques",
        bundleBody: "Une réceptionniste vocale IA qui répond, traite les questions administratives et prend les rendez-vous, un agenda en ligne par type de consultation et par praticien, une alerte sur le téléphone quand c'est le tour du patient et un suivi de vos avis Google.",
        metaTitle: "Accueil IA et rendez-vous pour cliniques | Steevanz",
        metaDescription: "Réceptionniste vocale IA, rendez-vous en ligne avec rappels, salle d'attente digitale et gestion des avis pour cabinets dentaires, kinésithérapeutes et cabinets médicaux.",
        heroTitle: "Un accueil qui ne laisse jamais un patient sans réponse.",
        heroSubtitle: "L'accueil d'une clinique se partage entre le comptoir, le téléphone et les e-mails. Nous automatisons les tâches répétitives pour que votre équipe ait du temps pour les personnes en face d'elle.",
        pains: [
          { title: "Un appel manqué, c'est une consultation perdue", body: "Quand la secrétaire s'occupe d'un patient au comptoir, le téléphone continue de sonner. Beaucoup ne rappellent pas." },
          { title: "Les rendez-vous non honorés", body: "Chaque absence sans prévenir, c'est du temps médical perdu et un patient sur liste d'attente qui aurait pu être reçu." },
          { title: "Une salle d'attente pleine et anxieuse", body: "Sans savoir combien de temps il reste, les patients reviennent sans cesse demander au comptoir et la tension monte." },
        ],
        dayInTheLife: [
          { title: "07:45 — Des rendez-vous pris pendant la nuit", body: "Les patients qui ont appelé en dehors des heures d'ouverture ont été pris en charge par la réceptionniste vocale et leurs rendez-vous sont déjà dans l'agenda." },
          { title: "10:00 — Un comptoir libre pour ceux qui arrivent", body: "Les questions sur les horaires, les conventions et la préparation des examens reçoivent une réponse automatique au téléphone." },
          { title: "15:20 — Attendre sans stress", body: "Le patient suit la file sur son téléphone et reçoit une alerte quand vient son tour." },
          { title: "18:30 — Des avis sous contrôle", body: "Vous recevez une alerte si un avis négatif apparaît, avec une proposition de réponse soignée, sans aucune donnée médicale." },
        ],
        faq: [
          { q: "L'IA donne-t-elle des conseils médicaux aux patients ?", a: "Non. La réceptionniste vocale et le chatbot traitent uniquement les questions administratives : horaires, rendez-vous, tarifs et préparation indiquée par la clinique. Les situations cliniques sont transmises à votre équipe." },
          { q: "Comment les données des patients sont-elles traitées ?", a: "Nous collectons uniquement ce qui est nécessaire au rendez-vous, sur une base légale conforme au RGPD, et signons un contrat de sous-traitance avec la clinique. Nos systèmes ne demandent ni ne conservent de données de santé." },
          { q: "Cela fonctionne-t-il avec plusieurs médecins et spécialités ?", a: "Oui. Chaque praticien a son propre agenda, ses types de consultation, ses durées et ses horaires." },
        ],
      },
      de: {
        name: "Kliniken und Praxen",
        cardTitle: "Kliniken und Praxen",
        cardBody: "Ein Empfang, der immer erreichbar ist, Termine mit Erinnerung und ein ruhigeres Wartezimmer für Ihre Patienten.",
        bundleTitle: "Das Paket für Praxen",
        bundleBody: "Eine KI-Telefonrezeption, die Anrufe annimmt, organisatorische Fragen klärt und Termine vergibt, Online-Terminplanung nach Behandlungsart und Behandler, eine Benachrichtigung aufs Handy, wenn der Patient an der Reihe ist, und die Betreuung Ihrer Google-Bewertungen.",
        metaTitle: "KI-Empfang und Terminbuchung für Praxen | Steevanz",
        metaDescription: "KI-Telefonrezeption, Online-Termine mit Erinnerungen, digitales Wartezimmer und Bewertungsmanagement für Zahnarztpraxen, Physiotherapie und Arztpraxen.",
        heroTitle: "Ein Empfang, der keinen Patienten ohne Antwort lässt.",
        heroSubtitle: "Der Empfang einer Praxis pendelt zwischen Tresen, Telefon und E-Mails. Wir automatisieren das Wiederkehrende, damit Ihr Team Zeit für die Menschen hat, die vor ihm stehen.",
        pains: [
          { title: "Verpasste Anrufe sind verpasste Termine", body: "Wenn die Rezeption einen Patienten am Tresen betreut, klingelt das Telefon weiter. Viele rufen nicht noch einmal an." },
          { title: "Nicht wahrgenommene Termine", body: "Jeder unangekündigt versäumte Termin ist verlorene Behandlungszeit und ein Patient auf der Warteliste, der hätte drankommen können." },
          { title: "Ein volles, unruhiges Wartezimmer", body: "Ohne zu wissen, wie lange es noch dauert, fragen Patienten immer wieder am Tresen nach und die Anspannung steigt." },
        ],
        dayInTheLife: [
          { title: "07:45 — Termine über Nacht vergeben", body: "Patienten, die außerhalb der Sprechzeiten angerufen haben, wurden von der Telefonrezeption betreut und ihre Termine stehen schon im Kalender." },
          { title: "10:00 — Ein freier Tresen für alle, die kommen", body: "Fragen zu Sprechzeiten, Kassenverträgen und zur Vorbereitung auf Untersuchungen werden am Telefon automatisch beantwortet." },
          { title: "15:20 — Warten ohne Stress", body: "Der Patient verfolgt die Warteschlange auf dem Handy und wird benachrichtigt, wenn er an der Reihe ist." },
          { title: "18:30 — Bewertungen im Blick", body: "Sie erhalten eine Meldung, wenn eine negative Bewertung erscheint, und einen sorgfältigen Antwortvorschlag ohne medizinische Angaben." },
        ],
        faq: [
          { q: "Gibt die KI den Patienten medizinische Ratschläge?", a: "Nein. Telefonrezeption und Chatbot kümmern sich nur um Organisatorisches: Sprechzeiten, Termine, Preise und die von der Praxis vorgegebene Vorbereitung. Medizinische Anliegen werden an Ihr Team weitergeleitet." },
          { q: "Wie werden Patientendaten behandelt?", a: "Wir erheben nur, was für den Termin nötig ist, auf einer DSGVO-konformen Rechtsgrundlage, und schließen mit der Praxis einen Auftragsverarbeitungsvertrag. Gesundheitsdaten werden von unseren Systemen weder abgefragt noch gespeichert." },
          { q: "Funktioniert das mit mehreren Ärzten und Fachrichtungen?", a: "Ja. Jeder Behandler hat seinen eigenen Kalender, eigene Terminarten, Dauern und Sprechzeiten." },
        ],
      },
      it: {
        name: "Cliniche e studi",
        cardTitle: "Cliniche e studi",
        cardBody: "Una reception che risponde sempre, appuntamenti con promemoria e una sala d'attesa più tranquilla per i pazienti.",
        bundleTitle: "Il pacchetto per cliniche",
        bundleBody: "Receptionist vocale con IA che risponde, chiarisce dubbi amministrativi e fissa appuntamenti, agenda online per tipo di visita e professionista, avviso sul telefono quando tocca al paziente e monitoraggio delle recensioni Google.",
        metaTitle: "Reception con IA e appuntamenti per cliniche | Steevanz",
        metaDescription: "Receptionist vocale con IA, appuntamenti online con promemoria, sala d'attesa digitale e gestione delle recensioni per studi dentistici, fisioterapia e studi medici.",
        heroTitle: "Una reception che non lascia mai un paziente senza risposta.",
        heroSubtitle: "La reception di una clinica si divide tra bancone, telefono ed e-mail. Automatizziamo ciò che è ripetitivo perché lo staff abbia tempo per le persone che ha di fronte.",
        pains: [
          { title: "Chiamate perse sono visite perse", body: "Quando la receptionist segue un paziente al bancone, il telefono continua a squillare. Molti non richiamano." },
          { title: "Pazienti che saltano la visita", body: "Ogni assenza senza preavviso è tempo clinico sprecato e un paziente in lista d'attesa che avrebbe potuto essere visitato." },
          { title: "Una sala d'attesa piena e ansiosa", body: "Senza sapere quanto manca, i pazienti chiedono di continuo al bancone e la tensione sale." },
        ],
        dayInTheLife: [
          { title: "07:45 — Appuntamenti fissati durante la notte", body: "I pazienti che hanno chiamato fuori orario sono stati seguiti dalla receptionist vocale e i loro appuntamenti sono già in agenda." },
          { title: "10:00 — Bancone libero per chi arriva", body: "Le domande su orari, convenzioni e preparazione agli esami ricevono risposta automatica al telefono." },
          { title: "15:20 — Attesa senza ansia", body: "Il paziente segue la coda sul telefono e riceve un avviso quando arriva il suo turno." },
          { title: "18:30 — Recensioni sotto controllo", body: "Riceve un avviso se compare una recensione negativa e una proposta di risposta accurata, senza dati clinici." },
        ],
        faq: [
          { q: "L'IA dà consigli medici ai pazienti?", a: "No. La receptionist vocale e il chatbot si occupano solo di questioni amministrative: orari, appuntamenti, prezzi e preparazione indicata dalla clinica. Le situazioni cliniche vengono passate allo staff." },
          { q: "Come vengono trattati i dati dei pazienti?", a: "Raccogliamo solo ciò che serve per l'appuntamento, con una base giuridica conforme al GDPR, e firmiamo con la clinica un accordo di nomina a responsabile del trattamento. I nostri sistemi non chiedono né conservano dati sanitari." },
          { q: "Funziona con più medici e specialità?", a: "Sì. Ogni professionista ha la propria agenda, tipi di visita, durate e orari." },
        ],
      },
    },
  },
  {
    id: "retail",
    slug: sectorSlugs.retail,
    photo: "shop-owner",
    side: { kind: "photo", photo: "retail" },
    bundle: ["google-review-plates", "social-plates", "loyalty", "ai-chatbot"],
    copy: {
      pt: {
        name: "Comércio local",
        cardTitle: "Comércio local",
        cardBody: "Mais seguidores, mais reviews e clientes que regressam, com tecnologia simples no balcão e na montra.",
        metaTitle: "Placas e cartão de cliente para comércio local | Steevanz",
        metaDescription: "Placas para reviews no Google e redes sociais, cartão de fidelidade digital e chatbot com IA para lojas, padarias, floristas e comércio de bairro.",
        heroTitle: "A loja do bairro, com a força das grandes marcas.",
        heroSubtitle: "Os clientes gostam de comprar perto de casa. Ajudamos a que o encontrem no Google, o sigam nas redes sociais e voltem, com ferramentas simples que funcionam a partir do balcão.",
        pains: [
          { title: "Pouca visibilidade no Google", body: "Quem procura \"florista perto de mim\" escolhe quem tem mais reviews e melhor nota. Lojas excelentes ficam escondidas." },
          { title: "Redes sociais que crescem devagar", body: "Pedir a um cliente que procure a conta e escreva o nome certo faz perder a maioria pelo caminho." },
          { title: "Cartões de carimbos em papel", body: "Perdem-se, esquecem-se em casa e não dizem nada sobre quem são os clientes mais fiéis." },
        ],
        bundleTitle: "O pacote para comércio",
        bundleBody: "Placa no balcão para reviews no Google, placa ou autocolante na montra para seguir nas redes sociais, cartão de fidelidade digital sem app e um chatbot que responde a stock, horários e encomendas.",
        dayInTheLife: [
          { title: "09:00 — A montra a trabalhar", body: "Quem passa com a loja fechada toca no autocolante da montra e segue a conta de Instagram." },
          { title: "12:30 — Pagamento e carimbo", body: "Ao pagar, o cliente encosta o telemóvel e acumula mais um carimbo no cartão de fidelidade digital." },
          { title: "17:00 — Review com um toque", body: "Um cliente habitual elogia a loja. Basta apontar para a placa no balcão." },
          { title: "21:00 — Perguntas respondidas", body: "O chatbot diz se há bolo de laranja amanhã e como encomendar para sábado." },
        ],
        faq: [
          { q: "Tenho uma loja pequena. Isto é para mim?", a: "Sim. As placas são um investimento único e baixo, e os serviços mensais não têm fidelização longa. Começamos pelo que traz retorno mais rápido." },
          { q: "Posso mudar o link da placa mais tarde?", a: "Sim. As nossas placas usam um endereço que gerimos por si, por isso podemos mudar o destino sem reimprimir nada." },
          { q: "Funciona se o cliente tiver um telemóvel antigo?", a: "Todas as placas têm também um QR code. Quem não conseguir ler a placa com um toque aponta a câmara e chega ao mesmo sítio." },
        ],
      },
      en: {
        name: "Local retail",
        cardTitle: "Local retail",
        cardBody: "More followers, more reviews and returning customers, with simple tech at the counter and in the window.",
        metaTitle: "Plates and customer cards for local shops | Steevanz",
        metaDescription: "Plates for Google reviews and social media, a digital loyalty card and an AI chatbot for shops, bakeries, florists and neighbourhood retail.",
        heroTitle: "Your neighbourhood shop, with big-brand muscle.",
        heroSubtitle: "People love buying close to home. We help them find you on Google, follow you on social media and come back, with simple tools that work from your counter.",
        pains: [
          { title: "Low visibility on Google", body: "Anyone searching \"florist near me\" picks the one with the most reviews and the best rating. Great shops stay hidden." },
          { title: "Social accounts that grow slowly", body: "Asking a customer to search your handle and type it correctly loses most of them along the way." },
          { title: "Paper stamp cards", body: "They get lost, left at home and tell you nothing about who your most loyal customers are." },
        ],
        bundleTitle: "The retail bundle",
        bundleBody: "A plate at the counter for Google reviews, a plate or sticker in the window to follow you on social media, a digital loyalty card with no app and a chatbot that answers stock, hours and order questions.",
        dayInTheLife: [
          { title: "09:00 — The window at work", body: "Passers-by tap the window sticker while you're closed and follow your Instagram account." },
          { title: "12:30 — Pay and stamp", body: "When paying, the customer taps their phone and collects another stamp on the digital loyalty card." },
          { title: "17:00 — A review in one tap", body: "A regular praises the shop. Just point to the plate on the counter." },
          { title: "21:00 — Questions answered", body: "The chatbot says whether there'll be orange cake tomorrow and how to order for Saturday." },
        ],
        faq: [
          { q: "I run a small shop. Is this for me?", a: "Yes. The plates are a low one-off cost and monthly services have no long lock-in. We start with what pays back fastest." },
          { q: "Can I change where the plate points later?", a: "Yes. Our plates use an address we manage for you, so we can change the destination without reprinting anything." },
          { q: "Does it work if a customer has an older phone?", a: "Every plate also carries a QR code. Anyone whose phone can't read it with a tap points the camera and lands in the same place." },
        ],
      },
      es: {
        name: "Comercio local",
        cardTitle: "Comercio local",
        cardBody: "Más seguidores, más reseñas y clientes que vuelven, con tecnología sencilla en el mostrador y en el escaparate.",
        bundleTitle: "El pack para comercios",
        bundleBody: "Placa en el mostrador para reseñas en Google, placa o pegatina en el escaparate para seguirle en redes sociales, tarjeta de cliente digital sin app y un chatbot que responde sobre stock, horarios y pedidos.",
        metaTitle: "Placas y tarjeta de cliente para el comercio local | Steevanz",
        metaDescription: "Placas para reseñas en Google y redes sociales, tarjeta de cliente digital y chatbot con IA para tiendas, panaderías, floristerías y comercios de barrio.",
        heroTitle: "La tienda del barrio, con la fuerza de las grandes marcas.",
        heroSubtitle: "A los clientes les gusta comprar cerca de casa. Le ayudamos a que le encuentren en Google, le sigan en redes sociales y vuelvan, con herramientas sencillas que funcionan desde el mostrador.",
        pains: [
          { title: "Poca visibilidad en Google", body: "Quien busca \"floristería cerca de mí\" elige a quien tiene más reseñas y mejor nota. Tiendas excelentes se quedan escondidas." },
          { title: "Redes sociales que crecen despacio", body: "Pedir a un cliente que busque la cuenta y escriba bien el nombre hace que la mayoría se pierda por el camino." },
          { title: "Tarjetas de sellos en papel", body: "Se pierden, se olvidan en casa y no dicen nada sobre quiénes son los clientes más fieles." },
        ],
        dayInTheLife: [
          { title: "09:00 — El escaparate trabajando", body: "Quien pasa con la tienda cerrada toca la pegatina del escaparate y sigue la cuenta de Instagram." },
          { title: "12:30 — Pago y sello", body: "Al pagar, el cliente acerca el móvil y suma un sello más en la tarjeta de cliente digital." },
          { title: "17:00 — Una reseña con un toque", body: "Un cliente habitual elogia la tienda. Basta con señalar la placa del mostrador." },
          { title: "21:00 — Preguntas respondidas", body: "El chatbot dice si mañana habrá bizcocho de naranja y cómo encargarlo para el sábado." },
        ],
        faq: [
          { q: "Tengo una tienda pequeña. ¿Esto es para mí?", a: "Sí. Las placas son una inversión única y baja, y los servicios mensuales no tienen permanencia larga. Empezamos por lo que da resultados más rápido." },
          { q: "¿Puedo cambiar el enlace de la placa más adelante?", a: "Sí. Nuestras placas usan una dirección que gestionamos por usted, así que podemos cambiar el destino sin volver a imprimir nada." },
          { q: "¿Funciona si el cliente tiene un móvil antiguo?", a: "Todas las placas llevan también un código QR. Quien no pueda leer la placa con un toque apunta con la cámara y llega al mismo sitio." },
        ],
      },
      fr: {
        name: "Commerces de proximité",
        cardTitle: "Commerces de proximité",
        cardBody: "Plus d'abonnés, plus d'avis et des clients qui reviennent, avec une technologie simple au comptoir et en vitrine.",
        bundleTitle: "La formule commerces",
        bundleBody: "Une plaque au comptoir pour les avis Google, une plaque ou un autocollant en vitrine pour vous suivre sur les réseaux sociaux, une carte de fidélité digitale sans application et un chatbot qui répond sur le stock, les horaires et les commandes.",
        metaTitle: "Plaques et carte de fidélité pour les commerces de proximité | Steevanz",
        metaDescription: "Plaques pour avis Google et réseaux sociaux, carte de fidélité digitale et chatbot IA pour boutiques, boulangeries, fleuristes et commerces de quartier.",
        heroTitle: "Le commerce de quartier, avec la force des grandes marques.",
        heroSubtitle: "Les clients aiment acheter près de chez eux. Nous les aidons à vous trouver sur Google, à vous suivre sur les réseaux sociaux et à revenir, avec des outils simples qui fonctionnent depuis votre comptoir.",
        pains: [
          { title: "Peu de visibilité sur Google", body: "Qui cherche « fleuriste près de chez moi » choisit celui qui a le plus d'avis et la meilleure note. D'excellentes boutiques restent invisibles." },
          { title: "Des réseaux sociaux qui grandissent lentement", body: "Demander à un client de chercher le compte et d'écrire le bon nom, c'est en perdre la plupart en chemin." },
          { title: "Des cartes à tampons en papier", body: "Elles se perdent, restent oubliées à la maison et ne disent rien sur vos clients les plus fidèles." },
        ],
        dayInTheLife: [
          { title: "09:00 — La vitrine au travail", body: "Les passants touchent l'autocollant de la vitrine pendant que la boutique est fermée et suivent votre compte Instagram." },
          { title: "12:30 — Paiement et tampon", body: "En payant, le client approche son téléphone et ajoute un tampon sur sa carte de fidélité digitale." },
          { title: "17:00 — Un avis d'un toucher", body: "Un habitué fait l'éloge de la boutique. Il suffit de lui montrer la plaque sur le comptoir." },
          { title: "21:00 — Les questions ont leur réponse", body: "Le chatbot dit s'il y aura du gâteau à l'orange demain et comment le commander pour samedi." },
        ],
        faq: [
          { q: "J'ai une petite boutique. Est-ce pour moi ?", a: "Oui. Les plaques sont un investissement unique et modeste, et les services mensuels sont sans engagement long. Nous commençons par ce qui rapporte le plus vite." },
          { q: "Puis-je changer le lien de la plaque plus tard ?", a: "Oui. Nos plaques utilisent une adresse que nous gérons pour vous : nous pouvons donc changer la destination sans rien réimprimer." },
          { q: "Est-ce que cela fonctionne avec un téléphone ancien ?", a: "Toutes les plaques ont aussi un QR code. Si le téléphone ne lit pas la plaque d'un toucher, il suffit de pointer l'appareil photo pour arriver au même endroit." },
        ],
      },
      de: {
        name: "Lokaler Handel",
        cardTitle: "Lokaler Handel",
        cardBody: "Mehr Follower, mehr Bewertungen und Kunden, die wiederkommen, mit einfacher Technik an der Theke und im Schaufenster.",
        bundleTitle: "Das Paket für den Handel",
        bundleBody: "Ein Schild an der Theke für Google-Bewertungen, ein Schild oder Aufkleber im Schaufenster, damit man Ihnen in den sozialen Netzwerken folgt, eine digitale Kundenkarte ohne App und ein Chatbot, der Fragen zu Bestand, Öffnungszeiten und Bestellungen beantwortet.",
        metaTitle: "Schilder und Kundenkarte für den lokalen Handel | Steevanz",
        metaDescription: "Schilder für Google-Bewertungen und soziale Netzwerke, digitale Kundenkarte und KI-Chatbot für Läden, Bäckereien, Floristen und den Handel im Viertel.",
        heroTitle: "Der Laden um die Ecke, mit der Kraft der großen Marken.",
        heroSubtitle: "Kunden kaufen gern in der Nähe. Wir helfen, dass sie Sie bei Google finden, Ihnen in den sozialen Netzwerken folgen und wiederkommen, mit einfachen Werkzeugen, die von der Theke aus funktionieren.",
        pains: [
          { title: "Kaum sichtbar bei Google", body: "Wer „Florist in der Nähe“ sucht, wählt den mit den meisten Bewertungen und der besten Note. Hervorragende Läden bleiben unsichtbar." },
          { title: "Soziale Netzwerke, die langsam wachsen", body: "Bittet man Kunden, den Account zu suchen und den Namen richtig einzutippen, gehen die meisten unterwegs verloren." },
          { title: "Stempelkarten aus Papier", body: "Sie gehen verloren, bleiben zu Hause liegen und verraten nichts darüber, wer Ihre treuesten Kunden sind." },
        ],
        dayInTheLife: [
          { title: "09:00 — Das Schaufenster arbeitet", body: "Wer am geschlossenen Laden vorbeigeht, tippt den Aufkleber im Schaufenster an und folgt dem Instagram-Account." },
          { title: "12:30 — Bezahlen und stempeln", body: "Beim Bezahlen hält der Kunde das Handy hin und sammelt einen weiteren Stempel auf der digitalen Kundenkarte." },
          { title: "17:00 — Eine Bewertung mit einem Antippen", body: "Ein Stammkunde lobt den Laden. Es genügt, auf das Schild an der Theke zu zeigen." },
          { title: "21:00 — Fragen beantwortet", body: "Der Chatbot sagt, ob es morgen Orangenkuchen gibt und wie man für Samstag vorbestellt." },
        ],
        faq: [
          { q: "Ich habe einen kleinen Laden. Ist das etwas für mich?", a: "Ja. Die Schilder sind eine einmalige, kleine Investition, und die monatlichen Leistungen haben keine lange Bindung. Wir beginnen mit dem, was sich am schnellsten auszahlt." },
          { q: "Kann ich den Link des Schildes später ändern?", a: "Ja. Unsere Schilder nutzen eine Adresse, die wir für Sie verwalten. So können wir das Ziel ändern, ohne etwas neu zu drucken." },
          { q: "Funktioniert das auch mit einem älteren Handy?", a: "Jedes Schild hat zusätzlich einen QR-Code. Wer das Schild nicht per Antippen lesen kann, richtet die Kamera darauf und landet an derselben Stelle." },
        ],
      },
      it: {
        name: "Negozi di quartiere",
        cardTitle: "Negozi di quartiere",
        cardBody: "Più follower, più recensioni e clienti che ritornano, con una tecnologia semplice al banco e in vetrina.",
        bundleTitle: "Il pacchetto per negozi",
        bundleBody: "Targa al banco per le recensioni Google, targa o adesivo in vetrina per seguire il Suo negozio sui social, carta fedeltà digitale senza app e un chatbot che risponde su disponibilità, orari e ordini.",
        metaTitle: "Targhe e carta fedeltà per i negozi di quartiere | Steevanz",
        metaDescription: "Targhe per recensioni Google e social, carta fedeltà digitale e chatbot con IA per negozi, panetterie, fioristi e commercio di quartiere.",
        heroTitle: "Il negozio di quartiere, con la forza dei grandi marchi.",
        heroSubtitle: "Ai clienti piace comprare vicino a casa. Li aiutiamo a trovare il Suo negozio su Google, a seguirlo sui social e a tornare, con strumenti semplici che funzionano dal banco.",
        pains: [
          { title: "Poca visibilità su Google", body: "Chi cerca \"fiorista vicino a me\" sceglie chi ha più recensioni e il voto migliore. Negozi eccellenti restano nascosti." },
          { title: "Social che crescono lentamente", body: "Chiedere a un cliente di cercare l'account e scrivere il nome giusto fa perdere per strada la maggior parte delle persone." },
          { title: "Tessere a timbri di carta", body: "Si perdono, si dimenticano a casa e non dicono nulla su chi siano i clienti più fedeli." },
        ],
        dayInTheLife: [
          { title: "09:00 — La vetrina al lavoro", body: "Chi passa a negozio chiuso tocca l'adesivo in vetrina e segue l'account Instagram." },
          { title: "12:30 — Pagamento e timbro", body: "Al momento di pagare, il cliente avvicina il telefono e accumula un altro timbro sulla carta fedeltà digitale." },
          { title: "17:00 — Una recensione con un tocco", body: "Un cliente abituale fa i complimenti al negozio. Basta indicare la targa sul banco." },
          { title: "21:00 — Domande con risposta", body: "Il chatbot dice se domani ci sarà la torta all'arancia e come ordinarla per sabato." },
        ],
        faq: [
          { q: "Ho un negozio piccolo. Fa per me?", a: "Sì. Le targhe sono un investimento unico e contenuto, e i servizi mensili non hanno vincoli lunghi. Partiamo da ciò che rende più in fretta." },
          { q: "Posso cambiare il link della targa più avanti?", a: "Sì. Le nostre targhe usano un indirizzo che gestiamo per Lei, quindi possiamo cambiare la destinazione senza ristampare nulla." },
          { q: "Funziona se il cliente ha un telefono vecchio?", a: "Tutte le targhe hanno anche un codice QR. Chi non riesce a leggere la targa con un tocco inquadra con la fotocamera e arriva nello stesso punto." },
        ],
      },
    },
  },
  {
    id: "lodging",
    slug: sectorSlugs.lodging,
    photo: "holiday-rental",
    side: { kind: "product", productId: "guest-guide" },
    // The website (direct bookings, no platform commission) instead of the Google plates, which only suit
    // places that can have a Google profile (said in the bundle note).
    bundle: ["guest-guide", "ai-chatbot", "automation", "website"],
    bundleNote: {
      pt: "As placas para reviews no Google são só para alojamentos que podem ter perfil no Google: hostels, guest houses, quartos com o anfitrião presente e casas onde recebe os hóspedes pessoalmente. Apartamentos e moradias com entrada autónoma não podem ter perfil, por regra do próprio Google. Nesses casos, o guia explica ao hóspede onde avaliar na Booking ou no Airbnb, da mesma forma para todos e sem ofertas em troca.",
      en: "Google review plates are only for places that can have a Google profile: hostels, guest houses, rooms with the host on site and homes where you welcome guests in person. Self-check-in flats and villas can't have a profile, under Google's own rules. For those, the guide tells guests where to review on Booking.com or Airbnb, the same way for everyone and with nothing offered in return.",
      es: "Las placas para reseñas en Google son solo para alojamientos que pueden tener perfil en Google: hostales, casas de huéspedes, habitaciones con el anfitrión presente y casas donde recibe a los huéspedes en persona. Los apartamentos y las casas con entrada autónoma no pueden tener perfil, por norma del propio Google. En esos casos, la guía explica al huésped dónde valorar en Booking o en Airbnb, igual para todos y sin ofrecer nada a cambio.",
      fr: "Les plaques pour avis Google sont réservées aux hébergements qui peuvent avoir une fiche Google : auberges de jeunesse, maisons d'hôtes, chambres chez l'habitant avec l'hôte sur place et maisons où vous accueillez les voyageurs en personne. Les appartements et les villas en arrivée autonome ne peuvent pas avoir de fiche, selon les règles de Google. Dans ce cas, le livret indique au voyageur où laisser un avis sur Booking.com ou Airbnb, de la même façon pour tous et sans rien offrir en échange.",
      de: "Die Schilder für Google-Bewertungen eignen sich nur für Unterkünfte, die ein Google-Profil haben dürfen: Hostels, Gästehäuser, Zimmer mit anwesendem Gastgeber und Häuser, in denen Sie die Gäste persönlich empfangen. Ferienwohnungen und Ferienhäuser mit Self-Check-in dürfen nach Googles eigenen Regeln kein Profil haben. Dort erklärt die Gästemappe, wo man auf Booking.com oder Airbnb bewerten kann, für alle gleich und ohne Gegenleistung.",
      it: "Le targhe per recensioni Google sono solo per gli alloggi che possono avere un profilo Google: ostelli, guest house, camere con l'host presente e case in cui accoglie gli ospiti di persona. Appartamenti e ville con ingresso autonomo non possono avere un profilo, per regola di Google stesso. In questi casi la guida spiega all'ospite dove lasciare una recensione su Booking.com o Airbnb, allo stesso modo per tutti e senza offrire nulla in cambio.",
    },
    pack: {
      setup: 149,
      monthly: 49,
      extraSetup: 49,
      extraMonthly: 9,
      // Guide (69) + «Limpezas e prazos» automation (149); assistant 49/month.
      separatelySetup: 218,
      separatelyMonthly: 49,
      demoProduct: "guest-guide",
      isProvisional: true,
      copy: {
        pt: {
          badge: "Preço de proposta",
          eyebrow: "Pack Alojamento Local",
          title: "Guia, assistente e automatização num só pack",
          body: "Por menos do que a comissão de uma reserva por mês, os hóspedes ficam bem informados, a limpeza organiza-se sozinha e o seu telemóvel descansa.",
          items: [
            "Guia digital do alojamento em quatro línguas, com placa e versão para imprimir",
            "Assistente com IA no WhatsApp, treinado com o guia, que responde aos hóspedes 24 horas e lhe passa as urgências",
            "Automatização «Limpezas e prazos»: aviso à equipa de limpeza na véspera de cada saída, lembrete dos boletins e resumo semanal",
            "Guia online e alterações incluídos enquanto o pack estiver ativo",
            "Em hostels e guest houses com perfil no Google, uma placa para reviews incluída",
          ],
          setupLabel: "de configuração",
          monthlyLabel: "/mês",
          extraProperty: "Cada alojamento extra: +{setup} de configuração e +{monthly}/mês. Um número de WhatsApp serve até cinco alojamentos; acima disso, fazemos orçamento.",
          separately: "Em separado: {setup} de configuração e {monthly}/mês.",
          website: "Quer também um website com reservas diretas, para os hóspedes que voltam e para quem o encontra no Google ou no Instagram? Juntamo-lo ao pack, com preço à parte.",
          note: "Valores sem IVA, confirmados na demonstração. Sem contratos longos: sugerimos um mínimo de três meses, pelo trabalho de configuração. O pack contrata-se na demonstração, não no carrinho.",
          requestInfo: "Prefere receber a proposta por e-mail?",
        },
        en: {
          badge: "Proposal price",
          eyebrow: "Holiday-rental pack",
          title: "Guide, assistant and automation in one pack",
          body: "For less than the commission on one booking a month, guests stay well informed, cleaning organises itself and your phone gets a rest.",
          items: [
            "Digital guest guide in four languages, with a plate and a printable version",
            "AI assistant on WhatsApp, trained on the guide, that answers guests around the clock and passes emergencies to you",
            "\"Cleanings and deadlines\" automation: a notice to your cleaning team the day before each check-out, registration reminders and a weekly summary",
            "Guide hosting and changes included while the pack is active",
            "For hostels and guest houses with a Google profile, one review plate included",
          ],
          setupLabel: "setup",
          monthlyLabel: "/month",
          extraProperty: "Each extra property: +{setup} setup and +{monthly}/month. One WhatsApp number covers up to five properties; above that, we'll quote.",
          separately: "Bought separately: {setup} setup and {monthly}/month.",
          website: "Want a website with direct bookings too, for returning guests and people who find you on Google or Instagram? We add it to the pack, priced separately.",
          note: "Prices exclude VAT and are confirmed in the demo. No long lock-in: we suggest a three-month minimum because of the setup work. The pack is arranged in the demo, not in the cart.",
          requestInfo: "Rather get the proposal by email?",
        },
        es: {
          badge: "Precio de propuesta",
          eyebrow: "Pack para alojamientos turísticos",
          title: "Guía, asistente y automatización en un solo pack",
          body: "Por menos de lo que cuesta la comisión de una reserva al mes, los huéspedes están bien informados, la limpieza se organiza sola y su móvil descansa.",
          items: [
            "Guía digital del alojamiento en cuatro idiomas, con placa y versión para imprimir",
            "Asistente con IA en WhatsApp, entrenado con la guía, que responde a los huéspedes las 24 horas y le pasa las urgencias",
            "Automatización «Limpiezas y plazos»: aviso al equipo de limpieza la víspera de cada salida, recordatorio de los registros de viajeros y resumen semanal",
            "Guía online y cambios incluidos mientras el pack esté activo",
            "En hostales y casas de huéspedes con perfil en Google, una placa para reseñas incluida",
          ],
          setupLabel: "de configuración",
          monthlyLabel: "/mes",
          extraProperty: "Cada alojamiento extra: +{setup} de configuración y +{monthly}/mes. Un número de WhatsApp sirve para hasta cinco alojamientos; por encima, hacemos presupuesto.",
          separately: "Por separado: {setup} de configuración y {monthly}/mes.",
          website: "¿Quiere también una web con reservas directas, para los huéspedes que repiten y para quien le encuentra en Google o en Instagram? La sumamos al pack, con precio aparte.",
          note: "Importes sin IVA, confirmados en la demostración. Sin contratos largos: sugerimos un mínimo de tres meses por el trabajo de configuración. El pack se contrata en la demostración, no en el carrito.",
          requestInfo: "¿Prefiere recibir la propuesta por correo electrónico?",
        },
        fr: {
          badge: "Prix sur proposition",
          eyebrow: "Formule locations de vacances",
          title: "Livret, assistant et automatisation en une seule formule",
          body: "Pour moins que la commission d'une réservation par mois, vos voyageurs sont bien informés, le ménage s'organise tout seul et votre téléphone se repose.",
          items: [
            "Livret d'accueil digital en quatre langues, avec plaque et version imprimable",
            "Assistant IA sur WhatsApp, formé avec le livret, qui répond aux voyageurs 24 h/24 et vous transmet les urgences",
            "Automatisation « Ménages et échéances » : avis à l'équipe de ménage la veille de chaque départ, rappel des déclarations des voyageurs et résumé hebdomadaire",
            "Livret en ligne et modifications inclus tant que la formule est active",
            "Pour les auberges et maisons d'hôtes avec une fiche Google, une plaque pour avis incluse",
          ],
          setupLabel: "de mise en place",
          monthlyLabel: "/mois",
          extraProperty: "Chaque logement supplémentaire : +{setup} de mise en place et +{monthly}/mois. Un numéro WhatsApp couvre jusqu'à cinq logements ; au-delà, nous faisons un devis.",
          separately: "Séparément : {setup} de mise en place et {monthly}/mois.",
          website: "Vous voulez aussi un site web avec réservation directe, pour les voyageurs qui reviennent et ceux qui vous trouvent sur Google ou Instagram ? Nous l'ajoutons à la formule, avec un prix à part.",
          note: "Montants hors TVA, confirmés lors de la démonstration. Sans engagement long : nous suggérons un minimum de trois mois, en raison du travail de mise en place. La formule se souscrit lors de la démonstration, pas dans le panier.",
          requestInfo: "Vous préférez recevoir la proposition par e-mail ?",
        },
        de: {
          badge: "Angebotspreis",
          eyebrow: "Paket für Ferienunterkünfte",
          title: "Gästemappe, Assistent und Automatisierung in einem Paket",
          body: "Für weniger als die Provision einer Buchung im Monat sind Ihre Gäste gut informiert, die Reinigung organisiert sich selbst und Ihr Handy hat Ruhe.",
          items: [
            "Digitale Gästemappe der Unterkunft in vier Sprachen, mit Schild und Druckversion",
            "KI-Assistent auf WhatsApp, trainiert mit der Gästemappe, der Gästen rund um die Uhr antwortet und Notfälle an Sie weitergibt",
            "Automatisierung „Reinigungen und Fristen“: Hinweis an das Reinigungsteam am Vortag jeder Abreise, Erinnerung an die Gästemeldungen und eine Wochenübersicht",
            "Online-Gästemappe und Änderungen inklusive, solange das Paket aktiv ist",
            "Für Hostels und Gästehäuser mit Google-Profil ist ein Bewertungsschild inklusive",
          ],
          setupLabel: "Einrichtung",
          monthlyLabel: "/Monat",
          extraProperty: "Jede weitere Unterkunft: +{setup} Einrichtung und +{monthly}/Monat. Eine WhatsApp-Nummer reicht für bis zu fünf Unterkünfte; darüber erstellen wir ein Angebot.",
          separately: "Einzeln gekauft: {setup} Einrichtung und {monthly}/Monat.",
          website: "Möchten Sie auch eine Website mit Direktbuchung, für wiederkehrende Gäste und alle, die Sie über Google oder Instagram finden? Wir ergänzen das Paket darum, zu einem separaten Preis.",
          note: "Preise zzgl. MwSt., in der Demo bestätigt. Keine lange Bindung: Wegen des Einrichtungsaufwands empfehlen wir mindestens drei Monate. Das Paket wird in der Demo vereinbart, nicht im Warenkorb.",
          requestInfo: "Lieber das Angebot per E-Mail erhalten?",
        },
        it: {
          badge: "Prezzo su proposta",
          eyebrow: "Pacchetto per case vacanza",
          title: "Guida, assistente e automazione in un unico pacchetto",
          body: "Per meno della commissione di una prenotazione al mese, gli ospiti sono ben informati, le pulizie si organizzano da sole e il Suo telefono riposa.",
          items: [
            "Guida digitale dell'alloggio in quattro lingue, con targa e versione da stampare",
            "Assistente con IA su WhatsApp, addestrato con la guida, che risponde agli ospiti 24 ore su 24 e Le passa le urgenze",
            "Automazione «Pulizie e scadenze»: avviso al team delle pulizie il giorno prima di ogni partenza, promemoria per le comunicazioni degli ospiti e riepilogo settimanale",
            "Guida online e modifiche incluse finché il pacchetto è attivo",
            "In ostelli e guest house con profilo Google, una targa per le recensioni inclusa",
          ],
          setupLabel: "di configurazione",
          monthlyLabel: "/mese",
          extraProperty: "Ogni alloggio in più: +{setup} di configurazione e +{monthly}/mese. Un numero WhatsApp vale fino a cinque alloggi; oltre, facciamo un preventivo.",
          separately: "Separatamente: {setup} di configurazione e {monthly}/mese.",
          website: "Vuole anche un sito web con prenotazione diretta, per gli ospiti che tornano e per chi La trova su Google o Instagram? Lo aggiungiamo al pacchetto, con prezzo a parte.",
          note: "Importi IVA esclusa, confermati durante la demo. Nessun contratto lungo: suggeriamo un minimo di tre mesi, per il lavoro di configurazione. Il pacchetto si attiva durante la demo, non nel carrello.",
          requestInfo: "Preferisce ricevere la proposta via e-mail?",
        },
      },
    },
    copy: {
      pt: {
        name: "Alojamento local",
        cardTitle: "Alojamento local",
        cardBody: "Hóspedes bem informados em qualquer língua, menos mensagens a meio da noite e limpezas que se organizam sozinhas.",
        metaTitle: "Guia digital, assistente IA e automação para alojamento local | Steevanz",
        metaDescription: "Guia digital da casa em quatro línguas com um toque, assistente com IA no WhatsApp 24 horas, avisos automáticos de limpeza e websites com reservas diretas para alojamento local em Portugal.",
        heroTitle: "Hóspedes bem recebidos. Telemóvel em silêncio.",
        heroSubtitle: "Quem tem alojamento local responde às mesmas perguntas todos os dias, em várias línguas e a qualquer hora. Juntamos um guia digital da casa, um assistente que responde por si no WhatsApp e automatizações que tratam dos avisos e dos prazos. Nós configuramos tudo, sem apps para instalar.",
        pains: [
          { title: "«Qual é a password do WiFi?» pela décima vez esta semana", body: "WiFi, hora de check-out, estacionamento, como funciona a máquina, onde se põe o lixo. As mesmas perguntas, em inglês, francês ou alemão, muitas vezes quando está a jantar ou a dormir." },
          { title: "Chegadas tardias e mensagens às duas da manhã", body: "O voo atrasou, o hóspede não encontra a caixa das chaves e só o anfitrião sabe responder. Uma resposta lenta é muitas vezes uma avaliação mais baixa." },
          { title: "Limpezas e prazos a depender da sua memória", body: "Reservas no Airbnb e na Booking, a equipa de limpeza à espera de saber quando entrar e os boletins do SIBA a enviar em três dias úteis. Basta uma falha para correr mal." },
          { title: "Comissões de 15 % em cada reserva", body: "Mesmo quem volta todos os anos reserva pela plataforma, porque o alojamento não tem um website próprio onde reservar." },
        ],
        bundleTitle: "O pacote para alojamento local",
        bundleBody: "Um guia digital da casa em quatro línguas, aberto com um toque numa placa dentro do alojamento, um assistente com IA no WhatsApp que responde aos hóspedes 24 horas com a informação do guia, avisos automáticos à equipa de limpeza e lembretes dos boletins a partir do calendário que já usa e, se quiser, um website com reservas diretas.",
        dayInTheLife: [
          { title: "10:30 — Limpeza já combinada", body: "A equipa recebeu ontem o aviso no WhatsApp: saída às 11h e nova entrada às 16h no mesmo apartamento." },
          { title: "16:40 — Check-in sem chamadas", body: "Os hóspedes entram, tocam na placa junto à porta e têm o WiFi, as regras da casa e o funcionamento da placa de indução na sua língua." },
          { title: "23:50 — Pergunta respondida enquanto dorme", body: "«Is there a pharmacy open now?» O assistente responde em inglês com a farmácia de serviço mais próxima e só o acorda se for uma urgência." },
          { title: "Dia seguinte, 09:00 — Prazos em dia", body: "Recebe um lembrete: há boletins de hóspedes estrangeiros por comunicar ao SIBA até amanhã." },
        ],
        faq: [
          { q: "Isto substitui o Airbnb, a Booking ou o meu software de gestão?", a: "Não. Trabalhamos em conjunto com o que já usa. As plataformas continuam a tratar das reservas, e o guia, o assistente e as automatizações juntam-se ao calendário que já tem." },
          { q: "O guia digital serve como o livro de informações que a lei exige?", a: "O guia inclui o conteúdo que a lei pede para o livro de informações: funcionamento da casa, regras, resíduos, eletrodomésticos, ruído, regras do condomínio e o seu contacto, em português, inglês e mais duas línguas. Também lhe entregamos uma versão para imprimir, que recomendamos deixar no alojamento." },
          { q: "Tratam dos boletins do SIBA?", a: "Não enviamos boletins em seu nome. Lembramos os prazos a partir do calendário e, se quiser automatizar o envio, recomendamos ferramentas especializadas como a Chekin ou a Hostkit, que funcionam bem em conjunto com a Steevanz." },
          { q: "Posso pedir avaliações aos hóspedes?", a: "Pode e deve, sempre da mesma forma a todos, sem ofertas nem descontos em troca. A Booking e o Airbnb enviam o seu próprio convite depois da saída, e o guia explica ao hóspede onde o encontra. As placas para o Google são indicadas para hostels, guest houses e casas onde recebe os hóspedes pessoalmente." },
          { q: "O assistente dá o código da porta a quem perguntar?", a: "Não. Os códigos de acesso nunca são partilhados pelo assistente nem ficam no guia. Continua a enviá-los na sua mensagem de check-in. Urgências e reclamações passam logo para si." },
          { q: "Tenho vários alojamentos. Como funciona?", a: "Cada alojamento tem o seu guia e a sua placa, e o assistente sabe em que casa está cada hóspede. Para gestores com vários alojamentos há preços por volume." },
        ],
      },
      en: {
        name: "Holiday rentals",
        cardTitle: "Holiday rentals",
        cardBody: "Well-informed guests in any language, fewer midnight messages and cleanings that organise themselves.",
        metaTitle: "Digital guest guide, AI assistant and automation for holiday rentals | Steevanz",
        metaDescription: "A digital guest guide in four languages with one tap, a 24/7 AI assistant on WhatsApp, automatic cleaning notices and direct-booking websites for holiday rentals in Portugal.",
        heroTitle: "Guests well looked after. Phone on silent.",
        heroSubtitle: "Holiday-rental hosts answer the same questions every day, in several languages and at any hour. We bring together a digital guest guide, an assistant that answers on WhatsApp for you and automations that take care of notices and deadlines. We set everything up, with no apps to install.",
        pains: [
          { title: "\"What's the WiFi password?\" for the tenth time this week", body: "WiFi, check-out time, parking, how the washing machine works, where the bins go. The same questions in English, French or German, often while you're having dinner or asleep." },
          { title: "Late arrivals and 2 a.m. messages", body: "The flight was delayed, the guest can't find the key box and only you can answer. A slow reply often means a lower review." },
          { title: "Cleanings and deadlines that rely on your memory", body: "Bookings on Airbnb and Booking.com, a cleaning team waiting to know when to go in, and guest registrations (SIBA) due within three working days. One slip is all it takes." },
          { title: "15% commission on every booking", body: "Even guests who come back every year book through the platform, because your place has no website of its own." },
        ],
        bundleTitle: "The holiday-rental bundle",
        bundleBody: "A digital guest guide in four languages that opens with one tap on a plate inside the property, an AI assistant on WhatsApp that answers guests around the clock using the guide, automatic notices to your cleaning team and registration reminders based on the calendar you already use and, if you want, a website with direct bookings.",
        dayInTheLife: [
          { title: "10:30 — Cleaning already arranged", body: "Your team got the WhatsApp notice yesterday: check-out at 11, new arrivals at 4 p.m. in the same flat." },
          { title: "16:40 — Check-in with no phone calls", body: "Guests walk in, tap the plate by the door and get the WiFi, the house rules and how the hob works, in their own language." },
          { title: "23:50 — Question answered while you sleep", body: "\"Is there a pharmacy open now?\" The assistant replies in English with the nearest on-duty pharmacy and only wakes you for a real emergency." },
          { title: "Next day, 09:00 — Deadlines on track", body: "You get a reminder: foreign guests still need to be registered on SIBA by tomorrow." },
        ],
        faq: [
          { q: "Does this replace Airbnb, Booking.com or my management software?", a: "No. We work alongside what you already use. The platforms keep handling bookings, and the guide, the assistant and the automations plug into the calendar you already have." },
          { q: "Does the digital guide count as the information book the law requires?", a: "The guide includes the content Portuguese law asks for in the information book: how the property works, house rules, waste, appliances, noise, building rules and your contact, in Portuguese, English and two more languages. We also give you a printable version, which we recommend keeping in the property." },
          { q: "Do you file the SIBA guest registrations?", a: "We don't file registrations on your behalf. We remind you of the deadlines based on your calendar and, if you want to automate filing, we recommend specialist tools such as Chekin or Hostkit, which work well alongside Steevanz." },
          { q: "Can I ask guests for reviews?", a: "You can and should, the same way for every guest, with no gifts or discounts in return. Booking.com and Airbnb send their own invitation after check-out, and the guide tells guests where to find it. Google plates are meant for hostels, guest houses and homes where you welcome guests in person." },
          { q: "Will the assistant give the door code to anyone who asks?", a: "No. Access codes are never shared by the assistant and never appear in the guide. You keep sending them in your check-in message. Emergencies and complaints go straight to you." },
          { q: "I run several properties. How does it work?", a: "Each property has its own guide and plate, and the assistant knows which home each guest is staying in. Managers with several properties get volume pricing." },
        ],
      },
      es: {
        name: "Alojamientos turísticos",
        cardTitle: "Alojamientos turísticos",
        cardBody: "Huéspedes bien informados en cualquier idioma, menos mensajes a medianoche y limpiezas que se organizan solas.",
        bundleTitle: "El pack para alojamientos turísticos",
        bundleBody: "Una guía digital de la casa en cuatro idiomas, que se abre con un toque en una placa dentro del alojamiento, un asistente con IA en WhatsApp que responde a los huéspedes las 24 horas con la información de la guía, avisos automáticos al equipo de limpieza y recordatorios de los registros de viajeros a partir del calendario que ya utiliza y, si quiere, una web con reservas directas.",
        metaTitle: "Guía digital, asistente IA y automatización para alojamientos turísticos | Steevanz",
        metaDescription: "Guía digital de la casa en cuatro idiomas con un toque, asistente con IA en WhatsApp las 24 horas, avisos automáticos de limpieza y webs con reservas directas para alojamientos turísticos en Portugal.",
        heroTitle: "Huéspedes bien recibidos. El móvil en silencio.",
        heroSubtitle: "Quien tiene un alojamiento turístico responde a las mismas preguntas cada día, en varios idiomas y a cualquier hora. Reunimos una guía digital de la casa, un asistente que responde por usted en WhatsApp y automatizaciones que se encargan de los avisos y los plazos. Lo configuramos todo nosotros, sin apps que instalar.",
        pains: [
          { title: "«¿Cuál es la contraseña del WiFi?» por décima vez esta semana", body: "WiFi, hora de salida, aparcamiento, cómo funciona la lavadora, dónde va la basura. Las mismas preguntas, en inglés, francés o alemán, muchas veces mientras está cenando o durmiendo." },
          { title: "Llegadas tardías y mensajes a las dos de la mañana", body: "El vuelo se retrasó, el huésped no encuentra la caja de llaves y solo el anfitrión sabe responder. Una respuesta lenta suele acabar en una valoración más baja." },
          { title: "Limpiezas y plazos que dependen de su memoria", body: "Reservas en Airbnb y en Booking, el equipo de limpieza esperando saber cuándo entrar y los registros de viajeros en el SIBA que hay que enviar en tres días laborables. Basta un descuido para que algo salga mal." },
          { title: "Comisiones del 15 % en cada reserva", body: "Incluso quien vuelve cada año reserva por la plataforma, porque el alojamiento no tiene una web propia donde reservar." },
        ],
        dayInTheLife: [
          { title: "10:30 — Limpieza ya acordada", body: "El equipo recibió ayer el aviso por WhatsApp: salida a las 11 h y nueva entrada a las 16 h en el mismo apartamento." },
          { title: "16:40 — Check-in sin llamadas", body: "Los huéspedes entran, tocan la placa junto a la puerta y tienen el WiFi, las normas de la casa y cómo funciona la placa de inducción en su idioma." },
          { title: "23:50 — Pregunta respondida mientras usted duerme", body: "«Is there a pharmacy open now?» El asistente responde en inglés con la farmacia de guardia más cercana y solo le despierta si es una urgencia." },
          { title: "Día siguiente, 09:00 — Plazos al día", body: "Recibe un recordatorio: hay registros de huéspedes extranjeros que comunicar al SIBA antes de mañana." },
        ],
        faq: [
          { q: "¿Esto sustituye a Airbnb, a Booking o a mi software de gestión?", a: "No. Trabajamos junto con lo que ya usa. Las plataformas siguen gestionando las reservas, y la guía, el asistente y las automatizaciones se conectan al calendario que ya tiene." },
          { q: "¿La guía digital sirve como el libro de información que exige la ley?", a: "La guía incluye el contenido que la ley portuguesa pide para el libro de información: funcionamiento de la casa, normas, residuos, electrodomésticos, ruido, normas de la comunidad y su contacto, en portugués, inglés y dos idiomas más. También le entregamos una versión para imprimir, que recomendamos dejar en el alojamiento." },
          { q: "¿Se encargan de los registros en el SIBA?", a: "No enviamos registros en su nombre. Le recordamos los plazos a partir del calendario y, si quiere automatizar el envío, recomendamos herramientas especializadas como Chekin o Hostkit, que funcionan bien junto con Steevanz." },
          { q: "¿Puedo pedir valoraciones a los huéspedes?", a: "Puede y debe, siempre de la misma forma a todos, sin regalos ni descuentos a cambio. Booking y Airbnb envían su propia invitación después de la salida, y la guía explica al huésped dónde encontrarla. Las placas para Google están pensadas para hostales, casas de huéspedes y casas donde recibe a los huéspedes en persona." },
          { q: "¿El asistente da el código de la puerta a quien lo pregunte?", a: "No. El asistente nunca comparte los códigos de acceso y tampoco figuran en la guía. Usted sigue enviándolos en su mensaje de check-in. Las urgencias y las quejas pasan directamente a usted." },
          { q: "Tengo varios alojamientos. ¿Cómo funciona?", a: "Cada alojamiento tiene su guía y su placa, y el asistente sabe en qué casa está cada huésped. Para gestores con varios alojamientos hay precios por volumen." },
        ],
      },
      fr: {
        name: "Locations de vacances",
        cardTitle: "Locations de vacances",
        cardBody: "Des voyageurs bien informés dans toutes les langues, moins de messages en pleine nuit et des ménages qui s'organisent tout seuls.",
        bundleTitle: "La formule locations de vacances",
        bundleBody: "Un livret d'accueil digital en quatre langues, qui s'ouvre d'un toucher sur une plaque dans le logement, un assistant IA sur WhatsApp qui répond aux voyageurs 24 h/24 avec les informations du livret, des avis automatiques à l'équipe de ménage, des rappels pour les déclarations des voyageurs à partir du calendrier que vous utilisez déjà et, si vous le souhaitez, un site web avec réservation directe.",
        metaTitle: "Livret d'accueil digital, assistant IA et automatisation pour locations de vacances | Steevanz",
        metaDescription: "Un livret d'accueil digital en quatre langues d'un simple toucher, un assistant IA sur WhatsApp 24 h/24, des avis de ménage automatiques et des sites avec réservation directe pour les locations de vacances au Portugal.",
        heroTitle: "Des voyageurs bien accueillis. Un téléphone silencieux.",
        heroSubtitle: "Les hôtes de locations de vacances répondent tous les jours aux mêmes questions, en plusieurs langues et à toute heure. Nous réunissons un livret d'accueil digital, un assistant qui répond à votre place sur WhatsApp et des automatisations qui gèrent les avis et les échéances. Nous configurons tout, sans application à installer.",
        pains: [
          { title: "« Quel est le mot de passe du WiFi ? » pour la dixième fois cette semaine", body: "WiFi, heure de départ, stationnement, fonctionnement de la machine à laver, où mettre les poubelles. Les mêmes questions, en anglais, en français ou en allemand, souvent pendant que vous dînez ou dormez." },
          { title: "Arrivées tardives et messages à deux heures du matin", body: "Le vol a eu du retard, le voyageur ne trouve pas la boîte à clés et vous seul pouvez répondre. Une réponse lente, c'est souvent un avis moins bon." },
          { title: "Ménages et échéances qui reposent sur votre mémoire", body: "Des réservations sur Airbnb et Booking.com, une équipe de ménage qui attend de savoir quand passer et des déclarations de voyageurs au SIBA à envoyer sous trois jours ouvrés. Un seul oubli suffit pour que ça tourne mal." },
          { title: "15 % de commission sur chaque réservation", body: "Même les voyageurs qui reviennent chaque année réservent par la plateforme, faute d'un site web propre au logement." },
        ],
        dayInTheLife: [
          { title: "10:30 — Le ménage déjà calé", body: "L'équipe a reçu l'avis sur WhatsApp hier : départ à 11 h et nouvelle arrivée à 16 h dans le même appartement." },
          { title: "16:40 — Un check-in sans appels", body: "Les voyageurs entrent, touchent la plaque près de la porte et obtiennent le WiFi, le règlement intérieur et le mode d'emploi de la plaque à induction dans leur langue." },
          { title: "23:50 — Une question traitée pendant que vous dormez", body: "« Is there a pharmacy open now? » L'assistant répond en anglais avec la pharmacie de garde la plus proche et ne vous réveille qu'en cas d'urgence." },
          { title: "Le lendemain, 09:00 — Les échéances respectées", body: "Vous recevez un rappel : des déclarations de voyageurs étrangers sont à transmettre au SIBA d'ici demain." },
        ],
        faq: [
          { q: "Est-ce que cela remplace Airbnb, Booking.com ou mon logiciel de gestion ?", a: "Non. Nous travaillons avec ce que vous utilisez déjà. Les plateformes continuent de gérer les réservations, et le livret, l'assistant et les automatisations se branchent sur le calendrier que vous avez déjà." },
          { q: "Le livret d'accueil digital tient-il lieu du livret d'information exigé par la loi ?", a: "Le livret reprend le contenu que la loi portugaise demande pour le livret d'information : fonctionnement du logement, règlement, déchets, appareils, bruit, règles de copropriété et vos coordonnées, en portugais, en anglais et dans deux autres langues. Nous vous remettons aussi une version imprimable, que nous recommandons de laisser dans le logement." },
          { q: "Vous occupez-vous des déclarations au SIBA ?", a: "Nous n'envoyons pas de déclarations en votre nom. Nous vous rappelons les échéances à partir du calendrier et, si vous voulez automatiser l'envoi, nous recommandons des outils spécialisés comme Chekin ou Hostkit, qui fonctionnent très bien avec Steevanz." },
          { q: "Puis-je demander des avis aux voyageurs ?", a: "Vous le pouvez et vous le devez, de la même façon pour tous, sans cadeau ni remise en échange. Booking.com et Airbnb envoient leur propre invitation après le départ, et le livret indique au voyageur où la trouver. Les plaques Google sont prévues pour les auberges, les maisons d'hôtes et les maisons où vous accueillez les voyageurs en personne." },
          { q: "L'assistant donne-t-il le code de la porte à qui le demande ?", a: "Non. L'assistant ne partage jamais les codes d'accès et ils ne figurent pas dans le livret. Vous continuez à les envoyer dans votre message d'arrivée. Les urgences et les réclamations vous sont transmises immédiatement." },
          { q: "J'ai plusieurs logements. Comment ça marche ?", a: "Chaque logement a son livret et sa plaque, et l'assistant sait dans quel logement séjourne chaque voyageur. Les gestionnaires de plusieurs logements bénéficient de tarifs dégressifs." },
        ],
      },
      de: {
        name: "Ferienunterkünfte",
        cardTitle: "Ferienunterkünfte",
        cardBody: "Gut informierte Gäste in jeder Sprache, weniger Nachrichten mitten in der Nacht und Reinigungen, die sich von selbst organisieren.",
        bundleTitle: "Das Paket für Ferienunterkünfte",
        bundleBody: "Eine digitale Gästemappe in vier Sprachen, die sich mit einem Antippen auf einem Schild in der Unterkunft öffnet, ein KI-Assistent auf WhatsApp, der Gästen rund um die Uhr mit den Infos aus der Mappe antwortet, automatische Hinweise an Ihr Reinigungsteam, Erinnerungen an die Gästemeldungen auf Basis des Kalenders, den Sie bereits nutzen, und, wenn Sie möchten, eine Website mit Direktbuchung.",
        metaTitle: "Digitale Gästemappe, KI-Assistent und Automatisierung für Ferienunterkünfte | Steevanz",
        metaDescription: "Digitale Gästemappe in vier Sprachen per Antippen, KI-Assistent auf WhatsApp rund um die Uhr, automatische Reinigungshinweise und Websites mit Direktbuchung für Ferienunterkünfte in Portugal.",
        heroTitle: "Gäste gut empfangen. Handy auf lautlos.",
        heroSubtitle: "Wer eine Ferienunterkunft vermietet, beantwortet jeden Tag dieselben Fragen, in mehreren Sprachen und zu jeder Uhrzeit. Wir bündeln eine digitale Gästemappe, einen Assistenten, der auf WhatsApp für Sie antwortet, und Automatisierungen, die sich um Hinweise und Fristen kümmern. Wir richten alles ein, ohne Apps zum Installieren.",
        pains: [
          { title: "„Wie lautet das WLAN-Passwort?“ zum zehnten Mal diese Woche", body: "WLAN, Check-out-Zeit, Parken, wie die Waschmaschine funktioniert, wohin der Müll kommt. Dieselben Fragen auf Englisch, Französisch oder Deutsch, oft gerade beim Abendessen oder mitten im Schlaf." },
          { title: "Späte Ankünfte und Nachrichten um zwei Uhr morgens", body: "Der Flug hatte Verspätung, der Gast findet den Schlüsselkasten nicht und nur der Gastgeber weiß Bescheid. Eine langsame Antwort bedeutet oft eine schlechtere Bewertung." },
          { title: "Reinigungen und Fristen hängen an Ihrem Gedächtnis", body: "Buchungen über Airbnb und Booking.com, ein Reinigungsteam, das wissen will, wann es rein kann, und Gästemeldungen an das SIBA, die innerhalb von drei Werktagen fällig sind. Ein einziger Fehler genügt." },
          { title: "15 % Provision auf jede Buchung", body: "Selbst Gäste, die jedes Jahr wiederkommen, buchen über die Plattform, weil die Unterkunft keine eigene Website zum Buchen hat." },
        ],
        dayInTheLife: [
          { title: "10:30 — Die Reinigung ist schon abgesprochen", body: "Das Team hat gestern die Nachricht auf WhatsApp bekommen: Abreise um 11 Uhr, neue Anreise um 16 Uhr in derselben Wohnung." },
          { title: "16:40 — Check-in ohne Anrufe", body: "Die Gäste kommen an, tippen das Schild neben der Tür an und haben WLAN, Hausregeln und die Anleitung fürs Induktionskochfeld in ihrer Sprache." },
          { title: "23:50 — Frage beantwortet, während Sie schlafen", body: "„Is there a pharmacy open now?“ Der Assistent antwortet auf Englisch mit der nächstgelegenen Notdienstapotheke und weckt Sie nur bei einem echten Notfall." },
          { title: "Am nächsten Tag, 09:00 — Fristen im Griff", body: "Sie erhalten eine Erinnerung: Für ausländische Gäste stehen noch Meldungen an das SIBA bis morgen aus." },
        ],
        faq: [
          { q: "Ersetzt das Airbnb, Booking.com oder meine Verwaltungssoftware?", a: "Nein. Wir arbeiten mit dem, was Sie schon nutzen. Die Plattformen kümmern sich weiter um die Buchungen, und Gästemappe, Assistent und Automatisierungen docken an Ihren bestehenden Kalender an." },
          { q: "Gilt die digitale Gästemappe als das gesetzlich vorgeschriebene Informationsbuch?", a: "Die Gästemappe enthält die Inhalte, die das portugiesische Gesetz für das Informationsbuch verlangt: Funktionsweise der Unterkunft, Regeln, Müll, Geräte, Lärm, Hausordnung der Eigentümergemeinschaft und Ihren Kontakt, auf Portugiesisch, Englisch und in zwei weiteren Sprachen. Außerdem erhalten Sie eine Druckversion, die wir in der Unterkunft zu lassen empfehlen." },
          { q: "Übernehmen Sie die Gästemeldungen an das SIBA?", a: "Wir senden keine Meldungen in Ihrem Namen. Wir erinnern Sie anhand des Kalenders an die Fristen und empfehlen für den automatischen Versand spezialisierte Tools wie Chekin oder Hostkit, die gut mit Steevanz zusammenarbeiten." },
          { q: "Darf ich Gäste um Bewertungen bitten?", a: "Ja, und das sollten Sie auch, bei allen Gästen auf die gleiche Weise und ohne Geschenke oder Rabatte als Gegenleistung. Booking.com und Airbnb schicken nach der Abreise ihre eigene Einladung, und die Gästemappe erklärt, wo man sie findet. Die Google-Schilder sind für Hostels, Gästehäuser und Häuser gedacht, in denen Sie die Gäste persönlich empfangen." },
          { q: "Gibt der Assistent den Türcode an jeden heraus, der fragt?", a: "Nein. Zugangscodes werden vom Assistenten nie weitergegeben und stehen auch nicht in der Gästemappe. Sie schicken sie weiterhin in Ihrer Check-in-Nachricht. Notfälle und Beschwerden gehen sofort an Sie." },
          { q: "Ich habe mehrere Unterkünfte. Wie funktioniert das?", a: "Jede Unterkunft hat ihre eigene Gästemappe und ihr eigenes Schild, und der Assistent weiß, in welchem Haus jeder Gast wohnt. Für Verwalter mehrerer Unterkünfte gibt es Mengenpreise." },
        ],
      },
      it: {
        name: "Case vacanza",
        cardTitle: "Case vacanza",
        cardBody: "Ospiti ben informati in ogni lingua, meno messaggi nel cuore della notte e pulizie che si organizzano da sole.",
        bundleTitle: "Il pacchetto per case vacanza",
        bundleBody: "Una guida digitale della casa in quattro lingue, che si apre con un tocco su una targa all'interno dell'alloggio, un assistente con IA su WhatsApp che risponde agli ospiti 24 ore su 24 con le informazioni della guida, avvisi automatici al team delle pulizie, promemoria per le comunicazioni degli ospiti a partire dal calendario che già usa e, se vuole, un sito web con prenotazione diretta.",
        metaTitle: "Guida digitale, assistente IA e automazione per case vacanza | Steevanz",
        metaDescription: "Guida digitale della casa in quattro lingue con un tocco, assistente con IA su WhatsApp 24 ore su 24, avvisi automatici per le pulizie e siti con prenotazione diretta per case vacanza in Portogallo.",
        heroTitle: "Ospiti ben accolti. Telefono in silenzioso.",
        heroSubtitle: "Chi gestisce una casa vacanza risponde ogni giorno alle stesse domande, in più lingue e a qualsiasi ora. Riuniamo una guida digitale della casa, un assistente che risponde per Lei su WhatsApp e automazioni che si occupano di avvisi e scadenze. Configuriamo tutto noi, senza app da installare.",
        pains: [
          { title: "«Qual è la password del WiFi?» per la decima volta questa settimana", body: "WiFi, orario di check-out, parcheggio, come funziona la lavatrice, dove si butta la spazzatura. Le stesse domande, in inglese, francese o tedesco, spesso mentre sta cenando o dormendo." },
          { title: "Arrivi in ritardo e messaggi alle due di notte", body: "Il volo è in ritardo, l'ospite non trova la cassetta delle chiavi e solo l'host sa rispondere. Una risposta lenta spesso significa una recensione più bassa." },
          { title: "Pulizie e scadenze affidate alla Sua memoria", body: "Prenotazioni su Airbnb e Booking.com, il team delle pulizie in attesa di sapere quando entrare e le comunicazioni degli ospiti al SIBA da inviare entro tre giorni lavorativi. Basta una dimenticanza perché qualcosa vada storto." },
          { title: "Commissioni del 15% su ogni prenotazione", body: "Anche chi torna ogni anno prenota tramite la piattaforma, perché l'alloggio non ha un sito web proprio dove prenotare." },
        ],
        dayInTheLife: [
          { title: "10:30 — Pulizie già organizzate", body: "Ieri il team ha ricevuto l'avviso su WhatsApp: partenza alle 11 e nuovo arrivo alle 16 nello stesso appartamento." },
          { title: "16:40 — Check-in senza telefonate", body: "Gli ospiti entrano, toccano la targa accanto alla porta e trovano il WiFi, le regole della casa e come funziona il piano a induzione nella loro lingua." },
          { title: "23:50 — Domanda risolta mentre dorme", body: "«Is there a pharmacy open now?» L'assistente risponde in inglese indicando la farmacia di turno più vicina e La sveglia solo se è un'urgenza." },
          { title: "Il giorno dopo, 09:00 — Scadenze rispettate", body: "Riceve un promemoria: ci sono comunicazioni di ospiti stranieri da inviare al SIBA entro domani." },
        ],
        faq: [
          { q: "Questo sostituisce Airbnb, Booking.com o il mio software di gestione?", a: "No. Lavoriamo insieme a ciò che già usa. Le piattaforme continuano a gestire le prenotazioni, e la guida, l'assistente e le automazioni si collegano al calendario che ha già." },
          { q: "La guida digitale vale come il libro informativo richiesto dalla legge?", a: "La guida include i contenuti che la legge portoghese richiede per il libro informativo: funzionamento della casa, regole, rifiuti, elettrodomestici, rumore, regolamento condominiale e il Suo contatto, in portoghese, inglese e altre due lingue. Le consegniamo anche una versione da stampare, che consigliamo di lasciare nell'alloggio." },
          { q: "Vi occupate delle comunicazioni al SIBA?", a: "Non inviamo comunicazioni a Suo nome. Le ricordiamo le scadenze in base al calendario e, se vuole automatizzare l'invio, consigliamo strumenti specializzati come Chekin o Hostkit, che funzionano bene insieme a Steevanz." },
          { q: "Posso chiedere recensioni agli ospiti?", a: "Può e deve farlo, sempre allo stesso modo con tutti, senza omaggi né sconti in cambio. Booking.com e Airbnb inviano il proprio invito dopo la partenza, e la guida spiega all'ospite dove trovarlo. Le targhe per Google sono pensate per ostelli, guest house e case in cui accoglie gli ospiti di persona." },
          { q: "L'assistente dà il codice della porta a chiunque lo chieda?", a: "No. I codici di accesso non vengono mai condivisi dall'assistente e non compaiono nella guida. Continui a inviarli nel Suo messaggio di check-in. Urgenze e reclami passano subito a Lei." },
          { q: "Ho più alloggi. Come funziona?", a: "Ogni alloggio ha la sua guida e la sua targa, e l'assistente sa in quale casa si trova ogni ospite. Per chi gestisce più alloggi ci sono prezzi a volume." },
        ],
      },
    },
  },
];

export function getSector(id: SectorId): Sector {
  const sector = sectors.find((candidate) => candidate.id === id);
  if (!sector) throw new Error(`Unknown sector ${id}`);
  return sector;
}

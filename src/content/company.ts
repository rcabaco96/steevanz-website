import type { Localized } from "@/lib/i18n";
import type { TitledText } from "./types";

export interface AboutCopy {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  lead: string;
  storyTitle: string;
  story: string[];
  valuesEyebrow: string;
  valuesTitle: string;
  values: TitledText[];
  howTitle: string;
  how: TitledText[];
  photoCaption: string;
  ctaTitle: string;
  ctaBody: string;
}

export interface ContactCopy {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  lead: string;
  channels: { whatsapp: string; whatsappBody: string; email: string; emailBody: string; phone: string; phoneBody: string; instagram: string; instagramBody: string };
  hoursTitle: string;
  hours: string;
  responseTime: string;
  demoTitle: string;
  demoBody: string;
  infoTitle: string;
  infoBody: string;
  locationTitle: string;
  location: string;
}

export const aboutCopy: Localized<AboutCopy> = {
  pt: {
    metaTitle: "Sobre a Steevanz — Tecnologia do futuro. Com os bons modos de antigamente.",
    metaDescription: "Somos uma equipa portuguesa que torna a tecnologia simples e acessível para negócios locais: placas com tecnologia Steevanz, reservas e inteligência artificial com suporte próximo.",
    eyebrow: "Sobre nós",
    title: "Tecnologia do futuro. Com os bons modos de antigamente.",
    lead: "A Steevanz nasceu de uma família alentejana de nerds e geeks com uma ideia simples: a tecnologia deve adaptar-se às pessoas, e não o contrário.",
    storyTitle: "A nossa história",
    story: [
      "Desde 2021 que desenvolvemos software à medida para empresas de várias dimensões. Pelo caminho, reparámos numa coisa: os negócios locais — o restaurante do bairro, o salão de sempre, a clínica de confiança — eram quem mais beneficiava da tecnologia e quem menos acesso tinha a ela.",
      "Ferramentas pensadas para grandes empresas são caras, complicadas e vêm com contratos que ninguém lê. Decidimos fazer o contrário: produtos simples, preços claros, instalação feita por nós e uma pessoa real do outro lado do WhatsApp.",
      "Começámos pelas placas para reviews no Google, porque resolvem um problema que todos os negócios têm, com um investimento pequeno e resultados visíveis. A partir daí juntámos reservas, filas, cartões de cliente e inteligência artificial, sempre com a mesma regra: se não poupa tempo ou não traz clientes, não vale a pena.",
    ],
    valuesEyebrow: "O que nos guia",
    valuesTitle: "Ser Steevanz é ser",
    values: [
      { title: "Empático", body: "Explicamos sem jargão. Não tem de saber o que é um front end para trabalhar connosco." },
      { title: "Honesto", body: "Se uma ferramenta não faz sentido para o seu negócio, dizemos-lhe. Preferimos um cliente satisfeito a uma venda." },
      { title: "Eficiente", body: "Soluções que funcionam no primeiro dia e não precisam de manuais de cem páginas." },
      { title: "Leal", body: "Acompanhamos os nossos clientes a longo prazo, com suporte próximo e respostas rápidas." },
    ],
    howTitle: "Como trabalhamos",
    how: [
      { title: "Primeiro ouvimos", body: "Cada demonstração começa com perguntas sobre o seu negócio, não com uma apresentação de produto." },
      { title: "Depois configuramos", body: "Tratamos da instalação, dos testes e da formação da equipa. Recebe tudo pronto a usar." },
      { title: "E ficamos por perto", body: "Suporte por WhatsApp e e-mail, melhorias contínuas e zero letras miudinhas." },
    ],
    photoCaption: "Pequena equipa, grande atenção ao detalhe.",
    ctaTitle: "Vamos conhecer o seu negócio?",
    ctaBody: "Marque uma conversa de 20 minutos. Sem pressões, sem jargão, com café virtual incluído.",
  },
  en: {
    metaTitle: "About Steevanz — Technology of the future. With good old-fashioned manners.",
    metaDescription: "We're a Portuguese team making technology simple and accessible for local businesses: plates with Steevanz technology, bookings and AI, with hands-on support.",
    eyebrow: "About us",
    title: "Technology of the future. With good old-fashioned manners.",
    lead: "Steevanz was born from an Alentejo family of nerds and geeks with a simple idea: technology should adapt to people, not the other way round.",
    storyTitle: "Our story",
    story: [
      "Since 2021 we have been building bespoke software for companies of all sizes. Along the way we noticed something: local businesses — the neighbourhood restaurant, the salon you've always used, the clinic you trust — stood to gain the most from technology and had the least access to it.",
      "Tools designed for large companies are expensive, complicated and come with contracts nobody reads. We decided to do the opposite: simple products, clear prices, setup done by us and a real person on the other end of WhatsApp.",
      "We started with plates for Google reviews, because they solve a problem every business has, with a small investment and visible results. From there we added bookings, queues, loyalty and artificial intelligence, always with the same rule: if it doesn't save time or bring customers, it isn't worth it.",
    ],
    valuesEyebrow: "What guides us",
    valuesTitle: "Being Steevanz means being",
    values: [
      { title: "Empathetic", body: "We explain without jargon. You don't need to know what a front end is to work with us." },
      { title: "Honest", body: "If a tool doesn't make sense for your business, we'll tell you. We'd rather have a happy client than a sale." },
      { title: "Efficient", body: "Solutions that work from day one and don't need hundred-page manuals." },
      { title: "Loyal", body: "We stay with our clients for the long run, with close support and quick answers." },
    ],
    howTitle: "How we work",
    how: [
      { title: "First, we listen", body: "Every demo starts with questions about your business, not with a product pitch." },
      { title: "Then, we set it up", body: "We handle installation, testing and team training. You get everything ready to use." },
      { title: "And we stay close", body: "Support by WhatsApp and email, continuous improvements and no small print." },
    ],
    photoCaption: "A small team with a big eye for detail.",
    ctaTitle: "Shall we get to know your business?",
    ctaBody: "Book a 20-minute chat. No pressure, no jargon, virtual coffee included.",
  },
  es: {
    metaTitle: "Sobre Steevanz: Tecnología del futuro. Con los buenos modales de antes.",
    metaDescription: "Somos un equipo portugués que hace la tecnología sencilla y accesible para los negocios locales: placas con tecnología Steevanz, reservas e inteligencia artificial, con un soporte cercano.",
    eyebrow: "Sobre nosotros",
    title: "Tecnología del futuro. Con los buenos modales de antes.",
    lead: "Steevanz nació de una familia alentejana de nerds y geeks con una idea sencilla: la tecnología debe adaptarse a las personas, y no al revés.",
    storyTitle: "Nuestra historia",
    story: [
      "Desde 2021 desarrollamos software a medida para empresas de todos los tamaños. Por el camino nos dimos cuenta de algo: los negocios locales (el restaurante del barrio, la peluquería de confianza, la clínica que conoce a sus pacientes) eran los que más ganaban con la tecnología y los que menos acceso tenían a ella.",
      "Las herramientas pensadas para grandes empresas son caras, complicadas y vienen con contratos que nadie lee. Decidimos hacer lo contrario: productos sencillos, precios claros, instalación a cargo nuestro y una persona real al otro lado del WhatsApp.",
      "Empezamos por las placas para reseñas en Google, porque resuelven un problema que tienen todos los negocios, con una inversión pequeña y resultados visibles. A partir de ahí sumamos reservas, colas, tarjetas de cliente e inteligencia artificial, siempre con la misma regla: si no ahorra tiempo o no trae clientes, no merece la pena.",
    ],
    valuesEyebrow: "Lo que nos guía",
    valuesTitle: "Ser Steevanz es ser",
    values: [
      { title: "Empáticos", body: "Lo explicamos sin jerga. No hace falta saber qué es un front end para trabajar con nosotros." },
      { title: "Honestos", body: "Si una herramienta no tiene sentido para su negocio, se lo decimos. Preferimos un cliente satisfecho a una venta." },
      { title: "Eficientes", body: "Soluciones que funcionan desde el primer día y no necesitan manuales de cien páginas." },
      { title: "Leales", body: "Acompañamos a nuestros clientes a largo plazo, con un soporte cercano y respuestas rápidas." },
    ],
    howTitle: "Cómo trabajamos",
    how: [
      { title: "Primero escuchamos", body: "Cada demostración empieza con preguntas sobre su negocio, no con una presentación de producto." },
      { title: "Después lo configuramos", body: "Nos ocupamos de la instalación, las pruebas y la formación del equipo. Lo recibe todo listo para usar." },
      { title: "Y seguimos cerca", body: "Soporte por WhatsApp y email, mejoras continuas y cero letra pequeña." },
    ],
    photoCaption: "Un equipo pequeño, con mucha atención al detalle.",
    ctaTitle: "¿Conocemos su negocio?",
    ctaBody: "Reserve una conversación de 20 minutos. Sin presiones, sin jerga y con café virtual incluido.",
  },
  fr: {
    metaTitle: "À propos de Steevanz : Technologie du futur. Avec les bonnes manières d'antan.",
    metaDescription: "Nous sommes une équipe portugaise qui rend la technologie simple et accessible aux commerces de proximité : plaques avec la technologie Steevanz, réservations et intelligence artificielle, avec un accompagnement proche.",
    eyebrow: "À propos",
    title: "Technologie du futur. Avec les bonnes manières d'antan.",
    lead: "Steevanz est née d'une famille de l'Alentejo, passionnée d'informatique, avec une idée simple : la technologie doit s'adapter aux gens, et non l'inverse.",
    storyTitle: "Notre histoire",
    story: [
      "Depuis 2021, nous développons des logiciels sur mesure pour des entreprises de toutes tailles. En chemin, nous avons remarqué une chose : les commerces de proximité (le restaurant du quartier, le salon de coiffure du coin, la clinique de confiance) étaient ceux qui avaient le plus à gagner de la technologie et le moins accès à elle.",
      "Les outils pensés pour les grandes entreprises sont chers, compliqués et viennent avec des contrats que personne ne lit. Nous avons décidé de faire l'inverse : des produits simples, des prix clairs, une installation faite par nous et une vraie personne au bout du fil sur WhatsApp.",
      "Nous avons commencé par les plaques pour avis Google, parce qu'elles règlent un problème commun à tous les commerces, avec un petit investissement et des résultats visibles. Nous y avons ajouté réservations, files d'attente, cartes de fidélité et intelligence artificielle, toujours avec la même règle : si cela ne fait pas gagner du temps ou venir des clients, cela n'en vaut pas la peine.",
    ],
    valuesEyebrow: "Ce qui nous guide",
    valuesTitle: "Être Steevanz, c'est être",
    values: [
      { title: "Empathiques", body: "Nous expliquons sans jargon. Pas besoin de savoir ce qu'est un front end pour travailler avec nous." },
      { title: "Honnêtes", body: "Si un outil n'a pas de sens pour votre activité, nous vous le disons. Nous préférons un client satisfait à une vente." },
      { title: "Efficaces", body: "Des solutions qui fonctionnent dès le premier jour, sans manuel de cent pages." },
      { title: "Fidèles", body: "Nous accompagnons nos clients sur la durée, avec un suivi proche et des réponses rapides." },
    ],
    howTitle: "Comment nous travaillons",
    how: [
      { title: "D'abord, nous écoutons", body: "Chaque démo commence par des questions sur votre activité, pas par une présentation de produit." },
      { title: "Ensuite, nous configurons", body: "Nous nous chargeons de l'installation, des tests et de la formation de l'équipe. Vous recevez tout prêt à l'emploi." },
      { title: "Et nous restons proches", body: "Assistance par WhatsApp et e-mail, améliorations continues et zéro petites lignes." },
    ],
    photoCaption: "Une petite équipe, un grand souci du détail.",
    ctaTitle: "Et si nous faisions connaissance ?",
    ctaBody: "Réservez un échange de 20 minutes. Sans pression, sans jargon, café virtuel compris.",
  },
  de: {
    metaTitle: "Über Steevanz: Technologie der Zukunft. Mit den guten Manieren von früher.",
    metaDescription: "Wir sind ein portugiesisches Team, das Technologie für lokale Betriebe einfach und zugänglich macht: Schilder mit Steevanz-Technologie, Reservierungen und künstliche Intelligenz, mit persönlicher Betreuung.",
    eyebrow: "Über uns",
    title: "Technologie der Zukunft. Mit den guten Manieren von früher.",
    lead: "Steevanz entstand in einer Familie von Nerds und Geeks aus dem Alentejo, mit einer einfachen Idee: Technologie soll sich den Menschen anpassen, nicht umgekehrt.",
    storyTitle: "Unsere Geschichte",
    story: [
      "Seit 2021 entwickeln wir maßgeschneiderte Software für Unternehmen jeder Größe. Dabei ist uns etwas aufgefallen: Lokale Betriebe (das Restaurant um die Ecke, der Friseur des Vertrauens, die Praxis, die ihre Patienten kennt) hätten am meisten von Technologie, aber den schwersten Zugang zu ihr.",
      "Werkzeuge für große Unternehmen sind teuer, kompliziert und kommen mit Verträgen, die niemand liest. Wir haben uns für das Gegenteil entschieden: einfache Produkte, klare Preise, Einrichtung durch uns und ein echter Mensch am anderen Ende von WhatsApp.",
      "Angefangen haben wir mit Schildern für Google-Bewertungen, weil sie ein Problem lösen, das jeder Betrieb hat, mit kleiner Investition und sichtbaren Ergebnissen. Danach kamen Reservierungen, Warteschlangen, Kundenkarten und künstliche Intelligenz dazu, immer nach derselben Regel: Wenn es keine Zeit spart oder keine Kunden bringt, lohnt es sich nicht.",
    ],
    valuesEyebrow: "Was uns leitet",
    valuesTitle: "Steevanz zu sein heißt",
    values: [
      { title: "Einfühlsam", body: "Wir erklären ohne Fachchinesisch. Sie müssen nicht wissen, was ein Frontend ist, um mit uns zu arbeiten." },
      { title: "Ehrlich", body: "Wenn ein Werkzeug für Ihren Betrieb keinen Sinn ergibt, sagen wir es Ihnen. Ein zufriedener Kunde ist uns lieber als ein Verkauf." },
      { title: "Effizient", body: "Lösungen, die vom ersten Tag an funktionieren und keine hundertseitigen Handbücher brauchen." },
      { title: "Treu", body: "Wir begleiten unsere Kunden langfristig, mit persönlicher Betreuung und schnellen Antworten." },
    ],
    howTitle: "So arbeiten wir",
    how: [
      { title: "Zuerst hören wir zu", body: "Jede Demo beginnt mit Fragen zu Ihrem Betrieb, nicht mit einer Produktpräsentation." },
      { title: "Dann richten wir ein", body: "Wir kümmern uns um Installation, Tests und die Schulung Ihres Teams. Sie bekommen alles einsatzbereit." },
      { title: "Und wir bleiben in der Nähe", body: "Support per WhatsApp und E-Mail, laufende Verbesserungen und kein Kleingedrucktes." },
    ],
    photoCaption: "Ein kleines Team mit großem Blick fürs Detail.",
    ctaTitle: "Sollen wir Ihren Betrieb kennenlernen?",
    ctaBody: "Vereinbaren Sie ein 20-minütiges Gespräch. Ohne Druck, ohne Fachchinesisch, virtueller Kaffee inklusive.",
  },
  it: {
    metaTitle: "Chi è Steevanz: Tecnologia del futuro. Con le buone maniere di una volta.",
    metaDescription: "Siamo un team portoghese che rende la tecnologia semplice e accessibile per le attività locali: targhe con tecnologia Steevanz, prenotazioni e intelligenza artificiale, con un'assistenza vicina.",
    eyebrow: "Chi siamo",
    title: "Tecnologia del futuro. Con le buone maniere di una volta.",
    lead: "Steevanz è nata da una famiglia dell'Alentejo di nerd e geek con un'idea semplice: è la tecnologia che deve adattarsi alle persone, non il contrario.",
    storyTitle: "La nostra storia",
    story: [
      "Dal 2021 sviluppiamo software su misura per aziende di ogni dimensione. Lungo la strada ci siamo accorti di una cosa: le attività locali (il ristorante di quartiere, il parrucchiere di fiducia, la clinica che conosce i suoi pazienti) erano quelle che avevano più da guadagnare dalla tecnologia e meno accesso a essa.",
      "Gli strumenti pensati per le grandi aziende sono costosi, complicati e arrivano con contratti che nessuno legge. Abbiamo deciso di fare il contrario: prodotti semplici, prezzi chiari, installazione fatta da noi e una persona vera dall'altra parte di WhatsApp.",
      "Abbiamo iniziato con le targhe per recensioni Google, perché risolvono un problema che hanno tutte le attività, con un piccolo investimento e risultati visibili. Poi abbiamo aggiunto prenotazioni, code, carte fedeltà e intelligenza artificiale, sempre con la stessa regola: se non fa risparmiare tempo o non porta clienti, non ne vale la pena.",
    ],
    valuesEyebrow: "Cosa ci guida",
    valuesTitle: "Essere Steevanz vuol dire essere",
    values: [
      { title: "Empatici", body: "Spieghiamo senza gergo tecnico. Non serve sapere cos'è un front end per lavorare con noi." },
      { title: "Onesti", body: "Se uno strumento non ha senso per la vostra attività, ve lo diciamo. Preferiamo un cliente soddisfatto a una vendita." },
      { title: "Efficienti", body: "Soluzioni che funzionano dal primo giorno e non richiedono manuali di cento pagine." },
      { title: "Leali", body: "Seguiamo i nostri clienti nel tempo, con un'assistenza vicina e risposte rapide." },
    ],
    howTitle: "Come lavoriamo",
    how: [
      { title: "Prima ascoltiamo", body: "Ogni demo inizia con domande sulla vostra attività, non con una presentazione di prodotto." },
      { title: "Poi configuriamo", body: "Ci occupiamo di installazione, test e formazione dello staff. Ricevete tutto pronto all'uso." },
      { title: "E restiamo vicini", body: "Assistenza via WhatsApp ed email, miglioramenti continui e nessuna clausola nascosta." },
    ],
    photoCaption: "Un piccolo team, con grande attenzione ai dettagli.",
    ctaTitle: "Vi va di farci conoscere la vostra attività?",
    ctaBody: "Prenotate una chiacchierata di 20 minuti. Senza pressioni, senza gergo, caffè virtuale incluso.",
  },
};

export const contactCopy: Localized<ContactCopy> = {
  pt: {
    metaTitle: "Contacto — fale com a Steevanz por WhatsApp, e-mail ou telefone",
    metaDescription: "Fale com a Steevanz por WhatsApp, e-mail ou telefone. Respondemos em dias úteis. Agende uma demonstração gratuita das placas e soluções de IA.",
    eyebrow: "Contacto",
    title: "Fale connosco. Respondemos como gostamos que nos respondam.",
    lead: "Escolha o canal que lhe der mais jeito. Por norma respondemos no próprio dia útil.",
    channels: {
      whatsapp: "WhatsApp",
      whatsappBody: "A forma mais rápida de falar connosco.",
      email: "E-mail",
      emailBody: "Para pedidos detalhados ou documentos.",
      phone: "Telefone",
      phoneBody: "Em dias úteis, das 10h às 18h.",
      instagram: "Instagram",
      instagramBody: "Novidades e bastidores.",
    },
    hoursTitle: "Horário",
    hours: "Segunda a sexta, das 10h às 18h",
    responseTime: "Resposta habitual no mesmo dia útil.",
    demoTitle: "Prefere ver a funcionar?",
    demoBody: "Escolha dia e hora para uma demonstração gratuita de 20 minutos, online ou por telefone.",
    infoTitle: "Quer informação por escrito?",
    infoBody: "Deixe o seu contacto e enviamos-lhe detalhes e preços do produto que lhe interessa.",
    locationTitle: "Onde estamos",
    location: "Lisboa, com clientes em todo o país. Trabalhamos à distância e deslocamo-nos quando é preciso.",
  },
  en: {
    metaTitle: "Contact — talk to Steevanz by WhatsApp, email or phone",
    metaDescription: "Talk to Steevanz by WhatsApp, email or phone. We reply on working days. Book a free demo of our plates and AI solutions.",
    eyebrow: "Contact",
    title: "Talk to us. We reply the way we like to be replied to.",
    lead: "Pick whichever channel suits you best. We usually reply on the same working day.",
    channels: {
      whatsapp: "WhatsApp",
      whatsappBody: "The quickest way to reach us.",
      email: "Email",
      emailBody: "For detailed requests or documents.",
      phone: "Phone",
      phoneBody: "Working days, 10am to 6pm.",
      instagram: "Instagram",
      instagramBody: "News and behind the scenes.",
    },
    hoursTitle: "Opening hours",
    hours: "Monday to Friday, 10am to 6pm (Lisbon time)",
    responseTime: "We usually reply on the same working day.",
    demoTitle: "Would you rather see it working?",
    demoBody: "Pick a day and time for a free 20-minute demo, online or by phone.",
    infoTitle: "Want information in writing?",
    infoBody: "Leave your details and we'll send you information and prices for the product you're interested in.",
    locationTitle: "Where we are",
    location: "Lisbon, with clients across Portugal. We work remotely and travel when needed.",
  },
  es: {
    metaTitle: "Contacto: hable con Steevanz por WhatsApp, email o teléfono",
    metaDescription: "Hable con Steevanz por WhatsApp, email o teléfono. Respondemos en días laborables. Reserve una demostración gratuita de las placas y las soluciones de IA.",
    eyebrow: "Contacto",
    title: "Hable con nosotros. Respondemos como nos gusta que nos respondan.",
    lead: "Elija el canal que le resulte más cómodo. Normalmente respondemos el mismo día laborable.",
    channels: {
      whatsapp: "WhatsApp",
      whatsappBody: "La forma más rápida de hablar con nosotros.",
      email: "Email",
      emailBody: "Para consultas detalladas o documentos.",
      phone: "Teléfono",
      phoneBody: "En días laborables, de 10:00 a 18:00 (hora de Lisboa).",
      instagram: "Instagram",
      instagramBody: "Novedades y entre bastidores.",
    },
    hoursTitle: "Horario",
    hours: "De lunes a viernes, de 10:00 a 18:00 (hora de Lisboa)",
    responseTime: "Solemos responder el mismo día laborable.",
    demoTitle: "¿Prefiere verlo funcionando?",
    demoBody: "Elija día y hora para una demostración gratuita de 20 minutos, online o por teléfono.",
    infoTitle: "¿Quiere la información por escrito?",
    infoBody: "Déjenos su contacto y le enviamos los detalles y precios del producto que le interesa.",
    locationTitle: "Dónde estamos",
    location: "En Lisboa, con clientes en todo Portugal. Trabajamos a distancia y nos desplazamos cuando hace falta.",
  },
  fr: {
    metaTitle: "Contact : parlez à Steevanz par WhatsApp, e-mail ou téléphone",
    metaDescription: "Parlez à Steevanz par WhatsApp, e-mail ou téléphone. Nous répondons les jours ouvrés. Réservez une démo gratuite de nos plaques et solutions d'IA.",
    eyebrow: "Contact",
    title: "Parlez-nous. Nous répondons comme nous aimons qu'on nous réponde.",
    lead: "Choisissez le canal qui vous convient le mieux. Nous répondons en général le jour ouvré même.",
    channels: {
      whatsapp: "WhatsApp",
      whatsappBody: "Le moyen le plus rapide de nous joindre.",
      email: "E-mail",
      emailBody: "Pour les demandes détaillées ou les documents.",
      phone: "Téléphone",
      phoneBody: "Les jours ouvrés, de 10 h à 18 h (heure de Lisbonne).",
      instagram: "Instagram",
      instagramBody: "Nouveautés et coulisses.",
    },
    hoursTitle: "Horaires",
    hours: "Du lundi au vendredi, de 10 h à 18 h (heure de Lisbonne)",
    responseTime: "Réponse habituelle le jour ouvré même.",
    demoTitle: "Vous préférez le voir fonctionner ?",
    demoBody: "Choisissez le jour et l'heure d'une démo gratuite de 20 minutes, en ligne ou par téléphone.",
    infoTitle: "Vous voulez des informations par écrit ?",
    infoBody: "Laissez vos coordonnées et nous vous envoyons les détails et les prix du produit qui vous intéresse.",
    locationTitle: "Où nous trouver",
    location: "À Lisbonne, avec des clients dans tout le Portugal. Nous travaillons à distance et nous déplaçons quand il le faut.",
  },
  de: {
    metaTitle: "Kontakt: Sprechen Sie mit Steevanz per WhatsApp, E-Mail oder Telefon",
    metaDescription: "Sprechen Sie mit Steevanz per WhatsApp, E-Mail oder Telefon. Wir antworten an Werktagen. Vereinbaren Sie eine kostenlose Demo unserer Schilder und KI-Lösungen.",
    eyebrow: "Kontakt",
    title: "Sprechen Sie mit uns. Wir antworten so, wie wir selbst gern eine Antwort bekommen.",
    lead: "Wählen Sie den Weg, der Ihnen am besten passt. In der Regel antworten wir am selben Werktag.",
    channels: {
      whatsapp: "WhatsApp",
      whatsappBody: "Der schnellste Weg zu uns.",
      email: "E-Mail",
      emailBody: "Für ausführliche Anfragen oder Dokumente.",
      phone: "Telefon",
      phoneBody: "Werktags von 10 bis 18 Uhr (Lissabonner Zeit).",
      instagram: "Instagram",
      instagramBody: "Neuigkeiten und ein Blick hinter die Kulissen.",
    },
    hoursTitle: "Erreichbarkeit",
    hours: "Montag bis Freitag, 10 bis 18 Uhr (Lissabonner Zeit)",
    responseTime: "Antwort meist noch am selben Werktag.",
    demoTitle: "Lieber live sehen?",
    demoBody: "Wählen Sie Tag und Uhrzeit für eine kostenlose 20-minütige Demo, online oder per Telefon.",
    infoTitle: "Lieber Informationen schriftlich?",
    infoBody: "Hinterlassen Sie Ihre Kontaktdaten, und wir schicken Ihnen Details und Preise zum Produkt, das Sie interessiert.",
    locationTitle: "Wo wir sind",
    location: "In Lissabon, mit Kunden in ganz Portugal. Wir arbeiten aus der Ferne und kommen vorbei, wenn es nötig ist.",
  },
  it: {
    metaTitle: "Contatti: parlate con Steevanz via WhatsApp, email o telefono",
    metaDescription: "Parlate con Steevanz via WhatsApp, email o telefono. Rispondiamo nei giorni lavorativi. Prenotate una demo gratuita delle targhe e delle soluzioni di IA.",
    eyebrow: "Contatti",
    title: "Parlate con noi. Rispondiamo come ci piace che ci rispondano.",
    lead: "Scegliete il canale che vi è più comodo. Di solito rispondiamo entro lo stesso giorno lavorativo.",
    channels: {
      whatsapp: "WhatsApp",
      whatsappBody: "Il modo più rapido per raggiungerci.",
      email: "Email",
      emailBody: "Per richieste dettagliate o documenti.",
      phone: "Telefono",
      phoneBody: "Nei giorni lavorativi, dalle 10 alle 18 (ora di Lisbona).",
      instagram: "Instagram",
      instagramBody: "Novità e dietro le quinte.",
    },
    hoursTitle: "Orari",
    hours: "Dal lunedì al venerdì, dalle 10 alle 18 (ora di Lisbona)",
    responseTime: "Di solito rispondiamo entro lo stesso giorno lavorativo.",
    demoTitle: "Preferite vederlo in funzione?",
    demoBody: "Scegliete giorno e ora per una demo gratuita di 20 minuti, online o al telefono.",
    infoTitle: "Volete le informazioni per iscritto?",
    infoBody: "Lasciateci un contatto e vi inviamo dettagli e prezzi del prodotto che vi interessa.",
    locationTitle: "Dove siamo",
    location: "A Lisbona, con clienti in tutto il Portogallo. Lavoriamo a distanza e ci spostiamo quando serve.",
  },
};

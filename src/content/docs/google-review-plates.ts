import type { ProductDocs } from "../types";

export const docs: ProductDocs = {
  productId: "google-review-plates",
  pages: {
    "getting-started": {
      pt: {
        title: "Primeiros passos com as placas Google Reviews",
        description:
          "Saiba como funcionam as placas para reviews no Google, o que recebe da Steevanz e o que precisa de preparar antes de começar a recolher reviews.",
        blocks: [
          {
            type: "p",
            text: "As placas Google Reviews permitem que os seus clientes deixem uma avaliação no Google em poucos segundos: basta aproximar o telemóvel da placa, ou apontar a câmara para o código QR impresso, e o formulário de avaliação do seu negócio abre de imediato. Sem pesquisas, sem procurar o nome da loja no Google Maps, sem passos intermédios.",
          },
          {
            type: "p",
            text: "Este é um serviço gerido: a Steevanz trata da configuração, da gravação dos chips e dos testes. Esta documentação explica como tudo funciona e como tirar o máximo partido das placas no dia a dia.",
          },
          { type: "h2", id: "como-funciona", text: "Como funciona" },
          {
            type: "p",
            text: "Cada placa tem um chip (do tipo **NTAG213** ou **NTAG215**) escondido no interior e um código QR impresso na frente. O chip e o QR apontam para um endereço curto gerido pela Steevanz, que por sua vez redireciona o cliente para o formulário de avaliação do seu Perfil da Empresa no Google.",
          },
          {
            type: "ol",
            items: [
              "O cliente aproxima o telemóvel da placa ou lê o código QR.",
              "O telemóvel abre o link no navegador ou na aplicação Google Maps.",
              "Aparece a janela de avaliação do seu negócio, já com as estrelas prontas a preencher.",
              "O cliente escolhe as estrelas, escreve um comentário (opcional) e publica.",
            ],
          },
          {
            type: "callout",
            tone: "info",
            title: "Nada para instalar",
            text: "O cliente não precisa de instalar nenhuma aplicação. A leitura por aproximação está incluída na grande maioria dos telemóveis recentes e o QR funciona com a câmara de qualquer smartphone.",
          },
          { type: "h2", id: "formatos-disponiveis", text: "Formatos disponíveis" },
          {
            type: "table",
            head: ["Formato", "Onde usar", "Notas"],
            rows: [
              ["Placa de balcão em acrílico", "Junto à caixa ou à receção", "Formato mais popular, com base estável"],
              ["Suporte de mesa", "Uma por mesa em restaurantes e cafés", "Visível durante toda a refeição"],
              ["Autocolante", "Menus, montras, espelhos, caixas registadoras", "Discreto e económico"],
              ["Placa de parede", "Entrada, sala de espera, corredor", "Instalar à altura dos olhos"],
            ],
          },
          { type: "h2", id: "o-que-precisa", text: "O que precisa antes de começar" },
          {
            type: "ul",
            items: [
              "Um **Perfil da Empresa no Google** (antigo Google My Business) ativo e verificado.",
              "Acesso a esse perfil como proprietário ou gestor, ou disponibilidade para nos enviar o link de avaliação.",
              "Uma ideia dos locais onde quer colocar as placas, para escolhermos os formatos certos.",
            ],
          },
          {
            type: "p",
            text: "Se ainda não tem o perfil verificado, trate disso primeiro: sem um perfil ativo, o Google não mostra o formulário de avaliação. Podemos orientá-lo no processo durante a [demonstração gratuita](/agendar).",
          },
          { type: "h2", id: "proximos-passos", text: "Próximos passos" },
          {
            type: "ul",
            items: [
              "[Instalação](/docs/placas-google-reviews/instalacao): como obtemos o link de avaliação e onde colocar cada placa.",
              "[Configuração](/docs/placas-google-reviews/configuracao): bloqueio dos chips, redirecionamento e alteração do destino.",
              "[Utilização](/docs/placas-google-reviews/utilizacao): como a sua equipa deve pedir avaliações sem violar as regras do Google.",
              "[Resolução de problemas](/docs/placas-google-reviews/resolucao-problemas): o que fazer se uma placa não reagir.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "A Steevanz não é o Google nem tem qualquer afiliação com a Google. As placas apenas encaminham os seus clientes para o formulário público de avaliação do seu perfil.",
          },
        ],
      },
      en: {
        title: "Getting started with Google review plates",
        description:
          "Learn how Google review plates work, what Steevanz delivers and what you need to prepare before you start collecting more Google reviews.",
        blocks: [
          {
            type: "p",
            text: "Google review plates let your customers leave a Google review in seconds: they tap their phone on the plate, or point the camera at the printed QR code, and your business's review form opens straight away. No searching, no hunting for your shop on Google Maps, no extra steps.",
          },
          {
            type: "p",
            text: "This is a managed service: Steevanz handles the setup, writes the chips and tests everything. This documentation explains how it all works and how to get the most out of your plates day to day.",
          },
          { type: "h2", id: "how-it-works", text: "How it works" },
          {
            type: "p",
            text: "Each plate has a chip (**NTAG213** or **NTAG215**) hidden inside and a QR code printed on the front. Both point to a short link managed by Steevanz, which redirects the customer to the review form of your Google Business Profile.",
          },
          {
            type: "ol",
            items: [
              "The customer taps their phone on the plate or scans the QR code.",
              "The phone opens the link in the browser or in the Google Maps app.",
              "Your business's review window appears, with the stars ready to fill in.",
              "The customer picks a rating, writes a comment (optional) and posts it.",
            ],
          },
          {
            type: "callout",
            tone: "info",
            title: "Nothing to install",
            text: "Customers don't need to install any app. Tap reading is built into the vast majority of recent phones, and the QR code works with any smartphone camera.",
          },
          { type: "h2", id: "available-formats", text: "Available formats" },
          {
            type: "table",
            head: ["Format", "Where to use it", "Notes"],
            rows: [
              ["Acrylic counter plate", "Next to the till or reception desk", "Most popular format, with a stable base"],
              ["Table stand", "One per table in restaurants and cafés", "Visible throughout the meal"],
              ["Sticker", "Menus, shop windows, mirrors, tills", "Discreet and affordable"],
              ["Wall plate", "Entrance, waiting room, corridor", "Mount at eye level"],
            ],
          },
          { type: "h2", id: "what-you-need", text: "What you need before you start" },
          {
            type: "ul",
            items: [
              "An active, verified **Google Business Profile** (formerly Google My Business).",
              "Owner or manager access to that profile, or the ability to send us your review link.",
              "A rough idea of where you want the plates, so we can pick the right formats.",
            ],
          },
          {
            type: "p",
            text: "If your profile isn't verified yet, sort that out first: without an active profile, Google won't show the review form. We can guide you through it during the [free demo](/en/book-a-demo).",
          },
          { type: "h2", id: "next-steps", text: "Next steps" },
          {
            type: "ul",
            items: [
              "[Setup](/en/docs/google-review-plates/setup): how we get your review link and where to place each plate.",
              "[Configuration](/en/docs/google-review-plates/configuration): chip locking, redirects and changing the destination.",
              "[Usage](/en/docs/google-review-plates/usage): how your team should ask for reviews without breaking Google's rules.",
              "[Troubleshooting](/en/docs/google-review-plates/troubleshooting): what to do if a plate doesn't respond.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Steevanz is not Google and has no affiliation with Google. The plates simply send your customers to the public review form of your profile.",
          },
        ],
      },
      es: {
        title: "Primeros pasos con las placas para reseñas en Google",
        description:
          "Descubra cómo funcionan las placas para reseñas en Google, qué recibe de Steevanz y qué debe preparar antes de empezar a recoger más reseñas en Google.",
        blocks: [
          {
            type: "p",
            text: "Las placas para reseñas en Google permiten que sus clientes dejen una reseña en Google en pocos segundos: basta con acercar el móvil a la placa, o apuntar la cámara al código QR impreso, y el formulario de reseñas de su negocio se abre al instante. Sin búsquedas, sin buscar el nombre del local en Google Maps, sin pasos intermedios.",
          },
          {
            type: "p",
            text: "Es un servicio gestionado: Steevanz se encarga de la configuración, de grabar los chips y de las pruebas. Esta documentación explica cómo funciona todo y cómo sacar el máximo partido a las placas en el día a día.",
          },
          { type: "h2", id: "how-it-works", text: "Cómo funciona" },
          {
            type: "p",
            text: "Cada placa tiene un chip (**NTAG213** o **NTAG215**) escondido en su interior y un código QR impreso en la parte delantera. El chip y el QR apuntan a una dirección corta gestionada por Steevanz, que redirige al cliente al formulario de reseñas de su Perfil de Empresa de Google.",
          },
          {
            type: "ol",
            items: [
              "El cliente acerca el móvil a la placa o escanea el código QR.",
              "El móvil abre el enlace en el navegador o en la app Google Maps.",
              "Aparece la ventana de reseña de su negocio, con las estrellas listas para rellenar.",
              "El cliente elige las estrellas, escribe un comentario (opcional) y lo publica.",
            ],
          },
          {
            type: "callout",
            tone: "info",
            title: "Nada que instalar",
            text: "El cliente no necesita instalar ninguna app. La lectura con un toque viene incluida en la gran mayoría de los móviles recientes, y el QR funciona con la cámara de cualquier smartphone.",
          },
          { type: "h2", id: "available-formats", text: "Formatos disponibles" },
          {
            type: "table",
            head: ["Formato", "Dónde usarlo", "Notas"],
            rows: [
              ["Placa de mostrador en acrílico", "Junto a la caja o la recepción", "El formato más popular, con base estable"],
              ["Soporte de mesa", "Uno por mesa en restaurantes y cafeterías", "Visible durante toda la comida"],
              ["Pegatina", "Cartas, escaparates, espejos, cajas registradoras", "Discreta y económica"],
              ["Placa de pared", "Entrada, sala de espera, pasillo", "Instalar a la altura de los ojos"],
            ],
          },
          { type: "h2", id: "what-you-need", text: "Qué necesita antes de empezar" },
          {
            type: "ul",
            items: [
              "Un **Perfil de Empresa de Google** (antes Google My Business) activo y verificado.",
              "Acceso a ese perfil como propietario o administrador, o la posibilidad de enviarnos su enlace de reseñas.",
              "Una idea de dónde quiere colocar las placas, para elegir los formatos adecuados.",
            ],
          },
          {
            type: "p",
            text: "Si todavía no tiene el perfil verificado, resuélvalo primero: sin un perfil activo, Google no muestra el formulario de reseñas. Podemos orientarle en el proceso durante la [demostración gratuita](/es/book-a-demo).",
          },
          { type: "h2", id: "next-steps", text: "Próximos pasos" },
          {
            type: "ul",
            items: [
              "[Instalación](/es/docs/google-review-plates/setup): cómo obtenemos su enlace de reseñas y dónde colocar cada placa.",
              "[Configuración](/es/docs/google-review-plates/configuration): bloqueo de los chips, redirección y cambio de destino.",
              "[Uso](/es/docs/google-review-plates/usage): cómo debe pedir reseñas su equipo sin incumplir las normas de Google.",
              "[Solución de problemas](/es/docs/google-review-plates/troubleshooting): qué hacer si una placa no responde.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Steevanz no es Google ni tiene ninguna afiliación con Google. Las placas solo llevan a sus clientes al formulario público de reseñas de su perfil.",
          },
        ],
      },
      fr: {
        title: "Premiers pas avec les plaques pour avis Google",
        description:
          "Découvrez comment fonctionnent les plaques pour avis Google, ce que Steevanz vous livre et ce qu'il faut préparer avant de commencer à recueillir plus d'avis Google.",
        blocks: [
          {
            type: "p",
            text: "Les plaques pour avis Google permettent à vos clients de laisser un avis Google en quelques secondes : il suffit d'approcher le téléphone de la plaque, ou de pointer l'appareil photo vers le QR code imprimé, et le formulaire d'avis de votre commerce s'ouvre aussitôt. Sans recherche, sans chercher votre établissement sur Google Maps, sans étape intermédiaire.",
          },
          {
            type: "p",
            text: "C'est un service géré : Steevanz s'occupe de la configuration, de la programmation des puces et des tests. Cette documentation explique comment tout fonctionne et comment tirer le meilleur de vos plaques au quotidien.",
          },
          { type: "h2", id: "how-it-works", text: "Comment ça marche" },
          {
            type: "p",
            text: "Chaque plaque contient une puce (**NTAG213** ou **NTAG215**) cachée à l'intérieur et un QR code imprimé sur la face avant. Les deux pointent vers une adresse courte gérée par Steevanz, qui redirige le client vers le formulaire d'avis de votre fiche d'établissement Google.",
          },
          {
            type: "ol",
            items: [
              "Le client approche son téléphone de la plaque ou scanne le QR code.",
              "Le téléphone ouvre le lien dans le navigateur ou dans l'application Google Maps.",
              "La fenêtre d'avis de votre commerce apparaît, avec les étoiles prêtes à être remplies.",
              "Le client choisit sa note, écrit un commentaire (facultatif) et le publie.",
            ],
          },
          {
            type: "callout",
            tone: "info",
            title: "Rien à installer",
            text: "Le client n'a besoin d'installer aucune application. La lecture d'un toucher est intégrée à la grande majorité des téléphones récents, et le QR code fonctionne avec l'appareil photo de n'importe quel smartphone.",
          },
          { type: "h2", id: "available-formats", text: "Formats disponibles" },
          {
            type: "table",
            head: ["Format", "Où l'utiliser", "Remarques"],
            rows: [
              ["Plaque de comptoir en acrylique", "Près de la caisse ou de l'accueil", "Le format le plus populaire, avec un socle stable"],
              ["Support de table", "Un par table dans les restaurants et cafés", "Visible pendant tout le repas"],
              ["Autocollant", "Menus, vitrines, miroirs, caisses", "Discret et économique"],
              ["Plaque murale", "Entrée, salle d'attente, couloir", "À fixer à hauteur des yeux"],
            ],
          },
          { type: "h2", id: "what-you-need", text: "Ce qu'il vous faut avant de commencer" },
          {
            type: "ul",
            items: [
              "Une **fiche d'établissement Google** (anciennement Google My Business) active et validée.",
              "Un accès à cette fiche en tant que propriétaire ou gestionnaire, ou la possibilité de nous envoyer votre lien d'avis.",
              "Une idée des endroits où vous voulez placer les plaques, pour choisir les bons formats.",
            ],
          },
          {
            type: "p",
            text: "Si votre fiche n'est pas encore validée, réglez cela d'abord : sans fiche active, Google n'affiche pas le formulaire d'avis. Nous pouvons vous guider pendant la [démonstration gratuite](/fr/book-a-demo).",
          },
          { type: "h2", id: "next-steps", text: "Prochaines étapes" },
          {
            type: "ul",
            items: [
              "[Installation](/fr/docs/google-review-plates/setup) : comment nous obtenons votre lien d'avis et où placer chaque plaque.",
              "[Configuration](/fr/docs/google-review-plates/configuration) : verrouillage des puces, redirection et changement de destination.",
              "[Utilisation](/fr/docs/google-review-plates/usage) : comment votre équipe doit demander des avis sans enfreindre les règles de Google.",
              "[Résolution des problèmes](/fr/docs/google-review-plates/troubleshooting) : que faire si une plaque ne réagit pas.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Steevanz n'est pas Google et n'a aucune affiliation avec Google. Les plaques dirigent simplement vos clients vers le formulaire public d'avis de votre fiche.",
          },
        ],
      },
      de: {
        title: "Erste Schritte mit den Schildern für Google-Bewertungen",
        description:
          "So funktionieren die Schilder für Google-Bewertungen, das liefert Steevanz und das sollten Sie vorbereiten, bevor Sie mehr Google-Bewertungen sammeln.",
        blocks: [
          {
            type: "p",
            text: "Mit den Schildern für Google-Bewertungen hinterlassen Ihre Kunden in Sekunden eine Bewertung bei Google: Sie halten das Handy an das Schild oder richten die Kamera auf den aufgedruckten QR-Code, und das Bewertungsformular Ihres Geschäfts öffnet sich sofort. Kein Suchen, kein Nachschlagen Ihres Geschäfts in Google Maps, keine Zwischenschritte.",
          },
          {
            type: "p",
            text: "Es ist ein betreuter Service: Steevanz übernimmt die Einrichtung, beschreibt die Chips und testet alles. Diese Dokumentation erklärt, wie alles funktioniert und wie Sie im Alltag das Beste aus Ihren Schildern herausholen.",
          },
          { type: "h2", id: "how-it-works", text: "So funktioniert es" },
          {
            type: "p",
            text: "Jedes Schild hat innen einen versteckten Chip (**NTAG213** oder **NTAG215**) und vorne einen aufgedruckten QR-Code. Beide verweisen auf eine von Steevanz verwaltete Kurzadresse, die den Kunden zum Bewertungsformular Ihres Google-Unternehmensprofils weiterleitet.",
          },
          {
            type: "ol",
            items: [
              "Der Kunde hält das Handy an das Schild oder scannt den QR-Code.",
              "Das Handy öffnet den Link im Browser oder in der Google-Maps-App.",
              "Das Bewertungsfenster Ihres Geschäfts erscheint, mit den Sternen zum Ausfüllen bereit.",
              "Der Kunde wählt die Sterne, schreibt einen Kommentar (optional) und veröffentlicht ihn.",
            ],
          },
          {
            type: "callout",
            tone: "info",
            title: "Nichts zu installieren",
            text: "Der Kunde muss keine App installieren. Das Lesen per Antippen ist in den allermeisten aktuellen Handys eingebaut, und der QR-Code funktioniert mit der Kamera jedes Smartphones.",
          },
          { type: "h2", id: "available-formats", text: "Verfügbare Formate" },
          {
            type: "table",
            head: ["Format", "Wo verwenden", "Hinweise"],
            rows: [
              ["Thekenschild aus Acryl", "Neben der Kasse oder am Empfang", "Beliebtestes Format, mit stabilem Fuß"],
              ["Tischaufsteller", "Einer pro Tisch in Restaurants und Cafés", "Während des ganzen Essens sichtbar"],
              ["Aufkleber", "Speisekarten, Schaufenster, Spiegel, Kassen", "Dezent und günstig"],
              ["Wandschild", "Eingang, Wartezimmer, Flur", "Auf Augenhöhe anbringen"],
            ],
          },
          { type: "h2", id: "what-you-need", text: "Was Sie vor dem Start brauchen" },
          {
            type: "ul",
            items: [
              "Ein aktives, bestätigtes **Google-Unternehmensprofil** (früher Google My Business).",
              "Zugriff auf dieses Profil als Inhaber oder Verwalter, oder die Möglichkeit, uns Ihren Bewertungslink zu senden.",
              "Eine Vorstellung davon, wo die Schilder stehen sollen, damit wir die passenden Formate wählen.",
            ],
          },
          {
            type: "p",
            text: "Ist Ihr Profil noch nicht bestätigt, erledigen Sie das zuerst: Ohne aktives Profil zeigt Google das Bewertungsformular nicht an. Wir können Sie während der [kostenlosen Vorführung](/de/book-a-demo) dabei begleiten.",
          },
          { type: "h2", id: "next-steps", text: "Nächste Schritte" },
          {
            type: "ul",
            items: [
              "[Einrichtung](/de/docs/google-review-plates/setup): wie wir Ihren Bewertungslink erhalten und wo jedes Schild hinkommt.",
              "[Konfiguration](/de/docs/google-review-plates/configuration): Sperren der Chips, Weiterleitung und Ändern des Ziels.",
              "[Nutzung](/de/docs/google-review-plates/usage): wie Ihr Team um Bewertungen bittet, ohne gegen die Regeln von Google zu verstoßen.",
              "[Fehlerbehebung](/de/docs/google-review-plates/troubleshooting): was zu tun ist, wenn ein Schild nicht reagiert.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Steevanz ist nicht Google und steht in keiner Verbindung zu Google. Die Schilder leiten Ihre Kunden nur zum öffentlichen Bewertungsformular Ihres Profils weiter.",
          },
        ],
      },
      it: {
        title: "Primi passi con le targhe per recensioni Google",
        description:
          "Scoprite come funzionano le targhe per recensioni Google, cosa ricevete da Steevanz e cosa preparare prima di iniziare a raccogliere più recensioni su Google.",
        blocks: [
          {
            type: "p",
            text: "Le targhe per recensioni Google permettono ai vostri clienti di lasciare una recensione su Google in pochi secondi: basta avvicinare il telefono alla targa, o inquadrare il QR code stampato, e il modulo di recensione della vostra attività si apre subito. Senza ricerche, senza cercare il locale su Google Maps, senza passaggi intermedi.",
          },
          {
            type: "p",
            text: "È un servizio gestito: Steevanz si occupa della configurazione, della programmazione dei chip e dei test. Questa documentazione spiega come funziona tutto e come sfruttare al meglio le targhe ogni giorno.",
          },
          { type: "h2", id: "how-it-works", text: "Come funziona" },
          {
            type: "p",
            text: "Ogni targa ha un chip (**NTAG213** o **NTAG215**) nascosto all'interno e un QR code stampato sul fronte. Il chip e il QR puntano a un indirizzo breve gestito da Steevanz, che reindirizza il cliente al modulo di recensione del vostro Profilo dell'attività su Google.",
          },
          {
            type: "ol",
            items: [
              "Il cliente avvicina il telefono alla targa o inquadra il QR code.",
              "Il telefono apre il link nel browser o nell'app Google Maps.",
              "Compare la finestra di recensione della vostra attività, con le stelle pronte da compilare.",
              "Il cliente sceglie le stelle, scrive un commento (facoltativo) e pubblica.",
            ],
          },
          {
            type: "callout",
            tone: "info",
            title: "Nulla da installare",
            text: "Il cliente non deve installare nessuna app. La lettura con un tocco è integrata nella grande maggioranza dei telefoni recenti, e il QR funziona con la fotocamera di qualsiasi smartphone.",
          },
          { type: "h2", id: "available-formats", text: "Formati disponibili" },
          {
            type: "table",
            head: ["Formato", "Dove usarlo", "Note"],
            rows: [
              ["Targa da banco in acrilico", "Vicino alla cassa o alla reception", "Il formato più richiesto, con base stabile"],
              ["Supporto da tavolo", "Uno per tavolo in ristoranti e bar", "Visibile per tutto il pasto"],
              ["Adesivo", "Menù, vetrine, specchi, registratori di cassa", "Discreto ed economico"],
              ["Targa da parete", "Ingresso, sala d'attesa, corridoio", "Da installare all'altezza degli occhi"],
            ],
          },
          { type: "h2", id: "what-you-need", text: "Cosa serve prima di iniziare" },
          {
            type: "ul",
            items: [
              "Un **Profilo dell'attività su Google** (ex Google My Business) attivo e verificato.",
              "Accesso a quel profilo come proprietari o gestori, oppure la possibilità di inviarci il link per le recensioni.",
              "Un'idea di dove volete posizionare le targhe, per scegliere i formati giusti.",
            ],
          },
          {
            type: "p",
            text: "Se il profilo non è ancora verificato, occupatevene prima: senza un profilo attivo, Google non mostra il modulo di recensione. Possiamo guidarvi durante la [demo gratuita](/it/book-a-demo).",
          },
          { type: "h2", id: "next-steps", text: "Prossimi passi" },
          {
            type: "ul",
            items: [
              "[Installazione](/it/docs/google-review-plates/setup): come otteniamo il vostro link per le recensioni e dove posizionare ogni targa.",
              "[Configurazione](/it/docs/google-review-plates/configuration): blocco dei chip, reindirizzamento e cambio di destinazione.",
              "[Uso](/it/docs/google-review-plates/usage): come il vostro staff deve chiedere recensioni senza violare le regole di Google.",
              "[Risoluzione dei problemi](/it/docs/google-review-plates/troubleshooting): cosa fare se una targa non risponde.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Steevanz non è Google e non ha alcuna affiliazione con Google. Le targhe portano semplicemente i vostri clienti al modulo pubblico di recensione del vostro profilo.",
          },
        ],
      },
    },
    setup: {
      pt: {
        title: "Instalação das placas Google Reviews",
        description:
          "Como obter o link de avaliação do Perfil da Empresa no Google, validar o Place ID e escolher o melhor local para instalar cada placa no seu negócio.",
        blocks: [
          {
            type: "p",
            text: "A instalação tem duas partes: obter o link de avaliação correto do seu perfil Google e colocar as placas nos sítios certos. A Steevanz trata da gravação e dos testes; do seu lado, basta confirmar os dados e escolher os locais.",
          },
          { type: "h2", id: "obter-link-avaliacao", text: "Obter o link de avaliação" },
          {
            type: "p",
            text: "Existem duas formas fiáveis de obter o link. Pode enviar-nos qualquer uma delas, ou simplesmente dar-nos acesso de gestor ao perfil e nós tratamos do resto.",
          },
          {
            type: "steps",
            items: [
              {
                title: "Abrir o Perfil da Empresa",
                body: "Inicie sessão na conta Google que gere o negócio e pesquise o nome da empresa no Google ou no Google Maps. O painel de gestão do perfil aparece no topo dos resultados.",
              },
              {
                title: "Escolher \"Pedir avaliações\"",
                body: "No painel do perfil, clique em **Pedir avaliações** (em inglês, \"Ask for reviews\"). O Google mostra uma janela com um link curto para partilhar.",
              },
              {
                title: "Copiar o link",
                body: "Copie o link apresentado. Tem normalmente o formato `g.page/r/.../review`. Envie-o à Steevanz por WhatsApp ou email.",
              },
              {
                title: "Confirmar com um teste",
                body: "Abra o link num telemóvel com sessão iniciada numa conta Google pessoal. Deve abrir diretamente a janela de avaliação do seu negócio.",
              },
            ],
          },
          {
            type: "code",
            label: "Formato do link curto do Google",
            code: "https://g.page/r/XXXXXXXXXXXXXXX/review",
          },
          { type: "h3", id: "alternativa-place-id", text: "Alternativa: link com Place ID" },
          {
            type: "p",
            text: "Cada negócio no Google Maps tem um identificador único, o **Place ID**. Pode encontrá-lo com a ferramenta pública Place ID Finder da Google, pesquisando o nome e a morada do estabelecimento. Com esse identificador, o link de avaliação fica assim:",
          },
          {
            type: "code",
            label: "Link de avaliação com Place ID",
            code: "https://search.google.com/local/writereview?placeid=PLACE_ID",
          },
          {
            type: "callout",
            tone: "warning",
            title: "Confirme que é o negócio certo",
            text: "Se houver perfis duplicados ou uma loja com nome parecido na mesma rua, é fácil copiar o Place ID errado. Verifique sempre que a janela de avaliação mostra o nome e a morada corretos.",
          },
          { type: "h2", id: "escolher-local", text: "Escolher o local de cada placa" },
          {
            type: "p",
            text: "A regra de ouro é simples: a placa deve estar onde o cliente já tem o telemóvel na mão e alguns segundos livres.",
          },
          {
            type: "ul",
            items: [
              "**Balcão**: perto do terminal de pagamento, mas **não por cima** dele. Os terminais de cartão emitem o seu próprio campo sem contacto (contactless) e podem interferir com a leitura.",
              "**Mesas**: um suporte por mesa, virado para o cliente. É o momento ideal, enquanto espera pela conta.",
              "**Parede**: à altura dos olhos (cerca de 1,40 m a 1,60 m do chão), junto à saída ou na sala de espera.",
              "**Autocolantes**: em menus, na capa da conta ou no espelho de um salão de cabeleireiro.",
            ],
          },
          {
            type: "callout",
            tone: "warning",
            title: "Superfícies metálicas",
            text: "O metal bloqueia o sinal do chip. Se precisar de colar uma placa ou autocolante numa superfície metálica (balcão de inox, frigorífico, porta metálica), peça-nos a versão com **chip anti-metal**, que tem uma camada de ferrite isolante.",
          },
          { type: "h2", id: "testar-instalacao", text: "Testar depois de instalar" },
          {
            type: "p",
            text: "Depois de colocar cada placa no sítio definitivo, teste-a com pelo menos um iPhone e um Android. Aproxime o telemóvel devagar, com o ecrã desbloqueado, e confirme que abre a janela de avaliação correta. Teste também o código QR com a câmara. Se algo falhar, veja a página de [resolução de problemas](/docs/placas-google-reviews/resolucao-problemas).",
          },
        ],
      },
      en: {
        title: "Setting up your Google review plates",
        description:
          "How to get your Google Business Profile review link, check the Place ID and choose the best spot for each review plate in your business premises.",
        blocks: [
          {
            type: "p",
            text: "Setup has two parts: getting the correct review link from your Google profile and putting the plates in the right places. Steevanz writes and tests the chips; on your side, you just confirm the details and choose the spots.",
          },
          { type: "h2", id: "get-review-link", text: "Getting your review link" },
          {
            type: "p",
            text: "There are two reliable ways to get the link. You can send us either one, or simply give us manager access to your profile and we'll handle the rest.",
          },
          {
            type: "steps",
            items: [
              {
                title: "Open your Business Profile",
                body: "Sign in to the Google account that manages the business and search for your business name on Google or Google Maps. The profile management panel appears at the top of the results.",
              },
              {
                title: "Choose \"Ask for reviews\"",
                body: "In the profile panel, click **Ask for reviews**. Google shows a window with a short link to share.",
              },
              {
                title: "Copy the link",
                body: "Copy the link shown. It usually looks like `g.page/r/.../review`. Send it to Steevanz via WhatsApp or email.",
              },
              {
                title: "Check it with a test",
                body: "Open the link on a phone signed in to a personal Google account. It should open your business's review window directly.",
              },
            ],
          },
          {
            type: "code",
            label: "Google short link format",
            code: "https://g.page/r/XXXXXXXXXXXXXXX/review",
          },
          { type: "h3", id: "place-id-alternative", text: "Alternative: Place ID link" },
          {
            type: "p",
            text: "Every business on Google Maps has a unique identifier called a **Place ID**. You can find it with Google's public Place ID Finder tool by searching for your business name and address. With that identifier, the review link looks like this:",
          },
          {
            type: "code",
            label: "Review link with Place ID",
            code: "https://search.google.com/local/writereview?placeid=PLACE_ID",
          },
          {
            type: "callout",
            tone: "warning",
            title: "Make sure it's the right business",
            text: "If there are duplicate listings or a similarly named shop on the same street, it's easy to copy the wrong Place ID. Always check the review window shows the correct name and address.",
          },
          { type: "h2", id: "choose-placement", text: "Choosing where each plate goes" },
          {
            type: "p",
            text: "The golden rule is simple: put the plate where customers already have their phone in hand and a few spare seconds.",
          },
          {
            type: "ul",
            items: [
              "**Counter**: near the card terminal, but **not on top of it**. Card terminals generate their own contactless field and can interfere with reading.",
              "**Tables**: one stand per table, facing the customer. It's the perfect moment, while they wait for the bill.",
              "**Wall**: at eye level (roughly 1.40 m to 1.60 m from the floor), by the exit or in the waiting room.",
              "**Stickers**: on menus, bill folders or a salon mirror.",
            ],
          },
          {
            type: "callout",
            tone: "warning",
            title: "Metal surfaces",
            text: "Metal blocks the chip's signal. If you need to mount a plate or sticker on metal (a stainless steel counter, a fridge, a metal door), ask us for the **anti-metal chip** version, which has an insulating ferrite layer.",
          },
          { type: "h2", id: "test-installation", text: "Testing after installation" },
          {
            type: "p",
            text: "Once each plate is in its final spot, test it with at least one iPhone and one Android phone. Bring the phone in slowly, screen unlocked, and check the correct review window opens. Test the QR code with the camera too. If anything fails, see the [troubleshooting](/en/docs/google-review-plates/troubleshooting) page.",
          },
        ],
      },
      es: {
        title: "Instalación de las placas para reseñas en Google",
        description:
          "Cómo obtener el enlace de reseñas de su Perfil de Empresa de Google, comprobar el Place ID y elegir el mejor sitio para cada placa en su local.",
        blocks: [
          {
            type: "p",
            text: "La instalación tiene dos partes: obtener el enlace de reseñas correcto de su perfil de Google y colocar las placas en los sitios adecuados. Steevanz graba y prueba los chips; por su parte, solo tiene que confirmar los datos y elegir los sitios.",
          },
          { type: "h2", id: "get-review-link", text: "Obtener el enlace de reseñas" },
          {
            type: "p",
            text: "Hay dos formas fiables de obtener el enlace. Puede enviarnos cualquiera de las dos, o simplemente darnos acceso de administrador a su perfil y nos encargamos del resto.",
          },
          {
            type: "steps",
            items: [
              {
                title: "Abrir su Perfil de Empresa",
                body: "Inicie sesión en la cuenta de Google que gestiona el negocio y busque el nombre del negocio en Google o Google Maps. El panel de gestión del perfil aparece arriba de los resultados.",
              },
              {
                title: "Elegir «Pedir reseñas»",
                body: "En el panel del perfil, haga clic en **Pedir reseñas**. Google muestra una ventana con un enlace corto para compartir.",
              },
              {
                title: "Copiar el enlace",
                body: "Copie el enlace que aparece. Suele tener el formato `g.page/r/.../review`. Envíelo a Steevanz por WhatsApp o email.",
              },
              {
                title: "Comprobarlo con una prueba",
                body: "Abra el enlace en un móvil con sesión iniciada en una cuenta personal de Google. Debe abrir directamente la ventana de reseña de su negocio.",
              },
            ],
          },
          {
            type: "code",
            label: "Formato del enlace corto de Google",
            code: "https://g.page/r/XXXXXXXXXXXXXXX/review",
          },
          { type: "h3", id: "place-id-alternative", text: "Alternativa: enlace con Place ID" },
          {
            type: "p",
            text: "Cada negocio en Google Maps tiene un identificador único llamado **Place ID**. Puede encontrarlo con la herramienta pública Place ID Finder de Google, buscando el nombre y la dirección de su negocio. Con ese identificador, el enlace de reseñas queda así:",
          },
          {
            type: "code",
            label: "Enlace de reseñas con Place ID",
            code: "https://search.google.com/local/writereview?placeid=PLACE_ID",
          },
          {
            type: "callout",
            tone: "warning",
            title: "Asegúrese de que es el negocio correcto",
            text: "Si hay fichas duplicadas o un local con un nombre parecido en la misma calle, es fácil copiar el Place ID equivocado. Compruebe siempre que la ventana de reseña muestra el nombre y la dirección correctos.",
          },
          { type: "h2", id: "choose-placement", text: "Elegir dónde va cada placa" },
          {
            type: "p",
            text: "La regla de oro es sencilla: ponga la placa donde el cliente ya tiene el móvil en la mano y unos segundos libres.",
          },
          {
            type: "ul",
            items: [
              "**Mostrador**: cerca del datáfono, pero **no encima**. Los datáfonos generan su propio campo sin contacto y pueden interferir con la lectura.",
              "**Mesas**: un soporte por mesa, de cara al cliente. Es el momento perfecto, mientras espera la cuenta.",
              "**Pared**: a la altura de los ojos (entre 1,40 m y 1,60 m del suelo, aproximadamente), junto a la salida o en la sala de espera.",
              "**Pegatinas**: en cartas, porta-cuentas o el espejo de una peluquería.",
            ],
          },
          {
            type: "callout",
            tone: "warning",
            title: "Superficies metálicas",
            text: "El metal bloquea la señal del chip. Si necesita colocar una placa o pegatina sobre metal (un mostrador de acero inoxidable, una nevera, una puerta metálica), pídanos la versión con **chip antimetal**, que tiene una capa aislante de ferrita.",
          },
          { type: "h2", id: "test-installation", text: "Probar después de la instalación" },
          {
            type: "p",
            text: "Cuando cada placa esté en su sitio definitivo, pruébela con al menos un iPhone y un Android. Acerque el móvil despacio, con la pantalla desbloqueada, y compruebe que se abre la ventana de reseña correcta. Pruebe también el código QR con la cámara. Si algo falla, vea la página de [solución de problemas](/es/docs/google-review-plates/troubleshooting).",
          },
        ],
      },
      fr: {
        title: "Installation des plaques pour avis Google",
        description:
          "Comment obtenir le lien d'avis de votre fiche d'établissement Google, vérifier le Place ID et choisir le meilleur emplacement pour chaque plaque dans votre établissement.",
        blocks: [
          {
            type: "p",
            text: "L'installation comporte deux parties : obtenir le bon lien d'avis de votre fiche Google et placer les plaques aux bons endroits. Steevanz programme et teste les puces ; de votre côté, il suffit de confirmer les informations et de choisir les emplacements.",
          },
          { type: "h2", id: "get-review-link", text: "Obtenir votre lien d'avis" },
          {
            type: "p",
            text: "Il existe deux façons fiables d'obtenir le lien. Vous pouvez nous envoyer l'un ou l'autre, ou simplement nous donner un accès gestionnaire à votre fiche et nous nous occupons du reste.",
          },
          {
            type: "steps",
            items: [
              {
                title: "Ouvrir votre fiche d'établissement",
                body: "Connectez-vous au compte Google qui gère le commerce et recherchez le nom de votre commerce sur Google ou Google Maps. Le panneau de gestion de la fiche apparaît en haut des résultats.",
              },
              {
                title: "Choisir «Demander des avis»",
                body: "Dans le panneau de la fiche, cliquez sur **Demander des avis**. Google affiche une fenêtre avec un lien court à partager.",
              },
              {
                title: "Copier le lien",
                body: "Copiez le lien affiché. Il ressemble généralement à `g.page/r/.../review`. Envoyez-le à Steevanz par WhatsApp ou e-mail.",
              },
              {
                title: "Le vérifier par un test",
                body: "Ouvrez le lien sur un téléphone connecté à un compte Google personnel. Il doit ouvrir directement la fenêtre d'avis de votre commerce.",
              },
            ],
          },
          {
            type: "code",
            label: "Format du lien court Google",
            code: "https://g.page/r/XXXXXXXXXXXXXXX/review",
          },
          { type: "h3", id: "place-id-alternative", text: "Alternative : lien avec Place ID" },
          {
            type: "p",
            text: "Chaque commerce sur Google Maps a un identifiant unique appelé **Place ID**. Vous pouvez le trouver avec l'outil public Place ID Finder de Google, en recherchant le nom et l'adresse de votre commerce. Avec cet identifiant, le lien d'avis se présente ainsi :",
          },
          {
            type: "code",
            label: "Lien d'avis avec Place ID",
            code: "https://search.google.com/local/writereview?placeid=PLACE_ID",
          },
          {
            type: "callout",
            tone: "warning",
            title: "Vérifiez qu'il s'agit du bon commerce",
            text: "S'il existe des fiches en double ou un commerce au nom proche dans la même rue, il est facile de copier le mauvais Place ID. Vérifiez toujours que la fenêtre d'avis affiche le bon nom et la bonne adresse.",
          },
          { type: "h2", id: "choose-placement", text: "Choisir l'emplacement de chaque plaque" },
          {
            type: "p",
            text: "La règle d'or est simple : placez la plaque là où le client a déjà son téléphone en main et quelques secondes devant lui.",
          },
          {
            type: "ul",
            items: [
              "**Comptoir** : près du terminal de paiement, mais **pas dessus**. Les terminaux de paiement génèrent leur propre champ sans contact et peuvent gêner la lecture.",
              "**Tables** : un support par table, tourné vers le client. C'est le moment idéal, pendant qu'il attend l'addition.",
              "**Mur** : à hauteur des yeux (environ 1,40 m à 1,60 m du sol), près de la sortie ou dans la salle d'attente.",
              "**Autocollants** : sur les menus, les porte-additions ou le miroir d'un salon.",
            ],
          },
          {
            type: "callout",
            tone: "warning",
            title: "Surfaces métalliques",
            text: "Le métal bloque le signal de la puce. Si vous devez fixer une plaque ou un autocollant sur du métal (comptoir en inox, réfrigérateur, porte métallique), demandez-nous la version à **puce anti-métal**, dotée d'une couche isolante en ferrite.",
          },
          { type: "h2", id: "test-installation", text: "Tester après l'installation" },
          {
            type: "p",
            text: "Une fois chaque plaque à sa place définitive, testez-la avec au moins un iPhone et un Android. Approchez le téléphone lentement, écran déverrouillé, et vérifiez que la bonne fenêtre d'avis s'ouvre. Testez aussi le QR code avec l'appareil photo. En cas d'échec, consultez la page [résolution des problèmes](/fr/docs/google-review-plates/troubleshooting).",
          },
        ],
      },
      de: {
        title: "Einrichtung der Schilder für Google-Bewertungen",
        description:
          "Wie Sie den Bewertungslink Ihres Google-Unternehmensprofils erhalten, die Place ID prüfen und für jedes Schild den besten Platz in Ihrem Geschäft wählen.",
        blocks: [
          {
            type: "p",
            text: "Die Einrichtung hat zwei Teile: den richtigen Bewertungslink aus Ihrem Google-Profil holen und die Schilder an den richtigen Stellen aufstellen. Steevanz beschreibt und testet die Chips; Sie bestätigen nur die Angaben und wählen die Plätze.",
          },
          { type: "h2", id: "get-review-link", text: "Den Bewertungslink erhalten" },
          {
            type: "p",
            text: "Es gibt zwei zuverlässige Wege, den Link zu bekommen. Sie können uns einen davon senden oder uns einfach Verwalterzugriff auf Ihr Profil geben, und wir erledigen den Rest.",
          },
          {
            type: "steps",
            items: [
              {
                title: "Unternehmensprofil öffnen",
                body: "Melden Sie sich mit dem Google-Konto an, das das Geschäft verwaltet, und suchen Sie den Namen Ihres Geschäfts in Google oder Google Maps. Das Verwaltungsfeld des Profils erscheint oben in den Ergebnissen.",
              },
              {
                title: "«Rezensionen anfordern» wählen",
                body: "Klicken Sie im Profilfeld auf **Rezensionen anfordern**. Google zeigt ein Fenster mit einem Kurzlink zum Teilen.",
              },
              {
                title: "Link kopieren",
                body: "Kopieren Sie den angezeigten Link. Er sieht meist so aus: `g.page/r/.../review`. Senden Sie ihn per WhatsApp oder E-Mail an Steevanz.",
              },
              {
                title: "Mit einem Test prüfen",
                body: "Öffnen Sie den Link auf einem Handy, das mit einem privaten Google-Konto angemeldet ist. Er sollte direkt das Bewertungsfenster Ihres Geschäfts öffnen.",
              },
            ],
          },
          {
            type: "code",
            label: "Format des Google-Kurzlinks",
            code: "https://g.page/r/XXXXXXXXXXXXXXX/review",
          },
          { type: "h3", id: "place-id-alternative", text: "Alternative: Link mit Place ID" },
          {
            type: "p",
            text: "Jedes Geschäft in Google Maps hat eine eindeutige Kennung, die **Place ID**. Sie finden sie mit dem öffentlichen Werkzeug Place ID Finder von Google, indem Sie nach Name und Adresse Ihres Geschäfts suchen. Mit dieser Kennung sieht der Bewertungslink so aus:",
          },
          {
            type: "code",
            label: "Bewertungslink mit Place ID",
            code: "https://search.google.com/local/writereview?placeid=PLACE_ID",
          },
          {
            type: "callout",
            tone: "warning",
            title: "Prüfen Sie, ob es das richtige Geschäft ist",
            text: "Gibt es doppelte Einträge oder ein Geschäft mit ähnlichem Namen in derselben Straße, kopiert man leicht die falsche Place ID. Prüfen Sie immer, ob das Bewertungsfenster den richtigen Namen und die richtige Adresse zeigt.",
          },
          { type: "h2", id: "choose-placement", text: "Wo jedes Schild hinkommt" },
          {
            type: "p",
            text: "Die goldene Regel ist einfach: Stellen Sie das Schild dort auf, wo Kunden das Handy schon in der Hand und ein paar Sekunden Zeit haben.",
          },
          {
            type: "ul",
            items: [
              "**Theke**: in der Nähe des Kartenterminals, aber **nicht darauf**. Kartenterminals erzeugen ihr eigenes kontaktloses Feld und können das Lesen stören.",
              "**Tische**: ein Tischaufsteller pro Tisch, zum Kunden gerichtet. Der perfekte Moment, während er auf die Rechnung wartet.",
              "**Wand**: auf Augenhöhe (etwa 1,40 m bis 1,60 m über dem Boden), am Ausgang oder im Wartezimmer.",
              "**Aufkleber**: auf Speisekarten, Rechnungsmappen oder dem Spiegel eines Salons.",
            ],
          },
          {
            type: "callout",
            tone: "warning",
            title: "Metallflächen",
            text: "Metall blockiert das Signal des Chips. Wenn Sie ein Schild oder einen Aufkleber auf Metall anbringen müssen (Edelstahltheke, Kühlschrank, Metalltür), fragen Sie nach der Version mit **Anti-Metall-Chip**, die eine isolierende Ferritschicht hat.",
          },
          { type: "h2", id: "test-installation", text: "Nach der Einrichtung testen" },
          {
            type: "p",
            text: "Steht jedes Schild an seinem endgültigen Platz, testen Sie es mit mindestens einem iPhone und einem Android-Handy. Nähern Sie das Handy langsam, mit entsperrtem Bildschirm, und prüfen Sie, ob sich das richtige Bewertungsfenster öffnet. Testen Sie auch den QR-Code mit der Kamera. Wenn etwas nicht klappt, sehen Sie auf der Seite [Fehlerbehebung](/de/docs/google-review-plates/troubleshooting) nach.",
          },
        ],
      },
      it: {
        title: "Installazione delle targhe per recensioni Google",
        description:
          "Come ottenere il link per le recensioni del vostro Profilo dell'attività su Google, verificare il Place ID e scegliere il posto migliore per ogni targa nel vostro locale.",
        blocks: [
          {
            type: "p",
            text: "L'installazione ha due parti: ottenere il link per le recensioni corretto dal vostro profilo Google e mettere le targhe nei posti giusti. Steevanz programma e testa i chip; da parte vostra, basta confermare i dati e scegliere i punti.",
          },
          { type: "h2", id: "get-review-link", text: "Ottenere il link per le recensioni" },
          {
            type: "p",
            text: "Ci sono due modi affidabili per ottenere il link. Potete inviarci l'uno o l'altro, oppure darci semplicemente l'accesso da gestore al vostro profilo e pensiamo noi al resto.",
          },
          {
            type: "steps",
            items: [
              {
                title: "Aprire il Profilo dell'attività",
                body: "Accedete con l'account Google che gestisce l'attività e cercate il nome dell'attività su Google o Google Maps. Il pannello di gestione del profilo compare in cima ai risultati.",
              },
              {
                title: "Scegliere «Chiedi recensioni»",
                body: "Nel pannello del profilo, fate clic su **Chiedi recensioni**. Google mostra una finestra con un link breve da condividere.",
              },
              {
                title: "Copiare il link",
                body: "Copiate il link mostrato. Di solito ha la forma `g.page/r/.../review`. Inviatelo a Steevanz via WhatsApp o email.",
              },
              {
                title: "Verificarlo con un test",
                body: "Aprite il link su un telefono collegato a un account Google personale. Deve aprire direttamente la finestra di recensione della vostra attività.",
              },
            ],
          },
          {
            type: "code",
            label: "Formato del link breve di Google",
            code: "https://g.page/r/XXXXXXXXXXXXXXX/review",
          },
          { type: "h3", id: "place-id-alternative", text: "Alternativa: link con Place ID" },
          {
            type: "p",
            text: "Ogni attività su Google Maps ha un identificatore unico chiamato **Place ID**. Potete trovarlo con lo strumento pubblico Place ID Finder di Google, cercando il nome e l'indirizzo della vostra attività. Con quell'identificatore, il link per le recensioni è così:",
          },
          {
            type: "code",
            label: "Link per le recensioni con Place ID",
            code: "https://search.google.com/local/writereview?placeid=PLACE_ID",
          },
          {
            type: "callout",
            tone: "warning",
            title: "Verificate che sia l'attività giusta",
            text: "Se ci sono schede duplicate o un locale con un nome simile nella stessa via, è facile copiare il Place ID sbagliato. Verificate sempre che la finestra di recensione mostri il nome e l'indirizzo corretti.",
          },
          { type: "h2", id: "choose-placement", text: "Scegliere dove va ogni targa" },
          {
            type: "p",
            text: "La regola d'oro è semplice: mettete la targa dove il cliente ha già il telefono in mano e qualche secondo libero.",
          },
          {
            type: "ul",
            items: [
              "**Banco**: vicino al POS, ma **non sopra**. I terminali di pagamento generano un proprio campo contactless e possono disturbare la lettura.",
              "**Tavoli**: un supporto per tavolo, rivolto verso il cliente. È il momento perfetto, mentre aspetta il conto.",
              "**Parete**: all'altezza degli occhi (circa da 1,40 m a 1,60 m dal pavimento), vicino all'uscita o nella sala d'attesa.",
              "**Adesivi**: su menù, portaconto o lo specchio di un salone.",
            ],
          },
          {
            type: "callout",
            tone: "warning",
            title: "Superfici metalliche",
            text: "Il metallo blocca il segnale del chip. Se dovete applicare una targa o un adesivo su metallo (un banco in acciaio inox, un frigorifero, una porta metallica), chiedeteci la versione con **chip anti-metallo**, che ha uno strato isolante in ferrite.",
          },
          { type: "h2", id: "test-installation", text: "Testare dopo l'installazione" },
          {
            type: "p",
            text: "Quando ogni targa è nella sua posizione definitiva, testatela con almeno un iPhone e un Android. Avvicinate il telefono lentamente, con lo schermo sbloccato, e verificate che si apra la finestra di recensione giusta. Testate anche il QR code con la fotocamera. Se qualcosa non va, consultate la pagina [risoluzione dei problemi](/it/docs/google-review-plates/troubleshooting).",
          },
        ],
      },
    },
    configuration: {
      pt: {
        title: "Configuração: chips, redirecionamento e destino",
        description:
          "Como a Steevanz grava e bloqueia os chips, porque usamos um redirecionamento e como alterar o destino das placas sem ter de as reimprimir.",
        blocks: [
          {
            type: "p",
            text: "Todas as placas saem das nossas mãos já configuradas. Esta página explica o que fazemos por trás e o que pode pedir-nos para alterar mais tarde.",
          },
          { type: "h2", id: "gravacao-bloqueio", text: "Gravação e bloqueio dos chips" },
          {
            type: "p",
            text: "Cada chip é gravado com um único registo: o endereço do redirecionamento da Steevanz. Depois de gravado e testado, o chip é **bloqueado permanentemente** (protegido contra escrita).",
          },
          {
            type: "ul",
            items: [
              "Ninguém consegue reescrever a placa com uma aplicação de escrita de chips, nem por brincadeira nem por má intenção.",
              "O bloqueio é irreversível: o conteúdo gravado no chip nunca mais muda.",
              "Mesmo assim, o destino final pode ser alterado, porque o chip aponta para o nosso redirecionamento e não diretamente para o Google.",
            ],
          },
          {
            type: "callout",
            tone: "info",
            title: "Porque isto importa",
            text: "Um chip desbloqueado num local público pode ser reprogramado por qualquer pessoa com um telemóvel Android e uma aplicação gratuita, passando a enviar os seus clientes para outro sítio. Por isso nunca entregamos placas desbloqueadas.",
          },
          { type: "h2", id: "redirecionamento-dinamico", text: "Redirecionamento dinâmico" },
          {
            type: "p",
            text: "O chip e o código QR apontam para um link curto da Steevanz. Quando alguém toca na placa, o nosso servidor encaminha-o de imediato para o link de avaliação do seu perfil. O cliente não nota diferença: o encaminhamento demora uma fração de segundo.",
          },
          {
            type: "p",
            text: "Esta arquitetura tem três vantagens práticas: pode mudar o destino sem trocar placas, podemos corrigir problemas rapidamente e é possível contar quantas vezes cada placa foi usada.",
          },
          { type: "h2", id: "alterar-destino", text: "Alterar o destino das placas" },
          {
            type: "p",
            text: "Há situações em que o link de avaliação muda: mudança de morada, fusão de perfis duplicados, novo perfil após uma suspensão, ou simplesmente a decisão de encaminhar uma placa para outra filial.",
          },
          {
            type: "steps",
            items: [
              {
                title: "Obter o novo link",
                body: "Siga os passos da página de [instalação](/docs/placas-google-reviews/instalacao) para obter o novo link de avaliação.",
              },
              {
                title: "Enviar-nos o pedido",
                body: "Envie o novo link por WhatsApp ou email, indicando que placas devem ser atualizadas (todas, ou só as de uma determinada loja).",
              },
              {
                title: "Confirmar o teste",
                body: "Atualizamos o redirecionamento e avisamos quando estiver ativo. Toque numa placa para confirmar.",
              },
            ],
          },
          { type: "h2", id: "varias-lojas", text: "Várias lojas ou vários perfis" },
          {
            type: "p",
            text: "Se tem mais do que um estabelecimento, cada loja tem o seu próprio perfil Google e, por isso, o seu próprio link. Identificamos as placas por loja para que nunca haja trocas: as avaliações do Porto não vão parar ao perfil de Lisboa.",
          },
          {
            type: "callout",
            tone: "tip",
            text: "Ao mudar placas de uma loja para outra, avise-nos antes. Basta uma mensagem para atualizarmos o destino.",
          },
        ],
      },
      en: {
        title: "Configuration: chips, redirects and destination",
        description:
          "How Steevanz writes and locks your chips, why we use a redirect link and how to change where your plates point without having to reprint them.",
        blocks: [
          {
            type: "p",
            text: "Every plate leaves us fully configured. This page explains what we do behind the scenes and what you can ask us to change later.",
          },
          { type: "h2", id: "writing-locking", text: "Writing and locking the chips" },
          {
            type: "p",
            text: "Each chip is written with a single record: the Steevanz redirect address. Once written and tested, the chip is **permanently locked** (write-protected).",
          },
          {
            type: "ul",
            items: [
              "Nobody can rewrite the plate with a chip-writing app, whether as a prank or with bad intent.",
              "Locking is irreversible: the content stored on the chip never changes again.",
              "The final destination can still be changed, because the chip points to our redirect rather than straight to Google.",
            ],
          },
          {
            type: "callout",
            tone: "info",
            title: "Why this matters",
            text: "An unlocked chip in a public place can be reprogrammed by anyone with an Android phone and a free app, sending your customers somewhere else. That's why we never hand over unlocked plates.",
          },
          { type: "h2", id: "dynamic-redirect", text: "Dynamic redirect" },
          {
            type: "p",
            text: "The chip and the QR code point to a Steevanz short link. When someone taps the plate, our server immediately forwards them to your profile's review link. The customer won't notice: the redirect takes a fraction of a second.",
          },
          {
            type: "p",
            text: "This setup has three practical benefits: you can change the destination without swapping plates, we can fix problems quickly, and we can count how many times each plate has been used.",
          },
          { type: "h2", id: "change-destination", text: "Changing where your plates point" },
          {
            type: "p",
            text: "Sometimes your review link changes: a move to a new address, merging duplicate listings, a new profile after a suspension, or simply deciding to point a plate at another branch.",
          },
          {
            type: "steps",
            items: [
              {
                title: "Get the new link",
                body: "Follow the steps on the [setup](/en/docs/google-review-plates/setup) page to get your new review link.",
              },
              {
                title: "Send us the request",
                body: "Send the new link via WhatsApp or email, saying which plates should be updated (all of them, or only those at a given location).",
              },
              {
                title: "Confirm with a test",
                body: "We update the redirect and let you know when it's live. Tap a plate to confirm.",
              },
            ],
          },
          { type: "h2", id: "multiple-locations", text: "Multiple locations or profiles" },
          {
            type: "p",
            text: "If you have more than one location, each has its own Google profile and therefore its own link. We tag plates by location so nothing gets mixed up: reviews for your Porto shop never end up on your Lisbon profile.",
          },
          {
            type: "callout",
            tone: "tip",
            text: "If you move plates from one location to another, let us know first. A quick message is all it takes for us to update the destination.",
          },
        ],
      },
      es: {
        title: "Configuración: chips, redirección y destino",
        description:
          "Cómo Steevanz graba y bloquea los chips, por qué usamos un enlace de redirección y cómo cambiar el destino de las placas sin tener que reimprimirlas.",
        blocks: [
          {
            type: "p",
            text: "Cada placa sale de nuestras manos totalmente configurada. Esta página explica lo que hacemos entre bastidores y lo que puede pedirnos cambiar más adelante.",
          },
          { type: "h2", id: "writing-locking", text: "Grabación y bloqueo de los chips" },
          {
            type: "p",
            text: "Cada chip se graba con un único registro: la dirección de redirección de Steevanz. Una vez grabado y probado, el chip queda **bloqueado de forma permanente** (protegido contra escritura).",
          },
          {
            type: "ul",
            items: [
              "Nadie puede reescribir la placa con una app de grabación de chips, ni en broma ni con mala intención.",
              "El bloqueo es irreversible: el contenido guardado en el chip no vuelve a cambiar nunca.",
              "El destino final sí se puede cambiar, porque el chip apunta a nuestra redirección y no directamente a Google.",
            ],
          },
          {
            type: "callout",
            tone: "info",
            title: "Por qué es importante",
            text: "Un chip sin bloquear en un lugar público puede reprogramarlo cualquiera con un móvil Android y una app gratuita, enviando a sus clientes a otro sitio. Por eso nunca entregamos placas sin bloquear.",
          },
          { type: "h2", id: "dynamic-redirect", text: "Redirección dinámica" },
          {
            type: "p",
            text: "El chip y el código QR apuntan a un enlace corto de Steevanz. Cuando alguien toca la placa, nuestro servidor lo lleva al instante al enlace de reseñas de su perfil. El cliente no lo nota: la redirección dura una fracción de segundo.",
          },
          {
            type: "p",
            text: "Este sistema tiene tres ventajas prácticas: puede cambiar el destino sin cambiar las placas, podemos corregir problemas rápidamente y podemos contar cuántas veces se ha usado cada placa.",
          },
          { type: "h2", id: "change-destination", text: "Cambiar el destino de las placas" },
          {
            type: "p",
            text: "A veces su enlace de reseñas cambia: un traslado a una nueva dirección, la fusión de fichas duplicadas, un perfil nuevo tras una suspensión, o simplemente la decisión de apuntar una placa a otro establecimiento.",
          },
          {
            type: "steps",
            items: [
              {
                title: "Obtener el nuevo enlace",
                body: "Siga los pasos de la página de [instalación](/es/docs/google-review-plates/setup) para obtener su nuevo enlace de reseñas.",
              },
              {
                title: "Enviarnos la solicitud",
                body: "Envíe el nuevo enlace por WhatsApp o email, indicando qué placas deben actualizarse (todas, o solo las de un local concreto).",
              },
              {
                title: "Confirmar con una prueba",
                body: "Actualizamos la redirección y le avisamos cuando esté activa. Toque una placa para confirmarlo.",
              },
            ],
          },
          { type: "h2", id: "multiple-locations", text: "Varios locales o perfiles" },
          {
            type: "p",
            text: "Si tiene más de un local, cada uno tiene su propio perfil de Google y, por tanto, su propio enlace. Identificamos las placas por local para que nada se mezcle: las reseñas de su tienda de Oporto nunca acaban en su perfil de Lisboa.",
          },
          {
            type: "callout",
            tone: "tip",
            text: "Si cambia placas de un local a otro, avísenos antes. Basta un mensaje rápido para que actualicemos el destino.",
          },
        ],
      },
      fr: {
        title: "Configuration : puces, redirection et destination",
        description:
          "Comment Steevanz programme et verrouille vos puces, pourquoi nous utilisons un lien de redirection et comment changer la destination de vos plaques sans les réimprimer.",
        blocks: [
          {
            type: "p",
            text: "Chaque plaque sort de chez nous entièrement configurée. Cette page explique ce que nous faisons en coulisses et ce que vous pouvez nous demander de changer par la suite.",
          },
          { type: "h2", id: "writing-locking", text: "Programmation et verrouillage des puces" },
          {
            type: "p",
            text: "Chaque puce est programmée avec un seul enregistrement : l'adresse de redirection Steevanz. Une fois programmée et testée, la puce est **verrouillée définitivement** (protégée en écriture).",
          },
          {
            type: "ul",
            items: [
              "Personne ne peut reprogrammer la plaque avec une application d'écriture de puces, que ce soit pour plaisanter ou avec de mauvaises intentions.",
              "Le verrouillage est irréversible : le contenu enregistré sur la puce ne change plus jamais.",
              "La destination finale peut tout de même être modifiée, car la puce pointe vers notre redirection et non directement vers Google.",
            ],
          },
          {
            type: "callout",
            tone: "info",
            title: "Pourquoi c'est important",
            text: "Une puce non verrouillée dans un lieu public peut être reprogrammée par n'importe qui avec un téléphone Android et une application gratuite, pour envoyer vos clients ailleurs. C'est pourquoi nous ne livrons jamais de plaques non verrouillées.",
          },
          { type: "h2", id: "dynamic-redirect", text: "Redirection dynamique" },
          {
            type: "p",
            text: "La puce et le QR code pointent vers un lien court Steevanz. Quand quelqu'un touche la plaque, notre serveur le redirige aussitôt vers le lien d'avis de votre fiche. Le client ne s'en aperçoit pas : la redirection prend une fraction de seconde.",
          },
          {
            type: "p",
            text: "Ce fonctionnement a trois avantages pratiques : vous pouvez changer la destination sans changer les plaques, nous pouvons corriger les problèmes rapidement et nous pouvons compter combien de fois chaque plaque a été utilisée.",
          },
          { type: "h2", id: "change-destination", text: "Changer la destination de vos plaques" },
          {
            type: "p",
            text: "Il arrive que votre lien d'avis change : un déménagement, la fusion de fiches en double, une nouvelle fiche après une suspension, ou simplement la décision de faire pointer une plaque vers un autre établissement.",
          },
          {
            type: "steps",
            items: [
              {
                title: "Obtenir le nouveau lien",
                body: "Suivez les étapes de la page [installation](/fr/docs/google-review-plates/setup) pour obtenir votre nouveau lien d'avis.",
              },
              {
                title: "Nous envoyer la demande",
                body: "Envoyez le nouveau lien par WhatsApp ou e-mail, en précisant quelles plaques doivent être mises à jour (toutes, ou seulement celles d'un établissement donné).",
              },
              {
                title: "Confirmer par un test",
                body: "Nous mettons à jour la redirection et vous prévenons dès qu'elle est active. Touchez une plaque pour confirmer.",
              },
            ],
          },
          { type: "h2", id: "multiple-locations", text: "Plusieurs établissements ou fiches" },
          {
            type: "p",
            text: "Si vous avez plusieurs établissements, chacun a sa propre fiche Google et donc son propre lien. Nous identifions les plaques par établissement pour que rien ne se mélange : les avis de votre boutique de Porto n'arrivent jamais sur votre fiche de Lisbonne.",
          },
          {
            type: "callout",
            tone: "tip",
            text: "Si vous déplacez des plaques d'un établissement à un autre, prévenez-nous avant. Un petit message suffit pour que nous mettions à jour la destination.",
          },
        ],
      },
      de: {
        title: "Konfiguration: Chips, Weiterleitung und Ziel",
        description:
          "Wie Steevanz Ihre Chips beschreibt und sperrt, warum wir einen Weiterleitungslink nutzen und wie Sie das Ziel Ihrer Schilder ändern, ohne sie neu zu drucken.",
        blocks: [
          {
            type: "p",
            text: "Jedes Schild verlässt uns vollständig konfiguriert. Diese Seite erklärt, was wir im Hintergrund tun und was Sie später ändern lassen können.",
          },
          { type: "h2", id: "writing-locking", text: "Beschreiben und Sperren der Chips" },
          {
            type: "p",
            text: "Jeder Chip wird mit einem einzigen Eintrag beschrieben: der Weiterleitungsadresse von Steevanz. Nach dem Beschreiben und Testen wird der Chip **dauerhaft gesperrt** (schreibgeschützt).",
          },
          {
            type: "ul",
            items: [
              "Niemand kann das Schild mit einer Chip-App überschreiben, weder aus Spaß noch in böser Absicht.",
              "Das Sperren ist endgültig: Der auf dem Chip gespeicherte Inhalt ändert sich nie mehr.",
              "Das endgültige Ziel lässt sich trotzdem ändern, weil der Chip auf unsere Weiterleitung zeigt und nicht direkt auf Google.",
            ],
          },
          {
            type: "callout",
            tone: "info",
            title: "Warum das wichtig ist",
            text: "Ein ungesperrter Chip an einem öffentlichen Ort kann von jedem mit einem Android-Handy und einer kostenlosen App umprogrammiert werden, um Ihre Kunden woandershin zu schicken. Deshalb liefern wir nie ungesperrte Schilder aus.",
          },
          { type: "h2", id: "dynamic-redirect", text: "Dynamische Weiterleitung" },
          {
            type: "p",
            text: "Der Chip und der QR-Code verweisen auf einen Steevanz-Kurzlink. Tippt jemand das Schild an, leitet unser Server ihn sofort zum Bewertungslink Ihres Profils weiter. Der Kunde merkt davon nichts: Die Weiterleitung dauert den Bruchteil einer Sekunde.",
          },
          {
            type: "p",
            text: "Das hat drei praktische Vorteile: Sie können das Ziel ändern, ohne Schilder zu tauschen, wir können Probleme schnell beheben, und wir können zählen, wie oft jedes Schild genutzt wurde.",
          },
          { type: "h2", id: "change-destination", text: "Das Ziel Ihrer Schilder ändern" },
          {
            type: "p",
            text: "Manchmal ändert sich Ihr Bewertungslink: ein Umzug an eine neue Adresse, das Zusammenführen doppelter Einträge, ein neues Profil nach einer Sperrung oder einfach die Entscheidung, ein Schild auf eine andere Filiale zeigen zu lassen.",
          },
          {
            type: "steps",
            items: [
              {
                title: "Neuen Link besorgen",
                body: "Folgen Sie den Schritten auf der Seite [Einrichtung](/de/docs/google-review-plates/setup), um Ihren neuen Bewertungslink zu erhalten.",
              },
              {
                title: "Anfrage senden",
                body: "Senden Sie den neuen Link per WhatsApp oder E-Mail und sagen Sie uns, welche Schilder aktualisiert werden sollen (alle oder nur die eines bestimmten Standorts).",
              },
              {
                title: "Mit einem Test bestätigen",
                body: "Wir aktualisieren die Weiterleitung und sagen Ihnen Bescheid, sobald sie aktiv ist. Tippen Sie ein Schild an, um es zu prüfen.",
              },
            ],
          },
          { type: "h2", id: "multiple-locations", text: "Mehrere Standorte oder Profile" },
          {
            type: "p",
            text: "Haben Sie mehr als einen Standort, hat jeder sein eigenes Google-Profil und damit seinen eigenen Link. Wir kennzeichnen die Schilder nach Standort, damit nichts durcheinandergerät: Bewertungen für Ihr Geschäft in Porto landen nie in Ihrem Lissabonner Profil.",
          },
          {
            type: "callout",
            tone: "tip",
            text: "Wenn Sie Schilder von einem Standort zum anderen bringen, sagen Sie uns vorher Bescheid. Eine kurze Nachricht genügt, damit wir das Ziel aktualisieren.",
          },
        ],
      },
      it: {
        title: "Configurazione: chip, reindirizzamento e destinazione",
        description:
          "Come Steevanz programma e blocca i vostri chip, perché usiamo un link di reindirizzamento e come cambiare la destinazione delle targhe senza doverle ristampare.",
        blocks: [
          {
            type: "p",
            text: "Ogni targa esce da noi completamente configurata. Questa pagina spiega cosa facciamo dietro le quinte e cosa potete chiederci di cambiare in seguito.",
          },
          { type: "h2", id: "writing-locking", text: "Programmazione e blocco dei chip" },
          {
            type: "p",
            text: "Ogni chip viene programmato con un solo record: l'indirizzo di reindirizzamento Steevanz. Una volta programmato e testato, il chip viene **bloccato in modo permanente** (protetto da scrittura).",
          },
          {
            type: "ul",
            items: [
              "Nessuno può riscrivere la targa con un'app di programmazione dei chip, né per scherzo né con cattive intenzioni.",
              "Il blocco è irreversibile: il contenuto salvato sul chip non cambia mai più.",
              "La destinazione finale si può comunque cambiare, perché il chip punta al nostro reindirizzamento e non direttamente a Google.",
            ],
          },
          {
            type: "callout",
            tone: "info",
            title: "Perché è importante",
            text: "Un chip non bloccato in un luogo pubblico può essere riprogrammato da chiunque con un telefono Android e un'app gratuita, mandando i vostri clienti altrove. Per questo non consegniamo mai targhe non bloccate.",
          },
          { type: "h2", id: "dynamic-redirect", text: "Reindirizzamento dinamico" },
          {
            type: "p",
            text: "Il chip e il QR code puntano a un link breve Steevanz. Quando qualcuno tocca la targa, il nostro server lo porta subito al link per le recensioni del vostro profilo. Il cliente non se ne accorge: il reindirizzamento dura una frazione di secondo.",
          },
          {
            type: "p",
            text: "Questo sistema ha tre vantaggi pratici: potete cambiare la destinazione senza sostituire le targhe, possiamo risolvere i problemi rapidamente e possiamo contare quante volte è stata usata ogni targa.",
          },
          { type: "h2", id: "change-destination", text: "Cambiare la destinazione delle targhe" },
          {
            type: "p",
            text: "A volte il vostro link per le recensioni cambia: un trasferimento a un nuovo indirizzo, l'unione di schede duplicate, un nuovo profilo dopo una sospensione, o semplicemente la scelta di far puntare una targa a un'altra sede.",
          },
          {
            type: "steps",
            items: [
              {
                title: "Ottenere il nuovo link",
                body: "Seguite i passi della pagina [installazione](/it/docs/google-review-plates/setup) per ottenere il nuovo link per le recensioni.",
              },
              {
                title: "Inviarci la richiesta",
                body: "Inviate il nuovo link via WhatsApp o email, indicando quali targhe vanno aggiornate (tutte, o solo quelle di una certa sede).",
              },
              {
                title: "Confermare con un test",
                body: "Aggiorniamo il reindirizzamento e vi avvisiamo quando è attivo. Toccate una targa per verificarlo.",
              },
            ],
          },
          { type: "h2", id: "multiple-locations", text: "Più sedi o profili" },
          {
            type: "p",
            text: "Se avete più di una sede, ognuna ha il proprio profilo Google e quindi il proprio link. Identifichiamo le targhe per sede perché nulla si confonda: le recensioni del negozio di Porto non finiscono mai sul profilo di Lisbona.",
          },
          {
            type: "callout",
            tone: "tip",
            text: "Se spostate targhe da una sede all'altra, avvisateci prima. Basta un breve messaggio perché aggiorniamo la destinazione.",
          },
        ],
      },
    },
    usage: {
      pt: {
        title: "Utilização: como pedir avaliações todos os dias",
        description:
          "Guia prático para a sua equipa pedir avaliações no Google com as placas, respeitando as regras do Google, e manter as placas limpas e funcionais.",
        blocks: [
          {
            type: "p",
            text: "Uma placa no balcão ajuda, mas o que realmente faz crescer o número de avaliações é a equipa pedir, com naturalidade, a todos os clientes. Esta página reúne boas práticas simples para o dia a dia.",
          },
          { type: "h2", id: "guiao-equipa", text: "Guião para a equipa" },
          {
            type: "p",
            text: "Não é preciso decorar nada. O importante é pedir no momento certo (no fim do serviço, ao pagar ou à saída) e mostrar a placa.",
          },
          {
            type: "ul",
            items: [
              "\"Se tiver um minuto, ajudava-nos muito deixar uma avaliação no Google. É só aproximar o telemóvel desta placa.\"",
              "\"A sua opinião conta. Basta encostar o telemóvel aqui, ou ler o código com a câmara.\"",
              "\"Se o toque não funcionar, aponte a câmara para o QR, que abre logo a página.\"",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Mostre como se faz. Muitas pessoas nunca encostaram o telemóvel a uma placa; se a pessoa da equipa demonstrar com o próprio telemóvel na primeira semana, a taxa de utilização sobe claramente.",
          },
          { type: "h2", id: "regras-google", text: "Regras do Google que tem de cumprir" },
          {
            type: "p",
            text: "O Google tem políticas claras sobre conteúdo de avaliações. Ignorá-las pode levar à remoção de avaliações ou a restrições no perfil.",
          },
          {
            type: "ul",
            items: [
              "**Não ofereça incentivos**: descontos, ofertas, sorteios ou brindes em troca de avaliações são proibidos, mesmo que peça uma avaliação \"honesta\".",
              "**Não faça seleção de avaliações** (review gating): peça a todos os clientes, não apenas aos que parecem satisfeitos.",
              "**Não escreva avaliações** em nome de clientes nem peça à equipa ou à família para avaliar.",
              "**Não pressione**: o pedido deve ser simpático e opcional.",
            ],
          },
          {
            type: "callout",
            tone: "warning",
            title: "Avaliações negativas fazem parte",
            text: "Pedir a todos significa receber também algumas críticas. É normal e dá credibilidade ao perfil. Responda com calma e profissionalismo; um perfil com respostas cuidadas inspira mais confiança do que um perfil perfeito.",
          },
          { type: "h2", id: "momentos-certos", text: "Os melhores momentos para pedir" },
          {
            type: "table",
            head: ["Tipo de negócio", "Momento sugerido"],
            rows: [
              ["Restaurante ou café", "Ao entregar a conta ou ao pagar"],
              ["Cabeleireiro ou estética", "Ao terminar, quando o cliente vê o resultado ao espelho"],
              ["Clínica", "Na receção, ao marcar a próxima consulta"],
              ["Loja", "Ao embalar a compra, junto à caixa"],
            ],
          },
          { type: "h2", id: "limpeza-manutencao", text: "Limpeza e manutenção" },
          {
            type: "ul",
            items: [
              "Limpe o acrílico com um pano de microfibra macio e água com um pouco de detergente neutro.",
              "Evite álcool, lixívia, acetona e produtos abrasivos: riscam e tornam o acrílico baço.",
              "Não mergulhe as placas em água nem as lave na máquina.",
              "Verifique de vez em quando se o código QR continua nítido e sem riscos.",
            ],
          },
          { type: "h2", id: "acompanhar-resultados", text: "Acompanhar resultados" },
          {
            type: "p",
            text: "Compare o número de avaliações do seu perfil Google mês a mês. Se tiver também o serviço de [gestão de reviews com IA](/produtos/gestao-reviews-ia), as respostas às novas avaliações ficam tratadas automaticamente, com a sua aprovação.",
          },
        ],
      },
      en: {
        title: "Usage: asking for reviews every day",
        description:
          "A practical guide for your team to ask for Google reviews with your plates while following Google's rules, and to keep your plates clean and working.",
        blocks: [
          {
            type: "p",
            text: "A plate on the counter helps, but what really grows your review count is your team asking every customer, naturally. This page collects simple good practice for day-to-day use.",
          },
          { type: "h2", id: "staff-script", text: "A script for your team" },
          {
            type: "p",
            text: "There's nothing to memorise. What matters is asking at the right moment (at the end of the service, when paying or on the way out) and pointing to the plate.",
          },
          {
            type: "ul",
            items: [
              "\"If you have a minute, a Google review would really help us. Just tap your phone on this plate.\"",
              "\"Your opinion counts. Just hold your phone here, or scan the code with your camera.\"",
              "\"If the tap doesn't work, point your camera at the QR code and it'll open straight away.\"",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Show them how. Many people have never tapped their phone on a plate; if staff demonstrate with their own phone in the first week, usage goes up noticeably.",
          },
          { type: "h2", id: "google-rules", text: "Google rules you must follow" },
          {
            type: "p",
            text: "Google has clear policies on review content. Ignoring them can lead to reviews being removed or restrictions on your profile.",
          },
          {
            type: "ul",
            items: [
              "**Don't offer incentives**: discounts, freebies, prize draws or gifts in exchange for reviews are forbidden, even if you ask for an \"honest\" review.",
              "**Don't gate reviews**: ask every customer, not just the ones who seem happy.",
              "**Don't write reviews** on behalf of customers or ask staff or family to review you.",
              "**Don't pressure people**: the request should be friendly and optional.",
            ],
          },
          {
            type: "callout",
            tone: "warning",
            title: "Negative reviews are part of it",
            text: "Asking everyone means you'll also get some criticism. That's normal and adds credibility. Reply calmly and professionally; a profile with thoughtful replies inspires more trust than a perfect one.",
          },
          { type: "h2", id: "best-moments", text: "The best moments to ask" },
          {
            type: "table",
            head: ["Type of business", "Suggested moment"],
            rows: [
              ["Restaurant or café", "When bringing the bill or taking payment"],
              ["Hair or beauty salon", "At the end, when the client sees the result in the mirror"],
              ["Clinic", "At reception, when booking the next appointment"],
              ["Shop", "While bagging the purchase at the till"],
            ],
          },
          { type: "h2", id: "cleaning-care", text: "Cleaning and care" },
          {
            type: "ul",
            items: [
              "Clean the acrylic with a soft microfibre cloth and water with a little mild detergent.",
              "Avoid alcohol, bleach, acetone and abrasive products: they scratch and cloud the acrylic.",
              "Don't soak plates in water or put them in a dishwasher.",
              "Check every so often that the QR code is still sharp and unscratched.",
            ],
          },
          { type: "h2", id: "track-results", text: "Tracking results" },
          {
            type: "p",
            text: "Compare the number of reviews on your Google profile month by month. If you also use our [AI review management](/en/products/ai-review-management) service, replies to new reviews are handled automatically, with your approval.",
          },
        ],
      },
      es: {
        title: "Uso: pedir reseñas cada día",
        description:
          "Guía práctica para que su equipo pida reseñas en Google con las placas respetando las normas de Google, y para mantener las placas limpias y en buen estado.",
        blocks: [
          {
            type: "p",
            text: "Una placa en el mostrador ayuda, pero lo que de verdad hace crecer el número de reseñas es que su equipo se lo pida a cada cliente, con naturalidad. Esta página reúne buenas prácticas sencillas para el día a día.",
          },
          { type: "h2", id: "staff-script", text: "Un guion para su equipo" },
          {
            type: "p",
            text: "No hay nada que memorizar. Lo importante es pedirlo en el momento adecuado (al final del servicio, al pagar o a la salida) y señalar la placa.",
          },
          {
            type: "ul",
            items: [
              "«Si tiene un minuto, una reseña en Google nos ayudaría mucho. Solo tiene que acercar el móvil a esta placa.»",
              "«Su opinión cuenta. Acerque el móvil aquí o escanee el código con la cámara.»",
              "«Si el toque no funciona, apunte la cámara al código QR y se abre al momento.»",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Enséñeles cómo se hace. Mucha gente nunca ha acercado el móvil a una placa; si el equipo lo demuestra con su propio móvil la primera semana, el uso aumenta claramente.",
          },
          { type: "h2", id: "google-rules", text: "Normas de Google que debe cumplir" },
          {
            type: "p",
            text: "Google tiene políticas claras sobre el contenido de las reseñas. Ignorarlas puede llevar a la eliminación de reseñas o a restricciones en su perfil.",
          },
          {
            type: "ul",
            items: [
              "**No ofrezca incentivos**: descuentos, regalos, sorteos u obsequios a cambio de reseñas están prohibidos, aunque pida una reseña «sincera».",
              "**No filtre las reseñas**: pídala a todos los clientes, no solo a los que parecen satisfechos.",
              "**No escriba reseñas** en nombre de los clientes ni pida a empleados o familiares que le valoren.",
              "**No presione**: la petición debe ser amable y opcional.",
            ],
          },
          {
            type: "callout",
            tone: "warning",
            title: "Las reseñas negativas forman parte",
            text: "Pedírsela a todos significa que también recibirá alguna crítica. Es normal y da credibilidad. Responda con calma y profesionalidad; un perfil con respuestas cuidadas inspira más confianza que uno perfecto.",
          },
          { type: "h2", id: "best-moments", text: "Los mejores momentos para pedirla" },
          {
            type: "table",
            head: ["Tipo de negocio", "Momento sugerido"],
            rows: [
              ["Restaurante o cafetería", "Al llevar la cuenta o al cobrar"],
              ["Peluquería o centro de estética", "Al final, cuando el cliente ve el resultado en el espejo"],
              ["Clínica", "En recepción, al reservar la próxima cita"],
              ["Tienda", "Mientras se embolsa la compra en la caja"],
            ],
          },
          { type: "h2", id: "cleaning-care", text: "Limpieza y cuidados" },
          {
            type: "ul",
            items: [
              "Limpie el acrílico con un paño suave de microfibra y agua con un poco de detergente neutro.",
              "Evite el alcohol, la lejía, la acetona y los productos abrasivos: rayan y enturbian el acrílico.",
              "No sumerja las placas en agua ni las meta en el lavavajillas.",
              "Compruebe de vez en cuando que el código QR sigue nítido y sin arañazos.",
            ],
          },
          { type: "h2", id: "track-results", text: "Seguir los resultados" },
          {
            type: "p",
            text: "Compare el número de reseñas de su perfil de Google mes a mes. Si además usa nuestro servicio de [gestión de reseñas con IA](/es/products/ai-review-management), las respuestas a las nuevas reseñas se gestionan automáticamente, con su aprobación.",
          },
        ],
      },
      fr: {
        title: "Utilisation : demander des avis chaque jour",
        description:
          "Un guide pratique pour que votre équipe demande des avis Google avec vos plaques en respectant les règles de Google, et pour garder vos plaques propres et en état de marche.",
        blocks: [
          {
            type: "p",
            text: "Une plaque sur le comptoir aide, mais ce qui fait vraiment grimper le nombre d'avis, c'est que votre équipe le demande à chaque client, naturellement. Cette page réunit quelques bonnes pratiques simples pour le quotidien.",
          },
          { type: "h2", id: "staff-script", text: "Une phrase pour votre équipe" },
          {
            type: "p",
            text: "Rien à apprendre par cœur. L'essentiel est de demander au bon moment (en fin de prestation, au paiement ou à la sortie) et de montrer la plaque.",
          },
          {
            type: "ul",
            items: [
              "«Si vous avez une minute, un avis sur Google nous aiderait beaucoup. Il suffit d'approcher votre téléphone de cette plaque.»",
              "«Votre avis compte. Approchez simplement votre téléphone ici, ou scannez le code avec l'appareil photo.»",
              "«Si le toucher ne marche pas, pointez l'appareil photo vers le QR code et ça s'ouvre tout de suite.»",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Montrez comment faire. Beaucoup de gens n'ont jamais approché leur téléphone d'une plaque ; si l'équipe fait la démonstration avec son propre téléphone la première semaine, l'utilisation augmente nettement.",
          },
          { type: "h2", id: "google-rules", text: "Les règles de Google à respecter" },
          {
            type: "p",
            text: "Google a des règles claires sur le contenu des avis. Les ignorer peut entraîner la suppression d'avis ou des restrictions sur votre fiche.",
          },
          {
            type: "ul",
            items: [
              "**N'offrez pas de contrepartie** : réductions, cadeaux, tirages au sort ou offres en échange d'avis sont interdits, même si vous demandez un avis «sincère».",
              "**Ne filtrez pas les avis** : demandez à tous les clients, pas seulement à ceux qui semblent satisfaits.",
              "**N'écrivez pas d'avis** à la place des clients et ne demandez pas à vos employés ou à votre famille de vous noter.",
              "**Ne faites pas pression** : la demande doit rester aimable et facultative.",
            ],
          },
          {
            type: "callout",
            tone: "warning",
            title: "Les avis négatifs en font partie",
            text: "Demander à tout le monde signifie que vous recevrez aussi quelques critiques. C'est normal et cela renforce la crédibilité. Répondez avec calme et professionnalisme ; une fiche avec des réponses soignées inspire plus confiance qu'une fiche parfaite.",
          },
          { type: "h2", id: "best-moments", text: "Les meilleurs moments pour demander" },
          {
            type: "table",
            head: ["Type de commerce", "Moment suggéré"],
            rows: [
              ["Restaurant ou café", "En apportant l'addition ou à l'encaissement"],
              ["Salon de coiffure ou de beauté", "À la fin, quand le client voit le résultat dans le miroir"],
              ["Clinique", "À l'accueil, en prenant le prochain rendez-vous"],
              ["Boutique", "En emballant l'achat à la caisse"],
            ],
          },
          { type: "h2", id: "cleaning-care", text: "Nettoyage et entretien" },
          {
            type: "ul",
            items: [
              "Nettoyez l'acrylique avec un chiffon doux en microfibre et de l'eau avec un peu de détergent neutre.",
              "Évitez l'alcool, l'eau de Javel, l'acétone et les produits abrasifs : ils rayent et ternissent l'acrylique.",
              "Ne plongez pas les plaques dans l'eau et ne les mettez pas au lave-vaisselle.",
              "Vérifiez de temps en temps que le QR code reste net et sans rayures.",
            ],
          },
          { type: "h2", id: "track-results", text: "Suivre les résultats" },
          {
            type: "p",
            text: "Comparez le nombre d'avis de votre fiche Google mois après mois. Si vous utilisez aussi notre service de [gestion des avis avec l'IA](/fr/products/ai-review-management), les réponses aux nouveaux avis sont gérées automatiquement, avec votre validation.",
          },
        ],
      },
      de: {
        title: "Nutzung: täglich um Bewertungen bitten",
        description:
          "Ein praktischer Leitfaden, wie Ihr Team mit den Schildern um Google-Bewertungen bittet und dabei die Regeln von Google einhält, und wie Sie die Schilder sauber und funktionsfähig halten.",
        blocks: [
          {
            type: "p",
            text: "Ein Schild auf der Theke hilft, aber was die Zahl der Bewertungen wirklich steigert, ist ein Team, das jeden Kunden ganz natürlich darum bittet. Diese Seite sammelt einfache bewährte Praktiken für den Alltag.",
          },
          { type: "h2", id: "staff-script", text: "Ein Leitfaden für Ihr Team" },
          {
            type: "p",
            text: "Auswendig lernen muss niemand etwas. Wichtig ist, im richtigen Moment zu fragen (am Ende der Leistung, beim Bezahlen oder beim Gehen) und auf das Schild zu zeigen.",
          },
          {
            type: "ul",
            items: [
              "«Wenn Sie eine Minute haben, würde uns eine Google-Bewertung sehr helfen. Halten Sie einfach Ihr Handy an dieses Schild.»",
              "«Ihre Meinung zählt. Halten Sie Ihr Handy einfach hierhin oder scannen Sie den Code mit der Kamera.»",
              "«Wenn das Antippen nicht klappt, richten Sie die Kamera auf den QR-Code, dann öffnet es sich sofort.»",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Zeigen Sie, wie es geht. Viele Menschen haben ihr Handy noch nie an ein Schild gehalten; wenn das Team es in der ersten Woche mit dem eigenen Handy vormacht, steigt die Nutzung deutlich.",
          },
          { type: "h2", id: "google-rules", text: "Google-Regeln, die Sie einhalten müssen" },
          {
            type: "p",
            text: "Google hat klare Richtlinien für Bewertungsinhalte. Wer sie ignoriert, riskiert gelöschte Bewertungen oder Einschränkungen des Profils.",
          },
          {
            type: "ul",
            items: [
              "**Keine Anreize bieten**: Rabatte, Gratisartikel, Verlosungen oder Geschenke im Austausch für Bewertungen sind verboten, auch wenn Sie um eine «ehrliche» Bewertung bitten.",
              "**Bewertungen nicht filtern**: Fragen Sie jeden Kunden, nicht nur die, die zufrieden wirken.",
              "**Keine Bewertungen schreiben** im Namen von Kunden und keine Mitarbeiter oder Familienmitglieder um Bewertungen bitten.",
              "**Keinen Druck ausüben**: Die Bitte soll freundlich und freiwillig sein.",
            ],
          },
          {
            type: "callout",
            tone: "warning",
            title: "Negative Bewertungen gehören dazu",
            text: "Wer alle fragt, bekommt auch Kritik. Das ist normal und macht glaubwürdig. Antworten Sie ruhig und professionell; ein Profil mit durchdachten Antworten weckt mehr Vertrauen als ein perfektes.",
          },
          { type: "h2", id: "best-moments", text: "Die besten Momente zum Fragen" },
          {
            type: "table",
            head: ["Art des Geschäfts", "Empfohlener Moment"],
            rows: [
              ["Restaurant oder Café", "Beim Bringen der Rechnung oder beim Kassieren"],
              ["Friseur- oder Kosmetiksalon", "Am Ende, wenn der Kunde das Ergebnis im Spiegel sieht"],
              ["Praxis", "Am Empfang, beim Vereinbaren des nächsten Termins"],
              ["Geschäft", "Beim Einpacken des Einkaufs an der Kasse"],
            ],
          },
          { type: "h2", id: "cleaning-care", text: "Reinigung und Pflege" },
          {
            type: "ul",
            items: [
              "Reinigen Sie das Acryl mit einem weichen Mikrofasertuch und Wasser mit etwas mildem Reinigungsmittel.",
              "Vermeiden Sie Alkohol, Bleiche, Aceton und Scheuermittel: Sie verkratzen das Acryl und machen es trüb.",
              "Legen Sie die Schilder nicht in Wasser und nicht in die Spülmaschine.",
              "Prüfen Sie ab und zu, ob der QR-Code noch scharf und unverkratzt ist.",
            ],
          },
          { type: "h2", id: "track-results", text: "Ergebnisse verfolgen" },
          {
            type: "p",
            text: "Vergleichen Sie die Zahl der Bewertungen in Ihrem Google-Profil Monat für Monat. Nutzen Sie auch unser [KI-Bewertungsmanagement](/de/products/ai-review-management), werden Antworten auf neue Bewertungen automatisch erledigt, mit Ihrer Freigabe.",
          },
        ],
      },
      it: {
        title: "Uso: chiedere recensioni ogni giorno",
        description:
          "Una guida pratica perché il vostro staff chieda recensioni Google con le targhe rispettando le regole di Google, e per mantenere le targhe pulite e funzionanti.",
        blocks: [
          {
            type: "p",
            text: "Una targa sul banco aiuta, ma ciò che fa davvero crescere il numero di recensioni è uno staff che lo chiede a ogni cliente, con naturalezza. Questa pagina raccoglie semplici buone pratiche per tutti i giorni.",
          },
          { type: "h2", id: "staff-script", text: "Una traccia per il vostro staff" },
          {
            type: "p",
            text: "Non c'è nulla da imparare a memoria. Conta chiedere al momento giusto (a fine servizio, al pagamento o all'uscita) e indicare la targa.",
          },
          {
            type: "ul",
            items: [
              "«Se ha un minuto, una recensione su Google ci aiuterebbe molto. Basta avvicinare il telefono a questa targa.»",
              "«La sua opinione conta. Avvicini il telefono qui, oppure inquadri il codice con la fotocamera.»",
              "«Se il tocco non funziona, inquadri il QR code e si apre subito.»",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Mostrate come si fa. Molte persone non hanno mai avvicinato il telefono a una targa; se lo staff lo dimostra con il proprio telefono nella prima settimana, l'uso aumenta in modo evidente.",
          },
          { type: "h2", id: "google-rules", text: "Regole di Google da rispettare" },
          {
            type: "p",
            text: "Google ha norme chiare sui contenuti delle recensioni. Ignorarle può portare alla rimozione delle recensioni o a limitazioni sul vostro profilo.",
          },
          {
            type: "ul",
            items: [
              "**Non offrite incentivi**: sconti, omaggi, estrazioni o regali in cambio di recensioni sono vietati, anche se chiedete una recensione «sincera».",
              "**Non filtrate le recensioni**: chiedetela a tutti i clienti, non solo a quelli che sembrano soddisfatti.",
              "**Non scrivete recensioni** al posto dei clienti e non chiedete a dipendenti o familiari di recensirvi.",
              "**Non fate pressione**: la richiesta deve essere cordiale e facoltativa.",
            ],
          },
          {
            type: "callout",
            tone: "warning",
            title: "Le recensioni negative fanno parte del gioco",
            text: "Chiedere a tutti significa ricevere anche qualche critica. È normale e dà credibilità. Rispondete con calma e professionalità; un profilo con risposte curate ispira più fiducia di uno perfetto.",
          },
          { type: "h2", id: "best-moments", text: "I momenti migliori per chiedere" },
          {
            type: "table",
            head: ["Tipo di attività", "Momento suggerito"],
            rows: [
              ["Ristorante o bar", "Quando portate il conto o al pagamento"],
              ["Parrucchiere o centro estetico", "Alla fine, quando il cliente vede il risultato allo specchio"],
              ["Clinica", "In reception, prenotando il prossimo appuntamento"],
              ["Negozio", "Mentre imbustate l'acquisto alla cassa"],
            ],
          },
          { type: "h2", id: "cleaning-care", text: "Pulizia e manutenzione" },
          {
            type: "ul",
            items: [
              "Pulite l'acrilico con un panno morbido in microfibra e acqua con un po' di detergente neutro.",
              "Evitate alcol, candeggina, acetone e prodotti abrasivi: graffiano e opacizzano l'acrilico.",
              "Non immergete le targhe in acqua e non mettetele in lavastoviglie.",
              "Controllate ogni tanto che il QR code sia ancora nitido e senza graffi.",
            ],
          },
          { type: "h2", id: "track-results", text: "Seguire i risultati" },
          {
            type: "p",
            text: "Confrontate il numero di recensioni del vostro profilo Google mese per mese. Se usate anche il nostro servizio di [gestione delle recensioni con IA](/it/products/ai-review-management), le risposte alle nuove recensioni sono gestite automaticamente, con la vostra approvazione.",
          },
        ],
      },
    },
    troubleshooting: {
      pt: {
        title: "Resolução de problemas das placas Google Reviews",
        description:
          "O que fazer quando uma placa não abre a página de avaliação: compatibilidade de telemóveis, capas, metal, links alterados e perfis Google suspensos.",
        blocks: [
          {
            type: "p",
            text: "Quase todos os problemas com as placas têm uma causa simples. Siga esta página por ordem antes de nos contactar; se o problema continuar, fale connosco pelo [contacto](/contacto) ou por WhatsApp.",
          },
          { type: "h2", id: "compatibilidade-telemoveis", text: "Compatibilidade dos telemóveis" },
          {
            type: "table",
            head: ["Telemóvel", "Como ler a placa"],
            rows: [
              ["iPhone XS e mais recentes", "Leitura automática em segundo plano, com o ecrã ligado e desbloqueado"],
              ["iPhone 7, 8 e X", "Abrir a Centro de Controlo e tocar no botão do leitor de etiquetas (pode ser preciso adicioná-lo em Definições)"],
              ["iPhone 6 ou anterior", "Sem leitura por aproximação: usar o código QR"],
              ["Android com leitura por aproximação", "Ligar a opção de leitura por aproximação nas definições de ligações; aproximar a zona superior ou central da parte de trás"],
              ["Android sem leitura por aproximação", "Usar o código QR com a câmara"],
            ],
          },
          {
            type: "callout",
            tone: "info",
            text: "A posição da antena de leitura varia entre modelos. Na maioria dos iPhones fica no topo; em muitos Android fica a meio das costas. Se não reagir, deslize o telemóvel devagar sobre a placa.",
          },
          { type: "h2", id: "placa-nao-reage", text: "A placa não reage" },
          {
            type: "ol",
            items: [
              "Confirme que o ecrã está ligado e desbloqueado.",
              "No Android, confirme que a opção de leitura por aproximação está ligada nas definições (normalmente em \"Ligações\" ou \"Dispositivos ligados\").",
              "Retire acessórios espessos: capas metálicas, capas-carteira com cartões e popsockets interferem com o sinal. Capas finas comuns não costumam ser problema.",
              "Mantenha o telemóvel encostado 1 a 2 segundos, sem movimentos bruscos.",
              "Teste com outro telemóvel. Se funcionar noutro, o problema está no primeiro aparelho.",
            ],
          },
          { type: "h3", id: "interferencia-local", text: "Interferência no local" },
          {
            type: "p",
            text: "Se a placa deixou de funcionar depois de mudar de sítio, verifique se está sobre metal ou encostada ao terminal de pagamento. Afaste-a uns centímetros e teste de novo. Em superfícies metálicas, é necessária a versão anti-metal.",
          },
          { type: "h2", id: "abre-pagina-errada", text: "Abre uma página errada ou um erro" },
          {
            type: "ul",
            items: [
              "**Abre o perfil mas não a janela de avaliação**: alguns navegadores abrem primeiro a ficha do negócio. O cliente pode tocar em \"Escrever uma avaliação\". Se acontecer sempre, avise-nos para revermos o link.",
              "**Pede para iniciar sessão**: o Google exige uma conta para publicar avaliações. É um comportamento normal.",
              "**Mostra outro negócio**: o link ou o Place ID está errado. Contacte-nos para corrigir o redirecionamento.",
              "**Página de erro**: pode ser uma falha momentânea de rede. Se persistir, contacte-nos.",
            ],
          },
          { type: "h2", id: "perfil-suspenso", text: "Perfil suspenso ou link alterado" },
          {
            type: "p",
            text: "Se o Google suspender o seu Perfil da Empresa, o formulário de avaliação deixa de estar disponível e as placas deixam de funcionar como esperado. Nesse caso:",
          },
          {
            type: "steps",
            items: [
              {
                title: "Resolver a suspensão com o Google",
                body: "Siga as instruções do Google para pedir a reintegração do perfil. A Steevanz não consegue intervir neste processo.",
              },
              {
                title: "Avisar a Steevanz",
                body: "Enquanto o perfil estiver suspenso, podemos encaminhar temporariamente as placas para outra página, como o seu site ou Instagram.",
              },
              {
                title: "Atualizar o destino",
                body: "Quando o perfil voltar (ou se for criado um novo), envie-nos o link de avaliação e atualizamos todas as placas, sem reimprimir nada.",
              },
            ],
          },
          { type: "h2", id: "danos-fisicos", text: "Danos físicos" },
          {
            type: "p",
            text: "Uma placa partida, dobrada ou com o QR ilegível pode ter o chip danificado. Envie-nos uma fotografia e tratamos da substituição.",
          },
        ],
      },
      en: {
        title: "Troubleshooting Google review plates",
        description:
          "What to do when a plate won't open the review page: phone compatibility, phone cases, metal surfaces, changed links and suspended Google profiles.",
        blocks: [
          {
            type: "p",
            text: "Almost every plate problem has a simple cause. Work through this page in order before getting in touch; if the problem persists, [contact us](/en/contact) or message us on WhatsApp.",
          },
          { type: "h2", id: "phone-compatibility", text: "Phone compatibility" },
          {
            type: "table",
            head: ["Phone", "How to read the plate"],
            rows: [
              ["iPhone XS and newer", "Reads automatically in the background, with the screen on and unlocked"],
              ["iPhone 7, 8 and X", "Open Control Centre and tap the tag reader button (you may need to add it in Settings first)"],
              ["iPhone 6 or older", "No tap reading: use the QR code"],
              ["Android with tap reading", "Turn on the contactless (tap) reading option in the connection settings; hold the top or middle of the back of the phone to the plate"],
              ["Android without tap reading", "Use the QR code with the camera"],
            ],
          },
          {
            type: "callout",
            tone: "info",
            text: "The position of the reading antenna varies between models. On most iPhones it's at the top; on many Android phones it's in the middle of the back. If nothing happens, slide the phone slowly over the plate.",
          },
          { type: "h2", id: "plate-not-responding", text: "The plate doesn't respond" },
          {
            type: "ol",
            items: [
              "Check the screen is on and unlocked.",
              "On Android, check the contactless (tap) reading option is turned on in settings (usually under \"Connections\" or \"Connected devices\").",
              "Remove bulky accessories: metal cases, wallet cases holding cards and popsockets interfere with the signal. Ordinary thin cases are usually fine.",
              "Hold the phone against the plate for 1 to 2 seconds without moving it around.",
              "Try another phone. If it works there, the issue is with the first device.",
            ],
          },
          { type: "h3", id: "local-interference", text: "Interference on site" },
          {
            type: "p",
            text: "If the plate stopped working after being moved, check whether it's sitting on metal or right against the card terminal. Move it a few centimetres away and test again. On metal surfaces you'll need the anti-metal version.",
          },
          { type: "h2", id: "wrong-page", text: "It opens the wrong page or an error" },
          {
            type: "ul",
            items: [
              "**Opens the listing but not the review window**: some browsers show the business listing first. The customer can tap \"Write a review\". If it always happens, let us know so we can check the link.",
              "**Asks to sign in**: Google requires an account to post reviews. This is normal.",
              "**Shows another business**: the link or Place ID is wrong. Contact us and we'll fix the redirect.",
              "**Error page**: it may be a temporary network glitch. If it persists, get in touch.",
            ],
          },
          { type: "h2", id: "suspended-profile", text: "Suspended profile or changed link" },
          {
            type: "p",
            text: "If Google suspends your Business Profile, the review form becomes unavailable and the plates stop working as expected. In that case:",
          },
          {
            type: "steps",
            items: [
              {
                title: "Resolve the suspension with Google",
                body: "Follow Google's instructions to request reinstatement. Steevanz can't intervene in that process.",
              },
              {
                title: "Let Steevanz know",
                body: "While the profile is suspended, we can temporarily point your plates to another page, such as your website or Instagram.",
              },
              {
                title: "Update the destination",
                body: "Once the profile is back (or a new one is created), send us the review link and we'll update every plate, with no reprinting.",
              },
            ],
          },
          { type: "h2", id: "physical-damage", text: "Physical damage" },
          {
            type: "p",
            text: "A broken or bent plate, or one with an unreadable QR code, may have a damaged chip. Send us a photo and we'll arrange a replacement.",
          },
        ],
      },
      es: {
        title: "Solución de problemas de las placas para reseñas en Google",
        description:
          "Qué hacer cuando una placa no abre la página de reseñas: compatibilidad del móvil, fundas, superficies metálicas, enlaces cambiados y perfiles de Google suspendidos.",
        blocks: [
          {
            type: "p",
            text: "Casi todos los problemas de las placas tienen una causa sencilla. Recorra esta página en orden antes de contactarnos; si el problema continúa, [contacte con nosotros](/es/contact) o escríbanos por WhatsApp.",
          },
          { type: "h2", id: "phone-compatibility", text: "Compatibilidad del móvil" },
          {
            type: "table",
            head: ["Móvil", "Cómo leer la placa"],
            rows: [
              ["iPhone XS y posteriores", "Lee automáticamente en segundo plano, con la pantalla encendida y desbloqueada"],
              ["iPhone 7, 8 y X", "Abra el Centro de control y toque el botón del lector de etiquetas (quizá tenga que añadirlo antes en Ajustes)"],
              ["iPhone 6 o anteriores", "Sin lectura con un toque: use el código QR"],
              ["Android con lectura con un toque", "Active la opción de lectura por proximidad (con un toque) en los ajustes de conexiones; acerque la parte superior o central de la trasera del móvil a la placa"],
              ["Android sin lectura con un toque", "Use el código QR con la cámara"],
            ],
          },
          {
            type: "callout",
            tone: "info",
            text: "La posición de la antena de lectura varía según el modelo. En la mayoría de los iPhone está en la parte superior; en muchos Android, en el centro de la trasera. Si no pasa nada, deslice el móvil despacio sobre la placa.",
          },
          { type: "h2", id: "plate-not-responding", text: "La placa no responde" },
          {
            type: "ol",
            items: [
              "Compruebe que la pantalla está encendida y desbloqueada.",
              "En Android, compruebe que la opción de lectura por proximidad (con un toque) está activada en los ajustes (normalmente en «Conexiones» o «Dispositivos conectados»).",
              "Quite los accesorios voluminosos: las fundas metálicas, las fundas cartera con tarjetas y los popsockets interfieren con la señal. Las fundas finas normales no suelen dar problemas.",
              "Mantenga el móvil junto a la placa de 1 a 2 segundos sin moverlo.",
              "Pruebe con otro móvil. Si ahí funciona, el problema está en el primer dispositivo.",
            ],
          },
          { type: "h3", id: "local-interference", text: "Interferencias en el local" },
          {
            type: "p",
            text: "Si la placa dejó de funcionar después de moverla, compruebe si está sobre metal o pegada al datáfono. Sepárela unos centímetros y vuelva a probar. En superficies metálicas necesitará la versión antimetal.",
          },
          { type: "h2", id: "wrong-page", text: "Abre una página equivocada o un error" },
          {
            type: "ul",
            items: [
              "**Abre la ficha pero no la ventana de reseña**: algunos navegadores muestran primero la ficha del negocio. El cliente puede tocar «Escribir una reseña». Si ocurre siempre, avísenos para revisar el enlace.",
              "**Pide iniciar sesión**: Google exige una cuenta para publicar reseñas. Es normal.",
              "**Muestra otro negocio**: el enlace o el Place ID son incorrectos. Contacte con nosotros y corregimos la redirección.",
              "**Página de error**: puede ser un fallo temporal de la red. Si continúa, contacte con nosotros.",
            ],
          },
          { type: "h2", id: "suspended-profile", text: "Perfil suspendido o enlace cambiado" },
          {
            type: "p",
            text: "Si Google suspende su Perfil de Empresa, el formulario de reseñas deja de estar disponible y las placas dejan de funcionar como deberían. En ese caso:",
          },
          {
            type: "steps",
            items: [
              {
                title: "Resolver la suspensión con Google",
                body: "Siga las instrucciones de Google para solicitar el restablecimiento. Steevanz no puede intervenir en ese proceso.",
              },
              {
                title: "Avisar a Steevanz",
                body: "Mientras el perfil esté suspendido, podemos apuntar temporalmente sus placas a otra página, como su web o su Instagram.",
              },
              {
                title: "Actualizar el destino",
                body: "Cuando el perfil vuelva (o se cree uno nuevo), envíenos el enlace de reseñas y actualizamos todas las placas, sin reimprimir.",
              },
            ],
          },
          { type: "h2", id: "physical-damage", text: "Daños físicos" },
          {
            type: "p",
            text: "Una placa rota o doblada, o con el código QR ilegible, puede tener el chip dañado. Envíenos una foto y nos encargamos de la sustitución.",
          },
        ],
      },
      fr: {
        title: "Résolution des problèmes des plaques pour avis Google",
        description:
          "Que faire quand une plaque n'ouvre pas la page d'avis : compatibilité du téléphone, coques, surfaces métalliques, liens modifiés et fiches Google suspendues.",
        blocks: [
          {
            type: "p",
            text: "Presque tous les problèmes de plaque ont une cause simple. Parcourez cette page dans l'ordre avant de nous contacter ; si le problème persiste, [contactez-nous](/fr/contact) ou écrivez-nous sur WhatsApp.",
          },
          { type: "h2", id: "phone-compatibility", text: "Compatibilité des téléphones" },
          {
            type: "table",
            head: ["Téléphone", "Comment lire la plaque"],
            rows: [
              ["iPhone XS et plus récents", "Lecture automatique en arrière-plan, écran allumé et déverrouillé"],
              ["iPhone 7, 8 et X", "Ouvrez le Centre de contrôle et touchez le bouton du lecteur de tags (il faut parfois l'ajouter d'abord dans Réglages)"],
              ["iPhone 6 ou plus ancien", "Pas de lecture d'un toucher : utilisez le QR code"],
              ["Android avec lecture d'un toucher", "Activez la lecture sans contact (d'un toucher) dans les paramètres de connexion ; approchez le haut ou le milieu du dos du téléphone de la plaque"],
              ["Android sans lecture d'un toucher", "Utilisez le QR code avec l'appareil photo"],
            ],
          },
          {
            type: "callout",
            tone: "info",
            text: "La position de l'antenne de lecture varie selon les modèles. Sur la plupart des iPhone, elle est en haut ; sur beaucoup d'Android, au milieu du dos. Si rien ne se passe, faites glisser lentement le téléphone sur la plaque.",
          },
          { type: "h2", id: "plate-not-responding", text: "La plaque ne réagit pas" },
          {
            type: "ol",
            items: [
              "Vérifiez que l'écran est allumé et déverrouillé.",
              "Sur Android, vérifiez que la lecture sans contact (d'un toucher) est activée dans les paramètres (en général sous «Connexions» ou «Appareils connectés»).",
              "Retirez les accessoires encombrants : coques métalliques, étuis portefeuille avec des cartes et popsockets perturbent le signal. Les coques fines ordinaires ne posent généralement pas de problème.",
              "Maintenez le téléphone contre la plaque 1 à 2 secondes sans le bouger.",
              "Essayez avec un autre téléphone. Si cela marche, le problème vient du premier appareil.",
            ],
          },
          { type: "h3", id: "local-interference", text: "Interférences sur place" },
          {
            type: "p",
            text: "Si la plaque ne fonctionne plus après avoir été déplacée, vérifiez si elle est posée sur du métal ou collée au terminal de paiement. Écartez-la de quelques centimètres et testez à nouveau. Sur les surfaces métalliques, il vous faut la version anti-métal.",
          },
          { type: "h2", id: "wrong-page", text: "Elle ouvre la mauvaise page ou une erreur" },
          {
            type: "ul",
            items: [
              "**Ouvre la fiche mais pas la fenêtre d'avis** : certains navigateurs affichent d'abord la fiche du commerce. Le client peut toucher «Donner un avis». Si cela arrive à chaque fois, prévenez-nous pour que nous vérifiions le lien.",
              "**Demande de se connecter** : Google exige un compte pour publier un avis. C'est normal.",
              "**Affiche un autre commerce** : le lien ou le Place ID est erroné. Contactez-nous et nous corrigeons la redirection.",
              "**Page d'erreur** : il peut s'agir d'un problème réseau passager. Si cela persiste, contactez-nous.",
            ],
          },
          { type: "h2", id: "suspended-profile", text: "Fiche suspendue ou lien modifié" },
          {
            type: "p",
            text: "Si Google suspend votre fiche d'établissement, le formulaire d'avis devient indisponible et les plaques ne fonctionnent plus comme prévu. Dans ce cas :",
          },
          {
            type: "steps",
            items: [
              {
                title: "Régler la suspension avec Google",
                body: "Suivez les instructions de Google pour demander le rétablissement. Steevanz ne peut pas intervenir dans cette procédure.",
              },
              {
                title: "Prévenir Steevanz",
                body: "Pendant la suspension, nous pouvons faire pointer temporairement vos plaques vers une autre page, comme votre site web ou votre Instagram.",
              },
              {
                title: "Mettre à jour la destination",
                body: "Une fois la fiche rétablie (ou une nouvelle créée), envoyez-nous le lien d'avis et nous mettons à jour toutes les plaques, sans réimpression.",
              },
            ],
          },
          { type: "h2", id: "physical-damage", text: "Dommages physiques" },
          {
            type: "p",
            text: "Une plaque cassée ou pliée, ou dont le QR code est illisible, peut avoir une puce endommagée. Envoyez-nous une photo et nous nous occupons du remplacement.",
          },
        ],
      },
      de: {
        title: "Fehlerbehebung für Schilder für Google-Bewertungen",
        description:
          "Was tun, wenn ein Schild die Bewertungsseite nicht öffnet: Handy-Kompatibilität, Handyhüllen, Metallflächen, geänderte Links und gesperrte Google-Profile.",
        blocks: [
          {
            type: "p",
            text: "Fast jedes Problem mit einem Schild hat eine einfache Ursache. Gehen Sie diese Seite der Reihe nach durch, bevor Sie sich melden; besteht das Problem weiter, [kontaktieren Sie uns](/de/contact) oder schreiben Sie uns per WhatsApp.",
          },
          { type: "h2", id: "phone-compatibility", text: "Handy-Kompatibilität" },
          {
            type: "table",
            head: ["Handy", "So wird das Schild gelesen"],
            rows: [
              ["iPhone XS und neuer", "Liest automatisch im Hintergrund, bei eingeschaltetem und entsperrtem Bildschirm"],
              ["iPhone 7, 8 und X", "Kontrollzentrum öffnen und auf die Taste des Tag-Lesers tippen (eventuell zuerst in den Einstellungen hinzufügen)"],
              ["iPhone 6 oder älter", "Kein Lesen per Antippen: nutzen Sie den QR-Code"],
              ["Android mit Lesen per Antippen", "Kontaktloses Lesen (per Antippen) in den Verbindungseinstellungen einschalten; den oberen oder mittleren Teil der Rückseite an das Schild halten"],
              ["Android ohne Lesen per Antippen", "Den QR-Code mit der Kamera nutzen"],
            ],
          },
          {
            type: "callout",
            tone: "info",
            text: "Die Position der Leseantenne ist je nach Modell verschieden. Bei den meisten iPhones sitzt sie oben, bei vielen Android-Handys in der Mitte der Rückseite. Passiert nichts, schieben Sie das Handy langsam über das Schild.",
          },
          { type: "h2", id: "plate-not-responding", text: "Das Schild reagiert nicht" },
          {
            type: "ol",
            items: [
              "Prüfen Sie, ob der Bildschirm eingeschaltet und entsperrt ist.",
              "Prüfen Sie bei Android, ob das kontaktlose Lesen (per Antippen) in den Einstellungen eingeschaltet ist (meist unter «Verbindungen» oder «Verbundene Geräte»).",
              "Entfernen Sie dickes Zubehör: Metallhüllen, Wallet-Hüllen mit Karten und Popsockets stören das Signal. Normale dünne Hüllen sind meist kein Problem.",
              "Halten Sie das Handy 1 bis 2 Sekunden ruhig an das Schild.",
              "Versuchen Sie es mit einem anderen Handy. Klappt es dort, liegt das Problem beim ersten Gerät.",
            ],
          },
          { type: "h3", id: "local-interference", text: "Störungen vor Ort" },
          {
            type: "p",
            text: "Funktioniert das Schild nicht mehr, seit es umgestellt wurde, prüfen Sie, ob es auf Metall oder direkt am Kartenterminal steht. Rücken Sie es ein paar Zentimeter weg und testen Sie erneut. Auf Metallflächen brauchen Sie die Anti-Metall-Version.",
          },
          { type: "h2", id: "wrong-page", text: "Es öffnet die falsche Seite oder einen Fehler" },
          {
            type: "ul",
            items: [
              "**Öffnet den Eintrag, aber nicht das Bewertungsfenster**: Manche Browser zeigen zuerst den Unternehmenseintrag. Der Kunde kann auf «Rezension schreiben» tippen. Passiert das immer, sagen Sie uns Bescheid, damit wir den Link prüfen.",
              "**Fordert zur Anmeldung auf**: Google verlangt ein Konto, um Bewertungen zu veröffentlichen. Das ist normal.",
              "**Zeigt ein anderes Geschäft**: Der Link oder die Place ID ist falsch. Kontaktieren Sie uns, und wir korrigieren die Weiterleitung.",
              "**Fehlerseite**: Das kann eine vorübergehende Netzwerkstörung sein. Besteht sie weiter, melden Sie sich.",
            ],
          },
          { type: "h2", id: "suspended-profile", text: "Gesperrtes Profil oder geänderter Link" },
          {
            type: "p",
            text: "Sperrt Google Ihr Unternehmensprofil, ist das Bewertungsformular nicht mehr verfügbar und die Schilder funktionieren nicht mehr wie vorgesehen. In diesem Fall:",
          },
          {
            type: "steps",
            items: [
              {
                title: "Sperrung mit Google klären",
                body: "Folgen Sie den Anweisungen von Google, um die Wiederherstellung zu beantragen. Steevanz kann in diesen Vorgang nicht eingreifen.",
              },
              {
                title: "Steevanz informieren",
                body: "Solange das Profil gesperrt ist, können wir Ihre Schilder vorübergehend auf eine andere Seite zeigen lassen, etwa Ihre Website oder Ihr Instagram.",
              },
              {
                title: "Ziel aktualisieren",
                body: "Ist das Profil wieder da (oder ein neues angelegt), senden Sie uns den Bewertungslink, und wir aktualisieren alle Schilder, ohne Neudruck.",
              },
            ],
          },
          { type: "h2", id: "physical-damage", text: "Physische Schäden" },
          {
            type: "p",
            text: "Ein zerbrochenes oder verbogenes Schild oder eines mit unlesbarem QR-Code kann einen beschädigten Chip haben. Senden Sie uns ein Foto, und wir kümmern uns um den Ersatz.",
          },
        ],
      },
      it: {
        title: "Risoluzione dei problemi delle targhe per recensioni Google",
        description:
          "Cosa fare quando una targa non apre la pagina delle recensioni: compatibilità del telefono, cover, superfici metalliche, link cambiati e profili Google sospesi.",
        blocks: [
          {
            type: "p",
            text: "Quasi ogni problema delle targhe ha una causa semplice. Seguite questa pagina in ordine prima di contattarci; se il problema persiste, [contattateci](/it/contact) o scriveteci su WhatsApp.",
          },
          { type: "h2", id: "phone-compatibility", text: "Compatibilità dei telefoni" },
          {
            type: "table",
            head: ["Telefono", "Come leggere la targa"],
            rows: [
              ["iPhone XS e successivi", "Legge automaticamente in background, con lo schermo acceso e sbloccato"],
              ["iPhone 7, 8 e X", "Aprite il Centro di Controllo e toccate il pulsante del lettore di tag (potrebbe essere necessario aggiungerlo prima in Impostazioni)"],
              ["iPhone 6 o precedenti", "Nessuna lettura con un tocco: usate il QR code"],
              ["Android con lettura con un tocco", "Attivate la lettura di prossimità (con un tocco) nelle impostazioni delle connessioni; avvicinate la parte alta o centrale del retro del telefono alla targa"],
              ["Android senza lettura con un tocco", "Usate il QR code con la fotocamera"],
            ],
          },
          {
            type: "callout",
            tone: "info",
            text: "La posizione dell'antenna di lettura varia da modello a modello. Sulla maggior parte degli iPhone è in alto; su molti Android è al centro del retro. Se non succede nulla, fate scorrere lentamente il telefono sulla targa.",
          },
          { type: "h2", id: "plate-not-responding", text: "La targa non risponde" },
          {
            type: "ol",
            items: [
              "Verificate che lo schermo sia acceso e sbloccato.",
              "Su Android, verificate che la lettura di prossimità (con un tocco) sia attiva nelle impostazioni (di solito in «Connessioni» o «Dispositivi connessi»).",
              "Togliete gli accessori ingombranti: cover metalliche, cover a portafoglio con carte e popsocket disturbano il segnale. Le normali cover sottili di solito non creano problemi.",
              "Tenete il telefono contro la targa per 1-2 secondi senza muoverlo.",
              "Provate con un altro telefono. Se lì funziona, il problema è nel primo dispositivo.",
            ],
          },
          { type: "h3", id: "local-interference", text: "Interferenze sul posto" },
          {
            type: "p",
            text: "Se la targa ha smesso di funzionare dopo essere stata spostata, verificate se poggia su metallo o è attaccata al POS. Allontanatela di qualche centimetro e testate di nuovo. Sulle superfici metalliche serve la versione anti-metallo.",
          },
          { type: "h2", id: "wrong-page", text: "Apre la pagina sbagliata o un errore" },
          {
            type: "ul",
            items: [
              "**Apre la scheda ma non la finestra di recensione**: alcuni browser mostrano prima la scheda dell'attività. Il cliente può toccare «Scrivi una recensione». Se succede sempre, avvisateci per verificare il link.",
              "**Chiede di accedere**: Google richiede un account per pubblicare recensioni. È normale.",
              "**Mostra un'altra attività**: il link o il Place ID è sbagliato. Contattateci e correggiamo il reindirizzamento.",
              "**Pagina di errore**: può essere un problema temporaneo di rete. Se persiste, contattateci.",
            ],
          },
          { type: "h2", id: "suspended-profile", text: "Profilo sospeso o link cambiato" },
          {
            type: "p",
            text: "Se Google sospende il vostro Profilo dell'attività, il modulo di recensione non è più disponibile e le targhe smettono di funzionare come previsto. In quel caso:",
          },
          {
            type: "steps",
            items: [
              {
                title: "Risolvere la sospensione con Google",
                body: "Seguite le istruzioni di Google per chiedere il ripristino. Steevanz non può intervenire in questa procedura.",
              },
              {
                title: "Avvisare Steevanz",
                body: "Mentre il profilo è sospeso, possiamo far puntare temporaneamente le targhe a un'altra pagina, come il vostro sito o il vostro Instagram.",
              },
              {
                title: "Aggiornare la destinazione",
                body: "Quando il profilo torna attivo (o ne viene creato uno nuovo), inviateci il link per le recensioni e aggiorniamo tutte le targhe, senza ristampare.",
              },
            ],
          },
          { type: "h2", id: "physical-damage", text: "Danni fisici" },
          {
            type: "p",
            text: "Una targa rotta o piegata, o con il QR code illeggibile, può avere il chip danneggiato. Inviateci una foto e ci occupiamo della sostituzione.",
          },
        ],
      },
    },
    faq: {
      pt: {
        title: "Perguntas frequentes sobre placas Google Reviews",
        description:
          "Respostas às dúvidas mais comuns sobre placas para reviews no Google: compatibilidade, regras do Google, alterações de link, limpeza e substituição.",
        blocks: [
          { type: "h2", id: "perguntas", text: "Perguntas frequentes" },
          {
            type: "faq",
            items: [
              {
                q: "O cliente precisa de instalar alguma aplicação?",
                a: "Não. A leitura por aproximação está integrada na maioria dos telemóveis recentes e o código QR funciona com a câmara. O formulário abre no navegador ou na aplicação Google Maps.",
              },
              {
                q: "Funciona em todos os iPhones?",
                a: "Do iPhone XS em diante, a leitura é automática com o ecrã desbloqueado. Nos iPhone 7, 8 e X é preciso usar o botão do leitor de etiquetas na Centro de Controlo. Em modelos mais antigos, use o código QR.",
              },
              {
                q: "A Steevanz tem alguma ligação à Google?",
                a: "Não. A Steevanz é uma empresa independente. As placas apenas encaminham os clientes para o formulário público de avaliação do seu Perfil da Empresa no Google.",
              },
              {
                q: "Posso oferecer um desconto a quem deixar avaliação?",
                a: "Não. As políticas do Google proíbem incentivos em troca de avaliações, mesmo que a avaliação seja honesta. Peça a todos os clientes, sem contrapartidas.",
              },
              {
                q: "Posso pedir avaliações só aos clientes satisfeitos?",
                a: "Não deve. Pedir seletivamente (review gating) vai contra as regras do Google. Peça a todos; as críticas ocasionais tornam o perfil mais credível.",
              },
              {
                q: "Alguém pode reprogramar a minha placa?",
                a: "Não. Bloqueamos todos os chips após a gravação, por isso não podem ser reescritos com aplicações de escrita de chips.",
              },
              {
                q: "Se mudar de morada ou de perfil, tenho de comprar placas novas?",
                a: "Não. O chip aponta para um redirecionamento gerido pela Steevanz. Basta enviar-nos o novo link e atualizamos o destino de todas as placas. Veja a página de [configuração](/docs/placas-google-reviews/configuracao).",
              },
              {
                q: "Posso colocar uma placa numa superfície metálica?",
                a: "Sim, mas precisa da versão com chip anti-metal. Uma placa normal sobre metal pode não ser lida. Diga-nos onde a vai instalar quando fizer a encomenda.",
              },
              {
                q: "Como limpo as placas?",
                a: "Com um pano de microfibra e água com detergente neutro. Evite álcool, lixívia e produtos abrasivos, que riscam o acrílico.",
              },
              {
                q: "E se uma placa se partir?",
                a: "Envie-nos uma fotografia pelo [contacto](/contacto) ou por WhatsApp e tratamos da substituição.",
              },
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Não encontrou a resposta? [Agende uma demonstração](/agendar) e esclarecemos tudo consigo.",
          },
        ],
      },
      en: {
        title: "Google review plates FAQ",
        description:
          "Answers to the most common questions about Google review plates: phone compatibility, Google's rules, link changes, cleaning and replacements.",
        blocks: [
          { type: "h2", id: "questions", text: "Frequently asked questions" },
          {
            type: "faq",
            items: [
              {
                q: "Do customers need to install an app?",
                a: "No. Tap reading is built into most recent phones and the QR code works with the camera. The review form opens in the browser or in the Google Maps app.",
              },
              {
                q: "Does it work on every iPhone?",
                a: "From iPhone XS onwards, reading is automatic with the screen unlocked. On iPhone 7, 8 and X you need the tag reader button in Control Centre. On older models, use the QR code.",
              },
              {
                q: "Is Steevanz connected to Google?",
                a: "No. Steevanz is an independent company. The plates simply send customers to the public review form of your Google Business Profile.",
              },
              {
                q: "Can I offer a discount to customers who leave a review?",
                a: "No. Google's policies forbid incentives in exchange for reviews, even honest ones. Ask every customer, with nothing in return.",
              },
              {
                q: "Can I only ask happy customers?",
                a: "You shouldn't. Selective asking (review gating) breaks Google's rules. Ask everyone; the occasional criticism makes your profile more credible.",
              },
              {
                q: "Can someone reprogram my plate?",
                a: "No. We lock every chip after writing it, so it can't be rewritten with chip-writing apps.",
              },
              {
                q: "If I move or change profile, do I need new plates?",
                a: "No. The chip points to a redirect managed by Steevanz. Just send us the new link and we'll update every plate. See the [configuration](/en/docs/google-review-plates/configuration) page.",
              },
              {
                q: "Can I put a plate on a metal surface?",
                a: "Yes, but you need the anti-metal chip version. A standard plate on metal may not be read. Tell us where it's going when you order.",
              },
              {
                q: "How do I clean the plates?",
                a: "With a microfibre cloth and water with mild detergent. Avoid alcohol, bleach and abrasive products, which scratch the acrylic.",
              },
              {
                q: "What if a plate breaks?",
                a: "Send us a photo via our [contact page](/en/contact) or WhatsApp and we'll arrange a replacement.",
              },
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Didn't find your answer? [Book a demo](/en/book-a-demo) and we'll talk it through with you.",
          },
        ],
      },
      es: {
        title: "Preguntas frecuentes sobre las placas para reseñas en Google",
        description:
          "Respuestas a las dudas más habituales sobre las placas para reseñas en Google: compatibilidad de móviles, normas de Google, cambios de enlace, limpieza y sustituciones.",
        blocks: [
          { type: "h2", id: "questions", text: "Preguntas frecuentes" },
          {
            type: "faq",
            items: [
              {
                q: "¿Los clientes tienen que instalar una app?",
                a: "No. La lectura con un toque viene incluida en la mayoría de los móviles recientes y el código QR funciona con la cámara. El formulario de reseñas se abre en el navegador o en la app Google Maps.",
              },
              {
                q: "¿Funciona en todos los iPhone?",
                a: "Desde el iPhone XS, la lectura es automática con la pantalla desbloqueada. En los iPhone 7, 8 y X hace falta el botón del lector de etiquetas del Centro de control. En modelos más antiguos, use el código QR.",
              },
              {
                q: "¿Steevanz tiene relación con Google?",
                a: "No. Steevanz es una empresa independiente. Las placas solo llevan a los clientes al formulario público de reseñas de su Perfil de Empresa de Google.",
              },
              {
                q: "¿Puedo ofrecer un descuento a los clientes que dejen una reseña?",
                a: "No. Las políticas de Google prohíben los incentivos a cambio de reseñas, aunque sean sinceras. Pídala a todos los clientes, sin nada a cambio.",
              },
              {
                q: "¿Puedo pedirla solo a los clientes satisfechos?",
                a: "No debería. Pedirla de forma selectiva (filtrado de reseñas) incumple las normas de Google. Pídala a todos; alguna crítica ocasional hace su perfil más creíble.",
              },
              {
                q: "¿Alguien puede reprogramar mi placa?",
                a: "No. Bloqueamos todos los chips después de grabarlos, así que no se pueden reescribir con apps de grabación de chips.",
              },
              {
                q: "Si me traslado o cambio de perfil, ¿necesito placas nuevas?",
                a: "No. El chip apunta a una redirección gestionada por Steevanz. Basta con enviarnos el nuevo enlace y actualizamos todas las placas. Vea la página de [configuración](/es/docs/google-review-plates/configuration).",
              },
              {
                q: "¿Puedo poner una placa sobre una superficie metálica?",
                a: "Sí, pero necesita la versión con chip antimetal. Una placa normal sobre metal puede no leerse. Indíquenos dónde irá cuando haga el pedido.",
              },
              {
                q: "¿Cómo limpio las placas?",
                a: "Con un paño de microfibra y agua con detergente neutro. Evite el alcohol, la lejía y los productos abrasivos, que rayan el acrílico.",
              },
              {
                q: "¿Y si se rompe una placa?",
                a: "Envíenos una foto desde nuestra [página de contacto](/es/contact) o por WhatsApp y nos encargamos de la sustitución.",
              },
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "¿No ha encontrado su respuesta? [Reserve una demostración](/es/book-a-demo) y lo hablamos con usted.",
          },
        ],
      },
      fr: {
        title: "Questions fréquentes sur les plaques pour avis Google",
        description:
          "Réponses aux questions les plus courantes sur les plaques pour avis Google : compatibilité des téléphones, règles de Google, changement de lien, nettoyage et remplacements.",
        blocks: [
          { type: "h2", id: "questions", text: "Questions fréquentes" },
          {
            type: "faq",
            items: [
              {
                q: "Les clients doivent-ils installer une application ?",
                a: "Non. La lecture d'un toucher est intégrée à la plupart des téléphones récents et le QR code fonctionne avec l'appareil photo. Le formulaire d'avis s'ouvre dans le navigateur ou dans l'application Google Maps.",
              },
              {
                q: "Est-ce que ça marche sur tous les iPhone ?",
                a: "À partir de l'iPhone XS, la lecture est automatique écran déverrouillé. Sur les iPhone 7, 8 et X, il faut le bouton du lecteur de tags dans le Centre de contrôle. Sur les modèles plus anciens, utilisez le QR code.",
              },
              {
                q: "Steevanz est-elle liée à Google ?",
                a: "Non. Steevanz est une entreprise indépendante. Les plaques dirigent simplement les clients vers le formulaire public d'avis de votre fiche d'établissement Google.",
              },
              {
                q: "Puis-je offrir une réduction aux clients qui laissent un avis ?",
                a: "Non. Les règles de Google interdisent toute contrepartie en échange d'avis, même sincères. Demandez à tous les clients, sans rien en retour.",
              },
              {
                q: "Puis-je demander uniquement aux clients satisfaits ?",
                a: "Vous ne devriez pas. Demander de façon sélective (filtrage des avis) enfreint les règles de Google. Demandez à tout le monde ; une critique de temps en temps rend votre fiche plus crédible.",
              },
              {
                q: "Quelqu'un peut-il reprogrammer ma plaque ?",
                a: "Non. Nous verrouillons chaque puce après l'avoir programmée : elle ne peut pas être réécrite avec une application d'écriture de puces.",
              },
              {
                q: "Si je déménage ou change de fiche, me faut-il de nouvelles plaques ?",
                a: "Non. La puce pointe vers une redirection gérée par Steevanz. Envoyez-nous simplement le nouveau lien et nous mettons à jour toutes les plaques. Voir la page [configuration](/fr/docs/google-review-plates/configuration).",
              },
              {
                q: "Puis-je poser une plaque sur une surface métallique ?",
                a: "Oui, mais il vous faut la version à puce anti-métal. Une plaque standard sur du métal risque de ne pas être lue. Indiquez-nous l'emplacement à la commande.",
              },
              {
                q: "Comment nettoyer les plaques ?",
                a: "Avec un chiffon en microfibre et de l'eau avec un détergent neutre. Évitez l'alcool, l'eau de Javel et les produits abrasifs, qui rayent l'acrylique.",
              },
              {
                q: "Et si une plaque se casse ?",
                a: "Envoyez-nous une photo via notre [page de contact](/fr/contact) ou sur WhatsApp et nous nous occupons du remplacement.",
              },
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Vous n'avez pas trouvé votre réponse ? [Réservez une démonstration](/fr/book-a-demo) et nous en parlerons avec vous.",
          },
        ],
      },
      de: {
        title: "Häufige Fragen zu den Schildern für Google-Bewertungen",
        description:
          "Antworten auf die häufigsten Fragen zu den Schildern für Google-Bewertungen: Handy-Kompatibilität, Google-Regeln, Linkänderungen, Reinigung und Ersatz.",
        blocks: [
          { type: "h2", id: "questions", text: "Häufige Fragen" },
          {
            type: "faq",
            items: [
              {
                q: "Müssen Kunden eine App installieren?",
                a: "Nein. Das Lesen per Antippen ist in den meisten aktuellen Handys eingebaut, und der QR-Code funktioniert mit der Kamera. Das Bewertungsformular öffnet sich im Browser oder in der Google-Maps-App.",
              },
              {
                q: "Funktioniert es auf jedem iPhone?",
                a: "Ab dem iPhone XS liest das Handy automatisch, wenn der Bildschirm entsperrt ist. Beim iPhone 7, 8 und X brauchen Sie die Taste des Tag-Lesers im Kontrollzentrum. Bei älteren Modellen nutzen Sie den QR-Code.",
              },
              {
                q: "Hat Steevanz eine Verbindung zu Google?",
                a: "Nein. Steevanz ist ein unabhängiges Unternehmen. Die Schilder leiten Kunden nur zum öffentlichen Bewertungsformular Ihres Google-Unternehmensprofils weiter.",
              },
              {
                q: "Darf ich Kunden, die eine Bewertung hinterlassen, einen Rabatt geben?",
                a: "Nein. Die Richtlinien von Google verbieten Anreize im Austausch für Bewertungen, auch für ehrliche. Fragen Sie jeden Kunden, ohne Gegenleistung.",
              },
              {
                q: "Darf ich nur zufriedene Kunden fragen?",
                a: "Das sollten Sie nicht. Selektives Fragen (Review Gating) verstößt gegen die Regeln von Google. Fragen Sie alle; gelegentliche Kritik macht Ihr Profil glaubwürdiger.",
              },
              {
                q: "Kann jemand mein Schild umprogrammieren?",
                a: "Nein. Wir sperren jeden Chip nach dem Beschreiben, sodass er sich mit Chip-Apps nicht überschreiben lässt.",
              },
              {
                q: "Brauche ich neue Schilder, wenn ich umziehe oder das Profil wechsle?",
                a: "Nein. Der Chip zeigt auf eine von Steevanz verwaltete Weiterleitung. Senden Sie uns einfach den neuen Link, und wir aktualisieren alle Schilder. Siehe die Seite [Konfiguration](/de/docs/google-review-plates/configuration).",
              },
              {
                q: "Kann ich ein Schild auf einer Metallfläche anbringen?",
                a: "Ja, aber Sie brauchen die Version mit Anti-Metall-Chip. Ein normales Schild auf Metall wird womöglich nicht gelesen. Sagen Sie uns bei der Bestellung, wo es hinkommt.",
              },
              {
                q: "Wie reinige ich die Schilder?",
                a: "Mit einem Mikrofasertuch und Wasser mit mildem Reinigungsmittel. Vermeiden Sie Alkohol, Bleiche und Scheuermittel, die das Acryl verkratzen.",
              },
              {
                q: "Was, wenn ein Schild kaputtgeht?",
                a: "Senden Sie uns ein Foto über unsere [Kontaktseite](/de/contact) oder per WhatsApp, und wir kümmern uns um den Ersatz.",
              },
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Keine Antwort gefunden? [Buchen Sie eine Vorführung](/de/book-a-demo), und wir besprechen es mit Ihnen.",
          },
        ],
      },
      it: {
        title: "Domande frequenti sulle targhe per recensioni Google",
        description:
          "Risposte ai dubbi più comuni sulle targhe per recensioni Google: compatibilità dei telefoni, regole di Google, cambi di link, pulizia e sostituzioni.",
        blocks: [
          { type: "h2", id: "questions", text: "Domande frequenti" },
          {
            type: "faq",
            items: [
              {
                q: "I clienti devono installare un'app?",
                a: "No. La lettura con un tocco è integrata nella maggior parte dei telefoni recenti e il QR code funziona con la fotocamera. Il modulo di recensione si apre nel browser o nell'app Google Maps.",
              },
              {
                q: "Funziona su tutti gli iPhone?",
                a: "Dall'iPhone XS in poi la lettura è automatica con lo schermo sbloccato. Su iPhone 7, 8 e X serve il pulsante del lettore di tag nel Centro di Controllo. Sui modelli più vecchi, usate il QR code.",
              },
              {
                q: "Steevanz è collegata a Google?",
                a: "No. Steevanz è un'azienda indipendente. Le targhe portano semplicemente i clienti al modulo pubblico di recensione del vostro Profilo dell'attività su Google.",
              },
              {
                q: "Posso offrire uno sconto ai clienti che lasciano una recensione?",
                a: "No. Le norme di Google vietano gli incentivi in cambio di recensioni, anche sincere. Chiedetela a tutti i clienti, senza nulla in cambio.",
              },
              {
                q: "Posso chiederla solo ai clienti soddisfatti?",
                a: "Non dovreste. Chiedere in modo selettivo (review gating) viola le regole di Google. Chiedete a tutti; qualche critica occasionale rende il vostro profilo più credibile.",
              },
              {
                q: "Qualcuno può riprogrammare la mia targa?",
                a: "No. Blocchiamo ogni chip dopo averlo programmato, quindi non può essere riscritto con app di programmazione dei chip.",
              },
              {
                q: "Se mi trasferisco o cambio profilo, servono targhe nuove?",
                a: "No. Il chip punta a un reindirizzamento gestito da Steevanz. Basta inviarci il nuovo link e aggiorniamo tutte le targhe. Vedete la pagina [configurazione](/it/docs/google-review-plates/configuration).",
              },
              {
                q: "Posso mettere una targa su una superficie metallica?",
                a: "Sì, ma serve la versione con chip anti-metallo. Una targa normale su metallo potrebbe non essere letta. Diteci dove andrà quando ordinate.",
              },
              {
                q: "Come pulisco le targhe?",
                a: "Con un panno in microfibra e acqua con detergente neutro. Evitate alcol, candeggina e prodotti abrasivi, che graffiano l'acrilico.",
              },
              {
                q: "E se una targa si rompe?",
                a: "Inviateci una foto dalla nostra [pagina contatti](/it/contact) o su WhatsApp e ci occupiamo della sostituzione.",
              },
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Non avete trovato la risposta? [Prenotate una demo](/it/book-a-demo) e ne parliamo insieme.",
          },
        ],
      },
    },
  },
};

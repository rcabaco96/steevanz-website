import type { ProductDocs } from "../types";

export const docs: ProductDocs = {
  productId: "google-review-plates",
  pages: {
    "getting-started": {
      pt: {
        title: "Primeiros passos com as placas para avaliações",
        description:
          "Saiba como funcionam as placas para avaliações no Google, no Tripadvisor e na Booking.com, o que recebe da Steevanz e o que precisa de preparar antes de começar.",
        blocks: [
          {
            type: "p",
            text: "As placas para avaliações levam os seus clientes, em poucos segundos, à página certa para avaliar o seu negócio: basta aproximar o telemóvel da placa, ou apontar a câmara para o código QR impresso. Cada placa abre um destino, à sua escolha: o Google, o Tripadvisor ou a Booking.com. Sem pesquisas, sem procurar o nome da loja, sem passos intermédios.",
          },
          {
            type: "p",
            text: "Este é um serviço gerido: a Steevanz trata da configuração, da gravação dos chips e dos testes. Esta documentação explica como tudo funciona e como tirar o máximo partido das placas no dia a dia.",
          },
          { type: "h2", id: "como-funciona", text: "Como funciona" },
          {
            type: "p",
            text: "Cada placa tem um chip (do tipo **NTAG213** ou **NTAG215**) escondido no interior e um código QR impresso na frente. O chip e o QR apontam para um endereço curto gerido pela Steevanz, que por sua vez redireciona o cliente para o destino dessa placa. No Google, por exemplo, é o formulário de avaliação do seu Perfil da Empresa.",
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
          { type: "h2", id: "plataformas", text: "Google, Tripadvisor ou Booking.com" },
          {
            type: "p",
            text: "Escolhe o destino de cada placa na encomenda. Uma placa abre sempre um único destino: se quer avaliações em duas plataformas, usa duas placas.",
          },
          {
            type: "table",
            head: ["Plataforma", "O que a placa abre", "Quem pode avaliar"],
            rows: [
              ["Google", "O formulário de avaliação do seu Perfil da Empresa", "Qualquer cliente com conta Google"],
              ["Tripadvisor", "A página de avaliação do seu negócio no Tripadvisor", "Qualquer cliente com conta Tripadvisor"],
              ["Booking.com", "A página do seu alojamento na Booking.com", "Só hóspedes que reservaram pela Booking, pelo convite que a Booking envia por email depois do check-out"],
            ],
          },
          {
            type: "callout",
            tone: "warning",
            title: "A Booking.com funciona de outra forma",
            text: "A Booking.com não tem um link de avaliação aberto a todos. Por isso, a placa da Booking não deixa ninguém avaliar diretamente: abre a página do alojamento e lembra o hóspede de usar o email de avaliação que a Booking lhe envia depois do check-out. Nunca diga a um hóspede que reservou por outro canal que pode avaliar na Booking.com.",
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
              "Para cada destino, a página do negócio ativa: um **Perfil da Empresa no Google** verificado, a página no Tripadvisor ou a página do alojamento na Booking.com.",
              "Acesso a esse perfil como proprietário ou gestor, ou disponibilidade para nos enviar o link de avaliação.",
              "Uma ideia dos locais onde quer colocar as placas, para escolhermos os formatos certos.",
            ],
          },
          {
            type: "p",
            text: "Se usar o Google e o perfil ainda não estiver verificado, trate disso primeiro: sem um perfil ativo, o Google não mostra o formulário de avaliação. Podemos orientá-lo no processo durante a [demonstração gratuita](/agendar).",
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
            text: "A Steevanz não tem qualquer afiliação com a Google, o Tripadvisor ou a Booking.com. As placas apenas encaminham os seus clientes para as páginas públicas do seu negócio nessas plataformas.",
          },
        ],
      },
      en: {
        title: "Getting started with review plates",
        description:
          "Learn how review plates for Google, Tripadvisor and Booking.com work, what Steevanz delivers and what you need to prepare before you start.",
        blocks: [
          {
            type: "p",
            text: "Review plates take your customers to the right page to review your business in seconds: they tap their phone on the plate, or point the camera at the printed QR code. Each plate opens one destination of your choice: Google, Tripadvisor or Booking.com. No searching, no hunting for your shop, no extra steps.",
          },
          {
            type: "p",
            text: "This is a managed service: Steevanz handles the setup, writes the chips and tests everything. This documentation explains how it all works and how to get the most out of your plates day to day.",
          },
          { type: "h2", id: "how-it-works", text: "How it works" },
          {
            type: "p",
            text: "Each plate has a chip (**NTAG213** or **NTAG215**) hidden inside and a QR code printed on the front. Both point to a short link managed by Steevanz, which redirects the customer to that plate's destination. On Google, for example, that's the review form of your Google Business Profile.",
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
          { type: "h2", id: "platforms", text: "Google, Tripadvisor or Booking.com" },
          {
            type: "p",
            text: "You choose each plate's destination when you order. A plate always opens a single destination: if you want reviews on two platforms, you use two plates.",
          },
          {
            type: "table",
            head: ["Platform", "What the plate opens", "Who can review"],
            rows: [
              ["Google", "The review form of your Business Profile", "Any customer with a Google account"],
              ["Tripadvisor", "Your business's review page on Tripadvisor", "Any customer with a Tripadvisor account"],
              ["Booking.com", "Your property's page on Booking.com", "Only guests who booked through Booking, from the invitation Booking emails after check-out"],
            ],
          },
          {
            type: "callout",
            tone: "warning",
            title: "Booking.com works differently",
            text: "Booking.com has no review link open to everyone. So the Booking plate doesn't let anyone review directly: it opens the property's page and reminds guests to use the review email Booking sends them after check-out. Never tell a guest who booked through another channel that they can review on Booking.com.",
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
              "For each destination, your business's live page: a verified **Google Business Profile**, your Tripadvisor page or your property's page on Booking.com.",
              "Owner or manager access to that profile, or the ability to send us your review link.",
              "A rough idea of where you want the plates, so we can pick the right formats.",
            ],
          },
          {
            type: "p",
            text: "If you use Google and your profile isn't verified yet, sort that out first: without an active profile, Google won't show the review form. We can guide you through it during the [free demo](/en/book-a-demo).",
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
            text: "Steevanz has no affiliation with Google, Tripadvisor or Booking.com. The plates simply send your customers to your business's public pages on those platforms.",
          },
        ],
      },
      es: {
        title: "Primeros pasos con las placas para reseñas",
        description:
          "Descubra cómo funcionan las placas para reseñas en Google, Tripadvisor y Booking.com, qué recibe de Steevanz y qué debe preparar antes de empezar.",
        blocks: [
          {
            type: "p",
            text: "Las placas para reseñas llevan a sus clientes en pocos segundos a la página correcta para valorar su negocio: basta con acercar el móvil a la placa o apuntar la cámara al código QR impreso. Cada placa abre un destino, a su elección: Google, Tripadvisor o Booking.com. Sin búsquedas, sin buscar el nombre de la tienda, sin pasos intermedios.",
          },
          {
            type: "p",
            text: "Es un servicio gestionado: Steevanz se encarga de la configuración, de grabar los chips y de las pruebas. Esta documentación explica cómo funciona todo y cómo sacar el máximo partido a las placas en el día a día.",
          },
          { type: "h2", id: "how-it-works", text: "Cómo funciona" },
          {
            type: "p",
            text: "Cada placa tiene un chip (**NTAG213** o **NTAG215**) escondido en su interior y un código QR impreso en la parte delantera. Ambos apuntan a un enlace corto gestionado por Steevanz, que redirige al cliente al destino de esa placa. En Google, por ejemplo, es el formulario de reseñas de su Perfil de Empresa.",
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
          { type: "h2", id: "platforms", text: "Google, Tripadvisor o Booking.com" },
          {
            type: "p",
            text: "Usted elige el destino de cada placa en el pedido. Una placa abre siempre un único destino: si quiere reseñas en dos plataformas, utiliza dos placas.",
          },
          {
            type: "table",
            head: ["Plataforma", "Qué abre la placa", "Quién puede opinar"],
            rows: [
              ["Google", "El formulario de reseñas de su Perfil de Empresa", "Cualquier cliente con cuenta de Google"],
              ["Tripadvisor", "La página de reseñas de su negocio en Tripadvisor", "Cualquier cliente con cuenta de Tripadvisor"],
              ["Booking.com", "La página de su alojamiento en Booking.com", "Solo huéspedes que reservaron por Booking, desde la invitación que Booking envía por correo tras el check-out"],
            ],
          },
          {
            type: "callout",
            tone: "warning",
            title: "Booking.com funciona de otra manera",
            text: "Booking.com no tiene un enlace de valoración abierto a todos. Por eso, la placa de Booking no permite valorar directamente a nadie: abre la página del alojamiento y recuerda al huésped que use el correo de valoración que Booking le envía tras el check-out. Nunca diga a un huésped que reservó por otro canal que puede valorar en Booking.com.",
          },
          { type: "h2", id: "available-formats", text: "Formatos disponibles" },
          {
            type: "table",
            head: ["Formato", "Dónde usarlo", "Notas"],
            rows: [
              ["Placa de mostrador en acrílico", "Junto a la caja o la recepción", "El formato más popular, con base estable"],
              ["Expositor de mesa", "Uno por mesa en restaurantes y cafeterías", "Visible durante toda la comida"],
              ["Pegatina", "Cartas, escaparates, espejos, cajas registradoras", "Discreta y económica"],
              ["Placa de pared", "Entrada, sala de espera, pasillo", "Instalar a la altura de los ojos"],
            ],
          },
          { type: "h2", id: "what-you-need", text: "Qué necesita antes de empezar" },
          {
            type: "ul",
            items: [
              "Para cada destino, la página activa del negocio: un **Perfil de Empresa de Google** verificado, su página en Tripadvisor o la página del alojamiento en Booking.com.",
              "Acceso a ese perfil como propietario o administrador, o la posibilidad de enviarnos su enlace de reseñas.",
              "Una idea de dónde quiere colocar las placas, para elegir los formatos adecuados.",
            ],
          },
          {
            type: "p",
            text: "Si usa Google y su perfil todavía no está verificado, resuélvalo primero: sin un perfil activo, Google no muestra el formulario de reseñas. Podemos orientarle en el proceso durante la [demostración gratuita](/es/book-a-demo).",
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
            text: "Steevanz no tiene ninguna afiliación con Google, Tripadvisor ni Booking.com. Las placas solo llevan a sus clientes a las páginas públicas de su negocio en esas plataformas.",
          },
        ],
      },
      fr: {
        title: "Premiers pas avec les plaques pour avis",
        description:
          "Découvrez comment fonctionnent les plaques pour avis sur Google, Tripadvisor et Booking.com, ce que Steevanz vous livre et ce qu'il faut préparer avant de commencer.",
        blocks: [
          {
            type: "p",
            text: "Les plaques pour avis mènent vos clients en quelques secondes vers la bonne page pour évaluer votre établissement : il suffit d'approcher le téléphone de la plaque, ou de pointer l'appareil photo vers le QR code imprimé. Chaque plaque ouvre une destination de votre choix : Google, Tripadvisor ou Booking.com. Pas de recherche, pas besoin de chercher votre commerce, aucune étape intermédiaire.",
          },
          {
            type: "p",
            text: "C'est un service géré : Steevanz s'occupe de la configuration, de la programmation des puces et des tests. Cette documentation explique comment tout fonctionne et comment tirer le meilleur de vos plaques au quotidien.",
          },
          { type: "h2", id: "how-it-works", text: "Comment ça marche" },
          {
            type: "p",
            text: "Chaque plaque contient une puce (**NTAG213** ou **NTAG215**) cachée à l'intérieur et un QR code imprimé sur le devant. Les deux pointent vers un lien court géré par Steevanz, qui redirige le client vers la destination de cette plaque. Sur Google, par exemple, c'est le formulaire d'avis de votre fiche d'établissement.",
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
          { type: "h2", id: "platforms", text: "Google, Tripadvisor ou Booking.com" },
          {
            type: "p",
            text: "Vous choisissez la destination de chaque plaque à la commande. Une plaque ouvre toujours une seule destination : si vous voulez des avis sur deux plateformes, vous utilisez deux plaques.",
          },
          {
            type: "table",
            head: ["Plateforme", "Ce que la plaque ouvre", "Qui peut laisser un avis"],
            rows: [
              ["Google", "Le formulaire d'avis de votre fiche d'établissement", "Tout client ayant un compte Google"],
              ["Tripadvisor", "La page d'avis de votre établissement sur Tripadvisor", "Tout client ayant un compte Tripadvisor"],
              ["Booking.com", "La page de votre hébergement sur Booking.com", "Seulement les voyageurs qui ont réservé via Booking, depuis l'invitation que Booking envoie par e-mail après le départ"],
            ],
          },
          {
            type: "callout",
            tone: "warning",
            title: "Booking.com fonctionne autrement",
            text: "Booking.com n'a pas de lien d'avis ouvert à tous. La plaque Booking ne permet donc à personne de laisser un avis directement : elle ouvre la page de l'hébergement et rappelle au voyageur d'utiliser l'e-mail d'avis que Booking lui envoie après le départ. Ne dites jamais à un voyageur qui a réservé par un autre canal qu'il peut laisser un avis sur Booking.com.",
          },
          { type: "h2", id: "available-formats", text: "Formats disponibles" },
          {
            type: "table",
            head: ["Format", "Où l'utiliser", "Remarques"],
            rows: [
              ["Plaque de comptoir en acrylique", "Près de la caisse ou de l'accueil", "Le format le plus populaire, avec un socle stable"],
              ["Chevalet de table", "Un par table dans les restaurants et cafés", "Visible pendant tout le repas"],
              ["Autocollant", "Menus, vitrines, miroirs, caisses", "Discret et économique"],
              ["Plaque murale", "Entrée, salle d'attente, couloir", "À fixer à hauteur des yeux"],
            ],
          },
          { type: "h2", id: "what-you-need", text: "Ce qu'il vous faut avant de commencer" },
          {
            type: "ul",
            items: [
              "Pour chaque destination, la page active de votre établissement : une **fiche d'établissement Google** validée, votre page Tripadvisor ou la page de l'hébergement sur Booking.com.",
              "Un accès à cette fiche en tant que propriétaire ou gestionnaire, ou la possibilité de nous envoyer votre lien d'avis.",
              "Une idée des endroits où vous voulez placer les plaques, pour choisir les bons formats.",
            ],
          },
          {
            type: "p",
            text: "Si vous utilisez Google et que votre fiche n'est pas encore validée, réglez cela d'abord : sans fiche active, Google n'affiche pas le formulaire d'avis. Nous pouvons vous guider pendant la [démonstration gratuite](/fr/book-a-demo).",
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
            text: "Steevanz n'a aucune affiliation avec Google, Tripadvisor ou Booking.com. Les plaques dirigent simplement vos clients vers les pages publiques de votre établissement sur ces plateformes.",
          },
        ],
      },
      de: {
        title: "Erste Schritte mit den Schildern für Bewertungen",
        description:
          "So funktionieren die Schilder für Bewertungen auf Google, Tripadvisor und Booking.com, das liefert Steevanz und das sollten Sie vor dem Start vorbereiten.",
        blocks: [
          {
            type: "p",
            text: "Die Schilder für Bewertungen bringen Ihre Kunden in wenigen Sekunden auf die richtige Seite, um Ihren Betrieb zu bewerten: einfach das Handy an das Schild halten oder die Kamera auf den aufgedruckten QR-Code richten. Jedes Schild öffnet ein Ziel Ihrer Wahl: Google, Tripadvisor oder Booking.com. Kein Suchen, kein Nachschlagen Ihres Geschäfts, keine Zwischenschritte.",
          },
          {
            type: "p",
            text: "Es ist ein betreuter Service: Steevanz übernimmt die Einrichtung, beschreibt die Chips und testet alles. Diese Dokumentation erklärt, wie alles funktioniert und wie Sie im Alltag das Beste aus Ihren Schildern herausholen.",
          },
          { type: "h2", id: "how-it-works", text: "So funktioniert es" },
          {
            type: "p",
            text: "Jedes Schild hat einen Chip (**NTAG213** oder **NTAG215**) im Inneren und einen QR-Code auf der Vorderseite. Beide zeigen auf einen von Steevanz verwalteten Kurzlink, der den Kunden zum Ziel dieses Schildes weiterleitet. Bei Google ist das zum Beispiel das Bewertungsformular Ihres Google-Unternehmensprofils.",
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
          { type: "h2", id: "platforms", text: "Google, Tripadvisor oder Booking.com" },
          {
            type: "p",
            text: "Sie wählen das Ziel jedes Schildes bei der Bestellung. Ein Schild öffnet immer genau ein Ziel: Wenn Sie Bewertungen auf zwei Plattformen möchten, nutzen Sie zwei Schilder.",
          },
          {
            type: "table",
            head: ["Plattform", "Was das Schild öffnet", "Wer bewerten kann"],
            rows: [
              ["Google", "Das Bewertungsformular Ihres Unternehmensprofils", "Jeder Kunde mit Google-Konto"],
              ["Tripadvisor", "Die Bewertungsseite Ihres Betriebs auf Tripadvisor", "Jeder Kunde mit Tripadvisor-Konto"],
              ["Booking.com", "Die Seite Ihrer Unterkunft auf Booking.com", "Nur Gäste, die über Booking gebucht haben, über die Einladung, die Booking nach dem Check-out per E-Mail schickt"],
            ],
          },
          {
            type: "callout",
            tone: "warning",
            title: "Booking.com funktioniert anders",
            text: "Booking.com hat keinen Bewertungslink, der allen offensteht. Das Booking-Schild lässt deshalb niemanden direkt bewerten: Es öffnet die Seite der Unterkunft und erinnert den Gast an die Bewertungs-E-Mail, die Booking ihm nach dem Check-out schickt. Sagen Sie einem Gast, der über einen anderen Kanal gebucht hat, nie, dass er auf Booking.com bewerten kann.",
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
              "Für jedes Ziel die aktive Seite Ihres Betriebs: ein bestätigtes **Google-Unternehmensprofil**, Ihre Tripadvisor-Seite oder die Seite der Unterkunft auf Booking.com.",
              "Zugriff auf dieses Profil als Inhaber oder Verwalter, oder die Möglichkeit, uns Ihren Bewertungslink zu senden.",
              "Eine Vorstellung davon, wo die Schilder stehen sollen, damit wir die passenden Formate wählen.",
            ],
          },
          {
            type: "p",
            text: "Wenn Sie Google nutzen und Ihr Profil noch nicht bestätigt ist, erledigen Sie das zuerst: Ohne aktives Profil zeigt Google das Bewertungsformular nicht an. Wir können Sie während der [kostenlosen Vorführung](/de/book-a-demo) dabei begleiten.",
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
            text: "Steevanz steht in keiner Verbindung zu Google, Tripadvisor oder Booking.com. Die Schilder leiten Ihre Kunden nur zu den öffentlichen Seiten Ihres Betriebs auf diesen Plattformen weiter.",
          },
        ],
      },
      it: {
        title: "Primi passi con le targhe per recensioni",
        description:
          "Scopra come funzionano le targhe per recensioni su Google, Tripadvisor e Booking.com, cosa riceve da Steevanz e cosa preparare prima di iniziare.",
        blocks: [
          {
            type: "p",
            text: "Le targhe per recensioni portano i Suoi clienti in pochi secondi alla pagina giusta per recensire la Sua attività: basta avvicinare il telefono alla targa, o inquadrare il QR code stampato. Ogni targa apre una destinazione a Sua scelta: Google, Tripadvisor o Booking.com. Senza ricerche, senza cercare il nome del locale, senza passaggi intermedi.",
          },
          {
            type: "p",
            text: "È un servizio gestito: Steevanz si occupa della configurazione, della programmazione dei chip e dei test. Questa documentazione spiega come funziona tutto e come sfruttare al meglio le targhe ogni giorno.",
          },
          { type: "h2", id: "how-it-works", text: "Come funziona" },
          {
            type: "p",
            text: "Ogni targa ha un chip (**NTAG213** o **NTAG215**) nascosto all'interno e un QR code stampato sul fronte. Entrambi puntano a un link breve gestito da Steevanz, che reindirizza il cliente alla destinazione di quella targa. Su Google, per esempio, è il modulo di recensione del Suo Profilo dell'attività.",
          },
          {
            type: "ol",
            items: [
              "Il cliente avvicina il telefono alla targa o inquadra il QR code.",
              "Il telefono apre il link nel browser o nell'app Google Maps.",
              "Compare la finestra di recensione della Sua attività, con le stelle pronte da compilare.",
              "Il cliente sceglie le stelle, scrive un commento (facoltativo) e pubblica.",
            ],
          },
          {
            type: "callout",
            tone: "info",
            title: "Nulla da installare",
            text: "Il cliente non deve installare nessuna app. La lettura con un tocco è integrata nella grande maggioranza dei telefoni recenti, e il QR funziona con la fotocamera di qualsiasi smartphone.",
          },
          { type: "h2", id: "platforms", text: "Google, Tripadvisor o Booking.com" },
          {
            type: "p",
            text: "Sceglie la destinazione di ogni targa al momento dell'ordine. Una targa apre sempre una sola destinazione: se vuole recensioni su due piattaforme, usa due targhe.",
          },
          {
            type: "table",
            head: ["Piattaforma", "Cosa apre la targa", "Chi può recensire"],
            rows: [
              ["Google", "Il modulo di recensione del Suo Profilo dell'attività", "Qualsiasi cliente con un account Google"],
              ["Tripadvisor", "La pagina delle recensioni della Sua attività su Tripadvisor", "Qualsiasi cliente con un account Tripadvisor"],
              ["Booking.com", "La pagina della Sua struttura su Booking.com", "Solo gli ospiti che hanno prenotato tramite Booking, dall'invito che Booking invia via e-mail dopo il check-out"],
            ],
          },
          {
            type: "callout",
            tone: "warning",
            title: "Booking.com funziona in un altro modo",
            text: "Booking.com non ha un link di recensione aperto a tutti. Per questo la targa Booking non permette a nessuno di recensire direttamente: apre la pagina della struttura e ricorda all'ospite di usare l'e-mail di recensione che Booking gli invia dopo il check-out. Non dica mai a un ospite che ha prenotato tramite un altro canale che può recensire su Booking.com.",
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
              "Per ogni destinazione, la pagina attiva della Sua attività: un **Profilo dell'attività su Google** verificato, la Sua pagina su Tripadvisor o la pagina della struttura su Booking.com.",
              "Accesso a quel profilo come proprietario o gestore, oppure la possibilità di inviarci il link per le recensioni.",
              "Un'idea di dove vuole posizionare le targhe, per scegliere i formati giusti.",
            ],
          },
          {
            type: "p",
            text: "Se usa Google e il profilo non è ancora verificato, se ne occupi prima: senza un profilo attivo, Google non mostra il modulo di recensione. Possiamo guidarLa durante la [demo gratuita](/it/book-a-demo).",
          },
          { type: "h2", id: "next-steps", text: "Prossimi passi" },
          {
            type: "ul",
            items: [
              "[Installazione](/it/docs/google-review-plates/setup): come otteniamo il Suo link per le recensioni e dove posizionare ogni targa.",
              "[Configurazione](/it/docs/google-review-plates/configuration): blocco dei chip, reindirizzamento e cambio di destinazione.",
              "[Uso](/it/docs/google-review-plates/usage): come il Suo staff deve chiedere recensioni senza violare le regole di Google.",
              "[Risoluzione dei problemi](/it/docs/google-review-plates/troubleshooting): cosa fare se una targa non risponde.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Steevanz non ha alcuna affiliazione con Google, Tripadvisor o Booking.com. Le targhe portano semplicemente i Suoi clienti alle pagine pubbliche della Sua attività su queste piattaforme.",
          },
        ],
      },
    },
    setup: {
      pt: {
        title: "Instalação das placas para avaliações",
        description:
          "Como obter o link de cada destino (Google, Tripadvisor ou Booking.com), validar o Place ID do Google e escolher o melhor local para cada placa no seu negócio.",
        blocks: [
          {
            type: "p",
            text: "A instalação tem duas partes: obter o link certo para o destino de cada placa (Google, Tripadvisor ou Booking.com) e colocar as placas nos sítios certos. A Steevanz trata da gravação e dos testes; do seu lado, basta confirmar os dados e escolher os locais.",
          },
          { type: "h2", id: "obter-link-avaliacao", text: "Obter o link de avaliação do Google" },
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
          { type: "h2", id: "tripadvisor", text: "Tripadvisor" },
          {
            type: "p",
            text: "Para uma placa do Tripadvisor, envie-nos o link da página do seu negócio no Tripadvisor (abra a página e copie o endereço). Configuramos a placa para abrir a página de avaliação desse negócio. Qualquer cliente pode avaliar, desde que tenha sessão iniciada numa conta Tripadvisor ou a crie no momento.",
          },
          { type: "h2", id: "booking", text: "Booking.com" },
          {
            type: "p",
            text: "Para uma placa da Booking, envie-nos o link da página do seu alojamento na Booking.com. A Booking.com só aceita avaliações de hóspedes que reservaram pela Booking e ficaram alojados: depois do check-out, a Booking envia a cada um, por email, um convite para avaliar. Não existe um link público de avaliação, por isso a placa abre a página do alojamento e o texto impresso lembra o hóspede de usar esse email (por exemplo, «Reservou pela Booking? Avalie-nos no email da Booking»).",
          },
          {
            type: "callout",
            tone: "warning",
            title: "Hóspedes de outros canais",
            text: "Quem reservou diretamente consigo ou por outra plataforma não consegue avaliar na Booking.com. Para esses hóspedes, use uma placa do Google ou do Tripadvisor.",
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
        title: "Setting up your review plates",
        description:
          "How to get the link for each destination (Google, Tripadvisor or Booking.com), check the Google Place ID and choose the best spot for each plate in your premises.",
        blocks: [
          {
            type: "p",
            text: "Setup has two parts: getting the right link for each plate's destination (Google, Tripadvisor or Booking.com) and putting the plates in the right places. Steevanz writes and tests the chips; on your side, you just confirm the details and choose the spots.",
          },
          { type: "h2", id: "get-review-link", text: "Getting your Google review link" },
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
          { type: "h2", id: "tripadvisor", text: "Tripadvisor" },
          {
            type: "p",
            text: "For a Tripadvisor plate, send us the link to your business's Tripadvisor page (open the page and copy the address). We set the plate to open that business's review page. Any customer can review, as long as they're signed in to a Tripadvisor account or create one there and then.",
          },
          { type: "h2", id: "booking", text: "Booking.com" },
          {
            type: "p",
            text: "For a Booking plate, send us the link to your property's page on Booking.com. Booking.com only accepts reviews from guests who booked through Booking and stayed: after check-out, Booking emails each of them an invitation to review. There's no public review link, so the plate opens the property's page and the printed text reminds guests to use that email (for example, “Booked on Booking? Review us from Booking's email”).",
          },
          {
            type: "callout",
            tone: "warning",
            title: "Guests from other channels",
            text: "Guests who booked directly with you or through another platform can't review on Booking.com. For them, use a Google or Tripadvisor plate.",
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
        title: "Instalación de las placas para reseñas",
        description:
          "Cómo obtener el enlace de cada destino (Google, Tripadvisor o Booking.com), comprobar el Place ID de Google y elegir el mejor sitio para cada placa en su local.",
        blocks: [
          {
            type: "p",
            text: "La instalación tiene dos partes: obtener el enlace correcto para el destino de cada placa (Google, Tripadvisor o Booking.com) y colocar las placas en los sitios adecuados. Steevanz se encarga de grabar y probar los chips; por su parte, solo tiene que confirmar los datos y elegir los lugares.",
          },
          { type: "h2", id: "get-review-link", text: "Obtener el enlace de reseñas de Google" },
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
          { type: "h2", id: "tripadvisor", text: "Tripadvisor" },
          {
            type: "p",
            text: "Para una placa de Tripadvisor, envíenos el enlace de la página de su negocio en Tripadvisor (abra la página y copie la dirección). Configuramos la placa para que abra la página de reseñas de ese negocio. Cualquier cliente puede opinar, siempre que haya iniciado sesión en una cuenta de Tripadvisor o la cree en ese momento.",
          },
          { type: "h2", id: "booking", text: "Booking.com" },
          {
            type: "p",
            text: "Para una placa de Booking, envíenos el enlace de la página de su alojamiento en Booking.com. Booking.com solo acepta valoraciones de huéspedes que reservaron por Booking y se alojaron: tras el check-out, Booking envía a cada uno, por correo electrónico, una invitación para valorar. No existe un enlace público de valoración, así que la placa abre la página del alojamiento y el texto impreso recuerda al huésped que use ese correo (por ejemplo, «¿Reservó por Booking? Valórenos desde el correo de Booking»).",
          },
          {
            type: "callout",
            tone: "warning",
            title: "Huéspedes de otros canales",
            text: "Quien reservó directamente con usted o por otra plataforma no puede valorar en Booking.com. Para esos huéspedes, use una placa de Google o de Tripadvisor.",
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
        title: "Installation des plaques pour avis",
        description:
          "Comment obtenir le lien de chaque destination (Google, Tripadvisor ou Booking.com), vérifier le Place ID Google et choisir le meilleur emplacement pour chaque plaque.",
        blocks: [
          {
            type: "p",
            text: "L'installation comporte deux parties : obtenir le bon lien pour la destination de chaque plaque (Google, Tripadvisor ou Booking.com) et placer les plaques aux bons endroits. Steevanz programme et teste les puces ; de votre côté, il suffit de confirmer les informations et de choisir les emplacements.",
          },
          { type: "h2", id: "get-review-link", text: "Obtenir votre lien d'avis Google" },
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
          { type: "h2", id: "tripadvisor", text: "Tripadvisor" },
          {
            type: "p",
            text: "Pour une plaque Tripadvisor, envoyez-nous le lien de la page de votre établissement sur Tripadvisor (ouvrez la page et copiez l'adresse). Nous configurons la plaque pour qu'elle ouvre la page d'avis de cet établissement. Tout client peut laisser un avis, à condition d'être connecté à un compte Tripadvisor ou d'en créer un sur le moment.",
          },
          { type: "h2", id: "booking", text: "Booking.com" },
          {
            type: "p",
            text: "Pour une plaque Booking, envoyez-nous le lien de la page de votre hébergement sur Booking.com. Booking.com n'accepte que les avis des voyageurs qui ont réservé via Booking et séjourné chez vous : après le départ, Booking envoie à chacun, par e-mail, une invitation à laisser un avis. Il n'existe pas de lien d'avis public : la plaque ouvre donc la page de l'hébergement et le texte imprimé rappelle au voyageur d'utiliser cet e-mail (par exemple, « Réservé via Booking ? Donnez votre avis depuis l'e-mail de Booking »).",
          },
          {
            type: "callout",
            tone: "warning",
            title: "Voyageurs venus par d'autres canaux",
            text: "Ceux qui ont réservé directement auprès de vous ou via une autre plateforme ne peuvent pas laisser d'avis sur Booking.com. Pour eux, utilisez une plaque Google ou Tripadvisor.",
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
        title: "Einrichtung der Schilder für Bewertungen",
        description:
          "Wie Sie den Link für jedes Ziel (Google, Tripadvisor oder Booking.com) erhalten, die Google Place ID prüfen und für jedes Schild den besten Platz wählen.",
        blocks: [
          {
            type: "p",
            text: "Die Einrichtung hat zwei Teile: den richtigen Link für das Ziel jedes Schildes besorgen (Google, Tripadvisor oder Booking.com) und die Schilder an die richtigen Stellen bringen. Steevanz beschreibt und testet die Chips; Sie bestätigen nur die Angaben und wählen die Plätze.",
          },
          { type: "h2", id: "get-review-link", text: "Den Google-Bewertungslink erhalten" },
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
          { type: "h2", id: "tripadvisor", text: "Tripadvisor" },
          {
            type: "p",
            text: "Für ein Tripadvisor-Schild schicken Sie uns den Link zur Seite Ihres Betriebs auf Tripadvisor (Seite öffnen und Adresse kopieren). Wir richten das Schild so ein, dass es die Bewertungsseite dieses Betriebs öffnet. Jeder Kunde kann bewerten, sofern er in einem Tripadvisor-Konto angemeldet ist oder gleich eines anlegt.",
          },
          { type: "h2", id: "booking", text: "Booking.com" },
          {
            type: "p",
            text: "Für ein Booking-Schild schicken Sie uns den Link zur Seite Ihrer Unterkunft auf Booking.com. Booking.com nimmt nur Bewertungen von Gästen an, die über Booking gebucht und bei Ihnen übernachtet haben: Nach dem Check-out schickt Booking jedem von ihnen per E-Mail eine Einladung zur Bewertung. Einen öffentlichen Bewertungslink gibt es nicht, deshalb öffnet das Schild die Seite der Unterkunft und der aufgedruckte Text erinnert den Gast an diese E-Mail (zum Beispiel «Über Booking gebucht? Bewerten Sie uns in der E-Mail von Booking»).",
          },
          {
            type: "callout",
            tone: "warning",
            title: "Gäste aus anderen Kanälen",
            text: "Wer direkt bei Ihnen oder über eine andere Plattform gebucht hat, kann auf Booking.com nicht bewerten. Für diese Gäste nutzen Sie ein Google- oder Tripadvisor-Schild.",
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
        title: "Installazione delle targhe per recensioni",
        description:
          "Come ottenere il link di ogni destinazione (Google, Tripadvisor o Booking.com), verificare il Place ID di Google e scegliere il posto migliore per ogni targa.",
        blocks: [
          {
            type: "p",
            text: "L'installazione ha due parti: ottenere il link giusto per la destinazione di ogni targa (Google, Tripadvisor o Booking.com) e posizionare le targhe nei punti giusti. Steevanz si occupa della programmazione e dei test; da parte Sua, basta confermare i dati e scegliere i posti.",
          },
          { type: "h2", id: "get-review-link", text: "Ottenere il link per le recensioni Google" },
          {
            type: "p",
            text: "Ci sono due modi affidabili per ottenere il link. Può inviarci l'uno o l'altro, oppure darci semplicemente l'accesso da gestore al Suo profilo e pensiamo noi al resto.",
          },
          {
            type: "steps",
            items: [
              {
                title: "Aprire il Profilo dell'attività",
                body: "Acceda con l'account Google che gestisce l'attività e cerchi il nome dell'attività su Google o Google Maps. Il pannello di gestione del profilo compare in cima ai risultati.",
              },
              {
                title: "Scegliere «Chiedi recensioni»",
                body: "Nel pannello del profilo, faccia clic su **Chiedi recensioni**. Google mostra una finestra con un link breve da condividere.",
              },
              {
                title: "Copiare il link",
                body: "Copi il link mostrato. Di solito ha la forma `g.page/r/.../review`. Lo invii a Steevanz via WhatsApp o email.",
              },
              {
                title: "Verificarlo con un test",
                body: "Apra il link su un telefono collegato a un account Google personale. Deve aprire direttamente la finestra di recensione della Sua attività.",
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
            text: "Ogni attività su Google Maps ha un identificatore unico chiamato **Place ID**. Può trovarlo con lo strumento pubblico Place ID Finder di Google, cercando il nome e l'indirizzo della Sua attività. Con quell'identificatore, il link per le recensioni è così:",
          },
          {
            type: "code",
            label: "Link per le recensioni con Place ID",
            code: "https://search.google.com/local/writereview?placeid=PLACE_ID",
          },
          {
            type: "callout",
            tone: "warning",
            title: "Verifichi che sia l'attività giusta",
            text: "Se ci sono schede duplicate o un locale con un nome simile nella stessa via, è facile copiare il Place ID sbagliato. Verifichi sempre che la finestra di recensione mostri il nome e l'indirizzo corretti.",
          },
          { type: "h2", id: "tripadvisor", text: "Tripadvisor" },
          {
            type: "p",
            text: "Per una targa Tripadvisor, ci invii il link della pagina della Sua attività su Tripadvisor (apra la pagina e copi l'indirizzo). Configuriamo la targa perché apra la pagina delle recensioni di quell'attività. Qualsiasi cliente può recensire, purché abbia effettuato l'accesso a un account Tripadvisor o ne crei uno sul momento.",
          },
          { type: "h2", id: "booking", text: "Booking.com" },
          {
            type: "p",
            text: "Per una targa Booking, ci invii il link della pagina della Sua struttura su Booking.com. Booking.com accetta solo recensioni di ospiti che hanno prenotato tramite Booking e soggiornato da Lei: dopo il check-out, Booking invia a ciascuno, via e-mail, un invito a lasciare una recensione. Non esiste un link pubblico di recensione, quindi la targa apre la pagina della struttura e il testo stampato ricorda all'ospite di usare quell'e-mail (per esempio, «Ha prenotato con Booking? Ci recensisca dall'e-mail di Booking»).",
          },
          {
            type: "callout",
            tone: "warning",
            title: "Ospiti da altri canali",
            text: "Chi ha prenotato direttamente con Lei o tramite un'altra piattaforma non può recensire su Booking.com. Per questi ospiti, usi una targa Google o Tripadvisor.",
          },
          { type: "h2", id: "choose-placement", text: "Scegliere dove va ogni targa" },
          {
            type: "p",
            text: "La regola d'oro è semplice: metta la targa dove il cliente ha già il telefono in mano e qualche secondo libero.",
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
            text: "Il metallo blocca il segnale del chip. Se deve applicare una targa o un adesivo su metallo (un banco in acciaio inox, un frigorifero, una porta metallica), ci chieda la versione con **chip anti-metallo**, che ha uno strato isolante in ferrite.",
          },
          { type: "h2", id: "test-installation", text: "Testare dopo l'installazione" },
          {
            type: "p",
            text: "Quando ogni targa è nella sua posizione definitiva, la testi con almeno un iPhone e un Android. Avvicini il telefono lentamente, con lo schermo sbloccato, e verifichi che si apra la finestra di recensione giusta. Testi anche il QR code con la fotocamera. Se qualcosa non va, consulti la pagina [risoluzione dei problemi](/it/docs/google-review-plates/troubleshooting).",
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
              "Mesmo assim, o destino final pode ser alterado, porque o chip aponta para o nosso redirecionamento e não diretamente para o Google, o Tripadvisor ou a Booking.com.",
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
            text: "O chip e o código QR apontam para um link curto da Steevanz. Quando alguém toca na placa, o nosso servidor encaminha-o de imediato para o destino dessa placa: o Google, o Tripadvisor ou a Booking.com. O cliente não nota diferença: o encaminhamento demora uma fração de segundo.",
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
            text: "Se tem mais do que um estabelecimento, cada loja tem o seu próprio perfil e, por isso, o seu próprio link. Identificamos as placas por loja para que nunca haja trocas: as avaliações do Porto não vão parar ao perfil de Lisboa. O mesmo vale para as plataformas: cada placa abre um único destino, e uma placa do Google e outra do Tripadvisor são duas placas diferentes.",
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
              "Even so, the final destination can be changed, because the chip points to our redirect and not directly to Google, Tripadvisor or Booking.com.",
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
            text: "The chip and the QR code point to a short Steevanz link. When someone taps the plate, our server instantly forwards them to that plate's destination: Google, Tripadvisor or Booking.com. Customers don't notice a thing: the redirect takes a fraction of a second.",
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
            text: "If you have more than one location, each one has its own profile and therefore its own link. We label plates by location so nothing gets mixed up: reviews for Porto never end up on the Lisbon profile. The same goes for platforms: each plate opens a single destination, so a Google plate and a Tripadvisor plate are two different plates.",
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
              "Aun así, el destino final se puede cambiar, porque el chip apunta a nuestra redirección y no directamente a Google, Tripadvisor o Booking.com.",
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
            text: "El chip y el código QR apuntan a un enlace corto de Steevanz. Cuando alguien toca la placa, nuestro servidor lo lleva al instante al destino de esa placa: Google, Tripadvisor o Booking.com. El cliente no nota la diferencia: la redirección tarda una fracción de segundo.",
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
            text: "Si tiene más de un local, cada uno tiene su propio perfil y, por tanto, su propio enlace. Identificamos las placas por local para que nunca haya confusiones: las reseñas de Oporto no acaban en el perfil de Lisboa. Lo mismo vale para las plataformas: cada placa abre un único destino, así que una placa de Google y otra de Tripadvisor son dos placas distintas.",
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
              "Malgré tout, la destination finale peut être modifiée, car la puce pointe vers notre redirection et non directement vers Google, Tripadvisor ou Booking.com.",
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
            text: "La puce et le QR code pointent vers un lien court Steevanz. Quand quelqu'un touche la plaque, notre serveur le redirige aussitôt vers la destination de cette plaque : Google, Tripadvisor ou Booking.com. Le client ne remarque rien : la redirection prend une fraction de seconde.",
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
            text: "Si vous avez plusieurs établissements, chacun a sa propre fiche et donc son propre lien. Nous identifions les plaques par établissement pour éviter toute confusion : les avis de Porto n'atterrissent jamais sur la fiche de Lisbonne. Il en va de même pour les plateformes : chaque plaque ouvre une seule destination, donc une plaque Google et une plaque Tripadvisor sont deux plaques différentes.",
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
              "Trotzdem lässt sich das endgültige Ziel ändern, weil der Chip auf unsere Weiterleitung zeigt und nicht direkt auf Google, Tripadvisor oder Booking.com.",
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
            text: "Chip und QR-Code zeigen auf einen Kurzlink von Steevanz. Wenn jemand das Schild antippt, leitet unser Server ihn sofort zum Ziel dieses Schildes weiter: Google, Tripadvisor oder Booking.com. Der Kunde merkt davon nichts: Die Weiterleitung dauert einen Sekundenbruchteil.",
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
            text: "Wenn Sie mehr als einen Standort haben, hat jeder sein eigenes Profil und damit seinen eigenen Link. Wir kennzeichnen die Schilder nach Standort, damit nichts vertauscht wird: Bewertungen für Porto landen nie im Profil von Lissabon. Dasselbe gilt für die Plattformen: Jedes Schild öffnet genau ein Ziel, ein Google-Schild und ein Tripadvisor-Schild sind also zwei verschiedene Schilder.",
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
          "Come Steevanz programma e blocca i Suoi chip, perché usiamo un link di reindirizzamento e come cambiare la destinazione delle targhe senza doverle ristampare.",
        blocks: [
          {
            type: "p",
            text: "Ogni targa esce da noi completamente configurata. Questa pagina spiega cosa facciamo dietro le quinte e cosa può chiederci di cambiare in seguito.",
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
              "Comunque, la destinazione finale si può cambiare, perché il chip punta al nostro reindirizzamento e non direttamente a Google, Tripadvisor o Booking.com.",
            ],
          },
          {
            type: "callout",
            tone: "info",
            title: "Perché è importante",
            text: "Un chip non bloccato in un luogo pubblico può essere riprogrammato da chiunque con un telefono Android e un'app gratuita, mandando i Suoi clienti altrove. Per questo non consegniamo mai targhe non bloccate.",
          },
          { type: "h2", id: "dynamic-redirect", text: "Reindirizzamento dinamico" },
          {
            type: "p",
            text: "Il chip e il QR code puntano a un link breve di Steevanz. Quando qualcuno tocca la targa, il nostro server lo porta subito alla destinazione di quella targa: Google, Tripadvisor o Booking.com. Il cliente non nota nulla: il reindirizzamento richiede una frazione di secondo.",
          },
          {
            type: "p",
            text: "Questo sistema ha tre vantaggi pratici: può cambiare la destinazione senza sostituire le targhe, possiamo risolvere i problemi rapidamente e possiamo contare quante volte è stata usata ogni targa.",
          },
          { type: "h2", id: "change-destination", text: "Cambiare la destinazione delle targhe" },
          {
            type: "p",
            text: "A volte il Suo link per le recensioni cambia: un trasferimento a un nuovo indirizzo, l'unione di schede duplicate, un nuovo profilo dopo una sospensione, o semplicemente la scelta di far puntare una targa a un'altra sede.",
          },
          {
            type: "steps",
            items: [
              {
                title: "Ottenere il nuovo link",
                body: "Segua i passi della pagina [installazione](/it/docs/google-review-plates/setup) per ottenere il nuovo link per le recensioni.",
              },
              {
                title: "Inviarci la richiesta",
                body: "Invii il nuovo link via WhatsApp o email, indicando quali targhe vanno aggiornate (tutte, o solo quelle di una certa sede).",
              },
              {
                title: "Confermare con un test",
                body: "Aggiorniamo il reindirizzamento e La avvisiamo quando è attivo. Tocchi una targa per verificarlo.",
              },
            ],
          },
          { type: "h2", id: "multiple-locations", text: "Più sedi o profili" },
          {
            type: "p",
            text: "Se ha più di una sede, ognuna ha il proprio profilo e quindi il proprio link. Identifichiamo le targhe per sede, così non ci sono scambi: le recensioni di Porto non finiscono mai sul profilo di Lisbona. Lo stesso vale per le piattaforme: ogni targa apre una sola destinazione, quindi una targa Google e una Tripadvisor sono due targhe diverse.",
          },
          {
            type: "callout",
            tone: "tip",
            text: "Se sposta targhe da una sede all'altra, ci avvisi prima. Basta un breve messaggio perché aggiorniamo la destinazione.",
          },
        ],
      },
    },
    usage: {
      pt: {
        title: "Utilização: como pedir avaliações todos os dias",
        description:
          "Guia prático para a sua equipa pedir avaliações com as placas, respeitando as regras do Google, do Tripadvisor e da Booking.com, e manter as placas limpas e funcionais.",
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
          { type: "h2", id: "regras-google", text: "Regras das plataformas que tem de cumprir" },
          {
            type: "p",
            text: "O Google, o Tripadvisor e a Booking.com têm políticas claras sobre avaliações. Ignorá-las pode levar à remoção de avaliações ou a restrições na sua página.",
          },
          {
            type: "ul",
            items: [
              "**Não ofereça incentivos**: descontos, ofertas, sorteios ou brindes em troca de avaliações são proibidos, mesmo que peça uma avaliação \"honesta\".",
              "**Não faça seleção de avaliações** (review gating): peça a todos os clientes, não apenas aos que parecem satisfeitos.",
              "**Não escreva avaliações** em nome de clientes nem peça à equipa ou à família para avaliar.",
              "**Não pressione**: o pedido deve ser simpático e opcional.",
              "**Booking.com**: só quem reservou pela Booking pode avaliar, pelo email que a Booking envia depois do check-out. Não diga a outros hóspedes que podem avaliar lá.",
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
              ["Alojamento", "No check-out, ao despedir-se do hóspede"],
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
            text: "Compare o número de avaliações de cada plataforma mês a mês. Se tiver também o serviço de [gestão de reviews com IA](/produtos/gestao-reviews-ia), as respostas às novas avaliações do Google ficam tratadas automaticamente, com a sua aprovação.",
          },
        ],
      },
      en: {
        title: "Usage: asking for reviews every day",
        description:
          "A practical guide for your team to ask for reviews with your plates while following the rules of Google, Tripadvisor and Booking.com, and to keep your plates clean and working.",
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
          { type: "h2", id: "google-rules", text: "Platform rules you must follow" },
          {
            type: "p",
            text: "Google, Tripadvisor and Booking.com have clear policies on reviews. Ignoring them can lead to reviews being removed or restrictions on your page.",
          },
          {
            type: "ul",
            items: [
              "**Don't offer incentives**: discounts, freebies, prize draws or gifts in exchange for reviews are forbidden, even if you ask for an \"honest\" review.",
              "**Don't gate reviews**: ask every customer, not just the ones who seem happy.",
              "**Don't write reviews** on behalf of customers or ask staff or family to review you.",
              "**Don't pressure people**: the request should be friendly and optional.",
              "**Booking.com**: only guests who booked through Booking can review, from the email Booking sends after check-out. Don't tell other guests they can review there.",
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
              ["Accommodation", "At check-out, when saying goodbye to the guest"],
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
            text: "Compare the number of reviews on each platform month by month. If you also use our [AI review management](/en/products/ai-review-management) service, replies to new Google reviews are handled automatically, with your approval.",
          },
        ],
      },
      es: {
        title: "Uso: pedir reseñas cada día",
        description:
          "Guía práctica para que su equipo pida reseñas con las placas respetando las normas de Google, Tripadvisor y Booking.com, y para mantener las placas limpias y en buen estado.",
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
          { type: "h2", id: "google-rules", text: "Normas de las plataformas que debe cumplir" },
          {
            type: "p",
            text: "Google, Tripadvisor y Booking.com tienen políticas claras sobre las reseñas. Ignorarlas puede llevar a la eliminación de reseñas o a restricciones en su página.",
          },
          {
            type: "ul",
            items: [
              "**No ofrezca incentivos**: descuentos, regalos, sorteos u obsequios a cambio de reseñas están prohibidos, aunque pida una reseña «sincera».",
              "**No filtre las reseñas**: pídala a todos los clientes, no solo a los que parecen satisfechos.",
              "**No escriba reseñas** en nombre de los clientes ni pida a empleados o familiares que le valoren.",
              "**No presione**: la petición debe ser amable y opcional.",
              "**Booking.com**: solo quien reservó por Booking puede valorar, desde el correo que Booking envía tras el check-out. No diga a otros huéspedes que pueden valorar allí.",
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
              ["Alojamiento", "En el check-out, al despedirse del huésped"],
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
            text: "Compare el número de reseñas de cada plataforma mes a mes. Si además usa nuestro servicio de [gestión de reseñas con IA](/es/products/ai-review-management), las respuestas a las nuevas reseñas de Google se gestionan automáticamente, con su aprobación.",
          },
        ],
      },
      fr: {
        title: "Utilisation : demander des avis chaque jour",
        description:
          "Un guide pratique pour que votre équipe demande des avis avec vos plaques en respectant les règles de Google, Tripadvisor et Booking.com, et pour garder vos plaques propres et en état de marche.",
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
          { type: "h2", id: "google-rules", text: "Les règles des plateformes à respecter" },
          {
            type: "p",
            text: "Google, Tripadvisor et Booking.com ont des règles claires sur les avis. Les ignorer peut entraîner la suppression d'avis ou des restrictions sur votre page.",
          },
          {
            type: "ul",
            items: [
              "**N'offrez pas de contrepartie** : réductions, cadeaux, tirages au sort ou offres en échange d'avis sont interdits, même si vous demandez un avis «sincère».",
              "**Ne filtrez pas les avis** : demandez à tous les clients, pas seulement à ceux qui semblent satisfaits.",
              "**N'écrivez pas d'avis** à la place des clients et ne demandez pas à vos employés ou à votre famille de vous noter.",
              "**Ne faites pas pression** : la demande doit rester aimable et facultative.",
              "**Booking.com** : seuls les voyageurs qui ont réservé via Booking peuvent laisser un avis, depuis l'e-mail que Booking envoie après le départ. Ne dites pas aux autres voyageurs qu'ils peuvent en laisser un.",
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
              ["Hébergement", "Au départ, en disant au revoir au voyageur"],
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
            text: "Comparez le nombre d'avis sur chaque plateforme mois après mois. Si vous utilisez aussi notre service de [gestion des avis avec l'IA](/fr/products/ai-review-management), les réponses aux nouveaux avis Google sont gérées automatiquement, avec votre validation.",
          },
        ],
      },
      de: {
        title: "Nutzung: täglich um Bewertungen bitten",
        description:
          "Ein praktischer Leitfaden, wie Ihr Team mit den Schildern um Bewertungen bittet und dabei die Regeln von Google, Tripadvisor und Booking.com einhält, und wie Sie die Schilder sauber und funktionsfähig halten.",
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
          { type: "h2", id: "google-rules", text: "Regeln der Plattformen, die Sie einhalten müssen" },
          {
            type: "p",
            text: "Google, Tripadvisor und Booking.com haben klare Richtlinien für Bewertungen. Wer sie ignoriert, riskiert gelöschte Bewertungen oder Einschränkungen auf seiner Seite.",
          },
          {
            type: "ul",
            items: [
              "**Keine Anreize bieten**: Rabatte, Gratisartikel, Verlosungen oder Geschenke im Austausch für Bewertungen sind verboten, auch wenn Sie um eine «ehrliche» Bewertung bitten.",
              "**Bewertungen nicht filtern**: Fragen Sie jeden Kunden, nicht nur die, die zufrieden wirken.",
              "**Keine Bewertungen schreiben** im Namen von Kunden und keine Mitarbeiter oder Familienmitglieder um Bewertungen bitten.",
              "**Keinen Druck ausüben**: Die Bitte soll freundlich und freiwillig sein.",
              "**Booking.com**: Nur Gäste, die über Booking gebucht haben, können bewerten, über die E-Mail, die Booking nach dem Check-out schickt. Sagen Sie anderen Gästen nicht, dass sie dort bewerten können.",
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
              ["Unterkunft", "Beim Check-out, wenn Sie den Gast verabschieden"],
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
            text: "Vergleichen Sie die Zahl der Bewertungen auf jeder Plattform Monat für Monat. Nutzen Sie auch unser [KI-Bewertungsmanagement](/de/products/ai-review-management), werden Antworten auf neue Google-Bewertungen automatisch erledigt, mit Ihrer Freigabe.",
          },
        ],
      },
      it: {
        title: "Uso: chiedere recensioni ogni giorno",
        description:
          "Una guida pratica perché il Suo staff chieda recensioni con le targhe rispettando le regole di Google, Tripadvisor e Booking.com, e per mantenere le targhe pulite e funzionanti.",
        blocks: [
          {
            type: "p",
            text: "Una targa sul banco aiuta, ma ciò che fa davvero crescere il numero di recensioni è uno staff che lo chiede a ogni cliente, con naturalezza. Questa pagina raccoglie semplici buone pratiche per tutti i giorni.",
          },
          { type: "h2", id: "staff-script", text: "Una traccia per il Suo staff" },
          {
            type: "p",
            text: "Non c'è nulla da imparare a memoria. Conta chiedere al momento giusto (a fine servizio, al pagamento o all'uscita) e indicare la targa.",
          },
          {
            type: "ul",
            items: [
              "«Se ha un minuto, una recensione su Google ci aiuterebbe molto. Basta avvicinare il telefono a questa targa.»",
              "«La Sua opinione conta. Avvicini il telefono qui, oppure inquadri il codice con la fotocamera.»",
              "«Se il tocco non funziona, inquadri il QR code e si apre subito.»",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Mostri come si fa. Molte persone non hanno mai avvicinato il telefono a una targa; se lo staff lo dimostra con il proprio telefono nella prima settimana, l'uso aumenta in modo evidente.",
          },
          { type: "h2", id: "google-rules", text: "Le regole delle piattaforme da rispettare" },
          {
            type: "p",
            text: "Google, Tripadvisor e Booking.com hanno regole chiare sulle recensioni. Ignorarle può portare alla rimozione di recensioni o a restrizioni sulla Sua pagina.",
          },
          {
            type: "ul",
            items: [
              "**Non offra incentivi**: sconti, omaggi, estrazioni o regali in cambio di recensioni sono vietati, anche se chiede una recensione «sincera».",
              "**Non filtri le recensioni**: la chieda a tutti i clienti, non solo a quelli che sembrano soddisfatti.",
              "**Non scriva recensioni** al posto dei clienti e non chieda a dipendenti o familiari di recensire la Sua attività.",
              "**Non faccia pressione**: la richiesta deve essere cordiale e facoltativa.",
              "**Booking.com**: può recensire solo chi ha prenotato tramite Booking, dall'e-mail che Booking invia dopo il check-out. Non dica agli altri ospiti che possono recensire lì.",
            ],
          },
          {
            type: "callout",
            tone: "warning",
            title: "Le recensioni negative fanno parte del gioco",
            text: "Chiedere a tutti significa ricevere anche qualche critica. È normale e dà credibilità. Risponda con calma e professionalità; un profilo con risposte curate ispira più fiducia di uno perfetto.",
          },
          { type: "h2", id: "best-moments", text: "I momenti migliori per chiedere" },
          {
            type: "table",
            head: ["Tipo di attività", "Momento suggerito"],
            rows: [
              ["Ristorante o bar", "Quando si porta il conto o al pagamento"],
              ["Parrucchiere o centro estetico", "Alla fine, quando il cliente vede il risultato allo specchio"],
              ["Clinica", "In reception, prenotando il prossimo appuntamento"],
              ["Negozio", "Mentre si imbusta l'acquisto alla cassa"],
              ["Struttura ricettiva", "Al check-out, quando saluta l'ospite"],
            ],
          },
          { type: "h2", id: "cleaning-care", text: "Pulizia e manutenzione" },
          {
            type: "ul",
            items: [
              "Pulisca l'acrilico con un panno morbido in microfibra e acqua con un po' di detergente neutro.",
              "Eviti alcol, candeggina, acetone e prodotti abrasivi: graffiano e opacizzano l'acrilico.",
              "Non immerga le targhe in acqua e non le metta in lavastoviglie.",
              "Controlli ogni tanto che il QR code sia ancora nitido e senza graffi.",
            ],
          },
          { type: "h2", id: "track-results", text: "Seguire i risultati" },
          {
            type: "p",
            text: "Confronti il numero di recensioni su ogni piattaforma mese per mese. Se usa anche il nostro servizio di [gestione delle recensioni con IA](/it/products/ai-review-management), le risposte alle nuove recensioni Google sono gestite automaticamente, con la Sua approvazione.",
          },
        ],
      },
    },
    troubleshooting: {
      pt: {
        title: "Resolução de problemas das placas para avaliações",
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
              "**Pede para iniciar sessão**: o Google e o Tripadvisor exigem uma conta para publicar avaliações. É um comportamento normal.",
              "**Mostra outro negócio**: o link ou o Place ID está errado. Contacte-nos para corrigir o redirecionamento.",
              "**Página de erro**: pode ser uma falha momentânea de rede. Se persistir, contacte-nos.",
              "**Na Booking.com não aparece formulário de avaliação**: é normal. A placa da Booking abre a página do alojamento; o hóspede avalia pelo convite que a Booking lhe envia por email depois do check-out.",
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
        title: "Troubleshooting review plates",
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
              "**It asks the customer to sign in**: Google and Tripadvisor require an account to post reviews. This is normal.",
              "**Shows another business**: the link or Place ID is wrong. Contact us and we'll fix the redirect.",
              "**Error page**: it may be a temporary network glitch. If it persists, get in touch.",
              "**No review form on Booking.com**: that's normal. The Booking plate opens the property's page; guests review from the invitation Booking emails them after check-out.",
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
        title: "Solución de problemas de las placas para reseñas",
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
              "**Pide iniciar sesión**: Google y Tripadvisor exigen una cuenta para publicar reseñas. Es un comportamiento normal.",
              "**Muestra otro negocio**: el enlace o el Place ID son incorrectos. Contacte con nosotros y corregimos la redirección.",
              "**Página de error**: puede ser un fallo temporal de la red. Si continúa, contacte con nosotros.",
              "**En Booking.com no aparece un formulario de valoración**: es normal. La placa de Booking abre la página del alojamiento; el huésped valora desde la invitación que Booking le envía por correo tras el check-out.",
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
        title: "Résolution des problèmes des plaques pour avis",
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
              "**Une connexion est demandée** : Google et Tripadvisor exigent un compte pour publier un avis. C'est un comportement normal.",
              "**Affiche un autre commerce** : le lien ou le Place ID est erroné. Contactez-nous et nous corrigeons la redirection.",
              "**Page d'erreur** : il peut s'agir d'un problème réseau passager. Si cela persiste, contactez-nous.",
              "**Pas de formulaire d'avis sur Booking.com** : c'est normal. La plaque Booking ouvre la page de l'hébergement ; le voyageur laisse son avis depuis l'invitation que Booking lui envoie par e-mail après le départ.",
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
        title: "Fehlerbehebung für Bewertungsschilder",
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
              "**Es wird eine Anmeldung verlangt**: Google und Tripadvisor verlangen ein Konto, um Bewertungen zu veröffentlichen. Das ist normal.",
              "**Zeigt ein anderes Geschäft**: Der Link oder die Place ID ist falsch. Kontaktieren Sie uns, und wir korrigieren die Weiterleitung.",
              "**Fehlerseite**: Das kann eine vorübergehende Netzwerkstörung sein. Besteht sie weiter, melden Sie sich.",
              "**Auf Booking.com erscheint kein Bewertungsformular**: Das ist normal. Das Booking-Schild öffnet die Seite der Unterkunft; der Gast bewertet über die Einladung, die Booking ihm nach dem Check-out per E-Mail schickt.",
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
        title: "Risoluzione dei problemi delle targhe per recensioni",
        description:
          "Cosa fare quando una targa non apre la pagina delle recensioni: compatibilità del telefono, cover, superfici metalliche, link cambiati e profili Google sospesi.",
        blocks: [
          {
            type: "p",
            text: "Quasi ogni problema delle targhe ha una causa semplice. Segua questa pagina in ordine prima di contattarci; se il problema persiste, [ci contatti](/it/contact) o ci scriva su WhatsApp.",
          },
          { type: "h2", id: "phone-compatibility", text: "Compatibilità dei telefoni" },
          {
            type: "table",
            head: ["Telefono", "Come leggere la targa"],
            rows: [
              ["iPhone XS e successivi", "Legge automaticamente in background, con lo schermo acceso e sbloccato"],
              ["iPhone 7, 8 e X", "Apra il Centro di Controllo e tocchi il pulsante del lettore di tag (potrebbe essere necessario aggiungerlo prima in Impostazioni)"],
              ["iPhone 6 o precedenti", "Nessuna lettura con un tocco: usi il QR code"],
              ["Android con lettura con un tocco", "Attivi la lettura di prossimità (con un tocco) nelle impostazioni delle connessioni; avvicini la parte alta o centrale del retro del telefono alla targa"],
              ["Android senza lettura con un tocco", "Usi il QR code con la fotocamera"],
            ],
          },
          {
            type: "callout",
            tone: "info",
            text: "La posizione dell'antenna di lettura varia da modello a modello. Sulla maggior parte degli iPhone è in alto; su molti Android è al centro del retro. Se non succede nulla, faccia scorrere lentamente il telefono sulla targa.",
          },
          { type: "h2", id: "plate-not-responding", text: "La targa non risponde" },
          {
            type: "ol",
            items: [
              "Verifichi che lo schermo sia acceso e sbloccato.",
              "Su Android, verifichi che la lettura di prossimità (con un tocco) sia attiva nelle impostazioni (di solito in «Connessioni» o «Dispositivi connessi»).",
              "Tolga gli accessori ingombranti: cover metalliche, cover a portafoglio con carte e popsocket disturbano il segnale. Le normali cover sottili di solito non creano problemi.",
              "Tenga il telefono contro la targa per 1-2 secondi senza muoverlo.",
              "Provi con un altro telefono. Se lì funziona, il problema è nel primo dispositivo.",
            ],
          },
          { type: "h3", id: "local-interference", text: "Interferenze sul posto" },
          {
            type: "p",
            text: "Se la targa ha smesso di funzionare dopo essere stata spostata, verifichi se poggia su metallo o è attaccata al POS. La allontani di qualche centimetro e la testi di nuovo. Sulle superfici metalliche serve la versione anti-metallo.",
          },
          { type: "h2", id: "wrong-page", text: "Apre la pagina sbagliata o un errore" },
          {
            type: "ul",
            items: [
              "**Apre la scheda ma non la finestra di recensione**: alcuni browser mostrano prima la scheda dell'attività. Il cliente può toccare «Scrivi una recensione». Se succede sempre, ci avvisi per verificare il link.",
              "**Chiede di accedere**: Google e Tripadvisor richiedono un account per pubblicare recensioni. È normale.",
              "**Mostra un'altra attività**: il link o il Place ID è sbagliato. Ci contatti e correggiamo il reindirizzamento.",
              "**Pagina di errore**: può essere un problema temporaneo di rete. Se persiste, ci contatti.",
              "**Su Booking.com non compare il modulo di recensione**: è normale. La targa Booking apre la pagina della struttura; l'ospite recensisce dall'invito che Booking gli invia via e-mail dopo il check-out.",
            ],
          },
          { type: "h2", id: "suspended-profile", text: "Profilo sospeso o link cambiato" },
          {
            type: "p",
            text: "Se Google sospende il Suo Profilo dell'attività, il modulo di recensione non è più disponibile e le targhe smettono di funzionare come previsto. In quel caso:",
          },
          {
            type: "steps",
            items: [
              {
                title: "Risolvere la sospensione con Google",
                body: "Segua le istruzioni di Google per chiedere il ripristino. Steevanz non può intervenire in questa procedura.",
              },
              {
                title: "Avvisare Steevanz",
                body: "Mentre il profilo è sospeso, possiamo far puntare temporaneamente le targhe a un'altra pagina, come il Suo sito o il Suo Instagram.",
              },
              {
                title: "Aggiornare la destinazione",
                body: "Quando il profilo torna attivo (o ne viene creato uno nuovo), ci invii il link per le recensioni e aggiorniamo tutte le targhe, senza ristampare.",
              },
            ],
          },
          { type: "h2", id: "physical-damage", text: "Danni fisici" },
          {
            type: "p",
            text: "Una targa rotta o piegata, o con il QR code illeggibile, può avere il chip danneggiato. Ci invii una foto e ci occupiamo della sostituzione.",
          },
        ],
      },
    },
    faq: {
      pt: {
        title: "Perguntas frequentes sobre as placas para avaliações",
        description:
          "Respostas às dúvidas mais comuns sobre as placas para avaliações: compatibilidade, Google, Tripadvisor e Booking.com, alterações de link, limpeza e substituição.",
        blocks: [
          { type: "h2", id: "perguntas", text: "Perguntas frequentes" },
          {
            type: "faq",
            items: [
              {
                q: "O cliente precisa de instalar alguma aplicação?",
                a: "Não. A leitura por aproximação está integrada na maioria dos telemóveis recentes e o código QR funciona com a câmara. A página abre no navegador ou na aplicação da plataforma (Google Maps, Tripadvisor ou Booking.com).",
              },
              {
                q: "Funciona em todos os iPhones?",
                a: "Do iPhone XS em diante, a leitura é automática com o ecrã desbloqueado. Nos iPhone 7, 8 e X é preciso usar o botão do leitor de etiquetas na Centro de Controlo. Em modelos mais antigos, use o código QR.",
              },
              {
                q: "A Steevanz tem alguma ligação à Google, ao Tripadvisor ou à Booking.com?",
                a: "Não. A Steevanz é uma empresa independente. As placas apenas encaminham os clientes para as páginas públicas do seu negócio nessas plataformas.",
              },
              {
                q: "Posso oferecer um desconto a quem deixar avaliação?",
                a: "Não. O Google, o Tripadvisor e a Booking.com proíbem incentivos em troca de avaliações, mesmo que a avaliação seja honesta. Peça a todos os clientes, sem contrapartidas.",
              },
              {
                q: "Posso pedir avaliações só aos clientes satisfeitos?",
                a: "Não deve. Pedir seletivamente (review gating) vai contra as regras do Google. Peça a todos; as críticas ocasionais tornam o perfil mais credível.",
              },
              {
                q: "Uma placa pode abrir o Google e o Tripadvisor?",
                a: "Não. Cada placa abre um único destino, que escolhe na encomenda: o Google, o Tripadvisor ou a Booking.com. Para duas plataformas, use duas placas. Se mais tarde quiser que uma placa abra outro destino, atualizamos o redirecionamento.",
              },
              {
                q: "Qualquer hóspede me pode avaliar na Booking.com pela placa?",
                a: "Não. A Booking.com só aceita avaliações de quem reservou pela Booking e ficou alojado, através do convite que envia por email depois do check-out. A placa da Booking abre a página do alojamento e lembra o hóspede desse email. No Google e no Tripadvisor, qualquer cliente que abra o link pode avaliar.",
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
        title: "Review plates FAQ",
        description:
          "Answers to the most common questions about review plates: phone compatibility, Google, Tripadvisor and Booking.com, link changes, cleaning and replacements.",
        blocks: [
          { type: "h2", id: "questions", text: "Frequently asked questions" },
          {
            type: "faq",
            items: [
              {
                q: "Do customers need to install an app?",
                a: "No. Tap reading is built into most recent phones and the QR code works with the camera. The page opens in the browser or in the platform's app (Google Maps, Tripadvisor or Booking.com).",
              },
              {
                q: "Does it work on every iPhone?",
                a: "From iPhone XS onwards, reading is automatic with the screen unlocked. On iPhone 7, 8 and X you need the tag reader button in Control Centre. On older models, use the QR code.",
              },
              {
                q: "Is Steevanz connected to Google, Tripadvisor or Booking.com?",
                a: "No. Steevanz is an independent company. The plates simply send customers to your business's public pages on those platforms.",
              },
              {
                q: "Can I offer a discount to customers who leave a review?",
                a: "No. Google, Tripadvisor and Booking.com forbid incentives in exchange for reviews, even honest ones. Ask every customer, with nothing in return.",
              },
              {
                q: "Can I only ask happy customers?",
                a: "You shouldn't. Selective asking (review gating) breaks Google's rules. Ask everyone; the occasional criticism makes your profile more credible.",
              },
              {
                q: "Can one plate open both Google and Tripadvisor?",
                a: "No. Each plate opens a single destination, which you choose when you order: Google, Tripadvisor or Booking.com. For two platforms, use two plates. If you later want a plate to open another destination, we update the redirect.",
              },
              {
                q: "Can any guest review me on Booking.com through the plate?",
                a: "No. Booking.com only accepts reviews from guests who booked through Booking and stayed, from the invitation it emails after check-out. The Booking plate opens the property's page and reminds guests of that email. On Google and Tripadvisor, any customer who opens the link can leave a review.",
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
        title: "Preguntas frecuentes sobre las placas para reseñas",
        description:
          "Respuestas a las dudas más habituales sobre las placas para reseñas: compatibilidad de móviles, Google, Tripadvisor y Booking.com, cambios de enlace, limpieza y sustituciones.",
        blocks: [
          { type: "h2", id: "questions", text: "Preguntas frecuentes" },
          {
            type: "faq",
            items: [
              {
                q: "¿Los clientes tienen que instalar una app?",
                a: "No. La lectura por proximidad está integrada en la mayoría de los móviles recientes y el código QR funciona con la cámara. La página se abre en el navegador o en la app de la plataforma (Google Maps, Tripadvisor o Booking.com).",
              },
              {
                q: "¿Funciona en todos los iPhone?",
                a: "Desde el iPhone XS, la lectura es automática con la pantalla desbloqueada. En los iPhone 7, 8 y X hace falta el botón del lector de etiquetas del Centro de control. En modelos más antiguos, use el código QR.",
              },
              {
                q: "¿Tiene Steevanz alguna relación con Google, Tripadvisor o Booking.com?",
                a: "No. Steevanz es una empresa independiente. Las placas solo llevan a los clientes a las páginas públicas de su negocio en esas plataformas.",
              },
              {
                q: "¿Puedo ofrecer un descuento a los clientes que dejen una reseña?",
                a: "No. Google, Tripadvisor y Booking.com prohíben los incentivos a cambio de reseñas, aunque la reseña sea sincera. Pídala a todos los clientes, sin nada a cambio.",
              },
              {
                q: "¿Puedo pedirla solo a los clientes satisfechos?",
                a: "No debería. Pedirla de forma selectiva (filtrado de reseñas) incumple las normas de Google. Pídala a todos; alguna crítica ocasional hace su perfil más creíble.",
              },
              {
                q: "¿Una placa puede abrir Google y Tripadvisor?",
                a: "No. Cada placa abre un único destino, que usted elige en el pedido: Google, Tripadvisor o Booking.com. Para dos plataformas, use dos placas. Si más adelante quiere que una placa abra otro destino, actualizamos la redirección.",
              },
              {
                q: "¿Cualquier huésped puede valorarme en Booking.com con la placa?",
                a: "No. Booking.com solo acepta valoraciones de quien reservó por Booking y se alojó, desde la invitación que envía por correo tras el check-out. La placa de Booking abre la página del alojamiento y recuerda al huésped ese correo. En Google y Tripadvisor, cualquier cliente que abra el enlace puede dejar su reseña.",
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
        title: "Questions fréquentes sur les plaques pour avis",
        description:
          "Réponses aux questions les plus courantes sur les plaques pour avis : compatibilité des téléphones, Google, Tripadvisor et Booking.com, changement de lien, nettoyage et remplacements.",
        blocks: [
          { type: "h2", id: "questions", text: "Questions fréquentes" },
          {
            type: "faq",
            items: [
              {
                q: "Les clients doivent-ils installer une application ?",
                a: "Non. La lecture sans contact est intégrée à la plupart des téléphones récents et le QR code fonctionne avec l'appareil photo. La page s'ouvre dans le navigateur ou dans l'application de la plateforme (Google Maps, Tripadvisor ou Booking.com).",
              },
              {
                q: "Est-ce que ça marche sur tous les iPhone ?",
                a: "À partir de l'iPhone XS, la lecture est automatique écran déverrouillé. Sur les iPhone 7, 8 et X, il faut le bouton du lecteur de tags dans le Centre de contrôle. Sur les modèles plus anciens, utilisez le QR code.",
              },
              {
                q: "Steevanz a-t-elle un lien avec Google, Tripadvisor ou Booking.com ?",
                a: "Non. Steevanz est une entreprise indépendante. Les plaques dirigent simplement vos clients vers les pages publiques de votre établissement sur ces plateformes.",
              },
              {
                q: "Puis-je offrir une réduction aux clients qui laissent un avis ?",
                a: "Non. Google, Tripadvisor et Booking.com interdisent les contreparties en échange d'avis, même sincères. Sollicitez tous vos clients, sans rien en retour.",
              },
              {
                q: "Puis-je demander uniquement aux clients satisfaits ?",
                a: "Vous ne devriez pas. Demander de façon sélective (filtrage des avis) enfreint les règles de Google. Demandez à tout le monde ; une critique de temps en temps rend votre fiche plus crédible.",
              },
              {
                q: "Une plaque peut-elle ouvrir Google et Tripadvisor ?",
                a: "Non. Chaque plaque ouvre une seule destination, que vous choisissez à la commande : Google, Tripadvisor ou Booking.com. Pour deux plateformes, utilisez deux plaques. Si vous voulez plus tard qu'une plaque ouvre une autre destination, nous mettons la redirection à jour.",
              },
              {
                q: "N'importe quel voyageur peut-il me laisser un avis sur Booking.com avec la plaque ?",
                a: "Non. Booking.com n'accepte que les avis de ceux qui ont réservé via Booking et séjourné chez vous, depuis l'invitation envoyée par e-mail après le départ. La plaque Booking ouvre la page de l'hébergement et rappelle cet e-mail au voyageur. Sur Google et Tripadvisor, tout client qui ouvre le lien peut laisser un avis.",
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
        title: "Häufige Fragen zu den Schildern für Bewertungen",
        description:
          "Antworten auf die häufigsten Fragen zu den Schildern für Bewertungen: Handy-Kompatibilität, Google, Tripadvisor und Booking.com, Linkänderungen, Reinigung und Ersatz.",
        blocks: [
          { type: "h2", id: "questions", text: "Häufige Fragen" },
          {
            type: "faq",
            items: [
              {
                q: "Müssen Kunden eine App installieren?",
                a: "Nein. Kontaktloses Lesen ist in den meisten aktuellen Handys eingebaut, und der QR-Code funktioniert mit der Kamera. Die Seite öffnet sich im Browser oder in der App der Plattform (Google Maps, Tripadvisor oder Booking.com).",
              },
              {
                q: "Funktioniert es auf jedem iPhone?",
                a: "Ab dem iPhone XS liest das Handy automatisch, wenn der Bildschirm entsperrt ist. Beim iPhone 7, 8 und X brauchen Sie die Taste des Tag-Lesers im Kontrollzentrum. Bei älteren Modellen nutzen Sie den QR-Code.",
              },
              {
                q: "Ist Steevanz mit Google, Tripadvisor oder Booking.com verbunden?",
                a: "Nein. Steevanz ist ein unabhängiges Unternehmen. Die Schilder leiten Kunden nur zu den öffentlichen Seiten Ihres Betriebs auf diesen Plattformen weiter.",
              },
              {
                q: "Darf ich Kunden, die eine Bewertung hinterlassen, einen Rabatt geben?",
                a: "Nein. Google, Tripadvisor und Booking.com verbieten Gegenleistungen für Bewertungen, auch für ehrliche. Fragen Sie jeden Kunden, ohne etwas dafür zu bieten.",
              },
              {
                q: "Darf ich nur zufriedene Kunden fragen?",
                a: "Das sollten Sie nicht. Selektives Fragen (Review Gating) verstößt gegen die Regeln von Google. Fragen Sie alle; gelegentliche Kritik macht Ihr Profil glaubwürdiger.",
              },
              {
                q: "Kann ein Schild Google und Tripadvisor öffnen?",
                a: "Nein. Jedes Schild öffnet genau ein Ziel, das Sie bei der Bestellung wählen: Google, Tripadvisor oder Booking.com. Für zwei Plattformen nutzen Sie zwei Schilder. Soll ein Schild später ein anderes Ziel öffnen, ändern wir die Weiterleitung.",
              },
              {
                q: "Kann mich jeder Gast über das Schild auf Booking.com bewerten?",
                a: "Nein. Booking.com nimmt nur Bewertungen von Gästen an, die über Booking gebucht und übernachtet haben, über die Einladung, die nach dem Check-out per E-Mail kommt. Das Booking-Schild öffnet die Seite der Unterkunft und erinnert den Gast an diese E-Mail. Bei Google und Tripadvisor kann jeder Kunde, der den Link öffnet, eine Bewertung abgeben.",
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
        title: "Domande frequenti sulle targhe per recensioni",
        description:
          "Risposte ai dubbi più comuni sulle targhe per recensioni: compatibilità dei telefoni, Google, Tripadvisor e Booking.com, cambi di link, pulizia e sostituzioni.",
        blocks: [
          { type: "h2", id: "questions", text: "Domande frequenti" },
          {
            type: "faq",
            items: [
              {
                q: "I clienti devono installare un'app?",
                a: "No. La lettura contactless è integrata nella maggior parte dei telefoni recenti e il QR code funziona con la fotocamera. La pagina si apre nel browser o nell'app della piattaforma (Google Maps, Tripadvisor o Booking.com).",
              },
              {
                q: "Funziona su tutti gli iPhone?",
                a: "Dall'iPhone XS in poi la lettura è automatica con lo schermo sbloccato. Su iPhone 7, 8 e X serve il pulsante del lettore di tag nel Centro di Controllo. Sui modelli più vecchi, si usa il QR code.",
              },
              {
                q: "Steevanz ha qualche legame con Google, Tripadvisor o Booking.com?",
                a: "No. Steevanz è un'azienda indipendente. Le targhe portano semplicemente i clienti alle pagine pubbliche della Sua attività su queste piattaforme.",
              },
              {
                q: "Posso offrire uno sconto ai clienti che lasciano una recensione?",
                a: "No. Google, Tripadvisor e Booking.com vietano gli incentivi in cambio di recensioni, anche se sincere. Chieda a tutti i clienti, senza nulla in cambio.",
              },
              {
                q: "Posso chiederla solo ai clienti soddisfatti?",
                a: "Non dovrebbe. Chiedere in modo selettivo (review gating) viola le regole di Google. Chieda a tutti; qualche critica occasionale rende il Suo profilo più credibile.",
              },
              {
                q: "Una targa può aprire Google e Tripadvisor?",
                a: "No. Ogni targa apre una sola destinazione, che sceglie al momento dell'ordine: Google, Tripadvisor o Booking.com. Per due piattaforme, usi due targhe. Se in seguito vuole che una targa apra un'altra destinazione, aggiorniamo il reindirizzamento.",
              },
              {
                q: "Qualsiasi ospite può recensirmi su Booking.com con la targa?",
                a: "No. Booking.com accetta solo recensioni di chi ha prenotato tramite Booking e soggiornato, dall'invito che invia via e-mail dopo il check-out. La targa Booking apre la pagina della struttura e ricorda all'ospite quell'e-mail. Su Google e Tripadvisor, qualsiasi cliente che apre il link può lasciare una recensione.",
              },
              {
                q: "Qualcuno può riprogrammare la mia targa?",
                a: "No. Blocchiamo ogni chip dopo averlo programmato, quindi non può essere riscritto con app di programmazione dei chip.",
              },
              {
                q: "Se mi trasferisco o cambio profilo, servono targhe nuove?",
                a: "No. Il chip punta a un reindirizzamento gestito da Steevanz. Basta inviarci il nuovo link e aggiorniamo tutte le targhe. Veda la pagina [configurazione](/it/docs/google-review-plates/configuration).",
              },
              {
                q: "Posso mettere una targa su una superficie metallica?",
                a: "Sì, ma serve la versione con chip anti-metallo. Una targa normale su metallo potrebbe non essere letta. Ci dica dove andrà quando ordina.",
              },
              {
                q: "Come pulisco le targhe?",
                a: "Con un panno in microfibra e acqua con detergente neutro. Eviti alcol, candeggina e prodotti abrasivi, che graffiano l'acrilico.",
              },
              {
                q: "E se una targa si rompe?",
                a: "Ci invii una foto dalla nostra [pagina contatti](/it/contact) o su WhatsApp e ci occupiamo della sostituzione.",
              },
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Non ha trovato la risposta? [Prenoti una demo](/it/book-a-demo) e ne parliamo insieme.",
          },
        ],
      },
    },
  },
};

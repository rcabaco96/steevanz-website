import type { ProductDocs } from "../types";

export const docs: ProductDocs = {
  productId: "loyalty",
  pages: {
    "getting-started": {
      pt: {
        title: "Primeiros passos com o cartão de fidelidade digital",
        description: "Como funciona o cartão de fidelidade da Steevanz: o cliente adere por QR code ou com um toque, junta carimbos a cada visita e recebe a recompensa no telemóvel.",
        blocks: [
          {
            type: "p",
            text: "O cartão de carimbos passa para o telemóvel do cliente. Adere ao balcão em segundos, junta um carimbo a cada visita e, ao completar o cartão, a recompensa aparece pronta a usar. Sem app e sem cartões de papel.",
          },
          { type: "h2", id: "como-funciona", text: "Como funciona" },
          {
            type: "ol",
            items: [
              "O cliente lê o QR code ou toca na placa ao balcão e cria o cartão só com o nome (o email é recomendado, o telemóvel é opcional).",
              "O cartão abre no telemóvel e pode ficar no ecrã principal, como uma app.",
              "A cada visita, a equipa dá o carimbo: lê o QR do cartão com o telemóvel do balcão, ou procura o cliente no Atendimento.",
              "Ao chegar a uma recompensa (pelo caminho ou com o cartão completo), ela aparece no cartão. A equipa entrega-a da mesma forma. Uma recompensa já ganha não muda, mesmo que o dono mude as recompensas depois.",
            ],
          },
          {
            type: "steps",
            items: [
              { title: "Sem aplicação", body: "O cartão é uma página no telemóvel do cliente. Não há nada para instalar." },
              { title: "Sem fraude", body: "Só a equipa dá carimbos, no painel (com sessão iniciada). Quando dar cada carimbo é decisão sua." },
              { title: "Com estatísticas", body: "Veja quantos clientes aderiram, quantos voltaram e quantas recompensas foram entregues." },
            ],
          },
          { type: "p", text: "Próximo passo: veja como fazemos a [instalação](/docs/cartao-fidelidade-digital/instalacao)." },
        ],
      },
      en: {
        title: "Getting started with the digital loyalty card",
        description: "How the Steevanz loyalty card works: customers join by QR code or with a tap, collect a stamp at every visit and get their reward on their phone.",
        blocks: [
          {
            type: "p",
            text: "The stamp card moves to the customer's phone. They join at the counter in seconds, collect a stamp at every visit and, once the card is full, the reward appears ready to use. No app and no paper cards.",
          },
          { type: "h2", id: "how-it-works", text: "How it works" },
          {
            type: "ol",
            items: [
              "Customers scan the QR code or tap the plate at the counter and create their card with just a name (email recommended, phone optional).",
              "The card opens on the phone and can sit on the home screen, like an app.",
              "At every visit, your staff give the stamp: they scan the card's QR with the counter phone, or find the customer in the «Atendimento» screen.",
              "When a reward is reached (along the way or with a full card), it appears on the card. Your staff hand it over the same way. A reward already earned never changes, even if the owner changes the rewards later.",
            ],
          },
          {
            type: "steps",
            items: [
              { title: "No app needed", body: "The card is a page on the customer's phone. There's nothing to install." },
              { title: "No fraud", body: "Only your staff give stamps, from the dashboard (signed in). When to give each stamp is up to you." },
              { title: "With stats", body: "See how many customers joined, how many came back and how many rewards were handed out." },
            ],
          },
          { type: "p", text: "Next step: see how we handle the [setup](/en/docs/digital-loyalty-card/setup)." },
        ],
      },
      es: {
        title: "Primeros pasos con la tarjeta de cliente digital",
        description: "Cómo funciona la tarjeta de cliente de Steevanz: el cliente se une con un código QR o con un toque, acumula un sello en cada visita y recibe la recompensa en el móvil.",
        blocks: [
          {
            type: "p",
            text: "La tarjeta de sellos pasa al móvil del cliente. Se une en el mostrador en segundos, acumula un sello en cada visita y, al completar la tarjeta, la recompensa aparece lista para usar. Sin app y sin tarjetas de papel.",
          },
          { type: "h2", id: "how-it-works", text: "Cómo funciona" },
          {
            type: "ol",
            items: [
              "El cliente escanea el código QR o toca la placa del mostrador y crea su tarjeta solo con el nombre (el email es recomendable, el teléfono es opcional).",
              "La tarjeta se abre en el móvil y puede quedarse en la pantalla de inicio, como una app.",
              "En cada visita, su equipo da el sello: escanea el QR de la tarjeta con el móvil del mostrador o busca al cliente en la pantalla «Atendimento».",
              "Al llegar a una recompensa (por el camino o con la tarjeta completa), aparece en la tarjeta. Su equipo la entrega de la misma forma. Una recompensa ya ganada no cambia, aunque el dueño cambie las recompensas más adelante.",
            ],
          },
          {
            type: "steps",
            items: [
              { title: "Sin aplicación", body: "La tarjeta es una página en el móvil del cliente. No hay nada que instalar." },
              { title: "Sin fraude", body: "Solo su equipo da sellos, desde el panel (con sesión iniciada). Cuándo dar cada sello lo decide usted." },
              { title: "Con estadísticas", body: "Vea cuántos clientes se han unido, cuántos han vuelto y cuántas recompensas se han entregado." },
            ],
          },
          { type: "p", text: "Siguiente paso: vea cómo hacemos la [instalación](/es/docs/digital-loyalty-card/setup)." },
        ],
      },
      fr: {
        title: "Premiers pas avec la carte de fidélité digitale",
        description: "Comment fonctionne la carte de fidélité Steevanz : le client s'inscrit par QR code ou d'un toucher, cumule un tampon à chaque visite et reçoit sa récompense sur son téléphone.",
        blocks: [
          {
            type: "p",
            text: "La carte à tampons passe sur le téléphone du client. Il s'inscrit au comptoir en quelques secondes, cumule un tampon à chaque visite et, une fois la carte complète, la récompense apparaît, prête à être utilisée. Sans application et sans cartes papier.",
          },
          { type: "h2", id: "how-it-works", text: "Comment ça marche" },
          {
            type: "ol",
            items: [
              "Le client scanne le QR code ou touche la plaque au comptoir et crée sa carte avec son seul prénom (l'e-mail est conseillé, le téléphone est facultatif).",
              "La carte s'ouvre sur le téléphone et peut rester sur l'écran d'accueil, comme une application.",
              "À chaque visite, votre équipe donne le tampon : elle scanne le QR de la carte avec le téléphone du comptoir, ou cherche le client dans l'écran «Atendimento».",
              "Quand une récompense est atteinte (en cours de route ou avec la carte complète), elle apparaît sur la carte. Votre équipe la remet de la même façon. Une récompense déjà gagnée ne change pas, même si le gérant modifie les récompenses plus tard.",
            ],
          },
          {
            type: "steps",
            items: [
              { title: "Sans application", body: "La carte est une page sur le téléphone du client. Il n'y a rien à installer." },
              { title: "Sans fraude", body: "Seule votre équipe donne des tampons, depuis le tableau de bord (connectée). C'est vous qui décidez quand donner chaque tampon." },
              { title: "Avec des statistiques", body: "Voyez combien de clients se sont inscrits, combien sont revenus et combien de récompenses ont été remises." },
            ],
          },
          { type: "p", text: "Étape suivante : voyez comment nous faisons l'[installation](/fr/docs/digital-loyalty-card/setup)." },
        ],
      },
      de: {
        title: "Erste Schritte mit der digitalen Kundenkarte",
        description: "So funktioniert die Kundenkarte von Steevanz: Kunden melden sich per QR-Code oder per Antippen an, sammeln bei jedem Besuch einen Stempel und erhalten die Prämie auf dem Handy.",
        blocks: [
          {
            type: "p",
            text: "Die Stempelkarte kommt auf das Handy des Kunden. Er meldet sich in Sekunden an der Theke an, sammelt bei jedem Besuch einen Stempel und, sobald die Karte voll ist, erscheint die Prämie einlösebereit. Ohne App und ohne Papierkarten.",
          },
          { type: "h2", id: "how-it-works", text: "So funktioniert es" },
          {
            type: "ol",
            items: [
              "Der Kunde scannt den QR-Code oder tippt das Schild an der Theke an und erstellt seine Karte nur mit dem Namen (E-Mail empfohlen, Telefon optional).",
              "Die Karte öffnet sich auf dem Handy und kann wie eine App auf dem Startbildschirm bleiben.",
              "Bei jedem Besuch vergibt Ihr Team den Stempel: Es scannt den QR-Code der Karte mit dem Handy an der Theke oder sucht den Kunden im Bildschirm «Atendimento».",
              "Ist eine Prämie erreicht (unterwegs oder mit voller Karte), erscheint sie auf der Karte. Ihr Team löst sie auf dieselbe Weise ein. Eine bereits verdiente Prämie ändert sich nicht, auch wenn der Inhaber die Prämien später ändert.",
            ],
          },
          {
            type: "steps",
            items: [
              { title: "Ohne App", body: "Die Karte ist eine Seite auf dem Handy des Kunden. Es muss nichts installiert werden." },
              { title: "Ohne Betrug", body: "Nur Ihr Team vergibt Stempel, im Dashboard (angemeldet). Wann jeder Stempel vergeben wird, entscheiden Sie." },
              { title: "Mit Statistiken", body: "Sehen Sie, wie viele Kunden sich angemeldet haben, wie viele wiedergekommen sind und wie viele Prämien eingelöst wurden." },
            ],
          },
          { type: "p", text: "Nächster Schritt: Sehen Sie, wie wir die [Einrichtung](/de/docs/digital-loyalty-card/setup) übernehmen." },
        ],
      },
      it: {
        title: "Primi passi con la carta fedeltà digitale",
        description: "Come funziona la carta fedeltà di Steevanz: il cliente aderisce con il QR code o con un tocco, raccoglie un timbro a ogni visita e riceve il premio sul telefono.",
        blocks: [
          {
            type: "p",
            text: "La tessera a timbri passa sul telefono del cliente. Aderisce al banco in pochi secondi, raccoglie un timbro a ogni visita e, completata la carta, il premio compare pronto da usare. Senza app e senza tessere di carta.",
          },
          { type: "h2", id: "how-it-works", text: "Come funziona" },
          {
            type: "ol",
            items: [
              "Il cliente inquadra il QR code o tocca la targa al banco e crea la carta solo con il nome (l'email è consigliata, il telefono è facoltativo).",
              "La carta si apre sul telefono e può restare nella schermata home, come un'app.",
              "A ogni visita, il Suo staff dà il timbro: inquadra il QR della carta con il telefono del banco, oppure cerca il cliente nella schermata «Atendimento».",
              "Quando si raggiunge un premio (lungo il percorso o con la carta completa), compare sulla carta. Il Suo staff lo consegna allo stesso modo. Un premio già ottenuto non cambia, anche se il titolare modifica i premi in seguito.",
            ],
          },
          {
            type: "steps",
            items: [
              { title: "Senza app", body: "La carta è una pagina sul telefono del cliente. Non c'è nulla da installare." },
              { title: "Senza frodi", body: "Solo il Suo staff dà i timbri, dal pannello (con accesso effettuato). Quando dare ogni timbro lo decide Lei." },
              { title: "Con statistiche", body: "Vede quanti clienti hanno aderito, quanti sono tornati e quanti premi sono stati consegnati." },
            ],
          },
          { type: "p", text: "Prossimo passo: veda come facciamo l'[installazione](/it/docs/digital-loyalty-card/setup)." },
        ],
      },
    },
    setup: {
      pt: {
        title: "Instalação do cartão de fidelidade digital",
        description: "Como a Steevanz põe o cartão a funcionar: regras e recompensa, placa de adesão ao balcão e um teste completo.",
        blocks: [
          { type: "p", text: "Tratamos da instalação consigo. Normalmente fica pronta em poucos dias úteis." },
          {
            type: "steps",
            items: [
              { title: "Enviar a informação do negócio", body: "Envie-nos o nome do negócio, as regras (quantos carimbos) e a recompensa. Usamos esta informação para configurar o cartão e a página." },
              { title: "Rever as condições", body: "Se o cartão tiver condições (por exemplo, não acumular com outras promoções), aparecem junto à regra do carimbo." },
              { title: "Instalar a placa de adesão", body: "A placa com QR code fica no balcão, à vista, para os clientes aderirem." },
              { title: "Fazer um teste completo", body: "Criamos um cartão de teste, damos um carimbo e entregamos uma recompensa, para confirmar que tudo funciona." },
            ],
          },
          { type: "callout", tone: "info", text: "Depois, pode mudar as regras quando quiser em [configuração](/docs/cartao-fidelidade-digital/configuracao)." },
        ],
      },
      en: {
        title: "Setting up the digital loyalty card",
        description: "How Steevanz gets the card running: rules and reward, the sign-up plate at the counter and a full test.",
        blocks: [
          { type: "p", text: "We handle the setup with you. It is usually ready within a few working days." },
          {
            type: "steps",
            items: [
              { title: "Send your business details", body: "Send us your business name, the rules (how many stamps) and the reward. We use them to set up the card and the page." },
              { title: "Review the conditions", body: "If the card has conditions (for example, not combined with other offers), they show next to the stamp rule." },
              { title: "Place the sign-up plate", body: "The plate with QR code sits on the counter, in view, for customers to join." },
              { title: "Run a full test", body: "We create a test card, give a stamp and hand over a reward, to confirm everything works." },
            ],
          },
          { type: "callout", tone: "info", text: "Afterwards you can change the rules whenever you like in [configuration](/en/docs/digital-loyalty-card/configuration)." },
        ],
      },
      es: {
        title: "Instalación de la tarjeta de cliente digital",
        description: "Cómo Steevanz pone la tarjeta en marcha: reglas y recompensa, la placa de alta en el mostrador y una prueba completa.",
        blocks: [
          { type: "p", text: "Nos encargamos de la instalación con usted. Normalmente queda lista en pocos días laborables." },
          {
            type: "steps",
            items: [
              { title: "Enviar los datos del negocio", body: "Envíenos el nombre del negocio, las reglas (cuántos sellos) y la recompensa. Usamos esta información para configurar la tarjeta y la página." },
              { title: "Revisar las condiciones", body: "Si la tarjeta tiene condiciones (por ejemplo, no acumulable con otras promociones), aparecen junto a la regla del sello." },
              { title: "Colocar la placa de alta", body: "La placa con código QR queda en el mostrador, a la vista, para que los clientes se unan." },
              { title: "Hacer una prueba completa", body: "Creamos una tarjeta de prueba, damos un sello y entregamos una recompensa, para confirmar que todo funciona." },
            ],
          },
          { type: "callout", tone: "info", text: "Después, puede cambiar las reglas cuando quiera en [configuración](/es/docs/digital-loyalty-card/configuration)." },
        ],
      },
      fr: {
        title: "Installation de la carte de fidélité digitale",
        description: "Comment Steevanz met la carte en service : règles et récompense, plaque d'inscription au comptoir et test complet.",
        blocks: [
          { type: "p", text: "Nous nous occupons de l'installation avec vous. Elle est généralement prête en quelques jours ouvrés." },
          {
            type: "steps",
            items: [
              { title: "Envoyer les informations du commerce", body: "Envoyez-nous le nom du commerce, les règles (combien de tampons) et la récompense. Nous les utilisons pour configurer la carte et la page." },
              { title: "Vérifier les conditions", body: "Si la carte a des conditions (par exemple, non cumulable avec d'autres promotions), elles apparaissent à côté de la règle du tampon." },
              { title: "Installer la plaque d'inscription", body: "La plaque avec QR code reste sur le comptoir, bien en vue, pour que les clients s'inscrivent." },
              { title: "Faire un test complet", body: "Nous créons une carte de test, donnons un tampon et remettons une récompense, pour confirmer que tout fonctionne." },
            ],
          },
          { type: "callout", tone: "info", text: "Ensuite, vous pouvez changer les règles quand vous voulez dans la [configuration](/fr/docs/digital-loyalty-card/configuration)." },
        ],
      },
      de: {
        title: "Einrichtung der digitalen Kundenkarte",
        description: "Wie Steevanz die Karte startklar macht: Regeln und Prämie, das Anmeldeschild an der Theke und ein vollständiger Test.",
        blocks: [
          { type: "p", text: "Wir übernehmen die Einrichtung gemeinsam mit Ihnen. Meist ist sie in wenigen Werktagen fertig." },
          {
            type: "steps",
            items: [
              { title: "Geschäftsdaten senden", body: "Senden Sie uns den Namen Ihres Geschäfts, die Regeln (wie viele Stempel) und die Prämie. Damit richten wir die Karte und die Seite ein." },
              { title: "Bedingungen prüfen", body: "Hat die Karte Bedingungen (zum Beispiel nicht mit anderen Aktionen kombinierbar), erscheinen sie neben der Stempelregel." },
              { title: "Anmeldeschild aufstellen", body: "Das Schild mit QR-Code steht gut sichtbar auf der Theke, damit sich Kunden anmelden können." },
              { title: "Vollständigen Test durchführen", body: "Wir erstellen eine Testkarte, vergeben einen Stempel und lösen eine Prämie ein, um zu bestätigen, dass alles funktioniert." },
            ],
          },
          { type: "callout", tone: "info", text: "Danach können Sie die Regeln jederzeit in der [Konfiguration](/de/docs/digital-loyalty-card/configuration) ändern." },
        ],
      },
      it: {
        title: "Installazione della carta fedeltà digitale",
        description: "Come Steevanz mette in funzione la carta: regole e premio, la targa di adesione al banco e un test completo.",
        blocks: [
          { type: "p", text: "Ci occupiamo dell'installazione insieme a Lei. Di solito è pronta in pochi giorni lavorativi." },
          {
            type: "steps",
            items: [
              { title: "Inviare i dati dell'attività", body: "Ci invii il nome dell'attività, le regole (quanti timbri) e il premio. Li usiamo per configurare la carta e la pagina." },
              { title: "Rivedere le condizioni", body: "Se la carta ha delle condizioni (per esempio, non cumulabile con altre promozioni), compaiono accanto alla regola del timbro." },
              { title: "Posizionare la targa di adesione", body: "La targa con QR code resta sul banco, ben visibile, perché i clienti possano aderire." },
              { title: "Fare un test completo", body: "Creiamo una carta di prova, diamo un timbro e consegniamo un premio, per confermare che tutto funziona." },
            ],
          },
          { type: "callout", tone: "info", text: "In seguito può cambiare le regole quando vuole nella [configurazione](/it/docs/digital-loyalty-card/configuration)." },
        ],
      },
    },
    configuration: {
      pt: {
        title: "Configuração: recompensas, antifraude e RGPD",
        description: "As regras do cartão: carimbos para completar, recompensa, validade e dados dos clientes.",
        blocks: [
          { type: "p", text: "As regras estão no separador **Definições** do cartão, na sua área de cliente." },
          {
            type: "table",
            head: ["Definição", "Para quê"],
            rows: [
              ["Carimbos para completar", "De 2 a 50 (por omissão 10). Se baixar o número, os cartões que já têm carimbos suficientes ficam logo completos."],
              ["Recompensa ao completar o cartão", "O que o cliente ganha no último carimbo, ex.: «um prato do dia oferecido»."],
              ["Recompensas pelo caminho", "Até 3, antes do cartão completo (ex.: ao 3.º carimbo um café, ao 6.º uma sobremesa). A primeira chega cedo e faz voltar; a grande fica no fim. Nos restaurantes vêm sugeridas; nos outros negócios fica só a final."],
              ["Consumo mínimo para carimbar", "«1 carimbo por serviço pago a partir de X €». Aparece no cartão do cliente e no Atendimento; a equipa aplica. Vazio = sem mínimo."],
              ["Validade da recompensa", "Em dias; vazio = sem validade."],
              ["Primeiro carimbo na adesão", "Oferece 1 carimbo ao criar o cartão."],
              ["Cartão ativo", "Em pausa: sem novas adesões nem carimbos."],
              ["Condições do cartão", "Opcional: aparecem junto à regra do carimbo (por exemplo, «Não acumula com outras promoções»)."],
            ],
          },
          { type: "h2", id: "rgpd", text: "Dados dos clientes" },
          {
            type: "ul",
            items: [
              "Só o nome é obrigatório. O email serve para recuperar o cartão; o telemóvel ajuda a encontrá-lo ao balcão.",
              "Ao criar o cartão, o cliente vê que os dados servem só para o gerir e que pode pedir para os apagar.",
              "A pedido do cliente, a equipa apaga o cartão e todo o histórico.",
            ],
          },
        ],
      },
      en: {
        title: "Configuration: rewards, anti-fraud and GDPR",
        description: "The card's rules: stamps to complete, reward, validity and customer data.",
        blocks: [
          { type: "p", text: "The rules are in the card's **Settings** tab, in your client area." },
          {
            type: "table",
            head: ["Setting", "What it's for"],
            rows: [
              ["Stamps to complete", "From 2 to 50 (10 by default). If you lower it, cards that already have enough stamps are completed straight away."],
              ["Reward for a full card", "What the customer gets on the last stamp, e.g. «a free dish of the day»."],
              ["Rewards along the way", "Up to 3 before the card is full (e.g. a coffee at the 3rd stamp, a dessert at the 6th). The first comes early and brings people back; the big one stays at the end. Suggested for restaurants; other businesses keep only the final one."],
              ["Minimum spend per stamp", "«1 stamp per visit from X €». Shown on the customer's card and in the «Atendimento» screen; your staff apply it. Empty = no minimum."],
              ["Reward validity", "In days; empty = no expiry."],
              ["First stamp on joining", "Gives 1 stamp when the card is created."],
              ["Card active", "Paused: no new sign-ups or stamps."],
              ["Card conditions", "Optional: shown next to the stamp rule (e.g. «Not combined with other offers»)."],
            ],
          },
          { type: "h2", id: "gdpr", text: "Customer data" },
          {
            type: "ul",
            items: [
              "Only the name is required. The email lets them recover the card; the phone helps find it at the counter.",
              "When creating the card, customers see that the data is only used to run it and that they can ask for it to be deleted.",
              "At the customer's request, your staff delete the card and its whole history.",
            ],
          },
        ],
      },
      es: {
        title: "Configuración: recompensas, antifraude y RGPD",
        description: "Las reglas de la tarjeta: sellos para completarla, recompensa, validez y datos de los clientes.",
        blocks: [
          { type: "p", text: "Las reglas están en la pestaña **Ajustes** de la tarjeta, en su área de cliente." },
          {
            type: "table",
            head: ["Ajuste", "Para qué sirve"],
            rows: [
              ["Sellos para completar", "De 2 a 50 (10 por defecto). Si baja el número, las tarjetas que ya tienen sellos suficientes quedan completas al momento."],
              ["Recompensa al completar la tarjeta", "Lo que gana el cliente con el último sello, p. ej.: «un plato del día gratis»."],
              ["Recompensas por el camino", "Hasta 3 antes de completar la tarjeta (p. ej.: un café en el 3.er sello, un postre en el 6.º). La primera llega pronto y hace volver; la grande queda al final. En los restaurantes vienen sugeridas; en los demás negocios queda solo la final."],
              ["Consumo mínimo por sello", "«1 sello por servicio pagado a partir de X €». Aparece en la tarjeta del cliente y en la pantalla «Atendimento»; su equipo lo aplica. Vacío = sin mínimo."],
              ["Validez de la recompensa", "En días; vacío = sin caducidad."],
              ["Primer sello al unirse", "Regala 1 sello al crear la tarjeta."],
              ["Tarjeta activa", "En pausa: sin nuevas altas ni sellos."],
              ["Condiciones de la tarjeta", "Opcional: aparecen junto a la regla del sello (por ejemplo, «No acumulable con otras promociones»)."],
            ],
          },
          { type: "h2", id: "gdpr", text: "Datos de los clientes" },
          {
            type: "ul",
            items: [
              "Solo el nombre es obligatorio. El email sirve para recuperar la tarjeta; el teléfono ayuda a encontrarla en el mostrador.",
              "Al crear la tarjeta, el cliente ve que los datos solo sirven para gestionarla y que puede pedir que se borren.",
              "A petición del cliente, su equipo borra la tarjeta y todo su historial.",
            ],
          },
        ],
      },
      fr: {
        title: "Configuration : récompenses, antifraude et RGPD",
        description: "Les règles de la carte : tampons pour la compléter, récompense, validité et données des clients.",
        blocks: [
          { type: "p", text: "Les règles se trouvent dans l'onglet **Paramètres** de la carte, dans votre espace client." },
          {
            type: "table",
            head: ["Paramètre", "À quoi il sert"],
            rows: [
              ["Tampons pour compléter", "De 2 à 50 (10 par défaut). Si vous baissez ce nombre, les cartes qui ont déjà assez de tampons sont complétées aussitôt."],
              ["Récompense pour une carte complète", "Ce que le client gagne au dernier tampon, par ex. «un plat du jour offert»."],
              ["Récompenses en cours de route", "Jusqu'à 3 avant que la carte soit complète (par ex. un café au 3e tampon, un dessert au 6e). La première arrive tôt et fait revenir ; la grande reste à la fin. Suggérées pour les restaurants ; les autres commerces gardent seulement la finale."],
              ["Consommation minimale par tampon", "«1 tampon par prestation payée à partir de X €». Affiché sur la carte du client et dans l'écran «Atendimento» ; votre équipe l'applique. Vide = sans minimum."],
              ["Validité de la récompense", "En jours ; vide = sans expiration."],
              ["Premier tampon à l'inscription", "Offre 1 tampon à la création de la carte."],
              ["Carte active", "En pause : ni nouvelles inscriptions ni tampons."],
              ["Conditions de la carte", "Facultatif : affichées à côté de la règle du tampon (par exemple, «Non cumulable avec d'autres promotions»)."],
            ],
          },
          { type: "h2", id: "gdpr", text: "Données des clients" },
          {
            type: "ul",
            items: [
              "Seul le prénom est obligatoire. L'e-mail permet de récupérer la carte ; le téléphone aide à la retrouver au comptoir.",
              "En créant la carte, le client voit que les données servent uniquement à la gérer et qu'il peut demander leur suppression.",
              "À la demande du client, votre équipe supprime la carte et tout son historique.",
            ],
          },
        ],
      },
      de: {
        title: "Konfiguration: Prämien, Betrugsschutz und DSGVO",
        description: "Die Regeln der Karte: Stempel bis zur vollen Karte, Prämie, Gültigkeit und Kundendaten.",
        blocks: [
          { type: "p", text: "Die Regeln finden Sie im Reiter **Einstellungen** der Karte, in Ihrem Kundenbereich." },
          {
            type: "table",
            head: ["Einstellung", "Wofür"],
            rows: [
              ["Stempel bis zur vollen Karte", "Von 2 bis 50 (standardmäßig 10). Wenn Sie die Zahl senken, sind Karten mit bereits genug Stempeln sofort voll."],
              ["Prämie für die volle Karte", "Was der Kunde beim letzten Stempel erhält, z. B. «ein Tagesgericht gratis»."],
              ["Prämien unterwegs", "Bis zu 3, bevor die Karte voll ist (z. B. ein Kaffee beim 3. Stempel, ein Dessert beim 6.). Die erste kommt früh und bringt Kunden zurück; die große bleibt am Ende. Für Restaurants vorgeschlagen; andere Geschäfte behalten nur die letzte."],
              ["Mindestumsatz pro Stempel", "«1 Stempel pro bezahlter Leistung ab X €». Erscheint auf der Karte des Kunden und im Bildschirm «Atendimento»; Ihr Team wendet ihn an. Leer = kein Minimum."],
              ["Gültigkeit der Prämie", "In Tagen; leer = unbegrenzt gültig."],
              ["Erster Stempel bei der Anmeldung", "Schenkt 1 Stempel beim Erstellen der Karte."],
              ["Karte aktiv", "Pausiert: keine neuen Anmeldungen und keine Stempel."],
              ["Bedingungen der Karte", "Optional: erscheinen neben der Stempelregel (zum Beispiel «Nicht mit anderen Aktionen kombinierbar»)."],
            ],
          },
          { type: "h2", id: "gdpr", text: "Kundendaten" },
          {
            type: "ul",
            items: [
              "Nur der Name ist Pflicht. Mit der E-Mail lässt sich die Karte wiederherstellen; das Telefon hilft, sie an der Theke zu finden.",
              "Beim Erstellen der Karte sieht der Kunde, dass die Daten nur zur Verwaltung der Karte dienen und dass er ihre Löschung verlangen kann.",
              "Auf Wunsch des Kunden löscht Ihr Team die Karte und den gesamten Verlauf.",
            ],
          },
        ],
      },
      it: {
        title: "Configurazione: premi, antifrode e GDPR",
        description: "Le regole della carta: timbri per completarla, premio, validità e dati dei clienti.",
        blocks: [
          { type: "p", text: "Le regole si trovano nella scheda **Impostazioni** della carta, nella Sua area cliente." },
          {
            type: "table",
            head: ["Impostazione", "A cosa serve"],
            rows: [
              ["Timbri per completare", "Da 2 a 50 (10 di default). Se abbassa il numero, le carte che hanno già abbastanza timbri risultano subito complete."],
              ["Premio a carta completa", "Ciò che il cliente ottiene all'ultimo timbro, es.: «un piatto del giorno offerto»."],
              ["Premi lungo il percorso", "Fino a 3 prima della carta completa (es.: un caffè al 3º timbro, un dolce al 6º). Il primo arriva presto e fa tornare; quello grande resta alla fine. Suggeriti per i ristoranti; le altre attività tengono solo quello finale."],
              ["Spesa minima per timbro", "«1 timbro per servizio pagato a partire da X €». Compare sulla carta del cliente e nella schermata «Atendimento»; il Suo staff la applica. Vuoto = nessun minimo."],
              ["Validità del premio", "In giorni; vuoto = senza scadenza."],
              ["Primo timbro all'adesione", "Regala 1 timbro alla creazione della carta."],
              ["Carta attiva", "In pausa: niente nuove adesioni né timbri."],
              ["Condizioni della carta", "Facoltativo: compaiono accanto alla regola del timbro (per esempio, «Non cumulabile con altre promozioni»)."],
            ],
          },
          { type: "h2", id: "gdpr", text: "Dati dei clienti" },
          {
            type: "ul",
            items: [
              "Solo il nome è obbligatorio. L'email serve a recuperare la carta; il telefono aiuta a trovarla al banco.",
              "Creando la carta, il cliente vede che i dati servono solo a gestirla e che può chiederne la cancellazione.",
              "Su richiesta del cliente, il Suo staff cancella la carta e tutta la sua cronologia.",
            ],
          },
        ],
      },
    },
    usage: {
      pt: {
        title: "Utilização diária do cartão",
        description: "Como dar carimbos, entregar recompensas, recuperar cartões e passar os carimbos do papel.",
        blocks: [
          { type: "h2", id: "carimbar", text: "Dar um carimbo" },
          {
            type: "ul",
            items: [
              "**Com o QR (a forma principal):** leia o QR do cartão com a câmara do telemóvel ou tablet do balcão. O cartão abre no Atendimento: carregue em «Dar carimbo».",
              "**Sem QR:** procure o cliente no Atendimento pelo nome, telemóvel ou código do cartão.",
            ],
          },
          { type: "h2", id: "recompensa", text: "Entregar a recompensa" },
          { type: "p", text: "Quando o cliente ganha uma recompensa, o cartão no telemóvel dele mostra-a (com uma pequena animação). Para a usar, leia o QR do cartão e carregue em «Entregar» no Atendimento. O cartão recomeça e os carimbos a mais passam para o novo." },
          { type: "h2", id: "recuperar", text: "Cliente que mudou de telemóvel" },
          {
            type: "ul",
            items: [
              "Se deixou email: «Já tinha cartão?» na página de adesão envia-lhe o link.",
              "Sem email: procure o cartão no Atendimento e carregue em «Mostrar QR do cartão». O cliente lê-o e o cartão volta a abrir.",
            ],
          },
          { type: "h2", id: "papel", text: "Carimbos do cartão de papel" },
          { type: "p", text: "Nos clientes do módulo, em «Mais», passe os carimbos que o cliente tinha no papel. O carimbo da visita de hoje pode ser dado logo a seguir." },
          { type: "callout", tone: "tip", text: "Errou um carimbo? «Retirar carimbo» no cartão do cliente. Se esse carimbo tinha completado o cartão, anula a recompensa por usar." },
        ],
      },
      en: {
        title: "Using the card day to day",
        description: "How to give stamps, hand over rewards, recover cards and move stamps from paper cards.",
        blocks: [
          { type: "h2", id: "stamping", text: "Giving a stamp" },
          {
            type: "ul",
            items: [
              "**With the QR (the main way):** scan the card's QR with the counter phone or tablet camera. The card opens in the «Atendimento» screen: tap «Give stamp».",
              "**Without the QR:** find the customer in the «Atendimento» screen by name, phone or card code.",
            ],
          },
          { type: "h2", id: "reward", text: "Handing over the reward" },
          { type: "p", text: "When a customer wins a reward, the card on their phone shows it (with a short animation). To use it, scan the card's QR and tap «Hand over» in the «Atendimento» screen. The card starts again and any extra stamps carry over." },
          { type: "h2", id: "recover", text: "A customer with a new phone" },
          {
            type: "ul",
            items: [
              "If they left an email: «Already have a card?» on the sign-up page sends them the link.",
              "Without an email: find the card in the «Atendimento» screen and tap «Show card QR». The customer scans it and the card opens again.",
            ],
          },
          { type: "h2", id: "paper", text: "Stamps from a paper card" },
          { type: "p", text: "In the module's customers, under «More», move the stamps the customer had on paper. Today's visit can be stamped right after." },
          { type: "callout", tone: "tip", text: "Stamped by mistake? «Remove stamp» on the customer's card. If that stamp completed the card, it takes back the unused reward." },
        ],
      },
      es: {
        title: "Uso diario de la tarjeta",
        description: "Cómo dar sellos, entregar recompensas, recuperar tarjetas y pasar los sellos de las tarjetas de papel.",
        blocks: [
          { type: "h2", id: "stamping", text: "Dar un sello" },
          {
            type: "ul",
            items: [
              "**Con el QR (la forma principal):** escanee el QR de la tarjeta con la cámara del móvil o la tableta del mostrador. La tarjeta se abre en la pantalla «Atendimento»: pulse «Dar sello».",
              "**Sin el QR:** busque al cliente en la pantalla «Atendimento» por nombre, teléfono o código de la tarjeta.",
            ],
          },
          { type: "h2", id: "reward", text: "Entregar la recompensa" },
          { type: "p", text: "Cuando el cliente gana una recompensa, la tarjeta en su móvil la muestra (con una pequeña animación). Para usarla, escanee el QR de la tarjeta y pulse «Entregar» en la pantalla «Atendimento». La tarjeta vuelve a empezar y los sellos de más pasan a la nueva." },
          { type: "h2", id: "recover", text: "Un cliente que ha cambiado de móvil" },
          {
            type: "ul",
            items: [
              "Si dejó su email: «¿Ya tenía tarjeta?» en la página de alta le envía el enlace.",
              "Sin email: busque la tarjeta en la pantalla «Atendimento» y pulse «Mostrar QR de la tarjeta». El cliente lo escanea y la tarjeta vuelve a abrirse.",
            ],
          },
          { type: "h2", id: "paper", text: "Sellos de una tarjeta de papel" },
          { type: "p", text: "En los clientes del módulo, en «Más», pase los sellos que el cliente tenía en papel. El sello de la visita de hoy puede darse justo después." },
          { type: "callout", tone: "tip", text: "¿Ha dado un sello por error? «Quitar sello» en la tarjeta del cliente. Si ese sello había completado la tarjeta, anula la recompensa sin usar." },
        ],
      },
      fr: {
        title: "Utilisation quotidienne de la carte",
        description: "Comment donner des tampons, remettre les récompenses, récupérer des cartes et reprendre les tampons des cartes papier.",
        blocks: [
          { type: "h2", id: "stamping", text: "Donner un tampon" },
          {
            type: "ul",
            items: [
              "**Avec le QR (la façon principale) :** scannez le QR de la carte avec l'appareil photo du téléphone ou de la tablette du comptoir. La carte s'ouvre dans l'écran «Atendimento» : appuyez sur «Donner un tampon».",
              "**Sans le QR :** cherchez le client dans l'écran «Atendimento» par nom, téléphone ou code de la carte.",
            ],
          },
          { type: "h2", id: "reward", text: "Remettre la récompense" },
          { type: "p", text: "Quand le client gagne une récompense, la carte sur son téléphone l'affiche (avec une petite animation). Pour l'utiliser, scannez le QR de la carte et appuyez sur «Remettre» dans l'écran «Atendimento». La carte recommence et les tampons en trop passent sur la nouvelle." },
          { type: "h2", id: "recover", text: "Un client qui a changé de téléphone" },
          {
            type: "ul",
            items: [
              "S'il a laissé un e-mail : «Vous aviez déjà une carte ?» sur la page d'inscription lui envoie le lien.",
              "Sans e-mail : cherchez la carte dans l'écran «Atendimento» et appuyez sur «Afficher le QR de la carte». Le client le scanne et la carte s'ouvre de nouveau.",
            ],
          },
          { type: "h2", id: "paper", text: "Tampons d'une carte papier" },
          { type: "p", text: "Dans les clients du module, sous «Plus», reportez les tampons que le client avait sur papier. Le tampon de la visite du jour peut être donné juste après." },
          { type: "callout", tone: "tip", text: "Un tampon donné par erreur ? «Retirer le tampon» sur la carte du client. Si ce tampon avait complété la carte, la récompense non utilisée est annulée." },
        ],
      },
      de: {
        title: "Die Karte im Alltag",
        description: "Wie Sie Stempel vergeben, Prämien einlösen, Karten wiederherstellen und Stempel von Papierkarten übertragen.",
        blocks: [
          { type: "h2", id: "stamping", text: "Einen Stempel vergeben" },
          {
            type: "ul",
            items: [
              "**Mit dem QR-Code (der Hauptweg):** Scannen Sie den QR-Code der Karte mit der Kamera des Handys oder Tablets an der Theke. Die Karte öffnet sich im Bildschirm «Atendimento»: Tippen Sie auf «Stempel vergeben».",
              "**Ohne QR-Code:** Suchen Sie den Kunden im Bildschirm «Atendimento» nach Name, Telefon oder Kartencode.",
            ],
          },
          { type: "h2", id: "reward", text: "Die Prämie einlösen" },
          { type: "p", text: "Gewinnt ein Kunde eine Prämie, zeigt die Karte auf seinem Handy sie an (mit einer kurzen Animation). Zum Einlösen scannen Sie den QR-Code der Karte und tippen im Bildschirm «Atendimento» auf «Einlösen». Die Karte beginnt von vorn, überzählige Stempel werden übernommen." },
          { type: "h2", id: "recover", text: "Ein Kunde mit neuem Handy" },
          {
            type: "ul",
            items: [
              "Hat er eine E-Mail hinterlassen: «Schon eine Karte?» auf der Anmeldeseite schickt ihm den Link.",
              "Ohne E-Mail: Suchen Sie die Karte im Bildschirm «Atendimento» und tippen Sie auf «QR-Code der Karte zeigen». Der Kunde scannt ihn und die Karte öffnet sich wieder.",
            ],
          },
          { type: "h2", id: "paper", text: "Stempel von einer Papierkarte" },
          { type: "p", text: "Übertragen Sie bei den Kunden des Moduls unter «Mehr» die Stempel, die der Kunde auf Papier hatte. Der Stempel für den heutigen Besuch kann direkt danach vergeben werden." },
          { type: "callout", tone: "tip", text: "Versehentlich gestempelt? «Stempel entfernen» auf der Karte des Kunden. Hatte dieser Stempel die Karte voll gemacht, wird die nicht eingelöste Prämie zurückgenommen." },
        ],
      },
      it: {
        title: "Uso quotidiano della carta",
        description: "Come dare i timbri, consegnare i premi, recuperare le carte e trasferire i timbri dalle tessere di carta.",
        blocks: [
          { type: "h2", id: "stamping", text: "Dare un timbro" },
          {
            type: "ul",
            items: [
              "**Con il QR (il modo principale):** inquadri il QR della carta con la fotocamera del telefono o del tablet del banco. La carta si apre nella schermata «Atendimento»: tocchi «Dare timbro».",
              "**Senza il QR:** cerchi il cliente nella schermata «Atendimento» per nome, telefono o codice della carta.",
            ],
          },
          { type: "h2", id: "reward", text: "Consegnare il premio" },
          { type: "p", text: "Quando il cliente ottiene un premio, la carta sul suo telefono lo mostra (con una breve animazione). Per usarlo, inquadri il QR della carta e tocchi «Consegna» nella schermata «Atendimento». La carta ricomincia e i timbri in più passano alla nuova." },
          { type: "h2", id: "recover", text: "Un cliente che ha cambiato telefono" },
          {
            type: "ul",
            items: [
              "Se ha lasciato l'email: «Ha già una carta?» nella pagina di adesione gli invia il link.",
              "Senza email: cerchi la carta nella schermata «Atendimento» e tocchi «Mostrare QR della carta». Il cliente lo inquadra e la carta si riapre.",
            ],
          },
          { type: "h2", id: "paper", text: "Timbri della tessera di carta" },
          { type: "p", text: "Nei clienti del modulo, in «Altro», trasferisca i timbri che il cliente aveva sulla carta. Il timbro della visita di oggi può essere dato subito dopo." },
          { type: "callout", tone: "tip", text: "Un timbro dato per errore? «Togliere timbro» sulla carta del cliente. Se quel timbro aveva completato la carta, annulla il premio non ancora usato." },
        ],
      },
    },
    troubleshooting: {
      pt: {
        title: "Resolução de problemas do cartão",
        description: "Soluções para problemas comuns: o carimbo é recusado, o cliente perdeu o cartão e a placa não abre.",
        blocks: [
          { type: "h2", id: "recusado", text: "O carimbo é recusado" },
          { type: "p", text: "Confirme que o cartão está ativo nas definições: em pausa, não se dão nem retiram carimbos." },
          { type: "h2", id: "perdeu", text: "O cliente perdeu o cartão" },
          { type: "p", text: "Use «Já tinha cartão?» (com email) ou «Mostrar QR do cartão» no Atendimento. Veja [utilização](/docs/cartao-fidelidade-digital/utilizacao)." },
          { type: "h2", id: "placa", text: "A placa não abre" },
          { type: "p", text: "A leitura por aproximação tem de estar ligada no telemóvel (no Android, nas definições de ligações). Em alternativa, o cliente lê o QR code impresso na placa." },
        ],
      },
      en: {
        title: "Loyalty card troubleshooting",
        description: "Fixes for common issues: the stamp is refused, the customer lost the card and the plate doesn't open.",
        blocks: [
          { type: "h2", id: "refused", text: "The stamp is refused" },
          { type: "p", text: "Check the card is active in the settings: while paused, stamps can't be given or removed." },
          { type: "h2", id: "lost", text: "The customer lost their card" },
          { type: "p", text: "Use «Already have a card?» (with email) or «Show card QR» in the «Atendimento» screen. See [usage](/en/docs/digital-loyalty-card/usage)." },
          { type: "h2", id: "plate", text: "The plate doesn't open" },
          { type: "p", text: "The phone's contactless (tap) reading must be on (on Android, in the connection settings). Otherwise, the customer scans the QR code printed on the plate." },
        ],
      },
      es: {
        title: "Solución de problemas de la tarjeta",
        description: "Soluciones a problemas habituales: el sello se rechaza, el cliente perdió la tarjeta y la placa no se abre.",
        blocks: [
          { type: "h2", id: "refused", text: "El sello se rechaza" },
          { type: "p", text: "Compruebe que la tarjeta está activa en los ajustes: en pausa, no se pueden dar ni quitar sellos." },
          { type: "h2", id: "lost", text: "El cliente perdió la tarjeta" },
          { type: "p", text: "Use «¿Ya tenía tarjeta?» (con email) o «Mostrar QR de la tarjeta» en la pantalla «Atendimento». Vea [uso diario](/es/docs/digital-loyalty-card/usage)." },
          { type: "h2", id: "plate", text: "La placa no se abre" },
          { type: "p", text: "La lectura por proximidad (con un toque) tiene que estar activada en el móvil (en Android, en los ajustes de conexiones). Si no, el cliente escanea el código QR impreso en la placa." },
        ],
      },
      fr: {
        title: "Résolution des problèmes de la carte",
        description: "Solutions aux problèmes courants : le tampon est refusé, le client a perdu sa carte et la plaque ne s'ouvre pas.",
        blocks: [
          { type: "h2", id: "refused", text: "Le tampon est refusé" },
          { type: "p", text: "Vérifiez que la carte est active dans les paramètres : en pause, on ne peut ni donner ni retirer de tampons." },
          { type: "h2", id: "lost", text: "Le client a perdu sa carte" },
          { type: "p", text: "Utilisez «Vous aviez déjà une carte ?» (avec e-mail) ou «Afficher le QR de la carte» dans l'écran «Atendimento». Voir l'[utilisation](/fr/docs/digital-loyalty-card/usage)." },
          { type: "h2", id: "plate", text: "La plaque ne s'ouvre pas" },
          { type: "p", text: "La lecture sans contact (d'un toucher) doit être activée sur le téléphone (sur Android, dans les paramètres de connexion). Sinon, le client scanne le QR code imprimé sur la plaque." },
        ],
      },
      de: {
        title: "Fehlerbehebung für die Kundenkarte",
        description: "Lösungen für häufige Probleme: Der Stempel wird abgelehnt, der Kunde hat die Karte verloren und das Schild öffnet nichts.",
        blocks: [
          { type: "h2", id: "refused", text: "Der Stempel wird abgelehnt" },
          { type: "p", text: "Prüfen Sie in den Einstellungen, ob die Karte aktiv ist: Im Pausenmodus können keine Stempel vergeben oder entfernt werden." },
          { type: "h2", id: "lost", text: "Der Kunde hat die Karte verloren" },
          { type: "p", text: "Nutzen Sie «Schon eine Karte?» (mit E-Mail) oder «QR-Code der Karte zeigen» im Bildschirm «Atendimento». Siehe [Nutzung](/de/docs/digital-loyalty-card/usage)." },
          { type: "h2", id: "plate", text: "Das Schild öffnet nichts" },
          { type: "p", text: "Das kontaktlose Lesen (per Antippen) muss auf dem Handy eingeschaltet sein (bei Android in den Verbindungseinstellungen). Andernfalls scannt der Kunde den auf dem Schild gedruckten QR-Code." },
        ],
      },
      it: {
        title: "Risoluzione dei problemi della carta",
        description: "Soluzioni ai problemi più comuni: il timbro viene rifiutato, il cliente ha perso la carta e la targa non si apre.",
        blocks: [
          { type: "h2", id: "refused", text: "Il timbro viene rifiutato" },
          { type: "p", text: "Verifichi che la carta sia attiva nelle impostazioni: in pausa non si possono dare né togliere timbri." },
          { type: "h2", id: "lost", text: "Il cliente ha perso la carta" },
          { type: "p", text: "Usi «Ha già una carta?» (con email) o «Mostrare QR della carta» nella schermata «Atendimento». Veda l'[uso quotidiano](/it/docs/digital-loyalty-card/usage)." },
          { type: "h2", id: "plate", text: "La targa non si apre" },
          { type: "p", text: "La lettura di prossimità (con un tocco) deve essere attiva sul telefono (su Android, nelle impostazioni delle connessioni). In alternativa, il cliente inquadra il QR code stampato sulla targa." },
        ],
      },
    },
    faq: {
      pt: {
        title: "Perguntas frequentes sobre o cartão de fidelidade digital",
        description: "Respostas às dúvidas mais comuns: apps, telemóveis compatíveis, fraude, dados e cancelamento.",
        blocks: [
          { type: "h2", id: "perguntas", text: "Perguntas e respostas" },
          {
            type: "faq",
            items: [
              { q: "O cliente precisa de instalar uma app?", a: "Não. O cartão abre no navegador e pode ficar no ecrã principal do telemóvel." },
              { q: "O cartão fica na Apple Wallet ou na Google Wallet?", a: "Ainda não. É uma página no telemóvel, que pode ficar no ecrã principal." },
              { q: "Que telemóveis funcionam?", a: "Qualquer telemóvel com câmara usa o QR code. Os iPhone XS e mais recentes e a maioria dos Android com a leitura por aproximação ligada também leem a placa." },
              { q: "Como evito carimbos falsos?", a: "Só a equipa dá carimbos, pelo Atendimento (com sessão iniciada). O cliente não consegue carimbar sozinho." },
              { q: "Que dados são guardados?", a: "O nome (email e telemóvel opcionais) e o registo de carimbos e recompensas, de acordo com o RGPD." },
              { q: "Posso cancelar o plano?", a: "Sim, o plano é mensal e sem fidelização. Recomendamos avisar os clientes para usarem as recompensas que já ganharam." },
            ],
          },
        ],
      },
      en: {
        title: "Digital loyalty card FAQ",
        description: "Answers to common questions: apps, compatible phones, fraud, data and cancelling.",
        blocks: [
          { type: "h2", id: "questions", text: "Questions and answers" },
          {
            type: "faq",
            items: [
              { q: "Do customers need to install an app?", a: "No. The card opens in the browser and can sit on the phone's home screen." },
              { q: "Does the card go in Apple Wallet or Google Wallet?", a: "Not yet. It's a page on the phone that can sit on the home screen." },
              { q: "Which phones work?", a: "Any phone with a camera can use the QR code. iPhone XS and newer and most Android phones with contactless reading on also read the plate." },
              { q: "How do I prevent fake stamps?", a: "Only your staff give stamps, from the «Atendimento» screen (signed in). Customers can't stamp their own card." },
              { q: "What data is stored?", a: "The name (email and phone optional) and the record of stamps and rewards, in line with GDPR." },
              { q: "Can I cancel the plan?", a: "Yes, the plan is monthly with no minimum term. We recommend telling customers so they can use rewards they've already earned." },
            ],
          },
        ],
      },
      es: {
        title: "Preguntas frecuentes sobre la tarjeta de cliente digital",
        description: "Respuestas a las dudas más habituales: apps, móviles compatibles, fraude, datos y cancelación.",
        blocks: [
          { type: "h2", id: "questions", text: "Preguntas y respuestas" },
          {
            type: "faq",
            items: [
              { q: "¿El cliente tiene que instalar una app?", a: "No. La tarjeta se abre en el navegador y puede quedarse en la pantalla de inicio del móvil." },
              { q: "¿La tarjeta va en Apple Wallet o en Google Wallet?", a: "Todavía no. Es una página en el móvil que puede quedarse en la pantalla de inicio." },
              { q: "¿Qué móviles funcionan?", a: "Cualquier móvil con cámara puede usar el código QR. Los iPhone XS y posteriores y la mayoría de los Android con la lectura por proximidad activada también leen la placa." },
              { q: "¿Cómo evito sellos falsos?", a: "Solo su equipo da sellos, desde la pantalla «Atendimento» (con sesión iniciada). El cliente no puede sellar su tarjeta por sí solo." },
              { q: "¿Qué datos se guardan?", a: "El nombre (email y teléfono opcionales) y el registro de sellos y recompensas, conforme al RGPD." },
              { q: "¿Puedo cancelar el plan?", a: "Sí, el plan es mensual y sin permanencia. Le recomendamos avisar a los clientes para que usen las recompensas que ya han ganado." },
            ],
          },
        ],
      },
      fr: {
        title: "Questions fréquentes sur la carte de fidélité digitale",
        description: "Réponses aux questions les plus courantes : applications, téléphones compatibles, fraude, données et résiliation.",
        blocks: [
          { type: "h2", id: "questions", text: "Questions et réponses" },
          {
            type: "faq",
            items: [
              { q: "Le client doit-il installer une application ?", a: "Non. La carte s'ouvre dans le navigateur et peut rester sur l'écran d'accueil du téléphone." },
              { q: "La carte va-t-elle dans Apple Wallet ou Google Wallet ?", a: "Pas encore. C'est une page sur le téléphone, qui peut rester sur l'écran d'accueil." },
              { q: "Quels téléphones fonctionnent ?", a: "Tout téléphone avec un appareil photo peut utiliser le QR code. Les iPhone XS et plus récents et la plupart des Android avec la lecture sans contact activée lisent aussi la plaque." },
              { q: "Comment éviter les faux tampons ?", a: "Seule votre équipe donne des tampons, depuis l'écran «Atendimento» (connectée). Le client ne peut pas tamponner sa carte lui-même." },
              { q: "Quelles données sont conservées ?", a: "Le prénom (e-mail et téléphone facultatifs) et l'historique des tampons et des récompenses, conformément au RGPD." },
              { q: "Puis-je résilier l'abonnement ?", a: "Oui, l'abonnement est mensuel et sans engagement. Nous vous conseillons de prévenir vos clients pour qu'ils utilisent les récompenses déjà gagnées." },
            ],
          },
        ],
      },
      de: {
        title: "Häufige Fragen zur digitalen Kundenkarte",
        description: "Antworten auf die häufigsten Fragen: Apps, kompatible Handys, Betrug, Daten und Kündigung.",
        blocks: [
          { type: "h2", id: "questions", text: "Fragen und Antworten" },
          {
            type: "faq",
            items: [
              { q: "Muss der Kunde eine App installieren?", a: "Nein. Die Karte öffnet sich im Browser und kann auf dem Startbildschirm des Handys bleiben." },
              { q: "Kommt die Karte in Apple Wallet oder Google Wallet?", a: "Noch nicht. Sie ist eine Seite auf dem Handy, die auf dem Startbildschirm bleiben kann." },
              { q: "Welche Handys funktionieren?", a: "Jedes Handy mit Kamera kann den QR-Code nutzen. iPhone XS und neuer sowie die meisten Android-Handys mit eingeschaltetem kontaktlosem Lesen lesen auch das Schild." },
              { q: "Wie verhindere ich falsche Stempel?", a: "Nur Ihr Team vergibt Stempel, im Bildschirm «Atendimento» (angemeldet). Kunden können ihre Karte nicht selbst stempeln." },
              { q: "Welche Daten werden gespeichert?", a: "Der Name (E-Mail und Telefon optional) und die Aufzeichnung von Stempeln und Prämien, gemäß DSGVO." },
              { q: "Kann ich den Tarif kündigen?", a: "Ja, der Tarif ist monatlich und ohne Mindestlaufzeit. Wir empfehlen, die Kunden vorher zu informieren, damit sie bereits verdiente Prämien einlösen können." },
            ],
          },
        ],
      },
      it: {
        title: "Domande frequenti sulla carta fedeltà digitale",
        description: "Risposte ai dubbi più comuni: app, telefoni compatibili, frodi, dati e disdetta.",
        blocks: [
          { type: "h2", id: "questions", text: "Domande e risposte" },
          {
            type: "faq",
            items: [
              { q: "Il cliente deve installare un'app?", a: "No. La carta si apre nel browser e può restare nella schermata home del telefono." },
              { q: "La carta va in Apple Wallet o in Google Wallet?", a: "Non ancora. È una pagina sul telefono, che può restare nella schermata home." },
              { q: "Quali telefoni funzionano?", a: "Qualsiasi telefono con fotocamera può usare il QR code. Gli iPhone XS e successivi e la maggior parte degli Android con la lettura di prossimità attiva leggono anche la targa." },
              { q: "Come evito timbri falsi?", a: "Solo il Suo staff dà i timbri, dalla schermata «Atendimento» (con accesso effettuato). Il cliente non può timbrare la carta da solo." },
              { q: "Quali dati vengono salvati?", a: "Il nome (email e telefono facoltativi) e lo storico di timbri e premi, nel rispetto del GDPR." },
              { q: "Posso disdire il piano?", a: "Sì, il piano è mensile e senza vincoli. Le consigliamo di avvisare i clienti perché usino i premi già ottenuti." },
            ],
          },
        ],
      },
    },
  },
};

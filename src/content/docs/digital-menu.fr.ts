import type { DocPageContent, DocPageId } from "../types";

export const fr: Record<DocPageId, DocPageContent> = {
  "getting-started": {
    title: "Premiers pas avec le menu digital",
    description:
      "Comment fonctionne le menu en vidéo de Steevanz : une vidéo par plat, avec son prix, ouverte d'un toucher ou par le QR code de la plaque de table, avec la commande à table si vous le souhaitez.",
    blocks: [
      {
        type: "p",
        text: "Le menu digital, c'est la carte de votre établissement en vidéo. Chaque plat a sa propre vidéo verticale, avec son nom, son prix et sa description, sur une page propre à votre établissement. Vos clients l'ouvrent d'un toucher ou par le QR code de la plaque ronde posée sur chaque table, sans rien installer.",
      },
      {
        type: "p",
        text: "Comme tous les produits Steevanz, c'est un service géré : nous montons le menu, hébergeons les vidéos, puis programmons et testons les plaques. Cette documentation vous aide à préparer les vidéos et à tirer le meilleur parti du menu.",
      },
      { type: "h2", id: "whats-included", text: "Ce qui est inclus" },
      {
        type: "table",
        head: ["Élément", "Détail"],
        rows: [
          ["Menu en vidéo", "La page de votre établissement avec votre logo, vos collections et une vidéo verticale par plat, avec nom, prix et description"],
          ["Commande à table (en option)", "La table commande depuis les téléphones et votre équipe confirme en scannant un QR code"],
          ["Six langues", "Portugais, anglais, espagnol, français, allemand et italien : chaque client choisit la sienne avec le bouton du drapeau"],
          ["Plaque ronde", "Autocollant rond de table ou socle rond de table, un par table"],
          ["QR code imprimé", "Pour les téléphones qui ne lisent pas d'un toucher ou dont cette option est désactivée"],
          ["Mise en place et hébergement", "Nous montons le menu et hébergeons le menu et les vidéos"],
          ["Guide de tournage", "Un guide pour filmer les vidéos de vos plats avec un téléphone"],
        ],
      },
      { type: "h2", id: "pricing", text: "Tarifs" },
      {
        type: "table",
        head: ["Quantité", "Prix", "Par plaque"],
        rows: [
          ["De 1 à 9 plaques", "20 € l'unité", "20 €"],
          ["10 plaques ou plus", "15 € l'unité (10 plaques : 150 €)", "15 €"],
        ],
      },
      {
        type: "p",
        text: "Votre logo et les couleurs de votre marque sont facturés une seule fois par commande (le design est fait une fois pour toutes les plaques), et non par plaque. La mise en place du menu et l'hébergement du menu et des vidéos coûtent 30 € par mois + TVA.",
      },
      { type: "h2", id: "how-it-works", text: "Comment ça marche" },
      {
        type: "ol",
        items: [
          "Le client s'installe et touche la plaque avec son téléphone (ou scanne le QR code).",
          "Le menu s'ouvre sur une animation de votre logo, en haut de la page.",
          "Les plats défilent en vidéo dans une grille. Un toucher les ouvre en plein écran, comme les Reels, et on glisse vers le haut ou vers le bas pour voir les autres.",
          "Avec la commande à table activée, le client touche «Ajouter» sur les plats et commande directement depuis le menu.",
        ],
      },
      { type: "h2", id: "next-steps", text: "Étapes suivantes" },
      {
        type: "ul",
        items: [
          "[Installation](/fr/docs/digital-menu/setup) : filmer les vidéos, nous envoyer le menu et poser les plaques.",
          "[Configuration](/fr/docs/digital-menu/configuration) : changer les plats et les prix et activer la commande à table.",
          "[Utilisation](/fr/docs/digital-menu/usage) : des vidéos qui fonctionnent et la commande à table au quotidien.",
        ],
      },
    ],
  },
  setup: {
    title: "Installer le menu digital",
    description: "Filmez les vidéos de vos plats, envoyez-nous le menu et posez les plaques sur vos tables.",
    blocks: [
      { type: "h2", id: "film-videos", text: "1. Filmer les vidéos" },
      {
        type: "p",
        text: "Chaque plat a sa propre vidéo. Filmez-les avec votre téléphone, à la verticale : nous vous donnons un guide pour filmer les vidéos.",
      },
      {
        type: "steps",
        items: [
          { title: "Une vidéo par plat", body: "À la verticale, avec le plat tel qu'il arrive à table." },
          { title: "Pas de texte par-dessus", body: "Inutile d'écrire le nom ou le prix sur la vidéo : le menu les affiche par-dessus." },
          { title: "Court", body: "Quelques secondes suffisent pour montrer le plat. Les vidéos courtes retiennent mieux l'attention." },
        ],
      },
      { type: "h2", id: "send-menu", text: "2. Nous envoyer le menu" },
      {
        type: "p",
        text: "Envoyez-nous les vidéos et, pour chaque plat, son nom, son prix et une courte description, classés dans les collections de votre choix (par exemple Brunch et Boissons). Envoyez-nous aussi votre logo. Nous montons le menu et vous le montrons avant de le mettre sur les tables.",
      },
      {
        type: "callout",
        tone: "tip",
        title: "Commande à table",
        text: "Si vous voulez que les tables commandent depuis leurs téléphones, dites-nous combien de tables vous avez. Chaque table reçoit sa propre plaque, avec son propre lien et son propre QR code.",
      },
      { type: "h2", id: "place-plates", text: "3. Poser les plaques" },
      {
        type: "ul",
        items: [
          "Une plaque par table, à un endroit visible et à portée de main (au centre de la table ou près du porte-serviettes).",
          "Avec la commande à table, chaque plaque appartient à une table : posez chacune sur sa table.",
          "Nettoyez la surface avant de coller l'autocollant et appuyez quelques secondes.",
          "Évitez les surfaces métalliques : le métal bloque le signal de la plaque. Utilisez alors le socle rond de table.",
        ],
      },
    ],
  },
  configuration: {
    title: "Configurer le menu digital",
    description: "Changez les plats, les prix et les collections, et activez ou désactivez la commande à table.",
    blocks: [
      { type: "h2", id: "dishes-prices", text: "Changer les plats et les prix" },
      {
        type: "p",
        text: "Steevanz gère le menu. Pour changer un prix, ajouter ou retirer un plat, remplacer une vidéo ou réorganiser les collections, envoyez-nous un message : nous mettons le menu à jour et les plaques restent les mêmes.",
      },
      { type: "h2", id: "collections", text: "Collections" },
      {
        type: "p",
        text: "Les plats sont regroupés en collections, par exemple Brunch et Boissons. Elles sont toutes sur la même page, une rubrique après l'autre, et le bouton ☰ mène le client directement à chacune.",
      },
      { type: "h2", id: "languages", text: "Langues" },
      {
        type: "p",
        text: "Le menu se lit en six langues : portugais, anglais, espagnol, français, allemand et italien. Il s'ouvre dans la langue du téléphone du client (ou dans celle qu'il a choisie la dernière fois), et le bouton du drapeau, à côté de ☰, change de langue sans recharger la page, pendant que les vidéos continuent de tourner. Les boutons du menu et la commande à table sont déjà traduits ; les noms et descriptions des plats et les noms des rubriques se traduisent plat par plat, et ce qui n'a pas de traduction s'affiche en portugais. Les prix s'affichent au format de chaque langue.",
      },
      { type: "h2", id: "table-ordering", text: "Commande à table" },
      {
        type: "p",
        text: "La commande à table s'active ou se désactive menu par menu. Sans elle, la plaque ouvre le menu simplement pour le consulter. Chaque table a sa propre plaque, avec son propre lien et son propre QR code ; s'il vous faut plus de tables, demandez-le-nous.",
      },
      {
        type: "callout",
        tone: "warning",
        text: "Si le code d'une table est changé, l'ancien lien ne fonctionne plus et la plaque de cette table doit être remplacée.",
      },
      { type: "h2", id: "customisation", text: "Personnalisation" },
      {
        type: "p",
        text: "Le menu porte votre logo. Les plaques peuvent porter votre logo, les couleurs de votre marque et un court texte, par exemple «Touchez pour voir le menu». Le design des plaques est fait une fois par commande.",
      },
    ],
  },
  usage: {
    title: "Utiliser le menu digital",
    description: "Les bonnes pratiques pour que le menu digital aide vos clients à choisir, et la commande à table au quotidien.",
    blocks: [
      { type: "h2", id: "videos-that-work", text: "Des vidéos qui fonctionnent" },
      {
        type: "ul",
        items: [
          "Montrez le plat tel qu'il arrive à table, avec une bonne lumière.",
          "Filmez toujours à la verticale : c'est ainsi que le menu affiche les vidéos.",
          "Les vidéos courtes retiennent mieux l'attention que les longues.",
          "Mettez en premier vos plats les plus commandés, ou ceux que vous voulez vendre davantage.",
        ],
      },
      { type: "h2", id: "ordering-day-to-day", text: "La commande à table au quotidien" },
      {
        type: "ol",
        items: [
          "Tous les téléphones de la table voient la même commande en temps réel. Chacun touche «Ajouter» sur les plats et peut ajouter une remarque, comme «sans oignon».",
          "«Commander» affiche un QR code et le numéro de la commande sur le téléphone.",
          "Votre personnel scanne le QR code avec l'appareil photo de son téléphone, sans application ni identifiant, et voit la table, l'heure, les plats avec leurs remarques et le total. Cette page est toujours en portugais et indique la langue dans laquelle le client a commandé.",
          "Il touche «Confirmar pedido» (confirmer la commande) et la table voit aussitôt «Commande confirmée ✓».",
        ],
      },
      {
        type: "callout",
        tone: "info",
        text: "Les numéros de commande repartent de zéro chaque jour.",
      },
      { type: "h2", id: "team", text: "Votre équipe" },
      {
        type: "p",
        text: "Dites à vos clients, quand ils s'installent, qu'ils peuvent voir les plats sur leur téléphone. Une invitation de l'équipe augmente nettement le nombre de touchers.",
      },
      { type: "h2", id: "pair-with-reviews", text: "Associez-le aux avis Google" },
      {
        type: "p",
        text: "Sur la même table, la plaque d'avis Google demande un avis à la fin du repas. Le menu aide à choisir au début ; les avis aident de nouveaux clients à vous trouver.",
      },
    ],
  },
  troubleshooting: {
    title: "Résoudre les problèmes du menu digital",
    description: "Que faire quand une plaque n'ouvre pas le menu ou qu'une commande n'arrive pas.",
    blocks: [
      {
        type: "table",
        head: ["Problème", "Que faire"],
        rows: [
          ["Le téléphone ne réagit pas au toucher", "Vérifiez que la lecture sans contact (un toucher) est activée dans les paramètres de connexion (Android) et approchez le haut du téléphone du centre de la plaque. Ou scannez le QR code."],
          ["La plaque ouvre une page qui n'existe pas", "Le code de la table a peut-être été changé ou le menu désactivé. Contactez-nous."],
          ["Les vidéos mettent du temps à démarrer", "Vérifiez la connexion internet du téléphone (wifi ou données mobiles). Si cela arrive toujours, prévenez-nous."],
          ["Le personnel n'arrive pas à scanner le QR code de la commande", "Demandez au client d'augmenter la luminosité de son écran et rapprochez l'appareil photo du code."],
          ["La plaque ne fonctionne pas sur du métal", "Remplacez l'autocollant par le socle rond de table."],
          ["Les prix ne sont plus à jour", "Envoyez-nous les nouveaux prix : nous mettons le menu à jour et les plaques restent les mêmes."],
        ],
      },
      {
        type: "callout",
        tone: "info",
        text: "Si une plaque est abîmée, contactez-nous : nous la remplaçons.",
      },
    ],
  },
  faq: {
    title: "Questions fréquentes sur le menu digital",
    description: "Des réponses rapides sur le menu en vidéo, la commande à table et les plaques.",
    blocks: [
      {
        type: "faq",
        items: [
          { q: "Le client doit-il installer une application ?", a: "Non. Le menu s'ouvre dans le navigateur du téléphone. Ni vos clients ni votre équipe n'ont besoin d'une application." },
          { q: "Ai-je besoin d'Instagram ou de YouTube ?", a: "Non. Le menu a sa propre page chez Steevanz et nous hébergeons les vidéos." },
          { q: "Est-ce que ça marche sur iPhone et Android ?", a: "Oui. Les iPhone récents lisent la plaque sans rien activer ; sur Android, l'option de lecture sans contact (un toucher) doit être activée. Il y a toujours le QR code imprimé." },
          { q: "Est-ce que ça remplace la carte papier ?", a: "Ça la complète. Voir les plats en vidéo aide à choisir, mais la carte papier reste utile pour ceux qui la préfèrent." },
          { q: "Combien ça coûte ?", a: "20 € par plaque, ou 15 € par plaque à partir de 10 plaques. Le logo est facturé une fois par commande. La mise en place et l'hébergement du menu coûtent 30 € par mois + TVA." },
          { q: "Qui filme les vidéos ?", a: "En général l'établissement lui-même, avec un téléphone : nous vous donnons un guide pour filmer les vidéos. Nous montons le menu et hébergeons les vidéos." },
          { q: "Dans quelles langues est le menu ?", a: "En six : portugais, anglais, espagnol, français, allemand et italien. Le menu s'ouvre dans la langue du téléphone et le client la change avec le bouton du drapeau. Ce qui n'est pas encore traduit s'affiche en portugais." },
          { q: "La commande à table est-elle obligatoire ?", a: "Non. Elle s'active ou se désactive menu par menu. Sans elle, la plaque ouvre le menu simplement pour le consulter." },
          { q: "Puis-je changer le menu plus tard ?", a: "Oui, sans changer les plaques. Envoyez-nous les nouveaux plats, prix ou vidéos et nous mettons le menu à jour." },
        ],
      },
    ],
  },
};

import type { DocPageContent, DocPageId } from "../types";

export const fr: Record<DocPageId, DocPageContent> = {
  "getting-started": {
    title: "Premiers pas avec le livret d'accueil digital",
    description:
      "Ce qu'est le livret d'accueil digital, ce qu'il comprend, combien il coûte et comment les voyageurs l'ouvrent d'un toucher sur une plaque à l'intérieur du logement.",
    blocks: [
      {
        type: "p",
        text: "Le livret d'accueil digital est une page pour téléphone qui réunit tout ce que les voyageurs doivent savoir pendant leur séjour : wifi, arrivée et départ, règles de la maison, électroménager, poubelles, urgences et vos recommandations. Il existe en portugais, en anglais et dans deux autres langues, et s'ouvre d'un toucher sur une plaque placée à l'intérieur du logement, ou par le QR code imprimé sur la même plaque.",
      },
      {
        type: "p",
        text: "C'est un service clés en main : nous rédigeons, traduisons, publions et tenons le livret à jour. Rien à installer, aucun nouvel outil à apprendre.",
      },
      { type: "h2", id: "whats-included", text: "Ce qui est inclus" },
      {
        type: "table",
        head: ["Élément", "Détail"],
        rows: [
          ["Rédaction du livret", "Nous transformons vos notes, vos photos ou votre livret actuel en une page claire, organisée par thème"],
          ["Quatre langues", "Portugais, anglais et deux autres au choix (français, espagnol, allemand ou italien), relues par nous"],
          ["Plaques à toucher", "Plaque murale, chevalet ou autocollant, avec QR code, à placer à l'intérieur du logement"],
          ["Version imprimable", "Un PDF au même contenu, pour laisser un exemplaire papier dans le logement"],
          ["Hébergement et modifications", "Hébergement de la page et modifications faites par nous sous deux jours ouvrés"],
        ],
      },
      { type: "h2", id: "pricing", text: "Tarifs" },
      {
        type: "table",
        head: ["Logements", "Plaques (une par logement)", "Abonnement"],
        rows: [
          ["De 1 à 9 logements", "20 € l'unité", "30 €/mois par compte"],
          ["10 logements ou plus", "15 € l'unité (10 plaques : 150 €)", "30 €/mois par compte"],
        ],
      },
      {
        type: "p",
        text: "Les plaques se paient une fois et, à l'inscription, la 1re plaque est offerte. La rédaction des livrets, la traduction en quatre langues, l'hébergement en ligne et les modifications coûtent 30 € par mois par compte, quel que soit le nombre de logements. Par exemple, 3 logements : 2 plaques × 20 € (la 1re est offerte) + 30 €/mois, + TVA. Les langues en plus ont un petit coût, indiqué dans votre devis. Prix + TVA, indicatifs et confirmés après la démonstration.",
      },
      { type: "h2", id: "how-it-works", text: "Comment ça marche pour les voyageurs" },
      {
        type: "ol",
        items: [
          "Le voyageur entre et approche son téléphone de la plaque (ou scanne le QR code).",
          "Le livret s'ouvre dans la langue du téléphone, avec un bouton pour changer de langue.",
          "Il trouve le wifi (avec un bouton pour copier le mot de passe), les règles de la maison et vos recommandations sans avoir à vous écrire.",
        ],
      },
      {
        type: "callout",
        tone: "info",
        title: "Ce que le livret ne contient jamais",
        text: "Les codes de la porte, de la boîte à clés ou de l'alarme. Ceux-là continuent de partir dans votre message d'arrivée.",
      },
      { type: "h2", id: "next-steps", text: "Étapes suivantes" },
      {
        type: "ul",
        items: [
          "[Installation](/fr/docs/digital-guest-guide/setup) : quelles informations nous envoyer et où placer la plaque.",
          "[Configuration](/fr/docs/digital-guest-guide/configuration) : langues, rubriques et comment demander des modifications.",
          "[Utilisation](/fr/docs/digital-guest-guide/usage) : les bonnes pratiques pour que les voyageurs lisent vraiment le livret.",
        ],
      },
    ],
  },
  setup: {
    title: "Mettre en place le livret d'accueil digital",
    description: "Les informations dont nous avons besoin pour rédiger le livret, comment vous validez le brouillon et où placer la plaque dans le logement.",
    blocks: [
      { type: "h2", id: "send-information", text: "1. Envoyez-nous les informations" },
      {
        type: "p",
        text: "Envoyez-les comme cela vous arrange : un document, des photos, le livret papier que vous avez déjà ou un message vocal WhatsApp. Nous nous chargeons de les organiser.",
      },
      {
        type: "table",
        head: ["Thème", "Ce qu'il faut nous dire"],
        rows: [
          ["Arrivée et départ", "Horaires, comment laisser les clés, que faire des poubelles et du linge"],
          ["Wifi", "Nom du réseau et mot de passe"],
          ["Le logement", "Comment fonctionnent les plaques de cuisson, le four, le lave-linge, le chauffage, la climatisation et l'eau chaude"],
          ["Règles", "Règles de la maison et de l'immeuble, heures de calme, tabac, animaux, fêtes"],
          ["Poubelles et tri", "Où sont les conteneurs et comment trier les déchets"],
          ["Accès et stationnement", "Depuis l'aéroport et la gare, stationnement et transports en commun"],
          ["Urgences", "Votre contact, la pharmacie, l'hôpital et le centre de santé les plus proches"],
          ["Recommandations", "Restaurants, plages, balades et boutiques que vous recommandez"],
          ["Mentions légales", "Numéro d'enregistrement (RNAL)"],
        ],
      },
      {
        type: "callout",
        tone: "warning",
        title: "Ne nous envoyez pas de codes d'accès",
        text: "Les codes de la porte, de la boîte à clés et de l'alarme n'entrent jamais dans le livret. Si l'un d'eux nous parvient par erreur, nous ne le publions pas.",
      },
      { type: "h2", id: "approve", text: "2. Validez le brouillon" },
      {
        type: "p",
        text: "Sous trois jours ouvrés environ, nous vous envoyons un lien vers le brouillon en portugais et dans les autres langues. Demandez toutes les corrections que vous voulez. Nous ne publions qu'après votre validation.",
      },
      { type: "h2", id: "place-plate", text: "3. Placez la plaque" },
      {
        type: "p",
        text: "La plaque arrive programmée et testée sous deux à quatre jours ouvrés. Placez-la à l'intérieur du logement, à un endroit que les voyageurs voient en entrant.",
      },
      {
        type: "table",
        head: ["Format", "Où il fonctionne le mieux"],
        rows: [
          ["Plaque murale", "Près de la porte d'entrée, côté intérieur"],
          ["Chevalet", "Sur la table du salon, le plan de travail de la cuisine ou à la réception"],
          ["Autocollant", "Sur le réfrigérateur ou le miroir de l'entrée"],
        ],
      },
      {
        type: "callout",
        tone: "tip",
        text: "Évitez la porte extérieure : le livret contient le mot de passe du wifi et ne doit être accessible qu'aux personnes qui séjournent sur place.",
      },
    ],
  },
  configuration: {
    title: "Configurer le livret d'accueil digital",
    description: "Langues, rubriques du livret, la rubrique «Évaluez votre séjour», le lien vers votre site et comment demander des modifications.",
    blocks: [
      { type: "h2", id: "languages", text: "Langues" },
      {
        type: "p",
        text: "Le livret comprend le portugais, l'anglais et deux autres langues de votre choix parmi le français, l'espagnol, l'allemand et l'italien. Il s'ouvre automatiquement dans la langue du téléphone du voyageur et propose un sélecteur. S'il vous faut plus de langues, nous en incluons le coût dans votre devis.",
      },
      { type: "h2", id: "sections", text: "Rubriques" },
      {
        type: "ul",
        items: [
          "Bienvenue",
          "Arrivée et départ",
          "Wifi, avec un bouton pour copier le mot de passe",
          "Comment fonctionne le logement : électroménager, chauffage, climatisation et eau chaude",
          "Règles de la maison et de l'immeuble",
          "Poubelles et tri",
          "Bruit et voisinage",
          "Urgences : 112, votre contact, pharmacie, hôpital et centre de santé",
          "Accès et stationnement",
          "Recommandations de l'hôte",
          "Taxe de séjour : ce que c'est et pourquoi elle est perçue",
          "Évaluez votre séjour",
          "Livre de réclamations et numéro d'enregistrement",
        ],
      },
      {
        type: "p",
        text: "Ensemble, ces rubriques reprennent le contenu que la loi portugaise exige dans le livret d'information d'une location de vacances (alojamento local) : fonctionnement du logement, règles, déchets, électroménager, bruit, règles de l'immeuble et contact du responsable, en portugais, en anglais et dans deux autres langues.",
      },
      { type: "h2", id: "review-your-stay", text: "La rubrique «Évaluez votre séjour»" },
      {
        type: "p",
        text: "Elle est la même pour tous les voyageurs : elle explique que Booking.com envoie sa demande d'avis par e-mail et Airbnb dans l'application (dans Voyages), après le départ, et que leur avis aide d'autres voyageurs. Elle n'offre ni réduction ni cadeau et ne demande pas de note précise, car les plateformes l'interdisent. Si votre logement a une fiche Google, nous pouvons ajouter le lien Google.",
      },
      { type: "h2", id: "website", text: "Lien vers votre site" },
      {
        type: "p",
        text: "Si vous avez votre propre site, nous pouvons afficher un lien discret «Site officiel». Il est désactivé par défaut : Airbnb interdit d'inciter les voyageurs à réserver hors de la plateforme, nous n'utilisons donc jamais de phrases comme «réservez en direct et économisez».",
      },
      { type: "h2", id: "changes", text: "Demander des modifications" },
      {
        type: "p",
        text: "Envoyez-nous ce qui a changé par WhatsApp ou par e-mail. Nous mettons à jour le livret et le PDF sous deux jours ouvrés, dans toutes les langues. La plaque n'a jamais besoin d'être remplacée.",
      },
    ],
  },
  usage: {
    title: "Utiliser le livret d'accueil digital",
    description: "Les bonnes pratiques pour que les voyageurs trouvent et utilisent le livret, et comment il fonctionne avec l'assistant WhatsApp.",
    blocks: [
      { type: "h2", id: "let-guests-know", text: "Faites connaître le livret aux voyageurs" },
      {
        type: "ul",
        items: [
          "Mentionnez-le dans votre message d'arrivée : «En arrivant, touchez la plaque près de la porte pour le wifi et tout ce qu'il faut savoir sur la maison».",
          "Placez la plaque là où on la voit tout de suite.",
          "Laissez la version imprimée dans un tiroir ou sur la table du salon pour les voyageurs qui préfèrent le papier.",
        ],
      },
      { type: "h2", id: "recommendations", text: "Des recommandations qui font la différence" },
      {
        type: "p",
        text: "Les voyageurs apprécient ce que seul quelqu'un du coin connaît : la boulangerie du quartier, la plage la plus tranquille, le restaurant sans touristes. Cinq à dix recommandations bien choisies valent mieux qu'une longue liste.",
      },
      { type: "h2", id: "assistant", text: "Avec l'assistant WhatsApp" },
      {
        type: "p",
        text: "Si vous avez aussi l'assistant IA, le contenu du livret est sa base de connaissances. Quand un voyageur pose une question sur WhatsApp, il reçoit la même réponse que dans le livret, dans sa langue. L'assistant ne partage jamais non plus les codes d'accès.",
      },
      { type: "h2", id: "several-properties", text: "Plusieurs logements" },
      {
        type: "p",
        text: "Chaque logement a son propre livret et sa propre plaque. Pour les gestionnaires, nous gardons la même présentation pour tous et appliquons en une fois les changements communs, comme de nouvelles règles d'immeuble ou un autre contact d'urgence.",
      },
    ],
  },
  troubleshooting: {
    title: "Résoudre les problèmes du livret d'accueil digital",
    description: "Que faire quand un voyageur n'arrive pas à ouvrir le livret d'un toucher ou quand une information n'est plus à jour.",
    blocks: [
      { type: "h2", id: "tap-does-not-open", text: "Le toucher n'ouvre pas le livret" },
      {
        type: "ul",
        items: [
          "Sur iPhone XS et modèles plus récents, il suffit d'approcher le haut du téléphone de la plaque, écran allumé.",
          "Sur Android, la lecture sans contact (un toucher) doit être activée dans les paramètres. Beaucoup de téléphones l'ont déjà activée.",
          "Les coques épaisses ou métalliques peuvent bloquer la lecture. Dans ce cas, le voyageur utilise le QR code.",
        ],
      },
      {
        type: "callout",
        tone: "tip",
        text: "Chaque plaque a un QR code imprimé. Celui qui ne peut pas l'ouvrir d'un toucher pointe l'appareil photo et arrive sur le même livret.",
      },
      { type: "h2", id: "outdated-information", text: "Une information n'est plus à jour" },
      {
        type: "p",
        text: "Envoyez-nous la correction par WhatsApp ou par e-mail. Nous la mettons à jour sous deux jours ouvrés. En cas d'urgence, comme un mot de passe wifi erroné, prévenez-nous et nous la traitons en priorité.",
      },
      { type: "h2", id: "damaged-plate", text: "La plaque est cassée ou a disparu" },
      {
        type: "p",
        text: "Nous en envoyons une nouvelle avec la même adresse, le livret reste donc le même. Une plaque supplémentaire pour le même logement a un petit coût, indiqué dans votre devis.",
      },
      { type: "h2", id: "shared-link", text: "Le lien a été partagé hors du logement" },
      {
        type: "p",
        text: "L'adresse du livret est privée et impossible à deviner, mais un voyageur pourrait l'enregistrer. Si vous changez le mot de passe du wifi ou voulez une nouvelle adresse, dites-le-nous : nous en créons une et reprogrammons la plaque.",
      },
    ],
  },
  faq: {
    title: "Questions fréquentes sur le livret d'accueil digital",
    description: "Des réponses rapides sur les prix, les langues, la sécurité, les avis et la plaque obligatoire des locations saisonnières.",
    blocks: [
      {
        type: "faq",
        items: [
          {
            q: "Combien ça coûte par mois ?",
            a: "30 € par mois par compte, quel que soit le nombre de logements, hébergement en ligne et modifications compris. Les plaques se paient une fois, une par logement : 20 € pièce, et 15 € pièce à partir de 10 logements. À l'inscription, la 1re plaque est offerte. Par exemple, 3 logements : 2 plaques × 20 € (la 1re est offerte) + 30 €/mois, + TVA. Avec la formule locations de vacances, le livret est inclus tant que la formule est active.",
          },
          {
            q: "Le livret vaut-il comme livret d'information exigé par la loi ?",
            a: "Le livret reprend le contenu que la loi demande dans le livret d'information, en portugais, en anglais et dans deux autres langues, et nous livrons une version imprimable que nous recommandons de garder dans le logement.",
          },
          {
            q: "Le livret remplace-t-il la plaque obligatoire des locations saisonnières ?",
            a: "Non. La plaque d'identification avec votre numéro d'enregistrement suit un modèle officiel fixé par la loi. Le livret affiche votre numéro d'enregistrement, mais ne remplace pas cette plaque.",
          },
          {
            q: "Le livret collecte-t-il des données sur les voyageurs ?",
            a: "Non. Le livret n'a aucun formulaire et ne demande aucune donnée personnelle. Seuls les journaux techniques habituels du serveur sont conservés.",
          },
          {
            q: "Puis-je demander des avis par le livret ?",
            a: "Le livret a une rubrique neutre qui explique où laisser un avis, la même pour tous et sans rien offrir en échange, comme l'exigent Booking.com et Airbnb.",
          },
          {
            q: "Faites-vous les déclarations des voyageurs au SIBA ?",
            a: "Non. Si vous voulez des rappels des échéances, l'automatisation «Ménages et échéances» s'en charge. Pour l'envoi automatique, nous recommandons des outils spécialisés comme Chekin ou Hostkit.",
          },
        ],
      },
    ],
  },
};

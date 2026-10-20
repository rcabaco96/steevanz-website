import type { DocPageContent, DocPageId } from "../types";

export const fr: Record<DocPageId, DocPageContent> = {
  "getting-started": {
    title: "Premiers pas avec la carte de visite digitale",
    description:
      "Ce qu'est la carte de visite digitale, ce qu'elle comprend, combien elle coûte et comment vos interlocuteurs enregistrent votre contact en approchant leur téléphone.",
    blocks: [
      {
        type: "p",
        text: "La carte de visite digitale est une carte en PVC, au format carte bancaire, avec votre nom, votre fonction, vos coordonnées et le logo de votre entreprise. D'un toucher du téléphone sur la carte, ou en lisant le QR code imprimé dessus, la personne ouvre votre page de contact digitale et enregistre votre contact.",
      },
      {
        type: "p",
        text: "C'est un service clés en main : nous concevons la carte, créons la page et la tenons à jour. Elle fonctionne sur iPhone et Android, et personne n'a besoin d'installer une application.",
      },
      { type: "h2", id: "ce-qui-est-inclus", text: "Ce qui est inclus" },
      {
        type: "table",
        head: ["Élément", "Détail"],
        rows: [
          ["Carte en PVC", "Format carte bancaire (85,6 × 54 mm), imprimée recto verso avec la qualité Steevanz"],
          ["Personnalisation", "Votre nom, votre fonction, vos coordonnées et le logo de l'entreprise, inclus dans le prix"],
          ["Page de contact digitale", "Rapide, pensée pour le téléphone, avec le bouton «Enregistrer le contact»"],
          ["Toucher ou QR", "S'ouvre d'un toucher du téléphone ou avec le QR code imprimé sur la carte, sur iPhone et Android, sans application"],
          ["Modifications incluses", "Si vos coordonnées changent, nous mettons la page à jour sans frais supplémentaires et la carte continue de fonctionner"],
        ],
      },
      { type: "h2", id: "tarifs", text: "Tarifs" },
      {
        type: "table",
        head: ["Quantité", "Prix par carte", "Total"],
        rows: [
          ["1 carte", "10 €", "10 €"],
          ["À partir de 10", "9 €", "90 € (10)"],
          ["À partir de 25", "8 €", "200 € (25)"],
          ["À partir de 50", "7 €", "350 € (50)"],
        ],
      },
      {
        type: "p",
        text: "Un pack peut réunir les cartes de plusieurs personnes de la même entreprise, chacune avec sa propre page. Prix + TVA, indicatifs et confirmés après la démonstration.",
      },
      { type: "h2", id: "comment-ca-marche", text: "Comment ça marche pour la personne qui approche son téléphone" },
      {
        type: "ol",
        items: [
          "Vous montrez la carte et la personne approche son téléphone (ou lit le QR code avec l'appareil photo).",
          "Votre page de contact s'ouvre, avec votre photo, votre nom, votre fonction et votre entreprise.",
          "Avec le bouton «Enregistrer le contact», vos coordonnées arrivent dans les contacts de son téléphone, sans rien saisir à la main.",
        ],
      },
      {
        type: "callout",
        tone: "info",
        title: "Voir un exemple",
        text: "La page de contact du fondateur de Steevanz : www.steevanz.com/c/rogerio-cabaco",
      },
      { type: "h2", id: "prochaines-etapes", text: "Prochaines étapes" },
      {
        type: "ul",
        items: [
          "[Installation](/fr/docs/digital-business-card/setup) : quelles informations nous envoyer et comment valider la carte.",
          "[Configuration](/fr/docs/digital-business-card/configuration) : ce que montre la page, le bouton «Enregistrer le contact» et comment demander des modifications.",
          "[Utilisation](/fr/docs/digital-business-card/usage) : comment présenter la carte en rendez-vous, sur les salons et au comptoir.",
        ],
      },
    ],
  },
  setup: {
    title: "Installation de la carte de visite digitale",
    description: "Les informations dont nous avons besoin pour la carte et la page, comment vous validez le design et comment vous recevez les cartes testées.",
    blocks: [
      { type: "h2", id: "envoyer-informations", text: "1. Envoyez-nous vos informations" },
      {
        type: "p",
        text: "Envoyez-les par WhatsApp ou par e-mail, comme cela vous arrange. Si les cartes sont pour plusieurs personnes de l'entreprise, envoyez les informations de chacune.",
      },
      {
        type: "table",
        head: ["Information", "À quoi elle sert"],
        rows: [
          ["Nom", "Tel que vous voulez qu'il apparaisse sur la carte et sur la page"],
          ["Fonction", "Affichée sous votre nom"],
          ["Téléphone", "Pour les boutons «Appeler» et «WhatsApp»"],
          ["E-mail", "Pour le bouton «E-mail»"],
          ["Site web", "Pour le bouton «Site web»"],
          ["Réseaux sociaux", "Instagram, LinkedIn ou d'autres que vous souhaitez afficher"],
          ["Adresse (facultative)", "Affichée avec un lien vers le plan, si vous la voulez sur la page"],
          ["Photo", "Affichée sur la page et dans le contact enregistré"],
          ["Logo de l'entreprise", "Placé au recto de la carte"],
        ],
      },
      {
        type: "callout",
        tone: "tip",
        text: "Un pack peut réunir les cartes de plusieurs personnes de la même entreprise. Chacune a sa propre page.",
      },
      { type: "h2", id: "valider", text: "2. Validez la carte et la page" },
      {
        type: "p",
        text: "Nous concevons la carte : au recto, le logo ; au verso, le nom, les coordonnées, le QR code et le petit symbole de toucher. Nous créons aussi votre page de contact. Avant l'impression, nous vous envoyons l'épreuve de la carte et le lien de la page. Nous n'imprimons qu'après votre validation.",
      },
      { type: "h2", id: "recevoir", text: "3. Recevez vos cartes" },
      {
        type: "p",
        text: "Les cartes sont testées sur iPhone et Android avant la livraison et arrivent en quelques jours ouvrés. Nous vous indiquons le délai exact lors de la démonstration.",
      },
    ],
  },
  configuration: {
    title: "Configuration de la carte de visite digitale",
    description: "Ce que montre la page de contact, ce que contient le contact enregistré, la langue de la page et comment demander des modifications.",
    blocks: [
      { type: "h2", id: "page-contact", text: "Ce que montre la page de contact" },
      {
        type: "ol",
        items: [
          "Votre photo, votre nom, votre fonction et votre entreprise.",
          "Le bouton «Enregistrer le contact».",
          "Les boutons «Appeler», «WhatsApp», «E-mail» et «Site web».",
          "Vos réseaux sociaux, comme Instagram ou LinkedIn.",
          "Votre adresse, avec un lien vers le plan, si vous souhaitez l'afficher.",
        ],
      },
      {
        type: "p",
        text: "La page est rapide, pensée pour le téléphone, et n'apparaît pas sur Google : elle ne s'ouvre qu'à partir de la carte ou de son lien.",
      },
      { type: "h2", id: "enregistrer-contact", text: "Le bouton «Enregistrer le contact»" },
      {
        type: "p",
        text: "Il télécharge un fichier de contact que le téléphone ajoute à ses contacts. Le contact enregistré comprend :",
      },
      {
        type: "ul",
        items: ["Nom", "Téléphone", "E-mail", "Site web", "Entreprise et fonction", "Photo"],
      },
      { type: "h2", id: "langue", text: "Langue de la page" },
      {
        type: "p",
        text: "La page est dans votre langue : portugais, anglais, espagnol, français, allemand ou italien. Dites-nous laquelle vous préférez quand vous nous envoyez vos informations.",
      },
      { type: "h2", id: "modifications", text: "Demander des modifications" },
      {
        type: "p",
        text: "Vous n'avez pas besoin de modifier la page vous-même : c'est nous qui la configurons et la mettons à jour. Si votre numéro, votre fonction ou votre e-mail change, envoyez-nous la modification par WhatsApp ou par e-mail. C'est inclus, sans frais supplémentaires : nous mettons la page à jour et la carte continue de fonctionner, la même carte, rien à réimprimer.",
      },
    ],
  },
  usage: {
    title: "Utilisation de la carte de visite digitale",
    description: "Comment présenter la carte pour que l'on enregistre votre contact, et bonnes pratiques en rendez-vous, sur les salons et au comptoir.",
    blocks: [
      { type: "h2", id: "presenter", text: "Comment présenter la carte" },
      {
        type: "ol",
        items: [
          "Tendez la carte vers la personne, en la gardant en main.",
          "Sur un iPhone, elle approche le haut du téléphone de la carte. Sur Android, il suffit que la lecture sans contact soit activée.",
          "Si le téléphone ne réagit pas, elle pointe l'appareil photo vers le QR code imprimé sur la carte.",
        ],
      },
      {
        type: "callout",
        tone: "tip",
        text: "Dites simplement : «Approchez votre téléphone et enregistrez mon contact.» La personne obtient vos coordonnées exactes, sans rien saisir.",
      },
      { type: "h2", id: "rendez-vous", text: "En rendez-vous" },
      {
        type: "p",
        text: "À la fin du rendez-vous, montrez la carte et proposez d'enregistrer votre contact sur-le-champ. Vos interlocuteurs obtiennent votre nom, votre téléphone, votre e-mail et votre photo, sans faute de frappe. La carte retourne dans votre portefeuille.",
      },
      { type: "h2", id: "salons", text: "Sur les salons et les événements" },
      {
        type: "p",
        text: "Les cartes en papier s'épuisent au pire moment. Avec la carte de visite digitale, chaque visiteur enregistre votre contact à partir de la même carte. Si vous le souhaitez, vous pouvez continuer à distribuer des cartes.",
      },
      { type: "h2", id: "comptoir", text: "Au comptoir" },
      {
        type: "p",
        text: "En boutique, au restaurant ou en agence immobilière, gardez la carte à portée de main et invitez le client à enregistrer votre contact avant de partir. Quand il aura besoin de vous, il vous retrouvera tout de suite dans ses contacts.",
      },
    ],
  },
  troubleshooting: {
    title: "Résolution des problèmes de la carte de visite digitale",
    description: "Que faire quand un téléphone ne réagit pas au toucher, quand le contact est enregistré sans photo ou quand la carte est abîmée.",
    blocks: [
      { type: "h2", id: "toucher-sans-reaction", text: "Le téléphone ne réagit pas au toucher" },
      {
        type: "ul",
        items: [
          "Sur les iPhone XS et plus récents, il suffit d'approcher le haut du téléphone de la carte, sans application.",
          "Sur la plupart des Android, la lecture sans contact (un toucher) doit être activée dans les paramètres de connexion.",
          "Sur les autres téléphones, utilisez le QR code imprimé sur la carte : il suffit de pointer l'appareil photo.",
        ],
      },
      {
        type: "callout",
        tone: "tip",
        text: "Le QR code ouvre exactement la même page que le toucher.",
      },
      { type: "h2", id: "sans-photo", text: "Le contact a été enregistré sans photo" },
      {
        type: "p",
        text: "Sur certains téléphones, la photo peut ne pas être conservée dans le contact enregistré. Les autres informations sont bien enregistrées et la photo reste visible sur votre page.",
      },
      { type: "h2", id: "informations-obsoletes", text: "Les informations ne sont plus à jour" },
      {
        type: "p",
        text: "Envoyez-nous la modification par WhatsApp ou par e-mail. Nous mettons la page à jour sans frais supplémentaires et la carte continue de fonctionner, sans rien réimprimer.",
      },
      { type: "h2", id: "carte-abimee", text: "La carte est abîmée ou perdue" },
      {
        type: "p",
        text: "Demandez-nous une nouvelle carte. Elle est reliée à la même page : vos informations et votre lien restent les mêmes.",
      },
    ],
  },
  faq: {
    title: "Questions fréquentes sur la carte de visite digitale",
    description: "Réponses rapides sur iPhone et Android, les modifications, le logo, les packs pour les équipes, Google et les délais.",
    blocks: [
      {
        type: "faq",
        items: [
          {
            q: "Est-ce que cela fonctionne sur iPhone et Android ?",
            a: "Oui, sans application. Sur les iPhone XS et plus récents, il suffit d'approcher le haut du téléphone. Sur la plupart des Android, la lecture sans contact doit être activée. Pour les autres, il y a le QR code imprimé sur la carte.",
          },
          {
            q: "Puis-je modifier mes informations plus tard ?",
            a: "Oui, et c'est inclus, sans frais supplémentaires. Envoyez-nous la modification par WhatsApp ou par e-mail et nous mettons la page à jour. La carte continue de fonctionner : la même carte, rien à réimprimer.",
          },
          {
            q: "Puis-je modifier la page moi-même ?",
            a: "Pas aujourd'hui. C'est nous qui configurons et mettons à jour la page : il suffit de nous le demander.",
          },
          {
            q: "Le logo de l'entreprise est-il en supplément ?",
            a: "Non. La personnalisation avec votre nom, votre fonction, vos coordonnées et le logo de l'entreprise est incluse dans le prix.",
          },
          {
            q: "Dans un pack, les cartes peuvent-elles être pour des personnes différentes ?",
            a: "Oui. Un pack peut réunir les cartes de plusieurs personnes de la même entreprise, chacune avec sa propre page.",
          },
          {
            q: "Ma page apparaît-elle sur Google ?",
            a: "Non. La page n'est pas indexée par Google : elle ne s'ouvre qu'à partir de la carte ou de son lien.",
          },
          {
            q: "Puis-je continuer à distribuer des cartes ?",
            a: "Vous le pouvez, si vous le souhaitez. Mais une seule carte peut vous servir pendant des années, car il n'y a rien à réimprimer quand un numéro ou une fonction change.",
          },
          {
            q: "Combien de temps faut-il pour recevoir les cartes ?",
            a: "Quelques jours ouvrés après la validation du design et de la page. Nous vous indiquons le délai exact lors de la démonstration.",
          },
        ],
      },
    ],
  },
};

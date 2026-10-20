import type { DocPageContent, DocPageId } from "../types";

export const fr: Record<DocPageId, DocPageContent> = {
  "getting-started": {
    title: "Premiers pas avec le porte-clés digital",
    description: "Ce qu'est le porte-clés digital, ce qu'il peut ouvrir, combien il coûte et comment le client l'utilise en approchant son téléphone.",
    blocks: [
      {
        type: "p",
        text: "Le porte-clés digital est un petit porte-clés pour le trousseau de vos clients. D'un simple geste du téléphone, il ouvre le WhatsApp, l'Instagram ou le site web de votre établissement. Il fonctionne sur iPhone et Android, sans application.",
      },
      {
        type: "p",
        text: "Nous nous occupons de tout : nous configurons la destination de chaque porte-clés et le testons sur iPhone et Android avant la livraison.",
      },
      { type: "h2", id: "ce-qu-il-ouvre", text: "Ce qu'il peut ouvrir" },
      {
        type: "table",
        head: ["Destination", "Ce que voit le client"],
        rows: [
          ["WhatsApp", "Une conversation avec votre établissement"],
          ["Instagram", "Le profil de votre établissement"],
          ["Site web", "Votre site"],
        ],
      },
      { type: "h2", id: "tarifs", text: "Tarifs" },
      {
        type: "table",
        head: ["Quantité", "Prix par porte-clés", "Total"],
        rows: [
          ["1 porte-clés", "5 €", "5 €"],
          ["Lot de 10", "4,50 €", "45 €"],
          ["Lot de 25", "4 €", "100 €"],
        ],
      },
      { type: "p", text: "Tous les prix + TVA. Ils sont indicatifs et confirmés lors de la démonstration." },
      { type: "h2", id: "comment-ca-marche", text: "Comment ça marche pour le client" },
      {
        type: "ol",
        items: [
          "Le client approche son téléphone du porte-clés.",
          "La destination que vous avez choisie s'ouvre aussitôt.",
          "Il n'a aucune application à installer ni votre nom à chercher.",
        ],
      },
      {
        type: "callout",
        tone: "info",
        title: "Uniquement en approchant le téléphone",
        text: "Le porte-clés n'a pas de QR code. Les téléphones très anciens, ou sans lecture sans contact, ne peuvent pas l'ouvrir. Pour ces cas, la Carte de visite digitale et les plaques ont un QR code.",
      },
      { type: "h2", id: "prochaines-etapes", text: "Prochaines étapes" },
      {
        type: "ul",
        items: [
          "[Commande et livraison](/fr/docs/digital-keychain/setup) : ce qu'il faut nous envoyer et ce qui se passe jusqu'à la réception des porte-clés.",
          "[Configuration](/fr/docs/digital-keychain/configuration) : comment choisir entre WhatsApp, Instagram et site web.",
          "[Utilisation](/fr/docs/digital-keychain/usage) : à qui les offrir et comment les présenter au client.",
        ],
      },
    ],
  },
  setup: {
    title: "Commande et livraison du porte-clés digital",
    description: "Ce qu'il faut nous envoyer pour chaque destination, comment choisir la quantité et ce que nous faisons avant la livraison.",
    blocks: [
      { type: "h2", id: "choisir-destination", text: "1. Choisissez la destination" },
      {
        type: "p",
        text: "Chaque porte-clés ouvre une destination, choisie à la commande. Dites-nous laquelle et envoyez-nous ce dont nous avons besoin :",
      },
      {
        type: "table",
        head: ["Destination", "Ce qu'il faut nous envoyer"],
        rows: [
          ["WhatsApp", "Le numéro WhatsApp sur lequel vous répondez à vos clients"],
          ["Instagram", "Le nom du profil de votre établissement (le @)"],
          ["Site web", "L'adresse du site ou de la page à ouvrir"],
        ],
      },
      { type: "h2", id: "quantite", text: "2. Dites-nous combien" },
      {
        type: "p",
        text: "Vous pouvez commander à l'unité ou par lots de 10 et de 25. Si vous souhaitez parler de personnalisation, comme votre logo, nous voyons cela avec vous lors de la démonstration.",
      },
      { type: "h2", id: "configurer-tester", text: "3. Nous configurons et testons" },
      {
        type: "p",
        text: "Nous configurons chaque porte-clés avec votre destination et le testons sur iPhone et Android avant la livraison. Il est prêt en quelques jours ouvrés ; nous vous indiquons le délai exact lors de la démonstration.",
      },
      {
        type: "callout",
        tone: "tip",
        text: "À la réception, essayez un porte-clés avec votre propre téléphone avant de les offrir.",
      },
    ],
  },
  configuration: {
    title: "Configuration du porte-clés digital",
    description: "Comment choisir entre WhatsApp, Instagram et site web, avec des conseils pour chaque destination.",
    blocks: [
      { type: "h2", id: "une-destination", text: "Une destination par porte-clés" },
      {
        type: "p",
        text: "Chaque porte-clés ouvre toujours la destination choisie à la commande. Choisissez celle que vos clients utilisent le plus pour vous joindre.",
      },
      { type: "h2", id: "whatsapp", text: "WhatsApp" },
      {
        type: "p",
        text: "Ouvre une conversation avec votre établissement. C'est le choix naturel si vous prenez rendez-vous, réservations ou commandes par message. Indiquez un numéro que quelqu'un suit dans la journée.",
      },
      { type: "h2", id: "instagram", text: "Instagram" },
      {
        type: "p",
        text: "Ouvre le profil de votre établissement. C'est pertinent si vous publiez vos nouveautés, vos réalisations ou vos plats du jour et voulez que vos clients vous suivent.",
      },
      { type: "h2", id: "site-web", text: "Site web" },
      {
        type: "p",
        text: "Ouvre votre site ou la page de votre choix. Privilégiez une page qui s'affiche bien sur téléphone.",
      },
      {
        type: "callout",
        tone: "info",
        text: "La personnalisation du porte-clés, comme votre logo, est un point que nous voyons avec vous lors de la démonstration.",
      },
    ],
  },
  usage: {
    title: "Utilisation du porte-clés digital",
    description: "À qui offrir le porte-clés et comment expliquer au client, en une phrase, ce qu'il fait.",
    blocks: [
      { type: "h2", id: "a-qui-offrir", text: "À qui l'offrir" },
      {
        type: "table",
        head: ["Activité", "Comment l'utiliser"],
        rows: [
          ["Cafés, restaurants, salons et commerces", "Offrez-le à vos habitués : votre WhatsApp ou votre Instagram reste toujours sur leurs clés"],
          ["Locations de vacances", "Le porte-clés de la clé du logement ouvre le WhatsApp de l'hôte"],
          ["Agences immobilières", "Remettez le porte-clés avec les clés du nouveau logement"],
          ["Équipes, événements et salons", "Un cadeau utile, qui reste sur les clés au lieu de finir à la poubelle"],
        ],
      },
      { type: "h2", id: "expliquer", text: "Expliquez-le en une phrase" },
      {
        type: "p",
        text: "En le remettant, dites par exemple : « Approchez votre téléphone de ce porte-clés et vous nous écrivez directement sur WhatsApp. » Le montrer une fois avec votre propre téléphone aide.",
      },
      {
        type: "callout",
        tone: "tip",
        text: "Si le client a un Android et que rien ne s'ouvre du premier coup, invitez-le à activer la lecture sans contact dans les paramètres de connexion.",
      },
    ],
  },
  troubleshooting: {
    title: "Résolution des problèmes du porte-clés digital",
    description: "Que faire quand rien ne s'ouvre ou quand un porte-clés ouvre la mauvaise destination.",
    blocks: [
      { type: "h2", id: "rien-ne-s-ouvre", text: "Rien ne s'ouvre" },
      {
        type: "ul",
        items: [
          "Sur les iPhone XS et plus récents, approchez le haut du téléphone du porte-clés, écran allumé.",
          "Sur Android, activez la lecture sans contact dans les paramètres de connexion.",
          "Si la coque du téléphone est épaisse, essayez sans.",
        ],
      },
      {
        type: "callout",
        tone: "warning",
        title: "Il n'y a pas de QR code",
        text: "Le porte-clés fonctionne uniquement en approchant le téléphone. Les téléphones très anciens, ou sans lecture sans contact, ne peuvent pas l'ouvrir. Pour ces clients, la Carte de visite digitale et les plaques ont un QR code.",
      },
      { type: "h2", id: "mauvaise-destination", text: "Il ouvre la mauvaise destination" },
      {
        type: "p",
        text: "Nous testons chaque porte-clés avant la livraison. Si quelque chose ne va pas, écrivez-nous par WhatsApp ou e-mail, dites-nous ce qu'il devrait ouvrir et nous cherchons la solution avec vous.",
      },
      { type: "h2", id: "plus-de-porte-cles", text: "Il vous faut plus de porte-clés" },
      {
        type: "p",
        text: "Vous pouvez en commander d'autres quand vous le souhaitez, à l'unité ou par lots. Écrivez-nous par WhatsApp ou e-mail.",
      },
    ],
  },
  faq: {
    title: "Questions fréquentes sur le porte-clés digital",
    description: "Réponses rapides sur les téléphones compatibles, le QR code, les destinations, les prix et les délais.",
    blocks: [
      {
        type: "faq",
        items: [
          {
            q: "Est-ce que ça fonctionne sur iPhone et Android ?",
            a: "Oui, sans application. Sur les iPhone XS et plus récents, il suffit d'approcher le haut du téléphone. La plupart des Android le lisent si la lecture sans contact est activée dans les paramètres de connexion.",
          },
          {
            q: "Y a-t-il un QR code ?",
            a: "Non, il fonctionne uniquement en approchant le téléphone. Les téléphones très anciens, ou sans lecture sans contact, ne peuvent pas l'ouvrir. Si vous avez besoin d'un QR code, la Carte de visite digitale et les plaques en ont un.",
          },
          {
            q: "Qu'est-ce qu'il ouvre ?",
            a: "Une destination par porte-clés, choisie à la commande : une conversation WhatsApp avec votre établissement, votre Instagram ou votre site web.",
          },
          {
            q: "Combien ça coûte ?",
            a: "5 € + TVA par porte-clés. En lots, 10 pour 45 € et 25 pour 100 €, + TVA. Ces prix sont indicatifs et confirmés lors de la démonstration.",
          },
          {
            q: "Combien de temps faut-il ?",
            a: "Quelques jours ouvrés. Nous vous indiquons le délai exact lors de la démonstration.",
          },
          {
            q: "Quelle différence avec la Carte de visite digitale ?",
            a: "La carte ouvre une page de contact complète et possède un QR code. Le porte-clés est plus petit et plus simple : il ouvre directement une seule destination.",
          },
        ],
      },
    ],
  },
};

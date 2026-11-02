import { grob, grobModalities, grobPlaces } from "@/content/grob/facts";
import { grobCanonical, grobOrigin } from "@/content/grob/routes";

// schema.org SportsClub (um SportsOrganization) só com dados reais: sem avaliações, sem números inventados.
export function grobJsonLd() {
  const site = new URL(grobOrigin).origin;
  const [sede, ...others] = grobPlaces;
  return {
    "@context": "https://schema.org",
    "@type": "SportsClub",
    "@id": `${grobCanonical()}#clube`,
    name: grob.name,
    alternateName: grob.short,
    url: grobCanonical(),
    logo: `${site}${grob.media.emblemPng}`,
    image: [`${site}${grob.media.og}`, `${site}${grob.media.emblem}`],
    foundingDate: grob.foundedIso,
    description: "Associação sem fins lucrativos, referência desportiva e cultural no concelho de Odivelas.",
    nonprofitStatus: "Nonprofit",
    sport: grobModalities.map((m) => m.name),
    telephone: "+351961573255",
    email: grob.emailGeneral,
    award: `${grob.medal}, Câmara Municipal de Odivelas`,
    address: {
      "@type": "PostalAddress",
      streetAddress: sede.street,
      postalCode: sede.postalCode,
      addressLocality: sede.locality,
      addressRegion: grob.municipality,
      addressCountry: grob.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: grob.latitude, longitude: grob.longitude },
    location: others.map((place) => ({
      "@type": "SportsActivityLocation",
      name: place.name,
      address: { "@type": "PostalAddress", streetAddress: place.street, postalCode: place.postalCode, addressLocality: place.locality, addressCountry: grob.country },
    })),
    contactPoint: [
      { "@type": "ContactPoint", contactType: "Desporto e inscrições", telephone: "+351961573255", email: grob.emailGeneral, availableLanguage: "pt-PT" },
      { "@type": "ContactPoint", contactType: "Eventos e aluguer da sede", telephone: "+351961573206", email: grob.emailEvents, availableLanguage: "pt-PT" },
    ],
    sameAs: Object.values(grob.social),
  };
}

export function JsonLd() {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(grobJsonLd()).replace(/</g, "\\u003c") }} />;
}

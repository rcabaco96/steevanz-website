import { lobo } from "@/content/lobo-do-mar/facts";
import { loboCanonical, loboOrigin, type LoboLocale } from "@/content/lobo-do-mar/routes";

// schema.org Restaurant with the real facts only: no rating, no review count, no price range.
export function loboJsonLd(locale: LoboLocale) {
  const site = new URL(loboOrigin).origin;
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${loboCanonical("pt")}#restaurant`,
    name: lobo.name,
    url: loboCanonical(locale),
    image: [`${site}${lobo.media.boat}`, `${site}${lobo.media.front}`, `${site}${lobo.media.og}`],
    telephone: "+351918194530",
    email: lobo.email,
    servesCuisine: ["Seafood", "Portuguese"],
    acceptsReservations: true,
    address: {
      "@type": "PostalAddress",
      streetAddress: lobo.street,
      postalCode: lobo.postalCode,
      addressLocality: lobo.locality,
      addressRegion: lobo.region,
      addressCountry: lobo.country,
    },
    openingHoursSpecification: lobo.services.map((service) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: lobo.openDays.map((day) => `https://schema.org/${day}`),
      opens: service.opens,
      closes: service.closes,
    })),
    hasMap: lobo.maps,
    sameAs: [lobo.instagram],
  };
}

export function JsonLd({ locale }: { locale: LoboLocale }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(loboJsonLd(locale)).replace(/</g, "\u003c") }}
    />
  );
}

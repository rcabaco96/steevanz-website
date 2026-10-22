import { ermita } from "@/content/o-ermita/facts";
import { ermitaCanonical, ermitaOrigin, type ErmitaLocale } from "@/content/o-ermita/routes";

// schema.org Restaurant with the real facts only: no rating, no review count, no price range.
export function ermitaJsonLd(locale: ErmitaLocale) {
  const site = new URL(ermitaOrigin).origin;
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${ermitaCanonical("pt")}#restaurant`,
    name: ermita.name,
    url: ermitaCanonical(locale),
    logo: `${site}${ermita.media.logoPng}`,
    image: [`${site}${ermita.media.portal}`, `${site}${ermita.media.tiles}`, `${site}${ermita.media.og}`],
    telephone: "+351266989160",
    servesCuisine: ["Portuguese", "Alentejo"],
    acceptsReservations: true,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${ermita.hotel}, ${ermita.street}, ${ermita.village}`,
      postalCode: ermita.postalCode,
      addressLocality: ermita.locality,
      addressRegion: ermita.region,
      addressCountry: ermita.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: ermita.latitude, longitude: ermita.longitude },
    containedInPlace: { "@type": "Hotel", name: ermita.hotel, url: ermita.hotelUrl },
    openingHoursSpecification: ermita.services.map((service) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ermita.openDays.map((day) => `https://schema.org/${day}`),
      opens: service.opens,
      closes: service.closes,
    })),
    hasMap: ermita.maps,
  };
}

export function JsonLd({ locale }: { locale: ErmitaLocale }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(ermitaJsonLd(locale)).replace(/</g, "\\u003c") }}
    />
  );
}

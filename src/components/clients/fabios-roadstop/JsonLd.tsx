import { fabios } from "@/content/fabios-roadstop/facts";
import { fabiosCanonical, fabiosOrigin, type FabiosLocale } from "@/content/fabios-roadstop/routes";

// schema.org Restaurant with the real facts only: no rating, no review count, no price range.
export function fabiosJsonLd(locale: FabiosLocale) {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${fabiosOrigin}/#restaurant`,
    name: fabios.name,
    url: fabiosCanonical(locale, "home"),
    logo: `${fabiosOrigin}${fabios.media.logoPng}`,
    image: [`${fabiosOrigin}${fabios.media.interior}`, `${fabiosOrigin}${fabios.media.og}`],
    telephone: "+351282317025",
    email: fabios.email,
    servesCuisine: ["American", "Burgers", "Pancakes", "Milkshakes", "Cocktails"],
    address: {
      "@type": "PostalAddress",
      streetAddress: fabios.street,
      postalCode: fabios.postalCode,
      addressLocality: fabios.locality,
      addressRegion: fabios.region,
      addressCountry: fabios.country,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: fabios.openDays.map((day) => `https://schema.org/${day}`),
        opens: fabios.opens,
        closes: fabios.closes,
      },
    ],
    hasMap: fabios.maps,
    hasMenu: fabios.menuUrl,
    sameAs: [fabios.instagram, fabios.facebook, fabios.tripadvisor],
  };
}

export function JsonLd({ locale }: { locale: FabiosLocale }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(fabiosJsonLd(locale)).replace(/</g, "\\u003c") }}
    />
  );
}

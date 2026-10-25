import { oQuintal } from "@/content/o-quintal/facts";
import { oQuintalCanonical } from "@/content/o-quintal/routes";

// schema.org Store with the real facts only: no rating, no review count, no opening hours (the site shows none).
export function oQuintalJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "GroceryStore",
    "@id": `${oQuintalCanonical({ kind: "home" })}#loja`,
    name: oQuintal.name,
    url: oQuintalCanonical({ kind: "home" }),
    description: oQuintal.summary,
    telephone: "+351912083448",
    email: oQuintal.email,
    areaServed: oQuintal.deliveryCouncils.map((name) => ({ "@type": "AdministrativeArea", name })),
    sameAs: [oQuintal.facebook, oQuintal.instagram],
    legalName: oQuintal.legal.company,
    vatID: `PT${oQuintal.legal.nif.replace(/\s/g, "")}`,
  };
}

export function JsonLd() {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(oQuintalJsonLd()).replace(/</g, "\\u003c") }} />;
}

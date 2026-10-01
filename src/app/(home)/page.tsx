import { JsonLd } from "@/components/JsonLd";
import { FlowerExperience } from "@/components/lab/FlowerExperience";
import { homeMetadata } from "@/components/pages/HomePage";
import { organizationJsonLd, websiteJsonLd } from "@/lib/jsonld";

export const metadata = homeMetadata("pt");

export default function HomePage() {
  return (
    <>
      <JsonLd data={[organizationJsonLd("pt"), websiteJsonLd("pt")]} />
      <FlowerExperience />
    </>
  );
}

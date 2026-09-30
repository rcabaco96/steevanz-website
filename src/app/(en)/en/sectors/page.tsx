import { SectorsIndexPage, sectorsIndexMetadata } from "@/components/pages/SectorsIndexPage";

export const metadata = sectorsIndexMetadata("en");

export default function Page() {
  return <SectorsIndexPage locale="en" />;
}

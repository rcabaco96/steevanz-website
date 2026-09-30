import { AboutPage, aboutMetadata } from "@/components/pages/InfoPages";

export const metadata = aboutMetadata("en");

export default function Page() {
  return <AboutPage locale="en"  />;
}

import { contactMetadata } from "@/components/pages/InfoPages";
import { ContactView } from "@/components/lab/InfoViews";
import { SiteFooter, SiteHeader } from "@/components/lab/SiteChrome";

export const metadata = contactMetadata("pt");

export default function ContactRoute() {
  return (
    <div className="lab-root pd-page">
      <SiteHeader solid />
      <main className="pd-page-main">
        <ContactView />
      </main>
      <SiteFooter />
    </div>
  );
}

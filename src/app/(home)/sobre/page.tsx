import { aboutMetadata } from "@/components/pages/InfoPages";
import { AboutView } from "@/components/lab/InfoViews";
import { SiteFooter, SiteHeader } from "@/components/lab/SiteChrome";

export const metadata = aboutMetadata("pt");

export default function AboutRoute() {
  return (
    <div className="lab-root pd-page">
      <SiteHeader solid />
      <main className="pd-page-main">
        <AboutView />
      </main>
      <SiteFooter />
    </div>
  );
}

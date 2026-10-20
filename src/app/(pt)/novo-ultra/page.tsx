import type { Metadata } from "next";
import "@/components/home-ultra/chrome.css";
import { UltraRoot } from "@/components/home-ultra/shared/UltraRoot";
import { Hero } from "@/components/home-ultra/sections/Hero";
import { ClientsStrip } from "@/components/home-ultra/sections/ClientsStrip";
import { Manifesto } from "@/components/home-ultra/sections/Manifesto";
import { Goals } from "@/components/home-ultra/sections/Goals";
import { DayJourney } from "@/components/home-ultra/sections/DayJourney";
import { MenuShowcase } from "@/components/home-ultra/sections/MenuShowcase";
import { SectorIndex } from "@/components/home-ultra/sections/SectorIndex";
import { DolciCase } from "@/components/home-ultra/sections/DolciCase";
import { ProcessLine } from "@/components/home-ultra/sections/ProcessLine";
import { PriceMenu } from "@/components/home-ultra/sections/PriceMenu";
import { HomeFaq } from "@/components/home-ultra/sections/HomeFaq";
import { FinalCta } from "@/components/home-ultra/sections/FinalCta";
import { BrandFooter } from "@/components/home-ultra/sections/BrandFooter";
import { FloatingBar } from "@/components/home-ultra/sections/FloatingBar";

// Preview of the next home page: not indexed, no canonical, not in the nav, all-routes.ts or the sitemap.
export const metadata: Metadata = {
  title: { absolute: "Steevanz | Sites, reservas, menus e reviews para negócios locais" },
  description:
    "Sites, reservas, Menu digital em vídeo, placas para avaliações com um toque, cartão de cliente e assistentes com IA para negócios em Portugal. Tecnologia do futuro. Com os bons modos de antigamente.",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function Page() {
  return (
    <UltraRoot>
      <Hero />
      <ClientsStrip />
      <Manifesto />
      <Goals />
      <DayJourney />
      <MenuShowcase />
      <SectorIndex />
      <DolciCase />
      <ProcessLine />
      <PriceMenu />
      <HomeFaq />
      <FinalCta />
      <BrandFooter />
      <FloatingBar />
    </UltraRoot>
  );
}

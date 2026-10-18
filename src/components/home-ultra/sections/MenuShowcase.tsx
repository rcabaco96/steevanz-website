import { menuPriceLine, menuShowcase } from "@/content/home-ultra/menuShowcase";
import { CtaButton } from "../shared/Buttons";
import { Section, SectionHeading } from "../shared/Section";
import s from "../shared/ultra.module.css";
import m from "./MenuShowcase.module.css";
import { MenuTabs } from "./menuShowcase/MenuTabs";

// The Menu digital «wow» band (#menu-digital): a warm deep-plum block with three phones that fan open
// on scroll, and three tabs that walk through the product (full-screen dish videos → the table's shared
// order → the staff confirming it with a QR). The dish clips are the stock demo menu, never a client's.
// Server shell; the fan, tabs and auto-advance live in the MenuTabs island (./menuShowcase/).
export function MenuShowcase() {
  const copy = menuShowcase;
  return (
    <Section id="menu-digital" tone="plumDeep" band labelledBy="menu-title" className={m.band}>
      <MenuTabs
        intro={
          <>
            <SectionHeading id="menu-title" title={copy.title} accentTone="gold" lead={copy.lead} />
            <p className={`${m.price} ${s.tabular}`}>{menuPriceLine}</p>
          </>
        }
        cta={
          <CtaButton href={copy.cta.href} variant="cream">
            {copy.cta.label}
          </CtaButton>
        }
        tabs={copy.tabs}
        tabsLabel={copy.tabsLabel}
        pauseLabel={copy.pause}
        resumeLabel={copy.resume}
      />
    </Section>
  );
}

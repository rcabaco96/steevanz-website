import { ArrowRight, PhoneIcon } from "@/components/icons";
import { contact } from "@/content/home-ultra/shared";
import { finalCta } from "@/content/home-ultra/finalCta";
import { whatsappUrl } from "@/lib/site";
import { CtaButton } from "../shared/Buttons";
import { InViewPlay } from "../shared/InViewPlay";
import { Section, SectionHeading } from "../shared/Section";
import f from "./FinalCta.module.css";

// Final call to action (#contacto): plum inset band, heading + one line of copy, demo and WhatsApp buttons,
// and the phone number. The only motion is a light sweep across the demo button: it starts 1.6s after the
// block is in view (InViewPlay once), runs 3 times 3.6s apart and stops. No sweep under reduced motion.
export function FinalCta() {
  return (
    <Section
      id="contacto"
      tone="plum"
      band
      labelledBy="contacto-title"
      className={f.block}
      containerClassName={f.inner}
    >
      <InViewPlay className={f.grid} attr="data-play" once threshold={0.4}>
        <div className={f.copy}>
          <SectionHeading
            id="contacto-title"
            title={finalCta.title}
            accentTone="gold"
            className={f.heading}
            titleClassName={f.title}
          />
          <p className={f.text}>{finalCta.text}</p>
        </div>

        <div className={f.actions}>
          <CtaButton href={contact.demoHref} variant="creamInk" block className={f.primary}>
            {finalCta.demoLabel}
            <span className={f.dial} aria-hidden="true">
              <ArrowRight size={18} />
            </span>
          </CtaButton>
          <CtaButton href={whatsappUrl()} variant="outlineCream" icon="whatsapp" block>
            {finalCta.whatsappLabel}
          </CtaButton>
          <a href={contact.phoneHref} className={f.call}>
            <PhoneIcon size={18} className={f.callIcon} />
            <span>
              {finalCta.callPrefix} <span className={f.number}>{contact.phoneDisplay}</span>
            </span>
          </a>
        </div>
      </InViewPlay>
    </Section>
  );
}

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { dolciCase as c } from "@/content/home-ultra/dolciCase";
import { LoopVideo } from "../shared/LoopVideo";
import { PhoneFrame } from "../shared/PhoneFrame";
import { Section, SectionHeading } from "../shared/Section";
import s from "../shared/ultra.module.css";
import d from "./DolciCase.module.css";
import { CaseStill } from "./dolciCase/CaseStill";
import { CaseTilt } from "./dolciCase/CaseTilt";

// Real case: Dolci e Salati. A photo card of the esplanada (clip reveal + inner parallax), the house
// page playing on a phone over it, the logo badge, then the facts and two links to the real work.
// Desktop: asymmetric 1.45fr / 1fr, the phone overlapping the photo's right edge (mouse tilt), and a
// second small phone with the video menu's opening tucked under the photo's lower left (the two pieces
// of work, one per corner). Motion: transform/opacity (+ the clip reveal) only; scroll-linked pieces only
// with animation-timeline support and no reduced-motion preference.
// Owned by the DolciCase builder: this file, ./DolciCase.module.css, ./dolciCase/* and
// src/content/home-ultra/dolciCase.ts.

// The photo is drawn wider than the card: object-fit cover of a 3:2 photo on a 120%-tall parallax layer
// (4:5 card on phones ≈ 2.3× the card width; 16:11 card ≈ 1.25×). Sizes follow the drawn width so it
// stays sharp; the phone fallback reuses the same src + sizes (cache hit).
const PHOTO_SIZES = "(min-width: 1024px) 800px, (min-width: 640px) 120vw, 230vw";

export function DolciCase() {
  return (
    <Section id="caso" labelledBy="caso-title">
      <div className={d.grid}>
        <figure className={d.figure}>
          <div className={d.card} data-hu-reveal="clip">
            <div className={d.media}>
              <Image src={c.photo.src} alt={c.photo.alt} fill sizes={PHOTO_SIZES} className={d.photo} />
            </div>
          </div>

          <div className={d.badge}>
            <Image src={c.logo.src} alt={c.logo.alt} width={56} height={56} sizes="56px" className={d.badgeImg} />
          </div>

          <div className={d.phoneSlot}>
            <CaseTilt className={d.tilt} innerClassName={d.tiltInner}>
              <PhoneFrame width="var(--caso-phone-w)" shadow>
                <LoopVideo
                  src={c.pageVideo.src}
                  poster={c.pageVideo.poster}
                  posterAlt={c.pageVideo.alt}
                  playLabel={c.pageVideo.playLabel}
                  sizes="(min-width: 1024px) 208px, 44vw"
                  priority={0}
                  fallback={
                    // Missing recording: a phone-shaped crop of the esplanada around the shop sign.
                    // Same src + sizes as the card photo, so it comes from the cache.
                    <Image src={c.photo.src} alt="" fill sizes={PHOTO_SIZES} className={d.phoneFallback} />
                  }
                />
              </PhoneFrame>
            </CaseTilt>
          </div>
        </figure>

        <div className={d.text}>
          <SectionHeading id="caso-title" title={c.title} lead={c.subtitle} className={d.heading} />
          <p className={`${s.body} ${d.body}`}>{c.body}</p>

          <ul className={d.links}>
            {c.links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={d.link}>
                  <span className={d.linkLabel}>{link.label}</span>
                  <span className={d.linkAction}>
                    {link.action}
                    <ArrowRight size={18} className={d.linkArrow} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className={d.still}>
          <PhoneFrame width="11rem" screenBg="#1d1220" className={d.stillPhone}>
            <CaseStill
              src={c.menuStill.src}
              alt={c.menuStill.alt}
              sizes="176px"
              fallback={
                <div className={d.stillFallback}>
                  <Image src={c.logo.src} alt="" width={88} height={88} sizes="88px" />
                </div>
              }
            />
          </PhoneFrame>
          <p className={d.stillCaption}>{c.menuStill.caption}</p>
        </div>
      </div>
    </Section>
  );
}

import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, Check, StarFilled, WhatsAppIcon } from "@/components/icons";
import { heroReelCopy, type NovoCopy } from "@/content/novo-home";
import { localize, type Locale } from "@/lib/i18n";
import { HeroReel } from "./HeroReel";
import h from "./hero.module.css";

// The home hero chosen by the owner (2026-10-22, «Negócios reais + Steevanz»): a dark plum hero (the rest of the
// page stays light) with three sectors filmed in calm loops and the Steevanz moments appearing over them:
//   01 café | restaurant: a dish in the pan; the Menu digital dish and the review form whose stars are tapped;
//   02 hair salon | holiday rental: one loop that goes from the salon to a bright apartment and back; the booking
//      («Está reservado.») over the salon, the guest guide (Wi-Fi, check-in) over the apartment;
//   03 clinic | practice: a reception; «Consulta marcada.» with the email reminder.
// - Computer: the title on the left, three full-height columns of footage on the right, the cards over them.
// - Phone: title and intro on plain plum, then three strips that zig-zag (image left, right, left; each strip's
//   card on the other side, never over a face), then the buttons, then the brand line.
// The title and intro paint first (the LCP is that text or a small webp poster); the videos only start once the
// page has loaded (HeroReel). The footage and the cards are illustrative (aria-hidden); the title, intro and buttons
// carry the message. No reviews, names of reviewers, counts, prices or door codes.

const shots = ["restaurante", "cabeleireiro-alojamento", "clinica"] as const;
/** When the salon | rental loop shows the apartment (seconds): HeroReel sets data-scene so the matching card shows. */
const rentalScene = "5.33-10.67";

function Stars({ className }: { className: string }) {
  return (
    <span className={className}>
      {[0, 1, 2, 3, 4].map((index) => (
        <span key={index} className={h.star}>
          <StarFilled size={20} className={h.starOff} />
          <StarFilled size={20} className={h.starOn} />
        </span>
      ))}
    </span>
  );
}

function Icon({ children, size = 18 }: { children: ReactNode; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {children}
    </svg>
  );
}

const CupIcon = () => (
  <Icon>
    <path d="M4 9h12v4.5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9Z" />
    <path d="M16 10.5h1.5a2.5 2.5 0 0 1 0 5H16" />
    <path d="M8 3.5c-.6.8-.6 1.7 0 2.5M12 3.5c-.6.8-.6 1.7 0 2.5" />
  </Icon>
);

const WifiIcon = () => (
  <Icon size={16}>
    <path d="M2.5 9a14 14 0 0 1 19 0M5.5 12.5a9.5 9.5 0 0 1 13 0M8.8 15.9a4.8 4.8 0 0 1 6.4 0" />
    <circle cx="12" cy="19.2" r="1.1" fill="currentColor" stroke="none" />
  </Icon>
);

const CalendarIcon = () => (
  <Icon>
    <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
  </Icon>
);

const BellIcon = () => (
  <Icon size={14}>
    <path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15L6 16ZM10 20.5a2 2 0 0 0 4 0" />
  </Icon>
);

export function Hero({ locale, copy, bookHref, whatsapp }: { locale: Locale; copy: NovoCopy; bookHref: string; whatsapp: string }) {
  const reel = localize(heroReelCopy, locale);

  // The phone strips' cards, one per strip (the salon | rental strip swaps its card with the scene).
  const chips = [
    <span key="restaurante" className={`${h.chip} ${h.moment0}`}>
      <span className={`${h.chipIcon} ${h.iconRose}`}>
        <StarFilled size={14} />
      </span>
      <span className={h.chipText}>
        <b>{reel.review.chip}</b>
        <Stars className={h.chipStars} />
      </span>
    </span>,
    <span key="cabeleireiro-alojamento">
      <span className={`${h.sceneA}`}>
        <span className={`${h.chip} ${h.moment1}`}>
          <span className={`${h.chipIcon} ${h.iconOk}`}>
            <Check size={15} strokeWidth={2.4} />
          </span>
          <span className={h.chipText}>
            <b>{reel.booking.done}</b>
            <small>{reel.booking.chip}</small>
          </span>
        </span>
      </span>
      <span className={`${h.sceneB} ${h.sceneOnly}`}>
        <span className={`${h.chip} ${h.moment1}`}>
          <span className={`${h.chipIcon} ${h.iconGold}`}>
            <WifiIcon />
          </span>
          <span className={h.chipText}>
            <b>{reel.guide.chip}</b>
            <small>{reel.guide.chipNote}</small>
          </span>
        </span>
      </span>
    </span>,
    <span key="clinica" className={`${h.chip} ${h.moment2}`}>
      <span className={`${h.chipIcon} ${h.iconOk}`}>
        <Check size={15} strokeWidth={2.4} />
      </span>
      <span className={h.chipText}>
        <b>{reel.clinic.done}</b>
        <small>{reel.clinic.chipNote}</small>
      </span>
    </span>,
  ];

  return (
    <section id="novo-hero" aria-labelledby="novo-hero-title" className={h.hero} data-hero-dark>
      <div className={h.glow} aria-hidden="true" />
      <div className={h.inner}>
        <div className={h.copy}>
          <p className={h.eyebrow}>{copy.hero.eyebrow}</p>
          <h1 id="novo-hero-title" className={h.title}>
            {copy.hero.titleStart} <span className={h.accent}>{copy.hero.titleAccent}</span>
          </h1>
          <p className={h.sub}>{copy.hero.subtitle}</p>
        </div>

        <HeroReel className={h.reel}>
          {shots.map((id, index) => (
            <div key={id} className={`${h.shot} ${h[`shot${index}`]}`}>
              <div className={h.media}>
                <picture>
                  <source media="(min-width: 1024px)" srcSet={`/home/hero/${id}-col.webp`} width={432} height={1080} />
                  <img src={`/home/hero/${id}-strip.webp`} width={576} height={342} alt="" decoding="async" className={h.poster} />
                </picture>
                <video
                  className={h.video}
                  data-col={`/home/hero/${id}-col.mp4`}
                  data-strip={`/home/hero/${id}-strip.mp4`}
                  data-scene-b={id === "cabeleireiro-alojamento" ? rentalScene : undefined}
                  muted
                  playsInline
                  loop
                  preload="none"
                  tabIndex={-1}
                  disablePictureInPicture
                />
                <span className={h.shade} />
              </div>
              <span className={h.tag}>
                <b>{String(index + 1).padStart(2, "0")}</b> {reel.places[index][0]}
                <span className={h.bar}>{"\u00a0| "}</span>
                <wbr />
                {reel.places[index][1]}
              </span>
              {chips[index]}
            </div>
          ))}
          <span className={h.fade} />

          {/* Computer only: the cards over the columns. */}
          <div className={`${h.card} ${h.cardMenu} ${h.moment0b}`}>
            <span className={h.dish}>
              {/* A 6 KB webp already at its 2× size: no need for the image optimizer. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/home/hero/margherita.webp" width={160} height={200} alt="" loading="lazy" decoding="async" />
            </span>
            <span>
              <b>{reel.menu.dish}</b>
              <small>{reel.menu.note}</small>
            </span>
          </div>

          <div className={`${h.card} ${h.cardReview} ${h.moment0}`}>
            <div className={h.reviewHead}>
              <span className={h.reviewIcon}>
                <CupIcon />
              </span>
              <span>
                <b>{reel.review.business}</b>
                <small>{reel.review.prompt}</small>
              </span>
            </div>
            <Stars className={h.reviewStars} />
            <span className={h.publish}>
              <span>{reel.review.publish}</span>
            </span>
          </div>

          <div className={h.sceneA}>
            <div className={`${h.card} ${h.cardBooking} ${h.moment1}`}>
              <div className={h.bookingTop}>
                <small>{reel.booking.kicker}</small>
                <b>{reel.booking.business}</b>
              </div>
              <div className={h.bookingBody}>
                <span className={h.bookingOk}>
                  <Check size={18} strokeWidth={2.4} />
                </span>
                <b>{reel.booking.done}</b>
                <small>
                  {reel.booking.service}
                  <br />
                  {reel.booking.when}
                </small>
              </div>
            </div>
          </div>

          <div className={`${h.sceneB} ${h.sceneOnly}`}>
            <div className={`${h.card} ${h.cardGuide} ${h.moment1}`}>
              <small className={h.cardKicker}>{reel.guide.kicker}</small>
              <b className={h.guideHouse}>{reel.guide.business}</b>
              <span className={h.guideRow}>
                <span className={h.guideIcon}>
                  <WifiIcon />
                </span>
                <span className={h.guideWifi}>
                  <small>{reel.guide.wifi}</small>
                  <b>{reel.guide.network}</b>
                </span>
              </span>
              <span className={h.guideCopy}>{reel.guide.copy}</span>
              <span className={h.guideTimes}>{reel.guide.times}</span>
            </div>
          </div>

          <div className={`${h.card} ${h.cardClinic} ${h.moment2}`}>
            <div className={h.reviewHead}>
              <span className={h.reviewIcon}>
                <CalendarIcon />
              </span>
              <span>
                <b>{reel.clinic.business}</b>
                <small>{reel.clinic.kicker}</small>
              </span>
            </div>
            <div className={h.clinicDone}>
              <span className={h.bookingOk}>
                <Check size={18} strokeWidth={2.4} />
              </span>
              <span>
                <b>{reel.clinic.done}</b>
                <small>{reel.clinic.when}</small>
              </span>
            </div>
            <span className={h.clinicReminder}>
              <BellIcon />
              <span>{reel.clinic.reminder}</span>
            </span>
          </div>
        </HeroReel>

        <div className={h.ctas}>
          <Link href={bookHref} className={`${h.btn} ${h.btnCream}`}>
            {copy.hero.primary}
            <ArrowRight size={18} />
          </Link>
          <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={`${h.btn} ${h.btnLine}`}>
            <WhatsAppIcon size={18} className={h.wa} />
            {copy.hero.secondary}
          </a>
        </div>

        <div className={h.brand}>
          <span className={h.mark} aria-hidden="true">
            <span className={h.markTile}>
              <span className={h.markS}>S</span>
              <span className={h.markDot} />
            </span>
          </span>
          <p className={h.brandLine}>
            <span>{copy.brandLine[0]}</span>
            <span>{copy.brandLine[1]}</span>
          </p>
        </div>
      </div>
    </section>
  );
}

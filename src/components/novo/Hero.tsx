import Link from "next/link";
import { ArrowRight, Check, StarFilled, WhatsAppIcon } from "@/components/icons";
import { heroReelCopy, type NovoCopy } from "@/content/novo-home";
import { localize, type Locale } from "@/lib/i18n";
import { HeroReel } from "./HeroReel";
import h from "./hero.module.css";

// The home hero chosen by the owner (2026-10-22, «Negócios reais + Steevanz»): a dark plum hero (the rest of the
// page stays light) with three calm, real businesses filmed in loops (café, restaurant, barbershop) and the
// Steevanz moments appearing over them: the review form whose stars are being tapped, a dish of the Menu digital,
// «Está reservado.» and the waitlist's «É a sua vez».
// - Computer: the title on the left, three full-height columns of footage on the right, four cards over them.
// - Phone: title and intro on plain plum, then three strips that zig-zag (image left, right, left; each strip's
//   card on the other side, never over a face), then the buttons, then the brand line.
// The title is the LCP element: the posters (small webp) paint first and the videos only start once the page has
// loaded (HeroReel). The footage and the cards are illustrative (aria-hidden); the title, intro and buttons carry
// the message. No reviews, names of reviewers, counts or prices.

const shots = ["cafe", "restaurante", "barbearia"] as const;

function Stars({ className }: { className: string }) {
  return (
    <span className={className}>
      {[0, 1, 2, 3, 4].map((index) => (
        <span key={index} className={h.star} style={{ ["--i" as string]: index }}>
          <StarFilled size={20} className={h.starOff} />
          <StarFilled size={20} className={h.starOn} />
        </span>
      ))}
    </span>
  );
}

function CupIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M4 9h12v4.5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9Z" />
      <path d="M16 10.5h1.5a2.5 2.5 0 0 1 0 5H16" />
      <path d="M8 3.5c-.6.8-.6 1.7 0 2.5M12 3.5c-.6.8-.6 1.7 0 2.5" />
    </svg>
  );
}

export function Hero({ locale, copy, bookHref, whatsapp }: { locale: Locale; copy: NovoCopy; bookHref: string; whatsapp: string }) {
  const reel = localize(heroReelCopy, locale);

  const chips = [
    <span key="cafe" className={`${h.chip} ${h.moment0}`}>
      <span className={`${h.chipIcon} ${h.iconRose}`}>
        <StarFilled size={14} />
      </span>
      <span className={h.chipText}>
        <b>{reel.review.chip}</b>
        <Stars className={h.chipStars} />
      </span>
    </span>,
    <span key="restaurante" className={`${h.chip} ${h.moment1b}`}>
      <span className={`${h.chipIcon} ${h.iconOk}`}>
        <Check size={15} strokeWidth={2.4} />
      </span>
      <span className={h.chipText}>
        <b>{reel.booking.done}</b>
        <small>{reel.booking.when}</small>
      </span>
    </span>,
    <span key="barbearia" className={`${h.chip} ${h.moment2}`}>
      <span className={`${h.chipIcon} ${h.iconQueue}`}>8</span>
      <span className={h.chipText}>
        <b>{reel.queue.turn}</b>
        <small>{reel.queue.kicker}</small>
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
                  <img src={`/home/hero/${id}-strip.webp`} width={576} height={334} alt="" decoding="async" className={h.poster} />
                </picture>
                <video
                  className={h.video}
                  data-col={`/home/hero/${id}-col.mp4`}
                  data-strip={`/home/hero/${id}-strip.mp4`}
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
                <b>{String(index + 1).padStart(2, "0")}</b>
                {reel.places[index]}
              </span>
              {chips[index]}
            </div>
          ))}
          <span className={h.fade} />

          {/* Computer only: the four product cards over the columns. */}
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

          <div className={`${h.card} ${h.cardMenu} ${h.moment1}`}>
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

          <div className={`${h.card} ${h.cardBooking} ${h.moment1b}`}>
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
                {reel.booking.when}
                <br />
                {reel.booking.party}
              </small>
            </div>
          </div>

          <div className={`${h.card} ${h.cardQueue} ${h.moment2}`}>
            <small className={h.queueKicker}>{reel.queue.kicker}</small>
            <b className={h.queueShop}>{reel.queue.business}</b>
            <span className={h.queueRow}>
              <span>{reel.queue.ticket}</span>
              <span className={h.queuePill}>{reel.queue.turn}</span>
            </span>
            <span className={h.queueNumber}>8</span>
            <span className={h.queueName}>{reel.queue.name}</span>
            <span className={h.queueGo}>{reel.queue.go}</span>
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

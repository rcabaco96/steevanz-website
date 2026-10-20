import Image from "next/image";
import type { ReactNode } from "react";
import { GlobeIcon, InstagramIcon, MailIcon, MapPinIcon, PhoneIcon, WhatsAppIcon } from "@/components/icons";
import {
  businessCardLabels,
  displayUrl,
  phoneForLink,
  socialLabels,
  whatsappLink,
  type BusinessCard,
  type SocialNetwork,
} from "@/content/business-cards";
import { initialsOfName } from "@/lib/business-cards/rules";
import { localize } from "@/lib/i18n";

// The «Cartão de visita digital» contact page (/c/<slug>), shared by the public page and the admin's live
// preview. No hooks and no server APIs: it renders on both sides.

function FilledIcon({ size = 20, children }: { size?: number; children: ReactNode }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
      {children}
    </svg>
  );
}

function SocialIcon({ network }: { network: SocialNetwork }) {
  switch (network) {
    case "instagram":
      return <InstagramIcon size={20} />;
    case "linkedin":
      return (
        <FilledIcon size={19}>
          <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4V21H3V9.75Zm6.5 0h3.8v1.6h.06c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.77 2.6 4.77 6V21h-4v-5.1c0-1.22-.02-2.78-1.7-2.78-1.7 0-1.96 1.33-1.96 2.7V21h-4V9.75Z" />
        </FilledIcon>
      );
    case "facebook":
      return (
        <FilledIcon size={19}>
          <path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.87.25-1.46 1.5-1.46h1.6V4.46A21 21 0 0 0 14.3 4.3c-2.3 0-3.8 1.4-3.8 3.96v2.24H8v3h2.5V21h3Z" />
        </FilledIcon>
      );
    case "tiktok":
      return (
        <FilledIcon size={19}>
          <path d="M16.6 3h-3.1v11.9a2.6 2.6 0 1 1-2.6-2.6c.27 0 .53.04.78.12V9.26a5.8 5.8 0 1 0 5 5.74V9.1a7.3 7.3 0 0 0 4.2 1.33V7.33A4.2 4.2 0 0 1 16.6 3Z" />
        </FilledIcon>
      );
    case "youtube":
      return (
        <FilledIcon size={20}>
          <path d="M21.6 7.2a2.5 2.5 0 0 0-1.77-1.77C18.27 5 12 5 12 5s-6.27 0-7.83.43A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.77 1.77C5.73 19 12 19 12 19s6.27 0 7.83-.43a2.5 2.5 0 0 0 1.77-1.77A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15V9l5.2 3L10 15Z" />
        </FilledIcon>
      );
    case "x":
      return (
        <FilledIcon size={17}>
          <path d="M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.37 5.77L17.75 3Zm-1.08 16.2h1.7L7.4 4.73H5.58L16.67 19.2Z" />
        </FilledIcon>
      );
    default:
      return <GlobeIcon size={20} />;
  }
}

const tileBase =
  "rounded-2xl border border-line bg-surface p-4 text-left shadow-[0_10px_30px_-24px_rgb(var(--shadow-color)/0.6)] transition-[border-color,transform] hover:border-accent/50 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
const tile = `flex min-h-24 flex-col items-start justify-between gap-3 ${tileBase}`;
const wideTile = `col-span-2 flex items-center gap-3 ${tileBase}`;

/** A square tile (call, WhatsApp) or, `wide`, a full row (email and website, too long for half the width). */
function Tile({ href: link, icon, label, detail, external = false, wide = false }: { href: string; icon: ReactNode; label: string; detail?: string; external?: boolean; wide?: boolean }) {
  return (
    <a href={link} className={wide ? wideTile : tile} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent-soft text-accent-text">{icon}</span>
      <span className="flex w-full min-w-0 flex-col">
        <span className="font-semibold text-text">{label}</span>
        {detail ? <span className="truncate text-sm text-subtle">{detail}</span> : null}
      </span>
    </a>
  );
}

interface BusinessCardViewProps {
  card: BusinessCard;
  /** The «Quero um cartão assim» link (the product page in the card's language). */
  productHref: string;
  /**
   * The admin's preview: the photo is any address (a local file before it's sent), drawn with a plain
   * <img>; the main element becomes a div (the admin page has its own <main>).
   */
  preview?: boolean;
}

export function BusinessCardView({ card, productHref, preview = false }: BusinessCardViewProps) {
  const t = localize(businessCardLabels, card.locale);
  const line = [card.role, card.company].filter(Boolean).join(" · ");
  const Root = preview ? "div" : "main";
  const photoClasses = "h-32 w-32 rounded-full border-4 border-bg bg-surface object-cover shadow-[0_18px_40px_-20px_rgb(var(--shadow-color)/0.7)]";
  // Site files go through next/image; uploaded photos are already 512 px JPEGs, drawn as they are.
  const optimised = !preview && card.photo?.src.startsWith("/");

  return (
    <Root className={`mx-auto flex w-full max-w-md flex-col bg-bg ${preview ? "min-h-full" : "min-h-dvh"}`}>
      {/* The Steevanz plum with the gold dot, fixed in light and dark mode: it is the card's own colour. */}
      <header className="relative h-36 overflow-hidden rounded-b-[2rem] bg-[linear-gradient(150deg,#7a2d60,#4a1839)]">
        <span aria-hidden="true" className="absolute -top-16 -right-10 h-56 w-56 rounded-full border border-[#cfa563]/30" />
        <span aria-hidden="true" className="absolute -top-6 right-6 h-28 w-28 rounded-full border border-[#cfa563]/20" />
        <p aria-hidden="true" className="absolute top-5 left-6 font-display text-2xl text-[#fbf7f1]">
          S<span className="text-[#cfa563]">.</span>
        </p>
      </header>

      <div className="relative z-10 -mt-16 flex flex-col items-center gap-3 px-5 text-center">
        {card.photo ? (
          optimised ? (
            <Image src={card.photo.src} alt={card.name} width={card.photo.width} height={card.photo.height} priority sizes="128px" className={photoClasses} />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element -- an uploaded 512 px photo, or the admin's local preview (blob URL)
            <img src={card.photo.src} alt={card.name} width={128} height={128} fetchPriority="high" decoding="async" className={photoClasses} />
          )
        ) : (
          <span className="grid h-32 w-32 place-items-center rounded-full border-4 border-bg bg-accent-soft font-display text-4xl text-accent-text">{initialsOfName(card.name)}</span>
        )}
        {preview ? (
          <p className="display mt-1 text-[2.1rem] leading-tight text-balance">{card.name}</p>
        ) : (
          <h1 className="display mt-1 text-[2.1rem] leading-tight text-balance">{card.name}</h1>
        )}
        {line ? <p className="-mt-1 text-[1.05rem] text-muted">{line}</p> : null}
      </div>

      <div className="flex flex-1 flex-col gap-6 px-5 pt-7 pb-10">
        <div className="flex flex-col gap-2">
          <a
            href={`/c/${card.slug}/vcard`}
            className="inline-flex min-h-14 w-full items-center justify-center gap-2.5 rounded-2xl bg-accent px-5 text-[1.05rem] font-semibold text-accent-contrast shadow-[0_14px_30px_-16px_var(--accent)] transition-[filter,transform] hover:brightness-110 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="10" cy="8" r="3.5" />
              <path d="M3.5 20a6.5 6.5 0 0 1 11.6-4M18 14v6M15 17h6" />
            </svg>
            {t.save}
          </a>
          <p className="text-center text-sm text-subtle">{t.saveHint}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {card.phone ? <Tile href={`tel:${phoneForLink(card.phone)}`} icon={<PhoneIcon size={19} />} label={t.call} detail={card.phone} /> : null}
          {card.whatsapp ? <Tile href={whatsappLink(card.whatsapp)} icon={<WhatsAppIcon size={19} />} label={t.whatsapp} detail={card.whatsapp} external /> : null}
          {card.phone2 ? <Tile href={`tel:${phoneForLink(card.phone2)}`} icon={<PhoneIcon size={19} />} label={t.call} detail={card.phone2} wide /> : null}
          {card.email ? <Tile href={`mailto:${card.email}`} icon={<MailIcon size={19} />} label={t.email} detail={card.email} wide /> : null}
          {card.website ? <Tile href={card.website} icon={<GlobeIcon size={19} />} label={t.website} detail={displayUrl(card.website)} external wide /> : null}
        </div>

        {card.socials?.length ? (
          <section aria-labelledby={preview ? undefined : "socials-title"} aria-label={preview ? t.socials : undefined} className="flex flex-col gap-3">
            <h2 id={preview ? undefined : "socials-title"} className="eyebrow">
              {t.socials}
            </h2>
            <ul className="overflow-hidden rounded-2xl border border-line bg-surface">
              {card.socials.map((social, index) => (
                <li key={social.url} className={index > 0 ? "border-t border-line" : ""}>
                  <a href={social.url} target="_blank" rel="noopener noreferrer" className="flex min-h-14 items-center gap-3 px-4 transition-colors hover:bg-surface-2">
                    <span className="text-accent-text">
                      <SocialIcon network={social.network} />
                    </span>
                    <span className="font-semibold text-text">{socialLabels[social.network]}</span>
                    <span className="ml-auto truncate text-sm text-subtle">{displayUrl(social.url).replace(/^www\./, "")}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {card.address?.lines.length ? (
          <section aria-labelledby={preview ? undefined : "address-title"} aria-label={preview ? t.address : undefined} className="flex flex-col gap-3">
            <h2 id={preview ? undefined : "address-title"} className="eyebrow">
              {t.address}
            </h2>
            <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4">
              <p className="flex gap-3 text-text">
                <MapPinIcon size={20} className="mt-0.5 shrink-0 text-accent-text" />
                <span>
                  {card.address.lines.map((addressLine, index) => (
                    <span key={`${index}-${addressLine}`} className="block">
                      {addressLine}
                    </span>
                  ))}
                </span>
              </p>
              <a
                href={card.address.mapsUrl ?? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(card.address.lines.join(", "))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-line-strong font-semibold text-text transition-colors hover:bg-surface-2"
              >
                {t.openMap}
              </a>
            </div>
          </section>
        ) : null}

        <footer className="mt-auto flex flex-col items-center gap-1 pt-6 text-center text-sm text-subtle">
          <span>{t.madeBy}</span>
          <a href={productHref} className="font-semibold text-accent-text underline underline-offset-4">
            {t.getYours}
          </a>
        </footer>
      </div>
    </Root>
  );
}

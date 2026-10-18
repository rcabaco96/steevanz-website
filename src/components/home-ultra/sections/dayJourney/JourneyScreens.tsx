"use client";

import Image from "next/image";
import { useCallback, useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { ClockIcon, MapPinIcon, TapWaves } from "@/components/icons";
import { StampCard } from "@/components/public/loyalty/StampCard";
import { TapPlate } from "@/components/visuals/TapPlate";
import { OnlineShopMockup } from "@/components/visuals/WebMockups";
import { photos } from "@/content/media";
import { mockupCopy } from "@/content/mockups";
import { dayJourney, type JourneyCodeScreen, type JourneyRowIcon, type JourneyScreen } from "@/content/home-ultra/dayJourney";
import { ScaledScreen } from "../../shared/ScaledScreen";
import { reducedMotion } from "../../shared/env";
import x from "./screens.module.css";

// The phone screens of «Um dia no seu negócio». Code screens are laid out at 390 CSS px and scaled to the
// phone (ScaledScreen: transform only, no layout shift). Real stills use next/image and fall back to a code
// screen when the file is missing. Everything here is decorative (the caption carries the meaning), so the
// caller renders it inside an aria-hidden layer. Fictional businesses only, no reviews or ratings.

const label = dayJourney.screen;
const imageSizes = "(min-width: 1024px) 288px, 62vw";

/* ---------- Small pieces ---------- */

function StatusBar({ time, tone = "light" }: { time?: string; tone?: "light" | "dark" }) {
  const clock = time && /^\d/.test(time) ? time : null;
  return (
    <div className={`${x.status} ${tone === "dark" ? x.statusDark : ""}`}>
      <span className={x.statusTime}>{clock}</span>
      <span className={x.statusIcons}>
        <svg viewBox="0 0 24 16" width="26" height="17" fill="currentColor">
          <rect x="1" y="10" width="4" height="5" rx="1" />
          <rect x="7" y="7" width="4" height="8" rx="1" />
          <rect x="13" y="4" width="4" height="11" rx="1" />
          <rect x="19" y="1" width="4" height="14" rx="1" />
        </svg>
        <svg viewBox="0 0 30 16" width="34" height="18" fill="none" stroke="currentColor" strokeWidth="1.6">
          <rect x="1" y="1.5" width="24" height="13" rx="4" />
          <rect x="3.5" y="4" width="17" height="8" rx="2" fill="currentColor" stroke="none" />
          <path d="M27.5 6v4" strokeLinecap="round" />
        </svg>
      </span>
    </div>
  );
}

function Skeleton({ widths, className = "" }: { widths: readonly string[]; className?: string }) {
  return (
    <span className={`${x.skeleton} ${className}`}>
      {widths.map((width, index) => (
        <span key={index} style={{ width }} />
      ))}
    </span>
  );
}

const starPath = "m12 3.2 2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.6l-5.2 2.8 1-5.9-4.3-4.1 5.9-.8L12 3.2Z";

function OutlineStar() {
  return (
    <svg viewBox="0 0 24 24" width="52" height="52" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round">
      <path d={starPath} />
    </svg>
  );
}

function CalendarGlyph({ size = 24 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </svg>
  );
}

function SearchGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.5 15.5 5 5" />
    </svg>
  );
}

function BagGlyph({ size = 26 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 8h14l-1.1 11.6a1.6 1.6 0 0 1-1.6 1.4H7.7a1.6 1.6 0 0 1-1.6-1.4L5 8Z" />
      <path d="M9 10.5V7a3 3 0 0 1 6 0v3.5" />
    </svg>
  );
}

function PlayGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
      <path d="M8 5.5v13l10.5-6.5L8 5.5Z" />
    </svg>
  );
}

function QrGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3.5" y="3.5" width="7" height="7" rx="1" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1" />
      <path d="M13.5 13.5h3v3h-3zM17.5 17.5h3v3h-3z" fill="currentColor" stroke="none" />
    </svg>
  );
}

const rowIcons: Record<JourneyRowIcon, ReactNode> = {
  clock: <ClockIcon size={26} />,
  pin: <MapPinIcon size={26} />,
  calendar: <CalendarGlyph size={26} />,
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter((word) => /^[A-ZÀ-Ý]/.test(word))
    .slice(0, 2)
    .map((word) => word[0])
    .join("");
}

/* ---------- Screens ---------- */

function SearchScreen({ screen, time }: { screen: Extract<JourneyCodeScreen, { kind: "search" }>; time?: string }) {
  return (
    <div className={`${x.page} ${x.pageCream}`}>
      <StatusBar time={time} />
      <div className={x.searchBar}>
        <SearchGlyph />
        <span className={x.typed} aria-hidden="true">
          {Array.from(screen.query).map((char, index) => (
            <span key={index} style={{ "--c": index } as CSSProperties}>
              {char}
            </span>
          ))}
        </span>
      </div>
      <p className={x.group}>{label.results}</p>
      <div className={`${x.card} ${x.resultCard}`}>
        <span className={x.resultThumb}>{initials(screen.business)}</span>
        <p className={x.resultName}>{screen.business}</p>
        <p className={x.resultCategory}>{screen.category}</p>
        <Skeleton widths={["86%", "62%"]} />
        <span className={x.chipRow}>
          {screen.chips.map((chip, index) => (
            <span key={chip} className={`${x.chip} ${index === 0 ? x.chipTap : ""}`}>
              {chip}
            </span>
          ))}
        </span>
      </div>
      <div className={`${x.card} ${x.ghostCard}`}>
        <Skeleton widths={["58%", "80%", "44%"]} />
      </div>
      <div className={`${x.card} ${x.ghostCard} ${x.ghostCardLate}`}>
        <Skeleton widths={["64%", "72%"]} />
      </div>
    </div>
  );
}

function SiteScreen({ screen, time }: { screen: Extract<JourneyCodeScreen, { kind: "site" }>; time?: string }) {
  const photo = photos[screen.photo];
  return (
    <div className={`${x.page} ${x.pageCream} ${x.site}`}>
      <div className={x.sitePhoto} data-tone="dark">
        <Image src={photo.src} alt="" fill sizes={imageSizes} className={x.cover} />
        <span className={x.sitePhotoShade} />
        <StatusBar time={time} tone="dark" />
        <div className={x.siteHeroText}>
          <p className={x.siteName}>{screen.business}</p>
          <p className={x.siteTagline}>{screen.tagline}</p>
        </div>
      </div>
      <div className={x.siteBody}>
        <span className={x.chipRow}>
          {screen.items.map((item) => (
            <span key={item} className={x.chip}>
              {item}
            </span>
          ))}
        </span>
        <ul className={x.rows}>
          {screen.rows.map((row) => (
            <li key={row.text}>
              <span className={x.rowIcon}>{rowIcons[row.icon]}</span>
              {row.text}
            </li>
          ))}
        </ul>
        <span className={`${x.button} ${x.buttonPulse}`}>{screen.cta}</span>
      </div>
    </div>
  );
}

function ReviewScreen({ screen, time }: { screen: Extract<JourneyCodeScreen, { kind: "review" }>; time?: string }) {
  return (
    <div className={`${x.page} ${x.pageWhite}`}>
      <StatusBar time={time} />
      <div className={x.reviewHead}>
        <span className={x.avatar}>{initials(screen.business)}</span>
        <p className={x.reviewBusiness}>{screen.business}</p>
      </div>
      <p className={x.reviewTitle}>{label.reviewTitle}</p>
      <span className={x.stars}>
        {[0, 1, 2, 3, 4].map((index) => (
          <OutlineStar key={index} />
        ))}
      </span>
      <div className={x.field}>
        <span className={x.fieldLabel}>
          <span className={x.caret} />
          {label.reviewField}
        </span>
        <Skeleton widths={["92%", "78%", "54%"]} className={x.fieldLines} />
      </div>
      <span className={`${x.button} ${x.buttonDisabled}`}>{label.reviewPublish}</span>
    </div>
  );
}

function StampScreen({ screen, time }: { screen: Extract<JourneyCodeScreen, { kind: "stamp" }>; time?: string }) {
  const required = 8;
  const to = Math.min(screen.from + 1, required);
  const [stamps, setStamps] = useState<number>(screen.from);
  useEffect(() => {
    // The stamp lands a beat after the screen arrives (StampCard keys the newest stamp by the count).
    const id = window.setTimeout(() => setStamps(to), reducedMotion() ? 0 : 700);
    return () => window.clearTimeout(id);
  }, [to]);
  const landed = stamps === to;
  return (
    <div className={`${x.page} ${x.pageCream}`}>
      <StatusBar time={time} />
      <p className={`${x.toast} ${landed ? x.toastIn : ""}`}>
        <TapWaves size={24} />
        {to === required ? label.stampDone : label.stampToast}
      </p>
      <div className={x.stampCard} style={{ "--brand": screen.brand, "--brand-text": screen.brandText } as CSSProperties}>
        <StampCard name={screen.business} holder={label.stampHolder} stamps={stamps} required={required} reward={screen.reward} />
      </div>
      <Skeleton widths={["70%", "48%"]} className={x.stampLines} />
    </div>
  );
}

const guideIcons = [
  <svg key="wifi" viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <path d="M3 9.5a13 13 0 0 1 18 0M6 13a8.5 8.5 0 0 1 12 0M9 16.4a4 4 0 0 1 6 0" />
    <circle cx="12" cy="19.4" r="1" fill="currentColor" stroke="none" />
  </svg>,
  <svg key="home" viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
    <path d="M4 10.5 12 4l8 6.5V20h-5.5v-5h-5v5H4z" />
  </svg>,
  <ClockIcon key="clock" size={26} />,
  <MapPinIcon key="pin" size={26} />,
];

function GuideScreen({ screen, time }: { screen: Extract<JourneyCodeScreen, { kind: "guide" }>; time?: string }) {
  return (
    <div className={`${x.page} ${x.pageCream}`}>
      <div className={x.guideHead} data-tone="dark">
        <StatusBar time={time} tone="dark" />
        <p className={x.guideWelcome}>{label.guideWelcome}</p>
        <p className={x.guideName}>{screen.business}</p>
        <span className={x.langs}>
          {label.guideLanguages.map((lang) => (
            <span key={lang} className={`${x.lang} ${lang === "EN" ? x.langOn : ""}`}>
              {lang}
            </span>
          ))}
        </span>
      </div>
      <ul className={x.guideRows}>
        {label.guideRows.map((row, index) => (
          <li key={row.title} style={{ "--r": index } as CSSProperties}>
            <span className={x.guideIcon}>{guideIcons[index]}</span>
            <span>
              <span className={x.guideTitle}>{row.title}</span>
              <span className={x.guideText}>{row.text}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ChatScreen({ screen, time }: { screen: Extract<JourneyCodeScreen, { kind: "chat" }>; time?: string }) {
  return (
    <div className={`${x.page} ${x.pageCream}`}>
      <StatusBar time={time} />
      <div className={x.chatHead}>
        <span className={x.avatar}>{initials(screen.business)}</span>
        <span>
          <span className={x.chatName}>{screen.assistant}</span>
          <span className={x.chatOnline}>{label.chatOnline}</span>
        </span>
      </div>
      <div className={x.thread}>
        <p className={x.bubbleMe}>{screen.question}</p>
        <span className={x.typing}>
          <span />
          <span />
          <span />
        </span>
        <div className={x.reply}>
          <div className={x.bubbleBot}>
            <Skeleton widths={["94%", "82%", "58%"]} />
          </div>
          <div className={x.replyCard}>
            <span className={x.replyIcon}>{screen.card.icon === "pin" ? <MapPinIcon size={28} /> : <BagGlyph size={28} />}</span>
            <span className={x.replyTitle}>{screen.card.title}</span>
            <span className={x.replyAction}>{screen.card.action}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SocialScreen({ screen, time }: { screen: Extract<JourneyCodeScreen, { kind: "social" }>; time?: string }) {
  const plate = dayJourney.plates.social;
  return (
    <div className={`${x.page} ${x.window}`}>
      <StatusBar time={time} />
      <div className={x.windowPlate}>
        <span className={x.tapRing} />
        <TapPlate variant="sticker" finish="white" symbol="social" line1={plate.line1} line2={plate.line2} className={x.plateSvg} />
      </div>
      <div className={x.sheet}>
        <div className={x.sheetHead}>
          <span className={x.avatar}>{initials(screen.business)}</span>
          <span>
            <span className={x.sheetName}>{screen.business}</span>
            <span className={x.sheetLine}>{label.socialLine}</span>
          </span>
        </div>
        <span className={x.tiles}>
          <span />
          <span />
          <span />
        </span>
        <span className={`${x.button} ${x.buttonPulse}`}>{label.socialFollow}</span>
      </div>
    </div>
  );
}

function ShopScreen({ screen, time }: { screen: Extract<JourneyCodeScreen, { kind: "shop" }>; time?: string }) {
  const copy = { ...mockupCopy.pt, shopBrand: screen.business, shopTotal: label.shopTotal };
  return (
    <div className={`${x.page} ${x.pageCream}`}>
      <StatusBar time={time} />
      <div className={x.shop}>
        <OnlineShopMockup t={copy} />
      </div>
    </div>
  );
}

function OrderScreen({ screen, time }: { screen: Extract<JourneyCodeScreen, { kind: "order" }>; time?: string }) {
  return (
    <div className={`${x.page} ${x.pageInk}`} data-tone="dark">
      <StatusBar time={time} tone="dark" />
      <div className={x.orderHead}>
        <p className={x.orderName}>{screen.business}</p>
        <span className={x.orderTable}>{screen.table}</span>
      </div>
      <ul className={x.dishes}>
        {screen.dishes.map((dish, index) => (
          <li key={dish} style={{ "--r": index } as CSSProperties}>
            <span className={x.dishThumb} data-dish={index}>
              <PlayGlyph />
            </span>
            <span className={x.dishName}>{dish}</span>
            <span className={x.dishAdd}>+</span>
          </li>
        ))}
      </ul>
      <div className={x.orderBar}>
        <span className={x.orderCount}>
          {screen.dishes.length} {label.orderTotal}
        </span>
        <span className={`${x.button} ${x.buttonGold}`}>{screen.cta}</span>
        <span className={x.orderNote}>
          <QrGlyph />
          {screen.note}
        </span>
      </div>
    </div>
  );
}

function BookingScreen({ screen, time }: { screen: Extract<JourneyCodeScreen, { kind: "booking" }>; time?: string }) {
  const serviceIndex = screen.services.length - 1;
  return (
    <div className={`${x.page} ${x.pageWhite}`}>
      <StatusBar time={time} />
      <p className={x.bookBusiness}>{screen.business}</p>
      <p className={x.bookTitle}>{screen.title}</p>
      <p className={x.group}>{label.bookingService}</p>
      <span className={x.chipRow}>
        {screen.services.map((service, index) => (
          <span key={service} className={`${x.chip} ${index === serviceIndex ? `${x.pick} ${x.pick1}` : ""}`}>
            {service}
          </span>
        ))}
      </span>
      <p className={x.group}>{label.bookingWho}</p>
      <span className={x.chipRow}>
        {screen.people.map((person, index) => (
          <span key={person} className={`${x.chip} ${index === 0 ? `${x.pick} ${x.pick2}` : ""}`}>
            {person}
          </span>
        ))}
      </span>
      <p className={x.group}>{label.bookingWhen}</p>
      <span className={x.slots}>
        {screen.slots.map((slot, index) => (
          <span key={slot} className={`${x.slot} ${index === 3 ? `${x.pick} ${x.pick3}` : ""}`}>
            {slot}
          </span>
        ))}
      </span>
      <span className={`${x.button} ${x.buttonLate} ${x.bookCta}`}>{screen.cta}</span>
    </div>
  );
}

function DatesScreen({ screen, time }: { screen: Extract<JourneyCodeScreen, { kind: "dates" }>; time?: string }) {
  const offset = 3; // the month starts on a Thursday (fictional calendar)
  const days = Array.from({ length: 31 }, (_, index) => index + 1);
  return (
    <div className={`${x.page} ${x.pageWhite}`}>
      <StatusBar time={time} />
      <p className={x.bookBusiness}>{screen.business}</p>
      <p className={x.bookTitle}>{screen.month}</p>
      <span className={x.calendar}>
        {label.weekdays.map((day, index) => (
          <span key={`w${index}`} className={x.weekday}>
            {day}
          </span>
        ))}
        {Array.from({ length: offset }, (_, index) => (
          <span key={`e${index}`} />
        ))}
        {days.map((day) => {
          const inRange = day >= screen.from && day <= screen.to;
          const edge = day === screen.from || day === screen.to;
          return (
            <span
              key={day}
              className={`${x.day} ${inRange ? x.dayRange : ""} ${edge ? x.dayEdge : ""}`}
              style={inRange ? ({ "--d": day - screen.from } as CSSProperties) : undefined}
            >
              {day}
            </span>
          );
        })}
      </span>
      <p className={x.nights}>
        <CalendarGlyph size={24} />
        {screen.from}–{screen.to} {screen.month.toLowerCase()} · {label.nights(screen.to - screen.from)}
      </p>
      <span className={`${x.button} ${x.buttonLate}`}>{screen.cta}</span>
    </div>
  );
}

function QueueScreen({ screen, time }: { screen: Extract<JourneyCodeScreen, { kind: "queue" }>; time?: string }) {
  return (
    <div className={`${x.page} ${x.pageCream}`}>
      <StatusBar time={time} />
      <p className={x.bookBusiness}>{screen.business}</p>
      <p className={x.bookTitle}>{screen.title}</p>
      <div className={x.queueOrb}>
        <span className={x.queueRing} />
        <span className={x.queueRing} data-late="" />
        <span className={x.queueCore}>
          <ClockIcon size={56} />
        </span>
      </div>
      <p className={x.queueAhead}>{screen.ahead}</p>
      <p className={x.queueText}>{label.queueHint}</p>
      <p className={x.queueText}>{screen.text}</p>
    </div>
  );
}

function CodeScreen({ screen, time }: { screen: JourneyCodeScreen; time?: string }) {
  switch (screen.kind) {
    case "search":
      return <SearchScreen screen={screen} time={time} />;
    case "site":
      return <SiteScreen screen={screen} time={time} />;
    case "review":
      return <ReviewScreen screen={screen} time={time} />;
    case "stamp":
      return <StampScreen screen={screen} time={time} />;
    case "guide":
      return <GuideScreen screen={screen} time={time} />;
    case "chat":
      return <ChatScreen screen={screen} time={time} />;
    case "social":
      return <SocialScreen screen={screen} time={time} />;
    case "shop":
      return <ShopScreen screen={screen} time={time} />;
    case "order":
      return <OrderScreen screen={screen} time={time} />;
    case "booking":
      return <BookingScreen screen={screen} time={time} />;
    case "dates":
      return <DatesScreen screen={screen} time={time} />;
    case "queue":
      return <QueueScreen screen={screen} time={time} />;
  }
}

/* ---------- Still with code fallback ---------- */

// The stills in public/home-ultra are produced in parallel and may not exist yet. A missing file can keep
// the image optimiser busy for a long time (seen on next dev) instead of failing fast, so each still is
// checked once with a cheap HEAD request on the static file first (the next step's screen is mounted one
// step early, so the check usually ends before its turn); the screen shows the code fallback
// when it is missing, and onError stays as a second line. Results are kept for the page's life.
const stillStatus = new Map<string, boolean>();
const stillChecks = new Map<string, Promise<boolean>>();

function checkStill(src: string): Promise<boolean> {
  let check = stillChecks.get(src);
  if (!check) {
    // No answer within 2.5s counts as missing: the code screen is a complete screen of its own.
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 2500);
    check = fetch(src, { method: "HEAD", signal: controller.signal })
      .then((response) => response.ok && (response.headers.get("content-type") ?? "").startsWith("image/"))
      .catch(() => false)
      .then((ok) => {
        window.clearTimeout(timer);
        stillStatus.set(src, ok);
        return ok;
      });
    stillChecks.set(src, check);
  }
  return check;
}

function StillScreen({ screen, time }: { screen: Extract<JourneyScreen, { kind: "still" }>; time?: string }) {
  const [status, setStatus] = useState<boolean | null>(() => stillStatus.get(screen.src) ?? null);
  useEffect(() => {
    if (status !== null) return;
    let cancelled = false;
    checkStill(screen.src).then((ok) => {
      if (!cancelled) setStatus(ok);
    });
    return () => {
      cancelled = true;
    };
  }, [screen.src, status]);
  const fail = useCallback(() => {
    stillStatus.set(screen.src, false);
    setStatus(false);
  }, [screen.src]);
  // An error that happened before hydration never reaches onError: check the element once mounted.
  const imageRef = useCallback(
    (img: HTMLImageElement | null) => {
      if (img && img.complete && img.naturalWidth === 0 && img.getAttribute("src")) fail();
    },
    [fail],
  );
  if (status === null) return <div className={x.still} />;
  if (!status) {
    return (
      <ScaledScreen>
        <CodeScreen screen={screen.fallback} time={time} />
      </ScaledScreen>
    );
  }
  return (
    <div className={x.still} data-tone={screen.tone}>
      <Image
        ref={imageRef}
        src={screen.src}
        alt=""
        width={480}
        height={1038}
        sizes={imageSizes}
        className={x.cover}
        onError={fail}
      />
      {screen.tone === "dark" ? <span className={x.stillScrim} /> : null}
    </div>
  );
}

/** One phone screen (decorative). `time` is the step time, shown in the status bar clock when it is a time. */
export function JourneyScreenView({ screen, time }: { screen: JourneyScreen; time?: string }) {
  if (screen.kind === "still") return <StillScreen screen={screen} time={time} />;
  return (
    <ScaledScreen>
      <CodeScreen screen={screen} time={time} />
    </ScaledScreen>
  );
}

/** Screens whose content is an image worth loading one step early. */
export function screenHasImage(screen: JourneyScreen): boolean {
  return screen.kind === "still" || screen.kind === "site";
}

import Image from "next/image";
import type { ReactNode } from "react";
import { mockupCopy, type MockupCopy } from "@/content/mockups";
import type { Product } from "@/content/products";
import type { ProductId } from "@/content/types";
import { Check, TapWaves, PhoneIcon, SparkleIcon, StarFilled } from "@/components/icons";
import type { Locale } from "@/lib/i18n";
import { TapPlate, type PlateSymbol } from "./TapPlate";
import { LandingPageMockup, OnlineShopMockup, WebsiteMockup } from "./WebMockups";

function PhoneFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`relative mx-auto aspect-[9/18.5] w-[15.5rem] rounded-[2.6rem] bg-[#0f0b10] p-2.5 shadow-[0_0_0_2px_#3a3140,0_40px_80px_-30px_rgb(var(--shadow-color)/0.55)] ${className}`}
    >
      <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[2.1rem] bg-[#fbf7f1] text-[#1d1220]">
        <span aria-hidden="true" className="absolute top-2 left-1/2 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-[#0f0b10]" />
        {children}
      </div>
    </div>
  );
}

function ScreenHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="border-b border-[#e7ddd0] bg-white px-4 pt-10 pb-3">
      <p className="text-sm font-bold">{title}</p>
      {subtitle ? <p className="text-[0.7rem] text-[#1e7a4c]">{subtitle}</p> : null}
    </div>
  );
}

function Bubble({ from, children }: { from: "user" | "bot"; children: ReactNode }) {
  return (
    <p
      className={`max-w-[85%] rounded-2xl px-3 py-2 text-[0.72rem] leading-snug ${
        from === "user" ? "self-end rounded-br-md bg-[#7a2d60] text-white" : "self-start rounded-bl-md border border-[#e7ddd0] bg-white"
      }`}
    >
      {children}
    </p>
  );
}

function FloatingChip({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`absolute flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-xs font-semibold text-text shadow-[0_16px_40px_-18px_rgb(var(--shadow-color)/0.5)] motion-safe:animate-float ${className}`}
    >
      {children}
    </div>
  );
}

function LoyaltyScreen({ t }: { t: MockupCopy }) {
  return (
    <>
      <ScreenHeader title={t.loyaltyTitle} />
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="rounded-2xl bg-gradient-to-br from-[#7a2d60] to-[#3b1631] p-4 text-white">
          <p className="text-[0.65rem] tracking-[0.18em] uppercase opacity-80">{t.loyaltyLine1}</p>
          <div className="mt-3 grid grid-cols-5 gap-2">
            {Array.from({ length: 10 }, (_, index) => (
              <span
                key={index}
                className={`grid aspect-square place-items-center rounded-full border ${index < 7 ? "border-[#e9c685] bg-[#e9c685] text-[#3b1631]" : "border-white/40"}`}
              >
                {index < 7 ? <Check size={12} /> : null}
              </span>
            ))}
          </div>
        </div>
        <p className="text-sm font-bold">{t.loyaltyProgress}</p>
        <p className="text-[0.72rem] text-[#574659]">{t.loyaltyReward}</p>
      </div>
    </>
  );
}

function BookingScreen({ t }: { t: MockupCopy }) {
  const slots = ["12:30", "13:00", "13:30", "20:00", "20:30", "21:00"];
  return (
    <>
      <ScreenHeader title={t.bookingTitle} />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex gap-2 text-[0.7rem]">
          <span className="rounded-full bg-white px-3 py-1.5 font-semibold shadow-sm">{t.bookingDate}</span>
          <span className="rounded-full bg-white px-3 py-1.5 shadow-sm">{t.bookingPeople}</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {slots.map((slot) => (
            <span
              key={slot}
              className={`rounded-lg border py-2 text-center text-[0.72rem] font-semibold ${
                slot === "20:30" ? "border-[#7a2d60] bg-[#7a2d60] text-white" : "border-[#e7ddd0] bg-white"
              }`}
            >
              {slot}
            </span>
          ))}
        </div>
        <span className="mt-auto rounded-full bg-[#1d1220] py-2.5 text-center text-[0.75rem] font-semibold text-white">{t.bookingConfirm}</span>
      </div>
    </>
  );
}

function WaitlistScreen({ t }: { t: MockupCopy }) {
  return (
    <>
      <ScreenHeader title={t.waitlistTitle} />
      <div className="flex flex-1 flex-col items-center gap-3 p-4 text-center">
        <div className="mt-2 grid h-24 w-24 place-items-center rounded-full border-[6px] border-[#e9c685] border-r-[#7a2d60]">
          <span className="font-display text-4xl">3</span>
        </div>
        <p className="text-sm font-bold">{t.waitlistPosition}</p>
        <p className="text-[0.72rem] text-[#574659]">{t.waitlistEta}</p>
        <div className="mt-auto w-full rounded-2xl border border-[#e7ddd0] bg-white p-3 text-left text-[0.72rem] leading-snug shadow-sm">
          <p className="mb-1 text-[0.6rem] font-bold tracking-[0.14em] text-[#1e7a4c] uppercase">SMS</p>
          {t.waitlistSms}
        </div>
      </div>
    </>
  );
}

function ChatScreen({ t }: { t: MockupCopy }) {
  return (
    <>
      <ScreenHeader title={t.chatTitle} subtitle={t.chatOnline} />
      <div className="flex flex-1 flex-col gap-2.5 bg-[#f4ece1] p-3">
        <Bubble from="user">{t.chatUser}</Bubble>
        <Bubble from="bot">{t.chatBot}</Bubble>
        <Bubble from="user">{t.chatUser2}</Bubble>
        <span className="flex gap-1 self-start rounded-2xl rounded-bl-md border border-[#e7ddd0] bg-white px-3 py-2.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#b9a9bf] motion-safe:animate-pulse" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#b9a9bf] motion-safe:animate-pulse [animation-delay:0.2s]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#b9a9bf] motion-safe:animate-pulse [animation-delay:0.4s]" />
        </span>
      </div>
    </>
  );
}

function VoiceScreen({ t }: { t: MockupCopy }) {
  const bars = [8, 16, 26, 14, 30, 20, 10, 24, 32, 18, 12, 22, 28, 14, 8];
  return (
    <div className="flex flex-1 flex-col items-center gap-4 bg-gradient-to-b from-[#2a1830] to-[#120a14] px-4 pt-12 pb-5 text-center text-white">
      <p className="text-[0.65rem] tracking-[0.18em] uppercase opacity-70">{t.voiceTitle}</p>
      <p className="text-sm font-semibold">{t.voiceCaller}</p>
      <div aria-hidden="true" className="flex h-10 items-center gap-1">
        {bars.map((height, index) => (
          <span
            key={index}
            style={{ height, animationDelay: `${index * 0.08}s` }}
            className="w-1 origin-center rounded-full bg-[#e9c685] motion-safe:animate-pulse"
          />
        ))}
      </div>
      <p className="self-start rounded-2xl rounded-bl-md bg-white/10 px-3 py-2 text-left text-[0.72rem]">{t.voiceTranscript}</p>
      <p className="self-end rounded-2xl rounded-br-md bg-[#e39ac6] px-3 py-2 text-left text-[0.72rem] text-[#1d0d1a]">{t.voiceAnswer}</p>
      <span className="mt-auto grid h-12 w-12 place-items-center rounded-full bg-[#b3261e]">
        <PhoneIcon size={20} className="rotate-[135deg]" />
      </span>
    </div>
  );
}

function ReviewsScreen({ t }: { t: MockupCopy }) {
  return (
    <>
      <ScreenHeader title={t.reviewsTitle} />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="rounded-2xl border border-[#e7ddd0] bg-white p-3">
          <div className="flex gap-0.5 text-[#e3a21a]">
            {[0, 1, 2].map((index) => (
              <StarFilled key={index} size={13} />
            ))}
            {[0, 1].map((index) => (
              <StarFilled key={index} size={13} className="text-[#d9cfc3]" />
            ))}
          </div>
          <p className="mt-2 text-[0.72rem] leading-snug">{t.reviewsText}</p>
        </div>
        <div className="rounded-2xl border border-[#e8cfe0] bg-[#f4e4ee] p-3">
          <p className="flex items-center gap-1 text-[0.62rem] font-bold tracking-[0.14em] text-[#7a2d60] uppercase">
            <SparkleIcon size={12} /> {t.reviewsDraft}
          </p>
          <p className="mt-2 text-[0.72rem] leading-snug">{t.reviewsReply}</p>
        </div>
        <span className="mt-auto rounded-full bg-[#7a2d60] py-2.5 text-center text-[0.75rem] font-semibold text-white">{t.reviewsApprove}</span>
      </div>
    </>
  );
}

function MenuScreen({ t }: { t: MockupCopy }) {
  const highlights = [t.menuHighlights, t.menuHighlight1, t.menuHighlight2, t.menuHighlight3];
  const dishes = [
    { name: t.menuDish1, price: t.menuPrice1, tone: "from-[#c9774a] to-[#7a3b22]", video: true },
    { name: t.menuDish2, price: t.menuPrice2, tone: "from-[#e0a85a] to-[#9a4d1f]", video: false },
    { name: t.menuDish3, price: t.menuPrice3, tone: "from-[#efd9a0] to-[#b88a3e]", video: false },
    { name: t.menuDish4, price: t.menuPrice4, tone: "from-[#f3c97a] to-[#a8641c]", video: true },
  ];
  return (
    <>
      <ScreenHeader title={t.menuTitle} />
      <div className="flex flex-1 flex-col gap-3 p-3">
        <div className="flex justify-between px-1">
          {highlights.map((label, index) => (
            <span key={label + index} className="flex w-12 flex-col items-center gap-1">
              <span className={`grid h-11 w-11 place-items-center rounded-full p-[2px] ${index === 0 ? "bg-gradient-to-br from-[#e9c685] to-[#7a2d60]" : "bg-[#e7ddd0]"}`}>
                <span className="h-full w-full rounded-full border-2 border-[#fbf7f1] bg-gradient-to-br from-[#d9a066] to-[#8a4a2a]" />
              </span>
              <span className={`w-full truncate text-center text-[0.58rem] ${index === 0 ? "font-bold" : "text-[#574659]"}`}>{label}</span>
            </span>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {dishes.map((dish) => (
            <div key={dish.name} className={`relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-xl bg-gradient-to-br p-2 text-white ${dish.tone}`}>
              {dish.video ? (
                <span className="absolute top-1.5 right-1.5 grid h-5 w-5 place-items-center rounded-full bg-black/35">
                  <svg aria-hidden="true" viewBox="0 0 10 10" width="8" height="8" fill="currentColor">
                    <path d="M2.5 1.5 8.5 5l-6 3.5v-7Z" />
                  </svg>
                </span>
              ) : null}
              <span className="text-[0.6rem] leading-tight font-semibold [text-shadow:0_1px_2px_rgb(0_0_0/0.4)]">{dish.name}</span>
              <span className="mt-0.5 w-fit rounded-full bg-white/90 px-1.5 py-0.5 text-[0.6rem] font-bold text-[#1d1220]">{dish.price}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function AutomationDiagram({ t }: { t: MockupCopy }) {
  const steps = [t.flowAction1, t.flowAction2, t.flowAction3];
  return (
    <div className="relative mx-auto flex w-full max-w-sm flex-col items-stretch gap-3">
      <div className="card flex items-center gap-3 p-4">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold-soft text-gold-text">
          <SparkleIcon size={18} />
        </span>
        <span className="font-semibold text-text">{t.flowTrigger}</span>
      </div>
      {steps.map((step, index) => (
        <div key={step} className="flex flex-col items-center gap-3">
          <span aria-hidden="true" className="h-6 w-px bg-line-strong" />
          <div
            data-reveal
            style={{ ["--reveal-delay" as string]: `${index * 150}ms` }}
            className="card flex w-full items-center gap-3 p-4"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent-soft text-accent-text font-mono text-sm">
              {index + 1}
            </span>
            <span className="font-medium text-text">{step}</span>
            <Check size={18} className="ml-auto text-success" />
          </div>
        </div>
      ))}
      <p className="mt-2 text-center text-sm font-semibold text-success">{t.flowDone}</p>
    </div>
  );
}

function GuideGlyph({ path }: { path: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={path} />
    </svg>
  );
}

const guideIcons = {
  wifi: "M4 9.5a12 12 0 0 1 16 0M7 12.8a7.5 7.5 0 0 1 10 0M10 16a3 3 0 0 1 4 0M12 19h.01",
  clock: "M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm0 4v4l2.5 1.5",
  rules: "M7 4h10v16H7zM10 8h4M10 12h4M10 16h2",
  bins: "M5 7h14M9 7V5h6v2M7 7l1 13h8l1-13M10.5 11v5M13.5 11v5",
  tips: "M12 21s-6-5.6-6-10.5A6 6 0 0 1 18 10.5C18 15.4 12 21 12 21Zm0-8.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
  sos: "M12 4v16M4 12h16",
};

function GuideScreen({ t }: { t: MockupCopy }) {
  const languages = ["PT", "EN", "FR", "ES"];
  const rows = [
    { icon: guideIcons.clock, label: t.guideCheckout, value: t.guideCheckoutTime },
    { icon: guideIcons.rules, label: t.guideRules },
    { icon: guideIcons.bins, label: t.guideBins },
    { icon: guideIcons.tips, label: t.guideTips },
    { icon: guideIcons.sos, label: t.guideEmergency },
  ];
  return (
    <>
      <div className="bg-gradient-to-br from-[#7a2d60] to-[#3b1631] px-4 pt-10 pb-4 text-white">
        <p className="text-[0.62rem] tracking-[0.16em] uppercase opacity-75">{t.guideWelcome}</p>
        <p className="font-display text-xl leading-tight">{t.guideTitle}</p>
        <div className="mt-2.5 flex gap-1.5">
          {languages.map((language) => (
            <span
              key={language}
              className={`rounded-full px-2 py-0.5 text-[0.58rem] font-bold ${language === t.guideLang ? "bg-[#e9c685] text-[#3b1631]" : "bg-white/15 text-white/85"}`}
            >
              {language}
            </span>
          ))}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="rounded-2xl border border-[#e7ddd0] bg-white p-3 shadow-sm">
          <p className="flex items-center gap-1.5 text-[0.72rem] font-bold">
            <span className="text-[#7a2d60]">
              <GuideGlyph path={guideIcons.wifi} />
            </span>
            {t.guideWifi}
          </p>
          <p className="mt-1 text-[0.68rem] text-[#574659]">{t.guideWifiName}</p>
          <div className="mt-1.5 flex items-center justify-between gap-2">
            <span className="font-mono text-[0.72rem] tracking-[0.2em] text-[#1d1220]">••••••••</span>
            <span className="rounded-full bg-[#7a2d60] px-2.5 py-1 text-[0.6rem] font-semibold text-white">{t.guideCopy}</span>
          </div>
        </div>
        <ul className="flex flex-col overflow-hidden rounded-2xl border border-[#e7ddd0] bg-white">
          {rows.map((row, index) => (
            <li key={row.label} className={`flex items-center gap-2 px-3 py-2 text-[0.7rem] ${index > 0 ? "border-t border-[#efe6da]" : ""}`}>
              <span className="text-[#7a2d60]">
                <GuideGlyph path={row.icon} />
              </span>
              <span className="font-medium">{row.label}</span>
              {row.value ? <span className="ml-auto font-bold">{row.value}</span> : <span className="ml-auto text-[#b9a9bf]">›</span>}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

const phoneScreens: Partial<Record<ProductId, (t: MockupCopy) => ReactNode>> = {
  loyalty: (t) => <LoyaltyScreen t={t} />,
  bookings: (t) => <BookingScreen t={t} />,
  waitlist: (t) => <WaitlistScreen t={t} />,
  "ai-chatbot": (t) => <ChatScreen t={t} />,
  "ai-voice": (t) => <VoiceScreen t={t} />,
  "ai-reviews": (t) => <ReviewsScreen t={t} />,
  "digital-menu": (t) => <MenuScreen t={t} />,
  "guest-guide": (t) => <GuideScreen t={t} />,
};

interface ProductVisualProps {
  product: Product;
  locale: Locale;
  priority?: boolean;
}

export function ProductVisual({ product, locale, priority = false }: ProductVisualProps) {
  const t = mockupCopy[locale];

  if (product.image) {
    return (
      <Image
        src={product.image.src}
        alt={product.image.alt[locale]}
        width={product.image.width}
        height={product.image.height}
        sizes="(min-width: 1024px) 40vw, 90vw"
        priority={priority}
        className="h-auto w-full rounded-[2rem] object-cover"
      />
    );
  }

  if (product.id === "google-review-plates" || product.id === "social-plates") {
    const isReview = product.id === "google-review-plates";
    const line1 = isReview ? t.reviewLine1 : t.socialLine1;
    const line2 = isReview ? t.reviewLine2 : t.socialLine2;
    const symbol: PlateSymbol = isReview ? "stars" : "social";
    return (
      <div className="relative mx-auto aspect-square w-full max-w-md" data-image-slot={t.imageSlot}>
        <div aria-hidden="true" className="absolute inset-[6%] rounded-full bg-[radial-gradient(closest-side,rgb(var(--glow)/0.25),transparent)]" />
        <TapPlate
          variant="stand"
          finish="black"
          symbol={symbol}
          line1={line1}
          line2={line2}
          className="absolute top-[4%] left-[8%] h-auto w-[52%] drop-shadow-[0_30px_40px_rgba(0,0,0,0.3)]"
        />
        <TapPlate
          variant="square"
          finish="white"
          symbol={symbol}
          line1={line1}
          line2={line2}
          className="absolute right-[4%] bottom-[14%] h-auto w-[40%] rotate-[6deg] drop-shadow-[0_24px_30px_rgba(0,0,0,0.22)]"
        />
        <TapPlate
          variant="sticker"
          finish="black"
          symbol={symbol}
          line1={line1}
          line2={line2}
          className="absolute bottom-[4%] left-[14%] h-auto w-[28%] -rotate-[8deg] drop-shadow-[0_18px_24px_rgba(0,0,0,0.25)]"
        />
        <FloatingChip className="top-[8%] right-[4%]">
          <TapWaves size={16} className="text-accent-text" /> {t.tapQrChip}
        </FloatingChip>
      </div>
    );
  }

  if (product.id === "automation") {
    return <AutomationDiagram t={t} />;
  }

  if (product.id === "landing-page") return <LandingPageMockup t={t} />;
  if (product.id === "website") return <WebsiteMockup t={t} />;
  if (product.id === "online-shop") return <OnlineShopMockup t={t} />;

  const screen = phoneScreens[product.id];
  return (
    <div className="relative mx-auto w-full max-w-md py-4">
      <div aria-hidden="true" className="absolute inset-[10%] rounded-full bg-[radial-gradient(closest-side,rgb(var(--glow)/0.28),transparent)]" />
      {product.id === "digital-menu" ? (
        <TapPlate
          variant="round"
          finish="black"
          symbol="menu"
          line1={t.menuLine1}
          line2={t.menuLine2}
          className="absolute bottom-[4%] left-[0%] z-10 h-auto w-[38%] -rotate-[6deg] drop-shadow-[0_24px_30px_rgba(0,0,0,0.3)]"
        />
      ) : null}
      {product.id === "guest-guide" ? (
        <TapPlate
          variant="wall"
          finish="white"
          symbol="home"
          line1={t.guideLine1}
          line2={t.guideLine2}
          className="absolute bottom-[0%] -left-[2%] z-10 h-auto w-[30%] -rotate-[5deg] drop-shadow-[0_24px_30px_rgba(0,0,0,0.28)]"
        />
      ) : null}
      {product.id === "loyalty" ? (
        <TapPlate
          variant="sticker"
          finish="black"
          symbol="stamps"
          line1={t.loyaltyLine1}
          line2={t.loyaltyLine2}
          className="absolute bottom-[6%] left-[2%] z-10 h-auto w-[34%] -rotate-[8deg] drop-shadow-[0_18px_24px_rgba(0,0,0,0.25)]"
        />
      ) : null}
      <PhoneFrame>{screen ? screen(t) : null}</PhoneFrame>
      {product.id === "digital-menu" || product.id === "guest-guide" ? (
        <FloatingChip className="top-[10%] right-0">
          <TapWaves size={16} className="text-accent-text" /> {t.tapQrChip}
        </FloatingChip>
      ) : null}
      {product.id === "guest-guide" ? (
        <FloatingChip className="right-0 bottom-[16%]">
          <Check size={14} className="text-success" /> {t.guideLanguagesChip}
        </FloatingChip>
      ) : null}
      {product.id === "bookings" ? (
        <FloatingChip className="right-0 bottom-[12%]">
          <Check size={14} className="text-success" /> {t.bookingReminder}
        </FloatingChip>
      ) : null}
      {product.id === "ai-voice" ? (
        <FloatingChip className="right-0 bottom-[16%]">
          <Check size={14} className="text-success" /> {t.voiceSummary}
        </FloatingChip>
      ) : null}
    </div>
  );
}

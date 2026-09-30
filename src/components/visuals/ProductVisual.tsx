import Image from "next/image";
import type { ReactNode } from "react";
import { mockupCopy, type MockupCopy } from "@/content/mockups";
import type { Product } from "@/content/products";
import type { ProductId } from "@/content/types";
import { Check, NfcWaves, PhoneIcon, SparkleIcon, StarFilled } from "@/components/icons";
import type { Locale } from "@/lib/i18n";
import { NfcPlate, type PlateSymbol } from "./NfcPlate";

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

const phoneScreens: Partial<Record<ProductId, (t: MockupCopy) => ReactNode>> = {
  loyalty: (t) => <LoyaltyScreen t={t} />,
  bookings: (t) => <BookingScreen t={t} />,
  waitlist: (t) => <WaitlistScreen t={t} />,
  "ai-chatbot": (t) => <ChatScreen t={t} />,
  "ai-voice": (t) => <VoiceScreen t={t} />,
  "ai-reviews": (t) => <ReviewsScreen t={t} />,
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

  if (product.id === "nfc-google-reviews" || product.id === "nfc-social") {
    const isReview = product.id === "nfc-google-reviews";
    const line1 = isReview ? t.reviewLine1 : t.socialLine1;
    const line2 = isReview ? t.reviewLine2 : t.socialLine2;
    const symbol: PlateSymbol = isReview ? "stars" : "social";
    return (
      <div className="relative mx-auto aspect-square w-full max-w-md" data-image-slot={t.imageSlot}>
        <div aria-hidden="true" className="absolute inset-[6%] rounded-full bg-[radial-gradient(closest-side,rgb(var(--glow)/0.25),transparent)]" />
        <NfcPlate
          variant="stand"
          finish="black"
          symbol={symbol}
          line1={line1}
          line2={line2}
          className="absolute top-[4%] left-[8%] h-auto w-[52%] drop-shadow-[0_30px_40px_rgba(0,0,0,0.3)]"
        />
        <NfcPlate
          variant="square"
          finish="white"
          symbol={symbol}
          line1={line1}
          line2={line2}
          className="absolute right-[4%] bottom-[14%] h-auto w-[40%] rotate-[6deg] drop-shadow-[0_24px_30px_rgba(0,0,0,0.22)]"
        />
        <NfcPlate
          variant="sticker"
          finish="black"
          symbol={symbol}
          line1={line1}
          line2={line2}
          className="absolute bottom-[4%] left-[14%] h-auto w-[28%] -rotate-[8deg] drop-shadow-[0_18px_24px_rgba(0,0,0,0.25)]"
        />
        <FloatingChip className="top-[8%] right-[4%]">
          <NfcWaves size={16} className="text-accent-text" /> NFC + QR
        </FloatingChip>
      </div>
    );
  }

  if (product.id === "automation") {
    return <AutomationDiagram t={t} />;
  }

  const screen = phoneScreens[product.id];
  return (
    <div className="relative mx-auto w-full max-w-md py-4">
      <div aria-hidden="true" className="absolute inset-[10%] rounded-full bg-[radial-gradient(closest-side,rgb(var(--glow)/0.28),transparent)]" />
      {product.id === "loyalty" ? (
        <NfcPlate
          variant="sticker"
          finish="black"
          symbol="stamps"
          line1={t.loyaltyLine1}
          line2={t.loyaltyLine2}
          className="absolute bottom-[6%] left-[2%] z-10 h-auto w-[34%] -rotate-[8deg] drop-shadow-[0_18px_24px_rgba(0,0,0,0.25)]"
        />
      ) : null}
      <PhoneFrame>{screen ? screen(t) : null}</PhoneFrame>
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

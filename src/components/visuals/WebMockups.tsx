import Image from "next/image";
import type { ReactNode } from "react";
import type { MockupCopy } from "@/content/mockups";
import { Check, ClockIcon, MapPinIcon, WhatsAppIcon } from "@/components/icons";

// CSS mockups for the website products. Generic content only: no real brands, no people, no reviews.

const ink = "text-[#1d1220]";
const muted = "text-[#574659]";

function LockGlyph() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <rect x="5" y="10.5" width="14" height="10" rx="2" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
    </svg>
  );
}

function BrowserFrame({ address, children, className = "" }: { address: string; children: ReactNode; className?: string }) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_40px_80px_-30px_rgb(var(--shadow-color)/0.55)] ${className}`}
    >
      <div className="flex items-center gap-3 border-b border-line bg-surface-2 px-3 py-2">
        <span className="flex shrink-0 gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#e5786d]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#e9c685]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#8cc79f]" />
        </span>
        <span className="flex min-w-0 flex-1 items-center gap-1.5 rounded-full bg-surface px-3 py-1 text-[0.65rem] text-subtle">
          <LockGlyph />
          <span className="truncate">{address}</span>
        </span>
      </div>
      <div className={`bg-[#fbf7f1] ${ink}`}>{children}</div>
    </div>
  );
}

function Chip({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`absolute z-20 flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-2 text-xs font-semibold whitespace-nowrap text-text shadow-[0_16px_40px_-18px_rgb(var(--shadow-color)/0.5)] motion-safe:animate-float ${className}`}
    >
      <Check size={14} className="text-success" />
      {children}
    </div>
  );
}

function Lines({ widths, className = "" }: { widths: string[]; className?: string }) {
  return (
    <span className={`flex flex-col gap-1 ${className}`}>
      {widths.map((width, index) => (
        <span key={index} style={{ width }} className="h-1.5 rounded-full bg-[#e7ddd0]" />
      ))}
    </span>
  );
}

function LandingMobile({ t }: { t: MockupCopy }) {
  return (
    <div className="w-full rounded-[1.6rem] bg-[#0f0b10] p-1.5 shadow-[0_0_0_1.5px_#3a3140,0_30px_60px_-25px_rgb(var(--shadow-color)/0.6)]">
      <div className={`flex flex-col overflow-hidden rounded-[1.25rem] bg-[#fbf7f1] ${ink}`}>
        <div className="bg-gradient-to-br from-[#7a2d60] to-[#3b1631] px-2.5 pt-5 pb-3 text-white">
          <p className="truncate text-[0.45rem] tracking-[0.14em] uppercase opacity-75">{t.landingBrand}</p>
          <p className="mt-1 font-display text-[0.68rem] leading-tight [overflow-wrap:anywhere]">{t.landingHero}</p>
          <span className="mt-2 block truncate rounded-full bg-[#e9c685] px-1 py-1 text-center text-[0.5rem] font-bold text-[#1d1220]">{t.landingBook}</span>
        </div>
        <div className="flex flex-col gap-1.5 p-2.5">
          <span className="flex items-center gap-1 text-[0.5rem] font-semibold">
            <ClockIcon size={9} /> {t.landingHours}
          </span>
          <Lines widths={["90%", "70%", "80%"]} />
          <span className="mt-1 flex items-center justify-center gap-1 rounded-full bg-[#1e7a4c] py-1 text-[0.5rem] font-semibold text-white">
            <WhatsAppIcon size={9} /> {t.landingWhatsapp}
          </span>
        </div>
      </div>
    </div>
  );
}

export function LandingPageMockup({ t }: { t: MockupCopy }) {
  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-md pt-4 pb-32 sm:pb-24">
      <div className="absolute inset-[8%] rounded-full bg-[radial-gradient(closest-side,rgb(var(--glow)/0.28),transparent)]" />
      <BrowserFrame address={t.webAddress} className="relative mr-[14%]">
        <div className="flex items-center justify-between px-4 pt-3">
          <span className="text-[0.7rem] font-bold">{t.landingBrand}</span>
          <span className="flex flex-col gap-[3px]">
            <span className="h-[2px] w-3.5 rounded-full bg-[#1d1220]" />
            <span className="h-[2px] w-3.5 rounded-full bg-[#1d1220]" />
          </span>
        </div>
        <div className="mx-3 mt-3 rounded-xl bg-gradient-to-br from-[#7a2d60] to-[#3b1631] px-4 py-5 text-white">
          <p className="max-w-[16rem] font-display text-[1.05rem] leading-tight sm:text-xl">{t.landingHero}</p>
          <p className="mt-1.5 text-[0.65rem] opacity-80">{t.landingSub}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-[#e9c685] px-3 py-1.5 text-[0.65rem] font-bold text-[#1d1220]">{t.landingBook}</span>
            <span className="flex items-center gap-1 rounded-full bg-white/15 px-3 py-1.5 text-[0.65rem] font-semibold">
              <WhatsAppIcon size={11} /> {t.landingWhatsapp}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 px-3 pt-3">
          {[
            { icon: <ClockIcon size={12} />, label: t.landingHours },
            { icon: <span className="text-[0.7rem] leading-none">≡</span>, label: t.landingMenu },
            { icon: <MapPinIcon size={12} />, label: t.landingDirections },
          ].map((item) => (
            <span key={item.label} className="flex flex-col gap-1 rounded-lg border border-[#e7ddd0] bg-white p-2 text-[0.55rem] leading-tight font-semibold">
              <span className="text-[#7a2d60]">{item.icon}</span>
              {item.label}
            </span>
          ))}
        </div>
        <div className="px-4 pt-3 pb-3">
          <p className="text-[0.65rem] font-bold">{t.landingSection}</p>
          <div className="mt-1.5 grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1.5">
            <Lines widths={["85%"]} />
            <span className="h-1.5 w-6 rounded-full bg-[#d9c3b0]" />
            <Lines widths={["70%"]} />
            <span className="h-1.5 w-6 rounded-full bg-[#d9c3b0]" />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-[#e7ddd0] bg-white px-3 py-2">
          <span className={`text-[0.55rem] ${muted}`}>{t.landingCookies}</span>
          <span className="flex shrink-0 gap-1">
            <span className="rounded-full border border-[#1d1220] px-2 py-0.5 text-[0.55rem] font-semibold">{t.landingReject}</span>
            <span className="rounded-full border border-[#1d1220] bg-[#1d1220] px-2 py-0.5 text-[0.55rem] font-semibold text-white">{t.landingAccept}</span>
          </span>
        </div>
      </BrowserFrame>
      <div className="absolute right-0 bottom-0 z-10 w-[26%] min-w-[5.5rem]">
        <LandingMobile t={t} />
      </div>
      <Chip className="top-0 right-0">{t.landingChip}</Chip>
    </div>
  );
}

// The Website product's picture (owner, 2026-10-25: «esta foto … não vende websites», show the templates):
// real screenshots of the three holiday-rental demo templates (fictional brand «Maré Alta», also the examples
// lower on the page), fanned out with the first one in front.
const websiteTemplates = ["/media/examples/website-modelo-2.jpg", "/media/examples/website-modelo-1.jpg", "/media/examples/website-modelo-3.jpg"];

function TemplateShot({ src, address, className = "", priority = false }: { src: string; address: string; className?: string; priority?: boolean }) {
  return (
    <BrowserFrame address={address} className={className}>
      <Image src={src} alt="" width={1200} height={630} sizes="(min-width: 1024px) 360px, 80vw" priority={priority} className="block aspect-[1200/630] w-full object-cover" />
    </BrowserFrame>
  );
}

export function WebsiteMockup({ t }: { t: MockupCopy }) {
  const [left, front, right] = websiteTemplates;
  return (
    <div aria-hidden="true" className="relative mx-auto aspect-[16/13] w-full max-w-lg">
      <div className="absolute inset-[6%] rounded-full bg-[radial-gradient(closest-side,rgb(var(--glow)/0.28),transparent)]" />
      <TemplateShot src={left} address={t.webAddress} className="absolute top-[40%] left-0 w-[50%] -rotate-[5deg]" />
      <TemplateShot src={right} address={t.webAddress} className="absolute top-[40%] right-0 w-[50%] rotate-[5deg]" />
      <TemplateShot src={front} address={`${t.webAddress}/${t.sitePath}`} priority className="absolute top-[2%] left-1/2 z-10 w-[78%] -translate-x-1/2" />
      <Chip className="right-[4%] bottom-[2%]">{t.siteChip}</Chip>
    </div>
  );
}

export function OnlineShopMockup({ t }: { t: MockupCopy }) {
  const products = [
    { name: t.shopProduct1, price: t.shopPrice1, tone: "from-[#c8b46a] to-[#6f6a2a]" },
    { name: t.shopProduct2, price: t.shopPrice2, tone: "from-[#f0c46a] to-[#b77a1e]" },
    { name: t.shopProduct3, price: t.shopPrice3, tone: "from-[#c9774a] to-[#7a3b22]" },
    { name: t.shopProduct4, price: t.shopPrice4, tone: "from-[#e8e1d6] to-[#a99e8e]" },
  ];
  const methods = [t.shopMbway, t.shopMultibanco, t.shopCard];
  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-md pt-12 pb-14">
      <div className="absolute inset-[8%] rounded-full bg-[radial-gradient(closest-side,rgb(var(--glow)/0.28),transparent)]" />
      <BrowserFrame address={`${t.webAddress}/${t.shopPath}`} className="relative mr-[8%]">
        <div className="flex items-center justify-between gap-3 border-b border-[#e7ddd0] bg-white px-4 py-2.5">
          <span className="text-[0.75rem] font-bold">{t.shopBrand}</span>
          <span className={`hidden flex-1 rounded-full bg-[#f4ece1] px-3 py-1 text-[0.6rem] min-[400px]:block ${muted}`}>{t.shopSearch}</span>
          <span className="relative">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 8h14l-1.1 11.6a1.6 1.6 0 0 1-1.6 1.4H7.7a1.6 1.6 0 0 1-1.6-1.4L5 8Z" />
              <path d="M9 10.5V7a3 3 0 0 1 6 0v3.5" />
            </svg>
            <span className="absolute -top-1.5 -right-2 grid h-4 w-4 place-items-center rounded-full bg-[#7a2d60] text-[0.55rem] font-bold text-white">2</span>
          </span>
        </div>
        <div className="flex gap-1.5 px-4 pt-3">
          {[t.shopCat1, t.shopCat2, t.shopCat3].map((category, index) => (
            <span
              key={category}
              className={`rounded-full px-2.5 py-1 text-[0.6rem] font-semibold ${index === 0 ? "bg-[#1d1220] text-white" : "border border-[#e7ddd0] bg-white"}`}
            >
              {category}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2.5 px-4 pt-3 pb-4">
          {products.map((product) => (
            <div key={product.name} className="overflow-hidden rounded-xl border border-[#e7ddd0] bg-white">
              <span className={`block aspect-[5/3] bg-gradient-to-br ${product.tone}`} />
              <span className="flex items-end justify-between gap-1 px-2 py-1.5">
                <span className="flex min-w-0 flex-col">
                  <span className="truncate text-[0.6rem] font-semibold">{product.name}</span>
                  <span className="tabular text-[0.65rem] font-bold">{product.price}</span>
                </span>
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#7a2d60] text-[0.7rem] leading-none font-bold text-white">+</span>
              </span>
            </div>
          ))}
        </div>
      </BrowserFrame>
      <div className={`absolute right-0 bottom-0 z-10 w-[46%] min-w-[9.5rem] rounded-2xl border border-[#e7ddd0] bg-white p-3 shadow-[0_30px_60px_-25px_rgb(var(--shadow-color)/0.6)] ${ink}`}>
        <p className="text-[0.65rem] font-bold">{t.shopPay}</p>
        <ul className="mt-2 flex flex-col gap-1.5">
          {methods.map((method, index) => (
            <li
              key={method}
              className={`flex items-center gap-2 rounded-lg border px-2 py-1.5 text-[0.6rem] font-semibold ${index === 0 ? "border-[#7a2d60] bg-[#f4e4ee]" : "border-[#e7ddd0]"}`}
            >
              <span className={`grid h-3 w-3 place-items-center rounded-full border ${index === 0 ? "border-[#7a2d60]" : "border-[#b9a9bf]"}`}>
                {index === 0 ? <span className="h-1.5 w-1.5 rounded-full bg-[#7a2d60]" /> : null}
              </span>
              {method}
            </li>
          ))}
        </ul>
        <p className={`mt-2 flex justify-between text-[0.6rem] ${muted}`}>
          <span>{t.shopTotal}</span>
          <span className="tabular font-bold text-[#1d1220]">{t.shopTotalValue}</span>
        </p>
        <span className="mt-2 block rounded-full bg-[#1d1220] px-2 py-1.5 text-center text-[0.55rem] leading-tight font-semibold text-white">{t.shopOrder}</span>
      </div>
      <Chip className="top-0 left-0">{t.shopChip}</Chip>
    </div>
  );
}

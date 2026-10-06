"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GoogleG } from "@/components/icons";

/**
 * The pages that belong to one customer's panel: /painel/<slug>, /painel/<slug>/respostas and
 * /painel/<slug>/google (the Google connection page: not a tab, reached from the header's Google
 * bar or badge, so the switcher shows no active tab there).
 */
const panelPath = /^\/painel\/([^/]+)(?:\/(respostas|google))?\/?$/;

function ReplyIcon() {
  return (
    <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M6.5 4h11A2.5 2.5 0 0 1 20 6.5v8a2.5 2.5 0 0 1-2.5 2.5H11l-4.5 3.5V17A2.5 2.5 0 0 1 4 14.5v-8A2.5 2.5 0 0 1 6.5 4Z" />
      <path d="M8.5 9h7M8.5 12.5h4.5" />
    </svg>
  );
}

/**
 * Switcher between a customer's panel features, shown in the panel's sticky header.
 * The header belongs to the /painel root layout, which can't read the [slug] param, so the slug
 * comes from the URL; pages outside a panel render nothing, and the 404 page hides it through
 * its `data-panel-missing` marker (an unknown slug still matches the URL pattern).
 */
export function PanelTabs({ className = "" }: { className?: string }) {
  const match = panelPath.exec(usePathname());
  if (!match) return null;

  const base = `/painel/${match[1]}`;
  const onReplies = match[2] === "respostas";
  const onTab = match[2] !== "google";
  const tabs = [
    { href: base, label: "Análise Google", short: "Análise", icon: <GoogleG size={15} />, active: onTab && !onReplies },
    { href: `${base}/respostas`, label: "Respostas IA", short: "Respostas IA", icon: <ReplyIcon />, active: onReplies },
  ];

  return (
    <nav
      aria-label="Secções do painel"
      className={`relative grid grid-cols-2 rounded-full border border-line bg-surface p-1 [body:has([data-panel-missing])_&]:hidden ${className}`}
    >
      <span
        aria-hidden="true"
        className={`absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-surface-inverse shadow-sm transition-[transform,opacity] duration-300 ease-out motion-reduce:transition-none ${
          onReplies ? "translate-x-full" : ""
        } ${onTab ? "" : "opacity-0"}`}
      />
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          aria-current={tab.active ? "page" : undefined}
          className={`relative inline-flex h-10 min-w-0 items-center justify-center gap-1.5 rounded-full px-2 text-sm font-semibold transition-colors duration-300 min-[360px]:px-3 sm:px-5 ${
            tab.active ? "text-inverse" : "text-muted hover:text-text"
          }`}
        >
          <span className="hidden shrink-0 min-[360px]:inline-flex">{tab.icon}</span>
          {/* Narrow phones: the Google "G" already says Google, so the label drops it instead of being cut. */}
          <span className="truncate">
            <span className="min-[400px]:hidden">{tab.short}</span>
            <span className="hidden min-[400px]:inline">{tab.label}</span>
          </span>
        </Link>
      ))}
    </nav>
  );
}

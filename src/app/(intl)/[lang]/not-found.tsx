import type { Metadata } from "next";
import { NotFoundContent, notFoundTitle } from "@/components/pages/NotFoundContent";
import { fallbackLocale } from "@/lib/i18n";

// Unknown addresses (and unknown languages) get the global 404 (app/global-not-found.tsx): every [lang] page is
// generated ahead (dynamicParams = false), so this boundary only shows if a page calls notFound() itself.
// A not-found file gets no params, so it speaks the fallback language.
export const metadata: Metadata = { title: notFoundTitle(fallbackLocale), robots: { index: false, follow: true } };

export default function NotFound() {
  return <NotFoundContent locale={fallbackLocale} />;
}

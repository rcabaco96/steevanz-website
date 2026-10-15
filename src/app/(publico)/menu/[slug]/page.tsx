import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { preconnect } from "react-dom";
import { VideoMenu } from "@/components/menu/VideoMenu";
import { slugProblem } from "@/lib/video-menus/rules";
import { getPublicMenu, MenusNotReadyError } from "@/lib/video-menus/store";

// A client's digital menu in videos (managed in /admin/menus), opened from a QR code or a link. Only
// active menus with at least one dish; anything else is a 404. Each menu is rendered on its first
// visit and kept, refreshed at once by every save in the admin (and hourly at most otherwise).
export const revalidate = 3600;

/** No menu is built with the site: each one on its first visit. */
export function generateStaticParams(): { slug: string }[] {
  return [];
}

async function loadMenu(slug: string) {
  if (slugProblem(slug)) return null;
  try {
    return await getPublicMenu(slug);
  } catch (error) {
    // Before the menus' migration there's no menu to show; any other failure is a real error.
    if (error instanceof MenusNotReadyError) return null;
    throw error;
  }
}

export async function generateMetadata({ params }: PageProps<"/menu/[slug]">): Promise<Metadata> {
  const menu = await loadMenu((await params).slug);
  return { title: menu ? `Menu · ${menu.business}` : "Menu" };
}

export default async function VideoMenuPage({ params }: PageProps<"/menu/[slug]">) {
  // The players and thumbnails come from these hosts: the connections are open before they're needed.
  for (const host of ["https://www.youtube-nocookie.com", "https://i.ytimg.com", "https://www.google.com"]) preconnect(host);
  const menu = await loadMenu((await params).slug);
  if (!menu) notFound();
  return <VideoMenu menu={menu} />;
}

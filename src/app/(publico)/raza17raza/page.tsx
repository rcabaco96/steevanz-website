import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { preconnect } from "react-dom";
import { VideoMenu } from "@/components/menu/VideoMenu";
import { demoMenu, type VideoMenuData } from "@/content/demo-menu";
import { bunnyHost, menuReferrer } from "@/lib/video-menus/rules";
import { getPublicMenu } from "@/lib/video-menus/store";

// Hidden test page (owner, 2026-10-14): a client's digital menu in videos. Since 2026-10-15 it is the
// menu "raza17raza" of /admin/menus; the static demo it was seeded from stays as the fallback when the
// database can't be read, so the page never breaks. YouTube only: Instagram embeds would not play on
// iPhones, even uncropped. The public modules' layout keeps it out of search engines; it is in no menu
// nor the sitemap.
export const revalidate = 3600;

const slug = "raza17raza";

/** The menu from the database; the static demo when the database can't be read. Null: switched off or deleted. */
async function loadMenu(): Promise<VideoMenuData | null> {
  try {
    return await getPublicMenu(slug);
  } catch (error) {
    console.error("[video-menus] /raza17raza falls back to the static demo:", error instanceof Error ? error.message : error);
    return demoMenu;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const menu = await loadMenu();
  return { title: `Menu · ${menu?.business ?? demoMenu.business}`, referrer: menuReferrer };
}

export default async function DemoVideoMenuPage() {
  // The players and thumbnails come from these hosts: the connections are open before they're needed.
  for (const host of ["https://www.youtube-nocookie.com", "https://i.ytimg.com", "https://www.google.com", bunnyHost()]) if (host) preconnect(host);
  const menu = await loadMenu();
  if (!menu) notFound();
  return <VideoMenu menu={menu} demo />;
}

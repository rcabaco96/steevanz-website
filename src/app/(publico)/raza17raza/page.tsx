import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { preconnect } from "react-dom";
import { VideoMenu } from "@/components/menu/VideoMenu";
import { bunnyHost, menuReferrer, type VideoMenuData } from "@/lib/video-menus/rules";
import { getPublicMenu } from "@/lib/video-menus/store";

// Hidden test page (owner, 2026-10-14): a client's digital menu in videos. Since 2026-10-15 it is the
// menu "raza17raza" of /admin/menus, every dish with its own video on Bunny Stream (YouTube no more,
// 2026-10-16: the static demo of YouTube videos it was seeded from is gone, and the page is a 404 when
// the database can't be read). The public modules' layout keeps it out of search engines; it is in no
// menu nor the sitemap.
export const revalidate = 3600;

const slug = "raza17raza";

/** The menu from the database. Null: switched off, deleted, or the database can't be read (a 404). */
async function loadMenu(): Promise<VideoMenuData | null> {
  try {
    return await getPublicMenu(slug);
  } catch (error) {
    console.error("[video-menus] /raza17raza can't read its menu:", error instanceof Error ? error.message : error);
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const menu = await loadMenu();
  return { title: menu ? `Menu · ${menu.business}` : "Menu", referrer: menuReferrer };
}

export default async function DemoVideoMenuPage() {
  // The videos and their pictures come from Bunny: the connection is open before they're needed.
  const bunny = bunnyHost();
  if (bunny) preconnect(bunny);
  const menu = await loadMenu();
  if (!menu) notFound();
  return <VideoMenu menu={menu} demo />;
}

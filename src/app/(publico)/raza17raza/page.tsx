import type { Metadata } from "next";
import { preconnect } from "react-dom";
import { VideoMenu } from "@/components/menu/VideoMenu";
import { demoMenu } from "@/content/demo-menu";

// Hidden test page (owner, 2026-10-14): a client's digital menu in videos, static for now (the menus
// get a database later). YouTube only: Instagram embeds would not play on iPhones, even uncropped.
// The public modules' layout keeps it out of search engines; it is in no menu nor the sitemap.
export const metadata: Metadata = { title: `Menu · ${demoMenu.business}` };

export default function DemoVideoMenuPage() {
  // The players and thumbnails come from these hosts: the connections are open before they're needed.
  for (const host of ["https://www.youtube-nocookie.com", "https://i.ytimg.com", "https://www.google.com"]) preconnect(host);
  return <VideoMenu menu={demoMenu} />;
}

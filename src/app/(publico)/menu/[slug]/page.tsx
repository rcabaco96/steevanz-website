import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { preconnect } from "react-dom";
import { VideoMenu } from "@/components/menu/VideoMenu";
import { bunnyHost, hasPublicDemoOrdering, isDemoMenu, menuReferrer, slugProblem } from "@/lib/video-menus/rules";
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

// Link previews (WhatsApp, Facebook…) read the Open Graph tags. This layout has no metadataBase,
// so the URLs are absolute. Demo menus are shared as Steevanz's free demo, with its own picture;
// a client's menu gets its own name and no Steevanz picture.
const siteOrigin = "https://www.steevanz.com";

export async function generateMetadata({ params }: PageProps<"/menu/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const menu = await loadMenu(slug);
  if (!menu) return { title: "Menu", referrer: menuReferrer };
  const url = `${siteOrigin}/menu/${slug}`;
  if (isDemoMenu(slug)) {
    const description = "Cada prato em vídeo e pedidos feitos na mesa.";
    const image = { url: `${siteOrigin}/og/og-menu-steevanz.jpg`, width: 1200, height: 630, alt: "Menu digital em vídeo da Steevanz" };
    return {
      title: "Demonstração grátis · Menu digital Steevanz",
      description,
      referrer: menuReferrer,
      openGraph: { type: "website", url, siteName: "Steevanz", locale: "pt_PT", title: "Demonstração grátis do menu digital", description, images: [image] },
      twitter: { card: "summary_large_image", title: "Demonstração grátis do menu digital", description, images: [image.url] },
    };
  }
  const title = `Menu · ${menu.business}`;
  const description = `O menu de ${menu.business}, com cada prato em vídeo.`;
  return { title, description, referrer: menuReferrer, openGraph: { type: "website", url, title, description } };
}

export default async function VideoMenuPage({ params }: PageProps<"/menu/[slug]">) {
  // The videos and their pictures come from Bunny: the connection is open before they're needed.
  const bunny = bunnyHost();
  if (bunny) preconnect(bunny);
  const { slug } = await params;
  const menu = await loadMenu(slug);
  if (!menu) notFound();
  // A demo menu may take demo orders here: each visitor's own, kept in their tab (never on the server).
  return <VideoMenu menu={menu} demo={isDemoMenu(slug)} ordering={hasPublicDemoOrdering(slug, menu.ordering) ? { demo: true, slug } : undefined} />;
}

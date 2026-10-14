import type { Metadata } from "next";
import { preconnect } from "react-dom";
import { ShortsCollection } from "@/components/marketing/YouTubeShorts";
import { Section, SectionHeader } from "@/components/ui/Section";
import { showcaseCollections } from "@/content/showcase-youtube";
import { loadPlaylist } from "@/lib/youtube/feed";

// Hidden test page (owner, 2026-10-14): YouTube only (Instagram embeds would not play on iPhones,
// even uncropped). Not in the menus, the sitemap or search engines. The playlists are read again at
// most once an hour.
export const metadata: Metadata = {
  title: "Vídeos",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export const revalidate = 3600;

export default async function YouTubeReelsPage() {
  for (const host of ["https://www.youtube-nocookie.com", "https://i.ytimg.com", "https://www.google.com"]) preconnect(host);
  const collections = await Promise.all(
    showcaseCollections.map(async (collection) => ({ collection, playlist: await loadPlaylist(collection.playlistId) })),
  );
  return (
    <Section labelledBy="videos-title">
      <SectionHeader as="h1" id="videos-title" eyebrow="Vídeos" title="Os vídeos dos nossos clientes" lead="Coleções organizadas no YouTube pelo próprio negócio: cada playlist é uma coleção." />
      {collections.map(({ collection, playlist }) => (
        <section key={collection.playlistId} aria-label={collection.title ?? playlist?.title ?? "Coleção"} className="mt-12 flex flex-col gap-5">
          <h2 className="display text-2xl sm:text-3xl">{collection.title ?? playlist?.title ?? "Coleção"}</h2>
          {playlist?.videos.length ? (
            <ShortsCollection videos={playlist.videos.map(({ id, title }) => ({ id, title }))} channel={playlist.channel} />
          ) : (
            <p className="text-muted">Não foi possível ler esta playlist do YouTube agora.</p>
          )}
        </section>
      ))}
    </Section>
  );
}

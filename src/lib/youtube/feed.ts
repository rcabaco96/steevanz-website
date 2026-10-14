/**
 * A public YouTube playlist read from YouTube's own RSS feed: no API key, no sign-in, free. It lists
 * the latest 15 videos. Every channel also has a «Shorts only» playlist: "UUSH" + its channel id
 * without the leading "UC" (checked on 2026-10-14).
 */
export interface YouTubeVideo {
  id: string;
  title: string;
  publishedAt: string;
}

export interface YouTubePlaylist {
  title: string;
  channel: string;
  videos: YouTubeVideo[];
}

const unescape = (text: string) =>
  text.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");

const tag = (xml: string, name: string) => unescape(xml.match(new RegExp(`<${name}>([^<]*)</${name}>`))?.[1] ?? "").trim();

/** Null when the playlist doesn't exist, is private or YouTube doesn't answer. */
export async function loadPlaylist(playlistId: string): Promise<YouTubePlaylist | null> {
  try {
    const response = await fetch(`https://www.youtube.com/feeds/videos.xml?playlist_id=${encodeURIComponent(playlistId)}`, { next: { revalidate: 3600 } });
    if (!response.ok) return null;
    const xml = await response.text();
    const [head, ...entries] = xml.split("<entry>");
    const videos = entries.flatMap((entry) => {
      const id = tag(entry, "yt:videoId");
      return id ? [{ id, title: tag(entry, "title"), publishedAt: tag(entry, "published") }] : [];
    });
    const channel = tag(entries[0] ?? "", "name") || tag(head, "name");
    return { title: tag(head, "title"), channel, videos };
  } catch {
    return null;
  }
}

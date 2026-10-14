/**
 * Collections of the hidden YouTube test page /raza17raza-yt (owner, 2026-10-14): one public YouTube
 * playlist per collection, so the client organises the menu in YouTube itself. Temporary sample to
 * compare with the Instagram page: the Shorts of the public «Tasty» recipe channel, until a client
 * has a channel. Replace with the client's playlists.
 */
export interface ShowcaseCollection {
  /** Shown above the videos; the playlist's own title when absent. */
  title?: string;
  playlistId: string;
}

export const showcaseCollections: ShowcaseCollection[] = [{ title: "Receitas (exemplo: canal Tasty)", playlistId: "UUSHJFp8uSYCjXOMnkUyb3CQ3Q" }];

/**
 * Collections of the hidden test page /raza17raza (owner, 2026-10-14): one public YouTube playlist
 * per collection, so the client organises the menu in YouTube itself. Temporary sample: the Shorts
 * of the public «Tasty» recipe channel, until a client has a channel. Replace with the client's
 * playlists.
 */
export interface ShowcaseCollection {
  /** Shown above the videos; the playlist's own title when absent. */
  title?: string;
  playlistId: string;
}

export const showcaseCollections: ShowcaseCollection[] = [{ title: "Receitas (exemplo: canal Tasty)", playlistId: "UUSHJFp8uSYCjXOMnkUyb3CQ3Q" }];

/**
 * A dish's old Bunny video (replaced, or its dish or menu deleted) is deleted only a day later (owner,
 * 2026-10-19): menus already open on a phone, and pages still cached, kept showing its id and picture,
 * and Safari drew its broken-picture «?» when it was deleted at once. Until then it waits in the
 * library with its title saying when it may go; the scheduler tick deletes it (cleanupBunnyVideos).
 */
export const bunnyDeletionGraceHours = 24;

const mark = "steevanz: apagar depois de ";

/** The title that marks a video for deletion after `dueAt`. */
export function bunnyDeletionTitle(dueAt: Date): string {
  return `${mark}${dueAt.toISOString()}`;
}

/** The search that finds the marked videos in the library. */
export const bunnyDeletionSearch = mark.trim();

/** A marked video whose moment has come (false for any other title). */
export function bunnyDeletionDue(title: string | null | undefined, now: Date): boolean {
  if (!title?.startsWith(mark)) return false;
  const due = Date.parse(title.slice(mark.length).trim());
  return Number.isFinite(due) && due <= now.getTime();
}

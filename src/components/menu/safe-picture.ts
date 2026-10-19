import type { SyntheticEvent } from "react";

/**
 * A menu's picture that fails to load hides, leaving the box's own background: never Safari's
 * broken-picture glyph (a blue «?» on black, owner's iPhone, 2026-10-19). It happened when a dish's
 * video was replaced on Bunny and the old one (and its picture) was deleted while a page still showed it.
 */
export const pictureGuard = {
  onError: (event: SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.style.visibility = "hidden";
  },
  onLoad: (event: SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.style.removeProperty("visibility");
  },
};

/** The same for a picture that had already failed before the page's code ran (the page's own HTML). */
export function hideIfBroken(image: HTMLImageElement | null) {
  if (image && image.complete && image.getAttribute("src") && !image.naturalWidth) image.style.visibility = "hidden";
}

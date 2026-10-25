// Product photos saved in public/media/clients/o-quintal/produtos/ — written by scripts/o-quintal/fetch-images.mjs,
// which downloads each product's photo from o-quintal.com (`sourceImage` in ./products.ts). A product missing here
// shows the shop's neutral placeholder. Empty on 2026-10-25: the build machine could not reach o-quintal.com's
// image server, so the owner runs the script once from his PC (see the report).
// Kept free of imports so the unit tests can load it directly.

export interface OQuintalLocalImage {
  src: string;
  width: number;
  height: number;
}

export const oQuintalLocalImages: Readonly<Record<string, OQuintalLocalImage>> = {};

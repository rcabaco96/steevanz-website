// hls.js ships no types for its light build: the same API as the full one, without subtitles,
// alternative audio, DRM and a few other features.
declare module "hls.js/light" {
  export * from "hls.js";
  export { default } from "hls.js";
}

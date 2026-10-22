import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { colorsFromRgb, contrast, neutralMenuColors, pickLogoColor } from "../src/lib/video-menus/logo-colors.ts";

const px = (...colors) => colors.flatMap(([r, g, b, a = 255, n = 1]) => Array.from({ length: n }, () => [r, g, b, a]).flat());
const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

describe("menu colours from the logo (owner, 2026-10-22)", () => {
  it("picks the logo's main colour, not its white letters nor the transparent background", () => {
    // O Ermita: cream letters on cobalt.
    const color = pickLogoColor(px([19, 40, 90, 255, 300], [246, 241, 231, 255, 80], [0, 0, 0, 0, 200]));
    assert.deepEqual(color, [19, 40, 90]);
  });

  it("picks the most present hue, weighted by colour", () => {
    const color = pickLogoColor(px([200, 40, 110, 255, 120], [30, 140, 60, 255, 40], [255, 255, 255, 255, 400]));
    assert.deepEqual(color, [200, 40, 110]);
  });

  it("a black-and-white logo gives its ink; an empty one gives nothing", () => {
    assert.deepEqual(pickLogoColor(px([20, 20, 20, 255, 100], [255, 255, 255, 255, 300])), [20, 20, 20]);
    assert.equal(pickLogoColor(px([255, 255, 255, 255, 50], [0, 0, 0, 0, 50])), null);
  });

  it("makes the accent readable: white text on buttons, light text on the dark theme", () => {
    for (const color of [[250, 210, 60], [120, 200, 255], [19, 40, 90], [194, 61, 122]]) {
      const c = colorsFromRgb(color);
      assert.ok(contrast(rgb(c.accent), [255, 255, 255]) >= 4.5, `${c.accent} on white`);
      assert.ok(contrast(rgb(c.accentOnDark), [0x12, 0x0a, 0x14]) >= 4.5, `${c.accentOnDark} on dark`);
    }
    assert.equal(colorsFromRgb([19, 40, 90]).accent, "#13285a");
  });

  it("never falls back to another business's pink", () => {
    assert.notEqual(neutralMenuColors.accent.toLowerCase(), "#c23d7a");
  });
});

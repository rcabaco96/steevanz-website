// The signature shape of Platibanda's site: the front of an Algarve house crowned by its platibanda — the decorated
// parapet that hides the roof — with a baroque curve in the middle and two short posts topped by finials («pinhas»)
// at the shoulders. The same outline is the logo, the mask the hero film closes into, the frame of each house in the
// street and the door the opening walks through.

export type Point = readonly [number, number];

/** Where the shoulders and the posts sit, as fractions of the height from the top. */
export const facadeShoulder = 0.26;
export const facadePost = 0.17;
/** The two posts, as fractions of the width (left post; the right one mirrors it). */
export const facadePostX: readonly [number, number] = [0.07, 0.13];

/** The outline in a unit box (x and y from 0 to 1), clockwise from the bottom-left corner. 24 points. */
export function facadeUnit(): Point[] {
  const s = facadeShoulder;
  const p = facadePost;
  const [a, b] = facadePostX;
  const pts: Point[] = [
    [0, 1],
    [0, s],
    [a, s],
    [a, p],
    [b, p],
    [b, s],
    [0.2, s],
  ];
  // The baroque curve between the posts: rises smoothly to the apex and back.
  for (let k = 1; k < 12; k++) {
    const t = k / 12;
    const bump = 0.5 - 0.5 * Math.cos(2 * Math.PI * t);
    pts.push([0.2 + 0.6 * t, s * (1 - bump)]);
  }
  pts.push([0.8, s], [1 - b, s], [1 - b, p], [1 - a, p], [1 - a, s], [1, s], [1, 1]);
  return pts;
}

const fmt = (n: number) => Number(n.toFixed(2));

/** The outline placed in a box (any units). */
export function facadeIn(left: number, top: number, right: number, bottom: number): Point[] {
  const w = right - left;
  const h = bottom - top;
  return facadeUnit().map(([x, y]) => [fmt(left + x * w), fmt(top + y * h)] as const);
}

/** A CSS polygon() from points in percent. */
export function polygon(points: readonly Point[]): string {
  return `polygon(${points.map(([x, y]) => `${x}% ${y}%`).join(", ")})`;
}

/** The same 24 points flattened onto a full rectangle (every top point on the top edge): the start of a morph. */
export function facadeFlat(): Point[] {
  return facadeUnit().map(([x, y]) => [fmt(x * 100), y === 1 ? 100 : 0] as const);
}

/** An SVG path «d» for the outline in a box. */
export function facadePath(left: number, top: number, right: number, bottom: number): string {
  const pts = facadeIn(left, top, right, bottom);
  return `M${pts.map(([x, y]) => `${x} ${y}`).join("L")}Z`;
}

/** The finials' centres in a box (one on each post). */
export function finialsIn(left: number, top: number, right: number, bottom: number): [Point, Point] {
  const w = right - left;
  const h = bottom - top;
  const [a, b] = facadePostX;
  const cx = (a + b) / 2;
  const y = fmt(top + facadePost * h - 0.035 * h);
  return [
    [fmt(left + cx * w), y],
    [fmt(left + (1 - cx) * w), y],
  ];
}

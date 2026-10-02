import { ImageResponse } from "next/og";
import { flowerMarkSvg } from "@/components/lab/FlowerMark";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Home-screen icon: the Steevanz flower mark, full-bleed (iOS rounds the corners). */
export default function AppleIcon() {
  const svg = flowerMarkSvg(180).replace('class="fm"', 'xmlns="http://www.w3.org/2000/svg"').replace('rx="9"', 'rx="0"');
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#562650" }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- rendered to PNG by next/og */}
        <img width={180} height={180} alt="" src={`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`} />
      </div>
    ),
    size,
  );
}
